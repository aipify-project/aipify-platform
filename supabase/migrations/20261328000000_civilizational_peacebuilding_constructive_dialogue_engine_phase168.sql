-- Phase 168 — Civilizational Peacebuilding & Constructive Dialogue Engine
-- Post-Enterprise & Civilizational Era (161–170) — Constructive Dialogue Center.
-- Healthy disagreement and peacebuilding — NOT forced agreement or suppression of dissent.
-- Distinct from Collective Decision Council Phase 137 (/app/collective-decision-council-engine — disagreement framework, cross-link only).
-- Helpers: _cpde_* (engine), _cpdebp168_* (blueprint — never collide with _cdccbp137_*, _owcebp157_*)

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
    'constructive_dialogue_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. constructive_dialogue_settings
-- ---------------------------------------------------------------------------
create table if not exists public.constructive_dialogue_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  dialogue_readiness_level int not null default 1 check (dialogue_readiness_level between 1 and 5),
  dialogue_maturity_stage text not null default 'foundational_awareness' check (
    dialogue_maturity_stage in (
      'foundational_awareness', 'respectful_engagement', 'conflict_navigation',
      'relationship_resilience', 'perspective_expansion', 'peacebuilding_readiness'
    )
  ),
  reflection_opt_in boolean not null default true,
  human_oversight_required boolean not null default true,
  governance_visibility text not null default 'executive' check (
    governance_visibility in ('leadership', 'executive', 'governance_council')
  ),
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_forced_agreement":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.constructive_dialogue_settings enable row level security;
revoke all on public.constructive_dialogue_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. constructive_dialogue_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.constructive_dialogue_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'communication_breakdown', 'unheard_perspectives', 'pressure_responses',
      'psychological_safety', 'relationship_repair', 'leader_modeling',
      'trust_practices', 'cultivate_understanding'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'completed', 'archived')
  ),
  dialogue_signal text not null default 'stable' check (
    dialogue_signal in ('emerging', 'developing', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_surveillance":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists constructive_dialogue_reviews_tenant_idx
  on public.constructive_dialogue_reviews (tenant_id, review_type, status, captured_at desc);

alter table public.constructive_dialogue_reviews enable row level security;
revoke all on public.constructive_dialogue_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. constructive_dialogue_programs
-- ---------------------------------------------------------------------------
create table if not exists public.constructive_dialogue_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  program_type text not null check (
    program_type in (
      'communication_learning', 'perspective_expansion_workshop', 'leadership_reflection',
      'relationship_health_review', 'cross_sector_forum', 'dialogue_framework_training',
      'mentorship_dialogue', 'constructive_feedback_system'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'completed', 'archived')
  ),
  dialogue_signal text not null default 'emerging' check (
    dialogue_signal in ('emerging', 'developing', 'stable', 'strong', 'needs_attention')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists constructive_dialogue_programs_tenant_idx
  on public.constructive_dialogue_programs (tenant_id, program_type, status, captured_at desc);

alter table public.constructive_dialogue_programs enable row level security;
revoke all on public.constructive_dialogue_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. constructive_dialogue_memory
-- ---------------------------------------------------------------------------
create table if not exists public.constructive_dialogue_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'leadership_reflection', 'communication_lesson', 'relationship_success_narrative',
      'knowledge_contribution', 'cultural_insight', 'organizational_learning',
      'dialogue_lesson', 'repair_conversation_scaffold'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists constructive_dialogue_memory_tenant_idx
  on public.constructive_dialogue_memory (tenant_id, memory_type, status, captured_at desc);

alter table public.constructive_dialogue_memory enable row level security;
revoke all on public.constructive_dialogue_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. constructive_dialogue_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.constructive_dialogue_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.constructive_dialogue_audit_logs enable row level security;
revoke all on public.constructive_dialogue_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'constructive_dialogue_engine', v.description
from (values
  ('constructive_dialogue.view', 'View Constructive Dialogue Center', 'View dialogue programs, executive reviews, and dialogue memory metadata'),
  ('constructive_dialogue.manage', 'Manage Constructive Dialogue Center', 'Update constructive dialogue settings and record executive dialogue reviews'),
  ('constructive_dialogue.contribute', 'Contribute Dialogue Memory', 'Contribute dialogue lessons and relationship narrative metadata scaffolds')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'constructive_dialogue.view'), ('owner', 'constructive_dialogue.manage'), ('owner', 'constructive_dialogue.contribute'),
  ('administrator', 'constructive_dialogue.view'), ('administrator', 'constructive_dialogue.manage'), ('administrator', 'constructive_dialogue.contribute'),
  ('manager', 'constructive_dialogue.view'), ('manager', 'constructive_dialogue.manage'), ('manager', 'constructive_dialogue.contribute'),
  ('employee', 'constructive_dialogue.view'), ('employee', 'constructive_dialogue.contribute'),
  ('support_agent', 'constructive_dialogue.view'),
  ('moderator', 'constructive_dialogue.view'),
  ('viewer', 'constructive_dialogue.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_cpde_)
-- ---------------------------------------------------------------------------
create or replace function public._cpde_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cpde_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cpde_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cpde_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.constructive_dialogue_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cpde_ensure_settings(p_tenant_id uuid)
returns public.constructive_dialogue_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.constructive_dialogue_settings;
begin
  insert into public.constructive_dialogue_settings (tenant_id, dialogue_readiness_level)
  values (p_tenant_id, 1)
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.constructive_dialogue_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cpde_seed_programs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.constructive_dialogue_programs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.constructive_dialogue_programs (
    tenant_id, program_key, program_type, title, summary, dialogue_signal
  ) values
    (p_tenant_id, 'communication-learning', 'communication_learning', 'Communication learning program',
     'Structured communication learning scaffold — curiosity and respect, not forced agreement.', 'stable'),
    (p_tenant_id, 'perspective-workshop', 'perspective_expansion_workshop', 'Perspective expansion workshop',
     'Workshop scaffold for alternative viewpoints — cross-link Inclusion A.83.', 'emerging'),
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection session',
     'Executive dialogue reflection metadata — leaders accountable, companions support.', 'stable'),
    (p_tenant_id, 'relationship-health', 'relationship_health_review', 'Relationship health review',
     'Aggregate relationship health themes — NOT employee surveillance or dialogue scoring.', 'emerging'),
    (p_tenant_id, 'cross-sector-forum', 'cross_sector_forum', 'Cross-sector discussion forum',
     'Cross-sector dialogue scaffold — cross-link Civilizational Coordination Phase 166.', 'draft'),
    (p_tenant_id, 'dialogue-framework', 'dialogue_framework_training', 'Dialogue framework training',
     'Healthy disagreement frameworks — distinct from Phase 137 council disagreement (cross-link).', 'stable'),
    (p_tenant_id, 'mentorship-dialogue', 'mentorship_dialogue', 'Mentorship dialogue program',
     'Mentorship cross-link Future Leaders Phase 151 — repair conversations scaffold.', 'stable'),
    (p_tenant_id, 'constructive-feedback', 'constructive_feedback_system', 'Constructive feedback system',
     'Constructive feedback scaffolds — relationship repair, not ranking.', 'emerging');
end; $$;

create or replace function public._cpde_seed_reviews(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.constructive_dialogue_reviews where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.constructive_dialogue_reviews (
    tenant_id, review_key, review_type, title, summary, dialogue_signal
  ) values
    (p_tenant_id, 'communication-breakdown', 'communication_breakdown', 'Communication breakdown themes',
     'Executive review — communication breakdown themes aggregate, not individual surveillance.', 'emerging'),
    (p_tenant_id, 'unheard-perspectives', 'unheard_perspectives', 'Unheard perspectives review',
     'Perspectives that may be unheard — cultivate understanding, not suppression.', 'stable'),
    (p_tenant_id, 'pressure-responses', 'pressure_responses', 'Pressure responses review',
     'How the organization responds under disagreement pressure — reflection not judgment.', 'emerging'),
    (p_tenant_id, 'psychological-safety', 'psychological_safety', 'Psychological safety themes',
     'Aggregate psychological safety themes — NOT employee surveillance or dialogue scoring.', 'stable'),
    (p_tenant_id, 'relationship-repair', 'relationship_repair', 'Relationship repair review',
     'Relationship repair scaffolds — trust practices and leader modeling.', 'emerging'),
    (p_tenant_id, 'leader-modeling', 'leader_modeling', 'Leader modeling review',
     'How leaders model constructive dialogue — metadata only.', 'stable'),
    (p_tenant_id, 'trust-practices', 'trust_practices', 'Trust practices review',
     'Trust-building practices across teams — cross-link Stakeholder Communication A.53.', 'stable'),
    (p_tenant_id, 'cultivate-understanding', 'cultivate_understanding', 'Cultivate understanding review',
     'Executive dialogue review — understanding over winning arguments.', 'stable');
end; $$;

create or replace function public._cpde_seed_memory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.constructive_dialogue_memory where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.constructive_dialogue_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values
    (p_tenant_id, 'leadership-reflection', 'leadership_reflection', 'Leadership reflection entry',
     'Leadership reflection metadata — cross-link Organizational Wisdom Phase 157.', 'draft'),
    (p_tenant_id, 'communication-lesson', 'communication_lesson', 'Communication lesson',
     'Communication lesson scaffold — metadata summary only.', 'draft'),
    (p_tenant_id, 'relationship-success', 'relationship_success_narrative', 'Relationship success narrative',
     'Relationship success narrative — celebrates repair, not ranking.', 'draft'),
    (p_tenant_id, 'knowledge-contribution', 'knowledge_contribution', 'Knowledge contribution',
     'Knowledge steward contribution — cross-link Civilizational Memory Phase 163.', 'draft'),
    (p_tenant_id, 'cultural-insight', 'cultural_insight', 'Cultural insight',
     'Cultural insight summary — inclusion and respect cross-link A.83.', 'draft'),
    (p_tenant_id, 'org-learning', 'organizational_learning', 'Organizational learning',
     'Organizational learning from dialogue — cross-link Sensemaking Phase 158.', 'draft'),
    (p_tenant_id, 'dialogue-lesson', 'dialogue_lesson', 'Dialogue lesson',
     'Dialogue lesson metadata — healthy disagreement strengthens institutions.', 'draft'),
    (p_tenant_id, 'repair-scaffold', 'repair_conversation_scaffold', 'Repair conversation scaffold',
     'Repair conversation scaffold — relationship resilience engine.', 'draft');
end; $$;

create or replace function public._cpde_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.constructive_dialogue_settings;
  v_programs_count int;
  v_reviews_count int;
  v_memory_count int;
  v_dialogue_score numeric;
begin
  select * into v_settings from public.constructive_dialogue_settings where tenant_id = p_tenant_id;
  select count(*) into v_programs_count from public.constructive_dialogue_programs where tenant_id = p_tenant_id;
  select count(*) into v_reviews_count from public.constructive_dialogue_reviews where tenant_id = p_tenant_id;
  select count(*) into v_memory_count from public.constructive_dialogue_memory where tenant_id = p_tenant_id;
  v_dialogue_score := round(
    coalesce(v_settings.dialogue_readiness_level, 1) * 12.0
    + least(v_programs_count, 8) * 3.0
    + least(v_reviews_count, 8) * 3.5
    + least(v_memory_count, 8) * 2.5,
    1
  );

  return jsonb_build_object(
    'constructive_dialogue_score', v_dialogue_score,
    'dialogue_readiness_level', coalesce(v_settings.dialogue_readiness_level, 1),
    'dialogue_maturity_stage', coalesce(v_settings.dialogue_maturity_stage, 'foundational_awareness'),
    'dialogue_programs_count', v_programs_count,
    'dialogue_reviews_count', v_reviews_count,
    'dialogue_memory_count', v_memory_count,
    'era_phases_count', 10,
    'cross_links_count', 14
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_cpdebp168_*)
-- ---------------------------------------------------------------------------
create or replace function public._cpdebp168_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 168 — Civilizational Peacebuilding & Constructive Dialogue Engine at /app/constructive-dialogue-engine. Post-Enterprise & Civilizational Era (161–170) — Constructive Dialogue Center for healthy disagreement and peacebuilding. NOT forced agreement. NOT suppression of dissent. Distinct from Collective Decision Council Phase 137 at /app/collective-decision-council-engine (disagreement framework — cross-link only, never duplicate _cdcc_*). Helpers _cpdebp168_* — never collide with _cdccbp137_*, _owcebp157_*. Curiosity and respect — healthy disagreement strengthens institutions. Metadata only — no employee surveillance for dialogue scoring.';
$$;

create or replace function public._cpdebp168_mission()
returns text language sql immutable as $$
  select 'Unify constructive dialogue visibility across the Post-Enterprise & Civilizational Era — Constructive Dialogue Center where organizations navigate disagreement with curiosity, respect, and peacebuilding without forced agreement or suppression of dissent.';
$$;

create or replace function public._cpdebp168_philosophy()
returns text language sql immutable as $$
  select 'People First. Healthy disagreement strengthens institutions — not forced agreement or suppressed dissent. Growth Partner never Affiliate. Dialogue Companion supports understanding — does NOT suppress perspectives, determine moral superiority, override leadership, force consensus, or replace human relationships. Wisdom before speed. No employee surveillance for dialogue scoring.';
$$;

create or replace function public._cpdebp168_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Constructive Dialogue Center aggregates era 161–170 peacebuilding visibility. Era phase engines remain authoritative for their domains. Aipify informs and prepares; leaders decide. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._cpdebp168_vision()
returns text language sql immutable as $$
  select 'Institutions where disagreement is navigated with curiosity and respect — strengthening relationships and trust because understanding matters more than winning arguments.';
$$;

create or replace function public._cpdebp168_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'constructive_dialogue_center', 'label', 'Constructive Dialogue Center', 'emoji', '🕊️', 'description', 'Dialogue frameworks, leadership reflection, companion guidance, relationship health reviews'),
    jsonb_build_object('key', 'peacebuilding_engine', 'label', 'Peacebuilding engine', 'emoji', '🤝', 'description', 'Mutual respect, curiosity, empathy, transparency, shared humanity'),
    jsonb_build_object('key', 'conflict_navigation', 'label', 'Conflict navigation framework', 'emoji', '🧭', 'description', 'Response to disagreement — psychological safety themes aggregate, not surveillance'),
    jsonb_build_object('key', 'executive_dialogue', 'label', 'Executive dialogue reviews', 'emoji', '🦉', 'description', 'Communication breakdown themes, unheard perspectives, cultivate understanding'),
    jsonb_build_object('key', 'dialogue_companion', 'label', 'Dialogue Companion', 'emoji', '💬', 'description', 'Reflection prompts and perspective summaries — does NOT determine who is right'),
    jsonb_build_object('key', 'perspective_expansion', 'label', 'Perspective expansion', 'emoji', '🔭', 'description', 'Alternative viewpoints, cross-functional perspectives, aggregate narratives'),
    jsonb_build_object('key', 'relationship_resilience', 'label', 'Relationship resilience', 'emoji', '🌱', 'description', 'Repair conversations, mentorship cross-link 151, constructive feedback'),
    jsonb_build_object('key', 'dialogue_memory', 'label', 'Dialogue memory engine', 'emoji', '📜', 'description', 'Communication lessons and relationship success narratives — metadata only')
  );
$$;

create or replace function public._cpdebp168_constructive_dialogue_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Constructive Dialogue Center — eight capabilities. Understanding not forced agreement.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'dialogue_frameworks', 'label', 'Dialogue frameworks'),
      jsonb_build_object('key', 'leadership_reflection', 'label', 'Leadership reflection sessions'),
      jsonb_build_object('key', 'companion_guidance', 'label', 'Dialogue Companion guidance'),
      jsonb_build_object('key', 'relationship_health', 'label', 'Relationship health reviews — aggregate only'),
      jsonb_build_object('key', 'communication_programs', 'label', 'Communication learning programs'),
      jsonb_build_object('key', 'cross_sector_forums', 'label', 'Cross-sector discussion forums', 'cross_link', '/app/civilizational-coordination-engine'),
      jsonb_build_object('key', 'perspective_workshops', 'label', 'Perspective expansion workshops', 'cross_link', '/app/inclusion-humanity-engine'),
      jsonb_build_object('key', 'dialogue_dashboards', 'label', 'Dialogue dashboards — metadata only')
    )
  );
