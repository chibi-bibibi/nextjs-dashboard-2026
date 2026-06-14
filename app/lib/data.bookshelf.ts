import postgres from 'postgres';
import { BookRecord, PublisherField, BookForm } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ITEMS_PER_PAGE = 8;

type BookFilters = {
  publisherId?: string;
  writerId?: string;
  tagId?: string;
  categoryId?: string;
  subCategoryId?: string;
};

export async function fetchFilteredBooks(query: string, currentPage: number, filters: BookFilters = {}) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const { publisherId, writerId, tagId, categoryId, subCategoryId } = filters;

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
        books.sub_category_id,
        sub_categories.category_no AS sub_category_no,
        sub_categories.name AS sub_category_name,
        STRING_AGG(DISTINCT COALESCE(book_writer.writer_category, '') || '::' || writers.name, '、') AS writer_names,
        STRING_AGG(DISTINCT tags.name,    '、' ORDER BY tags.name)    AS tag_names,
        books.memo,
        books.created_at,
        books.updated_at
      FROM book_tools.books
      LEFT JOIN book_tools.publishers      ON books.publisher_id    = publishers.id
      LEFT JOIN book_tools.sub_categories  ON books.sub_category_id = sub_categories.id
      LEFT JOIN book_tools.main_categories ON sub_categories.main_category_id = main_categories.id
      LEFT JOIN book_tools.book_writer     ON books.id              = book_writer.book_id
      LEFT JOIN book_tools.writers         ON book_writer.writer_id  = writers.id
      LEFT JOIN book_tools.book_tag        ON books.id              = book_tag.book_id
      LEFT JOIN tags                       ON book_tag.tag_id        = tags.id
      WHERE (
        books.title             ILIKE ${`%${query}%`}
        OR publishers.name      ILIKE ${`%${query}%`}
        OR writers.name         ILIKE ${`%${query}%`}
        OR tags.name            ILIKE ${`%${query}%`}
        OR main_categories.name ILIKE ${`%${query}%`}
        OR sub_categories.name  ILIKE ${`%${query}%`}
      )
      ${publisherId    ? sql`AND books.publisher_id = ${publisherId}` : sql``}
      ${writerId      ? sql`AND EXISTS (SELECT 1 FROM book_tools.book_writer bw2 WHERE bw2.book_id = books.id AND bw2.writer_id = ${writerId})` : sql``}
      ${tagId         ? sql`AND EXISTS (SELECT 1 FROM book_tools.book_tag bt2 WHERE bt2.book_id = books.id AND bt2.tag_id = ${tagId})` : sql``}
      ${categoryId    ? sql`AND main_categories.id = ${categoryId}` : sql``}
      ${subCategoryId ? sql`AND books.sub_category_id = ${subCategoryId}` : sql``}
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

export async function fetchBooksPages(query: string, filters: BookFilters = {}) {
  const { publisherId, writerId, tagId, categoryId, subCategoryId } = filters;
  try {
    const data = await sql`
      SELECT COUNT(DISTINCT books.id)
      FROM book_tools.books
      LEFT JOIN book_tools.publishers      ON books.publisher_id    = publishers.id
      LEFT JOIN book_tools.sub_categories  ON books.sub_category_id = sub_categories.id
      LEFT JOIN book_tools.main_categories ON sub_categories.main_category_id = main_categories.id
      LEFT JOIN book_tools.book_writer     ON books.id              = book_writer.book_id
      LEFT JOIN book_tools.writers         ON book_writer.writer_id  = writers.id
      LEFT JOIN book_tools.book_tag        ON books.id              = book_tag.book_id
      LEFT JOIN tags                       ON book_tag.tag_id        = tags.id
      WHERE (
        books.title             ILIKE ${`%${query}%`}
        OR publishers.name      ILIKE ${`%${query}%`}
        OR writers.name         ILIKE ${`%${query}%`}
        OR tags.name            ILIKE ${`%${query}%`}
        OR main_categories.name ILIKE ${`%${query}%`}
        OR sub_categories.name  ILIKE ${`%${query}%`}
      )
      ${publisherId    ? sql`AND books.publisher_id = ${publisherId}` : sql``}
      ${writerId      ? sql`AND EXISTS (SELECT 1 FROM book_tools.book_writer bw2 WHERE bw2.book_id = books.id AND bw2.writer_id = ${writerId})` : sql``}
      ${tagId         ? sql`AND EXISTS (SELECT 1 FROM book_tools.book_tag bt2 WHERE bt2.book_id = books.id AND bt2.tag_id = ${tagId})` : sql``}
      ${categoryId    ? sql`AND main_categories.id = ${categoryId}` : sql``}
      ${subCategoryId ? sql`AND books.sub_category_id = ${subCategoryId}` : sql``}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of books.');
  }
}

export async function fetchAllTags() {
  try {
    const data = await sql<{ id: string; name: string }[]>`
      SELECT id, name FROM tags ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags.');
  }
}

