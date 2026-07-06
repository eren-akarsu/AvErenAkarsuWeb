import React, { createContext, useContext, useState, useEffect } from 'react';

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
  currentRoute: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani';
  navigateTo: (route: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani') => void;
  
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
  
  // Dynamic Page states
  selectedPost: BlogPost | null;
  setSelectedPost: (post: BlogPost | null) => void;
  
  // Translation function
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Realistic initial blog posts in Turkish (no Lorem Ipsum)
const initialBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Kıdem Tazminatı Hesaplama Rehberi 2026',
    slug: 'kidem-tazminati-hesaplama-rehberi-2026',
    excerpt: 'Yeni dönem asgari ücret artışları ve Yargıtay’ın en son emsal kararları ışığında kıdem tazminatı tavanı ve hesaplama detayları.',
    content: 'İş Hukuku uygulamasında en sık karşılaşılan uyuşmazlıkların başında kıdem tazminatı hesaplamaları gelmektedir. Kıdem tazminatına hak kazanabilmek için işçinin en az 1 tam yıl çalışmış olması ve iş sözleşmesinin kanunda belirtilen haklı nedenlerle sona ermiş olması gerekir.\n\nKıdem tazminatının hesabında işçiye ödenen brüt ücrete ek olarak süreklilik arz eden ayni ve nakdi yardımlar (yemek, yol, ikramiye vb.) da dikkate alınır. 2026 yılı tavan tutarları ve güncel Yargıtay içtihatları doğrultusunda giydirilmiş brüt ücret üzerinden hesaplama yapılması önem taşımaktadır.\n\nÖnemli Noktalar:\n- Son brüt ücret esas alınır.\n- Her tam yıl için 30 günlük brüt ücret ödenir.\n- Kıdem tazminatı tavanı aşılamaz.\n- Yalnızca damga vergisi kesintisi yapılır.',
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
    content: 'İstinaf başvurusu, ilk derece mahkemesi kararlarının hem hukuki hem de fiili açıdan denetlenmesini sağlayan önemli bir kanun yoludur. Ceza yargılamasında istinaf süresi gerekçeli kararın tebliğinden itibaren başlar. Dilekçede kararın hangi yönlerden hukuka aykırı olduğu, delillerin değerlendirilmesindeki hatalar açıkça belirtilmelidir.\n\nDilekçe Yapısı:\n1. Başlık (İlgili Bölge Adliye Mahkemesine Gönderilmek Üzere İlk Derece Mahkemesine)\n2. Dosya Numarası ve Tarafların Bilgileri\n3. Kararın Özeti ve Tebliğ Tarihi\n4. İstinaf Nedenleri ve Ayrıntılı Açıklamalar\n5. Talep ve Sonuç (Bozma veya Yeniden Yargılama Talebi)\n\nÖrnek Şablon dosyasını indirerek kendi davanıza göre uyarlayabilirsiniz.',
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
    content: 'Teknolojinin gelişmesi ile birlikte ceza hukuku alanında bilişim suçları ve bilişim sistemleri vasıtasıyla işlenen suçlarda ciddi bir artış yaşanmaktadır. TCK md. 158/1-f uyarınca dolandırıcılık suçunun bilişim sistemlerinin sağladığı kolaylıklardan faydalanarak işlenmesi, suçun nitelikli hali olarak kabul edilmiş ve ağır yaptırımlara bağlanmıştır.\n\nSuçun Oluşma Şartları:\n- Failin hileli davranışlarda bulunması ve bu davranışların mağduru aldatabilecek nitelikte olması.\n- Hileli işlemlerin bilişim sistemleri (internet siteleri, sosyal medya, banka entegrasyonları vb.) kullanılarak gerçekleştirilmesi.\n- Mağdurun veya bir başkasının zararına olarak failin kendisine veya bir başkasına haksız bir yarar sağlaması.\n\nSiber güvenlik tedbirleri ve hukuki savunma stratejileri için makalemizi inceleyebilirsiniz.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'Değerlendirmeler',
    readingTime: '8 Dakika',
    viewCount: 890,
    likeCount: 57,
    publishedAt: '2026-07-01',
    tags: ['Bilişim Hukuku', 'TCK 158', 'Nitelikli Dolandırıcılık']
  }
];

