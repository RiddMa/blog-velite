import React from "react";
import type { Metadata } from "next";
import { getGalleryBySlug, getPostBySlug } from "@/src/store/velite";
import { categories, galleries, globals } from "@/.velite";
import { notFound } from "next/navigation";
import PhotoGallery from "@/src/app/gallery/_components/PhotoGallery";

interface GalleryDetailPageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: GalleryDetailPageProps): Metadata {
  const gallery = getGalleryBySlug(params.slug);
  if (gallery == null) {
    return {
      title: `错误：找不到相册`,
      description: `错误：找不到相册。 | ${globals.metadata.description}`,
      openGraph: {
        title: `错误：找不到相册`,
        description: `错误：找不到相册。 | ${globals.metadata.description}`,
      },
    };
  }
  return {
    title: `${gallery.name} | 分类`,
    description: `探索博客相册“${gallery.name}”的照片。| ${globals.metadata.description}`,
    openGraph: {
      title: `${gallery.name} | 分类`,
      description: `探索博客相册“${gallery.name}”的照片。| ${globals.metadata.description}`,
    },
  };
}

export function generateStaticParams(): GalleryDetailPageProps["params"][] {
  return galleries.map((gallery) => ({
    slug: gallery.slug,
  }));
}

const GalleryDetailPage: React.FC<GalleryDetailPageProps> = ({ params }) => {
  const gallery = getGalleryBySlug(params.slug);
  if (!gallery) notFound();

  return (
    <>
      <div className="prose-article flex flex-col gap-4">
        <h1>{gallery.name}</h1>
        <div className="text-end opacity-80">{gallery.images.length}张照片</div>
        <PhotoGallery gallery={gallery} />
      </div>
    </>
  );
};

export default GalleryDetailPage;
