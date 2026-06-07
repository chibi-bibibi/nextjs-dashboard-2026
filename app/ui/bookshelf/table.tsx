import { fetchFilteredBooks } from '@/app/lib/data.bookshelf';
import { UpdateBook, DeleteBook } from '@/app/ui/bookshelf/buttons';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
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
    <div className="mt-4 flow-root">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">タイトル</th>
              <th className="pb-3 pr-4 font-medium">出版社</th>
              <th className="pb-3 pr-4 font-medium">発行日</th>
              <th className="pb-3 pr-4 font-medium">版</th>
              <th className="pb-3 pr-4 font-medium">グループコード</th>
              <th className="pb-3 font-medium">
                <span className="sr-only">操作</span>
              </th>
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
                <tr key={book.id} className="hover:bg-muted/50">
                  <td className="py-3 pr-4 font-medium text-foreground">
                    <span className="line-clamp-2 max-w-xs">{book.title}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {book.publisher_name ?? '—'}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-muted-foreground">
                    {formatDate(book.published_at)}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {book.version ?? '—'}
                  </td>
                  <td className="py-3 pr-4 font-mono text-muted-foreground">
                    {book.group_code ?? '—'}
                  </td>
                  <td className="whitespace-nowrap py-3">
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
    </div>
  );
}
