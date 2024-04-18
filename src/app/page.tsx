import Image from "next/image";
import TopNavbar from "@/src/app/(blog)/layout/TopNavbar.client";
import React from "react";

export default function Home() {
  return (
    <>
      <TopNavbar />
      <main className="min-h-[100dvh]"></main>
    </>
  );
}
