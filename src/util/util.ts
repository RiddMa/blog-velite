import { unified } from "unified";
import { visit } from "unist-util-visit";
import path from "node:path";
import { staticBasePath } from "@/base-path";
import fs from "fs/promises";
// import sharp from "sharp";
import { Post, Tag, tagDict } from "@/.velite";
import remarkParse from "remark-parse";

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function assertDefined<T>(val: T | undefined): asserts val is T {
  if (val === undefined) {
    throw new Error("Expected 'val' to be defined, but received undefined");
  }
}

// export const extractImgFromMarkdown = async (basePath: string, markdown: string) => {
//   type MarkdownNode = {
//     type: string;
//     url?: string;
//     children?: MarkdownNode[];
//   };
//
//   const imgSet: { [key: string]: any } = {};
//   const processor = unified().use(remarkParse);
//   const tree = processor.parse(markdown);
//
//   visit(tree, "image", (node: MarkdownNode) => {
//     if (node.url) {
//       imgSet[node.url] = {};
//     }
//   });
//
//   // 读取每个图像文件并获取尺寸
//   for (const src of Object.keys(imgSet)) {
//     try {
//       const filePath = path.join(basePath, src);
//       const data = await fs.readFile(filePath);
//       const metadata = await sharp(data).metadata();
//       imgSet[src] = { ...imgSet[src], width: metadata.width, height: metadata.height };
//     } catch (error) {
//       console.error("Error processing image:", src, error);
//     }
//   }
//
//   return imgSet;
// };

// export const extractCoverImageMetadata = async (src: string) => {
//   try {
//     const filePath = path.join(staticBasePath, src);
//     const data = await fs.readFile(filePath);
//     const metadata = await sharp(data).metadata();
//     return { width: metadata.width, height: metadata.height };
//   } catch (error) {
//     console.error("Error processing image:", src, error);
//   }
// };

// Function to filter posts based on search parameters
export function filterPosts(
  posts: Post[],
  params: {
    column?: string;
    category?: string;
    tag?: string;
  },
): Post[] {
  const columns = params.column ? params.column.split(",") : [];
  const categories = params.category ? params.category.split(",") : [];
  const tags = params.tag ? params.tag.split(",") : [];

  return posts.filter((post) => {
    const columnMatch = columns.length > 0 ? columns.some((col) => post.columns.includes(col)) : true;
    const categoryMatch = categories.length > 0 ? categories.some((cat) => post.categories.includes(cat)) : true;
    const tagMatch = tags.length > 0 ? tags.some((tag) => post.tags.map((t) => tagDict[t])?.includes(tag)) : true;
    return columnMatch && categoryMatch && tagMatch;
  });
}
