-- Phase A.81 — Growth & Evolution Engine
-- Organizational ABOS engine for sustainable growth orchestration, learning cycles, and evolution recommendations.
-- Distinct from Evolution Governance (Phase 84), Capability Maturity (A.57), Organizational Health (A.56), and Learning Engine memory.

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
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'growth_evolution_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_growth_evolution_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_growth_evolution_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  focus_dimensions jsonb not null default '["operational","knowledge","human","customer","strategic"]'::jsonb,
  learning_cycle_cadence text not null default 'monthly' check (
    learning_cycle_cadence in ('weekly', 'biweekly', 'monthly', 'quarterly')
  ),
  celebrate_progress boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_growth_evolution_settings enable row level security;
revoke all on public.organization_growth_evolution_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_growth_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_growth_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension text not null check (
    dimension in ('operational', 'knowledge', 'human', 'customer', 'strategic')
  ),
  signal_type text not null check (
    signal_type in (
      'improvement_pattern', 'stagnation_risk', 'emerging_opportunity',
      'capability_development', 'healthy_adaptation'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  trend_direction text not null default 'stable' check (
    trend_direction in ('up', 'down', 'stable', 'emerging')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_growth_signals_org_idx
  on public.organization_growth_signals (organization_id, dimension, created_at desc);

alter table public.organization_growth_signals enable row level security;
revoke all on public.organization_growth_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_growth_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_growth_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  dimension text not null check (
    dimension in ('operational', 'knowledge', 'human', 'customer', 'strategic')
  ),
  title text not null check (char_length(title) <= 200),
  summary text not null check (char_length(summary) <= 500),
  evidence_summary text,
  trade_offs text,
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'high')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'deferred')
  ),
  requires_review boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_growth_recommendations_org_status_idx
  on public.organization_growth_recommendations (organization_id, status, created_at desc);

