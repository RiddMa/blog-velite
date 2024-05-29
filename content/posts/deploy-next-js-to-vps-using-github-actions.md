---
title: 使用 GitHub Actions 部署 Next.js 项目到 VPS
slug: deploy-next-js-to-vps-using-github-actions
author: ridd
cover: deploy-next-js-to-vps-using-github-actions.assets/image-20240514011402733.png
categories:
  - coding
columns:
  - from-zero-to-hero-guide-to-modern-blog
tags:
  - GitHub Actions
  - Next.js
  - VPS
  - Self-hosted
  - PM2
  - SSH
created: 2024-05-13T03:43:56+08:00
updated: 2024-05-14T14:24:13+08:00
excerpt: '本文详细介绍了如何使用GitHub Actions自动化部署Next.js项目到VPS服务器的流程。首先，配置SSH允许GitHub Actions通过SSH连接到服务器，包括为GitHub Actions创建系统用户、生成SSH密钥并添加到服务器，以及将私钥添加到GitHub仓库。接着，设置GitHub Actions Workflow，包括配置仓库Secrets和创建CI/CD流程。在Workflow中，定义了构建和部署两个主要工作，分别负责项目的构建和部署到服务器。构建工作包括检出代码、设置Node.js环境、安装依赖、构建项目和上传构建产物。部署工作则负责下载构建产物、清理服务器上的旧构建、上传新构建和重启服务器上的服务。此外，还介绍了如何在VPS服务器上预先安装依赖，并通过pm2管理应用。整个流程自动化程度高，提高了部署效率，减少了人工干预。'
---

# 流程

## 配置服务器

首先需要配置 SSH 允许 GitHub Actions 通过 SSH 连接到你的服务器：
1. 为 GitHub Actions 配置一个系统用户。
2. 生成 SSH 密钥，将公钥添加到服务器的`~/.ssh/authorized_keys`文件。
3. 添加私钥到 GitHub 仓库。

### 添加用户

```bash
sudo adduser github
sudo usermod -aG sudo github # 授予 sudo 权限，可选
```

### 生成 SSH 密钥

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-node"
ssh-copy-id -i ~/.ssh/keyname.pub username@remote_host # 假设生成的公钥文件是 keyname.pub。Windows 系统没有 ssh-copy-id，需要手动添加。
```

### 添加私钥到 GitHub 仓库

使用 `pbcopy < ~/.ssh/github_actions_node` 将私钥复制到剪切板（也可手动复制）。

访问 `<你的仓库 URL>/settings/secrets/actions` （Settings -> Secrets and Variables -> Actions），点击 `New repository secret` 添加新的 secret，名称 `SSH_KEY`（与下面 yaml 文件中对应），内容为私钥内容。

## 设置 GitHub Actions Workflow

1. 配置仓库 Secrets。
2. 在 GitHub 仓库根目录下创建一个新的`.github/workflows`目录。
3. 在这个目录中创建一个 YAML 文件（如 `deploy.yml`），并定义 CI/CD 流程。

### 配置 Secrets

访问 `<你的仓库 URL>/settings/secrets/actions` （Settings -> Secrets and Variables -> Actions），点击 `New repository secret` 新增。共需添加以下几个 secret：

- `PROJECT_DIRECTORY`: 项目部署路径，可以是相对或绝对路径。相对路径相对于登录用户的`~`路径，绝对路径注意是否有权限。
- `SSH_KEY`：SSH 私钥。[前文](#添加私钥到 GitHub 仓库)已添加。
- `SSH_HOST`：SSH 登录服务器的 IP 地址或域名。
- `SSH_USERNAME`：SSH 登录用户名。
- `SSH_PORT`：SSH 端口，默认为 22。

![image-20240514011103747](deploy-next-js-to-vps-using-github-actions.assets/image-20240514011103747.png)

### 创建 CI/CD 流程

在 GitHub 仓库根目录创建一个 `.github/workflows/deploy.yml` 如下：

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
        run: echo "cache_key=$(date +%s)" >> $GITHUB_OUTPUT

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

      - name: Clean Previous Build
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: |
            cd ${{ secrets.PROJECT_DIRECTORY }}
            rm -rf .next public package.json

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
            pm2 list | grep "blog-velite" && pm2 restart "blog-velite" || pm2 start yarn --name "blog-velite" -- start
            pm2 save
```

