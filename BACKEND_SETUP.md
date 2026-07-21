# Supabase Backend Kurulum Rehberi

Bu doküman, Avukat Eren Akarsu web sitesinin Supabase backend entegrasyonunu adım adım açıklamaktadır.

---

## 1. Supabase Projesi Oluşturma

1. [https://supabase.com](https://supabase.com) adresine gidin
2. "Start your project" butonuyla yeni proje oluşturun
3. **Organization** ve **Project name** belirleyin
4. **Database password** oluşturun (güvenli saklayın)
5. **Region**: `eu-central-1` (Frankfurt) önerilir

## 2. Environment Variables

Proje oluşturulduktan sonra:

1. Supabase Dashboard → **Settings** → **API** bölümüne gidin
2. Şu değerleri kopyalayın:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Proje kök dizininde `.env` dosyası oluşturun:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiI.....
```

> ⚠️ `.env` dosyası `.gitignore` içinde olmalıdır. Asla commit etmeyin.

## 3. Veritabanı Şemasını Oluşturma

1. Supabase Dashboard → **SQL Editor** bölümüne gidin
2. `supabase/schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
3. **Run** butonuna basın

Bu işlem şu tabloları oluşturur:
- `contents` — Tüm içerik türleri (makaleler, dilekçeler, değerlendirmeler, vb.)
- `precedent_decisions` — Emsal kararlar
- `content_files` — İçeriklere bağlı dosyalar
- RLS politikaları (güvenlik kuralları)
- Otomatik `updated_at` trigger'ı

## 4. Storage Bucket Oluşturma

1. Supabase Dashboard → **Storage** bölümüne gidin
2. İki bucket oluşturun:
   - **`content-media`** (Public) — Kapak görselleri için
   - **`content-files`** (Public) — Doküman dosyaları için
3. Her bucket için policy ekleyin:
   - **SELECT**: Herkes okuyabilir
   - **INSERT**: Sadece authenticated kullanıcılar

## 5. Admin Kullanıcı Oluşturma

1. Supabase Dashboard → **Authentication** → **Users** bölümüne gidin
2. **Add user** → **Create user** seçin
3. Email ve şifre girin (ör: `admin@akarsu.av.tr`)
4. Bu kullanıcı, admin panelde içerik eklemek/düzenlemek için kullanılacak

## 6. Vercel Deployment

### Environment Variables
Vercel Dashboard → Project Settings → **Environment Variables**:
- `VITE_SUPABASE_URL` = Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Supabase anon key

### Supabase URL Configuration (Authentication)
Supabase Dashboard → **Authentication** → **URL Configuration** bölümünde şu ayarlar yapılmalıdır:
* **Site URL**:
  `https://www.erenakarsu.av.tr`
* **Redirect URLs**:
  * `https://www.erenakarsu.av.tr`
  * `https://www.erenakarsu.av.tr/*`
  * `http://localhost:5173`
  * `http://localhost:5173/*`


### SPA Routing
`vercel.json` dosyası zaten projeye eklenmiştir. Bu sayede doğrudan URL erişiminde (ör: `/icerik/kidem-tazminati`) 404 hatası alınmaz.

## 7. İçerik Ekleme Akışı

### Admin Panelden İçerik Ekleme:
1. Admin paneline giriş yapın (`#admin`)
2. "İçerik Yönetimi" sekmesini açın
3. "Yeni İçerik Oluştur" butonuna tıklayın
4. İçerik türünü seçin (Makale, Dilekçe, Değerlendirme, vb.)
5. Formu doldurun ve "Yayınla" veya "Taslak Olarak Kaydet" butonuna basın
6. İçerik anında veritabanına kaydedilir

### Emsal Karar Ekleme:
1. "Emsal Kararlar Yönetimi" sekmesini açın
2. Mahkeme adı, esas/karar numarası, tarih ve karar metni girin
3. "Ana Sayfada Göster" seçeneğini aktif edin
4. Yayınlayın

### İçerik Durumları:
- **Taslak (draft)**: Sadece admin panelde görünür
- **Yayında (published)**: Ana sayfa ve Hukuki İçerikler sayfasında görünür
- **Arşiv (archived)**: Hiçbir yerde görünmez (soft delete)

## 8. Önemli Notlar

- `.env` dosyası olmadan uygulama **fallback mock data** ile çalışır
- Supabase bağlantısı kesilirse otomatik olarak mock veriye geçer
- Admin paneldeki Müvekkil, Dava, Randevu ve Kanban verileri henüz yerel state'te kalır
- İçerik ve Emsal Kararlar tamamen Supabase'e bağlıdır
