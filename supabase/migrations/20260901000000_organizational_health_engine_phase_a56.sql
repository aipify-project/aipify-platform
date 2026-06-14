-- Phase A.56 — Organizational Health Engine
-- Extends Customer Success (A.26), Executive Insights (A.35), Value Realization (A.48), Strategic Alignment (A.55).

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
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organizational_health_scores
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_health_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_category text not null check (
    health_category in (
      'operational', 'support', 'adoption', 'learning_readiness',
      'change_readiness', 'strategic_alignment'
    )
  ),
  health_score numeric not null default 75 check (health_score >= 0 and health_score <= 100),
  health_status text not null default 'stable' check (
    health_status in ('healthy', 'stable', 'attention_required', 'critical')
  ),
  measured_at timestamptz not null default now(),
  indicators jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, health_category)
);

create index if not exists organizational_health_scores_org_idx
  on public.organizational_health_scores (organization_id, health_status, measured_at desc);

alter table public.organizational_health_scores enable row level security;
revoke all on public.organizational_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organizational_health_interventions
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_health_interventions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category text not null check (
    category in (
      'operational', 'support', 'adoption', 'learning_readiness',
      'change_readiness', 'strategic_alignment'
    )
  ),
  recommendation text not null,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'dismissed', 'implemented')
  ),
  approved_at timestamptz,
  approved_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_interventions_org_idx
  on public.organizational_health_interventions (organization_id, status, category, created_at desc);

alter table public.organizational_health_interventions enable row level security;
revoke all on public.organizational_health_interventions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organizational_health_reports
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_health_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null default 'health_summary',
  exported_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organizational_health_reports_org_idx
  on public.organizational_health_reports (organization_id, report_type, created_at desc);

