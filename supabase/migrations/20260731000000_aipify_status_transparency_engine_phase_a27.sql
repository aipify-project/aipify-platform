-- Phase A.27 — Aipify Status & Transparency Engine
-- Public and internal status communication — distinct from A.19 observability (technical health).

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
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. status_events
-- ---------------------------------------------------------------------------
create table if not exists public.status_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  component text not null check (
    component in (
      'authentication', 'support_ai', 'admin_assistant', 'knowledge_center',
      'integrations', 'notifications', 'dashboard', 'api_platform', 'platform'
    )
  ),
  status text not null default 'operational' check (
    status in ('operational', 'degraded_performance', 'partial_outage', 'major_outage', 'maintenance')
  ),
  severity text not null default 'informational' check (
    severity in ('informational', 'low', 'medium', 'high', 'critical')
  ),
  title text not null,
  description text,
  public_visibility boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists status_events_org_component_idx
  on public.status_events (organization_id, component, status, started_at desc);

alter table public.status_events enable row level security;
revoke all on public.status_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. status_incident_updates
-- ---------------------------------------------------------------------------
create table if not exists public.status_incident_updates (
  id uuid primary key default gen_random_uuid(),
  status_event_id uuid not null references public.status_events (id) on delete cascade,
  organization_id uuid references public.organizations (id) on delete cascade,
  update_type text not null default 'update' check (
    update_type in ('acknowledgement', 'update', 'resolution', 'maintenance_notice')
  ),
  message text not null,
  public_visibility boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists status_incident_updates_event_idx
  on public.status_incident_updates (status_event_id, created_at desc);

alter table public.status_incident_updates enable row level security;
revoke all on public.status_incident_updates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. status_uptime_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.status_uptime_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  component text not null,
  measurement_period text not null check (measurement_period in ('daily', 'monthly', 'annual')),
  period_start date not null,
  period_end date not null,
  uptime_percentage numeric(5, 2) not null default 100.00,
  incident_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists status_uptime_metrics_org_period_idx
  on public.status_uptime_metrics (organization_id, component, measurement_period, period_start desc);

alter table public.status_uptime_metrics enable row level security;
revoke all on public.status_uptime_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. status_transparency_settings
-- ---------------------------------------------------------------------------
create table if not exists public.status_transparency_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  public_status_page_enabled boolean not null default true,
  tenant_notices_enabled boolean not null default true,
  auto_publish_from_observability boolean not null default false,
  critical_bypass_quiet_hours boolean not null default true,
  enabled_components jsonb not null default '{
    "authentication":true,"support_ai":true,"admin_assistant":true,"knowledge_center":true,
    "integrations":true,"notifications":true,"dashboard":true,"api_platform":true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.status_transparency_settings enable row level security;
revoke all on public.status_transparency_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_status_transparency', v.description
from (values
  ('status.view', 'View Status', 'View platform status and incident communications'),
  ('status.manage', 'Manage Status', 'Configure status transparency settings'),
  ('incidents.publish', 'Publish Incidents', 'Publish and update public incident communications'),
  ('maintenance.manage', 'Manage Maintenance', 'Publish maintenance notices and schedules')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'status.view'), ('owner', 'status.manage'), ('owner', 'incidents.publish'), ('owner', 'maintenance.manage'),
  ('administrator', 'status.view'), ('administrator', 'status.manage'), ('administrator', 'incidents.publish'), ('administrator', 'maintenance.manage'),
  ('manager', 'status.view'), ('manager', 'incidents.publish'),
  ('support_agent', 'status.view'),
  ('viewer', 'status.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ste_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ste_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'status_transparency',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

drop function if exists public._ste_ensure_settings(uuid);

create or replace function public._ste_ensure_settings(p_organization_id uuid)
returns public.status_transparency_settings language plpgsql security definer set search_path = public as $$
declare v_row public.status_transparency_settings;
begin
  insert into public.status_transparency_settings (organization_id) values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.status_transparency_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._ste_overall_status(p_organization_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_status text;
begin
  select status into v_status
  from public.status_events
  where (organization_id = p_organization_id or organization_id is null)
    and resolved_at is null
  order by
    case status
      when 'major_outage' then 0
      when 'partial_outage' then 1
      when 'degraded_performance' then 2
      when 'maintenance' then 3
      else 4
    end,
    started_at desc
  limit 1;

  return coalesce(v_status, 'operational');
end; $$;

create or replace function public._ste_seed_uptime(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.status_uptime_metrics (
    organization_id, component, measurement_period, period_start, period_end,
    uptime_percentage, incident_count
  )
  select
    p_organization_id, c.component, 'monthly',
    date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month - 1 day')::date,
    99.90, 0
  from (values
    ('authentication'), ('support_ai'), ('admin_assistant'), ('knowledge_center'),
    ('integrations'), ('notifications'), ('dashboard'), ('api_platform')
  ) as c(component)
  where not exists (
    select 1 from public.status_uptime_metrics m
    where m.organization_id = p_organization_id
      and m.component = c.component
      and m.measurement_period = 'monthly'
      and m.period_start = date_trunc('month', now())::date
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_status_event(
  p_component text,
  p_status text default 'operational',
  p_severity text default 'informational',
  p_title text default 'Status update',
  p_description text default null,
  p_public_visibility boolean default true,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'status.manage');

  insert into public.status_events (
    organization_id, component, status, severity, title, description,
    public_visibility, metadata, started_at
  ) values (
    v_org_id, p_component, p_status, p_severity, p_title, p_description,
    p_public_visibility, p_metadata, now()
  ) returning id into v_id;

  perform public._ste_log(v_org_id, 'status_event_recorded', 'status_event', v_id,
    jsonb_build_object('component', p_component, 'status', p_status, 'public', p_public_visibility));

  return jsonb_build_object('id', v_id, 'status', p_status);
end; $$;

create or replace function public.publish_status_incident(
  p_title text,
  p_description text default null,
  p_component text default 'platform',
  p_severity text default 'high',
  p_status text default 'partial_outage',
  p_public_visibility boolean default true,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'incidents.publish');

  insert into public.status_events (
    organization_id, component, status, severity, title, description,
    public_visibility, metadata, started_at
  ) values (
    v_org_id, p_component, p_status, p_severity, p_title, p_description,
    p_public_visibility, p_metadata, now()
  ) returning id into v_id;

  insert into public.status_incident_updates (
    status_event_id, organization_id, update_type, message, public_visibility
  ) values (
    v_id, v_org_id, 'acknowledgement',
    coalesce(p_description, 'Incident acknowledged and under investigation.'),
    p_public_visibility
  );

  perform public._ste_log(v_org_id, 'incident_published', 'status_event', v_id,
    jsonb_build_object('title', p_title, 'component', p_component, 'severity', p_severity));

  return jsonb_build_object('id', v_id, 'status', p_status);
end; $$;

create or replace function public.update_status_incident(
  p_event_id uuid,
  p_message text,
  p_update_type text default 'update',
  p_public_visibility boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_event public.status_events;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'incidents.publish');

  select * into v_event from public.status_events
  where id = p_event_id and organization_id = v_org_id;
  if not found then raise exception 'Status event not found'; end if;

  insert into public.status_incident_updates (
    status_event_id, organization_id, update_type, message, public_visibility
  ) values (p_event_id, v_org_id, p_update_type, p_message, p_public_visibility);

  update public.status_events set updated_at = now() where id = p_event_id;

  perform public._ste_log(v_org_id, 'incident_updated', 'status_event', p_event_id,
    jsonb_build_object('update_type', p_update_type));

  return jsonb_build_object('id', p_event_id, 'updated', true);
end; $$;

create or replace function public.resolve_status_incident(
  p_event_id uuid,
  p_resolution_message text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_event public.status_events;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'incidents.publish');

  select * into v_event from public.status_events
  where id = p_event_id and organization_id = v_org_id;
  if not found then raise exception 'Status event not found'; end if;

  update public.status_events
  set status = 'operational', resolved_at = now(), updated_at = now()
  where id = p_event_id;

  insert into public.status_incident_updates (
    status_event_id, organization_id, update_type, message, public_visibility
  ) values (
    p_event_id, v_org_id, 'resolution',
    coalesce(p_resolution_message, 'Incident resolved. Services restored.'),
    v_event.public_visibility
  );

  perform public._ste_log(v_org_id, 'incident_resolved', 'status_event', p_event_id, '{}'::jsonb);

  return jsonb_build_object('id', p_event_id, 'resolved', true);
end; $$;

create or replace function public.publish_maintenance_notice(
  p_title text,
  p_description text default null,
  p_component text default 'platform',
  p_estimated_duration_minutes int default 60,
  p_affected_services jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'maintenance.manage');

  insert into public.status_events (
    organization_id, component, status, severity, title, description,
    public_visibility, metadata, started_at
  ) values (
    v_org_id, p_component, 'maintenance', 'informational', p_title, p_description,
    true,
    jsonb_build_object(
      'estimated_duration_minutes', p_estimated_duration_minutes,
      'affected_services', p_affected_services,
      'maintenance', true
    ),
    now()
  ) returning id into v_id;

  insert into public.status_incident_updates (
    status_event_id, organization_id, update_type, message, public_visibility
  ) values (
    v_id, v_org_id, 'maintenance_notice',
    coalesce(p_description, 'Scheduled maintenance in progress.'),
    true
  );

  perform public._ste_log(v_org_id, 'maintenance_announced', 'status_event', v_id,
    jsonb_build_object('title', p_title, 'duration_minutes', p_estimated_duration_minutes));

  return jsonb_build_object('id', v_id, 'status', 'maintenance');
end; $$;

create or replace function public.get_platform_status_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);

  return jsonb_build_object(
    'overall_status', public._ste_overall_status(v_org_id),
    'updated_at', now()
  );
end; $$;

create or replace function public.get_public_status()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  begin
    v_org_id := public._mta_require_organization();
  exception when others then
    v_org_id := null;
  end;

  return jsonb_build_object(
    'overall_status', public._ste_overall_status(v_org_id),
    'active_incidents', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'component', e.component, 'status', e.status, 'severity', e.severity,
        'title', e.title, 'description', e.description, 'started_at', e.started_at
      ) order by e.started_at desc)
      from public.status_events e
      where e.resolved_at is null
        and e.public_visibility = true
        and (v_org_id is null or e.organization_id = v_org_id or e.organization_id is null)
      limit 10
    ), '[]'::jsonb),
    'recent_resolutions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'title', e.title, 'component', e.component, 'resolved_at', e.resolved_at
      ) order by e.resolved_at desc nulls last)
      from public.status_events e
      where e.resolved_at is not null
        and e.public_visibility = true
        and (v_org_id is null or e.organization_id = v_org_id or e.organization_id is null)
      limit 5
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_status_transparency_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.status_transparency_settings;
  v_overall text;
