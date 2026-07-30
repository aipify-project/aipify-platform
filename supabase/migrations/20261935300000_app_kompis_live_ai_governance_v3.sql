-- APP Kompis Live AI Governance V3.
-- Extends Operator V1 + Tool Pack V2. No secrets. No provider calls on apply. No customer seeds.

create table if not exists public.kompis_ai_provider_state (
  provider_family text primary key
    check (provider_family in ('openai_compatible')),
  model_profile text not null default 'kompis_planner_balanced_v1',
  status text not null default 'not_configured'
    check (status in (
      'not_configured', 'ready', 'degraded', 'cooldown', 'unavailable', 'disabled'
    )),
  failure_count int not null default 0 check (failure_count >= 0),
  window_started_at timestamptz not null default now(),
  circuit_opened_at timestamptz,
  cooldown_until timestamptz,
  last_health_at timestamptz,
  last_success_at timestamptz,
  last_safe_error_code text,
  last_latency_ms int check (last_latency_ms is null or last_latency_ms >= 0),
  health_cache_until timestamptz,
  last_health_ok boolean,
  updated_at timestamptz not null default now()
);

alter table public.kompis_ai_provider_state enable row level security;

insert into public.kompis_ai_provider_state (provider_family, status)
values ('openai_compatible', 'not_configured')
on conflict (provider_family) do nothing;

create table if not exists public.kompis_ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid,
  actor_id uuid,
  run_id uuid,
  provider_family text not null default 'openai_compatible',
  model_profile text not null,
  planner_source text not null
    check (planner_source in ('deterministic', 'ai', 'ai_fallback', 'health')),
  input_units int check (input_units is null or input_units >= 0),
  output_units int check (output_units is null or output_units >= 0),
  total_units int check (total_units is null or total_units >= 0),
  latency_ms int check (latency_ms is null or latency_ms >= 0),
  result text not null
    check (result in ('success', 'fallback', 'error', 'rate_limited', 'circuit_open')),
  safe_error_code text,
  created_at timestamptz not null default now()
);

create index if not exists kompis_ai_usage_events_created_idx
  on public.kompis_ai_usage_events (created_at desc);

create index if not exists kompis_ai_usage_events_org_created_idx
  on public.kompis_ai_usage_events (organization_id, created_at desc);

alter table public.kompis_ai_usage_events enable row level security;

create or replace function public.get_app_kompis_ai_provider_state()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_access jsonb;
  v_row public.kompis_ai_provider_state;
