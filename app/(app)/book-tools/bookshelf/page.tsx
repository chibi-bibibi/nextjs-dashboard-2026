import PageHeader from "@/app/ui/page-header";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/books/pagination";
import BookshelfTable from "@/app/ui/bookshelf/table";
import { CreateBook } from "@/app/ui/bookshelf/buttons";
import { fetchBooksPages } from "@/app/lib/data.bookshelf";
import { Suspense } from "react";

function TableSkeleton() {
  return (
    <div className="mt-4 animate-pulse space-y-3">
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
  const totalPages = await fetchBooksPages(query);

  return (
    <main>
      <PageHeader parent="BOOKS" title="本棚"  className="hidden md:flex" />

      {/* 検索エリア */}
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="flex items-center justify-between gap-2">
          <Search placeholder="タイトルで検索..." />
          <CreateBook />
        </div>
      </div>

      {/* テーブルエリア */}
      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense key={query + currentPage} fallback={<TableSkeleton />}>
          <BookshelfTable query={query} currentPage={currentPage} />
        </Suspense>
        {totalPages > 1 && (
          <div className="mt-5 flex w-full justify-center">
            <Pagination totalPages={totalPages} />
          </div>
        )}
      </div>
    </main>
  );
}
