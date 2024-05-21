import { posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PostCard from "@/src/app/(blog)/post/[slug]/PostCard";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";
import PostCardLite from "@/src/app/(blog)/post/[slug]/PostCardLite";

export default function PostListPage() {
  const displayedPosts = posts;

  return (
    <>
      <div className="flex flex-col">
        <BlogIndexNav path={`/posts`} />
        <p className="prose-article text-end opacity-80">{displayedPosts.length}篇文章</p>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
      </div>
    </>
  );
}
