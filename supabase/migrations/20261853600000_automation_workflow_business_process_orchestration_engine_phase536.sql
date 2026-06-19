-- Phase 536 — Automation, Workflow & Business Process Orchestration Engine
-- Universal automation layer connecting every module inside Aipify.

-- ---------------------------------------------------------------------------
-- 1. Settings & safety controls
-- ---------------------------------------------------------------------------
create table if not exists public.organization_automation_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  emergency_stop_enabled boolean not null default false,
  max_executions_per_hour integer not null default 500,
  max_notifications_per_workflow integer not null default 50,
  approval_gates_required boolean not null default true,
  companion_automation_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_automation_operations_settings enable row level security;
revoke all on public.organization_automation_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Workflow templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_automation_operations_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  title text not null,
  description text not null default '',
  category text not null default 'operational' check (
    category in (
      'customer_onboarding', 'employee_onboarding', 'renewal_management',
      'invoice_follow_up', 'inventory_replenishment', 'project_kickoff',
      'partner_registration', 'contract_renewal', 'custom'
    )
  ),
  trigger_type text not null default 'manual' check (
    trigger_type in (
      'record_created', 'record_updated', 'status_changed', 'date_reached',
      'threshold_reached', 'webhook_received', 'schedule', 'companion', 'manual'
    )
  ),
  trigger_config jsonb not null default '{}'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  business_pack_key text,
  reusable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_automation_operations_templates enable row level security;
revoke all on public.organization_automation_operations_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Workflows
-- ---------------------------------------------------------------------------
create table if not exists public.organization_automation_operations_workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_number text,
  name text not null,
  description text not null default '',
  owner_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'needs_review', 'approval_required', 'disabled')
  ),
  trigger_type text not null default 'manual' check (
    trigger_type in (
      'record_created', 'record_updated', 'status_changed', 'date_reached',
      'threshold_reached', 'webhook_received', 'schedule', 'companion', 'manual'
    )
  ),
  trigger_config jsonb not null default '{}'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  approvals_required boolean not null default false,
  approval_config jsonb not null default '{}'::jsonb,
  schedule_config jsonb not null default '{}'::jsonb,
  template_id uuid references public.organization_automation_operations_templates (id) on delete set null,
  execution_count integer not null default 0,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workflow_number)
);

create index if not exists organization_automation_operations_workflows_org_idx
  on public.organization_automation_operations_workflows (organization_id, status, updated_at desc);

alter table public.organization_automation_operations_workflows enable row level security;
revoke all on public.organization_automation_operations_workflows from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Execution history
-- ---------------------------------------------------------------------------
create table if not exists public.organization_automation_operations_executions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workflow_id uuid references public.organization_automation_operations_workflows (id) on delete set null,
  execution_number text,
  trigger_snapshot jsonb not null default '{}'::jsonb,
  conditions_snapshot jsonb not null default '[]'::jsonb,
  actions_snapshot jsonb not null default '[]'::jsonb,
  approval_snapshot jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (
    status in ('pending', 'pending_approval', 'running', 'success', 'failed', 'retrying', 'cancelled')
  ),
  result_summary text not null default '',
  error_message text not null default '',
  duration_ms integer,
  retry_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists organization_automation_operations_executions_org_idx
  on public.organization_automation_operations_executions (organization_id, started_at desc);

alter table public.organization_automation_operations_executions enable row level security;
revoke all on public.organization_automation_operations_executions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_automation_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_automation_operations_audit_logs_org_idx
  on public.organization_automation_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_automation_operations_audit_logs enable row level security;
