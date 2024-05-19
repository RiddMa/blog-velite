import { Column, columns } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import ColumnCard from "@/src/components/ColumnCard";
import BlogIndexNav from "@/src/components/layout/BlogIndexNav";
import React from "react";

interface ColumnListProps {
  params: {
    slug: string;
  };
}

export default function ColumnListPage({ params }: ColumnListProps) {
  return (
    <>
      <div className="flex flex-col">
        <BlogIndexNav path={`/columns`} />
        <div className="prose-article px-content">
          <p className="text-end opacity-80">{columns.length}个专栏</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={columns} CardComponent={ColumnCard} />
      </div>
    </>
  );
}
