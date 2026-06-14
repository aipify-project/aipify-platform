-- Phase 137 — Collective Decision & Human-Companion Council Engine
-- Autonomous Organization Era (131–140). Collective council with human-companion perspectives.
-- Distinct from Decision Intelligence Phase 125 (/app/decision-intelligence-engine) and ODSE A.54.
-- Helpers: _cdcc_* (engine), _cdccbp137_* (blueprint — never collide with _dein_*, _deibp125_*, _odse_*)

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
    'organizational_wisdom_engine',
    'companion_workforce',
    'proactive_organization',
    'collective_decision_council'
  )
);

-- ---------------------------------------------------------------------------
-- 1. collective_decision_council_settings
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_council_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  council_center_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  disagreement_framework_enabled boolean not null default true,
  companion_advisory_enabled boolean not null default true,
  stakeholder_mapping_enabled boolean not null default true,
  transparency_records_enabled boolean not null default true,
  council_memory_enabled boolean not null default true,
  default_governance_tier text not null default 'assisted' check (
    default_governance_tier in ('observer', 'assisted', 'guided', 'governed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collective_decision_council_settings enable row level security;
revoke all on public.collective_decision_council_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. collective_decision_workspaces
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_workspaces (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workspace_key text not null,
  title text not null,
  context_summary text not null check (char_length(context_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'deliberating', 'review', 'decided', 'archived')
  ),
  governance_tier text not null default 'assisted' check (
    governance_tier in ('observer', 'assisted', 'guided', 'governed')
  ),
  cross_link_route text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workspace_key)
);

create index if not exists collective_decision_workspaces_tenant_idx
  on public.collective_decision_workspaces (tenant_id, status);

alter table public.collective_decision_workspaces enable row level security;
revoke all on public.collective_decision_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. collective_decision_perspectives
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_perspectives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  perspective_key text not null,
  workspace_key text not null,
  contributor_type text not null check (contributor_type in ('human', 'companion')),
  role text not null,
  summary text not null check (char_length(summary) <= 500),
  perspective_type text not null default 'opportunity' check (
    perspective_type in (
      'opportunity', 'risk', 'beneficiary', 'negative_effect',
      'knowledge_gap', 'assumption'
    )
  ),
  status text not null default 'active' check (status in ('active', 'challenged', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, perspective_key)
);

create index if not exists collective_decision_perspectives_tenant_idx
  on public.collective_decision_perspectives (tenant_id, workspace_key, contributor_type);

alter table public.collective_decision_perspectives enable row level security;
revoke all on public.collective_decision_perspectives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. collective_decision_stakeholder_impacts
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_stakeholder_impacts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  impact_key text not null,
  workspace_key text not null,
  stakeholder_group text not null,
  impact_summary text not null check (char_length(impact_summary) <= 500),
  impact_level text not null default 'moderate' check (impact_level in ('low', 'moderate', 'high')),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, impact_key)
);

create index if not exists collective_decision_stakeholder_impacts_tenant_idx
  on public.collective_decision_stakeholder_impacts (tenant_id, workspace_key);

alter table public.collective_decision_stakeholder_impacts enable row level security;
revoke all on public.collective_decision_stakeholder_impacts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. collective_decision_transparency_records
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_transparency_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  transparency_key text not null,
  workspace_key text not null,
  context_summary text check (char_length(context_summary) <= 500),
  alternatives_summary text check (char_length(alternatives_summary) <= 500),
  consulted_stakeholders_summary text check (char_length(consulted_stakeholders_summary) <= 500),
  companion_contributions_summary text check (char_length(companion_contributions_summary) <= 500),
  rationale_summary text check (char_length(rationale_summary) <= 500),
  expected_outcomes_summary text check (char_length(expected_outcomes_summary) <= 500),
  follow_up_commitments_summary text check (char_length(follow_up_commitments_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, transparency_key)
);

create index if not exists collective_decision_transparency_records_tenant_idx
  on public.collective_decision_transparency_records (tenant_id, workspace_key);

alter table public.collective_decision_transparency_records enable row level security;
revoke all on public.collective_decision_transparency_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. collective_decision_council_memory
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_council_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  workspace_key text,
  lesson_summary text check (char_length(lesson_summary) <= 500),
  outcome_summary text check (char_length(outcome_summary) <= 500),
  reflection_summary text check (char_length(reflection_summary) <= 500),
  knowledge_refs_summary text check (char_length(knowledge_refs_summary) <= 500),
  governance_considerations_summary text check (char_length(governance_considerations_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'review', 'archived')),
  captured_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists collective_decision_council_memory_tenant_idx
  on public.collective_decision_council_memory (tenant_id, status, captured_at desc);

alter table public.collective_decision_council_memory enable row level security;
revoke all on public.collective_decision_council_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. collective_decision_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.collective_decision_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.collective_decision_audit_logs enable row level security;
revoke all on public.collective_decision_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'collective_decision_council_engine', v.description
from (values
  ('collective_decision.view', 'View Collective Decision Council Engine', 'View collective decision workspaces, perspectives, and council scaffolds'),
  ('collective_decision.manage', 'Manage Collective Decision Council Engine', 'Update council settings and workspace metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'collective_decision.view'), ('owner', 'collective_decision.manage'),
  ('administrator', 'collective_decision.view'), ('administrator', 'collective_decision.manage'),
  ('manager', 'collective_decision.view'), ('manager', 'collective_decision.manage'),
  ('employee', 'collective_decision.view'),
  ('support_agent', 'collective_decision.view'),
  ('moderator', 'collective_decision.view'),
  ('viewer', 'collective_decision.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 9. Baseline helpers (_cdcc_)
-- ---------------------------------------------------------------------------
create or replace function public._cdcc_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cdcc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cdcc_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cdcc_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.collective_decision_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cdcc_ensure_settings(p_tenant_id uuid)
returns public.collective_decision_council_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.collective_decision_council_settings;
begin
  insert into public.collective_decision_council_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.collective_decision_council_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cdcc_perspective_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'opportunity', 'label', 'Opportunities', 'description', 'Potential positive outcomes and openings'),
    jsonb_build_object('key', 'risk', 'label', 'Risks', 'description', 'Potential downsides — stewardship not alarm'),
    jsonb_build_object('key', 'beneficiary', 'label', 'Beneficiaries', 'description', 'Stakeholder groups that may gain'),
    jsonb_build_object('key', 'negative_effect', 'label', 'Negative effects', 'description', 'Stakeholder groups that may bear impact'),
    jsonb_build_object('key', 'knowledge_gap', 'label', 'Knowledge gaps', 'description', 'What remains unknown — transparency required'),
    jsonb_build_object('key', 'assumption', 'label', 'Assumptions', 'description', 'Hypotheses visible and challengeable')
  );
$$;

create or replace function public._cdcc_stakeholder_groups()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employees', 'label', 'Employees', 'description', 'Workforce impact — roles not individuals'),
    jsonb_build_object('key', 'customers', 'label', 'Customers', 'description', 'Customer experience and trust'),
    jsonb_build_object('key', 'gps', 'label', 'Growth Partners', 'description', 'Partner ecosystem — cross-link GP Ops Phase 114'),
    jsonb_build_object('key', 'communities', 'label', 'Communities', 'description', 'Community impact — cross-link Phase 117'),
    jsonb_build_object('key', 'leadership', 'label', 'Leadership', 'description', 'Executive accountability and capacity'),
    jsonb_build_object('key', 'boards', 'label', 'Boards', 'description', 'Governance oversight — cross-link Governance A.14'),
    jsonb_build_object('key', 'knowledge_contributors', 'label', 'Knowledge contributors', 'description', 'KC and organizational memory — cross-link A.34'),
    jsonb_build_object('key', 'future_stakeholders', 'label', 'Future stakeholders', 'description', 'Long-term and legacy considerations')
  );
