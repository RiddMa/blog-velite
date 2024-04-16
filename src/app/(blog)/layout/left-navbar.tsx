"use client";

import React from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

interface LeftNavbarProps {
  children?: React.ReactNode;
  className?: string;
}

const LeftNavbar: React.FC<LeftNavbarProps> = ({ children, className }) => {
  const [leftNavOpen] = usePageStateStore(useShallow((state) => [state.leftNavOpen]));
  return (
    <div className={`${leftNavOpen ? "translate-x-0" : "-translate-x-full"} side-navbar text-right ${className}`}>
      {children}
    </div>
  );
};

export default LeftNavbar;
