import Link from 'next/link';
import { formatDateJP } from '@/app/lib/date-utils';

export type MasterTableRow = {
  id: string;
  name: string;
  book_count: number;
  created_at: string | null;
};

export default function MasterTableView({
  rows,
  basePath,
  nameHeader,
  emptyMessage,
  query,
}: {
  rows: MasterTableRow[];
  basePath: string;
  nameHeader: string;
  emptyMessage: string;
  query?: string;
}) {
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
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">{nameHeader}</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium text-right">書籍数</th>
            <th className="sticky top-0 z-10 bg-card border-b border-border py-2 px-3 font-medium">登録日</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-12 text-center text-sm text-muted-foreground">
                {query ? '検索結果が見つかりません' : emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="relative hover:bg-muted/50 cursor-pointer">
                <td className="py-2.5 px-3 font-medium text-foreground">
                  <Link href={`${basePath}/${row.id}`} className="block after:absolute after:inset-0">
                    <span className="block truncate">{row.name}</span>
                  </Link>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground text-right">{row.book_count}</td>
                <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{formatDateJP(row.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
