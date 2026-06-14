import PageHeader from '@/app/ui/page-header';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/books/pagination';
import PublishersTable from '@/app/ui/bookshelf/publishers-table';
import { CreateFab } from '@/app/ui/bookshelf/buttons';
import { fetchPublishersPages } from '@/app/lib/data.bookshelf';
import TableSkeleton from '@/app/ui/table-skeleton';
import { Suspense } from 'react';

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchPublishersPages(query);

  return (
    <main>
      <PageHeader parent="BOOKS" title="出版社" className="hidden md:flex" />

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <Search placeholder="出版社名で検索..." />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
          <PublishersTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      <CreateFab href="/book-tools/publishers/create" label="出版社を追加" />
    </main>
  );
}
