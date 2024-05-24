"use client";

import React, { useEffect, useRef, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/util/veliteUtils";
import { min } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { Icon } from "@iconify-icon/react";

const SwiperLightbox: React.FC<{ images: RdPhoto[]; autoplay?: boolean; maxHeight?: number; featured?: boolean }> = ({
  images,
  autoplay = false,
  maxHeight = 360,
  featured = false,
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [maxH, setMaxH] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showExif, setShowExif] = useState<boolean>(false);

  useEffect(() => {
    if (!swiperRef.current) return;
    setMaxWidth(swiperRef.current.swiper.width - 64);
    setMaxH(min([(maxWidth / 3) * 2, maxHeight])!);
    setIsMobile(swiperRef.current.swiper.width <= 768);
    setSwiperAutoplay(autoplay);
  }, [autoplay, maxHeight, maxWidth]);

  useEffect(() => {
    if (!galleryRef.current) return;
    let lightbox = new PhotoSwipeLightbox({
      dataSource: images,
      gallery: galleryRef.current,
      children: ".swiper-slide a",
      loop: true,
      bgOpacity: 1,
      closeTitle: "关闭 (Esc)",
      zoomTitle: "放大 (单击图片)",
      arrowPrevTitle: "上一张(左方向键)",
      arrowNextTitle: "下一张(右方向键)",
      errorMsg: "发生错误：无法加载图片",
      pswpModule: () => import("photoswipe"),
    });
    lightbox.on("contentActivate", ({ content }) => {
      setActiveIndex(content.index);
      swiperRef.current!.swiper.slideToLoop(content.index, 300);
      setShowExif(true);
    });
    lightbox.on("contentResize", ({ content, width, height }) => {
      // console.log("contentResize", content, width, height);
    });
    lightbox.on("close", () => {
      swiperRef.current!.swiper.slideToLoop(activeIndex, 0);
      setShowExif(false);
    });
    lightbox.on("destroy", () => {
      setSwiperAutoplay(autoplay);
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  const setSwiperAutoplay = (to: boolean) => {
    if (!swiperRef.current) return;
    if (to) {
      swiperRef.current.swiper.autoplay.start();
    } else {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  return (
    <div ref={galleryRef}>
      <AnimatePresence>
        {showExif && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transitionApple}
            className="card fixed top-[60px] right-0 max-w-[300px] max-h-[calc(100vh-120px)] z-[999999] p-4 flex flex-col gap-4"
          >
            {/*<pre>{JSON.stringify(images[activeIndex].exif, null, 2)}</pre>*/}
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="formkit:datetime" />
              {images[activeIndex].exif.exif?.DateTimeOriginal?.description ?? "未知拍摄时间"}
              {images[activeIndex].exif.exif?.OffsetTimeOriginal?.description ?? "未知时区"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="fluent:slide-size-24-regular" />
              {images[activeIndex].width} x {images[activeIndex].height}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="heroicons:camera" />
              {images[activeIndex].exif.exif?.Make?.description ?? "未知制造商"}
              {`, `}
              {images[activeIndex].exif.exif?.Model?.description ?? "未知型号"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="bxs:cylinder" />
              {images[activeIndex].exif.exif?.LensModel?.description ?? "未知镜头"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="system-uicons:ruler" />
              {images[activeIndex].exif.exif?.FocalLength?.description ?? "未知焦距"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="material-symbols:shutter-speed-rounded" />
              {`${images[activeIndex].exif.exif?.ExposureTime?.description} s` ?? "未知曝光时间"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="carbon:aperture" />
              {images[activeIndex].exif.exif?.FNumber?.description ?? "未知光圈"}
            </div>
            <div className="flex flex-row gap-2 items-center">
              <Icon className="text-xl" icon="carbon:iso-filled" />
              {images[activeIndex].exif.exif?.ISOSpeedRatings?.description ?? "未知 ISO"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Swiper
        ref={swiperRef}
        className="my-swiper"
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides={isMobile}
        grabCursor={true}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true } : false}
        loop={false}
        parallax={true}
        modules={[Autoplay, Pagination]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.slug} style={{ width: "auto" }}>
            <a
              href={image.src}
              data-pswp-width={image.width}
              data-pswp-height={image.height}
              onClick={() => setSwiperAutoplay(false)}
            >
              <PhotoCard
                key={image.slug}
                item={image}
                maxWidth={maxWidth}
                maxHeight={maxH}
                priority={featured}
                className="carousel-item"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperLightbox;