$$;

create or replace function public._cdcc_disagreement_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'respectful_challenge', 'label', 'Respectful challenge', 'description', 'Disagreement strengthens wisdom — never suppressed'),
    jsonb_build_object('key', 'constructive_dialogue', 'label', 'Constructive dialogue', 'description', 'Curiosity and evidence over winning arguments'),
    jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety', 'description', 'Council members may dissent without penalty'),
    jsonb_build_object('key', 'evidence_based', 'label', 'Evidence-based', 'description', 'Claims grounded in metadata summaries — not certainty'),
    jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'description', 'Explore alternatives before converging'),
    jsonb_build_object('key', 'humility', 'label', 'Humility', 'description', 'Assumptions may be wrong — collective wisdom not consensus at all costs')
  );
$$;

create or replace function public._cdcc_council_participant_roles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executives', 'label', 'Executives', 'description', 'Decision accountability — humans responsible'),
    jsonb_build_object('key', 'dept_leaders', 'label', 'Department leaders', 'description', 'Operational perspective and capacity signals'),
    jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge stewards', 'description', 'KC and organizational memory context'),
    jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'description', 'Partner ecosystem perspective — never Affiliate'),
    jsonb_build_object('key', 'governance_reps', 'label', 'Governance representatives', 'description', 'Policy and approval alignment — cross-link A.14'),
    jsonb_build_object('key', 'smes', 'label', 'Subject matter experts', 'description', 'Domain expertise — role labels only'),
    jsonb_build_object('key', 'relevant_companions', 'label', 'Relevant companions', 'description', 'Advisory perspectives — companions advise, never vote')
  );
$$;

