# Handover 1 — Üyelik & Profil Sistemi (Google + e-posta giriş, hesaba bağlı profiller)

Tarih: 2026-06-26
Branch: `main`

## 1. Bu oturumda ne yapıldı

Site, "herkese açık dizin" modelinden **üyelik gerektiren** bir modele geçirildi:

- **Ana sayfa + iletişim + yasal sayfalar herkese açık**, geri kalan her şey **giriş + tamamlanmış profil** gerektiriyor.
- Girişe **Google ile giriş (OAuth)** ve **ücretsiz e-posta/şifre kaydı** eklendi (önceden sadece e-posta/şifre girişi vardı, kayıt yoktu).
- Profiller artık **giriş yapan kullanıcıya bağlı** (`user_id`). Kullanıcı başına **tek profil** (öğrenci VEYA mezun).
- Akış: **önce hesap aç → sonra `/profil` sayfasında bilgileri doldur.** Profili eksik kullanıcı korumalı sayfalara girmeye çalışınca `/profil`'e yönlendirilir.
- Profil alanları: rol (öğrenci/mezun), Ad Soyad*, Mezuniyet Yılı*, Dönem* (öğrenci), WhatsApp*, LinkedIn (ops.), Instagram (ops.), Kısa Bilgi (ops.), **gizlilik toggle (açık/gizli)**.
- Eski **login'siz anonim profil ekleme** akışı (`/students/yeni`, `/alumni/yeni`) **kaldırıldı.**

## 2. ⚠️ ÖNCE YAPILMASI GEREKEN (yoksa çalışmaz)

### 2a. Migration'ı Supabase'e uygula  — **HENÜZ UYGULANMADI**
Dosya: `supabase/migrations/202606260003_link_profiles_to_users.sql`

> Supabase Dashboard → **SQL Editor** → bu dosyanın içeriğini yapıştır → **Run**.

Bu migration:
- `student_profiles` ve `alumni_profiles` tablolarına `user_id` (+ öğrenciye whatsapp/linkedin/instagram/short_bio/is_anonymous) kolonları ekler,
- kullanıcı başına tek profil için `unique(user_id)` index'i kurar,
- **RLS politikaları** ekler: kullanıcı yalnızca `auth.uid() = user_id` olan kendi satırını insert/update/select edebilir,
- `public_student_profiles` / `public_alumni_profiles` view'larını her profilin kendi `is_anonymous` bayrağına göre maskeleyecek şekilde günceller.

Idempotent (yeniden çalıştırılabilir), zarar vermez.

### 2b. Supabase Auth ayarları — kullanıcı tarafından yapıldı (doğrula)
- **Google provider** açık, Client ID + Secret girili (Supabase → Authentication → Providers → Google). ✅
- **URL Configuration** → Site URL `https://calcomclub.com`; Redirect URLs: `https://calcomclub.com`, `https://www.calcomclub.com`, `http://localhost:5173`.
- Google Cloud OAuth client → Authorised redirect URI **tek**: `https://jtsohmvbyftwzkvzyopy.supabase.co/auth/v1/callback`
- **E-posta doğrulaması KAPALI** olmalı (anında giriş isteniyor): Authentication → Providers → Email → "Confirm email" kapalı. Açıksa kayıt sonrası kullanıcı oturum açamaz; `Login.tsx` bu durumu "Kayıt alındı, giriş yapabilirsin" mesajıyla karşılar ama anında giriş olmaz.

## 3. Değişen / eklenen dosyalar

**Eklendi**
- `supabase/migrations/202606260003_link_profiles_to_users.sql` — DB + RLS + view
- `src/pages/Profil.tsx` — Profilini Tamamla/Düzenle sayfası (rol, alanlar, gizlilik toggle)
- `src/components/auth/RequireProfile.tsx` — giriş + profil guard'ı

