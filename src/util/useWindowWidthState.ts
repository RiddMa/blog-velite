import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useEventListener } from "usehooks-ts";

// Function to determine the current width state
const getWidthState = (): "mobile" | "tablet" | "desktop" => {
  if (window.innerWidth < 768) {
    return "mobile";
  } else if (window.innerWidth < 1280) {
    return "tablet";
  } else {
    return "desktop";
  }
};

const useWindowWidthState = (): "mobile" | "tablet" | "desktop" => {
  const [widthState, setWidthState] = useState<"mobile" | "tablet" | "desktop">(getWidthState);

  useEffect(() => {
    // Set initial state
    setWidthState(getWidthState());
  }, []);

  // Use lodash.debounce to debounce the resize handler
  const debouncedResizeHandler = debounce(() => {
    setWidthState(getWidthState());
  }, 150); // 150ms debounce delay

  // Use usehooks-ts useEventListener to handle the resize event
  useEventListener("resize", debouncedResizeHandler);

  return widthState;
};

export default useWindowWidthState;
