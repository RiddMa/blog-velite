"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";

interface IPostCardProps {
  item: Post;
  imgWidth: number;
}

export const PostCardLite: React.FC<IPostCardProps> = ({ item: post, imgWidth }) => {
  const { permalink, cover, title, excerpt, tags, updated } = post;
  const cardGap = 8;
  let imgHeight = 0;
  let hoverOffset = 0;
  if (cover) {
    const aspectRatio = cover.width / cover.height;
    imgHeight = imgWidth ? imgWidth / aspectRatio : cover.height;
    hoverOffset = -imgHeight - cardGap;
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={`card-container-${permalink}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={``}
    >
      <Link href={permalink} className={`rd-card group prose-article-card flex flex-col p-4`}>
        {cover && (
          <motion.div
            className={`relative z-[1] m-0 p-0`}
            initial={{ opacity: 1 }}
            animate={{
              opacity: isHovered ? 0.1 : 1,
              filter: isHovered ? "blur(20px) saturate(1.5)" : "none",
            }}
            transition={transitionApple}
          >
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
          </motion.div>
        )}
        <motion.div
          initial={{ translateY: 0 }}
          animate={{ translateY: isHovered ? hoverOffset : 0 }}
          transition={transitionApple}
          className={`relative h-full z-[2] m-0 p-0`}
        >
          <h1 className="line-clamp-2 overflow-ellipsis">{title}</h1>
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
    </motion.div>
  );
};

export default PostCardLite;
