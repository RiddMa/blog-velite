"use client";

import React, { useEffect } from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
// import MobileNavMenu from "@/src/app/layout/components/mobile-nav-menu";
import DarkModeToggleClient from "@/src/app/(blog)/layout/components/dark-mode-toggle.client";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";
import { globals } from "@/.velite";

const MobileNavList: React.FC = () => {
  return <></>;
};

const NavList: React.FC = () => {
  return (
    <>
      <ul className="my-4 flex h-full w-full flex-col justify-center gap-4 text-xl lg:m-0 lg:flex-row lg:gap-6">
        {globals.topNavItems.map(({ label, href, icon }, key) => (
          <Link
            key={label}
            href={href}
            className="transition-apple flex flex-row flex-nowrap place-items-center gap-2 text-white/80 hover:text-white"
          >
            <Icon icon={icon} className="h-[1.25rem] w-[1.25rem]" />
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
  let isMobile = false;

  return (
    <>
      {isMobile && topNavOpen && (
        <div
          className={`blur-mask transition-apple fixed -left-20 -top-20 z-[99] h-[4096px] w-[1300px] bg-black/50`}
        ></div>
      )}
      <div className={`top-navbar-wrapper ${className}`}>
        <div className="top-navbar" style={{ background: backgroundGradient }}>
          <div className="flex w-full flex-row gap-2 px-4 xl:px-8 my-auto align-center items-center">
            <button
              onClick={() => {
                setRightNav(false);
                setLeftNav(!leftNavOpen);
              }}
              className="btn-circle h-5 w-5 my-auto p-0 text-white/[0.75] xl:hidden"
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
            <div className="hidden items-center justify-center lg:block ">
              <NavList />
            </div>
            <div className={`grow xl:hidden`}></div>
            <DarkModeToggleClient className={`text-white/80 hover:text-white h-5 w-5`} />
            <button
              onClick={() => setTopNav(!topNavOpen)}
              className="transition-apple h-5 w-5 text-white/[0.75] hover:text-white xl:hidden"
            >
              <Icon icon={topNavOpen ? "heroicons:x-mark" : "heroicons:bars-3"} />
            </button>
            <button
              onClick={() => {
                setLeftNav(false);
                setRightNav(!rightNavOpen);
              }}
              className="h-5 w-5 text-white/[0.75] xl:hidden"
            >
              <Icon
                icon={"heroicons:chevron-double-left"}
                className={`${rightNavOpen ? "-scale-x-100" : "scale-x-100"} transition-apple`}
              />
            </button>
          </div>
          <div
            className={`transition-apple overflow-hidden px-4 py-0 lg:hidden ${topNavOpen ? `max-h-60` : `max-h-0`}`}
          >
            <NavList />
          </div>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
