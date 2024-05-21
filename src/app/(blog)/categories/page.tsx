import { categories } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import CategoryCard from "@/src/app/(blog)/categories/CategoryCard";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";

interface CategoryListProps {
  params: {
    slug: string;
  };
}

export default function CategoryListPage({ params }: CategoryListProps) {
  return (
    <>
      <main className="flex flex-col">
        <BlogIndexNav path={`/categories`} />
        <p className="prose-article text-end opacity-80">{categories.length}个分类</p>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={categories} CardComponent={CategoryCard} />
      </main>
    </>
  );
}
