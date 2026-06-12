-- Phase 147 — Global Talent & Expert Network Engine
-- Global Intelligence & Interorganizational Era (141–150).
-- Professional discovery and matching — NOT gig economy or anonymous freelancer marketplace.
-- Helpers: _gtene_* (engine), _gtenbp147_* (blueprint — never collide with _mpfe_*, _pen_*, _gpebp107_*)

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
    'global_governance_diplomacy',
    'global_talent_expert_network'
  )
);

-- ---------------------------------------------------------------------------
-- 1. global_talent_expert_network_settings
-- ---------------------------------------------------------------------------
create table if not exists public.global_talent_expert_network_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade unique,
  enabled boolean not null default false,
  discovery_maturity_level int not null default 1 check (discovery_maturity_level between 1 and 5),
  executive_approval_required boolean not null default true,
  gp_matching_enabled boolean not null default false,
  discovery_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.global_talent_expert_network_settings enable row level security;
revoke all on public.global_talent_expert_network_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. global_expert_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.global_expert_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_key text not null,
  display_label text not null,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'under_review', 'archived')
  ),
  expertise_areas jsonb not null default '[]'::jsonb,
  industry_focus jsonb not null default '[]'::jsonb,
  languages jsonb not null default '[]'::jsonb,
  certification_keys jsonb not null default '[]'::jsonb,
  gp_status_flags jsonb not null default '{}'::jsonb,
  regional_presence jsonb not null default '[]'::jsonb,
  biography_summary text check (char_length(biography_summary) <= 500),
  experience_summary text check (char_length(experience_summary) <= 500),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, profile_key)
);

create index if not exists global_expert_profiles_org_idx
  on public.global_expert_profiles (organization_id, status, updated_at desc);

alter table public.global_expert_profiles enable row level security;
revoke all on public.global_expert_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. global_expert_engagements
-- ---------------------------------------------------------------------------
create table if not exists public.global_expert_engagements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  engagement_key text not null,
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'in_review', 'active', 'completed', 'archived')
  ),
  role_definition_summary text check (char_length(role_definition_summary) <= 500),
  governance_expectations_summary text check (char_length(governance_expectations_summary) <= 500),
  outcome_definition_summary text check (char_length(outcome_definition_summary) <= 500),
  confidentiality_scaffold_summary text check (char_length(confidentiality_scaffold_summary) <= 500),
  executive_sponsorship_summary text check (char_length(executive_sponsorship_summary) <= 500),
  joint_operations_charter_id uuid,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, engagement_key)
);

create index if not exists global_expert_engagements_org_idx
  on public.global_expert_engagements (organization_id, status, updated_at desc);

alter table public.global_expert_engagements enable row level security;
revoke all on public.global_expert_engagements from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. global_expert_contributions
-- ---------------------------------------------------------------------------
create table if not exists public.global_expert_contributions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contribution_key text not null,
  contribution_type text not null check (
    contribution_type in (
      'knowledge_publication', 'community_leadership', 'executive_education',
      'training_development', 'gp_mentorship', 'operational_excellence'
    )
  ),
  title text not null,
  summary text check (char_length(summary) <= 500),
  contribution_count int not null default 0 check (contribution_count >= 0),
  status text not null default 'recorded' check (
    status in ('recorded', 'verified', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, contribution_key)
);

create index if not exists global_expert_contributions_org_idx
  on public.global_expert_contributions (organization_id, contribution_type, recorded_at desc);

