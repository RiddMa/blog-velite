import { useState, useEffect } from "react";
import useWindowWidthState from "@/src/util/useWindowWidthState";

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

      // Attach the debounced resize handler
      window.addEventListener("resize", () => setColumnCount(getColumnCount(widthState)));

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", () => setColumnCount(getColumnCount(widthState)));
      };
    }
  }, [widthState]);

  return columnCount;
};

export default useColumnCount;
