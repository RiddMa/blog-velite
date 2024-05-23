import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import fs from "fs/promises";
import path from "node:path";
import rehypeParse from "rehype-parse";
import { visit } from "unist-util-visit";
import sharp from "sharp";
import ExifReader from "exifreader";
import { staticBasePath } from "@/base-path";

export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.filter((file) => file.isFile()).map((file) => path.join(dirPath, file.name));
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
}

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

type _Post = { tags: string[]; [key: string]: any };

type _Tag = { slug: string; name: string };

export function mergePostsTags(objects: _Post[]): string[] {
  const tagsArrays = objects.map((obj) => obj.tags);
  return mergeTags(...tagsArrays);
}

// 定义一个泛型函数，可以处理 string[][] 和 Tag[][]
export function mergeTags<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];

  const firstElement = arrays[0][0];

  // 检查是否为 Tag 类型
  if (!!firstElement && typeof firstElement === "object" && "slug" in firstElement) {
    const tagMap = new Map<string, T>();
    arrays.forEach((tags) => {
      tags.forEach((tag) => {
        const tagObj = tag as unknown as _Tag;
        if (!tagMap.has(tagObj.slug)) {
          tagMap.set(tagObj.slug, tag);
        }
      });
    });
    return Array.from(tagMap.values());
  } else {
    // 处理 string 类型
    const tagSet = new Set<string>();
    arrays.forEach((tags) => {
      tags.forEach((tag) => {
        tagSet.add(tag as unknown as string);
      });
    });
    return Array.from(tagSet) as T[];
  }
}

export async function parseMarkdown(markdown: string): Promise<string> {
  // console.log("Parsing markdown...", markdown);
  const file = await unified()
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
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeKatex)
    .use(rehypeStringify)
    .process(markdown);
  // console.log("Parsed markdown...", String(file));
  return String(file);
}

// Supported image formats
const supportedFormats = ["jpg", "jpeg", "png", "avif", "webp", "heif"];

// Function to get all image files in the directory
const getImageFiles = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir);
  return files.filter((file) => supportedFormats.includes(path.extname(file).toLowerCase().slice(1)));
};

// Function to check if a file exists
const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};
const blurWidth = 20;

// Function to generate blurDataUrl
const generateBlurDataUrl = async (sharpedImage: sharp.Sharp): Promise<string> => {
  const buffer = await sharpedImage
    .clone()
    .resize(blurWidth) // Resize to a small size
    .blur() // Apply blur
    .toBuffer();

  return `data:image/webp;base64,${buffer.toString("base64")}`;
};

// Function to convert images to WebP and read EXIF data
export const convertImagesToWebP = async (inputPath: string, outputPath: string) => {
  const imageFiles = await getImageFiles(inputPath);
  const images: {
    filename: string;
    src: string;
    width: number;
    height: number;
    blurDataUrl: string;
    blurWidth: number;
    blurHeight: number;
    exif: ExifReader.ExpandedTags;
  }[] = [];

  // Ensure the output directory exists
  await fs.mkdir(outputPath, { recursive: true });

  for (const file of imageFiles) {
    const filePath = path.join(inputPath, file);
    const outputFilePath = path.join(outputPath, `${path.basename(file, path.extname(file))}.webp`);

    try {
      // Read EXIF data
      const fileBuffer = await fs.readFile(filePath);
      const sharpedImage = sharp(fileBuffer);
      const metadata = await sharpedImage.metadata();
      const exifData = await ExifReader.load(fileBuffer, { async: true, expanded: true });

      images.push({
        filename: file,
        src: `/${path.posix.format(path.parse(path.relative(staticBasePath, outputFilePath)))}`,
        width: metadata.width!,
        height: metadata.height!,
        blurDataUrl: await generateBlurDataUrl(sharpedImage),
        blurWidth: blurWidth,
        blurHeight: Math.round((blurWidth / metadata.width!) * metadata.height!),
        exif: exifData,
      });

      // Check if the output file already exists
      if (!(await fileExists(outputFilePath))) {
        // Convert image to WebP
        await sharpedImage.webp({ quality: 80 }).toFile(outputFilePath);
        console.log(`Converted and saved: ${file} -> ${outputFilePath}`);
      }
      console.log(`Processed image: ${filePath}`);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  return images;
};
