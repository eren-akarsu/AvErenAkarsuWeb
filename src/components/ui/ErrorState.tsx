import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Bir hata oluştu',
  description = 'İçerikler yüklenirken bir sorun meydana geldi. Lütfen tekrar deneyin.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 30px',
        textAlign: 'center',
        background: 'rgba(80, 34, 60, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(80, 34, 60, 0.2)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(80, 34, 60, 0.15)',
          border: '1px solid rgba(80, 34, 60, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#E88B8B',
        }}
      >
        <AlertTriangle size={28} />
      </div>

      <h4
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#F0DAC5',
          fontFamily: 'Outfit, sans-serif',
          marginBottom: '8px',
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: '13px',
          color: '#A0AEC0',
          maxWidth: '380px',
          lineHeight: '1.5',
        }}
      >
        {description}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: '10px',
            border: '1px solid rgba(240, 218, 197, 0.2)',
            background: 'rgba(240, 218, 197, 0.05)',
            color: '#F0DAC5',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(240, 218, 197, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(240, 218, 197, 0.05)';
          }}
        >
          <RefreshCw size={14} />
          Tekrar Dene
        </button>
      )}
    </div>
  );
};
