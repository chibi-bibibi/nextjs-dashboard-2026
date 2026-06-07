import PageHeader from '@/app/ui/page-header';
import CreateBookForm from '@/app/ui/bookshelf/create-form';
import { fetchPublishers } from '@/app/lib/data.bookshelf';

export default async function Page() {
  const publishers = await fetchPublishers();

  return (
    <main>
      <PageHeader parent="本棚" title="書籍を追加" />
      <CreateBookForm publishers={publishers} />
    </main>
  );
}
