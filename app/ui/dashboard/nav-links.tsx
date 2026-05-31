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
];

const booksSubLinks = [
  { name: "Dashboard", href: "/dashboard/books" },
  { name: "Category", href: "/dashboard/books/category" },
  { name: "Author", href: "/dashboard/books/author" },
  { name: "Publisher", href: "/dashboard/books/publisher" },
  { name: "Books", href: "/dashboard/books/master" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const isBooksRoute = pathname.startsWith("/dashboard/books");
  const [booksOpen, setBooksOpen] = useState(isBooksRoute);

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm font-medium hover:bg-primary hover:text-foreground md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-primary text-foreground border-r-4 border-accent-primary-dark":
                  pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden m-3 md:block">{link.name}</p>
          </Link>
        );
      })}

      {/* Books グループ */}
      <div>
        <button
          onClick={() => setBooksOpen((prev) => !prev)}
          className={clsx(
            "w-full flex h-[48px] grow items-center justify-center rounded-md p-3 text-sm font-medium hover:bg-primary hover:text-foreground md:flex-none md:justify-start md:p-2 md:px-3",
            {
              "bg-primary text-foreground border-r-4 border-accent-primary-dark":
                (booksOpen && isBooksRoute) || isBooksRoute,
            },
          )}
        >
          <BookOpenIcon className="w-6 shrink-0" />
          <p className="hidden m-3 md:block flex-1 text-left">Books</p>
          <ChevronRightIcon
            className={clsx(
              "hidden md:block w-4 shrink-0 transition-transform duration-200",
              {
                "rotate-90": booksOpen,
              },
            )}
          />
        </button>

        {booksOpen && (
          <div className="hidden md:flex flex-col">
            {booksSubLinks.map((sub) => {
              const isSubActive = pathname === sub.href;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className="group relative flex w-full items-center py-0.5 pl-2 pr-0"
                >
                  <span
                    className={clsx(
                      "w-full flex grow items-center justify-center rounded-md p-3 text-sm font-medium hover:bg-primary hover:text-foreground md:flex-none md:justify-start md:p-2 md:px-3",
                      {
                        "bg-primary text-foreground border-r-4 border-accent-primary-dark":
                          isSubActive,
                      },
                    )}
                  >
                    {sub.name}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
