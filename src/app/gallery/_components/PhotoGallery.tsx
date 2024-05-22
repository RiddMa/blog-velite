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
    };
  });

  return (
    <PhotoAlbum
      layout="rows"
      targetRowHeight={300}
      photos={photos}
      renderPhoto={NextJsImage}
      defaultContainerWidth={1280}
      sizes={{ size: "calc(100vw - 240px)" }}
    />
  );
};

export default PhotoGallery;
