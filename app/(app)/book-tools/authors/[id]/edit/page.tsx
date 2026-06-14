import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchAuthorById } from "@/app/lib/data.bookshelf";
import { updateAuthor, deleteAuthor } from "@/app/lib/actions.master";
import { notFound } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const author = await fetchAuthorById(id);
  if (!author) notFound();

  const action = updateAuthor.bind(null, id);
  const deleteAction = deleteAuthor.bind(null, id);

  const extraFields = [
    { label: "書籍数",  value: author.book_count },
    { label: "登録日",  value: fmtDate(author.created_at) },
    { label: "更新日",  value: fmtDate(author.updated_at) },
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
        cancelHref="/book-tools/authors"
        defaultName={author.name}
        label="著者・訳者名"
        extraFields={extraFields}
      />
    </main>
  );
}
