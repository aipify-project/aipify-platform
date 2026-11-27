-- =============================================================================
-- PREPARED_ONLY — Growth Partners Staging IRP / permission foundation (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) ONLY.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
--
-- Purpose (step 1 of sequenced Staging Core leads work):
--   Create ONLY the missing Identity / permission objects required before any
--   Growth Partner profile, link-resolve, ops-leads, or interest RPC can land.
--
-- Explicitly NOT included (later exact YES steps):
--   - growth_partner_app_profiles / tracking links / _gp455a_resolve_slug
--   - growth_partner_ops_leads / _gp456_access / _gp456_seed (NO sample leads)
--   - register_personal_sales_page_interest / public interest unlock
--   - marketplace_modules / Module Marketplace engines
--   - Production apply, email, Stripe, Support, invoice (#459), #383
--
-- Production shape notes (qbcqoixhrvhnuwphefvw, read-only inspected):
--   organization_modules has status/activated_at/settings (NOT the legacy
--   enabled-only form). No Staging marketplace_modules → no FK to that table.
--   organization_role_permissions.role includes 'growth_partner'.
--   _irp_has_permission body matches IRP org-resolver repair (no
--   _mta_require_organization dependency; Staging lacks that helper).
--
-- Rollback (manual, owner-approved):
--   drop function if exists public._irp_require_permission(text, uuid);
--   drop function if exists public._irp_has_permission(text, uuid);
--   drop function if exists public._irp_user_account_ok(uuid);
--   drop table if exists public.organization_user_permissions;
--   drop table if exists public.organization_role_permissions;
--   drop table if exists public.organization_modules;
--   drop table if exists public.aipify_permissions;
--   -- optional: alter table public.users drop column if exists account_status;
--   Do NOT drop users / organizations / organization_users.
--
-- Hash:
--   shasum -a 256 docs/platform/sql-candidates/growth_partners_staging_irp_permission_foundation_v1.sql
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 0) Preflight — refuse if already present (idempotent skip of whole step)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.aipify_permissions') is not null
     and to_regclass('public.organization_modules') is not null
     and exists (
       select 1 from pg_proc p
       join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = '_irp_has_permission'
     )
  then
    raise notice 'growth_partners_staging_irp_permission_foundation_v1: objects already present — continuing idempotent DDL';
  end if;

  if to_regclass('public.organizations') is null then
    raise exception 'preflight_failed: public.organizations missing on Staging';
  end if;
  if to_regclass('public.organization_users') is null then
    raise exception 'preflight_failed: public.organization_users missing on Staging';
  end if;
  if to_regclass('public.users') is null then
    raise exception 'preflight_failed: public.users missing on Staging';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_mta_app_user_id'
  ) then
    raise exception 'preflight_failed: public._mta_app_user_id missing on Staging';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_mta_membership_active'
  ) then
    raise exception 'preflight_failed: public._mta_membership_active missing on Staging';
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 1) users.account_status — required by _irp_user_account_ok
-- Staging users currently lack this column (Production-compatible default).
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists account_status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'users_account_status_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_account_status_check
      check (account_status in ('active', 'suspended', 'disabled', 'invited'));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2) aipify_permissions (catalog only — no broad marketplace seed)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_permissions (
  id uuid primary key default gen_random_uuid(),
  permission_key text not null unique,
  permission_name text not null,
  module_key text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.aipify_permissions enable row level security;
revoke all on table public.aipify_permissions from public, anon, authenticated;
grant select, insert, update, delete on table public.aipify_permissions to service_role;

-- ---------------------------------------------------------------------------
-- 3) organization_role_permissions / organization_user_permissions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_role_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role text not null,
  permission_key text not null references public.aipify_permissions (permission_key) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, role, permission_key)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_role_permissions_role_check'
      and conrelid = 'public.organization_role_permissions'::regclass
  ) then
    alter table public.organization_role_permissions
      add constraint organization_role_permissions_role_check
      check (
        role = any (array[
          'owner'::text,
          'administrator'::text,
          'manager'::text,
          'support_agent'::text,
          'viewer'::text,
          'employee'::text,
          'moderator'::text,
          'staff'::text,
          'read_only'::text,
          'growth_partner'::text
        ])
      );
  end if;
end
$$;

create index if not exists organization_role_permissions_org_idx
  on public.organization_role_permissions (organization_id, role);

alter table public.organization_role_permissions enable row level security;
revoke all on table public.organization_role_permissions from public, anon, authenticated;
grant select, insert, update, delete on table public.organization_role_permissions to service_role;

create table if not exists public.organization_user_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  permission_key text not null references public.aipify_permissions (permission_key) on delete cascade,
  granted boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, permission_key)
);

alter table public.organization_user_permissions enable row level security;
revoke all on table public.organization_user_permissions from public, anon, authenticated;
grant select, insert, update, delete on table public.organization_user_permissions to service_role;

-- ---------------------------------------------------------------------------
-- 4) organization_modules — Production form (status/activated_at/settings)
-- No FK to marketplace_modules (absent on Staging). module_key is free text.
-- ---------------------------------------------------------------------------
create table if not exists public.organization_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  status text not null default 'inactive',
  activated_at timestamptz,
  configured_at timestamptz,
  deactivated_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'organization_modules_status_check'
      and conrelid = 'public.organization_modules'::regclass
  ) then
    alter table public.organization_modules
      add constraint organization_modules_status_check
      check (
        status = any (array[
          'active'::text,
          'inactive'::text,
          'beta'::text,
          'deprecated'::text,
          'archived'::text
        ])
      );
  end if;
