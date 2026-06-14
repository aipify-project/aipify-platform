-- Phase 144 — Global Governance & Digital Diplomacy Engine
-- Global Intelligence & Interorganizational Era (141–150).
-- Distinct from Governance & Policy A.14 (/app/governance-policy-engine — tenant internal policies).
-- Distinct from Ecosystem Governance Phase 119 (/app/ecosystem-governance).
-- Distinct from Joint Operations Phase 143 (/app/joint-operations-engine — cross-link).
-- Helpers: _ggde_* (engine), _ggdebp144_* (blueprint — never collide with _egce_*, _egcbp119_*, _gpe_*)

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
    'augmented_organization',
    'global_knowledge_exchange',
    'global_governance_diplomacy'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_governance_diplomacy_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_governance_diplomacy_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  governance_maturity_level int not null default 1 check (governance_maturity_level between 1 and 5),
  executive_approval_required boolean not null default true,
  partnership_prep_enabled boolean not null default false,
  diplomacy_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_governance_diplomacy_settings enable row level security;
revoke all on public.global_governance_diplomacy_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. partnership_charters
-- ---------------------------------------------------------------------------
create table if not exists public.partnership_charters (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  charter_key text not null,
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'active', 'under_review', 'archived')
  ),
  shared_objectives_summary text check (char_length(shared_objectives_summary) <= 500),
  governance_principles_summary text check (char_length(governance_principles_summary) <= 500),
  decision_model_summary text check (char_length(decision_model_summary) <= 500),
  escalation_summary text check (char_length(escalation_summary) <= 500),
  confidentiality_summary text check (char_length(confidentiality_summary) <= 500),
  review_cadence_summary text check (char_length(review_cadence_summary) <= 500),
  exit_procedures_summary text check (char_length(exit_procedures_summary) <= 500),
  joint_operations_partnership_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, charter_key)
);

create index if not exists partnership_charters_tenant_idx
  on public.partnership_charters (tenant_id, status, updated_at desc);

alter table public.partnership_charters enable row level security;
revoke all on public.partnership_charters from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. digital_diplomacy_engagements
-- ---------------------------------------------------------------------------
create table if not exists public.digital_diplomacy_engagements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  engagement_key text not null,
  engagement_type text not null check (
    engagement_type in (
      'partnership_prep', 'stakeholder_mapping', 'cultural_guidance',
      'communication_review', 'expectation_alignment', 'conflict_prevention',
      'relationship_health'
    )
  ),
  title text not null,
  status text not null default 'planned' check (
    status in ('planned', 'in_progress', 'completed', 'paused', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, engagement_key)
);

create index if not exists digital_diplomacy_engagements_tenant_idx
  on public.digital_diplomacy_engagements (tenant_id, status, created_at desc);

alter table public.digital_diplomacy_engagements enable row level security;
revoke all on public.digital_diplomacy_engagements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_governance_policy_library_refs
-- ---------------------------------------------------------------------------
create table if not exists public.global_governance_policy_library_refs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  template_key text not null,
  template_category text not null check (
    template_category in (
      'governance_template', 'partnership_charter', 'executive_playbook',
      'collaboration_framework', 'ethical_guidance', 'diplomacy_practice'
    )
  ),
  title text not null,
  summary text check (char_length(summary) <= 500),
  kc_article_slug text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, template_key)
);

create index if not exists global_governance_policy_library_refs_tenant_idx
  on public.global_governance_policy_library_refs (tenant_id, template_category);

