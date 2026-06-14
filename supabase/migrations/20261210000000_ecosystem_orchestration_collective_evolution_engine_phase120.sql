-- Phase 120 — Ecosystem Orchestration & Collective Evolution Engine (Era 111–120 capstone)
-- Ecosystem Orchestration Center — distinct from Workflow Orchestration Phase 68 (/app/orchestration)
-- and Ecosystem Intelligence Phase 88 (/app/ecosystem — external relationships).
-- Helpers: _eoce_* (engine), _eocbp120_* (blueprint — never collide with _woe_*, _eie_*, _egce_*).

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
    'ecosystem_orchestration'
  )
);

-- ---------------------------------------------------------------------------
-- 1. ecosystem_orchestration_settings
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  collective_evolution_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  orchestration_visibility text not null default 'organization' check (
    orchestration_visibility in ('leadership', 'organization', 'stewardship_council')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ecosystem_orchestration_settings enable row level security;
revoke all on public.ecosystem_orchestration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ecosystem_orchestration_health_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  indicator_type text not null check (
    indicator_type in (
      'trust', 'knowledge_exchange', 'gp_success_rates', 'customer_outcomes',
      'community_participation', 'companion_adoption', 'governance_alignment',
      'innovation_sustainability', 'relationship_strength'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  signal_strength text not null default 'moderate' check (
    signal_strength in ('emerging', 'moderate', 'strong', 'needs_attention')
  ),
  trend_pct numeric(6, 2),
  value_numeric numeric(10, 2),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, indicator_key)
);

create index if not exists ecosystem_orchestration_health_snapshots_tenant_idx
  on public.ecosystem_orchestration_health_snapshots (tenant_id, indicator_type, captured_at desc);

alter table public.ecosystem_orchestration_health_snapshots enable row level security;
revoke all on public.ecosystem_orchestration_health_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. ecosystem_orchestration_knowledge_flow_signals (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_knowledge_flow_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'knowledge_silos', 'emerging_expertise', 'frequently_solved_challenges',
      'successful_playbooks', 'high_value_resources', 'cross_industry_learnings'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists ecosystem_orchestration_knowledge_flow_signals_tenant_idx
  on public.ecosystem_orchestration_knowledge_flow_signals (tenant_id, signal_type, captured_at desc);

alter table public.ecosystem_orchestration_knowledge_flow_signals enable row level security;
revoke all on public.ecosystem_orchestration_knowledge_flow_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. ecosystem_orchestration_resilience_indicators
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_resilience_indicators (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  monitor_type text not null check (
    monitor_type in (
      'support_capacity', 'governance_stability', 'gp_diversity',
      'knowledge_redundancy', 'community_engagement', 'leadership_participation',
      'companion_reliability', 'operational_continuity'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  signal text not null default 'stable' check (
    signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  value_numeric numeric(10, 2),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, indicator_key)
);

create index if not exists ecosystem_orchestration_resilience_indicators_tenant_idx
  on public.ecosystem_orchestration_resilience_indicators (tenant_id, monitor_type, captured_at desc);

alter table public.ecosystem_orchestration_resilience_indicators enable row level security;
revoke all on public.ecosystem_orchestration_resilience_indicators from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. ecosystem_orchestration_opportunity_signals
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_opportunity_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'emerging_industries', 'new_companion_categories', 'regional_expansion',
      'training_needs', 'marketplace_enhancements', 'kc_improvements',
      'community_growth', 'gp_specializations'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  priority text not null default 'moderate' check (
    priority in ('exploratory', 'moderate', 'strategic', 'values_aligned')
  ),
  status text not null default 'identified' check (
    status in ('identified', 'reviewing', 'pursuing', 'deferred', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists ecosystem_orchestration_opportunity_signals_tenant_idx
  on public.ecosystem_orchestration_opportunity_signals (tenant_id, opportunity_type, status);

alter table public.ecosystem_orchestration_opportunity_signals enable row level security;
revoke all on public.ecosystem_orchestration_opportunity_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. ecosystem_orchestration_memory_entries (milestone/lesson metadata — no PII)
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_memory_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  memory_type text not null check (
    memory_type in (
      'major_milestones', 'transformation_stories', 'lessons_learned',
      'governance_improvements', 'community_contributions', 'gp_innovations',
      'companion_evolution_histories'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('draft', 'active', 'archived', 'historical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists ecosystem_orchestration_memory_entries_tenant_idx
  on public.ecosystem_orchestration_memory_entries (tenant_id, memory_type, captured_at desc);

alter table public.ecosystem_orchestration_memory_entries enable row level security;
revoke all on public.ecosystem_orchestration_memory_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. ecosystem_orchestration_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.ecosystem_orchestration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ecosystem_orchestration_audit_logs enable row level security;
revoke all on public.ecosystem_orchestration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'ecosystem_orchestration_engine', v.description
from (values
  ('ecosystem_orchestration.view', 'View Ecosystem Orchestration Engine', 'View Ecosystem Orchestration Center and collective evolution scaffolding'),
  ('ecosystem_orchestration.manage', 'Manage Ecosystem Orchestration Engine', 'Update orchestration settings and stewardship metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'ecosystem_orchestration.view'), ('owner', 'ecosystem_orchestration.manage'),
  ('administrator', 'ecosystem_orchestration.view'), ('administrator', 'ecosystem_orchestration.manage'),
  ('manager', 'ecosystem_orchestration.view'), ('manager', 'ecosystem_orchestration.manage'),
  ('employee', 'ecosystem_orchestration.view'),
  ('support_agent', 'ecosystem_orchestration.view'),
  ('moderator', 'ecosystem_orchestration.view'),
  ('viewer', 'ecosystem_orchestration.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 9. Baseline helpers (_eoce_)
-- ---------------------------------------------------------------------------
create or replace function public._eoce_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._eoce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._eoce_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._eoce_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.ecosystem_orchestration_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._eoce_ensure_settings(p_tenant_id uuid)
returns public.ecosystem_orchestration_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.ecosystem_orchestration_settings;
begin
  insert into public.ecosystem_orchestration_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.ecosystem_orchestration_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._eoce_seed_health_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_orchestration_health_snapshots where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_orchestration_health_snapshots (
    tenant_id, indicator_key, indicator_type, summary, signal_strength, trend_pct, value_numeric
  ) values
    (p_tenant_id, 'trust-signal', 'trust', 'Trust signals aggregate across GP, community, and governance — cross-link Trust & Reputation Phase 116.', 'strong', 3.2, 78.0),
    (p_tenant_id, 'knowledge-exchange', 'knowledge_exchange', 'Knowledge circulation trending — circulate not accumulate. Cross-link Aipify University Phase 115.', 'moderate', 5.5, 64.0),
    (p_tenant_id, 'gp-success', 'gp_success_rates', 'Growth Partner program outcomes stable — cross-link Partner Ops Phase 114.', 'moderate', 2.1, 71.0),
    (p_tenant_id, 'customer-outcomes', 'customer_outcomes', 'Customer success metadata improving — stewardship not competition.', 'strong', 4.0, 82.0),
    (p_tenant_id, 'community-participation', 'community_participation', 'Community participation signals healthy — cross-link Community Phase 117.', 'moderate', 6.8, 58.0),
    (p_tenant_id, 'companion-adoption', 'companion_adoption', 'Companion adoption across teams — cross-link Companion Marketplace Phase 113.', 'strong', 7.5, 69.0),
    (p_tenant_id, 'governance-alignment', 'governance_alignment', 'Governance maturity aligning with ecosystem values — cross-link Ecosystem Governance Phase 119.', 'moderate', 1.5, 74.0),
    (p_tenant_id, 'innovation-sustainability', 'innovation_sustainability', 'Innovation pace sustainable — responsible not reckless.', 'moderate', 2.8, 66.0),
    (p_tenant_id, 'relationship-strength', 'relationship_strength', 'Relationship strength across ecosystem partners — cross-link Ecosystem Intelligence Phase 88.', 'strong', 3.9, 76.0);
end; $$;

create or replace function public._eoce_seed_knowledge_flow_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_orchestration_knowledge_flow_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_orchestration_knowledge_flow_signals (
    tenant_id, signal_key, signal_type, summary, confidence
  ) values
    (p_tenant_id, 'silos-ops', 'knowledge_silos', 'Operations knowledge silo detected — facilitation recommended, not surveillance.', 'moderate'),
    (p_tenant_id, 'expertise-growth', 'emerging_expertise', 'Emerging expertise in companion governance — cross-link Phase 119.', 'high'),
    (p_tenant_id, 'solved-onboarding', 'frequently_solved_challenges', 'Onboarding challenges frequently resolved — playbook candidate.', 'high'),
    (p_tenant_id, 'playbook-gp', 'successful_playbooks', 'GP engagement playbook showing consistent outcomes — metadata only.', 'moderate'),
    (p_tenant_id, 'resource-kc', 'high_value_resources', 'High-value KC articles circulating across teams — cross-link KC A.5.', 'high'),
    (p_tenant_id, 'cross-industry', 'cross_industry_learnings', 'Cross-industry learnings from Business Packs Phase 111 — values-aligned sharing.', 'moderate');
end; $$;

create or replace function public._eoce_seed_resilience_indicators(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_orchestration_resilience_indicators where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_orchestration_resilience_indicators (
    tenant_id, indicator_key, monitor_type, summary, signal, value_numeric
  ) values
    (p_tenant_id, 'support-capacity', 'support_capacity', 'Support capacity adequate for ecosystem growth — metadata aggregate.', 'stable', 72.0),
    (p_tenant_id, 'governance-stability', 'governance_stability', 'Governance stability signals consistent — cross-link Phase 119.', 'strong', 80.0),
    (p_tenant_id, 'gp-diversity', 'gp_diversity', 'GP diversity healthy — reduces single-partner dependency.', 'stable', 68.0),
    (p_tenant_id, 'knowledge-redundancy', 'knowledge_redundancy', 'Knowledge redundancy supports continuity — cross-link Organizational Memory A.34.', 'strong', 75.0),
    (p_tenant_id, 'community-engagement', 'community_engagement', 'Community engagement resilient through seasonal shifts.', 'stable', 62.0),
    (p_tenant_id, 'leadership-participation', 'leadership_participation', 'Leadership participation in stewardship council scaffold.', 'stable', 58.0),
    (p_tenant_id, 'companion-reliability', 'companion_reliability', 'Companion reliability metrics stable — cross-link Phase 113.', 'strong', 84.0),
    (p_tenant_id, 'operational-continuity', 'operational_continuity', 'Operational continuity indicators healthy — distinct from org crisis resilience A.50.', 'strong', 79.0);
end; $$;

create or replace function public._eoce_seed_opportunity_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_orchestration_opportunity_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_orchestration_opportunity_signals (
    tenant_id, signal_key, opportunity_type, summary, priority, status
  ) values
    (p_tenant_id, 'industry-healthcare', 'emerging_industries', 'Healthcare industry pack adoption opportunity — cross-link Phase 111.', 'values_aligned', 'reviewing'),
    (p_tenant_id, 'companion-coordinator', 'new_companion_categories', 'Coordinator companion category interest — cross-link Phase 113.', 'moderate', 'identified'),
    (p_tenant_id, 'region-nordics', 'regional_expansion', 'Nordic regional expansion aligned with values — not trends alone.', 'strategic', 'reviewing'),
    (p_tenant_id, 'training-security', 'training_needs', 'Security training demand — cross-link Aipify University Phase 115.', 'values_aligned', 'pursuing'),
    (p_tenant_id, 'marketplace-qa', 'marketplace_enhancements', 'Marketplace QA workflow enhancement — cross-link Skills Marketplace Phase 112.', 'moderate', 'identified'),
    (p_tenant_id, 'kc-governance', 'kc_improvements', 'KC governance article refresh — metadata improvement opportunity.', 'moderate', 'identified'),
    (p_tenant_id, 'community-mentorship', 'community_growth', 'Community mentorship program growth — cross-link Phase 117.', 'values_aligned', 'pursuing'),
    (p_tenant_id, 'gp-compliance', 'gp_specializations', 'GP compliance specialization demand — cross-link Partner Ops Phase 114.', 'strategic', 'reviewing');
end; $$;

create or replace function public._eoce_seed_memory_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.ecosystem_orchestration_memory_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.ecosystem_orchestration_memory_entries (
    tenant_id, entry_key, memory_type, title, summary, status
  ) values
    (p_tenant_id, 'milestone-university', 'major_milestones', 'Aipify University launch milestone', 'Centralized learning hub activated — cross-link Phase 115. Metadata milestone only.', 'active'),
    (p_tenant_id, 'story-gp-transform', 'transformation_stories', 'GP program transformation story', 'Growth Partner operations evolved with human-guided pacing — Phase 114 cross-link.', 'active'),
    (p_tenant_id, 'lesson-governance', 'lessons_learned', 'Governance maturity lesson', 'Stewardship council feedback improved alignment — Phase 119 cross-link.', 'active'),
    (p_tenant_id, 'gov-improvement', 'governance_improvements', 'Certification workflow improvement', 'Ecosystem certification process refined — values protected.', 'active'),
    (p_tenant_id, 'community-contrib', 'community_contributions', 'Community knowledge contribution', 'Community shared approved playbooks — Phase 117 cross-link.', 'active'),
    (p_tenant_id, 'gp-innovation', 'gp_innovations', 'GP innovation pilot', 'Partner-led wellbeing workshop pilot — metadata summary only.', 'active'),
    (p_tenant_id, 'companion-evolution', 'companion_evolution_histories', 'Companion evolution history', 'Companion marketplace adoption patterns — Phase 113 cross-link. No ranking individuals.', 'active');
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Blueprint helpers (_eocbp120_)
-- ---------------------------------------------------------------------------
create or replace function public._eocbp120_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 120 — Ecosystem Orchestration & Collective Evolution Engine at /app/ecosystem-orchestration. Era 111–120 capstone aggregating ecosystem-wide visibility — distinct from Workflow Orchestration Phase 68 at /app/orchestration (cross-module events/flows — NOT ecosystem orchestration); Ecosystem Intelligence Phase 88 at /app/ecosystem (external relationships — cross-link only); Ecosystem Governance Phase 119 at /app/ecosystem-governance (certification ecosystem — cross-link); Organizational Resilience A.50 at /app/organizational-resilience-engine (org crisis resilience — ecosystem-level resilience is distinct); Organizational Memory A.34 at /app/organizational-memory-engine (ecosystem memory cross-link); Growth & Evolution A.81 at /app/growth-evolution-engine; Self Love A.76 at /app/self-love-engine. Orchestrator not central authority — humans guide evolution. Metadata/anonymized aggregates only — no surveillance, no ranking people. Helpers use _eocbp120_* — never collide with _woe_*, _eie_*, _egce_*.';
$$;

create or replace function public._eocbp120_mission()
returns text language sql immutable as $$
  select 'Orchestrate collective ecosystem growth — organizations, Growth Partners, Companions, communities, knowledge contributors, executives, employees, and customers evolving together with human stewardship at the center.';
$$;

create or replace function public._eocbp120_philosophy()
returns text language sql immutable as $$
  select 'Strength emerges from ecosystem — not central authority. People First. Growth through support. Evolve with people — together. Aipify orchestrates collective growth; humans guide priorities. Evolution intentional, not accidental.';
$$;

create or replace function public._eocbp120_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Ecosystem Orchestration Center aggregates era 111–120 visibility and collective evolution scaffolding. Phase 68 orchestration and Phase 88 ecosystem intelligence remain authoritative for their domains. Aipify informs and prepares; humans decide evolution pace and priorities.';
$$;

create or replace function public._eocbp120_vision()
returns text language sql immutable as $$
  select 'Our ecosystem grows stronger together — with trust, knowledge circulation, and wellbeing woven into every evolution step.';
$$;

create or replace function public._eocbp120_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'learn_collectively', 'label', 'Learn collectively', 'emoji', '🦉', 'description', 'Shared learning across GP, community, and university — cross-link Phase 115'),
    jsonb_build_object('key', 'adapt_continuously', 'label', 'Adapt continuously', 'emoji', '🔔', 'description', 'Continuous adaptation with human-approved pacing'),
    jsonb_build_object('key', 'share_wisdom', 'label', 'Share wisdom responsibly', 'emoji', '🌹', 'description', 'Knowledge circulates — not hoarded. Metadata only'),
    jsonb_build_object('key', 'coordinate_transformation', 'label', 'Coordinate transformation', 'emoji', '🦉', 'description', 'Transformation coordinated — not dictated'),
    jsonb_build_object('key', 'preserve_memory', 'label', 'Preserve institutional memory', 'emoji', '🔔', 'description', 'Ecosystem memory — cross-link Organizational Memory A.34'),
    jsonb_build_object('key', 'accelerate_innovation', 'label', 'Accelerate innovation safely', 'emoji', '🌹', 'description', 'Innovation with governance alignment — Phase 119 cross-link'),
    jsonb_build_object('key', 'improve_resilience', 'label', 'Improve resilience', 'emoji', '🦉', 'description', 'Ecosystem resilience — distinct from org crisis A.50'),
    jsonb_build_object('key', 'scale_with_humanity', 'label', 'Scale without losing humanity', 'emoji', '🌹', 'description', 'Growth at human pace — Self Love A.76 cross-link')
  );
$$;

create or replace function public._eocbp120_orchestration_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem Orchestration Center — nine capabilities. Stewardship visibility, not surveillance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'ecosystem_health_monitoring', 'label', 'Ecosystem health monitoring'),
      jsonb_build_object('key', 'collective_intelligence_analysis', 'label', 'Collective intelligence analysis'),
      jsonb_build_object('key', 'cross_community_insights', 'label', 'Cross-community insights', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'gp_trends', 'label', 'Growth Partner trends', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'companion_evolution_tracking', 'label', 'Companion evolution tracking', 'cross_link', '/app/companion-marketplace'),
      jsonb_build_object('key', 'knowledge_flow_analysis', 'label', 'Knowledge flow analysis'),
      jsonb_build_object('key', 'governance_maturity_reviews', 'label', 'Governance maturity reviews', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'strategic_opportunity_mapping', 'label', 'Strategic opportunity mapping'),
      jsonb_build_object('key', 'resilience_indicators', 'label', 'Resilience indicators')
    )
  );
$$;

create or replace function public._eocbp120_collective_evolution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective Evolution Engine — eight shared-responsibility areas.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'learning_practices', 'label', 'Learning practices', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'governance_frameworks', 'label', 'Governance frameworks', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'companion_experiences', 'label', 'Companion experiences', 'cross_link', '/app/companion-marketplace'),
      jsonb_build_object('key', 'gp_programs', 'label', 'Growth Partner programs', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'customer_success_models', 'label', 'Customer success models'),
      jsonb_build_object('key', 'community_structures', 'label', 'Community structures', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'security_standards', 'label', 'Security standards'),
      jsonb_build_object('key', 'knowledge_systems', 'label', 'Knowledge systems')
    )
  );
$$;

create or replace function public._eocbp120_ecosystem_health_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem health model — nine indicators. Stewardship not competition.',
    'indicators', jsonb_build_array(
      jsonb_build_object('key', 'trust', 'label', 'Trust', 'cross_link', '/app/trust-reputation-engine'),
      jsonb_build_object('key', 'knowledge_exchange', 'label', 'Knowledge exchange'),
      jsonb_build_object('key', 'gp_success_rates', 'label', 'GP success rates'),
      jsonb_build_object('key', 'customer_outcomes', 'label', 'Customer outcomes'),
      jsonb_build_object('key', 'community_participation', 'label', 'Community participation'),
      jsonb_build_object('key', 'companion_adoption', 'label', 'Companion adoption'),
      jsonb_build_object('key', 'governance_alignment', 'label', 'Governance alignment'),
      jsonb_build_object('key', 'innovation_sustainability', 'label', 'Innovation sustainability'),
      jsonb_build_object('key', 'relationship_strength', 'label', 'Relationship strength', 'cross_link', '/app/ecosystem')
    )
  );
$$;

create or replace function public._eocbp120_knowledge_flow_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Knowledge flow engine — six identifications. Circulate not accumulate.',
    'identifications', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_silos', 'label', 'Knowledge silos'),
      jsonb_build_object('key', 'emerging_expertise', 'label', 'Emerging expertise'),
      jsonb_build_object('key', 'frequently_solved_challenges', 'label', 'Frequently solved challenges'),
      jsonb_build_object('key', 'successful_playbooks', 'label', 'Successful playbooks'),
      jsonb_build_object('key', 'high_value_resources', 'label', 'High-value resources'),
      jsonb_build_object('key', 'cross_industry_learnings', 'label', 'Cross-industry learnings', 'cross_link', '/app/business-packs-foundation-engine')
    )
  );
$$;

create or replace function public._eocbp120_resilience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience engine — eight ecosystem-level monitors. Distinct from Organizational Resilience A.50 org crisis resilience.',
    'monitors', jsonb_build_array(
      jsonb_build_object('key', 'support_capacity', 'label', 'Support capacity'),
      jsonb_build_object('key', 'governance_stability', 'label', 'Governance stability'),
      jsonb_build_object('key', 'gp_diversity', 'label', 'GP diversity'),
      jsonb_build_object('key', 'knowledge_redundancy', 'label', 'Knowledge redundancy', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement'),
      jsonb_build_object('key', 'leadership_participation', 'label', 'Leadership participation'),
      jsonb_build_object('key', 'companion_reliability', 'label', 'Companion reliability'),
      jsonb_build_object('key', 'operational_continuity', 'label', 'Operational continuity')
    ),
    'organizational_resilience_route', '/app/organizational-resilience-engine',
    'boundary_note', 'Ecosystem resilience is collective stewardship — not duplicate of org crisis A.50 RPCs.'
  );
$$;

create or replace function public._eocbp120_strategic_opportunity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic opportunity engine — eight opportunity types. Align with values not trends alone.',
    'opportunity_types', jsonb_build_array(
      jsonb_build_object('key', 'emerging_industries', 'label', 'Emerging industries'),
      jsonb_build_object('key', 'new_companion_categories', 'label', 'New companion categories'),
      jsonb_build_object('key', 'regional_expansion', 'label', 'Regional expansion'),
      jsonb_build_object('key', 'training_needs', 'label', 'Training needs'),
      jsonb_build_object('key', 'marketplace_enhancements', 'label', 'Marketplace enhancements', 'cross_link', '/app/marketplace'),
      jsonb_build_object('key', 'kc_improvements', 'label', 'KC improvements'),
      jsonb_build_object('key', 'community_growth', 'label', 'Community growth'),
      jsonb_build_object('key', 'gp_specializations', 'label', 'GP specializations')
    )
  );
$$;

create or replace function public._eocbp120_companion_responsibilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'may', jsonb_build_array(
      'Identify patterns', 'Summarize learnings', 'Highlight needs', 'Support discovery',
      'Facilitate coordination', 'Suggest resources'
    ),
    'must_avoid', jsonb_build_array(
      'Direct priorities independently', 'Override governance', 'Replace leadership',
      'Suppress diversity', 'Rank people', 'Surveillance framing'
    ),
    'principle', 'Humans guide; Companions strengthen.'
  );
