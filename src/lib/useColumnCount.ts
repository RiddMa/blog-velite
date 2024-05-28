import React, { useState, useEffect } from "react";
import { throttle } from "lodash";

const getColumnCount = (width: number): number => {
  if (width < 720) {
    return 1;
  } else if (width < 1080) {
    return 2;
  } else {
    return 3;
  }
};

const useColumnCount = (ref: React.RefObject<HTMLDivElement>): number => {
  const [columnCount, setColumnCount] = useState<number>(1);
  const width = ref.current?.clientWidth || 0;

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
  }, [width]);

  return columnCount;
};

export default useColumnCount;
