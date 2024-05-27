"use client";

import React from "react";
import { clsname } from "@/src/util/clsname";
import { motion, AnimatePresence } from "framer-motion";
import { transitionApple } from "@/src/styles/framer-motion";

const Spinner: React.FC<{ show?: boolean; className?: string }> = ({ show = true, className }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          layout={false}
          layoutId="loading-spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ...transitionApple, delay: 0.1 }}
          className={clsname("spinner opacity-80", className ? className : "w-4 h-4")}
        ></motion.div>
      )}
    </AnimatePresence>
  );
};

export default Spinner;
