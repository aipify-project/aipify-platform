-- Phase 179 — Human Wonder & Exploration Engine
-- Cosmic Stewardship & Multi-Generational Futures Era (171–180) — Wonder & Exploration Center.
-- Helpers: _hwe_* (engine), _hwebp179_* (blueprint)

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
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine'
  )
);

create table if not exists public.human_wonder_exploration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  wonder_readiness_level int not null default 1 check (wonder_readiness_level between 1 and 5),
  wonder_mode text not null default 'guided' check (wonder_mode in ('guided', 'governance_led', 'executive_sponsored')),
  curiosity_reflection_enabled boolean not null default true,
  exploration_workshops_enabled boolean not null default true,
  discovery_sessions_enabled boolean not null default true,
  learning_opportunities_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.human_wonder_exploration_settings enable row level security;
revoke all on public.human_wonder_exploration_settings from authenticated, anon;

create table if not exists public.human_wonder_exploration_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('curiosity_stewardship', 'exploration_accountability', 'learning_reflection', 'discovery_ownership', 'experimental_initiatives')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'completed', 'archived')),
  readiness_signal text not null default 'stable' check (readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists human_wonder_exploration_reviews_tenant_idx on public.human_wonder_exploration_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.human_wonder_exploration_reviews enable row level security;
revoke all on public.human_wonder_exploration_reviews from authenticated, anon;

create table if not exists public.human_wonder_exploration_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (reflection_type in ('not_noticing', 'assumptions_questioning', 'outside_expertise', 'diverse_perspectives', 'humanity_discoveries', 'cross_disciplinary', 'curiosity_conversations', 'experimental_learning')),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'completed', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);
create index if not exists human_wonder_exploration_reflections_tenant_idx on public.human_wonder_exploration_reflections (tenant_id, reflection_type, status);
alter table public.human_wonder_exploration_reflections enable row level security;
revoke all on public.human_wonder_exploration_reflections from authenticated, anon;

create table if not exists public.human_wonder_exploration_exploration_notes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (note_type in ('curiosity_programs', 'exploration_workshops', 'discovery_sessions', 'learning_dashboards', 'inspiration_forums', 'knowledge_expeditions', 'possibility_labs', 'wonder_libraries')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'active', 'archived')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);
create index if not exists human_wonder_exploration_exploration_notes_tenant_idx on public.human_wonder_exploration_exploration_notes (tenant_id, note_type, status);
alter table public.human_wonder_exploration_exploration_notes enable row level security;
revoke all on public.human_wonder_exploration_exploration_notes from authenticated, anon;

