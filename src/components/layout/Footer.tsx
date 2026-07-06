import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, MapPin, Clock, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, language, setIsCookieModalOpen } = useApp();
  const isEn = language === 'en';

  const handleNav = (route: string) => {
    navigateTo(route as any);
  };

  return (
    <footer
      style={{
        background: 'var(--color-dark-navy)',
        color: '#FFFFFF',
        padding: '90px 40px 40px',
        borderTop: '1px solid rgba(240, 218, 197, 0.15)',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Silver technological line animations */}
      <svg 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none', 
          zIndex: 0 
        }} 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          className="footer-trail-1" 
          d="M -100,50 C 400,190 800,20 1600,100" 
          fill="none" 
          stroke="rgba(240, 218, 197, 0.12)" 
          strokeWidth="1.5" 
        />
        <path 
          className="footer-trail-2" 
          d="M -50,230 C 500,100 1000,290 1700,140" 
          fill="none" 
          stroke="rgba(240, 218, 197, 0.09)" 
          strokeWidth="1" 
        />
      </svg>

      <div
        className="footer-grid"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gap: '40px'
        }}
      >
        {/* Column 1: Brand Area (sol marka alanı) */}
        <div className="footer-col-brand" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="/monogram-ea.png" 
              alt="EA Monogram" 
              style={{ 
                height: '42px', 
                width: 'auto', 
                objectFit: 'contain',
                display: 'block'
              }} 
            />
            <span 
              style={{ 
                fontFamily: 'Outfit', 
                fontSize: '18px', 
                fontWeight: 700, 
                color: '#F0DAC5',
                letterSpacing: '0.02em'
              }}
            >
              Avukat Eren Akarsu
            </span>
          </div>

          {/* Social media icons with premium custom inline SVGs */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <a 
              href="https://www.linkedin.com/in/erenakarsu/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-icon"
              title="LinkedIn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a 
              href="https://github.com/eren-akarsu" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-icon"
              title="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a 
              href="mailto:erenakarsu@istanbul.av.tr" 
              className="footer-social-icon"
              title="E-posta"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-icon"
              title="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Kurumsal */}
        <div className="footer-col-links">
          <h4 className="footer-heading" style={{ fontFamily: 'Outfit', fontSize: '13px', marginBottom: '22px', textTransform: 'uppercase' }}>
            {isEn ? 'Corporate' : 'Kurumsal'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', padding: 0 }}>
            <li>
              <span onClick={() => handleNav('home')} className="footer-link">
                {isEn ? 'Homepage' : 'Anasayfa'}
              </span>
            </li>
            <li>
              <a href="#about" onClick={() => handleNav('home')} className="footer-link" style={{ textDecoration: 'none' }}>
                {isEn ? 'About Me' : 'Hakkımda'}
              </a>
            </li>
            <li>
              <a href="#practice" onClick={() => handleNav('home')} className="footer-link" style={{ textDecoration: 'none' }}>
                {isEn ? 'Practice Areas' : 'Faaliyet Alanları'}
              </a>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Legal Content Hub' : 'Hukuki İçerikler'}
              </span>
            </li>
            <li>
              <a href="#appointment" onClick={() => handleNav('home')} className="footer-link" style={{ textDecoration: 'none' }}>
                {isEn ? 'Online Appointment' : 'Online Randevu'}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={() => handleNav('home')} className="footer-link" style={{ textDecoration: 'none' }}>
                {isEn ? 'Contact & Office' : 'İletişim'}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Hukuki İçerikler */}
        <div className="footer-col-links">
          <h4 className="footer-heading" style={{ fontFamily: 'Outfit', fontSize: '13px', marginBottom: '22px', textTransform: 'uppercase' }}>
            {isEn ? 'Legal Content' : 'Hukuki İçerikler'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', padding: 0 }}>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Articles' : 'Makaleler'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Petition Templates' : 'Dilekçe ve Doküman Örnekleri'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Legal Assessments' : 'Hukuki Değerlendirmeler'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Court Decisions' : 'Yargı Kararları'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Law & Precedent Analyses' : 'Kanun ve İçtihat Analizleri'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('knowledge-hub')} className="footer-link">
                {isEn ? 'Practice Notes' : 'Meslekten Notlar'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('hukuki-hesaplama-araclari')} className="footer-link">
                {isEn ? 'Legal Calculators' : 'Hukuki Hesaplama Araçları'}
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Yasal Bilgilendirmeler */}
        <div className="footer-col-links">
          <h4 className="footer-heading" style={{ fontFamily: 'Outfit', fontSize: '13px', marginBottom: '22px', textTransform: 'uppercase' }}>
            {isEn ? 'Legal Disclosures' : 'Yasal Bilgilendirmeler'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', padding: 0 }}>
            <li>
              <span onClick={() => handleNav('kvkk-aydinlatma-metni')} className="footer-link">
                {isEn ? 'KVKK Clarification Text' : 'KVKK Aydınlatma Metni'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('acik-riza-metni')} className="footer-link">
                {isEn ? 'Explicit Consent Form' : 'Açık Rıza Metni'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('cerez-politikasi')} className="footer-link">
                {isEn ? 'Cookie Policy' : 'Çerez Politikası'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('kullanim-kosullari')} className="footer-link">
                {isEn ? 'Terms of Use' : 'Kullanım Koşulları'}
              </span>
            </li>
            <li>
              <span onClick={() => handleNav('sorumluluk-reddi-beyani')} className="footer-link">
                {isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı'}
              </span>
            </li>
            <li>
              <span onClick={() => setIsCookieModalOpen(true)} className="footer-link">
                {isEn ? 'Cookie Preferences' : 'Çerez Tercihleri'}
              </span>
            </li>
          </ul>
        </div>

        {/* Column 5: İletişim */}
        <div className="footer-col-links">
          <h4 className="footer-heading" style={{ fontFamily: 'Outfit', fontSize: '13px', marginBottom: '22px', textTransform: 'uppercase' }}>
            {isEn ? 'Contact' : 'İletişim'}
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', color: '#A0AEC0', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
              <a href="mailto:erenakarsu@istanbul.av.tr" style={{ color: 'inherit', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F0DAC5'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                erenakarsu@istanbul.av.tr
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
              <a href="tel:02167556334" style={{ color: 'inherit', textDecoration: 'none', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.color = '#F0DAC5'} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                0216 755 63 34
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={14} style={{ color: '#F0DAC5', flexShrink: 0, marginTop: '2px' }} />
              <span>{isEn ? 'Istanbul, Turkey' : 'İstanbul, Türkiye'}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
              <span>10:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Legal Bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '60px auto 0',
          paddingTop: '30px',
          borderTop: '1px solid rgba(240, 218, 197, 0.15)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        <p 
          style={{ 
            fontSize: '11px', 
            color: '#A0AEC0', 
            lineHeight: '1.6', 
            maxWidth: '900px', 
            margin: '0 auto' 
          }}
        >
          {isEn 
            ? 'All rights of our website are reserved. You can share our articles by providing a link indicating that you have quoted. Legal action will be initiated in case of quoting from our articles without referencing the source.'
            : 'Web sitemizin tüm hakları saklıdır. Alıntı yaptığınıza ilişkin link vermek suretiyle makalelerimizi paylaşabilirsiniz. Kaynak belirtmeksizin makalelerimizden alıntı yapılması durumunda yasal işlem başlatılmaktadır.'
          }
        </p>
      </div>

      {/* Scoped CSS styling for grid columns, headers, social buttons and trails */}
      <style>{`
        .footer-grid {
          grid-template-columns: repeat(12, 1fr);
        }
        .footer-col-brand {
          grid-column: span 3;
        }
        .footer-col-links:nth-of-type(2) {
          grid-column: span 2;
        }
        .footer-col-links:nth-of-type(3) {
          grid-column: span 2;
        }
        .footer-col-links:nth-of-type(4) {
          grid-column: span 2;
        }
        .footer-col-links:nth-of-type(5) {
          grid-column: span 3;
        }

        .footer-heading {
          color: #FFFFFF;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.45), 0 0 1px rgba(255, 255, 255, 0.7);
          font-weight: 700;
          letter-spacing: 0.08em;
          position: relative;
          display: inline-block;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -6px;
          width: 28px;
          height: 1.5px;
          background: linear-gradient(90deg, #F0DAC5, transparent);
        }

        .footer-social-icon {
          color: #A0AEC0;
          border: 1px solid rgba(240, 218, 197, 0.15);
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          text-decoration: none;
          background: rgba(28, 35, 64, 0.35);
          backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .footer-social-icon:hover {
          color: #F0DAC5;
          border-color: #50223C;
          background: rgba(80, 34, 60, 0.25);
          box-shadow: 0 0 10px rgba(80, 34, 60, 0.4);
          transform: scale(1.08);
        }
        .footer-link {
          cursor: pointer;
          color: #A0AEC0;
          position: relative;
          display: inline-block;
          transition: color 0.25s ease;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 1px;
          background-color: #50223C;
          transition: width 0.25s ease;
        }
        .footer-link:hover {
          color: #F0DAC5;
        }
        .footer-link:hover::after {
          width: 100%;
        }

        /* technological line flow animation keyframes */
        @keyframes footerLineFlow {
          0% {
            stroke-dashoffset: 1200;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .footer-trail-1 {
          stroke-dasharray: 120 800;
          animation: footerLineFlow 25s linear infinite;
        }
        .footer-trail-2 {
          stroke-dasharray: 150 750;
          animation: footerLineFlow 35s linear infinite reverse;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 30px;
          }
          .footer-col-brand {
            grid-column: span 3;
          }
          .footer-col-links {
            grid-column: span 3 !important;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }
          .footer-col-brand {
            grid-column: 1 / -1;
            align-items: center;
            text-align: center;
          }
          .footer-col-brand > div {
            justify-content: center;
          }
          .footer-col-links {
            grid-column: 1 / -1 !important;
            text-align: center;
          }
          .footer-col-links ul {
            align-items: center;
          }
          .footer-col-links ul li a, .footer-col-links ul li span {
            display: inline-block;
          }
        }
      `}</style>
    </footer>
  );
};
export default Footer;
