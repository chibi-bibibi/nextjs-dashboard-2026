import PageHeader from "@/app/ui/page-header";
import CreateBookForm from "@/app/ui/bookshelf/create-form";
import { fetchPublishers, fetchWriters, fetchMainCategories, fetchSubCategories, fetchAllTags } from "@/app/lib/data.bookshelf";

export default async function Page() {
  const [publishers, writers, categories, subCategories, allTags] = await Promise.all([
    fetchPublishers(),
    fetchWriters(),
    fetchMainCategories(),
    fetchSubCategories(),
    fetchAllTags(),
  ]);

  return (
    <main>
      <PageHeader root="BOOKS" parent="本棚" title="本を追加" />
      <CreateBookForm
        publishers={publishers}
        writers={writers}
        categories={categories}
        subCategories={subCategories}
        allTags={allTags}
      />
    </main>
  );
}
