import React from "react";
import type { Metadata } from "next";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { getPageBySlug } from "@/src/store/velite";

export function generateMetadata(): Metadata {
  const { title, excerpt } = getPageBySlug("about")!;
  return { title: title, description: excerpt };
}

function AboutPage() {
  const { content, images } = getPageBySlug("about")!;
  return (
    <article className="prose-article">
      <BlogHtmlRenderer html={content} imgMap={images} />
    </article>
  );
}

export default AboutPage;
