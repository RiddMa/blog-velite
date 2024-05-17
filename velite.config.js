import { defineCollection, defineConfig, s } from "velite";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkEmoji from "remark-emoji";
import rehypeStringify from "rehype-stringify";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import path from "node:path";
import { projectRootPath, staticBasePath } from "@/base-path";
import { generateExcerptForMarkdown, generateSlugForTags } from "@/src/util/llm";
import fs from "fs/promises";
import matter from "gray-matter";
import dayjs from "dayjs";
import { listFiles, mergePostsTags, mergeTags, parseMarkdown, postProcessMarkdownImages } from "@/src/util/veliteUtils";

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
    metadata: s.object({
      title: s
        .object({ default: s.string(), template: s.string() })
        .default({ default: "My Blog", template: "%s | My Blog" }),
      description: s.string().default("Welcome to my blog."),
      authors: s.array(s.object({ name: s.string(), url: s.string().url().optional() })).default([]),
      keywords: s.array(s.string()).default([]),
      openGraph: s
        .object({
          title: s
            .object({ default: s.string(), template: s.string() })
            .default({ default: "My Blog", template: "%s | My Blog" }),
          description: s.string().default("Welcome to my blog."),
          url: s.string().optional(),
          siteName: s.string().default("My Blog"),
          images: s
            .array(
              s.object({
                url: s.string().url(), // Must be an absolute URL
                width: s.number(),
                height: s.number(),
                alt: s.string().optional(),
              }),
            )
            .optional(),
          locale: s.string().optional(),
          type: s.string().optional(),
        })
        .default({}),
    }),
    social: s
      .object({
        github: s.string(),
      })
      .optional(),
    topNavItems: s.array(s.object({ label: s.string(), href: s.string(), icon: s.string() })),
  }),
};

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
      created: s.isodate().optional(), // input Date-like string, output ISO Date string.
      updated: s.isodate().optional(),
      cover: s.image().optional(), // input image relative path, output image object with blurImage.
      excerpt: s.excerpt().default(""),
      author: s.string().default(""),
      content: blogMarkdown,
      raw: s.raw(),
      path: s.path(),
      toc: s.toc(),
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
    })
    .transform(async (data) => ({
      ...data,
      permalink: `/${data.slug}`,
      images: {},
    })),
});

