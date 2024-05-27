"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap, useGSAP } from "@/src/util/gsap";
import { clsname } from "@/src/util/clsname";
import { shortWordsMap } from "@/src/components/ShortWords";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

type PoemAnimationProps = {
  sentences: string[];
  inPlace?: boolean;
  interval?: number; // Interval between sentences in milliseconds
  className?: string;
};

const AnimatedPoem: React.FC<PoemAnimationProps> = ({ sentences, inPlace = false, interval = 3000, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState(0);

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;
    const children = containerRef.current.children;
    let maxHeight = 0;
    Array.from(children).forEach((child) => {
      // @ts-ignore
      const childHeight = child.offsetHeight + child.offsetTop;
      if (childHeight > maxHeight) {
        maxHeight = childHeight;
      }
    });
    setMaxHeight(maxHeight);
  }, [sentences]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.to(containerRef.current, { height: maxHeight, delay: 0.5 });
    },
    { dependencies: [maxHeight] },
  );

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const paragraphs = containerRef.current.querySelectorAll("div.poem-sentence");
      if (!paragraphs) return;

      const normalDuration = 0.4;
      const shortDuration = 0.2;

      const timeline = gsap.timeline();
      timeline.to({}, { duration: 1 }); // Pause for sentence.
      timeline.to({}, { duration: 1 }); // Pause for sentence.

      let lastParagraphHeight = 0;
      let isLastParagraph = false;

      paragraphs.forEach((paragraph, pIdx) => {
        const spans = paragraph.querySelectorAll("span");
        if (!spans) return;

        spans.forEach((span, idx) => {
          const word = (span.textContent ?? "")
            .trim()
            .replace(/[^\w\s]|_/g, "")
            .toLowerCase(); // Remove all punctuation characters from the word before checking
          const duration = shortWordsMap.has(word) ? shortDuration : normalDuration;
          timeline.from(span, { opacity: 0, duration: duration }, idx === 0 ? "<" : ">");
          if (span.classList.contains("pause")) {
            timeline.to({}, { duration: 0.6 }); // Extra pause
          }
        });

        timeline.to({}, { duration: 1 }); // Pause for sentence.

        if (pIdx === paragraphs.length - 1) {
          isLastParagraph = true;
          // @ts-ignore
          lastParagraphHeight = paragraph.offsetHeight;
        }
        if (!isLastParagraph) {
          timeline.to(paragraph, { opacity: inPlace ? 0 : 1 });
        }
      });

      timeline.to(containerRef.current, { height: lastParagraphHeight });

      timeline.play();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={clsname("poem-container prose-article relative font-serif h-0", className)}>
      {sentences.map((sentence, index) => (
        <div key={index} className={clsname("poem-sentence", inPlace ? "absolute" : "")}>
          {sentence.split(" ").map((word, idx) => (
            <span
              key={idx}
              className={clsname(word.endsWith("|") ? "pause" : "", "inline-block whitespace-break-spaces")}
            >{`${word.endsWith("|") ? word.slice(0, -1) : word} `}</span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedPoem;
