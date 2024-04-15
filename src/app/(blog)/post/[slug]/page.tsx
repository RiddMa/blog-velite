import Image from "next/image";
import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getTagBySlug } from "@/src/store/velite";
import { assertDefined } from "@/src/util/util";
import { ImageAwesome } from "@/src/components/ImageAwesome";

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

  const columns = post.columns.map((column) => getColumnBySlug(column));
  const categories = post.categories.map((category) => getCategoryBySlug(category));
  const tags = post.tags.map((tag) => getTagBySlug(tag));

  return (
    <article className="prose-article">
      <h1 className={`text-h0 text-center`}>{post.title}</h1>
      {post.cover && (
        <ImageAwesome
          src={post.cover.src}
          alt={post.title}
          blurDataURL={post.cover.blurDataURL}
          width={post.cover.width}
          height={post.cover.height}
        />
      )}
      {/*{post.excerpt && <p className="mt-0 text-xl text-slate-700 dark:text-slate-200">{post.excerpt}</p>}*/}
      <br />
      <div className="" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </article>
  );
}
