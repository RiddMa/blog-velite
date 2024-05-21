import Image from "next/image";
import { notFound } from "next/navigation";
import { columns, globals, posts } from "@/.velite";
import type { Metadata } from "next";
import { getColumnBySlug } from "@/src/store/velite";
import Link from "next/link";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/app/(blog)/posts/PostCard";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { filterPosts } from "@/src/util/util";
import { MotionH1 } from "@/src/components/transition/MotionH1";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";

interface ColumnProps {
  params: {
    slug: string;
  };
  searchParams: {
    category?: string;
    tag?: string;
  };
}

export function generateMetadata({ params }: ColumnProps): Metadata {
  const column = getColumnBySlug(params.slug);
  if (column == null) {
    return {
      title: `错误：找不到专栏`,
      description: `错误：找不到专栏。 | ${globals.metadata.description}`,
      openGraph: {
        title: `错误：找不到专栏`,
        description: `错误：找不到专栏。 | ${globals.metadata.description}`,
      },
    };
  }
  return {
    title: `${column.name} | 专栏`,
    description: `探索博客专栏“${column.name}”的文章。| ${globals.metadata.description}`,
    openGraph: {
      title: `${column.name} | 专栏`,
      description: `探索博客专栏“${column.name}”的文章。| ${globals.metadata.description}`,
    },
  };
}

export function generateStaticParams(): ColumnProps["params"][] {
  return columns.map((column) => ({
    slug: column.slug,
  }));
}

export default function ColumnPage({ params, searchParams }: ColumnProps) {
  const column = getColumnBySlug(params.slug);
  if (!column) notFound();

  const displayedPosts = filterPosts(posts, { column: params.slug, ...searchParams });

  return (
    <div className="flex flex-col">
      <BlogIndexNav path={`/columns`} />
      <div className="prose-article">
        <MotionH1 keyName={`column-title-${column.permalink}`}>{column.name}</MotionH1>
        <MotionDiv keyName={`column-description-${column.permalink}`}>
          <BlogHtmlRenderer html={column.description} />
        </MotionDiv>
        <div className="text-end opacity-80">{displayedPosts.length}篇文章</div>
      </div>
      {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
      <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
    </div>
  );
}