create table if not exists public.human_wonder_exploration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.human_wonder_exploration_audit_logs enable row level security;
revoke all on public.human_wonder_exploration_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'human_wonder_exploration_engine', v.description
from (values
  ('human_wonder_exploration.view', 'View Wonder & Exploration Center', 'View executive curiosity reviews, reflections, and metadata scaffolds'),
  ('human_wonder_exploration.manage', 'Manage Wonder & Exploration Center', 'Update settings and governance preferences'),
  ('human_wonder_exploration.steward', 'Steward Wonder & Exploration Center', 'Conduct executive curiosity reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'human_wonder_exploration.view'), ('owner', 'human_wonder_exploration.manage'), ('owner', 'human_wonder_exploration.steward'),
  ('administrator', 'human_wonder_exploration.view'), ('administrator', 'human_wonder_exploration.manage'), ('administrator', 'human_wonder_exploration.steward'),
  ('manager', 'human_wonder_exploration.view'), ('manager', 'human_wonder_exploration.steward'),
  ('employee', 'human_wonder_exploration.view'), ('support_agent', 'human_wonder_exploration.view'),
  ('moderator', 'human_wonder_exploration.view'), ('viewer', 'human_wonder_exploration.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._hwe_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._hwe_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._hwe_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._hwe_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.human_wonder_exploration_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._hwe_ensure_settings(p_tenant_id uuid) returns public.human_wonder_exploration_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.human_wonder_exploration_settings; begin
  insert into public.human_wonder_exploration_settings (tenant_id, enabled, wonder_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.human_wonder_exploration_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._hwe_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.human_wonder_exploration_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'not-noticing', 'not_noticing', 'What Am I Not Noticing?', 'Aggregate not-noticing metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'assumptions-questioning', 'assumptions_questioning', 'Assumptions Need Questioning', 'Aggregate assumptions metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'outside-expertise', 'outside_expertise', 'Knowledge Outside Expertise', 'Aggregate outside-expertise metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'diverse-perspectives', 'diverse_perspectives', 'Diverse Perspectives Missing', 'Aggregate diverse-perspectives metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'humanity-discoveries', 'humanity_discoveries', 'Discoveries Strengthen Humanity', 'Aggregate humanity-discoveries metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'cross-disciplinary', 'cross_disciplinary', 'Cross-Disciplinary Learning', 'Aggregate cross-disciplinary metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'curiosity-conversations', 'curiosity_conversations', 'Curiosity Conversations', 'Aggregate curiosity-conversations metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'experimental-learning', 'experimental_learning', 'Experimental Learning', 'Aggregate experimental-learning metadata — Exploration Companion supports, never replaces curiosity.', 'draft');
end; $$;

create or replace function public._hwe_seed_exploration_notes(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.human_wonder_exploration_exploration_notes where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'curiosity-programs', 'curiosity_programs', 'Curiosity Programs', 'Curiosity programs scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'exploration-workshops', 'exploration_workshops', 'Exploration Workshops', 'Exploration workshops scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'discovery-sessions', 'discovery_sessions', 'Companion Discovery Sessions', 'Companion discovery sessions scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'learning-dashboards', 'learning_dashboards', 'Learning Opportunity Dashboards', 'Learning opportunity dashboards scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'inspiration-forums', 'inspiration_forums', 'Cross-Functional Inspiration Forums', 'Cross-functional inspiration forums scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'knowledge-expeditions', 'knowledge_expeditions', 'Knowledge Expeditions', 'Knowledge expeditions scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'possibility-labs', 'possibility_labs', 'Future Possibility Labs', 'Future possibility labs scaffold — metadata only.', 'draft');
  insert into public.human_wonder_exploration_exploration_notes (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'wonder-libraries', 'wonder_libraries', 'Wonder Knowledge Libraries', 'Wonder knowledge libraries scaffold — metadata only.', 'draft');
end; $$;

create or replace function public._hwebp179_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 179 — Wonder & Exploration Center. Supports curiosity — NOT direction replacement. Cross-link Curiosity Discovery /app/curiosity-discovery-engine, Learning /app/learning, Phase 174 creativity. Helpers _hwe_* / _hwebp179_*.'; $$;
create or replace function public._hwebp179_mission() returns text language sql immutable as $$
  select 'Help organizations nurture curiosity, exploration, and lifelong learning — with intellectual humility and human leadership — without replacing judgment or suppressing questions.'; $$;
create or replace function public._hwebp179_philosophy() returns text language sql immutable as $$
  select 'People First. Exploration Companion supports wonder — does NOT replace curiosity or determine direction. Self Love: curiosity, confidence, humility, playfulness, patience, wonder. Growth Partner — never Affiliate.'; $$;
create or replace function public._hwebp179_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Wonder & Exploration Center aggregates visibility across Cosmic Stewardship Era (171–180). Humans explore; Exploration Companion informs and prepares.'; $$;
create or replace function public._hwebp179_vision() returns text language sql immutable as $$
  select 'Organizations where curiosity, cross-disciplinary learning, and wonder coexist with humility — humans lead exploration; Companions support within approved boundaries.'; $$;
create or replace function public._hwebp179_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Exploration Center programs', 'emoji', '🧭', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'wonder_engine', 'label', 'Wonder engine', 'emoji', '✨', 'description', 'Human reflection prompts'),
    jsonb_build_object('key', 'discovery_framework', 'label', 'Discovery framework', 'emoji', '🔭', 'description', 'Exploration and learning domains'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive curiosity reviews', 'emoji', '👥', 'description', 'Leadership exploration accountability'),
    jsonb_build_object('key', 'companion', 'label', 'Exploration Companion', 'emoji', '🌟', 'description', 'Supports — does not determine direction'),
    jsonb_build_object('key', 'sub_engines', 'label', 'Supporting sub-engines', 'emoji', '⚙️', 'description', 'Lifelong learning and humility scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Wonder knowledge libraries', 'emoji', '📖', 'description', 'Approved exploration resources'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love in exploration', 'emoji', '💫', 'description', 'Curiosity, humility, and wonder')
  ); $$;
create or replace function public._hwebp179_exploration_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wonder & Exploration Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'curiosity_programs', 'label', 'Curiosity programs'),
    jsonb_build_object('key', 'exploration_workshops', 'label', 'Exploration workshops'),
    jsonb_build_object('key', 'discovery_sessions', 'label', 'Companion discovery sessions'),
    jsonb_build_object('key', 'learning_dashboards', 'label', 'Learning opportunity dashboards'),
    jsonb_build_object('key', 'inspiration_forums', 'label', 'Cross-functional inspiration forums'),
    jsonb_build_object('key', 'knowledge_expeditions', 'label', 'Knowledge expeditions'),
    jsonb_build_object('key', 'possibility_labs', 'label', 'Future possibility labs'),
    jsonb_build_object('key', 'wonder_libraries', 'label', 'Wonder knowledge libraries')
  )); $$;
create or replace function public._hwebp179_wonder_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wonder engine reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'not_noticing', 'label', 'What am I not noticing?'),
    jsonb_build_object('key', 'assumptions', 'label', 'What assumptions need questioning?'),
    jsonb_build_object('key', 'outside_expertise', 'label', 'What knowledge exists outside my expertise?'),
    jsonb_build_object('key', 'diverse_perspectives', 'label', 'What diverse perspectives am I missing?'),
    jsonb_build_object('key', 'humanity_discoveries', 'label', 'What discoveries could strengthen humanity?')
  )); $$;
