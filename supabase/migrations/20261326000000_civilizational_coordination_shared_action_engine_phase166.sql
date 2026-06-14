-- Phase 166 — Civilizational Coordination & Shared Action Engine
-- Post-Enterprise & Civilizational Era (161–170) — Shared Action Center at /app/civilizational-coordination-engine.
-- Voluntary coordinated initiatives — NOT centralized command or coercion; preserves organizational autonomy.
-- Distinct from Joint Operations Phase 143 (/app/joint-operations-engine — _cojo_* cross-link only).
-- Helpers: _ccae_* (engine), _ccaebp166_* (blueprint — never collide with _cojo_*, _cojobp143_*, _ccvebp161_*)

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
    'civilizational_coordination_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. civilizational_coordination_settings
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_coordination_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  coordination_mode text not null default 'voluntary' check (
    coordination_mode in ('voluntary', 'governed', 'executive_sponsored')
  ),
  shared_programs_enabled boolean not null default true,
  partnership_opt_in_enabled boolean not null default true,
  milestone_tracking_enabled boolean not null default true,
  executive_coordination_reviews_enabled boolean not null default true,
  cross_org_coordination_opt_in boolean not null default false,
  coordination_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"voluntary":true,"not_centralized_command":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.civilizational_coordination_settings enable row level security;
revoke all on public.civilizational_coordination_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. civilizational_shared_action_programs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_shared_action_programs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_key text not null,
  program_type text not null check (
    program_type in (
      'cross_organization_program', 'shared_action_framework', 'leadership_coordination_session',
      'ecosystem_initiative_dashboard', 'companion_coordination_support', 'preparedness_network',
      'knowledge_exchange_program', 'outcome_reflection_review'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"voluntary":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, program_key)
);

create index if not exists civilizational_shared_action_programs_tenant_idx
  on public.civilizational_shared_action_programs (tenant_id, program_type, status);

alter table public.civilizational_shared_action_programs enable row level security;
revoke all on public.civilizational_shared_action_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. civilizational_coordination_partnerships
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_coordination_partnerships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partnership_key text not null,
  partnership_type text not null check (
    partnership_type in (
      'organization', 'growth_partner', 'educational_institution', 'professional_community',
      'knowledge_network', 'industry_group', 'community_initiative'
    )
  ),
  partner_org_label text not null check (char_length(partner_org_label) <= 200),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'opt_in_pending', 'active', 'paused', 'completed', 'archived')
  ),
  opt_in boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true,"opt_in":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partnership_key)
);

create index if not exists civilizational_coordination_partnerships_tenant_idx
  on public.civilizational_coordination_partnerships (tenant_id, partnership_type, status);

alter table public.civilizational_coordination_partnerships enable row level security;
revoke all on public.civilizational_coordination_partnerships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. civilizational_coordination_milestones
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_coordination_milestones (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  program_id uuid references public.civilizational_shared_action_programs (id) on delete set null,
  milestone_key text not null,
  milestone_type text not null check (
    milestone_type in (
      'objective_alignment', 'role_clarity', 'participation_checkpoint', 'governance_review',
      'communication_scaffold', 'outcome_reflection'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'in_progress', 'review', 'completed', 'archived')
  ),
  target_date date,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, milestone_key)
);

create index if not exists civilizational_coordination_milestones_tenant_idx
  on public.civilizational_coordination_milestones (tenant_id, milestone_type, status);

