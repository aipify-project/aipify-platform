-- Phase 173 — Human Identity & Meaning Preservation Engine
-- Cosmic Stewardship & Multi-Generational Futures Era (171–180) — Meaning & Identity Center.
-- Supports meaning discovery — NOT defining identity, purpose, productivity-based worth, or imposing identity.
-- Distinct from Identity Engine AIE Phase 34 (/app/assistant/identity — _aie_* cross-link only).
-- Helpers: _himp_* (engine), _himpbp173_* (blueprint — never collide with _cfhpbp170_*, _aie_*)

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
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. human_identity_meaning_settings
-- ---------------------------------------------------------------------------
create table if not exists public.human_identity_meaning_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  meaning_readiness_level int not null default 1 check (meaning_readiness_level between 1 and 5),
  discovery_mode text not null default 'guided' check (
    discovery_mode in ('guided', 'community_led', 'executive_sponsored')
  ),
  purpose_reflection_enabled boolean not null default true,
  belonging_reflection_enabled boolean not null default true,
  agency_preservation_enabled boolean not null default true,
  identity_discovery_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  discovery_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_worth_scoring":true,"not_surveillance":true,"not_define_identity":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.human_identity_meaning_settings enable row level security;
revoke all on public.human_identity_meaning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. human_identity_meaning_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.human_identity_meaning_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'dignity_preservation', 'meaning_discovery_support', 'belonging_cultivation',
      'agency_respect', 'identity_humility'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  readiness_signal text not null default 'stable' check (
    readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true,"not_worth_scoring":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists human_identity_meaning_reviews_tenant_idx
  on public.human_identity_meaning_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.human_identity_meaning_reviews enable row level security;
revoke all on public.human_identity_meaning_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. human_identity_meaning_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.human_identity_meaning_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (
    reflection_type in (
      'purpose_exploration', 'belonging_themes', 'values_alignment',
      'identity_discovery', 'meaning_journey', 'community_belonging',
      'cultural_heritage', 'legacy_reflection'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);

create index if not exists human_identity_meaning_reflections_tenant_idx
  on public.human_identity_meaning_reflections (tenant_id, reflection_type, status);

alter table public.human_identity_meaning_reflections enable row level security;
revoke all on public.human_identity_meaning_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. human_identity_meaning_agency_notes
-- ---------------------------------------------------------------------------
create table if not exists public.human_identity_meaning_agency_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (
    note_type in (
      'autonomy_preservation', 'choice_respect', 'responsibility_honoring',
      'creative_contribution', 'critical_thinking', 'leadership_development',
      'agency_dignity', 'self_direction'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"agency_not_worth_scoring":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);

create index if not exists human_identity_meaning_agency_notes_tenant_idx
  on public.human_identity_meaning_agency_notes (tenant_id, note_type, status);

alter table public.human_identity_meaning_agency_notes enable row level security;
revoke all on public.human_identity_meaning_agency_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. human_identity_meaning_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.human_identity_meaning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.human_identity_meaning_audit_logs enable row level security;
revoke all on public.human_identity_meaning_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'human_identity_meaning_engine', v.description
from (values
  ('human_identity_meaning.view', 'View Meaning & Identity Center', 'View executive humanity reviews, meaning reflections, agency notes, and discovery metadata'),
  ('human_identity_meaning.manage', 'Manage Meaning & Identity Center', 'Update meaning preservation settings, discovery programs, and governance preferences'),
  ('human_identity_meaning.steward', 'Steward Meaning & Identity Center', 'Conduct executive humanity reviews and record meaning or agency metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'human_identity_meaning.view'), ('owner', 'human_identity_meaning.manage'), ('owner', 'human_identity_meaning.steward'),
  ('administrator', 'human_identity_meaning.view'), ('administrator', 'human_identity_meaning.manage'), ('administrator', 'human_identity_meaning.steward'),
  ('manager', 'human_identity_meaning.view'), ('manager', 'human_identity_meaning.steward'),
  ('employee', 'human_identity_meaning.view'),
  ('support_agent', 'human_identity_meaning.view'),
  ('moderator', 'human_identity_meaning.view'),
  ('viewer', 'human_identity_meaning.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_himp_*)
-- ---------------------------------------------------------------------------
create or replace function public._himp_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._himp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._himp_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._himp_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.human_identity_meaning_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._himp_ensure_settings(p_tenant_id uuid)
returns public.human_identity_meaning_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.human_identity_meaning_settings;
begin
  insert into public.human_identity_meaning_settings (tenant_id, enabled, discovery_mode)
  values (p_tenant_id, true, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.human_identity_meaning_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._himp_seed_reflections(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.human_identity_meaning_reflections where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.human_identity_meaning_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values
    (p_tenant_id, 'purpose-exploration', 'purpose_exploration', 'Purpose Exploration Themes', 'Aggregate purpose exploration metadata — cross-link Purpose & Values A.82. Does NOT define purpose.', 'draft'),
    (p_tenant_id, 'belonging-themes', 'belonging_themes', 'Belonging & Connection Themes', 'Belonging reflection aggregates — not surveillance. Cross-link Inclusion A.83.', 'draft'),
    (p_tenant_id, 'values-alignment', 'values_alignment', 'Values Alignment Reflection', 'Organizational values alignment themes — humans define values.', 'draft'),
    (p_tenant_id, 'identity-discovery', 'identity_discovery', 'Identity Discovery Scaffolds', 'Discovery support metadata — does NOT define personal identity.', 'draft'),
    (p_tenant_id, 'meaning-journey', 'meaning_journey', 'Meaning Journey Reflection', 'Meaning discovery journey themes — companion supports, never imposes.', 'draft'),
    (p_tenant_id, 'community-belonging', 'community_belonging', 'Community Belonging Themes', 'Community connection aggregates — cross-link Social Cohesion 169.', 'draft'),
    (p_tenant_id, 'cultural-heritage', 'cultural_heritage', 'Cultural Heritage Reflection', 'Cultural identity themes with dignity — aggregate metadata only.', 'draft'),
    (p_tenant_id, 'legacy-reflection', 'legacy_reflection', 'Legacy & Continuity Reflection', 'Multi-generational meaning themes — cross-link Phases 171–172.', 'draft');
end; $$;

create or replace function public._himp_seed_agency_notes(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.human_identity_meaning_agency_notes where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.human_identity_meaning_agency_notes (tenant_id, note_key, note_type, title, summary, status) values
    (p_tenant_id, 'autonomy-preservation', 'autonomy_preservation', 'Autonomy Preservation', 'Agency protection metadata — autonomy honored, never overridden by Companion.', 'draft'),
    (p_tenant_id, 'choice-respect', 'choice_respect', 'Choice & Consent Respect', 'Choice preservation scaffolds — humans decide; Aipify informs.', 'draft'),
    (p_tenant_id, 'responsibility-honoring', 'responsibility_honoring', 'Responsibility Honoring', 'Accountability themes without worth scoring — leadership decides.', 'draft'),
    (p_tenant_id, 'creative-contribution', 'creative_contribution', 'Creative Contribution Access', 'Creative agency metadata — nurture contribution, not rank output.', 'draft'),
    (p_tenant_id, 'critical-thinking', 'critical_thinking', 'Critical Thinking Protection', 'Intellectual agency scaffolds — question-friendly culture themes.', 'draft'),
    (p_tenant_id, 'leadership-development', 'leadership_development', 'Leadership Development Agency', 'Leadership agency access — cross-link Future Leaders 151.', 'draft'),
    (p_tenant_id, 'agency-dignity', 'agency_dignity', 'Agency & Dignity Preservation', 'Dignity-first agency metadata — no productivity worth scoring.', 'draft'),
    (p_tenant_id, 'self-direction', 'self_direction', 'Self-Direction Support', 'Self-directed discovery themes — cross-link Self Love A.76.', 'draft');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_himpbp173_*)
-- ---------------------------------------------------------------------------
create or replace function public._himpbp173_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 173 — Human Identity & Meaning Preservation Engine at /app/human-identity-meaning-engine. Cosmic Stewardship & Multi-Generational Futures Era (171–180) — Meaning & Identity Center. Supports meaning discovery — NOT defining identity, purpose, productivity-based worth, or imposing identity. Distinct from Identity Engine AIE Phase 34 at /app/assistant/identity (_aie_* cross-link only). Distinct from Human Flourishing Phase 170 at /app/human-flourishing-engine (_cfhpbp170_* cross-link only). Helpers _himpbp173_* — never collide with _cfhpbp170_*, _aie_*. Growth Partner not Affiliate. Meaning Companion supports discovery — does NOT define identity.';
$$;

create or replace function public._himpbp173_mission()
returns text language sql immutable as $$
  select 'Help organizations preserve human dignity, support meaning discovery, and protect agency — without defining personal identity, assigning worth by productivity, or imposing purpose on individuals.';
$$;

create or replace function public._himpbp173_philosophy()
returns text language sql immutable as $$
  select 'People First. Meaning emerges through human discovery — technology supports reflection, never imposes identity. Companion supports discovery; it does NOT define who someone is. Growth Partner terminology — never Affiliate. Aggregate metadata only — not surveillance.';
$$;

create or replace function public._himpbp173_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Meaning & Identity Center aggregates discovery visibility across the Cosmic Stewardship & Multi-Generational Futures Era (171–180). Era engines 171–172, Human Flourishing 170, Social Cohesion 169, Purpose A.82, Inclusion A.83, Self Love A.76, and Identity Engine AIE Phase 34 remain authoritative for their domains. Aipify informs and prepares; humans define identity and leadership decides.';
$$;

create or replace function public._himpbp173_vision()
returns text language sql immutable as $$
  select 'Organizations where people discover meaning, preserve agency, and feel belonging — technology honoring dignity, supporting reflection, and protecting human self-determination across generations.';
$$;

create or replace function public._himpbp173_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'meaning_discovery_programs', 'label', 'Meaning discovery programs', 'emoji', '🧭', 'description', 'Guided discovery scaffolds — not identity definition'),
    jsonb_build_object('key', 'identity_humility', 'label', 'Identity humility practices', 'emoji', '🪞', 'description', 'Respect for self-defined identity — cross-link AIE Phase 34'),
    jsonb_build_object('key', 'belonging_reflection', 'label', 'Belonging reflection', 'emoji', '🤝', 'description', 'Aggregate belonging themes — not surveillance'),
    jsonb_build_object('key', 'companion_discovery', 'label', 'Companion discovery support', 'emoji', '✨', 'description', 'Meaning Companion — does NOT define identity'),
    jsonb_build_object('key', 'agency_preservation', 'label', 'Agency preservation dashboards', 'emoji', '🛡️', 'description', 'Autonomy and choice protection metadata'),
    jsonb_build_object('key', 'purpose_exploration', 'label', 'Purpose exploration', 'emoji', '🌱', 'description', 'Purpose themes — cross-link Purpose A.82'),
    jsonb_build_object('key', 'multi_generational_meaning', 'label', 'Multi-generational meaning', 'emoji', '🌍', 'description', 'Intergenerational meaning themes — cross-link Phases 171–172'),
    jsonb_build_object('key', 'meaning_libraries', 'label', 'Meaning knowledge libraries', 'emoji', '📖', 'description', 'Discovery resources and reflection libraries')
  );
$$;

create or replace function public._himpbp173_meaning_identity_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meaning & Identity Center — eight capabilities. Discovery support — not identity definition.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'meaning_discovery_programs', 'label', 'Meaning discovery programs'),
      jsonb_build_object('key', 'identity_humility_practices', 'label', 'Identity humility practices', 'cross_link', '/app/assistant/identity'),
      jsonb_build_object('key', 'belonging_reflection_reviews', 'label', 'Belonging reflection reviews', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'companion_discovery_prompts', 'label', 'Companion discovery prompts'),
      jsonb_build_object('key', 'agency_preservation_dashboards', 'label', 'Agency preservation dashboards'),
      jsonb_build_object('key', 'purpose_exploration_themes', 'label', 'Purpose exploration themes', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'multi_generational_meaning', 'label', 'Multi-generational meaning', 'cross_link', '/app/multi-generational-futures-engine'),
      jsonb_build_object('key', 'meaning_knowledge_libraries', 'label', 'Meaning knowledge libraries', 'cross_link', '/app/intergenerational-guardianship-engine')
    )
  );
$$;

create or replace function public._himpbp173_human_identity_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human identity engine — five reflection questions for meaning discovery. Does NOT define identity.',
    'reflection_questions', jsonb_build_array(
      jsonb_build_object('key', 'who_am_i_becoming', 'label', 'Who am I becoming? — self-directed, not Companion-defined'),
      jsonb_build_object('key', 'what_gives_meaning', 'label', 'What gives my work meaning? — exploration not assignment'),
      jsonb_build_object('key', 'where_do_i_belong', 'label', 'Where do I belong? — aggregate themes, not surveillance'),
      jsonb_build_object('key', 'how_is_agency_preserved', 'label', 'How is my agency preserved? — autonomy and choice'),
      jsonb_build_object('key', 'what_legacy_matters', 'label', 'What legacy matters to me? — cross-link Phases 171–172')
    )
  );
$$;

create or replace function public._himpbp173_meaning_preservation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meaning preservation framework — seven domains for dignity-centered discovery.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'identity_humility', 'label', 'Identity humility', 'cross_link', '/app/assistant/identity'),
      jsonb_build_object('key', 'meaning_discovery', 'label', 'Meaning discovery'),
      jsonb_build_object('key', 'belonging', 'label', 'Belonging', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'agency_preservation', 'label', 'Agency preservation'),
      jsonb_build_object('key', 'purpose_exploration', 'label', 'Purpose exploration', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'multi_generational_futures', 'label', 'Multi-generational futures', 'cross_link', '/app/multi-generational-futures-engine'),
      jsonb_build_object('key', 'intergenerational_guardianship', 'label', 'Intergenerational guardianship', 'cross_link', '/app/intergenerational-guardianship-engine')
    )
  );
