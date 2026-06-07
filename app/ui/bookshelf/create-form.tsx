"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createBook, BookState } from "@/app/lib/actions.bookshelf";
import { PublisherField } from "@/app/lib/definitions";
import { Button } from "@/app/ui/button";

const inputClass =
  "block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
const errorClass = "mt-1 text-xs text-destructive";

export default function CreateBookForm({
  publishers,
  authors,
}: {
  publishers: PublisherField[];
  authors: PublisherField[];
}) {
  const initialState: BookState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createBook, initialState);

  const [authorNames, setAuthorNames] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState("");

  const addAuthor = () => {
    const name = authorInput.trim();
    if (name && !authorNames.includes(name)) {
      setAuthorNames((prev) => [...prev, name]);
    }
    setAuthorInput("");
  };

  const removeAuthor = (name: string) => {
    setAuthorNames((prev) => prev.filter((n) => n !== name));
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
              <p key={e} className={errorClass}>
                {e}
              </p>
            ))}
          </div>
        </div>

        {/* 著者 */}
        <div>
          <label htmlFor="author_input" className={labelClass}>
            著者
          </label>
          <div className="flex gap-2">
            <input
              id="author_input"
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAuthor();
                }
              }}
              placeholder="著者名を入力して追加"
              className={inputClass}
              list="authors-list"
            />
            <button
              type="button"
              onClick={addAuthor}
              className="shrink-0 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              追加
            </button>
          </div>
          <datalist id="authors-list">
            {authors.map((a) => (
              <option key={a.id} value={a.name} />
            ))}
          </datalist>
          {authorNames.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {authorNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeAuthor(name)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                    aria-label={`${name}を削除`}
                  >
                    ×
                  </button>
                  <input type="hidden" name="author_names" value={name} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 出版社 */}
        <div>
          <label htmlFor="publisher_name" className={labelClass}>
            出版社
          </label>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="published_at" className={labelClass}>
              発行日
            </label>
            <input
              id="published_at"
              name="published_at"
              type="date"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="version" className={labelClass}>
              版
            </label>
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

        {/* メモ */}
        <div>
          <label htmlFor="memo" className={labelClass}>
            メモ
          </label>
          <textarea
            id="memo"
            name="memo"
            rows={4}
            placeholder="メモを入力"
            className={inputClass}
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
        <Button type="submit">登録</Button>
      </div>
    </form>
  );
}
