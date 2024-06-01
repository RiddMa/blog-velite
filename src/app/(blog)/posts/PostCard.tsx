"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { gsap, useGSAP } from "@/src/lib/gsap";
import { cn } from "@/src/lib/cn";

interface IPostCardProps {
  item: Post;
  imgWidth: number;
  isMobile?: boolean;
}

const PostCard: React.FC<IPostCardProps> = ({ item: post, imgWidth, isMobile = false }) => {
  const { draft, permalink, cover, title, excerpt, tags, updated } = post;

  const cardRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const excerptRef = useRef<HTMLDivElement>(null);
  const imgHeight = useMemo(() => {
    if (cover) {
      const aspectRatio = cover.width / cover.height;
      return imgWidth ? imgWidth / aspectRatio : cover.height;
    }
    return 0;
  }, [cover, imgWidth]);
  const [isHovered, setIsHovered] = useState(false);
  // const [isClicked, setIsClicked] = useState(false);

  useGSAP(() => {
    if (excerptRef.current) gsap.set(excerptRef.current, { opacity: 0, maxHeight: 0, display: "none" });
  }, []);
  useGSAP(() => {
    const hoverOffset = imgRef.current?.clientHeight || 0;
    const tl = gsap.timeline();
    if (isHovered) {
      if (imgRef.current) tl.to(imgRef.current, { opacity: 0.1, filter: "blur(16px) saturate(150%)" });
      if (titleRef.current) tl.to(titleRef.current, { translateY: -hoverOffset }, "<");
      if (excerptRef.current)
        tl.to(
          excerptRef.current,
          { translateY: -hoverOffset, maxHeight: hoverOffset, opacity: 1, display: "block" },
          "<",
        );
    } else {
      if (imgRef.current) tl.to(imgRef.current, { opacity: 1, filter: "none" });

      if (titleRef.current) tl.to(titleRef.current, { translateY: 0 }, "<");
      if (excerptRef.current)
        tl.to(excerptRef.current, { translateY: 0, maxHeight: 0, opacity: 0, display: "none" }, "<");
    }
  }, [isHovered]);

  if (draft) {
    return (
      <div key={`card-container-${permalink}`} className={cn("rd-card prose-article-card flex flex-col p-4")}>
        <div className="rd-card absolute inset-0 w-full h-full bg-white-50/50 dark:bg-black/50 z-[3] flex items-center justify-center backdrop-blur-[1px]">
          <h1 className="w-fit">填坑中…</h1>
        </div>
        {cover && (
          <div className="relative z-[1]">
            <Image
              ref={imgRef}
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
            key={`post-title-${permalink}`}
            data-flip-id={`post-title-${permalink}`}
            className="line-clamp-2 overflow-ellipsis"
          >
            {title}
          </h1>
        </div>

        <div className="text-caption flex flex-row m-0 opacity-80 w-full relative">
          <div className="my-0 p-0 line-clamp-1 overflow-ellipsis break-after-all">
            {tags.map((tag, index) => (
              <span key={index}>{tag} &nbsp;</span>
            ))}
          </div>
          <div className="grow"></div>
          <span className="inline-block text-nowrap ml-4">{formatDate(updated!)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      key={`card-container-${permalink}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      // onClick={() => setIsClicked(true)}
    >
      <Link href={permalink} className={cn("rd-card prose-article-card flex flex-col p-4")}>
        {cover && (
          <div className="relative z-[1]">
            <Image
              ref={imgRef}
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
            ref={titleRef}
            key={`post-title-${permalink}`}
            data-flip-id={`post-title-${permalink}`}
            className="line-clamp-2 overflow-ellipsis"
          >
            {title}
          </h1>
          {excerpt && (
            <div ref={excerptRef} className={`absolute overflow-y-auto`}>
              <BlogHtmlRenderer html={excerpt} />
            </div>
          )}
        </div>

        <div className="text-caption flex flex-row m-0 opacity-80 w-full relative">
          <div className="my-0 p-0 line-clamp-1 overflow-ellipsis break-after-all">
            {tags.map((tag, index) => (
              <span key={index}>{tag} &nbsp;</span>
            ))}
          </div>
          <div className="grow"></div>
          <span className="inline-block text-nowrap ml-4">{formatDate(updated!)}</span>
        </div>
      </Link>
    </div>
  );
};

export default React.memo(PostCard);
