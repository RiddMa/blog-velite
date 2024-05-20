// "use client";
//
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import useColumnCount from "@/src/util/useColumnCount";
// import { throttle } from "lodash";
// import { cn } from "@/src/util/my-classnames";
// import { usePathname } from "next/navigation";
// import { usePageStateStore } from "@/src/store/store";
// import { useShallow } from "zustand/react/shallow";
//
// export interface WaterfallGridProps {
//   items: { slug: string; [key: string]: any }[];
//   CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
// }
//
// const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
//   const { waterfall, setImgWidth, setColumnHeights, setCardPositions } = usePageStateStore();
//   const [columnWidth, setColumnWidth] = useState<number>(0);
//   const cardPadding = 16;
//   const columnCount = useColumnCount(containerRef);
//   const pathname = usePathname();
//   const { imgWidth, columnHeights, cardPositions } = waterfall[pathname];
//
//   useEffect(() => {
//     itemRefs.current = items.map(() => React.createRef<HTMLDivElement>());
//   }, [items]);
//
//   const computeColumnWidth = useCallback(() => {
//     if (containerRef.current) {
//       const width = containerRef.current.clientWidth / columnCount;
//       setColumnWidth(width);
//     }
//   }, [columnCount]);
//
//   useEffect(() => {
//     if (containerRef.current) {
//       const newImgWidth = columnWidth - cardPadding * 2;
//       setImgWidth(pathname, newImgWidth);
//     } else {
//       setImgWidth(pathname, 0);
//     }
//   }, [columnWidth, cardPadding, setImgWidth, pathname]);
//
//   const throttledComputeLayout = throttle(() => {
//     computeLayout();
//   }, 16.67);
//
//   const computeLayout = useCallback(() => {
//     if (!containerRef.current) {
//       return;
//     }
//     if (columnCount === 1) {
//       itemRefs.current.forEach((ref) => {
//         if (ref.current) {
//           ref.current.removeAttribute("style");
//         }
//       });
//     } else {
//       const newColumnHeights = new Array(columnCount).fill(0);
//       const newPosstions = new
//       itemRefs.current.forEach((ref) => {
//         if (ref.current) {
//           const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
//           const newPosition = { x: minHeightIndex * columnWidth, y: newColumnHeights[minHeightIndex] };
//           ref.current.style.width = `${100 / columnCount}%`;
//           newColumnHeights[minHeightIndex] += ref.current.clientHeight;
//         }
//       });
//       containerRef.current.style.height = `${Math.max(...newColumnHeights, 0)}px`;
//     }
//   }, [columnCount, columnWidth]);
//
//   useEffect(() => {
//     throttledComputeLayout();
//   }, [items, computeLayout, columnCount, imgWidth, throttledComputeLayout]);
//
//   useEffect(() => {
//     const observer = new ResizeObserver(() => {
//       computeColumnWidth();
//       throttledComputeLayout();
//     });
//     if (containerRef.current) {
//       observer.observe(containerRef.current);
//     }
//     return () => observer.disconnect();
//   }, [computeColumnWidth, computeLayout, throttledComputeLayout]);
//
//   if (columnCount === 1) {
//     return (
//       <div ref={containerRef} className={`flex flex-col -mx-8`}>
//         {items.map((item, index) => (
//           <div key={item.slug} ref={itemRefs.current[index]} className={columnCount === 1 ? "px-4 py-2" : "p-4"}>
//             <CardComponent item={item} imgWidth={imgWidth} />
//           </div>
//         ))}
//       </div>
//     );
//   } else {
//     return (
//       <div ref={containerRef} className={`relative -mx-8`} style={{ height: `${Math.max(...columnHeights, 0)}px` }}>
//         {items.map((item, index) => (
//           <div
//             key={item.slug}
//             ref={itemRefs.current[index]}
//             className={cn("absolute", columnCount === 1 ? "px-4 py-2" : "p-4")}
//             style={{
//               transform: `translate(${cardPositions[index].x}px, ${cardPositions[index].y}px)`,
//               width: `${100 / columnCount}%`,
//             }}
//           >
//             <CardComponent item={item} imgWidth={imgWidth} />
//           </div>
//         ))}
//       </div>
//     );
//   }
// };
//
// export default WaterfallGrid;

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useColumnCount from "@/src/util/useColumnCount";
import { throttle } from "lodash";

export interface WaterfallGridProps {
  items: { slug: string; [key: string]: any }[];
  CardComponent: React.FC<{ item: { slug: string; [key: string]: any }; imgWidth: number }>;
}

const WaterfallGrid: React.FC<WaterfallGridProps> = ({ items, CardComponent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(items.map(() => React.createRef<HTMLDivElement>()));
  const [imgWidth, setImgWidth] = useState<number>(0);
  const [columnWidth, setColumnWidth] = useState<number>(0);
  const cardPadding = 16;
  const columnCount = useColumnCount(containerRef);

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

  const throttledComputeLayout = throttle(() => {
    computeLayout();
  }, 16.67);

  const computeLayout = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    if (columnCount === 1) {
      containerRef.current.className = "flex flex-col -mx-8";
      containerRef.current.style.height = "auto";
      itemRefs.current.forEach((ref) => {
        if (ref.current) {
          ref.current.removeAttribute("style");
        }
      });
    } else {
      containerRef.current.className = "relative px-0 -mx-8";
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
    throttledComputeLayout();
  }, [items, computeLayout, columnCount, imgWidth, throttledComputeLayout]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      computeColumnWidth();
      throttledComputeLayout();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [computeColumnWidth, computeLayout, throttledComputeLayout]);

  console.log("WaterfallGrid");

  return (
    <div ref={containerRef} className={`relative`}>
      {/*containerWidth: {containerRef.current?.clientWidth}px <br />*/}
      {/*width: {columnWidth}px <br />*/}
      {/*columnCount: {columnCount}*/}
      {items.map((item, index) => (
        <div key={item.slug} ref={itemRefs.current[index]} className={columnCount === 1 ? "px-4 py-2" : "p-4"}>
          <CardComponent item={item} imgWidth={imgWidth} />
        </div>
      ))}
    </div>
  );
};

export default WaterfallGrid;
