"use client";

import React from "react";
import { Icon } from "@iconify-icon/react";
import { useRouter } from "next/navigation";

export const BackButton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  return (
    <button
      className="btn btn-sm btn-ghost pl-0 pr-2 m-0 rounded-xl text-body outline-transparent border-none"
      onClick={() => router.back()}
    >
      {children ? (
        children
      ) : (
        <>
          <Icon className="text-lg " icon="heroicons:chevron-left" inline />
          返回
        </>
      )}
    </button>
  );
};
