import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getPostBySlug } from "@/src/store/velite";
import { ImageAwesome } from "@/src/components/ImageAwesome";
import PostComment from "@/src/components/PostComment";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import React from "react";
import { MotionH1 } from "@/src/app/(blog)/post/[slug]/MotionH1";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import Image from "next/image";

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
  const { permalink, title, cover, content, images } = post;

  return (
    <article className="prose-article">
      <MotionH1 keyName={`post-title-${permalink}`} className={`text-center`}>
        {title}
      </MotionH1>
      {cover && (
        <>
          <MotionDiv keyName={`post-cover-${permalink}`}>
            {/*<Image*/}
            {/*  src={cover.src}*/}
            {/*  alt={`cover image`}*/}
            {/*  className="rounded-2xl"*/}
            {/*  width={cover.width}*/}
            {/*  height={cover.height}*/}
            {/*  blurDataURL={cover.blurDataURL}*/}
            {/*  style={{ margin: 0 }}*/}
            {/*/>*/}
            <ImageAwesome
              src={cover.src}
              alt={title}
              blurDataURL={cover.blurDataURL}
              width={cover.width}
              height={cover.height}
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
