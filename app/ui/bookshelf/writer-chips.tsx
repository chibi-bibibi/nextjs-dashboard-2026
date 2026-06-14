export const ROLES = ['作者', '著者', '編者', '訳者'] as const;

export const CATEGORY_TO_ROLE: Record<string, string> = {
  Writer: '作者',
  Author: '著者',
  Editor: '編者',
  Translator: '訳者',
};

export const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  Writer:     { label: "作者", bg: "#D4DCE8", text: "#445870" },
  Author:     { label: "著者", bg: "#C8DCC8", text: "#3D5A3E" },
  Editor:     { label: "編者", bg: "#E8D0D0", text: "#6B3A3A" },
  Translator: { label: "訳者", bg: "#E8E0BC", text: "#6B5828" },
};

export function parseWriters(writerNames: string | null) {
  if (!writerNames) return [];
  return writerNames.split("、").map((entry) => {
    const sep = entry.indexOf("::");
    if (sep < 0) return { category: "", name: entry };
    return { category: entry.slice(0, sep), name: entry.slice(sep + 2) };
  });
}