alter table public.civilizational_coordination_milestones enable row level security;
revoke all on public.civilizational_coordination_milestones from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. civilizational_coordination_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.civilizational_coordination_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.civilizational_coordination_audit_logs enable row level security;
revoke all on public.civilizational_coordination_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'civilizational_coordination_engine', v.description
from (values
  ('civilizational_coordination.view', 'View Shared Action Center', 'View shared action programs, coordination partnerships, and milestone metadata'),
  ('civilizational_coordination.manage', 'Manage Shared Action Center', 'Update coordination settings, program scaffolds, and governance preferences'),
  ('civilizational_coordination.participate', 'Participate in Shared Action Center', 'Opt in to coordination partnerships and shared action program metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'civilizational_coordination.view'), ('owner', 'civilizational_coordination.manage'), ('owner', 'civilizational_coordination.participate'),
  ('administrator', 'civilizational_coordination.view'), ('administrator', 'civilizational_coordination.manage'), ('administrator', 'civilizational_coordination.participate'),
  ('manager', 'civilizational_coordination.view'), ('manager', 'civilizational_coordination.participate'),
  ('employee', 'civilizational_coordination.view'),
  ('support_agent', 'civilizational_coordination.view'),
  ('moderator', 'civilizational_coordination.view'),
  ('viewer', 'civilizational_coordination.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_ccae_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccae_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ccae_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ccae_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ccae_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.civilizational_coordination_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ccae_ensure_settings(p_tenant_id uuid)
returns public.civilizational_coordination_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.civilizational_coordination_settings;
begin
  insert into public.civilizational_coordination_settings (tenant_id, enabled, coordination_mode)
  values (p_tenant_id, false, 'voluntary')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.civilizational_coordination_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ccae_seed_programs(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civilizational_shared_action_programs where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civilizational_shared_action_programs (tenant_id, program_key, program_type, title, summary, status) values
    (p_tenant_id, 'cross-org-programs', 'cross_organization_program', 'Cross-Organization Programs', 'Voluntary shared action program scaffolds — metadata only, opt-in participation.', 'draft'),
    (p_tenant_id, 'shared-action-frameworks', 'shared_action_framework', 'Shared Action Frameworks', 'Governance and role scaffolds for coordinated initiatives — preserves autonomy.', 'draft'),
    (p_tenant_id, 'leadership-coordination', 'leadership_coordination_session', 'Leadership Coordination Sessions', 'Executive coordination review scaffolds — humans lead; Companion prepares.', 'draft'),
    (p_tenant_id, 'ecosystem-initiatives', 'ecosystem_initiative_dashboard', 'Ecosystem Initiative Dashboards', 'Cross-link Ecosystem Orchestration Phase 120 — visibility not command.', 'draft'),
    (p_tenant_id, 'companion-coordination', 'companion_coordination_support', 'Companion Coordination Support', 'Coordination Companion briefings — does NOT direct participants.', 'draft'),
    (p_tenant_id, 'preparedness-networks', 'preparedness_network', 'Preparedness Networks', 'Voluntary preparedness network metadata — time-bound when appropriate.', 'draft'),
    (p_tenant_id, 'knowledge-exchange', 'knowledge_exchange_program', 'Knowledge Exchange Programs', 'Knowledge sharing program scaffolds — cross-link era phases.', 'draft'),
    (p_tenant_id, 'outcome-reflection', 'outcome_reflection_review', 'Outcome Reflection Reviews', 'Outcome reflection review metadata — reflection not surveillance.', 'draft');
end; $$;

create or replace function public._ccae_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.civilizational_coordination_settings;
  v_programs_count int;
  v_active_programs int;
  v_partnerships_count int;
  v_active_partnerships int;
  v_milestones_count int;
  v_coordination_score numeric;
begin
  select * into v_settings from public.civilizational_coordination_settings where tenant_id = p_tenant_id;
  select count(*) into v_programs_count from public.civilizational_shared_action_programs where tenant_id = p_tenant_id;
  select count(*) into v_active_programs from public.civilizational_shared_action_programs where tenant_id = p_tenant_id and status in ('review', 'active');
  select count(*) into v_partnerships_count from public.civilizational_coordination_partnerships where tenant_id = p_tenant_id;
  select count(*) into v_active_partnerships from public.civilizational_coordination_partnerships where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_milestones_count from public.civilizational_coordination_milestones where tenant_id = p_tenant_id;

  v_coordination_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.shared_programs_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.partnership_opt_in_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.milestone_tracking_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.cross_org_coordination_opt_in, false) then 8 else 0 end
    + least(v_active_programs, 8) * 3
    + least(v_active_partnerships, 7) * 4
    + least(v_milestones_count, 6) * 3
    + least(v_programs_count, 8) * 2,
    1
  );

  return jsonb_build_object(
    'coordination_score', v_coordination_score,
    'enabled', coalesce(v_settings.enabled, false),
    'coordination_mode', coalesce(v_settings.coordination_mode, 'voluntary'),
    'programs_count', v_programs_count,
    'active_programs_count', v_active_programs,
    'partnerships_count', v_partnerships_count,
    'active_partnerships_count', v_active_partnerships,
    'milestones_count', v_milestones_count,
    'cross_org_coordination_opt_in', coalesce(v_settings.cross_org_coordination_opt_in, false),
    'cross_links_count', jsonb_array_length(public._ccaebp166_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_ccaebp166_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccaebp166_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 166 — Civilizational Coordination & Shared Action Engine at /app/civilizational-coordination-engine. Post-Enterprise & Civilizational Era (161–170) — voluntary coordinated initiatives, NOT centralized command or coercion. Distinct from Joint Operations Phase 143 at /app/joint-operations-engine (_cojo_*, _cojobp143_* — governed cross-org workspaces, cross-link only). Coordination strengthens autonomy — transparent, optional, governed, respectful participation. Helpers _ccaebp166_* — never collide with _cojo_*, _cojobp143_*, _ccvebp161_*. Growth Partner not Affiliate.';
$$;

create or replace function public._ccaebp166_mission()
returns text language sql immutable as $$
  select 'Enable voluntary cross-organization shared action through transparent coordination scaffolds — shared objectives, roles, governance, and milestone metadata — without centralized command, coercion, or overriding organizational autonomy.';
$$;

create or replace function public._ccaebp166_philosophy()
returns text language sql immutable as $$
  select 'People First. Coordination supports cooperation — it does NOT override autonomy, compel participation, suppress dissent, determine collective priorities, or replace human leadership. Growth Partner terminology — never Affiliate. Participation: transparent, optional, governed, respectful.';
$$;

create or replace function public._ccaebp166_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Shared Action Center aggregates voluntary coordination visibility. Joint Operations 143, Civic Collaboration 161, Cross-Sector 162, Civilizational Memory 163, Learning 164, Foresight 165, Global Governance 144, and Ecosystem Orchestration 120 remain authoritative for their domains. Aipify informs and prepares; leaders decide.';
$$;

create or replace function public._ccaebp166_vision()
returns text language sql immutable as $$
  select 'Organizations coordinate shared action voluntarily — strengthening trust, reliability, and long-term relationship health across sectors while preserving autonomy and human accountability.';
$$;

create or replace function public._ccaebp166_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'shared_action_programs', 'label', 'Shared action programs', 'emoji', '🤝', 'description', 'Voluntary cross-organization program metadata'),
    jsonb_build_object('key', 'coordination_partnerships', 'label', 'Coordination partnerships', 'emoji', '🔗', 'description', 'Opt-in participant organization scaffolds'),
    jsonb_build_object('key', 'shared_objectives', 'label', 'Shared objectives', 'emoji', '🎯', 'description', 'Objective alignment metadata — leaders decide priorities'),
    jsonb_build_object('key', 'governance_scaffolds', 'label', 'Governance scaffolds', 'emoji', '📋', 'description', 'Roles, review cadences, and participation expectations'),
    jsonb_build_object('key', 'milestone_tracking', 'label', 'Milestone tracking', 'emoji', '📍', 'description', 'Milestone metadata — no raw operational content'),
    jsonb_build_object('key', 'executive_coordination', 'label', 'Executive coordination reviews', 'emoji', '👥', 'description', 'Leadership coordination session scaffolds'),
    jsonb_build_object('key', 'coordination_companion', 'label', 'Coordination Companion', 'emoji', '✨', 'description', 'Briefings and alignment insights — does NOT direct participants'),
    jsonb_build_object('key', 'relationship_stewardship', 'label', 'Relationship stewardship', 'emoji', '💚', 'description', 'Trust, transparency, and mutual respect across partners')
  );
$$;

create or replace function public._ccaebp166_shared_action_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared Action Center — eight voluntary coordination capabilities. NOT centralized command.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'cross_organization_programs', 'label', 'Cross-organization programs'),
      jsonb_build_object('key', 'shared_action_frameworks', 'label', 'Shared action frameworks'),
      jsonb_build_object('key', 'leadership_coordination_sessions', 'label', 'Leadership coordination sessions'),
      jsonb_build_object('key', 'ecosystem_initiative_dashboards', 'label', 'Ecosystem initiative dashboards', 'cross_link', '/app/ecosystem-orchestration'),
      jsonb_build_object('key', 'companion_coordination_support', 'label', 'Companion coordination support'),
      jsonb_build_object('key', 'preparedness_networks', 'label', 'Preparedness networks'),
      jsonb_build_object('key', 'knowledge_exchange_programs', 'label', 'Knowledge exchange programs'),
      jsonb_build_object('key', 'outcome_reflection_reviews', 'label', 'Outcome reflection reviews')
    )
  );
