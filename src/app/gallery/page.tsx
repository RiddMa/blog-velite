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

const EmptyPage: NextPage = () => {
  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <div className="prose-article flex flex-col gap-4">
        <SimpleGallery
          galleryID="my-test-gallery"
          images={[
            {
              largeURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-2500.jpg",
              thumbnailURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/1/img-200.jpg",
              width: 1875,
              height: 2500,
            },
            {
              largeURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-2500.jpg",
              thumbnailURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/2/img-200.jpg",
              width: 1669,
              height: 2500,
            },
            {
              largeURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-2500.jpg",
              thumbnailURL: "https://cdn.photoswipe.com/photoswipe-demo-images/photos/3/img-200.jpg",
              width: 2500,
              height: 1666,
            },
          ]}
        />
        <h1>精选照片</h1>
        <div className="-mx-content">
          {/*<EmblaCarousel images={featuredImages} options={OPTIONS}></EmblaCarousel>*/}
          <MySwiper images={featuredImages} autoplay={true} featured={true}></MySwiper>
          {galleries.map((gallery) => (
            <section key={gallery.slug}>
              <Link href={`gallery/${gallery.slug}`} className="flex items-center not-prose px-content">
                <button className="text-btn btn-lg text-h1">
                  <h1>{gallery.name}</h1>
                  <Icon
                    className="text-h1 transition-apple hover:translate-x-1/3"
                    icon="heroicons:chevron-right"
                    inline
                  />
                </button>
              </Link>
              <MySwiper images={gallery.images} maxHeight={160}></MySwiper>
            </section>
          ))}
          {/*<WaterfallGrid items={gallery.images} CardComponent={PhotoCard} />*/}
        </div>
      </div>
    </>
  );
};

export default EmptyPage;
