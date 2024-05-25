import React from "react";
import VisitCountDisplay from "@/src/components/VisitCountDisplay";

const Footer: React.FC = () => {
  return (
    <>
      <div className="prose-article flex flex-col gap-4 items-center justify-center pb-8">
        <span>
          <VisitCountDisplay /> 次浏览
        </span>
        <span>
          © <a href="https://github.com/RiddMa/blog-velite">Ridd 的博客</a>，始于 2024
        </span>
        <span className={`whitespace-nowrap`}>
          {`使用 `}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank">
            CC-BY-NC-SA 4.0
          </a>
          {` 授权`}
        </span>
        <span className={`whitespace-nowrap`}>
          {`由 `}
          <a href="https://nextjs.org" target="_blank">
            Next.js
          </a>
          {` 强力驱动`}
        </span>
      </div>
    </>
  );
};

export default Footer;