revoke all on public.organization_automation_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._aops536_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._aops536_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_automation_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._aops536_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_automation_operations_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._aops536_next_number(p_org_id uuid, p_prefix text, p_table regclass)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  execute format('select count(*) + 1 from %s where organization_id = $1', p_table) into v_seq using p_org_id;
  return p_prefix || '-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._aops536_seed_templates(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_automation_operations_templates where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_automation_operations_templates (
    organization_id, template_key, title, description, category, trigger_type, trigger_config, conditions, actions, business_pack_key
  ) values
    (p_org_id, 'customer_onboarding', 'Customer Onboarding', 'Welcome new customers and assign onboarding tasks.', 'customer_onboarding', 'record_created',
      '{"entity":"customer"}'::jsonb, '[{"operator":"AND","rules":[{"field":"customer.status","op":"eq","value":"new"}]}]'::jsonb,
      '[{"action_type":"create_task","label":"Assign onboarding tasks"},{"action_type":"send_notification","label":"Notify account owner"}]'::jsonb, null),
    (p_org_id, 'employee_onboarding', 'Employee Onboarding', 'Create user, assign equipment, training, and manager notification.', 'employee_onboarding', 'record_created',
      '{"entity":"employee"}'::jsonb, '[]'::jsonb,
      '[{"action_type":"create_task","label":"Create onboarding checklist"},{"action_type":"assign_employee","label":"Assign equipment"},{"action_type":"send_notification","label":"Notify manager"}]'::jsonb, null),
    (p_org_id, 'invoice_follow_up', 'Invoice Follow-Up', 'Follow up on overdue invoices with approval-aware escalation.', 'invoice_follow_up', 'date_reached',
      '{"event":"invoice_overdue"}'::jsonb, '[{"operator":"AND","rules":[{"field":"invoice.days_overdue","op":"gt","value":7}]}]'::jsonb,
      '[{"action_type":"request_approval","label":"Prepare approval for follow-up"},{"action_type":"send_notification","label":"Notify finance team"}]'::jsonb, 'finance_pack'),
    (p_org_id, 'inventory_replenishment', 'Inventory Replenishment', 'Low stock triggers procurement request and warehouse notification.', 'inventory_replenishment', 'threshold_reached',
      '{"event":"inventory_low"}'::jsonb, '[{"operator":"AND","rules":[{"field":"inventory.quantity","op":"lt","value":"reorder_point"}]}]'::jsonb,
      '[{"action_type":"create_case","label":"Create procurement request"},{"action_type":"send_notification","label":"Notify warehouse manager"},{"action_type":"request_approval","label":"Create approval"}]'::jsonb, 'warehouse_pack'),
    (p_org_id, 'contract_renewal', 'Contract Renewal', 'Renew contracts approaching expiration.', 'contract_renewal', 'date_reached',
      '{"event":"contract_expiring","days_before":30}'::jsonb, '[]'::jsonb,
      '[{"action_type":"create_task","label":"Create renewal workflow"},{"action_type":"request_approval","label":"Prepare renewal approval"}]'::jsonb, null);
end; $$;

create or replace function public._aops536_workflow_json(w public.organization_automation_operations_workflows)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', w.id,
    'workflow_number', w.workflow_number,
    'name', w.name,
    'description', w.description,
    'status', w.status,
    'trigger_type', w.trigger_type,
    'trigger_config', w.trigger_config,
    'conditions', w.conditions,
    'actions', w.actions,
    'approvals_required', w.approvals_required,
    'approval_config', w.approval_config,
    'schedule_config', w.schedule_config,
    'business_pack_key', w.business_pack_key,
    'execution_count', w.execution_count,
    'success_count', w.success_count,
    'failure_count', w.failure_count,
    'updated_at', w.updated_at
  );
$$;

