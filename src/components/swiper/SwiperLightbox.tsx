"use client";

import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/keyboard";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/util/veliteUtils";
import { min } from "lodash";

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
      setShowExif(true);
      // content becomes active (the current slide)
      // can be default prevented
      console.log("contentActivate", content);
    });
    lightbox.on("contentResize", ({ content, width, height }) => {
      // content will be resized
      // can be default prevented
      console.log("contentResize", content, width, height);
    });
    lightbox.on("destroy", () => {
      setShowExif(false);
      setSwiperAutoplay(autoplay);
    });
    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [autoplay]);

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
      <div className="card fixed top-1/2 right-0">
        <pre>{JSON.stringify(images, null, 2)}</pre>
      </div>
      <Swiper
        ref={swiperRef}
        className="my-swiper"
        spaceBetween={16}
        slidesPerView="auto"
        centeredSlides={isMobile}
        grabCursor={true}
        autoplay={autoplay ? { delay: 5000, disableOnInteraction: true } : false}
        keyboard={{ enabled: true, onlyInViewport: true }}
        loop={true}
        parallax={true}
        modules={[Autoplay, Pagination, Keyboard]}
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
