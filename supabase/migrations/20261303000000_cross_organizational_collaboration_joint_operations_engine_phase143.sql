-- Phase 143 — Cross-Organizational Collaboration & Joint Operations Engine
-- Global Intelligence & Interorganizational Era (141–150).
-- Distinct from Organization & Workspace Engine A.75 (/app/organization-workspace-engine — cross-link only).
-- Helpers: _cojo_* (engine), _cojobp143_* (blueprint — never collide with _owe_*)

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
    'joint_operations'
  )
);

-- ---------------------------------------------------------------------------
-- 1. joint_operations_settings
-- ---------------------------------------------------------------------------
create table if not exists public.joint_operations_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default false,
  default_governance_tier text not null default 'standard' check (
    default_governance_tier in ('standard', 'elevated', 'executive')
  ),
  collaboration_preferences jsonb not null default '{}'::jsonb,
  participation_opt_in_required boolean not null default true,
  executive_approval_required boolean not null default true,
  visibility_defaults jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.joint_operations_settings enable row level security;
revoke all on public.joint_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. joint_operations_partnerships
-- ---------------------------------------------------------------------------
create table if not exists public.joint_operations_partnerships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  partnership_key text not null,
  partner_type text not null check (
    partner_type in ('growth_partner', 'organization', 'consultant', 'supplier', 'advisory')
  ),
  partner_org_id uuid,
  partner_display_name text not null,
  status text not null default 'pending' check (
    status in ('pending', 'proposed', 'active', 'paused', 'ended', 'rejected')
  ),
  governance_tier text not null default 'standard' check (
    governance_tier in ('standard', 'elevated', 'executive')
  ),
  participation_agreement jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, partnership_key)
);

create index if not exists joint_operations_partnerships_tenant_idx
  on public.joint_operations_partnerships (tenant_id, status, created_at desc);

alter table public.joint_operations_partnerships enable row level security;
revoke all on public.joint_operations_partnerships from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. joint_operations_shared_workspaces
-- ---------------------------------------------------------------------------
create table if not exists public.joint_operations_shared_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_tenant_id uuid not null references public.customers (id) on delete cascade,
  workspace_key text not null,
  title text not null,
  status text not null default 'draft' check (
    status in ('draft', 'pending_approval', 'active', 'paused', 'archived')
  ),
  access_model jsonb not null default '{}'::jsonb,
  participating_org_ids uuid[] not null default '{}'::uuid[],
  governance_tier text not null default 'standard' check (
    governance_tier in ('standard', 'elevated', 'executive')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_tenant_id, workspace_key)
);

create index if not exists joint_operations_shared_workspaces_owner_idx
  on public.joint_operations_shared_workspaces (owner_tenant_id, status, created_at desc);

create index if not exists joint_operations_shared_workspaces_participants_idx
  on public.joint_operations_shared_workspaces using gin (participating_org_ids);

alter table public.joint_operations_shared_workspaces enable row level security;
revoke all on public.joint_operations_shared_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. joint_operations_shared_objectives
-- ---------------------------------------------------------------------------
create table if not exists public.joint_operations_shared_objectives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  workspace_id uuid references public.joint_operations_shared_workspaces (id) on delete set null,
  objective_key text not null,
  title text not null,
  outcome_summary text check (char_length(outcome_summary) <= 500),
  metrics_summary jsonb not null default '{}'::jsonb,
  time_horizon text check (
    time_horizon in ('short_term', 'medium_term', 'long_term')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'achieved', 'paused', 'archived')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, objective_key)
);

create index if not exists joint_operations_shared_objectives_tenant_idx
  on public.joint_operations_shared_objectives (tenant_id, status, created_at desc);

