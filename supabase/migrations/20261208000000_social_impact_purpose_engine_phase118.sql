-- Phase 118 — Social Impact & Purpose Engine
-- Purpose Center + Social Impact initiatives — distinct from Purpose & Values A.82, Impact Engine A.85, Platform Anonymised Impact.
-- Helpers: _sipe_* (engine), _sipbp118_* (blueprint — never collide with _pve_*, _ime_*, _pvbp64_*).

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
    'social_impact_purpose'
  )
);

-- ---------------------------------------------------------------------------
-- 1. social_impact_purpose_settings
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  purpose_visibility text not null default 'organization' check (
    purpose_visibility in ('leadership', 'organization', 'public_summary')
  ),
  wellbeing_programs_enabled boolean not null default true,
  community_programs_enabled boolean not null default true,
  human_oversight_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_impact_purpose_settings enable row level security;
revoke all on public.social_impact_purpose_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. social_impact_purpose_initiatives (metadata only — no PII)
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  initiative_type text not null check (
    initiative_type in (
      'volunteer_programs', 'employee_support', 'knowledge_sharing_projects',
      'community_partnerships', 'education_sponsorships', 'mentorship_initiatives',
      'accessibility_improvements', 'wellbeing_campaigns', 'local_impact_projects',
      'global_contribution_programs'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'planned' check (
    status in ('planned', 'active', 'paused', 'completed', 'archived')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  participation_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);

create index if not exists social_impact_purpose_initiatives_tenant_idx
  on public.social_impact_purpose_initiatives (tenant_id, initiative_type, status);

alter table public.social_impact_purpose_initiatives enable row level security;
revoke all on public.social_impact_purpose_initiatives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. social_impact_purpose_commitments
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_commitments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  commitment_key text not null,
  commitment_area text not null check (
    commitment_area in (
      'purpose_statements', 'strategic_commitments', 'community_programs',
      'employee_initiatives', 'environmental_objectives', 'governance_goals',
      'social_contribution_programs', 'impact_dashboards'
    )
  ),
  title text not null,
  summary text not null check (char_length(summary) <= 500),
  status text not null default 'active' check (
    status in ('draft', 'active', 'review', 'fulfilled', 'archived')
  ),
  progress_pct numeric(5, 2) not null default 0 check (progress_pct between 0 and 100),
  target_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, commitment_key)
);

create index if not exists social_impact_purpose_commitments_tenant_idx
  on public.social_impact_purpose_commitments (tenant_id, commitment_area, status);

alter table public.social_impact_purpose_commitments enable row level security;
revoke all on public.social_impact_purpose_commitments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. social_impact_purpose_alignment_snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_alignment_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alignment_dimension text not null check (
    alignment_dimension in (
      'declared_values', 'leadership_behaviors', 'operational_practices',
      'companion_usage', 'governance_structures', 'customer_experiences',
      'growth_partner_relationships', 'community_activities'
    )
  ),
  reflection_summary text not null check (char_length(reflection_summary) <= 500),
  alignment_signal text not null default 'moderate' check (
    alignment_signal in ('emerging', 'moderate', 'strong', 'needs_attention')
  ),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

create index if not exists social_impact_purpose_alignment_snapshots_tenant_idx
  on public.social_impact_purpose_alignment_snapshots (tenant_id, alignment_dimension, captured_at desc);

alter table public.social_impact_purpose_alignment_snapshots enable row level security;
revoke all on public.social_impact_purpose_alignment_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. social_impact_purpose_impact_indicators
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_impact_indicators (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  indicator_key text not null,
  indicator_type text not null check (
    indicator_type in (
      'participation_rates', 'volunteer_contributions', 'knowledge_sharing',
      'employee_engagement', 'training_access', 'community_reach',
      'purpose_initiative_progress', 'recognition_activities', 'wellbeing_program_adoption'
    )
  ),
  summary text not null check (char_length(summary) <= 500),
  trend_pct numeric(6, 2),
  value_numeric numeric(10, 2),
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now(),
  unique (tenant_id, indicator_key)
);

create index if not exists social_impact_purpose_impact_indicators_tenant_idx
  on public.social_impact_purpose_impact_indicators (tenant_id, indicator_type, captured_at desc);

alter table public.social_impact_purpose_impact_indicators enable row level security;
revoke all on public.social_impact_purpose_impact_indicators from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. social_impact_purpose_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.social_impact_purpose_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.social_impact_purpose_audit_logs enable row level security;
revoke all on public.social_impact_purpose_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'social_impact_purpose_engine', v.description
from (values
  ('social_impact_purpose.view', 'View Social Impact & Purpose Engine', 'View Purpose Center and social impact initiatives'),
  ('social_impact_purpose.manage', 'Manage Social Impact & Purpose Engine', 'Update purpose settings, initiatives, and commitments')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'social_impact_purpose.view'), ('owner', 'social_impact_purpose.manage'),
  ('administrator', 'social_impact_purpose.view'), ('administrator', 'social_impact_purpose.manage'),
  ('manager', 'social_impact_purpose.view'), ('manager', 'social_impact_purpose.manage'),
  ('employee', 'social_impact_purpose.view'),
  ('support_agent', 'social_impact_purpose.view'),
  ('moderator', 'social_impact_purpose.view'),
  ('viewer', 'social_impact_purpose.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Baseline helpers (_sipe_)
-- ---------------------------------------------------------------------------
create or replace function public._sipe_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._sipe_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sipe_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._sipe_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.social_impact_purpose_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._sipe_ensure_settings(p_tenant_id uuid)
returns public.social_impact_purpose_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.social_impact_purpose_settings;
begin
  insert into public.social_impact_purpose_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.social_impact_purpose_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._sipe_initiative_type_scaffolds()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'volunteer_programs', 'label', 'Volunteer programs', 'description', 'Organized volunteer participation — metadata counts only'),
    jsonb_build_object('key', 'employee_support', 'label', 'Employee support', 'description', 'Support initiatives for employee wellbeing and resilience'),
    jsonb_build_object('key', 'knowledge_sharing_projects', 'label', 'Knowledge sharing projects', 'description', 'Open knowledge and educational contributions'),
    jsonb_build_object('key', 'community_partnerships', 'label', 'Community partnerships', 'description', 'Local and regional community collaboration'),
    jsonb_build_object('key', 'education_sponsorships', 'label', 'Education sponsorships', 'description', 'Educational access and sponsorship programs'),
    jsonb_build_object('key', 'mentorship_initiatives', 'label', 'Mentorship initiatives', 'description', 'Voluntary mentorship — cross-link Community Phase 117'),
    jsonb_build_object('key', 'accessibility_improvements', 'label', 'Accessibility improvements', 'description', 'Inclusive access improvements — cross-link Inclusion A.83'),
    jsonb_build_object('key', 'wellbeing_campaigns', 'label', 'Wellbeing campaigns', 'description', 'Wellbeing awareness — cross-link Self Love A.76'),
    jsonb_build_object('key', 'local_impact_projects', 'label', 'Local impact projects', 'description', 'Neighborhood and regional positive impact'),
    jsonb_build_object('key', 'global_contribution_programs', 'label', 'Global contribution programs', 'description', 'Broader societal contribution stewardship')
  );
