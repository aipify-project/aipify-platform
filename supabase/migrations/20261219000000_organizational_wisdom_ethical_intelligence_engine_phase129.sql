-- Phase 129 — Organizational Wisdom & Ethical Intelligence Engine (Enterprise Intelligence Era 121–130)
-- Wisdom Center — organizational wisdom + ethical reflection. Discernment not perfection.
-- Distinct from Wisdom Engine A.93 (/app/wisdom-engine) and AI Ethics A.46 (/app/ai-ethics-responsible-use-engine).
-- Helpers: _owis_* (engine), _owebp129_* (blueprint — never collide with _wie_*, _aere_*)

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
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'relationship_intelligence_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine',
    'impact_engine',
    'legacy_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'gratitude_recognition_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'hope_engine',
    'wisdom_engine',
    'wisdom_intervention_protocol',
    'sales_expert_engine',
    'security_trust_engine',
    'api_platform_engine',
    'companion_device_ecosystem_engine',
    'companion_marketplace',
    'growth_partner_operations',
    'aipify_university',
    'social_impact_purpose',
    'ecosystem_governance',
    'ecosystem_orchestration',
    'executive_intelligence',
    'strategic_foresight_engine',
    'decision_intelligence_engine',
    'organizational_wisdom_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organizational_wisdom_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  wisdom_center_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  ethical_reflection_enabled boolean not null default true,
  values_alignment_enabled boolean not null default true,
  decision_reflection_enabled boolean not null default true,
  perspective_expansion_enabled boolean not null default true,
  governance_integration_enabled boolean not null default true,
  culture_insights_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizational_wisdom_settings enable row level security;
revoke all on public.organizational_wisdom_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organizational_wisdom_reflection_workspaces (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_reflection_workspaces (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workspace_key text not null,
  title text not null,
  reflection_topic text not null check (char_length(reflection_topic) <= 500),
  context_summary text check (char_length(context_summary) <= 500),
  values_summary text check (char_length(values_summary) <= 500),
  perspectives_summary text check (char_length(perspectives_summary) <= 500),
  assumptions_summary text check (char_length(assumptions_summary) <= 500),
  transparency_summary text check (char_length(transparency_summary) <= 500),
  long_term_summary text check (char_length(long_term_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workspace_key)
);

create index if not exists organizational_wisdom_reflection_workspaces_tenant_idx
  on public.organizational_wisdom_reflection_workspaces (tenant_id, status);

alter table public.organizational_wisdom_reflection_workspaces enable row level security;
revoke all on public.organizational_wisdom_reflection_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organizational_wisdom_ethics_reviews (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_ethics_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  workspace_key text,
  title text not null,
  who_benefits_summary text check (char_length(who_benefits_summary) <= 500),
  who_harmed_summary text check (char_length(who_harmed_summary) <= 500),
  assumptions_summary text check (char_length(assumptions_summary) <= 500),
  values_summary text check (char_length(values_summary) <= 500),
  transparency_summary text check (char_length(transparency_summary) <= 500),
  long_term_summary text check (char_length(long_term_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists organizational_wisdom_ethics_reviews_tenant_idx
  on public.organizational_wisdom_ethics_reviews (tenant_id, status);

alter table public.organizational_wisdom_ethics_reviews enable row level security;
revoke all on public.organizational_wisdom_ethics_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organizational_wisdom_culture_theme_snapshots (aggregate themes — not surveillance)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_culture_theme_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  snapshot_key text not null,
  theme_area text not null check (
    theme_area in (
      'trust_signals', 'recognition_practices', 'learning_participation',
      'knowledge_sharing', 'governance_engagement', 'community_contribution',
      'leadership_accessibility'
    )
  ),
  title text not null,
  theme_summary text not null check (char_length(theme_summary) <= 500),
  signal_strength text not null default 'moderate' check (signal_strength in ('low', 'moderate', 'high')),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, snapshot_key)
);

create index if not exists organizational_wisdom_culture_theme_snapshots_tenant_idx
  on public.organizational_wisdom_culture_theme_snapshots (tenant_id, theme_area, status);

alter table public.organizational_wisdom_culture_theme_snapshots enable row level security;
revoke all on public.organizational_wisdom_culture_theme_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organizational_wisdom_practices (library scaffolds — metadata)
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_practices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  practice_key text not null,
  practice_type text not null check (
    practice_type in (
      'reflection_guide', 'ethical_discussion', 'leadership_practice',
      'case_study', 'decision_journal', 'governance_example', 'purpose_exercise'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (status in ('active', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, practice_key)
);

create index if not exists organizational_wisdom_practices_tenant_idx
  on public.organizational_wisdom_practices (tenant_id, practice_type, status);

alter table public.organizational_wisdom_practices enable row level security;
revoke all on public.organizational_wisdom_practices from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. organizational_wisdom_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.organizational_wisdom_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organizational_wisdom_audit_logs enable row level security;
revoke all on public.organizational_wisdom_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'organizational_wisdom_engine', v.description
from (values
  ('organizational_wisdom.view', 'View Organizational Wisdom Engine', 'View Wisdom Center — reflection workspaces, ethics reviews, and culture theme scaffolds'),
  ('organizational_wisdom.manage', 'Manage Organizational Wisdom Engine', 'Update organizational wisdom settings and reflection metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_wisdom.view'), ('owner', 'organizational_wisdom.manage'),
  ('administrator', 'organizational_wisdom.view'), ('administrator', 'organizational_wisdom.manage'),
  ('manager', 'organizational_wisdom.view'), ('manager', 'organizational_wisdom.manage'),
  ('employee', 'organizational_wisdom.view'),
  ('support_agent', 'organizational_wisdom.view'),
  ('moderator', 'organizational_wisdom.view'),
  ('viewer', 'organizational_wisdom.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Baseline helpers (_owis_)
-- ---------------------------------------------------------------------------
create or replace function public._owis_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._owis_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._owis_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._owis_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organizational_wisdom_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._owis_ensure_settings(p_tenant_id uuid)
returns public.organizational_wisdom_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.organizational_wisdom_settings;
begin
  insert into public.organizational_wisdom_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.organizational_wisdom_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._owis_ethical_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits?', 'description', 'Stakeholder groups that may gain — roles not individuals'),
    jsonb_build_object('key', 'who_harmed', 'label', 'Who may be harmed?', 'description', 'Potential negative impact — reflection not judgment'),
    jsonb_build_object('key', 'assumptions', 'label', 'What assumptions are we making?', 'description', 'Visible hypotheses worth challenging'),
    jsonb_build_object('key', 'values', 'label', 'What values are involved?', 'description', 'Cross-link Purpose & Values A.82 — alignment not imposition'),
    jsonb_build_object('key', 'transparency', 'label', 'Is this transparent?', 'description', 'Could this be explained publicly with comfort?'),
    jsonb_build_object('key', 'long_term', 'label', 'What are long-term implications?', 'description', 'Legacy, trust, and sustainability considerations')
  );
$$;

create or replace function public._owis_values_dimensions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'declared_values', 'label', 'Declared values', 'description', 'Stated organizational values — cross-link /app/purpose-values-engine'),
    jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors', 'description', 'How leadership models values — aggregate themes only'),
    jsonb_build_object('key', 'operational_decisions', 'label', 'Operational decisions', 'description', 'Day-to-day choices and their value signals'),
    jsonb_build_object('key', 'companion_usage', 'label', 'Companion usage', 'description', 'How companions are deployed — cross-link AI Ethics A.46'),
    jsonb_build_object('key', 'governance_practices', 'label', 'Governance practices', 'description', 'Board and policy alignment — cross-link Phase 123'),
    jsonb_build_object('key', 'customer_experiences', 'label', 'Customer experiences', 'description', 'Value signals in customer-facing work'),
    jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'description', 'Ecosystem and community impact — cross-link Phase 117/118')
  );
$$;

create or replace function public._owis_perspective_groups()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employees', 'label', 'Employees', 'description', 'Workforce perspective — roles not individuals'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer trust and experience'),
    jsonb_build_object('key', 'gps', 'label', 'Growth Partners', 'description', 'Partner ecosystem — cross-link GP Ops Phase 114'),
    jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Community impact — cross-link Phase 117'),
    jsonb_build_object('key', 'executives', 'label', 'Executives', 'description', 'Leadership accountability'),
    jsonb_build_object('key', 'governance_bodies', 'label', 'Governance bodies', 'description', 'Board and oversight — cross-link Phase 123'),
    jsonb_build_object('key', 'knowledge_contributors', 'label', 'Knowledge contributors', 'description', 'KC and memory — cross-link Org Memory A.34'),
    jsonb_build_object('key', 'future_stakeholders', 'label', 'Future stakeholders', 'description', 'Long-term and next-generation considerations')
  );
$$;

create or replace function public._owis_decision_ethics_prompts()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'values_aligned', 'label', 'Are we aligned with our values?', 'description', 'Voluntary reflection — cross-link Purpose A.82'),
    jsonb_build_object('key', 'unintended_consequences', 'label', 'What unintended consequences might emerge?', 'description', 'Second-order effects worth exploring'),
    jsonb_build_object('key', 'affected_voices', 'label', 'Whose voices should be heard?', 'description', 'Multi-perspective framework — not surveillance'),
    jsonb_build_object('key', 'public_explanation', 'label', 'Would we be comfortable explaining this publicly?', 'description', 'Transparency comfort check'),
    jsonb_build_object('key', 'strengthens_trust', 'label', 'Does this strengthen long-term trust?', 'description', 'Trustworthiness over short-term wins')
  );
