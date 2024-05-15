import { defineCollection, defineConfig, s } from "velite";

import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkParse from "remark-parse";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkDirective from "remark-directive";

import rehypeStringify from "rehype-stringify";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { listFiles, mergePostsTags, mergeTags, parseMarkdown, postProcessMarkdownImages } from "@/src/util/util";
import path from "node:path";
import { projectRootPath, staticBasePath } from "@/base-path";
import { generateExcerptForPost, generateSlugForTags } from "@/src/util/llm";
import fs from "fs/promises";
import matter from "gray-matter";

const blogMarkdown = s.markdown({
  gfm: true,
  removeComments: false,
  copyLinkedFiles: true,
  remarkPlugins: [
    remarkParse,
    remarkBreaks,
    remarkFrontmatter,
    remarkGfm,
    remarkMath,
    remarkEmoji,
    remarkDirective,
    remarkDirectiveRehype,
  ],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypeStringify],
});

const globals = {
  name: "Global",
  pattern: "globals/*.json",
  single: true,
  schema: s.object({
    siteName: s.string(),
    siteNameDescription: s.string(),
    social: s
      .object({
        github: s.string(),
      })
      .optional(),
    topNavItems: s.array(s.object({ label: s.string(), href: s.string(), icon: s.string() })),
  }),
};

const posts = defineCollection({
  name: "Post", // collection type name
  pattern: "posts/**/*.md", // content files glob pattern
  schema: s
    .object({
      title: s.string(), // Zod primitive type
      slug: s.slug("posts"), // validate format, unique in posts collection
      created: s.isodate(), // input Date-like string, output ISO Date string.
      updated: s.isodate(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      cover: s.image().optional(), // input image relative path, output image object with blurImage.
      content: blogMarkdown,
      raw: s.raw(),
      path: s.path(),
      excerpt: s.string().default(""),
      toc: s.toc(), // table of contents of markdown content
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
      author: s.string(),
      columns: s.array(s.string()),
      categories: s.array(s.string()),
      tags: s.array(s.string()).default([]),
    })
    .transform(async (data) => ({
      ...data,
      permalink: `/post/${data.slug}`,
      images: {},
    })),
});

const authors = defineCollection({
  name: "Author",
  pattern: "authors/**/*.md",
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("authors"),
      bio: blogMarkdown,
      avatar: s.image().optional(),
      social: s
        .object({
          github: s.string(),
        })
        .optional(),
    })
    .transform((data) => ({ ...data, permalink: `/author/${data.slug}` })),
});

const columns = defineCollection({
  name: "Column",
  pattern: "columns/**/*.md",
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("columns"),
      description: blogMarkdown,
    })
    .transform((data) => ({ ...data, permalink: `/column/${data.slug}` })),
});

const categories = defineCollection({
  name: "Category",
  pattern: ["categories/**/*.yaml", "categories/**/*.yml"],
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("categories"),
      description: s.string(),
    })
    .transform((data) => ({ ...data, permalink: `/category/${data.slug}` })),
});

const tags = defineCollection({
  name: "Tag",
  pattern: ["tags/**/*.yaml", "tags/**/*.yml"],
  schema: s.object({
    name: s.string(),
    slug: s.slug("tags"),
  }),
});

const tagDictName = "tagDict.json";
const tagDict = defineCollection({
  name: "TagDict",
  pattern: tagDictName,
  single: true,
  schema: s.record(s.string()),
});

const pages = defineCollection({
  name: "Page",
  pattern: "pages/**/*.md",
  schema: s
    .object({
      title: s.string(),
      slug: s.slug("global", [
        "post",
        "posts",
        "author",
        "authors",
        "column",
        "columns",
        "category",
        "categories",
        "tag",
        "tags",
      ]),
      content: blogMarkdown,
      raw: s.raw(),
      path: s.path(),
      created: s.isodate(), // input Date-like string, output ISO Date string.
      updated: s.isodate(),
      cover: s.image().optional(), // input image relative path, output image object with blurImage.
      excerpt: s.excerpt().default(""),
      toc: s.toc(),
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
      author: s.string(),
    })
    .transform(async (data) => ({
      ...data,
      permalink: `/${data.slug}`,
      images: {},
    })),
});

const veliteRoot = "content";

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.
export default defineConfig({
  root: veliteRoot,
  collections: {
    globals,
    posts,
    authors,
    columns,
    categories,
    tags,
    tagDict,
    pages,
  },
  prepare: async (data) => {
    // Sort the posts array by the updated date in descending order
    data.posts.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

    try {
      const tagsFromPosts = mergePostsTags(data.posts);
      const filteredTags = tagsFromPosts.filter((tag) => !(tag in data.tagDict));
      if (filteredTags.length > 0) {
        console.log("Filtered tags send to LLM for slug generation:", filteredTags);
        const slugs = await generateSlugForTags(filteredTags);
        console.log("LLM generated slugs:", slugs);
        for (let i = 0; i < filteredTags.length; i++) {
          data.tagDict[filteredTags[i]] = slugs[i];
          data.tagDict[slugs[i]] = filteredTags[i];
        }

        await fs.writeFile(
          path.join(projectRootPath, veliteRoot, tagDictName),
          JSON.stringify(data.tagDict, null, 2),
          "utf8",
        ); // Write tagDict back to content/tagDict.json
      } else {
        console.log("No filtered tags found, skipping LLM slug generation.");
      }

      data.tags = mergeTags(
        data.tags,
        tagsFromPosts.map((tag) => ({ name: tag, slug: data.tagDict[tag] })),
      );

      await Promise.all(
        data.posts.map(async (post, index) => {
          if (post.excerpt === "") {
            console.log("Post sent to LLM for excerpt generation:", post.title);
            data.posts[index].excerpt = await generateExcerptForPost(post.raw);

            const filePath = path.join(projectRootPath, veliteRoot, `${post.path}.md`);
            const fileContent = await fs.readFile(filePath, "utf8"); // Read the markdown file
            const { content, data: frontmatter } = matter(fileContent); // Parse the frontmatter using gray-matter
            frontmatter.excerpt = data.posts[index].excerpt; // Update the excerpt in the frontmatter
            const updatedContent = matter.stringify(content, frontmatter); // Stringify the updated content
            await fs.writeFile(filePath, updatedContent); // Write the updated content back to the file
          }
        }),
      );

      await Promise.all(
        data.posts.map(async (post, index) => {
          data.posts[index].excerpt = await parseMarkdown(post.excerpt);
        }),
      );
    } catch (error) {
      console.error("Error:", error);
    }
  },
  complete: async (data) => {
    try {
      const files = await listFiles(path.join(staticBasePath, "static"));
      console.log("Images:", files);
      await postProcessMarkdownImages(path.join(projectRootPath, ".velite", "posts.json"), staticBasePath);
      await postProcessMarkdownImages(path.join(projectRootPath, ".velite", "pages.json"), staticBasePath);
    } catch (error) {
      console.error("Error:", error);
    }
  },
});
