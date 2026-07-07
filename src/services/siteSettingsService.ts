import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface SiteSettings {
  general_settings: any;
  contact_settings: any;
  blog_settings: any;
  legal_content_settings: any;
  appointment_settings: any;
  ai_settings: any;
  notification_settings: any;
  media_settings: any;
  legal_pages_settings: any;
  footer_settings: any;
  homepage_settings: any;
  developer_settings: any;
}

export function getDefaultSettings(): SiteSettings {
  return {
    general_settings: {
      siteName: 'Avukat Eren Akarsu',
      browserTitle: 'Av. Eren Akarsu - Premium LegalTech ve Hukuk Danışmanlığı',
      metaDescription: 'Yapay zekâ destekli hukuki danışmanlık, emsal karar arama motoru ve online randevu merkezi.',
      logoUrl: '',
      monogramUrl: '',
      faviconUrl: '',
      copyrightText: '© 2026 Av. Eren Akarsu. Tüm Hakları Saklıdır.',
      openingAnimation: true,
      maintenanceMode: false,
      maintenanceTitle: 'Bakım Çalışması',
      maintenanceMessage: 'Sitemiz şu anda güncellenmektedir. Lütfen daha sonra tekrar deneyiniz.',
      maintenanceEstimatedDate: '2026-07-15',
      defaultLanguage: 'tr',
      defaultTheme: 'dark',
      timezone: 'Europe/Istanbul',
      dateFormat: 'DD.MM.YYYY',
      timeFormat: '24h'
    },
    contact_settings: {
      phone: '+90 555 123 4567',
      email: 'eren@akarsu.av.tr',
      address: 'Adalet Plaza Kat: 4, Daire: 12, Şişli / İstanbul',
      googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.828822055627!2d28.9856!3d41.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAzJzM2LjAiTiAyOMKwNTknMDguMSJF!5e0!3m2!1str!2str!4v1620000000000',
      googleMapsLink: 'https://maps.google.com/?q=41.0600,28.9856',
      whatsappNumber: '905551234567',
      workingHours: 'Hafta İçi: 09:00 - 18:00',
      instagram: 'https://instagram.com/av.erenakarsu',
      linkedin: 'https://linkedin.com/in/erenakarsu',
      github: 'https://github.com/erenakarsu',
      twitter: 'https://x.com/erenakarsu',
      youtube: 'https://youtube.com/erenakarsu',
      tiktok: '',
      baroNo: '341234',
      taxOffice: 'Şişli Vergi Dairesi',
      taxNumber: '1234567890',
      iban: 'TR90 0006 2000 0001 2345 6789 01',
      bankName: 'Türkiye İş Bankası',
      accountHolder: 'Eren Akarsu'
    },
    blog_settings: {
      title: 'Hukuki Yazılar',
      description: 'Güncel hukuki makaleler, kanun yorumları ve hukuk rehberi.',
      postsPerPageHomepage: 3,
      postsPerPageList: 6,
      defaultCoverImage: '/blog-fallback.jpg',
      featuredPostId: '',
      showViewCount: true,
      showReadingTime: true,
      showAuthor: true,
      showPublishDate: true,
      showUpdateDate: false,
      autoTableOfContents: true,
      showScrollProgress: true,
      commentsEnabled: false,
      likesEnabled: true,
      sharingEnabled: true,
      relatedPostsEnabled: true,
      excerptLength: 120,
      defaultSort: 'newest'
    },
    legal_content_settings: {
      pageTitle: 'Hukuki Arşiv',
      pageDescription: 'Hukuk büromuz tarafından hazırlanan dilekçeler, kararlar ve mevzuat analizleri.',
      searchEnabled: true,
      filterEnabled: true,
      tagSystemEnabled: true,
      categorySystemEnabled: true,
      showViewCount: true,
      showLikes: true,
      showPublishDate: true,
      types: {
        article: { active: true, showInHeader: true, showInFooter: true, showOnHome: true, showOnList: true, limit: 6, sortPriority: 1 },
        template: { active: true, showInHeader: true, showInFooter: true, showOnHome: false, showOnList: true, limit: 10, sortPriority: 2 },
        decision: { active: true, showInHeader: true, showInFooter: true, showOnHome: true, showOnList: true, limit: 5, sortPriority: 3 },
        analysis: { active: true, showInHeader: false, showInFooter: false, showOnHome: false, showOnList: true, limit: 5, sortPriority: 4 },
        note: { active: true, showInHeader: false, showInFooter: false, showOnHome: false, showOnList: true, limit: 5, sortPriority: 5 }
      }
    },
    appointment_settings: {
      isActive: true,
      workingDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
      startTime: '09:00',
      endTime: '18:00',
      lunchBreakStart: '12:30',
      lunchBreakEnd: '13:30',
      duration: 30,
      bufferTime: 10,
      onlineFee: 2500,
      phoneFee: 1500,
      faceToFaceFee: 3000,
      weekendAvailable: false,
      publicHolidaysClosed: true,
      minBookingNotice: '1-day',
      maxBookingDays: 30,
      pastHoursDisabled: true,
      showRemainingHours: true,
      approvalMode: 'auto',
      appointmentTypes: ['Online', 'Telefon', 'Yüz Yüze'],
      descriptionText: 'Randevu talebiniz alındıktan sonra e-posta ile onay ve detaylar iletilecektir.',
      kvkkText: 'Randevu oluşturarak Kullanım Koşulları ve KVKK Aydınlatma Metnini okuduğumu ve onayladığımı beyan ederim.',
      successMessage: 'Randevu Talebiniz Başarıyla Kaydedilmiştir.'
    },
    ai_settings: {
      isActive: true,
      chatbotName: 'Akarsu AI Asistanı',
      welcomeMessage: 'Merhaba! Ben Avukat Eren Akarsu Yapay Zekâ Asistanıyım. Size nasıl yardımcı olabilirim?',
      disclaimerText: 'Bu asistan genel hukuki bilgi sağlamak amacıyla kurulmuştur. Resmi bir hukuki danışmanlık veya avukatlık hizmeti yerine geçmez.',
      modelProvider: 'gemini',
      apiKey: '',
      apiUrl: '',
      temperature: 0.3,
      maxTokens: 512,
      systemPrompt: 'Sen Avukat Eren Akarsu Hukuk Bürosu için geliştirilmiş premium bir yapay zekâ asistanısın. Görevin, gelen sorulara hukuki terminolojiye uygun, profesyonel, güven verici ve anlaşılır cevaplar vermektir.',
      responseStyle: 'balanced',
      allowedTopics: 'Sözleşmeler, İş Hukuku, Ceza Hukuku, Miras, İcra İflas, Şirketler Hukuku, Randevu Almak',
      blockedTopics: 'Siyaset, Yasa Dışı Faaliyetler, Diğer Avukatların Eleştirilmesi',
      medicalLegalDisclaimer: 'Burada verilen yanıtlar nihai hukuki tavsiye değildir. Somut olayın incelenmesi gerekir.',
      saveHistory: true,
      maxMessages: 10,
      activeOutsideWorkingHours: true,
      quickActions: ['Randevu Al', 'Hukuki Yazılar', 'İletişim Bilgileri']
    },
    notification_settings: {
      toastEnabled: true,
      toastPosition: 'bottom-right',
      toastDuration: 5000,
      soundEnabled: true,
      adminNotificationsEnabled: true,
      notifyNewAppointment: true,
      notifyNewBlog: true,
      notifyNewPayment: true,
      notifyNewMessage: true,
      notifyNewComment: false,
      notifyNewSubscription: true,
      showErrors: true,
      showSuccess: true,
      showWarnings: true,
      showInfo: true
    },
    media_settings: {
      maxFileSize: 5242880, // 5MB
      allowedImageFormats: ['jpg', 'png', 'webp', 'svg'],
      allowedDocFormats: ['pdf', 'doc', 'docx', 'udf'],
      convertToWebp: true,
      autoResize: true,
      maxWidth: 1920,
      maxHeight: 1080,
      createThumbnails: true,
      lazyLoading: true,
      defaultCover: '/blog-fallback.jpg',
      altTextRequired: true,
      descriptionRequired: false,
      aspectRatio: '16-9',
      dragDropEnabled: true
    },
    legal_pages_settings: {
      kvkk: {
        title: 'KVKK Aydınlatma Metni',
        slug: 'kvkk-aydinlatma-metni',
        content: '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca...',
        status: 'published',
        updatedAt: '2026-07-08'
      },
      cerez: {
        title: 'Çerez Politikası',
        slug: 'cerez-politikasi',
        content: 'Bu web sitesinde kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanılmaktadır...',
        status: 'published',
        updatedAt: '2026-07-08'
      },
      kullanim: {
        title: 'Kullanım Koşulları',
        slug: 'kullanim-kosullari',
        content: 'Web sitemizi ziyaret ederek bu kullanım koşullarını kabul etmiş sayılırsınız...',
        status: 'published',
        updatedAt: '2026-07-08'
      }
    },
    footer_settings: {
      isActive: true,
      showMonogram: true,
      brandName: 'Av. Eren Akarsu',
      showSocialIcons: true,
      copyrightText: '© 2026 Av. Eren Akarsu. Tüm Hakları Saklıdır.',
      lineAnimation: true,
      animationDensity: 'medium',
      showContactInfo: true,
      showSocials: true,
      columns: [
        {
          title: 'Hukuk Büromuz',
          active: true,
          links: [
            { label: 'Hakkımızda', url: '#about' },
            { label: 'Faaliyet Alanları', url: '#practice' },
            { label: 'İletişim', url: '#contact' }
          ]
        },
        {
          title: 'Hizmetlerimiz',
          active: true,
          links: [
            { label: 'Online Randevu', url: '#appointment' },
            { label: 'Blog & Makaleler', url: 'knowledge-hub' },
            { label: 'Hukuki Araçlar', url: 'hukuki-hesaplama-araclari' }
          ]
        }
      ]
    },
    homepage_settings: {
      hero: { active: true, order: 1, heroTitle: 'Güvenilir, Hızlı ve Çözüm Odaklı Hukuki Danışmanlık', heroDescription: 'Yapay zekâ destekli altyapımızla emsal kararları saniyeler içinde analiz edin, dilediğiniz yerden online randevunuzu oluşturun.', cta1Text: 'Online Randevu', cta1Link: '#appointment', cta2Text: 'İncele', cta2Link: '#practice', carouselActive: false },
      about: { active: true, order: 2, title: 'Hakkımda', desc: 'Av. Eren Akarsu, müvekkillerine şeffaf ve teknoloji odaklı çözümler sunmaktadır.' },
      practice: { active: true, order: 3, title: 'Uzmanlık Alanları' },
      blog: { active: true, order: 4, title: 'Güncel Yazılar', count: 3 },
      appointment: { active: true, order: 5, title: 'Online Randevu' },
      contact: { active: true, order: 6, title: 'İletişim' }
    },
    developer_settings: {
      debugMode: false,
      consoleLogs: true,
      mockDataFallback: true,
      buildMode: 'production',
      appEnv: 'production',
      supabaseUrl: 'https://ea-monogram-supabase.co',
      supabaseKey: 'sb_publishable_key_placeholder'
    }
  };
}

