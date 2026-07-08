import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import * as contentService from '../services/contentService';
import * as precedentService from '../services/precedentService';
import * as settingsService from '../services/siteSettingsService';
import type { SiteSettings } from '../services/siteSettingsService';
import type { Content, PrecedentDecisionDB } from '../types/database';

// Definitions of Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'Makaleler' | 'Dilekçeler' | 'Değerlendirmeler' | 'Kararlar' | 'Analizler' | 'Notlar';
  readingTime: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  tags: string[];
}

export interface PrecedentDecision {
  id: string;
  title: string;
  court: string;
  esas: string;
  karar: string;
  decisionDate: string;
  category: string;
  tags: string[];
  summary: string;
  fullText: string;
  isFeatured: boolean;
  status: 'Taslak' | 'Yayında';
  sortOrder: number;
  showOnHome: boolean;
  showOnLegalDocs: boolean;
}

export interface Client {
  id: string;
  fullName: string;
  tcIdentityNumber: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  notes: string;
  createdAt: string;
}

export interface CaseFile {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  caseNumber: string;
  courtName: string;
  opposingParty: string;
  caseType: 'HUKUK' | 'CEZA' | 'CMK';
  caseCategory: string;
  stage: string;
  status: 'Yapılacak' | 'Devam Ediyor' | 'Tamamlandı' | 'Ertelendi';
  description: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: 'Online' | 'Yüz Yüze' | 'Telefon';
  status: 'Bekliyor' | 'Onaylandı' | 'Reddedildi' | 'Tamamlandı';
  notes: string;
  paymentStatus: 'Bekliyor' | 'Tamamlandı' | 'İade Edildi';
  paymentAmount: number;
}

export interface Hearing {
  id: string;
  caseFileId: string;
  caseTitle: string;
  clientName: string;
  courtName: string;
  hearingDate: string;
  hearingTime: string;
  courtroom: string;
  status: 'Yaklaşan' | 'Tamamlandı' | 'Ertendi' | 'İptal';
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'Yapılacak' | 'Devam Ediyor' | 'Tamamlandı';
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Acil';
  dueDate: string;
}

