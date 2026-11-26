-- =============================================================================
-- PREPARED_ONLY — Support Center Staging foundation (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
--
-- Purpose: create ONLY the missing objects required by:
--   1) docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql
--   2) docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql
--
-- Explicitly NOT included (avoid broad Staging parity):
--   - Full phase258 dashboard RPCs / subscriptions / support_cases counters
--   - Full phase271 APP portal list/create/update RPCs
--   - Full phase620 history/reopen RPCs
--   - CSP / sales-email CRM objects
--   - Email providers / secrets / DNS
--
-- Compatible subset shapes match Production Core columns used by Support Center:
--   companies(id,name,slug,created_at,is_platform)
--   users(id,auth_user_id,company_id,full_name,role,created_at)
--   app_portal_support_requests (+ channel, resolved_at)
--   app_portal_support_request_audit_logs
--   platform_admins.status (additive; Staging currently lacks it)
--   _ppsf258_require_platform_access()
--
-- Hash:
--   shasum -a 256 docs/platform/sql-candidates/platform_support_center_staging_foundation_minimal_v1.sql
-- =============================================================================

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin;
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 1) platform_admins.status — required by _ppsf258_require_platform_access
-- Staging already has platform_admins(id, auth_user_id, role, created_at)
-- with role check (super_admin|platform_support).
-- ---------------------------------------------------------------------------
alter table public.platform_admins
  add column if not exists status text not null default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'platform_admins_status_check'
      and conrelid = 'public.platform_admins'::regclass
  ) then
    alter table public.platform_admins
      add constraint platform_admins_status_check
      check (status in ('active', 'suspended', 'disabled'));
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 2) Platform access helper only (not whole phase258)
-- ---------------------------------------------------------------------------
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

revoke all on function public._ppsf258_require_platform_access() from public, anon;
grant execute on function public._ppsf258_require_platform_access() to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Minimal companies (Support Center join surface)
-- ---------------------------------------------------------------------------
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  is_platform boolean not null default false
);

-- If companies already existed without is_platform (future-proof):
alter table public.companies
  add column if not exists is_platform boolean not null default false;

alter table public.companies enable row level security;
revoke all on table public.companies from public, anon;
revoke insert, update, delete on table public.companies from authenticated;
-- Keep SELECT tightly closed by default; Platform reads go through security definer RPCs.
revoke select on table public.companies from authenticated;

-- ---------------------------------------------------------------------------
-- 4) Minimal users (FK target for ticket created_by / assignee)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'support', 'staff')),
  created_at timestamptz not null default now()
);

create index if not exists users_company_id_idx on public.users (company_id);
create index if not exists users_auth_user_id_idx on public.users (auth_user_id);

alter table public.users enable row level security;
revoke all on table public.users from public, anon;
revoke insert, update, delete on table public.users from authenticated;
revoke select on table public.users from authenticated;

-- ---------------------------------------------------------------------------
-- 5) Ticket SoT — columns required by Platform read RPCs + Staging write batch
--    (271 base + 620 channel/resolved_at + expanded status set; no APP RPCs)
-- ---------------------------------------------------------------------------
create table if not exists public.app_portal_support_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'general' check (category in (
    'technical', 'billing', 'integrations', 'business_packs', 'account', 'security', 'general'
  )),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  status text not null default 'open' check (status in (
    'open', 'in_review', 'waiting_for_customer', 'waiting_for_aipify',
    'resolved', 'closed', 'reopened', 'archived',
    -- Allow Platform write-ops transition vocabulary used by Staging batch / UI
    'new', 'in_progress', 'waiting_internal'
  )),
  created_by uuid references public.users (id) on delete set null,
  assigned_support_owner_id uuid references public.users (id) on delete set null,
  related_module text,
  attachments jsonb not null default '[]'::jsonb,
  internal_notes text not null default '',
  channel text not null default 'app_portal' check (
    channel in ('app_portal', 'email', 'chat', 'phone', 'assistant')
  ),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Additive columns if a thinner table somehow existed already
alter table public.app_portal_support_requests
  add column if not exists channel text;
alter table public.app_portal_support_requests
  add column if not exists resolved_at timestamptz;
alter table public.app_portal_support_requests
  add column if not exists attachments jsonb;
alter table public.app_portal_support_requests
  add column if not exists internal_notes text;
alter table public.app_portal_support_requests
  add column if not exists related_module text;

update public.app_portal_support_requests
set channel = coalesce(nullif(trim(channel), ''), 'app_portal')
where channel is null or trim(channel) = '';

alter table public.app_portal_support_requests
  alter column channel set default 'app_portal';

do $$
begin
  begin
    alter table public.app_portal_support_requests
      alter column channel set not null;
  exception when others then
    null;
  end;
end
$$;

create index if not exists app_portal_support_requests_company_idx
  on public.app_portal_support_requests (company_id, status, updated_at desc);

alter table public.app_portal_support_requests enable row level security;
revoke all on table public.app_portal_support_requests from public, anon, authenticated;

create table if not exists public.app_portal_support_request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.app_portal_support_requests (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists app_portal_support_request_audit_idx
  on public.app_portal_support_request_audit_logs (request_id, created_at desc);

alter table public.app_portal_support_request_audit_logs enable row level security;
revoke all on table public.app_portal_support_request_audit_logs from public, anon, authenticated;

select 'PREPARED_ONLY_platform_support_center_staging_foundation_minimal_v1' as draft_marker;
