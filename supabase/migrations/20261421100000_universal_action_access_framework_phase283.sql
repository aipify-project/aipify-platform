-- Phase 283 — Universal Action Access Framework (FOUNDATIONAL)
-- Feature owner: Customer App — Settings → Action Access (/app/settings/action-access)
-- Helpers: _uaaf_* (engine), _uaafbp283_* (blueprint)

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
    'universal_action_access_framework'
  )
);

create table if not exists public.aipify_uaaf_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  emergency_stop_honored boolean not null default true,
  business_hours_only boolean not null default false,
  geographic_limit text,
  default_approval_level text not null default 'user_confirmation' check (
    default_approval_level in ('automatic', 'user_confirmation', 'multi_step_approval')
  ),
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_uaaf_settings enable row level security;
revoke all on public.aipify_uaaf_settings from authenticated, anon;

create table if not exists public.aipify_uaaf_integration_access (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  integration_key text not null,
  integration_label text not null,
  action_category text not null check (
    action_category in ('personal', 'business', 'commerce', 'workforce', 'device', 'future')
  ),
  access_scope text not null default 'tenant',
  execute_scope text not null default 'approved_users',
  approval_level text not null default 'user_confirmation' check (
    approval_level in ('automatic', 'user_confirmation', 'multi_step_approval')
  ),
  logging_required boolean not null default true,
  reversal_available boolean not null default false,
  security_requirements jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('active', 'disabled', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, integration_key)
);
create index if not exists aipify_uaaf_integration_access_tenant_idx on public.aipify_uaaf_integration_access (tenant_id, action_category, status);
alter table public.aipify_uaaf_integration_access enable row level security;
revoke all on public.aipify_uaaf_integration_access from authenticated, anon;

create table if not exists public.aipify_uaaf_action_permissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  subject_type text not null check (subject_type in ('role', 'user', 'department')),
  subject_key text not null,
  allowed_categories jsonb not null default '[]'::jsonb,
  denied_actions jsonb not null default '[]'::jsonb,
  approval_threshold text not null default 'user_confirmation' check (
    approval_threshold in ('automatic', 'user_confirmation', 'multi_step_approval')
  ),
  business_hours_only boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, subject_type, subject_key)
);
create index if not exists aipify_uaaf_action_permissions_tenant_idx on public.aipify_uaaf_action_permissions (tenant_id, subject_type);
alter table public.aipify_uaaf_action_permissions enable row level security;
revoke all on public.aipify_uaaf_action_permissions from authenticated, anon;

