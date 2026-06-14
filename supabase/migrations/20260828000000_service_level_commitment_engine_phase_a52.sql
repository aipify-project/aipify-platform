-- Phase A.52 — Service Level & Commitment Engine
-- Extends Customer Success (A.26), Operations Center Foundation (A.32), Incident Response (A.51).

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
    'incident_response_coordination_engine',
    'service_level_commitment_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. service_commitments
-- ---------------------------------------------------------------------------
create table if not exists public.service_commitments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  commitment_name text not null,
  commitment_type text not null check (
    commitment_type in (
      'support_response', 'incident_response', 'resolution_target',
      'onboarding_commitment', 'approval_turnaround'
    )
  ),
  target_value numeric not null check (target_value > 0),
  measurement_unit text not null check (
    measurement_unit in ('minutes', 'hours', 'business_days', 'percentage')
  ),
  severity_scope text not null default 'medium' check (
    severity_scope in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'active' check (
    status in ('active', 'paused', 'retired')
  ),
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_commitments_org_idx
  on public.service_commitments (organization_id, status, commitment_type, created_at desc);

alter table public.service_commitments enable row level security;
revoke all on public.service_commitments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. service_commitment_performance
-- ---------------------------------------------------------------------------
create table if not exists public.service_commitment_performance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  commitment_id uuid not null references public.service_commitments (id) on delete cascade,
  period text not null,
  compliance_rate numeric not null default 100 check (compliance_rate >= 0 and compliance_rate <= 100),
  missed_count int not null default 0 check (missed_count >= 0),
  average_value numeric,
  trend_metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (commitment_id, period)
);

create index if not exists service_commitment_performance_commitment_idx
  on public.service_commitment_performance (commitment_id, period desc);

alter table public.service_commitment_performance enable row level security;
revoke all on public.service_commitment_performance from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. service_commitment_alerts
-- ---------------------------------------------------------------------------
create table if not exists public.service_commitment_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  commitment_id uuid not null references public.service_commitments (id) on delete cascade,
  alert_type text not null check (
    alert_type in ('threshold_warning', 'breach', 'escalation')
  ),
  status text not null default 'open' check (
    status in ('open', 'acknowledged', 'resolved')
  ),
  metadata jsonb not null default '{}'::jsonb,
  acknowledged_by uuid references public.users (id) on delete set null,
  acknowledged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_commitment_alerts_commitment_idx
  on public.service_commitment_alerts (commitment_id, status, alert_type, created_at desc);

alter table public.service_commitment_alerts enable row level security;
revoke all on public.service_commitment_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. service_commitment_reports
-- ---------------------------------------------------------------------------
create table if not exists public.service_commitment_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null default 'commitment_compliance',
  exported_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists service_commitment_reports_org_idx
  on public.service_commitment_reports (organization_id, report_type, created_at desc);

