-- Phase 162 — Cross-Sector Intelligence & Societal Resilience Engine
-- Post-Enterprise & Civilizational Era (161–170). Societal Resilience Center at /app/cross-sector-intelligence-engine.
-- Distinct from Civic Collaboration Phase 161 (/app/civic-collaboration-engine — cross-link only).
-- Distinct from Organizational Resilience Phase 154 (/app/organizational-resilience-engine — org-level).
-- Helpers: _csie_* (engine), _csiebp162_* (blueprint — never collide with _ccvebp161_*, _oracbp154_*, _ocontbp_*)

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
    'cross_sector_intelligence_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. cross_sector_resilience_settings
-- ---------------------------------------------------------------------------
create table if not exists public.cross_sector_resilience_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade unique,
  enabled boolean not null default false,
  participation_status text not null default 'disabled' check (
    participation_status in ('disabled', 'viewer', 'contributor')
  ),
  preparedness_level text not null default 'exploring' check (
    preparedness_level in ('exploring', 'developing', 'practiced', 'reviewed')
  ),
  leadership_coordination_enabled boolean not null default true,
  learning_programs_enabled boolean not null default true,
  network_participation_enabled boolean not null default true,
  governance_preferences jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true,"not_crisis_prediction":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cross_sector_resilience_settings enable row level security;
revoke all on public.cross_sector_resilience_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. cross_sector_preparedness_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.cross_sector_preparedness_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_key text not null,
  review_title text not null,
  review_type text not null check (
    review_type in (
      'disruption_reflection', 'partner_preparedness', 'knowledge_dependency',
      'leadership_readiness', 'collaboration_opportunity', 'scenario_reflection',
      'ecosystem_health', 'mutual_support'
    )
  ),
  preparedness_level text not null default 'draft' check (
    preparedness_level in ('draft', 'review', 'completed', 'archived')
  ),
  summary text check (summary is null or char_length(summary) <= 500),
  reflection_themes jsonb not null default '[]'::jsonb,
  summary_metadata jsonb not null default '{"metadata_only":true,"not_prediction":true}'::jsonb,
  recorded_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, review_key)
);

create index if not exists cross_sector_preparedness_reviews_org_idx
  on public.cross_sector_preparedness_reviews (organization_id, review_type, preparedness_level, created_at desc);

alter table public.cross_sector_preparedness_reviews enable row level security;
revoke all on public.cross_sector_preparedness_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. cross_sector_learning_programs
-- ---------------------------------------------------------------------------
create table if not exists public.cross_sector_learning_programs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  program_key text not null,
  program_type text not null check (
    program_type in (
      'cross_sector_learning', 'knowledge_exchange', 'leadership_forum',
      'professional_support', 'educational_partnership', 'gp_coordination',
      'preparedness_exercise', 'mutual_learning'
    )
  ),
  title text not null,
  status text not null default 'enrolled' check (
    status in ('enrolled', 'active', 'paused', 'completed', 'archived')
  ),
  sector_tags text[] not null default '{}',
  summary_metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  enrolled_at timestamptz not null default now(),
  unique (organization_id, program_key)
);

create index if not exists cross_sector_learning_programs_org_idx
  on public.cross_sector_learning_programs (organization_id, program_type, status);

alter table public.cross_sector_learning_programs enable row level security;
revoke all on public.cross_sector_learning_programs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. cross_sector_resilience_networks
-- ---------------------------------------------------------------------------
create table if not exists public.cross_sector_resilience_networks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  network_key text not null,
  network_type text not null check (
    network_type in (
      'knowledge_sharing', 'leadership_forum', 'professional_support',
      'educational_partnership', 'gp_coordination', 'preparedness_exercise',
      'mutual_learning', 'community_bridge'
    )
  ),
  title text not null,
  participation_status text not null default 'exploring' check (
    participation_status in ('exploring', 'registered', 'active', 'paused', 'archived')
  ),
  sector_scope text[] not null default '{}',
  summary_metadata jsonb not null default '{"metadata_only":true,"scaffold_only":true}'::jsonb,
  registered_at timestamptz not null default now(),
  unique (organization_id, network_key)
);

create index if not exists cross_sector_resilience_networks_org_idx
  on public.cross_sector_resilience_networks (organization_id, network_type, participation_status);

alter table public.cross_sector_resilience_networks enable row level security;
revoke all on public.cross_sector_resilience_networks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. cross_sector_resilience_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.cross_sector_resilience_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists cross_sector_resilience_audit_logs_org_idx
  on public.cross_sector_resilience_audit_logs (organization_id, created_at desc);

