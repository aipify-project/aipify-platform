-- Phase 132 — Coordinated Companion Workforce Engine
-- Autonomous Organization Era (131–140) — workforce coordination center.
-- Distinct from Multi-Agent Collaboration Phase 74 at /app/agents and Companion Marketplace Phase 113.
-- Helpers: _ccwf_* (engine), _ccwfbp132_* (blueprint — never collide with _mag_*, _cmpm_*, _pco_*)

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
    'companion_workforce'
  )
);

-- ---------------------------------------------------------------------------
-- 1. companion_workforce_settings
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  workforce_center_enabled boolean not null default true,
  collaboration_enabled boolean not null default true,
  conflict_review_required boolean not null default true,
  human_oversight_required boolean not null default true,
  default_governance_tier text not null default 'assisted' check (
    default_governance_tier in ('observer', 'assisted', 'guided', 'governed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.companion_workforce_settings enable row level security;
revoke all on public.companion_workforce_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. companion_workforce_members
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  companion_key text not null,
  display_name text not null,
  department text not null,
  role_description text not null check (char_length(role_description) <= 500),
  governance_tier text not null default 'assisted' check (
    governance_tier in ('observer', 'assisted', 'guided', 'governed')
  ),
  status text not null default 'active' check (
    status in ('active', 'paused', 'under_review', 'archived')
  ),
  purpose text not null check (char_length(purpose) <= 500),
  authority_boundaries jsonb not null default '[]'::jsonb,
  escalation_path jsonb not null default '[]'::jsonb,
  knowledge_sources jsonb not null default '[]'::jsonb,
  operational_scope jsonb not null default '[]'::jsonb,
  performance_indicators jsonb not null default '[]'::jsonb,
  restrictions jsonb not null default '[]'::jsonb,
  route_href text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, companion_key)
);

create index if not exists companion_workforce_members_tenant_idx
  on public.companion_workforce_members (tenant_id, status, department);

alter table public.companion_workforce_members enable row level security;
revoke all on public.companion_workforce_members from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. companion_workforce_collaborations
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_collaborations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  collaboration_key text not null,
  companion_a text not null,
  companion_b text not null,
  collaboration_type text not null check (
    collaboration_type in (
      'support_knowledge', 'commerce_gp', 'executive_decision', 'operations_resilience',
      'governance_oversight', 'transformation_community', 'cross_functional', 'custom'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('active', 'paused', 'pending_review', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, collaboration_key)
);

create index if not exists companion_workforce_collaborations_tenant_idx
  on public.companion_workforce_collaborations (tenant_id, collaboration_type, status);

alter table public.companion_workforce_collaborations enable row level security;
revoke all on public.companion_workforce_collaborations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. companion_workforce_routing_rules
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_routing_rules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  rule_key text not null,
  rule_type text not null check (
    rule_type in ('task_routing', 'escalation_trigger', 'dependency_handoff', 'human_approval_gate')
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  target_companion_key text,
  priority int not null default 100,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, rule_key)
);

create index if not exists companion_workforce_routing_rules_tenant_idx
  on public.companion_workforce_routing_rules (tenant_id, rule_type, status);

alter table public.companion_workforce_routing_rules enable row level security;
revoke all on public.companion_workforce_routing_rules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. companion_workforce_conflicts
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_conflicts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  conflict_key text not null,
  conflict_type text not null check (
    conflict_type in (
      'authority_overlap', 'routing_ambiguity', 'escalation_gap',
      'responsibility_drift', 'governance_mismatch', 'collaboration_friction'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  human_review_status text not null default 'pending' check (
    human_review_status in ('pending', 'in_review', 'resolved', 'escalated', 'dismissed')
  ),
  severity text not null default 'moderate' check (
    severity in ('emerging', 'moderate', 'important', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, conflict_key)
);

create index if not exists companion_workforce_conflicts_tenant_idx
  on public.companion_workforce_conflicts (tenant_id, human_review_status, severity);

alter table public.companion_workforce_conflicts enable row level security;
revoke all on public.companion_workforce_conflicts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. companion_workforce_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.companion_workforce_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.companion_workforce_audit_logs enable row level security;
revoke all on public.companion_workforce_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'companion_workforce_engine', v.description
from (values
  ('companion_workforce.view', 'View Companion Workforce Center', 'View coordinated companion directory, collaborations, and aggregate workforce health'),
  ('companion_workforce.manage', 'Manage Companion Workforce Center', 'Configure companion workforce settings, routing rules, and responsibility assignments')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_workforce.view'), ('owner', 'companion_workforce.manage'),
  ('administrator', 'companion_workforce.view'), ('administrator', 'companion_workforce.manage'),
  ('manager', 'companion_workforce.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_ccwf_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccwf_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ccwf_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ccwf_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ccwf_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.companion_workforce_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ccwf_ensure_settings(p_tenant_id uuid)
returns public.companion_workforce_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.companion_workforce_settings;
begin
  insert into public.companion_workforce_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.companion_workforce_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ccwf_companion_limitation_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'expand_authority', 'label', 'Never expand authority', 'description', 'Companions stay within assigned governance tiers and boundaries'),
    jsonb_build_object('key', 'redefine_responsibilities', 'label', 'Never redefine responsibilities silently', 'description', 'Role changes require human approval and audit'),
    jsonb_build_object('key', 'suppress_escalation', 'label', 'Never suppress escalation', 'description', 'Uncertainty and conflicts route to humans — never hidden'),
    jsonb_build_object('key', 'bypass_governance', 'label', 'Never bypass governance', 'description', 'Trust Actions and Human Oversight gates remain mandatory'),
    jsonb_build_object('key', 'override_humans', 'label', 'Never override humans', 'description', 'Humans lead; companions support within frameworks')
  );
$$;

create or replace function public._ccwf_health_indicator_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'task_quality', 'label', 'Task quality'),
    jsonb_build_object('key', 'escalation_frequency', 'label', 'Escalation frequency'),
    jsonb_build_object('key', 'knowledge_usage', 'label', 'Knowledge usage'),
    jsonb_build_object('key', 'human_satisfaction', 'label', 'Human satisfaction'),
    jsonb_build_object('key', 'adoption', 'label', 'Adoption'),
    jsonb_build_object('key', 'contribution', 'label', 'Contribution'),
    jsonb_build_object('key', 'collaboration_success', 'label', 'Collaboration success')
  );
