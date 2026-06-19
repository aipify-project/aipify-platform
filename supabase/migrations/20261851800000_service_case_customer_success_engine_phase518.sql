-- Phase 518 — Service, Case & Customer Success Engine
-- Customers should never feel forgotten. Consistent service from case creation to resolution.
-- Integrates: CRM (517), Employees (516), Domains (505A), Tasks (506), Governance (515)

-- ---------------------------------------------------------------------------
-- 1. Settings & SLA policies
-- ---------------------------------------------------------------------------
create table if not exists public.organization_service_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_priority text not null default 'normal',
  first_response_hours integer not null default 24,
  resolution_hours integer not null default 72,
  auto_escalate_no_response boolean not null default true,
  companion_case_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_service_settings enable row level security;
revoke all on public.organization_service_settings from authenticated, anon;

create table if not exists public.organization_service_sla_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  name text not null,
  priority text not null default 'normal',
  first_response_minutes integer not null default 1440,
  resolution_minutes integer not null default 4320,
  escalation_minutes integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

alter table public.organization_service_sla_policies enable row level security;
revoke all on public.organization_service_sla_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Cases, timeline, escalations, SLA tracking
-- ---------------------------------------------------------------------------
create table if not exists public.organization_service_cases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_number text,
  title text not null,
  description text not null default '',
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  contact_id uuid references public.organization_crm_contacts (id) on delete set null,
  assigned_employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  assigned_department_id uuid references public.organization_departments (id) on delete set null,
  assigned_manager_user_id uuid references public.users (id) on delete set null,
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'critical', 'emergency')
  ),
  status text not null default 'new' check (
    status in ('new', 'in_progress', 'waiting_for_customer', 'escalated', 'resolved', 'closed')
  ),
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  due_date timestamptz,
  first_response_due_at timestamptz,
  resolution_due_at timestamptz,
  first_responded_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  sla_policy_id uuid references public.organization_service_sla_policies (id) on delete set null,
  attachments jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, case_number)
);

create index if not exists organization_service_cases_org_status_idx
  on public.organization_service_cases (organization_id, status, priority, due_date);

alter table public.organization_service_cases enable row level security;
revoke all on public.organization_service_cases from authenticated, anon;

create table if not exists public.organization_service_case_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.organization_service_cases (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'case', 'task', 'meeting', 'document', 'approval', 'communication',
      'success_activity', 'escalation', 'sla', 'feedback', 'companion', 'custom'
    )
  ),
  title text not null,
  summary text not null default '',
  occurred_at timestamptz not null default now(),
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_service_case_timeline_case_idx
  on public.organization_service_case_timeline (case_id, occurred_at desc);

alter table public.organization_service_case_timeline enable row level security;
revoke all on public.organization_service_case_timeline from authenticated, anon;

create table if not exists public.organization_service_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.organization_service_cases (id) on delete cascade,
  escalation_reason text not null,
  escalated_to_user_id uuid references public.users (id) on delete set null,
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.organization_service_escalations enable row level security;
revoke all on public.organization_service_escalations from authenticated, anon;

create table if not exists public.organization_service_sla_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid not null references public.organization_service_cases (id) on delete cascade,
  event_type text not null check (event_type in ('first_response', 'resolution', 'breach', 'warning')),
  target_at timestamptz,
  met_at timestamptz,
  breached boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.organization_service_sla_events enable row level security;
revoke all on public.organization_service_sla_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Customer success, feedback, actions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_service_customer_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  health_score integer not null default 75 check (health_score between 0 and 100),
  health_status text not null default 'stable' check (
    health_status in ('healthy', 'stable', 'at_risk', 'critical')
  ),
  engagement_score integer not null default 70 check (engagement_score between 0 and 100),
  response_time_score integer not null default 70 check (response_time_score between 0 and 100),
  open_issues_count integer not null default 0,
  renewal_risk text not null default 'low' check (renewal_risk in ('low', 'moderate', 'high', 'critical')),
  satisfaction_score integer check (satisfaction_score between 0 and 100),
  last_review_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_id)
);

alter table public.organization_service_customer_health enable row level security;
revoke all on public.organization_service_customer_health from authenticated, anon;