$$;

create or replace function public._ccaebp166_coordination_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Coordination engine — voluntary alignment scaffolds across participant types.',
    'participant_types', jsonb_build_array(
      jsonb_build_object('key', 'organizations', 'label', 'Organizations'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners — never Affiliate'),
      jsonb_build_object('key', 'educational_institutions', 'label', 'Educational institutions', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'professional_communities', 'label', 'Professional communities', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'knowledge_networks', 'label', 'Knowledge networks', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'industry_groups', 'label', 'Industry groups'),
      jsonb_build_object('key', 'community_initiatives', 'label', 'Community initiatives', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._ccaebp166_shared_action_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared action framework — metadata scaffolds for voluntary alignment.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'shared_objectives', 'label', 'Shared objectives'),
      jsonb_build_object('key', 'roles_responsibilities', 'label', 'Roles and responsibilities'),
      jsonb_build_object('key', 'participation_expectations', 'label', 'Participation expectations — opt-in'),
      jsonb_build_object('key', 'governance_structures', 'label', 'Governance structures'),
      jsonb_build_object('key', 'review_cadences', 'label', 'Review cadences'),
      jsonb_build_object('key', 'success_indicators', 'label', 'Success indicators — metadata only')
    )
  );
$$;

create or replace function public._ccaebp166_executive_coordination_reviews()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive coordination reviews — leadership visibility without overriding autonomy.',
    'review_themes', jsonb_build_array(
      jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities'),
      jsonb_build_object('key', 'coordination_barriers', 'label', 'Coordination barriers'),
      jsonb_build_object('key', 'relationship_strengthening', 'label', 'Relationship strengthening'),
      jsonb_build_object('key', 'participation_responsibilities', 'label', 'Participation responsibilities'),
      jsonb_build_object('key', 'preserve_autonomy', 'label', 'Preserve autonomy checkpoints')
    )
  );