create or replace function public._hwebp179_discovery_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Discovery framework — exploration domains.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'cross_disciplinary_learning', 'label', 'Cross-disciplinary learning'),
    jsonb_build_object('key', 'curiosity_conversations', 'label', 'Curiosity conversations'),
    jsonb_build_object('key', 'growth_partner_exchanges', 'label', 'Growth Partner exchanges'),
    jsonb_build_object('key', 'knowledge_exploration', 'label', 'Knowledge exploration'),
    jsonb_build_object('key', 'future_trend_reviews', 'label', 'Future trend reviews'),
    jsonb_build_object('key', 'learning_sabbaticals', 'label', 'Learning sabbaticals'),
    jsonb_build_object('key', 'experimental_initiatives', 'label', 'Experimental initiatives')
  )); $$;
create or replace function public._hwebp179_executive_curiosity_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive Curiosity Reviews — leadership exploration reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'curiosity_stewardship', 'label', 'Curiosity Stewardship'),
    jsonb_build_object('key', 'exploration_accountability', 'label', 'Exploration Accountability'),
    jsonb_build_object('key', 'learning_reflection', 'label', 'Learning Reflection'),
    jsonb_build_object('key', 'discovery_ownership', 'label', 'Discovery Ownership'),
    jsonb_build_object('key', 'experimental_initiatives', 'label', 'Experimental Initiatives')
  )); $$;
create or replace function public._hwebp179_exploration_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Exploration Companion — supports, does NOT determine direction.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'curiosity_prompts', 'label', 'Curiosity prompts'),
    jsonb_build_object('key', 'discovery_briefings', 'label', 'Discovery briefings'),
    jsonb_build_object('key', 'learning_summaries', 'label', 'Learning opportunity summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'cross_disciplinary_introductions', 'label', 'Cross-disciplinary introductions'),
    jsonb_build_object('key', 'exploration_guidance', 'label', 'Exploration guidance')
  )); $$;
create or replace function public._hwebp179_sub_engines() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Supporting sub-engines — metadata only.', 'characteristics', jsonb_build_array(
    jsonb_build_object('key', 'executive_curiosity_reviews', 'label', 'Executive Curiosity Reviews'),
    jsonb_build_object('key', 'exploration_companion', 'label', 'Exploration Companion'),
    jsonb_build_object('key', 'lifelong_learning_engine', 'label', 'Lifelong Learning Engine'),
    jsonb_build_object('key', 'intellectual_humility_engine', 'label', 'Intellectual Humility Engine')
  )); $$;
