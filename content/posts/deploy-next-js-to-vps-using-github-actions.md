---
title: 使用 GitHub Actions 部署 Next.js 项目到 VPS
slug: deploy-next-js-to-vps-using-github-actions
author: ridd
cover: deploy-next-js-to-vps-using-github-actions.assets/actions-deploy-success.png
excerpt: >
  给只有 128 位前缀的校园网地址配置 IPv6 NAT (NAT6)，与 AdGuardHome、OpenClash 共存。
categories: [coding, tech]
columns: [openwrt-software-based-router]
tags: [GitHub Actions, GitHub, Next.js, VPS, Self-hosted]
created: 2024-05-13T11:43:56+08:00
updated: 2024-05-13T11:43:56+08:00
---



```yaml
# .github/workflows/deploy.yml

name: Deploy Next.js Project

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      cache-key: ${{ steps.cache-key.outputs.key }}
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18' # 确保这里的版本与你的项目兼容
          cache: 'npm'

      - name: Install Dependencies
        run: npm install

      - name: Build Project
        run: npm run build

      - name: Generate Cache Key
        id: cache-key
        run: echo "::set-output name=key::$(date +%s)"

      - name: Archive Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: built-app
          path: |
            .next
            public
            package.json

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Download Artifacts
        uses: actions/download-artifact@v4
        with:
          name: built-app

      - name: Deploy to Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.SSH_PORT }}
          source: ".next,public,package.json"
          target: ${{ secrets.PROJECT_DIRECTORY }}

      - name: Restart Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: | 
            cd ${{ secrets.PROJECT_DIRECTORY }}
            export NVM_DIR=~/.nvm
            source ~/.nvm/nvm.sh
            NODE_OPTIONS="--max-old-space-size=1536" yarn install
            NODE_OPTIONS="--max-old-space-size=1536" yarn add sharp --ignore-engines
            yarn global add pm2
            pm2 list | grep "blog-velite" && pm2 restart "blog-velite" || pm2 start yarn --name "blog-velite" -- start
            pm2 save

```
