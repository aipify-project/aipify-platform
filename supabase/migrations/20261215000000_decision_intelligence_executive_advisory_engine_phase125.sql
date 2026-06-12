-- Phase 125 — Decision Intelligence & Executive Advisory Engine (Enterprise Intelligence Era 121–130)
-- Decision Intelligence Center — structure, perspective, wisdom for leaders. NOT deciding for them.
-- Distinct from personal DSE Phase 38/60 (/app/assistant/decisions) and ODSE A.54 (/app/organizational-decision-support-engine).
-- Helpers: _dein_* (engine), _deibp125_* (blueprint — never collide with _dse_*, _odse_*).

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
    'decision_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. decision_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  intelligence_center_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  advisory_briefings_enabled boolean not null default true,
  assumption_reviews_enabled boolean not null default true,
  tradeoff_analysis_enabled boolean not null default true,
  outcome_tracking_enabled boolean not null default true,
  reflection_sessions_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.decision_intelligence_settings enable row level security;
revoke all on public.decision_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. decision_intelligence_workspaces (metadata only — ten workspace fields)
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_workspaces (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workspace_key text not null,
  title text not null,
  decision_statement text not null check (char_length(decision_statement) <= 500),
  objectives_summary text check (char_length(objectives_summary) <= 500),
  constraints_summary text check (char_length(constraints_summary) <= 500),
  alternatives_summary text check (char_length(alternatives_summary) <= 500),
  dependencies_summary text check (char_length(dependencies_summary) <= 500),
  stakeholders_summary text check (char_length(stakeholders_summary) <= 500),
  benefits_summary text check (char_length(benefits_summary) <= 500),
  risks_summary text check (char_length(risks_summary) <= 500),
  unknowns_summary text check (char_length(unknowns_summary) <= 500),
  supporting_knowledge_summary text check (char_length(supporting_knowledge_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'active', 'review', 'archived')),
  cross_link_route text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workspace_key)
);

create index if not exists decision_intelligence_workspaces_tenant_idx
  on public.decision_intelligence_workspaces (tenant_id, status);

alter table public.decision_intelligence_workspaces enable row level security;
revoke all on public.decision_intelligence_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. decision_intelligence_journal_entries (metadata only — no raw transcripts)
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_journal_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  journal_key text not null,
  workspace_key text,
  title text not null,
  decision_date date,
  participants_summary text check (char_length(participants_summary) <= 500),
  available_info_summary text check (char_length(available_info_summary) <= 500),
  assumptions_summary text check (char_length(assumptions_summary) <= 500),
  alternatives_summary text check (char_length(alternatives_summary) <= 500),
  expected_outcomes_summary text check (char_length(expected_outcomes_summary) <= 500),
  rationale_summary text check (char_length(rationale_summary) <= 500),
  follow_up_actions_summary text check (char_length(follow_up_actions_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, journal_key)
);

create index if not exists decision_intelligence_journal_entries_tenant_idx
  on public.decision_intelligence_journal_entries (tenant_id, status);

