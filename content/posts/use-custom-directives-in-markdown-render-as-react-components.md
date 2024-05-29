---
title: 在 Markdown 中使用自定义指令，并渲染为 React 组件
slug: use-custom-directives-in-markdown-render-as-react-components
cover: >-
  use-custom-directives-in-markdown-render-as-react-components.assets/css-is-awesome-directive.png
author: ridd
categories:
  - coding
columns:
  - from-zero-to-hero-guide-to-modern-blog
tags:
  - Markdown
  - React
  - Next.js
  - Unified
  - remark
  - rehype
  - Custom Directives
created: '2024-05-14T09:27:13.000Z'
updated: '2024-05-29T17:45:24+08:00'
excerpt: >-
  本文详细介绍了如何通过自定义指令扩展Markdown语法，以实现更丰富的文章内容展示，如外链嵌入、图表视频和特殊样式文本等。文章首先解释了自定义指令的概念和格式，然后介绍了`remark`和`rehype`工具链的使用，这些工具用于处理和转换Markdown和HTML内容。接着，文章展示了如何使用`remark-directive`、`remark-directive-rehype`和`rehype-react`插件来实现Markdown到HTML的转换，并进一步将HTML转换为React组件，以便在React应用中渲染。此外，文章还提供了一个实际的代码示例，展示了如何定义和使用这些插件来处理Markdown内容，并将其转换为可在网页上展示的HTML。通过这些技术，作者能够在不修改代码的情况下，通过Markdown文本编辑器向博客中添加复杂组件和可交互内容。
---

## 什么是自定义指令

Markdown 自定义指令的格式可以参考[讨论帖](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444)。通过自定义指令，可以扩展 Markdown 基础语法，增加一些个性化的功能（当然，需要渲染器/编辑器支持）。我在博客中希望能有一些基于 Markdown 编写的外链嵌入、图表视频、特殊样式文本等，丰富文章内容。使用自定义指令主要是希望替代部分 MDX 的功能，因为 MDX 的语法与 Markdown 不完全兼容，会造成旧数据迁移困难、复制粘贴文章内容编译报错等很多困扰。

:::gpt{model="GPT-4o"}

根据该网页，Directive有以下几种格式：

1. **Inline Directives**：以一个冒号开头，格式为`:name[content]{key=val}`，用于内联元素。
2. **Leaf Block Directives**：以两个冒号开头，格式为`::name [content] {key=val}`，用于独立的块元素。
3. **Container Block Directives**：以三个或更多冒号开头，格式为`:::name [inline-content] {key=val} contents :::`，用于包含其他块元素的容器。

更多详细信息和示例可以在网页上找到：[Generic directives/plugins syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444)

:::



## remark 和 rehype

:::gpt{model="GPT-4o"}

`remark` 和 `rehype` 是两个用于处理和转换 Markdown 和 HTML 内容的工具链。它们通常结合在一起使用，以便将 Markdown 转换为 HTML，或在处理 Markdown 和 HTML 时进行一些额外的操作。以下是对它们的介绍：

### remark
`remark` 是一个基于 AST（抽象语法树）的 Markdown 解析器和转换器。它提供了一系列的插件来解析、转换和格式化 Markdown 文本。`remark` 的核心库是 `remark`，而它的生态系统包含许多插件，用于不同的转换和操作。以下是一些常见的 `remark` 插件：

- `remark-parse`：解析 Markdown 文本为 AST。
- `remark-stringify`：将 AST 转换回 Markdown 文本。
- `remark-lint`：对 Markdown 内容进行语法检查。
- `remark-html`：将 Markdown 转换为 HTML。
- `remark-rehype`：将 Markdown 转换为 rehype 的节点树。

### rehype
`rehype` 是一个基于 AST 的 HTML 解析器和转换器。它可以解析 HTML，将其转换为 AST，进行各种转换操作，然后再将 AST 转换回 HTML。`rehype` 也有许多插件来处理和转换 HTML。以下是一些常见的 `rehype` 插件：

- `rehype-parse`：解析 HTML 为 AST。
- `rehype-stringify`：将 AST 转换为 HTML。
- `rehype-minify`：压缩 HTML 内容。
- `rehype-highlight`：对代码块进行语法高亮。

### remark 和 rehype 的结合使用
`remark` 和 `rehype` 通常结合使用来处理和转换 Markdown 和 HTML。例如，可以先使用 `remark` 解析和转换 Markdown 内容，然后使用 `rehype` 进一步处理生成的 HTML。一个常见的用例是将 Markdown 转换为 HTML，同时对代码块进行语法高亮。

