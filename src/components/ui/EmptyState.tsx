import React from 'react';
import { FileText } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Henüz içerik eklenmemiş.',
  description = 'Bu kategoride yayınlanmış içerik bulunmuyor.',
  icon,
  action,
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
        background: 'rgba(12, 16, 30, 0.3)',
        borderRadius: '16px',
        border: '1px solid rgba(240, 218, 197, 0.06)',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(240, 218, 197, 0.05)',
          border: '1px solid rgba(240, 218, 197, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          color: '#F0DAC5',
        }}
      >
        {icon || <FileText size={28} />}
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

      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary"
          style={{
            marginTop: '20px',
            background: '#F0DAC5',
            color: '#1C2340',
            padding: '10px 24px',
            fontSize: '13px',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
