"use client";

import PageHeader from "@/app/ui/page-header";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/app/lib/use-theme";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main>
      <PageHeader parent="設定" title="環境設定" />
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">テーマ</p>
            <p className="text-xs text-muted-foreground">
              {theme === "light" ? "ライトモード" : "ダークモード"}
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {theme === "light" ? (
              <>
                <MoonIcon className="h-4 w-4" />
                ダークに切替
              </>
            ) : (
              <>
                <SunIcon className="h-4 w-4" />
                ライトに切替
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
