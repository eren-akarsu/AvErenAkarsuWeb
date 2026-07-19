import React from 'react';
import { LegalDocLayout } from '../components/layout/LegalDocLayout';
import { useApp } from '../context/AppContext';
import { SEOHead } from '../components/seo/SEOHead';

export const KvkkDisclosure: React.FC = () => {
  const { language, navigateTo } = useApp();
  const isEn = language === 'en';

  const title = isEn ? 'KVKK Clarification Text' : 'KVKK Aydınlatma Metni';
  const lastUpdated = '04.07.2026';
  const readingTime = isEn ? '12 min read' : '12 dk okuma';

  const sections = [
    {
      id: 'giris',
      title: isEn ? 'Introduction' : 'Giriş',
      content: (
        <>
          <p>
            {isEn
              ? 'This KVKK Clarification Text has been prepared in accordance with the Law on Protection of Personal Data No. 6698 (KVKK) to inform data subjects about personal data processing activities carried out through www.erenakarsu.av.tr, operated by Att. Eren Akarsu.'
              : 'İşbu KVKK Aydınlatma Metni, Av. Eren Akarsu tarafından işletilen www.erenakarsu.av.tr internet sitesi üzerinden gerçekleştirilen kişisel veri işleme faaliyetleri hakkında, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında ilgili kişileri bilgilendirmek amacıyla hazırlanmıştır.'}
          </p>
          <p>
            {isEn
              ? 'This text covers site visitors, communication form users, online booking requesters, payment system users, legal content readers, chatbot users, commenters, and future client management system users.'
              : 'Bu metin; internet sitesini ziyaret eden kullanıcıları, iletişim formu dolduran kişileri, online randevu talebinde bulunan kişileri, ödeme sistemini kullanan kişileri, hukuki içeriklere erişen kullanıcıları, chatbot ile etkileşime geçen ziyaretçileri, yorum/iletişim alanlarını kullanan kişileri ve ileride oluşturulabilecek müvekkil/dosya yönetim sistemini kullanan ilgili kişileri kapsamaktadır.'}
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
              ? 'Within the scope of Law No. 6698, your personal data may be processed by the following person in the capacity of Data Controller:'
              : '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla aşağıda bilgileri yer alan kişi tarafından işlenebilecektir:'}
          </p>
          <div style={{ paddingLeft: '10px', borderLeft: '2px solid var(--color-burgundy)', marginTop: '10px' }}>
            <p><strong>{isEn ? 'Data Controller:' : 'Veri Sorumlusu:'}</strong> Av. Eren Akarsu</p>
            <p><strong>{isEn ? 'Website:' : 'İnternet Sitesi:'}</strong> www.erenakarsu.av.tr</p>
            <p><strong>{isEn ? 'Email:' : 'E-posta:'}</strong> info@akarsu.av.tr</p>
            <p><strong>{isEn ? 'Phone:' : 'Telefon:'}</strong> +90 532 123 4567</p>
            <p><strong>{isEn ? 'Address:' : 'Adres:'}</strong> İstanbul, Türkiye</p>
            <p><strong>{isEn ? 'Bar Registry Info:' : 'Baro Sicil Bilgisi:'}</strong> İstanbul Barosu - 98765</p>
          </div>
        </>
      )
    },
    {
      id: '2-genel-ilkeler',
      title: isEn ? '2. General Principles of Processing' : '2. Kişisel Verilerin İşlenmesine İlişkin Genel İlkeler',
      content: (
        <>
          <p>
            {isEn
              ? 'Your personal data is processed in accordance with the general principles set out in Article 4 of the KVKK. These principles include being in compliance with the law and good faith, being accurate and up-to-date, being processed for specific, explicit, and legitimate purposes, being relevant, limited, and proportionate to the purpose, and being retained for the period stipulated in the legislation or necessary for the purpose.'
              : 'Kişisel verileriniz, 6698 sayılı Kanun’da öngörülen genel ilkelere uygun olarak işlenir. Bu kapsamda verileriniz; hukuka ve dürüstlük kurallarına uygun, doğru ve gerektiğinde güncel, belirli, açık ve meşru amaçlar için, işlendikleri amaçla bağlantılı, sınırlı ve ölçülü şekilde, mevzuatta öngörülen veya amaç için gerekli olan süre kadar muhafaza edilerek işlenir.'}
          </p>
        </>
      )
    },
    {
      id: '3-veri-kategorileri',
      title: isEn ? '3. Personal Data Categories Processed' : '3. İşlenebilecek Kişisel Veri Kategorileri',
      content: (
        <>
          <p>{isEn ? 'The following categories of data may be processed depending on your interactions with the site:' : 'İnternet sitemizle olan etkileşiminize göre şu veri kategorileri işlenebilir:'}</p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'decimal' }}>
            <li>
              <strong>{isEn ? 'Identity Info:' : 'Kimlik Bilgileri:'}</strong> Name, surname, national identity number (T.C. Kimlik), birth date, signature.
            </li>
            <li>
              <strong>{isEn ? 'Contact Info:' : 'İletişim Bilgileri:'}</strong> Phone number, email address, physical address, WhatsApp metadata.
            </li>
            <li>
              <strong>{isEn ? 'Case & Consult Request:' : 'Müvekkil ve Talep Bilgileri:'}</strong> Legal dispute subject, description of the incident, message texts, files, randevu notes.
            </li>
            <li>
              <strong>{isEn ? 'Legal & Professional Actions:' : 'Mesleki ve Hukuki İşlem Bilgileri:'}</strong> Case file number, court/enforcement offices info, hearing dates, petitions, rulings, power of attorney.
            </li>
            <li>
              <strong>{isEn ? 'Financial Info:' : 'Finansal Bilgiler:'}</strong> Payment amount, payment date, billing details. Card numbers are never stored directly on the site.
            </li>
            <li>
              <strong>{isEn ? 'Transaction Security:' : 'İşlem Güvenliği Bilgileri:'}</strong> IP address, device model, browser metadata, server security logs, cookie settings.
            </li>
            <li>
              <strong>{isEn ? 'Chatbot Logs:' : 'Chatbot ve Asistan Verileri:'}</strong> Messages typed to the AI chatbot, chip selections, response feedbacks.
            </li>
            <li>
              <strong>{isEn ? 'Special Categories of Data:' : 'Özel Nitelikli Kişisel Veriler:'}</strong> Depending on the legal dispute, health data, criminal records, union memberships, or family privacy.
            </li>
          </ul>
        </>
      )
    },
    {
      id: '4-toplanma-yontemi',
      title: isEn ? '4. Methods of Personal Data Collection' : '4. Kişisel Verilerin Toplanma Yöntemleri',
      content: (
        <>
          <p>
            {isEn
              ? 'Your data is collected automatically or non-automatically via websites cookies, forms (communication, appointment, subscription), secure payment checkout, chatbot dialogs, comments, bar association registries, judicial directories, and electronic communications.'
              : 'Verileriniz; site ziyaretleri, iletişim formları, randevu formları, abonelik alanları, chatbot paneli, yorum alanları, ödeme işlemleri, çerezler, sunucu kayıtları, yargı mercileri, baro sorguları ve elektronik yazışmalar yoluyla toplanmaktadır.'}
          </p>
        </>
      )
    },
    {
      id: '5-islenme-amacları',
      title: isEn ? '5. Purposes of Processing' : '5. Kişisel Verilerin İşlenme Amaçları',
      content: (
        <>
          <p>{isEn ? 'Your personal data is processed for the following purposes:' : 'Kişisel verileriniz şu amaçlarla işlenebilir:'}</p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'square' }}>
            <li>{isEn ? 'Ensuring website operation and security' : 'Sitenin güvenli ve düzgün çalışmasını sağlamak'}</li>
            <li>{isEn ? 'Managing consultation requests and appointments' : 'Danışmanlık ve randevu taleplerini yönetmek'}</li>
            <li>{isEn ? 'Running IT compliance, conflict checks, and court procedures' : 'Uyuşmazlıkların ve menfaat çatışmalarının kontrolü'}</li>
            <li>{isEn ? 'Processing invoice, SMM, and legal fees payments' : 'Fatura, serbest meslek makbuzu ve ödeme süreçlerini yönetmek'}</li>
            <li>{isEn ? 'Providing automated assistant services and content suggestions' : 'Yapay zekâ asistanı ve hukuki içerik önerilerini sunmak'}</li>
          </ul>
        </>
      )
    },
    {
      id: '6-hukuki-sebepler',
      title: isEn ? '6. Legal Grounds for Processing' : '6. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri',
      content: (
        <>
          <p>
            {isEn
              ? 'Your data is processed based on Article 5 and 6 of KVKK: clear statutory laws, contract formation/performance, legal duties of the attorney, establishment/protection of rights, legitimate interests, and explicit consent where necessary.'
              : 'Kişisel verileriniz; kanunlarda açıkça öngörülmesi, sözleşmenin kurulması veya ifası, avukatlık mesleki hukuki yükümlülüklerinin yerine getirilmesi, bir hakkın tesisi veya korunması, veri sorumlusunun meşru menfaati veya açık rızanızın bulunması hukuki sebeplerine dayanılarak işlenmektedir.'}
          </p>
        </>
      )
    },
    {
      id: '7-acik-riza',
      title: isEn ? '7. Situations Requiring Explicit Consent' : '7. Açık Rıza Gerektiren Haller',
      content: (
        <>
          <p>
            {isEn
              ? 'Non-mandatory analytics cookies, promotional/newsletter messages, third-party AI assistant integrations, cross-border transfers, and recording of online consultations require your explicit consent. You can withdraw consent at any time.'
              : 'Zorunlu olmayan performans çerezleri, bülten gönderimleri, üçüncü taraf yapay zekâ entegrasyonları, sunucuları yurt dışında olan görüşme/veri sistemleri ve görüntülü görüşme kayıtları açık rızanıza tabidir. Rızanızı dilediğiniz an geri çekebilirsiniz.'}
          </p>
          <p style={{ marginTop: '10px' }}>
            {isEn ? 'You can manage your explicit consents via the:' : 'Açık rızalarınızı şu yollarla yönetebilirsiniz:'}
            <span 
              onClick={() => navigateTo('acik-riza-metni')}
              style={{ color: 'var(--color-burgundy)', cursor: 'pointer', marginLeft: '5px', fontWeight: 600 }}
            >
              [{isEn ? 'Explicit Consent Form' : 'Açık Rıza Metni'}]
            </span>
          </p>
        </>
      )
    },
    {
      id: '8-aktarim-yurt-disi',
      title: isEn ? '8. Data Transfer and Cross-Border Transfer' : '8. Verilerin Aktarılması ve Yurt Dışına Aktarım',
      content: (
        <>
          <p>
            {isEn
              ? 'Your data may be shared with courts, enforcement directorates, bar associations, payment systems, secure hosting providers, accounting advisors, and AI/chatbot server providers. Some providers (like Hugging Face chatbot engine, cloud hosts) might store data abroad, which is handled under KVKK Article 9 requirements.'
              : 'Kişisel verileriniz; mahkemeler, icra müdürlükleri, barolar, ödeme altyapı sağlayıcıları, mali müşavirlikler, bulut sunucu sağlayıcıları ve chatbot sunucuları ile paylaşılabilir. Chatbot yapay zekâ motoru (Hugging Face) gibi sistemlerin yurt dışı sunucuları kullanması durumunda, aktarımlar KVKK Madde 9 hükümlerine uygun güvencelerle yürütülür.'}
          </p>
        </>
      )
    },
    {
      id: '9-haklar-ve-basvuru',
      title: isEn ? '9. Your Rights and Application Method' : '9. İlgili Kişi Hakları ve Başvuru Yöntemi',
      content: (
        <>
          <p>
            {isEn
              ? 'Under Article 11 of the KVKK, you have rights to learn if your data is processed, request info, rectify errors, erase or destroy, object to automated analysis, and request compensation for illegal damage.'
              : 'KVKK Madde 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, eksikleri düzeltme, silinmesini veya yok edilmesini isteme, otomatik analiz kararlarına itiraz etme ve hukuka aykırı işleme nedeniyle oluşan zararın giderilmesini talep etme haklarına sahipsiniz.'}
          </p>
          <p style={{ marginTop: '10px' }}>
            {isEn
              ? 'You can send your requests in writing to our address or email us at info@akarsu.av.tr. Your application will be evaluated within 30 days.'
              : 'Taleplerinizi yazılı olarak ofis adresimize gönderebilir veya info@akarsu.av.tr e-posta adresimize iletebilirsiniz. Başvurunuz en geç 30 gün içinde sonuçlandırılacaktır.'}
          </p>
        </>
      )
    }
  ];

  return (
    <>
      <SEOHead
        title={isEn ? 'KVKK Clarification Text | Av. Eren Akarsu' : 'KVKK Aydınlatma Metni | Av. Eren Akarsu'}
        description={isEn
          ? 'Clarification text prepared under the Law on the Protection of Personal Data (KVKK) regarding data processed on the Att. Eren Akarsu platform.'
          : '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında web sitesi üzerinden işlenen verilere dair aydınlatma metni.'
        }
        canonical="/kvkk-aydinlatma-metni"
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
export default KvkkDisclosure;
