-- ============================================================
-- Avukat Eren Akarsu — Supabase Database Schema
-- ============================================================
-- Run this SQL in the Supabase SQL Editor to create tables,
-- indexes, RLS policies, and storage buckets.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. CONTENTS TABLE (unified for all content types)
-- ============================================================
CREATE TABLE IF NOT EXISTS contents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  excerpt         TEXT DEFAULT '',
  content_body    TEXT DEFAULT '',
  content_type    TEXT NOT NULL CHECK (content_type IN (
    'document_template', 'article', 'legal_review',
    'precedent_decision', 'case_law_analysis',
    'professional_note', 'legal_calculator'
  )),
  category        TEXT DEFAULT '',
  sub_category    TEXT DEFAULT '',
  tags            TEXT[] DEFAULT '{}',
  cover_image_url TEXT DEFAULT '',
  author          TEXT DEFAULT 'Av. Eren Akarsu',
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  is_featured     BOOLEAN DEFAULT FALSE,
  show_on_homepage      BOOLEAN DEFAULT FALSE,
  show_on_legal_contents BOOLEAN DEFAULT TRUE,
  allow_comments  BOOLEAN DEFAULT TRUE,
  download_enabled BOOLEAN DEFAULT FALSE,
  reading_time    TEXT DEFAULT '',
  view_count      INTEGER DEFAULT 0,
  like_count      INTEGER DEFAULT 0,
  sort_order      INTEGER DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  -- SEO fields
  seo_title       TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  seo_keywords    TEXT DEFAULT '',
  canonical_url   TEXT DEFAULT '',
  -- Document-specific fields
  doc_type        TEXT DEFAULT '',
  doc_law_area    TEXT DEFAULT '',
  doc_file_url    TEXT DEFAULT '',
  doc_warning_text TEXT DEFAULT '',
  -- Article-specific fields
  article_abstract    TEXT DEFAULT '',
  article_law_articles TEXT DEFAULT '',
  article_precedents  TEXT DEFAULT '',
  article_bibliography TEXT DEFAULT '',
  article_auto_toc    BOOLEAN DEFAULT FALSE,
  article_scroll_progress BOOLEAN DEFAULT FALSE,
  -- Legal calculator-specific fields
  calc_type       TEXT DEFAULT '',
  calc_warning    TEXT DEFAULT '',
  calc_order      INTEGER DEFAULT 1
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(content_type);
CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents(slug);
CREATE INDEX IF NOT EXISTS idx_contents_homepage ON contents(show_on_homepage) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_contents_published_at ON contents(published_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 2. PRECEDENT DECISIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS precedent_decisions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  court_name        TEXT DEFAULT '',
  esas_no           TEXT DEFAULT '',
  karar_no          TEXT DEFAULT '',
  decision_date     DATE,
  legal_area        TEXT DEFAULT '',
  decision_type     TEXT DEFAULT '',
  category          TEXT DEFAULT '',
  tags              TEXT[] DEFAULT '{}',
  keywords          TEXT DEFAULT '',
  short_summary     TEXT DEFAULT '',
  important_points  TEXT DEFAULT '',
  full_decision_text TEXT DEFAULT '',
  legal_commentary  TEXT DEFAULT '',
  related_laws      TEXT DEFAULT '',
  conclusion        TEXT DEFAULT '',
  cover_image_url   TEXT DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured       BOOLEAN DEFAULT FALSE,
  show_on_homepage  BOOLEAN DEFAULT FALSE,
  show_on_legal_contents BOOLEAN DEFAULT TRUE,
  sort_order        INTEGER DEFAULT 0,
  view_count        INTEGER DEFAULT 0,
  like_count        INTEGER DEFAULT 0,
  published_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  seo_title         TEXT DEFAULT '',
  seo_description   TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_pd_status ON precedent_decisions(status);
CREATE INDEX IF NOT EXISTS idx_pd_slug ON precedent_decisions(slug);
CREATE INDEX IF NOT EXISTS idx_pd_homepage ON precedent_decisions(show_on_homepage) WHERE status = 'published';

CREATE TRIGGER pd_updated_at
  BEFORE UPDATE ON precedent_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. CONTENT FILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS content_files (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id  UUID REFERENCES contents(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_type   TEXT DEFAULT '',
  file_size   BIGINT DEFAULT 0,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cf_content_id ON content_files(content_id);

-- ============================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE precedent_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_files ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ: Anyone can read published content
CREATE POLICY "Public can read published contents"
  ON contents FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read published precedent decisions"
  ON precedent_decisions FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can read files of published content"
  ON content_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM contents
      WHERE contents.id = content_files.content_id
      AND contents.status = 'published'
    )
  );

-- ADMIN READ ALL: Authenticated users can read everything
CREATE POLICY "Admin can read all contents"
  ON contents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can read all precedent decisions"
  ON precedent_decisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can read all files"
  ON content_files FOR SELECT
  TO authenticated
  USING (true);

-- ADMIN WRITE: Only authenticated users can insert/update/delete
CREATE POLICY "Admin can insert contents"
  ON contents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update contents"
  ON contents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete contents"
  ON contents FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert precedent decisions"
  ON precedent_decisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can update precedent decisions"
  ON precedent_decisions FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can delete precedent decisions"
  ON precedent_decisions FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert files"
  ON content_files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can delete files"
  ON content_files FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 5. STORAGE BUCKETS (run in Supabase Dashboard or via API)
-- ============================================================
-- Note: Storage buckets are typically created via the Supabase
-- Dashboard UI. Create these two buckets manually:
--
--   1. "content-media"  (Public bucket — for cover images)
--   2. "content-files"  (Public bucket — for downloadable documents)
--
-- Set their policies to allow authenticated uploads and public reads.

-- ============================================================
-- 6. OPTIONAL: Seed data (demo emsal kararlar)
-- ============================================================
-- Uncomment and run if you want initial demo data:
/*
INSERT INTO precedent_decisions (title, slug, court_name, esas_no, karar_no, decision_date, legal_area, category, tags, short_summary, full_decision_text, status, is_featured, show_on_homepage, show_on_legal_contents, sort_order, published_at)
VALUES
(
  'Kıdem Tazminatında Yol ve Yemek Yardımı Dahiliyeti',
  'kidem-tazminatinda-yol-ve-yemek-yardimi-dahiliyeti',
  'Yargıtay Hukuk Genel Kurulu',
  '2025/12-344 Esas',
  '2026/89 Karar',
  '2026-02-15',
  'İş Hukuku',
  'İş Hukuku',
  ARRAY['İş Hukuku', 'Kıdem Tazminatı', 'Giydirilmiş Ücret'],
  'İşçi tarafından haklı nedenle yapılan fesihte kıdem tazminatı giydirilmiş brüt ücretinin hesabında süreklilik arz eden ayni ve nakdi yardımların tam olarak dahil edilmesi gerektiği kararı.',
  'Kıdem tazminatının hesabında işçiye ödenen brüt ücrete ek olarak süreklilik gösteren para veya para ile ölçülmesi mümkün menfaatlerin de dikkate alınması İş Kanunu''nun emredici hükümlerindendir.',
  'published',
  true,
  true,
  true,
  1,
  NOW()
);
*/