$$;

create or replace function public._sipe_seed_initiatives(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.social_impact_purpose_initiatives where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.social_impact_purpose_initiatives (
    tenant_id, initiative_key, initiative_type, title, summary, status, progress_pct, participation_count
  ) values
    (p_tenant_id, 'volunteer-q1', 'volunteer_programs', 'Quarterly volunteer stewardship', 'Team volunteer hours tracked as participation metadata — no individual PII.', 'active', 45, 28),
    (p_tenant_id, 'knowledge-open', 'knowledge_sharing_projects', 'Open knowledge contributions', 'Approved knowledge articles shared with community — metadata only.', 'active', 62, 15),
    (p_tenant_id, 'wellbeing-spring', 'wellbeing_campaigns', 'Spring wellbeing awareness', 'Wellbeing program adoption signals — Companions encourage, never replace human care.', 'planned', 10, 0),
    (p_tenant_id, 'local-partnership', 'community_partnerships', 'Regional community partnership', 'Local impact project with community partner — stewardship not marketing.', 'active', 35, 8),
    (p_tenant_id, 'mentorship-pilot', 'mentorship_initiatives', 'Internal mentorship pilot', 'Voluntary mentorship participation — cross-link /app/community.', 'active', 55, 12),
    (p_tenant_id, 'accessibility-review', 'accessibility_improvements', 'Accessibility improvement review', 'Inclusive access objectives — reflection not perfection.', 'planned', 5, 0),
    (p_tenant_id, 'education-sponsor', 'education_sponsorships', 'Education sponsorship program', 'Educational contribution tracking — aggregate metadata.', 'active', 40, 6),
    (p_tenant_id, 'employee-support-fund', 'employee_support', 'Employee support initiatives', 'Support program participation — dignity and compassion first.', 'active', 70, 22),
    (p_tenant_id, 'local-green', 'local_impact_projects', 'Local environmental stewardship', 'Local impact project progress — visible not hidden.', 'active', 30, 10),
    (p_tenant_id, 'global-knowledge', 'global_contribution_programs', 'Global knowledge contribution', 'Broader educational contribution program — thoughtful not performative.', 'planned', 15, 3);
end; $$;

create or replace function public._sipe_seed_commitments(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.social_impact_purpose_commitments where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.social_impact_purpose_commitments (
    tenant_id, commitment_key, commitment_area, title, summary, status, progress_pct, target_date
  ) values
    (p_tenant_id, 'purpose-statement', 'purpose_statements', 'Organizational purpose statement', 'Purpose visible in Purpose Center — action not marketing. Cross-link Purpose & Values A.82.', 'active', 80, null),
    (p_tenant_id, 'community-commitment', 'community_programs', 'Community engagement commitment', 'Sustained community program participation — cross-link /app/community.', 'active', 55, current_date + interval '180 days'),
    (p_tenant_id, 'wellbeing-commitment', 'employee_initiatives', 'Employee wellbeing commitment', 'Wellbeing program adoption — Self Love principles in organizations.', 'active', 48, current_date + interval '90 days'),
    (p_tenant_id, 'governance-purpose', 'governance_goals', 'Purpose-aligned governance goals', 'Governance structures reflect stated purpose — ethical innovation cross-link.', 'review', 35, current_date + interval '120 days'),
    (p_tenant_id, 'impact-dashboard', 'impact_dashboards', 'Purpose impact dashboard visibility', 'Impact dashboards visible — not hidden in annual reports only.', 'active', 72, null);
end; $$;

create or replace function public._sipe_seed_alignment_snapshots(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.social_impact_purpose_alignment_snapshots where tenant_id = p_tenant_id) then
    return;
  end if;

  insert into public.social_impact_purpose_alignment_snapshots (
    tenant_id, alignment_dimension, reflection_summary, alignment_signal, confidence
  ) values
    (p_tenant_id, 'declared_values', 'Stated values reflected in recent initiative choices — reflection not perfection.', 'moderate', 'moderate'),
    (p_tenant_id, 'leadership_behaviors', 'Leadership participation in purpose initiatives shows consistent stewardship signals.', 'strong', 'moderate'),
    (p_tenant_id, 'operational_practices', 'Operational practices align with community and wellbeing commitments — room for thoughtful review.', 'moderate', 'moderate'),
    (p_tenant_id, 'companion_usage', 'Companions used to organize initiatives and summarize progress — no moral judgment automation.', 'strong', 'high'),
    (p_tenant_id, 'community_activities', 'Community participation trending upward — cross-link Community Phase 117.', 'moderate', 'moderate');
end; $$;

create or replace function public._sipe_seed_impact_indicators(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.social_impact_purpose_impact_indicators where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.social_impact_purpose_impact_indicators (
    tenant_id, indicator_key, indicator_type, summary, trend_pct, value_numeric, confidence
  ) values
    (p_tenant_id, 'participation-rates', 'participation_rates', 'Initiative participation rates stable — thoughtful not performative.', 4.2, 68.0, 'moderate'),
    (p_tenant_id, 'volunteer-hours', 'volunteer_contributions', 'Volunteer contribution metadata increasing quarter over quarter.', 12.5, 340.0, 'moderate'),
    (p_tenant_id, 'knowledge-shared', 'knowledge_sharing', 'Knowledge sharing contributions from approved sources.', 8.0, 24.0, 'high'),
    (p_tenant_id, 'engagement-signals', 'employee_engagement', 'Employee engagement signals connected to purpose initiatives — metadata only.', 3.1, 74.0, 'moderate'),
    (p_tenant_id, 'training-access', 'training_access', 'Training access for purpose-aligned programs — cross-link Aipify University Phase 115.', 6.0, 82.0, 'moderate'),
    (p_tenant_id, 'community-reach', 'community_reach', 'Community reach through partnership programs.', 5.5, 15.0, 'moderate'),
    (p_tenant_id, 'initiative-progress', 'purpose_initiative_progress', 'Active purpose initiatives progressing — visible in Purpose Center.', 7.0, 52.0, 'high'),
    (p_tenant_id, 'recognition-activity', 'recognition_activities', 'Recognition activities connected — cross-link Gratitude A.89.', 2.0, 18.0, 'moderate'),
    (p_tenant_id, 'wellbeing-adoption', 'wellbeing_program_adoption', 'Wellbeing program adoption signals — Companions encourage support.', 9.0, 61.0, 'moderate');
end; $$;

create or replace function public._sipe_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_active_initiatives int;
  v_active_commitments int;
  v_alignment_snapshots int;
  v_impact_indicators int;
  v_avg_progress numeric;
  v_total_participation int;
begin
  select count(*) into v_active_initiatives from public.social_impact_purpose_initiatives
  where tenant_id = p_tenant_id and status in ('active', 'planned');
  select count(*) into v_active_commitments from public.social_impact_purpose_commitments
  where tenant_id = p_tenant_id and status in ('active', 'review');
  select count(*) into v_alignment_snapshots from public.social_impact_purpose_alignment_snapshots
  where tenant_id = p_tenant_id;
  select count(*) into v_impact_indicators from public.social_impact_purpose_impact_indicators
  where tenant_id = p_tenant_id;
  select coalesce(avg(progress_pct), 0), coalesce(sum(participation_count), 0)
  into v_avg_progress, v_total_participation
  from public.social_impact_purpose_initiatives where tenant_id = p_tenant_id and status = 'active';

  return jsonb_build_object(
    'active_initiatives', v_active_initiatives,
    'active_commitments', v_active_commitments,
    'alignment_snapshots', v_alignment_snapshots,
    'impact_indicators', v_impact_indicators,
    'avg_initiative_progress', round(v_avg_progress, 1),
    'total_participation', v_total_participation,
    'initiative_types_count', jsonb_array_length(public._sipe_initiative_type_scaffolds()),
    'purpose_center_components_count', 8,
    'wellbeing_areas_count', 8,
    'alignment_dimensions_count', 8,
    'impact_tracking_indicators_count', 9,
    'gp_participation_types_count', 7,
    'community_program_types_count', 6,
    'executive_monitors_count', 7
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Blueprint helpers (_sipbp118_)
-- ---------------------------------------------------------------------------
create or replace function public._sipbp118_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 118 — Social Impact & Purpose Engine at /app/social-impact-purpose-engine. Purpose Center + Social Impact initiatives — distinct from Purpose & Values A.82 / Blueprint 64 at /app/purpose-values-engine (organizational values alignment — cross-link only); Impact Engine A.85 at /app/impact-engine (outcome measurement across dimensions — cross-link only); Platform Anonymised Impact at /platform/impact (marketing proof — NOT tenant social impact); Inclusion & Humanity A.83; Self Love A.76; Gratitude & Recognition A.89; Community Phase 117/89 at /app/community; Growth Partner Ops Phase 114 at /app/growth-partner-operations; AI Ethics Blueprint 98 at /app/ai-ethics-responsible-use-engine. Purpose is action not marketing — no performative scoring. Helpers use _sipbp118_* — never collide with _pve_*, _ime_*, _pvbp64_*.';
$$;

create or replace function public._sipbp118_mission()
returns text language sql immutable as $$
  select 'Help organizations use their influence responsibly — aligning activities with values, measuring social contributions, and creating lasting positive impact for employees, customers, communities, and society.';
$$;

create or replace function public._sipbp118_philosophy()
returns text language sql immutable as $$
  select 'Organizations have influence; technology amplifies it. Use influence responsibly. Purpose = action not marketing. People First. Stewardship through responsibility. Success includes people — not only profits. Companions support action; humans define purpose.';
$$;

create or replace function public._sipbp118_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Social Impact & Purpose Engine orchestrates Purpose Center visibility and social impact initiative stewardship. Purpose & Values A.82 and Impact Engine A.85 remain authoritative for values alignment and outcome measurement. Aipify informs and prepares; humans decide purpose and commitments.';
$$;

create or replace function public._sipbp118_vision()
returns text language sql immutable as $$
  select 'Our organization''s purpose is visible in what we do — not only what we say. Social impact is stewardship, not marketing.';
$$;

create or replace function public._sipbp118_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'align_values', 'label', 'Align activities with values', 'emoji', '🦉', 'description', 'Connect daily work to stated purpose — cross-link Purpose & Values A.82'),
    jsonb_build_object('key', 'measure_contributions', 'label', 'Measure social contributions', 'emoji', '🔔', 'description', 'Thoughtful impact tracking — not performative scoring'),
    jsonb_build_object('key', 'responsible_leadership', 'label', 'Encourage responsible leadership', 'emoji', '🌹', 'description', 'Leadership stewardship visible in Purpose Center'),
    jsonb_build_object('key', 'community_engagement', 'label', 'Strengthen community engagement', 'emoji', '🦉', 'description', 'Community programs — cross-link /app/community'),
    jsonb_build_object('key', 'employee_wellbeing', 'label', 'Support employee wellbeing', 'emoji', '🌹', 'description', 'Wellbeing support — cross-link Self Love A.76'),
    jsonb_build_object('key', 'sustainable_growth', 'label', 'Foster sustainable growth', 'emoji', '🔔', 'description', 'Growth that includes people — not extraction'),
    jsonb_build_object('key', 'ethical_innovation', 'label', 'Promote ethical innovation', 'emoji', '🦉', 'description', 'Ethical innovation — cross-link AI Ethics Blueprint 98'),
    jsonb_build_object('key', 'lasting_impact', 'label', 'Create lasting positive impact', 'emoji', '🌹', 'description', 'Meaningful long-term impact — visible not hidden')
  );
$$;

create or replace function public._sipbp118_purpose_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose Center — eight components visible in daily work, not hidden in annual reports.',
    'components', jsonb_build_array(
      jsonb_build_object('key', 'purpose_statements', 'label', 'Purpose statements', 'description', 'Organizational purpose visible — cross-link Purpose & Values A.82'),
      jsonb_build_object('key', 'strategic_commitments', 'label', 'Strategic commitments', 'description', 'Commitments tracked with progress metadata'),
      jsonb_build_object('key', 'community_programs', 'label', 'Community programs', 'description', 'Community impact programs — cross-link /app/community'),
      jsonb_build_object('key', 'employee_initiatives', 'label', 'Employee initiatives', 'description', 'Employee-led purpose initiatives'),
      jsonb_build_object('key', 'environmental_objectives', 'label', 'Environmental objectives', 'description', 'Environmental stewardship goals — metadata only'),
      jsonb_build_object('key', 'governance_goals', 'label', 'Governance goals', 'description', 'Purpose-aligned governance — cross-link AI Ethics'),
      jsonb_build_object('key', 'social_contribution_programs', 'label', 'Social contribution programs', 'description', 'Social contribution tracking — thoughtful not performative'),
      jsonb_build_object('key', 'impact_dashboards', 'label', 'Impact dashboards', 'description', 'Impact visible in Purpose Center — cross-link Impact Engine A.85')
    )
  );
$$;

create or replace function public._sipbp118_social_impact_initiatives()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Ten social impact initiative types — metadata only, no PII.',
    'initiative_types', public._sipe_initiative_type_scaffolds(),
    'boundary_note', 'Humans define initiatives — Companions organize, track, and highlight opportunities.'
  );
