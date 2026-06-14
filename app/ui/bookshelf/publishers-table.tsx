import MasterTableView from '@/app/ui/bookshelf/master-table-view';
import { fetchPublishersWithCount } from '@/app/lib/data.bookshelf';

export default async function PublishersTable({ query = '', currentPage = 1 }: { query?: string; currentPage?: number }) {
  const rows = await fetchPublishersWithCount(query, currentPage);
  return (
    <MasterTableView
      rows={rows}
      basePath="/book-tools/publishers"
      nameHeader="出版社名"
      emptyMessage="出版社が登録されていません"
      query={query}
    />
  );
}
