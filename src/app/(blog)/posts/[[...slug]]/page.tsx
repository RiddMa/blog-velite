import { Post, posts } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";

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
  const columns = params.column ? params.column.split(",") : [];
  const categories = params.category ? params.category.split(",") : [];
  const tags = params.tag ? params.tag.split(",") : [];

  return posts.filter((post) => {
    const columnMatch = columns.length > 0 ? columns.some((col) => post.columns.includes(col)) : true;
    const categoryMatch = categories.length > 0 ? categories.some((cat) => post.categories.includes(cat)) : true;
    const tagMatch = tags.length > 0 ? tags.some((tag) => post.tags.includes(tag)) : true;
    return columnMatch || categoryMatch || tagMatch;
  });
}

export default function PostListPage({ params, searchParams }: PostListProps) {
  const displayedPosts = filterPosts(posts, searchParams);

  return (
    <>
      <main className="flex flex-col gap-8 px-content">
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
        {/*<pre>{JSON.stringify(searchParams, null, 2)}</pre>*/}
        <p className="prose-text text-end text-color-caption">{posts.length}篇文章</p>
        <WaterfallGrid posts={displayedPosts} />
      </main>
    </>
  );
}