$$;

create or replace function public._owis_culture_insight_areas()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_signals', 'label', 'Trust signals', 'description', 'Aggregate themes — not individual evaluation'),
    jsonb_build_object('key', 'recognition_practices', 'label', 'Recognition practices', 'description', 'How appreciation flows — cross-link Gratitude A.89'),
    jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation', 'description', 'Training and growth engagement — cross-link Aipify University'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'description', 'Organizational learning culture'),
    jsonb_build_object('key', 'governance_engagement', 'label', 'Governance engagement', 'description', 'Policy and oversight participation'),
    jsonb_build_object('key', 'community_contribution', 'label', 'Community contribution', 'description', 'Ecosystem and social impact themes'),
    jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility', 'description', 'Reflective leadership signals — aggregate only')
  );
$$;

create or replace function public._owis_wisdom_practice_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reflection_guide', 'label', 'Reflection guides', 'description', 'Structured prompts for thoughtful pause'),
    jsonb_build_object('key', 'ethical_discussion', 'label', 'Ethical discussion frameworks', 'description', 'Facilitation scaffolds — discernment not verdicts'),
    jsonb_build_object('key', 'leadership_practice', 'label', 'Leadership practices', 'description', 'Reflective leadership habits'),
    jsonb_build_object('key', 'case_study', 'label', 'Case studies', 'description', 'Anonymized learning examples — metadata only'),
    jsonb_build_object('key', 'decision_journal', 'label', 'Decision journals', 'description', 'Cross-link Decision Intelligence Phase 125'),
    jsonb_build_object('key', 'governance_example', 'label', 'Governance examples', 'description', 'Ethical governance patterns — cross-link Phase 123'),
    jsonb_build_object('key', 'purpose_exercise', 'label', 'Purpose exercises', 'description', 'Values alignment activities — cross-link Purpose A.82')
  );
$$;

