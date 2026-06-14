import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { createPublisher } from "@/app/lib/actions.master";

export default function Page() {
  return (
    <main>
      <PageHeader root="BOOKS" parent="出版社" title="出版社を追加" />
      <MasterForm action={createPublisher} cancelHref="/book-tools/publishers" label="出版社名" />
    </main>
  );
}
