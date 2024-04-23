"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Post } from "@/.velite";
import { useEventListener, useResizeObserver } from "usehooks-ts";
import PostCard from "@/src/components/PostCard";

interface WaterfallGridProps {
  posts: Post[];
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ posts }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>(Array(posts.length).fill(null));
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const columnCount = 2;
  const cardGap = 16;
  const cardPadding = 16;

  const computeImageWidth = () => {
    const columnWidth = containerRef.current!.clientWidth! / columnCount;
    setImgWidth(columnWidth - cardGap * 2 - cardPadding * 2);
  };

  useLayoutEffect(() => {
    computeImageWidth();
  }, []); // Only run once on initial render

  const computeLayout = () => {
    const columnWidth = containerRef.current!.clientWidth! / columnCount;
    const newColumnHeights = new Array(columnCount).fill(0);
    const newPositions: Array<{ x: number; y: number }> = [];

    itemRefs.current.forEach((item, index) => {
      if (item) {
        const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
        newPositions[index] = {
          x: minHeightIndex * columnWidth,
          y: newColumnHeights[minHeightIndex],
        };

        newColumnHeights[minHeightIndex] += item.getBoundingClientRect().height;
      }
    });

    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      computeLayout();
    });

    itemRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [posts]); // Re-run this effect if posts change

  useEventListener("resize", computeLayout);

  return (
    <>
      <pre>{JSON.stringify({ columnHeights, positions, imgWidth }, null, 4)}</pre>
      <div
        ref={containerRef}
        className="flex flex-wrap relative"
        style={{ height: `${Math.max(...columnHeights, 0)}px` }}
      >
        {posts.map((post, index) => (
          <div
            key={post.slug}
            className="p-4"
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            style={{
              transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
              position: "absolute",
              width: `${100 / columnCount}%`,
            }}
          >
            <PostCard imgWidth={imgWidth} post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default WaterfallGrid;