export interface ChatbotLog {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'tr' | 'en';
  toggleLanguage: () => void;
  currentRoute: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani' | 'content-detail';
  navigateTo: (route: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani' | 'content-detail') => void;
  
  // Toast notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;

  // Cookie Consent Preferences
  cookieConsent: {
    essential: boolean;
    preferences: boolean;
    analytics: boolean;
    functional: boolean;
  } | null;
  saveCookieConsent: (consent: {
    essential: boolean;
    preferences: boolean;
    analytics: boolean;
    functional: boolean;
  }) => void;
  isCookieModalOpen: boolean;
  setIsCookieModalOpen: (open: boolean) => void;
  
  // Data lists
  blogPosts: BlogPost[];
  precedentDecisions: PrecedentDecision[];
  clients: Client[];
  caseFiles: CaseFile[];
  appointments: Appointment[];
  hearings: Hearing[];
  tasks: Task[];
  chatbotLogs: ChatbotLog[];
  
  // Loading / Error states for DB-backed data
  isLoadingContents: boolean;
  isLoadingDecisions: boolean;
  contentsError: string | null;
  decisionsError: string | null;
  refetchContents: () => void;
  refetchDecisions: () => void;

  // CRUD Actions
  addBlogPost: (post: Omit<BlogPost, 'id' | 'viewCount' | 'likeCount' | 'publishedAt'>) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  addPrecedentDecision: (dec: Omit<PrecedentDecision, 'id'>) => void;
  updatePrecedentDecision: (id: string, dec: Partial<PrecedentDecision>) => void;
  deletePrecedentDecision: (id: string) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  addCaseFile: (caseFile: Omit<CaseFile, 'id'>) => void;
  updateCaseStatus: (id: string, status: CaseFile['status']) => void;
  addAppointment: (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  addHearing: (hearing: Omit<Hearing, 'id'>) => void;
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  addChatbotLog: (msg: ChatbotLog) => void;
  
  // Settings
  chatbotSettings: {
    welcomeMessage: string;
    systemPrompt: string;
    isActive: boolean;
    modelName: string;
  };
  updateChatbotSettings: (settings: any) => void;
  siteSettings: SiteSettings;
  updateSiteSettings: (group: keyof SiteSettings, data: any) => Promise<boolean>;
  resetSiteSettings: (group: keyof SiteSettings) => Promise<boolean>;
  
  // Dynamic Page states
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  contentSlug: string | null;
  setContentSlug: (slug: string | null) => void;

  
  // Translation function
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================
// FALLBACK MOCK DATA — Used only when Supabase is NOT configured
// ============================================================
const fallbackBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Kıdem Tazminatı Hesaplama Rehberi 2026',
    slug: 'kidem-tazminati-hesaplama-rehberi-2026',
    excerpt: 'Yeni dönem asgari ücret artışları ve Yargıtay\'ın en son emsal kararları ışığında kıdem tazminatı tavanı ve hesaplama detayları.',
    content: 'İş Hukuku uygulamasında en sık karşılaşılan uyuşmazlıkların başında kıdem tazminatı hesaplamaları gelmektedir...',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    category: 'Makaleler',
    readingTime: '6 Dakika',
    viewCount: 1240,
    likeCount: 94,
    publishedAt: '2026-06-15',
    tags: ['İş Hukuku', 'Kıdem Tazminatı', 'Yargıtay Kararları']
  },
  {
    id: 'post-2',
    title: 'İstinaf Başvuru Dilekçesi Örneği',
    slug: 'istinaf-basvuru-dilekcesi-ornegi',
    excerpt: 'Ağır Ceza Mahkemeleri kararlarına karşı yapılacak istinaf başvurularında usul ve esas bakımından dikkat edilmesi gereken noktalar ve şablon.',
    content: 'İstinaf başvurusu, ilk derece mahkemesi kararlarının hem hukuki hem de fiili açıdan denetlenmesini sağlayan önemli bir kanun yoludur...',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    category: 'Dilekçeler',
    readingTime: 'Şablon',
    viewCount: 2310,
    likeCount: 182,
    publishedAt: '2026-06-20',
    tags: ['Ceza Hukuku', 'İstinaf', 'Dilekçe Örneği']
  },
  {
    id: 'post-3',
    title: 'Bilişim Sistemleri Aracılığıyla Dolandırıcılık Suçu',
    slug: 'bilisim-sistemleri-araciligiyla-dolandiricilik-sucu',
    excerpt: 'Türk Ceza Kanunu 158/1-f maddesi kapsamında bilişim sistemlerinin araç olarak kullanılması suretiyle dolandırıcılık suçunun unsurları.',
    content: 'Teknolojinin gelişmesi ile birlikte ceza hukuku alanında bilişim suçları ve bilişim sistemleri vasıtasıyla işlenen suçlarda ciddi bir artış yaşanmaktadır...',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'Değerlendirmeler',
    readingTime: '8 Dakika',
    viewCount: 890,
    likeCount: 57,
    publishedAt: '2026-07-01',
    tags: ['Bilişim Hukuku', 'TCK 158', 'Nitelikli Dolandırıcılık']
  }
];

const fallbackPrecedentDecisions: PrecedentDecision[] = [
  {
    id: 'dec-1',
    title: 'Kıdem Tazminatında Yol ve Yemek Yardımı Dahiliyeti',
    court: 'Yargıtay Hukuk Genel Kurulu',
    esas: '2025/12-344 Esas',
    karar: '2026/89 Karar',
    decisionDate: '2026-02-15',
    category: 'İş Hukuku',
    tags: ['İş Hukuku', 'Kıdem Tazminatı', 'Giydirilmiş Ücret'],
    summary: 'İşçi tarafından haklı nedenle yapılan fesihte kıdem tazminatı giydirilmiş brüt ücretinin hesabında süreklilik arz eden ayni ve nakdi yardımların tam olarak dahil edilmesi gerektiği kararı.',
    fullText: 'Kıdem tazminatının hesabında işçiye ödenen brüt ücrete ek olarak süreklilik gösteren para veya para ile ölçülmesi mümkün menfaatlerin de dikkate alınması İş Kanunu\'nun emredici hükümlerindendir.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 1,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-2',
    title: 'Dijital Materyallerde Hakim Kararı Olmaksızın Arama ve El Koyma',
    court: 'Anayasa Mahkemesi Genel Kurulu',
    esas: '2024/4512 Başvuru',
    karar: '2025/112 Karar',
    decisionDate: '2025-11-20',
    category: 'Bilişim Hukuku',
    tags: ['Bilişim Hukuku', 'El Koyma', 'Anayasa Mahkemesi'],
    summary: 'Sosyal medya paylaşımları nedeniyle yapılan soruşturmalarda bilişim sistemleri üzerinde yapılan arama ve el koyma işlemlerinin özel hayatın gizliliği ve hak ihlali değerlendirmesi.',
    fullText: 'CMK md. 134 uyarınca bilgisayarlarda, bilgisayar programlarında ve kütüklerinde arama, kopyalama ve el koyma işlemleri ancak hakim kararı ile yapılabilir.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 2,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-3',
    title: 'Kripto Varlık Hırsızlığında Nitelikli Hırsızlık Suçu',
    court: 'Yargıtay 8. Ceza Dairesi',
    esas: '2024/1145 Esas',
    karar: '2025/322 Karar',
    decisionDate: '2025-09-12',
    category: 'Bilişim Ceza',
    tags: ['Kripto Varlık', 'Nitelikli Hırsızlık', 'Siber Suçlar'],
    summary: 'Kripto varlık cüzdanı şifresinin izinsiz ele geçirilerek varlıkların başka cüzdana aktarılması eyleminin TCK md. 142/2-e uyarınca nitelikli hırsızlık suçunu oluşturduğu kararı.',
    fullText: 'Sanığın, katılanın rızası dışında elde ettiği özel anahtar ve şifreleri kullanmak suretiyle katılanın kripto varlık cüzdanına erişim sağladığı tespit edilmiştir.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 3,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-4',
    title: 'Yapay Zekâ Çıktılarında Eser Sahipliği ve Telif Hakkı',
    court: 'Yargıtay 11. Hukuk Dairesi',
    esas: '2025/445 Esas',
    karar: '2026/18 Karar',
    decisionDate: '2026-01-20',
    category: 'Fikri Mülkiyet',
    tags: ['Yapay Zeka', 'Fikir ve Sanat Eserleri', 'Telif Hakkı'],
    summary: 'Yapay zekâ algoritmaları tarafından insan müdahalesi olmaksızın üretilen çıktıların FSEK kapsamında eser niteliği taşımayacağı kararı.',
    fullText: 'Fikir ve Sanat Eserleri Kanunu md. 1 uyarınca bir ürünün eser olarak nitelendirilebilmesi için sahibinin hususiyetini taşıması ve insan yaratıcılığının ürünü olması şarttır.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 4,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-5',
    title: 'Tahliye Taahhütnamesinde İmza ve Tarih İtirazı',
    court: 'Yargıtay 6. Hukuk Dairesi',
    esas: '2024/991 Esas',
    karar: '2025/41 Karar',
    decisionDate: '2025-05-18',
    category: 'Kira Hukuku',
    tags: ['Kira Hukuku', 'Tahliye Taahhüdü', 'İmza İtirazı'],
    summary: 'Boş olarak verilen ve sonradan doldurulan tahliye taahhütnamelerinin geçerli olduğu kararı.',
    fullText: 'Beyaza imza atan kimse, bu davranışının hukuki sonuçlarına katlanmak zorundadır.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 5,
    showOnHome: true,
    showOnLegalDocs: true
  }
];

// Clients, cases, appointments, etc. — kept as local mock (out of scope)
const initialClients: Client[] = [
  { id: 'c-1', fullName: 'Ahmet Yılmaz', tcIdentityNumber: '12345678901', phone: '0532 123 45 67', email: 'ahmet@gmail.com', address: 'Kadıköy, İstanbul', occupation: 'Mühendis', notes: '', createdAt: '2026-05-10' },
  { id: 'c-2', fullName: 'Elif Kaya', tcIdentityNumber: '98765432109', phone: '0544 987 65 43', email: 'elif.kaya@outlook.com', address: 'Beşiktaş, İstanbul', occupation: 'Mimar', notes: '', createdAt: '2026-06-02' },
  { id: 'c-3', fullName: 'Mustafa Demir', tcIdentityNumber: '55667788990', phone: '0505 456 78 90', email: 'mustafa@demirinsaat.com', address: 'Şişli, İstanbul', occupation: 'İş İnsanı', notes: '', createdAt: '2026-06-25' }
];

const initialCaseFiles: CaseFile[] = [
  { id: 'case-1', clientId: 'c-1', clientName: 'Ahmet Yılmaz', title: 'İşe İade Davası', caseNumber: '2026/145 Esas', courtName: 'İstanbul 4. İş Mahkemesi', opposingParty: 'Teknoloji A.Ş.', caseType: 'HUKUK', caseCategory: 'İş Hukuku', stage: 'Duruşma Aşaması', status: 'Devam Ediyor', description: 'Haksız fesih nedeniyle açılan işe iade ve kıdem/ihbar alacakları davası.' },
  { id: 'case-2', clientId: 'c-2', clientName: 'Elif Kaya', title: 'Nitelikli Dolandırıcılık Savunması', caseNumber: '2026/322 Esas', courtName: 'İstanbul 12. Ağır Ceza Mahkemesi', opposingParty: 'Kamu Hukuku (Müşteki H.K.)', caseType: 'CEZA', caseCategory: 'Bilişim Ceza', stage: 'Karar Aşaması', status: 'Devam Ediyor', description: 'Bilişim sistemleri aracılığıyla dolandırıcılık isnadına karşı yürütülen ceza davası savunması.' },
  { id: 'case-3', clientId: 'c-3', clientName: 'Mustafa Demir', title: 'CMK Görevlendirmesi (Karakol İfadesi)', caseNumber: '2026/89 Sor.', courtName: 'Beşiktaş İlçe Emniyet Md.', opposingParty: 'Kamu', caseType: 'CMK', caseCategory: 'CMK Pratiği', stage: 'Soruşturma', status: 'Tamamlandı', description: 'Şüpheli müdafi olarak katılım sağlanan emniyet ifade süreci refakati.' }
];

const initialAppointments: Appointment[] = [
  { id: 'app-1', clientName: 'Selin Yurt', phone: '0533 111 22 33', email: 'selin@yurtlaw.com', appointmentDate: '2026-07-05', appointmentTime: '10:30', consultationType: 'Online', status: 'Onaylandı', notes: 'Bilişim hukuku alanında start-up sözleşmeleri danışmanlığı.', paymentStatus: 'Tamamlandı', paymentAmount: 2500 },
  { id: 'app-2', clientName: 'Can Öztürk', phone: '0542 222 33 44', email: 'can@ozturk.com', appointmentDate: '2026-07-06', appointmentTime: '14:00', consultationType: 'Yüz Yüze', status: 'Bekliyor', notes: 'Kira artış oranları ve tahliye taahhütnamesi değerlendirmesi.', paymentStatus: 'Bekliyor', paymentAmount: 2000 },
  { id: 'app-3', clientName: 'Merve Aslan', phone: '0507 333 44 55', email: 'merve@aslan.net', appointmentDate: '2026-07-04', appointmentTime: '16:30', consultationType: 'Telefon', status: 'Tamamlandı', notes: 'Boşanma protokolü ve velayet hakları ön danışma görüşmesi.', paymentStatus: 'Tamamlandı', paymentAmount: 1500 }
];

const initialHearings: Hearing[] = [
  { id: 'h-1', caseFileId: 'case-1', caseTitle: 'İşe İade Davası', clientName: 'Ahmet Yılmaz', courtName: 'İstanbul 4. İş Mahkemesi', hearingDate: '2026-07-08', hearingTime: '09:45', courtroom: 'C-201 Salonu', status: 'Yaklaşan', notes: 'Bilirkişi raporuna karşı beyan sunulacak.' },
  { id: 'h-2', caseFileId: 'case-2', caseTitle: 'Nitelikli Dolandırıcılık Savunması', clientName: 'Elif Kaya', courtName: 'İstanbul 12. Ağır Ceza Mahkemesi', hearingDate: '2026-07-15', hearingTime: '11:30', courtroom: 'A-104 Salonu', status: 'Yaklaşan', notes: 'Karar duruşması. Esas hakkında savunma yapılacak.' }
];

const initialTasks: Task[] = [
  { id: 't-1', title: 'İşe İade Davası Bilirkişi Raporuna İtiraz Dilekçesi Hazırla', status: 'Yapılacak', priority: 'Yüksek', dueDate: '2026-07-07' },
  { id: 't-2', title: 'CMK Eğitim Sertifikalarını Baro Paneline Yükle', status: 'Devam Ediyor', priority: 'Orta', dueDate: '2026-07-10' },
  { id: 't-3', title: 'Müvekkil Mustafa Demir Görüşme Notlarını Sisteme İşle', status: 'Tamamlandı', priority: 'Düşük', dueDate: '2026-07-03' },
  { id: 't-4', title: 'Kira Artış Formülünü Hesaplama Modülüne Entegre Et', status: 'Yapılacak', priority: 'Acil', dueDate: '2026-07-05' }
];

// ============================================================
// TRANSLATIONS (unchanged)
// ============================================================
const translations = {
  tr: {
    'brand.title': 'Av. Eren Akarsu',
    'brand.subtitle': 'LegalTech Platformu',
    'nav.home': 'Anasayfa',
    'nav.about': 'Hakkımda',
    'nav.practice': 'Faaliyet Alanları',
    'nav.blog': 'Hukuki İçerikler',
    'nav.contact': 'İletişim',
    'nav.appointment': 'Online Randevu',
    'nav.admin': 'Admin Paneli',
    
    'hero.badge': 'Teknoloji & Hukuk',
    'hero.title': 'Hukuk ve Teknoloji Arasında Bir Köprü',
    'hero.description': 'İstanbul Okan Üniversitesi Hukuk Fakültesi ve Yazılım Mühendisliği çift anadal programı mezunu olarak, hukuki süreçleri dijital çağın dinamikleriyle yönetiyor, yenilikçi LegalTech çözümleri sunuyorum.',
    'hero.cta.appointment': 'Randevu Oluştur',
    'hero.cta.blog': 'Bilgi Merkezini Keşfet',
    'hero.experience': 'Çift Lisans Diploması',
    'hero.experience.sub': 'Hukuk & Yazılım Mühendisliği',
    
    'about.title': 'Hukuku Kodluyorum',
    'about.description': 'Klasik kurumsal avukatlık anlayışını geride bırakarak, hukuk teorisini yazılım mühendisliği disiplini ile harmanlıyorum. Amacım, karmaşık hukuki süreçleri kullanıcı dostu, teknolojik ve şeffaf araçlarla çözüme kavuşturmaktır.',
    'about.point1': 'Yazılım Mühendisliği Çift Anadal altyapısı',
    'about.point2': 'Modern Web Teknolojileri ve AI entegrasyonu',
    'about.point3': 'Yenilikçi Hukuki Otomasyon Projeleri',
    
    'education.title': 'Eğitim Yolculuğu',
    'education.subtitle': 'Akademik Başarı ve Teknik Gelişim',
    'education.item1.year': '2020',
    'education.item1.title': 'Hukuk Eğitiminin Başlangıcı',
    'education.item1.desc': 'İstanbul Okan Üniversitesi Hukuk Fakültesi\'ne tam burslu giriş.',
    'education.item2.year': '2021',
    'education.item2.title': 'Yazılım Mühendisliği Çift Anadal',
    'education.item2.desc': 'Mühendislik Fakültesi Yazılım Mühendisliği programına kabul.',
    'education.item3.year': '2024',
    'education.item3.title': 'Mezuniyet & Başarı',
    'education.item3.desc': 'Hukuk Fakültesi İkincisi olarak mezuniyet. Yazılım Mühendisliği derecesi.',
    'education.item4.year': '2025',
    'education.item4.title': 'Yüksek Lisans & Baro Kaydı',
    'education.item4.desc': 'Özel Hukuk Yüksek Lisans programına başlangıç. İstanbul Barosu stajı ve avukatlık kaydı.',
    
    'stats.diplomas': '2 Lisans Diploması',
    'stats.masters': '1 Yüksek Lisans (Devam)',
    'stats.cmk': 'Aktif CMK Görevleri',
    'stats.projects': 'LegalTech Projeleri',
    'stats.content': 'Onlarca Hukuki İçerik',
    
    'practice.title': 'Uzmanlık ve Faaliyet Alanları',
    'practice.subtitle': 'Hukukun her alanında teknoloji destekli, hızlı ve güvenilir çözümler.',
    'practice.cyber': 'Bilişim Hukuku',
    'practice.cyber.desc': 'KVKK uyumu, e-ticaret, siber suçlar, internet üzerindeki hak ihlalleri ve akıllı sözleşmeler.',
    'practice.criminal': 'Ceza Hukuku',
    'practice.criminal.desc': 'Soruşturma ve kovuşturma aşamalarında ceza savunmanlığı, emniyet ifade süreçleri, ağır ceza davaları.',
    'practice.business': 'İş Hukuku',
    'practice.business.desc': 'Kıdem, ihbar tazminatı alacakları, işe iade davaları, hizmet tespit ve iş sözleşmeleri yönetimi.',
    'practice.family': 'Aile Hukuku',
    'practice.family.desc': 'Anlaşmalı ve çekişmeli boşanma davaları, velayet, nafaka ve mal rejimi tasfiyesi süreçleri.',
    'practice.inheritance': 'Miras Hukuku',
    'practice.inheritance.desc': 'Veraset ilamı, miras paylaşımı, tenkis ve muris muvazaası davaları, vasiyetname düzenleme.',
    'practice.execution': 'İcra ve İflas Hukuku',
    'practice.execution.desc': 'Alacak takipleri, haciz işlemleri, menfi tespit davaları ve şirket yapılandırma/konkordato.',
    'practice.commerce': 'Ticaret Hukuku',
    'practice.commerce.desc': 'Şirketler hukuku danışmanlığı, ticari sözleşmeler, haksız rekabet ve ortaklık uyuşmazlıkları.',
    'practice.contracts': 'Sözleşmeler Hukuku',
    'practice.contracts.desc': 'Gayrimenkul, kira, ortaklık ve gizlilik sözleşmelerinin hazırlanması, revizyonu ve analizi.',

    'calculators.title': 'Hukuki Hesaplama Araçları',
    'calculators.subtitle': 'Haklarınızı hızlıca analiz edin. Sonuçlar ön bilgilendirme amaçlıdır.',
    
    'payment.title': 'Güvenli Ödeme Altyapısı',
    'payment.subtitle': 'Danışmanlık ve dava avans ödemelerinizi SSL güvencesiyle 3D Secure olarak yapabilirsiniz.',
    
    'contact.title': 'Dijital Ofis & İletişim',
    'contact.subtitle': 'Sorularınız veya randevu talepleriniz için formu doldurabilir, ofisimize ulaşabilirsiniz.',
    'contact.form.name': 'Adınız Soyadınız',
    'contact.form.phone': 'Telefon Numaranız',
    'contact.form.email': 'E-posta Adresiniz',
    'contact.form.subject': 'Konu',
    'contact.form.message': 'Mesajınız',
    'contact.form.kvkk': 'KVKK Aydınlatma Metnini okudum, kişisel verilerimin işlenmesini kabul ediyorum.',
    'contact.form.send': 'Mesajı Gönder',
    'contact.form.success': 'Mesajınız başarıyla iletilmiştir. En kısa sürede dönüş sağlanacaktır.',
    
    'appointment.title': 'Online Randevu Sistemi',
    'appointment.subtitle': 'Takvim üzerinden uygun bir tarih seçerek online veya yüz yüze danışmanlık talep edin.',
    'appointment.date': 'Tarih Seçin',
    'appointment.time': 'Saat Seçin',
    'appointment.type': 'Görüşme Türü',
    'appointment.notes': 'Eklemek İstediğiniz Notlar',
    'appointment.submit': 'Randevu Talebini Gönder',
    'appointment.success': 'Randevu talebiniz alınmıştır! Ödeme ekranına yönlendiriliyorsunuz.'
  },
  en: {
    'brand.title': 'Att. Eren Akarsu',
    'brand.subtitle': 'LegalTech Platform',
    'nav.home': 'Home',
    'nav.about': 'About Me',
    'nav.practice': 'Practice Areas',
    'nav.blog': 'Legal Content',
    'nav.contact': 'Contact',
    'nav.appointment': 'Book Appointment',
    'nav.admin': 'Admin Panel',
    
    'hero.badge': 'Technology & Law',
    'hero.title': 'A Bridge Between Law and Technology',
    'hero.description': 'As a double major graduate in Law and Software Engineering from Istanbul Okan University, I manage legal processes with the dynamics of the digital age and build innovative LegalTech solutions.',
    'hero.cta.appointment': 'Book Appointment',
    'hero.cta.blog': 'Explore Knowledge Center',
    'hero.experience': 'Double Bachelor Degree',
    'hero.experience.sub': 'Law & Software Engineering',
    
    'about.title': 'Coding the Law',
    'about.description': 'Leaving traditional corporate law approaches behind, I merge legal theory with the discipline of software engineering. My goal is to resolve complex legal disputes using user-friendly, technological, and transparent tools.',
    'about.point1': 'Software Engineering Double Major background',
    'about.point2': 'Modern Web Technologies and AI integrations',
    'about.point3': 'Innovative Legal Automation Projects',
    
    'education.title': 'Education Journey',
    'education.subtitle': 'Academic Excellence and Technical Growth',
    'education.item1.year': '2020',
    'education.item1.title': 'Beginning of Legal Studies',
    'education.item1.desc': 'Entered Istanbul Okan University Faculty of Law with a full scholarship.',
    'education.item2.year': '2021',
    'education.item2.title': 'Software Engineering Double Major',
    'education.item2.desc': 'Accepted to the Software Engineering program in the Faculty of Engineering.',
    'education.item3.year': '2024',
    'education.item3.title': 'Graduation & Achievement',
    'education.item3.desc': 'Graduated as Valedictorian runner-up in Law. Software Engineering degree completed.',
    'education.item4.year': '2025',
    'education.item4.title': 'Masters Degree & Bar Association Registry',
    'education.item4.desc': 'Started Private Law Master\'s degree. Registered with the Istanbul Bar Association.',
    
    'stats.diplomas': '2 Bachelor Degrees',
    'stats.masters': '1 Masters Degree (Ongoing)',
    'stats.cmk': 'Active CMK Public Defenses',
    'stats.projects': 'LegalTech Projects',
    'stats.content': 'Dozens of Legal Articles',
    
    'practice.title': 'Areas of Practice',
    'practice.subtitle': 'Technology-supported, fast, and reliable solutions in all fields of law.',
    'practice.cyber': 'IT & Cyber Law',
    'practice.cyber.desc': 'KVKK (GDPR) compliance, e-commerce, cyber crimes, online rights violations, and smart contracts.',
    'practice.criminal': 'Criminal Law',
    'practice.criminal.desc': 'Criminal defense at investigation/prosecution phases, police interrogations, high criminal court cases.',
    'practice.business': 'Labor & Employment Law',
    'practice.business.desc': 'Severance and notice pay disputes, reinstatement lawsuits, service detection, and employment agreements.',
    'practice.family': 'Family Law',
    'practice.family.desc': 'Consensual and contested divorce lawsuits, child custody, alimony, and division of matrimonial property.',
    'practice.inheritance': 'Inheritance Law',
    'practice.inheritance.desc': 'Certificates of inheritance, estate distribution, reduction lawsuits, and drafting wills.',
    'practice.execution': 'Execution & Bankruptcy',
    'practice.execution.desc': 'Debt collection, foreclosure procedures, negative clearance lawsuits, and debt restructuring.',
    'practice.commerce': 'Commercial Law',
    'practice.commerce.desc': 'Corporate law consultancy, commercial agreements, unfair competition, and shareholder disputes.',
    'practice.contracts': 'Law of Contracts',
    'practice.contracts.desc': 'Drafting, reviewing, and analyzing real estate, lease, partnership, and confidentiality agreements.',

    'calculators.title': 'Legal Calculators',
    'calculators.subtitle': 'Quickly analyze your rights. Results are for preliminary informational purposes only.',
    
    'payment.title': 'Secure Payment System',
    'payment.subtitle': 'Make your consultancy and case advance payments with SSL security and 3D Secure verification.',
    
    'contact.title': 'Digital Office & Contact',
    'contact.subtitle': 'Fill out the form or reach our office for questions or appointment requests.',
    'contact.form.name': 'Your Name Surname',
    'contact.form.phone': 'Your Phone Number',
    'contact.form.email': 'Your Email Address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.kvkk': 'I have read the KVKK Clarification Text and consent to the processing of my personal data.',
    'contact.form.send': 'Send Message',
    'contact.form.success': 'Your message has been sent successfully. We will get back to you shortly.',
    
    'appointment.title': 'Online Booking System',
    'appointment.subtitle': 'Select an available slot from the calendar and request online or face-to-face consultancy.',
    'appointment.date': 'Select Date',
    'appointment.time': 'Select Time',
    'appointment.type': 'Meeting Type',
    'appointment.notes': 'Additional Notes',
    'appointment.submit': 'Submit Booking Request',
    'appointment.success': 'Your appointment request is saved! Redirecting to payment screen.'
  }
};

// ============================================================
// HELPER: Convert Supabase Content row → BlogPost shape
// ============================================================
function contentToBlogPost(c: Content): BlogPost {
  const categoryMap: Record<string, BlogPost['category']> = {
    'document_template': 'Dilekçeler',
    'article': 'Makaleler',
    'legal_review': 'Değerlendirmeler',
    'precedent_decision': 'Kararlar',
    'case_law_analysis': 'Analizler',
    'professional_note': 'Notlar',
    'legal_calculator': 'Notlar',
  };

  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    excerpt: c.excerpt,
    content: c.content_body,
    coverImage: c.cover_image_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    category: categoryMap[c.content_type] || 'Makaleler',
    readingTime: c.reading_time || '',
    viewCount: c.view_count,
    likeCount: c.like_count,
    publishedAt: c.published_at ? c.published_at.split('T')[0] : c.created_at.split('T')[0],
    tags: c.tags || [],
  };
}

