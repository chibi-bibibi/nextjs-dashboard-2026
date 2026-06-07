import PageHeader from '@/app/ui/page-header';
import EditBookForm from '@/app/ui/bookshelf/edit-form';
import { fetchBookById, fetchPublishers } from '@/app/lib/data.bookshelf';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [book, publishers] = await Promise.all([
    fetchBookById(id),
    fetchPublishers(),
  ]);

  if (!book) notFound();

  return (
    <main>
      <PageHeader parent="本棚" title="書籍を編集" />
      <EditBookForm book={book} publishers={publishers} />
    </main>
  );
}
