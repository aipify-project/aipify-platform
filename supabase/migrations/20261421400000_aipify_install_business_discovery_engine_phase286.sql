-- Phase 286 — Aipify Install & Business Discovery Engine
-- Feature owner: Customer App — /app/onboarding/aipify-install
-- Helpers: _abde_* (engine), _abdebp286_* (blueprint)
-- Extends Aipify Install Engine Phase A.22 and Phase 29 AI Install & Discovery
-- Does NOT modify get_aipify_install_engine_dashboard or run_install_discovery

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
    'aipify_status_institutional_memory_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'trust_center_foundation_engine',
    'continuous_improvement_engine', 'mentorship_engine',
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
    'audience_targeting_checkpoints_engine',
    'risk_center',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'human_approval_gates_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'relationship_intelligence_engine',
    'ethical_evolution_guardianship_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_mentorship_engine',
    'companion_identity_engine',
    'impact_engine',
    'guardianship_engine',
    'curiosity_discovery_engine',
    'wonder_engine',
    'ethical_evolution_guardianship_engine',
    'presence_comfort_protocol',
    'dedication_engine',
    'ethical_evolution_guardianship_engine',
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
    'legacy_engine',
    'civilizational_foresight_engine',
    'civilizational_coordination_engine',
    'shared_prosperity_engine',
    'constructive_dialogue_engine',
    'humanity_shared_compassion_reciprocal_care_engine',
    'humanity_shared_courage_responsible_action_engine',
    'humanity_shared_gratitude_appreciative_stewardship_engine',
    'humanity_shared_humility_continuous_renewal_engine',
    'humanity_shared_legacy_flourishing_engine',
    'human_hope_possibility_engine',
    'human_wonder_exploration_engine',
    'human_legacy_eternal_stewardship_engine',
    'universal_stewardship_shared_futures_engine',
    'humanity_collective_wisdom_shared_learning_engine',
    'humanity_shared_purpose_contribution_engine',
    'humanity_shared_resilience_adaptive_capacity_engine',
    'humanity_shared_trust_cooperative_intelligence_engine',
    'human_flourishing_engine',
    'multi_generational_futures_engine',
    'intergenerational_guardianship_engine',
    'human_identity_meaning_engine',
    'human_creativity_imagination_engine',
    'human_wisdom_augmented_judgment_engine',
    'human_agency_responsible_autonomy_engine',
    'human_dignity_humility_engine',
    'aipify_constitution_perpetual_principles_engine',
    'aipify_ethical_evolution_responsible_innovation_engine',
    'aipify_guardianship_succession_engine',
    'aipify_legacy_preservation_knowledge_continuity_engine',
    'aipify_values_transmission_cultural_continuity_engine',
    'aipify_principles_enforcement_engine',
    'aipify_decision_transparency_engine',
    'aipify_organizational_health_early_warning_engine',
    'aipify_audience_targeting_checkpoints_prioritization_engine',
    'aipify_digital_headquarters_engine',
    'aipify_knowledge_discovery_intelligent_search_engine',
    'aipify_risk_center_execution_engine',
    'aipify_decision_center_governance_engine',
    'aipify_operations_orchestration_engine',
    'aipify_resource_capacity_workload_balance_engine',
    'aipify_enterprise_organizational_consciousness_engine',
    'aipify_enterprise_printing_document_output_engine',
    'universal_action_access_framework',
    'aipify_enterprise_packaging_upgrade_instant_access_engine',
    'pilot_learning_customer_zero_engine',
    'aipify_install_business_discovery_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables (tenant-scoped via customers.id)
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_business_discovery_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  current_phase int not null default 1 check (current_phase between 1 and 7),
  overall_readiness text not null default 'not_ready' check (
    overall_readiness in ('not_ready', 'learning', 'partially_ready', 'ready_to_assist', 'ready_to_execute')
  ),
  discovery_active boolean not null default true,
  continuous_learning boolean not null default true,
  introduction_message text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_business_discovery_settings enable row level security;
revoke all on public.aipify_business_discovery_settings from authenticated, anon;

create table if not exists public.aipify_business_discovery_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  company_name text,
  industry text,
  company_size text,
  departments jsonb not null default '[]'::jsonb,
  countries jsonb not null default '[]'::jsonb,
  primary_language text,
  secondary_languages jsonb not null default '[]'::jsonb,
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_business_discovery_profiles enable row level security;
revoke all on public.aipify_business_discovery_profiles from authenticated, anon;

create table if not exists public.aipify_business_discovery_systems (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  system_key text not null,
  system_name text not null,
  system_type text not null check (
    system_type in ('crm', 'support', 'ecommerce', 'accounting', 'calendar', 'communication', 'knowledge', 'document', 'other')
  ),
  purpose text,
  access_level text not null default 'metadata_only' check (
    access_level in ('read', 'read_write', 'metadata_only')
  ),
  integration_status text not null default 'discovered' check (
    integration_status in ('pending', 'connected', 'discovered', 'unavailable')
  ),
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, system_key)
);
create index if not exists aipify_business_discovery_systems_tenant_idx
  on public.aipify_business_discovery_systems (tenant_id, system_type, integration_status);
alter table public.aipify_business_discovery_systems enable row level security;
revoke all on public.aipify_business_discovery_systems from authenticated, anon;

create table if not exists public.aipify_business_discovery_knowledge (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_key text not null,
  source_label text not null,
  source_type text not null check (
    source_type in ('faq', 'knowledge_center', 'documentation', 'policy', 'procedure', 'email_template', 'training')
  ),
  item_count int not null default 0,
  coverage_score int not null default 0 check (coverage_score between 0 and 100),
  status text not null default 'discovered' check (
    status in ('discovered', 'indexed', 'validated')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, source_key)
);
create index if not exists aipify_business_discovery_knowledge_tenant_idx
  on public.aipify_business_discovery_knowledge (tenant_id, source_type, status);
alter table public.aipify_business_discovery_knowledge enable row level security;
revoke all on public.aipify_business_discovery_knowledge from authenticated, anon;