alter table public.global_expert_contributions enable row level security;
revoke all on public.global_expert_contributions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. global_talent_expert_network_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.global_talent_expert_network_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.global_talent_expert_network_audit_logs enable row level security;
revoke all on public.global_talent_expert_network_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'global_talent_expert_network_engine', v.description
from (values
  ('global_talent_expert_network.view', 'View Global Talent & Expert Network', 'View expert profiles, discovery metadata, and engagement scaffolds'),
  ('global_talent_expert_network.manage', 'Manage Global Talent & Expert Network', 'Register profiles, create engagement charters, and update expert network settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_talent_expert_network.view'), ('owner', 'global_talent_expert_network.manage'),
  ('administrator', 'global_talent_expert_network.view'), ('administrator', 'global_talent_expert_network.manage'),
  ('manager', 'global_talent_expert_network.view'),
  ('employee', 'global_talent_expert_network.view'),
  ('support_agent', 'global_talent_expert_network.view'),
  ('moderator', 'global_talent_expert_network.view'),
  ('viewer', 'global_talent_expert_network.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_gtene_)
-- ---------------------------------------------------------------------------
create or replace function public._gtene_org_for_auth(p_org_id uuid default null)
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  if p_org_id is not null then return p_org_id; end if;
  return public._mta_require_organization();
exception when others then return null;
end; $$;

create or replace function public._gtene_require_org(p_org_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._gtene_org_for_auth(p_org_id);
  if v_org_id is null then raise exception 'No organization context'; end if;
  return v_org_id;
end; $$;

create or replace function public._gtene_log_audit(
  p_org_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.global_talent_expert_network_audit_logs (organization_id, action_type, summary, context)
  values (p_org_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._gtene_ensure_settings(p_org_id uuid)
returns public.global_talent_expert_network_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.global_talent_expert_network_settings;
begin
  insert into public.global_talent_expert_network_settings (organization_id, enabled, discovery_maturity_level)
  values (p_org_id, false, 1)
  on conflict (organization_id) do nothing;
  select * into v_settings from public.global_talent_expert_network_settings where organization_id = p_org_id;
  return v_settings;
end; $$;

create or replace function public._gtene_seed_scaffolds(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.global_expert_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.global_expert_profiles (
    organization_id, profile_key, display_label, status,
    expertise_areas, industry_focus, languages, certification_keys,
    gp_status_flags, regional_presence, biography_summary, experience_summary
  ) values
    (p_org_id, 'profile-transformation-advisor', 'Transformation advisory profile (scaffold)', 'draft',
     '["transformation","governance","operational_excellence"]'::jsonb,
     '["professional_services","technology"]'::jsonb,
     '["en"]'::jsonb, '["gp_tier_reference"]'::jsonb,
     '{"growth_partner_eligible":false,"verified_organization":false}'::jsonb,
     '["global","nordics"]'::jsonb,
     'Metadata-only professional profile scaffold — credibility not popularity. No PII.',
     'Implementation and advisory experience summaries — metadata only.'),
    (p_org_id, 'profile-knowledge-steward', 'Knowledge steward profile (scaffold)', 'draft',
     '["knowledge_stewardship","community_leadership","mentorship"]'::jsonb,
     '["education","operations"]'::jsonb,
     '["en","no"]'::jsonb, '[]'::jsonb,
     '{"growth_partner_eligible":false}'::jsonb,
     '["europe"]'::jsonb,
     'Community leadership and mentorship metadata — cross-link Global Knowledge Exchange Phase 141.',
     'Contribution counts and stewardship roles — metadata only.');

  insert into public.global_expert_contributions (
    organization_id, contribution_key, contribution_type, title, summary, contribution_count, status
  ) values
    (p_org_id, 'contrib-knowledge-publication', 'knowledge_publication', 'Knowledge publication scaffold',
     'Metadata count of approved knowledge publications — no raw content.', 0, 'recorded'),
    (p_org_id, 'contrib-gp-mentorship', 'gp_mentorship', 'Growth Partner mentorship scaffold',
     'Mentorship activity metadata — cross-link /app/partners for GP tiers.', 0, 'recorded');
end; $$;

create or replace function public._gtene_refresh_metrics(p_org_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.global_talent_expert_network_settings;
  v_profiles_count int;
  v_active_profiles int;
  v_engagements_count int;
  v_active_engagements int;
  v_contributions_count int;
  v_network_score numeric;
begin
  select * into v_settings from public.global_talent_expert_network_settings where organization_id = p_org_id;
  select count(*) into v_profiles_count from public.global_expert_profiles where organization_id = p_org_id;
  select count(*) into v_active_profiles from public.global_expert_profiles where organization_id = p_org_id and status = 'active';
  select count(*) into v_engagements_count from public.global_expert_engagements where organization_id = p_org_id;
  select count(*) into v_active_engagements from public.global_expert_engagements where organization_id = p_org_id and status in ('draft', 'in_review', 'active');
  select count(*) into v_contributions_count from public.global_expert_contributions where organization_id = p_org_id;

  v_network_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + coalesce(v_settings.discovery_maturity_level, 1) * 8
    + least(v_active_profiles, 5) * 6
    + least(v_active_engagements, 5) * 4
    + least(v_contributions_count, 6) * 2.5,
    1
  );

  return jsonb_build_object(
    'network_score', v_network_score,
    'enabled', coalesce(v_settings.enabled, false),
    'discovery_maturity_level', coalesce(v_settings.discovery_maturity_level, 1),
    'profiles_count', v_profiles_count,
    'active_profiles_count', v_active_profiles,
    'engagements_count', v_engagements_count,
    'active_engagements_count', v_active_engagements,
    'contributions_count', v_contributions_count,
    'cross_links_count', jsonb_array_length(public._gtenbp147_integration_links()),
    'global_expert_network_center_capabilities', jsonb_array_length(public._gtenbp147_global_expert_network_center()->'capabilities')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_gtenbp147_)
-- ---------------------------------------------------------------------------
create or replace function public._gtenbp147_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 147 — Global Talent & Expert Network Engine at /app/global-talent-expert-network-engine. Global Intelligence Era (141–150) — professional discovery and matching, NOT gig economy or anonymous freelancer marketplace. Quality NOT popularity — no star ratings or popularity rankings. Distinct from Ecosystem Governance Phase 146 professional directory at /app/ecosystem-governance (certification standards — cross-link). Distinct from Trust Network Phase 142 at /app/trust-reputation-engine (verified organizations — cross-link). Distinct from Partner Certification Phase 91 at /app/partners (GP tiers via _pce_tier_label() — cross-link). Distinct from Marketplace Partner Ecosystem A.45 / Blueprint 33 at /app/marketplace-partner-ecosystem-foundation-engine (partner expert network — cross-link). Distinct from Growth Partner Ecosystem Phase 107 matching scaffolds — cross-link only. Talent Companion supports discovery — does NOT replace procurement or hiring decisions. Growth Partner not Affiliate. Helpers _gtenbp147_* — never collide with _mpfe_*, _pen_*, _gpebp107_*.';
$$;

create or replace function public._gtenbp147_mission()
returns text language sql immutable as $$
  select 'Enable professional expert discovery and Growth Partner matching across verified ecosystems — built on trust, verification, and shared standards, not anonymous marketplaces. Humans decide; companions prepare.';
$$;

create or replace function public._gtenbp147_philosophy()
returns text language sql immutable as $$
  select 'People First. Professional ecosystems built on trust and verification — not anonymous marketplaces. Quality not popularity. Growth Partner not Affiliate. Growth through support and mentorship.';
$$;

create or replace function public._gtenbp147_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Global Expert Network Center surfaces professional discovery metadata and engagement scaffolds. Aipify informs and prepares; executives and procurement retain authority. Talent Companion recommends — it does not guarantee outcomes.';
$$;

create or replace function public._gtenbp147_vision()
returns text language sql immutable as $$
  select 'Organizations discover verified expertise and Growth Partners with humility and curiosity — professional relationships built on credibility, certification, and shared operational excellence.';
$$;

create or replace function public._gtenbp147_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'expert_discovery', 'label', 'Expert discovery', 'emoji', '🔍', 'description', 'Expertise, industry, regional availability, certification status'),
    jsonb_build_object('key', 'gp_matching', 'label', 'Growth Partner matching', 'emoji', '🤝', 'description', 'Industry alignment, languages, implementation experience — cross-link /app/partners'),
    jsonb_build_object('key', 'executive_advisory', 'label', 'Executive advisory networks', 'emoji', '🎯', 'description', 'Transformation advisors, governance specialists, operational excellence'),
    jsonb_build_object('key', 'industry_directories', 'label', 'Industry directories', 'emoji', '🏭', 'description', 'Professional directories by industry focus — metadata only'),
    jsonb_build_object('key', 'transformation_specialists', 'label', 'Transformation specialists', 'emoji', '✨', 'description', 'Implementation history and transformation specialist access'),
    jsonb_build_object('key', 'knowledge_stewards', 'label', 'Knowledge steward communities', 'emoji', '📚', 'description', 'Cross-link Global Knowledge Exchange Phase 141'),
    jsonb_build_object('key', 'regional_networks', 'label', 'Regional networks', 'emoji', '🌍', 'description', 'Regional presence and language metadata'),
    jsonb_build_object('key', 'collaboration_spaces', 'label', 'Collaboration spaces', 'emoji', '🛡️', 'description', 'Project charters and governance scaffolds — cross-link Joint Operations Phase 143')
  );
$$;

create or replace function public._gtenbp147_global_expert_network_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Global Expert Network Center — eight capabilities. Professional discovery not gig marketplace.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'expert_discovery', 'label', 'Expert discovery'),
      jsonb_build_object('key', 'gp_matching', 'label', 'Growth Partner matching', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'executive_advisory_networks', 'label', 'Executive advisory networks'),
      jsonb_build_object('key', 'industry_directories', 'label', 'Industry directories'),
      jsonb_build_object('key', 'transformation_specialist_access', 'label', 'Transformation specialist access'),
      jsonb_build_object('key', 'knowledge_steward_communities', 'label', 'Knowledge steward communities', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'regional_networks', 'label', 'Regional networks'),
      jsonb_build_object('key', 'collaboration_spaces', 'label', 'Collaboration spaces', 'cross_link', '/app/joint-operations-engine')
    )
  );
$$;

create or replace function public._gtenbp147_expert_discovery_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Expert discovery engine — credibility metadata, not popularity rankings.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'expertise', 'label', 'Expertise areas'),
      jsonb_build_object('key', 'industry', 'label', 'Industry focus'),
      jsonb_build_object('key', 'regional_availability', 'label', 'Regional availability'),
      jsonb_build_object('key', 'certification_status', 'label', 'Certification status', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'gp_accreditation', 'label', 'Growth Partner accreditation', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'executive_experience', 'label', 'Executive experience'),
      jsonb_build_object('key', 'implementation_history', 'label', 'Implementation history'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/global-knowledge-exchange-engine')
    )
  );
