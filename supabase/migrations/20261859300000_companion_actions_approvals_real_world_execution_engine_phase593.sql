-- Phase 593 — Aipify Companion Actions, Approvals & Real-World Execution Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/actions/*
-- Helpers: _care593_*

create table if not exists public.organization_care593_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  action_center_enabled boolean not null default true,
  governance_engine_enabled boolean not null default true,
  approval_matrix_enabled boolean not null default true,
  safety_engine_enabled boolean not null default true,
  confirmation_required boolean not null default true,
  mobile_access_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_care593_settings enable row level security;
revoke all on public.organization_care593_settings from authenticated, anon;

create table if not exists public.organization_care593_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_type text not null check (
    action_type in (
      'send_email', 'create_invoice', 'book_meeting', 'support_ticket', 'update_inventory',
      'generate_contract', 'order_service', 'schedule_appointment', 'real_world', 'custom'
    )
  ),
  owner_label text not null default '',
  requester_label text not null default '',
  approver_label text not null default '',
  action_status text not null default 'pending' check (
    action_status in ('pending', 'approved', 'completed', 'rejected', 'failed')
  ),
  risk_level text not null default 'medium' check (
    risk_level in ('low', 'medium', 'high', 'critical')
  ),
  business_pack text,
  outcome_summary text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_care593_actions enable row level security;
revoke all on public.organization_care593_actions from authenticated, anon;

create table if not exists public.organization_care593_approval_matrix (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  matrix_key text not null,
  risk_level text not null check (risk_level in ('low', 'medium', 'high', 'critical')),
  approval_path text not null,
  execution_rule text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, matrix_key)
);

alter table public.organization_care593_approval_matrix enable row level security;
revoke all on public.organization_care593_approval_matrix from authenticated, anon;

create table if not exists public.organization_care593_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  permission_key text not null,
  permission_title text not null,
  can_request boolean not null default true,
  can_approve boolean not null default false,
  can_execute boolean not null default false,
  integrations_allowed jsonb not null default '[]'::jsonb,
  business_packs_allowed jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, permission_key)
);

alter table public.organization_care593_permissions enable row level security;
revoke all on public.organization_care593_permissions from authenticated, anon;

create table if not exists public.organization_care593_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  template_title text not null,
  template_type text not null default 'operational',
  risk_level text not null default 'medium',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, template_key)
);

alter table public.organization_care593_templates enable row level security;
revoke all on public.organization_care593_templates from authenticated, anon;

create table if not exists public.organization_care593_real_world (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_category text not null default 'service',
  governance_level text not null default 'approval_required',
  framework_status text not null default 'future',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_care593_real_world enable row level security;
revoke all on public.organization_care593_real_world from authenticated, anon;

create table if not exists public.organization_care593_safety_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rule_key text not null,
  rule_title text not null,
  rule_type text not null check (
    rule_type in ('unauthorized', 'duplicate', 'high_risk', 'invalid', 'expired_permission')
  ),
  rule_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, rule_key)
);

alter table public.organization_care593_safety_rules enable row level security;
revoke all on public.organization_care593_safety_rules from authenticated, anon;

create table if not exists public.organization_care593_confirmations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  confirmation_key text not null,
  action_title text not null,
  impact_summary text not null default '',
  cost_summary text not null default '',
  approvals_summary text not null default '',
  external_systems text not null default '',
  expected_outcome text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, confirmation_key)
);

alter table public.organization_care593_confirmations enable row level security;
revoke all on public.organization_care593_confirmations from authenticated, anon;

create table if not exists public.organization_care593_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  actions_count integer not null default 0,
  approvals_count integer not null default 0,
  templates_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_care593_business_packs enable row level security;
revoke all on public.organization_care593_business_packs from authenticated, anon;

create table if not exists public.organization_care593_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'companion_actions',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_care593_audit_logs enable row level security;
revoke all on public.organization_care593_audit_logs from authenticated, anon;

create or replace function public._care593_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._care593_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'companion_actions'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_care593_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'companion_actions'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._care593_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_care593_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._care593_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._care593_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_care593_actions where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_care593_actions (
    organization_id, action_key, action_title, action_type, owner_label, requester_label, approver_label,
    action_status, risk_level, business_pack, outcome_summary, summary
  ) values
    (p_org_id, 'act_email', 'Send Email — Customer Follow-Up', 'send_email', 'Support Lead', 'Companion', 'Manager', 'pending', 'medium', 'support', '', 'Draft email awaiting approval.'),
    (p_org_id, 'act_invoice', 'Create Invoice — Acme Renewal', 'create_invoice', 'Finance', 'Companion', 'Finance Admin', 'approved', 'high', 'finance', '', 'Invoice approved — ready for execution.'),
    (p_org_id, 'act_meeting', 'Book Meeting — Executive Review', 'book_meeting', 'Executive', 'User', 'Self', 'completed', 'low', null, 'Meeting scheduled.', 'Completed successfully.'),
    (p_org_id, 'act_ticket', 'Create Support Ticket — Escalation', 'support_ticket', 'Support', 'Companion', 'Support Manager', 'pending', 'medium', 'support', '', 'Support ticket queued.'),
    (p_org_id, 'act_inventory', 'Update Inventory — SKU-4421', 'update_inventory', 'Operations', 'Companion', 'Warehouse Admin', 'approved', 'medium', 'commerce', '', 'Inventory update approved.'),
    (p_org_id, 'act_contract', 'Generate Contract — Enterprise', 'generate_contract', 'Legal', 'Companion', 'Legal + Admin', 'pending', 'critical', null, '', 'Multi-level approval required.'),
    (p_org_id, 'act_service', 'Order Service — Vendor Maintenance', 'order_service', 'Procurement', 'User', 'Procurement Lead', 'failed', 'high', null, 'Vendor API timeout.', 'Execution failed — safe retry available.');

  insert into public.organization_care593_approval_matrix (
    organization_id, matrix_key, risk_level, approval_path, execution_rule, summary
  ) values
    (p_org_id, 'matrix_low', 'low', 'Immediate Execution', 'Auto-execute after validation', 'Low risk — immediate execution after safety checks.'),
    (p_org_id, 'matrix_medium', 'medium', 'Manager Approval', 'Execute after single approval', 'Medium risk — manager approval required.'),
    (p_org_id, 'matrix_high', 'high', 'Administrative Approval', 'Execute after admin sign-off', 'High risk — administrative approval required.'),
    (p_org_id, 'matrix_critical', 'critical', 'Multi-Level Approval', 'Never bypass governance', 'Critical risk — multi-level approval required.');

  insert into public.organization_care593_permissions (
    organization_id, permission_key, permission_title, can_request, can_approve, can_execute, integrations_allowed, business_packs_allowed, summary
  ) values
    (p_org_id, 'perm_staff', 'Staff', true, false, false, '["support","calendar"]'::jsonb, '["support"]'::jsonb, 'Can request low-risk actions.'),
    (p_org_id, 'perm_manager', 'Manager', true, true, false, '["support","finance","calendar"]'::jsonb, '["support","finance"]'::jsonb, 'Can request and approve medium-risk actions.'),
    (p_org_id, 'perm_admin', 'Administrator', true, true, true, '["all"]'::jsonb, '["all"]'::jsonb, 'Full request, approve, and execute permissions.');

  insert into public.organization_care593_templates (
    organization_id, template_key, template_title, template_type, risk_level, summary
  ) values
    (p_org_id, 'tpl_meeting', 'Meeting Booking', 'operational', 'low', 'Schedule internal or external meeting.'),
    (p_org_id, 'tpl_followup', 'Customer Follow-Up', 'customer', 'medium', 'Follow-up email or call template.'),
    (p_org_id, 'tpl_vendor', 'Vendor Request', 'procurement', 'high', 'Request vendor service or quote.'),
    (p_org_id, 'tpl_partner', 'Partner Outreach', 'growth', 'medium', 'Partner introduction template.'),
    (p_org_id, 'tpl_travel', 'Travel Request', 'executive', 'high', 'Travel booking request.'),
    (p_org_id, 'tpl_purchase', 'Purchase Approval', 'finance', 'high', 'Purchase order approval flow.'),
    (p_org_id, 'tpl_escalation', 'Support Escalation', 'support', 'medium', 'Escalate support case.');

  insert into public.organization_care593_real_world (
    organization_id, action_key, action_title, action_category, governance_level, framework_status, summary
  ) values
    (p_org_id, 'rw_taxi', 'Order Taxi', 'travel', 'approval_required', 'future', 'Real-world action framework — taxi booking.'),
    (p_org_id, 'rw_flowers', 'Order Flowers', 'service', 'approval_required', 'future', 'Real-world action framework — gift delivery.'),
    (p_org_id, 'rw_food', 'Order Food', 'service', 'approval_required', 'future', 'Real-world action framework — catering.'),
    (p_org_id, 'rw_hotel', 'Book Hotel', 'travel', 'high_governance', 'future', 'Real-world action framework — hotel booking.'),
    (p_org_id, 'rw_travel', 'Book Travel', 'travel', 'high_governance', 'future', 'Real-world action framework — travel.'),
    (p_org_id, 'rw_meeting_room', 'Reserve Meeting Room', 'operational', 'low', 'future', 'Real-world action framework — room booking.');

  insert into public.organization_care593_safety_rules (
    organization_id, rule_key, rule_title, rule_type, summary
  ) values
    (p_org_id, 'safe_unauth', 'Block Unauthorized Actions', 'unauthorized', 'Prevent actions without permission.'),
    (p_org_id, 'safe_dup', 'Prevent Duplicate Actions', 'duplicate', 'Detect and block duplicate requests.'),
    (p_org_id, 'safe_risk', 'High-Risk Mistake Prevention', 'high_risk', 'Extra validation for high-risk actions.'),
    (p_org_id, 'safe_invalid', 'Invalid Request Rejection', 'invalid', 'Reject malformed or out-of-scope requests.'),
    (p_org_id, 'safe_expired', 'Expired Permission Check', 'expired_permission', 'Block actions with expired grants.');

  insert into public.organization_care593_confirmations (
    organization_id, confirmation_key, action_title, impact_summary, cost_summary, approvals_summary, external_systems, expected_outcome, summary
  ) values (
    p_org_id, 'confirm_invoice', 'Create Invoice — Acme Renewal',
    'Creates invoice in Fiken for enterprise renewal.',
    'Estimated 45,000 NOK',
    'Finance Admin approval required',
    'Fiken · Stripe',
    'Invoice created and sent to customer billing contact.',
    'Transparency-first confirmation before execution.'
  );

  insert into public.organization_care593_business_packs (
    organization_id, pack_key, pack_title, actions_count, approvals_count, templates_count, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack', 12, 8, 3, 'Finance Pack → Invoice Actions.'),
    (p_org_id, 'support', 'Support Pack', 18, 10, 4, 'Support Pack → Support Actions.'),
    (p_org_id, 'hosts', 'Hosts Pack', 9, 5, 2, 'Hosts Pack → Property Actions.'),
    (p_org_id, 'commerce', 'Commerce Pack', 14, 7, 3, 'Commerce Pack → Product Actions.');

  perform public._care593_log(p_org_id, 'action_requested', 'Companion action center baseline seeded.');
end; $$;

create or replace function public.get_organization_companion_action_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
begin
  v_org_id := public._care593_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._care593_seed(v_org_id);

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Information creates awareness. Actions create outcomes.',
      'privacy_note', 'Action metadata only — governance, approval, and audit always come first.',
      'executive_dashboard', jsonb_build_object(
        'pending_approvals', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'pending'),
        'high_risk_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and risk_level in ('high', 'critical') and action_status in ('pending', 'approved')),
        'completed_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'completed'),
        'failed_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'failed'),
        'action_volume', (select count(*) from public.organization_care593_actions where organization_id = v_org_id)
      ),
      'stats', jsonb_build_object(
        'registry_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id),
        'pending', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'pending'),
        'approved', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'approved'),
        'completed', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'completed'),
        'templates', (select count(*) from public.organization_care593_templates where organization_id = v_org_id),
        'safety_rules', (select count(*) from public.organization_care593_safety_rules where organization_id = v_org_id and rule_status = 'active')
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'action_title', a.action_title, 'recommendation',
          case a.action_status
            when 'pending' then 'Review and approve pending action.'
            when 'failed' then 'Investigate failure and retry safely.'
            else 'Monitor action outcome.'
          end
        ) order by case a.risk_level when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end)
        from public.organization_care593_actions a
        where a.organization_id = v_org_id and a.action_status in ('pending', 'failed')
        limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Information creates awareness. Actions create outcomes.',
    'privacy_note', 'Action metadata only — governance always comes first.',
    'executive_dashboard', jsonb_build_object(
      'pending_approvals', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'pending'),
      'high_risk_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and risk_level in ('high', 'critical') and action_status in ('pending', 'approved')),
      'completed_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'completed'),
      'failed_actions', (select count(*) from public.organization_care593_actions where organization_id = v_org_id and action_status = 'failed'),
      'action_volume', (select count(*) from public.organization_care593_actions where organization_id = v_org_id)
    ),
    'registry', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', a.action_key, 'action_title', a.action_title, 'action_type', a.action_type,
      'owner_label', a.owner_label, 'requester_label', a.requester_label, 'approver_label', a.approver_label,
      'action_status', a.action_status, 'risk_level', a.risk_level, 'business_pack', a.business_pack,
      'outcome_summary', a.outcome_summary, 'summary', a.summary
    ) order by case a.action_status when 'pending' then 1 when 'approved' then 2 when 'failed' then 3 when 'completed' then 4 else 5 end)
    from public.organization_care593_actions a where a.organization_id = v_org_id), '[]'::jsonb),
    'approval_matrix', coalesce((select jsonb_agg(jsonb_build_object(
      'matrix_key', m.matrix_key, 'risk_level', m.risk_level, 'approval_path', m.approval_path,
      'execution_rule', m.execution_rule, 'summary', m.summary
    ) order by case m.risk_level when 'low' then 1 when 'medium' then 2 when 'high' then 3 else 4 end)
    from public.organization_care593_approval_matrix m where m.organization_id = v_org_id), '[]'::jsonb),
    'permissions', coalesce((select jsonb_agg(jsonb_build_object(
      'permission_key', p.permission_key, 'permission_title', p.permission_title,
      'can_request', p.can_request, 'can_approve', p.can_approve, 'can_execute', p.can_execute,
      'integrations_allowed', p.integrations_allowed, 'business_packs_allowed', p.business_packs_allowed, 'summary', p.summary
    ) order by p.permission_title) from public.organization_care593_permissions p where p.organization_id = v_org_id), '[]'::jsonb),
    'templates', coalesce((select jsonb_agg(jsonb_build_object(
      'template_key', t.template_key, 'template_title', t.template_title,
      'template_type', t.template_type, 'risk_level', t.risk_level, 'summary', t.summary
    ) order by t.template_title) from public.organization_care593_templates t where t.organization_id = v_org_id), '[]'::jsonb),
    'real_world', coalesce((select jsonb_agg(jsonb_build_object(
      'action_key', r.action_key, 'action_title', r.action_title, 'action_category', r.action_category,
      'governance_level', r.governance_level, 'framework_status', r.framework_status, 'summary', r.summary
    ) order by r.action_title) from public.organization_care593_real_world r where r.organization_id = v_org_id), '[]'::jsonb),
    'safety_rules', coalesce((select jsonb_agg(jsonb_build_object(
      'rule_key', s.rule_key, 'rule_title', s.rule_title, 'rule_type', s.rule_type,
      'rule_status', s.rule_status, 'summary', s.summary
    ) order by s.rule_title) from public.organization_care593_safety_rules s where s.organization_id = v_org_id), '[]'::jsonb),
    'confirmations', coalesce((select jsonb_agg(jsonb_build_object(
      'confirmation_key', c.confirmation_key, 'action_title', c.action_title,
      'impact_summary', c.impact_summary, 'cost_summary', c.cost_summary,
      'approvals_summary', c.approvals_summary, 'external_systems', c.external_systems,
      'expected_outcome', c.expected_outcome, 'summary', c.summary
    ) order by c.action_title) from public.organization_care593_confirmations c where c.organization_id = v_org_id), '[]'::jsonb),
    'execution_flow', jsonb_build_array('Request', 'Validation', 'Approval', 'Execution', 'Confirmation', 'Audit Log'),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'actions_count', p.actions_count,
      'approvals_count', p.approvals_count, 'templates_count', p.templates_count, 'summary', p.summary
    ) order by p.pack_title) from public.organization_care593_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'reports', jsonb_build_object(
      'can_do', 'Can you do this?',
      'approval_required', 'What approval is required?',
      'who_approves', 'Who can approve?',
      'integrations_needed', 'What integrations are needed?'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_care593_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'request_actions', true, 'approve_actions', true, 'review_actions', true, 'review_status', true, 'review_history', true
    )
  );
end;
$$;

create or replace function public.get_aipify_companion_action_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
  v_exec jsonb;
begin
  v_center := public.get_organization_companion_action_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;
  v_stats := v_center->'stats';
  v_exec := v_center->'executive_dashboard';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Action Summary',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'pending',
        'observation', format('%s pending action(s) awaiting approval.', v_stats->>'pending'),
        'recommendation', 'Review pending actions and approval matrix.',
        'href', '/app/actions/pending'
      ),
      jsonb_build_object(
        'key', 'high_risk',
        'observation', format('%s high-risk action(s) in queue.', v_exec->>'high_risk_actions'),
        'recommendation', 'Ensure multi-level approval for critical actions.',
        'href', '/app/actions/approvals'
      ),
      jsonb_build_object(
        'key', 'failed',
        'observation', format('%s failed action(s) require attention.', v_exec->>'failed_actions'),
        'recommendation', 'Investigate failures and verify integration health.',
        'href', '/app/actions/history'
      ),
      jsonb_build_object(
        'key', 'templates',
        'observation', format('%s action template(s) available.', v_stats->>'templates'),
        'recommendation', 'Use templates to start approved workflows quickly.',
        'href', '/app/actions/reports'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_companion_action_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_companion_action_center('overview');
end;
$$;

grant execute on function public.get_organization_companion_action_center(text) to authenticated;
grant execute on function public.get_aipify_companion_action_advisor_bundle() to authenticated;
grant execute on function public.get_organization_companion_action_center_mobile_summary() to authenticated;
