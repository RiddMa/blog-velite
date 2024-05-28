"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Column } from "@/.velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { getPostsByColumn } from "@/src/store/velite";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { MotionH1 } from "@/src/components/transition/MotionH1";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import { cn } from "@/src/lib/cn";

interface IColumnCardProps {
  item: Column;
  imgWidth: number;
  isMobile?: boolean;
}

export const ColumnCard: React.FC<IColumnCardProps> = ({ item: column, imgWidth, isMobile = false }) => {
  const { permalink, name, slug, description } = column;
  const posts = getPostsByColumn(slug);

  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={cardRef} key={`card-container-${permalink}`}>
      <Link href={permalink} className={cn(`card prose-article-card flex flex-col p-4`)}>
        <div className="relative z-[2]">
          <h1
            key={`column-title-${permalink}`}
            data-flip-id={`column-title-${permalink}`}
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

export default ColumnCard;
