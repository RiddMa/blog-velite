import Image from "next/image";
import { notFound } from "next/navigation";
import { columns, globals, posts } from "@/.velite";
import type { Metadata } from "next";
import { getColumnBySlug } from "@/src/store/velite";
import Link from "next/link";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/components/PostCard";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { filterPosts } from "@/src/util/util";

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
    <div className="flex flex-col gap-4">
      <nav className="flex flex-row gap-4 items-baseline">
        <Link href={`/posts`} className={`text-h2 text-href`}>
          文章
        </Link>
        <Link href={`/categories`} className={`text-h2 text-href`}>
          分类
        </Link>
        <Link href={`/columns`} className={`text-h0 text-href`}>
          专栏
        </Link>
      </nav>
      <div className={`prose-article`}>
        <h1>{column.name}</h1>
        <BlogHtmlRenderer html={column.description} />
        <p className="text-end opacity-80">{displayedPosts.length}篇文章</p>
      </div>
      {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
      <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
    </div>
  );
}
