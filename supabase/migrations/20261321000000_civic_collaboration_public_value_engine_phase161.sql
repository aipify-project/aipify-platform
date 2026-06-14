-- Phase 161 — Civic Collaboration & Public Value Engine
-- Post-Enterprise & Civilizational Era (161–170) opener.
-- Public Value Center — civic collaboration, NOT politics or ideological agendas.
-- Helpers: _ccve_* (engine), _ccvebp161_* (blueprint — never collide with _gisrb149_*, _sipbp118_*, _ccsbp117_*)

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
    'civic_collaboration_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. civic_collaboration_settings
-- ---------------------------------------------------------------------------
create table if not exists public.civic_collaboration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  collaboration_mode text not null default 'guided' check (
    collaboration_mode in ('guided', 'community_led', 'executive_sponsored')
  ),
  partnership_programs_enabled boolean not null default true,
  public_value_initiatives_enabled boolean not null default true,
  trust_reflection_enabled boolean not null default true,
  education_mentorship_enabled boolean not null default true,
  collaboration_preferences jsonb not null default '{}'::jsonb,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_political":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.civic_collaboration_settings enable row level security;
revoke all on public.civic_collaboration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. civic_community_partnerships
-- ---------------------------------------------------------------------------
create table if not exists public.civic_community_partnerships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partnership_key text not null,
  partnership_type text not null check (
    partnership_type in (
      'education', 'mentorship', 'knowledge_sharing', 'local_development',
      'professional_training', 'economic_opportunity', 'community_resilience'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_political":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partnership_key)
);

create index if not exists civic_community_partnerships_tenant_idx
  on public.civic_community_partnerships (tenant_id, partnership_type, status);

alter table public.civic_community_partnerships enable row level security;
revoke all on public.civic_community_partnerships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. civic_public_value_initiatives
-- ---------------------------------------------------------------------------
create table if not exists public.civic_public_value_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  initiative_type text not null check (
    initiative_type in (
      'education_collaboration', 'mentorship_program', 'local_development',
      'knowledge_exchange', 'volunteer_coordination', 'trust_reflection',
      'stewardship_program', 'community_resilience'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'active', 'paused', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);

create index if not exists civic_public_value_initiatives_tenant_idx
  on public.civic_public_value_initiatives (tenant_id, initiative_type, status);

alter table public.civic_public_value_initiatives enable row level security;
revoke all on public.civic_public_value_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. civic_trust_reflections
-- ---------------------------------------------------------------------------
create table if not exists public.civic_trust_reflections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  reflection_key text not null,
  reflection_type text not null check (
    reflection_type in (
      'community_perception', 'responsibility_demonstration', 'trust_strengthening',
      'relationship_investment', 'positive_contribution', 'stewardship_review'
    )
  ),
  title text not null,
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'completed', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true,"not_popularity_score":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, reflection_key)
);

create index if not exists civic_trust_reflections_tenant_idx
  on public.civic_trust_reflections (tenant_id, reflection_type, status);

