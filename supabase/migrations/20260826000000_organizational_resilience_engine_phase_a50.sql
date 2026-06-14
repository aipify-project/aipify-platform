-- Phase A.50 — Organizational Resilience Engine
-- Extends Security & Trust (A.18), Operations Center Foundation (A.32), Executive Insights (A.35), Continuous Improvement (A.33).

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
    'organizational_resilience_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. resilience_plans
-- ---------------------------------------------------------------------------
create table if not exists public.resilience_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_name text not null,
  scenario_type text not null check (
    scenario_type in (
      'critical_employee_absence', 'support_backlog', 'supplier_disruption',
      'integration_failure', 'operational_incident', 'rapid_growth'
    )
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived')
  ),
  review_frequency text not null default 'quarterly' check (
    review_frequency in ('monthly', 'quarterly', 'semi_annual', 'annual')
  ),
  continuity_requirements jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resilience_plans_org_idx
  on public.resilience_plans (organization_id, status, scenario_type, created_at desc);

alter table public.resilience_plans enable row level security;
revoke all on public.resilience_plans from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. resilience_simulations
-- ---------------------------------------------------------------------------
create table if not exists public.resilience_simulations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid not null references public.resilience_plans (id) on delete cascade,
  simulation_type text not null check (
    simulation_type in ('tabletop', 'walkthrough', 'recovery_review', 'lessons_learned')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'cancelled')
  ),
  completed_at timestamptz,
  outcomes_metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resilience_simulations_plan_idx
  on public.resilience_simulations (plan_id, status, created_at desc);

alter table public.resilience_simulations enable row level security;
revoke all on public.resilience_simulations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. resilience_vulnerabilities
-- ---------------------------------------------------------------------------
create table if not exists public.resilience_vulnerabilities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'open' check (
    status in ('open', 'mitigating', 'resolved', 'accepted')
  ),
  linked_plan_id uuid references public.resilience_plans (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  resolved_by uuid references public.users (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resilience_vulnerabilities_org_idx
  on public.resilience_vulnerabilities (organization_id, status, severity, created_at desc);

alter table public.resilience_vulnerabilities enable row level security;
revoke all on public.resilience_vulnerabilities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. resilience_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.resilience_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_id uuid not null references public.resilience_plans (id) on delete cascade,
  review_date date not null default current_date,
  findings_metadata jsonb not null default '{}'::jsonb,
  reviewed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists resilience_reviews_plan_idx
  on public.resilience_reviews (plan_id, review_date desc);

alter table public.resilience_reviews enable row level security;
revoke all on public.resilience_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_resilience', v.description
from (values
  ('resilience.view', 'View Resilience', 'View resilience plans, simulations, and vulnerabilities'),
  ('resilience.manage', 'Manage Resilience', 'Create and update resilience plans and simulations'),
  ('resilience.review', 'Review Resilience', 'Complete plan reviews and record vulnerabilities'),
  ('resilience.approve', 'Approve Resilience', 'Approve resilience plans for activation')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'resilience.view'), ('owner', 'resilience.manage'), ('owner', 'resilience.review'), ('owner', 'resilience.approve'),
  ('administrator', 'resilience.view'), ('administrator', 'resilience.manage'), ('administrator', 'resilience.review'), ('administrator', 'resilience.approve'),
  ('manager', 'resilience.view'), ('manager', 'resilience.manage'), ('manager', 'resilience.review'),
  ('support_agent', 'resilience.view'),
  ('viewer', 'resilience.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ore_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ore_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'resilience_plan',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ore_security_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'available', true,
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = p_organization_id and status in ('open', 'mitigating')
        and severity in ('high', 'critical')
    ), 0),
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ore_operations_summary(p_organization_id uuid)
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

create or replace function public._ore_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'plans_under_review', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = p_organization_id and status = 'under_review'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = p_organization_id and status in ('open', 'mitigating')
    ), 0),
    'simulations_completed_90d', coalesce((
      select count(*) from public.resilience_simulations
      where organization_id = p_organization_id and status = 'completed'
        and completed_at >= now() - interval '90 days'
    ), 0)
  );
end; $$;

