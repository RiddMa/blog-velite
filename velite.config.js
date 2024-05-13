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
import rehypePresetMinify from "rehype-preset-minify";
import { extractImg, listFiles, postProcessMarkdownImages } from "@/src/util/util";
import path from "node:path";
import { projectRootPath, staticBasePath } from "@/base-path";

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
      excerpt: s.excerpt(), // excerpt of markdown content
      toc: s.toc(), // table of contents of markdown content
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
      author: s.string(),
      columns: s.array(s.string()),
      categories: s.array(s.string()),
      tags: s.array(s.string()),
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
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("tags"),
      description: s.string(),
    })
    .transform((data) => ({ ...data, permalink: `/tag/${data.slug}` })),
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
      excerpt: s.excerpt(),
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
    pages,
  },
  prepare: async (data) => {
    // try {
    //   const files = await listFiles(path.join(staticBasePath, "static"));
    //   console.log("Files:", files);
    // } catch (error) {
    //   console.error("Error:", error);
    // }
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
