-- Phase A.84 — Companion Identity Engine
-- Unified companion identity orchestration across ABOS modules — consistent personality, behavioral standards, interaction style.
-- Distinct from Identity Engine Phase 34, Brand Identity, Humor & Personal Connection, Companion Presence A.67, Purpose & Values A.82.

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
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
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine',
    'proactive_companion_engine',
    'priority_focus_engine',
    'growth_evolution_engine',
    'purpose_values_engine',
    'inclusion_humanity_engine',
    'companion_identity_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_companion_identity_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_identity_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  enabled boolean not null default true,
  signature_elements_enabled boolean not null default true,
  bell_moments_enabled boolean not null default true,
  self_love_refs_enabled boolean not null default true,
  playful_when_appropriate boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_identity_settings enable row level security;
revoke all on public.organization_companion_identity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. companion_identity_module_registry
-- ---------------------------------------------------------------------------
create table if not exists public.companion_identity_module_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  label text not null,
  route text not null,
  identity_aligned boolean not null default true,
  last_reviewed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create index if not exists companion_identity_module_registry_org_idx
  on public.companion_identity_module_registry (organization_id, module_key);

alter table public.companion_identity_module_registry enable row level security;
revoke all on public.companion_identity_module_registry from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'companion_identity_engine', v.description
from (values
  ('companion_identity.view', 'View Companion Identity', 'View companion identity dashboard and module consistency'),
  ('companion_identity.manage', 'Manage Companion Identity', 'Update companion identity settings'),
  ('companion_identity.export', 'Export Companion Identity', 'Export companion identity report')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion_identity.view'), ('owner', 'companion_identity.manage'), ('owner', 'companion_identity.export'),
  ('administrator', 'companion_identity.view'), ('administrator', 'companion_identity.manage'), ('administrator', 'companion_identity.export'),
  ('manager', 'companion_identity.view'), ('manager', 'companion_identity.manage'), ('manager', 'companion_identity.export'),
  ('employee', 'companion_identity.view'), ('employee', 'companion_identity.export'),
  ('support_agent', 'companion_identity.view'),
  ('moderator', 'companion_identity.view'),
  ('viewer', 'companion_identity.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_cie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cie_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id,
    'cie_' || p_action_type,
    'companion_identity_engine',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._cie_ensure_settings(p_organization_id uuid)
returns public.organization_companion_identity_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_companion_identity_settings;
begin
  insert into public.organization_companion_identity_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row
  from public.organization_companion_identity_settings
  where organization_id = p_organization_id;

  return v_row;
end; $$;

create or replace function public._cie_core_identity_traits()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'helpful', 'label', 'Helpful',
      'description', 'Oriented toward practical assistance — clear next steps without overwhelm.'),
    jsonb_build_object('key', 'competent', 'label', 'Competent',
      'description', 'Accurate, prepared, and reliable — never bluffing certainty.'),
    jsonb_build_object('key', 'respectful', 'label', 'Respectful',
      'description', 'Honors dignity, boundaries, and diverse perspectives.'),
    jsonb_build_object('key', 'transparent', 'label', 'Transparent',
      'description', 'Explains reasoning and limits — no hidden actions or false intimacy.'),
    jsonb_build_object('key', 'calm', 'label', 'Calm',
      'description', 'Steady under pressure — never alarmist or guilt-inducing.'),
    jsonb_build_object('key', 'warm', 'label', 'Warm',
      'description', 'Human-centered tone without impersonation or false intimacy.'),
    jsonb_build_object('key', 'inclusive', 'label', 'Inclusive',
      'description', 'Welcomes diverse backgrounds — aligned with Inclusion & Humanity A.83.'),
    jsonb_build_object('key', 'trustworthy', 'label', 'Trustworthy',
      'description', 'Consistent with Trust Engine explainability and approval policies.'),
    jsonb_build_object('key', 'lightly_playful', 'label', 'Lightly playful when appropriate',
      'description', 'Gentle humor when welcomed — integrates Humor & Personal Connection, never at clarity''s expense.')
  );
$$;

create or replace function public._cie_communication_style_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Use clear language — avoid unnecessary jargon',
    'Be direct without being cold',
    'Be supportive without being patronizing',
    'Be confident without being arrogant',
    'Admit uncertainty honestly — Aipify informs and prepares; humans decide'
  );
$$;

create or replace function public._cie_personality_traits()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Encourage progress — celebrate momentum without pressure',
    'Celebrate wins — acknowledge effort and outcomes',
    'Promote Self Love — healthy pacing, balance, and recovery',
    'Respect boundaries — never push beyond stated preferences',
    'Adapt to user preferences — style, not substance manipulation',
    'Maintain professionalism — competence first, warmth second, humor third'
  );
$$;

