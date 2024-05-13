import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";
import rehypeStringify from "rehype-stringify";
import path from "node:path";
import { staticBasePath } from "@/base-path";
import fs from "fs/promises";
import sharp from "sharp";
import { Post } from "@/.velite";
import remarkParse from "remark-parse";

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function assertDefined<T>(val: T | undefined): asserts val is T {
  if (val === undefined) {
    throw new Error("Expected 'val' to be defined, but received undefined");
  }
}

export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries.filter((file) => file.isFile()).map((file) => path.join(dirPath, file.name));
    return files;
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

export async function postProcessMarkdownImages(filePath: string, staticBasePath: string): Promise<void> {
  try {
    // Read the file
    const data = JSON.parse(await fs.readFile(filePath, "utf8"));

    // Process each post
    const processedData = await Promise.all(
      data.map(async (el: any) => {
        const imgSet = await extractImgFromHtml(staticBasePath, el.content);
        return { ...el, images: imgSet }; // Return new object with added images
      }),
    );

    // Write the processed posts back to the file or another file
    await fs.writeFile(filePath, JSON.stringify(processedData, null, 2), "utf8");

    console.log(`File ${filePath} have been processed and saved.`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

export const extractImg = async (basePath: string, data: any) => {
  return await extractImgFromHtml(basePath, data.content);
};

export const extractImgFromMarkdown = async (basePath: string, markdown: string) => {
  type MarkdownNode = {
    type: string;
    url?: string;
    children?: MarkdownNode[];
  };

  const imgSet: { [key: string]: any } = {};
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdown);

  visit(tree, "image", (node: MarkdownNode) => {
    if (node.url) {
      imgSet[node.url] = {};
    }
  });

  // 读取每个图像文件并获取尺寸
  for (const src of Object.keys(imgSet)) {
    try {
      const filePath = path.join(basePath, src);
      const data = await fs.readFile(filePath);
      const metadata = await sharp(data).metadata();
      imgSet[src] = { ...imgSet[src], width: metadata.width, height: metadata.height };
    } catch (error) {
      console.error("Error processing image:", src, error);
    }
  }

  return imgSet;
};

export const extractImgFromHtml = async (basePath: string, html: string) => {
  const imgSet: { [key: string]: any } = {};

  unified()
    .use(rehypeParse, { fragment: true }) // 解析为HTML片段
    .use(() => (tree) => {
      visit(tree, "element", (node: any) => {
        if (node.tagName === "img" && node.properties) {
          const src = node.properties.src;
          if (typeof src === "string") {
            imgSet[src] = {};
          }
        }
      });
    })
    .use(rehypeStringify) // 仅为了满足编译器需求
    .processSync(html); // 处理HTML字符串

  // 读取每个图像文件并获取尺寸
  for (const src of Object.keys(imgSet)) {
    try {
      const filePath = path.join(basePath, src);
      const data = await fs.readFile(filePath);
      const metadata = await sharp(data).metadata();
      imgSet[src] = { ...imgSet[src], width: metadata.width, height: metadata.height };
    } catch (error) {
      console.error("Error processing image:", src, error);
    }
  }

  return imgSet;
};

export const extractCoverImageMetadata = async (src: string) => {
  try {
    const filePath = path.join(staticBasePath, src);
    const data = await fs.readFile(filePath);
    const metadata = await sharp(data).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error("Error processing image:", src, error);
  }
};

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
    const tagMatch = tags.length > 0 ? tags.some((tag) => post.tags.includes(tag)) : true;
    return columnMatch && categoryMatch && tagMatch;
  });
}
