"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { Icon } from "@iconify-icon/react";
import { gsap, useGSAP } from "@/src/lib/gsap";

interface GptBlockProps {
  properties?: any; // You can define the type more specifically if needed
  children: React.ReactNode;
}

export const GptBlock: React.FC<GptBlockProps> = ({ properties, children }) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);

  useGSAP(() => {
    gsap.set(divRef.current, { opacity: 0, height: 0 });
  }, []);

  useGSAP(() => {
    if (open) {
      gsap.to(divRef.current, { display: "block" });
      gsap.to(divRef.current, { opacity: 1, height: "auto" });
    } else {
      gsap.to(divRef.current, { opacity: 0, height: 0 });
      gsap.to(divRef.current, { display: "none" });
    }
  }, [open]);

  return (
    <div className="gpt -mx-content">
      <div
        className={`flex flex-row justify-between items-center m-0 pt-4 opacity-80 hover:opacity-100 transition-apple cursor-pointer ${open ? "pb-0 select-auto" : "pb-3 select-none"}`}
        onClick={() => setOpen(!open)}
      >
        <span>{properties.model ? properties.model : "大语言模型"} 如是说：</span>
        <button className="btn btn-sm btn-ghost rounded-xl text-base font-normal outline-none border-none">
          <Icon icon="heroicons:chevron-down" className={`transition-apple ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div ref={divRef}>
        {children}
        <div className="h-4" />
      </div>
    </div>
  );
};
