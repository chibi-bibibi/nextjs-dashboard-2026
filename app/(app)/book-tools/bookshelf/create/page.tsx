import PageHeader from "@/app/ui/page-header";
import CreateBookForm from "@/app/ui/bookshelf/create-form";
import { fetchPublishers, fetchAuthors } from "@/app/lib/data.bookshelf";

export default async function Page() {
  const publishers = await fetchPublishers();
  const authors = await fetchAuthors();

  return (
    <main>
      <PageHeader root="BOOKS" parent="本棚" title="本を追加" />
      <CreateBookForm publishers={publishers} authors={authors} />
    </main>
  );
}
