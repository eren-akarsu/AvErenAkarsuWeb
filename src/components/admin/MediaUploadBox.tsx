import React, { useState } from 'react';
import { UploadCloud, File, X, Check } from 'lucide-react';

interface MediaUploadBoxProps {
  onUpload: (url: string) => void;
  onRemove: () => void;
  currentValue?: string;
  isEn?: boolean;
  allowedTypes?: string;
}

export const MediaUploadBox: React.FC<MediaUploadBoxProps> = ({
  onUpload,
  onRemove,
  currentValue = '',
  isEn = false,
  allowedTypes = 'image/*'
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string; type: string } | null>(null);
  const [altText, setAltText] = useState('');
  const [imgDesc, setImgDesc] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpload(event.target.result as string);
        setFileMeta({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          type: file.type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      style={{
        background: 'rgba(12, 16, 30, 0.45)',
        border: `1px ${dragActive ? 'dashed var(--color-burgundy)' : 'solid rgba(240, 218, 197, 0.15)'}`,
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'center',
        transition: 'all 0.25s ease',
        boxShadow: dragActive ? '0 0 15px rgba(80, 34, 60, 0.25)' : 'none'
      }}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {currentValue ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          {allowedTypes.includes('image') ? (
            <div style={{ position: 'relative', width: '100%', maxHeight: '180px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(240, 218, 197, 0.1)' }}>
              <img src={currentValue} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <button 
                type="button" 
                onClick={() => { onRemove(); setFileMeta(null); }}
                style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(28, 35, 64, 0.6)', padding: '12px', borderRadius: '8px', width: '100%', justifyContent: 'space-between', border: '1px solid rgba(240,218,197,0.1)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <File size={20} style={{ color: '#F0DAC5' }} />
                <span style={{ fontSize: '12px', color: '#E2E8F0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {fileMeta ? fileMeta.name : 'document.pdf'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => { onRemove(); setFileMeta(null); }}
                style={{ width: '24px', height: '24px', borderRadius: '50%', border: 'none', background: '#EF4444', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {fileMeta && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: '#718096', borderBottom: '1px solid rgba(240,218,197,0.1)', paddingBottom: '6px' }}>
              <span>{fileMeta.type.split('/')[1]?.toUpperCase()}</span>
              <span>{fileMeta.size}</span>
            </div>
          )}

          {allowedTypes.includes('image') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#A0AEC0' }}>{isEn ? 'Alternative Text (Alt Text)' : 'Alternatif Metin (Alt Text)'}</label>
                <input 
                  type="text" 
                  value={altText} 
                  onChange={(e) => setAltText(e.target.value)} 
                  className="glass-input" 
                  placeholder={isEn ? "e.g. Eren Akarsu courtroom representation" : "Örn: Eren Akarsu iş hukuku duruşması"}
                  style={{ width: '100%', fontSize: '12px', height: '34px' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#A0AEC0' }}>{isEn ? 'Image Description' : 'Görsel Açıklaması'}</label>
                <input 
                  type="text" 
                  value={imgDesc} 
                  onChange={(e) => setImgDesc(e.target.value)} 
                  className="glass-input" 
                  placeholder={isEn ? "Brief description details" : "Görselin kısa açıklaması"}
                  style={{ width: '100%', fontSize: '12px', height: '34px' }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '15px 0' }}>
          <input 
            type="file" 
            accept={allowedTypes} 
            onChange={handleChange} 
            style={{ display: 'none' }} 
          />
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(240, 218, 197, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0DAC5', border: '1px solid rgba(240,218,197,0.1)' }}>
            <UploadCloud size={22} />
          </div>
          <div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0', display: 'block' }}>
              {isEn ? 'Drag & drop file here' : 'Dosyayı buraya sürükleyip bırakın'}
            </span>
            <span style={{ fontSize: '11px', color: '#718096', display: 'block', marginTop: '4px' }}>
              {isEn ? 'or click to browse local files' : 'veya göz atmak için tıklayın'}
            </span>
          </div>
        </label>
      )}
    </div>
  );
};
export default MediaUploadBox;
