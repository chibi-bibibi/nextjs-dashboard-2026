import Link from "next/link";
import { fetchFilteredBooks } from "@/app/lib/data.bookshelf";
import { parseWriters, CATEGORY_CONFIG } from "@/app/ui/bookshelf/writer-chips";


type BookFilters = { publisherId?: string; writerId?: string; tagId?: string; categoryId?: string; subCategoryId?: string };

export default async function BookshelfTable({
  query,
  currentPage,
  filters = {},
}: {
  query: string;
  currentPage: number;
  filters?: BookFilters;
}) {
  const books = await fetchFilteredBooks(query, currentPage, filters);

  return (
    <div className="mt-4 overflow-auto h-90">
      <table className="w-full min-w-180 table-fixed text-sm">
        <colgroup>
          <col className="w-[32%]" />
          <col className="w-[32%]" />
          <col className="w-[22%]" />
          <col className="w-[14%]" />
        </colgroup>
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">タイトル</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">著者</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">出版社</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">タグ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {books.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                該当する書籍が見つかりません
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className="relative hover:bg-muted/50 cursor-pointer">
                <td className="py-2.5 px-3 font-medium text-foreground">
                  <Link
                    href={`/book-tools/bookshelf/${book.id}`}
                    className="block after:absolute after:inset-0"
                  >
                    <span className="block truncate">{book.title}</span>
                  </Link>
                </td>
                <td className="py-2.5 px-3">
                  {book.writer_names ? (
                    <div className="flex flex-wrap gap-1">
                      {parseWriters(book.writer_names).map(({ category, name }) => {
                        const cfg = CATEGORY_CONFIG[category];
                        return (
                          <span
                            key={`${category}::${name}`}
                            className={`shrink-0 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${cfg ? cfg.className : "bg-muted text-muted-foreground"}`}
                          >
                            {cfg && <span className="opacity-75">{cfg.label}</span>}
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">
                  <span className="block truncate">{book.publisher_name ?? "—"}</span>
                </td>
                <td className="py-2.5 px-3">
                  {book.tag_names ? (
                    <div className="flex gap-1 flex-wrap overflow-hidden">
                      {book.tag_names.split("、").map((tag) => (
                        <span
                          key={tag}
                          className="shrink-0 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground whitespace-nowrap"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