/**
 * Fetch settings row. Always returns a single object containing all config groups.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults = getDefaultSettings();
  if (!isSupabaseConfigured()) {
    return getLocalSettingsFallback(defaults);
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle();

    if (error) {
      console.warn('[siteSettingsService] getSiteSettings error, falling back to LocalStorage/Default:', error);
      return getLocalSettingsFallback(defaults);
    }

    if (!data) {
      // Create default settings if empty
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({
          id: '00000000-0000-0000-0000-000000000001',
          ...defaults
        });
      if (insertError) {
        console.error('[siteSettingsService] Error creating defaults in DB:', insertError);
      }
      return defaults;
    }

    return {
      general_settings: data.general_settings || defaults.general_settings,
      contact_settings: data.contact_settings || defaults.contact_settings,
      blog_settings: data.blog_settings || defaults.blog_settings,
      legal_content_settings: data.legal_content_settings || defaults.legal_content_settings,
      appointment_settings: data.appointment_settings || defaults.appointment_settings,
      ai_settings: data.ai_settings || defaults.ai_settings,
      notification_settings: data.notification_settings || defaults.notification_settings,
      media_settings: data.media_settings || defaults.media_settings,
      legal_pages_settings: data.legal_pages_settings || defaults.legal_pages_settings,
      footer_settings: data.footer_settings || defaults.footer_settings,
      homepage_settings: data.homepage_settings || defaults.homepage_settings,
      developer_settings: data.developer_settings || defaults.developer_settings
    };
  } catch (err) {
    console.error('[siteSettingsService] Error in getSiteSettings:', err);
    return getLocalSettingsFallback(defaults);
  }
}

/**
 * Update a specific setting group inside JSONB columns.
 */
