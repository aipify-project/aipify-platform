-- Phase A.51 — Incident Response Coordination Engine
-- Extends Operations Center Foundation (A.32), Executive Insights (A.35), Organizational Resilience (A.50).

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
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. incident_records
-- ---------------------------------------------------------------------------
create table if not exists public.incident_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_title text not null,
  incident_type text not null check (
    incident_type in (
      'support_incident', 'system_outage', 'integration_failure',
      'security_incident', 'operational_disruption', 'customer_impacting'
    )
  ),
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'identified' check (
    status in ('identified', 'investigating', 'mitigated', 'resolved', 'closed')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  detected_at timestamptz not null default now(),
  resolved_at timestamptz,
  root_cause_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists incident_records_org_idx
  on public.incident_records (organization_id, status, severity, detected_at desc);

alter table public.incident_records enable row level security;
revoke all on public.incident_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. incident_communications
-- ---------------------------------------------------------------------------
create table if not exists public.incident_communications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_id uuid not null references public.incident_records (id) on delete cascade,
  communication_type text not null check (
    communication_type in ('stakeholder', 'executive', 'resolution', 'escalation')
  ),
  content_metadata jsonb not null default '{}'::jsonb,
  released_at timestamptz not null default now(),
  released_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists incident_communications_incident_idx
  on public.incident_communications (incident_id, communication_type, released_at desc);

alter table public.incident_communications enable row level security;
revoke all on public.incident_communications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. incident_timeline_events
-- ---------------------------------------------------------------------------
create table if not exists public.incident_timeline_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_id uuid not null references public.incident_records (id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists incident_timeline_events_incident_idx
  on public.incident_timeline_events (incident_id, created_at desc);

alter table public.incident_timeline_events enable row level security;
revoke all on public.incident_timeline_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. incident_lessons_learned
-- ---------------------------------------------------------------------------
create table if not exists public.incident_lessons_learned (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  incident_id uuid not null references public.incident_records (id) on delete cascade,
  summary text not null,
  recommendations jsonb not null default '[]'::jsonb,
  org_memory_hook_metadata jsonb not null default '{}'::jsonb,
  captured_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists incident_lessons_learned_incident_idx
  on public.incident_lessons_learned (incident_id, created_at desc);

alter table public.incident_lessons_learned enable row level security;
revoke all on public.incident_lessons_learned from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'incident_response', v.description
from (values
  ('incidents.view', 'View Incidents', 'View incident records, timeline, and communications'),
  ('incidents.resolve', 'Resolve Incidents', 'Resolve and close coordinated incidents'),
  ('incidents.escalate', 'Escalate Incidents', 'Escalate incidents with structured communication')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'incidents.view'), ('owner', 'incidents.manage'), ('owner', 'incidents.resolve'), ('owner', 'incidents.escalate'),
  ('administrator', 'incidents.view'), ('administrator', 'incidents.manage'), ('administrator', 'incidents.resolve'), ('administrator', 'incidents.escalate'),
  ('manager', 'incidents.view'), ('manager', 'incidents.manage'), ('manager', 'incidents.resolve'), ('manager', 'incidents.escalate'),
  ('support_agent', 'incidents.view'), ('support_agent', 'incidents.escalate'),
  ('viewer', 'incidents.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_irce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._irce_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'incident_record',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._irce_record_timeline(
  p_organization_id uuid,
  p_incident_id uuid,
  p_event_type text,
  p_metadata jsonb default '{}'::jsonb,
  p_recorded_by uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.incident_timeline_events (
    organization_id, incident_id, event_type, metadata, recorded_by
  )
  values (
    p_organization_id, p_incident_id, p_event_type,
    coalesce(p_metadata, '{}'::jsonb), p_recorded_by
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._irce_operations_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'operations_center_events' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'open_events', coalesce((
      select count(*) from public.operations_center_events
      where organization_id = p_organization_id and status in ('open', 'assigned', 'escalated')
    ), 0),
    'resolved_recent', coalesce((
      select count(*) from public.operations_center_events
      where organization_id = p_organization_id and status = 'resolved'
        and resolved_at >= now() - interval '30 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._irce_resilience_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'resilience_plans' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = p_organization_id and status in ('open', 'mitigating')
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._irce_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'open_incidents', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
    ), 0),
    'critical_open', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
        and severity = 'critical'
    ), 0),
    'resolved_30d', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('resolved', 'closed')
        and resolved_at >= now() - interval '30 days'
    ), 0),
    'lessons_captured_90d', coalesce((
      select count(*) from public.incident_lessons_learned
      where organization_id = p_organization_id and created_at >= now() - interval '90 days'
    ), 0)
  );