**Değiştirildi**
- `src/pages/Login.tsx` — Google butonu + Giriş/Kayıt sekmeleri (`signUp`, `signInWithOAuth`)
- `src/App.tsx` — routing: açık sayfalar / `RequireAuth` (`/profil`) / `RequireProfile` (üye sayfaları); eski yeni-profil route'ları kaldırıldı
- `src/data/students.ts` — `fetchMyStudentProfile`, `upsertMyStudentProfile` (RLS ile doğrudan); yeni alanlar; eski `createStudentProfile` (API) kaldırıldı
- `src/data/alumni.ts` — `fetchMyAlumniProfile`, `upsertMyAlumniProfile`; eski `createAlumniProfile` kaldırıldı
- `src/pages/Students.tsx`, `src/pages/Alumni.tsx` — "Profil Oluştur" linkleri `/profil`'e; metinler güncellendi

**Silindi**
- `src/pages/StudentCreate.tsx`, `src/pages/AlumniCreate.tsx`

## 4. Routing özeti (App.tsx)

| Erişim | Sayfalar |
|---|---|
| Herkese açık | `/`, `/contact`, `/login`, yasal sayfalar (`/kvkk`, `/gizlilik-politikasi`, `/cerez-politikasi`, `/acik-riza`, `/kullanim-sartlari`) |
| Giriş yeter (`RequireAuth`) | `/profil` |
| Giriş + profil (`RequireProfile`) | `/news`, `/clubs`, `/etkinlikler`, `/takimlar`, `/mezun-dayanisma`, `/students`, `/alumni` ve detay sayfaları |
| Kendi giriş akışı | `/admin` (dokunulmadı) |

## 5. Doğrulama durumu (bu oturumda çalıştırıldı)

- `npx tsc -p tsconfig.app.json --noEmit` → **0 hata**
- `npx eslint` (değişen dosyalar) → **0 uyarı**
- `npm run build:novite` → **başarılı** (Profil chunk üretildi)
- `npm test` → **30/30 geçti**

> NOT: Tarayıcıda uçtan uca canlı deneme (kayıt → profil → korumalı sayfa) **henüz yapılmadı**, çünkü migration Supabase'e uygulanmadan akış tamamlanamaz. Migration uygulandıktan sonra yapılmalı (bkz. §6).

## 6. Migration sonrası test senaryosu (elle)

1. `npm run dev` → tarayıcıda `/clubs`'a git → `/login`'e yönlendirmeli.
2. **Kayıt ol** (e-posta/şifre) → giriş olmalı → `/clubs`'a tekrar gidince `/profil`'e yönlendirmeli (profil yok).
3. `/profil`'de rol seç, alanları doldur, **Gizli** bırak, kaydet → `/students` veya `/alumni`'ye düşmeli; dizinde adın baş harflerle görünmeli.
4. `/profil`'e dön, **Açık** yap, kaydet → dizinde adın/iletişimin tam görünmeli.
5. **Google ile giriş**i dene (migration + Google ayarları sonrası).
6. İkinci bir kullanıcıyla gir → başka kullanıcının profilini DB'de update edemediğini doğrula (RLS).

## 7. Açık konular / opsiyonel temizlik

- **Kullanılmayan API endpoint'leri:** `api/student-profiles.js`, `api/alumni-profiles.js` ve `server.mjs`'deki kayıtları artık frontend kullanmıyor (yazma RLS'e taşındı). Zararsızlar; istersen ayrı bir temizlik PR'ında kaldırılabilir. Kaldırırsan `api/_shared.test.js`'i de gözden geçir.
- **Header menüsü:** Giriş/Çıkış/Profil linkleri `Header` bileşeninde gözden geçirilebilir (bu oturumda menüye dokunulmadı).
- **Örnek kayıtlar:** Bu oturumdan önce service-role ile eklenen örnek "Ayşe Yılmaz" (mezun) ve "Mehmet Demir" (öğrenci) profillerinin `user_id`'si yok → yeni RLS update politikası onları kimseye düzenletmez (sadece görüntülenirler). Sorun değil; istenirse silinebilir.
- **Test kullanıcısı:** `ornek.uye@example.com` / `Ornek1234!` (Supabase Auth'ta açıldı, test için).
- **Mezun graduation_year:** alumni tarafında DB CHECK yok; öğrenci tarafında `1990–2030 & ≠2010` CHECK var, form buna göre doğruluyor.
