import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, GraduationCap, CodeXml, BookMarked, Briefcase } from 'lucide-react';

export const Education: React.FC = () => {
  const { t, language, theme } = useApp();
  const isEn = language === 'en';

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.05 // Starts when 5% of the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const timelineItems = [
    {
      year: t('education.item1.year'),
      title: t('education.item1.title'),
      desc: t('education.item1.desc'),
      icon: <GraduationCap size={20} />,
      badge: isEn ? '100% Full Scholarship' : '%100 Tam Burslu'
    },
    {
      year: t('education.item2.year'),
      title: t('education.item2.title'),
      desc: t('education.item2.desc'),
      icon: <CodeXml size={20} />,
      badge: isEn ? 'Double Major' : 'Çift Anadal'
    },
    {
      year: t('education.item3.year'),
      title: t('education.item3.title'),
      desc: t('education.item3.desc'),
      icon: <Award size={20} />,
      badge: isEn ? 'Faculty Honor' : 'Fakülte Derecesi'
    },
    {
      year: t('education.item4.year'),
      title: t('education.item4.title'),
      desc: t('education.item4.desc'),
      icon: <BookMarked size={20} />,
      badge: isEn ? 'LL.M Master' : 'Yüksek Lisans'
    },
    {
      year: t('education.item5.year'),
      title: t('education.item5.title'),
      desc: t('education.item5.desc'),
      icon: <Briefcase size={20} />,
      badge: isEn ? 'Career Beginning' : 'Mesleğe Başlangıç'
    }
  ];

  return (
    <section
      id="education"
      ref={sectionRef}
      className={isIntersecting ? 'active-animation' : ''}
      style={{
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}
    >
      {/* Dynamic Scoped Styles for the Animated LegalTech Background */}
      <style>{`
        /* Underlying drifting animations for trails */
        #education .drift-1 {
          animation: drift1 18s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .drift-2 {
          animation: drift2 22s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .drift-3 {
          animation: drift3 20s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .drift-4 {
          animation: drift4 24s ease-in-out infinite alternate;
          transform-origin: center;
        }

        /* Flowing silver trail segments inside paths */
        #education .flow-trail-1 {
          stroke-dasharray: 200 800;
          animation: flowOffset 15s linear infinite, drift1 18s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .flow-trail-2 {
          stroke-dasharray: 250 750;
          animation: flowOffsetReverse 19s linear infinite, drift2 22s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .flow-trail-3 {
          stroke-dasharray: 180 820;
          animation: flowOffset 17s linear infinite, drift3 20s ease-in-out infinite alternate;
          transform-origin: center;
        }
        #education .flow-trail-4 {
          stroke-dasharray: 300 700;
          animation: flowOffsetReverse 23s linear infinite, drift4 24s ease-in-out infinite alternate;
          transform-origin: center;
        }

        /* Scoped play state controlled by active-animation class */
        #education .drift-1, #education .drift-2, #education .drift-3, #education .drift-4,
        #education .flow-trail-1, #education .flow-trail-2, #education .flow-trail-3, #education .flow-trail-4,
        #education .symbol-group-1, #education .symbol-group-2, #education .symbol-group-3, #education .symbol-group-4 {
          animation-play-state: paused;
        }

        #education.active-animation .drift-1, 
        #education.active-animation .drift-2, 
        #education.active-animation .drift-3, 
        #education.active-animation .drift-4,
        #education.active-animation .flow-trail-1, 
        #education.active-animation .flow-trail-2, 
        #education.active-animation .flow-trail-3, 
        #education.active-animation .flow-trail-4,
        #education.active-animation .symbol-group-1, 
        #education.active-animation .symbol-group-2, 
        #education.active-animation .symbol-group-3, 
        #education.active-animation .symbol-group-4 {
          animation-play-state: running;
        }

        /* Sequential Fading & Drifting (Parallax) of symbols */
        #education .symbol-group-1 {
          animation: floatSymbol1 36s linear infinite;
          transform-origin: 150px 150px;
        }
        #education .symbol-group-2 {
          animation: floatSymbol2 36s linear infinite;
          transform-origin: 850px 350px;
        }
        #education .symbol-group-3 {
          animation: floatSymbol3 36s linear infinite;
          transform-origin: 150px 420px;
        }
        #education .symbol-group-4 {
          animation: floatSymbol4 36s linear infinite;
          transform-origin: 800px 110px;
        }

        @keyframes drift1 {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-12px) scaleY(1.02) rotate(0.2deg); }
          100% { transform: translateY(0px) scaleY(1); }
        }
        @keyframes drift2 {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(10px) scaleY(0.98) rotate(-0.2deg); }
          100% { transform: translateY(0px) scaleY(1); }
        }
        @keyframes drift3 {
          0% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(-8px) scaleX(1.01) rotate(-0.1deg); }
          100% { transform: translateY(0px) scaleX(1); }
        }
        @keyframes drift4 {
          0% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(12px) scaleX(0.99) rotate(0.1deg); }
          100% { transform: translateY(0px) scaleX(1); }
        }

        @keyframes flowOffset {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes flowOffsetReverse {
          0% { stroke-dashoffset: -1000; }
          100% { stroke-dashoffset: 0; }
        }

        /* Symbol Fading & Parallax Keyframes (Max 3-4 visible at once) */
        @keyframes floatSymbol1 {
          0% { opacity: 0; transform: translate(0px, 0px); }
          5% { opacity: 0.05; transform: translate(2px, -2px); }
          25% { opacity: 0.05; transform: translate(8px, -8px); }
          30% { opacity: 0; transform: translate(10px, -10px); }
          100% { opacity: 0; transform: translate(0px, 0px); }
        }
        @keyframes floatSymbol2 {
          0% { opacity: 0; transform: translate(0px, 0px); }
          25% { opacity: 0; transform: translate(0px, 0px); }
          30% { opacity: 0.06; transform: translate(-2px, 2px); }
          50% { opacity: 0.06; transform: translate(-8px, 8px); }
          55% { opacity: 0; transform: translate(-10px, 10px); }
          100% { opacity: 0; transform: translate(0px, 0px); }
        }
        @keyframes floatSymbol3 {
          0% { opacity: 0; transform: translate(0px, 0px); }
          50% { opacity: 0; transform: translate(0px, 0px); }
          55% { opacity: 0.05; transform: translate(2px, 2px); }
          75% { opacity: 0.05; transform: translate(8px, 8px); }
          80% { opacity: 0; transform: translate(10px, 10px); }
          100% { opacity: 0; transform: translate(0px, 0px); }
        }
        @keyframes floatSymbol4 {
          0% { opacity: 0.05; transform: translate(-8px, -8px); }
          5% { opacity: 0; transform: translate(-10px, -10px); }
          75% { opacity: 0; transform: translate(0px, 0px); }
          80% { opacity: 0.05; transform: translate(-2px, -2px); }
          100% { opacity: 0.05; transform: translate(-8px, -8px); }
        }

        /* Accessibility preferences */
        @media (prefers-reduced-motion: reduce) {
          #education .drift-1, #education .drift-2, #education .drift-3, #education .drift-4,
          #education .flow-trail-1, #education .flow-trail-2, #education .flow-trail-3, #education .flow-trail-4,
          #education .symbol-group-1, #education .symbol-group-2, #education .symbol-group-3, #education .symbol-group-4 {
            animation: none !important;
            transform: none !important;
            opacity: 0.04 !important;
          }
        }

        /* Mobile Optimization: hide some trails/symbols for performance */
        @media (max-width: 767px) {
          #education .flow-trail-3, #education .flow-trail-4,
          #education .drift-3, #education .drift-4,
          #education .symbol-group-3, #education .symbol-group-4 {
            display: none !important;
          }
        }
      `}</style>

      {/* SVG Background Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: isIntersecting ? (theme === 'dark' ? 0.85 : 0.45) : 0,
          transition: 'opacity 1.2s ease-in-out'
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="silverGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(200, 200, 200, 0)" />
              <stop offset="20%" stopColor="rgba(220, 220, 220, 0.35)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.75)" />
              <stop offset="80%" stopColor="rgba(220, 220, 220, 0.35)" />
              <stop offset="100%" stopColor="rgba(200, 200, 200, 0)" />
            </linearGradient>
            <pattern id="timelineDotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(220, 220, 220, 0.05)" />
            </pattern>
          </defs>

          {/* Technical Dotted Grid */}
          <rect width="1000" height="600" fill="url(#timelineDotGrid)" />

          {/* Courthouse Silhouette (Symbol Group 1 - Top Left) */}
          <g className="symbol-group-1" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1.2" fill="none">
            {/* Pediment Roof */}
            <path d="M 50 150 L 250 150 L 150 100 Z" />
            <path d="M 40 150 L 260 150 L 260 158 L 40 158 Z" />
            {/* Pillars */}
            <rect x="70" y="158" width="18" height="110" rx="1" />
            <rect x="115" y="158" width="18" height="110" rx="1" />
            <rect x="160" y="158" width="18" height="110" rx="1" />
            <rect x="205" y="158" width="18" height="110" rx="1" />
            {/* Base steps */}
            <rect x="30" y="268" width="240" height="8" />
            <rect x="20" y="276" width="260" height="8" />
          </g>

          {/* Scales of Justice Silhouette (Symbol Group 2 - Bottom Right) */}
          <g className="symbol-group-2" stroke="rgba(220, 220, 220, 0.06)" strokeWidth="1.2" fill="none">
            {/* Circular frame background */}
            <circle cx="850" cy="350" r="140" strokeDasharray="6 6" />
            {/* Base Pillar */}
            <path d="M 800 460 L 900 460 M 850 460 L 850 250" />
            {/* Horizontal Balance Beam */}
            <path d="M 720 270 L 980 270" />
            {/* Left Pan */}
            <path d="M 720 270 L 685 350 L 755 350 Z" />
            <path d="M 685 350 C 685 370, 755 370, 755 350" />
            {/* Right Pan */}
            <path d="M 980 270 L 945 350 L 1015 350 Z" />
            <path d="M 945 350 C 945 370, 1015 370, 1015 350" />
          </g>

          {/* Gavel & Paragraph Silhouette (Symbol Group 3 - Bottom Left) */}
          <g className="symbol-group-3" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1.2" fill="none">
            {/* Handle */}
            <line x1="80" y1="460" x2="140" y2="400" />
            {/* Head */}
            <path d="M 125 385 L 155 415 L 145 425 L 115 395 Z" />
            <path d="M 120 380 L 130 390 M 140 420 L 150 430" />
            {/* Base Block */}
            <ellipse cx="100" cy="460" rx="30" ry="10" />
            <ellipse cx="100" cy="465" rx="30" ry="10" />
            {/* Paragraph symbol § */}
            <path d="M 190 410 C 200 400, 200 390, 190 380 C 180 370, 165 385, 165 400 C 165 420, 200 410, 200 435 C 200 450, 185 460, 175 450 C 165 440, 170 425, 175 425 M 175 425 C 185 425, 190 435, 185 445" />
          </g>

          {/* Code Brackets, API Nodes & Database (Symbol Group 4 - Top Right) */}
          <g className="symbol-group-4" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1.2" fill="none">
            {/* Brackets */}
            <path d="M 770 110 L 740 130 L 770 150" />
            <line x1="785" y1="105" x2="775" y2="155" />
            <path d="M 790 110 L 820 130 L 790 150" />
            {/* Database cylinder */}
            <ellipse cx="870" cy="110" rx="20" ry="6" />
            <path d="M 850 110 L 850 122 A 20 6 0 0 0 890 122 L 890 110" />
            <path d="M 850 122 L 850 134 A 20 6 0 0 0 890 134 L 890 122" />
            {/* API Node network */}
            <circle cx="750" cy="70" r="4" />
            <circle cx="820" cy="65" r="4" />
            <circle cx="790" cy="90" r="4" />
            <line x1="754" y1="70" x2="786" y2="86" />
            <line x1="816" y1="68" x2="794" y2="86" />
          </g>

          {/* Underlying Guide Curves (Architectural trajectories, low opacity) */}
          <path d="M -100 100 C 350 250, 750 -50, 1100 150" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1" fill="none" className="drift-1" />
          <path d="M -100 500 C 500 550, 800 150, 1100 100" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1" fill="none" className="drift-2" />
          <path d="M 300 -100 C 250 250, 650 350, 850 700" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1" fill="none" className="drift-3" />
          <path d="M -100 350 C 400 300, 600 50, 1100 450" stroke="rgba(220, 220, 220, 0.05)" strokeWidth="1" fill="none" className="drift-4" />

          {/* Silver Light Flow Trails */}
          <path d="M -100 100 C 350 250, 750 -50, 1100 150" stroke="url(#silverGradient)" strokeWidth="1.5" fill="none" className="flow-trail-1" />
          <path d="M -100 500 C 500 550, 800 150, 1100 100" stroke="url(#silverGradient)" strokeWidth="1.5" fill="none" className="flow-trail-2" />
          <path d="M 300 -100 C 250 250, 650 350, 850 700" stroke="url(#silverGradient)" strokeWidth="1.5" fill="none" className="flow-trail-3" />
          <path d="M -100 350 C 400 300, 600 50, 1100 450" stroke="url(#silverGradient)" strokeWidth="1.5" fill="none" className="flow-trail-4" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {t('education.title')}
          </h4>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            {t('education.subtitle')}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {isEn
              ? 'Chronology of the educational journey in law and software fields'
              : 'Hukuk ve yazılım alanındaki eğitim yolculuğunun kronolojisi'}
          </p>
        </div>

        {/* Timeline Core */}
        <div className="timeline-container">
          <div className="timeline-line" />
          
          {timelineItems.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-dot" />
              
              <div className="timeline-content">
                {/* Header info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    style={{
                      background: 'var(--color-burgundy)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    {item.year}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {item.badge}
                  </span>
                </div>

                {/* Body info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(240, 218, 197, 0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-burgundy)',
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
export default Education;
