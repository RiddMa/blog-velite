"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import Link from "next/link";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { gsap, useGSAP } from "@/src/util/gsap";
import { clsname } from "@/src/util/clsname";

interface IPostCardProps {
  item: Post;
  imgWidth: number;
}

export const PostCard: React.FC<IPostCardProps> = ({ item: post, imgWidth }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const excerptRef = useRef<HTMLDivElement>(null);
  const { permalink, cover, title, excerpt, tags, updated } = post;
  let imgHeight = 0;
  // let hoverOffset = 0;
  if (cover) {
    const aspectRatio = cover.width / cover.height;
    imgHeight = imgWidth ? imgWidth / aspectRatio : cover.height;
  }

  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    const hoverOffset = imgRef.current?.clientHeight || 0;
    if (isHovered) {
      gsap.to(titleRef.current, { translateY: -hoverOffset });
      gsap.to(excerptRef.current, { translateY: -hoverOffset, maxHeight: hoverOffset, opacity: 1, display: "block" });
    } else {
      gsap.to(titleRef.current, { translateY: 0 });
      gsap.to(excerptRef.current, { translateY: 0, maxHeight: 0, opacity: 0, display: "none" });
    }
  }, [isHovered]);

  return (
    <div
      key={`card-container-${permalink}`}
      className={`group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={permalink} className={`card group prose-article-card flex flex-col p-4`}>
        {cover && (
          <div className="relative z-[1] transition-apple group-hover:opacity-0.1 group-hover:blur-xl group-hover:saturate-150">
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

export default PostCard;