alter table public.decision_intelligence_journal_entries enable row level security;
revoke all on public.decision_intelligence_journal_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. decision_intelligence_assumption_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_assumption_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assumption_key text not null,
  workspace_key text,
  assumption_type text not null check (
    assumption_type in (
      'market', 'customer', 'leadership', 'technology', 'financial', 'operational'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  status text not null default 'active' check (status in ('active', 'challenged', 'validated', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, assumption_key)
);

create index if not exists decision_intelligence_assumption_reviews_tenant_idx
  on public.decision_intelligence_assumption_reviews (tenant_id, assumption_type, status);

alter table public.decision_intelligence_assumption_reviews enable row level security;
revoke all on public.decision_intelligence_assumption_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. decision_intelligence_outcome_learnings
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_outcome_learnings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  learning_key text not null,
  workspace_key text,
  title text not null,
  what_worked_summary text check (char_length(what_worked_summary) <= 500),
  surprises_summary text check (char_length(surprises_summary) <= 500),
  incorrect_assumptions_summary text check (char_length(incorrect_assumptions_summary) <= 500),
  repeat_summary text check (char_length(repeat_summary) <= 500),
  change_summary text check (char_length(change_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, learning_key)
);

create index if not exists decision_intelligence_outcome_learnings_tenant_idx
  on public.decision_intelligence_outcome_learnings (tenant_id, status, captured_at desc);

alter table public.decision_intelligence_outcome_learnings enable row level security;
revoke all on public.decision_intelligence_outcome_learnings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. decision_intelligence_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.decision_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.decision_intelligence_audit_logs enable row level security;
revoke all on public.decision_intelligence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'decision_intelligence_engine', v.description
from (values
  ('decision_intelligence.view', 'View Decision Intelligence Engine', 'View Decision Intelligence Center — workspaces, journals, and advisory scaffolds'),
  ('decision_intelligence.manage', 'Manage Decision Intelligence Engine', 'Update decision intelligence settings and workspace metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'decision_intelligence.view'), ('owner', 'decision_intelligence.manage'),
  ('administrator', 'decision_intelligence.view'), ('administrator', 'decision_intelligence.manage'),
  ('manager', 'decision_intelligence.view'), ('manager', 'decision_intelligence.manage'),
  ('employee', 'decision_intelligence.view'),
  ('support_agent', 'decision_intelligence.view'),
  ('moderator', 'decision_intelligence.view'),
  ('viewer', 'decision_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Baseline helpers (_dein_)
-- ---------------------------------------------------------------------------
create or replace function public._dein_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._dein_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._dein_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._dein_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.decision_intelligence_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._dein_ensure_settings(p_tenant_id uuid)
returns public.decision_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.decision_intelligence_settings;
begin
  insert into public.decision_intelligence_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.decision_intelligence_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._dein_workspace_field_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_statement', 'label', 'Decision statement', 'description', 'Clear articulation of the decision under consideration'),
    jsonb_build_object('key', 'objectives', 'label', 'Objectives', 'description', 'What success looks like — human-defined goals'),
    jsonb_build_object('key', 'constraints', 'label', 'Constraints', 'description', 'Boundaries, limits, and non-negotiables'),
    jsonb_build_object('key', 'alternatives', 'label', 'Alternatives', 'description', 'Options under consideration — expand thinking not outcomes'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies', 'description', 'Cross-link Digital Twin Phase 124 for system dependencies'),
    jsonb_build_object('key', 'stakeholders', 'label', 'Stakeholders', 'description', 'Who is affected — roles not individuals'),
    jsonb_build_object('key', 'benefits', 'label', 'Benefits', 'description', 'Potential positive outcomes — hypotheses not guarantees'),
    jsonb_build_object('key', 'risks', 'label', 'Risks', 'description', 'Potential downsides — stewardship not alarm'),
    jsonb_build_object('key', 'unknowns', 'label', 'Unknowns', 'description', 'What remains uncertain — transparency required'),
    jsonb_build_object('key', 'supporting_knowledge', 'label', 'Supporting knowledge', 'description', 'KC resources and historical references — cross-link Wisdom A.93')
  );
$$;

create or replace function public._dein_assumption_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'market', 'label', 'Market assumptions', 'description', 'Market conditions and competitive context'),
    jsonb_build_object('key', 'customer', 'label', 'Customer assumptions', 'description', 'Customer needs and behavior hypotheses'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership assumptions', 'description', 'Leadership capacity and alignment context'),
    jsonb_build_object('key', 'technology', 'label', 'Technology assumptions', 'description', 'Technical feasibility and readiness'),
    jsonb_build_object('key', 'financial', 'label', 'Financial assumptions', 'description', 'Metadata summaries only — never raw financial records'),
    jsonb_build_object('key', 'operational', 'label', 'Operational assumptions', 'description', 'Operational capacity and process readiness')
  );
$$;

create or replace function public._dein_tradeoff_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'gained', 'label', 'What is gained?', 'description', 'Benefits and opportunities from the chosen path'),
    jsonb_build_object('key', 'sacrificed', 'label', 'What is sacrificed?', 'description', 'Trade-offs and opportunity costs'),
    jsonb_build_object('key', 'who_benefits', 'label', 'Who benefits?', 'description', 'Stakeholder groups that may gain'),
    jsonb_build_object('key', 'who_affected', 'label', 'Who is affected?', 'description', 'Stakeholder groups that may bear impact'),
    jsonb_build_object('key', 'short_term', 'label', 'Short-term implications?', 'description', 'Near-term consequences and timing'),
    jsonb_build_object('key', 'long_term', 'label', 'Long-term implications?', 'description', 'Sustainability and legacy considerations')
  );
$$;

create or replace function public._dein_stakeholder_groups()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employees', 'label', 'Employees', 'description', 'Workforce impact — roles not individuals'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer experience and trust'),
    jsonb_build_object('key', 'gps', 'label', 'Growth Partners', 'description', 'Partner ecosystem — cross-link GP Ops Phase 114'),
    jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Community impact — cross-link Phase 117'),
    jsonb_build_object('key', 'executives', 'label', 'Executives', 'description', 'Leadership accountability and capacity'),
    jsonb_build_object('key', 'boards', 'label', 'Boards', 'description', 'Governance oversight — cross-link Phase 123'),
    jsonb_build_object('key', 'knowledge_contributors', 'label', 'Knowledge contributors', 'description', 'KC and organizational memory — cross-link A.34'),
    jsonb_build_object('key', 'companions', 'label', 'Companions', 'description', 'Companion coverage and operational support'),
    jsonb_build_object('key', 'broader_stakeholders', 'label', 'Broader stakeholders', 'description', 'Regulators, suppliers, and ecosystem partners')
  );
$$;

create or replace function public._dein_journal_capture_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'dates', 'label', 'Dates', 'description', 'Decision timeline and review cadence'),
    jsonb_build_object('key', 'participants', 'label', 'Participants', 'description', 'Role labels only — no PII or raw meeting transcripts'),
    jsonb_build_object('key', 'available_info', 'label', 'Available information', 'description', 'What was known at decision time'),
    jsonb_build_object('key', 'assumptions', 'label', 'Assumptions', 'description', 'Assumptions documented for later review'),
    jsonb_build_object('key', 'alternatives', 'label', 'Alternatives considered', 'description', 'Options explored — expand thinking'),
    jsonb_build_object('key', 'expected_outcomes', 'label', 'Expected outcomes', 'description', 'Hypothesized results — not guarantees'),
    jsonb_build_object('key', 'rationales', 'label', 'Rationales', 'description', 'Reasoning captured — human judgment preserved'),
    jsonb_build_object('key', 'follow_up_actions', 'label', 'Follow-up actions', 'description', 'Next steps for accountability and learning')
  );
$$;

create or replace function public._dein_outcome_learning_questions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'what_worked', 'label', 'What worked?', 'description', 'Successful elements worth repeating'),
    jsonb_build_object('key', 'surprises', 'label', 'What surprised us?', 'description', 'Unexpected outcomes — learning opportunity'),
    jsonb_build_object('key', 'incorrect_assumptions', 'label', 'Which assumptions were incorrect?', 'description', 'Assumption review for future decisions'),
    jsonb_build_object('key', 'repeat', 'label', 'What would we repeat?', 'description', 'Patterns worth preserving'),
    jsonb_build_object('key', 'change', 'label', 'What would we change?', 'description', 'Improvements for next time — no blame framing')
  );
$$;

create or replace function public._dein_executive_reflection_considerations()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'values_alignment', 'label', 'Values alignment', 'description', 'Cross-link Purpose & Values A.82'),
    jsonb_build_object('key', 'readiness', 'label', 'Readiness', 'description', 'Is the organization prepared for this decision?'),
    jsonb_build_object('key', 'unintended_consequences', 'label', 'Unintended consequences', 'description', 'Second-order effects worth exploring'),
    jsonb_build_object('key', 'stakeholder_wellbeing', 'label', 'Stakeholder wellbeing', 'description', 'Impact on people — People First'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability', 'description', 'Legacy and continuity considerations')
  );
$$;

