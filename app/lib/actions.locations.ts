'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@/auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const LOCATIONS_PATH = '/locations';

export type LocationState = {
  errors?: { name?: string[] };
  message?: string | null;
};

const LocationSchema = z.object({
  name:      z.string().min(1, { message: '場所名を入力してください。' }).max(255),
  name_kana: z.string().max(255).optional(),
  name_rome: z.string().max(255).optional(),
});

async function getGroupCode() {
  const session = await auth();
  return session?.user?.group_code ?? null;
}

function nullIfEmpty(v: FormDataEntryValue | null) {
  return v === '' || v === null ? null : String(v);
}

export async function createLocation(_prev: LocationState, formData: FormData): Promise<LocationState> {
  const validated = LocationSchema.safeParse({
    name:      formData.get('name'),
    name_kana: formData.get('name_kana') ?? '',
    name_rome: formData.get('name_rome') ?? '',
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    const group_code = await getGroupCode();
    const { name, name_kana, name_rome } = validated.data;
    await sql`
      INSERT INTO locations (name, name_kana, name_rome, group_code)
      VALUES (${name}, ${nullIfEmpty(name_kana ?? null)}, ${nullIfEmpty(name_rome ?? null)}, ${group_code})
    `;
  } catch {
    return { message: 'データベースエラー：登録に失敗しました。' };
  }
  revalidatePath(LOCATIONS_PATH);
  redirect(LOCATIONS_PATH);
}

export async function updateLocation(id: string, _prev: LocationState, formData: FormData): Promise<LocationState> {
  const validated = LocationSchema.safeParse({
    name:      formData.get('name'),
    name_kana: formData.get('name_kana') ?? '',
    name_rome: formData.get('name_rome') ?? '',
  });
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: '入力内容を確認してください。' };
  }
  try {
    const { name, name_kana, name_rome } = validated.data;
    await sql`
      UPDATE locations SET
        name       = ${name},
        name_kana  = ${nullIfEmpty(name_kana ?? null)},
        name_rome  = ${nullIfEmpty(name_rome ?? null)},
        updated_at = NOW()
      WHERE id = ${id}
    `;
  } catch {
    return { message: 'データベースエラー：更新に失敗しました。' };
  }
  revalidatePath(LOCATIONS_PATH);
  redirect(LOCATIONS_PATH);
}

export async function deleteLocation(id: string) {
  try {
    await sql`DELETE FROM locations WHERE id = ${id}`;
  } catch {
    throw new Error('削除に失敗しました。');
  }
  revalidatePath(LOCATIONS_PATH);
}
