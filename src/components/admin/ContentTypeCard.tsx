import React from 'react';
import { Plus, Eye, ChevronRight } from 'lucide-react';

interface ContentTypeCardProps {
  title: string;
  description: string;
  count: number;
  lastUpdated: string;
  icon: React.ReactNode;
  onCreateNew: () => void;
  onViewAll: () => void;
  isEn?: boolean;
}

export const ContentTypeCard: React.FC<ContentTypeCardProps> = ({
  title,
  description,
  count,
  lastUpdated,
  icon,
  onCreateNew,
  onViewAll,
  isEn = false
}) => {
  return (
    <div 
      className="glass-panel content-type-card"
      style={{
        padding: '30px',
        borderRadius: '20px',
        background: 'rgba(28, 35, 64, 0.35)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(240, 218, 197, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '280px'
      }}
    >
      {/* Glow Backdrop */}
      <div 
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(80,34,60,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Header Info */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div 
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'rgba(240, 218, 197, 0.05)',
            border: '1px solid rgba(240, 218, 197, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F0DAC5',
            flexShrink: 0
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <h3 
            style={{ 
              fontSize: '16px', 
              fontWeight: 700, 
              fontFamily: 'Outfit, sans-serif', 
              color: '#F0DAC5', 
              lineHeight: '1.3' 
            }}
          >
            {title}
          </h3>
          <p 
            style={{ 
              fontSize: '12px', 
              color: '#A0AEC0', 
              marginTop: '4px',
              lineHeight: '1.4'
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Statistics info */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          background: 'rgba(12, 16, 30, 0.35)', 
          padding: '10px 14px', 
          borderRadius: '8px', 
          fontSize: '11px', 
          color: '#718096',
          position: 'relative',
          zIndex: 1,
          border: '1px solid rgba(240,218,197,0.05)'
        }}
      >
        <span>{isEn ? 'Count:' : 'Öğe Sayısı:'} <strong style={{ color: '#F0DAC5' }}>{count}</strong></span>
        <span>{isEn ? 'Updated:' : 'Son Güncelleme:'} <strong style={{ color: '#E2E8F0' }}>{lastUpdated}</strong></span>
      </div>

      {/* Actions buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', position: 'relative', zIndex: 1 }}>
        <button 
          onClick={onCreateNew} 
          className="btn-primary" 
          style={{ 
            flex: 1, 
            height: '32px', 
            fontSize: '11px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '4px',
            background: 'var(--color-burgundy)',
            color: '#FFFFFF',
            border: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#652a4c'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-burgundy)'}
        >
          <Plus size={12} />
          {isEn ? 'Create New' : 'Yeni Oluştur'}
        </button>
        <button 
          onClick={onViewAll} 
          className="btn-secondary" 
          style={{ 
            flex: 1, 
            height: '32px', 
            fontSize: '11px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '4px',
            color: '#FFFFFF'
          }}
        >
          <Eye size={12} />
          {isEn ? 'View All' : 'İçerikleri Gör'}
        </button>
      </div>

      {/* Card hover styles */}
      <style>{`
        .content-type-card:hover {
          transform: translateY(-5px);
          border-color: #50223C !important;
          box-shadow: 0 10px 25px rgba(80, 34, 60, 0.25) !important;
        }
      `}</style>
    </div>
  );
};
export default ContentTypeCard;