$$;

create or replace function public._ccaebp166_coordination_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Coordination Companion — shared objective summaries and alignment insights. Does NOT direct participants.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'shared_objective_summaries', 'label', 'Shared objective summaries'),
      jsonb_build_object('key', 'partnership_preparation', 'label', 'Partnership preparation'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'progress_briefings', 'label', 'Progress briefings — informational only'),
      jsonb_build_object('key', 'alignment_insights', 'label', 'Alignment insights — not directives')
    )
  );
$$;

create or replace function public._ccaebp166_voluntary_alignment_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Voluntary alignment engine — transparent, optional, governed, respectful participation.',
    'principles', jsonb_build_array(
      jsonb_build_object('key', 'transparent', 'label', 'Transparent'),
      jsonb_build_object('key', 'optional', 'label', 'Optional'),
      jsonb_build_object('key', 'governed', 'label', 'Governed'),
      jsonb_build_object('key', 'respectful', 'label', 'Respectful'),
      jsonb_build_object('key', 'purpose_driven', 'label', 'Purpose-driven'),
      jsonb_build_object('key', 'time_bound_when_appropriate', 'label', 'Time-bound when appropriate')
    )
  );
$$;

create or replace function public._ccaebp166_collective_execution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective execution engine — milestone and communication scaffolds without operational content storage.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'milestone_tracking_metadata', 'label', 'Milestone tracking metadata'),
      jsonb_build_object('key', 'cross_sector_communication_scaffolds', 'label', 'Cross-sector communication scaffolds'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'leadership_visibility', 'label', 'Leadership visibility'),
      jsonb_build_object('key', 'gp_participation', 'label', 'Growth Partner participation — never Affiliate'),
      jsonb_build_object('key', 'outcome_reflection', 'label', 'Outcome reflection')
    )
  );
$$;

create or replace function public._ccaebp166_relationship_stewardship_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relationship stewardship engine — long-term relationship health across coordination partners.',
    'values', jsonb_build_array(
      jsonb_build_object('key', 'trust', 'label', 'Trust'),
      jsonb_build_object('key', 'reliability', 'label', 'Reliability'),
      jsonb_build_object('key', 'transparency', 'label', 'Transparency'),
      jsonb_build_object('key', 'mutual_respect', 'label', 'Mutual respect'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition'),
      jsonb_build_object('key', 'long_term_relationship_health', 'label', 'Long-term relationship health')
    )
  );
$$;

create or replace function public._ccaebp166_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Override organizational autonomy',
      'Compel participation',
      'Suppress dissent',
      'Determine collective priorities',
      'Replace human leadership'
    ),
    'principle', 'Coordination Companion supports cooperation — leaders and organizations decide.'
  );
$$;

