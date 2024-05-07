import { categories, Column, columns } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import CategoryCard from "@/src/components/CategoryCard";

interface CategoryListProps {
  params: {
    slug: string;
  };
}

export default function CategoryListPage({ params }: CategoryListProps) {
  return (
    <>
      <main className="flex flex-col gap-4">
        <nav className="flex flex-row gap-4 items-baseline">
          <Link href={`/posts`} className={`text-h2 text-href`}>
            文章
          </Link>
          <Link href={`/categories`} className={`text-h0 text-href`}>
            分类
          </Link>
          <Link href={`/columns`} className={`text-h2 text-href`}>
            专栏
          </Link>
        </nav>
        <div className={`prose-article`}>
          <p className="text-end opacity-80">{categories.length}个分类</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={categories} CardComponent={CategoryCard} />
      </main>
    </>
  );
}
