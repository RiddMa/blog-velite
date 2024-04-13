import { create } from "zustand";

// 定义状态和操作的接口
interface PageState {
  topNavOpen: boolean;
  setTopNav: (value: boolean) => void;
  rightNavOpen: boolean;
  setRightNav: (value: boolean) => void;
  leftNavOpen: boolean;
  setLeftNav: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

// 使用 create 方法创建状态仓库
export const usePageStateStore = create<PageState>((set) => ({
  topNavOpen: false,
  setTopNav: (value) => set(() => ({ topNavOpen: value })),
  rightNavOpen: false,
  setRightNav: (value) => set(() => ({ rightNavOpen: value })),
  leftNavOpen: false,
  setLeftNav: (value) => set(() => ({ leftNavOpen: value })),
  darkMode: false,
  setDarkMode: (value: boolean) => set(() => ({ darkMode: value })),
}));