alter table public.joint_operations_shared_objectives enable row level security;
revoke all on public.joint_operations_shared_objectives from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. joint_operations_collaboration_audit_logs
-- ---------------------------------------------------------------------------
create table if not exists public.joint_operations_collaboration_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.joint_operations_collaboration_audit_logs enable row level security;
revoke all on public.joint_operations_collaboration_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'joint_operations_engine', v.description
from (values
  ('joint_operations.view', 'View Joint Operations', 'View partnerships, shared workspaces, and collaboration metadata'),
  ('joint_operations.manage', 'Manage Joint Operations', 'Configure collaboration settings, partnerships, and governance metadata'),
  ('joint_operations.collaborate', 'Collaborate in Joint Operations', 'Participate in shared workspaces and joint objectives')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'joint_operations.view'), ('owner', 'joint_operations.manage'), ('owner', 'joint_operations.collaborate'),
  ('administrator', 'joint_operations.view'), ('administrator', 'joint_operations.manage'), ('administrator', 'joint_operations.collaborate'),
  ('manager', 'joint_operations.view'), ('manager', 'joint_operations.collaborate'),
  ('employee', 'joint_operations.view'),
  ('support_agent', 'joint_operations.view'),
  ('moderator', 'joint_operations.view'),
  ('viewer', 'joint_operations.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Engine helpers (_cojo_)
-- ---------------------------------------------------------------------------
create or replace function public._cojo_tenant_for_auth()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._cojo_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cojo_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cojo_tenant_can_access_workspace(
  p_tenant_id uuid,
  p_owner_tenant_id uuid,
  p_participating_org_ids uuid[]
)
returns boolean language sql immutable as $$
  select p_tenant_id = p_owner_tenant_id
    or p_tenant_id = any (coalesce(p_participating_org_ids, '{}'::uuid[]));
$$;

create or replace function public._cojo_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.joint_operations_collaboration_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._cojo_ensure_settings(p_tenant_id uuid)
returns public.joint_operations_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.joint_operations_settings;
begin
  insert into public.joint_operations_settings (tenant_id, enabled, default_governance_tier)
  values (p_tenant_id, false, 'standard')
  on conflict (tenant_id) do nothing;
  select * into v_settings from public.joint_operations_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cojo_seed_partnership_scaffolds(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.joint_operations_partnerships where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.joint_operations_partnerships (
    tenant_id, partnership_key, partner_type, partner_display_name, status, governance_tier, participation_agreement
  ) values
    (p_tenant_id, 'gp-collaboration-scaffold', 'growth_partner', 'Growth Partner collaboration (scaffold)', 'pending', 'standard',
      jsonb_build_object('opt_in', true, 'executive_approval', true, 'metadata_only', true)),
    (p_tenant_id, 'org-alliance-scaffold', 'organization', 'Organization alliance (scaffold)', 'pending', 'elevated',
      jsonb_build_object('opt_in', true, 'participation_agreement_required', true, 'metadata_only', true));
end; $$;

create or replace function public._cojo_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.joint_operations_settings;
  v_partnership_count int;
  v_active_partnerships int;
  v_workspace_count int;
  v_active_workspaces int;
  v_objective_count int;
  v_collaboration_score numeric;
begin
  select * into v_settings from public.joint_operations_settings where tenant_id = p_tenant_id;
  select count(*) into v_partnership_count from public.joint_operations_partnerships where tenant_id = p_tenant_id;
  select count(*) into v_active_partnerships from public.joint_operations_partnerships
    where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_workspace_count from public.joint_operations_shared_workspaces w
    where public._cojo_tenant_can_access_workspace(p_tenant_id, w.owner_tenant_id, w.participating_org_ids);
  select count(*) into v_active_workspaces from public.joint_operations_shared_workspaces w
    where public._cojo_tenant_can_access_workspace(p_tenant_id, w.owner_tenant_id, w.participating_org_ids)
      and w.status = 'active';
  select count(*) into v_objective_count from public.joint_operations_shared_objectives where tenant_id = p_tenant_id;

  v_collaboration_score := round(
    case when coalesce(v_settings.enabled, false) then 15 else 0 end
    + least(v_active_partnerships, 5) * 8
    + least(v_active_workspaces, 5) * 10
    + least(v_objective_count, 5) * 5,
    1
  );

  return jsonb_build_object(
    'collaboration_score', v_collaboration_score,
    'enabled', coalesce(v_settings.enabled, false),
    'default_governance_tier', coalesce(v_settings.default_governance_tier, 'standard'),
    'partnerships_count', v_partnership_count,
    'active_partnerships_count', v_active_partnerships,
    'shared_workspaces_count', v_workspace_count,
    'active_workspaces_count', v_active_workspaces,
    'shared_objectives_count', v_objective_count,
    'cross_links_count', jsonb_array_length(public._cojobp143_integration_links()),
    'framework_domains_count', jsonb_array_length(public._cojobp143_collaboration_framework_engine()->'domains')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Blueprint helpers (_cojobp143_)
-- ---------------------------------------------------------------------------
create or replace function public._cojobp143_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Repo Phase 143 — Cross-Organizational Collaboration & Joint Operations Engine at /app/joint-operations-engine. Global Intelligence Era (141–150) — secure interorganizational collaboration with autonomous organizations. Distinct from Organization & Workspace Engine A.75 at /app/organization-workspace-engine (single-tenant internal workspaces — cross-link only, never collide with _owe_*). Distinct from Community Phase 117 at /app/community. Distinct from Global Knowledge Exchange Phase 141 at /app/global-knowledge-exchange-engine (voluntary knowledge exchange — cross-link). Helpers _cojobp143_* — never collide with _owe_*, _gkeebp141_*.';
$$;

create or replace function public._cojobp143_mission()
returns text language sql immutable as $$
  select 'Enable secure, governed, opt-in collaboration between autonomous organizations — shared workspaces and joint operations with clear participation agreements, not centralized authority.';
$$;

create or replace function public._cojobp143_philosophy()
returns text language sql immutable as $$
  select 'People First. Autonomous organizations remain independent. Trusted collaboration through configurable participation and visibility. Companions support; humans accountable. Wisdom before speed. Growth Partner terminology — never Affiliate.';
$$;

create or replace function public._cojobp143_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) — Joint Operations Center orchestrates cross-org workspace scaffolds, partnership governance, and collaboration metadata. Internal workspaces (A.75) and knowledge exchange (Phase 141) remain authoritative for their domains. Aipify informs and prepares; executives approve participation.';
$$;

create or replace function public._cojobp143_vision()
returns text language sql immutable as $$
  select 'Organizations collaborate with integrity — shared objectives, governed workspaces, and transparent accountability — while preserving autonomy and human relationship stewardship.';
$$;

create or replace function public._cojobp143_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'secure_collaboration', 'label', 'Secure collaboration', 'emoji', '🤝', 'description', 'Opt-in partnerships with governance tiers'),
    jsonb_build_object('key', 'shared_workspaces', 'label', 'Shared workspaces', 'emoji', '🏢', 'description', 'Cross-org workspace scaffolds with RBAC'),
    jsonb_build_object('key', 'joint_objectives', 'label', 'Joint objectives', 'emoji', '🎯', 'description', 'Common goals and outcome metadata'),
    jsonb_build_object('key', 'governance_oversight', 'label', 'Governance oversight', 'emoji', '🛡️', 'description', 'Participation agreements and executive approval'),
    jsonb_build_object('key', 'companion_support', 'label', 'Companion support', 'emoji', '✨', 'description', 'Coordination assistance — humans accountable'),
    jsonb_build_object('key', 'partner_experience', 'label', 'Partner experience', 'emoji', '🌱', 'description', 'Relationship health and engagement summaries'),
    jsonb_build_object('key', 'collaboration_memory', 'label', 'Collaboration memory', 'emoji', '📚', 'description', 'Lessons learned and decision records — metadata only'),
    jsonb_build_object('key', 'audit_transparency', 'label', 'Audit transparency', 'emoji', '🔒', 'description', 'Cross-org audit metadata with access boundaries')
  );
