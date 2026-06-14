import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { createAuthor } from "@/app/lib/actions.master";

export default function Page() {
  return (
    <main>
      <PageHeader root="BOOKS" parent="著者・訳者" title="著者・訳者を追加" />
      <MasterForm action={createAuthor} cancelHref="/book-tools/authors" label="著者・訳者名" />
    </main>
  );
}