$$;

create or replace function public._gtenbp147_executive_advisory_network_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive advisory network — transformation and governance specialists; human-led engagement.',
    'roles', jsonb_build_array(
      jsonb_build_object('key', 'transformation_advisors', 'label', 'Transformation advisors'),
      jsonb_build_object('key', 'governance_specialists', 'label', 'Governance specialists'),
      jsonb_build_object('key', 'executive_coaches', 'label', 'Executive coaches'),
      jsonb_build_object('key', 'companion_strategy_consultants', 'label', 'Companion strategy consultants'),
      jsonb_build_object('key', 'operational_excellence_advisors', 'label', 'Operational excellence advisors'),
      jsonb_build_object('key', 'growth_leaders', 'label', 'Growth leaders')
    )
  );
$$;

create or replace function public._gtenbp147_growth_partner_matching_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner matching — industry, regional, certification alignment. Cross-link /app/partners — do NOT duplicate _pce_*.',
    'criteria', jsonb_build_array(
      jsonb_build_object('key', 'industry_alignment', 'label', 'Industry alignment'),
      jsonb_build_object('key', 'regional_presence', 'label', 'Regional presence'),
      jsonb_build_object('key', 'languages', 'label', 'Languages'),
      jsonb_build_object('key', 'certification', 'label', 'Certification', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'implementation_experience', 'label', 'Implementation experience'),
      jsonb_build_object('key', 'customer_success', 'label', 'Customer success metadata')
    ),
    'partners_cross_link', '/app/partners'
  );
