import Image from "next/image";
import { notFound } from "next/navigation";
import { columns } from "@/.velite";
import type { Metadata } from "next";
import { getColumnBySlug } from "@/src/store/velite";

interface PostProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PostProps): Metadata {
  const column = getColumnBySlug(params.slug);
  if (column == null) return {};
  return { title: column.name, description: column.description };
}

export function generateStaticParams(): PostProps["params"][] {
  return columns.map((column) => ({
    slug: column.slug,
  }));
}

export default function ColumnPage({ params }: PostProps) {
  const column = getColumnBySlug(params.slug);

  if (!column) notFound();

  return (
    <article className="prose lg:prose-lg dark:prose-invert py-6">
      <h1 className="mb-2">标题：{column.name}</h1>
      <hr className="my-4" />
      内容：
      <div className="prose" dangerouslySetInnerHTML={{ __html: column.description }}></div>
    </article>
  );
}
