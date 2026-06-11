-- Phase A.58 — Organizational Benchmarking Engine
-- Extends Industry Intelligence (A.44), Value Realization (A.48), Organizational Health (A.56), Capability Maturity (A.57).

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
    'organizational_benchmarking_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. benchmark_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.benchmark_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  benchmark_category text not null check (
    benchmark_category in ('internal', 'industry', 'maturity', 'performance', 'adoption')
  ),
  benchmark_source text not null default 'aipify_metadata',
  benchmark_period text not null default 'monthly' check (
    benchmark_period in ('weekly', 'monthly', 'quarterly', 'annually')
  ),
  config jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists benchmark_profiles_org_idx
  on public.benchmark_profiles (organization_id, benchmark_category, benchmark_period, created_at desc);

alter table public.benchmark_profiles enable row level security;
revoke all on public.benchmark_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. benchmark_comparisons
-- ---------------------------------------------------------------------------
create table if not exists public.benchmark_comparisons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null references public.benchmark_profiles (id) on delete cascade,
  metric_key text not null check (
    metric_key in (
      'support_response_time', 'training_completion', 'workflow_adoption',
      'incident_resolution', 'maturity_level', 'health_score'
    )
  ),
  org_value numeric not null default 0,
  benchmark_value numeric not null default 0,
  position_metadata jsonb not null default '{}'::jsonb,
  compared_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists benchmark_comparisons_org_idx
  on public.benchmark_comparisons (organization_id, profile_id, metric_key, compared_at desc);

alter table public.benchmark_comparisons enable row level security;
revoke all on public.benchmark_comparisons from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. benchmark_reports
-- ---------------------------------------------------------------------------
create table if not exists public.benchmark_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null default 'benchmark_summary' check (
    report_type in ('benchmark_summary', 'executive_overview', 'industry_comparison', 'adoption_comparison')
  ),
  exported_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  generated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists benchmark_reports_org_idx
  on public.benchmark_reports (organization_id, report_type, created_at desc);

alter table public.benchmark_reports enable row level security;
revoke all on public.benchmark_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. benchmark_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.benchmark_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation text not null,
  source_comparison_id uuid references public.benchmark_comparisons (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'implemented')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists benchmark_recommendations_org_idx
  on public.benchmark_recommendations (organization_id, status, created_at desc);

alter table public.benchmark_recommendations enable row level security;
revoke all on public.benchmark_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'organizational_benchmarking', v.description
from (values
  ('benchmarks.view', 'View Benchmarks', 'View benchmark profiles, comparisons, and summaries'),
  ('benchmarks.manage', 'Manage Benchmarks', 'Create profiles, generate comparisons, and override benchmarks'),
  ('benchmarks.review', 'Review Benchmarks', 'Review recommendations and accept improvement actions'),
  ('benchmarks.export', 'Export Benchmarks', 'Export benchmark reports and executive summaries')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'benchmarks.view'), ('owner', 'benchmarks.manage'), ('owner', 'benchmarks.review'), ('owner', 'benchmarks.export'),
  ('administrator', 'benchmarks.view'), ('administrator', 'benchmarks.manage'), ('administrator', 'benchmarks.review'), ('administrator', 'benchmarks.export'),
  ('manager', 'benchmarks.view'), ('manager', 'benchmarks.manage'), ('manager', 'benchmarks.review'), ('manager', 'benchmarks.export'),
  ('support_agent', 'benchmarks.view'),
  ('viewer', 'benchmarks.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_obe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._obe_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'benchmark_profile',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._obe_position_metadata(
  p_metric_key text,
  p_org_value numeric,
  p_benchmark_value numeric,
  p_lower_is_better boolean default false
)
returns jsonb language plpgsql immutable as $$
declare
  v_gap numeric;
  v_position text;
  v_direction text;
  v_percentile numeric;
