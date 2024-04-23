"use client";

import React, { useState } from "react";
import { Image as VeliteImage } from "velite";
import Image from "next/image";
import { Card } from "@nextui-org/card";
import { Image as NextUIImage } from "@nextui-org/image";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";

interface IContentCardProps {
  cover?: VeliteImage;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  caption?: React.ReactNode;
  imgWidth: number;
}

export const ContentCard: React.FC<IContentCardProps> = ({ cover, title, excerpt, caption, imgWidth }) => {
  const cardGap = 16;
  let imgHeight = 0;
  if (cover) {
    const aspectRatio = cover.width / cover.height;
    imgHeight = imgWidth ? imgWidth / aspectRatio : cover.height;
  }

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card className={`group transition-apple drop-shadow-lg hover:drop-shadow-2xl prose-article-card gap-4 p-4`}>
        {cover && (
          <motion.div
            className={`relative m-0 p-0 block`}
            animate={{ opacity: isHovered ? 0 : 1 }}
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
              sizes="(max-width: 1280px) 100vw, 250px"
              style={{ margin: 0 }}
            />
          </motion.div>
        )}
        <motion.div
          animate={{ translateY: isHovered ? -imgHeight - cardGap : 0 }}
          transition={transitionApple}
          className={`relative`}
        >
          {title}
          {excerpt && (
            <motion.div
              className={`absolute`}
              animate={{
                opacity: isHovered ? 1 : 0,
                display: isHovered ? "block" : "hidden",
              }}
              transition={transitionApple}
            >
              {excerpt}
            </motion.div>
          )}
        </motion.div>
        {caption && <>{caption}</>}
      </Card>
    </motion.div>
  );
};

export default ContentCard;