$$;

create or replace function public._himpbp173_executive_humanity_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive humanity reviews — leadership reflection on dignity, meaning, belonging, agency, and identity humility.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'dignity_preservation', 'label', 'Are we preserving human dignity? — aggregate themes'),
      jsonb_build_object('key', 'meaning_discovery_support', 'label', 'How do we support meaning discovery?'),
      jsonb_build_object('key', 'belonging_cultivation', 'label', 'How can we cultivate belonging?', 'cross_link', '/app/social-cohesion-engine'),
      jsonb_build_object('key', 'agency_respect', 'label', 'How do we respect agency and choice?'),
      jsonb_build_object('key', 'identity_humility', 'label', 'Are we practicing identity humility?', 'cross_link', '/app/assistant/identity')
    )
  );
$$;

create or replace function public._himpbp173_meaning_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meaning Companion — discovery and reflection support. Does NOT define identity.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'discovery_prompts', 'label', 'Discovery prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'meaning_reflection', 'label', 'Meaning reflection scaffolds'),
      jsonb_build_object('key', 'belonging_summaries', 'label', 'Belonging summaries — aggregate not surveillance'),
      jsonb_build_object('key', 'agency_awareness', 'label', 'Agency awareness insights — informational only'),
      jsonb_build_object('key', 'purpose_exploration', 'label', 'Purpose exploration links', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'discovery_resources', 'label', 'Discovery resources')
    )
  );
