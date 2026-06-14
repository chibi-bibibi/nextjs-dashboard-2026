'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const BOOKSHELF_PATH = '/book-tools/bookshelf';

const ROLE_TO_CATEGORY: Record<string, string> = {
  作者: 'Writer',
  著者: 'Author',
  編者: 'Editor',
  訳者: 'Translator',
};

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


async function resolveWriterIds(names: string[], groupCode: string | null): Promise<string[]> {
  if (names.length === 0) return [];

  const existing = await sql<{ id: string; name: string }[]>`
    SELECT id, name FROM book_tools.writers WHERE name = ANY(${names})
  `;
  const existingMap = new Map(existing.map((e) => [e.name, e.id]));

  const ids: string[] = [];
  for (const name of names) {
    if (existingMap.has(name)) {
      ids.push(existingMap.get(name)!);
    } else {
      const created = await sql<{ id: string }[]>`
        INSERT INTO book_tools.writers (name, group_code)
        VALUES (${name}, ${groupCode})
        RETURNING id
      `;
      ids.push(created[0].id);
    }
  }
  return ids;
}

async function resolvePublisherId(
  name: string | null,
  groupCode: string | null,
): Promise<string | null> {
  if (!name) return null;

  const existing = await sql<{ id: string }[]>`
    SELECT id FROM book_tools.publishers WHERE name = ${name} LIMIT 1
  `;
  if (existing.length > 0) return existing[0].id;

  const created = await sql<{ id: string }[]>`
    INSERT INTO book_tools.publishers (name, group_code)
    VALUES (${name}, ${groupCode})
    RETURNING id
  `;
  return created[0].id;
}