$$;

create or replace function public._eocbp120_stewardship_council()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem Stewardship Council — optional governance structure scaffold.',
    'participant_types', jsonb_build_array(
      jsonb_build_object('key', 'customers', 'label', 'Customers'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners'),
      jsonb_build_object('key', 'executives', 'label', 'Executives'),
      jsonb_build_object('key', 'knowledge_leaders', 'label', 'Knowledge leaders'),
      jsonb_build_object('key', 'community_representatives', 'label', 'Community representatives'),
      jsonb_build_object('key', 'governance_advisors', 'label', 'Governance advisors')
    ),
    'responsibilities', jsonb_build_array(
      jsonb_build_object('key', 'provide_feedback', 'label', 'Provide ecosystem feedback'),
      jsonb_build_object('key', 'identify_risks', 'label', 'Identify emerging risks'),
      jsonb_build_object('key', 'review_themes', 'label', 'Review evolution themes'),
      jsonb_build_object('key', 'encourage_inclusivity', 'label', 'Encourage inclusivity'),
      jsonb_build_object('key', 'protect_values', 'label', 'Protect ecosystem values')
    )
  );
$$;

create or replace function public._eocbp120_self_love_in_ecosystem()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in ecosystem design — reflection, patience, healthy growth, intentional pacing, mutual encouragement, shared responsibility.',
    'values', jsonb_build_array(
      'reflection', 'patience', 'healthy_growth', 'intentional_pacing',
      'mutual_encouragement', 'shared_responsibility'
    ),
    'vision', 'Growth not at the cost of wellbeing.',
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._eocbp120_ecosystem_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem memory engine — seven capture types. Milestone and lesson metadata only — no PII.',
    'captures', jsonb_build_array(
      jsonb_build_object('key', 'major_milestones', 'label', 'Major milestones'),
      jsonb_build_object('key', 'transformation_stories', 'label', 'Transformation stories'),
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
      jsonb_build_object('key', 'governance_improvements', 'label', 'Governance improvements'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions'),
      jsonb_build_object('key', 'gp_innovations', 'label', 'GP innovations'),
      jsonb_build_object('key', 'companion_evolution_histories', 'label', 'Companion evolution histories')
    ),
    'organizational_memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Organizational Memory A.34 remains authoritative — ecosystem memory cross-links only.'
  );
