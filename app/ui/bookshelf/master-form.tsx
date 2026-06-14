"use client";

import Link from "next/link";
import { useActionState } from "react";
import { MasterState } from "@/app/lib/actions.master";
import { Button } from "@/app/ui/button";
import { inputClass, labelClass, errorClass, disabledClass } from "@/app/ui/form-styles";

type Page = { id: string; name: string };

type ExtraField = { label: string; value: string | number | null | undefined };

type Props = {
  action?: (prev: MasterState, formData: FormData) => Promise<MasterState>;
  cancelHref: string;
  editHref?: string;
  defaultName?: string;
  pages?: Page[];
  defaultPageId?: string;
  defaultPageName?: string;
  label?: string;
  readOnly?: boolean;
  extraFields?: ExtraField[];
};

export default function MasterForm({
  action,
  cancelHref,
  editHref,
  defaultName = "",
  pages,
  defaultPageId = "",
  defaultPageName = "",
  label = "名前",
  readOnly = false,
  extraFields = [],
}: Props) {
  const initialState: MasterState = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    action ?? (async (_: MasterState) => ({ message: null, errors: {} })),
    initialState,
  );

  const mainFields = (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      {/* 名前フィールド */}
      <div>
        <label htmlFor="name" className={labelClass}>
          {label}{!readOnly && <span className="text-destructive"> *</span>}
        </label>
        {readOnly ? (
          <p className="py-2 text-sm text-foreground">{defaultName || "—"}</p>
        ) : (
          <>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={defaultName}
              placeholder={`${label}を入力`}
              className={inputClass}
              aria-describedby="name-error"
            />
            <div id="name-error" aria-live="polite">
              {state.errors?.name?.map((e) => (
                <p key={e} className={errorClass}>{e}</p>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ページフィールド（タグ用） */}
      {pages !== undefined && (
        <div>
          <label htmlFor="page_id" className={labelClass}>
            ページ{!readOnly && <span className="text-destructive"> *</span>}
          </label>
          {readOnly ? (
            <p className="py-2 text-sm text-foreground">{defaultPageName || "—"}</p>
          ) : (
            <>
              <select
                id="page_id"
                name="page_id"
                defaultValue={defaultPageId}
                className={inputClass}
                aria-describedby="page-error"
              >
                <option value="">— 選択してください —</option>
                {pages.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div id="page-error" aria-live="polite">
                {state.errors?.page_id?.map((e) => (
                  <p key={e} className={errorClass}>{e}</p>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 追加フィールド（書籍数・登録日・更新日など） */}
      {extraFields.map((f) => (
        <div key={f.label}>
          <p className={labelClass}>{f.label}</p>
          {readOnly ? (
            <p className="py-2 text-sm text-foreground">
              {f.value != null && f.value !== "" ? String(f.value) : "—"}
            </p>
          ) : (
            <input
              type="text"
              value={f.value != null && f.value !== "" ? String(f.value) : "—"}
              readOnly
              disabled
              className={disabledClass}
            />
          )}
        </div>
      ))}

      {!readOnly && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </div>
  );

  if (readOnly) {
    return (
      <>
        {mainFields}
        <div className="mt-6 flex justify-end gap-3">
          <Link
            href={cancelHref}
            className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            戻る
          </Link>
          {editHref && (
            <Link
              href={editHref}
              className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              編集
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <form action={formAction}>
      {mainFields}
      <div className="mt-6 flex justify-end gap-3">
        <Link
          href={cancelHref}
          className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          キャンセル
        </Link>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
