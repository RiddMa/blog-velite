import React from "react";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";
import MobileNavMenu from "@/src/app/layout/components/mobile-nav-menu";
import DarkModeToggleClient from "@/src/app/layout/components/dark-mode-toggle.client";

interface TopNavbarProps {
  className?: string; // 可选的string类型
}

// 精简后的TopNavbar组件，只关注布局和基本逻辑
const TopNavbar: React.FC<TopNavbarProps> = ({ className = "" }) => {
  const [darkMode, setDarkMode, topNavOpen, setTopNav, rightNavOpen, setRightNav, leftNavOpen, setLeftNav] =
    usePageStateStore(
      useShallow((state) => [
        state.darkMode,
        state.setDarkMode,
        state.topNavOpen,
        state.setTopNav,
        state.rightNavOpen,
        state.setRightNav,
        state.leftNavOpen,
        state.setLeftNav,
      ]),
    );

  // 移动端和桌面端的NavList可以复用相同的组件，但传入不同的样式或props
  return (
    <div className={`fixed z-[100] w-full px-2 xl:px-4 ${className}`}>
      <div className="blur-bg transition-apple z-[100] mx-auto my-2 max-w-[1024px] rounded-2xl p-0 drop-shadow-2xl xl:my-4">
        <div className="nav-content">
          {/*{isMobile ? (*/}
          {/*  <>*/}
          {/*    <MobileNavMenu isOpen={navOpen} />*/}
          {/*  </>*/}
          {/*) : (*/}
          {/*  <NavList />*/}
          {/*)}*/}
          <DarkModeToggleClient />
        </div>
      </div>
    </div>
  );
};
