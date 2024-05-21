"use client";

import { useRef, useContext } from "react";
import { gsap } from "gsap";
import { TransitionContext } from "@/src/components/transition/TransitionProvider";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

const FadeInOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { timeline } = useContext(TransitionContext);
  const el = useRef<HTMLDivElement>(null);

  // useIsomorphicLayoutEffect to avoid console warnings
  useIsomorphicLayoutEffect(() => {
    // intro animation will play immediately
    gsap.to(el.current, {
      opacity: 1,
      duration: 1,
    });

    // add outro animation to top-level outro animation timeline
    timeline.add(
      gsap.to(el.current, {
        opacity: 0,
        duration: 0.5,
      }),
      0,
    );
  }, []);

  return (
    // set initial opacity to 0 to avoid FOUC for SSR
    <div ref={el}>{children}</div>
  );
};

export default FadeInOut;
