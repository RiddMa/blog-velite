import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getPostsByColumn, getTagBySlug } from "@/src/store/velite";
import Link from "next/link";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/TableOfContents";
import { Button } from "@nextui-org/button";
import { Card } from "@nextui-org/card";

interface PostLayoutProps {
  params: {
    slug: string;
  };
  children?: React.ReactNode;
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const LeftContent: React.FC<{ slug: string }> = ({ slug }) => {
  const post = getPostBySlug(slug);
  if (!post) return <div></div>;
  const columns = post.columns.map((column) => getColumnBySlug(column)).filter(isDefined);
  if (!columns) return <div></div>;
  const sameColumnPosts = post.columns.map((column) => getPostsByColumn(column));

  return (
    <aside className={`prose-article-card flex flex-col`}>
      {columns.map((column, i) => (
        <>
          <Link href={column.permalink} className={`text-h2`} key={column.slug}>
            {column.name}
          </Link>
          <span className={`text-body`}>共{` ${sameColumnPosts[i].length} `}篇专栏文章</span>
          <div className={`h-8`}></div>
          {sameColumnPosts[i].length ? (
            <div className={`not-prose flex flex-col text-left gap-y-4`}>
              {sameColumnPosts[i].map((article) => (
                <Link href={article.permalink} key={article.slug} className={`group`}>
                  <Card className={`card drop-shadow-lg hover:drop-shadow-2xl gap-4 p-4`}>
                    <span
                      className={`line-clamp-2 transition-apple group-hover:text-sky-700 dark:group-hover:text-sky-400`}
                    >
                      {article.title}
                    </span>
                    {/*<span className={`text-caption text-color-caption line-clamp-3`}>{article.excerpt}</span>*/}
                    <caption className={`text-right`}>{formatDate(article.updated)}</caption>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className={`h-8`}></div>
        </>
      ))}
    </aside>
  );
};

const RightContent: React.FC<{ slug: string }> = ({ slug }) => {
  const post = getPostBySlug(slug);
  if (!post) return <div></div>;
  const categories = post.categories.map((category) => getCategoryBySlug(category)).filter(isDefined);
  const columns = post.columns.map((column) => getColumnBySlug(column)).filter(isDefined);
  const tags = post.tags.map((tag) => getTagBySlug(tag)).filter(isDefined);

  return (
    <>
      <aside className={`prose-article-card flex flex-col`}>
        <span className={``}>发布于 {formatDate(post.created)}</span>
        <span className={``}>更新于 {formatDate(post.updated)}</span>
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

const PostLayout: React.FC<PostLayoutProps> = ({ params, children }) => {
  return (
    <BlogLayout leftNavbar={<LeftContent slug={params.slug} />} rightNavbar={<RightContent slug={params.slug} />}>
      {children}
    </BlogLayout>
  );
};

export default PostLayout;
