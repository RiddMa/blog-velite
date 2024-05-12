import BlogLayout from "@/src/components/layout";
import React from "react";

const PostListLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BlogLayout leftNavbar={<div>Left navbar</div>} rightNavbar={<div>Right navbar</div>}>
      {children}
    </BlogLayout>
  );
};

export default PostListLayout;
