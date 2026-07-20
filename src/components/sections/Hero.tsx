import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Calendar, BookOpen, Scale } from 'lucide-react';
import { HeroPhotoCarousel } from './HeroPhotoCarousel';

export const Hero: React.FC = () => {
  const { t, navigateTo, siteSettings } = useApp();

  return (
    <section
      id="hero"
      style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(circle at 80% 20%, rgba(80, 34, 60, 0.15) 0%, transparent 60%)',
        position: 'relative',
        padding: '120px 0 80px',
        overflow: 'hidden'
      }}
    >
      {/* Background visual shapes */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240, 218, 197, 0.08) 0%, transparent 80%)',
          filter: 'blur(40px)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          
          {/* Left Text Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(80, 34, 60, 0.1)',
                border: '1px solid var(--border-color)',
                borderRadius: '30px',
                padding: '6px 16px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-burgundy)'
              }}
            >
              <Scale size={14} /> {t('hero.badge')}
            </div>

            <h1
              className="burgundy-gradient-text"
              style={{
                fontSize: 'clamp(40px, 5vw, 64px)',
                lineHeight: '1.1',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 800
              }}
            >
              {siteSettings?.homepage_settings?.heroTitle || t('hero.title')}
            </h1>

            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: 'var(--text-secondary)',
                maxWidth: '520px'
              }}
            >
              {siteSettings?.homepage_settings?.heroDescription || t('hero.description')}
            </p>

            {/* CTA Action Buttons */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
              <a href="#appointment" className="btn-primary">
                <Calendar size={18} /> {t('hero.cta.appointment')}
              </a>
              <button onClick={() => navigateTo('knowledge-hub')} className="btn-secondary">
                <BookOpen size={18} /> {t('hero.cta.blog')}
              </button>
            </div>

            {/* Micro Details (academic degree cards) */}
            <div
              style={{
                display: 'flex',
                gap: '30px',
                marginTop: '30px',
                paddingTop: '30px',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <div>
                <h4 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--accent-color)' }}>
                  2024
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {useApp().language === 'en' ? 'Second in Class' : 'Fakülte İkincisi'}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--accent-color)' }}>
                  {useApp().language === 'en' ? 'Double Major' : 'Çift Anadal'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {useApp().language === 'en' ? 'Law & Software Eng.' : 'Hukuk & Yazılım Müh.'}
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--accent-color)' }}>
                  {useApp().language === 'en' ? 'Private Law' : 'Özel Hukuk'}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {useApp().language === 'en' ? 'LL.M Master Program' : 'Yüksek Lisans Programı'}
                </p>
              </div>
            </div>

          </div>

          {/* Right Graphical Column (Premium dynamic 3D photo carousel) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              width: '100%',
              overflow: 'visible'
            }}
          >
            <HeroPhotoCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};
