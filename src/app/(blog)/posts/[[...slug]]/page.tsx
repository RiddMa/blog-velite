import { Post, posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";

interface PostListProps {
  params: {
    slug: string;
  };
  searchParams: {
    column?: string;
    category?: string;
    tag?: string;
  };
}

// Function to filter posts based on search parameters
function filterPosts(posts: Post[], params: PostListProps["searchParams"]): Post[] {
  return posts.filter((post) => {
    const columnMatch = params.column ? post.columns.includes(params.column) : true;
    const categoryMatch = params.category ? post.categories.includes(params.category) : true;
    const tagMatch = params.tag ? post.tags.includes(params.tag) : true;
    return columnMatch && categoryMatch && tagMatch;
  });
}

export default function PostListPage({ params, searchParams }: PostListProps) {
  const displayedPosts = filterPosts(posts, searchParams);

  return (
    <>
      <main className="flex flex-col gap-8 px-content">
        <p className="prose-text text-end text-color-caption">{posts.length}篇文章</p>
        <WaterfallGrid posts={displayedPosts} />
        {/*{displayedPosts.map((post) => {*/}
        {/*  return (*/}
        {/*    <Link key={post.slug} href={post.permalink}>*/}
        {/*      <ContentCard*/}
        {/*        cover={post.cover}*/}
        {/*        title={<h1 className="line-clamp-2 overflow-ellipsis">{post.title}</h1>}*/}
        {/*        excerpt={*/}
        {/*          <div*/}
        {/*            className="m-0 overflow-ellipsis line-clamp-2 xl:line-clamp-3"*/}
        {/*            dangerouslySetInnerHTML={{ __html: post.excerpt }}*/}
        {/*          />*/}
        {/*        }*/}
        {/*        caption={*/}
        {/*          <div className={`flex flex-row m-0 opacity-80`}>*/}
        {/*            /!*<div className={`my-0 flex flex-row gap-2 xl:gap-4 p-0`}>*!/*/}
        {/*            /!*  {post.categories.map((slug) => {*!/*/}
        {/*            /!*    const category = getCategoryBySlug(slug);*!/*/}
        {/*            /!*    if (!category) return <></>;*!/*/}
        {/*            /!*    return (*!/*/}
        {/*            /!*      <Link key={category.slug} href={category.permalink}>*!/*/}
        {/*            /!*        <button*!/*/}
        {/*            /!*          className={`btn btn-sm text-body text-color-caption opacity-80 hover:opacity-100 transition-apple text-href`}*!/*/}
        {/*            /!*        >*!/*/}
        {/*            /!*          {category.name}*!/*/}
        {/*            /!*        </button>*!/*/}
        {/*            /!*      </Link>*!/*/}
        {/*            /!*    );*!/*/}
        {/*            /!*  })}*!/*/}
        {/*            /!*</div>*!/*/}
        {/*            <div className={`my-0 p-0 line-clamp-1 text-body text-color-caption `}>*/}
        {/*              {post.tags.map((tag) => (*/}
        {/*                <>{tag}&nbsp;&nbsp;&nbsp;</>*/}
        {/*              ))}*/}
        {/*            </div>*/}
        {/*            <div className={`grow`}></div>*/}
        {/*            <span className={`text-body text-color-caption inline-block text-nowrap ml-4`}>*/}
        {/*              {formatDate(post.updated)}*/}
        {/*            </span>*/}
        {/*          </div>*/}
        {/*        }*/}
        {/*      />*/}
        {/*    </Link>*/}
        {/*  );*/}
        {/*})}*/}
        {/*<MyPagination pageNumber={pageNumber} totalPages={totalPages} baseUrl={`/posts`} />*/}
      </main>
    </>
  );
}