$$;

create or replace function public._ccwf_seed_members(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_workforce_members where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.companion_workforce_members (
    tenant_id, companion_key, display_name, department, role_description, governance_tier,
    status, purpose, authority_boundaries, escalation_path, knowledge_sources,
    operational_scope, performance_indicators, restrictions, route_href
  ) values
    (p_tenant_id, 'executive', 'Executive Companion', 'Leadership',
     'Leadership clarity, briefings, and executive decision context — humans decide.',
     'governed', 'active', 'Support executive visibility and decision preparation without replacing judgment.',
     '["inform_only","no_binding_directives"]'::jsonb, '["human_oversight","executive_sponsor"]'::jsonb,
     '["executive_memory","approved_briefings"]'::jsonb, '["strategic_initiatives","leadership_priorities"]'::jsonb,
     '["briefing_quality","alignment_signals"]'::jsonb, '["no_surveillance","metadata_only"]'::jsonb,
     '/app/executive-intelligence'),
    (p_tenant_id, 'support', 'Support Companion', 'Customer Operations',
     'Support triage, knowledge retrieval, and assisted responses within ASO governance.',
     'guided', 'active', 'Assist support operations with confidence scoring and human escalation.',
     '["draft_replies","escalate_uncertainty"]'::jsonb, '["support_lead","human_oversight"]'::jsonb,
     '["business_dna","support_knowledge"]'::jsonb, '["support_cases","categories"]'::jsonb,
     '["resolution_quality","escalation_rate"]'::jsonb, '["no_auto_refund","no_pii_storage"]'::jsonb,
     '/app/support-ai-engine'),
    (p_tenant_id, 'knowledge', 'Knowledge Companion', 'Knowledge',
     'Approved knowledge guidance — KC, Business DNA, and Employee Knowledge cross-links.',
     'assisted', 'active', 'Route questions to approved knowledge sources with gap detection.',
     '["approved_sources_only","cite_confidence"]'::jsonb, '["knowledge_steward","admin"]'::jsonb,
     '["knowledge_center","business_dna","employee_knowledge"]'::jsonb, '["kc_articles","support_procedures"]'::jsonb,
     '["answer_quality","gap_detection"]'::jsonb, '["no_unapproved_ingestion"]'::jsonb,
     '/app/knowledge-center-engine'),
    (p_tenant_id, 'commerce', 'Commerce Companion', 'Commerce',
     'Holistic commerce visibility — orders, inventory signals, and cross-module stewardship.',
     'guided', 'active', 'Daily commerce companion without reactive pressure.',
     '["read_operational_metadata","suggest_actions"]'::jsonb, '["commerce_lead","approvals"]'::jsonb,
     '["commerce_intelligence","product_automation"]'::jsonb, '["stores","orders","suppliers"]'::jsonb,
     '["fulfillment_quality","margin_signals"]'::jsonb, '["no_payment_changes"]'::jsonb,
     '/app/commerce-companion'),
    (p_tenant_id, 'growth_partner', 'Growth Partner Companion', 'Ecosystem',
     'Growth Partner operations support — never Affiliate terminology.',
     'governed', 'active', 'Support GP program coordination with governance alignment.',
     '["partner_metadata_only","no_contract_changes"]'::jsonb, '["partner_ops_lead","ecosystem_governance"]'::jsonb,
     '["gp_operations","partner_success"]'::jsonb, '["partner_program","certifications"]'::jsonb,
     '["partner_outcomes","certification_progress"]'::jsonb, '["growth_partner_not_affiliate"]'::jsonb,
     '/app/partners'),
    (p_tenant_id, 'governance', 'Governance Companion', 'Governance',
     'Policy alignment, approval awareness, and governance validation scaffolds.',
     'governed', 'active', 'Support governance visibility — guides not controls.',
     '["policy_awareness","approval_routing"]'::jsonb, '["governance_steward","human_oversight"]'::jsonb,
     '["governance_policy","trust_actions"]'::jsonb, '["policies","approvals","audit"]'::jsonb,
     '["compliance_signals","approval_latency"]'::jsonb, '["no_silent_policy_change"]'::jsonb,
     '/app/governance-policy-engine'),
    (p_tenant_id, 'transformation', 'Transformation Companion', 'Change',
     'Change adoption support — transformation orchestration cross-link Phase 127.',
     'guided', 'active', 'Support organizational change with adoption intelligence — not surveillance.',
     '["communication_scaffolds","adoption_signals"]'::jsonb, '["change_lead","executive_sponsor"]'::jsonb,
     '["change_management","stakeholder_comms"]'::jsonb, '["initiatives","adoption_metrics"]'::jsonb,
     '["adoption_progress","resistance_awareness"]'::jsonb, '["no_forced_rollout"]'::jsonb,
     '/app/change-management-engine'),
    (p_tenant_id, 'community', 'Community Companion', 'Community',
     'Community participation and collective success signals — aggregate only.',
     'assisted', 'active', 'Support community intelligence with healthy collaboration framing.',
     '["aggregate_participation","no_individual_ranking"]'::jsonb, '["community_lead"]'::jsonb,
     '["community_intelligence","social_impact"]'::jsonb, '["programs","events","engagement"]'::jsonb,
     '["participation_trends","program_health"]'::jsonb, '["no_individual_surveillance"]'::jsonb,
     '/app/community'),
    (p_tenant_id, 'resilience', 'Resilience Companion', 'Continuity',
     'Continuity readiness and resilience exercises — preparation not panic.',
     'guided', 'active', 'Support resilience awareness with cross-link to Phase 128 layer.',
     '["readiness_signals","exercise_scaffolds"]'::jsonb, '["resilience_lead","incident_response"]'::jsonb,
     '["organizational_resilience","continuity"]'::jsonb, '["dependencies","recovery_plans"]'::jsonb,
     '["readiness_score","exercise_completion"]'::jsonb, '["no_panic_framing"]'::jsonb,
     '/app/organizational-resilience-engine'),
    (p_tenant_id, 'operations', 'Operations Companion', 'Operations',
     'Workflow orchestration and operations center coordination.',
     'guided', 'active', 'Coordinate operational workflows with human approval gates.',
     '["workflow_suggestions","sequencing_scaffolds"]'::jsonb, '["ops_lead","workflow_orchestration"]'::jsonb,
     '["operations_center","workflow_orchestration"]'::jsonb, '["initiatives","tasks","dependencies"]'::jsonb,
     '["throughput_signals","bottleneck_awareness"]'::jsonb, '["no_unapproved_execution"]'::jsonb,
     '/app/operations-center-foundation-engine');
end; $$;

create or replace function public._ccwf_seed_collaborations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_workforce_collaborations where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.companion_workforce_collaborations (
    tenant_id, collaboration_key, companion_a, companion_b, collaboration_type, title, summary, status
  ) values
    (p_tenant_id, 'support-knowledge', 'support', 'knowledge', 'support_knowledge',
     'Support + Knowledge collaboration',
     'Support Companion routes uncertain cases to Knowledge Companion approved sources — human escalation when confidence is low.', 'active'),
    (p_tenant_id, 'commerce-gp', 'commerce', 'growth_partner', 'commerce_gp',
     'Commerce + Growth Partner collaboration',
     'Commerce signals inform GP program health — aggregate metadata only.', 'active'),
    (p_tenant_id, 'executive-decision', 'executive', 'governance', 'executive_decision',
     'Executive + Decision governance',
     'Executive Companion prepares context; Governance Companion validates approval requirements.', 'active'),
    (p_tenant_id, 'operations-resilience', 'operations', 'resilience', 'operations_resilience',
     'Operations + Resilience handoff',
     'Operational bottlenecks cross-link resilience readiness — humans review conflicts.', 'active'),
    (p_tenant_id, 'transformation-community', 'transformation', 'community', 'transformation_community',
     'Transformation + Community adoption',
     'Change adoption supported by community participation signals — support not surveillance.', 'active');
end; $$;

create or replace function public._ccwf_seed_routing_rules(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_workforce_routing_rules where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.companion_workforce_routing_rules (
    tenant_id, rule_key, rule_type, title, summary, target_companion_key, priority, status
  ) values
    (p_tenant_id, 'route-support-triage', 'task_routing', 'Support triage routing',
     'Route incoming support tasks to Support Companion with ASO confidence thresholds.', 'support', 10, 'active'),
    (p_tenant_id, 'route-knowledge-gap', 'task_routing', 'Knowledge gap routing',
     'Low-confidence support answers route to Knowledge Companion gap detection.', 'knowledge', 20, 'active'),
    (p_tenant_id, 'escalate-human-oversight', 'escalation_trigger', 'Human oversight escalation',
     'Critical or ambiguous workforce actions escalate to Human Oversight A.40.', null, 5, 'active'),
    (p_tenant_id, 'approval-trust-actions', 'human_approval_gate', 'Trust Actions approval gate',
     'Sensitive companion-coordinated actions require Trust Actions approval.', null, 1, 'active'),
    (p_tenant_id, 'handoff-executive-ops', 'dependency_handoff', 'Executive–Operations handoff',
     'Executive priorities hand off to Operations Companion for sequencing scaffolds.', 'operations', 30, 'active');
end; $$;

create or replace function public._ccwf_seed_conflicts(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_workforce_conflicts where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.companion_workforce_conflicts (
    tenant_id, conflict_key, conflict_type, title, summary, human_review_status, severity
  ) values
    (p_tenant_id, 'overlap-support-knowledge', 'authority_overlap',
     'Support–Knowledge boundary review',
     'Scaffold: clarify when Support Companion defers to Knowledge Companion — human review recommended.', 'pending', 'moderate'),
    (p_tenant_id, 'routing-commerce-ops', 'routing_ambiguity',
     'Commerce–Operations routing clarity',
     'Scaffold: ambiguous operational commerce tasks need explicit routing rule — governance validation.', 'pending', 'emerging');
end; $$;

create or replace function public._ccwf_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_members_active int;
  v_collaborations_active int;
  v_routing_rules_active int;
  v_conflicts_pending int;
  v_workforce_score numeric;
begin
  select count(*) into v_members_active from public.companion_workforce_members
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_collaborations_active from public.companion_workforce_collaborations
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_routing_rules_active from public.companion_workforce_routing_rules
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_conflicts_pending from public.companion_workforce_conflicts
  where tenant_id = p_tenant_id and human_review_status in ('pending', 'in_review');

  v_workforce_score := least(100, greatest(0,
    (v_members_active * 6) + (v_collaborations_active * 5) + (v_routing_rules_active * 4)
    + 20 - (v_conflicts_pending * 3)
  ));

  return jsonb_build_object(
    'workforce_score', round(v_workforce_score, 1),
    'members_active', v_members_active,
    'collaborations_active', v_collaborations_active,
    'routing_rules_active', v_routing_rules_active,
    'conflicts_pending', v_conflicts_pending,
    'health_indicators_count', jsonb_array_length(public._ccwf_health_indicator_scaffolds()),
    'companion_roles_count', 10,
    'limitation_rules_count', jsonb_array_length(public._ccwf_companion_limitation_rules())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_ccwfbp132_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccwfbp132_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 132 — Coordinated Companion Workforce Engine at /app/companion-workforce-engine. Workforce coordination center for specialized Companions as teams — NOT one super-assistant. Autonomous Organization Era (131–140). Distinct from Multi-Agent Collaboration Phase 74 at /app/agents (agent registry/orchestration — cross-link, do NOT duplicate). Distinct from Companion Marketplace Phase 113 at /app/companion-marketplace (digital employee catalog — cross-link). Phase 131 Autonomy Governance & Human Oversight is not yet a dedicated migration — cross-link Human Oversight A.40 at /app/human-oversight-engine for oversight gates. Helpers _ccwfbp132_* — never collide with _mag_*, _cmpm_*, _pco_*.';
$$;

create or replace function public._ccwfbp132_mission()
returns text language sql immutable as $$
  select 'Coordinate specialized Companions as a harmonious workforce — clarity of responsibility, healthy collaboration, and human-led governance. People First. Companionship before replacement.';
$$;

create or replace function public._ccwfbp132_philosophy()
returns text language sql immutable as $$
  select 'Humans lead; companions support within governance frameworks. Harmony not hierarchy. Specialized Companions work as teams — never one super-assistant. Metadata only — no surveillance of individuals. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._ccwfbp132_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Companion Workforce Center orchestrates responsibility, collaboration, and escalation across companion roles. Aipify recommends and prepares; humans approve and decide.';
$$;

create or replace function public._ccwfbp132_vision()
returns text language sql immutable as $$
  select 'Organizations experience coordinated companion teamwork — meaningful support, balanced workloads, psychological safety, and recognition — while humans retain full authority.';
$$;

create or replace function public._ccwfbp132_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Specialized Companions, coordinated teams',
    'Harmony not hierarchy',
    'Humans lead — companions support',
    'Metadata only — never surveillance',
    'Meaningful work and healthy collaboration'
  );
$$;

create or replace function public._ccwfbp132_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'workforce_directory', 'emoji', '📋', 'label', 'Workforce directory', 'description', 'Clear companion roles with purpose and boundaries'),
    jsonb_build_object('key', 'collaboration_rules', 'emoji', '🤝', 'label', 'Collaboration rules', 'description', 'Defined companion pairs and workflow handoffs'),
    jsonb_build_object('key', 'task_routing', 'emoji', '🔀', 'label', 'Task routing', 'description', 'Route work to the right companion with escalation'),
    jsonb_build_object('key', 'conflict_management', 'emoji', '⚖️', 'label', 'Conflict management', 'description', 'Detect overlaps and route to human review'),
    jsonb_build_object('key', 'governance_alignment', 'emoji', '🛡️', 'label', 'Governance alignment', 'description', 'Human Oversight and Trust Actions integration'),
    jsonb_build_object('key', 'health_insights', 'emoji', '💚', 'label', 'Workforce health insights', 'description', 'Aggregate companion health — not individual ranking'),
    jsonb_build_object('key', 'human_collaboration', 'emoji', '👥', 'label', 'Human collaboration model', 'description', 'Approve, redirect, suspend, modify, review, feedback'),
    jsonb_build_object('key', 'psychological_safety', 'emoji', '🌹', 'label', 'Psychological safety', 'description', 'Self Love connection — balanced workloads and recognition')
  );
$$;

create or replace function public._ccwfbp132_companion_workforce_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'directory', 'label', 'Companion directory'),
    jsonb_build_object('key', 'responsibility_assignment', 'label', 'Responsibility assignment'),
    jsonb_build_object('key', 'collaboration_rules', 'label', 'Collaboration rules'),
    jsonb_build_object('key', 'visualization', 'label', 'Workforce visualization'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation paths'),
    jsonb_build_object('key', 'performance_insights', 'label', 'Performance insights — aggregate only'),
    jsonb_build_object('key', 'governance', 'label', 'Governance dashboards'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight dashboards')
  );
$$;

create or replace function public._ccwfbp132_companion_roles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'executive', 'label', 'Executive Companion', 'route', '/app/executive-intelligence'),
    jsonb_build_object('key', 'support', 'label', 'Support Companion', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge Companion', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'commerce', 'label', 'Commerce Companion', 'route', '/app/commerce-companion'),
    jsonb_build_object('key', 'growth_partner', 'label', 'Growth Partner Companion', 'route', '/app/partners'),
    jsonb_build_object('key', 'governance', 'label', 'Governance Companion', 'route', '/app/governance-policy-engine'),
    jsonb_build_object('key', 'transformation', 'label', 'Transformation Companion', 'route', '/app/change-management-engine'),
    jsonb_build_object('key', 'community', 'label', 'Community Companion', 'route', '/app/community'),
    jsonb_build_object('key', 'resilience', 'label', 'Resilience Companion', 'route', '/app/organizational-resilience-engine'),
    jsonb_build_object('key', 'operations', 'label', 'Operations Companion', 'route', '/app/operations-center-foundation-engine')
  );
