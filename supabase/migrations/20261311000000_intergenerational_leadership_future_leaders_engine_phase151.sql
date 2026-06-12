-- Phase 151 — Intergenerational Leadership & Future Leaders Engine
-- Legacy & Future Stewardship Era (151–160) opener.
-- Future Leaders Center — development NOT rankings or surveillance.
-- Helpers: _ifle_* (engine), _iflebp151_* (blueprint — never collide with _omlebp126_*, _ltbp_*, _hptdbp92_*)

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
    'future_leaders_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. future_leaders_settings
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  development_mode text not null default 'guided' check (
    development_mode in ('guided', 'self_directed', 'executive_sponsored')
  ),
  mentorship_enabled boolean not null default true,
  reflection_enabled boolean not null default true,
  succession_awareness_enabled boolean not null default true,
  leadership_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_ranking":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.future_leaders_settings enable row level security;
revoke all on public.future_leaders_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. future_leaders_pathways
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_pathways (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pathway_key text not null,
  pathway_type text not null check (
    pathway_type in (
      'first_time_managers', 'team_leaders', 'department_leaders',
      'executive_candidates', 'gp_leaders', 'knowledge_stewards'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'enrolled' check (
    status in ('enrolled', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  enrolled_at timestamptz not null default now(),
  unique (tenant_id, pathway_key)
);

create index if not exists future_leaders_pathways_tenant_idx
  on public.future_leaders_pathways (tenant_id, pathway_type, status);

alter table public.future_leaders_pathways enable row level security;
revoke all on public.future_leaders_pathways from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. future_leaders_mentorships
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_mentorships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  mentorship_key text not null,
  program_type text not null check (
    program_type in (
      'formal_mentorship', 'peer_mentorship', 'executive_shadowing',
      'knowledge_stewardship', 'gp_leadership', 'cross_generational_exchange'
    )
  ),
  title text not null,
  goals_summary text not null check (char_length(goals_summary) <= 500),
  agreement_summary text check (agreement_summary is null or char_length(agreement_summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_performance_score":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, mentorship_key)
);

create index if not exists future_leaders_mentorships_tenant_idx
  on public.future_leaders_mentorships (tenant_id, program_type, status);

alter table public.future_leaders_mentorships enable row level security;
revoke all on public.future_leaders_mentorships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. future_leaders_leadership_memory
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_leadership_memory (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'lesson_learned', 'leadership_story', 'decision_reflection',
      'transformation_experience', 'governance_insight', 'cultural_narrative'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published_summary', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_at timestamptz not null default now(),
  unique (tenant_id, memory_key)
);

create index if not exists future_leaders_leadership_memory_tenant_idx
  on public.future_leaders_leadership_memory (tenant_id, memory_type, status);

alter table public.future_leaders_leadership_memory enable row level security;
revoke all on public.future_leaders_leadership_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. future_leaders_succession_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_succession_reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  review_key text not null,
  review_type text not null check (
    review_type in (
      'transition_readiness', 'knowledge_preservation', 'development_plan',
      'continuity_assessment', 'bench_strength_aggregate', 'role_visibility'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_individual_scoring":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, review_key)
);

create index if not exists future_leaders_succession_reviews_tenant_idx
  on public.future_leaders_succession_reviews (tenant_id, review_type, status);

alter table public.future_leaders_succession_reviews enable row level security;
revoke all on public.future_leaders_succession_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. future_leaders_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.future_leaders_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.future_leaders_audit_logs enable row level security;
revoke all on public.future_leaders_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'future_leaders_engine', v.description
from (values
  ('future_leaders.view', 'View Future Leaders Center', 'View leadership pathways, mentorship programs, and development scaffolds'),
  ('future_leaders.manage', 'Manage Future Leaders Center', 'Update development settings, mentorship programs, and succession review scaffolds'),
  ('future_leaders.contribute', 'Contribute to Future Leaders Center', 'Record leadership memory entries and participate in mentorship metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'future_leaders.view'), ('owner', 'future_leaders.manage'), ('owner', 'future_leaders.contribute'),
  ('administrator', 'future_leaders.view'), ('administrator', 'future_leaders.manage'), ('administrator', 'future_leaders.contribute'),
  ('manager', 'future_leaders.view'), ('manager', 'future_leaders.contribute'),
  ('employee', 'future_leaders.view'),
  ('support_agent', 'future_leaders.view'),
  ('moderator', 'future_leaders.view'),
  ('viewer', 'future_leaders.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Engine helpers (_ifle_*)
-- ---------------------------------------------------------------------------
create or replace function public._ifle_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ifle_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ifle_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ifle_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.future_leaders_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ifle_ensure_settings(p_tenant_id uuid)
returns public.future_leaders_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.future_leaders_settings;
begin
  insert into public.future_leaders_settings (tenant_id, enabled, development_mode)
  values (p_tenant_id, false, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.future_leaders_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ifle_seed_pathways(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.future_leaders_pathways where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.future_leaders_pathways (tenant_id, pathway_key, pathway_type, title, summary, status) values
    (p_tenant_id, 'first-time-managers', 'first_time_managers', 'First-Time Managers', 'Guided pathway for new people leaders — reflection, feedback, and mentorship scaffolds.', 'enrolled'),
    (p_tenant_id, 'team-leaders', 'team_leaders', 'Team Leaders', 'Team leadership development — coaching conversations and growth planning metadata.', 'enrolled'),
    (p_tenant_id, 'department-leaders', 'department_leaders', 'Department Leaders', 'Department leadership readiness — cross-functional collaboration and stewardship.', 'enrolled'),
    (p_tenant_id, 'executive-candidates', 'executive_candidates', 'Executive Candidates', 'Executive readiness scaffolds — shadowing, governance exposure, succession awareness.', 'enrolled'),
    (p_tenant_id, 'gp-leaders', 'gp_leaders', 'Growth Partner Leaders', 'Growth Partner leadership pathway — mentorship, community stewardship, professional development.', 'enrolled'),
    (p_tenant_id, 'knowledge-stewards', 'knowledge_stewards', 'Knowledge Stewards', 'Knowledge stewardship pathway — institutional memory, heritage, and intergenerational transfer.', 'enrolled');
end; $$;

create or replace function public._ifle_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.future_leaders_settings;
  v_pathway_count int;
  v_active_pathways int;
  v_mentorship_count int;
  v_active_mentorships int;
  v_memory_count int;
  v_succession_count int;
  v_development_score numeric;
begin
  select * into v_settings from public.future_leaders_settings where tenant_id = p_tenant_id;
  select count(*) into v_pathway_count from public.future_leaders_pathways where tenant_id = p_tenant_id;
  select count(*) into v_active_pathways from public.future_leaders_pathways where tenant_id = p_tenant_id and status in ('enrolled', 'active');
  select count(*) into v_mentorship_count from public.future_leaders_mentorships where tenant_id = p_tenant_id;
  select count(*) into v_active_mentorships from public.future_leaders_mentorships where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_memory_count from public.future_leaders_leadership_memory where tenant_id = p_tenant_id;
  select count(*) into v_succession_count from public.future_leaders_succession_reviews where tenant_id = p_tenant_id;

  v_development_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.mentorship_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.reflection_enabled, false) then 10 else 0 end
    + least(v_active_pathways, 6) * 5
    + least(v_active_mentorships, 6) * 4
    + least(v_memory_count, 10) * 2
    + least(v_succession_count, 4) * 3,
    1
  );

  return jsonb_build_object(
    'development_score', v_development_score,
    'enabled', coalesce(v_settings.enabled, false),
    'development_mode', coalesce(v_settings.development_mode, 'guided'),
    'pathways_count', v_pathway_count,
    'active_pathways_count', v_active_pathways,
    'mentorships_count', v_mentorship_count,
    'active_mentorships_count', v_active_mentorships,
    'leadership_memory_count', v_memory_count,
    'succession_reviews_count', v_succession_count,
    'cross_links_count', jsonb_array_length(public._iflebp151_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_iflebp151_*)
-- ---------------------------------------------------------------------------
create or replace function public._iflebp151_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 151 — Intergenerational Leadership & Future Leaders Engine at /app/future-leaders-engine. Legacy & Future Stewardship Era (151–160) opener — leadership development, NOT rankings or surveillance. Distinct from Organizational Memory Legacy Phase 126 at /app/organizational-memory-engine (_omlebp126_* — succession intelligence cross-link only). Distinct from Learning & Training A.36 + Phase 92 at /app/learning-training-engine (_hptdbp92_* — talent paths cross-link). Distinct from rigid succession planning alone — development + reflection + mentorship. Helpers _iflebp151_* — never collide with _omlebp126_*, _ltbp_*, _hptdbp92_*. Growth Partner not Affiliate.';
$$;

create or replace function public._iflebp151_mission()
returns text language sql immutable as $$
  select 'Support intergenerational leadership development — mentorship, reflection, intentional growth, and knowledge transfer — without ranking individuals, replacing human mentorship, or overriding organizational decisions.';
$$;

create or replace function public._iflebp151_philosophy()
returns text language sql immutable as $$
  select 'Build people not just products. Wisdom before speed. People First. Growth through support — not surveillance. Growth Partner terminology — never Affiliate. Leadership Companion supports development; it does NOT determine leadership worth.';
$$;

create or replace function public._iflebp151_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Future Leaders Center aggregates leadership development visibility. Organizational Memory 126, Legacy A.86, Learning & Training A.36, and Continuity Phase 73 remain authoritative for their domains. Aipify informs and prepares; humans mentor and decide.';
$$;

create or replace function public._iflebp151_vision()
returns text language sql immutable as $$
  select 'Organizations cultivate future leaders through mentorship, reflection, and intergenerational wisdom — building stewardship cultures where experience is shared generously and diverse leadership styles are honored.';
$$;

create or replace function public._iflebp151_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'leadership_pathways', 'label', 'Leadership pathways', 'emoji', '🛤️', 'description', 'Scaffolded development for emerging leaders'),
    jsonb_build_object('key', 'mentorship_programs', 'label', 'Mentorship programs', 'emoji', '🤝', 'description', 'Goals and agreements — not performance scores'),
    jsonb_build_object('key', 'intergenerational_learning', 'label', 'Intergenerational learning', 'emoji', '📚', 'description', 'Knowledge interviews and leadership conversations'),
    jsonb_build_object('key', 'leadership_memory', 'label', 'Leadership memory', 'emoji', '💡', 'description', 'Lessons learned and decision reflections — metadata only'),
    jsonb_build_object('key', 'succession_preparedness', 'label', 'Succession preparedness', 'emoji', '🔄', 'description', 'Transition readiness scaffolds — NOT individual scoring'),
    jsonb_build_object('key', 'leadership_companion', 'label', 'Leadership Companion', 'emoji', '✨', 'description', 'Reflection prompts and development resources — does NOT define potential'),
    jsonb_build_object('key', 'knowledge_transfer', 'label', 'Knowledge transfer', 'emoji', '🏛️', 'description', 'Institutional storytelling and heritage cross-links'),
    jsonb_build_object('key', 'growth_partner_leaders', 'label', 'Growth Partner leaders', 'emoji', '🌱', 'description', 'GP leadership pathway — never Affiliate terminology')
  );
$$;

create or replace function public._iflebp151_future_leaders_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future Leaders Center — eight development capabilities. Support growth — never rank worth.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'leadership_pathways', 'label', 'Leadership pathways'),
      jsonb_build_object('key', 'mentorship_programs', 'label', 'Mentorship programs'),
      jsonb_build_object('key', 'executive_shadowing', 'label', 'Executive shadowing scaffolds'),
      jsonb_build_object('key', 'growth_planning', 'label', 'Growth planning'),
      jsonb_build_object('key', 'leadership_learning_tracks', 'label', 'Leadership learning tracks', 'cross_link', '/app/learning-training-engine'),
      jsonb_build_object('key', 'reflection_frameworks', 'label', 'Reflection frameworks', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'development_dashboards', 'label', 'Development dashboards'),
      jsonb_build_object('key', 'knowledge_transfer_programs', 'label', 'Knowledge transfer programs', 'cross_link', '/app/organizational-memory-engine')
    )
  );
$$;

create or replace function public._iflebp151_intergenerational_learning_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Intergenerational learning — mentorship matching, knowledge interviews, and experience documentation.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'mentorship_matching', 'label', 'Mentorship matching'),
      jsonb_build_object('key', 'knowledge_interviews', 'label', 'Knowledge interviews'),
      jsonb_build_object('key', 'leadership_conversations', 'label', 'Leadership conversations'),
      jsonb_build_object('key', 'experience_documentation', 'label', 'Experience documentation'),
      jsonb_build_object('key', 'learning_exchanges', 'label', 'Learning exchanges'),
      jsonb_build_object('key', 'institutional_storytelling', 'label', 'Institutional storytelling', 'cross_link', '/app/legacy-engine')
    )
  );
$$;

create or replace function public._iflebp151_succession_preparedness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Succession preparedness — critical role visibility metadata and bench strength aggregates. NOT individual scoring.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'critical_role_visibility', 'label', 'Critical role visibility metadata'),
      jsonb_build_object('key', 'bench_strength_aggregates', 'label', 'Leadership bench strength aggregates — NOT individual scores'),
      jsonb_build_object('key', 'knowledge_preservation', 'label', 'Knowledge preservation', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'development_plans', 'label', 'Development plans'),
      jsonb_build_object('key', 'transition_readiness_reviews', 'label', 'Transition readiness reviews'),
      jsonb_build_object('key', 'continuity_assessments', 'label', 'Continuity assessments', 'cross_link', '/app/continuity')
    )
  );
