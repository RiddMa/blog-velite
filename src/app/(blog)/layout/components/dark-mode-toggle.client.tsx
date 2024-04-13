"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";

interface DarkModeToggleProps {
  className?: string; // Make className optional
}

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const storedPreference = window.localStorage.getItem("darkMode");
      if (storedPreference) {
        return storedPreference === "true";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const className = isDarkMode ? "dark" : "light";
    document.documentElement.classList.add(className);
    document.documentElement.classList.remove(isDarkMode ? "light" : "dark");
    window.localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return { darkMode: isDarkMode, toggleDarkMode: toggleDarkMode };
};

const DarkModeToggleClient: React.FC<DarkModeToggleProps> = ({
  className = "",
}) => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className={"btn" + className}>
      <Icon icon={darkMode ? "heroicons:moon" : "heroicons:sun"} />
    </button>
  );
};

export default DarkModeToggleClient;
