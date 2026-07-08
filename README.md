<div align="center">

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          ███████╗ █████╗     ██╗      █████╗ ██╗    ██╗      ║
║          ██╔════╝██╔══██╗   ██║     ██╔══██╗██║    ██║      ║
║          █████╗  ███████║   ██║     ███████║██║ █╗ ██║      ║
║          ██╔══╝  ██╔══██║   ██║     ██╔══██║██║███╗██║      ║
║          ███████╗██║  ██║   ███████╗██║  ██║╚███╔███╔╝      ║
║          ╚══════╝╚═╝  ╚═╝   ╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝       ║
║                                                               ║
║                  Av. Eren Akarsu — LegalTech Web Platformu   ║
╚═══════════════════════════════════════════════════════════════╝
```

# Avukat Eren Akarsu — LegalTech Web Platformu

**Hukuk ve Teknolojinin Kesiştiği Dijital Kimlik**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF4D4D?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/License-Tüm_Haklar_Saklı-8B1A4A?style=flat-square)](./README.md#-haklar--lisans)

---

*Klasik avukatlık sitesi değil; kişisel marka, hukuki içerik yönetimi, online randevu, yapay zekâ destekli kullanıcı deneyimi ve kalıcı Supabase backend altyapısını tek çatı altında toplayan modern bir **LegalTech Platformu.***

</div>

---

## 📋 İçindekiler

<details>
<summary>Tüm bölümleri görmek için tıklayın</summary>

- [🎯 Projenin Amacı](#-projenin-amacı)
- [🏗️ Mimari Genel Bakış](#️-mimari-genel-bakış)
- [🎨 Tasarım Dili ve Renk Paleti](#-tasarım-dili-ve-renk-paleti)
- [⚙️ Kullanılan Teknolojiler](#️-kullanılan-teknolojiler)
- [📁 Proje Yapısı](#-proje-yapısı)
- [🗄️ Veritabanı Şeması](#️-veritabanı-şeması)
- [🔐 Authentication ve Güvenlik](#-authentication-ve-güvenlik)
- [📄 Sayfa ve Bileşen Haritası](#-sayfa-ve-bileşen-haritası)
- [📚 Hukuki İçerik Modülü](#-hukuki-i̇çerik-modülü)
- [⚖️ Emsal Kararlar Yönetimi](#️-emsal-kararlar-yönetimi)
- [🗓️ Online Randevu Sistemi](#️-online-randevu-sistemi)
- [🧮 Hukuki Hesaplama Araçları](#-hukuki-hesaplama-araçları)
- [🤖 AI Chatbot Modülü](#-ai-chatbot-modülü)
- [🛡️ Admin Panel](#️-admin-panel)
- [⚙️ Site Ayarları Merkezi](#️-site-ayarları-merkezi)
- [☁️ Supabase Backend Entegrasyonu](#️-supabase-backend-entegrasyonu)
- [📱 Responsive Tasarım](#-responsive-tasarım)
- [🚀 Kurulum ve Geliştirme](#-kurulum-ve-geliştirme)
- [🌐 Vercel Deployment](#-vercel-deployment)
- [🔧 Environment Variables](#-environment-variables)
- [📊 Geliştirme Durumu](#-geliştirme-durumu)
- [🛣️ Yol Haritası](#️-yol-haritası)
- [⚠️ Hukuki Uyarı](#️-hukuki-uyarı)
- [©️ Haklar ve Lisans](#️-haklar-ve-lisans)

</details>

---

## 🎯 Projenin Amacı

Bu proje, **Av. Eren Akarsu**'nun mesleki kimliğini, hukuki çalışma alanlarını ve dijital hizmetlerini modern bir arayüz üzerinden sunmak için geliştirilmiştir. Yalnızca bir tanıtım sitesi değil; **genişletilebilir bir LegalTech platformudur.**

```
┌─────────────────────────────────────────────────────────────┐
│                  PLATFORM HEDEFLERİ                         │
├──────────────────────┬──────────────────────────────────────┤
│  🏛️ Mesleki Kimlik   │  Premium hukuki marka ve vitrin      │
│  📚 Hukuki İçerik    │  Makale, karar, dilekçe, hesaplama   │
│  🗓️ Online Randevu   │  Dinamik takvim ve görüşme sistemi    │
│  🤖 AI Deneyimi      │  Chatbot ile akıllı yönlendirme      │
│  🛡️ Admin Panel      │  Tam CMS ve içerik yönetimi           │
│  🚀 LegalTech Altyapı│  Ölçeklenebilir backend mimarisi     │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 🏗️ Mimari Genel Bakış