$$;

create or replace function public._iflebp151_leadership_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership Companion — reflection prompts and development resources. Does NOT define leadership potential.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'learning_recommendations', 'label', 'Learning recommendations', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'mentorship_preparation', 'label', 'Mentorship preparation'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery', 'cross_link', '/app/organizational-memory-engine'),
      jsonb_build_object('key', 'development_resources', 'label', 'Development resources'),
      jsonb_build_object('key', 'growth_milestone_tracking', 'label', 'Growth milestone tracking — organizational scaffolds only')
    )
  );
$$;

create or replace function public._iflebp151_mentorship_network_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Mentorship network — discovery, goals, agreements, and recognition. NOT performance evaluation.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'mentor_discovery', 'label', 'Mentor discovery', 'cross_link', '/app/global-talent-expert-network-engine'),
      jsonb_build_object('key', 'goal_setting', 'label', 'Goal setting'),
      jsonb_build_object('key', 'learning_agreements', 'label', 'Learning agreements'),
      jsonb_build_object('key', 'progress_check_ins', 'label', 'Progress check-ins — metadata only'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'recognition_practices', 'label', 'Recognition practices', 'cross_link', '/app/gratitude-recognition-engine')
    )
  );
$$;

create or replace function public._iflebp151_leadership_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership memory — lessons learned, stories, and reflections. Metadata summaries max ~500 chars.',
    'memory_types', jsonb_build_array(
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
      jsonb_build_object('key', 'leadership_stories', 'label', 'Leadership stories'),
      jsonb_build_object('key', 'decision_reflections', 'label', 'Decision reflections'),
      jsonb_build_object('key', 'transformation_experiences', 'label', 'Transformation experiences'),
      jsonb_build_object('key', 'governance_insights', 'label', 'Governance insights'),
      jsonb_build_object('key', 'cultural_narratives', 'label', 'Cultural narratives', 'cross_link', '/app/legacy-engine')
    ),
    'org_memory_cross_link', '/app/organizational-memory-engine'
  );
