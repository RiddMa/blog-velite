import { useState, useEffect } from "react";

// This hook does not need to receive parameters, and it returns a boolean
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Function to check the screen width and update the state
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 1280);
    };

    // Check on initial mount
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []); // Empty array ensures effect only runs on mount and unmount

  return isMobile;
};

export default useIsMobile;
