"use client";

import React, { useEffect, useCallback } from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import DarkModeToggleClient from "@/src/components/dark-mode-toggle.client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { globals } from "@/.velite";
import { Button } from "@nextui-org/button";

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

  const updateScrollPercentage = useCallback(() => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScrollPercentage((scrolled / maxHeight) * 100);
  }, [setScrollPercentage]);

  useEffect(() => {
    updateScrollPercentage();
    window.addEventListener("scroll", updateScrollPercentage);
    return () => {
      window.removeEventListener("scroll", updateScrollPercentage);
    };
  }, [updateScrollPercentage]);

  const backgroundGradient = `linear-gradient(to right, rgba(0, 0, 0, 0.7) ${scrollPercentage * 0.75 - 10}%, rgba(82, 82, 82, 0.8) ${scrollPercentage}%, rgba(0, 0, 0, 0.7) ${scrollPercentage}%)`;

  return (
    <>
      <div
        className={`${topNavOpen ? "opacity-100 h-full" : "opacity-0 h-0"} xl:hidden backdrop-blur-bg transition-apple fixed inset-0 z-[99] bg-black/50`}
        onClick={() => setTopNav(false)}
        aria-hidden={topNavOpen ? "false" : "true"}
      />
      {/*<motion.div key="top-navbar" layout={true} layoutId="top-navbar" className={`top-navbar-wrapper ${className}`}>*/}
      <div className={`top-navbar-wrapper ${className}`}>
        <div className="top-navbar" style={{ background: backgroundGradient }}>
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
