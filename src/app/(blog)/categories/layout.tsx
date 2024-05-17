import ThreeColumnLayout from "@/src/components/layout/ThreeColumnLayout";
import { Metadata } from "next";
import { globals } from "@/.velite";

export function generateMetadata(): Metadata {
  return {
    title: `分类列表`,
    description: `探索博客分类。| ${globals.metadata.description}`,
    openGraph: {
      title: `分类列表`,
      description: `探索博客分类。| ${globals.metadata.description}`,
    },
  };
}

export default ThreeColumnLayout;
