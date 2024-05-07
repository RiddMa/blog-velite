import { Post, posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import PostCard from "@/src/components/PostCard";
import { filterPosts } from "@/src/util/util";

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

export default function PostListPage({ params, searchParams }: PostListProps) {
  const displayedPosts = filterPosts(posts, searchParams);

  return (
    <>
      <main className="flex flex-col gap-4 px-content">
        <nav className="flex flex-row gap-4 items-baseline">
          <Link href={`/posts`} className={`text-h0`}>
            文章
          </Link>
          <Link href={`/categories`} className={`text-h2`}>
            分类
          </Link>
          <Link href={`/columns`} className={`text-h2`}>
            专栏
          </Link>
        </nav>
        <div className={`prose-article`}>
          <p className="text-end opacity-80">{displayedPosts.length}篇文章</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={displayedPosts} CardComponent={PostCard} />
      </main>
    </>
  );
}
