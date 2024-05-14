---
title: 在 Markdown 中使用自定义指令，并渲染为 React 组件
slug: use-custom-directives-in-markdown-render-as-react-components
author: ridd
categories: [coding]
columns: [blog]
tags: [Markdown, React, Next.js, Unified, remark, rehype, Custom Directives]
created: 2024-05-15T01:27:13+08:00
updated: 2024-05-15T01:27:13+08:00
---

# 什么是自定义指令

Markdown 自定义指令的格式可以参考[讨论帖](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444)。通过自定义指令，可以扩展 Markdown 基础语法，增加一些个性化的功能（当然，需要渲染器/编辑器支持）。我在博客中希望能有一些基于 Markdown 编写的外链嵌入、图表视频、特殊样式文本等，丰富文章内容。使用自定义指令主要是希望替代部分 MDX 的功能，因为 MDX 的语法与 Markdown 不完全兼容，会造成旧数据迁移困难、复制粘贴文章内容编译报错等很多困扰。

:::gpt{model="GPT-4o"}

根据该网页，Directive有以下几种格式：

1. **Inline Directives**：以一个冒号开头，格式为`:name[content]{key=val}`，用于内联元素。
2. **Leaf Block Directives**：以两个冒号开头，格式为`::name [content] {key=val}`，用于独立的块元素。
3. **Container Block Directives**：以三个或更多冒号开头，格式为`:::name [inline-content] {key=val} contents :::`，用于包含其他块元素的容器。

更多详细信息和示例可以在网页上找到：[Generic directives/plugins syntax](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444)

:::

# remark 和 rehype

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

# 代码实现

主要使用 [remarkDirective](https://github.com/remarkjs/remark-directive)、 [remarkDirectiveRehype](https://github.com/IGassmann/remark-directive-rehype) 和 [rehype-react](https://github.com/rehypejs/rehype-react) 这三个插件。

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

直接上代码，这里从 HTML 解析回 AST，然后使用 `rehype-react` 处理 `<gpt>` 标签，将其转换为自定义格式：

```tsx
const BlogHtmlRenderer: React.FC<{ html: string }> = ({ html }) => {
  const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };
  const processor = unified()
    .use(rehypeParse, { fragment: true }) // Parse the HTML as fragment
    // @ts-ignore
    .use(rehypeReact, {
      passNode: true, // pass the node as argument to get properties
      components: {
        gpt: ({ node, children }: any) => {
          const { properties } = node;
          return <div className={`gpt`}>{children}</div>;
        },
      },
      ...production,
    });

  const ContentComponents = processor.processSync(html).result;

  return (
    <>
      {ContentComponents}
    </>
  );
};
```

