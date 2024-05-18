"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useWindowWidthState from "@/src/util/useWindowWidthState";

export interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [columnWidth, setColumnWidth] = useState<number>(0);
  // const cardGap = 0;
  const cardPadding = 16;
  let windowWidthState = useWindowWidthState();
  const columnCount = windowWidthState === "mobile" ? 1 : 2;

  // useEffect(() => {
  //   windowWidthState = getWidthState();
  // }, []);

  console.log(windowWidthState);

  useEffect(() => {
    itemRefs.current = items.map(() => React.createRef<HTMLDivElement>());
  }, [items]);

  const computeColumnWidth = useCallback(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth / columnCount;
      setColumnWidth(width);
    }
  }, [columnCount]);

  useEffect(() => {
    if (containerRef.current) {
      const newImgWidth = columnWidth - cardPadding * 2;
      setImgWidth(newImgWidth);
    } else {
      setImgWidth(0);
    }
  }, [columnWidth, cardPadding, windowWidthState]);

  const computeLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const newColumnHeights = new Array(columnCount).fill(0);
    const newPositions: Array<{ x: number; y: number }> = [];

    itemRefs.current.forEach((ref, index) => {
      if (ref.current) {
        const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
        newPositions[index] = {
          x: minHeightIndex * columnWidth,
          y: newColumnHeights[minHeightIndex],
        };
        newColumnHeights[minHeightIndex] += ref.current.clientHeight;
      }
    });

    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  }, [columnCount, columnWidth]);

  useEffect(() => {
    computeLayout();
  }, [items, columnCount, computeLayout, imgWidth]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      computeColumnWidth();
      computeLayout();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [computeLayout, computeColumnWidth]);

  const renderColumns = () =>
    items.map((item, index) => (
      <div
        key={item.slug}
        ref={itemRefs.current[index]}
        className="p-4"
        style={{
          transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
          position: "absolute",
          width: `${100 / columnCount}%`,
        }}
      >
        <CardComponent item={item} imgWidth={imgWidth} />
      </div>
    ));

  const renderMobile = () =>
    items.map((item) => (
      <div key={item.slug} className="py-4">
        <CardComponent item={item} imgWidth={imgWidth} />
      </div>
    ));

  if (windowWidthState === "mobile") {
    return (
      <div ref={containerRef} className="flex flex-col relative">
        {renderMobile()}
      </div>
    );
  } else {
    return (
      <div
        ref={containerRef}
        className="relative px-0 xl:-mx-4"
        style={{ height: `${Math.max(...columnHeights, 0)}px` }}
      >
        {renderColumns()}
      </div>
    );
  }
};

export default WaterfallGrid;
