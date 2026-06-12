-- Phase 140 — Human-Companion Symbiosis & Augmented Organization Engine
-- Autonomous Organization Era (131–140) capstone — Augmented Organization Center.
-- Distinct from Ecosystem Orchestration Phase 120 (/app/ecosystem-orchestration — different era).
-- Helpers: _auorg_* (engine), _auorgbp140_* (blueprint — never collide with _eoce_*, _hpaw_*, _ccwf_*)

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
    'collective_decision_council',
    'human_potential_augmented_work',
    'augmented_organization'
  )
);

-- ---------------------------------------------------------------------------
-- 1. augmented_organization_settings
-- ---------------------------------------------------------------------------
create table if not exists public.augmented_organization_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  symbiosis_maturity_level int not null default 1 check (symbiosis_maturity_level between 1 and 5),
  human_agency_protection_enabled boolean not null default true,
  trust_transparency_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'organization' check (
    governance_visibility in ('leadership', 'organization', 'executive_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.augmented_organization_settings enable row level security;
revoke all on public.augmented_organization_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. augmented_organization_symbiosis_assessments
-- ---------------------------------------------------------------------------
create table if not exists public.augmented_organization_symbiosis_assessments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  assessment_key text not null,
  assessment_type text not null check (
    assessment_type in (
      'maturity_review', 'symbiosis_health', 'trust_alignment', 'agency_checkpoint',
      'companion_coordination', 'governance_participation', 'learning_integration',
      'executive_oversight'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  maturity_level int check (maturity_level between 1 and 5),
  health_signal text not null default 'stable' check (
    health_signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, assessment_key)
);

create index if not exists augmented_organization_symbiosis_assessments_tenant_idx
  on public.augmented_organization_symbiosis_assessments (tenant_id, assessment_type, captured_at desc);

alter table public.augmented_organization_symbiosis_assessments enable row level security;
revoke all on public.augmented_organization_symbiosis_assessments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. augmented_organization_trust_signals
-- ---------------------------------------------------------------------------
create table if not exists public.augmented_organization_trust_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'consent_visibility', 'audit_transparency', 'governance_review', 'companion_boundary',
      'explanation_clarity', 'appeal_process', 'decision_transparency', 'trust_reputation_link'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  visibility_level text not null default 'organization' check (
    visibility_level in ('leadership', 'organization', 'governance_council')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists augmented_organization_trust_signals_tenant_idx
  on public.augmented_organization_trust_signals (tenant_id, signal_type, captured_at desc);

alter table public.augmented_organization_trust_signals enable row level security;
revoke all on public.augmented_organization_trust_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. augmented_organization_agency_records
-- ---------------------------------------------------------------------------
create table if not exists public.augmented_organization_agency_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  record_key text not null,
  checkpoint_type text not null check (
    checkpoint_type in (
      'freedom_of_choice', 'executive_accountability', 'human_oversight_gate',
      'appeal_process', 'decision_transparency', 'governance_participation',
      'companion_boundary', 'dependence_prevention'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('draft', 'active', 'reviewed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, record_key)
);

create index if not exists augmented_organization_agency_records_tenant_idx
  on public.augmented_organization_agency_records (tenant_id, checkpoint_type, status);

alter table public.augmented_organization_agency_records enable row level security;
revoke all on public.augmented_organization_agency_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. augmented_organization_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.augmented_organization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.augmented_organization_audit_logs enable row level security;
revoke all on public.augmented_organization_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'augmented_organization_engine', v.description
from (values
  ('augmented_organization.view', 'View Augmented Organization Engine', 'View Augmented Organization Center and symbiosis maturity scaffolding'),
  ('augmented_organization.manage', 'Manage Augmented Organization Engine', 'Update symbiosis settings and governance metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'augmented_organization.view'), ('owner', 'augmented_organization.manage'),
  ('administrator', 'augmented_organization.view'), ('administrator', 'augmented_organization.manage'),
  ('manager', 'augmented_organization.view'), ('manager', 'augmented_organization.manage'),
  ('employee', 'augmented_organization.view'),
  ('support_agent', 'augmented_organization.view'),
  ('moderator', 'augmented_organization.view'),
  ('viewer', 'augmented_organization.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_auorg_)
-- ---------------------------------------------------------------------------
create or replace function public._auorg_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._auorg_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._auorg_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._auorg_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.augmented_organization_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._auorg_ensure_settings(p_tenant_id uuid)
returns public.augmented_organization_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.augmented_organization_settings;
begin
  insert into public.augmented_organization_settings (tenant_id, symbiosis_maturity_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.augmented_organization_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._auorg_seed_symbiosis_assessments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.augmented_organization_symbiosis_assessments where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.augmented_organization_symbiosis_assessments (
    tenant_id, assessment_key, assessment_type, summary, maturity_level, health_signal
  ) values
    (p_tenant_id, 'maturity-baseline', 'maturity_review', 'Symbiosis maturity baseline — Level 1 Awareness. Maturity not speed — cross-link era phases 131–139.', 1, 'emerging'),
    (p_tenant_id, 'symbiosis-health', 'symbiosis_health', 'Human-companion coordination health aggregate — metadata only, no employee surveillance.', 1, 'stable'),
    (p_tenant_id, 'trust-alignment', 'trust_alignment', 'Trust and consent visibility aligned — cross-link Trust Architecture and Trust & Reputation Phase 116.', 1, 'moderate'),
    (p_tenant_id, 'agency-checkpoint', 'agency_checkpoint', 'Human agency protection checkpoints active — freedom of choice and appeal processes documented.', 1, 'strong'),
    (p_tenant_id, 'companion-coord', 'companion_coordination', 'Companion workforce coordination signals — cross-link Phase 132, do NOT duplicate RPCs.', 1, 'stable'),
    (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance participation scaffold — cross-link Human Oversight A.40 and Collective Decision Phase 137.', 1, 'emerging'),
    (p_tenant_id, 'learning-integration', 'learning_integration', 'Learning integration with Aipify University Phase 115 — confidence not dependence.', 1, 'stable'),
    (p_tenant_id, 'executive-oversight', 'executive_oversight', 'Executive oversight visibility — humans accountable; companions supportive only.', 1, 'strong');
end; $$;

create or replace function public._auorg_seed_trust_signals(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.augmented_organization_trust_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.augmented_organization_trust_signals (
    tenant_id, signal_key, signal_type, summary, visibility_level, confidence
  ) values
    (p_tenant_id, 'consent-visibility', 'consent_visibility', 'Consent visibility metadata available — aggregate only, no individual tracking.', 'organization', 'high'),
    (p_tenant_id, 'audit-transparency', 'audit_transparency', 'Companion audit histories accessible to authorized roles — cross-link Trust Actions.', 'governance_council', 'high'),
    (p_tenant_id, 'governance-review', 'governance_review', 'Governance review cadence scaffold — cross-link Human Oversight A.40.', 'leadership', 'moderate'),
    (p_tenant_id, 'companion-boundary', 'companion_boundary', 'Companion boundary transparency — companions advise, never override agency.', 'organization', 'high'),
    (p_tenant_id, 'explanation-clarity', 'explanation_clarity', 'Clear explanations for companion recommendations — decision_explanations augmented_organization type.', 'organization', 'moderate'),
    (p_tenant_id, 'appeal-process', 'appeal_process', 'Appeal processes documented — human agency protection framework active.', 'organization', 'high'),
    (p_tenant_id, 'decision-transparency', 'decision_transparency', 'Decision transparency signals — cross-link Collective Decision Phase 137.', 'leadership', 'moderate'),
    (p_tenant_id, 'trust-reputation', 'trust_reputation_link', 'Trust & Reputation Phase 116 cross-link — relationship trust metadata, not surveillance.', 'organization', 'strong');
end; $$;

create or replace function public._auorg_seed_agency_records(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.augmented_organization_agency_records where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.augmented_organization_agency_records (
    tenant_id, record_key, checkpoint_type, summary, status
  ) values
    (p_tenant_id, 'freedom-choice', 'freedom_of_choice', 'Humans retain freedom of choice — companions prepare, humans decide.', 'active'),
    (p_tenant_id, 'exec-accountability', 'executive_accountability', 'Executive accountability preserved — companions never replace leadership.', 'active'),
    (p_tenant_id, 'oversight-gate', 'human_oversight_gate', 'Human oversight gates active — cross-link Human Oversight A.40 Phase 131 interim.', 'active'),
    (p_tenant_id, 'appeal-process', 'appeal_process', 'Appeal processes available for companion-influenced recommendations.', 'active'),
    (p_tenant_id, 'decision-transparency', 'decision_transparency', 'Decision transparency checkpoints — explainability required.', 'active'),
    (p_tenant_id, 'governance-participation', 'governance_participation', 'Governance participation encouraged — not automated compliance.', 'active'),
    (p_tenant_id, 'companion-boundary', 'companion_boundary', 'Companion boundaries enforced — no independent authority expansion.', 'active'),
    (p_tenant_id, 'dependence-prevention', 'dependence_prevention', 'Confidence not dependence — unhealthy reliance patterns flagged aggregate only.', 'active');
end; $$;

create or replace function public._auorg_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.augmented_organization_settings;
  v_assessment_count int;
  v_trust_count int;
  v_agency_count int;
  v_symbiosis_score numeric;
begin
  select * into v_settings from public.augmented_organization_settings where tenant_id = p_tenant_id;
  select count(*) into v_assessment_count from public.augmented_organization_symbiosis_assessments where tenant_id = p_tenant_id;
  select count(*) into v_trust_count from public.augmented_organization_trust_signals where tenant_id = p_tenant_id;
  select count(*) into v_agency_count from public.augmented_organization_agency_records where tenant_id = p_tenant_id;
  v_symbiosis_score := round(
    coalesce(v_settings.symbiosis_maturity_level, 1) * 12.5
    + least(v_assessment_count, 8) * 3.5
    + least(v_trust_count, 8) * 2.0,
    1
  );

  return jsonb_build_object(
    'symbiosis_score', v_symbiosis_score,
    'symbiosis_maturity_level', coalesce(v_settings.symbiosis_maturity_level, 1),
    'symbiosis_assessments_count', v_assessment_count,
    'trust_signals_count', v_trust_count,
    'agency_records_count', v_agency_count,
    'era_phases_count', jsonb_array_length(public._auorgbp140_era_capstone_summary()),
    'cross_links_count', jsonb_array_length(public._auorgbp140_integration_links()),
    'maturity_levels_count', 5
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_auorgbp140_)
-- ---------------------------------------------------------------------------
create or replace function public._auorgbp140_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 140 — Human-Companion Symbiosis & Augmented Organization Engine at /app/augmented-organization-engine. Era 131–140 capstone — symbiosis not replacement; humans irreplaceable, companions supportive. Distinct from Ecosystem Orchestration Phase 120 at /app/ecosystem-orchestration (Ecosystem & Marketplace Era — different era, cross-link only). Distinct from Human Potential Phase 139 at /app/human-potential-augmented-work-engine (individual growth — cross-link). Distinct from Relationship Intelligence A.78 at /app/relationship-intelligence-engine (RSI — cross-link, do NOT duplicate). Helpers _auorgbp140_* — never collide with _eoce_*, _hpaw_*, _ccwf_*. Aggregate trust/maturity signals only — no employee surveillance.';
$$;

create or replace function public._auorgbp140_mission()
returns text language sql immutable as $$
  select 'Unify human-companion symbiosis across the Autonomous Organization Era — Augmented Organization Center where people and Companions work in partnership with strengthened human agency, transparent trust, and wisdom before speed.';
$$;

create or replace function public._auorgbp140_philosophy()
returns text language sql immutable as $$
  select 'People First. Companionship before replacement. Wisdom before speed. Symbiosis = partnership, not replacement. Confidence not dependence. Human agency strengthened, not weakened. No employee surveillance — aggregate trust and maturity signals only.';
$$;

create or replace function public._auorgbp140_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Augmented Organization Center aggregates era 131–140 symbiosis visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; humans decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._auorgbp140_vision()
returns text language sql immutable as $$
  select 'Organizations where humans and Companions thrive together — with dignity, transparency, and meaningful contribution at every maturity level.';
$$;

create or replace function public._auorgbp140_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'symbiosis_partnership', 'label', 'Symbiosis partnership', 'emoji', '🤝', 'description', 'Human-companion partnership — not replacement'),
    jsonb_build_object('key', 'human_agency', 'label', 'Human agency protection', 'emoji', '🛡️', 'description', 'Freedom of choice and appeal processes'),
    jsonb_build_object('key', 'trust_transparency', 'label', 'Trust & transparency', 'emoji', '🔍', 'description', 'Audit visibility and clear explanations'),
    jsonb_build_object('key', 'maturity_growth', 'label', 'Maturity growth', 'emoji', '🌱', 'description', 'Level 1 Awareness → Level 5 Symbiosis — maturity not speed'),
    jsonb_build_object('key', 'augmented_experience', 'label', 'Augmented experience', 'emoji', '✨', 'description', 'Contextual assistance — confidence not dependence'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship intelligence', 'emoji', '🌹', 'description', 'Cross-link RSI A.78 — do not duplicate'),
    jsonb_build_object('key', 'era_integration', 'label', 'Era integration', 'emoji', '🔗', 'description', 'Cross-link all Autonomous Organization Era phases 131–139'),
    jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight', 'emoji', '🦉', 'description', 'Humans accountable; companions supportive')
  );
$$;

create or replace function public._auorgbp140_augmented_organization_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Augmented Organization Center — eight capabilities. Symbiosis visibility, not surveillance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'collaboration_models', 'label', 'Collaboration models'),
      jsonb_build_object('key', 'human_experience_insights', 'label', 'Human experience insights — aggregate only'),
      jsonb_build_object('key', 'augmented_workforce_frameworks', 'label', 'Augmented workforce frameworks', 'cross_link', '/app/companion-workforce-engine'),
      jsonb_build_object('key', 'companion_governance', 'label', 'Companion governance', 'cross_link', '/app/human-oversight-engine'),
      jsonb_build_object('key', 'learning_integration', 'label', 'Learning integration', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight', 'cross_link', '/app/executive-intelligence'),
      jsonb_build_object('key', 'gp_coordination', 'label', 'Growth Partner coordination', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'community_support', 'label', 'Community support', 'cross_link', '/app/community')
    )
  );
$$;

create or replace function public._auorgbp140_human_companion_symbiosis_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human-companion symbiosis model — humans irreplaceable; companions supportive.',
    'human_contributions', jsonb_build_array(
      jsonb_build_object('key', 'judgment', 'label', 'Judgment'),
      jsonb_build_object('key', 'empathy', 'label', 'Empathy'),
      jsonb_build_object('key', 'creativity', 'label', 'Creativity'),
      jsonb_build_object('key', 'purpose', 'label', 'Purpose'),
      jsonb_build_object('key', 'leadership', 'label', 'Leadership'),
      jsonb_build_object('key', 'ethics', 'label', 'Ethics'),
      jsonb_build_object('key', 'relationships', 'label', 'Relationships')
    ),
    'companion_contributions', jsonb_build_array(
      jsonb_build_object('key', 'knowledge', 'label', 'Knowledge'),
      jsonb_build_object('key', 'patterns', 'label', 'Patterns'),
      jsonb_build_object('key', 'operational_support', 'label', 'Operational support'),
      jsonb_build_object('key', 'coordination', 'label', 'Coordination'),
      jsonb_build_object('key', 'preparation', 'label', 'Preparation'),
      jsonb_build_object('key', 'admin_relief', 'label', 'Administrative relief'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection')
    )
  );
$$;

create or replace function public._auorgbp140_symbiosis_design_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Symbiosis design principles — human agency at center.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'human_agency', 'label', 'Human agency'),
      jsonb_build_object('key', 'trust', 'label', 'Trust'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency'),
      jsonb_build_object('key', 'choice', 'label', 'Choice'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety'),
      jsonb_build_object('key', 'growth', 'label', 'Growth'),
      jsonb_build_object('key', 'meaningful_contribution', 'label', 'Meaningful contribution')
    )
  );
$$;

create or replace function public._auorgbp140_augmented_experience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Augmented experience engine — confidence not dependence.',
    'experiences', jsonb_build_array(
      jsonb_build_object('key', 'contextual_assistance', 'label', 'Contextual assistance'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery'),
      jsonb_build_object('key', 'workflow_guidance', 'label', 'Workflow guidance', 'cross_link', '/app/workflow-orchestration-engine'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
      jsonb_build_object('key', 'learning', 'label', 'Learning'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition'),
      jsonb_build_object('key', 'companion_introductions', 'label', 'Companion introductions', 'cross_link', '/app/companion-marketplace')
    )
  );
$$;

create or replace function public._auorgbp140_human_agency_protection_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human agency protection framework — freedom strengthened, not weakened.',
    'protections', jsonb_build_array(
      jsonb_build_object('key', 'freedom_of_choice', 'label', 'Freedom of choice'),
      jsonb_build_object('key', 'executive_accountability', 'label', 'Executive accountability'),
      jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight', 'cross_link', '/app/human-oversight-engine'),
      jsonb_build_object('key', 'appeal_processes', 'label', 'Appeal processes'),
      jsonb_build_object('key', 'decision_transparency', 'label', 'Decision transparency'),
      jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation')
    )
  );
$$;

create or replace function public._auorgbp140_trust_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust engine — clear explanations, audit visibility, consent.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'clear_explanations', 'label', 'Clear explanations'),
      jsonb_build_object('key', 'audit_visibility', 'label', 'Audit visibility'),
      jsonb_build_object('key', 'consent', 'label', 'Consent'),
      jsonb_build_object('key', 'governance_reviews', 'label', 'Governance reviews'),
      jsonb_build_object('key', 'companion_histories', 'label', 'Companion histories'),
      jsonb_build_object('key', 'boundary_transparency', 'label', 'Boundary transparency')
    ),
    'trust_architecture_note', 'Cross-link Trust Architecture — metadata only aggregates.'
  );
$$;

create or replace function public._auorgbp140_relationship_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship intelligence — cross-link RSI A.78, do NOT duplicate RPCs.',
    'relationship_domains', jsonb_build_array(
      jsonb_build_object('key', 'employees', 'label', 'Employees'),
      jsonb_build_object('key', 'executives', 'label', 'Executives'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners'),
      jsonb_build_object('key', 'customers', 'label', 'Customers'),
      jsonb_build_object('key', 'communities', 'label', 'Communities'),
      jsonb_build_object('key', 'companions', 'label', 'Companions')
    ),
    'rsi_route', '/app/relationship-intelligence-engine',
    'boundary_note', 'RSI A.78 remains authoritative — symbiosis center cross-links only.'
  );
$$;

create or replace function public._auorgbp140_augmented_organization_maturity_model()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Augmented organization maturity model — maturity not speed.',
    'levels', jsonb_build_array(
      jsonb_build_object('level', 1, 'key', 'awareness', 'label', 'Level 1 — Awareness', 'description', 'Understanding human-companion partnership potential'),
      jsonb_build_object('level', 2, 'key', 'adoption', 'label', 'Level 2 — Adoption', 'description', 'Companions integrated with human guidance'),
      jsonb_build_object('level', 3, 'key', 'coordination', 'label', 'Level 3 — Coordination', 'description', 'Coordinated companion workforce with oversight'),
      jsonb_build_object('level', 4, 'key', 'governance', 'label', 'Level 4 — Governance', 'description', 'Mature governance and trust frameworks'),
      jsonb_build_object('level', 5, 'key', 'symbiosis', 'label', 'Level 5 — Symbiosis', 'description', 'Full human-companion symbiosis with strengthened agency')
    )
  );
$$;

create or replace function public._auorgbp140_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Replacing human dignity',
      'Overriding human agency',
      'Creating unhealthy dependence',
      'Independent authority expansion',
      'Suppressing transparency',
      'Employee surveillance framing',
      'Ranking people by symbiosis score'
    ),
    'principle', 'Companions support — humans lead.'
  );
$$;

create or replace function public._auorgbp140_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — compassion and boundaries in symbiosis design.',
    'values', jsonb_build_array(
      'self_awareness', 'compassion', 'curiosity', 'boundaries',
      'celebrate_growth', 'recognize_progress'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._auorgbp140_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'companion_audit_histories', 'label', 'Companion audit histories'),
      jsonb_build_object('key', 'executive_governance', 'label', 'Executive governance'),
      jsonb_build_object('key', 'enterprise_policy', 'label', 'Enterprise policy alignment')
    )
  );
$$;

create or replace function public._auorgbp140_era_capstone_summary()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 131, 'key', 'autonomy_governance', 'label', 'Autonomy Governance Phase 131', 'route', '/app/human-oversight-engine', 'description', 'Human oversight and autonomy governance — interim A.40 until dedicated Phase 131'),
    jsonb_build_object('phase', 132, 'key', 'companion_workforce', 'label', 'Companion Workforce Phase 132', 'route', '/app/companion-workforce-engine', 'description', 'Coordinated companion workforce — teams not super-assistant'),
    jsonb_build_object('phase', 133, 'key', 'workflow_orchestration', 'label', 'Workflow Orchestration Phase 133', 'route', '/app/workflow-orchestration-engine', 'description', 'Autonomous workflow orchestration with human checkpoints'),
    jsonb_build_object('phase', 134, 'key', 'adaptive_organization', 'label', 'Adaptive Organization Phase 134', 'route', '/app/continuous-improvement-engine', 'description', 'Continuous optimization and adaptive organization'),
    jsonb_build_object('phase', 135, 'key', 'proactive_organization', 'label', 'Proactive Organization Phase 135', 'route', '/app/proactive-organization-engine', 'description', 'Anticipatory support — care not surveillance'),
    jsonb_build_object('phase', 136, 'key', 'self_healing_operations', 'label', 'Self-Healing Operations Phase 136', 'route', '/app/organizational-resilience-engine', 'description', 'Self-healing operations and organizational recovery'),
    jsonb_build_object('phase', 137, 'key', 'collective_decision_council', 'label', 'Collective Decision Council Phase 137', 'route', '/app/collective-decision-council-engine', 'description', 'Human-companion council perspectives — companions advise, never vote'),
    jsonb_build_object('phase', 138, 'key', 'purpose_alignment', 'label', 'Purpose Alignment Phase 138', 'route', '/app/purpose-values-engine', 'description', 'Purpose and values alignment across organization'),
    jsonb_build_object('phase', 139, 'key', 'human_potential', 'label', 'Human Potential Phase 139', 'route', '/app/human-potential-augmented-work-engine', 'description', 'Human potential and augmented work — companionship before replacement'),
    jsonb_build_object('phase', 140, 'key', 'augmented_organization', 'label', 'Symbiosis Phase 140', 'route', '/app/augmented-organization-engine', 'description', 'Era capstone — human-companion symbiosis and augmented organization center')
  );