$$;

create or replace function public._sipbp118_employee_wellbeing()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Employee wellbeing support — eight areas. Companions encourage support; never replace human care.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'workload_balance', 'label', 'Workload balance'),
      jsonb_build_object('key', 'learning_sustainability', 'label', 'Learning sustainability'),
      jsonb_build_object('key', 'psychological_safety', 'label', 'Psychological safety'),
      jsonb_build_object('key', 'recognition_practices', 'label', 'Recognition practices — cross-link Gratitude A.89'),
      jsonb_build_object('key', 'healthy_boundaries', 'label', 'Healthy boundaries'),
      jsonb_build_object('key', 'professional_growth', 'label', 'Professional growth'),
      jsonb_build_object('key', 'manager_support', 'label', 'Manager support'),
      jsonb_build_object('key', 'community_participation', 'label', 'Community participation')
    ),
    'self_love_route', '/app/self-love-engine'
  );
$$;

create or replace function public._sipbp118_purpose_alignment_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose alignment engine — eight dimensions. Reflection not perfection.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'declared_values', 'label', 'Declared values', 'cross_link', '/app/purpose-values-engine'),
      jsonb_build_object('key', 'leadership_behaviors', 'label', 'Leadership behaviors'),
      jsonb_build_object('key', 'operational_practices', 'label', 'Operational practices'),
      jsonb_build_object('key', 'companion_usage', 'label', 'Companion usage'),
      jsonb_build_object('key', 'governance_structures', 'label', 'Governance structures'),
      jsonb_build_object('key', 'customer_experiences', 'label', 'Customer experiences'),
      jsonb_build_object('key', 'growth_partner_relationships', 'label', 'Growth Partner relationships', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'community_activities', 'label', 'Community activities', 'cross_link', '/app/community')
    ),
    'boundary_note', 'Alignment snapshots are reflection metadata — no moral judgment automation.'
  );