alter table public.civic_trust_reflections enable row level security;
revoke all on public.civic_trust_reflections from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. civic_collaboration_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.civic_collaboration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.civic_collaboration_audit_logs enable row level security;
revoke all on public.civic_collaboration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'civic_collaboration_engine', v.description
from (values
  ('civic_collaboration.view', 'View Civic Collaboration Center', 'View community partnerships, public value initiatives, and trust reflection scaffolds'),
  ('civic_collaboration.manage', 'Manage Civic Collaboration Center', 'Update collaboration settings, partnership programs, and initiative scaffolds'),
  ('civic_collaboration.contribute', 'Contribute to Civic Collaboration Center', 'Register partnerships and record public trust reflection metadata')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'civic_collaboration.view'), ('owner', 'civic_collaboration.manage'), ('owner', 'civic_collaboration.contribute'),
  ('administrator', 'civic_collaboration.view'), ('administrator', 'civic_collaboration.manage'), ('administrator', 'civic_collaboration.contribute'),
  ('manager', 'civic_collaboration.view'), ('manager', 'civic_collaboration.contribute'),
  ('employee', 'civic_collaboration.view'),
  ('support_agent', 'civic_collaboration.view'),
  ('moderator', 'civic_collaboration.view'),
  ('viewer', 'civic_collaboration.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_ccve_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccve_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._ccve_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ccve_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ccve_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.civic_collaboration_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ccve_ensure_settings(p_tenant_id uuid)
returns public.civic_collaboration_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.civic_collaboration_settings;
begin
  insert into public.civic_collaboration_settings (tenant_id, enabled, collaboration_mode)
  values (p_tenant_id, false, 'guided')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.civic_collaboration_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ccve_seed_initiatives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.civic_public_value_initiatives where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.civic_public_value_initiatives (tenant_id, initiative_key, initiative_type, title, summary, status) values
    (p_tenant_id, 'education-collaboration', 'education_collaboration', 'Educational Collaborations', 'Scaffolds for school, university, and professional education partnerships — metadata counts only.', 'draft'),
    (p_tenant_id, 'mentorship-program', 'mentorship_program', 'Community Mentorship Programs', 'Mentorship and apprenticeship program scaffolds — cross-link University 115 and Future Leaders 151.', 'draft'),
    (p_tenant_id, 'local-development', 'local_development', 'Local Development Initiatives', 'Community development and economic opportunity scaffolds — responsible participation.', 'draft'),
    (p_tenant_id, 'knowledge-exchange', 'knowledge_exchange', 'Knowledge Exchange Networks', 'Community knowledge sharing scaffolds — cross-link Global Knowledge Exchange 141.', 'draft'),
    (p_tenant_id, 'volunteer-coordination', 'volunteer_coordination', 'Volunteer Coordination Scaffolds', 'Volunteer program metadata — coordination not surveillance.', 'draft'),
    (p_tenant_id, 'trust-reflection', 'trust_reflection', 'Public Trust Reflection Sessions', 'Community trust review scaffolds — reflection not popularity scores.', 'draft'),
    (p_tenant_id, 'stewardship-program', 'stewardship_program', 'Stewardship Programs', 'Long-term community stewardship scaffolds — cross-link Global Stewardship 150.', 'draft'),
    (p_tenant_id, 'community-resilience', 'community_resilience', 'Community Resilience Initiatives', 'Collective resilience and preparedness themes — metadata only.', 'draft');
end; $$;

create or replace function public._ccve_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.civic_collaboration_settings;
  v_partnership_count int;
  v_active_partnerships int;
  v_initiative_count int;
  v_active_initiatives int;
  v_reflection_count int;
  v_public_value_score numeric;
begin
  select * into v_settings from public.civic_collaboration_settings where tenant_id = p_tenant_id;
  select count(*) into v_partnership_count from public.civic_community_partnerships where tenant_id = p_tenant_id;
  select count(*) into v_active_partnerships from public.civic_community_partnerships where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_initiative_count from public.civic_public_value_initiatives where tenant_id = p_tenant_id;
  select count(*) into v_active_initiatives from public.civic_public_value_initiatives where tenant_id = p_tenant_id and status in ('draft', 'review', 'active');
  select count(*) into v_reflection_count from public.civic_trust_reflections where tenant_id = p_tenant_id;

  v_public_value_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case when coalesce(v_settings.partnership_programs_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.trust_reflection_enabled, false) then 10 else 0 end
    + case when coalesce(v_settings.education_mentorship_enabled, false) then 10 else 0 end
    + least(v_active_partnerships, 7) * 4
    + least(v_active_initiatives, 8) * 3
    + least(v_reflection_count, 6) * 3
    + least(v_initiative_count, 8) * 2,
    1
  );

  return jsonb_build_object(
    'public_value_score', v_public_value_score,
    'enabled', coalesce(v_settings.enabled, false),
    'collaboration_mode', coalesce(v_settings.collaboration_mode, 'guided'),
    'partnerships_count', v_partnership_count,
    'active_partnerships_count', v_active_partnerships,
    'initiatives_count', v_initiative_count,
    'active_initiatives_count', v_active_initiatives,
    'trust_reflections_count', v_reflection_count,
    'cross_links_count', jsonb_array_length(public._ccvebp161_integration_links())
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_ccvebp161_*)
-- ---------------------------------------------------------------------------
create or replace function public._ccvebp161_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 161 — Civic Collaboration & Public Value Engine at /app/civic-collaboration-engine. Post-Enterprise & Civilizational Era (161–170) opener — responsible civic participation, NOT politics or ideological agendas. Distinct from Social Impact & Purpose Phase 118/149 at /app/social-impact-purpose-engine (_gisrb149_*, _sipbp118_* — community impact cross-link only). Distinct from Community Phase 89 at /app/community (_ccsbp117_* — cross-link only). Distinct from Living Enterprise Phase 160 at /app/living-enterprise-engine (era 151–160 capstone — cross-link only). Helpers _ccvebp161_* — never collide with _gisrb149_*, _sipbp118_*, _ccsbp117_*. Growth Partner not Affiliate.';
$$;