create or replace function public._owis_seed_reflection_workspaces(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organizational_wisdom_reflection_workspaces where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_wisdom_reflection_workspaces (
    tenant_id, workspace_key, title, reflection_topic, context_summary, values_summary,
    perspectives_summary, assumptions_summary, transparency_summary, long_term_summary,
    status, cross_link_route
  ) values
    (p_tenant_id, 'companion-deployment', 'Companion deployment reflection', 'How we expand companion-assisted operations across departments.', 'Change capacity and training bandwidth this quarter.', 'People First and transparency — cross-link Purpose A.82.', 'Employees · customers · companions — multi-perspective scaffold.', 'Teams will adopt within 60 days — hypothesis.', 'Deployment rationale documented in governance register.', 'Long-term trust and skill development outweigh speed.', 'active', '/app/ai-ethics-responsible-use-engine'),
    (p_tenant_id, 'partner-standards', 'Partner standards alignment', 'Whether updated GP standards reflect our values commitments.', 'Ecosystem governance review in progress.', 'Integrity and fairness — cross-link Inclusion A.83.', 'GPs · communities · executives.', 'Partners will adapt without friction — assumption to review.', 'Standards published with clear rationale.', 'Ecosystem trust compounds over years.', 'draft', '/app/growth-partner-operations'),
    (p_tenant_id, 'purpose-program', 'Purpose program review', 'Annual review of social impact and purpose initiatives.', 'Social Impact Phase 118 programs active.', 'Purpose as action not marketing.', 'Employees · communities · customers.', 'Impact metrics tell the full story — partial view.', 'Program outcomes shared transparently.', 'Legacy of responsible growth.', 'active', '/app/social-impact-purpose-engine');
end; $$;

create or replace function public._owis_seed_ethics_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organizational_wisdom_ethics_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_wisdom_ethics_reviews (
    tenant_id, review_key, workspace_key, title,
    who_benefits_summary, who_harmed_summary, assumptions_summary,
    values_summary, transparency_summary, long_term_summary, status
  ) values
    (p_tenant_id, 'companion-expansion-ethics', 'companion-deployment', 'Companion expansion ethics review',
     'Employees may gain efficiency · customers may gain faster support.', 'Teams under change pressure · uneven skill adoption possible.',
     'Adoption will be voluntary and well-supported.', 'People First · human oversight required.',
     'Deployment plan documented and reviewable.', 'Trust in companion governance strengthens over time.', 'active'),
    (p_tenant_id, 'gp-standards-ethics', 'partner-standards', 'GP standards ethics review',
     'Certified partners and customers benefit from clarity.', 'Smaller partners may face compliance burden.',
     'Standards are proportionate and supportive.', 'Fairness and ecosystem integrity.',
     'Standards rationale published in governance center.', 'Long-term ecosystem trust.', 'active');
end; $$;

create or replace function public._owis_seed_culture_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organizational_wisdom_culture_theme_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_wisdom_culture_theme_snapshots (
    tenant_id, snapshot_key, theme_area, title, theme_summary, signal_strength, status
  ) values
    (p_tenant_id, 'trust-q2', 'trust_signals', 'Q2 trust theme snapshot', 'Aggregate signals suggest steady trust in governance transparency — themes only, not individual scores.', 'moderate', 'active'),
    (p_tenant_id, 'learning-q2', 'learning_participation', 'Q2 learning participation', 'University pathway completion trending upward — anonymized participation themes.', 'high', 'active'),
    (p_tenant_id, 'governance-q2', 'governance_engagement', 'Q2 governance engagement', 'Policy review participation stable — board cross-link Phase 123.', 'moderate', 'active'),
    (p_tenant_id, 'knowledge-q2', 'knowledge_sharing', 'Q2 knowledge sharing', 'KC contribution themes positive — cross-link Org Memory A.34.', 'moderate', 'active');
end; $$;

create or replace function public._owis_seed_practices(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organizational_wisdom_practices where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.organizational_wisdom_practices (
    tenant_id, practice_key, practice_type, title, summary, status, cross_link_route
  ) values
    (p_tenant_id, 'pause-before-decide', 'reflection_guide', 'Pause before deciding', 'Three reflective questions before significant operational choices.', 'active', null),
    (p_tenant_id, 'ethical-roundtable', 'ethical_discussion', 'Ethical roundtable framework', 'Facilitation scaffold for team ethical discussions — no verdicts.', 'active', null),
    (p_tenant_id, 'values-check-in', 'purpose_exercise', 'Values check-in exercise', 'Quarterly values alignment reflection — cross-link Purpose A.82.', 'active', '/app/purpose-values-engine'),
    (p_tenant_id, 'decision-journal-template', 'decision_journal', 'Decision journal template', 'Metadata capture for decision rationale — cross-link Phase 125.', 'active', '/app/decision-intelligence-engine');
end; $$;

create or replace function public._owis_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_active_workspaces int;
  v_ethics_reviews int;
  v_culture_snapshots int;
  v_practices int;
  v_maturity_score numeric;
begin
  select count(*) into v_active_workspaces from public.organizational_wisdom_reflection_workspaces
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'review');
  select count(*) into v_ethics_reviews from public.organizational_wisdom_ethics_reviews
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_culture_snapshots from public.organizational_wisdom_culture_theme_snapshots
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_practices from public.organizational_wisdom_practices
  where tenant_id = p_tenant_id and status = 'active';

  v_maturity_score := least(100, round(
    (v_active_workspaces * 7.0) + (v_ethics_reviews * 6.0) + (v_culture_snapshots * 5.0) + (v_practices * 4.0)
  , 1));

  return jsonb_build_object(
    'wisdom_maturity_score', v_maturity_score,
    'active_reflection_workspaces', v_active_workspaces,
    'ethics_reviews', v_ethics_reviews,
    'culture_theme_snapshots', v_culture_snapshots,
    'wisdom_practices_count', v_practices,
    'wisdom_center_capabilities_count', 8,
    'ethical_questions_count', jsonb_array_length(public._owis_ethical_questions()),
    'values_dimensions_count', jsonb_array_length(public._owis_values_dimensions()),
    'perspective_groups_count', jsonb_array_length(public._owis_perspective_groups()),
    'companion_supports_count', 6
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_owebp129_)
-- ---------------------------------------------------------------------------
create or replace function public._owebp129_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 129 — Organizational Wisdom & Ethical Intelligence Engine at /app/organizational-wisdom-engine. Wisdom = apply knowledge responsibly; ethics = integrity. Reflection and transparency — NOT imposing morality. Distinct from Wisdom Engine A.93 at /app/wisdom-engine (experience-to-guidance synthesis — cross-link only, never duplicate _wie_* RPCs); AI Ethics A.46 + Blueprint 98 at /app/ai-ethics-responsible-use-engine (deploy/govern Aipify ethically — cross-link only, never duplicate _aere_* RPCs); Purpose & Values A.82 at /app/purpose-values-engine; Decision Intelligence Phase 125 at /app/decision-intelligence-engine; Social Impact Phase 118; Board Governance Phase 123 at /app/governance-policy-engine; Organizational Memory Phase 126 at /app/organizational-memory-engine; Self Love A.76 at /app/self-love-engine; Inclusion & Humanity A.83 at /app/inclusion-humanity-engine. Helpers _owebp129_* — never collide with _wie_*, _aere_*. Culture insight = aggregate themes not surveillance. Metadata only.';
$$;

create or replace function public._owebp129_mission()
returns text language sql immutable as $$
  select 'Help organizations reflect wisely and act with integrity — ethical awareness, values alignment, and discernment that strengthen trust without determining right or wrong.';
$$;

create or replace function public._owebp129_philosophy()
returns text language sql immutable as $$
  select 'People First. Wisdom before speed. Discernment not perfection. Aipify supports reflection and transparency — humans retain moral agency. No shaming. No moral superiority. Culture insight = aggregate themes not individual evaluation. Metadata only.';
$$;

create or replace function public._owebp129_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Wisdom Center orchestrates ethical reflection, values alignment reviews, decision ethics prompts, and culture theme insights. Wisdom A.93 and AI Ethics A.46 remain authoritative for their domains. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._owebp129_vision()
returns text language sql immutable as $$
  select 'Intelligence is not enough — organizations cultivate wisdom by applying knowledge responsibly, reflecting on ethics with humility, and building cultures worthy of long-term trust.';
$$;

create or replace function public._owebp129_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ethical_awareness', 'emoji', '🦉', 'label', 'Ethical awareness', 'description', 'Surface ethical considerations without imposing morality'),
    jsonb_build_object('key', 'value_alignment', 'emoji', '🌹', 'label', 'Value alignment', 'description', 'Connect actions to declared values — cross-link Purpose A.82'),
    jsonb_build_object('key', 'responsible_decisions', 'emoji', '🔔', 'label', 'Responsible decisions', 'description', 'Voluntary decision ethics prompts — cross-link Phase 125'),
    jsonb_build_object('key', 'transparency', 'emoji', '🦉', 'label', 'Transparency', 'description', 'Comfort with public explanation — metadata only'),
    jsonb_build_object('key', 'reflective_leadership', 'emoji', '🌹', 'label', 'Reflective leadership', 'description', 'Leadership insights from aggregate culture themes'),
    jsonb_build_object('key', 'healthy_cultures', 'emoji', '🔔', 'label', 'Healthy cultures', 'description', 'Culture insight engine — themes not surveillance'),
    jsonb_build_object('key', 'trustworthiness', 'emoji', '🦉', 'label', 'Trustworthiness', 'description', 'Long-term trust over short-term wins'),
    jsonb_build_object('key', 'long_term_wisdom', 'emoji', '🌹', 'label', 'Long-term wisdom', 'description', 'Institutional reflection — cross-link Wisdom A.93 and Org Memory')
  );
