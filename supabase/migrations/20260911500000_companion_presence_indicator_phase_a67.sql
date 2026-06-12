-- Phase A.67 — Companion Presence Indicator & Online Status Engine
-- Floating companion orb for Customer App — system presence only, not employee surveillance.
-- Extends Command Center (A.26), Desktop Presence (A.25), Admin Assistant (A.6), Personal Productivity (A.70).

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
    'personal_productivity_engine',
    'companion_presence_indicator_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. companion_presence
-- ---------------------------------------------------------------------------
create table if not exists public.companion_presence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  device_id text not null,
  connection_status text not null default 'online' check (
    connection_status in ('online', 'idle', 'disconnected')
  ),
  last_seen_at timestamptz not null default now(),
  current_state text not null default 'idle' check (
    current_state in ('idle', 'working', 'attention_needed', 'critical_alert', 'disconnected', 'quiet_mode')
  ),
  current_activity text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, device_id)
);

create index if not exists companion_presence_org_user_idx
  on public.companion_presence (organization_id, user_id, last_seen_at desc);

alter table public.companion_presence enable row level security;
revoke all on public.companion_presence from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. companion_presence_settings (org)
-- ---------------------------------------------------------------------------
create table if not exists public.companion_presence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  indicator_enabled boolean not null default true,
  heartbeat_interval_seconds int not null default 60,
  show_since_last_login boolean not null default true,
  show_task_counts boolean not null default true,
  show_approval_counts boolean not null default true,
  show_notification_counts boolean not null default true,
  critical_alert_requires_ack boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.companion_presence_settings enable row level security;
