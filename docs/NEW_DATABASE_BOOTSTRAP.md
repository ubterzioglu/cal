# Yeni Database Bootstrap

Bu repo, yeni bir Supabase projesini ayağa kaldırmak için artık tek dosyalık bir bootstrap migration içeriyor:

- [supabase/migrations/202606180001_reconstruct_schema_for_fresh_projects.sql](/C:/temp_private/cal/supabase/migrations/202606180001_reconstruct_schema_for_fresh_projects.sql:1)

## Ne Oluşturur?

- `clubs`
- `student_events`
- `student_teams`
- `club_admins`
- `event_admins`
- `team_admins`
- `alumni_profiles`
- `student_profiles`
- `alumni_solidarity_topics`
- `alumni_solidarity_comments`
- `api_rate_limit_events`
- Public view'lar
- Admin atama RPC'leri
- Temel RLS policy'leri

## Neye Göre Hazırlandı?

Bu dosya üç kaynağın birleşiminden çıkarıldı:

- Repo içindeki mevcut `supabase/migrations/*.sql`
- Frontend'in beklediği tablo ve view adları
- API katmanının kullandığı alanlar (`text_hash`, `whatsapp_number`, `api_rate_limit_events` gibi)

## Önemli Not

Repodaki dokümantasyon, bazı daha yeni migration dosyalarından bahsediyor; ancak bu dosyalar çalışma kopyasında yok. Bu yüzden bootstrap SQL'i mevcut kod davranışına göre yeniden kuruldu. Başka bir deyişle:

- Bu dosya yeni, boş bir veritabanını uygulamanın beklediği şemaya getirmek için uygundur.
- Eski veritabanındaki gerçek veriyi birebir yedekleyip geri yüklemez.
- Auth kullanıcıları ve Storage objeleri bu dosya ile taşınmaz.

## Sonraki Adım

Yeni projeye geçmeden önce ideal akış:

1. Bu migration'ı yeni boş Supabase projesine uygula.
2. Eski veritabanından veri dump al.
3. Tablo verilerini yeni projeye taşı.
4. Auth kullanıcılarını ayrıca migrate et.
5. Yeni `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` değerlerini deploy ortamına gir.
