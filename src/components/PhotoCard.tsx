"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { RdPhoto } from "@/src/util/veliteUtils";
import { useWindowSize } from "usehooks-ts";

interface IPhotoCardProps {
  item: RdPhoto;
  maxWidth?: number;
  maxHeight?: number;
  isMobile?: boolean;
  className?: string;
}

const PhotoCard: React.FC<IPhotoCardProps> = ({ item: photo, maxWidth, maxHeight, isMobile = false, className }) => {
  const { src, slug, width, height, blurDataURL, exif } = photo;

  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  const { displayedWidth, displayedHeight } = useMemo(() => {
    return calculateDisplayedDimensions(width, height, maxWidth ?? windowWidth, maxHeight ?? windowHeight);
  }, [width, height, maxWidth, windowWidth, maxHeight, windowHeight]);

  return (
    <div ref={cardRef} key={`photo-container-${slug}`} className={className}>
      <Image
        ref={imgRef}
        src={src}
        alt={`cover image`}
        className="rounded-2xl"
        width={displayedWidth}
        height={displayedHeight}
        placeholder="blur"
        blurDataURL={blurDataURL}
        quality={70}
        // sizes="(max-width: 768px) 100vw, (max-width: 1280px) 720px, 960px"
        // sizes={`${displayedWidth}px`}
        style={{
          margin: 0,
          width: displayedWidth,
          height: displayedHeight,
        }}
      />
    </div>
  );
};

export default React.memo(PhotoCard);

function calculateDisplayedDimensions(
  imageWidth: number,
  imageHeight: number,
  maxWidth: number,
  maxHeight: number,
): { displayedWidth: number; displayedHeight: number } {
  const aspectRatio = imageWidth / imageHeight;

  let displayedWidth = maxWidth;
  let displayedHeight = maxWidth / aspectRatio;

  if (displayedHeight > maxHeight) {
    displayedHeight = maxHeight;
    displayedWidth = maxHeight * aspectRatio;
  }

  return {
    displayedWidth: displayedWidth,
    displayedHeight: displayedHeight,
  };
}
