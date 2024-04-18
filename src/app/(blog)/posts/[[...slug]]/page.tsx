import { posts } from "@/.velite";
import config from "@/blog.config";
import { notFound } from "next/navigation";
import ContentCard from "@/src/components/ContentCard";
import Link from "next/link";
import { getCategoryBySlug } from "@/src/store/velite";
import { formatDate } from "@/src/store/day";
import { Icon } from "@iconify-icon/react";
import MyPagination from "@/src/components/MyPagination";

interface PostListProps {
  params: {
    slug: string;
  };
}

export default function PostListPage({ params }: PostListProps) {
  const pageNumber = params.slug ? parseInt(params.slug) : 1;
  const postsPerPage = config.POSTS_PER_PAGE || 25;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  if (!pageNumber || pageNumber < 1 || pageNumber > totalPages) {
    return notFound();
  }

  const displayedPosts = posts.slice(postsPerPage * (pageNumber - 1), postsPerPage * pageNumber);
  const pagination = { pageNumber, totalPages };

  return (
    <>
      <div className="flex flex-col gap-8 px-content">
        <p className="px-content prose-text text-end text-color-caption">{posts.length}篇文章</p>
        {displayedPosts.map((post) => {
          return (
            <Link key={post.slug} href={post.permalink}>
              <ContentCard
                cover={post.cover}
                title={<h1 className="line-clamp-2 overflow-ellipsis">{post.title}</h1>}
                excerpt={
                  <div
                    className="m-0 overflow-ellipsis line-clamp-2 xl:line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  />
                }
                caption={
                  <div className={`flex flex-row m-0`}>
                    {/*<div className={`my-0 flex flex-row gap-2 xl:gap-4 p-0`}>*/}
                    {/*  {post.categories.map((slug) => {*/}
                    {/*    const category = getCategoryBySlug(slug);*/}
                    {/*    if (!category) return <></>;*/}
                    {/*    return (*/}
                    {/*      <Link key={category.slug} href={category.permalink}>*/}
                    {/*        <button*/}
                    {/*          className={`btn btn-sm text-body text-color-caption opacity-80 hover:opacity-100 transition-apple text-href`}*/}
                    {/*        >*/}
                    {/*          {category.name}*/}
                    {/*        </button>*/}
                    {/*      </Link>*/}
                    {/*    );*/}
                    {/*  })}*/}
                    {/*</div>*/}
                    <div className={`my-0 p-0 line-clamp-1 text-body text-color-caption`}>
                      {post.tags.map((tag) => (
                        <>{tag}&nbsp;&nbsp;&nbsp;</>
                      ))}
                    </div>
                    <div className={`grow`}></div>
                    <span className={`text-body text-color-caption inline-block text-nowrap ml-4`}>
                      {formatDate(post.updated)}
                    </span>
                  </div>
                }
              />
            </Link>
          );
        })}
      </div>
      <MyPagination pageNumber={pageNumber} totalPages={totalPages} baseUrl={`/posts`} />
    </>
  );
}
