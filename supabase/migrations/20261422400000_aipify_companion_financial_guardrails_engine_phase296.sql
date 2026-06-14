-- Phase 296 — Companion Financial Guardrails Engine
-- Feature owner: Customer App — /app/governance/financial-guardrails
-- Helpers: _cfg_* (engine), _cfgbp296_* (blueprint)
-- Integrates with Trust & Action and Approval Profiles conceptually — does NOT modify action_policies, approval profile RPCs, or /app/approvals core RPCs
-- Cross-links /app/approvals, /app/governance/approval-profiles, /app/governance metadata only

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
    'aipify_status_institutional_memory_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'trust_center_foundation_engine',
    'continuous_improvement_engine', 'mentorship_engine',
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
    'audience_targeting_checkpoints_engine',
    'risk_center',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'human_approval_gates_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_guardianship_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_mentorship_engine',
    'companion_identity_engine',
    'impact_engine',
    'guardianship_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
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
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization',
    'global_knowledge_exchange',
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civic_collaboration_engine',
    'cross_sector_intelligence_engine',
    'civilizational_memory_engine',
    'legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
    'humanity_shared_courage_responsible_action_engine',
    'humanity_shared_gratitude_appreciative_stewardship_engine',
    'humanity_shared_humility_continuous_renewal_engine',
    'humanity_shared_legacy_flourishing_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine',
    'human_legacy_eternal_stewardship_engine',
    'universal_stewardship_shared_futures_engine',
    'humanity_collective_wisdom_shared_learning_engine',
    'humanity_shared_purpose_contribution_engine',
    'humanity_shared_resilience_adaptive_capacity_engine',
    'humanity_shared_trust_cooperative_intelligence_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_risk_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine',
    'universal_action_access_framework',
    'aipify_enterprise_packaging_upgrade_instant_access_engine',
    'pilot_learning_customer_zero_engine',
    'aipify_install_business_discovery_engine',
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (RLS revoke pattern)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_financial_guardrail_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  guardrails_enabled boolean not null default true,
  default_approval_threshold text not null default 'level_2' check (
    default_approval_threshold in ('level_1', 'level_2', 'level_3', 'level_4')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_financial_guardrail_settings enable row level security;
revoke all on public.aipify_financial_guardrail_settings from authenticated, anon;

create table if not exists public.aipify_financial_guardrail_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  profile_key text not null,
  profile_name text not null,
  spending_category text not null check (
    spending_category in ('personal', 'business', 'enterprise')
  ),
  limit_type text not null check (
    limit_type in ('per_transaction', 'monthly', 'team')
  ),
  limits jsonb not null default '{}'::jsonb,
  approval_threshold text not null default 'level_2' check (
    approval_threshold in ('level_1', 'level_2', 'level_3', 'level_4')
  ),
  allowed_providers jsonb not null default '[]'::jsonb,
  restrictions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('active', 'disabled', 'suspended', 'deleted')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, profile_key)
);
create index if not exists aipify_financial_guardrail_profiles_tenant_idx
  on public.aipify_financial_guardrail_profiles (tenant_id, spending_category, status);
alter table public.aipify_financial_guardrail_profiles enable row level security;
revoke all on public.aipify_financial_guardrail_profiles from authenticated, anon;

create table if not exists public.aipify_financial_guardrail_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  spending_category text check (
    spending_category is null or spending_category in ('personal', 'business', 'enterprise')
  ),
  profile_key text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
create index if not exists aipify_financial_guardrail_recommendations_tenant_idx
  on public.aipify_financial_guardrail_recommendations (tenant_id, status, created_at desc);
alter table public.aipify_financial_guardrail_recommendations enable row level security;
revoke all on public.aipify_financial_guardrail_recommendations from authenticated, anon;

create table if not exists public.aipify_financial_guardrail_expenditures (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  expenditure_key text not null,
  profile_key text not null,
  spending_category text not null check (
    spending_category in ('personal', 'business', 'enterprise')
  ),
  amount numeric not null check (amount >= 0),
  currency text not null default 'NOK',
  description text check (description is null or char_length(description) <= 500),
  provider_label text,
  status text not null default 'requested' check (
    status in ('requested', 'approved', 'denied')
  ),
  approval_threshold text check (
    approval_threshold is null or approval_threshold in ('level_1', 'level_2', 'level_3', 'level_4')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, expenditure_key)
);
create index if not exists aipify_financial_guardrail_expenditures_tenant_idx
  on public.aipify_financial_guardrail_expenditures (tenant_id, profile_key, status, created_at desc);
alter table public.aipify_financial_guardrail_expenditures enable row level security;
revoke all on public.aipify_financial_guardrail_expenditures from authenticated, anon;

create table if not exists public.aipify_financial_guardrail_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_key text not null,
  profile_key text,
  alert_type text not null check (alert_type in (
    'budget_80_percent', 'limit_exceeded', 'unusual_spending',
    'threshold_escalation', 'provider_restriction', 'policy_exception'
  )),
  severity text not null default 'informational' check (
    severity in ('informational', 'attention', 'action_required')
  ),
  message text not null,
  status text not null default 'active' check (
    status in ('active', 'acknowledged', 'resolved', 'dismissed')
  ),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, alert_key)
);
create index if not exists aipify_financial_guardrail_alerts_tenant_idx
  on public.aipify_financial_guardrail_alerts (tenant_id, status, severity, created_at desc);
alter table public.aipify_financial_guardrail_alerts enable row level security;
revoke all on public.aipify_financial_guardrail_alerts from authenticated, anon;

create table if not exists public.aipify_financial_guardrail_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'profile_created', 'profile_modified', 'profile_suspended', 'profile_deleted',
    'expenditure_recorded', 'expenditure_approved', 'expenditure_denied',
    'alert_triggered', 'alert_acknowledged', 'exception_added', 'permission_revoked',
    'recommendation_accepted', 'recommendation_dismissed', 'settings_updated'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_financial_guardrail_audit_logs_tenant_idx
  on public.aipify_financial_guardrail_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_financial_guardrail_audit_logs enable row level security;
