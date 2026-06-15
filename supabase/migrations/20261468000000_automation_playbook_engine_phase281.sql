-- Phase 281 — Automation & Playbook Engine (Platform Admin)

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.platform_playbooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (
    category in (
      'customer_onboarding', 'customer_success', 'billing_operations', 'support_operations',
      'security_procedures', 'employee_onboarding', 'incident_response', 'executive_workflows'
    )
  ),
  description text not null default '',
  owner text not null default '',
  trigger_type text not null default 'manual' check (
    trigger_type in ('manual', 'scheduled', 'event_based', 'conditional')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'archived')
  ),
  condition_summary text not null default '',
  requires_approval boolean not null default false,
  is_template boolean not null default false,
  last_executed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists platform_playbooks_status_idx
  on public.platform_playbooks (status, category);

create table if not exists public.platform_playbook_steps (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.platform_playbooks (id) on delete cascade,
  step_order integer not null default 1,
  action_type text not null check (
    action_type in (
      'send_notification', 'create_task', 'assign_user', 'request_approval',
      'update_status', 'generate_document', 'escalate_issue', 'trigger_workflow'
    )
  ),
  label text not null default ''
);

create index if not exists platform_playbook_steps_playbook_idx
  on public.platform_playbook_steps (playbook_id, step_order);

create table if not exists public.platform_playbook_executions (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid not null references public.platform_playbooks (id) on delete cascade,
  trigger_event text not null default '',
  outcome text not null default 'successful' check (
    outcome in ('successful', 'partially_successful', 'failed', 'cancelled')
  ),
  duration_seconds integer not null default 0,
  owner text not null default '',
  manual_intervention boolean not null default false,
  approval_status text check (approval_status in ('pending', 'granted', 'rejected')),
  executed_at timestamptz not null default now()
);

create index if not exists platform_playbook_executions_playbook_idx
  on public.platform_playbook_executions (playbook_id, executed_at desc);

create index if not exists platform_playbook_executions_outcome_idx
  on public.platform_playbook_executions (outcome, executed_at desc);