$$;

create or replace function public._ccwfbp132_collaboration_model()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'support_knowledge', 'label', 'Support + Knowledge', 'companions', jsonb_build_array('support', 'knowledge')),
    jsonb_build_object('key', 'commerce_gp', 'label', 'Commerce + Growth Partner', 'companions', jsonb_build_array('commerce', 'growth_partner')),
    jsonb_build_object('key', 'executive_decision', 'label', 'Executive + Governance', 'companions', jsonb_build_array('executive', 'governance')),
    jsonb_build_object('key', 'operations_resilience', 'label', 'Operations + Resilience', 'companions', jsonb_build_array('operations', 'resilience')),
    jsonb_build_object('key', 'transformation_community', 'label', 'Transformation + Community', 'companions', jsonb_build_array('transformation', 'community'))
  );
$$;

create or replace function public._ccwfbp132_workforce_orchestration()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'task_routing', 'label', 'Task routing'),
    jsonb_build_object('key', 'role_assignment', 'label', 'Role assignment'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation'),
    jsonb_build_object('key', 'collaboration_requests', 'label', 'Collaboration requests'),
    jsonb_build_object('key', 'dependencies', 'label', 'Dependencies'),
    jsonb_build_object('key', 'human_approval', 'label', 'Human approval gates'),
    jsonb_build_object('key', 'sequencing', 'label', 'Sequencing')
  );
