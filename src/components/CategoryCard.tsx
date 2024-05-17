"use client";

import React, { useState } from "react";
import { Card } from "@nextui-org/card";
import { motion } from "framer-motion";
import { Category } from "@/.velite";
import Link from "next/link";
import { getPostsByCategory } from "@/src/store/velite";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { MotionH1 } from "@/src/app/(blog)/post/[slug]/MotionH1";
import { MotionDiv } from "@/src/components/transition/MotionDiv";

interface ICategoryCardProps {
  item: Category;
  imgWidth: number;
}

export const CategoryCard: React.FC<ICategoryCardProps> = ({ item: category, imgWidth }) => {
  const { permalink, name, slug, description } = category;
  const posts = getPostsByCategory(slug);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={permalink} className={`card`}>
      <motion.div
        key={`card-container-${permalink}`}
        layoutId={`card-container-${permalink}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group prose-article-card flex flex-col p-4 gap-4`}
      >
        <MotionH1 keyName={`category-title-${permalink}`} className="not-prose line-clamp-2 overflow-ellipsis text-h2">
          {name}
        </MotionH1>
        <MotionDiv keyName={`category-description-${permalink}`} className="line-clamp-6 overflow-ellipsis">
          <BlogHtmlRenderer html={description} />
        </MotionDiv>
        <div className="flex flex-row m-0 opacity-80 w-full relative">
          <div className="grow"></div>
          <span className="text-body text-color-caption inline-block text-nowrap ml-4">{posts.length}篇文章</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
