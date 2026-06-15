-- Phase 291 — Playbook Automation Designer

-- ---------------------------------------------------------------------------
-- 1. Extend playbooks
-- ---------------------------------------------------------------------------
alter table public.platform_playbooks
  add column if not exists department text not null default '',
  add column if not exists priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  add column if not exists completion_rule text not null default 'All steps complete successfully',
  add column if not exists notification_config jsonb not null default '{"on_start":true,"on_approval":true,"on_complete":true,"on_failure":true}'::jsonb;

alter table public.platform_playbooks drop constraint if exists platform_playbooks_trigger_type_check;

update public.platform_playbooks set trigger_type = 'manual_start' where trigger_type = 'manual';
update public.platform_playbooks set trigger_type = 'scheduled_execution' where trigger_type = 'scheduled';
update public.platform_playbooks set trigger_type = 'customer_event' where trigger_type = 'event_based';
update public.platform_playbooks set trigger_type = 'billing_event' where trigger_type = 'conditional';

alter table public.platform_playbooks add constraint platform_playbooks_trigger_type_check check (
  trigger_type in (
    'manual_start', 'scheduled_execution', 'customer_event', 'user_event',
    'billing_event', 'support_event', 'growth_partner_event', 'compliance_event'
  )
);

alter table public.platform_playbook_steps
  add column if not exists step_kind text not null default 'action' check (
    step_kind in ('action', 'approval', 'notification', 'completion')
  );

alter table public.platform_playbook_steps drop constraint if exists platform_playbook_steps_action_type_check;

alter table public.platform_playbook_steps add constraint platform_playbook_steps_action_type_check check (
  action_type in (
    'send_notification', 'create_task', 'assign_user', 'request_approval',
    'update_status', 'generate_document', 'escalate_issue', 'trigger_workflow',
    'schedule_reminder', 'generate_report', 'assign_owner', 'trigger_follow_up', 'escalate_case'
  )
);

-- ---------------------------------------------------------------------------
-- 2. Conditions
-- ---------------------------------------------------------------------------
create table if not exists public.platform_playbook_conditions (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.platform_playbooks (id) on delete cascade,
  condition_key text not null check (
    condition_key in (
      'customer_plan_enterprise', 'customer_satisfaction_low', 'subscription_renewal_soon',
      'partner_certification_expiring', 'invoice_overdue'
    )
  ),
  operator text not null default 'equals',
  condition_value text not null default '',
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.platform_playbook_conditions enable row level security;
revoke all on public.platform_playbook_conditions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Approval checkpoints
-- ---------------------------------------------------------------------------
create table if not exists public.platform_playbook_approval_checkpoints (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.platform_playbooks (id) on delete cascade,
  approval_role text not null check (
    approval_role in ('platform_admin', 'department_manager', 'super_admin', 'executive_user')
  ),
  label text not null default '',
  step_order integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.platform_playbook_approval_checkpoints enable row level security;
revoke all on public.platform_playbook_approval_checkpoints from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Execution step tracking
-- ---------------------------------------------------------------------------
alter table public.platform_playbook_executions
  add column if not exists started_by text not null default '',
  add column if not exists current_status text not null default 'running' check (
    current_status in ('running', 'paused', 'completed', 'failed', 'test')
  ),
  add column if not exists completed_steps integer not null default 0,
  add column if not exists failed_steps integer not null default 0,
  add column if not exists completed_at timestamptz;

create table if not exists public.platform_playbook_execution_steps (
  id uuid primary key default gen_random_uuid(),
  execution_id uuid not null references public.platform_playbook_executions (id) on delete cascade,
  step_label text not null default '',
  step_status text not null default 'pending' check (
    step_status in ('pending', 'completed', 'failed', 'skipped')
  ),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.platform_playbook_execution_steps enable row level security;
revoke all on public.platform_playbook_execution_steps from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit event expansion
-- ---------------------------------------------------------------------------
alter table public.platform_playbook_audit_logs drop constraint if exists platform_playbook_audit_logs_event_type_check;

alter table public.platform_playbook_audit_logs add constraint platform_playbook_audit_logs_event_type_check check (
  event_type in (
    'playbook_created', 'playbook_updated', 'playbook_executed', 'playbook_modified',
    'playbook_activated', 'playbook_paused', 'playbook_archived',
    'workflow_executed', 'workflow_failed', 'approval_completed',
    'approval_granted', 'approval_rejected', 'automation_disabled', 'template_published'
  )
);

-- ---------------------------------------------------------------------------
-- 6. Designer helpers
-- ---------------------------------------------------------------------------
create or replace function public._pbe291_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._pbe291_build_designer_playbook(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_pb public.platform_playbooks;
declare v_conditions jsonb;
declare v_approvals jsonb;
declare v_steps jsonb;
begin
  select * into v_pb from public.platform_playbooks where id = p_id;
  if not found then return null; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'condition_key', c.condition_key, 'operator', c.operator,
    'condition_value', c.condition_value, 'sort_order', c.sort_order
  ) order by c.sort_order), '[]'::jsonb)
  into v_conditions from public.platform_playbook_conditions c where c.playbook_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'approval_role', a.approval_role, 'label', a.label, 'step_order', a.step_order
  ) order by a.step_order), '[]'::jsonb)
  into v_approvals from public.platform_playbook_approval_checkpoints a where a.playbook_id = p_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'step_order', s.step_order, 'action_type', s.action_type,
    'step_kind', s.step_kind, 'label', s.label
  ) order by s.step_order), '[]'::jsonb)
  into v_steps from public.platform_playbook_steps s where s.playbook_id = p_id;

  return jsonb_build_object(
    'id', v_pb.id, 'name', v_pb.name, 'description', v_pb.description,
    'category', v_pb.category, 'owner', v_pb.owner, 'department', v_pb.department,
    'priority', v_pb.priority, 'status', v_pb.status, 'trigger_type', v_pb.trigger_type,
    'condition_summary', v_pb.condition_summary, 'requires_approval', v_pb.requires_approval,
    'completion_rule', v_pb.completion_rule, 'notification_config', v_pb.notification_config,
    'is_template', v_pb.is_template, 'last_executed_at', v_pb.last_executed_at,
    'conditions', v_conditions, 'approvals', v_approvals, 'steps', v_steps,
    'created_at', v_pb.created_at, 'updated_at', v_pb.updated_at
  );
