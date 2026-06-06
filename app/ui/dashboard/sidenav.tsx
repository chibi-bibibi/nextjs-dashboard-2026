"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  BookOpenIcon,
  TagIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PowerIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import AcmeLogo from "@/app/ui/acme-logo";
import { handleSignOut } from "@/app/lib/actions";

const menuSections = [
  {
    title: "メイン",
    items: [
      { name: "ホーム", icon: HomeIcon, href: "/dashboard/home", exact: true },
      {
        name: "請求書",
        icon: DocumentDuplicateIcon,
        href: "/dashboard/invoices",
      },
      { name: "顧客", icon: UserGroupIcon, href: "/dashboard/customers" },
    ],
  },
  {
    title: "Books",
    items: [
      {
        name: "ダッシュボード",
        icon: HomeIcon,
        href: "/dashboard/books",
        exact: true,
      },
      { name: "カテゴリー", icon: TagIcon, href: "/dashboard/books/category" },
      { name: "著者", icon: UserIcon, href: "/dashboard/books/author" },
      {
        name: "出版社",
        icon: BuildingOfficeIcon,
        href: "/dashboard/books/publisher",
      },
      { name: "Books", icon: BookOpenIcon, href: "/dashboard/books/master" },
    ],
  },
  {
    title: "設定",
    items: [
      { name: "環境設定", icon: Cog6ToothIcon, href: "/dashboard/settings" },
    ],
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "メイン",
    "Books",
    "設定",
  ]);

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center border-b border-border px-4 py-5">
        <Link href="/dashboard">
          <AcmeLogo />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <button
              onClick={() => toggleSection(section.title)}
              className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-sidebar-foreground"
            >
              {section.title}
              {expandedSections.includes(section.title) ? (
                <ChevronDownIcon className="h-3.5 w-3.5" />
              ) : (
                <ChevronRightIcon className="h-3.5 w-3.5" />
              )}
            </button>
            {expandedSections.includes(section.title) && (
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      {
                        "bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-primary":
                          isActive(item.href, item.exact),
                      },
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User / Sign Out */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <span className="text-sm font-medium">U</span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-sidebar-foreground">ユーザー</p>
            <p className="truncate text-xs text-muted-foreground">Free プラン</p>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              title="Sign Out"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <PowerIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
