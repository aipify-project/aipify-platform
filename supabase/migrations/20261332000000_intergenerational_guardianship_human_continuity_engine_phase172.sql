-- Phase 172 — Intergenerational Guardianship & Human Continuity Engine
-- Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — Guardianship Center.
-- Stewardship and human continuity reflection — NOT ownership/control, NOT defining organizational values.
-- Guardianship Companion does NOT define values or determine future priorities.
-- Cross-link Phase 171 /app/multi-generational-futures-engine (if missing on disk, cross-link string still present).
-- Helpers: _ighce_* (engine), _ighcebp172_* (blueprint — never collide with _cfhpbp170_*, _mgfebp171_*)

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
    'global_ecosystem_marketplace',
    'future_leaders_engine',
    'organizational_sensemaking_engine',
    'living_enterprise_engine',
    'civic_collaboration_engine',
    'cross_sector_intelligence_engine',
    'civilizational_memory_engine',
    'civilizational_learning_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'social_cohesion_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. intergenerational_guardianship_settings
-- ---------------------------------------------------------------------------
create table if not exists public.intergenerational_guardianship_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  guardianship_mode text not null default 'guided' check (
    guardianship_mode in ('guided', 'executive_led', 'stewardship_focused')
  ),
  continuity_reflection_enabled boolean not null default true,
  values_preservation_enabled boolean not null default true,
  legacy_resilience_enabled boolean not null default true,
  executive_reviews_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  reflection_opt_in boolean not null default true,
  guardianship_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_ownership_control":true,"companion_does_not_define_values":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.intergenerational_guardianship_settings enable row level security;
revoke all on public.intergenerational_guardianship_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. intergenerational_guardianship_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.intergenerational_guardianship_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'future_stewardship_themes', 'values_continuity_handoff', 'intergenerational_responsibility',
      'legacy_resilience_readiness', 'leadership_guardianship_reflection'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists intergenerational_guardianship_reviews_tenant_idx
  on public.intergenerational_guardianship_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.intergenerational_guardianship_reviews enable row level security;
