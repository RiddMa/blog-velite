"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useColumnCount from "@/src/lib/useColumnCount";
import { gsap, useGSAP } from "@/src/lib/gsap";
const cardPadding = 16;

export interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number; isMobile: boolean }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useMemo(() => items.map(() => React.createRef<HTMLDivElement>()), [items]);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [columnWidth, setColumnWidth] = useState<number>(0);
  const columnCount = useColumnCount(containerRef);

  const computeColumnWidth = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const width = containerRef.current!.clientWidth / columnCount;
    setColumnWidth(width);
  }, [columnCount]);

  useEffect(() => {
    const newImgWidth = columnWidth - cardPadding * 2;
    setImgWidth(newImgWidth);
  }, [columnWidth]);

  const computeLayout = useCallback(() => {
    const newColumnHeights = new Array(columnCount).fill(0);
    const newPositions: { x: number; y: number }[] = [];
    itemRefs.forEach((ref, index) => {
      if (!ref.current) return;
      const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
      newPositions[index] = {
        x: minHeightIndex * columnWidth,
        y: newColumnHeights[minHeightIndex],
      };
      newColumnHeights[minHeightIndex] += ref.current.clientHeight;
    });
    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  }, [columnCount, columnWidth, itemRefs]);

  useEffect(() => {
    computeLayout();
  }, [items, columnCount, imgWidth]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      computeColumnWidth();
      computeLayout();
    });
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, [computeLayout, computeColumnWidth]);

  useGSAP(() => {
    gsap.from(containerRef.current, { opacity: 0, delay: 0.25 });
  }, []);

  const renderMobile = () => {
    return (
      <div ref={containerRef} className="flex flex-col -mx-8">
        {items.map((item) => (
          <div key={item.slug} className="px-4 py-2">
            <CardComponent item={item} imgWidth={imgWidth} isMobile={true} />
          </div>
        ))}
      </div>
    );
  };

  const renderColumns = () => {
    return (
      <div ref={containerRef} className="relative px-0 -mx-8" style={{ height: `${Math.max(...columnHeights, 0)}px` }}>
        {items.map((item, index) => (
          <div
            key={item.slug}
            ref={itemRefs[index]}
            className="absolute p-4"
            style={{
              transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
              width: `${100 / columnCount}%`,
            }}
          >
            <CardComponent item={item} imgWidth={imgWidth} isMobile={false} />
          </div>
        ))}
      </div>
    );
  };

  return <>{columnCount === 1 ? renderMobile() : renderColumns()}</>;
};

export default WaterfallGrid;
