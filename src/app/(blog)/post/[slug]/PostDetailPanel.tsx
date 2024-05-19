import React from "react";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getTagBySlug } from "@/src/store/velite";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/markdown/TableOfContents";
import Link from "next/link";
import { isDefined } from "@/src/util/util";

const PostDetailPanel: React.FC<{
  slug: string;
}> = ({ slug }) => {
  const post = getPostBySlug(slug);
  if (!post) return <div></div>;

  const categories = post.categories.map((category) => getCategoryBySlug(category)).filter(isDefined);
  const columns = post.columns.map((column) => getColumnBySlug(column)).filter(isDefined);
  const tags = post.tags.map((tag) => getTagBySlug(tag)).filter(isDefined);

  return (
    <>
      <aside className={`prose-article-card flex flex-col`}>
        <span className={``}>发布于 {formatDate(post.created!)}</span>
        <span className={``}>更新于 {formatDate(post.updated!)}</span>
        <div className={`h-4`}></div>
        <h1 className={`not-prose text-h2`}>目录</h1>
        <TableOfContents className={`not-prose`} toc={post.toc} />
        <div className={`h-4`}></div>
        <h1 className={`not-prose text-h2`}>分类</h1>
        {categories?.length ? (
          <>
            <div className={`flex flex-row flex-wrap gap-x-2 prose-a:text-slate-700 dark:prose-a:text-slate-300`}>
              {categories.map((category) => {
                return (
                  <Link
                    href={category.permalink}
                    className={`transition-apple hover-text-color-href`}
                    key={category.slug}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <span className={``}>无</span>
        )}
        <div className={`h-4`}></div>
        <h1 className={`not-prose text-h2`}>专栏</h1>
        {columns?.length ? (
          <>
            <div className={`flex flex-row flex-wrap gap-x-2 prose-a:text-slate-700 dark:prose-a:text-slate-300`}>
              {columns.map((column) => {
                return (
                  <Link href={column.permalink} className={`transition-apple hover-text-color-href`} key={column.slug}>
                    {column.name}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <span className={``}>无</span>
        )}
        <div className={`h-4`}></div>
        <h1 className={`not-prose text-h2`}>标签</h1>
        {tags?.length ? (
          <>
            <div className={`flex flex-row flex-wrap gap-x-2 prose-a:text-slate-700 dark:prose-a:text-slate-300`}>
              {tags.map((tag) => {
                return (
                  <Link href={`/tag/${tag.slug}`} className={`transition-apple hover-text-color-href`} key={tag.slug}>
                    {tag.name}
                  </Link>
                );
              })}
            </div>
          </>
        ) : (
          <span className={``}>无</span>
        )}
        <div className={`h-16`}></div>
      </aside>
    </>
  );
};

export default PostDetailPanel;
