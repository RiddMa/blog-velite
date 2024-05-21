"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const VisitCountDisplay = () => {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const fetchVisitCount = async () => {
      try {
        const res = await fetch(`/api/visit?slug=${pathname}`);
        const data = await res.json();
        setCount(data.count);
      } catch (error) {
        console.error("Failed to fetch visit count:", error);
      }
    };

    fetchVisitCount();
  }, [pathname]);

  return <>{count}</>;
};

export default VisitCountDisplay;
