-- Phase A.24 — Aipify Internal Operations Engine
-- Dogfooding dashboard for Aipify Group AS internal tenant.

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
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. internal_operations_tasks
-- ---------------------------------------------------------------------------
create table if not exists public.internal_operations_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  task_key text not null,
  task_title text not null,
  module_key text,
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'blocked', 'cancelled')
  ),
  priority text not null default 'routine' check (
    priority in ('critical', 'important', 'routine', 'optional')
  ),
  assigned_to uuid references public.users (id) on delete set null,
  due_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists internal_ops_tasks_org_idx
  on public.internal_operations_tasks (organization_id, status, priority);

alter table public.internal_operations_tasks enable row level security;
revoke all on public.internal_operations_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. internal_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.internal_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  feedback_type text not null check (
    feedback_type in ('bug', 'improvement', 'validation', 'dogfood', 'release_blocker')
  ),
  summary text not null,
  severity text not null default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  status text not null default 'open' check (
    status in ('open', 'triaged', 'resolved', 'wont_fix', 'deferred')
  ),
  submitted_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.internal_feedback enable row level security;
revoke all on public.internal_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. internal_validation_outcomes
-- ---------------------------------------------------------------------------
create table if not exists public.internal_validation_outcomes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  validation_type text not null check (
    validation_type in ('smoke_test', 'integration_test', 'ux_review', 'security_review', 'release_gate')
  ),
  outcome text not null check (outcome in ('passed', 'failed', 'partial', 'skipped')),
  notes text,
  validated_by uuid references public.users (id) on delete set null,
  validated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.internal_validation_outcomes enable row level security;
revoke all on public.internal_validation_outcomes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. internal_quality_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.internal_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_scope text not null,
  score int not null default 0 check (score >= 0 and score <= 100),
  findings_count int not null default 0,
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'approved', 'rejected')
  ),
  reviewer_id uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.internal_quality_reviews enable row level security;
revoke all on public.internal_quality_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. internal_success_metrics
-- ---------------------------------------------------------------------------
create table if not exists public.internal_success_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_value numeric not null default 0,
  metric_period text not null default 'weekly',
  recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique (organization_id, metric_key, metric_period, recorded_at)
);

