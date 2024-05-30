import OpenAI from "openai";
import dotenv from "dotenv";
import { Tag } from "@/.velite";

// Load environment variables from .env file
dotenv.config();

export const completeChat = async (messages: { content: string; role: string }[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API key is missing. Please set API_KEY in your .env file.");
  }
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com",
  });

  try {
    return (
      await openai.chat.completions.create({
        model: "deepseek-chat", // @ts-ignore
        messages: messages,
      })
    ).choices[0].message.content as string;
  } catch (error) {
    return `Error creating chat completion: ${error}`;
  }
};

export const generateSlugForTags = async (tags: string[]): Promise<string[]> => {
  const response = await completeChat([
    {
      content:
        'You are an expert in processing and translating text. I have a task for you that involves converting strings into URL-friendly slugs. Here are the details:\n\n- Objective: Transform each string in an array into a slug.\n- Input: A JSON array of strings that need to be slugified.\n- Output: A JSON array of strings that have been slugified.\n\nInstructions:\n\nFor each string in the input array:\n\n- Translate any non-Latin characters (e.g., Chinese, Japanese) into English while maintaining accuracy for proper nouns and balancing between direct translation and interpretation.\n- Ensure that the translation is concise and contextually accurate, retaining professional terminology and abbreviations where appropriate.\n- Remove unnecessary words like \'and\' in the translation if they don\'t affect the overall meaning, to shorten the slug.\n- Convert the translated string to lowercase.\n- Replace spaces and special characters with hyphens to form the slug.\n\nFor example, the string "高性能网络模式：Reactor 和 Proactor" should be translated to "High-performance network patterns: Reactor and Proactor" and then slugified as "high-performance-network-patterns-reactor-proactor".\n\nHere\'s an example input and output:\n\nInput:["高性能网络模式：Reactor 和 Proactor","BUPT 校园网 OpenWrt 配置 IPv6","使用 GitHub Actions 部署 Next.js 项目到 VPS","Пример текста"]\n\nOutput:["high-performance-network-patterns-reactor-proactor","bupt-campus-network-openwrt-configure-ipv6","deploy-next-js-to-vps-using-github-actions","example-text"]\n\nPlease perform the translation and slugification for the provided input array. Your response should only include the result JSON array, with no additional comments nor markdown notation.',
      role: "system",
    },
    {
      content: `Input:${JSON.stringify(tags)}\nOutput:`,
      role: "user",
    },
  ]);
  console.log("LLM response:", response);
  return JSON.parse(response);
};

export const generateExcerptForMarkdown = async (markdown: string): Promise<string> => {
  const response = await completeChat([
    {
      content:
        'You are an AI designed to understand and summarize written content to form an excerpt for given article. Below is a markdown article. Read and analyze the article, then provide a concise summary that captures the main points and insights. Ensure the summary reflects the author\'s intentions, key arguments, and the overall message they aimed to convey. Output in Markdown format. Excerpt should be concise, around 250 words, no more than 500 words. Excerpt may be multiple paragraphs, but do not use headings or subheadings. Add space between Chinese characters and English/Digit/Marks when it\'s appropriate to make typography look better.  **Avoid using phrases like "作者认为..." or "本文介绍了..."**. **RESPOND IN CHINESE**.',
      role: "system",
    },
    {
      content: `"Markdown Article:\n\n${markdown}\n\nExcerpt:"`,
      role: "user",
    },
  ]);
  console.log("LLM response:", response);
  return response.trim();
};

export const generateSeoDescriptionForMarkdown = async (markdown: string): Promise<string> => {
  const response = await completeChat([
    {
      content:
        'You are an AI designed to understand and summarize written content to form an SEO description for given article. Below is a markdown article. Read and analyze the article, then provide a concise summary that captures the main points and insights for search engine optimization (SEO) purposes. Ensure the summary reflects the author\'s intentions, key arguments, and the overall message they aimed to convey. **Output in PLAIN TEXT format**. Excerpt should be about 140 words, no more than 170 words. Excerpt should be one paragraph, do not use headings or subheadings. Add space between Chinese characters and English/Digit/Marks when it\'s appropriate to make typography look better. **Avoid using phrases like "作者认为..." or "本文介绍了..."**. **RESPOND IN CHINESE**.',
      role: "system",
    },
    {
      content: `"Markdown Article:\n\n${markdown}\n\nSEO Description:"`,
      role: "user",
    },
  ]);
  console.log("LLM response:", response);
  return response.trim();
};