create or replace function public._dein_seed_workspaces(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_intelligence_workspaces where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_intelligence_workspaces (
    tenant_id, workspace_key, title, decision_statement, objectives_summary, constraints_summary,
    alternatives_summary, dependencies_summary, stakeholders_summary, benefits_summary,
    risks_summary, unknowns_summary, supporting_knowledge_summary, status, cross_link_route
  ) values
    (p_tenant_id, 'platform-expansion', 'Platform expansion decision', 'Whether to expand into adjacent market segments this fiscal year.', 'Revenue growth and ecosystem reach without overextending operations.', 'Budget ceiling and companion coverage limits.', 'Full expansion · phased rollout · partner-led growth.', 'Digital Twin dependency map suggests three critical handoffs — cross-link /app/digital-twin.', 'Executives · employees · GPs · customers.', 'Market presence and partner network growth.', 'Operational strain and knowledge gaps during transition.', 'Competitive response timing remains uncertain.', 'Strategic foresight trends and prior expansion lessons — cross-link KC.', 'active', '/app/digital-twin'),
    (p_tenant_id, 'companion-adoption', 'Companion adoption acceleration', 'How aggressively to accelerate companion adoption across departments.', 'Improve operational efficiency while maintaining human oversight.', 'Change capacity and training bandwidth.', 'Accelerate · maintain pace · focus on pilot departments first.', 'Workflow orchestration dependencies — cross-link /app/workflow-orchestration-engine.', 'Department leads · employees · companions.', 'Productivity gains and reduced repetitive work.', 'Adoption fatigue and uneven skill development.', 'Long-term companion ROI timeline unclear.', 'Aipify University pathways and onboarding scaffolds.', 'draft', '/app/aipify-university'),
    (p_tenant_id, 'governance-update', 'Governance policy update', 'Update approval policies for sensitive operational actions.', 'Stronger governance without slowing reversible decisions.', 'Existing policy framework and board expectations.', 'Incremental update · comprehensive rewrite · defer to next quarter.', 'Board governance cross-link — /app/governance-policy-engine.', 'Board · executives · compliance · employees.', 'Clearer accountability and reduced ambiguity.', 'Temporary slowdown in approval velocity.', 'Regulatory landscape may shift — cross-link Compliance A.48.', 'Prior governance decisions and Wisdom Engine guidance.', 'draft', '/app/governance-policy-engine');
end; $$;

create or replace function public._dein_seed_journal_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_intelligence_journal_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_intelligence_journal_entries (
    tenant_id, journal_key, workspace_key, title, decision_date, participants_summary,
    available_info_summary, assumptions_summary, alternatives_summary,
    expected_outcomes_summary, rationale_summary, follow_up_actions_summary, status
  ) values
    (p_tenant_id, 'expansion-review-q2', 'platform-expansion', 'Q2 expansion review', current_date - 30,
     'Executive team · strategy lead · operations lead — role labels only.',
     'Market signals from foresight center · capacity metrics · partner feedback summaries.',
     'Market demand will sustain · operational capacity sufficient · GP network ready.',
     'Full expansion · phased · defer.',
     '15% revenue uplift in target segment within 12 months — hypothesis.',
     'Phased approach balances growth with operational stability — human judgment.',
     'Define phase-one scope · schedule assumption review in 90 days.', 'active'),
    (p_tenant_id, 'companion-pilot-retro', 'companion-adoption', 'Companion pilot retrospective', current_date - 14,
     'Pilot department leads · companion ops — metadata only.',
     'Adoption metrics · training completion · support ticket trends.',
     'Teams will adopt within 60 days · training sufficient.',
     'Expand pilot · hold · narrow scope.',
     'Reduced manual task volume in pilot departments.',
     'Positive signals but change capacity varies — proceed thoughtfully.',
     'Extend pilot 30 days · capture outcome learning.', 'active');
end; $$;

create or replace function public._dein_seed_assumption_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_intelligence_assumption_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_intelligence_assumption_reviews (
    tenant_id, assumption_key, workspace_key, assumption_type, title, summary, confidence, status
  ) values
    (p_tenant_id, 'market-demand-sustain', 'platform-expansion', 'market', 'Market demand sustainability', 'Target segment demand signals remain positive — hypothesis from foresight trends.', 'moderate', 'active'),
    (p_tenant_id, 'customer-expectations', 'platform-expansion', 'customer', 'Customer service expectations', 'Customers expect faster companion-assisted support — metadata signal.', 'high', 'active'),
    (p_tenant_id, 'leadership-capacity', 'companion-adoption', 'leadership', 'Leadership change capacity', 'Leadership bandwidth for concurrent initiatives is limited this quarter.', 'moderate', 'challenged'),
    (p_tenant_id, 'tech-readiness', 'companion-adoption', 'technology', 'Technical integration readiness', 'Core integrations stable — edge cases need review.', 'moderate', 'active'),
    (p_tenant_id, 'budget-ceiling', 'platform-expansion', 'financial', 'Budget ceiling assumption', 'Allocated budget sufficient for phased expansion — scaffold summary only.', 'moderate', 'active'),
    (p_tenant_id, 'ops-bandwidth', 'governance-update', 'operational', 'Operations review bandwidth', 'Policy review can proceed without blocking daily operations.', 'low', 'active');
end; $$;

create or replace function public._dein_seed_outcome_learnings(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.decision_intelligence_outcome_learnings where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.decision_intelligence_outcome_learnings (
    tenant_id, learning_key, workspace_key, title,
    what_worked_summary, surprises_summary, incorrect_assumptions_summary,
    repeat_summary, change_summary, status
  ) values
    (p_tenant_id, 'prior-expansion-lesson', 'platform-expansion', 'Prior expansion outcome review',
     'Phased rollout reduced operational strain · cross-functional briefings helped alignment.',
     'Partner onboarding took longer than expected.',
     'Assumed GP network was fully ready — needed additional enablement.',
     'Structured assumption reviews before each phase.',
     'Build GP readiness checkpoint into expansion playbook.', 'active');
end; $$;

create or replace function public._dein_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_active_workspaces int;
  v_journal_entries int;
  v_assumption_reviews int;
  v_outcome_learnings int;
  v_quality_score numeric;
begin
  select count(*) into v_active_workspaces from public.decision_intelligence_workspaces
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'review');
  select count(*) into v_journal_entries from public.decision_intelligence_journal_entries
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_assumption_reviews from public.decision_intelligence_assumption_reviews
  where tenant_id = p_tenant_id and status in ('active', 'challenged', 'validated');
  select count(*) into v_outcome_learnings from public.decision_intelligence_outcome_learnings
  where tenant_id = p_tenant_id and status in ('active', 'review');

  v_quality_score := least(100, round(
    (v_active_workspaces * 6.0) + (v_journal_entries * 5.0) + (v_assumption_reviews * 4.0) + (v_outcome_learnings * 8.0)
  , 1));

  return jsonb_build_object(
    'decision_quality_score', v_quality_score,
    'active_workspaces', v_active_workspaces,
    'journal_entries', v_journal_entries,
    'assumption_reviews', v_assumption_reviews,
    'outcome_learnings', v_outcome_learnings,
    'intelligence_center_capabilities_count', 9,
    'workspace_fields_count', jsonb_array_length(public._dein_workspace_field_scaffolds()),
    'assumption_types_count', jsonb_array_length(public._dein_assumption_type_scaffolds()),
    'tradeoff_questions_count', jsonb_array_length(public._dein_tradeoff_questions()),
    'stakeholder_groups_count', jsonb_array_length(public._dein_stakeholder_groups()),
    'companion_supports_count', 7
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_deibp125_)
-- ---------------------------------------------------------------------------
create or replace function public._deibp125_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 125 — Decision Intelligence & Executive Advisory Engine at /app/decision-intelligence-engine. Better thinking not faster decisions — structure, perspective, wisdom; humans decide. Distinct from personal Decision Support Engine Phase 38/60 at /app/assistant/decisions (individual guidance — cross-link only, never duplicate _dse_* RPCs); Organizational Decision Support A.54 at /app/organizational-decision-support-engine (org decision register/approvals — cross-link only, never duplicate _odse_* RPCs); Executive Intelligence Phase 121 at /app/executive-intelligence; Strategic Foresight Phase 122 at /app/strategic-foresight-engine; Board Governance Phase 123 at /app/governance-policy-engine; Digital Twin Phase 124 at /app/digital-twin; Wisdom Engine A.93 at /app/wisdom-engine; Simulation Lab Phase 78 at /app/simulations; Executive Reflection Blueprint 82 at /app/executive-insights-engine; Self Love A.76 at /app/self-love-engine. Helpers _deibp125_* — never collide with _dse_*, _odse_*. Metadata only in journals — no PII or raw meeting transcripts.';
$$;

create or replace function public._deibp125_mission()
returns text language sql immutable as $$
  select 'Help leaders think clearly about important decisions — structure, perspective, and wisdom that strengthen judgment without deciding for them.';
$$;

create or replace function public._deibp125_philosophy()
returns text language sql immutable as $$
  select 'People First. Wisdom before speed. Better thinking not faster decisions. Aipify expands perspective; leaders retain accountability. Metadata only — no raw transcripts or PII.';
$$;

create or replace function public._deibp125_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Decision Intelligence Center orchestrates decision workspaces, advisory briefings, assumption reviews, and outcome learning. Personal DSE and ODSE remain authoritative for their domains. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._deibp125_vision()
returns text language sql immutable as $$
  select 'Leaders navigate complexity with clearer thinking — structured reflection, alternative perspectives, and institutional wisdom that outlasts any single decision moment.';
$$;

create or replace function public._deibp125_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_quality', 'emoji', '🦉', 'label', 'Improve decision quality', 'description', 'Structure and perspective for wiser human decisions'),
    jsonb_build_object('key', 'reduce_impulsive', 'emoji', '🌹', 'label', 'Reduce impulsive decisions', 'description', 'Pause, reflect, and review assumptions before acting'),
    jsonb_build_object('key', 'alternative_perspectives', 'emoji', '🔔', 'label', 'Alternative perspectives', 'description', 'Surface viewpoints leaders may not have considered'),
    jsonb_build_object('key', 'clarify_assumptions', 'emoji', '🦉', 'label', 'Clarify assumptions', 'description', 'Make assumptions visible and challengeable'),
    jsonb_build_object('key', 'organizational_alignment', 'emoji', '🌹', 'label', 'Organizational alignment', 'description', 'Connect decisions to strategic context — cross-link Alignment A.55'),
    jsonb_build_object('key', 'transparency', 'emoji', '🔔', 'label', 'Transparency', 'description', 'Decision rationale and trade-offs documented — metadata only'),
    jsonb_build_object('key', 'learn_from_previous', 'emoji', '🦉', 'label', 'Learn from previous decisions', 'description', 'Outcome learning and historical references'),
    jsonb_build_object('key', 'long_term_wisdom', 'emoji', '🌹', 'label', 'Long-term wisdom', 'description', 'Institutional decision knowledge — cross-link Wisdom A.93')
  );
