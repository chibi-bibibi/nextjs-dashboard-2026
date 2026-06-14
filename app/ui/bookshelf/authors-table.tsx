import MasterTableView from '@/app/ui/bookshelf/master-table-view';
import { fetchAuthorsWithCount } from '@/app/lib/data.bookshelf';

export default async function AuthorsTable({ query = '', currentPage = 1 }: { query?: string; currentPage?: number }) {
  const rows = await fetchAuthorsWithCount(query, currentPage);
  return (
    <MasterTableView
      rows={rows}
      basePath="/book-tools/authors"
      nameHeader="著者・訳者名"
      emptyMessage="著者・訳者が登録されていません"
      query={query}
    />
  );
}
