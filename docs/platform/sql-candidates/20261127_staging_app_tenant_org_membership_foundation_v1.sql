-- PREPARED_ONLY — NO_SQL_APPLY without exact owner YES.
-- Package: AIPIFY_SUPPORT_APP_CORE_FOUNDATION_STAGING_V1
-- Target: Staging Core auedugihkduoaikfusqe ONLY
-- Purpose: Minimal APP tenant membership tables + _mta_membership_active
--          required by _app_resolve_customer_tenant_for_auth / _apsf260.
-- Source contracts: Production organization_users / organization_user_context
--          + supabase/migrations/20260706000000_multi_tenant_architecture_phase_a1.sql
--          (tables + membership helper ONLY — no modules/settings/FAQ/MTA UI).
-- Does NOT: seed users/companies, send email, touch Platform Support / Intake V3,
--           create a parallel access model, or alter #459 / #383.
--
-- APPROVAL TEXT:
-- "JA STAGING APPLY …/20261127_staging_app_tenant_org_membership_foundation_v1.sql
--  SHA256 <see .sha256 sidecar / preflight report> on auedugihkduoaikfusqe only.
--  No email. No Production. No #459. No #383."

begin;

create table if not exists public.organization_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (
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
  ),
  status text not null default 'active' check (
    status = any (array[
      'invited'::text,
      'active'::text,
      'suspended'::text,
      'removed'::text
    ])
  ),
  invited_by uuid references public.users (id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_users_user_idx
  on public.organization_users (user_id, status);
create index if not exists organization_users_org_idx
  on public.organization_users (organization_id, status);

alter table public.organization_users enable row level security;
revoke all on public.organization_users from public, authenticated, anon;

create table if not exists public.organization_user_context (
  user_id uuid primary key references public.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  updated_at timestamptz not null default now()
);

alter table public.organization_user_context enable row level security;
revoke all on public.organization_user_context from public, authenticated, anon;

create or replace function public._mta_app_user_id()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  select u.id
  into v_user_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;
  return v_user_id;
end;
$$;

revoke all on function public._mta_app_user_id() from public, anon, authenticated;

create or replace function public._mta_membership_active(
  p_organization_id uuid,
  p_user_id uuid default public._mta_app_user_id()
)
returns public.organization_users
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.organization_users;
begin
  select *
  into v_row
  from public.organization_users ou
  where ou.organization_id = p_organization_id
    and ou.user_id = p_user_id
    and ou.status = 'active'
  limit 1;
  return v_row;
end;
$$;

revoke all on function public._mta_membership_active(uuid, uuid) from public, anon, authenticated;

commit;
