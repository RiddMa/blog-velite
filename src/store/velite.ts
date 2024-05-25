import {
  posts,
  Post,
  authors,
  Author,
  columns,
  Column,
  categories,
  Category,
  tags,
  Tag,
  Page,
  pages,
  galleries,
  Gallery,
} from "@/.velite";

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

export function getPostsByColumn(column: string): typeof posts {
  return posts.filter((post) => post.columns.includes(column));
}

export function getPostsByCategory(category: string): typeof posts {
  return posts.filter((post) => post.categories.includes(category));
}

export function getPostsByAuthor(author: string): typeof posts {
  return posts.filter((post) => post.author.includes(author));
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((author) => author.slug === slug);
}

export function getColumnBySlug(slug: string): Column | undefined {
  return columns.find((column) => column.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((tag) => tag.slug === slug);
}

export function getPageBySlug(slug: string): Page | undefined {
  return pages.find((page) => page.slug === slug);
}

export function getGalleryBySlug(slug: string): Gallery | undefined {
  return galleries.find((gallery) => gallery.slug === slug);
}
