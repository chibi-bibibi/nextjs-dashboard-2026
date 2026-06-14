import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchWriterById } from "@/app/lib/data.bookshelf";
import { notFound } from "next/navigation";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const writer = await fetchWriterById(id);
  if (!writer) notFound();

  const extraFields = [
    { label: "書籍数",  value: writer.book_count },
    { label: "登録日",  value: fmtDate(writer.created_at) },
    { label: "更新日",  value: fmtDate(writer.updated_at) },
  ];

  return (
    <main>
      <PageHeader root="BOOKS" parent="著者・訳者" title={writer.name} />
      <MasterForm
        readOnly
        cancelHref="/book-tools/writers"
        editHref={`/book-tools/writers/${id}/edit`}
        defaultName={writer.name}
        label="著者・訳者名"
        extraFields={extraFields}
      />
    </main>
  );
}
