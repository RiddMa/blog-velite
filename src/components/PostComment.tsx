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
        repo="RiddMa/blog-velite"
        repoId="R_kgDOLs3K6A"
        category="Comments"
        categoryId="DIC_kwDOLs3K6M4CfTSA"
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="1"
        inputPosition="top"
        theme={`${darkMode ? "dark" : "light"}`}
        lang="zh-CN"
      />
    </>
  );
};

export default PostComment;
