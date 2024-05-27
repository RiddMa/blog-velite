"use client";

import React from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

interface LeftNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ children, className = "" }) => {
  const [leftNavOpen] = usePageStateStore(useShallow((state) => [state.leftNavOpen]));
  return (
    <aside
      className={`${leftNavOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"} side-navbar m-0 xl:mr-4 xl:text-right ${className}`}
    >
      {children}
    </aside>
  );
};

export default LeftNavbar;
