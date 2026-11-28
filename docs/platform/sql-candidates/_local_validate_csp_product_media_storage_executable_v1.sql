-- Local disposable harness for csp_product_media_storage_executable_v1
-- Realistic subset of Supabase storage.buckets / storage.objects + platform helpers.
-- Does NOT claim Storage runtime upload PASS — policy evaluation only.

begin;

create schema if not exists public;
create schema if not exists storage;
create schema if not exists auth;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select coalesce(current_setting('app.is_platform_admin', true), 'false')::boolean;
$$;

create table if not exists public.csp_sales_products (
  id uuid primary key default gen_random_uuid(),
  product_key text not null unique,
  publish_app boolean not null default false,
  publish_sale boolean not null default false,
  master_active boolean not null default true,
  logo_path text,
  hero_path text,
  fixed_commission_amount numeric not null default 0
);

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null references storage.buckets(id),
  name text not null,
  owner uuid,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, name)
);

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
end $$;

grant usage on schema storage to authenticated, anon;
grant usage on schema public to authenticated, anon;

alter table storage.objects enable row level security;
alter table storage.objects force row level security;
revoke all on storage.objects from public, anon, authenticated;
grant select, insert, update, delete on storage.objects to authenticated;
grant select, insert, update on storage.objects to anon;
-- Helpers/buckets readable for policy checks in local harness
grant select on storage.buckets to authenticated, anon;
grant select on public.csp_sales_products to authenticated, anon;
grant execute on function public.is_platform_admin() to authenticated, anon;
grant execute on function auth.uid() to authenticated, anon;

insert into public.csp_sales_products (product_key, publish_app, publish_sale, master_active, logo_path, hero_path)
values
  ('kompis_web', false, true, true, null, null),
  ('aipify_voice', false, false, true, null, null)
on conflict (product_key) do nothing;

commit;
