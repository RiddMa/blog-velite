// pages/EmptyPage.tsx

import { NextPage } from "next";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import PhotoGallery from "@/src/app/gallery/_components/PhotoGallery";
import React from "react";
import { galleries } from "@/.velite";

const EmptyPage: NextPage = () => {
  const gallery = { ...galleries[0], images: galleries[0].images.concat(galleries[1].images) };

  return (
    <>
      {/*<WaterfallGrid items={} CardComponent={}/>*/}
      <div>
        <h1>Welcome to the Gallery</h1>
        <PhotoGallery gallery={gallery} />
      </div>
    </>
  );
};

export default EmptyPage;
