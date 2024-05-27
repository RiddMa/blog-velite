import React from "react";
import BlogLayout from "@/src/components/layout/BlogLayout";
import { galleries, globals } from "@/.velite";
import ContentCard from "@/src/components/ContentCard";
import { Icon } from "@iconify-icon/react";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { clsname } from "@/src/util/clsname";
import Image from "next/image";
import SwiperLightbox from "@/src/components/swiper/SwiperLightbox";
import { RdPhoto } from "@/src/util/veliteUtils";

export default function Home() {
  const { heroTitle } = globals;
  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <BlogLayout className="px-content">
        <div className={"flex flex-col gap-4"}>
          {/*<h1 className="hero-title">Connect</h1>*/}
          <ContentCard
            className="-mx-4"
            title={
              <>
                博客
                <Icon icon="ooui:articles-ltr" inline />
              </>
            }
            excerpt={
              <Link href="/posts" className="flex items-center not-prose">
                <button className="text-btn">
                  浏览文章
                  <Icon className="" icon="heroicons:chevron-right" inline />
                </button>
              </Link>
            }
          />
          <ContentCard
            className="-mx-4"
            title={
              <>
                相册
                <Icon icon="heroicons:photo-solid" inline />
              </>
            }
            excerpt={
              <Link href="/gallery" className="flex items-center not-prose">
                <button className="text-btn">
                  浏览图片
                  <Icon className="" icon="heroicons:chevron-right" inline />
                </button>
              </Link>
            }
          />
          <div key="card-container-gallery" className="card prose-article-card flex flex-col pt-4 px-4 -mx-4">
            <div className="relative">
              <h1 className="flex items-center">
                相册
                <span className="icon-[heroicons--photo-solid]" />
              </h1>
              <button className="not-prose text-btn">
                <Link href="/gallery" className="flex items-center">
                  浏览图片
                  <span className="icon-[heroicons--chevron-right] mt-0.5" />
                </Link>
              </button>
            </div>
            <section className="-mx-content homepage-carousel">
              <SwiperLightbox images={featuredImages} autoplay={true} featured={true}></SwiperLightbox>
            </section>
          </div>
          {/*<h1 className="hero-title text-end">the dots.</h1>*/}
        </div>
      </BlogLayout>
    </>
  );
}