$$;

create or replace function public._cpdebp168_peacebuilding_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Peacebuilding engine — civilizational peacebuilding through mutual respect and shared humanity.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'mutual_respect', 'label', 'Mutual respect'),
      jsonb_build_object('key', 'curiosity', 'label', 'Curiosity over certainty'),
      jsonb_build_object('key', 'empathy', 'label', 'Empathy and listening'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency in dialogue'),
      jsonb_build_object('key', 'shared_humanity', 'label', 'Shared humanity'),
      jsonb_build_object('key', 'diverse_experiences', 'label', 'Recognition of diverse experiences')
    )
  );
$$;

create or replace function public._cpdebp168_conflict_navigation_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Conflict navigation framework — healthy disagreement without suppression.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'response_to_disagreement', 'label', 'Response to disagreement'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety themes — aggregate NOT surveillance'),
      jsonb_build_object('key', 'leader_modeling', 'label', 'Leader modeling of constructive dialogue'),
      jsonb_build_object('key', 'relationship_repair', 'label', 'Relationship repair scaffolds'),
      jsonb_build_object('key', 'trust_practices', 'label', 'Trust-building practices')
    )
  );
$$;

create or replace function public._cpdebp168_executive_dialogue_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive dialogue reviews — leadership reflection, not surveillance or moral scoring.',
    'review_questions', jsonb_build_array(
      jsonb_build_object('key', 'communication_breakdown', 'label', 'What communication breakdown themes emerge?'),
      jsonb_build_object('key', 'unheard_perspectives', 'label', 'Which perspectives may be unheard?'),
      jsonb_build_object('key', 'pressure_responses', 'label', 'How do we respond under disagreement pressure?'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'What psychological safety themes appear? — aggregate only'),
      jsonb_build_object('key', 'cultivate_understanding', 'label', 'How do we cultivate understanding?')
    )
  );
