"use client";

import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // if the user scrolls down, show the button
      window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    window.addEventListener("scroll", toggleVisibility);

    // clear the listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // handles the animation when scrolling to the top
  const scrollToTop = () => {
    isVisible &&
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
  };

  return (
    <button
      className={cn("top-navbar-btn", isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
      onClick={scrollToTop}
    >
      <span className="icon-[carbon--up-to-top] text-xl"></span>
      {/*<span className="icon-[icon-park-outline--to-top] text-lg"></span>*/}
    </button>
  );
};

export default ScrollToTopButton;
