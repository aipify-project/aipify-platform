-- Disposable local harness for Staging-compat + Production visibility candidates.
-- NOT for Staging/Production apply. Synthetic fixtures only.
\set ON_ERROR_STOP on

drop schema if exists public cascade;
create schema public;
create extension if not exists pgcrypto;

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

create table public.companies (
  id uuid primary key,
  name text not null,
  is_platform boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.app_portal_support_requests (
  id uuid primary key,
  company_id uuid not null references public.companies(id),
  title text not null,
  description text,
  category text,
  priority text,
  status text not null,
  channel text,
  related_module text,
  assigned_support_owner_id uuid,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.app_portal_support_request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null,
  company_id uuid not null,
  event_type text not null,
  description text,
  performed_by uuid,
  created_at timestamptz not null default now()
);

-- Stubs required by Production get timeline (not present on Staging get shape).
create table public.platform_support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null,
  direction text,
  body_text text,
  delivery_status text,
  author_user_id uuid,
  author_role text,
  created_at timestamptz not null default now()
);

create table public.platform_support_ticket_admin_audit (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null,
  event_type text not null,
  description text,
  performed_by uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Minimal stubs used by candidates
create or replace function public._ppsf258_require_platform_access()
returns void
language plpgsql
as $$
begin
  if current_setting('app.is_platform_admin', true) is distinct from 'true' then
    raise exception 'Platform portal access denied';
  end if;
end;
$$;

create or replace function public._psstrv1_detail_item(
  p_row public.app_portal_support_requests,
  p_company_name text
)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', p_row.id,
    'company_id', p_row.company_id,
    'company_name', p_company_name,
    'title', p_row.title,
    'channel', coalesce(nullif(trim(p_row.channel), ''), 'app_portal'),
    'status', p_row.status
  );
$$;

insert into public.companies(id, name, is_platform) values
  ('11111111-1111-1111-1111-111111111101', 'Customer APP Co', false),
  ('11111111-1111-1111-1111-111111111102', 'Aipify Platform', true);

insert into public.app_portal_support_requests(
  id, company_id, title, description, category, priority, status, channel, updated_at
) values
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111101',
   'APP ticket', 'app body', 'general', 'medium', 'open', 'app_portal', now()),
  ('b2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111102',
   'Web ticket', 'web body', 'general', 'medium', 'open', 'web', now()),
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111102',
   'Partner ticket', 'partner body', 'general', 'medium', 'open', 'partner', now()),
  ('d4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111102',
   'Hidden platform email', 'email body', 'general', 'medium', 'open', 'email', now());

\echo '=== APPLY STAGING COMPAT CANDIDATE ==='
\i docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_staging_compat_v1.sql

do $$
declare
  v_list jsonb;
  v_counts jsonb;
  v_get jsonb;
  v_ids text;
  v_ov int;
