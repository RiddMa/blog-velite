"use client";

import CopyToClipboard from "react-copy-to-clipboard";
import React from "react";

interface Copy2ClipboardProps {
  children: string;
}

const Copy2Clipboard: React.FC<Copy2ClipboardProps> = ({ children }) => {
  const [copied, setCopied] = React.useState(false);
  return (
    <CopyToClipboard
      text={children}
      onCopy={() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <button className={`absolute right-4 top-7 opacity-0 group-hover:opacity-100`}>
        {copied ? <span>OK!</span> : <span>Copy</span>}
      </button>
    </CopyToClipboard>
  );
};

export default Copy2Clipboard;
