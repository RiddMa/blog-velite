import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        apple: "cubic-bezier(0.25,0.1,0.25,1.0)",
      },
      colors: {
        neutral: colors.neutral,
        primary: colors.sky,
      },
      fontFamily: {
        sans: ["Noto Sans", ...defaultTheme.fontFamily.sans],
        serif: [...defaultTheme.fontFamily.serif],
        mono: ["JetBrains Mono", ...defaultTheme.fontFamily.mono],
      },
      screens: {
        xs: "480px", // 可以用于小型设备如较小的iPhone
        sm: "640px", // 默认的小设备断点
        md: "768px", // 适合iPad竖屏
        lg: "1024px", // 适合iPad横屏和低分辨率的笔记本电脑
        xl: "1280px", // 标准笔记本电脑尺寸
        "2xl": "1536px", // 大型笔记本电脑
        fhd: "1920px", // 常规桌面显示器
        "3xl": "1920px", // 常规桌面显示器
        "4k": "3840px", // 4K显示器
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      typography() {
        return {
          DEFAULT: {
            css: {
              lineHeight: 1.5,
              pre: {
                "background-color": "transparent",
              },
              "code::before": {
                content: "none", // don’t generate the pseudo-element
              },
              "code::after": {
                content: "none",
              },
              code: {
                "font-weight": 400,
                "font-size": "0.875rem",
                "line-height": "1.25rem",
                "background-color": "transparent",
              },
              a: {
                "text-decoration-line": "none",
              },
              h1: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              },
              h2: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              },
              h3: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.5,
              },
              h4: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.5,
              },
              h5: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                lineHeight: 1.5,
              },
              h6: {
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              },
            },
          },
        };
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
