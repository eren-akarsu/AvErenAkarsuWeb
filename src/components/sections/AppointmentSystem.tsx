import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, Video, Users, PhoneCall, Check } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

export const AppointmentSystem: React.FC = () => {
  const { t, addAppointment, language, showToast, navigateTo } = useApp();
  
  const isEn = language === 'en';
  const timeslots = ['09:30', '10:30', '11:30', '14:00', '15:00', '16:30'];

  // Helper to check if a timeslot is past today
  const isTimeslotPast = (timeStr: string, dateStr: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    if (dateStr < todayStr) return true;
    if (dateStr > todayStr) return false;

    const [h, m] = timeStr.split(':').map(Number);
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    return (h < currentHour) || (h === currentHour && m <= currentMinute);
  };

  // Helper to check if all slots today are past
  const allSlotsPassedToday = () => {
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    return timeslots.every(slot => {
      const [h, m] = slot.split(':').map(Number);
      return (h < currentHour) || (h === currentHour && m <= currentMinute);
    });
  };

  // Helper to find Monday of the week
  const getMondayOfCurrentWeek = (today: Date) => {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [weekOffset, setWeekOffset] = useState(0);

  // Date selector (defaults to current system date or first available non-past date)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const monday = getMondayOfCurrentWeek(today);
    const allPassedToday = allSlotsPassedToday();

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      const isString = nextDate.toISOString().split('T')[0];
      
      const dateOnly = new Date(nextDate);
      dateOnly.setHours(0, 0, 0, 0);
      const todayOnly = new Date(today);
      todayOnly.setHours(0, 0, 0, 0);

      const isPast = dateOnly.getTime() < todayOnly.getTime();
      const isToday = dateOnly.getTime() === todayOnly.getTime();

      if (!isPast && !(isToday && allPassedToday)) {
        return isString;
      }
    }

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return nextMonday.toISOString().split('T')[0];
  });

  // Time selector (defaults to first active non-past slot of selectedDate)
  const [selectedTime, setSelectedTime] = useState(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // We want to calculate the initial date first to match the default selectedDate hook
    const initialDate = (() => {
      const monday = getMondayOfCurrentWeek(today);
      const allPassedToday = allSlotsPassedToday();

      for (let i = 0; i < 7; i++) {
        const nextDate = new Date(monday);
        nextDate.setDate(monday.getDate() + i);
        const isString = nextDate.toISOString().split('T')[0];
        
        const dateOnly = new Date(nextDate);
        dateOnly.setHours(0, 0, 0, 0);
        const todayOnly = new Date(today);
        todayOnly.setHours(0, 0, 0, 0);

        const isPast = dateOnly.getTime() < todayOnly.getTime();
        const isToday = dateOnly.getTime() === todayOnly.getTime();

        if (!isPast && !(isToday && allPassedToday)) {
          return isString;
        }
      }
      const nextMonday = new Date(monday);
      nextMonday.setDate(monday.getDate() + 7);
      return nextMonday.toISOString().split('T')[0];
    })();

    if (initialDate === todayStr) {
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      const firstActiveSlot = timeslots.find(slot => {
        const [h, m] = slot.split(':').map(Number);
        return (h > currentHour) || (h === currentHour && m > currentMinute);
      });
      return firstActiveSlot || '10:30';
    }
    return '10:30';
  });

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
    const today = new Date();
    const monday = getMondayOfCurrentWeek(today);
    monday.setDate(monday.getDate() + weekOffset * 7);
    const allPassedToday = allSlotsPassedToday();

    const days = [];
    const dateNamesTR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    const dateNamesEN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(monday);
      nextDate.setDate(monday.getDate() + i);
      const isString = nextDate.toISOString().split('T')[0];
      
      const dateOnly = new Date(nextDate);
      dateOnly.setHours(0, 0, 0, 0);
      const todayOnly = new Date(today);
      todayOnly.setHours(0, 0, 0, 0);

      let isPast = dateOnly.getTime() < todayOnly.getTime();
      const isToday = dateOnly.getTime() === todayOnly.getTime();

      if (isToday && allPassedToday) {
        isPast = true;
      }

      days.push({
        fullDate: isString,
        dayNum: nextDate.getDate(),
        dayName: isEn ? dateNamesEN[i] : dateNamesTR[i],
        isPast,
        isToday
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

    // Add to shared application context (mock database)
    addAppointment({
      clientName,
      phone,
      email,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      consultationType,
      notes,
      paymentAmount: consultationType === 'Online' ? 2500 : consultationType === 'Yüz Yüze' ? 3000 : 1500
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
                          border: '1px solid ' + (weekOffset === 0 ? 'rgba(240, 218, 197, 0.1)' : 'rgba(240, 218, 197, 0.25)'),
                          borderRadius: '6px',
                          padding: '3px 8px',
                          color: weekOffset === 0 ? 'rgba(240, 218, 197, 0.2)' : 'var(--text-primary)',
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
                          border: '1px solid rgba(240, 218, 197, 0.25)',
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
                      background: rgba(12, 16, 30, 0.85);
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
                                                       onClick={() => {
                               if (!isPast) {
                                 setSelectedDate(day.fullDate);
                                 
                                 // Auto-reset selectedTime if it is today and the currently selected slot is past
                                 const today = new Date();
                                 const todayStr = today.toISOString().split('T')[0];
                                 if (day.fullDate === todayStr) {
                                   const [currH, currM] = selectedTime.split(':').map(Number);
                                   const nowH = today.getHours();
                                   const nowM = today.getMinutes();
                                   const isCurrentSlotPast = (currH < nowH) || (currH === nowH && currM <= nowM);
                                   
                                   if (isCurrentSlotPast) {
                                     const firstActiveSlot = timeslots.find(slot => {
                                       const [h, m] = slot.split(':').map(Number);
                                       return (h > nowH) || (h === nowH && m > nowM);
                                     });
                                     if (firstActiveSlot) {
                                       setSelectedTime(firstActiveSlot);
                                     }
                                   }
                                 }
                               }
                             }}
                             style={{
                               padding: '12px 6px',
                               borderRadius: '10px',
                               border: isSelected 
                                 ? '1px solid var(--color-burgundy)' 
                                 : isPast 
                                   ? '1px dashed rgba(240, 218, 197, 0.12)' 
                                   : '1px solid var(--border-color)',
                               background: isSelected 
                                 ? 'var(--color-burgundy)' 
                                 : isPast 
                                   ? 'rgba(240, 218, 197, 0.01)' 
                                   : 'var(--input-bg)',
                               color: isSelected 
                                 ? '#FFFFFF' 
                                 : isPast 
                                   ? 'rgba(240, 218, 197, 0.25)' 
                                   : 'var(--text-primary)',
                               cursor: isPast ? 'not-allowed' : 'pointer',
                               textAlign: 'center',
                               transition: 'var(--transition-fast)',
                               opacity: isPast ? 0.45 : 1,
                               pointerEvents: isPast ? 'none' : 'auto'
                             }}
                           >
                             <div style={{ fontSize: '10px', opacity: isSelected ? '0.8' : isPast ? '0.5' : '0.6', textTransform: 'uppercase' }}>
                               {day.dayName}
                             </div>
                             <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                               {day.dayNum}
                             </div>
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
                                 ? '1px dashed rgba(240, 218, 197, 0.12)'
                                 : '1px solid var(--border-color)',
                             background: isSelected 
                               ? 'var(--color-burgundy)' 
                               : isPastSlot
                                 ? 'rgba(240, 218, 197, 0.01)'
                                 : 'var(--input-bg)',
                             color: isSelected 
                               ? '#FFFFFF' 
                               : isPastSlot
                                 ? 'rgba(240, 218, 197, 0.25)'
                                 : 'var(--text-primary)',
                             cursor: isPastSlot ? 'not-allowed' : 'pointer',
                             textAlign: 'center',
                             fontSize: '13px',
                             fontWeight: 600,
                             transition: 'var(--transition-fast)',
                             opacity: isPastSlot ? 0.45 : 1,
                             pointerEvents: isPastSlot ? 'none' : 'auto'
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
                        { type: 'Online', nameTr: 'Online', nameEn: 'Online', icon: <Video size={14} />, price: '2500 TL' },
                        { type: 'Yüz Yüze', nameTr: 'Yüz Yüze', nameEn: 'Face to Face', icon: <Users size={14} />, price: '3000 TL' },
                        { type: 'Telefon', nameTr: 'Telefon', nameEn: 'Phone Call', icon: <PhoneCall size={14} />, price: '1500 TL' }
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
