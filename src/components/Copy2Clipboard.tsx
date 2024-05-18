"use client";

import CopyToClipboard from "react-copy-to-clipboard";
import React from "react";

interface Copy2ClipboardProps {
  children: string;
  className?: string;
}

const Copy2Clipboard: React.FC<Copy2ClipboardProps> = ({ children, className }) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className={`${className}`}>
      <CopyToClipboard
        text={children}
        onCopy={() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        <button className={`btn btn-sm rounded-xl font-normal`}>{copied ? <span>OK!</span> : <span>Copy</span>}</button>
      </CopyToClipboard>
    </div>
  );
};

export default Copy2Clipboard;