export async function updateSiteSettingsGroup(group: keyof SiteSettings, data: any): Promise<boolean> {
  // Update local storage first
  const localData = localStorage.getItem('site_settings');
  const parsed = localData ? JSON.parse(localData) : getDefaultSettings();
  parsed[group] = { ...parsed[group], ...data };
  localStorage.setItem('site_settings', JSON.stringify(parsed));

  if (!isSupabaseConfigured()) return true;

  try {
    const updatePayload: any = {};
    updatePayload[group] = parsed[group];

    const { error } = await supabase
      .from('site_settings')
      .update(updatePayload)
      .eq('id', '00000000-0000-0000-0000-000000000001');

    if (error) {
      console.error(`[siteSettingsService] updateSiteSettingsGroup error for ${group}:`, error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error(`[siteSettingsService] Exception in updateSiteSettingsGroup for ${group}:`, err);
    return false;
  }
}

/**
 * Helper to fetch settings from localStorage or defaults.
 */
function getLocalSettingsFallback(defaults: SiteSettings): SiteSettings {
  try {
    const local = localStorage.getItem('site_settings');
    if (local) {
      const parsed = JSON.parse(local);
      return {
        general_settings: { ...defaults.general_settings, ...parsed.general_settings },
        contact_settings: { ...defaults.contact_settings, ...parsed.contact_settings },
        blog_settings: { ...defaults.blog_settings, ...parsed.blog_settings },
        legal_content_settings: { ...defaults.legal_content_settings, ...parsed.legal_content_settings },
        appointment_settings: { ...defaults.appointment_settings, ...parsed.appointment_settings },
        ai_settings: { ...defaults.ai_settings, ...parsed.ai_settings },
        notification_settings: { ...defaults.notification_settings, ...parsed.notification_settings },
        media_settings: { ...defaults.media_settings, ...parsed.media_settings },
        legal_pages_settings: { ...defaults.legal_pages_settings, ...parsed.legal_pages_settings },
        footer_settings: { ...defaults.footer_settings, ...parsed.footer_settings },
        homepage_settings: { ...defaults.homepage_settings, ...parsed.homepage_settings },
        developer_settings: { ...defaults.developer_settings, ...parsed.developer_settings }
      };
    }
  } catch (e) {
    console.error('[siteSettingsService] fallback local read error:', e);
  }
  return defaults;
}

// ============================================================
// Developer Mode Health Check & Connection Testing Utilities
// ============================================================

export async function testDatabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase URL/Key config missing in local environment.' };
  }
  try {
    const { error } = await supabase.from('contents').select('id').limit(1);
    if (error) throw error;
    return { success: true, message: 'Supabase Database connected successfully. Read/write active.' };
  } catch (e: any) {
    return { success: false, message: `Database error: ${e.message || 'Unknown network error'}` };
  }
}

export async function testStorageConnection(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'Supabase URL/Key config missing in local environment.' };
  }
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    return { success: true, message: `Storage active. Buckets found: ${data.map(b => b.name).join(', ')}` };
  } catch (e: any) {
    return { success: false, message: `Storage error: ${e.message || 'Unknown network error'}` };
  }
}

export async function testEnvironmentVariables(): Promise<{ success: boolean; message: string }> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { success: false, message: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env variables are not loaded.' };
  }
  return { success: true, message: 'All VITE_* environment configuration tokens verified successfully.' };
}
