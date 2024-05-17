import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "../styles/typography.css";
import "../styles/scrollbar.css";
import React from "react";
import Providers from "./providers";
import { WebVitals } from "@/src/components/WebVitals";
import PageTransitionEffect from "@/src/components/transition/PageTransitionEffect";
import { globals } from "@/.velite";

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
    <html lang="en" className="dark" style={{ overflow: "auto", scrollbarGutter: "stable" }}>
      <body className={`overflow-x-clip min-h-[calc(100dvh)]`}>
        <WebVitals />
        <Providers>
          <PageTransitionEffect>{children}</PageTransitionEffect>
          {/*{children}*/}
        </Providers>
      </body>
    </html>
  );
}
