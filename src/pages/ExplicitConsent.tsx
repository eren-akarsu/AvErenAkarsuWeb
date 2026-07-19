import React, { useState } from 'react';
import { LegalDocLayout } from '../components/layout/LegalDocLayout';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';
import { CustomCheckbox } from '../components/ui/CustomCheckbox';
import { SEOHead } from '../components/seo/SEOHead';

export const ExplicitConsent: React.FC = () => {
  const { language, showToast } = useApp();
  const isEn = language === 'en';

  const title = isEn ? 'Explicit Consent Form' : 'Açık Rıza Metni';
  const lastUpdated = '04.07.2026';
  const readingTime = isEn ? '6 min read' : '6 dk okuma';

  // Interactive consent checks
  const [consentAnalytics, setConsentAnalytics] = useState(false);
  const [consentNewsletter, setConsentNewsletter] = useState(false);
  const [consentChatbot, setConsentChatbot] = useState(false);
  const [consentCrossborder, setConsentCrossborder] = useState(false);

  const handleSaveConsent = () => {
    showToast(
      isEn ? 'Your consent preferences have been updated.' : 'Açık rıza tercihleriniz güncellendi.',
      'success'
    );
  };

  const sections = [
    {
      id: 'giris-kapsam',
      title: isEn ? 'Introduction and Scope' : 'Giriş ve Kapsam',
      content: (
        <>
          <p>
            {isEn
              ? 'This Explicit Consent Form outlines the processing of your personal data based solely on your freely given explicit consent under KVKK No. 6698.'
              : 'İşbu Açık Rıza Metni, sitemizde sunulan bazı hizmetler kapsamında, kişisel verilerinizin yalnızca özgür iradenizle vereceğiniz açık rızanıza dayalı olarak işlenmesini düzenlemek amacıyla hazırlanmıştır.'}
          </p>
          <p>
            {isEn
              ? 'Your explicit consent is not a prerequisite for accessing our website or utilizing standard legal representation. It is requested strictly for the optional activities detailed below.'
              : 'Açık rızanız, web sitemizin temel işlevlerine erişmeniz veya standart avukatlık hizmeti almanız için zorunlu bir önkoşul değildir. Yalnızca aşağıda belirtilen isteğe bağlı süreçler için talep edilir.'}
          </p>
        </>
      )
    },
    {
      id: '1-veri-sorumlusu',
      title: isEn ? '1. Data Controller' : '1. Veri Sorumlusu',
      content: (
        <>
          <p>
            {isEn
              ? 'Data Controller: Att. Eren Akarsu'
              : 'Veri Sorumlusu: Av. Eren Akarsu'}
          </p>
          <p>
            {isEn
              ? 'Address: İstanbul, Turkey | Email: info@akarsu.av.tr'
              : 'Adres: İstanbul, Türkiye | E-posta: info@akarsu.av.tr'}
          </p>
        </>
      )
    },
    {
      id: '2-isleme-faaliyetleri',
      title: isEn ? '2. Consent-Based Processing Activities' : '2. Açık Rızaya Dayalı Veri İşleme Faaliyetleri',
      content: (
        <>
          <p>{isEn ? 'We seek your explicit consent for the following operations:' : 'Şu işlemler için açık rızanız talep edilmektedir:'}</p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>
              <strong>{isEn ? 'Optional Cookies & Analytics:' : 'Zorunlu Olmayan Çerezler ve Analizler:'}</strong>{' '}
              {isEn
                ? 'Processing user interactions and view metrics to analyze how our legal articles and documents are read.'
                : 'Hukuki makale ve belgelerimizin okunma oranlarını ölçmek üzere analitik çerezlerin kullanılması.'}
            </li>
            <li>
              <strong>{isEn ? 'Newsletter & Alerts:' : 'Haber Bülteni Aboneliği ve Duyurular:'}</strong>{' '}
              {isEn
                ? 'Sending periodic articles, court precedents alerts, and LegalTech platform updates to your email address.'
                : 'E-posta adresinize hukuki makaleler, yargı kararları ve LegalTech platform güncellemeleri göndermek.'}
            </li>
            <li>
              <strong>{isEn ? 'AI Chatbot Dialogs:' : 'Yapay Zekâ Destekli Chatbot Yazışmaları:'}</strong>{' '}
              {isEn
                ? 'Processing inputs written inside the chatbot. Some AI engines utilize third-party server infrastructures which process metadata.'
                : 'Chatbot penceresine girdiğiniz mesajların asistanın eğitimi ve sistem yanıtlarının iyileştirilmesi için işlenmesi.'}
            </li>
            <li>
              <strong>{isEn ? 'Cross-Border Transfers:' : 'Yurt Dışına Veri Aktarımı:'}</strong>{' '}
              {isEn
                ? 'Using secure infrastructure providers whose cloud hosting, email routing, or chatbot engine servers reside outside Turkey.'
                : 'Sunucuları Türkiye sınırları dışında olan bulut barındırma veya yapay zekâ sunucu entegrasyonlarının kullanılması.'}
            </li>
          </ul>
        </>
      )
    },
    {
      id: '3-rızanın-geri-cekilmesi',
      title: isEn ? '3. Withdrawal of Consent' : '3. Rızanın Geri Çekilmesi',
      content: (
        <>
          <p>
            {isEn
              ? 'You have the right to withdraw your explicit consent at any time. Withdrawal does not affect the lawfulness of processing before the withdrawal. You can configure your cookies preferences via our banner link or email us at info@akarsu.av.tr.'
              : 'Verdiğiniz açık rızaları dilediğiniz an geri çekebilirsiniz. Rızanın geri çekilmesi, geçmişte yapılan işlemlerin hukuka uygunluğunu etkilemez. Çerez tercihlerinizi sitemizin altındaki panelden kapatabilir veya taleplerinizi info@akarsu.av.tr adresine iletebilirsiniz.'}
          </p>
        </>
      )
    },
    {
      id: '4-onay-formu',
      title: isEn ? '4. Interactive Consent Selection' : '4. İnaktif Açık Rıza Tercihleri',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {isEn
              ? 'You can declare your explicit consent choices below. Pre-ticked preferences are not used, you can toggle them freely:'
              : 'Açık rıza beyanlarınızı aşağıdan seçebilirsiniz. Önceden işaretlenmiş kutular kullanılmaz, tercihlerinizi özgürce açıp kapatabilirsiniz:'}
          </p>
          
          {/* Checkbox 1 */}
          <CustomCheckbox
            checked={consentAnalytics}
            onChange={setConsentAnalytics}
            label={isEn ? 'I consent to the use of non-mandatory analytical and performance cookies.' : 'Zorunlu olmayan analitik ve performans çerezlerinin kullanılmasına açık rıza veriyorum.'}
          />

          {/* Checkbox 2 */}
          <CustomCheckbox
            checked={consentNewsletter}
            onChange={setConsentNewsletter}
            label={isEn ? 'I consent to receiving legal newsletters, updates, and articles via email.' : 'E-posta adresime hukuki bilgilendirme, makale ve bülten gönderilmesine açık rıza veriyorum.'}
          />

          {/* Checkbox 3 */}
          <CustomCheckbox
            checked={consentChatbot}
            onChange={setConsentChatbot}
            label={isEn ? 'I consent to the processing of my message contents within the AI assistant.' : 'Chatbot asistanına yazdığım mesajların teknik olarak analiz edilip işlenmesine açık rıza veriyorum.'}
          />

          {/* Checkbox 4 */}
          <CustomCheckbox
            checked={consentCrossborder}
            onChange={setConsentCrossborder}
            label={isEn ? 'I consent to the transfer of my technical details abroad when using secure cloud systems.' : 'Yurt dışı merkezli güvenli bulut ve servis entegrasyonlarının kullanılması durumunda verilerimin aktarımına açık rıza veriyorum.'}
          />

          <button
            onClick={handleSaveConsent}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', padding: '10px 24px', fontSize: '13px', marginTop: '10px' }}
          >
            {isEn ? 'Save Preferences' : 'Tercihleri Kaydet'}
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <SEOHead
        title={isEn ? 'Explicit Consent Form | Av. Eren Akarsu' : 'Açık Rıza Metni | Av. Eren Akarsu'}
        description={isEn
          ? 'Explicit consent preferences form for analytics, newsletter subscription, and AI assistant interaction on the Att. Eren Akarsu website.'
          : 'Analiz çerezleri, bülten üyeliği ve yapay zeka asistanı etkileşimleri için açık rıza izinlerinin yönetildiği tercih formu.'
        }
        canonical="/acik-riza-metni"
        ogType="website"
      />
      <LegalDocLayout
        title={title}
        lastUpdated={lastUpdated}
        readingTime={readingTime}
        sections={sections}
      />
    </>
  );
};
export default ExplicitConsent;
