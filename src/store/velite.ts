import { posts, Post, authors, Author, categories, Category, tags, Tag } from "@/.velite";

// interface VeliteState {
//   posts: typeof posts;
//   getPostBySlug(slug: string): Post | undefined;
//   authors: typeof authors;
//   getAuthorBySlug(slug: string): Author | undefined;
//   categories: typeof categories;
//   getCategoryBySlug(slug: string): Category | undefined;
//   tags: typeof tags;
//   getTagBySlug(slug: string): Tag | undefined;
// }

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((tag) => tag.slug === slug);
}