$$;

create or replace function public._cojobp143_joint_operations_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Joint Operations Center — eight collaboration capabilities. Autonomous orgs, governed frameworks.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'shared_workspaces', 'label', 'Shared workspaces'),
      jsonb_build_object('key', 'cross_org_projects', 'label', 'Cross-org projects'),
      jsonb_build_object('key', 'joint_tasks', 'label', 'Joint task coordination', 'cross_link', '/app/unified-task-follow-up-engine'),
      jsonb_build_object('key', 'companion_collaboration', 'label', 'Companion collaboration support'),
      jsonb_build_object('key', 'partner_comms', 'label', 'Partner communications scaffolds'),
      jsonb_build_object('key', 'governance_oversight', 'label', 'Governance oversight', 'cross_link', '/app/collective-decision-council-engine'),
      jsonb_build_object('key', 'knowledge_sharing_controls', 'label', 'Knowledge sharing controls', 'cross_link', '/app/global-knowledge-exchange-engine'),
      jsonb_build_object('key', 'collaboration_dashboards', 'label', 'Collaboration dashboards')
    )
  );
$$;

create or replace function public._cojobp143_collaboration_framework_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaboration framework — six relationship patterns. Metadata summaries only.',
    'domains', jsonb_build_array(
      jsonb_build_object('key', 'org_growth_partner', 'label', 'Organization ↔ Growth Partner', 'cross_link', '/app/growth-partner-operations'),
      jsonb_build_object('key', 'org_org', 'label', 'Organization ↔ Organization'),
      jsonb_build_object('key', 'executive_advisory', 'label', 'Executive ↔ Advisory', 'cross_link', '/app/decision-intelligence-engine'),
      jsonb_build_object('key', 'support_specialists', 'label', 'Support ↔ Specialists', 'cross_link', '/app/support-ai-engine'),
      jsonb_build_object('key', 'commerce_suppliers', 'label', 'Commerce ↔ Suppliers'),
      jsonb_build_object('key', 'knowledge_experts', 'label', 'Knowledge ↔ Experts', 'cross_link', '/app/knowledge-center-engine')
    )
  );
$$;

create or replace function public._cojobp143_shared_workspace_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared workspace engine — RBAC and visibility controls. Distinct from A.75 internal workspaces.',
    'features', jsonb_build_array(
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'document_collaboration', 'label', 'Document collaboration scaffold'),
      jsonb_build_object('key', 'shared_objectives', 'label', 'Shared objectives linkage'),
      jsonb_build_object('key', 'task_coordination', 'label', 'Task coordination', 'cross_link', '/app/unified-task-follow-up-engine'),
      jsonb_build_object('key', 'milestones', 'label', 'Milestone tracking'),
      jsonb_build_object('key', 'approvals', 'label', 'Joint approvals', 'cross_link', '/app/approvals'),
      jsonb_build_object('key', 'visibility_controls', 'label', 'Visibility controls per participant org')
    ),
    'internal_workspace_route', '/app/organization-workspace-engine',
    'distinction', 'Cross-org shared workspaces — not single-tenant A.75 workspaces'
  );
$$;

create or replace function public._cojobp143_joint_governance_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Joint governance — participation agreements and executive oversight.',
    'controls', jsonb_build_array(
      jsonb_build_object('key', 'participation_agreements', 'label', 'Participation agreements'),
      jsonb_build_object('key', 'approval_structures', 'label', 'Approval structures'),
      jsonb_build_object('key', 'escalation', 'label', 'Escalation pathways'),
      jsonb_build_object('key', 'responsibility_definitions', 'label', 'Responsibility definitions'),
      jsonb_build_object('key', 'executive_oversight', 'label', 'Executive oversight'),
      jsonb_build_object('key', 'audit_logging', 'label', 'Cross-org audit logging'),
      jsonb_build_object('key', 'access_monitoring', 'label', 'Access monitoring metadata')
    )
  );