create or replace function public._ccvebp161_mission()
returns text language sql immutable as $$
  select 'Strengthen communities through responsible civic collaboration and public value contribution — education, mentorship, knowledge exchange, and stewardship — without promoting political agendas, imposing ideology, or replacing civic leadership.';
$$;

create or replace function public._ccvebp161_philosophy()
returns text language sql immutable as $$
  select 'People First. Stewardship through responsibility. Politically neutral civic participation — not ideological promotion. Growth Partner terminology — never Affiliate. Civic Companion supports stewardship; it does NOT determine societal priorities.';
$$;

create or replace function public._ccvebp161_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Public Value Center aggregates civic collaboration visibility. Social Impact 118/149, Community 89, Global Knowledge Exchange 141, and Global Stewardship 150 remain authoritative for their domains. Aipify informs and prepares; humans and civic leaders decide.';
$$;

create or replace function public._ccvebp161_vision()
returns text language sql immutable as $$
  select 'Organizations contribute positively to communities through education, mentorship, knowledge sharing, and responsible stewardship — honoring diverse perspectives and strengthening public trust through demonstrated responsibility.';
$$;

create or replace function public._ccvebp161_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'community_partnerships', 'label', 'Community partnerships', 'emoji', '🤝', 'description', 'Education, mentorship, and local development programs'),
    jsonb_build_object('key', 'public_value_initiatives', 'label', 'Public value initiatives', 'emoji', '🌱', 'description', 'Initiative scaffolds for community contribution'),
    jsonb_build_object('key', 'educational_collaboration', 'label', 'Educational collaboration', 'emoji', '📚', 'description', 'School, university, and professional education partnerships'),
    jsonb_build_object('key', 'knowledge_exchange', 'label', 'Knowledge exchange', 'emoji', '🔗', 'description', 'Community knowledge sharing networks'),
    jsonb_build_object('key', 'volunteer_coordination', 'label', 'Volunteer coordination', 'emoji', '🙋', 'description', 'Volunteer program scaffolds — metadata only'),
    jsonb_build_object('key', 'trust_reflection', 'label', 'Public trust reflection', 'emoji', '🪞', 'description', 'Trust review records — NOT popularity scores'),
    jsonb_build_object('key', 'civic_companion', 'label', 'Civic Companion', 'emoji', '✨', 'description', 'Opportunity discovery and reflection — does NOT determine priorities'),
    jsonb_build_object('key', 'collective_resilience', 'label', 'Collective resilience', 'emoji', '🛡️', 'description', 'Community preparedness and inclusion themes')
  );
$$;

create or replace function public._ccvebp161_public_value_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Public Value Center — eight civic collaboration capabilities. Responsible participation — never political promotion.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'community_partnership_programs', 'label', 'Community partnership programs'),
      jsonb_build_object('key', 'public_value_initiatives', 'label', 'Public value initiatives'),
      jsonb_build_object('key', 'educational_collaborations', 'label', 'Educational collaborations', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'knowledge_exchange_networks', 'label', 'Knowledge exchange networks', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'volunteer_coordination_scaffolds', 'label', 'Volunteer coordination scaffolds'),
      jsonb_build_object('key', 'impact_reflection_sessions', 'label', 'Impact reflection sessions', 'cross_link', '/app/social-impact-purpose-engine'),
      jsonb_build_object('key', 'public_trust_dashboards', 'label', 'Public trust dashboards'),
      jsonb_build_object('key', 'stewardship_programs', 'label', 'Stewardship programs', 'cross_link', '/app/global-stewardship-collective-future-engine')
    )
  );
$$;

