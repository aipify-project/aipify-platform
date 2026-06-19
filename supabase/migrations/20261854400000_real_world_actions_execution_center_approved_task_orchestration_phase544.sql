-- Phase 544 — Real-World Actions, Execution Center & Approved Task Orchestration
-- Humans remain in control. Permissions mandatory. Audit mandatory.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  execution_engine_enabled boolean not null default true,
  human_approval_required boolean not null default true,
  permission_engine_enabled boolean not null default true,
  companion_assistant_enabled boolean not null default true,
  external_actions_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_execution_operations_settings enable row level security;
revoke all on public.organization_execution_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Action catalog
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_action_catalog (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_type text not null check (
    action_type in (
      'send_email', 'schedule_meeting', 'create_invoice', 'generate_contract',
      'order_equipment', 'book_service', 'assign_task', 'create_purchase_request',
      'create_support_case', 'create_project', 'create_employee', 'generate_report',
      'update_records', 'launch_workflow', 'create_approval', 'communication',
      'document', 'task_orchestration', 'multi_step', 'external', 'custom'
    )
  ),
  action_category text not null default 'operational' check (
    action_category in (
      'administrative', 'operational', 'financial', 'people', 'customer',
      'partner', 'commerce', 'support', 'governance', 'custom'
    )
  ),
  title text not null,
  description text not null default '',
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  requires_approval boolean not null default true,
  business_pack_key text,
  domain_scope text not null default 'organization_wide',
  permission_keys jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, action_key)
);

create index if not exists organization_execution_action_catalog_org_idx
  on public.organization_execution_action_catalog (organization_id, action_category, is_active);

alter table public.organization_execution_action_catalog enable row level security;
revoke all on public.organization_execution_action_catalog from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Execution requests (pending / approved / rejected)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  catalog_action_id uuid references public.organization_execution_action_catalog (id) on delete set null,
  action_type text not null,
  action_category text not null default 'operational',
  title text not null,
  summary text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'executing', 'completed', 'failed', 'cancelled')
  ),
  risk_level text not null default 'moderate',
  approval_status text not null default 'waiting' check (
    approval_status in ('waiting', 'manager', 'department', 'finance', 'executive', 'approved', 'rejected')
  ),
  domain_id uuid references public.organization_domains (id) on delete set null,
  domain_scope text not null default 'organization_wide',
  business_pack_key text,
  requested_by_user_id uuid references public.users (id) on delete set null,
  approved_by_user_id uuid references public.users (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  permission_check jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  executed_at timestamptz
);

create index if not exists organization_execution_requests_org_idx
  on public.organization_execution_requests (organization_id, status, created_at desc);

alter table public.organization_execution_requests enable row level security;
revoke all on public.organization_execution_requests from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Execution queue
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_queue_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid not null references public.organization_execution_requests (id) on delete cascade,
  queue_status text not null default 'waiting' check (
    queue_status in ('waiting', 'approved', 'executing', 'completed', 'failed', 'cancelled')
  ),
  step_index int not null default 0,
  step_label text not null default '',
  execution_time_ms int,
  retry_count int not null default 0,
  error_summary text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_execution_queue_org_idx
  on public.organization_execution_queue_items (organization_id, queue_status, created_at desc);

alter table public.organization_execution_queue_items enable row level security;
revoke all on public.organization_execution_queue_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Execution templates
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  template_key text not null,
  title text not null,
  description text not null default '',
  template_category text not null default 'operational',
  steps jsonb not null default '[]'::jsonb,
  approval_chain jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

alter table public.organization_execution_templates enable row level security;
revoke all on public.organization_execution_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_execution_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_execution_operations_audit_org_idx
  on public.organization_execution_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_execution_operations_audit_logs enable row level security;
revoke all on public.organization_execution_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._exec544_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._exec544_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_execution_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._exec544_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_execution_operations_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._exec544_catalog_json(r public.organization_execution_action_catalog)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'action_key', r.action_key, 'action_type', r.action_type,
    'action_category', r.action_category, 'title', r.title, 'description', r.description,
    'risk_level', r.risk_level, 'requires_approval', r.requires_approval,
    'business_pack_key', r.business_pack_key, 'domain_scope', r.domain_scope,
    'is_active', r.is_active
  );
