import React from "react";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getTagBySlug } from "@/src/store/velite";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/markdown/TableOfContents";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { isDefined } from "@/src/lib/util";
import VisitCountDisplay from "@/src/components/VisitCountDisplay";

const PostDetailPanel: React.FC<{
  slug: string;
}> = ({ slug }) => {
  const post = getPostBySlug(slug);
  if (!post) return <div></div>;

  const categories = post.categories.map((category) => getCategoryBySlug(category)).filter(isDefined);
  const columns = post.columns.map((column) => getColumnBySlug(column)).filter(isDefined);
  // const tags = post.tags.map((tag) => getTagBySlug(tag)).filter(isDefined);
  const tags = post.tags;

  return (
    <>
      <aside className={`prose-article flex flex-col`}>
        <span>发布于 {formatDate(post.created!)}</span>
        <span>编辑于 {formatDate(post.updated!)}</span>
        <span>
          浏览量 <VisitCountDisplay />
        </span>
        <div className={`h-4`}></div>
        <h2>目录</h2>
        <TableOfContents className={`not-prose`} toc={post.toc} />
        <div className={`h-4`}></div>
        <h2>分类</h2>
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
          <span>无</span>
        )}
        <div className={`h-4`}></div>
        <h2>专栏</h2>
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
        <h2>标签</h2>
        {tags?.length ? (
          <>
            <div className={`flex flex-row flex-wrap gap-x-3 prose-a:text-slate-700 dark:prose-a:text-slate-300`}>
              {tags.map((tag, index) => (
                <span key={index}>{tag}</span>
              ))}
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
