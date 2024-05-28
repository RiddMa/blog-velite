"use client";

import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Category } from "@/.velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { getPostsByCategory } from "@/src/store/velite";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { cn } from "@/src/lib/cn";
import Image from "next/image";

interface ICategoryCardProps {
  item: Category;
  imgWidth: number;
  isMobile?: boolean;
}

export const CategoryCard: React.FC<ICategoryCardProps> = ({ item: category, imgWidth, isMobile = false }) => {
  const { permalink, name, slug, cover, description } = category;
  const posts = getPostsByCategory(slug);

  const cardRef = useRef<HTMLDivElement>(null);

  const imgHeight = useMemo(() => {
    if (cover) {
      const aspectRatio = cover.width / cover.height;
      return imgWidth ? imgWidth / aspectRatio : cover.height;
    }
    return 0;
  }, [cover, imgWidth]);

  return (
    <div ref={cardRef} key={`card-container-${permalink}`}>
      <Link href={permalink} className={cn(`card prose-article-card flex flex-col p-4`)}>
        {cover && (
          <div className="relative z-[1]">
            <Image
              src={cover.src}
              alt={`cover image`}
              className="rounded-2xl"
              width={imgWidth}
              height={imgHeight}
              placeholder="blur"
              blurDataURL={cover.blurDataURL}
              priority={true}
              quality={40}
              style={{ margin: 0 }}
            />
          </div>
        )}
        <div className="relative z-[2]">
          <h1
            key={`category-title-${permalink}`}
            data-flip-id={`category-title-${permalink}`}
            className="line-clamp-2 overflow-ellipsis"
          >
            {name}
          </h1>
          {description && (
            <div className="line-clamp-5 overflow-ellipsis">
              <BlogHtmlRenderer html={description} />
            </div>
          )}
        </div>

        <div className="text-caption flex flex-row m-0 opacity-80 w-full relative">
          <div className="grow"></div>
          <span className="inline-block text-nowrap ml-4">{posts.length}篇文章</span>
        </div>
      </Link>
    </div>
  );
};

export default CategoryCard;
