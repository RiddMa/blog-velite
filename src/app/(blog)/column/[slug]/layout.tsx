import BlogLayout from "@/src/components/layout/layout";
import React, { Suspense } from "react";
import PostFilterWidget from "@/src/components/PostFilterWidget";

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children, params }) => {
  return (
    <BlogLayout
      leftNavbar={
        <Suspense>
          <PostFilterWidget useColumn={params.slug} />
        </Suspense>
      }
    >
      {children}
    </BlogLayout>
  );
};

export default Layout;