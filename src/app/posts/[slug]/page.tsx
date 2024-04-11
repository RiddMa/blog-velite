import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug, getPostBySlug } from "@/src/store/velite";

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
  const post = getPostBySlug(params.slug);

  if (post == null) notFound();

  const categories = post!.categories.map((category) => getCategoryBySlug(category));

  return (
    <article className="prose lg:prose-lg dark:prose-invert py-6">
      <h1 className="mb-2">标题：{post.title}</h1>
      {post.excerpt && <p className="mt-0 text-xl text-slate-700 dark:text-slate-200">摘要：{post.excerpt}</p>}
      {categories.map((category) => (
        <>
          <a href={category!.permalink}>{category!.name}</a>
        </>
      ))}
      {post.cover && <Image src={post.cover} alt={post.title} placeholder="blur" />}
      <hr className="my-4" />
      内容：
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </article>
  );
}
