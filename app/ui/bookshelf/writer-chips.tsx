export const ROLES = ['作者', '著者', '編者', '訳者'] as const;

export const CATEGORY_TO_ROLE: Record<string, string> = {
  Writer: '作者',
  Author: '著者',
  Editor: '編者',
  Translator: '訳者',
};

export const CATEGORY_CONFIG: Record<string, { label: string; className: string }> = {
  Writer:     { label: "作者", className: "bg-slate-200 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200" },
  Author:     { label: "著者", className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" },
  Editor:     { label: "編者", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" },
  Translator: { label: "訳者", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
};

export function parseWriters(writerNames: string | null) {
  if (!writerNames) return [];
  return writerNames.split("、").map((entry) => {
    const sep = entry.indexOf("::");
    if (sep < 0) return { category: "", name: entry };
    return { category: entry.slice(0, sep), name: entry.slice(sep + 2) };
  });
}