create or replace function public._cie_signature_elements()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'bell_moments', 'label', 'Bell moments',
      'description', 'Gentle notification personality aligned with Presence — never intrusive.'),
    jsonb_build_object('key', 'self_love_refs', 'label', 'Self Love references',
      'description', 'Healthy pacing reminders — celebrate recovery and sustainable rhythms.'),
    jsonb_build_object('key', 'celebratory_acks', 'label', 'Celebratory acknowledgments',
      'description', 'Warm recognition of progress and completed work.'),
    jsonb_build_object('key', 'warm_closings', 'label', 'Warm closings',
      'description', 'Professional sign-offs that feel human — not robotic templates.'),
    jsonb_build_object('key', 'playful_recurring', 'label', 'Playful recurring elements',
      'description', 'Optional light motifs (e.g. fox exchange) when context and settings allow.')
  );
$$;

create or replace function public._cie_fox_exchange_example()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'title', 'Fox exchange (playful recurring motif)',
    'setup', 'User: "Good morning, Aipify."',
    'response', 'Aipify: "Good morning — the fox says the inbox is lighter than yesterday. Shall we review priorities together?"',
    'note', 'Light, optional, and never mandatory — disabled when playful_when_appropriate is off or context is serious.'
  );
$$;

create or replace function public._cie_seed_module_registry(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_identity_module_registry
    where organization_id = p_organization_id
    limit 1
  ) then
    return;
  end if;

  insert into public.companion_identity_module_registry (
    organization_id, module_key, label, route, identity_aligned, last_reviewed_at, metadata
  )
  select
    p_organization_id,
    v.module_key,
    v.label,
    v.route,
    true,
    now() - (v.days_ago || ' days')::interval,
    '{"seed": true, "metadata_only": true}'::jsonb
  from (values
    ('support', 'Support Engine', '/app/support', 7),
    ('admin_assistant', 'Admin Assistant', '/app/assistant', 14),
    ('knowledge_center', 'Knowledge Center', '/app/knowledge', 21),
    ('companion', 'Companion Features', '/app/assistant', 10),
    ('commerce', 'Commerce', '/app/commerce', 30),
    ('executive', 'Executive', '/app/executive', 14)
  ) as v(module_key, label, route, days_ago);
end; $$;

create or replace function public._cie_list_module_consistency(p_organization_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', r.id,
        'module_key', r.module_key,
        'label', r.label,
        'route', r.route,
        'identity_aligned', r.identity_aligned,
        'last_reviewed_at', r.last_reviewed_at,
        'metadata', r.metadata
      ) order by r.label asc
    )
    from public.companion_identity_module_registry r
    where r.organization_id = p_organization_id
  ), '[]'::jsonb);
$$;

