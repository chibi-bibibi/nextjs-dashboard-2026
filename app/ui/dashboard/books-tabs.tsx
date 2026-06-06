"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { name: "Dashboard", href: "/dashboard/books" },
  { name: "Category", href: "/dashboard/books/category" },
  { name: "Author", href: "/dashboard/books/author" },
  { name: "Publisher", href: "/dashboard/books/publisher" },
  { name: "Books", href: "/dashboard/books/master" },
];

export default function BooksTabs() {
  const pathname = usePathname();

  return (
    <div className="md:hidden mb-4 flex overflow-x-auto border-b border-gray-200">
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
  );
}
