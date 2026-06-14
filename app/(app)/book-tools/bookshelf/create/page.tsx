import PageHeader from "@/app/ui/page-header";
import CreateBookForm from "@/app/ui/bookshelf/create-form";
import { fetchPublishers, fetchAuthors, fetchMainCategories, fetchSubCategories, fetchAllTags } from "@/app/lib/data.bookshelf";

export default async function Page() {
  const [publishers, authors, categories, subCategories, allTags] = await Promise.all([
    fetchPublishers(),
    fetchAuthors(),
    fetchMainCategories(),
    fetchSubCategories(),
    fetchAllTags(),
  ]);

  return (
    <main>
      <PageHeader root="BOOKS" parent="本棚" title="本を追加" />
      <CreateBookForm
        publishers={publishers}
        authors={authors}
        categories={categories}
        subCategories={subCategories}
        allTags={allTags}
      />
    </main>
  );
}
