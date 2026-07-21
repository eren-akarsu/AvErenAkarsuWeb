import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Content } from '../types/database';
import type { SitemapEntry } from '../types/seo';
import { getSiteUrl } from '../utils/seo';

// ============================================================
// Sitemap Service
// Yalnızca yayınlanmış, indekslenebilir içeriklerin sitemap verisi
// ============================================================

/** Static (sabit) public sayfalar */
const STATIC_PAGES: Omit<SitemapEntry, 'lastmod'>[] = [
  { loc: '/',                              changefreq: 'weekly',  priority: 1.0 },
  { loc: '/hukuki-icerikler',              changefreq: 'daily',   priority: 0.9 },
  { loc: '/hukuki-hesaplama-araclari',     changefreq: 'monthly', priority: 0.7 },
  { loc: '/cerez-politikasi',              changefreq: 'yearly',  priority: 0.2 },
  { loc: '/kvkk-aydinlatma-metni',         changefreq: 'yearly',  priority: 0.2 },
  { loc: '/acik-riza-metni',               changefreq: 'yearly',  priority: 0.2 },
  { loc: '/kullanim-kosullari',            changefreq: 'yearly',  priority: 0.2 },
  { loc: '/sorumluluk-reddi-beyani',       changefreq: 'yearly',  priority: 0.2 },
];

/**
 * Supabase'den sitemap'e dahil edilecek içerikleri çeker.
 * Yalnızca: status='published' ve robots_index=true olan kayıtlar.
 */
export async function getSitemapContents(): Promise<Content[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    let { data, error } = await supabase
      .from('contents')
      .select('id, slug, title, updated_at, published_at, content_type, robots_index')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      // 42703 is undefined_column in PostgreSQL
      if (error.code === '42703' || error.message?.includes('robots_index')) {
        console.warn('[sitemapService] robots_index column not found in DB. Retrying without robots_index...');
        const retryResult = await supabase
          .from('contents')
          .select('id, slug, title, updated_at, published_at, content_type')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (retryResult.error) {
          console.warn('[sitemapService] Graceful fallback fetch failed:', retryResult.error);
          return [];
        }
        data = (retryResult.data || []).map(item => ({ ...item, robots_index: true }));
        error = null;
      } else {
        console.warn('[sitemapService] getSitemapContents error:', error);
        return [];
      }
    }
    
    // JS filter to support existing null values (null is treated as indexable)
    const filtered = (data || []).filter(c => (c as any).robots_index !== false);
    return filtered as Content[];
  } catch (err) {
    console.warn('[sitemapService] getSitemapContents exception:', err);
    return [];
  }
}

/**
 * Sitemap XML string üretir.
 * @param dynamicContents - Supabase'den çekilen içerik listesi
 */
export function generateSitemapXml(dynamicContents: Content[] = []): string {
  const siteUrl = getSiteUrl();
  const now = new Date().toISOString().split('T')[0];

  const entries: SitemapEntry[] = [
    // Statik sayfalar
    ...STATIC_PAGES.map(p => ({
      ...p,
      loc: `${siteUrl}${p.loc}`,
      lastmod: now,
    })),

    // Dinamik içerikler
    ...dynamicContents.map(c => ({
      loc: `${siteUrl}/icerik/${c.slug}`,
      lastmod: c.updated_at
        ? c.updated_at.split('T')[0]
        : (c.published_at ? c.published_at.split('T')[0] : now),
      changefreq: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  const urlElements = entries
    .map(entry => {
      const parts = [
        `    <url>`,
        `      <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `      <lastmod>${entry.lastmod}</lastmod>` : '',
        entry.changefreq ? `      <changefreq>${entry.changefreq}</changefreq>` : '',
        entry.priority !== undefined ? `      <priority>${entry.priority.toFixed(1)}</priority>` : '',
        `    </url>`,
      ]
        .filter(Boolean)
        .join('\n');
      return parts;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Statik sayfalar için basit sitemap XML üretir (Supabase erişimi olmadan).
 * Build scriptleri ve fallback durumları için.
 */
export function generateStaticSitemapXml(siteUrl?: string): string {
  let baseUrl = siteUrl || 'https://www.erenakarsu.av.tr';
  if (baseUrl.includes('vercel.app')) {
    baseUrl = 'https://www.erenakarsu.av.tr';
  }
  const now = new Date().toISOString().split('T')[0];

  const entries = STATIC_PAGES.map(p => ({
    ...p,
    loc: `${baseUrl}${p.loc}`,
    lastmod: now,
  }));

  const urlElements = entries
    .map(entry =>
      [
        `    <url>`,
        `      <loc>${escapeXml(entry.loc)}</loc>`,
        `      <lastmod>${entry.lastmod}</lastmod>`,
        `      <changefreq>${entry.changefreq}</changefreq>`,
        `      <priority>${entry.priority!.toFixed(1)}</priority>`,
        `    </url>`,
      ].join('\n')
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