create or replace function public._ccvebp161_civic_collaboration_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Civic collaboration relationship scaffolds — businesses, Growth Partners, institutions, and communities.',
    'relationship_types', jsonb_build_array(
      jsonb_build_object('key', 'businesses', 'label', 'Businesses'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners — never Affiliate'),
      jsonb_build_object('key', 'educational_institutions', 'label', 'Educational institutions', 'cross_link', '/app/aipify-university'),
      jsonb_build_object('key', 'non_profits', 'label', 'Non-profit organizations'),
      jsonb_build_object('key', 'professional_communities', 'label', 'Professional communities', 'cross_link', '/app/community'),
      jsonb_build_object('key', 'industry_associations', 'label', 'Industry associations'),
      jsonb_build_object('key', 'public_institutions', 'label', 'Public institutions')
    )
  );
$$;

create or replace function public._ccvebp161_community_partnership_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community partnership framework — seven partnership domains for responsible civic contribution.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'education', 'label', 'Education'),
      jsonb_build_object('key', 'mentorship', 'label', 'Mentorship', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'local_development', 'label', 'Local development'),
      jsonb_build_object('key', 'professional_training', 'label', 'Professional training'),
      jsonb_build_object('key', 'economic_opportunity', 'label', 'Economic opportunity'),
      jsonb_build_object('key', 'community_resilience', 'label', 'Community resilience')
    )
  );
$$;

create or replace function public._ccvebp161_public_trust_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Public trust engine — reflection prompts and responsibility demonstration. NOT popularity scores.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'community_perception_reflection', 'label', 'Community perception reflection prompts'),
      jsonb_build_object('key', 'responsibility_demonstration', 'label', 'Responsibility demonstration'),
      jsonb_build_object('key', 'trust_strengthening', 'label', 'Trust strengthening practices'),
      jsonb_build_object('key', 'relationship_investment', 'label', 'Relationship investment'),
      jsonb_build_object('key', 'positive_contribution', 'label', 'Positive contribution tracking — metadata only')
    )
  );
$$;

create or replace function public._ccvebp161_civic_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Civic Companion — community opportunity discovery and reflection. Does NOT determine societal priorities.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'community_opportunity_discovery', 'label', 'Community opportunity discovery'),
      jsonb_build_object('key', 'knowledge_recommendations', 'label', 'Knowledge recommendations', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'partnership_preparation', 'label', 'Partnership preparation'),
      jsonb_build_object('key', 'impact_summaries', 'label', 'Impact summaries — metadata only'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts', 'cross_link', '/app/self-love-engine'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings — informational only')
    )
  );
$$;

create or replace function public._ccvebp161_education_mentorship_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Education and mentorship engine — student mentorship, apprenticeships, and knowledge stewardship.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'student_mentorship', 'label', 'Student mentorship'),
      jsonb_build_object('key', 'apprenticeship_programs', 'label', 'Apprenticeship programs'),
      jsonb_build_object('key', 'executive_education_contributions', 'label', 'Executive education contributions'),
      jsonb_build_object('key', 'knowledge_stewardship', 'label', 'Knowledge stewardship', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'professional_development', 'label', 'Professional development'),
      jsonb_build_object('key', 'community_learning', 'label', 'Community learning', 'cross_link', '/app/aipify-university')
    )
  );
$$;

create or replace function public._ccvebp161_collective_resilience_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective resilience framework — long-term community preparedness and inclusion themes.',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'economic_stability_contribution', 'label', 'Economic stability contribution'),
      jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility'),
      jsonb_build_object('key', 'leadership_development', 'label', 'Leadership development', 'cross_link', '/app/future-leaders-engine'),
      jsonb_build_object('key', 'community_support_systems', 'label', 'Community support systems'),
      jsonb_build_object('key', 'professional_inclusion', 'label', 'Professional inclusion'),
      jsonb_build_object('key', 'long_term_preparedness', 'label', 'Long-term preparedness')
    )
  );
$$;

create or replace function public._ccvebp161_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Promote political agendas',
      'Impose ideology',
      'Determine societal priorities',
      'Replace civic leadership',
      'Suppress diverse perspectives',
      'Popularity scoring or surveillance'
    ),
    'principle', 'Civic Companion supports stewardship — humans and civic leaders decide priorities.'
  );
$$;