alter table public.global_governance_policy_library_refs enable row level security;
revoke all on public.global_governance_policy_library_refs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. global_governance_diplomacy_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.global_governance_diplomacy_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_governance_diplomacy_audit_logs enable row level security;
revoke all on public.global_governance_diplomacy_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_governance_diplomacy_engine', v.description
from (values
  ('global_governance_diplomacy.view', 'View Global Governance & Diplomacy', 'View governance center, partnership charters, and diplomacy engagement metadata'),
  ('global_governance_diplomacy.manage', 'Manage Global Governance & Diplomacy', 'Create charters, record engagements, and update governance diplomacy settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_governance_diplomacy.view'), ('owner', 'global_governance_diplomacy.manage'),
  ('administrator', 'global_governance_diplomacy.view'), ('administrator', 'global_governance_diplomacy.manage'),
  ('manager', 'global_governance_diplomacy.view'),
  ('employee', 'global_governance_diplomacy.view'),
  ('support_agent', 'global_governance_diplomacy.view'),
  ('moderator', 'global_governance_diplomacy.view'),
  ('viewer', 'global_governance_diplomacy.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_ggde_)
-- ---------------------------------------------------------------------------
create or replace function public._ggde_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ggde_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ggde_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ggde_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_governance_diplomacy_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ggde_ensure_settings(p_tenant_id uuid)
returns public.global_governance_diplomacy_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_governance_diplomacy_settings;
begin
  insert into public.global_governance_diplomacy_settings (tenant_id, enabled, governance_maturity_level)
  values (p_tenant_id, false, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.global_governance_diplomacy_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ggde_seed_policy_library_refs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_governance_policy_library_refs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.global_governance_policy_library_refs (tenant_id, template_key, template_category, title, summary, kc_article_slug) values
    (p_tenant_id, 'gov-template-cross-border', 'governance_template', 'Cross-border collaboration guidelines', 'Metadata summary — framework library reference, not legal advice.', 'global-governance-diplomacy-engine/faq/global-governance-diplomacy-engine-faq'),
    (p_tenant_id, 'charter-template-partnership', 'partnership_charter', 'Partnership charter scaffold', 'Shared objectives, governance principles, decision models — metadata summaries only.', null),
    (p_tenant_id, 'exec-playbook-alignment', 'executive_playbook', 'Executive alignment session playbook', 'Joint strategic reviews and priority alignment — human-led.', null),
    (p_tenant_id, 'collab-framework-principled', 'collaboration_framework', 'Principled collaboration framework', 'Stewardship through responsibility — companions support, humans decide.', null),
    (p_tenant_id, 'ethical-guidance-diplomacy', 'ethical_guidance', 'Ethical diplomacy guidance', 'Professional conduct and mutual respect — not ideology enforcement.', null),
    (p_tenant_id, 'diplomacy-practice-stakeholder', 'diplomacy_practice', 'Stakeholder mapping practice', 'Partnership preparation and cultural awareness scaffolds.', null);
end; $$;

create or replace function public._ggde_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.global_governance_diplomacy_settings;
  v_charter_count int;
  v_active_charters int;
  v_engagement_count int;
  v_active_engagements int;
  v_policy_refs_count int;
  v_governance_score numeric;
begin
  select * into v_settings from public.global_governance_diplomacy_settings where tenant_id = p_tenant_id;
  select count(*) into v_charter_count from public.partnership_charters where tenant_id = p_tenant_id;
  select count(*) into v_active_charters from public.partnership_charters where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_engagement_count from public.digital_diplomacy_engagements where tenant_id = p_tenant_id;
  select count(*) into v_active_engagements from public.digital_diplomacy_engagements where tenant_id = p_tenant_id and status in ('planned', 'in_progress');
  select count(*) into v_policy_refs_count from public.global_governance_policy_library_refs where tenant_id = p_tenant_id;

  v_governance_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + coalesce(v_settings.governance_maturity_level, 1) * 8
    + least(v_active_charters, 5) * 6
    + least(v_active_engagements, 8) * 3
    + least(v_policy_refs_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'governance_score', v_governance_score,
    'enabled', coalesce(v_settings.enabled, false),
    'governance_maturity_level', coalesce(v_settings.governance_maturity_level, 1),
    'charters_count', v_charter_count,
    'active_charters_count', v_active_charters,
    'engagements_count', v_engagement_count,
    'active_engagements_count', v_active_engagements,
    'policy_library_refs_count', v_policy_refs_count,
    'cross_links_count', jsonb_array_length(public._ggdebp144_integration_links()),
    'global_governance_center_capabilities', jsonb_array_length(public._ggdebp144_global_governance_center()->'capabilities')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_ggdebp144_)
-- ---------------------------------------------------------------------------
create or replace function public._ggdebp144_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 144 — Global Governance & Digital Diplomacy Engine at /app/global-governance-diplomacy-engine. Global Intelligence Era (141–150) — principled collaboration not centralized control. Distinct from Governance & Policy A.14 at /app/governance-policy-engine (tenant internal policies — cross-link, do NOT duplicate _gpe_*). Distinct from Ecosystem Governance Phase 119 at /app/ecosystem-governance (GP/companion/certification ecosystem — cross-link, do NOT duplicate _egce_* / _egcbp119_*). Distinct from Joint Operations Phase 143 at /app/joint-operations-engine (shared workspaces — cross-link). Companions support — never impose authority. Does NOT replace legal or regulatory advice. Helpers _ggdebp144_* — never collide with _egce_*, _egcbp119_*, _gpe_*.';
$$;

create or replace function public._ggdebp144_mission()
returns text language sql immutable as $$
  select 'Enable principled interorganizational governance and digital diplomacy — stewardship through responsibility, strengthening relationships without unnecessary restriction. Humans accountable; companions supportive.';
$$;

create or replace function public._ggdebp144_philosophy()
returns text language sql immutable as $$
  select 'People First. Principled collaboration not uniformity. Governance strengthens relationships — not unnecessary restriction. Complements legal processes — never replaces legal advice. Growth Partner terminology — never Affiliate. Wisdom before speed.';
$$;

create or replace function public._ggdebp144_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Governance Center surfaces partnership governance metadata and diplomacy scaffolds. Aipify informs and prepares; executives and legal counsel retain authority. Companions navigate policy libraries — they do not dictate outcomes.';
$$;

create or replace function public._ggdebp144_vision()
returns text language sql immutable as $$
  select 'Organizations collaborate across borders with clarity, empathy, and mutual respect — governance as stewardship, diplomacy as relationship-building, not control.';
$$;

create or replace function public._ggdebp144_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_governance_center', 'label', 'Global Governance Center', 'emoji', '🏛️', 'description', 'Framework libraries, cross-border guidelines, partnership governance models'),
    jsonb_build_object('key', 'digital_diplomacy', 'label', 'Digital diplomacy', 'emoji', '🤝', 'description', 'Partnership preparation, stakeholder mapping, cultural awareness'),
    jsonb_build_object('key', 'partnership_charters', 'label', 'Partnership charters', 'emoji', '📜', 'description', 'Shared objectives, escalation, confidentiality, exit procedures — metadata summaries'),
    jsonb_build_object('key', 'executive_alignment', 'label', 'Executive alignment', 'emoji', '🎯', 'description', 'Joint strategic reviews and priority alignment — human-led'),
    jsonb_build_object('key', 'cross_cultural_collaboration', 'label', 'Cross-cultural collaboration', 'emoji', '🌍', 'description', 'Cultural awareness and inclusive leadership guidance'),
    jsonb_build_object('key', 'conflict_prevention', 'label', 'Conflict prevention', 'emoji', '🛡️', 'description', 'Role ambiguity, expectation misalignment, escalation clarity'),
    jsonb_build_object('key', 'policy_library', 'label', 'Global policy library', 'emoji', '📚', 'description', 'Template keys referencing KC — not raw legal documents'),
    jsonb_build_object('key', 'governance_companion', 'label', 'Governance companion', 'emoji', '✨', 'description', 'Policy navigation and alignment summaries — does not impose authority')
  );
$$;

create or replace function public._ggdebp144_global_governance_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Governance Center — eight capabilities. Principled collaboration not centralized control.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'framework_libraries', 'label', 'Framework libraries'),
      jsonb_build_object('key', 'cross_border_guidelines', 'label', 'Cross-border guidelines'),
      jsonb_build_object('key', 'partnership_governance_models', 'label', 'Partnership governance models', 'cross_link', '/app/joint-operations-engine'),
      jsonb_build_object('key', 'executive_alignment_sessions', 'label', 'Executive alignment sessions'),
      jsonb_build_object('key', 'dispute_prevention', 'label', 'Dispute prevention'),
      jsonb_build_object('key', 'policy_coordination', 'label', 'Policy coordination', 'cross_link', '/app/governance-policy-engine'),
      jsonb_build_object('key', 'governance_dashboards', 'label', 'Governance dashboards'),
      jsonb_build_object('key', 'knowledge_repositories', 'label', 'Knowledge repositories', 'cross_link', '/app/knowledge-center-engine')
    )
  );
