import { notFound } from "next/navigation";
import { posts } from "@/.velite";
import type { Metadata } from "next";
import { getPostBySlug } from "@/src/store/velite";
import { ImageAwesome } from "@/src/components/ImageAwesome";
import PostComment from "@/src/components/PostComment";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";

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

  return (
    <article className="prose-article px-content">
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
      <br />
      <BlogHtmlRenderer html={post.content} imgMap={post.images} />
      <PostComment />
    </article>
  );
}
