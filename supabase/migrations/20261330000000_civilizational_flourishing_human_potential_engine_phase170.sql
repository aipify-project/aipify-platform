-- Phase 170 — Civilizational Flourishing & Human Potential Engine
-- Post-Enterprise & Civilizational Era (161–170) capstone — Human Flourishing Center.
-- Technology serves humanity — NOT human worth metrics, productivity-based worth, or employee surveillance.
-- Distinct from Living Enterprise Phase 160 (/app/living-enterprise-engine — era 151–160 capstone).
-- Distinct from Global Stewardship Phase 150 (/app/global-stewardship-collective-future-engine — era 141–150 capstone).
-- Helpers: _cfhp_* (engine), _cfhpbp170_* (blueprint — never collide with _letebp160_*, _gscfebp150_*, _cstcebp169_*)

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
    'human_flourishing_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. human_flourishing_settings
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  flourishing_readiness_level int not null default 1 check (flourishing_readiness_level between 1 and 5),
  development_mode text not null default 'guided' check (
    development_mode in ('guided', 'community_led', 'executive_sponsored')
  ),
  belonging_reflection_enabled boolean not null default true,
  strengths_development_enabled boolean not null default true,
  lifelong_learning_enabled boolean not null default true,
  leadership_growth_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  development_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_worth_scoring":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.human_flourishing_settings enable row level security;
revoke all on public.human_flourishing_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. human_flourishing_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'people_thriving', 'growth_barriers', 'belonging_cultivation',
      'future_leaders_support', 'purpose_strengthening', 'learning_accessibility',
      'strengths_recognition', 'community_contribution'
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

create index if not exists human_flourishing_reviews_tenant_idx
  on public.human_flourishing_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.human_flourishing_reviews enable row level security;
