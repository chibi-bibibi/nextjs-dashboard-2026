import PageHeader from "@/app/ui/page-header";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/books/pagination";
import PublishersTable from "@/app/ui/bookshelf/publishers-table";
import { CreateFab } from "@/app/ui/bookshelf/buttons";
import { fetchPublishersPages } from "@/app/lib/data.bookshelf";
import { Suspense } from "react";

function TableSkeleton() {
  return (
    <div className="mt-4 h-90 overflow-auto animate-pulse space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 rounded bg-muted" />
      ))}
    </div>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? "";
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