revoke all on public.aipify_financial_guardrail_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_companion_financial_guardrails_engine', v.description
from (values
  (
    'financial_guardrail.view',
    'View Financial Guardrails',
    'Browse spending profiles, expenditures, alerts, and budget utilization indicators'
  ),
  (
    'financial_guardrail.manage',
    'Manage Financial Guardrails',
    'Update guardrail settings, suspend profiles, and acknowledge alerts'
  ),
  (
    'financial_guardrail.record',
    'Record Financial Guardrail Events',
    'Create and update spending profiles and record expenditure metadata'
  ),
  (
    'financial_guardrail.delete',
    'Delete Financial Guardrails',
    'Delete spending profiles and revoke permissions — distinct from Trust & Action policies'
  )
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'financial_guardrail.view'),
  ('owner', 'financial_guardrail.manage'),
  ('owner', 'financial_guardrail.record'),
  ('owner', 'financial_guardrail.delete'),
  ('administrator', 'financial_guardrail.view'),
  ('administrator', 'financial_guardrail.manage'),
  ('administrator', 'financial_guardrail.record'),
  ('administrator', 'financial_guardrail.delete'),
  ('manager', 'financial_guardrail.view'),
  ('manager', 'financial_guardrail.manage'),
  ('manager', 'financial_guardrail.record'),
  ('manager', 'financial_guardrail.delete'),
  ('employee', 'financial_guardrail.view'),
  ('employee', 'financial_guardrail.record'),
  ('support_agent', 'financial_guardrail.view'),
  ('moderator', 'financial_guardrail.view'),
  ('viewer', 'financial_guardrail.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_companion_financial_guardrails_engine"]'::jsonb,
    updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_companion_financial_guardrails_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _cfgbp296_*
-- ---------------------------------------------------------------------------
create or replace function public._cfgbp296_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 296 — Companion Financial Guardrails Engine at /app/governance/financial-guardrails. Defines spending boundaries and budget alerts — distinct from Trust & Action at /app/approvals and Approval Profiles at /app/governance/approval-profiles. Cross-links metadata only. Helpers _cfgbp296_*.';
$$;

create or replace function public._cfgbp296_core_principle() returns text language sql immutable as $$
  select 'Financial guardrails should protect budgets without blocking everyday work. Aipify should surface spending boundaries clearly — humans decide when exceptions apply.';
$$;

create or replace function public._cfgbp296_financial_philosophy() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Guardrails inform and prepare — they never execute payments or store payment instruments.',
    'without_guardrails', 'Unclear spending limits and reactive budget surprises after the fact.',
    'with_guardrails', '"This expenditure matches your approved profile." — transparent limits, proactive alerts, human override always available.',
    'rules', jsonb_build_array(
      'Guardrails store metadata boundaries only — no card numbers, bank accounts, or payment credentials',
      'Per-transaction, monthly, and team limits define scope — escalation follows approval thresholds',
      'Alerts surface at 80% utilization, limit exceeded, and unusual spending patterns',
      'Every profile is editable, suspendable, and deletable',
      'Approval Center remains authoritative for level_3 and level_4 escalations',
      'Approval Profiles Phase 295 cross-link is metadata only — separate RPC boundary'
    ),
    'trust_action_distinction', 'Trust & Action at /app/approvals owns action policies and approval gates — Financial Guardrails store spending boundary metadata only.'
  );
$$;

create or replace function public._cfgbp296_spending_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'personal', 'label', 'Personal', 'description', 'Individual spending — taxi, food, flowers, personal services under defined limits'),
    jsonb_build_object('key', 'business', 'label', 'Business', 'description', 'Operational spending — catering, printing, courier, and standard business services'),
    jsonb_build_object('key', 'enterprise', 'label', 'Enterprise', 'description', 'Large-scale spending — procurement, travel, and team budget allocations')
  );
$$;

create or replace function public._cfgbp296_limit_types() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'per_transaction', 'label', 'Per transaction', 'description', 'Maximum amount for a single expenditure before escalation'),
    jsonb_build_object('key', 'monthly', 'label', 'Monthly', 'description', 'Rolling monthly budget cap for a spending category or profile'),
    jsonb_build_object('key', 'team', 'label', 'Team', 'description', 'Shared team budget — quarterly or periodic allocation for group spending')
  );
$$;

create or replace function public._cfgbp296_approval_thresholds() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'level_1', 'label', 'Level 1 — Information', 'description', 'Low-risk spending within profile limits — streamlined confirmation'),
    jsonb_build_object('key', 'level_2', 'label', 'Level 2 — Reversible', 'description', 'Moderate spending — profile match with explicit confirmation'),
    jsonb_build_object('key', 'level_3', 'label', 'Level 3 — Sensitive', 'description', 'Higher spending — escalates to Approval Center for human decision'),
    jsonb_build_object('key', 'level_4', 'label', 'Level 4 — Critical', 'description', 'Enterprise-scale spending — always requires explicit Approval Center approval')
  );
$$;

create or replace function public._cfgbp296_spending_check_flow() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Observe → Check profile → Alert if needed → Prepare → Approve → Record metadata.',
    'steps', jsonb_build_array(
      jsonb_build_object('step', 1, 'key', 'identify', 'label', 'Identify expenditure', 'description', 'Companion recognizes spending intent and category'),
      jsonb_build_object('step', 2, 'key', 'match_profile', 'label', 'Match profile', 'description', 'Find active guardrail profile for category and provider'),
      jsonb_build_object('step', 3, 'key', 'check_limits', 'label', 'Check limits', 'description', 'Compare amount against per-transaction, monthly, or team limits'),
      jsonb_build_object('step', 4, 'key', 'evaluate_threshold', 'label', 'Evaluate threshold', 'description', 'Determine approval threshold level_1 through level_4'),
      jsonb_build_object('step', 5, 'key', 'alert_if_needed', 'label', 'Alert if needed', 'description', 'Trigger budget alerts at 80%, limit exceeded, or unusual patterns'),
      jsonb_build_object('step', 6, 'key', 'prepare_approval', 'label', 'Prepare approval', 'description', 'Prepare expenditure for confirmation or Approval Center escalation'),
      jsonb_build_object('step', 7, 'key', 'record_metadata', 'label', 'Record metadata', 'description', 'Log approved or denied expenditure metadata — no payment data stored')
    ),
    'override_rule', 'Any expenditure may be escalated to Approval Center — logged and auditable.'
  );
$$;

