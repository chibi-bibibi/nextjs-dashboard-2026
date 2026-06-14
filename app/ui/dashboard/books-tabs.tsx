"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { name: "サマリ", href: "/book-tools" },
  { name: "本棚", href: "/book-tools/bookshelf" },
  { name: "読書録", href: "/book-tools/readinglog" },
  { name: "出版社", href: "/book-tools/publishers" },
  { name: "著者・訳者", href: "/book-tools/writers" },
  { name: "タグ", href: "/book-tools/tags" },
];

export default function BooksTabs() {
  const pathname = usePathname();

  return (
    <div className="md:hidden mb-4">
      <p className="px-1 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        BOOKS
      </p>
      <div className="flex overflow-x-auto border-b border-border [&::-webkit-scrollbar]:hidden scrollbar-none">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={clsx(
            "shrink-0 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
            pathname === tab.href
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300",
          )}
        >
          {tab.name}
        </Link>
      ))}
      </div>
    </div>
  );
}
