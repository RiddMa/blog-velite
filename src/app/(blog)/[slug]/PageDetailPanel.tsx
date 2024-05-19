import React from "react";
import { getPageBySlug } from "@/src/store/velite";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/markdown/TableOfContents";

const PageDetailPanel: React.FC<{
  slug: string;
}> = ({ slug }) => {
  const page = getPageBySlug(slug);
  if (!page) return <div></div>;

  return (
    <>
      <aside className={`prose-article-card flex flex-col`}>
        <span className={``}>发布于 {formatDate(page.created!)}</span>
        <span className={``}>更新于 {formatDate(page.updated!)}</span>
        <div className={`h-4`}></div>
        <h1 className={`not-prose text-h2`}>目录</h1>
        <TableOfContents className={`not-prose`} toc={page.toc} />
      </aside>
    </>
  );
};

export default PageDetailPanel;
