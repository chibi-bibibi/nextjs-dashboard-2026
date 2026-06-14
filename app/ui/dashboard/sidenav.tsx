"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  BookOpenIcon,
  TagIcon,
  UserIcon,
  BuildingOfficeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  ChartBarSquareIcon,
  PencilSquareIcon,
  MusicalNoteIcon,
  GlobeAltIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import AcmeLogo from "@/app/ui/acme-logo";
import { handleSignOut } from "@/app/lib/actions";

type NavItem =
  | { separator: true }
  | {
      separator?: false;
      name: string;
      icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
      href: string;
      exact?: boolean;
    };

const menuSections: { title: string; items: NavItem[] }[] = [
  {
    title: "メイン",
    items: [
      { name: "ホーム", icon: HomeIcon, href: "/", exact: true },
      { name: "場所", icon: MapPinIcon, href: "/locations" },
    ],
  },
  {
    title: "BOOKS",
    items: [
      {
        name: "サマリ",
        icon: ChartBarSquareIcon,
        href: "/book-tools",
        exact: true,
      },
      { name: "本棚", icon: BookOpenIcon, href: "/book-tools/bookshelf" },
      {
        name: "読書録",
        icon: PencilSquareIcon,
        href: "/book-tools/readinglog",
      },
      { separator: true },
      {
        name: "出版社",
        icon: BuildingOfficeIcon,
        href: "/book-tools/publishers",
      },
      { name: "著者・訳者", icon: UserIcon, href: "/book-tools/writers" },
      { name: "タグ", icon: TagIcon, href: "/book-tools/tags" },
    ],
  },
  {
    title: "MUSIC",
    items: [
      { name: "サマリ", icon: ChartBarSquareIcon, href: "/music-tools", exact: true },
      { name: "マイミュージック", icon: MusicalNoteIcon, href: "/music-tools/library" },
      { separator: true },
      { name: "アーティスト", icon: UserIcon, href: "/music-tools/artists" },
      { name: "タグ", icon: TagIcon, href: "/music-tools/tags" },
    ],
  },
  {
    title: "TRAVEL",
    items: [
      { name: "サマリ", icon: ChartBarSquareIcon, href: "/travel-tools", exact: true },
      { name: "旅行記録", icon: GlobeAltIcon, href: "/travel-tools/trips" },
      { separator: true },
      { name: "訪問地", icon: MapPinIcon, href: "/travel-tools/places" },
      { name: "タグ", icon: TagIcon, href: "/travel-tools/tags" },
    ],
  },
  {
    title: "設定",
    items: [{ name: "環境設定", icon: Cog6ToothIcon, href: "/settings" }],
  },
];

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

export default function SideNav({
  user,
  onNavigate,
}: {
  user: SessionUser | null;
  onNavigate?: () => void;
}) {
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
      <div className="flex items-center border-b border-border px-4 py-3">
        <Link href="/">
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
                {section.items.map((item, idx) =>
                  item.separator ? (
                    <hr key={idx} className="my-1.5 border-border" />
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onNavigate}
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
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User / Sign Out */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <span className="text-sm font-medium">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "ユーザー"}
            </p>
          </div>
          <form action={handleSignOut}>
            <button
              type="submit"
              title="Sign Out"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
