-- Phase 139 — Human Potential & Augmented Work Engine
-- Autonomous Organization Era (131–140). Human potential, augmented work, growth companion — companionship before replacement.
-- Distinct from Human Success repo Phase 82 (/app/human-success — platform adoption/value; cross-link, do NOT duplicate surveillance).
-- Helpers: _hpaw_* (engine), _hpawbp139_* (blueprint — never collide with _hse_* if added)

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
    'human_potential_augmented_work'
  )
);

-- ---------------------------------------------------------------------------
-- 1. human_potential_settings
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  human_potential_center_enabled boolean not null default true,
  growth_companion_enabled boolean not null default true,
  strengths_reflection_enabled boolean not null default true,
  meaningful_work_enabled boolean not null default true,
  recognition_scaffolds_enabled boolean not null default true,
  no_ranking_mode boolean not null default true,
  user_owned_reflections boolean not null default true,
  augmentation_principles_acknowledged boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.human_potential_settings enable row level security;
revoke all on public.human_potential_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. human_potential_growth_profiles (user-owned — admins see counts only via RPC)
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_growth_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  strengths_summary text check (char_length(strengths_summary) <= 500),
  interests_summary text check (char_length(interests_summary) <= 500),
  learning_preferences text check (char_length(learning_preferences) <= 500),
  collaboration_style text check (char_length(collaboration_style) <= 500),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists human_potential_growth_profiles_tenant_idx
  on public.human_potential_growth_profiles (tenant_id, status);

alter table public.human_potential_growth_profiles enable row level security;
revoke all on public.human_potential_growth_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. human_potential_learning_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_learning_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  recommendation_key text not null,
  recommendation_type text not null check (
    recommendation_type in (
      'learning_path', 'skill_development', 'knowledge_exploration', 'role_exploration',
      'mentorship_scaffold', 'university_module', 'training_refresh', 'capability_guidance'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  cross_link_route text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'archived')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);

create index if not exists human_potential_learning_recommendations_tenant_idx
  on public.human_potential_learning_recommendations (tenant_id, status, priority);

alter table public.human_potential_learning_recommendations enable row level security;
revoke all on public.human_potential_learning_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. human_potential_reflection_entries (user-owned — metadata summaries max 500 chars)
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_reflection_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  entry_key text not null,
  prompt_type text not null check (
    prompt_type in (
      'what_learned', 'what_energized', 'what_growing', 'support_needed',
      'strengths_used', 'meaningful_work', 'creative_contribution', 'rest_boundaries'
    )
  ),
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, entry_key)
);

create index if not exists human_potential_reflection_entries_tenant_idx
  on public.human_potential_reflection_entries (tenant_id, user_id, status, created_at desc);

alter table public.human_potential_reflection_entries enable row level security;
revoke all on public.human_potential_reflection_entries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. human_potential_recognition_moments (aggregate scaffolds or user-consented)
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_recognition_moments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  moment_key text not null,
  user_id uuid references public.users (id) on delete cascade,
  moment_type text not null check (
    moment_type in (
      'knowledge_contribution', 'community_participation', 'leadership_behavior',
      'growth_milestone', 'support_activity', 'innovation', 'collaboration', 'mentorship'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  visibility text not null default 'org_scaffold' check (
    visibility in ('org_scaffold', 'user_consented')
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, moment_key)
);

create index if not exists human_potential_recognition_moments_tenant_idx
  on public.human_potential_recognition_moments (tenant_id, moment_type, status);

alter table public.human_potential_recognition_moments enable row level security;
revoke all on public.human_potential_recognition_moments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. human_potential_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.human_potential_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.human_potential_audit_logs enable row level security;
revoke all on public.human_potential_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'human_potential_augmented_work_engine', v.description
from (values
  ('human_potential.view', 'View Human Potential Center', 'View augmentation scaffolds, learning recommendations, and personal growth companion tools'),
  ('human_potential.manage', 'Manage Human Potential Center', 'Configure org augmentation principles — personal reflection content remains user-owned')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'human_potential.view'), ('owner', 'human_potential.manage'),
  ('administrator', 'human_potential.view'), ('administrator', 'human_potential.manage'),
  ('manager', 'human_potential.view'),
  ('staff', 'human_potential.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_hpaw_*)
-- ---------------------------------------------------------------------------
create or replace function public._hpaw_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._hpaw_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._hpaw_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._hpaw_current_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._mta_app_user_id();
end; $$;

create or replace function public._hpaw_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.human_potential_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._hpaw_ensure_settings(p_tenant_id uuid)
returns public.human_potential_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.human_potential_settings;
begin
  insert into public.human_potential_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.human_potential_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._hpaw_companion_limitation_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'no_ranking_value', 'label', 'No ranking human value', 'description', 'Growth Companion never ranks worth or performance'),
    jsonb_build_object('key', 'no_unhealthy_competition', 'label', 'No unhealthy competition', 'description', 'No leaderboards or comparative scoring between people'),
    jsonb_build_object('key', 'no_pressure', 'label', 'No pressure', 'description', 'Encouragement without guilt or urgency manipulation'),
    jsonb_build_object('key', 'no_replace_managers', 'label', 'No replacing managers/mentors', 'description', 'Companions support — humans lead and mentor'),
    jsonb_build_object('key', 'no_defining_identity', 'label', 'No defining identity', 'description', 'Self-reported strengths only — never algorithmic identity labels')
  );
