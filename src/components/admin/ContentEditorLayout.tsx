import React from 'react';
import { ArrowLeft, Save, Eye, Send, Trash2, Globe, Archive, Clock } from 'lucide-react';

interface ContentEditorLayoutProps {
  onBack: () => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  onPublish: () => void;
  onDelete?: () => void;
  status: string;
  isEn?: boolean;
  children: React.ReactNode; // Left Column Editor
  sidebar: React.ReactNode;  // Right Column Config
}

export const ContentEditorLayout: React.FC<ContentEditorLayoutProps> = ({
  onBack,
  onSaveDraft,
  onPreview,
  onPublish,
  onDelete,
  status,
  isEn = false,
  children,
  sidebar
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '100%' }}>
      
      {/* Upper Control Bar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(12, 16, 30, 0.45)',
          padding: '16px 24px',
          borderRadius: '16px',
          border: '1px solid rgba(240, 218, 197, 0.08)'
        }}
      >
        {/* Back and Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            type="button"
            onClick={onBack}
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', padding: '0 14px' }}
          >
            <ArrowLeft size={14} />
            {isEn ? 'Back' : 'Geri Dön'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>
              {isEn ? 'Status:' : 'Durum:'}
            </span>
            <span 
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '4px',
                background: status === 'Yayında' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: status === 'Yayında' ? '#10B981' : '#F59E0B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {status === 'Yayında' ? <Globe size={10} /> : <Archive size={10} />}
              {status === 'Yayında' ? (isEn ? 'Published' : 'Yayında') : (isEn ? 'Draft' : 'Taslak')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={onSaveDraft} 
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px' }}
          >
            <Save size={14} />
            {isEn ? 'Save Draft' : 'Taslak Kaydet'}
          </button>

          <button 
            type="button" 
            onClick={onPreview} 
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px' }}
          >
            <Eye size={14} />
            {isEn ? 'Preview' : 'Önizleme'}
          </button>

          <button 
            type="button" 
            onClick={onPublish} 
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', background: '#F0DAC5', color: '#1C2340' }}
          >
            <Send size={14} />
            {status === 'Yayında' ? (isEn ? 'Update' : 'Güncelle') : (isEn ? 'Publish' : 'Yayınla')}
          </button>

          {onDelete && (
            <button 
              type="button" 
              onClick={onDelete} 
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', background: 'rgba(239, 68, 68, 0.1)', borderColor: '#EF4444', color: '#EF4444' }}
            >
              <Trash2 size={14} />
              {isEn ? 'Delete' : 'Sil'}
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace: Split Content Columns */}
      <div className="editor-columns-grid">
        {/* Left Column (Editor) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {children}
        </div>

        {/* Right Column (Settings Panel) */}
        <div className="editor-sidebar-container">
          <div className="editor-sidebar-sticky">
            {sidebar}
          </div>
        </div>
      </div>

      {/* Scoped grid CSS */}
      <style>{`
        .editor-columns-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
          align-items: start;
        }
        .editor-sidebar-container {
          position: relative;
          height: 100%;
        }
        .editor-sidebar-sticky {
          position: sticky;
          top: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          padding-right: 4px;
        }
        /* Hide scrollbars but keep scrolling */
        .editor-sidebar-sticky::-webkit-scrollbar {
          width: 4px;
        }
        .editor-sidebar-sticky::-webkit-scrollbar-thumb {
          background: rgba(240, 218, 197, 0.15);
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .editor-columns-grid {
            grid-template-columns: 1fr;
          }
          .editor-sidebar-sticky {
            position: static;
            max-height: none;
            overflow-y: visible;
          }
        }
      `}</style>

    </div>
  );
};
export default ContentEditorLayout;
