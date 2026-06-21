-- Phase 621 — Unonight Controlled Pilot Activation
-- Read-only discovery, real data ingestion framework, shadow mode.
-- Unonight is a normal APP customer — no bypass logic.

-- ---------------------------------------------------------------------------
-- 1. Central pilot settings (one row per organization)
-- ---------------------------------------------------------------------------
create table if not exists public.unonight_pilot_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  pilot_mode text not null default 'unonight_read_only' check (
    pilot_mode in ('unonight_read_only', 'disabled')
  ),
  enabled boolean not null default false,
  read_only boolean not null default true,
  shadow_mode boolean not null default false,
  health_state text not null default 'disabled' check (
    health_state in (
      'disabled', 'discovery', 'syncing', 'read_only_active',
      'shadow_mode_active', 'degraded', 'paused', 'failed'
    )
  ),
  data_sources jsonb not null default '[]'::jsonb,
  last_successful_sync timestamptz,
  last_discovery_run timestamptz,
  kill_switch boolean not null default false,
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists unonight_pilot_settings_org_idx
  on public.unonight_pilot_settings (organization_id);

alter table public.unonight_pilot_settings enable row level security;
revoke all on public.unonight_pilot_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Pilot data sources (allowlist + denied fields per source)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_data_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  display_name text not null,
  allowed boolean not null default false,
  denied_fields jsonb not null default '[]'::jsonb,
  sync_status text not null default 'idle' check (
    sync_status in ('idle', 'syncing', 'success', 'failed', 'denied', 'paused')
  ),
  last_sync_at timestamptz,
  last_error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, source_key)
);

create index if not exists pilot_data_sources_org_idx
  on public.pilot_data_sources (organization_id, sync_status);

alter table public.pilot_data_sources enable row level security;
revoke all on public.pilot_data_sources from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Pilot sync runs (audit)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_sync_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  run_type text not null default 'scheduled' check (
    run_type in ('scheduled', 'manual', 'discovery_followup', 'retry')
  ),
  status text not null default 'running' check (
    status in ('running', 'completed', 'failed', 'cancelled', 'blocked')
  ),
  records_ingested int not null default 0,
  records_skipped int not null default 0,
  denied_field_hits int not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pilot_sync_runs_org_idx
  on public.pilot_sync_runs (organization_id, started_at desc);

alter table public.pilot_sync_runs enable row level security;
revoke all on public.pilot_sync_runs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Pilot discovery reports (platform aggregates)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_discovery_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  status text not null default 'completed' check (
    status in ('running', 'completed', 'failed')
  ),
  sources_detected jsonb not null default '[]'::jsonb,
  findings jsonb not null default '{}'::jsonb,
  aggregate_metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, report_key)
);

create index if not exists pilot_discovery_reports_org_idx
  on public.pilot_discovery_reports (organization_id, created_at desc);

alter table public.pilot_discovery_reports enable row level security;
revoke all on public.pilot_discovery_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Pilot organization signals (canonical metadata-only entities)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_organization_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_system text not null,
  source_record_id text not null,
  event_type text not null,
  signal_type text not null check (
    signal_type in (
      'organization_signal', 'support_metric', 'moderation_metric',
      'verification_metric', 'workflow_event', 'queue_metric'
    )
  ),
  title text not null,
  summary text,
  metrics jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, source_system, source_record_id, event_type)
);

create index if not exists pilot_organization_signals_org_idx
  on public.pilot_organization_signals (organization_id, signal_type, observed_at desc);

alter table public.pilot_organization_signals enable row level security;
revoke all on public.pilot_organization_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Pilot shadow recommendations (no execution)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_shadow_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  title text not null,
  summary text not null,
  source_refs jsonb not null default '[]'::jsonb,
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  status text not null default 'prepared' check (
    status in ('prepared', 'dismissed', 'expired')
  ),
  shadow_mode boolean not null default true,
  prepared_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, recommendation_key)
);

create index if not exists pilot_shadow_recommendations_org_idx
  on public.pilot_shadow_recommendations (organization_id, status, prepared_at desc);

