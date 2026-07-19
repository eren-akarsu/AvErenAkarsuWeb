/**
 * Sitemap Generator Script
 * Build sonrası çalışır ve public/sitemap.xml üretir.
 * Supabase erişimi yoksa statik sayfa listesiyle üretir.
 *
 * Kullanım: node scripts/generate-sitemap.mjs
 * package.json build script: "build": "tsc -b && vite build && node scripts/generate-sitemap.mjs"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// .env dosyasından VITE_SITE_URL oku
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    result[key] = val;
  }
  return result;
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function main() {
  const env = {
    ...process.env,
    ...loadEnv()
  };
  const siteUrl = (env['VITE_SITE_URL'] || 'https://av-eren-akarsu-web.vercel.app').replace(/\/$/, '');
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/',                              changefreq: 'weekly',  priority: 1.0 },
    { loc: '/hukuki-icerikler',              changefreq: 'daily',   priority: 0.9 },
    { loc: '/hukuki-hesaplama-araclari',     changefreq: 'monthly', priority: 0.7 },
    { loc: '/cerez-politikasi',              changefreq: 'yearly',  priority: 0.2 },
    { loc: '/kvkk-aydinlatma-metni',         changefreq: 'yearly',  priority: 0.2 },
    { loc: '/acik-riza-metni',               changefreq: 'yearly',  priority: 0.2 },
    { loc: '/kullanim-kosullari',            changefreq: 'yearly',  priority: 0.2 },
    { loc: '/sorumluluk-reddi-beyani',       changefreq: 'yearly',  priority: 0.2 },
  ];

  // Supabase'den yayınlanmış içerikleri çekmeye çalış
  let dynamicEntries = [];
  const supabaseUrl = env['VITE_SUPABASE_URL'];
  const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

  if (supabaseUrl && supabaseKey) {
    try {
      let response = await fetch(
        `${supabaseUrl}/rest/v1/contents?select=slug,updated_at,published_at,robots_index&status=eq.published&order=published_at.desc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        const errorText = await response.text();
        if (errorText.includes('column contents.robots_index does not exist')) {
          console.log('[sitemap] robots_index column not found in DB. Retrying without robots_index...');
          response = await fetch(
            `${supabaseUrl}/rest/v1/contents?select=slug,updated_at,published_at&status=eq.published&order=published_at.desc`,
            {
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.ok) {
            data = await response.json();
          } else {
            console.warn('[sitemap] Fallback Supabase fetch failed:', await response.text());
          }
        } else {
          console.warn(`[sitemap] Supabase fetch failed with status ${response.status} ${response.statusText}:`, errorText);
        }
      }

      if (data) {
        // Filter in JS to support both true and null (existing items) and exclude false
        const filteredData = data.filter(c => c.robots_index !== false);
        
        dynamicEntries = filteredData.map(c => ({
          loc: `${siteUrl}/icerik/${c.slug}`,
          lastmod: c.updated_at
            ? c.updated_at.split('T')[0]
            : c.published_at
              ? c.published_at.split('T')[0]
              : now,
          changefreq: 'monthly',
          priority: 0.8,
        }));
        console.log(`[sitemap] Supabase'den ${dynamicEntries.length} içerik çekildi.`);
      }
    } catch (err) {
      console.warn('[sitemap] Supabase erişim hatası, statik sayfa listesi kullanılıyor:', err.stack || err.message);
    }
  }

  const allEntries = [
    ...staticPages.map(p => ({
      ...p,
      loc: `${siteUrl}${p.loc}`,
      lastmod: now,
    })),
    ...dynamicEntries,
  ];

  const urlElements = allEntries
    .map(entry =>
      [
        `  <url>`,
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${entry.lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${Number(entry.priority).toFixed(1)}</priority>`,
        `  </url>`,
      ].join('\n')
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  // dist/ klasörüne yaz (Vercel deploy root)
  const distPath = path.join(ROOT, 'dist');
  if (fs.existsSync(distPath)) {
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), xml, 'utf-8');
    console.log(`[sitemap] dist/sitemap.xml oluşturuldu. ${allEntries.length} URL.`);
  }

  // public/ klasörüne de yaz (geliştirme ortamı için)
  const publicPath = path.join(ROOT, 'public');
  fs.writeFileSync(path.join(publicPath, 'sitemap.xml'), xml, 'utf-8');
  console.log(`[sitemap] public/sitemap.xml oluşturuldu. ${allEntries.length} URL.`);
}

main().catch(err => {
  console.error('[sitemap] Script hatası:', err);
  process.exit(1);
});
