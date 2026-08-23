# PonPes Nurul Huda — React + Supabase

Frontend Laravel/Blade telah dikonversi ke React + Vite, dan backend Laravel diganti dengan Supabase.

## Stack

- React + Vite
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Row Level Security

## Quick start

1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Buat user admin di Authentication -> Users dan tambahkan UUID-nya ke `admin_profiles` seperti instruksi di `supabase/README.md`.
4. Salin `.env.example` menjadi `.env` dan isi URL/key Supabase.
5. Jalankan:

```bash
npm install
npm run dev
```

Public website: `/`
Admin login: `/login`
Admin CMS: `/admin`

Lihat `supabase/README.md` untuk setup lengkap dan `MIGRATION_NOTES.md` untuk pemetaan dari Laravel.