$$;

create or replace function public._gtenbp147_specialist_collaboration_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Specialist collaboration framework — project charter scaffolds linking to Joint Operations when applicable.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'role_definitions', 'label', 'Role definitions'),
      jsonb_build_object('key', 'project_charters', 'label', 'Project charters'),
      jsonb_build_object('key', 'governance_expectations', 'label', 'Governance expectations'),
      jsonb_build_object('key', 'confidentiality_scaffolds', 'label', 'Confidentiality scaffolds'),
      jsonb_build_object('key', 'executive_sponsorship', 'label', 'Executive sponsorship'),
      jsonb_build_object('key', 'outcome_definitions', 'label', 'Outcome definitions')
    ),
    'joint_operations_cross_link', '/app/joint-operations-engine'
  );
$$;

create or replace function public._gtenbp147_professional_profile_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Professional profile engine — credibility metadata, NOT popularity or star ratings.',
    'fields', jsonb_build_array(
      jsonb_build_object('key', 'biography_metadata', 'label', 'Biography metadata'),
      jsonb_build_object('key', 'experience', 'label', 'Experience summaries'),
      jsonb_build_object('key', 'expertise', 'label', 'Expertise areas'),
      jsonb_build_object('key', 'certifications', 'label', 'Certifications', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'languages', 'label', 'Languages'),
      jsonb_build_object('key', 'industry_focus', 'label', 'Industry focus'),
      jsonb_build_object('key', 'contributions', 'label', 'Contributions'),
      jsonb_build_object('key', 'gp_status', 'label', 'Growth Partner status', 'cross_link', '/app/partners')
    )
  );
$$;

create or replace function public._gtenbp147_talent_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Talent Companion — discovery and preparation; does NOT replace human judgment or procurement.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'expert_recommendations', 'label', 'Expert recommendations'),
      jsonb_build_object('key', 'gp_discovery', 'label', 'Growth Partner discovery', 'cross_link', '/app/partners'),
      jsonb_build_object('key', 'advisory_matching', 'label', 'Advisory matching'),
      jsonb_build_object('key', 'capability_gap_identification', 'label', 'Capability gap identification'),
      jsonb_build_object('key', 'knowledge_navigation', 'label', 'Knowledge navigation', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'relationship_preparation', 'label', 'Relationship preparation')
    )
  );
$$;

create or replace function public._gtenbp147_professional_contribution_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Professional contribution engine — metadata counts of publications, leadership, mentorship.',
    'contribution_types', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_publications', 'label', 'Knowledge publications'),
      jsonb_build_object('key', 'community_leadership', 'label', 'Community leadership'),
      jsonb_build_object('key', 'executive_education', 'label', 'Executive education'),
      jsonb_build_object('key', 'training_development', 'label', 'Training development'),
      jsonb_build_object('key', 'gp_mentorship', 'label', 'Growth Partner mentorship'),
      jsonb_build_object('key', 'operational_excellence_initiatives', 'label', 'Operational excellence initiatives')
    )
  );
$$;

create or replace function public._gtenbp147_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Guarantee outcomes',
      'Misrepresent expertise',
      'Manipulate visibility or rankings',
      'Reveal confidential information',
      'Replace procurement or hiring decisions',
      'Present popularity as quality'
    ),
    'principle', 'Talent Companion supports discovery — humans accountable for selection and engagement.'
  );
$$;