以下是一个示例代码，展示了如何将 Markdown 转换为 HTML 并对代码块进行语法高亮：

```javascript
const remark = require('remark');
const remarkHtml = require('remark-html');
const rehype = require('rehype');
const rehypeHighlight = require('rehype-highlight');

remark()
  .use(remarkHtml)
  .process('# Hello world!', (err, file) => {
    if (err) throw err;
    rehype()
      .data('settings', { fragment: true })
      .use(rehypeHighlight)
      .process(file.contents, (err, file) => {
        if (err) throw err;
        console.log(String(file));
      });
  });
```

在这个示例中，`remark` 用于解析 Markdown 并转换为 HTML，然后 `rehype` 用于对生成的 HTML 进行语法高亮处理。

:::



我使用 `Velite` 定义 Markdown 文档的组织结构和转换逻辑，`Velite` 使用的 `remark` 和 `rehype` 插件可以如下定义：

```javascript
const blogMarkdown = s.markdown({
  gfm: true,
  removeComments: false,
  copyLinkedFiles: true,
  remarkPlugins: [
    remarkParse,
    remarkBreaks,
    remarkFrontmatter,
    remarkGfm,
    remarkMath,
    remarkEmoji,
    remarkDirective,
    remarkDirectiveRehype,
  ],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeKatex, rehypeStringify],
});
```

一般地，使用将 Markdown 转换为 HTML 字符串的方法如下：

```bash
npm install remark remark-parse rehype rehype-stringify unified
```

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

async function convertMarkdownToHtml(markdown: string): Promise<string> {
    const file = await unified()
        .use(remarkParse) // 使用 remark 解析 Markdown
        .use(remarkRehype) // 将 Markdown 转换为 rehype 的节点树
        .use(rehypeStringify) // 将 rehype 的节点树转换为 HTML
        .process(markdown); // 处理输入的 Markdown 字符串

    return String(file); // 返回 HTML 字符串
}
```



## 代码实现

主要使用 [remark-directive](https://github.com/remarkjs/remark-directive)、 [remark-directive-rehype](https://github.com/IGassmann/remark-directive-rehype) 和 [rehype-react](https://github.com/rehypejs/rehype-react) 这三个插件。

:::gpt{model="GPT-4o"}

`remark-directive` 是一个用于处理自定义指令的 `remark` 插件。自定义指令是一种扩展 Markdown 语法的方式，可以插入特定的 HTML 元素或属性，适用于需要在 Markdown 文档中添加自定义内容或样式的场景。

主要功能包括：

1. **解析自定义指令**：识别并解析 Markdown 文档中的自定义指令。
2. **生成抽象语法树（AST）节点**：将解析后的指令转换为 `remark` 的抽象语法树（AST）节点，便于进一步处理。



`remark-directive-rehype` 是一个插件，允许你在使用 `remark` 和 `rehype` 处理 Markdown 时，处理自定义指令。这个项目在你希望由 `remark-directive` 解析的指令在使用 `remark-rehype` 时被解析为 HTML（hast 节点）时非常有用。这特别适用于将 Markdown 指令转换为 HTML 标签，并通过 `react-markdown` 输出为组件的场景。

这个插件的主要功能包括：

1. **解析自定义指令**：它能够识别并解析 Markdown 中的自定义指令语法。
2. **转换为 rehype 兼容的节点**：将解析后的自定义指令转换为 rehype 兼容的节点，使其可以进一步处理和转换为 HTML。

这个插件的使用场景包括需要在 Markdown 中插入复杂的 HTML 元素，或者希望通过 Markdown 语法实现某些特殊功能，如插入图表、视频、特殊样式的文本等。

你可以在 `remark` 和 `rehype` 的处理管道中使用这个插件，结合其他插件，实现复杂的 Markdown 转换和处理。



`rehype-react` 是一个用于将 HTML（hast）语法树转换为 React 组件的插件。它适用于希望在 React 应用中渲染经过处理的 HTML 内容的场景。

主要功能和特点包括：

1. **将 HTML 转换为 React 组件**：`rehype-react` 能够将经过 `rehype` 处理的 HTML 语法树（hast）转换为 React 组件，从而使得在 React 应用中可以方便地使用和渲染这些内容。
2. **支持自定义组件**：在转换过程中，你可以定义和使用自定义的 React 组件，替代标准的 HTML 元素。这使得你可以在渲染过程中插入自定义逻辑或样式。
3. **集成性强**：`rehype-react` 可以与 `unified` 生态系统中的其他插件结合使用，如 `remark` 和 `rehype`，以创建强大且灵活的内容处理管道。

:::



我的博客中，为了加速 SSR 响应，Markdown 到 HTML 转换部分是在编译期进行的，代码如下。这段 TypeScript 代码定义了一个名为 `parseMarkdown` 的异步函数，该函数接受一个包含 Markdown 内容的字符串作为输入，并返回一个转换后的 HTML 字符串。函数使用 `unified` 处理器和一系列插件来解析和转换 Markdown 内容。你可以直观地看到上文提及的插件所处的位置。

```typescript
// 引入所需的库和插件
import { unified } from 'unified'; // 引入 unified 库
import remarkParse from 'remark-parse'; // 引入 remark-parse 插件，用于解析 Markdown 语法
import remarkBreaks from 'remark-breaks'; // 引入 remark-breaks 插件，用于将换行符转换为 <br> 标签
import remarkFrontmatter from 'remark-frontmatter'; // 引入 remark-frontmatter 插件，用于解析前置数据块
import remarkGfm from 'remark-gfm'; // 引入 remark-gfm 插件，用于支持 GitHub Flavored Markdown 语法
import remarkMath from 'remark-math'; // 引入 remark-math 插件，用于解析数学公式
import remarkEmoji from 'remark-emoji'; // 引入 remark-emoji 插件，用于解析表情符号
import remarkDirective from 'remark-directive'; // 引入 remark-directive 插件，用于解析自定义指令
import remarkDirectiveRehype from 'remark-directive-rehype'; // 引入 remark-directive-rehype 插件，用于将自定义指令转换为 Rehype 节点
import remarkRehype from 'remark-rehype'; // 引入 remark-rehype 插件，用于将 Markdown 转换为 Rehype（HTML AST）
import rehypeRaw from 'rehype-raw'; // 引入 rehype-raw 插件，用于解析原始 HTML
import rehypeSlug from 'rehype-slug'; // 引入 rehype-slug 插件，用于为标题生成唯一的 slug
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // 引入 rehype-autolink-headings 插件，用于为标题添加自动链接
import rehypeKatex from 'rehype-katex'; // 引入 rehype-katex 插件，用于使用 KaTeX 渲染数学公式
import rehypeStringify from 'rehype-stringify'; // 引入 rehype-stringify 插件，用于将 Rehype AST 转换为 HTML 字符串