```
┌──────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  React 19 + TypeScript 6                 │    │
│  │                  Vite 8 (Build & Dev Server)             │    │
│  │                                                          │    │
│  │  ┌──────────────┐    ┌──────────────┐                   │    │
│  │  │  Ziyaretçi   │    │  Admin Panel │                   │    │
│  │  │   Arayüzü    │    │  (/admin)    │                   │    │
│  │  └──────┬───────┘    └──────┬───────┘                   │    │
│  │         │                   │                            │    │
│  │  ┌──────▼───────────────────▼───────┐                   │    │
│  │  │       AppContext (Global State)   │                   │    │
│  │  │   siteSettings, auth, contents   │                   │    │
│  │  └──────────────────┬───────────────┘                   │    │
│  │                     │                                    │    │
│  │  ┌──────────────────▼───────────────┐                   │    │
│  │  │       Service Layer               │                   │    │
│  │  │  contentService  │ precedentSvc  │                   │    │
│  │  │  settingsService │ uploadService │                   │    │
│  │  └──────────────────┬───────────────┘                   │    │
│  └─────────────────────┼───────────────────────────────────┘    │
│                         │                                        │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │               @supabase/supabase-js v2                    │   │
│  └──────────────────────┬───────────────────────────────────┘   │
└─────────────────────────┼────────────────────────────────────────┘
                          │  HTTPS / REST / Realtime
┌─────────────────────────▼────────────────────────────────────────┐
│                     SUPABASE BACKEND                              │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │ PostgreSQL  │  │  Auth      │  │  Storage   │  │  RLS      │  │
│  │  Database  │  │ (Sessions) │  │  (Media)   │  │ Policies  │  │
│  └────────────┘  └────────────┘  └────────────┘  └───────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Tasarım Dili ve Renk Paleti

Bu projenin tasarım dili **"Premium Dark LegalTech"** olarak tanımlanmıştır. Klasik avukatlık sitelerinin monoton kurumsal görünümünden kasıtlı olarak uzaklaşılmış; modern web teknolojilerinin sunduğu olanaklarla hem güvenilir hem çağdaş bir görünüm yaratılmıştır.

### Ana Renk Paleti

```css
/* ═══════════════════════════════════════════
   AVUKAT EREN AKARSU — DESIGN SYSTEM TOKENS
   ═══════════════════════════════════════════ */

:root {
  --color-cream:       #F0DAC5;   /* Ana metin, vurgu detayları  */
  --color-dark-navy:   #1C2340;   /* Arka plan, temel yüzey      */
  --color-burgundy:    #50223C;   /* Aksan rengi, CTA, kenarlık  */
  --color-bg-deep:     #0C101E;   /* Derin arka plan katmanı     */
  --color-bg-surface:  #121727;   /* Kart ve panel yüzeyi        */
  --color-text-sec:    #A0AEC0;   /* İkincil metin               */
  --color-border:      rgba(240, 218, 197, 0.08); /* Hafif kenarlık */
}
```

### Tasarım Prensipleri

| Prensip | Uygulama |
|---|---|
| **Dark Mode First** | Koyu lacivert (#1C2340) arka plan temel alınmıştır |
| **Glassmorphism** | `backdrop-filter: blur()` ile yarı saydam kart yüzeyleri |
| **Micro-Animations** | Framer Motion ile scroll-triggered ve hover efektleri |
| **Typography** | Google Fonts: `Outfit` (başlıklar) + `Inter` (gövde metin) |
| **Spacing System** | 4px tabanlı çarpan sistemi |
| **Border Radius** | 8px — 16px arası yuvarlatılmış köşeler |
| **Shadow Language** | `rgba(0,0,0,0.4)` derinlik gölgeleri + Subtle glow |
| **Icon System** | `lucide-react` — tutarlı 24px icon seti |

---

## ⚙️ Kullanılan Teknolojiler

### Core Stack

```
React 19          ─── UI framework (Hooks, Context API)
TypeScript 6      ─── Statik tip güvenliği
Vite 8            ─── Build aracı ve dev server
```

### Backend & Database

```
Supabase 2.x      ─── PostgreSQL + Auth + Storage + RLS
supabase-js       ─── JavaScript client SDK
```

### UI & Animation

```
Framer Motion 12  ─── Sayfa ve bileşen animasyonları
Lucide React 1.x  ─── SVG icon kütüphanesi
Vanilla CSS       ─── Özel design system (Tailwind yok)
```

### Tooling & DX

```
oxlint            ─── Ultra-hızlı Rust tabanlı linter
TypeScript ESM    ─── Native ES modules
vercel.json       ─── SPA rewrite kuralları
```

### Planlanan Entegrasyonlar

```
iyzico / PayTR    ─── Ödeme altyapısı (planlandı)
Google Analytics 4─── Kullanıcı analitik (planlandı)
Google Tag Manager─── Tag yönetimi (planlandı)
SMTP / Resend     ─── E-posta bildirimleri (planlandı)
Google Calendar   ─── Randevu senkronizasyonu (planlandı)
```

---

## 📁 Proje Yapısı

```
AvErenAkarsuWeb/
│
├── 📄 index.html                    # SPA giriş noktası
├── 📄 vercel.json                   # SPA rewrite yapılandırması
├── 📄 vite.config.ts                # Vite build konfigürasyonu
├── 📄 tsconfig.app.json             # TypeScript konfigürasyonu
├── 📄 .env                          # Supabase anahtarları (gizli)
│
├── 📁 supabase/
│   └── schema.sql                   # Veritabanı şeması + RLS policies
│
├── 📁 public/
│   └── (statik varlıklar, favicon)
│
└── 📁 src/
    │
    ├── 📄 main.tsx                  # React DOM giriş noktası
    ├── 📄 App.tsx                   # Router + Provider sarmalayıcı
    ├── 📄 index.css                 # Global design system tokens
    │
    ├── 📁 context/
    │   └── AppContext.tsx           # Global state (auth, settings, i18n)
    │
    ├── 📁 lib/
    │   └── supabaseClient.ts        # Supabase bağlantı istemcisi
    │
    ├── 📁 types/
    │   └── (içerik, karar, ayar tip tanımları)
    │
    ├── 📁 utils/
    │   └── (yardımcı fonksiyonlar, slug üretici)
    │
    ├── 📁 services/
    │   ├── contentService.ts        # İçerik CRUD — Supabase
    │   ├── precedentService.ts      # Emsal karar CRUD — Supabase
    │   ├── siteSettingsService.ts   # Site ayarları upsert — Supabase
    │   └── uploadService.ts         # Supabase Storage yükleme
    │
    ├── 📁 pages/
    │   ├── Home.tsx                 # Ana sayfa kompozisyonu
    │   ├── AdminPanel.tsx           # Admin CMS panel (~170KB)
    │   ├── KnowledgeHub.tsx         # Hukuki içerik merkezi
    │   ├── ContentDetailPage.tsx    # İçerik detay sayfası
    │   ├── LegalCalculatorPage.tsx  # Hesaplama araçları hub
    │   ├── KvkkDisclosure.tsx       # KVKK aydınlatma metni
    │   ├── ExplicitConsent.tsx      # Açık rıza metni
    │   ├── CookiePolicy.tsx         # Çerez politikası
    │   ├── TermsOfUse.tsx           # Kullanım koşulları
    │   └── Disclaimer.tsx           # Sorumluluk reddi
    │
    └── 📁 components/
        │
        ├── 📁 layout/
        │   ├── Header.tsx           # Sticky header, mobile drawer
        │   └── Footer.tsx           # Kurumsal footer
        │
        ├── 📁 sections/             # Ana sayfa bölümleri
        │   ├── Hero.tsx             # Giriş hero alanı
        │   ├── HeroPhotoCarousel.tsx# Dinamik fotoğraf slaytı
        │   ├── About.tsx            # Hakkında bölümü
        │   ├── Education.tsx        # Eğitim ve başarılar
        │   ├── Services.tsx         # Faaliyet alanları
        │   ├── Stats.tsx            # İstatistik sayaçları
        │   ├── RecentPosts.tsx      # Güncel yazılar grid
        │   ├── LegalDecisions.tsx   # Emsal kararlar carousel
        │   ├── AppointmentSystem.tsx# Online randevu takvimi
        │   ├── PaymentSystem.tsx    # Ödeme modülü
        │   ├── ContactForm.tsx      # İletişim formu
        │   └── NewsletterSection.tsx# Abonelik alanı
        │
        ├── 📁 admin/                # Admin panel alt bileşenleri
        │   └── (editor, form, modal bileşenleri)
        │
        └── 📁 ui/                   # Paylaşımlı UI primitifleri
            └── (Toast, Modal, Spinner, Badge)