$$;

create or replace function public._cojobp143_cross_organizational_companion_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Cross-organizational companion — supports coordination; humans remain accountable.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'knowledge_summaries', 'label', 'Knowledge summaries'),
      jsonb_build_object('key', 'meeting_prep', 'label', 'Meeting preparation', 'cross_link', '/app/meeting-collaboration-intelligence-engine'),
      jsonb_build_object('key', 'action_tracking', 'label', 'Action tracking'),
      jsonb_build_object('key', 'project_coordination', 'label', 'Project coordination'),
      jsonb_build_object('key', 'comms_drafting', 'label', 'Communications drafting scaffolds'),
      jsonb_build_object('key', 'risk_visibility', 'label', 'Risk visibility summaries'),
      jsonb_build_object('key', 'status_reporting', 'label', 'Status reporting aggregates')
    )
  );
$$;

create or replace function public._cojobp143_partner_experience_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Partner experience — aggregate relationship health and engagement metadata.',
    'areas', jsonb_build_array(
      jsonb_build_object('key', 'relationship_health', 'label', 'Relationship health reviews (aggregate)'),
      jsonb_build_object('key', 'engagement_summaries', 'label', 'Engagement summaries'),
      jsonb_build_object('key', 'communication_insights', 'label', 'Communication insights'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition pathways', 'cross_link', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'support_pathways', 'label', 'Support pathways'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions', 'cross_link', '/app/global-knowledge-exchange-engine')
    ),
    'relationship_route', '/app/assistant/relationships'
  );
$$;

create or replace function public._cojobp143_shared_objectives_framework()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Shared objectives framework — common goals with governance expectations.',
    'elements', jsonb_build_array(
      jsonb_build_object('key', 'common_goals', 'label', 'Common goals'),
      jsonb_build_object('key', 'outcomes', 'label', 'Expected outcomes'),
      jsonb_build_object('key', 'success_metrics', 'label', 'Success metrics (metadata)'),
      jsonb_build_object('key', 'time_horizons', 'label', 'Time horizons'),
      jsonb_build_object('key', 'roles', 'label', 'Participant roles'),
      jsonb_build_object('key', 'governance_expectations', 'label', 'Governance expectations')
    ),
    'goals_route', '/app/goals-okr-engine'
  );
$$;

create or replace function public._cojobp143_collaboration_memory_engine()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaboration memory — metadata lessons and partnership insights. Cross-link org memory.',
    'preserves', jsonb_build_array(
      jsonb_build_object('key', 'lessons_learned', 'label', 'Lessons learned'),
      jsonb_build_object('key', 'milestones', 'label', 'Milestone records'),
      jsonb_build_object('key', 'decision_records', 'label', 'Decision records'),
      jsonb_build_object('key', 'knowledge_contributions', 'label', 'Knowledge contributions'),
      jsonb_build_object('key', 'partnership_insights', 'label', 'Partnership insights')
    ),
    'org_memory_route', '/app/organizational-memory-engine'
  );
$$;

create or replace function public._cojobp143_companion_limitations()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Confidential exposure across org boundaries',
      'Independent access expansion without approval',
      'Governance bypass',
      'Boundary override of participation agreements',
      'Replacing human relationship management'
    ),
    'principle', 'Companions support coordination — executives and relationship stewards remain accountable.'
  );
$$;

create or replace function public._cojobp143_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — respect, patience, generosity, listening, recognition, shared success.',
    'values', jsonb_build_array(
      'respect', 'patience', 'generosity', 'listening', 'recognition', 'shared_success'
    ),
    'cross_link', '/app/self-love-engine'
  );
$$;

create or replace function public._cojobp143_security_requirements()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'requirements', jsonb_build_array(
      jsonb_build_object('key', 'rbac', 'label', 'Role-based access control'),
      jsonb_build_object('key', 'workspace_isolation', 'label', 'Workspace isolation per participating org'),
      jsonb_build_object('key', 'cross_org_audit', 'label', 'Cross-org audit logs'),
      jsonb_build_object('key', 'executive_approval', 'label', 'Executive approval for partnerships'),
      jsonb_build_object('key', 'access_monitoring', 'label', 'Access monitoring metadata'),
      jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
    )
  );
$$;

