-- ============================================================
-- Avukat Eren Akarsu — Site Settings Table Schema
-- ============================================================
-- Run this SQL in the Supabase SQL Editor to manage global settings.
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  id                      UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid CHECK (id = '00000000-0000-0000-0000-000000000001'::uuid),
  general_settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact_settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
  blog_settings           JSONB NOT NULL DEFAULT '{}'::jsonb,
  legal_content_settings  JSONB NOT NULL DEFAULT '{}'::jsonb,
  appointment_settings    JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_settings             JSONB NOT NULL DEFAULT '{}'::jsonb,
  notification_settings   JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_settings          JSONB NOT NULL DEFAULT '{}'::jsonb,
  legal_pages_settings    JSONB NOT NULL DEFAULT '{}'::jsonb,
  footer_settings         JSONB NOT NULL DEFAULT '{}'::jsonb,
  homepage_settings       JSONB NOT NULL DEFAULT '{}'::jsonb,
  developer_settings      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC SELECT POLICY
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT
  USING (true);

-- 2. ADMIN POLICY FOR ALL ACTIONS
CREATE POLICY "Admin can modify site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at field trigger
CREATE OR REPLACE FUNCTION update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_settings_updated_at();

-- Insert default placeholder if not exists
INSERT INTO site_settings (id) 
VALUES ('00000000-0000-0000-0000-000000000001'::uuid)
ON CONFLICT (id) DO NOTHING;