$$;

create or replace function public._auorgbp140_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'relationship', 'Autonomy governance interim Phase 131'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship Intelligence A.78', 'route', '/app/relationship-intelligence-engine', 'relationship', 'RSI — cross-link only, do NOT duplicate'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust & Reputation Phase 116', 'route', '/app/trust-reputation-engine', 'relationship', 'Trust framework cross-link'),
    jsonb_build_object('key', 'trust_architecture', 'label', 'Trust Architecture', 'route', '/app/security', 'relationship', 'Security dashboard and trust transparency'),
    jsonb_build_object('key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'relationship', 'Different era capstone — ecosystem not symbiosis'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Compassion and boundaries in symbiosis design')
  );
$$;

create or replace function public._auorgbp140_integration_links()
returns jsonb language sql immutable as $$
  select public._auorgbp140_era_capstone_summary() || public._auorgbp140_extended_cross_links();
$$;

create or replace function public._auorgbp140_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Augmented Organization Center internally — metadata-only symbiosis maturity, trust signals, and agency checkpoints. Growth Partner terminology throughout. No employee surveillance.';
$$;

create or replace function public._auorgbp140_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Symbiosis is partnership — not replacement.',
    'Confidence not dependence.',
    'Humans irreplaceable; Companions supportive.',
    'Maturity not speed.',
    'Wisdom before speed.'
  );