create or replace function public._cdcc_seed_workspaces(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.collective_decision_workspaces where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.collective_decision_workspaces (
    tenant_id, workspace_key, title, context_summary, status, governance_tier, cross_link_route
  ) values
    (p_tenant_id, 'companion-governance-council', 'Companion governance council review',
     'Whether to elevate companion governance tier for operations companions — collective council deliberation.',
     'deliberating', 'governed', '/app/governance-policy-engine'),
    (p_tenant_id, 'expansion-stakeholder-council', 'Market expansion stakeholder council',
     'Cross-functional council on phased market expansion — human perspectives with companion advisory context.',
     'active', 'guided', '/app/decision-intelligence-engine'),
    (p_tenant_id, 'workforce-adoption-council', 'Companion workforce adoption council',
     'Department leaders and companions review adoption pace — disagreement welcomed, humans decide.',
     'draft', 'assisted', '/app/companion-workforce-engine');
end; $$;

create or replace function public._cdcc_seed_perspectives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.collective_decision_perspectives where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.collective_decision_perspectives (
    tenant_id, perspective_key, workspace_key, contributor_type, role, summary, perspective_type, status
  ) values
    (p_tenant_id, 'exec-capacity-human', 'expansion-stakeholder-council', 'human', 'Executive lead',
     'Leadership bandwidth limited this quarter — phased approach may reduce change fatigue.', 'risk', 'active'),
    (p_tenant_id, 'ops-companion-advisory', 'expansion-stakeholder-council', 'companion', 'Operations companion',
     'Historical metadata suggests prior expansions benefited from GP readiness checkpoints — advisory only.', 'knowledge_gap', 'active'),
    (p_tenant_id, 'gp-perspective-human', 'expansion-stakeholder-council', 'human', 'Growth Partner lead',
     'Partner network signals readiness in two regions — hypothesis from aggregate feedback.', 'opportunity', 'active'),
    (p_tenant_id, 'governance-human', 'companion-governance-council', 'human', 'Governance representative',
     'Elevated tier requires board-aligned approval policy update — cross-link Trust Actions.', 'assumption', 'active'),
    (p_tenant_id, 'governance-companion', 'companion-governance-council', 'companion', 'Governance companion',
     'Companion may summarize policy gaps from metadata — does not vote or override governance.', 'knowledge_gap', 'active'),
    (p_tenant_id, 'dept-leader-human', 'workforce-adoption-council', 'human', 'Department leader',
     'Pilot departments show positive adoption — uneven skill development remains a concern.', 'negative_effect', 'challenged');
end; $$;

create or replace function public._cdcc_seed_stakeholder_impacts(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.collective_decision_stakeholder_impacts where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.collective_decision_stakeholder_impacts (
    tenant_id, impact_key, workspace_key, stakeholder_group, impact_summary, impact_level, status
  ) values
    (p_tenant_id, 'expansion-employees', 'expansion-stakeholder-council', 'employees',
     'Training and change capacity may strain during rapid expansion — role-level summary.', 'moderate', 'active'),
    (p_tenant_id, 'expansion-gps', 'expansion-stakeholder-council', 'gps',
     'Growth Partners may gain new market reach — enablement bandwidth hypothesis.', 'moderate', 'active'),
    (p_tenant_id, 'expansion-customers', 'expansion-stakeholder-council', 'customers',
     'Service continuity during transition — metadata signal from support trends.', 'low', 'active'),
    (p_tenant_id, 'governance-boards', 'companion-governance-council', 'boards',
     'Board expects documented rationale for tier elevation — transparency required.', 'high', 'active');
end; $$;

create or replace function public._cdcc_seed_transparency_records(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.collective_decision_transparency_records where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.collective_decision_transparency_records (
    tenant_id, transparency_key, workspace_key, context_summary, alternatives_summary,
    consulted_stakeholders_summary, companion_contributions_summary, rationale_summary,
    expected_outcomes_summary, follow_up_commitments_summary, status
  ) values
    (p_tenant_id, 'expansion-transparency', 'expansion-stakeholder-council',
     'Council convened for phased expansion decision — metadata context only.',
     'Full expansion · phased rollout · partner-led growth · defer.',
     'Executives · department leads · GP leads · knowledge stewards — role labels only.',
     'Operations companion summarized historical expansion metadata — advisory, no vote.',
     'Phased approach balances growth with operational stability — human judgment.',
     'Revenue uplift hypothesis in target segment within 12 months — not guaranteed.',
     'Define phase-one scope · schedule council memory review in 90 days.', 'active');
end; $$;

create or replace function public._cdcc_seed_council_memory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.collective_decision_council_memory where tenant_id = p_tenant_id limit 1) then return; end if;

  insert into public.collective_decision_council_memory (
    tenant_id, memory_key, workspace_key, lesson_summary, outcome_summary, reflection_summary,
    knowledge_refs_summary, governance_considerations_summary, status
  ) values
    (p_tenant_id, 'prior-council-lesson', 'expansion-stakeholder-council',
     'Prior council deliberations benefited from explicit disagreement rounds — dissent strengthened final rationale.',
     'Phased expansion reduced operational strain when GP readiness checkpoint was included.',
     'Council reflection: patience and humility improved stakeholder mapping quality.',
     'Cross-link Organizational Memory A.34 and Decision Intelligence Phase 125 journals.',
     'Governance tier review documented for board visibility — cross-link A.14.', 'active');
end; $$;

create or replace function public._cdcc_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_active_workspaces int;
  v_perspectives int;
  v_stakeholder_impacts int;
  v_transparency_records int;
  v_council_memory int;
  v_human_perspectives int;
  v_companion_perspectives int;
  v_wisdom_score numeric;
begin
  select count(*) into v_active_workspaces from public.collective_decision_workspaces
  where tenant_id = p_tenant_id and status in ('active', 'draft', 'deliberating', 'review');
  select count(*) into v_perspectives from public.collective_decision_perspectives
  where tenant_id = p_tenant_id and status in ('active', 'challenged');
  select count(*) into v_human_perspectives from public.collective_decision_perspectives
  where tenant_id = p_tenant_id and contributor_type = 'human' and status in ('active', 'challenged');
  select count(*) into v_companion_perspectives from public.collective_decision_perspectives
  where tenant_id = p_tenant_id and contributor_type = 'companion' and status in ('active', 'challenged');
  select count(*) into v_stakeholder_impacts from public.collective_decision_stakeholder_impacts
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_transparency_records from public.collective_decision_transparency_records
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_council_memory from public.collective_decision_council_memory
  where tenant_id = p_tenant_id and status in ('active', 'review');

  v_wisdom_score := least(100, round(
    (v_active_workspaces * 7.0) + (v_perspectives * 4.0) + (v_stakeholder_impacts * 3.0)
    + (v_transparency_records * 6.0) + (v_council_memory * 8.0)
  , 1));

  return jsonb_build_object(
    'council_wisdom_score', v_wisdom_score,
    'active_workspaces', v_active_workspaces,
    'perspectives', v_perspectives,
    'human_perspectives', v_human_perspectives,
    'companion_perspectives', v_companion_perspectives,
    'stakeholder_impacts', v_stakeholder_impacts,
    'transparency_records', v_transparency_records,
    'council_memory_entries', v_council_memory,
    'council_center_capabilities_count', 8,
    'perspective_types_count', jsonb_array_length(public._cdcc_perspective_type_scaffolds()),
    'stakeholder_groups_count', jsonb_array_length(public._cdcc_stakeholder_groups()),
    'disagreement_principles_count', jsonb_array_length(public._cdcc_disagreement_principles()),
    'council_participant_roles_count', jsonb_array_length(public._cdcc_council_participant_roles()),
    'companion_advisory_supports_count', 7
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Blueprint helpers (_cdccbp137_)
-- ---------------------------------------------------------------------------
create or replace function public._cdccbp137_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 137 — Collective Decision & Human-Companion Council Engine at /app/collective-decision-council-engine. Collective wisdom not consensus at all costs — disagreement strengthens wisdom; companions advise, never vote; humans remain decision-makers. Distinct from Decision Intelligence Phase 125 at /app/decision-intelligence-engine (executive advisory workspaces — cross-link only, never duplicate _dein_* / _deibp125_*); Organizational Decision Support A.54 at /app/organizational-decision-support-engine (org decision register — cross-link only, never duplicate _odse_*); AI Ethics Responsible Use A.46 at /app/ai-ethics-responsible-use-engine (ethics council — cross-link only). Cross-links Executive Intelligence Phase 121, Companion Workforce Phase 132, Governance A.14, Organizational Memory A.34, Human Oversight A.40, Self Love A.76, Trust Actions Phase 30. Helpers _cdccbp137_* — metadata only, no raw sensitive decision content.';
$$;

create or replace function public._cdccbp137_mission()
returns text language sql immutable as $$
  select 'Bring human and companion perspectives together in collective council deliberation — expanding awareness, surfacing disagreement respectfully, and documenting transparent rationale while humans retain full decision authority.';
$$;

create or replace function public._cdccbp137_philosophy()
returns text language sql immutable as $$
  select 'People First. Wisdom before speed. Collective wisdom not consensus at all costs. Companions expand awareness — they do not vote. Transparency builds trust. Growth Partner terminology — never Affiliate. Metadata only — no raw sensitive decision content.';
$$;

create or replace function public._cdccbp137_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Collective Decision Council orchestrates workspaces, perspective collection, companion advisory contributions, stakeholder mapping, disagreement frameworks, and council memory. Decision Intelligence and ODSE remain authoritative for their domains. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._cdccbp137_vision()
returns text language sql immutable as $$
  select 'Organizations make wiser collective decisions — respectful disagreement, companion-expanded awareness, transparent rationale, and institutional memory that honors both human judgment and companion advisory support.';
$$;

create or replace function public._cdccbp137_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Collective wisdom, not consensus at all costs',
    'Disagreement strengthens wisdom',
    'Companions advise — humans decide',
    'Transparency builds trust',
    'Wisdom before speed'
  );
$$;

create or replace function public._cdccbp137_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'collective_perspectives', 'emoji', '🦉', 'label', 'Collect diverse perspectives', 'description', 'Human and companion contributions in council workspaces'),
    jsonb_build_object('key', 'respectful_disagreement', 'emoji', '🌹', 'label', 'Respectful disagreement', 'description', 'Psychological safety for constructive challenge'),
    jsonb_build_object('key', 'stakeholder_awareness', 'emoji', '🔔', 'label', 'Stakeholder awareness', 'description', 'Impact mapping across eight stakeholder groups'),
    jsonb_build_object('key', 'companion_advisory', 'emoji', '🦉', 'label', 'Companion advisory context', 'description', 'Companions expand awareness — never vote'),
    jsonb_build_object('key', 'decision_transparency', 'emoji', '🌹', 'label', 'Decision transparency', 'description', 'Alternatives, rationale, and follow-up documented'),
    jsonb_build_object('key', 'council_memory', 'emoji', '🔔', 'label', 'Council memory', 'description', 'Lessons and reflections — cross-link Org Memory A.34'),
    jsonb_build_object('key', 'governance_integration', 'emoji', '🦉', 'label', 'Governance integration', 'description', 'Cross-link Governance A.14 and Trust Actions'),
    jsonb_build_object('key', 'human_accountability', 'emoji', '🌹', 'label', 'Human accountability', 'description', 'Humans remain decision-makers — companions never vote')
  );
