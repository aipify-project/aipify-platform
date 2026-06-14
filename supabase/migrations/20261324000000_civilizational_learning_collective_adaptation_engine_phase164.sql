-- Phase 164 — Civilizational Learning & Collective Adaptation Engine
-- Post-Enterprise & Civilizational Era (161–170) — Collective Adaptation Center.
-- Distinct from Civilizational Memory Phase 163 (/app/civilizational-memory-engine — preservation).
-- Distinct from Global Knowledge Exchange Phase 141 (/app/global-knowledge-exchange-engine — exchange).
-- Distinct from Continuous Improvement Phase 134 (/app/continuous-improvement-engine — org-level).
-- Helpers: _clae_* (engine), _claebp164_* (blueprint — never collide with _gcmebp163_*, _gkeebp141_*, _csiebp162_*)

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
    'civilizational_learning_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. civilizational_learning_settings
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_learning_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  adaptation_readiness_level int not null default 1 check (adaptation_readiness_level between 1 and 5),
  learning_maturity_stage text not null default 'foundational_awareness' check (
    learning_maturity_stage in (
      'foundational_awareness', 'reflective_learning', 'collective_adaptation',
      'cross_generational_wisdom', 'resilience_preparedness', 'civilizational_readiness'
    )
  ),
  cross_org_learning_opt_in boolean not null default false,
  reflection_opt_in boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.civilizational_learning_settings enable row level security;
