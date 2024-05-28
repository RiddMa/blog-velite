import { NextPage } from "next";
import React from "react";
import { galleries } from "@/.velite";
import { RdPhoto } from "@/src/lib/veliteUtils";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { Icon } from "@iconify-icon/react";
import SwiperLightbox from "@/src/components/swiper/SwiperLightbox";

const GalleryPage: NextPage = () => {
  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <div className="prose-article flex flex-col gap-4">
        <section className="-mx-content">
          <h1 className="px-content mb-2">精选照片</h1>
          <SwiperLightbox images={featuredImages} autoplay={true} featured={true}></SwiperLightbox>
        </section>
        {galleries.map((gallery) => (
          <section key={gallery.slug} className="-mx-content">
            <button className="group btn btn-ghost btn-lg rounded-2xl mb-2 outline-transparent border-none p-0">
              <Link href={`gallery/${gallery.slug}`} className="px-content flex items-center not-prose">
                <h1 className="text-h1">{gallery.name}</h1>
                <Icon
                  className="text-h2 transition-apple group-hover:translate-x-1/3"
                  icon="heroicons:chevron-right"
                  inline
                />
              </Link>
            </button>
            <SwiperLightbox images={gallery.images} maxHeight={160}></SwiperLightbox>
          </section>
        ))}
      </div>
    </>
  );
};

export default GalleryPage;
