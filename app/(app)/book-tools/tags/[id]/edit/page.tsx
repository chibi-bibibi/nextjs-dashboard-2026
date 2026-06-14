import PageHeader from "@/app/ui/page-header";
import MasterForm from "@/app/ui/bookshelf/master-form";
import { fetchTagById, fetchPages } from "@/app/lib/data.bookshelf";
import { updateTag, deleteTag } from "@/app/lib/actions.master";
import { notFound } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { formatDateJP as fmtDate } from "@/app/lib/date-utils";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const [tag, pages] = await Promise.all([fetchTagById(id), fetchPages()]);
  if (!tag) notFound();

  const action = updateTag.bind(null, id);
  const deleteAction = deleteTag.bind(null, id);

  const extraFields = [
    { label: "書籍数",  value: tag.book_count },
    { label: "登録日",  value: fmtDate(tag.created_at) },
    { label: "更新日",  value: fmtDate(tag.updated_at) },
  ];

  return (
    <main>
      <div className="flex items-start justify-between mb-1">
        <PageHeader root="BOOKS" parent="タグ" title="タグを編集" />
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
        cancelHref="/book-tools/tags"
        defaultName={tag.name}
        label="タグ名"
        pages={pages}
        defaultPageId={tag.page_id ?? ""}
        extraFields={extraFields}
      />
    </main>
  );
}
