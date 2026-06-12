-- Phase 169 — Civilizational Trust & Social Cohesion Engine
-- Post-Enterprise & Civilizational Era (161–170) — Social Cohesion Center at /app/social-cohesion-engine.
-- Intentional trust development — NOT manipulation, image management, star ratings, or social scores.
-- Distinct from Trust Network Phase 142 (/app/trust-reputation-engine — _tnvebp142_* cross-link only).
-- Helpers: _cstce_* (engine), _cstcebp169_* (blueprint — never collide with _tnvebp142_*, _tre_*, _cpdebp168_*)

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
    'social_cohesion_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. social_cohesion_settings
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  trust_development_mode text not null default 'guided' check (
    trust_development_mode in ('guided', 'executive_led', 'stewardship_focused')
  ),
  trust_reflection_enabled boolean not null default true,
  relationship_health_enabled boolean not null default true,
  repair_programs_enabled boolean not null default true,
  executive_reviews_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  reflection_opt_in boolean not null default true,
  trust_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_manipulation":true,"no_trust_scores":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_cohesion_settings enable row level security;
revoke all on public.social_cohesion_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. social_cohesion_trust_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_trust_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'ecosystem_trust_evolution', 'confidence_weakening_themes', 'unfulfilled_commitments_themes',
      'credibility_strengthening', 'stewardship_demonstration', 'leadership_credibility_review'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"no_trust_scores":true}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists social_cohesion_trust_reviews_tenant_idx
  on public.social_cohesion_trust_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.social_cohesion_trust_reviews enable row level security;