revoke all on public.intergenerational_guardianship_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. intergenerational_guardianship_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.intergenerational_guardianship_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (
    reflection_type in (
      'dignity_reflection', 'compassion_reflection', 'integrity_reflection',
      'curiosity_reflection', 'service_reflection', 'stewardship_reflection',
      'human_continuity_themes', 'values_preservation_themes'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_value_definition":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);

create index if not exists intergenerational_guardianship_reflections_tenant_idx
  on public.intergenerational_guardianship_reflections (tenant_id, reflection_type, status);

alter table public.intergenerational_guardianship_reflections enable row level security;
revoke all on public.intergenerational_guardianship_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. intergenerational_guardianship_legacy_entries
-- ---------------------------------------------------------------------------
create table if not exists public.intergenerational_guardianship_legacy_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  entry_key text not null,
  entry_type text not null check (
    entry_type in (
      'knowledge_transfer', 'mentorship_continuity', 'institutional_memory_bridge',
      'leadership_succession_readiness', 'cultural_continuity', 'values_transmission',
      'community_legacy_stewardship', 'intergenerational_learning'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'planned', 'active', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"scaffold_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, entry_key)
);

create index if not exists intergenerational_guardianship_legacy_entries_tenant_idx
  on public.intergenerational_guardianship_legacy_entries (tenant_id, entry_type, status);

alter table public.intergenerational_guardianship_legacy_entries enable row level security;
revoke all on public.intergenerational_guardianship_legacy_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. intergenerational_guardianship_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.intergenerational_guardianship_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.intergenerational_guardianship_audit_logs enable row level security;
revoke all on public.intergenerational_guardianship_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'intergenerational_guardianship_engine', v.description
from (values
  ('intergenerational_guardianship.view', 'View Guardianship Center', 'View guardianship reviews, continuity reflections, and legacy resilience scaffolds'),
  ('intergenerational_guardianship.manage', 'Manage Guardianship Center', 'Update guardianship settings, programs, and stewardship scaffolds'),
  ('intergenerational_guardianship.steward', 'Steward Guardianship Center', 'Record executive guardianship reviews and values continuity reflection metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'intergenerational_guardianship.view'), ('owner', 'intergenerational_guardianship.manage'), ('owner', 'intergenerational_guardianship.steward'),
  ('administrator', 'intergenerational_guardianship.view'), ('administrator', 'intergenerational_guardianship.manage'), ('administrator', 'intergenerational_guardianship.steward'),
  ('manager', 'intergenerational_guardianship.view'), ('manager', 'intergenerational_guardianship.steward'),
  ('employee', 'intergenerational_guardianship.view'),
  ('support_agent', 'intergenerational_guardianship.view'),
  ('moderator', 'intergenerational_guardianship.view'),
  ('viewer', 'intergenerational_guardianship.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_ighce_*)
-- ---------------------------------------------------------------------------
create or replace function public._ighce_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ighce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ighce_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ighce_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.intergenerational_guardianship_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ighce_ensure_settings(p_tenant_id uuid)
returns public.intergenerational_guardianship_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.intergenerational_guardianship_settings;
begin
  insert into public.intergenerational_guardianship_settings (tenant_id, enabled, guardianship_mode)
  values (p_tenant_id, false, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.intergenerational_guardianship_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ighce_seed_legacy_entries(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.intergenerational_guardianship_legacy_entries where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.intergenerational_guardianship_legacy_entries (tenant_id, entry_key, entry_type, title, summary, status) values
    (p_tenant_id, 'knowledge-transfer', 'knowledge_transfer', 'Knowledge Transfer Scaffolds', 'Intergenerational knowledge transfer metadata — cross-link Organizational Memory and Civilizational Memory 163.', 'planned'),
    (p_tenant_id, 'mentorship-continuity', 'mentorship_continuity', 'Mentorship Continuity Programs', 'Mentorship bridge scaffolds — cross-link Future Leaders 151. Growth Partner not Affiliate.', 'planned'),
    (p_tenant_id, 'institutional-memory-bridge', 'institutional_memory_bridge', 'Institutional Memory Bridge', 'Institutional memory continuity metadata — cross-link /app/organizational-memory-engine.', 'planned'),
    (p_tenant_id, 'leadership-succession', 'leadership_succession_readiness', 'Leadership Succession Readiness', 'Succession readiness reflection scaffolds — humans decide; Companion does NOT determine priorities.', 'planned'),
    (p_tenant_id, 'cultural-continuity', 'cultural_continuity', 'Cultural Continuity Practices', 'Cultural continuity themes — aggregate reflection, not surveillance.', 'planned'),
    (p_tenant_id, 'values-transmission', 'values_transmission', 'Values Transmission Reflection', 'Values transmission metadata — humans define values; Companion supports reflection only.', 'planned'),
    (p_tenant_id, 'community-legacy', 'community_legacy_stewardship', 'Community Legacy Stewardship', 'Community legacy stewardship scaffolds — cross-link Civic Collaboration 161.', 'planned'),
    (p_tenant_id, 'intergenerational-learning', 'intergenerational_learning', 'Intergenerational Learning Paths', 'Learning continuity metadata — cross-link Civilizational Learning 164 and Learning Engine.', 'planned');
end; $$;

create or replace function public._ighce_seed_scaffolds(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ighce_seed_legacy_entries(p_tenant_id);

  if exists (select 1 from public.intergenerational_guardianship_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.intergenerational_guardianship_reviews (tenant_id, review_key, review_type, title, summary, status) values
    (p_tenant_id, 'future-stewardship', 'future_stewardship_themes', 'Future Stewardship Themes', 'Executive guardianship review — how stewardship themes evolve across generations. Metadata only.', 'draft'),
    (p_tenant_id, 'values-continuity-handoff', 'values_continuity_handoff', 'Values Continuity Handoff', 'Reflection on values continuity across leadership transitions — humans define values.', 'draft'),
    (p_tenant_id, 'intergenerational-responsibility', 'intergenerational_responsibility', 'Intergenerational Responsibility Review', 'Responsibility themes for present and future generations — stewardship not control.', 'draft'),
    (p_tenant_id, 'legacy-resilience-readiness', 'legacy_resilience_readiness', 'Legacy Resilience Readiness', 'Readiness scaffolds for legacy resilience — cross-link Legacy A.86 and Hope Engine.', 'draft'),
    (p_tenant_id, 'leadership-guardianship', 'leadership_guardianship_reflection', 'Leadership Guardianship Reflection', 'Leadership guardianship reflection — cross-link Phase 171 Multi-Generational Futures.', 'draft');

  insert into public.intergenerational_guardianship_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values
    (p_tenant_id, 'dignity-themes', 'dignity_reflection', 'Dignity Continuity Reflection', 'Human dignity continuity themes — values preservation scaffold, not value definition.', 'draft'),
    (p_tenant_id, 'compassion-themes', 'compassion_reflection', 'Compassion Continuity Reflection', 'Compassion continuity reflection metadata — cross-link Self Love A.76.', 'draft'),
    (p_tenant_id, 'integrity-themes', 'integrity_reflection', 'Integrity Continuity Reflection', 'Integrity continuity themes — stewardship through consistency.', 'draft'),
    (p_tenant_id, 'curiosity-themes', 'curiosity_reflection', 'Curiosity Continuity Reflection', 'Curiosity and learning continuity themes — cross-link Civilizational Learning 164.', 'draft'),
    (p_tenant_id, 'service-themes', 'service_reflection', 'Service Continuity Reflection', 'Service and contribution continuity reflection — Growth Partner not Affiliate.', 'draft'),
    (p_tenant_id, 'stewardship-themes', 'stewardship_reflection', 'Stewardship Continuity Reflection', 'Stewardship continuity themes — cross-link Global Stewardship 150.', 'draft');
end; $$;

create or replace function public._ighce_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.intergenerational_guardianship_settings;
  v_reviews_count int;
  v_reflections_count int;
  v_legacy_count int;
  v_guardianship_score numeric;
begin
  select * into v_settings from public.intergenerational_guardianship_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.intergenerational_guardianship_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections_count from public.intergenerational_guardianship_reflections where tenant_id = p_tenant_id;
  select count(*) into v_legacy_count from public.intergenerational_guardianship_legacy_entries where tenant_id = p_tenant_id;

  v_guardianship_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.continuity_reflection_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.values_preservation_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.legacy_resilience_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.executive_reviews_enabled, false) then 10 else 0 end
    + least(v_reviews_count, 5) * 4
    + least(v_reflections_count, 6) * 3
    + least(v_legacy_count, 8) * 2,
    1
  );

  return jsonb_build_object(
    'guardianship_score', v_guardianship_score,
    'enabled', coalesce(v_settings.enabled, false),
    'guardianship_mode', coalesce(v_settings.guardianship_mode, 'guided'),
    'executive_reviews_count', v_reviews_count,
    'continuity_reflections_count', v_reflections_count,
    'legacy_entries_count', v_legacy_count,
    'cross_links_count', jsonb_array_length(public._ighcebp172_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_ighcebp172_*)
-- ---------------------------------------------------------------------------
create or replace function public._ighcebp172_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 172 — Intergenerational Guardianship & Human Continuity Engine at /app/intergenerational-guardianship-engine. Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — Guardianship Center. Stewardship and human continuity reflection — NOT ownership/control, NOT defining organizational values. Guardianship Companion does NOT define values or determine future priorities. Cross-link Phase 171 /app/multi-generational-futures-engine. Helpers _ighcebp172_* — never collide with _cfhpbp170_*, _mgfebp171_*. Growth Partner not Affiliate.';
$$;

create or replace function public._ighcebp172_mission()
returns text language sql immutable as $$
  select 'Help organizations steward intergenerational responsibility and human continuity through guardianship reflection, values preservation scaffolds, and legacy resilience — without ownership control, value definition by Companion, or determining future priorities.';
$$;

create or replace function public._ighcebp172_philosophy()
returns text language sql immutable as $$
  select 'People First. Guardianship through responsibility — present generations steward the future; future generations inherit wisdom. Growth Partner terminology — never Affiliate. Guardianship Companion supports reflection; it does NOT define values, determine priorities, or replace human leadership.';
$$;

create or replace function public._ighcebp172_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Guardianship Center aggregates intergenerational stewardship visibility. Phase 171 Multi-Generational Futures, Phases 161–170, Future Leaders 151, Legacy A.86, Organizational Memory, Civilizational Memory 163, Hope Engine, Self Love A.76, and Purpose Values A.82 remain authoritative for their domains. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._ighcebp172_vision()
returns text language sql immutable as $$
  select 'Organizations where present leaders steward human continuity with humility — preserving dignity, compassion, integrity, curiosity, service, and stewardship for generations not yet at the table.';
$$;

create or replace function public._ighcebp172_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'guardianship_reflection', 'label', 'Guardianship reflection programs', 'emoji', '🛡️', 'description', 'Executive and leadership guardianship review scaffolds'),
    jsonb_build_object('key', 'human_continuity', 'label', 'Human continuity reflection', 'emoji', '🌱', 'description', 'Values and continuity reflection metadata — not value definition'),
    jsonb_build_object('key', 'legacy_resilience', 'label', 'Legacy resilience scaffolds', 'emoji', '📜', 'description', 'Legacy resilience metadata — cross-link Legacy A.86'),
    jsonb_build_object('key', 'values_preservation', 'label', 'Values preservation engine', 'emoji', '💎', 'description', 'Six core values reflection — humans define values'),
    jsonb_build_object('key', 'guardianship_companion', 'label', 'Guardianship Companion guidance', 'emoji', '✨', 'description', 'Reflection support — does NOT define values'),
    jsonb_build_object('key', 'intergenerational_responsibility', 'label', 'Intergenerational responsibility framework', 'emoji', '🔗', 'description', 'Seven-domain responsibility reflection'),
    jsonb_build_object('key', 'executive_guardianship', 'label', 'Executive guardianship reviews', 'emoji', '⭐', 'description', 'Five-theme executive review scaffolds'),
    jsonb_build_object('key', 'guardianship_knowledge', 'label', 'Guardianship knowledge libraries', 'emoji', '📚', 'description', 'Continuity and legacy knowledge scaffolds')
  );
$$;

create or replace function public._ighcebp172_guardianship_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Guardianship Center — eight intergenerational stewardship capabilities. Reflection not control.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'guardianship_reflection_programs', 'label', 'Guardianship reflection programs'),
      jsonb_build_object('key', 'human_continuity_dashboards', 'label', 'Human continuity reflection dashboards'),
      jsonb_build_object('key', 'executive_guardianship_reviews', 'label', 'Executive guardianship reviews'),
      jsonb_build_object('key', 'companion_guidance', 'label', 'Guardianship Companion guidance'),
      jsonb_build_object('key', 'values_preservation_scaffolds', 'label', 'Values preservation scaffolds', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'legacy_resilience_programs', 'label', 'Legacy resilience programs', 'cross_link', '/app/legacy-engine'),
      jsonb_build_object('key', 'multi_generational_futures_link', 'label', 'Multi-generational futures cross-link', 'cross_link', '/app/multi-generational-futures-engine'),
      jsonb_build_object('key', 'guardianship_knowledge_libraries', 'label', 'Guardianship knowledge libraries', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._ighcebp172_human_continuity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human continuity engine — five reflection questions for intergenerational stewardship.',
    'reflection_questions', jsonb_build_array(
      jsonb_build_object('key', 'who_inherits', 'label', 'Who inherits the consequences of our decisions?'),
      jsonb_build_object('key', 'what_continues', 'label', 'What human values must continue beyond us?'),
      jsonb_build_object('key', 'what_fragile', 'label', 'What continuity is most fragile today?'),
      jsonb_build_object('key', 'how_steward', 'label', 'How do we steward without controlling the future?'),
      jsonb_build_object('key', 'what_legacy', 'label', 'What legacy resilience do we build now?')
    )
  );
$$;

create or replace function public._ighcebp172_intergenerational_responsibility_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Intergenerational responsibility framework — seven stewardship domains.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'leadership_succession', 'label', 'Leadership succession readiness', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'knowledge_continuity', 'label', 'Knowledge continuity', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'values_transmission', 'label', 'Values transmission reflection', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'community_stewardship', 'label', 'Community stewardship', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'environmental_stewardship', 'label', 'Environmental stewardship themes'),
      jsonb_build_object('key', 'hope_and_resilience', 'label', 'Hope and resilience', 'cross_link', '/app/hope-engine'),
      jsonb_build_object('key', 'intergenerational_learning', 'label', 'Intergenerational learning', 'cross_link', '/app/civilizational-learning-engine')
    )
  );
$$;

create or replace function public._ighcebp172_executive_guardianship_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive guardianship reviews — five stewardship reflection themes.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'future_stewardship', 'label', 'Future stewardship themes'),
      jsonb_build_object('key', 'values_continuity_handoff', 'label', 'Values continuity handoff'),
      jsonb_build_object('key', 'intergenerational_responsibility', 'label', 'Intergenerational responsibility'),
      jsonb_build_object('key', 'legacy_resilience_readiness', 'label', 'Legacy resilience readiness'),
      jsonb_build_object('key', 'leadership_guardianship', 'label', 'Leadership guardianship reflection')
    )
  );