alter table public.organizational_health_reports enable row level security;
revoke all on public.organizational_health_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organizational_health_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_health_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizational_health_settings enable row level security;
revoke all on public.organizational_health_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — health.* (no conflict with existing PERMISSION_KEYS)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_health', v.description
from (values
  ('health.view', 'View Health', 'View organizational health scores, interventions, and summaries'),
  ('health.manage', 'Manage Health', 'Measure health, refresh categories, and override scores'),
  ('health.review', 'Review Health', 'Approve health interventions and generate recommendations'),
  ('health.export', 'Export Health', 'Export organizational health reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'health.view'), ('owner', 'health.manage'), ('owner', 'health.review'), ('owner', 'health.export'),
  ('administrator', 'health.view'), ('administrator', 'health.manage'), ('administrator', 'health.review'), ('administrator', 'health.export'),
  ('manager', 'health.view'), ('manager', 'health.manage'), ('manager', 'health.review'), ('manager', 'health.export'),
  ('support_agent', 'health.view'), ('support_agent', 'health.review'),
  ('viewer', 'health.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ohe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ohe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organizational_health_score',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ohe_status_from_score(p_score numeric)
returns text language sql immutable as $$
  select case
    when coalesce(p_score, 0) >= 80 then 'healthy'
    when coalesce(p_score, 0) >= 60 then 'stable'
    when coalesce(p_score, 0) >= 40 then 'attention_required'
    else 'critical'
  end;
$$;

create or replace function public._ohe_customer_success_summary(p_organization_id uuid)
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

create or replace function public._ohe_executive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'executive_insight_reports' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'recent_reports', coalesce((
      select count(*) from public.executive_insight_reports
      where organization_id = p_organization_id and generated_at >= now() - interval '30 days'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ohe_value_realization_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_value_metrics' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'tracked_metrics', coalesce((
      select count(*) from public.organization_value_metrics where organization_id = p_organization_id
    ), 0),
    'positive_improvements', coalesce((
      select count(*) from public.organization_value_metrics
      where organization_id = p_organization_id and improvement_percentage > 0
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ohe_strategic_alignment_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_objectives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'misaligned_count', coalesce((
      select jsonb_array_length(s.misaligned_initiatives)
      from public.strategic_alignment_snapshots s
      where s.organization_id = p_organization_id
      order by s.created_at desc limit 1
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ohe_support_backlog_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_open int := 0; v_escalated int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'organization_support_cases' and schemaname = 'public') then
    select count(*) into v_open
    from public.organization_support_cases
    where organization_id = p_organization_id and status in ('open', 'pending', 'in_progress');

    select count(*) into v_escalated
    from public.organization_support_cases
    where organization_id = p_organization_id and status in ('open', 'pending', 'in_progress', 'escalated')
      and priority in ('high', 'critical');
  end if;

  return jsonb_build_object(
    'open_cases', v_open,
    'escalated_cases', v_escalated,
    'backlog_pressure', case
      when v_open = 0 then 'low'
      when v_open <= 5 then 'moderate'
      when v_open <= 15 then 'elevated'
      else 'high'
    end
  );
exception when others then
  return jsonb_build_object('open_cases', 0, 'escalated_cases', 0, 'backlog_pressure', 'unknown');
end; $$;

create or replace function public._ohe_workflow_adoption_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_active int := 0; v_executions int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
    select count(*) into v_active
    from public.organization_workflows
    where organization_id = p_organization_id and status = 'active';
  end if;

  if exists (select 1 from pg_tables where tablename = 'workflow_executions' and schemaname = 'public') then
    select count(*) into v_executions
    from public.workflow_executions
    where organization_id = p_organization_id and created_at >= now() - interval '30 days';
  end if;

  return jsonb_build_object(
    'active_workflows', v_active,
    'recent_executions', v_executions,
    'adoption_signal', case
      when v_active = 0 then 'none'
      when v_executions >= v_active * 2 then 'strong'
      when v_executions > 0 then 'moderate'
      else 'low'
    end
  );
exception when others then
  return jsonb_build_object('active_workflows', 0, 'recent_executions', 0, 'adoption_signal', 'unknown');
end; $$;

create or replace function public._ohe_training_completion_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_total int := 0; v_completed int := 0; v_rate numeric := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'user_learning_progress' and schemaname = 'public') then
    select count(*), count(*) filter (where status = 'completed')
    into v_total, v_completed
    from public.user_learning_progress
    where organization_id = p_organization_id;
  end if;

  if v_total > 0 then v_rate := round((v_completed::numeric / v_total::numeric) * 100, 1); end if;

  return jsonb_build_object(
    'assignments_total', v_total,
    'assignments_completed', v_completed,
    'completion_rate', v_rate
  );
exception when others then
  return jsonb_build_object('assignments_total', 0, 'assignments_completed', 0, 'completion_rate', 0);
end; $$;

create or replace function public._ohe_incidents_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_open int := 0; v_critical int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'incident_records' and schemaname = 'public') then
    select count(*) into v_open
    from public.incident_records
    where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated');

    select count(*) into v_critical
    from public.incident_records
    where organization_id = p_organization_id and status in ('identified', 'investigating', 'mitigated')
      and severity = 'critical';
  end if;

  return jsonb_build_object('open_incidents', v_open, 'critical_open', v_critical);
exception when others then
  return jsonb_build_object('open_incidents', 0, 'critical_open', 0);
end; $$;

create or replace function public._ohe_improvements_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_active int := 0; v_implemented int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'improvement_initiatives' and schemaname = 'public') then
    select count(*) filter (where status in ('planned', 'active')),
           count(*) filter (where status = 'implemented')
    into v_active, v_implemented
    from public.improvement_initiatives
    where organization_id = p_organization_id;
  elsif exists (select 1 from pg_tables where tablename = 'improvement_items' and schemaname = 'public') then
    select count(*) filter (where status in ('proposed', 'approved', 'in_progress')),
           count(*) filter (where status = 'implemented')
    into v_active, v_implemented
    from public.improvement_items
    where organization_id = p_organization_id;
  end if;

  return jsonb_build_object('active_initiatives', v_active, 'implemented_initiatives', v_implemented);
exception when others then
  return jsonb_build_object('active_initiatives', 0, 'implemented_initiatives', 0);
end; $$;

create or replace function public._ohe_change_readiness_indicators(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_active int := 0; v_completed int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'change_initiatives' and schemaname = 'public') then
    select count(*) filter (where status in ('planned', 'in_progress')),
           count(*) filter (where status = 'completed')
    into v_active, v_completed
    from public.change_initiatives
    where organization_id = p_organization_id;
  end if;

  return jsonb_build_object('active_changes', v_active, 'completed_changes', v_completed);
exception when others then
  return jsonb_build_object('active_changes', 0, 'completed_changes', 0);
end; $$;

create or replace function public._ohe_compute_category_score(
  p_organization_id uuid,
  p_category text
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_score numeric := 75;
  v_indicators jsonb := '{}'::jsonb;
  v_support jsonb;
  v_workflow jsonb;
  v_training jsonb;
  v_incidents jsonb;
  v_improvements jsonb;
  v_change jsonb;
  v_strategic jsonb;
begin
  v_support := public._ohe_support_backlog_indicators(p_organization_id);
  v_workflow := public._ohe_workflow_adoption_indicators(p_organization_id);
  v_training := public._ohe_training_completion_indicators(p_organization_id);
  v_incidents := public._ohe_incidents_indicators(p_organization_id);
  v_improvements := public._ohe_improvements_indicators(p_organization_id);
  v_change := public._ohe_change_readiness_indicators(p_organization_id);
  v_strategic := public._ohe_strategic_alignment_summary(p_organization_id);

  if p_category = 'operational' then
    v_indicators := jsonb_build_object(
      'incidents', v_incidents,
      'workflows', v_workflow,
      'improvements', v_improvements
    );
    v_score := 85
      - coalesce((v_incidents->>'open_incidents')::numeric, 0) * 3
      - coalesce((v_incidents->>'critical_open')::numeric, 0) * 5
      + least(coalesce((v_workflow->>'recent_executions')::numeric, 0), 10);
  elsif p_category = 'support' then
    v_indicators := jsonb_build_object('support_backlog', v_support);
    v_score := 90
      - coalesce((v_support->>'open_cases')::numeric, 0) * 2
      - coalesce((v_support->>'escalated_cases')::numeric, 0) * 4;
  elsif p_category = 'adoption' then
    v_indicators := jsonb_build_object('workflows', v_workflow, 'improvements', v_improvements);
    v_score := 70
      + coalesce((v_workflow->>'active_workflows')::numeric, 0) * 3
      + coalesce((v_improvements->>'implemented_initiatives')::numeric, 0) * 2;
  elsif p_category = 'learning_readiness' then
    v_indicators := jsonb_build_object('training', v_training);
    v_score := coalesce((v_training->>'completion_rate')::numeric, 50);
  elsif p_category = 'change_readiness' then
    v_indicators := jsonb_build_object('change', v_change);
    v_score := 65
      + coalesce((v_change->>'completed_changes')::numeric, 0) * 4
      - coalesce((v_change->>'active_changes')::numeric, 0) * 2;
  elsif p_category = 'strategic_alignment' then
    v_indicators := jsonb_build_object('strategic', v_strategic);
    v_score := 80
      + coalesce((v_strategic->>'active_objectives')::numeric, 0) * 2
      - coalesce((v_strategic->>'misaligned_count')::numeric, 0) * 5;
  end if;

  v_score := greatest(0, least(100, round(v_score, 1)));

  return jsonb_build_object(
    'health_score', v_score,
    'health_status', public._ohe_status_from_score(v_score),
    'indicators', v_indicators
  );
end; $$;

create or replace function public._ohe_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_overall numeric;
begin
  select round(avg(health_score), 1) into v_overall
  from public.organizational_health_scores
  where organization_id = p_organization_id;

  return jsonb_build_object(
    'categories_measured', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = p_organization_id
    ), 0),
    'overall_score', coalesce(v_overall, 75),
    'overall_status', public._ohe_status_from_score(coalesce(v_overall, 75)),
    'healthy_categories', coalesce((
      select count(*) from public.organizational_health_scores
      where organization_id = p_organization_id and health_status = 'healthy'
    ), 0),
    'attention_required_categories', coalesce((
      select count(*) from public.organizational_health_scores
      where organization_id = p_organization_id and health_status in ('attention_required', 'critical')
    ), 0),
    'pending_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'approved_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = p_organization_id and status = 'approved'
    ), 0)
  );
