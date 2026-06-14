"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const selectClass =
  "h-10 w-full rounded-md border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

type Option = { id: string; name: string; category_no?: number; main_category_id?: string };

export function BookCategoryFilters({
  categories,
  subCategories,
}: {
  categories: Option[];
  subCategories: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = useCallback(
    (key: string, value: string, clearKeys: string[] = []) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      clearKeys.forEach((k) => params.delete(k));
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const selectedCategoryId = searchParams.get("category_id") ?? "";
  const filteredSubCategories = selectedCategoryId
    ? subCategories.filter((s) => s.main_category_id === selectedCategoryId)
    : subCategories;

  return (
    <>
      <select
        className={selectClass}
        value={selectedCategoryId}
        onChange={(e) => update("category_id", e.target.value, ["sub_category_id"])}
      >
        <option value="">大分類（全て）</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.category_no != null ? `${c.category_no} : ${c.name}` : c.name}
          </option>
        ))}
      </select>

      <select
        className={selectClass}
        value={searchParams.get("sub_category_id") ?? ""}
        onChange={(e) => update("sub_category_id", e.target.value)}
      >
        <option value="">小分類（全て）</option>
        {filteredSubCategories.map((s) => (
          <option key={s.id} value={s.id}>
            {s.category_no != null ? `${s.category_no} : ${s.name}` : s.name}
          </option>
        ))}
      </select>
    </>
  );
}