create or replace function public._gtenbp147_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — humility, curiosity, mentorship, respect, recognition, lifelong learning.',
    'values', jsonb_build_array(
      'humility', 'curiosity', 'mentorship', 'respect', 'recognition', 'lifelong_learning'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._gtenbp147_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'identity_verification', 'label', 'Identity verification', 'cross_link', '/app/trust-reputation-engine'),
      jsonb_build_object('key', 'certification_validation', 'label', 'Certification validation', 'cross_link', '/app/ecosystem-governance'),
      jsonb_build_object('key', 'professional_audit_histories', 'label', 'Professional audit histories'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._gtenbp147_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ecosystem_governance', 'label', 'Ecosystem Governance Phase 146', 'route', '/app/ecosystem-governance', 'relationship', 'Professional directory and certification standards — cross-link only'),
    jsonb_build_object('key', 'trust_network', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'relationship', 'Verified organization ecosystem — cross-link only'),
    jsonb_build_object('key', 'partner_certification', 'label', 'Partner Certification Phase 91', 'route', '/app/partners', 'relationship', 'GP tiers via _pce_tier_label() — cross-link only'),
    jsonb_build_object('key', 'marketplace_partner_ecosystem', 'label', 'Marketplace Partner Ecosystem A.45 / Blueprint 33', 'route', '/app/marketplace-partner-ecosystem-foundation-engine', 'relationship', 'Partner expert network — cross-link only'),
    jsonb_build_object('key', 'growth_partner_ecosystem', 'label', 'Growth Partner Ecosystem Phase 107', 'route', '/app/growth-partner-operations', 'relationship', 'Matching scaffolds — cross-link only'),
    jsonb_build_object('key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Interorganizational learning — cross-link only'),
    jsonb_build_object('key', 'joint_operations', 'label', 'Joint Operations Phase 143', 'route', '/app/joint-operations-engine', 'relationship', 'Collaboration charters — cross-link only')
  );
$$;

create or replace function public._gtenbp147_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Global Talent & Expert Network internally with metadata-only professional profiles and engagement charter scaffolds. Growth Partner terminology throughout. Quality not popularity. Companions prepare; executives and procurement decide.';
$$;

create or replace function public._gtenbp147_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Professional ecosystems built on trust and verification.',
    'Quality not popularity — no star ratings.',
    'Growth Partner not Affiliate.',
    'Humans decide; companions prepare.',
    'Discovery supports relationships — does not replace procurement.'
  );
$$;

create or replace function public._gtenbp147_privacy_note()
returns text language sql immutable as $$
  select 'Global Talent & Expert Network metadata only — professional profile summaries, engagement charter scaffolds, and contribution counts. No PII surveillance. No popularity rankings. Executive approval workflows where configured.';
$$;

