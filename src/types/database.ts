// ============================================================
// Database TypeScript Types for Supabase Tables
// ============================================================

// --- Content Status & Type Enums ---
export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type ContentType =
  | 'document_template'
  | 'article'
  | 'legal_review'
  | 'precedent_decision'
  | 'case_law_analysis'
  | 'professional_note'
  | 'legal_calculator';

export type PrecedentStatus = 'draft' | 'published' | 'archived';

// --- Content (Unified Table) ---
export interface Content {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_body: string;
  content_type: ContentType;
  category: string;
  sub_category: string;
  tags: string[];
  cover_image_url: string;
  cover_image_alt?: string;
  cover_image_caption?: string;
  author: string;
  status: ContentStatus;
  is_featured: boolean;
  show_on_homepage: boolean;
  show_on_legal_contents: boolean;
  allow_comments: boolean;
  download_enabled: boolean;
  reading_time: string;
  view_count: number;
  like_count: number;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // SEO temel alanlar (schema.sql'de zaten var)
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  canonical_url: string;
  // SEO genişletilmiş alanlar (migration ile eklendi)
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  focus_keyword?: string;
  legal_sources?: unknown[];
  legal_basis?: unknown[];
  related_laws?: unknown[];
  related_cases?: unknown[];
  reviewed_at?: string | null;
  content_version?: number;
  language?: string;
  // Document-specific
  doc_type: string;
  doc_law_area: string;
  doc_file_url: string;
  doc_warning_text: string;
  // Article-specific
  article_abstract: string;
  article_law_articles: string;
  article_precedents: string;
  article_bibliography: string;
  article_auto_toc: boolean;
  article_scroll_progress: boolean;
  // Calculator-specific
  calc_type: string;
  calc_warning: string;
  calc_order: number;
}


// --- Precedent Decision ---
export interface PrecedentDecisionDB {
  id: string;
  title: string;
  slug: string;
  court_name: string;
  esas_no: string;
  karar_no: string;
  decision_date: string | null;
  legal_area: string;
  decision_type: string;
  category: string;
  tags: string[];
  keywords: string;
  short_summary: string;
  important_points: string;
  full_decision_text: string;
  legal_commentary: string;
  related_laws: string;
  conclusion: string;
  cover_image_url: string;
  status: PrecedentStatus;
  is_featured: boolean;
  show_on_homepage: boolean;
  show_on_legal_contents: boolean;
  sort_order: number;
  view_count: number;
  like_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  seo_title: string;
  seo_description: string;
}

// --- Content File ---
export interface ContentFile {
  id: string;
  content_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  description: string;
  created_at: string;
}

// --- DTO Types (for creating/updating) ---
export type CreateContentDTO = Omit<Content, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count'>;
export type UpdateContentDTO = Partial<Omit<Content, 'id' | 'created_at'>>;

export type CreatePrecedentDTO = Omit<PrecedentDecisionDB, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'like_count'>;
export type UpdatePrecedentDTO = Partial<Omit<PrecedentDecisionDB, 'id' | 'created_at'>>;
