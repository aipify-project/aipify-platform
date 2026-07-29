-- APP Kompis AI Runtime + Business Tool Pack V2.
-- Extends Operator Workspace V1. No customer seeds. No apply-side effects. No AI calls.

create table if not exists public.kompis_operator_drafts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  created_by uuid not null,
  draft_kind text not null
    check (draft_kind in ('organization_profile', 'content', 'knowledge')),
  title text not null default '',
  locale text not null default 'en',
  body jsonb not null default '{}'::jsonb,
  status text not null default 'draft'
    check (status in ('draft', 'superseded', 'archived')),
  version int not null default 1 check (version >= 1),
  idempotency_key text not null,
  run_id uuid references public.kompis_operator_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, idempotency_key)
);

create index if not exists kompis_operator_drafts_org_updated_idx
  on public.kompis_operator_drafts (organization_id, updated_at desc);

create index if not exists kompis_operator_drafts_org_kind_idx
  on public.kompis_operator_drafts (organization_id, draft_kind, status);

alter table public.kompis_operator_drafts enable row level security;

create table if not exists public.kompis_operator_rate_buckets (
  bucket_key text primary key,
  window_started_at timestamptz not null default now(),
  hit_count int not null default 0 check (hit_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.kompis_operator_rate_buckets enable row level security;

alter table public.kompis_operator_runs
  add column if not exists planner_source text not null default 'deterministic'
    check (planner_source in ('deterministic', 'ai', 'ai_fallback')),
  add column if not exists confidence text
    check (confidence is null or confidence in ('high', 'medium', 'low')),
  add column if not exists provider_status text
    check (provider_status is null or provider_status in (
      'not_configured', 'active', 'unavailable', 'fallback'
    ));

create or replace function public._kompis_operator_tool_allowed(p_tool_key text)
returns boolean
language sql
immutable
set search_path = public
as $$
  select p_tool_key in (
    'customer_profile_read',
    'agreement_status_read',
    'license_status_read',
    'domain_installation_status_read',
    'website_kompis_status_read',
    'app_access_status_read',
    'support_cases_read',
    'support_case_read',
    'notifications_read',
    'organization_members_read',
    'activity_summary_read',
    'knowledge_search',
    'content_inventory_read',
    'operator_history_read',
    'support_case_create',
    'support_case_reply',
    'notification_mark_read',
    'organization_profile_draft',
    'content_draft_create',
    'content_draft_update',
    'knowledge_draft_create'
  );
$$;

create or replace function public._kompis_operator_rate_limit_check(
  p_bucket text,
  p_limit int,
  p_window_seconds int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.kompis_operator_rate_buckets;
  v_now timestamptz := now();
  v_key text := nullif(btrim(coalesce(p_bucket, '')), '');
  v_limit int := greatest(coalesce(p_limit, 1), 1);
  v_window int := greatest(coalesce(p_window_seconds, 60), 1);
begin
  if v_key is null or char_length(v_key) > 200 then
    raise exception 'INVALID_RATE_BUCKET' using errcode = 'P0001';
  end if;

  select * into v_row
  from public.kompis_operator_rate_buckets
  where bucket_key = v_key
  for update;

  if not found then
    insert into public.kompis_operator_rate_buckets (bucket_key, window_started_at, hit_count, updated_at)
    values (v_key, v_now, 1, v_now)
    returning * into v_row;
    return jsonb_build_object('allowed', true, 'remaining', v_limit - 1, 'reset_in_seconds', v_window);
  end if;

  if v_row.window_started_at + make_interval(secs => v_window) <= v_now then
    update public.kompis_operator_rate_buckets
    set window_started_at = v_now,
        hit_count = 1,
        updated_at = v_now
    where bucket_key = v_key;
    return jsonb_build_object('allowed', true, 'remaining', v_limit - 1, 'reset_in_seconds', v_window);
  end if;

  if v_row.hit_count >= v_limit then
    return jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'reset_in_seconds', greatest(
        1,
        ceil(extract(epoch from (v_row.window_started_at + make_interval(secs => v_window) - v_now)))::int
      )
    );
  end if;

  update public.kompis_operator_rate_buckets
  set hit_count = hit_count + 1,
      updated_at = v_now
  where bucket_key = v_key;

  return jsonb_build_object(
    'allowed', true,
    'remaining', greatest(v_limit - (v_row.hit_count + 1), 0),
    'reset_in_seconds', greatest(
      1,
      ceil(extract(epoch from (v_row.window_started_at + make_interval(secs => v_window) - v_now)))::int
    )
  );
end;
$$;

revoke all on function public._kompis_operator_rate_limit_check(text, int, int) from public, anon;
grant execute on function public._kompis_operator_rate_limit_check(text, int, int) to authenticated;

create or replace function public.create_app_kompis_operator_draft(
  p_draft_kind text,
  p_title text,
  p_locale text,
  p_body jsonb,
  p_idempotency_key text,
  p_run_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_user uuid := auth.uid();
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_kind text := nullif(btrim(coalesce(p_draft_kind, '')), '');
  v_title text := left(btrim(coalesce(p_title, '')), 200);
  v_locale text := left(nullif(btrim(coalesce(p_locale, '')), ''), 16);
  v_existing public.kompis_operator_drafts;
  v_row public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := (v_access -> 'organization' ->> 'id')::uuid;

  if v_kind is null or v_kind not in ('organization_profile', 'content', 'knowledge') then
    raise exception 'INVALID_DRAFT_KIND' using errcode = 'P0001';
  end if;
  if v_key is null or char_length(v_key) < 8 or char_length(v_key) > 128 then
    raise exception 'INVALID_IDEMPOTENCY_KEY' using errcode = 'P0001';
  end if;
  if v_locale is null then
    v_locale := 'en';
  end if;

  select * into v_existing
  from public.kompis_operator_drafts
  where organization_id = v_org_id
    and idempotency_key = v_key;

  if found then
    return jsonb_build_object(
      'id', v_existing.id,
      'organization_id', v_existing.organization_id,
      'draft_kind', v_existing.draft_kind,
      'title', v_existing.title,
      'locale', v_existing.locale,
      'status', v_existing.status,
      'version', v_existing.version,
      'idempotent_replay', true,
      'published', false
    );
  end if;

  insert into public.kompis_operator_drafts (
    organization_id, created_by, draft_kind, title, locale, body, status, version, idempotency_key, run_id
  ) values (
    v_org_id, v_user, v_kind, coalesce(nullif(v_title, ''), 'Draft'), v_locale,
    coalesce(p_body, '{}'::jsonb), 'draft', 1, v_key, p_run_id
  )
  returning * into v_row;

  perform public.record_trust_audit_event(
    'kompis_operator_draft_created',
    'kompis_operator_draft',
    v_row.id::text,
    jsonb_build_object(
      'organization_id', v_org_id,
      'draft_kind', v_kind,
      'run_id', p_run_id
    )
  );

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'draft_kind', v_row.draft_kind,
    'title', v_row.title,
    'locale', v_row.locale,
    'status', v_row.status,
    'version', v_row.version,
    'idempotent_replay', false,
    'published', false
  );
end;
$$;

revoke all on function public.create_app_kompis_operator_draft(text, text, text, jsonb, text, uuid)
  from public, anon;
grant execute on function public.create_app_kompis_operator_draft(text, text, text, jsonb, text, uuid)
  to authenticated;

create or replace function public.update_app_kompis_operator_draft(
  p_draft_id uuid,
  p_title text,
  p_body jsonb,
  p_expected_version int
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_row public.kompis_operator_drafts;
  v_updated public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := (v_access -> 'organization' ->> 'id')::uuid;

  if p_draft_id is null then
    raise exception 'INVALID_DRAFT' using errcode = 'P0001';
  end if;

  select * into v_row
  from public.kompis_operator_drafts
  where id = p_draft_id
    and organization_id = v_org_id
  for update;

  if not found then
    raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if v_row.status <> 'draft' then
    raise exception 'DRAFT_NOT_EDITABLE' using errcode = 'P0001';
  end if;

  if coalesce(p_expected_version, -1) <> v_row.version then
    raise exception 'DRAFT_VERSION_CONFLICT' using errcode = 'P0001';
  end if;

  update public.kompis_operator_drafts
  set title = coalesce(nullif(left(btrim(coalesce(p_title, '')), 200), ''), title),
      body = coalesce(p_body, body),
      version = version + 1,
      updated_at = now()
  where id = v_row.id
  returning * into v_updated;

  perform public.record_trust_audit_event(
    'kompis_operator_draft_updated',
    'kompis_operator_draft',
    v_updated.id::text,
    jsonb_build_object(
      'organization_id', v_org_id,
      'version', v_updated.version
    )
  );

  return jsonb_build_object(
    'id', v_updated.id,
    'organization_id', v_updated.organization_id,
    'draft_kind', v_updated.draft_kind,
    'title', v_updated.title,
    'locale', v_updated.locale,
    'status', v_updated.status,
    'version', v_updated.version,
    'published', false
  );
end;
$$;

revoke all on function public.update_app_kompis_operator_draft(uuid, text, jsonb, int)
  from public, anon;
grant execute on function public.update_app_kompis_operator_draft(uuid, text, jsonb, int)
  to authenticated;

create or replace function public.list_app_kompis_operator_drafts(p_limit int default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_limit int := least(greatest(coalesce(p_limit, 20), 1), 50);
  v_items jsonb;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := (v_access -> 'organization' ->> 'id')::uuid;

  select coalesce(jsonb_agg(to_jsonb(d) order by d.updated_at desc), '[]'::jsonb)
  into v_items
  from (
    select id, draft_kind, title, locale, status, version, created_at, updated_at
    from public.kompis_operator_drafts
    where organization_id = v_org_id
      and status = 'draft'
    order by updated_at desc
    limit v_limit
  ) d;

  return jsonb_build_object('drafts', v_items);
end;
$$;

revoke all on function public.list_app_kompis_operator_drafts(int) from public, anon;
grant execute on function public.list_app_kompis_operator_drafts(int) to authenticated;

create or replace function public.get_app_kompis_operator_draft(p_draft_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_org_id uuid;
  v_row public.kompis_operator_drafts;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;
  v_org_id := (v_access -> 'organization' ->> 'id')::uuid;

  select * into v_row
  from public.kompis_operator_drafts
  where id = p_draft_id
    and organization_id = v_org_id;

  if not found then
    raise exception 'DRAFT_NOT_FOUND' using errcode = 'P0001';
  end if;

  return jsonb_build_object(
    'id', v_row.id,
    'organization_id', v_row.organization_id,
    'draft_kind', v_row.draft_kind,
    'title', v_row.title,
    'locale', v_row.locale,
    'body', v_row.body,
    'status', v_row.status,
    'version', v_row.version,
    'published', false,
    'created_at', v_row.created_at,
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.get_app_kompis_operator_draft(uuid) from public, anon;
grant execute on function public.get_app_kompis_operator_draft(uuid) to authenticated;
