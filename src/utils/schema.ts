// ============================================================
// JSON-LD Schema Builder Utilities
// Av. Eren Akarsu — Hukuki içerik platformu için
//
// UYARI: Bu schema'larda doğrulanmamış iddia, rating, yorum,
// "en iyi avukat" veya garantili sonuç ifadesi BULUNMAMALIDIR.
// İçerikler TBB meslek kurallarına ve reklam yasağına uygundur.
// ============================================================

import { getSiteUrl, buildOgImageUrl } from './seo';
import type { BreadcrumbItem, JsonLdSchema } from '../types/seo';

const AUTHOR_NAME = 'Av. Eren Akarsu';
const PUBLISHER_NAME = 'Av. Eren Akarsu';

/**
 * WebSite schema — Ana sayfa için
 */
export function buildWebSiteSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Av. Eren Akarsu — Hukuki Bilgilendirme Platformu',
    url: siteUrl,
    inLanguage: 'tr',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/hukuki-icerikler?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Person schema — Avukat profili için
 * NOT: Abartılı veya reklamcı ifade içermez.
 */
export function buildPersonSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: AUTHOR_NAME,
    jobTitle: 'Avukat',
    description:
      'İstanbul Barosu üyesi avukat. Hukuk Fakültesi ve Yazılım Mühendisliği çift lisans mezunu. Bilişim hukuku, ceza hukuku, iş hukuku ve aile hukuku alanlarında faaliyet göstermektedir.',
    url: siteUrl,
    sameAs: [
      'https://www.linkedin.com/in/erenakarsu/',
      'https://instagram.com/av.erenakarsu',
    ],
    memberOf: {
      '@type': 'Organization',
      name: 'İstanbul Barosu',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'İstanbul Okan Üniversitesi Hukuk Fakültesi',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'İstanbul Okan Üniversitesi Yazılım Mühendisliği',
      },
    ],
  };
}

/**
 * Article schema — Hukuki içerik detay sayfaları için
 * NOT: Hukuki bilgilendirme amacı öne çıkarılır; reklam niteliği taşımaz.
 */
export function buildArticleSchema(params: {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
}): JsonLdSchema {
  const siteUrl = getSiteUrl();
  const image = buildOgImageUrl(params.imageUrl);

  const schema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.title,
    description: params.description,
    url: params.url,
    inLanguage: 'tr',
    author: {
      '@type': 'Person',
      name: params.authorName || AUTHOR_NAME,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: PUBLISHER_NAME,
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': params.url,
    },
  };

  if (image) {
    (schema as any).image = {
      '@type': 'ImageObject',
      url: image,
    };
  }
  if (params.publishedAt) {
    (schema as any).datePublished = params.publishedAt;
  }
  if (params.updatedAt) {
    (schema as any).dateModified = params.updatedAt;
  }

  return schema;
}

/**
 * BreadcrumbList schema — Detay sayfaları için
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): JsonLdSchema {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href.startsWith('/') ? '' : '/'}${item.href}` } : {}),
    })),
  };
}

/**
 * LegalService schema — İletişim / Hizmetler sayfası için
 * NOT: Yalnızca nesnel, bilgilendirici bilgiler içerir.
 * Garantili sonuç veya üstünlük iddiası içermez.
 */
export function buildLegalServiceSchema(): JsonLdSchema {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Av. Eren Akarsu Hukuk Bürosu',
    description:
      'Bilişim hukuku, ceza hukuku, iş hukuku, aile hukuku ve ticaret hukuku alanlarında hukuki danışmanlık ve dava takibi hizmetleri sunulmaktadır.',
    url: siteUrl,
    areaServed: {
      '@type': 'Place',
      name: 'İstanbul, Türkiye',
    },
    inLanguage: 'tr',
    serviceType: 'Hukuki Danışmanlık',
  };
}

/**
 * Birden fazla schema'yı tek @graph içinde birleştirir
 */
export function combineSchemas(...schemas: JsonLdSchema[]): JsonLdSchema {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas.map(s => {
      // @context'i iç schema'lardan kaldır (dışarıda zaten var)
      const { '@context': _ctx, ...rest } = s as any;
      return rest;
    }),
  };
}

/**
 * JSON-LD schema'yı güvenli biçimde stringify eder.
 * undefined/null değerlerini filtreler.
 */
export function safeStringifySchema(schema: JsonLdSchema | JsonLdSchema[]): string {
  try {
    return JSON.stringify(schema, (_key, value) => {
      if (value === null || value === undefined) return undefined;
      return value;
    });
  } catch {
    return '{}';
  }
}
