"use client";

import React, { useEffect, useCallback } from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import DarkModeToggleClient from "@/src/components/dark-mode-toggle.client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { globals } from "@/.velite";
import { Button } from "@nextui-org/button";
import { motion, useScroll } from "framer-motion";
import { throttle } from "lodash";
import { transitionApple } from "@/src/styles/framer-motion";

const NavList: React.FC = React.memo(() => {
  const [setTopNav] = usePageStateStore(useShallow((state) => [state.setTopNav]));

  return (
    <ul className="my-4 flex h-full w-full flex-col justify-center gap-2 text-lg xl:m-0 xl:flex-row xl:gap-1">
      {globals.topNavItems.map(({ label, href, icon }) => (
        <Link key={label} href={href} className="w-full">
          <button
            data-theme="dark"
            onClick={() => setTopNav(false)}
            className="top-navbar-btn w-full xl:w-fit"
            aria-label={`Navigate to ${label}`}
          >
            <Icon icon={icon} className="text-lg" />
            {label}
          </button>
        </Link>
      ))}
    </ul>
  );
});

NavList.displayName = "NavList";

interface TopNavbarProps {
  className?: string;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const [
    topNavOpen,
    setTopNav,
    rightNavOpen,
    setRightNav,
    leftNavOpen,
    setLeftNav,
    scrollPercentage,
    setScrollPercentage,
  ] = usePageStateStore(
    useShallow((state) => [
      state.topNavOpen,
      state.setTopNav,
      state.rightNavOpen,
      state.setRightNav,
      state.leftNavOpen,
      state.setLeftNav,
      state.scrollPercentage,
      state.setScrollPercentage,
    ]),
  );

  const { scrollYProgress } = useScroll();
  console.log(scrollYProgress.get());

  const updateScrollPercentage = useCallback(() => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScrollPercentage((scrolled / maxHeight) * 100);
    document.body.style.setProperty("--scroll-percentage", `${(scrolled / maxHeight) * 100}%`);
  }, [setScrollPercentage]);

  const throttledUpdate = throttle(updateScrollPercentage, 16.67);

  useEffect(() => {
    updateScrollPercentage();
    window.addEventListener("scroll", throttledUpdate);
    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      throttledUpdate.cancel();
    };
  }, [throttledUpdate, updateScrollPercentage]);

  const backgroundGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.7) ${scrollPercentage * 0.75 - 10}%, rgba(82, 82, 82, 0.8) ${scrollPercentage}%, rgba(0, 0, 0, 0.7) ${scrollPercentage}%)`;

  // const backgroundGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.7) ${scrollYProgress.get() * 0.75 - 10}%, rgba(82, 82, 82, 0.8) ${scrollYProgress.get()}%, rgba(0, 0, 0, 0.7) ${scrollYProgress.get()}%)`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          height: topNavOpen ? "100vh" : 0,
          opacity: topNavOpen ? 1 : 0,
        }}
        transition={transitionApple}
        className={`xl:hidden backdrop-blur-bg fixed inset-0 z-[99] bg-black/50`}
        onClick={() => setTopNav(false)}
      />
      <div className={`top-navbar-wrapper ${className}`}>
        <div className="top-navbar">
          <motion.div
            className="gradient-bar"
            animate={{ background: backgroundGradient }}
            transition={{
              duration: 0.03333,
              ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier values
            }}
            // style={{ background: backgroundGradient }}
          />
          <div className="flex w-full flex-row gap-0 px-1 xl:px-4 py-2 align-center items-center">
            <Button
              isIconOnly
              variant="light"
              aria-label="Toggle Left Navbar"
              onClick={() => {
                setRightNav(false);
                setLeftNav(!leftNavOpen);
              }}
              className="top-navbar-btn xl:hidden"
            >
              <Icon
                icon="heroicons:chevron-double-right"
                className={`${leftNavOpen ? "-scale-x-100" : "scale-x-100"} transition-apple`}
              />
            </Button>
            <Link href="/" className="transition-apple text-xl text-white/80 hover:text-white xl:-ml-2">
              <button
                data-theme="dark"
                aria-label="Homepage"
                onClick={() => setTopNav(false)}
                className="top-navbar-btn"
              >
                {globals.metadata.title.default}
              </button>
            </Link>
            <div className="hidden xl:block xl:grow">
              <span></span>
            </div>
            <div className="hidden items-center justify-center xl:block xl:mr-1">
              <NavList />
            </div>
            <div className="grow xl:hidden"></div>
            <DarkModeToggleClient className="top-navbar-btn xl:-mr-2" />
            <Button
              isIconOnly
              variant="light"
              aria-label="Toggle Nav Menu"
              onClick={() => setTopNav(!topNavOpen)}
              className="top-navbar-btn xl:hidden"
            >
              <Icon
                icon="heroicons:bars-3"
                className={`${topNavOpen ? "scale-y-0" : ""} transition-apple absolute inset-0 items-center justify-center flex`}
              />
              <Icon
                icon="heroicons:x-mark"
                className={`${topNavOpen ? "" : "scale-y-0"} transition-apple absolute inset-0 items-center justify-center flex`}
              />
            </Button>
            <Button
              isIconOnly
              variant="light"
              aria-label="Toggle Right Navbar"
              onClick={() => {
                setLeftNav(false);
                setRightNav(!rightNavOpen);
              }}
              className="top-navbar-btn xl:hidden"
            >
              <Icon
                icon="heroicons:chevron-double-left"
                className={`${rightNavOpen ? "-scale-x-100" : "scale-x-100"} transition-apple`}
              />
            </Button>
          </div>
          <div
            className={`transition-apple w-full overflow-hidden px-2 py-0 xl:hidden ${topNavOpen ? "max-h-screen" : "max-h-0"}`}
          >
            <NavList />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
