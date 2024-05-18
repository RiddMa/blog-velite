"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import Link from "next/link";
import BlogHtmlRenderer from "@/src/components/BlogHtmlRenderer";
import { MotionDiv } from "@/src/components/transition/MotionDiv";
import { MotionH1 } from "@/src/app/(blog)/post/[slug]/MotionH1";

interface IPostCardProps {
  item: Post;
  imgWidth: number;
}

export const PostCard: React.FC<IPostCardProps> = ({ item: post, imgWidth }) => {
  const { permalink, cover, title, excerpt, tags, updated } = post;
  const cardGap = 16;
  let imgHeight = 0;
  let hoverOffset = 0;
  if (cover) {
    const aspectRatio = cover.width / cover.height;
    imgHeight = imgWidth ? imgWidth / aspectRatio : cover.height;
    hoverOffset = -imgHeight - cardGap;
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={permalink} className={`card`}>
      <motion.div
        key={`card-container-${permalink}`}
        layout={true}
        layoutId={`card-container-${permalink}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`group prose-article-card flex flex-col p-4`}
      >
        {cover && (
          <motion.div
            className={`relative mt-0 mx-0 p-0 z-[1] mb-2 xl:mb-4`}
            animate={{
              opacity: isHovered ? 0.1 : 1,
              filter: isHovered ? "blur(20px) saturate(1.5)" : "none",
            }}
            transition={transitionApple}
          >
            <MotionDiv keyName={`post-cover-${permalink}`}>
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
            </MotionDiv>
          </motion.div>
        )}
        <motion.div
          animate={{ translateY: isHovered ? hoverOffset : 0 }}
          transition={transitionApple}
          className={`relative h-full z-[2] mb-2 xl:mb-4`}
        >
          <MotionH1 keyName={`post-title-${permalink}`} className="not-prose line-clamp-2 overflow-ellipsis text-h2">
            {title}
          </MotionH1>
          {excerpt && (
            <motion.div
              className={`absolute overflow-y-auto`}
              initial={{ maxHeight: 0 }}
              animate={{
                maxHeight: isHovered ? -hoverOffset : 0,
                opacity: isHovered ? 1 : 0,
                display: isHovered ? "block" : "hidden",
              }}
              transition={transitionApple}
            >
              <BlogHtmlRenderer html={excerpt} />
            </motion.div>
          )}
        </motion.div>

        <div className="flex flex-row m-0 opacity-80 w-full relative">
          <div className="my-0 p-0 text-body text-color-caption line-clamp-1 overflow-ellipsis break-after-all">
            {tags.map((tag, index) => (
              <span key={index}>{tag} &nbsp;</span>
            ))}
          </div>
          <div className="grow"></div>
          <span className="text-body text-color-caption inline-block text-nowrap ml-4">{formatDate(updated!)}</span>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
