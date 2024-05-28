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
                  <div className={`card drop-shadow-lg hover:drop-shadow-2xl gap-4 p-4`}>
                    <span
                      className={`line-clamp-2 transition-apple group-hover:text-sky-700 dark:group-hover:text-sky-400`}
                    >
                      {article.title}
                    </span>
                    {/*<span className={`text-caption text-color-caption line-clamp-3`}>{article.excerpt}</span>*/}
                    <span className={`text-right text-caption`}>{formatDate(article.updated!)}</span>
                  </div>
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

export default PostRelationPanel;
