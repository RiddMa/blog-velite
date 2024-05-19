import React from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import Copy2Clipboard from "@/src/components/markdown/Copy2Clipboard";
import { ImageAwesome } from "@/src/components/ImageAwesome";
import * as prod from "react/jsx-runtime";
import { RdSyntaxHighlighter } from "@/src/components/markdown/RdSyntaxHighlighter";
import { GptBlock } from "@/src/components/markdown/GptBlock";

interface HtmlProcessorProps {
  html: string;
  imgMap?: {
    [key: string]: {
      width: number;
      height: number;
    };
  };
}

const BlogHtmlRenderer: React.FC<HtmlProcessorProps> = ({ html, imgMap = {} }) => {
  const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };
  const processor = unified()
    .use(rehypeParse, { fragment: true }) // Parse the HTML as fragment
    // @ts-ignore
    .use(rehypeReact, {
      passNode: true,
      components: {
        pre: (props) => {
          return <pre>{props.children}</pre>;
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match?.[1] ? match[1] : "";
          return language ? (
            <div className="group relative">
              <Copy2Clipboard
                className={`absolute right-2 top-2 transition-opacity duration-300 ease-apple opacity-0 group-hover:opacity-100`}
              >
                {String(children).replace(/\n$/, "")}
              </Copy2Clipboard>
              <RdSyntaxHighlighter language={language} value={children} />
            </div>
          ) : (
            <code className={className}>{children}</code>
          );
        },
        img: ({ src, alt }) => {
          const { width, height } = imgMap[src!];
          return <ImageAwesome src={src!} alt={alt!} width={width} height={height} halo={false} />;
        },
        gpt: ({ node, children }: { node: any; children: React.ReactNode }) => {
          const { properties } = node;
          return <GptBlock properties={properties}>{children}</GptBlock>;
        },
      },
      ...production,
    });

  const ContentComponents = processor.processSync(html).result;

  return <>{ContentComponents}</>;
};

export default BlogHtmlRenderer;
