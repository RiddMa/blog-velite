import React from "react";
import Link from "next/link";
import { clsname } from "@/src/util/clsname";

// 定义 TOC 项的接口
interface TOCItemProps {
  title: string;
  url: string;
  items: TOCItemProps[]; // 递归定义
}

// 递归组件接口
interface TOCRecursiveProps {
  items: TOCItemProps[];
  urlPrefix?: string;
  plain?: boolean;
}

const TOCItem: React.FC<TOCRecursiveProps> = ({ items, urlPrefix = "", plain = false }) => {
  return (
    <ul className="ml-2">
      {items.map((item, index) => (
        <li key={index}>
          {plain && <span>{item.title}</span>}
          {!plain && <Link href={`${urlPrefix}${item.url}`}>{item.title}</Link>}
          {item.items && item.items.length > 0 && <TOCItem items={item.items} urlPrefix={urlPrefix} plain={plain} />}
        </li>
      ))}
    </ul>
  );
};

// 主组件接口
interface TableOfContentsProps {
  toc: TOCItemProps[];
  useNextLink?: boolean;
  plain?: boolean;
  urlPrefix?: string;
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ toc, urlPrefix = "", plain = false, className = "" }) => {
  return (
    <nav className={clsname(className)}>
      {toc && toc.length > 0 && <TOCItem items={toc} urlPrefix={urlPrefix} plain={plain} />}
    </nav>
  );
};

export default TableOfContents;
