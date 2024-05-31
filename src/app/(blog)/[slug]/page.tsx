import React from "react";
import type { Metadata } from "next";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { getPageBySlug } from "@/src/store/velite";
import { globals, pages, posts } from "@/.velite";
import { notFound } from "next/navigation";
import Image from "next/image";
import PostComment from "@/src/components/PostComment";

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const page = getPageBySlug(params.slug);
  if (page == null) {
    return {
      title: `错误：找不到页面`,
      description: `错误：找不到页面。 | ${globals.metadata.description}`,
      openGraph: {
        title: `错误：找不到页面`,
        description: `错误：找不到页面。 | ${globals.metadata.description}`,
      },
    };
  }
  return {
    title: page.title,
    description: `${page.excerpt} | ${globals.metadata.description}`,
    openGraph: { title: page.title, description: `${page.excerpt} | ${globals.metadata.description}` },
  };
}

export function generateStaticParams(): PageProps["params"][] {
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

function Page({ params }: PageProps) {
  let page = getPageBySlug(params.slug);
  if (!page) notFound();
  const { permalink, title, cover, content, images } = page;

  return (
    <article className="prose-article">
      <h1 className={`text-center`}>{title}</h1>
      {cover && (
        <>
          <Image
            src={cover.src}
            alt={cover.src}
            className="rounded-3xl mx-auto"
            width={cover.width}
            height={cover.height}
            placeholder="blur"
            blurDataURL={cover.blurDataURL}
            priority={true}
            style={{ marginBottom: 0 }}
          />
        </>
      )}
      <BlogHtmlRenderer html={content} imgMap={images} />
      <PostComment />
    </article>
  );
}

export default Page;
