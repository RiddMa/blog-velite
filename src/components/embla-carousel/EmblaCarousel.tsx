"use client";

import React, { useCallback } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { PrevButton, NextButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import "./embla-carousel.css";
import PhotoCard from "@/src/components/PhotoCard";
import { RdPhoto } from "@/src/lib/veliteUtils";
import { cn } from "@/src/lib/cn";

type PropType = {
  images: RdPhoto[];
  options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { images, options } = props;
  // const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    // @ts-ignore
    const resetOrStop = autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;

    // @ts-ignore
    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick);

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(
    emblaApi,
    onNavButtonClick,
  );

  return (
    <section className="embla">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="embla__container">
          {images.map((image, index) => (
            <PhotoCard key={image.slug} item={image} maxHeight={300} className="embla__slide" />
          ))}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center flex-wrap">
        <div className="flex flex-row gap-2">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="flex flex-row gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={cn("transition-apple", index === selectedIndex ? "border-2" : "border-1")}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
