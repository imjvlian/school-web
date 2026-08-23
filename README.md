# PonPes Nurul Huda — React + Supabase

Migrasi website Pondok Pesantren Nurul Huda dari Laravel/Blade menjadi React + Vite dengan backend Supabase.

## Stack

- React + Vite
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security

## Data legacy

Seluruh aset publik yang tersedia di ZIP Laravel pertama sudah dipindahkan ke path yang sama di `public/images`, `public/icons`, dan `public/storage`. Konten statis halaman lama juga dipindahkan ke React. Lihat `MIGRATION_NOTES.md` dan folder `legacy/` untuk audit migrasi.

Gambar raster berukuran besar dibuat versi web-optimized agar repository dan deployment tetap ringan tanpa mengubah nama/path. Hash dan ukuran file asli maupun hasil migrasi dicatat di `legacy/media-manifest.json`.

## Setup

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` melalui SQL Editor.
3. Buat user admin melalui Authentication → Users.
4. Tambahkan UUID user ke `admin_profiles` sesuai `supabase/README.md`.
5. Salin `.env.example` menjadi `.env` dan isi URL + publishable key Supabase.
6. Jalankan:

```bash
npm install
npm run dev
```

Public website: `/`  
Admin login: `/login`  
Admin CMS: `/admin`
