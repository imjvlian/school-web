# Migration notes — Laravel → React + Supabase

## Source architecture

- Laravel 11 / PHP 8.2
- Blade templates
- Eloquent models: Blog, Photo, Video, User
- Laravel session authentication
- MySQL configured in the original `.env` (`127.0.0.1`, database `nurul-huda-pp`)
- Local/public file uploads

## Final architecture

- React + Vite
- React Router
- Supabase Auth for admin login
- Supabase PostgreSQL for Blog, Photo, Video
- Supabase Storage for new article/gallery uploads
- Row Level Security for public read + admin-only writes
- Legacy static media from the first ZIP is preserved under its original `/public` paths
- Static hosting compatible with Vercel

## Data migrated from the first ZIP

The migration preserves every content asset that actually exists in the archive:

- all files from `public/images/`
- all files from `public/icons/`
- all files from `public/storage/artikel/`
- all files from `public/storage/content-artikel/`
- all files from `public/storage/photo/`
- original favicon and robots.txt
- hard-coded home page content, programs, contacts, map, YouTube link, profile text, vision and mission

A checksum inventory is stored in `legacy/media-manifest.json`. Large raster images use web-optimized copies at the same public paths; the manifest records the original ZIP and migrated SHA-256/size values.

## CMS database limitation in the original ZIP

The original Laravel `.env` uses MySQL, but no MySQL dump/data directory is included in the ZIP. The bundled `database/database.sqlite` is not the CMS database: it contains only Laravel infrastructure tables, has zero users, and does not contain `blogs`, `photos`, or `videos`.

One old Blog row could be reconstructed from an exception dump inside `storage/logs/laravel.log`. It is preserved in `legacy/recovered-records.json`, but it is not inserted into Supabase automatically because it is obvious test content (`awsdasd`) and its referenced image (`1715161880.jpg`) is not in the ZIP.

No historical rows were invented. If the original MySQL dump is provided later, those rows can be imported into Supabase without changing the React frontend.

## Authentication

The Laravel `UserSeeder` contains a development/default credential. It is intentionally not migrated into the public repository or Supabase. Create a new Supabase Auth user and register its UUID in `admin_profiles` instead.
