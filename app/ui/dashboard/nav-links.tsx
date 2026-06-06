"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
  {
    name: "Books",
    href: "/dashboard/books",
    icon: BookOpenIcon,
    stateKey: "booksOpen",
    subLinks: [
      { name: "Dashboard", href: "/dashboard/books" },
      { name: "Category", href: "/dashboard/books/category" },
      { name: "Author", href: "/dashboard/books/author" },
      { name: "Publisher", href: "/dashboard/books/publisher" },
      { name: "Books", href: "/dashboard/books/master" },
    ],
  },
];

const navClass =
  "flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground md:flex-none md:justify-start md:p-2 md:px-3";
const activeClass =
  "bg-sidebar-accent text-sidebar-accent-foreground border-r-4 border-primary";

export default function NavLinks() {
  const pathname = usePathname();

  const [openStates, setOpenStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      links
        .filter((link) => link.stateKey)
        .map((link) => [link.stateKey!, pathname.startsWith(link.href)]),
    ),
  );

  const toggleOpen = (key: string) => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isOpen = link.stateKey ? !!openStates[link.stateKey] : false;

        if (!link.subLinks) {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(navClass, {
                [activeClass]: pathname === link.href,
              })}
            >
              <LinkIcon className="w-6" />
              <p className="hidden m-3 md:block">{link.name}</p>
            </Link>
          );
        }

        return (
          <div key={link.name} className="grow md:grow-0">
            <button
              onClick={() => link.stateKey && toggleOpen(link.stateKey)}
              className={clsx("w-full", navClass, {
                [activeClass]: pathname.startsWith(link.href),
              })}
            >
              <LinkIcon className="w-6 shrink-0" />
              <p className="hidden m-3 md:block flex-1 text-left">
                {link.name}
              </p>
              <ChevronRightIcon
                className={clsx(
                  "hidden md:block w-4 shrink-0 transition-transform duration-200",
                  { "rotate-90": isOpen },
                )}
              />
            </button>

            {/* desktop: click accordion */}
            {isOpen && (
              <div className="hidden md:flex flex-col">
                {link.subLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className="flex w-full items-center py-0.5 pl-2 pr-0"
                  >
                    <span
                      className={clsx("w-full", navClass, {
                        [activeClass]: pathname === sub.href,
                      })}
                    >
                      {sub.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