$$;

create or replace function public._iflebp151_emerging_leader_pathways()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Emerging leader pathways — six scaffold types for intentional development.',
    'pathways', jsonb_build_array(
      jsonb_build_object('key', 'first_time_managers', 'label', 'First-time managers'),
      jsonb_build_object('key', 'team_leaders', 'label', 'Team leaders'),
      jsonb_build_object('key', 'department_leaders', 'label', 'Department leaders'),
      jsonb_build_object('key', 'executive_candidates', 'label', 'Executive candidates', 'cross_link', '/app/executive-intelligence'),
      jsonb_build_object('key', 'gp_leaders', 'label', 'Growth Partner leaders'),
      jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge stewards', 'cross_link', '/app/organizational-memory-engine')
    )
  );
$$;

create or replace function public._iflebp151_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Determine leadership worth',
      'Replace human mentorship',
      'Create leadership rankings',
      'Suppress diverse leadership styles',
      'Override organizational decisions',
      'Individual performance surveillance'
    ),
    'principle', 'Leadership Companion supports development — humans mentor, reflect, and decide.'
  );
$$;

create or replace function public._iflebp151_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — self-awareness, reflection, compassion, resilience, humility, continuous learning.',
    'values', jsonb_build_array(
      'self_awareness', 'reflection', 'compassion', 'resilience', 'humility', 'continuous_learning'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._iflebp151_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'development_audit_logs', 'label', 'Development audit logs'),
      jsonb_build_object('key', 'mentorship_participation_controls', 'label', 'Mentorship participation controls'),
      jsonb_build_object('key', 'knowledge_sharing_permissions', 'label', 'Knowledge sharing permissions'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._iflebp151_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 150, 'key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Era 141–150 capstone — cross-link only'),
    jsonb_build_object('phase', 126, 'key', 'organizational_memory_legacy', 'label', 'Organizational Memory Legacy Phase 126', 'route', '/app/organizational-memory-engine', 'relationship', 'Succession intelligence and heritage — _omlebp126_* cross-link'),
    jsonb_build_object('key', 'legacy_engine', 'label', 'Legacy Engine A.86 + Phase 83', 'route', '/app/legacy-engine', 'relationship', 'Institutional wisdom and intergenerational perspective'),
    jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36 + Phase 92', 'route', '/app/learning-training-engine', 'relationship', 'Talent development paths — _hptdbp92_* cross-link'),
    jsonb_build_object('phase', 121, 'key', 'executive_intelligence', 'label', 'Executive Intelligence Phase 121', 'route', '/app/executive-intelligence', 'relationship', 'Executive leadership context'),
    jsonb_build_object('phase', 115, 'key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Leadership learning tracks'),
    jsonb_build_object('phase', 73, 'key', 'continuity', 'label', 'Organizational Continuity Phase 73', 'route', '/app/continuity', 'relationship', 'Succession awareness — cross-link only'),
    jsonb_build_object('phase', 139, 'key', 'human_potential', 'label', 'Human Potential Phase 139', 'route', '/app/human-potential-augmented-work-engine', 'relationship', 'Human potential and augmented work'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Self-awareness and reflection'),
    jsonb_build_object('phase', 147, 'key', 'global_talent_network', 'label', 'Global Talent Network Phase 147', 'route', '/app/global-talent-expert-network-engine', 'relationship', 'Mentorship discovery cross-link')
  );