revoke all on public.human_flourishing_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. human_flourishing_belonging_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_belonging_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (
    reflection_type in (
      'recognition_culture', 'mentorship_accessibility', 'inclusive_leadership',
      'knowledge_communities', 'cross_functional_learning', 'gp_participation',
      'belonging_themes', 'culture_review'
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

create index if not exists human_flourishing_belonging_reflections_tenant_idx
  on public.human_flourishing_belonging_reflections (tenant_id, reflection_type, status);

alter table public.human_flourishing_belonging_reflections enable row level security;
revoke all on public.human_flourishing_belonging_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. human_flourishing_strengths_notes
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_strengths_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (
    note_type in (
      'talent_theme', 'leadership_potential', 'learning_interest', 'aspiration',
      'community_contribution', 'collaborative_strength', 'development_path'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"nurture_not_rank":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);

create index if not exists human_flourishing_strengths_notes_tenant_idx
  on public.human_flourishing_strengths_notes (tenant_id, note_type, status);

alter table public.human_flourishing_strengths_notes enable row level security;
revoke all on public.human_flourishing_strengths_notes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. human_flourishing_learning_records
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_learning_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  record_key text not null,
  record_type text not null check (
    record_type in (
      'curiosity_exploration', 'experimentation', 'continuous_learning',
      'knowledge_stewardship', 'professional_growth', 'personal_growth',
      'leadership_development', 'community_learning'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'completed', 'paused', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"participation_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, record_key)
);

create index if not exists human_flourishing_learning_records_tenant_idx
  on public.human_flourishing_learning_records (tenant_id, record_type, status);

alter table public.human_flourishing_learning_records enable row level security;
revoke all on public.human_flourishing_learning_records from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. human_flourishing_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.human_flourishing_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.human_flourishing_audit_logs enable row level security;
revoke all on public.human_flourishing_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'human_flourishing_engine', v.description
from (values
  ('human_flourishing.view', 'View Human Flourishing Center', 'View flourishing reviews, belonging reflections, strengths notes, and learning participation metadata'),
  ('human_flourishing.manage', 'Manage Human Flourishing Center', 'Update flourishing settings, development programs, and governance preferences'),
  ('human_flourishing.steward', 'Steward Human Flourishing Center', 'Conduct executive flourishing reviews and record belonging or strengths metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'human_flourishing.view'), ('owner', 'human_flourishing.manage'), ('owner', 'human_flourishing.steward'),
  ('administrator', 'human_flourishing.view'), ('administrator', 'human_flourishing.manage'), ('administrator', 'human_flourishing.steward'),
  ('manager', 'human_flourishing.view'), ('manager', 'human_flourishing.steward'),
  ('employee', 'human_flourishing.view'),
  ('support_agent', 'human_flourishing.view'),
  ('moderator', 'human_flourishing.view'),
  ('viewer', 'human_flourishing.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_cfhp_*)
-- ---------------------------------------------------------------------------
create or replace function public._cfhp_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cfhp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cfhp_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cfhp_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.human_flourishing_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cfhp_ensure_settings(p_tenant_id uuid)
returns public.human_flourishing_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.human_flourishing_settings;
begin
  insert into public.human_flourishing_settings (tenant_id, enabled, development_mode)
  values (p_tenant_id, true, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.human_flourishing_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cfhp_seed_learning_records(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.human_flourishing_learning_records where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.human_flourishing_learning_records (tenant_id, record_key, record_type, title, summary, status) values
    (p_tenant_id, 'curiosity-exploration', 'curiosity_exploration', 'Curiosity & Exploration Programs', 'Lifelong learning scaffolds for curiosity-led discovery — metadata participation only.', 'planned'),
    (p_tenant_id, 'experimentation-lab', 'experimentation', 'Experimentation & Discovery Lab', 'Safe experimentation themes — nurture learning, not performance ranking.', 'planned'),
    (p_tenant_id, 'continuous-learning', 'continuous_learning', 'Continuous Learning Pathways', 'Professional and personal growth participation metadata — cross-link Learning Engine.', 'planned'),
    (p_tenant_id, 'knowledge-stewardship', 'knowledge_stewardship', 'Knowledge Stewardship Initiatives', 'Knowledge sharing and stewardship scaffolds — cross-link Civilizational Memory 163.', 'planned'),
    (p_tenant_id, 'professional-growth', 'professional_growth', 'Professional Growth Programs', 'Leadership and skill development program metadata — not worth scoring.', 'planned'),
    (p_tenant_id, 'personal-growth', 'personal_growth', 'Personal Growth Reflection', 'Self-awareness and balance themes — cross-link Self Love A.76.', 'planned'),
    (p_tenant_id, 'leadership-development', 'leadership_development', 'Leadership Development Access', 'Leadership growth accessibility scaffolds — cross-link Future Leaders 151.', 'planned'),
    (p_tenant_id, 'community-learning', 'community_learning', 'Community Learning Contributions', 'Community knowledge contribution metadata — cross-link Civic Collaboration 161.', 'planned');
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_cfhpbp170_*)
-- ---------------------------------------------------------------------------
create or replace function public._cfhpbp170_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 170 — Civilizational Flourishing & Human Potential Engine at /app/human-flourishing-engine. Post-Enterprise & Civilizational Era (161–170) capstone — Human Flourishing Center. Technology serves humanity — NOT human worth metrics, productivity-based worth scoring, or employee surveillance. Distinct from Living Enterprise Phase 160 at /app/living-enterprise-engine (era 151–160 capstone — cross-link only). Distinct from Global Stewardship Phase 150 at /app/global-stewardship-collective-future-engine (era 141–150 capstone — different era). Helpers _cfhpbp170_* — never collide with _letebp160_*, _gscfebp150_*, _cstcebp169_*. Growth Partner not Affiliate. Companion supports growth — does NOT define human value.';
$$;

create or replace function public._cfhpbp170_mission()
returns text language sql immutable as $$
  select 'Help organizations cultivate human flourishing and unlock human potential through development programs, belonging, lifelong learning, and strength-based growth — without assigning human worth by productivity, surveillance, or ranking.';
$$;

create or replace function public._cfhpbp170_philosophy()
returns text language sql immutable as $$
  select 'People First. Technology serves humanity — not the reverse. Companion supports growth and reflection; it does NOT define human value or assign worth by productivity. Growth Partner terminology — never Affiliate. Aggregate metadata only — not employee surveillance.';
$$;

create or replace function public._cfhpbp170_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Human Flourishing Center aggregates development visibility across the Post-Enterprise & Civilizational Era (161–170). Era engines 161–169, Future Leaders 151, Human Success, Learning, Purpose, Inclusion A.83, and Self Love A.76 remain authoritative for their domains. Aipify informs and prepares; humans and leadership decide.';
$$;

create or replace function public._cfhpbp170_vision()
returns text language sql immutable as $$
  select 'Organizations where people feel valued, discover strengths, access learning and leadership opportunities, and contribute to flourishing communities — technology amplifying human dignity, curiosity, and continuous growth.';
$$;

create or replace function public._cfhpbp170_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_development_programs', 'label', 'Human development programs', 'emoji', '🌱', 'description', 'Growth and development program scaffolds'),
    jsonb_build_object('key', 'leadership_growth', 'label', 'Leadership growth initiatives', 'emoji', '🎓', 'description', 'Accessible leadership development — cross-link Future Leaders 151'),
    jsonb_build_object('key', 'belonging_culture', 'label', 'Belonging & culture reviews', 'emoji', '🤝', 'description', 'Aggregate belonging themes — not surveillance'),
    jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection', 'emoji', '✨', 'description', 'Flourishing Companion — does NOT define human worth'),
    jsonb_build_object('key', 'learning_dashboards', 'label', 'Learning opportunity dashboards', 'emoji', '📚', 'description', 'Lifelong learning participation metadata'),
    jsonb_build_object('key', 'strengths_development', 'label', 'Strength-based development', 'emoji', '💪', 'description', 'Nurture talents — nurture NOT rank'),
    jsonb_build_object('key', 'community_contribution', 'label', 'Community contribution', 'emoji', '🌍', 'description', 'Community learning and contribution themes'),
    jsonb_build_object('key', 'flourishing_libraries', 'label', 'Flourishing knowledge libraries', 'emoji', '📖', 'description', 'Development resources and knowledge sharing')
  );
$$;

create or replace function public._cfhpbp170_human_flourishing_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human Flourishing Center — eight capabilities. Technology serves humanity — not worth scoring.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'human_development_programs', 'label', 'Human development programs'),
      jsonb_build_object('key', 'leadership_growth_initiatives', 'label', 'Leadership growth initiatives', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'belonging_culture_reviews', 'label', 'Belonging & culture reviews'),
      jsonb_build_object('key', 'companion_reflection', 'label', 'Companion reflection prompts'),
      jsonb_build_object('key', 'learning_opportunity_dashboards', 'label', 'Learning opportunity dashboards', 'cross_link', '/app/learning'),
      jsonb_build_object('key', 'strength_based_development', 'label', 'Strength-based development'),
      jsonb_build_object('key', 'community_contribution', 'label', 'Community contribution', 'cross_link', '/app/civic-collaboration-engine'),
      jsonb_build_object('key', 'flourishing_knowledge_libraries', 'label', 'Flourishing knowledge libraries', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._cfhpbp170_human_potential_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Human potential engine — how people are growing, feel valued, access opportunities, recognize strengths, and discover potential.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'people_growing', 'label', 'How people are growing'),
      jsonb_build_object('key', 'feel_valued', 'label', 'Feel valued — aggregate themes, not individual scoring'),
      jsonb_build_object('key', 'opportunities_accessible', 'label', 'Opportunities accessible'),
      jsonb_build_object('key', 'recognize_strengths', 'label', 'Recognize strengths — nurture not rank'),
      jsonb_build_object('key', 'discover_potential', 'label', 'Discover potential — curiosity-led')
    )
  );
$$;

create or replace function public._cfhpbp170_flourishing_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Flourishing framework — seven domains for human-centered organizational development.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'learning_opportunities', 'label', 'Learning opportunities', 'cross_link', '/app/learning'),
      jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition — not productivity worth scoring'),
      jsonb_build_object('key', 'belonging', 'label', 'Belonging', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'gp_development', 'label', 'Growth Partner development', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._cfhpbp170_executive_flourishing_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive flourishing reviews — leadership reflection on people thriving, growth barriers, belonging, future leaders, and purpose.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'people_thriving', 'label', 'Are people thriving? — aggregate themes'),
      jsonb_build_object('key', 'growth_barriers', 'label', 'What barriers limit growth?'),
      jsonb_build_object('key', 'cultivate_belonging', 'label', 'How can we cultivate belonging?'),
      jsonb_build_object('key', 'support_future_leaders', 'label', 'How do we support future leaders?', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'strengthen_purpose', 'label', 'How do we strengthen purpose?', 'cross_link', '/app/purpose-values-engine')
    )
  );
$$;

create or replace function public._cfhpbp170_flourishing_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Flourishing Companion — reflection and development support. Does NOT define human worth.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations', 'cross_link', '/app/learning'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'growth_opportunity_insights', 'label', 'Growth opportunity insights — informational only'),
      jsonb_build_object('key', 'belonging_summaries', 'label', 'Belonging summaries — aggregate not surveillance'),
      jsonb_build_object('key', 'development_resources', 'label', 'Development resources')
    )
  );
