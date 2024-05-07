"use client";

import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";

interface PostsLayoutProps {
  params: {
    slug: string;
  };
  children?: React.ReactNode;
}

const LeftContent: React.FC<{ slug: string }> = ({ slug }) => {
  return <aside className={``}></aside>;
};

const RightContent: React.FC<{ slug: string }> = ({ slug }) => {
  return <aside className={``}></aside>;
};

const PostLayout: React.FC<PostsLayoutProps> = ({ params, children }) => {
  return (
    <BlogLayout leftNavbar={<LeftContent slug={params.slug} />} rightNavbar={<RightContent slug={params.slug} />}>
      {children}
    </BlogLayout>
  );
};

export default PostLayout;