create table if not exists public.platform_playbook_audit_logs (
  id uuid primary key default gen_random_uuid(),
  playbook_id uuid references public.platform_playbooks (id) on delete set null,
  event_type text not null check (
    event_type in (
      'playbook_created', 'playbook_updated', 'playbook_executed',
      'approval_granted', 'approval_rejected', 'automation_disabled'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists platform_playbook_audit_created_idx
  on public.platform_playbook_audit_logs (created_at desc);

alter table public.platform_playbooks enable row level security;
alter table public.platform_playbook_steps enable row level security;
alter table public.platform_playbook_executions enable row level security;
alter table public.platform_playbook_audit_logs enable row level security;

revoke all on public.platform_playbooks from authenticated, anon;
revoke all on public.platform_playbook_steps from authenticated, anon;
revoke all on public.platform_playbook_executions from authenticated, anon;
revoke all on public.platform_playbook_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._pbe281_require_platform_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;
end;
$$;

create or replace function public._pbe281_log_audit(
  p_playbook_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.platform_playbook_audit_logs (playbook_id, event_type, summary, context)
  values (p_playbook_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end;
$$;

create or replace function public._pbe281_build_playbook_row(p_playbook public.platform_playbooks)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_steps jsonb;
begin
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id,
    'step_order', s.step_order,
    'action_type', s.action_type,
    'label', s.label
  ) order by s.step_order), '[]'::jsonb)
  into v_steps
  from public.platform_playbook_steps s
  where s.playbook_id = p_playbook.id;

  return jsonb_build_object(
    'id', p_playbook.id,
    'name', p_playbook.name,
    'category', p_playbook.category,
    'description', p_playbook.description,
    'owner', p_playbook.owner,
    'trigger_type', p_playbook.trigger_type,
    'status', p_playbook.status,
    'condition_summary', p_playbook.condition_summary,
    'requires_approval', p_playbook.requires_approval,
    'is_template', p_playbook.is_template,
    'last_executed_at', p_playbook.last_executed_at,
    'steps', v_steps,
    'created_at', p_playbook.created_at,
    'updated_at', p_playbook.updated_at
  );
end;
$$;

create or replace function public._pbe281_seed_if_empty()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pb_id uuid;
  v_exec_id uuid;
begin
  if exists (select 1 from public.platform_playbooks limit 1) then return; end if;

  -- Templates
  insert into public.platform_playbooks (
    name, category, description, owner, trigger_type, status, is_template, condition_summary, requires_approval
  ) values
    ('Customer Onboarding Starter', 'customer_onboarding', 'Standard onboarding sequence for new tenants.', 'Success Ops', 'event_based', 'active', true, 'New customer account created', false),
    ('Renewal Management', 'customer_success', 'Proactive renewal outreach and executive review.', 'Customer Success', 'conditional', 'active', true, 'Enterprise renewal approaching within 45 days', true),
    ('Incident Escalation', 'incident_response', 'Escalate critical incidents to platform leadership.', 'Platform Ops', 'event_based', 'active', true, 'Critical support ticket or security alert generated', true),
    ('Enterprise Procurement', 'executive_workflows', 'Enterprise deal desk and procurement workflow.', 'Executive Team', 'manual', 'active', true, 'Enterprise expansion opportunity identified', true),
    ('Customer Recovery', 'customer_success', 'Recovery playbook for at-risk accounts.', 'Success Ops', 'conditional', 'active', true, 'Customer health score below threshold', false);

  select id into v_pb_id from public.platform_playbooks where name = 'Customer Onboarding Starter';

  insert into public.platform_playbook_steps (playbook_id, step_order, action_type, label)
  select p.id, s.step_order, s.action_type, s.label
  from public.platform_playbooks p
  cross join (values
    (1, 'send_notification', 'Welcome notification to customer owner'),
    (2, 'create_task', 'Schedule onboarding kickoff'),
    (3, 'assign_user', 'Assign customer success manager'),
    (4, 'update_status', 'Mark onboarding in progress')
  ) as s(step_order, action_type, label)
  where p.name = 'Customer Onboarding Starter';

  insert into public.platform_playbook_steps (playbook_id, step_order, action_type, label)
  select p.id, s.step_order, s.action_type, s.label
  from public.platform_playbooks p
  cross join (values
    (1, 'request_approval', 'Executive approval for renewal terms'),
    (2, 'send_notification', 'Notify account owner of renewal window'),
    (3, 'create_task', 'Schedule executive review'),
    (4, 'generate_document', 'Generate renewal proposal')
  ) as s(step_order, action_type, label)
  where p.name = 'Renewal Management';

  -- Active playbooks
  insert into public.platform_playbooks (
    name, category, description, owner, trigger_type, status, condition_summary, requires_approval, last_executed_at
  ) values
    (
      'Trial Expiration Outreach', 'customer_success', 'Automated outreach when trial nears expiration.',
      'Growth Team', 'conditional', 'active', 'Trial nearing expiration within 7 days', false,
      now() - interval '2 hours'
    ),
    (
      'Failed Payment Recovery', 'billing_operations', 'Grace period and recovery sequence for failed payments.',
      'Finance Ops', 'event_based', 'active', 'Failed payment detected', true,
      now() - interval '1 day'
    ),
    (
      'Security Alert Response', 'security_procedures', 'Respond to platform security alerts.',
      'Security Team', 'event_based', 'active', 'Security alert generated', true,
      now() - interval '6 hours'
    ),
    (
      'Support Ticket Triage', 'support_operations', 'Auto-triage and assign recurring support patterns.',
      'Support Ops', 'event_based', 'paused', 'Critical support ticket created', false,
      now() - interval '3 days'
    ),
    (
      'Employee Onboarding Checklist', 'employee_onboarding', 'Internal Aipify employee onboarding steps.',
      'People Ops', 'manual', 'draft', '', false, null
    );

  insert into public.platform_playbook_executions (playbook_id, trigger_event, outcome, duration_seconds, owner, manual_intervention, approval_status)
  select p.id, e.trigger_event, e.outcome, e.duration_seconds, e.owner, e.manual_intervention, e.approval_status
  from public.platform_playbooks p
  join (values
    ('Trial Expiration Outreach', 'Trial expires in 5 days — Unonight', 'successful', 45, 'Growth Team', false, null),
    ('Failed Payment Recovery', 'Payment failed — NordTech AS', 'partially_successful', 120, 'Finance Ops', true, 'granted'),
    ('Security Alert Response', 'Unusual admin login pattern detected', 'successful', 90, 'Security Team', false, 'granted'),
    ('Support Ticket Triage', 'Critical ticket — webhook retry failures', 'failed', 30, 'Support Ops', true, null),
    ('Trial Expiration Outreach', 'Trial expires in 3 days — PilotCo', 'successful', 38, 'Growth Team', false, null)
  ) as e(playbook_name, trigger_event, outcome, duration_seconds, owner, manual_intervention, approval_status)
  on p.name = e.playbook_name;

  insert into public.platform_playbook_audit_logs (event_type, summary)
  values
    ('playbook_created', 'Playbook Center initialized with templates and seed playbooks.'),
    ('playbook_executed', 'Automation & Playbook Engine ready.');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Main RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_playbook_center(p_filters jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_overview jsonb;
  v_playbooks jsonb;
  v_templates jsonb;
  v_executions jsonb;
  v_audit jsonb;
  v_category_filter text;
  v_status_filter text;
  v_trigger_filter text;
  v_owner_filter text;
  v_outcome_filter text;
begin
  perform public._pbe281_require_platform_admin();
  perform public._pbe281_seed_if_empty();

  v_category_filter := nullif(p_filters->>'category', '');
  v_status_filter := nullif(p_filters->>'status', '');
  v_trigger_filter := nullif(p_filters->>'trigger_type', '');
  v_owner_filter := nullif(p_filters->>'owner', '');
  v_outcome_filter := nullif(p_filters->>'outcome', '');

  v_overview := jsonb_build_object(
    'active_playbooks', (select count(*)::int from public.platform_playbooks where status = 'active' and is_template = false),
    'automations_running', (select count(*)::int from public.platform_playbooks where status = 'active' and trigger_type <> 'manual'),
    'failed_executions', (select count(*)::int from public.platform_playbook_executions where outcome = 'failed'),
    'manual_interventions', (select count(*)::int from public.platform_playbook_executions where manual_intervention = true),
    'scheduled_workflows', (select count(*)::int from public.platform_playbooks where status = 'active' and trigger_type = 'scheduled'),
    'most_used_playbooks', (
      select count(*)::int from (
        select playbook_id from public.platform_playbook_executions
        group by playbook_id having count(*) >= 2
      ) mu
    )
  );

  select coalesce(jsonb_agg(public._pbe281_build_playbook_row(p) order by p.updated_at desc), '[]'::jsonb)
  into v_playbooks
  from public.platform_playbooks p
  where p.is_template = false
    and (v_category_filter is null or p.category = v_category_filter)
    and (v_status_filter is null or p.status = v_status_filter)
    and (v_trigger_filter is null or p.trigger_type = v_trigger_filter)
    and (v_owner_filter is null or p.owner ilike '%' || v_owner_filter || '%');

  select coalesce(jsonb_agg(public._pbe281_build_playbook_row(p) order by p.name), '[]'::jsonb)
  into v_templates
  from public.platform_playbooks p
  where p.is_template = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id,
    'playbook_id', e.playbook_id,
    'playbook_name', p.name,
    'trigger_event', e.trigger_event,
    'outcome', e.outcome,
    'duration_seconds', e.duration_seconds,
    'owner', e.owner,
    'manual_intervention', e.manual_intervention,
    'approval_status', e.approval_status,
    'executed_at', e.executed_at
  ) order by e.executed_at desc), '[]'::jsonb)
  into v_executions
  from public.platform_playbook_executions e
  join public.platform_playbooks p on p.id = e.playbook_id
  where (v_outcome_filter is null or e.outcome = v_outcome_filter);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'playbook_id', l.playbook_id,
    'event_type', l.event_type,
    'summary', l.summary,
    'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.platform_playbook_audit_logs order by created_at desc limit 40) l;

  return jsonb_build_object(
    'principle', 'The best organizations do not rely solely on memory. They build repeatable systems that help people perform consistently and confidently.',
    'filters', coalesce(p_filters, '{}'::jsonb),
    'overview', v_overview,
    'playbooks', v_playbooks,
    'templates', v_templates,
    'executions', v_executions,
    'audit', v_audit
  );
