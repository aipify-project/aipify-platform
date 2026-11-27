-- SQL CANDIDATE — NOT APPLIED
-- Task: AIPIFY_CUSTOMER360_STAGING_DEPENDENCY_PREFLIGHT_V1
-- Target: Staging only — auedugihkduoaikfusqe (aipify-core-staging)
-- Purpose: Minimal additive schema so contact-RPC
--          update_platform_portal_customer_primary_contact can be applied later.
--
-- Sources (do NOT replay full historical CREATE TABLE migrations on Staging):
--   • columns: supabase/migrations/20260610190000_customer_billing_subscription_foundation.sql
--   • audit:   supabase/migrations/20261441000000_portal_separation_platform_audit.sql
-- Prerequisite already present on Staging: public.is_platform_admin(), public.platform_admins
--
-- IN SCOPE (additive / idempotent only):
--   1) customers.full_name, customers.phone, customers.updated_at
--   2) platform_admin_audit_logs + RLS policies
--   3) record_platform_admin_audit_event(...)
--
-- OUT OF SCOPE (separate owner YES):
--   • contact RPC apply
--   • Production (qbcqoixhrvhnuwphefvw)
--   • billing_profiles / subscriptions / invoices / payment_profiles
--   • organization_registration_profiles
--   • seeding platform_admins or auth users
--   • UPDATE of existing full_name/phone values
--   • DROP TABLE / DELETE FROM customers
--
-- Gate: exact owner YES required before apply. Compute SHA256 at apply time.

-- ---------------------------------------------------------------------------
-- 1) customers contact columns (nullable name/phone; updated_at NOT NULL)
-- ---------------------------------------------------------------------------
alter table public.customers
  add column if not exists full_name text;

alter table public.customers
  add column if not exists phone text;

alter table public.customers
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'customers'
      and column_name = 'updated_at'
      and is_nullable = 'YES'
  ) then
    update public.customers
    set updated_at = now()
    where updated_at is null;

    alter table public.customers
      alter column updated_at set default now();

    alter table public.customers
      alter column updated_at set not null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- 2) Platform Admin audit trail (from 20261441000000, idempotent wrappers)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_auth_user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_admin_audit_logs_admin_created_idx
  on public.platform_admin_audit_logs (admin_auth_user_id, created_at desc);

alter table public.platform_admin_audit_logs enable row level security;

drop policy if exists platform_admin_audit_logs_select on public.platform_admin_audit_logs;
create policy platform_admin_audit_logs_select on public.platform_admin_audit_logs
  for select to authenticated
  using (public.is_platform_admin());

drop policy if exists platform_admin_audit_logs_insert on public.platform_admin_audit_logs;
create policy platform_admin_audit_logs_insert on public.platform_admin_audit_logs
  for insert to authenticated
  with check (
    admin_auth_user_id = auth.uid()
    and public.is_platform_admin()
  );

-- No UPDATE/DELETE policies — RLS default-deny for those commands.

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

revoke all on function public.record_platform_admin_audit_event(text, text, text, jsonb)
  from public, anon;

grant execute on function public.record_platform_admin_audit_event(text, text, text, jsonb)
  to authenticated;

-- ROLLBACK (manual, owner-only — do not auto-run):
--   drop function if exists public.record_platform_admin_audit_event(text, text, text, jsonb);
--   drop table if exists public.platform_admin_audit_logs;
--   alter table public.customers drop column if exists full_name;
--   alter table public.customers drop column if exists phone;
--   alter table public.customers drop column if exists updated_at;
-- Note: column DROP is destructive only if contact data was written afterward.
