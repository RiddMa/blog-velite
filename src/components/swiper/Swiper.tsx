"use client";

import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "swiper/css/keyboard";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/util/veliteUtils";
import { min } from "lodash";

export const MySwiper: React.FC<{ images: RdPhoto[]; autoplay?: boolean; maxHeight?: number; featured?: boolean }> = ({
  images,
  autoplay = false,
  maxHeight = 360,
  featured = false,
}) => {
  const swiperRef = useRef<SwiperRef>(null);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [maxH, setMaxH] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(true);

  useEffect(() => {
    if (!swiperRef.current) return;
    setMaxWidth(swiperRef.current.swiper.width - 64);
    setMaxH(min([(maxWidth / 3) * 2, maxHeight])!);
    setIsMobile(swiperRef.current.swiper.width <= 768);
  }, [maxHeight, maxWidth]);

  return (
    <Swiper
      ref={swiperRef}
      className="my-swiper"
      spaceBetween={16}
      slidesPerView="auto"
      // pagination={{ enabled: true, clickable: true }}
      centeredSlides={isMobile}
      grabCursor={true}
      autoplay={
        autoplay
          ? {
              delay: 5000,
              disableOnInteraction: true,
            }
          : false
      }
      keyboard={{
        enabled: true,
        onlyInViewport: true,
      }}
      loop={true}
      parallax={true}
      modules={[Autoplay, Pagination, Keyboard]}
    >
      {/*<div className="absolute top-0 bottom-0 left-0 w-16 pointer-events-none gradient-mask-left"></div>*/}
      {/*<div className="absolute top-0 bottom-0 right-0 w-16 pointer-events-none gradient-mask-right"></div>*/}
      {images.map((image, index) => (
        <SwiperSlide key={image.slug} style={{ width: "auto" }}>
          {/*<div className="opacity-0 absolute">Image</div>*/}
          <PhotoCard
            key={image.slug}
            item={image}
            maxWidth={maxWidth}
            maxHeight={maxH}
            priority={featured}
            className="carousel-item"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
