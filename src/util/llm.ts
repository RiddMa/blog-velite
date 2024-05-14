import OpenAI from "openai";
import dotenv from "dotenv";
import { Tag } from "@/.velite";

// Load environment variables from .env file
dotenv.config();

export const completeChat = async (messages: { content: string; role: string }[]): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "API key is missing. Please set API_KEY in your .env file.";
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
        'You are an expert in processing and translating text. I have a task for you that involves converting strings into URL-friendly slugs. Here are the details:\r\n\r\n- Objective: Transform each string in an array into a slug.\r\n- Input: A JSON array of strings that need to be slugified.\r\n- Output: A JSON array of strings that have been slugified.\r\n\r\nInstructions:\r\n\r\nFor each string in the input array:\r\n\r\n- Translate any non-Latin characters (e.g., Chinese, Japanese) into English while maintaining accuracy for proper nouns and balancing between direct translation and interpretation.\r\n- Ensure that the translation is concise and contextually accurate, retaining professional terminology and abbreviations where appropriate.\r\n- Remove unnecessary words like \'and\' in the translation if they don\'t affect the overall meaning, to shorten the slug.\r\n- Convert the translated string to lowercase.\r\n- Replace spaces and special characters with hyphens to form the slug.\r\n\r\nFor example, the string "高性能网络模式：Reactor 和 Proactor" should be translated to "High-performance network patterns: Reactor and Proactor" and then slugified as "high-performance-network-patterns-reactor-proactor".\r\n\r\nHere\'s an example input and output:\r\n\r\nInput:["高性能网络模式：Reactor 和 Proactor","BUPT 校园网 OpenWrt 配置 IPv6","使用 GitHub Actions 部署 Next.js 项目到 VPS","Пример текста"]\r\n\r\nOutput:["high-performance-network-patterns-reactor-proactor","bupt-campus-network-openwrt-configure-ipv6","deploy-next-js-to-vps-using-github-actions","example-text"]\r\n\r\nPlease perform the translation and slugification for the provided input array. Your response should only include the result JSON array, with no additional comments nor markdown notation.',
      role: "system",
    },
    {
      content: `Input:${JSON.stringify(tags)}\r\nOutput:`,
      role: "user",
    },
  ]);
  return JSON.parse(response);
};