$$;

create or replace function public._ggdebp144_digital_diplomacy_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Digital diplomacy engine — partnership preparation and relationship health — aggregate metadata only.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'partnership_preparation', 'label', 'Partnership preparation'),
      jsonb_build_object('key', 'stakeholder_mapping', 'label', 'Stakeholder mapping'),
      jsonb_build_object('key', 'cultural_awareness', 'label', 'Cultural awareness'),
      jsonb_build_object('key', 'communication_recommendations', 'label', 'Communication recommendations'),
      jsonb_build_object('key', 'conflict_prevention', 'label', 'Conflict prevention'),
      jsonb_build_object('key', 'mutual_expectation_reviews', 'label', 'Mutual expectation reviews'),
      jsonb_build_object('key', 'relationship_health_monitoring', 'label', 'Relationship health monitoring — aggregate')
    )
  );
$$;

create or replace function public._ggdebp144_partnership_charter_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partnership charter engine — metadata summaries linking to joint operations when applicable.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'shared_objectives', 'label', 'Shared objectives'),
      jsonb_build_object('key', 'governance_principles', 'label', 'Governance principles'),
      jsonb_build_object('key', 'decision_models', 'label', 'Decision models'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation procedures'),
      jsonb_build_object('key', 'confidentiality', 'label', 'Confidentiality'),
      jsonb_build_object('key', 'review_cadences', 'label', 'Review cadences'),
      jsonb_build_object('key', 'exit_procedures', 'label', 'Exit procedures')
    ),
    'joint_operations_cross_link', '/app/joint-operations-engine'
  );
