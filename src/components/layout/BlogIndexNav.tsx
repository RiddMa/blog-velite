import React from "react";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import { cn } from "@/src/lib/cn";

const BlogIndexNav: React.FC<{ path: string; className?: string }> = ({ path, className }) => {
  // const items: TabsProps["items"] = [
  //   {
  //     key: "/posts",
  //     label: "文章",
  //     children: "Content of Tab Pane 1",
  //   },
  //   {
  //     key: "/categories",
  //     label: "分类",
  //     children: "Content of Tab Pane 2",
  //   },
  //   {
  //     key: "/columns",
  //     label: "专栏",
  //     children: "Content of Tab Pane 3",
  //   },
  // ];

  return (
    <nav className={cn("flex flex-row gap-4", className)}>
      {/*<MotionDiv keyName={"blog-index-nav-posts"}>*/}
      {/*  <Link href={`/posts`} className={`${path === "/posts" ? "text-h0" : "text-h2"}`}>*/}
      {/*    文章*/}
      {/*  </Link>*/}
      {/*</MotionDiv>*/}
      {/*<MotionDiv keyName={"blog-index-nav-categories"}>*/}
      {/*  <Link href={`/categories`} className={`${path === "/categories" ? "text-h0" : "text-h2"}`}>*/}
      {/*    分类*/}
      {/*  </Link>*/}
      {/*</MotionDiv>*/}
      {/*<MotionDiv keyName={"blog-index-nav-columns"}>*/}
      {/*  <Link href={`/columns`} className={`${path === "/columns" ? "text-h0" : "text-h2"}`}>*/}
      {/*    专栏*/}
      {/*  </Link>*/}
      {/*</MotionDiv>*/}
      <div role="tablist" className="tabs tabs-bordered tabs-lg">
        <MotionDiv
          role="tab"
          className={cn("tab", path === "/posts" ? "tab-active text-h2" : "")}
          keyName={"blog-index-nav-posts"}
        >
          <Link href={`/posts`}>文章</Link>
        </MotionDiv>
        <MotionDiv
          role="tab"
          className={cn("tab", path === "/categories" ? "tab-active text-h2" : "")}
          keyName={"blog-index-nav-categories"}
        >
          <Link href={`/categories`}>分类</Link>
        </MotionDiv>
        <MotionDiv
          role="tab"
          className={cn("tab", path === "/columns" ? "tab-active text-h2" : "")}
          keyName={"blog-index-nav-columns"}
        >
          <Link href={`/columns`}>专栏</Link>
        </MotionDiv>
      </div>
    </nav>
  );
};

export default BlogIndexNav;
