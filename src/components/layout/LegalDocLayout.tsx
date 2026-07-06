import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUp, Mail, Phone, MapPin, ChevronRight, FileText, Clock } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalDocLayoutProps {
  title: string;
  lastUpdated: string;
  readingTime: string;
  sections: Section[];
}

export const LegalDocLayout: React.FC<LegalDocLayoutProps> = ({
  title,
  lastUpdated,
  readingTime,
  sections
}) => {
  const { language, navigateTo, theme } = useApp();
  const isEn = language === 'en';

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      // 1. Scroll progress calculation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }

      // 2. Back to top visibility
      setShowBackToTop(window.scrollY > 300);

      // 3. Active Section highlight
      let currentActive = sections[0]?.id || '';
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If section is close to top of viewport
          if (rect.top <= 150) {
            currentActive = section.id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div 
      style={{ 
        background: 'var(--bg-primary)', 
        minHeight: '100vh', 
        padding: '120px 0 80px',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative'
      }}
    >
      {/* Scroll Progress Bar */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '4px',
          width: `${scrollProgress}%`,
          background: 'linear-gradient(90deg, var(--color-cream) 0%, var(--color-burgundy) 100%)',
          zIndex: 10000,
          transition: 'width 0.1s ease-out'
        }}
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '13px', 
            color: 'var(--text-secondary)',
            marginBottom: '24px' 
          }}
        >
          <span 
            onClick={() => navigateTo('home')} 
            style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-burgundy)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            {isEn ? 'Home' : 'Anasayfa'}
          </span>
          <ChevronRight size={12} />
          <span>{isEn ? 'Legal Disclosures' : 'Yasal Bilgilendirmeler'}</span>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--color-burgundy)', fontWeight: 600 }}>{title}</span>
        </div>

        {/* Document Header Panel with Glassmorphism */}
        <div 
          className="glass-panel" 
          style={{ 
            padding: '40px', 
            borderRadius: '20px', 
            marginBottom: '40px',
            border: '1px solid var(--border-color)',
            background: theme === 'dark' ? 'rgba(28, 35, 64, 0.45)' : 'rgba(240, 218, 197, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.6s ease'
          }}
        >
          {/* Decorative blur blob */}
          <div 
            style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--color-burgundy) 0%, transparent 70%)',
              opacity: 0.15,
              filter: 'blur(30px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
            <span 
              style={{ 
                fontSize: '11px', 
                color: 'var(--color-burgundy)', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: 'rgba(80, 34, 60, 0.12)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              {isEn ? 'LEGAL DISCLOSURE' : 'YASAL DOKÜMAN'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Clock size={13} />
              {readingTime}
            </span>
          </div>

          <h1 
            style={{ 
              fontSize: '36px', 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: '1.2'
            }}
          >
            {title}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '12px' }}>
            {isEn ? `Last Updated: ${lastUpdated}` : `Son Güncelleme Tarihi: ${lastUpdated}`}
          </p>
        </div>

        {/* Layout Grid: Sidebar Navigation & Main Content */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(240px, 1fr) 3fr', 
            gap: '40px',
            alignItems: 'start'
          }}
          className="legal-doc-grid"
        >
          {/* Left Column: Contents Navigation (Sticky) */}
          <aside 
            className="legal-doc-sidebar"
            style={{ 
              position: 'sticky', 
              top: '100px',
              maxHeight: 'calc(100vh - 140px)',
              overflowY: 'auto',
              paddingRight: '10px'
            }}
          >
            <h4 
              style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: 'var(--color-burgundy)', 
                textTransform: 'uppercase', 
                marginBottom: '16px',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '0.05em'
              }}
            >
              {isEn ? 'Document Outline' : 'Belge İçeriği'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    style={{
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: `2px solid ${isActive ? 'var(--color-burgundy)' : 'var(--border-color)'}`,
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: isActive ? 'var(--color-burgundy)' : 'var(--text-secondary)',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-primary)';
                        e.currentTarget.style.borderLeftColor = 'var(--color-burgundy)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.borderLeftColor = 'var(--border-color)';
                      }
                    }}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Column: Main Text Content */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '40px', 
              fontSize: '14px', 
              lineHeight: '1.8',
              color: 'var(--text-primary)'
            }}
            className="legal-doc-content"
          >
            {sections.map((sec) => (
              <section 
                key={sec.id} 
                id={sec.id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '30px',
                  animation: 'fadeIn 0.5s ease',
                  scrollMarginTop: '120px'
                }}
                className="glass-panel"
              >
                <h2 
                  style={{ 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    fontFamily: 'Outfit, sans-serif', 
                    color: 'var(--color-burgundy)', 
                    marginBottom: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    paddingBottom: '10px'
                  }}
                >
                  {sec.title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {sec.content}
                </div>
              </section>
            ))}

            {/* Document Footer (Contact / Info) */}
            <div 
              className="glass-panel"
              style={{
                background: 'rgba(80, 34, 60, 0.05)',
                border: '1px dashed var(--border-color)',
                borderRadius: '12px',
                padding: '30px',
                marginTop: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                {isEn ? 'Questions & Consultations' : 'Sorularınız ve Danışmanlık'}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {isEn 
                  ? 'If you have any questions regarding this document or personal data processing activities, please reach out via our contact channels.' 
                  : 'Bu metin veya kişisel veri işleme faaliyetlerimiz hakkında sorularınız varsa, lütfen iletişim kanallarımız aracılığıyla bizimle irtibata geçin.'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px', color: 'var(--text-primary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} style={{ color: 'var(--color-burgundy)' }} />
                  +90 532 123 4567
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} style={{ color: 'var(--color-burgundy)' }} />
                  info@akarsu.av.tr
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} style={{ color: 'var(--color-burgundy)' }} />
                  İstanbul, Türkiye
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back To Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--color-burgundy)',
            color: '#FFFFFF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'fadeIn 0.3s ease'
          }}
          className="back-to-top-btn"
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Responsive Stacking CSS */}
      <style>{`
        @media (max-width: 991px) {
          .legal-doc-grid {
            grid-template-columns: 1fr !important;
          }
          .legal-doc-sidebar {
            position: relative !important;
            top: 0 !important;
            max-height: none !important;
            margin-bottom: 20px;
            display: none !important; /* Hide outline index sidebar on mobile for simplicity, layout fits directly */
          }
        }
      `}</style>
    </div>
  );
};
export default LegalDocLayout;
