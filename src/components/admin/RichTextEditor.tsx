import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Image, Table, Heading1, Heading2, Heading3, Quote, Code,
  RotateCcw, RotateCw, Type, Palette, Undo, Redo, HelpCircle
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isEn?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Yazmaya başlayın...',
  isEn = false
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  // Sync prop changes into editor HTML (only if text is different to prevent cursor jumps)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt(isEn ? 'Enter URL link:' : 'Lütfen bağlantı adresini (URL) girin:', 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleImage = () => {
    const url = prompt(isEn ? 'Enter Image URL:' : 'Lütfen görsel bağlantı adresini (URL) girin:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const handleTable = () => {
    const rows = prompt(isEn ? 'Number of rows:' : 'Satır sayısı:', '3');
    const cols = prompt(isEn ? 'Number of columns:' : 'Sütun sayısı:', '3');
    
    if (rows && cols) {
      const r = parseInt(rows);
      const c = parseInt(cols);
      let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 15px 0; border: 1px solid rgba(240, 218, 197, 0.2);">';
      
      for (let i = 0; i < r; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < c; j++) {
          tableHtml += `<td style="padding: 10px; border: 1px solid rgba(240, 218, 197, 0.2); text-align: left; font-size: 13px;">${isEn ? 'Cell' : 'Hücre'}</td>`;
        }
        tableHtml += '</tr>';
      }
      tableHtml += '</table><p></p>';
      executeCommand('insertHTML', tableHtml);
    }
  };

  const textColors = [
    { name: 'Krem', value: '#F0DAC5' },
    { name: 'Beyaz', value: '#FFFFFF' },
    { name: 'Gri', value: '#A0AEC0' },
    { name: 'Bordo', value: '#D68D9B' },
    { name: 'Altın', value: '#ECC94B' },
    { name: 'Kırmızı', value: '#F56565' }
  ];

  const highlights = [
    { name: 'Bordo Arka Plan', value: '#50223C' },
    { name: 'Koyu Lacivert', value: '#1C2340' },
    { name: 'Sarı Altın', value: '#744210' },
    { name: 'Koyu Gri', value: '#2D3748' },
    { name: 'Şeffaf', value: 'transparent' }
  ];

  return (
    <div 
      className="custom-rte-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1px solid rgba(240, 218, 197, 0.15)',
        background: 'rgba(28, 35, 64, 0.3)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden'
      }}
    >
      {/* Editor Toolbar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          padding: '10px',
          background: 'rgba(12, 16, 30, 0.6)',
          borderBottom: '1px solid rgba(240, 218, 197, 0.15)',
          alignItems: 'center'
        }}
      >
        {/* Undo Redo */}
        <button type="button" onClick={() => executeCommand('undo')} className="toolbar-btn" title="Geri Al"><Undo size={14} /></button>
        <button type="button" onClick={() => executeCommand('redo')} className="toolbar-btn" title="İleri Al"><Redo size={14} /></button>
        
        <div className="toolbar-divider" />

        {/* Headings */}
        <button type="button" onClick={() => executeCommand('formatBlock', '<h1>')} className="toolbar-btn font-bold" title="H1">H1</button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h2>')} className="toolbar-btn font-bold" title="H2">H2</button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<h3>')} className="toolbar-btn font-bold" title="H3">H3</button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<p>')} className="toolbar-btn font-bold" title="Metin">P</button>

        <div className="toolbar-divider" />

        {/* Standard formats */}
        <button type="button" onClick={() => executeCommand('bold')} className="toolbar-btn" title="Kalın"><Bold size={14} /></button>
        <button type="button" onClick={() => executeCommand('italic')} className="toolbar-btn" title="İtalik"><Italic size={14} /></button>
        <button type="button" onClick={() => executeCommand('underline')} className="toolbar-btn" title="Altı Çizili"><Underline size={14} /></button>

        <div className="toolbar-divider" />

        {/* Text color selector */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => { setShowColorMenu(!showColorMenu); setShowHighlightMenu(false); }} 
            className="toolbar-btn" 
            title="Metin Rengi"
            style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <Palette size={14} />
            <span style={{ fontSize: '9px', opacity: 0.8 }}>A</span>
          </button>
          {showColorMenu && (
            <div className="toolbar-dropdown">
              {textColors.map(c => (
                <div 
                  key={c.value} 
                  onClick={() => { executeCommand('foreColor', c.value); setShowColorMenu(false); }}
                  className="dropdown-item"
                >
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: c.value, marginRight: '8px' }} />
                  {c.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlight color selector */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            onClick={() => { setShowHighlightMenu(!showHighlightMenu); setShowColorMenu(false); }} 
            className="toolbar-btn" 
            title="Vurgu Rengi"
            style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            <Palette size={14} style={{ color: '#D68D9B' }} />
            <span style={{ fontSize: '9px', opacity: 0.8 }}>BG</span>
          </button>
          {showHighlightMenu && (
            <div className="toolbar-dropdown">
              {highlights.map(h => (
                <div 
                  key={h.value} 
                  onClick={() => { executeCommand('hiliteColor', h.value); setShowHighlightMenu(false); }}
                  className="dropdown-item"
                >
                  <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '4px', background: h.value, marginRight: '8px', border: '1px solid rgba(240,218,197,0.2)' }} />
                  {h.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar-divider" />

        {/* Lists */}
        <button type="button" onClick={() => executeCommand('insertUnorderedList')} className="toolbar-btn" title="Madde İşaretli"><List size={14} /></button>
        <button type="button" onClick={() => executeCommand('insertOrderedList')} className="toolbar-btn" title="Numaralı"><ListOrdered size={14} /></button>

        <div className="toolbar-divider" />

        {/* Alignment */}
        <button type="button" onClick={() => executeCommand('justifyLeft')} className="toolbar-btn" title="Sola Yasla"><AlignLeft size={14} /></button>
        <button type="button" onClick={() => executeCommand('justifyCenter')} className="toolbar-btn" title="Ortala"><AlignCenter size={14} /></button>
        <button type="button" onClick={() => executeCommand('justifyRight')} className="toolbar-btn" title="Sağa Yasla"><AlignRight size={14} /></button>
        <button type="button" onClick={() => executeCommand('justifyFull')} className="toolbar-btn" title="İki Yana Yasla"><AlignJustify size={14} /></button>

        <div className="toolbar-divider" />

        {/* Advanced inserts */}
        <button type="button" onClick={() => executeCommand('formatBlock', '<blockquote>')} className="toolbar-btn" title="Alıntı"><Quote size={14} /></button>
        <button type="button" onClick={() => executeCommand('formatBlock', '<pre>')} className="toolbar-btn" title="Kod Bloğu"><Code size={14} /></button>
        <button type="button" onClick={handleLink} className="toolbar-btn" title="Bağlantı Ekle"><Link size={14} /></button>
        <button type="button" onClick={handleImage} className="toolbar-btn" title="Görsel Ekle"><Image size={14} /></button>
        <button type="button" onClick={handleTable} className="toolbar-btn" title="Tablo Ekle"><Table size={14} /></button>
      </div>

      {/* Write Area */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          minHeight: '280px',
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '20px',
          outline: 'none',
          color: '#E2E8F0',
          fontSize: '14px',
          lineHeight: '1.7',
          background: 'transparent'
        }}
        className="rte-content-area"
        data-placeholder={placeholder}
      />

      {/* Toolbar / Editor Scoped Styles */}
      <style>{`
        .toolbar-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: #A0AEC0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toolbar-btn:hover {
          color: #F0DAC5;
          background: rgba(80, 34, 60, 0.25);
          border-color: rgba(80, 34, 60, 0.4);
        }
        .toolbar-btn.font-bold {
          font-size: 11px;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
        }
        .toolbar-divider {
          width: 1px;
          height: 18px;
          background: rgba(240, 218, 197, 0.15);
          margin: 0 4px;
        }
        .toolbar-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 5px;
          background: #0C101E;
          border: 1px solid rgba(240, 218, 197, 0.15);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
          z-index: 1000;
          width: 150px;
          padding: 6px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 8px 10px;
          font-size: 12px;
          color: #A0AEC0;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .dropdown-item:hover {
          color: #F0DAC5;
          background: rgba(80, 34, 60, 0.25);
        }
        .rte-content-area[data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #718096;
          cursor: text;
        }
        /* Custom formatting inside editable area */
        .rte-content-area blockquote {
          border-left: 3px solid #50223C;
          padding-left: 15px;
          margin: 15px 0;
          color: #A0AEC0;
          font-style: italic;
        }
        .rte-content-area pre {
          background: rgba(12, 16, 30, 0.6);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(240, 218, 197, 0.1);
          font-family: monospace;
          color: #ECC94B;
          margin: 15px 0;
          overflow-x: auto;
        }
        .rte-content-area h1 {
          font-size: 22px;
          color: #F0DAC5;
          margin: 15px 0 10px;
          font-family: 'Outfit', sans-serif;
        }
        .rte-content-area h2 {
          font-size: 18px;
          color: #F0DAC5;
          margin: 15px 0 10px;
          font-family: 'Outfit', sans-serif;
        }
        .rte-content-area h3 {
          font-size: 16px;
          color: #F0DAC5;
          margin: 15px 0 10px;
          font-family: 'Outfit', sans-serif;
        }
        .rte-content-area ul, .rte-content-area ol {
          margin: 10px 0 10px 20px;
        }
        .rte-content-area table td {
          transition: background 0.2s ease;
        }
        .rte-content-area table td:hover {
          background: rgba(240, 218, 197, 0.05);
        }
        .rte-content-area img {
          max-width: 100%;
          border-radius: 8px;
          margin: 15px 0;
          border: 1px solid rgba(240, 218, 197, 0.1);
        }
      `}</style>
    </div>
  );
};
export default RichTextEditor;
