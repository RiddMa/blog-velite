import Image from "next/image";
import TopNavbar from "@/src/components/layout/TopNavbar";
import React from "react";

export default function Home() {
  return (
    <>
      <TopNavbar />
      <main className="min-h-[100dvh]">The React Framework for the Web</main>
    </>
  );
}