$$;

create or replace function public._cpdebp168_dialogue_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dialogue Companion supports understanding — does NOT determine who is right or force consensus.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'communication_resources', 'label', 'Communication resources'),
      jsonb_build_object('key', 'perspective_summaries', 'label', 'Perspective summaries — not verdicts'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
      jsonb_build_object('key', 'relationship_health', 'label', 'Relationship health insights — aggregate only'),
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations')
    ),
    'must_not', jsonb_build_array(
      'Suppress dissenting perspectives',
      'Determine moral superiority',
      'Override leadership authority',
      'Force consensus',
      'Replace human relationships',
      'Score individual dialogue behavior'
    )
  );
$$;

create or replace function public._cpdebp168_perspective_expansion_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Perspective expansion engine — alternative viewpoints without moral verdicts.',
    'sources', jsonb_build_array(
      jsonb_build_object('key', 'alternative_viewpoints', 'label', 'Alternative viewpoints'),
      jsonb_build_object('key', 'cross_functional', 'label', 'Cross-functional perspectives'),
      jsonb_build_object('key', 'gp_experiences', 'label', 'Growth Partner experiences — never Affiliate'),
      jsonb_build_object('key', 'employee_narratives', 'label', 'Employee narratives — aggregate only'),
      jsonb_build_object('key', 'customer_insights', 'label', 'Customer insights — metadata'),
      jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge steward contributions', 'cross_link', '/app/civilizational-memory-engine')
    )
  );
