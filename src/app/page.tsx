import React from "react";
import BlogLayout from "@/src/components/layout/BlogLayout";
import { galleries, globals, posts } from "@/.velite";
import ContentCard from "@/src/components/ContentCard";
import { Icon } from "@iconify-icon/react";
import { Link } from "@/src/components/transition/react-transition-progress/next";
import { cn } from "@/src/lib/cn";
import Image from "next/image";
import SwiperLightbox from "@/src/components/swiper/SwiperLightbox";
import { RdPhoto } from "@/src/lib/veliteUtils";
import AnimatedPoem from "@/src/components/AnimatedPoem";
import { NeonGradientCard } from "@/src/components/NeonGradientCard";
import Marquee from "@/src/components/magicui/Marquee";
import PhotoCard from "@/src/components/PhotoCard";

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
    "glorify| or vilify them.",
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
    "Thank you for reading,|",
    "Think| Different.",
  ];

  const postCount = posts.length;

  const imageCount = galleries.reduce((acc, gallery) => {
    return acc + gallery.images.length;
  }, 0);

  const featuredImages = galleries.reduce((acc, gallery) => {
    return acc.concat(gallery.images.filter((image) => image.featured));
  }, [] as RdPhoto[]);

  return (
    <>
      <BlogLayout className="px-content">
        <div className={"flex flex-col gap-4"}>
          <AnimatedPoem sentences={sentences} inPlace={true} textClassName="hero-text" />
          {/*<ContentCard*/}
          {/*  className="-mx-4"*/}
          {/*  title={*/}
          {/*    <>*/}
          {/*      博客*/}
          {/*      <Icon icon="ooui:articles-ltr" inline />*/}
          {/*    </>*/}
          {/*  }*/}
          {/*  excerpt={*/}
          {/*    <Link href="/posts" className="flex items-center not-prose">*/}
          {/*      <button className="text-btn">*/}
          {/*        浏览文章*/}
          {/*        <Icon className="" icon="heroicons:chevron-right" inline />*/}
          {/*      </button>*/}
          {/*    </Link>*/}
          {/*  }*/}
          {/*/>*/}

          {/*<ContentCard*/}
          {/*  className="-mx-4"*/}
          {/*  title={*/}
          {/*    <>*/}
          {/*      相册*/}
          {/*      <Icon icon="heroicons:photo-solid" inline />*/}
          {/*    </>*/}
          {/*  }*/}
          {/*  excerpt={*/}
          {/*    <Link href="/gallery" className="flex items-center not-prose">*/}
          {/*      <button className="text-btn">*/}
          {/*        浏览图片*/}
          {/*        <Icon className="" icon="heroicons:chevron-right" inline />*/}
          {/*      </button>*/}
          {/*    </Link>*/}
          {/*  }*/}
          {/*/>*/}

          {/*<div className="-mx-4">*/}
          {/*  <NeonGradientCard className="flex flex-col">*/}
          {/*    <div className="relative prose-article-rd-card">*/}
          {/*      <h1 className="flex items-center">*/}
          {/*        博客*/}
          {/*        <span className="icon-[ooui--articles-ltr] mt-0.5" />*/}
          {/*      </h1>*/}
          {/*      <button className="not-prose text-btn">*/}
          {/*        <Link href="/gallery" className="flex items-center">*/}
          {/*          浏览 {postCount} 篇文章*/}
          {/*          <span className="icon-[heroicons--chevron-right] mt-0.5" />*/}
          {/*        </Link>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*  </NeonGradientCard>*/}
          {/*</div>*/}
          {/*<div className="-mx-4">*/}
          {/*  <NeonGradientCard className="flex flex-col">*/}
          {/*    <div className="relative prose-article-rd-card">*/}
          {/*      <h1 className="flex items-center">*/}
          {/*        相册*/}
          {/*        <span className="icon-[heroicons--photo-solid] mt-0.5" />*/}
          {/*      </h1>*/}
          {/*      <button className="not-prose text-btn">*/}
          {/*        <Link href="/gallery" className="flex items-center">*/}
          {/*          浏览 {imageCount} 张图片*/}
          {/*          <span className="icon-[heroicons--chevron-right] mt-0.5" />*/}
          {/*        </Link>*/}
          {/*      </button>*/}
          {/*    </div>*/}
          {/*  </NeonGradientCard>*/}
          {/*</div>*/}
          <div key="card-container-post" className="rd-card flex flex-col pt-4 px-4 pb-4 -mx-4">
            <Link href="/posts" className="relative prose-article-card">
              <h1 className="flex flex-row">
                博客
                <span className="icon-[ooui--articles-ltr] ml-1 my-auto" />
              </h1>
              <button className="flex flex-row not-prose text-btn btn-sm">
                浏览 {postCount} 篇文章
                <span className="icon-[heroicons--chevron-right] my-auto" />
              </button>
            </Link>
          </div>
          <div key="card-container-gallery" className="rd-card flex flex-col pt-4 px-4 pb-3 -mx-4 h-[135px]">
            <div className="absolute inset-0 gradient-blur h-full w-[200px] -z-40" />
            <Link href="/gallery" className="relative prose-article-card">
              <h1 className="flex flex-row">
                相册
                <span className="icon-[clarity--image-gallery-solid] ml-1 my-auto" />
              </h1>
              <button className="flex flex-row not-prose text-btn btn-sm">
                浏览 {imageCount} 张图片
                <span className="icon-[heroicons--chevron-right] my-auto" />
              </button>
            </Link>
            <div className="absolute left-2 top-2 bottom-2 right-0 overflow-clip rounded-2xl -z-50">
              <div className="relative rounded-2xl">
                <Marquee className="h-[135px] [--duration:40s]">
                  {featuredImages.map((image, i) => (
                    <PhotoCard key={image.slug} item={image} maxWidth={250} maxHeight={119} />
                  ))}
                </Marquee>
              </div>
            </div>

            {/*<section className="-mx-content homepage-carousel">*/}
            {/*  <SwiperLightbox images={featuredImages} autoplay={true} featured={true}></SwiperLightbox>*/}
            {/*</section>*/}
          </div>
        </div>
      </BlogLayout>
    </>
  );
}