create or replace function public._gtenbp147_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._gtene_ensure_settings(p_org_id);
  perform public._gtene_seed_scaffolds(p_org_id);
  v_metrics := public._gtene_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'network_score', coalesce((v_metrics->>'network_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'discovery_maturity_level', coalesce((v_metrics->>'discovery_maturity_level')::int, 1),
    'profiles_count', coalesce((v_metrics->>'profiles_count')::int, 0),
    'active_profiles_count', coalesce((v_metrics->>'active_profiles_count')::int, 0),
    'engagements_count', coalesce((v_metrics->>'engagements_count')::int, 0),
    'active_engagements_count', coalesce((v_metrics->>'active_engagements_count')::int, 0),
    'contributions_count', coalesce((v_metrics->>'contributions_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._gtenbp147_integration_links()),
    'global_expert_network_center_capabilities', 8,
    'privacy_note', public._gtenbp147_privacy_note(),
    'procurement_disclaimer', 'Discovery scaffolds only — does not replace procurement or hiring decisions.'
  );
end; $$;

create or replace function public._gtenbp147_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._gtene_ensure_settings(p_org_id);
  perform public._gtene_seed_scaffolds(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'global_expert_network_center', 'label', 'Global Expert Network Center — eight capabilities', 'met', jsonb_array_length(public._gtenbp147_global_expert_network_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'expert_discovery', 'label', 'Expert discovery engine — eight dimensions', 'met', jsonb_array_length(public._gtenbp147_expert_discovery_engine()->'dimensions') = 8, 'note', null),
    jsonb_build_object('key', 'executive_advisory', 'label', 'Executive advisory network — six roles', 'met', jsonb_array_length(public._gtenbp147_executive_advisory_network_engine()->'roles') = 6, 'note', null),
    jsonb_build_object('key', 'gp_matching', 'label', 'Growth Partner matching — six criteria', 'met', jsonb_array_length(public._gtenbp147_growth_partner_matching_engine()->'criteria') = 6, 'note', null),
    jsonb_build_object('key', 'collaboration_framework', 'label', 'Specialist collaboration — six elements', 'met', jsonb_array_length(public._gtenbp147_specialist_collaboration_framework()->'elements') = 6, 'note', null),
    jsonb_build_object('key', 'professional_profile', 'label', 'Professional profile engine — eight fields', 'met', jsonb_array_length(public._gtenbp147_professional_profile_engine()->'fields') = 8, 'note', null),
    jsonb_build_object('key', 'talent_companion', 'label', 'Talent Companion — six capabilities', 'met', jsonb_array_length(public._gtenbp147_talent_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'contributions', 'label', 'Professional contribution engine — six types', 'met', jsonb_array_length(public._gtenbp147_professional_contribution_engine()->'contribution_types') = 6, 'note', null),
    jsonb_build_object('key', 'profiles_seeded', 'label', 'Profile scaffolds seeded', 'met', (select count(*) >= 2 from public.global_expert_profiles p where p.organization_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.global_talent_expert_network_settings s where s.organization_id = p_org_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._gtenbp147_companion_limitations()->'must_avoid') >= 6, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._gtenbp147_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — seven cross-links', 'met', jsonb_array_length(public._gtenbp147_integration_links()) = 7, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 147 baseline tables and RPCs', 'met', to_regclass('public.global_talent_expert_network_settings') is not null, 'note', '_gtene_* helpers intact')
  );
end; $$;

create or replace function public._gtenbp147_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 147 — Global Talent & Expert Network Engine',
    'doc', 'GLOBAL_TALENT_EXPERT_NETWORK_ENGINE_PHASE147.md',
    'engine_phase', 'Repo Phase 147 Global Talent Expert Network Engine',
    'route', '/app/global-talent-expert-network-engine',
    'mapping_note', 'Global Intelligence Era (141–150) — professional discovery not gig marketplace.',
    'distinction_note', public._gtenbp147_distinction_note(),
    'mission', public._gtenbp147_mission(),
    'philosophy', public._gtenbp147_philosophy(),
    'abos_principle', public._gtenbp147_abos_principle(),
    'vision', public._gtenbp147_vision(),
    'objectives', public._gtenbp147_objectives(),
    'global_expert_network_center', public._gtenbp147_global_expert_network_center(),
    'expert_discovery_engine', public._gtenbp147_expert_discovery_engine(),
    'executive_advisory_network_engine', public._gtenbp147_executive_advisory_network_engine(),
    'growth_partner_matching_engine', public._gtenbp147_growth_partner_matching_engine(),
    'specialist_collaboration_framework', public._gtenbp147_specialist_collaboration_framework(),
    'professional_profile_engine', public._gtenbp147_professional_profile_engine(),
    'talent_companion', public._gtenbp147_talent_companion(),
    'professional_contribution_engine', public._gtenbp147_professional_contribution_engine(),
    'companion_limitations', public._gtenbp147_companion_limitations(),
    'self_love_connection', public._gtenbp147_self_love_connection(),
    'security_requirements', public._gtenbp147_security_requirements(),
    'integration_links', public._gtenbp147_integration_links(),
    'dogfooding', public._gtenbp147_dogfooding(),
    'success_criteria', public._gtenbp147_success_criteria(p_org_id),
    'engagement_summary', public._gtenbp147_engagement_summary(p_org_id),
    'vision_phrases', public._gtenbp147_vision_phrases(),
    'privacy_note', public._gtenbp147_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.register_global_expert_profile(
  p_display_label text,
  p_expertise_areas jsonb default '[]'::jsonb,
  p_industry_focus jsonb default '[]'::jsonb,
  p_languages jsonb default '[]'::jsonb,
  p_certification_keys jsonb default '[]'::jsonb,
  p_biography_summary text default null,
  p_experience_summary text default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_key text;
  v_id uuid;
begin
  v_org_id := public._gtene_require_org(p_org_id);
  perform public._gtene_ensure_settings(v_org_id);
  if char_length(coalesce(p_biography_summary, '')) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := 'profile-' || left(md5(p_display_label || clock_timestamp()::text), 8);
  insert into public.global_expert_profiles (
    organization_id, profile_key, display_label, status,
    expertise_areas, industry_focus, languages, certification_keys,
    biography_summary, experience_summary
  ) values (
    v_org_id, v_key, p_display_label, 'draft',
    coalesce(p_expertise_areas, '[]'::jsonb), coalesce(p_industry_focus, '[]'::jsonb),
    coalesce(p_languages, '[]'::jsonb), coalesce(p_certification_keys, '[]'::jsonb),
    left(p_biography_summary, 500), left(p_experience_summary, 500)
  )
  returning id into v_id;
  perform public._gtene_log_audit(v_org_id, 'profile_registered', left(p_display_label, 120),
    jsonb_build_object('profile_id', v_id, 'profile_key', v_key));
  return v_id;
end; $$;

create or replace function public.create_expert_engagement_charter(
  p_title text,
  p_role_definition_summary text default null,
  p_governance_expectations_summary text default null,
  p_outcome_definition_summary text default null,
  p_confidentiality_scaffold_summary text default null,
  p_executive_sponsorship_summary text default null,
  p_joint_operations_charter_id uuid default null,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_key text;
  v_id uuid;
begin
  v_org_id := public._gtene_require_org(p_org_id);
  perform public._gtene_ensure_settings(v_org_id);
  if char_length(coalesce(p_role_definition_summary, '')) > 500 then raise exception 'Summary max 500 characters'; end if;
  v_key := 'engagement-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.global_expert_engagements (
    organization_id, engagement_key, title, status,
    role_definition_summary, governance_expectations_summary, outcome_definition_summary,
    confidentiality_scaffold_summary, executive_sponsorship_summary, joint_operations_charter_id
  ) values (
    v_org_id, v_key, p_title, 'draft',
    left(p_role_definition_summary, 500), left(p_governance_expectations_summary, 500),
    left(p_outcome_definition_summary, 500), left(p_confidentiality_scaffold_summary, 500),
    left(p_executive_sponsorship_summary, 500), p_joint_operations_charter_id
  )
  returning id into v_id;
  perform public._gtene_log_audit(v_org_id, 'engagement_charter_created', left(p_title, 120),
    jsonb_build_object('engagement_id', v_id, 'engagement_key', v_key));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_global_talent_expert_network_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.global_talent_expert_network_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_org_id := public._gtene_org_for_auth(p_org_id);
  if v_org_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._gtene_ensure_settings(v_org_id);
  perform public._gtene_seed_scaffolds(v_org_id);
  v_metrics := public._gtene_refresh_metrics(v_org_id);
  v_engagement := public._gtenbp147_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_customer', true,
    'network_score', v_metrics->'network_score',
    'enabled', v_settings.enabled,
    'discovery_maturity_level', v_settings.discovery_maturity_level,
    'profiles_count', v_metrics->'profiles_count',
    'philosophy', public._gtenbp147_philosophy(),
    'executive_approval_required', v_settings.executive_approval_required,
    'procurement_disclaimer', 'Discovery scaffolds only — does not replace procurement or hiring decisions.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 147 — Global Talent & Expert Network Engine',
      'doc', 'GLOBAL_TALENT_EXPERT_NETWORK_ENGINE_PHASE147.md',
      'engine_phase', 'Repo Phase 147 Global Talent Expert Network Engine',
      'route', '/app/global-talent-expert-network-engine',
      'mapping_note', 'Global Intelligence Era (141–150).'
    ),
    'global_talent_expert_network_mission', public._gtenbp147_mission(),
    'global_talent_expert_network_abos_principle', public._gtenbp147_abos_principle(),
    'global_talent_expert_network_engagement_summary', v_engagement,
    'global_talent_expert_network_note', public._gtenbp147_distinction_note(),
    'global_talent_expert_network_vision_note', public._gtenbp147_vision()
  );
end; $$;

create or replace function public.get_global_talent_expert_network_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.global_talent_expert_network_settings;
  v_metrics jsonb;
begin
  v_org_id := public._gtene_require_org(p_org_id);
  v_settings := public._gtene_ensure_settings(v_org_id);
  perform public._gtene_seed_scaffolds(v_org_id);
  v_metrics := public._gtene_refresh_metrics(v_org_id);
  perform public._gtene_log_audit(v_org_id, 'dashboard_view', 'Global Talent Expert Network dashboard viewed',
    jsonb_build_object('network_score', v_metrics->>'network_score', 'enabled', v_settings.enabled));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'discovery_maturity_level', v_settings.discovery_maturity_level,
    'executive_approval_required', v_settings.executive_approval_required,
    'gp_matching_enabled', v_settings.gp_matching_enabled,
    'philosophy', public._gtenbp147_philosophy(),
    'safety_note', 'Global Talent & Expert Network — metadata-only professional profiles and engagement scaffolds. No popularity rankings. Executive approval where configured.',
    'procurement_disclaimer', 'Discovery scaffolds only — does not replace procurement or hiring decisions.',
    'distinction_note', public._gtenbp147_distinction_note(),
    'network_score', v_metrics->'network_score',
    'profiles_count', v_metrics->'profiles_count',
    'active_profiles_count', v_metrics->'active_profiles_count',
    'engagements_count', v_metrics->'engagements_count',
    'active_engagements_count', v_metrics->'active_engagements_count',
    'contributions_count', v_metrics->'contributions_count',
    'expert_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'profile_key', p.profile_key, 'display_label', p.display_label, 'status', p.status,
        'expertise_areas', p.expertise_areas, 'industry_focus', p.industry_focus,
        'languages', p.languages, 'certification_keys', p.certification_keys,
        'gp_status_flags', p.gp_status_flags, 'regional_presence', p.regional_presence,
        'biography_summary', p.biography_summary, 'experience_summary', p.experience_summary,
        'updated_at', p.updated_at
      ) order by p.updated_at desc)
      from public.global_expert_profiles p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'expert_engagements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'engagement_key', e.engagement_key, 'title', e.title, 'status', e.status,
        'role_definition_summary', e.role_definition_summary,
        'governance_expectations_summary', e.governance_expectations_summary,
        'outcome_definition_summary', e.outcome_definition_summary,
        'confidentiality_scaffold_summary', e.confidentiality_scaffold_summary,
        'executive_sponsorship_summary', e.executive_sponsorship_summary,
        'joint_operations_charter_id', e.joint_operations_charter_id,
        'updated_at', e.updated_at
      ) order by e.updated_at desc)
      from public.global_expert_engagements e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'expert_contributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'contribution_key', c.contribution_key, 'contribution_type', c.contribution_type,
        'title', c.title, 'summary', c.summary, 'contribution_count', c.contribution_count,
        'status', c.status, 'recorded_at', c.recorded_at
      ) order by c.recorded_at desc)
      from public.global_expert_contributions c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_links', public._gtenbp147_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 147 — Global Talent & Expert Network Engine',
      'doc', 'GLOBAL_TALENT_EXPERT_NETWORK_ENGINE_PHASE147.md',
      'engine_phase', 'Repo Phase 147 Global Talent Expert Network Engine',
      'route', '/app/global-talent-expert-network-engine',
      'mapping_note', 'Global Intelligence Era (141–150) — professional discovery not gig marketplace.'
    ),
    'global_talent_expert_network_engine_note', 'Global Talent & Expert Network Engine (ABOS Phase 147). Cross-link 146, 142, 91, 33, 107, 141, 143 — do NOT duplicate partner or trust RPCs.',
    'global_talent_expert_network_blueprint', public._gtenbp147_blueprint_block(v_org_id),
    'global_talent_expert_network_distinction_note', public._gtenbp147_distinction_note(),
    'global_talent_expert_network_mission', public._gtenbp147_mission(),
    'global_talent_expert_network_philosophy', public._gtenbp147_philosophy(),
    'global_talent_expert_network_abos_principle', public._gtenbp147_abos_principle(),
    'global_talent_expert_network_objectives', public._gtenbp147_objectives(),
    'global_expert_network_center_meta', public._gtenbp147_global_expert_network_center(),
    'expert_discovery_engine_meta', public._gtenbp147_expert_discovery_engine(),
    'executive_advisory_network_engine_meta', public._gtenbp147_executive_advisory_network_engine(),
    'growth_partner_matching_engine_meta', public._gtenbp147_growth_partner_matching_engine(),
    'specialist_collaboration_framework_meta', public._gtenbp147_specialist_collaboration_framework(),
    'professional_profile_engine_meta', public._gtenbp147_professional_profile_engine(),
    'talent_companion_meta', public._gtenbp147_talent_companion(),
    'professional_contribution_engine_meta', public._gtenbp147_professional_contribution_engine(),
    'companion_limitations_meta', public._gtenbp147_companion_limitations(),
    'self_love_connection_meta', public._gtenbp147_self_love_connection(),
    'security_requirements_meta', public._gtenbp147_security_requirements(),
    'gtenbp147_integration_links', public._gtenbp147_integration_links(),
    'global_talent_expert_network_engagement_summary', public._gtenbp147_engagement_summary(v_org_id),
    'global_talent_expert_network_success_criteria', public._gtenbp147_success_criteria(v_org_id),
    'global_talent_expert_network_vision', public._gtenbp147_vision(),
    'global_talent_expert_network_vision_phrases', public._gtenbp147_vision_phrases(),
    'global_talent_expert_network_privacy_note', public._gtenbp147_privacy_note(),
    'global_talent_expert_network_dogfooding', public._gtenbp147_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'global-talent-expert-network-engine', 'Global Talent & Expert Network Engine',
  'Global Intelligence Era (141–150) — professional expert discovery and Growth Partner matching. Quality not popularity. Not a gig marketplace.',
  'authenticated', 157
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'global-talent-expert-network-engine' and tenant_id is null
);

