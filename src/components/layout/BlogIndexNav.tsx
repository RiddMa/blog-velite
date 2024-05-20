import React from "react";
import Link from "next/link";

const BlogIndexNav: React.FC<{ path: string }> = ({ path }) => {
  return (
    <nav className="flex flex-row gap-4 items-baseline">
      <Link href={`/posts`} className={`${path === "/posts" ? "text-h0" : "text-h2"} text-href`}>
        文章
      </Link>
      <Link href={`/categories`} className={`${path === "/categories" ? "text-h0" : "text-h2"} text-href`}>
        分类
      </Link>
      <Link href={`/columns`} className={`${path === "/columns" ? "text-h0" : "text-h2"} text-href`}>
        专栏
      </Link>
    </nav>
  );
};

export default BlogIndexNav;
