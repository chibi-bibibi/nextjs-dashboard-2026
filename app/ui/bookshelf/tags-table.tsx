import MasterTableView from '@/app/ui/bookshelf/master-table-view';
import { fetchTagsWithCount } from '@/app/lib/data.bookshelf';

export default async function TagsTable({ query = '', currentPage = 1 }: { query?: string; currentPage?: number }) {
  const rows = await fetchTagsWithCount(query, currentPage);
  return (
    <MasterTableView
      rows={rows}
      basePath="/book-tools/tags"
      nameHeader="タグ名"
      emptyMessage="タグが登録されていません"
      query={query}
    />
  );
}
