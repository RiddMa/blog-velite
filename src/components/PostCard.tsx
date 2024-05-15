"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@nextui-org/card";
import { Image as NextUIImage } from "@nextui-org/image";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import TableOfContents from "@/src/components/TableOfContents";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import Link from "next/link";

interface IPostCardProps {
  item: Post;
  imgWidth: number;
}

export const PostCard: React.FC<IPostCardProps> = ({ item: post, imgWidth }) => {
  const { permalink, cover, title, excerpt, toc, tags, updated } = post;
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
    <Link href={permalink}>
      <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
        <Card
          className={`group transition-apple card drop-shadow-lg hover:drop-shadow-2xl prose-article-card gap-4 p-4`}
        >
          {cover && (
            <motion.div
              className={`relative m-0 p-0 z-[1]`}
              animate={{
                opacity: isHovered ? 0.1 : 1,
                filter: isHovered ? "blur(20px) saturate(1.5)" : "none",
              }}
              transition={transitionApple}
            >
              <NextUIImage
                as={Image}
                src={cover.src}
                alt={"cover image"}
                removeWrapper
                className="card"
                width={imgWidth}
                height={imgHeight}
                style={{ margin: 0 }}
              />
            </motion.div>
          )}
          <motion.div
            animate={{ translateY: isHovered ? hoverOffset : 0 }}
            transition={transitionApple}
            className={`relative h-full z-[2]`}
          >
            <h1 className="not-prose line-clamp-2 overflow-ellipsis text-h2">{title}</h1>
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
                <p>{excerpt}</p>
                {/*<TableOfContents toc={toc} urlPrefix={permalink} useNextLink={true} className={`prose-article-card`} />*/}
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
            <span className="text-body text-color-caption inline-block text-nowrap ml-4">{formatDate(updated)}</span>
          </div>
        </Card>
        {/*</Link>*/}
      </motion.div>
    </Link>
  );
};

export default PostCard;
