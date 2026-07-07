import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Content, CreateContentDTO, UpdateContentDTO, ContentType } from '../types/database';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';

// ============================================================
// Content Service — CRUD operations for the contents table
// ============================================================

/**
 * Fetch all published contents, optionally filtered by content_type.
 */
export async function getPublishedContents(type?: ContentType): Promise<Content[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from('contents')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (type) {
    query = query.eq('content_type', type);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[contentService] getPublishedContents error:', error);
    throw error;
  }
  return (data as Content[]) || [];
}

/**
 * Fetch published contents that should appear on the homepage.
 */
export async function getHomepageContents(): Promise<Content[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('status', 'published')
    .eq('show_on_homepage', true)
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[contentService] getHomepageContents error:', error);
    throw error;
  }
  return (data as Content[]) || [];
}

/**
 * Fetch all contents (including drafts) for admin panel.
 */
export async function getAllContents(type?: ContentType): Promise<Content[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from('contents')
    .select('*')
    .neq('status', 'archived')
    .order('updated_at', { ascending: false });

  if (type) {
    query = query.eq('content_type', type);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[contentService] getAllContents error:', error);
    throw error;
  }
  return (data as Content[]) || [];
}

/**
 * Fetch a single content by its slug.
 */
export async function getContentBySlug(slug: string): Promise<Content | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('[contentService] getContentBySlug error:', error);
    throw error;
  }
  return data as Content;
}

/**
 * Fetch a single content by its ID.
 */
export async function getContentById(id: string): Promise<Content | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('contents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[contentService] getContentById error:', error);
    throw error;
  }
  return data as Content;
}

/**
 * Create a new content entry.
 */
export async function createContent(dto: CreateContentDTO): Promise<Content> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  // Generate unique slug
  const baseSlug = generateSlug(dto.title);
  const { data: existingSlugs } = await supabase
    .from('contents')
    .select('slug');
  const slugList = (existingSlugs || []).map((r: { slug: string }) => r.slug);
  const slug = ensureUniqueSlug(baseSlug, slugList);

  const record = {
    ...dto,
    slug,
    published_at: dto.status === 'published' ? new Date().toISOString() : dto.published_at,
  };

  const { data, error } = await supabase
    .from('contents')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error('[contentService] createContent error:', error);
    throw error;
  }
  return data as Content;
}

/**
 * Update an existing content entry.
 */
export async function updateContent(id: string, dto: UpdateContentDTO): Promise<Content> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  // Re-generate slug if title changed
  const updates: UpdateContentDTO = { ...dto };
  if (dto.title) {
    const baseSlug = generateSlug(dto.title);
    const { data: existingSlugs } = await supabase
      .from('contents')
      .select('slug')
      .neq('id', id);
    const slugList = (existingSlugs || []).map((r: { slug: string }) => r.slug);
    updates.slug = ensureUniqueSlug(baseSlug, slugList);
  }

  // Set published_at when publishing for the first time
  if (dto.status === 'published' && !dto.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('contents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[contentService] updateContent error:', error);
    throw error;
  }
  return data as Content;
}

/**
 * Soft-delete (archive) a content entry.
 */
export async function deleteContent(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  const { error } = await supabase
    .from('contents')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    console.error('[contentService] deleteContent error:', error);
    throw error;
  }
}

/**
 * Publish a content entry.
 */
export async function publishContent(id: string): Promise<Content> {
  return updateContent(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}

/**
 * Increment view count.
 */
export async function incrementViewCount(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase.rpc('increment_view_count', { row_id: id });
  if (error) {
    // Fallback: fetch-then-update if RPC doesn't exist
    const { data } = await supabase
      .from('contents')
      .select('view_count')
      .eq('id', id)
      .single();
    if (data) {
      await supabase
        .from('contents')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);
    }
  }
}
