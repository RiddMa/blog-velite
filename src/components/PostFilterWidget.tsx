"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Selection } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { categories, columns, tags } from "@/.velite";
import { Button } from "@nextui-org/button";
import { debounce } from "lodash";
import { usePageStateStore } from "@/src/store/store";
import { useShallow } from "zustand/react/shallow";

const PostFilterWidget: React.FC<{ useColumn?: string; useCategory?: string; useTag?: string }> = ({
  useColumn,
  useCategory,
  useTag,
}) => {
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

    if (selectedColumns !== "all" && selectedColumns.size > 0) {
      params.set("column", Array.from(selectedColumns).join(","));
    }
    if (selectedCategories !== "all" && selectedCategories.size > 0) {
      params.set("category", Array.from(selectedCategories).join(","));
    }
    if (selectedTags !== "all" && selectedTags.size > 0) {
      params.set("tag", Array.from(selectedTags).join(","));
    }

    const search = params.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  const debouncedFilter = debounce(onFilter, 300); // Adjust the debounce delay as needed

  useEffect(() => {
    debouncedFilter();
  }, [selectedColumns, selectedCategories, selectedTags, debouncedFilter]);

  const [disableScroll, setDisableScroll] = usePageStateStore(
    useShallow((state) => [state.disableScroll, state.setDisableScroll]),
  );

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // document.body.classList.add("disable-scroll");
    } else {
      // document.body.classList.remove("disable-scroll");
    }
  };

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
        showScrollIndicators={true}
        selectedKeys={selectedTags}
        onSelectionChange={setSelectedTags}
        onOpenChange={handleOpenChange}
      >
        {tags.map((tag) => (
          <SelectItem key={tag.slug} value={tag.slug}>
            {tag.name}
          </SelectItem>
        ))}
      </Select>
      {/*<Button onPress={onFilter} variant={"flat"}>*/}
      {/*  应用*/}
      {/*</Button>*/}
    </aside>
  );
};

export default PostFilterWidget;