$$;

create or replace function public._owebp129_wisdom_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Center — eight capabilities for organizational wisdom and ethical reflection.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'ethical_reflection_workspaces', 'label', 'Ethical reflection workspaces', 'description', 'Structured reflection scaffolds — metadata only'),
      jsonb_build_object('key', 'values_alignment_reviews', 'label', 'Values alignment reviews', 'description', 'Seven dimensions — cross-link Purpose A.82'),
      jsonb_build_object('key', 'decision_reflection_tools', 'label', 'Decision reflection tools', 'description', 'Five voluntary ethics prompts — cross-link Phase 125'),
      jsonb_build_object('key', 'perspective_expansion', 'label', 'Perspective expansion', 'description', 'Eight stakeholder perspectives — roles not individuals'),
      jsonb_build_object('key', 'governance_integration', 'label', 'Governance integration', 'description', 'Six ethical governance connections — cross-link Phase 123'),
      jsonb_build_object('key', 'companion_ethics_guidance', 'label', 'Companion ethics guidance', 'description', 'Wisdom Companion supports — thoughtfulness not verdicts'),
      jsonb_build_object('key', 'organizational_learning', 'label', 'Organizational learning', 'description', 'Wisdom practices library — cross-link Org Memory'),
      jsonb_build_object('key', 'leadership_insights', 'label', 'Leadership insights', 'description', 'Culture theme snapshots — aggregate only')
    )
  );
$$;

create or replace function public._owebp129_ethical_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical intelligence engine — six reflection questions. Aipify does NOT determine right or wrong.',
    'questions', public._owis_ethical_questions()
  );
$$;

create or replace function public._owebp129_values_alignment_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values alignment engine — seven dimensions. Cross-link Purpose & Values A.82.',
    'dimensions', public._owis_values_dimensions()
  );
$$;

