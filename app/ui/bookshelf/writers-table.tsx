import MasterTableView from '@/app/ui/bookshelf/master-table-view';
import { fetchWritersWithCount } from '@/app/lib/data.bookshelf';

export default async function WritersTable({ query = '', currentPage = 1 }: { query?: string; currentPage?: number }) {
  const rows = await fetchWritersWithCount(query, currentPage);
  return (
    <MasterTableView
      rows={rows}
      basePath="/book-tools/writers"
      nameHeader="著者・訳者名"
      emptyMessage="著者・訳者が登録されていません"
      query={query}
    />
  );
}
