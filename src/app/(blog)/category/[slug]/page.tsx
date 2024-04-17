import { notFound } from "next/navigation";
import { categories } from "@/.velite";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/src/store/velite";

interface CategoryProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: CategoryProps): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (category == null) return {};
  return { title: category.name, description: category.description };
}

export function generateStaticParams(): CategoryProps["params"][] {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default function CategoryPage({ params }: CategoryProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) notFound();

  return (
    <div className="prose xl:prose-lg dark:prose-invert py-6">
      <h1 className="mb-2">分类名称：{category.name}</h1>
      {category.description && (
        <p className="mt-0 text-xl text-slate-700 dark:text-slate-200">描述：{category.description}</p>
      )}
      <hr className="my-4" />
      内容：
      <div>此处可以添加特定分类的额外信息或者文章列表</div>
    </div>
  );
}
