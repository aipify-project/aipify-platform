-- Phase 300 — Permission & Access Governance Engine
-- Feature owner: Customer App — /app/governance/permissions-access
-- Helpers: _pag_* (engine), _pagbp300_* (blueprint)
-- Cross-links /app/identity-access — does NOT modify core identity permission RPCs

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
    'presence_comfort_protocol',
    'dedication_engine',
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
    'aipify_install_business_discovery_engine',
    'aipify_first_day_experience_engine',
    'aipify_trust_acceleration_adoption_engine',
    'aipify_companion_marketplace_action_ecosystem_engine',
    'aipify_life_events_proactive_care_engine',
    'aipify_companion_identity_relationship_engine',
    'aipify_companion_presence_continuity_engine',
    'aipify_companion_action_marketplace_engine',
    'aipify_companion_action_memory_engine',
    'aipify_companion_approval_profiles_engine',
    'aipify_companion_financial_guardrails_engine',
    'aipify_companion_orchestration_engine',
    'aipify_automation_control_center_engine',
    'aipify_approval_human_oversight_center_engine',
    'aipify_permission_access_governance_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_permission_governance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  notifications_enabled boolean not null default true,
  visibility_level text not null default 'standard' check (
    visibility_level in ('minimal', 'standard', 'detailed')
  ),
  default_expiration text not null default 'permanent' check (
    default_expiration in ('permanent', 'temporary', 'project', 'time_limited')
  ),
  companion_permissions_enabled boolean not null default true,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_permission_governance_settings enable row level security;
revoke all on public.aipify_permission_governance_settings from authenticated, anon;

create table if not exists public.aipify_permission_grants (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  grant_key text not null,
  resource_name text not null,
  permission_label text not null,
  category text not null check (category in (
    'data_access', 'action_access', 'business_access', 'community_access', 'companion_access'
  )),
  permission_level int not null default 1 check (permission_level between 1 and 4),
  purpose text not null,
  risk_level text not null default 'low' check (risk_level in ('low', 'moderate', 'elevated', 'high')),
  granted_by_label text not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  expiration_type text not null default 'permanent' check (
    expiration_type in ('permanent', 'temporary', 'project', 'time_limited')
  ),
  what_aipify_can_do text,
  what_aipify_cannot_do text,
  revoke_instructions text,
  status text not null default 'active' check (status in ('active', 'revoked', 'expired', 'pending')),
  high_impact boolean not null default false,
  last_used_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, grant_key)
);
create index if not exists aipify_permission_grants_tenant_idx
  on public.aipify_permission_grants (tenant_id, status, category, permission_level);
alter table public.aipify_permission_grants enable row level security;
revoke all on public.aipify_permission_grants from authenticated, anon;

create table if not exists public.aipify_permission_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  request_key text not null,
  resource_name text not null,
  permission_label text not null,
  category text not null check (category in (
    'data_access', 'action_access', 'business_access', 'community_access', 'companion_access'
  )),
  permission_level int not null default 2 check (permission_level between 1 and 4),
  why_needed text not null,
  what_aipify_can_do text not null,
  what_aipify_cannot_do text not null,
  revoke_instructions text not null,
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'elevated', 'high')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  expiration_type text not null default 'temporary' check (
    expiration_type in ('permanent', 'temporary', 'project', 'time_limited')
  ),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, request_key)
);
alter table public.aipify_permission_requests enable row level security;
revoke all on public.aipify_permission_requests from authenticated, anon;

create table if not exists public.aipify_permission_history (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  history_key text not null,
  grant_key text not null,
  resource_name text not null,
  event_type text not null check (event_type in (
    'granted', 'revoked', 'downgraded', 'expired', 'reviewed', 'failed_attempt'
  )),
  actor_label text not null,
  reason text,
  created_at timestamptz not null default now(),
  unique (tenant_id, history_key)
);
create index if not exists aipify_permission_history_tenant_idx
  on public.aipify_permission_history (tenant_id, created_at desc);
alter table public.aipify_permission_history enable row level security;
revoke all on public.aipify_permission_history from authenticated, anon;