create table if not exists public.aipify_business_discovery_workflows (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workflow_key text not null,
  workflow_name text not null,
  workflow_type text not null check (
    workflow_type in ('support', 'approval', 'sales', 'administrative', 'operational', 'escalation')
  ),
  trigger_event text,
  steps jsonb not null default '[]'::jsonb,
  decision_points jsonb not null default '[]'::jsonb,
  responsible_parties jsonb not null default '[]'::jsonb,
  automation_opportunity boolean not null default false,
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, workflow_key)
);
create index if not exists aipify_business_discovery_workflows_tenant_idx
  on public.aipify_business_discovery_workflows (tenant_id, workflow_type);
alter table public.aipify_business_discovery_workflows enable row level security;
revoke all on public.aipify_business_discovery_workflows from authenticated, anon;

create table if not exists public.aipify_business_discovery_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  action_label text not null,
  action_type text not null check (
    action_type in ('email', 'calendar', 'print', 'report', 'taxi', 'flowers', 'booking', 'workflow', 'other')
  ),
  permission_mapping text,
  approval_level int not null default 1 check (approval_level between 0 and 3),
  audit_required boolean not null default true,
  available boolean not null default false,
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);
create index if not exists aipify_business_discovery_actions_tenant_idx
  on public.aipify_business_discovery_actions (tenant_id, action_type, available);
alter table public.aipify_business_discovery_actions enable row level security;
revoke all on public.aipify_business_discovery_actions from authenticated, anon;

create table if not exists public.aipify_business_discovery_people (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  team_key text not null,
  team_name text not null,
  roles jsonb not null default '[]'::jsonb,
  leadership_structure jsonb not null default '{}'::jsonb,
  department_owner text,
  approval_authority boolean not null default false,
  metadata_only boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, team_key)
);
create index if not exists aipify_business_discovery_people_tenant_idx
  on public.aipify_business_discovery_people (tenant_id, team_key);
alter table public.aipify_business_discovery_people enable row level security;
revoke all on public.aipify_business_discovery_people from authenticated, anon;

create table if not exists public.aipify_business_discovery_readiness (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  companion_key text not null check (
    companion_key in (
      'support_companion', 'admin_companion', 'executive_companion',
      'workflow_automation', 'action_execution', 'knowledge_assistance'
    )
  ),
  readiness_state text not null default 'not_ready' check (
    readiness_state in ('not_ready', 'learning', 'partially_ready', 'ready_to_assist', 'ready_to_execute')
  ),
  confidence_score int not null default 0 check (confidence_score between 0 and 100),
  recommended_validation jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, companion_key)
);
create index if not exists aipify_business_discovery_readiness_tenant_idx
  on public.aipify_business_discovery_readiness (tenant_id, companion_key);
alter table public.aipify_business_discovery_readiness enable row level security;
revoke all on public.aipify_business_discovery_readiness from authenticated, anon;

create table if not exists public.aipify_business_discovery_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  discovery_phase int check (discovery_phase is null or discovery_phase between 1 and 7),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_business_discovery_audit_logs_tenant_idx
  on public.aipify_business_discovery_audit_logs (tenant_id, event_type, created_at desc);
alter table public.aipify_business_discovery_audit_logs enable row level security;
revoke all on public.aipify_business_discovery_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_install_business_discovery_engine', v.description
from (values
  ('business_discovery.view', 'View Business Discovery', 'View business discovery profile, systems, knowledge, workflows, and readiness'),
  ('business_discovery.manage', 'Manage Business Discovery', 'Update business discovery profile and discovery settings'),
  ('business_discovery.run', 'Run Business Discovery', 'Execute discovery phases and advance business learning')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_discovery.view'), ('owner', 'business_discovery.manage'), ('owner', 'business_discovery.run'),
  ('administrator', 'business_discovery.view'), ('administrator', 'business_discovery.manage'), ('administrator', 'business_discovery.run'),
  ('manager', 'business_discovery.view'), ('manager', 'business_discovery.run'),
  ('employee', 'business_discovery.view'),
  ('support_agent', 'business_discovery.view'),
  ('moderator', 'business_discovery.view'),
  ('viewer', 'business_discovery.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 3. Blueprint helpers — _abdebp286_*
-- ---------------------------------------------------------------------------
create or replace function public._abdebp286_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 286 — Aipify Install & Business Discovery Engine. Traditional software: you configure the software. Aipify: I will understand how your business works. Helpers _abdebp286_*.';
$$;

create or replace function public._abdebp286_install_philosophy() returns text language sql immutable as $$
  select 'Traditional software: You configure the software. Aipify: I will understand how your business works.';
$$;

create or replace function public._abdebp286_core_principle() returns text language sql immutable as $$
  select 'Do not force organizations to teach Aipify everything manually';
$$;

create or replace function public._abdebp286_continuous_learning() returns text language sql immutable as $$
  select 'Discovery is not a one-time event. Discovery is continuous.';
$$;

create or replace function public._abdebp286_discovery_phases() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('phase', 1, 'key', 'organization_profile', 'label', 'Organization Profile', 'description', 'Learn company structure, industry, size, languages, and departments.'),
    jsonb_build_object('phase', 2, 'key', 'system_discovery', 'label', 'System Discovery', 'description', 'Discover CRM, support, commerce, calendar, and communication systems.'),
    jsonb_build_object('phase', 3, 'key', 'knowledge_discovery', 'label', 'Knowledge Discovery', 'description', 'Map FAQ, documentation, policies, procedures, and training sources.'),
    jsonb_build_object('phase', 4, 'key', 'workflow_discovery', 'label', 'Workflow Discovery', 'description', 'Understand support, approval, sales, and operational workflows.'),
    jsonb_build_object('phase', 5, 'key', 'action_discovery', 'label', 'Action Discovery', 'description', 'Identify actions Aipify may prepare — email, calendar, print, reports, bookings.'),
    jsonb_build_object('phase', 6, 'key', 'people_discovery', 'label', 'People Discovery', 'description', 'Learn teams, roles, leadership structure, and approval authority — metadata only.'),
    jsonb_build_object('phase', 7, 'key', 'readiness_assessment', 'label', 'Readiness Assessment', 'description', 'Assess Companion readiness across support, admin, executive, workflow, and action domains.')
  );
$$;

create or replace function public._abdebp286_readiness_states() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'not_ready', 'label', 'Not Ready', 'description', 'Discovery has not started or insufficient metadata collected.'),
    jsonb_build_object('key', 'learning', 'label', 'Learning', 'description', 'Aipify is discovering systems, knowledge, workflows, and operational patterns.'),
    jsonb_build_object('key', 'partially_ready', 'label', 'Partially Ready', 'description', 'Core patterns mapped — human validation still required for most recommendations.'),
    jsonb_build_object('key', 'ready_to_assist', 'label', 'Ready to Assist', 'description', 'Companion can draft, recommend, and prepare actions with approval gates.'),
    jsonb_build_object('key', 'ready_to_execute', 'label', 'Ready to Execute', 'description', 'Limited governed execution available within approved action boundaries.')
  );