$$;

create or replace function public._ccwfbp132_responsibility_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'purpose', 'label', 'Purpose'),
    jsonb_build_object('key', 'authority_boundaries', 'label', 'Authority boundaries'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation path'),
    jsonb_build_object('key', 'knowledge_sources', 'label', 'Knowledge sources'),
    jsonb_build_object('key', 'operational_scope', 'label', 'Operational scope'),
    jsonb_build_object('key', 'performance_indicators', 'label', 'Performance indicators — aggregate'),
    jsonb_build_object('key', 'restrictions', 'label', 'Restrictions')
  );
$$;

create or replace function public._ccwfbp132_human_collaboration_model()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'approve', 'label', 'Approve'),
    jsonb_build_object('key', 'redirect', 'label', 'Redirect'),
    jsonb_build_object('key', 'suspend', 'label', 'Suspend'),
    jsonb_build_object('key', 'modify', 'label', 'Modify'),
    jsonb_build_object('key', 'review', 'label', 'Review'),
    jsonb_build_object('key', 'feedback', 'label', 'Feedback')
  );
$$;

create or replace function public._ccwfbp132_companion_directory_schema()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'fields', jsonb_build_array(
      'companion_key', 'display_name', 'department', 'role_description', 'governance_tier',
      'status', 'purpose', 'authority_boundaries', 'escalation_path', 'knowledge_sources',
      'operational_scope', 'performance_indicators', 'restrictions', 'route_href'
    ),
    'privacy_note', 'Metadata only — no PII in directory entries'
  );
