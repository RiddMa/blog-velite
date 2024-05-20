import React from "react";
import Link from "next/link";
import { MotionDiv } from "@/src/components/transition/MotionDiv";

const BlogIndexNav: React.FC<{ path: string }> = ({ path }) => {
  return (
    <nav className="flex flex-row gap-4 items-baseline">
      <MotionDiv keyName={"blog-index-nav-posts"}>
        <Link href={`/posts`} className={`${path === "/posts" ? "text-h0" : "text-h2"} text-href`}>
          文章
        </Link>
      </MotionDiv>
      <MotionDiv keyName={"blog-index-nav-categories"}>
        <Link href={`/categories`} className={`${path === "/categories" ? "text-h0" : "text-h2"} text-href`}>
          分类
        </Link>
      </MotionDiv>
      <MotionDiv keyName={"blog-index-nav-columns"}>
        <Link href={`/columns`} className={`${path === "/columns" ? "text-h0" : "text-h2"} text-href`}>
          专栏
        </Link>
      </MotionDiv>
    </nav>
  );
};

export default BlogIndexNav;