```

---

## 🗄️ Veritabanı Şeması

Supabase PostgreSQL üzerinde **3 ana tablo** ve **RLS policy katmanı** ile çalışır.

### Tablo İlişki Diyagramı

```
┌──────────────────────────────────────────────────────────────────┐
│                        contents                                   │
│                                                                   │
│  id (UUID PK)          status (draft|published|archived)         │
│  title                 is_featured                               │
│  slug (UNIQUE)         show_on_homepage                          │
│  content_type ─────────┬── document_template                    │
│  excerpt               ├── article                              │
│  content_body          ├── legal_review                         │
│  tags (TEXT[])         ├── precedent_decision                   │
│  cover_image_url       ├── case_law_analysis                    │
│  author                ├── professional_note                    │
│  seo_title             └── legal_calculator                     │
│  seo_description                                                 │
│  published_at                                                    │
│  view_count / like_count                                         │
│  (+ type-specific fields: doc_*, article_*, calc_*)             │
└──────────────────────────────────────┬───────────────────────────┘
                                       │ 1:N (CASCADE DELETE)
┌──────────────────────────────────────▼───────────────────────────┐
│                       content_files                               │
│                                                                   │
│  id (UUID PK)          file_url (Supabase Storage)              │
│  content_id (FK)       file_type / file_size                    │
│  file_name             description                              │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    precedent_decisions                             │
│                                                                   │
│  id (UUID PK)          status (draft|published|archived)         │
│  title / slug          is_featured / show_on_homepage            │
│  court_name            esas_no / karar_no / decision_date       │
│  legal_area            decision_type / category                  │
│  short_summary         full_decision_text                        │
│  legal_commentary      related_laws / conclusion                 │
│  seo_title / seo_description                                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       site_settings                               │
│                                                                   │
│  id (UUID) = '00000000-0000-0000-0000-000000000001' (sabit)     │
│  general_settings   (JSONB) ── site adı, logo, SEO              │
│  contact_settings   (JSONB) ── telefon, email, sosyal medya     │
│  homepage_settings  (JSONB) ── hero, limit sayıları             │
│  appointment_settings (JSONB)─ çalışma günleri, saatler, ücret │
│  footer_settings    (JSONB) ── marka adı, telif metni           │
│  ai_settings        (JSONB) ── chatbot durumu, mesajlar         │
└──────────────────────────────────────────────────────────────────┘
```

### Row Level Security (RLS) Politikaları

```sql
-- Herkes yayınlanan içerikleri okuyabilir
CREATE POLICY "Public read published"
  ON contents FOR SELECT
  USING (status = 'published');

-- Sadece authenticate edilmiş kullanıcılar yazabilir
CREATE POLICY "Auth users can insert"
  ON contents FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Auth users can update"
  ON contents FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Auth users can delete"
  ON contents FOR DELETE
  TO authenticated USING (true);
```

> **Not:** `site_settings` tablosu sabit bir UUID satırı ile `.upsert()` yöntemi kullanılarak güncellenir. Bu yaklaşım RLS ihlali hatalarını önler ve satır oluşturma/güncelleme mantığını tek çağrıda birleştirir.

---

## 🔐 Authentication ve Güvenlik

Admin paneline erişim **Supabase Auth** tabanlı gerçek oturum yönetimiyle korunmaktadır.

### Giriş Akışı

```typescript
// AdminPanel.tsx — Gerçek Supabase Auth akışı
const handleLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginForm.email,
    password: loginForm.password,
  });

  if (error) {
    showToast('Giriş bilgileri hatalı.', 'error');
    return;
  }

  // Session başarıyla oluşturuldu
  setIsLoggedIn(true);
  showToast('Yönetici girişi başarılı.', 'success');
};