$$;

create or replace function public._ccwfbp132_companion_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'indicators', public._ccwf_health_indicator_scaffolds(),
    'aggregate_only', true,
    'note', 'Task quality, escalation frequency, knowledge usage, human satisfaction, adoption, contribution, collaboration success — aggregate metadata only'
  );
$$;

create or replace function public._ccwfbp132_conflict_management()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'detection', 'label', 'Conflict detection'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation to humans'),
    jsonb_build_object('key', 'human_review', 'label', 'Human review workflow'),
    jsonb_build_object('key', 'governance_validation', 'label', 'Governance validation'),
    jsonb_build_object('key', 'responsibility_clarification', 'label', 'Responsibility clarification')
  );
$$;

create or replace function public._ccwfbp132_companion_limitations()
returns jsonb language sql immutable as $$
  select public._ccwf_companion_limitation_rules();
$$;

create or replace function public._ccwfbp132_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'meaningful_work', 'label', 'Meaningful work'),
    jsonb_build_object('key', 'healthy_collaboration', 'label', 'Healthy collaboration'),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition'),
    jsonb_build_object('key', 'balanced_workloads', 'label', 'Balanced workloads'),
    jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety')
  );
$$;

create or replace function public._ccwfbp132_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'rbac', 'label', 'RBAC via companion_workforce permissions'),
    jsonb_build_object('key', 'companion_auth', 'label', 'Companion auth boundaries'),
    jsonb_build_object('key', 'audit_trails', 'label', 'Metadata-only audit trails'),
    jsonb_build_object('key', 'human_approval', 'label', 'Human approval for sensitive coordination'),
    jsonb_build_object('key', 'activity_monitoring', 'label', 'Aggregate activity monitoring — not surveillance'),
    jsonb_build_object('key', 'executive_visibility', 'label', 'Executive visibility — aggregate trends'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'route', '/app/settings/two-factor')
  );
