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
      pswpModule: () => import("photoswipe"),
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
      swiperRef.current.swiper.autoplay.resume();
    } else {
      swiperRef.current.swiper.autoplay.pause();
    }
  };

  return (
    <div ref={galleryRef}>
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
