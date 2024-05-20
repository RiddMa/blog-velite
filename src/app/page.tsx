import React from "react";
import BlogLayout from "@/src/components/layout/BlogLayout";

export default function Home() {
  return (
    <>
      <BlogLayout className="flex flex-col">
        <h1>Welcome to my blog!</h1>
      </BlogLayout>
    </>
  );
}
