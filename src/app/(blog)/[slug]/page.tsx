import React from "react";
import type { Metadata } from "next";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { getPageBySlug } from "@/src/store/velite";
import { globals, pages, posts } from "@/.velite";
import { notFound } from "next/navigation";
import { MotionH1 } from "@/src/app/(blog)/post/[slug]/MotionH1";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
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
      <MotionH1 keyName={`post-title-${permalink}`} className={`text-center`}>
        {title}
      </MotionH1>
      {cover && (
        <>
          <MotionDiv keyName={`post-cover-${permalink}`}>
            <Image
              src={cover.src}
              alt={`cover image`}
              className="rounded-2xl"
              width={cover.width}
              height={cover.height}
              placeholder="blur"
              blurDataURL={cover.blurDataURL}
              priority={true}
              style={{ margin: 0 }}
            />
          </MotionDiv>
        </>
      )}
      <br />
      <BlogHtmlRenderer html={content} imgMap={images} />
      <PostComment />
    </article>
  );
}

export default Page;
