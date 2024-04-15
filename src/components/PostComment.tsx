"use client";

import React from "react";
import Giscus from "@giscus/react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

const PostComment: React.FC = () => {
  const [darkMode, setDarkMode] = usePageStateStore(useShallow((state) => [state.darkMode, state.setDarkMode]));

  return (
    <>
      <Giscus
        id="comments"
        repo="RiddMa/ridd-strapi-gatsby-blog-giscus"
        repoId="R_kgDOJlKe7g"
        category="Announcements"
        categoryId="DIC_kwDOJlKe7s4CWm_0"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={`${darkMode ? "dark" : "light"}`}
        lang="zh-CN"
      />
    </>
  );
};

export default PostComment;
