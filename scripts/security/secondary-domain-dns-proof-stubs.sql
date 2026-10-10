-- Minimal stubs for isolated secondary-domain DNS security matrix.
-- NOT for Production. Disposable Postgres only.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create schema if not exists auth;

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

create or replace function auth.jwt()
returns jsonb
language sql
stable
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb, '{}'::jsonb);
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
  create role service_role nologin bypassrls;
exception when duplicate_object then null;
end $$;

grant usage on schema public to anon, authenticated, service_role;
grant usage on schema extensions to anon, authenticated, service_role;

create table if not exists public.companies (
  id uuid primary key,
  is_platform boolean not null default false,
  name text
);

create table if not exists public.customers (
  id uuid primary key,
  company_id uuid not null references public.companies(id)
);

create table if not exists public.installations (
  id uuid primary key,
  customer_id uuid references public.customers(id),
  company_id uuid references public.companies(id),
  status text not null default 'active',
  revoked_at timestamptz
);

create table if not exists public.customer_domains (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id),
  domain text not null,
  status text not null default 'pending',
  verification_status text not null default 'pending',
  verification_method text,
  verified_at timestamptz,
  installation_id uuid,
  verification_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.platform_admins (
  auth_user_id uuid primary key,
  role text not null,
  status text not null default 'active'
);

create table if not exists public.platform_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_auth_user_id uuid not null,
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.platform_admin_audit_logs enable row level security;

create table if not exists public.aipify_billing_license_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  license_type text not null default 'app_subscription',
  license_status text not null default 'active',
  domain_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_modules (
  tenant_id uuid not null,
  module_key text not null,
  enabled boolean not null default true,
  primary key (tenant_id, module_key)
);

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid()
      and pa.role in ('super_admin', 'platform_support')
      and coalesce(pa.status, 'active') = 'active'
  );
$$;

create or replace function public._ppsf258_require_platform_access()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform portal access denied';
  end if;
end;
$$;

revoke all on function public._ppsf258_require_platform_access() from public, anon;
grant execute on function public._ppsf258_require_platform_access() to authenticated;

create or replace function public.record_platform_admin_audit_event(
  p_action_type text,
  p_target_type text default null,
  p_target_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform Admin access required';
  end if;
  insert into public.platform_admin_audit_logs (
    admin_auth_user_id, action_type, target_type, target_id, metadata
  ) values (
    auth.uid(), p_action_type, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.record_platform_admin_audit_event(text, text, text, jsonb) to authenticated;

create or replace function public.is_tenant_module_enabled(p_tenant_id uuid, p_module text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select enabled from public.tenant_modules where tenant_id = p_tenant_id and module_key = p_module),
    false
  );
$$;

create or replace function public._platform_portal_normalize_hostname(p_hostname text)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  v text;
begin
  v := lower(btrim(coalesce(p_hostname, '')));
  v := regexp_replace(v, '\.$', '');
  if v !~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$' then
    raise exception 'invalid hostname';
  end if;
  return v;
end;
$$;
