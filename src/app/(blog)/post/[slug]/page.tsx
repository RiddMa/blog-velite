import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getTagBySlug } from "@/src/store/velite";
import { assertDefined } from "@/src/util/util";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { ImageAwesome } from "@/src/components/ImageAwesome";
import Copy2Clipboard from "@/src/components/Copy2Clipboard";
import { getImageMetadata } from "velite";
import fs from "fs/promises";

interface PostProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PostProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (post == null) return {};
  return { title: post.title, description: post.excerpt };
}

export function generateStaticParams(): PostProps["params"][] {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: PostProps) {
  let post = getPostBySlug(params.slug);

  if (!post) notFound();

  const columns = post.columns.map((column) => getColumnBySlug(column));
  const categories = post.categories.map((category) => getCategoryBySlug(category));
  const tags = post.tags.map((tag) => getTagBySlug(tag));

  const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };
  const processor = unified()
    .use(rehypeParse, { fragment: true }) // Parse the HTML as fragment
    // @ts-ignore
    .use(rehypeReact, {
      components: {
        pre: (props) => {
          return <pre className={`relative m-0 p-0`}>{props.children}</pre>;
        },
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match?.[1] ? match[1] : "";
          return language ? (
            <>
              <Copy2Clipboard>{String(children).replace(/\n$/, "")}</Copy2Clipboard>
              <SyntaxHighlighter
                wrapLines={false}
                wrapLongLines={false}
                style={oneDark}
                language={language}
                showLineNumbers={true}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: "1rem 0.5rem",
                  borderRadius: "1rem",
                  fontSize: "1.125rem",
                  fontWeight: "regular",
                }}
                codeTagProps={{
                  style: { fontFamily: "JetBrains Mono, monospace", color: "#cbd5e1" },
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </>
          ) : (
            <code {...props} className={`${className}`}>
              {children}
            </code>
          );
        },
        img: ({ src, alt }) => {
          const { width, height } = post.images[src!];
          return <ImageAwesome src={src!} alt={alt!} width={width} height={height} />;
        },
        gpt: (props: any) => {
          console.log(props);
          return (
            <div>
              {props.title}
              <br />
              {props.children}
            </div>
          );
        },
      },
      ...production,
    });

  const ContentComponents = processor.processSync(post.content).result;

  return (
    <article className="prose-article">
      <h1 className={`text-h0 text-center`}>{post.title}</h1>
      {post.cover && (
        <ImageAwesome
          src={post.cover.src}
          alt={post.title}
          blurDataURL={post.cover.blurDataURL}
          width={post.cover.width}
          height={post.cover.height}
        />
      )}
      <br />
      {/*<div className="" dangerouslySetInnerHTML={{ __html: post.content }}></div>*/}
      {ContentComponents}
    </article>
  );
}
