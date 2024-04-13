import React from "react";
import TopNavbar from "./layout/top-navbar.client";
import LeftNavbar from "./layout/left-navbar";
import RightNavbar from "./layout/right-navbar";
import MainContainer from "./layout/main-container";

interface LayoutProps {
  children: React.ReactNode;
}

const BlogLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavbar />
      <div className={`h-[96px]`}></div>
      <div className="flex flex-row flex-1 p-0 mx-auto">
        <LeftNavbar />
        <MainContainer className="max-w-screen-lg">{children}</MainContainer>
        <RightNavbar />
      </div>
    </div>
  );
};

export default BlogLayout;
