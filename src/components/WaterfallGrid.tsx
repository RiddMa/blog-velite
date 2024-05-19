"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useWindowWidthState, { getWidthState } from "@/src/util/useWindowWidthState";
import useColumnCount from "@/src/util/useColumnCount";

export interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [columnWidth, setColumnWidth] = useState<number>(0);
  const widthState = useWindowWidthState();
  // const cardPadding = widthState === "mobile" ? 8 : 16;
  const cardPadding = 16;
  const columnCount = useColumnCount();

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
  }, [columnWidth, cardPadding]);

  const computeLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    if (columnCount === 1) {
      containerRef.current.className = "flex flex-col";
      containerRef.current.style.height = "auto";
      itemRefs.current.forEach((ref) => {
        if (ref.current) {
          ref.current.removeAttribute("style");
        }
      });
    } else {
      containerRef.current.className = "relative px-0 xl:-mx-4";
      const newColumnHeights = new Array(columnCount).fill(0);
      itemRefs.current.forEach((ref) => {
        if (ref.current) {
          const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
          ref.current.style.transform = `translate(${minHeightIndex * columnWidth}px, ${newColumnHeights[minHeightIndex]}px)`;
          ref.current.style.position = "absolute";
          ref.current.style.width = `${100 / columnCount}%`;
          newColumnHeights[minHeightIndex] += ref.current.clientHeight;
        }
      });
      containerRef.current.style.height = `${Math.max(...newColumnHeights, 0)}px`;
    }
  }, [columnCount, columnWidth]);

  useEffect(() => {
    computeLayout();
  }, [items, computeLayout, columnCount, imgWidth]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      computeColumnWidth();
      computeLayout();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [computeColumnWidth, computeLayout]);

  return (
    <div ref={containerRef} className={`relative`}>
      {items.map((item, index) => (
        <div key={item.slug} ref={itemRefs.current[index]} className={columnCount === 1 ? "py-2" : "p-2"}>
          <CardComponent item={item} imgWidth={imgWidth} />
        </div>
      ))}
    </div>
  );
};

export default WaterfallGrid;
