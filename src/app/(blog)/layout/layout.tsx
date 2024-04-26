import React from "react";
import TopNavbar from "./TopNavbar.client";
import LeftNavbarClient from "./LeftNavbar.client";
import RightNavbarClient from "./RightNavbar.client";
import MainContainer from "./main-container";

interface LayoutProps {
  children?: React.ReactNode;
  leftNavbar?: React.ReactNode;
  rightNavbar?: React.ReactNode;
}

const BlogLayout: React.FC<LayoutProps> = ({ children, leftNavbar, rightNavbar }) => {
  return (
    <div className="flex flex-col inset-0 min-h-[calc(100dvh)]">
      <TopNavbar />
      <div className={`h-[96px]`}></div>
      <div className="flex flex-row flex-1 p-0 m-0 justify-center">
        <LeftNavbarClient>{leftNavbar}</LeftNavbarClient>
        <MainContainer className="flex-grow w-full xl:max-w-[calc(1024px+4rem)]">{children}</MainContainer>
        <RightNavbarClient>{rightNavbar}</RightNavbarClient>
      </div>
    </div>
  );
};

export default BlogLayout;
