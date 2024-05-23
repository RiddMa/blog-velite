"use client";

import React, { useRef, useState, useMemo } from "react";
import Image from "next/image";
import { formatDate } from "@/src/store/day";
import { Post } from "@/.velite";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import BlogHtmlRenderer from "@/src/components/markdown/BlogHtmlRenderer";
import { gsap, useGSAP } from "@/src/util/gsap";
import { clsname } from "@/src/util/clsname";
import useWindowWidthState from "@/src/util/useWindowWidthState";
import useColumnCount from "@/src/util/useColumnCount";
import { RdPhoto } from "@/src/util/veliteUtils";

interface IPhotoCardProps {
  item: RdPhoto;
  imgWidth?: number;
  imgHeight?: number;
  isMobile?: boolean;
  className?: string;
}

const PhotoCard: React.FC<IPhotoCardProps> = ({ item: photo, imgWidth, imgHeight, isMobile = false, className }) => {
  const { src, slug, width, height, blurDataURL, exif } = photo;

  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const displayedWidth = useMemo(() => {
    if (imgWidth) {
      return imgWidth;
    }
    if (imgHeight) {
      return (imgHeight * width) / height;
    }
    return width;
  }, [imgWidth, imgHeight, width, height]);

  const displayedHeight = useMemo(() => {
    if (imgHeight) {
      return imgHeight;
    }
    if (imgWidth) {
      return (imgWidth * height) / width;
    }
    return height;
  }, [imgHeight, imgWidth, width, height]);

  return (
    <div ref={cardRef} key={`photo-container-${slug}`} className={className}>
      {/*<Link href={permalink} className={clsname(`card prose-article-card flex flex-col p-4`)}>*/}
      <div className="relative">
        <Image
          ref={imgRef}
          src={src}
          alt={`cover image`}
          className="rounded-2xl"
          width={displayedWidth}
          height={displayedHeight}
          placeholder="blur"
          blurDataURL={blurDataURL}
          quality={80}
          sizes="720px"
          style={{
            margin: 0,
            height: "auto",
            width: "auto",
            maxWidth: "calc(100% - 64px)",
          }}
        />
      </div>
      {/*</Link>*/}
    </div>
  );
};

export default React.memo(PhotoCard);