在`Restart Server`这一步骤中，使用了 yarn 作为部署 VPS 的包管理器。这是因为 yarn 消耗系统资源更少，适合弱鸡 VPS。

`NODE_OPTIONS="--max-old-space-size=1536"` 增加默认内存限制，否则可能出现类似  `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory` 的 OOM 报错。

:::gpt
这个 GitHub Actions 配置文件是用于自动化部署 Next.js 项目的流程。具体配置的解释如下：

### 工作流名称
- `name: Deploy Next.js Project` 定义了工作流的名称，为“Deploy Next.js Project”。

### 触发事件
- `on: push: branches: - master` 表明这个工作流会在向 `master` 分支推送代码时触发。

### 工作定义
#### 构建工作 (`build`)
1. **运行环境**:
    - `runs-on: ubuntu-latest` 表示该工作在最新版本的 Ubuntu 运行环境中执行。

2. **输出**:
    - `outputs: cache-key: ${{ steps.cache-key.outputs.key }}` 指定一个输出值，保存生成的缓存键，其他工作可以使用这个值。

3. **步骤**:
    - **代码检出**:
        - 使用 `actions/checkout@v4` 动作检出仓库代码。
    - **设置 Node.js**:
        - 使用 `actions/setup-node@v4` 动作设置 Node.js 环境，指定使用 Node.js 版本 18，并且配置 npm 缓存。
    - **安装依赖**:
        - 运行 `npm install` 安装项目依赖。
    - **构建项目**:
        - 运行 `npm run build` 构建 Next.js 项目。
    - **生成缓存键**:
        - 运行脚本生成一个基于当前时间戳的缓存键，并存储为步骤输出。
    - **归档项目构建产物**:
        - 使用 `actions/upload-artifact@v4` 动作上传构建后的文件，包括 `.next` 目录、`public` 目录和 `package.json` 文件。

#### 部署工作 (`deploy`)
1. **依赖**:
    - `needs: build` 表示部署工作需要在构建工作完成后执行。

2. **运行环境**:
    - 与构建工作相同，运行在 `ubuntu-latest`。

3. **步骤**:
    - **下载构建产物**:
        - 使用 `actions/download-artifact@v4` 动作下载之前上传的构建产物。
    - **清理旧构建**:
        - 使用 `appleboy/ssh-action@master` 动作通过 SSH 连接到服务器，执行脚本删除旧的构建文件。
    - **部署新构建**:
        - 使用 `appleboy/scp-action@master` 动作通过 SCP 将新构建文件上传到服务器。
    - **重启服务器上的服务**:
        - 再次使用 `appleboy/ssh-action@master` 动作执行服务器上的脚本，包括安装依赖、重启或启动服务，并保存 PM2 配置。

### 安全与配置
- 配置文件中使用了 `secrets` 来引用敏感信息，如 SSH 连接信息，确保这些信息不会直接暴露在公共配置文件中。

这个配置文件设计得很全面，涵盖了从代码构建到服务器部署的整个自动化流程，提高了部署效率并减少了人工错误。
:::

## 配置 VPS 服务器

在首次触发 Actions 部署之前，先安装好依赖：

```bash
cd /path/to/deployment # 与 secrets.PROJECT_DIRECTORY 相同
NODE_OPTIONS="--max-old-space-size=1536" yarn add sharp --ignore-engines
# 使用 pm2 管理应用
yarn global add pm2
```

随后向仓库提交更改，检查 Actions 是否运行。

# 效果

![image-20240514011402733](deploy-next-js-to-vps-using-github-actions.assets/image-20240514011402733.png)

![image-20240514011427738](deploy-next-js-to-vps-using-github-actions.assets/image-20240514011427738.png)

配置文件使用 `yarn start` 即`next start`，默认运行在 3000 端口：

![image-20240514011631894](deploy-next-js-to-vps-using-github-actions.assets/image-20240514011631894.png)