alter table public.organization_growth_recommendations enable row level security;
revoke all on public.organization_growth_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'growth_evolution_engine', v.description
from (values
  ('growth_evolution.view', 'View Growth & Evolution', 'View growth and evolution dashboard, signals, and recommendations'),
  ('growth_evolution.manage', 'Manage Growth & Evolution', 'Configure organization growth and evolution settings'),
  ('growth_evolution.recommendations.review', 'Review Growth Recommendations', 'Accept, dismiss, or defer growth evolution recommendations'),
  ('growth_evolution.export', 'Export Growth Reports', 'Export growth and evolution reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'growth_evolution.view'), ('owner', 'growth_evolution.manage'),
  ('owner', 'growth_evolution.recommendations.review'), ('owner', 'growth_evolution.export'),
  ('administrator', 'growth_evolution.view'), ('administrator', 'growth_evolution.manage'),
  ('administrator', 'growth_evolution.recommendations.review'), ('administrator', 'growth_evolution.export'),
  ('manager', 'growth_evolution.view'), ('manager', 'growth_evolution.recommendations.review'),
  ('manager', 'growth_evolution.export'),
  ('employee', 'growth_evolution.view'),
  ('support_agent', 'growth_evolution.view'),
  ('moderator', 'growth_evolution.view'),
  ('viewer', 'growth_evolution.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_gee_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._gee_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'gee_' || p_action_type,
    'growth_evolution_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._gee_ensure_settings(p_organization_id uuid)
returns public.organization_growth_evolution_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_growth_evolution_settings;
begin
  insert into public.organization_growth_evolution_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_growth_evolution_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._gee_growth_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'operational',
      'label', 'Operational',
      'description', 'Process efficiency, workflow maturity, and operational resilience.',
      'examples', jsonb_build_array(
        'Reduce recurring bottlenecks in support triage',
        'Strengthen handoffs between teams',
        'Improve response-time consistency without burnout'
      )
    ),
    jsonb_build_object(
      'key', 'knowledge',
      'label', 'Knowledge',
      'description', 'Learning assets, documentation quality, and institutional memory.',
      'examples', jsonb_build_array(
        'Close approved knowledge gaps from support patterns',
        'Refresh onboarding paths after process changes',
        'Capture lessons from completed improvements'
      )
    ),
    jsonb_build_object(
      'key', 'human',
      'label', 'Human',
      'description', 'Skills, wellbeing, collaboration, and sustainable capacity.',
      'examples', jsonb_build_array(
        'Balance ambition with wellbeing during growth pushes',
        'Develop cross-functional capabilities',
        'Celebrate progress without pressure or guilt'
      )
    ),
    jsonb_build_object(
      'key', 'customer',
      'label', 'Customer',
      'description', 'Experience quality, satisfaction trends, and value delivery.',
      'examples', jsonb_build_array(
        'Improve first-response quality on high-volume topics',
        'Align service levels with customer expectations',
        'Act on satisfaction trends with transparent trade-offs'
      )
    ),
    jsonb_build_object(
      'key', 'strategic',
      'label', 'Strategic',
      'description', 'Long-term direction, alignment, and intentional evolution.',
      'examples', jsonb_build_array(
        'Align initiatives with stated strategic priorities',
        'Evaluate emerging opportunities with evidence',
        'Adapt plans responsibly when context shifts'
      )
    )
  );
$$;

create or replace function public._gee_learning_cycle_steps()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('step', 1, 'key', 'observe', 'label', 'Observe', 'description', 'Notice patterns, signals, and context across dimensions.'),
    jsonb_build_object('step', 2, 'key', 'understand', 'label', 'Understand', 'description', 'Interpret signals with evidence — avoid assumptions.'),
    jsonb_build_object('step', 3, 'key', 'improve', 'label', 'Improve', 'description', 'Identify thoughtful improvements with trade-offs.'),
    jsonb_build_object('step', 4, 'key', 'implement', 'label', 'Implement', 'description', 'Execute inside approved limits with human approval.'),
    jsonb_build_object('step', 5, 'key', 'measure', 'label', 'Measure', 'description', 'Track outcomes with metadata — not surveillance.'),
    jsonb_build_object('step', 6, 'key', 'learn', 'label', 'Learn', 'description', 'Capture lessons for the next cycle.'),
    jsonb_build_object('step', 7, 'key', 'repeat', 'label', 'Repeat', 'description', 'Continue the cycle — progress, not perfection.')
  );
$$;

create or replace function public._gee_evolution_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'key', 'improvement_patterns',
      'label', 'Detect improvement patterns',
      'description', 'Surface recurring wins and repeatable practices.',
      'example_phrases', jsonb_build_array(
        'Aipify noticed a consistent improvement in response preparation.',
        'This workflow shows a repeatable pattern worth reinforcing.'
      )
    ),
    jsonb_build_object(
      'key', 'stagnation_risks',
      'label', 'Stagnation risks',
      'description', 'Identify areas where progress may be slowing.',
      'example_phrases', jsonb_build_array(
        'This area has not shown improvement over recent cycles.',
        'Stagnation risk detected — review when convenient, no pressure.'
      )
    ),
    jsonb_build_object(
      'key', 'emerging_opportunities',
      'label', 'Emerging opportunities',
      'description', 'Highlight growth opportunities with evidence.',
      'example_phrases', jsonb_build_array(
        'An emerging opportunity aligns with your strategic focus.',
        'Trend data suggests a thoughtful expansion may be worth exploring.'
      )
    ),
    jsonb_build_object(
      'key', 'capability_development',
      'label', 'Capability development',
      'description', 'Recommend skill and process maturity growth.',
      'example_phrases', jsonb_build_array(
        'Developing this capability could strengthen operational resilience.',
        'Cross-training here may reduce single-point dependencies.'
      )
    ),
    jsonb_build_object(
      'key', 'healthy_adaptation',
      'label', 'Healthy adaptation',
      'description', 'Guide responsible change when context shifts.',
      'example_phrases', jsonb_build_array(
        'Context has shifted — Aipify recommends a measured adaptation.',
        'A small adjustment now may prevent larger disruption later.'
      )
    )
  );