create table if not exists public.aipify_uaaf_action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  integration_key text not null,
  action_category text not null,
  action_key text not null,
  action_label text,
  approval_status text not null default 'draft',
  outcome text,
  reversal_status text,
  summary text check (summary is null or char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_uaaf_action_audit_logs_tenant_idx on public.aipify_uaaf_action_audit_logs (tenant_id, created_at desc);
alter table public.aipify_uaaf_action_audit_logs enable row level security;
revoke all on public.aipify_uaaf_action_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'universal_action_access_framework', v.description
from (values
  ('uaaf.view', 'View Action Access', 'View action access settings, integrations, permissions, and audit metadata'),
  ('uaaf.manage', 'Manage Action Access', 'Manage action access settings and integration access catalog'),
  ('uaaf.execute', 'Execute Actions', 'Validate and propose actions within configured access limits'),
  ('uaaf.steward', 'Steward Action Access', 'Steward action access governance, policies, and audit oversight')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key from public.organizations o
cross join (values
  ('owner', 'uaaf.view'), ('owner', 'uaaf.manage'), ('owner', 'uaaf.execute'), ('owner', 'uaaf.steward'),
  ('administrator', 'uaaf.view'), ('administrator', 'uaaf.manage'), ('administrator', 'uaaf.execute'), ('administrator', 'uaaf.steward'),
  ('manager', 'uaaf.view'), ('manager', 'uaaf.execute'),
  ('employee', 'uaaf.view'), ('employee', 'uaaf.execute'),
  ('support_agent', 'uaaf.view'), ('moderator', 'uaaf.view'), ('viewer', 'uaaf.view')
) as v(role, key)
where not exists (select 1 from public.organization_role_permissions rp where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key);

create or replace function public._uaaf_tenant_for_auth() returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._uaaf_require_tenant() returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; begin v_tenant_id := public._uaaf_tenant_for_auth(); if v_tenant_id is null then raise exception 'No tenant context'; end if; return v_tenant_id; end; $$;

create or replace function public._uaaf_log_audit(
  p_tenant_id uuid,
  p_integration_key text,
  p_action_category text,
  p_action_key text,
  p_summary text default null,
  p_context jsonb default '{}'::jsonb,
  p_user_id uuid default null,
  p_action_label text default null,
  p_approval_status text default 'recorded',
  p_outcome text default null,
  p_reversal_status text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid; begin
  insert into public.aipify_uaaf_action_audit_logs (
    tenant_id, user_id, integration_key, action_category, action_key, action_label,
    approval_status, outcome, reversal_status, summary, context
  ) values (
    p_tenant_id, coalesce(p_user_id, public._mta_app_user_id()), p_integration_key, p_action_category, p_action_key,
    p_action_label, p_approval_status, p_outcome, p_reversal_status, left(p_summary, 500), p_context
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._uaaf_ensure_settings(p_tenant_id uuid) returns public.aipify_uaaf_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_uaaf_settings; begin
  insert into public.aipify_uaaf_settings (tenant_id, enabled, default_approval_level) values (p_tenant_id, true, 'user_confirmation') on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_uaaf_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._uaaf_seed_integration_catalog(p_tenant_id uuid) returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.aipify_uaaf_integration_access where tenant_id = p_tenant_id limit 1) then return; end if;
  insert into public.aipify_uaaf_integration_access (
    tenant_id, integration_key, integration_label, action_category, access_scope, execute_scope,
    approval_level, logging_required, reversal_available, security_requirements, status
  ) values
    (p_tenant_id, 'print', 'Print Output', 'device', 'tenant', 'approved_users', 'user_confirmation', true, false, '{"requires_confirmation":true}'::jsonb, 'active'),
    (p_tenant_id, 'email', 'Email Draft & Send', 'business', 'tenant', 'approved_users', 'user_confirmation', true, false, '{"requires_confirmation":true}'::jsonb, 'pending'),
    (p_tenant_id, 'calendar', 'Calendar Scheduling', 'business', 'tenant', 'approved_users', 'user_confirmation', true, true, '{"requires_confirmation":true}'::jsonb, 'pending'),
    (p_tenant_id, 'taxi', 'Taxi & Ride Booking', 'personal', 'user', 'approved_users', 'multi_step_approval', true, true, '{"requires_confirmation":true,"spend_limit":true}'::jsonb, 'disabled'),
    (p_tenant_id, 'flowers', 'Gift & Flower Delivery', 'personal', 'user', 'approved_users', 'multi_step_approval', true, true, '{"requires_confirmation":true,"spend_limit":true}'::jsonb, 'disabled'),
    (p_tenant_id, 'commerce_import', 'Commerce Import', 'commerce', 'tenant', 'approved_users', 'multi_step_approval', true, false, '{"requires_confirmation":true}'::jsonb, 'pending'),
    (p_tenant_id, 'desktop_notify', 'Desktop Companion Notify', 'device', 'tenant', 'approved_users', 'automatic', true, false, '{"metadata_only":true}'::jsonb, 'active');
end; $$;

create or replace function public._uaafbp283_distinction_note() returns text language sql immutable as $$
  select 'ABOS Phase 283 — Universal Action Access Framework (FOUNDATIONAL). Permission first — no access, no action. Aipify can do anything it has permission and access to do. Helpers _uaafbp283_*.';
$$;

create or replace function public._uaafbp283_core_principle() returns text language sql immutable as $$
  select 'Aipify can do anything it has permission and access to do';
$$;

create or replace function public._uaafbp283_mission() returns text language sql immutable as $$
  select 'Provide a foundational action access layer — permission first, integration-scoped access, human approval gates, and metadata-only audit for every action Aipify may prepare or execute.';
$$;

create or replace function public._uaafbp283_philosophy() returns text language sql immutable as $$
  select 'People First. Technology Second. Self Love. Wisdom before speed. Companionship before replacement. Growth through support. Stewardship through responsibility. Permission first — no access, no action.';
$$;

create or replace function public._uaafbp283_fundamental_rules() returns jsonb language sql immutable as $$
  select jsonb_build_object('rules', jsonb_build_array(
    jsonb_build_object('key', 'permission_first', 'label', 'Permission first — RBAC and tenant policy before any action'),
    jsonb_build_object('key', 'no_access_no_action', 'label', 'No integration access configured means no action'),
    jsonb_build_object('key', 'human_confirmation', 'label', 'Sensitive actions require explicit user confirmation or multi-step approval'),
    jsonb_build_object('key', 'emergency_stop', 'label', 'Emergency stop and workspace pause must be honored'),
    jsonb_build_object('key', 'audit_every_action', 'label', 'Every proposed or executed action leaves metadata-only audit evidence'),
    jsonb_build_object('key', 'reversal_when_available', 'label', 'Reversible integrations expose reversal status in audit logs'),
    jsonb_build_object('key', 'metadata_only', 'label', 'No raw customer content in action access audit logs')
  ));
$$;

create or replace function public._uaafbp283_action_categories() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'personal', jsonb_build_object('label', 'Personal', 'examples', jsonb_build_array('taxi', 'flowers', 'personal reminders')),
    'business', jsonb_build_object('label', 'Business', 'examples', jsonb_build_array('email', 'calendar', 'meeting follow-up')),
    'commerce', jsonb_build_object('label', 'Commerce', 'examples', jsonb_build_array('commerce_import', 'catalog sync', 'order draft')),
    'workforce', jsonb_build_object('label', 'Workforce', 'examples', jsonb_build_array('task assignment', 'onboarding step', 'shift reminder')),
    'device', jsonb_build_object('label', 'Device', 'examples', jsonb_build_array('print', 'desktop_notify', 'local file export')),
    'future', jsonb_build_object('label', 'Future', 'examples', jsonb_build_array('reserved integrations', 'beta connectors'))
  );
$$;

create or replace function public._uaafbp283_approval_levels() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'automatic', jsonb_build_object('key', 'automatic', 'label', 'Automatic', 'description', 'Low-risk actions within policy may proceed after validation'),
    'user_confirmation', jsonb_build_object('key', 'user_confirmation', 'label', 'User Confirmation', 'description', 'User must confirm before execution'),
    'multi_step_approval', jsonb_build_object('key', 'multi_step_approval', 'label', 'Multi-Step Approval', 'description', 'Requires approval workflow before execution')
  );
$$;

create or replace function public._uaafbp283_action_philosophy() returns text language sql immutable as $$
  select 'Understand → Prepare → Approve → Execute. Companion proposes; humans decide. Aipify never bypasses permission, access scope, or approval gates.';
$$;

create or replace function public._uaafbp283_vision_statement() returns text language sql immutable as $$
  select 'One foundational access layer for every action Aipify may take — transparent permissions, integration-scoped access, and accountable audit across personal, business, commerce, workforce, and device actions.';
$$;

create or replace function public._uaafbp283_desktop_companion_role() returns text language sql immutable as $$
  select 'Desktop Companion executes device-scoped actions (print, notify, local bridges) only after Universal Action Access validation succeeds — never bypassing tenant policy or approval gates.';
$$;

create or replace function public._uaafbp283_ux_offer_prompts() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'en', jsonb_build_object(
      'offer', 'I can help with this action if you approve. Should I continue?',
      'contextual', 'This action requires your confirmation under Action Access policy. Should I prepare it for you?',
      'denied', 'I do not have permission or access to perform this action.',
      'approval_required', 'This action requires approval before I can execute it.'
    ),
    'no', jsonb_build_object(
      'offer', 'Jeg kan hjelpe med denne handlingen hvis du godkjenner. Skal jeg fortsette?',
      'contextual', 'Denne handlingen krever din bekreftelse under Action Access-policyen. Skal jeg forberede den for deg?',
      'denied', 'Jeg har ikke tillatelse eller tilgang til å utføre denne handlingen.',
      'approval_required', 'Denne handlingen krever godkjenning før jeg kan utføre den.'
    )
  );
