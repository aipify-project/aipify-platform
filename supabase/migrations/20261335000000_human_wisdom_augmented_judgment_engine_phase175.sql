-- Phase 175 — Human Wisdom & Augmented Judgment Engine
-- Cosmic Stewardship & Multi-Generational Futures Era (171–180) — Wisdom & Judgment Center.
-- Helpers: _hwaj_* (engine), _hwajbp175_* (blueprint)

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
    'human_wisdom_augmented_judgment_engine'
  )
);

create table if not exists public.human_wisdom_augmented_judgment_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  wisdom_readiness_level int not null default 1 check (wisdom_readiness_level between 1 and 5),
  judgment_mode text not null default 'guided' check (judgment_mode in ('guided', 'council_led', 'executive_sponsored')),
  wisdom_reflection_enabled boolean not null default true,
  stakeholder_reflection_enabled boolean not null default true,
  judgment_ownership_enabled boolean not null default true,
  ethical_awareness_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (governance_visibility in ('leadership', 'executive', 'governance_council')),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.human_wisdom_augmented_judgment_settings enable row level security;
revoke all on public.human_wisdom_augmented_judgment_settings from authenticated, anon;

create table if not exists public.human_wisdom_augmented_judgment_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (review_type in ('ethical_judgment', 'wisdom_cultivation', 'decision_ownership', 'leadership_accountability', 'judgment_humility')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'in_review', 'completed', 'archived')),
  readiness_signal text not null default 'stable' check (readiness_signal in ('emerging', 'stable', 'strong', 'needs_attention')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);
create index if not exists human_wisdom_augmented_judgment_reviews_tenant_idx on public.human_wisdom_augmented_judgment_reviews (tenant_id, review_type, status, captured_at desc);
alter table public.human_wisdom_augmented_judgment_reviews enable row level security;
revoke all on public.human_wisdom_augmented_judgment_reviews from authenticated, anon;

create table if not exists public.human_wisdom_augmented_judgment_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (reflection_type in ('wisdom_themes', 'judgment_reflection', 'ethical_consideration', 'decision_context', 'stakeholder_awareness', 'long_horizon_thinking', 'judgment_humility', 'learning_from_experience')),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'completed', 'archived')),
  metadata jsonb not null default '{"metadata_only":true,"aggregate_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);
create index if not exists human_wisdom_augmented_judgment_reflections_tenant_idx on public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_type, status);
alter table public.human_wisdom_augmented_judgment_reflections enable row level security;
revoke all on public.human_wisdom_augmented_judgment_reflections from authenticated, anon;

create table if not exists public.human_wisdom_augmented_judgment_judgment_scaffolds (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  note_key text not null,
  note_type text not null check (note_type in ('judgment_support', 'ethical_awareness', 'decision_ownership', 'leadership_accountability', 'wisdom_cultivation', 'contextual_understanding', 'humility_practice', 'stewardship_mindset')),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (status in ('draft', 'review', 'active', 'archived')),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, note_key)
);
create index if not exists human_wisdom_augmented_judgment_judgment_scaffolds_tenant_idx on public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_type, status);
alter table public.human_wisdom_augmented_judgment_judgment_scaffolds enable row level security;
revoke all on public.human_wisdom_augmented_judgment_judgment_scaffolds from authenticated, anon;