$$;

create or replace function public._cdccbp137_collective_decision_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective Decision Center — eight capabilities for human-companion council deliberation.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'decision_workspaces', 'label', 'Decision workspaces', 'description', 'Major decision workspaces with governance tiers'),
      jsonb_build_object('key', 'perspective_collection', 'label', 'Perspective collection', 'description', 'Human and companion perspective contributions'),
      jsonb_build_object('key', 'companion_contributions', 'label', 'Companion contributions', 'description', 'Advisory summaries — companions do not vote'),
      jsonb_build_object('key', 'executive_reviews', 'label', 'Executive reviews', 'description', 'Cross-link Executive Intelligence Phase 121'),
      jsonb_build_object('key', 'governance_integration', 'label', 'Governance integration', 'description', 'Cross-link Governance A.14 and approvals'),
      jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping', 'description', 'Eight stakeholder groups — roles not individuals'),
      jsonb_build_object('key', 'reflection_sessions', 'label', 'Reflection sessions', 'description', 'Council memory and lessons learned'),
      jsonb_build_object('key', 'decision_histories', 'label', 'Decision histories', 'description', 'Transparency records and council memory cross-links')
    )
  );
$$;

create or replace function public._cdccbp137_human_companion_council_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human-Companion Council Model — seven participant roles. Humans responsible; companions advise.',
    'roles', public._cdcc_council_participant_roles(),
    'boundary_note', 'Companions participate as advisors — never voting members.'
  );
$$;

create or replace function public._cdccbp137_decision_perspective_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision perspective engine — six perspective types for council contributions.',
    'types', public._cdcc_perspective_type_scaffolds(),
    'boundary_note', 'Perspectives are metadata summaries — expand thinking, not binding outcomes.'
  );
$$;

create or replace function public._cdccbp137_companion_advisory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion Advisory Engine — seven supports. Expands awareness — does NOT vote.',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_summaries', 'label', 'Knowledge summaries', 'description', 'KC and organizational memory context'),
      jsonb_build_object('key', 'trend_context', 'label', 'Trend context', 'description', 'Aggregate trend metadata — not surveillance'),
      jsonb_build_object('key', 'historical_refs', 'label', 'Historical references', 'description', 'Prior council memory and Org Memory cross-links'),
      jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility', 'description', 'Gentle surfacing of overlooked risks'),
      jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping', 'description', 'Companion-assisted impact awareness'),
      jsonb_build_object('key', 'alternative_viewpoints', 'label', 'Alternative viewpoints', 'description', 'Multiple perspectives always presented'),
      jsonb_build_object('key', 'question_generation', 'label', 'Question generation', 'description', 'Thoughtful questions that expand council deliberation')
    ),
    'boundary_note', 'Companions advise — never vote, never override human judgment.'
  );
$$;

create or replace function public._cdccbp137_stakeholder_impact_review()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stakeholder impact review — eight groups. Roles not individuals.',
    'groups', public._cdcc_stakeholder_groups(),
    'boundary_note', 'Stakeholder mapping for awareness — not surveillance or ranking.'
  );
$$;

create or replace function public._cdccbp137_disagreement_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Disagreement framework — six principles. Collective wisdom not consensus at all costs.',
    'principles', public._cdcc_disagreement_principles(),
    'boundary_note', 'Dissent welcomed — never suppressed for false harmony.'
  );
$$;

create or replace function public._cdccbp137_decision_transparency_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision transparency engine — seven captures. Metadata only.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'context', 'label', 'Context', 'description', 'Decision background summary'),
      jsonb_build_object('key', 'alternatives', 'label', 'Alternatives', 'description', 'Options considered — expand thinking'),
      jsonb_build_object('key', 'stakeholders_consulted', 'label', 'Stakeholders consulted', 'description', 'Role labels only — no PII'),
      jsonb_build_object('key', 'companion_contributions', 'label', 'Companion contributions', 'description', 'Advisory summaries — companions did not vote'),
      jsonb_build_object('key', 'rationale', 'label', 'Rationale', 'description', 'Human judgment documented'),
      jsonb_build_object('key', 'expected_outcomes', 'label', 'Expected outcomes', 'description', 'Hypotheses — not guarantees'),
      jsonb_build_object('key', 'follow_up', 'label', 'Follow-up commitments', 'description', 'Accountability and council memory hooks')
    ),
    'boundary_note', 'Transparency records store metadata — never raw transcripts or PII.'
  );
$$;

create or replace function public._cdccbp137_council_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Council memory engine — lessons, outcomes, reflections. Cross-link Org Memory A.34.',
    'preserves', jsonb_build_array(
      jsonb_build_object('key', 'lessons', 'label', 'Lessons learned', 'description', 'What the council learned — no blame framing'),
      jsonb_build_object('key', 'outcomes', 'label', 'Outcomes', 'description', 'Observed results metadata'),
      jsonb_build_object('key', 'historical_context', 'label', 'Historical context', 'description', 'Prior deliberation references'),
      jsonb_build_object('key', 'reflections', 'label', 'Reflections', 'description', 'Council reflection notes — metadata only'),
      jsonb_build_object('key', 'knowledge_refs', 'label', 'Knowledge references', 'description', 'KC and Wisdom Engine cross-links'),
      jsonb_build_object('key', 'governance', 'label', 'Governance considerations', 'description', 'Board and policy alignment notes')
    ),
    'org_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Council memory complements Org Memory — cross-link, do not duplicate A.34 RPCs.'
  );
