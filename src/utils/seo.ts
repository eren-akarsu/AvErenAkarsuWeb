// ============================================================
// SEO Utility Functions
// Merkezi site URL, canonical URL ve slug yardımcıları
// ============================================================

/**
 * Ortam değişkeninden site URL'sini döner.
 * Fallback: window.location.origin (development)
 */
export function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://www.erenakarsu.av.tr';
}

/**
 * Verilen path için tam canonical URL üretir.
 * Örnek: getCanonicalUrl('/hukuki-icerikler/makaleler/konu') 
 *        → 'https://www.erenakarsu.av.tr/hukuki-icerikler/makaleler/konu'
 */
export function getCanonicalUrl(path: string): string {
  const base = getSiteUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  // Query parametreleri ve hash kaldır
  const pathOnly = cleanPath.split('?')[0].split('#')[0];
  return `${base}${pathOnly}`;
}

/**
 * OG/Twitter görsel URL'si üretir.
 * Göreli path verildiyse site URL'sine göre tamamlar.
 */
export function buildOgImageUrl(imagePath?: string): string {
  const defaultOgImage = `${getSiteUrl()}/ea-monogram.png`;
  if (!imagePath) return defaultOgImage;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return `${getSiteUrl()}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

/**
 * İçerik slug'ından public URL üretir.
 * Örnek: buildContentUrl('article', 'kidem-tazminati') 
 *        → 'https://www.erenakarsu.av.tr/icerik/kidem-tazminati'
 */
export function buildContentUrl(slug: string): string {
  return getCanonicalUrl(`/icerik/${slug}`);
}

/**
 * Admin/private route'ları için noindex robots değeri döner.
 */
export function getPrivatePageRobots(): string {
  return 'noindex, nofollow';
}

/**
 * Public sayfa için standart robots değeri döner.
 */
export function getPublicPageRobots(): string {
  return 'index, follow';
}

/**
 * SEO başlığı için fallback üretir.
 * seoTitle boşsa: title + " | Av. Eren Akarsu"
 */
export function buildSeoTitle(title?: string, seoTitle?: string): string {
  if (seoTitle && seoTitle.trim()) return seoTitle.trim();
  if (title && title.trim()) return `${title.trim()} | Av. Eren Akarsu`;
  return 'Av. Eren Akarsu | Hukuki Bilgilendirme Platformu';
}

/**
 * Meta description için fallback üretir.
 * metaDesc boşsa: excerpt'ten güvenli kısa özet
 */
export function buildMetaDescription(metaDesc?: string, excerpt?: string, contentBody?: string): string {
  if (metaDesc && metaDesc.trim()) return metaDesc.trim().slice(0, 160);
  if (excerpt && excerpt.trim()) return excerpt.trim().slice(0, 160);
  if (contentBody && contentBody.trim()) {
    return contentBody.trim().replace(/\*\*/g, '').replace(/#{1,6}\s/g, '').slice(0, 157) + '...';
  }
  return 'Hukuki konularda genel bilgilendirme içerikleri. Somut olaylar için profesyonel hukuki danışmanlık alınması önerilir.';
}

/**
 * İçerik tipi → route path eşleştirmesi
 */
export function getContentRoutePath(contentType: string, slug: string): string {
  return getCanonicalUrl(`/icerik/${slug}`);
}

/**
 * Dosya adını SEO uyumlu hale getirir.
 * Türkçe karakterleri dönüştürür, küçük harf ve tireli yapar.
 */
export function sanitizeFileName(name: string, ext = 'webp'): string {
  const TURKISH_MAP: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
  };
  let result = name.toLowerCase();
  for (const [tr, ascii] of Object.entries(TURKISH_MAP)) {
    result = result.replaceAll(tr, ascii);
  }
  result = result
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${result}.${ext}`;
}

/**
 * Verilen route'un private (noindex) olup olmadığını kontrol eder.
 */
export function isPrivateRoute(path: string): boolean {
  const privatePatterns = [
    '/admin',
    '/login',
    '/reset-password',
    '/dashboard',
    '/preview',
    '/payment-success',
    '/payment-failed',
    '/account',
  ];
  return privatePatterns.some(p => path.startsWith(p));
}

/**
 * Tarih string'ini Türkçe formatla döner.
 * '2026-06-15' → '15 Haziran 2026'
 */
export function formatDateTurkish(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