$$;

create or replace function public._sipbp118_impact_tracking()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Impact tracking — nine indicators. Thoughtful not performative.',
    'indicators', jsonb_build_array(
      jsonb_build_object('key', 'participation_rates', 'label', 'Participation rates'),
      jsonb_build_object('key', 'volunteer_contributions', 'label', 'Volunteer contributions'),
      jsonb_build_object('key', 'knowledge_sharing', 'label', 'Knowledge sharing'),
      jsonb_build_object('key', 'employee_engagement', 'label', 'Employee engagement'),
      jsonb_build_object('key', 'training_access', 'label', 'Training access'),
      jsonb_build_object('key', 'community_reach', 'label', 'Community reach'),
      jsonb_build_object('key', 'purpose_initiative_progress', 'label', 'Purpose initiative progress'),
      jsonb_build_object('key', 'recognition_activities', 'label', 'Recognition activities', 'cross_link', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'wellbeing_program_adoption', 'label', 'Wellbeing program adoption')
    ),
    'impact_engine_route', '/app/impact-engine',
    'impact_engine_note', 'Impact Engine A.85 remains authoritative for outcome measurement — cross-link only.'
  );
$$;

create or replace function public._sipbp118_companion_responsibilities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'may', jsonb_build_array(
      'Organize initiatives', 'Track commitments', 'Highlight opportunities',
      'Suggest resources', 'Encourage reflection', 'Summarize progress'
    ),
    'must_avoid', jsonb_build_array(
      'Moral judgment', 'Shaming', 'Performative scoring',
      'Manipulative recommendations', 'Replacing human care for wellbeing'
    ),
    'principle', 'Humans define purpose; Companions support action.'
  );