alter table public.cross_sector_resilience_audit_logs enable row level security;
revoke all on public.cross_sector_resilience_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'cross_sector_intelligence_engine', v.description
from (values
  ('cross_sector_intelligence.view', 'View Cross-Sector Intelligence', 'View societal resilience center, preparedness metadata, and learning programs'),
  ('cross_sector_intelligence.manage', 'Manage Cross-Sector Intelligence', 'Update participation settings and review preparedness programs'),
  ('cross_sector_intelligence.contribute', 'Contribute to Cross-Sector Intelligence', 'Register network participation and record preparedness reflections')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'cross_sector_intelligence.view'), ('owner', 'cross_sector_intelligence.manage'), ('owner', 'cross_sector_intelligence.contribute'),
  ('administrator', 'cross_sector_intelligence.view'), ('administrator', 'cross_sector_intelligence.manage'), ('administrator', 'cross_sector_intelligence.contribute'),
  ('manager', 'cross_sector_intelligence.view'), ('manager', 'cross_sector_intelligence.contribute'),
  ('employee', 'cross_sector_intelligence.view'),
  ('support_agent', 'cross_sector_intelligence.view'),
  ('moderator', 'cross_sector_intelligence.view'),
  ('viewer', 'cross_sector_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_csie_*)
-- ---------------------------------------------------------------------------
create or replace function public._csie_org_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._mta_organization_for_auth();
end; $$;

create or replace function public._csie_require_org()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  if v_org_id is null then raise exception 'No organization context'; end if;
  return v_org_id;
end; $$;

create or replace function public._csie_log_audit(
  p_org_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.cross_sector_resilience_audit_logs (organization_id, action_type, summary, context)
  values (p_org_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._csie_ensure_settings(p_org_id uuid)
returns public.cross_sector_resilience_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.cross_sector_resilience_settings;
begin
  insert into public.cross_sector_resilience_settings (organization_id, enabled, participation_status)
  values (p_org_id, false, 'disabled')
  on conflict (organization_id) do nothing;
  select * into v_settings from public.cross_sector_resilience_settings where organization_id = p_org_id;
  return v_settings;
end; $$;

create or replace function public._csie_seed_programs(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.cross_sector_learning_programs where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.cross_sector_learning_programs (
    organization_id, program_key, program_type, title, status, sector_tags, summary_metadata
  ) values
    (p_org_id, 'cross_sector_learning_fundamentals', 'cross_sector_learning', 'Cross-sector learning fundamentals', 'enrolled', array['private_org','public_institution'], '{"cross_link":"global_knowledge_exchange_141"}'::jsonb),
    (p_org_id, 'knowledge_exchange_bridge', 'knowledge_exchange', 'Knowledge exchange bridge program', 'enrolled', array['knowledge_network','educational'], '{"cross_link":"global_knowledge_exchange_141"}'::jsonb),
    (p_org_id, 'leadership_coordination_forum', 'leadership_forum', 'Leadership coordination forum scaffold', 'enrolled', array['professional_association','community_org'], '{"not_centralized_control":true}'::jsonb),
    (p_org_id, 'professional_support_community', 'professional_support', 'Professional support community scaffold', 'enrolled', array['professional_association'], '{}'::jsonb),
    (p_org_id, 'educational_partnership_readiness', 'educational_partnership', 'Educational partnership readiness', 'enrolled', array['educational_institution'], '{}'::jsonb),
    (p_org_id, 'gp_coordination_readiness', 'gp_coordination', 'Growth Partner coordination readiness', 'enrolled', array['growth_partner'], '{"gp_terminology":true}'::jsonb),
    (p_org_id, 'preparedness_exercise_scaffold', 'preparedness_exercise', 'Preparedness exercise reflection scaffold', 'enrolled', array['cross_sector'], '{"not_prediction":true}'::jsonb),
    (p_org_id, 'mutual_learning_network', 'mutual_learning', 'Mutual learning network enrollment', 'enrolled', array['community_org','knowledge_network'], '{}'::jsonb);
end; $$;

create or replace function public._csie_seed_networks(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.cross_sector_resilience_networks where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.cross_sector_resilience_networks (
    organization_id, network_key, network_type, title, participation_status, sector_scope, summary_metadata
  ) values
    (p_org_id, 'knowledge_sharing_network', 'knowledge_sharing', 'Cross-sector knowledge sharing scaffold', 'exploring', array['knowledge_network'], '{"cross_link":"global_knowledge_exchange_141"}'::jsonb),
    (p_org_id, 'leadership_forum_network', 'leadership_forum', 'Leadership forum network scaffold', 'exploring', array['professional_association','public_institution'], '{}'::jsonb),
    (p_org_id, 'professional_support_network', 'professional_support', 'Professional support community scaffold', 'exploring', array['professional_association'], '{}'::jsonb),
    (p_org_id, 'educational_partnership_network', 'educational_partnership', 'Educational partnership network scaffold', 'exploring', array['educational_institution'], '{}'::jsonb),
    (p_org_id, 'gp_coordination_network', 'gp_coordination', 'Growth Partner coordination network scaffold', 'exploring', array['growth_partner'], '{}'::jsonb),
    (p_org_id, 'preparedness_exercise_network', 'preparedness_exercise', 'Preparedness exercise network scaffold', 'exploring', array['cross_sector'], '{"not_prediction":true}'::jsonb),
    (p_org_id, 'mutual_learning_network', 'mutual_learning', 'Mutual learning network scaffold', 'exploring', array['community_org'], '{}'::jsonb);
end; $$;

create or replace function public._csie_seed_reviews(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.cross_sector_preparedness_reviews where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.cross_sector_preparedness_reviews (
    organization_id, review_key, review_title, review_type, preparedness_level,
    summary, reflection_themes, summary_metadata
  ) values
    (p_org_id, 'quarterly_preparedness_reflection', 'Quarterly cross-sector preparedness reflection', 'disruption_reflection', 'review',
     'Aggregate disruption reflection themes for leadership review — reflection not prediction.',
     '["supply_chain_awareness","knowledge_dependency","leadership_coordination"]'::jsonb,
     '{"metadata_only":true,"executive_review":true}'::jsonb),
    (p_org_id, 'critical_partner_readiness', 'Critical partner preparedness awareness review', 'partner_preparedness', 'developing',
     'Critical partner dependency awareness — mutual support scaffolds, not centralized control.',
     '["partner_coordination","shared_learning"]'::jsonb,
     '{"cross_link":"joint_operations_143"}'::jsonb);
end; $$;

create or replace function public._csie_refresh_metrics(p_org_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.cross_sector_resilience_settings;
  v_program_count int;
  v_network_count int;
  v_review_count int;
  v_active_networks int;
  v_resilience_score numeric;
begin
  select * into v_settings from public.cross_sector_resilience_settings where organization_id = p_org_id;
  select count(*) into v_program_count from public.cross_sector_learning_programs where organization_id = p_org_id;
  select count(*) into v_network_count from public.cross_sector_resilience_networks where organization_id = p_org_id;
  select count(*) into v_active_networks from public.cross_sector_resilience_networks
    where organization_id = p_org_id and participation_status in ('registered', 'active');
  select count(*) into v_review_count from public.cross_sector_preparedness_reviews where organization_id = p_org_id;

  v_resilience_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + case v_settings.participation_status
        when 'contributor' then 20 when 'viewer' then 12 else 0
      end
    + case v_settings.preparedness_level
        when 'practiced' then 20 when 'developing' then 15 when 'reviewed' then 18 when 'exploring' then 8 else 0
      end
    + least(v_program_count, 8) * 3
    + least(v_active_networks, 5) * 4
    + least(v_review_count, 4) * 2.5,
    1
  );

  return jsonb_build_object(
    'resilience_score', v_resilience_score,
    'participation_status', coalesce(v_settings.participation_status, 'disabled'),
    'enabled', coalesce(v_settings.enabled, false),
    'preparedness_level', coalesce(v_settings.preparedness_level, 'exploring'),
    'programs_count', v_program_count,
    'networks_count', v_network_count,
    'active_networks_count', v_active_networks,
    'preparedness_reviews_count', v_review_count,
    'cross_links_count', jsonb_array_length(public._csiebp162_integration_links()),
    'learning_programs_count', v_program_count
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_csiebp162_*)
-- ---------------------------------------------------------------------------
create or replace function public._csiebp162_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Post-Enterprise & Civilizational Era Phase 162 — Cross-Sector Intelligence & Societal Resilience Engine at /app/cross-sector-intelligence-engine. Shared preparedness and collective learning — **NOT centralized control, dependency, or crisis prediction**. Societal Resilience Center scaffolds cross-sector readiness. **Distinct from Civic Collaboration Phase 161** at /app/civic-collaboration-engine — civic engagement and public collaboration; Phase 162 = cross-sector societal resilience and collective learning. **Distinct from Organizational Resilience Phase 154** at /app/organizational-resilience-engine — org-level adaptive continuity; Phase 162 = cross-sector societal preparedness. **Distinct from Joint Operations Phase 143**, **Global Knowledge Exchange Phase 141**, **Ecosystem Intelligence Phase 88** (/app/ecosystem), **Continuity Phase 73/80** (/app/continuity), **Global Stewardship Phase 150**, **Living Enterprise Phase 160** — cross-link only; never duplicate their RPCs. Helpers _csiebp162_* only — never collide with _ccvebp161_*, _oracbp154_*, _ocontbp_*. Growth Partner terminology — never Affiliate. Metadata only; aggregates NOT surveillance.';
$$;

create or replace function public._csiebp162_mission()
returns text language sql immutable as $$
  select 'Help organizations participate in cross-sector societal resilience — shared preparedness, collective learning, and mutual support — with humans leading decisions and companions supporting readiness reflection.';
$$;

create or replace function public._csiebp162_philosophy()
returns text language sql immutable as $$
  select 'Shared preparedness and collective learning — not centralized control or dependency. People First. Stewardship through responsibility. Wisdom before speed. Uncertainty acknowledged honestly; companions support readiness — never predict certainty or replace emergency planning.';
$$;

create or replace function public._csiebp162_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Cross-Sector Intelligence informs, prepares, and scaffolds societal resilience visibility; humans lead decisions, emergency planning, and leadership coordination. Preparedness not command. Governed reflection NOT crisis prediction.';
$$;

create or replace function public._csiebp162_vision()
returns text language sql immutable as $$
  select 'When sectors face uncertainty together, organizations learn collectively — preparedness frameworks visible, cross-sector knowledge accessible, leadership coordinated with humility, and communities supported through mutual learning.';
$$;

create or replace function public._csiebp162_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'societal_resilience_center', 'label', 'Societal Resilience Center', 'emoji', '🌐', 'description', 'Cross-sector learning programs, resilience dashboards, and preparedness framework libraries'),
    jsonb_build_object('key', 'cross_sector_collaboration', 'label', 'Cross-sector collaboration scaffolds', 'emoji', '🤝', 'description', 'Private orgs, GP, educational, professional, community, knowledge, and public institution collaboration metadata'),
    jsonb_build_object('key', 'preparedness_frameworks', 'label', 'Preparedness framework reflection', 'emoji', '📋', 'description', 'Disruption reflection, critical partners, knowledge dependencies — reflection not prediction'),
    jsonb_build_object('key', 'collective_networks', 'label', 'Collective resilience networks', 'emoji', '🔗', 'description', 'Knowledge sharing, leadership forums, professional support, and mutual learning scaffolds'),
    jsonb_build_object('key', 'resilience_companion', 'label', 'Resilience Companion readiness', 'emoji', '✨', 'description', 'Preparedness recommendations and reflection prompts — does NOT predict future'),
    jsonb_build_object('key', 'ecosystem_health', 'label', 'Ecosystem health themes', 'emoji', '🌱', 'description', 'Aggregate preparedness themes — NOT surveillance'),
    jsonb_build_object('key', 'leadership_preparedness', 'label', 'Leadership preparedness', 'emoji', '🔔', 'description', 'Preparedness reviews, reflection exercises, and cross-sector awareness sessions'),
    jsonb_build_object('key', 'mutual_support', 'label', 'Mutual support & collective learning', 'emoji', '❤️', 'description', 'Compassion, patience, and recognition of collective effort during uncertainty')
  );
$$;

create or replace function public._csiebp162_societal_resilience_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Societal Resilience Center — eight cross-sector preparedness capabilities. Collaborative resilience not centralized control.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'cross_sector_learning_programs', 'label', 'Cross-sector learning programs'),
      jsonb_build_object('key', 'resilience_dashboards', 'label', 'Resilience dashboards'),
      jsonb_build_object('key', 'preparedness_framework_libraries', 'label', 'Preparedness framework libraries'),
      jsonb_build_object('key', 'leadership_coordination_sessions', 'label', 'Leadership coordination sessions'),
      jsonb_build_object('key', 'companion_insights', 'label', 'Companion insights — readiness not prediction'),
      jsonb_build_object('key', 'knowledge_exchange_programs', 'label', 'Knowledge exchange programs', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'scenario_reflection_workshops', 'label', 'Scenario reflection workshops — not prediction'),
      jsonb_build_object('key', 'ecosystem_health_reviews', 'label', 'Ecosystem health reviews', 'cross_link', '/app/ecosystem')
    )
  );
$$;

create or replace function public._csiebp162_cross_sector_intelligence_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-sector intelligence — collaboration scaffolds across sectors. Metadata only.',
    'sectors', jsonb_build_array(
      jsonb_build_object('key', 'private_orgs', 'label', 'Private organizations'),
      jsonb_build_object('key', 'growth_partners', 'label', 'Growth Partners', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'educational_institutions', 'label', 'Educational institutions'),
      jsonb_build_object('key', 'professional_associations', 'label', 'Professional associations'),
      jsonb_build_object('key', 'community_orgs', 'label', 'Community organizations'),
      jsonb_build_object('key', 'knowledge_networks', 'label', 'Knowledge networks', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'public_institutions', 'label', 'Public institutions', 'cross_link', '/app/civic-collaboration-engine')
    )
  );
