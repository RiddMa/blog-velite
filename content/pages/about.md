---
title: 关于本站
slug: about
author: ridd
created: '2024-05-07T11:20:29.000Z'
updated: '2024-05-17T09:48:16.000Z'
excerpt: ' 本文详细介绍了一个博客的技术架构和内容规划。博客主要记录开发经验、电影、动漫、游戏的评价以及日常思考。技术上，博客采用了Next.js作为前端框架，Tailwind CSS等进行美化，并使用基于Git和Velite的Serverless CMS架构。部署方面，利用GitHub Actions进行CI/CD，并使用VPS。文章还列出了待完善的功能，如画廊模块、影评模块等，并展示了项目的时间线和技术栈的变迁。此外，博客具备LLM文章总结、小红书瀑布流布局、深色/浅色模式等特色功能。'
---

> 大风起↘↗兮云——飞——扬—— 
> 安得猛↘↗士↘兮走——四——方—— 
> 博客，必须要写！不写不行！

# 主要内容

- 记录开发踩坑经历，作为备忘 
- MAG(N) 版块记录 Movie、Anime、Game 的评价与感受 
- 记录日常胡思乱想

# 技术栈

## 现在（重构N次，决不再改！）

- 前端：Next.js
- 美化：Tailwind CSS + Framer Motion + DaisyUI + NextUI
- CMS：基于 Git 和 Velite 的 Serverless 架构
- 部署：GitHub Actions CI/CD + VPS

## 曾经

- CMS 后端：Strapi
- React 前端：Gatsby
- 美化：Tailwind CSS + Framer Motion
- 部署：Cloudflare Pages + Cloudflare Workers

# 待完善功能

## 特性

- 画廊模块
- 影评模块
- 文章目录树跟随滚动
- “回到顶部”按钮

## 外观

- 动效优化

# 时间线

- 2024年5月17日：搭建 Nginx 反代完成部署
- 2024年5月14日：接入 LLM
- 2024年5月13日：搭建 CI/CD 管线
- 2024年4月24日：增加小红书瀑布流文章布局
- 2024年4月15日：完成页面基础布局
- 2024年4月8日：Next.js+Velite 项目启动
- 2023年5月17日：正式部署
- 2023年5月13日：Cloudflare 部署测试
- 2023年4月20日：Gatsby.js+Strapi 项目启动

# 功能

- LLM 总结文章、生成 slug
- 小红书瀑布流布局，跨路由过渡动画
- 深色/浅色模式
- Giscus 评论系统
- 专栏、分类、标签过滤文章

# 友情链接

[Travis' Blog](https://blog.lxythan2lxy.cn/)
