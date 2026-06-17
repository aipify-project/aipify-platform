-- Phase 346 — Companion Action Approval & Execution Framework
-- Feature owner: CUSTOMER APP. Route: /app/companion/actions. Helpers: _caae346_*
-- Distinct from Phase 30 action_requests — companion-scoped governance layer.

create table if not exists public.companion_action_execution_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  execution_enabled boolean not null default true,
  emergency_stop_active boolean not null default false,
  automation_disabled boolean not null default false,
  daily_action_limit integer not null default 100,
  max_risk_level text not null default 'high' check (
    max_risk_level in ('low', 'medium', 'high', 'critical')
  ),
  business_hours_only boolean not null default false,
  approval_threshold text not null default 'medium' check (
    approval_threshold in ('low', 'medium', 'high', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id)
);
alter table public.companion_action_execution_settings enable row level security;
revoke all on public.companion_action_execution_settings from authenticated, anon;

create table if not exists public.companion_action_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  policy_label text not null default '',
  category text not null default 'companion_actions' check (
    category in (
      'documents', 'communication', 'scheduling', 'reporting', 'knowledge',
      'integrations', 'commerce', 'operations', 'external_services', 'companion_actions'
    )
  ),
  allowed boolean not null default true,
  requires_approval boolean not null default true,
  prohibited boolean not null default false,
  auto_approve_low_risk boolean not null default false,
  workflow_type text not null default 'single' check (
    workflow_type in ('single', 'manager', 'multi_step', 'department', 'executive', 'custom')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);
alter table public.companion_action_policies enable row level security;
revoke all on public.companion_action_policies from authenticated, anon;

create table if not exists public.companion_action_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null default '',
  title text not null default '',
  description text not null default '',
  reason text not null default '',
  requested_by uuid,
  requested_for text not null default '',
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  category text not null default 'companion_actions',
  required_permission text not null default '',
  expected_outcome text not null default '',
  lifecycle_status text not null default 'proposed' check (
    lifecycle_status in (
      'draft', 'proposed', 'awaiting_approval', 'approved', 'rejected',
      'executing', 'completed', 'failed', 'cancelled', 'expired'
    )
  ),
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected', 'changes_requested', 'expired')
  ),
  execution_status text not null default 'none' check (
    execution_status in ('none', 'queued', 'preparing', 'executing', 'completed', 'failed', 'cancelled', 'retrying')
  ),
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists companion_action_requests_org_idx
  on public.companion_action_requests (organization_id, lifecycle_status, risk_level, created_at desc);
alter table public.companion_action_requests enable row level security;
revoke all on public.companion_action_requests from authenticated, anon;

create table if not exists public.companion_action_queue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_request_id uuid not null references public.companion_action_requests (id) on delete cascade,
  queue_status text not null default 'queued' check (
    queue_status in ('queued', 'preparing', 'executing', 'completed', 'failed', 'cancelled', 'retrying')
  ),
  queued_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (action_request_id)
);
alter table public.companion_action_queue enable row level security;
revoke all on public.companion_action_queue from authenticated, anon;

create table if not exists public.companion_action_receipts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_request_id uuid not null references public.companion_action_requests (id) on delete cascade,
  result_summary text not null default '',
  duration_ms integer not null default 0,
  approver_id uuid,
  system_version text not null default '1.0.0',
  audit_reference text not null default '',
  created_at timestamptz not null default now(),
  unique (action_request_id)
);
alter table public.companion_action_receipts enable row level security;
revoke all on public.companion_action_receipts from authenticated, anon;

