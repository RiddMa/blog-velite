import { notFound } from "next/navigation";
import { categories, globals, posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/src/store/velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/app/(blog)/posts/PostCard";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { filterPosts } from "@/src/util/util";
import { motion } from "framer-motion";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import { MotionH1 } from "@/src/components/transition/MotionH1";
import React from "react";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";

export function generateMetadata({ params }: CategoryProps): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (category == null) {
    return {
      title: `错误：找不到分类`,
      description: `错误：找不到分类。 | ${globals.metadata.description}`,
      openGraph: {
        title: `错误：找不到分类`,
        description: `错误：找不到分类。 | ${globals.metadata.description}`,
      },
    };
  }
  return {
    title: `${category.name} | 分类`,
    description: `探索博客分类“${category.name}”的文章。| ${globals.metadata.description}`,
    openGraph: {
      title: `${category.name} | 分类`,
      description: `探索博客分类“${category.name}”的文章。| ${globals.metadata.description}`,
    },
  };
}

interface CategoryProps {
  params: {
    slug: string;
  };
  searchParams: {
    column?: string;
    tag?: string;
  };
}

export function generateStaticParams(): CategoryProps["params"][] {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params, searchParams }: CategoryProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const displayedPosts = filterPosts(posts, { category: params.slug, ...searchParams });

  return (
    <div className="flex flex-col">
      <BlogIndexNav path={`/categories`} />
      <div className="prose-article">
        <MotionH1 keyName={`category-title-${category.permalink}`}>{category.name}</MotionH1>
        <MotionDiv keyName={`category-description-${category.permalink}`}>
          <BlogHtmlRenderer html={category.description} />
        </MotionDiv>
        <div className="text-end opacity-80">{displayedPosts.length}篇文章</div>
      </div>
      {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
      <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
    </div>
  );
}
