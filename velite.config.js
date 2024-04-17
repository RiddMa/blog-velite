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
import { extractImg } from "@/src/util/util";

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
      content: s.markdown({
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
        ],
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypePresetMinify, rehypeStringify],
      }), // transform markdown to html
      raw: s.raw(), // raw markdown content
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
      images: await extractImg(data.content),
    })),
});

const authors = defineCollection({
  name: "Author",
  pattern: "authors/**/*.md",
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("authors"),
      bio: s.string(),
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
  pattern: ["columns/**/*.md", "columns/**/*.md"],
  schema: s
    .object({
      name: s.string(),
      slug: s.slug("columns"),
      description: s.markdown(),
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

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.
export default defineConfig({
  collections: {
    globals,
    posts,
    authors,
    columns,
    categories,
    tags,
  },
  prepare: async (data) => {
    // console.log("Preparing data...");
    // console.log(JSON.stringify(data, null, 2));
  },
});
