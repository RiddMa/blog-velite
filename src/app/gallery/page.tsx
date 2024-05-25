import { NextPage } from "next";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PhotoGallery from "@/src/app/gallery/_components/PhotoGallery";
import React from "react";
import { galleries } from "@/.velite";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/util/veliteUtils";
import { MySwiper } from "@/src/components/swiper/Swiper";
import EmblaCarousel from "@/src/components/embla-carousel/EmblaCarousel";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { Icon } from "@iconify-icon/react";
import { EmblaOptionsType } from "embla-carousel";
import SimpleGallery from "@/src/components/photoswipe/SimpleGallery";
import SwiperLightbox from "@/src/components/swiper/SwiperLightbox";

const EmptyPage: NextPage = () => {
  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <div className="prose-article flex flex-col gap-4 -mx-content">
        <section>
          <h1 className="px-content mb-2">精选照片</h1>
          <SwiperLightbox images={featuredImages} autoplay={true} featured={true}></SwiperLightbox>
        </section>
        {galleries.map((gallery) => (
          <section key={gallery.slug}>
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

        {/*<MySwiper images={featuredImages} autoplay={true} featured={true}></MySwiper>*/}
        {/*{galleries.map((gallery) => (*/}
        {/*  <section key={gallery.slug}>*/}
        {/*    <Link href={`gallery/${gallery.slug}`} className="group flex items-center not-prose px-content">*/}
        {/*      <button className="btn btn-ghost btn-lg text-h1 -mx-content px-4 rounded-2xl text-base font-normal leading-normal outline-transparent border-none">*/}
        {/*        <h1>{gallery.name}</h1>*/}
        {/*        <Icon*/}
        {/*          className="text-h2 transition-apple -translate-x-1/4 group-hover:translate-x-1/4"*/}
        {/*          icon="heroicons:chevron-right"*/}
        {/*          inline*/}
        {/*        />*/}
        {/*      </button>*/}
        {/*    </Link>*/}
        {/*    <MySwiper images={gallery.images} maxHeight={160}></MySwiper>*/}
        {/*  </section>*/}
        {/*))}*/}

        {/*<WaterfallGrid items={gallery.images} CardComponent={PhotoCard} />*/}
      </div>
    </>
  );
};

export default EmptyPage;