$$;

create or replace function public._himpbp173_belonging_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Belonging engine — connection, inclusion, community, and cultural dignity — aggregates NOT surveillance.',
    'characteristics', jsonb_build_array(
      jsonb_build_object('key', 'inclusive_belonging', 'label', 'Inclusive belonging themes', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'community_connection', 'label', 'Community connection', 'cross_link', '/app/social-cohesion-engine'),
      jsonb_build_object('key', 'cultural_dignity', 'label', 'Cultural dignity respect'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety themes'),
      jsonb_build_object('key', 'cross_generational_belonging', 'label', 'Cross-generational belonging'),
      jsonb_build_object('key', 'gp_community', 'label', 'Growth Partner community', 'cross_link', '/app/growth-partner-operations')
    )
  );
$$;

create or replace function public._himpbp173_agency_preservation_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Agency preservation engine — six protections for human self-determination. No worth scoring.',
    'protections', jsonb_build_array(
      jsonb_build_object('key', 'autonomy', 'label', 'Autonomy — self-direction honored'),
      jsonb_build_object('key', 'choice', 'label', 'Choice — consent and opt-out respected'),
      jsonb_build_object('key', 'responsibility', 'label', 'Responsibility — accountability without productivity worth'),
      jsonb_build_object('key', 'creative_contribution', 'label', 'Creative contribution — nurture not rank'),
      jsonb_build_object('key', 'critical_thinking', 'label', 'Critical thinking — question-friendly culture'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'cross_link', '/app/future-leaders-engine')
    )
  );
