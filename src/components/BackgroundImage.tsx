"use client";

import Image from "next/image";
import bgImageDark from "@/content/globals/background/milad-fakurian-nY14Fs8pxT8-unsplash.jpg";
import bgImageLight from "@/content/globals/background/pawel-czerwinski-nyJY9UZnkrE-unsplash.jpg";
// import bgImageLight from "@/content/globals/background/pawel-czerwinski-SoB70WFVWGU-unsplash.jpg";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import { AnimatePresence, motion } from "framer-motion";

export default function BackgroundImage() {
  const [darkMode, setDarkMode] = usePageStateStore(useShallow((state) => [state.darkMode, state.setDarkMode]));

  return (
    <AnimatePresence>
      {darkMode ? (
        <Image
          alt="Abstract background"
          src={bgImageDark}
          placeholder="blur"
          quality={10}
          sizes="100vw"
          className="bg-image brightness-75 contrast-125"
        />
      ) : (
        <Image
          alt="Abstract background"
          src={bgImageLight}
          placeholder="blur"
          quality={10}
          sizes="100vw"
          className="bg-image brightness-125 contrast-100 saturate-75"
        />
      )}
    </AnimatePresence>
  );
}
