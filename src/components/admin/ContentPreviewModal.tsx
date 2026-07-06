import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone, Calendar, Clock, User, ArrowLeft } from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string;
  category?: string;
  isEn?: boolean;
}

export const ContentPreviewModal: React.FC<ContentPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  excerpt = '',
  content,
  coverImage = '',
  tags = '',
  category = 'Makaleler',
  isEn = false
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const getViewportWidth = () => {
    if (viewport === 'mobile') return '375px';
    if (viewport === 'tablet') return '768px';
    return '100%';
  };

  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 7, 12, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Top Header Bar */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          background: '#0C101E',
          borderBottom: '1px solid rgba(240, 218, 197, 0.15)',
          color: '#E2E8F0'
        }}
      >
        <button 
          onClick={onClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            color: '#A0AEC0',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#F0DAC5'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#A0AEC0'}
        >
          <ArrowLeft size={16} />
          {isEn ? 'Back to Editor' : 'Editöre Geri Dön'}
        </button>

        {/* Viewport Selectors */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(28, 35, 64, 0.5)', padding: '4px', borderRadius: '8px', border: '1px solid rgba(240,218,197,0.1)' }}>
          <button 
            onClick={() => setViewport('desktop')}
            className={`viewport-btn ${viewport === 'desktop' ? 'active' : ''}`}
            title={isEn ? 'Desktop view' : 'Masaüstü önizleme'}
          >
            <Monitor size={14} />
          </button>
          <button 
            onClick={() => setViewport('tablet')}
            className={`viewport-btn ${viewport === 'tablet' ? 'active' : ''}`}
            title={isEn ? 'Tablet view' : 'Tablet önizleme'}
          >
            <Tablet size={14} />
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={`viewport-btn ${viewport === 'mobile' ? 'active' : ''}`}
            title={isEn ? 'Mobile view' : 'Mobil önizleme'}
          >
            <Smartphone size={14} />
          </button>
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(240, 218, 197, 0.05)',
            color: '#A0AEC0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(240, 218, 197, 0.05)'}
        >
          <X size={16} />
        </button>
      </div>

      {/* Preview Workspace Area */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '40px 20px',
          display: 'flex',
          justifyContent: 'center',
          background: '#080A12'
        }}
      >
        <div 
          style={{
            width: '100%',
            maxWidth: getViewportWidth(),
            background: 'var(--color-dark-navy)',
            minHeight: '100%',
            borderRadius: viewport === 'desktop' ? '0' : '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            border: viewport === 'desktop' ? 'none' : '4px solid #303134',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
          }}
        >
          {/* Header Cover Image */}
          {coverImage ? (
            <div style={{ width: '100%', height: viewport === 'mobile' ? '180px' : '300px', overflow: 'hidden', position: 'relative' }}>
              <img src={coverImage} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(8,10,18,0.95) 100%)' }} />
            </div>
          ) : (
            <div style={{ height: '50px' }} />
          )}

          {/* Article Container */}
          <div style={{ padding: viewport === 'mobile' ? '20px' : '40px', color: '#E2E8F0', flex: 1 }}>
            
            {/* Meta Tags */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(80, 34, 60, 0.25)', color: 'var(--color-cream)', border: '1px solid rgba(80, 34, 60, 0.4)', textTransform: 'uppercase', fontWeight: 600 }}>
                {category}
              </span>
              {tagList.map(tag => (
                <span key={tag} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(240, 218, 197, 0.05)', color: '#A0AEC0', border: '1px solid rgba(240, 218, 197, 0.1)' }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 
              style={{ 
                fontSize: viewport === 'mobile' ? '24px' : '34px', 
                fontWeight: 700, 
                fontFamily: 'Outfit, sans-serif', 
                color: '#F0DAC5', 
                lineHeight: '1.3',
                marginBottom: '20px'
              }}
            >
              {title || (isEn ? 'Untitled Document' : 'Başlıksız Belge')}
            </h1>

            {/* Read Meta details */}
            <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#718096', borderBottom: '1px solid rgba(240, 218, 197, 0.1)', paddingBottom: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={13} /> {isEn ? 'Att. Eren Akarsu' : 'Av. Eren Akarsu'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={13} /> {new Date().toLocaleDateString(isEn ? 'en-US' : 'tr-TR')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={13} /> 5 {isEn ? 'mins read' : 'dk okuma'}</span>
            </div>

            {/* Excerpt */}
            {excerpt && (
              <p 
                style={{ 
                  fontSize: '15px', 
                  color: '#A0AEC0', 
                  fontStyle: 'italic', 
                  lineHeight: '1.6', 
                  borderLeft: '3px solid var(--color-burgundy)', 
                  paddingLeft: '15px',
                  marginBottom: '30px'
                }}
              >
                {excerpt}
              </p>
            )}

            {/* Rich Text Body Content */}
            <div 
              className="preview-rte-render"
              dangerouslySetInnerHTML={{ __html: content }}
              style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#CBD5E1'
              }}
            />

          </div>

          {/* Footer warning */}
          <div style={{ background: 'rgba(8,10,18,0.5)', padding: '20px 30px', borderTop: '1px solid rgba(240, 218, 197, 0.1)', textAlign: 'center', fontSize: '11px', color: '#718096' }}>
            {isEn ? 'Preview Mode. System visual details match platform user interface.' : 'Önizleme Modu. Tasarım ve yazı fontları web sitesi ile birebir aynıdır.'}
          </div>
        </div>
      </div>

      <style>{`
        .viewport-btn {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #A0AEC0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .viewport-btn:hover {
          color: #F0DAC5;
          background: rgba(240, 218, 197, 0.05);
        }
        .viewport-btn.active {
          color: #1C2340;
          background: #F0DAC5;
        }
        /* Custom formatting inside preview area */
        .preview-rte-render blockquote {
          border-left: 3px solid #50223C;
          padding-left: 15px;
          margin: 20px 0;
          color: #A0AEC0;
          font-style: italic;
        }
        .preview-rte-render pre {
          background: rgba(8, 10, 18, 0.5);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid rgba(240, 218, 197, 0.1);
          font-family: monospace;
          color: #ECC94B;
          margin: 20px 0;
          overflow-x: auto;
        }
        .preview-rte-render h1, .preview-rte-render h2, .preview-rte-render h3 {
          color: #F0DAC5;
          margin: 25px 0 15px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }
        .preview-rte-render h1 { font-size: 24px; }
        .preview-rte-render h2 { font-size: 20px; }
        .preview-rte-render h3 { font-size: 18px; }
        .preview-rte-render p {
          margin-bottom: 18px;
        }
        .preview-rte-render ul, .preview-rte-render ol {
          margin: 15px 0 15px 20px;
        }
        .preview-rte-render li {
          margin-bottom: 6px;
        }
        .preview-rte-render table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .preview-rte-render table td {
          padding: 10px;
          border: 1px solid rgba(240, 218, 197, 0.15);
        }
        .preview-rte-render img {
          max-width: 100%;
          border-radius: 8px;
          margin: 20px 0;
        }
      `}</style>

    </div>
  );
};
export default ContentPreviewModal;