$$;

create or replace function public._auorgbp140_privacy_note()
returns text language sql immutable as $$
  select 'Augmented Organization metadata only — aggregate symbiosis maturity, trust signals, and agency checkpoints. No employee surveillance. No ranking people. Humans decide; Companions prepare.';
$$;

create or replace function public._auorgbp140_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._auorg_ensure_settings(p_tenant_id);
  perform public._auorg_seed_symbiosis_assessments(p_tenant_id);
  perform public._auorg_seed_trust_signals(p_tenant_id);
  perform public._auorg_seed_agency_records(p_tenant_id);
  v_metrics := public._auorg_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'symbiosis_score', coalesce((v_metrics->>'symbiosis_score')::numeric, 0),
    'symbiosis_maturity_level', coalesce((v_metrics->>'symbiosis_maturity_level')::int, 1),
    'symbiosis_assessments_count', coalesce((v_metrics->>'symbiosis_assessments_count')::int, 0),
    'trust_signals_count', coalesce((v_metrics->>'trust_signals_count')::int, 0),
    'agency_records_count', coalesce((v_metrics->>'agency_records_count')::int, 0),
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._auorgbp140_integration_links()),
    'maturity_levels_count', 5,
    'privacy_note', public._auorgbp140_privacy_note(),
    'not_employee_surveillance', true
  );
