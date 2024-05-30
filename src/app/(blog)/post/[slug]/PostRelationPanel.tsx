import React from "react";
import { getColumnBySlug, getPostBySlug, getPostsByColumn } from "@/src/store/velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { formatDate } from "@/src/store/day";
import { isDefined } from "@/src/lib/util";

const PostRelationPanel: React.FC<{
  slug: string;
}> = ({ slug }) => {
  const post = getPostBySlug(slug);
  if (!post) return <div></div>;
  const columns = post.columns.map((column) => getColumnBySlug(column)).filter(isDefined);
  if (!columns) return <div></div>;
  const sameColumnPosts = post.columns.map((column) => getPostsByColumn(column));

  return (
    <aside className={`prose-article transition-apple flex flex-col`}>
      {columns.map((column, i) => (
        <>
          <h2>
            <Link href={column.permalink} key={column.slug}>
              {column.name}
            </Link>
          </h2>
          <span>专栏共{` ${sameColumnPosts[i].length} `}篇文章</span>
          <div aria-hidden={true} className={`h-4`}></div>
          {sameColumnPosts[i].length &&
            sameColumnPosts[i].map((article) => (
              <div key={article.slug} className={`not-prose card-sm my-2 -mx-4 xl:mx-0`}>
                <Link href={article.permalink} className={`flex flex-col p-4 xl:p-2`}>
                  <span className={`text-left line-clamp-2 mb-1`}>{article.title}</span>
                  <span className={`text-right text-caption`}>{formatDate(article.updated!)}</span>
                </Link>
              </div>
            ))}
          <div aria-hidden={true} className={`h-8`}></div>
        </>
      ))}
    </aside>
  );
};

export default PostRelationPanel;
