import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Scale, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentSkeleton } from '../ui/ContentSkeleton';
import { EmptyState } from '../ui/EmptyState';

export const LegalDecisions: React.FC = () => {
  const { precedentDecisions, language, theme, isLoadingDecisions, siteSettings } = useApp();
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const isEn = language === 'en';

  // Filter and slice published decisions based on homepage_settings decisionsCount
  const limit = siteSettings?.homepage_settings?.decisionsCount !== undefined ? siteSettings.homepage_settings.decisionsCount : 3;
  const visibleDecisions = precedentDecisions
    .filter(dec => dec.status === 'Yayında' && dec.showOnHome)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsPerPage(1.15); // Show 1 card fully, 15% of next card peeked
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(1.35); // Show 1 card fully, 35% of next card peeked
      } else {
        setCardsPerPage(2.25); // Show 2 cards fully, 25% of next card peeked
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate clamp boundaries
  const maxScrollPosition = Math.max(0, visibleDecisions.length - cardsPerPage);
  const maxIndex = Math.max(0, Math.ceil(maxScrollPosition));

  // Auto-play timer
  useEffect(() => {
    if (isHovered || maxIndex <= 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex, isHovered]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => {
      if (prev >= maxIndex) return 0;
      return prev + 1;
    });
  };

  // Clamp the translation value to prevent scrolling past the right boundary
  const translationPercentage = Math.min(
    currentIndex * (100 / cardsPerPage),
    maxScrollPosition * (100 / cardsPerPage)
  );

  const openDecision = visibleDecisions.find(dec => dec.id === activeDecisionId);

  return (
    <section
      id="legal-decisions"
      style={{
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container" style={{ position: 'relative' }}>
        
        {isLoadingDecisions ? (
          <div style={{ paddingTop: '20px' }}>
            <ContentSkeleton variant="carousel" count={3} />
          </div>
        ) : visibleDecisions.length === 0 ? (
          <EmptyState
            title={language === 'en' ? 'No precedent decisions yet' : 'Henüz emsal karar eklenmemiş'}
            description={language === 'en' ? 'Published precedent decisions will appear here.' : 'Yayınlanan emsal kararlar burada görünecektir.'}
            icon={<Scale size={28} />}
          />
        ) : (
        <>
        {/* Header Block with Carousel Controls */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '50px',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              {isEn ? 'Court of Cassation & High Judiciary Precedents' : 'Yargıtay ve Yüksek Yargı İçtihatları'}
            </h4>
            <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
              {isEn ? 'Key Precedent Rulings' : 'Önemli Emsal Kararlar'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px' }}>
              {isEn
                ? 'Summaries of critical precedents followed by Att. Eren Akarsu that shape our practice areas.'
                : 'Av. Eren Akarsu’nun takip ettiği ve faaliyet alanlarına yön veren kritik emsal içtihat özetleri.'}
            </p>
          </div>

          {/* Slider controls */}
          {visibleDecisions.length > cardsPerPage && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentIndex === 0 ? 0.35 : 1,
                  transition: 'var(--transition-fast)'
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
                  opacity: currentIndex >= maxIndex ? 0.35 : 1,
                  transition: 'var(--transition-fast)'
                }}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Slider Window */}
        <div style={{ overflow: 'visible', margin: '0 -12px' }}>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(-${translationPercentage}%)`
            }}
          >
            {visibleDecisions.map((decision) => (
              <div
                key={decision.id}
                style={{
                  flex: `0 0 ${100 / cardsPerPage}%`,
                  padding: '0 12px',
                  transition: 'all 0.4s ease'
                }}
              >
                <div
                  className="glass-card"
                  onClick={() => setActiveDecisionId(decision.id)}
                  style={{
                    padding: '30px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    justifyContent: 'space-between',
                    height: '280px' // Constrain height to keep slider uniform
                  }}
                >
                  <div>
                    {/* Header: Court and numbers */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-burgundy)', maxWidth: '75%' }}>
                        <Scale size={18} style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'Outfit', lineHeight: '1.2' }}>
                          {decision.court}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        <div>{decision.esas}</div>
                        <div>{decision.karar}</div>
                      </div>
                    </div>

                    <p 
                      style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-primary)', 
                        lineHeight: '1.6', 
                        marginTop: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {decision.summary}
                    </p>
                  </div>

                  {/* Tags and Action */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-color)',
                      marginTop: 'auto'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {decision.tags.slice(0, 3).map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          style={{
                            background: 'rgba(80, 34, 60, 0.08)',
                            color: 'var(--color-burgundy)',
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: 500
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-burgundy)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isEn ? 'Decision Text →' : 'Karar Metni →'}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

      </div>

      {/* Full Text Detail Modal */}
      {openDecision && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 10, 18, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveDecisionId(null)}
        >
          <div
            className="glass-panel decision-modal"
            style={{
              width: '100%',
              maxWidth: '650px',
              borderRadius: '24px',
              background: theme === 'dark' ? 'rgba(10, 13, 24, 0.98)' : 'rgba(250, 246, 240, 0.98)',
              border: '1px solid var(--border-color)',
              padding: '40px',
              position: 'relative',
              animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header info */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileText size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {openDecision.court}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {openDecision.esas} • {openDecision.karar}
                </span>
              </div>
            </div>

            {/* Scrollable text log */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px', fontSize: '13px', lineHeight: '1.8', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
              {openDecision.fullText}
            </div>

            {/* Footer action buttons */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isEn ? 'Print Decision' : 'Kararı Yazdır'}
              </button>
              <button
                onClick={() => setActiveDecisionId(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isEn ? 'Close' : 'Kapat'}
              </button>
            </div>

          </div>
        </div>
      )}



      <style>{`
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};
export default LegalDecisions;
