"use client";

import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import SideNav from "@/app/ui/dashboard/sidenav";
import Link from "next/link";
import AcmeLogo from "@/app/ui/acme-logo";

type SessionUser = {
  name?: string | null;
  email?: string | null;
};

export default function NavDrawer({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* モバイルヘッダー */}
      <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 md:hidden">
        <Link href="/">
          <AcmeLogo />
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          aria-label="メニューを開く"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* デスクトップサイドバー */}
      <div className="hidden md:flex md:w-64 md:flex-none md:flex-col">
        <SideNav user={user} />
      </div>

      {/* モバイルドロワー */}
      {open && (
        <>
          {/* バックドロップ */}
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />

          {/* ドロワー本体（右側からスライドイン） */}
          <div className="fixed inset-y-0 right-0 z-40 flex w-72 flex-col overflow-y-auto md:hidden">
            <SideNav user={user} onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
