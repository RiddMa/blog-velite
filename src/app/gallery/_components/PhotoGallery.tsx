"use client";

import React from "react";
import PhotoAlbum from "react-photo-album";
import type { Gallery } from "@/.velite";
import NextJsImage from "@/src/app/gallery/_components/NextJsImage";

export const PhotoGallery: React.FC<{ gallery: Gallery }> = ({ gallery }) => {
  const photos = gallery.images.map((img) => {
    return {
      src: img.src,
      width: img.width,
      height: img.height,
      blurDataURL: img.blurDataURL,
    };
  });

  return (
    <PhotoAlbum
      layout="rows"
      targetRowHeight={350}
      // layout="masonry"
      // columns={(containerWidth) => {
      //   if (containerWidth < 768) return 2;
      //   if (containerWidth < 1280) return 3;
      //   return 4;
      // }}
      photos={photos}
      renderPhoto={NextJsImage}
      defaultContainerWidth={1280}
      sizes={{ size: "calc(1280px)" }}
    />
  );
};

export default PhotoGallery;
