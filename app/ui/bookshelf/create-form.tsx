"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { createBook, BookState } from "@/app/lib/actions.bookshelf";
import { PublisherField } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";
import { inputClass, labelClass, errorClass } from "@/app/ui/form-styles";
import { ROLES } from "@/app/ui/bookshelf/writer-chips";


type WriterEntry = { role: string; name: string };
type CategoryOption = { id: string; name: string; category_no?: number; main_category_id?: string };
type TagOption = { id: string; name: string };

export default function CreateBookForm({
  publishers,
  writers: writerOptions,
  categories,
  subCategories,
  allTags,
}: {
  publishers: PublisherField[];
  writers: PublisherField[];
  categories: CategoryOption[];
  subCategories: CategoryOption[];
  allTags: TagOption[];
}) {
  const initialState: BookState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createBook, initialState);

  const [selectedWriters, setSelectedWriters] = useState<WriterEntry[]>([{ role: "著者", name: "" }]);
  const [selectedMainId, setSelectedMainId] = useState("");
  const [selectedSubId, setSelectedSubId] = useState("");
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([{ id: "", name: "" }]);

  const filteredSubs = selectedMainId
    ? subCategories.filter((s) => s.main_category_id === selectedMainId)
    : subCategories;

  const addWriterRow = () => {
    setSelectedWriters((prev) => [...prev, { role: "著者", name: "" }]);
  };

  const updateWriterRow = (index: number, field: keyof WriterEntry, value: string) => {
    setSelectedWriters((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [field]: value } : a))
    );
  };

  const removeWriterRow = (index: number) => {
    setSelectedWriters((prev) => prev.filter((_, i) => i !== index));
  };

  const addTagRow = () => {
    setSelectedTags((prev) => [...prev, { id: "", name: "" }]);
  };

  const updateTagRow = (index: number, name: string) => {
    const found = allTags.find((t) => t.name === name);
    setSelectedTags((prev) =>
      prev.map((t, i) => (i === index ? { id: found?.id ?? "", name } : t))
    );
  };

  const removeTagRow = (index: number) => {
    setSelectedTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction}>
      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        {/* タイトル */}
        <div>
          <label htmlFor="title" className={labelClass}>
            タイトル <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="書籍タイトルを入力"
            className={inputClass}
            aria-describedby="title-error"
          />
          <div id="title-error" aria-live="polite">
            {state.errors?.title?.map((e) => (
              <p key={e} className={errorClass}>{e}</p>
            ))}
          </div>
        </div>

        {/* 著者 */}
        <div>
          <p className="text-sm font-medium text-foreground mb-1.5">著者</p>
          <div className="space-y-2">
            {selectedWriters.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-6 gap-2 md:flex-none md:w-1/2">
                  <select
                    value={a.role}
                    onChange={(e) => updateWriterRow(i, "role", e.target.value)}
                    className="col-span-2 md:col-span-1 rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={a.name}
                    onChange={(e) => updateWriterRow(i, "name", e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                    placeholder="著者名を入力または選択"
                    className={`${inputClass} col-span-4 md:col-span-5`}
                    list="writers-list"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeWriterRow(i)}
                  className={`shrink-0 rounded-md border p-2 transition-colors ${i === 0 ? "invisible" : ""}`}
                  style={{ borderColor: "#C49090", color: "#8B4545" }}
                  onMouseEnter={(e) => i > 0 && (e.currentTarget.style.backgroundColor = "#F2EAEA")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  aria-label="この行を削除"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <input type="hidden" name="writer_names" value={a.name} />
                <input type="hidden" name="writer_roles" value={a.role} />
              </div>
            ))}
          </div>
          <datalist id="writers-list">
            {writerOptions.map((a) => (
              <option key={a.id} value={a.name} />
            ))}
          </datalist>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 grid grid-cols-6 gap-2 md:flex-none md:w-1/2">
              <button
                type="button"
                onClick={addWriterRow}
                className="col-span-2 md:col-span-1 rounded-md border border-primary py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                行追加
              </button>
            </div>
            <button className="shrink-0 invisible rounded-md border p-2" tabIndex={-1} aria-hidden>
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 出版社 */}
        <div className="w-full md:w-1/2">
          <label htmlFor="publisher_name" className={labelClass}>出版社</label>
          <input
            id="publisher_name"
            name="publisher_name"
            type="text"
            placeholder="出版社を選択または入力"
            className={inputClass}
            list="publishers-list"
          />
          <datalist id="publishers-list">
            {publishers.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
        </div>

        {/* 発行日 / 版 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="published_at" className={labelClass}>発行日</label>
            <input
              id="published_at"
              name="published_at"
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="version" className={labelClass}>版</label>
            <input
              id="version"
              name="version"
              type="text"
              placeholder="例：第3版"
              className={inputClass}
              maxLength={50}
            />
          </div>
        </div>

        {/* 大分類 / 小分類 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>大分類</label>
            <select
              className={inputClass}
              value={selectedMainId}
              onChange={(e) => {
                setSelectedMainId(e.target.value);
                setSelectedSubId("");
              }}
            >
              <option value="">— 選択しない —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category_no != null ? `${c.category_no} : ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sub_category_id" className={labelClass}>小分類</label>
            <select
              id="sub_category_id"
              name="sub_category_id"
              className={inputClass}
              value={selectedSubId}
              onChange={(e) => setSelectedSubId(e.target.value)}
            >
              <option value="">— 選択しない —</option>
              {filteredSubs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.category_no != null ? `${s.category_no} : ${s.name}` : s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* タグ */}
        <div>
          <p className="text-sm font-medium text-foreground mb-1.5">タグ</p>
          <div className="space-y-2">
            {selectedTags.map((tag, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    value={tag.name}
                    onChange={(e) => updateTagRow(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
                    placeholder="タグ名を入力または選択"
                    className={inputClass}
                    list="tags-list"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTagRow(i)}
                  className={`rounded-md border p-2 transition-colors ${i === 0 ? "invisible" : ""}`}
                  style={{ borderColor: "#C49090", color: "#8B4545" }}
                  onMouseEnter={(e) => i > 0 && (e.currentTarget.style.backgroundColor = "#F2EAEA")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "")}
                  aria-label="この行を削除"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                {tag.id
                  ? <input type="hidden" name="tag_ids" value={tag.id} />
                  : tag.name && <input type="hidden" name="tag_new_names" value={tag.name} />
                }
              </div>
            ))}
          </div>
          <datalist id="tags-list">
            {allTags.map((t) => <option key={t.id} value={t.name} />)}
          </datalist>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 grid grid-cols-6 gap-2 md:flex-none md:w-1/2">
              <button
                type="button"
                onClick={addTagRow}
                className="col-span-2 md:col-span-1 rounded-md border border-primary py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                行追加
              </button>
            </div>
            <button className="shrink-0 invisible rounded-md border p-2" tabIndex={-1} aria-hidden>
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* メモ */}
        <div>
          <label htmlFor="memo" className={labelClass}>メモ</label>
          <textarea
            id="memo"
            name="memo"
            defaultValue=""
            placeholder="メモを入力"
            className={`${inputClass} h-28 resize-none`}
          />
        </div>

        {state.message && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Link
          href="/book-tools/bookshelf"
          className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          キャンセル
        </Link>
        <Button type="submit" className="bg-primary hover:bg-primary/90 focus-visible:outline-primary active:bg-primary/80">登録</Button>
      </div>
    </form>
  );
}