revoke all on public.civilizational_learning_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. civilizational_learning_programs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_learning_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  program_type text not null check (
    program_type in (
      'cross_generational_mentorship', 'executive_learning_circle', 'knowledge_stewardship',
      'resilience_learning', 'future_preparedness', 'community_learning_network',
      'gp_collaboration', 'professional_association'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'completed', 'archived')
  ),
  adaptation_signal text not null default 'emerging' check (
    adaptation_signal in ('emerging', 'developing', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists civilizational_learning_programs_tenant_idx
  on public.civilizational_learning_programs (tenant_id, program_type, status, captured_at desc);

alter table public.civilizational_learning_programs enable row level security;
revoke all on public.civilizational_learning_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. civilizational_adaptation_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_adaptation_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'adaptation_evolution', 'leadership_reflection', 'underutilized_lessons',
      'change_resistance', 'preserve_experiences', 'future_leaders_prep',
      'collective_resilience', 'preparedness_exercise'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  adaptation_signal text not null default 'stable' check (
    adaptation_signal in ('emerging', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists civilizational_adaptation_reviews_tenant_idx
  on public.civilizational_adaptation_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.civilizational_adaptation_reviews enable row level security;
revoke all on public.civilizational_adaptation_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. civilizational_lessons_learned
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_lessons_learned (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  lesson_key text not null,
  lesson_type text not null check (
    lesson_type in (
      'transformation_lesson', 'leadership_reflection', 'gp_experience',
      'knowledge_contribution', 'preparedness_exercise', 'institutional_narrative',
      'assumption_revision', 'emerging_reality'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, lesson_key)
);

create index if not exists civilizational_lessons_learned_tenant_idx
  on public.civilizational_lessons_learned (tenant_id, lesson_type, status, captured_at desc);

alter table public.civilizational_lessons_learned enable row level security;
revoke all on public.civilizational_lessons_learned from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. civilizational_learning_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_learning_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.civilizational_learning_audit_logs enable row level security;
revoke all on public.civilizational_learning_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'civilizational_learning_engine', v.description
from (values
  ('civilizational_learning.view', 'View Collective Adaptation Center', 'View collective learning programs, adaptation reviews, and lessons learned metadata'),
  ('civilizational_learning.manage', 'Manage Collective Adaptation Center', 'Update civilizational learning settings and record adaptation reviews'),
  ('civilizational_learning.contribute', 'Contribute Civilizational Lessons', 'Contribute lessons learned and learning program metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'civilizational_learning.view'), ('owner', 'civilizational_learning.manage'), ('owner', 'civilizational_learning.contribute'),
  ('administrator', 'civilizational_learning.view'), ('administrator', 'civilizational_learning.manage'), ('administrator', 'civilizational_learning.contribute'),
  ('manager', 'civilizational_learning.view'), ('manager', 'civilizational_learning.manage'), ('manager', 'civilizational_learning.contribute'),
  ('employee', 'civilizational_learning.view'), ('employee', 'civilizational_learning.contribute'),
  ('support_agent', 'civilizational_learning.view'),
  ('moderator', 'civilizational_learning.view'),
  ('viewer', 'civilizational_learning.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_clae_)
-- ---------------------------------------------------------------------------
create or replace function public._clae_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._clae_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._clae_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._clae_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.civilizational_learning_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._clae_ensure_settings(p_tenant_id uuid)
returns public.civilizational_learning_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.civilizational_learning_settings;
begin
  insert into public.civilizational_learning_settings (tenant_id, adaptation_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.civilizational_learning_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._clae_seed_programs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_learning_programs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_learning_programs (
    tenant_id, program_key, program_type, title, summary, adaptation_signal
  ) values
    (p_tenant_id, 'cross-generational', 'cross_generational_mentorship', 'Cross-generational learning program',
     'Intergenerational mentorship scaffold — cross-link Future Leaders Phase 151.', 'stable'),
    (p_tenant_id, 'executive-circle', 'executive_learning_circle', 'Executive learning circle',
     'Leadership reflection sessions — aggregate metadata only.', 'stable'),
    (p_tenant_id, 'knowledge-stewardship', 'knowledge_stewardship', 'Knowledge stewardship initiative',
     'Knowledge stewardship scaffold — cross-link Civilizational Memory Phase 163.', 'emerging'),
    (p_tenant_id, 'resilience-learning', 'resilience_learning', 'Resilience learning initiative',
     'Collective resilience learning — cross-link Cross-Sector Intelligence Phase 162.', 'emerging'),
    (p_tenant_id, 'future-preparedness', 'future_preparedness', 'Future preparedness program',
     'Future preparedness scaffold — humility, not predictive certainty.', 'emerging'),
    (p_tenant_id, 'community-network', 'community_learning_network', 'Community learning network',
     'Community learning networks — cross-link Civic Collaboration Phase 161.', 'stable'),
    (p_tenant_id, 'gp-collaboration', 'gp_collaboration', 'Growth Partner collaboration program',
     'Growth Partner collaboration — Growth Partner never Affiliate.', 'stable'),
    (p_tenant_id, 'professional-assoc', 'professional_association', 'Professional association learning',
     'Professional association contribution scaffold — opt-in cross-org learning.', 'draft');
end; $$;

create or replace function public._clae_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_adaptation_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_adaptation_reviews (
    tenant_id, review_key, review_type, title, summary, adaptation_signal
  ) values
    (p_tenant_id, 'adaptation-evolution', 'adaptation_evolution', 'How have we evolved?',
     'Executive adaptation review — how the organization has evolved through reflection.', 'stable'),
    (p_tenant_id, 'underutilized-lessons', 'underutilized_lessons', 'Underutilized lessons review',
     'Lessons learned that remain underutilized — leadership decides application.', 'emerging'),
    (p_tenant_id, 'change-resistance', 'change_resistance', 'Resisting change review',
     'Where change is resisted — reflection not judgment.', 'emerging'),
    (p_tenant_id, 'preserve-experiences', 'preserve_experiences', 'Experiences to preserve',
     'Experiences and strengths worth preserving through adaptation.', 'stable'),
    (p_tenant_id, 'future-leaders-prep', 'future_leaders_prep', 'Future leaders preparation',
     'Prepare future leaders — cross-link Future Leaders Phase 151.', 'stable'),
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection session',
     'Leadership reflection metadata — humans accountable, companions support.', 'stable'),
    (p_tenant_id, 'collective-resilience', 'collective_resilience', 'Collective resilience review',
     'Collective resilience reflection — cross-link Phase 162 and Phase 163.', 'emerging'),
    (p_tenant_id, 'preparedness-exercise', 'preparedness_exercise', 'Preparedness exercise review',
     'Preparedness exercise summary — no predictive certainty claims.', 'draft');
end; $$;

create or replace function public._clae_seed_lessons(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_lessons_learned where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_lessons_learned (
    tenant_id, lesson_key, lesson_type, title, summary
  ) values
    (p_tenant_id, 'transformation-lesson', 'transformation_lesson', 'Transformation lesson scaffold',
     'Transformation lessons — cross-link Renewal Phase 155.', 'draft'),
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection entry',
     'Leadership reflection metadata — cross-link Future Leaders Phase 151.', 'draft'),
    (p_tenant_id, 'gp-experience', 'gp_experience', 'Growth Partner experience',
     'Growth Partner learning experience — never Affiliate.', 'draft'),
    (p_tenant_id, 'knowledge-contribution', 'knowledge_contribution', 'Knowledge contribution',
     'Knowledge contribution scaffold — cross-link Global Knowledge Exchange Phase 141.', 'draft'),
    (p_tenant_id, 'preparedness-exercise', 'preparedness_exercise', 'Preparedness exercise lesson',
     'Preparedness exercise metadata — humility, not certainty.', 'draft'),
    (p_tenant_id, 'institutional-narrative', 'institutional_narrative', 'Institutional narrative',
     'Institutional narrative summary — cross-link Civilizational Memory Phase 163.', 'draft'),
    (p_tenant_id, 'assumption-revision', 'assumption_revision', 'Assumption revision lesson',
     'Assumptions to revise — adaptation framework reflection.', 'draft'),
    (p_tenant_id, 'emerging-reality', 'emerging_reality', 'Emerging reality lesson',
     'Emerging realities observed — collective adaptive intelligence through humility.', 'draft');
end; $$;

create or replace function public._clae_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.civilizational_learning_settings;
  v_programs_count int;
  v_reviews_count int;
  v_lessons_count int;
  v_adaptation_score numeric;
begin
  select * into v_settings from public.civilizational_learning_settings where tenant_id = p_tenant_id;
  select count(*) into v_programs_count from public.civilizational_learning_programs where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.civilizational_adaptation_reviews where tenant_id = p_tenant_id;
  select count(*) into v_lessons_count from public.civilizational_lessons_learned where tenant_id = p_tenant_id;
  v_adaptation_score := round(
    coalesce(v_settings.adaptation_readiness_level, 1) * 12.0
    + least(v_programs_count, 8) * 3.0
    + least(v_reviews_count, 8) * 3.5
    + least(v_lessons_count, 8) * 2.5,
    1
  );

  return jsonb_build_object(
    'collective_adaptation_score', v_adaptation_score,
    'adaptation_readiness_level', coalesce(v_settings.adaptation_readiness_level, 1),
    'learning_maturity_stage', coalesce(v_settings.learning_maturity_stage, 'foundational_awareness'),
    'learning_programs_count', v_programs_count,
    'adaptation_reviews_count', v_reviews_count,
    'lessons_learned_count', v_lessons_count,
    'cross_org_learning_opt_in', coalesce(v_settings.cross_org_learning_opt_in, false),
    'era_phases_count', 10,
    'cross_links_count', 11
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_claebp164_)
-- ---------------------------------------------------------------------------
create or replace function public._claebp164_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 164 — Civilizational Learning & Collective Adaptation Engine at /app/civilizational-learning-engine. Post-Enterprise & Civilizational Era (161–170) — Collective Adaptation Center for shared learning and adaptive intelligence. NOT centralized authority. NOT universal consensus. Distinct from Civilizational Memory Phase 163 at /app/civilizational-memory-engine (preservation — cross-link). Distinct from Global Knowledge Exchange Phase 141 at /app/global-knowledge-exchange-engine (exchange — cross-link). Distinct from Continuous Improvement Phase 134 at /app/continuous-improvement-engine (org-level — cross-link). Helpers _claebp164_* — never collide with _gcmebp163_*, _gkeebp141_*, _csiebp162_*. Collective adaptive intelligence through humility — no institution has all answers. Metadata only — no surveillance.';
$$;

create or replace function public._claebp164_mission()
returns text language sql immutable as $$
  select 'Unify collective adaptation visibility across the Post-Enterprise & Civilizational Era — Collective Adaptation Center where organizations learn together through humility, reflection, and shared wisdom without centralized authority.';
$$;

create or replace function public._claebp164_philosophy()
returns text language sql immutable as $$
  select 'People First. Collective learning through humility and reflection — not centralized authority or universal consensus. Growth Partner never Affiliate. Adaptation Companion supports growth — does NOT determine priorities, suppress perspectives, replace leadership accountability, claim predictive certainty, or override governance. Wisdom before speed. No institution has all answers.';
$$;

create or replace function public._claebp164_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Collective Adaptation Center aggregates era 161–170 civilizational learning visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; leaders decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._claebp164_vision()
returns text language sql immutable as $$
  select 'Institutions that learn together with humility — adapting through shared reflection while preserving human accountability — because collective wisdom grows when no single voice claims to have all answers.';
$$;

create or replace function public._claebp164_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'collective_adaptation_center', 'label', 'Collective Adaptation Center', 'emoji', '🌍', 'description', 'Cross-generational programs, adaptive dashboards, lessons learned libraries'),
    jsonb_build_object('key', 'collective_learning', 'label', 'Collective learning engine', 'emoji', '📚', 'description', 'Organizations, GP, knowledge communities, educational institutions — contribution scaffolds'),
    jsonb_build_object('key', 'adaptation_framework', 'label', 'Adaptation framework', 'emoji', '🔄', 'description', 'What learned, assumptions to revise, emerging realities, strengths to preserve'),
    jsonb_build_object('key', 'executive_learning', 'label', 'Executive learning reviews', 'emoji', '🦉', 'description', 'How evolved, underutilized lessons, resisting change, future leaders prep'),
    jsonb_build_object('key', 'adaptation_companion', 'label', 'Adaptation Companion', 'emoji', '💡', 'description', 'Learning summaries and reflection prompts — does NOT determine direction'),
    jsonb_build_object('key', 'collective_resilience', 'label', 'Collective resilience', 'emoji', '🛡️', 'description', 'Knowledge stewardship, mentorship, cross-organizational reflection'),
    jsonb_build_object('key', 'humility_innovation', 'label', 'Humility & innovation', 'emoji', '🌱', 'description', 'No institution has all answers — progress through collaboration'),
    jsonb_build_object('key', 'adaptation_memory', 'label', 'Adaptation memory', 'emoji', '📜', 'description', 'Transformation lessons and institutional narratives — cross-link Phase 163')
  );
$$;

create or replace function public._claebp164_collective_adaptation_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective Adaptation Center — eight capabilities. Shared learning, not centralized authority.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'cross_generational_programs', 'label', 'Cross-generational learning programs', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'adaptive_dashboards', 'label', 'Adaptive intelligence dashboards'),
      jsonb_build_object('key', 'lessons_learned_library', 'label', 'Lessons learned libraries'),
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection sessions'),
      jsonb_build_object('key', 'companion_insights', 'label', 'Companion insight summaries'),
      jsonb_build_object('key', 'knowledge_exchange_networks', 'label', 'Knowledge exchange networks', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'resilience_learning', 'label', 'Resilience learning initiatives', 'cross_link', '/app/cross-sector-intelligence-engine'),
      jsonb_build_object('key', 'future_preparedness', 'label', 'Future preparedness programs')
    )
  );
$$;

create or replace function public._claebp164_collective_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective learning engine — contribution scaffolds across institutions. Opt-in cross-org learning.',
    'contributors', jsonb_build_array(
      jsonb_build_object('key', 'organizations', 'label', 'Participating organizations'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners — never Affiliate', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'knowledge_communities', 'label', 'Knowledge communities', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'professional_associations', 'label', 'Professional associations'),
      jsonb_build_object('key', 'educational_institutions', 'label', 'Educational institutions', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'executive_networks', 'label', 'Executive networks'),
      jsonb_build_object('key', 'cross_sector_partnerships', 'label', 'Cross-sector partnerships', 'cross_link', '/app/cross-sector-intelligence-engine')
    )
  );
$$;

create or replace function public._claebp164_adaptation_framework_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptation framework — structured reflection for collective learning.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'what_learned', 'label', 'What have we learned?'),
      jsonb_build_object('key', 'assumptions_revise', 'label', 'What assumptions should we revise?'),
      jsonb_build_object('key', 'emerging_realities', 'label', 'What emerging realities should we acknowledge?'),
      jsonb_build_object('key', 'strengths_preserve', 'label', 'What strengths should we preserve?'),
      jsonb_build_object('key', 'opportunities_explore', 'label', 'What opportunities should we explore?')
    )
  );