$$;

create or replace function public._sipbp118_growth_partner_participation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth Partner participation — seven types. Strengthen relationships not sales tactics.',
    'participation_types', jsonb_build_array(
      jsonb_build_object('key', 'purpose_workshops', 'label', 'Purpose workshops'),
      jsonb_build_object('key', 'leadership_facilitation', 'label', 'Leadership facilitation'),
      jsonb_build_object('key', 'wellbeing_programs', 'label', 'Wellbeing programs'),
      jsonb_build_object('key', 'governance_coaching', 'label', 'Governance coaching'),
      jsonb_build_object('key', 'community_partnerships', 'label', 'Community partnerships'),
      jsonb_build_object('key', 'knowledge_initiatives', 'label', 'Knowledge initiatives'),
      jsonb_build_object('key', 'transformation_support', 'label', 'Transformation support')
    ),
    'cross_link', '/app/growth-partner-operations'
  );
$$;

create or replace function public._sipbp118_self_love_in_organizations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love in organizations — respect, compassion, reflection, encouragement, healthy expectations, celebration of progress.',
    'values', jsonb_build_array('respect', 'compassion', 'reflection', 'encouragement', 'healthy_expectations', 'celebration_of_progress'),
    'vision', 'Organizations that care for people build stronger futures.',
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._sipbp118_community_impact_programs()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Community impact programs — six types. Cross-link Community Phase 117/89.',
    'program_types', jsonb_build_array(
      jsonb_build_object('key', 'shared_learning', 'label', 'Shared learning'),
      jsonb_build_object('key', 'cross_partner_projects', 'label', 'Cross-partner projects'),
      jsonb_build_object('key', 'educational_contributions', 'label', 'Educational contributions'),
      jsonb_build_object('key', 'open_knowledge_campaigns', 'label', 'Open knowledge campaigns'),
      jsonb_build_object('key', 'volunteer_coordination', 'label', 'Volunteer coordination'),
      jsonb_build_object('key', 'collective_support_efforts', 'label', 'Collective support efforts')
    ),
    'cross_link', '/app/community'
  );
$$;

create or replace function public._sipbp118_executive_purpose_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive purpose dashboard — seven monitors. Awareness not image management.',
    'monitors', jsonb_build_array(
      jsonb_build_object('key', 'purpose_initiative_status', 'label', 'Purpose initiative status'),
      jsonb_build_object('key', 'employee_engagement_signals', 'label', 'Employee engagement signals'),
      jsonb_build_object('key', 'community_participation_trends', 'label', 'Community participation trends'),
      jsonb_build_object('key', 'recognition_activity', 'label', 'Recognition activity'),
      jsonb_build_object('key', 'strategic_alignment_indicators', 'label', 'Strategic alignment indicators'),
      jsonb_build_object('key', 'wellbeing_program_adoption', 'label', 'Wellbeing program adoption'),
      jsonb_build_object('key', 'growth_partner_contributions', 'label', 'Growth Partner contributions')
    ),
    'boundary_note', 'Executive visibility supports stewardship — not performative ESG scoring.'
  );
$$;

create or replace function public._sipbp118_cross_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'purpose_values', 'label', 'Purpose & Values A.82 + Blueprint 64', 'route', '/app/purpose-values-engine', 'relationship', 'Organizational purpose/values alignment — cross-link only'),
    jsonb_build_object('key', 'impact_engine', 'label', 'Impact Engine A.85', 'route', '/app/impact-engine', 'relationship', 'Outcome measurement across dimensions — cross-link only'),
    jsonb_build_object('key', 'inclusion_humanity', 'label', 'Inclusion & Humanity A.83', 'route', '/app/inclusion-humanity-engine', 'relationship', 'Human Values Charter — cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'relationship', 'Wellbeing principles — cross-link'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine', 'relationship', 'Recognition activities — cross-link'),
    jsonb_build_object('key', 'community', 'label', 'Community Phase 117/89', 'route', '/app/community', 'relationship', 'Community impact programs — cross-link'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP purpose participation — cross-link'),
    jsonb_build_object('key', 'ai_ethics', 'label', 'AI Ethics Blueprint 98', 'route', '/app/ai-ethics-responsible-use-engine', 'relationship', 'Ethical innovation — cross-link'),
    jsonb_build_object('key', 'platform_impact', 'label', 'Platform Anonymised Impact', 'route', '/platform/impact', 'relationship', 'Platform marketing proof — NOT tenant social impact')
  );
$$;

create or replace function public._sipbp118_limitation_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Purpose is action not marketing — metadata only, no moral judgment automation.',
    'must_avoid', jsonb_build_array(
      'Performative scoring or ESG gamification',
      'Moral judgment or shaming automation',
      'Storing PII in social impact tables',
      'Duplicating Purpose & Values or Impact Engine RPCs',
      'Manipulative recommendations that pressure participation',
      'Replacing human care for employee wellbeing'
    ),
    'required', jsonb_build_array(
      'human_oversight_required default true',
      'Metadata-only initiatives and impact indicators',
      'Cross-link authoritative surfaces — purpose values, impact engine, community',
      'Reflection not perfection in alignment snapshots',
      'Audit logging for significant purpose events'
    ),
    'boundary_note', 'Humans define purpose; Companions support action.'
  );
$$;

