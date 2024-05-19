"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";
import { Icon } from "@iconify-icon/react";

interface GptBlockProps {
  properties?: any; // You can define the type more specifically if needed
  children: React.ReactNode;
}

export const GptBlock: React.FC<GptBlockProps> = ({ properties, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="gpt -mx-content">
      <div
        className={`flex flex-row justify-between items-center m-0 pt-4 opacity-80 hover:opacity-100 transition-apple cursor-pointer ${open ? "pb-0" : "pb-4"}`}
        onClick={() => setOpen(!open)}
      >
        <span>{properties.model ? properties.model : "大语言模型"} 如是说：</span>
        <button className="btn btn-sm btn-ghost rounded-xl text-base font-normal outline-transparent border-none">
          <Icon icon="heroicons:chevron-down" className={`transition-apple ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: open ? 1 : 0, height: open ? "auto" : 0, paddingBottom: open ? "1rem" : 0 }}
        transition={transitionApple}
        className="overflow-hidden relative"
      >
        {children}
      </motion.div>
    </div>
  );
};
