import { notFound } from "next/navigation";
import { categories, posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/src/store/velite";
import Link from "next/link";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/components/PostCard";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { filterPosts } from "@/src/util/util";

interface CategoryProps {
  params: {
    slug: string;
  };
  searchParams: {
    column?: string;
    tag?: string;
  };
}

export function generateMetadata({ params }: CategoryProps): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (category == null) return {};
  return { title: category.name, description: category.description };
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
    <div className="flex flex-col gap-4">
      <nav className="flex flex-row gap-4 items-baseline">
        <Link href={`/posts`} className={`text-h2 text-href`}>
          文章
        </Link>
        <Link href={`/categories`} className={`text-h0 text-href`}>
          分类
        </Link>
        <Link href={`/columns`} className={`text-h2 text-href`}>
          专栏
        </Link>
      </nav>
      <div className={`prose-article`}>
        <h1>{category.name}</h1>
        <BlogHtmlRenderer html={category.description} />
        <p className="text-end opacity-80">{displayedPosts.length}篇文章</p>
      </div>
      {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
      <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
    </div>
  );
}
