import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "../styles/typography.css";
import "../styles/scrollbar.css";
import React from "react";
import Providers from "./providers";
import { WebVitals } from "@/src/components/WebVitals";
import PageTransitionEffect from "@/src/components/transition/PageTransitionEffect";
import { globals } from "@/.velite";
import BackgroundImage from "@/src/components/BackgroundImage";
import PageTransition from "@/src/components/transition/RdPageTransition";
import TopNavbar from "@/src/components/layout/TopNavbar";

export const metadata: Metadata = {
  title: globals.metadata.title,
  description: globals.metadata.description,
  keywords: globals.metadata.keywords,
  authors: globals.metadata.authors,
  openGraph: globals.metadata.openGraph,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-[calc(100dvh)]`}>
        {/*<WebVitals />*/}
        <Providers>
          <BackgroundImage />
          <TopNavbar />
          <PageTransitionEffect>{children}</PageTransitionEffect>
          {/*<PageTransition>{children}</PageTransition>*/}
        </Providers>
      </body>
    </html>
  );
}
