import React from "react";
import type { Metadata } from "next";
import { aboutPage } from "@/.velite";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";

export function generateMetadata(): Metadata {
  return { title: aboutPage.title, description: aboutPage.excerpt };
}

function AboutPage() {
  return (
    <article className="prose-article">
      <BlogHtmlRenderer html={aboutPage.content} imgMap={aboutPage.images} />
    </article>
  );
}

export default AboutPage;