revoke all on public.social_cohesion_trust_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. social_cohesion_relationship_health
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_relationship_health (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  health_key text not null,
  health_type text not null check (
    health_type in (
      'people_feel_heard_themes', 'leader_integrity_modeling', 'gp_support_themes',
      'trust_repair_readiness', 'contribution_recognition', 'relationship_reflection'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_not_surveillance":true}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, health_key)
);

create index if not exists social_cohesion_relationship_health_tenant_idx
  on public.social_cohesion_relationship_health (tenant_id, health_type, status, captured_at desc);

alter table public.social_cohesion_relationship_health enable row level security;
revoke all on public.social_cohesion_relationship_health from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. social_cohesion_repair_records
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_repair_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  repair_key text not null,
  repair_type text not null check (
    repair_type in (
      'acknowledgment', 'accountability', 'transparent_communication',
      'relationship_repair', 'learning_review', 'commitment_improvement'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_progress', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"scaffold_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, repair_key)
);

create index if not exists social_cohesion_repair_records_tenant_idx
  on public.social_cohesion_repair_records (tenant_id, repair_type, status);

alter table public.social_cohesion_repair_records enable row level security;
revoke all on public.social_cohesion_repair_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. social_cohesion_trust_memory
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_trust_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'leadership_reflection', 'relationship_success_narrative', 'gp_experience',
      'communication_lesson', 'knowledge_contribution', 'institutional_milestone'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists social_cohesion_trust_memory_tenant_idx
  on public.social_cohesion_trust_memory (tenant_id, memory_type, status, captured_at desc);

alter table public.social_cohesion_trust_memory enable row level security;
revoke all on public.social_cohesion_trust_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. social_cohesion_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.social_cohesion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.social_cohesion_audit_logs enable row level security;
revoke all on public.social_cohesion_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'social_cohesion_engine', v.description
from (values
  ('social_cohesion.view', 'View Social Cohesion Center', 'View trust reflection programs, relationship health dashboards, and repair scaffolds'),
  ('social_cohesion.manage', 'Manage Social Cohesion Center', 'Update trust development settings, programs, and stewardship scaffolds'),
  ('social_cohesion.steward', 'Steward Social Cohesion Center', 'Record executive trust reviews, repair actions, and trust memory metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'social_cohesion.view'), ('owner', 'social_cohesion.manage'), ('owner', 'social_cohesion.steward'),
  ('administrator', 'social_cohesion.view'), ('administrator', 'social_cohesion.manage'), ('administrator', 'social_cohesion.steward'),
  ('manager', 'social_cohesion.view'), ('manager', 'social_cohesion.steward'),
  ('employee', 'social_cohesion.view'),
  ('support_agent', 'social_cohesion.view'),
  ('moderator', 'social_cohesion.view'),
  ('viewer', 'social_cohesion.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_cstce_*)
-- ---------------------------------------------------------------------------
create or replace function public._cstce_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cstce_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cstce_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cstce_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.social_cohesion_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cstce_ensure_settings(p_tenant_id uuid)
returns public.social_cohesion_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.social_cohesion_settings;
begin
  insert into public.social_cohesion_settings (tenant_id, enabled, trust_development_mode)
  values (p_tenant_id, false, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.social_cohesion_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cstce_seed_scaffolds(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.social_cohesion_trust_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.social_cohesion_trust_reviews (tenant_id, review_key, review_type, title, summary, status) values
    (p_tenant_id, 'ecosystem-trust-evolution', 'ecosystem_trust_evolution', 'Trust Evolving in Ecosystem', 'Executive reflection scaffold — how trust is evolving across relationships and partnerships. Metadata themes only — no trust scores.', 'draft'),
    (p_tenant_id, 'confidence-weakening', 'confidence_weakening_themes', 'Confidence Weakening Areas', 'Aggregate themes where confidence may be weakening — reflection prompts, not surveillance or rankings.', 'draft'),
    (p_tenant_id, 'unfulfilled-commitments', 'unfulfilled_commitments_themes', 'Unfulfilled Commitments Themes', 'Themes around commitments needing follow-through — stewardship reflection, not blame assignment.', 'draft'),
    (p_tenant_id, 'credibility-strengthening', 'credibility_strengthening', 'Credibility Strengthening Practices', 'Scaffolds for demonstrating reliability and accountability — trust through consistency.', 'draft'),
    (p_tenant_id, 'stewardship-demonstration', 'stewardship_demonstration', 'Stewardship Demonstration Review', 'Leadership stewardship reflection — cross-link Global Stewardship 150 and Civic Collaboration 161.', 'draft');

  insert into public.social_cohesion_relationship_health (tenant_id, health_key, health_type, title, summary, status) values
    (p_tenant_id, 'people-feel-heard', 'people_feel_heard_themes', 'People Feel Heard Themes', 'Aggregate themes on whether people feel heard — organizational reflection, NOT individual surveillance.', 'draft'),
    (p_tenant_id, 'leader-integrity', 'leader_integrity_modeling', 'Leader Integrity Modeling', 'Leadership integrity modeling reflection scaffolds — consistency and accountability themes.', 'draft'),
    (p_tenant_id, 'gp-support', 'gp_support_themes', 'Growth Partner Support Themes', 'Growth Partner relationship support themes — never Affiliate. Metadata aggregates only.', 'draft'),
    (p_tenant_id, 'trust-repair-readiness', 'trust_repair_readiness', 'Trust Repair Readiness', 'Readiness scaffolds for trust repair and restoration — acknowledgment before acceleration.', 'draft'),
    (p_tenant_id, 'contribution-recognition', 'contribution_recognition', 'Recognize Contributions', 'Contribution recognition reflection — gratitude and respect themes, not performance scoring.', 'draft');

  insert into public.social_cohesion_repair_records (tenant_id, repair_key, repair_type, title, summary, status) values
    (p_tenant_id, 'acknowledgment-scaffold', 'acknowledgment', 'Acknowledgment Scaffold', 'Trust repair step — acknowledge impact and concerns with transparency.', 'draft'),
    (p_tenant_id, 'accountability-scaffold', 'accountability', 'Accountability Scaffold', 'Trust repair step — clarify ownership and follow-through commitments.', 'draft'),
    (p_tenant_id, 'transparent-communication', 'transparent_communication', 'Transparent Communication', 'Trust repair step — open communication scaffolds without image management.', 'draft'),
    (p_tenant_id, 'relationship-repair', 'relationship_repair', 'Relationship Repair', 'Trust repair step — relationship restoration practices with human leadership.', 'draft'),
    (p_tenant_id, 'learning-review', 'learning_review', 'Learning Review', 'Trust repair step — learning reviews after repair actions — metadata only.', 'draft'),
    (p_tenant_id, 'commitment-improvement', 'commitment_improvement', 'Commitment to Improvement', 'Trust repair step — documented commitment to improvement — not manipulation.', 'draft');

  insert into public.social_cohesion_trust_memory (tenant_id, memory_key, memory_type, title, summary, status) values
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership Reflection Memory', 'Leadership trust reflection narratives — metadata summaries max ~500 chars.', 'draft'),
    (p_tenant_id, 'relationship-success', 'relationship_success_narrative', 'Relationship Success Narratives', 'Relationship success story scaffolds — celebrate trust built through consistency.', 'draft'),
    (p_tenant_id, 'gp-experience', 'gp_experience', 'Growth Partner Experiences', 'Growth Partner trust experience metadata — cross-link Relationship Intelligence A.78.', 'draft'),
    (p_tenant_id, 'communication-lesson', 'communication_lesson', 'Communication Lessons', 'Communication lessons learned — cross-link Constructive Dialogue Phase 168.', 'draft'),
    (p_tenant_id, 'knowledge-contribution', 'knowledge_contribution', 'Knowledge Contributions', 'Trust-building knowledge contributions — cross-link Civilizational Memory 163.', 'draft'),
    (p_tenant_id, 'institutional-milestone', 'institutional_milestone', 'Institutional Milestones', 'Institutional trust milestones — stewardship markers, not popularity metrics.', 'draft');
end; $$;

create or replace function public._cstce_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.social_cohesion_settings;
  v_reviews_count int;
  v_health_count int;
  v_repair_count int;
  v_memory_count int;
  v_social_cohesion_score numeric;
begin
  select * into v_settings from public.social_cohesion_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.social_cohesion_trust_reviews where tenant_id = p_tenant_id;
  select count(*) into v_health_count from public.social_cohesion_relationship_health where tenant_id = p_tenant_id;
  select count(*) into v_repair_count from public.social_cohesion_repair_records where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.social_cohesion_trust_memory where tenant_id = p_tenant_id;

  v_social_cohesion_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.trust_reflection_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.relationship_health_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.repair_programs_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.executive_reviews_enabled, false) then 10 else 0 end
    + least(v_reviews_count, 5) * 4
    + least(v_health_count, 5) * 3
    + least(v_repair_count, 6) * 2
    + least(v_memory_count, 6) * 2,
    1
  );

  return jsonb_build_object(
    'social_cohesion_score', v_social_cohesion_score,
    'enabled', coalesce(v_settings.enabled, false),
    'trust_development_mode', coalesce(v_settings.trust_development_mode, 'guided'),
    'trust_reviews_count', v_reviews_count,
    'relationship_health_count', v_health_count,
    'repair_records_count', v_repair_count,
    'trust_memory_count', v_memory_count,
    'cross_links_count', jsonb_array_length(public._cstcebp169_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_cstcebp169_*)
-- ---------------------------------------------------------------------------
create or replace function public._cstcebp169_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 169 — Civilizational Trust & Social Cohesion Engine at /app/social-cohesion-engine. Post-Enterprise & Civilizational Era (161–170) — intentional trust development, NOT manipulation or image management. NO star ratings, social scores, or trust rankings — distinct from Trust Network Phase 142 at /app/trust-reputation-engine (_tnvebp142_* cross-link only). Civilizational social cohesion — trust through consistency, reliability, and accountability. Helpers _cstcebp169_* — never collide with _tnvebp142_*, _tre_*, _cpdebp168_*. Growth Partner not Affiliate.';
$$;

create or replace function public._cstcebp169_mission()
returns text language sql immutable as $$
  select 'Strengthen civilizational social cohesion through intentional trust development — transparency, reliability, accountability, and mutual respect — without manipulation, image management, trust scores, or replacing human relationships.';
$$;

create or replace function public._cstcebp169_philosophy()
returns text language sql immutable as $$
  select 'People First. Trust through consistency — not manufactured sentiment. Growth Partner terminology — never Affiliate. Trust Companion supports awareness; it does NOT manipulate emotions, determine who deserves trust, override leadership, suppress criticism, or replace relationships.';
$$;

create or replace function public._cstcebp169_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Social Cohesion Center aggregates trust reflection visibility. Trust Network 142, Constructive Dialogue 168, Shared Prosperity 167, Civic Collaboration 161, and Relationship Intelligence A.78 remain authoritative for their domains. Aipify informs and prepares; humans build trust.';
$$;

create or replace function public._cstcebp169_vision()
returns text language sql immutable as $$
  select 'Organizations and ecosystems where trust grows through demonstrated consistency, compassionate leadership, and repair after rupture — because civilizational strength is built on relationships, not ratings.';
$$;

create or replace function public._cstcebp169_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'trust_reflection_programs', 'label', 'Trust reflection programs', 'emoji', '🪞', 'description', 'Executive and leadership trust review scaffolds'),
    jsonb_build_object('key', 'relationship_health', 'label', 'Relationship health dashboards', 'emoji', '💚', 'description', 'Aggregate relationship health reflection — not surveillance'),
    jsonb_build_object('key', 'leadership_credibility', 'label', 'Leadership credibility reviews', 'emoji', '⭐', 'description', 'Credibility through stewardship — NOT star ratings'),
    jsonb_build_object('key', 'trust_companion', 'label', 'Trust Companion guidance', 'emoji', '✨', 'description', 'Awareness support — does NOT manufacture trust'),
    jsonb_build_object('key', 'gp_collaboration', 'label', 'GP collaboration insights', 'emoji', '🤝', 'description', 'Growth Partner trust themes — never Affiliate'),
    jsonb_build_object('key', 'cross_sector_learning', 'label', 'Cross-sector learning sessions', 'emoji', '🔗', 'description', 'Cross-link Cross-Sector Intelligence 162'),
    jsonb_build_object('key', 'community_relationships', 'label', 'Community relationship programs', 'emoji', '🌱', 'description', 'Cross-link Civic Collaboration 161'),
    jsonb_build_object('key', 'trust_knowledge', 'label', 'Trust knowledge libraries', 'emoji', '📚', 'description', 'Trust memory and learning scaffolds')
  );
$$;

create or replace function public._cstcebp169_social_cohesion_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Social Cohesion Center — eight trust development capabilities. Reflection not manipulation.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'trust_reflection_programs', 'label', 'Trust reflection programs'),
      jsonb_build_object('key', 'relationship_health_dashboards', 'label', 'Relationship health dashboards'),
      jsonb_build_object('key', 'leadership_credibility_reviews', 'label', 'Leadership credibility reviews'),
      jsonb_build_object('key', 'companion_guidance', 'label', 'Trust Companion guidance'),
      jsonb_build_object('key', 'gp_collaboration_insights', 'label', 'Growth Partner collaboration insights'),
      jsonb_build_object('key', 'cross_sector_learning_sessions', 'label', 'Cross-sector learning sessions', 'cross_link', '/app/cross-sector-intelligence-engine'),
      jsonb_build_object('key', 'community_relationship_programs', 'label', 'Community relationship programs', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'trust_knowledge_libraries', 'label', 'Trust knowledge libraries')
    )
  );
$$;

create or replace function public._cstcebp169_trust_development_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust development engine — six pillars of intentional trust building.',
    'pillars', jsonb_build_array(
      jsonb_build_object('key', 'transparency', 'label', 'Transparency'),
      jsonb_build_object('key', 'reliability', 'label', 'Reliability'),
      jsonb_build_object('key', 'accountability', 'label', 'Accountability'),
      jsonb_build_object('key', 'consistency', 'label', 'Consistency'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition'),
      jsonb_build_object('key', 'mutual_respect', 'label', 'Mutual respect')
    )
  );
$$;

create or replace function public._cstcebp169_relationship_health_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship health framework — aggregate reflection themes, NOT individual surveillance.',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'people_feel_heard', 'label', 'People feel heard themes aggregate'),
      jsonb_build_object('key', 'leader_integrity', 'label', 'Leader integrity modeling'),
      jsonb_build_object('key', 'gp_support', 'label', 'Growth Partner support themes'),
      jsonb_build_object('key', 'trust_repair', 'label', 'Trust repair readiness'),
      jsonb_build_object('key', 'recognize_contributions', 'label', 'Recognize contributions')
    )
  );
