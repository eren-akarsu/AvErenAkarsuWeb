import React from 'react';
import { Globe, ChevronDown, ChevronUp, AlertTriangle, ToggleLeft, ToggleRight } from 'lucide-react';
import { SeoPreview } from '../seo/SeoPreview';
import { SeoChecklist } from '../seo/SeoChecklist';

interface SEOSettingsPanelProps {
  // Temel SEO alanları
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDesc: string;
  setSeoDesc: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  keywords: string;
  setKeywords: (val: string) => void;

  // Genişletilmiş SEO alanları (opsiyonel — geriye dönük uyum için)
  ogTitle?: string;
  setOgTitle?: (val: string) => void;
  ogDescription?: string;
  setOgDescription?: (val: string) => void;
  ogImage?: string;
  setOgImage?: (val: string) => void;
  robotsIndex?: boolean;
  setRobotsIndex?: (val: boolean) => void;
  robotsFollow?: boolean;
  setRobotsFollow?: (val: boolean) => void;
  focusKeyword?: string;
  setFocusKeyword?: (val: string) => void;
  canonicalUrl?: string;
  setCanonicalUrl?: (val: string) => void;
  reviewedAt?: string;
  setReviewedAt?: (val: string) => void;

  // Checklist için ek bilgiler
  coverImage?: string;
  coverImageAlt?: string;
  author?: string;
  publishedAt?: string;
  status?: string;
  articleBibliography?: string;
  articleLawArticles?: string;

  isEn?: boolean;
}

