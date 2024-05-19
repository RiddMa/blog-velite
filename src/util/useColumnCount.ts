import { useState, useEffect } from "react";
import useWindowWidthState from "@/src/util/useWindowWidthState";
import { throttle } from "lodash";

// Function to determine the current width state
const getColumnCount = (widthState: "mobile" | "tablet" | "desktop"): number => {
  return widthState === "mobile" ? 1 : 2;
};

const useColumnCount = (): number => {
  const [columnCount, setColumnCount] = useState<number>(1);
  const widthState = useWindowWidthState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial state
      setColumnCount(getColumnCount(widthState));

      // Throttle the resize handler
      const throttledResizeHandler = throttle(() => {
        setColumnCount(getColumnCount(widthState));
      }, 16.67); // 16.67ms throttle delay

      // Attach the debounced resize handler
      window.addEventListener("resize", throttledResizeHandler);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", throttledResizeHandler);
        throttledResizeHandler.cancel();
      };
    }
  }, [widthState]);

  return columnCount;
};

export default useColumnCount;
