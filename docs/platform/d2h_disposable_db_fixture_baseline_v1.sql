-- =============================================================================
-- D2H disposable-DB fixture baseline (LOCAL ONLY)
-- Minimal stubs so NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql
-- can be applied and security-tested. NOT a Production schema dump.
-- Container: aipify-d2h-disposable-pg @ 127.0.0.1:55432 / db d2h_disposable
-- =============================================================================

create extension if not exists pgcrypto;

-- Roles referenced by Core grants (local disposable only)
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin bypassrls;
  end if;
end;
$$;

create schema if not exists auth;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create table if not exists public.platform_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  role text not null check (role in ('super_admin', 'platform_support')),
  status text not null default 'active'
);

create or replace function public._ppsf258_require_platform_access()
returns void
language plpgsql
security definer
set search_path = public
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

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_platform boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_number text not null unique,
  company_id uuid not null references public.companies(id),
  customer_type text not null default 'company',
  company_name text not null,
  organization_number text,
  email text not null,
  country text,
  language text default 'en',
  status text not null default 'active',
  environment_type text not null default 'production'
    check (environment_type in ('internal', 'pilot', 'customer', 'enterprise', 'production', 'staging')),
  slug text,
  timezone text,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key,
  slug text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create sequence if not exists public.customer_number_seq start 1000;

create or replace function public.format_customer_number(p_n bigint)
returns text
language sql
immutable
as $$
  select 'C' || lpad(p_n::text, 6, '0');
$$;

create or replace function public._mta_sync_organization_from_customer(p_customer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_name text;
begin
  select cu.slug, cu.company_name into v_slug, v_name
  from public.customers cu
  where cu.id = p_customer_id;

  insert into public.organizations (id, slug, name)
  values (p_customer_id, coalesce(v_slug, p_customer_id::text), v_name)
  on conflict (id) do update
    set slug = excluded.slug,
        name = excluded.name;
end;
$$;

create table if not exists public.platform_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  actor_auth_user_id uuid,
  created_at timestamptz not null default now()
);

create or replace function public.record_platform_admin_audit_event(
  p_action_type text,
  p_target_type text,
  p_target_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.platform_admin_audit_logs (
    action_type, target_type, target_id, metadata, actor_auth_user_id
  ) values (
    p_action_type, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb), auth.uid()
  );
end;
$$;

-- Commercial / public exposure tables used by D2G triggers
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.aipify_billing_license_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  license_key text,
  license_type text not null default 'app_subscription',
  license_status text not null default 'pending',
  domain_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  domain text not null,
  domain_status text default 'pending',
  verification_status text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_domains (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  hostname text not null,
  status text default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.installations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  status text default 'pending',
  activated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Pre-existing production fixture tenant (must remain unchanged by apply)
insert into public.companies (id, name, slug, is_platform)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Existing Prod Co', 'existing-prod-co', false)
on conflict (id) do nothing;

insert into public.customers (
  id, customer_number, company_id, company_name, organization_number, email,
  country, status, environment_type, slug
) values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'C000999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Existing Prod Co',
  '123456789',
  'fixture+existing@example.com',
  'NO',
  'active',
  'production',
  'existing-prod-co'
) on conflict (id) do nothing;

insert into public.organizations (id, slug, name)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'existing-prod-co', 'Existing Prod Co')
on conflict (id) do nothing;

-- Actor fixtures
insert into public.platform_admins (auth_user_id, role, status) values
  ('11111111-1111-1111-1111-111111111111', 'super_admin', 'active'),
  ('22222222-2222-2222-2222-222222222222', 'platform_support', 'active')
on conflict (auth_user_id) do nothing;
