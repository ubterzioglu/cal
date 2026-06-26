# Proje Notları

## Hesap Bilgileri

| Servis   | Kullanıcı / Email         | Notlar                          |
|----------|---------------------------|---------------------------------|
| **Mail** | calcomweb@gmail.com       | Proje ana mail adresi           |
| **GitHub** | calcomweb                | SSH key bağlı (ed25519)         |
| **Vercel** | ubterzioglu              | CLI bağlı                       |
| **Supabase** | calcomweb@gmail.com    | CLI token ile login             |

## Supabase

- **Doğru Proje:** `jtsohmvbyftwzkvzyopy` (calcom.club — aktif/yeni DB)
- **Eski (kullanılmıyor):** `xllosidsyodtvghslymq`, `pkbmcfpcvjmvjzqzixyc`, `jqpsdjqwzkwicjebbnzx`
- **URL:** `https://jtsohmvbyftwzkvzyopy.supabase.co`
- **Migration Durumu:** Tüm migration'lar uygulandı (bootstrap 202606180001 + 13 eski migration kaydı senkron)
- **Region:** Central EU (Frankfurt)

## GitHub

- **SSH Key:** `~/.ssh/id_ed25519_github`
- **Repo:** calcomweb (organization/user)

## Vercel

- **Kullanıcı:** ubterzioglu
- **CLI Versiyon:** 50.5.0
- **URL:** https://calcom-rosy-two.vercel.app
- **Durum:** Production Deploy edildi. Env değişkenleri eklendi.
- **Git:** GitHub repo (calcomweb/calcom) bağlı.

## Yapılacaklar

- [x] Supabase migration'ları yeni DB'ye uygulandı (bootstrap ile - `jtsohmvbyftwzkvzyopy`)
- [ ] Boş Supabase projesi (jqpsdjqwzkwicjebbnzx) silinecek
- [x] Vercel'de yeni proje oluşturulacak
- [x] GitHub repo'su Vercel'e bağlanacak
