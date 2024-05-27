"use client";

import React from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

interface RightNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const RightNavbar: React.FC<RightNavbarProps> = ({ children, className = "" }) => {
  const [rightNavOpen] = usePageStateStore(useShallow((state) => [state.rightNavOpen]));
  return (
    <aside
      className={`${rightNavOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"} side-navbar m-0 xl:ml-4 ${className}`}
    >
      {children}
    </aside>
  );
};

export default RightNavbar;