$$;

create or replace function public._hpaw_augmentation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reduce_burdens', 'label', 'Reduce administrative burdens'),
    jsonb_build_object('key', 'expand_knowledge', 'label', 'Expand knowledge access'),
    jsonb_build_object('key', 'increase_confidence', 'label', 'Increase confidence through preparation'),
    jsonb_build_object('key', 'support_creativity', 'label', 'Support creativity'),
    jsonb_build_object('key', 'strengthen_collaboration', 'label', 'Strengthen collaboration'),
    jsonb_build_object('key', 'meaningful_work_time', 'label', 'Time for meaningful work')
  );
$$;

create or replace function public._hpaw_seed_learning_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.human_potential_learning_recommendations where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_potential_learning_recommendations (
    tenant_id, recommendation_key, recommendation_type, title, summary, cross_link_route, status, priority
  ) values
    (p_tenant_id, 'rec-university-foundations', 'university_module', 'Aipify University foundations refresh',
     'Explore foundational modules at Aipify University — self-paced, no ranking.', '/app/aipify-university', 'pending', 'moderate'),
    (p_tenant_id, 'rec-training-path', 'learning_path', 'Role-based learning path',
     'Cross-link Learning & Training Engine for module adoption paths — development not evaluation.', '/app/learning-training-engine', 'pending', 'moderate'),
    (p_tenant_id, 'rec-skill-growth', 'skill_development', 'Emerging capability exploration',
     'Self-reflection on skills you want to grow — companion suggests resources, never scores you.', null, 'pending', 'low'),
    (p_tenant_id, 'rec-knowledge-explore', 'knowledge_exploration', 'Knowledge discovery scaffold',
     'Approved KC articles aligned with your interests — metadata suggestions only.', '/app/knowledge-center-engine', 'pending', 'moderate'),
    (p_tenant_id, 'rec-growth-evolution', 'capability_guidance', 'Growth & Evolution cross-link',
     'Explore organizational evolution habits — distinct from personal potential reflection.', '/app/growth-evolution-engine', 'pending', 'low'),
    (p_tenant_id, 'rec-mentorship', 'mentorship_scaffold', 'Mentorship conversation scaffold',
     'Prepare questions for a human mentor — companion does not replace managers or mentors.', null, 'pending', 'moderate');
end; $$;

create or replace function public._hpaw_seed_recognition_moments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.human_potential_recognition_moments where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.human_potential_recognition_moments (
    tenant_id, moment_key, moment_type, title, summary, visibility, status
  ) values
    (p_tenant_id, 'mom-knowledge', 'knowledge_contribution', 'Knowledge contribution recognition',
     'Org scaffold — celebrate sharing approved knowledge. Cross-link Gratitude & Recognition A.89.', 'org_scaffold', 'active'),
    (p_tenant_id, 'mom-community', 'community_participation', 'Community participation',
     'Aggregate community engagement awareness — not individual surveillance.', 'org_scaffold', 'active'),
    (p_tenant_id, 'mom-leadership', 'leadership_behavior', 'Supportive leadership behaviors',
     'Recognition scaffold for compassionate leadership — humans decide recognition.', 'org_scaffold', 'active'),
    (p_tenant_id, 'mom-growth', 'growth_milestone', 'Personal growth milestones',
     'User-consented celebration of progress — Self Love cross-link for sustainable pace.', 'org_scaffold', 'active'),
    (p_tenant_id, 'mom-support', 'support_activity', 'Peer support activities',
     'Acknowledge helping colleagues — encouragement not ranking.', 'org_scaffold', 'active'),
    (p_tenant_id, 'mom-innovation', 'innovation', 'Creative contribution',
     'Meaningful work and innovation scaffolds — amplify strengths, reduce repetitive burden.', 'org_scaffold', 'active');
