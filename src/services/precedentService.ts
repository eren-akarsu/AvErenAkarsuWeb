import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { PrecedentDecisionDB, CreatePrecedentDTO, UpdatePrecedentDTO } from '../types/database';
import { generateSlug, ensureUniqueSlug } from '../utils/slug';

// ============================================================
// Precedent Decision Service
// ============================================================

export async function getPublishedPrecedentDecisions(): Promise<PrecedentDecisionDB[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('precedent_decisions')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[precedentService] getPublished error:', error);
    throw error;
  }
  return (data as PrecedentDecisionDB[]) || [];
}

export async function getHomepagePrecedentDecisions(): Promise<PrecedentDecisionDB[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('precedent_decisions')
    .select('*')
    .eq('status', 'published')
    .eq('show_on_homepage', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('[precedentService] getHomepage error:', error);
    throw error;
  }
  return (data as PrecedentDecisionDB[]) || [];
}

export async function getAllPrecedentDecisions(): Promise<PrecedentDecisionDB[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from('precedent_decisions')
    .select('*')
    .neq('status', 'archived')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[precedentService] getAll error:', error);
    throw error;
  }
  return (data as PrecedentDecisionDB[]) || [];
}

export async function getPrecedentDecisionBySlug(slug: string): Promise<PrecedentDecisionDB | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('precedent_decisions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[precedentService] getBySlug error:', error);
    throw error;
  }
  return data as PrecedentDecisionDB;
}

export async function getPrecedentDecisionById(id: string): Promise<PrecedentDecisionDB | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await supabase
    .from('precedent_decisions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[precedentService] getById error:', error);
    throw error;
  }
  return data as PrecedentDecisionDB;
}

export async function createPrecedentDecision(dto: CreatePrecedentDTO): Promise<PrecedentDecisionDB> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  const baseSlug = generateSlug(dto.title);
  const { data: existing } = await supabase
    .from('precedent_decisions')
    .select('slug');
  const slugList = (existing || []).map((r: { slug: string }) => r.slug);
  const slug = ensureUniqueSlug(baseSlug, slugList);

  const record = {
    ...dto,
    slug,
    published_at: dto.status === 'published' ? new Date().toISOString() : dto.published_at,
  };

  const { data, error } = await supabase
    .from('precedent_decisions')
    .insert(record)
    .select()
    .single();

  if (error) {
    console.error('[precedentService] create error:', error);
    throw error;
  }
  return data as PrecedentDecisionDB;
}

export async function updatePrecedentDecision(id: string, dto: UpdatePrecedentDTO): Promise<PrecedentDecisionDB> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  const updates: UpdatePrecedentDTO = { ...dto };
  if (dto.title) {
    const baseSlug = generateSlug(dto.title);
    const { data: existing } = await supabase
      .from('precedent_decisions')
      .select('slug')
      .neq('id', id);
    const slugList = (existing || []).map((r: { slug: string }) => r.slug);
    updates.slug = ensureUniqueSlug(baseSlug, slugList);
  }

  if (dto.status === 'published' && !dto.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('precedent_decisions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[precedentService] update error:', error);
    throw error;
  }
  return data as PrecedentDecisionDB;
}

export async function deletePrecedentDecision(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error('Supabase is not configured');

  const { error } = await supabase
    .from('precedent_decisions')
    .update({ status: 'archived' })
    .eq('id', id);

  if (error) {
    console.error('[precedentService] delete error:', error);
    throw error;
  }
}

export async function publishPrecedentDecision(id: string): Promise<PrecedentDecisionDB> {
  return updatePrecedentDecision(id, {
    status: 'published',
    published_at: new Date().toISOString(),
  });
}