create or replace function public._hwebp179_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array(
      'Suppressing questions',
      'Replacing curiosity',
      'Determining ideas',
      'Discouraging learning',
      'Overriding leadership'
    ), 'principle', 'Exploration Companion supports — humans decide direction.'); $$;
create or replace function public._hwebp179_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love in exploration — curiosity, confidence, humility, playfulness, patience, wonder.', 'values', jsonb_build_array('curiosity','confidence','humility','playfulness','patience','wonder'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._hwebp179_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via human_wonder_exploration_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via human_wonder_exploration permissions'),
    jsonb_build_object('key', 'companion_histories', 'label', 'Companion action histories — metadata only'),
    jsonb_build_object('key', 'approval_records', 'label', 'Human approval records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._hwebp179_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 171, 'key', 'multi_generational_futures', 'label', 'Multi-Generational Futures Phase 171', 'route', '/app/multi-generational-futures-engine', 'description', 'Era opener'),
    jsonb_build_object('phase', 172, 'key', 'intergenerational_guardianship', 'label', 'Intergenerational Guardianship Phase 172', 'route', '/app/intergenerational-guardianship-engine', 'description', 'Guardianship'),
    jsonb_build_object('phase', 173, 'key', 'human_identity_meaning', 'label', 'Human Identity & Meaning Phase 173', 'route', '/app/human-identity-meaning-engine', 'description', 'Meaning & identity'),
    jsonb_build_object('phase', 174, 'key', 'human_creativity_imagination', 'label', 'Human Creativity & Imagination Phase 174', 'route', '/app/human-creativity-imagination-engine', 'description', 'Creativity'),
    jsonb_build_object('phase', 175, 'key', 'human_wisdom_augmented_judgment', 'label', 'Human Wisdom & Judgment Phase 175', 'route', '/app/human-wisdom-augmented-judgment-engine', 'description', 'Wisdom & judgment'),
    jsonb_build_object('phase', 178, 'key', 'human_hope_possibility', 'label', 'Human Hope & Collective Possibility Phase 178', 'route', '/app/human-hope-possibility-engine', 'description', 'Collective possibility — cross-link only'),
    jsonb_build_object('phase', 179, 'key', 'human_wonder_exploration', 'label', 'Human Wonder & Exploration Phase 179', 'route', '/app/human-wonder-exploration-engine', 'description', 'Wonder & exploration — supports not replaces')
  ); $$;
create or replace function public._hwebp179_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'curiosity_discovery_engine', 'label', 'Curiosity Discovery Engine', 'route', '/app/curiosity-discovery-engine', 'relationship', 'Curiosity programs — cross-link only'),
    jsonb_build_object('key', 'learning_engine', 'label', 'Learning Engine', 'route', '/app/learning', 'relationship', 'Approved learning memory — cross-link only'),
    jsonb_build_object('key', 'human_creativity_imagination', 'label', 'Human Creativity & Imagination Phase 174', 'route', '/app/human-creativity-imagination-engine', 'relationship', 'Creativity — cross-link only')
  ); $$;
