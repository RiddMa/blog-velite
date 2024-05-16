"use client";

import { motion } from "framer-motion";
import React from "react";

export const MotionDiv: React.FC<{ keyName: string; className?: string; children?: React.ReactNode }> = ({
  keyName, // DO NOT USE "KEY" AS A PROPERTY NAME
  className,
  children,
}) => {
  return (
    <motion.div key={keyName} layoutId={keyName} className={className}>
      {children}
    </motion.div>
  );
};
