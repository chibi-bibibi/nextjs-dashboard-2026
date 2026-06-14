'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getGroupCode() {
  const session = await auth();
  return session?.user?.group_code ?? null;
}

export type MasterState = {
  errors?: { name?: string[]; page_id?: string[] };
  message?: string | null;
};

const NameSchema = z.object({
  name: z.string().min(1, { message: '名前を入力してください。' }).max(255),
});

const TagSchema = z.object({
  name: z.string().min(1, { message: '名前を入力してください。' }).max(255),
  page_id: z.string().min(1, { message: 'ページを選択してください。' }),
});

// ---- Publishers ----

export async function createPublisher(_prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = NameSchema.safeParse({ name: formData.get('name') });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    const group_code = await getGroupCode();
    await sql`
      INSERT INTO book_tools.publishers (name, group_code)
      VALUES (${validated.data.name}, ${group_code})
    `;
  } catch {
    return { message: 'データベースエラー：登録に失敗しました。' };
  }
  revalidatePath('/book-tools/publishers');
  redirect('/book-tools/publishers');
}

export async function updatePublisher(id: string, _prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = NameSchema.safeParse({ name: formData.get('name') });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    await sql`
      UPDATE book_tools.publishers SET name = ${validated.data.name}, updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'データベースエラー：更新に失敗しました。' };
  }
  revalidatePath('/book-tools/publishers');
  redirect('/book-tools/publishers');
}

export async function deletePublisher(id: string) {
  try {
    await sql`DELETE FROM book_tools.publishers WHERE id = ${id}`;
  } catch {
    throw new Error('削除に失敗しました。');
  }
  revalidatePath('/book-tools/publishers');
  redirect('/book-tools/publishers');
}

// ---- Authors / Writers ----

export async function createAuthor(_prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = NameSchema.safeParse({ name: formData.get('name') });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    const group_code = await getGroupCode();
    await sql`
      INSERT INTO book_tools.writers (name, group_code)
      VALUES (${validated.data.name}, ${group_code})
    `;
  } catch {
    return { message: 'データベースエラー：登録に失敗しました。' };
  }
  revalidatePath('/book-tools/authors');
  redirect('/book-tools/authors');
}

export async function updateAuthor(id: string, _prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = NameSchema.safeParse({ name: formData.get('name') });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    await sql`
      UPDATE book_tools.writers SET name = ${validated.data.name}, updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'データベースエラー：更新に失敗しました。' };
  }
  revalidatePath('/book-tools/authors');
  redirect('/book-tools/authors');
}

export async function deleteAuthor(id: string) {
  try {
    await sql`DELETE FROM book_tools.writers WHERE id = ${id}`;
  } catch {
    throw new Error('削除に失敗しました。');
  }
  revalidatePath('/book-tools/authors');
  redirect('/book-tools/authors');
}

// ---- Tags ----

export async function createTag(_prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = TagSchema.safeParse({
    name: formData.get('name'),
    page_id: formData.get('page_id'),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    const group_code = await getGroupCode();
    await sql`
      INSERT INTO tags (name, page_id, group_code)
      VALUES (${validated.data.name}, ${validated.data.page_id}, ${group_code})
    `;
  } catch {
    return { message: 'データベースエラー：登録に失敗しました。' };
  }
  revalidatePath('/book-tools/tags');
  redirect('/book-tools/tags');
}

export async function updateTag(id: string, _prev: MasterState, formData: FormData): Promise<MasterState> {
  const validated = TagSchema.safeParse({
    name: formData.get('name'),
    page_id: formData.get('page_id'),
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    await sql`
      UPDATE tags SET name = ${validated.data.name}, page_id = ${validated.data.page_id}, updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'データベースエラー：更新に失敗しました。' };
  }
  revalidatePath('/book-tools/tags');
  redirect('/book-tools/tags');
}

export async function deleteTag(id: string) {
  try {
    await sql`DELETE FROM tags WHERE id = ${id}`;
  } catch {
    throw new Error('削除に失敗しました。');
  }
  revalidatePath('/book-tools/tags');
  redirect('/book-tools/tags');
}
