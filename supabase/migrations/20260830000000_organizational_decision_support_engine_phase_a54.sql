-- Phase A.54 — Organizational Decision Support Engine
-- Extends Strategic Intelligence (A.31), Executive Insights (A.35), Human Oversight (A.40), Value Realization (A.48).
-- Distinct from Assistant DSE at /app/assistant/decisions (lib/decision-support-engine/).

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
    'organizational_decision_support_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organizational_decision_support_items
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_decision_support_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_title text not null,
  decision_category text not null default 'operational' check (
    decision_category in (
      'operational', 'staffing', 'support_prioritization', 'workflow_optimization',
      'strategic_planning', 'resource_allocation'
    )
  ),
  recommendation text not null,
  confidence_level text not null default 'medium' check (
    confidence_level in ('low', 'medium', 'high')
  ),
  status text not null default 'proposed' check (
    status in ('proposed', 'under_review', 'approved', 'rejected', 'implemented')
  ),
  rationale text,
  expected_benefits text,
  potential_risks text,
  dependencies text,
  alternatives jsonb not null default '[]'::jsonb,
  scenarios jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_decision_support_items_org_idx
  on public.organizational_decision_support_items (organization_id, status, decision_category, created_at desc);

alter table public.organizational_decision_support_items enable row level security;
revoke all on public.organizational_decision_support_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organizational_decision_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_decision_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_id uuid not null references public.organizational_decision_support_items (id) on delete cascade,
  outcome_summary text not null,
  lessons_learned_metadata jsonb not null default '{}'::jsonb,
  org_memory_hook_metadata jsonb not null default '{}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists organizational_decision_outcomes_decision_idx
  on public.organizational_decision_outcomes (decision_id, created_at desc);

create index if not exists organizational_decision_outcomes_org_idx
  on public.organizational_decision_outcomes (organization_id, created_at desc);