/**
 * 解析 Markdown 内容并转换为 HTML 字符串
 * 
 * @param {string} markdown - 要解析的 Markdown 字符串
 * @returns {Promise<string>} - 返回解析后的 HTML 字符串
 */
export async function parseMarkdown(markdown: string): Promise<string> {
  // 创建统一处理器并添加解析和转换插件
  const file = await unified()
    .use(remarkParse) // 使用 remark-parse 解析 Markdown 语法
    .use(remarkBreaks) // 将换行符转换为 <br> 标签
    .use(remarkFrontmatter) // 解析前置数据块（YAML 格式）
    .use(remarkGfm) // 支持 GitHub Flavored Markdown (GFM) 语法
    .use(remarkMath) // 解析数学公式
    .use(remarkEmoji) // 解析表情符号
    .use(remarkDirective) // 解析自定义指令
    .use(remarkDirectiveRehype) // 将自定义指令转换为 Rehype 节点
    .use(remarkRehype, { allowDangerousHtml: true }) // 将 Markdown 转换为 Rehype (HTML AST)
  	// 允许危险的 HTML 才能实现解析文本中的 HTML 标签，在我们能控制原始 MD 内容的情况下是安全的
    .use(rehypeRaw) // 解析原始 HTML
    .use(rehypeSlug) // 为标题生成唯一的 slug
    .use(rehypeAutolinkHeadings) // 为标题添加自动链接
    .use(rehypeKatex) // 使用 KaTeX 渲染数学公式
    .use(rehypeStringify) // 将 Rehype AST 转换为 HTML 字符串
    .process(markdown); // 处理 Markdown 内容并返回结果
  
  return String(file); // 将处理后的文件内容转换为字符串并返回
}
```


现在我们可以测试一下管线是否正常工作：

```markdown
:::gpt{model="人类"}
这是自定义组件测试。
:::

