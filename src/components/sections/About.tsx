import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Cpu, Code, BookOpen } from 'lucide-react';

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
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
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

            {/* Block 1: Hukukçu Persona */}
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
                  ? 'Deep follow-up on latest legislation and precedent dynamics in first-instance and supreme judicial authorities.'
                  : 'İlk derece ve yüksek yargı mercilerindeki güncel mevzuatı ve içtihat dinamiklerini derinlemesine takip.'}
              </p>
            </div>

            {/* Block 2: Yazılımcı Persona */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)',
                marginTop: '30px'
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
                <Code size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'Software Mastery' : 'Yazılım Uzmanlığı'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn 
                  ? 'Active development expertise in TypeScript, React, Next.js, and advanced artificial intelligence integrations.'
                  : 'TypeScript, React, Next.js ve yapay zekâ entegrasyonu alanlarında aktif geliştirme yetkinliği.'}
              </p>
            </div>

            {/* Block 3: LegalTech entegrasyonu */}
            <div
              className="glass-card"
              style={{
                padding: '24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)',
                transform: 'translateY(-30px)'
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
                <Cpu size={20} />
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {isEn ? 'LegalTech Oriented' : 'LegalTech Odaklı'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn
                  ? 'Developing smart contract analysis tools, custom legal CRM applications, and AI-powered advice systems.'
                  : 'Hukuki otomasyon sistemleri, sözleşme analiz araçları ve yapay zekâ destekli asistanların geliştirilmesi.'}
              </p>
            </div>

            {/* Block 4: Bilgi paylaşımı */}
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
                {isEn ? 'Resource & Blog' : 'Kütüphane & Blog'}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {isEn
                  ? 'A digital information center sharing petition templates, legislative analysis, and current precedent rulings.'
                  : 'Dilekçe örnekleri, kanun analizleri ve güncel içtihat kararlarının paylaşıldığı dijital bilgi merkezi.'}
              </p>
            </div>

          </div>

          {/* Right Column: Detailed Story */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isEn ? 'Visionary Approach' : 'Vizyoner Yaklaşım'}
            </h4>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', lineHeight: '1.2', color: 'var(--text-primary)' }}>
              {t('about.title')}
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {t('about.description')}
            </p>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              {isEn 
                ? "In today's world where digital transformation is reshaping every sector, I combine the legal and IT worlds. I am not just a lawyer resolving disputes, but also a builder designing tech infrastructures to boost the operational efficiency of those processes."
                : "Dijital dönüşümün her sektörü yeniden şekillendirdiği günümüzde, hukuk ve bilişim dünyasını tek potada eritiyorum. Sadece hukuki sorunları çözen bir avukat değil, aynı zamanda o süreçlerin operasyonel verimliliğini artıran teknolojik altyapılar tasarlıyorum."}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, marginTop: '10px' }}>
              {[
                t('about.point1'),
                t('about.point2'),
                t('about.point3')
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
