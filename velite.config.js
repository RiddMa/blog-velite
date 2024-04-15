import { defineCollection, defineConfig, s } from "velite";
import { unified } from "unified";

import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkDirective from "remark-directive";

import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";
import rehypePresetMinify from "rehype-preset-minify";

const parseMarkdown2VFile = async (content) => {
  let result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .process(content);

  return result.toString();
};

const parseVFile2Html = async (raw) => {
  let result = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkEmoji)
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    // .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeKatex)
    .use(rehypePresetMinify)
    .use(rehypeStringify)
    .process(raw);
  return result.toString();
};

const parseHtml2Html = async (raw) => {
  let result = await unified()
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeKatex)
    .use(rehypePresetMinify)
    .use(rehypeStringify)
    .process(raw);
  return result.toString();
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
    // more additional fields (computed fields)
    .transform(async (data) => ({
      ...data,
      permalink: `/post/${data.slug}`,
      // remarkVFile: await parseMarkdown2VFile(data.raw),
      html: await parseVFile2Html(data.raw),
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
    posts,
    authors,
    columns,
    categories,
    tags,
  },
});
