import { Column, columns } from "@/.velite";
import WaterfallGrid from "@/src/components/WaterfallGrid";
import Link from "next/link";
import ColumnCard from "@/src/components/ColumnCard";

interface ColumnListProps {
  params: {
    slug: string;
  };
}

export default function ColumnListPage({ params }: ColumnListProps) {
  return (
    <>
      <main className="flex flex-col gap-4 px-content">
        <nav className="flex flex-row gap-4 items-baseline">
          <Link href={`/posts`} className={`text-h2 text-href`}>
            文章
          </Link>
          <Link href={`/categories`} className={`text-h2 text-href`}>
            分类
          </Link>
          <Link href={`/columns`} className={`text-h0 text-href`}>
            专栏
          </Link>
        </nav>
        <div className={`prose-article`}>
          <p className="text-end opacity-80">{columns.length}个专栏</p>
        </div>
        {/*// @ts-ignore // TS cannot infer the type of CardComponent*/}
        <WaterfallGrid items={columns} CardComponent={ColumnCard} />
      </main>
    </>
  );
}