create table if not exists public.human_wisdom_augmented_judgment_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.human_wisdom_augmented_judgment_audit_logs enable row level security;
revoke all on public.human_wisdom_augmented_judgment_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'human_wisdom_augmented_judgment_engine', v.description
from (values
  ('human_wisdom_judgment.view', 'View Wisdom & Judgment Center', 'View executive reviews, reflections, and metadata scaffolds'),
  ('human_wisdom_judgment.manage', 'Manage Wisdom & Judgment Center', 'Update settings and governance preferences'),
  ('human_wisdom_judgment.steward', 'Steward Wisdom & Judgment Center', 'Conduct executive reviews and record metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'human_wisdom_judgment.view'), ('owner', 'human_wisdom_judgment.manage'), ('owner', 'human_wisdom_judgment.steward'),
  ('administrator', 'human_wisdom_judgment.view'), ('administrator', 'human_wisdom_judgment.manage'), ('administrator', 'human_wisdom_judgment.steward'),
  ('manager', 'human_wisdom_judgment.view'), ('manager', 'human_wisdom_judgment.steward'),
  ('employee', 'human_wisdom_judgment.view'), ('support_agent', 'human_wisdom_judgment.view'),
  ('moderator', 'human_wisdom_judgment.view'), ('viewer', 'human_wisdom_judgment.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._hwaj_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._hwaj_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._hwaj_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._hwaj_log_audit(p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin insert into public.human_wisdom_augmented_judgment_audit_logs (tenant_id, action_type, summary, context) values (p_tenant_id, p_action_type, p_summary, p_context) returning id into v_id; return v_id; end; $$;

create or replace function public._hwaj_ensure_settings(p_tenant_id uuid) returns public.human_wisdom_augmented_judgment_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.human_wisdom_augmented_judgment_settings; begin
  insert into public.human_wisdom_augmented_judgment_settings (tenant_id, enabled, judgment_mode) values (p_tenant_id, true, 'guided') on conflict (tenant_id) do nothing;
  select * into v_settings from public.human_wisdom_augmented_judgment_settings where tenant_id = p_tenant_id; return v_settings; end; $$;

create or replace function public._hwaj_seed_reflections(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.human_wisdom_augmented_judgment_reflections where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'wisdom-themes', 'wisdom_themes', 'Wisdom Themes', 'Aggregate wisdom themes metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'judgment-reflection', 'judgment_reflection', 'Judgment Reflection', 'Aggregate judgment reflection metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'ethical-consideration', 'ethical_consideration', 'Ethical Consideration', 'Aggregate ethical consideration metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'decision-context', 'decision_context', 'Decision Context', 'Aggregate decision context metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'stakeholder-awareness', 'stakeholder_awareness', 'Stakeholder Awareness', 'Aggregate stakeholder awareness metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'long-horizon-thinking', 'long_horizon_thinking', 'Long Horizon Thinking', 'Aggregate long horizon thinking metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'judgment-humility', 'judgment_humility', 'Judgment Humility', 'Aggregate judgment humility metadata — Wisdom Companion supports, never replaces.', 'draft');
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (p_tenant_id, 'learning-from-experience', 'learning_from_experience', 'Learning From Experience', 'Aggregate learning from experience metadata — Wisdom Companion supports, never replaces.', 'draft');
end; $$;

create or replace function public._hwaj_seed_judgment_scaffolds(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin if exists (select 1 from public.human_wisdom_augmented_judgment_judgment_scaffolds where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'judgment-support', 'judgment_support', 'Judgment Support', 'Judgment Support scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'ethical-awareness', 'ethical_awareness', 'Ethical Awareness', 'Ethical Awareness scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'decision-ownership', 'decision_ownership', 'Decision Ownership', 'Decision Ownership scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'leadership-accountability', 'leadership_accountability', 'Leadership Accountability', 'Leadership Accountability scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'wisdom-cultivation', 'wisdom_cultivation', 'Wisdom Cultivation', 'Wisdom Cultivation scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'contextual-understanding', 'contextual_understanding', 'Contextual Understanding', 'Contextual Understanding scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'humility-practice', 'humility_practice', 'Humility Practice', 'Humility Practice scaffold — metadata only.', 'draft');
  insert into public.human_wisdom_augmented_judgment_judgment_scaffolds (tenant_id, note_key, note_type, title, summary, status) values (p_tenant_id, 'stewardship-mindset', 'stewardship_mindset', 'Stewardship Mindset', 'Stewardship Mindset scaffold — metadata only.', 'draft');
end; $$;


create or replace function public._hwajbp175_distinction_note() returns text language sql immutable as $$ select 'ABOS Phase 175 — Wisdom & Judgment Center. Supports judgment — NOT decision-making. Cross-link DSE /app/assistant/decisions, Phase 174. Helpers _hwajbp175_* — never collide with wisdom_engine RPCs.'; $$;
create or replace function public._hwajbp175_mission() returns text language sql immutable as $$ select 'Help organizations augment human judgment with wisdom frameworks — without making decisions for leaders or replacing ethical accountability.'; $$;
create or replace function public._hwajbp175_philosophy() returns text language sql immutable as $$ select 'People First. Wisdom Companion supports judgment — does NOT make decisions. Growth Partner — never Affiliate. Leadership decides.'; $$;
create or replace function public._hwajbp175_abos_principle() returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Wisdom & Judgment Center aggregates visibility across Cosmic Stewardship Era (171–180). Humans decide; Wisdom Companion informs and prepares.'; $$;
create or replace function public._hwajbp175_vision() returns text language sql immutable as $$ select 'Organizations where wisdom informs judgment — technology prepares insight while humans retain decision ownership.'; $$;
create or replace function public._hwajbp175_objectives() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'center_capabilities', 'label', 'Wisdom & Judgment Center programs', 'emoji', '🎯', 'description', 'Eight capability scaffolds'),
    jsonb_build_object('key', 'reflection_engine', 'label', 'Reflection engine', 'emoji', '🪞', 'description', 'Human reflection prompts'),
    jsonb_build_object('key', 'framework', 'label', 'Responsible framework', 'emoji', '🛡️', 'description', 'Governance and oversight themes'),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive reviews', 'emoji', '👥', 'description', 'Leadership accountability'),
    jsonb_build_object('key', 'companion', 'label', 'Wisdom Companion', 'emoji', '✨', 'description', 'Supports — does not replace'),
    jsonb_build_object('key', 'sub_engine', 'label', 'Supporting engine', 'emoji', '⚙️', 'description', 'Metadata scaffolds'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Knowledge libraries', 'emoji', '📖', 'description', 'Approved resources'),
    jsonb_build_object('key', 'empowerment', 'label', 'Empowerment themes', 'emoji', '🌱', 'description', 'Participation and learning')
  ); $$;
create or replace function public._hwajbp175_wisdom_judgment_center() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom & Judgment Center — eight capabilities.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'oversight_frameworks', 'label', 'Human oversight frameworks'),
    jsonb_build_object('key', 'leadership_programs', 'label', 'Leadership responsibility programs'),
    jsonb_build_object('key', 'companion_reviews', 'label', 'Companion interaction reviews'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision ownership dashboards'),
    jsonb_build_object('key', 'reflection_sessions', 'label', 'Autonomy reflection sessions'),
    jsonb_build_object('key', 'knowledge_empowerment', 'label', 'Knowledge empowerment'),
    jsonb_build_object('key', 'participation_frameworks', 'label', 'Participation frameworks'),
    jsonb_build_object('key', 'knowledge_libraries', 'label', 'Agency knowledge libraries')
  )); $$;
create or replace function public._hwajbp175_wisdom_judgment_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Reflection prompts — humans decide.', 'reflection_questions', jsonb_build_array(
    jsonb_build_object('key', 'meaningful_choice', 'label', 'What meaningful choices am I making?'),
    jsonb_build_object('key', 'responsibilities', 'label', 'What responsibilities do I hold?'),
    jsonb_build_object('key', 'companions_strengthen', 'label', 'How do Companions strengthen autonomy?'),
    jsonb_build_object('key', 'automation_agency', 'label', 'Where might automation reduce agency?'),
    jsonb_build_object('key', 'ownership', 'label', 'Who owns decisions in our organization?')
  )); $$;
