import React from 'react';
import { Eye } from 'lucide-react';

interface SeoPreviewProps {
  title: string;
  slug: string;
  description: string;
  isEn?: boolean;
}

/**
 * Google Arama Sonucu Önizleme Kartı
 * Gelişmiş önizleme — karakter renk indikatörlü
 */
export const SeoPreview: React.FC<SeoPreviewProps> = ({
  title,
  slug,
  description,
  isEn = false,
}) => {
  const displayTitle = title || (isEn ? 'Example Title | Av. Eren Akarsu' : 'Örnek Başlık | Av. Eren Akarsu');
  const displaySlug = slug || 'icerik-adresi';
  const displayDesc = description || (isEn
    ? 'Enter a meta description to visualize how this content will appear in search results...'
    : 'Arama sonuçlarında nasıl görüneceğini görmek için meta açıklama girin...');

  const titleLen = title.length;
  const descLen = description.length;

  const titleColor = titleLen === 0 ? '#718096'
    : titleLen <= 60 ? '#10B981'
    : titleLen <= 65 ? '#F59E0B'
    : '#EF4444';

  const descColor = descLen === 0 ? '#718096'
    : descLen <= 160 ? '#10B981'
    : descLen <= 170 ? '#F59E0B'
    : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Preview Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', color: '#A0AEC0',
      }}>
        <Eye size={12} style={{ color: '#F0DAC5' }} />
        <span>{isEn ? 'Google Search Snippet Preview' : 'Google Arama Sonucu Önizlemesi'}</span>
      </div>

      {/* Google Result Card Mockup */}
      <div style={{
        background: '#202124',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        padding: '14px 16px',
        fontFamily: 'Roboto, Arial, sans-serif',
      }}>
        {/* Breadcrumb URL */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          marginBottom: '3px',
        }}>
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%',
            background: '#303134', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '10px', color: '#BDC1C6',
            flexShrink: 0,
          }}>
            e
          </div>
          <span style={{ fontSize: '12px', color: '#BDC1C6' }}>
            akarsu.av.tr › {displaySlug}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '18px',
            color: '#8AB4F8',
            fontWeight: 400,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '4px',
            cursor: 'pointer',
          }}
          title={displayTitle}
        >
          {displayTitle.slice(0, 80)}
        </div>

        {/* Description */}
        <div style={{
          fontSize: '13px',
          color: '#BDC1C6',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {displayDesc}
        </div>
      </div>

      {/* Character counters */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#718096' }}>{isEn ? 'Title:' : 'Başlık:'}</span>
          <span style={{ color: titleColor, fontWeight: 700 }}>{titleLen}</span>
          <span style={{ color: '#4A5568' }}>/ 60 {isEn ? 'chars' : 'kar.'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ color: '#718096' }}>{isEn ? 'Desc:' : 'Açıklama:'}</span>
          <span style={{ color: descColor, fontWeight: 700 }}>{descLen}</span>
          <span style={{ color: '#4A5568' }}>/ 160 {isEn ? 'chars' : 'kar.'}</span>
        </div>
      </div>

      {/* Inline warnings — NO alert() */}
      {titleLen > 65 && (
        <div style={{
          fontSize: '10px', color: '#F59E0B',
          padding: '5px 8px', borderRadius: '4px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          ⚠ {isEn ? 'Title seems a bit long.' : 'Başlık biraz uzun görünüyor.'}
        </div>
      )}
      {descLen > 0 && descLen < 80 && (
        <div style={{
          fontSize: '10px', color: '#F59E0B',
          padding: '5px 8px', borderRadius: '4px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
        }}>
          ⚠ {isEn ? 'Meta description is short.' : 'Meta açıklama kısa görünüyor.'}
        </div>
      )}
      {descLen === 0 && (
        <div style={{
          fontSize: '10px', color: '#EF4444',
          padding: '5px 8px', borderRadius: '4px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          ✕ {isEn ? 'Meta description is missing.' : 'Meta açıklama eksik.'}
        </div>
      )}
    </div>
  );
};

export default SeoPreview;