const initialPrecedentDecisions: PrecedentDecision[] = [
  {
    id: 'dec-1',
    title: 'Kıdem Tazminatında Yol ve Yemek Yardımı Dahiliyeti',
    court: 'Yargıtay Hukuk Genel Kurulu',
    esas: '2025/12-344 Esas',
    karar: '2026/89 Karar',
    decisionDate: '2026-02-15',
    category: 'İş Hukuku',
    tags: ['İş Hukuku', 'Kıdem Tazminatı', 'Giydirilmiş Ücret'],
    summary: 'İşçi tarafından haklı nedenle yapılan fesihte kıdem tazminatı giydirilmiş brüt ücretinin hesabında süreklilik arz eden ayni ve nakdi yardımların (yol ve yemek yardımı) tam olarak dahil edilmesi gerektiği kararı.',
    fullText: 'İLK DERECE MAHKEMESİ KARARI:\nDavacı vekili, müvekkilinin davalı iş yerinde çalışırken iş akdinin haklı nedenle feshedildiğini, kıdem tazminatının eksik hesaplandığını ileri sürerek fark kıdem tazminatı alacağının tahsilini talep etmiştir. Mahkemece yol ve yemek yardımlarının giydirilmiş brüt ücrete dahil edilmediği gerekçesiyle davanın kısmen kabulüne karar verilmiştir.\n\nYARGITAY HUKUK GENEL KURULU DEĞERLENDİRMESİ:\nKıdem tazminatının hesabında işçiye ödenen brüt ücrete ek olarak süreklilik gösteren para veya para ile ölçülmesi mümkün menfaatlerin (yemek, yol, ikramiye vb.) de dikkate alınması İş Kanunu’nun emredici hükümlerindendir. Dosya kapsamı uyarınca davalı işveren tarafından davacıya nakdi yol yardımı ile fiili yemek sağlandığı sabittir. Yapılan hesaplamada bu kalemlerin giydirilmiş ücrete eklenmesi zorunludur. İlk derece mahkemesinin bu yöndeki kararı yerinde olup, direnme kararının bozulması gerekmiştir.',
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
    summary: 'Sosyal medya paylaşımları nedeniyle yapılan soruşturmalarda bilişim sistemleri üzerinde yapılan arama ve el koyma işlemlerinin Anayasa 20. maddesi kapsamındaki özel hayatın gizliliği ve hak ihlali değerlendirmesi.',
    fullText: 'BAŞVURUNUN KONUSU:\nBaşvurucu, sosyal medya paylaşımı gerekçe gösterilerek siber suçlar şube müdürlüğünce cep telefonu ve dijital materyallerine el konulduğunu, hakim kararı olmaksızın yapılan inceleme ile özel hayatın gizliliğinin ihlal edildiğini iddia etmiştir.\n\nANAYASA MAHKEMESİ KARARI:\nCMK md. 134 uyarınca bilgisayarlarda, bilgisayar programlarında ve kütüklerinde arama, kopyalama ve el koyma işlemleri ancak hakim kararı ile yapılabilir. Gecikmesinde sakınca bulunan hal olsa dahi savcılık emriyle dijital materyallerin şifresinin kırılarak içeriklerinin incelenmesi hak ihlali teşkil eder. Anayasa md. 20 ile koruma altına alınan özel hayatın gizliliği hakkının ihlal edildiğine karar verilmiş ve dosya yeniden yargılama için mahkemesine gönderilmiştir.',
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
    summary: 'Kripto varlık cüzdanı şifresinin izinsiz ele geçirilerek varlıkların başka cüzdana aktarılması eyleminin TCK md. 142/2-e uyarınca bilişim sistemlerinin kullanılması suretiyle nitelikli hırsızlık suçunu oluşturduğu kararı.',
    fullText: 'YARGITAY 8. CEZA DAİRESİ KARARI:\nSanığın, katılanın rızası dışında elde ettiği özel anahtar (private key) ve şifreleri kullanmak suretiyle katılanın kripto varlık cüzdanına erişim sağladığı ve burada bulunan dijital varlıkları kendi kontrolündeki soğuk cüzdan hesaplarına aktardığı tespit edilmiştir. Mahkemece eylemin TCK 244. maddesindeki sistemi engelleme bozma verileri yok etme kapsamında kaldığı gerekçesiyle hüküm kurulmuş ise de; kripto varlıklerin ekonomik bir değer taşıdığı, bu nedenle bilişim sistemi aracılığıyla gerçekleştirilen bu transfer eyleminin sistemi bozmaktan ziyade mal edinme amacı taşıdığı ve dolayısıyla TCK md. 142/2-e kapsamında bilişim sistemlerinin kullanılması suretiyle nitelikli hırsızlık suçunu oluşturduğu gözetilerek hükmün bozulmasına oy birliğiyle karar verilmiştir.',
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
    summary: 'Yapay zekâ algoritmaları tarafından insan müdahalesi olmaksızın üretilen görsel ve metinsel çıktıların 5846 sayılı FSEK kapsamında "eser" niteliği taşımayacağı ve telif korumasından yararlanamayacağı kararı.',
    fullText: 'YARGITAY 11. HUKUK DAİRESİ İNCELEMESİ:\nDavacı, tasarladığı yapay zekâ programına yazdırdığı görsel kodların davalı tarafından izinsiz kullanıldığını ileri sürerek telif ihlali tazminatı talep etmiştir. İlk derece mahkemesince davanın kabulüne karar verilmiş, karar davalı tarafından temyiz edilmiştir.\n\nİstikrarlı içtihatlar ve Fikir ve Sanat Eserleri Kanunu md. 1 uyarınca bir ürünün "eser" olarak nitelendirilebilmesi için sahibinin hususiyetini taşıması ve insan yaratıcılığının ürünü olması şarttır. Tamamen yapay zekâ komutları ile insan eli değmeden üretilen tasarımların bağımsız bir eser sahibi bulunmadığından telif korumasına konu edilemeyeceği, davacının ancak yapay zekâyı besleyen kendi özgün kodları üzerinde hak iddia edebileceği dikkate alınarak davanın reddi gerekirken kabulü hatalı bulunmuştur.',
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
    summary: 'Kira sözleşmesinin imzalanması sırasında boş olarak verilen ve sonradan doldurulan tahliye taahhütnamelerinin, kiracının boş kağıda imza atmakla doğacak hukuki sonuçları peşinen kabullenmiş sayılacağı gerekçesiyle geçerli olduğu kararı.',
    fullText: 'YARGITAY 6. HUKUK DAİRESİ DEĞERLENDİRMESİ:\nDavacı alacaklı, davalı kiracının yazılı tahliye taahhüdüne dayanarak icra takibi başlatmış, kiracı ise taahhütnamenin kira sözleşmesiyle birlikte boş olarak imza ettirildiğini, üzerinin sonradan doldurulduğunu iddia ederek takibe itiraz etmiştir.\n\nBeyaza imza (boş kağıda imza) atan kimse, bu davranışının hukuki sonuçlarına katlanmak zorundadır. Kiracı boş kağıda imza atarak kiralayana bu belgenin üzerini dilediği gibi doldurma yetkisi vermiş sayılır. Taahhütnamedeki imzanın davalı kiracının eli ürünü olduğu tespit edildiğine göre, tanzim ve tahliye tarihlerinin sonradan doldurulmuş olması taahhütnamenin geçerliliğini etkilemez. Mahkemenin davanın reddine dair kararı usul ve yasaya aykırı olup bozulması gerekmiştir.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 5,
    showOnHome: true,
    showOnLegalDocs: true
  }
];

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