$$;

create or replace function public._eocbp120_era_ecosystem_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 111, 'key', 'business_packs', 'label', 'Industry Packs Phase 111', 'route', '/app/business-packs-foundation-engine', 'relationship', 'Business specialization foundation — era entry point'),
    jsonb_build_object('phase', 112, 'key', 'skills_marketplace', 'label', 'Skills Marketplace Phase 112', 'route', '/app/marketplace', 'relationship', 'Skills and extensions marketplace'),
    jsonb_build_object('phase', 113, 'key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'relationship', 'Companions and digital employees'),
    jsonb_build_object('phase', 114, 'key', 'growth_partner_ops', 'label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'Partner operations center'),
    jsonb_build_object('phase', 115, 'key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Continuous learning hub'),
    jsonb_build_object('phase', 116, 'key', 'trust_reputation', 'label', 'Trust & Reputation Phase 116', 'route', '/app/trust-reputation-engine', 'relationship', 'Trust framework for ecosystem relationships'),
    jsonb_build_object('phase', 117, 'key', 'community', 'label', 'Community Phase 117', 'route', '/app/community', 'relationship', 'Collective success and community intelligence'),
    jsonb_build_object('phase', 118, 'key', 'social_impact', 'label', 'Social Impact Phase 118', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Purpose and social impact stewardship'),
    jsonb_build_object('phase', 119, 'key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'relationship', 'Governance and certification ecosystem'),
    jsonb_build_object('phase', 120, 'key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'relationship', 'Era capstone — collective evolution orchestration center')
  );
$$;

create or replace function public._eoce_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_health_count int;
  v_knowledge_count int;
  v_resilience_count int;
  v_opportunity_count int;
  v_memory_count int;
  v_avg_health numeric;
  v_orchestration_score numeric;
begin
  select count(*), coalesce(avg(value_numeric), 0)
  into v_health_count, v_avg_health
  from public.ecosystem_orchestration_health_snapshots where tenant_id = p_tenant_id;
  select count(*) into v_knowledge_count from public.ecosystem_orchestration_knowledge_flow_signals where tenant_id = p_tenant_id;
  select count(*) into v_resilience_count from public.ecosystem_orchestration_resilience_indicators where tenant_id = p_tenant_id;
  select count(*) into v_opportunity_count from public.ecosystem_orchestration_opportunity_signals where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.ecosystem_orchestration_memory_entries where tenant_id = p_tenant_id;
  v_orchestration_score := round((v_avg_health + coalesce((
    select avg(value_numeric) from public.ecosystem_orchestration_resilience_indicators where tenant_id = p_tenant_id
  ), 0)) / 2, 1);

  return jsonb_build_object(
    'orchestration_score', v_orchestration_score,
    'health_indicators_count', v_health_count,
    'knowledge_flow_signals_count', v_knowledge_count,
    'resilience_indicators_count', v_resilience_count,
    'opportunity_signals_count', v_opportunity_count,
    'memory_entries_count', v_memory_count,
    'avg_health_value', round(v_avg_health, 1),
    'orchestration_capabilities_count', 9,
    'evolution_areas_count', 8,
    'era_phases_count', jsonb_array_length(public._eocbp120_era_ecosystem_cross_links())
  );
end; $$;

create or replace function public._eocbp120_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 68', 'route', '/app/orchestration', 'relationship', 'Cross-module events/flows — NOT ecosystem orchestration'),
    jsonb_build_object('key', 'ecosystem_intelligence', 'label', 'Ecosystem Intelligence Phase 88', 'route', '/app/ecosystem', 'relationship', 'External relationships — distinct from Phase 120'),
    jsonb_build_object('key', 'organizational_resilience', 'label', 'Organizational Resilience A.50', 'route', '/app/organizational-resilience-engine', 'relationship', 'Org crisis resilience — ecosystem resilience is distinct'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory A.34', 'route', '/app/organizational-memory-engine', 'relationship', 'Ecosystem memory cross-link — do not duplicate RPCs'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution A.81', 'route', '/app/growth-evolution-engine', 'relationship', 'Organizational growth evolution — cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Balance principles in ecosystem design')
  );
$$;

create or replace function public._eocbp120_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Orchestrator not central authority — metadata only, no surveillance or people ranking.',
    'must_avoid', jsonb_build_array(
      'Duplicating Phase 68 orchestration or Phase 88 ecosystem RPCs',
      'Surveillance or competitive ranking of people',
      'Central authority framing — Aipify dictates priorities',
      'Storing PII in ecosystem orchestration tables',
      'Suppressing diversity or overriding governance',
      'Trend-chasing without values alignment'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only health, knowledge, resilience, and memory aggregates',
      'Era 111–120 cross-links in every dashboard',
      'Companion may suggest — humans decide priorities',
      'Audit logging for significant orchestration events'
    ),
    'boundary_note', 'Humans guide evolution; Aipify orchestrates visibility and preparation.'
  );
$$;

create or replace function public._eocbp120_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem Orchestration Companion — warm stewardship. Humans guide; Companions strengthen.',
    'companion_name', 'Ecosystem Orchestration Companion',
    'not_label', 'AI ecosystem control system',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'health_summary', 'prompt', 'Ecosystem health signals are stable — shall Aipify prepare a calm stewardship summary for your review?', 'consideration', 'Summarize patterns — never direct priorities'),
      jsonb_build_object('emoji', '🌹', 'key', 'knowledge_flow', 'prompt', 'A knowledge silo may benefit from facilitation — would connecting approved playbooks feel wise when you are ready?', 'consideration', 'Circulate knowledge — no surveillance framing'),
      jsonb_build_object('emoji', '🔔', 'key', 'era_cross_link', 'prompt', 'Three era-phase surfaces show aligned opportunity signals — era cross-link grid available for thoughtful review.', 'consideration', 'Highlight needs — humans decide pursuit')
    ),
    'boundary_note', 'Companion adapts tone — never ranks people or overrides governance.'
  );
