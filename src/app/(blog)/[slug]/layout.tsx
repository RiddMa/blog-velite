import BlogLayout from "@/src/components/layout/BlogLayout";
import React from "react";
import PageDetailPanel from "@/src/app/(blog)/[slug]/PageDetailPanel";

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children, params }) => {
  return (
    <BlogLayout rightNavbar={<PageDetailPanel slug={params.slug} />} className="px-post">
      {children}
    </BlogLayout>
  );
};

export default Layout;
