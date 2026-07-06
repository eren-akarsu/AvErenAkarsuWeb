import React from 'react';
import { Check } from 'lucide-react';

interface CustomCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
  style,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <label 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        verticalAlign: 'middle',
        ...style
      }}
    >
      <div
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={() => !disabled && onChange(!checked)}
        className={`custom-checkbox-container ${checked ? 'checked' : ''}`}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '4px',
          border: '1px solid rgba(240, 218, 197, 0.25)',
          background: 'rgba(12, 16, 30, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F0DAC5',
          transition: 'all 0.2s ease',
          outline: 'none',
          flexShrink: 0
        }}
      >
        {checked && (
          <Check 
            size={12} 
            strokeWidth={3} 
            style={{ 
              color: '#F0DAC5',
              animation: 'checkbox-check-anim 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46)'
            }} 
          />
        )}
      </div>
      {label && (
        <span style={{ fontSize: '13px', color: '#A0AEC0' }}>
          {label}
        </span>
      )}

      <style>{`
        .custom-checkbox-container:focus-visible {
          border-color: #50223C !important;
          box-shadow: 0 0 0 2px rgba(80, 34, 60, 0.6), 0 0 0 4px rgba(240, 218, 197, 0.2) !important;
        }
        .custom-checkbox-container:hover {
          border-color: rgba(80, 34, 60, 0.8) !important;
          box-shadow: 0 0 8px rgba(80, 34, 60, 0.4);
        }
        .custom-checkbox-container.checked {
          background: #50223C !important;
          border-color: #50223C !important;
          box-shadow: 0 0 10px rgba(80, 34, 60, 0.3);
        }
        @keyframes checkbox-check-anim {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </label>
  );
};
export default CustomCheckbox;