$$;

create or replace function public._cpdebp168_relationship_resilience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship resilience engine — repair and recognition without surveillance.',
    'initiatives', jsonb_build_array(
      jsonb_build_object('key', 'repair_conversations', 'label', 'Repair conversation scaffolds'),
      jsonb_build_object('key', 'recognition_programs', 'label', 'Recognition programs', 'cross_link', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship cross-link', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'leadership_accessibility', 'label', 'Leadership accessibility efforts'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety efforts — aggregate'),
      jsonb_build_object('key', 'constructive_feedback', 'label', 'Constructive feedback systems')
    )
  );
$$;

create or replace function public._cpdebp168_dialogue_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dialogue memory engine — metadata summaries of lessons and narratives.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'leadership_reflections', 'label', 'Leadership reflections'),
      jsonb_build_object('key', 'communication_lessons', 'label', 'Communication lessons'),
      jsonb_build_object('key', 'relationship_narratives', 'label', 'Relationship success narratives'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions'),
      jsonb_build_object('key', 'cultural_insights', 'label', 'Cultural insights'),
      jsonb_build_object('key', 'organizational_learnings', 'label', 'Organizational learnings')
    )
  );
$$;

create or replace function public._cpdebp168_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Dialogue Companion limitations — understanding support only, not authority.',
    'must_avoid', jsonb_build_array(
      'Suppress dissenting perspectives',
      'Determine moral superiority',
      'Override leadership authority',
      'Force consensus',
      'Replace human relationships',
      'Employee surveillance for dialogue scoring',
      'Impose forced agreement'
    )
  );
