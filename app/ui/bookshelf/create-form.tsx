'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { createBook, BookState } from '@/app/lib/actions.bookshelf';
import { PublisherField } from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';

const inputClass =
  'block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring';
const labelClass = 'mb-1.5 block text-sm font-medium text-foreground';
const errorClass = 'mt-1 text-xs text-destructive';

export default function CreateBookForm({
  publishers,
}: {
  publishers: PublisherField[];
}) {
  const initialState: BookState = { message: null, errors: {} };
  const [state, formAction] = useActionState(createBook, initialState);

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

        {/* 出版社 */}
        <div>
          <label htmlFor="publisher_id" className={labelClass}>
            出版社
          </label>
          <select
            id="publisher_id"
            name="publisher_id"
            className={inputClass}
            defaultValue=""
          >
            <option value="">— 選択しない —</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
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