$$;

create or replace function public._himpbp173_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Define personal identity',
      'Impose purpose or meaning',
      'Assign worth by productivity',
      'Replace human relationships',
      'Suppress individuality or cultural identity',
      'Override leadership judgment on humanity matters'
    ),
    'principle', 'Meaning Companion supports discovery — humans define identity and leadership decides organizational humanity priorities.'
  );
$$;

create or replace function public._himpbp173_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — self-awareness, compassion, dignity, curiosity, balance, and self-directed growth.',
    'values', jsonb_build_array(
      'self_awareness', 'compassion', 'dignity', 'curiosity', 'balance', 'self_directed_growth'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._himpbp173_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'humanity_review_audit_logs', 'label', 'Humanity review audit logs via human_identity_meaning_audit_logs'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via human_identity_meaning permissions'),
      jsonb_build_object('key', 'discovery_privacy_controls', 'label', 'Discovery privacy controls — metadata only'),
      jsonb_build_object('key', 'identity_humility_governance', 'label', 'Identity humility governance — distinct from AIE Phase 34'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._himpbp173_era_opener_summary()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 171, 'key', 'multi_generational_futures', 'label', 'Multi-Generational Futures Phase 171', 'route', '/app/multi-generational-futures-engine', 'description', 'Era opener — long-horizon futures stewardship'),
    jsonb_build_object('phase', 172, 'key', 'intergenerational_guardianship', 'label', 'Intergenerational Guardianship Phase 172', 'route', '/app/intergenerational-guardianship-engine', 'description', 'Guardianship across generations'),
    jsonb_build_object('phase', 173, 'key', 'human_identity_meaning', 'label', 'Human Identity & Meaning Phase 173', 'route', '/app/human-identity-meaning-engine', 'description', 'Meaning & Identity Center — discovery not definition')
  );