$$;

create or replace function public._claebp164_executive_learning_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive learning reviews — leadership reflection, not surveillance or ranking.',
    'review_questions', jsonb_build_array(
      jsonb_build_object('key', 'how_evolved', 'label', 'How have we evolved?'),
      jsonb_build_object('key', 'underutilized_lessons', 'label', 'What lessons remain underutilized?'),
      jsonb_build_object('key', 'resisting_change', 'label', 'Where are we resisting change?'),
      jsonb_build_object('key', 'preserve_experiences', 'label', 'What experiences should we preserve?'),
      jsonb_build_object('key', 'prepare_future_leaders', 'label', 'How do we prepare future leaders?', 'cross_link', '/app/future-leaders-engine')
    )
  );
$$;

create or replace function public._claebp164_adaptation_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptation Companion supports growth — does NOT determine direction, priorities, or governance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'learning_summaries', 'label', 'Learning summaries'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'preparedness_briefings', 'label', 'Preparedness briefings'),
      jsonb_build_object('key', 'historical_comparisons', 'label', 'Historical comparisons', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'future_considerations', 'label', 'Future consideration frameworks')
    ),
    'must_not', jsonb_build_array(
      'Determine organizational priorities',
      'Suppress dissenting perspectives',
      'Replace leadership accountability',
      'Claim predictive certainty',
      'Override governance decisions'
    )
  );
