// ============================================================
// SEO TypeScript Types
// ============================================================

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'profile';
  ogSiteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  robots?: string;
  jsonLd?: JsonLdSchema | JsonLdSchema[];
  lang?: string;
  /** noindex + nofollow kısayolu */
  noIndex?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type JsonLdSchema = Record<string, unknown>;

export interface SeoContentData {
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  focusKeyword: string;
  coverImageAlt: string;
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}
