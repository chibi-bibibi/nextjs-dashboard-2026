import PageHeader from "@/app/ui/page-header";
import BookDetailCard from "@/app/ui/bookshelf/detail-card";
import { fetchBookDetail } from "@/app/lib/data.bookshelf";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const book = await fetchBookDetail(id);

  if (!book) notFound();

  return (
    <main>
      <PageHeader root="BOOKS" parent="本棚" title={book.title} />
      <BookDetailCard book={book} editHref={`/book-tools/bookshelf/${id}/edit`} />
    </main>
  );
}