$$;

create or replace function public._claebp164_collective_resilience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective resilience engine — learning through stewardship and mentorship.',
    'initiatives', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship programs', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development'),
      jsonb_build_object('key', 'gp_collaboration', 'label', 'Growth Partner collaboration', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'community_networks', 'label', 'Community learning networks', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'cross_org_reflection', 'label', 'Cross-organizational reflection', 'cross_link', '/app/cross-sector-intelligence-engine')
    )
  );
$$;

create or replace function public._claebp164_humility_innovation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Humility & innovation framework — no institution has all answers.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'no_all_answers', 'label', 'No institution has all answers'),
      jsonb_build_object('key', 'blind_spots', 'label', 'Every organization has blind spots'),
      jsonb_build_object('key', 'learning_openness', 'label', 'Learning requires openness'),
      jsonb_build_object('key', 'wisdom_humility', 'label', 'Wisdom requires humility'),
      jsonb_build_object('key', 'progress_collaboration', 'label', 'Progress through collaboration — not centralized authority')
    )
  );
$$;

create or replace function public._claebp164_adaptation_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptation memory engine — institutional learning narratives. Cross-link Phase 163 preservation.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'transformation_lessons', 'label', 'Transformation lessons', 'cross_link', '/app/change-management-engine'),
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'Growth Partner experiences'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'preparedness_exercises', 'label', 'Preparedness exercises'),
      jsonb_build_object('key', 'institutional_narratives', 'label', 'Institutional narratives', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._claebp164_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Adaptation Companion limitations — growth support only, not authority.',
    'must_avoid', jsonb_build_array(
      'Determine organizational priorities',
      'Suppress dissenting perspectives',
      'Replace leadership accountability',
      'Claim predictive certainty',
      'Override governance decisions',
      'Impose universal consensus or centralized authority'
    )
  );
