import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useApp } from '../context/AppContext';
import * as settingsService from '../services/siteSettingsService';
import type { SiteSettings } from '../services/siteSettingsService';
import type { BlogPost, Client, CaseFile, Appointment, Hearing, Task, PrecedentDecision } from '../context/AppContext';
import { 
  Lock, User, Mail, Calendar, Clock, BookOpen, Users, Folder, Scale, 
  CreditCard, Sparkles, Settings, BarChart2, CheckSquare, LogOut, Plus, 
  Trash2, Check, X, ShieldAlert, Award, FileText, ChevronRight, Info,
  File, HelpCircle, Eye, EyeOff, ArrowLeft, Menu, Home, Globe, Phone, Bell, Image, Activity, Cpu, Code
} from 'lucide-react';
import { ContentTypeCard } from '../components/admin/ContentTypeCard';
import { ContentEditorLayout } from '../components/admin/ContentEditorLayout';
import { RichTextEditor } from '../components/admin/RichTextEditor';
import { MediaUploadBox } from '../components/admin/MediaUploadBox';
import { SEOSettingsPanel } from '../components/admin/SEOSettingsPanel';
import { ContentListTable } from '../components/admin/ContentListTable';
import { ContentPreviewModal } from '../components/admin/ContentPreviewModal';
import { CustomCheckbox } from '../components/ui/CustomCheckbox';
import { CustomSelect } from '../components/ui/CustomSelect';
import { isAdminEmail } from '../utils/adminConfig';