$$;

create or replace function public._ccwfbp132_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'agents', 'label', 'Multi-Agent Collaboration Phase 74', 'route', '/app/agents', 'note', 'Agent registry — cross-link only'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'note', 'Oversight gates — Phase 131 interim cross-link'),
    jsonb_build_object('key', 'companion_marketplace', 'label', 'Companion Marketplace Phase 113', 'route', '/app/companion-marketplace', 'note', 'Digital employee catalog — cross-link'),
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion', 'route', '/app/proactive-companion-engine', 'note', 'Proactive guidance cross-link'),
    jsonb_build_object('key', 'workflow_orchestration', 'label', 'Workflow Orchestration A.42', 'route', '/app/workflow-orchestration-engine', 'note', 'Autonomous operations orchestration'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Engine Phase 30', 'route', '/app/approvals', 'note', 'Approval center for sensitive actions'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Wellbeing and psychological safety')
  );
$$;

create or replace function public._ccwfbp132_dogfooding()
returns text language sql immutable as $$
  select 'Aipify coordinates its own companion workforce internally — directory, collaboration rules, and human oversight gates validated before customer rollout.';
$$;

create or replace function public._ccwfbp132_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._ccwf_refresh_metrics(p_tenant_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'workforce_center', 'label', 'Companion Workforce Center — eight capabilities documented', 'met', jsonb_array_length(public._ccwfbp132_companion_workforce_center()) = 8, 'note', null),
    jsonb_build_object('key', 'companion_roles', 'label', 'Ten companion roles seeded with routes', 'met', (v_metrics->>'members_active')::int >= 10, 'note', null),
    jsonb_build_object('key', 'collaboration_model', 'label', 'Five collaboration pairs documented', 'met', (v_metrics->>'collaborations_active')::int >= 5, 'note', null),
    jsonb_build_object('key', 'orchestration', 'label', 'Workforce orchestration — seven dimensions', 'met', jsonb_array_length(public._ccwfbp132_workforce_orchestration()) = 7, 'note', null),
    jsonb_build_object('key', 'responsibility_framework', 'label', 'Responsibility framework — seven fields', 'met', jsonb_array_length(public._ccwfbp132_responsibility_framework()) = 7, 'note', null),
    jsonb_build_object('key', 'human_collaboration', 'label', 'Human collaboration model — six actions', 'met', jsonb_array_length(public._ccwfbp132_human_collaboration_model()) = 6, 'note', null),
    jsonb_build_object('key', 'health_engine', 'label', 'Companion health — seven aggregate indicators', 'met', (v_metrics->>'health_indicators_count')::int = 7, 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Five companion limitation rules', 'met', (v_metrics->>'limitation_rules_count')::int = 5, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory integration links documented', 'met', jsonb_array_length(public._ccwfbp132_integration_links()) >= 7, 'note', null),
    jsonb_build_object('key', 'distinction_agents', 'label', 'Distinction from Phase 74 agents documented', 'met', position('/app/agents' in public._ccwfbp132_distinction_note()) > 0, 'note', null)
  );
end; $$;

create or replace function public._ccwfbp132_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._ccwf_refresh_metrics(p_tenant_id);
  return v_metrics || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._ccwfbp132_objectives()),
    'workforce_center_capabilities', jsonb_array_length(public._ccwfbp132_companion_workforce_center()),
    'companion_roles_count', jsonb_array_length(public._ccwfbp132_companion_roles()),
    'collaboration_pairs_count', jsonb_array_length(public._ccwfbp132_collaboration_model()),
    'orchestration_dimensions', jsonb_array_length(public._ccwfbp132_workforce_orchestration()),
    'integration_links_count', jsonb_array_length(public._ccwfbp132_integration_links()),
    'privacy_note', public._ccwfbp132_privacy_note()
  );
end; $$;

create or replace function public._ccwfbp132_privacy_note()
returns text language sql immutable as $$
  select 'Metadata only — companion workforce directory and health signals use aggregate trends. No PII, no individual surveillance, no raw chat or email content.';
$$;