$$;

create or replace function public._gee_seed_data(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.organization_growth_signals
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.organization_growth_signals (
    organization_id, dimension, signal_type, summary, trend_direction, confidence, metadata
  ) values
    (p_organization_id, 'operational', 'improvement_pattern',
     'Support triage preparation time improved over the last two cycles.',
     'up', 'moderate', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge', 'stagnation_risk',
     'Three approved knowledge topics have not been refreshed in 90+ days.',
     'down', 'moderate', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human', 'healthy_adaptation',
     'Workload signals suggest pacing the next initiative wave.',
     'emerging', 'low', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer', 'emerging_opportunity',
     'Satisfaction trend on onboarding topics shows room for proactive guidance.',
     'emerging', 'moderate', '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'strategic', 'capability_development',
     'Decision support usage aligns with stated quarterly priorities.',
     'stable', 'high', '{"seed": true, "metadata_only": true}'::jsonb);

  insert into public.organization_growth_recommendations (
    organization_id, dimension, title, summary, evidence_summary, trade_offs,
    risk_level, status, requires_review, metadata
  ) values
    (p_organization_id, 'operational', 'Reinforce triage preparation rhythm',
     'Establish a lightweight weekly checkpoint for support readiness based on recent improvement patterns.',
     'Metadata shows faster triage preparation over two cycles without increased escalations.',
     'Adds a short weekly review — may be deferred during peak volume.',
     'low', 'pending', true, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'knowledge', 'Refresh stale knowledge topics',
     'Schedule review of three topics flagged as stagnant — human approval before publish.',
     'Knowledge gap metadata indicates topics unchanged beyond refresh threshold.',
     'Review time required from subject owners — prioritize highest-impact topics first.',
     'moderate', 'pending', true, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'human', 'Pace next growth initiative',
     'Defer one optional initiative to protect sustainable capacity this quarter.',
     'Adaptation signals suggest balancing ambition with wellbeing.',
     'Slower short-term velocity in exchange for sustainable team capacity.',
     'moderate', 'pending', true, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'customer', 'Proactive onboarding guidance',
     'Prepare onboarding guidance templates for high-volume topics showing emerging opportunity.',
     'Customer satisfaction metadata trend on onboarding-related categories.',
     'Template work upfront — reduces reactive support later.',
     'low', 'pending', true, '{"seed": true, "metadata_only": true}'::jsonb),
    (p_organization_id, 'strategic', 'Align Q initiatives with decision support',
     'Link active initiatives to decision support reviews for transparent trade-offs.',
     'Strategic alignment metadata and decision support usage patterns.',
     'Additional review meetings — clearer prioritization outcomes.',
     'low', 'pending', true, '{"seed": true, "metadata_only": true}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. list_growth_evolution_recommendations
-- ---------------------------------------------------------------------------
create or replace function public.list_growth_evolution_recommendations(p_status text default 'pending')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('growth_evolution.view');
  v_org_id := public._mta_require_organization();
  perform public._gee_seed_data(v_org_id);

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'dimension', r.dimension,
        'title', r.title,
        'summary', r.summary,
        'evidence_summary', r.evidence_summary,
        'trade_offs', r.trade_offs,
        'risk_level', r.risk_level,
        'status', r.status,
        'requires_review', r.requires_review,
        'metadata', r.metadata,
        'created_at', r.created_at,
        'updated_at', r.updated_at
      ) order by
        case r.risk_level when 'high' then 0 when 'moderate' then 1 else 2 end,
        r.created_at desc
    )
    from public.organization_growth_recommendations r
    where r.organization_id = v_org_id
      and (p_status is null or r.status = p_status)
  ), '[]'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. review_growth_evolution_recommendation