end; $$;

create or replace function public._hpaw_refresh_metrics(p_tenant_id uuid, p_user_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_learning_pending int;
  v_reflections int;
  v_recognition int;
  v_profiles int;
  v_engagement numeric;
begin
  v_user_id := coalesce(p_user_id, public._hpaw_current_user_id());
  select count(*) into v_learning_pending from public.human_potential_learning_recommendations
  where tenant_id = p_tenant_id and status = 'pending'
    and (user_id is null or user_id = v_user_id);
  select count(*) into v_reflections from public.human_potential_reflection_entries
  where tenant_id = p_tenant_id and user_id = v_user_id and status = 'active';
  select count(*) into v_recognition from public.human_potential_recognition_moments
  where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_profiles from public.human_potential_growth_profiles
  where tenant_id = p_tenant_id and status = 'active';

  v_engagement := least(100, greatest(0,
    (v_learning_pending * 4) + (v_reflections * 8) + (v_recognition * 2) + (v_profiles * 5) + 15
  ));

  return jsonb_build_object(
    'augmentation_engagement_score', round(v_engagement, 1),
    'learning_recommendations_pending', v_learning_pending,
    'reflection_entries_active', v_reflections,
    'recognition_moments_active', v_recognition,
    'growth_profiles_count', v_profiles,
    'companion_limitations_count', jsonb_array_length(public._hpaw_companion_limitation_rules()),
    'augmentation_principles_count', jsonb_array_length(public._hpaw_augmentation_principles()),
    'not_human_value_ranking', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_hpawbp139_*)
-- ---------------------------------------------------------------------------
create or replace function public._hpawbp139_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 139 — Human Potential & Augmented Work Engine at /app/human-potential-augmented-work-engine. Human potential, augmented work, strengths reflection, meaningful work, growth companion — Autonomous Organization Era (131–140). Distinct from Human Success repo Phase 82 at /app/human-success (platform adoption/value — cross-link, do NOT duplicate adoption scoring surveillance). Distinct from Learning & Training A.36 at /app/learning-training-engine and Phase 92 talent blueprint scaffolds. Helpers _hpawbp139_* — never collide with _hse_*. No ranking, surveillance, or punitive scoring.';
$$;

create or replace function public._hpawbp139_mission()
returns text language sql immutable as $$
  select 'Elevate human potential through augmented work — companionship before replacement. Technology amplifies strengths, reduces burdens, and creates space for meaningful contribution.';
$$;

create or replace function public._hpawbp139_philosophy()
returns text language sql immutable as $$
  select 'People First. Companionship before replacement. Growth Companion supports — never evaluates human worth. Self-reported strengths and user-owned reflections only. No ranking, surveillance, or punitive scoring.';
$$;

create or replace function public._hpawbp139_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Human Potential Center augments people with learning recommendations, reflection tools, and recognition scaffolds. Companions prepare and encourage; humans decide, connect, and grow.';
$$;

create or replace function public._hpawbp139_vision()
returns text language sql immutable as $$
  select 'Work elevated by technology that respects humanity — augmented capabilities, meaningful contribution, and compassionate growth companions that never diminish human dignity.';
$$;

create or replace function public._hpawbp139_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'augment_strengths', 'emoji', '💪', 'label', 'Augment strengths', 'description', 'Amplify what people do well — self-reflection, not algorithmic ranking'),
    jsonb_build_object('key', 'meaningful_work', 'emoji', '✨', 'label', 'Meaningful work', 'description', 'Reduce repetitive burdens; create space for valuable contribution'),
    jsonb_build_object('key', 'growth_companion', 'emoji', '🌱', 'label', 'Growth companion', 'description', 'Learning recs, reflection prompts, encouragement — does not evaluate worth'),
    jsonb_build_object('key', 'career_support', 'emoji', '🧭', 'label', 'Career development support', 'description', 'Skill growth pathways and role exploration scaffolds'),
    jsonb_build_object('key', 'recognition', 'emoji', '🙏', 'label', 'Recognition scaffolds', 'description', 'Celebrate contributions — cross-link Gratitude A.89'),
    jsonb_build_object('key', 'self_love', 'emoji', '🌿', 'label', 'Self Love connection', 'description', 'Rest, boundaries, compassion — fundamental to sustainable growth'),
    jsonb_build_object('key', 'no_surveillance', 'emoji', '🛡️', 'label', 'Support not surveillance', 'description', 'No hidden performance scoring or punitive rankings'),
    jsonb_build_object('key', 'companionship_first', 'emoji', '🤝', 'label', 'Companionship before replacement', 'description', 'Technology elevates humanity — never diminishes it')
  );