$$;

create or replace function public._cpdebp168_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love A.76 connection — empathy, patience, humility, listening, compassion, respect in dialogue.',
    'self_love_route', '/app/self-love-engine',
    'connections', jsonb_build_array(
      jsonb_build_object('key', 'empathy', 'label', 'Empathy in disagreement'),
      jsonb_build_object('key', 'patience', 'label', 'Patience with difficult conversations'),
      jsonb_build_object('key', 'humility', 'label', 'Humility — not moral superiority'),
      jsonb_build_object('key', 'listening', 'label', 'Listening before responding'),
      jsonb_build_object('key', 'compassion', 'label', 'Compassion for those navigating conflict'),
      jsonb_build_object('key', 'respect', 'label', 'Respect for diverse perspectives')
    )
  );
$$;

create or replace function public._cpdebp168_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Constructive dialogue security — audit trails, leadership participation histories, RBAC, 2FA.',
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'dialogue_audit_logs', 'label', 'Dialogue audit logs via constructive_dialogue_audit_logs'),
      jsonb_build_object('key', 'leadership_participation', 'label', 'Leadership participation histories'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access via constructive_dialogue permissions'),
      jsonb_build_object('key', 'knowledge_protection', 'label', 'Knowledge protection controls'),
      jsonb_build_object('key', 'two_factor', 'label', '2FA recommended for constructive_dialogue.manage', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cpdebp168_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'description', 'Public value — community dialogue cross-link'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'description', 'Cross-sector dialogue — cross-link only'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'description', 'Knowledge preservation — cross-link only'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'description', 'Collective adaptation — cross-link only'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'description', 'Long-horizon intelligence — cross-link only'),
    jsonb_build_object('phase', 166, 'key', 'civilizational_coordination', 'label', 'Civilizational Coordination Phase 166', 'route', '/app/civilizational-coordination-engine', 'description', 'Coordination — cross-link only'),
    jsonb_build_object('phase', 167, 'key', 'civilizational_ethics', 'label', 'Civilizational Ethics Phase 167', 'route', '/app/civilizational-ethics-engine', 'description', 'Ethics — cross-link only'),
    jsonb_build_object('phase', 137, 'key', 'collective_decision_council', 'label', 'Collective Decision Council Phase 137', 'route', '/app/collective-decision-council-engine', 'description', 'Disagreement framework — cross-link only, never duplicate _cdcc_*'),
    jsonb_build_object('phase', 157, 'key', 'organizational_wisdom', 'label', 'Organizational Wisdom Phase 157', 'route', '/app/organizational-wisdom-engine', 'description', 'Wisdom council — cross-link only'),
    jsonb_build_object('phase', 158, 'key', 'organizational_sensemaking', 'label', 'Organizational Sensemaking Phase 158', 'route', '/app/organizational-sensemaking-engine', 'description', 'Collective intelligence — cross-link only'),
    jsonb_build_object('phase', 144, 'key', 'global_governance_diplomacy', 'label', 'Global Governance Diplomacy Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'description', 'Diplomacy — cross-link only'),
    jsonb_build_object('key', 'stakeholder_communication', 'label', 'Stakeholder Communication A.53', 'route', '/app/stakeholder-communication-engine', 'description', 'Stakeholder communications — cross-link only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'description', 'Inclusion and respectful dialogue — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'description', 'Empathy, patience, humility, listening, compassion, respect'),
    jsonb_build_object('phase', 168, 'key', 'constructive_dialogue', 'label', 'Constructive Dialogue Phase 168', 'route', '/app/constructive-dialogue-engine', 'description', 'Constructive Dialogue Center — healthy disagreement and peacebuilding')
  );
$$;

create or replace function public._cpdebp168_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Constructive Dialogue Center internally — metadata-only dialogue programs, executive review scaffolds, and dialogue memory libraries. Growth Partner terminology throughout. Curiosity and respect — no forced agreement, no dissent suppression, no employee dialogue scoring. Cross-link era 161–167 and related phases — do NOT duplicate RPCs.';
$$;

create or replace function public._cpdebp168_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Healthy disagreement strengthens institutions.',
    'Understanding over winning arguments.',
    'Curiosity and respect — not forced agreement.',
    'Growth Partner — never Affiliate.',
    'No employee surveillance for dialogue scoring.'
  );
$$;

create or replace function public._cpdebp168_privacy_note()
returns text language sql immutable as $$
  select 'Constructive dialogue metadata only — aggregate dialogue readiness, program summaries, executive review scaffolds, and dialogue memory libraries. No employee surveillance. No dialogue scoring of individuals. No forced agreement. Humans decide; Dialogue Companion prepares awareness.';
$$;