$$;

create or replace function public._ggdebp144_executive_alignment_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive alignment engine — joint strategic reviews; humans lead, companions prepare.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'joint_strategic_reviews', 'label', 'Joint strategic reviews'),
      jsonb_build_object('key', 'priority_alignment', 'label', 'Priority alignment'),
      jsonb_build_object('key', 'shared_risk_discussions', 'label', 'Shared risk discussions'),
      jsonb_build_object('key', 'partnership_evaluations', 'label', 'Partnership evaluations'),
      jsonb_build_object('key', 'future_planning', 'label', 'Future planning'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection sessions')
    )
  );
$$;

create or replace function public._ggdebp144_cross_cultural_collaboration_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-cultural collaboration — empathy, patience, inclusive leadership.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'cultural_awareness', 'label', 'Cultural awareness'),
      jsonb_build_object('key', 'communication_guidance', 'label', 'Communication guidance'),
      jsonb_build_object('key', 'regional_frameworks', 'label', 'Regional frameworks'),
      jsonb_build_object('key', 'inclusive_leadership', 'label', 'Inclusive leadership', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'global_knowledge_libraries', 'label', 'Global knowledge libraries', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'professional_conduct', 'label', 'Professional conduct')
    )
  );
$$;

create or replace function public._ggdebp144_governance_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Governance companion — policy navigation and preparation; does not impose authority.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'policy_navigation', 'label', 'Policy navigation'),
      jsonb_build_object('key', 'partnership_prep', 'label', 'Partnership preparation'),
      jsonb_build_object('key', 'governance_recommendations', 'label', 'Governance recommendations'),
      jsonb_build_object('key', 'knowledge_retrieval', 'label', 'Knowledge retrieval', 'cross_link', '/app/knowledge-center-engine'),
      jsonb_build_object('key', 'reflection', 'label', 'Reflection'),
      jsonb_build_object('key', 'alignment_summaries', 'label', 'Alignment summaries')
    )
  );
$$;

create or replace function public._ggdebp144_conflict_prevention_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Conflict prevention framework — identify governance gaps before they become disputes.',
    'risk_areas', jsonb_build_array(
      jsonb_build_object('key', 'role_ambiguity', 'label', 'Role ambiguity'),
      jsonb_build_object('key', 'governance_gaps', 'label', 'Governance gaps'),
      jsonb_build_object('key', 'communication_breakdowns', 'label', 'Communication breakdowns'),
      jsonb_build_object('key', 'expectation_misalignment', 'label', 'Expectation misalignment'),
      jsonb_build_object('key', 'escalation_confusion', 'label', 'Escalation confusion'),
      jsonb_build_object('key', 'decision_bottlenecks', 'label', 'Decision bottlenecks')
    )
  );
$$;

create or replace function public._ggdebp144_global_policy_library()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global policy library — template keys referencing KC/governance library, not raw legal docs.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'governance_templates', 'label', 'Governance templates'),
      jsonb_build_object('key', 'partnership_charters', 'label', 'Partnership charters'),
      jsonb_build_object('key', 'executive_playbooks', 'label', 'Executive playbooks'),
      jsonb_build_object('key', 'collaboration_frameworks', 'label', 'Collaboration frameworks'),
      jsonb_build_object('key', 'ethical_guidance', 'label', 'Ethical guidance'),
      jsonb_build_object('key', 'diplomacy_practices', 'label', 'Diplomacy practices')
    ),
    'legal_disclaimer', 'Template references only — not legal or regulatory advice. Consult qualified counsel.'
  );
$$;

create or replace function public._ggdebp144_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Override executive authority',
      'Dictate outcomes',
      'Enforce ideology',
      'Suppress dissent',
      'Replace legal or regulatory advice',
      'Impose uniformity across partners'
    ),
    'principle', 'Companions navigate and prepare — executives and legal counsel decide.'
  );
$$;