$$;

create or replace function public._uaafbp283_companion_limitations() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'must_avoid', jsonb_build_array(
      'Executing actions without permission or integration access',
      'Bypassing approval gates or emergency stop',
      'Hiding denied actions from the user',
      'Storing raw customer content in audit logs',
      'Auto-expanding access scope without admin approval',
      'Implying Aipify replaces human accountability'
    ),
    'principle', 'Permission first — no access, no action. Companion prepares and offers; humans confirm and approve.'
  );
$$;

create or replace function public._uaafbp283_privacy_note() returns text language sql immutable as $$
  select 'Universal Action Access metadata only — action labels and summaries max ~500 chars. No raw email, chat, orders, or PII in audit logs. Integration access and permission metadata only.';
$$;

create or replace function public._uaafbp283_security_requirements() returns jsonb language sql immutable as $$
  select jsonb_build_object('requirements', jsonb_build_array(
    jsonb_build_object('key', 'audit_logs', 'label', 'Action audit logs via aipify_uaaf_action_audit_logs — metadata only'),
    jsonb_build_object('key', 'rbac', 'label', 'Role-based access via uaaf.* permissions'),
    jsonb_build_object('key', 'approval_gates', 'label', 'Automatic, user confirmation, and multi-step approval levels enforced'),
    jsonb_build_object('key', 'integration_access', 'label', 'Integration-scoped access catalog with active/disabled/pending status'),
    jsonb_build_object('key', 'emergency_stop', 'label', 'Emergency stop honored when enabled in settings'),
    jsonb_build_object('key', 'metadata_only', 'label', 'No raw customer content stored'),
    jsonb_build_object('key', 'two_factor', 'label', 'Two-factor authentication', 'cross_link', '/app/settings/two-factor')
  ));