// ============================================================
// HELPER: Convert Supabase PrecedentDecisionDB row → PrecedentDecision shape
// ============================================================
function dbToPrecedentDecision(d: PrecedentDecisionDB): PrecedentDecision {
  return {
    id: d.id,
    title: d.title,
    court: d.court_name,
    esas: d.esas_no,
    karar: d.karar_no,
    decisionDate: d.decision_date || '',
    category: d.category,
    tags: d.tags || [],
    summary: d.short_summary,
    fullText: d.full_decision_text,
    isFeatured: d.is_featured,
    status: d.status === 'published' ? 'Yayında' : 'Taslak',
    sortOrder: d.sort_order,
    showOnHome: d.show_on_homepage,
    showOnLegalDocs: d.show_on_legal_contents,
  };
}

// ============================================================
// PROVIDER
// ============================================================
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  
  const [language, setLanguage] = useState<'tr' | 'en'>(() => {
    return (localStorage.getItem('language') as 'tr' | 'en') || 'tr';
  });
  
  const [currentRoute, setCurrentRoute] = useState<'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani' | 'content-detail'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.startsWith('/icerik/')) {
      return 'content-detail';
    }
    if (path === '/cerez-politikasi' || hash === '#cerez-politikasi') {
      return 'cerez-politikasi';
    }
    if (path === '/hukuki-hesaplama-araclari' || hash === '#hukuki-hesaplama-araclari') {
      return 'hukuki-hesaplama-araclari';
    }
    if (path === '/kvkk-aydinlatma-metni' || hash === '#kvkk-aydinlatma-metni') {
      return 'kvkk-aydinlatma-metni';
    }
    if (path === '/acik-riza-metni' || hash === '#acik-riza-metni') {
      return 'acik-riza-metni';
    }
    if (path === '/kullanim-kosullari' || hash === '#kullanim-kosullari') {
      return 'kullanim-kosullari';
    }
    if (path === '/sorumluluk-reddi-beyani' || hash === '#sorumluluk-reddi-beyani') {
      return 'sorumluluk-reddi-beyani';
    }
    if (hash === '#admin') {
      return 'admin';
    }
    if (hash === '#knowledge-hub') {
      return 'knowledge-hub';
    }
    return 'home';
  });

  const [contentSlug, setContentSlug] = useState<string | null>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/icerik/')) {
      return path.replace('/icerik/', '');
    }
    return null;
  });

  const [cookieConsent, setCookieConsent] = useState<{
    essential: boolean;
    preferences: boolean;
    analytics: boolean;
    functional: boolean;
  } | null>(() => {
    const saved = localStorage.getItem('cookieConsent');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const saveCookieConsent = (consent: {
    essential: boolean;
    preferences: boolean;
    analytics: boolean;
    functional: boolean;
  }) => {
    setCookieConsent(consent);
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
  };

  // ============================================================
  // DATA STATE — Blog Posts & Precedent Decisions
  // ============================================================
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [precedentDecisions, setPrecedentDecisions] = useState<PrecedentDecision[]>([]);
  const [isLoadingContents, setIsLoadingContents] = useState(true);
  const [isLoadingDecisions, setIsLoadingDecisions] = useState(true);
  const [contentsError, setContentsError] = useState<string | null>(null);
  const [decisionsError, setDecisionsError] = useState<string | null>(null);

  // Other data (remains local/mock)
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>(initialCaseFiles);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [hearings, setHearings] = useState<Hearing[]>(initialHearings);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [chatbotLogs, setChatbotLogs] = useState<ChatbotLog[]>([
    { sender: 'bot', text: 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?', timestamp: new Date() }
  ]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => settingsService.getDefaultSettings());

  const [chatbotSettings, setChatbotSettings] = useState({
    welcomeMessage: 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?',
    systemPrompt: 'Sen Av. Eren Akarsu platformunun yapay zekâ asistanısın. Ziyaretçilere hukuki konularda genel ön bilgi ver, kesinlikle resmi hukuki danışmanlık yapmadığını ve bu bilgilerin danışmanlık niteliği taşımadığını belirt. Ziyaretçileri iletişim formu veya randevu alma modüllerine yönlendir.',
    isActive: true,
    modelName: 'HuggingFace - Llama 3.1 8B Instruct'
  });

  // ============================================================
  // FETCH DATA FROM SUPABASE (or fallback to mock)
  // ============================================================
  const fetchContents = useCallback(async () => {
    setIsLoadingContents(true);
    setContentsError(null);

    if (!isSupabaseConfigured()) {
      // Fallback to mock data
      setBlogPosts(fallbackBlogPosts);
      setIsLoadingContents(false);
      return;
    }

    try {
      const data = await contentService.getAllContents();
      setBlogPosts(data.map(contentToBlogPost));
    } catch (err: any) {
      console.error('[AppContext] Failed to fetch contents:', err);
      setContentsError(err.message || 'İçerikler yüklenemedi');
      // Fallback to mock data on error
      setBlogPosts(fallbackBlogPosts);
    } finally {
      setIsLoadingContents(false);
    }
  }, []);

  const fetchDecisions = useCallback(async () => {
    setIsLoadingDecisions(true);
    setDecisionsError(null);

    if (!isSupabaseConfigured()) {
      setPrecedentDecisions(fallbackPrecedentDecisions);
      setIsLoadingDecisions(false);
      return;
    }

    try {
      const data = await precedentService.getAllPrecedentDecisions();
      setPrecedentDecisions(data.map(dbToPrecedentDecision));
    } catch (err: any) {
      console.error('[AppContext] Failed to fetch precedent decisions:', err);
      setDecisionsError(err.message || 'Emsal kararlar yüklenemedi');
      setPrecedentDecisions(fallbackPrecedentDecisions);
    } finally {
      setIsLoadingDecisions(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchContents();
    fetchDecisions();
  }, [fetchContents, fetchDecisions]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsService.getSiteSettings();
        setSiteSettings(data);
        if (data.ai_settings) {
          setChatbotSettings({
            welcomeMessage: data.ai_settings.welcomeMessage || 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?',
            systemPrompt: data.ai_settings.disclaimerText || 'Sen Av. Eren Akarsu platformunun yapay zekâ asistanısın. Bu bilgiler danışmanlık niteliği taşımaz.',
            isActive: data.ai_settings.isActive !== undefined ? data.ai_settings.isActive : true,
            modelName: 'Gemini'
          });
        }

      } catch (err) {
        console.error('[AppContext] Failed to load site settings:', err);
      }
    }
    loadSettings();
  }, []);

  // Synchronize browser tab title and SEO meta description tag dynamically
  useEffect(() => {
    if (siteSettings && siteSettings.general_settings) {
      document.title = siteSettings.general_settings.browserTitle || 'Av. Eren Akarsu - Premium LegalTech ve Hukuk Danışmanlığı';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', siteSettings.general_settings.metaDescription || '');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = siteSettings.general_settings.metaDescription || '';
        document.head.appendChild(meta);
      }
    }
  }, [siteSettings]);

  // ============================================================
  // THEME & LANGUAGE EFFECTS
  // ============================================================
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/icerik/')) {
        setCurrentRoute('content-detail');
        setContentSlug(path.replace('/icerik/', ''));
      } else if (path === '/cerez-politikasi' || hash === '#cerez-politikasi') {
        setCurrentRoute('cerez-politikasi');
      } else if (path === '/hukuki-hesaplama-araclari' || hash === '#hukuki-hesaplama-araclari') {
        setCurrentRoute('hukuki-hesaplama-araclari');
      } else if (path === '/kvkk-aydinlatma-metni' || hash === '#kvkk-aydinlatma-metni') {
        setCurrentRoute('kvkk-aydinlatma-metni');
      } else if (path === '/acik-riza-metni' || hash === '#acik-riza-metni') {
        setCurrentRoute('acik-riza-metni');
      } else if (path === '/kullanim-kosullari' || hash === '#kullanim-kosullari') {
        setCurrentRoute('kullanim-kosullari');
      } else if (path === '/sorumluluk-reddi-beyani' || hash === '#sorumluluk-reddi-beyani') {
        setCurrentRoute('sorumluluk-reddi-beyani');
      } else if (hash === '#admin') {
        setCurrentRoute('admin');
      } else if (hash === '#knowledge-hub') {
        setCurrentRoute('knowledge-hub');
      } else {
        setCurrentRoute('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const navigateTo = (route: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani' | 'content-detail') => {
    setCurrentRoute(route);
    
    // Sync browser address bar URL path or hash
    if (route === 'home') {
      window.history.pushState(null, '', '/');
    } else if (route === 'content-detail' && contentSlug) {
      window.history.pushState(null, '', `/icerik/${contentSlug}`);
    } else if (['cerez-politikasi', 'hukuki-hesaplama-araclari', 'kvkk-aydinlatma-metni', 'acik-riza-metni', 'kullanim-kosullari', 'sorumluluk-reddi-beyani'].includes(route)) {
      window.history.pushState(null, '', `/${route}`);
    } else {
      window.history.pushState(null, '', `#${route}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================
  // CRUD IMPLEMENTATIONS — Now calling Supabase services
  // ============================================================
  const addBlogPost = async (post: Omit<BlogPost, 'id' | 'viewCount' | 'likeCount' | 'publishedAt'>) => {
    if (!isSupabaseConfigured()) {
      // Fallback: local-only
      const newPost: BlogPost = {
        ...post,
        id: `post-${Date.now()}`,
        viewCount: 0,
        likeCount: 0,
        publishedAt: new Date().toISOString().split('T')[0]
      };
      setBlogPosts(prev => [newPost, ...prev]);
      return;
    }

    try {
      const contentTypeMap: Record<string, string> = {
        'Dilekçeler': 'document_template',
        'Makaleler': 'article',
        'Değerlendirmeler': 'legal_review',
        'Kararlar': 'precedent_decision',
        'Analizler': 'case_law_analysis',
        'Notlar': 'professional_note',
      };

      const created = await contentService.createContent({
        title: post.title,
        slug: '',
        excerpt: post.excerpt,
        content_body: post.content,
        content_type: (contentTypeMap[post.category] || 'article') as any,
        category: post.category,
        sub_category: '',
        tags: post.tags,
        cover_image_url: post.coverImage,
        author: 'Av. Eren Akarsu',
        status: 'published',
        is_featured: false,
        show_on_homepage: true,
        show_on_legal_contents: true,
        allow_comments: true,
        download_enabled: false,
        reading_time: post.readingTime,
        sort_order: 0,
        published_at: new Date().toISOString(),
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        canonical_url: '',
        doc_type: '',
        doc_law_area: '',
        doc_file_url: '',
        doc_warning_text: '',
        article_abstract: '',
        article_law_articles: '',
        article_precedents: '',
        article_bibliography: '',
        article_auto_toc: false,
        article_scroll_progress: false,
        calc_type: '',
        calc_warning: '',
        calc_order: 1,
      });
      setBlogPosts(prev => [contentToBlogPost(created), ...prev]);
    } catch (err: any) {
      console.error('[AppContext] addBlogPost error:', err);
      showToast(err.message || 'İçerik eklenirken hata oluştu', 'error');
      throw err;
    }
  };

  const updateBlogPost = async (id: string, updatedFields: Partial<BlogPost>) => {
    if (!isSupabaseConfigured()) {
      setBlogPosts(prev => prev.map(post => post.id === id ? { ...post, ...updatedFields } : post));
      return;
    }

    try {
      const dbUpdates: any = {};
      if (updatedFields.title !== undefined) dbUpdates.title = updatedFields.title;
      if (updatedFields.excerpt !== undefined) dbUpdates.excerpt = updatedFields.excerpt;
      if (updatedFields.content !== undefined) dbUpdates.content_body = updatedFields.content;
      if (updatedFields.coverImage !== undefined) dbUpdates.cover_image_url = updatedFields.coverImage;
      if (updatedFields.tags !== undefined) dbUpdates.tags = updatedFields.tags;
      if (updatedFields.readingTime !== undefined) dbUpdates.reading_time = updatedFields.readingTime;

      const updated = await contentService.updateContent(id, dbUpdates);
      setBlogPosts(prev => prev.map(post => post.id === id ? contentToBlogPost(updated) : post));
    } catch (err: any) {
      console.error('[AppContext] updateBlogPost error:', err);
      showToast(err.message || 'İçerik güncellenirken hata oluştu', 'error');
      throw err;
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      return;
    }

    try {
      await contentService.deleteContent(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
    } catch (err: any) {
      console.error('[AppContext] deleteBlogPost error:', err);
      showToast(err.message || 'İçerik silinirken hata oluştu', 'error');
      throw err;
    }
  };

  const addPrecedentDecision = async (dec: Omit<PrecedentDecision, 'id'>) => {
    if (!isSupabaseConfigured()) {
      const newDec: PrecedentDecision = { ...dec, id: `dec-${Date.now()}` };
      setPrecedentDecisions(prev => [...prev, newDec]);
      return;
    }

    try {
      const created = await precedentService.createPrecedentDecision({
        title: dec.title,
        slug: '',
        court_name: dec.court,
        esas_no: dec.esas,
        karar_no: dec.karar,
        decision_date: dec.decisionDate || null,
        legal_area: dec.category,
        decision_type: '',
        category: dec.category,
        tags: dec.tags,
        keywords: '',
        short_summary: dec.summary,
        important_points: '',
        full_decision_text: dec.fullText,
        legal_commentary: '',
        related_laws: '',
        conclusion: '',
        cover_image_url: '',
        status: dec.status === 'Yayında' ? 'published' : 'draft',
        is_featured: dec.isFeatured,
        show_on_homepage: dec.showOnHome,
        show_on_legal_contents: dec.showOnLegalDocs,
        sort_order: dec.sortOrder,
        published_at: dec.status === 'Yayında' ? new Date().toISOString() : null,
        seo_title: '',
        seo_description: '',
      });
      setPrecedentDecisions(prev => [...prev, dbToPrecedentDecision(created)]);
    } catch (err: any) {
      console.error('[AppContext] addPrecedentDecision error:', err);
      showToast(err.message || 'Emsal karar eklenirken hata oluştu', 'error');
      throw err;
    }
  };

  const updatePrecedentDecision = async (id: string, updatedFields: Partial<PrecedentDecision>) => {
    if (!isSupabaseConfigured()) {
      setPrecedentDecisions(prev => prev.map(dec => dec.id === id ? { ...dec, ...updatedFields } : dec));
      return;
    }

    try {
      const dbUpdates: any = {};
      if (updatedFields.title !== undefined) dbUpdates.title = updatedFields.title;
      if (updatedFields.court !== undefined) dbUpdates.court_name = updatedFields.court;
      if (updatedFields.esas !== undefined) dbUpdates.esas_no = updatedFields.esas;
      if (updatedFields.karar !== undefined) dbUpdates.karar_no = updatedFields.karar;
      if (updatedFields.decisionDate !== undefined) dbUpdates.decision_date = updatedFields.decisionDate;
      if (updatedFields.category !== undefined) dbUpdates.category = updatedFields.category;
      if (updatedFields.tags !== undefined) dbUpdates.tags = updatedFields.tags;
      if (updatedFields.summary !== undefined) dbUpdates.short_summary = updatedFields.summary;
      if (updatedFields.fullText !== undefined) dbUpdates.full_decision_text = updatedFields.fullText;
      if (updatedFields.isFeatured !== undefined) dbUpdates.is_featured = updatedFields.isFeatured;
      if (updatedFields.status !== undefined) dbUpdates.status = updatedFields.status === 'Yayında' ? 'published' : 'draft';
      if (updatedFields.sortOrder !== undefined) dbUpdates.sort_order = updatedFields.sortOrder;
      if (updatedFields.showOnHome !== undefined) dbUpdates.show_on_homepage = updatedFields.showOnHome;
      if (updatedFields.showOnLegalDocs !== undefined) dbUpdates.show_on_legal_contents = updatedFields.showOnLegalDocs;

      const updated = await precedentService.updatePrecedentDecision(id, dbUpdates);
      setPrecedentDecisions(prev => prev.map(dec => dec.id === id ? dbToPrecedentDecision(updated) : dec));
    } catch (err: any) {
      console.error('[AppContext] updatePrecedentDecision error:', err);
      showToast(err.message || 'Emsal karar güncellenirken hata oluştu', 'error');
      throw err;
    }
  };

  const deletePrecedentDecision = async (id: string) => {
    if (!isSupabaseConfigured()) {
      setPrecedentDecisions(prev => prev.filter(dec => dec.id !== id));
      return;
    }

    try {
      await precedentService.deletePrecedentDecision(id);
      setPrecedentDecisions(prev => prev.filter(dec => dec.id !== id));
    } catch (err: any) {
      console.error('[AppContext] deletePrecedentDecision error:', err);
      showToast(err.message || 'Emsal karar silinirken hata oluştu', 'error');
      throw err;
    }
  };

  // ============================================================
  // LOCAL-ONLY CRUD (Clients, Cases, Appointments, etc.)
  // ============================================================
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: `c-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients(prev => [newClient, ...prev]);
  };

  const addCaseFile = (caseFile: Omit<CaseFile, 'id'>) => {
    const newCase: CaseFile = {
      ...caseFile,
      id: `case-${Date.now()}`
    };
    setCaseFiles(prev => [newCase, ...prev]);
  };

  const updateCaseStatus = (id: string, status: CaseFile['status']) => {
    setCaseFiles(prev => prev.map(cf => cf.id === id ? { ...cf, status } : cf));
  };

  const addAppointment = (app: Omit<Appointment, 'id' | 'status' | 'paymentStatus'>) => {
    const newApp: Appointment = {
      ...app,
      id: `app-${Date.now()}`,
      status: 'Bekliyor',
      paymentStatus: 'Bekliyor'
    };
    setAppointments(prev => [newApp, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const addHearing = (hearing: Omit<Hearing, 'id'>) => {
    const newHearing: Hearing = {
      ...hearing,
      id: `h-${Date.now()}`
    };
    setHearings(prev => [newHearing, ...prev]);
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: `t-${Date.now()}`,
      status: 'Yapılacak'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const addChatbotLog = (msg: ChatbotLog) => {
    setChatbotLogs(prev => [...prev, msg]);
  };

  const updateChatbotSettings = (settings: any) => {
    setChatbotSettings(prev => ({ ...prev, ...settings }));
    // Also save into siteSettings to keep unified config aligned
    updateSiteSettings('ai_settings', settings);
  };

  const updateSiteSettings = async (group: keyof SiteSettings, data: any): Promise<boolean> => {
    const success = await settingsService.updateSiteSettingsGroup(group, data);
    if (success) {
      setSiteSettings(prev => {
        const updated = { ...prev };
        updated[group] = { ...(updated[group] as any), ...data };
        return updated;
      });
      // Sync legacy chatbotSettings if updating AI group
      if (group === 'ai_settings') {
        setChatbotSettings(prev => ({
          ...prev,
          welcomeMessage: data.welcomeMessage !== undefined ? data.welcomeMessage : prev.welcomeMessage,
          systemPrompt: data.disclaimerText !== undefined ? data.disclaimerText : prev.systemPrompt,
          isActive: data.isActive !== undefined ? data.isActive : prev.isActive,
          modelName: 'Gemini'
        }));
      }
    }
    return success;
  };

  const resetSiteSettings = async (group: keyof SiteSettings): Promise<boolean> => {
    const defaults = settingsService.getDefaultSettings();
    const success = await settingsService.updateSiteSettingsGroup(group, defaults[group]);
    if (success) {
      setSiteSettings(prev => {
        const updated = { ...prev };
        updated[group] = defaults[group] as any;
        return updated;
      });
      if (group === 'ai_settings') {
        const aiDefaults = defaults.ai_settings;
        setChatbotSettings({
          welcomeMessage: aiDefaults.welcomeMessage,
          systemPrompt: aiDefaults.disclaimerText,
          isActive: aiDefaults.isActive,
          modelName: 'Gemini'
        });
      }
    }
    return success;
  };

  // i18n dynamic selector
  const t = (key: string): string => {
    const dict = translations[language];
    return dict[key as keyof typeof dict] || key;
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      language,
      toggleLanguage,
      currentRoute,
      navigateTo,
      toasts,
      showToast,
      removeToast,
      cookieConsent,
      saveCookieConsent,
      isCookieModalOpen,
      setIsCookieModalOpen,
      blogPosts,
      precedentDecisions,
      clients,
      caseFiles,
      appointments,
      hearings,
      tasks,
      chatbotLogs,
      isLoadingContents,
      isLoadingDecisions,
      contentsError,
      decisionsError,
      refetchContents: fetchContents,
      refetchDecisions: fetchDecisions,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addPrecedentDecision,
      updatePrecedentDecision,
      deletePrecedentDecision,
      addClient,
      addCaseFile,
      updateCaseStatus,
      addAppointment,
      updateAppointmentStatus,
      addHearing,
      addTask,
      updateTaskStatus,
      addChatbotLog,
      chatbotSettings,
      updateChatbotSettings,
      siteSettings,
      updateSiteSettings,
      resetSiteSettings,
      selectedPost,
      setSelectedPost,
      selectedCategory,
      setSelectedCategory,
      contentSlug,
      setContentSlug,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
