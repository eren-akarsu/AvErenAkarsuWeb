import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BlogPost, Client, CaseFile, Appointment, Hearing, Task, PrecedentDecision } from '../context/AppContext';
import { 
  Lock, User, Mail, Calendar, Clock, BookOpen, Users, Folder, Scale, 
  CreditCard, Sparkles, Settings, BarChart2, CheckSquare, LogOut, Plus, 
  Trash2, Check, X, ShieldAlert, Award, FileText, ChevronRight, Info,
  File, HelpCircle, Eye, ArrowLeft
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
    language,
    showToast
  } = useApp();

  const isEn = language === 'en';

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('admin@akarsu.av.tr');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);

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

  // Simulated login check
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@akarsu.av.tr' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      showToast(
        isEn 
          ? 'Incorrect login details. Email: admin@akarsu.av.tr / Password: admin123'
          : 'Hatalı giriş bilgileri. E-posta: admin@akarsu.av.tr / Şifre: admin123',
        'error'
      );
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
              {isEn ? 'Administrator Login' : 'Yönetici Giriş Ekranı'}
            </h2>
          </div>

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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '40px', color: '#FFFFFF', background: 'rgba(28, 35, 64, 0.6)' }}
                  required
                />
                <Lock size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
              <CustomCheckbox 
                checked={rememberMe} 
                onChange={setRememberMe} 
                label={isEn ? 'Remember Me' : 'Beni Hatırla'} 
              />
              <span style={{ color: '#F0DAC5', cursor: 'pointer' }} onClick={() => showToast(isEn ? 'Default password is admin123.' : 'Varsayılan şifre admin123\'tür.', 'info')}>
                {isEn ? 'Forgot Password' : 'Şifremi Unuttum'}
              </span>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#F0DAC5', color: '#1C2340', border: 'none', boxShadow: 'none', fontWeight: 600 }}>
              {isEn ? 'Secure Login' : 'Güvenli Giriş Yap'}
            </button>
          </form>

          {/* Hint info */}
          <div style={{ marginTop: '24px', background: 'rgba(240, 218, 197, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(240, 218, 197, 0.1)', fontSize: '11px', color: '#A0AEC0', display: 'flex', gap: '8px' }}>
            <Info size={14} style={{ color: '#F0DAC5', flexShrink: 0 }} />
            <span>
              {isEn
                ? 'Development Preview: Form is auto-filled. You can directly click Secure Login.'
                : 'Geliştirme Önizlemesi: Form doldurulmuş haldedir. Doğrudan Giriş Yap butonuna tıklayabilirsiniz.'}
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

  const handleSaveContent = (statusOverride?: string) => {
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

      if (editingContentId) {
        updateBlogPost(editingContentId, postData);
        showToast(isEn ? 'Content updated successfully.' : 'İçerik başarıyla güncellendi.', 'success');
      } else {
        addBlogPost(postData);
        showToast(isEn ? 'Content published successfully.' : 'İçerik başarıyla yayınlandı.', 'success');
      }
      setCmsMode('LIST');
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

      if (editingContentId) {
        updatePrecedentDecision(editingContentId, decisionData);
        showToast(isEn ? 'Precedent decision updated.' : 'Emsal karar güncellendi.', 'success');
      } else {
        addPrecedentDecision(decisionData);
        showToast(isEn ? 'Precedent decision added.' : 'Emsal karar başarıyla eklendi.', 'success');
      }
      setCmsMode('LIST');
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
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: '#080A12', color: '#E2E8F0', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar Panel */}
      <aside style={{ background: '#0C101E', borderRight: '1px solid rgba(240, 218, 197, 0.1)', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
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
                onClick={() => setActiveTab(tab.id as any)}
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

        {/* Exit link */}
        <div
          onClick={() => setIsLoggedIn(false)}
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
            marginTop: 'auto',
            borderTop: '1px solid rgba(240, 218, 197, 0.05)',
            paddingTop: '20px'
          }}
        >
          <LogOut size={16} /> {isEn ? 'Sign Out' : 'Çıkış Yap'}
        </div>

      </aside>

      {/* Main Workspace content */}
      <main style={{ padding: '40px', overflowY: 'auto', maxHeight: '100vh', background: '#0A0D18' }}>
        
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
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Court Name' : 'Mahkeme / Daire Adı'}</label>
                          <input type="text" value={decCourtName} onChange={(e) => setDecCourtName(e.target.value)} className="glass-input" placeholder="Örn: Yargıtay 9. Hukuk Dairesi" style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Decision Date' : 'Karar Tarihi'}</label>
                          <input type="date" value={decDate} onChange={(e) => setDecDate(e.target.value)} className="glass-input" style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Merit (Esas) No' : 'Esas Numarası'}</label>
                          <input type="text" value={decEsas} onChange={(e) => setDecEsas(e.target.value)} className="glass-input" placeholder="Örn: 2025/110 E." style={{ width: '100%' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <label style={{ fontSize: '11px', color: '#A0AEC0' }}>{isEn ? 'Ruling (Karar) No' : 'Karar Numarası'}</label>
                          <input type="text" value={decKarar} onChange={(e) => setDecKarar(e.target.value)} className="glass-input" placeholder="Örn: 2026/450 K." style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

            {/* Client modal */}
            {showClientModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                <div style={{ background: '#0C101E', borderRadius: '16px', padding: '30px', width: '500px', border: '1px solid rgba(240, 218, 197, 0.15)' }}>
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

            {/* Case modal */}
            {showCaseModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                <div style={{ background: '#0C101E', borderRadius: '16px', padding: '30px', width: '500px', border: '1px solid rgba(240, 218, 197, 0.15)' }}>
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
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
        {['calendar', 'stats', 'settings'].includes(activeTab) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Outfit', color: '#F0DAC5' }}>
                {activeTab === 'calendar' && (isEn ? 'Hearing & Task Calendar' : 'Duruşma ve İş Takvimi')}
                {activeTab === 'stats' && (isEn ? 'Platform Statistics' : 'Platform İstatistikleri')}
                {activeTab === 'settings' && (isEn ? 'Site General Settings' : 'Site Genel Ayarları')}
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
                {activeTab === 'settings' && (
                  isEn 
                    ? 'The SiteSettings model containing the header, logo, corporate colors, social media links, and GDPR disclosure text is defined.'
                    : 'Header, logo, kurumsal renkler, sosyal medya linkleri ve KVKK aydınlatma metinlerini içeren SiteSettings modeli tanımlıdır.'
                )}
              </p>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};
export default AdminPanel;