create or replace function public._cpdebp168_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cpde_ensure_settings(p_org_id);
  perform public._cpde_seed_programs(p_org_id);
  perform public._cpde_seed_reviews(p_org_id);
  perform public._cpde_seed_memory(p_org_id);
  v_metrics := public._cpde_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'constructive_dialogue_score', coalesce((v_metrics->>'constructive_dialogue_score')::numeric, 0),
    'dialogue_readiness_level', coalesce((v_metrics->>'dialogue_readiness_level')::int, 1),
    'dialogue_maturity_stage', coalesce(v_metrics->>'dialogue_maturity_stage', 'foundational_awareness'),
    'dialogue_programs_count', coalesce((v_metrics->>'dialogue_programs_count')::int, 0),
    'dialogue_reviews_count', coalesce((v_metrics->>'dialogue_reviews_count')::int, 0),
    'dialogue_memory_count', coalesce((v_metrics->>'dialogue_memory_count')::int, 0),
    'era_phases_count', 10,
    'cross_links_count', jsonb_array_length(public._cpdebp168_integration_links()),
    'privacy_note', public._cpdebp168_privacy_note(),
    'not_forced_agreement', true,
    'not_dialogue_surveillance', true
  );
end; $$;

create or replace function public._cpdebp168_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cpde_ensure_settings(p_org_id);
  perform public._cpde_seed_programs(p_org_id);
  perform public._cpde_seed_reviews(p_org_id);
  perform public._cpde_seed_memory(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'constructive_dialogue_center', 'label', 'Constructive Dialogue Center — eight capabilities', 'met', jsonb_array_length(public._cpdebp168_constructive_dialogue_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'peacebuilding_engine', 'label', 'Peacebuilding engine — six principles', 'met', jsonb_array_length(public._cpdebp168_peacebuilding_engine()->'principles') = 6, 'note', null),
    jsonb_build_object('key', 'conflict_navigation', 'label', 'Conflict navigation — five dimensions', 'met', jsonb_array_length(public._cpdebp168_conflict_navigation_framework()->'dimensions') = 5, 'note', null),
    jsonb_build_object('key', 'executive_reviews', 'label', 'Executive dialogue reviews — five questions', 'met', jsonb_array_length(public._cpdebp168_executive_dialogue_reviews()->'review_questions') = 5, 'note', null),
    jsonb_build_object('key', 'programs_seeded', 'label', 'Dialogue programs seeded', 'met', (select count(*) >= 8 from public.constructive_dialogue_programs p where p.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'reviews_seeded', 'label', 'Executive dialogue reviews seeded', 'met', (select count(*) >= 8 from public.constructive_dialogue_reviews r where r.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'memory_seeded', 'label', 'Dialogue memory seeded', 'met', (select count(*) >= 8 from public.constructive_dialogue_memory m where m.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links documented', 'met', jsonb_array_length(public._cpdebp168_integration_links()) >= 14, 'note', null),
    jsonb_build_object('key', 'default_readiness', 'label', 'Default dialogue readiness level 1', 'met', exists (select 1 from public.constructive_dialogue_settings s where s.tenant_id = p_org_id and s.dialogue_readiness_level >= 1), 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.constructive_dialogue_settings s where s.tenant_id = p_org_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — no suppress or force consensus', 'met', jsonb_array_length(public._cpdebp168_companion_limitations()->'must_avoid') >= 7, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._cpdebp168_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 168 baseline tables and RPCs', 'met', to_regclass('public.constructive_dialogue_settings') is not null, 'note', '_cpde_* helpers intact')
  );
end; $$;

create or replace function public._cpdebp168_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 168 — Civilizational Peacebuilding & Constructive Dialogue Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE168_CIVILIZATIONAL_PEACEBUILDING_CONSTRUCTIVE_DIALOGUE.md',
    'engine_phase', 'Repo Phase 168 Constructive Dialogue Engine',
    'route', '/app/constructive-dialogue-engine',
    'mapping_note', 'Post-Enterprise Era 161–170 — constructive dialogue through curiosity and respect. Era phase engines remain authoritative.',
    'distinction_note', public._cpdebp168_distinction_note(),
    'mission', public._cpdebp168_mission(),
    'philosophy', public._cpdebp168_philosophy(),
    'abos_principle', public._cpdebp168_abos_principle(),
    'vision', public._cpdebp168_vision(),
    'objectives', public._cpdebp168_objectives(),
    'constructive_dialogue_center', public._cpdebp168_constructive_dialogue_center(),
    'peacebuilding_engine', public._cpdebp168_peacebuilding_engine(),
    'conflict_navigation_framework', public._cpdebp168_conflict_navigation_framework(),
    'executive_dialogue_reviews', public._cpdebp168_executive_dialogue_reviews(),
    'dialogue_companion', public._cpdebp168_dialogue_companion(),
    'perspective_expansion_engine', public._cpdebp168_perspective_expansion_engine(),
    'relationship_resilience_engine', public._cpdebp168_relationship_resilience_engine(),
    'dialogue_memory_engine', public._cpdebp168_dialogue_memory_engine(),
    'companion_limitations', public._cpdebp168_companion_limitations(),
    'self_love_connection', public._cpdebp168_self_love_connection(),
    'security_requirements', public._cpdebp168_security_requirements(),
    'integration_links', public._cpdebp168_integration_links(),
    'dogfooding', public._cpdebp168_dogfooding(),
    'success_criteria', public._cpdebp168_success_criteria(p_org_id),
    'engagement_summary', public._cpdebp168_engagement_summary(p_org_id),
    'vision_phrases', public._cpdebp168_vision_phrases(),
    'privacy_note', public._cpdebp168_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_executive_dialogue_review(
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
  v_tenant_id := coalesce(p_tenant_id, public._cpde_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Review summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.constructive_dialogue_reviews (
    tenant_id, review_key, review_type, title, summary
  ) values (v_tenant_id, v_key, p_review_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._cpde_log_audit(v_tenant_id, 'dialogue_review_recorded', left(p_summary, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

create or replace function public.record_dialogue_memory_entry(
  p_memory_type text,
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
  v_tenant_id := coalesce(p_tenant_id, public._cpde_require_tenant());
  if char_length(p_summary) > 500 then raise exception 'Memory summary max 500 characters'; end if;
  v_key := p_memory_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.constructive_dialogue_memory (
    tenant_id, memory_key, memory_type, title, summary
  ) values (v_tenant_id, v_key, p_memory_type, p_title, left(p_summary, 500))
  returning id into v_id;
  perform public._cpde_log_audit(v_tenant_id, 'dialogue_memory_recorded', left(p_summary, 120),
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_constructive_dialogue_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.constructive_dialogue_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cpde_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cpde_ensure_settings(v_tenant_id);
  perform public._cpde_seed_programs(v_tenant_id);
  perform public._cpde_seed_reviews(v_tenant_id);
  perform public._cpde_seed_memory(v_tenant_id);
  v_metrics := public._cpde_refresh_metrics(v_tenant_id);
  v_engagement := public._cpdebp168_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'constructive_dialogue_score', v_metrics->'constructive_dialogue_score',
    'dialogue_readiness_level', v_settings.dialogue_readiness_level,
    'dialogue_reviews_count', v_metrics->'dialogue_reviews_count',
    'philosophy', public._cpdebp168_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 168 — Civilizational Peacebuilding & Constructive Dialogue Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE168_CIVILIZATIONAL_PEACEBUILDING_CONSTRUCTIVE_DIALOGUE.md',
      'engine_phase', 'Repo Phase 168 Constructive Dialogue Engine',
      'route', '/app/constructive-dialogue-engine',
      'mapping_note', 'Post-Enterprise Era 161–170 — constructive dialogue through curiosity and respect.'
    ),
    'constructive_dialogue_mission', public._cpdebp168_mission(),
    'constructive_dialogue_abos_principle', public._cpdebp168_abos_principle(),
    'constructive_dialogue_engagement_summary', v_engagement,
    'constructive_dialogue_note', public._cpdebp168_distinction_note(),
    'constructive_dialogue_vision_note', public._cpdebp168_vision()
  );
end; $$;

create or replace function public.get_constructive_dialogue_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.constructive_dialogue_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._cpde_require_tenant());
  v_settings := public._cpde_ensure_settings(v_tenant_id);
  perform public._cpde_seed_programs(v_tenant_id);
  perform public._cpde_seed_reviews(v_tenant_id);
  perform public._cpde_seed_memory(v_tenant_id);
  v_metrics := public._cpde_refresh_metrics(v_tenant_id);
  perform public._cpde_log_audit(v_tenant_id, 'dashboard_view', 'Constructive Dialogue dashboard viewed',
    jsonb_build_object('constructive_dialogue_score', v_metrics->>'constructive_dialogue_score', 'readiness_level', v_settings.dialogue_readiness_level));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'dialogue_readiness_level', v_settings.dialogue_readiness_level,
    'dialogue_maturity_stage', v_settings.dialogue_maturity_stage,
    'reflection_opt_in', v_settings.reflection_opt_in,
    'human_oversight_required', v_settings.human_oversight_required,
    'governance_visibility', v_settings.governance_visibility,
    'philosophy', public._cpdebp168_philosophy(),
    'safety_note', 'Constructive Dialogue Engine — metadata-only aggregates. NOT forced agreement. NOT suppression of dissent. Era phase engines remain authoritative — cross-link only. No employee dialogue scoring.',
    'distinction_note', public._cpdebp168_distinction_note(),
    'constructive_dialogue_score', v_metrics->'constructive_dialogue_score',
    'dialogue_programs_count', v_metrics->'dialogue_programs_count',
    'dialogue_reviews_count', v_metrics->'dialogue_reviews_count',
    'dialogue_memory_count', v_metrics->'dialogue_memory_count',
    'dialogue_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'program_type', p.program_type,
        'title', p.title, 'summary', p.summary, 'status', p.status,
        'dialogue_signal', p.dialogue_signal, 'captured_at', p.captured_at
      ) order by p.captured_at desc)
      from public.constructive_dialogue_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'dialogue_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'title', r.title, 'summary', r.summary, 'status', r.status,
        'dialogue_signal', r.dialogue_signal, 'captured_at', r.captured_at
      ) order by r.captured_at desc)
      from public.constructive_dialogue_reviews r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'dialogue_memory_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'captured_at', m.captured_at
      ) order by m.captured_at desc)
      from public.constructive_dialogue_memory m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cpdebp168_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 168 — Civilizational Peacebuilding & Constructive Dialogue Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE168_CIVILIZATIONAL_PEACEBUILDING_CONSTRUCTIVE_DIALOGUE.md',
      'engine_phase', 'Repo Phase 168 Constructive Dialogue Engine',
      'route', '/app/constructive-dialogue-engine',
      'mapping_note', 'Post-Enterprise Era 161–170 — Constructive Dialogue Center.'
    ),
    'constructive_dialogue_engine_note', 'Constructive Dialogue Engine (ABOS Phase 168) — healthy disagreement and peacebuilding. Cross-link era 161–167 and related phases — do NOT duplicate RPCs.',
    'constructive_dialogue_blueprint', public._cpdebp168_blueprint_block(v_tenant_id),
    'constructive_dialogue_distinction_note', public._cpdebp168_distinction_note(),
    'constructive_dialogue_mission', public._cpdebp168_mission(),
    'constructive_dialogue_philosophy', public._cpdebp168_philosophy(),
    'constructive_dialogue_abos_principle', public._cpdebp168_abos_principle(),
    'constructive_dialogue_objectives', public._cpdebp168_objectives(),
    'constructive_dialogue_center_meta', public._cpdebp168_constructive_dialogue_center(),
    'peacebuilding_engine_meta', public._cpdebp168_peacebuilding_engine(),
    'conflict_navigation_framework_meta', public._cpdebp168_conflict_navigation_framework(),
    'executive_dialogue_reviews_meta', public._cpdebp168_executive_dialogue_reviews(),
    'dialogue_companion_meta', public._cpdebp168_dialogue_companion(),
    'perspective_expansion_engine_meta', public._cpdebp168_perspective_expansion_engine(),
    'relationship_resilience_engine_meta', public._cpdebp168_relationship_resilience_engine(),
    'dialogue_memory_engine_meta', public._cpdebp168_dialogue_memory_engine(),
    'companion_limitations_meta', public._cpdebp168_companion_limitations(),
    'self_love_connection_meta', public._cpdebp168_self_love_connection(),
    'security_requirements_meta', public._cpdebp168_security_requirements(),
    'cpdebp168_integration_links', public._cpdebp168_integration_links(),
    'constructive_dialogue_engagement_summary', public._cpdebp168_engagement_summary(v_tenant_id),
    'constructive_dialogue_success_criteria', public._cpdebp168_success_criteria(v_tenant_id),
    'constructive_dialogue_vision', public._cpdebp168_vision(),
    'constructive_dialogue_vision_phrases', public._cpdebp168_vision_phrases(),
    'constructive_dialogue_privacy_note', public._cpdebp168_privacy_note(),
    'constructive_dialogue_dogfooding', public._cpdebp168_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'constructive-dialogue-engine', 'Civilizational Peacebuilding & Constructive Dialogue Engine',
  'Post-Enterprise Era 161–170 — Constructive Dialogue Center. Healthy disagreement and peacebuilding — not forced agreement.',
  'authenticated', 178
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'constructive-dialogue-engine' and tenant_id is null
);