create table if not exists public.aipify_permission_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_key text not null,
  message text not null,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'open' check (status in ('open', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, recommendation_key)
);
alter table public.aipify_permission_recommendations enable row level security;
revoke all on public.aipify_permission_recommendations from authenticated, anon;

create table if not exists public.aipify_permission_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (event_type in (
    'grant_created', 'granted', 'revoked', 'downgraded', 'request_created',
    'request_approved', 'request_denied', 'failed_attempt', 'escalated',
    'review_completed', 'view_center'
  )),
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.aipify_permission_audit_logs enable row level security;
revoke all on public.aipify_permission_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'aipify_permission_access_governance_engine', v.description
from (values
  ('permission_access.view', 'View Permission Center', 'Review active permissions, requests, and governance recommendations'),
  ('permission_access.manage', 'Manage Permission Center', 'Configure visibility, expiration preferences, and dismiss recommendations'),
  ('permission_access.record', 'Record Permission Decisions', 'Grant, revoke, downgrade, and approve permission requests')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'permission_access.view'), ('owner', 'permission_access.manage'), ('owner', 'permission_access.record'),
  ('administrator', 'permission_access.view'), ('administrator', 'permission_access.manage'), ('administrator', 'permission_access.record'),
  ('manager', 'permission_access.view'), ('manager', 'permission_access.manage'), ('manager', 'permission_access.record'),
  ('employee', 'permission_access.view'), ('employee', 'permission_access.record'),
  ('support_agent', 'permission_access.view'), ('moderator', 'permission_access.view'), ('viewer', 'permission_access.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

update public.subscription_packages
set module_keys = module_keys || '["aipify_permission_access_governance_engine"]'::jsonb, updated_at = now()
where package_key in ('professional', 'business', 'enterprise')
  and not module_keys @> '["aipify_permission_access_governance_engine"]'::jsonb;

-- ---------------------------------------------------------------------------
-- 3. Blueprint — _pagbp300_*
-- ---------------------------------------------------------------------------
create or replace function public._pagbp300_core_principle() returns text language sql immutable as $$
  select 'Aipify can only do what it has permission to do. No permission. No action.';
$$;

create or replace function public._pagbp300_vision() returns text language sql immutable as $$
  select 'Trust is built through transparency and control. Every action Aipify performs is grounded in explicit authorization and human oversight.';
$$;

create or replace function public._pagbp300_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'data_access', 'label', 'Data access'),
    jsonb_build_object('key', 'action_access', 'label', 'Action access'),
    jsonb_build_object('key', 'business_access', 'label', 'Business access'),
    jsonb_build_object('key', 'community_access', 'label', 'Community access'),
    jsonb_build_object('key', 'companion_access', 'label', 'Companion access')
  );
$$;

create or replace function public._pagbp300_permission_levels() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('level', 1, 'key', 'read_only', 'label', 'Read only', 'description', 'View calendar events, reports, reminders'),
    jsonb_build_object('level', 2, 'key', 'recommend', 'label', 'Recommend', 'description', 'Suggest actions, generate drafts, prepare proposals'),
    jsonb_build_object('level', 3, 'key', 'approve_execute', 'label', 'Approve & execute', 'description', 'Execute after approval, send approved emails, book approved services'),
    jsonb_build_object('level', 4, 'key', 'fully_automated', 'label', 'Fully automated', 'description', 'Approved low-risk workflows, scheduled automations, background maintenance')
  );
$$;

create or replace function public._pagbp300_privacy_note() returns text language sql immutable as $$
  select 'Permission Center stores resource names, permission levels, and governance metadata only — never raw email content, documents, or payment details.';
$$;

create or replace function public._pagbp300_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 300 — Permission & Access Governance Engine',
    'route', '/app/governance/permissions-access',
    'core_principle', public._pagbp300_core_principle(),
    'vision', public._pagbp300_vision(),
    'categories', public._pagbp300_categories(),
    'permission_levels', public._pagbp300_permission_levels(),
    'privacy_note', public._pagbp300_privacy_note()
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Engine — _pag_*
-- ---------------------------------------------------------------------------
create or replace function public._pag_require_tenant() returns uuid
language plpgsql security definer set search_path = public as $$
declare v uuid;
begin
  v := public._presence_tenant_for_auth();
  if v is null then raise exception 'No tenant context'; end if;
  return v;
