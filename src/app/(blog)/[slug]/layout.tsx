import BlogLayout from "@/src/components/layout/layout";
import React from "react";
import PageDetailPanel from "@/src/app/(blog)/[slug]/PageDetailPanel";

const Layout: React.FC<{ children: React.ReactNode; params: { slug: string } }> = ({ children, params }) => {
  return <BlogLayout rightNavbar={<PageDetailPanel slug={params.slug} />}>{children}</BlogLayout>;
};

export default Layout;