create table if not exists public.companion_action_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid,
  event_type text not null,
  summary text not null default '',
  action_request_id uuid references public.companion_action_requests (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_action_audit_org_idx
  on public.companion_action_audit_logs (organization_id, created_at desc);
alter table public.companion_action_audit_logs enable row level security;
revoke all on public.companion_action_audit_logs from authenticated, anon;

create or replace function public._caae346bp_positioning() returns text language sql immutable as $$
  select 'Aipify asks. You approve. Aipify executes. Everything is logged, traceable, and reversible when possible.'; $$;

create or replace function public._caae346_require_org()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'User context required'; end if;
  return jsonb_build_object('organization_id', v_org_id, 'auth_user_id', v_user_id);
end; $$;

create or replace function public._caae346_log_audit(
  p_org_id uuid, p_user_id uuid, p_event text, p_summary text,
  p_action_id uuid default null, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_action_audit_logs (
    organization_id, auth_user_id, event_type, summary, action_request_id, metadata
  ) values (
    p_org_id, p_user_id, p_event, left(p_summary, 500), p_action_id, coalesce(p_meta, '{}'::jsonb)
  );
end; $$;

create or replace function public._caae346_ensure_settings(p_org_id uuid)
returns public.companion_action_execution_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_action_execution_settings;
begin
  insert into public.companion_action_execution_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
  select * into v_row from public.companion_action_execution_settings where organization_id = p_org_id;
  return v_row;
end; $$;

create or replace function public._caae346_seed_demo(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.companion_action_requests where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.companion_action_policies (
    organization_id, policy_key, policy_label, category, allowed, requires_approval, prohibited, auto_approve_low_risk, workflow_type
  ) values
    (p_org_id, 'send_email', 'Send email', 'communication', true, true, false, false, 'manager'),
    (p_org_id, 'create_meeting', 'Create meetings', 'scheduling', true, true, false, false, 'single'),
    (p_org_id, 'generate_report', 'Generate reports', 'reporting', true, false, false, true, 'single'),
    (p_org_id, 'export_pdf', 'Export PDF', 'documents', true, false, false, true, 'single'),
    (p_org_id, 'approve_payment', 'Approve payments', 'commerce', false, true, true, false, 'executive'),
    (p_org_id, 'delete_users', 'Delete users', 'operations', false, true, true, false, 'executive'),
    (p_org_id, 'change_permissions', 'Change permissions', 'operations', false, true, true, false, 'executive')
  on conflict (organization_id, policy_key) do nothing;

  insert into public.companion_action_requests (
    organization_id, action_key, title, description, reason, requested_by, requested_for,
    risk_level, category, required_permission, expected_outcome, lifecycle_status, approval_status, execution_status, expires_at
  ) values
    (p_org_id, 'draft_invoice', 'Create draft invoice', 'A draft invoice is ready for review.',
     'Invoice preparation requested from Companion', p_user_id, 'Finance team', 'medium', 'commerce',
     'commerce.invoice.create', 'Draft invoice created in billing module', 'awaiting_approval', 'pending', 'none', now() + interval '7 days'),
    (p_org_id, 'send_email', 'Send prepared email response', 'An email response has been prepared.',
     'Support reply drafted by Aipify', p_user_id, 'Customer support', 'medium', 'communication',
     'communication.email.send', 'Email sent to customer after approval', 'awaiting_approval', 'pending', 'none', now() + interval '3 days'),
    (p_org_id, 'calendar_invite', 'Send meeting invitation', 'A meeting invitation is ready.',
     'Scheduling assistance', p_user_id, 'Executive calendar', 'low', 'scheduling',
     'scheduling.event.create', 'Calendar invite delivered', 'awaiting_approval', 'pending', 'none', now() + interval '2 days'),
    (p_org_id, 'export_report', 'Export report as PDF', 'A report has been generated.',
     'Weekly operations summary', p_user_id, 'Operations', 'low', 'reporting',
     'reporting.export.pdf', 'PDF exported to downloads', 'approved', 'approved', 'queued', now() + interval '1 day'),
    (p_org_id, 'crm_update', 'Update CRM record', 'Modify internal CRM contact record.',
     'Contact details sync', p_user_id, 'Sales', 'medium', 'integrations',
     'integrations.crm.update', 'CRM record updated', 'completed', 'approved', 'completed', now() - interval '1 day');

  insert into public.companion_action_queue (organization_id, action_request_id, queue_status, queued_at)
  select p_org_id, r.id, 'queued', now()
  from public.companion_action_requests r
  where r.organization_id = p_org_id and r.execution_status = 'queued'
  on conflict (action_request_id) do nothing;

  insert into public.companion_action_receipts (
    organization_id, action_request_id, result_summary, duration_ms, approver_id, audit_reference
  )
  select p_org_id, r.id, 'Action completed successfully.', 1240, p_user_id, 'AUD-' || left(r.id::text, 8)
  from public.companion_action_requests r
  where r.organization_id = p_org_id and r.lifecycle_status = 'completed'
  on conflict (action_request_id) do nothing;
end; $$;

create or replace function public.get_companion_action_center()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._caae346_require_org();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_action_execution_settings;
begin
  v_settings := public._caae346_ensure_settings(v_org_id);
  perform public._caae346_seed_demo(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_access', true,
    'positioning', public._caae346bp_positioning(),
    'execution_enabled', v_settings.execution_enabled,
    'emergency_stop_active', v_settings.emergency_stop_active,
    'automation_disabled', v_settings.automation_disabled,
    'limits', jsonb_build_object(
      'daily_action_limit', v_settings.daily_action_limit,
      'max_risk_level', v_settings.max_risk_level,
      'business_hours_only', v_settings.business_hours_only,
      'approval_threshold', v_settings.approval_threshold
    ),
    'pending_actions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'title', r.title, 'description', r.description, 'reason', r.reason,
        'risk_level', r.risk_level, 'category', r.category, 'requested_for', r.requested_for,
        'approval_status', r.approval_status, 'lifecycle_status', r.lifecycle_status,
        'expires_at', r.expires_at::text, 'expected_outcome', r.expected_outcome
      ) order by r.created_at desc)
      from public.companion_action_requests r
      where r.organization_id = v_org_id and r.approval_status = 'pending'
    ), '[]'::jsonb),
    'execution_queue', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id, 'action_request_id', q.action_request_id, 'queue_status', q.queue_status,
        'title', r.title, 'queued_at', q.queued_at::text
      ) order by q.queued_at)
      from public.companion_action_queue q
      join public.companion_action_requests r on r.id = q.action_request_id
      where q.organization_id = v_org_id and q.queue_status in ('queued', 'preparing', 'executing', 'retrying')
    ), '[]'::jsonb),
    'action_history', coalesce((
      select jsonb_agg(h.row order by h.created_at desc)
      from (
        select r.created_at, jsonb_build_object(
          'id', r.id, 'title', r.title, 'risk_level', r.risk_level, 'category', r.category,
          'lifecycle_status', r.lifecycle_status, 'execution_status', r.execution_status,
          'created_at', r.created_at::text
        ) as row
        from public.companion_action_requests r
        where r.organization_id = v_org_id
        order by r.created_at desc
        limit 25
      ) h
    ), '[]'::jsonb),
    'policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'policy_label', p.policy_label,
        'category', p.category, 'allowed', p.allowed, 'requires_approval', p.requires_approval,
        'prohibited', p.prohibited, 'auto_approve_low_risk', p.auto_approve_low_risk,
        'workflow_type', p.workflow_type
      ) order by p.policy_key)
      from public.companion_action_policies p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'safety_center', jsonb_build_object(
      'blocked_actions', coalesce((
        select jsonb_agg(jsonb_build_object('title', r.title, 'reason', 'Policy prohibited'))
        from public.companion_action_requests r
        join public.companion_action_policies p on p.organization_id = r.organization_id and p.policy_key = r.action_key
        where r.organization_id = v_org_id and p.prohibited = true limit 5
      ), '[]'::jsonb),
      'failed_actions', coalesce((
        select jsonb_agg(jsonb_build_object('id', r.id, 'title', r.title))
        from public.companion_action_requests r
        where r.organization_id = v_org_id and r.lifecycle_status = 'failed' limit 5
      ), '[]'::jsonb),
      'risk_alerts', coalesce((
        select jsonb_agg(jsonb_build_object('title', r.title, 'risk_level', r.risk_level))
        from public.companion_action_requests r
        where r.organization_id = v_org_id and r.risk_level in ('high', 'critical') and r.approval_status = 'pending' limit 5
      ), '[]'::jsonb)
    ),
    'receipts', coalesce((
      select jsonb_agg(s.row order by s.created_at desc)
      from (
        select rc.created_at, jsonb_build_object(
          'id', rc.id, 'action_request_id', rc.action_request_id, 'result_summary', rc.result_summary,
          'duration_ms', rc.duration_ms, 'audit_reference', rc.audit_reference, 'created_at', rc.created_at::text,
          'title', r.title
        ) as row
        from public.companion_action_receipts rc
        join public.companion_action_requests r on r.id = rc.action_request_id
        where rc.organization_id = v_org_id
        order by rc.created_at desc
        limit 10
      ) s
    ), '[]'::jsonb),
    'audit_logs', coalesce((
      select jsonb_agg(s.row order by s.created_at desc)
      from (
        select a.created_at, jsonb_build_object(
          'id', a.id, 'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at::text
        ) as row
        from public.companion_action_audit_logs a
        where a.organization_id = v_org_id
        order by a.created_at desc
        limit 20
      ) s
    ), '[]'::jsonb),
    'cross_link_trust_approvals', '/app/approvals',
    'confirmation_examples', jsonb_build_array(
      'A draft invoice is ready. Would you like me to create it?',
      'An email response has been prepared. Approve before sending?',
      'A meeting invitation is ready. Send now?',
      'A report has been generated. Export as PDF?'
    )
  );