begin
  v_access := public._kompis_operator_require_access();
  if coalesce((v_access ->> 'available')::boolean, false) is not true then
    raise exception 'KOMPIS_UNAVAILABLE' using errcode = 'P0001';
  end if;

  select * into v_row
  from public.kompis_ai_provider_state
  where provider_family = 'openai_compatible';

  if not found then
    return jsonb_build_object(
      'provider_family', 'openai_compatible',
      'status', 'not_configured',
      'model_profile', 'kompis_planner_balanced_v1',
      'failure_count', 0,
      'circuit_open', false,
      'fallback_available', true
    );
  end if;

  return jsonb_build_object(
    'provider_family', v_row.provider_family,
    'model_profile', v_row.model_profile,
    'status', v_row.status,
    'failure_count', v_row.failure_count,
    'window_started_at', v_row.window_started_at,
    'circuit_opened_at', v_row.circuit_opened_at,
    'cooldown_until', v_row.cooldown_until,
    'last_health_at', v_row.last_health_at,
    'last_success_at', v_row.last_success_at,
    'last_safe_error_code', v_row.last_safe_error_code,
    'last_latency_ms', v_row.last_latency_ms,
    'last_health_ok', v_row.last_health_ok,
    'circuit_open', (
      v_row.cooldown_until is not null and v_row.cooldown_until > now()
    ),
    'fallback_available', true,
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.get_app_kompis_ai_provider_state() from public, anon;
grant execute on function public.get_app_kompis_ai_provider_state() to authenticated;

create or replace function public.get_platform_kompis_ai_status()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.kompis_ai_provider_state;
  v_usage jsonb;
  v_orgs int;
begin
  if not public.is_platform_admin() then
    raise exception 'PLATFORM_FORBIDDEN' using errcode = 'P0001';
  end if;

  select * into v_row
  from public.kompis_ai_provider_state
  where provider_family = 'openai_compatible';

  select coalesce(jsonb_build_object(
    'events_24h', count(*)::int,
    'success_24h', count(*) filter (where result = 'success')::int,
    'fallback_24h', count(*) filter (where result = 'fallback')::int,
    'error_24h', count(*) filter (where result = 'error')::int,
    'avg_latency_ms_24h', coalesce(round(avg(latency_ms))::int, 0)
  ), jsonb_build_object(
    'events_24h', 0, 'success_24h', 0, 'fallback_24h', 0, 'error_24h', 0, 'avg_latency_ms_24h', 0
  ))
  into v_usage
  from public.kompis_ai_usage_events
  where created_at >= now() - interval '24 hours';

  select count(distinct organization_id)::int into v_orgs
  from public.kompis_ai_usage_events
  where created_at >= now() - interval '24 hours'
    and organization_id is not null;

  return jsonb_build_object(
    'provider_family', coalesce(v_row.provider_family, 'openai_compatible'),
    'model_profile', coalesce(v_row.model_profile, 'kompis_planner_balanced_v1'),
    'status', coalesce(v_row.status, 'not_configured'),
    'failure_count', coalesce(v_row.failure_count, 0),
    'window_started_at', v_row.window_started_at,
    'circuit_opened_at', v_row.circuit_opened_at,
    'cooldown_until', v_row.cooldown_until,
    'last_health_at', v_row.last_health_at,
    'last_success_at', v_row.last_success_at,
    'last_safe_error_code', v_row.last_safe_error_code,
    'last_latency_ms', v_row.last_latency_ms,
    'last_health_ok', v_row.last_health_ok,
    'circuit_open', (
      v_row.cooldown_until is not null and v_row.cooldown_until > now()
    ),
    'fallback_available', true,
    'usage_24h', v_usage,
    'active_organizations_24h', coalesce(v_orgs, 0),
    'updated_at', v_row.updated_at
  );
end;
$$;

revoke all on function public.get_platform_kompis_ai_status() from public, anon;
grant execute on function public.get_platform_kompis_ai_status() to authenticated;

create or replace function public.record_kompis_ai_provider_health(
  p_ok boolean,
  p_latency_ms int,
  p_safe_error_code text,
  p_model_profile text,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.kompis_ai_provider_state;
  v_status text := coalesce(nullif(btrim(p_status), ''), 'unavailable');
  v_profile text := coalesce(nullif(btrim(p_model_profile), ''), 'kompis_planner_balanced_v1');
  v_now timestamptz := now();
begin
  if not public.is_platform_admin() then
    raise exception 'PLATFORM_FORBIDDEN' using errcode = 'P0001';
  end if;

  if v_status not in ('not_configured', 'ready', 'degraded', 'cooldown', 'unavailable', 'disabled') then
    raise exception 'INVALID_STATUS' using errcode = 'P0001';
  end if;

  insert into public.kompis_ai_provider_state (provider_family, model_profile, status)
  values ('openai_compatible', v_profile, v_status)
  on conflict (provider_family) do nothing;

  select * into v_row
  from public.kompis_ai_provider_state
  where provider_family = 'openai_compatible'
  for update;

  if p_ok then
    update public.kompis_ai_provider_state
    set status = 'ready',
        model_profile = v_profile,
        failure_count = 0,
        window_started_at = v_now,
        circuit_opened_at = null,
        cooldown_until = null,
        last_health_at = v_now,
        last_success_at = v_now,
        last_safe_error_code = null,
        last_latency_ms = greatest(coalesce(p_latency_ms, 0), 0),
        last_health_ok = true,
        health_cache_until = v_now + interval '5 minutes',
        updated_at = v_now
    where provider_family = 'openai_compatible'
    returning * into v_row;
  else
    update public.kompis_ai_provider_state
    set status = v_status,
        model_profile = v_profile,
        last_health_at = v_now,
        last_safe_error_code = left(coalesce(p_safe_error_code, 'provider_unavailable'), 80),
        last_latency_ms = case when p_latency_ms is null then last_latency_ms else greatest(p_latency_ms, 0) end,
        last_health_ok = false,
        health_cache_until = v_now + interval '2 minutes',
        updated_at = v_now
    where provider_family = 'openai_compatible'
    returning * into v_row;
  end if;

  return jsonb_build_object(
    'provider_family', v_row.provider_family,
    'status', v_row.status,
    'model_profile', v_row.model_profile,
    'last_health_at', v_row.last_health_at,
    'last_latency_ms', v_row.last_latency_ms,
    'last_health_ok', v_row.last_health_ok,
    'circuit_open', (v_row.cooldown_until is not null and v_row.cooldown_until > now()),
    'cooldown_until', v_row.cooldown_until,
    'last_safe_error_code', v_row.last_safe_error_code
  );
end;
$$;

revoke all on function public.record_kompis_ai_provider_health(boolean, int, text, text, text)
  from public, anon;
grant execute on function public.record_kompis_ai_provider_health(boolean, int, text, text, text)
  to authenticated;

create or replace function public.record_kompis_ai_circuit_event(
  p_event text,
  p_safe_error_code text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.kompis_ai_provider_state;
  v_now timestamptz := now();
  v_event text := nullif(btrim(coalesce(p_event, '')), '');
  v_threshold int := 3;
  v_window_seconds int := 300;
  v_cooldown_seconds int := 300;
begin
  if auth.uid() is null then
    raise exception 'UNAUTHORIZED' using errcode = 'P0001';
  end if;

  if v_event is null or v_event not in ('failure', 'success', 'open', 'half_open_success', 'half_open_failure') then
    raise exception 'INVALID_CIRCUIT_EVENT' using errcode = 'P0001';
  end if;

  insert into public.kompis_ai_provider_state (provider_family)
  values ('openai_compatible')
  on conflict (provider_family) do nothing;

  select * into v_row
  from public.kompis_ai_provider_state
  where provider_family = 'openai_compatible'
  for update;

  if v_row.window_started_at + make_interval(secs => v_window_seconds) <= v_now then
    v_row.failure_count := 0;
    v_row.window_started_at := v_now;
  end if;

  if v_event = 'success' or v_event = 'half_open_success' then
    update public.kompis_ai_provider_state
    set failure_count = 0,
        window_started_at = v_now,
        circuit_opened_at = null,
        cooldown_until = null,
        status = case when status = 'disabled' then status else 'ready' end,
        last_success_at = v_now,
        last_safe_error_code = null,
        updated_at = v_now
    where provider_family = 'openai_compatible'
    returning * into v_row;
  elsif v_event in ('failure', 'half_open_failure', 'open') then
    v_row.failure_count := v_row.failure_count + 1;
    if v_event = 'open' or v_row.failure_count >= v_threshold then
      update public.kompis_ai_provider_state
      set failure_count = greatest(v_row.failure_count, v_threshold),
          window_started_at = v_row.window_started_at,
          circuit_opened_at = v_now,
          cooldown_until = v_now + make_interval(secs => v_cooldown_seconds),
          status = 'cooldown',
          last_safe_error_code = left(coalesce(p_safe_error_code, 'circuit_open'), 80),
          updated_at = v_now
      where provider_family = 'openai_compatible'
      returning * into v_row;
    else
      update public.kompis_ai_provider_state
      set failure_count = v_row.failure_count,
          window_started_at = v_row.window_started_at,
          status = 'degraded',
          last_safe_error_code = left(coalesce(p_safe_error_code, 'provider_unavailable'), 80),
          updated_at = v_now
      where provider_family = 'openai_compatible'
      returning * into v_row;
    end if;
  end if;

  return jsonb_build_object(
    'provider_family', v_row.provider_family,
    'status', v_row.status,
    'failure_count', v_row.failure_count,
    'circuit_open', (v_row.cooldown_until is not null and v_row.cooldown_until > now()),
    'cooldown_until', v_row.cooldown_until,
    'last_safe_error_code', v_row.last_safe_error_code
  );
end;
$$;

revoke all on function public.record_kompis_ai_circuit_event(text, text) from public, anon;
grant execute on function public.record_kompis_ai_circuit_event(text, text) to authenticated;

create or replace function public.record_kompis_ai_usage_event(
  p_organization_id uuid,
  p_actor_id uuid,
  p_run_id uuid,
  p_provider_family text,
  p_model_profile text,
  p_planner_source text,
  p_input_units int,
  p_output_units int,
  p_total_units int,
  p_latency_ms int,
  p_result text,
  p_safe_error_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_source text := coalesce(nullif(btrim(p_planner_source), ''), 'deterministic');
  v_result text := coalesce(nullif(btrim(p_result), ''), 'error');
begin
  if auth.uid() is null then
    raise exception 'UNAUTHORIZED' using errcode = 'P0001';
  end if;

  if v_source not in ('deterministic', 'ai', 'ai_fallback', 'health') then
    raise exception 'INVALID_PLANNER_SOURCE' using errcode = 'P0001';
  end if;
  if v_result not in ('success', 'fallback', 'error', 'rate_limited', 'circuit_open') then
    raise exception 'INVALID_USAGE_RESULT' using errcode = 'P0001';
  end if;

  insert into public.kompis_ai_usage_events (
    organization_id, actor_id, run_id, provider_family, model_profile, planner_source,
    input_units, output_units, total_units, latency_ms, result, safe_error_code
  ) values (
    p_organization_id,
    coalesce(p_actor_id, auth.uid()),
    p_run_id,
    coalesce(nullif(btrim(p_provider_family), ''), 'openai_compatible'),
    coalesce(nullif(btrim(p_model_profile), ''), 'kompis_planner_balanced_v1'),
    v_source,
    p_input_units,
    p_output_units,
    p_total_units,
    p_latency_ms,
    v_result,
    left(p_safe_error_code, 80)
  )
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'recorded', true);
end;
$$;

revoke all on function public.record_kompis_ai_usage_event(
  uuid, uuid, uuid, text, text, text, int, int, int, int, text, text
) from public, anon;
grant execute on function public.record_kompis_ai_usage_event(
  uuid, uuid, uuid, text, text, text, int, int, int, int, text, text
) to authenticated;
