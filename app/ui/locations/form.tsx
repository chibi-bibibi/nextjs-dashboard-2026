'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { LocationState } from '@/app/lib/actions.locations';
import { Button } from '@/app/ui/button';
import { inputClass, labelClass, errorClass } from '@/app/ui/form-styles';
import { formatDateJP as fmtDate } from '@/app/lib/date-utils';

type Props = {
  action?: (prev: LocationState, formData: FormData) => Promise<LocationState>;
  cancelHref: string;
  editHref?: string;
  defaultName?: string;
  defaultNameKana?: string;
  defaultNameRome?: string;
  createdAt?: string;
  updatedAt?: string;
  readOnly?: boolean;
};

export default function LocationForm({
  action,
  cancelHref,
  editHref,
  defaultName = '',
  defaultNameKana = '',
  defaultNameRome = '',
  createdAt,
  updatedAt,
  readOnly = false,
}: Props) {
  const initialState: LocationState = { message: null, errors: {} };
  const [state, formAction] = useActionState(
    action ?? (async (_: LocationState) => ({ message: null, errors: {} })),
    initialState,
  );

  const fields = (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5">
      <div>
        <label htmlFor="name" className={labelClass}>
          場所名{!readOnly && <span className="text-destructive"> *</span>}
        </label>
        {readOnly ? (
          <p className="py-2 text-sm text-foreground">{defaultName || '—'}</p>
        ) : (
          <>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={defaultName}
              placeholder="場所名を入力"
              className={inputClass}
            />
            {state.errors?.name?.map((e) => (
              <p key={e} className={errorClass}>{e}</p>
            ))}
          </>
        )}
      </div>

      <div>
        <label htmlFor="name_kana" className={labelClass}>かな</label>
        {readOnly ? (
          <p className="py-2 text-sm text-foreground">{defaultNameKana || '—'}</p>
        ) : (
          <input
            id="name_kana"
            name="name_kana"
            type="text"
            defaultValue={defaultNameKana}
            placeholder="ひらがなで入力"
            className={inputClass}
          />
        )}
      </div>

      <div>
        <label htmlFor="name_rome" className={labelClass}>ローマ字</label>
        {readOnly ? (
          <p className="py-2 text-sm text-foreground">{defaultNameRome || '—'}</p>
        ) : (
          <input
            id="name_rome"
            name="name_rome"
            type="text"
            defaultValue={defaultNameRome}
            placeholder="ローマ字で入力"
            className={inputClass}
          />
        )}
      </div>

      {readOnly && (
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-5">
          <div>
            <p className={labelClass}>登録日</p>
            <p className="py-2 text-sm text-foreground">{fmtDate(createdAt)}</p>
          </div>
          <div>
            <p className={labelClass}>更新日</p>
            <p className="py-2 text-sm text-foreground">{fmtDate(updatedAt)}</p>
          </div>
        </div>
      )}

      {!readOnly && state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </div>
  );

  if (readOnly) {
    return (
      <>
        {fields}
        <div className="mt-6 flex justify-end gap-3">
          <Link href={cancelHref} className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            戻る
          </Link>
          {editHref && (
            <Link href={editHref} className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              編集
            </Link>
          )}
        </div>
      </>
    );
  }

  return (
    <form action={formAction}>
      {fields}
      <div className="mt-6 flex justify-end gap-3">
        <Link href={cancelHref} className="flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          キャンセル
        </Link>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
