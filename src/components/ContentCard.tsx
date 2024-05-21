"use client";

import React, { useMemo, useRef, useState } from "react";
import { Image as VeliteImage } from "velite";
import Image from "next/image";
import { Card } from "@nextui-org/card";
import { Image as NextUIImage } from "@nextui-org/image";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { getPostsByCategory } from "@/src/store/velite";
import Link from "next/link";
import { clsname } from "@/src/util/clsname";

interface IContentCardProps {
  cover?: VeliteImage;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  caption?: React.ReactNode;
}

export const ContentCard: React.FC<IContentCardProps> = ({ cover, title, excerpt, caption }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={cardRef} key={`card-container-${title}`} className={clsname(`card prose-article-card flex flex-col p-4`)}>
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