end; $$;

create or replace function public.process_companion_action_request(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._caae346_require_org();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_action text := coalesce(p_payload->>'action', '');
  v_id uuid := (p_payload->>'action_id')::uuid;
  v_settings public.companion_action_execution_settings;
  v_req public.companion_action_requests;
begin
  v_settings := public._caae346_ensure_settings(v_org_id);

  if v_action = 'emergency_stop' then
    update public.companion_action_execution_settings set
      emergency_stop_active = true, automation_disabled = true, execution_enabled = false, updated_at = now()
    where organization_id = v_org_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'emergency_stop', 'Emergency stop activated', null, p_payload);
    return public.get_companion_action_center();
  end if;

  if v_settings.emergency_stop_active then
    raise exception 'Companion action execution is paused (emergency stop active)';
  end if;

  if v_id is null then raise exception 'action_id required'; end if;

  select * into v_req from public.companion_action_requests
  where id = v_id and organization_id = v_org_id;
  if not found then raise exception 'Action not found'; end if;

  if v_action = 'approve' then
    update public.companion_action_requests set
      approval_status = 'approved', lifecycle_status = 'approved', execution_status = 'queued', updated_at = now()
    where id = v_id;
    insert into public.companion_action_queue (organization_id, action_request_id, queue_status)
    values (v_org_id, v_id, 'queued')
    on conflict (action_request_id) do update set queue_status = 'queued', queued_at = now();
    perform public._caae346_log_audit(v_org_id, v_user_id, 'approval_granted', 'Action approved: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'reject' then
    update public.companion_action_requests set
      approval_status = 'rejected', lifecycle_status = 'rejected', execution_status = 'cancelled', updated_at = now()
    where id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'approval_rejected', 'Action rejected: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'request_changes' then
    update public.companion_action_requests set
      approval_status = 'changes_requested', lifecycle_status = 'proposed', updated_at = now()
    where id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'changes_requested', 'Changes requested: ' || v_req.title, v_id, p_payload);

  elsif v_action = 'execute' and v_req.approval_status = 'approved' then
    update public.companion_action_requests set lifecycle_status = 'executing', execution_status = 'executing', updated_at = now()
    where id = v_id;
    update public.companion_action_queue set queue_status = 'executing', started_at = now() where action_request_id = v_id;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'execution_started', 'Execution started: ' || v_req.title, v_id, p_payload);

    update public.companion_action_requests set lifecycle_status = 'completed', execution_status = 'completed', updated_at = now()
    where id = v_id;
    update public.companion_action_queue set queue_status = 'completed', completed_at = now() where action_request_id = v_id;
    insert into public.companion_action_receipts (
      organization_id, action_request_id, result_summary, duration_ms, approver_id, audit_reference
    ) values (
      v_org_id, v_id, coalesce(p_payload->>'result_summary', 'Action completed successfully.'), 850, v_user_id,
      'AUD-' || left(v_id::text, 8)
    ) on conflict (action_request_id) do nothing;
    perform public._caae346_log_audit(v_org_id, v_user_id, 'execution_completed', 'Execution completed: ' || v_req.title, v_id, p_payload);

  else
    raise exception 'Unsupported action or action not approved for execution';
  end if;

  return public.get_companion_action_center();
end; $$;

grant execute on function public.get_companion_action_center() to authenticated;
grant execute on function public.process_companion_action_request(jsonb) to authenticated;
