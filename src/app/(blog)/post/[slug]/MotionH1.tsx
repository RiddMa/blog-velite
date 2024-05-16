// "use client";
//
// import { motion } from "framer-motion";
// import React from "react";
//
// export function MotionH1(props: { permalink: any; title: any }) {
//   return (
//     <motion.h1 key={`post-title-${props.permalink}`} layoutId={`post-title-${props.permalink}`} className="text-center">
//       {props.title}
//     </motion.h1>
//   );
// }

"use client";

import { motion } from "framer-motion";
import React from "react";

export const MotionH1: React.FC<{ keyName: string; className?: string; children?: React.ReactNode }> = ({
  keyName, // DO NOT USE "KEY" AS A PROPERTY NAME
  className,
  children,
}) => {
  return (
    <motion.h1 key={keyName} layoutId={keyName} className={className}>
      {children}
    </motion.h1>
  );
};
