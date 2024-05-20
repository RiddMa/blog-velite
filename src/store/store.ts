import { create } from "zustand";

// 定义状态和操作的接口
interface PageState {
  topNavOpen: boolean;
  setTopNav: (value: boolean) => void;
  rightNavOpen: boolean;
  setRightNav: (value: boolean) => void;
  leftNavOpen: boolean;
  setLeftNav: (value: boolean) => void;
  scrollPercentage: number;
  setScrollPercentage: (value: number) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
  disableScroll: boolean;
  setDisableScroll: (value: boolean) => void;
  waterfall: {
    [key: string]: {
      imgWidth: number;
      columnHeights: number[];
      cardPositions: { x: number; y: number }[];
    };
  };
  setWaterfall: (
    key: string,
    data: {
      imgWidth: number;
      columnHeights: number[];
      cardPositions: { x: number; y: number }[];
    },
  ) => void;
  setImgWidth: (key: string, value: number) => void;
  setColumnHeights: (key: string, value: number[]) => void;
  setCardPositions: (key: string, value: { x: number; y: number }[]) => void;
}

export const getDarkMode = () => {
  if (typeof window !== "undefined") {
    const storedPreference = window.localStorage.getItem("darkMode");
    if (storedPreference) {
      return storedPreference === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

const getIsMobile = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth < 1024;
  }
  return false;
};

// 使用 create 方法创建状态仓库
export const usePageStateStore = create<PageState>((set) => ({
  topNavOpen: false,
  setTopNav: (value) => set(() => ({ topNavOpen: value })),
  rightNavOpen: false,
  setRightNav: (value) => set(() => ({ rightNavOpen: value })),
  leftNavOpen: false,
  setLeftNav: (value) => set(() => ({ leftNavOpen: value })),
  scrollPercentage: 0,
  setScrollPercentage: (value: number) => set(() => ({ scrollPercentage: value })),
  darkMode: true,
  setDarkMode: (value) =>
    set(() => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("darkMode", JSON.stringify(value));
      }
      return { darkMode: value };
    }),
  isMobile: getIsMobile(),
  setIsMobile: (value) => set(() => ({ isMobile: value })),
  disableScroll: false,
  setDisableScroll: (value) => set(() => ({ disableScroll: value })),
  waterfall: {},
  setWaterfall: (key, data) =>
    set((state) => ({
      waterfall: {
        ...state.waterfall,
        [key]: data,
      },
    })),
  setImgWidth: (key, value) =>
    set((state) => ({
      waterfall: {
        ...state.waterfall,
        [key]: {
          ...state.waterfall[key],
          imgWidth: value,
        },
      },
    })),
  setColumnHeights: (key, value) =>
    set((state) => ({
      waterfall: {
        ...state.waterfall,
        [key]: {
          ...state.waterfall[key],
          columnHeights: value,
        },
      },
    })),
  setCardPositions: (key, value) =>
    set((state) => ({
      waterfall: {
        ...state.waterfall,
        [key]: {
          ...state.waterfall[key],
          cardPositions: value,
        },
      },
    })),
}));
