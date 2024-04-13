import React from "react";
import TopNavbar from "./top-navbar.client";
import LeftNavbar from "./left-navbar";
import RightNavbar from "./right-navbar";
import MainContainer from "./main-container";

interface LayoutProps {
  children?: React.ReactNode;
  leftNavbar?: React.ReactNode;
  rightNavbar?: React.ReactNode;
}

const BlogLayout: React.FC<LayoutProps> = ({ children, leftNavbar, rightNavbar }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      <div className={`h-[96px]`}></div>
      <div className="flex flex-row flex-1 p-0 mx-auto">
        <LeftNavbar>{leftNavbar}</LeftNavbar>
        <MainContainer className="max-w-screen-lg">{children}</MainContainer>
        <RightNavbar>{rightNavbar}</RightNavbar>
      </div>
    </div>
  );
};

export default BlogLayout;