create or replace function public._sipbp118_companion_adaptation()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Social Impact & Purpose Companion — warm stewardship. Purpose is action not marketing.',
    'companion_name', 'Social Impact & Purpose Companion',
    'not_label', 'AI purpose scoring bot',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'initiative_stewardship', 'prompt', 'Three purpose initiatives are active — shall Aipify prepare a calm progress summary for your review?', 'consideration', 'Organize and summarize — humans define priorities'),
      jsonb_build_object('emoji', '🌹', 'key', 'wellbeing_encouragement', 'prompt', 'Wellbeing program adoption is growing — would celebrating one team milestone before planning the next initiative feel wise?', 'consideration', 'Self Love in organizations — encourage never replace human care'),
      jsonb_build_object('emoji', '🔔', 'key', 'community_opportunity', 'prompt', 'A community partnership opportunity aligns with your stated purpose — Community hub cross-link available when you are ready.', 'consideration', 'Highlight opportunities — no pressure framing')
    ),
    'boundary_note', 'Companion adapts tone — never judges purpose commitment or shames inaction.'
  );
$$;

create or replace function public._sipbp118_success_metrics()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'employee_engagement', 'label', 'Higher employee engagement'),
    jsonb_build_object('key', 'community_participation', 'label', 'Increased community participation'),
    jsonb_build_object('key', 'wellbeing_awareness', 'label', 'Improved wellbeing awareness'),
    jsonb_build_object('key', 'values_action_alignment', 'label', 'Greater values-action alignment'),
    jsonb_build_object('key', 'gp_relationships', 'label', 'Stronger Growth Partner relationships'),
    jsonb_build_object('key', 'educational_contributions', 'label', 'Expanded educational contributions'),
    jsonb_build_object('key', 'healthier_cultures', 'label', 'Healthier organizational cultures'),
    jsonb_build_object('key', 'long_term_impact', 'label', 'Meaningful long-term impact')
  );
$$;

create or replace function public._sipbp118_integration_links()
returns jsonb language sql immutable as $$
  select public._sipbp118_cross_links();
$$;

create or replace function public._sipbp118_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._sipe_ensure_settings(p_tenant_id);
  perform public._sipe_seed_initiatives(p_tenant_id);
  perform public._sipe_seed_commitments(p_tenant_id);
  perform public._sipe_seed_alignment_snapshots(p_tenant_id);
  perform public._sipe_seed_impact_indicators(p_tenant_id);
  v_metrics := public._sipe_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'active_initiatives', coalesce((v_metrics->>'active_initiatives')::int, 0),
    'active_commitments', coalesce((v_metrics->>'active_commitments')::int, 0),
    'avg_initiative_progress', coalesce((v_metrics->>'avg_initiative_progress')::numeric, 0),
    'total_participation', coalesce((v_metrics->>'total_participation')::int, 0),
    'alignment_snapshots', coalesce((v_metrics->>'alignment_snapshots')::int, 0),
    'impact_indicators', coalesce((v_metrics->>'impact_indicators')::int, 0),
    'purpose_center_components_count', 8,
    'initiative_types_count', 10,
    'cross_links_count', jsonb_array_length(public._sipbp118_cross_links()),
    'privacy_note', 'Aggregate purpose and social impact counts — metadata only, no PII.'
  );
end; $$;

