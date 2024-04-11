import { posts } from "@/.velite";
export default function BlogPage() {
  const pageNumber = 1;
  // const initialDisplayPosts = posts.slice(POSTS_PER_PAGE * (pageNumber - 1), POSTS_PER_PAGE * pageNumber);
  // const pagination = {
  //   currentPage: pageNumber,
  //   totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  // };

  return <>{JSON.stringify(posts, null, 2)}</>;
}