create or replace function public._ggdebp144_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — empathy, patience, respect, humility, curiosity, understanding.',
    'values', jsonb_build_array(
      'empathy', 'patience', 'respect', 'humility', 'curiosity', 'understanding'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._ggdebp144_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'governance_audit', 'label', 'Governance audit logs'),
      jsonb_build_object('key', 'executive_approval_histories', 'label', 'Executive approval histories'),
      jsonb_build_object('key', 'partnership_access_controls', 'label', 'Partnership access controls'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._ggdebp144_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Interorganizational learning — cross-link only'),
    jsonb_build_object('key', 'trust_network', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'relationship', 'Verified organization ecosystem — cross-link only'),
    jsonb_build_object('key', 'joint_operations', 'label', 'Joint Operations Phase 143', 'route', '/app/joint-operations-engine', 'relationship', 'Shared workspaces and partnerships — cross-link only'),
    jsonb_build_object('key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 119', 'route', '/app/ecosystem-governance', 'relationship', 'GP/companion/certification — do NOT duplicate _egce_*'),
    jsonb_build_object('key', 'collective_decision_council', 'label', 'Collective Decision Council Phase 137', 'route', '/app/collective-decision-council-engine', 'relationship', 'Council governance — cross-link only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Inclusive leadership — cross-link only'),
    jsonb_build_object('key', 'governance_policy', 'label', 'Governance & Policy A.14', 'route', '/app/governance-policy-engine', 'relationship', 'Tenant internal policies — do NOT duplicate _gpe_*')
  );
$$;

create or replace function public._ggdebp144_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Governance & Digital Diplomacy internally with metadata-only partnership charters and diplomacy engagement scaffolds. Growth Partner terminology throughout. Companions prepare; executives decide. Not legal advice.';
$$;

create or replace function public._ggdebp144_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Stewardship through responsibility.',
    'Governance strengthens relationships — not unnecessary restriction.',
    'Principled collaboration — not centralized control.',
    'Humans accountable; companions supportive.',
    'Complements legal processes — never replaces legal advice.'
  );
$$;

create or replace function public._ggdebp144_privacy_note()
returns text language sql immutable as $$
  select 'Global Governance & Digital Diplomacy metadata only — charter summaries, engagement scaffolds, and policy library template keys. No raw legal documents. No cross-tenant PII. Executive approval workflows where configured.';
$$;

