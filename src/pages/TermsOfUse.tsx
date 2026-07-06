import React from 'react';
import { LegalDocLayout } from '../components/layout/LegalDocLayout';
import { useApp } from '../context/AppContext';

export const TermsOfUse: React.FC = () => {
  const { language, navigateTo } = useApp();
  const isEn = language === 'en';

  const title = isEn ? 'Terms of Use' : 'Kullanım Koşulları';
  const lastUpdated = '04.07.2026';
  const readingTime = isEn ? '8 min read' : '8 dk okuma';

  const sections = [
    {
      id: 'giris-kabul',
      title: isEn ? 'Introduction' : 'Giriş',
      content: (
        <>
          <p>
            {isEn
              ? 'These Terms of Use govern the terms and conditions for utilizing the www.erenakarsu.av.tr website operated by Att. Eren Akarsu. By visiting the website, reading contents, scheduling appointments, using chatbot, or processing payments, you accept these terms.'
              : 'İşbu Kullanım Koşulları, Av. Eren Akarsu tarafından işletilen www.erenakarsu.av.tr internet sitesinin kullanımına ilişkin şartları düzenlemek amacıyla hazırlanmıştır. İnternet sitesini ziyaret eden, randevu oluşturan, chatbot ile etkileşime geçen veya ödeme yapan tüm kullanıcılar bu koşulları kabul etmiş sayılır.'}
          </p>
        </>
      )
    },
    {
      id: '1-tanimlar',
      title: isEn ? '1. Definitions' : '1. Tanımlar',
      content: (
        <>
          <p><strong>{isEn ? 'Site:' : 'Site:'}</strong> www.erenakarsu.av.tr</p>
          <p><strong>{isEn ? 'Attorney:' : 'Avukat:'}</strong> Av. Eren Akarsu</p>
          <p><strong>{isEn ? 'User:' : 'Kullanıcı:'}</strong> {isEn ? 'Any person visiting or interacting with the website.' : 'Siteyi ziyaret eden veya hizmetlerden yararlanan gerçek ya da tüzel kişiler.'}</p>
          <p><strong>{isEn ? 'Legal Content:' : 'Hukuki İçerikler:'}</strong> {isEn ? 'Articles, judgments, analysis outlines, and templates published.' : 'Sitede yayımlanan makaleler, yargı kararları, analizler ve şablon evraklar.'}</p>
        </>
      )
    },
    {
      id: '2-sitenin-amaci',
      title: isEn ? '2. Purpose of the Site' : '2. Sitenin Amacı',
      content: (
        <>
          <p>
            {isEn
              ? 'This site has been established in compliance with professional rules of the Union of Turkish Bar Associations to provide information about the legal profession of Att. Eren Akarsu, areas of practice, legal articles, and to support scheduling digital consulting.'
              : 'Bu internet sitesi, Av. Eren Akarsu’nun mesleki faaliyetleri, çalışma alanları ve makaleleri hakkında genel bilgi sunmak, randevu ve dijital hukuk hizmetleri süreçlerini desteklemek amacıyla baro meslek kurallarına uygun olarak hazırlanmıştır.'}
          </p>
        </>
      )
    },
    {
      id: '3-iceriklerin-niteligi',
      title: isEn ? '3. Nature of Legal Content' : '3. Hukuki İçeriklerin Niteliği',
      content: (
        <>
          <p>
            {isEn
              ? 'All articles, decisions, and calculator outcomes are for general informational purposes only. They do not constitute concrete legal evaluation, do not replace legal advice, and do not establish an attorney-client relationship.'
              : 'Sitede yer alan tüm yazılar, kararlar ve hesaplama araçları sonuçları genel bilgilendirme amacı taşır. Somut olay analizi niteliğinde olmayıp, hukuki danışmanlık yerine geçmez ve avukat-müvekkil ilişkisi kurmaz.'}
          </p>
          <p style={{ marginTop: '10px' }}>
            {isEn ? 'For specific legal risks, you must consult a professional attorney. You can read the details in the:' : 'Hassas hukuki riskleriniz için doğrudan avukat yardımı almalısınız. Ayrıntılar için şu beyanı inceleyebilirsiniz:'}
            <span 
              onClick={() => navigateTo('sorumluluk-reddi-beyani')}
              style={{ color: 'var(--color-burgundy)', cursor: 'pointer', marginLeft: '5px', fontWeight: 600 }}
            >
              [{isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı'}]
            </span>
          </p>
        </>
      )
    },
    {
      id: '4-avukat-muvekkil-iliski',
      title: isEn ? '4. Formation of Attorney-Client Relationship' : '4. Avukat-Müvekkil İlişkisinin Kurulması',
      content: (
        <>
          <p>
            {isEn
              ? 'Visiting the website, submitting forms, chatting with the AI, or processing mock checkout payments does not establish a formal attorney-client relationship. A relationship is established only upon conflict checks, explicit written agreements, and task definition by Att. Eren Akarsu.'
              : 'Sitenin ziyaret edilmesi, form doldurulması, chatbot ile görüşülmesi veya ödeme yapılması doğrudan bir avukat-müvekkil ilişkisi kurmaz. İlişki ancak menfaat çatışması kontrolü yapılıp, Av. Eren Akarsu tarafından işin kabul edildiğinin yazılı veya sözlü beyan edilmesiyle kurulur.'}
          </p>
        </>
      )
    },
    {
      id: '5-online-randevu',
      title: isEn ? '5. Online Appointment & Consulting' : '5. Online Randevu ve Danışmanlık',
      content: (
        <>
          <p>
            {isEn
              ? 'Users can schedule appointments through the interface. Scheduled slots are requests and must be verified by our office calendar. Consultations might be subject to the Attorney Minimum Fee Tariff.'
              : 'Kullanıcılar randevu modülü ile görüşme talebi iletebilir. Talepler, çalışma takvimimize göre kontrol edilip onaylandıktan sonra kesinleşir. Danışmanlık hizmetleri baro asgari ücret tarifesinden az olmamak üzere ücrete tabidir.'}
          </p>
        </>
      )
    },
    {
      id: '6-odeme-sistemi',
      title: isEn ? '6. Payment System & Collections' : '6. Ödeme Sistemi ve Tahsilatlar',
      content: (
        <>
          <p>
            {isEn
              ? 'Credit card payments are handled via secure SSL 3D-secure third-party provider systems. Our platform does not collect, record, or process your credit card numbers directly.'
              : 'Kredi kartı ödemeleri, SSL korumalı ve 3D secure özellikli güvenli aracı ödeme kuruluşu sistemleri üzerinden yapılır. Kart numaralarınız sitemiz veritabanlarında saklanmaz veya işlenmez.'}
          </p>
        </>
      )
    },
    {
      id: '7-dilekce-dokumanlar',
      title: isEn ? '7. Petition & Document Templates' : '7. Dilekçe ve Doküman Örnekleri',
      content: (
        <>
          <p>
            {isEn
              ? 'Document and petition templates listed on the Knowledge Hub are mockup samples. They should not be used in real court files without adaptation to your case. Adapting them incorrectly might lead to forfeiture of rights.'
              : 'Bilgi merkezinde yer alan dilekçe şablonları örnek niteliğindedir. Davanıza veya somut olayınıza uyarlanmadan resmi mercilerde kullanılmamalıdır. Hatalı dilekçe kullanımı ciddi hak kayıplarına yol açabilir.'}
          </p>
        </>
      )
    }
  ];

  return (
    <LegalDocLayout
      title={title}
      lastUpdated={lastUpdated}
      readingTime={readingTime}
      sections={sections}
    />
  );
};
export default TermsOfUse;