create or replace function public._cfgbp296_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Financial guardrails store governance metadata only — never raw payment records or credentials.',
    'requirements', jsonb_build_array(
      'No modification of existing action_policies, Trust & Action core RPCs, or Approval Profiles RPCs',
      'Spending limits are metadata boundaries — not payment instrument storage',
      'Expenditure records store amount, category, and status only — no card or account details',
      'Audit logs store event types and summaries only — context is structured metadata',
      'Tenant isolation mandatory — no cross-tenant profile sharing',
      'Level 4 spending always escalates to Approval Center regardless of profile match',
      'Phase 295 approval profiles cross-link is metadata only — separate RPC boundary',
      'GitHub-style 2FA, enterprise permissions, and audit logging remain active'
    ),
    'audit_table', 'aipify_financial_guardrail_audit_logs'
  );
$$;

create or replace function public._cfgbp296_user_control() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'You define spending boundaries — Aipify prepares, you decide when exceptions apply.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'guardrails_enabled', 'label', 'Guardrails enabled', 'description', 'Pause all financial guardrail matching — revert to standard approval flow'),
      jsonb_build_object('key', 'default_approval_threshold', 'label', 'Default approval threshold', 'description', 'Default threshold for new profiles — level_1 through level_4'),
      jsonb_build_object('key', 'create_profile', 'label', 'Create profile', 'description', 'create_financial_guardrail_profile — define spending boundaries'),
      jsonb_build_object('key', 'update_profile', 'label', 'Update profile', 'description', 'update_financial_guardrail_profile — modify limits, providers, and restrictions'),
      jsonb_build_object('key', 'suspend_profile', 'label', 'Suspend profile', 'description', 'Pause individual profile — expenditures fall back to standard flow'),
      jsonb_build_object('key', 'delete_profile', 'label', 'Delete profile', 'description', 'Remove profile — audit trail preserved'),
      jsonb_build_object('key', 'add_exception', 'label', 'Add exception', 'description', 'Record one-time policy exception — logged and auditable'),
      jsonb_build_object('key', 'revoke_permission', 'label', 'Revoke permission', 'description', 'Revoke provider or category permission from a profile'),
      jsonb_build_object('key', 'acknowledge_alert', 'label', 'Acknowledge alert', 'description', 'Mark budget alert as acknowledged or resolved')
    )
  );
$$;

create or replace function public._cfgbp296_vision() returns text language sql immutable as $$
  select 'The goal is not to block spending. The goal is to make spending boundaries visible before surprises happen — so humans can decide with clarity.';
$$;

create or replace function public._cfgbp296_privacy_note() returns text language sql immutable as $$
  select 'Companion Financial Guardrails store spending boundary metadata, utilization summaries, and alert context only — distinct from Trust & Action policies and Approval Profiles. No payment credentials, card numbers, bank accounts, or raw transaction records.';
$$;

