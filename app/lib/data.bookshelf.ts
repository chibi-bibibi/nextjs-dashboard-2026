import postgres from 'postgres';
import { BookRecord, PublisherField, BookForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 20;

export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const books = await sql<BookRecord[]>`
      SELECT
        books.id,
        books.title,
        books.publisher_id,
        publishers.name AS publisher_name,
        books.published_at,
        books.version,
        books.group_code,
        books.memo,
        books.created_at
      FROM book_tools.books
      LEFT JOIN book_tools.publishers ON books.publisher_id = publishers.id
      WHERE
        books.title ILIKE ${`%${query}%`}
      ORDER BY books.created_at DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return books;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch books.');
  }
}

export async function fetchBooksPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(*)
      FROM book_tools.books
      WHERE title ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of books.');
  }
}

export async function fetchBookById(id: string) {
  try {
    const data = await sql<BookForm[]>`
      SELECT id, title, publisher_id, published_at, version, group_code, memo
      FROM book_tools.books
      WHERE id = ${id}
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book.');
  }
}

export async function fetchPublishers() {
  try {
    const data = await sql<PublisherField[]>`
      SELECT id, name FROM book_tools.publishers ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch publishers.');
  }
}
