import PageHeader from '@/app/ui/page-header';
import EditBookForm from '@/app/ui/bookshelf/edit-form';
import {
  fetchBookDetail,
  fetchPublishers,
  fetchAuthors,
  fetchMainCategories,
  fetchSubCategories,
  fetchAllTags,
  fetchBookTagIds,
} from '@/app/lib/data.bookshelf';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [book, publishers, authors, categories, subCategories, allTags, currentTagIds] = await Promise.all([
    fetchBookDetail(id),
    fetchPublishers(),
    fetchAuthors(),
    fetchMainCategories(),
    fetchSubCategories(),
    fetchAllTags(),
    fetchBookTagIds(id),
  ]);

  if (!book) notFound();

  return (
    <main>
      <PageHeader parent="本棚" title="書籍を編集" />
      <EditBookForm
        book={book}
        publishers={publishers}
        authors={authors}
        categories={categories}
        subCategories={subCategories}
        allTags={allTags}
        currentTagIds={currentTagIds}
      />
    </main>
  );
}
