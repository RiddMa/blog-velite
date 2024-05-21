import React from "react";
import BlogLayout from "@/src/components/layout/BlogLayout";
import { globals } from "@/.velite";
import ContentCard from "@/src/components/ContentCard";
import { Icon } from "@iconify-icon/react";
import Link from "next/link";

export default function Home() {
  const { heroTitle } = globals;
  return (
    <>
      <BlogLayout>
        <div className={"flex flex-col gap-4"}>
          <h1 className="hero-title">Connect</h1>
          <ContentCard
            title={<>博客</>}
            excerpt={
              <Link href="/posts" className="flex items-center not-prose">
                <button className="btn btn-sm btn-ghost -ml-2 px-2 rounded-xl text-body outline-transparent border-none">
                  浏览文章
                  <Icon className="" icon="heroicons:chevron-right" inline />
                </button>
              </Link>
            }
          />
          <ContentCard
            title={
              <>
                相册
                <Icon icon="heroicons:photo-solid" inline />
              </>
            }
            excerpt={
              <Link href="/gallery" className="flex items-center not-prose">
                <button className="btn btn-sm btn-ghost -ml-2 px-2 rounded-xl text-body outline-transparent border-none">
                  浏览图片
                  <Icon className="" icon="heroicons:chevron-right" inline />
                </button>
              </Link>
            }
          />
          <h1 className="hero-title text-end">the dots.</h1>
        </div>
      </BlogLayout>
    </>
  );
}
