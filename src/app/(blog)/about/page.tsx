// pages/about.js
import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";
import type { Metadata } from "next";
import { aboutPage } from "@/.velite";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";

export function generateMetadata(): Metadata {
  return { title: aboutPage.title, description: aboutPage.excerpt };
}

function AboutPage() {
  return (
    <BlogLayout>
      <article className="prose-article">
        <BlogHtmlRenderer html={aboutPage.content} imgMap={aboutPage.images} />
      </article>
    </BlogLayout>
  );
}

export default AboutPage;