export async function fetchSubCategories() {
  try {
    const data = await sql<{ id: string; name: string; category_no: number; main_category_id: string }[]>`
      SELECT id, name, category_no, main_category_id
      FROM book_tools.sub_categories
      ORDER BY category_no ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch sub categories.');
  }
}

export async function fetchMainCategories() {
  try {
    const data = await sql<{ id: string; name: string; category_no: number }[]>`
      SELECT id, name, category_no FROM book_tools.main_categories ORDER BY category_no ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch main categories.');
  }
}

export async function fetchBookDetail(id: string) {
  try {
    const data = await sql<BookRecord[]>`
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
        books.sub_category_id,
        sub_categories.category_no AS sub_category_no,
        sub_categories.name AS sub_category_name,
        STRING_AGG(DISTINCT COALESCE(book_writer.writer_category, '') || '::' || writers.name, '、') AS writer_names,
        STRING_AGG(DISTINCT tags.name,    '、' ORDER BY tags.name)    AS tag_names,
        books.memo,
        books.created_at,
        books.updated_at
      FROM book_tools.books
      LEFT JOIN book_tools.publishers      ON books.publisher_id    = publishers.id
      LEFT JOIN book_tools.sub_categories  ON books.sub_category_id = sub_categories.id
      LEFT JOIN book_tools.main_categories ON sub_categories.main_category_id = main_categories.id
      LEFT JOIN book_tools.book_writer     ON books.id              = book_writer.book_id
      LEFT JOIN book_tools.writers         ON book_writer.writer_id  = writers.id
      LEFT JOIN book_tools.book_tag        ON books.id              = book_tag.book_id
      LEFT JOIN tags                       ON book_tag.tag_id        = tags.id
      WHERE books.id = ${id}
      GROUP BY
        books.id, publishers.name,
        main_categories.category_no, main_categories.name,
        sub_categories.category_no, sub_categories.name
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book detail.');
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

// ---- Publishers ----

export async function fetchPublishersWithCount(query = '', currentPage = 1) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<{ id: string; name: string; book_count: number; created_at: string }[]>`
      SELECT p.id, p.name, p.created_at,
             COUNT(b.id)::int AS book_count
      FROM book_tools.publishers p
      LEFT JOIN book_tools.books b ON b.publisher_id = p.id
      WHERE p.name ILIKE ${`%${query}%`}
      GROUP BY p.id, p.name, p.created_at
      ORDER BY p.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch publishers.');
  }
}

export async function fetchPublishersPages(query = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) FROM book_tools.publishers
      WHERE name ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch publishers pages.');
  }
}

export async function fetchPublisherById(id: string) {
  try {
    const data = await sql<{ id: string; name: string; book_count: number; created_at: string; updated_at: string | null }[]>`
      SELECT p.id, p.name, p.created_at, p.updated_at,
             COUNT(b.id)::int AS book_count
      FROM book_tools.publishers p
      LEFT JOIN book_tools.books b ON b.publisher_id = p.id
      WHERE p.id = ${id}
      GROUP BY p.id, p.name, p.created_at, p.updated_at
      LIMIT 1
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch publisher.');
  }
}

// ---- Authors / Writers ----

export async function fetchAuthorsWithCount(query = '', currentPage = 1) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<{ id: string; name: string; book_count: number; created_at: string }[]>`
      SELECT w.id, w.name, w.created_at,
             COUNT(bw.book_id)::int AS book_count
      FROM book_tools.writers w
      LEFT JOIN book_tools.book_writer bw ON bw.writer_id = w.id
      WHERE w.name ILIKE ${`%${query}%`}
      GROUP BY w.id, w.name, w.created_at
      ORDER BY w.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authors.');
  }
}

export async function fetchAuthorsPages(query = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) FROM book_tools.writers
      WHERE name ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch authors pages.');
  }
}