const initialBlogPostsEn: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Severance Pay Calculation Guide 2026',
    slug: 'severance-pay-calculation-guide-2026',
    excerpt: 'Details on severance pay ceilings, Yargıtay\'s latest precedent rulings, and calculations in light of the new minimum wage adjustments.',
    content: 'In Labor Law practice, severance pay calculations are among the most common legal disputes. To qualify for severance pay, an employee must have completed at least 1 full year of service and the employment contract must have been terminated due to one of the just causes specified in the law.\n\nIn addition to the gross salary paid, regular benefits (meals, transportation, bonuses, etc.) are also considered. In light of 2026 ceilings and Yargıtay precedents, calculations must be made over the adjusted gross salary.\n\nKey Points:\n- The final gross salary is taken as base.\n- 30 days of gross pay is paid for each full year of service.\n- The severance pay ceiling cannot be exceeded.\n- Only stamp tax deduction is applicable.',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    category: 'Makaleler',
    readingTime: '6 Mins',
    viewCount: 1240,
    likeCount: 94,
    publishedAt: '2026-06-15',
    tags: ['Labor Law', 'Severance Pay', 'Yargıtay Precedents']
  },
  {
    id: 'post-2',
    title: 'Model Appeal Petition for High Criminal Court',
    slug: 'model-appeal-petition-for-high-criminal-court',
    excerpt: 'Key procedural and substantive points to consider when appealing decisions of High Criminal Courts, including a downloadable template.',
    content: 'An appeal (istinaf) is an important legal remedy that ensures the review of first-instance court decisions in terms of both law and facts. In criminal proceedings, the appeal period starts from the notification of the reasoned decision. The petition must clearly state in which aspects the decision is unlawful and show errors in the evaluation of evidence.\n\nPetition Structure:\n1. Title (To the Regional Appellate Court, to be submitted via the First Instance Court)\n2. File Number and Parties Information\n3. Summary of Decision and Notification Date\n4. Grounds of Appeal and Detailed Explanations\n5. Request and Conclusion (Demand for reversal or retrial)\n\nYou can download the template file (.docx) and adapt it to your case.',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    category: 'Dilekçeler',
    readingTime: 'Template',
    viewCount: 2310,
    likeCount: 182,
    publishedAt: '2026-06-20',
    tags: ['Criminal Law', 'Appeal Petition', 'Template']
  },
  {
    id: 'post-3',
    title: 'Cyber Systems Fraud Crime Analysis',
    slug: 'cyber-systems-fraud-crime-analysis',
    excerpt: 'Elements of the crime of qualified fraud committed via the use of information systems under Article 158/1-f of the Turkish Penal Code.',
    content: 'With the advancement of technology, cyber crimes and offenses committed through information systems have increased significantly. Under Art. 158/1-f of the Turkish Penal Code, committing fraud by utilizing the convenience provided by information systems is considered a qualified form of the offense, carrying severe penalties.\n\nRequired Elements:\n- The perpetrator must perform fraudulent acts that are deceptive in nature.\n- Fraudulent acts must be executed utilizing information systems (websites, social media, banking integrations, etc.).\n- The perpetrator must obtain an unfair advantage to the detriment of the victim or another person.\n\nExplore our article for siber security measures and legal defense strategies.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'Değerlendirmeler',
    readingTime: '8 Mins',
    viewCount: 890,
    likeCount: 57,
    publishedAt: '2026-07-01',
    tags: ['Cyber Law', 'TPC 158', 'Qualified Fraud']
  }
];

