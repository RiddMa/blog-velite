import React from "react";
import LeftNavbar from "@/src/components/layout/LeftNavbar";
import RightNavbar from "@/src/components/layout/RightNavbar";
import MainContainer from "@/src/components/layout/MainContainer";
import { clsname } from "@/src/util/clsname";

interface BlogLayoutProps {
  children?: React.ReactNode;
  className?: string;
  leftNavbar?: React.ReactNode;
  rightNavbar?: React.ReactNode;
}

const BlogLayout: React.FC<BlogLayoutProps> = ({ children, className, leftNavbar, rightNavbar }) => {
  return (
    <div className="flex flex-col inset-0">
      <div className="flex flex-row flex-1 p-0 m-0 justify-center">
        <LeftNavbar>{leftNavbar}</LeftNavbar>
        <MainContainer className={clsname("flip-main-container main-container", className)}>{children}</MainContainer>
        <RightNavbar>{rightNavbar}</RightNavbar>
      </div>
    </div>
  );
};

export default BlogLayout;