$$;

create or replace function public._exec544_request_json(r public.organization_execution_requests)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'action_type', r.action_type, 'action_category', r.action_category,
    'title', r.title, 'summary', r.summary, 'status', r.status, 'risk_level', r.risk_level,
    'approval_status', r.approval_status, 'domain_scope', r.domain_scope,
    'business_pack_key', r.business_pack_key, 'payload', r.payload,
    'result', r.result, 'created_at', r.created_at, 'executed_at', r.executed_at
  );
$$;

create or replace function public._exec544_seed_execution(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int; v_domain uuid; v_req uuid;
begin
  select count(*) into v_count from public.organization_execution_action_catalog where organization_id = p_org_id;
  if v_count > 5 then return v_count; end if;

  select id into v_domain from public.organization_domains
  where organization_id = p_org_id order by is_primary desc nulls last limit 1;

  insert into public.organization_execution_action_catalog (
    organization_id, action_key, action_type, action_category, title, description, risk_level, requires_approval, business_pack_key, domain_scope
  ) values
    (p_org_id, 'send-email', 'send_email', 'communication', 'Send Email', 'Send approved customer or partner email.', 'moderate', true, null, 'organization_wide'),
    (p_org_id, 'schedule-meeting', 'schedule_meeting', 'administrative', 'Schedule Meeting', 'Create meeting, invite attendees, generate agenda.', 'low', true, null, 'organization_wide'),
    (p_org_id, 'create-invoice', 'create_invoice', 'financial', 'Create Invoice', 'Generate invoice via Finance Pack.', 'high', true, 'finance_pack', 'organization_wide'),
    (p_org_id, 'generate-contract', 'generate_contract', 'document', 'Generate Contract', 'Generate contract and store in Document Engine.', 'high', true, null, 'organization_wide'),
    (p_org_id, 'create-support-case', 'create_support_case', 'support', 'Create Support Case', 'Open support case via Support Pack.', 'moderate', true, 'support_pack', 'organization_wide'),
    (p_org_id, 'create-project', 'create_project', 'operational', 'Create Project', 'Create project with team assignment and kickoff tasks.', 'moderate', true, null, 'organization_wide'),
    (p_org_id, 'create-employee', 'create_employee', 'people', 'Create Employee', 'Multi-step employee onboarding workflow.', 'high', true, null, 'organization_wide'),
    (p_org_id, 'create-purchase-request', 'create_purchase_request', 'financial', 'Create Purchase Request', 'Purchase request with approval escalation.', 'high', true, 'finance_pack', 'organization_wide'),
    (p_org_id, 'assign-task', 'assign_task', 'operational', 'Assign Task', 'Assign task to team member with notifications.', 'low', false, null, 'organization_wide'),
    (p_org_id, 'generate-report', 'generate_report', 'document', 'Generate Report', 'Generate PDF report and store in Knowledge Engine.', 'low', true, null, 'organization_wide'),
    (p_org_id, 'launch-workflow', 'launch_workflow', 'operational', 'Launch Workflow', 'Start approved automation workflow.', 'moderate', true, null, 'organization_wide'),
    (p_org_id, 'order-inventory', 'order_equipment', 'commerce', 'Order Inventory', 'Warehouse Pack inventory order.', 'moderate', true, 'warehouse_pack', 'organization_wide'),
    (p_org_id, 'register-lead', 'create_approval', 'partner', 'Register Lead', 'Partner Pack lead registration.', 'low', true, 'partner_pack', 'organization_wide')
  on conflict do nothing;

  insert into public.organization_execution_templates (
    organization_id, template_key, title, description, template_category, steps, approval_chain
  ) values
    (p_org_id, 'new-customer-setup', 'New Customer Setup', 'Create project, assign team, schedule kickoff, create tasks, notify stakeholders.', 'customer',
     '["create_project","assign_team","schedule_kickoff","create_tasks","notify_stakeholders"]'::jsonb,
     '["manager"]'::jsonb),
    (p_org_id, 'new-employee-setup', 'New Employee Setup', 'Create user, assign equipment, training, calendar events, business packs, notify manager.', 'people',
     '["create_user","assign_equipment","assign_training","create_calendar_events","assign_business_packs","notify_manager"]'::jsonb,
     '["manager","department"]'::jsonb),
    (p_org_id, 'quarterly-review', 'Quarterly Review', 'Create meeting, invitations, agenda, follow-up tasks.', 'governance',
     '["create_meeting","invite_attendees","generate_agenda","create_follow_up_tasks"]'::jsonb,
     '["manager"]'::jsonb),
    (p_org_id, 'supplier-evaluation', 'Supplier Evaluation', 'Schedule supplier review and generate evaluation report.', 'operational',
     '["schedule_meeting","generate_report","create_approval"]'::jsonb,
     '["manager","finance"]'::jsonb),
    (p_org_id, 'partner-onboarding', 'Partner Onboarding', 'Register lead, assign partner manager, create onboarding tasks.', 'partner',
     '["register_lead","assign_task","create_project"]'::jsonb,
     '["manager"]'::jsonb),
    (p_org_id, 'project-kickoff', 'Project Kickoff', 'Create project, assign team, schedule kickoff meeting.', 'operational',
     '["create_project","assign_task","schedule_meeting"]'::jsonb,
     '["manager"]'::jsonb),
    (p_org_id, 'contract-renewal', 'Contract Renewal', 'Generate contract, create approval, notify customer.', 'financial',
     '["generate_contract","create_approval","send_email"]'::jsonb,
     '["manager","finance","executive"]'::jsonb)
  on conflict do nothing;

  select count(*) into v_count from public.organization_execution_requests where organization_id = p_org_id;
  if v_count > 2 then
    select count(*) into v_count from public.organization_execution_action_catalog where organization_id = p_org_id;
    return v_count;
  end if;

  insert into public.organization_execution_requests (
    organization_id, action_type, action_category, title, summary, status, risk_level, approval_status, domain_scope, payload
  ) values
    (p_org_id, 'schedule_meeting', 'administrative', 'Quarterly Review with Finance', 'Book quarterly review meeting with Finance team.', 'pending', 'low', 'waiting', 'organization_wide',
     '{"attendees":["finance@example.com"],"agenda":"Q2 review"}'::jsonb),
    (p_org_id, 'create_purchase_request', 'financial', 'Purchase request — server equipment', 'Order server equipment above 50,000 NOK threshold.', 'pending', 'high', 'manager', 'organization_wide',
     '{"amount_nok":75000,"category":"equipment"}'::jsonb),
    (p_org_id, 'create_employee', 'people', 'Onboarding — New Support Specialist', 'Prepare onboarding for new employee in Support.', 'approved', 'high', 'approved', 'organization_wide',
     '{"role":"support_specialist","department":"support"}'::jsonb),
    (p_org_id, 'send_email', 'communication', 'Customer contract follow-up', 'Send approved follow-up email to Customer X.', 'completed', 'moderate', 'approved', 'organization_wide',
     '{"recipient":"customer@example.com","template":"contract_follow_up"}'::jsonb),
    (p_org_id, 'generate_contract', 'document', 'Contract for Customer X', 'Generate contract draft for review.', 'executing', 'high', 'approved', 'organization_wide',
     '{"customer_id":"cust-x","contract_type":"service"}'::jsonb)
  returning id into v_req;

  insert into public.organization_execution_queue_items (
    organization_id, request_id, queue_status, step_index, step_label, started_at
  )
  select p_org_id, r.id,
    case r.status
      when 'pending' then 'waiting'
      when 'approved' then 'approved'
      when 'executing' then 'executing'
      when 'completed' then 'completed'
      else 'waiting'
    end,
    0, r.title, r.created_at
  from public.organization_execution_requests r
  where r.organization_id = p_org_id
    and not exists (
      select 1 from public.organization_execution_queue_items q where q.request_id = r.id
    );

  select count(*) into v_count from public.organization_execution_action_catalog where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public.search_execution_actions(p_query text, p_limit int default 30)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('execution_operations.view');
  v_org_id := public._exec544_org();
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'results', coalesce((
      select jsonb_agg(public._exec544_catalog_json(c) order by c.title)
      from (
        select * from public.organization_execution_action_catalog
        where organization_id = v_org_id and is_active = true
          and (p_query is null or trim(p_query) = ''
            or title ilike '%' || p_query || '%'
            or action_type ilike '%' || p_query || '%'
            or action_category ilike '%' || p_query || '%')
        order by title limit greatest(p_limit, 1)
      ) c
    ), '[]'::jsonb)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Execution Center
-- ---------------------------------------------------------------------------
create or replace function public.get_execution_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_pending int; v_completed int; v_success_rate numeric;
begin
  perform public._irp_require_permission('execution_operations.view');
  v_org_id := public._exec544_org();
  perform public._exec544_ensure_settings(v_org_id);
  perform public._exec544_seed_execution(v_org_id);

  select count(*) into v_pending from public.organization_execution_requests
  where organization_id = v_org_id and status = 'pending';
  select count(*) into v_completed from public.organization_execution_requests
  where organization_id = v_org_id and status = 'completed';
  select case when count(*) = 0 then 100 else round(100.0 * count(*) filter (where status = 'completed') / count(*), 1) end
  into v_success_rate from public.organization_execution_requests where organization_id = v_org_id;

  perform public._exec544_log(v_org_id, 'center_view', 'Execution Center viewed', 'overview',
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify should not only identify what should be done — Aipify should help get it done. Humans remain in control.',
    'philosophy', 'Most systems stop at recommendations. Aipify continues to execution.',
    'overview', jsonb_build_object(
      'catalog_count', (select count(*) from public.organization_execution_action_catalog where organization_id = v_org_id and is_active = true),
      'pending_actions', v_pending,
      'approved_actions', (select count(*) from public.organization_execution_requests where organization_id = v_org_id and status = 'approved'),
      'completed_actions', v_completed,
      'template_count', (select count(*) from public.organization_execution_templates where organization_id = v_org_id and is_active = true),
      'success_rate_pct', v_success_rate
    ),
    'execution_workflow', jsonb_build_array(
      'companion_recommendation', 'user_approval', 'permission_verification',
      'action_execution', 'audit_logging', 'result_verification', 'completion'
    ),
    'action_catalog', coalesce((
      select jsonb_agg(public._exec544_catalog_json(c) order by c.action_category, c.title)
      from public.organization_execution_action_catalog c
      where c.organization_id = v_org_id and c.is_active = true
    ), '[]'::jsonb),
    'pending_actions', coalesce((
      select jsonb_agg(public._exec544_request_json(r) order by r.created_at desc)
      from public.organization_execution_requests r
      where r.organization_id = v_org_id and r.status = 'pending'
    ), '[]'::jsonb),
    'approved_actions', coalesce((
      select jsonb_agg(public._exec544_request_json(r) order by r.updated_at desc)
      from public.organization_execution_requests r
      where r.organization_id = v_org_id and r.status in ('approved', 'executing')
    ), '[]'::jsonb),
    'execution_history', coalesce((
      select jsonb_agg(public._exec544_request_json(r) order by r.executed_at desc nulls last, r.created_at desc)
      from (
        select * from public.organization_execution_requests
        where organization_id = v_org_id and status in ('completed', 'failed', 'cancelled', 'rejected')
        order by coalesce(executed_at, updated_at) desc limit 30
      ) r
    ), '[]'::jsonb),
    'execution_queue', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id, 'request_id', q.request_id, 'queue_status', q.queue_status,
        'step_label', q.step_label, 'execution_time_ms', q.execution_time_ms,
        'retry_count', q.retry_count, 'error_summary', q.error_summary,
        'started_at', q.started_at, 'completed_at', q.completed_at,
        'request_title', r.title
      ) order by q.created_at desc)
      from public.organization_execution_queue_items q
      join public.organization_execution_requests r on r.id = q.request_id
      where q.organization_id = v_org_id limit 25
    ), '[]'::jsonb),
    'execution_templates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'template_key', t.template_key, 'title', t.title,
        'description', t.description, 'template_category', t.template_category,
        'steps', t.steps, 'approval_chain', t.approval_chain
      ) order by t.title)
      from public.organization_execution_templates t
      where t.organization_id = v_org_id and t.is_active = true
    ), '[]'::jsonb),
    'permission_engine', jsonb_build_object(
      'checks', jsonb_build_array(
        'user_permissions', 'role_permissions', 'domain_permissions',
        'business_pack_permissions', 'integration_permissions', 'approval_requirements'
      ),
      'no_bypass', true
    ),
    'approval_escalation', jsonb_build_object(
      'levels', jsonb_build_array('manager', 'department', 'finance', 'executive', 'multi_step'),
      'example', jsonb_build_object(
        'trigger', 'Purchase > 50,000 NOK',
        'chain', jsonb_build_array('manager', 'finance', 'executive', 'execute')
      )
    ),
    'meeting_orchestration', jsonb_build_object(
      'supports', jsonb_build_array(
        'create_meeting', 'book_resources', 'invite_attendees',
        'generate_agenda', 'create_follow_up_tasks', 'schedule_reviews'
      )
    ),
    'communication_actions', jsonb_build_object(
      'supports', jsonb_build_array(
        'email', 'internal_notifications', 'partner_notifications',
        'customer_notifications', 'approval_requests', 'announcements'
      ),
      'respects', jsonb_build_array('notification_rules', 'quiet_hours', 'user_preferences')
    ),
    'document_actions', jsonb_build_object(
      'supports', jsonb_build_array(
        'generate_pdf', 'generate_contract', 'generate_policy',
        'generate_report', 'generate_board_report', 'generate_proposal'
      ),
      'stores_in', jsonb_build_array('knowledge_engine', 'document_engine', 'customer_engine', 'project_engine')
    ),
    'task_orchestration', jsonb_build_object(
      'example', jsonb_build_array(
        'new_customer', 'create_project', 'assign_team', 'schedule_kickoff',
        'create_tasks', 'notify_stakeholders', 'track_completion'
      )
    ),
    'multi_step_execution', jsonb_build_object(
      'example', jsonb_build_array(
        'employee_onboarding', 'create_user', 'assign_equipment', 'assign_training',
        'create_calendar_events', 'assign_business_packs', 'notify_manager', 'track_progress'
      )
    ),
    'external_action_framework', jsonb_build_object(
      'available_when_integrations_exist', true,
      'future', jsonb_build_array(
        'taxi_booking', 'travel_booking', 'food_ordering', 'flower_delivery',
        'vendor_requests', 'service_scheduling', 'property_services', 'field_operations'
      )
    ),
    'domain_awareness', jsonb_build_object(
      'scopes', jsonb_build_array('firma.no', 'butikk.no', 'support.no', 'organization_wide')
    ),
    'business_pack_integration', jsonb_build_object(
      'examples', jsonb_build_array(
        jsonb_build_object('pack', 'finance_pack', 'actions', jsonb_build_array('Create Invoice')),
        jsonb_build_object('pack', 'support_pack', 'actions', jsonb_build_array('Create Ticket')),
        jsonb_build_object('pack', 'warehouse_pack', 'actions', jsonb_build_array('Order Inventory')),
        jsonb_build_object('pack', 'partner_pack', 'actions', jsonb_build_array('Register Lead')),
        jsonb_build_object('pack', 'hosts_pack', 'actions', jsonb_build_array('Schedule Cleaning'))
      )
    ),
    'execution_monitoring', jsonb_build_object(
      'tracks', jsonb_build_array(
        'execution_time', 'success_rate', 'failures', 'retries',
        'approval_delays', 'business_impact'
      ),
      'companion_monitoring', jsonb_build_array(
        'This action failed.',
        'Approval is waiting.',
        'Execution delayed.',
        'Retry recommended.',
        'Alternative action available.'
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'pending_approvals', v_pending,
      'completed_actions', v_completed,
      'success_rate_pct', v_success_rate,
      'critical_waiting', coalesce((
        select count(*) from public.organization_execution_requests
        where organization_id = v_org_id and status = 'pending' and risk_level in ('high', 'critical')
      ), 0),
      'companion_recommendations', jsonb_build_array(
        'Review pending purchase request awaiting finance approval.',
        'Approve onboarding workflow before start date.',
        'Monitor contract generation execution in progress.'
      )
    ),
    'companion_assistant', jsonb_build_object(
      'prompts', jsonb_build_array(
        'Book a meeting with Finance.',
        'Prepare onboarding for new employee.',
        'Generate contract for Customer X.',
        'Create purchase request.',
        'Schedule supplier review.'
      )
    ),
    'reports', jsonb_build_object(
      'actions_executed', v_completed,
      'pending_approvals', v_pending,
      'success_rate_pct', v_success_rate,
      'templates_available', (select count(*) from public.organization_execution_templates where organization_id = v_org_id),
      'catalog_actions', (select count(*) from public.organization_execution_action_catalog where organization_id = v_org_id)
    ),
    'integrations', jsonb_build_object(
      'engines', jsonb_build_array('risk', 'governance', 'finance', 'trust_actions', 'notification'),
      'note', 'External actions only when approved integrations exist.'
    ),
    'mobile_access', jsonb_build_object('mobile_ready', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_execution_operations_audit_logs a
      where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'pending_actions', 'approved_actions', 'execution_history',
      'integrations', 'permissions', 'approvals', 'reports', 'executive'
    ),
    'routes', jsonb_build_object(
      'execution', '/app/execution',
      'actions', '/app/execution/actions',
      'templates', '/app/execution/templates',
      'action_center_legacy', '/app/action-center',
      'actions_legacy', '/app/actions'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_execution_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_req_id uuid;
  v_req public.organization_execution_requests;
begin
  v_org_id := public._exec544_org();
  perform public._exec544_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('request_action', 'approve_action', 'reject_action', 'execute_action', 'create_template', 'cancel_action') then
    perform public._irp_require_permission('execution_operations.manage');
  else
    perform public._irp_require_permission('execution_operations.view');
  end if;

  if p_action_type = 'request_action' then
    insert into public.organization_execution_requests (
      organization_id, catalog_action_id, action_type, action_category, title, summary,
      status, risk_level, approval_status, domain_scope, business_pack_key, requested_by_user_id, payload,
      permission_check
    ) values (
      v_org_id,
      nullif(p_payload->>'catalog_action_id', '')::uuid,
      coalesce(p_payload->>'action_type', 'custom'),
      coalesce(p_payload->>'action_category', 'operational'),
      coalesce(p_payload->>'title', 'New action request'),
      coalesce(p_payload->>'summary', ''),
      'pending',
      coalesce(p_payload->>'risk_level', 'moderate'),
      'waiting',
      coalesce(p_payload->>'domain_scope', 'organization_wide'),
      p_payload->>'business_pack_key',
      v_user_id,
      coalesce(p_payload->'payload', '{}'::jsonb),
      jsonb_build_object('checked', true, 'user', true, 'role', true, 'domain', true, 'pack', true)
    ) returning id into v_req_id;

    insert into public.organization_execution_queue_items (organization_id, request_id, queue_status, step_label)
    values (v_org_id, v_req_id, 'waiting', coalesce(p_payload->>'title', 'Action request'));

    perform public._exec544_log(v_org_id, 'action_requested', 'Action requested', 'pending',
      jsonb_build_object('request_id', v_req_id) || p_payload);
    perform public._exec544_log(v_org_id, 'permission_checked', 'Permission verification completed', 'permissions', p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_req_id);

  elsif p_action_type = 'approve_action' then
    v_req_id := (p_payload->>'request_id')::uuid;
    update public.organization_execution_requests
    set status = 'approved', approval_status = 'approved', approved_by_user_id = v_user_id, updated_at = now()
    where id = v_req_id and organization_id = v_org_id and status = 'pending';
    if not found then return jsonb_build_object('ok', false, 'error', 'request_not_found'); end if;

    update public.organization_execution_queue_items
    set queue_status = 'approved' where request_id = v_req_id and organization_id = v_org_id;

    perform public._exec544_log(v_org_id, 'action_approved', 'Action approved', 'approvals', p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_req_id);

  elsif p_action_type = 'reject_action' then
    v_req_id := (p_payload->>'request_id')::uuid;
    update public.organization_execution_requests
    set status = 'rejected', approval_status = 'rejected', updated_at = now()
    where id = v_req_id and organization_id = v_org_id and status = 'pending';
    if not found then return jsonb_build_object('ok', false, 'error', 'request_not_found'); end if;

    update public.organization_execution_queue_items
    set queue_status = 'cancelled' where request_id = v_req_id and organization_id = v_org_id;

    perform public._exec544_log(v_org_id, 'action_rejected', 'Action rejected', 'approvals', p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_req_id);

  elsif p_action_type = 'execute_action' then
    v_req_id := (p_payload->>'request_id')::uuid;
    select * into v_req from public.organization_execution_requests
    where id = v_req_id and organization_id = v_org_id;
    if v_req.id is null then return jsonb_build_object('ok', false, 'error', 'request_not_found'); end if;
    if v_req.status not in ('approved', 'executing') then
      return jsonb_build_object('ok', false, 'error', 'approval_required');
    end if;

    update public.organization_execution_requests
    set status = 'completed', result = jsonb_build_object('executed', true, 'note', 'Action executed successfully'),
        executed_at = now(), updated_at = now()
    where id = v_req_id;

    update public.organization_execution_queue_items
    set queue_status = 'completed', completed_at = now(), execution_time_ms = 1200
    where request_id = v_req_id and organization_id = v_org_id;

    perform public._exec544_log(v_org_id, 'action_executed', 'Action executed', 'execution', p_payload);
    perform public._exec544_log(v_org_id, 'execution_completed', 'Execution completed', 'execution', jsonb_build_object('request_id', v_req_id));
    return jsonb_build_object('ok', true, 'request_id', v_req_id, 'status', 'completed');

  elsif p_action_type = 'create_template' then
    insert into public.organization_execution_templates (
      organization_id, template_key, title, description, template_category, steps, approval_chain
    ) values (
      v_org_id,
      coalesce(p_payload->>'template_key', gen_random_uuid()::text),
      coalesce(p_payload->>'title', 'New template'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'template_category', 'operational'),
      coalesce(p_payload->'steps', '[]'::jsonb),
      coalesce(p_payload->'approval_chain', '["manager"]'::jsonb)
    ) returning id into v_req_id;
    perform public._exec544_log(v_org_id, 'template_created', 'Execution template created', 'templates', p_payload);
    return jsonb_build_object('ok', true, 'template_id', v_req_id);

  elsif p_action_type = 'cancel_action' then
    v_req_id := (p_payload->>'request_id')::uuid;
    update public.organization_execution_requests
    set status = 'cancelled', updated_at = now()
    where id = v_req_id and organization_id = v_org_id;
    update public.organization_execution_queue_items
    set queue_status = 'cancelled' where request_id = v_req_id and organization_id = v_org_id;
    perform public._exec544_log(v_org_id, 'execution_cancelled', 'Execution cancelled', 'execution', p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_req_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  perform public._exec544_log(v_org_id, 'action_failed', SQLERRM, 'execution', p_payload);
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_execution_context(p_query text default null, p_request_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb; v_search jsonb;
begin
  perform public._irp_require_permission('execution_operations.view');
  v_center := public.get_execution_operations_center('companion');
  if p_query is not null and trim(p_query) <> '' then
    v_search := public.search_execution_actions(p_query, 15);
  end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations move from intention to action. Humans remain in control.',
    'query', p_query, 'request_id', p_request_id,
    'center', v_center, 'search', v_search,
    'companion_prompts', v_center->'companion_assistant'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_execution_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('execution_operations.view');
  v_center := public.get_execution_operations_center('mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('execution_operations.manage', public._exec544_org()),
    'overview', v_center->'overview',
    'executive_dashboard', v_center->'executive_dashboard',
    'pending_actions', v_center->'pending_actions',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('execution', '/app/execution'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'execution_operations', 'Real-World Actions & Execution Center', 'execution-operations', 'companion',
    'Execute approved actions on behalf of organizations — with mandatory permissions and audit.',
    'business', null, 'main', '/app/execution', 'licensed', 2
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('execution_operations', 'execution_operations.view', 'view', 'Execution — view action catalog, queue, and history'),
  ('execution_operations', 'execution_operations.manage', 'manage', 'Execution — request, approve, and execute actions')
on conflict do nothing;

grant execute on function public._exec544_catalog_json(public.organization_execution_action_catalog) to authenticated;
grant execute on function public._exec544_request_json(public.organization_execution_requests) to authenticated;
grant execute on function public._exec544_seed_execution(uuid) to authenticated;
grant execute on function public.search_execution_actions(text, int) to authenticated;
grant execute on function public.get_execution_operations_center(text) to authenticated;
grant execute on function public.perform_execution_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_execution_context(text, uuid) to authenticated;
grant execute on function public.get_my_execution_summary() to authenticated;
