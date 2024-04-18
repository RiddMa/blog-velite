import React from "react";
import { Image as VeliteImage } from "velite";
import Image from "next/image";
import Link from "next/link";

interface IContentCardProps {
  cover?: VeliteImage;
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  caption?: React.ReactNode;
}

export const ContentCard: React.FC<IContentCardProps> = ({ cover, title, excerpt, caption }) => {
  return (
    // <div
    //   className={`card color-card flex flex-col xl:flex-row prose-article-card transition-apple drop-shadow-lg hover:drop-shadow-2xl max-h-[250px]`}
    // >
    //   {cover && (
    //     <div className="relative m-0 p-0 block min-w-[250px] max-w-[250px] min-h-[250px] max-h-[250px]">
    //       <Image
    //         src={cover.src}
    //         alt={"cover image"}
    //         className="card"
    //         fill={true}
    //         style={{ objectFit: "cover", margin: 0 }}
    //       />
    //     </div>
    //   )}
    <div className={`card color-card flex flex-col xl:flex-row transition-apple drop-shadow-lg hover:drop-shadow-2xl`}>
      {cover && (
        <div className="relative m-0 p-0 block aspect-video xl:aspect-square xl:w-[250px] xl:h-[250px]">
          <Image
            src={cover.src}
            alt={"cover image"}
            className="card"
            fill={true}
            sizes="(max-width: 1280px) 100vw, 250px"
            style={{ objectFit: "cover", margin: 0 }}
          />
        </div>
      )}
      <div className="m-0 flex flex-col flex-grow gap-4 p-4 xl:px-8 prose-article-card">
        {title && <>{title}</>}
        {excerpt && <>{excerpt}</>}
        <div className={`grow`}></div>
        {caption && <>{caption}</>}
      </div>
    </div>
  );
};

export default ContentCard;