create or replace function public._ccvebp161_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — compassion, generosity, humility, empathy, service, and shared humanity.',
    'values', jsonb_build_array(
      'compassion', 'generosity', 'humility', 'empathy', 'service', 'shared_humanity'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._ccvebp161_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'community_initiative_audit_logs', 'label', 'Community initiative audit logs'),
      jsonb_build_object('key', 'partnership_approval_controls', 'label', 'Partnership approval controls'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'knowledge_sharing_protections', 'label', 'Knowledge sharing protections'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._ccvebp161_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 149, 'key', 'global_impact_social_responsibility', 'label', 'Global Impact & Social Responsibility Phase 149', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Community impact — _gisrb149_* cross-link only'),
    jsonb_build_object('phase', 118, 'key', 'social_impact_purpose', 'label', 'Social Impact & Purpose Phase 118', 'route', '/app/social-impact-purpose-engine', 'relationship', 'Social impact initiatives — _sipbp118_* cross-link only'),
    jsonb_build_object('phase', 160, 'key', 'living_enterprise', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'relationship', 'Legacy era 151–160 capstone — cross-link only'),
    jsonb_build_object('phase', 150, 'key', 'global_stewardship', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Stewardship programs — cross-link only'),
    jsonb_build_object('phase', 141, 'key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Knowledge exchange networks — cross-link only'),
    jsonb_build_object('phase', 144, 'key', 'global_governance_diplomacy', 'label', 'Global Governance Diplomacy Phase 144', 'route', '/app/global-governance-diplomacy-engine', 'relationship', 'Governance diplomacy — cross-link only'),
    jsonb_build_object('phase', 89, 'key', 'community', 'label', 'Community Phase 89', 'route', '/app/community', 'relationship', 'Community engagement — _ccsbp117_* cross-link only'),
    jsonb_build_object('phase', 115, 'key', 'aipify_university', 'label', 'Aipify University Phase 115', 'route', '/app/aipify-university', 'relationship', 'Education and mentorship'),
    jsonb_build_object('phase', 151, 'key', 'future_leaders', 'label', 'Future Leaders Phase 151', 'route', '/app/future-leaders-engine', 'relationship', 'Leadership development and mentorship'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Compassion, empathy, and service')
  );
$$;

create or replace function public._ccvebp161_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Civic Collaboration Center internally with metadata-only partnership summaries, public value initiative scaffolds, and trust reflection records. Growth Partner terminology throughout. No political promotion or popularity scoring.';
$$;

create or replace function public._ccvebp161_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Stewardship through responsibility.',
    'People First — diverse perspectives honored.',
    'Public value — not political promotion.',
    'Community strength through participation.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._ccvebp161_privacy_note()
returns text language sql immutable as $$
  select 'Civic Collaboration metadata only — partnership summaries max ~500 chars, initiative scaffolds, trust reflection records. No PII surveillance, political profiling, or popularity scores.';
$$;

create or replace function public._ccvebp161_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._ccve_ensure_settings(p_org_id);
  perform public._ccve_seed_initiatives(p_org_id);
  v_metrics := public._ccve_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'public_value_score', coalesce((v_metrics->>'public_value_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'collaboration_mode', coalesce(v_metrics->>'collaboration_mode', 'guided'),
    'partnerships_count', coalesce((v_metrics->>'partnerships_count')::int, 0),
    'active_partnerships_count', coalesce((v_metrics->>'active_partnerships_count')::int, 0),
    'initiatives_count', coalesce((v_metrics->>'initiatives_count')::int, 0),
    'active_initiatives_count', coalesce((v_metrics->>'active_initiatives_count')::int, 0),
    'trust_reflections_count', coalesce((v_metrics->>'trust_reflections_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._ccvebp161_integration_links()),
    'privacy_note', public._ccvebp161_privacy_note(),
    'not_political', true
  );
end; $$;

create or replace function public._ccvebp161_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._ccve_ensure_settings(p_org_id);
  perform public._ccve_seed_initiatives(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'public_value_center', 'label', 'Public Value Center — eight capabilities', 'met', jsonb_array_length(public._ccvebp161_public_value_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'civic_collaboration_engine', 'label', 'Civic collaboration engine — seven relationship types', 'met', jsonb_array_length(public._ccvebp161_civic_collaboration_engine()->'relationship_types') = 7, 'note', null),
    jsonb_build_object('key', 'community_partnership_framework', 'label', 'Community partnership framework — seven domains', 'met', jsonb_array_length(public._ccvebp161_community_partnership_framework()->'domains') = 7, 'note', null),
    jsonb_build_object('key', 'public_trust_engine', 'label', 'Public trust engine — five capabilities', 'met', jsonb_array_length(public._ccvebp161_public_trust_engine()->'capabilities') = 5, 'note', null),
    jsonb_build_object('key', 'civic_companion', 'label', 'Civic Companion — six capabilities', 'met', jsonb_array_length(public._ccvebp161_civic_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'education_mentorship_engine', 'label', 'Education mentorship engine — six domains', 'met', jsonb_array_length(public._ccvebp161_education_mentorship_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'collective_resilience_framework', 'label', 'Collective resilience framework — six themes', 'met', jsonb_array_length(public._ccvebp161_collective_resilience_framework()->'themes') = 6, 'note', null),
    jsonb_build_object('key', 'initiatives_seeded', 'label', 'Public value initiatives — eight types seeded', 'met', (select count(*) >= 8 from public.civic_public_value_initiatives i where i.tenant_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._ccvebp161_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._ccvebp161_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — ten cross-links', 'met', jsonb_array_length(public._ccvebp161_integration_links()) = 10, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 161 baseline tables and RPCs', 'met', to_regclass('public.civic_collaboration_settings') is not null, 'note', '_ccve_* helpers intact')
  );
end; $$;

create or replace function public._ccvebp161_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 161 — Civic Collaboration & Public Value Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE161_CIVIC_COLLABORATION_PUBLIC_VALUE.md',
    'engine_phase', 'Repo Phase 161 Civic Collaboration Engine',
    'route', '/app/civic-collaboration-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) opener — responsible participation not politics.',
    'distinction_note', public._ccvebp161_distinction_note(),
    'mission', public._ccvebp161_mission(),
    'philosophy', public._ccvebp161_philosophy(),
    'abos_principle', public._ccvebp161_abos_principle(),
    'vision', public._ccvebp161_vision(),
    'objectives', public._ccvebp161_objectives(),
    'public_value_center', public._ccvebp161_public_value_center(),
    'civic_collaboration_engine', public._ccvebp161_civic_collaboration_engine(),
    'community_partnership_framework', public._ccvebp161_community_partnership_framework(),
    'public_trust_engine', public._ccvebp161_public_trust_engine(),
    'civic_companion', public._ccvebp161_civic_companion(),
    'education_mentorship_engine', public._ccvebp161_education_mentorship_engine(),
    'collective_resilience_framework', public._ccvebp161_collective_resilience_framework(),
    'companion_limitations', public._ccvebp161_companion_limitations(),
    'self_love_connection', public._ccvebp161_self_love_connection(),
    'security_requirements', public._ccvebp161_security_requirements(),
    'integration_links', public._ccvebp161_integration_links(),
    'dogfooding', public._ccvebp161_dogfooding(),
    'success_criteria', public._ccvebp161_success_criteria(p_org_id),
    'engagement_summary', public._ccvebp161_engagement_summary(p_org_id),
    'vision_phrases', public._ccvebp161_vision_phrases(),
    'privacy_note', public._ccvebp161_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.register_community_partnership(
  p_partnership_type text,
  p_title text,
  p_summary text,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_key text;
  v_id uuid;
  v_settings public.civic_collaboration_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ccve_require_tenant());
  v_settings := public._ccve_ensure_settings(v_tenant_id);
  if not v_settings.enabled then raise exception 'Civic Collaboration Center must be enabled'; end if;
  if char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := p_partnership_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civic_community_partnerships (
    tenant_id, partnership_key, partnership_type, title, summary, status
  ) values (
    v_tenant_id, v_key, p_partnership_type, p_title, left(p_summary, 500), 'planned'
  )
  returning id into v_id;
  perform public._ccve_log_audit(v_tenant_id, 'partnership_registered', left(p_title, 120),
    jsonb_build_object('partnership_id', v_id, 'partnership_type', p_partnership_type));
  return v_id;
end; $$;

create or replace function public.record_public_trust_reflection(
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
  v_tenant_id := coalesce(p_org_id, public._ccve_require_tenant());
  perform public._ccve_ensure_settings(v_tenant_id);
  if char_length(p_reflection_summary) > 500 then raise exception 'Reflection summary max 500 characters'; end if;
  v_key := p_reflection_type || '-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.civic_trust_reflections (
    tenant_id, reflection_key, reflection_type, title, reflection_summary, status
  ) values (
    v_tenant_id, v_key, p_reflection_type, p_title, left(p_reflection_summary, 500), 'draft'
  )
  returning id into v_id;
  perform public._ccve_log_audit(v_tenant_id, 'trust_reflection_recorded', left(p_title, 120),
    jsonb_build_object('reflection_id', v_id, 'reflection_type', p_reflection_type));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_civic_collaboration_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civic_collaboration_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ccve_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ccve_ensure_settings(v_tenant_id);
  perform public._ccve_seed_initiatives(v_tenant_id);
  v_metrics := public._ccve_refresh_metrics(v_tenant_id);
  v_engagement := public._ccvebp161_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'public_value_score', v_metrics->'public_value_score',
    'enabled', v_settings.enabled,
    'collaboration_mode', v_settings.collaboration_mode,
    'initiatives_count', v_metrics->'initiatives_count',
    'philosophy', public._ccvebp161_philosophy(),
    'partnership_programs_enabled', v_settings.partnership_programs_enabled,
    'trust_reflection_enabled', v_settings.trust_reflection_enabled,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 161 — Civic Collaboration & Public Value Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE161_CIVIC_COLLABORATION_PUBLIC_VALUE.md',
      'engine_phase', 'Repo Phase 161 Civic Collaboration Engine',
      'route', '/app/civic-collaboration-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) opener.'
    ),
    'civic_collaboration_mission', public._ccvebp161_mission(),
    'civic_collaboration_abos_principle', public._ccvebp161_abos_principle(),
    'civic_collaboration_engagement_summary', v_engagement,
    'civic_collaboration_note', public._ccvebp161_distinction_note(),
    'civic_collaboration_vision_note', public._ccvebp161_vision()
  );
end; $$;

create or replace function public.get_civic_collaboration_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.civic_collaboration_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ccve_require_tenant());
  v_settings := public._ccve_ensure_settings(v_tenant_id);
  perform public._ccve_seed_initiatives(v_tenant_id);
  v_metrics := public._ccve_refresh_metrics(v_tenant_id);
  perform public._ccve_log_audit(v_tenant_id, 'dashboard_view', 'Civic Collaboration dashboard viewed',
    jsonb_build_object('public_value_score', v_metrics->>'public_value_score', 'collaboration_mode', v_settings.collaboration_mode));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'collaboration_mode', v_settings.collaboration_mode,
    'partnership_programs_enabled', v_settings.partnership_programs_enabled,
    'public_value_initiatives_enabled', v_settings.public_value_initiatives_enabled,
    'trust_reflection_enabled', v_settings.trust_reflection_enabled,
    'education_mentorship_enabled', v_settings.education_mentorship_enabled,
    'philosophy', public._ccvebp161_philosophy(),
    'safety_note', 'Civic Collaboration Center — metadata scaffolds only. Politically neutral — no ideological promotion.',
    'distinction_note', public._ccvebp161_distinction_note(),
    'public_value_score', v_metrics->'public_value_score',
    'partnerships_count', v_metrics->'partnerships_count',
    'active_partnerships_count', v_metrics->'active_partnerships_count',
    'initiatives_count', v_metrics->'initiatives_count',
    'active_initiatives_count', v_metrics->'active_initiatives_count',
    'trust_reflections_count', v_metrics->'trust_reflections_count',
    'partnerships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partnership_key', p.partnership_key, 'partnership_type', p.partnership_type,
        'title', p.title, 'summary', p.summary, 'status', p.status, 'created_at', p.created_at
      ) order by p.created_at desc)
      from public.civic_community_partnerships p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'initiative_type', i.initiative_type,
        'title', i.title, 'summary', i.summary, 'status', i.status, 'created_at', i.created_at
      ) order by i.created_at)
      from public.civic_public_value_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'trust_reflections', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'reflection_key', r.reflection_key, 'reflection_type', r.reflection_type,
        'title', r.title, 'reflection_summary', r.reflection_summary, 'status', r.status,
        'created_at', r.created_at
      ) order by r.created_at desc)
      from public.civic_trust_reflections r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._ccvebp161_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 161 — Civic Collaboration & Public Value Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE161_CIVIC_COLLABORATION_PUBLIC_VALUE.md',
      'engine_phase', 'Repo Phase 161 Civic Collaboration Engine',
      'route', '/app/civic-collaboration-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) opener — responsible participation not politics.'
    ),
    'civic_collaboration_engine_note', 'Civic Collaboration Engine (ABOS Phase 161) — era opener. Cross-link Social Impact 118/149, Community 89, Living Enterprise 160 — do NOT duplicate RPCs.',
    'civic_collaboration_blueprint', public._ccvebp161_blueprint_block(v_tenant_id),
    'civic_collaboration_distinction_note', public._ccvebp161_distinction_note(),
    'civic_collaboration_mission', public._ccvebp161_mission(),
    'civic_collaboration_philosophy', public._ccvebp161_philosophy(),
    'civic_collaboration_abos_principle', public._ccvebp161_abos_principle(),
    'civic_collaboration_objectives', public._ccvebp161_objectives(),
    'public_value_center_meta', public._ccvebp161_public_value_center(),
    'civic_collaboration_engine_meta', public._ccvebp161_civic_collaboration_engine(),
    'community_partnership_framework_meta', public._ccvebp161_community_partnership_framework(),
    'public_trust_engine_meta', public._ccvebp161_public_trust_engine(),
    'civic_companion_meta', public._ccvebp161_civic_companion(),
    'education_mentorship_engine_meta', public._ccvebp161_education_mentorship_engine(),
    'collective_resilience_framework_meta', public._ccvebp161_collective_resilience_framework(),
    'companion_limitations_meta', public._ccvebp161_companion_limitations(),
    'self_love_connection_meta', public._ccvebp161_self_love_connection(),
    'security_requirements_meta', public._ccvebp161_security_requirements(),
    'ccvebp161_integration_links', public._ccvebp161_integration_links(),
    'civic_collaboration_engagement_summary', public._ccvebp161_engagement_summary(v_tenant_id),
    'civic_collaboration_success_criteria', public._ccvebp161_success_criteria(v_tenant_id),
    'civic_collaboration_vision', public._ccvebp161_vision(),
    'civic_collaboration_vision_phrases', public._ccvebp161_vision_phrases(),
    'civic_collaboration_privacy_note', public._ccvebp161_privacy_note(),
    'civic_collaboration_dogfooding', public._ccvebp161_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'civic-collaboration-engine', 'Civic Collaboration Engine',
  'Post-Enterprise & Civilizational Era (161–170) opener — civic collaboration and public value. People First.',
  'authenticated', 171
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'civic-collaboration-engine' and tenant_id is null
);

