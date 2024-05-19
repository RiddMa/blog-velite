import { posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import PostCard from "@/src/components/PostCard";
import { filterPosts } from "@/src/util/util";

interface PostListProps {
  params: {
    query: string;
  };
  searchParams: {
    column?: string;
    category?: string;
    tag?: string;
  };
}

export default function PostListPage({ searchParams }: PostListProps) {
  const displayedPosts = filterPosts(posts, searchParams);

  return (
    <>
      <div className="flex flex-col">
        <nav className="flex flex-row gap-4 items-baseline">
          <Link href={`/posts`} className={`text-h0 text-href`}>
            文章
          </Link>
          <Link href={`/categories`} className={`text-h2 text-href`}>
            分类
          </Link>
          <Link href={`/columns`} className={`text-h2 text-href`}>
            专栏
          </Link>
        </nav>
        <div className={`prose-article px-content`}>
          <p className="text-end opacity-80">{displayedPosts.length}篇文章</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
      </div>
    </>
  );
}