create or replace function public._hwajbp175_augmented_judgment_framework() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Responsible autonomy framework.', 'domains', jsonb_build_array(
    jsonb_build_object('key', 'human_oversight', 'label', 'Human oversight'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'Leadership accountability'),
    jsonb_build_object('key', 'companion_transparency', 'label', 'Companion transparency'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision ownership'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation readiness'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'role_controls', 'label', 'Role-based controls')
  )); $$;
create or replace function public._hwajbp175_executive_wisdom_reviews() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Executive reviews — leadership reflection.', 'review_themes', jsonb_build_array(
    jsonb_build_object('key', 'ethical_judgment', 'label', 'Ethical Judgment'),
    jsonb_build_object('key', 'wisdom_cultivation', 'label', 'Wisdom Cultivation'),
    jsonb_build_object('key', 'decision_ownership', 'label', 'Decision Ownership'),
    jsonb_build_object('key', 'leadership_accountability', 'label', 'Leadership Accountability'),
    jsonb_build_object('key', 'judgment_humility', 'label', 'Judgment Humility')
  )); $$;
create or replace function public._hwajbp175_wisdom_companion() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Wisdom Companion — supports, does not replace.', 'capabilities', jsonb_build_array(
    jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
    jsonb_build_object('key', 'governance_briefings', 'label', 'Governance briefings'),
    jsonb_build_object('key', 'ownership_summaries', 'label', 'Decision ownership summaries'),
    jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
    jsonb_build_object('key', 'leadership_preparation', 'label', 'Leadership preparation'),
    jsonb_build_object('key', 'oversight_guidance', 'label', 'Oversight guidance')
  )); $$;
