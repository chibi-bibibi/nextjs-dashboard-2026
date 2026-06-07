import postgres from 'postgres';
import { BookRecord, PublisherField, BookForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 10;

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
        main_categories.category_no AS main_category_no,
        main_categories.name AS main_category_name,
        sub_categories.category_no AS sub_category_no,
        sub_categories.name AS sub_category_name,
        STRING_AGG(DISTINCT writers.name, '、' ORDER BY writers.name) AS writer_names,
        STRING_AGG(DISTINCT tags.name,    '、' ORDER BY tags.name)    AS tag_names,
        books.memo,
        books.created_at
      FROM book_tools.books
      LEFT JOIN book_tools.publishers      ON books.publisher_id    = publishers.id
      LEFT JOIN book_tools.sub_categories  ON books.sub_category_id = sub_categories.id
      LEFT JOIN book_tools.main_categories ON sub_categories.main_category_id = main_categories.id
      LEFT JOIN book_tools.book_writer     ON books.id              = book_writer.book_id
      LEFT JOIN book_tools.writers         ON book_writer.writer_id  = writers.id
      LEFT JOIN book_tools.book_tag        ON books.id              = book_tag.book_id
      LEFT JOIN tags                       ON book_tag.tag_id        = tags.id
      WHERE
        books.title ILIKE ${`%${query}%`}
      GROUP BY
        books.id,
        publishers.name,
        main_categories.category_no,
        main_categories.name,
        sub_categories.category_no,
        sub_categories.name
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

export async function fetchAuthors() {
  try {
    const data = await sql<PublisherField[]>`
      SELECT id, name FROM book_tools.writers ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authors.');
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