$$;

create or replace function public._ighcebp172_guardianship_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Guardianship Companion — reflection prompts and continuity awareness. Does NOT define values or determine priorities.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'continuity_reflection_prompts', 'label', 'Continuity reflection prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'guardianship_briefings', 'label', 'Guardianship briefings — informational only'),
      jsonb_build_object('key', 'legacy_resilience_summaries', 'label', 'Legacy resilience summaries — metadata only'),
      jsonb_build_object('key', 'values_preservation_awareness', 'label', 'Values preservation awareness — humans define values'),
      jsonb_build_object('key', 'intergenerational_knowledge', 'label', 'Intergenerational knowledge recommendations'),
      jsonb_build_object('key', 'stewardship_summaries', 'label', 'Stewardship summaries — aggregate themes only')
    )
  );
$$;

create or replace function public._ighcebp172_values_preservation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Values preservation engine — six core human values for continuity reflection. Humans define organizational values; Companion supports awareness only.',
    'values', jsonb_build_array(
      jsonb_build_object('key', 'dignity', 'label', 'Dignity'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
      jsonb_build_object('key', 'integrity', 'label', 'Integrity'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity'),
      jsonb_build_object('key', 'service', 'label', 'Service'),
      jsonb_build_object('key', 'stewardship', 'label', 'Stewardship')
    )
  );
$$;

create or replace function public._ighcebp172_legacy_resilience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Legacy resilience engine — six practices for intergenerational continuity.',
    'practices', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'mentorship_continuity', 'label', 'Mentorship continuity', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'institutional_memory', 'label', 'Institutional memory bridge', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'cultural_continuity', 'label', 'Cultural continuity practices'),
      jsonb_build_object('key', 'hope_cultivation', 'label', 'Hope cultivation', 'cross_link', '/app/hope-engine'),
      jsonb_build_object('key', 'legacy_reflection', 'label', 'Legacy reflection', 'cross_link', '/app/legacy-engine')
    )
  );
