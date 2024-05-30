import React from "react";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { MotionDiv } from "@/src/components/transition/MotionDiv";

const BlogIndexNav: React.FC<{ path: string }> = ({ path }) => {
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
    <nav className="flex flex-row gap-4 items-baseline">
      <MotionDiv keyName={"blog-index-nav-posts"}>
        <Link href={`/posts`} className={`${path === "/posts" ? "text-h0" : "text-h2"}`}>
          文章
        </Link>
      </MotionDiv>
      <MotionDiv keyName={"blog-index-nav-categories"}>
        <Link href={`/categories`} className={`${path === "/categories" ? "text-h0" : "text-h2"}`}>
          分类
        </Link>
      </MotionDiv>
      <MotionDiv keyName={"blog-index-nav-columns"}>
        <Link href={`/columns`} className={`${path === "/columns" ? "text-h0" : "text-h2"}`}>
          专栏
        </Link>
      </MotionDiv>
      {/*<Tabs*/}
      {/*  defaultActiveKey="1"*/}
      {/*  items={items}*/}
      {/*  renderTabBar={(tabBarProps, DefaultTabBar) => <div>123</div>}*/}
      {/*  className="prose-article"*/}
      {/*/>*/}
    </nav>
  );
};

export default BlogIndexNav;