$$;

create or replace function public._hpawbp139_human_potential_center()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'capability_development', 'label', 'Capability development'),
    jsonb_build_object('key', 'strength_identification', 'label', 'Strength identification'),
    jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations'),
    jsonb_build_object('key', 'career_growth_support', 'label', 'Career growth support'),
    jsonb_build_object('key', 'companion_coaching', 'label', 'Companion coaching'),
    jsonb_build_object('key', 'reflection_tools', 'label', 'Reflection tools'),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition scaffolds'),
    jsonb_build_object('key', 'growth_dashboards', 'label', 'Growth dashboards')
  );
$$;

create or replace function public._hpawbp139_augmented_work_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'reduce_admin', 'label', 'Reduce administrative work'),
    jsonb_build_object('key', 'decision_prep', 'label', 'Decision preparation'),
    jsonb_build_object('key', 'summarization', 'label', 'Summarization support'),
    jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery'),
    jsonb_build_object('key', 'comms_prep', 'label', 'Communication preparation'),
    jsonb_build_object('key', 'workflow_coordination', 'label', 'Workflow coordination')
  );
$$;

create or replace function public._hpawbp139_strengths_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'self_reflection', 'label', 'Individual strengths self-reflection'),
    jsonb_build_object('key', 'learning_preferences', 'label', 'Learning preferences'),
    jsonb_build_object('key', 'interests', 'label', 'Interests exploration'),
    jsonb_build_object('key', 'emerging_capabilities', 'label', 'Emerging capabilities'),
    jsonb_build_object('key', 'development_opportunities', 'label', 'Development opportunities'),
    jsonb_build_object('key', 'collaboration_styles', 'label', 'Collaboration styles — self-reported, NOT algorithmic ranking')
  );
$$;

create or replace function public._hpawbp139_growth_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Companion offers learning recommendations, reflection prompts, encouragement, and capability guidance — never evaluates human worth',
    'supports', jsonb_build_array(
      jsonb_build_object('key', 'learning_recs', 'label', 'Learning recommendations'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'encouragement', 'label', 'Encouragement without pressure'),
      jsonb_build_object('key', 'knowledge_suggestions', 'label', 'Knowledge suggestions'),
      jsonb_build_object('key', 'capability_guidance', 'label', 'Capability guidance'),
      jsonb_build_object('key', 'recognition_reminders', 'label', 'Recognition reminders')
    ),
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌱', 'prompt', 'What energized you this week? Aipify can help you capture a reflection — you decide what to keep.', 'consideration', 'User-owned reflection'),
      jsonb_build_object('emoji', '📚', 'prompt', 'Based on your interests, shall Aipify suggest a learning path? Development, not evaluation.', 'consideration', 'No ranking'),
      jsonb_build_object('emoji', '🌿', 'prompt', 'You have been growing steadily — would a moment of rest support your next step?', 'consideration', 'Self Love cross-link')
    )
  );
$$;

create or replace function public._hpawbp139_meaningful_work_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'valuable_activities', 'label', 'Identify valuable activities'),
    jsonb_build_object('key', 'reduce_repetitive', 'label', 'Reduce repetitive burdens'),
    jsonb_build_object('key', 'utilize_strengths', 'label', 'Utilize strengths'),
    jsonb_build_object('key', 'creative_contribution', 'label', 'Creative contribution space'),
    jsonb_build_object('key', 'org_reflection_prompts', 'label', 'Org-level reflection prompts — aggregate patterns only')
  );
$$;

create or replace function public._hpawbp139_career_development_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'skill_growth', 'label', 'Skill growth pathways'),
    jsonb_build_object('key', 'learning_pathways', 'label', 'Learning pathways'),
    jsonb_build_object('key', 'role_exploration', 'label', 'Role exploration scaffolds'),
    jsonb_build_object('key', 'leadership_dev', 'label', 'Leadership development support'),
    jsonb_build_object('key', 'knowledge_expansion', 'label', 'Knowledge expansion'),
    jsonb_build_object('key', 'mentorship_scaffolds', 'label', 'Mentorship scaffolds — humans mentor')
  );