alter table public.internal_success_metrics enable row level security;
revoke all on public.internal_success_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'internal_operations', v.description
from (values
  ('internal_ops.view', 'View Internal Ops', 'View internal operations dashboard and metrics'),
  ('internal_ops.manage', 'Manage Internal Ops', 'Manage internal tasks and validation'),
  ('internal_ops.validate', 'Validate Features', 'Record feature validation outcomes before public release'),
  ('internal_ops.feedback', 'Submit Internal Feedback', 'Submit dogfooding feedback')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_aio_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._aio_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'internal_ops',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._aio_provision_internal_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_company_id uuid;
  v_customer_id uuid;
begin
  select id into v_company_id from public.companies where is_platform = true limit 1;

  if v_company_id is null then
    insert into public.companies (name, slug, is_platform)
    values ('Aipify Group AS', 'aipify-internal', true)
    returning id into v_company_id;
  end if;

  select c.id into v_customer_id
  from public.customers c
  where c.company_id = v_company_id
  order by c.created_at
  limit 1;

  if v_customer_id is null then
    select c.id into v_customer_id
    from public.customers c
    where c.slug in ('aipify-group', 'aipify-internal', 'aipify')
    limit 1;
  end if;

  if v_customer_id is null then
    insert into public.customers (
      customer_number, company_id, customer_type, slug, company_name, email, country, language, status
    ) values (
      public.format_customer_number(nextval('public.customer_number_seq')),
      v_company_id,
      'company',
      'aipify-group',
      'Aipify Group AS',
      'team@aipify.com',
      'NO',
      'en',
      'active'
    )
    returning id into v_customer_id;
  end if;

  if to_regprocedure('public._mta_sync_organization_from_customer(uuid)') is not null then
    perform public._mta_sync_organization_from_customer(v_customer_id);
  end if;

  select id into v_org_id from public.organizations where id = v_customer_id;
  if v_org_id is null then
    insert into public.organizations (id, name, slug, status, subscription_plan)
    values (v_customer_id, 'Aipify Group AS', 'aipify-internal', 'active', 'internal')
    on conflict (id) do update set
      name = excluded.name,
      slug = excluded.slug,
      status = excluded.status,
      subscription_plan = excluded.subscription_plan,
      updated_at = now()
    returning id into v_org_id;
    v_org_id := coalesce(v_org_id, v_customer_id);
  end if;

  return v_org_id;
end; $$;

create or replace function public._aio_seed_internal_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.internal_operations_tasks (organization_id, task_key, task_title, module_key, status, priority)
  select p_organization_id, v.key, v.title, v.mod, v.status, v.prio
  from (values
    ('validate_a6_kc', 'Validate Knowledge Center Engine', 'knowledge_center_engine', 'in_progress', 'important'),
    ('validate_a15_pilot', 'Review Unonight Pilot Outcomes', 'unonight_pilot_operations_engine', 'pending', 'critical'),
    ('dogfood_a20_deploy', 'Dogfood Deployment Engine', 'deployment_environment_management_engine', 'pending', 'important'),
    ('release_gate_a22', 'Install Engine Release Gate', 'aipify_install_engine', 'pending', 'critical')
  ) as v(key, title, mod, status, prio)
  where not exists (select 1 from public.internal_operations_tasks t where t.organization_id = p_organization_id and t.task_key = v.key);

  insert into public.internal_success_metrics (organization_id, metric_key, metric_value, metric_period)
  select p_organization_id, v.key, v.val, 'weekly'
  from (values
    ('modules_validated', 12),
    ('dogfood_sessions', 8),
    ('release_gates_passed', 5),
    ('open_feedback', 3)
  ) as v(key, val)
  on conflict do nothing;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.record_internal_validation(
  p_module_key text,
  p_validation_type text,
  p_outcome text,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.internal_validation_outcomes;
begin
  perform public._irp_require_permission('internal_ops.validate');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.internal_validation_outcomes (
    organization_id, module_key, validation_type, outcome, notes, validated_by
  ) values (v_org_id, p_module_key, p_validation_type, p_outcome, p_notes, v_user_id)
  returning * into v_row;

  perform public._aio_log(v_org_id, 'internal_validation_recorded', 'validation', v_row.id, jsonb_build_object(
    'module_key', p_module_key, 'outcome', p_outcome
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.submit_internal_feedback(
  p_module_key text,
  p_feedback_type text,
  p_summary text,
  p_severity text default 'low'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_row public.internal_feedback;
begin
  perform public._irp_require_permission('internal_ops.feedback');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.internal_feedback (
    organization_id, module_key, feedback_type, summary, severity, submitted_by
  ) values (v_org_id, p_module_key, p_feedback_type, p_summary, p_severity, v_user_id)
  returning * into v_row;

  perform public._aio_log(v_org_id, 'internal_feedback_submitted', 'feedback', v_row.id, jsonb_build_object(
    'module_key', p_module_key, 'severity', p_severity
  ));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_aipify_internal_operations_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('internal_ops.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify dogfoods its own platform — internal operations validate features before public release.',
    'validation_rule', 'Features must pass internal validation before general availability.',
    'principles', jsonb_build_array(
      'Aipify Group AS operates as internal tenant (companies.is_platform = true)',
      'Aggregates A.6–A.20 module health for dogfooding',
      'Feature validation gate before public release',
      'Internal feedback loop with severity tracking',
      'Distinct from Platform Admin UI — internal ops tenant workspace'
    ),
    'summary', jsonb_build_object(
      'open_tasks', coalesce((select count(*) from public.internal_operations_tasks where organization_id = v_org_id and status in ('pending', 'in_progress', 'blocked')), 0),
      'open_feedback', coalesce((select count(*) from public.internal_feedback where organization_id = v_org_id and status = 'open'), 0),
      'validations_passed', coalesce((select count(*) from public.internal_validation_outcomes where organization_id = v_org_id and outcome = 'passed'), 0),
      'release_blockers', coalesce((select count(*) from public.internal_feedback where organization_id = v_org_id and feedback_type = 'release_blocker' and status = 'open'), 0)
    ),
    'tasks', coalesce((
      select jsonb_agg(row_to_json(t) order by
        case t.priority when 'critical' then 0 when 'important' then 1 when 'routine' then 2 else 3 end, t.created_at desc)
      from public.internal_operations_tasks t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'feedback', coalesce((
      select jsonb_agg(row_to_json(f) order by f.created_at desc)
      from (select * from public.internal_feedback where organization_id = v_org_id order by created_at desc limit 10) f
    ), '[]'::jsonb),
    'validations', coalesce((
      select jsonb_agg(row_to_json(v) order by v.validated_at desc)
      from (select * from public.internal_validation_outcomes where organization_id = v_org_id order by validated_at desc limit 10) v
    ), '[]'::jsonb),
    'quality_reviews', coalesce((
      select jsonb_agg(row_to_json(q) order by q.created_at desc)
      from public.internal_quality_reviews q where q.organization_id = v_org_id
    ), '[]'::jsonb),
    'success_metrics', coalesce((
      select jsonb_agg(row_to_json(m) order by m.recorded_at desc)
      from public.internal_success_metrics m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'module_coverage', jsonb_build_array(
      'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
      'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
      'subscription_plan_management_engine', 'quality_guardian_engine',
      'governance_policy_engine', 'unonight_pilot_operations_engine',
      'analytics_insights_engine', 'notification_communication_engine',
      'deployment_environment_management_engine', 'observability_platform_health_engine'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_aipify_internal_operations_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'open_tasks', coalesce((select count(*) from public.internal_operations_tasks where organization_id = v_org_id and status in ('pending', 'in_progress')), 0),
    'release_blockers', coalesce((select count(*) from public.internal_feedback where organization_id = v_org_id and feedback_type = 'release_blocker' and status = 'open'), 0),
    'philosophy', 'Dogfood Aipify before public release.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
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
    'internal_validation_recorded', 'internal_feedback_submitted'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_internal_org uuid;
begin
  v_internal_org := public._aio_provision_internal_tenant();
  perform public._aio_seed_internal_content(v_internal_org);

  insert into public.organization_role_permissions (organization_id, role, permission_key)
  select v_internal_org, v.role, v.key
  from (values
    ('owner', 'internal_ops.view'), ('owner', 'internal_ops.manage'), ('owner', 'internal_ops.validate'), ('owner', 'internal_ops.feedback'),
    ('administrator', 'internal_ops.view'), ('administrator', 'internal_ops.manage'), ('administrator', 'internal_ops.validate'), ('administrator', 'internal_ops.feedback')
  ) as v(role, key)
  where not exists (
    select 1 from public.organization_role_permissions rp
    where rp.organization_id = v_internal_org and rp.role = v.role and rp.permission_key = v.key
  );
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-internal-operations-engine', 'Aipify Internal Operations Engine', 'Dogfooding dashboard, feature validation, and internal success metrics for Aipify Group AS.', 'authenticated', 67
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-internal-operations-engine' and tenant_id is null);

grant execute on function public.record_internal_validation(text, text, text, text) to authenticated;
grant execute on function public.submit_internal_feedback(text, text, text, text) to authenticated;
grant execute on function public.get_aipify_internal_operations_engine_dashboard() to authenticated;
grant execute on function public.get_aipify_internal_operations_engine_card() to authenticated;
