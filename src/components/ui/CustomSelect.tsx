import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seçiniz...',
  disabled = false,
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  const handleOptionClick = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.value === value);
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex(opt => opt.value === value);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        ...style
      }}
    >
      {/* Selector box */}
      <div
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          height: '38px',
          padding: '0 16px',
          borderRadius: '10px',
          border: isOpen ? '1px solid #50223C' : '1px solid rgba(240, 218, 197, 0.15)',
          background: 'rgba(12, 16, 30, 0.45)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: selectedOption ? '#F0DAC5' : '#718096',
          fontSize: '13px',
          transition: 'all 0.25s ease',
          outline: 'none',
          boxShadow: isOpen ? '0 0 10px rgba(80, 34, 60, 0.25)' : 'none'
        }}
        className="custom-select-trigger"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={14} 
          style={{ 
            color: '#F0DAC5', 
            transition: 'transform 0.3s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            flexShrink: 0,
            marginLeft: '8px'
          }} 
        />
      </div>

      {/* Options Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '6px',
            background: '#0C101E',
            border: '1px solid rgba(240, 218, 197, 0.15)',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.65)',
            zIndex: 1000,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '6px',
            animation: 'dropdown-slide 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="custom-select-options-menu"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleOptionClick(opt.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: isSelected ? '#F0DAC5' : '#A0AEC0',
                  background: isSelected ? 'rgba(80, 34, 60, 0.35)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: isSelected ? '1px solid rgba(80, 34, 60, 0.4)' : '1px solid transparent'
                }}
                className="custom-select-option"
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.label}</span>
                {isSelected && (
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#F0DAC5', flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .custom-select-trigger:focus-visible {
          border-color: #50223C !important;
          box-shadow: 0 0 0 2px rgba(80, 34, 60, 0.6), 0 0 0 4px rgba(240, 218, 197, 0.2) !important;
        }
        .custom-select-option:hover {
          background: #50223C !important;
          color: #F0DAC5 !important;
        }
        @keyframes dropdown-slide {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
export default CustomSelect;