create or replace function public._ore_improvement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'continuous_improvement_items' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'open_improvements', coalesce((
      select count(*) from public.continuous_improvement_items
      where organization_id = p_organization_id and status in ('proposed', 'approved', 'in_progress')
    ), 0),
    'implemented_recent', coalesce((
      select count(*) from public.continuous_improvement_items
      where organization_id = p_organization_id and status = 'implemented'
        and updated_at >= now() - interval '90 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ore_memory_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_memory_records' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_records', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'lessons_learned', coalesce((
      select count(*) from public.organization_memory_records
      where organization_id = p_organization_id and category = 'lessons_learned' and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ore_capture_memory_hook(
  p_organization_id uuid,
  p_plan_id uuid,
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
    left(coalesce(p_summary, 'Resilience review completed'), 500),
    jsonb_build_object(
      'source', 'organizational_resilience_engine',
      'plan_id', p_plan_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._ore_seed_plans(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_plan_id uuid;
begin
  if exists (select 1 from public.resilience_plans where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.resilience_plans (
    organization_id, plan_name, scenario_type, status, review_frequency, continuity_requirements
  )
  values (
    p_organization_id,
    'Support backlog continuity plan',
    'support_backlog',
    'draft',
    'quarterly',
    jsonb_build_object(
      'critical_processes', jsonb_build_array('ticket_triage', 'customer_response', 'escalation_routing'),
      'roles', jsonb_build_array(
        jsonb_build_object('role', 'support_lead', 'backup', 'operations_manager'),
        jsonb_build_object('role', 'support_agent', 'backup', 'cross_trained_staff')
      ),
      'fallback_procedures', jsonb_build_array(
        'Activate overflow queue routing',
        'Prioritize critical severity tickets',
        'Notify stakeholders of extended response times'
      ),
      'escalation_contacts', jsonb_build_array(
        jsonb_build_object('team', 'operations', 'channel', 'command_center'),
        jsonb_build_object('team', 'management', 'channel', 'executive_briefing')
      ),
      'recovery_priorities', jsonb_build_array('restore_sla', 'clear_backlog', 'review_root_cause')
    )
  )
  returning id into v_plan_id;

  insert into public.resilience_vulnerabilities (
    organization_id, title, severity, status, linked_plan_id, metadata
  )
  values (
    p_organization_id,
    'Single-point dependency on primary support lead',
    'medium',
    'open',
    v_plan_id,
    '{"category": "role_coverage", "detected_by": "seed"}'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_resilience_plan(
  p_plan_name text,
  p_scenario_type text,
  p_continuity_requirements jsonb default '{}'::jsonb,
  p_owner_user_id uuid default null,
  p_review_frequency text default 'quarterly'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_plans; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_plan_name), '') = '' then raise exception 'Plan name required'; end if;

  insert into public.resilience_plans (
    organization_id, plan_name, scenario_type, owner_user_id, review_frequency, continuity_requirements, status
  )
  values (
    v_org_id, left(trim(p_plan_name), 200), p_scenario_type,
    coalesce(p_owner_user_id, v_user_id), coalesce(p_review_frequency, 'quarterly'),
    coalesce(p_continuity_requirements, '{}'::jsonb), 'draft'
  )
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'resilience_plan_created', 'resilience_plan', v_row.id,
    jsonb_build_object('plan_name', v_row.plan_name, 'scenario_type', v_row.scenario_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_resilience_plan_status(
  p_plan_id uuid,
  p_status text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_plans;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();

  update public.resilience_plans
  set status = p_status, updated_at = now()
  where id = p_plan_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Resilience plan not found'; end if;

  perform public._ore_log(
    v_org_id, 'resilience_plan_status_updated', 'resilience_plan', v_row.id,
    jsonb_build_object('status', p_status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.approve_resilience_plan(p_plan_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_plans;
begin
  perform public._irp_require_permission('resilience.approve');
  v_org_id := public._mta_require_organization();

  update public.resilience_plans
  set status = 'active', updated_at = now()
  where id = p_plan_id and organization_id = v_org_id and status in ('draft', 'under_review')
  returning * into v_row;

  if v_row.id is null then raise exception 'Resilience plan not found or not approvable'; end if;

  perform public._ore_log(
    v_org_id, 'resilience_plan_approved', 'resilience_plan', v_row.id,
    jsonb_build_object('plan_name', v_row.plan_name, 'scenario_type', v_row.scenario_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_resilience_simulation(
  p_plan_id uuid,
  p_simulation_type text,
  p_status text default 'completed',
  p_outcomes_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_simulations; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.resilience_plans where id = p_plan_id and organization_id = v_org_id
  ) then
    raise exception 'Resilience plan not found';
  end if;

  insert into public.resilience_simulations (
    organization_id, plan_id, simulation_type, status, completed_at,
    outcomes_metadata, recorded_by
  )
  values (
    v_org_id, p_plan_id, p_simulation_type, coalesce(p_status, 'completed'),
    case when coalesce(p_status, 'completed') = 'completed' then now() else null end,
    coalesce(p_outcomes_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'resilience_simulation_recorded', 'resilience_simulation', v_row.id,
    jsonb_build_object('plan_id', p_plan_id, 'simulation_type', p_simulation_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.complete_resilience_review(
  p_plan_id uuid,
  p_findings_metadata jsonb default '{}'::jsonb,
  p_review_date date default current_date,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.resilience_reviews;
  v_user_id uuid;
  v_memory jsonb;
  v_summary text;
begin
  perform public._irp_require_permission('resilience.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.resilience_plans where id = p_plan_id and organization_id = v_org_id
  ) then
    raise exception 'Resilience plan not found';
  end if;

  insert into public.resilience_reviews (
    organization_id, plan_id, review_date, findings_metadata, reviewed_by
  )
  values (
    v_org_id, p_plan_id, coalesce(p_review_date, current_date),
    coalesce(p_findings_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  update public.resilience_plans
  set status = 'under_review', updated_at = now()
  where id = p_plan_id and organization_id = v_org_id and status = 'active';

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_summary := coalesce(p_findings_metadata->>'summary', 'Resilience plan review completed');
    v_memory := public._ore_capture_memory_hook(v_org_id, p_plan_id, v_summary, p_findings_metadata);
  end if;

  perform public._ore_log(
    v_org_id, 'resilience_review_completed', 'resilience_review', v_row.id,
    jsonb_build_object('plan_id', p_plan_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('review', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.record_resilience_vulnerability(
  p_title text,
  p_severity text default 'medium',
  p_linked_plan_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_vulnerabilities; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_title), '') = '' then raise exception 'Title required'; end if;

  if p_linked_plan_id is not null and not exists (
    select 1 from public.resilience_plans where id = p_linked_plan_id and organization_id = v_org_id
  ) then
    raise exception 'Linked plan not found';
  end if;

  insert into public.resilience_vulnerabilities (
    organization_id, title, severity, linked_plan_id, metadata, recorded_by
  )
  values (
    v_org_id, left(trim(p_title), 200), coalesce(p_severity, 'medium'),
    p_linked_plan_id, coalesce(p_metadata, '{}'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._ore_log(
    v_org_id, 'resilience_vulnerability_recorded', 'resilience_vulnerability', v_row.id,
    jsonb_build_object('title', v_row.title, 'severity', v_row.severity)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.resolve_resilience_vulnerability(
  p_vulnerability_id uuid,
  p_status text default 'resolved'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.resilience_vulnerabilities; v_user_id uuid;
begin
  perform public._irp_require_permission('resilience.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.resilience_vulnerabilities
  set
    status = coalesce(p_status, 'resolved'),
    resolved_by = v_user_id,
    resolved_at = now(),
    updated_at = now()
  where id = p_vulnerability_id and organization_id = v_org_id
    and status in ('open', 'mitigating')
  returning * into v_row;

  if v_row.id is null then raise exception 'Vulnerability not found or already resolved'; end if;

  perform public._ore_log(
    v_org_id, 'resilience_vulnerability_resolved', 'resilience_vulnerability', v_row.id,
    jsonb_build_object('status', v_row.status, 'title', v_row.title)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_resilience_executive_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Preparedness and continuity — role clarity, structured recovery, continuous learning.',
    'summary', public._ore_executive_summary_block(v_org_id),
    'high_severity_open', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
        and severity in ('high', 'critical')
    ), 0),
    'plans_needing_review', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status in ('draft', 'under_review')
    ), 0),
    'integration_notes', jsonb_build_object(
      'executive_insights', 'Feeds executive visibility via A.35 reporting scaffolds',
      'continuous_improvement', 'Review findings may link to improvement items — metadata only'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_resilience_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('resilience.view');
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Preparedness and operational continuity — humans approve, Aipify structures recovery.',
    'principles', jsonb_build_array(
      'Preparedness',
      'Operational continuity',
      'Role clarity',
      'Structured recovery',
      'Continuous learning',
      'Audit accountability'
    ),
    'summary', jsonb_build_object(
      'total_plans', coalesce((
        select count(*) from public.resilience_plans where organization_id = v_org_id
      ), 0),
      'active_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'draft_plans', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'draft'
      ), 0),
      'open_vulnerabilities', coalesce((
        select count(*) from public.resilience_vulnerabilities
        where organization_id = v_org_id and status in ('open', 'mitigating')
      ), 0),
      'completed_simulations', coalesce((
        select count(*) from public.resilience_simulations
        where organization_id = v_org_id and status = 'completed'
      ), 0),
      'pending_reviews', coalesce((
        select count(*) from public.resilience_plans
        where organization_id = v_org_id and status = 'under_review'
      ), 0)
    ),
    'plans', coalesce((
      select jsonb_agg(row_to_json(rp) order by rp.created_at desc)
      from public.resilience_plans rp where rp.organization_id = v_org_id
    ), '[]'::jsonb),
    'simulations', coalesce((
      select jsonb_agg(row_to_json(rs) order by rs.created_at desc)
      from public.resilience_simulations rs where rs.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vulnerabilities', coalesce((
      select jsonb_agg(row_to_json(rv) order by rv.created_at desc)
      from public.resilience_vulnerabilities rv where rv.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(rr) order by rr.review_date desc)
      from public.resilience_reviews rr where rr.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ore_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'security_trust', 'Extends Security & Trust (A.18) with vulnerability tracking',
      'operations_center', 'Aligns with Operations Center Foundation (A.32) event context',
      'executive_insights', 'Executive summary via get_resilience_executive_summary() — A.35',
      'organizational_memory', 'Review completion may capture lessons learned — metadata only (A.34)',
      'continuous_improvement', 'Findings scaffold improvement workflow (A.33)'
    ),
    'integration_summaries', jsonb_build_object(
      'security', public._ore_security_summary(v_org_id),
      'operations', public._ore_operations_summary(v_org_id),
      'memory', public._ore_memory_summary(v_org_id),
      'improvement', public._ore_improvement_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_resilience_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._ore_seed_plans(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Operational continuity with structured recovery and audit accountability.',
    'active_plans', coalesce((
      select count(*) from public.resilience_plans
      where organization_id = v_org_id and status = 'active'
    ), 0),
    'open_vulnerabilities', coalesce((
      select count(*) from public.resilience_vulnerabilities
      where organization_id = v_org_id and status in ('open', 'mitigating')
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
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-resilience-engine', 'Organizational Resilience Engine', 'Preparedness, continuity plans, simulations, and structured recovery with audit accountability.', 'authenticated', 81
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-resilience-engine' and tenant_id is null);

grant execute on function public.create_resilience_plan(text, text, jsonb, uuid, text) to authenticated;
grant execute on function public.update_resilience_plan_status(uuid, text) to authenticated;
grant execute on function public.approve_resilience_plan(uuid) to authenticated;
grant execute on function public.record_resilience_simulation(uuid, text, text, jsonb) to authenticated;
grant execute on function public.complete_resilience_review(uuid, jsonb, date, boolean) to authenticated;
grant execute on function public.record_resilience_vulnerability(text, text, uuid, jsonb) to authenticated;
grant execute on function public.resolve_resilience_vulnerability(uuid, text) to authenticated;
grant execute on function public.get_resilience_executive_summary() to authenticated;
grant execute on function public.get_organizational_resilience_engine_dashboard() to authenticated;
grant execute on function public.get_organizational_resilience_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ore_seed_plans(v_org_id);
  end loop;
end $$;
