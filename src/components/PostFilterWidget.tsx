"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Selection } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { categories, columns, tags } from "@/.velite";
import { debounce } from "lodash";

const PostFilterWidget: React.FC<{
  useQuerySubPath?: boolean;
  useColumn?: string;
  useCategory?: string;
  useTag?: string;
}> = ({ useQuerySubPath = false, useColumn, useCategory, useTag }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse initial values from URL search params
  const initColumns = new Set(useColumn ? [useColumn] : searchParams.getAll("column"));
  const initCategories = new Set(useCategory ? [useCategory] : searchParams.getAll("category"));
  const initTags = new Set(useTag ? [useTag] : searchParams.getAll("tag"));

  // State hooks for selections
  const [selectedColumns, setSelectedColumns] = useState<Selection>(initColumns);
  const [selectedCategories, setSelectedCategories] = useState<Selection>(initCategories);
  const [selectedTags, setSelectedTags] = useState<Selection>(initTags);

  const onFilter = () => {
    const params = new URLSearchParams();

    if (!useColumn && selectedColumns !== "all" && selectedColumns.size > 0) {
      params.set("column", Array.from(selectedColumns).join(","));
    }
    if (!useCategory && selectedCategories !== "all" && selectedCategories.size > 0) {
      params.set("category", Array.from(selectedCategories).join(","));
    }
    if (!useTag && selectedTags !== "all" && selectedTags.size > 0) {
      params.set("tag", Array.from(selectedTags).join(","));
    }

    const search = params.toString();
    const query = search ? `?${search}` : "";
    let newPathname = pathname;
    if (useQuerySubPath) {
      if (query === "") {
        newPathname = pathname.endsWith("/query") ? pathname.replace(/\/query$/, "") : pathname;
      } else {
        newPathname = pathname.endsWith("/query") ? pathname : `${pathname}/query`;
      }
    }
    router.push(`${newPathname}${query}`);
  };

  const debouncedFilter = debounce(onFilter, 500); // Adjust the debounce delay as needed

  useEffect(() => {
    // debouncedFilter();
    // onFilter();
  }, [selectedColumns, selectedCategories, selectedTags, debouncedFilter]);

  return (
    <aside className={`flex flex-col gap-4 px-0`}>
      {/*<pre>{JSON.stringify(params, null, 2)}</pre>*/}
      <p className={`text-h2`}>过滤器</p>
      <Select
        isDisabled={!!useColumn}
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
        isDisabled={!!useCategory}
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
        isDisabled={!!useTag}
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
    </aside>
  );
};

export default PostFilterWidget;