create or replace function public._cfgbp296_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 296 — Companion Financial Guardrails Engine',
    'title', 'Companion Financial Guardrails Engine',
    'route', '/app/governance/financial-guardrails',
    'distinction_note', public._cfgbp296_distinction_note(),
    'core_principle', public._cfgbp296_core_principle(),
    'financial_philosophy', public._cfgbp296_financial_philosophy(),
    'spending_categories', public._cfgbp296_spending_categories(),
    'limit_types', public._cfgbp296_limit_types(),
    'approval_thresholds', public._cfgbp296_approval_thresholds(),
    'spending_check_flow', public._cfgbp296_spending_check_flow(),
    'security_requirements', public._cfgbp296_security_requirements(),
    'user_control', public._cfgbp296_user_control(),
    'vision', public._cfgbp296_vision(),
    'privacy_note', public._cfgbp296_privacy_note(),
    'cross_links', jsonb_build_array(
      jsonb_build_object('key', 'approvals_30', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals'),
      jsonb_build_object('key', 'approval_profiles_295', 'label', 'Approval Profiles Phase 295', 'route', '/app/governance/approval-profiles'),
      jsonb_build_object('key', 'governance_center', 'label', 'Governance Center', 'route', '/app/governance'),
      jsonb_build_object('key', 'financial_guardrails_center', 'label', 'Financial Guardrails Center', 'route', '/app/governance/financial-guardrails')
    )
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _cfg_*
-- ---------------------------------------------------------------------------
create or replace function public._cfg_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._cfg_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cfg_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cfg_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_financial_guardrail_audit_logs (
    tenant_id, event_type, summary, context
  ) values (
    p_tenant_id, p_event_type, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cfg_ensure_settings(p_tenant_id uuid)
returns public.aipify_financial_guardrail_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_financial_guardrail_settings;
begin
  insert into public.aipify_financial_guardrail_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row
  from public.aipify_financial_guardrail_settings
  where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._cfg_profile_to_json(p_row public.aipify_financial_guardrail_profiles)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'profile_key', p_row.profile_key,
    'profile_name', p_row.profile_name,
    'spending_category', p_row.spending_category,
    'limit_type', p_row.limit_type,
    'limits', p_row.limits,
    'approval_threshold', p_row.approval_threshold,
    'allowed_providers', p_row.allowed_providers,
    'restrictions', p_row.restrictions,
    'status', p_row.status,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cfg_settings_to_json(p_row public.aipify_financial_guardrail_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'guardrails_enabled', p_row.guardrails_enabled,
    'default_approval_threshold', p_row.default_approval_threshold,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._cfg_build_recommendations(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key,
      'message', r.message,
      'spending_category', r.spending_category,
      'profile_key', r.profile_key,
      'status', r.status,
      'created_at', r.created_at
    ) order by case r.status when 'pending' then 1 when 'accepted' then 2 else 3 end, r.created_at)
    from public.aipify_financial_guardrail_recommendations r
    where r.tenant_id = p_tenant_id and r.status = 'pending'
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_active_profiles(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(public._cfg_profile_to_json(p) order by p.spending_category, p.profile_name)
    from public.aipify_financial_guardrail_profiles p
    where p.tenant_id = p_tenant_id
      and p.status = 'active'
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_alerts(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key,
      'profile_key', a.profile_key,
      'alert_type', a.alert_type,
      'severity', a.severity,
      'message', a.message,
      'status', a.status,
      'context', a.context,
      'created_at', a.created_at
    ) order by
      case a.severity when 'action_required' then 1 when 'attention' then 2 else 3 end,
      a.created_at desc)
    from public.aipify_financial_guardrail_alerts a
    where a.tenant_id = p_tenant_id
      and a.status in ('active', 'acknowledged')
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_expenditures(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'expenditure_key', e.expenditure_key,
      'profile_key', e.profile_key,
      'spending_category', e.spending_category,
      'amount', e.amount,
      'currency', e.currency,
      'description', e.description,
      'provider_label', e.provider_label,
      'status', e.status,
      'approval_threshold', e.approval_threshold,
      'created_at', e.created_at
    ) order by e.created_at desc)
    from public.aipify_financial_guardrail_expenditures e
    where e.tenant_id = p_tenant_id
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_spending_trends(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'approved_30d', coalesce((
      select sum(amount) from public.aipify_financial_guardrail_expenditures
      where tenant_id = p_tenant_id
        and status = 'approved'
        and created_at >= now() - interval '30 days'
    ), 0),
    'requested_30d', coalesce((
      select sum(amount) from public.aipify_financial_guardrail_expenditures
      where tenant_id = p_tenant_id
        and status = 'requested'
        and created_at >= now() - interval '30 days'
    ), 0),
    'denied_30d', coalesce((
      select count(*) from public.aipify_financial_guardrail_expenditures
      where tenant_id = p_tenant_id
        and status = 'denied'
        and created_at >= now() - interval '30 days'
    ), 0),
    'by_category', coalesce((
      select jsonb_object_agg(spending_category, total)
      from (
        select spending_category, sum(amount) as total
        from public.aipify_financial_guardrail_expenditures
        where tenant_id = p_tenant_id
          and status = 'approved'
          and created_at >= now() - interval '30 days'
        group by spending_category
      ) s
    ), '{}'::jsonb),
    'currency', 'NOK',
    'metadata_only', true
  );
$$;

create or replace function public._cfg_build_budget_utilization(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'profile_key', p.profile_key,
      'profile_name', p.profile_name,
      'spending_category', p.spending_category,
      'limit_type', p.limit_type,
      'limits', p.limits,
      'spent_30d', coalesce((
        select sum(e.amount)
        from public.aipify_financial_guardrail_expenditures e
        where e.tenant_id = p_tenant_id
          and e.profile_key = p.profile_key
          and e.status = 'approved'
          and e.created_at >= now() - interval '30 days'
      ), 0),
      'utilization_percent', case
        when p.limit_type = 'monthly' and coalesce((p.limits->>'monthly_max')::numeric, 0) > 0 then
          round((
            coalesce((
              select sum(e.amount)
              from public.aipify_financial_guardrail_expenditures e
              where e.tenant_id = p_tenant_id
                and e.profile_key = p.profile_key
                and e.status = 'approved'
                and e.created_at >= now() - interval '30 days'
            ), 0) / (p.limits->>'monthly_max')::numeric * 100
          )::numeric, 1)
        else null
      end,
      'metadata_only', true
    ) order by p.spending_category, p.profile_name)
    from public.aipify_financial_guardrail_profiles p
    where p.tenant_id = p_tenant_id and p.status = 'active'
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_effectiveness_indicators(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_profiles', (
      select count(*) from public.aipify_financial_guardrail_profiles
      where tenant_id = p_tenant_id and status = 'active'
    ),
    'suspended_profiles', (
      select count(*) from public.aipify_financial_guardrail_profiles
      where tenant_id = p_tenant_id and status = 'suspended'
    ),
    'active_alerts', (
      select count(*) from public.aipify_financial_guardrail_alerts
      where tenant_id = p_tenant_id and status = 'active'
    ),
    'pending_expenditures', (
      select count(*) from public.aipify_financial_guardrail_expenditures
      where tenant_id = p_tenant_id and status = 'requested'
    ),
    'by_category', coalesce((
      select jsonb_object_agg(spending_category, cnt)
      from (
        select spending_category, count(*) as cnt
        from public.aipify_financial_guardrail_profiles
        where tenant_id = p_tenant_id and status = 'active'
        group by spending_category
      ) s
    ), '{}'::jsonb),
    'by_threshold', coalesce((
      select jsonb_object_agg(approval_threshold, cnt)
      from (
        select approval_threshold, count(*) as cnt
        from public.aipify_financial_guardrail_profiles
        where tenant_id = p_tenant_id and status = 'active'
        group by approval_threshold
      ) s
    ), '{}'::jsonb),
    'guardrails_enabled', (
      select guardrails_enabled from public.aipify_financial_guardrail_settings
      where tenant_id = p_tenant_id
    ),
    'metadata_only', true
  );
$$;

create or replace function public._cfg_build_high_value_transactions(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(row_data order by amt desc)
    from (
      select
        e.amount as amt,
        jsonb_build_object(
          'expenditure_key', e.expenditure_key,
          'profile_key', e.profile_key,
          'amount', e.amount,
          'currency', e.currency,
          'description', e.description,
          'status', e.status,
          'approval_threshold', e.approval_threshold,
          'created_at', e.created_at
        ) as row_data
      from public.aipify_financial_guardrail_expenditures e
      where e.tenant_id = p_tenant_id
        and e.status in ('approved', 'requested')
        and e.created_at >= now() - interval '30 days'
      order by e.amount desc
      limit 5
    ) top5
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_build_policy_exceptions(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'alert_key', a.alert_key,
      'profile_key', a.profile_key,
      'message', a.message,
      'context', a.context,
      'status', a.status,
      'created_at', a.created_at
    ) order by a.created_at desc)
    from public.aipify_financial_guardrail_alerts a
    where a.tenant_id = p_tenant_id
      and a.alert_type = 'policy_exception'
      and a.status in ('active', 'acknowledged')
  ), '[]'::jsonb);
$$;

create or replace function public._cfg_approvals_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'route', '/app/approvals',
    'note', 'Trust & Action Phase 30 Approval Center — authoritative for level_3 and level_4 escalations. Financial Guardrails do not modify action_policies.',
    'metadata_only', true
  );
$$;

create or replace function public._cfg_approval_profiles_metadata(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'active_profiles', (
        select count(*) from public.aipify_approval_profiles_registry
        where tenant_id = p_tenant_id and status = 'active'
      ),
      'route', '/app/governance/approval-profiles',
      'note', 'Phase 295 Approval Profiles cross-link — metadata only, separate RPC',
      'metadata_only', true
    )
  ), jsonb_build_object(
    'note', 'Approval Profiles not yet initialized — Phase 295 cross-link',
    'route', '/app/governance/approval-profiles',
    'metadata_only', true
  ));
