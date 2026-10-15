-- Disposable fixture for Platform Support cross-tenant read RPC prepare.
-- Local disposable Postgres only. Never Production/Staging.
\set ON_ERROR_STOP on

create extension if not exists pgcrypto;

do $$ begin create role anon nologin; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role service_role nologin bypassrls; exception when duplicate_object then null; end $$;

create schema if not exists auth;
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

drop table if exists public.app_portal_support_request_audit_logs cascade;
drop table if exists public.app_portal_support_requests cascade;
drop table if exists public.platform_admins cascade;
drop table if exists public.users cascade;
drop table if exists public.companies cascade;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_platform boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid,
  full_name text
);

create table public.platform_admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  role text not null check (role in ('super_admin', 'platform_support')),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.app_portal_support_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'general',
  priority text not null default 'medium',
  status text not null default 'open',
  created_by uuid references public.users (id) on delete set null,
  assigned_support_owner_id uuid references public.users (id) on delete set null,
  related_module text,
  attachments jsonb not null default '[]'::jsonb,
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  channel text not null default 'app_portal'
    check (channel in ('app_portal', 'email', 'chat', 'phone', 'assistant')),
  resolved_at timestamptz
);

create table public.app_portal_support_request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.app_portal_support_requests (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  event_type text not null,
  description text not null default '',
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
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

revoke all on function public._ppsf258_require_platform_access() from public, anon;
grant execute on function public._ppsf258_require_platform_access() to authenticated;

insert into public.companies (id, name, is_platform) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Org Alpha', false),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org Beta', false),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Aipify Platform Co', true);

insert into public.users (id, auth_user_id, full_name) values
  ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Alpha Member'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Beta Member');

insert into public.platform_admins (auth_user_id, role, status) values
  ('51111111-1111-1111-1111-111111111111', 'super_admin', 'active'),
  ('52111111-1111-1111-1111-111111111111', 'platform_support', 'active'),
  ('53111111-1111-1111-1111-111111111111', 'super_admin', 'inactive');

insert into public.app_portal_support_requests (
  id, company_id, title, description, category, priority, status, channel,
  created_by, internal_notes, attachments, created_at, updated_at, resolved_at
) values
  (
    'a1111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Alpha billing question',
    'Alpha description with secret note ALPHA-SECRET',
    'billing', 'high', 'open', 'app_portal',
    '11111111-1111-1111-1111-111111111111',
    'internal alpha only',
    '[{"name":"a.pdf"}]'::jsonb,
    now() - interval '2 days',
    now() - interval '1 day',
    null
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Beta chat escalate',
    'Beta description BETA-SECRET',
    'technical', 'urgent', 'in_review', 'chat',
    '22222222-2222-2222-2222-222222222222',
    'internal beta only',
    '[]'::jsonb,
    now() - interval '3 days',
    now() - interval '2 hours',
    null
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Alpha email resolved',
    'resolved body',
    'general', 'low', 'resolved', 'email',
    '11111111-1111-1111-1111-111111111111',
    '',
    '[]'::jsonb,
    now() - interval '10 days',
    now() - interval '9 days',
    now() - interval '9 days'
  );

insert into public.app_portal_support_request_audit_logs (
  request_id, company_id, event_type, description, performed_by
) values (
  'a1111111-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'created',
  'Support request created',
  '11111111-1111-1111-1111-111111111111'
);

\echo 'FIXTURE_OK'
