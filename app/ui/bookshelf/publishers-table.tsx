import Link from "next/link";
import { fetchPublishersWithCount } from "@/app/lib/data.bookshelf";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function PublishersTable({ query = "", currentPage = 1 }: { query?: string; currentPage?: number }) {
  const publishers = await fetchPublishersWithCount(query, currentPage);

  return (
    <div className="mt-4 overflow-auto h-90">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col className="w-[65%]" />
          <col className="w-[15%]" />
          <col className="w-[20%]" />
        </colgroup>
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">出版社名</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium text-right">書籍数</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">登録日</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {publishers.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                {query ? "検索結果が見つかりません" : "出版社が登録されていません"}
              </td>
            </tr>
          ) : (
            publishers.map((p) => (
              <tr key={p.id} className="relative hover:bg-muted/50 cursor-pointer">
                <td className="py-2.5 px-3 font-medium text-foreground">
                  <Link
                    href={`/book-tools/publishers/${p.id}`}
                    className="block after:absolute after:inset-0"
                  >
                    <span className="block truncate">{p.name}</span>
                  </Link>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground text-right">{p.book_count}</td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{formatDate(p.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