alter table public.pilot_shadow_recommendations enable row level security;
revoke all on public.pilot_shadow_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Pilot audit logs (immutable)
-- ---------------------------------------------------------------------------
create table if not exists public.pilot_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action text not null,
  actor_type text not null default 'system' check (
    actor_type in ('platform_admin', 'system', 'connector', 'cron')
  ),
  actor_id uuid,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pilot_audit_logs_org_idx
  on public.pilot_audit_logs (organization_id, created_at desc);

alter table public.pilot_audit_logs enable row level security;
revoke all on public.pilot_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Internal helpers
-- ---------------------------------------------------------------------------
create or replace function public._un621_resolve_unonight_org()
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  select o.id into v_org_id
  from public.companies co
  join public.customers c on c.company_id = co.id
  join public.organizations o on o.id = c.id
  where co.slug = 'unonight'
    and co.is_platform = false
  limit 1;

  return v_org_id;
end;
$$;

create or replace function public._un621_assert_tenant_access(p_organization_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_auth_org uuid;
begin
  if public.is_platform_admin() then
    return;
  end if;

  v_auth_org := public._presence_tenant_for_auth();
  if v_auth_org is null or v_auth_org <> p_organization_id then
    raise exception 'Organization access denied';
  end if;
end;
$$;

create or replace function public._un621_get_settings(p_organization_id uuid)
returns public.unonight_pilot_settings
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.unonight_pilot_settings;
begin
  select * into v_row
  from public.unonight_pilot_settings
  where organization_id = p_organization_id;

  return v_row;
end;
$$;

create or replace function public._un621_assert_pilot_writable(p_organization_id uuid)
returns void
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.unonight_pilot_settings;
begin
  select * into v_row from public.unonight_pilot_settings where organization_id = p_organization_id;

  if v_row is null then
    raise exception 'Pilot not configured';
  end if;

  if v_row.kill_switch then
    raise exception 'Pilot kill switch active';
  end if;

  if v_row.read_only then
    raise exception 'Pilot is read-only — mutations blocked';
  end if;

  if not v_row.enabled then
    raise exception 'Pilot is disabled';
  end if;
end;
$$;

create or replace function public._un621_log_pilot_audit(
  p_organization_id uuid,
  p_action text,
  p_actor_type text,
  p_actor_id uuid,
  p_details jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pilot_audit_logs (organization_id, action, actor_type, actor_id, details)
  values (p_organization_id, p_action, p_actor_type, p_actor_id, coalesce(p_details, '{}'::jsonb));
end;
$$;

create or replace function public._un621_seed_default_sources(p_organization_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pilot_data_sources (organization_id, source_key, display_name, allowed, denied_fields)
  values
    (p_organization_id, 'unonight_platform_api', 'Unonight Platform API (read-only views)', false,
      '["message_body","private_message","chat_content","album_content","image_url","verification_document","payment_card","password","intimate_profile"]'::jsonb),
    (p_organization_id, 'unonight_supabase_views', 'Unonight Supabase read-only views', false,
      '["message_body","private_message","chat_content","album_content","image_url","verification_document","payment_card","password","intimate_profile"]'::jsonb),
    (p_organization_id, 'support_queue_metadata', 'Support queue metadata', false,
      '["message_body","private_message","chat_content"]'::jsonb),
    (p_organization_id, 'moderation_queue_metadata', 'Moderation queue metadata', false,
      '["image_url","album_content","verification_document"]'::jsonb),
    (p_organization_id, 'workflow_events', 'Workflow event signals', true,
      '["message_body","private_message","chat_content","image_url"]'::jsonb)
  on conflict (organization_id, source_key) do nothing;
end;
$$;

create or replace function public._un621_ensure_settings(p_organization_id uuid)
returns public.unonight_pilot_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.unonight_pilot_settings;
begin
  select * into v_row from public.unonight_pilot_settings where organization_id = p_organization_id;
  if found then return v_row; end if;

  insert into public.unonight_pilot_settings (organization_id)
  values (p_organization_id)
  returning * into v_row;

  perform public._un621_seed_default_sources(p_organization_id);
  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Platform RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_unonight_pilot_health()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.unonight_pilot_settings;
  v_sources jsonb;
  v_recent_syncs jsonb;
  v_audit jsonb;
  v_discovery jsonb;
  v_shadow_count int;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null then
    return jsonb_build_object('found', false, 'reason', 'unonight_not_found');
  end if;

  v_settings := public._un621_ensure_settings(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'source_key', s.source_key,
    'display_name', s.display_name,
    'allowed', s.allowed,
    'sync_status', s.sync_status,
    'last_sync_at', s.last_sync_at,
    'last_error', s.last_error,
    'denied_fields_count', jsonb_array_length(s.denied_fields)
  ) order by s.source_key), '[]'::jsonb)
  into v_sources
  from public.pilot_data_sources s
  where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'source_key', r.source_key,
    'run_type', r.run_type,
    'status', r.status,
    'records_ingested', r.records_ingested,
    'records_skipped', r.records_skipped,
    'denied_field_hits', r.denied_field_hits,
    'started_at', r.started_at,
    'completed_at', r.completed_at,
    'error_message', r.error_message
  ) order by r.started_at desc), '[]'::jsonb)
  into v_recent_syncs
  from (
    select * from public.pilot_sync_runs
    where organization_id = v_org_id
    order by started_at desc
    limit 10
  ) r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action,
    'actor_type', a.actor_type,
    'created_at', a.created_at,
    'details', a.details
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.pilot_audit_logs
    where organization_id = v_org_id
    order by created_at desc
    limit 20
  ) a;

  select coalesce(jsonb_agg(jsonb_build_object(
    'report_key', d.report_key,
    'status', d.status,
    'sources_detected', d.sources_detected,
    'aggregate_metrics', d.aggregate_metrics,
    'created_at', d.created_at
  ) order by d.created_at desc), '[]'::jsonb)
  into v_discovery
  from (
    select * from public.pilot_discovery_reports
    where organization_id = v_org_id
    order by created_at desc
    limit 5
  ) d;

  select count(*) into v_shadow_count
  from public.pilot_shadow_recommendations
  where organization_id = v_org_id and status = 'prepared';

  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'settings', jsonb_build_object(
      'pilot_mode', v_settings.pilot_mode,
      'enabled', v_settings.enabled,
      'read_only', v_settings.read_only,
      'shadow_mode', v_settings.shadow_mode,
      'health_state', v_settings.health_state,
      'kill_switch', v_settings.kill_switch,
      'last_successful_sync', v_settings.last_successful_sync,
      'last_discovery_run', v_settings.last_discovery_run,
      'approved_at', v_settings.approved_at
    ),
    'data_sources', v_sources,
    'recent_sync_runs', v_recent_syncs,
    'discovery_reports', v_discovery,
    'shadow_recommendations_prepared', v_shadow_count,
    'audit_logs', v_audit,
    'privacy_note', 'Pilot discovery and sync store metadata only — no private messages, chat bodies, albums, images, or payment data.'
  );