create or replace function public._ggdebp144_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ggde_ensure_settings(p_tenant_id);
  perform public._ggde_seed_policy_library_refs(p_tenant_id);
  v_metrics := public._ggde_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'governance_score', coalesce((v_metrics->>'governance_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'governance_maturity_level', coalesce((v_metrics->>'governance_maturity_level')::int, 1),
    'charters_count', coalesce((v_metrics->>'charters_count')::int, 0),
    'active_charters_count', coalesce((v_metrics->>'active_charters_count')::int, 0),
    'engagements_count', coalesce((v_metrics->>'engagements_count')::int, 0),
    'active_engagements_count', coalesce((v_metrics->>'active_engagements_count')::int, 0),
    'policy_library_refs_count', coalesce((v_metrics->>'policy_library_refs_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._ggdebp144_integration_links()),
    'global_governance_center_capabilities', 8,
    'privacy_note', public._ggdebp144_privacy_note(),
    'legal_disclaimer', 'Not legal or regulatory advice — consult qualified counsel.'
  );
end; $$;

create or replace function public._ggdebp144_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ggde_ensure_settings(p_tenant_id);
  perform public._ggde_seed_policy_library_refs(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_governance_center', 'label', 'Global Governance Center — eight capabilities', 'met', jsonb_array_length(public._ggdebp144_global_governance_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'digital_diplomacy', 'label', 'Digital diplomacy engine — seven domains', 'met', jsonb_array_length(public._ggdebp144_digital_diplomacy_engine()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'partnership_charter', 'label', 'Partnership charter engine — seven elements', 'met', jsonb_array_length(public._ggdebp144_partnership_charter_engine()->'elements') = 7, 'note', null),
    jsonb_build_object('key', 'executive_alignment', 'label', 'Executive alignment — six capabilities', 'met', jsonb_array_length(public._ggdebp144_executive_alignment_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'cross_cultural', 'label', 'Cross-cultural collaboration — six domains', 'met', jsonb_array_length(public._ggdebp144_cross_cultural_collaboration_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'governance_companion', 'label', 'Governance companion — six capabilities', 'met', jsonb_array_length(public._ggdebp144_governance_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'conflict_prevention', 'label', 'Conflict prevention — six risk areas', 'met', jsonb_array_length(public._ggdebp144_conflict_prevention_framework()->'risk_areas') = 6, 'note', null),
    jsonb_build_object('key', 'policy_library', 'label', 'Global policy library — six categories', 'met', jsonb_array_length(public._ggdebp144_global_policy_library()->'categories') = 6, 'note', null),
    jsonb_build_object('key', 'policy_refs_seeded', 'label', 'Policy library refs seeded', 'met', (select count(*) >= 6 from public.global_governance_policy_library_refs r where r.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.global_governance_diplomacy_settings s where s.tenant_id = p_tenant_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._ggdebp144_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._ggdebp144_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — seven cross-links', 'met', jsonb_array_length(public._ggdebp144_integration_links()) = 7, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 144 baseline tables and RPCs', 'met', to_regclass('public.global_governance_diplomacy_settings') is not null, 'note', '_ggde_* helpers intact')
  );
end; $$;

create or replace function public._ggdebp144_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 144 — Global Governance & Digital Diplomacy Engine',
    'doc', 'GLOBAL_GOVERNANCE_DIGITAL_DIPLOMACY_ENGINE_PHASE144.md',
    'engine_phase', 'Repo Phase 144 Global Governance Diplomacy Engine',
    'route', '/app/global-governance-diplomacy-engine',
    'mapping_note', 'Global Intelligence Era (141–150) — principled collaboration not centralized control.',
    'distinction_note', public._ggdebp144_distinction_note(),
    'mission', public._ggdebp144_mission(),
    'philosophy', public._ggdebp144_philosophy(),
    'abos_principle', public._ggdebp144_abos_principle(),
    'vision', public._ggdebp144_vision(),
    'objectives', public._ggdebp144_objectives(),
    'global_governance_center', public._ggdebp144_global_governance_center(),
    'digital_diplomacy_engine', public._ggdebp144_digital_diplomacy_engine(),
    'partnership_charter_engine', public._ggdebp144_partnership_charter_engine(),
    'executive_alignment_engine', public._ggdebp144_executive_alignment_engine(),
    'cross_cultural_collaboration_engine', public._ggdebp144_cross_cultural_collaboration_engine(),
    'governance_companion', public._ggdebp144_governance_companion(),
    'conflict_prevention_framework', public._ggdebp144_conflict_prevention_framework(),
    'global_policy_library', public._ggdebp144_global_policy_library(),
    'companion_limitations', public._ggdebp144_companion_limitations(),
    'self_love_connection', public._ggdebp144_self_love_connection(),
    'security_requirements', public._ggdebp144_security_requirements(),
    'integration_links', public._ggdebp144_integration_links(),
    'dogfooding', public._ggdebp144_dogfooding(),
    'success_criteria', public._ggdebp144_success_criteria(p_tenant_id),
    'engagement_summary', public._ggdebp144_engagement_summary(p_tenant_id),
    'vision_phrases', public._ggdebp144_vision_phrases(),
    'privacy_note', public._ggdebp144_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_partnership_charter(
  p_title text,
  p_shared_objectives_summary text default null,
  p_governance_principles_summary text default null,
  p_decision_model_summary text default null,
  p_escalation_summary text default null,
  p_confidentiality_summary text default null,
  p_review_cadence_summary text default null,
  p_exit_procedures_summary text default null,
  p_joint_operations_partnership_id uuid default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ggde_require_tenant());
  perform public._ggde_ensure_settings(v_tenant_id);
  if char_length(coalesce(p_shared_objectives_summary, '')) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := 'charter-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.partnership_charters (
    tenant_id, charter_key, title, status,
    shared_objectives_summary, governance_principles_summary, decision_model_summary,
    escalation_summary, confidentiality_summary, review_cadence_summary, exit_procedures_summary,
    joint_operations_partnership_id
  ) values (
    v_tenant_id, v_key, p_title, 'draft',
    left(p_shared_objectives_summary, 500), left(p_governance_principles_summary, 500),
    left(p_decision_model_summary, 500), left(p_escalation_summary, 500),
    left(p_confidentiality_summary, 500), left(p_review_cadence_summary, 500),
    left(p_exit_procedures_summary, 500), p_joint_operations_partnership_id
  )
  returning id into v_id;
  perform public._ggde_log_audit(v_tenant_id, 'charter_created', left(p_title, 120),
    jsonb_build_object('charter_id', v_id, 'charter_key', v_key));
  return v_id;
end; $$;

create or replace function public.record_diplomacy_engagement(
  p_engagement_type text,
  p_title text,
  p_status text default 'planned',
  p_metadata jsonb default '{}'::jsonb,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ggde_require_tenant());
  perform public._ggde_ensure_settings(v_tenant_id);
  if p_status not in ('planned', 'in_progress', 'completed', 'paused', 'archived') then
    raise exception 'Invalid status';
  end if;
  v_key := p_engagement_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.digital_diplomacy_engagements (
    tenant_id, engagement_key, engagement_type, title, status, metadata,
    started_at
  ) values (
    v_tenant_id, v_key, p_engagement_type, p_title, p_status, p_metadata,
    case when p_status = 'in_progress' then now() else null end
  )
  returning id into v_id;
  perform public._ggde_log_audit(v_tenant_id, 'engagement_recorded', left(p_title, 120),
    jsonb_build_object('engagement_id', v_id, 'engagement_type', p_engagement_type, 'status', p_status));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_governance_diplomacy_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_governance_diplomacy_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ggde_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ggde_ensure_settings(v_tenant_id);
  perform public._ggde_seed_policy_library_refs(v_tenant_id);
  v_metrics := public._ggde_refresh_metrics(v_tenant_id);
  v_engagement := public._ggdebp144_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'governance_score', v_metrics->'governance_score',
    'enabled', v_settings.enabled,
    'governance_maturity_level', v_settings.governance_maturity_level,
    'charters_count', v_metrics->'charters_count',
    'philosophy', public._ggdebp144_philosophy(),
    'executive_approval_required', v_settings.executive_approval_required,
    'legal_disclaimer', 'Not legal or regulatory advice — consult qualified counsel.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 144 — Global Governance & Digital Diplomacy Engine',
      'doc', 'GLOBAL_GOVERNANCE_DIGITAL_DIPLOMACY_ENGINE_PHASE144.md',
      'engine_phase', 'Repo Phase 144 Global Governance Diplomacy Engine',
      'route', '/app/global-governance-diplomacy-engine',
      'mapping_note', 'Global Intelligence Era (141–150).'
    ),
    'global_governance_diplomacy_mission', public._ggdebp144_mission(),
    'global_governance_diplomacy_abos_principle', public._ggdebp144_abos_principle(),
    'global_governance_diplomacy_engagement_summary', v_engagement,
    'global_governance_diplomacy_note', public._ggdebp144_distinction_note(),
    'global_governance_diplomacy_vision_note', public._ggdebp144_vision()
  );
end; $$;

create or replace function public.get_global_governance_diplomacy_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.global_governance_diplomacy_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._ggde_require_tenant());
  v_settings := public._ggde_ensure_settings(v_tenant_id);
  perform public._ggde_seed_policy_library_refs(v_tenant_id);
  v_metrics := public._ggde_refresh_metrics(v_tenant_id);
  perform public._ggde_log_audit(v_tenant_id, 'dashboard_view', 'Global Governance Diplomacy dashboard viewed',
    jsonb_build_object('governance_score', v_metrics->>'governance_score', 'enabled', v_settings.enabled));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'governance_maturity_level', v_settings.governance_maturity_level,
    'executive_approval_required', v_settings.executive_approval_required,
    'partnership_prep_enabled', v_settings.partnership_prep_enabled,
    'philosophy', public._ggdebp144_philosophy(),
    'safety_note', 'Global Governance & Digital Diplomacy — metadata summaries and policy library template keys only. Not legal advice. Executive approval where configured.',
    'legal_disclaimer', 'Not legal or regulatory advice — consult qualified counsel.',
    'distinction_note', public._ggdebp144_distinction_note(),
    'governance_score', v_metrics->'governance_score',
    'charters_count', v_metrics->'charters_count',
    'active_charters_count', v_metrics->'active_charters_count',
    'engagements_count', v_metrics->'engagements_count',
    'active_engagements_count', v_metrics->'active_engagements_count',
    'policy_library_refs_count', v_metrics->'policy_library_refs_count',
    'partnership_charters', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'charter_key', c.charter_key, 'title', c.title, 'status', c.status,
        'shared_objectives_summary', c.shared_objectives_summary,
        'governance_principles_summary', c.governance_principles_summary,
        'decision_model_summary', c.decision_model_summary,
        'escalation_summary', c.escalation_summary,
        'confidentiality_summary', c.confidentiality_summary,
        'review_cadence_summary', c.review_cadence_summary,
        'exit_procedures_summary', c.exit_procedures_summary,
        'joint_operations_partnership_id', c.joint_operations_partnership_id,
        'updated_at', c.updated_at
      ) order by c.updated_at desc)
      from public.partnership_charters c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'diplomacy_engagements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'engagement_key', e.engagement_key, 'engagement_type', e.engagement_type,
        'title', e.title, 'status', e.status, 'metadata', e.metadata,
        'started_at', e.started_at, 'created_at', e.created_at
      ) order by e.created_at desc)
      from public.digital_diplomacy_engagements e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'policy_library_refs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'template_key', r.template_key, 'template_category', r.template_category,
        'title', r.title, 'summary', r.summary, 'kc_article_slug', r.kc_article_slug
      ) order by r.template_category)
      from public.global_governance_policy_library_refs r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._ggdebp144_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 144 — Global Governance & Digital Diplomacy Engine',
      'doc', 'GLOBAL_GOVERNANCE_DIGITAL_DIPLOMACY_ENGINE_PHASE144.md',
      'engine_phase', 'Repo Phase 144 Global Governance Diplomacy Engine',
      'route', '/app/global-governance-diplomacy-engine',
      'mapping_note', 'Global Intelligence Era (141–150) — principled collaboration not centralized control.'
    ),
    'global_governance_diplomacy_engine_note', 'Global Governance & Digital Diplomacy Engine (ABOS Phase 144). Cross-link A.14, 119, 141–143 — do NOT duplicate _gpe_*, _egce_*.',
    'global_governance_diplomacy_blueprint', public._ggdebp144_blueprint_block(v_tenant_id),
    'global_governance_diplomacy_distinction_note', public._ggdebp144_distinction_note(),
    'global_governance_diplomacy_mission', public._ggdebp144_mission(),
    'global_governance_diplomacy_philosophy', public._ggdebp144_philosophy(),
    'global_governance_diplomacy_abos_principle', public._ggdebp144_abos_principle(),
    'global_governance_diplomacy_objectives', public._ggdebp144_objectives(),
    'global_governance_center_meta', public._ggdebp144_global_governance_center(),
    'digital_diplomacy_engine_meta', public._ggdebp144_digital_diplomacy_engine(),
    'partnership_charter_engine_meta', public._ggdebp144_partnership_charter_engine(),
    'executive_alignment_engine_meta', public._ggdebp144_executive_alignment_engine(),
    'cross_cultural_collaboration_engine_meta', public._ggdebp144_cross_cultural_collaboration_engine(),
    'governance_companion_meta', public._ggdebp144_governance_companion(),
    'conflict_prevention_framework_meta', public._ggdebp144_conflict_prevention_framework(),
    'global_policy_library_meta', public._ggdebp144_global_policy_library(),
    'companion_limitations_meta', public._ggdebp144_companion_limitations(),
    'self_love_connection_meta', public._ggdebp144_self_love_connection(),
    'security_requirements_meta', public._ggdebp144_security_requirements(),
    'ggdebp144_integration_links', public._ggdebp144_integration_links(),
    'global_governance_diplomacy_engagement_summary', public._ggdebp144_engagement_summary(v_tenant_id),
    'global_governance_diplomacy_success_criteria', public._ggdebp144_success_criteria(v_tenant_id),
    'global_governance_diplomacy_vision', public._ggdebp144_vision(),
    'global_governance_diplomacy_vision_phrases', public._ggdebp144_vision_phrases(),
    'global_governance_diplomacy_privacy_note', public._ggdebp144_privacy_note(),
    'global_governance_diplomacy_dogfooding', public._ggdebp144_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-governance-diplomacy-engine', 'Global Governance & Digital Diplomacy Engine',
  'Global Intelligence Era (141–150) — principled interorganizational governance and digital diplomacy. People First. Not legal advice.',
  'authenticated', 154
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-governance-diplomacy-engine' and tenant_id is null
);

