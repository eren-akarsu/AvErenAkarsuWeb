import React from 'react';
import { Helmet } from 'react-helmet-async';
import type { SEOProps } from '../../types/seo';
import { getSiteUrl, buildOgImageUrl, getPrivatePageRobots, getPublicPageRobots } from '../../utils/seo';
import { safeStringifySchema } from '../../utils/schema';

const SITE_NAME = 'Av. Eren Akarsu';
const DEFAULT_TITLE = 'Av. Eren Akarsu | Hukuki Bilgilendirme Platformu';
const DEFAULT_DESCRIPTION =
  'Hukuki konularda genel bilgilendirme içerikleri. Bilişim hukuku, ceza hukuku, iş hukuku, aile hukuku ve ticaret hukuku alanlarında güncel içerikler.';

/**
 * Merkezi SEO head component.
 * Her public sayfada title, description, canonical, OG ve JSON-LD yönetir.
 * Admin/private sayfalar için noIndex={true} kullanın.
 *
 * Örnek kullanım:
 * <SEOHead
 *   title="Makale Başlığı | Av. Eren Akarsu"
 *   description="Makale özeti..."
 *   canonical="/hukuki-icerikler/makaleler/konu-slug"
 *   ogType="article"
 *   jsonLd={articleSchema}
 * />
 */
export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  ogSiteName = SITE_NAME,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  robots,
  jsonLd,
  lang = 'tr',
  noIndex = false,
}) => {
  const siteUrl = getSiteUrl();

  // Title
  const resolvedTitle = title?.trim() || DEFAULT_TITLE;

  // Description
  const resolvedDesc = description?.trim() || DEFAULT_DESCRIPTION;

  // Canonical
  const resolvedCanonical = canonical
    ? canonical.startsWith('http')
      ? canonical
      : `${siteUrl}${canonical.startsWith('/') ? '' : '/'}${canonical}`
    : typeof window !== 'undefined'
      ? window.location.href.split('?')[0].split('#')[0]
      : siteUrl;

  // Robots
  const resolvedRobots = noIndex
    ? getPrivatePageRobots()
    : robots || getPublicPageRobots();

  // OG
  const resolvedOgTitle = ogTitle?.trim() || resolvedTitle;
  const resolvedOgDesc = ogDescription?.trim() || resolvedDesc;
  const resolvedOgImage = buildOgImageUrl(ogImage);
  const resolvedOgUrl = ogUrl || resolvedCanonical;

  // Twitter
  const resolvedTwTitle = twitterTitle?.trim() || resolvedOgTitle;
  const resolvedTwDesc = twitterDescription?.trim() || resolvedOgDesc;
  const resolvedTwImage = twitterImage || resolvedOgImage;

  // JSON-LD serialization
  const jsonLdString = jsonLd ? safeStringifySchema(jsonLd) : null;

  return (
    <Helmet>
      {/* Lang */}
      <html lang={lang} />

      {/* Title */}
      <title>{resolvedTitle}</title>

      {/* Core meta */}
      <meta name="description" content={resolvedDesc} />
      <meta name="robots" content={resolvedRobots} />

      {/* Canonical */}
      {!noIndex && <link rel="canonical" href={resolvedCanonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:url" content={resolvedOgUrl} />
      <meta property="og:site_name" content={ogSiteName} />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={resolvedTwTitle} />
      <meta name="twitter:description" content={resolvedTwDesc} />
      <meta name="twitter:image" content={resolvedTwImage} />

      {/* JSON-LD Structured Data */}
      {jsonLdString && jsonLdString !== '{}' && (
        <script type="application/ld+json">{jsonLdString}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