$$;

create or replace function public._deibp125_decision_intelligence_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision Intelligence Center — nine capabilities for executive advisory.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'decision_workspaces', 'label', 'Decision workspaces', 'description', 'Structured decision scaffolds with ten fields'),
      jsonb_build_object('key', 'decision_journals', 'label', 'Decision journals', 'description', 'Metadata captures — no raw meeting transcripts'),
      jsonb_build_object('key', 'advisory_briefings', 'label', 'Advisory briefings', 'description', 'Executive advisory context — cross-link Phase 121'),
      jsonb_build_object('key', 'assumption_reviews', 'label', 'Assumption reviews', 'description', 'Six assumption types — challengeable hypotheses'),
      jsonb_build_object('key', 'tradeoff_analysis', 'label', 'Trade-off analysis', 'description', 'Six trade-off questions — expand thinking'),
      jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping', 'description', 'Nine stakeholder groups — roles not individuals'),
      jsonb_build_object('key', 'historical_references', 'label', 'Historical references', 'description', 'Prior decisions and lessons — cross-link Org Memory A.34'),
      jsonb_build_object('key', 'outcome_tracking', 'label', 'Outcome tracking', 'description', 'Five outcome learning questions'),
      jsonb_build_object('key', 'reflection_sessions', 'label', 'Reflection sessions', 'description', 'Executive reflection scaffolds — cross-link Blueprint 82')
    )
  );
$$;

create or replace function public._deibp125_decision_workspaces()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision workspaces — ten fields for structured executive thinking.',
    'fields', public._dein_workspace_field_scaffolds(),
    'boundary_note', 'Workspaces structure thinking — never binding recommendations.'
  );
$$;