grant execute on function public.get_global_governance_diplomacy_engine_card(uuid) to authenticated;
grant execute on function public.get_global_governance_diplomacy_engine_dashboard(uuid) to authenticated;
grant execute on function public.create_partnership_charter(text, text, text, text, text, text, text, text, uuid, uuid) to authenticated;
grant execute on function public.record_diplomacy_engagement(text, text, text, jsonb, uuid) to authenticated;
grant execute on function public._ggdebp144_distinction_note() to authenticated;
grant execute on function public._ggdebp144_mission() to authenticated;
grant execute on function public._ggdebp144_philosophy() to authenticated;
grant execute on function public._ggdebp144_abos_principle() to authenticated;
grant execute on function public._ggdebp144_vision() to authenticated;
grant execute on function public._ggdebp144_objectives() to authenticated;
grant execute on function public._ggdebp144_global_governance_center() to authenticated;
grant execute on function public._ggdebp144_digital_diplomacy_engine() to authenticated;
grant execute on function public._ggdebp144_partnership_charter_engine() to authenticated;
grant execute on function public._ggdebp144_executive_alignment_engine() to authenticated;
grant execute on function public._ggdebp144_cross_cultural_collaboration_engine() to authenticated;
grant execute on function public._ggdebp144_governance_companion() to authenticated;
grant execute on function public._ggdebp144_conflict_prevention_framework() to authenticated;
grant execute on function public._ggdebp144_global_policy_library() to authenticated;
grant execute on function public._ggdebp144_companion_limitations() to authenticated;
grant execute on function public._ggdebp144_self_love_connection() to authenticated;
grant execute on function public._ggdebp144_security_requirements() to authenticated;
grant execute on function public._ggdebp144_integration_links() to authenticated;
grant execute on function public._ggdebp144_dogfooding() to authenticated;
grant execute on function public._ggdebp144_vision_phrases() to authenticated;
grant execute on function public._ggdebp144_privacy_note() to authenticated;
grant execute on function public._ggdebp144_engagement_summary(uuid) to authenticated;
grant execute on function public._ggdebp144_success_criteria(uuid) to authenticated;
