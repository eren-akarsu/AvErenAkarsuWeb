-- ============================================================
-- Migration: SEO Alanları — contents tablosu
-- Supabase SQL Editor'da çalıştırın.
-- Güvenli ADD COLUMN IF NOT EXISTS kullanılmıştır.
-- ============================================================

-- OpenGraph alanları
ALTER TABLE contents ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT '';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '';

-- Robots direktifleri
ALTER TABLE contents ADD COLUMN IF NOT EXISTS robots_index BOOLEAN DEFAULT TRUE;
ALTER TABLE contents ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN DEFAULT TRUE;

-- Odak anahtar kavram
ALTER TABLE contents ADD COLUMN IF NOT EXISTS focus_keyword TEXT DEFAULT '';

-- Hukuki metadata (JSONB — esnek veri depolama)
ALTER TABLE contents ADD COLUMN IF NOT EXISTS legal_sources JSONB DEFAULT '[]';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS legal_basis JSONB DEFAULT '[]';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS related_laws JSONB DEFAULT '[]';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS related_cases JSONB DEFAULT '[]';

-- Zaman damgaları
ALTER TABLE contents ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- Görsel SEO
ALTER TABLE contents ADD COLUMN IF NOT EXISTS cover_image_alt TEXT DEFAULT '';
ALTER TABLE contents ADD COLUMN IF NOT EXISTS cover_image_caption TEXT DEFAULT '';

-- İçerik versiyonlama
ALTER TABLE contents ADD COLUMN IF NOT EXISTS content_version INTEGER DEFAULT 1;

-- Dil
ALTER TABLE contents ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'tr';

-- ── Precedent Decisions tablosuna da OG ve robots alanları ──
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS og_title TEXT DEFAULT '';
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS og_description TEXT DEFAULT '';
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS og_image_url TEXT DEFAULT '';
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS robots_index BOOLEAN DEFAULT TRUE;
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS robots_follow BOOLEAN DEFAULT TRUE;
ALTER TABLE precedent_decisions ADD COLUMN IF NOT EXISTS cover_image_alt TEXT DEFAULT '';

-- ── Sitemap optimizasyonu için indeksler ──
CREATE INDEX IF NOT EXISTS idx_contents_robots_index ON contents(robots_index) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_pd_robots_index ON precedent_decisions(robots_index) WHERE status = 'published';

-- ── Sitemap için view — yalnızca indekslenebilir yayınlanmış içerikler ──
CREATE OR REPLACE VIEW sitemap_contents AS
SELECT
  id,
  title,
  slug,
  content_type,
  updated_at,
  published_at,
  robots_index,
  robots_follow
FROM contents
WHERE status = 'published'
  AND (robots_index IS NULL OR robots_index = TRUE);

-- ── Notlar ──
-- Bu migration çalıştırıldıktan sonra:
-- 1. src/types/database.ts güncellendi (yeni alanlar eklendi)
-- 2. src/services/contentService.ts güncellendi (SEO alanlarını döndürür)
-- 3. src/services/sitemapService.ts robots_index filtresi çalışır
-- Mevcut veriler: robots_index NULL olacak → NULL != false olduğu için sitemap'e girerler.
-- ============================================================