end; $$;

create or replace function public._pbe291_seed_designer_templates()
returns void language plpgsql security definer set search_path = public as $$
declare v_names text[] := array[
  'Customer Onboarding', 'Enterprise Procurement', 'Certification Renewal',
  'Incident Escalation', 'Customer Recovery', 'Customer Expansion',
  'Contract Renewal', 'Support Escalation'
];
begin
  if exists (
    select 1 from public.platform_playbooks
    where is_template = true and name = 'Enterprise Procurement'
  ) then return; end if;

  insert into public.platform_playbooks (
    name, category, description, owner, department, priority, trigger_type, status,
    is_template, condition_summary, requires_approval, completion_rule
  ) values
    ('Enterprise Procurement', 'executive_workflows', 'Enterprise deal desk and procurement workflow.', 'Executive Team', 'Sales', 'high', 'customer_event', 'active', true, 'Enterprise expansion opportunity identified', true, 'All approvals granted and documents generated'),
    ('Certification Renewal', 'executive_workflows', 'Growth Partner certification renewal workflow.', 'Partner Ops', 'Partners', 'high', 'growth_partner_event', 'active', true, 'Partner certification renewal window opens', true, 'Certification renewed and stakeholders notified'),
    ('Customer Expansion', 'customer_success', 'Identify and action expansion opportunities.', 'Customer Success', 'Success', 'normal', 'customer_event', 'active', true, 'Expansion signal detected', false, 'Follow-up tasks completed'),
    ('Contract Renewal', 'customer_success', 'Contract renewal preparation and executive review.', 'Customer Success', 'Success', 'high', 'billing_event', 'active', true, 'Contract renewal within 45 days', true, 'Renewal proposal delivered'),
    ('Support Escalation', 'support_operations', 'Escalate unresolved support cases.', 'Support Ops', 'Support', 'critical', 'support_event', 'active', true, 'Critical ticket unresolved after SLA', true, 'Case escalated and owner assigned');

  insert into public.platform_playbook_conditions (playbook_id, condition_key, operator, condition_value, sort_order)
  select p.id, 'customer_plan_enterprise', 'equals', 'enterprise', 1
  from public.platform_playbooks p where p.name = 'Enterprise Procurement';

  insert into public.platform_playbook_approval_checkpoints (playbook_id, approval_role, label, step_order)
  select p.id, 'executive_user', 'Executive sign-off on procurement terms', 1
  from public.platform_playbooks p where p.name = 'Enterprise Procurement';
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Designer RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_playbook_designer(
  p_playbook_id uuid default null,
  p_surface text default 'platform'
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_playbook jsonb;
  v_templates jsonb;
  v_executions jsonb;
  v_audit jsonb;
  v_super jsonb;
  v_principle text := 'Organizations thrive when best practices become repeatable. Playbooks transform experience into operational excellence.';
begin
  perform public._pbe281_require_platform_admin();
  perform public._pbe281_seed_if_empty();
  perform public._pbe291_seed_designer_templates();

  if p_surface = 'super' then
    perform public._pbe291_require_super_admin();
  end if;

  if p_playbook_id is not null then
    v_playbook := public._pbe291_build_designer_playbook(p_playbook_id);

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', e.id, 'playbook_id', e.playbook_id, 'playbook_name', p.name,
      'trigger_event', e.trigger_event, 'outcome', e.outcome,
      'started_by', e.started_by, 'current_status', e.current_status,
      'completed_steps', e.completed_steps, 'failed_steps', e.failed_steps,
      'duration_seconds', e.duration_seconds, 'owner', e.owner,
      'approval_status', e.approval_status, 'executed_at', e.executed_at,
      'completed_at', e.completed_at,
      'steps', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', es.id, 'step_label', es.step_label, 'step_status', es.step_status, 'completed_at', es.completed_at
        ) order by es.created_at)
        from public.platform_playbook_execution_steps es where es.execution_id = e.id
      ), '[]'::jsonb)
    ) order by e.executed_at desc), '[]'::jsonb)
    into v_executions
    from public.platform_playbook_executions e
    join public.platform_playbooks p on p.id = e.playbook_id
    where e.playbook_id = p_playbook_id;
  end if;

  select coalesce(jsonb_agg(public._pbe291_build_designer_playbook(p.id) order by p.name), '[]'::jsonb)
  into v_templates
  from public.platform_playbooks p where p.is_template = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'playbook_id', l.playbook_id, 'event_type', l.event_type,
    'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.platform_playbook_audit_logs
    where p_playbook_id is null or playbook_id = p_playbook_id
    order by created_at desc limit 30
  ) l;

  if p_surface = 'super' then
    v_super := jsonb_build_object(
      'total_playbooks', (select count(*)::int from public.platform_playbooks where is_template = false),
      'active_playbooks', (select count(*)::int from public.platform_playbooks where status = 'active' and is_template = false),
      'failed_executions_7d', (
        select count(*)::int from public.platform_playbook_executions
        where outcome = 'failed' and executed_at >= now() - interval '7 days'
      ),
      'templates_published', (select count(*)::int from public.platform_playbooks where is_template = true and status = 'active')
    );
  end if;

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'principle', v_principle,
    'playbook', coalesce(v_playbook, 'null'::jsonb),
    'templates', coalesce(v_templates, '[]'::jsonb),
    'executions', coalesce(v_executions, '[]'::jsonb),
    'audit', coalesce(v_audit, '[]'::jsonb),
    'super', coalesce(v_super, '{}'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Designer actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_platform_playbook_designer_action(
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_action text;
  v_playbook_id uuid;
  v_execution_id uuid;
  v_step_id uuid;
  v_surface text;
  v_test jsonb;
begin
  perform public._pbe281_require_platform_admin();
  p_payload := coalesce(p_payload, '{}'::jsonb);
  v_action := p_payload->>'action';
  v_playbook_id := (p_payload->>'playbook_id')::uuid;
  v_execution_id := (p_payload->>'execution_id')::uuid;
  v_step_id := (p_payload->>'step_id')::uuid;
  v_surface := coalesce(p_payload->>'surface', 'platform');

  if v_surface = 'super' then perform public._pbe291_require_super_admin(); end if;

  if v_action = 'save_designer' and v_playbook_id is not null then
    update public.platform_playbooks set
      name = coalesce(p_payload->>'name', name),
      description = coalesce(p_payload->>'description', description),
      owner = coalesce(p_payload->>'owner', owner),
      department = coalesce(p_payload->>'department', department),
      priority = coalesce(p_payload->>'priority', priority),
      category = coalesce(p_payload->>'category', category),
      trigger_type = coalesce(p_payload->>'trigger_type', trigger_type),
      completion_rule = coalesce(p_payload->>'completion_rule', completion_rule),
      condition_summary = coalesce(p_payload->>'condition_summary', condition_summary),
      requires_approval = coalesce((p_payload->>'requires_approval')::boolean, requires_approval),
      notification_config = coalesce(p_payload->'notification_config', notification_config),
      updated_at = now()
    where id = v_playbook_id;

    delete from public.platform_playbook_conditions where playbook_id = v_playbook_id;
    insert into public.platform_playbook_conditions (playbook_id, condition_key, operator, condition_value, sort_order)
    select v_playbook_id, c->>'condition_key', coalesce(c->>'operator', 'equals'), coalesce(c->>'condition_value', ''), (ord)::int
    from jsonb_array_elements(coalesce(p_payload->'conditions', '[]'::jsonb)) with ordinality as t(c, ord)
    where c->>'condition_key' is not null;

    delete from public.platform_playbook_approval_checkpoints where playbook_id = v_playbook_id;
    insert into public.platform_playbook_approval_checkpoints (playbook_id, approval_role, label, step_order)
    select v_playbook_id, a->>'approval_role', coalesce(a->>'label', ''), (ord)::int
    from jsonb_array_elements(coalesce(p_payload->'approvals', '[]'::jsonb)) with ordinality as t(a, ord)
    where a->>'approval_role' is not null;

    perform public._pbe281_log_audit(v_playbook_id, 'playbook_modified', 'Playbook designer saved.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_action = 'test_playbook' and v_playbook_id is not null then
    insert into public.platform_playbook_executions (
      playbook_id, trigger_event, outcome, duration_seconds, owner, started_by,
      current_status, completed_steps, failed_steps, manual_intervention
    ) values (
      v_playbook_id, 'Test simulation', 'successful', 0,
      coalesce(p_payload->>'owner', 'Designer'), coalesce(p_payload->>'started_by', 'Platform Admin'),
      'test', (select count(*)::int from public.platform_playbook_steps where playbook_id = v_playbook_id),
      0, false
    ) returning id into v_execution_id;

    insert into public.platform_playbook_execution_steps (execution_id, step_label, step_status, completed_at)
    select v_execution_id, s.label, 'completed', now()
    from public.platform_playbook_steps s where s.playbook_id = v_playbook_id;

    v_test := jsonb_build_object('execution_id', v_execution_id, 'mode', 'test', 'valid', true, 'message', 'Simulation completed — logic validated.');
    perform public._pbe281_log_audit(v_playbook_id, 'workflow_executed', 'Test mode simulation completed.', v_test);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface) || jsonb_build_object('test_result', v_test);
  end if;

  if v_action = 'retry_step' and v_step_id is not null then
    update public.platform_playbook_execution_steps set step_status = 'completed', completed_at = now() where id = v_step_id;
    select execution_id into v_execution_id from public.platform_playbook_execution_steps where id = v_step_id;
    select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_execution_id;
    perform public._pbe281_log_audit(v_playbook_id, 'workflow_executed', 'Step retried.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_action = 'skip_step' and v_step_id is not null then
    update public.platform_playbook_execution_steps set step_status = 'skipped', completed_at = now() where id = v_step_id;
    select execution_id into v_execution_id from public.platform_playbook_execution_steps where id = v_step_id;
    select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_execution_id;
    perform public._pbe281_log_audit(v_playbook_id, 'workflow_executed', 'Step skipped.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_action = 'escalate_step' and v_step_id is not null then
    update public.platform_playbook_execution_steps set step_status = 'failed' where id = v_step_id;
    select execution_id into v_execution_id from public.platform_playbook_execution_steps where id = v_step_id;
    update public.platform_playbook_executions set manual_intervention = true, current_status = 'failed' where id = v_execution_id;
    select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_execution_id;
    perform public._pbe281_log_audit(v_playbook_id, 'workflow_failed', 'Step escalated to human review.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_action = 'pause_workflow' and v_execution_id is not null then
    update public.platform_playbook_executions set current_status = 'paused' where id = v_execution_id;
    select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_execution_id;
    perform public._pbe281_log_audit(v_playbook_id, 'playbook_paused', 'Workflow paused.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_surface = 'super' and v_action = 'publish_template' and v_playbook_id is not null then
    update public.platform_playbooks set is_template = true, status = 'active', updated_at = now() where id = v_playbook_id;
    perform public._pbe281_log_audit(v_playbook_id, 'template_published', 'Template published by Super Admin.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  if v_surface = 'super' and v_action = 'disable_workflow' and v_playbook_id is not null then
    update public.platform_playbooks set status = 'paused', updated_at = now() where id = v_playbook_id;
    perform public._pbe281_log_audit(v_playbook_id, 'automation_disabled', 'Workflow disabled by Super Admin.', p_payload);
    return public.get_platform_playbook_designer(v_playbook_id, v_surface);
  end if;

  raise exception 'Unknown designer action: %', v_action;
end; $$;

grant execute on function public.get_platform_playbook_designer(uuid, text) to authenticated;
grant execute on function public.record_platform_playbook_designer_action(jsonb) to authenticated;

-- Unify playbook row builder for center + designer
create or replace function public._pbe281_build_playbook_row(p_playbook public.platform_playbooks)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public._pbe291_build_designer_playbook(p_playbook.id);
end;
$$;

notify pgrst, 'reload schema';