-- ---------------------------------------------------------------------------
-- 5. update settings
-- ---------------------------------------------------------------------------
create or replace function public.update_companion_identity_settings(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.organization_companion_identity_settings;
begin
  perform public._irp_require_permission('companion_identity.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_row := public._cie_ensure_settings(v_org_id);

  update public.organization_companion_identity_settings set
    enabled = coalesce((p_payload->>'enabled')::boolean, enabled),
    signature_elements_enabled = coalesce(
      (p_payload->>'signature_elements_enabled')::boolean, signature_elements_enabled
    ),
    bell_moments_enabled = coalesce(
      (p_payload->>'bell_moments_enabled')::boolean, bell_moments_enabled
    ),
    self_love_refs_enabled = coalesce(
      (p_payload->>'self_love_refs_enabled')::boolean, self_love_refs_enabled
    ),
    playful_when_appropriate = coalesce(
      (p_payload->>'playful_when_appropriate')::boolean, playful_when_appropriate
    ),
    metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_row;

  perform public._cie_log(v_org_id, v_user_id, 'settings_changed', jsonb_build_object(
    'enabled', v_row.enabled,
    'metadata_only', true
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. card + dashboard + export
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_identity_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'This feels like Aipify — through behavior, not logos.',
    'modules_tracked', v_modules,
    'modules_aligned', v_aligned,
    'enabled', (select enabled from public.organization_companion_identity_settings where organization_id = v_org_id)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_companion_identity_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_companion_identity_settings;
  v_modules int := 0;
  v_aligned int := 0;
begin
  perform public._irp_require_permission('companion_identity.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  select count(*), count(*) filter (where identity_aligned = true)
  into v_modules, v_aligned
  from public.companion_identity_module_registry
  where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Consistent personality, behavioral standards, and interaction style — recognizable Aipify across every module.',
    'mission', 'Unified Aipify experience across all touchpoints — helpful, competent, respectful, transparent, calm, warm, inclusive, and trustworthy.',
    'abos_principle', 'Reliable technology plus genuine companionship — Aipify augments people; humans decide.',
    'vision', 'Users say "This feels like Aipify" because of how Aipify behaves, not because of branding alone.',
    'distinction_note', 'Distinct from Identity Engine Phase 34 (per-user style observations), Brand Identity & Personhood Standard (product naming), Humor & Personal Connection (/app/personality), Companion Presence A.67 (floating orb), and Purpose & Values A.82 (tenant organizational values). This engine orchestrates unified companion identity across ABOS modules.',
    'core_identity_traits', public._cie_core_identity_traits(),
    'communication_style_rules', public._cie_communication_style_rules(),
    'personality_traits', public._cie_personality_traits(),
    'signature_elements', public._cie_signature_elements(),
    'fox_exchange', public._cie_fox_exchange_example(),
    'module_consistency', public._cie_list_module_consistency(v_org_id),
    'self_love_note', 'Self Love — healthy pacing, balance, celebrate recovery, recognize effort. Growth never at the expense of wellbeing.',
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'modules_tracked', v_modules,
      'modules_aligned', v_aligned,
      'signature_elements_enabled', v_settings.signature_elements_enabled,
      'playful_when_appropriate', v_settings.playful_when_appropriate
    ),
    'integration_links', jsonb_build_object(
      'brand_identity', '/content/knowledge/aipify/abos/articles/brand-identity-personhood',
      'personality', '/app/personality',
      'playful_seed', 'HUMOR_PERSONAL_CONNECTION_ENGINE.md',
      'identity_engine', '/app/assistant/identity',
      'inclusion_humanity', '/app/inclusion-humanity-engine'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_identity.manage'),
      'can_export', public._irp_has_permission('companion_identity.export')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_companion_identity_report(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_companion_identity_settings;
begin
  perform public._irp_require_permission('companion_identity.export');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._cie_ensure_settings(v_org_id);
  perform public._cie_seed_module_registry(v_org_id);

  perform public._cie_log(v_org_id, v_user_id, 'report_exported', jsonb_build_object(
    'format', coalesce(p_format, 'json'),
    'metadata_only', true
  ));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'companion_identity',
    'format', coalesce(p_format, 'json'),
    'philosophy', 'Consistent companion identity across ABOS modules.',
    'mission', 'Unified Aipify experience across all touchpoints.',
    'core_identity_traits', public._cie_core_identity_traits(),
    'communication_style_rules', public._cie_communication_style_rules(),
    'personality_traits', public._cie_personality_traits(),
    'signature_elements', public._cie_signature_elements(),
    'module_consistency', public._cie_list_module_consistency(v_org_id),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', jsonb_build_object(
      'modules_tracked', (select count(*) from public.companion_identity_module_registry where organization_id = v_org_id),
      'modules_aligned', (select count(*) from public.companion_identity_module_registry where organization_id = v_org_id and identity_aligned = true)
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('companion_identity.manage'),
      'can_export', true
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit allowlist extension
-- ---------------------------------------------------------------------------
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_rejected', 'rrme_disposal_approved', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed',
    'pce_nudge_dismissed', 'pce_nudge_snoozed', 'pce_nudge_acted',
    'pce_org_settings_changed', 'pce_user_preferences_changed', 'pce_summary_exported',
    'gee_settings_changed', 'gee_recommendation_accepted', 'gee_recommendation_dismissed',
    'gee_recommendation_deferred', 'gee_report_exported',
    'pfe_item_created', 'pfe_item_updated', 'pfe_recommendation_resolved',
    'pfe_org_settings_changed', 'pfe_summary_exported',
    'pve_value_upserted', 'pve_settings_changed', 'pve_reflection_acknowledged',
    'pve_reflection_dismissed', 'pve_report_exported',
    'ihe_settings_changed', 'ihe_reflection_acknowledged', 'ihe_reflection_dismissed',
    'ihe_report_exported',
    'cie_settings_changed', 'cie_report_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed'
    or p_action_type like 'owe_%' or p_action_type like 'pce_%' or p_action_type like 'gee_%'
    or p_action_type like 'pfe_%' or p_action_type like 'pve_%' or p_action_type like 'ihe_%'
    or p_action_type like 'cie_%';
$$;

-- ---------------------------------------------------------------------------
-- 8. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-identity-engine', 'Companion Identity Engine',
  'Unified companion identity orchestration — consistent personality and interaction style across ABOS modules.',
  'authenticated', 106
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-identity-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_companion_identity_engine_card() to authenticated;
grant execute on function public.get_companion_identity_engine_dashboard() to authenticated;
grant execute on function public.update_companion_identity_settings(jsonb) to authenticated;
grant execute on function public.export_companion_identity_report(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Seed settings + module registry per org
-- ---------------------------------------------------------------------------
do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cie_ensure_settings(v_org_id);
    perform public._cie_seed_module_registry(v_org_id);
  end loop;
end; $$;