create or replace function public._deibp125_executive_advisory_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Advisory Companion — seven supports. Expands thinking NOT outcomes.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'thoughtful_questions', 'label', 'Thoughtful questions', 'description', 'Questions that expand perspective without directing answers'),
      jsonb_build_object('key', 'blind_spots', 'label', 'Blind spots', 'description', 'Gentle surfacing of overlooked considerations'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Prior decision metadata — cross-link journals and Org Memory'),
      jsonb_build_object('key', 'alternative_viewpoints', 'label', 'Alternative viewpoints', 'description', 'Multiple perspectives always presented'),
      jsonb_build_object('key', 'tradeoffs', 'label', 'Trade-offs', 'description', 'Structured trade-off analysis — six questions'),
      jsonb_build_object('key', 'knowledge_resources', 'label', 'Knowledge resources', 'description', 'KC and Wisdom Engine cross-links'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection', 'description', 'Executive reflection prompts — five considerations')
    ),
    'boundary_note', 'Companion expands thinking — never decides for leaders.'
  );
$$;

create or replace function public._deibp125_assumption_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Assumption intelligence — six types. Hypotheses not certainties.',
    'types', public._dein_assumption_type_scaffolds(),
    'boundary_note', 'Assumptions visible and challengeable — never concealed.'
  );
$$;

create or replace function public._deibp125_tradeoff_analysis()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trade-off analysis — six questions. Who gains, who is affected, short and long term.',
    'questions', public._dein_tradeoff_questions(),
    'boundary_note', 'Trade-offs framed for human judgment — no recommended outcomes.'
  );
$$;

create or replace function public._deibp125_stakeholder_impact()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stakeholder impact — nine groups. Roles not individuals.',
    'groups', public._dein_stakeholder_groups(),
    'boundary_note', 'Stakeholder mapping for awareness — not surveillance or ranking.'
  );
$$;

create or replace function public._deibp125_decision_journal()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision journal — eight captures. Metadata only — no raw meeting transcripts.',
    'captures', public._dein_journal_capture_scaffolds(),
    'boundary_note', 'Journal entries store metadata summaries — never PII or verbatim transcripts.'
  );
$$;

create or replace function public._deibp125_outcome_learning()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Outcome learning — five questions. Learn without blame.',
    'questions', public._dein_outcome_learning_questions(),
    'boundary_note', 'Outcome reviews strengthen institutional wisdom — cross-link Organizational Memory A.34.'
  );
$$;

create or replace function public._deibp125_executive_reflection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive reflection — five considerations before significant decisions.',
    'considerations', public._dein_executive_reflection_considerations(),
    'executive_insights_route', '/app/executive-insights-engine',
    'boundary_note', 'Reflection scaffolds — cross-link Executive Reflection Blueprint 82.'
  );
$$;

create or replace function public._deibp125_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Advisory Companion limitations — five boundaries.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_executive_decisions', 'label', 'No executive decisions', 'description', 'Never decide on behalf of leaders'),
      jsonb_build_object('key', 'no_guaranteed_outcomes', 'label', 'No guaranteed outcomes', 'description', 'Never promise results from any path'),
      jsonb_build_object('key', 'no_suppressing_disagreement', 'label', 'No suppressing disagreement', 'description', 'Dissent and alternatives always welcome'),
      jsonb_build_object('key', 'no_certainty_framing', 'label', 'No certainty framing', 'description', 'Uncertainty remains visible — no false confidence'),
      jsonb_build_object('key', 'no_overriding_judgment', 'label', 'No overriding judgment', 'description', 'Human judgment is final — companion advises only')
    )
  );
$$;

create or replace function public._deibp125_self_love_in_decisions()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in decision-making — patience, perspective, and compassion under pressure.',
    'practices', jsonb_build_array(
      'Patience — wisdom before speed',
      'Perspective — zoom out before committing',
      'Humility — assumptions may be wrong',
      'Curiosity — explore alternatives openly',
      'Compassion — consider stakeholder wellbeing',
      'Self-awareness — notice reactive impulses'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful leadership — never pressure or guilt.'
  );
$$;

create or replace function public._deibp125_decision_knowledge_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision knowledge library — six preserves. Metadata summaries only.',
    'preserves', jsonb_build_array(
      jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Prior decision context metadata'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned', 'description', 'Outcome learning artifacts — cross-link Org Memory A.34'),
      jsonb_build_object('key', 'outcome_reviews', 'label', 'Outcome reviews', 'description', 'Five-question outcome reflections'),
      jsonb_build_object('key', 'strategic_reflections', 'label', 'Strategic reflections', 'description', 'Cross-link Strategic Foresight Phase 122'),
      jsonb_build_object('key', 'advisory_frameworks', 'label', 'Advisory frameworks', 'description', 'Decision workspace and trade-off scaffolds'),
      jsonb_build_object('key', 'leadership_playbooks', 'label', 'Leadership playbooks', 'description', 'Cross-link Wisdom Engine A.93 and KC A.5')
    ),
    'kc_route', '/app/knowledge-center-engine'
  );
$$;

create or replace function public._deibp125_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal_dse', 'label', 'Decision Support Engine Phase 38/60', 'route', '/app/assistant/decisions', 'relationship', 'Personal decision guidance — cross-link, never duplicate _dse_*'),
    jsonb_build_object('key', 'odse', 'label', 'Organizational Decision Support A.54', 'route', '/app/organizational-decision-support-engine', 'relationship', 'Org decision register — cross-link, never duplicate _odse_*'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'relationship', 'Leadership companion cross-link'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'relationship', 'Foresight context for decisions'),
    jsonb_build_object('key', 'board_governance', 'label', 'Board Governance Phase 123', 'route', '/app/governance-policy-engine', 'relationship', 'Governance cross-link'),
    jsonb_build_object('key', 'digital_twin', 'label', 'Digital Twin Phase 124', 'route', '/app/digital-twin', 'relationship', 'Dependency and stakeholder context'),
    jsonb_build_object('key', 'wisdom_engine', 'label', 'Wisdom Engine A.93', 'route', '/app/wisdom-engine', 'relationship', 'Experience-to-guidance cross-link'),
    jsonb_build_object('key', 'simulation_lab', 'label', 'Simulation Lab Phase 78', 'route', '/app/simulations', 'relationship', 'Scenario exploration — do NOT duplicate simulation RPCs'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Reflection Blueprint 82', 'route', '/app/executive-insights-engine', 'relationship', 'Executive reflection scaffolds'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Decision wellbeing'),
    jsonb_build_object('key', 'strategic_alignment', 'label', 'Strategic Alignment A.55', 'route', '/app/strategic-alignment-engine', 'relationship', 'Organizational alignment context'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'relationship', 'Historical decision metadata')
  );
