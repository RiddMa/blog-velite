import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getPostsByColumn, getTagBySlug } from "@/src/store/velite";
import Link from "next/link";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/TableOfContents";

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
    <>
      {/*{JSON.stringify(post, null, 4)}*/}
      {columns.map((column, i) => (
        <>
          <Link href={column.permalink} className={`text-h1 transition-apple hover-text-color-href`} key={column.slug}>
            {column.name}
          </Link>
          <br />
          <span className={`text-body`}>共{` ${sameColumnPosts[i].length} `}篇专栏文章</span>
          <br />
          {sameColumnPosts[i].length ? (
            <div className={`not-prose mt-8 flex flex-col space-y-8 text-left`}>
              {sameColumnPosts[i].map((article) => (
                <Link href={article.permalink} className={``} key={article.slug}>
                  <span className={`transition-apple text-body text-color-body hover-text-color-href line-clamp-2`}>
                    {article.title}
                  </span>
                  <span className={`text-caption text-color-caption line-clamp-3`}>{article.excerpt}</span>
                  <div className={`text-caption text-color-caption text-right`}>{formatDate(article.updated)}</div>
                </Link>
              ))}
            </div>
          ) : (
            <></>
          )}
          <div className={`h-8`}></div>
        </>
      ))}
    </>
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
      <aside className={`text-body flex flex-col space-y-2 rounded-3xl drop-shadow-2xl`}>
        <span className={``}>{formatDate(post.created)}发布</span>
        <span className={``}>{formatDate(post.updated)}更新</span>
        <span className={`text-h1`}>目录</span>
        <TableOfContents toc={post.toc} />
        <div className={`h-4`}></div>
        <span className={`text-h1`}>分类</span>
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
        <span className={`text-h1`}>专栏</span>
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
        <span className={`text-h1`}>标签</span>
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
