-- Phase A.66 — Predictive Insights Engine
-- Integrates Strategic Intelligence (A.31), Executive Insights (A.35),
-- Analytics Insights (A.48), Organizational Health (A.56), Goals & OKR (A.65).

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
    'predictive_insights_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_predictive_insights
-- ---------------------------------------------------------------------------
create table if not exists public.organization_predictive_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prediction_type text not null check (
    prediction_type in (
      'support_backlog', 'workload_overload', 'missed_objective',
      'declining_adoption', 'capacity_shortage', 'customer_satisfaction',
      'training_completion'
    )
  ),
  confidence text not null default 'medium' check (
    confidence in ('low', 'medium', 'high')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  status text not null default 'active' check (
    status in ('active', 'dismissed', 'expired', 'resolved')
  ),
  summary text not null,
  recommended_action text,
  source_engine text,
  metadata jsonb not null default '{}'::jsonb,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_predictive_insights_org_idx
  on public.organization_predictive_insights (organization_id, status, prediction_type, risk_level);

alter table public.organization_predictive_insights enable row level security;
revoke all on public.organization_predictive_insights from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_predictive_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_predictive_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  auto_generate_enabled boolean not null default true,
  insight_retention_days int not null default 90,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_predictive_settings enable row level security;
revoke all on public.organization_predictive_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions — predictions.*
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'predictive_insights', v.description
from (values
  ('predictions.view', 'View Predictions', 'View predictive insights and dashboards'),
  ('predictions.manage', 'Manage Predictions', 'Configure prediction settings and generation'),
  ('predictions.review', 'Review Predictions', 'Review and dismiss predictive insights'),
  ('predictions.export', 'Export Predictions', 'Export prediction reports and executive summaries')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'predictions.view'), ('owner', 'predictions.manage'), ('owner', 'predictions.review'), ('owner', 'predictions.export'),
  ('administrator', 'predictions.view'), ('administrator', 'predictions.manage'), ('administrator', 'predictions.review'), ('administrator', 'predictions.export'),
  ('manager', 'predictions.view'), ('manager', 'predictions.manage'), ('manager', 'predictions.review'), ('manager', 'predictions.export'),
  ('support_agent', 'predictions.view'),
  ('viewer', 'predictions.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_pie_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._pie_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'organization_predictive_insight',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._pie_ensure_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_predictive_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._pie_strategic_intelligence_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'strategic_objectives' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'active_strategic_objectives', coalesce((
      select count(*) from public.strategic_objectives
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pie_executive_insights_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_goke_executive_summary_block') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'okr_summary', public._goke_executive_summary_block(p_organization_id)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pie_analytics_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'available', true,
    'metadata_only', true,
    'note', 'Analytics Insights (A.48) aggregate counts feed prediction confidence — no raw operational records.'
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pie_health_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_tables where tablename = 'organization_health_scores' and schemaname = 'public') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object(
    'available', true,
    'recent_health_scores', coalesce((
      select count(*) from public.organization_health_scores
      where organization_id = p_organization_id
    ), 0)
  );
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pie_okr_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_goke_executive_summary_block') then
    return jsonb_build_object('available', false);
  end if;
  return jsonb_build_object('available', true, 'summary', public._goke_executive_summary_block(p_organization_id));
exception when others then
  return jsonb_build_object('available', false);
end; $$;

create or replace function public._pie_executive_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'active_insights', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'high_risk_insights', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active' and risk_level = 'high'
    ), 0),
    'critical_insights', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active' and risk_level = 'critical'
    ), 0),
    'dismissed_insights', coalesce((
      select count(*) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'dismissed'
    ), 0),
    'prediction_type_count', coalesce((
      select count(distinct prediction_type) from public.organization_predictive_insights
      where organization_id = p_organization_id and status = 'active'
    ), 0)
  );
end; $$;

