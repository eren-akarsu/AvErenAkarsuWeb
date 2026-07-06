import React from 'react';
import { LegalDocLayout } from '../components/layout/LegalDocLayout';
import { useApp } from '../context/AppContext';

export const CookiePolicy: React.FC = () => {
  const { language, navigateTo } = useApp();
  const isEn = language === 'en';

  const title = isEn ? 'Cookie Policy' : 'Çerez Politikası';
  const lastUpdated = '04.07.2026';
  const readingTime = isEn ? '5 min read' : '5 dk okuma';

  const sections = [
    {
      id: 'cerez-nedir',
      title: isEn ? '1. What is a Cookie?' : '1. Çerez Nedir?',
      content: (
        <>
          <p>
            {isEn 
              ? 'Cookies are small text files that are stored on your computer, phone, tablet, or similar devices through your browser or device when you visit a website.'
              : 'Çerezler, bir internet sitesini ziyaret ettiğinizde tarayıcınız veya cihazınız aracılığıyla bilgisayarınıza, telefonunuza, tabletinize veya benzeri cihazlarınıza kaydedilen küçük metin dosyalarıdır.'}
          </p>
          <p>
            {isEn
              ? 'Thanks to cookies, websites can operate more securely and efficiently, remember user preferences, measure performance, and improve user experience.'
              : 'Çerezler sayesinde internet sitesi daha güvenli ve verimli şekilde çalışabilir, kullanıcı tercihleri hatırlanabilir, site performansı ölçülebilir ve kullanıcı deneyimi geliştirilebilir.'}
          </p>
          <p>
            {isEn
              ? 'Cookies alone do not directly identify you. However, in some cases, they may become personal data when combined with data such as IP address, device info, session info, or usage habits.'
              : 'Çerezler tek başına doğrudan kimliğinizi belirlemez. Ancak bazı durumlarda IP adresi, cihaz bilgisi, oturum bilgisi, tercih bilgisi veya kullanım alışkanlıkları gibi verilerle birlikte kişisel veri niteliği kazanabilir.'}
          </p>
        </>
      )
    },
    {
      id: 'isleme-amaçlari',
      title: isEn ? '2. Purpose of Cookie Processing' : '2. Çerezlerin İşlenme Amaçları',
      content: (
        <>
          <p>
            {isEn
              ? 'We use cookies for the following purposes on our website:'
              : 'İnternet sitemizde çerezleri aşağıdaki amaçlarla kullanmaktayız:'}
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
            <li>
              <strong>{isEn ? 'Essential Purposes:' : 'Zorunlu ve Teknik Amaçlar:'}</strong>{' '}
              {isEn 
                ? 'To ensure information security, verify page routing, remember your privacy preferences, and ensure the basic technical operations of the site.'
                : 'Bilgi güvenliğini sağlamak, sayfa geçişlerini doğrulamak, çerez tercihlerinizi kaydetmek ve sitenin teknik olarak çalışmasını sağlamak.'}
            </li>
            <li>
              <strong>{isEn ? 'Functional Purposes:' : 'İşlevsel ve Tercih Amaçları:'}</strong>{' '}
              {isEn
                ? 'To remember your selected theme (dark/light) and language (TR/EN) on your subsequent visits.'
                : 'Sonraki ziyaretlerinizde seçmiş olduğunuz temayı (dark/light) ve dil tercihini (TR/EN) hatırlamak.'}
            </li>
            <li>
              <strong>{isEn ? 'Analytics and Performance:' : 'Analitik ve Performans Amaçları:'}</strong>{' '}
              {isEn
                ? 'To track the traffic of the site, see which legal articles are read more, and analyze user behavior to improve content quality.'
                : 'Sitenin trafiğini ölçümlemek, hangi hukuki makalelerin daha çok okunduğunu görmek ve içerik kalitesini artırmak üzere kullanıcı davranışlarını analiz etmek.'}
            </li>
          </ul>
        </>
      )
    },
    {
      id: 'cerez-kategorileri',
      title: isEn ? '3. Cookie Categories Used' : '3. Sitemizde Kullanılan Çerez Kategorileri',
      content: (
        <>
          <p>
            {isEn
              ? 'Below are the details of the cookies used on our website:'
              : 'İnternet sitemizde kullanılan çerez türleri ve detayları aşağıdadır:'}
          </p>
          <div style={{ overflowX: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>{isEn ? 'Cookie Category' : 'Çerez Kategorisi'}</th>
                  <th style={{ padding: '8px' }}>{isEn ? 'Description' : 'Açıklama'}</th>
                  <th style={{ padding: '8px' }}>{isEn ? 'Duration' : 'Saklama Süresi'}</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{isEn ? 'Essential Cookies' : 'Zorunlu Çerezler'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? 'Strictly necessary for the website security and features.' : 'Sitenin teknik işleyişi ve güvenliği için zorunlu olan çerezler.'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? 'Session / Persistent' : 'Oturum / 1 Yıl'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{isEn ? 'Preferences Cookies' : 'İşlevsel Çerezler'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? 'Remembers theme settings and language selection.' : 'Kullanıcının dil ve tema seçimlerini hatırlayan çerezler.'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? '1 Year' : '1 Yıl'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{isEn ? 'Analytics Cookies' : 'Analitik Çerezler'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? 'Anonymously tracks visitor statistics and reading time.' : 'Ziyaretçi istatistiklerini ve makale okuma oranlarını anonim olarak ölçen çerezler.'}</td>
                  <td style={{ padding: '8px' }}>{isEn ? 'Session / 6 Months' : 'Oturum / 6 Ay'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )
    },
    {
      id: 'cerez-yonetimi',
      title: isEn ? '4. How to Manage Cookies?' : '4. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?',
      content: (
        <>
          <p>
            {isEn
              ? 'You have the right to accept or decline cookies. Essential cookies cannot be turned off as they are technically required for the site to run.'
              : 'İnternet sitemizde kullanılan çerezleri kabul etme veya devre dışı bırakma hakkına sahipsiniz. Teknik olarak zorunlu çerezler sitenin çalışması için kapatılamaz.'}
          </p>
          <p>
            {isEn
              ? 'You can change your non-essential cookie choices anytime by clicking "Cookie Preferences" link in the footer of our page. Additionally, you can block or clear cookies via your browser settings.'
              : 'Zorunlu olmayan çerezler için tercihlerinizi, sayfanın alt kısmındaki "Çerez Tercihleri" bağlantısına tıklayarak dilediğiniz zaman değiştirebilirsiniz. Ayrıca tarayıcınızın ayarlarından da çerezleri engelleyebilir veya silebilirsiniz.'}
          </p>
        </>
      )
    },
    {
      id: 'referans-dokumanlar',
      title: isEn ? '5. Linked Documents' : '5. Bağlantılı Hukuki Dokümanlar',
      content: (
        <>
          <p>
            {isEn
              ? 'Cookie processing activities are linked to other legal documents on our platform. You can review the details via these links:'
              : 'Çerezler vasıtasıyla gerçekleştirilen veri işleme faaliyetlerimiz, sitemizdeki diğer yasal metinlerle doğrudan bağlantılıdır. Detaylı bilgi için şu dokümanları inceleyebilirsiniz:'}
          </p>
          <ul style={{ paddingLeft: '20px', listStyleType: 'circle' }}>
            <li>
              <span 
                onClick={() => navigateTo('kvkk-aydinlatma-metni')}
                style={{ cursor: 'pointer', color: 'var(--color-burgundy)', fontWeight: 600 }}
              >
                {isEn ? 'KVKK Clarification Text' : 'KVKK Aydınlatma Metni'}
              </span>
            </li>
            <li>
              <span 
                onClick={() => navigateTo('acik-riza-metni')}
                style={{ cursor: 'pointer', color: 'var(--color-burgundy)', fontWeight: 600 }}
              >
                {isEn ? 'Explicit Consent Form' : 'Açık Rıza Metni'}
              </span>
            </li>
            <li>
              <span 
                onClick={() => navigateTo('kullanim-kosullari')}
                style={{ cursor: 'pointer', color: 'var(--color-burgundy)', fontWeight: 600 }}
              >
                {isEn ? 'Terms of Use' : 'Kullanım Koşulları'}
              </span>
            </li>
          </ul>
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
export default CookiePolicy;
