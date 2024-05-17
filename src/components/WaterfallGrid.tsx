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
  const cardGap = 16;
  const cardPadding = 16;
  const windowWidthState = useWindowWidthState();
  const columnCount = windowWidthState === "mobile" ? 1 : 2;

  const computeLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const columnWidth = containerRef.current.clientWidth / columnCount;
    const newColumnHeights = new Array(columnCount).fill(0);
    const newPositions: Array<{ x: number; y: number }> = [];

    itemRefs.current.forEach((ref, index) => {
      if (ref.current) {
        const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
        newPositions[index] = {
          x: minHeightIndex * columnWidth,
          y: newColumnHeights[minHeightIndex],
        };
        newColumnHeights[minHeightIndex] += ref.current.clientHeight + cardGap;
      }
    });

    setColumnHeights(newColumnHeights);
    setPositions(newPositions);
  }, [columnCount, cardGap]);

  useEffect(() => {
    computeLayout();
  }, [items, columnCount, computeLayout]);

  useEffect(() => {
    const observer = new ResizeObserver(computeLayout);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [computeLayout]);

  const imgWidthCalculation = useCallback(() => {
    if (!containerRef.current) return;
    const columnWidth = containerRef.current.clientWidth / columnCount;
    return columnWidth - cardPadding * 2 - (windowWidthState === "mobile" ? 0 : cardGap * 2);
  }, [columnCount, cardPadding, cardGap, windowWidthState]);

  useEffect(() => {
    const newImgWidth = imgWidthCalculation();
    if (newImgWidth) {
      setImgWidth(newImgWidth);
    }
  }, [imgWidthCalculation]);

  const renderColumns = () =>
    items.map((item, index) => (
      <div
        key={item.slug}
        ref={itemRefs.current[index]}
        className="px-0 py-4 xl:px-4"
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
    items.map((item, index) => (
      <div key={item.slug} className="flex flex-col relative gap-8">
        <CardComponent item={item} imgWidth={imgWidth} />
      </div>
    ));

  return (
    <div ref={containerRef} className="relative px-0 xl:-mx-4" style={{ height: `${Math.max(...columnHeights, 0)}px` }}>
      {windowWidthState === "mobile" ? renderMobile() : renderColumns()}
    </div>
  );
};

export default WaterfallGrid;

// "use client";
//
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import useWindowWidthState from "@/src/util/useWindowWidthState";
//
// export interface WaterfallGridProps {
//   items: { slug: string; [key: string]: any }[];
//   CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
// }
//
// const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);
//   const [columnHeights, setColumnHeights] = useState<number[]>([]);
//   const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
//   const [imgWidth, setImgWidth] = useState<number>(0);
//   const cardGap = 16;
//   const cardPadding = 16;
//   const windowWidthState = useWindowWidthState();
//   const columnCount = windowWidthState === "mobile" ? 1 : 2;
//
//   useEffect(() => {
//     itemRefs.current = items.map(() => React.createRef<HTMLDivElement>());
//   }, [items]);
//
//   const calculateColumnWidth = useCallback(() => {
//     if (!containerRef.current) {
//       return 0;
//     }
//     return containerRef.current.clientWidth / columnCount;
//   });
//
//   const computeLayout = useCallback(() => {
//     const columnWidth = calculateColumnWidth();
//     const newColumnHeights = new Array(columnCount).fill(0);
//     const newPositions: Array<{ x: number; y: number }> = [];
//
//     itemRefs.current.forEach((ref, index) => {
//       if (ref.current) {
//         const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
//         newPositions[index] = {
//           x: minHeightIndex * columnWidth,
//           y: newColumnHeights[minHeightIndex],
//         };
//         newColumnHeights[minHeightIndex] += ref.current.clientHeight + cardGap;
//       }
//     });
//
//     setColumnHeights(newColumnHeights);
//     setPositions(newPositions);
//   }, [calculateColumnWidth, columnCount]);
//
//   useEffect(() => {
//     computeLayout();
//   }, [items, columnCount, computeLayout]);
//
//   useEffect(() => {
//     const observer = new ResizeObserver(computeLayout);
//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }
//     return () => observer.disconnect();
//   }, [computeLayout]);
//
//   useEffect(() => {
//     const newImgWidth = calculateColumnWidth() - cardPadding * 2 - (windowWidthState === "mobile" ? 0 : cardGap * 2);
//     setImgWidth(newImgWidth);
//   }, [columnCount, cardPadding, cardGap, windowWidthState, calculateColumnWidth]);
//
//   const renderColumns = () =>
//     items.map((item, index) => (
//       <div
//         key={item.slug}
//         ref={itemRefs.current[index]}
//         className="px-0 py-4 xl:px-4"
//         style={{
//           transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
//           position: "absolute",
//           width: `${100 / columnCount}%`,
//         }}
//       >
//         <CardComponent item={item} imgWidth={imgWidth} />
//       </div>
//     ));
//
//   const renderMobile = () =>
//     items.map((item, index) => (
//       <div key={item.slug} className="flex flex-col gap-8">
//         <CardComponent item={item} imgWidth={imgWidth} />
//       </div>
//     ));
//
//   return (
//     <div ref={containerRef} className="relative px-0 xl:-mx-4" style={{ height: `${Math.max(...columnHeights, 0)}px` }}>
//       {windowWidthState === "mobile" ? renderMobile() : renderColumns()}
//     </div>
//   );
// };
//
// export default WaterfallGrid;
