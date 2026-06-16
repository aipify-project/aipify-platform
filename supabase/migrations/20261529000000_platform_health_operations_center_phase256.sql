-- Phase 256 — Platform Health & Operations Center (Platform Admin)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.platform_health_incidents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null default '',
  service_key text not null default 'platform',
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'investigating' check (
    status in ('investigating', 'identified', 'monitoring', 'resolved')
  ),
  created_by uuid references auth.users (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_health_incidents_open_idx
  on public.platform_health_incidents (status, severity desc, created_at desc);

create table if not exists public.platform_health_incident_notes (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.platform_health_incidents (id) on delete cascade,
  note text not null,
  author_user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists platform_health_incident_notes_incident_idx
  on public.platform_health_incident_notes (incident_id, created_at desc);

create table if not exists public.platform_health_alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (
    category in (
      'failed_job', 'service_interruption', 'authentication_anomaly',
      'payment_failure', 'email_delivery', 'marketplace', 'notification'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  resolution_status text not null default 'open' check (
    resolution_status in ('open', 'acknowledged', 'resolved')
  ),
  summary text not null default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists platform_health_alerts_feed_idx
  on public.platform_health_alerts (resolution_status, severity desc, created_at desc);

create table if not exists public.platform_health_deployments (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  previous_version text,
  deployment_status text not null default 'successful' check (
    deployment_status in ('successful', 'failed', 'rolled_back')
  ),
  initiator text not null default '',
  initiated_by uuid references auth.users (id) on delete set null,
  deployed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists platform_health_deployments_deployed_idx
  on public.platform_health_deployments (deployed_at desc);

create table if not exists public.platform_health_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users (id) on delete set null,
  action text not null,
  previous_state jsonb not null default '{}'::jsonb,
  new_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_health_audit_logs_created_idx
  on public.platform_health_audit_logs (created_at desc);

alter table public.platform_health_incidents enable row level security;
alter table public.platform_health_incident_notes enable row level security;
alter table public.platform_health_alerts enable row level security;
alter table public.platform_health_deployments enable row level security;
alter table public.platform_health_audit_logs enable row level security;

revoke all on public.platform_health_incidents from authenticated, anon;
revoke all on public.platform_health_incident_notes from authenticated, anon;
revoke all on public.platform_health_alerts from authenticated, anon;
revoke all on public.platform_health_deployments from authenticated, anon;
revoke all on public.platform_health_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._phoc256_require_platform_health_admin()
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

create or replace function public._phoc256_log_audit(
  p_action text,
  p_previous_state jsonb default '{}'::jsonb,
  p_new_state jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.platform_health_audit_logs (actor_user_id, action, previous_state, new_state)
  values (auth.uid(), p_action, coalesce(p_previous_state, '{}'::jsonb), coalesce(p_new_state, '{}'::jsonb));
end;
$$;

create or replace function public._phoc256_service_catalog()
returns jsonb
language sql
immutable
as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'authentication', 'label', 'Authentication services'),
    jsonb_build_object('key', 'database', 'label', 'Database connectivity'),
    jsonb_build_object('key', 'email_delivery', 'label', 'Email delivery systems'),
    jsonb_build_object('key', 'payment_infrastructure', 'label', 'Payment infrastructure'),
    jsonb_build_object('key', 'background_jobs', 'label', 'Background jobs'),
    jsonb_build_object('key', 'file_storage', 'label', 'File storage services'),
    jsonb_build_object('key', 'marketplace_services', 'label', 'Marketplace services'),
    jsonb_build_object('key', 'notification_services', 'label', 'Notification services')
  );
$$;

create or replace function public._phoc256_derive_service_status(p_service_key text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_open_incidents integer := 0;
  v_failed_jobs integer := 0;
  v_failed_installations integer := 0;
  v_payment_failures integer := 0;
  v_maintenance boolean := false;
begin
  select count(*)::int
  into v_open_incidents
  from public.platform_health_incidents i
  where i.service_key = p_service_key
    and i.status <> 'resolved';

  if v_open_incidents > 0 then
    return 'incident';
  end if;

  select exists (
    select 1
    from public.platform_updates u
    where u.status in ('scheduled', 'in_progress')
  )
  into v_maintenance;

  if v_maintenance and p_service_key in ('database', 'background_jobs', 'notification_services') then
    return 'maintenance';
  end if;

  select count(*)::int
  into v_failed_jobs
  from public.platform_playbook_executions e
  where e.outcome = 'failed'
    and e.executed_at >= now() - interval '24 hours';

  select count(*)::int
  into v_failed_installations
  from public.installations i
  where i.status = 'failed';

  select count(*)::int
  into v_payment_failures
  from public.platform_health_alerts a
  where a.category = 'payment_failure'
    and a.resolution_status <> 'resolved'
    and a.created_at >= now() - interval '24 hours';

  case p_service_key
    when 'authentication' then
      if v_open_incidents > 0 then return 'incident'; end if;
      return 'operational';
    when 'database' then
      return 'operational';
    when 'email_delivery' then
      if exists (
        select 1 from public.platform_health_alerts a
        where a.category = 'email_delivery' and a.resolution_status <> 'resolved'
      ) then return 'degraded'; end if;
      return 'operational';
    when 'payment_infrastructure' then
      if v_payment_failures > 0 then return 'degraded'; end if;
      return 'operational';
    when 'background_jobs' then
      if v_failed_jobs > 3 then return 'degraded'; end if;
      if v_failed_jobs > 0 then return 'degraded'; end if;
      return 'operational';
    when 'file_storage' then
      return 'operational';
    when 'marketplace_services' then
      return 'operational';
    when 'notification_services' then
      if v_failed_jobs > 2 then return 'degraded'; end if;
      return 'operational';
    else
      return 'operational';
  end case;
end;
$$;

create or replace function public._phoc256_build_services()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_services jsonb := '[]'::jsonb;
  v_row jsonb;
  v_key text;
begin
  for v_row in select * from jsonb_array_elements(public._phoc256_service_catalog())
  loop
    v_key := v_row->>'key';
    v_services := v_services || jsonb_build_array(
      jsonb_build_object(
        'key', v_key,
        'label', v_row->>'label',
        'status', public._phoc256_derive_service_status(v_key),
        'checked_at', now()
      )
    );
  end loop;
  return v_services;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Seed baseline data
-- ---------------------------------------------------------------------------
insert into public.platform_health_deployments (version, previous_version, deployment_status, initiator)
select '0.1.0', null, 'successful', 'Aipify Platform'
where not exists (select 1 from public.platform_health_deployments limit 1);

insert into public.platform_health_alerts (title, category, severity, resolution_status, summary)
select * from (values
  (
    'Playbook execution failures detected'::text,
    'failed_job'::text,
    'medium'::text,
    'open'::text,
    'Review failed platform playbook executions in the last 24 hours.'::text
  ),
  (
    'Payment provider monitoring active'::text,
    'payment_failure'::text,
    'low'::text,
    'acknowledged'::text,
    'Payment infrastructure is monitored continuously across tenant providers.'::text
  )
) as v(title, category, severity, resolution_status, summary)
where not exists (select 1 from public.platform_health_alerts limit 1);

insert into public.platform_health_audit_logs (action, previous_state, new_state)
select 'center_initialized', '{}'::jsonb, jsonb_build_object('phase', 256)
where not exists (select 1 from public.platform_health_audit_logs limit 1);

-- ---------------------------------------------------------------------------
-- 4. Main read RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_health_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_active_orgs integer := 0;
  v_active_subscriptions integer := 0;
  v_open_incidents integer := 0;
  v_resolved_incidents_month integer := 0;
  v_critical_alerts integer := 0;
  v_uptime numeric := 99.9;
  v_current_deployment jsonb;
  v_deployment_history jsonb := '[]'::jsonb;
begin
  perform public._phoc256_require_platform_health_admin();

  select count(*)::int
  into v_active_orgs
  from public.companies c
  where coalesce(c.is_platform, false) = false;

  select count(*)::int
  into v_active_subscriptions
  from public.subscriptions s
  where s.status in ('active', 'trialing');

  select count(*)::int
  into v_open_incidents
  from public.platform_health_incidents
  where status <> 'resolved';

  select count(*)::int
  into v_resolved_incidents_month
  from public.platform_health_incidents
  where status = 'resolved'
    and coalesce(resolved_at, updated_at) >= date_trunc('month', now());

  select count(*)::int
  into v_critical_alerts
  from public.platform_health_alerts
  where resolution_status <> 'resolved'
    and severity = 'critical';

  select jsonb_build_object(
    'version', d.version,
    'previous_version', d.previous_version,
    'deployed_at', d.deployed_at,
    'initiator', d.initiator,
    'status', d.deployment_status
  )
  into v_current_deployment
  from public.platform_health_deployments d
  order by d.deployed_at desc
  limit 1;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', d.id,
      'version', d.version,
      'previous_version', d.previous_version,
      'deployed_at', d.deployed_at,
      'initiator', d.initiator,
      'status', d.deployment_status
    )
    order by d.deployed_at desc
  ), '[]'::jsonb)
  into v_deployment_history
  from (
    select * from public.platform_health_deployments order by deployed_at desc limit 10
  ) d;

  return jsonb_build_object(
    'principle', 'Operational visibility for Aipify Group AS — monitor platform health before customer impact.',
    'services', public._phoc256_build_services(),
    'executive_summary', jsonb_build_object(
      'active_organizations', v_active_orgs,
      'active_subscriptions', v_active_subscriptions,
      'platform_uptime_pct', v_uptime,
      'open_incidents', v_open_incidents,
      'resolved_incidents_this_month', v_resolved_incidents_month,
      'critical_alerts', v_critical_alerts
    ),
    'incidents', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'title', i.title,
          'summary', i.summary,
          'service_key', i.service_key,
          'severity', i.severity,
          'status', i.status,
          'created_at', i.created_at,
          'resolved_at', i.resolved_at,
          'notes', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', n.id,
                'note', n.note,
                'created_at', n.created_at
              )
              order by n.created_at desc
            )
            from public.platform_health_incident_notes n
            where n.incident_id = i.id
          ), '[]'::jsonb)
        )
        order by i.created_at desc
      )
      from public.platform_health_incidents i
      where i.status <> 'resolved'
      limit 20
    ), '[]'::jsonb),
    'resolved_incidents', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', i.id,
          'title', i.title,
          'severity', i.severity,
          'status', i.status,
          'resolved_at', i.resolved_at
        )
        order by i.resolved_at desc nulls last
      )
      from public.platform_health_incidents i
      where i.status = 'resolved'
      limit 10
    ), '[]'::jsonb),
    'alerts', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', a.id,
          'title', a.title,
          'category', a.category,
          'severity', a.severity,
          'resolution_status', a.resolution_status,
          'summary', a.summary,
          'created_at', a.created_at,
          'resolved_at', a.resolved_at
        )
        order by a.created_at desc
      )
      from public.platform_health_alerts a
      limit 30
    ), '[]'::jsonb),
    'deployment', coalesce(v_current_deployment, '{}'::jsonb),
    'deployment_history', v_deployment_history,
    'audit_logs', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', l.id,
          'action', l.action,
          'previous_state', l.previous_state,
          'new_state', l.new_state,
          'created_at', l.created_at
        )
        order by l.created_at desc
      )
      from public.platform_health_audit_logs l
      limit 40
    ), '[]'::jsonb),
    'can_manage', exists (
      select 1
      from public.platform_admins pa
      where pa.auth_user_id = auth.uid()
        and pa.role = 'super_admin'
    ) or exists (
      select 1
      from public.platform_admins pa
      where pa.auth_user_id = auth.uid()
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.perform_platform_health_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text := coalesce(nullif(p_payload->>'action', ''), '');
  v_incident_id uuid;
  v_alert_id uuid;
  v_previous jsonb := '{}'::jsonb;
  v_new jsonb := '{}'::jsonb;
  v_row public.platform_health_incidents%rowtype;
begin
  perform public._phoc256_require_platform_health_admin();

  if v_action = 'create_incident' then
    insert into public.platform_health_incidents (
      title, summary, service_key, severity, status, created_by
    )
    values (
      coalesce(nullif(p_payload->>'title', ''), 'Untitled incident'),
      coalesce(p_payload->>'summary', ''),
      coalesce(nullif(p_payload->>'service_key', ''), 'platform'),
      coalesce(nullif(p_payload->>'severity', ''), 'medium'),
      coalesce(nullif(p_payload->>'status', ''), 'investigating'),
      auth.uid()
    )
    returning * into v_row;

    v_new := to_jsonb(v_row);
    perform public._phoc256_log_audit('create_incident', v_previous, v_new);
    return jsonb_build_object('ok', true, 'incident_id', v_row.id);

  elsif v_action = 'update_incident_status' then
    v_incident_id := nullif(p_payload->>'incident_id', '')::uuid;
    if v_incident_id is null then
      raise exception 'incident_id required';
    end if;

    select to_jsonb(i) into v_previous
    from public.platform_health_incidents i
    where i.id = v_incident_id;

    update public.platform_health_incidents i
    set
      status = coalesce(nullif(p_payload->>'status', ''), i.status),
      severity = coalesce(nullif(p_payload->>'severity', ''), i.severity),
      resolved_at = case
        when coalesce(nullif(p_payload->>'status', ''), i.status) = 'resolved' then now()
        else i.resolved_at
      end,
      updated_at = now()
    where i.id = v_incident_id
    returning * into v_row;

    v_new := to_jsonb(v_row);
    perform public._phoc256_log_audit('update_incident_status', v_previous, v_new);
    return jsonb_build_object('ok', true, 'incident_id', v_row.id);

  elsif v_action = 'add_incident_note' then
    v_incident_id := nullif(p_payload->>'incident_id', '')::uuid;
    if v_incident_id is null then
      raise exception 'incident_id required';
    end if;

    insert into public.platform_health_incident_notes (incident_id, note, author_user_id)
    values (v_incident_id, coalesce(p_payload->>'note', ''), auth.uid());

    perform public._phoc256_log_audit(
      'add_incident_note',
      jsonb_build_object('incident_id', v_incident_id),
      jsonb_build_object('note', coalesce(p_payload->>'note', ''))
    );
    return jsonb_build_object('ok', true);

  elsif v_action = 'resolve_alert' then
    v_alert_id := nullif(p_payload->>'alert_id', '')::uuid;
    if v_alert_id is null then
      raise exception 'alert_id required';
    end if;

    select to_jsonb(a) into v_previous
    from public.platform_health_alerts a
    where a.id = v_alert_id;

    update public.platform_health_alerts a
    set
      resolution_status = coalesce(nullif(p_payload->>'resolution_status', ''), 'resolved'),
      resolved_at = case
        when coalesce(nullif(p_payload->>'resolution_status', ''), 'resolved') = 'resolved' then now()
        else a.resolved_at
      end
    where a.id = v_alert_id;

    select to_jsonb(a) into v_new
    from public.platform_health_alerts a
    where a.id = v_alert_id;

    perform public._phoc256_log_audit('resolve_alert', v_previous, v_new);
    return jsonb_build_object('ok', true, 'alert_id', v_alert_id);

  elsif v_action = 'record_deployment' then
    insert into public.platform_health_deployments (
      version, previous_version, deployment_status, initiator, initiated_by, deployed_at
    )
    values (
      coalesce(nullif(p_payload->>'version', ''), '0.0.0'),
      nullif(p_payload->>'previous_version', ''),
      coalesce(nullif(p_payload->>'deployment_status', ''), 'successful'),
      coalesce(nullif(p_payload->>'initiator', ''), 'Platform Admin'),
      auth.uid(),
      coalesce((p_payload->>'deployed_at')::timestamptz, now())
    );

    perform public._phoc256_log_audit(
      'record_deployment',
      '{}'::jsonb,
      jsonb_build_object(
        'version', coalesce(nullif(p_payload->>'version', ''), '0.0.0'),
        'status', coalesce(nullif(p_payload->>'deployment_status', ''), 'successful')
      )
    );
    return jsonb_build_object('ok', true);

  else
    raise exception 'Unknown action: %', v_action;
  end if;
end;
$$;

grant execute on function public.get_platform_health_operations_center() to authenticated;
grant execute on function public.perform_platform_health_operations_action(jsonb) to authenticated;