$$;

create or replace function public._cfg_seed_profile_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_seeded boolean := false;
  v_profiles int := 0;
  v_recommendations int := 0;
  v_expenditures int := 0;
  v_alerts int := 0;
begin
  perform public._cfg_ensure_settings(p_tenant_id);

  if exists (
    select 1 from public.aipify_financial_guardrail_profiles
    where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  insert into public.aipify_financial_guardrail_profiles (
    tenant_id, profile_key, profile_name, spending_category, limit_type,
    limits, approval_threshold, allowed_providers, restrictions, status
  ) values
    (
      p_tenant_id, 'personal_taxi', 'Personal taxi',
      'personal', 'per_transaction',
      '{"currency":"NOK","per_transaction_max":800}'::jsonb,
      'level_1',
      '["Uber","Bolt","Taxi Norge"]'::jsonb,
      '[{"rule":"business_destination_only","value":true}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'personal_flowers', 'Personal flowers',
      'personal', 'per_transaction',
      '{"currency":"NOK","per_transaction_max":1000}'::jsonb,
      'level_2',
      '["Interflora","Blomsterlandet"]'::jsonb,
      '[{"rule":"occasion_types","value":["birthday","thank_you","milestone"]}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'personal_food_ordering', 'Personal food ordering',
      'personal', 'per_transaction',
      '{"currency":"NOK","per_transaction_max":500,"monthly_max":3000}'::jsonb,
      'level_2',
      '["Foodora","Wolt"]'::jsonb,
      '[{"rule":"weekday_only","value":true}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'business_catering', 'Business catering',
      'business', 'monthly',
      '{"currency":"NOK","monthly_max":15000}'::jsonb,
      'level_2',
      '["Catering Partner A","Office Lunch Co"]'::jsonb,
      '[{"rule":"team_event_only","value":true}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'business_printing', 'Business printing',
      'business', 'per_transaction',
      '{"currency":"NOK","per_transaction_max":2000}'::jsonb,
      'level_1',
      '["PrintPartner","OfficePrint"]'::jsonb,
      '[{"rule":"black_white_default","value":true}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'enterprise_procurement', 'Enterprise procurement',
      'enterprise', 'monthly',
      '{"currency":"NOK","monthly_max":500000}'::jsonb,
      'level_4',
      '["Approved Vendor List"]'::jsonb,
      '[{"rule":"purchase_order_required","value":true},{"rule":"three_quotes_above","value":50000}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'enterprise_travel', 'Enterprise travel',
      'enterprise', 'team',
      '{"currency":"NOK","quarterly_max":200000,"period":"quarterly"}'::jsonb,
      'level_3',
      '["SAS","Norwegian","Booking.com Business"]'::jsonb,
      '[{"rule":"advance_booking_days","value":14},{"rule":"preferred_class","value":"economy"}]'::jsonb,
      'active'
    ),
    (
      p_tenant_id, 'business_courier', 'Business courier',
      'business', 'per_transaction',
      '{"currency":"NOK","per_transaction_max":1500}'::jsonb,
      'level_2',
      '["Posten","Bring","DHL Express"]'::jsonb,
      '[{"rule":"business_address_only","value":true}]'::jsonb,
      'active'
    );

  get diagnostics v_profiles = row_count;

  insert into public.aipify_financial_guardrail_recommendations (
    tenant_id, recommendation_key, message, spending_category, profile_key, status
  ) values
    (
      p_tenant_id, 'taxi_limit_review',
      'Your taxi spending is consistent — consider confirming the 800 NOK per-transaction limit remains appropriate.',
      'personal', 'personal_taxi', 'pending'
    ),
    (
      p_tenant_id, 'food_monthly_approaching',
      'Personal food ordering is at 72% of monthly limit — review before next order.',
      'personal', 'personal_food_ordering', 'pending'
    ),
    (
      p_tenant_id, 'catering_budget_optimize',
      'Business catering usage suggests a team profile could consolidate monthly catering approvals.',
      'business', 'business_catering', 'pending'
    ),
    (
      p_tenant_id, 'procurement_threshold_confirm',
      'Enterprise procurement profile uses level_4 threshold — confirm this matches your governance policy.',
      'enterprise', 'enterprise_procurement', 'pending'
    ),
    (
      p_tenant_id, 'travel_quarterly_review',
      'Enterprise travel team budget is mid-quarter — review quarterly allocation and preferred providers.',
      'enterprise', 'enterprise_travel', 'pending'
    ),
    (
      p_tenant_id, 'courier_provider_add',
      'Recent courier requests suggest adding a preferred provider to the business courier profile.',
      'business', 'business_courier', 'pending'
    )
  on conflict (tenant_id, recommendation_key) do nothing;

  get diagnostics v_recommendations = row_count;

  insert into public.aipify_financial_guardrail_expenditures (
    tenant_id, expenditure_key, profile_key, spending_category,
    amount, currency, description, provider_label, status, approval_threshold
  ) values
    (
      p_tenant_id, 'taxi_airport_transfer', 'personal_taxi', 'personal',
      650, 'NOK', 'Airport transfer — client meeting', 'Bolt', 'approved', 'level_1'
    ),
    (
      p_tenant_id, 'flowers_team_milestone', 'personal_flowers', 'personal',
      850, 'NOK', 'Team milestone celebration flowers', 'Interflora', 'approved', 'level_2'
    ),
    (
      p_tenant_id, 'food_team_lunch', 'personal_food_ordering', 'personal',
      420, 'NOK', 'Team lunch order', 'Wolt', 'approved', 'level_2'
    ),
    (
      p_tenant_id, 'catering_friday_event', 'business_catering', 'business',
      4800, 'NOK', 'Friday team catering event', 'Catering Partner A', 'approved', 'level_2'
    ),
    (
      p_tenant_id, 'print_quarterly_reports', 'business_printing', 'business',
      1200, 'NOK', 'Quarterly report printing', 'PrintPartner', 'approved', 'level_1'
    ),
    (
      p_tenant_id, 'courier_contract_delivery', 'business_courier', 'business',
      980, 'NOK', 'Contract delivery to client', 'Bring', 'requested', 'level_2'
    ),
    (
      p_tenant_id, 'procurement_equipment', 'enterprise_procurement', 'enterprise',
      85000, 'NOK', 'Office equipment procurement request', 'Approved Vendor List', 'requested', 'level_4'
    ),
    (
      p_tenant_id, 'travel_conference_booking', 'enterprise_travel', 'enterprise',
      12500, 'NOK', 'Conference travel booking', 'SAS', 'denied', 'level_3'
    )
  on conflict (tenant_id, expenditure_key) do nothing;

  get diagnostics v_expenditures = row_count;

  insert into public.aipify_financial_guardrail_alerts (
    tenant_id, alert_key, profile_key, alert_type, severity, message, status, context
  ) values
    (
      p_tenant_id, 'food_monthly_80pct', 'personal_food_ordering',
      'budget_80_percent', 'attention',
      'Personal food ordering has reached 80% of monthly limit (2,400 / 3,000 NOK).',
      'active',
      '{"utilization_percent":80,"spent":2400,"limit":3000,"currency":"NOK"}'::jsonb
    ),
    (
      p_tenant_id, 'catering_monthly_exceeded', 'business_catering',
      'limit_exceeded', 'action_required',
      'Business catering monthly limit exceeded — review before additional orders.',
      'active',
      '{"spent":16200,"limit":15000,"currency":"NOK","metadata_only":true}'::jsonb
    ),
    (
      p_tenant_id, 'procurement_unusual_spending', 'enterprise_procurement',
      'unusual_spending', 'attention',
      'Enterprise procurement request is 40% above typical monthly pattern — review recommended.',
      'active',
      '{"typical_monthly":60000,"requested":85000,"variance_percent":40}'::jsonb
    ),
    (
      p_tenant_id, 'travel_threshold_escalation', 'enterprise_travel',
      'threshold_escalation', 'attention',
      'Conference travel booking requires level_3 Approval Center escalation.',
      'active',
      '{"expenditure_key":"travel_conference_booking","threshold":"level_3","route":"/app/approvals"}'::jsonb
    ),
    (
      p_tenant_id, 'taxi_provider_exception', 'personal_taxi',
      'policy_exception', 'informational',
      'One-time taxi provider exception recorded for non-preferred provider.',
      'acknowledged',
      '{"provider":"Local Taxi","reason":"airport_availability","metadata_only":true}'::jsonb
    )
  on conflict (tenant_id, alert_key) do nothing;

  get diagnostics v_alerts = row_count;

  v_seeded := true;

  perform public._cfg_log_event(
    p_tenant_id,
    'profile_created',
    'Companion Financial Guardrails sample data seeded',
    jsonb_build_object('seeded', true, 'profiles', v_profiles, 'metadata_only', true)
  );

  return jsonb_build_object(
    'seeded', v_seeded,
    'profiles', v_profiles,
    'recommendations', v_recommendations,
    'expenditures', v_expenditures,
    'alerts', v_alerts
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_financial_guardrails_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_financial_guardrail_settings;
  v_seed jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cfg_require_tenant());
  perform public._irp_require_permission('financial_guardrail.view', v_tenant_id);

  v_settings := public._cfg_ensure_settings(v_tenant_id);

  if not exists (
    select 1 from public.aipify_financial_guardrail_profiles
    where tenant_id = v_tenant_id limit 1
  ) then
    v_seed := public._cfg_seed_profile_data(v_tenant_id);
  end if;

  select * into v_settings
  from public.aipify_financial_guardrail_settings
  where tenant_id = v_tenant_id;

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'route', '/app/governance/financial-guardrails',
    'settings', public._cfg_settings_to_json(v_settings),
    'active_profiles', public._cfg_build_active_profiles(v_tenant_id),
    'recommendations', public._cfg_build_recommendations(v_tenant_id),
    'expenditures', public._cfg_build_expenditures(v_tenant_id),
    'alerts', public._cfg_build_alerts(v_tenant_id),
    'spending_trends', public._cfg_build_spending_trends(v_tenant_id),
    'budget_utilization', public._cfg_build_budget_utilization(v_tenant_id),
    'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id),
    'high_value_transactions', public._cfg_build_high_value_transactions(v_tenant_id),
    'policy_exceptions', public._cfg_build_policy_exceptions(v_tenant_id),
    'blueprint', public._cfgbp296_blueprint_summary(),
    'links', jsonb_build_object(
      'financial_guardrails', '/app/governance/financial-guardrails',
      'approvals', '/app/approvals',
      'approval_profiles', '/app/governance/approval-profiles',
      'governance_center', '/app/governance',
      'approvals_metadata', public._cfg_approvals_metadata(v_tenant_id),
      'approval_profiles_metadata', public._cfg_approval_profiles_metadata(v_tenant_id),
      'trust_action_note', 'Trust & Action policies remain authoritative — Financial Guardrails define spending boundary metadata only.'
    ),
    'seed', v_seed,
    'privacy_note', public._cfgbp296_privacy_note(),
    'can_manage', public._irp_has_permission('financial_guardrail.manage', v_tenant_id),
    'can_record', public._irp_has_permission('financial_guardrail.record', v_tenant_id),
    'can_delete', public._irp_has_permission('financial_guardrail.delete', v_tenant_id)
  );