$$;

create or replace function public._csiebp162_preparedness_framework_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Preparedness framework engine — reflection and awareness scaffolds. NOT crisis prediction.',
    'frameworks', jsonb_build_array(
      jsonb_build_object('key', 'disruption_reflection', 'label', 'Disruption reflection'),
      jsonb_build_object('key', 'critical_partners', 'label', 'Critical partners awareness'),
      jsonb_build_object('key', 'knowledge_dependencies', 'label', 'Knowledge dependencies'),
      jsonb_build_object('key', 'leadership_preparedness', 'label', 'Leadership preparedness'),
      jsonb_build_object('key', 'collaboration_opportunities', 'label', 'Collaboration opportunities'),
      jsonb_build_object('key', 'mutual_support_awareness', 'label', 'Mutual support awareness')
    )
  );
$$;

create or replace function public._csiebp162_collective_resilience_networks()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collective resilience networks — mutual support scaffolds. Voluntary participation.',
    'networks', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'leadership_forums', 'label', 'Leadership forums'),
      jsonb_build_object('key', 'professional_support_communities', 'label', 'Professional support communities'),
      jsonb_build_object('key', 'educational_partnerships', 'label', 'Educational partnerships'),
      jsonb_build_object('key', 'gp_coordination', 'label', 'Growth Partner coordination'),
      jsonb_build_object('key', 'preparedness_exercises', 'label', 'Preparedness exercises — reflection not prediction'),
      jsonb_build_object('key', 'mutual_learning', 'label', 'Mutual learning')
    )
  );