create or replace function public._ccwfbp132_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '132',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE132_COORDINATED_COMPANION_WORKFORCE.md',
    'engine_phase', 'Repo Phase 132 — Coordinated Companion Workforce Engine',
    'route', '/app/companion-workforce-engine',
    'distinction_note', public._ccwfbp132_distinction_note(),
    'mission', public._ccwfbp132_mission(),
    'philosophy', public._ccwfbp132_philosophy(),
    'abos_principle', public._ccwfbp132_abos_principle(),
    'vision', public._ccwfbp132_vision(),
    'vision_phrases', public._ccwfbp132_vision_phrases(),
    'objectives', public._ccwfbp132_objectives(),
    'companion_workforce_center', public._ccwfbp132_companion_workforce_center(),
    'companion_roles', public._ccwfbp132_companion_roles(),
    'collaboration_model', public._ccwfbp132_collaboration_model(),
    'workforce_orchestration', public._ccwfbp132_workforce_orchestration(),
    'responsibility_framework', public._ccwfbp132_responsibility_framework(),
    'human_collaboration_model', public._ccwfbp132_human_collaboration_model(),
    'companion_directory_schema', public._ccwfbp132_companion_directory_schema(),
    'companion_health_engine', public._ccwfbp132_companion_health_engine(),
    'conflict_management', public._ccwfbp132_conflict_management(),
    'companion_limitations', public._ccwfbp132_companion_limitations(),
    'self_love_connection', public._ccwfbp132_self_love_connection(),
    'security_requirements', public._ccwfbp132_security_requirements(),
    'integration_links', public._ccwfbp132_integration_links(),
    'dogfooding', public._ccwfbp132_dogfooding(),
    'success_criteria', public._ccwfbp132_success_criteria(p_tenant_id),
    'engagement_summary', public._ccwfbp132_engagement_summary(p_tenant_id),
    'privacy_note', public._ccwfbp132_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.list_companion_workforce_members(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ccwf_tenant_for_auth());
  if v_tenant_id is null then return '[]'::jsonb; end if;
  perform public._ccwf_seed_members(v_tenant_id);
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', m.id, 'companion_key', m.companion_key, 'display_name', m.display_name,
      'department', m.department, 'role_description', m.role_description,
      'governance_tier', m.governance_tier, 'status', m.status, 'purpose', m.purpose,
      'authority_boundaries', m.authority_boundaries, 'escalation_path', m.escalation_path,
      'knowledge_sources', m.knowledge_sources, 'operational_scope', m.operational_scope,
      'performance_indicators', m.performance_indicators, 'restrictions', m.restrictions,
      'route_href', m.route_href
    ) order by m.display_name)
    from public.companion_workforce_members m where m.tenant_id = v_tenant_id and m.status != 'archived'
  ), '[]'::jsonb);
end; $$;

create or replace function public.record_companion_workforce_collaboration(
  p_companion_a text, p_companion_b text, p_collaboration_type text,
  p_title text, p_summary text, p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ccwf_require_tenant());
  v_key := lower(p_companion_a || '-' || p_companion_b || '-' || left(p_collaboration_type, 12));
  insert into public.companion_workforce_collaborations (
    tenant_id, collaboration_key, companion_a, companion_b, collaboration_type, title, summary
  ) values (v_tenant_id, v_key, p_companion_a, p_companion_b, p_collaboration_type, p_title, left(p_summary, 500))
  on conflict (tenant_id, collaboration_key) do update set
    title = excluded.title, summary = excluded.summary, updated_at = now()
  returning id into v_id;
  perform public._ccwf_log_audit(v_tenant_id, 'collaboration_recorded', p_title, jsonb_build_object('collaboration_id', v_id));
  return v_id;
end; $$;

create or replace function public.record_companion_workforce_conflict(
  p_conflict_type text, p_title text, p_summary text,
  p_severity text default 'moderate', p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ccwf_require_tenant());
  v_key := lower(p_conflict_type || '-' || left(md5(p_title), 8));
  insert into public.companion_workforce_conflicts (
    tenant_id, conflict_key, conflict_type, title, summary, severity
  ) values (v_tenant_id, v_key, p_conflict_type, p_title, left(p_summary, 500), p_severity)
  on conflict (tenant_id, conflict_key) do update set
    summary = excluded.summary, severity = excluded.severity, updated_at = now()
  returning id into v_id;
  perform public._ccwf_log_audit(v_tenant_id, 'conflict_recorded', p_title, jsonb_build_object('conflict_id', v_id));
  return v_id;
end; $$;

create or replace function public.get_companion_workforce_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.companion_workforce_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ccwf_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._ccwf_ensure_settings(v_tenant_id);
  perform public._ccwf_seed_members(v_tenant_id);
  perform public._ccwf_seed_collaborations(v_tenant_id);
  v_metrics := public._ccwf_refresh_metrics(v_tenant_id);
  v_engagement := public._ccwfbp132_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'workforce_score', v_metrics->>'workforce_score',
    'members_active', v_metrics->>'members_active',
    'collaborations_active', v_metrics->>'collaborations_active',
    'conflicts_pending', v_metrics->>'conflicts_pending',
    'philosophy', public._ccwfbp132_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'workforce_center_enabled', v_settings.workforce_center_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', '132',
      'title', 'Coordinated Companion Workforce',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE132_COORDINATED_COMPANION_WORKFORCE.md',
      'engine_phase', 'Repo Phase 132',
      'route', '/app/companion-workforce-engine'
    ),
    'companion_workforce_mission', public._ccwfbp132_mission(),
    'companion_workforce_abos_principle', public._ccwfbp132_abos_principle(),
    'companion_workforce_engagement_summary', v_engagement,
    'companion_workforce_note', public._ccwfbp132_distinction_note(),
    'companion_workforce_vision_note', public._ccwfbp132_vision()
  );
end; $$;

