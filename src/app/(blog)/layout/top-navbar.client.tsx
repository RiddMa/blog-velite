"use client";

import React, { useEffect } from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import DarkModeToggleClient from "@/src/app/(blog)/layout/components/dark-mode-toggle.client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { globals } from "@/.velite";

const NavList: React.FC = () => {
  return (
    <>
      <ul className="my-4 flex h-full w-full flex-col justify-center gap-4 text-lg xl:m-0 xl:flex-row xl:gap-6">
        {globals.topNavItems.map(({ label, href, icon }, key) => (
          <Link
            key={label}
            href={href}
            className="transition-apple flex flex-row flex-nowrap place-items-center gap-2 text-white/80 hover:text-white"
          >
            <Icon icon={icon} className="text-lg" />
            <span className={`whitespace-nowrap inline-block`}>{label}</span>
          </Link>
        ))}
      </ul>
    </>
  );
};

interface TopNavbarProps {
  className?: string; // 可选的string类型
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

  const updateScrollPercentage = () => {
    const scrolled = document.documentElement.scrollTop;
    const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    setScrollPercentage((scrolled / maxHeight) * 100);
  };
  useEffect(() => {
    updateScrollPercentage();
    window.addEventListener("scroll", updateScrollPercentage);
  });

  const backgroundGradient = `linear-gradient(to right, rgb(0,0,0,0.7) ${
    scrollPercentage * 0.75 - 10
  }%, rgb(82, 82, 82,0.8) ${scrollPercentage}%, rgb(0,0,0,0.7) ${scrollPercentage}%)`;

  return (
    <>
      <div
        className={`${topNavOpen ? "opacity-100 h-screen" : "opacity-0 h-0"} xl:hidden blur-mask transition-apple fixed top-0 left-0 z-[99] w-screen bg-black/50`}
      />

      <div className={`top-navbar-wrapper ${className}`}>
        <div className="top-navbar" style={{ background: backgroundGradient }}>
          <div className="flex w-full flex-row gap-2 px-4 xl:px-8 py-2 align-center items-center">
            <button
              onClick={() => {
                setRightNav(false);
                setLeftNav(!leftNavOpen);
              }}
              className="top-navbar-btn xl:hidden"
            >
              <Icon
                icon={"heroicons:chevron-double-right"}
                className={`${leftNavOpen ? "-scale-x-100" : "scale-x-100"} transition-apple`}
              />
            </button>
            <Link href="/" className="transition-apple text-xl text-white/80 hover:text-white">
              {"Ridd Blog"}
            </Link>
            <div className={`hidden xl:block xl:grow`}>
              <span></span>
            </div>
            <div className="hidden items-center justify-center xl:block ">
              <NavList />
            </div>
            <div className={`grow xl:hidden`}></div>
            <DarkModeToggleClient className={`top-navbar-btn`} />
            <button onClick={() => setTopNav(!topNavOpen)} className="top-navbar-btn xl:hidden">
              <Icon
                icon={"heroicons:bars-3"}
                className={`${topNavOpen ? "scale-y-0" : ""} transition-apple absolute inset-0 items-center justify-center flex`}
              />
              <Icon
                icon={"heroicons:x-mark"}
                className={`${topNavOpen ? "" : "scale-y-0"} transition-apple absolute inset-0 items-center justify-center flex`}
              />
            </button>
            <button
              onClick={() => {
                setLeftNav(false);
                setRightNav(!rightNavOpen);
              }}
              className="top-navbar-btn xl:hidden"
            >
              <Icon
                icon={"heroicons:chevron-double-left"}
                className={`${rightNavOpen ? "-scale-x-100" : "scale-x-100"} transition-apple`}
              />
            </button>
          </div>
          <div
            className={`transition-apple overflow-hidden px-4 py-0 xl:hidden ${topNavOpen ? `max-h-screen` : `max-h-0`}`}
          >
            <NavList />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
