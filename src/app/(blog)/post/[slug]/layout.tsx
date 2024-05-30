import BlogLayout from "@/src/components/layout/BlogLayout";
import React, { Suspense } from "react";
import PostDetailPanel from "@/src/app/(blog)/post/[slug]/PostDetailPanel";
import PostRelationPanel from "@/src/app/(blog)/post/[slug]/PostRelationPanel";

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children, params }) => {
  return (
    <BlogLayout
      leftNavbar={<PostRelationPanel slug={params.slug} />}
      rightNavbar={<PostDetailPanel slug={params.slug} />}
      className="px-post"
    >
      {children}
    </BlogLayout>
  );
};

export default Layout;
