/**
 * Turkish-aware slug generator.
 * Converts Turkish characters to ASCII and produces URL-safe slugs.
 */

const TURKISH_MAP: Record<string, string> = {
  'ç': 'c', 'Ç': 'C',
  'ğ': 'g', 'Ğ': 'G',
  'ı': 'i', 'İ': 'I',
  'ö': 'o', 'Ö': 'O',
  'ş': 's', 'Ş': 'S',
  'ü': 'u', 'Ü': 'U',
  'â': 'a', 'Â': 'A',
  'î': 'i', 'Î': 'I',
  'û': 'u', 'Û': 'U',
};

export function generateSlug(title: string): string {
  if (!title) return '';

  let slug = title.toLowerCase();

  // Replace Turkish characters
  for (const [turkishChar, asciiChar] of Object.entries(TURKISH_MAP)) {
    slug = slug.replaceAll(turkishChar.toLowerCase(), asciiChar.toLowerCase());
  }

  // Replace non-alphanumeric characters with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')  // Remove non-alphanumeric except spaces and hyphens
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens

  return slug;
}

/**
 * Ensures a slug is unique by appending a numeric suffix if needed.
 */
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  let counter = 2;
  let candidateSlug = `${slug}-${counter}`;
  while (existingSlugs.includes(candidateSlug)) {
    counter++;
    candidateSlug = `${slug}-${counter}`;
  }
  return candidateSlug;
}