$$;

create or replace function public._cfhpbp170_belonging_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Belonging engine — recognition, mentorship, inclusive leadership, knowledge communities — aggregates NOT surveillance.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'recognition', 'label', 'Recognition culture themes'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship accessibility', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'inclusive_leadership', 'label', 'Inclusive leadership', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'knowledge_communities', 'label', 'Knowledge communities'),
      jsonb_build_object('key', 'cross_functional_learning', 'label', 'Cross-functional learning'),
      jsonb_build_object('key', 'gp_participation', 'label', 'Growth Partner participation', 'cross_link', '/app/growth-partner-operations')
    )
  );
$$;

create or replace function public._cfhpbp170_strengths_development_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strengths development engine — nurture talents and aspirations. Nurture NOT rank.',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'talents', 'label', 'Talents and aptitudes'),
      jsonb_build_object('key', 'leadership_potential', 'label', 'Leadership potential themes'),
      jsonb_build_object('key', 'learning_interests', 'label', 'Learning interests'),
      jsonb_build_object('key', 'aspirations', 'label', 'Aspirations'),
      jsonb_build_object('key', 'community_contributions', 'label', 'Community contributions'),
      jsonb_build_object('key', 'collaborative_strengths', 'label', 'Collaborative strengths')
    )
  );