end;
$$;

create or replace function public.record_platform_playbook_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_id uuid;
  v_playbook_id uuid;
  v_template_id uuid;
begin
  perform public._pbe281_require_platform_admin();

  v_action := p_payload->>'action';
  v_id := (p_payload->>'id')::uuid;
  v_playbook_id := coalesce((p_payload->>'playbook_id')::uuid, v_id);
  v_template_id := (p_payload->>'template_id')::uuid;

  case v_action
    when 'create_playbook' then
      insert into public.platform_playbooks (
        name, category, description, owner, trigger_type, status, condition_summary, requires_approval
      ) values (
        coalesce(p_payload->>'name', 'New playbook'),
        coalesce(p_payload->>'category', 'support_operations'),
        coalesce(p_payload->>'description', ''),
        coalesce(p_payload->>'owner', ''),
        coalesce(p_payload->>'trigger_type', 'manual'),
        'draft',
        coalesce(p_payload->>'condition_summary', ''),
        coalesce((p_payload->>'requires_approval')::boolean, false)
      )
      returning id into v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_created', 'Playbook created.', p_payload);

    when 'create_from_template' then
      insert into public.platform_playbooks (
        name, category, description, owner, trigger_type, status, condition_summary, requires_approval
      )
      select
        coalesce(p_payload->>'name', t.name || ' (copy)'),
        t.category,
        t.description,
        coalesce(p_payload->>'owner', t.owner),
        t.trigger_type,
        'draft',
        t.condition_summary,
        t.requires_approval
      from public.platform_playbooks t
      where t.id = v_template_id
      returning id into v_playbook_id;

      insert into public.platform_playbook_steps (playbook_id, step_order, action_type, label)
      select v_playbook_id, s.step_order, s.action_type, s.label
      from public.platform_playbook_steps s
      where s.playbook_id = v_template_id;

      perform public._pbe281_log_audit(v_playbook_id, 'playbook_created', 'Playbook created from template.', p_payload);

    when 'update_status' then
      update public.platform_playbooks set
        status = coalesce(p_payload->>'status', status),
        updated_at = now()
      where id = v_playbook_id;
      perform public._pbe281_log_audit(
        v_playbook_id, 'playbook_updated',
        coalesce(p_payload->>'summary', format('Playbook status updated to %s.', coalesce(p_payload->>'status', ''))),
        p_payload
      );

    when 'disable_automation' then
      update public.platform_playbooks set status = 'paused', updated_at = now() where id = v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'automation_disabled', 'Automation disabled (paused).', p_payload);

    when 'execute_playbook' then
      insert into public.platform_playbook_executions (
        playbook_id, trigger_event, outcome, duration_seconds, owner,
        manual_intervention, approval_status
      ) values (
        v_playbook_id,
        coalesce(p_payload->>'trigger_event', 'Manual execution'),
        coalesce(p_payload->>'outcome', 'successful'),
        coalesce((p_payload->>'duration_seconds')::integer, 60),
        coalesce(p_payload->>'owner', ''),
        coalesce((p_payload->>'manual_intervention')::boolean, false),
        case when (select requires_approval from public.platform_playbooks where id = v_playbook_id)
          then 'pending' else null end
      )
      returning id into v_id;

      update public.platform_playbooks set last_executed_at = now(), updated_at = now() where id = v_playbook_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', coalesce(p_payload->>'summary', 'Playbook executed.'), p_payload);

    when 'retry_execution' then
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      insert into public.platform_playbook_executions (
        playbook_id, trigger_event, outcome, duration_seconds, owner, manual_intervention
      )
      select
        playbook_id,
        'Retry: ' || trigger_event,
        'successful',
        duration_seconds,
        owner,
        false
      from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', 'Execution retried.', p_payload);

    when 'escalate_execution' then
      update public.platform_playbook_executions set manual_intervention = true where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'playbook_executed', 'Execution escalated for review.', p_payload);

    when 'grant_approval' then
      update public.platform_playbook_executions set approval_status = 'granted' where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'approval_granted', coalesce(p_payload->>'summary', 'Approval granted.'), p_payload);

    when 'reject_approval' then
      update public.platform_playbook_executions set approval_status = 'rejected', outcome = 'cancelled' where id = v_id;
      select playbook_id into v_playbook_id from public.platform_playbook_executions where id = v_id;
      perform public._pbe281_log_audit(v_playbook_id, 'approval_rejected', coalesce(p_payload->>'summary', 'Approval rejected.'), p_payload);

    else
      raise exception 'Invalid action';
  end case;

  return public.get_platform_playbook_center(coalesce(p_payload->'filters', '{}'::jsonb));
end;
$$;

grant execute on function public.get_platform_playbook_center(jsonb) to authenticated;
grant execute on function public.record_platform_playbook_action(jsonb) to authenticated;