begin
  v_org_id := public._mta_require_organization();
  v_settings := public._ste_ensure_settings(v_org_id);
  perform public._ste_seed_uptime(v_org_id);
  v_overall := public._ste_overall_status(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Transparent status communication builds trust — timely, accurate, and accountable.',
    'principles', jsonb_build_array(
      'Transparency and accuracy in all communications',
      'Tenant-aware incident visibility with public and internal views',
      'Historical accountability through uptime tracking',
      'Maintenance notices reduce uncertainty',
      'Distinct from technical observability (A.19) — customer-facing status'
    ),
    'overall_status', v_overall,
    'settings', row_to_json(v_settings),
    'component_status', coalesce((
      select jsonb_object_agg(sub.component, sub.payload)
      from (
        select distinct on (e.component)
          e.component,
          jsonb_build_object(
            'status', e.status, 'severity', e.severity, 'title', e.title,
            'started_at', e.started_at, 'resolved_at', e.resolved_at
          ) as payload
        from public.status_events e
        where e.organization_id = v_org_id
        order by e.component, e.started_at desc
      ) sub
    ), '{}'::jsonb),
    'active_incidents', coalesce((
      select jsonb_agg(row_to_json(e) order by
        case e.severity when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end,
        e.started_at desc)
      from public.status_events e
      where e.organization_id = v_org_id and e.resolved_at is null
        and e.status in ('degraded_performance', 'partial_outage', 'major_outage')
    ), '[]'::jsonb),
    'scheduled_maintenance', coalesce((
      select jsonb_agg(row_to_json(e) order by e.started_at)
      from public.status_events e
      where e.organization_id = v_org_id and e.status = 'maintenance' and e.resolved_at is null
    ), '[]'::jsonb),
    'recent_resolutions', coalesce((
      select jsonb_agg(row_to_json(e) order by e.resolved_at desc nulls last)
      from public.status_events e
      where e.organization_id = v_org_id and e.resolved_at is not null
      limit 10
    ), '[]'::jsonb),
    'uptime_trends', coalesce((
      select jsonb_agg(row_to_json(m) order by m.period_start desc)
      from public.status_uptime_metrics m
      where m.organization_id = v_org_id
      limit 24
    ), '[]'::jsonb),
    'incident_updates', coalesce((
      select jsonb_agg(row_to_json(u) order by u.created_at desc)
      from public.status_incident_updates u
      where u.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'summary', jsonb_build_object(
      'open_incidents', coalesce((
        select count(*) from public.status_events
        where organization_id = v_org_id and resolved_at is null
          and status in ('degraded_performance', 'partial_outage', 'major_outage')
      ), 0),
      'maintenance_active', coalesce((
        select count(*) from public.status_events
        where organization_id = v_org_id and status = 'maintenance' and resolved_at is null
      ), 0),
      'monthly_uptime_avg', coalesce((
        select round(avg(uptime_percentage), 2) from public.status_uptime_metrics
        where organization_id = v_org_id and measurement_period = 'monthly'
      ), 99.90)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_status_transparency_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._ste_ensure_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'overall_status', public._ste_overall_status(v_org_id),
    'open_incidents', coalesce((
      select count(*) from public.status_events
      where organization_id = v_org_id and resolved_at is null
        and status in ('degraded_performance', 'partial_outage', 'major_outage')
    ), 0),
    'philosophy', 'Status transparency builds operational confidence.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.save_status_transparency_settings(
  p_public_status_page_enabled boolean default null,
  p_tenant_notices_enabled boolean default null,
  p_auto_publish_from_observability boolean default null,
  p_critical_bypass_quiet_hours boolean default null,
  p_enabled_components jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.status_transparency_settings;
begin
  v_org_id := public._mta_require_organization();
  perform public._irp_require_permission(v_org_id, 'status.manage');
  perform public._ste_ensure_settings(v_org_id);

  update public.status_transparency_settings set
    public_status_page_enabled = coalesce(p_public_status_page_enabled, public_status_page_enabled),
    tenant_notices_enabled = coalesce(p_tenant_notices_enabled, tenant_notices_enabled),
    auto_publish_from_observability = coalesce(p_auto_publish_from_observability, auto_publish_from_observability),
    critical_bypass_quiet_hours = coalesce(p_critical_bypass_quiet_hours, critical_bypass_quiet_hours),
    enabled_components = coalesce(p_enabled_components, enabled_components),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ste_log(v_org_id, 'status_configuration_changed', 'status_settings', v_row.id, '{}'::jsonb);

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
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
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'status-transparency-engine', 'Status & Transparency Engine', 'Public and internal status communication, incidents, maintenance notices, and uptime transparency.', 'authenticated', 70
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'status-transparency-engine' and tenant_id is null);

grant execute on function public.record_status_event(text, text, text, text, text, boolean, jsonb) to authenticated;
grant execute on function public.publish_status_incident(text, text, text, text, text, boolean, jsonb) to authenticated;
grant execute on function public.update_status_incident(uuid, text, text, boolean) to authenticated;
grant execute on function public.resolve_status_incident(uuid, text) to authenticated;
grant execute on function public.publish_maintenance_notice(text, text, text, int, jsonb) to authenticated;
grant execute on function public.get_platform_status_summary() to authenticated;
grant execute on function public.get_public_status() to authenticated;
grant execute on function public.get_status_transparency_engine_dashboard() to authenticated;
grant execute on function public.get_status_transparency_engine_card() to authenticated;
grant execute on function public.save_status_transparency_settings(boolean, boolean, boolean, boolean, jsonb) to authenticated;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._ste_ensure_settings(v_org_id);
    perform public._ste_seed_uptime(v_org_id);
  end loop;
end $$;
