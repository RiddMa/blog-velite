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
import AnimatedPoem from "@/src/components/AnimatedPoem";

export default function Home() {
  const { heroTitle } = globals;

  const sentences = [
    "Here's to the crazy ones.",
    "The misfits.",
    "The rebels.",
    "The troublemakers.",
    "The round pegs in the square holes.",
    "The ones who see things differently.",
    "They're not fond of rules,",
    "And they have no respect for the status quo.",
    "You can praise them,",
    "quote them,",
    "disagree with them,",
    "disbelieve them,",
    "glorify or vilify them.",
    "About the only thing that you can't do| is ignore them.",
    "Because they change things.",
    "They invent.",
    "They imagine.",
    "They heal.",
    "They explore.",
    "They create.",
    "They inspire.",
    "They push the human race forward.",
    "Maybe they have to be crazy.",
    "How else can you stare at an empty canvas| and see a work of art?",
    "Or sit in silence| and hear a song that's never been written?",
    "Or gaze at a red planet| and see a laboratory on wheels?",
    "We make tools for these kinds of people.",
    "While some may see them as the crazy ones,| we see genius.",
    "Because the people who are crazy enough to think that they can change the world,",
    "are the ones who do.",
    "Thank you for reading,",
    "Think| Different.",
  ];
  // const sentences = [
  //   "Here's to the crazy ones.",
  //   "Because the people who are crazy enough to think that they can change the world,",
  //   "are the ones who do.",
  // ];

  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <BlogLayout className="px-content">
        <div className={"flex flex-col gap-4"}>
          <AnimatedPoem sentences={sentences} inPlace={true} interval={1500} className="text-h2" />
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
          {/*<div key="card-container-gallery" className="card prose-article-card flex flex-col pt-4 px-4 -mx-4">*/}
          {/*  <div className="relative">*/}
          {/*    <h1 className="flex items-center">*/}
          {/*      相册*/}
          {/*      <span className="icon-[heroicons--photo-solid]" />*/}
          {/*    </h1>*/}
          {/*    <button className="not-prose text-btn">*/}
          {/*      <Link href="/gallery" className="flex items-center">*/}
          {/*        浏览图片*/}
          {/*        <span className="icon-[heroicons--chevron-right] mt-0.5" />*/}
          {/*      </Link>*/}
          {/*    </button>*/}
          {/*  </div>*/}
          {/*  /!*<section className="-mx-content homepage-carousel">*!/*/}
          {/*  /!*  <SwiperLightbox images={featuredImages} autoplay={true} featured={true}></SwiperLightbox>*!/*/}
          {/*  /!*</section>*!/*/}
          {/*</div>*/}
        </div>
      </BlogLayout>
    </>
  );
}
