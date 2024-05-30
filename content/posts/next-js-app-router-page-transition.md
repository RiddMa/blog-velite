---
title: 在 Next.js 14 App Router 中实现页面切换的动画效果
slug: next-js-app-router-page-transition
author: ridd
categories:
  - coding
columns:
  - from-zero-to-hero-guide-to-modern-blog
tags:
  - Next.js
  - App Router
  - 路由动画
  - Framer Motion
  - Page Transition
  - Layout Transition
  - 页面切换动画
  - mekuri
  - React
  - HTML
  - CSS
  - Bug
created: '2024-05-16T06:29:52.000Z'
updated: '2024-05-30T22:36:30+08:00'
excerpt: >-
  在React中，由于缺乏组件卸载的生命周期钩子，实现元素退出动画较为困难。通常使用Framer
  Motion的`<AnimatePresence>`组件来包裹需要动画的组件以实现此功能。在Next.js中，虽然Page
  Router可以正常使用此方法，但App Router由于存在bug，无法正确实现退出动画。


  解决这一问题的常见方法包括：1) 在路由切换时延迟DOM卸载，直到动画播放完毕；2)
  修改所有`<Link>`的逻辑，先阻止跳转，动画结束后再通过`router.push()`触发跳转。然而，方法2不适用于浏览器前进/后退键触发的路由切换。


  针对Next.js 13中App Router的问题，GitHub上的issue
  [[NEXT-1151]](https://github.com/vercel/next.js/issues/49279)
  描述了在共享布局动画中出现的多个场景无法正常工作的情况，主要是因为`OuterLayoutRouter`组件的插入导致布局组件无法提供正确的退出动画。Stack
  Overflow上的一个帖子提出了一个可行的解决方案，通过调整Next.js的渲染堆栈或公开导航开始时的API事件来解决。


  具体的解决方案涉及创建一个`FrozenRouter`组件来保持页面切换过程中的上下文持久化，并使用`PageTransitionEffect`组件处理页面切换动画。此方法已在Next.js
  14.2.2版本中验证有效。此外，有人基于此原理开发了`mekuri`库，进一步封装了这一解决方案，但其具体效果尚需测试。
seoDescription: >-
  在Next.js中使用Framer Motion实现App
  Router的路由动画时，由于React未提供组件卸载的生命周期钩子，导致退出动画实现困难。虽然Next.js的Page
  Router可以通过包裹组件实现退出动画，但App
  Router因存在bug，无法正确执行。解决方案包括延迟DOM卸载直到动画播放完毕，或修改链接逻辑以在动画后触发路由跳转。特别地，针对Next.js
  13的app目录下使用Framer
  Motion的共享布局动画问题，建议调整渲染堆栈或公开导航API事件。此外，一个名为FrozenRouter的组件被提出，用于保持页面切换时的上下文一致性，确保动画效果的平滑过渡。
---

## 背景

由于 React 未提供组件卸载的生命周期钩子函数，创建元素退出动画非常不便。一般地，我们可以使用 Framer Motion 提供的 `<AnimatePresense>` 组件包裹需要切换的组件实现退出动画。在 Next.js 中，Page Router 路由可以正常地通过这种方式实现退出动画，但 App Router 情况有所不同，因为一些 bug，无法得到正确的组件退出效果。



## 解决方案

一般想要实现路由动画，解决思路有：

1. 在路由切换时通过钩子函数延迟 DOM 卸载，直到到元素播放完退出动画。
2. 修改所有 `<Link>` 的逻辑，点击后阻止跳转，播放动画完成后通过 `router.push()` 触发跳转。

方法 2 对使用浏览器前进/后退键触发的路由切换不生效，因此我们尝试用方法 1 解决问题。

[[NEXT-1151] App router issue with Framer Motion shared layout animations](https://github.com/vercel/next.js/issues/49279) 这个 issue 报告了 App Router 中实现跨路由动画相关的问题：Next.js 13 的 app 目录下使用 Framer Motion 的共享布局动画时，出现了多个场景无法正常工作的情况。用户报告了导航容器重新渲染时，样式发生变化的组件无法平滑过渡的问题。主要原因是 Next.js 的新 app 路由结构在布局和模板之间插入了 `OuterLayoutRouter` 组件，导致布局组件无法正常提供退出动画效果。建议的解决方案包括调整 Next.js 的渲染堆栈或公开导航开始时的 API 事件。

[How to make a page transition with Framer Motion and Next.js 14?](https://stackoverflow.com/a/77604347/18836875) 这个帖子中的回答总结上述 issue 的讨论，提出了一个可行的解决方案。在目前版本（Next.js 14.2.2）中验证可用，是相对简单可行的。

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime"; // hack
import { useContext, useRef } from "react";

// FrozenRouter 组件，保持页面切换过程中上下文的持久化
function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {}); // 使用 useContext 钩子获取当前的 LayoutRouterContext 上下文值。如果 LayoutRouterContext 为空，则使用空对象。
  const frozen = useRef(context).current; // 使用 useRef 创建一个持久化的引用来存储 context，并通过 current 属性获取其当前值，这样可以确保 context 在组件的整个生命周期内保持不变。
  // 将冻结的 context 作为值传递给 LayoutRouterContext.Provider，以确保子组件在页面切换过程中能够使用一致的上下文。
  return (
    <LayoutRouterContext.Provider value={frozen}> 
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

// 页面切换动画的配置
const variants = {
  hidden: { opacity: 0, x: -200, y: 100 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: -100 },
};

// PageTransitionEffect 组件，用于处理页面切换动画
const PageTransitionEffect = ({ children }: { children: React.ReactNode }) => {
  // 使用 usePathname 钩子获取路径名作为 key，以在路由更改时触发重新渲染
  const key = usePathname();

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ type: "linear" }}
        className="overflow-hidden"
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransitionEffect;
```

然后，在根布局组件 `RootLayout` 中应用：

```tsx
import React from "react";
import PageTransitionEffect from "@/src/components/transition/PageTransitionEffect";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="relative">
        <PageTransitionEffect>{children}</PageTransitionEffect>
      </body>
    </html>
  );
}

```

即可。

有人基于这个原理，开发了 [mekuri](https://github.com/FunTechInc/mekuri) 库，对上述原理做了进一步封装。具体效果有待测试。

