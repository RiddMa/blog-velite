import React from "react";
import BlogLayout from "@/src/app/(blog)/layout/layout";
import { getCategoryBySlug, getColumnBySlug, getPostBySlug, getPostsByColumn, getTagBySlug } from "@/src/store/velite";
import Link from "next/link";
import { formatDate } from "@/src/store/day";
import TableOfContents from "@/src/components/TableOfContents";

interface PostLayoutProps {
  params: {
    slug: string;
  };
  children?: React.ReactNode;
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const LeftContent: React.FC<{ slug: string }> = ({ slug }) => {
  return <aside></aside>;
};

const RightContent: React.FC<{ slug: string }> = ({ slug }) => {
  return (
    <>
      <aside className={`text-body flex flex-col space-y-2 rounded-3xl drop-shadow-2xl`}></aside>
    </>
  );
};

const PostLayout: React.FC<PostLayoutProps> = ({ params, children }) => {
  return (
    <BlogLayout leftNavbar={<LeftContent slug={params.slug} />} rightNavbar={<RightContent slug={params.slug} />}>
      {children}
    </BlogLayout>
  );
};

export default PostLayout;
