import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getPostsByColumn, getTagBySlug } from "@/src/store/velite";
import Link from "next/link";
import { formatDate } from "@/src/store/day";

interface PostLayoutProps {
  params: {
    slug: string;
  };
  children?: React.ReactNode;
}

function isDefined<T>(value: T | undefined): value is T {
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

// const NewComponent: React.FC<{ slug: string }> = ({ slug }) => {
//   const post = getPostBySlug(slug);
//   return <div>{JSON.stringify(post, null, 4)}</div>;
// };

const PostLayout: React.FC<PostLayoutProps> = ({ params, children }) => {
  return (
    <BlogLayout leftNavbar={<LeftContent slug={params.slug} />} rightNavbar={<div></div>}>
      {children}
    </BlogLayout>
  );
};

export default PostLayout;