-- ---------------------------------------------------------------------------
create or replace function public.review_growth_evolution_recommendation(
  p_recommendation_id uuid,
  p_action text,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_growth_recommendations%rowtype;
  v_status text;
begin
  perform public._irp_require_permission('growth_evolution.recommendations.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  if p_action not in ('accept', 'dismiss', 'defer') then
    raise exception 'Invalid action — use accept, dismiss, or defer';
  end if;

  v_status := case p_action
    when 'accept' then 'accepted'
    when 'defer' then 'deferred'
    else 'dismissed'
  end;

  update public.organization_growth_recommendations set
    status = v_status,
    metadata = metadata || jsonb_build_object(
      'review_notes', coalesce(p_notes, ''),
      'reviewed_at', now(),
      'reviewed_by', v_user_id
    ),
    updated_at = now()
  where id = p_recommendation_id
    and organization_id = v_org_id
    and status = 'pending'
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Recommendation not found or not pending review';
  end if;

  perform public._gee_log(v_org_id, v_user_id, 'recommendation_' || v_status, jsonb_build_object(
    'recommendation_id', v_row.id,
    'dimension', v_row.dimension,
    'action', p_action,
    'metadata_only', true
  ));

  return jsonb_build_object(
    'id', v_row.id,
    'status', v_status,
    'dimension', v_row.dimension
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. update_growth_evolution_settings
-- ---------------------------------------------------------------------------
create or replace function public.update_growth_evolution_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_growth_evolution_settings;
begin
  perform public._irp_require_permission('growth_evolution.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gee_ensure_settings(v_org_id);

  update public.organization_growth_evolution_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    focus_dimensions = coalesce(p_payload->'focus_dimensions', focus_dimensions),
    learning_cycle_cadence = coalesce(nullif(trim(p_payload->>'learning_cycle_cadence'), ''), learning_cycle_cadence),
    celebrate_progress = coalesce((p_payload->>'celebrate_progress')::boolean, celebrate_progress),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_settings;

  perform public._gee_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'metadata_only', true,
    'enabled', v_settings.enabled,
    'learning_cycle_cadence', v_settings.learning_cycle_cadence
  ));

  return row_to_json(v_settings)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_evolution_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_pending int := 0;
  v_signals int := 0;
begin
  perform public._irp_require_permission('growth_evolution.view');
  v_org_id := public._mta_require_organization();
  perform public._gee_seed_data(v_org_id);

  select count(*) into v_pending
  from public.organization_growth_recommendations
  where organization_id = v_org_id and status = 'pending';

  select count(*) into v_signals
  from public.organization_growth_signals
  where organization_id = v_org_id
    and created_at >= now() - interval '30 days';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Growth means becoming better — not just doing more. Learn, improve thoughtfully, adapt responsibly.',
    'pending_recommendations', v_pending,
    'recent_signals', v_signals,
    'enabled', (select enabled from public.organization_growth_evolution_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_growth_evolution_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_growth_evolution_settings;
begin
  perform public._irp_require_permission('growth_evolution.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._gee_ensure_settings(v_org_id);
  perform public._gee_seed_data(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Growth means becoming better — not just doing more. Learn thoughtfully, improve responsibly, adapt strategically, and celebrate progress.',
    'mission', 'Guide sustainable organizational growth through continuous learning, adaptation, and improvement — with human control at every step.',
    'abos_principle', 'Success is the ongoing ability to learn, adapt, and improve — not a destination. Aipify orchestrates growth; humans decide.',
    'vision', 'A companion helping organizations evolve healthier — progress not perfection. A little better every day.',
    'distinction_note', 'Distinct from Evolution Governance (Phase 84 — change proposals at /app/evolution), Capability Maturity (A.57), Organizational Health (A.56), and Learning Engine customer memory (/app/learning).',
    'self_love_note', 'Self Love integration: sustainable growth, reflection, celebrate progress, detect stress, balance ambition and wellbeing.',
    'proactive_companion_note', 'Proactive Companion (A.79) may surface growth opportunities proactively — this engine governs growth orchestration and learning cycles.',
    'trust_engine_note', 'Trust Engine connection: every recommendation includes evidence, trade-offs, and risks — transparent and auditable.',
    'growth_dimensions', public._gee_growth_dimensions(),
    'learning_cycle_steps', public._gee_learning_cycle_steps(),
    'evolution_capabilities', public._gee_evolution_capabilities(),
    'settings', row_to_json(v_settings)::jsonb,
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'dimension', s.dimension,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'trend_direction', s.trend_direction,
          'confidence', s.confidence,
          'metadata', s.metadata,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from (
        select * from public.organization_growth_signals
        where organization_id = v_org_id
        order by created_at desc
        limit 10
      ) s
    ), '[]'::jsonb),
    'pending_recommendations', public.list_growth_evolution_recommendations('pending'),
    'summary', jsonb_build_object(
      'pending_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'accepted_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'accepted'
      ), 0),
      'recent_signals', coalesce((
        select count(*) from public.organization_growth_signals
        where organization_id = v_org_id
          and created_at >= now() - interval '30 days'
      ), 0),
      'focus_dimensions', jsonb_array_length(v_settings.focus_dimensions)
    ),
    'integration_links', jsonb_build_object(
      'proactive_companion', '/app/proactive-companion-engine',
      'continuous_improvement', '/app/continuous-improvement-engine',
      'organizational_health', '/app/organizational-health-engine',
      'capability_maturity', '/app/capability-maturity-engine',
      'learning', '/app/learning',
      'decisions', '/app/assistant/decisions',
      'approvals', '/app/approvals'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('growth_evolution.manage'),
      'can_review', public._irp_has_permission('growth_evolution.recommendations.review'),
      'can_export', public._irp_has_permission('growth_evolution.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_growth_evolution_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_growth_evolution_settings;
begin
  perform public._irp_require_permission('growth_evolution.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._gee_ensure_settings(v_org_id);
  perform public._gee_seed_data(v_org_id);

  perform public._gee_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'growth_evolution_engine',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Growth means becoming better — not just doing more.',
    'mission', 'Guide sustainable organizational growth through continuous learning, adaptation, and improvement.',
    'settings', row_to_json(v_settings)::jsonb,
    'growth_dimensions', public._gee_growth_dimensions(),
    'learning_cycle_steps', public._gee_learning_cycle_steps(),
    'evolution_capabilities', public._gee_evolution_capabilities(),
    'recent_signals', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'dimension', s.dimension,
          'signal_type', s.signal_type,
          'summary', s.summary,
          'trend_direction', s.trend_direction,
          'confidence', s.confidence,
          'created_at', s.created_at
        ) order by s.created_at desc
      )
      from public.organization_growth_signals s
      where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'recommendations', public.list_growth_evolution_recommendations(null),
    'summary', jsonb_build_object(
      'pending_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'pending'
      ), 0),
      'accepted_recommendations', coalesce((
        select count(*) from public.organization_growth_recommendations
        where organization_id = v_org_id and status = 'accepted'
      ), 0)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('growth_evolution.manage'),
      'can_review', public._irp_has_permission('growth_evolution.recommendations.review')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Audit allowlist extension
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
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
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
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%';
$$;

-- ---------------------------------------------------------------------------
-- 11. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'growth-evolution-engine', 'Growth & Evolution Engine',
  'Sustainable organizational growth orchestration — learning cycles, evolution signals, and transparent recommendations. ABOS Growth pillar.',
  'authenticated', 102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'growth-evolution-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_growth_evolution_engine_card() to authenticated;
grant execute on function public.get_growth_evolution_engine_dashboard() to authenticated;
grant execute on function public.list_growth_evolution_recommendations(text) to authenticated;
grant execute on function public.review_growth_evolution_recommendation(uuid, text, text) to authenticated;
grant execute on function public.update_growth_evolution_settings(jsonb) to authenticated;
grant execute on function public.export_growth_evolution_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 13. Seed settings + sample data per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._gee_ensure_settings(v_org_id);
    perform public._gee_seed_data(v_org_id);
  end loop;
end; $$;
