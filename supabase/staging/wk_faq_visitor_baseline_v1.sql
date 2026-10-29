-- AIPIFY CORE STAGING — Website Kompis visitor FAQ baseline v1
-- Exact task: AIPIFY_CORE_STAGING_BASELINE_AND_SQL396_CONTROLLED_LIVE_PLAN_V1
-- Target environment when authorized: auedugihkduoaikfusqe (aipify-core-staging)
--
-- PURPOSE: Bring an empty Staging public schema to the MINIMUM object set
-- required to apply Production migrations 202619325 → 202619382 → 202619396
-- for visitor FAQ search eligibility QA. Synthetic schema only.
--
-- NOT a full Core replay. Does NOT copy Production tenants/FAQ/secrets.
-- DO NOT APPLY without owner approval of this exact file + SHA-256.
-- Idempotent: safe to re-run (IF NOT EXISTS / CREATE OR REPLACE).

create schema if not exists supabase_migrations;

create table if not exists supabase_migrations.schema_migrations (
  version text primary key
);

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
end
$$;

grant usage on schema public to anon, authenticated;

-- Minimal tenant / install / domain trust tables (no Production FKs / no users)
create table if not exists public.customers (
  id uuid primary key,
  company_id uuid
);

create table if not exists public.installations (
  id uuid primary key,
  customer_id uuid,
  company_id uuid,
  site_url text,
  revoked_at timestamptz,
  status text
);

create table if not exists public.customer_domains (
  customer_id uuid,
  domain text,
  verification_status text,
  status text,
  installation_id uuid
);

create index if not exists staging_wk_customer_domains_domain_idx
  on public.customer_domains (domain);

-- Visitor FAQ rows: columns used by search_tenant_public_visitor_knowledge
-- (no created_by/users FKs — Staging visitor-path only)
create table if not exists public.tenant_public_companion_faq_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  install_id uuid,
  domain text,
  locale text not null,
  title text not null,
  question text,
  answer text not null,
  category text,
  content_type text not null default 'faq',
  status text not null,
  public_safe boolean not null default false,
  surface text not null default 'website_kompis',
  priority integer not null default 100,
  tags text[] not null default '{}'::text[],
  source_url text,
  valid_from timestamptz,
  valid_until timestamptz,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create or replace function public.normalize_domain(p_domain text)
returns text
language sql
immutable
set search_path = public
as $$
  select nullif(
    lower(
      regexp_replace(
        regexp_replace(trim(coalesce(p_domain, '')), '^https?://', '', 'i'),
        '/.*$',
        ''
      )
    ),
    ''
  );
$$;

-- Same contract as Production resolve used by visitor search (install + verified domain)
create or replace function public._wpkf_resolve_visitor_context(
  p_install_id uuid,
  p_domain text
)
returns table (
  tenant_id uuid,
  resolved_install_id uuid,
  resolved_domain text
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_domain text := public.normalize_domain(p_domain);
  v_tenant uuid;
  v_install uuid;
begin
  if p_install_id is not null then
    select i.customer_id, i.id
    into v_tenant, v_install
    from public.installations i
    where i.id = p_install_id
      and i.revoked_at is null
      and i.status in ('ready', 'installing', 'active', 'warning')
    limit 1;

    if v_install is null then
      return;
    end if;

    if v_domain is not null and not exists (
      select 1
      from public.customer_domains cd
      where cd.customer_id = v_tenant
        and cd.domain = v_domain
        and cd.verification_status = 'verified'
        and cd.status = 'active'
        and (cd.installation_id is null or cd.installation_id = p_install_id)
    ) then
      return;
    end if;

    tenant_id := v_tenant;
    resolved_install_id := v_install;
    resolved_domain := v_domain;
    return next;
    return;
  end if;

  return;
end;
$$;

revoke all on function public._wpkf_resolve_visitor_context(uuid, text) from public, anon;
comment on function public._wpkf_resolve_visitor_context(uuid, text) is
  'Staging WK FAQ baseline: install-scoped visitor context. Not a Production dump.';

insert into supabase_migrations.schema_migrations (version)
values ('staging_wk_faq_visitor_baseline_v1')
on conflict (version) do nothing;
