import React from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Copy2Clipboard from "@/src/components/Copy2Clipboard";
import { ImageAwesome } from "@/src/components/ImageAwesome";
import * as prod from "react/jsx-runtime";

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
          return <pre className={`relative m-0 p-0`}>{props.children}</pre>;
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match?.[1] ? match[1] : "";
          return language ? (
            <div className={`group`}>
              <Copy2Clipboard>{String(children).replace(/\n$/, "")}</Copy2Clipboard>
              <SyntaxHighlighter
                wrapLines={false}
                wrapLongLines={false}
                style={oneDark}
                language={language}
                showLineNumbers={true}
                PreTag="div"
                customStyle={{
                  margin: "1rem 0",
                  padding: "0.75rem 0.5rem",
                  borderRadius: "1rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props} className={`${className}`}>
              {children}
            </code>
          );
        },
        img: ({ src, alt }) => {
          const { width, height } = imgMap[src!];
          return <ImageAwesome src={src!} alt={alt!} width={width} height={height} halo={false} />;
        },
        gpt: ({ node, children }: any) => {
          const { properties } = node;
          return <div className={`gpt`}>{children}</div>;
        },
      },
      ...production,
    });

  const ContentComponents = processor.processSync(html).result;

  return (
    <>
      <pre className={`text-wrap`}>{html}</pre>
      {ContentComponents}
    </>
  );
};

export default BlogHtmlRenderer;