::css-is-awesome
```

输出的 HTML 如下：

```html
<gpt model="人类"><p>这是自定义组件测试。</p></gpt>
<css-is-awesome></css-is-awesome>
```

很好。这些自定义 HTML 标签和属性，就是我们接下来识别并转换 React 组件的依据，我们将这个 HTML 持久化到文件。为什么不一步到位？至少据我所知，React Component 无法序列化，我们无法将其保存到文本中。

在我们展示 Markdown 渲染结果的组件里（我这里是 `BlogHtmlRenderer`），将拿到的 HTML 解析回 AST，然后使用 `rehype-react` 匹配自定义的 HTML 标签，将其转换为组件：

```tsx
import React from "react";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import * as prod from "react/jsx-runtime";
import { GptBlock } from "@/src/components/markdown/GptBlock";
import CssIsAwesome from "@/src/components/markdown/CssIsAwesome";
import "./markdown.css"; // 可以在这里自定义标签的 CSS，也可以直接使用 className 属性

const BlogHtmlRenderer: React.FC<HtmlProcessorProps> = ({ html }) => {
  // 定义 production 对象，用于指定 Fragment 和 JSX 方法
  const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

  // 创建 unified 处理器，并配置使用 rehype 插件
  const processor = unified()
    .use(rehypeParse, { fragment: true }) // 使用 rehypeParse 解析 HTML 片段
    // @ts-ignore 忽略 TypeScript 错误
    .use(rehypeReact, {
      passNode: true, // 传递节点信息，非常重要！
      components: {
        // 自定义 gpt 标签的渲染方式
        gpt: ({ node, children }: { node: any; children: React.ReactNode }) => {
          const { properties } = node; // 获取节点属性
          return <GptBlock properties={properties}>{children}</GptBlock>; // 返回 GptBlock 组件
        },
        // 自定义 css-is-awesome 标签的渲染方式
        "css-is-awesome": () => {
          return <CssIsAwesome />; // 返回 CssIsAwesome 组件
        },
      },
      ...production, // 将 production 对象展开，添加到配置中
    });

  // 同步处理 HTML 内容，生成 React 组件
  const ContentComponents = processor.processSync(html).result;

  // 返回处理后的内容
  return <>{ContentComponents}</>;
};
```

为了参考，这是 `GptBlock` 组件的内容：

```tsx
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { gsap, useGSAP } from "@/src/lib/gsap";
import { cn } from "@/src/lib/cn";

interface GptBlockProps {
  properties: { model?: string };
  children: React.ReactNode;
}

export const GptBlock: React.FC<GptBlockProps> = ({ properties, children }) => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(true);

  useGSAP(() => {
    if (!open) gsap.set(divRef.current, { opacity: 0, height: 0, display: "none" });
  }, []);

  useGSAP(() => {
    if (open) {
      gsap.to(divRef.current, { display: "block" });
      gsap.to(divRef.current, { opacity: 1, height: "auto" });
    } else {
      gsap.to(divRef.current, { opacity: 0, height: 0 });
      gsap.to(divRef.current, { display: "none" });
    }
  }, [open]);

  return (
    <div className="gpt -mx-content">
      <div
        className={cn(
          "flex flex-row items-center justify-between m-0 pt-4 opacity-80 hover:opacity-100 transition-apple cursor-pointer",
          open ? "pb-0 select-auto" : "pb-4 select-none",
        )}
        onClick={() => setOpen(!open)}
      >
        <span>{properties.model ?? "大语言模型"} 如是说：</span>
        <button className="btn btn-sm btn-ghost rounded-xl text-base font-normal outline-none border-none">
          <Icon icon="heroicons:chevron-down" className={cn("transition-apple", open && "rotate-180")} />
        </button>
      </div>
      <div ref={divRef}>
        {children}
        <div className="h-4" />
      </div>
    </div>
  );
};
```



## 效果测试

```markdown
:::gpt{model="人类"}
这是自定义组件测试。
:::

::css-is-awesome
```

:::gpt{model="人类"}
这是自定义组件测试。
:::



::css-is-awesome



如果是不存在的组件，则会输出文本部分的内容。

```markdown
:::some-nonexistent-directive[blahblahblah]{somekey="somevalue"}

**The quick brown fox jumps over the lazy dog**

:::
```



:::some-nonexistent-directive[blahblahblah]{somekey="somevalue"}

**The quick brown fox jumps over the lazy dog**

:::



## 总结

我们实现的这套管线非常强大。自定义指令允许你以便于书写的形式，向博客中添加复杂组件和可交互内容。演示的功能比较简单，但这套管线完全可以实现例如嵌入视频、增加投票功能、显示对话框、订阅邮件、甚至直接跳转网站下单……等等功能，全部在 Markdown 文本编辑器中实现，无需修改代码。此外，由于 `BlogHtmlRenderer` 在渲染时解析 HTML，也可以直接在 Markdown 中书写 HTML 标签，能达到同样的解析效果。
