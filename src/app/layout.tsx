import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "../styles/typography.css";
import "../styles/scrollbar.css";
import React from "react";
import Providers from "./providers";
import PageTransitionEffect from "@/src/components/transition/PageTransitionEffect";
import { globals } from "@/.velite";
import BackgroundImage from "@/src/components/BackgroundImage";
import TopNavbar from "@/src/components/layout/TopNavbar";
import VisitCounter from "@/src/components/VisitCounter";
import Footer from "@/src/components/layout/Footer";
import UmamiTrack from "@/src/components/UmamiTrack";
import BackToTop from "@/src/components/BackToTop";
import ScrollToTopButton from "@/src/components/BackToTop";

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
      <UmamiTrack />
      <body className="relative">
        <Providers>
          <TopNavbar />
          <BackgroundImage />
          <PageTransitionEffect>{children}</PageTransitionEffect>
          <VisitCounter />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