grant execute on function public.get_global_talent_expert_network_engine_card(uuid) to authenticated;
grant execute on function public.get_global_talent_expert_network_engine_dashboard(uuid) to authenticated;
grant execute on function public.register_global_expert_profile(text, jsonb, jsonb, jsonb, jsonb, text, text, uuid) to authenticated;
grant execute on function public.create_expert_engagement_charter(text, text, text, text, text, text, uuid, uuid) to authenticated;
grant execute on function public._gtenbp147_distinction_note() to authenticated;
grant execute on function public._gtenbp147_mission() to authenticated;
grant execute on function public._gtenbp147_philosophy() to authenticated;
grant execute on function public._gtenbp147_abos_principle() to authenticated;
grant execute on function public._gtenbp147_vision() to authenticated;
grant execute on function public._gtenbp147_objectives() to authenticated;
grant execute on function public._gtenbp147_global_expert_network_center() to authenticated;
grant execute on function public._gtenbp147_expert_discovery_engine() to authenticated;
grant execute on function public._gtenbp147_executive_advisory_network_engine() to authenticated;
grant execute on function public._gtenbp147_growth_partner_matching_engine() to authenticated;
grant execute on function public._gtenbp147_specialist_collaboration_framework() to authenticated;
grant execute on function public._gtenbp147_professional_profile_engine() to authenticated;
grant execute on function public._gtenbp147_talent_companion() to authenticated;
grant execute on function public._gtenbp147_professional_contribution_engine() to authenticated;
grant execute on function public._gtenbp147_companion_limitations() to authenticated;
grant execute on function public._gtenbp147_self_love_connection() to authenticated;
grant execute on function public._gtenbp147_security_requirements() to authenticated;
grant execute on function public._gtenbp147_integration_links() to authenticated;
grant execute on function public._gtenbp147_dogfooding() to authenticated;
grant execute on function public._gtenbp147_vision_phrases() to authenticated;
grant execute on function public._gtenbp147_privacy_note() to authenticated;
grant execute on function public._gtenbp147_engagement_summary(uuid) to authenticated;
grant execute on function public._gtenbp147_success_criteria(uuid) to authenticated;
