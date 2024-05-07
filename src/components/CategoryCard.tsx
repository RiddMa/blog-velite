"use client";

import React, { useState } from "react";
import { Card } from "@nextui-org/card";
import { motion } from "framer-motion";
import { Category } from "@/.velite";
import Link from "next/link";
import { getPostsByCategory } from "@/src/store/velite";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";

interface ICategoryCardProps {
  item: Category;
  imgWidth: number;
}

export const CategoryCard: React.FC<ICategoryCardProps> = ({ item: category, imgWidth }) => {
  const { permalink, name, slug, description } = category;
  const posts = getPostsByCategory(slug);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={permalink}>
      <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card
          className={`group transition-apple card drop-shadow-lg hover:drop-shadow-2xl prose-article-card gap-4 p-4`}
        >
          <div>
            <h1 className="not-prose line-clamp-2 overflow-ellipsis text-h2">{name}</h1>
            <div className="line-clamp-6 overflow-ellipsis">
              <BlogHtmlRenderer html={description} />
            </div>
          </div>
          <div className="flex flex-row m-0 opacity-80 w-full relative">
            <div className="grow"></div>
            <span className="text-body text-color-caption inline-block text-nowrap ml-4">{posts.length}篇文章</span>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
