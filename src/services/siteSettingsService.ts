import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface SiteSettings {
  general_settings: {
    siteName: string;
    browserTitle: string;
    metaDescription: string;
    logoUrl: string;
    monogramUrl: string;
    faviconUrl: string;
    defaultLanguage: string;
    defaultTheme: string;
  };
  contact_settings: {
    phone: string;
    email: string;
    address: string;
    whatsappNumber: string;
    workingHours: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
  homepage_settings: {
    heroTitle: string;
    heroDescription: string;
    heroImages: string[];
    blogCount: number;
    decisionsCount: number;
    practiceActive: boolean;
  };
  appointment_settings: {
    workingDays: string[];
    startTime: string;
    endTime: string;
    duration: number;
    onlineFee: number;
    phoneFee: number;
    faceToFaceFee: number;
    pastHoursDisabled: boolean;
  };
  footer_settings: {
    brandName: string;
    copyrightText: string;
  };
  ai_settings: {
    isActive: boolean;
    welcomeMessage: string;
    disclaimerText: string;
  };
}

export function getDefaultSettings(): SiteSettings {
  return {
    general_settings: {
      siteName: 'Avukat Eren Akarsu',
      browserTitle: 'Av. Eren Akarsu - Premium LegalTech ve Hukuk Danışmanlığı',
      metaDescription: 'Yapay zekâ destekli hukuki danışmanlık, emsal karar arama motoru ve online randevu merkezi.',
      logoUrl: '/ea-monogram.png',
      monogramUrl: '/ea-monogram.png',
      faviconUrl: '/favicon.ico',
      defaultLanguage: 'tr',
      defaultTheme: 'dark'
    },
    contact_settings: {
      phone: '0216 755 63 34',
      email: 'erenakarsu@istanbul.av.tr',
      address: 'İstanbul, Türkiye',
      whatsappNumber: '905551234567',
      workingHours: '10:00 - 18:00',
      linkedin: 'https://www.linkedin.com/in/erenakarsu/',
      github: 'https://github.com/eren-akarsu',
      instagram: 'https://instagram.com/av.erenakarsu'
    },
    homepage_settings: {
      heroTitle: 'Hukuk ve Teknoloji Arasında Bir Köprü',
      heroDescription: 'İstanbul Okan Üniversitesi Hukuk Fakültesi ve Yazılım Mühendisliği çift anadal programı mezunu olarak, hukuki süreçleri dijital çağın dinamikleriyle yönetiyor, yenilikçi LegalTech çözümleri sunuyorum.',
      heroImages: ['/hero-carousel-1.jpg', '/hero-carousel-2.jpg', '/hero-carousel-3.jpg'],
      blogCount: 3,
      decisionsCount: 3,
      practiceActive: true
    },
    appointment_settings: {
      workingDays: ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'],
      startTime: '09:00',
      endTime: '18:00',
      duration: 30,
      onlineFee: 2500,
      phoneFee: 1500,
      faceToFaceFee: 3000,
      pastHoursDisabled: true
    },
    footer_settings: {
      brandName: 'Avukat Eren Akarsu',
      copyrightText: 'Web sitemizin tüm hakları saklıdır. Alıntı yaptığınıza ilişkin link vermek suretiyle makalelerimizi paylaşabilirsiniz.'
    },
    ai_settings: {
      isActive: true,
      welcomeMessage: 'Merhaba! Ben Av. Eren Akarsu Yapay Zekâ Asistanıyım. Size hukuki konularda veya randevu işlemlerinde nasıl yardımcı olabilirim?',
      disclaimerText: 'Sen Av. Eren Akarsu platformunun yapay zekâ asistanısın. Bu bilgiler danışmanlık niteliği taşımaz.'
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
      // Seed default settings if empty
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
      general_settings: { ...defaults.general_settings, ...data.general_settings },
      contact_settings: { ...defaults.contact_settings, ...data.contact_settings },
      homepage_settings: { ...defaults.homepage_settings, ...data.homepage_settings },
      appointment_settings: { ...defaults.appointment_settings, ...data.appointment_settings },
      footer_settings: { ...defaults.footer_settings, ...data.footer_settings },
      ai_settings: { ...defaults.ai_settings, ...data.ai_settings }
    };
  } catch (err) {
    console.error('[siteSettingsService] Error in getSiteSettings:', err);
    return getLocalSettingsFallback(defaults);
  }
}

/**
 * Update a specific setting group inside JSONB columns using upsert.
 */
export async function updateSiteSettingsGroup(group: keyof SiteSettings, data: any): Promise<boolean> {
  const localData = localStorage.getItem('site_settings');
  const parsed = localData ? JSON.parse(localData) : getDefaultSettings();
  parsed[group] = { ...parsed[group], ...data };
  localStorage.setItem('site_settings', JSON.stringify(parsed));

  if (!isSupabaseConfigured()) return true;

  try {
    const updatePayload: any = {};
    updatePayload[group] = parsed[group];

    // Using upsert ensures that if the record is missing, it will be automatically created
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        ...updatePayload
      });

    if (error) {
      console.error(`[siteSettingsService] updateSiteSettingsGroup error for ${group}:`, error);
      return false; // return false so UI knows it failed
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
        homepage_settings: { ...defaults.homepage_settings, ...parsed.homepage_settings },
        appointment_settings: { ...defaults.appointment_settings, ...parsed.appointment_settings },
        footer_settings: { ...defaults.footer_settings, ...parsed.footer_settings },
        ai_settings: { ...defaults.ai_settings, ...parsed.ai_settings }
      };
    }
  } catch (e) {
    console.error('[siteSettingsService] fallback local read error:', e);
  }
  return defaults;
}