create table if not exists public.organization_service_success_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.organization_crm_customers (id) on delete cascade,
  case_id uuid references public.organization_service_cases (id) on delete set null,
  action_type text not null check (
    action_type in (
      'check_in_call', 'renewal_review', 'training_session', 'health_review',
      'relationship_review', 'follow_up', 'custom'
    )
  ),
  title text not null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'completed', 'cancelled')),
  due_date date,
  assigned_employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_service_success_actions enable row level security;
revoke all on public.organization_service_success_actions from authenticated, anon;

create table if not exists public.organization_service_feedback (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid references public.organization_service_cases (id) on delete set null,
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  rating integer check (rating between 1 and 5),
  comment text not null default '',
  feedback_type text not null default 'case' check (feedback_type in ('case', 'success', 'general')),
  created_at timestamptz not null default now()
);

alter table public.organization_service_feedback enable row level security;
revoke all on public.organization_service_feedback from authenticated, anon;

create table if not exists public.organization_service_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  case_id uuid references public.organization_service_cases (id) on delete set null,
  customer_id uuid references public.organization_crm_customers (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_service_audit_logs_org_idx
  on public.organization_service_audit_logs (organization_id, created_at desc);

alter table public.organization_service_audit_logs enable row level security;
revoke all on public.organization_service_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._svc518_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._svc518_log(
  p_org_id uuid, p_action text, p_summary text,
  p_case_id uuid default null, p_customer_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_service_audit_logs (
    organization_id, case_id, customer_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_case_id, p_customer_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._svc518_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_service_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
  insert into public.organization_service_sla_policies (
    organization_id, policy_key, name, priority, first_response_minutes, resolution_minutes, escalation_minutes
  ) values
    (p_org_id, 'standard', 'Standard SLA', 'normal', 1440, 4320, 2880),
    (p_org_id, 'high_priority', 'High Priority SLA', 'high', 240, 1440, 720),
    (p_org_id, 'critical', 'Critical SLA', 'critical', 60, 480, 120)
  on conflict (organization_id, policy_key) do nothing;
end; $$;

create or replace function public._svc518_next_case_number(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  select count(*) + 1 into v_n from public.organization_service_cases where organization_id = p_org_id;
  return 'SC-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._svc518_case_json(p_row public.organization_service_cases)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'case_number', p_row.case_number,
    'title', p_row.title,
    'description', p_row.description,
    'customer_id', p_row.customer_id,
    'customer_name', (
      select coalesce(c.company_name, c.name) from public.organization_crm_customers c where c.id = p_row.customer_id
    ),
    'contact_id', p_row.contact_id,
    'assigned_employee_profile_id', p_row.assigned_employee_profile_id,
    'assigned_employee_name', (
      select full_name from public.organization_employee_profiles where id = p_row.assigned_employee_profile_id
    ),
    'assigned_department_id', p_row.assigned_department_id,
    'department_name', (select name from public.organization_departments where id = p_row.assigned_department_id),
    'priority', p_row.priority,
    'status', p_row.status,
    'domain_id', p_row.domain_id,
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'business_pack_key', p_row.business_pack_key,
    'due_date', p_row.due_date,
    'first_response_due_at', p_row.first_response_due_at,
    'resolution_due_at', p_row.resolution_due_at,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._svc518_add_timeline(
  p_org_id uuid, p_case_id uuid, p_event_type text, p_title text,
  p_summary text default '', p_payload jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organization_service_case_timeline (
    organization_id, case_id, event_type, title, summary, actor_user_id, metadata
  ) values (
    p_org_id, p_case_id, p_event_type, p_title, p_summary,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    coalesce(p_payload, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._svc518_apply_sla(p_org_id uuid, p_case_id uuid, p_priority text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_policy public.organization_service_sla_policies;
begin
  select * into v_policy from public.organization_service_sla_policies
  where organization_id = p_org_id
    and priority = coalesce(p_priority, 'normal')
    and is_active
  order by created_at limit 1;

  if v_policy.id is null then
    select * into v_policy from public.organization_service_sla_policies
    where organization_id = p_org_id and policy_key = 'standard' limit 1;
  end if;

  if v_policy.id is not null then
    update public.organization_service_cases set
      sla_policy_id = v_policy.id,
      first_response_due_at = now() + (v_policy.first_response_minutes || ' minutes')::interval,
      resolution_due_at = now() + (v_policy.resolution_minutes || ' minutes')::interval,
      updated_at = now()
    where id = p_case_id and organization_id = p_org_id;

    insert into public.organization_service_sla_events (organization_id, case_id, event_type, target_at)
    values
      (p_org_id, p_case_id, 'first_response', now() + (v_policy.first_response_minutes || ' minutes')::interval),
      (p_org_id, p_case_id, 'resolution', now() + (v_policy.resolution_minutes || ' minutes')::interval);
  end if;
end; $$;

create or replace function public._svc518_refresh_customer_health(p_org_id uuid, p_customer_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_open integer;
  v_score integer;
  v_status text;
begin
  if p_customer_id is null then return; end if;

  select count(*) into v_open
  from public.organization_service_cases
  where organization_id = p_org_id and customer_id = p_customer_id
    and status not in ('resolved', 'closed');

  v_score := greatest(0, least(100, 85 - (v_open * 8)));
  v_status := case
    when v_score >= 80 then 'healthy'
    when v_score >= 60 then 'stable'
    when v_score >= 40 then 'at_risk'
    else 'critical'
  end;

  insert into public.organization_service_customer_health (
    organization_id, customer_id, health_score, health_status, open_issues_count, renewal_risk
  ) values (
    p_org_id, p_customer_id, v_score, v_status, v_open,
    case when v_open >= 3 then 'high' when v_open >= 1 then 'moderate' else 'low' end
  )
  on conflict (organization_id, customer_id) do update set
    health_score = excluded.health_score,
    health_status = excluded.health_status,
    open_issues_count = excluded.open_issues_count,
    renewal_risk = excluded.renewal_risk,
    updated_at = now();
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Service Case Center
-- ---------------------------------------------------------------------------
create or replace function public.get_service_case_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_overview jsonb;
  v_open jsonb;
  v_assigned jsonb;
  v_escalations jsonb;
  v_completed jsonb;
  v_sla jsonb;
  v_timeline jsonb;
  v_reports jsonb;
  v_audit jsonb;
begin
  perform public._irp_require_permission('cases.view');
  v_org_id := public._svc518_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._svc518_ensure_settings(v_org_id);
  perform public._svc518_log(v_org_id, 'center_view', 'Case Center viewed', null, null,
    jsonb_build_object('section', p_section));

  select jsonb_build_object(
    'total_cases', (select count(*) from public.organization_service_cases where organization_id = v_org_id),
    'open_cases', (select count(*) from public.organization_service_cases where organization_id = v_org_id and status not in ('resolved', 'closed')),
    'escalated', (select count(*) from public.organization_service_cases where organization_id = v_org_id and status = 'escalated'),
    'overdue', (
      select count(*) from public.organization_service_cases
      where organization_id = v_org_id and status not in ('resolved', 'closed')
        and resolution_due_at is not null and resolution_due_at < now()
    ),
    'sla_at_risk', (
      select count(*) from public.organization_service_sla_events e
      join public.organization_service_cases c on c.id = e.case_id
      where e.organization_id = v_org_id and e.breached = false and e.target_at < now() + interval '4 hours'
        and c.status not in ('resolved', 'closed')
    ),
    'resolved_30d', (
      select count(*) from public.organization_service_cases
      where organization_id = v_org_id and status in ('resolved', 'closed')
        and coalesce(resolved_at, closed_at, updated_at) >= now() - interval '30 days'
    )
  ) into v_overview;

  select coalesce(jsonb_agg(public._svc518_case_json(c) order by c.updated_at desc), '[]'::jsonb)
  into v_open
  from (
    select * from public.organization_service_cases
    where organization_id = v_org_id and status not in ('resolved', 'closed')
    order by
      case priority when 'emergency' then 1 when 'critical' then 2 when 'high' then 3 when 'normal' then 4 else 5 end,
      updated_at desc
    limit 80
  ) c;

  select coalesce(jsonb_agg(public._svc518_case_json(c) order by c.updated_at desc), '[]'::jsonb)
  into v_assigned
  from (
    select * from public.organization_service_cases
    where organization_id = v_org_id and assigned_employee_profile_id is not null
      and status not in ('resolved', 'closed')
    limit 50
  ) c;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'case_id', e.case_id,
    'case_number', (select case_number from public.organization_service_cases where id = e.case_id),
    'title', (select title from public.organization_service_cases where id = e.case_id),
    'escalation_reason', e.escalation_reason, 'status', e.status, 'created_at', e.created_at
  ) order by e.created_at desc), '[]'::jsonb)
  into v_escalations
  from public.organization_service_escalations e
  where e.organization_id = v_org_id and e.status = 'open'
  limit 40;

  select coalesce(jsonb_agg(public._svc518_case_json(c) order by coalesce(c.resolved_at, c.closed_at) desc), '[]'::jsonb)
  into v_completed
  from (
    select * from public.organization_service_cases
    where organization_id = v_org_id and status in ('resolved', 'closed')
    order by coalesce(resolved_at, closed_at, updated_at) desc limit 40
  ) c;

  select jsonb_build_object(
    'policies', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'policy_key', p.policy_key, 'name', p.name, 'priority', p.priority,
        'first_response_minutes', p.first_response_minutes, 'resolution_minutes', p.resolution_minutes
      )) from public.organization_service_sla_policies p where p.organization_id = v_org_id and p.is_active
    ), '[]'::jsonb),
    'breaches', (select count(*) from public.organization_service_sla_events where organization_id = v_org_id and breached = true),
    'at_risk', (
      select count(*) from public.organization_service_sla_events e
      join public.organization_service_cases c on c.id = e.case_id
      where e.organization_id = v_org_id and e.breached = false and e.target_at < now()
        and c.status not in ('resolved', 'closed')
    )
  ) into v_sla;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'case_id', t.case_id,
    'case_title', (select title from public.organization_service_cases where id = t.case_id),
    'event_type', t.event_type, 'title', t.title, 'summary', t.summary, 'occurred_at', t.occurred_at
  ) order by t.occurred_at desc), '[]'::jsonb)
  into v_timeline
  from public.organization_service_case_timeline t where t.organization_id = v_org_id limit 40;

  select jsonb_build_object(
    'avg_resolution_hours', coalesce((
      select round(avg(extract(epoch from (coalesce(resolved_at, closed_at) - created_at)) / 3600)::numeric, 1)
      from public.organization_service_cases
      where organization_id = v_org_id and status in ('resolved', 'closed')
        and coalesce(resolved_at, closed_at) >= now() - interval '30 days'
    ), 0),
    'sla_compliance_percent', case
      when (select count(*) from public.organization_service_sla_events where organization_id = v_org_id) = 0 then 100
      else round(100.0 * (
        select count(*) from public.organization_service_sla_events where organization_id = v_org_id and breached = false
      )::numeric / greatest((select count(*) from public.organization_service_sla_events where organization_id = v_org_id), 1)::numeric, 1)
    end,
    'escalations_30d', (select count(*) from public.organization_service_escalations where organization_id = v_org_id and created_at >= now() - interval '30 days'),
    'feedback_avg', coalesce((select round(avg(rating)::numeric, 1) from public.organization_service_feedback where organization_id = v_org_id), 0)
  ) into v_reports;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.organization_service_audit_logs a where a.organization_id = v_org_id limit 20;

  return jsonb_build_object(
    'found', true,
    'principle', 'Customers should never feel forgotten. Aipify helps deliver consistent service experiences.',
    'overview', v_overview,
    'open_cases', v_open,
    'assigned_cases', v_assigned,
    'escalations', v_escalations,
    'completed_cases', v_completed,
    'sla', v_sla,
    'timeline', v_timeline,
    'reports', v_reports,
    'audit_recent', v_audit,
    'case_statuses', jsonb_build_array(
      'new', 'in_progress', 'waiting_for_customer', 'escalated', 'resolved', 'closed'
    ),
    'priorities', jsonb_build_array('low', 'normal', 'high', 'critical', 'emergency'),
    'sections', jsonb_build_array(
      'overview', 'open_cases', 'assigned_cases', 'escalations', 'completed_cases', 'sla', 'customer_success', 'reports'
    ),
    'routes', jsonb_build_object(
      'cases', '/app/cases',
      'customer_success', '/app/cases/customer-success',
      'customers', '/app/customers',
      'employees', '/app/employees',
      'tasks', '/app/tasks'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Customer Success Center (Phase 518 — service health)
-- ---------------------------------------------------------------------------
create or replace function public.get_service_customer_success_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_health jsonb;
  v_actions jsonb;
  v_feedback jsonb;
begin
  perform public._irp_require_permission('cases.view');
  v_org_id := public._svc518_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._svc518_ensure_settings(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'customer_id', h.customer_id,
    'customer_name', (select coalesce(c.company_name, c.name) from public.organization_crm_customers c where c.id = h.customer_id),
    'health_score', h.health_score,
    'health_status', h.health_status,
    'engagement_score', h.engagement_score,
    'open_issues_count', h.open_issues_count,
    'renewal_risk', h.renewal_risk,
    'satisfaction_score', h.satisfaction_score,
    'last_review_at', h.last_review_at
  ) order by h.health_score asc), '[]'::jsonb)
  into v_health
  from public.organization_service_customer_health h where h.organization_id = v_org_id limit 100;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'customer_id', a.customer_id,
    'customer_name', (select coalesce(c.company_name, c.name) from public.organization_crm_customers c where c.id = a.customer_id),
    'action_type', a.action_type, 'title', a.title, 'status', a.status, 'due_date', a.due_date
  ) order by a.due_date nulls last), '[]'::jsonb)
  into v_actions
  from public.organization_service_success_actions a
  where a.organization_id = v_org_id and a.status <> 'completed'
  limit 50;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'case_id', f.case_id, 'customer_id', f.customer_id,
    'rating', f.rating, 'comment', f.comment, 'feedback_type', f.feedback_type, 'created_at', f.created_at
  ) order by f.created_at desc), '[]'::jsonb)
  into v_feedback
  from public.organization_service_feedback f where f.organization_id = v_org_id limit 30;

  return jsonb_build_object(
    'found', true,
    'principle', 'Track customer health and relationship quality — engagement, issues, renewal risk, and satisfaction.',
    'summary', jsonb_build_object(
      'healthy', (select count(*) from public.organization_service_customer_health where organization_id = v_org_id and health_status = 'healthy'),
      'stable', (select count(*) from public.organization_service_customer_health where organization_id = v_org_id and health_status = 'stable'),
      'at_risk', (select count(*) from public.organization_service_customer_health where organization_id = v_org_id and health_status = 'at_risk'),
      'critical', (select count(*) from public.organization_service_customer_health where organization_id = v_org_id and health_status = 'critical'),
      'avg_health_score', coalesce((select round(avg(health_score)::numeric, 0) from public.organization_service_customer_health where organization_id = v_org_id), 0)
    ),
    'customer_health', v_health,
    'success_actions', v_actions,
    'feedback', v_feedback,
    'health_statuses', jsonb_build_array('healthy', 'stable', 'at_risk', 'critical'),
    'routes', jsonb_build_object('cases', '/app/cases', 'customer_success', '/app/cases/customer-success', 'customers', '/app/customers')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_service_case_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_case_id uuid;
  v_customer_id uuid;
  v_esc_id uuid;
begin
  v_org_id := public._svc518_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_case', 'assign_case', 'update_case', 'escalate_case', 'resolve_case',
    'close_case', 'record_feedback', 'create_success_action', 'complete_success_action'
  ) then
    perform public._irp_require_permission('cases.manage');
  else
    perform public._irp_require_permission('cases.view');
  end if;

  if p_action_type = 'create_case' then
    insert into public.organization_service_cases (
      organization_id, case_number, title, description, customer_id, contact_id,
      priority, status, assigned_employee_profile_id, assigned_department_id,
      domain_id, business_pack_key, due_date
    ) values (
      v_org_id,
      coalesce(p_payload->>'case_number', public._svc518_next_case_number(v_org_id)),
      coalesce(p_payload->>'title', 'New case'),
      coalesce(p_payload->>'description', ''),
      nullif(p_payload->>'customer_id', '')::uuid,
      nullif(p_payload->>'contact_id', '')::uuid,
      coalesce(p_payload->>'priority', 'normal'),
      'new',
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      nullif(p_payload->>'assigned_department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      nullif(p_payload->>'due_date', '')::timestamptz
    ) returning id into v_case_id;

    perform public._svc518_apply_sla(v_org_id, v_case_id, coalesce(p_payload->>'priority', 'normal'));
    perform public._svc518_add_timeline(v_org_id, v_case_id, 'case', 'Case created', coalesce(p_payload->>'description', ''));
    perform public._svc518_log(v_org_id, 'case_created', 'Case created', v_case_id, nullif(p_payload->>'customer_id', '')::uuid, p_payload);

    select customer_id into v_customer_id from public.organization_service_cases where id = v_case_id;
    perform public._svc518_refresh_customer_health(v_org_id, v_customer_id);
    return jsonb_build_object('ok', true, 'case_id', v_case_id);

  elsif p_action_type = 'assign_case' then
    v_case_id := (p_payload->>'case_id')::uuid;
    update public.organization_service_cases set
      assigned_employee_profile_id = nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      assigned_department_id = nullif(p_payload->>'assigned_department_id', '')::uuid,
      assigned_manager_user_id = nullif(p_payload->>'assigned_manager_user_id', '')::uuid,
      status = case when status = 'new' then 'in_progress' else status end,
      updated_at = now()
    where id = v_case_id and organization_id = v_org_id;

    perform public._svc518_add_timeline(v_org_id, v_case_id, 'case', 'Case assigned', 'Assignment updated');
    perform public._svc518_log(v_org_id, 'case_assigned', 'Case assigned', v_case_id, null, p_payload);
    return jsonb_build_object('ok', true, 'case_id', v_case_id);

  elsif p_action_type = 'update_case' then
    v_case_id := (p_payload->>'case_id')::uuid;
    update public.organization_service_cases set
      title = coalesce(p_payload->>'title', title),
      description = coalesce(p_payload->>'description', description),
      priority = coalesce(p_payload->>'priority', priority),
      status = coalesce(p_payload->>'status', status),
      updated_at = now()
    where id = v_case_id and organization_id = v_org_id;

    if p_payload->>'status' = 'waiting_for_customer' then
      perform public._svc518_add_timeline(v_org_id, v_case_id, 'communication', 'Waiting for customer', 'Status updated');
    end if;
    perform public._svc518_log(v_org_id, 'case_updated', 'Case updated', v_case_id, null, p_payload);
    return jsonb_build_object('ok', true, 'case_id', v_case_id);

  elsif p_action_type = 'escalate_case' then
    v_case_id := (p_payload->>'case_id')::uuid;
    update public.organization_service_cases set status = 'escalated', updated_at = now()
    where id = v_case_id and organization_id = v_org_id;

    insert into public.organization_service_escalations (
      organization_id, case_id, escalation_reason, escalated_to_user_id
    ) values (
      v_org_id, v_case_id,
      coalesce(p_payload->>'escalation_reason', 'Escalated per business rules'),
      nullif(p_payload->>'escalated_to_user_id', '')::uuid
    ) returning id into v_esc_id;

    perform public._svc518_add_timeline(v_org_id, v_case_id, 'escalation', 'Case escalated', coalesce(p_payload->>'escalation_reason', ''));
    perform public._svc518_log(v_org_id, 'case_escalated', 'Case escalated', v_case_id, null, p_payload);
    return jsonb_build_object('ok', true, 'case_id', v_case_id, 'escalation_id', v_esc_id);

  elsif p_action_type = 'resolve_case' then
    v_case_id := (p_payload->>'case_id')::uuid;
    update public.organization_service_cases set
      status = 'resolved', resolved_at = now(), updated_at = now()
    where id = v_case_id and organization_id = v_org_id;

    perform public._svc518_add_timeline(v_org_id, v_case_id, 'case', 'Case resolved', coalesce(p_payload->>'summary', ''));
    perform public._svc518_log(v_org_id, 'case_resolved', 'Case resolved', v_case_id, null, p_payload);

    select customer_id into v_customer_id from public.organization_service_cases where id = v_case_id;
    perform public._svc518_refresh_customer_health(v_org_id, v_customer_id);
    return jsonb_build_object('ok', true, 'case_id', v_case_id);

  elsif p_action_type = 'close_case' then
    v_case_id := (p_payload->>'case_id')::uuid;
    update public.organization_service_cases set
      status = 'closed', closed_at = now(), updated_at = now()
    where id = v_case_id and organization_id = v_org_id;

    perform public._svc518_add_timeline(v_org_id, v_case_id, 'case', 'Case closed', 'Case closed');
    perform public._svc518_log(v_org_id, 'case_closed', 'Case closed', v_case_id, null, p_payload);

    select customer_id into v_customer_id from public.organization_service_cases where id = v_case_id;
    perform public._svc518_refresh_customer_health(v_org_id, v_customer_id);
    return jsonb_build_object('ok', true, 'case_id', v_case_id);

  elsif p_action_type = 'record_feedback' then
    v_case_id := nullif(p_payload->>'case_id', '')::uuid;
    v_customer_id := nullif(p_payload->>'customer_id', '')::uuid;
    insert into public.organization_service_feedback (
      organization_id, case_id, customer_id, rating, comment, feedback_type
    ) values (
      v_org_id, v_case_id, v_customer_id,
      nullif(p_payload->>'rating', '')::integer,
      coalesce(p_payload->>'comment', ''),
      coalesce(p_payload->>'feedback_type', 'case')
    );
    perform public._svc518_log(v_org_id, 'feedback_received', 'Customer feedback recorded', v_case_id, v_customer_id, p_payload);
    if v_customer_id is not null then
      perform public._svc518_refresh_customer_health(v_org_id, v_customer_id);
    end if;
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_success_action' then
    v_customer_id := (p_payload->>'customer_id')::uuid;
    insert into public.organization_service_success_actions (
      organization_id, customer_id, case_id, action_type, title, due_date, assigned_employee_profile_id, notes
    ) values (
      v_org_id, v_customer_id,
      nullif(p_payload->>'case_id', '')::uuid,
      coalesce(p_payload->>'action_type', 'check_in_call'),
      coalesce(p_payload->>'title', 'Customer success action'),
      nullif(p_payload->>'due_date', '')::date,
      nullif(p_payload->>'assigned_employee_profile_id', '')::uuid,
      coalesce(p_payload->>'notes', '')
    );
    perform public._svc518_log(v_org_id, 'customer_success_action', 'Success action created', null, v_customer_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'complete_success_action' then
    update public.organization_service_success_actions set status = 'completed', updated_at = now()
    where id = (p_payload->>'action_id')::uuid and organization_id = v_org_id;
    perform public._svc518_log(v_org_id, 'customer_success_action', 'Success action completed', null, null, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_service_case_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('cases.view');
  v_org_id := public._svc518_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps maintain service relationships — customers should never feel forgotten.',
    'open_cases', (select count(*) from public.organization_service_cases where organization_id = v_org_id and status not in ('resolved', 'closed')),
    'escalated_cases', (select count(*) from public.organization_service_cases where organization_id = v_org_id and status = 'escalated'),
    'overdue_cases', (
      select count(*) from public.organization_service_cases
      where organization_id = v_org_id and status not in ('resolved', 'closed')
        and resolution_due_at is not null and resolution_due_at < now()
    ),
    'sla_at_risk', (
      select count(*) from public.organization_service_sla_events e
      join public.organization_service_cases c on c.id = e.case_id
      where e.organization_id = v_org_id and e.breached = false and e.target_at < now()
        and c.status not in ('resolved', 'closed')
    ),
    'customers_at_risk', (select count(*) from public.organization_service_customer_health where organization_id = v_org_id and health_status in ('at_risk', 'critical')),
    'companion_prompts', jsonb_build_array(
      'Show open cases.',
      'Which customers need attention?',
      'Create follow-up.',
      'Show SLA violations.',
      'Which cases are overdue?'
    ),
    'cases_route', '/app/cases',
    'customer_success_route', '/app/cases/customer-success'
  );
end; $$;

create or replace function public.get_my_service_case_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('cases.view');
  v_org_id := public._svc518_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and ou.user_id = v_user_id limit 1;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('cases.manage', v_org_id),
    'my_open_cases', (
      select count(*) from public.organization_service_cases
      where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id
        and status not in ('resolved', 'closed')
    ),
    'my_escalations', (
      select count(*) from public.organization_service_cases
      where organization_id = v_org_id and assigned_employee_profile_id = v_profile_id and status = 'escalated'
    ),
    'routes', jsonb_build_object('cases', '/app/cases', 'customer_success', '/app/cases/customer-success')
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('cases', '/app/cases'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'cases', 'Cases', 'cases', 'operations',
    'Service cases, SLA, escalations, and customer success for the organization.',
    'starter', null, 'operations', '/app/cases', 'licensed', 6
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('cases', 'cases.view', 'view', 'Cases — view service cases and customer success'),
    ('cases', 'cases.manage', 'manage', 'Cases — create, assign, escalate, resolve, and close cases')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('cases', 'cases.view', 'view', 'Cases — view service cases and customer success'),
    ('cases', 'cases.manage', 'manage', 'Cases — create, assign, escalate, resolve, and close cases')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_service_case_center(text) to authenticated;
grant execute on function public.get_service_customer_success_center() to authenticated;
grant execute on function public.perform_service_case_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_service_case_context() to authenticated;
grant execute on function public.get_my_service_case_summary() to authenticated;