$$;

create or replace function public._abdebp286_introduction_message_template() returns text language sql immutable as $$
  select 'I am beginning to understand how your organization works. I will learn through approved access — you do not need to teach me everything manually. Discovery is continuous, and you remain in control at every step.';
$$;

create or replace function public._abdebp286_governance_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'approved_access_only', 'label', 'Approved access only', 'description', 'Discovery uses read-only or metadata-only access until explicitly approved.'),
      jsonb_build_object('key', 'human_validation', 'label', 'Human validation', 'description', 'Discovered patterns require validation before Companion activation.'),
      jsonb_build_object('key', 'audit_trail', 'label', 'Audit trail', 'description', 'Every discovery phase and profile update is logged — summaries max 500 chars.'),
      jsonb_build_object('key', 'metadata_only', 'label', 'Metadata only', 'description', 'No raw email, chat, orders, or PII stored in discovery tables.'),
      jsonb_build_object('key', 'permission_gates', 'label', 'Permission gates', 'description', 'business_discovery.view, .manage, and .run enforce RBAC per organization role.')
    ),
    'install_engine_link', '/app/install',
    'route', '/app/onboarding/aipify-install'
  );
$$;

create or replace function public._abdebp286_privacy_note() returns text language sql immutable as $$
  select 'Business Discovery stores metadata counts, workflow patterns, and readiness scores only — no raw customer email, chat, or order content.';
$$;

create or replace function public._abdebp286_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 286 — Aipify Install & Business Discovery Engine',
    'title', 'Aipify Install & Business Discovery Engine',
    'route', '/app/onboarding/aipify-install',
    'distinction_note', public._abdebp286_distinction_note(),
    'install_philosophy', public._abdebp286_install_philosophy(),
    'core_principle', public._abdebp286_core_principle(),
    'continuous_learning', public._abdebp286_continuous_learning(),
    'discovery_phases', public._abdebp286_discovery_phases(),
    'readiness_states', public._abdebp286_readiness_states(),
    'introduction_message_template', public._abdebp286_introduction_message_template(),
    'governance_requirements', public._abdebp286_governance_requirements(),
    'privacy_note', public._abdebp286_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine helpers — _abde_*
-- ---------------------------------------------------------------------------
create or replace function public._abde_tenant_for_auth() returns uuid
language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._abde_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._abde_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._abde_score_to_state(p_score int) returns text
language sql immutable as $$
  select case
    when p_score >= 85 then 'ready_to_execute'
    when p_score >= 65 then 'ready_to_assist'
    when p_score >= 40 then 'partially_ready'
    when p_score >= 15 then 'learning'
    else 'not_ready'
  end;
$$;

