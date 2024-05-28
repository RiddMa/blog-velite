"use client";

import { gsap } from "@/src/lib/gsap";
import { usePathname } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/cn";
import { useStore } from "@/src/store/store";
import { useIsFirstRender } from "@/src/lib/useIsFirstRender";

interface Props {
  children: React.ReactNode;
}

export function saveScrollPosition(url: string, setRoutingPageOffset: (val: number) => void): void {
  const scrollPos = { x: window.scrollX, y: window.scrollY };
  setRoutingPageOffset(scrollPos.y);
  sessionStorage.setItem(url, JSON.stringify(scrollPos));
}

function clearAllScrollPos(): void {
  sessionStorage.clear();
}

function restoreScrollPos(url: string): void {
  const scrollPos = JSON.parse(sessionStorage.getItem(url) || JSON.stringify({ x: 0, y: 0 }));
  if (scrollPos) {
    window.scrollTo({
      top: scrollPos.y,
      left: scrollPos.x,
      behavior: "smooth",
    });
  }
}

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  const currentRef = useRef<HTMLDivElement>(null);
  const tempRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLCollection | null>(null);
  const [currentPath, setCurrentPath] = useState<string>(pathname);
  const [shouldScrollRestore, setShouldScrollRestore] = useState<boolean>(false);
  const isFirstRender = useIsFirstRender();
  const { isTransitionActive, setIsTransitionActive, routingPageOffset, setRoutingPageOffset } = useStore();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      restoreScrollPos(pathname);

      const onReload = (): void => {
        clearAllScrollPos();
      };

      window.addEventListener("beforeunload", onReload);

      window.addEventListener("popstate", () => {
        const scrollPos = { x: window.scrollX, y: window.scrollY };
        setRoutingPageOffset(scrollPos.y);
        setShouldScrollRestore(true);
      });

      return () => {
        window.removeEventListener("beforeunload", onReload);
      };
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (!currentRef.current) return;
    if (!lastRef.current) lastRef.current = currentRef.current.children;
    if (currentRef.current && tempRef.current) {
      const tempFirstChild = tempRef.current.children[0];
      const lastFirstChild = lastRef.current[0];
      if (tempFirstChild && lastFirstChild) {
        tempFirstChild.appendChild(lastFirstChild.cloneNode(true));
      }
      lastRef.current = currentRef.current.children;
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (currentRef.current && tempRef.current && !isFirstRender) {
      const tl = gsap.timeline({
        smoothChildTiming: true,
        defaults: {
          duration: 0.5,
        },
      });

      tl.set(tempRef.current, {
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
      });

      tl.set(currentRef.current, {
        position: "absolute",
        opacity: 0,
        top: "0",
        left: "0",
        width: "100vw",
        height: "100dvh",
        overflow: "hidden",
      });

      tl.fromTo(
        tempRef.current,
        {
          opacity: 1,
        },
        {
          opacity: 0,
          onStart: () => {
            setIsTransitionActive(true);
          },
        },
      );

      tl.fromTo(
        currentRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          onComplete: () => {
            setCurrentPath(pathname);
            setIsTransitionActive(false);
            setRoutingPageOffset(0);

            if (shouldScrollRestore) {
              setTimeout(() => {
                restoreScrollPos(pathname);
                setShouldScrollRestore(false);
              }, 500);
            }
          },
        },
      );

      tl.set(currentRef.current, {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
      });
    }
  }, [isFirstRender, pathname, setIsTransitionActive]);

  return (
    <div className={cn("content relative", isTransitionActive && "overflow-hidden bg-blue-800")}>
      {pathname !== currentPath && (
        <div key={pathname + " temp"} ref={tempRef} className={cn("temp transition")}>
          <div
            className="origin-center will-change-transform"
            style={{
              transform: `translateY(-${routingPageOffset}px)`,
            }}
          ></div>
        </div>
      )}

      <div key={pathname} ref={currentRef} className={cn("next transition")}>
        {children}
      </div>
    </div>
  );
}