$$;

create or replace function public._ighcebp172_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_not', jsonb_build_array(
      'Define organizational values',
      'Determine future priorities',
      'Assert ownership or control',
      'Replace human leadership',
      'Suppress dissent about stewardship',
      'Rank leaders by guardianship scores'
    ),
    'principle', 'Guardianship Companion supports reflection — humans define values and decide priorities.'
  );
$$;

create or replace function public._ighcebp172_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — dignity, compassion, humility, patience, and stewardship in guardianship reflection.',
    'values', jsonb_build_array(
      'dignity', 'compassion', 'humility', 'patience', 'stewardship', 'hope'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._ighcebp172_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'guardianship_audit_logs', 'label', 'Guardianship audit logs via intergenerational_guardianship_audit_logs'),
      jsonb_build_object('key', 'leadership_participation_histories', 'label', 'Leadership participation histories — metadata only'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via intergenerational_guardianship permissions'),
      jsonb_build_object('key', 'continuity_documentation_protections', 'label', 'Continuity documentation protections'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._ighcebp172_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 171, 'key', 'multi_generational_futures', 'label', 'Multi-Generational Futures Phase 171', 'route', '/app/multi-generational-futures-engine', 'relationship', 'Era companion — cross-link only'),
    jsonb_build_object('phase', 170, 'key', 'human_flourishing', 'label', 'Human Flourishing Phase 170', 'route', '/app/human-flourishing-engine', 'relationship', 'Prior era capstone — cross-link only'),
    jsonb_build_object('phase', 169, 'key', 'social_cohesion', 'label', 'Social Cohesion Phase 169', 'route', '/app/social-cohesion-engine', 'relationship', 'Trust continuity — cross-link only'),
    jsonb_build_object('phase', 168, 'key', 'constructive_dialogue', 'label', 'Constructive Dialogue Phase 168', 'route', '/app/constructive-dialogue-engine', 'relationship', 'Dialogue for continuity — cross-link only'),
    jsonb_build_object('phase', 167, 'key', 'shared_prosperity', 'label', 'Shared Prosperity Phase 167', 'route', '/app/shared-prosperity-engine', 'relationship', 'Prosperity stewardship — cross-link only'),
    jsonb_build_object('phase', 166, 'key', 'civilizational_coordination', 'label', 'Civilizational Coordination Phase 166', 'route', '/app/civilizational-coordination-engine', 'relationship', 'Shared action — cross-link only'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'relationship', 'Long-horizon foresight — cross-link only'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'relationship', 'Intergenerational learning — cross-link only'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'relationship', 'Knowledge preservation — cross-link only'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'relationship', 'Societal resilience — cross-link only'),
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'relationship', 'Community stewardship — cross-link only'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Leadership succession — cross-link only'),
    jsonb_build_object('key', 'legacy_a86', 'label', 'Legacy Engine A.86', 'route', '/app/legacy-engine', 'relationship', 'Legacy reflection — cross-link only'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory', 'route', '/app/organizational-memory-engine', 'relationship', 'Institutional memory — cross-link only'),
    jsonb_build_object('key', 'hope_engine', 'label', 'Hope Engine A.92', 'route', '/app/hope-engine', 'relationship', 'Hope and resilience — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Dignity and compassion in guardianship'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82', 'route', '/app/purpose-values-engine', 'relationship', 'Values continuity — humans define values')
  );
$$;

create or replace function public._ighcebp172_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Guardianship Center internally with metadata-only executive review summaries, continuity reflection scaffolds, and legacy resilience entries. Growth Partner terminology throughout. Companion does NOT define values or determine priorities.';
$$;

create or replace function public._ighcebp172_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Stewardship through responsibility — not ownership control.',
    'People First — present generations serve the future.',
    'Humans define values — Companion supports reflection.',
    'Legacy resilience built with humility.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._ighcebp172_privacy_note()
returns text language sql immutable as $$
  select 'Intergenerational Guardianship metadata only — review summaries max ~500 chars, continuity reflection aggregates, legacy resilience scaffolds. No PII surveillance, guardianship scores, or value definition by Companion.';
$$;

create or replace function public._ighcebp172_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ighce_ensure_settings(p_org_id);
  perform public._ighce_seed_scaffolds(p_org_id);
  v_metrics := public._ighce_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'guardianship_score', coalesce((v_metrics->>'guardianship_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'guardianship_mode', coalesce(v_metrics->>'guardianship_mode', 'guided'),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'continuity_reflections_count', coalesce((v_metrics->>'continuity_reflections_count')::int, 0),
    'legacy_entries_count', coalesce((v_metrics->>'legacy_entries_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._ighcebp172_integration_links()),
    'privacy_note', public._ighcebp172_privacy_note(),
    'not_ownership_control', true,
    'companion_does_not_define_values', true
  );
end; $$;

create or replace function public._ighcebp172_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ighce_ensure_settings(p_org_id);
  perform public._ighce_seed_scaffolds(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'guardianship_center', 'label', 'Guardianship Center — eight capabilities', 'met', jsonb_array_length(public._ighcebp172_guardianship_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'human_continuity_engine', 'label', 'Human continuity engine — five reflection questions', 'met', jsonb_array_length(public._ighcebp172_human_continuity_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'intergenerational_responsibility_framework', 'label', 'Intergenerational responsibility — seven domains', 'met', jsonb_array_length(public._ighcebp172_intergenerational_responsibility_framework()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'executive_guardianship_reviews', 'label', 'Executive guardianship reviews — five themes', 'met', jsonb_array_length(public._ighcebp172_executive_guardianship_reviews()->'review_themes') = 5, 'note', null),
    jsonb_build_object('key', 'guardianship_companion', 'label', 'Guardianship Companion — six capabilities', 'met', jsonb_array_length(public._ighcebp172_guardianship_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'values_preservation_engine', 'label', 'Values preservation engine — six values', 'met', jsonb_array_length(public._ighcebp172_values_preservation_engine()->'values') = 6, 'note', null),
    jsonb_build_object('key', 'legacy_resilience_engine', 'label', 'Legacy resilience engine — six practices', 'met', jsonb_array_length(public._ighcebp172_legacy_resilience_engine()->'practices') = 6, 'note', null),
    jsonb_build_object('key', 'legacy_entries_seeded', 'label', 'Legacy resilience entries seeded (8 types)', 'met', (select count(*) >= 8 from public.intergenerational_guardianship_legacy_entries e where e.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._ighcebp172_companion_limitations()->'must_not') >= 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._ighcebp172_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — seventeen cross-links', 'met', jsonb_array_length(public._ighcebp172_integration_links()) = 17, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 172 baseline tables and RPCs', 'met', to_regclass('public.intergenerational_guardianship_settings') is not null, 'note', '_ighce_* helpers intact')
  );
end; $$;

create or replace function public._ighcebp172_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 172 — Intergenerational Guardianship & Human Continuity Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE172_INTERGENERATIONAL_GUARDIANSHIP_HUMAN_CONTINUITY.md',
    'engine_phase', 'Repo Phase 172 Intergenerational Guardianship Engine',
    'route', '/app/intergenerational-guardianship-engine',
    'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — guardianship not control.',
    'distinction_note', public._ighcebp172_distinction_note(),
    'mission', public._ighcebp172_mission(),
    'philosophy', public._ighcebp172_philosophy(),
    'abos_principle', public._ighcebp172_abos_principle(),
    'vision', public._ighcebp172_vision(),
    'objectives', public._ighcebp172_objectives(),
    'guardianship_center', public._ighcebp172_guardianship_center(),
    'human_continuity_engine', public._ighcebp172_human_continuity_engine(),
    'intergenerational_responsibility_framework', public._ighcebp172_intergenerational_responsibility_framework(),
    'executive_guardianship_reviews', public._ighcebp172_executive_guardianship_reviews(),
    'guardianship_companion', public._ighcebp172_guardianship_companion(),
    'values_preservation_engine', public._ighcebp172_values_preservation_engine(),
    'legacy_resilience_engine', public._ighcebp172_legacy_resilience_engine(),
    'companion_limitations', public._ighcebp172_companion_limitations(),
    'self_love_connection', public._ighcebp172_self_love_connection(),
    'security_requirements', public._ighcebp172_security_requirements(),
    'integration_links', public._ighcebp172_integration_links(),
    'dogfooding', public._ighcebp172_dogfooding(),
    'success_criteria', public._ighcebp172_success_criteria(p_org_id),
    'engagement_summary', public._ighcebp172_engagement_summary(p_org_id),
    'vision_phrases', public._ighcebp172_vision_phrases(),
    'privacy_note', public._ighcebp172_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_guardianship_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.intergenerational_guardianship_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ighce_require_tenant());
  v_settings := public._ighce_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Guardianship Center must be enabled'; end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.intergenerational_guardianship_reviews (
    tenant_id, review_key, review_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ighce_log_audit(v_tenant_id, 'executive_guardianship_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_values_continuity_reflection(
  p_reflection_type text,
  p_title text,
  p_reflection_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ighce_require_tenant());
  perform public._ighce_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.intergenerational_guardianship_reflections (
    tenant_id, reflection_key, reflection_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ighce_log_audit(v_tenant_id, 'values_continuity_reflection_recorded', left(p_title, 120),
    jsonb_build_object('reflection_id', v_id, 'reflection_type', p_reflection_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_intergenerational_guardianship_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.intergenerational_guardianship_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ighce_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ighce_ensure_settings(v_tenant_id);
  perform public._ighce_seed_scaffolds(v_tenant_id);
  v_metrics := public._ighce_refresh_metrics(v_tenant_id);
  v_engagement := public._ighcebp172_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'guardianship_score', v_metrics->'guardianship_score',
    'enabled', v_settings.enabled,
    'guardianship_mode', v_settings.guardianship_mode,
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'philosophy', public._ighcebp172_philosophy(),
    'continuity_reflection_enabled', v_settings.continuity_reflection_enabled,
    'values_preservation_enabled', v_settings.values_preservation_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 172 — Intergenerational Guardianship & Human Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE172_INTERGENERATIONAL_GUARDIANSHIP_HUMAN_CONTINUITY.md',
      'engine_phase', 'Repo Phase 172 Intergenerational Guardianship Engine',
      'route', '/app/intergenerational-guardianship-engine',
      'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener.'
    ),
    'intergenerational_guardianship_mission', public._ighcebp172_mission(),
    'intergenerational_guardianship_abos_principle', public._ighcebp172_abos_principle(),
    'intergenerational_guardianship_engagement_summary', v_engagement,
    'intergenerational_guardianship_note', public._ighcebp172_distinction_note(),
    'intergenerational_guardianship_vision_note', public._ighcebp172_vision()
  );
end; $$;

create or replace function public.get_intergenerational_guardianship_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.intergenerational_guardianship_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ighce_require_tenant());
  v_settings := public._ighce_ensure_settings(v_tenant_id);
  perform public._ighce_seed_scaffolds(v_tenant_id);
  v_metrics := public._ighce_refresh_metrics(v_tenant_id);
  perform public._ighce_log_audit(v_tenant_id, 'dashboard_view', 'Intergenerational Guardianship dashboard viewed',
    jsonb_build_object('guardianship_score', v_metrics->>'guardianship_score', 'guardianship_mode', v_settings.guardianship_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'guardianship_mode', v_settings.guardianship_mode,
    'continuity_reflection_enabled', v_settings.continuity_reflection_enabled,
    'values_preservation_enabled', v_settings.values_preservation_enabled,
    'legacy_resilience_enabled', v_settings.legacy_resilience_enabled,
    'executive_reviews_enabled', v_settings.executive_reviews_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'philosophy', public._ighcebp172_philosophy(),
    'safety_note', 'Guardianship Center — metadata scaffolds only. Stewardship reflection — NOT ownership control or value definition by Companion.',
    'distinction_note', public._ighcebp172_distinction_note(),
    'guardianship_score', v_metrics->'guardianship_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'continuity_reflections_count', v_metrics->'continuity_reflections_count',
    'legacy_entries_count', v_metrics->'legacy_entries_count',
    'executive_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.intergenerational_guardianship_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'continuity_reflections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'reflection_key', b.reflection_key, 'reflection_type', b.reflection_type,
        'title', b.title, 'reflection_summary', b.reflection_summary, 'status', b.status,
        'created_at', b.created_at
      ) order by b.created_at desc)
      from public.intergenerational_guardianship_reflections b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'legacy_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'entry_key', l.entry_key, 'entry_type', l.entry_type,
        'title', l.title, 'summary', l.summary, 'status', l.status, 'created_at', l.created_at
      ) order by l.created_at)
      from public.intergenerational_guardianship_legacy_entries l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._ighcebp172_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 172 — Intergenerational Guardianship & Human Continuity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE172_INTERGENERATIONAL_GUARDIANSHIP_HUMAN_CONTINUITY.md',
      'engine_phase', 'Repo Phase 172 Intergenerational Guardianship Engine',
      'route', '/app/intergenerational-guardianship-engine',
      'mapping_note', 'Cosmic Stewardship era opener — humans define values; Companion supports reflection.'
    ),
    'intergenerational_guardianship_engine_note', 'Intergenerational Guardianship Engine (ABOS Phase 172) — era opener. Cross-link Phase 171, Phases 161–170, Future Leaders 151, Legacy A.86 — do NOT duplicate RPCs.',
    'intergenerational_guardianship_blueprint', public._ighcebp172_blueprint_block(v_tenant_id),
    'intergenerational_guardianship_distinction_note', public._ighcebp172_distinction_note(),
    'intergenerational_guardianship_mission', public._ighcebp172_mission(),
    'intergenerational_guardianship_philosophy', public._ighcebp172_philosophy(),
    'intergenerational_guardianship_abos_principle', public._ighcebp172_abos_principle(),
    'intergenerational_guardianship_objectives', public._ighcebp172_objectives(),
    'guardianship_center_meta', public._ighcebp172_guardianship_center(),
    'human_continuity_engine_meta', public._ighcebp172_human_continuity_engine(),
    'intergenerational_responsibility_framework_meta', public._ighcebp172_intergenerational_responsibility_framework(),
    'executive_guardianship_reviews_meta', public._ighcebp172_executive_guardianship_reviews(),
    'guardianship_companion_meta', public._ighcebp172_guardianship_companion(),
    'values_preservation_engine_meta', public._ighcebp172_values_preservation_engine(),
    'legacy_resilience_engine_meta', public._ighcebp172_legacy_resilience_engine(),
    'companion_limitations_meta', public._ighcebp172_companion_limitations(),
    'self_love_connection_meta', public._ighcebp172_self_love_connection(),
    'security_requirements_meta', public._ighcebp172_security_requirements(),
    'ighcebp172_integration_links', public._ighcebp172_integration_links(),
    'intergenerational_guardianship_engagement_summary', public._ighcebp172_engagement_summary(v_tenant_id),
    'intergenerational_guardianship_success_criteria', public._ighcebp172_success_criteria(v_tenant_id),
    'intergenerational_guardianship_vision', public._ighcebp172_vision(),
    'intergenerational_guardianship_vision_phrases', public._ighcebp172_vision_phrases(),
    'intergenerational_guardianship_privacy_note', public._ighcebp172_privacy_note(),
    'intergenerational_guardianship_dogfooding', public._ighcebp172_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'intergenerational-guardianship-engine', 'Intergenerational Guardianship Engine',
  'Cosmic Stewardship & Multi-Generational Futures Era (171–180) opener — intergenerational guardianship and human continuity. People First.',
  'authenticated', 182
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'intergenerational-guardianship-engine' and tenant_id is null
);

grant execute on function public.get_intergenerational_guardianship_engine_card(uuid) to authenticated;
grant execute on function public.get_intergenerational_guardianship_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_guardianship_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_values_continuity_reflection(text, text, text, uuid) to authenticated;
grant execute on function public._ighcebp172_distinction_note() to authenticated;
grant execute on function public._ighcebp172_mission() to authenticated;
grant execute on function public._ighcebp172_philosophy() to authenticated;
grant execute on function public._ighcebp172_abos_principle() to authenticated;
grant execute on function public._ighcebp172_vision() to authenticated;
grant execute on function public._ighcebp172_objectives() to authenticated;
grant execute on function public._ighcebp172_guardianship_center() to authenticated;
grant execute on function public._ighcebp172_human_continuity_engine() to authenticated;
grant execute on function public._ighcebp172_intergenerational_responsibility_framework() to authenticated;
grant execute on function public._ighcebp172_executive_guardianship_reviews() to authenticated;
grant execute on function public._ighcebp172_guardianship_companion() to authenticated;
grant execute on function public._ighcebp172_values_preservation_engine() to authenticated;
grant execute on function public._ighcebp172_legacy_resilience_engine() to authenticated;
grant execute on function public._ighcebp172_companion_limitations() to authenticated;
grant execute on function public._ighcebp172_self_love_connection() to authenticated;
grant execute on function public._ighcebp172_security_requirements() to authenticated;
grant execute on function public._ighcebp172_integration_links() to authenticated;
grant execute on function public._ighcebp172_dogfooding() to authenticated;
grant execute on function public._ighcebp172_vision_phrases() to authenticated;
grant execute on function public._ighcebp172_privacy_note() to authenticated;
grant execute on function public._ighcebp172_engagement_summary(uuid) to authenticated;
grant execute on function public._ighcebp172_success_criteria(uuid) to authenticated;
