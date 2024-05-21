"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { transitionApple } from "@/src/styles/framer-motion";
import { gsap, useGSAP, Flip } from "@/src/util/gsap";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;

  if (!frozen) {
    return <>{props.children}</>;
  }

  return <LayoutRouterContext.Provider value={frozen}>{props.children}</LayoutRouterContext.Provider>;
}

const defaultVariants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

const PageTransitionEffect: React.FC<{ children: React.ReactNode; variants?: Variants }> = ({
  children,
  variants = defaultVariants,
}) => {
  // The `key` is tied to the url using the `usePathname` hook.
  const key = `page-${usePathname()}`;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={transitionApple}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

// const PageTransitionEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const pathname = usePathname();
//   const key = `page-${pathname}`;
//   const el = useRef<HTMLDivElement | null>(null);
//   const [layoutState, setLayoutState] = useState({ items: [key], state: null });
//
//   const q = gsap.utils.selector(el);
//
//   useEffect(() => {
//     if (!el.current) return;
//
//     const newState = Flip.getState(q(".page-transition"));
//     setLayoutState((prev) => ({ ...prev, state: newState }));
//   }, [pathname, q]);
//
//   useGSAP(() => {
//     if (!layoutState.state) return;
//
//     Flip.from(layoutState.state, {
//       absolute: true,
//       ease: "power1.inOut",
//       targets: q(".page-transition"),
//       onEnter: (elements) => {
//         return gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, delay: 0.2, duration: 0.3 });
//       },
//       onLeave: (elements) => {
//         return gsap.to(elements, { opacity: 0, scale: 0 });
//       },
//     });
//   }, [layoutState.state, q]);
//
//   return (
//     <div ref={el}>
//       <div className="page-transition" key={key}>
//         <FrozenRouter>{children}</FrozenRouter>
//       </div>
//     </div>
//   );
// };

export default PageTransitionEffect;