create or replace function public._ccaebp166_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — empathy, patience, generosity, humility, recognition of effort, compassion during complexity.',
    'values', jsonb_build_array(
      'empathy', 'patience', 'generosity', 'humility', 'recognition_of_effort', 'compassion_during_complexity'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._ccaebp166_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'partnership_audit_logs', 'label', 'Partnership audit logs'),
      jsonb_build_object('key', 'participation_controls', 'label', 'Participation controls — opt-in'),
      jsonb_build_object('key', 'executive_approval_histories', 'label', 'Executive approval histories'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._ccaebp166_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 161, 'key', 'civic_collaboration', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'relationship', 'Public value participation — _ccvebp161_* cross-link only'),
    jsonb_build_object('phase', 162, 'key', 'cross_sector_intelligence', 'label', 'Cross-Sector Intelligence Phase 162', 'route', '/app/cross-sector-intelligence-engine', 'relationship', 'Societal resilience — _csiebp162_* cross-link only'),
    jsonb_build_object('phase', 163, 'key', 'civilizational_memory', 'label', 'Civilizational Memory Phase 163', 'route', '/app/civilizational-memory-engine', 'relationship', 'Knowledge preservation — _gcmebp163_* cross-link only'),
    jsonb_build_object('phase', 164, 'key', 'civilizational_learning', 'label', 'Civilizational Learning Phase 164', 'route', '/app/civilizational-learning-engine', 'relationship', 'Collective adaptation — _claebp164_* cross-link only'),
    jsonb_build_object('phase', 165, 'key', 'civilizational_foresight', 'label', 'Civilizational Foresight Phase 165', 'route', '/app/civilizational-foresight-engine', 'relationship', 'Foresight scaffolds — cross-link only'),
    jsonb_build_object('phase', 143, 'key', 'joint_operations', 'label', 'Joint Operations Phase 143', 'route', '/app/joint-operations-engine', 'relationship', 'Governed cross-org workspaces — _cojo_* cross-link only, never duplicate'),
    jsonb_build_object('phase', 144, 'key', 'global_governance_diplomacy', 'label', 'Global Governance Diplomacy Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'relationship', 'Governance diplomacy — cross-link only'),
    jsonb_build_object('phase', 120, 'key', 'ecosystem_orchestration', 'label', 'Ecosystem Orchestration Phase 120', 'route', '/app/ecosystem-orchestration', 'relationship', 'Ecosystem initiative visibility — cross-link only'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Empathy, patience, and compassion during coordination complexity')
  );
$$;

create or replace function public._ccaebp166_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Shared Action Center internally with metadata-only program scaffolds, opt-in partnership records, and milestone tracking summaries. Voluntary coordination — not centralized command. Growth Partner terminology throughout.';
$$;

create or replace function public._ccaebp166_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Coordination strengthens autonomy.',
    'Voluntary — transparent, optional, governed, respectful.',
    'Shared action — not centralized command.',
    'Leaders decide — Companion prepares.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._ccaebp166_privacy_note()
returns text language sql immutable as $$
  select 'Civilizational Coordination metadata only — program summaries max ~500 chars, opt-in partnership labels, milestone scaffolds. No raw operational content, coercion tracking, or dissent suppression.';
$$;

create or replace function public._ccaebp166_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ccae_ensure_settings(p_org_id);
  perform public._ccae_seed_programs(p_org_id);
  v_metrics := public._ccae_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'coordination_score', coalesce((v_metrics->>'coordination_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'coordination_mode', coalesce(v_metrics->>'coordination_mode', 'voluntary'),
    'programs_count', coalesce((v_metrics->>'programs_count')::int, 0),
    'active_programs_count', coalesce((v_metrics->>'active_programs_count')::int, 0),
    'partnerships_count', coalesce((v_metrics->>'partnerships_count')::int, 0),
    'active_partnerships_count', coalesce((v_metrics->>'active_partnerships_count')::int, 0),
    'milestones_count', coalesce((v_metrics->>'milestones_count')::int, 0),
    'cross_org_coordination_opt_in', coalesce((v_metrics->>'cross_org_coordination_opt_in')::boolean, false),
    'cross_links_count', jsonb_array_length(public._ccaebp166_integration_links()),
    'privacy_note', public._ccaebp166_privacy_note(),
    'voluntary_only', true
  );
end; $$;

create or replace function public._ccaebp166_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ccae_ensure_settings(p_org_id);
  perform public._ccae_seed_programs(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'shared_action_center', 'label', 'Shared Action Center — eight capabilities', 'met', jsonb_array_length(public._ccaebp166_shared_action_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'coordination_engine', 'label', 'Coordination engine — seven participant types', 'met', jsonb_array_length(public._ccaebp166_coordination_engine()->'participant_types') = 7, 'note', null),
    jsonb_build_object('key', 'shared_action_framework', 'label', 'Shared action framework — six elements', 'met', jsonb_array_length(public._ccaebp166_shared_action_framework()->'elements') = 6, 'note', null),
    jsonb_build_object('key', 'executive_coordination_reviews', 'label', 'Executive coordination reviews — five themes', 'met', jsonb_array_length(public._ccaebp166_executive_coordination_reviews()->'review_themes') = 5, 'note', null),
    jsonb_build_object('key', 'coordination_companion', 'label', 'Coordination Companion — six capabilities', 'met', jsonb_array_length(public._ccaebp166_coordination_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'voluntary_alignment_engine', 'label', 'Voluntary alignment engine — six principles', 'met', jsonb_array_length(public._ccaebp166_voluntary_alignment_engine()->'principles') = 6, 'note', null),
    jsonb_build_object('key', 'collective_execution_engine', 'label', 'Collective execution engine — six capabilities', 'met', jsonb_array_length(public._ccaebp166_collective_execution_engine()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'relationship_stewardship_engine', 'label', 'Relationship stewardship engine — six values', 'met', jsonb_array_length(public._ccaebp166_relationship_stewardship_engine()->'values') = 6, 'note', null),
    jsonb_build_object('key', 'programs_seeded', 'label', 'Shared action programs — eight types seeded', 'met', (select count(*) >= 8 from public.civilizational_shared_action_programs p where p.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._ccaebp166_companion_limitations()->'must_avoid') = 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._ccaebp166_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — nine cross-links', 'met', jsonb_array_length(public._ccaebp166_integration_links()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 166 baseline tables and RPCs', 'met', to_regclass('public.civilizational_coordination_settings') is not null, 'note', '_ccae_* helpers intact')
  );
end; $$;

create or replace function public._ccaebp166_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 166 — Civilizational Coordination & Shared Action Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE166_CIVILIZATIONAL_COORDINATION_SHARED_ACTION.md',
    'engine_phase', 'Repo Phase 166 Civilizational Coordination Engine',
    'route', '/app/civilizational-coordination-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — voluntary coordination not command.',
    'distinction_note', public._ccaebp166_distinction_note(),
    'mission', public._ccaebp166_mission(),
    'philosophy', public._ccaebp166_philosophy(),
    'abos_principle', public._ccaebp166_abos_principle(),
    'vision', public._ccaebp166_vision(),
    'objectives', public._ccaebp166_objectives(),
    'shared_action_center', public._ccaebp166_shared_action_center(),
    'coordination_engine', public._ccaebp166_coordination_engine(),
    'shared_action_framework', public._ccaebp166_shared_action_framework(),
    'executive_coordination_reviews', public._ccaebp166_executive_coordination_reviews(),
    'coordination_companion', public._ccaebp166_coordination_companion(),
    'voluntary_alignment_engine', public._ccaebp166_voluntary_alignment_engine(),
    'collective_execution_engine', public._ccaebp166_collective_execution_engine(),
    'relationship_stewardship_engine', public._ccaebp166_relationship_stewardship_engine(),
    'companion_limitations', public._ccaebp166_companion_limitations(),
    'self_love_connection', public._ccaebp166_self_love_connection(),
    'security_requirements', public._ccaebp166_security_requirements(),
    'integration_links', public._ccaebp166_integration_links(),
    'dogfooding', public._ccaebp166_dogfooding(),
    'success_criteria', public._ccaebp166_success_criteria(p_org_id),
    'engagement_summary', public._ccaebp166_engagement_summary(p_org_id),
    'vision_phrases', public._ccaebp166_vision_phrases(),
    'privacy_note', public._ccaebp166_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_civilizational_shared_action_program(
  p_program_type text,
  p_title text,
  p_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.civilizational_coordination_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ccae_require_tenant());
  v_settings := public._ccae_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Shared Action Center must be enabled'; end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_program_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civilizational_shared_action_programs (
    tenant_id, program_key, program_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_program_type, p_title, left(p_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ccae_log_audit(v_tenant_id, 'program_created', left(p_title, 120),
    jsonb_build_object('program_id', v_id, 'program_type', p_program_type));
  return v_id;
end; $$;

create or replace function public.join_civilizational_coordination_partnership(
  p_partnership_type text,
  p_partner_org_label text,
  p_title text,
  p_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.civilizational_coordination_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ccae_require_tenant());
  v_settings := public._ccae_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Shared Action Center must be enabled'; end if;
  if not v_settings.partnership_opt_in_enabled then raise exception 'Partnership opt-in must be enabled'; end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  if char_length(p_partner_org_label) > 200 then raise exception 'Partner org label max 200 characters'; end if;
  v_key := p_partnership_type || '-' || left(md5(p_partner_org_label || clock_timestamp()::text), 8);
  insert into public.civilizational_coordination_partnerships (
    tenant_id, partnership_key, partnership_type, partner_org_label, title, summary, status, opt_in
  ) values (
    v_tenant_id, v_key, p_partnership_type, left(p_partner_org_label, 200), p_title,
    left(p_summary, 500), 'opt_in_pending', true
  )
  returning id into v_id;
  perform public._ccae_log_audit(v_tenant_id, 'partnership_opt_in', left(p_title, 120),
    jsonb_build_object('partnership_id', v_id, 'partnership_type', p_partnership_type, 'opt_in', true));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_civilizational_coordination_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_coordination_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ccae_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ccae_ensure_settings(v_tenant_id);
  perform public._ccae_seed_programs(v_tenant_id);
  v_metrics := public._ccae_refresh_metrics(v_tenant_id);
  v_engagement := public._ccaebp166_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'coordination_score', v_metrics->'coordination_score',
    'enabled', v_settings.enabled,
    'coordination_mode', v_settings.coordination_mode,
    'programs_count', v_metrics->'programs_count',
    'philosophy', public._ccaebp166_philosophy(),
    'shared_programs_enabled', v_settings.shared_programs_enabled,
    'partnership_opt_in_enabled', v_settings.partnership_opt_in_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 166 — Civilizational Coordination & Shared Action Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE166_CIVILIZATIONAL_COORDINATION_SHARED_ACTION.md',
      'engine_phase', 'Repo Phase 166 Civilizational Coordination Engine',
      'route', '/app/civilizational-coordination-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — voluntary coordination.'
    ),
    'civilizational_coordination_mission', public._ccaebp166_mission(),
    'civilizational_coordination_abos_principle', public._ccaebp166_abos_principle(),
    'civilizational_coordination_engagement_summary', v_engagement,
    'civilizational_coordination_note', public._ccaebp166_distinction_note(),
    'civilizational_coordination_vision_note', public._ccaebp166_vision()
  );
end; $$;

create or replace function public.get_civilizational_coordination_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civilizational_coordination_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ccae_require_tenant());
  v_settings := public._ccae_ensure_settings(v_tenant_id);
  perform public._ccae_seed_programs(v_tenant_id);
  v_metrics := public._ccae_refresh_metrics(v_tenant_id);
  perform public._ccae_log_audit(v_tenant_id, 'dashboard_view', 'Shared Action Center dashboard viewed',
    jsonb_build_object('coordination_score', v_metrics->>'coordination_score', 'coordination_mode', v_settings.coordination_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'coordination_mode', v_settings.coordination_mode,
    'shared_programs_enabled', v_settings.shared_programs_enabled,
    'partnership_opt_in_enabled', v_settings.partnership_opt_in_enabled,
    'milestone_tracking_enabled', v_settings.milestone_tracking_enabled,
    'executive_coordination_reviews_enabled', v_settings.executive_coordination_reviews_enabled,
    'cross_org_coordination_opt_in', v_settings.cross_org_coordination_opt_in,
    'philosophy', public._ccaebp166_philosophy(),
    'safety_note', 'Shared Action Center — voluntary coordination metadata only. NOT centralized command or coercion.',
    'distinction_note', public._ccaebp166_distinction_note(),
    'coordination_score', v_metrics->'coordination_score',
    'programs_count', v_metrics->'programs_count',
    'active_programs_count', v_metrics->'active_programs_count',
    'partnerships_count', v_metrics->'partnerships_count',
    'active_partnerships_count', v_metrics->'active_partnerships_count',
    'milestones_count', v_metrics->'milestones_count',
    'programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'program_type', p.program_type,
        'title', p.title, 'summary', p.summary, 'status', p.status, 'created_at', p.created_at
      ) order by p.created_at)
      from public.civilizational_shared_action_programs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'partnerships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', pt.id, 'partnership_key', pt.partnership_key, 'partnership_type', pt.partnership_type,
        'partner_org_label', pt.partner_org_label, 'title', pt.title, 'summary', pt.summary,
        'status', pt.status, 'opt_in', pt.opt_in, 'created_at', pt.created_at
      ) order by pt.created_at desc)
      from public.civilizational_coordination_partnerships pt where pt.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'milestone_key', m.milestone_key, 'milestone_type', m.milestone_type,
        'title', m.title, 'summary', m.summary, 'status', m.status, 'target_date', m.target_date,
        'program_id', m.program_id, 'created_at', m.created_at
      ) order by m.created_at desc)
      from public.civilizational_coordination_milestones m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._ccaebp166_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 166 — Civilizational Coordination & Shared Action Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE166_CIVILIZATIONAL_COORDINATION_SHARED_ACTION.md',
      'engine_phase', 'Repo Phase 166 Civilizational Coordination Engine',
      'route', '/app/civilizational-coordination-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — voluntary coordination not command.'
    ),
    'civilizational_coordination_engine_note', 'Civilizational Coordination Engine (ABOS Phase 166) — voluntary shared action. Cross-link Joint Operations 143, era 161–165, Ecosystem 120 — do NOT duplicate RPCs.',
    'civilizational_coordination_blueprint', public._ccaebp166_blueprint_block(v_tenant_id),
    'civilizational_coordination_distinction_note', public._ccaebp166_distinction_note(),
    'civilizational_coordination_mission', public._ccaebp166_mission(),
    'civilizational_coordination_philosophy', public._ccaebp166_philosophy(),
    'civilizational_coordination_abos_principle', public._ccaebp166_abos_principle(),
    'civilizational_coordination_objectives', public._ccaebp166_objectives(),
    'shared_action_center_meta', public._ccaebp166_shared_action_center(),
    'coordination_engine_meta', public._ccaebp166_coordination_engine(),
    'shared_action_framework_meta', public._ccaebp166_shared_action_framework(),
    'executive_coordination_reviews_meta', public._ccaebp166_executive_coordination_reviews(),
    'coordination_companion_meta', public._ccaebp166_coordination_companion(),
    'voluntary_alignment_engine_meta', public._ccaebp166_voluntary_alignment_engine(),
    'collective_execution_engine_meta', public._ccaebp166_collective_execution_engine(),
    'relationship_stewardship_engine_meta', public._ccaebp166_relationship_stewardship_engine(),
    'companion_limitations_meta', public._ccaebp166_companion_limitations(),
    'self_love_connection_meta', public._ccaebp166_self_love_connection(),
    'security_requirements_meta', public._ccaebp166_security_requirements(),
    'ccaebp166_integration_links', public._ccaebp166_integration_links(),
    'civilizational_coordination_engagement_summary', public._ccaebp166_engagement_summary(v_tenant_id),
    'civilizational_coordination_success_criteria', public._ccaebp166_success_criteria(v_tenant_id),
    'civilizational_coordination_vision', public._ccaebp166_vision(),
    'civilizational_coordination_vision_phrases', public._ccaebp166_vision_phrases(),
    'civilizational_coordination_privacy_note', public._ccaebp166_privacy_note(),
    'civilizational_coordination_dogfooding', public._ccaebp166_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'civilizational-coordination-engine', 'Civilizational Coordination Engine',
  'Post-Enterprise & Civilizational Era (161–170) — voluntary shared action coordination. People First.',
  'authenticated', 176
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'civilizational-coordination-engine' and tenant_id is null
);

