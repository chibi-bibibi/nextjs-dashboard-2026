"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { name: "ダッシュボード", href: "/dashboard/books" },
  { name: "マスタ管理", href: "/dashboard/books/master" },
];

export default function BooksTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={clsx(
              "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