$$;

create or replace function public._iflebp151_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Future Leaders Center internally with metadata-only leadership memory summaries, mentorship program scaffolds, and intergenerational learning pathways. Growth Partner terminology throughout. No employee ranking or surveillance.';
$$;

create or replace function public._iflebp151_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Wisdom before speed.',
    'Build people not just products.',
    'Growth through support — not surveillance.',
    'Mentorship and reflection over rankings.',
    'People First — diverse leadership styles honored.'
  );
$$;

create or replace function public._iflebp151_privacy_note()
returns text language sql immutable as $$
  select 'Future Leaders metadata only — leadership memory summaries max ~500 chars, mentorship goals and agreements, succession review scaffolds. No employee ranking, surveillance, or individual leadership scoring.';
$$;

create or replace function public._iflebp151_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ifle_ensure_settings(p_org_id);
  perform public._ifle_seed_pathways(p_org_id);
  v_metrics := public._ifle_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'development_score', coalesce((v_metrics->>'development_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'development_mode', coalesce(v_metrics->>'development_mode', 'guided'),
    'pathways_count', coalesce((v_metrics->>'pathways_count')::int, 0),
    'active_pathways_count', coalesce((v_metrics->>'active_pathways_count')::int, 0),
    'mentorships_count', coalesce((v_metrics->>'mentorships_count')::int, 0),
    'active_mentorships_count', coalesce((v_metrics->>'active_mentorships_count')::int, 0),
    'leadership_memory_count', coalesce((v_metrics->>'leadership_memory_count')::int, 0),
    'succession_reviews_count', coalesce((v_metrics->>'succession_reviews_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._iflebp151_integration_links()),
    'privacy_note', public._iflebp151_privacy_note(),
    'not_ranking', true
  );
end; $$;

create or replace function public._iflebp151_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ifle_ensure_settings(p_org_id);
  perform public._ifle_seed_pathways(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'future_leaders_center', 'label', 'Future Leaders Center — eight capabilities', 'met', jsonb_array_length(public._iflebp151_future_leaders_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'intergenerational_learning', 'label', 'Intergenerational learning — six domains', 'met', jsonb_array_length(public._iflebp151_intergenerational_learning_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'succession_preparedness', 'label', 'Succession preparedness — six domains', 'met', jsonb_array_length(public._iflebp151_succession_preparedness_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'leadership_companion', 'label', 'Leadership Companion — six capabilities', 'met', jsonb_array_length(public._iflebp151_leadership_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'mentorship_network', 'label', 'Mentorship network — six capabilities', 'met', jsonb_array_length(public._iflebp151_mentorship_network_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'leadership_memory', 'label', 'Leadership memory — six memory types', 'met', jsonb_array_length(public._iflebp151_leadership_memory_engine()->'memory_types') = 6, 'note', null),
    jsonb_build_object('key', 'emerging_pathways', 'label', 'Emerging leader pathways — six types seeded', 'met', (select count(*) >= 6 from public.future_leaders_pathways p where p.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._iflebp151_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._iflebp151_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — ten cross-links', 'met', jsonb_array_length(public._iflebp151_integration_links()) = 10, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 151 baseline tables and RPCs', 'met', to_regclass('public.future_leaders_settings') is not null, 'note', '_ifle_* helpers intact')
  );
end; $$;

create or replace function public._iflebp151_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 151 — Intergenerational Leadership & Future Leaders Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE151_INTERGENERATIONAL_LEADERSHIP_FUTURE_LEADERS.md',
    'engine_phase', 'Repo Phase 151 Future Leaders Engine',
    'route', '/app/future-leaders-engine',
    'mapping_note', 'Legacy & Future Stewardship Era (151–160) opener — development not rankings.',
    'distinction_note', public._iflebp151_distinction_note(),
    'mission', public._iflebp151_mission(),
    'philosophy', public._iflebp151_philosophy(),
    'abos_principle', public._iflebp151_abos_principle(),
    'vision', public._iflebp151_vision(),
    'objectives', public._iflebp151_objectives(),
    'future_leaders_center', public._iflebp151_future_leaders_center(),
    'intergenerational_learning_engine', public._iflebp151_intergenerational_learning_engine(),
    'succession_preparedness_engine', public._iflebp151_succession_preparedness_engine(),
    'leadership_companion', public._iflebp151_leadership_companion(),
    'mentorship_network_engine', public._iflebp151_mentorship_network_engine(),
    'leadership_memory_engine', public._iflebp151_leadership_memory_engine(),
    'emerging_leader_pathways', public._iflebp151_emerging_leader_pathways(),
    'companion_limitations', public._iflebp151_companion_limitations(),
    'self_love_connection', public._iflebp151_self_love_connection(),
    'security_requirements', public._iflebp151_security_requirements(),
    'integration_links', public._iflebp151_integration_links(),
    'dogfooding', public._iflebp151_dogfooding(),
    'success_criteria', public._iflebp151_success_criteria(p_org_id),
    'engagement_summary', public._iflebp151_engagement_summary(p_org_id),
    'vision_phrases', public._iflebp151_vision_phrases(),
    'privacy_note', public._iflebp151_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.register_mentorship_program(
  p_program_type text,
  p_title text,
  p_goals_summary text,
  p_agreement_summary text default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.future_leaders_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ifle_require_tenant());
  v_settings := public._ifle_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Future Leaders Center must be enabled'; end if;
  if char_length(p_goals_summary) > 500 then raise exception 'Goals summary max 500 characters'; end if;
  v_key := p_program_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.future_leaders_mentorships (
    tenant_id, mentorship_key, program_type, title, goals_summary, agreement_summary, status
  ) values (
    v_tenant_id, v_key, p_program_type, p_title, left(p_goals_summary, 500),
    case when p_agreement_summary is not null then left(p_agreement_summary, 500) else null end,
    'planned'
  )
  returning id into v_id;
  perform public._ifle_log_audit(v_tenant_id, 'mentorship_registered', left(p_title, 120),
    jsonb_build_object('mentorship_id', v_id, 'program_type', p_program_type));
  return v_id;
end; $$;

create or replace function public.record_leadership_memory_entry(
  p_memory_type text,
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
  v_tenant_id := coalesce(p_org_id, public._ifle_require_tenant());
  perform public._ifle_ensure_settings(v_tenant_id);
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_memory_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.future_leaders_leadership_memory (
    tenant_id, memory_key, memory_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_memory_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ifle_log_audit(v_tenant_id, 'leadership_memory_recorded', left(p_title, 120),
    jsonb_build_object('memory_id', v_id, 'memory_type', p_memory_type));
  return v_id;
end; $$;

create or replace function public.record_succession_readiness_review(
  p_review_type text,
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
  v_tenant_id := coalesce(p_org_id, public._ifle_require_tenant());
  perform public._ifle_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_review_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.future_leaders_succession_reviews (
    tenant_id, review_key, review_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_review_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ifle_log_audit(v_tenant_id, 'succession_review_recorded', left(p_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_future_leaders_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.future_leaders_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ifle_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ifle_ensure_settings(v_tenant_id);
  perform public._ifle_seed_pathways(v_tenant_id);
  v_metrics := public._ifle_refresh_metrics(v_tenant_id);
  v_engagement := public._iflebp151_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'development_score', v_metrics->'development_score',
    'enabled', v_settings.enabled,
    'development_mode', v_settings.development_mode,
    'pathways_count', v_metrics->'pathways_count',
    'philosophy', public._iflebp151_philosophy(),
    'mentorship_enabled', v_settings.mentorship_enabled,
    'reflection_enabled', v_settings.reflection_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 151 — Intergenerational Leadership & Future Leaders Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE151_INTERGENERATIONAL_LEADERSHIP_FUTURE_LEADERS.md',
      'engine_phase', 'Repo Phase 151 Future Leaders Engine',
      'route', '/app/future-leaders-engine',
      'mapping_note', 'Legacy & Future Stewardship Era (151–160) opener.'
    ),
    'future_leaders_mission', public._iflebp151_mission(),
    'future_leaders_abos_principle', public._iflebp151_abos_principle(),
    'future_leaders_engagement_summary', v_engagement,
    'future_leaders_note', public._iflebp151_distinction_note(),
    'future_leaders_vision_note', public._iflebp151_vision()
  );
end; $$;

create or replace function public.get_future_leaders_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.future_leaders_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ifle_require_tenant());
  v_settings := public._ifle_ensure_settings(v_tenant_id);
  perform public._ifle_seed_pathways(v_tenant_id);
  v_metrics := public._ifle_refresh_metrics(v_tenant_id);
  perform public._ifle_log_audit(v_tenant_id, 'dashboard_view', 'Future Leaders dashboard viewed',
    jsonb_build_object('development_score', v_metrics->>'development_score', 'development_mode', v_settings.development_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'development_mode', v_settings.development_mode,
    'mentorship_enabled', v_settings.mentorship_enabled,
    'reflection_enabled', v_settings.reflection_enabled,
    'succession_awareness_enabled', v_settings.succession_awareness_enabled,
    'philosophy', public._iflebp151_philosophy(),
    'safety_note', 'Future Leaders Center — metadata scaffolds only. No employee ranking or surveillance.',
    'distinction_note', public._iflebp151_distinction_note(),
    'development_score', v_metrics->'development_score',
    'pathways_count', v_metrics->'pathways_count',
    'active_pathways_count', v_metrics->'active_pathways_count',
    'mentorships_count', v_metrics->'mentorships_count',
    'active_mentorships_count', v_metrics->'active_mentorships_count',
    'leadership_memory_count', v_metrics->'leadership_memory_count',
    'succession_reviews_count', v_metrics->'succession_reviews_count',
    'pathways', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pathway_key', p.pathway_key, 'pathway_type', p.pathway_type,
        'title', p.title, 'summary', p.summary, 'status', p.status, 'enrolled_at', p.enrolled_at
      ) order by p.enrolled_at)
      from public.future_leaders_pathways p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'mentorships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'mentorship_key', m.mentorship_key, 'program_type', m.program_type,
        'title', m.title, 'goals_summary', m.goals_summary, 'agreement_summary', m.agreement_summary,
        'status', m.status, 'created_at', m.created_at
      ) order by m.created_at desc)
      from public.future_leaders_mentorships m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'leadership_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', lm.id, 'memory_key', lm.memory_key, 'memory_type', lm.memory_type,
        'title', lm.title, 'summary', lm.summary, 'status', lm.status, 'recorded_at', lm.recorded_at
      ) order by lm.recorded_at desc)
      from public.future_leaders_leadership_memory lm where lm.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'succession_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sr.id, 'review_key', sr.review_key, 'review_type', sr.review_type,
        'title', sr.title, 'reflection_summary', sr.reflection_summary, 'status', sr.status,
        'created_at', sr.created_at
      ) order by sr.created_at desc)
      from public.future_leaders_succession_reviews sr where sr.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._iflebp151_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 151 — Intergenerational Leadership & Future Leaders Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE151_INTERGENERATIONAL_LEADERSHIP_FUTURE_LEADERS.md',
      'engine_phase', 'Repo Phase 151 Future Leaders Engine',
      'route', '/app/future-leaders-engine',
      'mapping_note', 'Legacy & Future Stewardship Era (151–160) opener — development not rankings.'
    ),
    'future_leaders_engine_note', 'Future Leaders Engine (ABOS Phase 151) — era opener. Cross-link Org Memory 126, Legacy A.86, Learning 92 — do NOT duplicate _omlebp126_*.',
    'future_leaders_blueprint', public._iflebp151_blueprint_block(v_tenant_id),
    'future_leaders_distinction_note', public._iflebp151_distinction_note(),
    'future_leaders_mission', public._iflebp151_mission(),
    'future_leaders_philosophy', public._iflebp151_philosophy(),
    'future_leaders_abos_principle', public._iflebp151_abos_principle(),
    'future_leaders_objectives', public._iflebp151_objectives(),
    'future_leaders_center_meta', public._iflebp151_future_leaders_center(),
    'intergenerational_learning_engine_meta', public._iflebp151_intergenerational_learning_engine(),
    'succession_preparedness_engine_meta', public._iflebp151_succession_preparedness_engine(),
    'leadership_companion_meta', public._iflebp151_leadership_companion(),
    'mentorship_network_engine_meta', public._iflebp151_mentorship_network_engine(),
    'leadership_memory_engine_meta', public._iflebp151_leadership_memory_engine(),
    'emerging_leader_pathways_meta', public._iflebp151_emerging_leader_pathways(),
    'companion_limitations_meta', public._iflebp151_companion_limitations(),
    'self_love_connection_meta', public._iflebp151_self_love_connection(),
    'security_requirements_meta', public._iflebp151_security_requirements(),
    'iflebp151_integration_links', public._iflebp151_integration_links(),
    'future_leaders_engagement_summary', public._iflebp151_engagement_summary(v_tenant_id),
    'future_leaders_success_criteria', public._iflebp151_success_criteria(v_tenant_id),
    'future_leaders_vision', public._iflebp151_vision(),
    'future_leaders_vision_phrases', public._iflebp151_vision_phrases(),
    'future_leaders_privacy_note', public._iflebp151_privacy_note(),
    'future_leaders_dogfooding', public._iflebp151_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'future-leaders-engine', 'Future Leaders Engine',
  'Legacy & Future Stewardship Era (151–160) opener — intergenerational leadership development. People First.',
  'authenticated', 161
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'future-leaders-engine' and tenant_id is null
);

grant execute on function public.get_future_leaders_engine_card(uuid) to authenticated;
grant execute on function public.get_future_leaders_engine_dashboard(uuid) to authenticated;
grant execute on function public.register_mentorship_program(text, text, text, text, uuid) to authenticated;
grant execute on function public.record_leadership_memory_entry(text, text, text, uuid) to authenticated;
grant execute on function public.record_succession_readiness_review(text, text, text, uuid) to authenticated;
grant execute on function public._iflebp151_distinction_note() to authenticated;
grant execute on function public._iflebp151_mission() to authenticated;
grant execute on function public._iflebp151_philosophy() to authenticated;
grant execute on function public._iflebp151_abos_principle() to authenticated;
grant execute on function public._iflebp151_vision() to authenticated;
grant execute on function public._iflebp151_objectives() to authenticated;
grant execute on function public._iflebp151_future_leaders_center() to authenticated;
grant execute on function public._iflebp151_intergenerational_learning_engine() to authenticated;
grant execute on function public._iflebp151_succession_preparedness_engine() to authenticated;
grant execute on function public._iflebp151_leadership_companion() to authenticated;
grant execute on function public._iflebp151_mentorship_network_engine() to authenticated;
grant execute on function public._iflebp151_leadership_memory_engine() to authenticated;
grant execute on function public._iflebp151_emerging_leader_pathways() to authenticated;
grant execute on function public._iflebp151_companion_limitations() to authenticated;
grant execute on function public._iflebp151_self_love_connection() to authenticated;
grant execute on function public._iflebp151_security_requirements() to authenticated;
grant execute on function public._iflebp151_integration_links() to authenticated;
grant execute on function public._iflebp151_dogfooding() to authenticated;
grant execute on function public._iflebp151_vision_phrases() to authenticated;
grant execute on function public._iflebp151_privacy_note() to authenticated;
grant execute on function public._iflebp151_engagement_summary(uuid) to authenticated;
grant execute on function public._iflebp151_success_criteria(uuid) to authenticated;