begin
  -- unauthorized
  perform set_config('app.is_platform_admin', 'false', true);
  begin
    perform public.list_platform_app_portal_support_requests();
    raise exception 'expected deny';
  exception
    when others then
      if sqlerrm <> 'Platform portal access denied' then
        raise;
      end if;
  end;

  perform set_config('app.is_platform_admin', 'true', true);
  v_list := public.list_platform_app_portal_support_requests();
  v_counts := public.get_platform_app_portal_support_request_counts();
  v_ids := coalesce((select string_agg(x->>'id', ',' order by x->>'id') from jsonb_array_elements(v_list->'items') x), '');

  if (v_list->>'ok')::boolean is not true then raise exception 'list not ok'; end if;
  if (v_list->'pagination'->>'total')::int <> 3 then
    raise exception 'staging list total expected 3 got % ids=%', v_list->'pagination'->>'total', v_ids;
  end if;
  if v_ids not like '%a1111111-1111-1111-1111-111111111111%' then raise exception 'APP missing'; end if;
  if v_ids not like '%b2222222-2222-2222-2222-222222222222%' then raise exception 'web missing'; end if;
  if v_ids not like '%c3333333-3333-3333-3333-333333333333%' then raise exception 'partner missing'; end if;
  if v_ids like '%d4444444-4444-4444-4444-444444444444%' then raise exception 'email platform leaked'; end if;
  if (v_counts->'counts'->>'total')::int <> 3 then raise exception 'counts mismatch'; end if;
  if to_jsonb(v_list->'channel_values')::text not like '%web%' then raise exception 'channel_values missing web'; end if;

  v_get := public.get_platform_app_portal_support_request('b2222222-2222-2222-2222-222222222222'::uuid);
  if (v_get->>'found')::boolean is not true then raise exception 'get web not found'; end if;
  v_get := public.get_platform_app_portal_support_request('d4444444-4444-4444-4444-444444444444'::uuid);
  if (v_get->>'found')::boolean is not false then raise exception 'get email platform should hide'; end if;

  -- channel filter web
  v_list := public.list_platform_app_portal_support_requests(null, 'web');
  if (v_list->'pagination'->>'total')::int <> 1 then raise exception 'web filter total'; end if;

  -- no 12-arg overload on staging candidate path
  select count(*) into v_ov
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'list_platform_app_portal_support_requests';
  if v_ov <> 1 then raise exception 'unexpected list overloads: %', v_ov; end if;

  -- grants: authenticated yes, anon no, service_role no (staging policy)
  if has_function_privilege('anon', 'public.list_platform_app_portal_support_requests(text,text,text,text,uuid,timestamptz,timestamptz,text,text,integer,integer)', 'execute') then
    raise exception 'anon must not execute list';
  end if;
  if not has_function_privilege('authenticated', 'public.list_platform_app_portal_support_requests(text,text,text,text,uuid,timestamptz,timestamptz,text,text,integer,integer)', 'execute') then
    raise exception 'authenticated must execute list';
  end if;
  if has_function_privilege('service_role', 'public.list_platform_app_portal_support_requests(text,text,text,text,uuid,timestamptz,timestamptz,text,text,integer,integer)', 'execute') then
    raise exception 'service_role must not gain list execute on staging candidate';
  end if;

  raise notice 'STAGING_COMPAT_MATRIX_PASS';
end;
$$;

\echo '=== APPLY PRODUCTION 12-ARG CANDIDATE (separate signature) ==='
\i docs/platform/sql-candidates/platform_support_include_public_web_partner_in_admin_list_v1.sql

do $$
declare
  v_list jsonb;
  v_counts jsonb;
  v_get jsonb;
  v_ids text;
  v_ov int;
begin
  perform set_config('app.is_platform_admin', 'true', true);
  -- Production candidate replaces/adds 12-arg; call with assigned owner null via full signature if needed
  v_list := public.list_platform_app_portal_support_requests(
    null, null, null, null, null, null, null, null, null, 1, 25, null
  );
  v_counts := public.get_platform_app_portal_support_request_counts();
  v_ids := coalesce((select string_agg(x->>'id', ',' order by x->>'id') from jsonb_array_elements(v_list->'items') x), '');

  if (v_list->'pagination'->>'total')::int <> 3 then
    raise exception 'prod list total expected 3 got %', v_list->'pagination'->>'total';
  end if;
  if v_ids like '%d4444444-4444-4444-4444-444444444444%' then raise exception 'prod email leaked'; end if;
  if (v_counts->'counts'->>'total')::int <> 3 then raise exception 'prod counts mismatch'; end if;

  v_get := public.get_platform_app_portal_support_request('c3333333-3333-3333-3333-333333333333'::uuid);
  if (v_get->>'found')::boolean is not true then raise exception 'prod get partner missing'; end if;

  select count(*) into v_ov
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = 'list_platform_app_portal_support_requests';
  -- After Production candidate on top of Staging, expect 2 overloads (11 + 12) in this disposable DB.
  -- Production-only environments should have exactly 1 (12-arg). Documented in report.
  if v_ov < 1 then raise exception 'no list function'; end if;

  raise notice 'PRODUCTION_CANDIDATE_MATRIX_PASS overloads=%', v_ov;
end;
$$;

select 'HARNESS_OK' as status;