export async function createBook(_prevState: BookState, formData: FormData) {
  const nullIfEmpty = (v: FormDataEntryValue | null) =>
    v === '' || v === null ? null : String(v);

  const raw = {
    title: formData.get('title') as string,
    publisher_name: nullIfEmpty(formData.get('publisher_name')),
    published_at: nullIfEmpty(formData.get('published_at')),
    version: nullIfEmpty(formData.get('version')),
    sub_category_id: nullIfEmpty(formData.get('sub_category_id')),
    memo: nullIfEmpty(formData.get('memo')),
  };

  const validated = z.object({
    title: z.string().min(1, { message: 'タイトルを入力してください。' }),
    publisher_name: z.string().nullable().optional(),
    published_at: z.string().nullable().optional(),
    version: z.string().max(50).nullable().optional(),
    sub_category_id: z.string().nullable().optional(),
    memo: z.string().nullable().optional(),
  }).safeParse(raw);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors as BookState['errors'],
      message: '入力内容を確認してください。',
    };
  }

  const { title, publisher_name, published_at, version, sub_category_id, memo } = validated.data;
  const authorNames = formData.getAll('author_names').map(String).filter(Boolean);
  const authorRoles = formData.getAll('author_roles').map(String);
  const tagIds = formData.getAll('tag_ids').map(String).filter(Boolean);
  const tagNewNames = formData.getAll('tag_new_names').map(String).filter(Boolean);

  try {
    const { id: userId, group_code } = await getSessionUser();
    const publisher_id = await resolvePublisherId(publisher_name ?? null, group_code);

    if (tagNewNames.length > 0) {
      const pageRows = await sql<{ id: string }[]>`
        SELECT id FROM pages WHERE name = 'book_tools' LIMIT 1
      `;
      const pageId = pageRows[0]?.id ?? null;
      for (const name of tagNewNames) {
        const created = await sql<{ id: string }[]>`
          INSERT INTO tags (name, page_id, group_code)
          VALUES (${name}, ${pageId}, ${group_code})
          ON CONFLICT DO NOTHING
          RETURNING id
        `;
        if (created[0]) tagIds.push(created[0].id);
      }
    }

    const inserted = await sql<{ id: string }[]>`
      INSERT INTO book_tools.books
        (title, publisher_id, published_at, version, sub_category_id, group_code, memo,
         create_user_id, update_user_id)
      VALUES
        (${title}, ${publisher_id ?? null}, ${published_at ?? null},
         ${version ?? null}, ${sub_category_id ?? null}, ${group_code}, ${memo ?? null},
         ${userId}, ${userId})
      RETURNING id
    `;
    const bookId = inserted[0].id;

    if (authorNames.length > 0) {
      const writerIds = await resolveWriterIds(authorNames, group_code);
      for (let i = 0; i < writerIds.length; i++) {
        const writerId = writerIds[i];
        const category = ROLE_TO_CATEGORY[authorRoles[i]] ?? null;
        await sql`
          INSERT INTO book_tools.book_writer (book_id, writer_id, group_code, writer_category)
          VALUES (${bookId}, ${writerId}, ${group_code}, ${category})
          ON CONFLICT (book_id, writer_id) DO NOTHING
        `;
      }
    }

    for (const tagId of tagIds) {
      await sql`
        INSERT INTO book_tools.book_tag (book_id, tag_id, group_code)
        VALUES (${bookId}, ${tagId}, ${group_code})
        ON CONFLICT DO NOTHING
      `;
    }
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
): Promise<BookState> {
  const nullIfEmpty = (v: FormDataEntryValue | null) =>
    v === '' || v === null ? null : String(v);

  const publisher_name = nullIfEmpty(formData.get('publisher_name'));
  const published_at = nullIfEmpty(formData.get('published_at'));
  const version = nullIfEmpty(formData.get('version'));
  const sub_category_id = nullIfEmpty(formData.get('sub_category_id'));
  const memo = nullIfEmpty(formData.get('memo'));
  const authorNames = formData.getAll('author_names').map(String).filter(Boolean);
  const authorRoles = formData.getAll('author_roles').map(String);
  const tagIds = formData.getAll('tag_ids').map(String).filter(Boolean);
  const tagNewNames = formData.getAll('tag_new_names').map(String).filter(Boolean);

  try {
    const { id: userId, group_code } = await getSessionUser();
    const publisher_id = await resolvePublisherId(publisher_name, group_code);

    if (tagNewNames.length > 0) {
      const pageRows = await sql<{ id: string }[]>`
        SELECT id FROM pages WHERE name = 'book_tools' LIMIT 1
      `;
      const pageId = pageRows[0]?.id ?? null;
      for (const name of tagNewNames) {
        const created = await sql<{ id: string }[]>`
          INSERT INTO tags (name, page_id, group_code)
          VALUES (${name}, ${pageId}, ${group_code})
          ON CONFLICT DO NOTHING
          RETURNING id
        `;
        if (created[0]) tagIds.push(created[0].id);
      }
    }

    await sql`
      UPDATE book_tools.books SET
        publisher_id     = ${publisher_id ?? null},
        published_at     = ${published_at ?? null},
        version          = ${version ?? null},
        sub_category_id  = ${sub_category_id ?? null},
        memo             = ${memo ?? null},
        update_user_id   = ${userId},
        updated_at       = NOW()
      WHERE id = ${id}
    `;

    await sql`DELETE FROM book_tools.book_writer WHERE book_id = ${id}`;
    if (authorNames.length > 0) {
      const writerIds = await resolveWriterIds(authorNames, group_code);
      for (let i = 0; i < writerIds.length; i++) {
        const category = ROLE_TO_CATEGORY[authorRoles[i]] ?? null;
        await sql`
          INSERT INTO book_tools.book_writer (book_id, writer_id, group_code, writer_category)
          VALUES (${id}, ${writerIds[i]}, ${group_code}, ${category})
          ON CONFLICT (book_id, writer_id) DO NOTHING
        `;
      }
    }

    await sql`DELETE FROM book_tools.book_tag WHERE book_id = ${id}`;
    for (const tagId of tagIds) {
      await sql`
        INSERT INTO book_tools.book_tag (book_id, tag_id, group_code)
        VALUES (${id}, ${tagId}, ${group_code})
        ON CONFLICT DO NOTHING
      `;
    }
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