$$;

create or replace function public._cstcebp169_executive_trust_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive trust reviews — reflection on trust evolving in the ecosystem.',
    'review_areas', jsonb_build_array(
      jsonb_build_object('key', 'trust_evolution', 'label', 'Trust evolving in ecosystem'),
      jsonb_build_object('key', 'confidence_weakening', 'label', 'Confidence weakening areas'),
      jsonb_build_object('key', 'unfulfilled_commitments', 'label', 'Unfulfilled commitments themes'),
      jsonb_build_object('key', 'credibility_strengthening', 'label', 'Credibility strengthening'),
      jsonb_build_object('key', 'stewardship_demonstration', 'label', 'Demonstrate stewardship'),
      jsonb_build_object('key', 'leadership_credibility', 'label', 'Leadership credibility review')
    )
  );
$$;

create or replace function public._cstcebp169_trust_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust Companion — relationship insight aggregates and reflection prompts. Does NOT manufacture trust.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'relationship_insights', 'label', 'Relationship insights aggregates'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings — informational only'),
      jsonb_build_object('key', 'communication_guidance', 'label', 'Communication guidance', 'cross_link', '/app/constructive-dialogue-engine'),
      jsonb_build_object('key', 'stewardship_summaries', 'label', 'Stewardship summaries — metadata only')
    )
  );