// Çıkış
const handleLogout = async () => {
  await supabase.auth.signOut();
  setIsLoggedIn(false);
};
```

### Güvenlik Katmanları

```
┌─────────────────────────────────────────────────┐
│           GÜVENLİK MİMARİSİ                     │
├─────────────────────────────────────────────────┤
│  1. Supabase Auth     → JWT session yönetimi    │
│  2. RLS Policies      → Satır düzeyinde kontrol │
│  3. anon key only     → Sadece public key client│
│  4. service_role key  → Asla frontend'e yazılmaz│
│  5. .env dosyası      → Anahtarlar git'e gitmez │
│  6. HTTPS zorunlu     → Vercel production'da     │
└─────────────────────────────────────────────────┘
```

> ⚠️ **Önemli:** `SUPABASE_SERVICE_ROLE_KEY` hiçbir zaman frontend koduna yazılmamalıdır. Bu anahtar yalnızca sunucu taraflı (serverless function) işlemler için kullanılmalıdır.

---

## 📄 Sayfa ve Bileşen Haritası

### Ziyaretçi Tarafı Rotaları

```
/                    → Ana Sayfa (Home.tsx)
├── Hero             → Karşılama ve hero fotoğraf slaytı
├── About            → Kişisel ve mesleki tanıtım
├── Education        → Eğitim, başarılar, sertifikalar
├── Services         → Faaliyet alanları grid'i
├── Stats            → İstatistik sayaçları
├── RecentPosts      → Güncel blog yazıları
├── LegalDecisions   → Emsal karar carousel'i
├── Appointment      → Online randevu takvim sistemi
├── Payment          → Ödeme modülü
├── Contact          → İletişim formu + harita
└── Newsletter       → E-posta aboneliği

/hukuki-icerikler    → KnowledgeHub.tsx (Hukuki içerik merkezi)
/icerik/:slug        → ContentDetailPage.tsx (İçerik detayı)
/hesaplama-araclari  → LegalCalculatorPage.tsx (Hesaplama araçları)
/kvkk               → KvkkDisclosure.tsx
/acik-riza          → ExplicitConsent.tsx
/cerez-politikasi   → CookiePolicy.tsx
/kullanim-kosullari → TermsOfUse.tsx
/sorumluluk-reddi   → Disclaimer.tsx

/admin              → AdminPanel.tsx (Korumalı)
```

### Header Navigasyon Yapısı

```
[ EA ] ─── Anasayfa | Hakkımda | Faaliyet Alanları |
           Hukuki İçerikler | İletişim | Online Randevu
                                                 ──── [ TR | EN ] [ ☀️ | 🌙 ]
```

**Header Özellikleri:**
- `position: sticky` ile sabit üst bar
- Scroll sonrası kapsül (pill) formuna dönüşen nav yapısı
- Aktif section vurgulama
- Mobil hamburger drawer (her scroll pozisyonunda tam ekran)
- EA monogram dinamik olarak `general_settings.monogramUrl`'den okunur
- Dil değiştirici (TR / EN)

---

## 📚 Hukuki İçerik Modülü

Sitenin en kapsamlı bölümlerinden biri olan **KnowledgeHub**, yedi farklı içerik kategorisini tek platformda sunar.

### İçerik Türleri

```
contents tablosu — content_type alanı
─────────────────────────────────────────────────────────
  📋 document_template    → Dilekçe ve Doküman Örnekleri
  📰 article              → Hukuki Makaleler
  ⚖️  legal_review         → Hukuki Değerlendirmeler
  📌 precedent_decision   → Emsal Kararlar / Yargı Kararları
  🔬 case_law_analysis    → Kanun ve İçtihat Analizleri
  📓 professional_note    → Meslekten Notlar
  🧮 legal_calculator     → Hukuki Hesaplama Araçları
─────────────────────────────────────────────────────────
```

### İçerik Kaydı — Tam Alan Listesi

| Alan | Tür | Açıklama |
|---|---|---|
| `title` | TEXT | İçerik başlığı |
| `slug` | TEXT UNIQUE | URL dostu tanımlayıcı |
| `excerpt` | TEXT | Kısa özet / ön izleme metni |
| `content_body` | TEXT | Tam içerik gövdesi (HTML/Markdown) |
| `content_type` | ENUM | 7 içerik türünden biri |
| `category` | TEXT | Hukuk alanı kategorisi |
| `tags` | TEXT[] | Etiket dizisi |
| `cover_image_url` | TEXT | Kapak görseli (Storage URL) |
| `status` | ENUM | `draft \| published \| scheduled \| archived` |
| `is_featured` | BOOLEAN | Öne çıkarılmış içerik |
| `show_on_homepage` | BOOLEAN | Ana sayfada göster |
| `download_enabled` | BOOLEAN | İndirme izni |
| `reading_time` | TEXT | Tahmini okuma süresi |
| `view_count` | INTEGER | Görüntülenme sayısı |
| `seo_title` | TEXT | Sayfa SEO başlığı |
| `seo_description` | TEXT | Meta açıklaması |

### İçerik Servisi

```typescript
// src/services/contentService.ts

// Yayınlanmış içerikleri getir
const getPublishedContents = async (type?: ContentType) => {
  let query = supabase
    .from('contents')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (type) query = query.eq('content_type', type);
  return query;
};

// İçerik ekle
const createContent = async (data: ContentInsert) => {
  return supabase.from('contents').insert(data).select().single();
};