$$;

create or replace function public._cfhpbp170_lifelong_learning_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Lifelong learning framework — curiosity, experimentation, continuous learning, and knowledge stewardship.',
    'pillars', jsonb_build_array(
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity', 'cross_link', '/app/curiosity-discovery-engine'),
      jsonb_build_object('key', 'experimentation', 'label', 'Experimentation'),
      jsonb_build_object('key', 'continuous_learning', 'label', 'Continuous learning', 'cross_link', '/app/learning'),
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/civilizational-memory-engine'),
      jsonb_build_object('key', 'professional_growth', 'label', 'Professional growth'),
      jsonb_build_object('key', 'personal_growth', 'label', 'Personal growth', 'cross_link', '/app/self-love-engine')
    )
  );
$$;

create or replace function public._cfhpbp170_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Determine human value',
      'Assign worth by productivity',
      'Replace human relationships',
      'Suppress individuality',
      'Override leadership judgment',
      'Employee surveillance for flourishing metrics'
    ),
    'principle', 'Flourishing Companion supports growth — humans define dignity and leadership decide development priorities.'
  );
$$;

create or replace function public._cfhpbp170_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — self-awareness, compassion, confidence, curiosity, balance, and continuous growth.',
    'values', jsonb_build_array(
      'self_awareness', 'compassion', 'confidence', 'curiosity', 'balance', 'continuous_growth'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._cfhpbp170_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'development_review_audit_logs', 'label', 'Development review audit logs via human_flourishing_audit_logs'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via human_flourishing permissions'),
      jsonb_build_object('key', 'learning_participation_controls', 'label', 'Learning participation controls — metadata only'),
      jsonb_build_object('key', 'personal_growth_privacy', 'label', 'Personal growth privacy protections'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cfhpbp170_era_capstone_summary()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Era opener — public value and civic collaboration'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Societal resilience and cross-sector learning'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'description', 'Knowledge preservation with discernment'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'description', 'Collective adaptation and learning'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'description', 'Long-horizon intelligence — not prediction'),
    jsonb_build_object('phase', 166, 'key', 'civilizational_coordination', 'label', 'Civilizational Coordination Phase 166', 'route', '/app/civilizational-coordination-engine', 'description', 'Voluntary shared action coordination'),
    jsonb_build_object('phase', 167, 'key', 'shared_prosperity', 'label', 'Shared Prosperity Phase 167', 'route', '/app/shared-prosperity-engine', 'description', 'Regenerative prosperity and stewardship'),
    jsonb_build_object('phase', 168, 'key', 'constructive_dialogue', 'label', 'Constructive Dialogue Phase 168', 'route', '/app/constructive-dialogue-engine', 'description', 'Peacebuilding and healthy disagreement'),
    jsonb_build_object('phase', 169, 'key', 'social_cohesion', 'label', 'Social Cohesion Phase 169', 'route', '/app/social-cohesion-engine', 'description', 'Social cohesion and collective trust themes'),
    jsonb_build_object('phase', 170, 'key', 'human_flourishing', 'label', 'Human Flourishing Phase 170', 'route', '/app/human-flourishing-engine', 'description', 'Era capstone — Civilizational Flourishing & Human Potential Center')
  );
$$;