$$;

create or replace function public._cstcebp169_social_cohesion_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Social cohesion engine — relationship domains across the civilizational ecosystem.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'employee_relationships', 'label', 'Employee relationships aggregate'),
      jsonb_build_object('key', 'gp_collaboration', 'label', 'Growth Partner collaboration'),
      jsonb_build_object('key', 'knowledge_communities', 'label', 'Knowledge communities'),
      jsonb_build_object('key', 'cross_sector_partnerships', 'label', 'Cross-sector partnerships', 'cross_link', '/app/cross-sector-intelligence-engine'),
      jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility'),
      jsonb_build_object('key', 'community_engagement', 'label', 'Community engagement', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._cstcebp169_repair_restoration_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Repair and restoration framework — trust repair scaffolds after rupture.',
    'steps', jsonb_build_array(
      jsonb_build_object('key', 'acknowledgment', 'label', 'Acknowledgment'),
      jsonb_build_object('key', 'accountability', 'label', 'Accountability'),
      jsonb_build_object('key', 'transparent_communication', 'label', 'Transparent communication'),
      jsonb_build_object('key', 'relationship_repair', 'label', 'Relationship repair'),
      jsonb_build_object('key', 'learning_reviews', 'label', 'Learning reviews'),
      jsonb_build_object('key', 'commitment_improvement', 'label', 'Commitment to improvement')
    )
  );