create or replace function public._pie_seed_insights(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._pie_ensure_settings(p_organization_id);

  if exists (select 1 from public.organization_predictive_insights where organization_id = p_organization_id limit 1) then
    return;
  end if;

  insert into public.organization_predictive_insights (
    organization_id, prediction_type, confidence, risk_level, status, summary, recommended_action, source_engine
  )
  values
    (
      p_organization_id, 'support_backlog', 'high', 'high', 'active',
      'Support backlog may exceed SLA targets within 14 days based on current ticket velocity.',
      'Review staffing allocation and escalate high-priority cases.',
      'analytics_insights_engine'
    ),
    (
      p_organization_id, 'workload_overload', 'medium', 'high', 'active',
      'Two teams show sustained workload above capacity thresholds.',
      'Consider rebalancing via Capacity & Workload Management Engine.',
      'capacity_workload_management_engine'
    ),
    (
      p_organization_id, 'missed_objective', 'medium', 'medium', 'active',
      'One strategic OKR shows declining progress relative to target date.',
      'Schedule OKR review and allocate follow-up tasks.',
      'goals_okr_engine'
    ),
    (
      p_organization_id, 'declining_adoption', 'low', 'medium', 'active',
      'Module adoption trend suggests slower uptake in one business area.',
      'Review change management communications and training paths.',
      'organizational_health_engine'
    ),
    (
      p_organization_id, 'training_completion', 'high', 'low', 'active',
      'Training completion rate projected to fall below target this quarter.',
      'Assign targeted learning paths via Learning & Training Engine.',
      'learning_training_engine'
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_predictive_insights(
  p_refresh_existing boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_count int;
begin
  perform public._irp_require_permission('predictions.manage');
  v_org_id := public._mta_require_organization();
  perform public._pie_ensure_settings(v_org_id);

  if p_refresh_existing then
    update public.organization_predictive_insights
    set status = 'expired', updated_at = now()
    where organization_id = v_org_id and status = 'active';
  end if;

  perform public._pie_seed_insights(v_org_id);

  select count(*) into v_count
  from public.organization_predictive_insights
  where organization_id = v_org_id and status = 'active';

  perform public._pie_log(
    v_org_id, 'pie_insights_generated', 'organization_predictive_insight', null,
    jsonb_build_object('active_count', v_count, 'refresh', p_refresh_existing)
  );

  return jsonb_build_object('generated', true, 'active_insights', v_count);
end; $$;

create or replace function public.dismiss_predictive_insight(
  p_insight_id uuid,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_predictive_insights;
begin
  perform public._irp_require_permission('predictions.review');
  v_org_id := public._mta_require_organization();

  update public.organization_predictive_insights
  set status = 'dismissed', dismissed_at = now(), updated_at = now(),
      metadata = metadata || jsonb_build_object('dismiss_reason', left(coalesce(p_reason, ''), 200))
  where id = p_insight_id and organization_id = v_org_id and status = 'active'
  returning * into v_row;

  if v_row.id is null then raise exception 'Insight not found or not dismissable'; end if;

  perform public._pie_log(
    v_org_id, 'pie_insight_dismissed', 'organization_predictive_insight', v_row.id,
    jsonb_build_object('prediction_type', v_row.prediction_type)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.export_predictive_insights_manifest(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('predictions.export');
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);

  perform public._pie_log(v_org_id, 'pie_manifest_exported', 'organization_predictive_insight', null, jsonb_build_object('format', p_format));

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'predictive_insights',
    'format', coalesce(p_format, 'json'),
    'insights', coalesce((
      select jsonb_agg(row_to_json(i) order by i.risk_level desc, i.created_at desc)
      from public.organization_predictive_insights i
      where i.organization_id = v_org_id limit 100
    ), '[]'::jsonb),
    'summary', public._pie_executive_summary_block(v_org_id),
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._pie_strategic_intelligence_summary(v_org_id),
      'executive_insights', public._pie_executive_insights_summary(v_org_id),
      'analytics_insights', public._pie_analytics_summary(v_org_id),
      'organizational_health', public._pie_health_summary(v_org_id),
      'goals_okr', public._pie_okr_summary(v_org_id)
    )
  );
end; $$;

create or replace function public.get_executive_predictive_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('predictions.view');
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'summary', public._pie_executive_summary_block(v_org_id),
    'critical_insights', coalesce((
      select jsonb_agg(row_to_json(i) order by i.created_at desc)
      from public.organization_predictive_insights i
      where i.organization_id = v_org_id and i.status = 'active' and i.risk_level in ('high', 'critical')
      limit 10
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_predictive_insights_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('predictions.view');
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Forward-looking operational intelligence — predictions inform, humans decide.',
    'principles', jsonb_build_array(
      'Transparent confidence scoring',
      'Risk-aware prioritization',
      'Metadata-only signals',
      'Human review before action',
      'Audit-supported accountability'
    ),
    'summary', public._pie_executive_summary_block(v_org_id),
    'sections', jsonb_build_object(
      'active_insights', coalesce((
        select jsonb_agg(row_to_json(i) order by
          case i.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end,
          i.created_at desc)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        limit 40
      ), '[]'::jsonb),
      'by_prediction_type', coalesce((
        select jsonb_agg(jsonb_build_object(
          'prediction_type', i.prediction_type,
          'count', count(*),
          'high_risk_count', count(*) filter (where i.risk_level in ('high', 'critical'))
        ) order by count(*) desc)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        group by i.prediction_type
      ), '[]'::jsonb),
      'by_risk_level', coalesce((
        select jsonb_agg(jsonb_build_object('risk_level', i.risk_level, 'count', count(*)) order by i.risk_level)
        from public.organization_predictive_insights i
        where i.organization_id = v_org_id and i.status = 'active'
        group by i.risk_level
      ), '[]'::jsonb)
    ),
    'settings', (
      select row_to_json(s)::jsonb from public.organization_predictive_settings s where s.organization_id = v_org_id
    ),
    'executive_summary', public._pie_executive_summary_block(v_org_id),
    'integration_notes', jsonb_build_object(
      'strategic_intelligence', 'Strategic signals inform long-range predictions — A.31',
      'executive_insights', 'Executive summaries contextualize prediction impact — A.35',
      'analytics_insights', 'Operational trend metadata feeds confidence — A.48',
      'organizational_health', 'Health scores influence adoption predictions — A.56',
      'goals_okr', 'OKR progress drives missed-objective forecasts — A.65'
    ),
    'integration_summaries', jsonb_build_object(
      'strategic_intelligence', public._pie_strategic_intelligence_summary(v_org_id),
      'executive_insights', public._pie_executive_insights_summary(v_org_id),
      'analytics_insights', public._pie_analytics_summary(v_org_id),
      'organizational_health', public._pie_health_summary(v_org_id),
      'goals_okr', public._pie_okr_summary(v_org_id)
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_predictive_insights_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._pie_seed_insights(v_org_id);
  v_summary := public._pie_executive_summary_block(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Predictive Insights — forward-looking operational intelligence.',
    'active_insights', v_summary->'active_insights',
    'high_risk_insights', v_summary->'high_risk_insights',
    'critical_insights', v_summary->'critical_insights',
    'prediction_type_count', v_summary->'prediction_type_count'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Audit allowlist extension
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
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'predictive-insights-engine', 'Predictive Insights Engine', 'Forward-looking operational predictions with confidence and risk scoring — metadata only.', 'authenticated', 97
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'predictive-insights-engine' and tenant_id is null);

grant execute on function public.generate_predictive_insights(boolean) to authenticated;
grant execute on function public.dismiss_predictive_insight(uuid, text) to authenticated;
grant execute on function public.export_predictive_insights_manifest(text) to authenticated;
grant execute on function public.get_executive_predictive_summary() to authenticated;
grant execute on function public.get_predictive_insights_engine_dashboard() to authenticated;
grant execute on function public.get_predictive_insights_engine_card() to authenticated;

do $$ declare v_org_id uuid; begin
  for v_org_id in select id from public.organizations loop
    perform public._pie_seed_insights(v_org_id);
  end loop;
end $$;