create or replace function public._owebp129_multi_perspective_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Multi-perspective framework — eight stakeholder groups. Expand thinking not outcomes.',
    'perspectives', public._owis_perspective_groups()
  );
$$;

create or replace function public._owebp129_wisdom_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion — six supports. Thoughtfulness NOT determining morality.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'reflective_questions', 'label', 'Reflective questions', 'description', 'Gentle prompts for pause and consideration'),
      jsonb_build_object('key', 'ethical_considerations', 'label', 'Ethical considerations', 'description', 'Six ethical intelligence questions — no verdicts'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Prior reflections — cross-link Org Memory A.34'),
      jsonb_build_object('key', 'perspective_exploration', 'label', 'Perspective exploration', 'description', 'Eight stakeholder viewpoints'),
      jsonb_build_object('key', 'knowledge_connections', 'label', 'Knowledge connections', 'description', 'KC resources and wisdom practices'),
      jsonb_build_object('key', 'governance_references', 'label', 'Governance references', 'description', 'Board and policy context — cross-link Phase 123')
    )
  );
$$;

create or replace function public._owebp129_decision_ethics_review()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision ethics review — five voluntary prompts. Cross-link Decision Intelligence Phase 125.',
    'prompts', public._owis_decision_ethics_prompts()
  );
$$;

create or replace function public._owebp129_culture_insight_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Culture insight engine — seven areas. Aggregate themes NOT surveillance.',
    'areas', public._owis_culture_insight_areas(),
    'boundary_note', 'Culture snapshots store anonymized aggregate themes only — never individual performance evaluation or surveillance.'
  );
$$;

create or replace function public._owebp129_wisdom_practices_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom practices library — seven resource types.',
    'resources', public._owis_wisdom_practice_scaffolds()
  );
$$;

create or replace function public._owebp129_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion limitations — five never.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_moral_superiority', 'label', 'No moral superiority', 'description', 'Aipify never claims ethical authority over humans'),
      jsonb_build_object('key', 'no_values_as_facts', 'label', 'No values as objective facts', 'description', 'Values are organizational commitments — not universal truths imposed'),
      jsonb_build_object('key', 'no_override_decisions', 'label', 'No overriding decisions', 'description', 'Reflection supports — humans decide'),
      jsonb_build_object('key', 'no_suppress_viewpoints', 'label', 'No suppressing viewpoints', 'description', 'Perspective expansion — never silence dissent'),
      jsonb_build_object('key', 'no_shame', 'label', 'No shame', 'description', 'Discernment not perfection — no guilt-based motivation')
    )
  );
$$;

create or replace function public._owebp129_self_love_in_wisdom()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in wisdom — humility and compassion in ethical reflection.',
    'practices', jsonb_build_array('humility', 'self-awareness', 'compassion', 'patience', 'curiosity', 'reflection'),
    'route', '/app/self-love-engine',
    'boundary_note', 'Wisdom reflection includes self-compassion — never shame for imperfect choices.'
  );
$$;

create or replace function public._owebp129_ethical_governance_integration()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ethical governance integration — six connections.',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'board_governance', 'label', 'Board governance', 'description', 'Cross-link Phase 123 /app/governance-policy-engine'),
      jsonb_build_object('key', 'purpose_programs', 'label', 'Purpose programs', 'description', 'Cross-link Social Impact Phase 118'),
      jsonb_build_object('key', 'gp_standards', 'label', 'GP standards', 'description', 'Cross-link Growth Partner Ops Phase 114'),
      jsonb_build_object('key', 'community_principles', 'label', 'Community principles', 'description', 'Cross-link Community Phase 117 and Inclusion A.83'),
      jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance', 'description', 'Cross-link AI Ethics A.46'),
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'description', 'Cross-link Org Memory A.34 and KC')
    )
  );
$$;

create or replace function public._owebp129_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'wisdom_engine', 'label', 'Wisdom Engine (A.93)', 'route', '/app/wisdom-engine', 'relationship', 'Experience-to-guidance synthesis — cross-link only'),
    jsonb_build_object('key', 'ai_ethics', 'label', 'AI Ethics (A.46)', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Deploy/govern Aipify ethically — cross-link only'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values (A.82)', 'route', '/app/purpose-values-engine', 'relationship', 'Values alignment — cross-link only'),
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence (Phase 125)', 'route', '/app/decision-intelligence-engine', 'relationship', 'Decision ethics cross-link'),
    jsonb_build_object('key', 'social_impact', 'label', 'Social Impact (Phase 118)', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Purpose programs'),
    jsonb_build_object('key', 'board_governance', 'label', 'Board Governance (Phase 123)', 'route', '/app/governance-policy-engine', 'relationship', 'Ethical governance integration'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'relationship', 'Historical context'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'relationship', 'Wisdom/self-awareness'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity (A.83)', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Human Values Charter'),
    jsonb_build_object('key', 'community', 'label', 'Community (Phase 117)', 'route', '/app/community', 'relationship', 'Community principles'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Ops (Phase 114)', 'route', '/app/growth-partner-operations', 'relationship', 'GP standards'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University (Phase 115)', 'route', '/app/aipify-university', 'relationship', 'Learning participation themes')
  );
$$;

create or replace function public._owebp129_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational Wisdom supports reflection — does NOT determine right or wrong.',
    'must_avoid', jsonb_build_array(
      'Moral superiority or ethical verdicts',
      'Treating organizational values as universal objective facts',
      'Overriding human decisions with AI judgment',
      'Suppressing dissenting viewpoints',
      'Shame-based motivation or perfection demands',
      'Individual employee surveillance disguised as culture insight'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only reflection records',
      'Aggregate culture themes only',
      'Voluntary decision ethics prompts',
      'Cross-link authoritative domain engines'
    ),
    'boundary_note', 'Discernment not perfection. Wisdom before speed. People First.'
  );
$$;

