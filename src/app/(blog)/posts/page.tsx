import { posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import PostCard from "@/src/components/PostCard";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";

export default function PostListPage() {
  const displayedPosts = posts;

  return (
    <>
      <div className="flex flex-col">
        <BlogIndexNav path={`/posts`} />
        <div className={`prose-article px-content`}>
          <p className="text-end opacity-80">{displayedPosts.length}篇文章</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
      </div>
    </>
  );
}
