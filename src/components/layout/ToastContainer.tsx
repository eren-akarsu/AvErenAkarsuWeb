import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) {
    return null;
  }

  const getIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} style={{ color: '#10B981' }} />;
      case 'error':
        return <XCircle size={18} style={{ color: '#EF4444' }} />;
      case 'warning':
        return <AlertTriangle size={18} style={{ color: '#F59E0B' }} />;
      case 'info':
      default:
        return <Info size={18} style={{ color: '#3B82F6' }} />;
    }
  };

  const getBorderColor = (type: 'success' | 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      case 'warning':
        return 'rgba(245, 158, 11, 0.4)';
      case 'info':
      default:
        return 'rgba(59, 130, 246, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 10001,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        maxWidth: '380px',
        width: 'calc(100% - 48px)'
      }}
      className="toast-container-root"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '16px',
            borderRadius: '12px',
            border: `1px solid ${getBorderColor(toast.type)}`,
            background: 'rgba(28, 35, 64, 0.85)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="toast-item"
        >
          {/* Left colored bar */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#3B82F6'
            }}
          />

          <div style={{ flexShrink: 0, marginTop: '2px' }}>
            {getIcon(toast.type)}
          </div>

          <div style={{ flex: 1, paddingRight: '12px' }}>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#F3F4F6', margin: 0, lineHeight: '1.4' }}>
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '1px',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <X size={14} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 575px) {
          .toast-container-root {
            right: 24px !important;
            left: 24px !important;
            bottom: 24px !important;
            max-width: 100% !important;
            width: calc(100% - 48px) !important;
          }
        }
      `}</style>
    </div>
  );
};
