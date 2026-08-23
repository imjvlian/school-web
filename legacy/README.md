# Legacy data preserved from the original Laravel ZIP

This directory documents data that could be recovered from the first `ponpes-nurul-huda.zip` archive.

- `media-manifest.json` lists every migrated image/icon/upload file with original and migrated SHA-256 checksums.
- `recovered-records.json` preserves the only CMS row that could be reconstructed from `storage/logs/laravel.log`. It is not auto-seeded because it is clearly test content and references a missing cover image.

The original `.env` points Laravel at a local MySQL database (`127.0.0.1`, database `nurul-huda-pp`). That MySQL database/dump is not contained in the ZIP. The bundled `database/database.sqlite` is not the live CMS database: it contains Laravel infrastructure tables only, has zero users, and has no `blogs`, `photos`, or `videos` tables.

All bundled public media has been copied into the React project under the same public paths (`/images`, `/icons`, `/storage`). Large raster files are web-optimized for deployment; `media-manifest.json` keeps the source checksums and migrated checksums for auditability.
