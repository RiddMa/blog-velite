import React from "react";
import Link from "next/link";
import { cn } from "@/src/util/my-classnames";

// 定义 TOC 项的接口
interface TOCItemProps {
  title: string;
  url: string;
  items: TOCItemProps[]; // 递归定义
}

// 递归组件接口
interface TOCRecursiveProps {
  items: TOCItemProps[];
  useNextLink?: boolean;
  urlPrefix?: string;
  plain?: boolean;
}

const TOCItem: React.FC<TOCRecursiveProps> = ({ items, urlPrefix = "", useNextLink = false, plain = false }) => {
  return (
    <ul className="ml-2">
      {items.map((item, index) => (
        <li key={index}>
          {useNextLink && <Link href={`${urlPrefix}${item.url}`}>{item.title}</Link>}
          {!useNextLink && <a href={`${urlPrefix}${item.url}`}>{item.title}</a>}
          {item.items && item.items.length > 0 && (
            <TOCItem items={item.items} urlPrefix={urlPrefix} useNextLink={useNextLink} plain={plain} />
          )}
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

const TableOfContents: React.FC<TableOfContentsProps> = ({
  toc,
  urlPrefix = "",
  useNextLink = false,
  plain = false,
  className = "",
}) => {
  return (
    <nav className={cn(className)}>
      {toc && toc.length > 0 && <TOCItem items={toc} urlPrefix={urlPrefix} useNextLink={useNextLink} plain={plain} />}
    </nav>
  );
};

export default TableOfContents;