end
$$;

create index if not exists organization_modules_org_idx
  on public.organization_modules (organization_id, status);

alter table public.organization_modules enable row level security;
revoke all on table public.organization_modules from public, anon, authenticated;
grant select, insert, update, delete on table public.organization_modules to service_role;

-- ---------------------------------------------------------------------------
-- 5) Minimal Growth Partner permission catalog keys only (no role grants yet)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
values
  ('growth_partner.view', 'View Growth Partner workspace', 'growth_partner_app', 'Read Growth Partner overview and CRM surfaces.'),
  ('growth_partner.profile', 'Manage Growth Partner profile', 'growth_partner_app', 'Update own Growth Partner profile settings.'),
  ('growth_partner.leads', 'Manage Growth Partner leads', 'growth_partner_app', 'Read and update own attributed leads.'),
  ('growth_partner.customers', 'View Growth Partner customers', 'growth_partner_app', 'Read attributed customers.'),
  ('growth_partner.commissions', 'View Growth Partner commissions', 'growth_partner_app', 'Read commission summaries.'),
  ('growth_partner.payouts', 'View Growth Partner payouts', 'growth_partner_app', 'Read payout status.'),
  ('growth_partner.marketing', 'Use Growth Partner marketing', 'growth_partner_app', 'Access marketing tools.'),
  ('growth_partner.certification', 'Growth Partner certification', 'growth_partner_app', 'Access certification status.'),
  ('growth_partner.training', 'Growth Partner training', 'growth_partner_app', 'Access training content.')
on conflict (permission_key) do nothing;

-- ---------------------------------------------------------------------------
-- 6) IRP helpers — Production-compatible bodies
-- ---------------------------------------------------------------------------
create or replace function public._irp_user_account_ok(
  p_user_id uuid default public._mta_app_user_id()
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  if p_user_id is null then
    return false;
  end if;
  select account_status into v_status from public.users where id = p_user_id;
  if not found then
    return false;
  end if;
  return coalesce(v_status, 'active') = 'active';
end;
$$;

create or replace function public._irp_has_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_membership public.organization_users;
  v_override boolean;
  v_module_key text;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return false; end if;
  if not public._irp_user_account_ok(v_user_id) then return false; end if;

  if p_organization_id is not null then
    v_org_id := p_organization_id;
  else
    select c.id
    into v_org_id
    from public.users u
    join public.customers c on c.company_id = u.company_id
    where u.id = v_user_id
    limit 1;

    if v_org_id is null then
      select ouc.organization_id
      into v_org_id
      from public.organization_user_context ouc
      where ouc.user_id = v_user_id;
    end if;

    if v_org_id is null then
      select ou.organization_id
      into v_org_id
      from public.organization_users ou
      where ou.user_id = v_user_id
        and ou.status = 'active'
      order by ou.joined_at nulls last, ou.created_at
      limit 1;
    end if;
  end if;

  if v_org_id is null then return false; end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null or v_membership.status <> 'active' then return false; end if;

  select granted into v_override
  from public.organization_user_permissions
  where organization_id = v_org_id
    and user_id = v_user_id
    and permission_key = p_permission_key;
  if found then return v_override; end if;

  if not exists (
    select 1
    from public.organization_role_permissions rp
    where rp.organization_id = v_org_id
      and rp.role = v_membership.role
      and rp.permission_key = p_permission_key
  ) then
    return false;
  end if;

  select module_key into v_module_key
  from public.aipify_permissions
  where permission_key = p_permission_key;

  if v_module_key is not null and exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
  ) and not exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id
      and m.module_key = v_module_key
      and m.status in ('active', 'beta')
  ) then
    return false;
  end if;

  return true;
exception when others then
  return false;
end;
$$;

create or replace function public._irp_require_permission(
  p_permission_key text,
  p_organization_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public._irp_has_permission(p_permission_key, p_organization_id) then
    raise exception 'Permission denied: %', p_permission_key;
  end if;
end;
$$;

revoke all on function public._irp_user_account_ok(uuid) from public, anon;
revoke all on function public._irp_has_permission(text, uuid) from public, anon;
revoke all on function public._irp_require_permission(text, uuid) from public, anon;
grant execute on function public._irp_user_account_ok(uuid) to authenticated, service_role;
grant execute on function public._irp_has_permission(text, uuid) to authenticated, service_role;
grant execute on function public._irp_require_permission(text, uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 7) Post-condition notice (verify after apply)
-- ---------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.aipify_permissions') is null
     or to_regclass('public.organization_modules') is null
     or to_regclass('public.organization_role_permissions') is null
     or to_regclass('public.organization_user_permissions') is null
  then
    raise exception 'postcondition_failed: permission tables missing';
  end if;
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_irp_has_permission'
  ) then
    raise exception 'postcondition_failed: _irp_has_permission missing';
  end if;
  raise notice 'growth_partners_staging_irp_permission_foundation_v1: READY';
end
$$;

commit;