$$;

create or replace function public._csiebp162_resilience_companion()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Resilience Companion — supports readiness reflection. Does NOT predict future or replace emergency planning.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'preparedness_recommendations', 'label', 'Preparedness recommendations'),
      jsonb_build_object('key', 'knowledge_discovery', 'label', 'Knowledge discovery'),
      jsonb_build_object('key', 'leadership_briefings', 'label', 'Leadership briefings'),
      jsonb_build_object('key', 'reflection_prompts', 'label', 'Reflection prompts'),
      jsonb_build_object('key', 'scenario_preparation', 'label', 'Scenario preparation — reflection not certainty'),
      jsonb_build_object('key', 'cross_sector_insight_summaries', 'label', 'Cross-sector insight summaries')
    )
  );
$$;

create or replace function public._csiebp162_ecosystem_health_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ecosystem health engine — aggregate preparedness themes only. NOT surveillance.',
    'themes', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_accessibility', 'label', 'Knowledge accessibility'),
      jsonb_build_object('key', 'leadership_preparedness_themes', 'label', 'Leadership preparedness themes'),
      jsonb_build_object('key', 'community_trust', 'label', 'Community trust'),
      jsonb_build_object('key', 'professional_collaboration', 'label', 'Professional collaboration'),
      jsonb_build_object('key', 'gp_readiness', 'label', 'Growth Partner readiness'),
      jsonb_build_object('key', 'learning_participation', 'label', 'Learning participation'),
      jsonb_build_object('key', 'adaptive_capacity', 'label', 'Adaptive capacity')
    ),
    'privacy_note', 'Aggregate themes only — never individual or cross-tenant surveillance.'
  );
