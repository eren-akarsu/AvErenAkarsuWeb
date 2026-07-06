import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, Users, FolderHeart, Hammer, Building2, Briefcase, Cpu, FileSignature, X, Calendar } from 'lucide-react';

export const Services: React.FC = () => {
  const { t, language } = useApp();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const isEn = language === 'en';

  const servicesData = [
    {
      title: t('practice.cyber'),
      desc: t('practice.cyber.desc'),
      icon: <Cpu size={24} />,
      bullets: isEn ? [
        'GDPR & KVKK (Data Protection) Compliance Audits',
        'E-Commerce & Distance Selling Agreements Structure',
        'Content Removal & Online Rights Violation Defense',
        'Defense in Cyber Crime Proceedings',
        'Legal Consulting on Smart Contracts & Blockchain'
      ] : [
        'KVKK (Kişisel Verilerin Korunması Kanunu) Uyum Süreçleri',
        'E-Ticaret ve Mesafeli Satış Sözleşmeleri Yapılandırılması',
        'İnternet Yoluyla Kişilik Hakları İhlalleri ve İçerik Kaldırma',
        'Bilişim Sistemleri Aracılığıyla Nitelikli Suçlarda Savunma',
        'Akıllı Sözleşmeler (Smart Contracts) Hukuki Danışmanlığı'
      ]
    },
    {
      title: t('practice.criminal'),
      desc: t('practice.criminal.desc'),
      icon: <ShieldAlert size={24} />,
      bullets: isEn ? [
        'Defense Representation during Police & Prosecutor Interrogations',
        'Legal Counsel during Arraignment & Pre-trial Detentions',
        'Defense Advocacy in Criminal & High Criminal Courts',
        'Cyber Criminal Cases & Qualified Fraud Litigations',
        'Appellate Petitions (Regional Court and Supreme Court of Appeal)'
      ] : [
        'Karakol ve Savcılık İfade Süreçlerinde Müdafi Desteği',
        'Soruşturma ve Sorgu Hakimliği (Sorgu) Aşamaları Refakati',
        'Asliye ve Ağır Ceza Mahkemelerinde Sanık Müdafiliği',
        'Bilişim Ceza Hukuku ve Nitelikli Dolandırıcılık Davaları',
        'İstinaf, Temyiz ve Olağanüstü Kanun Yolları Başvuruları'
      ]
    },
    {
      title: t('practice.business'),
      desc: t('practice.business.desc'),
      icon: <Briefcase size={24} />,
      bullets: isEn ? [
        'Severance & Notice Pay Calculations and Litigation',
        'Reinstatement Lawsuits & Unfair Dismissal Counseling',
        'Material and Moral Damages Claims from Work Accidents',
        'Drafting Employment Agreements & Corporate Regulations',
        'Representation in Mandatory Mediation Hearings'
      ] : [
        'Kıdem ve İhbar Tazminatı Alacakları Hesaplama ve Dava Takibi',
        'İşe İade Davaları ve Haksız Fesih Süreçlerinin Yönetimi',
        'İş Kazası Sonrası Maddi ve Manevi Tazminat Talepleri',
        'İş Sözleşmeleri ve İş Yeri İç Yönetmeliklerinin Hazırlanması',
        'Arabuluculuk Görüşmelerinde Taraf Vekilliği ve Temsil'
      ]
    },
    {
      title: t('practice.family'),
      desc: t('practice.family.desc'),
      icon: <Users size={24} />,
      bullets: isEn ? [
        'Drafting Settlement Protocols & Uncontested Divorces',
        'Contested Divorce Litigations, Material & Moral Damages',
        'Child Custody, Visitation Rights & Alimony Claims',
        'Division of Matrimonial Property & Asset Distributions',
        'Restraining Orders & Protective Measures in Family Court'
      ] : [
        'Anlaşmalı Boşanma Protokolü Hazırlanması ve Tek Celsede Boşanma',
        'Çekişmeli Boşanma, Maddi ve Manevi Tazminat Talepleri',
        'Çocuk Velayeti, Kişisel İlişki Kurulması ve Nafaka Davaları',
        'Mal Rejiminin Tasfiyesi ve Katkı Payı Alacağı Hesaplamaları',
        'Ailenin Korunması ve Kadına Şiddetin Önlenmesi Kararları'
      ]
    },
    {
      title: t('practice.inheritance'),
      desc: t('practice.inheritance.desc'),
      icon: <FolderHeart size={24} />,
      bullets: isEn ? [
        'Obtaining Certificates of Inheritance (Probate)',
        'Dissolution of Co-ownership (Partition Lawsuits)',
        'Preterition & Miraschi Collusion (Hiding Assets) Claims',
        'Reduction Cases & Drafting Legal Wills',
        'Refusal of Inheritance & Estate Discovery Inquiries'
      ] : [
        'Veraset İlamı (Mirasçılık Belgesi) Alınması Süreçleri',
        'Miras Ortaklığının Giderilmesi (İzale-i Şüyu) Davaları',
        'Muris Muvazaası (Mirasçıdan Mal Kaçırma) Davaları',
        'Tenkis ve Denkleştirme Davaları, Vasiyetname Düzenleme',
        'Mirasın Reddi (Redd-i Miras) ve Terekenin Tespiti İşlemleri'
      ]
    },
    {
      title: t('practice.execution'),
      desc: t('practice.execution.desc'),
      icon: <Hammer size={24} />,
      bullets: isEn ? [
        'Execution Proceedings with or without Court Judgment',
        'Foreclosures, Property Seizures and Protective Custody',
        'Cancellation of Objections and Debt Disputes Litigation',
        'Negative Clearance & Restitution of Payments',
        'Resolution of Commitments Breaches in Execution Courts'
      ] : [
        'İlamsız ve İlamlı İcra Takiplerinin Başlatılması ve Yönetimi',
        'Haciz İşlemleri, Fiili Haciz ve Muhafaza Refakati',
        'İtirazın İptali ve Borca İtiraz Davalarının Takibi',
        'Menfi Tespit ve İstirdat (Ödenen Paranın Geri Alınması) Davaları',
        'Taahhüdü İhlal ve İcra Ceza Uyuşmazlıkları Çözümü'
      ]
    },
    {
      title: t('practice.commerce'),
      desc: t('practice.commerce.desc'),
      icon: <Building2 size={24} />,
      bullets: isEn ? [
        'Joint Stock & LLC Incorporations, General Assemblies',
        'Corporate Due Diligence Analyses',
        'Unfair Competition, Trademark & Patent Protection Litigation',
        'Commercial Debt Collection & Precautionary Seizures',
        'Legal Resolution of Disputes between Shareholders'
      ] : [
        'Anonim ve Limited Şirket Kurulum, Genel Kurul Süreçleri',
        'Şirketlerin Hukuki Durum Tespit (Due Diligence) Analizleri',
        'Haksız Rekabet, Marka ve Patent Hakkı Korunması Davaları',
        'Ticari Alacak Davaları ve İhtiyati Haciz Kararları Alınması',
        'Şirket Ortakları Arasındaki İhtilafların Hukuki Çözümü'
      ]
    },
    {
      title: t('practice.contracts'),
      desc: t('practice.contracts.desc'),
      icon: <FileSignature size={24} />,
      bullets: isEn ? [
        'Real Estate Promise-to-Sell & Construction Contracts',
        'Lease Agreements & Eviction Commitments Drafting',
        'Non-Disclosure Agreements (NDA) & Intellectual Property Transfers',
        'Structuring Dealership, Distribution & Franchise Agreements',
        'Analysis of Penalty Clauses and Termination Provisions'
      ] : [
        'Gayrimenkul Satış Vaadi ve Kat Karşılığı İnşaat Sözleşmeleri',
        'Kira Sözleşmeleri, Tahliye Taahhütnameleri Hazırlanması',
        'Gizlilik (NDA) ve Fikri Mülkiyet Devir Sözleşmeleri Analizi',
        'Bayilik, Distribütörlük ve Franchise Sözleşmeleri Yapılandırılması',
        'Sözleşmelerin Cezai Şart ve Fesih Maddeleri Açısından İncelenmesi'
      ]
    }
  ];

  return (
    <section
      id="practice"
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
            {isEn ? 'Practice Areas' : 'Hukuki Hizmetler'}
          </h4>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            {t('practice.title')}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', maxWidth: '600px', margin: '8px auto 0' }}>
            {t('practice.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid-4">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="glass-card"
              onClick={() => setSelectedService(index)}
              style={{
                padding: '30px 24px',
                border: '1px solid var(--glass-border)',
                background: 'var(--bg-card)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {service.icon}
              </div>
              
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {service.title}
              </h3>
              
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', flex: 1 }}>
                {service.desc}
              </p>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '10px'
                }}
              >
                {isEn ? 'View Details →' : 'Detayları İncele →'}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Services Detail Modal */}
      {selectedService !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 10, 18, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedService(null)}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '600px',
              borderRadius: '24px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              padding: '40px',
              position: 'relative',
              animation: 'modalScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            {/* Header info inside modal */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(80, 34, 60, 0.1)',
                  color: 'var(--color-burgundy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {servicesData[selectedService].icon}
              </div>
              <div>
                <h3 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {servicesData[selectedService].title}
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {isEn ? 'Practice Area Details' : 'Faaliyet Alanı Detayları'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '24px' }}>
              {servicesData[selectedService].desc}
            </p>

            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-burgundy)', marginBottom: '16px', textTransform: 'uppercase' }}>
              {isEn ? 'Key Practice Details:' : 'Başlıca Hizmet Başlıkları:'}
            </h4>

            {/* Bullets List */}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, marginBottom: '30px' }}>
              {servicesData[selectedService].bullets.map((bullet, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-burgundy)', marginTop: '6px', flexShrink: 0 }} />
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Action buttons inside modal */}
            <div style={{ display: 'flex', gap: '14px' }}>
              <a
                href="#appointment"
                onClick={() => setSelectedService(null)}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Calendar size={18} /> {isEn ? 'Book a Consultation' : 'Danışmanlık Randevusu Al'}
              </a>
              <button
                onClick={() => setSelectedService(null)}
                className="btn-secondary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isEn ? 'Close' : 'Kapat'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Styled JSX for Scaling Modal */}
      <style>{`
        @keyframes modalScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
};
export default Services;
