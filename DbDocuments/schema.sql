CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ALTER: users（既存テーブルにカラム追加）
-- ============================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name_kana  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS name_rome  VARCHAR(255),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- email はすでに UNIQUE 制約があるためインデックス済み

-- ============================================================
-- CREATE: pages
-- ============================================================
CREATE TABLE IF NOT EXISTS pages (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREATE: main_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.main_categories (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_no INT         NOT NULL UNIQUE,
  name        VARCHAR(255) NOT NULL,
  target      VARCHAR(255),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREATE: sub_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.sub_categories (
  id               UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  main_category_id UUID        NOT NULL REFERENCES book_tools.main_categories(id),
  category_no      INT         NOT NULL,
  name             VARCHAR(255) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (main_category_id, category_no)
);

CREATE INDEX IF NOT EXISTS idx_sub_categories_main_category_id
  ON book_tools.sub_categories(main_category_id);

-- ============================================================
-- CREATE: publishers
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.publishers (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  name_kana  VARCHAR(255),
  name_rome  VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREATE: locations
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  name_kana  VARCHAR(255),
  name_rome  VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREATE: writers
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.writers (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  name_kana  VARCHAR(255),
  name_rome  VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREATE: tags
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  name_kana  VARCHAR(255),
  page_id    UUID        NOT NULL REFERENCES pages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, page_id)  -- 同ページ内でタグ名は一意
);

CREATE INDEX IF NOT EXISTS idx_tags_page_id ON tags(page_id);

-- ============================================================
-- CREATE: books
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.books (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  publisher_id    UUID        REFERENCES book_tools.publishers(id),
  published_at    DATE,
  version         VARCHAR(50),
  sub_category_id UUID        REFERENCES book_tools.sub_categories(id),
  memo            TEXT,
  create_user_id  UUID        NOT NULL REFERENCES users(id),
  update_user_id  UUID        NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_title           ON book_tools.books(title);
CREATE INDEX IF NOT EXISTS idx_books_publisher_id    ON book_tools.books(publisher_id);
CREATE INDEX IF NOT EXISTS idx_books_sub_category_id ON book_tools.books(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_books_create_user_id  ON book_tools.books(create_user_id);
CREATE INDEX IF NOT EXISTS idx_books_update_user_id  ON book_tools.books(update_user_id);

-- ============================================================
-- CREATE: book_tag（中間テーブル: books ↔ tags）
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.book_tag (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id    UUID        NOT NULL REFERENCES book_tools.books(id) ON DELETE CASCADE,
  tag_id     UUID        NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_book_tag_book_id ON book_tools.book_tag(book_id);
CREATE INDEX IF NOT EXISTS idx_book_tag_tag_id  ON book_tools.book_tag(tag_id);

-- ============================================================
-- CREATE: book_writer（中間テーブル: books ↔ writers）
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.book_writer (
  id              UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id         UUID        NOT NULL REFERENCES book_tools.books(id)   ON DELETE CASCADE,
  writer_id       UUID        NOT NULL REFERENCES book_tools.writers(id) ON DELETE CASCADE,
  writer_category VARCHAR(100),  -- 例: '著者', '編者', '翻訳者'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, writer_id)
);

CREATE INDEX IF NOT EXISTS idx_book_writer_book_id   ON book_tools.book_writer(book_id);
CREATE INDEX IF NOT EXISTS idx_book_writer_writer_id ON book_tools.book_writer(writer_id);

-- ============================================================
-- CREATE: book_location（中間テーブル: books ↔ locations）
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.book_location (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id     UUID        NOT NULL REFERENCES book_tools.books(id)     ON DELETE CASCADE,
  location_id UUID        NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_book_location_book_id     ON book_tools.book_location(book_id);
CREATE INDEX IF NOT EXISTS idx_book_location_location_id ON book_tools.book_location(location_id);

-- ============================================================
-- CREATE: book_owner（中間テーブル: books ↔ users）
-- ============================================================
CREATE TABLE IF NOT EXISTS book_tools.book_owner (
  id         UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  book_id    UUID        NOT NULL REFERENCES book_tools.books(id) ON DELETE CASCADE,
  owner_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, owner_id)
);

CREATE INDEX IF NOT EXISTS idx_book_owner_book_id  ON book_tools.book_owner(book_id);
CREATE INDEX IF NOT EXISTS idx_book_owner_owner_id ON book_tools.book_owner(owner_id);
