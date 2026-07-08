-- Phase 266 — Payment Provider Health Monitor

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.payment_provider_health_metrics (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null unique check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  health_status text not null default 'operational' check (
    health_status in ('operational', 'warning', 'offline')
  ),
  environment text not null default 'sandbox' check (environment in ('sandbox', 'production')),
  api_connection_status text not null default 'disconnected' check (
    api_connection_status in ('connected', 'disconnected', 'degraded')
  ),
  webhook_status text not null default 'not_configured',
  last_successful_transaction_at timestamptz,
  last_synchronization_at timestamptz,
  failed_events_24h integer not null default 0,
  success_rate_30d numeric(5, 2) not null default 100,
  check_interval_minutes integer not null default 5,
  last_health_check_at timestamptz,
  next_health_check_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_provider_health_alerts (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  alert_type text not null,
  title text not null,
  summary text not null,
  resolved boolean not null default false,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists payment_provider_health_alerts_open_idx
  on public.payment_provider_health_alerts (resolved, severity, created_at desc);

create table if not exists public.payment_provider_health_audit_logs (
  id uuid primary key default gen_random_uuid(),
  provider_key text not null check (provider_key in ('klarna', 'vipps', 'stripe', 'dnb')),
  event_type text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  summary text not null,
  resolution_status text not null default 'open' check (
    resolution_status in ('open', 'resolved', 'acknowledged')
  ),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payment_provider_health_audit_logs_created_idx
  on public.payment_provider_health_audit_logs (created_at desc);

alter table public.payment_provider_health_metrics enable row level security;
alter table public.payment_provider_health_alerts enable row level security;
alter table public.payment_provider_health_audit_logs enable row level security;

revoke all on public.payment_provider_health_metrics from authenticated, anon;
revoke all on public.payment_provider_health_alerts from authenticated, anon;
revoke all on public.payment_provider_health_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pph266_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pph266_check_interval(p_provider text)
returns integer
language sql
immutable
as $$
  select case when p_provider = 'dnb' then 30 else 5 end;
$$;

create or replace function public._pph266_map_health_status(p_settings_status text, p_api_connected boolean)
returns text
language sql
immutable
as $$
  select case
    when p_settings_status = 'disabled' then 'offline'
    when p_settings_status = 'requires_attention' then 'warning'
    when p_settings_status = 'operational' and p_api_connected then 'operational'
    when p_settings_status = 'operational' and not p_api_connected then 'warning'
    when p_settings_status = 'pending_setup' and p_api_connected then 'warning'
    else 'offline'
  end;
$$;

create or replace function public._pph266_provider_failed_24h(p_provider text)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::int
  from public.payment_provider_audit_logs
  where scope = 'platform'
    and provider_key = p_provider
    and event_type = 'payment_failed'
    and created_at >= now() - interval '24 hours';
$$;

create or replace function public._pph266_provider_success_rate_30d(p_provider text)
returns numeric
language sql
stable
security definer
set search_path = public
as $$
  with counts as (
    select
      count(*) filter (where event_type = 'payment_succeeded') as successes,
      count(*) filter (where event_type = 'payment_failed') as failures
    from public.payment_provider_audit_logs
    where scope = 'platform'
      and provider_key = p_provider
      and created_at >= now() - interval '30 days'
  )
  select case
    when successes + failures = 0 then 100.00
    else round((successes::numeric / (successes + failures)::numeric) * 100, 2)
  end
  from counts;
$$;

create or replace function public._pph266_last_successful_transaction(p_provider text)
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select max(created_at)
  from public.payment_provider_audit_logs
  where scope = 'platform'
    and provider_key = p_provider
    and event_type = 'payment_succeeded';
$$;

create or replace function public._pph266_log_health_audit(
  p_provider text,
  p_event_type text,
  p_severity text,
  p_summary text,
  p_resolution_status text default 'open',
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.payment_provider_health_audit_logs (
    provider_key, event_type, severity, summary, resolution_status, context
  ) values (
    p_provider, p_event_type, p_severity, p_summary, p_resolution_status, coalesce(p_context, '{}'::jsonb)
  );
end;
$$;

create or replace function public._pph266_ensure_metrics(p_provider text)
returns public.payment_provider_health_metrics
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.payment_provider_health_metrics;
begin
  insert into public.payment_provider_health_metrics (
    provider_key, check_interval_minutes, next_health_check_at
  ) values (
    p_provider,
    public._pph266_check_interval(p_provider),
    now() + (public._pph266_check_interval(p_provider) || ' minutes')::interval
  )
  on conflict (provider_key) do nothing;

  select * into v_row
  from public.payment_provider_health_metrics
  where provider_key = p_provider;

  return v_row;
end;
$$;

create or replace function public._pph266_refresh_provider_metrics(p_provider text)
returns public.payment_provider_health_metrics
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.payment_provider_settings;
  v_metrics public.payment_provider_health_metrics;
  v_api_connected boolean := false;
  v_health_status text;
  v_failed_24h integer;
  v_success_rate numeric;
  v_last_success timestamptz;
begin
  v_metrics := public._pph266_ensure_metrics(p_provider);

  select * into v_settings
  from public.payment_provider_settings s
  where s.scope = 'platform' and s.tenant_id is null and s.provider_key = p_provider
  limit 1;

  if v_settings.id is not null then
    select exists(
      select 1 from public.payment_provider_credential_vault v
      where v.settings_id = v_settings.id
        and v.field_category in ('secret_key', 'public_key')
    ) into v_api_connected;
  end if;

  v_health_status := public._pph266_map_health_status(
    coalesce(v_settings.status, 'pending_setup'),
    v_api_connected
  );
  v_failed_24h := public._pph266_provider_failed_24h(p_provider);
  v_success_rate := public._pph266_provider_success_rate_30d(p_provider);
  v_last_success := public._pph266_last_successful_transaction(p_provider);

  update public.payment_provider_health_metrics set
    health_status = v_health_status,
    environment = case coalesce(v_settings.mode, 'test') when 'live' then 'production' else 'sandbox' end,
    api_connection_status = case
      when v_api_connected and v_settings.enabled then 'connected'
      when v_api_connected then 'degraded'
      else 'disconnected'
    end,
    webhook_status = coalesce(v_settings.webhook_status, 'not_configured'),
    last_successful_transaction_at = v_last_success,
    last_synchronization_at = v_settings.last_health_check_at,
    failed_events_24h = v_failed_24h,
    success_rate_30d = v_success_rate,
    check_interval_minutes = public._pph266_check_interval(p_provider),
    last_health_check_at = coalesce(v_settings.last_health_check_at, now()),
    next_health_check_at = now() + (public._pph266_check_interval(p_provider) || ' minutes')::interval,
    updated_at = now()
  where provider_key = p_provider
  returning * into v_metrics;

  if v_failed_24h >= 5 and not exists (
    select 1 from public.payment_provider_health_alerts
    where provider_key = p_provider and alert_type = 'failed_payment_threshold' and resolved = false
  ) then
    insert into public.payment_provider_health_alerts (
      provider_key, severity, alert_type, title, summary
    ) values (
      p_provider, 'critical', 'failed_payment_threshold',
      format('%s failed payments exceeded threshold', p_provider),
      format('%s payment failures recorded in the last 24 hours.', v_failed_24h)
    );
    perform public._pph266_log_health_audit(
      p_provider, 'failed_payment_threshold', 'critical',
      format('Failed payments exceeded threshold (%s in 24h)', v_failed_24h)
    );
  end if;

  if v_settings.webhook_status = 'failed_verification' and not exists (
    select 1 from public.payment_provider_health_alerts
    where provider_key = p_provider and alert_type = 'webhook_delivery_failed' and resolved = false
  ) then
    insert into public.payment_provider_health_alerts (
      provider_key, severity, alert_type, title, summary
    ) values (
      p_provider, 'warning', 'webhook_delivery_failed',
      format('%s webhook delivery failing', p_provider),
      'Webhook endpoint is not receiving or verifying events correctly.'
    );
  end if;

  if v_health_status = 'offline' and not exists (
    select 1 from public.payment_provider_health_alerts
    where provider_key = p_provider and alert_type = 'provider_unavailable' and resolved = false
  ) then
    insert into public.payment_provider_health_alerts (
      provider_key, severity, alert_type, title, summary
    ) values (
      p_provider, 'critical', 'provider_unavailable',
      format('%s provider unavailable', p_provider),
      'Provider API appears unavailable or credentials are missing.'
    );
  end if;

  return v_metrics;
end;
$$;

create or replace function public._pph266_build_health_card(p_provider text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_metrics public.payment_provider_health_metrics;
  v_meta jsonb;
begin
  v_metrics := public._pph266_refresh_provider_metrics(p_provider);
  v_meta := public._pp262_provider_meta(p_provider);

  return jsonb_build_object(
    'provider_key', p_provider,
    'name', v_meta->>'name',
    'health_status', v_metrics.health_status,
    'environment', v_metrics.environment,
    'api_connection_status', v_metrics.api_connection_status,
    'webhook_status', v_metrics.webhook_status,
    'last_successful_transaction_at', v_metrics.last_successful_transaction_at,
    'last_synchronization_at', v_metrics.last_synchronization_at,
    'failed_events_24h', v_metrics.failed_events_24h,
    'success_rate_30d', v_metrics.success_rate_30d,
    'check_interval_minutes', v_metrics.check_interval_minutes,
    'last_health_check_at', v_metrics.last_health_check_at,
    'next_health_check_at', v_metrics.next_health_check_at,
    'regions', v_meta->'regions',
    'capabilities', v_meta->'capabilities'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed audit samples
-- ---------------------------------------------------------------------------
insert into public.payment_provider_health_audit_logs (
  provider_key, event_type, severity, summary, resolution_status
)
select * from (values
  ('stripe'::text, 'health_check_passed', 'info', 'Stripe health check passed.', 'resolved'),
  ('klarna'::text, 'webhook_verified', 'info', 'Klarna webhook verification succeeded.', 'resolved'),
  ('vipps'::text, 'health_check_passed', 'info', 'Vipps MobilePay health check passed.', 'resolved'),
  ('dnb'::text, 'scheduled_check', 'info', 'DNB Invoice scheduled health check completed.', 'resolved')
) as v(provider_key, event_type, severity, summary, resolution_status)
where not exists (select 1 from public.payment_provider_health_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. RPC — Health center
-- ---------------------------------------------------------------------------
create or replace function public.get_payment_provider_health_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_providers jsonb := '[]'::jsonb;
  v_provider text;
  v_alerts jsonb;
  v_audit jsonb;
  v_all_operational boolean := true;
  v_card jsonb;
begin
  perform public._pph266_require_platform_admin();

  foreach v_provider in array array['stripe', 'vipps', 'klarna', 'dnb']
  loop
    v_card := public._pph266_build_health_card(v_provider);
    v_providers := v_providers || jsonb_build_array(v_card);
    if v_card->>'health_status' <> 'operational' then
      v_all_operational := false;
    end if;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id,
    'provider_key', a.provider_key,
    'severity', a.severity,
    'alert_type', a.alert_type,
    'title', a.title,
    'summary', a.summary,
    'created_at', a.created_at
  ) order by
    case a.severity when 'critical' then 0 when 'warning' then 1 else 2 end,
    a.created_at desc), '[]'::jsonb)
  into v_alerts
  from (
    select * from public.payment_provider_health_alerts
    where resolved = false
    order by created_at desc
    limit 25
  ) a;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'provider_key', l.provider_key,
    'event_type', l.event_type,
    'severity', l.severity,
    'summary', l.summary,
    'resolution_status', l.resolution_status,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.payment_provider_health_audit_logs order by created_at desc limit 40
  ) l;

  return jsonb_build_object(
    'principle', 'Automated monitoring keeps Aipify payment infrastructure resilient through provider diversity.',
    'all_operational', v_all_operational and coalesce(jsonb_array_length(v_alerts), 0) = 0,
    'auto_check_intervals', jsonb_build_object(
      'stripe_minutes', 5,
      'vipps_minutes', 5,
      'klarna_minutes', 5,
      'dnb_minutes', 30
    ),
    'providers', v_providers,
    'alerts', v_alerts,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_payment_provider_health_check(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider text;
  v_success boolean;
  v_message text;
begin
  perform public._pph266_require_platform_admin();

  v_provider := p_payload->>'provider_key';
  v_success := coalesce((p_payload->>'success')::boolean, false);
  v_message := coalesce(p_payload->>'message', 'Health check completed');

  if v_provider not in ('klarna', 'vipps', 'stripe', 'dnb') then
    raise exception 'Invalid provider';
  end if;

  perform public.record_payment_provider_test_result(jsonb_build_object(
    'scope', 'platform',
    'provider_key', v_provider,
    'success', v_success,
    'message', v_message
  ));

  perform public._pph266_log_health_audit(
    v_provider,
    case when v_success then 'health_check_passed' else 'health_check_failed' end,
    case when v_success then 'info' when v_success is false then 'warning' else 'critical' end,
    v_message,
    case when v_success then 'resolved' else 'open' end,
    jsonb_build_object('manual', true, 'success', v_success)
  );

  return public._pph266_build_health_card(v_provider);
end;
$$;

create or replace function public.resolve_payment_provider_health_alert(p_alert_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alert public.payment_provider_health_alerts;
begin
  perform public._pph266_require_platform_admin();

  update public.payment_provider_health_alerts set
    resolved = true,
    resolved_at = now()
  where id = p_alert_id
  returning * into v_alert;

  if v_alert.id is null then
    raise exception 'Alert not found';
  end if;

  perform public._pph266_log_health_audit(
    v_alert.provider_key,
    'alert_resolved',
    'info',
    format('Alert resolved: %s', v_alert.title),
    'resolved'
  );

  return jsonb_build_object('id', v_alert.id, 'resolved', true);
end;
$$;

grant execute on function public.get_payment_provider_health_center() to authenticated;
grant execute on function public.record_payment_provider_health_check(jsonb) to authenticated;
grant execute on function public.resolve_payment_provider_health_alert(uuid) to authenticated;
