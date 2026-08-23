# School Web — PonPes Nurul Huda

React + Vite frontend dengan Supabase sebagai backend CMS.

## Setup
1. Buat project Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Buat user admin di Supabase Authentication.
4. Tambahkan UUID user tersebut ke `public.admin_profiles`.
5. Copy `.env.example` menjadi `.env` dan isi URL + publishable key Supabase.
6. Jalankan `npm install` lalu `npm run dev`.

## Route
- `/` website publik
- `/profil`
- `/berita`
- `/foto`
- `/login`
- `/admin`
- `/admin/artikel`
- `/admin/foto`
- `/admin/video`

Supabase menyediakan Auth, PostgreSQL, Storage, dan Row Level Security.
