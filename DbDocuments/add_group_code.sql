-- ============================================================
-- 全テーブルに group_code カラムを追加
-- ============================================================
ALTER TABLE users           ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE pages           ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.publishers      ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE locations       ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.writers         ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE tags            ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.books           ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.book_tag        ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.book_writer     ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.book_location   ADD COLUMN IF NOT EXISTS group_code CHAR(8);
ALTER TABLE book_tools.book_owner      ADD COLUMN IF NOT EXISTS group_code CHAR(8);
