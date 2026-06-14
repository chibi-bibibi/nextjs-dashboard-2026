import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchAuthorById } from "@/app/lib/data.bookshelf";
import { notFound } from "next/navigation";

function fmtDate(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const author = await fetchAuthorById(id);
  if (!author) notFound();

  const extraFields = [
    { label: "書籍数",  value: author.book_count },
    { label: "登録日",  value: fmtDate(author.created_at) },
    { label: "更新日",  value: fmtDate(author.updated_at) },
  ];

  return (
    <main>
      <PageHeader root="BOOKS" parent="著者・訳者" title={author.name} />
      <MasterForm
        readOnly
        cancelHref="/book-tools/authors"
        editHref={`/book-tools/authors/${id}/edit`}
        defaultName={author.name}
        label="著者・訳者名"
        extraFields={extraFields}
      />
    </main>
  );
}
