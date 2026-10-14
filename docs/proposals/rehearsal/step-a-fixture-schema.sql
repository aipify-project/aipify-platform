-- Disposable Core-compatible fixture for Step A rehearsal ONLY.
-- Synthetic data; no Production secrets/PII.

create extension if not exists pgcrypto;

create schema if not exists auth;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

do $$ begin
  create role anon nologin;
exception when duplicate_object then null;
end $$;
do $$ begin
  create role authenticated nologin;
exception when duplicate_object then null;
end $$;
do $$ begin
  create role service_role nologin;
exception when duplicate_object then null;
end $$;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  is_platform boolean not null default false
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_number text not null,
  company_id uuid references public.companies(id),
  customer_type text not null default 'business',
  company_name text,
  organization_number text,
  full_name text,
  email text not null,
  phone text,
  country text not null default 'NO',
  language text not null default 'en',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  environment_type text not null default 'production',
  slug text,
  timezone text
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  plan_name text not null default 'Business',
  plan_type text not null default 'business',
  status text not null default 'active',
  trial_starts_at timestamptz,
  trial_ends_at timestamptz,
  billing_cycle text not null default 'monthly',
  price_amount numeric not null default 0,
  currency text not null default 'NOK',
  max_users integer not null default 10,
  max_installations integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  plan_key text,
  license_service_status text not null default 'active'
);

create table public.tenant_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers(id) on delete cascade,
  module_key text not null,
  suite_key text,
  enabled boolean not null default true,
  licensed boolean not null default false,
  status text not null default 'enabled',
  activated_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  mode text not null default 'safe',
  settings jsonb not null default '{}'::jsonb,
  enabled_by_user_id uuid,
  enabled_at timestamptz,
  unique (tenant_id, module_key)
);

create table public.platform_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  role text not null,
  created_at timestamptz not null default now(),
  last_login_at timestamptz,
  previous_login_at timestamptz,
  status text not null default 'active',
  suspended_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.platform_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_auth_user_id uuid not null,
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path to public
as $$
  select exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
  );
$$;

create or replace function public._ppsf258_require_platform_access()
returns void
language plpgsql
security definer
set search_path to public
as $$
begin
  if not exists (
    select 1
    from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role in ('super_admin', 'platform_support')
      and coalesce(pa.status, 'active') = 'active'
  ) then
    raise exception 'Platform portal access denied';
  end if;
end;
$$;

create or replace function public.record_platform_admin_audit_event(
  p_action_type text,
  p_target_type text default null,
  p_target_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path to public
as $$
declare
  v_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform Admin access required';
  end if;

  insert into public.platform_admin_audit_logs (
    admin_auth_user_id,
    action_type,
    target_type,
    target_id,
    metadata
  )
  values (
    auth.uid(),
    p_action_type,
    p_target_type,
    p_target_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.is_tenant_module_enabled(
  p_tenant_id uuid,
  p_module_key text
)
returns boolean
language plpgsql
stable
security definer
set search_path to public
as $$
declare
  v_row public.tenant_modules;
begin
  select * into v_row
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = p_module_key;

  if v_row.id is null then return false; end if;
  return v_row.licensed and v_row.enabled and v_row.status in ('enabled', 'trial', 'beta');
end;
$$;

-- Synthetic tenants
insert into public.companies (id, name, slug, is_platform) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'Web Only Co', 'synth-web-only', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'Bedrift Only Co', 'synth-bedrift-only', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'Both Products Co', 'synth-both', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'No Product Co', 'synth-none', false),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'Platform Co', 'synth-platform', true);

insert into public.customers (id, customer_number, company_id, email, slug) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'C-WEB', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'web-only@example.com', 'synth-web-only'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'C-BED', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bedrift-only@example.com', 'synth-bedrift-only'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'C-BOTH', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'both@example.com', 'synth-both'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'C-NONE', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'none@example.com', 'synth-none');

insert into public.subscriptions (customer_id, status, plan_key, license_service_status) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'active', 'business', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'active', 'business', 'active'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'active', 'business', 'active');
-- none-product: no subscription → not eligible

insert into public.tenant_modules (tenant_id, module_key, licensed, enabled, status, activated_at) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'website_kompis', true, true, 'enabled', now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'website_kompis', true, true, 'enabled', now());

-- Platform admin + unauthorized auth identities
insert into public.platform_admins (auth_user_id, role, status) values
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'super_admin', 'active');
