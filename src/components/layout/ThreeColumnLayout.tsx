import BlogLayout from "@/src/components/layout/BlogLayout";
import React from "react";

type LayoutProps = {
  children?: React.ReactNode;
};

type LayoutProps3Column = {
  children?: React.ReactNode;
  leftNavbar?: React.ReactNode;
  rightNavbar?: React.ReactNode;
};

const PostLayout: React.FC<LayoutProps3Column | LayoutProps> = (props) => {
  const { children, leftNavbar, rightNavbar } = {
    ...props,
    leftNavbar: undefined,
    rightNavbar: undefined,
  };
  return (
    <BlogLayout leftNavbar={leftNavbar} rightNavbar={rightNavbar}>
      {children}
    </BlogLayout>
  );
};

export default PostLayout;