// İçerik güncelle
const updateContent = async (id: string, data: Partial<Content>) => {
  return supabase.from('contents').update(data).eq('id', id).select().single();
};

// İçerik sil
const deleteContent = async (id: string) => {
  return supabase.from('contents').delete().eq('id', id);
};
```

---

## ⚖️ Emsal Kararlar Yönetimi

Emsal kararlar, hukuki içerik modülünden bağımsız olarak kendi `precedent_decisions` tablosunda yönetilmektedir.

### Karar Kayıt Alanları

```typescript
interface PrecedentDecision {
  id: string;                    // UUID (otomatik)
  title: string;                 // Karar başlığı
  slug: string;                  // URL'de kullanılan tanımlayıcı
  court_name: string;            // Mahkeme / daire adı
  esas_no: string;               // Esas numarası
  karar_no: string;              // Karar numarası
  decision_date: Date;           // Karar tarihi
  legal_area: string;            // Hukuk alanı
  decision_type: string;         // Karar türü
  category: string;              // İçerik kategorisi
  tags: string[];                // Arama etiketleri
  short_summary: string;         // Kısa özet (kart görünümü)
  important_points: string;      // Önemli hukuki tespitler
  full_decision_text: string;    // Tam karar metni
  legal_commentary: string;      // Hukuki değerlendirme
  related_laws: string;          // İlgili kanun maddeleri
  status: 'draft'|'published'|'archived';
  is_featured: boolean;          // Öne çıkarılmış karar
  show_on_homepage: boolean;     // Ana sayfada göster
  seo_title: string;
  seo_description: string;
}
```

### Admin Panel — Karar Ekleme Akışı

```
[Admin Paneli]
     │
     ▼
[Emsal Kararlar sekmesi]
     │
     ▼
[Yeni Karar Ekle butonu]
     │
     ▼
[Karar Formu]
  ├── Başlık / Özet
  ├── Mahkeme bilgileri (esas no, karar no, tarih)
  ├── Hukuk alanı ve kategori
  ├── Tam karar metni (rich text)
  ├── Hukuki değerlendirme
  └── Ayarlar (status, homepage, öne çıkar)
     │
     ▼
[precedentService.createDecision()]
     │
     ▼
[Supabase PostgreSQL — precedent_decisions tablosu]
     │
     ▼
