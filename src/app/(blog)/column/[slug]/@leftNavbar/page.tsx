"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Selection } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { categories, columns, tags } from "@/.velite";
import { Button } from "@nextui-org/button";

const LeftContent: React.FC<{
  params: {
    slug: string;
  };
  searchParams: {
    category?: string;
    tag?: string;
  };
}> = ({ params: { slug }, searchParams }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Parse initial values from URL search params
  const initColumns = new Set([slug]);
  const initCategories = new Set(searchParams.category?.split(","));
  const initTags = new Set(searchParams.tag?.split(","));

  // State hooks for selections
  const [selectedColumns, setSelectedColumns] = useState<Selection>(initColumns);
  const [selectedCategories, setSelectedCategories] = useState<Selection>(initCategories);
  const [selectedTags, setSelectedTags] = useState<Selection>(initTags);

  const onFilter = () => {
    const params = new URLSearchParams();
    params.set("category", Array.from(selectedCategories).join(","));
    params.set("tag", Array.from(selectedTags).join(","));

    const search = params.toString();
    const query = search ? `?${search}` : ""; // or const query = `${'?'.repeat(search.length && 1)}${search}`;

    router.push(`${pathname}${query}`);
  };

  return (
    <aside className={`flex flex-col gap-4 px-0`}>
      {/*<pre>{JSON.stringify(params, null, 2)}</pre>*/}
      <p className={`text-h2`}>过滤器</p>
      <Select
        isDisabled
        label="专栏"
        selectionMode="multiple"
        placeholder="筛选专栏"
        selectedKeys={selectedColumns}
        onSelectionChange={setSelectedColumns}
      >
        {columns.map((column) => (
          <SelectItem key={column.slug} value={column.slug}>
            {column.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="分类"
        selectionMode="multiple"
        placeholder="筛选分类"
        selectedKeys={selectedCategories}
        onSelectionChange={setSelectedCategories}
      >
        {categories.map((category) => (
          <SelectItem key={category.slug} value={category.slug}>
            {category.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="标签"
        selectionMode="multiple"
        placeholder="筛选标签"
        selectedKeys={selectedTags}
        onSelectionChange={setSelectedTags}
      >
        {tags.map((tag) => (
          <SelectItem key={tag.slug} value={tag.slug}>
            {tag.name}
          </SelectItem>
        ))}
      </Select>
      <Button onPress={onFilter} variant={"flat"}>
        应用
      </Button>
    </aside>
  );
};

export default LeftContent;