create or replace function public._hwebp179_integration_links() returns jsonb language sql stable as $$ select public._hwebp179_era_opener_summary() || public._hwebp179_extended_cross_links(); $$;
create or replace function public._hwebp179_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Wonder & Exploration Center internally with metadata-only executive curiosity reviews and reflection scaffolds. Growth Partner terminology. Exploration Companion supports — never replaces human curiosity or leadership direction.'; $$;
create or replace function public._hwebp179_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans lead exploration.', 'Exploration Companion informs and prepares.', 'Intellectual humility — transparency required.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._hwebp179_privacy_note() returns text language sql immutable as $$
  select 'Wonder & Exploration Center metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._hwe_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.human_wonder_exploration_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.human_wonder_exploration_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.human_wonder_exploration_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.human_wonder_exploration_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.human_wonder_exploration_exploration_notes where tenant_id = p_tenant_id;
  select count(*) into v_active from public.human_wonder_exploration_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.wonder_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('human_wonder_exploration_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'wonder_mode', coalesce(v_settings.wonder_mode, 'guided'),
    'wonder_readiness_level', coalesce(v_settings.wonder_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'exploration_notes_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._hwebp179_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._hwebp179_integration_links()));
end; $$;

create or replace function public._hwebp179_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._hwe_ensure_settings(p_org_id); perform public._hwe_seed_reflections(p_org_id); perform public._hwe_seed_exploration_notes(p_org_id);
  v_metrics := public._hwe_refresh_metrics(p_org_id);
  return jsonb_build_object('human_wonder_exploration_score', coalesce((v_metrics->>'human_wonder_exploration_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'wonder_mode', coalesce(v_metrics->>'wonder_mode', 'guided'), 'wonder_readiness_level', coalesce((v_metrics->>'wonder_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'exploration_notes_count', coalesce((v_metrics->>'exploration_notes_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._hwebp179_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._hwebp179_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._hwe_ensure_settings(p_org_id); perform public._hwe_seed_reflections(p_org_id); perform public._hwe_seed_exploration_notes(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Wonder & Exploration Center — eight capabilities', 'met', jsonb_array_length(public._hwebp179_exploration_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Wonder engine — five reflection questions', 'met', jsonb_array_length(public._hwebp179_wonder_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Discovery framework — seven domains', 'met', jsonb_array_length(public._hwebp179_discovery_framework()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Exploration Companion capabilities', 'met', jsonb_array_length(public._hwebp179_exploration_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'sub_engines', 'label', 'Supporting sub-engines documented', 'met', jsonb_array_length(public._hwebp179_sub_engines()->'characteristics') = 4, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.human_wonder_exploration_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Exploration notes seeded', 'met', (select count(*) >= 8 from public.human_wonder_exploration_exploration_notes n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._hwebp179_companion_limitations()->'must_avoid') = 5, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._hwebp179_era_opener_summary()) = 7, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 179 baseline tables', 'met', to_regclass('public.human_wonder_exploration_settings') is not null, 'note', '_hwe_* helpers intact')
  );
end; $$;

create or replace function public._hwebp179_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 179 — Human Wonder & Exploration Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE179_HUMAN_WONDER_EXPLORATION.md', 'engine_phase', 'Repo Phase 179', 'route', '/app/human-wonder-exploration-engine',
    'distinction_note', public._hwebp179_distinction_note(), 'mission', public._hwebp179_mission(), 'philosophy', public._hwebp179_philosophy(),
    'abos_principle', public._hwebp179_abos_principle(), 'vision', public._hwebp179_vision(), 'objectives', public._hwebp179_objectives(),
    'exploration_center', public._hwebp179_exploration_center(), 'wonder_engine', public._hwebp179_wonder_engine(),
    'discovery_framework', public._hwebp179_discovery_framework(), 'executive_curiosity_reviews', public._hwebp179_executive_curiosity_reviews(),
    'exploration_companion', public._hwebp179_exploration_companion(), 'sub_engines', public._hwebp179_sub_engines(),
    'companion_limitations', public._hwebp179_companion_limitations(), 'self_love_connection', public._hwebp179_self_love_connection(),
    'security_requirements', public._hwebp179_security_requirements(), 'era_opener_summary', public._hwebp179_era_opener_summary(),
    'integration_links', public._hwebp179_integration_links(), 'dogfooding', public._hwebp179_dogfooding(),
    'success_criteria', public._hwebp179_success_criteria(p_org_id), 'engagement_summary', public._hwebp179_engagement_summary(p_org_id),
    'vision_phrases', public._hwebp179_vision_phrases(), 'privacy_note', public._hwebp179_privacy_note()
  ); $$;

create or replace function public.record_executive_curiosity_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hwe_require_tenant()); perform public._hwe_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_wonder_exploration_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._hwe_log_audit(v_tenant_id, 'executive_curiosity_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_wonder_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hwe_require_tenant()); perform public._hwe_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_wonder_exploration_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._hwe_log_audit(v_tenant_id, 'wonder_reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_human_wonder_exploration_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.human_wonder_exploration_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hwe_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._hwe_ensure_settings(v_tenant_id); perform public._hwe_seed_reflections(v_tenant_id); perform public._hwe_seed_exploration_notes(v_tenant_id);
  v_metrics := public._hwe_refresh_metrics(v_tenant_id); v_engagement := public._hwebp179_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'human_wonder_exploration_score', v_metrics->'human_wonder_exploration_score', 'enabled', v_settings.enabled, 'wonder_mode', v_settings.wonder_mode,
    'wonder_readiness_level', v_settings.wonder_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._hwebp179_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 179 — Human Wonder & Exploration Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE179_HUMAN_WONDER_EXPLORATION.md', 'route', '/app/human-wonder-exploration-engine'),
    'human_wonder_exploration_mission', public._hwebp179_mission(), 'human_wonder_exploration_abos_principle', public._hwebp179_abos_principle(),
    'human_wonder_exploration_engagement_summary', v_engagement, 'human_wonder_exploration_note', public._hwebp179_distinction_note(), 'human_wonder_exploration_vision_note', public._hwebp179_vision());
end; $$;

create or replace function public.get_human_wonder_exploration_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.human_wonder_exploration_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hwe_require_tenant()); v_settings := public._hwe_ensure_settings(v_tenant_id);
  perform public._hwe_seed_reflections(v_tenant_id); perform public._hwe_seed_exploration_notes(v_tenant_id); v_metrics := public._hwe_refresh_metrics(v_tenant_id);
  perform public._hwe_log_audit(v_tenant_id, 'dashboard_view', 'Wonder & Exploration Center dashboard viewed', jsonb_build_object('score', v_metrics->>'human_wonder_exploration_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'wonder_mode', v_settings.wonder_mode, 'wonder_readiness_level', v_settings.wonder_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._hwebp179_philosophy(),
    'safety_note', 'Wonder & Exploration Center — metadata scaffolds only. Exploration Companion supports — never replaces human curiosity or leadership direction.',
    'distinction_note', public._hwebp179_distinction_note(), 'human_wonder_exploration_score', v_metrics->'human_wonder_exploration_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'exploration_notes_count', v_metrics->'exploration_notes_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.human_wonder_exploration_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.human_wonder_exploration_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.human_wonder_exploration_exploration_notes s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._hwebp179_integration_links(), 'era_opener_summary', public._hwebp179_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 179 — Human Wonder & Exploration Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE179_HUMAN_WONDER_EXPLORATION.md', 'route', '/app/human-wonder-exploration-engine'),
    'human_wonder_exploration_blueprint', public._hwebp179_blueprint_block(v_tenant_id), 'human_wonder_exploration_mission', public._hwebp179_mission(), 'human_wonder_exploration_philosophy', public._hwebp179_philosophy(),
    'human_wonder_exploration_abos_principle', public._hwebp179_abos_principle(), 'human_wonder_exploration_objectives', public._hwebp179_objectives(),
    'center_meta', public._hwebp179_exploration_center(), 'engine_meta', public._hwebp179_wonder_engine(), 'framework_meta', public._hwebp179_discovery_framework(),
    'executive_reviews_meta', public._hwebp179_executive_curiosity_reviews(), 'companion_meta', public._hwebp179_exploration_companion(), 'sub_engine_meta', public._hwebp179_sub_engines(),
    'companion_limitations_meta', public._hwebp179_companion_limitations(), 'self_love_connection_meta', public._hwebp179_self_love_connection(),
    'security_requirements_meta', public._hwebp179_security_requirements(), 'hwebp179_integration_links', public._hwebp179_integration_links(),
    'hwebp179_era_opener_summary', public._hwebp179_era_opener_summary(), 'human_wonder_exploration_engagement_summary', public._hwebp179_engagement_summary(v_tenant_id),
    'human_wonder_exploration_success_criteria', public._hwebp179_success_criteria(v_tenant_id), 'human_wonder_exploration_vision', public._hwebp179_vision(), 'human_wonder_exploration_vision_phrases', public._hwebp179_vision_phrases(),
    'human_wonder_exploration_privacy_note', public._hwebp179_privacy_note(), 'human_wonder_exploration_dogfooding', public._hwebp179_dogfooding(), 'human_wonder_exploration_engine_note', 'Phase 179 Human Wonder & Exploration Engine — cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-wonder-exploration-engine', 'Human Wonder & Exploration Engine', 'Wonder & Exploration Center — Cosmic Stewardship Era (171–180). People First.', 'authenticated', 190
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'human-wonder-exploration-engine' and tenant_id is null);

grant execute on function public.get_human_wonder_exploration_engine_card(uuid) to authenticated;
grant execute on function public.get_human_wonder_exploration_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_curiosity_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_wonder_reflection(text, text, text, uuid) to authenticated;