$$;

create or replace function public._claebp164_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — humility, curiosity, patience, compassion in collective learning.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'humility', 'label', 'Humility in collective learning'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity about emerging realities'),
      jsonb_build_object('key', 'patience', 'label', 'Patience with adaptation pace'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion for those navigating change'),
      jsonb_build_object('key', 'recognition_growth', 'label', 'Recognition of growth — not ranking'),
      jsonb_build_object('key', 'acceptance_imperfection', 'label', 'Acceptance of imperfection in learning')
    )
  );
$$;

create or replace function public._claebp164_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Civilizational learning security — audit trails, knowledge access controls, RBAC, 2FA.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'learning_audit_logs', 'label', 'Learning audit logs via civilizational_learning_audit_logs'),
      jsonb_build_object('key', 'knowledge_access_controls', 'label', 'Knowledge access controls with RBAC'),
      jsonb_build_object('key', 'leadership_participation', 'label', 'Leadership participation histories'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via civilizational_learning permissions'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for civilizational_learning.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._claebp164_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Civic collaboration — community learning networks'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Cross-sector intelligence — cross-organizational reflection'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'description', 'Preservation — cross-link, do NOT duplicate RPCs'),
    jsonb_build_object('phase', 141, 'key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'description', 'Exchange — cross-link, do NOT duplicate RPCs'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'description', 'Intergenerational leadership — prepare future leaders'),
    jsonb_build_object('phase', 155, 'key', 'change_management', 'label', 'Renewal Phase 155', 'route', '/app/change-management-engine', 'description', 'Organizational renewal — transformation lessons'),
    jsonb_build_object('phase', 134, 'key', 'continuous_improvement', 'label', 'Continuous Improvement Phase 134', 'route', '/app/continuous-improvement-engine', 'description', 'Org-level improvement — cross-link only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine Phase 29/93', 'route', '/app/learning', 'description', 'Operational memory — NOT user education'),
    jsonb_build_object('phase', 115, 'key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'description', 'Continuous learning hub — cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'description', 'Humility, curiosity, patience, compassion in learning'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'description', 'Collective Adaptation Center — shared learning through humility')
  );
$$;

create or replace function public._claebp164_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Collective Adaptation Center internally — metadata-only learning programs, adaptation review scaffolds, and lessons learned libraries. Growth Partner terminology throughout. Humility before authority — no centralized consensus. Cross-org learning opt-in only.';
$$;

create or replace function public._claebp164_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'No institution has all answers.',
    'Collective learning through humility.',
    'Reflection not centralized authority.',
    'Growth Partner — never Affiliate.',
    'Wisdom before speed — leaders decide.'
  );
$$;

create or replace function public._claebp164_privacy_note()
returns text language sql immutable as $$
  select 'Civilizational learning metadata only — aggregate adaptation readiness, program summaries, review scaffolds, and lessons learned libraries. No surveillance. No organizational ranking. Cross-org learning opt-in. Humans decide; Adaptation Companion prepares awareness.';
$$;

