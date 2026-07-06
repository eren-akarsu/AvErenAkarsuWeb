import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Phone, X, Send, ShieldAlert, Sparkles } from 'lucide-react';

export const FloatingActions: React.FC = () => {
  const { chatbotLogs, addChatbotLog, chatbotSettings, navigateTo, language, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const isEn = language === 'en';

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatbotLogs, isTyping]);

  const handleWhatsApp = () => {
    const phoneNumber = '905321234567'; // Placeholder number
    const text = encodeURIComponent(
      isEn
        ? 'Hello Att. Eren, I am reaching out from your website. I would like to request a legal consultation.'
        : 'Merhaba Av. Eren Bey, web siteniz üzerinden ulaşıyorum. Hukuki danışmanlık talep ediyorum.'
    );
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
  };

  const generateAIResponse = (userText: string) => {
    setIsTyping(true);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      let botText = '';
      const textLower = userText.toLowerCase();

      if (isEn) {
        if (textLower.includes('appointment') || textLower.includes('meet') || textLower.includes('book') || textLower.includes('randevu') || textLower.includes('görüşme')) {
          botText = 'To schedule a consultation with Att. Eren Akarsu, you can use the "Book Appointment" module on our page or directly fill out the contact form to request our secretariat to contact you.';
        } else if (textLower.includes('severance') || textLower.includes('notice') || textLower.includes('compensation') || textLower.includes('tazminat') || textLower.includes('kıdem')) {
          botText = 'An active calculator module is available on our platform for you to calculate your severance and notice pay instantly. You can access it via the "Legal Calculators" section on the homepage and enter your gross wage and employment duration.';
        } else if (textLower.includes('rent') || textLower.includes('increase') || textLower.includes('cpi') || textLower.includes('kira') || textLower.includes('artış')) {
          botText = 'To calculate your rent increase rate according to the legal limit (based on CPI 12-month average), you can use the "Rent Increase Calculator" on the homepage.';
        } else if (textLower.includes('it law') || textLower.includes('gdpr') || textLower.includes('cyber') || textLower.includes('kvkk') || textLower.includes('bilişim')) {
          botText = 'In the field of IT Law, we offer services regarding KVKK/GDPR compliance, e-commerce agreements, cyber crime cases, domain name disputes, and digital intellectual property conflicts. You can request an appointment for detailed information.';
        } else if (textLower.includes('fee') || textLower.includes('price') || textLower.includes('cost') || textLower.includes('ücret') || textLower.includes('fiyat')) {
          botText = 'Legal consultancy fees are determined according to the nature of the dispute and the time to be spent, not being less than the Attorney Minimum Wage Tariff published by the Union of Turkish Bar Associations. You can start a consultation instantly by paying the preliminary fee under the online appointment section.';
        } else if (textLower.includes('criminal') || textLower.includes('police') || textLower.includes('arrest') || textLower.includes('ceza') || textLower.includes('karakol')) {
          botText = 'Disputes under Criminal Law, police statement processes, or arrest situations are urgent matters. For such emergencies, we advise you to contact us immediately via our WhatsApp line (+90 532 123 45 67) or directly by phone.';
        } else {
          botText = 'I have received your question. Att. Eren Akarsu handles technical and legal issues holistically thanks to his double major degree in Law and Software Engineering. To receive a detailed legal opinion or legal representation, you can book an appointment.';
        }
      } else {
        if (textLower.includes('randevu') || textLower.includes('görüşme') || textLower.includes('rezervasyon')) {
          botText = 'Av. Eren Akarsu ile görüşme planlamak için sayfamızdaki "Online Randevu" modülünü kullanabilir veya doğrudan iletişim formunu doldurarak sekreterliğimizin sizinle iletişime geçmesini talep edebilirsiniz.';
        } else if (textLower.includes('tazminat') || textLower.includes('kıdem') || textLower.includes('ihbar')) {
          botText = 'Kıdem ve ihbar tazminatı hesaplamalarınızı anlık olarak gerçekleştirebilmeniz için platformumuzda aktif çalışan bir hesaplama modülü mevcuttur. Anasayfadaki "Hukuki Hesaplama Araçları" bölümünden ilgili araca ulaşarak brüt ücret ve çalışma sürelerinizi girip hesaplayabilirsiniz.';
        } else if (textLower.includes('kira') || textLower.includes('artış') || textLower.includes('tüfe')) {
          botText = 'Kira artış oranınızı yürürlükteki kanuni sınırlara göre (TÜFE 12 aylık ortalama esasına göre) hesaplamak için anasayfada yer alan "Kira Artışı Hesaplama" aracını kullanabilirsiniz.';
        } else if (textLower.includes('bilişim') || textLower.includes('kvkk') || textLower.includes('siber')) {
          botText = 'Bilişim Hukuku alanında; KVKK (Kişisel Verilerin Korunması) uyum süreçleri, e-ticaret sözleşmeleri, siber suç davaları, alan adı uyuşmazlıkları ve dijital fikri mülkiyet uyuşmazlıklarında hizmet sunmaktayız. Detaylı bilgi için randevu talep edebilirsiniz.';
        } else if (textLower.includes('ücret') || textLower.includes('fiyat') || textLower.includes('danışmanlık ne kadar')) {
          botText = 'Hukuki danışmanlık ücretleri, Türkiye Barolar Birliği tarafından yayınlanan Avukatlık Asgari Ücret Tarifesinden az olmamak üzere, uyuşmazlığın niteliği ve harcanacak mesaiye göre belirlenmektedir. Online randevu kısmından ön danışmanlık ücretini ödeyerek anında görüşme başlatabilirsiniz.';
        } else if (textLower.includes('ceza') || textLower.includes('karakol') || textLower.includes('gözaltı')) {
          botText = 'Ceza Hukuku kapsamındaki uyuşmazlıklar, karakol ifade süreçleri veya gözaltı durumları aciliyet arz eden durumlardır. Bu tür acil durumlar için hemen WhatsApp hattımız üzerinden (+90 532 123 45 67) veya doğrudan telefonla iletişime geçmenizi öneririz.';
        } else {
          botText = 'Sorunuzu aldım. Av. Eren Akarsu çift anadal derecesi (Hukuk ve Yazılım Mühendisliği) sayesinde teknik ve hukuki problemleri bütüncül olarak ele almaktadır. Bu konuda detaylı hukuki mütalaa veya avukatlık hizmeti almak için randevu kaydı oluşturabilirsiniz.';
        }
      }

      addChatbotLog({
        sender: 'bot',
        text: botText,
        timestamp: new Date()
      });
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    addChatbotLog({
      sender: 'user',
      text: userText,
      timestamp: new Date()
    });
    setInputText('');
    showToast(isEn ? 'Message sent to AI assistant.' : 'Mesajınız yapay zekâ asistanına iletildi.', 'info');

    generateAIResponse(userText);
  };

  const handleChipClick = (chipText: string) => {
    addChatbotLog({
      sender: 'user',
      text: chipText,
      timestamp: new Date()
    });
    showToast(isEn ? 'Message sent to AI assistant.' : 'Mesajınız yapay zekâ asistanına iletildi.', 'info');
    generateAIResponse(chipText);
  };

  return (
    <>
      {/* Floating Buttons Column */}
      <div className="fab-container">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="fab-btn fab-whatsapp"
          title={isEn ? "WhatsApp Contact" : "WhatsApp İletişim"}
        >
          <Phone size={24} />
        </button>

        {/* AI Chatbot Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fab-btn fab-chatbot"
          title={isEn ? "AI Legal Assistant" : "AI Hukuk Asistanı"}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className="glass-panel chatbot-panel"
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '100px',
            width: '380px',
            height: '520px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
            zIndex: 999,
            animation: 'chatFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--color-dark-navy) 0%, var(--color-burgundy) 100%)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              borderBottom: '1px solid rgba(240, 218, 197, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(240, 218, 197, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F0DAC5'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'Outfit' }}>Eren Akarsu AI</h4>
                <span style={{ fontSize: '10px', color: '#A0AEC0' }}>{isEn ? "LegalTech Assistant" : "LegalTech Asistanı"}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Legal Disclaimer Box */}
          <div
            style={{
              background: 'rgba(237, 137, 54, 0.1)',
              borderBottom: '1px solid rgba(237, 137, 54, 0.2)',
              padding: '8px 16px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontSize: '11px',
              color: 'var(--text-primary)'
            }}
          >
            <ShieldAlert size={14} style={{ color: '#ED8936', flexShrink: 0 }} />
            <span>
              {isEn ? (
                <><strong>Warning:</strong> Provided information does not constitute formal legal advice.</>
              ) : (
                <><strong>Uyarı:</strong> Verilen bilgiler hukuki danışmanlık niteliğinde değildir.</>
              )}
            </span>
          </div>

          {/* Message Log */}
          <div
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: 'var(--bg-primary)'
            }}
          >
            {chatbotLogs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: log.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: log.sender === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    background: log.sender === 'user' ? 'var(--color-burgundy)' : 'var(--bg-card)',
                    border: log.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                >
                  {log.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {isEn ? "Typing..." : "Yazıyor..."}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Suggestions Chips */}
          <div
            style={{
              padding: '10px 16px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              background: 'var(--bg-primary)',
              borderTop: '1px solid var(--border-color)',
              scrollbarWidth: 'none'
            }}
          >
            {(isEn
              ? ['Book Appointment', 'Severance Pay', 'IT Law', 'Criminal Defense']
              : ['Randevu Oluştur', 'Kıdem Tazminatı', 'Bilişim Hukuku', 'Ceza Davası']
            ).map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(chip)}
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-burgundy)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%' }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isEn ? "Type your question here..." : "Sorunuzu buraya yazın..."}
                style={{
                  flex: 1,
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '13px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--color-burgundy)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <Send size={16} />
              </button>
            </div>
            
            {/* KVKK / Cookie / AI disclaimer info */}
            <div
              style={{
                fontSize: '9px',
                lineHeight: '1.4',
                color: 'var(--text-secondary)',
                opacity: 0.85,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                textAlign: 'left'
              }}
            >
              <div>
                {isEn ? (
                  <>
                    AI responses are for general informational purposes only.{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('sorumluluk-reddi-beyani'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      It does not constitute legal advice.
                    </span>
                  </>
                ) : (
                  <>
                    Yapay zekâ tarafından verilen cevaplar genel bilgilendirme niteliğindedir.{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('sorumluluk-reddi-beyani'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Hukuki danışmanlık yerine geçmez.
                    </span>
                  </>
                )}
              </div>
              <div>
                {isEn ? (
                  <>
                    Chatbot interactions are processed in accordance with our{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('kvkk-aydinlatma-metni'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      KVKK Clarification Text
                    </span>{' '}
                    and{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('cerez-politikasi'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Cookie Policy
                    </span>.
                  </>
                ) : (
                  <>
                    Chatbot kullanımı kapsamında verileriniz{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('kvkk-aydinlatma-metni'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      KVKK Aydınlatma Metni
                    </span>{' '}
                    ve{' '}
                    <span
                      onClick={() => { setIsOpen(false); navigateTo('cerez-politikasi'); }}
                      style={{ color: 'var(--color-burgundy)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Çerez Politikası
                    </span>{' '}
                    uyarınca işlenmektedir.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styled animation keyframes */}
      <style>{`
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};
