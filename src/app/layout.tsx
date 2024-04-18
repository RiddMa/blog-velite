import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "../styles/typography.css";
import "../styles/scrollbar.css";
import React from "react";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
      <body className={`overflow-x-clip min-h-[calc(100dvh)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