$$;

create or replace function public._uaafbp283_integration_links() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'approvals', '/app/approvals',
    'action_center', '/app/action-center',
    'print_output', '/app/settings/devices/printers'
  );
$$;

create or replace function public._uaafbp283_blueprint_summary() returns jsonb language sql stable as $$
  select jsonb_build_object(
    'phase', 'Phase 283 — Universal Action Access Framework',
    'title', 'Universal Action Access Framework (FOUNDATIONAL)',
    'route', '/app/settings/action-access',
    'distinction_note', public._uaafbp283_distinction_note(),
    'core_principle', public._uaafbp283_core_principle(),
    'mission', public._uaafbp283_mission(),
    'philosophy', public._uaafbp283_philosophy(),
    'fundamental_rules', public._uaafbp283_fundamental_rules(),
    'action_categories', public._uaafbp283_action_categories(),
    'approval_levels', public._uaafbp283_approval_levels(),
    'action_philosophy', public._uaafbp283_action_philosophy(),
    'vision_statement', public._uaafbp283_vision_statement(),
    'desktop_companion_role', public._uaafbp283_desktop_companion_role(),
    'ux_offer_prompts', public._uaafbp283_ux_offer_prompts(),
    'companion_limitations', public._uaafbp283_companion_limitations(),
    'privacy_note', public._uaafbp283_privacy_note(),
    'security_requirements', public._uaafbp283_security_requirements(),
    'integration_links', public._uaafbp283_integration_links()
  );
$$;

create or replace function public._uaaf_approval_rank(p_level text) returns int language sql immutable as $$
  select case p_level
    when 'multi_step_approval' then 3
    when 'user_confirmation' then 2
    when 'automatic' then 1
    else 0
  end;
$$;

create or replace function public._uaaf_resolve_approval_level(p_levels text[]) returns text language plpgsql stable as $$
declare
  v_level text;
  v_best text := 'automatic';
begin
  foreach v_level in array p_levels loop
    if public._uaaf_approval_rank(v_level) > public._uaaf_approval_rank(v_best) then
      v_best := v_level;
    end if;
  end loop;
  return v_best;
end; $$;