$$;

create or replace function public._hpawbp139_recognition_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('key', 'community_participation', 'label', 'Community participation'),
    jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors'),
    jsonb_build_object('key', 'growth_milestones', 'label', 'Growth milestones'),
    jsonb_build_object('key', 'support_activities', 'label', 'Support activities'),
    jsonb_build_object('key', 'innovation', 'label', 'Innovation contributions')
  );
$$;

create or replace function public._hpawbp139_reflection_practice_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'what_learned', 'label', 'What did I learn?'),
    jsonb_build_object('key', 'what_energized', 'label', 'What energized me?'),
    jsonb_build_object('key', 'what_growing', 'label', 'What am I growing into?'),
    jsonb_build_object('key', 'support_needed', 'label', 'What support do I need?'),
    jsonb_build_object('key', 'strengths_used', 'label', 'What strengths did I use?')
  );
$$;

create or replace function public._hpawbp139_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'self_awareness', 'label', 'Self-awareness', 'route', '/app/self-love-engine'),
    jsonb_build_object('key', 'compassion', 'label', 'Compassion'),
    jsonb_build_object('key', 'rest', 'label', 'Rest and recovery'),
    jsonb_build_object('key', 'celebrate_progress', 'label', 'Celebrate progress'),
    jsonb_build_object('key', 'boundaries', 'label', 'Healthy boundaries'),
    jsonb_build_object('key', 'continuous_learning', 'label', 'Continuous learning without pressure')
  );
$$;

create or replace function public._hpawbp139_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'rbac', 'label', 'RBAC visibility gates'),
    jsonb_build_object('key', 'learning_transparency', 'label', 'Learning data transparency'),
    jsonb_build_object('key', 'companion_activity_metadata', 'label', 'Companion activity histories — metadata only'),
    jsonb_build_object('key', 'two_factor', 'label', '2FA cross-link', 'route', '/app/settings/two-factor'),
    jsonb_build_object('key', 'user_owned_reflections', 'label', 'User-owned reflection data — admins cannot access personal content')
  );
$$;

create or replace function public._hpawbp139_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'human_success', 'label', 'Human Success Phase 82', 'route', '/app/human-success', 'note', 'Platform adoption — cross-link only, no surveillance duplication'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine', 'note', 'Module adoption paths'),
    jsonb_build_object('key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'note', 'Continuous learning hub'),
    jsonb_build_object('key', 'growth_evolution', 'label', 'Growth & Evolution A.81', 'route', '/app/growth-evolution-engine', 'note', 'Organizational evolution cross-link'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'note', 'Inclusive growth cross-link'),
    jsonb_build_object('key', 'gratitude', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'note', 'Recognition cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Compassion and boundaries'),
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values Phase 138', 'route', '/app/purpose-values-engine', 'note', 'Purpose alignment cross-link'),
    jsonb_build_object('key', 'proactive_organization', 'label', 'Proactive Organization Phase 135', 'route', '/app/proactive-organization-engine', 'note', 'Org anticipatory support — aggregate only'),
    jsonb_build_object('key', 'collective_decision', 'label', 'Collective Decision Phase 137', 'route', '/app/collective-decision-council-engine', 'note', 'Human-companion council cross-link')
  );
$$;

create or replace function public._hpawbp139_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses human potential augmentation patterns internally — self-reflection scaffolds, learning path suggestions, and recognition reminders. No employee ranking or surveillance.';
$$;

create or replace function public._hpawbp139_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._hpaw_refresh_metrics(p_tenant_id);
  return jsonb_build_array(
    jsonb_build_object('key', 'human_potential_center', 'label', 'Human Potential Center — eight capabilities', 'met', jsonb_array_length(public._hpawbp139_human_potential_center()) = 8, 'note', null),
    jsonb_build_object('key', 'augmented_work', 'label', 'Augmented work framework — six dimensions', 'met', jsonb_array_length(public._hpawbp139_augmented_work_framework()) = 6, 'note', null),
    jsonb_build_object('key', 'learning_recs', 'label', 'Learning recommendations seeded', 'met', (v_metrics->>'learning_recommendations_pending')::int >= 4, 'note', null),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition moments scaffolded', 'met', (v_metrics->>'recognition_moments_active')::int >= 4, 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations — five never rules', 'met', (v_metrics->>'companion_limitations_count')::int = 5, 'note', null),
    jsonb_build_object('key', 'no_ranking', 'label', 'No human value ranking mode active', 'met', (v_metrics->>'not_human_value_ranking')::boolean = true, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory integration links documented', 'met', jsonb_array_length(public._hpawbp139_integration_links()) >= 10, 'note', null),
    jsonb_build_object('key', 'distinction', 'label', 'Distinction from Human Success documented', 'met', position('human-success' in public._hpawbp139_distinction_note()) > 0, 'note', null)
  );
