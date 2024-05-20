import { useState, useEffect } from "react";
import useWindowWidthState from "@/src/util/useWindowWidthState";
import { throttle } from "lodash";
import { useWindowSize } from "usehooks-ts";

// Function to determine the current width state
// const getColumnCount = (widthState: "mobile" | "tablet" | "desktop"): number => {
//   if (widthState === "mobile") {
//     return 1;
//   } else if (widthState === "desktop") {
//     return 3;
//   } else {
//     return 2;
//   }
// };
const getColumnCount = (width: number): number => {
  if (width <= 768) {
    return 1;
  } else if (width <= 1920) {
    return 2;
  } else {
    return 3;
  }
};

const useColumnCount = (): number => {
  const [columnCount, setColumnCount] = useState<number>(1);
  const widthState = useWindowWidthState();
  const { width = 0 } = useWindowSize();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial state
      setColumnCount(getColumnCount(width));

      // Throttle the resize handler
      const throttledResizeHandler = throttle(() => {
        setColumnCount(getColumnCount(width));
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
