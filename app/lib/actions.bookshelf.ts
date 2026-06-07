'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const BOOKSHELF_PATH = '/book-tools/bookshelf';

const BookFormSchema = z.object({
  title: z.string().min(1, { message: 'タイトルを入力してください。' }),
  publisher_id: z.string().nullable().optional(),
  published_at: z.string().nullable().optional(),
  version: z.string().max(50).nullable().optional(),
  memo: z.string().nullable().optional(),
});

export type BookState = {
  errors?: {
    title?: string[];
    publisher_id?: string[];
    published_at?: string[];
    version?: string[];
    memo?: string[];
  };
  message?: string | null;
};

async function getSessionUser() {
  const session = await auth();
  const id = session?.user?.id;
  const group_code = session?.user?.group_code ?? null;
  if (!id) throw new Error('Unauthenticated');
  return { id, group_code };
}

function parseFormData(formData: FormData) {
  const nullIfEmpty = (v: FormDataEntryValue | null) =>
    v === '' || v === null ? null : String(v);

  return {
    title: formData.get('title') as string,
    publisher_id: nullIfEmpty(formData.get('publisher_id')),
    published_at: nullIfEmpty(formData.get('published_at')),
    version: nullIfEmpty(formData.get('version')),
    memo: nullIfEmpty(formData.get('memo')),
  };
}

export async function createBook(_prevState: BookState, formData: FormData) {
  const raw = parseFormData(formData);
  const validated = BookFormSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: '入力内容を確認してください。',
    };
  }

  const { title, publisher_id, published_at, version, memo } = validated.data;

  try {
    const { id: userId, group_code } = await getSessionUser();
    await sql`
      INSERT INTO book_tools.books
        (title, publisher_id, published_at, version, group_code, memo,
         create_user_id, update_user_id)
      VALUES
        (${title}, ${publisher_id ?? null}, ${published_at ?? null},
         ${version ?? null}, ${group_code}, ${memo ?? null},
         ${userId}, ${userId})
    `;
  } catch (error) {
    console.error(error);
    return { message: 'データベースエラー：登録に失敗しました。' };
  }

  revalidatePath(BOOKSHELF_PATH);
  redirect(BOOKSHELF_PATH);
}

export async function updateBook(
  id: string,
  _prevState: BookState,
  formData: FormData,
) {
  const raw = parseFormData(formData);
  const validated = BookFormSchema.safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: '入力内容を確認してください。',
    };
  }

  const { title, publisher_id, published_at, version, memo } = validated.data;

  try {
    const { id: userId, group_code } = await getSessionUser();
    await sql`
      UPDATE book_tools.books SET
        title          = ${title},
        publisher_id   = ${publisher_id ?? null},
        published_at   = ${published_at ?? null},
        version        = ${version ?? null},
        group_code     = ${group_code},
        memo           = ${memo ?? null},
        update_user_id = ${userId},
        updated_at     = NOW()
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { message: 'データベースエラー：更新に失敗しました。' };
  }

  revalidatePath(BOOKSHELF_PATH);
  redirect(BOOKSHELF_PATH);
}

export async function deleteBook(id: string) {
  try {
    await sql`DELETE FROM book_tools.books WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
    throw new Error('削除に失敗しました。');
  }
  revalidatePath(BOOKSHELF_PATH);
}