create or replace function public._abde_log_event(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text default null,
  p_discovery_phase int default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_business_discovery_audit_logs (
    tenant_id, event_type, discovery_phase, summary, context
  ) values (
    p_tenant_id, p_event_type, p_discovery_phase, left(p_summary, 500), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._abde_ensure_settings(p_tenant_id uuid)
returns public.aipify_business_discovery_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_business_discovery_settings;
begin
  insert into public.aipify_business_discovery_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.aipify_business_discovery_settings
  where tenant_id = p_tenant_id;

  return v_row;
end; $$;

create or replace function public._abde_settings_to_json(p_row public.aipify_business_discovery_settings)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'current_phase', p_row.current_phase,
    'overall_readiness', p_row.overall_readiness,
    'discovery_active', p_row.discovery_active,
    'continuous_learning', p_row.continuous_learning,
    'introduction_message', p_row.introduction_message,
    'metadata', p_row.metadata,
    'updated_at', p_row.updated_at
  );
$$;

create or replace function public._abde_introduction_message(p_tenant_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_org_name text;
  v_settings public.aipify_business_discovery_settings;
  v_profile public.aipify_business_discovery_profiles;
  v_system_count int;
  v_knowledge_items int;
begin
  select o.name into v_org_name from public.organizations o where o.id = p_tenant_id;
  select * into v_settings from public.aipify_business_discovery_settings where tenant_id = p_tenant_id;
  select * into v_profile from public.aipify_business_discovery_profiles where tenant_id = p_tenant_id;

  select count(*) into v_system_count from public.aipify_business_discovery_systems where tenant_id = p_tenant_id;
  select coalesce(sum(item_count), 0) into v_knowledge_items from public.aipify_business_discovery_knowledge where tenant_id = p_tenant_id;

  if v_settings.introduction_message is not null and length(trim(v_settings.introduction_message)) > 0 then
    return v_settings.introduction_message;
  end if;

  return format(
    '%s I am learning how %s operates — %s systems discovered, %s knowledge items mapped. Current phase %s of 7. Overall readiness: %s. %s',
    public._abdebp286_introduction_message_template(),
    coalesce(v_profile.company_name, v_org_name, 'your organization'),
    v_system_count,
    v_knowledge_items,
    coalesce(v_settings.current_phase, 1),
    replace(coalesce(v_settings.overall_readiness, 'not_ready'), '_', ' '),
    public._abdebp286_continuous_learning()
  );
end; $$;

create or replace function public._abde_seed_discovery_data(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_name text;
  v_seeded int := 0;
begin
  if exists (
    select 1 from public.aipify_business_discovery_systems where tenant_id = p_tenant_id limit 1
  ) then
    return jsonb_build_object('seeded', false, 'reason', 'already_populated');
  end if;

  select o.name into v_org_name from public.organizations o where o.id = p_tenant_id;

  insert into public.aipify_business_discovery_profiles (
    tenant_id, company_name, industry, company_size, departments, countries,
    primary_language, secondary_languages, confidence_score
  ) values (
    p_tenant_id,
    v_org_name,
    'operations',
    'small_team',
    '["Support","Operations","Administration"]'::jsonb,
    '["NO"]'::jsonb,
    'en',
    '["no"]'::jsonb,
    25
  ) on conflict (tenant_id) do nothing;

  insert into public.aipify_business_discovery_systems (
    tenant_id, system_key, system_name, system_type, purpose, access_level, integration_status, confidence_score
  )
  select p_tenant_id, v.system_key, v.system_name, v.system_type, v.purpose, v.access_level, v.integration_status, v.confidence_score
  from (values
    ('support_platform', 'Support Platform', 'support', 'Customer support tickets and escalation — metadata only', 'metadata_only', 'discovered', 35),
    ('knowledge_center', 'Knowledge Center', 'knowledge', 'FAQ and help articles for customer self-service', 'read', 'discovered', 40),
    ('email_system', 'Email & Communication', 'communication', 'Business email templates and notification channels', 'metadata_only', 'discovered', 30),
    ('calendar_system', 'Calendar & Scheduling', 'calendar', 'Meeting scheduling and operational calendars', 'read', 'pending', 20),
    ('commerce_platform', 'Commerce Platform', 'ecommerce', 'Product catalog and order workflow metadata', 'metadata_only', 'discovered', 28),
    ('document_store', 'Document Repository', 'document', 'Policies, procedures, and internal documentation', 'read', 'discovered', 32)
  ) as v(system_key, system_name, system_type, purpose, access_level, integration_status, confidence_score)
  on conflict (tenant_id, system_key) do nothing;
  get diagnostics v_seeded = row_count;

  insert into public.aipify_business_discovery_knowledge (
    tenant_id, source_key, source_label, source_type, item_count, coverage_score, status
  )
  select p_tenant_id, v.source_key, v.source_label, v.source_type, v.item_count, v.coverage_score, v.status
  from (values
    ('faq_articles', 'FAQ Articles', 'faq', 120, 35, 'discovered'),
    ('help_center', 'Help Center', 'knowledge_center', 45, 30, 'discovered'),
    ('support_policies', 'Support Policies', 'policy', 12, 25, 'discovered'),
    ('email_templates', 'Email Templates', 'email_template', 18, 20, 'discovered'),
    ('onboarding_docs', 'Onboarding Documentation', 'documentation', 8, 15, 'discovered'),
    ('training_guides', 'Training Guides', 'training', 6, 10, 'discovered')
  ) as v(source_key, source_label, source_type, item_count, coverage_score, status)
  on conflict (tenant_id, source_key) do nothing;

  insert into public.aipify_business_discovery_workflows (
    tenant_id, workflow_key, workflow_name, workflow_type, trigger_event,
    steps, decision_points, responsible_parties, automation_opportunity, confidence_score
  )
  select p_tenant_id, v.workflow_key, v.workflow_name, v.workflow_type, v.trigger_event,
    v.steps, v.decision_points, v.responsible_parties, v.automation_opportunity, v.confidence_score
  from (values
    ('support_triage', 'Support Triage', 'support', 'new_ticket_received',
      '[{"step":1,"label":"Categorize ticket"},{"step":2,"label":"Check knowledge base"},{"step":3,"label":"Draft or escalate"}]'::jsonb,
      '[{"point":"escalation_threshold","label":"Escalate when confidence low"}]'::jsonb,
      '[{"role":"support_agent","label":"Support Agent"}]'::jsonb, true, 30),
    ('approval_workflow', 'Action Approval', 'approval', 'action_requested',
      '[{"step":1,"label":"Prepare action"},{"step":2,"label":"Request approval"},{"step":3,"label":"Execute or reject"}]'::jsonb,
      '[{"point":"approval_level","label":"Risk-based approval level"}]'::jsonb,
      '[{"role":"administrator","label":"Administrator"}]'::jsonb, false, 22),
    ('onboarding_flow', 'Customer Onboarding', 'operational', 'new_customer_signup',
      '[{"step":1,"label":"Welcome email"},{"step":2,"label":"Setup checklist"},{"step":3,"label":"First-week check-in"}]'::jsonb,
      '[]'::jsonb, '[{"role":"customer_success","label":"Customer Success"}]'::jsonb, true, 18)
  ) as v(workflow_key, workflow_name, workflow_type, trigger_event, steps, decision_points, responsible_parties, automation_opportunity, confidence_score)
  on conflict (tenant_id, workflow_key) do nothing;

  insert into public.aipify_business_discovery_actions (
    tenant_id, action_key, action_label, action_type, permission_mapping, approval_level, audit_required, available, confidence_score
  )
  select p_tenant_id, v.action_key, v.action_label, v.action_type, v.permission_mapping, v.approval_level, v.audit_required, v.available, v.confidence_score
  from (values
    ('draft_email', 'Draft Email Response', 'email', 'business_discovery.run', 1, true, false, 25),
    ('schedule_meeting', 'Schedule Meeting', 'calendar', 'business_discovery.run', 1, true, false, 20),
    ('print_document', 'Print Document', 'print', 'business_discovery.run', 2, true, false, 15),
    ('generate_report', 'Generate Report', 'report', 'business_discovery.view', 1, true, false, 18),
    ('book_taxi', 'Book Taxi', 'taxi', 'uaaf.execute', 3, true, false, 5),
    ('send_flowers', 'Send Flowers', 'flowers', 'uaaf.execute', 3, true, false, 5),
    ('trigger_workflow', 'Trigger Workflow', 'workflow', 'business_discovery.run', 2, true, false, 12)
  ) as v(action_key, action_label, action_type, permission_mapping, approval_level, audit_required, available, confidence_score)
  on conflict (tenant_id, action_key) do nothing;

  insert into public.aipify_business_discovery_people (
    tenant_id, team_key, team_name, roles, leadership_structure, department_owner, approval_authority, metadata_only
  )
  select p_tenant_id, v.team_key, v.team_name, v.roles, v.leadership_structure, v.department_owner, v.approval_authority, true
  from (values
    ('support_team', 'Support Team', '["Support Agent","Team Lead"]'::jsonb, '{"lead":"Team Lead"}'::jsonb, 'Support Lead', false),
    ('admin_team', 'Administration', '["Administrator","Operations Manager"]'::jsonb, '{"lead":"Administrator"}'::jsonb, 'Administrator', true),
    ('executive_team', 'Executive', '["Owner","Executive"]'::jsonb, '{"lead":"Owner"}'::jsonb, 'Owner', true)
  ) as v(team_key, team_name, roles, leadership_structure, department_owner, approval_authority)
  on conflict (tenant_id, team_key) do nothing;

  insert into public.aipify_business_discovery_readiness (
    tenant_id, companion_key, readiness_state, confidence_score, recommended_validation
  )
  select p_tenant_id, v.companion_key, public._abde_score_to_state(v.confidence_score), v.confidence_score, v.recommended_validation
  from (values
    ('support_companion', 28, '["Validate FAQ coverage","Confirm escalation paths"]'::jsonb),
    ('admin_companion', 22, '["Review permission mappings","Confirm approval workflows"]'::jsonb),
    ('executive_companion', 15, '["Validate executive briefing sources"]'::jsonb),
    ('workflow_automation', 18, '["Human validation for each workflow"]'::jsonb),
    ('action_execution', 10, '["Enable actions incrementally with approval gates"]'::jsonb),
    ('knowledge_assistance', 32, '["Index knowledge sources before activation"]'::jsonb)
  ) as v(companion_key, confidence_score, recommended_validation)
  on conflict (tenant_id, companion_key) do nothing;

  perform public._abde_log_event(
    p_tenant_id, 'discovery_seeded',
    format('Seeded illustrative business discovery data for %s', coalesce(v_org_name, 'tenant')),
    1,
    jsonb_build_object('systems_seeded', v_seeded)
  );

  return jsonb_build_object('seeded', true, 'systems_seeded', v_seeded);
end; $$;

create or replace function public._abde_sync_from_install_discovery(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_install public.organization_installations;
  v_synced_systems int := 0;
  v_synced_workflows int := 0;
  v_synced_people int := 0;
  v_synced_knowledge int := 0;
begin
  select * into v_install
  from public.organization_installations
  where organization_id = p_tenant_id;

  if v_install.id is null then
    return jsonb_build_object('synced', false, 'reason', 'no_installation');
  end if;

  insert into public.aipify_business_discovery_systems (
    tenant_id, system_key, system_name, system_type, purpose, access_level, integration_status, confidence_score
  )
  select
    p_tenant_id,
    d.entity_key,
    coalesce(d.entity_label, d.entity_key),
    case d.discovery_type
      when 'integration' then 'other'
      when 'capability' then 'other'
      when 'platform' then 'other'
      else 'other'
    end,
    coalesce(d.metadata->>'purpose', 'Synced from Install Engine discovery'),
    'metadata_only',
    case d.status
      when 'confirmed' then 'connected'
      else 'discovered'
    end,
    d.confidence_score
  from public.install_discovery_results d
  where d.installation_id = v_install.id
    and d.discovery_type in ('integration', 'capability', 'platform')
  on conflict (tenant_id, system_key) do update set
    system_name = excluded.system_name,
    confidence_score = greatest(public.aipify_business_discovery_systems.confidence_score, excluded.confidence_score),
    integration_status = excluded.integration_status,
    updated_at = now();
  get diagnostics v_synced_systems = row_count;

  insert into public.aipify_business_discovery_workflows (
    tenant_id, workflow_key, workflow_name, workflow_type, trigger_event, confidence_score
  )
  select
    p_tenant_id,
    d.entity_key,
    coalesce(d.entity_label, d.entity_key),
    'operational',
    coalesce(d.metadata->>'trigger', 'discovered_from_install'),
    d.confidence_score
  from public.install_discovery_results d
  where d.installation_id = v_install.id
    and d.discovery_type = 'workflow'
  on conflict (tenant_id, workflow_key) do update set
    workflow_name = excluded.workflow_name,
    confidence_score = greatest(public.aipify_business_discovery_workflows.confidence_score, excluded.confidence_score),
    updated_at = now();
  get diagnostics v_synced_workflows = row_count;

  insert into public.aipify_business_discovery_people (
    tenant_id, team_key, team_name, roles, metadata_only
  )
  select
    p_tenant_id,
    d.entity_key,
    coalesce(d.entity_label, d.entity_key),
    coalesce(d.metadata->'roles', '[]'::jsonb),
    true
  from public.install_discovery_results d
  where d.installation_id = v_install.id
    and d.discovery_type = 'role'
  on conflict (tenant_id, team_key) do update set
    team_name = excluded.team_name,
    roles = excluded.roles,
    updated_at = now();
  get diagnostics v_synced_people = row_count;

  update public.aipify_business_discovery_knowledge k set
    item_count = greatest(k.item_count, sub.cnt),
    coverage_score = least(100, k.coverage_score + 5),
    status = case when k.status = 'discovered' and sub.cnt > 0 then 'indexed' else k.status end,
    updated_at = now()
  from (
    select count(*)::int as cnt
    from public.install_discovery_results d
    where d.installation_id = v_install.id
  ) sub
  where k.tenant_id = p_tenant_id;

  get diagnostics v_synced_knowledge = row_count;

  if v_synced_systems + v_synced_workflows + v_synced_people > 0 then
    perform public._abde_log_event(
      p_tenant_id, 'install_discovery_synced',
      format('Synced %s systems, %s workflows, %s teams from Install Engine', v_synced_systems, v_synced_workflows, v_synced_people),
      null,
      jsonb_build_object(
        'installation_id', v_install.id,
        'systems', v_synced_systems,
        'workflows', v_synced_workflows,
        'people', v_synced_people,
        'knowledge_updated', v_synced_knowledge
      )
    );
  end if;

  return jsonb_build_object(
    'synced', true,
    'installation_id', v_install.id,
    'systems', v_synced_systems,
    'workflows', v_synced_workflows,
    'people', v_synced_people,
    'knowledge_updated', v_synced_knowledge
  );
end; $$;

create or replace function public._abde_run_phase_discovery(p_tenant_id uuid, p_phase int)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.aipify_business_discovery_settings;
  v_new_phase int;
  v_boost int;
begin
  if p_phase < 1 or p_phase > 7 then
    raise exception 'Discovery phase must be between 1 and 7';
  end if;

  v_settings := public._abde_ensure_settings(p_tenant_id);
  v_new_phase := greatest(v_settings.current_phase, p_phase);

  v_boost := case p_phase
    when 1 then 8
    when 2 then 10
    when 3 then 12
    when 4 then 10
    when 5 then 8
    when 6 then 8
    when 7 then 15
    else 5
  end;

  case p_phase
    when 1 then
      update public.aipify_business_discovery_profiles set
        confidence_score = least(100, confidence_score + v_boost),
        updated_at = now()
      where tenant_id = p_tenant_id;
    when 2 then
      update public.aipify_business_discovery_systems set
        confidence_score = least(100, confidence_score + v_boost),
        integration_status = case when integration_status = 'pending' then 'discovered' else integration_status end,
        updated_at = now()
      where tenant_id = p_tenant_id;
    when 3 then
      update public.aipify_business_discovery_knowledge set
        coverage_score = least(100, coverage_score + v_boost),
        status = case when status = 'discovered' then 'indexed' else status end,
        updated_at = now()
      where tenant_id = p_tenant_id;
    when 4 then
      update public.aipify_business_discovery_workflows set
        confidence_score = least(100, confidence_score + v_boost),
        updated_at = now()
      where tenant_id = p_tenant_id;
    when 5 then
      update public.aipify_business_discovery_actions set
        confidence_score = least(100, confidence_score + v_boost),
        updated_at = now()
      where tenant_id = p_tenant_id;
    when 6 then
      update public.aipify_business_discovery_people set updated_at = now()
      where tenant_id = p_tenant_id;
    when 7 then
      update public.aipify_business_discovery_readiness set
        confidence_score = least(100, confidence_score + v_boost),
        readiness_state = public._abde_score_to_state(least(100, confidence_score + v_boost)),
        updated_at = now()
      where tenant_id = p_tenant_id;
    else null;
  end case;

  update public.aipify_business_discovery_settings set
    current_phase = v_new_phase,
    overall_readiness = case
      when v_new_phase >= 7 then coalesce(overall_readiness, 'learning')
      when v_new_phase >= 4 then 'learning'
      else coalesce(overall_readiness, 'not_ready')
    end,
    updated_at = now()
  where tenant_id = p_tenant_id
  returning * into v_settings;

  perform public._abde_compute_overall_readiness(p_tenant_id);

  perform public._abde_log_event(
    p_tenant_id, 'phase_discovery_run',
    format('Discovery phase %s completed — advanced to phase %s', p_phase, v_new_phase),
    p_phase,
    jsonb_build_object('requested_phase', p_phase, 'current_phase', v_new_phase, 'boost', v_boost)
  );

  select * into v_settings from public.aipify_business_discovery_settings where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'phase', p_phase,
    'current_phase', v_settings.current_phase,
    'overall_readiness', v_settings.overall_readiness,
    'introduction_message', public._abde_introduction_message(p_tenant_id)
  );
end; $$;

create or replace function public._abde_compute_overall_readiness(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_avg_score numeric;
  v_state text;
  v_settings public.aipify_business_discovery_settings;
  v_profile_score int;
  v_system_avg numeric;
  v_knowledge_avg numeric;
  v_workflow_avg numeric;
  v_action_avg numeric;
  v_readiness_avg numeric;
begin
  select coalesce(avg(confidence_score), 0) into v_readiness_avg
  from public.aipify_business_discovery_readiness where tenant_id = p_tenant_id;

  select coalesce(confidence_score, 0) into v_profile_score
  from public.aipify_business_discovery_profiles where tenant_id = p_tenant_id;

  select coalesce(avg(confidence_score), 0) into v_system_avg
  from public.aipify_business_discovery_systems where tenant_id = p_tenant_id;

  select coalesce(avg(coverage_score), 0) into v_knowledge_avg
  from public.aipify_business_discovery_knowledge where tenant_id = p_tenant_id;

  select coalesce(avg(confidence_score), 0) into v_workflow_avg
  from public.aipify_business_discovery_workflows where tenant_id = p_tenant_id;

  select coalesce(avg(confidence_score), 0) into v_action_avg
  from public.aipify_business_discovery_actions where tenant_id = p_tenant_id;

  v_avg_score := (
    coalesce(v_profile_score, 0) +
    coalesce(v_system_avg, 0) +
    coalesce(v_knowledge_avg, 0) +
    coalesce(v_workflow_avg, 0) +
    coalesce(v_action_avg, 0) +
    coalesce(v_readiness_avg, 0)
  ) / 6.0;

  v_state := public._abde_score_to_state(round(v_avg_score)::int);

  update public.aipify_business_discovery_settings set
    overall_readiness = v_state,
    updated_at = now()
  where tenant_id = p_tenant_id
  returning * into v_settings;

  return jsonb_build_object(
    'average_score', round(v_avg_score, 1),
    'overall_readiness', v_state,
    'profile_score', v_profile_score,
    'systems_avg', round(v_system_avg, 1),
    'knowledge_avg', round(v_knowledge_avg, 1),
    'workflows_avg', round(v_workflow_avg, 1),
    'actions_avg', round(v_action_avg, 1),
    'readiness_avg', round(v_readiness_avg, 1)
  );
end; $$;

create or replace function public._abde_build_recommendations(p_tenant_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(rec order by rec->>'priority'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'key', 'complete_profile',
      'message', 'Validate your organization profile — industry, size, and primary language help Aipify tailor discovery.',
      'priority', 1
    ) as rec
    where exists (
      select 1 from public.aipify_business_discovery_profiles p
      where p.tenant_id = p_tenant_id and p.confidence_score < 40
    )
    union all
    select jsonb_build_object(
      'key', 'connect_systems',
      'message', 'Connect discovered systems through the Install Engine — read-only access enables deeper learning without manual configuration.',
      'priority', 2
    )
    where exists (
      select 1 from public.aipify_business_discovery_systems s
      where s.tenant_id = p_tenant_id and s.integration_status in ('discovered', 'pending')
    )
    union all
    select jsonb_build_object(
      'key', 'index_knowledge',
      'message', 'Index knowledge sources before enabling Support Companion — FAQ and documentation coverage improves recommendation quality.',
      'priority', 3
    )
    where exists (
      select 1 from public.aipify_business_discovery_knowledge k
      where k.tenant_id = p_tenant_id and k.status = 'discovered'
    )
    union all
    select jsonb_build_object(
      'key', 'validate_workflows',
      'message', 'Review discovered workflows with your team — human validation is required before automation suggestions.',
      'priority', 4
    )
    where exists (
      select 1 from public.aipify_business_discovery_workflows w
      where w.tenant_id = p_tenant_id and w.automation_opportunity = true and w.confidence_score < 50
    )
    union all
    select jsonb_build_object(
      'key', 'enable_support_companion',
      'message', 'Support Companion readiness is improving — enable assisted mode with approval gates when knowledge coverage reaches 50%.',
      'priority', 5
    )
    where exists (
      select 1 from public.aipify_business_discovery_readiness r
      where r.tenant_id = p_tenant_id and r.companion_key = 'support_companion'
        and r.readiness_state in ('partially_ready', 'ready_to_assist')
    )
    union all
    select jsonb_build_object(
      'key', 'advance_discovery_phase',
      'message', format('Continue discovery — you are on phase %s of 7. Run the next phase to deepen operational understanding.', s.current_phase),
      'priority', 6
    )
    from public.aipify_business_discovery_settings s
    where s.tenant_id = p_tenant_id and s.current_phase < 7
    union all
    select jsonb_build_object(
      'key', 'install_engine_link',
      'message', 'Use the Aipify Install Engine for guided system connection, permission review, and environment discovery.',
      'priority', 7
    )
    where exists (
      select 1 from public.organization_installations i
      where i.organization_id = p_tenant_id
        and i.installation_status in ('pending', 'in_progress')
    )
  ) recommendations;
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_business_discovery_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_business_discovery_settings;
  v_readiness jsonb;
  v_seed jsonb;
  v_sync jsonb;
  v_install public.organization_installations;
begin
  v_tenant_id := coalesce(p_org_id, public._abde_require_tenant());
  perform public._irp_require_permission('business_discovery.view', v_tenant_id);

  v_settings := public._abde_ensure_settings(v_tenant_id);

  if not exists (select 1 from public.aipify_business_discovery_systems where tenant_id = v_tenant_id limit 1) then
    v_seed := public._abde_seed_discovery_data(v_tenant_id);
  end if;

  v_sync := public._abde_sync_from_install_discovery(v_tenant_id);
  v_readiness := public._abde_compute_overall_readiness(v_tenant_id);

  select * into v_settings from public.aipify_business_discovery_settings where tenant_id = v_tenant_id;
  select * into v_install from public.organization_installations where organization_id = v_tenant_id;

  perform public._abde_log_event(
    v_tenant_id, 'center_viewed', 'Business Discovery center accessed',
    v_settings.current_phase,
    jsonb_build_object('overall_readiness', v_settings.overall_readiness, 'seed', v_seed, 'sync', v_sync)
  );

  return jsonb_build_object(
    'tenant_id', v_tenant_id,
    'settings', public._abde_settings_to_json(v_settings),
    'current_phase', v_settings.current_phase,
    'overall_readiness', v_settings.overall_readiness,
    'introduction_message', public._abde_introduction_message(v_tenant_id),
    'profile', (
      select jsonb_build_object(
        'company_name', p.company_name,
        'industry', p.industry,
        'company_size', p.company_size,
        'departments', p.departments,
        'countries', p.countries,
        'primary_language', p.primary_language,
        'secondary_languages', p.secondary_languages,
        'confidence_score', p.confidence_score
      )
      from public.aipify_business_discovery_profiles p
      where p.tenant_id = v_tenant_id
    ),
    'systems', coalesce((
      select jsonb_agg(jsonb_build_object(
        'system_key', s.system_key,
        'system_name', s.system_name,
        'system_type', s.system_type,
        'purpose', s.purpose,
        'access_level', s.access_level,
        'integration_status', s.integration_status,
        'confidence_score', s.confidence_score
      ) order by s.confidence_score desc, s.system_name)
      from public.aipify_business_discovery_systems s
      where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'knowledge_sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'source_key', k.source_key,
        'source_label', k.source_label,
        'source_type', k.source_type,
        'item_count', k.item_count,
        'coverage_score', k.coverage_score,
        'status', k.status
      ) order by k.item_count desc, k.source_label)
      from public.aipify_business_discovery_knowledge k
      where k.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'workflows', coalesce((
      select jsonb_agg(jsonb_build_object(
        'workflow_key', w.workflow_key,
        'workflow_name', w.workflow_name,
        'workflow_type', w.workflow_type,
        'trigger_event', w.trigger_event,
        'steps', w.steps,
        'decision_points', w.decision_points,
        'responsible_parties', w.responsible_parties,
        'automation_opportunity', w.automation_opportunity,
        'confidence_score', w.confidence_score
      ) order by w.confidence_score desc, w.workflow_name)
      from public.aipify_business_discovery_workflows w
      where w.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action_key', a.action_key,
        'action_label', a.action_label,
        'action_type', a.action_type,
        'permission_mapping', a.permission_mapping,
        'approval_level', a.approval_level,
        'audit_required', a.audit_required,
        'available', a.available,
        'confidence_score', a.confidence_score
      ) order by a.confidence_score desc, a.action_label)
      from public.aipify_business_discovery_actions a
      where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'people', coalesce((
      select jsonb_agg(jsonb_build_object(
        'team_key', p.team_key,
        'team_name', p.team_name,
        'roles', p.roles,
        'leadership_structure', p.leadership_structure,
        'department_owner', p.department_owner,
        'approval_authority', p.approval_authority,
        'metadata_only', p.metadata_only
      ) order by p.team_name)
      from public.aipify_business_discovery_people p
      where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'readiness_assessment', coalesce((
      select jsonb_agg(jsonb_build_object(
        'companion_key', r.companion_key,
        'readiness_state', r.readiness_state,
        'confidence_score', r.confidence_score,
        'recommended_validation', r.recommended_validation
      ) order by r.confidence_score desc, r.companion_key)
      from public.aipify_business_discovery_readiness r
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'confidence_scores', v_readiness,
    'recommendations', public._abde_build_recommendations(v_tenant_id),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'event_type', a.event_type,
        'discovery_phase', a.discovery_phase,
        'summary', a.summary,
        'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.aipify_business_discovery_audit_logs
        where tenant_id = v_tenant_id
        order by created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'blueprint', public._abdebp286_blueprint_summary(),
    'install_engine', jsonb_build_object(
      'has_installation', v_install.id is not null,
      'installation_status', v_install.installation_status,
      'current_step', v_install.current_step,
      'completion_percentage', v_install.completion_percentage,
      'discovery_count', coalesce((
        select count(*) from public.install_discovery_results d
        where d.installation_id = v_install.id
      ), 0),
      'sync', v_sync
    ),
    'links', jsonb_build_object(
      'business_discovery', '/app/onboarding/aipify-install',
      'install_engine', '/app/install',
      'install_dashboard_rpc', 'get_aipify_install_engine_dashboard',
      'integration_engine', '/app/integration-engine'
    ),
    'privacy_note', public._abdebp286_privacy_note(),
    'can_manage', public._irp_has_permission('business_discovery.manage', v_tenant_id),
    'can_run', public._irp_has_permission('business_discovery.run', v_tenant_id)
  );
end; $$;

create or replace function public.run_business_discovery_phase(p_phase int, p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._abde_require_tenant());
  perform public._irp_require_permission('business_discovery.run', v_tenant_id);
  perform public._abde_ensure_settings(v_tenant_id);
  return public._abde_run_phase_discovery(v_tenant_id, p_phase);
end; $$;

create or replace function public.update_business_discovery_profile(p_payload jsonb, p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_profile public.aipify_business_discovery_profiles;
begin
  v_tenant_id := coalesce(p_org_id, public._abde_require_tenant());
  perform public._irp_require_permission('business_discovery.manage', v_tenant_id);
  perform public._abde_ensure_settings(v_tenant_id);

  insert into public.aipify_business_discovery_profiles (tenant_id)
  values (v_tenant_id)
  on conflict (tenant_id) do nothing;

  update public.aipify_business_discovery_profiles set
    company_name = coalesce(p_payload->>'company_name', company_name),
    industry = coalesce(p_payload->>'industry', industry),
    company_size = coalesce(p_payload->>'company_size', company_size),
    departments = coalesce(p_payload->'departments', departments),
    countries = coalesce(p_payload->'countries', countries),
    primary_language = coalesce(p_payload->>'primary_language', primary_language),
    secondary_languages = coalesce(p_payload->'secondary_languages', secondary_languages),
    confidence_score = least(100, confidence_score + 10),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_profile;

  if p_payload ? 'discovery_active' or p_payload ? 'continuous_learning' then
    update public.aipify_business_discovery_settings set
      discovery_active = coalesce((p_payload->>'discovery_active')::boolean, discovery_active),
      continuous_learning = coalesce((p_payload->>'continuous_learning')::boolean, continuous_learning),
      updated_at = now()
    where tenant_id = v_tenant_id;
  end if;

  perform public._abde_compute_overall_readiness(v_tenant_id);

  perform public._abde_log_event(
    v_tenant_id, 'profile_updated',
    'Business discovery profile updated',
    1,
    jsonb_build_object('company_name', v_profile.company_name, 'industry', v_profile.industry)
  );

  return jsonb_build_object(
    'profile', jsonb_build_object(
      'company_name', v_profile.company_name,
      'industry', v_profile.industry,
      'company_size', v_profile.company_size,
      'departments', v_profile.departments,
      'countries', v_profile.countries,
      'primary_language', v_profile.primary_language,
      'secondary_languages', v_profile.secondary_languages,
      'confidence_score', v_profile.confidence_score
    ),
    'introduction_message', public._abde_introduction_message(v_tenant_id)
  );
end; $$;

create or replace function public.record_business_discovery_event(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_event_type text;
  v_id uuid;
begin
  v_tenant_id := coalesce(nullif(p_payload->>'org_id', '')::uuid, public._abde_require_tenant());
  perform public._irp_require_permission('business_discovery.view', v_tenant_id);

  v_event_type := coalesce(p_payload->>'event_type', 'custom_event');
  if v_event_type = '' then
    raise exception 'event_type required';
  end if;

  v_id := public._abde_log_event(
    v_tenant_id,
    v_event_type,
    coalesce(p_payload->>'summary', 'Business discovery event recorded'),
    nullif(p_payload->>'discovery_phase', '')::int,
    coalesce(p_payload->'context', '{}'::jsonb)
  );

  return jsonb_build_object('id', v_id, 'recorded', true, 'event_type', v_event_type);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Knowledge category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select
  'aipify-install-business-discovery-engine',
  'Aipify Install & Business Discovery Engine',
  'Guided business discovery during Aipify Install — learn how your organization works without manual configuration. Customer App at /app/onboarding/aipify-install.',
  'authenticated',
  286
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'aipify-install-business-discovery-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 7. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_aipify_business_discovery_center(uuid) to authenticated;
grant execute on function public.run_business_discovery_phase(int, uuid) to authenticated;
grant execute on function public.update_business_discovery_profile(jsonb, uuid) to authenticated;
grant execute on function public.record_business_discovery_event(jsonb) to authenticated;