const initialPrecedentDecisionsEn: PrecedentDecision[] = [
  {
    id: 'dec-1',
    title: 'Inclusion of Food and Transport Allowances in Severance Pay',
    court: 'Court of Cassation General Assembly of Civil Chambers',
    esas: '2025/12-344 Merit',
    karar: '2026/89 Decision',
    decisionDate: '2026-02-15',
    category: 'Labor Law',
    tags: ['Labor Law', 'Severance Pay', 'Adjusted Wage'],
    summary: 'Ruling that regular in-kind and cash benefits (meal and transportation allowances) must be fully included in the calculation of the adjusted gross salary for severance pay in terminations made by the employee for just cause.',
    fullText: 'FIRST INSTANCE COURT DECISION:\nThe plaintiff\'s counsel claimed that their client\'s employment contract was terminated for just cause, but the severance pay was calculated incorrectly, requesting the collection of the missing severance pay. The court decided to partially accept the case on the grounds that road and food allowances were not included in the adjusted gross wage.\n\nCOURT OF CASSATION CIVIL GENERAL ASSEMBLY EVALUATION:\nIncluding regular cash or in-kind benefits (food, transport, bonuses, etc.) in the calculation of the worker\'s severance pay in addition to the gross salary is a mandatory provision of the Labor Law. Based on the file content, it is established that the defendant employer provided cash transport support and physical meals to the plaintiff. Adding these items to the adjusted wage is compulsory in calculations. The decision of the first instance court in this direction is appropriate, and the opposition decision must be reversed.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 1,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-2',
    title: 'Search and Seizure on Digital Materials Without Judicial Warrant',
    court: 'Constitutional Court General Assembly',
    esas: '2024/4512 Application',
    karar: '2025/112 Decision',
    decisionDate: '2025-11-20',
    category: 'Cyber Law',
    tags: ['Cyber Law', 'Seizure', 'Constitutional Court'],
    summary: 'Evaluation of search and seizure operations on information systems during social media investigations, regarding the privacy of private life under Article 20 of the Constitution and rights violation claims.',
    fullText: 'SUBJECT OF THE APPLICATION:\nThe applicant claimed that their cell phone and digital materials were seized by the cyber crimes branch on the grounds of a social media post, and that the review conducted without a judge\'s decision violated the privacy of private life.\n\nCONSTITUTIONAL COURT DECISION:\nAccording to Art. 134 of the CMK (Criminal Procedure Code), search, copying, and seizure operations in computers, computer programs, and computer files can only be done by a judge\'s decision. Even if there is urgency, checking the contents by breaking the passwords of digital materials on the prosecutor\'s order constitutes a violation of rights. It was decided that the right to privacy of private life protected by Art. 20 of the Constitution was violated, and the file was sent to the court for a retrial.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 2,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-3',
    title: 'Qualified Theft in Unauthorized Cryptocurrency Transfers',
    court: 'Court of Cassation 8th Criminal Chamber',
    esas: '2024/1145 Merit',
    karar: '2025/322 Decision',
    decisionDate: '2025-09-12',
    category: 'Cyber Criminal',
    tags: ['Cryptocurrency', 'Qualified Theft', 'Cyber Crimes'],
    summary: 'Ruling that accessing a crypto wallet by unlawfully acquiring its private key and password, and transferring digital assets to another wallet, constitutes qualified theft via information systems under TPC Art. 142/2-e.',
    fullText: 'COURT OF CASSATION 8TH CRIMINAL CHAMBER RULING:\nIt was established that the defendant accessed the complainant\'s cryptocurrency wallet by using private keys and passwords obtained without consent, transferring the digital assets to cold wallets under his control. The lower court ruled under Art. 244 (preventing/disrupting systems), but cryptocurrency possesses economic value, making this transfer an act of unlawful acquisition rather than system disruption. Thus, it constitutes qualified theft via information systems under TPC Art. 142/2-e. The judgment is unanimously reversed.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 3,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-4',
    title: 'Authorship and Copyright on AI-Generated Outputs',
    court: 'Court of Cassation 11th Civil Chamber',
    esas: '2025/445 Merit',
    karar: '2026/18 Decision',
    decisionDate: '2026-01-20',
    category: 'IP Law',
    tags: ['Artificial Intelligence', 'Intellectual Property', 'Copyright'],
    summary: 'Ruling that visual and textual outputs generated entirely by AI algorithms without human intervention do not qualify as "works" under Copyright Law No. 5846 and cannot benefit from copyright protection.',
    fullText: 'COURT OF CASSATION 11TH CIVIL CHAMBER EVALUATION:\nThe plaintiff claimed copyright infringement, alleging unauthorized use of visual assets generated by an AI program he designed. The first instance court accepted the case, and the defendant appealed. Under Art. 1 of Law No. 5846, a product must carry the author\'s unique characteristics and be a result of human creativity to qualify as a "work". Designs created entirely by AI commands without human touch lack an author and cannot be protected by copyright. The plaintiff can only claim rights on his original software code feeding the AI. The judgment is reversed.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 4,
    showOnHome: true,
    showOnLegalDocs: true
  },
  {
    id: 'dec-5',
    title: 'Validity of Eviction Commitments Signed in Blank',
    court: 'Court of Cassation 6th Civil Chamber',
    esas: '2024/991 Merit',
    karar: '2025/41 Decision',
    decisionDate: '2025-05-18',
    category: 'Rent Law',
    tags: ['Rent Law', 'Eviction Commitment', 'Signature Objection'],
    summary: 'Ruling that eviction commitments signed in blank during contract execution and filled in later by the landlord remain legally valid, as the tenant accepts all legal consequences by signing a blank document.',
    fullText: 'COURT OF CASSATION 6TH CIVIL CHAMBER EVALUATION:\nThe landlord initiated enforcement proceedings based on a written eviction commitment. The tenant objected, claiming they were forced to sign a blank commitment alongside the lease contract, which was filled in later. A person signing a blank document must bear its legal consequences. The tenant is deemed to have authorized the landlord to fill in the document. Since the signature belongs to the tenant, filling dates later does not affect validity. The lower court\'s dismissal is reversed.',
    isFeatured: true,
    status: 'Yayında',
    sortOrder: 5,
    showOnHome: true,
    showOnLegalDocs: true
  }
];

