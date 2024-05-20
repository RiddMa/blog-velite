import { useState, useEffect } from "react";
import { throttle } from "lodash";

const getWindowSize = () => ({
  innerWidth: typeof window !== "undefined" ? window.innerWidth : 0,
  innerHeight: typeof window !== "undefined" ? window.innerHeight : 0,
});

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial state
      setWindowSize(getWindowSize());

      // Throttle the resize handler
      const throttledResizeHandler = throttle(() => {
        setWindowSize(getWindowSize());
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

  return windowSize;
};

export default useWindowSize;
