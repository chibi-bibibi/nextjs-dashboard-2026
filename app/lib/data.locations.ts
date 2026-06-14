import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 15;

export type Location = {
  id: string;
  name: string;
  name_kana: string | null;
  name_rome: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchLocations(query = '', currentPage = 1) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<Location[]>`
      SELECT id, name, name_kana, name_rome, created_at, updated_at
      FROM locations
      WHERE name      ILIKE ${`%${query}%`}
         OR name_kana ILIKE ${`%${query}%`}
         OR name_rome ILIKE ${`%${query}%`}
      ORDER BY name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch locations.');
  }
}

export async function fetchLocationsPages(query = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) FROM locations
      WHERE name      ILIKE ${`%${query}%`}
         OR name_kana ILIKE ${`%${query}%`}
         OR name_rome ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch locations pages.');
  }
}

export async function fetchLocationById(id: string) {
  try {
    const data = await sql<Location[]>`
      SELECT id, name, name_kana, name_rome, created_at, updated_at
      FROM locations
      WHERE id = ${id}
      LIMIT 1
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch location.');
  }
}
