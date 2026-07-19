import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useApp } from '../context/AppContext';
import { Lock, Eye, EyeOff, Info, ShieldAlert } from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';

export const ResetPassword: React.FC = () => {
  const { language, showToast, navigateTo } = useApp();
  const isEn = language === 'en';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const handleSessionRecovery = async () => {
      try {
        // Sync address bar pathname to /reset-password if we landed on homepage with hash
        if (window.location.pathname !== '/reset-password') {
          window.history.replaceState(null, '', `/reset-password${window.location.hash}`);
        }

        const hash = window.location.hash;
        if (!hash) {
          setIsVerifying(false);
          return;
        }

        // Parse access_token & refresh_token from fragment
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          // Manually establish the session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Session establishment failed');
            setHasToken(false);
          } else {
            setHasToken(true);
          }
        } else {
          // Check if session is already active (fallback)
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setHasToken(true);
          }
        }
      } catch (err) {
        console.error('Error parsing recovery tokens');
      } finally {
        setIsVerifying(false);
      }
    };

    handleSessionRecovery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      showToast(
        isEn ? 'Please fill in all fields.' : 'Lütfen tüm alanları doldurun.',
        'warning'
      );
      return;
    }

    if (password !== confirmPassword) {
      showToast(
        isEn ? 'Passwords do not match.' : 'Şifreler birbiriyle uyuşmuyor.',
        'error'
      );
      return;
    }

    if (password.length < 6) {
      showToast(
        isEn ? 'Password must be at least 6 characters long.' : 'Şifre en az 6 karakter olmalıdır.',
        'warning'
      );
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast(
          isEn 
            ? 'Password updated successfully. Please log in.' 
            : 'Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz.',
          'success'
        );
        
        // Clean URL hash and redirect
        window.history.replaceState(null, '', window.location.pathname);
        navigateTo('admin');
      }
    } catch (err: any) {
      console.error(err);
      showToast(
        isEn ? 'An error occurred while updating password.' : 'Şifre güncellenirken bir hata oluştu.',
        'error'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isVerifying) {
    return (
      <>
        <SEOHead title="Şifre Sıfırlama" noIndex={true} />
        <div
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'radial-gradient(circle at 50% 50%, #1C2340 0%, #0A0D18 100%)',
          color: '#F0DAC5',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(240,218,197,0.1)',
            borderTopColor: '#F0DAC5',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#A0AEC0', fontSize: '14px' }}>
            {isEn ? 'Verifying link...' : 'Bağlantı kontrol ediliyor...'}
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Şifre Sıfırlama | Av. Eren Akarsu" noIndex={true} />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 50%, #1C2340 0%, #0A0D18 100%)',
          padding: '24px',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          padding: '40px',
          border: '1px solid rgba(240, 218, 197, 0.15)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          color: '#FFFFFF'
        }}
      >
        {/* Logo Title */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img 
            src="/monogram-ea.png" 
            alt="EA Monogram" 
            style={{
              height: '75px',
              width: 'auto',
              objectFit: 'contain',
              margin: '0 auto 14px',
              display: 'block'
            }}
          />
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#F0DAC5' }}>
            {isEn ? 'Set New Password' : 'Yeni Şifre Belirleme'}
          </h2>
        </div>

        {hasToken ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* New Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
                {isEn ? 'New Password' : 'Yeni Şifre'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', color: '#FFFFFF', background: 'rgba(28, 35, 64, 0.6)' }}
                  required
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#A0AEC0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F0DAC5'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A0AEC0'}
                  title={showPassword ? (isEn ? 'Hide password' : 'Şifreyi gizle') : (isEn ? 'Show password' : 'Şifreyi göster')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
                {isEn ? 'Confirm Password' : 'Yeni Şifre Tekrarı'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '40px', paddingRight: '40px', color: '#FFFFFF', background: 'rgba(28, 35, 64, 0.6)' }}
                  required
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#A0AEC0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#F0DAC5'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#A0AEC0'}
                  title={showConfirmPassword ? (isEn ? 'Hide password' : 'Şifreyi gizle') : (isEn ? 'Show password' : 'Şifreyi göster')}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isUpdating}
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                background: '#F0DAC5', 
                color: '#1C2340', 
                border: 'none', 
                boxShadow: 'none', 
                fontWeight: 600,
                opacity: isUpdating ? 0.7 : 1,
                cursor: isUpdating ? 'not-allowed' : 'pointer'
              }}
            >
              {isUpdating 
                ? (isEn ? 'Updating password...' : 'Şifre güncelleniyor...') 
                : (isEn ? 'Update Password' : 'Şifreyi Güncelle')}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: '#E53E3E', marginBottom: '10px' }}>
              <ShieldAlert size={48} />
            </div>
            <p style={{ color: '#E2E8F0', fontSize: '14px', lineHeight: 1.6 }}>
              {isEn 
                ? 'Invalid or expired password reset link. Please request a new link.'
                : 'Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı. Lütfen giriş sayfasından tekrar talep oluşturun.'}
            </p>
            <button
              onClick={() => navigateTo('admin')}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                background: '#F0DAC5',
                color: '#1C2340',
                border: 'none',
                boxShadow: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isEn ? 'Back to Login' : 'Giriş Ekranına Dön'}
            </button>
          </div>
        )}

        {/* Hint info */}
        <div style={{ marginTop: '24px', background: 'rgba(240, 218, 197, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(240, 218, 197, 0.1)', fontSize: '11px', color: '#A0AEC0', display: 'flex', gap: '8px' }}>
          <Info size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
          <span>
            {isEn
              ? 'Security Tip: Create a strong password with letters, numbers, and symbols.'
              : 'Güvenlik İpucu: Harf, rakam ve semboller içeren güçlü bir şifre belirleyin.'}
          </span>
        </div>
      </div>
    </div>
    </>
  );
};