end; $$;

create or replace function public._ohe_capture_memory_hook(
  p_organization_id uuid,
  p_intervention_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'health_intervention',
    left(coalesce(p_summary, 'Health intervention captured'), 500),
    jsonb_build_object(
      'source', 'organizational_health_engine',
      'intervention_id', p_intervention_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._ohe_seed_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_health_settings (organization_id, config)
  values (
    p_organization_id,
    jsonb_build_object(
      'auto_measure_on_dashboard', true,
      'recommendation_threshold', 60,
      'categories', jsonb_build_array(
        'operational', 'support', 'adoption', 'learning_readiness', 'change_readiness', 'strategic_alignment'
      )
    )
  )
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ohe_upsert_category_score(
  p_organization_id uuid,
  p_health_category text,
  p_audit boolean default false
)
returns public.organizational_health_scores language plpgsql security definer set search_path = public as $$
declare
  v_computed jsonb;
  v_row public.organizational_health_scores;
begin
  v_computed := public._ohe_compute_category_score(p_organization_id, p_health_category);

  insert into public.organizational_health_scores (
    organization_id, health_category, health_score, health_status, measured_at, indicators
  )
  values (
    p_organization_id, p_health_category,
    (v_computed->>'health_score')::numeric,
    v_computed->>'health_status',
    now(),
    coalesce(v_computed->'indicators', '{}'::jsonb)
  )
  on conflict (organization_id, health_category) do update
  set
    health_score = excluded.health_score,
    health_status = excluded.health_status,
    measured_at = excluded.measured_at,
    indicators = excluded.indicators,
    updated_at = now()
  returning * into v_row;

  if coalesce(p_audit, false) then
    perform public._ohe_log(
      p_organization_id, 'ohe_category_refreshed', 'organizational_health_score', v_row.id,
      jsonb_build_object('category', p_health_category, 'score', v_row.health_score)
    );
  end if;

  return v_row;
end; $$;

create or replace function public._ohe_seed_scores(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_cat text;
begin
  foreach v_cat in array array[
    'operational', 'support', 'adoption', 'learning_readiness', 'change_readiness', 'strategic_alignment'
  ] loop
    if not exists (
      select 1 from public.organizational_health_scores
      where organization_id = p_organization_id and health_category = v_cat
    ) then
      perform public._ohe_upsert_category_score(p_organization_id, v_cat, false);
    end if;
  end loop;
exception when others then
  null;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.refresh_health_category(p_health_category text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organizational_health_scores;
begin
  perform public._irp_require_permission('health.manage');
  v_org_id := public._mta_require_organization();

  v_row := public._ohe_upsert_category_score(v_org_id, p_health_category, true);

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.measure_organizational_health(p_categories text[] default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_cat text;
  v_results jsonb := '[]'::jsonb;
  v_cats text[] := coalesce(
    p_categories,
    array['operational', 'support', 'adoption', 'learning_readiness', 'change_readiness', 'strategic_alignment']
  );
begin
  perform public._irp_require_permission('health.manage');
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);

  foreach v_cat in array v_cats loop
    v_results := v_results || jsonb_build_array(
      row_to_json(public._ohe_upsert_category_score(v_org_id, v_cat, true))::jsonb
    );
  end loop;

  perform public._ohe_log(
    v_org_id, 'ohe_health_measured', 'organizational_health_score', null,
    jsonb_build_object('categories', v_cats, 'count', jsonb_array_length(v_results))
  );

  return jsonb_build_object(
    'has_organization', true,
    'measured_at', now(),
    'scores', v_results,
    'summary', public._ohe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.override_health_score(
  p_health_category text,
  p_health_score numeric,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.organizational_health_scores;
begin
  perform public._irp_require_permission('health.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_health_score < 0 or p_health_score > 100 then
    raise exception 'Health score must be between 0 and 100';
  end if;

  insert into public.organizational_health_scores (
    organization_id, health_category, health_score, health_status, measured_at, indicators
  )
  values (
    v_org_id, p_health_category, p_health_score,
    public._ohe_status_from_score(p_health_score), now(),
    jsonb_build_object('override', true, 'reason', left(coalesce(p_reason, 'Manual override'), 500), 'overridden_by', v_user_id)
  )
  on conflict (organization_id, health_category) do update
  set
    health_score = excluded.health_score,
    health_status = excluded.health_status,
    measured_at = excluded.measured_at,
    indicators = excluded.indicators,
    updated_at = now()
  returning * into v_row;

  perform public._ohe_log(
    v_org_id, 'ohe_score_overridden', 'organizational_health_score', v_row.id,
    jsonb_build_object('category', p_health_category, 'score', p_health_score, 'reason', p_reason, 'overridden_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_health_recommendations(p_category text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_score_row public.organizational_health_scores;
  v_created jsonb := '[]'::jsonb;
  v_row public.organizational_health_interventions;
  v_threshold numeric := 60;
  v_rec text;
begin
  perform public._irp_require_permission('health.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select (config->>'recommendation_threshold')::numeric into v_threshold
  from public.organizational_health_settings where organization_id = v_org_id;
  v_threshold := coalesce(v_threshold, 60);

  for v_score_row in
    select * from public.organizational_health_scores
    where organization_id = v_org_id
      and health_score < v_threshold
      and (p_category is null or health_category = p_category)
  loop
    v_rec := case v_score_row.health_category
      when 'operational' then 'Review open incidents and workflow execution cadence to stabilize operations.'
      when 'support' then 'Address support backlog pressure — consider staffing review or escalation policy refresh.'
      when 'adoption' then 'Increase workflow adoption through training and improvement initiative follow-through.'
      when 'learning_readiness' then 'Assign and complete learning paths to raise training completion rate.'
      when 'change_readiness' then 'Complete active change milestones and communicate adoption expectations.'
      when 'strategic_alignment' then 'Link strategic objectives to operational entities and conduct alignment review.'
      else 'Review organizational health indicators and plan corrective action.'
    end;

    if not exists (
      select 1 from public.organizational_health_interventions
      where organization_id = v_org_id
        and category = v_score_row.health_category
        and status = 'pending'
        and recommendation = v_rec
    ) then
      insert into public.organizational_health_interventions (
        organization_id, category, recommendation, status, metadata, created_by
      )
      values (
        v_org_id, v_score_row.health_category, v_rec, 'pending',
        jsonb_build_object('source_score', v_score_row.health_score, 'generated_at', now()),
        v_user_id
      )
      returning * into v_row;

      v_created := v_created || jsonb_build_array(row_to_json(v_row)::jsonb);
    end if;
  end loop;

  perform public._ohe_log(
    v_org_id, 'ohe_recommendations_generated', 'organizational_health_intervention', null,
    jsonb_build_object('created_count', jsonb_array_length(v_created), 'category', p_category)
  );

  return jsonb_build_object('interventions', v_created, 'created_count', jsonb_array_length(v_created));
end; $$;

create or replace function public.approve_health_intervention(
  p_intervention_id uuid,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organizational_health_interventions;
  v_memory jsonb;
begin
  perform public._irp_require_permission('health.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organizational_health_interventions
  set status = 'approved', approved_at = now(), approved_by = v_user_id, updated_at = now()
  where id = p_intervention_id and organization_id = v_org_id and status = 'pending'
  returning * into v_row;

  if v_row.id is null then raise exception 'Intervention not found or not pending'; end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._ohe_capture_memory_hook(
      v_org_id, v_row.id, v_row.recommendation, v_row.metadata
    );
    update public.organizational_health_interventions
    set metadata = metadata || jsonb_build_object('memory_hook', v_memory)
    where id = v_row.id;
  end if;

  perform public._ohe_log(
    v_org_id, 'ohe_intervention_approved', 'organizational_health_intervention', v_row.id,
    jsonb_build_object('category', v_row.category, 'memory_hook', v_memory)
  );

  return jsonb_build_object('intervention', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.export_organizational_health_report(p_report_type text default 'health_summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_report_id uuid;
  v_scores jsonb;
  v_interventions jsonb;
begin
  perform public._irp_require_permission('health.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select coalesce(jsonb_agg(row_to_json(s) order by s.health_category), '[]'::jsonb) into v_scores
  from public.organizational_health_scores s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(row_to_json(i) order by i.created_at desc), '[]'::jsonb) into v_interventions
  from public.organizational_health_interventions i
  where i.organization_id = v_org_id limit 30;

  insert into public.organizational_health_reports (
    organization_id, report_type, exported_at, metadata, generated_by
  )
  values (
    v_org_id, coalesce(p_report_type, 'health_summary'), now(),
    jsonb_build_object('summary', public._ohe_executive_summary_block(v_org_id)),
    v_user_id
  )
  returning id into v_report_id;

  perform public._ohe_log(
    v_org_id, 'ohe_health_report_exported', 'organizational_health_report', v_report_id,
    jsonb_build_object('report_type', p_report_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'report_type', coalesce(p_report_type, 'health_summary'),
    'report_id', v_report_id,
    'scores', coalesce(v_scores, '[]'::jsonb),
    'interventions', coalesce(v_interventions, '[]'::jsonb),
    'summary', public._ohe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.get_executive_health_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('health.view');
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational health — metadata indicators; humans approve interventions.',
    'summary', public._ohe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'customer_success', 'Customer Success health context (A.26)',
      'executive_insights', 'Executive reporting alignment (A.35)',
      'value_realization', 'Value metric trends (A.48)',
      'strategic_alignment', 'Strategic objective alignment (A.55)',
      'observability', 'Distinct from Observability Platform Health (A.21)'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_health_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('health.view');
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);
  perform public._ohe_seed_scores(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify measures organizational readiness. Humans approve interventions and decide action.',
    'principles', jsonb_build_array(
      'Metadata-only health indicators',
      'Category scores across six domains',
      'Human-approved interventions',
      'Executive health summaries',
      'No PII in health aggregation'
    ),
    'summary', public._ohe_executive_summary_block(v_org_id),
    'scores', coalesce((
      select jsonb_agg(row_to_json(s) order by s.health_category)
      from public.organizational_health_scores s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'interventions', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.organizational_health_interventions i
      where i.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._ohe_executive_summary_block(v_org_id),
    'settings', coalesce((
      select config from public.organizational_health_settings where organization_id = v_org_id
    ), '{}'::jsonb),
    'integration_notes', jsonb_build_object(
      'observability', 'Distinct from Observability Platform Health — nav id organizationalHealthEngine',
      'customer_success', 'Customer Success context via get_executive_health_summary() — A.26',
      'executive_insights', 'Executive Insights reporting — A.35',
      'value_realization', 'Value Realization metric trends — A.48',
      'strategic_alignment', 'Strategic Alignment objective signals — A.55',
      'organizational_memory', 'Interventions may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'customer_success', public._ohe_customer_success_summary(v_org_id),
      'executive_insights', public._ohe_executive_insights_summary(v_org_id),
      'value_realization', public._ohe_value_realization_summary(v_org_id),
      'strategic_alignment', public._ohe_strategic_alignment_summary(v_org_id),
      'support_backlog', public._ohe_support_backlog_indicators(v_org_id),
      'workflow_adoption', public._ohe_workflow_adoption_indicators(v_org_id),
      'training_completion', public._ohe_training_completion_indicators(v_org_id),
      'incidents', public._ohe_incidents_indicators(v_org_id),
      'improvements', public._ohe_improvements_indicators(v_org_id),
      'change_readiness', public._ohe_change_readiness_indicators(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_health_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_overall numeric;
begin
  v_org_id := public._mta_require_organization();
  perform public._ohe_seed_settings(v_org_id);

  select round(avg(health_score), 1) into v_overall
  from public.organizational_health_scores where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational health — readiness across support, adoption, learning, and strategy.',
    'overall_score', coalesce(v_overall, 75),
    'overall_status', public._ohe_status_from_score(coalesce(v_overall, 75)),
    'categories_measured', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = v_org_id
    ), 0),
    'pending_interventions', coalesce((
      select count(*) from public.organizational_health_interventions
      where organization_id = v_org_id and status = 'pending'
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
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-health-engine', 'Organizational Health Engine', 'Organizational health scores, interventions, and executive health summaries across support, adoption, learning, change, and strategic alignment.', 'authenticated', 87
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-health-engine' and tenant_id is null);

grant execute on function public.refresh_health_category(text) to authenticated;
grant execute on function public.measure_organizational_health(text[]) to authenticated;
grant execute on function public.override_health_score(text, numeric, text) to authenticated;
grant execute on function public.generate_health_recommendations(text) to authenticated;
grant execute on function public.approve_health_intervention(uuid, boolean) to authenticated;
grant execute on function public.export_organizational_health_report(text) to authenticated;
grant execute on function public.get_executive_health_summary() to authenticated;
grant execute on function public.get_organizational_health_engine_dashboard() to authenticated;
grant execute on function public.get_organizational_health_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ohe_seed_settings(v_org_id);
  end loop;
end $$;
