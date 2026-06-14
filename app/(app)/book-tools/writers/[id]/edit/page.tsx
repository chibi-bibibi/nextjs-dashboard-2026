import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchWriterById } from "@/app/lib/data.bookshelf";
import { updateWriter, deleteWriter } from "@/app/lib/actions.master";
import { notFound } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const writer = await fetchWriterById(id);
  if (!writer) notFound();

  const action = updateWriter.bind(null, id);
  const deleteAction = deleteWriter.bind(null, id);

  const extraFields = [
    { label: "書籍数",  value: writer.book_count },
    { label: "登録日",  value: fmtDate(writer.created_at) },
    { label: "更新日",  value: fmtDate(writer.updated_at) },
  ];

  return (
    <main>
      <div className="flex items-start justify-between mb-1">
        <PageHeader root="BOOKS" parent="著者・訳者" title="著者・訳者を編集" />
        <form action={deleteAction} className="mt-1">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 h-9 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          >
            <TrashIcon className="w-4 stroke-2" />
            削除
          </button>
        </form>
      </div>
      <MasterForm
        action={action}
        cancelHref="/book-tools/writers"
        defaultName={writer.name}
        label="著者・訳者名"
        extraFields={extraFields}
      />
    </main>
  );
}
