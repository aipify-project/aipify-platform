-- Phase A.33 — Continuous Improvement Engine (updates decision_explanations + audit)

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
    'continuous_improvement_engine'
  )
);

create table if not exists public.improvement_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source text not null,
  category text not null,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'strategic')),
  status text not null default 'identified' check (status in ('identified', 'under_review', 'approved', 'implemented', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.improvement_items enable row level security;
revoke all on public.improvement_items from authenticated, anon;

create table if not exists public.improvement_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feedback_type text not null check (feedback_type in ('recommendation', 'support', 'usability', 'feature_request', 'workflow')),
  rating int check (rating between 1 and 5),
  comment_summary text,
  submitted_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.improvement_feedback enable row level security;
revoke all on public.improvement_feedback from authenticated, anon;

create table if not exists public.improvement_outcomes (
  id uuid primary key default gen_random_uuid(),
  improvement_item_id uuid not null references public.improvement_items (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  outcome_metric_key text not null,
  baseline_value numeric not null default 0,
  outcome_value numeric not null default 0,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.improvement_outcomes enable row level security;
revoke all on public.improvement_outcomes from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'continuous_improvement', v.description
from (values
  ('improvements.view', 'View Improvements', 'View improvement items'),
  ('improvements.manage', 'Manage Improvements', 'Create and manage improvements'),
  ('improvements.approve', 'Approve Improvements', 'Approve improvement items'),
  ('improvements.dismiss', 'Dismiss Improvements', 'Dismiss improvement items')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

create or replace function public._cie_log(
  p_organization_id uuid, p_action_type text, p_entity_type text default 'improvement',
  p_entity_id uuid default null, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata);
end; $$;

create or replace function public._cie_seed_items(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.improvement_items (organization_id, source, category, title, description, priority, status)
  select p_organization_id, v.src, v.cat, v.title, v.item_description, v.pri, v.status
  from (values
    ('quality_guardian', 'support', 'Reduce support escalations', 'Review escalation patterns from quality findings', 'high', 'identified'),
    ('customer_success', 'adoption', 'Improve module adoption', 'Low adoption scores suggest onboarding enhancements', 'strategic', 'under_review'),
    ('user_feedback', 'knowledge', 'Expand Knowledge Center FAQs', 'Recurring support topics indicate documentation gaps', 'medium', 'identified')
  ) as v(src, cat, title, item_description, pri, status)
  where not exists (select 1 from public.improvement_items where organization_id = p_organization_id limit 1);
end; $$;

create or replace function public.submit_improvement_feedback(
  p_feedback_type text, p_rating int default null, p_comment_summary text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  insert into public.improvement_feedback (organization_id, feedback_type, rating, comment_summary)
  values (v_org_id, p_feedback_type, p_rating, left(coalesce(p_comment_summary, ''), 500))
  returning id into v_id;
  perform public._cie_log(v_org_id, 'improvement_feedback_submitted', 'improvement_feedback', v_id, jsonb_build_object('type', p_feedback_type));
  return jsonb_build_object('id', v_id);
end; $$;

create or replace function public.approve_improvement_item(p_item_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.approve');
  v_org_id := public._mta_require_organization();
  update public.improvement_items set status = 'approved', updated_at = now()
  where id = p_item_id and organization_id = v_org_id;
  perform public._cie_log(v_org_id, 'improvement_approved', 'improvement_item', p_item_id, '{}'::jsonb);
  return jsonb_build_object('id', p_item_id, 'status', 'approved');
end; $$;

create or replace function public.dismiss_improvement_item(p_item_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.dismiss');
  v_org_id := public._mta_require_organization();
  update public.improvement_items set status = 'dismissed', updated_at = now()
  where id = p_item_id and organization_id = v_org_id;
  perform public._cie_log(v_org_id, 'improvement_dismissed', 'improvement_item', p_item_id, '{}'::jsonb);
  return jsonb_build_object('id', p_item_id, 'status', 'dismissed');
end; $$;

create or replace function public.get_continuous_improvement_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('improvements.view');
  v_org_id := public._mta_require_organization();
  perform public._cie_seed_items(v_org_id);
  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Human-guided continuous improvement — feedback drives refinement without silent auto-changes.',
    'principles', jsonb_build_array('Human-guided improvement', 'Explainable optimization', 'Outcome validation', 'Feedback collection', 'Governance-respecting'),
    'summary', jsonb_build_object(
      'active', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
      'implemented', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status = 'implemented'), 0),
      'feedback_count', coalesce((select count(*) from public.improvement_feedback where organization_id = v_org_id), 0)
    ),
    'items', coalesce((
      select jsonb_agg(row_to_json(i) order by case i.priority when 'strategic' then 0 when 'high' then 1 else 2 end, i.created_at desc)
      from public.improvement_items i where i.organization_id = v_org_id and i.status != 'dismissed'
    ), '[]'::jsonb),
    'recent_feedback', coalesce((
      select jsonb_agg(row_to_json(f) order by f.created_at desc)
      from public.improvement_feedback f where f.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'outcomes', coalesce((
      select jsonb_agg(row_to_json(o) order by o.measured_at desc)
      from public.improvement_outcomes o where o.organization_id = v_org_id limit 10
    ), '[]'::jsonb)
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_continuous_improvement_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_improvements', coalesce((select count(*) from public.improvement_items where organization_id = v_org_id and status in ('identified', 'under_review', 'approved')), 0),
    'philosophy', 'Continuous refinement through feedback and outcomes.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

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
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed',
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted',
    'success_health_assessed', 'success_intervention_created',
    'status_event_recorded', 'incident_published', 'incident_updated', 'incident_resolved',
    'maintenance_announced', 'status_configuration_changed', 'status_override_applied',
    'enterprise_setting_changed', 'delegated_admin_assigned', 'approval_chain_updated',
    'approval_override_applied', 'readiness_assessment_recorded', 'enterprise_export_generated',
    'memory_record_created', 'memory_record_updated', 'memory_record_archived',
    'memory_record_superseded', 'memory_record_restored', 'memory_visibility_changed',
    'memory_captured', 'decision_register_created', 'memory_review_scheduled',
    'memory_review_completed', 'memory_settings_changed',
    'training_assigned', 'training_progress_recorded', 'training_completed',
    'training_assessment_submitted', 'learning_path_updated', 'training_settings_changed',
    'license_created', 'seat_assigned', 'seat_revoked',
    'device_registered', 'device_revoked',
    'enrollment_token_created', 'enrollment_token_revoked',
    'deployment_invite_sent', 'domain_verification_started',
    'sso_config_updated', 'scim_settings_updated',
    'baseline_changed', 'impact_report_exported',
    'compliance_review_completed', 'compliance_report_exported', 'compliance_status_changed',
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'continuous-improvement-engine', 'Continuous Improvement Engine', 'Feedback-driven operational improvement.', 'authenticated', 75
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'continuous-improvement-engine' and tenant_id is null);

grant execute on function public.get_continuous_improvement_engine_dashboard() to authenticated;
grant execute on function public.get_continuous_improvement_engine_card() to authenticated;
grant execute on function public.submit_improvement_feedback(text, int, text) to authenticated;
grant execute on function public.approve_improvement_item(uuid) to authenticated;
grant execute on function public.dismiss_improvement_item(uuid) to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop perform public._cie_seed_items(v_org_id); end loop;
end $$;
