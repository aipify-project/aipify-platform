-- Phase A.25 — Launch Readiness Engine
-- Go/No-Go checklist, reviews, and post-launch monitoring — integrates Unonight pilot (A.15).

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
    'launch_readiness_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. launch_readiness_checklist
-- ---------------------------------------------------------------------------
create table if not exists public.launch_readiness_checklist (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  checklist_key text not null,
  checklist_title text not null,
  category text not null check (
    category in ('platform', 'pilot', 'support', 'security', 'documentation')
  ),
  status text not null default 'not_ready' check (
    status in ('not_ready', 'ready_for_review', 'approved_for_launch', 'launch_blocked')
  ),
  required boolean not null default true,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, checklist_key)
);

create index if not exists launch_readiness_checklist_org_idx
  on public.launch_readiness_checklist (organization_id, category, status);

alter table public.launch_readiness_checklist enable row level security;
revoke all on public.launch_readiness_checklist from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. launch_readiness_reviews
-- ---------------------------------------------------------------------------
create table if not exists public.launch_readiness_reviews (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  review_type text not null check (
    review_type in ('go_no_go', 'pilot_signoff', 'security_signoff', 'support_signoff', 'executive_signoff')
  ),
  decision text not null check (
    decision in ('not_ready', 'ready_for_review', 'approved_for_launch', 'launch_blocked')
  ),
  reviewer_id uuid references public.users (id) on delete set null,
  rationale text,
  reviewed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.launch_readiness_reviews enable row level security;
revoke all on public.launch_readiness_reviews from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. post_launch_monitoring
-- ---------------------------------------------------------------------------
create table if not exists public.post_launch_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_label text,
  current_value numeric not null default 0,
  threshold_value numeric,
  status text not null default 'normal' check (
    status in ('normal', 'attention', 'critical', 'resolved')
  ),
  recorded_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists post_launch_monitoring_org_idx
  on public.post_launch_monitoring (organization_id, status, recorded_at desc);

alter table public.post_launch_monitoring enable row level security;
revoke all on public.post_launch_monitoring from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'launch_readiness', v.description
from (values
  ('launch.view', 'View Launch Readiness', 'View launch checklist and readiness status'),
  ('launch.manage', 'Manage Launch Readiness', 'Update checklist items and readiness status'),
  ('launch.review', 'Review Launch', 'Submit go/no-go launch reviews'),
  ('launch.monitor', 'Monitor Post-Launch', 'View and update post-launch monitoring')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'launch.view'), ('owner', 'launch.manage'), ('owner', 'launch.review'), ('owner', 'launch.monitor'),
  ('administrator', 'launch.view'), ('administrator', 'launch.manage'), ('administrator', 'launch.review'), ('administrator', 'launch.monitor'),
  ('manager', 'launch.view'), ('manager', 'launch.monitor'),
  ('viewer', 'launch.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 5. Helpers (_lre_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._lre_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'launch',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._lre_seed_checklist(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.launch_readiness_checklist (organization_id, checklist_key, checklist_title, category, status, required)
  select p_organization_id, v.key, v.title, v.cat, v.status, v.req
  from (values
    ('platform_stability', 'Platform stability verified', 'platform', 'ready_for_review', true),
    ('multi_tenant_isolation', 'Multi-tenant isolation audit complete', 'security', 'approved_for_launch', true),
    ('unonight_pilot_outcomes', 'Unonight pilot outcomes reviewed', 'pilot', 'ready_for_review', true),
    ('support_runbook', 'Support runbook published', 'support', 'not_ready', true),
    ('security_review', 'Security review sign-off', 'security', 'ready_for_review', true),
    ('kc_documentation', 'Knowledge Center launch documentation', 'documentation', 'not_ready', true),
    ('notification_readiness', 'Notification channels tested', 'platform', 'approved_for_launch', false),
    ('rollback_plan', 'Rollback plan documented', 'platform', 'approved_for_launch', true)
  ) as v(key, title, cat, status, req)
  on conflict (organization_id, checklist_key) do nothing;

  insert into public.post_launch_monitoring (organization_id, metric_key, metric_label, current_value, threshold_value, status)
  select p_organization_id, v.key, v.label, v.val, v.thresh, v.status
  from (values
    ('pilot_satisfaction', 'Unonight Pilot Satisfaction', 82, 75, 'normal'),
    ('incident_count', 'Post-Launch Incidents', 1, 3, 'normal'),
    ('support_response_time', 'Support Response Time (hrs)', 4, 8, 'normal'),
    ('module_adoption', 'Core Module Adoption %', 68, 50, 'normal')
  ) as v(key, label, val, thresh, status)
  where not exists (
    select 1 from public.post_launch_monitoring m
    where m.organization_id = p_organization_id and m.metric_key = v.key
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.update_launch_checklist_item(
  p_checklist_key text,
  p_status text,
  p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_item public.launch_readiness_checklist;
begin
  perform public._irp_require_permission('launch.manage');
  v_org_id := public._mta_require_organization();

  update public.launch_readiness_checklist
  set status = p_status,
      notes = coalesce(p_notes, notes),
      completed_at = case when p_status = 'approved_for_launch' then now() else completed_at end,
      updated_at = now()
  where organization_id = v_org_id and checklist_key = p_checklist_key
  returning * into v_item;

  if v_item.id is null then raise exception 'Checklist item not found'; end if;

  perform public._lre_log(v_org_id, 'launch_checklist_updated', 'launch_checklist', v_item.id, jsonb_build_object(
    'checklist_key', p_checklist_key, 'status', p_status
  ));

  return row_to_json(v_item)::jsonb;
end; $$;

create or replace function public.submit_launch_review(
  p_review_type text,
  p_decision text,
  p_rationale text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_review public.launch_readiness_reviews;
begin
  perform public._irp_require_permission('launch.review');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.launch_readiness_reviews (organization_id, review_type, decision, reviewer_id, rationale)
  values (v_org_id, p_review_type, p_decision, v_user_id, p_rationale)
  returning * into v_review;

  perform public._lre_log(v_org_id, 'launch_review_submitted', 'launch_review', v_review.id, jsonb_build_object(
    'review_type', p_review_type, 'decision', p_decision
  ));

  return row_to_json(v_review)::jsonb;
end; $$;

create or replace function public.get_launch_readiness_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_overall_status text;
  v_blocked int;
  v_approved int;
begin
  perform public._irp_require_permission('launch.view');
  v_org_id := public._mta_require_organization();
  perform public._lre_seed_checklist(v_org_id);

  select count(*) into v_blocked
  from public.launch_readiness_checklist
  where organization_id = v_org_id and status = 'launch_blocked' and required;

  select count(*) into v_approved
  from public.launch_readiness_checklist
  where organization_id = v_org_id and status = 'approved_for_launch' and required;

  v_overall_status := case
    when v_blocked > 0 then 'launch_blocked'
    when v_approved >= (select count(*) from public.launch_readiness_checklist where organization_id = v_org_id and required) then 'approved_for_launch'
    when v_approved > 0 then 'ready_for_review'
    else 'not_ready'
  end;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Launch only when platform, pilot, support, security, and documentation readiness are verified.',
    'principles', jsonb_build_array(
      'Go/No-Go decision framework with executive sign-off',
      'Unonight pilot outcomes integrated from A.15',
      'Post-launch monitoring for satisfaction, incidents, and adoption',
      'Categories: platform, pilot, support, security, documentation',
      'Humans approve launch — never automated go-live'
    ),
    'overall_status', v_overall_status,
    'summary', jsonb_build_object(
      'total_items', (select count(*) from public.launch_readiness_checklist where organization_id = v_org_id),
      'approved_items', v_approved,
      'blocked_items', v_blocked,
      'ready_for_review', coalesce((select count(*) from public.launch_readiness_checklist where organization_id = v_org_id and status = 'ready_for_review'), 0),
      'monitoring_alerts', coalesce((select count(*) from public.post_launch_monitoring where organization_id = v_org_id and status in ('attention', 'critical')), 0)
    ),
    'checklist', coalesce((
      select jsonb_agg(row_to_json(c) order by
        case c.category when 'security' then 0 when 'pilot' then 1 when 'platform' then 2 when 'support' then 3 else 4 end,
        c.checklist_key)
      from public.launch_readiness_checklist c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'reviews', coalesce((
      select jsonb_agg(row_to_json(r) order by r.reviewed_at desc)
      from (select * from public.launch_readiness_reviews where organization_id = v_org_id order by reviewed_at desc limit 10) r
    ), '[]'::jsonb),
    'post_launch_monitoring', coalesce((
      select jsonb_agg(row_to_json(m) order by m.recorded_at desc)
      from public.post_launch_monitoring m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'unonight_pilot_integration', jsonb_build_object(
      'pilot_engine', 'unonight_pilot_operations_engine',
      'checklist_key', 'unonight_pilot_outcomes',
      'route', '/app/unonight-pilot-operations-engine'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_launch_readiness_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_overall text;
begin
  v_org_id := public._mta_require_organization();

  select case
    when exists (select 1 from public.launch_readiness_checklist where organization_id = v_org_id and status = 'launch_blocked' and required) then 'launch_blocked'
    when (select count(*) from public.launch_readiness_checklist where organization_id = v_org_id and status = 'approved_for_launch' and required)
      >= (select count(*) from public.launch_readiness_checklist where organization_id = v_org_id and required) then 'approved_for_launch'
    else 'not_ready'
  end into v_overall;

  return jsonb_build_object(
    'has_organization', true,
    'overall_status', v_overall,
    'approved_items', coalesce((select count(*) from public.launch_readiness_checklist where organization_id = v_org_id and status = 'approved_for_launch'), 0),
    'philosophy', 'Go/No-Go launch readiness with pilot validation.'
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
    'internal_validation_recorded', 'internal_feedback_submitted',
    'launch_checklist_updated', 'launch_review_submitted'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._lre_seed_checklist(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'launch-readiness-engine', 'Launch Readiness Engine', 'Go/No-Go checklist, launch reviews, and post-launch monitoring with Unonight pilot integration.', 'authenticated', 68
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'launch-readiness-engine' and tenant_id is null);

grant execute on function public.update_launch_checklist_item(text, text, text) to authenticated;
grant execute on function public.submit_launch_review(text, text, text) to authenticated;
grant execute on function public.get_launch_readiness_engine_dashboard() to authenticated;
grant execute on function public.get_launch_readiness_engine_card() to authenticated;