create or replace function public._uaaf_settings_to_json(p_settings public.aipify_uaaf_settings) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'enabled', p_settings.enabled,
    'emergency_stop_honored', p_settings.emergency_stop_honored,
    'business_hours_only', p_settings.business_hours_only,
    'geographic_limit', p_settings.geographic_limit,
    'default_approval_level', p_settings.default_approval_level
  );
$$;

create or replace function public._uaaf_refresh_metrics(p_tenant_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.aipify_uaaf_settings;
  v_integrations_active int;
  v_integrations_pending int;
  v_permissions_count int;
  v_audit_7d int;
  v_denied_7d int;
begin
  select * into v_settings from public.aipify_uaaf_settings where tenant_id = p_tenant_id;
  select count(*) into v_integrations_active from public.aipify_uaaf_integration_access where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_integrations_pending from public.aipify_uaaf_integration_access where tenant_id = p_tenant_id and status = 'pending';
  select count(*) into v_permissions_count from public.aipify_uaaf_action_permissions where tenant_id = p_tenant_id;
  select count(*) into v_audit_7d from public.aipify_uaaf_action_audit_logs where tenant_id = p_tenant_id and created_at >= now() - interval '7 days';
  select count(*) into v_denied_7d from public.aipify_uaaf_action_audit_logs where tenant_id = p_tenant_id and created_at >= now() - interval '7 days' and coalesce(outcome, '') in ('denied', 'blocked');
  return jsonb_build_object(
    'enabled', coalesce(v_settings.enabled, false),
    'integrations_active', v_integrations_active,
    'integrations_pending', v_integrations_pending,
    'permissions_count', v_permissions_count,
    'audit_events_7d', v_audit_7d,
    'denied_actions_7d', v_denied_7d
  );
end; $$;

create or replace function public.get_universal_action_access_center(p_org_id uuid default null) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_uaaf_settings;
  v_metrics jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._uaaf_require_tenant());
  perform public._irp_require_permission('uaaf.view', v_tenant_id);
  v_settings := public._uaaf_ensure_settings(v_tenant_id);
  perform public._uaaf_seed_integration_catalog(v_tenant_id);
  v_metrics := public._uaaf_refresh_metrics(v_tenant_id);
  perform public._uaaf_log_audit(v_tenant_id, 'uaaf', 'business', 'center_view', 'Action Access Center viewed', jsonb_build_object('metrics', v_metrics), null, 'Center View', 'recorded', 'viewed');
  return jsonb_build_object(
    'has_customer', true,
    'settings', public._uaaf_settings_to_json(v_settings),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'integration_label', i.integration_label,
        'action_category', i.action_category, 'access_scope', i.access_scope, 'execute_scope', i.execute_scope,
        'approval_level', i.approval_level, 'logging_required', i.logging_required, 'reversal_available', i.reversal_available,
        'security_requirements', i.security_requirements, 'status', i.status
      ) order by i.integration_label)
      from public.aipify_uaaf_integration_access i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'permissions_summary', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'subject_type', p.subject_type, 'subject_key', p.subject_key,
        'allowed_categories', p.allowed_categories, 'denied_actions', p.denied_actions,
        'approval_threshold', p.approval_threshold, 'business_hours_only', p.business_hours_only
      ) order by p.subject_type, p.subject_key)
      from public.aipify_uaaf_action_permissions p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'integration_key', a.integration_key, 'action_category', a.action_category,
        'action_key', a.action_key, 'action_label', a.action_label, 'approval_status', a.approval_status,
        'outcome', a.outcome, 'reversal_status', a.reversal_status, 'summary', a.summary, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.aipify_uaaf_action_audit_logs where tenant_id = v_tenant_id order by created_at desc limit 10) a
    ), '[]'::jsonb),
    'blueprint', public._uaafbp283_blueprint_summary(),
    'metrics', v_metrics,
    'privacy_note', public._uaafbp283_privacy_note(),
    'can_manage', public._irp_has_permission('uaaf.manage', v_tenant_id),
    'can_execute', public._irp_has_permission('uaaf.execute', v_tenant_id),
    'can_steward', public._irp_has_permission('uaaf.steward', v_tenant_id)
  );
end; $$;

