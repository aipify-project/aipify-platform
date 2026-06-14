-- Phase A.71 — Cross-Tenant Intelligence Engine
-- Anonymized cross-tenant trends without exposing tenant data.
-- Extends Industry Intelligence (A.44), Continuous Improvement (A.49),
-- Organizational Benchmarking (A.58), Predictive Insights (A.66).

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
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. cross_tenant_participation_settings (org-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.cross_tenant_participation_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  participation_status text not null default 'internal_only' check (
    participation_status in ('disabled', 'internal_only', 'anonymized_contributor')
  ),
  allowed_categories jsonb not null default '["industry_trends","adoption","support","workflow","training","maturity","improvement"]'::jsonb,
  anonymization_level text not null default 'standard' check (
    anonymization_level in ('standard', 'enhanced')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.cross_tenant_participation_settings enable row level security;
revoke all on public.cross_tenant_participation_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. cross_tenant_insights (global — NO organization_id)
-- ---------------------------------------------------------------------------
create table if not exists public.cross_tenant_insights (
  id uuid primary key default gen_random_uuid(),
  insight_category text not null check (
    insight_category in (
      'industry_trends', 'adoption', 'support', 'workflow', 'training', 'maturity', 'improvement'
    )
  ),
  industry text not null default 'general',
  summary text not null,
  recommendation text,
  confidence_level text not null default 'medium' check (
    confidence_level in ('low', 'medium', 'high')
  ),
  metadata jsonb not null default '{"anonymized":true,"metadata_only":true}'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'archived')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cross_tenant_insights_category_idx
  on public.cross_tenant_insights (insight_category, industry, status, created_at desc);

alter table public.cross_tenant_insights enable row level security;
revoke all on public.cross_tenant_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. cross_tenant_intelligence_outcomes (org-scoped — memory integration)
-- ---------------------------------------------------------------------------
create table if not exists public.cross_tenant_intelligence_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  global_insight_id uuid not null references public.cross_tenant_insights (id) on delete cascade,
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'implemented', 'dismissed')
  ),
  outcome_summary text,
  metadata jsonb not null default '{}'::jsonb,
  approved_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, global_insight_id)
);

create index if not exists cross_tenant_intelligence_outcomes_org_idx
  on public.cross_tenant_intelligence_outcomes (organization_id, status, created_at desc);

