// "use client";
// import { Post } from "@/.velite";
// import React, { useState, useEffect, useRef } from "react";
// import ContentCard from "@/src/components/ContentCard";
// import Link from "next/link";
// import { formatDate } from "@/src/store/day";
//
// interface WaterfallGridProps {
//   posts: Post[];
// }
//
// const WaterfallGrid: React.FC<WaterfallGridProps> = ({ posts }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const itemRefs = useRef<Array<HTMLElement | null>>([]);
//   const [columnHeights, setColumnHeights] = useState<number[]>([]);
//   const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([]);
//   const [imgWidth, setImgWidth] = useState<number>(0);
//   const columnCount = 2;
//
//   const computeLayout = (useActualHeights: boolean) => {
//     const columnWidth = containerRef.current ? containerRef.current.clientWidth / columnCount : 0;
//     setImgWidth(columnWidth);
//     const newColumnHeights = new Array(columnCount).fill(0);
//     const newPositions: Array<{ x: number; y: number }> = [];
//
//     posts.forEach((post, index) => {
//       const cover = post.cover;
//       let imageHeight = 0; // Default height if no cover image
//       if (!!cover) {
//         const imageRatio = cover.height / cover.width;
//         imageHeight = columnWidth * imageRatio;
//       }
//
//       const renderedHeight = itemRefs.current[index] ? itemRefs.current[index]!.getBoundingClientRect().height : 0;
//
//       let itemHeight = useActualHeights && itemRefs.current[index] ? renderedHeight : imageHeight + 8 + 40 + 8 + 40; // Use a default height on initial render
//
//       const minHeightIndex = newColumnHeights.indexOf(Math.min(...newColumnHeights));
//
//       newPositions.push({
//         x: minHeightIndex * columnWidth,
//         y: newColumnHeights[minHeightIndex],
//       });
//
//       newColumnHeights[minHeightIndex] += itemHeight;
//     });
//
//     setColumnHeights(newColumnHeights);
//     setPositions(newPositions);
//   };
//
//   useEffect(() => {
//     computeLayout(false); // Initial layout with static height
//     window.addEventListener("resize", () => computeLayout(true)); // Recompute layout on resize with actual heights
//
//     return () => {
//       window.removeEventListener("resize", () => computeLayout(true));
//     };
//   }, [computeLayout, posts]);
//
//   useEffect(() => {
//     window.onload = () => {
//       computeLayout(true);
//     };
//   }, [computeLayout]);
//
//   return (
//     <div ref={containerRef} className={`flex flex-wrap relative`} style={{ height: `${Math.max(...columnHeights)}px` }}>
//       {posts.map((post, index) => (
//         <Link
//           key={post.slug}
//           href={post.permalink}
//           ref={(el) => {
//             itemRefs.current[index] = el;
//           }}
//           className={`p-4`}
//           style={{
//             transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
//             position: "absolute",
//             width: `${100 / columnCount}%`,
//           }}
//         >
//           <ContentCard
//             imgWidth={imgWidth}
//             cover={post.cover}
//             title={<h1 className="line-clamp-2 overflow-ellipsis">{post.title}</h1>}
//             excerpt={<p className="line-clamp-3 overflow-ellipsis">{post.excerpt}</p>}
//             caption={
//               <div className={`flex flex-row m-0 opacity-80 w-full relative`}>
//                 <div className={`my-0 p-0 text-body text-color-caption line-clamp-1 overflow-ellipsis break-after-all`}>
//                   {post.tags.map((tag) => (
//                     <>{tag} &nbsp;</>
//                   ))}
//                 </div>
//                 <div className={`grow`}></div>
//                 <span className={`text-body text-color-caption inline-block text-nowrap ml-4`}>
//                   {formatDate(post.updated)}
//                 </span>
//               </div>
//             }
//           />
//         </Link>
//       ))}
//     </div>
//   );
// };
//
// export default WaterfallGrid;
"use client";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import ContentCard from "@/src/components/ContentCard";
import { Post } from "@/.velite";
import { formatDate } from "@/src/store/day";
import { useEventListener } from "usehooks-ts";

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

  const computeLayout = () => {
    const columnWidth = containerRef.current ? containerRef.current.clientWidth / columnCount : 0;
    setImgWidth(columnWidth);
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

  useLayoutEffect(() => {
    computeLayout();
  }, [posts]);

  useEventListener("resize", computeLayout);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap relative"
      style={{ height: `${Math.max(...columnHeights, 0)}px` }}
    >
      {posts.map((post, index) => (
        <Link
          key={post.slug}
          href={post.permalink}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className="p-4"
          style={{
            transform: `translate(${positions[index]?.x}px, ${positions[index]?.y}px)`,
            position: "absolute",
            width: `${100 / columnCount}%`,
          }}
        >
          <ContentCard
            imgWidth={imgWidth}
            cover={post.cover}
            title={<h1 className="line-clamp-2 overflow-ellipsis">{post.title}</h1>}
            excerpt={<p className="line-clamp-3 overflow-ellipsis">{post.excerpt}</p>}
            caption={
              <div className="flex flex-row m-0 opacity-80 w-full relative">
                <div className="my-0 p-0 text-body text-color-caption line-clamp-1 overflow-ellipsis break-after-all">
                  {post.tags.map((tag) => (
                    <>{tag} &nbsp;</>
                  ))}
                </div>
                <div className="grow"></div>
                <span className="text-body text-color-caption inline-block text-nowrap ml-4">
                  {formatDate(post.updated)}
                </span>
              </div>
            }
          />
        </Link>
      ))}
    </div>
  );
};

export default WaterfallGrid;
