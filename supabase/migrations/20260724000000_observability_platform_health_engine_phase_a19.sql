-- Phase A.19 — Observability & Platform Health Engine
-- Principle: tenant-aware platform/service health visibility — metadata only, no PII.
-- Distinct from A.13 Quality Guardian (operational quality).

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'notification_communication_engine',
    'observability_platform_health_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. platform_health_events
-- ---------------------------------------------------------------------------
create table if not exists public.platform_health_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  component text not null check (
    component in (
      'authentication', 'support_ai', 'admin_assistant', 'knowledge_center',
      'integrations', 'notifications', 'audit_log', 'dashboard', 'analytics'
    )
  ),
  status text not null default 'healthy' check (
    status in ('healthy', 'degraded', 'unavailable', 'maintenance')
  ),
  severity text not null default 'informational' check (
    severity in ('informational', 'low', 'medium', 'high', 'critical')
  ),
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists platform_health_events_org_component_idx
  on public.platform_health_events (organization_id, component, status, detected_at desc);

alter table public.platform_health_events enable row level security;
revoke all on public.platform_health_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. platform_incidents
-- ---------------------------------------------------------------------------
create table if not exists public.platform_incidents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  incident_summary text not null,
  affected_services jsonb not null default '[]'::jsonb,
  severity text not null default 'medium' check (
    severity in ('informational', 'low', 'medium', 'high', 'critical')
  ),
  status text not null default 'identified' check (
    status in ('identified', 'investigating', 'monitoring', 'resolved')
  ),
  mitigation_steps text,
  resolution_notes text,
  identified_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists platform_incidents_org_status_idx
  on public.platform_incidents (organization_id, status, severity, identified_at desc);

alter table public.platform_incidents enable row level security;
revoke all on public.platform_incidents from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. maintenance_windows
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance_windows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  title text not null,
  description text,
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  notification_sent boolean not null default false,
  post_review_notes text,
  created_at timestamptz not null default now()
);

create index if not exists maintenance_windows_org_schedule_idx
  on public.maintenance_windows (organization_id, scheduled_start, status);

alter table public.maintenance_windows enable row level security;
revoke all on public.maintenance_windows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. observability_settings
-- ---------------------------------------------------------------------------
create table if not exists public.observability_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  response_time_threshold_ms int not null default 2000,
  integration_failure_threshold int not null default 3,
  ai_failure_threshold int not null default 5,
  queue_backlog_threshold int not null default 50,
  failed_login_threshold int not null default 10,
  notification_failure_threshold int not null default 5,
  enabled_components jsonb not null default '{
    "authentication":true,"support_ai":true,"admin_assistant":true,"knowledge_center":true,
    "integrations":true,"notifications":true,"audit_log":true,"dashboard":true,"analytics":true
  }'::jsonb,
  alert_rules jsonb not null default '{
    "service_unavailable":true,"response_time_spike":true,"integration_repeated_failures":true,
    "queue_backlog":true,"ai_execution_failures":true
  }'::jsonb,
  proactive_monitoring_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.observability_settings enable row level security;
