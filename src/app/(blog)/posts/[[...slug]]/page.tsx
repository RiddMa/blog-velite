import { posts } from "@/.velite";
import config from "@/blog.config";

interface PostListProps {
  params: {
    slug: string;
  };
}

export default function PostListPage({ params }: PostListProps) {
  const pageNumber = params.slug ? parseInt(params.slug) : 1;
  const postsPerPage = config.POSTS_PER_PAGE || 25;

  const displayedPosts = posts.slice(postsPerPage * (pageNumber - 1), postsPerPage * pageNumber);
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / postsPerPage),
  };

  return (
    <>
      <div>{JSON.stringify(params, null, 2)}</div>
      <div>
        <pre>{JSON.stringify(displayedPosts, null, 2)}</pre>
      </div>
    </>
  );
}