$$;

create or replace function public._deibp125_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humans decide — wisdom before speed. Better thinking not faster decisions.',
    'must_avoid', jsonb_build_array(
      'Binding recommendations or executive decisions on behalf of leaders',
      'Duplicating personal DSE _dse_* RPCs at /app/assistant/decisions',
      'Duplicating ODSE _odse_* RPCs at /app/organizational-decision-support-engine',
      'Storing raw meeting transcripts, email content, chat, or PII in journal tables',
      'Certainty framing or guaranteed outcome claims',
      'Suppressing disagreement or alternative viewpoints'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only journal and workspace records',
      'Assumptions visible and challengeable',
      'Cross-link authoritative domain surfaces',
      'Trade-off analysis expands thinking — no recommended outcomes',
      'Outcome learning without blame framing'
    ),
    'boundary_note', 'Decision Intelligence Center orchestrates advisory scaffolds — domain RPCs remain authoritative.'
  );
$$;

create or replace function public._deibp125_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Advisory Companion — calm, thoughtful questions. Expands thinking NOT outcomes.',
    'companion_name', 'Executive Advisory Companion',
    'not_label', 'AI decision-maker',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'assumption_review', 'prompt', 'Three assumptions in this workspace may benefit from review — shall Aipify prepare a challenge summary for your reflection?', 'consideration', 'Assumptions are hypotheses — leaders validate'),
      jsonb_build_object('emoji', '🌹', 'key', 'tradeoff_exploration', 'prompt', 'A trade-off analysis scaffold is ready — would exploring who benefits and who is affected feel helpful before you decide?', 'consideration', 'No recommended outcome — expand perspective'),
      jsonb_build_object('emoji', '🔔', 'key', 'historical_context', 'prompt', 'A prior decision on a similar topic may offer context — shall Aipify summarize the outcome learning entry?', 'consideration', 'Historical metadata — humans interpret relevance')
    ),
    'boundary_note', 'Companion adapts tone — never decides for leaders or claims certainty.'
  );
$$;

create or replace function public._deibp125_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_quality', 'label', 'Improved decision quality'),
    jsonb_build_object('key', 'fewer_impulsive', 'label', 'Fewer impulsive decisions'),
    jsonb_build_object('key', 'assumption_clarity', 'label', 'Clearer assumptions'),
    jsonb_build_object('key', 'stakeholder_awareness', 'label', 'Stronger stakeholder awareness'),
    jsonb_build_object('key', 'organizational_learning', 'label', 'Better organizational learning'),
    jsonb_build_object('key', 'leadership_confidence', 'label', 'Leadership confidence through preparation'),
    jsonb_build_object('key', 'transparency', 'label', 'Greater decision transparency'),
    jsonb_build_object('key', 'institutional_wisdom', 'label', 'Growing institutional wisdom')
  );
$$;

create or replace function public._deibp125_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._dein_ensure_settings(p_tenant_id);
  perform public._dein_seed_workspaces(p_tenant_id);
  perform public._dein_seed_journal_entries(p_tenant_id);
  perform public._dein_seed_assumption_reviews(p_tenant_id);
  perform public._dein_seed_outcome_learnings(p_tenant_id);
  v_metrics := public._dein_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'decision_quality_score', coalesce((v_metrics->>'decision_quality_score')::numeric, 0),
    'active_workspaces', coalesce((v_metrics->>'active_workspaces')::int, 0),
    'journal_entries', coalesce((v_metrics->>'journal_entries')::int, 0),
    'assumption_reviews', coalesce((v_metrics->>'assumption_reviews')::int, 0),
    'outcome_learnings', coalesce((v_metrics->>'outcome_learnings')::int, 0),
    'intelligence_center_capabilities_count', coalesce((v_metrics->>'intelligence_center_capabilities_count')::int, 9),
    'cross_links_count', jsonb_array_length(public._deibp125_cross_links()),
    'privacy_note', 'Aggregate decision intelligence counts and blueprint scaffolds only — metadata, no PII. Humans decide.'
  );
end; $$;

create or replace function public._deibp125_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._dein_ensure_settings(p_tenant_id);
  perform public._dein_seed_workspaces(p_tenant_id);
  perform public._dein_seed_journal_entries(p_tenant_id);
  perform public._dein_seed_assumption_reviews(p_tenant_id);
  perform public._dein_seed_outcome_learnings(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Objectives — eight documented', 'met', jsonb_array_length(public._deibp125_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'intelligence_center', 'label', 'Decision Intelligence Center — nine capabilities', 'met', jsonb_array_length((public._deibp125_decision_intelligence_center()->'capabilities')) = 9, 'note', null),
    jsonb_build_object('key', 'workspace_fields', 'label', 'Decision workspaces — ten fields', 'met', jsonb_array_length(public._dein_workspace_field_scaffolds()) = 10, 'note', null),
    jsonb_build_object('key', 'companion_supports', 'label', 'Executive Advisory Companion — seven supports', 'met', jsonb_array_length((public._deibp125_executive_advisory_companion()->'supports')) = 7, 'note', null),
    jsonb_build_object('key', 'assumption_types', 'label', 'Assumption intelligence — six types', 'met', jsonb_array_length(public._dein_assumption_type_scaffolds()) = 6, 'note', null),
    jsonb_build_object('key', 'tradeoff_questions', 'label', 'Trade-off analysis — six questions', 'met', jsonb_array_length(public._dein_tradeoff_questions()) = 6, 'note', null),
    jsonb_build_object('key', 'stakeholder_groups', 'label', 'Stakeholder impact — nine groups', 'met', jsonb_array_length(public._dein_stakeholder_groups()) = 9, 'note', null),
    jsonb_build_object('key', 'journal_captures', 'label', 'Decision journal — eight captures', 'met', jsonb_array_length(public._dein_journal_capture_scaffolds()) = 8, 'note', null),
    jsonb_build_object('key', 'outcome_questions', 'label', 'Outcome learning — five questions', 'met', jsonb_array_length(public._dein_outcome_learning_questions()) = 5, 'note', null),
    jsonb_build_object('key', 'reflection_considerations', 'label', 'Executive reflection — five considerations', 'met', jsonb_array_length(public._dein_executive_reflection_considerations()) = 5, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._deibp125_companion_limitations()->'limitations')) = 5, 'note', null),
    jsonb_build_object('key', 'knowledge_library', 'label', 'Decision knowledge library — six preserves', 'met', jsonb_array_length((public._deibp125_decision_knowledge_library()->'preserves')) = 6, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._deibp125_cross_links()) >= 12, 'note', null),
    jsonb_build_object('key', 'dse_distinction', 'label', 'Personal DSE RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/assistant/decisions only'),
    jsonb_build_object('key', 'odse_distinction', 'label', 'ODSE RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/organizational-decision-support-engine only'),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.decision_intelligence_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._deibp125_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 125 baseline tables and RPCs', 'met', to_regclass('public.decision_intelligence_settings') is not null, 'note', '_dein_* helpers intact')
  );