const initialClientsEn: Client[] = [
  { id: 'c-1', fullName: 'Ahmet Yilmaz', tcIdentityNumber: '12345678901', phone: '0532 123 45 67', email: 'ahmet@gmail.com', address: 'Kadikoy, Istanbul', occupation: 'Engineer', notes: '', createdAt: '2026-05-10' },
  { id: 'c-2', fullName: 'Elif Kaya', tcIdentityNumber: '98765432109', phone: '0544 987 65 43', email: 'elif.kaya@outlook.com', address: 'Besiktas, Istanbul', occupation: 'Architect', notes: '', createdAt: '2026-06-02' },
  { id: 'c-3', fullName: 'Mustafa Demir', tcIdentityNumber: '55667788990', phone: '0505 456 78 90', email: 'mustafa@demirinsaat.com', address: 'Sisli, Istanbul', occupation: 'Businessman', notes: '', createdAt: '2026-06-25' }
];

const initialCaseFilesEn: CaseFile[] = [
  { id: 'case-1', clientId: 'c-1', clientName: 'Ahmet Yilmaz', title: 'Reinstatement Case', caseNumber: '2026/145 Esas', courtName: 'Istanbul 4th Labor Court', opposingParty: 'Technology Inc.', caseType: 'HUKUK', caseCategory: 'Labor Law', stage: 'Trial Stage', status: 'Devam Ediyor', description: 'Reinstatement and severance claims filed for unfair dismissal.' },
  { id: 'case-2', clientId: 'c-2', clientName: 'Elif Kaya', title: 'Qualified Fraud Defense', caseNumber: '2026/322 Esas', courtName: 'Istanbul 12th High Criminal Court', opposingParty: 'Public Prosecutor (Complainant H.K.)', caseType: 'CEZA', caseCategory: 'Cyber Criminal', stage: 'Decision Stage', status: 'Devam Ediyor', description: 'Criminal defense representation against charges of fraud through information systems.' },
  { id: 'case-3', clientId: 'c-3', clientName: 'Mustafa Demir', title: 'Public Defense (Police Interrogation)', caseNumber: '2026/89 Sor.', courtName: 'Besiktas District Police Dept.', opposingParty: 'State', caseType: 'CMK', caseCategory: 'Public Defense', stage: 'Investigation', status: 'Tamamlandı', description: 'Legal assistance provided as defense counsel during police interrogation.' }
];

