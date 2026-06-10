-- Phase 13 (Action Engine): execution layer between intelligence and operations

-- ---------------------------------------------------------------------------
-- action_templates
-- ---------------------------------------------------------------------------
create table if not exists public.action_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  title text not null,
  description text,
  category text not null default 'recovery',
  default_risk_level text not null default 'low' check (
    default_risk_level in ('low', 'medium', 'high', 'critical')
  ),
  prepared_steps jsonb not null default '[]'::jsonb,
  expected_outcome text,
  rollback_available boolean not null default true,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- approval_policies (platform default + optional tenant override)
-- ---------------------------------------------------------------------------
create table if not exists public.approval_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  policy_rule text not null,
  auto_approve boolean not null default false,
  approver_role text,
  manual_only boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, risk_level)
);

-- ---------------------------------------------------------------------------
-- platform_actions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_actions (
  id uuid primary key default gen_random_uuid(),
  action_key text not null,
  title text not null,
  reason_generated text not null,
  recommended_by text not null default 'Aipify Intelligence',
  environment_type text not null check (
    environment_type in ('internal', 'pilot', 'customer', 'enterprise')
  ),
  tenant_id uuid references public.customers (id) on delete set null,
  customer_name text,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  status text not null default 'pending_approval' check (
    status in (
      'pending_approval', 'approved', 'executing', 'success',
      'partial_success', 'failed', 'rolled_back', 'verification_pending',
      'rejected', 'cancelled'
    )
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'auto_approved', 'manual_only')
  ),
  intelligence_recommendation_id uuid references public.global_patterns (id) on delete set null,
  template_id uuid references public.action_templates (id) on delete set null,
  prepared_steps jsonb not null default '[]'::jsonb,
  preview_changes jsonb not null default '[]'::jsonb,
  expected_outcome text,
  expected_impact text,
  estimated_execution_ms integer not null default 5000,
  rollback_available boolean not null default false,
  rollback_state jsonb,
  rollback_instructions text,
  approved_by text,
  approved_at timestamptz,
  executed_by text,
  executed_at timestamptz,
  verification_result text,
  execution_duration_ms integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_actions_status_idx
  on public.platform_actions (status, created_at desc);
create index if not exists platform_actions_tenant_idx
  on public.platform_actions (tenant_id, status);