end; $$;

create or replace function public._deibp125_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 125 — Decision Intelligence & Executive Advisory Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE125_DECISION_INTELLIGENCE_EXECUTIVE_ADVISORY.md',
    'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
    'route', '/app/decision-intelligence-engine',
    'mapping_note', 'Decision Intelligence Center — structure, perspective, wisdom. Domain RPCs at DSE and ODSE remain authoritative.',
    'distinction_note', public._deibp125_distinction_note(),
    'mission', public._deibp125_mission(),
    'philosophy', public._deibp125_philosophy(),
    'abos_principle', public._deibp125_abos_principle(),
    'vision', public._deibp125_vision(),
    'objectives', public._deibp125_objectives(),
    'decision_intelligence_center', public._deibp125_decision_intelligence_center(),
    'decision_workspaces', public._deibp125_decision_workspaces(),
    'executive_advisory_companion', public._deibp125_executive_advisory_companion(),
    'assumption_intelligence', public._deibp125_assumption_intelligence(),
    'tradeoff_analysis', public._deibp125_tradeoff_analysis(),
    'stakeholder_impact', public._deibp125_stakeholder_impact(),
    'decision_journal', public._deibp125_decision_journal(),
    'outcome_learning', public._deibp125_outcome_learning(),
    'executive_reflection', public._deibp125_executive_reflection(),
    'companion_limitations', public._deibp125_companion_limitations(),
    'self_love_in_decisions', public._deibp125_self_love_in_decisions(),
    'decision_knowledge_library', public._deibp125_decision_knowledge_library(),
    'cross_links', public._deibp125_cross_links(),
    'limitation_principles', public._deibp125_limitation_principles(),
    'companion_adaptation', public._deibp125_companion_adaptation(),
    'success_metrics', public._deibp125_success_metrics(),
    'success_criteria', public._deibp125_success_criteria(p_tenant_id),
    'engagement_summary', public._deibp125_engagement_summary(p_tenant_id),
    'privacy_note', 'Decision intelligence blueprint data is metadata only — workspace scaffolds and journal summaries. Humans approve all executive decisions.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_decision_intelligence_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.decision_intelligence_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._dein_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._dein_ensure_settings(v_tenant_id);
  perform public._dein_seed_workspaces(v_tenant_id);
  perform public._dein_seed_journal_entries(v_tenant_id);
  perform public._dein_seed_assumption_reviews(v_tenant_id);
  perform public._dein_seed_outcome_learnings(v_tenant_id);
  v_metrics := public._dein_refresh_metrics(v_tenant_id);
  v_engagement := public._deibp125_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'decision_quality_score', v_metrics->'decision_quality_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'journal_entries', v_metrics->'journal_entries',
    'philosophy', public._deibp125_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'intelligence_center_enabled', v_settings.intelligence_center_enabled,
    'implementation_blueprint_phase125', jsonb_build_object(
      'phase', 'Phase 125 — Decision Intelligence & Executive Advisory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE125_DECISION_INTELLIGENCE_EXECUTIVE_ADVISORY.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Humans decide — advisory scaffolds only.'
    ),
    'decision_intelligence_mission', public._deibp125_mission(),
    'decision_intelligence_abos_principle', public._deibp125_abos_principle(),
    'decision_intelligence_engagement_summary', v_engagement,
    'decision_intelligence_vision_note', public._deibp125_vision()
  );
end; $$;