create or replace function public._hwajbp175_judgment_augmentation_engine() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Supporting engine — metadata only.', 'characteristics', jsonb_build_array(
    jsonb_build_object('key', 'approval_checkpoints', 'label', 'Approval checkpoints'),
    jsonb_build_object('key', 'escalation', 'label', 'Escalation readiness'),
    jsonb_build_object('key', 'sensitive_reviews', 'label', 'Sensitive action reviews'),
    jsonb_build_object('key', 'executive_accountability', 'label', 'Executive accountability'),
    jsonb_build_object('key', 'governance_participation', 'label', 'Governance participation'),
    jsonb_build_object('key', 'role_controls', 'label', 'Role-based controls')
  )); $$;
create or replace function public._hwajbp175_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object('must_avoid', jsonb_build_array('Make decisions for leaders',
      'Replace ethical accountability',
      'Define morality for organizations',
      'Override human judgment',
      'Automate wisdom without oversight',
      'Rank wisdom or judgment scores'), 'principle', 'Wisdom Companion supports — humans decide.'); $$;
create or replace function public._hwajbp175_self_love_connection() returns jsonb language sql immutable as $$
  select jsonb_build_object('principle', 'Self Love — confidence, responsibility, courage, self-awareness.', 'values', jsonb_build_array('confidence','responsibility','courage','self_awareness','reflection','growth'), 'cross_link', '/app/self-love-engine'); $$;
create or replace function public._hwajbp175_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Decision audit logs via human_wisdom_augmented_judgment_audit_logs'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via human_wisdom_judgment permissions'),
    jsonb_build_object('key', 'companion_histories', 'label', 'Companion action histories — metadata only'),
    jsonb_build_object('key', 'approval_records', 'label', 'Human approval records'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  )); $$;
create or replace function public._hwajbp175_era_opener_summary() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('phase', 171, 'key', 'multi_generational_futures', 'label', 'Multi-Generational Futures Phase 171', 'route', '/app/multi-generational-futures-engine', 'description', 'Era opener'),
    jsonb_build_object('phase', 172, 'key', 'intergenerational_guardianship', 'label', 'Intergenerational Guardianship Phase 172', 'route', '/app/intergenerational-guardianship-engine', 'description', 'Guardianship'),
    jsonb_build_object('phase', 173, 'key', 'human_identity_meaning', 'label', 'Human Identity & Meaning Phase 173', 'route', '/app/human-identity-meaning-engine', 'description', 'Meaning & identity'),
    jsonb_build_object('phase', 174, 'key', 'human_creativity_imagination', 'label', 'Human Creativity & Imagination Phase 174', 'route', '/app/human-creativity-imagination-engine', 'description', 'Creativity amplification'),
    jsonb_build_object('phase', 175, 'key', 'human_wisdom_augmented_judgment', 'label', 'Human Wisdom & Judgment Phase 175', 'route', '/app/human-wisdom-augmented-judgment-engine', 'description', 'Wisdom supports judgment — not decisions')
  ); $$;
create or replace function public._hwajbp175_extended_cross_links() returns jsonb language sql immutable as $$ select jsonb_build_array(
    jsonb_build_object('key', 'decision_support', 'label', 'Decision Support Engine DSE', 'route', '/app/assistant/decisions', 'relationship', 'Business decision guidance — cross-link only'),
    jsonb_build_object('key', 'human_creativity_imagination', 'label', 'Human Creativity & Imagination Phase 174', 'route', '/app/human-creativity-imagination-engine', 'relationship', 'Creativity — cross-link only'),
    jsonb_build_object('key', 'human_identity_meaning', 'label', 'Human Identity & Meaning Phase 173', 'route', '/app/human-identity-meaning-engine', 'relationship', 'Meaning — cross-link only')
  ); $$;