end; $$;

create or replace function public.create_financial_guardrail_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_financial_guardrail_settings;
  v_profile_key text;
  v_row public.aipify_financial_guardrail_profiles;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cfg_require_tenant());
  perform public._irp_require_permission('financial_guardrail.record', v_tenant_id);

  v_settings := public._cfg_ensure_settings(v_tenant_id);

  if not v_settings.guardrails_enabled then
    return jsonb_build_object(
      'error', 'guardrails_disabled',
      'message', 'Financial guardrails are paused — enable in settings before creating profiles.'
    );
  end if;

  v_profile_key := nullif(p_payload->>'profile_key', '');
  if v_profile_key is null then
    v_profile_key := 'fg_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  end if;
  if nullif(p_payload->>'profile_name', '') is null then raise exception 'profile_name required'; end if;
  if nullif(p_payload->>'spending_category', '') is null then raise exception 'spending_category required'; end if;
  if nullif(p_payload->>'limit_type', '') is null then raise exception 'limit_type required'; end if;

  insert into public.aipify_financial_guardrail_profiles (
    tenant_id, profile_key, profile_name, spending_category, limit_type,
    limits, approval_threshold, allowed_providers, restrictions, status
  ) values (
    v_tenant_id,
    v_profile_key,
    left(p_payload->>'profile_name', 200),
    p_payload->>'spending_category',
    p_payload->>'limit_type',
    coalesce(p_payload->'limits', '{}'::jsonb),
    coalesce(nullif(p_payload->>'approval_threshold', ''), v_settings.default_approval_threshold),
    coalesce(p_payload->'allowed_providers', '[]'::jsonb),
    coalesce(p_payload->'restrictions', '[]'::jsonb),
    'active'
  )
  returning * into v_row;

  perform public._cfg_log_event(
    v_tenant_id,
    'profile_created',
    format('Financial guardrail profile created: %s', v_profile_key),
    jsonb_build_object('profile_key', v_profile_key, 'spending_category', v_row.spending_category)
  );

  return jsonb_build_object(
    'created', true,
    'profile', public._cfg_profile_to_json(v_row),
    'active_profiles', public._cfg_build_active_profiles(v_tenant_id),
    'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id)
  );