$$;

create or replace function public._eocbp120_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'improved_resilience', 'label', 'Improved ecosystem resilience'),
    jsonb_build_object('key', 'customer_success', 'label', 'Higher customer success'),
    jsonb_build_object('key', 'gp_outcomes', 'label', 'Stronger GP outcomes'),
    jsonb_build_object('key', 'knowledge_sharing', 'label', 'Increased knowledge sharing'),
    jsonb_build_object('key', 'healthier_communities', 'label', 'Healthier communities'),
    jsonb_build_object('key', 'governance_maturity', 'label', 'Greater governance maturity'),
    jsonb_build_object('key', 'responsible_innovation', 'label', 'Responsible innovation'),
    jsonb_build_object('key', 'long_term_sustainability', 'label', 'Long-term sustainability'),
    jsonb_build_object('key', 'collective_wellbeing', 'label', 'Collective wellbeing')
  );
$$;

create or replace function public._eocbp120_integration_links()
returns jsonb language sql immutable as $$
  select public._eocbp120_era_ecosystem_cross_links() || public._eocbp120_extended_cross_links();
$$;

create or replace function public._eocbp120_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._eoce_ensure_settings(p_tenant_id);
  perform public._eoce_seed_health_snapshots(p_tenant_id);
  perform public._eoce_seed_knowledge_flow_signals(p_tenant_id);
  perform public._eoce_seed_resilience_indicators(p_tenant_id);
  perform public._eoce_seed_opportunity_signals(p_tenant_id);
  perform public._eoce_seed_memory_entries(p_tenant_id);
  v_metrics := public._eoce_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'orchestration_score', coalesce((v_metrics->>'orchestration_score')::numeric, 0),
    'health_indicators_count', coalesce((v_metrics->>'health_indicators_count')::int, 0),
    'knowledge_flow_signals_count', coalesce((v_metrics->>'knowledge_flow_signals_count')::int, 0),
    'resilience_indicators_count', coalesce((v_metrics->>'resilience_indicators_count')::int, 0),
    'opportunity_signals_count', coalesce((v_metrics->>'opportunity_signals_count')::int, 0),
    'memory_entries_count', coalesce((v_metrics->>'memory_entries_count')::int, 0),
    'orchestration_capabilities_count', 9,
    'evolution_areas_count', 8,
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._eocbp120_integration_links()),
    'privacy_note', 'Aggregate ecosystem orchestration counts — metadata only, no PII or people ranking.'
  );