create or replace function public._sipbp118_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sipe_ensure_settings(p_tenant_id);
  perform public._sipe_seed_initiatives(p_tenant_id);
  perform public._sipe_seed_commitments(p_tenant_id);
  perform public._sipe_seed_alignment_snapshots(p_tenant_id);
  perform public._sipe_seed_impact_indicators(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'purpose_center', 'label', 'Purpose Center — eight components documented', 'met', jsonb_array_length(public._sipbp118_purpose_center()->'components') = 8, 'note', null),
    jsonb_build_object('key', 'initiative_types', 'label', 'Social impact initiatives — ten types seeded', 'met', jsonb_array_length(public._sipe_initiative_type_scaffolds()) = 10, 'note', null),
    jsonb_build_object('key', 'wellbeing_areas', 'label', 'Employee wellbeing — eight areas documented', 'met', jsonb_array_length(public._sipbp118_employee_wellbeing()->'areas') = 8, 'note', null),
    jsonb_build_object('key', 'alignment_dimensions', 'label', 'Purpose alignment — eight dimensions', 'met', jsonb_array_length(public._sipbp118_purpose_alignment_engine()->'dimensions') = 8, 'note', null),
    jsonb_build_object('key', 'impact_indicators', 'label', 'Impact tracking — nine indicators', 'met', jsonb_array_length(public._sipbp118_impact_tracking()->'indicators') = 9, 'note', null),
    jsonb_build_object('key', 'gp_participation', 'label', 'Growth Partner participation — seven types', 'met', jsonb_array_length(public._sipbp118_growth_partner_participation()->'participation_types') = 7, 'note', null),
    jsonb_build_object('key', 'community_programs', 'label', 'Community impact programs — six types', 'met', jsonb_array_length(public._sipbp118_community_impact_programs()->'program_types') = 6, 'note', null),
    jsonb_build_object('key', 'executive_monitors', 'label', 'Executive purpose dashboard — seven monitors', 'met', jsonb_array_length(public._sipbp118_executive_purpose_dashboard()->'monitors') = 7, 'note', null),
    jsonb_build_object('key', 'cross_links', 'label', 'Mandatory distinction cross-links documented', 'met', jsonb_array_length(public._sipbp118_cross_links()) >= 9, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._sipbp118_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics — eight documented', 'met', jsonb_array_length(public._sipbp118_success_metrics()) = 8, 'note', null),
    jsonb_build_object('key', 'limitation_principles', 'label', 'Limitation principles — no performative scoring', 'met', jsonb_array_length(public._sipbp118_limitation_principles()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'human_oversight', 'label', 'human_oversight_required default true', 'met', exists (select 1 from public.social_impact_purpose_settings s where s.tenant_id = p_tenant_id and s.human_oversight_required = true), 'note', null),
    jsonb_build_object('key', 'companion_adaptation', 'label', 'Companion adaptation — 🦉🌹🔔 examples', 'met', jsonb_array_length(public._sipbp118_companion_adaptation()->'examples') >= 3, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 118 baseline tables and RPCs', 'met', to_regclass('public.social_impact_purpose_settings') is not null, 'note', '_sipe_* helpers intact')
  );
end; $$;

create or replace function public._sipbp118_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 118 — Social Impact & Purpose Engine',
    'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE118_SOCIAL_IMPACT_PURPOSE.md',
    'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
    'route', '/app/social-impact-purpose-engine',
    'mapping_note', 'Purpose Center + Social Impact initiatives — Purpose & Values A.82 and Impact Engine A.85 remain authoritative.',
    'distinction_note', public._sipbp118_distinction_note(),
    'mission', public._sipbp118_mission(),
    'philosophy', public._sipbp118_philosophy(),
    'abos_principle', public._sipbp118_abos_principle(),
    'vision', public._sipbp118_vision(),
    'objectives', public._sipbp118_objectives(),
    'purpose_center', public._sipbp118_purpose_center(),
    'social_impact_initiatives', public._sipbp118_social_impact_initiatives(),
    'employee_wellbeing', public._sipbp118_employee_wellbeing(),
    'purpose_alignment_engine', public._sipbp118_purpose_alignment_engine(),
    'impact_tracking', public._sipbp118_impact_tracking(),
    'companion_responsibilities', public._sipbp118_companion_responsibilities(),
    'growth_partner_participation', public._sipbp118_growth_partner_participation(),
    'self_love_in_organizations', public._sipbp118_self_love_in_organizations(),
    'community_impact_programs', public._sipbp118_community_impact_programs(),
    'executive_purpose_dashboard', public._sipbp118_executive_purpose_dashboard(),
    'cross_links', public._sipbp118_cross_links(),
    'limitation_principles', public._sipbp118_limitation_principles(),
    'companion_adaptation', public._sipbp118_companion_adaptation(),
    'success_metrics', public._sipbp118_success_metrics(),
    'integration_links', public._sipbp118_integration_links(),
    'engagement_summary', public._sipbp118_engagement_summary(p_tenant_id),
    'privacy_note', 'Social Impact & Purpose blueprint data is metadata only — initiative summaries and cross-links. Humans define purpose.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_social_impact_purpose_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_impact_purpose_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sipe_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._sipe_ensure_settings(v_tenant_id);
  perform public._sipe_seed_initiatives(v_tenant_id);
  perform public._sipe_seed_commitments(v_tenant_id);
  perform public._sipe_seed_alignment_snapshots(v_tenant_id);
  perform public._sipe_seed_impact_indicators(v_tenant_id);
  v_metrics := public._sipe_refresh_metrics(v_tenant_id);
  v_engagement := public._sipbp118_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'active_initiatives', v_metrics->'active_initiatives',
    'active_commitments', v_metrics->'active_commitments',
    'avg_initiative_progress', v_metrics->'avg_initiative_progress',
    'philosophy', public._sipbp118_philosophy(),
    'human_oversight_required', v_settings.human_oversight_required,
    'implementation_blueprint_phase118', jsonb_build_object(
      'phase', 'Phase 118 — Social Impact & Purpose Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE118_SOCIAL_IMPACT_PURPOSE.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'mapping_note', 'Purpose Center + Social Impact — cross-link Purpose & Values and Impact Engine.'
    ),
    'social_impact_purpose_mission', public._sipbp118_mission(),
    'social_impact_purpose_abos_principle', public._sipbp118_abos_principle(),
    'social_impact_purpose_engagement_summary', v_engagement,
    'social_impact_purpose_note', 'Social Impact & Purpose Engine — Purpose is action not marketing. People First. Stewardship through responsibility.',
    'social_impact_purpose_vision_note', public._sipbp118_vision()
  );
end; $$;

create or replace function public.get_social_impact_purpose_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.social_impact_purpose_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._sipe_require_tenant());
  v_settings := public._sipe_ensure_settings(v_tenant_id);
  perform public._sipe_seed_initiatives(v_tenant_id);
  perform public._sipe_seed_commitments(v_tenant_id);
  perform public._sipe_seed_alignment_snapshots(v_tenant_id);
  perform public._sipe_seed_impact_indicators(v_tenant_id);
  v_metrics := public._sipe_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', v_settings.human_oversight_required,
    'enabled', v_settings.enabled,
    'purpose_visibility', v_settings.purpose_visibility,
    'wellbeing_programs_enabled', v_settings.wellbeing_programs_enabled,
    'community_programs_enabled', v_settings.community_programs_enabled,
    'philosophy', public._sipbp118_philosophy(),
    'safety_note', 'Social Impact & Purpose Engine — metadata-only initiatives. Purpose & Values A.82 and Impact Engine A.85 remain authoritative. Humans define purpose.',
    'active_initiatives', v_metrics->'active_initiatives',
    'active_commitments', v_metrics->'active_commitments',
    'avg_initiative_progress', v_metrics->'avg_initiative_progress',
    'total_participation', v_metrics->'total_participation',
    'alignment_snapshots', v_metrics->'alignment_snapshots',
    'impact_indicators_count', v_metrics->'impact_indicators',
    'initiatives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'initiative_key', i.initiative_key, 'initiative_type', i.initiative_type,
        'title', i.title, 'summary', i.summary, 'status', i.status,
        'progress_pct', i.progress_pct, 'participation_count', i.participation_count
      ) order by i.progress_pct desc)
      from public.social_impact_purpose_initiatives i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'commitments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'commitment_key', c.commitment_key, 'commitment_area', c.commitment_area,
        'title', c.title, 'summary', c.summary, 'status', c.status,
        'progress_pct', c.progress_pct, 'target_date', c.target_date
      ) order by c.progress_pct desc)
      from public.social_impact_purpose_commitments c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'alignment_snapshots_list', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alignment_dimension', a.alignment_dimension,
        'reflection_summary', a.reflection_summary, 'alignment_signal', a.alignment_signal,
        'confidence', a.confidence, 'captured_at', a.captured_at
      ) order by a.captured_at desc)
      from public.social_impact_purpose_alignment_snapshots a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'impact_indicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ind.id, 'indicator_key', ind.indicator_key, 'indicator_type', ind.indicator_type,
        'summary', ind.summary, 'trend_pct', ind.trend_pct, 'value_numeric', ind.value_numeric,
        'confidence', ind.confidence, 'captured_at', ind.captured_at
      ) order by ind.captured_at desc)
      from public.social_impact_purpose_impact_indicators ind where ind.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'initiative_type_scaffolds', public._sipe_initiative_type_scaffolds(),
    'integration_links', public._sipbp118_integration_links(),
    'implementation_blueprint_phase118', jsonb_build_object(
      'phase', 'Phase 118 — Social Impact & Purpose Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE118_SOCIAL_IMPACT_PURPOSE.md',
      'engine_phase', 'Repo Phase 118 Social Impact & Purpose Engine',
      'route', '/app/social-impact-purpose-engine',
      'mapping_note', 'Purpose Center + Social Impact — cross-link authoritative engines.'
    ),
    'social_impact_purpose_engine_note', 'Social Impact & Purpose Engine (ABOS Phase 118) — Purpose Center + social impact initiatives. Cross-link /app/purpose-values-engine and /app/impact-engine — do NOT duplicate.',
    'social_impact_purpose_blueprint', public._sipbp118_blueprint_block(v_tenant_id),
    'social_impact_purpose_distinction_note', public._sipbp118_distinction_note(),
    'social_impact_purpose_mission', public._sipbp118_mission(),
    'social_impact_purpose_philosophy', public._sipbp118_philosophy(),
    'social_impact_purpose_abos_principle', public._sipbp118_abos_principle(),
    'social_impact_purpose_objectives', public._sipbp118_objectives(),
    'purpose_center_meta', public._sipbp118_purpose_center(),
    'social_impact_initiatives_meta', public._sipbp118_social_impact_initiatives(),
    'employee_wellbeing_meta', public._sipbp118_employee_wellbeing(),
    'purpose_alignment_meta', public._sipbp118_purpose_alignment_engine(),
    'impact_tracking_meta', public._sipbp118_impact_tracking(),
    'companion_responsibilities_meta', public._sipbp118_companion_responsibilities(),
    'growth_partner_participation_meta', public._sipbp118_growth_partner_participation(),
    'self_love_in_organizations_meta', public._sipbp118_self_love_in_organizations(),
    'community_impact_programs_meta', public._sipbp118_community_impact_programs(),
    'executive_purpose_dashboard_meta', public._sipbp118_executive_purpose_dashboard(),
    'sipbp118_cross_links', public._sipbp118_cross_links(),
    'social_impact_purpose_limitation_principles', public._sipbp118_limitation_principles(),
    'social_impact_purpose_companion_adaptation', public._sipbp118_companion_adaptation(),
    'sipbp118_integration_links', public._sipbp118_integration_links(),
    'social_impact_purpose_engagement_summary', public._sipbp118_engagement_summary(v_tenant_id),
    'social_impact_purpose_success_criteria', public._sipbp118_success_criteria(v_tenant_id),
    'social_impact_purpose_success_metrics', public._sipbp118_success_metrics(),
    'social_impact_purpose_vision', public._sipbp118_vision(),
    'social_impact_purpose_privacy_note', 'Social Impact & Purpose metadata only — initiative summaries and aggregate indicators. No PII. Humans define purpose; Companions support action.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'social-impact-purpose-engine', 'Social Impact & Purpose Engine',
  'Purpose Center and social impact initiatives — stewardship through responsibility, not marketing.',
  'authenticated', 138
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'social-impact-purpose-engine' and tenant_id is null
);

