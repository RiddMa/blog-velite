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
      <div className="flex flex-row flex-1 p-0 justify-center">
        <LeftNavbar className="backdrop-blur-bg xl:backdrop-blur-none bg-black/50 xl:bg-transparent xl:mr-4">
          {leftNavbar}
        </LeftNavbar>
        <MainContainer className="flex-grow w-full max-w-[1024px]">{children}</MainContainer>
        <RightNavbar className="backdrop-blur-bg xl:backdrop-blur-none bg-black/50 xl:bg-transparent xl:ml-4">
          {rightNavbar}
        </RightNavbar>
      </div>
    </div>
  );
};

export default BlogLayout;
