import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CreditCard, Lock, Sparkles, CheckCircle, Plus, Minus } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

export const PaymentSystem: React.FC = () => {
  const { t, language, showToast, navigateTo } = useApp();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentTermsAccepted, setPaymentTermsAccepted] = useState(false);
  
  const isEn = language === 'en';

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  // Status simulation
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted.slice(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !amount || !cardNumber || !cardExpiry || !cardCvc) {
      showToast(isEn ? 'Please fill in all required fields.' : 'Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }
    if (!paymentTermsAccepted) {
      showToast(isEn ? 'Please read and accept the Terms of Use.' : 'Lütfen Kullanım Koşullarını okuyup onaylayın.', 'error');
      return;
    }

    setPaymentStatus('processing');
    
    // Simulate API payment authorization
    setTimeout(() => {
      setPaymentStatus('success');
      showToast(isEn ? 'Payment processed successfully!' : 'Ödeme başarıyla gerçekleştirildi!', 'success');
      
      // Reset after success
      setTimeout(() => {
        setPaymentStatus('idle');
        setFullName('');
        setPhone('');
        setAmount('');
        setDescription('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvc('');
        setPaymentTermsAccepted(false);
      }, 5000);
    }, 2500);
  };

  return (
    <section
      id="payment"
      style={{
        padding: '100px 0',
        background: 'var(--bg-secondary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {isEn ? 'Secure Payments' : 'Güvenli Ödeme Altyapısı'}
          </h4>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            {isEn ? 'Online Legal Payments' : 'Çevrimiçi Baro & Danışmanlık Ödemeleri'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
            {isEn
              ? 'Secure, encrypted transactions using advanced industry-standard payment gateways.'
              : 'Endüstri standardı şifrelenmiş geçitlerle dava masrafları, avans veya danışmanlık ödemeleri.'}
          </p>
        </div>

        {/* Outer Checkout Layout Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          
          {/* Form container */}
          <div className="glass-panel appointment-card" style={{ borderRadius: '20px', background: 'var(--bg-card)' }}>
            
            {paymentStatus === 'processing' ? (
              <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--color-burgundy)', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isEn ? 'Authorizing Payment...' : 'Ödeme Doğrulanıyor...'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Please do not close this window.' : 'Lütfen pencereyi kapatmayın.'}
                </p>
              </div>
            ) : paymentStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '50px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <CheckCircle size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isEn ? 'Payment Successful!' : 'Ödeme Başarılı!'}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                  {isEn ? 'Thank you. A transaction receipt has been sent to your record.' : 'Teşekkürler. İşlem makbuzu sistemde kayıtlı e-posta adresinize gönderilecektir.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Your Name Surname *' : 'Adınız Soyadınız *'}</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.slice(0, 25))}
                      className="glass-input"
                      placeholder={isEn ? "Client Name" : "Müvekkil Adı"}
                      style={{ width: '100%' }}
                      maxLength={25}
                      required
                    />
                    <div style={{ fontSize: '10px', color: fullName.length >= 25 ? 'var(--color-burgundy)' : 'var(--text-secondary)', alignSelf: 'flex-end', marginTop: '2px' }}>
                      {fullName.length} / 25
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Phone Number *' : 'Telefon Numarası *'}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="glass-input"
                      placeholder="05XX XXX XX XX"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Payment Amount (TL) *' : 'Ödeme Tutarı (TL) *'}</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="number"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="glass-input no-spinner"
                        placeholder="₺ 0.00"
                        style={{ width: '100%', paddingRight: '80px' }}
                        required
                      />
                      <div 
                        style={{ 
                          position: 'absolute', 
                          right: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px' 
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const val = Number(amount) || 0;
                            if (val > 0) {
                              setAmount(String(Math.max(0, val - 100)));
                            }
                          }}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(240, 218, 197, 0.05)',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(80, 34, 60, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(240, 218, 197, 0.05)'}
                        >
                          <Minus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const val = Number(amount) || 0;
                            setAmount(String(val + 100));
                          }}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'rgba(240, 218, 197, 0.05)',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(80, 34, 60, 0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(240, 218, 197, 0.05)'}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Description / Case No' : 'Açıklama / Dosya No'}</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "e.g. 2026/12 Case Advance" : "Örn: 2026/12 E. Avans veya Danışmanlık"}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Card input group */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Card Number *' : 'Kart Numarası *'}</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onFocus={() => setIsFlipped(false)}
                      className="glass-input"
                      placeholder="0000 0000 0000 0000"
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Expiry Date *' : 'Son Kullanma *'}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        onFocus={() => setIsFlipped(false)}
                        className="glass-input"
                        placeholder="AA/YY"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'CVC / Security Code *' : 'CVC / Güvenlik Kodu *'}</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        onFocus={() => setIsFlipped(true)}
                        onBlur={() => setIsFlipped(false)}
                        className="glass-input"
                        placeholder="***"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox for Terms and Conditions */}
                <div style={{ margin: '10px 0 6px', display: 'flex', justifyContent: 'flex-start' }}>
                  <CustomCheckbox
                    checked={paymentTermsAccepted}
                    onChange={setPaymentTermsAccepted}
                    label={
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {isEn ? (
                          <>
                            I accept the{' '}
                            <span 
                              onClick={(e) => { e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                            >
                              Terms of Use
                            </span>.
                          </>
                        ) : (
                          <>
                            <span 
                              onClick={(e) => { e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                              style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                            >
                              Kullanım Koşulları
                            </span>
                            'nı okuduğumu ve kabul ettiğimi beyan ederim.
                          </>
                        )}
                      </span>
                    }
                  />
                </div>

                {/* KVKK Information Text */}
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>
                  {isEn ? (
                    <>
                      Your personal data is processed within the scope of the{' '}
                      <span 
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        KVKK Clarification Text
                      </span>.
                    </>
                  ) : (
                    <>
                      Kişisel verileriniz{' '}
                      <span 
                        onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                        style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        KVKK Aydınlatma Metni
                      </span>{' '}
                      kapsamında işlenmektedir.
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={paymentStatus !== 'idle'}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Lock size={16} /> {isEn ? 'Pay Securely (3D Secure)' : 'Güvenli Ödeme Yap (3D Secure)'}
                </button>

                {/* Secure Trust indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--text-secondary)', fontSize: '11px', marginTop: '10px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} style={{ color: '#10B981' }} /> {isEn ? 'SSL Security Infrastructure' : 'SSL Güvenlik Altyapısı'}
                  </span>
                  <span>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={14} /> 3D Secure
                  </span>
                </div>

              </form>
            )}
            
          </div>

          {/* Right Column: Virtual Credit Card flip simulation */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                perspective: '1000px',
                width: '350px',
                height: '210px'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}
              >
                
                {/* Front Side */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--color-dark-navy) 0%, var(--color-burgundy) 100%)',
                    border: '1px solid rgba(240, 218, 197, 0.25)',
                    padding: '24px',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: '0.8' }}>
                      {isEn ? 'LegalTech Secure Card' : 'LegalTech Secure Card'}
                    </span>
                    <Sparkles size={20} style={{ color: '#F0DAC5' }} />
                  </div>
                  
                  {/* Card Number display */}
                  <div style={{ fontSize: '20px', fontFamily: 'monospace', letterSpacing: '0.1em', margin: '20px 0 10px' }}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', width: '100%', minWidth: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '8px', textTransform: 'uppercase', opacity: '0.6' }}>{isEn ? 'Cardholder' : 'Kart Sahibi'}</span>
                      <span 
                        style={{ 
                          fontSize: '13px', 
                          fontWeight: 600, 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                      >
                        {fullName || (isEn ? 'NAME SURNAME' : 'AD SOYAD')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '8px', textTransform: 'uppercase', opacity: '0.6' }}>{isEn ? 'Expiry' : 'Son Kul.'}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {cardExpiry || 'AA/YY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--color-burgundy) 0%, var(--color-dark-navy) 100%)',
                    border: '1px solid rgba(240, 218, 197, 0.25)',
                    padding: '24px 0',
                    color: '#FFFFFF',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Magnetic Strip */}
                  <div style={{ background: '#000000', height: '40px', width: '100%' }} />

                  {/* Sign and CVC */}
                  <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '8px', textTransform: 'uppercase', opacity: '0.6', textAlign: 'right' }}>
                      {isEn ? 'Security Code (CVC)' : 'Güvenlik Kodu (CVC)'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', background: '#FFFFFF', color: '#1C2340', height: '36px', borderRadius: '4px', paddingRight: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.1em' }}>
                        {cardCvc || '•••'}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '0 24px', fontSize: '8px', opacity: '0.5', lineHeight: '1.3' }}>
                    {isEn 
                      ? 'This card is secured with iyzico/Stripe infrastructure. By using this card, the cardholder accepts the platform rules and GDPR text.'
                      : 'İşbu kart iyzico/Stripe altyapısı ile güvence altına alınmıştır. Kart sahibi bu kartı kullanarak platform kurallarını ve KVKK metnini kabul etmiş sayılır.'}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default PaymentSystem;