end; $$;

create or replace function public._irce_capture_memory_hook(
  p_organization_id uuid,
  p_incident_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'lessons_learned',
    left(coalesce(p_summary, 'Incident lessons learned captured'), 500),
    jsonb_build_object(
      'source', 'incident_response_coordination_engine',
      'incident_id', p_incident_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._irce_seed_incidents(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_incident_id uuid;
begin
  if exists (select 1 from public.incident_records where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.incident_records (
    organization_id, incident_title, incident_type, severity, status, detected_at,
    root_cause_metadata
  )
  values (
    p_organization_id,
    'Elevated support response times',
    'support_incident',
    'medium',
    'identified',
    now() - interval '2 hours',
    jsonb_build_object('category', 'capacity', 'detected_by', 'seed')
  )
  returning id into v_incident_id;

  perform public._irce_record_timeline(
    p_organization_id, v_incident_id, 'incident_identified',
    jsonb_build_object('source', 'seed', 'summary', 'Support queue latency exceeded threshold')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_incident(
  p_incident_title text,
  p_incident_type text,
  p_severity text default 'medium',
  p_owner_user_id uuid default null,
  p_detected_at timestamptz default null,
  p_root_cause_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_records; v_user_id uuid;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_incident_title), '') = '' then raise exception 'Incident title required'; end if;

  insert into public.incident_records (
    organization_id, incident_title, incident_type, severity, owner_user_id,
    detected_at, root_cause_metadata, created_by, status
  )
  values (
    v_org_id, left(trim(p_incident_title), 200), p_incident_type,
    coalesce(p_severity, 'medium'), coalesce(p_owner_user_id, v_user_id),
    coalesce(p_detected_at, now()), coalesce(p_root_cause_metadata, '{}'::jsonb),
    v_user_id, 'identified'
  )
  returning * into v_row;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'incident_created',
    jsonb_build_object('incident_title', v_row.incident_title, 'severity', v_row.severity),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_created', 'incident_record', v_row.id,
    jsonb_build_object('incident_title', v_row.incident_title, 'incident_type', v_row.incident_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.assign_incident_owner(
  p_incident_id uuid,
  p_owner_user_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_records; v_user_id uuid;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.incident_records
  set owner_user_id = p_owner_user_id, updated_at = now()
  where id = p_incident_id and organization_id = v_org_id
    and status not in ('resolved', 'closed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or not assignable'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'owner_assigned',
    jsonb_build_object('owner_user_id', p_owner_user_id),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_owner_assigned', 'incident_record', v_row.id,
    jsonb_build_object('owner_user_id', p_owner_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_incident_severity(
  p_incident_id uuid,
  p_severity text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_records; v_user_id uuid; v_prev text;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select severity into v_prev from public.incident_records
  where id = p_incident_id and organization_id = v_org_id;

  update public.incident_records
  set severity = p_severity, updated_at = now()
  where id = p_incident_id and organization_id = v_org_id
    and status not in ('resolved', 'closed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or not updatable'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'severity_updated',
    jsonb_build_object('previous', v_prev, 'current', p_severity),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_severity_updated', 'incident_record', v_row.id,
    jsonb_build_object('previous', v_prev, 'severity', p_severity)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_incident_status(
  p_incident_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_records; v_user_id uuid; v_prev text;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select status into v_prev from public.incident_records
  where id = p_incident_id and organization_id = v_org_id;

  update public.incident_records
  set status = p_status, updated_at = now()
  where id = p_incident_id and organization_id = v_org_id
    and status not in ('closed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or not updatable'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'status_updated',
    jsonb_build_object('previous', v_prev, 'current', p_status),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_status_updated', 'incident_record', v_row.id,
    jsonb_build_object('previous', v_prev, 'status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.escalate_incident(
  p_incident_id uuid,
  p_escalation_metadata jsonb default '{}'::jsonb,
  p_communication_content jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.incident_records;
  v_user_id uuid;
  v_comm public.incident_communications;
begin
  perform public._irp_require_permission('incidents.escalate');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.incident_records
  set
    severity = case when severity = 'low' then 'medium' when severity = 'medium' then 'high' else severity end,
    status = case when status = 'identified' then 'investigating' else status end,
    updated_at = now()
  where id = p_incident_id and organization_id = v_org_id
    and status not in ('resolved', 'closed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or not escalatable'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'incident_escalated',
    coalesce(p_escalation_metadata, '{}'::jsonb),
    v_user_id
  );

  insert into public.incident_communications (
    organization_id, incident_id, communication_type, content_metadata, released_by
  )
  values (
    v_org_id, v_row.id, 'escalation',
    coalesce(p_communication_content, jsonb_build_object('summary', 'Incident escalated for coordinated response')),
    v_user_id
  )
  returning * into v_comm;

  perform public._irce_log(
    v_org_id, 'irce_incident_escalated', 'incident_record', v_row.id,
    jsonb_build_object('communication_id', v_comm.id, 'escalation', p_escalation_metadata)
  );

  return jsonb_build_object('incident', row_to_json(v_row)::jsonb, 'communication', row_to_json(v_comm)::jsonb);
end; $$;

create or replace function public.resolve_incident(
  p_incident_id uuid,
  p_root_cause_metadata jsonb default '{}'::jsonb,
  p_communication_content jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.incident_records;
  v_user_id uuid;
  v_comm public.incident_communications;
begin
  perform public._irp_require_permission('incidents.resolve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.incident_records
  set
    status = 'resolved',
    resolved_at = now(),
    root_cause_metadata = coalesce(p_root_cause_metadata, root_cause_metadata),
    updated_at = now()
  where id = p_incident_id and organization_id = v_org_id
    and status not in ('resolved', 'closed')
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or not resolvable'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'incident_resolved',
    coalesce(p_root_cause_metadata, '{}'::jsonb),
    v_user_id
  );

  insert into public.incident_communications (
    organization_id, incident_id, communication_type, content_metadata, released_by
  )
  values (
    v_org_id, v_row.id, 'resolution',
    coalesce(p_communication_content, jsonb_build_object('summary', 'Incident resolved')),
    v_user_id
  )
  returning * into v_comm;

  perform public._irce_log(
    v_org_id, 'irce_incident_resolved', 'incident_record', v_row.id,
    jsonb_build_object('communication_id', v_comm.id)
  );

  return jsonb_build_object('incident', row_to_json(v_row)::jsonb, 'communication', row_to_json(v_comm)::jsonb);
end; $$;

create or replace function public.close_incident(p_incident_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_records; v_user_id uuid;
begin
  perform public._irp_require_permission('incidents.resolve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.incident_records
  set status = 'closed', updated_at = now()
  where id = p_incident_id and organization_id = v_org_id and status = 'resolved'
  returning * into v_row;

  if v_row.id is null then raise exception 'Incident not found or must be resolved before closing'; end if;

  perform public._irce_record_timeline(
    v_org_id, v_row.id, 'incident_closed',
    jsonb_build_object('closed_at', now()),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_closed', 'incident_record', v_row.id,
    jsonb_build_object('incident_title', v_row.incident_title)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_incident_communication(
  p_incident_id uuid,
  p_communication_type text,
  p_content_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.incident_communications; v_user_id uuid;
begin
  perform public._irp_require_permission('incidents.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.incident_records where id = p_incident_id and organization_id = v_org_id
  ) then
    raise exception 'Incident not found';
  end if;

  insert into public.incident_communications (
    organization_id, incident_id, communication_type, content_metadata, released_by
  )
  values (
    v_org_id, p_incident_id, p_communication_type,
    coalesce(p_content_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._irce_record_timeline(
    v_org_id, p_incident_id, 'communication_released',
    jsonb_build_object('communication_type', p_communication_type, 'communication_id', v_row.id),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_communication_recorded', 'incident_communication', v_row.id,
    jsonb_build_object('incident_id', p_incident_id, 'communication_type', p_communication_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.capture_incident_lessons_learned(
  p_incident_id uuid,
  p_summary text,
  p_recommendations jsonb default '[]'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.incident_lessons_learned;
  v_user_id uuid;
  v_memory jsonb;
begin
  perform public._irp_require_permission('incidents.resolve');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.incident_records
    where id = p_incident_id and organization_id = v_org_id
      and status in ('resolved', 'closed', 'mitigated')
  ) then
    raise exception 'Incident not found or not ready for lessons learned';
  end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._irce_capture_memory_hook(v_org_id, p_incident_id, p_summary, p_recommendations);
  end if;

  insert into public.incident_lessons_learned (
    organization_id, incident_id, summary, recommendations,
    org_memory_hook_metadata, captured_by
  )
  values (
    v_org_id, p_incident_id, left(coalesce(trim(p_summary), 'Lessons learned captured'), 500),
    coalesce(p_recommendations, '[]'::jsonb),
    v_memory, v_user_id
  )
  returning * into v_row;

  perform public._irce_record_timeline(
    v_org_id, p_incident_id, 'lessons_learned_captured',
    jsonb_build_object('summary', left(p_summary, 200), 'memory_hook', v_memory),
    v_user_id
  );

  perform public._irce_log(
    v_org_id, 'irce_incident_lessons_captured', 'incident_lessons_learned', v_row.id,
    jsonb_build_object('incident_id', p_incident_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('lesson', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.get_incident_executive_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('incidents.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Rapid response with clear ownership — structured escalation and transparent communication.',
    'summary', public._irce_executive_summary_block(v_org_id),
    'critical_open', coalesce((
      select count(*) from public.incident_records
      where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
        and severity = 'critical'
    ), 0),
    'unassigned_open', coalesce((
      select count(*) from public.incident_records
      where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
        and owner_user_id is null
    ), 0),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'Feeds executive visibility via A.35 reporting scaffolds',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'organizational_resilience', 'Links to continuity plans via A.50 resilience summary'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_incident_response_coordination_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('incidents.view');
  v_org_id := public._mta_require_organization();
  perform public._irce_seed_incidents(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Rapid response with clear ownership — humans coordinate, Aipify structures escalation.',
    'principles', jsonb_build_array(
      'Rapid response',
      'Clear ownership',
      'Structured escalation',
      'Transparent communication',
      'Audit accountability'
    ),
    'summary', jsonb_build_object(
      'total_incidents', coalesce((
        select count(*) from public.incident_records where organization_id = v_org_id
      ), 0),
      'open_incidents', coalesce((
        select count(*) from public.incident_records
        where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
      ), 0),
      'critical_open', coalesce((
        select count(*) from public.incident_records
        where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
          and severity = 'critical'
      ), 0),
      'resolved_30d', coalesce((
        select count(*) from public.incident_records
        where organization_id = v_org_id and status in ('resolved', 'closed')
          and resolved_at >= now() - interval '30 days'
      ), 0),
      'communications_30d', coalesce((
        select count(*) from public.incident_communications
        where organization_id = v_org_id and released_at >= now() - interval '30 days'
      ), 0),
      'lessons_captured', coalesce((
        select count(*) from public.incident_lessons_learned where organization_id = v_org_id
      ), 0)
    ),
    'incidents', coalesce((
      select jsonb_agg(row_to_json(ir) order by ir.detected_at desc)
      from public.incident_records ir where ir.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'timeline_events', coalesce((
      select jsonb_agg(row_to_json(te) order by te.created_at desc)
      from public.incident_timeline_events te where te.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'communications', coalesce((
      select jsonb_agg(row_to_json(ic) order by ic.released_at desc)
      from public.incident_communications ic where ic.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'lessons_learned', coalesce((
      select jsonb_agg(row_to_json(il) order by il.created_at desc)
      from public.incident_lessons_learned il where il.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._irce_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Extends Operations Center Foundation (A.32) with coordinated incident workflow',
      'executive_insights', 'Executive summary via get_incident_executive_summary() — A.35',
      'organizational_resilience', 'Resilience summary links active incidents to continuity context — A.50',
      'organizational_memory', 'Lessons learned may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'operations', public._irce_operations_summary(v_org_id),
      'resilience', public._irce_resilience_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_incident_response_coordination_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._irce_seed_incidents(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Coordinated incident response with structured escalation and audit accountability.',
    'open_incidents', coalesce((
      select count(*) from public.incident_records
      where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
    ), 0),
    'critical_open', coalesce((
      select count(*) from public.incident_records
      where organization_id = v_org_id and status in ('identified', 'investigating', 'mitigated')
        and severity = 'critical'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Audit allowlist extension
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
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'incident-response-coordination-engine', 'Incident Response Coordination Engine', 'Coordinated incident response with ownership, escalation, communications, and lessons learned.', 'authenticated', 82
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'incident-response-coordination-engine' and tenant_id is null);

grant execute on function public.create_incident(text, text, text, uuid, timestamptz, jsonb) to authenticated;
grant execute on function public.assign_incident_owner(uuid, uuid) to authenticated;
grant execute on function public.update_incident_severity(uuid, text) to authenticated;
grant execute on function public.update_incident_status(uuid, text) to authenticated;
grant execute on function public.escalate_incident(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.resolve_incident(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.close_incident(uuid) to authenticated;
grant execute on function public.record_incident_communication(uuid, text, jsonb) to authenticated;
grant execute on function public.capture_incident_lessons_learned(uuid, text, jsonb, boolean) to authenticated;
grant execute on function public.get_incident_executive_summary() to authenticated;
grant execute on function public.get_incident_response_coordination_engine_dashboard() to authenticated;
grant execute on function public.get_incident_response_coordination_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._irce_seed_incidents(v_org_id);
  end loop;
end $$;
