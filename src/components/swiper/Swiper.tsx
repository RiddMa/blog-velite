"use client";

import React, { useRef, useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Keyboard } from "swiper/modules";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/util/veliteUtils";

export const MySwiper: React.FC<{ images: RdPhoto[]; autoplay?: boolean }> = ({ images, autoplay }) => {
  return (
    <Swiper
      className="max-w-full h-fit"
      spaceBetween={16}
      slidesPerView="auto"
      centeredSlides={true}
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
      modules={[Autoplay, Pagination, Keyboard]}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      {images.map((image, index) => (
        <SwiperSlide key={image.slug} style={{ width: "auto" }}>
          <PhotoCard key={image.slug} item={image} imgHeight={300} className="carousel-item" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