end; $$;

create or replace function public._auorgbp140_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._auorg_ensure_settings(p_tenant_id);
  perform public._auorg_seed_symbiosis_assessments(p_tenant_id);
  perform public._auorg_seed_trust_signals(p_tenant_id);
  perform public._auorg_seed_agency_records(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'augmented_organization_center', 'label', 'Augmented Organization Center — eight capabilities', 'met', jsonb_array_length(public._auorgbp140_augmented_organization_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'symbiosis_model', 'label', 'Human-companion symbiosis model documented', 'met', jsonb_array_length(public._auorgbp140_human_companion_symbiosis_model()->'human_contributions') = 7 and jsonb_array_length(public._auorgbp140_human_companion_symbiosis_model()->'companion_contributions') = 7, 'note', null),
    jsonb_build_object('key', 'maturity_model', 'label', 'Maturity model — five levels', 'met', jsonb_array_length(public._auorgbp140_augmented_organization_maturity_model()->'levels') = 5, 'note', null),
    jsonb_build_object('key', 'agency_framework', 'label', 'Human agency protection — six protections', 'met', jsonb_array_length(public._auorgbp140_human_agency_protection_framework()->'protections') = 6, 'note', null),
    jsonb_build_object('key', 'trust_engine', 'label', 'Trust engine — six capabilities', 'met', jsonb_array_length(public._auorgbp140_trust_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'assessments_seeded', 'label', 'Symbiosis assessments seeded', 'met', (select count(*) >= 8 from public.augmented_organization_symbiosis_assessments a where a.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'trust_signals_seeded', 'label', 'Trust signals seeded', 'met', (select count(*) >= 8 from public.augmented_organization_trust_signals t where t.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'agency_records_seeded', 'label', 'Agency records seeded', 'met', (select count(*) >= 8 from public.augmented_organization_agency_records r where r.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'era_capstone', 'label', 'Era 131–140 capstone — ten phases documented', 'met', jsonb_array_length(public._auorgbp140_era_capstone_summary()) = 10, 'note', null),
    jsonb_build_object('key', 'default_maturity', 'label', 'Default symbiosis maturity level 1 for new tenants', 'met', exists (select 1 from public.augmented_organization_settings s where s.tenant_id = p_tenant_id and s.symbiosis_maturity_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.augmented_organization_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no surveillance framing', 'met', jsonb_array_length(public._auorgbp140_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._auorgbp140_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 140 baseline tables and RPCs', 'met', to_regclass('public.augmented_organization_settings') is not null, 'note', '_auorg_* helpers intact')
  );
end; $$;

create or replace function public._auorgbp140_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 140 — Human-Companion Symbiosis & Augmented Organization Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE140_HUMAN_COMPANION_SYMBIOSIS_AUGMENTED_ORGANIZATION.md',
    'engine_phase', 'Repo Phase 140 Augmented Organization Engine',
    'route', '/app/augmented-organization-engine',
    'mapping_note', 'Era 131–140 capstone — symbiosis not replacement. Era phase engines remain authoritative.',
    'distinction_note', public._auorgbp140_distinction_note(),
    'mission', public._auorgbp140_mission(),
    'philosophy', public._auorgbp140_philosophy(),
    'abos_principle', public._auorgbp140_abos_principle(),
    'vision', public._auorgbp140_vision(),
    'objectives', public._auorgbp140_objectives(),
    'augmented_organization_center', public._auorgbp140_augmented_organization_center(),
    'human_companion_symbiosis_model', public._auorgbp140_human_companion_symbiosis_model(),
    'symbiosis_design_principles', public._auorgbp140_symbiosis_design_principles(),
    'augmented_experience_engine', public._auorgbp140_augmented_experience_engine(),
    'human_agency_protection_framework', public._auorgbp140_human_agency_protection_framework(),
    'trust_engine', public._auorgbp140_trust_engine(),
    'relationship_intelligence_engine', public._auorgbp140_relationship_intelligence_engine(),
    'augmented_organization_maturity_model', public._auorgbp140_augmented_organization_maturity_model(),
    'companion_limitations', public._auorgbp140_companion_limitations(),
    'self_love_connection', public._auorgbp140_self_love_connection(),
    'security_requirements', public._auorgbp140_security_requirements(),
    'era_capstone_summary', public._auorgbp140_era_capstone_summary(),
    'extended_cross_links', public._auorgbp140_extended_cross_links(),
    'integration_links', public._auorgbp140_integration_links(),
    'dogfooding', public._auorgbp140_dogfooding(),
    'success_criteria', public._auorgbp140_success_criteria(p_tenant_id),
    'engagement_summary', public._auorgbp140_engagement_summary(p_tenant_id),
    'vision_phrases', public._auorgbp140_vision_phrases(),
    'privacy_note', public._auorgbp140_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_augmented_organization_assessment(
  p_assessment_type text,
  p_summary text,
  p_maturity_level int default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._auorg_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Assessment summary max 500 characters'; end if;
  if p_maturity_level is not null and (p_maturity_level < 1 or p_maturity_level > 5) then
    raise exception 'Maturity level must be between 1 and 5';
  end if;
  v_key := p_assessment_type || '-' || left(md5(p_summary || clock_timestamp()::text), 8);
  insert into public.augmented_organization_symbiosis_assessments (
    tenant_id, assessment_key, assessment_type, summary, maturity_level
  ) values (v_tenant_id, v_key, p_assessment_type, left(p_summary, 500), p_maturity_level)
  returning id into v_id;
  perform public._auorg_log_audit(v_tenant_id, 'assessment_recorded', left(p_summary, 120),
    jsonb_build_object('assessment_id', v_id, 'assessment_type', p_assessment_type, 'maturity_level', p_maturity_level));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_augmented_organization_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.augmented_organization_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._auorg_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._auorg_ensure_settings(v_tenant_id);
  perform public._auorg_seed_symbiosis_assessments(v_tenant_id);
  perform public._auorg_seed_trust_signals(v_tenant_id);
  perform public._auorg_seed_agency_records(v_tenant_id);
  v_metrics := public._auorg_refresh_metrics(v_tenant_id);
  v_engagement := public._auorgbp140_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'symbiosis_score', v_metrics->'symbiosis_score',
    'symbiosis_maturity_level', v_settings.symbiosis_maturity_level,
    'symbiosis_assessments_count', v_metrics->'symbiosis_assessments_count',
    'philosophy', public._auorgbp140_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'human_agency_protection_enabled', v_settings.human_agency_protection_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 140 — Human-Companion Symbiosis & Augmented Organization Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE140_HUMAN_COMPANION_SYMBIOSIS_AUGMENTED_ORGANIZATION.md',
      'engine_phase', 'Repo Phase 140 Augmented Organization Engine',
      'route', '/app/augmented-organization-engine',
      'mapping_note', 'Era 131–140 capstone — cross-link all era phases.'
    ),
    'augmented_organization_mission', public._auorgbp140_mission(),
    'augmented_organization_abos_principle', public._auorgbp140_abos_principle(),
    'augmented_organization_engagement_summary', v_engagement,
    'augmented_organization_note', public._auorgbp140_distinction_note(),
    'augmented_organization_vision_note', public._auorgbp140_vision()
  );
end; $$;

create or replace function public.get_augmented_organization_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.augmented_organization_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._auorg_require_tenant());
  v_settings := public._auorg_ensure_settings(v_tenant_id);
  perform public._auorg_seed_symbiosis_assessments(v_tenant_id);
  perform public._auorg_seed_trust_signals(v_tenant_id);
  perform public._auorg_seed_agency_records(v_tenant_id);
  v_metrics := public._auorg_refresh_metrics(v_tenant_id);
  perform public._auorg_log_audit(v_tenant_id, 'dashboard_view', 'Augmented Organization dashboard viewed',
    jsonb_build_object('symbiosis_score', v_metrics->>'symbiosis_score', 'maturity_level', v_settings.symbiosis_maturity_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'symbiosis_maturity_level', v_settings.symbiosis_maturity_level,
    'human_agency_protection_enabled', v_settings.human_agency_protection_enabled,
    'trust_transparency_enabled', v_settings.trust_transparency_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._auorgbp140_philosophy(),
    'safety_note', 'Augmented Organization Engine — metadata-only aggregates. No employee surveillance. Era phase engines remain authoritative — cross-link only.',
    'distinction_note', public._auorgbp140_distinction_note(),
    'symbiosis_score', v_metrics->'symbiosis_score',
    'symbiosis_assessments_count', v_metrics->'symbiosis_assessments_count',
    'trust_signals_count', v_metrics->'trust_signals_count',
    'agency_records_count', v_metrics->'agency_records_count',
    'symbiosis_assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'assessment_key', a.assessment_key, 'assessment_type', a.assessment_type,
        'summary', a.summary, 'maturity_level', a.maturity_level, 'health_signal', a.health_signal,
        'captured_at', a.captured_at
      ) order by a.captured_at desc)
      from public.augmented_organization_symbiosis_assessments a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'trust_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'signal_key', t.signal_key, 'signal_type', t.signal_type,
        'summary', t.summary, 'visibility_level', t.visibility_level, 'confidence', t.confidence,
        'captured_at', t.captured_at
      ) order by t.captured_at desc)
      from public.augmented_organization_trust_signals t where t.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'agency_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'record_key', r.record_key, 'checkpoint_type', r.checkpoint_type,
        'summary', r.summary, 'status', r.status, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.augmented_organization_agency_records r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._auorgbp140_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 140 — Human-Companion Symbiosis & Augmented Organization Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE140_HUMAN_COMPANION_SYMBIOSIS_AUGMENTED_ORGANIZATION.md',
      'engine_phase', 'Repo Phase 140 Augmented Organization Engine',
      'route', '/app/augmented-organization-engine',
      'mapping_note', 'Era 131–140 capstone — human-companion symbiosis center.'
    ),
    'augmented_organization_engine_note', 'Augmented Organization Engine (ABOS Phase 140) — era capstone. Cross-link era 131–139 — do NOT duplicate RPCs.',
    'augmented_organization_blueprint', public._auorgbp140_blueprint_block(v_tenant_id),
    'augmented_organization_distinction_note', public._auorgbp140_distinction_note(),
    'augmented_organization_mission', public._auorgbp140_mission(),
    'augmented_organization_philosophy', public._auorgbp140_philosophy(),
    'augmented_organization_abos_principle', public._auorgbp140_abos_principle(),
    'augmented_organization_objectives', public._auorgbp140_objectives(),
    'augmented_organization_center_meta', public._auorgbp140_augmented_organization_center(),
    'human_companion_symbiosis_model_meta', public._auorgbp140_human_companion_symbiosis_model(),
    'symbiosis_design_principles_meta', public._auorgbp140_symbiosis_design_principles(),
    'augmented_experience_engine_meta', public._auorgbp140_augmented_experience_engine(),
    'human_agency_protection_framework_meta', public._auorgbp140_human_agency_protection_framework(),
    'trust_engine_meta', public._auorgbp140_trust_engine(),
    'relationship_intelligence_engine_meta', public._auorgbp140_relationship_intelligence_engine(),
    'augmented_organization_maturity_model_meta', public._auorgbp140_augmented_organization_maturity_model(),
    'companion_limitations_meta', public._auorgbp140_companion_limitations(),
    'self_love_connection_meta', public._auorgbp140_self_love_connection(),
    'security_requirements_meta', public._auorgbp140_security_requirements(),
    'auorgbp140_era_capstone_summary', public._auorgbp140_era_capstone_summary(),
    'auorgbp140_extended_cross_links', public._auorgbp140_extended_cross_links(),
    'auorgbp140_integration_links', public._auorgbp140_integration_links(),
    'augmented_organization_engagement_summary', public._auorgbp140_engagement_summary(v_tenant_id),
    'augmented_organization_success_criteria', public._auorgbp140_success_criteria(v_tenant_id),
    'augmented_organization_vision', public._auorgbp140_vision(),
    'augmented_organization_vision_phrases', public._auorgbp140_vision_phrases(),
    'augmented_organization_privacy_note', public._auorgbp140_privacy_note(),
    'augmented_organization_dogfooding', public._auorgbp140_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'augmented-organization-engine', 'Augmented Organization Engine',
  'Era 131–140 capstone — human-companion symbiosis and augmented organization center. People First.',
  'authenticated', 150
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'augmented-organization-engine' and tenant_id is null
);

