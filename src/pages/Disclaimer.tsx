import React from 'react';
import { LegalDocLayout } from '../components/layout/LegalDocLayout';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/seo/SEOHead';

export const Disclaimer: React.FC = () => {
  const { language, navigateTo } = useApp();
  const isEn = language === 'en';

  const title = isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı';
  const lastUpdated = '04.07.2026';
  const readingTime = isEn ? '5 min read' : '5 dk okuma';

  const sections = [
    {
      id: 'genel-kapsam',
      title: isEn ? 'General Disclaimer' : 'Genel Beyan',
      content: (
        <>
          <p>
            {isEn
              ? 'This Disclaimer Statement governs your access and use of www.erenakarsu.av.tr. By utilizing our tools, articles, chatbot, or forms, you agree to the limitations of liability detailed here.'
              : 'İşbu Sorumluluk Reddi Beyanı, www.erenakarsu.av.tr internet sitesine erişen ve sitede yer alan içerikleri veya araçları kullanan kişilerin tabi olduğu sorumluluk sınırlarını düzenlemektedir.'}
          </p>
        </>
      )
    },
    {
      id: '1-tavsiye-degildir',
      title: isEn ? '1. Not Legal Advice' : '1. Hukuki Tavsiye veya Danışmanlık Değildir',
      content: (
        <>
          <p>
            {isEn
              ? 'All articles, blogs, judgments, summaries, and information published on this website are prepared strictly for general informational purposes. They do not constitute concrete legal evaluation, are not tailored to any specific case, and must not be used as official legal advice.'
              : 'İnternet sitesinde yayımlanan tüm makaleler, kararlar, incelemeler ve hukuki bilgi bankası içerikleri yalnızca genel bilgilendirme amacıyla hazırlanmıştır. Somut olay analizleri olmayıp, hukuki danışmanlık veya avukat görüşü yerine geçmez.'}
          </p>
          <p style={{ marginTop: '10px' }}>
            {isEn
              ? 'Laws, precedents, and regulations change frequently. Therefore, some information on our platform might not be up-to-date at the time of your reading. Always seek professional representation for your specific legal issues.'
              : 'Mevzuat ve yargı içtihatları zaman içinde değişebilir. Sitede yer alan bilgilerin güncelliği zamanla yitirilebilir. Hukuki ihtilaflarınız için doğrudan bir avukata danışmalısınız.'}
          </p>
        </>
      )
    },
    {
      id: '2-iliski-kurmaz',
      title: isEn ? '2. No Attorney-Client Relationship' : '2. Avukat-Müvekkil İlişkisi Kurmaz',
      content: (
        <>
          <p>
            {isEn
              ? 'Accessing this site, using the online appointment system, filling out forms, submitting comments, or interacting with the chatbot does not establish an attorney-client relationship under the Attorneys Act No. 1136.'
              : 'Bu siteyi ziyaret etmek, iletişim formu doldurmak, online randevu talebi göndermek veya chatbotu kullanmak, 1136 sayılı Avukatlık Kanunu kapsamında resmi bir avukat-müvekkil ilişkisi kurmaz.'}
          </p>
        </>
      )
    },
    {
      id: '3-yapay-zeka-chatbot',
      title: isEn ? '3. AI Assistant & Chatbot Disclaimers' : '3. Yapay Zekâ Asistanı ve Chatbot Yanıtları',
      content: (
        <>
          <p>
            {isEn
              ? 'The answers given by the AI Assistant (Eren Akarsu AI) are generated automatically. AI outputs are strictly general information and guidance, and are not actual lawyer assessments. AI may hallucinate or output inaccurate legal responses. Att. Eren Akarsu does not accept liability for any actions taken based on AI assistant responses.'
              : 'Yapay zekâ asistanı (Eren Akarsu AI) tarafından verilen yanıtlar otomatik sistemlerce üretilmektedir. Bu yanıtlar genel ön bilgilendirme niteliğinde olup, kesinlikle hukuki danışmanlık değildir. Hatalı veya eksik hukuki bilgi içerebilir. Chatbot yanıtlarına dayanarak yapılan işlemlerden doğan sorumluluk kullanıcıya aittir.'}
          </p>
        </>
      )
    },
    {
      id: '4-hesaplama-ve-dokumanlar',
      title: isEn ? '4. Calculator Tools and Templates' : '4. Hesaplama Araçları ve Dilekçe Örnekleri',
      content: (
        <>
          <p>
            {isEn
              ? 'The legal calculator tools (severance, notice, legal interest, execution fee, rent increase, etc.) output mathematical approximations based on user inputs. They do not calculate case-specific details, litigation deductions, or special rules. Similarly, doc templates are mockups and must not be used without professional adaptation.'
              : 'Sitemizde yer alan hukuki hesaplama araçları (kıdem, ihbar, yasal faiz, icra, kira vb.) girdiğiniz verilere dayalı yaklaşık hesaplamalar yapar. Resmi yargı kararlarında veya dava dosyalarında farklı kesintiler çıkabilir. Dilekçe şablonları da taslak niteliğinde olup somut olayınıza göre adapte edilmeden kullanılmamalıdır.'}
          </p>
        </>
      )
    },
    {
      id: '5-sorumluluk-sinirlamasi',
      title: isEn ? '5. Limitation of Liability' : '5. Sorumluluğun Sınırlandırılması',
      content: (
        <>
          <p>
            {isEn
              ? 'Att. Eren Akarsu is not liable for any direct, indirect, incidental, or consequential damages resulting from your reliance on website contents, document downloads, chatbot answers, or calculator tools.'
              : 'Sitede yer alan bilgilerin, hesaplama sonuçlarının, chatbot yanıtlarının veya örnek dilekçe şablonlarının doğrudan ya da dolaylı olarak kullanılmasından kaynaklanabilecek hiçbir hak kaybı veya zarardan Av. Eren Akarsu sorumlu tutulamaz.'}
          </p>
        </>
      )
    }
  ];

  return (
    <>
      <SEOHead
        title={isEn ? 'Disclaimer | Av. Eren Akarsu' : 'Sorumluluk Reddi Beyanı | Av. Eren Akarsu'}
        description={isEn
          ? 'Notice and limitations of liability regarding the informational contents, database references, and calculation utilities of Att. Eren Akarsu.'
          : 'Sitede yer alan genel bilgilendirici yazıların ve otomatik hesaplama sonuçlarının yasal sorumluluk sınırları beyanı.'
        }
        canonical="/sorumluluk-reddi-beyani"
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
export default Disclaimer;