end; $$;

create or replace function public.update_financial_guardrail_profile(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile_key text;
  v_row public.aipify_financial_guardrail_profiles;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cfg_require_tenant());
  perform public._irp_require_permission('financial_guardrail.manage', v_tenant_id);

  v_profile_key := nullif(p_payload->>'profile_key', '');
  if v_profile_key is null then raise exception 'profile_key required'; end if;

  update public.aipify_financial_guardrail_profiles set
    profile_name = coalesce(left(p_payload->>'profile_name', 200), profile_name),
    spending_category = coalesce(nullif(p_payload->>'spending_category', ''), spending_category),
    limit_type = coalesce(nullif(p_payload->>'limit_type', ''), limit_type),
    limits = case
      when p_payload ? 'limits' then limits || coalesce(p_payload->'limits', '{}'::jsonb)
      else limits
    end,
    approval_threshold = coalesce(nullif(p_payload->>'approval_threshold', ''), approval_threshold),
    allowed_providers = case
      when p_payload ? 'allowed_providers' then p_payload->'allowed_providers'
      else allowed_providers
    end,
    restrictions = case
      when p_payload ? 'restrictions' then p_payload->'restrictions'
      else restrictions
    end,
    status = coalesce(nullif(p_payload->>'status', ''), status),
    updated_at = now()
  where tenant_id = v_tenant_id
    and profile_key = v_profile_key
    and status <> 'deleted'
  returning * into v_row;

  if not found then raise exception 'Financial guardrail profile not found'; end if;

  perform public._cfg_log_event(
    v_tenant_id,
    'profile_modified',
    format('Financial guardrail profile updated: %s', v_profile_key),
    jsonb_build_object('profile_key', v_profile_key, 'status', v_row.status)
  );

  return jsonb_build_object(
    'updated', true,
    'profile', public._cfg_profile_to_json(v_row),
    'active_profiles', public._cfg_build_active_profiles(v_tenant_id),
    'budget_utilization', public._cfg_build_budget_utilization(v_tenant_id),
    'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id)
  );
end; $$;