grant execute on function public.get_civic_collaboration_engine_card(uuid) to authenticated;
grant execute on function public.get_civic_collaboration_engine_dashboard(uuid) to authenticated;
grant execute on function public.register_community_partnership(text, text, text, uuid) to authenticated;
grant execute on function public.record_public_trust_reflection(text, text, text, uuid) to authenticated;
grant execute on function public._ccvebp161_distinction_note() to authenticated;
grant execute on function public._ccvebp161_mission() to authenticated;
grant execute on function public._ccvebp161_philosophy() to authenticated;
grant execute on function public._ccvebp161_abos_principle() to authenticated;
grant execute on function public._ccvebp161_vision() to authenticated;
grant execute on function public._ccvebp161_objectives() to authenticated;
grant execute on function public._ccvebp161_public_value_center() to authenticated;
grant execute on function public._ccvebp161_civic_collaboration_engine() to authenticated;
grant execute on function public._ccvebp161_community_partnership_framework() to authenticated;
grant execute on function public._ccvebp161_public_trust_engine() to authenticated;
grant execute on function public._ccvebp161_civic_companion() to authenticated;
grant execute on function public._ccvebp161_education_mentorship_engine() to authenticated;
grant execute on function public._ccvebp161_collective_resilience_framework() to authenticated;
grant execute on function public._ccvebp161_companion_limitations() to authenticated;
grant execute on function public._ccvebp161_self_love_connection() to authenticated;
grant execute on function public._ccvebp161_security_requirements() to authenticated;
grant execute on function public._ccvebp161_integration_links() to authenticated;
grant execute on function public._ccvebp161_dogfooding() to authenticated;
grant execute on function public._ccvebp161_vision_phrases() to authenticated;
grant execute on function public._ccvebp161_privacy_note() to authenticated;
grant execute on function public._ccvebp161_engagement_summary(uuid) to authenticated;
grant execute on function public._ccvebp161_success_criteria(uuid) to authenticated;
