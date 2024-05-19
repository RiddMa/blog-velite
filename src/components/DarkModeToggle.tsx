"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { getDarkMode, usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@nextui-org/button";

interface DarkModeToggleProps {
  className?: string; // Make className optional
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ className = "" }) => {
  const [darkMode, setDarkMode] = usePageStateStore(useShallow((state) => [state.darkMode, state.setDarkMode]));

  useEffect(() => {
    // console.log("darkMode", darkMode);
    // console.log("getDarkMode()", getDarkMode());
    setDarkMode(getDarkMode());

    const className = darkMode ? "dark" : "light";
    document.documentElement.classList.remove(darkMode ? "light" : "dark");
    document.documentElement.classList.add(className);
    document.documentElement.setAttribute("data-theme", className);
  }, [darkMode, setDarkMode]);

  return (
    <Button
      isIconOnly
      variant={`light`}
      aria-label="Toggle Dark Mode"
      onClick={() => setDarkMode(!darkMode)}
      className={`relative ${className}`}
    >
      <Icon
        icon="heroicons:moon"
        className={`absolute inset-0 flex items-center justify-center transition-apple ${darkMode ? "" : "scale-y-0"}`}
      />
      <Icon
        icon="heroicons:sun"
        className={`absolute inset-0 flex items-center justify-center transition-apple ${darkMode ? "scale-y-0" : ""}`}
      />
    </Button>
  );
};

export default DarkModeToggle;
