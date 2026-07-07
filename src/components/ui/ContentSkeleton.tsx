import React from 'react';

interface ContentSkeletonProps {
  variant?: 'card' | 'row' | 'carousel';
  count?: number;
}

const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, rgba(240,218,197,0.03) 25%, rgba(240,218,197,0.08) 50%, rgba(240,218,197,0.03) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s ease-in-out infinite',
  borderRadius: '8px',
};

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ variant = 'card', count = 3 }) => {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {variant === 'card' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card, #0C101E)',
                borderRadius: '16px',
                border: '1px solid rgba(240, 218, 197, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image placeholder */}
              <div style={{ ...shimmerStyle, height: '180px', borderRadius: '16px 16px 0 0' }} />
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Category badge */}
                <div style={{ ...shimmerStyle, width: '80px', height: '20px' }} />
                {/* Title */}
                <div style={{ ...shimmerStyle, width: '100%', height: '18px' }} />
                <div style={{ ...shimmerStyle, width: '70%', height: '18px' }} />
                {/* Excerpt */}
                <div style={{ ...shimmerStyle, width: '100%', height: '14px', marginTop: '4px' }} />
                <div style={{ ...shimmerStyle, width: '90%', height: '14px' }} />
                {/* Meta row */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <div style={{ ...shimmerStyle, width: '60px', height: '14px' }} />
                  <div style={{ ...shimmerStyle, width: '60px', height: '14px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'row' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'rgba(12, 16, 30, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(240, 218, 197, 0.06)',
              }}
            >
              <div style={{ ...shimmerStyle, width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ ...shimmerStyle, width: '60%', height: '14px' }} />
                <div style={{ ...shimmerStyle, width: '40%', height: '12px' }} />
              </div>
              <div style={{ ...shimmerStyle, width: '80px', height: '28px' }} />
            </div>
          ))}
        </div>
      )}

      {variant === 'carousel' && (
        <div style={{ display: 'flex', gap: '24px', overflow: 'hidden' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              style={{
                minWidth: '380px',
                background: 'var(--bg-card, #0C101E)',
                borderRadius: '16px',
                border: '1px solid rgba(240, 218, 197, 0.08)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ ...shimmerStyle, width: '120px', height: '16px' }} />
              <div style={{ ...shimmerStyle, width: '100%', height: '20px' }} />
              <div style={{ ...shimmerStyle, width: '80%', height: '20px' }} />
              <div style={{ ...shimmerStyle, width: '100%', height: '14px', marginTop: '8px' }} />
              <div style={{ ...shimmerStyle, width: '95%', height: '14px' }} />
              <div style={{ ...shimmerStyle, width: '60%', height: '14px' }} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