$$;

create or replace function public._csiebp162_leadership_preparedness_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Leadership preparedness engine — reflection exercises and awareness sessions. Humans lead.',
    'activities', jsonb_build_array(
      jsonb_build_object('key', 'preparedness_reviews', 'label', 'Preparedness reviews'),
      jsonb_build_object('key', 'reflection_exercises', 'label', 'Reflection exercises'),
      jsonb_build_object('key', 'knowledge_briefings', 'label', 'Knowledge briefings'),
      jsonb_build_object('key', 'learning_sessions', 'label', 'Learning sessions'),
      jsonb_build_object('key', 'cross_sector_awareness', 'label', 'Cross-sector awareness'),
      jsonb_build_object('key', 'future_readiness_discussions', 'label', 'Future readiness discussions — not prediction')
    )
  );
$$;

create or replace function public._csiebp162_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Predict certainty',
      'Replace emergency planning',
      'Override leadership',
      'Suppress uncertainty',
      'Determine societal priorities'
    ),
    'principle', 'Resilience Companion supports readiness reflection — humans and leadership decide priorities and emergency response.'
  );
$$;

create or replace function public._csiebp162_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — compassion, mutual support, patience, and empathy during uncertainty.',
    'values', jsonb_build_array(
      'compassion', 'mutual_support', 'patience', 'reflection',
      'recognition_of_collective_effort', 'empathy_during_uncertainty'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._csiebp162_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_exchange_audit_logs', 'label', 'Knowledge exchange audit logs'),
      jsonb_build_object('key', 'leadership_participation_controls', 'label', 'Leadership participation controls'),
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'preparedness_documentation_protections', 'label', 'Preparedness documentation protections'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._csiebp162_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'civic_collaboration_161', 'label', 'Civic Collaboration Phase 161', 'route', '/app/civic-collaboration-engine', 'relationship', 'Civic engagement — cross-link only, never duplicate _ccvebp161_*'),
    jsonb_build_object('key', 'organizational_resilience_154', 'label', 'Organizational Resilience Phase 154', 'route', '/app/organizational-resilience-engine', 'relationship', 'Org-level resilience — cross-link only'),
    jsonb_build_object('key', 'joint_operations_143', 'label', 'Joint Operations Phase 143', 'route', '/app/joint-operations-engine', 'relationship', 'Cross-org collaboration — cross-link only'),
    jsonb_build_object('key', 'global_knowledge_exchange_141', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Interorganizational learning — cross-link only'),
    jsonb_build_object('key', 'ecosystem_intelligence_88', 'label', 'Ecosystem Intelligence Phase 88', 'route', '/app/ecosystem', 'relationship', 'Ecosystem health — cross-link only'),
    jsonb_build_object('key', 'continuity_73_80', 'label', 'Continuity Phase 73/80', 'route', '/app/continuity', 'relationship', 'Crisis continuity layer — cross-link only'),
    jsonb_build_object('key', 'global_stewardship_150', 'label', 'Global Stewardship Phase 150', 'route', '/app/global-stewardship-collective-future-engine', 'relationship', 'Stewardship era capstone — cross-link only'),
    jsonb_build_object('key', 'living_enterprise_160', 'label', 'Living Enterprise Phase 160', 'route', '/app/living-enterprise-engine', 'relationship', 'Living enterprise stewardship — cross-link only'),
    jsonb_build_object('key', 'self_love_a76', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Compassion and mutual support')
  );
$$;

create or replace function public._csiebp162_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Cross-Sector Intelligence internally with metadata-only preparedness reflections and voluntary network participation scaffolds. Growth Partner terminology throughout. No crisis prediction. No cross-sector surveillance.';
$$;

create or replace function public._csiebp162_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Shared preparedness — not centralized control.',
    'Collective learning across sectors.',
    'Readiness reflection — not crisis prediction.',
    'Humans lead; companions support.',
    'Growth Partner not Affiliate — stewardship through responsibility.',
    'People First — empathy during uncertainty.'
  );
$$;

create or replace function public._csiebp162_privacy_note()
returns text language sql immutable as $$
  select 'Cross-Sector Intelligence metadata only — preparedness reflection summaries and aggregate ecosystem health themes. No cross-sector PII. No surveillance. No crisis prediction. Opt-in participation required.';
$$;

