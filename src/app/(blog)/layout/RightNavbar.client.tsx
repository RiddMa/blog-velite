"use client";

import React from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

interface RightNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const RightNavbarClient: React.FC<RightNavbarProps> = ({ children, className }) => {
  const [rightNavOpen] = usePageStateStore(useShallow((state) => [state.rightNavOpen]));
  return (
    <div
      className={`${rightNavOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"} side-navbar m-0 xl:ml-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default RightNavbarClient;
