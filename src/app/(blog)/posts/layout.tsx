import BlogLayout from "@/src/components/layout/BlogLayout";
import React, { Suspense } from "react";
import PostFilterWidget from "@/src/components/PostFilterWidget";
import { Metadata } from "next";
import { globals } from "@/.velite";

export function generateMetadata(): Metadata {
  return {
    title: `文章列表`,
    description: `探索博客文章。| ${globals.metadata.description}`,
    openGraph: {
      title: `文章列表`,
      description: `探索博客文章。| ${globals.metadata.description}`,
    },
  };
}

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children }) => {
  return (
    <BlogLayout
      leftNavbar={
        <Suspense fallback={null}>
          <PostFilterWidget />
        </Suspense>
      }
    >
      {children}
    </BlogLayout>
  );
};

export default Layout;