const posts = defineCollection({
  name: "Post", // collection type name
  pattern: "posts/**/*.md", // content files glob pattern
  schema: s
    .object({
      title: s.string(), // Zod primitive type
      slug: s.slug("posts"), // validate format, unique in posts collection
      created: s.isodate().optional(), // input Date-like string, output ISO Date string.
      updated: s.isodate().optional(),
      draft: s.boolean().default(false),
      featured: s.boolean().default(false),
      cover: s.image().optional(), // input image relative path, output image object with blurImage.
      excerpt: s.string().default(""),
      author: s.string().default(""),
      columns: s.array(s.string()).default([]),
      categories: s.array(s.string()).default([]),
      tags: s.array(s.string()).default([]),
      content: blogMarkdown,
      raw: s.raw(),
      path: s.path(),
      toc: s.toc(), // table of contents of markdown content
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
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

const tagDictName = "tags/tag-dict.json";
const tagDict = defineCollection({
  name: "TagDict",
  pattern: tagDictName,
  single: true,
  schema: s.record(s.string()),
});

const veliteRoot = "content";

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.
export default defineConfig({
  root: veliteRoot,
  collections: {
    globals,
    pages,
    posts,
    authors,
    columns,
    categories,
    tags,
    tagDict,
  },
  prepare: async (data) => {
    try {
      // Generate tag slug for unknown tags in posts using LLM API
      const tagsFromPosts = mergePostsTags(data.posts);
      const filteredTags = tagsFromPosts.filter((tag) => !(tag in data.tagDict));

      if (filteredTags.length === 0) {
        console.log("No filtered tags found, skipping LLM slug generation.");
      } else {
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
      }

      // Merge tags from posts with manually defined tags
      data.tags = mergeTags(
        data.tags,
        tagsFromPosts.map((tag) => ({ name: tag, slug: data.tagDict[tag] })),
      );

      // Process posts, generate excerpt using LLM, generate dates and update frontmatter
      await Promise.all(
        data.posts.map(async (post, index) => {
          let modified = false;
          if (!post.created) {
            data.posts[index].created = dayjs().format();
            modified = true;
          }
          if (!post.updated) {
            data.posts[index].updated = dayjs().format();
            modified = true;
          }
          if (post.excerpt === "") {
            console.log("Post sent to LLM for excerpt generation:", post.title);
            data.posts[index].excerpt = await generateExcerptForMarkdown(post.raw);
            modified = true;
          }
          if (modified) {
            const filePath = path.join(projectRootPath, veliteRoot, `${post.path}.md`);
            const fileContent = await fs.readFile(filePath, "utf8"); // Read the markdown file
            const { content, data: frontmatter } = matter(fileContent); // Parse the frontmatter using gray-matter

            frontmatter.created = data.posts[index].created; // Update the created date in the frontmatter
            frontmatter.updated = data.posts[index].updated; // Update the updated date in the frontmatter
            frontmatter.excerpt = data.posts[index].excerpt; // Update the excerpt in the frontmatter

            const updatedContent = matter.stringify(content, frontmatter); // Stringify the updated content
            await fs.writeFile(filePath, updatedContent); // Write the updated content back to the file
          }
        }),
      );

      // Parse excerpt markdown to HTML for posts
      await Promise.all(
        data.posts.map(async (post, index) => {
          data.posts[index].excerptRaw = post.excerpt;
          data.posts[index].excerpt = await parseMarkdown(post.excerpt);
        }),
      );

      // Process pages, generate excerpt using LLM, generate dates and update frontmatter
      await Promise.all(
        data.pages.map(async (page, index) => {
          let modified = false;
          if (!page.created) {
            data.pages[index].created = dayjs().format();
            modified = true;
          }
          if (!page.updated) {
            data.pages[index].updated = dayjs().format();
            modified = true;
          }
          if (page.excerpt === "") {
            console.log("Page sent to LLM for excerpt generation:", page.title);
            data.pages[index].excerpt = await generateExcerptForMarkdown(page.raw);
            modified = true;
          }
          if (modified) {
            const filePath = path.join(projectRootPath, veliteRoot, `${page.path}.md`);
            const fileContent = await fs.readFile(filePath, "utf8"); // Read the markdown file
            const { content, data: frontmatter } = matter(fileContent); // Parse the frontmatter using gray-matter

            frontmatter.created = data.pages[index].created; // Update the created date in the frontmatter
            frontmatter.updated = data.pages[index].updated; // Update the updated date in the frontmatter
            frontmatter.excerpt = data.pages[index].excerpt; // Update the excerpt in the frontmatter

            const updatedContent = matter.stringify(content, frontmatter); // Stringify the updated content
            await fs.writeFile(filePath, updatedContent); // Write the updated content back to the file
          }
        }),
      );

      // Parse excerpt markdown to HTML for pages
      await Promise.all(
        data.pages.map(async (page, index) => {
          data.pages[index].excerptRaw = page.excerpt;
          data.pages[index].excerpt = await parseMarkdown(page.excerpt);
        }),
      );
    } catch (error) {
      console.error("Error:", error);
    }

    // Sort the posts array by the updated date in descending order
    data.posts.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
  },
  complete: async (data) => {
    try {
      // Post-processing for markdown images, generate height and width for images.
      const files = await listFiles(path.join(staticBasePath, "static"));
      console.log("Images:", files);
      await postProcessMarkdownImages(path.join(projectRootPath, ".velite", "posts.json"), staticBasePath);
      await postProcessMarkdownImages(path.join(projectRootPath, ".velite", "pages.json"), staticBasePath);
    } catch (error) {
      console.error("Error:", error);
    }
  },
});
