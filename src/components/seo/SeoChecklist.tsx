import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';

export interface SeoChecklistProps {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  coverImage: string;
  coverImageAlt?: string;
  author: string;
  publishedAt?: string;
  robotsIndex: boolean;
  status: string;
  hasBibliography?: boolean;
  hasLegalBasis?: boolean;
  isEn?: boolean;
}

type CheckStatus = 'pass' | 'warn' | 'fail';

interface CheckItem {
  label: string;
  hint: string;
  status: CheckStatus;
}

/**
 * SEO Kontrol Listesi
 * İçerik yayınlamadan önce SEO ve içerik kalite kontrolü sağlar.
 * alert() kullanmaz — inline gösterim.
 */
export const SeoChecklist: React.FC<SeoChecklistProps> = ({
  seoTitle,
  metaDescription,
  slug,
  coverImage,
  coverImageAlt,
  author,
  publishedAt,
  robotsIndex,
  status,
  hasBibliography,
  hasLegalBasis,
  isEn = false,
}) => {
  const checks: CheckItem[] = [
    {
      label: isEn ? 'SEO Title' : 'SEO Başlığı',
      hint: seoTitle.length === 0
        ? (isEn ? 'SEO title is empty.' : 'SEO başlığı boş.')
        : seoTitle.length < 30
          ? (isEn ? 'Title is short (30-60 chars recommended).' : 'Başlık kısa (30-60 karakter önerilir).')
          : seoTitle.length > 65
            ? (isEn ? 'Title is too long (max 65 chars).' : 'Başlık çok uzun (max 65 karakter).')
            : (isEn ? 'Title length is optimal.' : 'Başlık uzunluğu ideal.'),
      status: seoTitle.length === 0 ? 'fail'
        : (seoTitle.length < 30 || seoTitle.length > 65) ? 'warn'
          : 'pass',
    },
    {
      label: isEn ? 'Meta Description' : 'Meta Açıklaması',
      hint: metaDescription.length === 0
        ? (isEn ? 'Meta description is empty.' : 'Meta açıklama eksik.')
        : metaDescription.length < 80
          ? (isEn ? 'Description is short (140-160 chars recommended).' : 'Açıklama kısa (140-160 karakter önerilir).')
          : metaDescription.length > 170
            ? (isEn ? 'Description may be truncated (max 160 chars).' : 'Açıklama kesilebilir (max 160 karakter).')
            : (isEn ? 'Description length is optimal.' : 'Açıklama uzunluğu ideal.'),
      status: metaDescription.length === 0 ? 'fail'
        : (metaDescription.length < 80 || metaDescription.length > 170) ? 'warn'
          : 'pass',
    },
    {
      label: 'Slug / URL',
      hint: slug.length === 0
        ? (isEn ? 'Slug cannot be empty.' : 'Slug boş bırakılamaz.')
        : (isEn ? 'Slug is set.' : 'Slug tanımlı.'),
      status: slug.length === 0 ? 'fail' : 'pass',
    },
    {
      label: isEn ? 'Cover Image' : 'Kapak Görseli',
      hint: !coverImage
        ? (isEn ? 'No cover image selected.' : 'Kapak görseli seçilmemiş.')
        : !coverImageAlt
          ? (isEn ? 'Cover image has no alt text.' : 'Görsele alt metin eklenmemiş.')
          : (isEn ? 'Cover image set with alt text.' : 'Kapak görseli ve alt metin mevcut.'),
      status: !coverImage ? 'fail'
        : !coverImageAlt ? 'warn'
          : 'pass',
    },
    {
      label: isEn ? 'Author' : 'Yazar',
      hint: !author
        ? (isEn ? 'Author is not set.' : 'Yazar bilgisi girilmemiş.')
        : (isEn ? 'Author is set.' : 'Yazar bilgisi mevcut.'),
      status: !author ? 'warn' : 'pass',
    },
    {
      label: isEn ? 'Publish Date' : 'Yayın Tarihi',
      hint: !publishedAt
        ? (isEn ? 'Publish date not set.' : 'Yayın tarihi belirsiz.')
        : (isEn ? 'Publish date is set.' : 'Yayın tarihi mevcut.'),
      status: !publishedAt ? 'warn' : 'pass',
    },
    {
      label: isEn ? 'Robots Index' : 'İndeksleme Ayarı',
      hint: !robotsIndex
        ? (isEn ? 'This content is marked noindex — it will not appear in sitemap.' : 'Bu içerik noindex olarak işaretlendi — sitemap\'e eklenmeyecek.')
        : (isEn ? 'Content is indexable.' : 'İçerik indekslenebilir.'),
      status: !robotsIndex ? 'warn' : 'pass',
    },
    {
      label: isEn ? 'Content Status' : 'İçerik Durumu',
      hint: status !== 'Yayında'
        ? (isEn ? 'Content is in draft mode — not publicly visible.' : 'İçerik taslak modunda — halka görünmüyor.')
        : (isEn ? 'Content is published.' : 'İçerik yayında.'),
      status: status !== 'Yayında' ? 'warn' : 'pass',
    },
    ...(hasBibliography !== undefined ? [{
      label: isEn ? 'Bibliography' : 'Kaynakça',
      hint: !hasBibliography
        ? (isEn ? 'No bibliography added.' : 'Kaynakça eklenmemiş.')
        : (isEn ? 'Bibliography present.' : 'Kaynakça mevcut.'),
      status: !hasBibliography ? 'warn' : 'pass' as CheckStatus,
    }] : []),
    ...(hasLegalBasis !== undefined ? [{
      label: isEn ? 'Legal Basis' : 'Hukuki Dayanak',
      hint: !hasLegalBasis
        ? (isEn ? 'No legal basis specified.' : 'Hukuki dayanak belirtilmemiş.')
        : (isEn ? 'Legal basis present.' : 'Hukuki dayanak mevcut.'),
      status: !hasLegalBasis ? 'warn' : 'pass' as CheckStatus,
    }] : []),
  ];

  const passCount = checks.filter(c => c.status === 'pass').length;
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;

  const StatusIcon: React.FC<{ status: CheckStatus }> = ({ status }) => {
    if (status === 'pass') return <CheckCircle size={13} style={{ color: '#10B981', flexShrink: 0 }} />;
    if (status === 'warn') return <AlertCircle size={13} style={{ color: '#F59E0B', flexShrink: 0 }} />;
    return <XCircle size={13} style={{ color: '#EF4444', flexShrink: 0 }} />;
  };

  const scoreColor = failCount > 0 ? '#EF4444' : warnCount > 2 ? '#F59E0B' : '#10B981';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header + Score */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: '8px',
        background: 'rgba(240, 218, 197, 0.04)',
        border: '1px solid rgba(240, 218, 197, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={13} style={{ color: '#F0DAC5' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
            {isEn ? 'SEO Checklist' : 'SEO Kontrol Listesi'}
          </span>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700,
          color: scoreColor,
          background: `${scoreColor}1A`,
          padding: '2px 8px', borderRadius: '4px',
        }}>
          {passCount}/{checks.length} {isEn ? 'OK' : 'Tamam'}
        </span>
      </div>

      {/* Check items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {checks.map((check, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '8px',
            padding: '7px 10px', borderRadius: '6px',
            background: check.status === 'fail'
              ? 'rgba(239, 68, 68, 0.06)'
              : check.status === 'warn'
                ? 'rgba(245, 158, 11, 0.06)'
                : 'rgba(16, 185, 129, 0.04)',
            border: `1px solid ${
              check.status === 'fail' ? 'rgba(239,68,68,0.15)'
              : check.status === 'warn' ? 'rgba(245,158,11,0.15)'
              : 'rgba(16,185,129,0.1)'
            }`,
          }}>
            <StatusIcon status={check.status} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#C4CDD5', marginBottom: '1px' }}>
                {check.label}
              </div>
              <div style={{ fontSize: '10px', color: '#718096', lineHeight: 1.4 }}>
                {check.hint}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeoChecklist;