alter table public.organizational_decision_outcomes enable row level security;
revoke all on public.organizational_decision_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_decision_support', v.description
from (values
  ('decisions.view', 'View Decisions', 'View organizational decision recommendations and outcomes'),
  ('decisions.manage', 'Manage Decisions', 'Propose and update organizational decision recommendations'),
  ('decisions.review', 'Review Decisions', 'Review, approve, reject, and mark decisions implemented'),
  ('decisions.export', 'Export Decisions', 'Export organizational decision reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'decisions.view'), ('owner', 'decisions.manage'), ('owner', 'decisions.review'), ('owner', 'decisions.export'),
  ('administrator', 'decisions.view'), ('administrator', 'decisions.manage'), ('administrator', 'decisions.review'), ('administrator', 'decisions.export'),
  ('manager', 'decisions.view'), ('manager', 'decisions.manage'), ('manager', 'decisions.review'), ('manager', 'decisions.export'),
  ('support_agent', 'decisions.view'),
  ('viewer', 'decisions.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_odse_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._odse_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organizational_decision_support_item',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._odse_strategic_intelligence_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_intelligence_insights' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'active_insights', coalesce((
      select count(*) from public.strategic_intelligence_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'pending_review', coalesce((
      select count(*) from public.strategic_intelligence_insights
      where organization_id = p_organization_id and status = 'pending_review'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._odse_executive_insights_summary(p_organization_id uuid)
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

create or replace function public._odse_human_oversight_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'oversight_approvals' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;

  return jsonb_build_object(
    'available', true,
    'pending_approvals', coalesce((
      select count(*) from public.oversight_approvals
      where organization_id = p_organization_id and status = 'pending'
    ), 0),
    'high_risk_pending', coalesce((
      select count(*) from public.oversight_approvals
      where organization_id = p_organization_id and status = 'pending' and risk_level = 'high'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._odse_value_realization_summary(p_organization_id uuid)
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

create or replace function public._odse_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'total_decisions', coalesce((
      select count(*) from public.organizational_decision_support_items where organization_id = p_organization_id
    ), 0),
    'pending_review', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = p_organization_id and status in ('proposed', 'under_review')
    ), 0),
    'approved_30d', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = p_organization_id and status = 'approved'
        and updated_at >= now() - interval '30 days'
    ), 0),
    'implemented_90d', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = p_organization_id and status = 'implemented'
        and updated_at >= now() - interval '90 days'
    ), 0),
    'outcomes_recorded', coalesce((
      select count(*) from public.organizational_decision_outcomes where organization_id = p_organization_id
    ), 0)
  );
end; $$;

create or replace function public._odse_capture_memory_hook(
  p_organization_id uuid,
  p_decision_id uuid,
  p_summary text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = 'capture_organization_memory') then
    return jsonb_build_object('linked', false, 'metadata_only', true, 'summary', left(coalesce(p_summary, ''), 500));
  end if;

  return public.capture_organization_memory(
    'decision_outcome',
    left(coalesce(p_summary, 'Decision outcome captured'), 500),
    jsonb_build_object(
      'source', 'organizational_decision_support_engine',
      'decision_id', p_decision_id,
      'metadata', coalesce(p_metadata, '{}'::jsonb)
    )
  );
exception when others then
  return jsonb_build_object('linked', false, 'metadata_only', true, 'error', 'hook_unavailable');
end; $$;

create or replace function public._odse_seed_decisions(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organizational_decision_support_items where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  insert into public.organizational_decision_support_items (
    organization_id, decision_title, decision_category, recommendation,
    confidence_level, status, rationale, expected_benefits, potential_risks,
    dependencies, alternatives, scenarios
  )
  values (
    p_organization_id,
    'Prioritize support queue automation',
    'support_prioritization',
    'Implement tiered triage automation for repetitive support categories while keeping human review for sensitive cases.',
    'high',
    'proposed',
    'Support volume trends indicate repetitive categorization consuming agent time.',
    'Faster first response, reduced manual triage, improved customer satisfaction scores.',
    'Over-automation may miss nuanced cases; requires oversight thresholds.',
    'Business DNA templates, Trust & Action approval policies, ASO autonomy settings.',
    jsonb_build_array(
      jsonb_build_object('label', 'Full automation', 'tradeoff', 'Higher speed, lower human control'),
      jsonb_build_object('label', 'Assisted triage only', 'tradeoff', 'Balanced speed and oversight')
    ),
    jsonb_build_array(
      jsonb_build_object('scenario', 'optimistic', 'outcome', '30% reduction in triage time within 60 days'),
      jsonb_build_object('scenario', 'conservative', 'outcome', '15% reduction with phased rollout')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.propose_decision_recommendation(
  p_decision_title text,
  p_decision_category text default 'operational',
  p_recommendation text default null,
  p_confidence_level text default 'medium',
  p_rationale text default null,
  p_expected_benefits text default null,
  p_potential_risks text default null,
  p_dependencies text default null,
  p_alternatives jsonb default '[]'::jsonb,
  p_scenarios jsonb default '[]'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organizational_decision_support_items; v_user_id uuid;
begin
  perform public._irp_require_permission('decisions.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if coalesce(trim(p_decision_title), '') = '' then raise exception 'Decision title required'; end if;
  if coalesce(trim(p_recommendation), '') = '' then raise exception 'Recommendation required'; end if;

  insert into public.organizational_decision_support_items (
    organization_id, decision_title, decision_category, recommendation,
    confidence_level, status, rationale, expected_benefits, potential_risks,
    dependencies, alternatives, scenarios, created_by
  )
  values (
    v_org_id, left(trim(p_decision_title), 200), coalesce(p_decision_category, 'operational'),
    left(trim(p_recommendation), 2000), coalesce(p_confidence_level, 'medium'), 'proposed',
    left(coalesce(p_rationale, ''), 2000), left(coalesce(p_expected_benefits, ''), 2000),
    left(coalesce(p_potential_risks, ''), 2000), left(coalesce(p_dependencies, ''), 2000),
    coalesce(p_alternatives, '[]'::jsonb), coalesce(p_scenarios, '[]'::jsonb), v_user_id
  )
  returning * into v_row;

  perform public._odse_log(
    v_org_id, 'odse_decision_proposed', 'organizational_decision_support_item', v_row.id,
    jsonb_build_object('decision_title', v_row.decision_title, 'category', v_row.decision_category)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.review_decision(
  p_decision_id uuid,
  p_review_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organizational_decision_support_items; v_user_id uuid;
begin
  perform public._irp_require_permission('decisions.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organizational_decision_support_items
  set status = 'under_review', updated_at = now()
  where id = p_decision_id and organization_id = v_org_id and status = 'proposed'
  returning * into v_row;

  if v_row.id is null then raise exception 'Decision not found or not in proposed status'; end if;

  perform public._odse_log(
    v_org_id, 'odse_decision_review_started', 'organizational_decision_support_item', v_row.id,
    jsonb_build_object('review_notes', left(coalesce(p_review_notes, ''), 500), 'reviewed_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.approve_decision(
  p_decision_id uuid,
  p_approval_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organizational_decision_support_items; v_user_id uuid;
begin
  perform public._irp_require_permission('decisions.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organizational_decision_support_items
  set status = 'approved', updated_at = now()
  where id = p_decision_id and organization_id = v_org_id and status in ('proposed', 'under_review')
  returning * into v_row;

  if v_row.id is null then raise exception 'Decision not found or not approvable'; end if;

  perform public._odse_log(
    v_org_id, 'odse_decision_approved', 'organizational_decision_support_item', v_row.id,
    jsonb_build_object('approval_rationale', left(coalesce(p_approval_rationale, ''), 500), 'approved_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.reject_decision(
  p_decision_id uuid,
  p_rejection_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organizational_decision_support_items; v_user_id uuid;
begin
  perform public._irp_require_permission('decisions.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organizational_decision_support_items
  set status = 'rejected', updated_at = now()
  where id = p_decision_id and organization_id = v_org_id and status in ('proposed', 'under_review')
  returning * into v_row;

  if v_row.id is null then raise exception 'Decision not found or not rejectable'; end if;

  perform public._odse_log(
    v_org_id, 'odse_decision_rejected', 'organizational_decision_support_item', v_row.id,
    jsonb_build_object('rejection_rationale', left(coalesce(p_rejection_rationale, ''), 500), 'rejected_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.mark_decision_implemented(p_decision_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organizational_decision_support_items; v_user_id uuid;
begin
  perform public._irp_require_permission('decisions.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.organizational_decision_support_items
  set status = 'implemented', updated_at = now()
  where id = p_decision_id and organization_id = v_org_id and status = 'approved'
  returning * into v_row;

  if v_row.id is null then raise exception 'Decision not found or must be approved before implementation'; end if;

  perform public._odse_log(
    v_org_id, 'odse_decision_implemented', 'organizational_decision_support_item', v_row.id,
    jsonb_build_object('implemented_by', v_user_id)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.record_decision_outcome(
  p_decision_id uuid,
  p_outcome_summary text,
  p_lessons_learned_metadata jsonb default '{}'::jsonb,
  p_capture_memory boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organizational_decision_outcomes;
  v_user_id uuid;
  v_memory jsonb;
begin
  perform public._irp_require_permission('decisions.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if not exists (
    select 1 from public.organizational_decision_support_items
    where id = p_decision_id and organization_id = v_org_id
      and status in ('approved', 'implemented', 'rejected')
  ) then
    raise exception 'Decision not found or not ready for outcome recording';
  end if;

  v_memory := '{}'::jsonb;
  if coalesce(p_capture_memory, false) then
    v_memory := public._odse_capture_memory_hook(
      v_org_id, p_decision_id, p_outcome_summary, p_lessons_learned_metadata
    );
  end if;

  insert into public.organizational_decision_outcomes (
    organization_id, decision_id, outcome_summary, lessons_learned_metadata,
    org_memory_hook_metadata, recorded_by
  )
  values (
    v_org_id, p_decision_id,
    left(coalesce(trim(p_outcome_summary), 'Outcome recorded'), 2000),
    coalesce(p_lessons_learned_metadata, '{}'::jsonb),
    v_memory, v_user_id
  )
  returning * into v_row;

  perform public._odse_log(
    v_org_id, 'odse_decision_outcome_recorded', 'organizational_decision_outcome', v_row.id,
    jsonb_build_object('decision_id', p_decision_id, 'memory_hook', v_memory)
  );

  return jsonb_build_object('outcome', row_to_json(v_row)::jsonb, 'memory_hook', v_memory);
end; $$;

create or replace function public.export_decision_report(p_decision_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_decision jsonb;
  v_outcomes jsonb;
begin
  perform public._irp_require_permission('decisions.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_decision_id is not null then
    select row_to_json(d)::jsonb into v_decision
    from public.organizational_decision_support_items d
    where d.id = p_decision_id and d.organization_id = v_org_id;

    if v_decision is null then raise exception 'Decision not found'; end if;

    select coalesce(jsonb_agg(row_to_json(o) order by o.created_at desc), '[]'::jsonb) into v_outcomes
    from public.organizational_decision_outcomes o
    where o.decision_id = p_decision_id and o.organization_id = v_org_id;
  end if;

  perform public._odse_log(
    v_org_id, 'odse_decision_report_exported', 'organizational_decision_support_item', p_decision_id,
    jsonb_build_object('exported_by', v_user_id, 'decision_id', p_decision_id)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'exported_by', v_user_id,
    'decision', v_decision,
    'outcomes', coalesce(v_outcomes, '[]'::jsonb),
    'summary', case
      when p_decision_id is null then public._odse_executive_summary_block(v_org_id)
      else null
    end,
    'decisions', case
      when p_decision_id is null then coalesce((
        select jsonb_agg(row_to_json(d) order by d.created_at desc)
        from public.organizational_decision_support_items d where d.organization_id = v_org_id limit 50
      ), '[]'::jsonb)
      else null
    end
  );
end; $$;

create or replace function public.get_executive_decision_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('decisions.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured organizational decisions — humans review, approve, and track outcomes.',
    'summary', public._odse_executive_summary_block(v_org_id),
    'high_confidence_pending', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = v_org_id and status in ('proposed', 'under_review')
        and confidence_level = 'high'
    ), 0),
    'integration_notes', jsonb_build_object(
      'strategic_intelligence', 'Aligns with Strategic Intelligence Foundation (A.31)',
      'executive_insights', 'Feeds executive visibility via A.35 reporting scaffolds',
      'human_oversight', 'Links to Human Oversight accountability (A.40)',
      'value_realization', 'Connects to Value Realization metrics (A.48)'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_decision_support_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('decisions.view');
  v_org_id := public._mta_require_organization();
  perform public._odse_seed_decisions(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify prepares recommendations — your organization decides and tracks outcomes.',
    'principles', jsonb_build_array(
      'Explainable recommendations',
      'Human review and approval',
      'Confidence transparency',
      'Outcome accountability',
      'Metadata only — no PII'
    ),
    'summary', public._odse_executive_summary_block(v_org_id),
    'decisions', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from public.organizational_decision_support_items d where d.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.created_at desc)
      from public.organizational_decision_outcomes o where o.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._odse_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'assistant_dse', 'Distinct from Assistant DSE at /app/assistant/decisions — personal guidance vs organizational register',
      'strategic_intelligence', 'Extends Strategic Intelligence Foundation (A.31)',
      'executive_insights', 'Executive summary via get_executive_decision_summary() — A.35',
      'human_oversight', 'Human Oversight accountability for high-impact recommendations — A.40',
      'value_realization', 'Value Realization context for operational impact — A.48',
      'organizational_memory', 'Outcomes may capture org memory — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._odse_strategic_intelligence_summary(v_org_id),
      'executive_insights', public._odse_executive_insights_summary(v_org_id),
      'human_oversight', public._odse_human_oversight_summary(v_org_id),
      'value_realization', public._odse_value_realization_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_organizational_decision_support_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._odse_seed_decisions(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organizational decision support — structured recommendations with human approval.',
    'pending_review', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = v_org_id and status in ('proposed', 'under_review')
    ), 0),
    'high_confidence_pending', coalesce((
      select count(*) from public.organizational_decision_support_items
      where organization_id = v_org_id and status in ('proposed', 'under_review')
        and confidence_level = 'high'
    ), 0)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Audit allowlist extension
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
    'slce_commitment_created', 'slce_commitment_updated', 'slce_commitment_paused',
    'slce_commitment_retired', 'slce_performance_recorded', 'slce_alert_created',
    'slce_alert_acknowledged', 'slce_report_exported',
    'sce_campaign_created', 'sce_campaign_status_updated', 'sce_campaign_scheduled',
    'sce_campaign_published', 'sce_campaign_cancelled', 'sce_campaign_delivery_recorded',
    'sce_communication_outcome_recorded', 'sce_campaigns_exported',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-decision-support-engine', 'Organizational Decision Support Engine', 'Structured organizational decision recommendations with human review, approval, and outcome tracking.', 'authenticated', 84
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'organizational-decision-support-engine' and tenant_id is null);

grant execute on function public.propose_decision_recommendation(text, text, text, text, text, text, text, text, jsonb, jsonb) to authenticated;
grant execute on function public.review_decision(uuid, text) to authenticated;
grant execute on function public.approve_decision(uuid, text) to authenticated;
grant execute on function public.reject_decision(uuid, text) to authenticated;
grant execute on function public.mark_decision_implemented(uuid) to authenticated;
grant execute on function public.record_decision_outcome(uuid, text, jsonb, boolean) to authenticated;
grant execute on function public.export_decision_report(uuid) to authenticated;
grant execute on function public.get_executive_decision_summary() to authenticated;
grant execute on function public.get_organizational_decision_support_engine_dashboard() to authenticated;
grant execute on function public.get_organizational_decision_support_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._odse_seed_decisions(v_org_id);
  end loop;
end $$;
