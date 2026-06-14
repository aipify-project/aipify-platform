-- Phase A.46 — AI Ethics & Responsible Use Engine
-- Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), Delegated Trust scaffold (A.41).

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
    'ai_ethics_responsible_use_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_ethics_policies
-- ---------------------------------------------------------------------------
create table if not exists public.organization_ethics_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  policy_version text not null default '1.0.0',
  explainability_required boolean not null default true,
  human_oversight_default boolean not null default true,
  prohibited_examples jsonb not null default '[]'::jsonb,
  review_frequency_days int not null default 90,
  policy_exceptions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_ethics_policies enable row level security;
revoke all on public.organization_ethics_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. ai_use_cases
-- ---------------------------------------------------------------------------
create table if not exists public.ai_use_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  use_case_name text not null,
  category text not null default 'operational' check (
    category in ('operational', 'customer_facing', 'decision_support', 'automation', 'analytics', 'content_generation')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  oversight_required boolean not null default true,
  explainability_required boolean not null default true,
  status text not null default 'proposed' check (
    status in ('proposed', 'approved', 'restricted', 'retired')
  ),
  review_notes text,
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  next_review_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists ai_use_cases_org_status_idx
  on public.ai_use_cases (organization_id, status, risk_level);

alter table public.ai_use_cases enable row level security;
revoke all on public.ai_use_cases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'ai_ethics', v.description
from (values
  ('ethics.view', 'View AI Ethics', 'View AI use cases, ethics policies, and oversight trends'),
  ('ethics.manage', 'Manage AI Ethics', 'Propose use cases and manage ethics policy settings'),
  ('ethics.review', 'Review AI Ethics', 'Review and approve or restrict AI use cases'),
  ('ethics.override', 'Override Ethics Policy', 'Apply audited policy exceptions with justification')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'ethics.view'), ('owner', 'ethics.manage'), ('owner', 'ethics.review'), ('owner', 'ethics.override'),
  ('administrator', 'ethics.view'), ('administrator', 'ethics.manage'), ('administrator', 'ethics.review'), ('administrator', 'ethics.override'),
  ('manager', 'ethics.view'), ('manager', 'ethics.review'),
  ('viewer', 'ethics.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 4. Helpers (_aerue_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._aerue_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'ai_ethics',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._aerue_ensure_policy(p_organization_id uuid)
returns public.organization_ethics_policies language plpgsql security definer set search_path = public as $$
declare v_row public.organization_ethics_policies;
begin
  insert into public.organization_ethics_policies (
    organization_id, prohibited_examples
  )
  values (
    p_organization_id,
    jsonb_build_array(
      jsonb_build_object('example', 'Automated hiring decisions without human review', 'severity', 'critical'),
      jsonb_build_object('example', 'Covert sentiment profiling of employees', 'severity', 'high'),
      jsonb_build_object('example', 'Automated credit or legal decisions without explainability', 'severity', 'critical'),
      jsonb_build_object('example', 'Impersonating humans in customer communications', 'severity', 'high')
    )
  )
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_ethics_policies where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._aerue_seed_use_cases(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.ai_use_cases (
    organization_id, use_case_name, category, risk_level, oversight_required,
    explainability_required, status, next_review_at
  )
  select p_organization_id, v.name, v.cat, v.risk, v.oversight, v.explain, v.status, v.next_review
  from (values
    ('Support triage assistance', 'operational', 'medium', true, true, 'approved', now() + interval '90 days'),
    ('Executive briefing summaries', 'decision_support', 'low', false, true, 'approved', now() + interval '180 days'),
    ('Automated refund processing', 'automation', 'high', true, true, 'proposed', now() + interval '30 days'),
    ('Customer sentiment analysis', 'analytics', 'medium', true, true, 'restricted', now() + interval '60 days')
  ) as v(name, cat, risk, oversight, explain, status, next_review)
  where not exists (
    select 1 from public.ai_use_cases where organization_id = p_organization_id limit 1
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. RPCs — ethics review workflow
-- ---------------------------------------------------------------------------
create or replace function public.propose_ai_use_case(
  p_use_case_name text,
  p_category text default 'operational',
  p_risk_level text default 'medium',
  p_oversight_required boolean default true
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.ai_use_cases; v_policy public.organization_ethics_policies;
begin
  perform public._irp_require_permission('ethics.manage');
  v_org_id := public._mta_require_organization();
  v_policy := public._aerue_ensure_policy(v_org_id);

  if coalesce(trim(p_use_case_name), '') = '' then
    raise exception 'Use case name required';
  end if;

  if p_risk_level = 'critical' then
    raise exception 'Critical risk use cases require explicit ethics review — contact administrator';
  end if;

  insert into public.ai_use_cases (
    organization_id, use_case_name, category, risk_level,
    oversight_required, explainability_required, status, next_review_at
  )
  values (
    v_org_id,
    left(trim(p_use_case_name), 200),
    coalesce(p_category, 'operational'),
    coalesce(p_risk_level, 'medium'),
    coalesce(p_oversight_required, true),
    v_policy.explainability_required,
    'proposed',
    now() + (v_policy.review_frequency_days || ' days')::interval
  )
  returning * into v_row;

  perform public._aerue_log(
    v_org_id, 'ai_use_case_proposed', 'ai_use_case', v_row.id,
    jsonb_build_object('use_case_name', v_row.use_case_name, 'risk_level', v_row.risk_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.review_ai_use_case(
  p_use_case_id uuid,
  p_review_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.ai_use_cases;
begin
  perform public._irp_require_permission('ethics.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.ai_use_cases
  set review_notes = left(coalesce(p_review_notes, review_notes, ''), 2000),
      reviewed_by = v_user_id,
      reviewed_at = now(),
      updated_at = now()
  where id = p_use_case_id and organization_id = v_org_id and status = 'proposed'
  returning * into v_row;

  if v_row.id is null then raise exception 'Proposed use case not found'; end if;

  perform public._aerue_log(
    v_org_id, 'ai_use_case_reviewed', 'ai_use_case', v_row.id,
    jsonb_build_object('use_case_name', v_row.use_case_name)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.approve_ai_use_case(p_use_case_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.ai_use_cases; v_policy public.organization_ethics_policies;
begin
  perform public._irp_require_permission('ethics.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_policy := public._aerue_ensure_policy(v_org_id);

  update public.ai_use_cases
  set status = 'approved',
      reviewed_by = v_user_id,
      reviewed_at = now(),
      next_review_at = now() + (v_policy.review_frequency_days || ' days')::interval,
      updated_at = now()
  where id = p_use_case_id and organization_id = v_org_id and status in ('proposed', 'restricted')
  returning * into v_row;

  if v_row.id is null then raise exception 'Use case not eligible for approval'; end if;

  perform public._aerue_log(
    v_org_id, 'ai_use_case_approved', 'ai_use_case', v_row.id,
    jsonb_build_object('use_case_name', v_row.use_case_name, 'risk_level', v_row.risk_level)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.restrict_ai_use_case(
  p_use_case_id uuid,
  p_reason text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.ai_use_cases;
begin
  perform public._irp_require_permission('ethics.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  update public.ai_use_cases
  set status = 'restricted',
      review_notes = left(coalesce(p_reason, review_notes, ''), 2000),
      reviewed_by = v_user_id,
      reviewed_at = now(),
      updated_at = now()
  where id = p_use_case_id and organization_id = v_org_id and status in ('proposed', 'approved')
  returning * into v_row;

  if v_row.id is null then raise exception 'Use case not found for restriction'; end if;

  perform public._aerue_log(
    v_org_id, 'ai_use_case_restricted', 'ai_use_case', v_row.id,
    jsonb_build_object('use_case_name', v_row.use_case_name, 'reason', p_reason)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.override_ethics_policy_exception(
  p_use_case_id uuid,
  p_justification text,
  p_exception_duration_days int default 30
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_row public.ai_use_cases;
  v_policy public.organization_ethics_policies;
  v_exception jsonb;
begin
  perform public._irp_require_permission('ethics.override');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_policy := public._aerue_ensure_policy(v_org_id);

  if coalesce(trim(p_justification), '') = '' then
    raise exception 'Business justification required for ethics override';
  end if;

  select * into v_row from public.ai_use_cases
  where id = p_use_case_id and organization_id = v_org_id;
  if v_row.id is null then raise exception 'Use case not found'; end if;

  v_exception := jsonb_build_object(
    'use_case_id', v_row.id,
    'use_case_name', v_row.use_case_name,
    'justification', left(p_justification, 2000),
    'overridden_by', v_user_id,
    'expires_at', now() + (coalesce(p_exception_duration_days, 30) || ' days')::interval,
    'created_at', now()
  );

  update public.organization_ethics_policies
  set policy_exceptions = coalesce(policy_exceptions, '[]'::jsonb) || v_exception,
      updated_at = now()
  where organization_id = v_org_id;

  perform public._aerue_log(
    v_org_id, 'ethics_policy_override_applied', 'ai_use_case', v_row.id,
    jsonb_build_object('use_case_name', v_row.use_case_name, 'duration_days', p_exception_duration_days)
  );

  return jsonb_build_object('use_case', row_to_json(v_row)::jsonb, 'exception', v_exception);
end; $$;

create or replace function public.update_organization_ethics_policy(p_policy jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_policy public.organization_ethics_policies;
begin
  perform public._irp_require_permission('ethics.manage');
  v_org_id := public._mta_require_organization();
  v_policy := public._aerue_ensure_policy(v_org_id);

  update public.organization_ethics_policies
  set explainability_required = case
        when p_policy ? 'explainability_required' then coalesce((p_policy->>'explainability_required')::boolean, explainability_required)
        else explainability_required
      end,
      human_oversight_default = case
        when p_policy ? 'human_oversight_default' then coalesce((p_policy->>'human_oversight_default')::boolean, human_oversight_default)
        else human_oversight_default
      end,
      review_frequency_days = case
        when p_policy ? 'review_frequency_days' then greatest(coalesce((p_policy->>'review_frequency_days')::int, review_frequency_days), 30)
        else review_frequency_days
      end,
      prohibited_examples = case
        when p_policy ? 'prohibited_examples' then coalesce(p_policy->'prohibited_examples', prohibited_examples)
        else prohibited_examples
      end,
      updated_at = now()
  where organization_id = v_org_id
  returning * into v_policy;

  perform public._aerue_log(
    v_org_id, 'ethics_policy_updated', 'ethics_policy', v_policy.id,
    jsonb_build_object('policy_version', v_policy.policy_version)
  );

  return row_to_json(v_policy)::jsonb;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_ai_ethics_responsible_use_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_policy public.organization_ethics_policies;
begin
  perform public._irp_require_permission('ethics.view');
  v_org_id := public._mta_require_organization();
  v_policy := public._aerue_ensure_policy(v_org_id);
  perform public._aerue_seed_use_cases(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Responsible AI use through documented use cases, explainability requirements, and human oversight. Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), and Delegated Trust (A.41).',
    'principles', jsonb_build_array(
      'Every AI use case documented and risk-classified',
      'Explainability required by default',
      'Human oversight for medium+ risk',
      'Critical use cases prohibited for autonomous AI',
      'Policy exceptions require audited override with justification',
      'Scheduled ethics reviews — not one-time approval'
    ),
    'summary', jsonb_build_object(
      'approved_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'approved'), 0),
      'restricted_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'restricted'), 0),
      'proposed_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'proposed'), 0),
      'high_risk_active', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and risk_level in ('high', 'critical') and status = 'approved'), 0),
      'upcoming_reviews', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and next_review_at <= now() + interval '30 days' and status = 'approved'), 0),
      'policy_exceptions', jsonb_array_length(coalesce(v_policy.policy_exceptions, '[]'::jsonb))
    ),
    'ethics_policy', row_to_json(v_policy)::jsonb,
    'prohibited_examples', coalesce(v_policy.prohibited_examples, '[]'::jsonb),
    'explainability_requirements', jsonb_build_object(
      'required', v_policy.explainability_required,
      'human_oversight_default', v_policy.human_oversight_default,
      'review_frequency_days', v_policy.review_frequency_days,
      'note', 'All approved use cases must document reasoning, confidence, and trade-offs where applicable'
    ),
    'approved_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by
        case u.risk_level when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, u.use_case_name)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'approved'
    ), '[]'::jsonb),
    'restricted_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by u.updated_at desc)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'restricted'
    ), '[]'::jsonb),
    'proposed_use_cases', coalesce((
      select jsonb_agg(row_to_json(u) order by u.created_at desc)
      from public.ai_use_cases u where u.organization_id = v_org_id and u.status = 'proposed'
    ), '[]'::jsonb),
    'review_schedules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'use_case_id', u.id,
        'use_case_name', u.use_case_name,
        'risk_level', u.risk_level,
        'next_review_at', u.next_review_at,
        'overdue', u.next_review_at < now()
      ) order by u.next_review_at)
      from public.ai_use_cases u
      where u.organization_id = v_org_id and u.status = 'approved' and u.next_review_at is not null
    ), '[]'::jsonb),
    'policy_exceptions', coalesce(v_policy.policy_exceptions, '[]'::jsonb),
    'oversight_trends', jsonb_build_object(
      'high_risk_with_oversight', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and risk_level in ('high', 'critical') and oversight_required and status = 'approved'
      ), 0),
      'approved_without_oversight', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and not oversight_required and status = 'approved'
      ), 0),
      'recent_restrictions', coalesce((
        select count(*) from public.ai_use_cases
        where organization_id = v_org_id and status = 'restricted' and updated_at > now() - interval '90 days'
      ), 0)
    ),
    'integration_notes', jsonb_build_object(
      'human_oversight', jsonb_build_object('route', '/app/human-oversight-engine', 'note', 'Operational oversight for approved use cases'),
      'compliance', jsonb_build_object('route', '/app/compliance-regulatory-readiness-engine', 'note', 'Regulatory readiness alignment')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_ai_ethics_responsible_use_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  perform public._aerue_ensure_policy(v_org_id);
  perform public._aerue_seed_use_cases(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'approved_use_cases', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'approved'), 0),
    'proposed_reviews', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'proposed'), 0),
    'restricted_count', coalesce((select count(*) from public.ai_use_cases where organization_id = v_org_id and status = 'restricted'), 0),
    'philosophy', 'Responsible AI — documented use cases with human oversight.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Audit extension
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
    'partner_submitted_for_review', 'partner_application_reviewed', 'partner_approved',
    'partner_suspended', 'partner_recertified', 'offering_published', 'offering_suspended',
    'ai_use_case_proposed', 'ai_use_case_reviewed', 'ai_use_case_approved',
    'ai_use_case_restricted', 'ethics_policy_updated', 'ethics_policy_override_applied'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'ai-ethics-responsible-use-engine', 'AI Ethics & Responsible Use Engine', 'AI use case governance, explainability requirements, and ethics review workflows.', 'authenticated', 80
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'ai-ethics-responsible-use-engine' and tenant_id is null);

grant execute on function public.propose_ai_use_case(text, text, text, boolean) to authenticated;
grant execute on function public.review_ai_use_case(uuid, text) to authenticated;
grant execute on function public.approve_ai_use_case(uuid) to authenticated;
grant execute on function public.restrict_ai_use_case(uuid, text) to authenticated;
grant execute on function public.override_ethics_policy_exception(uuid, text, int) to authenticated;
grant execute on function public.update_organization_ethics_policy(jsonb) to authenticated;
grant execute on function public.get_ai_ethics_responsible_use_engine_dashboard() to authenticated;
grant execute on function public.get_ai_ethics_responsible_use_engine_card() to authenticated;
