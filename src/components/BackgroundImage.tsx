"use client";

import Image from "next/image";
import bgImageDark from "@/content/globals/background/milad-fakurian-nY14Fs8pxT8-unsplash.jpg";
// import bgImageLight from "@/content/globals/background/pawel-czerwinski-nyJY9UZnkrE-unsplash.jpg";
// import bgImageLight from "@/content/globals/background/pawel-czerwinski-SoB70WFVWGU-unsplash.jpg";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import { AnimatePresence } from "framer-motion";

export default function BackgroundImage() {
  const [darkMode] = usePageStateStore(useShallow((state) => [state.darkMode, state.setDarkMode]));

  return (
    <AnimatePresence>
      {darkMode ? (
        <Image
          alt="Abstract background"
          src={bgImageDark}
          placeholder="blur"
          quality={10}
          priority={true}
          sizes="(max-width: 768px) 192px, (max-width: 1280px) 320px, (max-width: 1920px) 480px, 960px"
          className="bg-image brightness-75 contrast-125"
        />
      ) : (
        <>
          <div className="bg-white-gradient"></div>
        </>
        // <Image
        //   alt="Abstract background"
        //   src={bgImageLight}
        //   placeholder="blur"
        //   quality={10}
        //   priority={true}
        //   sizes="100vw"
        //   className="bg-image brightness-[1.5] contrast-[1] saturate-[0.2]"
        // />
      )}
    </AnimatePresence>
  );
}
