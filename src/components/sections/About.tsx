import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, Search, BookOpen } from 'lucide-react';

export const About: React.FC = () => {
  const { t, language } = useApp();
  const isEn = language === 'en';

  return (
    <section
      id="about"
      style={{
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
          
          {/* Left Column: Visual details (Cards displaying specialized skill points) */}
          <div
            className="about-grid"
            style={{
              position: 'relative'
            }}
          >
            {/* Background design circle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(80, 34, 60, 0.05) 0%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: -1
              }}
            />

            {/* Block 1: Hukuki Birikim */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-burgundy)',
                  marginBottom: '16px'
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'Legal Expertise' : 'Hukuki Birikim'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn 
                  ? 'Professional knowledge continuously updated through regular tracking of current legislation, Constitutional Court, Court of Cassation, and Council of State decisions.'
                  : 'Güncel mevzuat, Anayasa Mahkemesi, Yargıtay ve Danıştay kararlarının düzenli takibi ile sürekli güncellenen mesleki bilgi birikimi.'}
              </p>
            </div>

            {/* Block 2: Akademik Gelişim */}
            <div
              className="glass-card about-card-offset"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(28, 35, 64, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-color)',
                  marginBottom: '16px'
                }}
              >
                <GraduationCap size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'Academic Growth' : 'Akademik Gelişim'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn 
                  ? 'Supporting the academic background acquired during bachelor\'s and master\'s degrees with continuous education and scientific studies.'
                  : 'Lisans ve yüksek lisans sürecinde edinilen akademik altyapının sürekli eğitim ve bilimsel çalışmalarla desteklenmesi.'}
              </p>
            </div>

            {/* Block 3: Hukuki Araştırma */}
            <div
              className="glass-card about-card-offset-negative"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-burgundy)',
                  marginBottom: '16px'
                }}
              >
                <Search size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'Legal Research' : 'Hukuki Araştırma'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn
                  ? 'A comprehensive legal research approach in line with laws, regulations, doctrinal views, and current precedents.'
                  : 'Kanunlar, yönetmelikler, doktrin görüşleri ve güncel içtihatlar doğrultusunda kapsamlı hukuki araştırma anlayışı.'}
              </p>
            </div>

            {/* Block 4: Bilgi Merkezi */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(28, 35, 64, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-color)',
                  marginBottom: '16px'
                }}
              >
                <BookOpen size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'Information Center' : 'Bilgi Merkezi'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn
                  ? 'Sharing the current legal agenda through articles, legal evaluations, landmark decision analyses, and informative content.'
                  : 'Makaleler, hukuki değerlendirmeler, emsal karar analizleri ve bilgilendirici içeriklerle güncel hukuk gündeminin paylaşılması.'}
              </p>
            </div>

          </div>

          {/* Right Column: Detailed Story */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isEn ? 'Legal Vision' : 'Hukuki Vizyon'}
            </h4>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: '1.2', color: 'var(--text-primary)' }}>
              {t('about.title')}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {t('about.desc1')}
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {t('about.desc2')}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, marginTop: '10px' }}>
              {[
                t('about.point1'),
                t('about.point2'),
                t('about.point3'),
                t('about.point4')
              ].map((point, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--color-burgundy)',
                      display: 'inline-block'
                    }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};
