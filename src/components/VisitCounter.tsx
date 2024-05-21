"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VisitCounter = () => {
  const pathname = usePathname();

  useEffect(() => {
    const incrementVisitCount = async () => {
      try {
        await fetch(`/api/visit?slug=${pathname}`, {
          method: "POST",
        });
      } catch (error) {
        console.error("Failed to fetch visit count:", error);
      }
    };

    incrementVisitCount();
  }, [pathname]);

  return <></>;
};

export default VisitCounter;