const initialAppointmentsEn: Appointment[] = [
  { id: 'app-1', clientName: 'Selin Yurt', phone: '0533 111 22 33', email: 'selin@yurtlaw.com', appointmentDate: '2026-07-05', appointmentTime: '10:30', consultationType: 'Online', status: 'Onaylandı', notes: 'Consultancy on start-up contracts in IT law.', paymentStatus: 'Tamamlandı', paymentAmount: 2500 },
  { id: 'app-2', clientName: 'Can Ozturk', phone: '0542 222 33 44', email: 'can@ozturk.com', appointmentDate: '2026-07-06', appointmentTime: '14:00', consultationType: 'Yüz Yüze', status: 'Bekliyor', notes: 'Evaluation of rent increase rates and eviction commitment.', paymentStatus: 'Bekliyor', paymentAmount: 2000 },
  { id: 'app-3', clientName: 'Merve Aslan', phone: '0507 333 44 55', email: 'merve@aslan.net', appointmentDate: '2026-07-04', appointmentTime: '16:30', consultationType: 'Telefon', status: 'Tamamlandı', notes: 'Preliminary consultation on divorce protocol and custody rights.', paymentStatus: 'Tamamlandı', paymentAmount: 1500 }
];

const initialHearingsEn: Hearing[] = [
  { id: 'h-1', caseFileId: 'case-1', caseTitle: 'Reinstatement Case', clientName: 'Ahmet Yilmaz', courtName: 'Istanbul 4th Labor Court', hearingDate: '2026-07-08', hearingTime: '09:45', courtroom: 'Courtroom C-201', status: 'Yaklaşan', notes: 'Objections to the expert report will be submitted.' },
  { id: 'h-2', caseFileId: 'case-2', caseTitle: 'Qualified Fraud Defense', clientName: 'Elif Kaya', courtName: 'Istanbul 12th High Criminal Court', hearingDate: '2026-07-15', hearingTime: '11:30', courtroom: 'Courtroom A-104', status: 'Yaklaşan', notes: 'Final hearing. Defense on merits will be delivered.' }
];

