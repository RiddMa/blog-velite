import { defineCollection, defineConfig, s } from "velite";

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
      content: s.markdown(), // transform markdown to html
      excerpt: s.excerpt(), // excerpt of markdown content
      toc: s.toc(), // table of contents of markdown content
      metadata: s.metadata(), // extract markdown reading-time, word-count, etc.
      author: s.string(),
      columns: s.array(s.string()),
      categories: s.array(s.string()),
      tags: s.array(s.string()),
    })
    // more additional fields (computed fields)
    .transform((data) => ({
      ...data,
      permalink: `/posts/${data.slug}`,
      // authorLink: `/authors/${data.author}`,
      // categoryLinks: data.categories.reduce((acc, categoryName) => {
      //   acc[categoryName] = `/categories/${categoryName}`;
      //   return acc;
      // }, {}),
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
    .transform((data) => ({ ...data, permalink: `/authors/${data.slug}` })),
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
    .transform((data) => ({ ...data, permalink: `/columns/${data.slug}` })),
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
    .transform((data) => ({ ...data, permalink: `/categories/${data.slug}` })),
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
    .transform((data) => ({ ...data, permalink: `/tags/${data.slug}` })),
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
