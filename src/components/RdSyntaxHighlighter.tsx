"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDarkTransparent } from "@/src/styles/oneDarkTransparent";
import { oneLightTransparent } from "@/src/styles/oneLightTransparent";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

export function RdSyntaxHighlighter(props: { language: any; value: any }) {
  const [darkMode] = usePageStateStore(useShallow((state) => [state.darkMode]));

  return (
    <SyntaxHighlighter
      wrapLines={false}
      wrapLongLines={false}
      style={darkMode ? oneDarkTransparent : oneLightTransparent}
      language={props.language}
      showLineNumbers={true}
      PreTag="div"
      customStyle={{
        margin: "1rem 0",
        padding: "0.75rem 0.5rem",
        borderRadius: "1rem",
        background: `${darkMode ? "hsl(220deg 13% 18% / 70%)" : "hsl(230deg 1% 98% /60%)"}`,
      }}
    >
      {String(props.value).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
}