$$;

create or replace function public._cdccbp137_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion limitations — five boundaries in collective council.',
    'limitations', jsonb_build_array(
      jsonb_build_object('key', 'no_voting', 'label', 'No voting', 'description', 'Companions never vote in council deliberation'),
      jsonb_build_object('key', 'no_governance_override', 'label', 'No governance override', 'description', 'Never bypass Governance A.14 or Trust Actions'),
      jsonb_build_object('key', 'no_false_certainty', 'label', 'No false certainty', 'description', 'Uncertainty remains visible'),
      jsonb_build_object('key', 'no_suppressing_dissent', 'label', 'No suppressing dissent', 'description', 'Disagreement always welcome'),
      jsonb_build_object('key', 'no_replacing_accountability', 'label', 'No replacing accountability', 'description', 'Humans remain decision-makers')
    )
  );
$$;

create or replace function public._cdccbp137_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in collective decisions — reflection, patience, humility, empathy, courage, respect.',
    'practices', jsonb_build_array(
      'Reflection — pause before converging',
      'Patience — wisdom before speed',
      'Humility — assumptions may be wrong',
      'Empathy — consider stakeholder wellbeing',
      'Courage — voice respectful disagreement',
      'Respect — psychological safety in council'
    ),
    'route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports thoughtful collective deliberation — never pressure or guilt.'
  );
$$;

create or replace function public._cdccbp137_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_audit', 'label', 'Decision audit', 'description', 'Full audit via collective_decision_audit_logs'),
    jsonb_build_object('key', 'council_participation', 'label', 'Council participation records', 'description', 'Role labels only — metadata'),
    jsonb_build_object('key', 'companion_advisory_history', 'label', 'Companion advisory histories', 'description', 'Advisory contributions logged — not votes'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility', 'description', 'Cross-link Executive Intelligence Phase 121'),
    jsonb_build_object('key', 'rbac', 'label', 'RBAC', 'description', 'collective_decision.view and collective_decision.manage'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'description', 'Cross-link /app/settings/two-factor for sensitive council actions')
  );
$$;

create or replace function public._cdccbp137_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decision_intelligence', 'label', 'Decision Intelligence Phase 125', 'route', '/app/decision-intelligence-engine', 'relationship', 'Executive advisory workspaces — cross-link only'),
    jsonb_build_object('key', 'odse', 'label', 'Organizational Decision Support A.54', 'route', '/app/organizational-decision-support-engine', 'relationship', 'Org decision register — cross-link only'),
    jsonb_build_object('key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'relationship', 'Leadership companion cross-link'),
    jsonb_build_object('key', 'companion_workforce', 'label', 'Companion Workforce Phase 132', 'route', '/app/companion-workforce-engine', 'relationship', 'Companion roles and coordination'),
    jsonb_build_object('key', 'governance', 'label', 'Governance Policy A.14', 'route', '/app/governance-policy-engine', 'relationship', 'Governance integration'),
    jsonb_build_object('key', 'org_memory', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'relationship', 'Decision register and lessons'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'relationship', 'Oversight gates and approval workflows'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Reflection and psychological safety'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'relationship', 'Sensitive action approvals'),
    jsonb_build_object('key', 'ai_ethics', 'label', 'AI Ethics A.46', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Ethics council — distinct from collective decision council'),
    jsonb_build_object('key', 'proactive_organization', 'label', 'Proactive Organization Phase 135', 'route', '/app/proactive-organization-engine', 'relationship', 'Era 131–140 cross-link'),
    jsonb_build_object('key', 'strategic_foresight', 'label', 'Strategic Foresight Phase 122', 'route', '/app/strategic-foresight-engine', 'relationship', 'Foresight context for council deliberation')
  );
$$;

create or replace function public._cdccbp137_dogfooding()
returns text language sql immutable as $$
  select 'Aipify Group uses Collective Decision Council scaffolds internally for major platform decisions — metadata summaries, companion advisory context, and transparent rationale. Dogfooding validates council memory and disagreement frameworks before customer rollout.';
$$;

create or replace function public._cdccbp137_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'perspective_diversity', 'label', 'Richer perspective diversity'),
    jsonb_build_object('key', 'respectful_disagreement', 'label', 'Healthier respectful disagreement'),
    jsonb_build_object('key', 'stakeholder_awareness', 'label', 'Stronger stakeholder awareness'),
    jsonb_build_object('key', 'decision_transparency', 'label', 'Greater decision transparency'),
    jsonb_build_object('key', 'council_memory', 'label', 'Growing council memory'),
    jsonb_build_object('key', 'human_confidence', 'label', 'Human confidence through preparation'),
    jsonb_build_object('key', 'companion_value', 'label', 'Companion advisory value without voting'),
    jsonb_build_object('key', 'institutional_wisdom', 'label', 'Institutional collective wisdom')
  );
$$;

create or replace function public._cdccbp137_privacy_note()
returns text language sql immutable as $$
  select 'Collective decision council data is metadata only — workspace scaffolds, perspective summaries, stakeholder impact metadata. No customer email, chat, meeting transcripts, or PII. Companions advise; humans decide.';
$$;

create or replace function public._cdccbp137_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cdcc_ensure_settings(p_tenant_id);
  perform public._cdcc_seed_workspaces(p_tenant_id);
  perform public._cdcc_seed_perspectives(p_tenant_id);
  perform public._cdcc_seed_stakeholder_impacts(p_tenant_id);
  perform public._cdcc_seed_transparency_records(p_tenant_id);
  perform public._cdcc_seed_council_memory(p_tenant_id);
  v_metrics := public._cdcc_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'council_wisdom_score', coalesce((v_metrics->>'council_wisdom_score')::numeric, 0),
    'active_workspaces', coalesce((v_metrics->>'active_workspaces')::int, 0),
    'perspectives', coalesce((v_metrics->>'perspectives')::int, 0),
    'human_perspectives', coalesce((v_metrics->>'human_perspectives')::int, 0),
    'companion_perspectives', coalesce((v_metrics->>'companion_perspectives')::int, 0),
    'stakeholder_impacts', coalesce((v_metrics->>'stakeholder_impacts')::int, 0),
    'transparency_records', coalesce((v_metrics->>'transparency_records')::int, 0),
    'council_memory_entries', coalesce((v_metrics->>'council_memory_entries')::int, 0),
    'council_center_capabilities_count', coalesce((v_metrics->>'council_center_capabilities_count')::int, 8),
    'integration_links_count', jsonb_array_length(public._cdccbp137_integration_links()),
    'vision_phrases', public._cdccbp137_vision_phrases(),
    'privacy_note', public._cdccbp137_privacy_note()
  );