export const SEOSettingsPanel: React.FC<SEOSettingsPanelProps> = ({
  seoTitle,
  setSeoTitle,
  seoDesc,
  setSeoDesc,
  slug,
  setSlug,
  keywords,
  setKeywords,
  ogTitle = '',
  setOgTitle,
  ogDescription = '',
  setOgDescription,
  ogImage = '',
  setOgImage,
  robotsIndex = true,
  setRobotsIndex,
  robotsFollow = true,
  setRobotsFollow,
  focusKeyword = '',
  setFocusKeyword,
  canonicalUrl = '',
  setCanonicalUrl,
  reviewedAt = '',
  setReviewedAt,
  coverImage = '',
  coverImageAlt = '',
  author = '',
  publishedAt = '',
  status = 'Taslak',
  articleBibliography = '',
  articleLawArticles = '',
  isEn = false,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  React.useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsCollapsed(true);
    }
  }, []);

  // Format slug on change
  const handleSlugChange = (val: string) => {
    const clean = val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    setSlug(clean);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(12, 16, 30, 0.5)',
    border: '1px solid rgba(240, 218, 197, 0.12)',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#D1D5DB',
    fontSize: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    color: '#A0AEC0',
    display: 'block',
    marginBottom: '5px',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Collapse Header */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          padding: '10px 14px',
          borderRadius: '8px',
          background: 'rgba(240, 218, 197, 0.05)',
          border: '1px solid rgba(240, 218, 197, 0.1)',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={13} style={{ color: '#F0DAC5' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
            {isEn ? 'SEO Settings' : 'SEO Ayarları'}
          </span>
        </div>
        {isCollapsed
          ? <ChevronDown size={14} style={{ color: '#A0AEC0' }} />
          : <ChevronUp size={14} style={{ color: '#A0AEC0' }} />
        }
      </div>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Google Önizleme ── */}
          <SeoPreview
            title={seoTitle}
            slug={slug}
            description={seoDesc}
            isEn={isEn}
          />

          {/* ── Temel SEO Alanları ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* SEO Başlığı */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{isEn ? 'SEO Title' : 'SEO Başlığı'}</label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="glass-input"
                placeholder={isEn ? 'Title for search engines...' : 'Arama motorları için başlık...'}
                style={{ width: '100%' }}
              />
              <span style={{
                fontSize: '9px',
                color: seoTitle.length > 65 ? '#EF4444' : seoTitle.length > 55 ? '#F59E0B' : '#718096',
                textAlign: 'right',
              }}>
                {seoTitle.length} / 60 {isEn ? 'chars (ideal: 50-60)' : 'karakter (ideal: 50-60)'}
              </span>
            </div>

            {/* Meta Description */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{isEn ? 'Meta Description' : 'Meta Açıklama'}</label>
              <textarea
                rows={3}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                className="glass-input"
                placeholder={isEn ? 'Brief description for search results...' : 'Arama sonuçlarında görünecek kısa açıklama...'}
                style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }}
              />
              <span style={{
                fontSize: '9px',
                color: seoDesc.length > 170 ? '#EF4444' : seoDesc.length > 155 ? '#F59E0B' : '#718096',
                textAlign: 'right',
              }}>
                {seoDesc.length} / 160 {isEn ? 'chars (ideal: 140-160)' : 'karakter (ideal: 140-160)'}
              </span>
            </div>

            {/* URL Slug */}
            <div style={fieldStyle}>
              <label style={labelStyle}>URL Slug</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '12px', fontSize: '12px', color: '#718096', userSelect: 'none' }}>
                  /icerik/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="glass-input"
                  placeholder="icerik-slug-adresi"
                  style={{ width: '100%', paddingLeft: '60px' }}
                />
              </div>
              {!slug && (
                <span style={{ fontSize: '9px', color: '#EF4444' }}>
                  ✕ {isEn ? 'Slug cannot be empty.' : 'Slug boş bırakılamaz.'}
                </span>
              )}
            </div>

            {/* Odak Anahtar Kelime */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{isEn ? 'Focus Keyword' : 'Odak Anahtar Kavram'}</label>
              <input
                type="text"
                value={focusKeyword || ''}
                onChange={(e) => setFocusKeyword?.(e.target.value)}
                className="glass-input"
                placeholder={isEn ? 'e.g. eser sözleşmesi fesih' : 'ör. eser sözleşmesi fesih'}
                style={{ width: '100%' }}
              />
            </div>

            {/* Tüm Anahtar Kelimeler */}
            <div style={fieldStyle}>
              <label style={labelStyle}>{isEn ? 'SEO Keywords (comma separated)' : 'SEO Anahtar Kelimeleri (virgülle)'}</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="glass-input"
                placeholder={isEn ? 'keyword1, keyword2, keyword3' : 'anahtar1, anahtar2, anahtar3'}
                style={{ width: '100%' }}
              />
            </div>

            {/* Robots Index / Follow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>{isEn ? 'Search Engine Index' : 'Arama Motoru İndeksi'}</label>
                <button
                  type="button"
                  onClick={() => setRobotsIndex?.(!robotsIndex)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 10px', borderRadius: '6px',
                    background: robotsIndex ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${robotsIndex ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: robotsIndex ? '#10B981' : '#EF4444',
                    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {robotsIndex
                    ? <ToggleRight size={14} />
                    : <ToggleLeft size={14} />
                  }
                  {robotsIndex
                    ? (isEn ? 'Index ON' : 'İndeksle')
                    : (isEn ? 'NoIndex' : 'Gizle')
                  }
                </button>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>{isEn ? 'Link Follow' : 'Bağlantı Takibi'}</label>
                <button
                  type="button"
                  onClick={() => setRobotsFollow?.(!robotsFollow)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 10px', borderRadius: '6px',
                    background: robotsFollow ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${robotsFollow ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    color: robotsFollow ? '#10B981' : '#EF4444',
                    cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {robotsFollow
                    ? <ToggleRight size={14} />
                    : <ToggleLeft size={14} />
                  }
                  {robotsFollow
                    ? (isEn ? 'Follow' : 'Takip Et')
                    : (isEn ? 'NoFollow' : 'Takip Etme')
                  }
                </button>
              </div>
            </div>

            {/* NoIndex uyarısı */}
            {!robotsIndex && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                padding: '8px 12px', borderRadius: '6px',
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
              }}>
                <AlertTriangle size={13} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '11px', color: '#D1A94B', lineHeight: 1.4 }}>
                  {isEn
                    ? 'This content is marked as noindex — it will not appear in Google search results or sitemap.'
                    : 'Bu içerik noindex olarak işaretlenmiş. Google arama sonuçlarında ve sitemap\'te görünmeyecek.'
                  }
                </span>
              </div>
            )}
          </div>

          {/* ── Gelişmiş SEO Alanları (Açılır/Kapanır) ── */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#A0AEC0', fontSize: '11px', fontWeight: 600,
                padding: '4px 0', width: '100%',
              }}
            >
              {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              {isEn ? 'Advanced SEO & OG Settings' : 'Gelişmiş SEO & OG Ayarları'}
            </button>

            {showAdvanced && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>

                {/* Canonical URL */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>{isEn ? 'Canonical URL (leave blank for auto)' : 'Canonical URL (boş bırakın — otomatik)'}</label>
                  <input
                    type="text"
                    value={canonicalUrl || ''}
                    onChange={(e) => setCanonicalUrl?.(e.target.value)}
                    className="glass-input"
                    placeholder="https://www.erenakarsu.av.tr/icerik/..."
                    style={{ width: '100%' }}
                  />
                </div>

                {/* OpenGraph Başlığı */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>{isEn ? 'OpenGraph Title' : 'OpenGraph Başlığı'}</label>
                  <input
                    type="text"
                    value={ogTitle || ''}
                    onChange={(e) => setOgTitle?.(e.target.value)}
                    className="glass-input"
                    placeholder={isEn ? 'Social share title (auto from SEO title if empty)' : 'Sosyal paylaşım başlığı (boşsa SEO başlığından alınır)'}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* OpenGraph Açıklaması */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>{isEn ? 'OpenGraph Description' : 'OpenGraph Açıklaması'}</label>
                  <textarea
                    rows={2}
                    value={ogDescription || ''}
                    onChange={(e) => setOgDescription?.(e.target.value)}
                    className="glass-input"
                    placeholder={isEn ? 'Social share description (auto if empty)' : 'Sosyal paylaşım açıklaması (boşsa meta description kullanılır)'}
                    style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }}
                  />
                </div>

                {/* OpenGraph Görseli */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>{isEn ? 'OpenGraph Image URL' : 'OpenGraph Görsel URL\'si'}</label>
                  <input
                    type="text"
                    value={ogImage || ''}
                    onChange={(e) => setOgImage?.(e.target.value)}
                    className="glass-input"
                    placeholder={isEn ? 'Leave blank to use cover image' : 'Boş bırakın — kapak görseli kullanılır'}
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Son Hukuki İnceleme Tarihi */}
                <div style={fieldStyle}>
                  <label style={labelStyle}>{isEn ? 'Last Legal Review Date' : 'Son Hukuki İnceleme Tarihi'}</label>
                  <input
                    type="date"
                    value={reviewedAt ? reviewedAt.split('T')[0] : ''}
                    onChange={(e) => setReviewedAt?.(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%' }}
                  />
                </div>

              </div>
            )}
          </div>

          {/* ── SEO Kontrol Listesi ── */}
          <SeoChecklist
            seoTitle={seoTitle}
            metaDescription={seoDesc}
            slug={slug}
            coverImage={coverImage}
            coverImageAlt={coverImageAlt}
            author={author}
            publishedAt={publishedAt}
            robotsIndex={robotsIndex}
            status={status}
            hasBibliography={!!articleBibliography}
            hasLegalBasis={!!articleLawArticles}
            isEn={isEn}
          />

        </div>
      )}
    </div>
  );
};

export default SEOSettingsPanel;