end; $$;

create or replace function public._pag_log(p_tenant uuid, p_type text, p_summary text, p_ctx jsonb default '{}')
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_permission_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant, p_type, left(p_summary, 500), coalesce(p_ctx, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._pag_grant_to_json(g public.aipify_permission_grants)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'grant_key', g.grant_key, 'resource_name', g.resource_name, 'permission_label', g.permission_label,
    'category', g.category, 'permission_level', g.permission_level, 'purpose', g.purpose,
    'risk_level', g.risk_level, 'granted_by_label', g.granted_by_label, 'granted_at', g.granted_at,
    'expires_at', g.expires_at, 'expiration_type', g.expiration_type,
    'what_aipify_can_do', g.what_aipify_can_do, 'what_aipify_cannot_do', g.what_aipify_cannot_do,
    'revoke_instructions', g.revoke_instructions, 'status', g.status, 'high_impact', g.high_impact,
    'last_used_at', g.last_used_at, 'created_at', g.created_at
  );
$$;

create or replace function public._pag_request_to_json(r public.aipify_permission_requests)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'request_key', r.request_key, 'resource_name', r.resource_name, 'permission_label', r.permission_label,
    'category', r.category, 'permission_level', r.permission_level, 'why_needed', r.why_needed,
    'what_aipify_can_do', r.what_aipify_can_do, 'what_aipify_cannot_do', r.what_aipify_cannot_do,
    'revoke_instructions', r.revoke_instructions, 'risk_level', r.risk_level, 'status', r.status,
    'expiration_type', r.expiration_type, 'expires_at', r.expires_at, 'created_at', r.created_at
  );
$$;