create or replace function public._claebp164_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._clae_ensure_settings(p_org_id);
  perform public._clae_seed_programs(p_org_id);
  perform public._clae_seed_reviews(p_org_id);
  perform public._clae_seed_lessons(p_org_id);
  v_metrics := public._clae_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'collective_adaptation_score', coalesce((v_metrics->>'collective_adaptation_score')::numeric, 0),
    'adaptation_readiness_level', coalesce((v_metrics->>'adaptation_readiness_level')::int, 1),
    'learning_maturity_stage', coalesce(v_metrics->>'learning_maturity_stage', 'foundational_awareness'),
    'learning_programs_count', coalesce((v_metrics->>'learning_programs_count')::int, 0),
    'adaptation_reviews_count', coalesce((v_metrics->>'adaptation_reviews_count')::int, 0),
    'lessons_learned_count', coalesce((v_metrics->>'lessons_learned_count')::int, 0),
    'cross_org_learning_opt_in', coalesce((v_metrics->>'cross_org_learning_opt_in')::boolean, false),
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._claebp164_integration_links()),
    'privacy_note', public._claebp164_privacy_note(),
    'not_centralized_authority', true
  );
end; $$;

create or replace function public._claebp164_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._clae_ensure_settings(p_org_id);
  perform public._clae_seed_programs(p_org_id);
  perform public._clae_seed_reviews(p_org_id);
  perform public._clae_seed_lessons(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'collective_adaptation_center', 'label', 'Collective Adaptation Center — eight capabilities', 'met', jsonb_array_length(public._claebp164_collective_adaptation_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'collective_learning', 'label', 'Collective learning engine — seven contributors', 'met', jsonb_array_length(public._claebp164_collective_learning_engine()->'contributors') = 7, 'note', null),
    jsonb_build_object('key', 'adaptation_framework', 'label', 'Adaptation framework — five dimensions', 'met', jsonb_array_length(public._claebp164_adaptation_framework_engine()->'dimensions') = 5, 'note', null),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive learning reviews — five questions', 'met', jsonb_array_length(public._claebp164_executive_learning_reviews()->'review_questions') = 5, 'note', null),
    jsonb_build_object('key', 'programs_seeded', 'label', 'Learning programs seeded', 'met', (select count(*) >= 8 from public.civilizational_learning_programs p where p.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Adaptation reviews seeded', 'met', (select count(*) >= 8 from public.civilizational_adaptation_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'lessons_seeded', 'label', 'Lessons learned seeded', 'met', (select count(*) >= 8 from public.civilizational_lessons_learned l where l.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links documented', 'met', jsonb_array_length(public._claebp164_integration_links()) >= 11, 'note', null),
    jsonb_build_object('key', 'default_readiness', 'label', 'Default adaptation readiness level 1', 'met', exists (select 1 from public.civilizational_learning_settings s where s.tenant_id = p_org_id and s.adaptation_readiness_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.civilizational_learning_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'cross_org_opt_in', 'label', 'cross_org_learning_opt_in default false', 'met', exists (select 1 from public.civilizational_learning_settings s where s.tenant_id = p_org_id and s.cross_org_learning_opt_in = false), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no priority or governance override', 'met', jsonb_array_length(public._claebp164_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._claebp164_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 164 baseline tables and RPCs', 'met', to_regclass('public.civilizational_learning_settings') is not null, 'note', '_clae_* helpers intact')
  );
end; $$;

create or replace function public._claebp164_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 164 — Civilizational Learning & Collective Adaptation Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE164_CIVILIZATIONAL_LEARNING_COLLECTIVE_ADAPTATION.md',
    'engine_phase', 'Repo Phase 164 Civilizational Learning Engine',
    'route', '/app/civilizational-learning-engine',
    'mapping_note', 'Post-Enterprise Era 161–170 — collective adaptation through humility. Era phase engines remain authoritative.',
    'distinction_note', public._claebp164_distinction_note(),
    'mission', public._claebp164_mission(),
    'philosophy', public._claebp164_philosophy(),
    'abos_principle', public._claebp164_abos_principle(),
    'vision', public._claebp164_vision(),
    'objectives', public._claebp164_objectives(),
    'collective_adaptation_center', public._claebp164_collective_adaptation_center(),
    'collective_learning_engine', public._claebp164_collective_learning_engine(),
    'adaptation_framework_engine', public._claebp164_adaptation_framework_engine(),
    'executive_learning_reviews', public._claebp164_executive_learning_reviews(),
    'adaptation_companion', public._claebp164_adaptation_companion(),
    'collective_resilience_engine', public._claebp164_collective_resilience_engine(),
    'humility_innovation_framework', public._claebp164_humility_innovation_framework(),
    'adaptation_memory_engine', public._claebp164_adaptation_memory_engine(),
    'companion_limitations', public._claebp164_companion_limitations(),
    'self_love_connection', public._claebp164_self_love_connection(),
    'security_requirements', public._claebp164_security_requirements(),
    'integration_links', public._claebp164_integration_links(),
    'dogfooding', public._claebp164_dogfooding(),
    'success_criteria', public._claebp164_success_criteria(p_org_id),
    'engagement_summary', public._claebp164_engagement_summary(p_org_id),
    'vision_phrases', public._claebp164_vision_phrases(),
    'privacy_note', public._claebp164_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_civilizational_adaptation_review(
  p_review_type text,
  p_title text,
  p_summary text,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._clae_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_adaptation_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._clae_log_audit(v_tenant_id, 'adaptation_review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.contribute_civilizational_lesson_learned(
  p_lesson_type text,
  p_title text,
  p_summary text,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._clae_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Lesson summary max 500 characters'; end if;
  v_key := p_lesson_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_lessons_learned (
    tenant_id, lesson_key, lesson_type, title, summary
  ) values (v_tenant_id, v_key, p_lesson_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._clae_log_audit(v_tenant_id, 'lesson_contributed', left(p_summary, 120),
    jsonb_build_object('lesson_id', v_id, 'lesson_type', p_lesson_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_civilizational_learning_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_learning_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._clae_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._clae_ensure_settings(v_tenant_id);
  perform public._clae_seed_programs(v_tenant_id);
  perform public._clae_seed_reviews(v_tenant_id);
  perform public._clae_seed_lessons(v_tenant_id);
  v_metrics := public._clae_refresh_metrics(v_tenant_id);
  v_engagement := public._claebp164_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'collective_adaptation_score', v_metrics->'collective_adaptation_score',
    'adaptation_readiness_level', v_settings.adaptation_readiness_level,
    'adaptation_reviews_count', v_metrics->'adaptation_reviews_count',
    'philosophy', public._claebp164_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'cross_org_learning_opt_in', v_settings.cross_org_learning_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 164 — Civilizational Learning & Collective Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE164_CIVILIZATIONAL_LEARNING_COLLECTIVE_ADAPTATION.md',
      'engine_phase', 'Repo Phase 164 Civilizational Learning Engine',
      'route', '/app/civilizational-learning-engine',
      'mapping_note', 'Post-Enterprise Era 161–170 — collective adaptation through humility.'
    ),
    'civilizational_learning_mission', public._claebp164_mission(),
    'civilizational_learning_abos_principle', public._claebp164_abos_principle(),
    'civilizational_learning_engagement_summary', v_engagement,
    'civilizational_learning_note', public._claebp164_distinction_note(),
    'civilizational_learning_vision_note', public._claebp164_vision()
  );
end; $$;

create or replace function public.get_civilizational_learning_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_learning_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._clae_require_tenant());
  v_settings := public._clae_ensure_settings(v_tenant_id);
  perform public._clae_seed_programs(v_tenant_id);
  perform public._clae_seed_reviews(v_tenant_id);
  perform public._clae_seed_lessons(v_tenant_id);
  v_metrics := public._clae_refresh_metrics(v_tenant_id);
  perform public._clae_log_audit(v_tenant_id, 'dashboard_view', 'Civilizational Learning dashboard viewed',
    jsonb_build_object('collective_adaptation_score', v_metrics->>'collective_adaptation_score', 'readiness_level', v_settings.adaptation_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'adaptation_readiness_level', v_settings.adaptation_readiness_level,
    'learning_maturity_stage', v_settings.learning_maturity_stage,
    'cross_org_learning_opt_in', v_settings.cross_org_learning_opt_in,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._claebp164_philosophy(),
    'safety_note', 'Civilizational Learning Engine — metadata-only aggregates. NOT centralized authority. Era phase engines remain authoritative — cross-link only. Humility before authority.',
    'distinction_note', public._claebp164_distinction_note(),
    'collective_adaptation_score', v_metrics->'collective_adaptation_score',
    'learning_programs_count', v_metrics->'learning_programs_count',
    'adaptation_reviews_count', v_metrics->'adaptation_reviews_count',
    'lessons_learned_count', v_metrics->'lessons_learned_count',
    'learning_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'program_type', p.program_type,
        'title', p.title, 'summary', p.summary, 'status', p.status,
        'adaptation_signal', p.adaptation_signal, 'captured_at', p.captured_at
      ) order by p.captured_at desc)
      from public.civilizational_learning_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'adaptation_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'adaptation_signal', r.adaptation_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.civilizational_adaptation_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'lessons_learned', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'lesson_key', l.lesson_key, 'lesson_type', l.lesson_type,
        'title', l.title, 'summary', l.summary, 'status', l.status, 'captured_at', l.captured_at
      ) order by l.captured_at desc)
      from public.civilizational_lessons_learned l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._claebp164_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 164 — Civilizational Learning & Collective Adaptation Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE164_CIVILIZATIONAL_LEARNING_COLLECTIVE_ADAPTATION.md',
      'engine_phase', 'Repo Phase 164 Civilizational Learning Engine',
      'route', '/app/civilizational-learning-engine',
      'mapping_note', 'Post-Enterprise Era 161–170 — Collective Adaptation Center.'
    ),
    'civilizational_learning_engine_note', 'Civilizational Learning Engine (ABOS Phase 164) — collective adaptation through humility. Cross-link era 161–163 and related phases — do NOT duplicate RPCs.',
    'civilizational_learning_blueprint', public._claebp164_blueprint_block(v_tenant_id),
    'civilizational_learning_distinction_note', public._claebp164_distinction_note(),
    'civilizational_learning_mission', public._claebp164_mission(),
    'civilizational_learning_philosophy', public._claebp164_philosophy(),
    'civilizational_learning_abos_principle', public._claebp164_abos_principle(),
    'civilizational_learning_objectives', public._claebp164_objectives(),
    'collective_adaptation_center_meta', public._claebp164_collective_adaptation_center(),
    'collective_learning_engine_meta', public._claebp164_collective_learning_engine(),
    'adaptation_framework_engine_meta', public._claebp164_adaptation_framework_engine(),
    'executive_learning_reviews_meta', public._claebp164_executive_learning_reviews(),
    'adaptation_companion_meta', public._claebp164_adaptation_companion(),
    'collective_resilience_engine_meta', public._claebp164_collective_resilience_engine(),
    'humility_innovation_framework_meta', public._claebp164_humility_innovation_framework(),
    'adaptation_memory_engine_meta', public._claebp164_adaptation_memory_engine(),
    'companion_limitations_meta', public._claebp164_companion_limitations(),
    'self_love_connection_meta', public._claebp164_self_love_connection(),
    'security_requirements_meta', public._claebp164_security_requirements(),
    'claebp164_integration_links', public._claebp164_integration_links(),
    'civilizational_learning_engagement_summary', public._claebp164_engagement_summary(v_tenant_id),
    'civilizational_learning_success_criteria', public._claebp164_success_criteria(v_tenant_id),
    'civilizational_learning_vision', public._claebp164_vision(),
    'civilizational_learning_vision_phrases', public._claebp164_vision_phrases(),
    'civilizational_learning_privacy_note', public._claebp164_privacy_note(),
    'civilizational_learning_dogfooding', public._claebp164_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'civilizational-learning-engine', 'Civilizational Learning & Collective Adaptation Engine',
  'Post-Enterprise Era 161–170 — Collective Adaptation Center. Shared learning through humility — not centralized authority.',
  'authenticated', 174
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'civilizational-learning-engine' and tenant_id is null
);