end; $$;

create or replace function public._hpawbp139_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._hpaw_refresh_metrics(p_tenant_id);
  return v_metrics || jsonb_build_object(
    'objectives_count', jsonb_array_length(public._hpawbp139_objectives()),
    'center_capabilities', jsonb_array_length(public._hpawbp139_human_potential_center()),
    'augmentation_principles_count', jsonb_array_length(public._hpaw_augmentation_principles()),
    'integration_links_count', jsonb_array_length(public._hpawbp139_integration_links()),
    'privacy_note', public._hpawbp139_privacy_note()
  );
end; $$;

create or replace function public._hpawbp139_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Companionship before replacement',
    'Technology elevates humanity',
    'Support not surveillance',
    'Growth without ranking',
    'Meaningful work amplified'
  );
$$;

create or replace function public._hpawbp139_privacy_note()
returns text language sql immutable as $$
  select 'User-owned reflection and growth profile content — admins see engagement counts only, never personal reflection text. No hidden performance scoring, ranking, or punitive surveillance. Augmentation engagement score measures participation scaffolds — NOT human worth.';
$$;

create or replace function public._hpawbp139_blueprint_block(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'phase', '139',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE139_HUMAN_POTENTIAL_AUGMENTED_WORK.md',
    'engine_phase', 'Repo Phase 139 — Human Potential & Augmented Work Engine',
    'route', '/app/human-potential-augmented-work-engine',
    'distinction_note', public._hpawbp139_distinction_note(),
    'mission', public._hpawbp139_mission(),
    'philosophy', public._hpawbp139_philosophy(),
    'abos_principle', public._hpawbp139_abos_principle(),
    'objectives', public._hpawbp139_objectives(),
    'human_potential_center', public._hpawbp139_human_potential_center(),
    'augmented_work_framework', public._hpawbp139_augmented_work_framework(),
    'strengths_intelligence_engine', public._hpawbp139_strengths_intelligence_engine(),
    'growth_companion', public._hpawbp139_growth_companion(),
    'meaningful_work_engine', public._hpawbp139_meaningful_work_engine(),
    'career_development_framework', public._hpawbp139_career_development_framework(),
    'recognition_engine', public._hpawbp139_recognition_engine(),
    'reflection_practice_engine', public._hpawbp139_reflection_practice_engine(),
    'companion_limitations', public._hpaw_companion_limitation_rules(),
    'augmentation_principles', public._hpaw_augmentation_principles(),
    'self_love_connection', public._hpawbp139_self_love_connection(),
    'security_requirements', public._hpawbp139_security_requirements(),
    'integration_links', public._hpawbp139_integration_links(),
    'dogfooding', public._hpawbp139_dogfooding(),
    'success_criteria', public._hpawbp139_success_criteria(p_tenant_id),
    'engagement_summary', public._hpawbp139_engagement_summary(p_tenant_id),
    'vision', public._hpawbp139_vision(),
    'vision_phrases', public._hpawbp139_vision_phrases(),
    'privacy_note', public._hpawbp139_privacy_note()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_human_potential_reflection(
  p_prompt_type text,
  p_reflection_summary text,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._hpaw_require_tenant());
  v_user_id := public._hpaw_current_user_id();
  if v_user_id is null then raise exception 'No user context'; end if;
  if char_length(p_reflection_summary) > 500 then
    raise exception 'Reflection summary max 500 characters';
  end if;
  v_key := p_prompt_type || '-' || left(md5(p_reflection_summary || clock_timestamp()::text), 8);
  insert into public.human_potential_reflection_entries (
    tenant_id, user_id, entry_key, prompt_type, reflection_summary
  ) values (v_tenant_id, v_user_id, v_key, p_prompt_type, left(p_reflection_summary, 500))
  returning id into v_id;
  perform public._hpaw_log_audit(v_tenant_id, 'reflection_recorded', left(p_reflection_summary, 120),
    jsonb_build_object('reflection_id', v_id, 'prompt_type', p_prompt_type, 'user_id', v_user_id));
  return v_id;
end; $$;

create or replace function public.suggest_learning_path(
  p_recommendation_type text,
  p_title text,
  p_summary text,
  p_cross_link_route text default null,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._hpaw_require_tenant());
  v_user_id := public._hpaw_current_user_id();
  v_key := lower(p_recommendation_type || '-' || left(md5(p_title), 8));
  insert into public.human_potential_learning_recommendations (
    tenant_id, user_id, recommendation_key, recommendation_type, title, summary, cross_link_route
  ) values (
    v_tenant_id, v_user_id, v_key, p_recommendation_type, p_title, left(p_summary, 500), p_cross_link_route
  )
  on conflict (tenant_id, recommendation_key) do update set
    summary = excluded.summary, cross_link_route = excluded.cross_link_route, updated_at = now()
  returning id into v_id;
  perform public._hpaw_log_audit(v_tenant_id, 'learning_path_suggested', p_title,
    jsonb_build_object('recommendation_id', v_id, 'type', p_recommendation_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_human_potential_augmented_work_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.human_potential_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._hpaw_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_settings := public._hpaw_ensure_settings(v_tenant_id);
  perform public._hpaw_seed_learning_recommendations(v_tenant_id);
  perform public._hpaw_seed_recognition_moments(v_tenant_id);
  v_metrics := public._hpaw_refresh_metrics(v_tenant_id);
  v_engagement := public._hpawbp139_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'augmentation_engagement_score', v_metrics->>'augmentation_engagement_score',
    'learning_recommendations_pending', v_metrics->>'learning_recommendations_pending',
    'reflection_entries_active', v_metrics->>'reflection_entries_active',
    'recognition_moments_active', v_metrics->>'recognition_moments_active',
    'philosophy', public._hpawbp139_philosophy(),
    'no_ranking_mode', v_settings.no_ranking_mode,
    'user_owned_reflections', v_settings.user_owned_reflections,
    'human_potential_center_enabled', v_settings.human_potential_center_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', '139',
      'title', 'Human Potential & Augmented Work',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE139_HUMAN_POTENTIAL_AUGMENTED_WORK.md',
      'engine_phase', 'Repo Phase 139',
      'route', '/app/human-potential-augmented-work-engine'
    ),
    'human_potential_mission', public._hpawbp139_mission(),
    'human_potential_abos_principle', public._hpawbp139_abos_principle(),
    'human_potential_engagement_summary', v_engagement,
    'human_potential_note', public._hpawbp139_distinction_note(),
    'human_potential_vision_note', public._hpawbp139_vision()
  );
end; $$;

create or replace function public.get_human_potential_augmented_work_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.human_potential_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._hpaw_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_user_id := public._hpaw_current_user_id();
  v_settings := public._hpaw_ensure_settings(v_tenant_id);
  perform public._hpaw_seed_learning_recommendations(v_tenant_id);
  perform public._hpaw_seed_recognition_moments(v_tenant_id);
  v_metrics := public._hpaw_refresh_metrics(v_tenant_id, v_user_id);
  perform public._hpaw_log_audit(v_tenant_id, 'dashboard_view', 'Human Potential dashboard viewed',
    jsonb_build_object('engagement_score', v_metrics->>'augmentation_engagement_score', 'not_ranking', true));

  return jsonb_build_object(
    'has_customer', true,
    'human_potential_center_enabled', v_settings.human_potential_center_enabled,
    'growth_companion_enabled', v_settings.growth_companion_enabled,
    'strengths_reflection_enabled', v_settings.strengths_reflection_enabled,
    'meaningful_work_enabled', v_settings.meaningful_work_enabled,
    'recognition_scaffolds_enabled', v_settings.recognition_scaffolds_enabled,
    'no_ranking_mode', v_settings.no_ranking_mode,
    'user_owned_reflections', v_settings.user_owned_reflections,
    'philosophy', public._hpawbp139_philosophy(),
    'safety_note', 'Support not surveillance — augmentation engagement score is NOT human value ranking. Personal reflections are user-owned.',
    'distinction_note', public._hpawbp139_distinction_note(),
    'augmentation_engagement_score', (v_metrics->>'augmentation_engagement_score')::numeric,
    'learning_recommendations_pending', (v_metrics->>'learning_recommendations_pending')::int,
    'reflection_entries_active', (v_metrics->>'reflection_entries_active')::int,
    'recognition_moments_active', (v_metrics->>'recognition_moments_active')::int,
    'growth_profiles_count', (v_metrics->>'growth_profiles_count')::int,
    'learning_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'recommendation_key', r.recommendation_key, 'recommendation_type', r.recommendation_type,
        'title', r.title, 'summary', r.summary, 'cross_link_route', r.cross_link_route,
        'status', r.status, 'priority', r.priority
      ) order by r.priority desc)
      from public.human_potential_learning_recommendations r
      where r.tenant_id = v_tenant_id and r.status in ('pending', 'accepted')
        and (r.user_id is null or r.user_id = v_user_id)
    ), '[]'::jsonb),
    'reflection_entries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'entry_key', e.entry_key, 'prompt_type', e.prompt_type,
        'reflection_summary', e.reflection_summary, 'status', e.status, 'created_at', e.created_at
      ) order by e.created_at desc)
      from public.human_potential_reflection_entries e
      where e.tenant_id = v_tenant_id and e.user_id = v_user_id and e.status = 'active'
    ), '[]'::jsonb),
    'recognition_moments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'moment_key', m.moment_key, 'moment_type', m.moment_type,
        'title', m.title, 'summary', m.summary, 'visibility', m.visibility, 'status', m.status
      ))
      from public.human_potential_recognition_moments m
      where m.tenant_id = v_tenant_id and m.status = 'active'
    ), '[]'::jsonb),
    'human_potential_center', public._hpawbp139_human_potential_center(),
    'augmented_work_framework', public._hpawbp139_augmented_work_framework(),
    'strengths_intelligence_engine', public._hpawbp139_strengths_intelligence_engine(),
    'growth_companion', public._hpawbp139_growth_companion(),
    'meaningful_work_engine', public._hpawbp139_meaningful_work_engine(),
    'career_development_framework', public._hpawbp139_career_development_framework(),
    'recognition_engine', public._hpawbp139_recognition_engine(),
    'reflection_practice_engine', public._hpawbp139_reflection_practice_engine(),
    'companion_limitations', public._hpaw_companion_limitation_rules(),
    'augmentation_principles', public._hpaw_augmentation_principles(),
    'self_love_connection', public._hpawbp139_self_love_connection(),
    'security_requirements', public._hpawbp139_security_requirements(),
    'integration_links', public._hpawbp139_integration_links(),
    'implementation_blueprint', public._hpawbp139_blueprint_block(v_tenant_id),
    'human_potential_blueprint', public._hpawbp139_blueprint_block(v_tenant_id),
    'human_potential_mission', public._hpawbp139_mission(),
    'human_potential_philosophy', public._hpawbp139_philosophy(),
    'human_potential_abos_principle', public._hpawbp139_abos_principle(),
    'human_potential_objectives', public._hpawbp139_objectives(),
    'human_potential_engagement_summary', public._hpawbp139_engagement_summary(v_tenant_id),
    'human_potential_success_criteria', public._hpawbp139_success_criteria(v_tenant_id),
    'hpawbp139_cross_links', public._hpawbp139_integration_links(),
    'human_potential_vision', public._hpawbp139_vision(),
    'human_potential_vision_phrases', public._hpawbp139_vision_phrases(),
    'human_potential_privacy_note', public._hpawbp139_privacy_note(),
    'human_potential_engine_note', 'Autonomous Organization Era (131–140) — human potential and augmented work. Cross-link Human Success — do not duplicate adoption surveillance.'
  );
end; $$;

grant execute on function public.get_human_potential_augmented_work_engine_dashboard(uuid) to authenticated;
grant execute on function public.get_human_potential_augmented_work_engine_card(uuid) to authenticated;
grant execute on function public.record_human_potential_reflection(text, text, uuid) to authenticated;
grant execute on function public.suggest_learning_path(text, text, text, text, uuid) to authenticated;
grant execute on function public._hpawbp139_distinction_note() to authenticated;
grant execute on function public._hpawbp139_mission() to authenticated;
grant execute on function public._hpawbp139_philosophy() to authenticated;
grant execute on function public._hpawbp139_abos_principle() to authenticated;
grant execute on function public._hpawbp139_vision() to authenticated;
grant execute on function public._hpawbp139_privacy_note() to authenticated;