create or replace function public._pag_seed(p_tenant uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_permission_governance_settings (tenant_id) values (p_tenant) on conflict do nothing;

  insert into public.aipify_permission_grants (
    tenant_id, grant_key, resource_name, permission_label, category, permission_level,
    purpose, risk_level, granted_by_label, granted_at, expiration_type,
    what_aipify_can_do, what_aipify_cannot_do, revoke_instructions, status, high_impact, last_used_at
  ) values
  (
    p_tenant, 'grant_google_calendar', 'Google Calendar', 'Read & recommend', 'data_access', 2,
    'Coordinate travel preparation.',
    'low', 'Svein', now() - interval '2 days', 'permanent',
    'View calendar events and suggest scheduling options.',
    'Cannot send invitations or modify events without approval.',
    'Revoke from Permission Center or Google account settings at any time.',
    'active', false, now() - interval '1 day'
  ),
  (
    p_tenant, 'grant_send_email', 'Email sending', 'Approve & execute', 'action_access', 3,
    'Send approved customer communications.',
    'moderate', 'Operations Admin', now() - interval '14 days', 'permanent',
    'Send emails you have explicitly approved.',
    'Cannot send unapproved messages or access full mailbox content.',
    'Revoke immediately from Permission Center — takes effect at once.',
    'active', true, now() - interval '3 hours'
  ),
  (
    p_tenant, 'grant_crm', 'CRM workspace', 'Read only', 'business_access', 1,
    'View customer relationship summaries for support context.',
    'low', 'Support Lead', now() - interval '30 days', 'permanent',
    'View reports and contact summaries.',
    'Cannot modify records or export bulk data.',
    'Disable CRM connector or revoke permission here.',
    'active', false, now() - interval '20 days'
  ),
  (
    p_tenant, 'grant_family_companion', 'Family Companion', 'Recommend', 'companion_access', 2,
    'Support family coordination and reminders.',
    'low', 'Personal owner', now() - interval '7 days', 'permanent',
    'Suggest family-related actions and prepare drafts.',
    'Cannot send messages or make purchases without approval.',
    'Disable Companion access in Permission Center.',
    'active', false, now() - interval '2 days'
  ),
  (
    p_tenant, 'grant_member_mgmt', 'Member management', 'Read only', 'community_access', 1,
    'View member directory for moderation context.',
    'moderate', 'Community Admin', now() - interval '45 days', 'time_limited',
    'View member profiles and verification status.',
    'Cannot ban members or send bulk messages.',
    'Revoke from Permission Center or community settings.',
    'active', true, now() - interval '60 days'
  ),
  (
    p_tenant, 'grant_transport_booking', 'Transportation booking', 'Recommend', 'action_access', 2,
    'Prepare transportation options for travel.',
    'moderate', 'Personal owner', now() - interval '90 days', 'temporary',
    'Suggest and prepare booking drafts.',
    'Cannot complete purchases without approval.',
    'Revoked — no longer needed after travel completed.',
    'revoked', false, now() - interval '85 days'
  )
  on conflict (tenant_id, grant_key) do nothing;

  insert into public.aipify_permission_requests (
    tenant_id, request_key, resource_name, permission_label, category, permission_level,
    why_needed, what_aipify_can_do, what_aipify_cannot_do, revoke_instructions,
    risk_level, status, expiration_type, expires_at
  ) values
  (
    p_tenant, 'req_calendar_write', 'Google Calendar', 'Approve & execute', 'data_access', 3,
    'Aipify needs to schedule appointments after you approve suggested times.',
    'Create calendar events after your confirmation.',
    'Cannot read private notes or share calendar externally.',
    'Revoke from Permission Center — effective immediately.',
    'moderate', 'pending', 'temporary', now() + interval '30 days'
  ),
  (
    p_tenant, 'req_transport_execute', 'Transportation booking', 'Approve & execute', 'action_access', 3,
    'You repeatedly approve transportation coordination — execution access would reduce friction.',
    'Book approved transportation services.',
    'Cannot exceed financial guardrails or book without approval.',
    'Revoke or downgrade to Recommend at any time.',
    'moderate', 'pending', 'temporary', now() + interval '90 days'
  )
  on conflict (tenant_id, request_key) do nothing;

  insert into public.aipify_permission_history (
    tenant_id, history_key, grant_key, resource_name, event_type, actor_label, reason, created_at
  ) values
  (p_tenant, 'hist_transport_revoke', 'grant_transport_booking', 'Transportation booking', 'revoked', 'Personal owner', 'Travel completed', now() - interval '85 days'),
  (p_tenant, 'hist_email_grant', 'grant_send_email', 'Email sending', 'granted', 'Operations Admin', 'Approved for customer follow-up', now() - interval '14 days')
  on conflict do nothing;

  insert into public.aipify_permission_recommendations (tenant_id, recommendation_key, message, priority) values
  (p_tenant, 'rec_calendar', 'You repeatedly approve calendar coordination. Consider granting recommendation access.', 'medium'),
  (p_tenant, 'rec_unused', 'CRM read access has not been used for six months — review when convenient.', 'low'),
  (p_tenant, 'rec_high_risk', 'Several high-impact permissions should be reviewed.', 'high')
  on conflict do nothing;

  return jsonb_build_object('seeded', true);
end; $$;

create or replace function public._pag_dashboard_metrics(p_tenant uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'active_count', (select count(*) from public.aipify_permission_grants where tenant_id = p_tenant and status = 'active'),
    'recent_granted_count', (select count(*) from public.aipify_permission_grants where tenant_id = p_tenant and status = 'active' and granted_at >= now() - interval '7 days'),
    'high_impact_count', (select count(*) from public.aipify_permission_grants where tenant_id = p_tenant and status = 'active' and high_impact = true),
    'revoked_count', (select count(*) from public.aipify_permission_grants where tenant_id = p_tenant and status = 'revoked'),
    'pending_requests_count', (select count(*) from public.aipify_permission_requests where tenant_id = p_tenant and status = 'pending'),
    'companion_active_count', (select count(*) from public.aipify_permission_grants where tenant_id = p_tenant and status = 'active' and category = 'companion_access'),
    'governance_compliance_rate', 97.2,
    'avg_review_days', 3.5,
    'metadata_only', true
  );
$$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_permission_access_governance_center(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant uuid; v_seed jsonb;
begin
  v_tenant := coalesce(p_org_id, public._pag_require_tenant());
  perform public._irp_require_permission('permission_access.view', v_tenant);

  if not exists (select 1 from public.aipify_permission_grants where tenant_id = v_tenant limit 1) then
    v_seed := public._pag_seed(v_tenant);
  end if;

  perform public._pag_log(v_tenant, 'view_center', 'Permission Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'route', '/app/governance/permissions-access',
    'dashboard', public._pag_dashboard_metrics(v_tenant),
    'active_permissions', coalesce((select jsonb_agg(public._pag_grant_to_json(g) order by g.high_impact desc, g.granted_at desc)
      from public.aipify_permission_grants g where g.tenant_id = v_tenant and g.status = 'active'), '[]'::jsonb),
    'recent_granted', coalesce((select jsonb_agg(public._pag_grant_to_json(g) order by g.granted_at desc)
      from public.aipify_permission_grants g where g.tenant_id = v_tenant and g.status = 'active' and g.granted_at >= now() - interval '7 days'), '[]'::jsonb),
    'high_impact', coalesce((select jsonb_agg(public._pag_grant_to_json(g) order by g.risk_level desc)
      from public.aipify_permission_grants g where g.tenant_id = v_tenant and g.status = 'active' and g.high_impact = true), '[]'::jsonb),
    'revoked', coalesce((select jsonb_agg(public._pag_grant_to_json(g) order by g.updated_at desc)
      from public.aipify_permission_grants g where g.tenant_id = v_tenant and g.status = 'revoked' limit 10), '[]'::jsonb),
    'pending_requests', coalesce((select jsonb_agg(public._pag_request_to_json(r) order by r.created_at desc)
      from public.aipify_permission_requests r where r.tenant_id = v_tenant and r.status = 'pending'), '[]'::jsonb),
    'companion_overview', coalesce((select jsonb_agg(public._pag_grant_to_json(g) order by g.granted_at desc)
      from public.aipify_permission_grants g where g.tenant_id = v_tenant and g.status = 'active' and g.category = 'companion_access'), '[]'::jsonb),
    'recent_history', coalesce((select jsonb_agg(jsonb_build_object(
      'history_key', h.history_key, 'resource_name', h.resource_name, 'event_type', h.event_type,
      'actor_label', h.actor_label, 'reason', h.reason, 'created_at', h.created_at
    ) order by h.created_at desc) from public.aipify_permission_history h where h.tenant_id = v_tenant limit 10), '[]'::jsonb),
    'recommendations', coalesce((select jsonb_agg(jsonb_build_object(
      'recommendation_key', rec.recommendation_key, 'message', rec.message, 'priority', rec.priority
    ) order by case rec.priority when 'high' then 1 when 'medium' then 2 else 3 end)
      from public.aipify_permission_recommendations rec where rec.tenant_id = v_tenant and rec.status = 'open'), '[]'::jsonb),
    'executive_reporting', public._pag_dashboard_metrics(v_tenant),
    'categories', public._pagbp300_categories(),
    'permission_levels', public._pagbp300_permission_levels(),
    'blueprint', public._pagbp300_blueprint_summary(),
    'links', jsonb_build_object(
      'permission_center', '/app/governance/permissions-access',
      'identity_access', '/app/identity-access',
      'approval_center', '/app/governance/approval-center',
      'governance', '/app/governance'
    ),
    'privacy_note', public._pagbp300_privacy_note(),
    'can_manage', public._irp_has_permission('permission_access.manage', v_tenant),
    'can_record', public._irp_has_permission('permission_access.record', v_tenant),
    'seed', v_seed
  );
end; $$;

create or replace function public.process_permission_access_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant uuid;
  v_action text := nullif(p_payload->>'action', '');
  v_grant_key text := nullif(p_payload->>'grant_key', '');
  v_request_key text := nullif(p_payload->>'request_key', '');
  v_grant public.aipify_permission_grants;
  v_req public.aipify_permission_requests;
  v_hist_key text;
  v_new_level int;
begin
  v_tenant := public._pag_require_tenant();

  if v_action in ('revoke', 'downgrade', 'approve_request', 'deny_request') then
    perform public._irp_require_permission('permission_access.record', v_tenant);
  elsif v_action = 'dismiss_recommendation' then
    perform public._irp_require_permission('permission_access.manage', v_tenant);
  else
    raise exception 'Invalid action';
  end if;

  if v_action = 'dismiss_recommendation' then
    update public.aipify_permission_recommendations
    set status = 'dismissed'
    where tenant_id = v_tenant and recommendation_key = nullif(p_payload->>'recommendation_key', '');
    return jsonb_build_object('ok', true);
  end if;

  if v_action in ('revoke', 'downgrade') then
    select * into v_grant from public.aipify_permission_grants
    where tenant_id = v_tenant and grant_key = v_grant_key;
    if v_grant.id is null then raise exception 'Permission grant not found'; end if;

    if v_action = 'revoke' then
      update public.aipify_permission_grants set status = 'revoked', updated_at = now() where id = v_grant.id;
      v_hist_key := 'hist_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      insert into public.aipify_permission_history (
        tenant_id, history_key, grant_key, resource_name, event_type, actor_label, reason
      ) values (v_tenant, v_hist_key, v_grant.grant_key, v_grant.resource_name, 'revoked', 'Current user', p_payload->>'reason');
      perform public._pag_log(v_tenant, 'revoked', v_grant.resource_name, jsonb_build_object('grant_key', v_grant_key));
    elsif v_action = 'downgrade' then
      v_new_level := greatest(1, coalesce((p_payload->>'permission_level')::int, v_grant.permission_level - 1));
      update public.aipify_permission_grants
      set permission_level = v_new_level, updated_at = now()
      where id = v_grant.id;
      v_hist_key := 'hist_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
      insert into public.aipify_permission_history (
        tenant_id, history_key, grant_key, resource_name, event_type, actor_label, reason
      ) values (v_tenant, v_hist_key, v_grant.grant_key, v_grant.resource_name, 'downgraded', 'Current user', p_payload->>'reason');
      perform public._pag_log(v_tenant, 'downgraded', v_grant.resource_name, jsonb_build_object('grant_key', v_grant_key, 'level', v_new_level));
    end if;
    return jsonb_build_object('ok', true, 'grant_key', v_grant_key, 'action', v_action);
  end if;

  select * into v_req from public.aipify_permission_requests
  where tenant_id = v_tenant and request_key = v_request_key;
  if v_req.id is null then raise exception 'Permission request not found'; end if;

  if v_action = 'approve_request' then
    update public.aipify_permission_requests set status = 'approved', updated_at = now() where id = v_req.id;
    insert into public.aipify_permission_grants (
      tenant_id, grant_key, resource_name, permission_label, category, permission_level,
      purpose, risk_level, granted_by_label, expiration_type, expires_at,
      what_aipify_can_do, what_aipify_cannot_do, revoke_instructions, status
    ) values (
      v_tenant, 'grant_' || v_req.request_key, v_req.resource_name, v_req.permission_label,
      v_req.category, v_req.permission_level, v_req.why_needed, v_req.risk_level, 'Current user',
      v_req.expiration_type, v_req.expires_at, v_req.what_aipify_can_do, v_req.what_aipify_cannot_do,
      v_req.revoke_instructions, 'active'
    ) on conflict (tenant_id, grant_key) do update set
      permission_level = excluded.permission_level, status = 'active', updated_at = now();
    v_hist_key := 'hist_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
    insert into public.aipify_permission_history (
      tenant_id, history_key, grant_key, resource_name, event_type, actor_label, reason
    ) values (v_tenant, v_hist_key, 'grant_' || v_req.request_key, v_req.resource_name, 'granted', 'Current user', p_payload->>'reason');
    perform public._pag_log(v_tenant, 'request_approved', v_req.resource_name, jsonb_build_object('request_key', v_request_key));
  elsif v_action = 'deny_request' then
    update public.aipify_permission_requests set status = 'denied', updated_at = now() where id = v_req.id;
    perform public._pag_log(v_tenant, 'request_denied', v_req.resource_name, jsonb_build_object('request_key', v_request_key));
  end if;

  return jsonb_build_object('ok', true, 'request_key', v_request_key, 'action', v_action);
end; $$;

grant execute on function public.get_permission_access_governance_center(uuid) to authenticated;
grant execute on function public.process_permission_access_action(jsonb) to authenticated;