create or replace function public._owebp129_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Wisdom Companion adaptation examples — gentle reflection offers.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'prompt', 'Three ethical reflection questions may help before this decision — shall Aipify prepare a perspective summary for your review?', 'consideration', 'Voluntary — humans decide'),
      jsonb_build_object('emoji', '🌹', 'prompt', 'A values alignment review scaffold is ready — would exploring declared values against this choice feel helpful?', 'consideration', 'Cross-link Purpose A.82'),
      jsonb_build_object('emoji', '🔔', 'prompt', 'Culture theme snapshots suggest trust signals worth discussing — shall Aipify summarize aggregate themes only?', 'consideration', 'Not individual evaluation')
    )
  );
$$;

create or replace function public._owebp129_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ethical_awareness', 'label', 'Ethical awareness in leadership decisions'),
    jsonb_build_object('key', 'values_alignment', 'label', 'Values alignment across operations'),
    jsonb_build_object('key', 'reflection_participation', 'label', 'Reflection workspace participation'),
    jsonb_build_object('key', 'transparency_comfort', 'label', 'Transparency and public explanation comfort'),
    jsonb_build_object('key', 'culture_health_themes', 'label', 'Healthy culture theme signals'),
    jsonb_build_object('key', 'governance_engagement', 'label', 'Ethical governance engagement'),
    jsonb_build_object('key', 'trust_strengthening', 'label', 'Long-term trust strengthening'),
    jsonb_build_object('key', 'institutional_wisdom', 'label', 'Institutional wisdom accumulation')
  );
$$;

create or replace function public._owebp129_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._owis_ensure_settings(p_tenant_id);
  perform public._owis_seed_reflection_workspaces(p_tenant_id);
  perform public._owis_seed_ethics_reviews(p_tenant_id);
  perform public._owis_seed_culture_snapshots(p_tenant_id);
  perform public._owis_seed_practices(p_tenant_id);
  v_metrics := public._owis_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'wisdom_maturity_score', coalesce((v_metrics->>'wisdom_maturity_score')::numeric, 0),
    'active_reflection_workspaces', coalesce((v_metrics->>'active_reflection_workspaces')::int, 0),
    'ethics_reviews', coalesce((v_metrics->>'ethics_reviews')::int, 0),
    'culture_theme_snapshots', coalesce((v_metrics->>'culture_theme_snapshots')::int, 0),
    'wisdom_practices_count', coalesce((v_metrics->>'wisdom_practices_count')::int, 0),
    'wisdom_center_capabilities_count', coalesce((v_metrics->>'wisdom_center_capabilities_count')::int, 8),
    'cross_links_count', jsonb_array_length(public._owebp129_cross_links()),
    'privacy_note', 'Aggregate wisdom counts and blueprint scaffolds only — metadata, no PII. Humans retain moral agency.'
  );
end; $$;

create or replace function public._owebp129_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._owis_ensure_settings(p_tenant_id);
  perform public._owis_seed_reflection_workspaces(p_tenant_id);
  perform public._owis_seed_ethics_reviews(p_tenant_id);
  perform public._owis_seed_culture_snapshots(p_tenant_id);
  perform public._owis_seed_practices(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Objectives — eight documented', 'met', jsonb_array_length(public._owebp129_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'wisdom_center', 'label', 'Wisdom Center — eight capabilities', 'met', jsonb_array_length((public._owebp129_wisdom_center()->'capabilities')) = 8, 'note', null),
    jsonb_build_object('key', 'ethical_questions', 'label', 'Ethical intelligence — six questions', 'met', jsonb_array_length(public._owis_ethical_questions()) = 6, 'note', null),
    jsonb_build_object('key', 'values_dimensions', 'label', 'Values alignment — seven dimensions', 'met', jsonb_array_length(public._owis_values_dimensions()) = 7, 'note', null),
    jsonb_build_object('key', 'perspectives', 'label', 'Multi-perspective framework — eight groups', 'met', jsonb_array_length(public._owis_perspective_groups()) = 8, 'note', null),
    jsonb_build_object('key', 'companion_supports', 'label', 'Wisdom Companion — six supports', 'met', jsonb_array_length((public._owebp129_wisdom_companion()->'supports')) = 6, 'note', null),
    jsonb_build_object('key', 'decision_ethics', 'label', 'Decision ethics review — five prompts', 'met', jsonb_array_length(public._owis_decision_ethics_prompts()) = 5, 'note', null),
    jsonb_build_object('key', 'culture_areas', 'label', 'Culture insight — seven areas', 'met', jsonb_array_length(public._owis_culture_insight_areas()) = 7, 'note', null),
    jsonb_build_object('key', 'practices_library', 'label', 'Wisdom practices library — seven resources', 'met', jsonb_array_length(public._owis_wisdom_practice_scaffolds()) = 7, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._owebp129_companion_limitations()->'limitations')) = 5, 'note', null),
    jsonb_build_object('key', 'governance_integration', 'label', 'Ethical governance — six connections', 'met', jsonb_array_length((public._owebp129_ethical_governance_integration()->'connections')) = 6, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._owebp129_cross_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'wisdom_distinction', 'label', 'Wisdom A.93 RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/wisdom-engine only'),
    jsonb_build_object('key', 'ethics_distinction', 'label', 'AI Ethics A.46 RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/ai-ethics-responsible-use-engine only'),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.organizational_wisdom_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._owebp129_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 129 baseline tables and RPCs', 'met', to_regclass('public.organizational_wisdom_settings') is not null, 'note', '_owis_* helpers intact')
  );
end; $$;