export const AdminPanel: React.FC = () => {
  const { 
    blogPosts, addBlogPost, updateBlogPost, deleteBlogPost,
    precedentDecisions, addPrecedentDecision, updatePrecedentDecision, deletePrecedentDecision,
    clients, addClient,
    caseFiles, addCaseFile, updateCaseStatus,
    appointments, updateAppointmentStatus,
    hearings, addHearing,
    tasks, addTask, updateTaskStatus,
    chatbotSettings, updateChatbotSettings,
    siteSettings, updateSiteSettings, resetSiteSettings,
    language,
    showToast,
    navigateTo
  } = useApp();

  const isEn = language === 'en';

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'contact' | 'homepage' | 'appointment' | 'footer' | 'ai'>('general');
  const [editedSettings, setEditedSettings] = useState<any>(null);

  // Sync state values with global siteSettings context
  useEffect(() => {
    if (siteSettings) {
      setEditedSettings(JSON.parse(JSON.stringify(siteSettings)));
    }
  }, [siteSettings]);

  const [dbTestResult, setDbTestResult] = useState<string>('');
  const [storageTestResult, setStorageTestResult] = useState<string>('');
  const [envTestResult, setEnvTestResult] = useState<string>('');
  const [logsSearch, setLogsSearch] = useState<string>('');
  const [logsTypeFilter, setLogsTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isAdminEmail(session.user?.email)) {
            setIsLoggedIn(true);
          } else {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            showToast(isEn ? 'Unauthorized email address.' : 'Yetkisiz e-posta adresi ile giriş yapılamaz.', 'error');
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        if (isAdminEmail(session.user?.email)) {
          setIsLoggedIn(true);
        } else {
          await supabase.auth.signOut();
          setIsLoggedIn(false);
          showToast(isEn ? 'Unauthorized email address.' : 'Yetkisiz e-posta adresi ile giriş yapılamaz.', 'error');
        }
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isEn]);

  useEffect(() => {
    if (isAdminSidebarOpen && window.innerWidth <= 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAdminSidebarOpen]);

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'blog' | 'clients' | 'cases' | 'calendar' | 'appointments' | 'chatbot' | 'kanban' | 'stats' | 'settings'
  >('dashboard');

  // Modals / Drawer toggles
  const [showClientModal, setShowClientModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showHearingModal, setShowHearingModal] = useState(false);

  // --- UNIFIED CONTENT MANAGEMENT (CMS) STATE SYSTEM ---
  const [cmsCategory, setCmsCategory] = useState<'NONE' | 'dilekce' | 'makale' | 'degerlendirme' | 'not' | 'hesaplama'>('NONE');
  const [cmsSubCategory, setCmsSubCategory] = useState<'NONE' | 'karar' | 'analiz'>('NONE');
  const [cmsMode, setCmsMode] = useState<'CATEGORIES' | 'LIST' | 'EDITOR'>('CATEGORIES');
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  // Common content states
  const [contentTitle, setContentTitle] = useState('');
  const [contentSlug, setContentSlug] = useState('');
  const [contentExcerpt, setContentExcerpt] = useState('');
  const [contentCoverImage, setContentCoverImage] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentTags, setContentTags] = useState('');
  const [contentStatus, setContentStatus] = useState('Taslak');
  const [contentReadTime, setContentReadTime] = useState('5 Dakika');
  const [contentAuthor, setContentAuthor] = useState('Avukat Eren Akarsu');
  const [contentShowOnHome, setContentShowOnHome] = useState(true);
  const [contentShowOnHub, setContentShowOnHub] = useState(true);
  const [contentAllowComments, setContentAllowComments] = useState(true);
  const [contentLikesActive, setContentLikesActive] = useState(true);
  const [contentIsFeatured, setContentIsFeatured] = useState(false);
  const [contentSeoTitle, setContentSeoTitle] = useState('');
  const [contentSeoDesc, setContentSeoDesc] = useState('');
  const [contentSeoKeywords, setContentSeoKeywords] = useState('');

  // Dilekçe / Doküman special states
  const [docType, setDocType] = useState('Dilekçe');
  const [docLawArea, setDocLawArea] = useState('İş Hukuku');
  const [docFileUrl, setDocFileUrl] = useState('');
  const [docDownloadable, setDocDownloadable] = useState(true);
  const [docFileDesc, setDocFileDesc] = useState('');
  const [docWarningText, setDocWarningText] = useState('Bu doküman genel örnek niteliğindedir. Somut olaya göre özelleştirilmesi gerekir.');

  // Makale special states
  const [articleAbstract, setArticleAbstract] = useState('');
  const [articleKeywords, setArticleKeywords] = useState('');
  const [articleAutoTOC, setArticleAutoTOC] = useState(true);
  const [articleBibliography, setArticleBibliography] = useState('');
  const [articleLawArticles, setArticleLawArticles] = useState('');
  const [articlePrecedents, setArticlePrecedents] = useState('');
  const [articleScrollProgress, setArticleScrollProgress] = useState(true);

  // Karar (Emsal Karar) special states
  const [decCourtName, setDecCourtName] = useState('');
  const [decEsas, setDecEsas] = useState('');
  const [decKarar, setDecKarar] = useState('');
  const [decDate, setDecDate] = useState('2026-07-05');
  const [decType, setDecType] = useState('Emsal Karar');
  const [decLawArea, setDecLawArea] = useState('İş Hukuku');
  const [decConcepts, setDecConcepts] = useState('');
  const [decKeyPoints, setDecKeyPoints] = useState('');
  const [decAssessment, setDecAssessment] = useState('');
  const [decOutcome, setDecOutcome] = useState('');
  const [decSource, setDecSource] = useState('');

  // Hesaplama special states
  const [calcType, setCalcType] = useState('Kıdem Tazminatı Hesaplama');
  const [calcWarning, setCalcWarning] = useState('Hesaplama sonuçları bilgilendirme amaçlıdır.');
  const [calcOrder, setCalcOrder] = useState(1);

  // Preview toggle
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Mock calculators list
  const [calculatorsList, setCalculatorsList] = useState([
    { id: 'calc-1', title: 'Kıdem Tazminatı Hesaplama', category: 'Hesaplama Araçları', publishedAt: '2026-07-01', status: 'Yayında' },
    { id: 'calc-2', title: 'İhbar Tazminatı Hesaplama', category: 'Hesaplama Araçları', publishedAt: '2026-07-02', status: 'Yayında' },
    { id: 'calc-3', title: 'Kira Artış Oranı Hesaplama', category: 'Hesaplama Araçları', publishedAt: '2026-07-03', status: 'Yayında' },
    { id: 'calc-4', title: 'Vekâlet Ücreti Hesaplama', category: 'Hesaplama Araçları', publishedAt: '2026-07-04', status: 'Yayında' }
  ]);

  // New Client form states
  const [newClientName, setNewClientName] = useState('');
  const [newClientTc, setNewClientTc] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientOcc, setNewClientOcc] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');

  // New Case form states
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseCourt, setNewCaseCourt] = useState('');
  const [newCaseOpposing, setNewCaseOpposing] = useState('');
  const [newCaseType, setNewCaseType] = useState<'HUKUK' | 'CEZA' | 'CMK'>('HUKUK');
  const [newCaseCat, setNewCaseCat] = useState('');
  const [newCaseStage, setNewCaseStage] = useState('');
  const [newCaseDesc, setNewCaseDesc] = useState('');

  // New Hearing form states
  const [newHearingCase, setNewHearingCase] = useState('');
  const [newHearingCourt, setNewHearingCourt] = useState('');
  const [newHearingDate, setNewHearingDate] = useState('2026-07-10');
  const [newHearingTime, setNewHearingTime] = useState('10:00');
  const [newHearingRoom, setNewHearingRoom] = useState('Salon 3');
  const [newHearingNotes, setNewHearingNotes] = useState('');

  // Kanban task states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Düşük' | 'Orta' | 'Yüksek' | 'Acil'>('Orta');
  const [newTaskDue, setNewTaskDue] = useState('2026-07-08');

  // Real login check
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;

    if (!isAdminEmail(email)) {
      showToast(
        isEn ? 'Unauthorized email address.' : 'Yetkisiz e-posta adresi ile giriş yapılamaz.',
        'error'
      );
      return;
    }

    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setIsLoggedIn(false);
        showToast(
          isEn 
            ? 'Giriş bilgileri hatalı veya kullanıcı yetkili değil.'
            : 'Giriş bilgileri hatalı veya kullanıcı yetkili değil.',
          'error'
        );
      } else if (data.session) {
        setIsLoggedIn(true);
        showToast(
          isEn ? 'Yönetici girişi başarılı.' : 'Yönetici girişi başarılı.',
          'success'
        );
      }
    } catch (err) {
      console.error(err);
      showToast(
        isEn ? 'An error occurred during sign in.' : 'Giriş yapılırken bir hata oluştu.',
        'error'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast(isEn ? 'Please enter your email address.' : 'Lütfen e-posta adresinizi girin.', 'warning');
      return;
    }
    if (!isAdminEmail(email)) {
      showToast(
        isEn ? 'Unauthorized email address.' : 'Yetkisiz e-posta adresi ile şifre sıfırlanamaz.',
        'error'
      );
      return;
    }
    if (isSendingReset) return;
    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://av-eren-akarsu-web.vercel.app/reset-password',
      });
      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast(
          isEn 
            ? 'Password reset link has been sent to your email.' 
            : 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
          'success'
        );
        setIsForgotMode(false);
      }
    } catch (err: any) {
      console.error(err);
      showToast(
        isEn ? 'An error occurred.' : 'Bir hata oluştu.',
        'error'
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setIsAdminSidebarOpen(false);
      showToast(
        isEn ? 'Signed out successfully.' : 'Başarıyla çıkış yapıldı.',
        'success'
      );
    } catch (err) {
      console.error('Sign out error:', err);
      setIsLoggedIn(false);
    }
  };



  // Add client logic
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) return;

    addClient({
      fullName: newClientName,
      tcIdentityNumber: newClientTc,
      phone: newClientPhone,
      email: newClientEmail,
      address: newClientAddress,
      occupation: newClientOcc,
      notes: newClientNotes
    });

    setShowClientModal(false);
    setNewClientName('');
    setNewClientTc('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientAddress('');
    setNewClientOcc('');
    setNewClientNotes('');
  };

  // Add Case file logic
  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseClient || !newCaseTitle) return;

    const matchedClient = clients.find(c => c.id === newCaseClient);

    addCaseFile({
      clientId: newCaseClient,
      clientName: matchedClient ? matchedClient.fullName : (isEn ? 'Unknown Client' : 'Bilinmeyen Müvekkil'),
      title: newCaseTitle,
      caseNumber: newCaseNumber,
      courtName: newCaseCourt,
      opposingParty: newCaseOpposing,
      caseType: newCaseType,
      caseCategory: newCaseCat,
      stage: newCaseStage,
      status: 'Yapılacak',
      description: newCaseDesc
    });

    setShowCaseModal(false);
    setNewCaseTitle('');
    setNewCaseNumber('');
    setNewCaseCourt('');
    setNewCaseOpposing('');
    setNewCaseCat('');
    setNewCaseStage('');
    setNewCaseDesc('');
  };

  // Add Hearing logic
  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHearingCase) return;

    const matchedCase = caseFiles.find(cf => cf.id === newHearingCase);

    addHearing({
      caseFileId: newHearingCase,
      caseTitle: matchedCase ? matchedCase.title : (isEn ? 'Case File' : 'Dava Dosyası'),
      clientName: matchedCase ? matchedCase.clientName : (isEn ? 'Client' : 'Müvekkil'),
      courtName: newHearingCourt || (matchedCase ? matchedCase.courtName : (isEn ? 'Court' : 'Mahkeme')),
      hearingDate: newHearingDate,
      hearingTime: newHearingTime,
      courtroom: newHearingRoom,
      status: 'Yaklaşan',
      notes: newHearingNotes
    });

    setShowHearingModal(false);
    setNewHearingNotes('');
  };

  // Add task logic
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dueDate: newTaskDue
    });

    setNewTaskTitle('');
  };

  // Safe check calculations
  const totalRevenue = appointments
    .filter(app => app.status === 'Onaylandı' || app.status === 'Tamamlandı')
    .reduce((sum, app) => sum + app.paymentAmount, 0);

  // Return Loading Screen while checking session
  if (isAuthLoading) {
    return (
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
            width: '40px', height: '40px', borderRadius: '50%',
            border: '3px solid rgba(240,218,197,0.1)', borderTopColor: '#F0DAC5',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#A0AEC0', fontSize: '14px' }}>{isEn ? 'Verifying Session...' : 'Oturum Kontrol Ediliyor...'}</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Return Login Panel if not logged in
  if (!isLoggedIn) {
    return (
      <div 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: 'radial-gradient(circle at 50% 50%, #1C2340 0%, #0A0D18 100%)',
          padding: '24px'
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
            <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
              {isForgotMode 
                ? (isEn ? 'Reset Password' : 'Şifre Sıfırlama Talebi')
                : (isEn ? 'Administrator Login' : 'Yönetici Giriş Ekranı')}
            </h2>
          </div>

          {isForgotMode ? (
            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
                  {isEn ? 'Email Address' : 'E-posta Adresi'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px', color: '#FFFFFF', background: 'rgba(28, 35, 64, 0.6)' }}
                    required
                  />
                  <Mail size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSendingReset}
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  background: '#F0DAC5', 
                  color: '#1C2340', 
                  border: 'none', 
                  boxShadow: 'none', 
                  fontWeight: 600,
                  opacity: isSendingReset ? 0.7 : 1,
                  cursor: isSendingReset ? 'not-allowed' : 'pointer'
                }}
              >
                {isSendingReset 
                  ? (isEn ? 'Sending link...' : 'Bağlantı gönderiliyor...') 
                  : (isEn ? 'Send Reset Link' : 'Sıfırlama Bağlantısı Gönder')}
              </button>

              <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '10px' }}>
                <span 
                  style={{ color: '#F0DAC5', cursor: 'pointer', textDecoration: 'underline' }} 
                  onClick={() => setIsForgotMode(false)}
                >
                  {isEn ? 'Back to Secure Login' : 'Güvenli Girişe Geri Dön'}
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
                  {isEn ? 'Email Address' : 'E-posta Adresi'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', paddingLeft: '40px', color: '#FFFFFF', background: 'rgba(28, 35, 64, 0.6)' }}
                    required
                  />
                  <Mail size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
                  {isEn ? 'Password' : 'Şifre'}
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

              {/* Remember Me */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <CustomCheckbox 
                  checked={rememberMe} 
                  onChange={setRememberMe} 
                  label={isEn ? 'Remember Me' : 'Beni Hatırla'} 
                />
                <span style={{ color: '#F0DAC5', cursor: 'pointer' }} onClick={() => setIsForgotMode(true)}>
                  {isEn ? 'Forgot Password' : 'Şifremi Unuttum'}
                </span>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isLoggingIn}
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  background: '#F0DAC5', 
                  color: '#1C2340', 
                  border: 'none', 
                  boxShadow: 'none', 
                  fontWeight: 600,
                  opacity: isLoggingIn ? 0.7 : 1,
                  cursor: isLoggingIn ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoggingIn 
                  ? (isEn ? 'Signing in...' : 'Giriş yapılıyor...') 
                  : (isEn ? 'Secure Login' : 'Güvenli Giriş Yap')}
              </button>
            </form>
          )}

          {/* Hint info */}
          <div style={{ marginTop: '24px', background: 'rgba(240, 218, 197, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(240, 218, 197, 0.1)', fontSize: '11px', color: '#A0AEC0', display: 'flex', gap: '8px' }}>
            <Info size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
            <span>
              {isEn
                ? 'Authorized Access Only: This panel is protected by secure authentication.'
                : 'Yetkili Erişimi: Bu panel güvenli kimlik doğrulama ile korunmaktadır.'}
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- CMS Helper Functions ---
  const handleEditContent = (id: string) => {
    // Check in blogPosts
    const post = blogPosts.find(p => p.id === id);
    if (post) {
      setEditingContentId(post.id);
      setContentTitle(post.title);
      setContentSlug(post.slug);
      setContentExcerpt(post.excerpt);
      setContentBody(post.content);
      setContentCoverImage(post.coverImage);
      setContentTags(post.tags.join(', '));
      setContentStatus(post.publishedAt ? 'Yayında' : 'Taslak');
      setContentReadTime(post.readingTime);
      
      // Determine CMS Category from blogPost category
      if (post.category === 'Makaleler') setCmsCategory('makale');
      else if (post.category === 'Dilekçeler') setCmsCategory('dilekce');
      else if (post.category === 'Notlar') setCmsCategory('not');
      else if (post.category === 'Analizler') {
        setCmsCategory('degerlendirme');
        setCmsSubCategory('analiz');
      }
      setCmsMode('EDITOR');
      return;
    }

    // Check in precedentDecisions
    const dec = precedentDecisions.find(d => d.id === id);
    if (dec) {
      setEditingContentId(dec.id);
      setContentTitle(dec.title || `${dec.court} - ${dec.esas}/${dec.karar}`);
      setDecCourtName(dec.court);
      setDecEsas(dec.esas);
      setDecKarar(dec.karar);
      setDecDate(dec.decisionDate);
      setContentTags(dec.tags.join(', '));
      setContentExcerpt(dec.summary);
      setContentBody(dec.fullText);
      setContentStatus(dec.status);
      setContentShowOnHome(dec.showOnHome);
      setContentShowOnHub(dec.showOnLegalDocs);
      setContentIsFeatured(dec.isFeatured);
      setCmsCategory('degerlendirme');
      setCmsSubCategory('karar');
      setCmsMode('EDITOR');
      return;
    }

    // Check in calculatorsList
    const calc = calculatorsList.find(c => c.id === id);
    if (calc) {
      setEditingContentId(calc.id);
      setContentTitle(calc.title);
      setContentStatus(calc.status);
      setCalcType(calc.title);
      setCmsCategory('hesaplama');
      setCmsMode('EDITOR');
      return;
    }
  };

  const handleCreateNewContent = (cat: 'makale' | 'dilekce' | 'not' | 'karar' | 'analiz' | 'hesaplama') => {
    setEditingContentId(null);
    setContentTitle('');
    setContentSlug('');
    setContentExcerpt('');
    setContentCoverImage('');
    setContentBody('');
    setContentTags('');
    setContentStatus('Taslak');
    setContentReadTime('5 Dakika');
    setContentAuthor('Avukat Eren Akarsu');
    setContentShowOnHome(true);
    setContentShowOnHub(true);
    setContentAllowComments(true);
    setContentLikesActive(true);
    setContentIsFeatured(false);
    setContentSeoTitle('');
    setContentSeoDesc('');
    setContentSeoKeywords('');

    // Category settings
    if (cat === 'makale') {
      setCmsCategory('makale');
      setArticleAbstract('');
      setArticleKeywords('');
      setArticleBibliography('');
      setArticleLawArticles('');
      setArticlePrecedents('');
    } else if (cat === 'dilekce') {
      setCmsCategory('dilekce');
      setDocType('Dilekçe');
      setDocLawArea('İş Hukuku');
      setDocFileUrl('');
      setDocFileDesc('');
    } else if (cat === 'not') {
      setCmsCategory('not');
    } else if (cat === 'karar') {
      setCmsCategory('degerlendirme');
      setCmsSubCategory('karar');
      setDecCourtName('Yargıtay 9. Hukuk Dairesi');
      setDecEsas('');
      setDecKarar('');
      setDecDate(new Date().toISOString().split('T')[0]);
      setDecType('Emsal Karar');
      setDecLawArea('İş Hukuku');
      setDecConcepts('');
      setDecKeyPoints('');
      setDecAssessment('');
      setDecOutcome('');
      setDecSource('');
    } else if (cat === 'analiz') {
      setCmsCategory('degerlendirme');
      setCmsSubCategory('analiz');
    } else if (cat === 'hesaplama') {
      setCmsCategory('hesaplama');
      setCalcType('Kıdem Tazminatı Hesaplama');
      setCalcWarning('Hesaplama sonuçları bilgilendirme amaçlıdır.');
      setCalcOrder(1);
    }
    setCmsMode('EDITOR');
  };

  const handleDeleteContent = (id: string) => {
    if (id.startsWith('post-')) {
      deleteBlogPost(id);
      showToast(isEn ? 'Content item deleted.' : 'İçerik başarıyla silindi.', 'success');
    } else if (id.startsWith('dec-')) {
      deletePrecedentDecision(id);
      showToast(isEn ? 'Precedent decision deleted.' : 'Emsal karar silindi.', 'success');
    } else if (id.startsWith('calc-')) {
      setCalculatorsList(prev => prev.filter(c => c.id !== id));
      showToast(isEn ? 'Calculator deleted.' : 'Hesaplama aracı silindi.', 'success');
    }
  };

  const handleSaveContent = async (statusOverride?: string) => {
    if (!contentTitle.trim()) {
      showToast(isEn ? 'Title is required.' : 'Başlık alanı zorunludur.', 'warning');
      return;
    }

    const currentStatus = statusOverride || contentStatus;
    const cleanTags = contentTags.split(',').map(t => t.trim()).filter(Boolean);

    if (cmsCategory === 'makale' || cmsCategory === 'dilekce' || cmsCategory === 'not' || (cmsCategory === 'degerlendirme' && cmsSubCategory === 'analiz')) {
      const categoryLabel = 
        cmsCategory === 'makale' ? 'Makaleler' :
        cmsCategory === 'dilekce' ? 'Dilekçeler' :
        cmsCategory === 'not' ? 'Notlar' : 'Analizler';

      const postData = {
        title: contentTitle,
        slug: contentSlug || contentTitle.toLowerCase().replace(/\s+/g, '-'),
        excerpt: contentExcerpt,
        content: contentBody,
        coverImage: contentCoverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
        category: categoryLabel as any,
        readingTime: contentReadTime,
        tags: cleanTags
      };

      try {
        if (editingContentId) {
          await updateBlogPost(editingContentId, postData);
          showToast(isEn ? 'Content updated successfully.' : 'İçerik başarıyla güncellendi.', 'success');
        } else {
          await addBlogPost(postData);
          showToast(isEn ? 'Content published successfully.' : 'İçerik başarıyla yayınlandı.', 'success');
        }
        setCmsMode('LIST');
      } catch (err) {
        console.error('Save blog post error:', err);
      }
    }

    else if (cmsCategory === 'degerlendirme' && cmsSubCategory === 'karar') {
      const decisionData = {
        title: contentTitle,
        court: decCourtName || 'Yargıtay 9. Hukuk Dairesi',
        esas: decEsas || '2025/1234',
        karar: decKarar || '2026/5678',
        decisionDate: decDate,
        category: decLawArea,
        tags: cleanTags,
        summary: contentExcerpt,
        fullText: contentBody,
        isFeatured: contentIsFeatured,
        status: currentStatus as any,
        sortOrder: 1,
        showOnHome: contentShowOnHome,
        showOnLegalDocs: contentShowOnHub
      };

      try {
        if (editingContentId) {
          await updatePrecedentDecision(editingContentId, decisionData);
          showToast(isEn ? 'Precedent decision updated.' : 'Emsal karar güncellendi.', 'success');
        } else {
          await addPrecedentDecision(decisionData);
          showToast(isEn ? 'Precedent decision added.' : 'Emsal karar başarıyla eklendi.', 'success');
        }
        setCmsMode('LIST');
      } catch (err) {
        console.error('Save precedent decision error:', err);
      }
    }

    else if (cmsCategory === 'hesaplama') {
      const calcData = {
        id: editingContentId || `calc-${Date.now()}`,
        title: contentTitle,
        category: 'Hesaplama Araçları',
        publishedAt: new Date().toISOString().split('T')[0],
        status: currentStatus
      };

      if (editingContentId) {
        setCalculatorsList(prev => prev.map(c => c.id === editingContentId ? calcData : c));
        showToast(isEn ? 'Calculator updated.' : 'Hesaplama aracı güncellendi.', 'success');
      } else {
        setCalculatorsList(prev => [calcData, ...prev]);
        showToast(isEn ? 'Calculator added.' : 'Hesaplama aracı eklendi.', 'success');
      }
      setCmsMode('LIST');
    }
  };

  // Get current list items based on active CMS category selection
  const getCurrentListItems = () => {
    if (cmsCategory === 'makale') {
      return blogPosts.filter(p => p.category === 'Makaleler').map(p => ({
        id: p.id, title: p.title, category: 'Makaleler', publishedAt: p.publishedAt, status: p.publishedAt ? 'Yayında' : 'Taslak'
      }));
    }
    if (cmsCategory === 'dilekce') {
      return blogPosts.filter(p => p.category === 'Dilekçeler').map(p => ({
        id: p.id, title: p.title, category: 'Dilekçeler', publishedAt: p.publishedAt, status: p.publishedAt ? 'Yayında' : 'Taslak'
      }));
    }
    if (cmsCategory === 'not') {
      return blogPosts.filter(p => p.category === 'Notlar').map(p => ({
        id: p.id, title: p.title, category: 'Notlar', publishedAt: p.publishedAt, status: p.publishedAt ? 'Yayında' : 'Taslak'
      }));
    }
    if (cmsCategory === 'degerlendirme') {
      if (cmsSubCategory === 'karar') {
        return precedentDecisions.map(d => ({
          id: d.id, title: d.title || `${d.court} - ${d.esas}/${d.karar}`, category: 'Yargı Kararları', publishedAt: d.decisionDate, status: d.status
        }));
      } else {
        return blogPosts.filter(p => p.category === 'Analizler').map(p => ({
          id: p.id, title: p.title, category: 'Kanun Analizleri', publishedAt: p.publishedAt, status: p.publishedAt ? 'Yayında' : 'Taslak'
        }));
      }
    }
    if (cmsCategory === 'hesaplama') {
      return calculatorsList;
    }
    return [];
  };

  // Bulk actions handlers
  const handleBulkStatusChange = (ids: string[], newStatus: string) => {
    ids.forEach(id => {
      if (id.startsWith('post-')) {
        updateBlogPost(id, { publishedAt: newStatus === 'Yayında' ? new Date().toISOString().split('T')[0] : '' });
      } else if (id.startsWith('dec-')) {
        updatePrecedentDecision(id, { status: newStatus as any });
      } else if (id.startsWith('calc-')) {
        setCalculatorsList(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    });
    showToast(isEn ? 'Bulk status update applied.' : 'Toplu durum güncellemesi uygulandı.', 'success');
  };

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach(id => {
      if (id.startsWith('post-')) deleteBlogPost(id);
      else if (id.startsWith('dec-')) deletePrecedentDecision(id);
      else if (id.startsWith('calc-')) setCalculatorsList(prev => prev.filter(c => c.id !== id));
    });
    showToast(isEn ? 'Bulk delete completed.' : 'Toplu silme işlemi tamamlandı.', 'success');
  };

  // Dashboard structure
  return (
    <div className={`admin-layout ${isAdminSidebarOpen ? 'sidebar-open' : ''}`}>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .admin-mobile-header {
            display: flex !important;
          }
          .admin-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 280px !important;
            transform: translateX(-100%) !important;
            z-index: 10001 !important;
            overflow-y: auto !important;
          }
          .admin-layout.sidebar-open .admin-sidebar {
            transform: translateX(0) !important;
          }
        }
        .admin-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 768px) {
          .admin-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      
      {/* Sidebar Backdrop Overlay on Mobile */}
      {isAdminSidebarOpen && (
        <div 
          onClick={() => setIsAdminSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1000,
            backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* Sidebar Panel */}
      <aside className="admin-sidebar">
        
        {/* Monogram title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/monogram-ea.png" 
            alt="EA Monogram" 
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
            Avukat Eren Akarsu
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {[
            { id: 'dashboard', label: isEn ? 'Dashboard' : 'Genel Durum', icon: <Scale size={16} /> },
            { id: 'blog', label: isEn ? 'Content Management' : 'İçerik Yönetimi', icon: <BookOpen size={16} /> },
            { id: 'clients', label: isEn ? 'Clients' : 'Müvekkiller', icon: <Users size={16} /> },
            { id: 'cases', label: isEn ? 'Case Files' : 'Dava Dosyaları', icon: <Folder size={16} /> },
            { id: 'calendar', label: isEn ? 'Hearings' : 'Duruşmalar', icon: <Calendar size={16} /> },
            { id: 'appointments', label: isEn ? 'Appointments' : 'Randevu & Ödeme', icon: <CreditCard size={16} /> },
            { id: 'kanban', label: isEn ? 'Tasks (Kanban)' : 'Görevler (Kanban)', icon: <CheckSquare size={16} /> },
            { id: 'chatbot', label: isEn ? 'AI Chatbot' : 'AI Chatbot', icon: <Sparkles size={16} /> },
            { id: 'stats', label: isEn ? 'Statistics' : 'İstatistikler', icon: <BarChart2 size={16} /> },
            { id: 'settings', label: isEn ? 'Site Settings' : 'Site Ayarları', icon: <Settings size={16} /> }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsAdminSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: isActive ? '#1C2340' : '#A0AEC0',
                  background: isActive ? '#F0DAC5' : 'transparent',
                  transition: 'var(--transition-fast)'
                }}
              >
                {tab.icon} {tab.label}
              </div>
            );
          })}
        </nav>

        {/* Return to Website link */}
        <div
          onClick={() => navigateTo('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#F0DAC5',
            marginTop: 'auto',
            borderTop: '1px solid rgba(240, 218, 197, 0.05)',
            paddingTop: '20px'
          }}
        >
          <Home size={16} /> {isEn ? 'Back to Website' : 'Siteye Dön'}
        </div>

        {/* Exit link */}
        <div
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            color: '#EF4444',
            paddingTop: '10px'
          }}
        >
          <LogOut size={16} /> {isEn ? 'Sign Out' : 'Çıkış Yap'}
        </div>

      </aside>

      {/* Main Workspace content */}
      <main className="admin-workspace" style={{ flex: 1 }}>
        
        {/* Mobile Header Bar for Admin */}
        <div 
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid rgba(240, 218, 197, 0.1)', 
            paddingBottom: '15px',
            marginBottom: '10px'
          }}
          className="admin-mobile-header"
        >
          <button
            onClick={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#F0DAC5', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Menu size={20} />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{isEn ? 'Admin Menu' : 'Yönetici Menüsü'}</span>
          </button>

          <span style={{ fontSize: '13px', color: '#A0AEC0', border: '1px solid rgba(240, 218, 197, 0.2)', padding: '4px 10px', borderRadius: '20px' }}>
            {activeTab === 'dashboard' && (isEn ? 'Dashboard' : 'Genel Durum')}
            {activeTab === 'blog' && (isEn ? 'Content Management' : 'İçerik Yönetimi')}
            {activeTab === 'clients' && (isEn ? 'Clients' : 'Müvekkiller')}
            {activeTab === 'cases' && (isEn ? 'Case Files' : 'Dava Takibi')}
            {activeTab === 'appointments' && (isEn ? 'Appointments' : 'Randevular')}
            {activeTab === 'kanban' && (isEn ? 'Kanban Tasks' : 'Kanban Takip')}
            {activeTab === 'chatbot' && (isEn ? 'Chatbot' : 'Yapay Zekâ')}
          </span>

          <button
            onClick={() => navigateTo('home')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#F0DAC5', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Home size={18} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Website' : 'Siteye Dön'}</span>
          </button>
        </div>

        {/* Active Route display */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {isEn ? 'Dashboard' : 'Genel Durum'}
              </h2>
              <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                {isEn ? 'Platform statistics and upcoming hearings summary' : 'Platform istatistikleri ve yaklaşan duruşmalar özeti'}
              </p>
            </div>

            {/* Quick Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#0C101E', padding: '20px', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <span style={{ fontSize: '11px', color: '#A0AEC0', textTransform: 'uppercase' }}>{isEn ? 'Total Revenue' : 'Toplam Ciro'}</span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px', color: '#F0DAC5' }}>
                  {totalRevenue.toLocaleString(isEn ? 'en-US' : 'tr-TR')} {isEn ? 'TRY' : 'TL'}
                </h3>
              </div>
              <div style={{ background: '#0C101E', padding: '20px', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <span style={{ fontSize: '11px', color: '#A0AEC0', textTransform: 'uppercase' }}>{isEn ? 'Active Clients' : 'Aktif Müvekkil'}</span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px', color: '#F0DAC5' }}>{clients.length}</h3>
              </div>
              <div style={{ background: '#0C101E', padding: '20px', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <span style={{ fontSize: '11px', color: '#A0AEC0', textTransform: 'uppercase' }}>{isEn ? 'Case Files' : 'Dava Dosyası'}</span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px', color: '#F0DAC5' }}>{caseFiles.length}</h3>
              </div>
              <div style={{ background: '#0C101E', padding: '20px', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <span style={{ fontSize: '11px', color: '#A0AEC0', textTransform: 'uppercase' }}>{isEn ? 'Hearings' : 'Duruşmalar'}</span>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px', color: '#F0DAC5' }}>{hearings.length}</h3>
              </div>
            </div>

            {/* Hearings list */}
            <div style={{ background: '#0C101E', borderRadius: '12px', padding: '24px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#F0DAC5', marginBottom: '16px' }}>
                {isEn ? "Today's / Upcoming Hearings" : 'Bugünkü / Yaklaşan Duruşmalar'}
              </h4>
              <div className="table-responsive-wrapper">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.1)', color: '#A0AEC0', textAlign: 'left' }}>
                      <th style={{ padding: '12px' }}>{isEn ? 'Case / Client' : 'Dosya / Müvekkil'}</th>
                      <th style={{ padding: '12px' }}>{isEn ? 'Court / Room' : 'Mahkeme / Salon'}</th>
                      <th style={{ padding: '12px' }}>{isEn ? 'Date / Time' : 'Tarih / Saat'}</th>
                      <th style={{ padding: '12px' }}>{isEn ? 'Status' : 'Durum'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hearings.map((h) => (
                      <tr key={h.id} style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.05)' }}>
                        <td style={{ padding: '12px' }}>
                          <div><strong>{h.caseTitle}</strong></div>
                          <div style={{ fontSize: '11px', color: '#718096' }}>{isEn ? 'Client:' : 'Müvekkil:'} {h.clientName}</div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div>{h.courtName}</div>
                          <div style={{ fontSize: '11px', color: '#718096' }}>{h.courtroom}</div>
                        </td>
                        <td style={{ padding: '12px' }}>{h.hearingDate} {h.hearingTime}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>
                            {h.status === 'Yaklaşan' && isEn ? 'Upcoming' : h.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
                {/* Unified Content Management (CMS) System */}
        {activeTab === 'blog' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Category Selector Dashboard */}
            {cmsMode === 'CATEGORIES' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                    {isEn ? 'Content & Knowledge Hub Management' : 'İçerik ve Bilgi Bankası Yönetimi'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                    {isEn 
                      ? 'Select a content type category card below to create new items or manage current publications.' 
                      : 'Web sitenizde sergilenecek tüm hukuki dokümanları, makaleleri ve hesaplama araçlarını yönetmek için ilgili içerik kategorisini seçin.'
                    }
                  </p>
                </div>

                {cmsCategory === 'degerlendirme' && cmsSubCategory === 'NONE' ? (
                  /* Intermediate selector for Hukuki Değerlendirmeler */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', background: 'rgba(12, 16, 30, 0.45)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(240, 218, 197, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                        {isEn ? 'Select Legal Assessment Sub-Type' : 'Hukuki Değerlendirme Alt Türü Seçin'}
                      </h3>
                      <button 
                        onClick={() => { setCmsCategory('NONE'); setCmsSubCategory('NONE'); }} 
                        className="btn-secondary" 
                        style={{ height: '32px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <ArrowLeft size={12} /> {isEn ? 'Back' : 'Geri Dön'}
                      </button>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                      <div 
                        onClick={() => { setCmsSubCategory('karar'); setCmsMode('LIST'); }}
                        className="glass-panel sub-category-select-card"
                        style={{
                          padding: '30px',
                          borderRadius: '20px',
                          background: 'rgba(28, 35, 64, 0.35)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(240, 218, 197, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: '220px'
                        }}
                      >
                        {/* Glow Backdrop */}
                        <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,34,60,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(240, 218, 197, 0.05)', border: '1px solid rgba(240, 218, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0DAC5', flexShrink: 0 }}>
                            <Scale size={20} />
                          </div>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0DAC5', lineHeight: '1.3' }}>
                              {isEn ? 'Precedent Decisions' : 'Yargı Kararları / Emsal Kararlar'}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '6px', lineHeight: '1.4' }}>
                              {isEn ? 'Manage and assess court decisions with legal review summaries.' : 'Mahkemelerin emsal teşkil eden kararlarını ekleyin ve hukuki yorumunuzla sergileyin.'}
                            </p>
                          </div>
                        </div>

                        <button className="btn-primary" style={{ height: '32px', fontSize: '11px', background: 'var(--color-burgundy)', color: '#FFFFFF', border: 'none', marginTop: 'auto', width: '100%', pointerEvents: 'none' }}>
                          {isEn ? 'Manage' : 'Yönet'}
                        </button>
                      </div>

                      <div 
                        onClick={() => { setCmsSubCategory('analiz'); setCmsMode('LIST'); }}
                        className="glass-panel sub-category-select-card"
                        style={{
                          padding: '30px',
                          borderRadius: '20px',
                          background: 'rgba(28, 35, 64, 0.35)',
                          backdropFilter: 'blur(16px)',
                          border: '1px solid rgba(240, 218, 197, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '20px',
                          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          minHeight: '220px'
                        }}
                      >
                        {/* Glow Backdrop */}
                        <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(80,34,60,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(240, 218, 197, 0.05)', border: '1px solid rgba(240, 218, 197, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0DAC5', flexShrink: 0 }}>
                            <FileText size={20} />
                          </div>
                          <div style={{ flex: 1, textAlign: 'left' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#F0DAC5', lineHeight: '1.3' }}>
                              {isEn ? 'Law & Precedent Analyses' : 'Kanun ve İçtihat Analizleri'}
                            </h4>
                            <p style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '6px', lineHeight: '1.4' }}>
                              {isEn ? 'Detailed legal assessments and statutory reviews.' : 'Yeni mevzuatlar, kanun değişiklikleri ve güncel içtihatlara ilişkin profesyonel makaleler.'}
                            </p>
                          </div>
                        </div>

                        <button className="btn-primary" style={{ height: '32px', fontSize: '11px', background: 'var(--color-burgundy)', color: '#FFFFFF', border: 'none', marginTop: 'auto', width: '100%', pointerEvents: 'none' }}>
                          {isEn ? 'Manage' : 'Yönet'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Categories Grid with 3+2 Responsive Layout */
                  <div className="cms-categories-grid">
                    <div className="cms-card-wrapper">
                      <ContentTypeCard 
                        title={isEn ? 'Petition & Document Templates' : 'Dilekçe ve Doküman Örnekleri'}
                        description={isEn ? 'Standard petitions, agreements, notification files.' : 'Mahkemeler, icra daireleri ve resmi makamlar için dilekçe, sözleşme, ihtarname şablonları.'}
                        count={blogPosts.filter(p => p.category === 'Dilekçeler').length}
                        lastUpdated="2026-07-05"
                        icon={<FileText size={20} />}
                        onCreateNew={() => handleCreateNewContent('dilekce')}
                        onViewAll={() => { setCmsCategory('dilekce'); setCmsMode('LIST'); }}
                        isEn={isEn}
                      />
                    </div>
                    <div className="cms-card-wrapper">
                      <ContentTypeCard 
                        title={isEn ? 'Articles' : 'Makaleler'}
                        description={isEn ? 'Academic and informative legal articles.' : 'Akademik ve bilgilendirici hukuk yazıları, güncel mevzuat ve kanun açıklamaları.'}
                        count={blogPosts.filter(p => p.category === 'Makaleler').length}
                        lastUpdated="2026-07-04"
                        icon={<BookOpen size={20} />}
                        onCreateNew={() => handleCreateNewContent('makale')}
                        onViewAll={() => { setCmsCategory('makale'); setCmsMode('LIST'); }}
                        isEn={isEn}
                      />
                    </div>
                    <div className="cms-card-wrapper">
                      <ContentTypeCard 
                        title={isEn ? 'Legal Assessments' : 'Hukuki Değerlendirmeler'}
                        description={isEn ? 'Court rulings assessments and precedent reviews.' : 'Emsal yargı kararları analizleri ile kanun maddesi ve içtihat incelemeleri.'}
                        count={precedentDecisions.length + blogPosts.filter(p => p.category === 'Analizler').length}
                        lastUpdated="2026-07-05"
                        icon={<Scale size={20} />}
                        onCreateNew={() => { setCmsCategory('degerlendirme'); setCmsSubCategory('NONE'); }}
                        onViewAll={() => { setCmsCategory('degerlendirme'); setCmsSubCategory('NONE'); }}
                        isEn={isEn}
                      />
                    </div>
                    <div className="cms-card-wrapper">
                      <ContentTypeCard 
                        title={isEn ? 'Practice Notes' : 'Meslekten Notlar'}
                        description={isEn ? 'Observations, tips and reflections on the bar.' : 'Avukatlık mesleğine dair gözlemler, kişisel notlar, duruşma ve ofis tecrübeleri.'}
                        count={blogPosts.filter(p => p.category === 'Notlar').length}
                        lastUpdated="2026-07-01"
                        icon={<Info size={20} />}
                        onCreateNew={() => handleCreateNewContent('not')}
                        onViewAll={() => { setCmsCategory('not'); setCmsMode('LIST'); }}
                        isEn={isEn}
                      />
                    </div>
                    <div className="cms-card-wrapper">
                      <ContentTypeCard 
                        title={isEn ? 'Legal Calculators' : 'Hukuki Hesaplama Araçları'}
                        description={isEn ? 'Severance pay, legal interest rate config tools.' : 'Kıdem ve ihbar tazminatı, faiz, harç ve vekalet ücreti hesaplama araçları listesi.'}
                        count={calculatorsList.length}
                        lastUpdated="2026-07-05"
                        icon={<CreditCard size={20} />}
                        onCreateNew={() => handleCreateNewContent('hesaplama')}
                        onViewAll={() => { setCmsCategory('hesaplama'); setCmsMode('LIST'); }}
                        isEn={isEn}
                      />
                    </div>

                    <style>{`
                      .cms-categories-grid {
                        display: grid;
                        grid-template-columns: repeat(6, 1fr);
                        gap: 30px;
                        width: 100%;
                      }
                      .cms-card-wrapper {
                        grid-column: span 2;
                        display: flex;
                        flex-direction: column;
                      }
                      .cms-card-wrapper:nth-child(4) {
                        grid-column: 2 / span 2;
                      }
                      .cms-card-wrapper:nth-child(5) {
                        grid-column: 4 / span 2;
                      }

                      .sub-category-select-card:hover {
                        transform: translateY(-5px);
                        border-color: #50223C !important;
                        box-shadow: 0 10px 25px rgba(80, 34, 60, 0.25) !important;
                      }

                      @media (max-width: 1024px) {
                        .cms-categories-grid {
                          grid-template-columns: repeat(2, 1fr);
                          gap: 24px;
                        }
                        .cms-card-wrapper {
                          grid-column: span 1 !important;
                        }
                        .cms-card-wrapper:nth-child(4) {
                          grid-column: span 1 !important;
                        }
                        .cms-card-wrapper:nth-child(5) {
                          grid-column: span 2 !important;
                        }
                      }

                      @media (max-width: 768px) {
                        .cms-categories-grid {
                          grid-template-columns: 1fr;
                          gap: 20px;
                        }
                        .cms-card-wrapper {
                          grid-column: span 1 !important;
                        }
                        .cms-card-wrapper:nth-child(5) {
                          grid-column: span 1 !important;
                        }
                      }
                    `}</style>
                  </div>
                )}
              </div>
            )}

            {/* List View */}
            {cmsMode === 'LIST' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                      {cmsCategory === 'makale' && (isEn ? 'Articles List' : 'Makaleler Listesi')}
                      {cmsCategory === 'dilekce' && (isEn ? 'Document Templates' : 'Dilekçe ve Doküman Şablonları')}
                      {cmsCategory === 'not' && (isEn ? 'Practice Notes' : 'Meslekten Notlar')}
                      {cmsCategory === 'degerlendirme' && cmsSubCategory === 'karar' && (isEn ? 'Precedent Decisions' : 'Yargı Kararları (Emsal Kararlar)')}
                      {cmsCategory === 'degerlendirme' && cmsSubCategory === 'analiz' && (isEn ? 'Law Analyses' : 'Kanun ve İçtihat Analizleri')}
                      {cmsCategory === 'hesaplama' && (isEn ? 'Legal Calculators' : 'Hesaplama Araçları')}
                    </h2>
                    <span 
                      onClick={() => { setCmsCategory('NONE'); setCmsSubCategory('NONE'); setCmsMode('CATEGORIES'); }} 
                      style={{ fontSize: '12px', color: '#A0AEC0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}
                    >
                      <ArrowLeft size={12} /> {isEn ? 'Back to Categories' : 'Kategorilere Geri Dön'}
                    </span>
                  </div>

                  <button 
                    onClick={() => {
                      const typeMap = 
                        cmsCategory === 'degerlendirme' ? (cmsSubCategory === 'karar' ? 'karar' : 'analiz') : cmsCategory;
                      handleCreateNewContent(typeMap as any);
                    }} 
                    className="btn-primary" 
                    style={{ background: '#F0DAC5', color: '#1C2340' }}
                  >
                    <Plus size={16} /> {isEn ? 'Add New Item' : 'Yeni Ekle'}
                  </button>
                </div>

                <ContentListTable 
                  items={getCurrentListItems()}
                  onEdit={handleEditContent}
                  onDelete={handleDeleteContent}
                  onBulkStatusChange={handleBulkStatusChange}
                  onBulkDelete={handleBulkDelete}
                  isEn={isEn}
                />
              </div>
            )}

            {/* Editor Workspace View */}
            {cmsMode === 'EDITOR' && (
              <ContentEditorLayout
                onBack={() => setCmsMode('LIST')}
                onSaveDraft={() => handleSaveContent('Taslak')}
                onPreview={() => setIsPreviewOpen(true)}
                onPublish={() => handleSaveContent('Yayında')}
                onDelete={editingContentId ? () => handleDeleteContent(editingContentId) : undefined}
                status={contentStatus}
                isEn={isEn}
                sidebar={
                  /* Right Column: Config Sidebar */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Status Panel Card */}
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0DAC5', marginBottom: '14px', fontFamily: 'Outfit' }}>
                        {isEn ? 'Publish Options' : 'Yayın Parametreleri'}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '10px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Status' : 'Durum'}</label>
                          <CustomSelect 
                            value={contentStatus} 
                            onChange={setContentStatus} 
                            options={[
                              { value: 'Taslak', label: isEn ? 'Draft' : 'Taslak' },
                              { value: 'Yayında', label: isEn ? 'Published' : 'Yayında' },
                              { value: 'Planlandı', label: isEn ? 'Scheduled' : 'Planlandı' }
                            ]}
                          />
                        </div>

                        {cmsCategory !== 'hesaplama' && (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '10px', color: '#A0AEC0' }}>{isEn ? 'Reading time estimation' : 'Tahmini Okuma Süresi'}</label>
                              <input type="text" value={contentReadTime} onChange={(e) => setContentReadTime(e.target.value)} className="glass-input" style={{ width: '100%', height: '34px', fontSize: '12px' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '10px', color: '#A0AEC0' }}>{isEn ? 'Author' : 'Yazar'}</label>
                              <input type="text" value={contentAuthor} onChange={(e) => setContentAuthor(e.target.value)} className="glass-input" style={{ width: '100%', height: '34px', fontSize: '12px' }} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Settings Toggles panel card */}
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0DAC5', marginBottom: '14px', fontFamily: 'Outfit' }}>
                        {isEn ? 'Visibility Settings' : 'Görünürlük Ayarları'}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <CustomCheckbox 
                          checked={contentShowOnHome} 
                          onChange={setContentShowOnHome} 
                          label={isEn ? 'Show on Homepage' : 'Ana sayfada gösterilsin'} 
                        />
                        <CustomCheckbox 
                          checked={contentShowOnHub} 
                          onChange={setContentShowOnHub} 
                          label={isEn ? 'Show in Hub search' : 'Hukuki İçeriklerde gösterilsin'} 
                        />
                        {cmsCategory !== 'hesaplama' && (
                          <>
                            <CustomCheckbox 
                              checked={contentAllowComments} 
                              onChange={setContentAllowComments} 
                              label={isEn ? 'Allow comments' : 'Yorumlara izin ver'} 
                            />
                            <CustomCheckbox 
                              checked={contentIsFeatured} 
                              onChange={setContentIsFeatured} 
                              label={isEn ? 'Mark as featured' : 'Öne çıkarılmış içerik'} 
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Tags Panel */}
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0DAC5', marginBottom: '14px', fontFamily: 'Outfit' }}>
                        {isEn ? 'Tags' : 'Etiketler'}
                      </h3>
                      <input 
                        type="text" 
                        value={contentTags} 
                        onChange={(e) => setContentTags(e.target.value)} 
                        className="glass-input" 
                        placeholder={isEn ? "Tags (comma separated)" : "Etiketler (virgülle ayırın)"}
                        style={{ width: '100%', fontSize: '12px' }}
                      />
                    </div>

                    {/* SEO Settings Panel Card */}
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#F0DAC5', marginBottom: '14px', fontFamily: 'Outfit' }}>
                        {isEn ? 'SEO Engine Configuration' : 'Arama Motoru (SEO) Ayarları'}
                      </h3>
                      <SEOSettingsPanel
                        seoTitle={contentSeoTitle}
                        setSeoTitle={setContentSeoTitle}
                        seoDesc={contentSeoDesc}
                        setSeoDesc={setContentSeoDesc}
                        slug={contentSlug}
                        setSlug={setContentSlug}
                        keywords={contentSeoKeywords}
                        setKeywords={setContentSeoKeywords}
                        isEn={isEn}
                      />
                    </div>

                  </div>
                }
              >
                {/* Left Column: Editor Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Content Title */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0', textTransform: 'uppercase' }}>
                      {isEn ? 'Content Title' : 'İçerik Başlığı'}
                    </label>
                    <input 
                      type="text" 
                      value={contentTitle} 
                      onChange={(e) => setContentTitle(e.target.value)} 
                      className="glass-input" 
                      placeholder={isEn ? "Title tag..." : "Başlık girin..."}
                      style={{ width: '100%', fontSize: '16px', fontWeight: 600 }}
                    />
                  </div>

                  {/* Excerpt / Summary */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0', textTransform: 'uppercase' }}>
                      {isEn ? 'Excerpt / Summary' : 'Kısa Özet / Excerpt'}
                    </label>
                    <textarea 
                      rows={2} 
                      value={contentExcerpt} 
                      onChange={(e) => setContentExcerpt(e.target.value)} 
                      className="glass-input" 
                      placeholder={isEn ? "Brief description display..." : "Arama listelerinde ve kartlarda sergilenecek özet metin..."}
                      style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }}
                    />
                  </div>

                  {/* Kapak Görseli Box */}
                  {cmsCategory !== 'hesaplama' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0', textTransform: 'uppercase' }}>
                        {isEn ? 'Cover Image' : 'Kapak Görseli'}
                      </label>
                      <MediaUploadBox 
                        currentValue={contentCoverImage}
                        onUpload={setContentCoverImage}
                        onRemove={() => setContentCoverImage('')}
                        isEn={isEn}
                      />
                    </div>
                  )}

                  {/* --- TYPE-SPECIFIC EDITOR WORKSPACES --- */}

                  {/* 1. Dilekçe ve Doküman Örnekleri workspace fields */}
                  {cmsCategory === 'dilekce' && (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
                        {isEn ? 'Document Settings' : 'Şablon Doküman Detayları'}
                      </h3>
                      
                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Document Type' : 'Doküman Türü'}</label>
                          <CustomSelect
                            value={docType}
                            onChange={setDocType}
                            options={[
                              { value: 'Dilekçe', label: isEn ? 'Petition' : 'Dilekçe' },
                              { value: 'Sözleşme', label: isEn ? 'Agreement' : 'Sözleşme' },
                              { value: 'İhtarname', label: isEn ? 'Notification' : 'İhtarname' },
                              { value: 'Başvuru', label: isEn ? 'Application' : 'Başvuru' },
                              { value: 'Talep', label: isEn ? 'Request' : 'Talep' },
                              { value: 'Tutanak', label: isEn ? 'Minutes' : 'Tutanak' },
                              { value: 'Diğer', label: isEn ? 'Other' : 'Diğer' }
                            ]}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Law Field' : 'İlgili Hukuk Alanı'}</label>
                          <CustomSelect
                            value={docLawArea}
                            onChange={setDocLawArea}
                            options={[
                              { value: 'Aile Hukuku', label: isEn ? 'Family Law' : 'Aile Hukuku' },
                              { value: 'Ceza Hukuku', label: isEn ? 'Criminal Law' : 'Ceza Hukuku' },
                              { value: 'İcra Hukuku', label: isEn ? 'Execution Law' : 'İcra Hukuku' },
                              { value: 'Miras Hukuku', label: isEn ? 'Inheritance Law' : 'Miras Hukuku' },
                              { value: 'İş Hukuku', label: isEn ? 'Labor Law' : 'İş Hukuku' },
                              { value: 'Ticaret Hukuku', label: isEn ? 'Commercial Law' : 'Ticaret Hukuku' },
                              { value: 'Bilişim Hukuku', label: isEn ? 'IT Law' : 'Bilişim Hukuku' },
                              { value: 'Sözleşmeler Hukuku', label: isEn ? 'Contracts Law' : 'Sözleşmeler Hukuku' }
                            ]}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Template File Upload (PDF/Word/UDF)' : 'Şablon Dosya Yükle (PDF, Word, UDF)'}</label>
                        <MediaUploadBox 
                          currentValue={docFileUrl}
                          onUpload={setDocFileUrl}
                          onRemove={() => setDocFileUrl('')}
                          allowedTypes=".pdf,.doc,.docx,.udf"
                          isEn={isEn}
                        />
                      </div>

                      <CustomCheckbox
                        checked={docDownloadable}
                        onChange={setDocDownloadable}
                        label={isEn ? 'Enable file downloading for users' : 'Dosya ziyaretçiler tarafından indirilebilsin'}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Disclaimer Warning' : 'Kullanım Uyarısı'}</label>
                        <input type="text" value={docWarningText} onChange={(e) => setDocWarningText(e.target.value)} className="glass-input" style={{ width: '100%', fontSize: '12px' }} />
                      </div>
                    </div>
                  )}

                  {/* 2. Makaleler workspace fields */}
                  {cmsCategory === 'makale' && (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
                        {isEn ? 'Academic Details' : 'Akademik Makale Detayları'}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Abstract Summary' : 'Makale Kısa Özeti (Abstract)'}</label>
                        <textarea rows={2} value={articleAbstract} onChange={(e) => setArticleAbstract(e.target.value)} className="glass-input" style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }} />
                      </div>

                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Related Codes / Acts' : 'İlgili Kanun Maddeleri'}</label>
                          <input type="text" value={articleLawArticles} onChange={(e) => setArticleLawArticles(e.target.value)} className="glass-input" placeholder="Örn: TMK m. 166, TBK m. 19" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Related Precedent References' : 'İlgili İçtihat Numaraları'}</label>
                          <input type="text" value={articlePrecedents} onChange={(e) => setArticlePrecedents(e.target.value)} className="glass-input" placeholder="Örn: YHGK 2024/99 E." style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Bibliography' : 'Kaynakça / Referanslar'}</label>
                        <textarea rows={2} value={articleBibliography} onChange={(e) => setArticleBibliography(e.target.value)} className="glass-input" placeholder="Örn: Akarsu, E. (2025). Yapay Zeka Hukuku..." style={{ width: '100%', resize: 'none', fontFamily: 'inherit' }} />
                      </div>

                      <div className="admin-grid-2">
                        <CustomCheckbox
                          checked={articleAutoTOC}
                          onChange={setArticleAutoTOC}
                          label={isEn ? 'Auto Table of Contents' : 'Otomatik İçindekiler Paneli'}
                        />
                        <CustomCheckbox
                          checked={articleScrollProgress}
                          onChange={setArticleScrollProgress}
                          label={isEn ? 'Show Reading Progress' : 'Okuma İlerleme Çubuğu'}
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. Yargı Kararları (Emsal Kararlar) fields */}
                  {cmsCategory === 'degerlendirme' && cmsSubCategory === 'karar' && (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
                        {isEn ? 'Judicial Ruling Settings' : 'Mahkeme ve Karar Künyesi'}
                      </h3>
                      
                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Court Name' : 'Mahkeme / Daire Adı'}</label>
                          <input type="text" value={decCourtName} onChange={(e) => setDecCourtName(e.target.value)} className="glass-input" placeholder="Örn: Yargıtay 9. Hukuk Dairesi" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Decision Date' : 'Karar Tarihi'}</label>
                          <input type="date" value={decDate} onChange={(e) => setDecDate(e.target.value)} className="glass-input" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Merit (Esas) No' : 'Esas Numarası'}</label>
                          <input type="text" value={decEsas} onChange={(e) => setDecEsas(e.target.value)} className="glass-input" placeholder="Örn: 2025/110 E." style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Ruling (Karar) No' : 'Karar Numarası'}</label>
                          <input type="text" value={decKarar} onChange={(e) => setDecKarar(e.target.value)} className="glass-input" placeholder="Örn: 2026/450 K." style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Law Field' : 'İlgili Hukuk Alanı'}</label>
                          <input type="text" value={decLawArea} onChange={(e) => setDecLawArea(e.target.value)} className="glass-input" placeholder="Örn: İş Hukuku" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Decision Type' : 'Karar Türü'}</label>
                          <input type="text" value={decType} onChange={(e) => setDecType(e.target.value)} className="glass-input" placeholder="Örn: Yargıtay İçtihadı Birleştirme" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Concepts / Keywords' : 'Anahtar Kavramlar / Önemli Terimler'}</label>
                        <input type="text" value={decConcepts} onChange={(e) => setDecConcepts(e.target.value)} className="glass-input" placeholder="fazla mesai, giydirilmis ucret, mobbing" style={{ width: '100%' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Ruling Outcome' : 'Karar Sonucu'}</label>
                        <input type="text" value={decOutcome} onChange={(e) => setDecOutcome(e.target.value)} className="glass-input" placeholder="Örn: Hükmün işçi lehine bozulmasına" style={{ width: '100%' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Full Decision Text' : 'Gerekçeli Tam Karar Metni'}</label>
                        <textarea rows={6} value={contentBody} onChange={(e) => setContentBody(e.target.value)} className="glass-input" style={{ width: '100%', fontFamily: 'monospace' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'My Attorney Assessment' : 'Avukat Hukuki Değerlendirmesi ve Yorumum'}</label>
                        <RichTextEditor value={decAssessment} onChange={setDecAssessment} isEn={isEn} />
                      </div>
                    </div>
                  )}

                  {/* 4. Hukuki Hesaplama Araçları fields */}
                  {cmsCategory === 'hesaplama' && (
                    <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(240,218,197,0.1)', display: 'flex', flexDirection: 'column', gap: '14px', background: 'rgba(12,16,30,0.3)' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#F0DAC5', fontFamily: 'Outfit' }}>
                        {isEn ? 'Calculator Settings' : 'Hesaplama Form Ayarları'}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Calculation Engine' : 'Hesaplama Motoru Şablonu'}</label>
                        <CustomSelect
                          value={calcType}
                          onChange={setCalcType}
                          options={[
                            { value: 'Kıdem Tazminatı Hesaplama', label: isEn ? 'Severance Pay' : 'Kıdem Tazminatı Hesaplama' },
                            { value: 'İhbar Tazminatı Hesaplama', label: isEn ? 'Notice Indemnity' : 'İhbar Tazminatı Hesaplama' },
                            { value: 'Yasal Faiz Hesaplama', label: isEn ? 'Legal Interest rate' : 'Yasal Faiz Hesaplama' },
                            { value: 'Kira Artış Oranı Hesaplama', label: isEn ? 'Rental Increase Index' : 'Kira Artış Oranı Hesaplama' },
                            { value: 'Vekâlet Ücreti Hesaplama', label: isEn ? 'Attorney Fee Index' : 'Vekâlet Ücreti Hesaplama' }
                          ]}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Warning Notice text' : 'Yasal Uyarı / Bilgilendirme Metni'}</label>
                        <input type="text" value={calcWarning} onChange={(e) => setCalcWarning(e.target.value)} className="glass-input" style={{ width: '100%' }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: '#A0AEC0' }}>{isEn ? 'Order placement index:' : 'Sıralama Önceliği:'}</span>
                        <input type="number" min={1} value={calcOrder} onChange={(e) => setCalcOrder(Number(e.target.value))} className="glass-input" style={{ width: '80px', height: '32px' }} />
                      </div>
                    </div>
                  )}

                  {/* Editor rich body text for standard categories */}
                  {cmsCategory !== 'hesaplama' && (cmsCategory !== 'degerlendirme' || cmsSubCategory !== 'karar') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#A0AEC0', textTransform: 'uppercase' }}>
                        {isEn ? 'Body Content' : 'Metin / Yazı İçeriği'}
                      </label>
                      <RichTextEditor 
                        value={contentBody}
                        onChange={setContentBody}
                        isEn={isEn}
                      />
                    </div>
                  )}

                </div>

              </ContentEditorLayout>
            )}

            {/* Preview Viewport Modal Overlay */}
            <ContentPreviewModal
              isOpen={isPreviewOpen}
              onClose={() => setIsPreviewOpen(false)}
              title={contentTitle}
              excerpt={contentExcerpt}
              content={contentBody}
              coverImage={contentCoverImage}
              tags={contentTags}
              category={
                cmsCategory === 'makale' ? 'Makaleler' :
                cmsCategory === 'dilekce' ? 'Dilekçeler' :
                cmsCategory === 'not' ? 'Meslekten Notlar' :
                cmsSubCategory === 'karar' ? 'Emsal Kararlar' : 'Kanun Analizleri'
              }
              isEn={isEn}
            />

          </div>
        )}



        {/* Clients management */}
        {activeTab === 'clients' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                  {isEn ? 'Client Management' : 'Müvekkil Yönetimi'}
                </h2>
                <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                  {isEn ? 'Review registered clients and add new clients.' : 'Kayıtlı müvekkilleri inceleyin ve yeni müvekkil ekleyin.'}
                </p>
              </div>
              <button onClick={() => setShowClientModal(true)} className="btn-primary" style={{ background: '#F0DAC5', color: '#1C2340' }}>
                <Plus size={16} /> {isEn ? 'Add New Client' : 'Yeni Müvekkil Ekle'}
              </button>
            </div>

            {/* List */}
            <div style={{ background: '#0C101E', borderRadius: '12px', padding: '24px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.1)', color: '#A0AEC0', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>{isEn ? 'Client Name' : 'Müvekkil Adı'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'ID No / Occupation' : 'T.C. Kimlik / Meslek'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Contact' : 'İletişim'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Registration Date' : 'Kayıt Tarihi'}</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.05)' }}>
                      <td style={{ padding: '12px' }}><strong>{c.fullName}</strong></td>
                      <td style={{ padding: '12px' }}>
                        <div>{c.tcIdentityNumber}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{c.occupation}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{c.phone}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{c.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{c.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Client modal */}
            {showClientModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                <div style={{ background: '#0C101E', borderRadius: '16px', padding: '30px', width: '90%', maxWidth: '500px', margin: '20px', border: '1px solid rgba(240, 218, 197, 0.15)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#F0DAC5' }}>
                    {isEn ? 'Add New Client' : 'Yeni Müvekkil Ekle'}
                  </h3>
                  <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <input type="text" placeholder={isEn ? "Name Surname" : "Ad Soyad"} value={newClientName} onChange={(e) => setNewClientName(e.target.value)} className="glass-input" style={{ background: '#121727' }} required />
                    <input type="text" placeholder={isEn ? "ID Card Number" : "TC Kimlik No"} value={newClientTc} onChange={(e) => setNewClientTc(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    <input type="text" placeholder={isEn ? "Phone" : "Telefon"} value={newClientPhone} onChange={(e) => setNewClientPhone(e.target.value)} className="glass-input" style={{ background: '#121727' }} required />
                    <input type="email" placeholder={isEn ? "Email" : "E-posta"} value={newClientEmail} onChange={(e) => setNewClientEmail(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    <input type="text" placeholder={isEn ? "Occupation" : "Meslek"} value={newClientOcc} onChange={(e) => setNewClientOcc(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    <textarea rows={3} placeholder={isEn ? "Address" : "Adres"} value={newClientAddress} onChange={(e) => setNewClientAddress(e.target.value)} className="glass-input" style={{ background: '#121727', fontFamily: 'inherit' }} />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="button" onClick={() => setShowClientModal(false)} className="btn-secondary" style={{ color: '#FFFFFF' }}>{isEn ? 'Close' : 'Kapat'}</button>
                      <button type="submit" className="btn-primary" style={{ background: '#F0DAC5', color: '#1C2340' }}>{isEn ? 'Save' : 'Kaydet'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Case Files management */}
        {activeTab === 'cases' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                  {isEn ? 'Case Files' : 'Dava Dosyaları'}
                </h2>
                <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                  {isEn ? 'Track your case files on civil, criminal and legal aid bases.' : 'Hukuk, Ceza ve CMK bazında dava dosyalarınızı takip edin.'}
                </p>
              </div>
              <button onClick={() => setShowCaseModal(true)} className="btn-primary" style={{ background: '#F0DAC5', color: '#1C2340' }}>
                <Plus size={16} /> {isEn ? 'Add New Case' : 'Yeni Dava Ekle'}
              </button>
            </div>

            {/* List */}
            <div style={{ background: '#0C101E', borderRadius: '12px', padding: '24px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.1)', color: '#A0AEC0', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>{isEn ? 'Case / No' : 'Dosya / No'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Client / Opposing Party' : 'Müvekkil / Karşı Taraf'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Court' : 'Mahkeme'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Type / Stage' : 'Tip / Aşama'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Status' : 'Durum'}</th>
                  </tr>
                </thead>
                <tbody>
                  {caseFiles.map((cf) => (
                    <tr key={cf.id} style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.05)' }}>
                      <td style={{ padding: '12px' }}>
                        <div><strong>{cf.title}</strong></div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{cf.caseNumber}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{isEn ? 'Client:' : 'Müvekkil:'} {cf.clientName}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{isEn ? 'Opposing Party:' : 'Karşı Taraf:'} {cf.opposingParty}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{cf.courtName}</td>
                      <td style={{ padding: '12px' }}>
                        <div>{cf.caseType === 'HUKUK' && isEn ? 'CIVIL' : cf.caseType === 'CEZA' && isEn ? 'CRIMINAL' : cf.caseType}</div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{cf.stage}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                         <CustomSelect
                           value={cf.status}
                           onChange={(val) => updateCaseStatus(cf.id, val as any)}
                           options={[
                             { value: 'Yapılacak', label: isEn ? 'To Do' : 'Yapılacak' },
                             { value: 'Devam Ediyor', label: isEn ? 'In Progress' : 'Devam Ediyor' },
                             { value: 'Tamamlandı', label: isEn ? 'Completed' : 'Tamamlandı' },
                             { value: 'Ertelendi', label: isEn ? 'Postponed' : 'Ertelendi' }
                           ]}
                           style={{ width: '130px' }}
                         />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>

            {/* Case modal */}
            {showCaseModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                <div style={{ background: '#0C101E', borderRadius: '16px', padding: '30px', width: '90%', maxWidth: '500px', margin: '20px', border: '1px solid rgba(240, 218, 197, 0.15)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: '#F0DAC5' }}>
                    {isEn ? 'Add New Case' : 'Yeni Dava Ekle'}
                  </h3>
                  <form onSubmit={handleAddCase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Client *' : 'Müvekkil *'}</label>
                      <CustomSelect
                        value={newCaseClient}
                        onChange={setNewCaseClient}
                        options={clients.map(c => ({ value: c.id, label: c.fullName }))}
                        placeholder={isEn ? 'Select Client *' : 'Müvekkil Seçin *'}
                      />
                    </div>

                    <input type="text" placeholder={isEn ? "Case Title" : "Dava Başlığı"} value={newCaseTitle} onChange={(e) => setNewCaseTitle(e.target.value)} className="glass-input" style={{ background: '#121727' }} required />
                    <input type="text" placeholder={isEn ? "Merit No (e.g. 2026/45 Merit)" : "Esas No (Örn: 2026/45 Esas)"} value={newCaseNumber} onChange={(e) => setNewCaseNumber(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    <input type="text" placeholder={isEn ? "Court (e.g. Istanbul 2nd Labor Court)" : "Mahkeme (Örn: İstanbul 2. İş Mahkemesi)"} value={newCaseCourt} onChange={(e) => setNewCaseCourt(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    <input type="text" placeholder={isEn ? "Opposing Party" : "Karşı Taraf"} value={newCaseOpposing} onChange={(e) => setNewCaseOpposing(e.target.value)} className="glass-input" style={{ background: '#121727' }} />
                    
                    <div className="form-grid-2" style={{ gap: '10px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0', marginBottom: '4px' }}>{isEn ? 'Case Type' : 'Dava Tipi'}</label>
                        <CustomSelect
                          value={newCaseType}
                          onChange={(val) => setNewCaseType(val as any)}
                          options={[
                            { value: 'HUKUK', label: isEn ? 'Civil' : 'Hukuk' },
                            { value: 'CEZA', label: isEn ? 'Criminal' : 'Ceza' },
                            { value: 'CMK', label: isEn ? 'Legal Aid (CMK)' : 'CMK' }
                          ]}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Stage' : 'Aşama'}</label>
                        <input type="text" placeholder={isEn ? "Stage (e.g. Appellate)" : "Aşama (Örn: İstinaf)"} value={newCaseStage} onChange={(e) => setNewCaseStage(e.target.value)} className="glass-input" style={{ background: '#121727', height: '38px', marginTop: '4px' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button type="button" onClick={() => setShowCaseModal(false)} className="btn-secondary" style={{ color: '#FFFFFF' }}>{isEn ? 'Close' : 'Kapat'}</button>
                      <button type="submit" className="btn-primary" style={{ background: '#F0DAC5', color: '#1C2340' }}>{isEn ? 'Save' : 'Kaydet'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Appointments list */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {isEn ? 'Appointment & Payment Tracking' : 'Randevu & Ödeme Takibi'}
              </h2>
              <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                {isEn ? 'Approve client appointment requests and view payment transactions.' : 'Müvekkil randevu taleplerini onaylayın ve ödeme işlemlerini görüntüleyin.'}
              </p>
            </div>

            {/* List */}
            <div style={{ background: '#0C101E', borderRadius: '12px', padding: '24px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
            <div className="table-responsive-wrapper">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.1)', color: '#A0AEC0', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>{isEn ? 'Client / Contact' : 'Müvekkil / İletişim'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Date / Time' : 'Tarih / Saat'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Meeting Type' : 'Görüşme Türü'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Amount / Payment' : 'Tutar / Ödeme'}</th>
                    <th style={{ padding: '12px' }}>{isEn ? 'Action' : 'İşlem'}</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid rgba(240, 218, 197, 0.05)' }}>
                      <td style={{ padding: '12px' }}>
                        <div><strong>{app.clientName}</strong></div>
                        <div style={{ fontSize: '11px', color: '#718096' }}>{app.phone} • {app.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{app.appointmentDate} {app.appointmentTime}</td>
                      <td style={{ padding: '12px' }}>
                        {app.consultationType === 'Yüz Yüze' && isEn ? 'Face to Face' : 
                         app.consultationType === 'Telefon' && isEn ? 'Phone Call' : app.consultationType}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{app.paymentAmount} TL</div>
                        <div style={{ fontSize: '10px', color: app.paymentStatus === 'Tamamlandı' ? '#10B981' : '#F59E0B' }}>
                          {app.paymentStatus === 'Tamamlandı' && isEn ? 'Completed' : 
                           app.paymentStatus === 'Bekliyor' && isEn ? 'Pending' : app.paymentStatus}
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {app.status === 'Bekliyor' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                               onClick={() => updateAppointmentStatus(app.id, 'Onaylandı')}
                               style={{ background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Check size={12} /> {isEn ? 'Approve' : 'Onayla'}
                            </button>
                            <button
                               onClick={() => updateAppointmentStatus(app.id, 'Reddedildi')}
                               style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <X size={12} /> {isEn ? 'Reject' : 'Reddet'}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: 600, color: app.status === 'Onaylandı' ? '#10B981' : '#718096' }}>
                            {app.status === 'Onaylandı' && isEn ? 'Approved' : 
                             app.status === 'Reddedildi' && isEn ? 'Rejected' : app.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* Task Board Kanban view */}
        {activeTab === 'kanban' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {isEn ? 'Task Management (Kanban)' : 'Görev Yönetimi (Kanban)'}
              </h2>
              <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                {isEn ? 'Tracking of case files and daily office tasks' : 'Dava süreçleri ve günlük ofis işlerinin takibi'}
              </p>
            </div>

            {/* Quick add */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#0C101E', padding: '20px', borderRadius: '12px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
              <input type="text" placeholder={isEn ? "Task Title" : "Görev Başlığı"} value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="glass-input" style={{ flex: 1, minWidth: '200px', background: '#121727' }} required />
              <CustomSelect
                value={newTaskPriority}
                onChange={(val) => setNewTaskPriority(val as any)}
                options={[
                  { value: 'Düşük', label: isEn ? 'Low' : 'Düşük' },
                  { value: 'Orta', label: isEn ? 'Medium' : 'Orta' },
                  { value: 'Yüksek', label: isEn ? 'High' : 'Yüksek' },
                  { value: 'Acil', label: isEn ? 'Urgent' : 'Acil' }
                ]}
                style={{ width: '120px' }}
              />
              <input type="date" value={newTaskDue} onChange={(e) => setNewTaskDue(e.target.value)} className="glass-input" style={{ width: '150px', background: '#121727' }} />
              <button type="submit" className="btn-primary" style={{ background: '#F0DAC5', color: '#1C2340', border: 'none' }}>
                <Plus size={16} /> {isEn ? 'Add' : 'Ekle'}
              </button>
            </form>

            {/* Kanban Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '10px' }}>
              
              {/* ToDo */}
              <div style={{ background: '#0C101E', borderRadius: '12px', padding: '20px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#F59E0B', marginBottom: '16px' }}>
                  {isEn ? 'To Do' : 'Yapılacak'} ({tasks.filter(t => t.status === 'Yapılacak').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.filter(t => t.status === 'Yapılacak').map(t => (
                    <div key={t.id} style={{ background: '#121727', padding: '14px', borderRadius: '8px', border: '1px solid rgba(240,218,197,0.05)' }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 600 }}>{t.title}</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096', marginTop: '10px' }}>
                        <span>{isEn ? 'Priority:' : 'Öncelik:'} {
                          t.priority === 'Düşük' && isEn ? 'Low' : 
                          t.priority === 'Orta' && isEn ? 'Medium' : 
                          t.priority === 'Yüksek' && isEn ? 'High' : 
                          t.priority === 'Acil' && isEn ? 'Urgent' : t.priority
                        }</span>
                        <span onClick={() => updateTaskStatus(t.id, 'Devam Ediyor')} style={{ color: '#F0DAC5', cursor: 'pointer' }}>
                          {isEn ? 'Start →' : 'Başlat →'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In Progress */}
              <div style={{ background: '#0C101E', borderRadius: '12px', padding: '20px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#3B82F6', marginBottom: '16px' }}>
                  {isEn ? 'In Progress' : 'Devam Ediyor'} ({tasks.filter(t => t.status === 'Devam Ediyor').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.filter(t => t.status === 'Devam Ediyor').map(t => (
                    <div key={t.id} style={{ background: '#121727', padding: '14px', borderRadius: '8px', border: '1px solid rgba(240,218,197,0.05)' }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 600 }}>{t.title}</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096', marginTop: '10px' }}>
                        <span>{isEn ? 'Due:' : 'Vade:'} {t.dueDate}</span>
                        <span onClick={() => updateTaskStatus(t.id, 'Tamamlandı')} style={{ color: '#10B981', cursor: 'pointer' }}>
                          {isEn ? 'Complete ✓' : 'Tamamla ✓'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done */}
              <div style={{ background: '#0C101E', borderRadius: '12px', padding: '20px', border: '1px solid rgba(240, 218, 197, 0.08)' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#10B981', marginBottom: '16px' }}>
                  {isEn ? 'Completed' : 'Tamamlandı'} ({tasks.filter(t => t.status === 'Tamamlandı').length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tasks.filter(t => t.status === 'Tamamlandı').map(t => (
                    <div key={t.id} style={{ background: '#121727', padding: '14px', borderRadius: '8px', border: '1px solid rgba(240,218,197,0.05)', opacity: 0.7 }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 600, textDecoration: 'line-through' }}>{t.title}</h5>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#718096', marginTop: '10px' }}>
                        <span>{isEn ? 'Completed ✓' : 'Tamamlandı ✓'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* AI Chatbot Settings */}
        {activeTab === 'chatbot' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {isEn ? 'AI Chatbot Settings' : 'AI Chatbot Ayarları'}
              </h2>
              <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                {isEn ? 'Configure Hugging Face integration and system prompt.' : 'Hugging Face entegrasyonu ve sistem promptunu yapılandırın.'}
              </p>
            </div>

            <div className="glass-card" style={{ background: '#0C101E', border: '1px solid rgba(240,218,197,0.08)', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="admin-grid-2" style={{ gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{isEn ? 'Active / Passive Status' : 'Aktif / Pasif Durumu'}</label>
                  <CustomSelect
                    value={chatbotSettings.isActive ? 'true' : 'false'}
                    onChange={(val) => updateChatbotSettings({ isActive: val === 'true' })}
                    options={[
                      { value: 'true', label: isEn ? 'Active' : 'Aktif' },
                      { value: 'false', label: isEn ? 'Passive' : 'Pasif' }
                    ]}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'AI Model to Use' : 'Kullanılacak Yapay Zekâ Modeli'}</label>
                  <input
                    type="text"
                    value={chatbotSettings.modelName}
                    onChange={(e) => updateChatbotSettings({ modelName: e.target.value })}
                    className="glass-input"
                    style={{ background: '#121727' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Welcome Message' : 'Karşılama Mesajı'}</label>
                <textarea
                  rows={3}
                  value={chatbotSettings.welcomeMessage}
                  onChange={(e) => updateChatbotSettings({ welcomeMessage: e.target.value })}
                  className="glass-input"
                  style={{ background: '#121727', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'System Prompt (System Instruction)' : 'Sistem Promptu (System Instruction)'}</label>
                <textarea
                  rows={5}
                  value={chatbotSettings.systemPrompt}
                  onChange={(e) => updateChatbotSettings({ systemPrompt: e.target.value })}
                  className="glass-input"
                  style={{ background: '#121727', fontFamily: 'inherit' }}
                />
              </div>

              <button
                onClick={() => showToast(isEn ? 'AI settings successfully updated.' : 'Yapay zekâ ayarları başarıyla güncellendi.', 'success')}
                className="btn-primary"
                style={{ background: '#F0DAC5', color: '#1C2340', border: 'none', alignSelf: 'flex-start' }}
              >
                {isEn ? 'Save Settings' : 'Ayarları Kaydet'}
              </button>

            </div>
          </div>
        )}

        {/* Rest of items fallback */}
        {['calendar', 'stats'].includes(activeTab) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {activeTab === 'calendar' && (isEn ? 'Hearing & Task Calendar' : 'Duruşma ve İş Takvimi')}
                {activeTab === 'stats' && (isEn ? 'Platform Statistics' : 'Platform İstatistikleri')}
              </h2>
              <p style={{ fontSize: '13px', color: '#A0AEC0' }}>
                {isEn ? 'The interface components of this module are designed and ready for integration.' : 'Bu modülün arayüz bileşenleri entegrasyona hazır olarak tasarlanmıştır.'}
              </p>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '40px',
                textAlign: 'center',
                border: '1px solid rgba(240, 218, 197, 0.08)',
                background: '#0C101E',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <Info size={40} style={{ color: '#F0DAC5' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 600 }}>
                {isEn ? 'Module Active & Ready for Connection' : 'Modül Aktif ve Bağlantıya Hazır'}
              </h4>
              <p style={{ fontSize: '13px', color: '#A0AEC0', maxWidth: '450px' }}>
                {activeTab === 'calendar' && (
                  isEn 
                    ? 'Data models (Hearing, Appointment) required for Google Calendar API and Outlook calendar integration are ready.'
                    : 'Google Calendar API ve Outlook takvim entegrasyonu için gerekli veri modelleri (Hearing, Appointment) hazır durumdadır.'
                )}
                {activeTab === 'stats' && (
                  isEn 
                    ? 'Visitor counters, most clicked WhatsApp button reports, and payment chart database schema are defined.'
                    : 'Ziyaretçi sayaçları, en çok tıklanan WhatsApp buton raporları ve ödeme grafik veritabanı şeması tanımlanmıştır.'
                )}
              </p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 14-TAB SITE SETTINGS HUB */}
        {/* ============================================================ */}
        {activeTab === 'settings' && editedSettings && (() => {
          const hasUnsavedChanges = (subTab: string) => {
            const groupKey = `${subTab}_settings`;
            if (!editedSettings || !siteSettings) return false;
            return JSON.stringify(siteSettings[groupKey as keyof typeof siteSettings]) !== JSON.stringify(editedSettings[groupKey as keyof typeof siteSettings]);
          };

          const handleSettingChange = (group: string, key: string, value: any) => {
            setEditedSettings((prev: any) => {
              if (!prev) return prev;
              return {
                ...prev,
                [group]: {
                  ...prev[group],
                  [key]: value
                }
              };
            });
          };

          const handleResetGroup = async () => {
            const groupKey = `${settingsSubTab}_settings` as keyof SiteSettings;
            const success = await resetSiteSettings(groupKey);
            if (success) {
              showToast(isEn ? 'Category reset to defaults.' : 'Kategori varsayılan ayarlara sıfırlandı.', 'success');
            } else {
              showToast(isEn ? 'Failed to reset settings.' : 'Ayarlar sıfırlanırken hata oluştu.', 'error');
            }
          };

          const settingsCategories = [
            { id: 'general', label: isEn ? 'General Settings' : 'Genel Site Ayarları' },
            { id: 'contact', label: isEn ? 'Contact Info' : 'İletişim Bilgileri' },
            { id: 'homepage', label: isEn ? 'Homepage Settings' : 'Ana Sayfa Ayarları' },
            { id: 'appointment', label: isEn ? 'Appointment Settings' : 'Online Randevu Ayarları' },
            { id: 'footer', label: isEn ? 'Footer Settings' : 'Footer Ayarları' },
            { id: 'ai', label: isEn ? 'Chatbot Settings' : 'Chatbot Ayarları' }
          ];

          const CustomToggle = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
            <div 
              onClick={() => onChange(!checked)}
              style={{
                width: '44px',
                height: '22px',
                borderRadius: '20px',
                background: checked ? '#50223C' : '#121727',
                border: '1px solid var(--border-color)',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                display: 'inline-block'
              }}
            >
              <div 
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#F0DAC5',
                  position: 'absolute',
                  top: '2px',
                  left: checked ? '24px' : '2px',
                  transition: 'left 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
              />
            </div>
          );

          const trDaysList = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

          const handleWorkingDayToggle = (day: string) => {
            const currentDays = editedSettings.appointment_settings.workingDays || [];
            let updatedDays;
            if (currentDays.includes(day)) {
              updatedDays = currentDays.filter((d: string) => d !== day);
            } else {
              updatedDays = [...currentDays, day];
            }
            handleSettingChange('appointment_settings', 'workingDays', updatedDays);
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '75dvh' }}>
              
              {/* Header Title with Subtitle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                    {isEn ? 'Site Settings Hub' : 'Site Ayarları Yönetim Merkezi'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#A0AEC0', marginTop: '4px' }}>
                    {isEn ? 'Manage core configuration details of the website.' : 'Web sitesinin temel yönetim parametrelerini düzenleyin.'}
                  </p>
                </div>
              </div>

              {/* Layout Wrapper: Left Sidebar tabs + Right Form */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '260px 1fr', 
                  gap: '30px', 
                  marginTop: '10px' 
                }}
                className="settings-grid-layout"
              >
                <style>{`
                  @media (max-width: 992px) {
                    .settings-grid-layout {
                      grid-template-columns: 1fr !important;
                      gap: 20px !important;
                    }
                    .settings-tab-sidebar {
                      display: none !important;
                    }
                    .settings-tab-mobile-selector {
                      display: block !important;
                    }
                  }
                  .settings-tab-mobile-selector {
                    display: none;
                  }
                `}</style>

                {/* Mobile Tab Selector dropdown */}
                <div className="settings-tab-mobile-selector">
                  <label style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', display: 'block', color: 'var(--text-secondary)' }}>
                    {isEn ? 'Select Settings Category' : 'Ayar Kategorisi Seçin'}
                  </label>
                  <select
                    value={settingsSubTab}
                    onChange={(e) => setSettingsSubTab(e.target.value as any)}
                    className="glass-input"
                    style={{ width: '100%', background: '#0C101E', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px' }}
                  >
                    {settingsCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* Desktop Left Tab Sidebar */}
                <div 
                  className="settings-tab-sidebar"
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px', 
                    borderRight: '1px solid rgba(240, 218, 197, 0.08)',
                    paddingRight: '20px'
                  }}
                >
                  {settingsCategories.map(cat => {
                    const isActive = settingsSubTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSettingsSubTab(cat.id as any)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: isActive ? 600 : 500,
                          border: 'none',
                          background: isActive ? 'rgba(80, 34, 60, 0.25)' : 'transparent',
                          color: isActive ? '#F0DAC5' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        {cat.id === 'general' && <Globe size={15} />}
                        {cat.id === 'contact' && <Phone size={15} />}
                        {cat.id === 'homepage' && <Home size={15} />}
                        {cat.id === 'appointment' && <Calendar size={15} />}
                        {cat.id === 'footer' && <Menu size={15} />}
                        {cat.id === 'ai' && <Sparkles size={15} />}
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Right Settings Detail Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Category Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(240, 218, 197, 0.08)', paddingBottom: '15px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                        {settingsCategories.find(c => c.id === settingsSubTab)?.label}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {settingsSubTab === 'general' && (isEn ? 'Configure logo paths, browser titles, meta description, languages and default theme.' : 'Site adı, başlığı, açıklama, favicon, varsayılan dil ve tema ayarları.')}
                        {settingsSubTab === 'contact' && (isEn ? 'Configure office addresses, phone numbers, WhatsApp lines and social handles.' : 'Telefon, e-posta, adres, WhatsApp numarası ve sosyal medya bağlantıları.')}
                        {settingsSubTab === 'homepage' && (isEn ? 'Customize Hero section contents, image slides and content count limits.' : 'Giriş ekranı (Hero) başlığı, açıklaması, slayt görselleri ve liste limitleri.')}
                        {settingsSubTab === 'appointment' && (isEn ? 'Configure working days, operational hours, slot durations and session pricing.' : 'Haftalık çalışma günleri, randevu saatleri, görüşme süreleri ve ücretleri.')}
                        {settingsSubTab === 'footer' && (isEn ? 'Configure brand name displays and footer copyright legal notes.' : 'Footer marka adı, telif hakkı / aydınlatma bildirim metinleri.')}
                        {settingsSubTab === 'ai' && (isEn ? 'Toggle chatbot assistant visibility, welcome messages and disclaimers.' : 'Chatbot asistanının çalışma durumu, karşılama ve yasal uyarı metinleri.')}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetGroup}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                    >
                      {isEn ? 'Reset to Defaults' : 'Varsayılanlara Sıfırla'}
                    </button>
                  </div>

                  {/* FORM FIELDS PER TABS */}
                  
                  {/* 1. GENERAL SETTINGS */}
                  {settingsSubTab === 'general' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Site Name' : 'Site Adı'}</label>
                          <input
                            type="text"
                            value={editedSettings.general_settings.siteName || ''}
                            onChange={(e) => handleSettingChange('general_settings', 'siteName', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Browser Tab Title' : 'Tarayıcı Sekme Başlığı'}</label>
                          <input
                            type="text"
                            value={editedSettings.general_settings.browserTitle || ''}
                            onChange={(e) => handleSettingChange('general_settings', 'browserTitle', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Meta Description (SEO)' : 'Meta Açıklaması (SEO)'}</label>
                        <textarea
                          rows={2}
                          value={editedSettings.general_settings.metaDescription || ''}
                          onChange={(e) => handleSettingChange('general_settings', 'metaDescription', e.target.value)}
                          className="glass-input"
                          style={{ fontFamily: 'inherit' }}
                        />
                      </div>

                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Site Logo Path' : 'Site Logo Yolu (Logo URL)'}</label>
                          <input
                            type="text"
                            value={editedSettings.general_settings.logoUrl || ''}
                            onChange={(e) => handleSettingChange('general_settings', 'logoUrl', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'EA Monogram Logo' : 'EA Monogram Logo Yolu'}</label>
                          <input
                            type="text"
                            value={editedSettings.general_settings.monogramUrl || ''}
                            onChange={(e) => handleSettingChange('general_settings', 'monogramUrl', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Favicon Icon Path' : 'Favicon Dosya Yolu'}</label>
                          <input
                            type="text"
                            value={editedSettings.general_settings.faviconUrl || ''}
                            onChange={(e) => handleSettingChange('general_settings', 'faviconUrl', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                      </div>

                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Default Language' : 'Varsayılan Dil'}</label>
                          <select
                            value={editedSettings.general_settings.defaultLanguage || 'tr'}
                            onChange={(e) => handleSettingChange('general_settings', 'defaultLanguage', e.target.value)}
                            className="glass-input"
                            style={{ background: '#121727' }}
                          >
                            <option value="tr">Türkçe</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Default Theme' : 'Varsayılan Tema'}</label>
                          <select
                            value={editedSettings.general_settings.defaultTheme || 'dark'}
                            onChange={(e) => handleSettingChange('general_settings', 'defaultTheme', e.target.value)}
                            className="glass-input"
                            style={{ background: '#121727' }}
                          >
                            <option value="dark">Dark Mode</option>
                            <option value="light">Light Mode</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. CONTACT INFO */}
                  {settingsSubTab === 'contact' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Phone' : 'Telefon Numarası'}</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.phone || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'phone', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Email' : 'E-posta Adresi'}</label>
                          <input
                            type="email"
                            value={editedSettings.contact_settings.email || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'email', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'WhatsApp Number' : 'WhatsApp Numarası'}</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.whatsappNumber || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'whatsappNumber', e.target.value)}
                            className="glass-input"
                            placeholder="Örn: 905551234567"
                          />
                        </div>
                      </div>

                      <div className="admin-grid-2">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Office Address' : 'Ofis Adresi'}</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.address || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'address', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Working Hours text' : 'Çalışma Saatleri Metni'}</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.workingHours || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'workingHours', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F0DAC5', borderBottom: '1px solid rgba(240, 218, 197, 0.05)', paddingBottom: '6px', marginTop: '10px' }}>{isEn ? 'Social Networks' : 'Sosyal Medya Bağlantıları'}</h4>
                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 600 }}>LinkedIn</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.linkedin || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'linkedin', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 600 }}>GitHub</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.github || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'github', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', fontWeight: 600 }}>Instagram</label>
                          <input
                            type="text"
                            value={editedSettings.contact_settings.instagram || ''}
                            onChange={(e) => handleSettingChange('contact_settings', 'instagram', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. HOMEPAGE SETTINGS */}
                  {settingsSubTab === 'homepage' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Hero Landing Title' : 'Hero Başlığı'}</label>
                        <input
                          type="text"
                          value={editedSettings.homepage_settings.heroTitle || ''}
                          onChange={(e) => handleSettingChange('homepage_settings', 'heroTitle', e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Hero Landing Description' : 'Hero Açıklaması'}</label>
                        <textarea
                          rows={3}
                          value={editedSettings.homepage_settings.heroDescription || ''}
                          onChange={(e) => handleSettingChange('homepage_settings', 'heroDescription', e.target.value)}
                          className="glass-input"
                          style={{ fontFamily: 'inherit' }}
                        />
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F0DAC5', borderBottom: '1px solid rgba(240, 218, 197, 0.05)', paddingBottom: '6px', marginTop: '10px' }}>{isEn ? 'Hero Slides Images' : 'Giriş Ekranı Slayt Görselleri'}</h4>
                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{isEn ? 'Görsel 1 (Hero Slayt 1)' : 'Giriş Görseli 1 (Hero Slayt 1)'}</label>
                          <input
                            type="text"
                            value={editedSettings.homepage_settings.heroImages?.[0] || ''}
                            onChange={(e) => {
                              const newImages = [...(editedSettings.homepage_settings.heroImages || [])];
                              newImages[0] = e.target.value;
                              handleSettingChange('homepage_settings', 'heroImages', newImages);
                            }}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{isEn ? 'Görsel 2 (Hero Slayt 2)' : 'Giriş Görseli 2 (Hero Slayt 2)'}</label>
                          <input
                            type="text"
                            value={editedSettings.homepage_settings.heroImages?.[1] || ''}
                            onChange={(e) => {
                              const newImages = [...(editedSettings.homepage_settings.heroImages || [])];
                              newImages[1] = e.target.value;
                              handleSettingChange('homepage_settings', 'heroImages', newImages);
                            }}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{isEn ? 'Görsel 3 (Hero Slayt 3)' : 'Giriş Görseli 3 (Hero Slayt 3)'}</label>
                          <input
                            type="text"
                            value={editedSettings.homepage_settings.heroImages?.[2] || ''}
                            onChange={(e) => {
                              const newImages = [...(editedSettings.homepage_settings.heroImages || [])];
                              newImages[2] = e.target.value;
                              handleSettingChange('homepage_settings', 'heroImages', newImages);
                            }}
                            className="glass-input"
                          />
                        </div>
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F0DAC5', borderBottom: '1px solid rgba(240, 218, 197, 0.05)', paddingBottom: '6px', marginTop: '10px' }}>{isEn ? 'Homepage Listing Limits' : 'Sayfa Limitleri & Görünürlük'}</h4>
                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Latest Blog Posts Limit' : 'Güncel Yazılar Kart Sayısı'}</label>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={editedSettings.homepage_settings.blogCount !== undefined ? editedSettings.homepage_settings.blogCount : 3}
                            onChange={(e) => handleSettingChange('homepage_settings', 'blogCount', parseInt(e.target.value) || 3)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Precedent Decisions Limit' : 'Emsal Kararlar Kart Sayısı'}</label>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={editedSettings.homepage_settings.decisionsCount !== undefined ? editedSettings.homepage_settings.decisionsCount : 3}
                            onChange={(e) => handleSettingChange('homepage_settings', 'decisionsCount', parseInt(e.target.value) || 3)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Practice Areas Visibility' : 'Faaliyet Alanları Görünürlük Ayarı'}</label>
                          <div style={{ marginTop: '8px' }}>
                            <CustomToggle 
                              checked={editedSettings.homepage_settings.practiceActive !== false}
                              onChange={(val) => handleSettingChange('homepage_settings', 'practiceActive', val)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. ONLINE APPOINTMENT SETTINGS */}
                  {settingsSubTab === 'appointment' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Working Days selection' : 'Haftalık Çalışma Günleri'}</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                          {trDaysList.map(day => {
                            const isChecked = (editedSettings.appointment_settings.workingDays || []).includes(day);
                            return (
                              <button
                                type="button"
                                key={day}
                                onClick={() => handleWorkingDayToggle(day)}
                                style={{
                                  padding: '8px 14px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  border: '1px solid var(--border-color)',
                                  background: isChecked ? 'rgba(80, 34, 60, 0.25)' : '#121727',
                                  color: isChecked ? '#F0DAC5' : 'var(--text-secondary)',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Shift Start Time' : 'Çalışma Başlangıç Saati'}</label>
                          <input
                            type="time"
                            value={editedSettings.appointment_settings.startTime || '09:00'}
                            onChange={(e) => handleSettingChange('appointment_settings', 'startTime', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Shift End Time' : 'Çalışma Bitiş Saati'}</label>
                          <input
                            type="time"
                            value={editedSettings.appointment_settings.endTime || '18:00'}
                            onChange={(e) => handleSettingChange('appointment_settings', 'endTime', e.target.value)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Slot Duration (min)' : 'Randevu Görüşme Süresi'}</label>
                          <select
                            value={editedSettings.appointment_settings.duration || 30}
                            onChange={(e) => handleSettingChange('appointment_settings', 'duration', parseInt(e.target.value) || 30)}
                            className="glass-input"
                            style={{ background: '#121727' }}
                          >
                            <option value={15}>15 dk</option>
                            <option value={30}>30 dk</option>
                            <option value={45}>45 dk</option>
                            <option value={60}>60 dk</option>
                          </select>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#F0DAC5', borderBottom: '1px solid rgba(240, 218, 197, 0.05)', paddingBottom: '6px', marginTop: '10px' }}>{isEn ? 'Consultation Fees (TL)' : 'Randevu Görüşme Ücretleri (TL)'}</h4>
                      <div className="admin-grid-3">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Online Video Call Fee' : 'Online Görüşme Ücreti'}</label>
                          <input
                            type="number"
                            value={editedSettings.appointment_settings.onlineFee !== undefined ? editedSettings.appointment_settings.onlineFee : 2500}
                            onChange={(e) => handleSettingChange('appointment_settings', 'onlineFee', parseInt(e.target.value) || 0)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Office Visit (Face-to-Face) Fee' : 'Yüz Yüze Görüşme Ücreti'}</label>
                          <input
                            type="number"
                            value={editedSettings.appointment_settings.faceToFaceFee !== undefined ? editedSettings.appointment_settings.faceToFaceFee : 3000}
                            onChange={(e) => handleSettingChange('appointment_settings', 'faceToFaceFee', parseInt(e.target.value) || 0)}
                            className="glass-input"
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Phone Consult Fee' : 'Telefon Görüşme Ücreti'}</label>
                          <input
                            type="number"
                            value={editedSettings.appointment_settings.phoneFee !== undefined ? editedSettings.appointment_settings.phoneFee : 1500}
                            onChange={(e) => handleSettingChange('appointment_settings', 'phoneFee', parseInt(e.target.value) || 0)}
                            className="glass-input"
                          />
                        </div>
                      </div>

                      <div className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(240, 218, 197, 0.02)' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 600, display: 'block' }}>{isEn ? 'Disable Past Hours Today' : 'Geçmiş Saatleri Pasif Yap'}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{isEn ? 'Locks slots for today that have already passed in clock.' : 'Bugünün içerisinde bulunulan saate göre geçmiş zaman dilimlerini rezerveye kapatır.'}</span>
                        </div>
                        <CustomToggle 
                          checked={editedSettings.appointment_settings.pastHoursDisabled !== false}
                          onChange={(val) => handleSettingChange('appointment_settings', 'pastHoursDisabled', val)}
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. FOOTER SETTINGS */}
                  {settingsSubTab === 'footer' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Footer Brand Name' : 'Footer Marka Adı'}</label>
                        <input
                          type="text"
                          value={editedSettings.footer_settings.brandName || ''}
                          onChange={(e) => handleSettingChange('footer_settings', 'brandName', e.target.value)}
                          className="glass-input"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Footer Copyright & Legal Disclaimer text' : 'Footer Alt Metni / Telif Bildirimi'}</label>
                        <textarea
                          rows={3}
                          value={editedSettings.footer_settings.copyrightText || ''}
                          onChange={(e) => handleSettingChange('footer_settings', 'copyrightText', e.target.value)}
                          className="glass-input"
                          style={{ fontFamily: 'inherit' }}
                        />
                      </div>
                      
                      <div className="glass-card" style={{ padding: '16px', background: 'rgba(240, 218, 197, 0.02)', border: '1px solid rgba(240, 218, 197, 0.06)' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0' }}>
                          <strong>{isEn ? 'Note:' : 'Not:'}</strong> {isEn ? 'Social Networks links and yasal links inside footer are dynamically derived from General/Contact Info configurations.' : 'Sosyal medya bağlantıları ile footer içerisindeki e-posta, telefon ve adres bilgileri "İletişim Bilgileri" sekmesinde yaptığınız değişiklikleri otomatik olarak yansıtır.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 6. CHATBOT SETTINGS */}
                  {settingsSubTab === 'ai' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 600, display: 'block' }}>{isEn ? 'Chatbot Assistant Status' : 'Yapay Zekâ Asistanı (Chatbot)'}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{isEn ? 'Toggle chatbot float monogram display on pages.' : 'Sitedeki yüzen yapay zekâ asistan butonunun ve penceresinin görünürlüğünü kontrol edin.'}</span>
                        </div>
                        <CustomToggle 
                          checked={editedSettings.ai_settings.isActive !== false}
                          onChange={(val) => handleSettingChange('ai_settings', 'isActive', val)}
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Welcome Greeting message' : 'Karşılama Mesajı'}</label>
                        <input
                          type="text"
                          value={editedSettings.ai_settings.welcomeMessage || ''}
                          onChange={(e) => handleSettingChange('ai_settings', 'welcomeMessage', e.target.value)}
                          className="glass-input"
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600 }}>{isEn ? 'Legal Disclaimer Notice text' : 'Yasal Uyarı Metni'}</label>
                        <textarea
                          rows={3}
                          value={editedSettings.ai_settings.disclaimerText || ''}
                          onChange={(e) => handleSettingChange('ai_settings', 'disclaimerText', e.target.value)}
                          className="glass-input"
                          style={{ fontFamily: 'inherit' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* STICKY SAVE BAR */}
                  {hasUnsavedChanges(settingsSubTab) && (
                    <div 
                      style={{
                        position: 'sticky',
                        bottom: '10px',
                        zIndex: 999,
                        background: 'rgba(28, 35, 64, 0.95)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid var(--color-burgundy)',
                        borderRadius: '12px',
                        padding: '16px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '15px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        animation: 'fadeIn 0.3s ease',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F0DAC5' }}>
                        <ShieldAlert size={18} style={{ color: '#F0DAC5' }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>
                          {isEn ? 'You have unsaved changes in this category!' : 'Bu kategoride kaydedilmemiş değişiklikleriniz var!'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            const groupKey = `${settingsSubTab}_settings`;
                            setEditedSettings((prev: any) => ({
                              ...prev,
                              [groupKey]: JSON.parse(JSON.stringify(siteSettings[groupKey as keyof typeof siteSettings]))
                            }));
                            showToast(isEn ? 'Changes discarded.' : 'Değişiklikler iptal edildi.', 'info');
                          }}
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '12px' }}
                        >
                          {isEn ? 'Discard' : 'İptal Et'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const groupKey = `${settingsSubTab}_settings` as keyof SiteSettings;
                            const groupData = editedSettings[groupKey];
                            const success = await updateSiteSettings(groupKey, groupData);
                            if (success) {
                              showToast(isEn ? 'Settings successfully saved.' : 'Ayarlar başarıyla kaydedildi.', 'success');
                            } else {
                              showToast(isEn ? 'An error occurred while saving.' : 'Kaydedilirken bir hata oluştu.', 'error');
                            }
                          }}
                          className="btn-primary"
                          style={{ 
                            padding: '8px 16px', 
                            fontSize: '12px', 
                            background: '#50223C', 
                            color: '#FFFFFF', 
                            border: '1px solid var(--color-burgundy)' 
                          }}
                        >
                          {isEn ? 'Save Category' : 'Kategoriyi Kaydet'}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })()}

      </main>

    </div>
  );
};
export default AdminPanel;