create or replace function public.get_companion_workforce_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.companion_workforce_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ccwf_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._ccwf_ensure_settings(v_tenant_id);
  perform public._ccwf_seed_members(v_tenant_id);
  perform public._ccwf_seed_collaborations(v_tenant_id);
  perform public._ccwf_seed_routing_rules(v_tenant_id);
  perform public._ccwf_seed_conflicts(v_tenant_id);
  v_metrics := public._ccwf_refresh_metrics(v_tenant_id);
  perform public._ccwf_log_audit(v_tenant_id, 'dashboard_view', 'Companion Workforce dashboard viewed', jsonb_build_object('score', v_metrics->>'workforce_score'));

  return jsonb_build_object(
    'has_customer', true,
    'workforce_center_enabled', v_settings.workforce_center_enabled,
    'collaboration_enabled', v_settings.collaboration_enabled,
    'conflict_review_required', v_settings.conflict_review_required,
    'human_oversight_required', v_settings.human_oversight_required,
    'default_governance_tier', v_settings.default_governance_tier,
    'philosophy', public._ccwfbp132_philosophy(),
    'safety_note', 'Humans lead — companions support. Metadata only — no surveillance.',
    'distinction_note', public._ccwfbp132_distinction_note(),
    'workforce_score', (v_metrics->>'workforce_score')::numeric,
    'members_active', (v_metrics->>'members_active')::int,
    'collaborations_active', (v_metrics->>'collaborations_active')::int,
    'routing_rules_active', (v_metrics->>'routing_rules_active')::int,
    'conflicts_pending', (v_metrics->>'conflicts_pending')::int,
    'members', public.list_companion_workforce_members(v_tenant_id),
    'collaborations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'collaboration_key', c.collaboration_key, 'companion_a', c.companion_a,
        'companion_b', c.companion_b, 'collaboration_type', c.collaboration_type,
        'title', c.title, 'summary', c.summary, 'status', c.status
      ) order by c.title)
      from public.companion_workforce_collaborations c where c.tenant_id = v_tenant_id and c.status != 'archived'
    ), '[]'::jsonb),
    'routing_rules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'rule_key', r.rule_key, 'rule_type', r.rule_type,
        'title', r.title, 'summary', r.summary, 'target_companion_key', r.target_companion_key,
        'priority', r.priority, 'status', r.status
      ) order by r.priority)
      from public.companion_workforce_routing_rules r where r.tenant_id = v_tenant_id and r.status = 'active'
    ), '[]'::jsonb),
    'conflicts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'conflict_key', f.conflict_key, 'conflict_type', f.conflict_type,
        'title', f.title, 'summary', f.summary, 'human_review_status', f.human_review_status,
        'severity', f.severity
      ) order by f.severity desc)
      from public.companion_workforce_conflicts f
      where f.tenant_id = v_tenant_id and f.human_review_status not in ('resolved', 'dismissed')
    ), '[]'::jsonb),
    'companion_workforce_center', public._ccwfbp132_companion_workforce_center(),
    'companion_roles_meta', public._ccwfbp132_companion_roles(),
    'collaboration_model', public._ccwfbp132_collaboration_model(),
    'workforce_orchestration', public._ccwfbp132_workforce_orchestration(),
    'responsibility_framework', public._ccwfbp132_responsibility_framework(),
    'human_collaboration_model', public._ccwfbp132_human_collaboration_model(),
    'companion_health_engine', public._ccwfbp132_companion_health_engine(),
    'conflict_management', public._ccwfbp132_conflict_management(),
    'companion_limitations', public._ccwf_companion_limitation_rules(),
    'self_love_connection', public._ccwfbp132_self_love_connection(),
    'security_requirements', public._ccwfbp132_security_requirements(),
    'integration_links', public._ccwfbp132_integration_links(),
    'implementation_blueprint', public._ccwfbp132_blueprint_block(v_tenant_id),
    'companion_workforce_blueprint', public._ccwfbp132_blueprint_block(v_tenant_id),
    'companion_workforce_mission', public._ccwfbp132_mission(),
    'companion_workforce_philosophy', public._ccwfbp132_philosophy(),
    'companion_workforce_abos_principle', public._ccwfbp132_abos_principle(),
    'companion_workforce_objectives', public._ccwfbp132_objectives(),
    'companion_workforce_engagement_summary', public._ccwfbp132_engagement_summary(v_tenant_id),
    'companion_workforce_success_criteria', public._ccwfbp132_success_criteria(v_tenant_id),
    'ccwfbp132_cross_links', public._ccwfbp132_integration_links(),
    'companion_workforce_vision', public._ccwfbp132_vision(),
    'companion_workforce_vision_phrases', public._ccwfbp132_vision_phrases(),
    'companion_workforce_privacy_note', public._ccwfbp132_privacy_note(),
    'companion_workforce_engine_note', 'Autonomous Organization Era (131–140) — coordinated companion workforce. Cross-link Phase 74 agents and Human Oversight A.40 — do not duplicate RPCs.'
  );
end; $$;

grant execute on function public.get_companion_workforce_engine_dashboard(uuid) to authenticated;
grant execute on function public.get_companion_workforce_engine_card(uuid) to authenticated;
grant execute on function public.list_companion_workforce_members(uuid) to authenticated;
grant execute on function public.record_companion_workforce_collaboration(text, text, text, text, text, uuid) to authenticated;
grant execute on function public.record_companion_workforce_conflict(text, text, text, text, uuid) to authenticated;
grant execute on function public._ccwfbp132_distinction_note() to authenticated;
grant execute on function public._ccwfbp132_mission() to authenticated;
grant execute on function public._ccwfbp132_philosophy() to authenticated;
grant execute on function public._ccwfbp132_abos_principle() to authenticated;
grant execute on function public._ccwfbp132_vision() to authenticated;
grant execute on function public._ccwfbp132_privacy_note() to authenticated;