create or replace function public._cojobp143_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'global_knowledge_exchange', 'label', 'Global Knowledge Exchange Phase 141', 'route', '/app/global-knowledge-exchange-engine', 'relationship', 'Voluntary knowledge exchange — cross-link only'),
    jsonb_build_object('key', 'trust_reputation', 'label', 'Trust Network Phase 142', 'route', '/app/trust-reputation-engine', 'relationship', 'Verified organization ecosystem — cross-link only'),
    jsonb_build_object('key', 'organization_workspace', 'label', 'Organization Workspace A.75', 'route', '/app/organization-workspace-engine', 'relationship', 'Internal workspaces — do NOT duplicate _owe_*'),
    jsonb_build_object('key', 'growth_partner_ops', 'label', 'Growth Partner Ops Phase 114', 'route', '/app/growth-partner-operations', 'relationship', 'GP collaboration patterns'),
    jsonb_build_object('key', 'meeting_collaboration', 'label', 'Meeting Collaboration A.61', 'route', '/app/meeting-collaboration-intelligence-engine', 'relationship', 'Meeting prep and follow-up'),
    jsonb_build_object('key', 'relationship_intelligence', 'label', 'Relationship Intelligence A.78', 'route', '/app/assistant/relationships', 'relationship', 'Human relationship stewardship — never replace'),
    jsonb_build_object('key', 'collective_decision', 'label', 'Collective Decision Council Phase 137', 'route', '/app/collective-decision-council-engine', 'relationship', 'Governance deliberation cross-link'),
    jsonb_build_object('key', 'trust_actions', 'label', 'Trust & Action Phase 30', 'route', '/app/approvals', 'relationship', 'Sensitive joint action approvals'),
    jsonb_build_object('key', 'human_oversight', 'label', 'Human Oversight A.40', 'route', '/app/human-oversight-engine', 'relationship', 'Human oversight gates')
  );
$$;

create or replace function public._cojobp143_dogfooding()
returns text language sql immutable as $$
  select 'Aipify uses Joint Operations internally with metadata-only partnership scaffolds and governed shared workspace participation. Growth Partner terminology throughout. No cross-tenant confidential data exposure.';
$$;

create or replace function public._cojobp143_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Autonomous organizations — trusted collaboration.',
    'Configurable participation and visibility.',
    'Companions support; humans accountable.',
    'Wisdom before speed.',
    'Growth Partner — never Affiliate.'
  );
$$;

create or replace function public._cojobp143_privacy_note()
returns text language sql immutable as $$
  select 'Joint Operations metadata only — partnership summaries, workspace scaffolds, and objective metadata. No cross-tenant PII or confidential operational records without explicit governed partnership link. Opt-in required.';
$$;

