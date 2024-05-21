"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import Link from "next/link";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { gsap, useGSAP } from "@/src/util/gsap";
import { clsname } from "@/src/util/clsname";
import useWindowWidthState from "@/src/util/useWindowWidthState";
import useColumnCount from "@/src/util/useColumnCount";

interface IPhotoCardProps {
  item: Post;
  imgWidth: number;
  isMobile?: boolean;
}

const PhotoCard: React.FC<IPhotoCardProps> = ({ item: post, imgWidth, isMobile = false }) => {
  const { permalink, cover, title, excerpt, tags, updated } = post;

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
    gsap.set(excerptRef.current, { opacity: 0, maxHeight: 0, display: "none" });
  }, []);

  useGSAP(() => {
    const hoverOffset = imgRef.current?.clientHeight || 0;
    const tl = gsap.timeline();
    if (isHovered) {
      tl.to(imgRef.current, { opacity: 0.1, filter: "blur(16px) saturate(150%)" })
        .to(titleRef.current, { translateY: -hoverOffset }, "<")
        .to(
          excerptRef.current,
          { translateY: -hoverOffset, maxHeight: hoverOffset, opacity: 1, display: "block" },
          "<",
        );
    } else {
      tl.to(imgRef.current, { opacity: 1, filter: "none" })
        .to(titleRef.current, { translateY: 0 }, "<")
        .to(excerptRef.current, { translateY: 0, maxHeight: 0, opacity: 0, display: "none" }, "<");
    }
  }, [isHovered]);

  return (
    <div
      ref={cardRef}
      key={`card-container-${permalink}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      // onClick={() => setIsClicked(true)}
    >
      <Link href={permalink} className={clsname(`card prose-article-card flex flex-col p-4`)}>
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

export default React.memo(PhotoCard);