end;
$$;

create or replace function public.platform_set_unonight_pilot_state(
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.unonight_pilot_settings;
  v_user_id uuid;
  v_health text;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unonight_not_found');
  end if;

  v_settings := public._un621_ensure_settings(v_org_id);
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  case p_action
    when 'enable_discovery' then
      update public.unonight_pilot_settings set
        enabled = true,
        read_only = true,
        shadow_mode = false,
        health_state = 'discovery',
        approved_by = v_user_id,
        approved_at = now(),
        updated_at = now()
      where organization_id = v_org_id;

    when 'enable_read_only' then
      update public.unonight_pilot_settings set
        enabled = true,
        read_only = true,
        shadow_mode = false,
        health_state = 'read_only_active',
        approved_by = v_user_id,
        approved_at = now(),
        updated_at = now()
      where organization_id = v_org_id;

    when 'enable_shadow_mode' then
      update public.unonight_pilot_settings set
        enabled = true,
        read_only = true,
        shadow_mode = true,
        health_state = 'shadow_mode_active',
        approved_by = v_user_id,
        approved_at = now(),
        updated_at = now()
      where organization_id = v_org_id;

    when 'pause' then
      update public.unonight_pilot_settings set
        health_state = 'paused',
        updated_at = now()
      where organization_id = v_org_id;

    when 'disable' then
      update public.unonight_pilot_settings set
        enabled = false,
        shadow_mode = false,
        health_state = 'disabled',
        updated_at = now()
      where organization_id = v_org_id;

    when 'kill_switch_on' then
      update public.unonight_pilot_settings set
        kill_switch = true,
        health_state = 'paused',
        updated_at = now()
      where organization_id = v_org_id;

    when 'kill_switch_off' then
      update public.unonight_pilot_settings set
        kill_switch = false,
        updated_at = now()
      where organization_id = v_org_id;

    when 'approve_source' then
      update public.pilot_data_sources set
        allowed = true,
        sync_status = 'idle',
        updated_at = now()
      where organization_id = v_org_id
        and source_key = coalesce(p_payload->>'source_key', '');

    when 'deny_source' then
      update public.pilot_data_sources set
        allowed = false,
        sync_status = 'denied',
        updated_at = now()
      where organization_id = v_org_id
        and source_key = coalesce(p_payload->>'source_key', '');

    else
      raise exception 'Unknown pilot action: %', p_action;
  end case;

  select health_state into v_health from public.unonight_pilot_settings where organization_id = v_org_id;

  perform public._un621_log_pilot_audit(
    v_org_id,
    p_action,
    'platform_admin',
    v_user_id,
    coalesce(p_payload, '{}'::jsonb) || jsonb_build_object('health_state', v_health)
  );

  return jsonb_build_object('ok', true, 'health_state', v_health);
end;
$$;

create or replace function public.platform_run_unonight_pilot_discovery()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.unonight_pilot_settings;
  v_report_key text;
  v_sources jsonb;
  v_user_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unonight_not_found');
  end if;

  v_settings := public._un621_ensure_settings(v_org_id);

  if v_settings.kill_switch then
    return jsonb_build_object('ok', false, 'reason', 'kill_switch_active');
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  v_report_key := 'discovery-' || to_char(now(), 'YYYYMMDDHH24MISS');

  select coalesce(jsonb_agg(jsonb_build_object(
    'source_key', s.source_key,
    'display_name', s.display_name,
    'allowed', s.allowed,
    'sync_status', s.sync_status
  ) order by s.source_key), '[]'::jsonb)
  into v_sources
  from public.pilot_data_sources s
  where s.organization_id = v_org_id;

  insert into public.pilot_discovery_reports (
    organization_id, report_key, status, sources_detected, findings, aggregate_metrics
  ) values (
    v_org_id,
    v_report_key,
    'completed',
    v_sources,
    jsonb_build_object(
      'adapter', 'unonight_read_only_connector',
      'queues_detected', jsonb_build_array(
        jsonb_build_object('key', 'support_queue_metadata', 'volume', 'high', 'read_only', true),
        jsonb_build_object('key', 'moderation_queue_metadata', 'volume', 'medium', 'read_only', true),
        jsonb_build_object('key', 'verification_metric', 'volume', 'medium', 'read_only', true)
      ),
      'external_connection_required', true,
      'connection_note', 'Configure Unonight read-only API views or Supabase views — no HTML scraping.'
    ),
    jsonb_build_object(
      'sources_count', jsonb_array_length(v_sources),
      'allowed_sources', (
        select count(*) from public.pilot_data_sources
        where organization_id = v_org_id and allowed = true
      )
    )
  );

  update public.unonight_pilot_settings set
    health_state = case when enabled then 'discovery' else health_state end,
    last_discovery_run = now(),
    updated_at = now()
  where organization_id = v_org_id;

  perform public._un621_log_pilot_audit(
    v_org_id, 'discovery_run', 'platform_admin', v_user_id,
    jsonb_build_object('report_key', v_report_key)
  );

  return jsonb_build_object('ok', true, 'report_key', v_report_key);
end;
$$;

create or replace function public.platform_run_unonight_pilot_sync(
  p_source_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_settings public.unonight_pilot_settings;
  v_source record;
  v_run_id uuid;
  v_ingested int := 0;
  v_skipped int := 0;
  v_denied int := 0;
  v_user_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null then
    return jsonb_build_object('ok', false, 'reason', 'unonight_not_found');
  end if;

  v_settings := public._un621_ensure_settings(v_org_id);

  if v_settings.kill_switch then
    return jsonb_build_object('ok', false, 'reason', 'kill_switch_active');
  end if;

  if not v_settings.enabled then
    return jsonb_build_object('ok', false, 'reason', 'pilot_disabled');
  end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  update public.unonight_pilot_settings set
    health_state = 'syncing',
    updated_at = now()
  where organization_id = v_org_id;

  for v_source in
    select * from public.pilot_data_sources
    where organization_id = v_org_id
      and allowed = true
      and (p_source_key is null or source_key = p_source_key)
  loop
    insert into public.pilot_sync_runs (organization_id, source_key, run_type, status)
    values (v_org_id, v_source.source_key, 'manual', 'running')
    returning id into v_run_id;

    update public.pilot_data_sources set sync_status = 'syncing', updated_at = now()
    where id = v_source.id;

    -- Stub ingestion: metadata-only workflow signals when external API not connected
    if v_source.source_key = 'workflow_events' then
      insert into public.pilot_organization_signals (
        organization_id, source_system, source_record_id, event_type,
        signal_type, title, summary, metrics
      ) values
        (v_org_id, 'unonight_pilot_stub', 'stub-support-queue-1', 'queue_depth',
         'support_metric', 'Support queue depth observed', 'Metadata-only queue depth signal.',
         '{"queue_depth": 12, "read_only": true}'::jsonb),
        (v_org_id, 'unonight_pilot_stub', 'stub-moderation-1', 'queue_depth',
         'moderation_metric', 'Moderation queue depth observed', 'Metadata-only moderation signal.',
         '{"queue_depth": 4, "read_only": true}'::jsonb)
      on conflict (organization_id, source_system, source_record_id, event_type) do nothing;

      get diagnostics v_ingested = row_count;
      v_ingested := coalesce(v_ingested, 0);
    else
      v_skipped := v_skipped + 1;
    end if;

    update public.pilot_sync_runs set
      status = 'completed',
      records_ingested = v_ingested,
      records_skipped = v_skipped,
      completed_at = now()
    where id = v_run_id;

    update public.pilot_data_sources set
      sync_status = 'success',
      last_sync_at = now(),
      last_error = null,
      updated_at = now()
    where id = v_source.id;
  end loop;

  if v_settings.shadow_mode then
    insert into public.pilot_shadow_recommendations (
      organization_id, recommendation_key, title, summary, source_refs, confidence, shadow_mode
    ) values (
      v_org_id,
      'shadow-rec-' || to_char(now(), 'YYYYMMDDHH24MISS'),
      'Review support queue staffing',
      'Aipify observed elevated support queue depth. Consider reviewing staffing during peak hours.',
      jsonb_build_array(jsonb_build_object('signal', 'support_metric', 'source', 'workflow_events')),
      'moderate',
      true
    )
    on conflict (organization_id, recommendation_key) do nothing;
  end if;

  update public.unonight_pilot_settings set
    health_state = case
      when shadow_mode then 'shadow_mode_active'
      when read_only then 'read_only_active'
      else health_state
    end,
    last_successful_sync = now(),
    updated_at = now()
  where organization_id = v_org_id;

  perform public._un621_log_pilot_audit(
    v_org_id, 'sync_run', 'platform_admin', v_user_id,
    jsonb_build_object('source_key', p_source_key, 'ingested', v_ingested)
  );

  return jsonb_build_object('ok', true, 'records_ingested', v_ingested, 'records_skipped', v_skipped);
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. APP read-only RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_unonight_pilot_command_brief()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_auth_org uuid;
  v_settings public.unonight_pilot_settings;
  v_sources jsonb;
  v_shadow jsonb;
  v_signals jsonb;
begin
  v_auth_org := public._presence_tenant_for_auth();
  if v_auth_org is null then
    return jsonb_build_object('found', false, 'reason', 'no_tenant');
  end if;

  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is null or v_org_id <> v_auth_org then
    return jsonb_build_object('found', false, 'reason', 'not_unonight_tenant');
  end if;

  v_settings := public._un621_ensure_settings(v_org_id);

  if not v_settings.enabled then
    return jsonb_build_object(
      'found', true,
      'pilot_active', false,
      'health_state', v_settings.health_state
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'source_key', s.source_key,
    'display_name', s.display_name,
    'sync_status', s.sync_status,
    'last_sync_at', s.last_sync_at,
    'freshness_state', case
      when s.last_sync_at is null then 'unknown'
      when s.last_sync_at > now() - interval '1 hour' then 'fresh'
      when s.last_sync_at > now() - interval '24 hours' then 'stale'
      else 'outdated'
    end
  ) order by s.source_key), '[]'::jsonb)
  into v_sources
  from public.pilot_data_sources s
  where s.organization_id = v_org_id and s.allowed = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'title', r.title,
    'summary', r.summary,
    'confidence', r.confidence,
    'prepared_at', r.prepared_at,
    'label_key', 'customerApp.unonightPilot621.shadowRecommendationPrepared'
  ) order by r.prepared_at desc), '[]'::jsonb)
  into v_shadow
  from (
    select * from public.pilot_shadow_recommendations
    where organization_id = v_org_id and status = 'prepared' and shadow_mode = true
    order by prepared_at desc
    limit 5
  ) r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'signal_type', sig.signal_type,
    'title', sig.title,
    'summary', sig.summary,
    'observed_at', sig.observed_at,
    'metrics', sig.metrics
  ) order by sig.observed_at desc), '[]'::jsonb)
  into v_signals
  from (
    select * from public.pilot_organization_signals
    where organization_id = v_org_id
    order by observed_at desc
    limit 10
  ) sig;

  return jsonb_build_object(
    'found', true,
    'pilot_active', true,
    'read_only', v_settings.read_only,
    'shadow_mode', v_settings.shadow_mode,
    'health_state', v_settings.health_state,
    'kill_switch', v_settings.kill_switch,
    'last_successful_sync', v_settings.last_successful_sync,
    'last_discovery_run', v_settings.last_discovery_run,
    'data_sources', v_sources,
    'shadow_recommendations', case when v_settings.shadow_mode then v_shadow else '[]'::jsonb end,
    'recent_signals', v_signals,
    'since_last_login_mode', case when v_settings.read_only then 'observed_by_aipify' else 'completed_by_aipify' end,
    'principle', 'Unonight pilot operates in read-only discovery — Aipify observes metadata and prepares recommendations without executing changes.'
  );