$$;

create or replace function public._cstcebp169_trust_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust memory engine — institutional trust narratives and lessons.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections'),
      jsonb_build_object('key', 'relationship_success', 'label', 'Relationship success narratives'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'Growth Partner experiences'),
      jsonb_build_object('key', 'communication_lessons', 'label', 'Communication lessons', 'cross_link', '/app/constructive-dialogue-engine'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'institutional_milestones', 'label', 'Institutional milestones')
    )
  );
$$;

create or replace function public._cstcebp169_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_not', jsonb_build_array(
      'Manipulate emotions',
      'Determine who deserves trust',
      'Override leadership',
      'Suppress criticism',
      'Replace human relationships',
      'Assign trust scores or rankings'
    ),
    'principle', 'Trust Companion supports awareness — humans build and repair trust.'
  );
$$;

create or replace function public._cstcebp169_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — integrity, compassion, humility, patience, recognition, and respect in trust building.',
    'values', jsonb_build_array(
      'integrity', 'compassion', 'humility', 'patience', 'recognition', 'respect'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._cstcebp169_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'trust_review_audit_logs', 'label', 'Trust review audit logs via social_cohesion_audit_logs'),
      jsonb_build_object('key', 'leadership_participation_histories', 'label', 'Leadership participation histories — metadata only'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via social_cohesion permissions'),
      jsonb_build_object('key', 'relationship_documentation_protections', 'label', 'Relationship documentation protections'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cstcebp169_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'relationship', 'Community engagement — cross-link only'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'relationship', 'Cross-sector learning — cross-link only'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'relationship', 'Trust knowledge preservation — cross-link only'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'relationship', 'Collective adaptation — cross-link only'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'relationship', 'Long-horizon trust foresight — cross-link only'),
    jsonb_build_object('phase', 166, 'key', 'civilizational_coordination', 'label', 'Civilizational Coordination Phase 166', 'route', '/app/civilizational-coordination-engine', 'relationship', 'Shared action coordination — cross-link only'),
    jsonb_build_object('phase', 167, 'key', 'shared_prosperity', 'label', 'Shared Prosperity Phase 167', 'route', '/app/shared-prosperity-engine', 'relationship', 'Prosperity collaboration — cross-link only'),
    jsonb_build_object('phase', 168, 'key', 'constructive_dialogue', 'label', 'Constructive Dialogue Phase 168', 'route', '/app/constructive-dialogue-engine', 'relationship', 'Communication guidance — _cpdebp168_* cross-link only'),
    jsonb_build_object('phase', 142, 'key', 'trust_network', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'relationship', 'Verification ecosystem — _tnvebp142_* cross-link only, never duplicate'),
    jsonb_build_object('phase', 144, 'key', 'global_governance_diplomacy', 'label', 'Global Governance Diplomacy Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'relationship', 'Governance diplomacy — cross-link only'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship Intelligence A.78', 'route', '/app/relationship-intelligence-engine', 'relationship', 'Relationship scaffolds — cross-link only'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust & Reputation A.72', 'route', '/app/trust-reputation-engine', 'relationship', 'Trust reputation — _tre_* cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Integrity, compassion, and respect in trust building')
  );
$$;

create or replace function public._cstcebp169_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Social Cohesion Center internally with metadata-only trust review summaries, relationship health reflection scaffolds, and repair records. Growth Partner terminology throughout. No trust scores, star ratings, or emotional manipulation.';
$$;

create or replace function public._cstcebp169_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trust through consistency — not manufactured sentiment.',
    'People First — relationships over rankings.',
    'Repair after rupture — acknowledgment before acceleration.',
    'Reflection support — humans build trust.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._cstcebp169_privacy_note()
returns text language sql immutable as $$
  select 'Social Cohesion metadata only — trust review summaries max ~500 chars, relationship health aggregates, repair scaffolds, trust memory entries. No PII surveillance, trust scores, star ratings, or social rankings.';
$$;

create or replace function public._cstcebp169_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cstce_ensure_settings(p_org_id);
  perform public._cstce_seed_scaffolds(p_org_id);
  v_metrics := public._cstce_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'social_cohesion_score', coalesce((v_metrics->>'social_cohesion_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'trust_development_mode', coalesce(v_metrics->>'trust_development_mode', 'guided'),
    'trust_reviews_count', coalesce((v_metrics->>'trust_reviews_count')::int, 0),
    'relationship_health_count', coalesce((v_metrics->>'relationship_health_count')::int, 0),
    'repair_records_count', coalesce((v_metrics->>'repair_records_count')::int, 0),
    'trust_memory_count', coalesce((v_metrics->>'trust_memory_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._cstcebp169_integration_links()),
    'privacy_note', public._cstcebp169_privacy_note(),
    'no_trust_scores', true,
    'not_manipulation', true
  );
end; $$;

create or replace function public._cstcebp169_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cstce_ensure_settings(p_org_id);
  perform public._cstce_seed_scaffolds(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'social_cohesion_center', 'label', 'Social Cohesion Center — eight capabilities', 'met', jsonb_array_length(public._cstcebp169_social_cohesion_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'trust_development_engine', 'label', 'Trust development engine — six pillars', 'met', jsonb_array_length(public._cstcebp169_trust_development_engine()->'pillars') = 6, 'note', null),
    jsonb_build_object('key', 'relationship_health_framework', 'label', 'Relationship health framework — five themes', 'met', jsonb_array_length(public._cstcebp169_relationship_health_framework()->'themes') = 5, 'note', null),
    jsonb_build_object('key', 'executive_trust_reviews', 'label', 'Executive trust reviews — six areas', 'met', jsonb_array_length(public._cstcebp169_executive_trust_reviews()->'review_areas') = 6, 'note', null),
    jsonb_build_object('key', 'trust_companion', 'label', 'Trust Companion — six capabilities', 'met', jsonb_array_length(public._cstcebp169_trust_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'social_cohesion_engine', 'label', 'Social cohesion engine — six domains', 'met', jsonb_array_length(public._cstcebp169_social_cohesion_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'repair_restoration_framework', 'label', 'Repair restoration framework — six steps', 'met', jsonb_array_length(public._cstcebp169_repair_restoration_framework()->'steps') = 6, 'note', null),
    jsonb_build_object('key', 'trust_memory_engine', 'label', 'Trust memory engine — six types', 'met', jsonb_array_length(public._cstcebp169_trust_memory_engine()->'memory_types') = 6, 'note', null),
    jsonb_build_object('key', 'scaffolds_seeded', 'label', 'Trust scaffolds seeded for tenant', 'met', (select count(*) >= 5 from public.social_cohesion_trust_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._cstcebp169_companion_limitations()->'must_not') >= 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._cstcebp169_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — thirteen cross-links', 'met', jsonb_array_length(public._cstcebp169_integration_links()) = 13, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 169 baseline tables and RPCs', 'met', to_regclass('public.social_cohesion_settings') is not null, 'note', '_cstce_* helpers intact')
  );
end; $$;

create or replace function public._cstcebp169_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 169 — Civilizational Trust & Social Cohesion Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE169_CIVILIZATIONAL_TRUST_SOCIAL_COHESION.md',
    'engine_phase', 'Repo Phase 169 Social Cohesion Engine',
    'route', '/app/social-cohesion-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — intentional trust development not manipulation.',
    'distinction_note', public._cstcebp169_distinction_note(),
    'mission', public._cstcebp169_mission(),
    'philosophy', public._cstcebp169_philosophy(),
    'abos_principle', public._cstcebp169_abos_principle(),
    'vision', public._cstcebp169_vision(),
    'objectives', public._cstcebp169_objectives(),
    'social_cohesion_center', public._cstcebp169_social_cohesion_center(),
    'trust_development_engine', public._cstcebp169_trust_development_engine(),
    'relationship_health_framework', public._cstcebp169_relationship_health_framework(),
    'executive_trust_reviews', public._cstcebp169_executive_trust_reviews(),
    'trust_companion', public._cstcebp169_trust_companion(),
    'social_cohesion_engine', public._cstcebp169_social_cohesion_engine(),
    'repair_restoration_framework', public._cstcebp169_repair_restoration_framework(),
    'trust_memory_engine', public._cstcebp169_trust_memory_engine(),
    'companion_limitations', public._cstcebp169_companion_limitations(),
    'self_love_connection', public._cstcebp169_self_love_connection(),
    'security_requirements', public._cstcebp169_security_requirements(),
    'integration_links', public._cstcebp169_integration_links(),
    'dogfooding', public._cstcebp169_dogfooding(),
    'success_criteria', public._cstcebp169_success_criteria(p_org_id),
    'engagement_summary', public._cstcebp169_engagement_summary(p_org_id),
    'vision_phrases', public._cstcebp169_vision_phrases(),
    'privacy_note', public._cstcebp169_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_trust_review(
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
  v_settings public.social_cohesion_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._cstce_require_tenant());
  v_settings := public._cstce_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Social Cohesion Center must be enabled'; end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.social_cohesion_trust_reviews (
    tenant_id, review_key, review_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._cstce_log_audit(v_tenant_id, 'executive_trust_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_trust_repair_action(
  p_repair_type text,
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
  v_tenant_id := coalesce(p_org_id, public._cstce_require_tenant());
  perform public._cstce_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_repair_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.social_cohesion_repair_records (
    tenant_id, repair_key, repair_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_repair_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._cstce_log_audit(v_tenant_id, 'trust_repair_action_recorded', left(p_title, 120),
    jsonb_build_object('repair_id', v_id, 'repair_type', p_repair_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_social_cohesion_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_cohesion_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cstce_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cstce_ensure_settings(v_tenant_id);
  perform public._cstce_seed_scaffolds(v_tenant_id);
  v_metrics := public._cstce_refresh_metrics(v_tenant_id);
  v_engagement := public._cstcebp169_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'social_cohesion_score', v_metrics->'social_cohesion_score',
    'enabled', v_settings.enabled,
    'trust_development_mode', v_settings.trust_development_mode,
    'trust_reviews_count', v_metrics->'trust_reviews_count',
    'philosophy', public._cstcebp169_philosophy(),
    'trust_reflection_enabled', v_settings.trust_reflection_enabled,
    'relationship_health_enabled', v_settings.relationship_health_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 169 — Civilizational Trust & Social Cohesion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE169_CIVILIZATIONAL_TRUST_SOCIAL_COHESION.md',
      'engine_phase', 'Repo Phase 169 Social Cohesion Engine',
      'route', '/app/social-cohesion-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — intentional trust development.'
    ),
    'social_cohesion_mission', public._cstcebp169_mission(),
    'social_cohesion_abos_principle', public._cstcebp169_abos_principle(),
    'social_cohesion_engagement_summary', v_engagement,
    'social_cohesion_note', public._cstcebp169_distinction_note(),
    'social_cohesion_vision_note', public._cstcebp169_vision()
  );
end; $$;

create or replace function public.get_social_cohesion_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_cohesion_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cstce_require_tenant());
  v_settings := public._cstce_ensure_settings(v_tenant_id);
  perform public._cstce_seed_scaffolds(v_tenant_id);
  v_metrics := public._cstce_refresh_metrics(v_tenant_id);
  perform public._cstce_log_audit(v_tenant_id, 'dashboard_view', 'Social Cohesion dashboard viewed',
    jsonb_build_object('social_cohesion_score', v_metrics->>'social_cohesion_score', 'trust_development_mode', v_settings.trust_development_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'trust_development_mode', v_settings.trust_development_mode,
    'trust_reflection_enabled', v_settings.trust_reflection_enabled,
    'relationship_health_enabled', v_settings.relationship_health_enabled,
    'repair_programs_enabled', v_settings.repair_programs_enabled,
    'executive_reviews_enabled', v_settings.executive_reviews_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'philosophy', public._cstcebp169_philosophy(),
    'safety_note', 'Social Cohesion Center — metadata scaffolds only. Intentional trust development — NOT manipulation or trust scores.',
    'distinction_note', public._cstcebp169_distinction_note(),
    'social_cohesion_score', v_metrics->'social_cohesion_score',
    'trust_reviews_count', v_metrics->'trust_reviews_count',
    'relationship_health_count', v_metrics->'relationship_health_count',
    'repair_records_count', v_metrics->'repair_records_count',
    'trust_memory_count', v_metrics->'trust_memory_count',
    'trust_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.social_cohesion_trust_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'relationship_health', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'health_key', h.health_key, 'health_type', h.health_type,
        'title', h.title, 'summary', h.summary, 'status', h.status, 'captured_at', h.captured_at
      ) order by h.captured_at desc)
      from public.social_cohesion_relationship_health h where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'repair_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'repair_key', p.repair_key, 'repair_type', p.repair_type,
        'title', p.title, 'summary', p.summary, 'status', p.status, 'created_at', p.created_at
      ) order by p.created_at)
      from public.social_cohesion_repair_records p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'trust_memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.social_cohesion_trust_memory m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cstcebp169_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 169 — Civilizational Trust & Social Cohesion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE169_CIVILIZATIONAL_TRUST_SOCIAL_COHESION.md',
      'engine_phase', 'Repo Phase 169 Social Cohesion Engine',
      'route', '/app/social-cohesion-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — intentional trust development not manipulation.'
    ),
    'social_cohesion_engine_note', 'Social Cohesion Engine (ABOS Phase 169) — cross-link Trust Network 142, Constructive Dialogue 168, Civic Collaboration 161 — do NOT duplicate RPCs.',
    'social_cohesion_blueprint', public._cstcebp169_blueprint_block(v_tenant_id),
    'social_cohesion_distinction_note', public._cstcebp169_distinction_note(),
    'social_cohesion_mission', public._cstcebp169_mission(),
    'social_cohesion_philosophy', public._cstcebp169_philosophy(),
    'social_cohesion_abos_principle', public._cstcebp169_abos_principle(),
    'social_cohesion_objectives', public._cstcebp169_objectives(),
    'social_cohesion_center_meta', public._cstcebp169_social_cohesion_center(),
    'trust_development_engine_meta', public._cstcebp169_trust_development_engine(),
    'relationship_health_framework_meta', public._cstcebp169_relationship_health_framework(),
    'executive_trust_reviews_meta', public._cstcebp169_executive_trust_reviews(),
    'trust_companion_meta', public._cstcebp169_trust_companion(),
    'social_cohesion_engine_meta', public._cstcebp169_social_cohesion_engine(),
    'repair_restoration_framework_meta', public._cstcebp169_repair_restoration_framework(),
    'trust_memory_engine_meta', public._cstcebp169_trust_memory_engine(),
    'companion_limitations_meta', public._cstcebp169_companion_limitations(),
    'self_love_connection_meta', public._cstcebp169_self_love_connection(),
    'security_requirements_meta', public._cstcebp169_security_requirements(),
    'cstcebp169_integration_links', public._cstcebp169_integration_links(),
    'social_cohesion_engagement_summary', public._cstcebp169_engagement_summary(v_tenant_id),
    'social_cohesion_success_criteria', public._cstcebp169_success_criteria(v_tenant_id),
    'social_cohesion_vision', public._cstcebp169_vision(),
    'social_cohesion_vision_phrases', public._cstcebp169_vision_phrases(),
    'social_cohesion_privacy_note', public._cstcebp169_privacy_note(),
    'social_cohesion_dogfooding', public._cstcebp169_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'social-cohesion-engine', 'Social Cohesion Engine',
  'Post-Enterprise & Civilizational Era (161–170) — civilizational trust and social cohesion. People First.',
  'authenticated', 179
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'social-cohesion-engine' and tenant_id is null
);

grant execute on function public.get_social_cohesion_engine_card(uuid) to authenticated;
grant execute on function public.get_social_cohesion_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_trust_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_trust_repair_action(text, text, text, uuid) to authenticated;
grant execute on function public._cstcebp169_distinction_note() to authenticated;
grant execute on function public._cstcebp169_mission() to authenticated;
grant execute on function public._cstcebp169_philosophy() to authenticated;
grant execute on function public._cstcebp169_abos_principle() to authenticated;
grant execute on function public._cstcebp169_vision() to authenticated;
grant execute on function public._cstcebp169_objectives() to authenticated;
grant execute on function public._cstcebp169_social_cohesion_center() to authenticated;
grant execute on function public._cstcebp169_trust_development_engine() to authenticated;
grant execute on function public._cstcebp169_relationship_health_framework() to authenticated;
grant execute on function public._cstcebp169_executive_trust_reviews() to authenticated;
grant execute on function public._cstcebp169_trust_companion() to authenticated;
grant execute on function public._cstcebp169_social_cohesion_engine() to authenticated;
grant execute on function public._cstcebp169_repair_restoration_framework() to authenticated;
grant execute on function public._cstcebp169_trust_memory_engine() to authenticated;
grant execute on function public._cstcebp169_companion_limitations() to authenticated;
grant execute on function public._cstcebp169_self_love_connection() to authenticated;
grant execute on function public._cstcebp169_security_requirements() to authenticated;
grant execute on function public._cstcebp169_integration_links() to authenticated;
grant execute on function public._cstcebp169_dogfooding() to authenticated;
grant execute on function public._cstcebp169_vision_phrases() to authenticated;
grant execute on function public._cstcebp169_privacy_note() to authenticated;
grant execute on function public._cstcebp169_engagement_summary(uuid) to authenticated;
grant execute on function public._cstcebp169_success_criteria(uuid) to authenticated;
