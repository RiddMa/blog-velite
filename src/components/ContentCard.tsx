"use client";

import React, { useRef } from "react";
import { Image as VeliteImage } from "velite";
import Image from "next/image";
import { clsname } from "@/src/util/clsname";

interface IContentCardProps {
  className?: string;
  cover?: VeliteImage;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  caption?: React.ReactNode;
}

export const ContentCard: React.FC<IContentCardProps> = ({ className, cover, title, excerpt, caption }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      key={`card-container-${title}`}
      className={clsname(`card prose-article-card flex flex-col p-4`, className)}
    >
      {cover && (
        <div className="relative">
          <Image
            src={cover.src}
            alt={`cover image`}
            className="rounded-2xl"
            width={cover.width}
            height={cover.height}
            placeholder="blur"
            blurDataURL={cover.blurDataURL}
            priority={true}
            quality={40}
            style={{ margin: 0 }}
          />
        </div>
      )}
      <div className="relative">
        <h1
          key={`content-title-${title}`}
          data-flip-id={`content-title-${title}`}
          className="line-clamp-2 overflow-ellipsis"
        >
          {title}
        </h1>
        {excerpt}
      </div>
      <div className="text-caption flex flex-row m-0 opacity-80 w-full relative">
        <div className="grow"></div>
        <span className="inline-block text-nowrap ml-4">{caption}</span>
      </div>
    </div>
  );
};

export default ContentCard;
