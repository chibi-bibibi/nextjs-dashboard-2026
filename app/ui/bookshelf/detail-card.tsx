import Link from "next/link";
import { BookRecord } from "@/app/lib/definitions";
import { parseWriters, CATEGORY_CONFIG } from "@/app/ui/bookshelf/writer-chips";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

function fmtDate(s: string | null | undefined) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className="py-2 text-sm text-foreground">{value || "—"}</p>
    </div>
  );
}

export default function BookDetailCard({ book, editHref }: { book: BookRecord; editHref: string }) {
  return (
    <>
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <Field label="タイトル" value={book.title} />
        <div>
          <p className={labelClass}>著者・訳者</p>
          {book.writer_names ? (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {parseWriters(book.writer_names).map(({ category, name }) => {
                const cfg = CATEGORY_CONFIG[category];
                return (
                  <span
                    key={`${category}::${name}`}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm${!cfg ? " bg-muted text-foreground" : ""}`}
                    style={cfg ? { backgroundColor: cfg.bg, color: cfg.text } : undefined}
                  >
                    {cfg && <span className="opacity-75 text-xs">{cfg.label}</span>}
                    {name}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="py-2 text-sm text-foreground">—</p>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2"><Field label="出版社" value={book.publisher_name} /></div>
          <Field label="発行日" value={fmtDate(book.published_at)} />
          <Field label="版"     value={book.version} />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className={labelClass}>大分類</p>
            <p className="py-2 text-sm text-foreground">
              {book.main_category_name ? `${book.main_category_no} : ${book.main_category_name}` : "—"}
            </p>
          </div>
          <div>
            <p className={labelClass}>小分類</p>
            <p className="py-2 text-sm text-foreground">
              {book.sub_category_name ? `${book.sub_category_no} : ${book.sub_category_name}` : "—"}
            </p>
          </div>
          <div className="col-span-2">
            <p className={labelClass}>タグ</p>
            {book.tag_names ? (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {book.tag_names.split("、").map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="py-2 text-sm text-foreground">—</p>
            )}
          </div>
        </div>
        <Field label="メモ" value={book.memo} />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          href="/book-tools/bookshelf"
          className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          戻る
        </Link>
        <Link
          href={editHref}
          className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          編集
        </Link>
      </div>
    </>
  );
}