create or replace function public.update_uaaf_settings(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_uaaf_settings;
begin
  v_tenant_id := public._uaaf_require_tenant();
  perform public._irp_require_permission('uaaf.manage', v_tenant_id);
  v_settings := public._uaaf_ensure_settings(v_tenant_id);
  if p_payload ? 'default_approval_level' and (p_payload->>'default_approval_level') not in ('automatic', 'user_confirmation', 'multi_step_approval') then
    raise exception 'Invalid default approval level';
  end if;
  update public.aipify_uaaf_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    emergency_stop_honored = coalesce((p_payload->>'emergency_stop_honored')::boolean, emergency_stop_honored),
    business_hours_only = coalesce((p_payload->>'business_hours_only')::boolean, business_hours_only),
    geographic_limit = case when p_payload ? 'geographic_limit' then p_payload->>'geographic_limit' else geographic_limit end,
    default_approval_level = coalesce(p_payload->>'default_approval_level', default_approval_level),
    metadata = coalesce(p_payload->'metadata', metadata),
    updated_at = now()
  where tenant_id = v_tenant_id returning * into v_settings;
  perform public._uaaf_log_audit(v_tenant_id, 'uaaf', 'business', 'settings_updated', 'Action Access settings updated', jsonb_build_object('settings', public._uaaf_settings_to_json(v_settings)));
  return public._uaaf_settings_to_json(v_settings);
end; $$;

create or replace function public.upsert_uaaf_integration_access(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_row public.aipify_uaaf_integration_access;
  v_integration_key text;
begin
  v_tenant_id := public._uaaf_require_tenant();
  perform public._irp_require_permission('uaaf.manage', v_tenant_id);
  perform public._uaaf_ensure_settings(v_tenant_id);
  v_integration_key := coalesce(p_payload->>'integration_key', 'integration-' || left(md5(clock_timestamp()::text), 8));
  if p_payload ? 'action_category' and (p_payload->>'action_category') not in ('personal', 'business', 'commerce', 'workforce', 'device', 'future') then
    raise exception 'Invalid action category';
  end if;
  if p_payload ? 'approval_level' and (p_payload->>'approval_level') not in ('automatic', 'user_confirmation', 'multi_step_approval') then
    raise exception 'Invalid approval level';
  end if;
  if p_payload ? 'status' and (p_payload->>'status') not in ('active', 'disabled', 'pending') then
    raise exception 'Invalid integration status';
  end if;
  if p_payload ? 'id' and (p_payload->>'id') is not null then
    update public.aipify_uaaf_integration_access set
      integration_label = coalesce(p_payload->>'integration_label', integration_label),
      action_category = coalesce(p_payload->>'action_category', action_category),
      access_scope = coalesce(p_payload->>'access_scope', access_scope),
      execute_scope = coalesce(p_payload->>'execute_scope', execute_scope),
      approval_level = coalesce(p_payload->>'approval_level', approval_level),
      logging_required = coalesce((p_payload->>'logging_required')::boolean, logging_required),
      reversal_available = coalesce((p_payload->>'reversal_available')::boolean, reversal_available),
      security_requirements = coalesce(p_payload->'security_requirements', security_requirements),
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where id = (p_payload->>'id')::uuid and tenant_id = v_tenant_id
    returning * into v_row;
    if v_row.id is null then raise exception 'Integration access not found'; end if;
  else
    insert into public.aipify_uaaf_integration_access (
      tenant_id, integration_key, integration_label, action_category, access_scope, execute_scope,
      approval_level, logging_required, reversal_available, security_requirements, status
    ) values (
      v_tenant_id, v_integration_key, coalesce(p_payload->>'integration_label', v_integration_key),
      coalesce(p_payload->>'action_category', 'business'), coalesce(p_payload->>'access_scope', 'tenant'),
      coalesce(p_payload->>'execute_scope', 'approved_users'), coalesce(p_payload->>'approval_level', 'user_confirmation'),
      coalesce((p_payload->>'logging_required')::boolean, true), coalesce((p_payload->>'reversal_available')::boolean, false),
      coalesce(p_payload->'security_requirements', '{}'::jsonb), coalesce(p_payload->>'status', 'pending')
    ) on conflict (tenant_id, integration_key) do update set
      integration_label = excluded.integration_label, action_category = excluded.action_category,
      access_scope = excluded.access_scope, execute_scope = excluded.execute_scope,
      approval_level = excluded.approval_level, logging_required = excluded.logging_required,
      reversal_available = excluded.reversal_available, security_requirements = excluded.security_requirements,
      status = excluded.status, updated_at = now()
    returning * into v_row;
  end if;
  perform public._uaaf_log_audit(
    v_tenant_id, v_row.integration_key, v_row.action_category, 'integration_upserted',
    left(v_row.integration_label, 120), jsonb_build_object('integration_id', v_row.id, 'status', v_row.status)
  );
  return jsonb_build_object(
    'id', v_row.id, 'integration_key', v_row.integration_key, 'integration_label', v_row.integration_label,
    'action_category', v_row.action_category, 'access_scope', v_row.access_scope, 'execute_scope', v_row.execute_scope,
    'approval_level', v_row.approval_level, 'logging_required', v_row.logging_required,
    'reversal_available', v_row.reversal_available, 'security_requirements', v_row.security_requirements, 'status', v_row.status
  );
end; $$;

create or replace function public.validate_uaaf_action(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_uaaf_settings;
  v_integration public.aipify_uaaf_integration_access;
  v_integration_key text;
  v_action_category text;
  v_action_key text;
  v_role text;
  v_approval_level text;
  v_permission_row public.aipify_uaaf_action_permissions;
begin
  v_tenant_id := public._uaaf_require_tenant();
  perform public._irp_require_permission('uaaf.execute', v_tenant_id);
  v_integration_key := coalesce(p_payload->>'integration_key', '');
  v_action_category := coalesce(p_payload->>'action_category', '');
  v_action_key := coalesce(p_payload->>'action_key', '');
  if v_integration_key = '' or v_action_key = '' then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'integration_key and action_key are required');
  end if;
  if not public._irp_has_permission('uaaf.execute', v_tenant_id) then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Missing uaaf.execute permission');
  end if;
  v_settings := public._uaaf_ensure_settings(v_tenant_id);
  if not v_settings.enabled then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Universal Action Access is disabled');
  end if;
  if v_settings.emergency_stop_honored and public._tacc_is_emergency_active(v_tenant_id) then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Emergency stop is active');
  end if;
  select * into v_integration from public.aipify_uaaf_integration_access
  where tenant_id = v_tenant_id and integration_key = v_integration_key;
  if v_integration.id is null then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'No integration access configured — no access, no action');
  end if;
  if v_integration.status <> 'active' then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Integration access is not active');
  end if;
  if v_action_category <> '' and v_integration.action_category <> v_action_category then
    return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Action category does not match integration access');
  end if;
  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = v_tenant_id and ou.user_id = public._mta_app_user_id() and ou.status = 'active'
  limit 1;
  select * into v_permission_row from public.aipify_uaaf_action_permissions
  where tenant_id = v_tenant_id and subject_type = 'role' and subject_key = coalesce(v_role, '')
  limit 1;
  if v_permission_row.id is not null then
    if v_permission_row.allowed_categories is not null
      and jsonb_typeof(v_permission_row.allowed_categories) = 'array'
      and jsonb_array_length(v_permission_row.allowed_categories) > 0
      and not (v_permission_row.allowed_categories @> jsonb_build_array(v_integration.action_category)) then
      return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Action category not allowed for role');
    end if;
    if v_permission_row.denied_actions is not null
      and jsonb_typeof(v_permission_row.denied_actions) = 'array'
      and (
        v_permission_row.denied_actions @> jsonb_build_array(v_action_key)
        or v_permission_row.denied_actions @> jsonb_build_array(v_integration_key)
      ) then
      return jsonb_build_object('allowed', false, 'approval_level_required', null, 'reason', 'Action denied by role permission policy');
    end if;
  end if;
  v_approval_level := public._uaaf_resolve_approval_level(array[
    v_settings.default_approval_level,
    v_integration.approval_level,
    coalesce(v_permission_row.approval_threshold, v_settings.default_approval_level)
  ]);
  return jsonb_build_object(
    'allowed', true,
    'approval_level_required', v_approval_level,
    'reason', 'Action permitted within configured access and permissions',
    'integration_key', v_integration_key,
    'action_key', v_action_key,
    'action_category', v_integration.action_category,
    'logging_required', v_integration.logging_required,
    'reversal_available', v_integration.reversal_available
  );
end; $$;

create or replace function public.record_uaaf_action_audit(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_audit_id uuid;
begin
  v_tenant_id := public._uaaf_require_tenant();
  perform public._irp_require_permission('uaaf.execute', v_tenant_id);
  perform public._uaaf_ensure_settings(v_tenant_id);
  if coalesce(p_payload->>'integration_key', '') = '' or coalesce(p_payload->>'action_key', '') = '' then
    raise exception 'integration_key and action_key are required';
  end if;
  v_audit_id := public._uaaf_log_audit(
    v_tenant_id,
    p_payload->>'integration_key',
    coalesce(p_payload->>'action_category', 'business'),
    p_payload->>'action_key',
    coalesce(p_payload->>'summary', p_payload->>'action_label'),
    coalesce(p_payload->'context', '{}'::jsonb),
    nullif(p_payload->>'user_id', '')::uuid,
    p_payload->>'action_label',
    coalesce(p_payload->>'approval_status', 'recorded'),
    p_payload->>'outcome',
    p_payload->>'reversal_status'
  );
  return jsonb_build_object('id', v_audit_id, 'recorded', true);
end; $$;

create or replace function public.propose_uaaf_action(p_payload jsonb) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_validation jsonb;
  v_audit_id uuid;
  v_locale text;
  v_prompts jsonb;
  v_offer_prompt text;
  v_action_label text;
begin
  v_tenant_id := public._uaaf_require_tenant();
  perform public._irp_require_permission('uaaf.execute', v_tenant_id);
  v_validation := public.validate_uaaf_action(p_payload);
  v_locale := coalesce(p_payload->>'locale', 'en');
  v_prompts := public._uaafbp283_ux_offer_prompts();
  v_action_label := coalesce(p_payload->>'action_label', p_payload->>'action_key', 'action');
  if not coalesce((v_validation->>'allowed')::boolean, false) then
    v_offer_prompt := coalesce(v_prompts->v_locale->>'denied', v_prompts->'en'->>'denied');
    return jsonb_build_object(
      'allowed', false,
      'validation', v_validation,
      'offer_prompt', v_offer_prompt,
      'approval_level_required', null
    );
  end if;
  v_audit_id := public._uaaf_log_audit(
    v_tenant_id,
    p_payload->>'integration_key',
    coalesce(v_validation->>'action_category', p_payload->>'action_category', 'business'),
    p_payload->>'action_key',
    left('Proposed: ' || v_action_label, 500),
    jsonb_build_object('proposal', true, 'payload', p_payload, 'validation', v_validation),
    null,
    v_action_label,
    'draft',
    'proposed',
    null
  );
  if (v_validation->>'approval_level_required') = 'multi_step_approval' then
    v_offer_prompt := coalesce(v_prompts->v_locale->>'approval_required', v_prompts->'en'->>'approval_required');
  else
    v_offer_prompt := coalesce(v_prompts->v_locale->>'contextual', v_prompts->'en'->>'contextual');
  end if;
  return jsonb_build_object(
    'allowed', true,
    'validation', v_validation,
    'audit_id', v_audit_id,
    'offer_prompt', v_offer_prompt,
    'approval_level_required', v_validation->>'approval_level_required'
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'universal-action-access-framework', 'Universal Action Access Framework', 'Action Access Center — Organizational Wisdom Era (279–283). Permission first — no access, no action.', 'authenticated', 283
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'universal-action-access-framework' and tenant_id is null);

grant execute on function public.get_universal_action_access_center(uuid) to authenticated;
grant execute on function public.update_uaaf_settings(jsonb) to authenticated;
grant execute on function public.upsert_uaaf_integration_access(jsonb) to authenticated;
grant execute on function public.validate_uaaf_action(jsonb) to authenticated;
grant execute on function public.record_uaaf_action_audit(jsonb) to authenticated;
grant execute on function public.propose_uaaf_action(jsonb) to authenticated;