create or replace function public.record_financial_guardrail_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_action text;
  v_profile_key text;
  v_recommendation_key text;
  v_alert_key text;
  v_expenditure_key text;
  v_row public.aipify_financial_guardrail_profiles;
  v_settings public.aipify_financial_guardrail_settings;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._cfg_require_tenant());
  v_action := coalesce(p_payload->>'action', '');

  if v_action in ('delete', 'revoke_permission') then
    perform public._irp_require_permission('financial_guardrail.delete', v_tenant_id);
  elsif v_action in ('suspend', 'update_settings') then
    perform public._irp_require_permission('financial_guardrail.manage', v_tenant_id);
  else
    perform public._irp_require_permission('financial_guardrail.record', v_tenant_id);
  end if;

  v_settings := public._cfg_ensure_settings(v_tenant_id);
  v_profile_key := nullif(p_payload->>'profile_key', '');
  v_recommendation_key := nullif(p_payload->>'recommendation_key', '');
  v_alert_key := nullif(p_payload->>'alert_key', '');
  v_expenditure_key := nullif(p_payload->>'expenditure_key', '');

  if v_action = 'suspend' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    update public.aipify_financial_guardrail_profiles set
      status = 'suspended',
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status = 'active'
    returning * into v_row;

    if not found then raise exception 'Financial guardrail profile not found or not active'; end if;

    perform public._cfg_log_event(
      v_tenant_id,
      'profile_suspended',
      format('Financial guardrail profile suspended: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'profile', public._cfg_profile_to_json(v_row),
      'active_profiles', public._cfg_build_active_profiles(v_tenant_id),
      'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id)
    );

  elsif v_action = 'delete' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;

    update public.aipify_financial_guardrail_profiles set
      status = 'deleted',
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status <> 'deleted'
    returning * into v_row;

    if not found then raise exception 'Financial guardrail profile not found'; end if;

    update public.aipify_financial_guardrail_recommendations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id
      and status = 'pending'
      and profile_key = v_profile_key;

    perform public._cfg_log_event(
      v_tenant_id,
      'profile_deleted',
      format('Financial guardrail profile deleted: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'active_profiles', public._cfg_build_active_profiles(v_tenant_id),
      'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id)
    );

  elsif v_action = 'accept_recommendation' then
    if v_recommendation_key is null then raise exception 'recommendation_key required'; end if;

    update public.aipify_financial_guardrail_recommendations set
      status = 'accepted',
      updated_at = now()
    where tenant_id = v_tenant_id
      and recommendation_key = v_recommendation_key
      and status = 'pending';

    if not found then raise exception 'Recommendation not found or not pending'; end if;

    perform public._cfg_log_event(
      v_tenant_id,
      'recommendation_accepted',
      format('Recommendation accepted: %s', v_recommendation_key),
      jsonb_build_object('recommendation_key', v_recommendation_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'recommendations', public._cfg_build_recommendations(v_tenant_id)
    );

  elsif v_action = 'dismiss_recommendation' then
    if v_recommendation_key is null then raise exception 'recommendation_key required'; end if;

    update public.aipify_financial_guardrail_recommendations set
      status = 'dismissed',
      updated_at = now()
    where tenant_id = v_tenant_id
      and recommendation_key = v_recommendation_key
      and status = 'pending';

    if not found then raise exception 'Recommendation not found or not pending'; end if;

    perform public._cfg_log_event(
      v_tenant_id,
      'recommendation_dismissed',
      format('Recommendation dismissed: %s', v_recommendation_key),
      jsonb_build_object('recommendation_key', v_recommendation_key)
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'recommendations', public._cfg_build_recommendations(v_tenant_id)
    );

  elsif v_action = 'record_expenditure' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;
    if coalesce((p_payload->>'amount')::numeric, 0) <= 0 then raise exception 'amount required'; end if;

    insert into public.aipify_financial_guardrail_expenditures (
      tenant_id, expenditure_key, profile_key, spending_category,
      amount, currency, description, provider_label, status, approval_threshold, metadata
    ) values (
      v_tenant_id,
      coalesce(v_expenditure_key, 'exp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
      v_profile_key,
      coalesce(nullif(p_payload->>'spending_category', ''), 'business'),
      (p_payload->>'amount')::numeric,
      coalesce(nullif(p_payload->>'currency', ''), 'NOK'),
      left(p_payload->>'description', 500),
      left(p_payload->>'provider_label', 200),
      coalesce(nullif(p_payload->>'status', ''), 'requested'),
      nullif(p_payload->>'approval_threshold', ''),
      coalesce(p_payload->'metadata', '{"metadata_only":true}'::jsonb)
    )
    on conflict (tenant_id, expenditure_key) do update set
      status = excluded.status,
      amount = excluded.amount,
      description = excluded.description,
      updated_at = now();

    perform public._cfg_log_event(
      v_tenant_id,
      case coalesce(nullif(p_payload->>'status', ''), 'requested')
        when 'approved' then 'expenditure_approved'
        when 'denied' then 'expenditure_denied'
        else 'expenditure_recorded'
      end,
      format('Expenditure recorded for profile: %s', v_profile_key),
      jsonb_build_object(
        'profile_key', v_profile_key,
        'amount', p_payload->>'amount',
        'status', coalesce(p_payload->>'status', 'requested')
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'expenditures', public._cfg_build_expenditures(v_tenant_id),
      'spending_trends', public._cfg_build_spending_trends(v_tenant_id),
      'budget_utilization', public._cfg_build_budget_utilization(v_tenant_id),
      'high_value_transactions', public._cfg_build_high_value_transactions(v_tenant_id)
    );

  elsif v_action = 'add_exception' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;
    if nullif(p_payload->>'message', '') is null then raise exception 'message required'; end if;

    insert into public.aipify_financial_guardrail_alerts (
      tenant_id, alert_key, profile_key, alert_type, severity, message, status, context
    ) values (
      v_tenant_id,
      coalesce(v_alert_key, 'exception_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
      v_profile_key,
      'policy_exception',
      coalesce(nullif(p_payload->>'severity', ''), 'informational'),
      left(p_payload->>'message', 500),
      'active',
      coalesce(p_payload->'context', '{}'::jsonb)
    )
    on conflict (tenant_id, alert_key) do nothing;

    perform public._cfg_log_event(
      v_tenant_id,
      'exception_added',
      format('Policy exception added for profile: %s', v_profile_key),
      jsonb_build_object('profile_key', v_profile_key, 'message', left(p_payload->>'message', 200))
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'alerts', public._cfg_build_alerts(v_tenant_id),
      'policy_exceptions', public._cfg_build_policy_exceptions(v_tenant_id)
    );

  elsif v_action = 'revoke_permission' then
    if v_profile_key is null then raise exception 'profile_key required'; end if;
    if nullif(p_payload->>'provider_label', '') is null
      and not (p_payload ? 'allowed_providers')
    then raise exception 'provider_label or allowed_providers required'; end if;

    update public.aipify_financial_guardrail_profiles set
      allowed_providers = case
        when p_payload ? 'allowed_providers' then p_payload->'allowed_providers'
        else (
          select coalesce(jsonb_agg(elem), '[]'::jsonb)
          from jsonb_array_elements_text(allowed_providers) elem
          where elem <> p_payload->>'provider_label'
        )
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
      and profile_key = v_profile_key
      and status <> 'deleted'
    returning * into v_row;

    if not found then raise exception 'Financial guardrail profile not found'; end if;

    perform public._cfg_log_event(
      v_tenant_id,
      'permission_revoked',
      format('Provider permission revoked for profile: %s', v_profile_key),
      jsonb_build_object(
        'profile_key', v_profile_key,
        'provider_label', p_payload->>'provider_label'
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'profile', public._cfg_profile_to_json(v_row),
      'active_profiles', public._cfg_build_active_profiles(v_tenant_id)
    );

  elsif v_action = 'update_settings' then
    perform public._irp_require_permission('financial_guardrail.manage', v_tenant_id);

    update public.aipify_financial_guardrail_settings set
      guardrails_enabled = coalesce((p_payload->>'guardrails_enabled')::boolean, guardrails_enabled),
      default_approval_threshold = coalesce(
        nullif(p_payload->>'default_approval_threshold', ''),
        default_approval_threshold
      ),
      metadata = case
        when p_payload ? 'metadata'
          then metadata || coalesce(p_payload->'metadata', '{}'::jsonb)
        else metadata
      end,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_settings;

    perform public._cfg_log_event(
      v_tenant_id,
      'settings_updated',
      'Financial guardrail settings updated',
      jsonb_build_object(
        'guardrails_enabled', v_settings.guardrails_enabled,
        'default_approval_threshold', v_settings.default_approval_threshold
      )
    );

    return jsonb_build_object(
      'recorded', true,
      'action', v_action,
      'settings', public._cfg_settings_to_json(v_settings),
      'effectiveness_indicators', public._cfg_build_effectiveness_indicators(v_tenant_id)
    );

  else
    raise exception 'Unsupported action: %', v_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-companion-financial-guardrails-engine',
  'Companion Financial Guardrails Engine',
  'Defines spending boundaries, budget alerts, and expenditure metadata for personal, business, and enterprise categories — distinct from Trust & Action and Approval Profiles. Customer App at /app/governance/financial-guardrails.',
  'authenticated',
  296
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-companion-financial-guardrails-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_financial_guardrails_center(uuid) to authenticated;
grant execute on function public.create_financial_guardrail_profile(jsonb) to authenticated;
grant execute on function public.update_financial_guardrail_profile(jsonb) to authenticated;
grant execute on function public.record_financial_guardrail_event(jsonb) to authenticated;