-- ---------------------------------------------------------------------------
-- action_execution_logs
-- ---------------------------------------------------------------------------
create table if not exists public.action_execution_logs (
  id uuid primary key default gen_random_uuid(),
  action_id uuid not null references public.platform_actions (id) on delete cascade,
  actor_email text,
  approver_email text,
  executor_email text,
  event_type text not null check (
    event_type in ('created', 'approved', 'rejected', 'executed', 'verified', 'failed', 'rolled_back')
  ),
  result text,
  duration_ms integer,
  rollback_state text,
  environment_type text,
  tenant_id uuid references public.customers (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists action_execution_logs_action_idx
  on public.action_execution_logs (action_id, created_at desc);

alter table public.action_templates enable row level security;
alter table public.approval_policies enable row level security;
alter table public.platform_actions enable row level security;
alter table public.action_execution_logs enable row level security;

revoke all on public.action_templates from authenticated, anon;
revoke all on public.approval_policies from authenticated, anon;
revoke all on public.platform_actions from authenticated, anon;
revoke all on public.action_execution_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.log_action_event(
  p_action_id uuid,
  p_event_type text,
  p_actor text default null,
  p_result text default null,
  p_duration_ms integer default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action public.platform_actions%rowtype;
  v_id uuid;
begin
  select * into v_action from public.platform_actions where id = p_action_id;
  insert into public.action_execution_logs (
    action_id, actor_email, approver_email, executor_email,
    event_type, result, duration_ms, environment_type, tenant_id, metadata
  )
  values (
    p_action_id,
    p_actor,
    case when p_event_type = 'approved' then p_actor else v_action.approved_by end,
    case when p_event_type = 'executed' then p_actor else v_action.executed_by end,
    p_event_type, p_result, p_duration_ms,
    v_action.environment_type, v_action.tenant_id, p_metadata
  )
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.get_action_center_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'metrics', jsonb_build_object(
      'pending', (select count(*) from public.platform_actions where status = 'pending_approval'),
      'approved', (select count(*) from public.platform_actions where status = 'approved'),
      'executed', (select count(*) from public.platform_actions where status in ('success', 'partial_success')),
      'failed', (select count(*) from public.platform_actions where status in ('failed', 'rolled_back')),
      'executed_total', (select count(*) from public.platform_actions where executed_at is not null),
      'approvals_granted', (select count(*) from public.platform_actions where approval_status in ('approved', 'auto_approved')),
      'rollbacks', (select count(*) from public.platform_actions where status = 'rolled_back'),
      'hours_saved', coalesce((select sum(execution_duration_ms) / 3600000.0 from public.platform_actions where status = 'success'), 0)
    ),
    'lifecycle', jsonb_build_array('detect', 'recommend', 'prepare', 'approval', 'execute', 'verify', 'log', 'learn')
  );
end;
$$;

create or replace function public.list_platform_actions(p_status text default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return coalesce(
    (select jsonb_agg(row_to_json(pa.*) order by pa.created_at desc)
     from public.platform_actions pa
     where (
       p_status is null
       or (p_status = 'pending' and pa.status = 'pending_approval')
       or (p_status = 'approved' and pa.status = 'approved')
       or (p_status = 'executed' and pa.status in ('success', 'partial_success', 'verification_pending'))
       or (p_status = 'failed' and pa.status in ('failed', 'rolled_back', 'rejected'))
     )),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.list_action_templates()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  return coalesce(
    (select jsonb_agg(row_to_json(at.*) order by at.title)
     from public.action_templates at where at.active = true),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.list_approval_policies()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  return coalesce(
    (select jsonb_agg(
      jsonb_build_object(
        'id', ap.id,
        'tenant_id', ap.tenant_id,
        'tenant_name', coalesce(c.company_name, c.full_name, 'Platform default'),
        'risk_level', ap.risk_level,
        'policy_rule', ap.policy_rule,
        'auto_approve', ap.auto_approve,
        'approver_role', ap.approver_role,
        'manual_only', ap.manual_only
      )
      order by ap.tenant_id nulls first, ap.risk_level
    )
    from public.approval_policies ap
    left join public.customers c on c.id = ap.tenant_id),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.list_action_execution_logs()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  return coalesce(
    (select jsonb_agg(
      jsonb_build_object(
        'id', l.id,
        'action_id', l.action_id,
        'action_title', pa.title,
        'event_type', l.event_type,
        'actor_email', l.actor_email,
        'approver_email', l.approver_email,
        'executor_email', l.executor_email,
        'result', l.result,
        'duration_ms', l.duration_ms,
        'rollback_state', l.rollback_state,
        'environment_type', l.environment_type,
        'tenant_id', l.tenant_id,
        'created_at', l.created_at
      )
      order by l.created_at desc
    )
    from public.action_execution_logs l
    join public.platform_actions pa on pa.id = l.action_id
    limit 100),
    '[]'::jsonb
  );
end;
$$;

create or replace function public.approve_platform_action(
  p_action_id uuid,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
  v_action public.platform_actions%rowtype;
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  select email into v_actor from auth.users where id = auth.uid();
  select * into v_action from public.platform_actions where id = p_action_id;
  if v_action.id is null then raise exception 'Action not found'; end if;

  update public.platform_actions
  set status = 'approved', approval_status = 'approved',
      approved_by = coalesce(v_actor, 'platform-admin'), approved_at = now(), updated_at = now()
  where id = p_action_id;

  perform public.log_action_event(p_action_id, 'approved', coalesce(v_actor, 'platform-admin'), 'approved', null,
    jsonb_build_object('notes', p_notes));
  perform public.record_presence_event('platform', 'approval', 'Action approved: ' || v_action.title,
    coalesce(p_notes, 'Ready for execution'), 'completed', v_action.risk_level, true, false);

  return jsonb_build_object('action_id', p_action_id, 'status', 'approved');
end;
$$;

create or replace function public.reject_platform_action(
  p_action_id uuid,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
  v_action public.platform_actions%rowtype;
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  select email into v_actor from auth.users where id = auth.uid();
  select * into v_action from public.platform_actions where id = p_action_id;
  if v_action.id is null then raise exception 'Action not found'; end if;

  update public.platform_actions
  set status = 'rejected', approval_status = 'rejected', updated_at = now()
  where id = p_action_id;

  perform public.log_action_event(p_action_id, 'rejected', coalesce(v_actor, 'platform-admin'), 'rejected', null,
    jsonb_build_object('notes', p_notes));

  return jsonb_build_object('action_id', p_action_id, 'status', 'rejected');
end;
$$;

create or replace function public.execute_platform_action(p_action_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
  v_action public.platform_actions%rowtype;
  v_duration integer;
  v_result text;
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  select email into v_actor from auth.users where id = auth.uid();
  select * into v_action from public.platform_actions where id = p_action_id;
  if v_action.id is null then raise exception 'Action not found'; end if;
  if v_action.status not in ('approved', 'pending_approval') then
    raise exception 'Action not executable in current status';
  end if;
  if v_action.risk_level = 'critical' then
    raise exception 'Critical actions require manual execution only';
  end if;

  v_duration := coalesce(v_action.estimated_execution_ms, 3000);

  update public.platform_actions
  set status = 'executing', executed_by = coalesce(v_actor, 'aipify-engine'),
      executed_at = now(), updated_at = now()
  where id = p_action_id;

  v_result := case
    when v_action.risk_level = 'high' then 'partial_success'
    else 'success'
  end;

  update public.platform_actions
  set status = v_result, verification_result = 'verified',
      execution_duration_ms = v_duration, updated_at = now()
  where id = p_action_id;

  perform public.log_action_event(p_action_id, 'executed', coalesce(v_actor, 'aipify-engine'), v_result, v_duration, '{}'::jsonb);
  perform public.record_presence_event('platform', 'automation', 'Action executed: ' || v_action.title,
    v_action.expected_outcome, 'completed', v_action.risk_level, true, false);

  return jsonb_build_object('action_id', p_action_id, 'status', v_result, 'duration_ms', v_duration);
end;
$$;

create or replace function public.rollback_platform_action(p_action_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor text;
  v_action public.platform_actions%rowtype;
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;
  if not exists (select 1 from public.platform_actions where id = p_action_id and rollback_available = true) then
    raise exception 'Rollback not available';
  end if;
  select email into v_actor from auth.users where id = auth.uid();
  select * into v_action from public.platform_actions where id = p_action_id;

  update public.platform_actions
  set status = 'rolled_back', verification_result = 'rolled_back', updated_at = now()
  where id = p_action_id;

  perform public.log_action_event(p_action_id, 'rolled_back', coalesce(v_actor, 'platform-admin'), 'rolled_back', null,
    jsonb_build_object('instructions', v_action.rollback_instructions));
  perform public.record_presence_event('platform', 'healing', 'Rollback completed: ' || v_action.title,
    v_action.rollback_instructions, 'completed', 'low', true, false);

  return jsonb_build_object('action_id', p_action_id, 'status', 'rolled_back');
end;
$$;

grant execute on function public.get_action_center_dashboard() to authenticated;
grant execute on function public.list_platform_actions(text) to authenticated;
grant execute on function public.list_action_templates() to authenticated;
grant execute on function public.list_approval_policies() to authenticated;
grant execute on function public.list_action_execution_logs() to authenticated;
grant execute on function public.approve_platform_action(uuid, text) to authenticated;
grant execute on function public.reject_platform_action(uuid, text) to authenticated;
grant execute on function public.execute_platform_action(uuid) to authenticated;
grant execute on function public.rollback_platform_action(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Seed templates, policies, and sample actions
-- ---------------------------------------------------------------------------
insert into public.action_templates (template_key, title, description, category, default_risk_level, prepared_steps, expected_outcome, rollback_available)
values
  ('support_optimization', 'Support Optimization Template', 'Tune support automations from operational patterns.', 'optimization', 'medium',
   '["Analyse support categories", "Apply approved reply templates", "Validate escalation thresholds"]'::jsonb,
   'Reduced support handling time.', true),
  ('installation_recovery', 'Installation Recovery Template', 'Recover failed or degraded installations.', 'recovery', 'low',
   '["Run health scan", "Validate credentials", "Retry connection"]'::jsonb,
   'Installation returned to active state.', true),
  ('webhook_recovery', 'Webhook Recovery Template', 'Retry and reconnect webhook deliveries.', 'recovery', 'low',
   '["Inspect delivery failures", "Retry webhook queue", "Confirm endpoint health"]'::jsonb,
   'Webhook deliveries restored.', true),
  ('onboarding_boost', 'Customer Onboarding Template', 'Accelerate onboarding completion signals.', 'onboarding', 'medium',
   '["Review onboarding checkpoints", "Enable guided automations", "Schedule follow-up"]'::jsonb,
   'Improved trial conversion.', false),
  ('subscription_rescue', 'Subscription Rescue Template', 'Prevent churn from billing or trial signals.', 'billing', 'high',
   '["Review billing health", "Prepare retention workflow", "Queue executive alert"]'::jsonb,
   'Subscription risk mitigated.', true)
on conflict (template_key) do nothing;

insert into public.approval_policies (tenant_id, risk_level, policy_rule, auto_approve, approver_role, manual_only)
values
  (null, 'low', 'Auto approve low-risk operational actions.', true, null, false),
  (null, 'medium', 'Department approval required for workflow changes.', false, 'platform_support', false),
  (null, 'high', 'Owner approval required for high-impact changes.', false, 'super_admin', false),
  (null, 'critical', 'Manual execution only — never auto-execute.', false, 'super_admin', true)
on conflict (tenant_id, risk_level) do nothing;

insert into public.platform_actions (
  action_key, title, reason_generated, recommended_by, environment_type, customer_name,
  risk_level, status, approval_status, prepared_steps, preview_changes, expected_outcome,
  expected_impact, estimated_execution_ms, rollback_available, rollback_state, rollback_instructions
)
values
  (
    'retry_webhook', 'Retry failed webhook deliveries',
    'Webhook failures increased after integration updates across internal and pilot environments.',
    'Aipify Intelligence', 'internal', 'Aipify Group AS', 'low', 'pending_approval', 'pending',
    '["Inspect failed delivery queue", "Retry webhook endpoint", "Validate success response"]'::jsonb,
    '["Webhook retry schedule activated", "Failed queue cleared", "Delivery monitoring enabled"]'::jsonb,
    'Webhook deliveries restored within minutes.',
    'Reduced integration support tickets.', 4000, true,
    '{"webhook_retry_enabled": false}'::jsonb,
    'Disable webhook retry schedule and restore previous delivery settings.'
  ),
  (
    'enable_health_scan', 'Enable post-update health scan',
    'Pattern detected: integration updates correlate with failed automations.',
    'Aipify Intelligence', 'pilot', 'Unonight', 'medium', 'pending_approval', 'pending',
    '["Enable health scan module", "Schedule every 15 minutes", "Activate alert notifications"]'::jsonb,
    '["Health scan enabled", "Schedule: every 15 minutes", "Alert notifications activated"]'::jsonb,
    'Early detection of post-update failures.',
    'Reduced integration failures after updates.', 8000, true,
    '{"health_scan_enabled": false, "schedule_minutes": null}'::jsonb,
    'Restore previous health scan configuration and notification settings.'
  ),
  (
    'restart_automation', 'Restart failed support automation',
    'Support auto-reply workflow stalled after transient API timeout.',
    'Aipify Self-Healing', 'internal', 'Aipify Group AS', 'low', 'approved', 'approved',
    '["Pause automation safely", "Clear stale queue", "Resume with health check"]'::jsonb,
    '["Automation restarted", "Queue cleared", "Health check passed"]'::jsonb,
    'Support automation resumes handling requests.',
    'Prevents support backlog accumulation.', 2500, true,
    '{"automation_paused": true}'::jsonb,
    'Pause automation and restore previous queue state.'
  ),
  (
    'pause_workflow', 'Pause billing reminder workflow',
    'Billing reminder fired during active negotiation window.',
    'Aipify Intelligence', 'customer', 'Nordic Retail AS', 'high', 'pending_approval', 'pending',
    '["Pause workflow execution", "Notify account owner", "Log negotiation hold"]'::jsonb,
    '["Workflow paused", "Owner notification queued", "Hold flag stored"]'::jsonb,
    'Prevents premature billing reminders during negotiation.',
    'Protects customer relationship during sales cycle.', 6000, true,
    '{"workflow_paused": false}'::jsonb,
    'Resume workflow and clear negotiation hold flag.'
  ),
  (
    'reconnect_api', 'Reconnect integration API',
    'API token refresh succeeded for commerce integration.',
    'Aipify Self-Healing', 'pilot', 'Unonight', 'low', 'success', 'auto_approved',
    '["Refresh credentials", "Test API handshake", "Resume sync jobs"]'::jsonb,
    '["Credentials refreshed", "API handshake verified", "Sync resumed"]'::jsonb,
    'Integration connectivity restored.',
    'Prevents commerce sync interruption.', 3200, true, null, null
  ),
  (
    'clear_cache', 'Clear stale analytics cache',
    'Analytics dashboard showed stale metrics after deployment.',
    'Aipify Self-Healing', 'internal', 'Aipify Group AS', 'low', 'success', 'auto_approved',
    '["Identify stale cache keys", "Purge analytics cache", "Warm critical metrics"]'::jsonb,
    '["Cache purged", "Metrics refreshed"]'::jsonb,
    'Analytics reflect current operational state.',
    'Restores reporting accuracy.', 1800, false, null, null
  ),
  (
    'disable_integration', 'Disable failing commerce integration',
    'Repeated API failures risk data corruption.',
    'Aipify Intelligence', 'customer', 'Baltic Commerce', 'critical', 'pending_approval', 'manual_only',
    '["Require human confirmation", "Prepare disable plan", "Queue customer notice"]'::jsonb,
    '["Integration disable prepared", "Customer notice drafted", "Awaiting owner approval"]'::jsonb,
    'Prevents corrupted sync data.',
    'Protects customer data integrity.', 0, false, null,
    'Critical actions must be executed manually by platform owner.'
  ),
  (
    'workflow_update_failed', 'Workflow update rollback required',
    'Partial deployment left automation in inconsistent state.',
    'Aipify Action Engine', 'internal', 'Aipify Group AS', 'medium', 'failed', 'approved',
    '["Apply workflow patch", "Validate trigger chain", "Confirm downstream jobs"]'::jsonb,
    '["Patch applied", "Validation incomplete"]'::jsonb,
    'Workflow should return to stable configuration.',
    'Operational continuity for internal automations.', 12000, true, null,
    'Restore workflow snapshot from previous stable version.'
  );

update public.platform_actions
set approved_by = 'platform-admin', approved_at = now() - interval '2 hours',
    executed_by = 'aipify-engine', executed_at = now() - interval '90 minutes',
    execution_duration_ms = 3200, verification_result = 'verified'
where action_key = 'reconnect_api';

update public.platform_actions
set approved_by = 'aipify-engine', approved_at = now() - interval '4 hours',
    executed_by = 'aipify-engine', executed_at = now() - interval '3 hours',
    execution_duration_ms = 1800, verification_result = 'verified'
where action_key = 'clear_cache';

update public.platform_actions
set approved_by = 'platform-admin', approved_at = now() - interval '1 day',
    executed_by = 'aipify-engine', executed_at = now() - interval '23 hours',
    execution_duration_ms = 12000, verification_result = 'failed'
where action_key = 'workflow_update_failed';

insert into public.action_execution_logs (action_id, actor_email, event_type, result, duration_ms, environment_type)
select id, 'aipify-engine', 'executed', status, execution_duration_ms, environment_type
from public.platform_actions
where executed_at is not null;