grant execute on function public.get_social_impact_purpose_card(uuid) to authenticated;
grant execute on function public.get_social_impact_purpose_dashboard(uuid) to authenticated;
grant execute on function public._sipbp118_distinction_note() to authenticated;
grant execute on function public._sipbp118_mission() to authenticated;
grant execute on function public._sipbp118_philosophy() to authenticated;
grant execute on function public._sipbp118_abos_principle() to authenticated;
grant execute on function public._sipbp118_vision() to authenticated;
grant execute on function public._sipbp118_objectives() to authenticated;
grant execute on function public._sipbp118_purpose_center() to authenticated;
grant execute on function public._sipbp118_social_impact_initiatives() to authenticated;
grant execute on function public._sipbp118_employee_wellbeing() to authenticated;
grant execute on function public._sipbp118_purpose_alignment_engine() to authenticated;
grant execute on function public._sipbp118_impact_tracking() to authenticated;
grant execute on function public._sipbp118_companion_responsibilities() to authenticated;
grant execute on function public._sipbp118_growth_partner_participation() to authenticated;
grant execute on function public._sipbp118_self_love_in_organizations() to authenticated;
grant execute on function public._sipbp118_community_impact_programs() to authenticated;
grant execute on function public._sipbp118_executive_purpose_dashboard() to authenticated;
grant execute on function public._sipbp118_cross_links() to authenticated;
grant execute on function public._sipbp118_limitation_principles() to authenticated;
grant execute on function public._sipbp118_companion_adaptation() to authenticated;
grant execute on function public._sipbp118_success_metrics() to authenticated;
grant execute on function public._sipbp118_integration_links() to authenticated;
grant execute on function public._sipbp118_engagement_summary(uuid) to authenticated;
grant execute on function public._sipbp118_success_criteria(uuid) to authenticated;
grant execute on function public._sipbp118_blueprint_block(uuid) to authenticated;
