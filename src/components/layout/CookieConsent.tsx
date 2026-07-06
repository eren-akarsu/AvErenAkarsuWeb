import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Check, Settings } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const { 
    cookieConsent, 
    saveCookieConsent, 
    isCookieModalOpen, 
    setIsCookieModalOpen,
    theme,
    language,
    showToast,
    navigateTo
  } = useApp();

  const [showBanner, setShowBanner] = useState(false);
  
  // Local preferences state for modal
  const [prefEssential] = useState(true); // Always locked to true
  const [prefPreferences, setPrefPreferences] = useState(false);
  const [prefAnalytics, setPrefAnalytics] = useState(false);
  const [prefFunctional, setPrefFunctional] = useState(false);

  useEffect(() => {
    // Show banner if no consent history exists
    if (!cookieConsent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [cookieConsent]);

  useEffect(() => {
    // If modal is opened, sync preferences from saved consent state (or defaults)
    if (isCookieModalOpen) {
      if (cookieConsent) {
        setPrefPreferences(cookieConsent.preferences);
        setPrefAnalytics(cookieConsent.analytics);
        setPrefFunctional(cookieConsent.functional);
      } else {
        setPrefPreferences(false);
        setPrefAnalytics(false);
        setPrefFunctional(false);
      }
    }
  }, [isCookieModalOpen, cookieConsent]);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      preferences: true,
      analytics: true,
      functional: true
    };
    saveCookieConsent(consent);
    showToast(language === 'en' ? 'All cookies accepted.' : 'Tüm çerezler kabul edildi.', 'success');
    setShowBanner(false);
    setIsCookieModalOpen(false);
  };

  const handleAcceptEssentialOnly = () => {
    const consent = {
      essential: true,
      preferences: false,
      analytics: false,
      functional: false
    };
    saveCookieConsent(consent);
    showToast(language === 'en' ? 'Only necessary cookies will be used.' : 'Sadece zorunlu çerezler kabul edildi.', 'success');
    setShowBanner(false);
    setIsCookieModalOpen(false);
  };

  const handleSavePreferences = () => {
    const consent = {
      essential: true,
      preferences: prefPreferences,
      analytics: prefAnalytics,
      functional: prefFunctional
    };
    saveCookieConsent(consent);
    showToast(language === 'en' ? 'Cookie preferences saved.' : 'Çerez tercihleriniz kaydedildi.', 'success');
    setShowBanner(false);
    setIsCookieModalOpen(false);
  };

  if (!showBanner && !isCookieModalOpen) {
    return null;
  }

  return (
    <>
      {/* 1. COOKIE INFORMATIONAL BANNER */}
      {showBanner && !isCookieModalOpen && (
        <div
          className="cookie-banner-container"
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: '24px',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            padding: '0 16px',
            pointerEvents: 'none'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '1200px',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-color)',
              background: theme === 'dark' ? 'rgba(28, 35, 64, 0.7)' : 'rgba(250, 246, 240, 0.75)',
              backdropFilter: 'blur(16px)',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'slideUp 0.4s ease'
            }}
          >
            {/* Header info inside banner */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(80, 34, 60, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-burgundy)',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {language === 'en' ? 'Cookie Information Notice' : 'Çerez Aydınlatma Metni'}
                </h4>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {language === 'en' ? (
                    <>
                      We use cookies to improve user experience, remember preferences, ensure website security, and improve our services. Cookies other than necessary cookies will be used based on your choice. For detailed information, you can review{' '}
                      <span
                        onClick={() => navigateTo('cerez-politikasi')}
                        style={{
                          color: 'var(--color-burgundy)',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        our Cookie Policy
                      </span>
                      .
                    </>
                  ) : (
                    <>
                      Web sitemizde kullanıcı deneyimini geliştirmek, tercihlerinizi hatırlamak, site güvenliğini sağlamak ve hizmetlerimizi iyileştirmek amacıyla çerezler kullanılmaktadır. Zorunlu çerezler dışında kalan çerezler, tercihinize bağlı olarak kullanılacaktır. Detaylı bilgi için{' '}
                      <span
                        onClick={() => navigateTo('cerez-politikasi')}
                        style={{
                          color: 'var(--color-burgundy)',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                      >
                        Çerez Politikamızı
                      </span>{' '}
                      inceleyebilirsiniz.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="cookie-buttons-row">
              <button
                onClick={handleAcceptAll}
                className="btn-primary"
                style={{ height: '40px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {language === 'en' ? 'Accept All' : 'Tümünü Kabul Et'}
              </button>
              
              <button
                onClick={handleAcceptEssentialOnly}
                className="btn-secondary"
                style={{ height: '40px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {language === 'en' ? 'Continue with Necessary Cookies' : 'Zorunlu Çerezlerle Devam Et'}
              </button>

              <button
                onClick={() => setIsCookieModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '40px',
                  padding: '0 8px',
                  textDecoration: 'underline',
                  transition: 'var(--transition-fast)'
                }}
                className="cookie-pref-btn"
              >
                <Settings size={14} /> {language === 'en' ? 'Manage Preferences' : 'Tercihlerimi Yönet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. COOKIE PREFERENCES MODAL OVERLAY */}
      {isCookieModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Modal Panel Box */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)',
              background: theme === 'dark' ? 'rgba(10, 13, 24, 0.98)' : 'rgba(250, 246, 240, 0.98)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '24px 28px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} style={{ color: 'var(--color-burgundy)' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {language === 'en' ? 'Cookie Preferences' : 'Çerez Tercihleri'}
                </h3>
              </div>
              <button
                onClick={() => setIsCookieModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                {language === 'en'
                  ? 'We value your privacy. Cookies other than necessary cookies will only be used if you choose to. You can review the cookie categories below and manage your preferences as you wish.'
                  : 'Gizliliğinize önem veriyoruz. İnternet sitemizde zorunlu çerezler dışında kalan çerezler, yalnızca tercih etmeniz halinde kullanılacaktır. Aşağıdan çerez kategorilerini inceleyebilir ve tercihlerinizi dilediğiniz şekilde yönetebilirsiniz.'}
              </p>

              {/* Preference Categories List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 1. Essential (Locked) */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(80, 34, 60, 0.02)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'en' ? 'Necessary Cookies' : 'Zorunlu Çerezler'}
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {language === 'en'
                        ? 'These cookies are required for the secure and proper functioning of the website. They cannot be disabled.'
                        : 'Bu çerezler internet sitesinin güvenli ve düzgün çalışması için gereklidir. Devre dışı bırakılamaz.'}
                    </span>
                  </div>
                  {/* Toggle Locked to ON */}
                  <div
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '15px',
                      background: 'var(--color-burgundy)',
                      opacity: 0.65,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 3px',
                      justifyContent: 'flex-end',
                      cursor: 'not-allowed'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF' }} />
                  </div>
                </div>

                {/* 2. Preferences */}
                <div
                  onClick={() => setPrefPreferences(!prefPreferences)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: prefPreferences ? 'rgba(80, 34, 60, 0.04)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'en' ? 'Preference Cookies' : 'Tercih Çerezleri'}
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {language === 'en'
                        ? 'Used to remember your language, theme, and display preferences.'
                        : 'Dil, tema ve görünüm tercihlerinizi hatırlamak için kullanılır.'}
                    </span>
                  </div>
                  {/* Toggle */}
                  <div
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '15px',
                      background: prefPreferences ? 'var(--color-burgundy)' : '#A0AEC0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 3px',
                      justifyContent: prefPreferences ? 'flex-end' : 'flex-start',
                      transition: 'all 0.2s ease',
                      marginTop: '2px'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>

                {/* 3. Analytics */}
                <div
                  onClick={() => setPrefAnalytics(!prefAnalytics)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: prefAnalytics ? 'rgba(80, 34, 60, 0.04)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'en' ? 'Analytics Cookies' : 'Analitik Çerezler'}
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {language === 'en'
                        ? 'Helps us improve our services by analyzing how our website is used.'
                        : 'İnternet sitemizin kullanımını analiz ederek hizmetlerimizi geliştirmemize yardımcı olur.'}
                    </span>
                  </div>
                  {/* Toggle */}
                  <div
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '15px',
                      background: prefAnalytics ? 'var(--color-burgundy)' : '#A0AEC0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 3px',
                      justifyContent: prefAnalytics ? 'flex-end' : 'flex-start',
                      transition: 'all 0.2s ease',
                      marginTop: '2px'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>

                {/* 4. Functional */}
                <div
                  onClick={() => setPrefFunctional(!prefFunctional)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: prefFunctional ? 'rgba(80, 34, 60, 0.04)' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'en' ? 'Functional Cookies' : 'İşlevsel Çerezler'}
                    </span>
                    <span style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                      {language === 'en'
                        ? 'Helps advanced features like chatbots, appointments, quick access, and similar functions run more efficiently.'
                        : 'Chatbot, randevu, hızlı erişim ve benzeri gelişmiş özelliklerin daha verimli çalışmasına yardımcı olur.'}
                    </span>
                  </div>
                  {/* Toggle */}
                  <div
                    style={{
                      width: '40px',
                      height: '22px',
                      borderRadius: '15px',
                      background: prefFunctional ? 'var(--color-burgundy)' : '#A0AEC0',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 3px',
                      justifyContent: prefFunctional ? 'flex-end' : 'flex-start',
                      transition: 'all 0.2s ease',
                      marginTop: '2px'
                    }}
                  >
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer (Buttons) */}
            <div
              style={{
                padding: '20px 28px',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'flex-end'
              }}
              className="cookie-modal-actions"
            >
              <button
                onClick={handleAcceptEssentialOnly}
                className="btn-secondary"
                style={{ height: '38px', fontSize: '13px' }}
              >
                {language === 'en' ? 'Necessary Cookies Only' : 'Sadece Zorunlu Çerezler'}
              </button>

              <button
                onClick={handleSavePreferences}
                className="btn-secondary"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  borderColor: 'var(--color-burgundy)',
                  color: 'var(--color-burgundy)'
                }}
              >
                {language === 'en' ? 'Save Preferences' : 'Seçimlerimi Kaydet'}
              </button>

              <button
                onClick={handleAcceptAll}
                className="btn-primary"
                style={{ height: '38px', fontSize: '13px' }}
              >
                {language === 'en' ? 'Accept All' : 'Tümünü Kabul Et'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styled JSX for Responsive Cookie Elements */}
      <style>{`
        .cookie-buttons-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        @media (max-width: 767px) {
          .cookie-buttons-row {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .cookie-pref-btn {
            justify-content: center;
          }
          .cookie-modal-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};