export async function fetchAuthorById(id: string) {
  try {
    const data = await sql<{ id: string; name: string; book_count: number; created_at: string; updated_at: string | null }[]>`
      SELECT w.id, w.name, w.created_at, w.updated_at,
             COUNT(bw.book_id)::int AS book_count
      FROM book_tools.writers w
      LEFT JOIN book_tools.book_writer bw ON bw.writer_id = w.id
      WHERE w.id = ${id}
      GROUP BY w.id, w.name, w.created_at, w.updated_at
      LIMIT 1
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch author.');
  }
}

// ---- Tags ----

export async function fetchTagsWithCount(query = '', currentPage = 1) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const data = await sql<{ id: string; name: string; book_count: number; created_at: string }[]>`
      SELECT t.id, t.name, t.created_at,
             COUNT(bt.book_id)::int AS book_count
      FROM tags t
      LEFT JOIN book_tools.book_tag bt ON bt.tag_id = t.id
      WHERE t.name ILIKE ${`%${query}%`}
      GROUP BY t.id, t.name, t.created_at
      ORDER BY t.name ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags.');
  }
}

export async function fetchTagsPages(query = '') {
  try {
    const data = await sql`
      SELECT COUNT(*) FROM tags
      WHERE name ILIKE ${`%${query}%`}
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tags pages.');
  }
}

export async function fetchTagById(id: string) {
  try {
    const data = await sql<{ id: string; name: string; page_id: string; page_name: string | null; book_count: number; created_at: string; updated_at: string | null }[]>`
      SELECT t.id, t.name, t.page_id, t.created_at, t.updated_at,
             p.name AS page_name,
             COUNT(bt.book_id)::int AS book_count
      FROM tags t
      LEFT JOIN pages p ON p.id = t.page_id
      LEFT JOIN book_tools.book_tag bt ON bt.tag_id = t.id
      WHERE t.id = ${id}
      GROUP BY t.id, t.name, t.page_id, t.created_at, t.updated_at, p.name
      LIMIT 1
    `;
    return data[0] ?? null;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch tag.');
  }
}

export async function fetchBookTagIds(bookId: string): Promise<string[]> {
  try {
    const data = await sql<{ tag_id: string }[]>`
      SELECT tag_id FROM book_tools.book_tag WHERE book_id = ${bookId}
    `;
    return data.map((r) => r.tag_id);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book tag ids.');
  }
}

export async function fetchMonthlyBookCounts() {
  try {
    const data = await sql<{ month: string; count: number }[]>`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM') AS month,
        COUNT(*)::int AS count
      FROM book_tools.books
      WHERE created_at >= NOW() - INTERVAL '11 months'
        AND created_at < DATE_TRUNC('month', NOW()) + INTERVAL '1 month'
      GROUP BY month
      ORDER BY month ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch monthly book counts.');
  }
}

export async function fetchBookSummaryData() {
  try {
    const [
      bookCount, authorCount, publisherCount, tagCount,
      recentBooks, topAuthors, topPublishers, topTags,
    ] = await Promise.all([
      sql`SELECT COUNT(*) FROM book_tools.books`,
      sql`SELECT COUNT(*) FROM book_tools.writers`,
      sql`SELECT COUNT(*) FROM book_tools.publishers`,
      sql`SELECT COUNT(DISTINCT tag_id) FROM book_tools.book_tag`,
      sql<{ id: string; title: string; publisher_name: string | null; created_at: string }[]>`
        SELECT b.id, b.title, p.name AS publisher_name, b.created_at
        FROM book_tools.books b
        LEFT JOIN book_tools.publishers p ON b.publisher_id = p.id
        ORDER BY b.created_at DESC
        LIMIT 5
      `,
      sql<{ name: string; count: number }[]>`
        SELECT w.name, COUNT(bw.book_id)::int AS count
        FROM book_tools.writers w
        JOIN book_tools.book_writer bw ON bw.writer_id = w.id
        GROUP BY w.id, w.name
        ORDER BY count DESC
        LIMIT 5
      `,
      sql<{ name: string; count: number }[]>`
        SELECT p.name, COUNT(b.id)::int AS count
        FROM book_tools.publishers p
        JOIN book_tools.books b ON b.publisher_id = p.id
        GROUP BY p.id, p.name
        ORDER BY count DESC
        LIMIT 5
      `,
      sql<{ name: string; count: number }[]>`
        SELECT t.name, COUNT(bt.book_id)::int AS count
        FROM tags t
        JOIN book_tools.book_tag bt ON bt.tag_id = t.id
        GROUP BY t.id, t.name
        ORDER BY count DESC
        LIMIT 5
      `,
    ]);
    return {
      bookCount: Number(bookCount[0].count),
      authorCount: Number(authorCount[0].count),
      publisherCount: Number(publisherCount[0].count),
      tagCount: Number(tagCount[0].count),
      recentBooks,
      topAuthors,
      topPublishers,
      topTags,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch book summary data.');
  }
}

export async function fetchPages() {
  try {
    const data = await sql<{ id: string; name: string }[]>`
      SELECT id, name FROM pages ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pages.');
  }
}
