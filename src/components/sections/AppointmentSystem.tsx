import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, Video, Users, PhoneCall, Check } from 'lucide-react';
import { CustomCheckbox } from '../ui/CustomCheckbox';

export const AppointmentSystem: React.FC = () => {
  const { t, addAppointment, language, showToast, navigateTo } = useApp();
  
  const isEn = language === 'en';

  // Date selector
  const [selectedDate, setSelectedDate] = useState('2026-07-06');
  const [selectedTime, setSelectedTime] = useState('10:30');
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationType, setConsultationType] = useState<'Online' | 'Yüz Yüze' | 'Telefon'>('Online');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Generates 6 upcoming calendar day selectors
  const getUpcomingDays = () => {
    const days = [];
    const dateNames = isEn 
      ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const start = new Date('2026-07-06'); // Start date reference
    
    for (let i = 0; i < 6; i++) {
      const nextDate = new Date(start);
      nextDate.setDate(start.getDate() + i);
      const isString = nextDate.toISOString().split('T')[0];
      days.push({
        fullDate: isString,
        dayNum: nextDate.getDate(),
        dayName: dateNames[nextDate.getDay() === 0 ? 5 : nextDate.getDay() - 1]
      });
    }
    return days;
  };

  const timeslots = ['09:30', '10:30', '11:30', '14:00', '15:00', '16:30'];

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
        padding: '100px 0',
        background: 'var(--bg-primary)',
        position: 'relative'
      }}
    >
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
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
        <div className="glass-card" style={{ maxWidth: '850px', margin: '0 auto', padding: '40px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
          
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
                  
                  {/* Calendar Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-burgundy)', fontWeight: 600, fontSize: '14px' }}>
                    <CalendarIcon size={18} /> {t('appointment.date')}
                  </div>

                  {/* Days grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                    {getUpcomingDays().map((day) => {
                      const isSelected = selectedDate === day.fullDate;
                      return (
                        <div
                          key={day.fullDate}
                          onClick={() => setSelectedDate(day.fullDate)}
                          style={{
                            padding: '12px 6px',
                            borderRadius: '10px',
                            border: isSelected ? '1px solid var(--color-burgundy)' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--color-burgundy)' : 'var(--input-bg)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'var(--transition-fast)'
                          }}
                        >
                          <div style={{ fontSize: '10px', opacity: isSelected ? '0.8' : '0.6', textTransform: 'uppercase' }}>
                            {day.dayName}
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 700, marginTop: '4px' }}>
                            {day.dayNum}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hours Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-burgundy)', fontWeight: 600, fontSize: '14px', marginTop: '10px' }}>
                    <Clock size={18} /> {t('appointment.time')}
                  </div>

                  {/* Hour slots grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {timeslots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <div
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: isSelected ? '1px solid var(--color-burgundy)' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--color-burgundy)' : 'var(--input-bg)',
                            color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'var(--transition-fast)'
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
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