end; $$;

create or replace function public._eocbp120_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._eoce_ensure_settings(p_tenant_id);
  perform public._eoce_seed_health_snapshots(p_tenant_id);
  perform public._eoce_seed_knowledge_flow_signals(p_tenant_id);
  perform public._eoce_seed_resilience_indicators(p_tenant_id);
  perform public._eoce_seed_opportunity_signals(p_tenant_id);
  perform public._eoce_seed_memory_entries(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'orchestration_center', 'label', 'Orchestration Center — nine capabilities documented', 'met', jsonb_array_length(public._eocbp120_orchestration_center()->'capabilities') = 9, 'note', null),
    jsonb_build_object('key', 'collective_evolution', 'label', 'Collective Evolution Engine — eight areas', 'met', jsonb_array_length(public._eocbp120_collective_evolution_engine()->'areas') = 8, 'note', null),
    jsonb_build_object('key', 'health_model', 'label', 'Ecosystem health model — nine indicators seeded', 'met', (select count(*) = 9 from public.ecosystem_orchestration_health_snapshots h where h.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'knowledge_flow', 'label', 'Knowledge flow engine — six identifications', 'met', jsonb_array_length(public._eocbp120_knowledge_flow_engine()->'identifications') = 6, 'note', null),
    jsonb_build_object('key', 'resilience_engine', 'label', 'Resilience engine — eight monitors', 'met', jsonb_array_length(public._eocbp120_resilience_engine()->'monitors') = 8, 'note', null),
    jsonb_build_object('key', 'opportunity_engine', 'label', 'Strategic opportunity engine — eight types', 'met', jsonb_array_length(public._eocbp120_strategic_opportunity_engine()->'opportunity_types') = 8, 'note', null),
    jsonb_build_object('key', 'stewardship_council', 'label', 'Stewardship council — six participants, five responsibilities', 'met', jsonb_array_length(public._eocbp120_stewardship_council()->'participant_types') = 6 and jsonb_array_length(public._eocbp120_stewardship_council()->'responsibilities') = 5, 'note', null),
    jsonb_build_object('key', 'ecosystem_memory', 'label', 'Ecosystem memory — seven capture types', 'met', jsonb_array_length(public._eocbp120_ecosystem_memory_engine()->'captures') = 7, 'note', null),
    jsonb_build_object('key', 'era_cross_links', 'label', 'Era 111–120 cross-links — ten phases documented', 'met', jsonb_array_length(public._eocbp120_era_ecosystem_cross_links()) = 10, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._eocbp120_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — nine documented', 'met', jsonb_array_length(public._eocbp120_success_metrics()) = 9, 'note', null),
    jsonb_build_object('key', 'limitation_principles', 'label', 'Limitation principles — no surveillance or ranking', 'met', jsonb_array_length(public._eocbp120_limitation_principles()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.ecosystem_orchestration_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_adaptation', 'label', 'Companion adaptation — 🦉🌹🔔 examples', 'met', jsonb_array_length(public._eocbp120_companion_adaptation()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 120 baseline tables and RPCs', 'met', to_regclass('public.ecosystem_orchestration_settings') is not null, 'note', '_eoce_* helpers intact')
  );
end; $$;

create or replace function public._eocbp120_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 120 — Ecosystem Orchestration & Collective Evolution Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE120_ECOSYSTEM_ORCHESTRATION_COLLECTIVE_EVOLUTION.md',
    'engine_phase', 'Repo Phase 120 Ecosystem Orchestration Engine',
    'route', '/app/ecosystem-orchestration',
    'mapping_note', 'Era 111–120 capstone — aggregates ecosystem visibility. Phase 68 and Phase 88 remain authoritative.',
    'distinction_note', public._eocbp120_distinction_note(),
    'mission', public._eocbp120_mission(),
    'philosophy', public._eocbp120_philosophy(),
    'abos_principle', public._eocbp120_abos_principle(),
    'vision', public._eocbp120_vision(),
    'objectives', public._eocbp120_objectives(),
    'orchestration_center', public._eocbp120_orchestration_center(),
    'collective_evolution_engine', public._eocbp120_collective_evolution_engine(),
    'ecosystem_health_model', public._eocbp120_ecosystem_health_model(),
    'knowledge_flow_engine', public._eocbp120_knowledge_flow_engine(),
    'resilience_engine', public._eocbp120_resilience_engine(),
    'strategic_opportunity_engine', public._eocbp120_strategic_opportunity_engine(),
    'companion_responsibilities', public._eocbp120_companion_responsibilities(),
    'stewardship_council', public._eocbp120_stewardship_council(),
    'self_love_in_ecosystem', public._eocbp120_self_love_in_ecosystem(),
    'ecosystem_memory_engine', public._eocbp120_ecosystem_memory_engine(),
    'era_ecosystem_cross_links', public._eocbp120_era_ecosystem_cross_links(),
    'extended_cross_links', public._eocbp120_extended_cross_links(),
    'cross_links', public._eocbp120_integration_links(),
    'limitation_principles', public._eocbp120_limitation_principles(),
    'companion_adaptation', public._eocbp120_companion_adaptation(),
    'success_metrics', public._eocbp120_success_metrics(),
    'integration_links', public._eocbp120_integration_links(),
    'engagement_summary', public._eocbp120_engagement_summary(p_tenant_id),
    'privacy_note', 'Ecosystem Orchestration blueprint data is metadata only — aggregate signals and cross-links. Humans guide evolution.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_ecosystem_orchestration_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_orchestration_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._eoce_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._eoce_ensure_settings(v_tenant_id);
  perform public._eoce_seed_health_snapshots(v_tenant_id);
  perform public._eoce_seed_knowledge_flow_signals(v_tenant_id);
  perform public._eoce_seed_resilience_indicators(v_tenant_id);
  perform public._eoce_seed_opportunity_signals(v_tenant_id);
  perform public._eoce_seed_memory_entries(v_tenant_id);
  v_metrics := public._eoce_refresh_metrics(v_tenant_id);
  v_engagement := public._eocbp120_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'orchestration_score', v_metrics->'orchestration_score',
    'health_indicators_count', v_metrics->'health_indicators_count',
    'philosophy', public._eocbp120_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 120 — Ecosystem Orchestration & Collective Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE120_ECOSYSTEM_ORCHESTRATION_COLLECTIVE_EVOLUTION.md',
      'engine_phase', 'Repo Phase 120 Ecosystem Orchestration Engine',
      'route', '/app/ecosystem-orchestration',
      'mapping_note', 'Era 111–120 capstone — cross-link all era phases.'
    ),
    'ecosystem_orchestration_mission', public._eocbp120_mission(),
    'ecosystem_orchestration_abos_principle', public._eocbp120_abos_principle(),
    'ecosystem_orchestration_engagement_summary', v_engagement,
    'ecosystem_orchestration_note', 'Ecosystem Orchestration Center — orchestrator not central authority. People First. Evolution intentional.',
    'ecosystem_orchestration_vision_note', public._eocbp120_vision()
  );
