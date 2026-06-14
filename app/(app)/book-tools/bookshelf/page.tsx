import PageHeader from "@/app/ui/page-header";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/books/pagination";
import BookshelfTable from "@/app/ui/bookshelf/table";
import { BookCategoryFilters } from "@/app/ui/bookshelf/book-filters";
import { CreateBookFab } from "@/app/ui/bookshelf/buttons";
import {
  fetchBooksPages,
  fetchMainCategories,
  fetchSubCategories,
} from "@/app/lib/data.bookshelf";
import TableSkeleton from '@/app/ui/table-skeleton';
import { Suspense } from 'react';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category_id?: string;
    sub_category_id?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query       = searchParams?.query       ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const filters = {
    categoryId:    searchParams?.category_id,
    subCategoryId: searchParams?.sub_category_id,
  };

  const [totalPages, categories, subCategories] = await Promise.all([
    fetchBooksPages(query, filters),
    fetchMainCategories(),
    fetchSubCategories(),
  ]);

  const suspenseKey = query + currentPage + JSON.stringify(filters);

  return (
    <main>
      <PageHeader parent="BOOKS" title="本棚" className="hidden md:flex" />

      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2">
            <Search placeholder="タイトル・出版社・著者・タグで検索..." />
          </div>
          <BookCategoryFilters categories={categories} subCategories={subCategories} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Suspense key={suspenseKey} fallback={<TableSkeleton />}>
          <BookshelfTable query={query} currentPage={currentPage} filters={filters} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>

      <CreateBookFab />
    </main>
  );
}