grant execute on function public.get_civilizational_learning_engine_card(uuid) to authenticated;
grant execute on function public.get_civilizational_learning_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_civilizational_adaptation_review(text, text, text, uuid) to authenticated;
grant execute on function public.contribute_civilizational_lesson_learned(text, text, text, uuid) to authenticated;
grant execute on function public._claebp164_distinction_note() to authenticated;
grant execute on function public._claebp164_mission() to authenticated;
grant execute on function public._claebp164_philosophy() to authenticated;
grant execute on function public._claebp164_abos_principle() to authenticated;
grant execute on function public._claebp164_vision() to authenticated;
grant execute on function public._claebp164_objectives() to authenticated;
grant execute on function public._claebp164_collective_adaptation_center() to authenticated;
grant execute on function public._claebp164_collective_learning_engine() to authenticated;
grant execute on function public._claebp164_adaptation_framework_engine() to authenticated;
grant execute on function public._claebp164_executive_learning_reviews() to authenticated;
grant execute on function public._claebp164_adaptation_companion() to authenticated;
grant execute on function public._claebp164_collective_resilience_engine() to authenticated;
grant execute on function public._claebp164_humility_innovation_framework() to authenticated;
grant execute on function public._claebp164_adaptation_memory_engine() to authenticated;
grant execute on function public._claebp164_companion_limitations() to authenticated;
grant execute on function public._claebp164_self_love_connection() to authenticated;
grant execute on function public._claebp164_security_requirements() to authenticated;
grant execute on function public._claebp164_integration_links() to authenticated;
grant execute on function public._claebp164_dogfooding() to authenticated;
grant execute on function public._claebp164_vision_phrases() to authenticated;
grant execute on function public._claebp164_privacy_note() to authenticated;
grant execute on function public._claebp164_engagement_summary(uuid) to authenticated;
grant execute on function public._claebp164_success_criteria(uuid) to authenticated;
grant execute on function public._claebp164_blueprint_block(uuid) to authenticated;