const initialTasksEn: Task[] = [
  { id: 't-1', title: 'Draft objection to the expert report in Reinstatement case', status: 'Yapılacak', priority: 'Yüksek', dueDate: '2026-07-07' },
  { id: 't-2', title: 'Upload public defense training certificates to Bar association portal', status: 'Devam Ediyor', priority: 'Orta', dueDate: '2026-07-10' },
  { id: 't-3', title: 'Log meeting notes for client Mustafa Demir', status: 'Tamamlandı', priority: 'Düşük', dueDate: '2026-07-03' },
  { id: 't-4', title: 'Integrate rent increase formula into calculations module', status: 'Yapılacak', priority: 'Acil', dueDate: '2026-07-05' }
];

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });
  
  const [language, setLanguage] = useState<'tr' | 'en'>(() => {
    return (localStorage.getItem('language') as 'tr' | 'en') || 'tr';
  });
  
  const [currentRoute, setCurrentRoute] = useState<'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani'>(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
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

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [precedentDecisions, setPrecedentDecisions] = useState<PrecedentDecision[]>(initialPrecedentDecisions);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>(initialCaseFiles);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [hearings, setHearings] = useState<Hearing[]>(initialHearings);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [chatbotLogs, setChatbotLogs] = useState<ChatbotLog[]>([
    { sender: 'bot', text: 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?', timestamp: new Date() }
  ]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  const [chatbotSettings, setChatbotSettings] = useState({
    welcomeMessage: 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?',
    systemPrompt: 'Sen Av. Eren Akarsu platformunun yapay zekâ asistanısın. Ziyaretçilere hukuki konularda genel ön bilgi ver, kesinlikle resmi hukuki danışmanlık yapmadığını ve bu bilgilerin danışmanlık niteliği taşımadığını belirt. Ziyaretçileri iletişim formu veya randevu alma modüllerine yönlendir.',
    isActive: true,
    modelName: 'HuggingFace - Llama 3.1 8B Instruct'
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/cerez-politikasi' || hash === '#cerez-politikasi') {
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

    // Dynamically translate default items when language changes
    setBlogPosts(prev => prev.map(post => {
      const defaultPost = initialBlogPosts.find(p => p.id === post.id);
      if (defaultPost) {
        return language === 'en' ? initialBlogPostsEn.find(p => p.id === post.id) || post : defaultPost;
      }
      return post;
    }));

    setClients(prev => prev.map(c => {
      const defaultClient = initialClients.find(p => p.id === c.id);
      if (defaultClient) {
        return language === 'en' ? initialClientsEn.find(p => p.id === c.id) || c : defaultClient;
      }
      return c;
    }));

    setCaseFiles(prev => prev.map(cf => {
      const defaultCase = initialCaseFiles.find(p => p.id === cf.id);
      if (defaultCase) {
        return language === 'en' ? initialCaseFilesEn.find(p => p.id === cf.id) || cf : defaultCase;
      }
      return cf;
    }));

    setAppointments(prev => prev.map(app => {
      const defaultApp = initialAppointments.find(p => p.id === app.id);
      if (defaultApp) {
        return language === 'en' ? initialAppointmentsEn.find(p => p.id === app.id) || app : defaultApp;
      }
      return app;
    }));

    setHearings(prev => prev.map(h => {
      const defaultHearing = initialHearings.find(p => p.id === h.id);
      if (defaultHearing) {
        return language === 'en' ? initialHearingsEn.find(p => p.id === h.id) || h : defaultHearing;
      }
      return h;
    }));

    setTasks(prev => prev.map(t => {
      const defaultTask = initialTasks.find(p => p.id === t.id);
      if (defaultTask) {
        return language === 'en' ? initialTasksEn.find(p => p.id === t.id) || t : defaultTask;
      }
      return t;
    }));

    setPrecedentDecisions(prev => prev.map(dec => {
      const defaultDec = initialPrecedentDecisions.find(p => p.id === dec.id);
      if (defaultDec) {
        return language === 'en' ? initialPrecedentDecisionsEn.find(p => p.id === dec.id) || dec : defaultDec;
      }
      return dec;
    }));

    setChatbotLogs(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{
          sender: 'bot',
          text: language === 'en' 
            ? 'Hello! I am Att. Eren Akarsu AI Assistant. How can I help you with legal questions or appointments?'
            : 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?',
          timestamp: new Date()
        }];
      }
      return prev;
    });

  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'tr' ? 'en' : 'tr');
  };

  const navigateTo = (route: 'home' | 'knowledge-hub' | 'admin' | 'cerez-politikasi' | 'hukuki-hesaplama-araclari' | 'kvkk-aydinlatma-metni' | 'acik-riza-metni' | 'kullanim-kosullari' | 'sorumluluk-reddi-beyani') => {
    setCurrentRoute(route);
    
    // Sync browser address bar URL path or hash
    if (route === 'home') {
      window.history.pushState(null, '', '/');
    } else if (['cerez-politikasi', 'hukuki-hesaplama-araclari', 'kvkk-aydinlatma-metni', 'acik-riza-metni', 'kullanim-kosullari', 'sorumluluk-reddi-beyani'].includes(route)) {
      window.history.pushState(null, '', `/${route}`);
    } else {
      window.history.pushState(null, '', `#${route}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CRUD Implementations
  const addBlogPost = (post: Omit<BlogPost, 'id' | 'viewCount' | 'likeCount' | 'publishedAt'>) => {
    const newPost: BlogPost = {
      ...post,
      id: `post-${Date.now()}`,
      viewCount: 0,
      likeCount: 0,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setBlogPosts(prev => [newPost, ...prev]);
  };

  const updateBlogPost = (id: string, updatedFields: Partial<BlogPost>) => {
    setBlogPosts(prev => prev.map(post => post.id === id ? { ...post, ...updatedFields } : post));
  };

  const deleteBlogPost = (id: string) => {
    setBlogPosts(prev => prev.filter(post => post.id !== id));
  };

  const addPrecedentDecision = (dec: Omit<PrecedentDecision, 'id'>) => {
    const newDec: PrecedentDecision = {
      ...dec,
      id: `dec-${Date.now()}`
    };
    setPrecedentDecisions(prev => [...prev, newDec]);
  };

  const updatePrecedentDecision = (id: string, updatedFields: Partial<PrecedentDecision>) => {
    setPrecedentDecisions(prev => prev.map(dec => dec.id === id ? { ...dec, ...updatedFields } : dec));
  };

  const deletePrecedentDecision = (id: string) => {
    setPrecedentDecisions(prev => prev.filter(dec => dec.id !== id));
  };

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
      selectedPost,
      setSelectedPost,
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
