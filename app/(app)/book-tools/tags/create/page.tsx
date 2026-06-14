import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { createTag } from "@/app/lib/actions.master";
import { fetchPages } from "@/app/lib/data.bookshelf";

export default async function Page() {
  const pages = await fetchPages();

  return (
    <main>
      <PageHeader root="BOOKS" parent="タグ" title="タグを追加" />
      <MasterForm
        action={createTag}
        cancelHref="/book-tools/tags"
        label="タグ名"
        pages={pages}
      />
    </main>
  );
}