create or replace function public._hwajbp175_integration_links() returns jsonb language sql stable as $$ select public._hwajbp175_era_opener_summary() || public._hwajbp175_extended_cross_links(); $$;
create or replace function public._hwajbp175_dogfooding() returns text language sql immutable as $$
  select 'Aipify uses Wisdom & Judgment Center internally with metadata-only executive reviews and reflection scaffolds. Growth Partner terminology. Wisdom Companion supports — never replaces human responsibility.'; $$;
create or replace function public._hwajbp175_vision_phrases() returns jsonb language sql immutable as $$
  select jsonb_build_array('People First — humans decide.', 'Wisdom Companion informs and prepares.', 'Responsible autonomy — transparency required.', 'Growth Partner — never Affiliate.'); $$;
create or replace function public._hwajbp175_privacy_note() returns text language sql immutable as $$
  select 'Wisdom & Judgment Center metadata only — executive review summaries max ~500 chars, reflection aggregates. No surveillance, ranking, or PII content.'; $$;

create or replace function public._hwaj_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_settings public.human_wisdom_augmented_judgment_settings; v_reviews int; v_reflections int; v_notes int; v_active int; v_score numeric;
begin
  select * into v_settings from public.human_wisdom_augmented_judgment_settings where tenant_id = p_tenant_id;
  select count(*) into v_reviews from public.human_wisdom_augmented_judgment_reviews where tenant_id = p_tenant_id;
  select count(*) into v_reflections from public.human_wisdom_augmented_judgment_reflections where tenant_id = p_tenant_id;
  select count(*) into v_notes from public.human_wisdom_augmented_judgment_judgment_scaffolds where tenant_id = p_tenant_id;
  select count(*) into v_active from public.human_wisdom_augmented_judgment_reflections where tenant_id = p_tenant_id and status in ('draft','review');
  v_score := round(coalesce(v_settings.wisdom_readiness_level,1)*10.0 + least(v_reviews,5)*3.5 + least(v_reflections,8)*2.0 + least(v_notes,8)*2.0 + least(v_active,8)*1.5, 1);
  return jsonb_build_object('human_wisdom_judgment_score', v_score, 'enabled', coalesce(v_settings.enabled,false), 'judgment_mode', coalesce(v_settings.judgment_mode, 'guided'),
    'wisdom_readiness_level', coalesce(v_settings.wisdom_readiness_level,1), 'executive_reviews_count', v_reviews, 'reflections_count', v_reflections, 'judgment_scaffolds_count', v_notes,
    'active_reflections_count', v_active, 'era_phases_count', jsonb_array_length(public._hwajbp175_era_opener_summary()), 'cross_links_count', jsonb_array_length(public._hwajbp175_integration_links()));
end; $$;

