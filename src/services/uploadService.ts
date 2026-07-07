import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// ============================================================
// Upload Service — Supabase Storage operations
// ============================================================

const MEDIA_BUCKET = 'content-media';
const FILES_BUCKET = 'content-files';

/**
 * Upload a cover image to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadCoverImage(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Cannot upload files.');
  }

  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `cover-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `covers/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('[uploadService] uploadCoverImage error:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Upload a document file (PDF, Word, etc.) to Supabase Storage.
 * Returns the public URL of the uploaded file.
 */
export async function uploadContentFile(file: File): Promise<string> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Cannot upload files.');
  }

  const fileExt = file.name.split('.').pop() || 'pdf';
  const fileName = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `documents/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(FILES_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('[uploadService] uploadContentFile error:', uploadError);
    throw uploadError;
  }

  const { data: urlData } = supabase.storage
    .from(FILES_BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its path.
 */
export async function deleteFile(bucket: string, filePath: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    console.error('[uploadService] deleteFile error:', error);
    throw error;
  }
}
