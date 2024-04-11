import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getTagBySlug } from "@/src/store/velite";

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
  const pageRegex = /^\d+$/; // 匹配全数字的字符串
  if (pageRegex.test(params.slug)) {
    return <div>页码{params.slug}</div>;
  }

  const post = getPostBySlug(params.slug);

  if (post == null) notFound();

  const columns = post!.columns.map((column) => getColumnBySlug(column));
  const categories = post!.categories.map((category) => getCategoryBySlug(category));
  const tags = post!.tags.map((tag) => getTagBySlug(tag));

  return (
    <article className="prose lg:prose-lg dark:prose-invert py-6">
      <h1 className="mb-2">标题：{post.title}</h1>
      {post.excerpt && <p className="mt-0 text-xl text-slate-700 dark:text-slate-200">摘要：{post.excerpt}</p>}
      <br />
      专栏
      {JSON.stringify(columns, null, 2)}
      {columns.map((column) => (
        <>
          <a href={column?.permalink}>{column?.name}</a>
        </>
      ))}
      <br />
      分类
      {JSON.stringify(categories, null, 2)}
      {categories.map((category) => (
        <>
          <a href={category?.permalink}>{category?.name}</a>
        </>
      ))}
      <br />
      标签
      {JSON.stringify(tags, null, 2)}
      {tags.map((tag) => (
        <>
          <span>{tag?.name}</span>
        </>
      ))}
      {post.cover && <Image src={post.cover} alt={post.title} placeholder="blur" />}
      <hr className="my-4" />
      内容：
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </article>
  );
}