end; $$;

create or replace function public._cdccbp137_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cdcc_ensure_settings(p_tenant_id);
  perform public._cdcc_seed_workspaces(p_tenant_id);
  perform public._cdcc_seed_perspectives(p_tenant_id);
  perform public._cdcc_seed_stakeholder_impacts(p_tenant_id);
  perform public._cdcc_seed_transparency_records(p_tenant_id);
  perform public._cdcc_seed_council_memory(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'objectives', 'label', 'Objectives — eight documented', 'met', jsonb_array_length(public._cdccbp137_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'council_center', 'label', 'Collective Decision Center — eight capabilities', 'met', jsonb_array_length((public._cdccbp137_collective_decision_center()->'capabilities')) = 8, 'note', null),
    jsonb_build_object('key', 'council_roles', 'label', 'Human-Companion Council Model — seven roles', 'met', jsonb_array_length(public._cdcc_council_participant_roles()) = 7, 'note', null),
    jsonb_build_object('key', 'perspective_types', 'label', 'Decision perspective engine — six types', 'met', jsonb_array_length(public._cdcc_perspective_type_scaffolds()) = 6, 'note', null),
    jsonb_build_object('key', 'companion_advisory', 'label', 'Companion advisory engine — seven supports', 'met', jsonb_array_length((public._cdccbp137_companion_advisory_engine()->'supports')) = 7, 'note', null),
    jsonb_build_object('key', 'stakeholder_groups', 'label', 'Stakeholder impact review — eight groups', 'met', jsonb_array_length(public._cdcc_stakeholder_groups()) = 8, 'note', null),
    jsonb_build_object('key', 'disagreement', 'label', 'Disagreement framework — six principles', 'met', jsonb_array_length(public._cdcc_disagreement_principles()) = 6, 'note', null),
    jsonb_build_object('key', 'transparency', 'label', 'Decision transparency — seven captures', 'met', jsonb_array_length((public._cdccbp137_decision_transparency_engine()->'captures')) = 7, 'note', null),
    jsonb_build_object('key', 'council_memory', 'label', 'Council memory engine — six preserves', 'met', jsonb_array_length((public._cdccbp137_council_memory_engine()->'preserves')) = 6, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five documented', 'met', jsonb_array_length((public._cdccbp137_companion_limitations()->'limitations')) = 5, 'note', null),
    jsonb_build_object('key', 'security', 'label', 'Security requirements — six documented', 'met', jsonb_array_length(public._cdccbp137_security_requirements()) = 6, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links documented', 'met', jsonb_array_length(public._cdccbp137_integration_links()) >= 11, 'note', null),
    jsonb_build_object('key', 'dein_distinction', 'label', 'Decision Intelligence RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/decision-intelligence-engine only'),
    jsonb_build_object('key', 'odse_distinction', 'label', 'ODSE RPC duplication avoided', 'met', true, 'note', 'Cross-link /app/organizational-decision-support-engine only'),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.collective_decision_council_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._cdccbp137_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 137 baseline tables and RPCs', 'met', to_regclass('public.collective_decision_council_settings') is not null, 'note', '_cdcc_* helpers intact')
  );
end; $$;

create or replace function public._cdccbp137_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 137 — Collective Decision & Human-Companion Council Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE137_COLLECTIVE_DECISION_HUMAN_COMPANION_COUNCIL.md',
    'engine_phase', 'Repo Phase 137 Collective Decision & Human-Companion Council Engine',
    'route', '/app/collective-decision-council-engine',
    'distinction_note', public._cdccbp137_distinction_note(),
    'mission', public._cdccbp137_mission(),
    'philosophy', public._cdccbp137_philosophy(),
    'abos_principle', public._cdccbp137_abos_principle(),
    'vision', public._cdccbp137_vision(),
    'vision_phrases', public._cdccbp137_vision_phrases(),
    'objectives', public._cdccbp137_objectives(),
    'collective_decision_center', public._cdccbp137_collective_decision_center(),
    'human_companion_council_model', public._cdccbp137_human_companion_council_model(),
    'decision_perspective_engine', public._cdccbp137_decision_perspective_engine(),
    'companion_advisory_engine', public._cdccbp137_companion_advisory_engine(),
    'stakeholder_impact_review', public._cdccbp137_stakeholder_impact_review(),
    'disagreement_framework', public._cdccbp137_disagreement_framework(),
    'decision_transparency_engine', public._cdccbp137_decision_transparency_engine(),
    'council_memory_engine', public._cdccbp137_council_memory_engine(),
    'companion_limitations', public._cdccbp137_companion_limitations(),
    'self_love_connection', public._cdccbp137_self_love_connection(),
    'security_requirements', public._cdccbp137_security_requirements(),
    'integration_links', public._cdccbp137_integration_links(),
    'dogfooding', public._cdccbp137_dogfooding(),
    'success_metrics', public._cdccbp137_success_metrics(),
    'success_criteria', public._cdccbp137_success_criteria(p_tenant_id),
    'engagement_summary', public._cdccbp137_engagement_summary(p_tenant_id),
    'privacy_note', public._cdccbp137_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 11. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_collective_decision_workspace(
  p_workspace_key text, p_title text, p_context_summary text,
  p_governance_tier text default 'assisted', p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cdcc_require_tenant());
  if p_governance_tier not in ('observer', 'assisted', 'guided', 'governed') then
    raise exception 'Invalid governance tier';
  end if;
  insert into public.collective_decision_workspaces (
    tenant_id, workspace_key, title, context_summary, governance_tier, status
  ) values (v_tenant_id, p_workspace_key, p_title, left(p_context_summary, 500), p_governance_tier, 'draft')
  on conflict (tenant_id, workspace_key) do update set
    title = excluded.title, context_summary = excluded.context_summary,
    governance_tier = excluded.governance_tier, updated_at = now()
  returning id into v_id;
  perform public._cdcc_log_audit(v_tenant_id, 'workspace_created', p_title, jsonb_build_object('workspace_id', v_id));
  return v_id;
end; $$;

create or replace function public.record_council_perspective(
  p_workspace_key text, p_contributor_type text, p_role text, p_summary text,
  p_perspective_type text default 'opportunity', p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cdcc_require_tenant());
  if p_contributor_type not in ('human', 'companion') then raise exception 'contributor_type must be human or companion'; end if;
  v_key := lower(p_workspace_key || '-' || p_contributor_type || '-' || left(md5(p_role || p_summary), 8));
  insert into public.collective_decision_perspectives (
    tenant_id, perspective_key, workspace_key, contributor_type, role, summary, perspective_type
  ) values (v_tenant_id, v_key, p_workspace_key, p_contributor_type, p_role, left(p_summary, 500), p_perspective_type)
  on conflict (tenant_id, perspective_key) do update set
    summary = excluded.summary, perspective_type = excluded.perspective_type, updated_at = now()
  returning id into v_id;
  perform public._cdcc_log_audit(v_tenant_id, 'perspective_recorded', p_role,
    jsonb_build_object('perspective_id', v_id, 'contributor_type', p_contributor_type));
  return v_id;
end; $$;

create or replace function public.record_council_transparency(
  p_workspace_key text, p_alternatives_summary text, p_rationale_summary text,
  p_expected_outcomes_summary text, p_follow_up_commitments_summary text default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cdcc_require_tenant());
  v_key := lower(p_workspace_key || '-transparency-' || left(md5(p_rationale_summary), 8));
  insert into public.collective_decision_transparency_records (
    tenant_id, transparency_key, workspace_key, alternatives_summary, rationale_summary,
    expected_outcomes_summary, follow_up_commitments_summary
  ) values (
    v_tenant_id, v_key, p_workspace_key, left(p_alternatives_summary, 500), left(p_rationale_summary, 500),
    left(p_expected_outcomes_summary, 500), left(p_follow_up_commitments_summary, 500)
  )
  on conflict (tenant_id, transparency_key) do update set
    alternatives_summary = excluded.alternatives_summary, rationale_summary = excluded.rationale_summary,
    expected_outcomes_summary = excluded.expected_outcomes_summary,
    follow_up_commitments_summary = excluded.follow_up_commitments_summary, updated_at = now()
  returning id into v_id;
  perform public._cdcc_log_audit(v_tenant_id, 'transparency_recorded', p_workspace_key,
    jsonb_build_object('transparency_id', v_id));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Public dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_collective_decision_council_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.collective_decision_council_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cdcc_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cdcc_ensure_settings(v_tenant_id);
  perform public._cdcc_seed_workspaces(v_tenant_id);
  perform public._cdcc_seed_perspectives(v_tenant_id);
  perform public._cdcc_seed_stakeholder_impacts(v_tenant_id);
  perform public._cdcc_seed_transparency_records(v_tenant_id);
  perform public._cdcc_seed_council_memory(v_tenant_id);
  v_metrics := public._cdcc_refresh_metrics(v_tenant_id);
  v_engagement := public._cdccbp137_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'council_wisdom_score', v_metrics->'council_wisdom_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'perspectives', v_metrics->'perspectives',
    'human_perspectives', v_metrics->'human_perspectives',
    'companion_perspectives', v_metrics->'companion_perspectives',
    'philosophy', public._cdccbp137_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'council_center_enabled', v_settings.council_center_enabled,
    'implementation_blueprint_phase137', jsonb_build_object(
      'phase', 'Phase 137 — Collective Decision & Human-Companion Council Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE137_COLLECTIVE_DECISION_HUMAN_COMPANION_COUNCIL.md',
      'engine_phase', 'Repo Phase 137 Collective Decision & Human-Companion Council Engine',
      'route', '/app/collective-decision-council-engine',
      'mapping_note', 'Humans decide — companions advise, never vote.'
    ),
    'collective_decision_council_mission', public._cdccbp137_mission(),
    'collective_decision_council_abos_principle', public._cdccbp137_abos_principle(),
    'collective_decision_council_engagement_summary', v_engagement,
    'collective_decision_council_vision_note', public._cdccbp137_vision()
  );
end; $$;

create or replace function public.get_collective_decision_council_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.collective_decision_council_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cdcc_require_tenant());
  v_settings := public._cdcc_ensure_settings(v_tenant_id);
  perform public._cdcc_seed_workspaces(v_tenant_id);
  perform public._cdcc_seed_perspectives(v_tenant_id);
  perform public._cdcc_seed_stakeholder_impacts(v_tenant_id);
  perform public._cdcc_seed_transparency_records(v_tenant_id);
  perform public._cdcc_seed_council_memory(v_tenant_id);
  v_metrics := public._cdcc_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'council_center_enabled', v_settings.council_center_enabled,
    'disagreement_framework_enabled', v_settings.disagreement_framework_enabled,
    'companion_advisory_enabled', v_settings.companion_advisory_enabled,
    'stakeholder_mapping_enabled', v_settings.stakeholder_mapping_enabled,
    'transparency_records_enabled', v_settings.transparency_records_enabled,
    'council_memory_enabled', v_settings.council_memory_enabled,
    'default_governance_tier', v_settings.default_governance_tier,
    'philosophy', public._cdccbp137_philosophy(),
    'distinction_note', public._cdccbp137_distinction_note(),
    'safety_note', 'Collective Decision Council — humans decide, companions advise never vote. Metadata only — no raw sensitive decision content.',
    'council_wisdom_score', v_metrics->'council_wisdom_score',
    'active_workspaces', v_metrics->'active_workspaces',
    'perspectives', v_metrics->'perspectives',
    'human_perspectives', v_metrics->'human_perspectives',
    'companion_perspectives', v_metrics->'companion_perspectives',
    'stakeholder_impacts', v_metrics->'stakeholder_impacts',
    'transparency_records', v_metrics->'transparency_records',
    'council_memory_entries', v_metrics->'council_memory_entries',
    'council_center_capabilities_count', v_metrics->'council_center_capabilities_count',
    'perspective_types_count', v_metrics->'perspective_types_count',
    'workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title,
        'context_summary', w.context_summary, 'status', w.status,
        'governance_tier', w.governance_tier, 'cross_link_route', w.cross_link_route
      ) order by w.updated_at desc)
      from public.collective_decision_workspaces w
      where w.tenant_id = v_tenant_id and w.status in ('active', 'draft', 'deliberating', 'review')
    ), '[]'::jsonb),
    'perspectives_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'perspective_key', p.perspective_key, 'workspace_key', p.workspace_key,
        'contributor_type', p.contributor_type, 'role', p.role, 'summary', p.summary,
        'perspective_type', p.perspective_type, 'status', p.status
      ) order by p.updated_at desc)
      from public.collective_decision_perspectives p
      where p.tenant_id = v_tenant_id and p.status in ('active', 'challenged')
    ), '[]'::jsonb),
    'stakeholder_impacts_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'impact_key', s.impact_key, 'workspace_key', s.workspace_key,
        'stakeholder_group', s.stakeholder_group, 'impact_summary', s.impact_summary,
        'impact_level', s.impact_level, 'status', s.status
      ) order by s.updated_at desc)
      from public.collective_decision_stakeholder_impacts s
      where s.tenant_id = v_tenant_id and s.status in ('active', 'review')
    ), '[]'::jsonb),
    'transparency_records_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'transparency_key', t.transparency_key, 'workspace_key', t.workspace_key,
        'alternatives_summary', t.alternatives_summary, 'rationale_summary', t.rationale_summary,
        'expected_outcomes_summary', t.expected_outcomes_summary, 'status', t.status
      ) order by t.updated_at desc)
      from public.collective_decision_transparency_records t
      where t.tenant_id = v_tenant_id and t.status in ('active', 'review')
    ), '[]'::jsonb),
    'council_memory_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'workspace_key', m.workspace_key,
        'lesson_summary', m.lesson_summary, 'outcome_summary', m.outcome_summary,
        'reflection_summary', m.reflection_summary, 'captured_at', m.captured_at, 'status', m.status
      ) order by m.captured_at desc)
      from public.collective_decision_council_memory m
      where m.tenant_id = v_tenant_id and m.status in ('active', 'review')
    ), '[]'::jsonb),
    'perspective_type_scaffolds', public._cdcc_perspective_type_scaffolds(),
    'stakeholder_group_scaffolds', public._cdcc_stakeholder_groups(),
    'disagreement_principles', public._cdcc_disagreement_principles(),
    'council_participant_roles', public._cdcc_council_participant_roles(),
    'integration_links', public._cdccbp137_integration_links(),
    'implementation_blueprint_phase137', jsonb_build_object(
      'phase', 'Phase 137 — Collective Decision & Human-Companion Council Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE137_COLLECTIVE_DECISION_HUMAN_COMPANION_COUNCIL.md',
      'engine_phase', 'Repo Phase 137 Collective Decision & Human-Companion Council Engine',
      'route', '/app/collective-decision-council-engine',
      'mapping_note', 'Humans decide — companions advise, never vote.'
    ),
    'collective_decision_council_blueprint', public._cdccbp137_blueprint_block(v_tenant_id),
    'collective_decision_council_mission', public._cdccbp137_mission(),
    'collective_decision_council_philosophy', public._cdccbp137_philosophy(),
    'collective_decision_council_abos_principle', public._cdccbp137_abos_principle(),
    'collective_decision_council_objectives', public._cdccbp137_objectives(),
    'collective_decision_center', public._cdccbp137_collective_decision_center(),
    'human_companion_council_model', public._cdccbp137_human_companion_council_model(),
    'decision_perspective_engine', public._cdccbp137_decision_perspective_engine(),
    'companion_advisory_engine', public._cdccbp137_companion_advisory_engine(),
    'stakeholder_impact_review', public._cdccbp137_stakeholder_impact_review(),
    'disagreement_framework', public._cdccbp137_disagreement_framework(),
    'decision_transparency_engine', public._cdccbp137_decision_transparency_engine(),
    'council_memory_engine', public._cdccbp137_council_memory_engine(),
    'companion_limitations', public._cdccbp137_companion_limitations(),
    'self_love_connection', public._cdccbp137_self_love_connection(),
    'security_requirements', public._cdccbp137_security_requirements(),
    'cdccbp137_integration_links', public._cdccbp137_integration_links(),
    'engagement_summary', public._cdccbp137_engagement_summary(v_tenant_id),
    'success_criteria', public._cdccbp137_success_criteria(v_tenant_id),
    'success_metrics', public._cdccbp137_success_metrics(),
    'vision_phrases', public._cdccbp137_vision_phrases(),
    'collective_decision_council_vision', public._cdccbp137_vision(),
    'dogfooding', public._cdccbp137_dogfooding(),
    'privacy_note', public._cdccbp137_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'collective-decision-council-engine', 'Collective Decision & Human-Companion Council',
  'Collective Decision Council — workspaces, human-companion perspectives, stakeholder mapping, disagreement framework, and council memory. Humans decide.',
  'authenticated', 152
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'collective-decision-council-engine' and tenant_id is null
);