grant execute on function public.get_augmented_organization_engine_card(uuid) to authenticated;
grant execute on function public.get_augmented_organization_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_augmented_organization_assessment(text, text, int, uuid) to authenticated;
grant execute on function public._auorgbp140_distinction_note() to authenticated;
grant execute on function public._auorgbp140_mission() to authenticated;
grant execute on function public._auorgbp140_philosophy() to authenticated;
grant execute on function public._auorgbp140_abos_principle() to authenticated;
grant execute on function public._auorgbp140_vision() to authenticated;
grant execute on function public._auorgbp140_objectives() to authenticated;
grant execute on function public._auorgbp140_augmented_organization_center() to authenticated;
grant execute on function public._auorgbp140_human_companion_symbiosis_model() to authenticated;
grant execute on function public._auorgbp140_symbiosis_design_principles() to authenticated;
grant execute on function public._auorgbp140_augmented_experience_engine() to authenticated;
grant execute on function public._auorgbp140_human_agency_protection_framework() to authenticated;
grant execute on function public._auorgbp140_trust_engine() to authenticated;
grant execute on function public._auorgbp140_relationship_intelligence_engine() to authenticated;
grant execute on function public._auorgbp140_augmented_organization_maturity_model() to authenticated;
grant execute on function public._auorgbp140_companion_limitations() to authenticated;
grant execute on function public._auorgbp140_self_love_connection() to authenticated;
grant execute on function public._auorgbp140_security_requirements() to authenticated;
grant execute on function public._auorgbp140_era_capstone_summary() to authenticated;
grant execute on function public._auorgbp140_extended_cross_links() to authenticated;
grant execute on function public._auorgbp140_integration_links() to authenticated;
grant execute on function public._auorgbp140_dogfooding() to authenticated;
grant execute on function public._auorgbp140_vision_phrases() to authenticated;
grant execute on function public._auorgbp140_privacy_note() to authenticated;
grant execute on function public._auorgbp140_engagement_summary(uuid) to authenticated;
grant execute on function public._auorgbp140_success_criteria(uuid) to authenticated;
grant execute on function public._auorgbp140_blueprint_block(uuid) to authenticated;