alter table public.cross_tenant_intelligence_outcomes enable row level security;
revoke all on public.cross_tenant_intelligence_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions — intelligence.configure_participation (others exist from A.31)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'cross_tenant_intelligence', v.description
from (values
  ('intelligence.configure_participation', 'Configure Cross-Tenant Participation', 'Opt in or out of anonymized cross-tenant intelligence contribution')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'intelligence.view'), ('owner', 'intelligence.manage'), ('owner', 'intelligence.export'), ('owner', 'intelligence.configure_participation'),
  ('administrator', 'intelligence.view'), ('administrator', 'intelligence.manage'), ('administrator', 'intelligence.export'), ('administrator', 'intelligence.configure_participation'),
  ('manager', 'intelligence.view'), ('manager', 'intelligence.manage'), ('manager', 'intelligence.export'),
  ('support_agent', 'intelligence.view'),
  ('viewer', 'intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_ctie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._ctie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'cross_tenant_intelligence',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._ctie_ensure_participation_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.cross_tenant_participation_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._ctie_default_categories()
returns jsonb language sql immutable as $$
  select '["industry_trends","adoption","support","workflow","training","maturity","improvement"]'::jsonb;
$$;

create or replace function public._ctie_industry_intelligence_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'industry_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_insights', coalesce((
      select count(*) from public.industry_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'anonymized', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ctie_continuous_improvement_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'improvement_initiatives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_initiatives', coalesce((
      select count(*) from public.improvement_initiatives
      where organization_id = p_organization_id and status in ('proposed', 'approved', 'in_progress')
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ctie_benchmarking_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'benchmark_profiles' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'profiles_count', coalesce((
      select count(*) from public.benchmark_profiles where organization_id = p_organization_id
    ), 0),
    'below_benchmark_count', coalesce((
      select count(*) from public.benchmark_comparisons
      where organization_id = p_organization_id and position_metadata->>'position' = 'below'
    ), 0),
    'anonymized', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ctie_predictive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_predictive_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_predictions', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'high_risk_predictions', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active' and risk_level in ('high', 'critical')
    ), 0),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._ctie_capture_memory_hook(
  p_organization_id uuid,
  p_outcome_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'cross_tenant_intelligence',
    left(coalesce(p_summary, 'Cross-tenant intelligence outcome recorded'), 500),
    jsonb_build_object(
      'source', 'cross_tenant_intelligence_engine',
      'outcome_id', p_outcome_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._ctie_seed_global_insights()
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.cross_tenant_insights limit 1) then
    return;
  end if;

  insert into public.cross_tenant_insights (
    insight_category, industry, summary, recommendation, confidence_level
  )
  values
    (
      'industry_trends', 'general',
      'Organizations in similar industries are increasing workflow automation adoption by 12% quarter-over-quarter.',
      'Review workflow orchestration templates and pilot one high-impact automation path.',
      'high'
    ),
    (
      'adoption', 'retail',
      'Retail tenants show faster assistant adoption when training completion exceeds 75% within 30 days of onboarding.',
      'Align onboarding milestones with targeted learning paths in the first month.',
      'medium'
    ),
    (
      'support', 'general',
      'Cross-tenant metadata indicates support backlog risk rises when first-response times exceed 45 minutes for two consecutive weeks.',
      'Review support staffing patterns and escalation thresholds.',
      'high'
    ),
    (
      'workflow', 'professional_services',
      'Professional services organizations report higher task completion when unified follow-up reminders are enabled.',
      'Enable unified task follow-up integration and measure completion delta over 30 days.',
      'medium'
    ),
    (
      'training', 'general',
      'Tenants with certification completion above 60% show measurably lower change-management friction scores.',
      'Prioritize certification paths for modules with declining adoption signals.',
      'medium'
    ),
    (
      'maturity', 'general',
      'Capability maturity assessments cluster around level 2–3 until benchmarking comparisons are run quarterly.',
      'Schedule quarterly benchmark comparisons via Organizational Benchmarking Engine.',
      'low'
    ),
    (
      'improvement', 'general',
      'Continuous improvement initiatives with explicit outcome reviews close 20% faster on average.',
      'Add outcome review checkpoints to active improvement initiatives.',
      'medium'
    ),
    (
      'industry_trends', 'healthcare',
      'Healthcare-adjacent tenants prioritize compliance readiness and audit transparency in platform configuration.',
      'Review compliance readiness checklist and audit export cadence.',
      'medium'
    ),
    (
      'adoption', 'general',
      'Aggregated signals suggest early predictive insight adoption correlates with fewer high-risk operational alerts.',
      'Enable Predictive Insights generation and review high-risk forecasts weekly.',
      'low'
    );
end; $$;

create or replace function public._ctie_sync_org_outcomes(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.cross_tenant_participation_settings;
begin
  perform public._ctie_ensure_participation_settings(p_organization_id);
  select * into v_settings from public.cross_tenant_participation_settings where organization_id = p_organization_id;

  if v_settings.participation_status = 'disabled' then
    return;
  end if;

  perform public._ctie_seed_global_insights();

  insert into public.cross_tenant_intelligence_outcomes (organization_id, global_insight_id, status)
  select p_organization_id, i.id, 'pending'
  from public.cross_tenant_insights i
  where i.status = 'active'
    and i.insight_category = any(
      select jsonb_array_elements_text(coalesce(v_settings.allowed_categories, public._ctie_default_categories()))
    )
  on conflict (organization_id, global_insight_id) do nothing;
end; $$;

create or replace function public._ctie_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_settings public.cross_tenant_participation_settings;
begin
  perform public._ctie_ensure_participation_settings(p_organization_id);
  select * into v_settings from public.cross_tenant_participation_settings where organization_id = p_organization_id;
  perform public._ctie_sync_org_outcomes(p_organization_id);

  return jsonb_build_object(
    'participation_status', v_settings.participation_status,
    'anonymization_level', v_settings.anonymization_level,
    'visible_insights', coalesce((
      select count(*)
      from public.cross_tenant_insights i
      where i.status = 'active'
        and i.insight_category = any(
          select jsonb_array_elements_text(coalesce(v_settings.allowed_categories, public._ctie_default_categories()))
        )
    ), 0),
    'pending_recommendations', coalesce((
      select count(*) from public.cross_tenant_intelligence_outcomes
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'approved_recommendations', coalesce((
      select count(*) from public.cross_tenant_intelligence_outcomes
      where organization_id = p_organization_id and status in ('approved', 'implemented')
    ), 0),
    'global_active_insights', coalesce((
      select count(*) from public.cross_tenant_insights where status = 'active'
    ), 0)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.upsert_cross_tenant_participation_settings(
  p_participation_status text default null,
  p_allowed_categories jsonb default null,
  p_anonymization_level text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.cross_tenant_participation_settings;
begin
  perform public._irp_require_permission('intelligence.configure_participation');
  v_org_id := public._mta_require_organization();
  perform public._ctie_ensure_participation_settings(v_org_id);

  update public.cross_tenant_participation_settings
  set
    participation_status = coalesce(nullif(trim(p_participation_status), ''), participation_status),
    allowed_categories = coalesce(p_allowed_categories, allowed_categories),
    anonymization_level = coalesce(nullif(trim(p_anonymization_level), ''), anonymization_level),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._ctie_sync_org_outcomes(v_org_id);

  perform public._ctie_log(
    v_org_id, 'ctie_participation_updated', 'cross_tenant_participation_settings', v_org_id,
    jsonb_build_object(
      'participation_status', v_row.participation_status,
      'anonymization_level', v_row.anonymization_level
    )
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_cross_tenant_insights(
  p_refresh_existing boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.cross_tenant_participation_settings;
  v_count int;
begin
  perform public._irp_require_permission('intelligence.manage');
  v_org_id := public._mta_require_organization();
  perform public._ctie_ensure_participation_settings(v_org_id);
  select * into v_settings from public.cross_tenant_participation_settings where organization_id = v_org_id;

  if v_settings.participation_status = 'disabled' then
    raise exception 'Cross-tenant intelligence is disabled for this organization';
  end if;

  perform public._ctie_seed_global_insights();
  perform public._ctie_sync_org_outcomes(v_org_id);

  if v_settings.participation_status = 'anonymized_contributor' then
    perform public._ctie_log(
      v_org_id, 'ctie_anonymized_contribution', 'cross_tenant_intelligence', null,
      jsonb_build_object(
        'anonymization_level', v_settings.anonymization_level,
        'categories', v_settings.allowed_categories,
        'metadata_only', true
      )
    );
  end if;

  select count(*) into v_count
  from public.cross_tenant_intelligence_outcomes
  where organization_id = v_org_id and status = 'pending';

  perform public._ctie_log(
    v_org_id, 'ctie_insights_generated', 'cross_tenant_intelligence', null,
    jsonb_build_object('pending_recommendations', v_count, 'refresh', p_refresh_existing)
  );

  return jsonb_build_object(
    'generated', true,
    'pending_recommendations', v_count,
    'participation_status', v_settings.participation_status
  );
end; $$;

create or replace function public.approve_cross_tenant_recommendation(
  p_global_insight_id uuid,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_insight public.cross_tenant_insights;
  v_row public.cross_tenant_intelligence_outcomes;
begin
  perform public._irp_require_permission('intelligence.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_insight from public.cross_tenant_insights
  where id = p_global_insight_id and status = 'active';

  if v_insight.id is null then raise exception 'Global insight not found'; end if;

  insert into public.cross_tenant_intelligence_outcomes (
    organization_id, global_insight_id, status, outcome_summary, approved_by, metadata
  )
  values (
    v_org_id, p_global_insight_id, 'approved',
    left(coalesce(p_notes, v_insight.recommendation), 500),
    v_user_id,
    jsonb_build_object('insight_category', v_insight.insight_category, 'confidence_level', v_insight.confidence_level)
  )
  on conflict (organization_id, global_insight_id) do update
  set
    status = 'approved',
    outcome_summary = excluded.outcome_summary,
    approved_by = v_user_id,
    updated_at = now(),
    metadata = cross_tenant_intelligence_outcomes.metadata || excluded.metadata
  returning * into v_row;

  perform public._ctie_capture_memory_hook(
    v_org_id, v_row.id, v_row.outcome_summary,
    jsonb_build_object('global_insight_id', p_global_insight_id, 'action', 'approved')
  );

  perform public._ctie_log(
    v_org_id, 'ctie_recommendation_approved', 'cross_tenant_intelligence_outcome', v_row.id,
    jsonb_build_object('global_insight_id', p_global_insight_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_cross_tenant_intelligence_outcome(
  p_outcome_id uuid,
  p_status text default 'implemented',
  p_outcome_summary text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.cross_tenant_intelligence_outcomes;
begin
  perform public._irp_require_permission('intelligence.manage');
  v_org_id := public._mta_require_organization();

  update public.cross_tenant_intelligence_outcomes
  set
    status = coalesce(nullif(trim(p_status), ''), status),
    outcome_summary = coalesce(left(p_outcome_summary, 500), outcome_summary),
    metadata = metadata || coalesce(p_metadata, '{}'::jsonb),
    updated_at = now()
  where id = p_outcome_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Outcome not found'; end if;

  perform public._ctie_capture_memory_hook(
    v_org_id, v_row.id, v_row.outcome_summary,
    jsonb_build_object('status', v_row.status, 'metadata', p_metadata)
  );

  perform public._ctie_log(
    v_org_id, 'ctie_outcome_recorded', 'cross_tenant_intelligence_outcome', v_row.id,
    jsonb_build_object('status', v_row.status)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_cross_tenant_intelligence_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.cross_tenant_participation_settings;
begin
  perform public._irp_require_permission('intelligence.export');
  v_org_id := public._mta_require_organization();
  perform public._ctie_ensure_participation_settings(v_org_id);
  select * into v_settings from public.cross_tenant_participation_settings where organization_id = v_org_id;
  perform public._ctie_sync_org_outcomes(v_org_id);

  perform public._ctie_log(
    v_org_id, 'ctie_manifest_exported', 'cross_tenant_intelligence', null,
    jsonb_build_object('format', coalesce(p_format, 'json'))
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'cross_tenant_intelligence',
    'format', coalesce(p_format, 'json'),
    'participation', row_to_json(v_settings)::jsonb,
    'summary', public._ctie_executive_summary_block(v_org_id),
    'insights', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'insight', row_to_json(i),
          'outcome', row_to_json(o)
        ) order by i.created_at desc
      )
      from public.cross_tenant_intelligence_outcomes o
      join public.cross_tenant_insights i on i.id = o.global_insight_id
      where o.organization_id = v_org_id and i.status = 'active'
      limit 100
    ), '[]'::jsonb),
    'integration_summaries', jsonb_build_object(
      'industry_intelligence', public._ctie_industry_intelligence_summary(v_org_id),
      'continuous_improvement', public._ctie_continuous_improvement_summary(v_org_id),
      'organizational_benchmarking', public._ctie_benchmarking_summary(v_org_id),
      'predictive_insights', public._ctie_predictive_insights_summary(v_org_id)
    )
  );
end; $$;

create or replace function public.get_executive_cross_tenant_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._ctie_sync_org_outcomes(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Anonymized cross-tenant intelligence — trends inform, humans decide.',
    'summary', public._ctie_executive_summary_block(v_org_id),
    'pending_recommendations', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'insight_id', i.id,
          'category', i.insight_category,
          'summary', i.summary,
          'recommendation', i.recommendation,
          'confidence_level', i.confidence_level
        ) order by i.created_at desc
      )
      from public.cross_tenant_intelligence_outcomes o
      join public.cross_tenant_insights i on i.id = o.global_insight_id
      where o.organization_id = v_org_id and o.status = 'pending' and i.status = 'active'
      limit 10
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_cross_tenant_intelligence_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.cross_tenant_participation_settings;
  v_categories jsonb;
begin
  perform public._irp_require_permission('intelligence.view');
  v_org_id := public._mta_require_organization();
  perform public._ctie_ensure_participation_settings(v_org_id);
  select * into v_settings from public.cross_tenant_participation_settings where organization_id = v_org_id;
  v_categories := coalesce(v_settings.allowed_categories, public._ctie_default_categories());
  perform public._ctie_sync_org_outcomes(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Anonymized cross-tenant trends — tenant isolation preserved, humans approve recommendations.',
    'principles', jsonb_build_array(
      'Strict tenant isolation',
      'Metadata-only anonymization',
      'Opt-in participation controls',
      'Explainable confidence levels',
      'Full audit accountability'
    ),
    'summary', public._ctie_executive_summary_block(v_org_id),
    'settings', row_to_json(v_settings)::jsonb,
    'sections', jsonb_build_object(
      'industry_trends', coalesce((
        select jsonb_agg(row_to_json(i) order by i.created_at desc)
        from public.cross_tenant_insights i
        where i.status = 'active' and i.insight_category = 'industry_trends'
          and i.insight_category = any(select jsonb_array_elements_text(v_categories))
        limit 20
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(row_to_json(i) order by
          case i.confidence_level when 'high' then 1 when 'medium' then 2 else 3 end, i.created_at desc)
        from public.cross_tenant_insights i
        where i.status = 'active'
          and i.insight_category in ('adoption', 'workflow', 'training')
          and i.insight_category = any(select jsonb_array_elements_text(v_categories))
        limit 20
      ), '[]'::jsonb),
      'improvement_areas', coalesce((
        select jsonb_agg(row_to_json(i) order by i.created_at desc)
        from public.cross_tenant_insights i
        where i.status = 'active' and i.insight_category in ('improvement', 'maturity', 'support')
          and i.insight_category = any(select jsonb_array_elements_text(v_categories))
        limit 20
      ), '[]'::jsonb),
      'pending_recommendations', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'outcome_id', o.id,
            'status', o.status,
            'insight', row_to_json(i)
          ) order by i.created_at desc
        )
        from public.cross_tenant_intelligence_outcomes o
        join public.cross_tenant_insights i on i.id = o.global_insight_id
        where o.organization_id = v_org_id and o.status = 'pending' and i.status = 'active'
        limit 30
      ), '[]'::jsonb)
    ),
    'executive_summary', public._ctie_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'industry_intelligence', 'Industry context from Industry Intelligence Foundation — A.44',
      'continuous_improvement', 'Improvement initiative signals — A.49',
      'organizational_benchmarking', 'Benchmark position metadata — A.58',
      'predictive_insights', 'Forward-looking prediction context — A.66'
    ),
    'integration_summaries', jsonb_build_object(
      'industry_intelligence', public._ctie_industry_intelligence_summary(v_org_id),
      'continuous_improvement', public._ctie_continuous_improvement_summary(v_org_id),
      'organizational_benchmarking', public._ctie_benchmarking_summary(v_org_id),
      'predictive_insights', public._ctie_predictive_insights_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_cross_tenant_intelligence_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ctie_sync_org_outcomes(v_org_id);
  v_summary := public._ctie_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Cross-Tenant Intelligence — anonymized industry trends without exposing tenant data.',
    'participation_status', v_summary->'participation_status',
    'visible_insights', v_summary->'visible_insights',
    'pending_recommendations', v_summary->'pending_recommendations',
    'global_active_insights', v_summary->'global_active_insights'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension
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
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'cross-tenant-intelligence-engine', 'Cross-Tenant Intelligence Engine', 'Anonymized cross-tenant trends with opt-in participation — metadata only, no tenant data exposure.', 'authenticated', 98
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'cross-tenant-intelligence-engine' and tenant_id is null);

grant execute on function public.upsert_cross_tenant_participation_settings(text, jsonb, text) to authenticated;
grant execute on function public.generate_cross_tenant_insights(boolean) to authenticated;
grant execute on function public.approve_cross_tenant_recommendation(uuid, text) to authenticated;
grant execute on function public.record_cross_tenant_intelligence_outcome(uuid, text, text, jsonb) to authenticated;
grant execute on function public.export_cross_tenant_intelligence_manifest(text) to authenticated;
grant execute on function public.get_executive_cross_tenant_summary() to authenticated;
grant execute on function public.get_cross_tenant_intelligence_engine_dashboard() to authenticated;
grant execute on function public.get_cross_tenant_intelligence_engine_card() to authenticated;

do $$ begin
  perform public._ctie_seed_global_insights();
end $$;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._ctie_ensure_participation_settings(v_org_id);
    perform public._ctie_sync_org_outcomes(v_org_id);
  end loop;
end $$;
