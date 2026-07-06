import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Phone, MapPin, Clock, Send, ShieldCheck, Check } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

export const ContactForm: React.FC = () => {
  const { t, language, showToast, navigateTo } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const isEn = language === 'en';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !subject || !message || !kvkkChecked) {
      showToast(isEn ? 'Please fill in all fields and check the GDPR approval box.' : 'Lütfen tüm alanları doldurun ve KVKK onay kutusunu işaretleyin.', 'warning');
      return;
    }

    setIsSent(true);
    showToast(isEn ? 'Your message has been sent successfully.' : 'Mesajınız başarıyla gönderildi.', 'success');

    setTimeout(() => {
      setIsSent(false);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
      setKvkkChecked(false);
    }, 4000);
  };

  return (
    <section
      id="contact"
      style={{
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {t('contact.title')}
          </h4>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            {isEn ? 'Legal Consultancy & Contact' : 'Hukuki Danışmanlık ve İletişim'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid-2" style={{ gap: '50px' }}>
          
          {/* Left Column: Info Cards and Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Info Cards Row */}
            <div className="form-grid-2" style={{ gap: '20px' }}>
              
              {/* Card 1: Phone */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <Phone size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{isEn ? 'Phone' : 'Telefon'}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>+90 (212) 555 44 33</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>WhatsApp: +90 532 123 45 67</p>
              </div>

              {/* Card 2: Email */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <Mail size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{isEn ? 'Email' : 'E-posta'}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>contact@erenakarsu.av.tr</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>maliye@erenakarsu.av.tr</p>
              </div>

              {/* Card 3: Address */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <MapPin size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{isEn ? 'Office Address' : 'Ofis Adresi'}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isEn ? 'AHIM Law Firm' : 'AHİM Hukuk Bürosu'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{isEn ? 'Besiktas / Istanbul' : 'Beşiktaş / İstanbul'}</p>
              </div>

              {/* Card 4: Hours */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
                <Clock size={20} style={{ color: 'var(--color-burgundy)', marginBottom: '12px' }} />
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>{isEn ? 'Working Hours' : 'Çalışma Saatleri'}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{isEn ? 'Weekdays: 09:00 - 18:00' : 'Hafta İçi: 09:00 - 18:00'}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{isEn ? 'Weekends: Closed' : 'Hafta Sonu: Kapalı'}</p>
              </div>

            </div>

            {/* Premium map graphic/mockup representing Beşiktaş */}
            <div
              className="glass-card"
              style={{
                height: '220px',
                border: '1px solid var(--glass-border)',
                background: 'linear-gradient(135deg, var(--color-dark-navy) 0%, var(--color-burgundy) 100%)',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                color: '#FFFFFF'
              }}
            >
              <div>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#F0DAC5', letterSpacing: '0.1em' }}>
                  {isEn ? 'Location Verification' : 'Konum Doğrulama'}
                </span>
                <h3 style={{ fontSize: '20px', fontFamily: 'Outfit', fontWeight: 700, marginTop: '8px', color: '#FFFFFF' }}>
                  {isEn ? 'Istanbul, Besiktas Office' : 'İstanbul, Beşiktaş Ofisi'}
                </h3>
                <p style={{ fontSize: '13px', color: '#A0AEC0', marginTop: '6px' }}>
                  {isEn 
                    ? 'Zorlu Center Towers Fl: 12, Besiktas / Istanbul, TR'
                    : 'Zorlu Center İş Kuleleri Kat: 12, Beşiktaş / İstanbul'}
                </p>
              </div>

              <button
                onClick={() => window.open('https://maps.google.com', '_blank')}
                className="btn-primary"
                style={{ alignSelf: 'flex-start', background: '#F0DAC5', color: '#1C2340', border: 'none' }}
              >
                {isEn ? 'Open in Maps (Google Maps)' : 'Haritada Aç (Google Maps)'}
              </button>
            </div>

          </div>

          {/* Right Column: Contact form panel */}
          <div className="glass-card" style={{ padding: '40px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
            
            {isSent ? (
              <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <Check size={28} style={{ margin: 'auto' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {t('contact.form.success')}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {isEn 
                    ? 'Your details have been securely logged in our database. We will respond within 24 hours.'
                    : 'Bilgileriniz veri veri tabanımıza şifreli olarak kaydedildi. En geç 24 saat içinde yanıt verilecektir.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                <div className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('contact.form.name')} *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "Your Name Surname" : "Adınız Soyadınız"}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('contact.form.phone')} *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="glass-input"
                      placeholder="05XX XXX XX XX"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('contact.form.email')} *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "mail@yourdomain.com" : "mail@adresiniz.com"}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('contact.form.subject')} *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "Message Subject" : "Mesaj Konusu"}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('contact.form.message')} *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="glass-input"
                    placeholder={isEn ? "Please describe your case in detail..." : "Lütfen mesajınızı detaylıca açıklayınız..."}
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                    required
                  />
                </div>

                {/* KVKK details */}
                <div style={{ margin: '4px 0', display: 'flex', justifyContent: 'flex-start' }}>
                  <CustomCheckbox
                    checked={kvkkChecked}
                    onChange={setKvkkChecked}
                    label={
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {isEn ? (
                          <>
                            I accept the{' '}
                            <span 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline' }}
                            >
                              Terms of Use
                            </span>{' '}
                            and{' '}
                            <span 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo('kvkk-aydinlatma-metni'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline' }}
                            >
                              KVKK Clarification Text
                            </span>.
                          </>
                        ) : (
                          <>
                            <span 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline' }}
                            >
                              Kullanım Koşulları
                            </span>
                            'nı ve{' '}
                            <span 
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateTo('kvkk-aydinlatma-metni'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline' }}
                            >
                              KVKK Aydınlatma Metni
                            </span>
                            'ni okuduğumu ve kabul ettiğimi beyan ederim.
                          </>
                        )}
                      </span>
                    }
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={16} /> {t('contact.form.send')}
                </button>

                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.4' }}>
                  {isEn ? (
                    <>
                      Before sending your message, you can review the{' '}
                      <span 
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        KVKK Clarification Text
                      </span>{' '}
                      and{' '}
                      <span 
                        onClick={() => navigateTo('cerez-politikasi')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Cookie Policy
                      </span>.
                    </>
                  ) : (
                    <>
                      Mesajınızı göndermeden önce{' '}
                      <span 
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        KVKK Aydınlatma Metni
                      </span>{' '}
                      ve{' '}
                      <span 
                        onClick={() => navigateTo('cerez-politikasi')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Çerez Politikası
                      </span>
                      'nı inceleyebilirsiniz.
                    </>
                  )}
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
export default ContactForm;
