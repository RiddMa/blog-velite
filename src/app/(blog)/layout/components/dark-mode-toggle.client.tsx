"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

interface DarkModeToggleProps {
  className?: string; // Make className optional
}

const DarkModeToggleClient: React.FC<DarkModeToggleProps> = ({ className = "" }) => {
  const [darkMode, setDarkMode] = usePageStateStore(useShallow((state) => [state.darkMode, state.setDarkMode]));

  useEffect(() => {
    const className = darkMode ? "dark" : "light";
    document.documentElement.classList.add(className);
    document.documentElement.classList.remove(darkMode ? "light" : "dark");
    window.localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} className={"btn-circle transition-apple " + className}>
      <Icon icon={darkMode ? "heroicons:moon" : "heroicons:sun"} />
    </button>
  );
};

export default DarkModeToggleClient;
