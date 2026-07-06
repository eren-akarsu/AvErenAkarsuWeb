import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Percent, Landmark, ShieldCheck, X, FileText, Landmark as BankIcon, Heart, BookOpen, AlertCircle } from 'lucide-react';
import { CustomCheckbox } from '../components/ui/CustomCheckbox';
import { CustomSelect } from '../components/ui/CustomSelect';

interface CalculatorInfo {
  id: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  icon: React.ReactNode;
}

export const LegalCalculatorPage: React.FC = () => {
  const { language, theme, showToast, navigateTo } = useApp();
  const isEn = language === 'en';

  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // States for Calculator Inputs
  // 1 & 2: Kidem / Ihbar
  const [startDate, setStartDate] = useState('2022-01-01');
  const [endDate, setEndDate] = useState('2026-01-01');
  const [grossSalary, setGrossSalary] = useState(25000);
  const [extraPerks, setExtraPerks] = useState(3000);
  const [kidemResult, setKidemResult] = useState<any>(null);

  // 3 & 4: Faiz
  const [principal, setPrincipal] = useState(50000);
  const [faizRate, setFaizRate] = useState(9); // Default 9%
  const [faizStartDate, setFaizStartDate] = useState('2025-01-01');
  const [faizEndDate, setFaizEndDate] = useState('2026-01-01');
  const [faizResult, setFaizResult] = useState<any>(null);

  // 5: Kira Artış
  const [currentRent, setCurrentRent] = useState(15000);
  const [kiraRate, setKiraRate] = useState(55.4); // 2026 inflation mockup
  const [kiraResult, setKiraResult] = useState<any>(null);

  // 6: Nafaka
  const [netIncome, setNetIncome] = useState(35000);
  const [childCount, setChildCount] = useState(1);
  const [hasSpouseSupport, setHasSpouseSupport] = useState(true);
  const [nafakaResult, setNafakaResult] = useState<any>(null);

  // 7: Vekalet Ücreti
  const [claimValue, setClaimValue] = useState(100000);
  const [litigationType, setLitigationType] = useState('asliye');
  const [vekaletResult, setVekaletResult] = useState<any>(null);

  // 8: Harç & Masraf
  const [caseValue, setCaseValue] = useState(150000);
  const [harcResult, setHarcResult] = useState<any>(null);

  // List of 8 Calculators
  const calculatorsList: CalculatorInfo[] = [
    {
      id: 'kidem',
      titleTr: 'Kıdem Tazminatı Hesaplama',
      titleEn: 'Severance Pay Calculator',
      descTr: 'İş sözleşmesi sona eren işçinin hizmet süresi ve giydirilmiş brüt ücretine göre kıdem tazminatını hesaplar.',
      descEn: 'Calculates the severance pay based on total employment years and gross salary.',
      icon: <Scale size={24} />
    },
    {
      id: 'ihbar',
      titleTr: 'İhbar Tazminatı Hesaplama',
      titleEn: 'Notice Pay Calculator',
      descTr: 'İş sözleşmesi bildirim sürelerine uyulmaksızın feshedilen işçinin hak kazandığı ihbar tazminatını hesaplar.',
      descEn: 'Calculates the notice pay for workers whose contract is terminated without proper duration notices.',
      icon: <FileText size={24} />
    },
    {
      id: 'yasal-faiz',
      titleTr: 'Yasal Faiz Hesaplama',
      titleEn: 'Legal Interest Calculator',
      descTr: 'Kanuni faiz oranları dikkate alınarak, alacağın başlangıç tarihinden itibaren yasal faiz miktarını hesaplar.',
      descEn: 'Calculates the total legal interest amount from the start date using official legal rates.',
      icon: <Percent size={24} />
    },
    {
      id: 'icra-faiz',
      titleTr: 'İcra Gecikme Faizi Hesaplama',
      titleEn: 'Execution Delay Interest',
      descTr: 'İcra takip dosyalarındaki asıl alacağa uygulanacak gecikme faizi ve dosya kapak hesabı özetini çıkarır.',
      descEn: 'Calculates delay interest rate and legal processing fees for debt collections.',
      icon: <BankIcon size={24} />
    },
    {
      id: 'kira-artis',
      titleTr: 'Kira Artış Oranı Hesaplama',
      titleEn: 'Rent Increase Calculator',
      descTr: 'TÜFE 12 aylık ortalamasına göre kiracılara uygulanabilecek yasal kira artış miktarı ve yeni kira tutarını hesaplar.',
      descEn: 'Calculates the legal rent increase limit and the new monthly rental rate based on inflation.',
      icon: <Landmark size={24} />
    },
    {
      id: 'nafaka',
      titleTr: 'Nafaka Hesaplama',
      titleEn: 'Alimony Calculator',
      descTr: 'Tarafların sosyal ve ekonomik durumları ile çocuk sayısına göre takdir edilebilecek nafaka aralığını tahmin eder.',
      descEn: 'Estimates the monthly alimony range based on net household income and child dependants.',
      icon: <Heart size={24} />
    },
    {
      id: 'vekalet',
      titleTr: 'Vekâlet Ücreti Hesaplama',
      titleEn: 'Attorney Fee Calculator',
      descTr: 'Barolar Birliği Avukatlık Asgari Ücret Tarifesine (AAÜT) göre nispi ve maktu vekâlet ücretlerini hesaplar.',
      descEn: 'Calculates the minimal attorney legal fee according to official bar tariff values.',
      icon: <BookOpen size={24} />
    },
    {
      id: 'harc-masraf',
      titleTr: 'Harç ve Masraf Hesaplama',
      titleEn: 'Court Fees & Expenses',
      descTr: 'Dava açılışında ödenecek harçlar, gider avansı, masraflar ve nispi karar harçlarının ön dökümünü çıkarır.',
      descEn: 'Calculates initial filing fees, witness advance deposits, and judicial court costs.',
      icon: <AlertCircle size={24} />
    }
  ];

  // Logic 1: Kıdem Tazminatı
  const handleCalculateKidem = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      showToast(isEn ? 'Please select valid dates.' : 'Lütfen geçerli tarih aralıkları seçiniz.', 'warning');
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365.25);
    const totalGross = Number(grossSalary) + Number(extraPerks);
    const kidemCeiling = 45000; // 2026 Mock
    const finalBaseSalary = totalGross > kidemCeiling ? kidemCeiling : totalGross;

    const rawKidem = (finalBaseSalary / 365.25) * diffDays;
    const damgaTax = rawKidem * 0.00759;
    const netKidem = rawKidem - damgaTax;

    setKidemResult({
      days: diffDays,
      years: years,
      gross: rawKidem,
      tax: damgaTax,
      net: netKidem
    });
    showToast(isEn ? 'Severance calculation completed.' : 'Kıdem tazminatı hesaplandı.', 'success');
  };

  // Logic 2: İhbar Tazminatı
  const handleCalculateIhbar = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      showToast(isEn ? 'Please select valid dates.' : 'Lütfen geçerli tarih aralıkları seçiniz.', 'warning');
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalGross = Number(grossSalary) + Number(extraPerks);
    
    let weeks = 2;
    const months = (diffDays / 30);
    if (months < 6) weeks = 2;
    else if (months >= 6 && months < 18) weeks = 4;
    else if (months >= 18 && months < 36) weeks = 6;
    else weeks = 8;

    const weeklySalary = (totalGross / 30) * 7;
    const rawIhbar = weeklySalary * weeks;
    const incomeTax = rawIhbar * 0.15;
    const damgaTax = rawIhbar * 0.00759;
    const netIhbar = rawIhbar - (incomeTax + damgaTax);

    setKidemResult({
      weeks: weeks,
      gross: rawIhbar,
      tax: incomeTax + damgaTax,
      net: netIhbar
    });
    showToast(isEn ? 'Notice pay calculation completed.' : 'İhbar tazminatı hesaplandı.', 'success');
  };

  // Logic 3 & 4: Yasal Faiz / İcra Faizi
  const handleCalculateFaiz = () => {
    const start = new Date(faizStartDate);
    const end = new Date(faizEndDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      showToast(isEn ? 'Please select valid dates.' : 'Lütfen geçerli tarih aralıkları seçiniz.', 'warning');
      return;
    }
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const interestAmount = Number(principal) * (Number(faizRate) / 100) * (diffDays / 365.25);
    const totalAmount = Number(principal) + interestAmount;

    setFaizResult({
      days: diffDays,
      interest: interestAmount,
      total: totalAmount
    });
    showToast(isEn ? 'Interest calculation completed.' : 'Faiz hesaplaması tamamlandı.', 'success');
  };

  // Logic 5: Kira Artışı
  const handleCalculateKira = () => {
    const rate = Number(kiraRate) / 100;
    const increaseAmount = Number(currentRent) * rate;
    const newRent = Number(currentRent) + increaseAmount;

    setKiraResult({
      increase: increaseAmount,
      newRent: newRent
    });
    showToast(isEn ? 'Rent increase calculation completed.' : 'Kira artış hesabı tamamlandı.', 'success');
  };

  // Logic 6: Nafaka
  const handleCalculateNafaka = () => {
    let rawAmount = 0;
    // Basic standard formulas for alimony estimation
    if (hasSpouseSupport) {
      rawAmount += Number(netIncome) * 0.25; // 25% for spouse
    }
    rawAmount += Number(netIncome) * (0.15 * Number(childCount)); // 15% per child

    const minEstimate = rawAmount * 0.9;
    const maxEstimate = rawAmount * 1.15;

    setNafakaResult({
      min: minEstimate,
      max: maxEstimate
    });
    showToast(isEn ? 'Alimony estimation completed.' : 'Nafaka aralığı tahmin edildi.', 'success');
  };

  // Logic 7: Vekalet Ücreti
  const handleCalculateVekalet = () => {
    let fee = 0;
    const value = Number(claimValue);

    // Dynamic AAÜT 2026 mock pricing blocks
    if (litigationType === 'sulh') {
      // Sulh courts: fixed minimum
      fee = Math.max(12000, value * 0.12);
    } else if (litigationType === 'icra') {
      // Icra offices: fixed minimum
      fee = Math.max(9000, value * 0.10);
    } else {
      // Asliye & standard civil litigation scaled percentages
      if (value <= 200000) {
        fee = value * 0.16;
      } else if (value <= 400000) {
        fee = 32000 + (value - 200000) * 0.15;
      } else if (value <= 800000) {
        fee = 62000 + (value - 400000) * 0.12;
      } else {
        fee = 110000 + (value - 800000) * 0.08;
      }
      fee = Math.max(22000, fee); // Minimum threshold
    }

    setVekaletResult({
      fee: fee
    });
    showToast(isEn ? 'Attorney fee calculation completed.' : 'Vekâlet ücreti hesaplandı.', 'success');
  };

  // Logic 8: Harç & Masraf
  const handleCalculateHarc = () => {
    const value = Number(caseValue);
    const upfrontFee = value * 0.06831 * 0.25; // upfront decision fee (25% of 6.83%)
    const fixedFiling = 450; // filing application fee
    const expenseAdvance = 1200; // postage and witness advance costs

    setHarcResult({
      upfront: upfrontFee,
      filing: fixedFiling,
      advance: expenseAdvance,
      total: upfrontFee + fixedFiling + expenseAdvance
    });
    showToast(isEn ? 'Court fee calculations completed.' : 'Harç ve masraf tahmini tamamlandı.', 'success');
  };

  const closeModals = () => {
    setActiveCalculator(null);
    setKidemResult(null);
    setFaizResult(null);
    setKiraResult(null);
    setNafakaResult(null);
    setVekaletResult(null);
    setHarcResult(null);
  };

  return (
    <div 
      style={{ 
        background: 'var(--bg-primary)', 
        minHeight: '100vh', 
        padding: '120px 0 80px',
        color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <div className="container">
        
        {/* Page Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span 
            style={{ 
              fontSize: '11px', 
              color: 'var(--color-burgundy)', 
              fontWeight: 700, 
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              display: 'block',
              marginBottom: '12px'
            }}
          >
            {isEn ? 'LEGALTECH WEB TOOLS' : 'LEGALTECH HESAPLAMA ARAÇLARI'}
          </span>
          <h1 
            style={{ 
              fontSize: '36px', 
              fontFamily: 'Outfit, sans-serif', 
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: '1.2'
            }}
          >
            {isEn ? 'Legal Calculation Tools' : 'Hukuki Hesaplama Araçları'}
          </h1>
          <p 
            style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              marginTop: '12px',
              maxWidth: '800px',
              margin: '12px auto 0',
              lineHeight: '1.6'
            }}
          >
            {isEn
              ? 'Here you can access basic legal calculation tools frequently needed in legal processes. The calculation results are for informational purposes and do not substitute for formal legal consultancy.'
              : 'Güncel hukuki süreçlerde sıkça ihtiyaç duyulan temel hesaplama araçlarına buradan ulaşabilirsiniz. Hesaplama sonuçları genel bilgilendirme niteliğindedir ve somut olay bakımından hukuki danışmanlık yerine geçmez.'}
          </p>
        </div>

        {/* General Disclaimer Notice Card */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 24px',
            borderRadius: '12px',
            marginBottom: '35px',
            border: '1px solid var(--border-color)',
            background: theme === 'dark' ? 'rgba(80, 34, 60, 0.05)' : 'rgba(240, 218, 197, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
            {isEn
              ? 'Calculation results are for general informational purposes only.'
              : 'Hesaplama sonuçları genel bilgilendirme amacı taşımaktadır.'}
          </span>
          <span
            onClick={() => navigateTo('sorumluluk-reddi-beyani')}
            style={{
              fontSize: '12px',
              color: 'var(--color-burgundy)',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap'
            }}
          >
            {isEn ? 'Disclaimer Statement' : 'Sorumluluk Reddi Beyanı'}
          </span>
        </div>

        {/* 8 Cards Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '24px',
            marginTop: '40px'
          }}
        >
          {calculatorsList.map((calc) => (
            <div
              key={calc.id}
              className="glass-panel hover-card"
              style={{
                padding: '28px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Card Header Icon & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(80, 34, 60, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-burgundy)',
                    flexShrink: 0
                  }}
                >
                  {calc.icon}
                </div>
                <h3 
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    fontFamily: 'Outfit, sans-serif', 
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: '1.3'
                  }}
                >
                  {isEn ? calc.titleEn : calc.titleTr}
                </h3>
              </div>

              {/* Card Description */}
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', flex: 1, margin: 0 }}>
                {isEn ? calc.descEn : calc.descTr}
              </p>

              {/* Action Button */}
              <button
                onClick={() => setActiveCalculator(calc.id)}
                className="btn-secondary"
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  background: 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {isEn ? 'Calculate' : 'Hesapla'}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* POPUP CALCULATOR DIALOG MODALS */}
      {activeCalculator && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {/* Modal Panel container */}
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              background: theme === 'dark' ? 'rgba(15, 20, 35, 0.98)' : 'rgba(252, 250, 246, 0.98)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)', margin: 0 }}>
                {calculatorsList.find(c => c.id === activeCalculator)?.titleTr}
              </h3>
              <button
                onClick={closeModals}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body Forms */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
              
              {/* 1. Kidem Tazminatı */}
              {activeCalculator === 'kidem' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>İşe Giriş Tarihi</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>İşten Çıkış Tarihi</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Aylık Brüt Maaş (TL)</label>
                      <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Aylık Sosyal Yardımlar (TL)</label>
                      <input type="number" value={extraPerks} onChange={(e) => setExtraPerks(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <button onClick={handleCalculateKidem} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>
                  
                  {/* Result output box */}
                  {kidemResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Toplam Çalışılan Gün:</span><strong>{kidemResult.days} Gün ({kidemResult.years} Yıl)</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Brüt Kıdem Tazminatı:</span><strong>{kidemResult.gross.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Damga Vergisi Kesintisi (0.00759):</span><strong>{kidemResult.tax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Net Ödenecek Tutar:</span><span>{kidemResult.net.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Ihbar Tazminatı */}
              {activeCalculator === 'ihbar' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>İşe Giriş Tarihi</label>
                      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>İşten Çıkış Tarihi</label>
                      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Aylık Brüt Maaş (TL)</label>
                      <input type="number" value={grossSalary} onChange={(e) => setGrossSalary(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Aylık Sosyal Yardımlar (TL)</label>
                      <input type="number" value={extraPerks} onChange={(e) => setExtraPerks(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <button onClick={handleCalculateIhbar} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>
                  
                  {/* Result output */}
                  {kidemResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>İhbar Süresi:</span><strong>{kidemResult.weeks} Hafta</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Brüt İhbar Tazminatı:</span><strong>{kidemResult.gross.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Vergi Kesintileri (%15 Gelir + Damga):</span><strong>{kidemResult.tax.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Net İhbar Tazminatı:</span><span>{kidemResult.net.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

              {/* 3 & 4. Faiz Hesabı */}
              {(activeCalculator === 'yasal-faiz' || activeCalculator === 'icra-faiz') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Asıl Alacak Tutarı (TL)</label>
                      <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Yıllık Faiz Oranı (%)</label>
                      <input type="number" value={faizRate} onChange={(e) => setFaizRate(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Faiz Başlangıç Tarihi</label>
                      <input type="date" value={faizStartDate} onChange={(e) => setFaizStartDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Faiz Bitiş Tarihi</label>
                      <input type="date" value={faizEndDate} onChange={(e) => setFaizEndDate(e.target.value)} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <button onClick={handleCalculateFaiz} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>

                  {/* Result output */}
                  {faizResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Hesaplanan Gün Sayısı:</span><strong>{faizResult.days} Gün</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Toplam Biriken Faiz:</span><strong>{faizResult.interest.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Toplam Alacak (Asıl + Faiz):</span><span>{faizResult.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. Kira Artış Oranı */}
              {activeCalculator === 'kira-artis' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Mevcut Kira Bedeli (TL)</label>
                      <input type="number" value={currentRent} onChange={(e) => setCurrentRent(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>TÜFE 12 Aylık Ortalama (%)</label>
                      <input type="number" value={kiraRate} onChange={(e) => setKiraRate(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <button onClick={handleCalculateKira} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>

                  {/* Result output */}
                  {kiraResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Kira Artış Miktarı:</span><strong>{kiraResult.increase.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Yeni Kira Bedeli:</span><span>{kiraResult.newRent.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. Nafaka Hesaplama */}
              {activeCalculator === 'nafaka' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Aylık Net Gelir (TL)</label>
                      <input type="number" value={netIncome} onChange={(e) => setNetIncome(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Bakmakla Yükümlü Çocuk Sayısı</label>
                      <input type="number" value={childCount} onChange={(e) => setChildCount(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <CustomCheckbox
                      checked={hasSpouseSupport}
                      onChange={setHasSpouseSupport}
                      label="Eş İçin Tedbir/Yoksulluk Nafakası Dahil Edilsin"
                    />
                  </div>
                  <button onClick={handleCalculateNafaka} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>

                  {/* Result output */}
                  {nafakaResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px 0', fontStyle: 'italic' }}>*Bu hesaplama, tarafların ekonomik güç oranları ve Yargıtay emsal içtihatları doğrultusunda tahmini bir aralık vermektedir.</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Tahmini Minimum Nafaka Tutarı:</span><strong>{nafakaResult.min.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL / Ay</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Tahmini Maksimum Nafaka Tutarı:</span><strong>{nafakaResult.max.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL / Ay</strong></div>
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <strong>Önemli Not:</strong> Somut uyuşmazlıklarda hâkimin geniş takdir yetkisi bulunmaktadır.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 7. Vekalet Ücreti */}
              {activeCalculator === 'vekalet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600 }}>Dava veya İcra Değeri (TL)</label>
                      <input type="number" value={claimValue} onChange={(e) => setClaimValue(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Dava Tipi / Merci</label>
                      <CustomSelect
                        value={litigationType}
                        onChange={setLitigationType}
                        options={[
                          { value: 'asliye', label: 'Asliye Hukuk / Ticaret Mahkemeleri' },
                          { value: 'sulh', label: 'Sulh Hukuk Mahkemeleri' },
                          { value: 'icra', label: 'İcra Daireleri / Takip İşlemleri' }
                        ]}
                      />
                    </div>
                  </div>
                  <button onClick={handleCalculateVekalet} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>

                  {/* Result output */}
                  {vekaletResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px 0' }}>*2025/2026 yılı Türkiye Barolar Birliği Avukatlık Asgari Ücret Tarifesine (AAÜT) göre hesaplanmıştır.</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Hesaplanan Asgari Vekâlet Ücreti:</span><span>{vekaletResult.fee.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

              {/* 8. Harç & Masraf */}
              {activeCalculator === 'harc-masraf' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600 }}>Dava Talebi / Uyuşmazlık Miktarı (TL)</label>
                    <input type="number" value={caseValue} onChange={(e) => setCaseValue(Number(e.target.value))} className="glass-input" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }} />
                  </div>
                  <button onClick={handleCalculateHarc} className="btn-primary" style={{ width: '100%', height: '42px', borderRadius: '8px', fontWeight: 600 }}>Hesapla</button>

                  {/* Result output */}
                  {harcResult && (
                    <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'rgba(80,34,60,0.03)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Başvuru Harcı (Maktu):</span><strong>{harcResult.filing.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Peşin Karar Harcı (Nispi 1/4):</span><strong>{harcResult.upfront.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span>Gider Avansı & Tebligat Masrafı:</span><strong>{harcResult.advance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontWeight: 700, color: 'var(--color-burgundy)' }}><span>Toplam Dava Açılış Masrafı:</span><span>{harcResult.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      <style>{`
        .hover-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-burgundy) !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25) !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
