import React from 'react';
import { Search, Globe, Eye } from 'lucide-react';

interface SEOSettingsPanelProps {
  seoTitle: string;
  setSeoTitle: (val: string) => void;
  seoDesc: string;
  setSeoDesc: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  keywords: string;
  setKeywords: (val: string) => void;
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
  isEn = false
}) => {
  // Format slug on change (lowercase, remove spaces and non-alpha)
  const handleSlugChange = (val: string) => {
    const clean = val
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
    setSlug(clean);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Google Preview Snippet Card */}
      <div 
        style={{
          background: 'rgba(12, 16, 30, 0.5)',
          border: '1px solid rgba(240, 218, 197, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#A0AEC0', borderBottom: '1px solid rgba(240,218,197,0.1)', paddingBottom: '6px' }}>
          <Eye size={12} style={{ color: '#F0DAC5' }} />
          <span>{isEn ? 'Google Search Snippet Preview' : 'Google Arama Sonucu Önizlemesi'}</span>
        </div>
        
        {/* Mock Google Result Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', marginTop: '4px' }}>
          <div style={{ fontSize: '12px', color: '#dadce0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', borderRadius: '50%', background: '#303134', color: '#bdc1c6', fontSize: '9px' }}>g</span>
            <span style={{ fontSize: '11px', color: '#bdc1c6' }}>akarsu.av.tr &gt; {slug || 'icerik-adresi'}</span>
          </div>
          <h3 
            style={{ 
              fontSize: '16px', 
              color: '#8ab4f8', 
              margin: '3px 0 0', 
              fontWeight: 'normal',
              fontFamily: 'Roboto, sans-serif',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {seoTitle || 'Örnek Başlık | Av. Eren Akarsu'}
          </h3>
          <p 
            style={{ 
              fontSize: '12px', 
              color: '#bdc1c6', 
              margin: '2px 0 0', 
              fontFamily: 'Roboto, sans-serif',
              lineHeight: '1.4',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {seoDesc || (isEn ? 'Please enter a meta description details in the field below to visualize...' : 'Önizleme oluşturmak için lütfen aşağıdaki SEO açıklaması alanını doldurun...')}
          </p>
        </div>
      </div>

      {/* SEO configuration fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0' }}>{isEn ? 'SEO Title' : 'SEO Başlığı'}</label>
          <input 
            type="text" 
            value={seoTitle} 
            onChange={(e) => setSeoTitle(e.target.value)} 
            className="glass-input" 
            placeholder={isEn ? "Title tag" : "Arama sonuçlarında görünecek başlık"}
            style={{ width: '100%' }}
          />
          <span style={{ fontSize: '9px', color: seoTitle.length > 60 ? '#EF4444' : '#718096', textAlign: 'right' }}>
            {seoTitle.length} / 60 {isEn ? 'chars' : 'karakter'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0' }}>{isEn ? 'SEO Meta Description' : 'SEO Açıklaması (Meta Description)'}</label>
          <textarea 
            rows={3} 
            value={seoDesc} 
            onChange={(e) => setSeoDesc(e.target.value)} 
            className="glass-input" 
            placeholder={isEn ? "Meta search snippet details..." : "Yazının arama sonuçlarındaki kısa açıklaması..."}
            style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }}
          />
          <span style={{ fontSize: '9px', color: seoDesc.length > 160 ? '#EF4444' : '#718096', textAlign: 'right' }}>
            {seoDesc.length} / 160 {isEn ? 'chars' : 'karakter'}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0' }}>URL Slug</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', fontSize: '12px', color: '#718096' }}>/</span>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => handleSlugChange(e.target.value)} 
              className="glass-input" 
              placeholder="icerik-slug-adresi"
              style={{ width: '100%', paddingLeft: '22px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0' }}>{isEn ? 'Focus Keywords (comma separated)' : 'Anahtar Kelimeler (virgülle ayırın)'}</label>
          <input 
            type="text" 
            value={keywords} 
            onChange={(e) => setKeywords(e.target.value)} 
            className="glass-input" 
            placeholder="yasa, is hukuku, tck"
            style={{ width: '100%' }}
          />
        </div>

      </div>

    </div>
  );
};
export default SEOSettingsPanel;