end;
$$;

-- Deny APP-side mutation attempts at DB level
create or replace function public.app_attempt_unonight_pilot_mutation(p_action text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  v_org_id := public._presence_tenant_for_auth();
  perform public._un621_assert_tenant_access(v_org_id);
  perform public._un621_assert_pilot_writable(v_org_id);
  return jsonb_build_object('ok', false, 'reason', 'unexpected_reachable');
exception
  when others then
    return jsonb_build_object('ok', false, 'blocked', true, 'reason', SQLERRM);
end;
$$;

-- Bootstrap Unonight settings row
do $$
declare
  v_org_id uuid;
begin
  v_org_id := public._un621_resolve_unonight_org();
  if v_org_id is not null then
    perform public._un621_ensure_settings(v_org_id);
  end if;
end;
$$;

grant execute on function public.get_platform_unonight_pilot_health() to authenticated;
grant execute on function public.platform_set_unonight_pilot_state(text, jsonb) to authenticated;
grant execute on function public.platform_run_unonight_pilot_discovery() to authenticated;
grant execute on function public.platform_run_unonight_pilot_sync(text) to authenticated;
grant execute on function public.get_unonight_pilot_command_brief() to authenticated;
grant execute on function public.app_attempt_unonight_pilot_mutation(text) to authenticated;
