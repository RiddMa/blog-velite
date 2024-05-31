import { notFound } from "next/navigation";
import { globals, posts } from "@/.velite";
import type { Metadata } from "next";
import { getPostBySlug } from "@/src/store/velite";
import PostComment from "@/src/components/PostComment";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import React, { useMemo } from "react";
import Image from "next/image";
import { calculateDisplayedDimensions } from "@/src/lib/util";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import dayjs from "@/src/store/day";

interface PostProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PostProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (post == null) {
    return {
      title: `错误：找不到文章`,
      description: `错误：找不到文章。 | ${globals.metadata.description}`,
      openGraph: {
        title: `错误：找不到文章`,
        description: `错误：找不到文章。 | ${globals.metadata.description}`,
      },
    };
  }

  let displayedWidth = 512,
    displayedHeight = 512;
  if (post.cover) {
    const calculatedDimensions = calculateDisplayedDimensions(post.cover.width, post.cover.height, 642, 642);
    displayedWidth = calculatedDimensions.displayedWidth;
    displayedHeight = calculatedDimensions.displayedHeight;
  }

  return {
    title: post.title,
    description: `${post.excerpt} | ${globals.metadata.description}`,
    openGraph: {
      title: post.title,
      description: `${post.seoDescription} | ${globals.metadata.description}`,
      url: `${globals.metadata.openGraph.url}/post/${params.slug}`,
      images: post.cover
        ? {
            url: `${globals.metadata.openGraph.url}/_next/image?url=${encodeURIComponent(post.cover.src)}&w=${642}&q=75`,
            width: displayedWidth,
            height: displayedHeight,
            alt: post.title,
          }
        : globals.metadata.openGraph.images,
      type: "article",
      publishedTime: post.created,
      modifiedTime: post.updated,
      authors: post.author,
      section: post.categories.join(", "),
      tags: post.tags,
    },
  };
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

  const updatedReminder = useMemo(() => {
    const date = dayjs(post.updated);
    const threshold = { years: 0, months: 6 };

    // 计算年和月的差异
    const now = dayjs();
    const years = now.diff(date, "year");
    const months = now.diff(date.add(years, "year"), "month");

    let text = "文章最后编辑于";
    if (years !== 0) {
      text += ` ${years} 年`;
    }
    if (months !== 0) {
      text += ` ${months} 个月`;
    }
    text += "前，其中的信息可能时效性欠佳。";
    return {
      show: years > threshold.years || (years === threshold.years && months > threshold.months),
      text: text,
    };
  }, [post.updated]);

  return (
    <article className="prose-article">
      <Link href="/posts" className="w-full">
        <button className="btn btn-sm btn-ghost pl-0 pr-2 m-0 rounded-xl text-body outline-none border-none transition-apple opacity-80 hover:opacity-100">
          <span className="icon-[heroicons--chevron-left]" />
          文章列表
        </button>
      </Link>
      <h1 className="text-center" data-flip-id={`post-title-${permalink}`}>
        {title}
      </h1>
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
      {updatedReminder.show && <p>{updatedReminder.text}</p>}
      <BlogHtmlRenderer html={content} imgMap={images} />
      <PostComment />
    </article>
  );
}