$$;

create or replace function public._himpbp173_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 170, 'key', 'human_flourishing', 'label', 'Human Flourishing Phase 170', 'route', '/app/human-flourishing-engine', 'relationship', 'Prior era capstone — Civilizational Era (161–170) — cross-link only'),
    jsonb_build_object('phase', 169, 'key', 'social_cohesion', 'label', 'Social Cohesion Phase 169', 'route', '/app/social-cohesion-engine', 'relationship', 'Social cohesion and trust themes'),
    jsonb_build_object('key', 'identity_engine_aie', 'label', 'Identity Engine AIE Phase 34', 'route', '/app/assistant/identity', 'relationship', 'Communication style identity — distinct from meaning preservation'),
    jsonb_build_object('key', 'human_success', 'label', 'Human Success Engine', 'route', '/app/human-success', 'relationship', 'Human success themes — cross-link only'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82', 'route', '/app/purpose-values-engine', 'relationship', 'Purpose alignment — cross-link only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Inclusive belonging cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness, compassion, and dignity'),
    jsonb_build_object('key', 'assistant_memory', 'label', 'PAME Assistant Memory', 'route', '/app/assistant/memory', 'relationship', 'Personal memory — distinct storage')
  );
$$;

create or replace function public._himpbp173_integration_links()
returns jsonb language sql immutable as $$
  select public._himpbp173_era_opener_summary() || public._himpbp173_extended_cross_links();
$$;

create or replace function public._himpbp173_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Meaning & Identity Center internally with metadata-only executive humanity reviews, meaning reflection scaffolds, and agency preservation notes. Growth Partner terminology throughout. No identity definition, purpose imposition, or productivity-based worth scoring.';
$$;

create or replace function public._himpbp173_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Meaning through discovery — not imposition.',
    'People First — dignity preserved.',
    'Agency protected — worth never scored.',
    'Identity humility — humans define who they are.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._himpbp173_privacy_note()
returns text language sql immutable as $$
  select 'Human Identity & Meaning metadata only — executive humanity review summaries max ~500 chars, meaning reflection aggregates, agency preservation notes. No identity definition, purpose imposition, productivity-based worth scoring, PII surveillance, or employee ranking.';
$$;

