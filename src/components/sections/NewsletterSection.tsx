import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, ShieldCheck } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

export const NewsletterSection: React.FC = () => {
  const { language, showToast, navigateTo } = useApp();
  const [email, setEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const isEn = language === 'en';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast(
        isEn ? 'Please enter a valid email address.' : 'Lütfen geçerli bir e-posta adresi giriniz.',
        'error'
      );
      return;
    }

    // Success notification
    showToast(
      isEn ? 'Your newsletter subscription request was successfully received.' : 'Abonelik talebiniz başarıyla alındı.',
      'success'
    );
    showToast(
      isEn ? 'You will be notified about legal contents and website updates.' : 'Hukuki içerikler ve site güncellemeleri hakkında bilgilendirileceksiniz.',
      'info'
    );
    
    setEmail('');
    setNewsletterConsent(false);
  };

  return (
    <section
      style={{
        padding: '60px 0 80px',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div
          className="glass-panel"
          style={{
            padding: '40px',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative'
          }}
        >
          {/* Layout Wrapper */}
          <div className="newsletter-grid">
            {/* Left Content Column */}
            <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(80, 34, 60, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-burgundy)'
                  }}
                >
                  <Mail size={16} />
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    fontFamily: 'Outfit, sans-serif',
                    color: 'var(--text-primary)',
                    margin: 0
                  }}
                >
                  {isEn ? 'Stay Informed of Legal Developments' : 'Hukuki Gelişmelerden Haberdar Olun'}
                </h3>
              </div>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                {isEn
                  ? 'Subscribe to get notified about new articles, legal precedents, court decisions, templates, and platform updates directly in your inbox.'
                  : 'Yeni makaleler, hukuki değerlendirmeler, yargı kararları, doküman örnekleri ve web sitemizdeki güncellemelerden haberdar olmak için e-posta adresinizle abonelik oluşturabilirsiniz.'}
              </p>
            </div>

            {/* Right Form Column */}
            <div style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px', width: '100%' }} className="newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? 'Enter your email address' : 'E-posta adresinizi yazın'}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'var(--transition-fast)'
                  }}
                  className="glass-input"
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '0 24px',
                    height: '45px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isEn ? 'Subscribe' : 'Abone Ol'}
                </button>
              </form>

              {/* Optional Explicit Consent (Açık Rıza) Checkbox for newsletter/marketing */}
              <div style={{ margin: '4px 0', display: 'flex', justifyContent: 'flex-start' }}>
                <CustomCheckbox
                  checked={newsletterConsent}
                  onChange={setNewsletterConsent}
                  label={
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {isEn ? (
                        <>
                          I consent to receive marketing communication in accordance with the{' '}
                          <span
                            onClick={(e) => { e.stopPropagation(); navigateTo('acik-riza-metni'); }}
                            style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            Explicit Consent Form
                          </span>. (Optional)
                        </>
                      ) : (
                        <>
                          Abonelik sistemi kapsamında duyuru ve bilgilendirme iletileri almayı{' '}
                          <span
                            onClick={(e) => { e.stopPropagation(); navigateTo('acik-riza-metni'); }}
                            style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                          >
                            Açık Rıza Metni
                          </span>{' '}
                          doğrultusunda kabul ediyorum. (İsteğe bağlı)
                        </>
                      )}
                    </span>
                  }
                />
              </div>

              {/* GDPR Clause note */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-burgundy)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '10px', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                  {isEn ? (
                    <>
                      By subscribing, you agree that you have been informed within the scope of the{' '}
                      <span
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        KVKK Clarification Text
                      </span>
                      .
                    </>
                  ) : (
                    <>
                      Abone olarak{' '}
                      <span
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                      >
                        KVKK Aydınlatma Metni
                      </span>{' '}
                      kapsamında bilgilendirildiğinizi kabul etmiş olursunuz.
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .newsletter-grid {
          display: flex;
          gap: 40px;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 991px) {
          .newsletter-grid {
            flex-direction: column;
            gap: 24px;
            align-items: stretch;
          }
        }
        @media (max-width: 575px) {
          .newsletter-form {
            flex-direction: column;
          }
          .newsletter-form button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