create or replace function public._cojobp143_engagement_summary(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  perform public._cojo_ensure_settings(p_tenant_id);
  perform public._cojo_seed_partnership_scaffolds(p_tenant_id);
  v_metrics := public._cojo_refresh_metrics(p_tenant_id);

  return jsonb_build_object(
    'collaboration_score', coalesce((v_metrics->>'collaboration_score')::numeric, 0),
    'enabled', coalesce((v_metrics->>'enabled')::boolean, false),
    'default_governance_tier', coalesce(v_metrics->>'default_governance_tier', 'standard'),
    'partnerships_count', coalesce((v_metrics->>'partnerships_count')::int, 0),
    'active_partnerships_count', coalesce((v_metrics->>'active_partnerships_count')::int, 0),
    'shared_workspaces_count', coalesce((v_metrics->>'shared_workspaces_count')::int, 0),
    'active_workspaces_count', coalesce((v_metrics->>'active_workspaces_count')::int, 0),
    'shared_objectives_count', coalesce((v_metrics->>'shared_objectives_count')::int, 0),
    'cross_links_count', jsonb_array_length(public._cojobp143_integration_links()),
    'framework_domains_count', 6,
    'privacy_note', public._cojobp143_privacy_note(),
    'opt_in_required', true
  );
end; $$;

create or replace function public._cojobp143_success_criteria(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._cojo_ensure_settings(p_tenant_id);
  perform public._cojo_seed_partnership_scaffolds(p_tenant_id);

  return jsonb_build_array(
    jsonb_build_object('key', 'joint_operations_center', 'label', 'Joint Operations Center — eight capabilities', 'met', jsonb_array_length(public._cojobp143_joint_operations_center()->'capabilities') = 8, 'note', null),
    jsonb_build_object('key', 'collaboration_framework', 'label', 'Collaboration framework — six domains', 'met', jsonb_array_length(public._cojobp143_collaboration_framework_engine()->'domains') = 6, 'note', null),
    jsonb_build_object('key', 'shared_workspace_engine', 'label', 'Shared workspace engine — seven features', 'met', jsonb_array_length(public._cojobp143_shared_workspace_engine()->'features') = 7, 'note', null),
    jsonb_build_object('key', 'joint_governance', 'label', 'Joint governance — seven controls', 'met', jsonb_array_length(public._cojobp143_joint_governance_engine()->'controls') = 7, 'note', null),
    jsonb_build_object('key', 'companion_engine', 'label', 'Cross-org companion — seven capabilities', 'met', jsonb_array_length(public._cojobp143_cross_organizational_companion_engine()->'capabilities') = 7, 'note', null),
    jsonb_build_object('key', 'partner_experience', 'label', 'Partner experience — six areas', 'met', jsonb_array_length(public._cojobp143_partner_experience_engine()->'areas') = 6, 'note', null),
    jsonb_build_object('key', 'shared_objectives', 'label', 'Shared objectives framework — six elements', 'met', jsonb_array_length(public._cojobp143_shared_objectives_framework()->'elements') = 6, 'note', null),
    jsonb_build_object('key', 'collaboration_memory', 'label', 'Collaboration memory — five preserves', 'met', jsonb_array_length(public._cojobp143_collaboration_memory_engine()->'preserves') = 5, 'note', null),
    jsonb_build_object('key', 'partnerships_seeded', 'label', 'Partnership scaffolds seeded', 'met', (select count(*) >= 2 from public.joint_operations_partnerships p where p.tenant_id = p_tenant_id), 'note', null),
    jsonb_build_object('key', 'opt_in_default', 'label', 'Default opt-out (enabled false)', 'met', exists (select 1 from public.joint_operations_settings s where s.tenant_id = p_tenant_id and s.enabled = false), 'note', null),
    jsonb_build_object('key', 'companion_limitations', 'label', 'Companion limitations documented', 'met', jsonb_array_length(public._cojobp143_companion_limitations()->'must_avoid') >= 5, 'note', null),
    jsonb_build_object('key', 'objectives', 'label', 'Blueprint objectives — eight documented', 'met', jsonb_array_length(public._cojobp143_objectives()) = 8, 'note', null),
    jsonb_build_object('key', 'integration_links', 'label', 'Integration links — nine cross-links', 'met', jsonb_array_length(public._cojobp143_integration_links()) = 9, 'note', null),
    jsonb_build_object('key', 'baseline_tables', 'label', 'Repo Phase 143 baseline tables and RPCs', 'met', to_regclass('public.joint_operations_settings') is not null, 'note', '_cojo_* helpers intact')
  );
end; $$;

create or replace function public._cojobp143_blueprint_block(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 143 — Cross-Organizational Collaboration & Joint Operations Engine',
    'doc', 'CROSS_ORGANIZATIONAL_COLLABORATION_JOINT_OPERATIONS_ENGINE_PHASE143.md',
    'engine_phase', 'Repo Phase 143 Joint Operations Engine',
    'route', '/app/joint-operations-engine',
    'mapping_note', 'Global Intelligence Era (141–150) — secure interorganizational collaboration.',
    'distinction_note', public._cojobp143_distinction_note(),
    'mission', public._cojobp143_mission(),
    'philosophy', public._cojobp143_philosophy(),
    'abos_principle', public._cojobp143_abos_principle(),
    'vision', public._cojobp143_vision(),
    'objectives', public._cojobp143_objectives(),
    'joint_operations_center', public._cojobp143_joint_operations_center(),
    'collaboration_framework_engine', public._cojobp143_collaboration_framework_engine(),
    'shared_workspace_engine', public._cojobp143_shared_workspace_engine(),
    'joint_governance_engine', public._cojobp143_joint_governance_engine(),
    'cross_organizational_companion_engine', public._cojobp143_cross_organizational_companion_engine(),
    'partner_experience_engine', public._cojobp143_partner_experience_engine(),
    'shared_objectives_framework', public._cojobp143_shared_objectives_framework(),
    'collaboration_memory_engine', public._cojobp143_collaboration_memory_engine(),
    'companion_limitations', public._cojobp143_companion_limitations(),
    'self_love_connection', public._cojobp143_self_love_connection(),
    'security_requirements', public._cojobp143_security_requirements(),
    'integration_links', public._cojobp143_integration_links(),
    'dogfooding', public._cojobp143_dogfooding(),
    'success_criteria', public._cojobp143_success_criteria(p_tenant_id),
    'engagement_summary', public._cojobp143_engagement_summary(p_tenant_id),
    'vision_phrases', public._cojobp143_vision_phrases(),
    'privacy_note', public._cojobp143_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Thin scaffold RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_joint_operations_partnership(
  p_partner_type text,
  p_partner_display_name text,
  p_governance_tier text default 'standard',
  p_participation_agreement jsonb default '{}'::jsonb,
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.joint_operations_settings;
  v_key text;
  v_id uuid;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cojo_require_tenant());
  v_settings := public._cojo_ensure_settings(v_tenant_id);
  if not v_settings.enabled then
    raise exception 'Joint operations requires enabled collaboration settings';
  end if;
  if p_partner_type not in ('growth_partner', 'organization', 'consultant', 'supplier', 'advisory') then
    raise exception 'Invalid partner type';
  end if;
  if p_governance_tier not in ('standard', 'elevated', 'executive') then
    raise exception 'Invalid governance tier';
  end if;
  v_key := p_partner_type || '-' || left(md5(p_partner_display_name || clock_timestamp()::text), 8);
  insert into public.joint_operations_partnerships (
    tenant_id, partnership_key, partner_type, partner_display_name, status, governance_tier, participation_agreement
  ) values (
    v_tenant_id, v_key, p_partner_type, p_partner_display_name,
    case when v_settings.executive_approval_required then 'pending' else 'proposed' end,
    p_governance_tier,
    coalesce(p_participation_agreement, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  )
  returning id into v_id;
  perform public._cojo_log_audit(v_tenant_id, 'partnership_created', left(p_partner_display_name, 120),
    jsonb_build_object('partnership_id', v_id, 'partner_type', p_partner_type, 'governance_tier', p_governance_tier));
  return v_id;
end; $$;

create or replace function public.create_joint_operations_shared_workspace(
  p_title text,
  p_access_model jsonb default '{}'::jsonb,
  p_participating_org_ids uuid[] default '{}'::uuid[],
  p_governance_tier text default 'standard',
  p_tenant_id uuid default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.joint_operations_settings;
  v_key text;
  v_id uuid;
  v_participants uuid[];
begin
  v_tenant_id := coalesce(p_tenant_id, public._cojo_require_tenant());
  v_settings := public._cojo_ensure_settings(v_tenant_id);
  if not v_settings.enabled then
    raise exception 'Joint operations requires enabled collaboration settings';
  end if;
  if p_governance_tier not in ('standard', 'elevated', 'executive') then
    raise exception 'Invalid governance tier';
  end if;
  v_participants := array_append(coalesce(p_participating_org_ids, '{}'::uuid[]), v_tenant_id);
  v_key := 'ws-' || left(md5(p_title || clock_timestamp()::text), 8);
  insert into public.joint_operations_shared_workspaces (
    owner_tenant_id, workspace_key, title, status, access_model, participating_org_ids, governance_tier
  ) values (
    v_tenant_id, v_key, p_title,
    case when v_settings.executive_approval_required then 'pending_approval' else 'draft' end,
    coalesce(p_access_model, '{}'::jsonb),
    v_participants,
    p_governance_tier
  )
  returning id into v_id;
  perform public._cojo_log_audit(v_tenant_id, 'workspace_created', left(p_title, 120),
    jsonb_build_object('workspace_id', v_id, 'governance_tier', p_governance_tier, 'participant_count', array_length(v_participants, 1)));
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_joint_operations_engine_card(p_tenant_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.joint_operations_settings;
  v_metrics jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cojo_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._cojo_ensure_settings(v_tenant_id);
  perform public._cojo_seed_partnership_scaffolds(v_tenant_id);
  v_metrics := public._cojo_refresh_metrics(v_tenant_id);
  v_engagement := public._cojobp143_engagement_summary(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'collaboration_score', v_metrics->'collaboration_score',
    'enabled', v_settings.enabled,
    'default_governance_tier', v_settings.default_governance_tier,
    'partnerships_count', v_metrics->'partnerships_count',
    'active_workspaces_count', v_metrics->'active_workspaces_count',
    'philosophy', public._cojobp143_philosophy(),
    'executive_approval_required', v_settings.executive_approval_required,
    'participation_opt_in_required', v_settings.participation_opt_in_required,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 143 — Cross-Organizational Collaboration & Joint Operations Engine',
      'doc', 'CROSS_ORGANIZATIONAL_COLLABORATION_JOINT_OPERATIONS_ENGINE_PHASE143.md',
      'engine_phase', 'Repo Phase 143 Joint Operations Engine',
      'route', '/app/joint-operations-engine',
      'mapping_note', 'Global Intelligence Era (141–150).'
    ),
    'joint_operations_mission', public._cojobp143_mission(),
    'joint_operations_abos_principle', public._cojobp143_abos_principle(),
    'joint_operations_engagement_summary', v_engagement,
    'joint_operations_note', public._cojobp143_distinction_note(),
    'joint_operations_vision_note', public._cojobp143_vision()
  );
end; $$;

create or replace function public.get_joint_operations_engine_dashboard(p_tenant_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.joint_operations_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_tenant_id, public._cojo_require_tenant());
  v_settings := public._cojo_ensure_settings(v_tenant_id);
  perform public._cojo_seed_partnership_scaffolds(v_tenant_id);
  v_metrics := public._cojo_refresh_metrics(v_tenant_id);
  perform public._cojo_log_audit(v_tenant_id, 'dashboard_view', 'Joint Operations dashboard viewed',
    jsonb_build_object('collaboration_score', v_metrics->>'collaboration_score', 'enabled', v_settings.enabled));

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'default_governance_tier', v_settings.default_governance_tier,
    'executive_approval_required', v_settings.executive_approval_required,
    'participation_opt_in_required', v_settings.participation_opt_in_required,
    'philosophy', public._cojobp143_philosophy(),
    'safety_note', 'Joint Operations — metadata and governed workspace scaffolds only. Opt-in required. No cross-tenant confidential data without explicit partnership.',
    'distinction_note', public._cojobp143_distinction_note(),
    'collaboration_score', v_metrics->'collaboration_score',
    'partnerships_count', v_metrics->'partnerships_count',
    'active_partnerships_count', v_metrics->'active_partnerships_count',
    'shared_workspaces_count', v_metrics->'shared_workspaces_count',
    'active_workspaces_count', v_metrics->'active_workspaces_count',
    'shared_objectives_count', v_metrics->'shared_objectives_count',
    'partnerships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'partnership_key', p.partnership_key, 'partner_type', p.partner_type,
        'partner_display_name', p.partner_display_name, 'status', p.status,
        'governance_tier', p.governance_tier, 'created_at', p.created_at
      ) order by p.created_at desc)
      from public.joint_operations_partnerships p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'shared_workspaces', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'workspace_key', w.workspace_key, 'title', w.title, 'status', w.status,
        'governance_tier', w.governance_tier, 'participating_org_count', coalesce(array_length(w.participating_org_ids, 1), 0),
        'owner_tenant_id', w.owner_tenant_id, 'created_at', w.created_at
      ) order by w.created_at desc)
      from public.joint_operations_shared_workspaces w
      where public._cojo_tenant_can_access_workspace(v_tenant_id, w.owner_tenant_id, w.participating_org_ids)
    ), '[]'::jsonb),
    'shared_objectives', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'objective_key', o.objective_key, 'title', o.title,
        'outcome_summary', o.outcome_summary, 'time_horizon', o.time_horizon,
        'status', o.status, 'created_at', o.created_at
      ) order by o.created_at desc)
      from public.joint_operations_shared_objectives o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_links', public._cojobp143_integration_links(),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 143 — Cross-Organizational Collaboration & Joint Operations Engine',
      'doc', 'CROSS_ORGANIZATIONAL_COLLABORATION_JOINT_OPERATIONS_ENGINE_PHASE143.md',
      'engine_phase', 'Repo Phase 143 Joint Operations Engine',
      'route', '/app/joint-operations-engine',
      'mapping_note', 'Global Intelligence Era (141–150) — secure interorganizational collaboration.'
    ),
    'joint_operations_engine_note', 'Joint Operations Engine (ABOS Phase 143) — cross-org collaboration center. Cross-link A.75, Phase 141, Phase 142 — do NOT duplicate _owe_*.',
    'joint_operations_blueprint', public._cojobp143_blueprint_block(v_tenant_id),
    'joint_operations_distinction_note', public._cojobp143_distinction_note(),
    'joint_operations_mission', public._cojobp143_mission(),
    'joint_operations_philosophy', public._cojobp143_philosophy(),
    'joint_operations_abos_principle', public._cojobp143_abos_principle(),
    'joint_operations_objectives', public._cojobp143_objectives(),
    'joint_operations_center_meta', public._cojobp143_joint_operations_center(),
    'collaboration_framework_engine_meta', public._cojobp143_collaboration_framework_engine(),
    'shared_workspace_engine_meta', public._cojobp143_shared_workspace_engine(),
    'joint_governance_engine_meta', public._cojobp143_joint_governance_engine(),
    'cross_organizational_companion_engine_meta', public._cojobp143_cross_organizational_companion_engine(),
    'partner_experience_engine_meta', public._cojobp143_partner_experience_engine(),
    'shared_objectives_framework_meta', public._cojobp143_shared_objectives_framework(),
    'collaboration_memory_engine_meta', public._cojobp143_collaboration_memory_engine(),
    'companion_limitations_meta', public._cojobp143_companion_limitations(),
    'self_love_connection_meta', public._cojobp143_self_love_connection(),
    'security_requirements_meta', public._cojobp143_security_requirements(),
    'cojobp143_integration_links', public._cojobp143_integration_links(),
    'joint_operations_engagement_summary', public._cojobp143_engagement_summary(v_tenant_id),
    'joint_operations_success_criteria', public._cojobp143_success_criteria(v_tenant_id),
    'joint_operations_vision', public._cojobp143_vision(),
    'joint_operations_vision_phrases', public._cojobp143_vision_phrases(),
    'joint_operations_privacy_note', public._cojobp143_privacy_note(),
    'joint_operations_dogfooding', public._cojobp143_dogfooding()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + grants
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'joint-operations-engine', 'Joint Operations Engine',
  'Global Intelligence Era (141–150) — secure cross-organizational collaboration. People First.',
  'authenticated', 153
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'joint-operations-engine' and tenant_id is null
);