create or replace function public._himpbp173_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._himp_ensure_settings(p_org_id);
  perform public._himp_seed_reflections(p_org_id);
  perform public._himp_seed_agency_notes(p_org_id);
  v_metrics := public._himp_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'human_identity_meaning_score', coalesce((v_metrics->>'human_identity_meaning_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'discovery_mode', coalesce(v_metrics->>'discovery_mode', 'guided'),
    'meaning_readiness_level', coalesce((v_metrics->>'meaning_readiness_level')::int, 1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'meaning_reflections_count', coalesce((v_metrics->>'meaning_reflections_count')::int, 0),
    'agency_notes_count', coalesce((v_metrics->>'agency_notes_count')::int, 0),
    'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int, 0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int, 0),
    'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int, 0),
    'privacy_note', public._himpbp173_privacy_note(),
    'not_worth_scoring', true
  );
end; $$;

create or replace function public._himpbp173_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._himp_ensure_settings(p_org_id);
  perform public._himp_seed_reflections(p_org_id);
  perform public._himp_seed_agency_notes(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'meaning_identity_center', 'label', 'Meaning & Identity Center — eight capabilities', 'met', jsonb_array_length(public._himpbp173_meaning_identity_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'human_identity_engine', 'label', 'Human identity engine — five reflection questions', 'met', jsonb_array_length(public._himpbp173_human_identity_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'meaning_preservation_framework', 'label', 'Meaning preservation framework — seven domains', 'met', jsonb_array_length(public._himpbp173_meaning_preservation_framework()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'executive_humanity_reviews', 'label', 'Executive humanity reviews — five themes', 'met', jsonb_array_length(public._himpbp173_executive_humanity_reviews()->'review_themes') = 5, 'note', null),
    jsonb_build_object('key', 'meaning_companion', 'label', 'Meaning Companion — six capabilities', 'met', jsonb_array_length(public._himpbp173_meaning_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'belonging_engine', 'label', 'Belonging engine — six characteristics', 'met', jsonb_array_length(public._himpbp173_belonging_engine()->'characteristics') = 6, 'note', null),
    jsonb_build_object('key', 'agency_preservation_engine', 'label', 'Agency preservation engine — six protections', 'met', jsonb_array_length(public._himpbp173_agency_preservation_engine()->'protections') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Meaning reflections — eight types seeded', 'met', (select count(*) >= 8 from public.human_identity_meaning_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'agency_notes_seeded', 'label', 'Agency notes — eight types seeded', 'met', (select count(*) >= 8 from public.human_identity_meaning_agency_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._himpbp173_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era_opener', 'label', 'Era 171–173 opener phases documented', 'met', jsonb_array_length(public._himpbp173_era_opener_summary()) = 3, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 173 baseline tables and RPCs', 'met', to_regclass('public.human_identity_meaning_settings') is not null, 'note', '_himp_* helpers intact')
  );
end; $$;

create or replace function public._himpbp173_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 173 — Human Identity & Meaning Preservation Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE173_HUMAN_IDENTITY_MEANING_PRESERVATION.md',
    'engine_phase', 'Repo Phase 173 Human Identity & Meaning Engine',
    'route', '/app/human-identity-meaning-engine',
    'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) — discovery not definition.',
    'distinction_note', public._himpbp173_distinction_note(),
    'mission', public._himpbp173_mission(),
    'philosophy', public._himpbp173_philosophy(),
    'abos_principle', public._himpbp173_abos_principle(),
    'vision', public._himpbp173_vision(),
    'objectives', public._himpbp173_objectives(),
    'meaning_identity_center', public._himpbp173_meaning_identity_center(),
    'human_identity_engine', public._himpbp173_human_identity_engine(),
    'meaning_preservation_framework', public._himpbp173_meaning_preservation_framework(),
    'executive_humanity_reviews', public._himpbp173_executive_humanity_reviews(),
    'meaning_companion', public._himpbp173_meaning_companion(),
    'belonging_engine', public._himpbp173_belonging_engine(),
    'agency_preservation_engine', public._himpbp173_agency_preservation_engine(),
    'companion_limitations', public._himpbp173_companion_limitations(),
    'self_love_connection', public._himpbp173_self_love_connection(),
    'security_requirements', public._himpbp173_security_requirements(),
    'era_opener_summary', public._himpbp173_era_opener_summary(),
    'integration_links', public._himpbp173_integration_links(),
    'dogfooding', public._himpbp173_dogfooding(),
    'success_criteria', public._himpbp173_success_criteria(p_org_id),
    'engagement_summary', public._himpbp173_engagement_summary(p_org_id),
    'vision_phrases', public._himpbp173_vision_phrases(),
    'privacy_note', public._himpbp173_privacy_note()
  );
$$;

create or replace function public._himp_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.human_identity_meaning_settings;
  v_reviews_count int;
  v_reflections_count int;
  v_agency_count int;
  v_active_reflections int;
  v_score numeric;
begin
  select * into v_settings from public.human_identity_meaning_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.human_identity_meaning_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections_count from public.human_identity_meaning_reflections where tenant_id = p_tenant_id;
  select count(*) into v_agency_count from public.human_identity_meaning_agency_notes where tenant_id = p_tenant_id;
  select count(*) into v_active_reflections from public.human_identity_meaning_reflections
    where tenant_id = p_tenant_id and status in ('draft', 'review');

  v_score := round(
    coalesce(v_settings.meaning_readiness_level, 1) * 10.0
    + case when coalesce(v_settings.purpose_reflection_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.belonging_reflection_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.agency_preservation_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.identity_discovery_enabled, false) then 8 else 0 end
    + least(v_reviews_count, 5) * 3.5
    + least(v_reflections_count, 8) * 2.0
    + least(v_agency_count, 8) * 2.0
    + least(v_active_reflections, 8) * 1.5,
    1
  );

  return jsonb_build_object(
    'human_identity_meaning_score', v_score,
    'enabled', coalesce(v_settings.enabled, false),
    'discovery_mode', coalesce(v_settings.discovery_mode, 'guided'),
    'meaning_readiness_level', coalesce(v_settings.meaning_readiness_level, 1),
    'executive_reviews_count', v_reviews_count,
    'meaning_reflections_count', v_reflections_count,
    'agency_notes_count', v_agency_count,
    'active_reflections_count', v_active_reflections,
    'era_phases_count', jsonb_array_length(public._himpbp173_era_opener_summary()),
    'cross_links_count', jsonb_array_length(public._himpbp173_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_humanity_review(
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
begin
  v_tenant_id := coalesce(p_org_id, public._himp_require_tenant());
  perform public._himp_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_identity_meaning_reviews (
    tenant_id, review_key, review_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._himp_log_audit(v_tenant_id, 'executive_humanity_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_meaning_reflection(
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
  v_tenant_id := coalesce(p_org_id, public._himp_require_tenant());
  perform public._himp_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_identity_meaning_reflections (
    tenant_id, reflection_key, reflection_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._himp_log_audit(v_tenant_id, 'meaning_reflection_recorded', left(p_title, 120),
    jsonb_build_object('reflection_id', v_id, 'reflection_type', p_reflection_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_human_identity_meaning_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.human_identity_meaning_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._himp_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._himp_ensure_settings(v_tenant_id);
  perform public._himp_seed_reflections(v_tenant_id);
  perform public._himp_seed_agency_notes(v_tenant_id);
  v_metrics := public._himp_refresh_metrics(v_tenant_id);
  v_engagement := public._himpbp173_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_identity_meaning_score', v_metrics->'human_identity_meaning_score',
    'enabled', v_settings.enabled,
    'discovery_mode', v_settings.discovery_mode,
    'meaning_readiness_level', v_settings.meaning_readiness_level,
    'meaning_reflections_count', v_metrics->'meaning_reflections_count',
    'philosophy', public._himpbp173_philosophy(),
    'purpose_reflection_enabled', v_settings.purpose_reflection_enabled,
    'agency_preservation_enabled', v_settings.agency_preservation_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 173 — Human Identity & Meaning Preservation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE173_HUMAN_IDENTITY_MEANING_PRESERVATION.md',
      'engine_phase', 'Repo Phase 173 Human Identity & Meaning Engine',
      'route', '/app/human-identity-meaning-engine',
      'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180).'
    ),
    'human_identity_meaning_mission', public._himpbp173_mission(),
    'human_identity_meaning_abos_principle', public._himpbp173_abos_principle(),
    'human_identity_meaning_engagement_summary', v_engagement,
    'human_identity_meaning_note', public._himpbp173_distinction_note(),
    'human_identity_meaning_vision_note', public._himpbp173_vision()
  );
end; $$;

create or replace function public.get_human_identity_meaning_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.human_identity_meaning_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._himp_require_tenant());
  v_settings := public._himp_ensure_settings(v_tenant_id);
  perform public._himp_seed_reflections(v_tenant_id);
  perform public._himp_seed_agency_notes(v_tenant_id);
  v_metrics := public._himp_refresh_metrics(v_tenant_id);
  perform public._himp_log_audit(v_tenant_id, 'dashboard_view', 'Human Identity & Meaning dashboard viewed',
    jsonb_build_object('human_identity_meaning_score', v_metrics->>'human_identity_meaning_score', 'discovery_mode', v_settings.discovery_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'discovery_mode', v_settings.discovery_mode,
    'meaning_readiness_level', v_settings.meaning_readiness_level,
    'purpose_reflection_enabled', v_settings.purpose_reflection_enabled,
    'belonging_reflection_enabled', v_settings.belonging_reflection_enabled,
    'agency_preservation_enabled', v_settings.agency_preservation_enabled,
    'identity_discovery_enabled', v_settings.identity_discovery_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'philosophy', public._himpbp173_philosophy(),
    'safety_note', 'Meaning & Identity Center — metadata scaffolds only. NOT identity definition, purpose imposition, or productivity-based worth scoring.',
    'distinction_note', public._himpbp173_distinction_note(),
    'human_identity_meaning_score', v_metrics->'human_identity_meaning_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'meaning_reflections_count', v_metrics->'meaning_reflections_count',
    'agency_notes_count', v_metrics->'agency_notes_count',
    'active_reflections_count', v_metrics->'active_reflections_count',
    'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'readiness_signal', r.readiness_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.human_identity_meaning_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'meaning_reflections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'reflection_key', b.reflection_key, 'reflection_type', b.reflection_type,
        'title', b.title, 'reflection_summary', b.reflection_summary, 'status', b.status,
        'created_at', b.created_at
      ) order by b.created_at desc)
      from public.human_identity_meaning_reflections b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'agency_notes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'note_key', s.note_key, 'note_type', s.note_type,
        'title', s.title, 'summary', s.summary, 'status', s.status, 'created_at', s.created_at
      ) order by s.created_at)
      from public.human_identity_meaning_agency_notes s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._himpbp173_integration_links(),
    'era_opener_summary', public._himpbp173_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 173 — Human Identity & Meaning Preservation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE173_HUMAN_IDENTITY_MEANING_PRESERVATION.md',
      'engine_phase', 'Repo Phase 173 Human Identity & Meaning Engine',
      'route', '/app/human-identity-meaning-engine',
      'mapping_note', 'Cosmic Stewardship & Multi-Generational Futures Era (171–180) — discovery not definition.'
    ),
    'human_identity_meaning_engine_note', 'Human Identity & Meaning Engine (ABOS Phase 173). Cross-link Phases 171–172, 170, 169, AIE Phase 34, Self Love A.76 — do NOT duplicate RPCs.',
    'human_identity_meaning_blueprint', public._himpbp173_blueprint_block(v_tenant_id),
    'human_identity_meaning_distinction_note', public._himpbp173_distinction_note(),
    'human_identity_meaning_mission', public._himpbp173_mission(),
    'human_identity_meaning_philosophy', public._himpbp173_philosophy(),
    'human_identity_meaning_abos_principle', public._himpbp173_abos_principle(),
    'human_identity_meaning_objectives', public._himpbp173_objectives(),
    'meaning_identity_center_meta', public._himpbp173_meaning_identity_center(),
    'human_identity_engine_meta', public._himpbp173_human_identity_engine(),
    'meaning_preservation_framework_meta', public._himpbp173_meaning_preservation_framework(),
    'executive_humanity_reviews_meta', public._himpbp173_executive_humanity_reviews(),
    'meaning_companion_meta', public._himpbp173_meaning_companion(),
    'belonging_engine_meta', public._himpbp173_belonging_engine(),
    'agency_preservation_engine_meta', public._himpbp173_agency_preservation_engine(),
    'companion_limitations_meta', public._himpbp173_companion_limitations(),
    'self_love_connection_meta', public._himpbp173_self_love_connection(),
    'security_requirements_meta', public._himpbp173_security_requirements(),
    'himpbp173_integration_links', public._himpbp173_integration_links(),
    'himpbp173_era_opener_summary', public._himpbp173_era_opener_summary(),
    'human_identity_meaning_engagement_summary', public._himpbp173_engagement_summary(v_tenant_id),
    'human_identity_meaning_success_criteria', public._himpbp173_success_criteria(v_tenant_id),
    'human_identity_meaning_vision', public._himpbp173_vision(),
    'human_identity_meaning_vision_phrases', public._himpbp173_vision_phrases(),
    'human_identity_meaning_privacy_note', public._himpbp173_privacy_note(),
    'human_identity_meaning_dogfooding', public._himpbp173_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-identity-meaning-engine', 'Human Identity & Meaning Engine',
  'Cosmic Stewardship & Multi-Generational Futures Era (171–180) — meaning discovery and identity humility. People First.',
  'authenticated', 183
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'human-identity-meaning-engine' and tenant_id is null
);

grant execute on function public.get_human_identity_meaning_engine_card(uuid) to authenticated;
grant execute on function public.get_human_identity_meaning_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_humanity_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_meaning_reflection(text, text, text, uuid) to authenticated;
grant execute on function public._himpbp173_distinction_note() to authenticated;
grant execute on function public._himpbp173_mission() to authenticated;
grant execute on function public._himpbp173_philosophy() to authenticated;
grant execute on function public._himpbp173_abos_principle() to authenticated;
grant execute on function public._himpbp173_vision() to authenticated;
grant execute on function public._himpbp173_objectives() to authenticated;
grant execute on function public._himpbp173_meaning_identity_center() to authenticated;
grant execute on function public._himpbp173_human_identity_engine() to authenticated;
grant execute on function public._himpbp173_meaning_preservation_framework() to authenticated;
grant execute on function public._himpbp173_executive_humanity_reviews() to authenticated;
grant execute on function public._himpbp173_meaning_companion() to authenticated;
grant execute on function public._himpbp173_belonging_engine() to authenticated;
grant execute on function public._himpbp173_agency_preservation_engine() to authenticated;
grant execute on function public._himpbp173_companion_limitations() to authenticated;
grant execute on function public._himpbp173_self_love_connection() to authenticated;
grant execute on function public._himpbp173_security_requirements() to authenticated;
grant execute on function public._himpbp173_era_opener_summary() to authenticated;
grant execute on function public._himpbp173_integration_links() to authenticated;
grant execute on function public._himpbp173_dogfooding() to authenticated;
grant execute on function public._himpbp173_vision_phrases() to authenticated;
grant execute on function public._himpbp173_privacy_note() to authenticated;
grant execute on function public._himpbp173_engagement_summary(uuid) to authenticated;
grant execute on function public._himpbp173_success_criteria(uuid) to authenticated;
