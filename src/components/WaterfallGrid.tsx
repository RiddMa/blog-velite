"use client";
import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { useIsMobile } from "@nextui-org/use-is-mobile";

interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const [components, setComponents] = useState<React.JSX.Element[]>([]);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
  const [imgWidth, setImgWidth] = useState<number>(0);
  const isMobile = useIsMobile();
  const columnCount = isMobile ? 1 : 2;
  const cardGap = 16;
  const cardPadding = 16;

  const computeLayout = useCallback(() => {
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
        newColumnHeights[minHeightIndex] += ref.current.clientHeight + cardGap; // Assuming gap between items
      }
    });

    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  }, [columnCount]);

  useLayoutEffect(() => {
    const columnWidth = containerRef.current!.clientWidth / columnCount;
    const newImgWidth = isMobile ? columnWidth - cardGap * 2 : columnWidth - cardGap * 2 - cardPadding * 2;
    setImgWidth(newImgWidth);
  }, [items, isMobile, columnCount]);

  useEffect(() => {
    computeLayout();
  }, [components, computeLayout]); // Recompute layout when components change

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      computeLayout();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [items, imgWidth, components, computeLayout]); // Also recompute when image width or components array changes

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

  // const [components, setComponents] = useState<React.JSX.Element[]>([]);
  // const containerRef = useRef<HTMLDivElement>(null);
  // const itemRefs = useRef<Array<HTMLElement | null>>(Array(items.length).fill(null));
  // const [columnHeights, setColumnHeights] = useState<number[]>([]);
  // const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
  // const [imgWidth, setImgWidth] = useState<number>(0);
  // const isMobile = useIsMobile();
  // const columnCount = isMobile ? 1 : 2;
  // const cardGap = 16;
  // const cardPadding = 16;
  //
  // const computeImageWidth = () => {
  //   const columnWidth = containerRef.current!.clientWidth! / columnCount;
  //   if (isMobile) {
  //     setImgWidth(columnWidth - cardGap * 2);
  //   } else {
  //     setImgWidth(columnWidth - cardGap * 2 - cardPadding * 2);
  //   }
  // };
  //
  // useLayoutEffect(() => {
  //   computeImageWidth();
  //   // Load components asynchronously
  //   Promise.all(items.map((item) => renderItem(item, imgWidth))).then(setComponents);
  // }, [items, renderItem, isMobile, columnCount]); // Only run once on initial render
  //
  // const computeLayout = () => {
  //   const columnWidth = containerRef.current!.clientWidth! / columnCount;
  //   const newColumnHeights = new Array(columnCount).fill(0);
  //   const newPositions: Array<{ x: number; y: number }> = [];
  //
  //   itemRefs.current.forEach((item, index) => {
  //     if (item) {
  //       const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
  //       newPositions[index] = {
  //         x: minHeightIndex * columnWidth,
  //         y: newColumnHeights[minHeightIndex],
  //       };
  //
  //       newColumnHeights[minHeightIndex] += item.getBoundingClientRect().height;
  //     }
  //   });
  //
  //   setColumnHeights(newColumnHeights);
  //   setPositions(newPositions);
  // };
  //
  // useEffect(() => {
  //   const observer = new ResizeObserver((entries) => {
  //     computeLayout();
  //   });
  //
  //   itemRefs.current.forEach((ref) => {
  //     if (ref) {
  //       observer.observe(ref);
  //     }
  //   });
  //
  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [items]); // Re-run this effect if posts change
  //
  // useEventListener("resize", computeLayout);
  //
  // return (
  //   <>
  //     {/*<pre>{JSON.stringify({ columnHeights, positions, imgWidth }, null, 4)}</pre>*/}
  //     <div
  //       ref={containerRef}
  //       className="flex flex-wrap relative"
  //       style={{ height: `${Math.max(...columnHeights, 0)}px` }}
  //     >
  //       {items.map((item, index) => (
  //         <div
  //           key={item.slug!}
  //           className="px-0 py-4 xl:px-4"
  //           ref={(el) => {
  //             itemRefs.current[index] = el;
  //           }}
  //           style={{
  //             transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
  //             position: "absolute",
  //             width: `${100 / columnCount}%`,
  //           }}
  //         >
  //           {/*{renderItem(item, imgWidth)} /!* Use the render prop *!/*/}
  //           {components[index]}
  //         </div>
  //       ))}
  //     </div>
  //   </>
  // );
};

export default WaterfallGrid;