grant execute on function public.get_joint_operations_engine_card(uuid) to authenticated;
grant execute on function public.get_joint_operations_engine_dashboard(uuid) to authenticated;
grant execute on function public.create_joint_operations_partnership(text, text, text, jsonb, uuid) to authenticated;
grant execute on function public.create_joint_operations_shared_workspace(text, jsonb, uuid[], text, uuid) to authenticated;
grant execute on function public._cojobp143_distinction_note() to authenticated;
grant execute on function public._cojobp143_mission() to authenticated;
grant execute on function public._cojobp143_philosophy() to authenticated;
grant execute on function public._cojobp143_abos_principle() to authenticated;
grant execute on function public._cojobp143_vision() to authenticated;
grant execute on function public._cojobp143_objectives() to authenticated;
grant execute on function public._cojobp143_joint_operations_center() to authenticated;
grant execute on function public._cojobp143_collaboration_framework_engine() to authenticated;
grant execute on function public._cojobp143_shared_workspace_engine() to authenticated;
grant execute on function public._cojobp143_joint_governance_engine() to authenticated;
grant execute on function public._cojobp143_cross_organizational_companion_engine() to authenticated;
grant execute on function public._cojobp143_partner_experience_engine() to authenticated;
grant execute on function public._cojobp143_shared_objectives_framework() to authenticated;
grant execute on function public._cojobp143_collaboration_memory_engine() to authenticated;
grant execute on function public._cojobp143_companion_limitations() to authenticated;
grant execute on function public._cojobp143_self_love_connection() to authenticated;
grant execute on function public._cojobp143_security_requirements() to authenticated;
grant execute on function public._cojobp143_integration_links() to authenticated;
grant execute on function public._cojobp143_dogfooding() to authenticated;
grant execute on function public._cojobp143_vision_phrases() to authenticated;
grant execute on function public._cojobp143_privacy_note() to authenticated;
grant execute on function public._cojobp143_engagement_summary(uuid) to authenticated;
grant execute on function public._cojobp143_success_criteria(uuid) to authenticated;