begin
  v_gap := round(coalesce(p_org_value, 0) - coalesce(p_benchmark_value, 0), 2);

  if coalesce(p_lower_is_better, false) then
    v_position := case
      when p_org_value <= p_benchmark_value then 'at_or_above'
      when p_org_value <= p_benchmark_value * 1.15 then 'near'
      else 'below'
    end;
    v_direction := case when p_org_value <= p_benchmark_value then 'maintain' else 'improve' end;
    v_percentile := greatest(0, least(100, round(100 - ((p_org_value / nullif(p_benchmark_value, 0)) * 50), 0)));
  else
    v_position := case
      when p_org_value >= p_benchmark_value then 'at_or_above'
      when p_org_value >= p_benchmark_value * 0.85 then 'near'
      else 'below'
    end;
    v_direction := case when p_org_value >= p_benchmark_value then 'maintain' else 'improve' end;
    v_percentile := greatest(0, least(100, round((p_org_value / nullif(p_benchmark_value, 0)) * 50, 0)));
  end if;

  return jsonb_build_object(
    'position', v_position,
    'gap', v_gap,
    'percentile', coalesce(v_percentile, 50),
    'direction', v_direction,
    'metric_key', p_metric_key,
    'anonymized', true
  );
end; $$;

create or replace function public._obe_industry_intelligence_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_benchmark_count int := 0; v_insight_count int := 0;
begin
  if not exists (select 1 from pg_tables where tablename = 'industry_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  select count(*) filter (where category = 'benchmark'),
         count(*)
  into v_benchmark_count, v_insight_count
  from public.industry_insights
  where organization_id = p_organization_id and status = 'active';

  return jsonb_build_object(
    'available', true,
    'benchmark_insights', coalesce(v_benchmark_count, 0),
    'active_insights', coalesce(v_insight_count, 0),
    'anonymized', true
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._obe_value_realization_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_value_metrics' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'metrics_count', coalesce((
      select count(*) from public.organization_value_metrics where organization_id = p_organization_id
    ), 0),
    'avg_improvement', coalesce((
      select round(avg(improvement_percentage), 2) from public.organization_value_metrics
      where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._obe_organizational_health_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_avg numeric;
begin
  if not exists (select 1 from pg_tables where tablename = 'organizational_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  select round(avg(health_score), 1) into v_avg
  from public.organizational_health_scores where organization_id = p_organization_id;

  return jsonb_build_object(
    'available', true,
    'overall_score', coalesce(v_avg, 75),
    'categories_measured', coalesce((
      select count(*) from public.organizational_health_scores where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._obe_capability_maturity_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'capability_maturity_assessments' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'assessments_count', coalesce((
      select count(*) from public.capability_maturity_assessments where organization_id = p_organization_id
    ), 0),
    'avg_maturity_level', coalesce((
      select round(avg(maturity_level), 1) from public.capability_maturity_assessments
      where organization_id = p_organization_id
    ), 2)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._obe_collect_org_metric(p_organization_id uuid, p_metric_key text)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare v_val numeric := 0;
begin
  if p_metric_key = 'support_response_time' then
    if exists (select 1 from pg_tables where tablename = 'organization_support_cases' and schemaname = 'public') then
      select coalesce(avg(extract(epoch from (first_response_at - created_at)) / 60), 48)
      into v_val
      from public.organization_support_cases
      where organization_id = p_organization_id and first_response_at is not null
        and created_at >= now() - interval '30 days';
    else
      v_val := 48;
    end if;
  elsif p_metric_key = 'training_completion' then
    if exists (select 1 from pg_tables where tablename = 'user_learning_progress' and schemaname = 'public') then
      select coalesce(
        round(100.0 * count(*) filter (where status = 'completed') / nullif(count(*), 0), 1), 65
      ) into v_val
      from public.user_learning_progress ulp
      join public.users u on u.id = ulp.user_id
      where u.company_id = p_organization_id;
    else
      v_val := 65;
    end if;
  elsif p_metric_key = 'workflow_adoption' then
    if exists (select 1 from pg_tables where tablename = 'organization_workflows' and schemaname = 'public') then
      select coalesce(count(*) filter (where status = 'active'), 0) * 10 into v_val
      from public.organization_workflows where organization_id = p_organization_id;
      v_val := least(v_val, 100);
    else
      v_val := 55;
    end if;
  elsif p_metric_key = 'incident_resolution' then
    if exists (select 1 from pg_tables where tablename = 'incident_records' and schemaname = 'public') then
      select coalesce(avg(extract(epoch from (resolved_at - created_at)) / 3600), 24)
      into v_val
      from public.incident_records
      where organization_id = p_organization_id and resolved_at is not null
        and created_at >= now() - interval '30 days';
    else
      v_val := 24;
    end if;
  elsif p_metric_key = 'maturity_level' then
    if exists (select 1 from pg_tables where tablename = 'capability_maturity_assessments' and schemaname = 'public') then
      select coalesce(round(avg(maturity_level) * 20, 1), 40) into v_val
      from public.capability_maturity_assessments where organization_id = p_organization_id;
    else
      v_val := 40;
    end if;
  elsif p_metric_key = 'health_score' then
    if exists (select 1 from pg_tables where tablename = 'organizational_health_scores' and schemaname = 'public') then
      select coalesce(round(avg(health_score), 1), 75) into v_val
      from public.organizational_health_scores where organization_id = p_organization_id;
    else
      v_val := 75;
    end if;
  end if;

  return coalesce(v_val, 0);
exception when others then
  return 0;
end; $$;

create or replace function public._obe_resolve_benchmark_value(
  p_organization_id uuid,
  p_profile public.benchmark_profiles,
  p_metric_key text
)
returns numeric language plpgsql stable security definer set search_path = public as $$
declare
  v_config numeric;
  v_industry numeric;
begin
  v_config := nullif((p_profile.config->>p_metric_key)::numeric, null);

  if p_profile.benchmark_category = 'internal' then
    return coalesce(v_config, public._obe_collect_org_metric(p_organization_id, p_metric_key) * 1.1);
  elsif p_profile.benchmark_category = 'industry' then
    v_industry := case p_metric_key
      when 'support_response_time' then 45
      when 'training_completion' then 78
      when 'workflow_adoption' then 62
      when 'incident_resolution' then 18
      when 'maturity_level' then 60
      when 'health_score' then 72
      else 50
    end;
    return coalesce(v_config, v_industry);
  elsif p_profile.benchmark_category = 'maturity' then
    return coalesce(v_config, 60);
  elsif p_profile.benchmark_category = 'performance' then
    return coalesce(v_config, case p_metric_key
      when 'support_response_time' then 40
      when 'incident_resolution' then 16
      else public._obe_collect_org_metric(p_organization_id, p_metric_key) * 1.05
    end);
  else
    return coalesce(v_config, case p_metric_key
      when 'training_completion' then 80
      when 'workflow_adoption' then 70
      else 65
    end);
  end if;
end; $$;

create or replace function public._obe_metric_lower_is_better(p_metric_key text)
returns boolean language sql immutable as $$
  select p_metric_key in ('support_response_time', 'incident_resolution');
$$;

create or replace function public._obe_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'profiles_count', coalesce((
      select count(*) from public.benchmark_profiles where organization_id = p_organization_id
    ), 0),
    'comparisons_count', coalesce((
      select count(*) from public.benchmark_comparisons where organization_id = p_organization_id
    ), 0),
    'below_benchmark_count', coalesce((
      select count(*) from public.benchmark_comparisons
      where organization_id = p_organization_id
        and position_metadata->>'position' = 'below'
    ), 0),
    'pending_recommendations', coalesce((
      select count(*) from public.benchmark_recommendations
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'latest_comparison_at', (
      select max(compared_at) from public.benchmark_comparisons where organization_id = p_organization_id
    )
  );
end; $$;

create or replace function public._obe_capture_memory_hook(
  p_organization_id uuid,
  p_recommendation_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'benchmark_recommendation',
    left(coalesce(p_summary, 'Benchmark recommendation captured'), 500),
    jsonb_build_object(
      'source', 'organizational_benchmarking_engine',
      'recommendation_id', p_recommendation_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._obe_seed_profiles(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.benchmark_profiles (
    organization_id, benchmark_category, benchmark_source, benchmark_period, config
  )
  select p_organization_id, v.cat, v.source, v.period, v.config
  from (values
    (
      'industry', 'industry_intelligence_a44', 'monthly',
      '{"support_response_time":45,"training_completion":78,"workflow_adoption":62,"incident_resolution":18,"maturity_level":60,"health_score":72,"anonymized":true}'::jsonb
    ),
    (
      'internal', 'organization_baseline', 'monthly',
      '{"note":"Compare against prior-period org metadata aggregates"}'::jsonb
    ),
    (
      'adoption', 'workflow_training_signals', 'monthly',
      '{"training_completion":80,"workflow_adoption":70}'::jsonb
    )
  ) as v(cat, source, period, config)
  where not exists (
    select 1 from public.benchmark_profiles bp
    where bp.organization_id = p_organization_id
      and bp.benchmark_category = v.cat
      and bp.benchmark_source = v.source
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_benchmark_profile(
  p_benchmark_category text,
  p_benchmark_source text default 'custom',
  p_benchmark_period text default 'monthly',
  p_config jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.benchmark_profiles;
begin
  perform public._irp_require_permission('benchmarks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.benchmark_profiles (
    organization_id, benchmark_category, benchmark_source, benchmark_period, config, created_by
  )
  values (
    v_org_id, p_benchmark_category,
    coalesce(nullif(trim(p_benchmark_source), ''), 'custom'),
    coalesce(nullif(trim(p_benchmark_period), ''), 'monthly'),
    coalesce(p_config, '{}'::jsonb),
    v_user_id
  )
  returning * into v_row;

  perform public._obe_log(
    v_org_id, 'obe_profile_created', 'benchmark_profile', v_row.id,
    jsonb_build_object('category', p_benchmark_category, 'source', p_benchmark_source)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_benchmark_profile(
  p_profile_id uuid,
  p_benchmark_source text default null,
  p_benchmark_period text default null,
  p_config jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.benchmark_profiles;
begin
  perform public._irp_require_permission('benchmarks.manage');
  v_org_id := public._mta_require_organization();

  update public.benchmark_profiles
  set
    benchmark_source = coalesce(nullif(trim(p_benchmark_source), ''), benchmark_source),
    benchmark_period = coalesce(nullif(trim(p_benchmark_period), ''), benchmark_period),
    config = coalesce(p_config, config),
    updated_at = now()
  where id = p_profile_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Benchmark profile not found'; end if;

  perform public._obe_log(
    v_org_id, 'obe_profile_updated', 'benchmark_profile', v_row.id,
    jsonb_build_object('profile_id', p_profile_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_benchmark_comparison(
  p_profile_id uuid,
  p_metric_keys text[] default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile public.benchmark_profiles;
  v_keys text[] := coalesce(
    p_metric_keys,
    array['support_response_time', 'training_completion', 'workflow_adoption', 'incident_resolution', 'maturity_level', 'health_score']
  );
  v_key text;
  v_org_val numeric;
  v_bench_val numeric;
  v_row public.benchmark_comparisons;
  v_results jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('benchmarks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_profile from public.benchmark_profiles
  where id = p_profile_id and organization_id = v_org_id;

  if v_profile.id is null then raise exception 'Benchmark profile not found'; end if;

  foreach v_key in array v_keys loop
    v_org_val := public._obe_collect_org_metric(v_org_id, v_key);
    v_bench_val := public._obe_resolve_benchmark_value(v_org_id, v_profile, v_key);

    insert into public.benchmark_comparisons (
      organization_id, profile_id, metric_key, org_value, benchmark_value, position_metadata
    )
    values (
      v_org_id, p_profile_id, v_key, v_org_val, v_bench_val,
      public._obe_position_metadata(v_key, v_org_val, v_bench_val, public._obe_metric_lower_is_better(v_key))
    )
    returning * into v_row;

    v_results := v_results || jsonb_build_array(row_to_json(v_row)::jsonb);
  end loop;

  perform public._obe_log(
    v_org_id, 'obe_comparison_generated', 'benchmark_comparison', null,
    jsonb_build_object('profile_id', p_profile_id, 'metrics', v_keys, 'generated_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'profile', row_to_json(v_profile)::jsonb,
    'comparisons', v_results,
    'summary', public._obe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.override_benchmark(
  p_comparison_id uuid,
  p_benchmark_value numeric,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.benchmark_comparisons;
begin
  perform public._irp_require_permission('benchmarks.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.benchmark_comparisons
  set
    benchmark_value = coalesce(p_benchmark_value, benchmark_value),
    position_metadata = public._obe_position_metadata(
      metric_key, org_value, coalesce(p_benchmark_value, benchmark_value),
      public._obe_metric_lower_is_better(metric_key)
    ) || jsonb_build_object(
      'override', true,
      'reason', left(coalesce(p_reason, 'Manual benchmark override'), 500),
      'overridden_by', v_user_id
    ),
    compared_at = now()
  where id = p_comparison_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Comparison not found'; end if;

  perform public._obe_log(
    v_org_id, 'obe_benchmark_overridden', 'benchmark_comparison', v_row.id,
    jsonb_build_object('comparison_id', p_comparison_id, 'benchmark_value', p_benchmark_value, 'reason', p_reason)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.generate_benchmark_recommendations(p_profile_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_cmp public.benchmark_comparisons;
  v_row public.benchmark_recommendations;
  v_rec text;
  v_created jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('benchmarks.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  for v_cmp in
    select * from public.benchmark_comparisons
    where organization_id = v_org_id
      and position_metadata->>'position' = 'below'
      and (p_profile_id is null or profile_id = p_profile_id)
    order by compared_at desc
    limit 20
  loop
    v_rec := case v_cmp.metric_key
      when 'support_response_time' then 'Improve support first-response time — review staffing and triage against benchmark.'
      when 'training_completion' then 'Raise training completion through assigned learning paths and completion reminders.'
      when 'workflow_adoption' then 'Increase workflow adoption with guided rollout and adoption checkpoints.'
      when 'incident_resolution' then 'Reduce incident resolution time — review escalation paths and runbooks.'
      when 'maturity_level' then 'Advance capability maturity through targeted assessments and roadmap actions.'
      when 'health_score' then 'Address organizational health gaps identified in health category scores.'
      else 'Review benchmark gap and plan corrective action with accountable owners.'
    end;

    if not exists (
      select 1 from public.benchmark_recommendations
      where organization_id = v_org_id
        and source_comparison_id = v_cmp.id
        and status = 'pending'
    ) then
      insert into public.benchmark_recommendations (
        organization_id, recommendation, source_comparison_id, status, metadata, created_by
      )
      values (
        v_org_id, v_rec, v_cmp.id, 'pending',
        jsonb_build_object(
          'metric_key', v_cmp.metric_key,
          'org_value', v_cmp.org_value,
          'benchmark_value', v_cmp.benchmark_value,
          'position', v_cmp.position_metadata->>'position'
        ),
        v_user_id
      )
      returning * into v_row;

      v_created := v_created || jsonb_build_array(row_to_json(v_row)::jsonb);
    end if;
  end loop;

  perform public._obe_log(
    v_org_id, 'obe_recommendations_generated', 'benchmark_recommendation', null,
    jsonb_build_object('created_count', jsonb_array_length(v_created), 'profile_id', p_profile_id)
  );

  return jsonb_build_object('recommendations', v_created, 'created_count', jsonb_array_length(v_created));
end; $$;

create or replace function public.export_benchmark_report(p_report_type text default 'benchmark_summary')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_report_id uuid;
  v_profiles jsonb;
  v_comparisons jsonb;
  v_recommendations jsonb;
begin
  perform public._irp_require_permission('benchmarks.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select coalesce(jsonb_agg(row_to_json(p) order by p.created_at desc), '[]'::jsonb) into v_profiles
  from public.benchmark_profiles p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(row_to_json(c) order by c.compared_at desc), '[]'::jsonb) into v_comparisons
  from (
    select * from public.benchmark_comparisons
    where organization_id = v_org_id order by compared_at desc limit 50
  ) c;

  select coalesce(jsonb_agg(row_to_json(r) order by r.created_at desc), '[]'::jsonb) into v_recommendations
  from (
    select * from public.benchmark_recommendations
    where organization_id = v_org_id order by created_at desc limit 20
  ) r;

  insert into public.benchmark_reports (organization_id, report_type, exported_at, metadata, generated_by)
  values (
    v_org_id, coalesce(nullif(trim(p_report_type), ''), 'benchmark_summary'), now(),
    jsonb_build_object(
      'summary', public._obe_executive_summary_block(v_org_id),
      'profiles_count', jsonb_array_length(v_profiles),
      'comparisons_count', jsonb_array_length(v_comparisons)
    ),
    v_user_id
  )
  returning id into v_report_id;

  perform public._obe_log(
    v_org_id, 'obe_report_exported', 'benchmark_report', v_report_id,
    jsonb_build_object('report_type', p_report_type, 'exported_by', v_user_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'report_type', coalesce(p_report_type, 'benchmark_summary'),
    'report_id', v_report_id,
    'profiles', v_profiles,
    'comparisons', v_comparisons,
    'recommendations', v_recommendations,
    'summary', public._obe_executive_summary_block(v_org_id)
  );
end; $$;

create or replace function public.get_executive_benchmark_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('benchmarks.view');
  v_org_id := public._mta_require_organization();
  perform public._obe_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational benchmarking — anonymized industry comparisons; humans decide action.',
    'summary', public._obe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'industry_intelligence', 'Industry benchmark hooks from Industry Intelligence (A.44)',
      'value_realization', 'Performance context from Value Realization (A.48)',
      'organizational_health', 'Health score comparisons from Organizational Health (A.56)',
      'capability_maturity', 'Maturity level comparisons from Capability Maturity (A.57)'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_benchmarking_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('benchmarks.view');
  v_org_id := public._mta_require_organization();
  perform public._obe_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify compares metadata benchmarks. Humans review gaps and decide action.',
    'principles', jsonb_build_array(
      'Metadata-only comparison metrics',
      'Anonymized industry benchmarks',
      'Position metadata with gap analysis',
      'Human-reviewed recommendations',
      'No PII in benchmark aggregation'
    ),
    'summary', public._obe_executive_summary_block(v_org_id),
    'profiles', coalesce((
      select jsonb_agg(row_to_json(p) order by p.created_at desc)
      from public.benchmark_profiles p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'comparisons', coalesce((
      select jsonb_agg(row_to_json(c) order by c.compared_at desc)
      from (
        select * from public.benchmark_comparisons
        where organization_id = v_org_id order by compared_at desc limit 30
      ) c
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from (
        select * from public.benchmark_recommendations
        where organization_id = v_org_id order by created_at desc limit 20
      ) r
    ), '[]'::jsonb),
    'executive_summary', public._obe_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'industry_intelligence', 'Industry Intelligence benchmark hooks — A.44 (anonymized)',
      'value_realization', 'Value Realization performance metrics — A.48',
      'organizational_health', 'Organizational Health score comparisons — A.56',
      'capability_maturity', 'Capability Maturity level comparisons — A.57',
      'organizational_memory', 'Recommendations may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'industry_intelligence', public._obe_industry_intelligence_summary(v_org_id),
      'value_realization', public._obe_value_realization_summary(v_org_id),
      'organizational_health', public._obe_organizational_health_summary(v_org_id),
      'capability_maturity', public._obe_capability_maturity_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_benchmarking_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._obe_seed_profiles(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational benchmarking — compare metadata metrics against internal and industry baselines.',
    'profiles_count', coalesce((
      select count(*) from public.benchmark_profiles where organization_id = v_org_id
    ), 0),
    'below_benchmark_count', coalesce((
      select count(*) from public.benchmark_comparisons
      where organization_id = v_org_id and position_metadata->>'position' = 'below'
    ), 0),
    'pending_recommendations', coalesce((
      select count(*) from public.benchmark_recommendations
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
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated',
    'obe_benchmark_overridden', 'obe_recommendations_generated', 'obe_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-benchmarking-engine', 'Organizational Benchmarking Engine', 'Metadata benchmark comparisons against internal baselines and anonymized industry signals with executive reporting.', 'authenticated', 89
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-benchmarking-engine' and tenant_id is null);

grant execute on function public.create_benchmark_profile(text, text, text, jsonb) to authenticated;
grant execute on function public.update_benchmark_profile(uuid, text, text, jsonb) to authenticated;
grant execute on function public.generate_benchmark_comparison(uuid, text[]) to authenticated;
grant execute on function public.override_benchmark(uuid, numeric, text) to authenticated;
grant execute on function public.generate_benchmark_recommendations(uuid) to authenticated;
grant execute on function public.export_benchmark_report(text) to authenticated;
grant execute on function public.get_executive_benchmark_summary() to authenticated;
grant execute on function public.get_organizational_benchmarking_engine_dashboard() to authenticated;
grant execute on function public.get_organizational_benchmarking_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._obe_seed_profiles(v_org_id);
  end loop;
end $$;