create or replace function public._csiebp162_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._csie_ensure_settings(p_org_id);
  perform public._csie_seed_programs(p_org_id);
  perform public._csie_seed_networks(p_org_id);
  perform public._csie_seed_reviews(p_org_id);
  v_metrics := public._csie_refresh_metrics(p_org_id);

  return jsonb_build_object(
    'resilience_score', coalesce((v_metrics->>'resilience_score')::numeric, 0),
    'participation_status', coalesce(v_metrics->>'participation_status', 'disabled'),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'preparedness_level', coalesce(v_metrics->>'preparedness_level', 'exploring'),
    'programs_count', coalesce((v_metrics->>'programs_count')::int, 0),
    'networks_count', coalesce((v_metrics->>'networks_count')::int, 0),
    'active_networks_count', coalesce((v_metrics->>'active_networks_count')::int, 0),
    'preparedness_reviews_count', coalesce((v_metrics->>'preparedness_reviews_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._csiebp162_integration_links()),
    'learning_programs_count', coalesce((v_metrics->>'learning_programs_count')::int, 0),
    'privacy_note', public._csiebp162_privacy_note(),
    'opt_in_required', true
  );
end; $$;

create or replace function public._csiebp162_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._csie_ensure_settings(p_org_id);
  perform public._csie_seed_programs(p_org_id);
  perform public._csie_seed_networks(p_org_id);
  perform public._csie_seed_reviews(p_org_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'societal_resilience_center', 'label', 'Societal Resilience Center — eight capabilities', 'met', jsonb_array_length(public._csiebp162_societal_resilience_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'cross_sector_sectors', 'label', 'Cross-sector intelligence — seven sectors', 'met', jsonb_array_length(public._csiebp162_cross_sector_intelligence_engine()->'sectors') = 7, 'note', null),
    jsonb_build_object('key', 'preparedness_frameworks', 'label', 'Preparedness framework engine — six frameworks', 'met', jsonb_array_length(public._csiebp162_preparedness_framework_engine()->'frameworks') = 6, 'note', null),
    jsonb_build_object('key', 'collective_networks', 'label', 'Collective resilience networks — seven networks', 'met', jsonb_array_length(public._csiebp162_collective_resilience_networks()->'networks') = 7, 'note', null),
    jsonb_build_object('key', 'resilience_companion', 'label', 'Resilience Companion — six capabilities', 'met', jsonb_array_length(public._csiebp162_resilience_companion()->'capabilities') = 6, 'note', null),
    jsonb_build_object('key', 'ecosystem_health', 'label', 'Ecosystem health engine — seven themes', 'met', jsonb_array_length(public._csiebp162_ecosystem_health_engine()->'themes') = 7, 'note', null),
    jsonb_build_object('key', 'programs_seeded', 'label', 'Learning programs seeded', 'met', (select count(*) >= 8 from public.cross_sector_learning_programs p where p.organization_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'networks_seeded', 'label', 'Resilience networks seeded', 'met', (select count(*) >= 7 from public.cross_sector_resilience_networks n where n.organization_id = p_org_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.cross_sector_resilience_settings s where s.organization_id = p_org_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._csiebp162_companion_limitations()->'must_avoid') = 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._csiebp162_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — nine cross-links', 'met', jsonb_array_length(public._csiebp162_integration_links()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 162 baseline tables and RPCs', 'met', to_regclass('public.cross_sector_resilience_settings') is not null, 'note', '_csie_* helpers intact')
  );
end; $$;

create or replace function public._csiebp162_blueprint_block(p_org_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 162 — Cross-Sector Intelligence & Societal Resilience Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE162_CROSS_SECTOR_INTELLIGENCE_SOCIETAL_RESILIENCE.md',
    'engine_phase', 'Repo Phase 162 Cross-Sector Intelligence Engine',
    'route', '/app/cross-sector-intelligence-engine',
    'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — societal resilience center.',
    'distinction_note', public._csiebp162_distinction_note(),
    'mission', public._csiebp162_mission(),
    'philosophy', public._csiebp162_philosophy(),
    'abos_principle', public._csiebp162_abos_principle(),
    'vision', public._csiebp162_vision(),
    'objectives', public._csiebp162_objectives(),
    'societal_resilience_center', public._csiebp162_societal_resilience_center(),
    'cross_sector_intelligence_engine', public._csiebp162_cross_sector_intelligence_engine(),
    'preparedness_framework_engine', public._csiebp162_preparedness_framework_engine(),
    'collective_resilience_networks', public._csiebp162_collective_resilience_networks(),
    'resilience_companion', public._csiebp162_resilience_companion(),
    'ecosystem_health_engine', public._csiebp162_ecosystem_health_engine(),
    'leadership_preparedness_engine', public._csiebp162_leadership_preparedness_engine(),
    'companion_limitations', public._csiebp162_companion_limitations(),
    'self_love_connection', public._csiebp162_self_love_connection(),
    'security_requirements', public._csiebp162_security_requirements(),
    'integration_links', public._csiebp162_integration_links(),
    'dogfooding', public._csiebp162_dogfooding(),
    'success_criteria', public._csiebp162_success_criteria(p_org_id),
    'engagement_summary', public._csiebp162_engagement_summary(p_org_id),
    'vision_phrases', public._csiebp162_vision_phrases(),
    'privacy_note', public._csiebp162_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_cross_sector_preparedness_review(
  p_review_key text,
  p_review_title text,
  p_review_type text,
  p_preparedness_level text default 'draft',
  p_summary text default null,
  p_reflection_themes jsonb default '[]'::jsonb,
  p_summary_metadata jsonb default '{"metadata_only":true,"not_prediction":true}'::jsonb,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('cross_sector_intelligence.contribute');
  v_org_id := coalesce(p_org_id, public._csie_require_org());
  v_user_id := public._mta_app_user_id();
  if coalesce(trim(p_review_key), '') = '' then raise exception 'Review key required'; end if;
  if coalesce(trim(p_review_title), '') = '' then raise exception 'Review title required'; end if;
  if p_review_type not in (
    'disruption_reflection', 'partner_preparedness', 'knowledge_dependency',
    'leadership_readiness', 'collaboration_opportunity', 'scenario_reflection',
    'ecosystem_health', 'mutual_support'
  ) then raise exception 'Invalid review type'; end if;
  if p_summary is not null and char_length(p_summary) > 500 then raise exception 'Summary max 500 characters'; end if;

  insert into public.cross_sector_preparedness_reviews (
    organization_id, review_key, review_title, review_type, preparedness_level,
    summary, reflection_themes, summary_metadata, recorded_by
  ) values (
    v_org_id, left(trim(p_review_key), 100), left(trim(p_review_title), 200), p_review_type,
    coalesce(p_preparedness_level, 'draft'), left(p_summary, 500),
    coalesce(p_reflection_themes, '[]'::jsonb),
    coalesce(p_summary_metadata, '{"metadata_only":true,"not_prediction":true}'::jsonb),
    v_user_id
  )
  on conflict (organization_id, review_key) do update set
    review_title = excluded.review_title,
    review_type = excluded.review_type,
    preparedness_level = excluded.preparedness_level,
    summary = excluded.summary,
    reflection_themes = excluded.reflection_themes,
    summary_metadata = excluded.summary_metadata,
    recorded_by = excluded.recorded_by,
    updated_at = now()
  returning id into v_id;

  perform public._csie_log_audit(v_org_id, 'preparedness_review_recorded', left(p_review_title, 120),
    jsonb_build_object('review_id', v_id, 'review_type', p_review_type, 'preparedness_level', p_preparedness_level));
  return v_id;
end; $$;

create or replace function public.register_resilience_network_participation(
  p_network_key text,
  p_network_type text,
  p_title text,
  p_participation_status text default 'registered',
  p_sector_scope text[] default '{}',
  p_summary_metadata jsonb default '{"metadata_only":true,"scaffold_only":true}'::jsonb,
  p_org_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  perform public._irp_require_permission('cross_sector_intelligence.contribute');
  v_org_id := coalesce(p_org_id, public._csie_require_org());
  if coalesce(trim(p_network_key), '') = '' then raise exception 'Network key required'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'Title required'; end if;
  if p_network_type not in (
    'knowledge_sharing', 'leadership_forum', 'professional_support',
    'educational_partnership', 'gp_coordination', 'preparedness_exercise',
    'mutual_learning', 'community_bridge'
  ) then raise exception 'Invalid network type'; end if;

  insert into public.cross_sector_resilience_networks (
    organization_id, network_key, network_type, title, participation_status, sector_scope, summary_metadata
  ) values (
    v_org_id, left(trim(p_network_key), 100), p_network_type, left(trim(p_title), 200),
    coalesce(p_participation_status, 'registered'),
    coalesce(p_sector_scope, '{}'::text[]),
    coalesce(p_summary_metadata, '{"metadata_only":true,"scaffold_only":true}'::jsonb)
  )
  on conflict (organization_id, network_key) do update set
    network_type = excluded.network_type,
    title = excluded.title,
    participation_status = excluded.participation_status,
    sector_scope = excluded.sector_scope,
    summary_metadata = excluded.summary_metadata
  returning id into v_id;

  perform public._csie_log_audit(v_org_id, 'network_participation_registered', left(p_title, 120),
    jsonb_build_object('network_id', v_id, 'network_type', p_network_type, 'participation_status', p_participation_status));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_cross_sector_intelligence_engine_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.cross_sector_resilience_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_org_id := coalesce(p_org_id, public._csie_org_for_auth());
  if v_org_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._irp_require_permission('cross_sector_intelligence.view');
  v_settings := public._csie_ensure_settings(v_org_id);
  perform public._csie_seed_programs(v_org_id);
  perform public._csie_seed_networks(v_org_id);
  perform public._csie_seed_reviews(v_org_id);
  v_metrics := public._csie_refresh_metrics(v_org_id);
  v_engagement := public._csiebp162_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_customer', true,
    'resilience_score', v_metrics->'resilience_score',
    'participation_status', v_settings.participation_status,
    'enabled', v_settings.enabled,
    'preparedness_level', v_settings.preparedness_level,
    'programs_count', v_metrics->'programs_count',
    'networks_count', v_metrics->'networks_count',
    'philosophy', public._csiebp162_philosophy(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 162 — Cross-Sector Intelligence & Societal Resilience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE162_CROSS_SECTOR_INTELLIGENCE_SOCIETAL_RESILIENCE.md',
      'engine_phase', 'Repo Phase 162 Cross-Sector Intelligence Engine',
      'route', '/app/cross-sector-intelligence-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170).'
    ),
    'cross_sector_intelligence_mission', public._csiebp162_mission(),
    'cross_sector_intelligence_abos_principle', public._csiebp162_abos_principle(),
    'cross_sector_intelligence_engagement_summary', v_engagement,
    'cross_sector_intelligence_note', public._csiebp162_distinction_note(),
    'cross_sector_intelligence_vision_note', public._csiebp162_vision()
  );
end; $$;

create or replace function public.get_cross_sector_intelligence_engine_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.cross_sector_resilience_settings;
  v_metrics jsonb;
begin
  v_org_id := coalesce(p_org_id, public._csie_require_org());
  perform public._irp_require_permission('cross_sector_intelligence.view');
  v_settings := public._csie_ensure_settings(v_org_id);
  perform public._csie_seed_programs(v_org_id);
  perform public._csie_seed_networks(v_org_id);
  perform public._csie_seed_reviews(v_org_id);
  v_metrics := public._csie_refresh_metrics(v_org_id);
  perform public._csie_log_audit(v_org_id, 'dashboard_view', 'Cross-Sector Intelligence dashboard viewed',
    jsonb_build_object('resilience_score', v_metrics->>'resilience_score', 'participation_status', v_settings.participation_status));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'participation_status', v_settings.participation_status,
    'preparedness_level', v_settings.preparedness_level,
    'leadership_coordination_enabled', v_settings.leadership_coordination_enabled,
    'learning_programs_enabled', v_settings.learning_programs_enabled,
    'network_participation_enabled', v_settings.network_participation_enabled,
    'philosophy', public._csiebp162_philosophy(),
    'safety_note', 'Cross-Sector Intelligence — metadata and aggregate themes only. Opt-in required. No crisis prediction.',
    'distinction_note', public._csiebp162_distinction_note(),
    'resilience_score', v_metrics->'resilience_score',
    'programs_count', v_metrics->'programs_count',
    'networks_count', v_metrics->'networks_count',
    'active_networks_count', v_metrics->'active_networks_count',
    'preparedness_reviews_count', v_metrics->'preparedness_reviews_count',
    'learning_programs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'program_key', p.program_key, 'program_type', p.program_type,
        'title', p.title, 'status', p.status, 'sector_tags', p.sector_tags, 'enrolled_at', p.enrolled_at
      ) order by p.enrolled_at)
      from public.cross_sector_learning_programs p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'resilience_networks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'network_key', n.network_key, 'network_type', n.network_type,
        'title', n.title, 'participation_status', n.participation_status,
        'sector_scope', n.sector_scope, 'registered_at', n.registered_at
      ) order by n.registered_at)
      from public.cross_sector_resilience_networks n where n.organization_id = v_org_id
    ), '[]'::jsonb),
    'preparedness_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'review_key', r.review_key, 'review_type', r.review_type,
        'review_title', r.review_title, 'preparedness_level', r.preparedness_level,
        'summary', r.summary, 'reflection_themes', r.reflection_themes, 'created_at', r.created_at
      ) order by r.created_at desc)
      from public.cross_sector_preparedness_reviews r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'integration_links', public._csiebp162_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 162 — Cross-Sector Intelligence & Societal Resilience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE162_CROSS_SECTOR_INTELLIGENCE_SOCIETAL_RESILIENCE.md',
      'engine_phase', 'Repo Phase 162 Cross-Sector Intelligence Engine',
      'route', '/app/cross-sector-intelligence-engine',
      'mapping_note', 'Post-Enterprise & Civilizational Era (161–170) — societal resilience center.'
    ),
    'cross_sector_intelligence_engine_note', 'Cross-Sector Intelligence Engine (ABOS Phase 162) — cross-sector preparedness and collective learning. Cross-link Phase 161, 154, 143, 141 — do NOT duplicate their RPCs.',
    'cross_sector_intelligence_blueprint', public._csiebp162_blueprint_block(v_org_id),
    'cross_sector_intelligence_distinction_note', public._csiebp162_distinction_note(),
    'cross_sector_intelligence_mission', public._csiebp162_mission(),
    'cross_sector_intelligence_philosophy', public._csiebp162_philosophy(),
    'cross_sector_intelligence_abos_principle', public._csiebp162_abos_principle(),
    'cross_sector_intelligence_objectives', public._csiebp162_objectives(),
    'societal_resilience_center_meta', public._csiebp162_societal_resilience_center(),
    'cross_sector_intelligence_engine_meta', public._csiebp162_cross_sector_intelligence_engine(),
    'preparedness_framework_engine_meta', public._csiebp162_preparedness_framework_engine(),
    'collective_resilience_networks_meta', public._csiebp162_collective_resilience_networks(),
    'resilience_companion_meta', public._csiebp162_resilience_companion(),
    'ecosystem_health_engine_meta', public._csiebp162_ecosystem_health_engine(),
    'leadership_preparedness_engine_meta', public._csiebp162_leadership_preparedness_engine(),
    'companion_limitations_meta', public._csiebp162_companion_limitations(),
    'self_love_connection_meta', public._csiebp162_self_love_connection(),
    'security_requirements_meta', public._csiebp162_security_requirements(),
    'csiebp162_integration_links', public._csiebp162_integration_links(),
    'cross_sector_intelligence_engagement_summary', public._csiebp162_engagement_summary(v_org_id),
    'cross_sector_intelligence_success_criteria', public._csiebp162_success_criteria(v_org_id),
    'cross_sector_intelligence_vision', public._csiebp162_vision(),
    'cross_sector_intelligence_vision_phrases', public._csiebp162_vision_phrases(),
    'cross_sector_intelligence_privacy_note', public._csiebp162_privacy_note(),
    'cross_sector_intelligence_dogfooding', public._csiebp162_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'cross-sector-intelligence-engine', 'Cross-Sector Intelligence Engine',
  'Post-Enterprise & Civilizational Era (161–170) — cross-sector societal resilience and collective learning. People First.',
  'customer', 162
where not exists (
  select 1 from public.aipify_knowledge_categories where slug = 'cross-sector-intelligence-engine' and tenant_id is null
);

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order, tenant_id)
select 'cross-sector-intelligence-blueprint-phase162', 'Cross-Sector Intelligence Blueprint (Phase 162)',
  'Implementation Blueprint Phase 162 — Societal Resilience Center. Preparedness not prediction. Growth Partner not Affiliate.',
  'authenticated', 162, null
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'cross-sector-intelligence-blueprint-phase162' and tenant_id is null
);

grant execute on function public.get_cross_sector_intelligence_engine_dashboard(uuid) to authenticated;
grant execute on function public.get_cross_sector_intelligence_engine_card(uuid) to authenticated;
grant execute on function public.record_cross_sector_preparedness_review(text, text, text, text, text, jsonb, jsonb, uuid) to authenticated;
grant execute on function public.register_resilience_network_participation(text, text, text, text, text[], jsonb, uuid) to authenticated;
