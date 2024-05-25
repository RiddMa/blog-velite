// "use client";

import React from "react";
import Script from "next/script";

const UmamiTrack = () => {
  return (
    <>
      {process.env.NODE_ENV === "production" && process.env.UMAMI_WEBSITE_ID && (
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id={process.env.UMAMI_WEBSITE_ID}
          strategy="afterInteractive"
        />
      )}
    </>
  );
};

export default UmamiTrack;
