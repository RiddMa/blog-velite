import React from "react";
import VisitCountDisplay from "@/src/components/VisitCountDisplay";

const Footer: React.FC = () => {
  return (
    <footer className="prose-article flex flex-col gap-4 items-center justify-center pb-8 px-content transition-opacity ease-apple duration-300 opacity-80 hover:opacity-100">
      <span className="ml-4">
        <VisitCountDisplay /> 次浏览。
      </span>
      <div className="flex flex-row flex-wrap items-center">
        <span className="icon-[ph--copyright] mr-1 text-body"></span>
        {/*<span className="mr-1">©</span>*/}
        <a href="https://github.com/RiddMa/blog-velite">Ridd 的博客</a>，始于 2024。
        <span className="inline-block">
          {`由 `}
          <a href="https://nextjs.org" target="_blank">
            Next.js
          </a>
          {` 强力驱动。`}
        </span>
      </div>
      <div className="flex flex-row flex-wrap">
        <span className="whitespace-nowrap mr-1">本站“博客”中图文内容均依据</span>
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" className="mr-1">
          CC-BY-NC-SA 4.0
        </a>
        授权许可，
        <span className="whitespace-nowrap">转载请注明出处并遵守相关许可条款。</span>
      </div>
      <div className="flex flex-row flex-wrap">
        <span className="whitespace-nowrap">本站“相册”中图文内容均受商业许可保护，</span>
        <span className="whitespace-nowrap">未经许可禁止转载。</span>
        <span className="whitespace-nowrap">如需使用，请联系本站获取授权。</span>
      </div>
    </footer>
  );
};

export default Footer;
