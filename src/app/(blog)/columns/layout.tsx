import ThreeColumnLayout from "@/src/components/layout/ThreeColumnLayout";
import { Metadata } from "next";
import { globals } from "@/.velite";

export function generateMetadata(): Metadata {
  return {
    title: `专栏列表`,
    description: `探索博客专栏。| ${globals.metadata.description}`,
    openGraph: {
      title: `专栏列表`,
      description: `探索博客专栏。| ${globals.metadata.description}`,
    },
  };
}

export default ThreeColumnLayout;