end; $$;

create or replace function public.get_ecosystem_orchestration_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.ecosystem_orchestration_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._eoce_require_tenant());
  v_settings := public._eoce_ensure_settings(v_tenant_id);
  perform public._eoce_seed_health_snapshots(v_tenant_id);
  perform public._eoce_seed_knowledge_flow_signals(v_tenant_id);
  perform public._eoce_seed_resilience_indicators(v_tenant_id);
  perform public._eoce_seed_opportunity_signals(v_tenant_id);
  perform public._eoce_seed_memory_entries(v_tenant_id);
  v_metrics := public._eoce_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'enabled', v_settings.enabled,
    'collective_evolution_enabled', v_settings.collective_evolution_enabled,
    'orchestration_visibility', v_settings.orchestration_visibility,
    'philosophy', public._eocbp120_philosophy(),
    'safety_note', 'Ecosystem Orchestration Engine — metadata-only aggregates. Phase 68 orchestration and Phase 88 ecosystem intelligence remain authoritative. Humans guide evolution.',
    'orchestration_score', v_metrics->'orchestration_score',
    'health_indicators_count', v_metrics->'health_indicators_count',
    'knowledge_flow_signals_count', v_metrics->'knowledge_flow_signals_count',
    'resilience_indicators_count', v_metrics->'resilience_indicators_count',
    'opportunity_signals_count', v_metrics->'opportunity_signals_count',
    'memory_entries_count', v_metrics->'memory_entries_count',
    'avg_health_value', v_metrics->'avg_health_value',
    'health_snapshots', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'indicator_key', h.indicator_key, 'indicator_type', h.indicator_type,
        'summary', h.summary, 'signal_strength', h.signal_strength,
        'trend_pct', h.trend_pct, 'value_numeric', h.value_numeric, 'captured_at', h.captured_at
      ) order by h.value_numeric desc nulls last)
      from public.ecosystem_orchestration_health_snapshots h where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'knowledge_flow_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', k.id, 'signal_key', k.signal_key, 'signal_type', k.signal_type,
        'summary', k.summary, 'confidence', k.confidence, 'captured_at', k.captured_at
      ) order by k.captured_at desc)
      from public.ecosystem_orchestration_knowledge_flow_signals k where k.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'resilience_indicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'indicator_key', r.indicator_key, 'monitor_type', r.monitor_type,
        'summary', r.summary, 'signal', r.signal, 'value_numeric', r.value_numeric, 'captured_at', r.captured_at
      ) order by r.value_numeric desc nulls last)
      from public.ecosystem_orchestration_resilience_indicators r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'signal_key', o.signal_key, 'opportunity_type', o.opportunity_type,
        'summary', o.summary, 'priority', o.priority, 'status', o.status, 'captured_at', o.captured_at
      ) order by o.captured_at desc)
      from public.ecosystem_orchestration_opportunity_signals o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'entry_key', m.entry_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.ecosystem_orchestration_memory_entries m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._eocbp120_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 120 — Ecosystem Orchestration & Collective Evolution Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE120_ECOSYSTEM_ORCHESTRATION_COLLECTIVE_EVOLUTION.md',
      'engine_phase', 'Repo Phase 120 Ecosystem Orchestration Engine',
      'route', '/app/ecosystem-orchestration',
      'mapping_note', 'Era 111–120 capstone — collective evolution scaffolding.'
    ),
    'ecosystem_orchestration_engine_note', 'Ecosystem Orchestration Engine (ABOS Phase 120) — era capstone. Cross-link Phase 68 /app/orchestration and Phase 88 /app/ecosystem — do NOT duplicate.',
    'ecosystem_orchestration_blueprint', public._eocbp120_blueprint_block(v_tenant_id),
    'ecosystem_orchestration_distinction_note', public._eocbp120_distinction_note(),
    'ecosystem_orchestration_mission', public._eocbp120_mission(),
    'ecosystem_orchestration_philosophy', public._eocbp120_philosophy(),
    'ecosystem_orchestration_abos_principle', public._eocbp120_abos_principle(),
    'ecosystem_orchestration_objectives', public._eocbp120_objectives(),
    'orchestration_center_meta', public._eocbp120_orchestration_center(),
    'collective_evolution_meta', public._eocbp120_collective_evolution_engine(),
    'ecosystem_health_model_meta', public._eocbp120_ecosystem_health_model(),
    'knowledge_flow_meta', public._eocbp120_knowledge_flow_engine(),
    'resilience_engine_meta', public._eocbp120_resilience_engine(),
    'strategic_opportunity_meta', public._eocbp120_strategic_opportunity_engine(),
    'companion_responsibilities_meta', public._eocbp120_companion_responsibilities(),
    'stewardship_council_meta', public._eocbp120_stewardship_council(),
    'self_love_in_ecosystem_meta', public._eocbp120_self_love_in_ecosystem(),
    'ecosystem_memory_meta', public._eocbp120_ecosystem_memory_engine(),
    'eocbp120_era_ecosystem_cross_links', public._eocbp120_era_ecosystem_cross_links(),
    'eocbp120_extended_cross_links', public._eocbp120_extended_cross_links(),
    'ecosystem_orchestration_limitation_principles', public._eocbp120_limitation_principles(),
    'ecosystem_orchestration_companion_adaptation', public._eocbp120_companion_adaptation(),
    'eocbp120_integration_links', public._eocbp120_integration_links(),
    'ecosystem_orchestration_engagement_summary', public._eocbp120_engagement_summary(v_tenant_id),
    'ecosystem_orchestration_success_criteria', public._eocbp120_success_criteria(v_tenant_id),
    'ecosystem_orchestration_success_metrics', public._eocbp120_success_metrics(),
    'ecosystem_orchestration_vision', public._eocbp120_vision(),
    'ecosystem_orchestration_privacy_note', 'Ecosystem Orchestration metadata only — aggregate health, knowledge flow, resilience, and memory signals. No PII. No people ranking. Humans guide evolution; Companions strengthen.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ecosystem-orchestration-engine', 'Ecosystem Orchestration Engine',
  'Era 111–120 capstone — collective evolution orchestration center. Humans guide; Aipify prepares.',
  'authenticated', 140
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'ecosystem-orchestration-engine' and tenant_id is null
);

