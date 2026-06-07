import { fetchFilteredBooks } from "@/app/lib/data.bookshelf";
import { UpdateBook, DeleteBook } from "@/app/ui/bookshelf/buttons";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function BookshelfTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const books = await fetchFilteredBooks(query, currentPage);

  return (
    <div className="mt-4 overflow-auto max-h-100">
      <table className="w-full min-w-180 table-fixed text-sm">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[24%]" />
          <col className="w-[16%]" />
          <col className="w-[12%]" />
          <col className="w-[8%]" />
          <col className="w-[12%]" />
          <col className="w-[4%]" />
        </colgroup>
        <thead>
          <tr className="text-left text-xs font-medium text-muted-foreground">
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              タイトル
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              著者
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              出版社
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              分類
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              タグ
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              発行日
            </th>
            <th className="sticky top-0 z-10 bg-card [box-shadow:0_2px_0_0_var(--border)] pb-3 px-3 font-medium">
              <span className="sr-only">操作</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {books.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="py-12 text-center text-sm text-muted-foreground"
              >
                該当する書籍が見つかりません
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book.id} className="hover:bg-muted/50">
                <td className="py-3 px-3 font-medium text-foreground">
                  <span className="block truncate">{book.title}</span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  <span className="block truncate">
                    {book.writer_names ?? "—"}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  <span className="block truncate">
                    {book.publisher_name ?? "—"}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  <span className="block truncate">
                    {book.main_category_no != null && book.main_category_name
                      ? `${book.main_category_no} : ${book.main_category_name}${book.sub_category_no != null && book.sub_category_name ? ` - ${book.sub_category_no} : ${book.sub_category_name}` : ""}`
                      : "—"}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  <span className="block truncate">
                    {book.tag_names ?? "—"}
                  </span>
                </td>
                <td className="whitespace-nowrap py-3 px-3 text-muted-foreground">
                  {formatDate(book.published_at)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <UpdateBook id={book.id} />
                    <DeleteBook id={book.id} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
