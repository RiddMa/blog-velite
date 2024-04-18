// app/providers.tsx

import { NextUIProvider } from "@/src/components/MyUIProvider";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextUIProvider>{children}</NextUIProvider>
    </>
  );
}
