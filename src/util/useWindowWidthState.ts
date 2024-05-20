import { useState, useEffect } from "react";
import { throttle } from "lodash";

// Function to determine the current width state
export const getWidthState = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) {
      return "mobile";
    } else if (window.innerWidth < 1280) {
      return "tablet";
    } else {
      return "desktop";
    }
    // if (window.innerWidth < 1280) {
    //   return "mobile";
    // } else if (window.innerWidth < 1280) {
    //   return "tablet";
    // } else {
    //   return "desktop";
    // }
  }
  return "desktop"; // Default to "desktop" if window is not defined
};

const useWindowWidthState = (): "mobile" | "tablet" | "desktop" => {
  const [widthState, setWidthState] = useState<"mobile" | "tablet" | "desktop">(getWidthState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial state
      setWidthState(getWidthState());

      // Throttle the resize handler
      const throttledResizeHandler = throttle(() => {
        setWidthState(getWidthState());
      }, 16.67); // 16.67ms throttle delay

      // Attach the throttled resize handler
      window.addEventListener("resize", throttledResizeHandler);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", throttledResizeHandler);
        throttledResizeHandler.cancel();
      };
    }
  }, []);

  return widthState;
};

export default useWindowWidthState;