[Ana sayfada LegalDecisions carousel'i otomatik güncellenir]
```

---

## 🗓️ Online Randevu Sistemi

Randevu sistemi tamamen **dinamik** çalışır. Sabit zaman dilimleri yoktur; her şey `appointment_settings` yapılandırmasından hesaplanır.

### Dinamik Slot Hesaplama

```typescript
// AppointmentSystem.tsx — Slot üretim algoritması
const generateTimeSlots = (
  startTime: string,     // örn: "09:00"
  endTime: string,       // örn: "18:00"
  duration: number,      // örn: 30 (dakika)
  pastHoursDisabled: boolean
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const now = new Date();
  let [hours, minutes] = startTime.split(':').map(Number);

  while (`${hours}:${minutes.toString().padStart(2, '0')}` < endTime) {
    const slotTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

    // Öğle arası atla (12:30 - 13:30)
    const isLunchBreak = hours === 12 && minutes >= 30
                      || hours === 13 && minutes < 30;

    if (!isLunchBreak) {
      const isPast = pastHoursDisabled &&
        isToday(selectedDate) &&
        new Date() > new Date(`${selectedDate} ${slotTime}`);

      slots.push({ time: slotTime, isPast, isBooked: false });
    }

    minutes += duration;
    if (minutes >= 60) { hours += 1; minutes -= 60; }
  }

  return slots;
};
```

### Randevu Özellikleri

- ✅ **Dinamik takvim** — mevcut haftadan itibaren ilerleyen tarihler
- ✅ **Çalışma günü kontrolü** — admin panelinden seçilen günler aktif
- ✅ **Geçmiş saat kilidi** — bugün için geçen saatler pasif
- ✅ **Öğle arası** — 12:30–13:30 arası otomatik devre dışı
- ✅ **Görüşme türü seçimi** — Online / Yüz Yüze / Telefon
- ✅ **Dinamik fiyatlandırma** — admin panelindeki ücretler otomatik yansır
- ✅ **KVKK onay metni** — form gönderiminden önce zorunlu onay
- 🔄 **Ödeme entegrasyonu** — planlandı
- 🔄 **E-posta bildirimi** — planlandı

### Admin'den Yapılandırma

```
Online Randevu Ayarları (admin → Site Ayarları → Randevu)
  ├── Çalışma günleri: [Pazartesi ✓] [Salı ✓] [Çarşamba ✓] ...
  ├── Başlangıç saati: 09:00
  ├── Bitiş saati: 18:00
  ├── Slot süresi: 30 dk
  ├── Online görüşme ücreti: 2.500 TL
  ├── Yüz yüze görüşme ücreti: 3.000 TL
  ├── Telefon görüşme ücreti: 1.500 TL
  └── Geçmiş saatleri pasif yap: [AÇIK]
```

---

## 🧮 Hukuki Hesaplama Araçları

`LegalCalculatorPage.tsx` üzerinde çalışan interaktif hesaplama modülü.

### Mevcut ve Planlanan Araçlar

| Araç | Açıklama | Durum |
|---|---|---|
| 💼 Kıdem Tazminatı | Çalışma süresi + son brüt ücret bazlı | Planlandı |
| 📋 İhbar Tazminatı | Kıdeme göre ihbar süresi hesabı | Planlandı |
| 📈 Yasal Faiz | TCMB oranına göre faiz hesabı | Planlandı |
| 🏦 İcra Faizi | İcra takibi gecikme faizi | Planlandı |
| 🏠 Kira Artış Oranı | TÜFE bazlı kira artış hesabı | Planlandı |
| 👨‍👩‍👧 Nafaka | Tedbir ve iştirak nafakası tahmini | Planlandı |
| 💰 Vekâlet Ücreti | Avukatlık asgari ücret tarifesi | Planlandı |
| 📑 Harç ve Masraf | Yargılama harcı hesabı | Planlandı |

> ⚠️ Hesaplama sonuçları **yalnızca bilgilendirme** amaçlıdır. Somut olaylara kesin hukuki değerlendirme yerine geçmez.

---

## 🤖 AI Chatbot Modülü

Sitede yüzen (floating) bir yapay zekâ asistan penceresi bulunur.

### Chatbot Konfigürasyonu

```typescript
// AppContext — AI settings (Supabase'den yüklenir)
const ai_settings = {
  isActive: true,            // Chatbot görünürlük anahtarı
  welcomeMessage: "Merhaba! Av. Eren Akarsu'nun dijital asistanıyım.",
  disclaimerText: "Bu chatbot genel bilgilendirme amaçlıdır ve hukuki danışmanlık yerine geçmez."
};
```

### Chatbot Davranışları

```
┌─────────────────────────────────────────────────────────┐
│                    CHATBOT LOGIC                         │
├─────────────────────────────────────────────────────────┤
│  ✅ Hizmet alanlarını sorgulama                          │
│  ✅ Randevu oluşturmaya yönlendirme                     │
│  ✅ İletişim bilgilerini hızlı sunma                    │
│  ✅ Hukuki içeriklere linkleme                          │
│  ❌ Somut hukuki tavsiye vermez                         │
│  ❌ Dava stratejisi önermez                             │
│  ❌ Mahkeme süreçleri hakkında kesin bilgi vermez       │
└─────────────────────────────────────────────────────────┘
```

**Mobil davranış:** Tam ekran açılır panel. Üstte belirgin kapatma butonu.

**Admin kontrolü:** `Site Ayarları → Chatbot Ayarları` sekmesinden açma/kapatma, karşılama mesajı ve yasal uyarı metni düzenlenebilir.

---

## 🛡️ Admin Panel

Admin panel (`/admin`) sitenin tüm yönetim işlemlerinin yürütüldüğü CMS merkezidir. Korumalı rota olup yalnızca Supabase Auth session'ı olan kullanıcılar erişebilir.

### Admin Panel Bölümleri

```
📊 Genel Durum (Dashboard)
│  ├── İçerik istatistikleri (toplam içerik, yayında, taslak)
│  ├── Hızlı eylem butonları
│  └── Son aktiviteler

📝 İçerik Yönetimi (CMS)
│  ├── Makale yönetimi
│  ├── Dilekçe / Doküman şablonları
│  ├── Hukuki değerlendirmeler
│  ├── Meslekten notlar
│  └── İçtihat analizleri

⚖️ Emsal Kararlar Yönetimi
│  ├── Karar listesi (filtreli, sıralı)
│  ├── Yeni karar ekleme formu
│  ├── Düzenleme ve silme
│  └── Öne çıkarma / Ana sayfada göster

🗓️ Randevu & Ödeme
│  ├── Gelen randevu listesi
│  ├── Ödeme durumu takibi
│  └── Takvim görünümü

⚙️ Site Ayarları Merkezi
│  ├── Genel Site Ayarları
│  ├── İletişim Bilgileri
│  ├── Ana Sayfa Ayarları
│  ├── Online Randevu Ayarları
│  ├── Footer Ayarları
│  └── Chatbot Ayarları

↩️ Ana Sayfaya Dön    (header'da veya sidebar'da)
🚪 Çıkış Yap
```

### Admin Panel Tasarım Sistemi

```css
/* Admin panel dark mode teması */
--admin-bg:        #0C101E    /* Derin arkaplan */
--admin-surface:   #121727    /* Kart yüzeyi */
--admin-border:    rgba(240, 218, 197, 0.08)
--admin-accent:    #50223C    /* Aksan / CTA */
--admin-text:      #F0DAC5    /* Ana metin */
```

---

## ⚙️ Site Ayarları Merkezi

Admin panelindeki **Site Ayarları** bölümü, 6 gerçek ve veritabanıyla bağlantılı kategoriyi yönetir.

```
┌──────────────────────────────────────────────────────────────┐
│               Site Ayarları — 6 Aktif Kategori               │
├──────────────┬───────────────────────────────────────────────┤
│  🌐 Genel    │ Site adı, tarayıcı başlığı, SEO meta,         │
│              │ logo URL, monogram URL, favicon, dil, tema    │
├──────────────┼───────────────────────────────────────────────┤
│  📞 İletişim │ Telefon, e-posta, adres, WhatsApp,           │
│              │ çalışma saatleri, LinkedIn, GitHub, Instagram │
├──────────────┼───────────────────────────────────────────────┤
│  🏠 Ana Sayfa│ Hero başlığı, açıklaması, slayt görselleri,  │
│              │ blog/karar kart limiti, faaliyet alanı toggle │
├──────────────┼───────────────────────────────────────────────┤
│  🗓️ Randevu  │ Çalışma günleri, başlangıç/bitiş saati,      │
│              │ slot süresi, online/yüz yüze/tel ücretleri   │
├──────────────┼───────────────────────────────────────────────┤
│  📄 Footer   │ Marka adı, telif hakkı / aydınlatma metni    │
├──────────────┼───────────────────────────────────────────────┤
│  🤖 Chatbot  │ Aktif/pasif toggle, karşılama mesajı,        │
│              │ yasal uyarı metni                             │
└──────────────┴───────────────────────────────────────────────┘
```

### Kaydetme Mekanizması

```typescript
// siteSettingsService.ts — Upsert stratejisi
const updateSiteSettingsGroup = async (
  group: keyof SiteSettings,
  data: any
): Promise<boolean> => {
  const { error } = await supabase
    .from('site_settings')
    .upsert(
      {
        id: SETTINGS_ROW_ID,  // '00000000-0000-0000-0000-000000000001'
        [group]: data,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('[Settings] Kayıt hatası:', error);
    return false;
  }
  return true;
};
```

> **Tasarım kararı:** Tek satır + sabit UUID + `.upsert()` yaklaşımı, RLS ihlali hatasını ortadan kaldırır. İlk çalıştırmada satır otomatik oluşturulur, sonraki güncellemelerde aynı satır üzerine yazılır.

---

## ☁️ Supabase Backend Entegrasyonu

### Storage Bucket Yapısı

```
Supabase Storage
├── content-media/        → Kapak görselleri, blog görselleri
│   ├── articles/
│   ├── decisions/
│   └── documents/
└── content-files/        → PDF, Word, UDF belgeleri
    └── templates/
```

### Dosya Yükleme Servisi

```typescript
// src/services/uploadService.ts
const uploadFile = async (
  file: File,
  bucket: 'content-media' | 'content-files',
  path: string
): Promise<string | null> => {
  // Türkçe karakter ve boşluk sanitizasyonu
  const safeName = file.name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(`${path}/${safeName}`, file, { upsert: true });

  if (error) { console.error('[Upload] Hata:', error); return null; }
  return supabase.storage.from(bucket).getPublicUrl(data.path).data.publicUrl;
};
```

---

## 📱 Responsive Tasarım

Tüm bileşenler aşağıdaki breakpoint aralıklarında test edilmektedir:

| Cihaz | Genişlik | Notlar |
|---|---|---|
| Küçük Mobil | 360px | Samsung Galaxy A serisi |
| Modern Telefon | 390–430px | iPhone 15, Pixel 8 |
| Tablet | 768px | iPad Mini |
| Tablet Yatay | 1024px | iPad Air landscape |
| Desktop | 1280px+ | Laptop ve masaüstü |

### Kritik Mobil Davranışlar

```
✅ Header hamburger menü → scroll pozisyonundan bağımsız tam ekran
✅ AI Chatbot → tam ekran panel modu, üstte kapatma butonu
✅ Randevu takvimi → dokunmatik uyumlu, yatay kaydırmalı
✅ İletişim kutusu → tek kompakt kart görünümü
✅ Admin sidebar → drawer modu
✅ Footer grid → tek sütuna düşen responsive layout
✅ Kart grid'ler → auto-fill, minimum 280px kart genişliği
✅ İçerik editörü → mobil uyumlu toolbar
```

---

## 🚀 Kurulum ve Geliştirme

### Ön Gereksinimler

```bash
Node.js >= 18.x
npm >= 9.x
Supabase hesabı (supabase.com)
```

### 1. Repoyu Klonla

```bash
git clone https://github.com/[username]/AvErenAkarsuWeb.git
cd AvErenAkarsuWeb
```

### 2. Bağımlılıkları Yükle

```bash
npm install
```

### 3. Environment Variables Ayarla

```bash
# .env dosyası oluştur
cp .env.example .env

# Değerleri doldur
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Supabase Şemasını Uygula

```sql
-- Supabase Dashboard → SQL Editor
-- supabase/schema.sql dosyasını çalıştır
```

### 5. Development Server Başlat

```bash
npm run dev
# → http://localhost:5173
```

### Diğer Komutlar

```bash
npm run build    # Production build (dist/ klasörü)
npm run preview  # Build sonrası yerel önizleme
npm run lint     # oxlint ile kod kalitesi kontrolü
```

---

## 🌐 Vercel Deployment

### Otomatik Deploy Akışı

```
GitHub repo'ya push
       │
       ▼
Vercel webhook tetiklenir
       │
       ▼
npm install + npm run build
       │
       ▼
dist/ klasörü CDN'e yüklenir
       │
       ▼
vercel.json rewrites → SPA yönlendirmesi
       │
       ▼
Production URL aktif
```

### Vercel Proje Ayarları

| Ayar | Değer |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | `./` |
| Node.js Version | 18.x veya 20.x |

### SPA Rewrite Yapılandırması

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Bu yapılandırma, React Router'ın tüm URL'leri `index.html` üzerinden yönetmesini sağlar.

---

## 🔧 Environment Variables

### Zorunlu Değişkenler

```bash
# Supabase
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...   # Public, sadece SELECT/INSERT/UPDATE

# ⛔ ASLA frontend'e ekleme:
# SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Sadece backend/serverless!
```

### Planlanan Gelecek Değişkenler

```bash
# Ödeme sistemi
VITE_IYZICO_API_KEY=
VITE_IYZICO_SECRET_KEY=
VITE_IYZICO_BASE_URL=https://api.iyzipay.com

# AI (server-side)
AI_API_KEY=

# E-posta bildirimleri
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

---

## 📊 Geliştirme Durumu

| Modül | Durum | Notlar |
|---|---|---|
| 🎨 Tasarım sistemi | ✅ **Tamamlandı** | Dark mode, glassmorphism, animasyonlar |
| 🏠 Ana sayfa | ✅ **Tamamlandı** | Tüm bölümler aktif |
| 🔗 Header / Footer | ✅ **Tamamlandı** | Dinamik, Supabase'e bağlı |
| 📱 Mobil responsive | ✅ **Tamamlandı** | Sürekli iyileştiriliyor |
| 🔐 Supabase Auth | ✅ **Tamamlandı** | Gerçek session yönetimi |
| 📝 İçerik yönetimi | ✅ **Tamamlandı** | Tam CRUD, Supabase bağlı |
| ⚖️ Emsal kararlar | ✅ **Tamamlandı** | Tam CRUD, Supabase bağlı |
| ⚙️ Site ayarları | ✅ **Tamamlandı** | 6 kategori, upsert tabanlı |
| 🗓️ Online randevu | ✅ **Tamamlandı** | Dinamik slot, fiyat, gün yönetimi |
| 🤖 AI Chatbot | 🔄 **Geliştiriliyor** | UI hazır, LLM entegrasyonu planlandı |
| 📚 Hukuki içerik hub | 🔄 **Geliştiriliyor** | KnowledgeHub aktif, zenginleştiriliyor |
| 🧮 Hesaplama araçları | 🔄 **Geliştiriliyor** | Sayfa hazır, hesaplama mantığı ekleniyor |
| 💳 Ödeme sistemi | 📋 **Planlandı** | iyzico entegrasyonu |
| 📧 E-posta bildirimleri | 📋 **Planlandı** | SMTP / Resend |
| 📈 Analytics | 📋 **Planlandı** | GA4, GSC, Clarity |
| 🗓️ Google Calendar | 📋 **Planlandı** | Randevu senkronizasyonu |

---

## 🛣️ Yol Haritası

### Yakın Vadeli (Sprint 1-2)

```
[ ] AI chatbot LLM entegrasyonu (Gemini / GPT)
[ ] Hukuki hesaplama araçları — hesaplama mantığı
[ ] E-posta bildirimleri (randevu onayı, iletişim formu)
[ ] Google Analytics 4 + Search Console entegrasyonu
[ ] Supabase Storage medya yöneticisi (admin panelinde)
```

### Orta Vadeli (Sprint 3-5)

```
[ ] iyzico ödeme entegrasyonu
[ ] Randevu → ödeme → onay akışı
[ ] Rich Text Editor (Tiptap veya Quill)
[ ] Google Calendar entegrasyonu
[ ] Gelişmiş admin istatistik dashboard'u
[ ] SEO meta yönetimi admin panelinden
[ ] İçerik zamanlama (scheduled publish)
```

### Uzun Vadeli (LegalTech Platform)

```
[ ] Müvekkil giriş paneli
[ ] Dava dosyası takip sistemi
[ ] Duruşma takvimi ve hatırlatıcı
[ ] Belge üretim sistemi (template → PDF)
[ ] AI destekli hukuki içerik önerileri
[ ] LegalTech SaaS mimarisine dönüşüm
[ ] Çoklu avukat / büro desteği
```

---

## ⚠️ Hukuki Uyarı

> Bu web sitesinde yer alan tüm içerikler **genel bilgilendirme** amacıyla sunulmaktadır.

- Sitedeki makaleler, dilekçe örnekleri, hukuki değerlendirmeler, hesaplama araçları ve yapay zekâ yanıtları **hukuki danışmanlık niteliği taşımaz.**
- Her somut hukuki olay kendi koşulları içinde değerlendirilmelidir.
- Hak kaybı yaşanmaması adına herhangi bir hukuki işlem yapmadan önce uzman bir avukattan profesyonel destek alınması önerilir.
- Bu site üzerinden gerçekleştirilen chatbot mesajlaşması, iletişim formu gönderimleri veya randevu talepleri tek başına **avukat-müvekkil ilişkisi kurmaz.**
- Avukat-müvekkil ilişkisi; yalnızca tarafların açık kabulü ve uygun hukuki formların tamamlanmasıyla kurulabilir.

---

## ©️ Haklar ve Lisans

Bu proje **Av. Eren Akarsu** kişisel marka ve LegalTech web platformu için geliştirilmektedir.

```
© 2025 Av. Eren Akarsu — Tüm Hakları Saklıdır

Sitede yer alan:
  • Tasarım ve UI bileşenleri
  • Hukuki metin ve içerikler
  • EA monogramı ve marka öğeleri
  • Yazılım bileşenleri ve kaynak kodu

izinsiz kopyalanamaz, çoğaltılamaz, ticari amaçla kullanılamaz.
Alıntı yapılması halinde kaynak ve bağlantı gösterilmesi zorunludur.
```

---

<div align="center">

## 🪪 Proje Kimlik Kartı

| | |
|---|---|
| **Proje Adı** | Avukat Eren Akarsu Web Sitesi |
| **Kategori** | Avukatlık Web Sitesi / LegalTech Platformu |
| **Frontend** | React 19 + TypeScript 6 + Vite 8 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Deployment** | Vercel |
| **Tasarım Dili** | Premium Dark LegalTech |
| **Renk Paleti** | Cream `#F0DAC5` · Navy `#1C2340` · Burgundy `#50223C` |
| **Animasyon** | Framer Motion 12 |
| **İkonlar** | Lucide React |
| **Linter** | oxlint (Rust tabanlı) |

---

*Bu proje, hukuk ve yazılım disiplinlerini bir araya getiren modern bir dijital platform olarak geliştirilmektedir.*

*Amaç yalnızca bir avukatlık web sitesi oluşturmak değil; hukuki bilgiye erişimi kolaylaştıran, kullanıcı deneyimini güçlendiren, yönetilebilir ve ölçeklenebilir bir **LegalTech altyapısı** kurmaktır.*

---

**Av. Eren Akarsu** · [LinkedIn](#) · [GitHub](#) · [Instagram](#)

</div>
