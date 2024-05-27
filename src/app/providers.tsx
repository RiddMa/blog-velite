import { ProgressBarProvider } from "@/src/components/transition/react-transition-progress";
import { NextUIProvider } from "@/src/components/MyUIProvider";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProgressBarProvider>
        <NextUIProvider>{children}</NextUIProvider>
      </ProgressBarProvider>
    </>
  );
}
