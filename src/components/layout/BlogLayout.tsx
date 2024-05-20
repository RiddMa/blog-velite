import React from "react";
import TopNavbar from "@/src/components/layout/TopNavbar";
import LeftNavbarClient from "@/src/components/layout/LeftNavbar.client";
import RightNavbarClient from "@/src/components/layout/RightNavbar.client";
import MainContainer from "@/src/components/layout/MainContainer";

interface BlogLayoutProps {
  children?: React.ReactNode;
  className?: string;
  leftNavbar?: React.ReactNode;
  rightNavbar?: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, className, leftNavbar, rightNavbar }) => {
  return (
    <div className="flex flex-col inset-0 min-h-[calc(100dvh)]">
      <TopNavbar />
      <div className="flex flex-row flex-1 p-0 m-0 justify-center">
        <LeftNavbarClient>{leftNavbar}</LeftNavbarClient>
        <MainContainer className={className}>{children}</MainContainer>
        <RightNavbarClient>{rightNavbar}</RightNavbarClient>
      </div>
    </div>
  );
};

export default BlogLayout;
