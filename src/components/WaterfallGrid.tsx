"use client";
import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useIsMobile } from "@nextui-org/use-is-mobile";

interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const isMobile = useIsMobile();
  const columnCount = isMobile ? 1 : 2;
  const cardGap = 16;
  const cardPadding = 16;
  const [preComputedLayout, setPreComputedLayout] = useState<boolean>(false);

  const computeLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const columnWidth = containerRef.current!.clientWidth / columnCount;
    const newColumnHeights = new Array(columnCount).fill(0);
    const newPositions: Array<{ x: number; y: number }> = [];

    itemRefs.current.forEach((ref, index) => {
      if (ref.current) {
        const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
        newPositions[index] = {
          x: minHeightIndex * columnWidth,
          y: newColumnHeights[minHeightIndex],
        };
        newColumnHeights[minHeightIndex] += ref.current.clientHeight; // Assuming gap between items
      }
    });

    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  }, [columnCount]);

  useEffect(() => {
    const savedClientWidth = localStorage.getItem("clientWidth");
    if (savedClientWidth) {
      const columnWidth = parseFloat(savedClientWidth) / columnCount;
      const newImgWidth = isMobile ? columnWidth - cardGap * 2 : columnWidth - cardGap * 2 - cardPadding * 2;
      setImgWidth(newImgWidth);
    }

    if (!containerRef.current) {
      return;
    }
    const columnWidth = containerRef.current!.clientWidth / columnCount;
    const newImgWidth = isMobile ? columnWidth - cardGap * 2 : columnWidth - cardGap * 2 - cardPadding * 2;
    setImgWidth(newImgWidth);
    localStorage.setItem("clientWidth", containerRef.current.clientWidth.toString());

    computeLayout();

    setPreComputedLayout(true);
  }, [items, isMobile, columnCount, containerRef, computeLayout]);

  useLayoutEffect(() => {
    if (preComputedLayout) {
      console.log("Precomputed layout.");
      return;
    }
    if (!containerRef.current) {
      return;
    }
    const columnWidth = containerRef.current!.clientWidth / columnCount;
    const newImgWidth = isMobile ? columnWidth - cardGap * 2 : columnWidth - cardGap * 2 - cardPadding * 2;
    setImgWidth(newImgWidth);
  }, [items, isMobile, columnCount, containerRef, preComputedLayout]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (containerRef.current) {
        console.log("Set new clientWidth: ", containerRef.current.clientWidth.toString());
        localStorage.setItem("clientWidth", containerRef.current.clientWidth.toString());
      }
      computeLayout();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [items, imgWidth, computeLayout, containerRef]); // Also recompute when image width or components array changes

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap relative px-0 xl:-mx-4"
      style={{ height: `${Math.max(...columnHeights, 0)}px` }}
    >
      {items.map((item, index) => (
        <div
          key={item.slug}
          className="px-0 py-4 xl:px-4"
          style={{
            transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
            position: "absolute",
            width: `${100 / columnCount}%`,
          }}
          ref={itemRefs.current[index]}
        >
          <CardComponent item={item} imgWidth={imgWidth} />
        </div>
      ))}
    </div>
  );
};

export default WaterfallGrid;
