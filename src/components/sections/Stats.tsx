import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Briefcase, CodeXml, FileText, CheckCircle } from 'lucide-react';

export const Stats: React.FC = () => {
  const { t, language } = useApp();
  const isEn = language === 'en';

  const statsItems = [
    {
      num: '2',
      label: t('stats.diplomas'),
      sub: isEn ? 'Law & Software Engineering' : 'Hukuk & Yazılım Mühendisliği',
      icon: <Award size={24} />
    },
    {
      num: '1',
      label: t('stats.masters'),
      sub: isEn ? 'Private Law Department' : 'Özel Hukuk Anabilim Dalı',
      icon: <CheckCircle size={24} />
    },
    {
      num: isEn ? 'Active' : 'Aktif',
      label: t('stats.cmk'),
      sub: isEn ? 'Istanbul Bar Representation' : 'İstanbul Barosu Temsili',
      icon: <Briefcase size={24} />
    },
    {
      num: '5+',
      label: t('stats.projects'),
      sub: isEn ? 'Automations & AI Integrations' : 'Otomasyon ve AI Entegrasyonları',
      icon: <CodeXml size={24} />
    },
    {
      num: '50+',
      label: t('stats.content'),
      sub: isEn ? 'Articles, Petitions & Analyses' : 'Makale, Dilekçe ve Analiz',
      icon: <FileText size={24} />
    }
  ];

  return (
    <section
      id="stats"
      style={{
        padding: '80px 0',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Statistics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px'
          }}
        >
          {statsItems.map((item, idx) => (
            <div
              key={idx}
              className="glass-card glow-on-hover"
              style={{
                padding: '30px 24px',
                textAlign: 'center',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              {/* Icon Wrap */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'rgba(80, 34, 60, 0.1)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '6px'
                }}
              >
                {item.icon}
              </div>

              {/* Number */}
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  color: 'var(--color-burgundy)',
                  lineHeight: '1'
                }}
              >
                {item.num}
              </h2>

              {/* Label Info */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {item.label}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  {item.sub}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default Stats;