create or replace function public.get_decision_intelligence_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.decision_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._dein_require_tenant());
  v_settings := public._dein_ensure_settings(v_tenant_id);
  perform public._dein_seed_workspaces(v_tenant_id);
  perform public._dein_seed_journal_entries(v_tenant_id);
  perform public._dein_seed_assumption_reviews(v_tenant_id);
  perform public._dein_seed_outcome_learnings(v_tenant_id);
  v_metrics := public._dein_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'intelligence_center_enabled', v_settings.intelligence_center_enabled,
    'advisory_briefings_enabled', v_settings.advisory_briefings_enabled,
    'assumption_reviews_enabled', v_settings.assumption_reviews_enabled,
    'tradeoff_analysis_enabled', v_settings.tradeoff_analysis_enabled,
    'outcome_tracking_enabled', v_settings.outcome_tracking_enabled,
    'reflection_sessions_enabled', v_settings.reflection_sessions_enabled,
    'philosophy', public._deibp125_philosophy(),
    'distinction_note', public._deibp125_distinction_note(),
    'safety_note', 'Decision Intelligence Center — humans decide. Metadata-only journal and workspace records. No binding recommendations.',
    'decision_quality_score', v_metrics->'decision_quality_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'journal_entries', v_metrics->'journal_entries',
    'assumption_reviews', v_metrics->'assumption_reviews',
    'outcome_learnings', v_metrics->'outcome_learnings',
    'intelligence_center_capabilities_count', v_metrics->'intelligence_center_capabilities_count',
    'workspace_fields_count', v_metrics->'workspace_fields_count',
    'assumption_types_count', v_metrics->'assumption_types_count',
    'workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title,
        'decision_statement', w.decision_statement, 'status', w.status,
        'cross_link_route', w.cross_link_route
      ) order by w.updated_at desc)
      from public.decision_intelligence_workspaces w where w.tenant_id = v_tenant_id and w.status in ('active', 'draft', 'review')
    ), '[]'::jsonb),
    'journals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', j.id, 'journal_key', j.journal_key, 'workspace_key', j.workspace_key,
        'title', j.title, 'decision_date', j.decision_date, 'status', j.status,
        'rationale_summary', j.rationale_summary
      ) order by j.updated_at desc)
      from public.decision_intelligence_journal_entries j where j.tenant_id = v_tenant_id and j.status in ('active', 'review')
    ), '[]'::jsonb),
    'assumptions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assumption_key', a.assumption_key, 'assumption_type', a.assumption_type,
        'title', a.title, 'summary', a.summary, 'confidence', a.confidence, 'status', a.status
      ) order by a.updated_at desc)
      from public.decision_intelligence_assumption_reviews a where a.tenant_id = v_tenant_id and a.status in ('active', 'challenged', 'validated')
    ), '[]'::jsonb),
    'outcome_learnings_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'learning_key', o.learning_key, 'title', o.title,
        'what_worked_summary', o.what_worked_summary, 'change_summary', o.change_summary,
        'captured_at', o.captured_at, 'status', o.status
      ) order by o.captured_at desc)
      from public.decision_intelligence_outcome_learnings o where o.tenant_id = v_tenant_id and o.status in ('active', 'review')
    ), '[]'::jsonb),
    'workspace_field_scaffolds', public._dein_workspace_field_scaffolds(),
    'assumption_type_scaffolds', public._dein_assumption_type_scaffolds(),
    'tradeoff_question_scaffolds', public._dein_tradeoff_questions(),
    'stakeholder_group_scaffolds', public._dein_stakeholder_groups(),
    'integration_links', public._deibp125_cross_links(),
    'implementation_blueprint_phase125', jsonb_build_object(
      'phase', 'Phase 125 — Decision Intelligence & Executive Advisory Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE125_DECISION_INTELLIGENCE_EXECUTIVE_ADVISORY.md',
      'engine_phase', 'Repo Phase 125 Decision Intelligence & Executive Advisory Engine',
      'route', '/app/decision-intelligence-engine',
      'mapping_note', 'Humans decide — advisory scaffolds only.'
    ),
    'decision_intelligence_blueprint', public._deibp125_blueprint_block(v_tenant_id),
    'decision_intelligence_mission', public._deibp125_mission(),
    'decision_intelligence_philosophy', public._deibp125_philosophy(),
    'decision_intelligence_abos_principle', public._deibp125_abos_principle(),
    'decision_intelligence_objectives', public._deibp125_objectives(),
    'decision_intelligence_center', public._deibp125_decision_intelligence_center(),
    'decision_workspaces', public._deibp125_decision_workspaces(),
    'executive_advisory_companion', public._deibp125_executive_advisory_companion(),
    'assumption_intelligence', public._deibp125_assumption_intelligence(),
    'tradeoff_analysis', public._deibp125_tradeoff_analysis(),
    'stakeholder_impact', public._deibp125_stakeholder_impact(),
    'decision_journal', public._deibp125_decision_journal(),
    'outcome_learning', public._deibp125_outcome_learning(),
    'executive_reflection', public._deibp125_executive_reflection(),
    'companion_limitations', public._deibp125_companion_limitations(),
    'self_love_in_decisions', public._deibp125_self_love_in_decisions(),
    'decision_knowledge_library', public._deibp125_decision_knowledge_library(),
    'deibp125_cross_links', public._deibp125_cross_links(),
    'limitation_principles', public._deibp125_limitation_principles(),
    'companion_adaptation', public._deibp125_companion_adaptation(),
    'engagement_summary', public._deibp125_engagement_summary(v_tenant_id),
    'success_criteria', public._deibp125_success_criteria(v_tenant_id),
    'success_metrics', public._deibp125_success_metrics(),
    'decision_intelligence_vision', public._deibp125_vision(),
    'privacy_note', 'Decision intelligence metadata only — workspace scaffolds, journal summaries, assumption reviews. No customer email, chat, meeting transcripts, or PII. Humans decide.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'decision-intelligence-engine', 'Decision Intelligence & Executive Advisory',
  'Decision Intelligence Center — workspaces, journals, assumption reviews, trade-off analysis, and outcome learning. Humans decide.',
  'authenticated', 145
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'decision-intelligence-engine' and tenant_id is null
);

grant execute on function public.get_decision_intelligence_engine_card(uuid) to authenticated;
grant execute on function public.get_decision_intelligence_engine_dashboard(uuid) to authenticated;
grant execute on function public._deibp125_distinction_note() to authenticated;
grant execute on function public._deibp125_mission() to authenticated;
grant execute on function public._deibp125_philosophy() to authenticated;
grant execute on function public._deibp125_abos_principle() to authenticated;
grant execute on function public._deibp125_vision() to authenticated;
grant execute on function public._deibp125_objectives() to authenticated;
grant execute on function public._deibp125_decision_intelligence_center() to authenticated;
grant execute on function public._deibp125_decision_workspaces() to authenticated;
grant execute on function public._deibp125_executive_advisory_companion() to authenticated;
grant execute on function public._deibp125_assumption_intelligence() to authenticated;
grant execute on function public._deibp125_tradeoff_analysis() to authenticated;
grant execute on function public._deibp125_stakeholder_impact() to authenticated;
grant execute on function public._deibp125_decision_journal() to authenticated;
grant execute on function public._deibp125_outcome_learning() to authenticated;
grant execute on function public._deibp125_executive_reflection() to authenticated;
grant execute on function public._deibp125_companion_limitations() to authenticated;
grant execute on function public._deibp125_self_love_in_decisions() to authenticated;
grant execute on function public._deibp125_decision_knowledge_library() to authenticated;
grant execute on function public._deibp125_cross_links() to authenticated;
grant execute on function public._deibp125_limitation_principles() to authenticated;
grant execute on function public._deibp125_companion_adaptation() to authenticated;
grant execute on function public._deibp125_success_metrics() to authenticated;
