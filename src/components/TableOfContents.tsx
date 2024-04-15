import React from "react";

// 定义 TOC 项的接口
interface TOCItemProps {
  title: string;
  url: string;
  items: TOCItemProps[]; // 递归定义
}

// 递归组件接口
interface TOCRecursiveProps {
  items: TOCItemProps[];
}

const TOCItem: React.FC<TOCRecursiveProps> = ({ items }) => {
  return (
    <ul className="ml-2">
      {items.map((item, index) => (
        <li key={index}>
          <a href={item.url}>{item.title}</a>
          {item.items && item.items.length > 0 && <TOCItem items={item.items} />}
        </li>
      ))}
    </ul>
  );
};

// 主组件接口
interface TableOfContentsProps {
  toc: TOCItemProps[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  return <nav className="-ml-2">{toc && toc.length > 0 && <TOCItem items={toc} />}</nav>;
};

export default TableOfContents;