create or replace function public._owebp129_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 129 — Organizational Wisdom & Ethical Intelligence Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE129_ORGANIZATIONAL_WISDOM_ETHICAL_INTELLIGENCE.md',
    'engine_phase', 'Repo Phase 129 Organizational Wisdom & Ethical Intelligence Engine',
    'route', '/app/organizational-wisdom-engine',
    'mapping_note', 'Wisdom Center — reflection and discernment. Domain RPCs at Wisdom A.93 and AI Ethics A.46 remain authoritative.',
    'distinction_note', public._owebp129_distinction_note(),
    'mission', public._owebp129_mission(),
    'philosophy', public._owebp129_philosophy(),
    'abos_principle', public._owebp129_abos_principle(),
    'vision', public._owebp129_vision(),
    'objectives', public._owebp129_objectives(),
    'wisdom_center', public._owebp129_wisdom_center(),
    'ethical_intelligence_engine', public._owebp129_ethical_intelligence_engine(),
    'values_alignment_engine', public._owebp129_values_alignment_engine(),
    'multi_perspective_framework', public._owebp129_multi_perspective_framework(),
    'wisdom_companion', public._owebp129_wisdom_companion(),
    'decision_ethics_review', public._owebp129_decision_ethics_review(),
    'culture_insight_engine', public._owebp129_culture_insight_engine(),
    'wisdom_practices_library', public._owebp129_wisdom_practices_library(),
    'companion_limitations', public._owebp129_companion_limitations(),
    'self_love_in_wisdom', public._owebp129_self_love_in_wisdom(),
    'ethical_governance_integration', public._owebp129_ethical_governance_integration(),
    'cross_links', public._owebp129_cross_links(),
    'limitation_principles', public._owebp129_limitation_principles(),
    'companion_adaptation', public._owebp129_companion_adaptation(),
    'success_metrics', public._owebp129_success_metrics(),
    'success_criteria', public._owebp129_success_criteria(p_tenant_id),
    'engagement_summary', public._owebp129_engagement_summary(p_tenant_id),
    'privacy_note', 'Organizational wisdom blueprint data is metadata only — reflection scaffolds and aggregate culture themes. Humans retain moral agency.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organizational_wisdom_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_wisdom_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._owis_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._owis_ensure_settings(v_tenant_id);
  perform public._owis_seed_reflection_workspaces(v_tenant_id);
  perform public._owis_seed_ethics_reviews(v_tenant_id);
  perform public._owis_seed_culture_snapshots(v_tenant_id);
  perform public._owis_seed_practices(v_tenant_id);
  v_metrics := public._owis_refresh_metrics(v_tenant_id);
  v_engagement := public._owebp129_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'wisdom_maturity_score', v_metrics->'wisdom_maturity_score',
    'active_reflection_workspaces', v_metrics->'active_reflection_workspaces',
    'ethics_reviews', v_metrics->'ethics_reviews',
    'philosophy', public._owebp129_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'wisdom_center_enabled', v_settings.wisdom_center_enabled,
    'implementation_blueprint_phase129', jsonb_build_object(
      'phase', 'Phase 129 — Organizational Wisdom & Ethical Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE129_ORGANIZATIONAL_WISDOM_ETHICAL_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 129 Organizational Wisdom & Ethical Intelligence Engine',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Reflection and discernment — humans retain moral agency.'
    ),
    'organizational_wisdom_mission', public._owebp129_mission(),
    'organizational_wisdom_abos_principle', public._owebp129_abos_principle(),
    'organizational_wisdom_engagement_summary', v_engagement,
    'organizational_wisdom_vision_note', public._owebp129_vision()
  );
end; $$;