revoke all on public.companion_presence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. companion_presence_user_preferences (user scaffold)
-- ---------------------------------------------------------------------------
create table if not exists public.companion_presence_user_preferences (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  indicator_collapsed boolean not null default false,
  quiet_mode_enabled boolean not null default false,
  quiet_mode_until timestamptz,
  reduced_motion_preferred boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

alter table public.companion_presence_user_preferences enable row level security;
revoke all on public.companion_presence_user_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. companion_presence_audit_logs (significant events only)
-- ---------------------------------------------------------------------------
create table if not exists public.companion_presence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null check (
    action_type in ('critical_alert_acknowledged', 'quiet_mode_changed', 'org_settings_changed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists companion_presence_audit_org_idx
  on public.companion_presence_audit_logs (organization_id, created_at desc);

alter table public.companion_presence_audit_logs enable row level security;
revoke all on public.companion_presence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions — companion.view / companion.manage
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'companion_presence', v.description
from (values
  ('companion.view', 'View Companion Presence', 'View companion presence indicator and status summaries'),
  ('companion.manage', 'Manage Companion Presence', 'Configure org companion presence settings and acknowledge critical alerts')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'companion.view'), ('owner', 'companion.manage'),
  ('administrator', 'companion.view'), ('administrator', 'companion.manage'),
  ('manager', 'companion.view'), ('manager', 'companion.manage'),
  ('support_agent', 'companion.view'),
  ('viewer', 'companion.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_cpie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._cpie_log(
  p_organization_id uuid,
  p_user_id uuid,
  p_action_type text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_action_type not in ('critical_alert_acknowledged', 'quiet_mode_changed', 'org_settings_changed') then
    return;
  end if;

  insert into public.companion_presence_audit_logs (
    organization_id, user_id, action_type, metadata
  ) values (
    p_organization_id, p_user_id, p_action_type, coalesce(p_metadata, '{}'::jsonb)
  );

  perform public._mta_create_audit_log(
    p_organization_id,
    'cpie_' || p_action_type,
    'companion_presence',
    null,
    false,
    false,
    p_user_id,
    coalesce(p_metadata, '{}'::jsonb)
  );
end; $$;

create or replace function public._cpie_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_presence_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cpie_ensure_user_prefs(
  p_organization_id uuid,
  p_user_id uuid
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_presence_user_preferences (organization_id, user_id)
  values (p_organization_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;
end; $$;

create or replace function public._cpie_derive_state(
  p_organization_id uuid,
  p_user_id uuid,
  p_quiet_mode boolean default false
)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_pending_approvals int := 0;
  v_critical_ops int := 0;
  v_attention int := 0;
begin
  if coalesce(p_quiet_mode, false) then
    return 'quiet_mode';
  end if;

  if exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    select count(*) into v_pending_approvals
    from public.ai_action_requests
    where organization_id = p_organization_id and status = 'pending';

    select count(*) into v_critical_ops
    from public.ai_action_requests
    where organization_id = p_organization_id
      and status = 'pending'
      and risk_level = 'high';
  end if;

  if v_critical_ops > 0 then
    return 'critical_alert';
  end if;

  if exists (select 1 from pg_tables where tablename = 'operations_events' and schemaname = 'public') then
    select count(*) into v_attention
    from public.operations_events
    where organization_id = p_organization_id
      and status in ('new', 'acknowledged', 'in_progress')
      and priority in ('high', 'critical');
  end if;

  if v_pending_approvals > 0 or v_attention > 0 then
    return 'attention_needed';
  end if;

  if exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    if exists (
      select 1 from public.organization_tasks
      where organization_id = p_organization_id
        and assigned_user_id = p_user_id
        and status in ('open', 'in_progress')
      limit 1
    ) then
      return 'working';
    end if;
  end if;

  return 'idle';
end; $$;

create or replace function public._cpie_summary_counts(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tasks int := 0;
  v_approvals int := 0;
  v_notifications int := 0;
begin
  if exists (select 1 from pg_tables where tablename = 'organization_tasks' and schemaname = 'public') then
    select count(*) into v_tasks
    from public.organization_tasks
    where organization_id = p_organization_id
      and assigned_user_id = p_user_id
      and status in ('open', 'in_progress', 'overdue');
  end if;

  if exists (select 1 from pg_tables where tablename = 'ai_action_requests' and schemaname = 'public') then
    select count(*) into v_approvals
    from public.ai_action_requests
    where organization_id = p_organization_id and status = 'pending';
  end if;

  if exists (select 1 from pg_tables where tablename = 'admin_assistant_notifications' and schemaname = 'public') then
    select count(*) into v_notifications
    from public.admin_assistant_notifications
    where organization_id = p_organization_id
      and (user_id is null or user_id = p_user_id)
      and read_at is null;
  end if;

  return jsonb_build_object(
    'open_tasks', v_tasks,
    'pending_approvals', v_approvals,
    'unread_notifications', v_notifications
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. record_companion_heartbeat
-- ---------------------------------------------------------------------------
create or replace function public.record_companion_heartbeat(
  p_device_id text,
  p_connection_status text default 'online',
  p_current_activity text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_state text;
  v_quiet boolean := false;
  v_row public.companion_presence%rowtype;
begin
  perform public._irp_require_permission('companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  perform public._cpie_ensure_settings(v_org_id);
  perform public._cpie_ensure_user_prefs(v_org_id, v_user_id);

  select quiet_mode_enabled into v_quiet
  from public.companion_presence_user_preferences
  where organization_id = v_org_id and user_id = v_user_id;

  v_state := public._cpie_derive_state(v_org_id, v_user_id, coalesce(v_quiet, false));

  insert into public.companion_presence (
    organization_id, user_id, device_id, connection_status, last_seen_at,
    current_state, current_activity, metadata, updated_at
  ) values (
    v_org_id, v_user_id, coalesce(nullif(trim(p_device_id), ''), 'web-default'),
    coalesce(p_connection_status, 'online'),
    now(),
    v_state,
    p_current_activity,
    coalesce(p_metadata, '{}'::jsonb),
    now()
  )
  on conflict (organization_id, user_id, device_id) do update set
    connection_status = excluded.connection_status,
    last_seen_at = now(),
    current_state = v_state,
    current_activity = coalesce(excluded.current_activity, companion_presence.current_activity),
    metadata = companion_presence.metadata || excluded.metadata,
    updated_at = now()
  returning * into v_row;

  return jsonb_build_object(
    'recorded', true,
    'presence', row_to_json(v_row)::jsonb,
    'derived_state', v_state
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. update_companion_presence_state
-- ---------------------------------------------------------------------------
create or replace function public.update_companion_presence_state(
  p_state text default null,
  p_quiet_mode_enabled boolean default null,
  p_quiet_mode_until timestamptz default null,
  p_indicator_collapsed boolean default null,
  p_acknowledge_critical boolean default false,
  p_org_settings jsonb default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.companion_presence_user_preferences%rowtype;
  v_settings public.companion_presence_settings%rowtype;
  v_derived text;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._cpie_ensure_settings(v_org_id);
  perform public._cpie_ensure_user_prefs(v_org_id, v_user_id);

  select * into v_prefs
  from public.companion_presence_user_preferences
  where organization_id = v_org_id and user_id = v_user_id;

  if p_quiet_mode_enabled is not null or p_quiet_mode_until is not null or p_indicator_collapsed is not null then
    perform public._irp_require_permission('companion.view');
  end if;

  if p_org_settings is not null then
    perform public._irp_require_permission('companion.manage');
    update public.companion_presence_settings set
      indicator_enabled = coalesce((p_org_settings->>'indicator_enabled')::boolean, indicator_enabled),
      heartbeat_interval_seconds = coalesce((p_org_settings->>'heartbeat_interval_seconds')::int, heartbeat_interval_seconds),
      show_since_last_login = coalesce((p_org_settings->>'show_since_last_login')::boolean, show_since_last_login),
      show_task_counts = coalesce((p_org_settings->>'show_task_counts')::boolean, show_task_counts),
      show_approval_counts = coalesce((p_org_settings->>'show_approval_counts')::boolean, show_approval_counts),
      show_notification_counts = coalesce((p_org_settings->>'show_notification_counts')::boolean, show_notification_counts),
      critical_alert_requires_ack = coalesce((p_org_settings->>'critical_alert_requires_ack')::boolean, critical_alert_requires_ack),
      updated_at = now()
    where organization_id = v_org_id;

    perform public._cpie_log(v_org_id, v_user_id, 'org_settings_changed', p_org_settings);
  end if;

  if p_quiet_mode_enabled is not null or p_quiet_mode_until is not null then
    update public.companion_presence_user_preferences set
      quiet_mode_enabled = coalesce(p_quiet_mode_enabled, quiet_mode_enabled),
      quiet_mode_until = coalesce(p_quiet_mode_until, quiet_mode_until),
      updated_at = now()
    where organization_id = v_org_id and user_id = v_user_id;

    if p_quiet_mode_enabled is not null then
      perform public._cpie_log(v_org_id, v_user_id, 'quiet_mode_changed', jsonb_build_object(
        'quiet_mode_enabled', p_quiet_mode_enabled,
        'quiet_mode_until', p_quiet_mode_until
      ));
    end if;
  end if;

  if p_indicator_collapsed is not null then
    update public.companion_presence_user_preferences set
      indicator_collapsed = p_indicator_collapsed,
      updated_at = now()
    where organization_id = v_org_id and user_id = v_user_id;
  end if;

  if coalesce(p_acknowledge_critical, false) then
    perform public._irp_require_permission('companion.manage');
    perform public._cpie_log(v_org_id, v_user_id, 'critical_alert_acknowledged', jsonb_build_object(
      'acknowledged_at', now()
    ));
  end if;

  if p_state is not null then
    update public.companion_presence set
      current_state = p_state,
      updated_at = now()
    where organization_id = v_org_id and user_id = v_user_id;
  end if;

  select * into v_prefs
  from public.companion_presence_user_preferences
  where organization_id = v_org_id and user_id = v_user_id;

  select * into v_settings
  from public.companion_presence_settings
  where organization_id = v_org_id;

  v_derived := public._cpie_derive_state(v_org_id, v_user_id, v_prefs.quiet_mode_enabled);

  return jsonb_build_object(
    'updated', true,
    'derived_state', v_derived,
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'org_settings', row_to_json(v_settings)::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. get_companion_presence_bundle
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_presence_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.companion_presence_user_preferences%rowtype;
  v_settings public.companion_presence_settings%rowtype;
  v_since jsonb;
  v_counts jsonb;
  v_derived text;
  v_presence jsonb;
begin
  perform public._irp_require_permission('companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  perform public._cpie_ensure_settings(v_org_id);
  perform public._cpie_ensure_user_prefs(v_org_id, v_user_id);

  select * into v_prefs
  from public.companion_presence_user_preferences
  where organization_id = v_org_id and user_id = v_user_id;

  select * into v_settings
  from public.companion_presence_settings
  where organization_id = v_org_id;

  v_derived := public._cpie_derive_state(v_org_id, v_user_id, v_prefs.quiet_mode_enabled);
  v_counts := public._cpie_summary_counts(v_org_id, v_user_id);

  begin
    v_since := public.get_since_last_login_summary();
  exception when others then
    v_since := jsonb_build_object('available', false);
  end;

  select coalesce(jsonb_agg(row_to_json(p) order by p.last_seen_at desc), '[]'::jsonb)
  into v_presence
  from public.companion_presence p
  where p.organization_id = v_org_id and p.user_id = v_user_id
  limit 5;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'System presence only — Aipify informs, humans decide. Not employee surveillance.',
    'privacy_note', 'Companion presence reflects Aipify system status and your operational summaries — never keystrokes, screens, or colleague monitoring.',
    'indicator_enabled', coalesce(v_settings.indicator_enabled, true),
    'current_state', v_derived,
    'connection_status', 'online',
    'heartbeat_interval_seconds', coalesce(v_settings.heartbeat_interval_seconds, 60),
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'org_settings', row_to_json(v_settings)::jsonb,
    'since_last_login', v_since,
    'counts', v_counts,
    'devices', v_presence,
    'links', jsonb_build_object(
      'ask_aipify', '/app/assistant',
      'approvals', '/app/approvals',
      'command_center', '/app/command-center',
      'settings', '/app/settings/companion-presence'
    ),
    'integration_notes', jsonb_build_object(
      'command_center', 'Shares notification and approval context — A.26',
      'admin_assistant', 'Since-last-login summaries — A.6',
      'personal_productivity', 'Orb productivity counts — A.70'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. A.70 integration — replace scaffold summary
-- ---------------------------------------------------------------------------
create or replace function public._ppe_companion_presence_summary(
  p_organization_id uuid,
  p_user_id uuid
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_counts jsonb;
declare v_prefs record;
declare v_derived text;
begin
  v_counts := public._cpie_summary_counts(p_organization_id, p_user_id);

  select quiet_mode_enabled into v_prefs
  from public.companion_presence_user_preferences
  where organization_id = p_organization_id and user_id = p_user_id;

  v_derived := public._cpie_derive_state(
    p_organization_id,
    p_user_id,
    coalesce(v_prefs.quiet_mode_enabled, false)
  );

  return jsonb_build_object(
    'available', true,
    'companion_presence_scaffold', false,
    'current_state', v_derived,
    'pending_approvals', coalesce((v_counts->>'pending_approvals')::int, 0),
    'open_tasks', coalesce((v_counts->>'open_tasks')::int, 0),
    'quiet_hours_respected', coalesce(v_prefs.quiet_mode_enabled, false),
    'metadata_only', true
  );
exception when others then
  return jsonb_build_object('available', false, 'companion_presence_scaffold', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Audit allowlist extension
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
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
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
    'goke_objective_created', 'goke_objective_activated', 'goke_key_result_created',
    'goke_progress_updated', 'goke_progress_overridden', 'goke_objective_completed',
    'goke_manifest_exported',
    'cpie_critical_alert_acknowledged', 'cpie_quiet_mode_changed', 'cpie_org_settings_changed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-presence-engine', 'Companion Presence Engine', 'Floating companion indicator — system presence and operational summaries only. Not employee surveillance.', 'authenticated', 95
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'companion-presence-engine' and tenant_id is null);

grant execute on function public.record_companion_heartbeat(text, text, text, jsonb) to authenticated;
grant execute on function public.update_companion_presence_state(text, boolean, timestamptz, boolean, boolean, jsonb) to authenticated;
grant execute on function public.get_companion_presence_bundle() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._cpie_ensure_settings(v_org_id);
  end loop;
end; $$;
