import { Suspense } from 'react';
import PageHeader from '@/app/ui/page-header';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/books/pagination';
import LocationsTable from '@/app/ui/locations/table';
import { CreateFab } from '@/app/ui/bookshelf/buttons';
import { fetchLocationsPages } from '@/app/lib/data.locations';
import TableSkeleton from '@/app/ui/table-skeleton';

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchLocationsPages(query);

  return (
    <main>
      <PageHeader title="場所" className="hidden md:flex" />

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <Search placeholder="場所名・かな・ローマ字で検索..." />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
          <LocationsTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      <CreateFab href="/locations/create" label="場所を追加" />
    </main>
  );
}