grant execute on function public.get_ecosystem_orchestration_card(uuid) to authenticated;
grant execute on function public.get_ecosystem_orchestration_dashboard(uuid) to authenticated;
grant execute on function public._eocbp120_distinction_note() to authenticated;
grant execute on function public._eocbp120_mission() to authenticated;
grant execute on function public._eocbp120_philosophy() to authenticated;
grant execute on function public._eocbp120_abos_principle() to authenticated;
grant execute on function public._eocbp120_vision() to authenticated;
grant execute on function public._eocbp120_objectives() to authenticated;
grant execute on function public._eocbp120_orchestration_center() to authenticated;
grant execute on function public._eocbp120_collective_evolution_engine() to authenticated;
grant execute on function public._eocbp120_ecosystem_health_model() to authenticated;
grant execute on function public._eocbp120_knowledge_flow_engine() to authenticated;
grant execute on function public._eocbp120_resilience_engine() to authenticated;
grant execute on function public._eocbp120_strategic_opportunity_engine() to authenticated;
grant execute on function public._eocbp120_companion_responsibilities() to authenticated;
grant execute on function public._eocbp120_stewardship_council() to authenticated;
grant execute on function public._eocbp120_self_love_in_ecosystem() to authenticated;
grant execute on function public._eocbp120_ecosystem_memory_engine() to authenticated;
grant execute on function public._eocbp120_era_ecosystem_cross_links() to authenticated;
grant execute on function public._eocbp120_extended_cross_links() to authenticated;
grant execute on function public._eocbp120_limitation_principles() to authenticated;
grant execute on function public._eocbp120_companion_adaptation() to authenticated;
grant execute on function public._eocbp120_success_metrics() to authenticated;
grant execute on function public._eocbp120_integration_links() to authenticated;
grant execute on function public._eocbp120_engagement_summary(uuid) to authenticated;
grant execute on function public._eocbp120_success_criteria(uuid) to authenticated;
grant execute on function public._eocbp120_blueprint_block(uuid) to authenticated;