grant execute on function public.get_civilizational_coordination_engine_card(uuid) to authenticated;
grant execute on function public.get_civilizational_coordination_engine_dashboard(uuid) to authenticated;
grant execute on function public.create_civilizational_shared_action_program(text, text, text, uuid) to authenticated;
grant execute on function public.join_civilizational_coordination_partnership(text, text, text, text, uuid) to authenticated;
grant execute on function public._ccaebp166_distinction_note() to authenticated;
grant execute on function public._ccaebp166_mission() to authenticated;
grant execute on function public._ccaebp166_philosophy() to authenticated;
grant execute on function public._ccaebp166_abos_principle() to authenticated;
grant execute on function public._ccaebp166_vision() to authenticated;
grant execute on function public._ccaebp166_objectives() to authenticated;
grant execute on function public._ccaebp166_shared_action_center() to authenticated;
grant execute on function public._ccaebp166_coordination_engine() to authenticated;
grant execute on function public._ccaebp166_shared_action_framework() to authenticated;
grant execute on function public._ccaebp166_executive_coordination_reviews() to authenticated;
grant execute on function public._ccaebp166_coordination_companion() to authenticated;
grant execute on function public._ccaebp166_voluntary_alignment_engine() to authenticated;
grant execute on function public._ccaebp166_collective_execution_engine() to authenticated;
grant execute on function public._ccaebp166_relationship_stewardship_engine() to authenticated;
grant execute on function public._ccaebp166_companion_limitations() to authenticated;
grant execute on function public._ccaebp166_self_love_connection() to authenticated;
grant execute on function public._ccaebp166_security_requirements() to authenticated;
grant execute on function public._ccaebp166_integration_links() to authenticated;
grant execute on function public._ccaebp166_dogfooding() to authenticated;
grant execute on function public._ccaebp166_vision_phrases() to authenticated;
grant execute on function public._ccaebp166_privacy_note() to authenticated;
grant execute on function public._ccaebp166_engagement_summary(uuid) to authenticated;
grant execute on function public._ccaebp166_success_criteria(uuid) to authenticated;
