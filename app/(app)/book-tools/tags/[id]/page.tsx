import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchTagById } from "@/app/lib/data.bookshelf";
import { notFound } from "next/navigation";

function fmtDate(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const tag = await fetchTagById(id);
  if (!tag) notFound();

  const extraFields = [
    { label: "書籍数",  value: tag.book_count },
    { label: "登録日",  value: fmtDate(tag.created_at) },
    { label: "更新日",  value: fmtDate(tag.updated_at) },
  ];

  return (
    <main>
      <PageHeader root="BOOKS" parent="タグ" title={tag.name} />
      <MasterForm
        readOnly
        cancelHref="/book-tools/tags"
        editHref={`/book-tools/tags/${id}/edit`}
        defaultName={tag.name}
        label="タグ名"
        pages={[]}
        defaultPageName={tag.page_name ?? ""}
        extraFields={extraFields}
      />
    </main>
  );
}
