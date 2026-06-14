import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchPublisherById } from "@/app/lib/data.bookshelf";
import { notFound } from "next/navigation";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const publisher = await fetchPublisherById(id);
  if (!publisher) notFound();

  const extraFields = [
    { label: "書籍数",  value: publisher.book_count },
    { label: "登録日",  value: fmtDate(publisher.created_at) },
    { label: "更新日",  value: fmtDate(publisher.updated_at) },
  ];

  return (
    <main>
      <PageHeader root="BOOKS" parent="出版社" title={publisher.name} />
      <MasterForm
        readOnly
        cancelHref="/book-tools/publishers"
        editHref={`/book-tools/publishers/${id}/edit`}
        defaultName={publisher.name}
        label="出版社名"
        extraFields={extraFields}
      />
    </main>
  );
}