alter table public.service_commitment_reports enable row level security;
revoke all on public.service_commitment_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'service_level_commitment', v.description
from (values
  ('commitments.view', 'View Commitments', 'View service commitments, performance, and alerts'),
  ('commitments.manage', 'Manage Commitments', 'Create, update, pause, and retire service commitments'),
  ('commitments.review', 'Review Commitments', 'Record performance and acknowledge commitment alerts'),
  ('commitments.export', 'Export Commitments', 'Export commitment compliance reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'commitments.view'), ('owner', 'commitments.manage'), ('owner', 'commitments.review'), ('owner', 'commitments.export'),
  ('administrator', 'commitments.view'), ('administrator', 'commitments.manage'), ('administrator', 'commitments.review'), ('administrator', 'commitments.export'),
  ('manager', 'commitments.view'), ('manager', 'commitments.manage'), ('manager', 'commitments.review'), ('manager', 'commitments.export'),
  ('support_agent', 'commitments.view'), ('support_agent', 'commitments.review'),
  ('viewer', 'commitments.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_slce_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._slce_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'service_commitment',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._slce_operations_summary(p_organization_id uuid)
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
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._slce_customer_success_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_customer_success' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'health_score', coalesce((
      select health_score from public.organization_customer_success
      where organization_id = p_organization_id limit 1
    ), 75),
    'renewal_risk', coalesce((
      select renewal_risk from public.organization_customer_success
      where organization_id = p_organization_id limit 1
    ), 'low')
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._slce_incident_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'incident_records' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'open_incidents', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
    ), 0),
    'critical_open', coalesce((
      select count(*) from public.incident_records
      where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
        and severity = 'critical'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._slce_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_commitments', coalesce((
      select count(*) from public.service_commitments
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'open_alerts', coalesce((
      select count(*) from public.service_commitment_alerts
      where organization_id = p_organization_id and status = 'open'
    ), 0),
    'breaches_30d', coalesce((
      select count(*) from public.service_commitment_alerts
      where organization_id = p_organization_id and alert_type = 'breach'
        and created_at >= now() - interval '30 days'
    ), 0),
    'avg_compliance_30d', coalesce((
      select round(avg(compliance_rate), 2) from public.service_commitment_performance
      where organization_id = p_organization_id and created_at >= now() - interval '30 days'
    ), 100)
  );
end; $$;

create or replace function public._slce_capture_memory_hook(
  p_organization_id uuid,
  p_commitment_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'service_commitment',
    left(coalesce(p_summary, 'Service commitment learning captured'), 500),
    jsonb_build_object(
      'source', 'service_level_commitment_engine',
      'commitment_id', p_commitment_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._slce_seed_commitments(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_commitment_id uuid;
  v_period text;
begin
  if exists (select 1 from public.service_commitments where organization_id = p_organization_id limit 1) then
    return;
  end if;

  v_period := to_char(now(), 'YYYY-MM');

  insert into public.service_commitments (
    organization_id, commitment_name, commitment_type, target_value,
    measurement_unit, severity_scope, status
  )
  values (
    p_organization_id,
    'First support response',
    'support_response',
    60,
    'minutes',
    'medium',
    'active'
  )
  returning id into v_commitment_id;

  insert into public.service_commitment_performance (
    organization_id, commitment_id, period, compliance_rate, missed_count,
    average_value, trend_metadata
  )
  values (
    p_organization_id, v_commitment_id, v_period, 92.5, 3, 48,
    jsonb_build_object('direction', 'stable', 'source', 'seed')
  );

  insert into public.service_commitments (
    organization_id, commitment_name, commitment_type, target_value,
    measurement_unit, severity_scope, status
  )
  values (
    p_organization_id,
    'Critical incident acknowledgment',
    'incident_response',
    15,
    'minutes',
    'critical',
    'active'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_service_commitment(
  p_commitment_name text,
  p_commitment_type text,
  p_target_value numeric,
  p_measurement_unit text,
  p_severity_scope text default 'medium'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitments; v_user_id uuid;
begin
  perform public._irp_require_permission('commitments.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_commitment_name), '') = '' then raise exception 'Commitment name required'; end if;

  insert into public.service_commitments (
    organization_id, commitment_name, commitment_type, target_value,
    measurement_unit, severity_scope, created_by
  )
  values (
    v_org_id, left(trim(p_commitment_name), 200), p_commitment_type, p_target_value,
    p_measurement_unit, coalesce(p_severity_scope, 'medium'), v_user_id
  )
  returning * into v_row;

  perform public._slce_log(
    v_org_id, 'slce_commitment_created', 'service_commitment', v_row.id,
    jsonb_build_object('commitment_type', v_row.commitment_type, 'target_value', v_row.target_value)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_service_commitment(
  p_commitment_id uuid,
  p_commitment_name text default null,
  p_target_value numeric default null,
  p_measurement_unit text default null,
  p_severity_scope text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitments;
begin
  perform public._irp_require_permission('commitments.manage');
  v_org_id := public._mta_require_organization();

  update public.service_commitments
  set
    commitment_name = coalesce(nullif(trim(p_commitment_name), ''), commitment_name),
    target_value = coalesce(p_target_value, target_value),
    measurement_unit = coalesce(p_measurement_unit, measurement_unit),
    severity_scope = coalesce(p_severity_scope, severity_scope),
    updated_at = now()
  where id = p_commitment_id and organization_id = v_org_id and status != 'retired'
  returning * into v_row;

  if v_row.id is null then raise exception 'Commitment not found or retired'; end if;

  perform public._slce_log(
    v_org_id, 'slce_commitment_updated', 'service_commitment', v_row.id,
    jsonb_build_object('target_value', v_row.target_value)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.pause_service_commitment(p_commitment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitments;
begin
  perform public._irp_require_permission('commitments.manage');
  v_org_id := public._mta_require_organization();

  update public.service_commitments
  set status = 'paused', updated_at = now()
  where id = p_commitment_id and organization_id = v_org_id and status = 'active'
  returning * into v_row;

  if v_row.id is null then raise exception 'Active commitment not found'; end if;

  perform public._slce_log(v_org_id, 'slce_commitment_paused', 'service_commitment', v_row.id, '{}'::jsonb);
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.retire_service_commitment(p_commitment_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitments;
begin
  perform public._irp_require_permission('commitments.manage');
  v_org_id := public._mta_require_organization();

  update public.service_commitments
  set status = 'retired', updated_at = now()
  where id = p_commitment_id and organization_id = v_org_id and status != 'retired'
  returning * into v_row;

  if v_row.id is null then raise exception 'Commitment not found'; end if;

  perform public._slce_log(v_org_id, 'slce_commitment_retired', 'service_commitment', v_row.id, '{}'::jsonb);
  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_commitment_performance(
  p_commitment_id uuid,
  p_period text,
  p_compliance_rate numeric,
  p_missed_count int default 0,
  p_average_value numeric default null,
  p_trend_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_row public.service_commitment_performance; v_user_id uuid;
  v_memory jsonb;
begin
  perform public._irp_require_permission('commitments.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.service_commitments
    where id = p_commitment_id and organization_id = v_org_id and status = 'active'
  ) then
    raise exception 'Active commitment not found';
  end if;

  insert into public.service_commitment_performance (
    organization_id, commitment_id, period, compliance_rate, missed_count,
    average_value, trend_metadata, recorded_by
  )
  values (
    v_org_id, p_commitment_id, coalesce(nullif(trim(p_period), ''), to_char(now(), 'YYYY-MM')),
    coalesce(p_compliance_rate, 100), coalesce(p_missed_count, 0),
    p_average_value, coalesce(p_trend_metadata, '{}'::jsonb), v_user_id
  )
  on conflict (commitment_id, period) do update set
    compliance_rate = excluded.compliance_rate,
    missed_count = excluded.missed_count,
    average_value = excluded.average_value,
    trend_metadata = excluded.trend_metadata,
    recorded_by = excluded.recorded_by
  returning * into v_row;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._slce_capture_memory_hook(
      v_org_id, p_commitment_id,
      format('Performance recorded for period %s — compliance %s%%', v_row.period, v_row.compliance_rate),
      v_row.trend_metadata
    );
  end if;

  perform public._slce_log(
    v_org_id, 'slce_performance_recorded', 'service_commitment_performance', v_row.id,
    jsonb_build_object('commitment_id', p_commitment_id, 'period', v_row.period, 'memory_hook', v_memory)
  );

  return jsonb_build_object('performance', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.get_commitment_compliance_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('commitments.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'active_commitments', coalesce((
      select count(*) from public.service_commitments
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'avg_compliance', coalesce((
      select round(avg(compliance_rate), 2) from public.service_commitment_performance
      where organization_id = v_org_id
    ), 100),
    'open_alerts', coalesce((
      select count(*) from public.service_commitment_alerts
      where organization_id = v_org_id and status = 'open'
    ), 0),
    'breaches_30d', coalesce((
      select count(*) from public.service_commitment_alerts
      where organization_id = v_org_id and alert_type = 'breach'
        and created_at >= now() - interval '30 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.create_commitment_alert(
  p_commitment_id uuid,
  p_alert_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitment_alerts; v_user_id uuid;
begin
  perform public._irp_require_permission('commitments.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.service_commitments
    where id = p_commitment_id and organization_id = v_org_id and status = 'active'
  ) then
    raise exception 'Active commitment not found';
  end if;

  insert into public.service_commitment_alerts (
    organization_id, commitment_id, alert_type, metadata
  )
  values (
    v_org_id, p_commitment_id, p_alert_type, coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_row;

  perform public._slce_log(
    v_org_id, 'slce_alert_created', 'service_commitment_alert', v_row.id,
    jsonb_build_object('alert_type', v_row.alert_type, 'commitment_id', p_commitment_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.acknowledge_commitment_alert(p_alert_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.service_commitment_alerts; v_user_id uuid;
begin
  perform public._irp_require_permission('commitments.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.service_commitment_alerts
  set status = 'acknowledged', acknowledged_by = v_user_id, acknowledged_at = now(), updated_at = now()
  where id = p_alert_id and organization_id = v_org_id and status = 'open'
  returning * into v_row;

  if v_row.id is null then raise exception 'Open alert not found'; end if;

  perform public._slce_log(
    v_org_id, 'slce_alert_acknowledged', 'service_commitment_alert', v_row.id,
    jsonb_build_object('commitment_id', v_row.commitment_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_service_commitment_report(p_report_type text default 'commitment_compliance')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid; v_row public.service_commitment_reports; v_user_id uuid;
  v_active int; v_avg numeric; v_open_alerts int;
begin
  perform public._irp_require_permission('commitments.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._slce_seed_commitments(v_org_id);

  select count(*) into v_active
  from public.service_commitments where organization_id = v_org_id and status = 'active';

  select round(avg(compliance_rate), 2) into v_avg
  from public.service_commitment_performance where organization_id = v_org_id;

  select count(*) into v_open_alerts
  from public.service_commitment_alerts where organization_id = v_org_id and status = 'open';

  insert into public.service_commitment_reports (
    organization_id, report_type, exported_at, metadata, generated_by
  )
  values (
    v_org_id,
    coalesce(nullif(trim(p_report_type), ''), 'commitment_compliance'),
    now(),
    jsonb_build_object(
      'active_commitments', coalesce(v_active, 0),
      'avg_compliance', coalesce(v_avg, 100),
      'open_alerts', coalesce(v_open_alerts, 0),
      'period', to_char(now(), 'YYYY-MM'),
      'executive_summary', public._slce_executive_summary_block(v_org_id)
    ),
    v_user_id
  )
  returning * into v_row;

  perform public._slce_log(
    v_org_id, 'slce_report_exported', 'service_commitment_report', v_row.id,
    jsonb_build_object('report_type', v_row.report_type)
  );

  return jsonb_build_object(
    'id', v_row.id,
    'report_type', v_row.report_type,
    'exported_at', v_row.exported_at,
    'metadata', v_row.metadata,
    'privacy_note', 'Metadata only — no PII'
  );
end; $$;

create or replace function public.get_executive_commitment_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('commitments.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Clear commitments, measurable compliance — humans define targets; Aipify tracks outcomes.',
    'summary', public._slce_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'customer_success', 'Links adoption and renewal context via A.26',
      'operations_center', 'Aligns with Operations Center Foundation (A.32)',
      'incident_response', 'Incident response commitments link to A.51 active incidents'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_service_level_commitment_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('commitments.view');
  v_org_id := public._mta_require_organization();
  perform public._slce_seed_commitments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Define what good looks like — track compliance transparently with human-reviewed commitments.',
    'principles', jsonb_build_array(
      'Clear commitments',
      'Measurable compliance',
      'Transparent alerts',
      'Executive visibility',
      'Audit accountability'
    ),
    'summary', jsonb_build_object(
      'active_commitments', coalesce((
        select count(*) from public.service_commitments
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'paused_commitments', coalesce((
        select count(*) from public.service_commitments
        where organization_id = v_org_id and status = 'paused'
      ), 0),
      'open_alerts', coalesce((
        select count(*) from public.service_commitment_alerts
        where organization_id = v_org_id and status = 'open'
      ), 0),
      'avg_compliance', coalesce((
        select round(avg(compliance_rate), 2) from public.service_commitment_performance
        where organization_id = v_org_id
      ), 100)
    ),
    'commitments', coalesce((
      select jsonb_agg(row_to_json(sc) order by sc.created_at desc)
      from public.service_commitments sc where sc.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'performance', coalesce((
      select jsonb_agg(row_to_json(sp) order by sp.created_at desc)
      from public.service_commitment_performance sp where sp.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'alerts', coalesce((
      select jsonb_agg(row_to_json(sa) order by sa.created_at desc)
      from public.service_commitment_alerts sa where sa.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'compliance_summary', public.get_commitment_compliance_summary(),
    'executive_summary', public._slce_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'customer_success', 'Extends Customer Success (A.26) with operational commitment context',
      'operations_center', 'Operations Center Foundation (A.32) event alignment',
      'incident_response', 'Incident Response Coordination (A.51) for response-time commitments',
      'organizational_memory', 'Performance reviews may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._slce_customer_success_summary(v_org_id),
      'operations', public._slce_operations_summary(v_org_id),
      'incidents', public._slce_incident_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_service_level_commitment_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._slce_seed_commitments(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Service commitments with measurable compliance and transparent alerting.',
    'active_commitments', coalesce((
      select count(*) from public.service_commitments
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_alerts', coalesce((
      select count(*) from public.service_commitment_alerts
      where organization_id = v_org_id and status = 'open'
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
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'slce_commitment_created', 'slce_commitment_updated', 'slce_commitment_paused',
    'slce_commitment_retired', 'slce_performance_recorded', 'slce_alert_created',
    'slce_alert_acknowledged', 'slce_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'service-level-commitment-engine', 'Service Level & Commitment Engine', 'Define service commitments, track compliance, surface breaches, and export executive summaries.', 'authenticated', 83
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'service-level-commitment-engine' and tenant_id is null);

grant execute on function public.create_service_commitment(text, text, numeric, text, text) to authenticated;
grant execute on function public.update_service_commitment(uuid, text, numeric, text, text) to authenticated;
grant execute on function public.pause_service_commitment(uuid) to authenticated;
grant execute on function public.retire_service_commitment(uuid) to authenticated;
grant execute on function public.record_commitment_performance(uuid, text, numeric, int, numeric, jsonb, boolean) to authenticated;
grant execute on function public.get_commitment_compliance_summary() to authenticated;
grant execute on function public.create_commitment_alert(uuid, text, jsonb) to authenticated;
grant execute on function public.acknowledge_commitment_alert(uuid) to authenticated;
grant execute on function public.export_service_commitment_report(text) to authenticated;
grant execute on function public.get_executive_commitment_summary() to authenticated;
grant execute on function public.get_service_level_commitment_engine_dashboard() to authenticated;
grant execute on function public.get_service_level_commitment_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._slce_seed_commitments(v_org_id);
  end loop;
end $$;
