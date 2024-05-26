import BlogLayout from "@/src/components/layout/BlogLayout";
import React from "react";
import { Metadata } from "next";
import { globals } from "@/.velite";

export function generateMetadata(): Metadata {
  return {
    title: `相册`,
    description: `探索摄影作品。| ${globals.metadata.description}`,
    openGraph: {
      title: `相册`,
      description: `探索摄影作品。| ${globals.metadata.description}`,
    },
  };
}

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children }) => {
  return <BlogLayout>{children}</BlogLayout>;
};

export default Layout;