revoke all on public.observability_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'observability_platform_health', v.description
from (values
  ('observability.view', 'View Observability', 'View platform health status and component metrics'),
  ('observability.manage', 'Manage Observability', 'Configure health thresholds and monitoring settings'),
  ('incidents.manage', 'Manage Incidents', 'Create, investigate, and resolve platform incidents'),
  ('maintenance.manage', 'Manage Maintenance', 'Schedule and manage maintenance windows')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'observability.view'), ('owner', 'observability.manage'), ('owner', 'incidents.manage'), ('owner', 'maintenance.manage'),
  ('administrator', 'observability.view'), ('administrator', 'observability.manage'), ('administrator', 'incidents.manage'), ('administrator', 'maintenance.manage'),
  ('manager', 'observability.view'), ('manager', 'incidents.manage'),
  ('support_agent', 'observability.view'),
  ('viewer', 'observability.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ophe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ophe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'platform_health',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ophe_ensure_settings(p_organization_id uuid)
returns public.observability_settings language plpgsql security definer set search_path = public as $$
declare v_row public.observability_settings;
begin
  insert into public.observability_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.observability_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._ophe_component_enabled(
  p_settings public.observability_settings,
  p_component text
)
returns boolean language sql immutable as $$
  select coalesce((p_settings.enabled_components ->> p_component)::boolean, true);
$$;

create or replace function public._ophe_record_event_internal(
  p_organization_id uuid,
  p_component text,
  p_status text,
  p_severity text,
  p_message text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.platform_health_events (
    organization_id, component, status, severity, message, metadata, detected_at
  ) values (
    p_organization_id, p_component, p_status, p_severity, p_message, p_metadata, now()
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ophe_collect_health_signals(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.observability_settings;
  v_components jsonb := '{}'::jsonb;
  v_int_failed int; v_int_active int; v_int_total int;
  v_notif_failed int; v_notif_delivered int;
  v_ai_failed int; v_ai_total int;
  v_failed_logins int;
  v_open_support int;
  v_avg_response_ms numeric;
  v_audit_count int;
  v_knowledge_published int;
  v_tasks_overdue int;
  v_status text; v_severity text; v_msg text;
begin
  v_settings := public._ophe_ensure_settings(p_organization_id);

  -- Integrations (A.8)
  select
    count(*) filter (where status = 'failed'),
    count(*) filter (where status = 'active' and enabled),
    count(*)
  into v_int_failed, v_int_active, v_int_total
  from public.organization_integrations
  where organization_id = p_organization_id;

  if public._ophe_component_enabled(v_settings, 'integrations') then
    if v_int_failed >= v_settings.integration_failure_threshold then
      v_status := 'unavailable'; v_severity := 'high';
      v_msg := format('%s integrations in failed state', v_int_failed);
    elsif v_int_failed > 0 then
      v_status := 'degraded'; v_severity := 'medium';
      v_msg := format('%s integration(s) degraded', v_int_failed);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := format('%s active integrations', v_int_active);
    end if;
    v_components := v_components || jsonb_build_object('integrations', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('failed', v_int_failed, 'active', v_int_active, 'total', v_int_total)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'integrations', v_status, v_severity, v_msg,
      jsonb_build_object('failed', v_int_failed, 'active', v_int_active)
    );
  end if;

  -- Notifications (A.17)
  select
    count(*) filter (where status = 'failed'),
    count(*) filter (where status = 'delivered')
  into v_notif_failed, v_notif_delivered
  from public.organization_communication_notifications
  where organization_id = p_organization_id
    and created_at > now() - interval '24 hours';

  if public._ophe_component_enabled(v_settings, 'notifications') then
    if v_notif_failed >= v_settings.notification_failure_threshold then
      v_status := 'degraded'; v_severity := 'high';
      v_msg := format('%s notification delivery failures (24h)', v_notif_failed);
    elsif v_notif_failed > 0 then
      v_status := 'degraded'; v_severity := 'low';
      v_msg := format('%s notification failure(s) (24h)', v_notif_failed);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := format('%s notifications delivered (24h)', v_notif_delivered);
    end if;
    v_components := v_components || jsonb_build_object('notifications', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('failed_24h', v_notif_failed, 'delivered_24h', v_notif_delivered)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'notifications', v_status, v_severity, v_msg,
      jsonb_build_object('failed_24h', v_notif_failed)
    );
  end if;

  -- Authentication (audit signals)
  select count(*) into v_failed_logins
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and action_type = 'failed_login'
    and created_at > now() - interval '24 hours';

  if public._ophe_component_enabled(v_settings, 'authentication') then
    if v_failed_logins >= v_settings.failed_login_threshold then
      v_status := 'degraded'; v_severity := 'high';
      v_msg := format('%s failed login attempts (24h)', v_failed_logins);
    elsif v_failed_logins > 0 then
      v_status := 'healthy'; v_severity := 'low';
      v_msg := format('%s failed login attempt(s) (24h)', v_failed_logins);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := 'Authentication services operating normally';
    end if;
    v_components := v_components || jsonb_build_object('authentication', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('failed_logins_24h', v_failed_logins)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'authentication', v_status, v_severity, v_msg,
      jsonb_build_object('failed_logins_24h', v_failed_logins)
    );
  end if;

  -- AI execution (Secure AI Actions via audit)
  select
    count(*) filter (where action_type = 'ai_action_failed'),
    count(*) filter (where action_type like 'ai_action%')
  into v_ai_failed, v_ai_total
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and created_at > now() - interval '24 hours';

  if public._ophe_component_enabled(v_settings, 'support_ai') then
    if v_ai_failed >= v_settings.ai_failure_threshold then
      v_status := 'degraded'; v_severity := 'high';
      v_msg := format('%s AI execution failures (24h)', v_ai_failed);
    elsif v_ai_failed > 0 then
      v_status := 'degraded'; v_severity := 'medium';
      v_msg := format('%s AI failure(s) (24h)', v_ai_failed);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := 'Support AI execution healthy';
    end if;
    v_components := v_components || jsonb_build_object('support_ai', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('ai_failed_24h', v_ai_failed, 'ai_total_24h', v_ai_total)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'support_ai', v_status, v_severity, v_msg,
      jsonb_build_object('ai_failed_24h', v_ai_failed)
    );
  end if;

  -- Analytics (A.16) — response time proxy from metrics
  select coalesce(metric_value, 0) into v_avg_response_ms
  from public.organization_analytics_metrics
  where organization_id = p_organization_id
    and metric_key = 'support.avg_first_response_hours'
    and measurement_period = 'daily'
  order by period_date desc
  limit 1;

  if public._ophe_component_enabled(v_settings, 'analytics') then
    if v_avg_response_ms > 24 then
      v_status := 'degraded'; v_severity := 'medium';
      v_msg := 'Analytics indicate elevated support response times';
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := 'Analytics pipeline operational';
    end if;
    v_components := v_components || jsonb_build_object('analytics', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('avg_first_response_hours', v_avg_response_ms)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'analytics', v_status, v_severity, v_msg,
      jsonb_build_object('avg_first_response_hours', v_avg_response_ms)
    );
  end if;

  -- Admin Assistant
  select count(*) into v_tasks_overdue
  from public.admin_tasks
  where organization_id = p_organization_id
    and status not in ('completed', 'cancelled')
    and due_date < now();

  if public._ophe_component_enabled(v_settings, 'admin_assistant') then
    if v_tasks_overdue > v_settings.queue_backlog_threshold then
      v_status := 'degraded'; v_severity := 'medium';
      v_msg := format('%s overdue admin tasks (backlog)', v_tasks_overdue);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := 'Admin Assistant task queue healthy';
    end if;
    v_components := v_components || jsonb_build_object('admin_assistant', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('overdue_tasks', v_tasks_overdue)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'admin_assistant', v_status, v_severity, v_msg,
      jsonb_build_object('overdue_tasks', v_tasks_overdue)
    );
  end if;

  -- Knowledge Center
  select count(*) into v_knowledge_published
  from public.knowledge_articles
  where organization_id = p_organization_id and status = 'published';

  if public._ophe_component_enabled(v_settings, 'knowledge_center') then
    v_status := 'healthy'; v_severity := 'informational';
    v_msg := format('%s published knowledge articles', v_knowledge_published);
    v_components := v_components || jsonb_build_object('knowledge_center', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('published_count', v_knowledge_published)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'knowledge_center', v_status, v_severity, v_msg,
      jsonb_build_object('published_count', v_knowledge_published)
    );
  end if;

  -- Audit log
  select count(*) into v_audit_count
  from public.organization_audit_logs
  where organization_id = p_organization_id
    and created_at > now() - interval '24 hours';

  if public._ophe_component_enabled(v_settings, 'audit_log') then
    v_status := 'healthy'; v_severity := 'informational';
    v_msg := format('%s audit events recorded (24h)', v_audit_count);
    v_components := v_components || jsonb_build_object('audit_log', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('events_24h', v_audit_count)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'audit_log', v_status, v_severity, v_msg,
      jsonb_build_object('events_24h', v_audit_count)
    );
  end if;

  -- Dashboard / open support as proxy
  select count(*) into v_open_support
  from public.organization_support_cases
  where organization_id = p_organization_id
    and status in ('new', 'open', 'waiting_for_customer', 'waiting_for_internal');

  if public._ophe_component_enabled(v_settings, 'dashboard') then
    if v_open_support > 50 then
      v_status := 'degraded'; v_severity := 'medium';
      v_msg := format('%s open support cases affecting dashboard load', v_open_support);
    else
      v_status := 'healthy'; v_severity := 'informational';
      v_msg := 'Operations dashboard responsive';
    end if;
    v_components := v_components || jsonb_build_object('dashboard', jsonb_build_object(
      'status', v_status, 'severity', v_severity, 'message', v_msg,
      'metadata', jsonb_build_object('open_support_cases', v_open_support)
    ));
    perform public._ophe_record_event_internal(
      p_organization_id, 'dashboard', v_status, v_severity, v_msg,
      jsonb_build_object('open_support_cases', v_open_support)
    );
  end if;

  return jsonb_build_object('components', v_components, 'collected_at', now());
end; $$;

create or replace function public._ophe_overall_status(p_components jsonb)
returns text language plpgsql immutable as $$
declare v_key text; v_comp jsonb; v_worst int := 0; v_rank int;
begin
  for v_key in select jsonb_object_keys(p_components) loop
    v_comp := p_components -> v_key;
    v_rank := case v_comp ->> 'status'
      when 'unavailable' then 3
      when 'degraded' then 2
      when 'maintenance' then 1
      else 0
    end;
    if v_rank > v_worst then v_worst := v_rank; end if;
  end loop;
  return case v_worst
    when 3 then 'unavailable'
    when 2 then 'degraded'
    when 1 then 'maintenance'
    else 'healthy'
  end;
end; $$;

create or replace function public._ophe_response_time_trends(p_organization_id uuid, p_days int default 7)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'period_date', period_date,
    'metric_key', metric_key,
    'metric_value', metric_value
  ) order by period_date desc), '[]'::jsonb)
  from public.organization_analytics_metrics
  where organization_id = p_organization_id
    and metric_key in ('support.avg_first_response_hours', 'support.avg_resolution_hours')
    and measurement_period = 'daily'
    and period_date >= current_date - p_days;
$$;

create or replace function public._ophe_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ophe_ensure_settings(p_organization_id);

  if not exists (
    select 1 from public.platform_health_events
    where organization_id = p_organization_id and component = 'integrations'
  ) then
    insert into public.platform_health_events (
      organization_id, component, status, severity, message, metadata
    ) values (
      p_organization_id, 'integrations', 'healthy', 'informational',
      'Integration monitoring baseline established',
      '{"seeded":true}'::jsonb
    );
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_health_event(
  p_component text,
  p_status text default 'healthy',
  p_severity text default 'informational',
  p_message text default 'Health event recorded',
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('observability.manage');
  v_org_id := public._mta_require_organization();
  perform public._ophe_ensure_settings(v_org_id);

  v_id := public._ophe_record_event_internal(
    v_org_id, p_component, p_status, p_severity, p_message, p_metadata
  );

  perform public._ophe_log(v_org_id, 'health_event_recorded', 'platform_health_event', v_id,
    jsonb_build_object('component', p_component, 'status', p_status, 'severity', p_severity));

  return jsonb_build_object('id', v_id, 'component', p_component, 'status', p_status);
end; $$;

create or replace function public.create_platform_incident(
  p_incident_summary text,
  p_affected_services jsonb default '[]'::jsonb,
  p_severity text default 'medium',
  p_mitigation_steps text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();

  insert into public.platform_incidents (
    organization_id, incident_summary, affected_services, severity, status, mitigation_steps
  ) values (
    v_org_id, p_incident_summary, coalesce(p_affected_services, '[]'::jsonb),
    p_severity, 'identified', p_mitigation_steps
  ) returning id into v_id;

  perform public._ophe_log(v_org_id, 'incident_created', 'platform_incident', v_id,
    jsonb_build_object('severity', p_severity, 'summary', left(p_incident_summary, 200)));

  return jsonb_build_object('id', v_id, 'status', 'identified');
end; $$;

create or replace function public.resolve_platform_incident(
  p_incident_id uuid,
  p_resolution_notes text default null,
  p_status text default 'resolved'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.platform_incidents;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();

  update public.platform_incidents set
    status = coalesce(p_status, 'resolved'),
    resolution_notes = coalesce(p_resolution_notes, resolution_notes),
    resolved_at = case when coalesce(p_status, 'resolved') = 'resolved' then now() else resolved_at end
  where id = p_incident_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Incident not found';
  end if;

  perform public._ophe_log(v_org_id, 'incident_resolved', 'platform_incident', v_row.id,
    jsonb_build_object('status', v_row.status));

  return jsonb_build_object('id', v_row.id, 'status', v_row.status, 'resolved_at', v_row.resolved_at);
end; $$;

create or replace function public.schedule_maintenance_window(
  p_title text,
  p_description text default null,
  p_scheduled_start timestamptz default null,
  p_scheduled_end timestamptz default null,
  p_send_notification boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid; v_start timestamptz; v_end timestamptz;
begin
  perform public._irp_require_permission('maintenance.manage');
  v_org_id := public._mta_require_organization();
  v_start := coalesce(p_scheduled_start, now() + interval '1 day');
  v_end := coalesce(p_scheduled_end, v_start + interval '2 hours');

  insert into public.maintenance_windows (
    organization_id, title, description, scheduled_start, scheduled_end,
    status, notification_sent
  ) values (
    v_org_id, p_title, p_description, v_start, v_end, 'scheduled', false
  ) returning id into v_id;

  if p_send_notification then
    begin
      perform public.send_notification(
        null, 'system_alerts', 'high', 'Scheduled maintenance: ' || p_title,
        coalesce(p_description, 'A maintenance window has been scheduled.'),
        '/app/observability-platform-health-engine', 'Review maintenance schedule',
        '["in_app","dashboard"]'::jsonb,
        jsonb_build_object('maintenance_id', v_id, 'scheduled_start', v_start)
      );
      update public.maintenance_windows set notification_sent = true where id = v_id;
    exception when others then
      null;
    end;
  end if;

  perform public._ophe_log(v_org_id, 'maintenance_scheduled', 'maintenance_window', v_id,
    jsonb_build_object('title', p_title, 'scheduled_start', v_start, 'scheduled_end', v_end));

  return jsonb_build_object('id', v_id, 'status', 'scheduled', 'scheduled_start', v_start, 'scheduled_end', v_end);
end; $$;

create or replace function public.get_platform_status()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_signals jsonb;
  v_components jsonb;
  v_overall text;
  v_active_incidents int;
  v_upcoming_maintenance int;
begin
  perform public._irp_require_permission('observability.view');
  v_org_id := public._mta_require_organization();
  perform public._ophe_ensure_settings(v_org_id);

  v_signals := public._ophe_collect_health_signals(v_org_id);
  v_components := v_signals -> 'components';
  v_overall := public._ophe_overall_status(v_components);

  select count(*) into v_active_incidents
  from public.platform_incidents
  where organization_id = v_org_id and status <> 'resolved';

  select count(*) into v_upcoming_maintenance
  from public.maintenance_windows
  where organization_id = v_org_id
    and status in ('scheduled', 'in_progress')
    and scheduled_end > now();

  return jsonb_build_object(
    'overall_status', v_overall,
    'components', v_components,
    'active_incidents', v_active_incidents,
    'upcoming_maintenance', v_upcoming_maintenance,
    'collected_at', v_signals -> 'collected_at'
  );
end; $$;

create or replace function public.send_health_alert(
  p_title text,
  p_message text default null,
  p_component text default null,
  p_severity text default 'high'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb;
begin
  perform public._irp_require_permission('observability.manage');
  v_org_id := public._mta_require_organization();

  if p_severity = 'critical' then
    v_result := public.send_critical_alert(
      p_title, p_message, '/app/observability-platform-health-engine', null, 'system_alerts'
    );
  else
    v_result := public.send_notification(
      null,
      'system_alerts',
      case p_severity when 'high' then 'high' when 'medium' then 'medium' else 'low' end,
      p_title,
      p_message,
      '/app/observability-platform-health-engine',
      'Review platform health dashboard',
      '["in_app","dashboard"]'::jsonb,
      jsonb_build_object('component', p_component, 'source', 'observability_platform_health_engine')
    );
  end if;

  perform public._ophe_log(v_org_id, 'health_alert_sent', 'platform_health_alert', null,
    jsonb_build_object('title', p_title, 'component', p_component, 'severity', p_severity));

  return coalesce(v_result, '{}'::jsonb);
end; $$;

create or replace function public.run_health_check()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_result jsonb;
begin
  perform public._irp_require_permission('observability.manage');
  v_org_id := public._mta_require_organization();
  v_result := public._ophe_collect_health_signals(v_org_id);

  perform public._ophe_log(v_org_id, 'health_check_executed', 'platform_health', null,
    jsonb_build_object('component_count', jsonb_object_length(v_result -> 'components')));

  return v_result;
end; $$;

create or replace function public.save_observability_settings(
  p_response_time_threshold_ms int default null,
  p_integration_failure_threshold int default null,
  p_ai_failure_threshold int default null,
  p_queue_backlog_threshold int default null,
  p_failed_login_threshold int default null,
  p_notification_failure_threshold int default null,
  p_enabled_components jsonb default null,
  p_alert_rules jsonb default null,
  p_proactive_monitoring_enabled boolean default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.observability_settings;
begin
  perform public._irp_require_permission('observability.manage');
  v_org_id := public._mta_require_organization();
  perform public._ophe_ensure_settings(v_org_id);

  update public.observability_settings set
    response_time_threshold_ms = coalesce(p_response_time_threshold_ms, response_time_threshold_ms),
    integration_failure_threshold = coalesce(p_integration_failure_threshold, integration_failure_threshold),
    ai_failure_threshold = coalesce(p_ai_failure_threshold, ai_failure_threshold),
    queue_backlog_threshold = coalesce(p_queue_backlog_threshold, queue_backlog_threshold),
    failed_login_threshold = coalesce(p_failed_login_threshold, failed_login_threshold),
    notification_failure_threshold = coalesce(p_notification_failure_threshold, notification_failure_threshold),
    enabled_components = coalesce(p_enabled_components, enabled_components),
    alert_rules = coalesce(p_alert_rules, alert_rules),
    proactive_monitoring_enabled = coalesce(p_proactive_monitoring_enabled, proactive_monitoring_enabled),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ophe_log(v_org_id, 'observability_config_updated', 'observability_settings', v_row.id,
    jsonb_build_object('proactive_monitoring', v_row.proactive_monitoring_enabled));

  return jsonb_build_object('settings', row_to_json(v_row));
end; $$;

create or replace function public.get_observability_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_row public.observability_settings;
begin
  perform public._irp_require_permission('observability.view');
  v_org_id := public._mta_require_organization();
  v_row := public._ophe_ensure_settings(v_org_id);
  return jsonb_build_object('settings', row_to_json(v_row));
end; $$;

create or replace function public.get_platform_incidents(p_status text default null, p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('observability.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(row_to_json(i) order by i.identified_at desc)
    from (
      select id, incident_summary, affected_services, severity, status,
             mitigation_steps, resolution_notes, identified_at, resolved_at, created_at
      from public.platform_incidents
      where organization_id = v_org_id
        and (p_status is null or status = p_status)
      order by identified_at desc
      limit greatest(p_limit, 1)
    ) i
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_maintenance_windows(p_upcoming_only boolean default true, p_limit int default 10)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('observability.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(row_to_json(m) order by m.scheduled_start)
    from (
      select id, title, description, scheduled_start, scheduled_end, status,
             notification_sent, post_review_notes, created_at
      from public.maintenance_windows
      where organization_id = v_org_id
        and (not p_upcoming_only or scheduled_end > now())
      order by scheduled_start
      limit greatest(p_limit, 1)
    ) m
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_observability_platform_health_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.observability_settings;
  v_signals jsonb;
  v_components jsonb;
  v_overall text;
begin
  perform public._irp_require_permission('observability.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._ophe_ensure_settings(v_org_id);

  if v_settings.proactive_monitoring_enabled then
    v_signals := public._ophe_collect_health_signals(v_org_id);
  else
    v_signals := jsonb_build_object('components', '{}'::jsonb, 'collected_at', now());
  end if;

  v_components := v_signals -> 'components';
  v_overall := public._ophe_overall_status(v_components);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Proactive platform health visibility — tenant-scoped service monitoring with actionable insights and audit accountability.',
    'safety_note', 'Health events store metadata only — no PII, email content, chat, or operational records.',
    'principles', jsonb_build_array(
      'Tenant-aware visibility across Aipify Core components',
      'Early warning via integration, notification, and auth signal aggregation',
      'Distinct from Quality Guardian — this monitors platform/service health',
      'Incident and maintenance workflows with full audit support',
      'Humans decide — alerts inform and prepare, never auto-remediate'
    ),
    'overall_status', v_overall,
    'settings', row_to_json(v_settings),
    'components', v_components,
    'active_incidents', coalesce((
      select jsonb_agg(row_to_json(i) order by i.identified_at desc)
      from (
        select id, incident_summary, affected_services, severity, status,
               mitigation_steps, resolution_notes, identified_at, resolved_at, created_at
        from public.platform_incidents
        where organization_id = v_org_id and status <> 'resolved'
        order by identified_at desc
        limit 20
      ) i
    ), '[]'::jsonb),
    'recent_outages', coalesce((
      select jsonb_agg(row_to_json(e) order by e.detected_at desc)
      from (
        select id, component, status, severity, message, metadata, detected_at, resolved_at
        from public.platform_health_events
        where organization_id = v_org_id
          and status in ('degraded', 'unavailable')
        order by detected_at desc
        limit 15
      ) e
    ), '[]'::jsonb),
    'response_time_trends', public._ophe_response_time_trends(v_org_id, 7),
    'maintenance_windows', public.get_maintenance_windows(true, 5),
    'recent_events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.detected_at desc)
      from (
        select id, component, status, severity, message, detected_at, resolved_at
        from public.platform_health_events
        where organization_id = v_org_id
        order by detected_at desc
        limit 20
      ) e
    ), '[]'::jsonb),
    'recovery_progress', coalesce((
      select jsonb_build_object(
        'resolved_incidents_30d', count(*) filter (where status = 'resolved' and resolved_at > now() - interval '30 days'),
        'open_incidents', count(*) filter (where status <> 'resolved'),
        'degraded_components', (
          select count(*) from jsonb_each(v_components) c
          where (c.value ->> 'status') in ('degraded', 'unavailable')
        )
      )
      from public.platform_incidents
      where organization_id = v_org_id
    ), '{}'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_observability_platform_health_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_open_incidents int;
  v_degraded int;
begin
  v_org_id := public._mta_require_organization();

  select count(*) into v_open_incidents
  from public.platform_incidents
  where organization_id = v_org_id and status <> 'resolved';

  select count(*) into v_degraded
  from public.platform_health_events
  where organization_id = v_org_id
    and status in ('degraded', 'unavailable')
    and resolved_at is null
    and detected_at > now() - interval '24 hours';

  return jsonb_build_object(
    'has_organization', true,
    'overall_status', case
      when v_degraded > 2 or v_open_incidents > 0 then 'degraded'
      when v_degraded > 0 then 'needs_attention'
      else 'healthy'
    end,
    'open_incidents', v_open_incidents,
    'degraded_signals_24h', v_degraded,
    'philosophy', 'Platform health monitoring — proactive visibility with early warning signals.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_platform_observability_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  return jsonb_build_object(
    'privacy_note', 'Platform observability aggregates tenant counts and status distributions only — no customer operational content.',
    'total_organizations', (select count(*) from public.organizations),
    'organizations_with_open_incidents', (
      select count(distinct organization_id)
      from public.platform_incidents
      where status <> 'resolved' and organization_id is not null
    ),
    'health_events_24h', (
      select count(*) from public.platform_health_events
      where detected_at > now() - interval '24 hours'
    ),
    'degraded_events_24h', (
      select count(*) from public.platform_health_events
      where status in ('degraded', 'unavailable')
        and detected_at > now() - interval '24 hours'
    ),
    'scheduled_maintenance', (
      select count(*) from public.maintenance_windows
      where status = 'scheduled' and scheduled_start > now()
    ),
    'status_distribution_24h', coalesce((
      select jsonb_object_agg(status, cnt)
      from (
        select status, count(*) as cnt
        from public.platform_health_events
        where detected_at > now() - interval '24 hours'
        group by status
      ) s
    ), '{}'::jsonb)
  );
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'policy_created', 'policy_updated', 'policy_activated', 'policy_archived',
    'policy_violation_recorded', 'policy_violation_resolved', 'policy_review_scheduled',
    'policy_review_completed', 'governance_override',
    'pilot_provisioned', 'pilot_module_activated', 'pilot_metric_recorded',
    'pilot_feedback_submitted', 'pilot_milestone_updated',
    'analytics_metrics_refreshed', 'analytics_insight_generated', 'analytics_report_created',
    'analytics_report_exported', 'analytics_settings_updated', 'analytics_scheduled_report_created',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'health_event_recorded', 'health_check_executed', 'health_alert_sent',
    'incident_created', 'incident_resolved', 'maintenance_scheduled',
    'observability_config_updated', 'health_threshold_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ophe_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'observability-platform-health-engine', 'Observability & Platform Health Engine', 'Tenant-scoped platform and service health monitoring with incidents, maintenance windows, and proactive alerting across Aipify Core.', 'authenticated', 63
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'observability-platform-health-engine' and tenant_id is null);

grant execute on function public.record_health_event(text, text, text, text, jsonb) to authenticated;
grant execute on function public.create_platform_incident(text, jsonb, text, text) to authenticated;
grant execute on function public.resolve_platform_incident(uuid, text, text) to authenticated;
grant execute on function public.schedule_maintenance_window(text, text, timestamptz, timestamptz, boolean) to authenticated;
grant execute on function public.get_platform_status() to authenticated;
grant execute on function public.send_health_alert(text, text, text, text) to authenticated;
grant execute on function public.run_health_check() to authenticated;
grant execute on function public.save_observability_settings(int, int, int, int, int, int, jsonb, jsonb, boolean) to authenticated;
grant execute on function public.get_observability_settings() to authenticated;
grant execute on function public.get_platform_incidents(text, int) to authenticated;
grant execute on function public.get_maintenance_windows(boolean, int) to authenticated;
grant execute on function public.get_observability_platform_health_engine_dashboard() to authenticated;
grant execute on function public.get_observability_platform_health_engine_card() to authenticated;
grant execute on function public.get_platform_observability_overview() to authenticated;
