import { Post, posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/app/(blog)/posts/PostCard";
import { filterPosts } from "@/src/lib/util";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";

interface PostListProps {
  params: {
    query: string;
  };
  searchParams: {
    column?: string;
    category?: string;
    tag?: string;
  };
}

export default function PostListPage({ searchParams }: PostListProps) {
  const displayedPosts = filterPosts(posts, searchParams);
  console.log(displayedPosts.length);

  return (
    <div className="flex flex-col">
      <BlogIndexNav path={`/posts`} />
      <p className="prose-article text-end opacity-80">{displayedPosts.length}篇文章</p>
      {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
      <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
    </div>
  );
}