grant execute on function public.get_collective_decision_council_engine_card(uuid) to authenticated;
grant execute on function public.get_collective_decision_council_engine_dashboard(uuid) to authenticated;
grant execute on function public.create_collective_decision_workspace(text, text, text, text, uuid) to authenticated;
grant execute on function public.record_council_perspective(text, text, text, text, text, uuid) to authenticated;
grant execute on function public.record_council_transparency(text, text, text, text, text, uuid) to authenticated;
grant execute on function public._cdccbp137_distinction_note() to authenticated;
grant execute on function public._cdccbp137_mission() to authenticated;
grant execute on function public._cdccbp137_philosophy() to authenticated;
grant execute on function public._cdccbp137_abos_principle() to authenticated;
grant execute on function public._cdccbp137_vision() to authenticated;
grant execute on function public._cdccbp137_vision_phrases() to authenticated;
grant execute on function public._cdccbp137_objectives() to authenticated;
grant execute on function public._cdccbp137_collective_decision_center() to authenticated;
grant execute on function public._cdccbp137_human_companion_council_model() to authenticated;
grant execute on function public._cdccbp137_decision_perspective_engine() to authenticated;
grant execute on function public._cdccbp137_companion_advisory_engine() to authenticated;
grant execute on function public._cdccbp137_stakeholder_impact_review() to authenticated;
grant execute on function public._cdccbp137_disagreement_framework() to authenticated;
grant execute on function public._cdccbp137_decision_transparency_engine() to authenticated;
grant execute on function public._cdccbp137_council_memory_engine() to authenticated;
grant execute on function public._cdccbp137_companion_limitations() to authenticated;
grant execute on function public._cdccbp137_self_love_connection() to authenticated;
grant execute on function public._cdccbp137_security_requirements() to authenticated;
grant execute on function public._cdccbp137_integration_links() to authenticated;
grant execute on function public._cdccbp137_dogfooding() to authenticated;
grant execute on function public._cdccbp137_success_metrics() to authenticated;
grant execute on function public._cdccbp137_privacy_note() to authenticated;