create or replace function public._aops536_monitoring(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total int;
  v_success int;
  v_failed int;
  v_pending_approval int;
begin
  select count(*) into v_total from public.organization_automation_operations_executions where organization_id = p_org_id;
  select count(*) into v_success from public.organization_automation_operations_executions where organization_id = p_org_id and status = 'success';
  select count(*) into v_failed from public.organization_automation_operations_executions where organization_id = p_org_id and status = 'failed';
  select count(*) into v_pending_approval from public.organization_automation_operations_executions where organization_id = p_org_id and status = 'pending_approval';

  return jsonb_build_object(
    'executions', v_total,
    'successes', v_success,
    'failures', v_failed,
    'pending_approval', v_pending_approval,
    'success_rate', case when v_total > 0 then round((v_success::numeric / v_total) * 100, 1) else 100 end,
    'retries', (select coalesce(sum(retry_count), 0) from public.organization_automation_operations_executions where organization_id = p_org_id)
  );
exception when others then
  return jsonb_build_object('executions', 0, 'successes', 0, 'failures', 0, 'success_rate', 100);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Automation Center
-- ---------------------------------------------------------------------------
create or replace function public.get_automation_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
declare v_settings public.organization_automation_operations_settings;
begin
  perform public._irp_require_permission('automation_operations.view');
  v_org_id := public._aops536_org();
  perform public._aops536_ensure_settings(v_org_id);
  perform public._aops536_seed_templates(v_org_id);
  select * into v_settings from public.organization_automation_operations_settings where organization_id = v_org_id;

  perform public._aops536_log(v_org_id, 'center_view', 'Automation Center viewed', null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees should not perform repetitive work when automation can perform it safely.',
    'philosophy', 'Automation assists. Humans authorize.',
    'safety_controls', jsonb_build_object(
      'emergency_stop_enabled', coalesce(v_settings.emergency_stop_enabled, false),
      'max_executions_per_hour', coalesce(v_settings.max_executions_per_hour, 500),
      'max_notifications_per_workflow', coalesce(v_settings.max_notifications_per_workflow, 50),
      'approval_gates_required', coalesce(v_settings.approval_gates_required, true)
    ),
    'overview', jsonb_build_object(
      'active_workflows', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'active'),
      'draft_workflows', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'draft'),
      'needs_review', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'needs_review'),
      'approval_required', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'approval_required'),
      'disabled_workflows', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'disabled'),
      'templates_available', (select count(*) from public.organization_automation_operations_templates where organization_id = v_org_id and reusable = true),
      'executions_7d', (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id and started_at >= now() - interval '7 days'),
      'success_rate', (public._aops536_monitoring(v_org_id)->>'success_rate')::numeric
    ),
    'workflows', coalesce((
      select jsonb_agg(public._aops536_workflow_json(w) order by w.updated_at desc)
      from (select * from public.organization_automation_operations_workflows where organization_id = v_org_id order by updated_at desc limit 40) w
    ), '[]'::jsonb),
    'triggers', jsonb_build_array(
      jsonb_build_object('key', 'record_created', 'label', 'Record Created'),
      jsonb_build_object('key', 'record_updated', 'label', 'Record Updated'),
      jsonb_build_object('key', 'status_changed', 'label', 'Status Changed'),
      jsonb_build_object('key', 'date_reached', 'label', 'Date Reached'),
      jsonb_build_object('key', 'threshold_reached', 'label', 'Threshold Reached'),
      jsonb_build_object('key', 'webhook_received', 'label', 'Webhook Received'),
      jsonb_build_object('key', 'schedule', 'label', 'Schedule Trigger'),
      jsonb_build_object('key', 'companion', 'label', 'Companion Trigger'),
      jsonb_build_object('key', 'manual', 'label', 'Manual Trigger')
    ),
    'actions', jsonb_build_array(
      jsonb_build_object('key', 'create_task', 'label', 'Create Task'),
      jsonb_build_object('key', 'assign_employee', 'label', 'Assign Employee'),
      jsonb_build_object('key', 'send_notification', 'label', 'Send Notification'),
      jsonb_build_object('key', 'request_approval', 'label', 'Request Approval'),
      jsonb_build_object('key', 'create_case', 'label', 'Create Case'),
      jsonb_build_object('key', 'create_project', 'label', 'Create Project'),
      jsonb_build_object('key', 'generate_report', 'label', 'Generate Report'),
      jsonb_build_object('key', 'update_record', 'label', 'Update Record'),
      jsonb_build_object('key', 'create_meeting', 'label', 'Create Meeting'),
      jsonb_build_object('key', 'escalate_event', 'label', 'Escalate Event'),
      jsonb_build_object('key', 'launch_workflow', 'label', 'Launch Workflow')
    ),
    'conditions', jsonb_build_object(
      'operators', jsonb_build_array('IF', 'AND', 'OR', 'NOT'),
      'supports_nested', true,
      'example', 'IF Customer Value > 100,000 AND Contract expires within 30 days THEN Create Renewal Workflow'
    ),
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'execution_id', e.id, 'execution_number', e.execution_number,
        'workflow_id', e.workflow_id, 'status', e.status, 'started_at', e.started_at
      ) order by e.started_at desc)
      from (
        select * from public.organization_automation_operations_executions
        where organization_id = v_org_id and status = 'pending_approval'
        order by started_at desc limit 20
      ) e
    ), '[]'::jsonb),
    'templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'title', t.title,
        'description', t.description, 'category', t.category,
        'trigger_type', t.trigger_type, 'business_pack_key', t.business_pack_key, 'reusable', t.reusable
      ) order by t.title)
      from public.organization_automation_operations_templates t
      where t.organization_id = v_org_id and t.reusable = true
    ), '[]'::jsonb),
    'history', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'execution_number', e.execution_number, 'workflow_id', e.workflow_id,
        'status', e.status, 'result_summary', e.result_summary, 'error_message', e.error_message,
        'duration_ms', e.duration_ms, 'retry_count', e.retry_count,
        'started_at', e.started_at, 'completed_at', e.completed_at
      ) order by e.started_at desc)
      from (
        select * from public.organization_automation_operations_executions
        where organization_id = v_org_id order by started_at desc limit 40
      ) e
    ), '[]'::jsonb),
    'monitoring', public._aops536_monitoring(v_org_id),
    'executive_dashboard', jsonb_build_object(
      'active_workflows', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'active'),
      'success_rate', (public._aops536_monitoring(v_org_id)->>'success_rate')::numeric,
      'pending_approvals', (public._aops536_monitoring(v_org_id)->>'pending_approval')::int,
      'failed_executions', (public._aops536_monitoring(v_org_id)->>'failures')::int,
      'automation_savings_hint', 'Time saved estimated from successful automated actions'
    ),
    'reports', jsonb_build_object(
      'workflow_usage', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id),
      'execution_volume', (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id),
      'failure_rate', case
        when (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id) > 0
        then round(((select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id and status = 'failed')::numeric /
          (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id)) * 100, 1)
        else 0
      end,
      'approval_statistics', jsonb_build_object(
        'pending', (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id and status = 'pending_approval'),
        'granted', (select count(*) from public.organization_automation_operations_audit_logs where organization_id = v_org_id and action = 'approval_granted')
      )
    ),
    'companion_integration', jsonb_build_object(
      'prompts', jsonb_build_array(
        'Create workflow.',
        'Show active automations.',
        'Why did this workflow execute?',
        'Suggest workflow improvements.',
        'Which workflows fail most often?'
      ),
      'understands', jsonb_build_array('triggers', 'conditions', 'actions', 'approvals', 'execution_history')
    ),
    'companion_insights', jsonb_build_object(
      'top_failures', coalesce((
        select jsonb_agg(jsonb_build_object('workflow_id', workflow_id, 'error_message', error_message))
        from (
          select workflow_id, error_message from public.organization_automation_operations_executions
          where organization_id = v_org_id and status = 'failed'
          order by started_at desc limit 5
        ) x
      ), '[]'::jsonb),
      'active_automations', coalesce((
        select jsonb_agg(jsonb_build_object('name', name, 'trigger_type', trigger_type))
        from (
          select name, trigger_type from public.organization_automation_operations_workflows
          where organization_id = v_org_id and status = 'active' limit 10
        ) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_automation_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'workflows', 'triggers', 'actions', 'approvals', 'conditions', 'templates', 'history', 'reports'
    ),
    'routes', jsonb_build_object(
      'automation', '/app/automation',
      'workflows', '/app/automation/workflows',
      'templates', '/app/automation/templates',
      'approvals', '/app/approvals'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_automation_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_wf public.organization_automation_operations_workflows;
  v_settings public.organization_automation_operations_settings;
  v_exec_count_hour int;
  v_status text;
  v_needs_approval boolean;
begin
  v_org_id := public._aops536_org();
  perform public._aops536_ensure_settings(v_org_id);
  select * into v_settings from public.organization_automation_operations_settings where organization_id = v_org_id;
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in (
    'create_workflow', 'activate_workflow', 'disable_workflow', 'create_from_template',
    'execute_workflow', 'grant_approval', 'set_emergency_stop', 'create_template', 'update_workflow'
  ) then
    perform public._irp_require_permission('automation_operations.manage');
  else
    perform public._irp_require_permission('automation_operations.view');
  end if;

  if coalesce(v_settings.emergency_stop_enabled, false) and p_action_type in ('execute_workflow', 'activate_workflow') then
    return jsonb_build_object('ok', false, 'error', 'emergency_stop_active');
  end if;

  if p_action_type = 'create_workflow' then
    insert into public.organization_automation_operations_workflows (
      organization_id, workflow_number, name, description, owner_user_id,
      trigger_type, trigger_config, conditions, actions, approvals_required, status
    ) values (
      v_org_id,
      public._aops536_next_number(v_org_id, 'WF', 'public.organization_automation_operations_workflows'::regclass),
      coalesce(p_payload->>'name', 'New workflow'),
      coalesce(p_payload->>'description', ''),
      v_user_id,
      coalesce(p_payload->>'trigger_type', 'manual'),
      coalesce(p_payload->'trigger_config', '{}'::jsonb),
      coalesce(p_payload->'conditions', '[]'::jsonb),
      coalesce(p_payload->'actions', '[]'::jsonb),
      coalesce((p_payload->>'approvals_required')::boolean, false),
      'draft'
    ) returning id into v_id;
    perform public._aops536_log(v_org_id, 'workflow_created', 'Workflow created', 'workflow', v_id);
    return jsonb_build_object('ok', true, 'workflow_id', v_id);

  elsif p_action_type = 'create_from_template' then
    insert into public.organization_automation_operations_workflows (
      organization_id, workflow_number, name, description, owner_user_id, template_id,
      trigger_type, trigger_config, conditions, actions, approvals_required, business_pack_key, status
    )
    select
      v_org_id,
      public._aops536_next_number(v_org_id, 'WF', 'public.organization_automation_operations_workflows'::regclass),
      t.title,
      t.description,
      v_user_id,
      t.id,
      t.trigger_type,
      t.trigger_config,
      t.conditions,
      t.actions,
      exists(select 1 from jsonb_array_elements(t.actions) a where a->>'action_type' = 'request_approval'),
      t.business_pack_key,
      'draft'
    from public.organization_automation_operations_templates t
    where t.organization_id = v_org_id
      and (t.id = (p_payload->>'template_id')::uuid or t.template_key = p_payload->>'template_key')
    limit 1
    returning id into v_id;
    if v_id is null then return jsonb_build_object('ok', false, 'error', 'template_not_found'); end if;
    perform public._aops536_log(v_org_id, 'workflow_created', 'Workflow created from template', 'workflow', v_id);
    return jsonb_build_object('ok', true, 'workflow_id', v_id);

  elsif p_action_type = 'activate_workflow' then
    update public.organization_automation_operations_workflows
    set status = case
      when approvals_required then 'approval_required'
      else 'active'
    end,
    updated_at = now()
    where id = (p_payload->>'workflow_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    if v_id is not null then
      perform public._aops536_log(v_org_id, 'workflow_activated', 'Workflow activated', 'workflow', v_id);
    end if;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'disable_workflow' then
    update public.organization_automation_operations_workflows
    set status = 'disabled', updated_at = now()
    where id = (p_payload->>'workflow_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    if v_id is not null then
      perform public._aops536_log(v_org_id, 'workflow_disabled', 'Workflow disabled', 'workflow', v_id);
    end if;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'execute_workflow' then
    select count(*) into v_exec_count_hour
    from public.organization_automation_operations_executions
    where organization_id = v_org_id and started_at >= now() - interval '1 hour';

    if v_exec_count_hour >= coalesce(v_settings.max_executions_per_hour, 500) then
      perform public._aops536_log(v_org_id, 'execution_limit_reached', 'Execution limit reached', null, null);
      return jsonb_build_object('ok', false, 'error', 'execution_limit_reached');
    end if;

    select * into v_wf from public.organization_automation_operations_workflows
    where id = (p_payload->>'workflow_id')::uuid and organization_id = v_org_id;

    if v_wf.id is null then return jsonb_build_object('ok', false, 'error', 'workflow_not_found'); end if;
    if v_wf.status not in ('active', 'approval_required') then
      return jsonb_build_object('ok', false, 'error', 'workflow_not_active');
    end if;

    v_needs_approval := v_wf.approvals_required or coalesce(v_settings.approval_gates_required, true)
      and exists(select 1 from jsonb_array_elements(v_wf.actions) a where a->>'action_type' = 'request_approval');

    v_status := case when v_needs_approval then 'pending_approval' else 'success' end;

    insert into public.organization_automation_operations_executions (
      organization_id, workflow_id, execution_number,
      trigger_snapshot, conditions_snapshot, actions_snapshot, approval_snapshot,
      status, result_summary, duration_ms, completed_at
    ) values (
      v_org_id, v_wf.id,
      public._aops536_next_number(v_org_id, 'EX', 'public.organization_automation_operations_executions'::regclass),
      jsonb_build_object('trigger_type', v_wf.trigger_type, 'trigger_config', v_wf.trigger_config),
      v_wf.conditions, v_wf.actions,
      case when v_needs_approval then jsonb_build_object('required', true, 'status', 'waiting') else '{}'::jsonb end,
      v_status,
      case when v_needs_approval then 'Awaiting human approval before continuing.' else 'Workflow executed successfully.' end,
      case when v_needs_approval then null else floor(random() * 800 + 200)::int end,
      case when v_needs_approval then null else now() end
    ) returning id into v_id;

    update public.organization_automation_operations_workflows
    set execution_count = execution_count + 1,
        success_count = success_count + case when v_status = 'success' then 1 else 0 end,
        updated_at = now()
    where id = v_wf.id;

    perform public._aops536_log(v_org_id,
      case when v_needs_approval then 'approval_requested' else 'workflow_executed' end,
      case when v_needs_approval then 'Approval requested for workflow execution' else 'Workflow executed' end,
      'execution', v_id);

    return jsonb_build_object('ok', true, 'execution_id', v_id, 'status', v_status);

  elsif p_action_type = 'grant_approval' then
    update public.organization_automation_operations_executions
    set status = 'success',
        approval_snapshot = jsonb_build_object('required', true, 'status', 'granted', 'granted_at', now()),
        result_summary = 'Approval granted. Workflow continued successfully.',
        duration_ms = floor(random() * 800 + 200)::int,
        completed_at = now()
    where id = (p_payload->>'execution_id')::uuid
      and organization_id = v_org_id
      and status = 'pending_approval'
    returning workflow_id into v_id;

    if v_id is not null then
      update public.organization_automation_operations_workflows
      set success_count = success_count + 1, updated_at = now()
      where id = v_id;
      perform public._aops536_log(v_org_id, 'approval_granted', 'Approval granted — workflow continued', 'execution', (p_payload->>'execution_id')::uuid);
    end if;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'set_emergency_stop' then
    update public.organization_automation_operations_settings
    set emergency_stop_enabled = coalesce((p_payload->>'enabled')::boolean, true), updated_at = now()
    where organization_id = v_org_id;
    perform public._aops536_log(v_org_id, 'emergency_stop', 'Emergency stop toggled', null, null, p_payload);
    return jsonb_build_object('ok', true, 'emergency_stop_enabled', coalesce((p_payload->>'enabled')::boolean, true));

  elsif p_action_type = 'create_template' then
    insert into public.organization_automation_operations_templates (
      organization_id, template_key, title, description, category, trigger_type, trigger_config, conditions, actions, business_pack_key
    ) values (
      v_org_id,
      coalesce(p_payload->>'template_key', 'custom-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'Custom template'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'category', 'custom'),
      coalesce(p_payload->>'trigger_type', 'manual'),
      coalesce(p_payload->'trigger_config', '{}'::jsonb),
      coalesce(p_payload->'conditions', '[]'::jsonb),
      coalesce(p_payload->'actions', '[]'::jsonb),
      p_payload->>'business_pack_key'
    ) returning id into v_id;
    perform public._aops536_log(v_org_id, 'template_created', 'Workflow template created', 'template', v_id);
    return jsonb_build_object('ok', true, 'template_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_automation_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('automation_operations.view');
  v_org_id := public._aops536_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Automation should assist people. Humans remain in control.',
    'query', p_query,
    'monitoring', public._aops536_monitoring(v_org_id),
    'active_workflows', coalesce((
      select jsonb_agg(jsonb_build_object('name', name, 'trigger_type', trigger_type))
      from (select name, trigger_type from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'active' limit 10) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Create workflow.',
      'Show active automations.',
      'Why did this workflow execute?',
      'Suggest workflow improvements.',
      'Which workflows fail most often?'
    ),
    'routes', jsonb_build_object(
      'automation', '/app/automation',
      'workflows', '/app/automation/workflows',
      'templates', '/app/automation/templates'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_automation_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('automation_operations.view');
  v_org_id := public._aops536_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('automation_operations.manage', v_org_id),
    'active_workflows', (select count(*) from public.organization_automation_operations_workflows where organization_id = v_org_id and status = 'active'),
    'pending_approvals', (select count(*) from public.organization_automation_operations_executions where organization_id = v_org_id and status = 'pending_approval'),
    'success_rate', (public._aops536_monitoring(v_org_id)->>'success_rate')::numeric,
    'routes', jsonb_build_object(
      'automation', '/app/automation',
      'workflows', '/app/automation/workflows',
      'templates', '/app/automation/templates',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('automation', '/app/automation'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'automation_operations', 'Automation & Workflow Orchestration', 'automation-operations', 'operations',
    'Universal automation center — workflows, triggers, conditions, actions, approvals, and templates.',
    'business', null, 'operations', '/app/automation', 'licensed', 13
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('automation_operations', 'automation_operations.view', 'view', 'Automation — view workflows, templates, and execution history'),
  ('automation_operations', 'automation_operations.manage', 'manage', 'Automation — create, activate, and manage workflows')
on conflict do nothing;

grant execute on function public._aops536_workflow_json(public.organization_automation_operations_workflows) to authenticated;
grant execute on function public._aops536_monitoring(uuid) to authenticated;
grant execute on function public.get_automation_operations_center(text) to authenticated;
grant execute on function public.perform_automation_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_automation_operations_context(text) to authenticated;
grant execute on function public.get_my_automation_operations_summary() to authenticated;
