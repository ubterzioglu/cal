# CAL Community

Cağaloğlu Anadolu Lisesi öğrenci ve mezunlarını bir araya getiren dijital topluluk platformu.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

## Analytics (Microsoft Clarity)

Set your Clarity project ID before running the app:

```sh
VITE_CLARITY_ID=YOUR_PROJECT_ID
```

## Build

```sh
npm run build
```

## Coolify Deployment

Bu repo artık Coolify'de `Dockerfile` ile deploy edilebilir.

Gerekli ayarlar:

```sh
Build Pack: Dockerfile
Port: 3000
Health Check Path: /health
```

Environment değişkenleri:

```sh
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLARITY_ID=your-clarity-id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
IP_HASH_SALT=replace-with-a-random-secret
```

Notlar:

- `VITE_` ile başlayan değişkenler build sırasında gereklidir.
- `SUPABASE_SERVICE_ROLE_KEY`, `ALLOWED_ORIGINS` ve `IP_HASH_SALT` runtime sırasında `/api` uçları için kullanılır.
- Uygulama production'da tek container içinde hem Vite çıktısını hem de `api/` uçlarını çalıştırır.

## Preview

```sh
npm run preview
```

## Test

```sh
npm run test
```
