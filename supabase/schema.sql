-- PonPes Nurul Huda CMS - Supabase backend
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  image_path text,
  "desc" text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  image_path text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  youtube_code text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at before update on public.blogs for each row execute function public.set_updated_at();
drop trigger if exists photos_set_updated_at on public.photos;
create trigger photos_set_updated_at before update on public.photos for each row execute function public.set_updated_at();
drop trigger if exists videos_set_updated_at on public.videos;
create trigger videos_set_updated_at before update on public.videos for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admin_profiles enable row level security;
alter table public.blogs enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;

drop policy if exists "Read own admin profile" on public.admin_profiles;
create policy "Read own admin profile"
on public.admin_profiles for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public read published blogs" on public.blogs;
create policy "Public read published blogs" on public.blogs for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage blogs" on public.blogs;
create policy "Admins manage blogs" on public.blogs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published photos" on public.photos;
create policy "Public read published photos" on public.photos for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage photos" on public.photos;
create policy "Admins manage photos" on public.photos for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published videos" on public.videos;
create policy "Public read published videos" on public.videos for select to anon, authenticated using (published or public.is_admin());
drop policy if exists "Admins manage videos" on public.videos;
create policy "Admins manage videos" on public.videos for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cms-media',
  'cms-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read cms media" on storage.objects;
create policy "Public read cms media" on storage.objects for select to public using (bucket_id = 'cms-media');
drop policy if exists "Admins insert cms media" on storage.objects;
create policy "Admins insert cms media" on storage.objects for insert to authenticated with check (bucket_id = 'cms-media' and public.is_admin());
drop policy if exists "Admins update cms media" on storage.objects;
create policy "Admins update cms media" on storage.objects for update to authenticated using (bucket_id = 'cms-media' and public.is_admin()) with check (bucket_id = 'cms-media' and public.is_admin());
drop policy if exists "Admins delete cms media" on storage.objects;
create policy "Admins delete cms media" on storage.objects for delete to authenticated using (bucket_id = 'cms-media' and public.is_admin());