grant execute on function public.get_constructive_dialogue_engine_card(uuid) to authenticated;
grant execute on function public.get_constructive_dialogue_engine_dashboard(uuid) to authenticated;
grant execute on function public.record_executive_dialogue_review(text, text, text, uuid) to authenticated;
grant execute on function public.record_dialogue_memory_entry(text, text, text, uuid) to authenticated;
grant execute on function public._cpdebp168_distinction_note() to authenticated;
grant execute on function public._cpdebp168_mission() to authenticated;
grant execute on function public._cpdebp168_philosophy() to authenticated;
grant execute on function public._cpdebp168_abos_principle() to authenticated;
grant execute on function public._cpdebp168_vision() to authenticated;
grant execute on function public._cpdebp168_objectives() to authenticated;
grant execute on function public._cpdebp168_constructive_dialogue_center() to authenticated;
grant execute on function public._cpdebp168_peacebuilding_engine() to authenticated;
grant execute on function public._cpdebp168_conflict_navigation_framework() to authenticated;
grant execute on function public._cpdebp168_executive_dialogue_reviews() to authenticated;
grant execute on function public._cpdebp168_dialogue_companion() to authenticated;
grant execute on function public._cpdebp168_perspective_expansion_engine() to authenticated;
grant execute on function public._cpdebp168_relationship_resilience_engine() to authenticated;
grant execute on function public._cpdebp168_dialogue_memory_engine() to authenticated;
grant execute on function public._cpdebp168_companion_limitations() to authenticated;
grant execute on function public._cpdebp168_self_love_connection() to authenticated;
grant execute on function public._cpdebp168_security_requirements() to authenticated;
grant execute on function public._cpdebp168_integration_links() to authenticated;
grant execute on function public._cpdebp168_dogfooding() to authenticated;
grant execute on function public._cpdebp168_vision_phrases() to authenticated;
grant execute on function public._cpdebp168_privacy_note() to authenticated;
grant execute on function public._cpdebp168_engagement_summary(uuid) to authenticated;
grant execute on function public._cpdebp168_success_criteria(uuid) to authenticated;
grant execute on function public._cpdebp168_blueprint_block(uuid) to authenticated;