create or replace function public._hwajbp175_engagement_summary(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb; begin
  perform public._hwaj_ensure_settings(p_org_id); perform public._hwaj_seed_reflections(p_org_id); perform public._hwaj_seed_judgment_scaffolds(p_org_id);
  v_metrics := public._hwaj_refresh_metrics(p_org_id);
  return jsonb_build_object('human_wisdom_judgment_score', coalesce((v_metrics->>'human_wisdom_judgment_score')::numeric,0), 'enabled', coalesce((v_metrics->>'enabled')::boolean,false),
    'judgment_mode', coalesce(v_metrics->>'judgment_mode', 'guided'), 'wisdom_readiness_level', coalesce((v_metrics->>'wisdom_readiness_level')::int,1),
    'executive_reviews_count', coalesce((v_metrics->>'executive_reviews_count')::int,0), 'reflections_count', coalesce((v_metrics->>'reflections_count')::int,0),
    'judgment_scaffolds_count', coalesce((v_metrics->>'judgment_scaffolds_count')::int,0), 'active_reflections_count', coalesce((v_metrics->>'active_reflections_count')::int,0),
    'era_phases_count', coalesce((v_metrics->>'era_phases_count')::int,0), 'cross_links_count', coalesce((v_metrics->>'cross_links_count')::int,0),
    'privacy_note', public._hwajbp175_privacy_note(), 'not_surveillance', true);
end; $$;

create or replace function public._hwajbp175_success_criteria(p_org_id uuid) returns jsonb language plpgsql stable security definer set search_path = public as $$
begin perform public._hwaj_ensure_settings(p_org_id); perform public._hwaj_seed_reflections(p_org_id); perform public._hwaj_seed_judgment_scaffolds(p_org_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'center', 'label', 'Wisdom & Judgment Center — eight capabilities', 'met', jsonb_array_length(public._hwajbp175_wisdom_judgment_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'engine', 'label', 'Reflection engine — five questions', 'met', jsonb_array_length(public._hwajbp175_wisdom_judgment_engine()->'reflection_questions') = 5, 'note', null),
    jsonb_build_object('key', 'framework', 'label', 'Framework domains documented', 'met', jsonb_array_length(public._hwajbp175_augmented_judgment_framework()->'domains') >= 6, 'note', null),
    jsonb_build_object('key', 'companion', 'label', 'Wisdom Companion capabilities', 'met', jsonb_array_length(public._hwajbp175_wisdom_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'reflections_seeded', 'label', 'Reflections seeded', 'met', (select count(*) >= 8 from public.human_wisdom_augmented_judgment_reflections r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'notes_seeded', 'label', 'Scaffold notes seeded', 'met', (select count(*) >= 8 from public.human_wisdom_augmented_judgment_judgment_scaffolds n where n.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._hwajbp175_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'era', 'label', 'Era phases documented', 'met', jsonb_array_length(public._hwajbp175_era_opener_summary()) = 5, 'note', null),
    jsonb_build_object('key', 'baseline', 'label', 'Repo Phase 175 baseline tables', 'met', to_regclass('public.human_wisdom_augmented_judgment_settings') is not null, 'note', '_hwaj_* helpers intact')
  );
end; $$;

create or replace function public._hwajbp175_blueprint_block(p_org_id uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 175 — Human Wisdom & Augmented Judgment Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE175_HUMAN_WISDOM_AUGMENTED_JUDGMENT.md', 'engine_phase', 'Repo Phase 175', 'route', '/app/human-wisdom-augmented-judgment-engine',
    'distinction_note', public._hwajbp175_distinction_note(), 'mission', public._hwajbp175_mission(), 'philosophy', public._hwajbp175_philosophy(),
    'abos_principle', public._hwajbp175_abos_principle(), 'vision', public._hwajbp175_vision(), 'objectives', public._hwajbp175_objectives(),
    'wisdom_judgment_center', public._hwajbp175_wisdom_judgment_center(), 'wisdom_judgment_engine', public._hwajbp175_wisdom_judgment_engine(),
    'augmented_judgment_framework', public._hwajbp175_augmented_judgment_framework(), 'executive_wisdom_reviews', public._hwajbp175_executive_wisdom_reviews(),
    'wisdom_companion', public._hwajbp175_wisdom_companion(), 'judgment_augmentation_engine', public._hwajbp175_judgment_augmentation_engine(),
    'companion_limitations', public._hwajbp175_companion_limitations(), 'self_love_connection', public._hwajbp175_self_love_connection(),
    'security_requirements', public._hwajbp175_security_requirements(), 'era_opener_summary', public._hwajbp175_era_opener_summary(),
    'integration_links', public._hwajbp175_integration_links(), 'dogfooding', public._hwajbp175_dogfooding(),
    'success_criteria', public._hwajbp175_success_criteria(p_org_id), 'engagement_summary', public._hwajbp175_engagement_summary(p_org_id),
    'vision_phrases', public._hwajbp175_vision_phrases(), 'privacy_note', public._hwajbp175_privacy_note()
  ); $$;

create or replace function public.record_executive_wisdom_review(p_review_type text, p_title text, p_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hwaj_require_tenant()); perform public._hwaj_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_wisdom_augmented_judgment_reviews (tenant_id, review_key, review_type, title, summary, status) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary,500), 'draft') returning id into v_id;
  perform public._hwaj_log_audit(v_tenant_id, 'executive_review_recorded', left(p_title,120), jsonb_build_object('review_id', v_id));
  return v_id; end; $$;

create or replace function public.record_wisdom_reflection(p_reflection_type text, p_title text, p_reflection_summary text, p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_key text; v_id uuid; begin
  v_tenant_id := coalesce(p_org_id, public._hwaj_require_tenant()); perform public._hwaj_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.human_wisdom_augmented_judgment_reflections (tenant_id, reflection_key, reflection_type, title, reflection_summary, status) values (v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary,500), 'draft') returning id into v_id;
  perform public._hwaj_log_audit(v_tenant_id, 'reflection_recorded', left(p_title,120), jsonb_build_object('reflection_id', v_id));
  return v_id; end; $$;

create or replace function public.get_human_wisdom_augmented_judgment_engine_card(p_org_id uuid default null) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.human_wisdom_augmented_judgment_settings; v_metrics jsonb; v_engagement jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hwaj_tenant_for_auth()); if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._hwaj_ensure_settings(v_tenant_id); perform public._hwaj_seed_reflections(v_tenant_id); perform public._hwaj_seed_judgment_scaffolds(v_tenant_id);
  v_metrics := public._hwaj_refresh_metrics(v_tenant_id); v_engagement := public._hwajbp175_engagement_summary(v_tenant_id);
  return jsonb_build_object('has_customer', true, 'human_wisdom_judgment_score', v_metrics->'human_wisdom_judgment_score', 'enabled', v_settings.enabled, 'judgment_mode', v_settings.judgment_mode,
    'wisdom_readiness_level', v_settings.wisdom_readiness_level, 'reflections_count', v_metrics->'reflections_count', 'philosophy', public._hwajbp175_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 175 — Human Wisdom & Augmented Judgment Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE175_HUMAN_WISDOM_AUGMENTED_JUDGMENT.md', 'route', '/app/human-wisdom-augmented-judgment-engine'),
    'human_wisdom_augmented_judgment_mission', public._hwajbp175_mission(), 'human_wisdom_augmented_judgment_abos_principle', public._hwajbp175_abos_principle(),
    'human_wisdom_augmented_judgment_engagement_summary', v_engagement, 'human_wisdom_augmented_judgment_note', public._hwajbp175_distinction_note(), 'human_wisdom_augmented_judgment_vision_note', public._hwajbp175_vision());
end; $$;

create or replace function public.get_human_wisdom_augmented_judgment_engine_dashboard(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_settings public.human_wisdom_augmented_judgment_settings; v_metrics jsonb; begin
  v_tenant_id := coalesce(p_org_id, public._hwaj_require_tenant()); v_settings := public._hwaj_ensure_settings(v_tenant_id);
  perform public._hwaj_seed_reflections(v_tenant_id); perform public._hwaj_seed_judgment_scaffolds(v_tenant_id); v_metrics := public._hwaj_refresh_metrics(v_tenant_id);
  perform public._hwaj_log_audit(v_tenant_id, 'dashboard_view', 'Wisdom & Judgment Center dashboard viewed', jsonb_build_object('score', v_metrics->>'human_wisdom_judgment_score'));
  return jsonb_build_object('has_customer', true, 'enabled', v_settings.enabled, 'judgment_mode', v_settings.judgment_mode, 'wisdom_readiness_level', v_settings.wisdom_readiness_level,
    'human_oversight_required', v_settings.human_oversight_required, 'philosophy', public._hwajbp175_philosophy(),
    'safety_note', 'Wisdom & Judgment Center — metadata scaffolds only. Wisdom Companion supports — never replaces human responsibility.',
    'distinction_note', public._hwajbp175_distinction_note(), 'human_wisdom_judgment_score', v_metrics->'human_wisdom_judgment_score',
    'executive_reviews_count', v_metrics->'executive_reviews_count', 'reflections_count', v_metrics->'reflections_count',
    'judgment_scaffolds_count', v_metrics->'judgment_scaffolds_count', 'active_reflections_count', v_metrics->'active_reflections_count', 'era_phases_count', v_metrics->'era_phases_count',
    'executive_reviews', coalesce((select jsonb_agg(jsonb_build_object('id',r.id,'review_key',r.review_key,'review_type',r.review_type,'title',r.title,'summary',r.summary,'status',r.status,'readiness_signal',r.readiness_signal,'captured_at',r.captured_at) order by r.captured_at desc) from public.human_wisdom_augmented_judgment_reviews r where r.tenant_id = v_tenant_id), '[]'::jsonb),
    'reflections', coalesce((select jsonb_agg(jsonb_build_object('id',b.id,'reflection_key',b.reflection_key,'reflection_type',b.reflection_type,'title',b.title,'reflection_summary',b.reflection_summary,'status',b.status,'created_at',b.created_at) order by b.created_at desc) from public.human_wisdom_augmented_judgment_reflections b where b.tenant_id = v_tenant_id), '[]'::jsonb),
    'scaffold_notes', coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'note_key',s.note_key,'note_type',s.note_type,'title',s.title,'summary',s.summary,'status',s.status,'created_at',s.created_at) order by s.created_at) from public.human_wisdom_augmented_judgment_judgment_scaffolds s where s.tenant_id = v_tenant_id), '[]'::jsonb),
    'integration_links', public._hwajbp175_integration_links(), 'era_opener_summary', public._hwajbp175_era_opener_summary(),
    'implementation_blueprint', jsonb_build_object('phase', 'Phase 175 — Human Wisdom & Augmented Judgment Engine', 'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE175_HUMAN_WISDOM_AUGMENTED_JUDGMENT.md', 'route', '/app/human-wisdom-augmented-judgment-engine'),
    'human_wisdom_augmented_judgment_blueprint', public._hwajbp175_blueprint_block(v_tenant_id), 'human_wisdom_augmented_judgment_mission', public._hwajbp175_mission(), 'human_wisdom_augmented_judgment_philosophy', public._hwajbp175_philosophy(),
    'human_wisdom_augmented_judgment_abos_principle', public._hwajbp175_abos_principle(), 'human_wisdom_augmented_judgment_objectives', public._hwajbp175_objectives(),
    'center_meta', public._hwajbp175_wisdom_judgment_center(), 'engine_meta', public._hwajbp175_wisdom_judgment_engine(), 'framework_meta', public._hwajbp175_augmented_judgment_framework(),
    'executive_reviews_meta', public._hwajbp175_executive_wisdom_reviews(), 'companion_meta', public._hwajbp175_wisdom_companion(), 'sub_engine_meta', public._hwajbp175_judgment_augmentation_engine(),
    'companion_limitations_meta', public._hwajbp175_companion_limitations(), 'self_love_connection_meta', public._hwajbp175_self_love_connection(),
    'security_requirements_meta', public._hwajbp175_security_requirements(), 'hwajbp175_integration_links', public._hwajbp175_integration_links(),
    'hwajbp175_era_opener_summary', public._hwajbp175_era_opener_summary(), 'human_wisdom_augmented_judgment_engagement_summary', public._hwajbp175_engagement_summary(v_tenant_id),
    'human_wisdom_augmented_judgment_success_criteria', public._hwajbp175_success_criteria(v_tenant_id), 'human_wisdom_augmented_judgment_vision', public._hwajbp175_vision(), 'human_wisdom_augmented_judgment_vision_phrases', public._hwajbp175_vision_phrases(),
    'human_wisdom_augmented_judgment_privacy_note', public._hwajbp175_privacy_note(), 'human_wisdom_augmented_judgment_dogfooding', public._hwajbp175_dogfooding(), 'human_wisdom_augmented_judgment_engine_note', 'Phase 175 Human Wisdom & Augmented Judgment Engine — cross-link only for related engines.');
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'human-wisdom-augmented-judgment-engine', 'Human Wisdom & Augmented Judgment Engine', 'Wisdom & Judgment Center — Cosmic Stewardship Era (171–180). People First.', 'authenticated', 185
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'human-wisdom-augmented-judgment-engine' and tenant_id is null);

grant execute on function public.get_human_wisdom_augmented_judgment_engine_card(uuid) to authenticated;
grant execute on function public.get_human_wisdom_augmented_judgment_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_wisdom_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_wisdom_reflection(text, text, text, uuid) to authenticated;
