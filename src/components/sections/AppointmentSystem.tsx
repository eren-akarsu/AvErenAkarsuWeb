import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, Video, Users, PhoneCall, Check } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

// Helper for local date string (YYYY-MM-DD)
const getLocalDateStr = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Helper for Turkey Official Public Holidays (Resmi Tatiller)
const isPublicHoliday = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-');
  const monthDay = `${m}-${d}`;
  // Fixed official holidays in Turkey
  const fixedHolidays = ['01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-29'];
  if (fixedHolidays.includes(monthDay)) return true;

  // Religious / Dynamic official holidays in Turkey (2025-2027)
  const variableHolidays = [
    // 2025
    '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01',
    '2025-06-05', '2025-06-06', '2025-06-07', '2025-06-08', '2025-06-09',
    // 2026
    '2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22',
    '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29', '2026-05-30',
    // 2027
    '2027-03-08', '2027-03-09', '2027-03-10', '2027-03-11',
    '2027-05-16', '2027-05-17', '2027-05-18', '2027-05-19', '2027-05-20',
  ];
  return variableHolidays.includes(dateStr);
};

export const AppointmentSystem: React.FC = () => {
  const { t, addAppointment, language, showToast, navigateTo, siteSettings } = useApp();
  
  const isEn = language === 'en';

  // Real-time synchronized clock state
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // 10s sync
    return () => clearInterval(timer);
  }, []);
  
  const generateTimeslots = () => {
    const settings = siteSettings?.appointment_settings;
    if (!settings) return ['09:30', '10:30', '11:30', '14:00', '15:00', '16:30'];
    
    const start = settings.startTime || '09:00';
    const end = settings.endTime || '18:00';
    const duration = settings.duration || 30;
    
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    const slots = [];
    let current = new Date();
    current.setHours(startH, startM, 0, 0);
    
    const endTimeLimit = new Date();
    endTimeLimit.setHours(endH, endM, 0, 0);
    
    while (current.getTime() + duration * 60 * 1000 <= endTimeLimit.getTime()) {
      const currentH = current.getHours();
      const currentM = current.getMinutes();
      const timeString = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
      
      const isLunchBreak = (currentH === 12 && currentM >= 30) || (currentH === 13 && currentM < 30);
      if (!isLunchBreak) {
        slots.push(timeString);
      }
      current.setTime(current.getTime() + duration * 60 * 1000);
    }
    return slots.length > 0 ? slots : ['09:30', '10:30', '11:30', '14:00', '15:00', '16:30'];
  };

  const timeslots = generateTimeslots();

  // Helper to check if a timeslot is past today
  const isTimeslotPast = (timeStr: string, dateStr: string) => {
    const todayStr = getLocalDateStr(currentTime);
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    if (siteSettings?.appointment_settings?.pastHoursDisabled === false) {
      return false;
    }

    const [h, m] = timeStr.split(':').map(Number);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    return (h < currentHour) || (h === currentHour && m <= currentMinute);
  };

  // Helper to check if all slots today are past
  const allSlotsPassedToday = (dateStr: string) => {
    const todayStr = getLocalDateStr(currentTime);
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    return timeslots.every(slot => {
      const [h, m] = slot.split(':').map(Number);
      return (h < currentHour) || (h === currentHour && m <= currentMinute);
    });
  };

  // Helper to find Monday of the week
  const getMondayOfCurrentWeek = (referenceDate: Date) => {
    const day = referenceDate.getDay();
    const diff = referenceDate.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(referenceDate);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [weekOffset, setWeekOffset] = useState(0);

  // Helper to get first active slot for a given date
  const getFirstActiveSlot = (dateStr: string) => {
    const todayStr = getLocalDateStr(currentTime);
    if (dateStr > todayStr) return timeslots[0] || '10:30';

    if (dateStr === todayStr) {
      const nowH = currentTime.getHours();
      const nowM = currentTime.getMinutes();
      const firstActiveSlot = timeslots.find(slot => {
        const [h, m] = slot.split(':').map(Number);
        return (h > nowH) || (h === nowH && m > nowM);
      });
      return firstActiveSlot || timeslots[0] || '10:30';
    }

    return timeslots[0] || '10:30';
  };

  // Date selector (defaults to current system date or first available non-past date)
  const [selectedDate, setSelectedDate] = useState(() => {
    const monday = getMondayOfCurrentWeek(currentTime);
    const todayStr = getLocalDateStr(currentTime);

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      const isString = getLocalDateStr(nextDate);

      const dayIndex = nextDate.getDay();
      const trDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const currentDayTR = trDays[dayIndex];

      const isWorkingDay = siteSettings?.appointment_settings?.workingDays
        ? siteSettings.appointment_settings.workingDays.includes(currentDayTR)
        : [1, 2, 3, 4, 5].includes(dayIndex);

      const isHoliday = isPublicHoliday(isString);
      const allPassed = allSlotsPassedToday(isString);
      const isBeforeToday = isString < todayStr;

      if (!isBeforeToday && isWorkingDay && !isHoliday && !allPassed) {
        return isString;
      }
    }

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return getLocalDateStr(nextMonday);
  });

  // Time selector
  const [selectedTime, setSelectedTime] = useState(() => getFirstActiveSlot(selectedDate));

  // Sync selectedTime if selectedDate changes or time passes
  useEffect(() => {
    const isPast = isTimeslotPast(selectedTime, selectedDate);
    if (isPast) {
      const nextActive = getFirstActiveSlot(selectedDate);
      setSelectedTime(nextActive);
    }
  }, [selectedDate, currentTime]);

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationType, setConsultationType] = useState<'Online' | 'Yüz Yüze' | 'Telefon'>('Online');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const daysContainerRef = useRef<HTMLDivElement>(null);

  const scrollDays = (direction: 'left' | 'right') => {
    if (daysContainerRef.current) {
      const scrollAmount = direction === 'left' ? -80 : 80;
      daysContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Generates 7 calendar days of the week based on weekOffset
  const getUpcomingDays = () => {
    const monday = getMondayOfCurrentWeek(currentTime);
    monday.setDate(monday.getDate() + weekOffset * 7);
    const todayStr = getLocalDateStr(currentTime);

    const days = [];
    const dateNamesTR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const dateNamesEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      const isString = getLocalDateStr(nextDate);

      const dayIndex = nextDate.getDay(); // 0 is Sunday, 1 is Monday ...
      const trDays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const currentDayTR = trDays[dayIndex];

      const isWorkingDay = siteSettings?.appointment_settings?.workingDays
        ? siteSettings.appointment_settings.workingDays.includes(currentDayTR)
        : [1, 2, 3, 4, 5].includes(dayIndex); // fallback Mon-Fri

      const isHoliday = isPublicHoliday(isString);
      const allPassed = allSlotsPassedToday(isString);
      const isBeforeToday = isString < todayStr;
      const isToday = isString === todayStr;

      let isPast = isBeforeToday || (isToday && allPassed) || !isWorkingDay || isHoliday;

      let statusLabel = '';
      if (isHoliday) {
        statusLabel = isEn ? 'Holiday' : 'Tatil';
      } else if (!isWorkingDay) {
        statusLabel = isEn ? 'Closed' : 'Kapalı';
      } else if (isToday && allPassed) {
        statusLabel = isEn ? 'Passed' : 'Doldu';
      }

      days.push({
        fullDate: isString,
        dayNum: nextDate.getDate(),
        dayName: isEn ? dateNamesEN[i] : dateNamesTR[i],
        isPast,
        isToday,
        isHoliday,
        isNonWorking: !isWorkingDay,
        statusLabel
      });
    }
    return days;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !phone || !email || !selectedDate || !selectedTime) {
      showToast(isEn ? 'Please fill in your name, phone, email, date and time.' : 'Lütfen ad, telefon, e-posta, tarih ve saat alanlarını doldurunuz.', 'warning');
      return;
    }
    if (!termsAccepted) {
      showToast(isEn ? 'Please read and accept the Terms and KVKK Clarification Text.' : 'Lütfen Kullanım Koşulları ve KVKK Metnini okuyup onaylayın.', 'warning');
      return;
    }

    const onlineFee = siteSettings?.appointment_settings?.onlineFee !== undefined ? siteSettings.appointment_settings.onlineFee : 2500;
    const faceFee = siteSettings?.appointment_settings?.faceToFaceFee !== undefined ? siteSettings.appointment_settings.faceToFaceFee : 3000;
    const phoneFee = siteSettings?.appointment_settings?.phoneFee !== undefined ? siteSettings.appointment_settings.phoneFee : 1500;

    // Add to shared application context (mock database)
    addAppointment({
      clientName,
      phone,
      email,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      consultationType,
      notes,
      paymentAmount: consultationType === 'Online' ? onlineFee : consultationType === 'Yüz Yüze' ? faceFee : phoneFee
    });

    setIsBooked(true);
    showToast(isEn ? 'Your appointment request has been successfully received.' : 'Randevu talebiniz başarıyla alındı.', 'success');

    setTimeout(() => {
      setIsBooked(false);
      setClientName('');
      setEmail('');
      setPhone('');
      setNotes('');
      setSelectedTime('10:30');
      setTermsAccepted(false);
    }, 4000);
  };

  return (
    <section
      id="appointment"
      style={{
        padding: '50px 0 70px',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-burgundy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            {isEn ? 'Appointment Hub' : 'Randevu Merkezi'}
          </h4>
          <h2 style={{ fontSize: '32px', color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            {t('appointment.title')}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {t('appointment.subtitle')}
          </p>
        </div>

        {/* Outer Panel Grid */}
        <div className="glass-card appointment-card" style={{ maxWidth: '850px', margin: '0 auto', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          
          {isBooked ? (
            <div style={{ textAlign: 'center', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <Check size={28} style={{ margin: 'auto' }} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                {isEn ? 'Appointment Request Saved!' : 'Randevu Talebi Kaydedildi!'}
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto' }}>
                {t('appointment.success')} ({isEn ? 'Selected Date:' : 'Seçilen tarih:'} <strong>{selectedDate}</strong> {isEn ? 'time:' : 'saat:'} <strong>{selectedTime}</strong>).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                
                {/* Left Column: Visual Calendar & Time Slots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {/* Calendar Title with Week Navigation */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-burgundy)', fontWeight: 600, fontSize: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarIcon size={18} /> {t('appointment.date')}
                    </div>
                    
                    {/* Week Navigation */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                        disabled={weekOffset === 0}
                        style={{
                          background: 'transparent',
                          border: '1px solid ' + (weekOffset === 0 ? 'var(--border-color)' : 'var(--border-color)'),
                          borderRadius: '6px',
                          padding: '3px 8px',
                          color: weekOffset === 0 ? 'var(--text-secondary)' : 'var(--text-primary)',
                          opacity: weekOffset === 0 ? 0.4 : 1,
                          cursor: weekOffset === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {isEn ? 'Prev' : 'Geri'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setWeekOffset(prev => prev + 1)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        {isEn ? 'Next' : 'İleri'}
                      </button>
                    </div>
                  </div>

                  {/* Days grid with scroll buttons on mobile */}
                  <style>{`
                    .days-scroll-btn {
                      display: none;
                      align-items: center;
                      justify-content: center;
                      background: var(--bg-card);
                      border: 1px solid var(--border-color);
                      color: var(--text-primary);
                      border-radius: 50%;
                      width: 28px;
                      height: 28px;
                      cursor: pointer;
                      z-index: 10;
                      transition: all 0.2s ease;
                      user-select: none;
                    }
                    .days-scroll-btn:hover {
                      border-color: var(--color-burgundy);
                      color: var(--color-burgundy);
                    }
                    @media (max-width: 768px) {
                      .appointment-days-row {
                        display: flex !important;
                        overflow-x: auto !important;
                        scroll-behavior: smooth;
                        scrollbar-width: none; /* Firefox */
                        padding: 0 4px;
                        gap: 8px !important;
                      }
                      .appointment-days-row::-webkit-scrollbar {
                        display: none; /* Safari/Chrome */
                      }
                      .appointment-days-row > div {
                        flex: 0 0 68px !important; /* Equal width mobile items */
                      }
                      .days-scroll-btn {
                        display: flex;
                      }
                    }
                  `}</style>
                  
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      className="days-scroll-btn"
                      onClick={() => scrollDays('left')}
                      style={{ flexShrink: 0 }}
                    >
                      ‹
                    </button>
                    
                    <div
                      ref={daysContainerRef}
                      className="appointment-days-row"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '10px',
                        width: '100%',
                        overflowX: 'visible'
                      }}
                    >
                      {getUpcomingDays().map((day) => {
                        const isSelected = selectedDate === day.fullDate;
                        const isPast = day.isPast;
                        return (
                          <div
                            key={day.fullDate}
                            onClick={() => {
                              if (!isPast) {
                                setSelectedDate(day.fullDate);
                              }
                            }}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '10px',
                              border: isSelected 
                                ? '1px solid var(--color-burgundy)' 
                                : isPast 
                                  ? '1px dashed var(--border-color)' 
                                  : '1px solid var(--border-color)',
                              background: isSelected 
                                ? 'var(--color-burgundy)' 
                                : isPast 
                                  ? 'var(--bg-primary)' 
                                  : 'var(--input-bg)',
                              color: isSelected 
                                ? '#FFFFFF' 
                                : isPast 
                                  ? 'var(--text-secondary)' 
                                  : 'var(--text-primary)',
                              cursor: isPast ? 'not-allowed' : 'pointer',
                              textAlign: 'center',
                              transition: 'var(--transition-fast)',
                              opacity: isPast ? 0.45 : 1,
                              pointerEvents: isPast ? 'none' : 'auto'
                            }}
                          >
                            <div style={{ fontSize: '10px', opacity: isSelected ? '0.85' : '0.7', textTransform: 'uppercase', fontWeight: 600 }}>
                              {day.dayName}
                            </div>
                            <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '3px' }}>
                              {day.dayNum}
                            </div>
                            {day.statusLabel && !isSelected && (
                              <div style={{ fontSize: '9px', fontWeight: 600, color: day.isHoliday ? '#EF4444' : 'var(--text-secondary)', marginTop: '2px' }}>
                                {day.statusLabel}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="days-scroll-btn"
                      onClick={() => scrollDays('right')}
                      style={{ flexShrink: 0 }}
                    >
                      ›
                    </button>
                  </div>

                  {/* Hours Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-burgundy)', fontWeight: 600, fontSize: '14px', marginTop: '10px' }}>
                    <Clock size={18} /> {t('appointment.time')}
                  </div>

                  {/* Hour slots grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {timeslots.map((time) => {
                      const isSelected = selectedTime === time;
                      const isPastSlot = isTimeslotPast(time, selectedDate);
                      return (
                        <div
                          key={time}
                          onClick={() => {
                            if (!isPastSlot) {
                              setSelectedTime(time);
                            }
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: isSelected 
                              ? '1px solid var(--color-burgundy)' 
                              : isPastSlot
                                ? '1px dashed var(--border-color)'
                                : '1px solid var(--border-color)',
                            background: isSelected 
                              ? 'var(--color-burgundy)' 
                              : isPastSlot
                                ? 'var(--bg-primary)'
                                : 'var(--input-bg)',
                            color: isSelected 
                              ? '#FFFFFF' 
                              : isPastSlot
                                ? 'var(--text-secondary)'
                                : 'var(--text-primary)',
                            cursor: isPastSlot ? 'not-allowed' : 'pointer',
                            textAlign: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'var(--transition-fast)',
                            opacity: isPastSlot ? 0.45 : 1,
                            pointerEvents: isPastSlot ? 'none' : 'auto',
                            textDecoration: isPastSlot ? 'line-through' : 'none'
                          }}
                        >
                          {time}
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Right Column: Contact Inputs & Meeting Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Your Name Surname *' : 'Adınız Soyadınız *'}</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "Name Surname" : "Ad Soyad"}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  {/* Phone & Mail */}
                  <div className="form-grid-2" style={{ gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Phone *' : 'Telefon *'}</label>
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Email *' : 'E-posta *'}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="glass-input"
                        placeholder="mail@adresi.com"
                        style={{ width: '100%' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Meeting Type Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('appointment.type')}</label>
                    <div className="appointment-types-grid">
                      {[
                        { type: 'Online', nameTr: 'Online', nameEn: 'Online', icon: <Video size={14} />, price: `${siteSettings?.appointment_settings?.onlineFee !== undefined ? siteSettings.appointment_settings.onlineFee : 2500} TL` },
                        { type: 'Yüz Yüze', nameTr: 'Yüz Yüze', nameEn: 'Face to Face', icon: <Users size={14} />, price: `${siteSettings?.appointment_settings?.faceToFaceFee !== undefined ? siteSettings.appointment_settings.faceToFaceFee : 3000} TL` },
                        { type: 'Telefon', nameTr: 'Telefon', nameEn: 'Phone Call', icon: <PhoneCall size={14} />, price: `${siteSettings?.appointment_settings?.phoneFee !== undefined ? siteSettings.appointment_settings.phoneFee : 1500} TL` }
                      ].map((item) => {
                        const isSelected = consultationType === item.type;
                        return (
                          <div
                            key={item.type}
                            onClick={() => setConsultationType(item.type as any)}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '8px',
                              border: isSelected ? '1px solid var(--color-burgundy)' : '1px solid var(--border-color)',
                              background: isSelected ? 'rgba(80, 34, 60, 0.05)' : 'var(--input-bg)',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'var(--transition-fast)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--color-burgundy)' : 'var(--text-primary)' }}>
                              {item.icon} {isEn ? item.nameEn : item.nameTr}
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              {item.price}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 600 }}>{t('appointment.notes')}</label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="glass-input"
                      placeholder={isEn ? "Briefly summarize your case..." : "Konuyu kısaca özetleyebilirsiniz..."}
                      style={{ resize: 'none', fontFamily: 'inherit', width: '100%' }}
                    />
                  </div>

                </div>

              </div>

              {/* Checkbox for Terms and KVKK */}
              <div style={{ margin: '16px auto 6px', maxWidth: '500px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                <CustomCheckbox
                  checked={termsAccepted}
                  onChange={setTermsAccepted}
                  label={
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      {isEn ? (
                        <>
                          By booking an appointment, I agree that I have read and accept the{' '}
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                            style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            Terms of Use
                          </span>{' '}
                          and{' '}
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigateTo('kvkk-aydinlatma-metni'); }}
                            style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            KVKK Clarification Text
                          </span>.
                        </>
                      ) : (
                        <>
                          Randevu oluşturarak{' '}
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigateTo('kullanim-kosullari'); }}
                            style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                          >
                            Kullanım Koşulları
                          </span>
                          'nı ve{' '}
                          <span 
                            onClick={(e) => { e.stopPropagation(); navigateTo('kvkk-aydinlatma-metni'); }}
                            style={{ color: 'var(--color-burgundy)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
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

              {/* Submit btn */}
              <button type="submit" className="btn-primary" style={{ justifySelf: 'center', width: '250px', justifyContent: 'center', marginTop: '10px' }}>
                {t('appointment.submit')}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
export default AppointmentSystem;