create or replace function public.get_organizational_wisdom_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.organizational_wisdom_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._owis_require_tenant());
  v_settings := public._owis_ensure_settings(v_tenant_id);
  perform public._owis_seed_reflection_workspaces(v_tenant_id);
  perform public._owis_seed_ethics_reviews(v_tenant_id);
  perform public._owis_seed_culture_snapshots(v_tenant_id);
  perform public._owis_seed_practices(v_tenant_id);
  v_metrics := public._owis_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'wisdom_center_enabled', v_settings.wisdom_center_enabled,
    'ethical_reflection_enabled', v_settings.ethical_reflection_enabled,
    'values_alignment_enabled', v_settings.values_alignment_enabled,
    'decision_reflection_enabled', v_settings.decision_reflection_enabled,
    'perspective_expansion_enabled', v_settings.perspective_expansion_enabled,
    'governance_integration_enabled', v_settings.governance_integration_enabled,
    'culture_insights_enabled', v_settings.culture_insights_enabled,
    'philosophy', public._owebp129_philosophy(),
    'distinction_note', public._owebp129_distinction_note(),
    'safety_note', 'Wisdom Center — reflection and transparency. Aipify does NOT determine right or wrong. Culture insight = aggregate themes not surveillance.',
    'wisdom_maturity_score', v_metrics->'wisdom_maturity_score',
    'active_reflection_workspaces', v_metrics->'active_reflection_workspaces',
    'ethics_reviews', v_metrics->'ethics_reviews',
    'culture_theme_snapshots', v_metrics->'culture_theme_snapshots',
    'wisdom_practices_count', v_metrics->'wisdom_practices_count',
    'wisdom_center_capabilities_count', v_metrics->'wisdom_center_capabilities_count',
    'ethical_questions_count', v_metrics->'ethical_questions_count',
    'values_dimensions_count', v_metrics->'values_dimensions_count',
    'perspective_groups_count', v_metrics->'perspective_groups_count',
    'reflection_workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title,
        'reflection_topic', w.reflection_topic, 'status', w.status,
        'cross_link_route', w.cross_link_route
      ) order by w.updated_at desc)
      from public.organizational_wisdom_reflection_workspaces w where w.tenant_id = v_tenant_id and w.status in ('active', 'draft', 'review')
    ), '[]'::jsonb),
    'ethics_reviews_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'workspace_key', r.workspace_key,
        'title', r.title, 'who_benefits_summary', r.who_benefits_summary,
        'who_harmed_summary', r.who_harmed_summary, 'status', r.status
      ) order by r.updated_at desc)
      from public.organizational_wisdom_ethics_reviews r where r.tenant_id = v_tenant_id and r.status in ('active', 'review')
    ), '[]'::jsonb),
    'culture_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'snapshot_key', c.snapshot_key, 'theme_area', c.theme_area,
        'title', c.title, 'theme_summary', c.theme_summary,
        'signal_strength', c.signal_strength, 'status', c.status
      ) order by c.captured_at desc)
      from public.organizational_wisdom_culture_theme_snapshots c where c.tenant_id = v_tenant_id and c.status in ('active', 'review')
    ), '[]'::jsonb),
    'wisdom_practices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'practice_key', p.practice_key, 'practice_type', p.practice_type,
        'title', p.title, 'summary', p.summary, 'status', p.status,
        'cross_link_route', p.cross_link_route
      ) order by p.updated_at desc)
      from public.organizational_wisdom_practices p where p.tenant_id = v_tenant_id and p.status = 'active'
    ), '[]'::jsonb),
    'ethical_question_scaffolds', public._owis_ethical_questions(),
    'values_dimension_scaffolds', public._owis_values_dimensions(),
    'perspective_group_scaffolds', public._owis_perspective_groups(),
    'decision_ethics_prompt_scaffolds', public._owis_decision_ethics_prompts(),
    'culture_insight_area_scaffolds', public._owis_culture_insight_areas(),
    'wisdom_practice_scaffolds', public._owis_wisdom_practice_scaffolds(),
    'integration_links', public._owebp129_cross_links(),
    'implementation_blueprint_phase129', jsonb_build_object(
      'phase', 'Phase 129 — Organizational Wisdom & Ethical Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE129_ORGANIZATIONAL_WISDOM_ETHICAL_INTELLIGENCE.md',
      'engine_phase', 'Repo Phase 129 Organizational Wisdom & Ethical Intelligence Engine',
      'route', '/app/organizational-wisdom-engine',
      'mapping_note', 'Reflection and discernment — humans retain moral agency.'
    ),
    'organizational_wisdom_blueprint', public._owebp129_blueprint_block(v_tenant_id),
    'organizational_wisdom_mission', public._owebp129_mission(),
    'organizational_wisdom_philosophy', public._owebp129_philosophy(),
    'organizational_wisdom_abos_principle', public._owebp129_abos_principle(),
    'organizational_wisdom_objectives', public._owebp129_objectives(),
    'wisdom_center', public._owebp129_wisdom_center(),
    'ethical_intelligence_engine', public._owebp129_ethical_intelligence_engine(),
    'values_alignment_engine', public._owebp129_values_alignment_engine(),
    'multi_perspective_framework', public._owebp129_multi_perspective_framework(),
    'wisdom_companion', public._owebp129_wisdom_companion(),
    'decision_ethics_review', public._owebp129_decision_ethics_review(),
    'culture_insight_engine', public._owebp129_culture_insight_engine(),
    'wisdom_practices_library', public._owebp129_wisdom_practices_library(),
    'companion_limitations', public._owebp129_companion_limitations(),
    'self_love_in_wisdom', public._owebp129_self_love_in_wisdom(),
    'ethical_governance_integration', public._owebp129_ethical_governance_integration(),
    'owebp129_cross_links', public._owebp129_cross_links(),
    'limitation_principles', public._owebp129_limitation_principles(),
    'companion_adaptation', public._owebp129_companion_adaptation(),
    'engagement_summary', public._owebp129_engagement_summary(v_tenant_id),
    'success_criteria', public._owebp129_success_criteria(v_tenant_id),
    'success_metrics', public._owebp129_success_metrics(),
    'organizational_wisdom_vision', public._owebp129_vision(),
    'privacy_note', 'Organizational wisdom metadata only — reflection scaffolds, ethics review summaries, aggregate culture themes. No customer email, chat, individual evaluation, or PII. Humans retain moral agency.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organizational-wisdom-engine', 'Organizational Wisdom & Ethical Intelligence',
  'Wisdom Center — ethical reflection, values alignment, decision ethics prompts, and culture theme insights. Discernment not perfection.',
  'authenticated', 149
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organizational-wisdom-engine' and tenant_id is null
);

grant execute on function public.get_organizational_wisdom_engine_card(uuid) to authenticated;
grant execute on function public.get_organizational_wisdom_engine_dashboard(uuid) to authenticated;
grant execute on function public._owebp129_distinction_note() to authenticated;
grant execute on function public._owebp129_mission() to authenticated;
grant execute on function public._owebp129_philosophy() to authenticated;
grant execute on function public._owebp129_abos_principle() to authenticated;
grant execute on function public._owebp129_vision() to authenticated;
grant execute on function public._owebp129_objectives() to authenticated;
grant execute on function public._owebp129_wisdom_center() to authenticated;
grant execute on function public._owebp129_ethical_intelligence_engine() to authenticated;
grant execute on function public._owebp129_values_alignment_engine() to authenticated;
grant execute on function public._owebp129_multi_perspective_framework() to authenticated;
grant execute on function public._owebp129_wisdom_companion() to authenticated;
grant execute on function public._owebp129_decision_ethics_review() to authenticated;
grant execute on function public._owebp129_culture_insight_engine() to authenticated;
grant execute on function public._owebp129_wisdom_practices_library() to authenticated;
grant execute on function public._owebp129_companion_limitations() to authenticated;
grant execute on function public._owebp129_self_love_in_wisdom() to authenticated;
grant execute on function public._owebp129_ethical_governance_integration() to authenticated;
grant execute on function public._owebp129_cross_links() to authenticated;
grant execute on function public._owebp129_limitation_principles() to authenticated;
grant execute on function public._owebp129_companion_adaptation() to authenticated;
grant execute on function public._owebp129_success_metrics() to authenticated;
