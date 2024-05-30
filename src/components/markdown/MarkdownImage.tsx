"use client";

import React from "react";
import Image from "next/image";
import { calculateDisplayedDimensions } from "@/src/lib/util";
import { useWindowSize } from "usehooks-ts";

const MarkdownImage: React.FC<{ src: string; alt: string; width: number; height: number; blurDataURL: string }> = ({
  src,
  alt,
  width,
  height,
  blurDataURL,
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const maxWidth = windowWidth < 1024 ? windowWidth : windowWidth < 1920 ? 1024 : 1280;
  const { displayedWidth, displayedHeight } = calculateDisplayedDimensions(width, height, maxWidth, 99999);
  // console.log(src, alt, width, height, displayedWidth, displayedHeight);
  return (
    <Image
      src={src!}
      alt={alt!}
      className="rounded-3xl"
      width={displayedWidth}
      height={displayedHeight}
      placeholder="blur"
      blurDataURL={blurDataURL}
      priority={false}
      quality={75}
      style={{ margin: "0 auto 0 auto" }}
    />
  );
};

export default MarkdownImage;