create or replace function public._cfhpbp170_extended_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 160, 'key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'relationship', 'Prior era capstone — Legacy & Future Stewardship era (151–160) — different era'),
    jsonb_build_object('phase', 150, 'key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Global Intelligence era capstone (141–150) — different era'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Leadership development and mentorship'),
    jsonb_build_object('key', 'human_success', 'label', 'Human Success Engine', 'route', '/app/human-success', 'relationship', 'Human success themes — cross-link only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine Phase 29', 'route', '/app/learning', 'relationship', 'Controlled learning and review center'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82', 'route', '/app/purpose-values-engine', 'relationship', 'Purpose alignment — cross-link only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Inclusive leadership and belonging cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness, compassion, and balance')
  );
$$;

create or replace function public._cfhpbp170_integration_links()
returns jsonb language sql immutable as $$
  select public._cfhpbp170_era_capstone_summary() || public._cfhpbp170_extended_cross_links();
$$;

create or replace function public._cfhpbp170_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Human Flourishing Center internally with metadata-only executive reviews, belonging reflection scaffolds, strengths notes, and learning participation records. Growth Partner terminology throughout. No human worth metrics or productivity-based worth scoring.';
$$;

create or replace function public._cfhpbp170_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Technology serves humanity.',
    'People First — dignity preserved.',
    'Growth supported — worth never scored.',
    'Curiosity and continuous learning.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._cfhpbp170_privacy_note()
returns text language sql immutable as $$
  select 'Human Flourishing metadata only — executive review summaries max ~500 chars, belonging reflection aggregates, strengths development notes, learning participation records. No human worth metrics, productivity-based worth scoring, PII surveillance, or employee ranking.';
$$;

create or replace function public._cfhpbp170_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cfhp_ensure_settings(p_org_id);
  perform public._cfhp_seed_learning_records(p_org_id);
  v_metrics := public._cfhp_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'human_flourishing_score', coalesce((v_metrics->>'human_flourishing_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'development_mode', coalesce(v_metrics->>'development_mode', 'guided'),
    'flourishing_readiness_level', coalesce((v_metrics->>'flourishing_readiness_level')::int, 1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int, 0),
    'belonging_reflections_count', coalesce((v_metrics->>'belonging_reflections_count')::int, 0),
    'strengths_notes_count', coalesce((v_metrics->>'strengths_notes_count')::int, 0),
    'learning_records_count', coalesce((v_metrics->>'learning_records_count')::int, 0),
    'active_learning_count', coalesce((v_metrics->>'active_learning_count')::int, 0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int, 0),
    'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int, 0),
    'privacy_note', public._cfhpbp170_privacy_note(),
    'not_worth_scoring', true
  );
end; $$;

create or replace function public._cfhpbp170_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cfhp_ensure_settings(p_org_id);
  perform public._cfhp_seed_learning_records(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'human_flourishing_center', 'label', 'Human Flourishing Center — eight capabilities', 'met', jsonb_array_length(public._cfhpbp170_human_flourishing_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'human_potential_engine', 'label', 'Human potential engine — five dimensions', 'met', jsonb_array_length(public._cfhpbp170_human_potential_engine()->'dimensions') = 5, 'note', null),
    jsonb_build_object('key', 'flourishing_framework', 'label', 'Flourishing framework — seven domains', 'met', jsonb_array_length(public._cfhpbp170_flourishing_framework()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'executive_flourishing_reviews', 'label', 'Executive flourishing reviews — five themes', 'met', jsonb_array_length(public._cfhpbp170_executive_flourishing_reviews()->'review_themes') = 5, 'note', null),
    jsonb_build_object('key', 'flourishing_companion', 'label', 'Flourishing Companion — six capabilities', 'met', jsonb_array_length(public._cfhpbp170_flourishing_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'belonging_engine', 'label', 'Belonging engine — six capabilities', 'met', jsonb_array_length(public._cfhpbp170_belonging_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'strengths_development_engine', 'label', 'Strengths development engine — six themes', 'met', jsonb_array_length(public._cfhpbp170_strengths_development_engine()->'themes') = 6, 'note', null),
    jsonb_build_object('key', 'lifelong_learning_framework', 'label', 'Lifelong learning framework — six pillars', 'met', jsonb_array_length(public._cfhpbp170_lifelong_learning_framework()->'pillars') = 6, 'note', null),
    jsonb_build_object('key', 'learning_records_seeded', 'label', 'Learning records — eight types seeded', 'met', (select count(*) >= 8 from public.human_flourishing_learning_records r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._cfhpbp170_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era_capstone', 'label', 'Era 161–170 capstone — ten phases documented', 'met', jsonb_array_length(public._cfhpbp170_era_capstone_summary()) = 10, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 170 baseline tables and RPCs', 'met', to_regclass('public.human_flourishing_settings') is not null, 'note', '_cfhp_* helpers intact')
  );
end; $$;

create or replace function public._cfhpbp170_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 170 — Civilizational Flourishing & Human Potential Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE170_CIVILIZATIONAL_FLOURISHING_HUMAN_POTENTIAL.md',
    'engine_phase', 'Repo Phase 170 Human Flourishing Engine',
    'route', '/app/human-flourishing-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) capstone — technology serves humanity.',
    'distinction_note', public._cfhpbp170_distinction_note(),
    'mission', public._cfhpbp170_mission(),
    'philosophy', public._cfhpbp170_philosophy(),
    'abos_principle', public._cfhpbp170_abos_principle(),
    'vision', public._cfhpbp170_vision(),
    'objectives', public._cfhpbp170_objectives(),
    'human_flourishing_center', public._cfhpbp170_human_flourishing_center(),
    'human_potential_engine', public._cfhpbp170_human_potential_engine(),
    'flourishing_framework', public._cfhpbp170_flourishing_framework(),
    'executive_flourishing_reviews', public._cfhpbp170_executive_flourishing_reviews(),
    'flourishing_companion', public._cfhpbp170_flourishing_companion(),
    'belonging_engine', public._cfhpbp170_belonging_engine(),
    'strengths_development_engine', public._cfhpbp170_strengths_development_engine(),
    'lifelong_learning_framework', public._cfhpbp170_lifelong_learning_framework(),
    'companion_limitations', public._cfhpbp170_companion_limitations(),
    'self_love_connection', public._cfhpbp170_self_love_connection(),
    'security_requirements', public._cfhpbp170_security_requirements(),
    'era_capstone_summary', public._cfhpbp170_era_capstone_summary(),
    'integration_links', public._cfhpbp170_integration_links(),
    'dogfooding', public._cfhpbp170_dogfooding(),
    'success_criteria', public._cfhpbp170_success_criteria(p_org_id),
    'engagement_summary', public._cfhpbp170_engagement_summary(p_org_id),
    'vision_phrases', public._cfhpbp170_vision_phrases(),
    'privacy_note', public._cfhpbp170_privacy_note()
  );
$$;

create or replace function public._cfhp_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.human_flourishing_settings;
  v_reviews_count int;
  v_belonging_count int;
  v_strengths_count int;
  v_learning_count int;
  v_active_learning int;
  v_flourishing_score numeric;
begin
  select * into v_settings from public.human_flourishing_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.human_flourishing_reviews where tenant_id = p_tenant_id;
  select count(*) into v_belonging_count from public.human_flourishing_belonging_reflections where tenant_id = p_tenant_id;
  select count(*) into v_strengths_count from public.human_flourishing_strengths_notes where tenant_id = p_tenant_id;
  select count(*) into v_learning_count from public.human_flourishing_learning_records where tenant_id = p_tenant_id;
  select count(*) into v_active_learning from public.human_flourishing_learning_records
    where tenant_id = p_tenant_id and status in ('planned', 'active');

  v_flourishing_score := round(
    coalesce(v_settings.flourishing_readiness_level, 1) * 10.0
    + case when coalesce(v_settings.belonging_reflection_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.strengths_development_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.lifelong_learning_enabled, false) then 8 else 0 end
    + case when coalesce(v_settings.leadership_growth_enabled, false) then 8 else 0 end
    + least(v_reviews_count, 6) * 3.5
    + least(v_belonging_count, 6) * 2.5
    + least(v_strengths_count, 6) * 2.5
    + least(v_active_learning, 8) * 2.0,
    1
  );

  return jsonb_build_object(
    'human_flourishing_score', v_flourishing_score,
    'enabled', coalesce(v_settings.enabled, false),
    'development_mode', coalesce(v_settings.development_mode, 'guided'),
    'flourishing_readiness_level', coalesce(v_settings.flourishing_readiness_level, 1),
    'executive_reviews_count', v_reviews_count,
    'belonging_reflections_count', v_belonging_count,
    'strengths_notes_count', v_strengths_count,
    'learning_records_count', v_learning_count,
    'active_learning_count', v_active_learning,
    'era_phases_count', jsonb_array_length(public._cfhpbp170_era_capstone_summary()),
    'cross_links_count', jsonb_array_length(public._cfhpbp170_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_flourishing_review(
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
  v_tenant_id := coalesce(p_org_id, public._cfhp_require_tenant());
  perform public._cfhp_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_flourishing_reviews (
    tenant_id, review_key, review_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._cfhp_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_belonging_reflection(
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
  v_tenant_id := coalesce(p_org_id, public._cfhp_require_tenant());
  perform public._cfhp_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_flourishing_belonging_reflections (
    tenant_id, reflection_key, reflection_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._cfhp_log_audit(v_tenant_id, 'belonging_reflection_recorded', left(p_title, 120),
    jsonb_build_object('reflection_id', v_id, 'reflection_type', p_reflection_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_human_flourishing_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.human_flourishing_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cfhp_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cfhp_ensure_settings(v_tenant_id);
  perform public._cfhp_seed_learning_records(v_tenant_id);
  v_metrics := public._cfhp_refresh_metrics(v_tenant_id);
  v_engagement := public._cfhpbp170_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_flourishing_score', v_metrics->'human_flourishing_score',
    'enabled', v_settings.enabled,
    'development_mode', v_settings.development_mode,
    'flourishing_readiness_level', v_settings.flourishing_readiness_level,
    'learning_records_count', v_metrics->'learning_records_count',
    'philosophy', public._cfhpbp170_philosophy(),
    'belonging_reflection_enabled', v_settings.belonging_reflection_enabled,
    'strengths_development_enabled', v_settings.strengths_development_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 170 — Civilizational Flourishing & Human Potential Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE170_CIVILIZATIONAL_FLOURISHING_HUMAN_POTENTIAL.md',
      'engine_phase', 'Repo Phase 170 Human Flourishing Engine',
      'route', '/app/human-flourishing-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) capstone.'
    ),
    'human_flourishing_mission', public._cfhpbp170_mission(),
    'human_flourishing_abos_principle', public._cfhpbp170_abos_principle(),
    'human_flourishing_engagement_summary', v_engagement,
    'human_flourishing_note', public._cfhpbp170_distinction_note(),
    'human_flourishing_vision_note', public._cfhpbp170_vision()
  );
end; $$;

create or replace function public.get_human_flourishing_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.human_flourishing_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cfhp_require_tenant());
  v_settings := public._cfhp_ensure_settings(v_tenant_id);
  perform public._cfhp_seed_learning_records(v_tenant_id);
  v_metrics := public._cfhp_refresh_metrics(v_tenant_id);
  perform public._cfhp_log_audit(v_tenant_id, 'dashboard_view', 'Human Flourishing dashboard viewed',
    jsonb_build_object('human_flourishing_score', v_metrics->>'human_flourishing_score', 'development_mode', v_settings.development_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'development_mode', v_settings.development_mode,
    'flourishing_readiness_level', v_settings.flourishing_readiness_level,
    'belonging_reflection_enabled', v_settings.belonging_reflection_enabled,
    'strengths_development_enabled', v_settings.strengths_development_enabled,
    'lifelong_learning_enabled', v_settings.lifelong_learning_enabled,
    'leadership_growth_enabled', v_settings.leadership_growth_enabled,
    'human_oversight_required', v_settings.human_oversight_required,
    'philosophy', public._cfhpbp170_philosophy(),
    'safety_note', 'Human Flourishing Center — metadata scaffolds only. NOT human worth metrics or productivity-based worth scoring.',
    'distinction_note', public._cfhpbp170_distinction_note(),
    'human_flourishing_score', v_metrics->'human_flourishing_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count',
    'belonging_reflections_count', v_metrics->'belonging_reflections_count',
    'strengths_notes_count', v_metrics->'strengths_notes_count',
    'learning_records_count', v_metrics->'learning_records_count',
    'active_learning_count', v_metrics->'active_learning_count',
    'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'readiness_signal', r.readiness_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.human_flourishing_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'belonging_reflections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'reflection_key', b.reflection_key, 'reflection_type', b.reflection_type,
        'title', b.title, 'reflection_summary', b.reflection_summary, 'status', b.status,
        'created_at', b.created_at
      ) order by b.created_at desc)
      from public.human_flourishing_belonging_reflections b where b.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strengths_notes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'note_key', s.note_key, 'note_type', s.note_type,
        'title', s.title, 'summary', s.summary, 'status', s.status, 'created_at', s.created_at
      ) order by s.created_at desc)
      from public.human_flourishing_strengths_notes s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'learning_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'record_key', l.record_key, 'record_type', l.record_type,
        'title', l.title, 'summary', l.summary, 'status', l.status, 'created_at', l.created_at
      ) order by l.created_at)
      from public.human_flourishing_learning_records l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cfhpbp170_integration_links(),
    'era_capstone_summary', public._cfhpbp170_era_capstone_summary(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 170 — Civilizational Flourishing & Human Potential Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE170_CIVILIZATIONAL_FLOURISHING_HUMAN_POTENTIAL.md',
      'engine_phase', 'Repo Phase 170 Human Flourishing Engine',
      'route', '/app/human-flourishing-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) capstone — technology serves humanity.'
    ),
    'human_flourishing_engine_note', 'Human Flourishing Engine (ABOS Phase 170) — era capstone. Cross-link Phases 161–169, Future Leaders 151, Self Love A.76 — do NOT duplicate RPCs.',
    'human_flourishing_blueprint', public._cfhpbp170_blueprint_block(v_tenant_id),
    'human_flourishing_distinction_note', public._cfhpbp170_distinction_note(),
    'human_flourishing_mission', public._cfhpbp170_mission(),
    'human_flourishing_philosophy', public._cfhpbp170_philosophy(),
    'human_flourishing_abos_principle', public._cfhpbp170_abos_principle(),
    'human_flourishing_objectives', public._cfhpbp170_objectives(),
    'human_flourishing_center_meta', public._cfhpbp170_human_flourishing_center(),
    'human_potential_engine_meta', public._cfhpbp170_human_potential_engine(),
    'flourishing_framework_meta', public._cfhpbp170_flourishing_framework(),
    'executive_flourishing_reviews_meta', public._cfhpbp170_executive_flourishing_reviews(),
    'flourishing_companion_meta', public._cfhpbp170_flourishing_companion(),
    'belonging_engine_meta', public._cfhpbp170_belonging_engine(),
    'strengths_development_engine_meta', public._cfhpbp170_strengths_development_engine(),
    'lifelong_learning_framework_meta', public._cfhpbp170_lifelong_learning_framework(),
    'companion_limitations_meta', public._cfhpbp170_companion_limitations(),
    'self_love_connection_meta', public._cfhpbp170_self_love_connection(),
    'security_requirements_meta', public._cfhpbp170_security_requirements(),
    'cfhpbp170_integration_links', public._cfhpbp170_integration_links(),
    'cfhpbp170_era_capstone_summary', public._cfhpbp170_era_capstone_summary(),
    'human_flourishing_engagement_summary', public._cfhpbp170_engagement_summary(v_tenant_id),
    'human_flourishing_success_criteria', public._cfhpbp170_success_criteria(v_tenant_id),
    'human_flourishing_vision', public._cfhpbp170_vision(),
    'human_flourishing_vision_phrases', public._cfhpbp170_vision_phrases(),
    'human_flourishing_privacy_note', public._cfhpbp170_privacy_note(),
    'human_flourishing_dogfooding', public._cfhpbp170_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-flourishing-engine', 'Human Flourishing Engine',
  'Post-Enterprise & Civilizational Era (161–170) capstone — human flourishing and human potential. People First.',
  'authenticated', 180
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'human-flourishing-engine' and tenant_id is null
);

grant execute on function public.get_human_flourishing_engine_card(uuid) to authenticated;
grant execute on function public.get_human_flourishing_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_flourishing_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_belonging_reflection(text, text, text, uuid) to authenticated;
grant execute on function public._cfhpbp170_distinction_note() to authenticated;
grant execute on function public._cfhpbp170_mission() to authenticated;
grant execute on function public._cfhpbp170_philosophy() to authenticated;
grant execute on function public._cfhpbp170_abos_principle() to authenticated;
grant execute on function public._cfhpbp170_vision() to authenticated;
grant execute on function public._cfhpbp170_objectives() to authenticated;
grant execute on function public._cfhpbp170_human_flourishing_center() to authenticated;
grant execute on function public._cfhpbp170_human_potential_engine() to authenticated;
grant execute on function public._cfhpbp170_flourishing_framework() to authenticated;
grant execute on function public._cfhpbp170_executive_flourishing_reviews() to authenticated;
grant execute on function public._cfhpbp170_flourishing_companion() to authenticated;
grant execute on function public._cfhpbp170_belonging_engine() to authenticated;
grant execute on function public._cfhpbp170_strengths_development_engine() to authenticated;
grant execute on function public._cfhpbp170_lifelong_learning_framework() to authenticated;
grant execute on function public._cfhpbp170_companion_limitations() to authenticated;
grant execute on function public._cfhpbp170_self_love_connection() to authenticated;
grant execute on function public._cfhpbp170_security_requirements() to authenticated;
grant execute on function public._cfhpbp170_era_capstone_summary() to authenticated;
grant execute on function public._cfhpbp170_integration_links() to authenticated;
grant execute on function public._cfhpbp170_dogfooding() to authenticated;
grant execute on function public._cfhpbp170_vision_phrases() to authenticated;
grant execute on function public._cfhpbp170_privacy_note() to authenticated;
grant execute on function public._cfhpbp170_engagement_summary(uuid) to authenticated;
grant execute on function public._cfhpbp170_success_criteria(uuid) to authenticated;
