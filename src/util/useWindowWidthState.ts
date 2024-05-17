// import { useState, useEffect } from "react";
// import { debounce } from "lodash";
// import { useEventListener } from "usehooks-ts";
//
// // Function to determine the current width state
// const getWidthState = (): "mobile" | "tablet" | "desktop" => {
//   if (window.innerWidth < 768) {
//     return "mobile";
//   } else if (window.innerWidth < 1280) {
//     return "tablet";
//   } else {
//     return "desktop";
//   }
// };
//
// const useWindowWidthState = (): "mobile" | "tablet" | "desktop" => {
//   const [widthState, setWidthState] = useState<"mobile" | "tablet" | "desktop">(getWidthState);
//
//   useEffect(() => {
//     // Set initial state
//     setWidthState(getWidthState());
//   }, []);
//
//   // Use lodash.debounce to debounce the resize handler
//   const debouncedResizeHandler = debounce(() => {
//     setWidthState(getWidthState());
//   }, 150); // 150ms debounce delay
//
//   // Use usehooks-ts useEventListener to handle the resize event
//   useEventListener("resize", debouncedResizeHandler);
//
//   return widthState;
// };
//
// export default useWindowWidthState;
import { useState, useEffect } from "react";
import { debounce } from "lodash";
import { useEventListener } from "usehooks-ts";

// Function to determine the current width state
const getWidthState = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 768) {
      return "mobile";
    } else if (window.innerWidth < 1280) {
      return "tablet";
    } else {
      return "desktop";
    }
  }
  return "desktop"; // Default to "desktop" if window is not defined
};

const useWindowWidthState = (): "mobile" | "tablet" | "desktop" => {
  const [widthState, setWidthState] = useState<"mobile" | "tablet" | "desktop">(getWidthState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Set initial state
      setWidthState(getWidthState());

      // Debounce the resize handler
      const debouncedResizeHandler = debounce(() => {
        setWidthState(getWidthState());
      }, 150); // 150ms debounce delay

      // Attach the debounced resize handler
      window.addEventListener("resize", debouncedResizeHandler);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("resize", debouncedResizeHandler);
        debouncedResizeHandler.cancel();
      };
    }
  }, []);

  return widthState;
};

export default useWindowWidthState;
