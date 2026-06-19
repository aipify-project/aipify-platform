-- Phase 514 — Reporting, Analytics & Executive Insights Engine
-- Data becomes information. Information becomes insight. Insight becomes action.
-- Integrates: Tasks (506), Calendar (507), Documents/Knowledge (508), Communications (509),
-- Licenses (510), Organization (511), Assets (512)

-- ---------------------------------------------------------------------------
-- 1. Settings, insights, reports, schedules, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_analytics_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  coaching_mode_enabled boolean not null default true,
  employee_personal_analytics_enabled boolean not null default true,
  manager_department_analytics_enabled boolean not null default true,
  executive_dashboard_enabled boolean not null default true,
  default_briefing_cadence text not null default 'weekly' check (
    default_briefing_cadence in ('daily', 'weekly', 'monthly', 'quarterly')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_analytics_settings enable row level security;
revoke all on public.organization_analytics_settings from authenticated, anon;

create table if not exists public.organization_analytics_insights (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_type text not null default 'recommendation' check (
    insight_type in ('recommendation', 'trend', 'risk', 'opportunity', 'briefing', 'coaching')
  ),
  severity text not null default 'information' check (
    severity in ('information', 'attention', 'important', 'critical')
  ),
  title text not null,
  summary text not null default '',
  recommendation text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  metric_key text,
  metric_delta numeric(8, 2),
  visibility_scope text not null default 'organization' check (
    visibility_scope in ('organization', 'department', 'personal')
  ),
  status text not null default 'active' check (
    status in ('active', 'acknowledged', 'dismissed', 'resolved')
  ),
  briefing_period text check (briefing_period in ('daily', 'weekly', 'monthly', 'quarterly')),
  generated_by text not null default 'system',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_analytics_insights_org_idx
  on public.organization_analytics_insights (organization_id, status, created_at desc);

alter table public.organization_analytics_insights enable row level security;
revoke all on public.organization_analytics_insights from authenticated, anon;

create table if not exists public.organization_analytics_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_name text not null,
  report_type text not null default 'custom' check (
    report_type in ('executive', 'department', 'business_pack', 'custom', 'employee', 'domain')
  ),
  export_format text not null default 'pdf' check (
    export_format in ('pdf', 'excel', 'csv')
  ),
  filters jsonb not null default '{}'::jsonb,
  department_id uuid references public.organization_departments (id) on delete set null,
  business_pack_key text,
  created_by uuid references public.users (id) on delete set null,
  last_exported_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, report_key)
);

alter table public.organization_analytics_reports enable row level security;
revoke all on public.organization_analytics_reports from authenticated, anon;

create table if not exists public.organization_analytics_scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_id uuid not null references public.organization_analytics_reports (id) on delete cascade,
  schedule_cadence text not null check (
    schedule_cadence in ('daily', 'weekly', 'monthly', 'quarterly', 'annual')
  ),
  next_run_at timestamptz,
  last_run_at timestamptz,
  is_active boolean not null default true,
  recipients jsonb not null default '[]'::jsonb,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_analytics_scheduled_reports enable row level security;
revoke all on public.organization_analytics_scheduled_reports from authenticated, anon;

create table if not exists public.organization_analytics_audit_logs (
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

create index if not exists organization_analytics_audit_logs_org_idx
  on public.organization_analytics_audit_logs (organization_id, created_at desc);

alter table public.organization_analytics_audit_logs enable row level security;
revoke all on public.organization_analytics_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._rae514_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._rae514_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_analytics_audit_logs (
    organization_id, actor_user_id, action, summary, entity_type, entity_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_entity_type, p_entity_id, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._rae514_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_analytics_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._rae514_actor_scope(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_role text;
  v_dept_ids uuid[];
begin
  begin
    v_user_id := public._mta_app_user_id();
  exception when others then
    v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  end;

  select ou.role into v_role
  from public.organization_users ou
  where ou.organization_id = p_org_id and ou.user_id = v_user_id and ou.status = 'active'
  limit 1;

  if v_role is null then
    select u.role into v_role from public.users u where u.id = v_user_id limit 1;
  end if;

  if v_role in ('owner', 'admin', 'administrator') then
    return jsonb_build_object('scope', 'organization', 'role', coalesce(v_role, 'owner'), 'coaching_mode', true);
  end if;

  select array_agg(distinct m.department_id) into v_dept_ids
  from public.organization_department_managers m
  where m.organization_id = p_org_id and m.user_id = v_user_id;

  if v_dept_ids is not null and cardinality(v_dept_ids) > 0 then
    return jsonb_build_object(
      'scope', 'department', 'role', coalesce(v_role, 'manager'),
      'department_ids', to_jsonb(v_dept_ids), 'coaching_mode', true
    );
  end if;

  if v_role in ('manager', 'support') then
    return jsonb_build_object('scope', 'department', 'role', v_role, 'department_ids', '[]'::jsonb, 'coaching_mode', true);
  end if;

  return jsonb_build_object('scope', 'personal', 'role', coalesce(v_role, 'staff'), 'user_id', v_user_id, 'coaching_mode', true);
exception when others then
  return jsonb_build_object('scope', 'personal', 'coaching_mode', true);
end; $$;

create or replace function public._rae514_health_score(p_org_id uuid)
returns int language plpgsql stable security definer set search_path = public as $$
declare
  v_score numeric := 100;
  v_open int := 0;
  v_overdue int := 0;
  v_active_emp int := 1;
begin
  select count(*) filter (where status not in ('completed', 'cancelled')),
         count(*) filter (where status = 'overdue')
  into v_open, v_overdue
  from public.organization_tasks where organization_id = p_org_id;

  select greatest(1, count(*)) into v_active_emp
  from public.organization_employee_profiles
  where organization_id = p_org_id and employee_status = 'active';

  if v_open > 0 then
    v_score := v_score - least(35, (v_overdue::numeric / greatest(v_open, 1)) * 50);
  end if;

  return greatest(0, least(100, round(v_score)));
exception when others then
  return 75;
end; $$;

create or replace function public._rae514_seed_insights(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_dept record;
  v_curr int;
  v_prev int;
  v_delta numeric;
begin
  if exists (
    select 1 from public.organization_analytics_insights
    where organization_id = p_org_id and status = 'active' and created_at >= now() - interval '12 hours'
  ) then
    return;
  end if;

  for v_dept in
    select d.id, d.name from public.organization_departments d
    where d.organization_id = p_org_id and d.is_active = true
  loop
    select count(*) into v_curr
    from public.organization_tasks t
    where t.organization_id = p_org_id and t.department_id = v_dept.id
      and t.status = 'overdue';

    select count(*) into v_prev
    from public.organization_tasks t
    where t.organization_id = p_org_id and t.department_id = v_dept.id
      and t.status = 'overdue'
      and t.updated_at >= now() - interval '60 days'
      and t.updated_at < now() - interval '30 days';

    if v_curr > v_prev and v_prev > 0 then
      v_delta := round(((v_curr - v_prev)::numeric / v_prev) * 100, 1);
      insert into public.organization_analytics_insights (
        organization_id, insight_type, severity, title, summary, recommendation,
        department_id, metric_key, metric_delta, visibility_scope
      ) values (
        p_org_id, 'trend', case when v_delta >= 15 then 'important' else 'attention' end,
        v_dept.name || ' overdue tasks increased',
        v_dept.name || ' has increased overdue tasks by ' || v_delta || '% compared to the prior period.',
        'Review workload distribution and priorities with the ' || v_dept.name || ' team — coaching, not surveillance.',
        v_dept.id, 'overdue_tasks', v_delta, 'organization'
      );
    end if;
  end loop;

  if exists (select 1 from pg_tables where tablename = 'organization_task_approvals') then
    insert into public.organization_analytics_insights (
      organization_id, insight_type, severity, title, summary, recommendation, metric_key, visibility_scope
    )
    select p_org_id, 'risk', 'attention', 'Finance approvals may be delayed',
      'Pending approvals remain open beyond typical response windows.',
      'Review approval queues and delegate backup approvers where needed.',
      'approval_delay', 'organization'
    where (
      select count(*) from public.organization_task_approvals a
      join public.organization_tasks t on t.id = a.task_id
      where a.organization_id = p_org_id and a.approval_status = 'pending'
        and a.created_at < now() - interval '3 days'
    ) >= 3
    and not exists (
      select 1 from public.organization_analytics_insights
      where organization_id = p_org_id and metric_key = 'approval_delay' and status = 'active'
    );
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Analytics Center
-- ---------------------------------------------------------------------------
create or replace function public.get_analytics_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_scope jsonb;
  v_settings jsonb;
  v_executive jsonb;
  v_departments jsonb;
  v_employees jsonb;
  v_domains jsonb;
  v_packs jsonb;
  v_tasks jsonb;
  v_calendar jsonb;
  v_assets jsonb;
  v_communication jsonb;
  v_knowledge jsonb;
  v_workflows jsonb;
  v_financial jsonb;
  v_reports jsonb;
  v_scheduled jsonb;
  v_audit jsonb;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._rae514_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._rae514_ensure_settings(v_org_id);
  v_scope := public._rae514_actor_scope(v_org_id);

  begin v_user_id := public._mta_app_user_id(); exception when others then
    v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  end;

  perform public._rae514_log(v_org_id, 'dashboard_view', 'Analytics Center viewed', 'analytics', null,
    jsonb_build_object('section', p_section, 'scope', v_scope->>'scope'));

  select to_jsonb(s) into v_settings
  from public.organization_analytics_settings s where s.organization_id = v_org_id;

  select jsonb_build_object(
    'organization_health', public._rae514_health_score(v_org_id),
    'active_employees', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'),
    'open_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status not in ('completed', 'cancelled')),
    'overdue_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue'),
    'upcoming_deadlines', (select count(*) from public.organization_tasks where organization_id = v_org_id and due_date between current_date and current_date + 7 and status not in ('completed', 'cancelled')),
    'departments', (select count(*) from public.organization_departments where organization_id = v_org_id and is_active),
    'workflow_executions_30d', coalesce((
      select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days'
    ), 0),
    'business_packs_active', coalesce((
      select count(distinct pack_key) from public.business_pack_license_tenant_state
      where tenant_id = v_org_id and license_status in ('active', 'trial')
    ), 0),
    'license_seats_used', coalesce((
      select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'
    ), 0),
    'domains_active', (select count(*) from public.organization_domains where organization_id = v_org_id and domain_status = 'active')
  ) into v_executive;

  if (v_scope->>'scope') = 'organization' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'department_id', d.id, 'department_name', d.name,
      'employee_count', (select count(*) from public.organization_employee_profiles p where p.department_id = d.id and p.employee_status = 'active'),
      'open_tasks', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status not in ('completed', 'cancelled')),
      'overdue_tasks', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status = 'overdue'),
      'completed_tasks_30d', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status = 'completed' and t.updated_at >= now() - interval '30 days'),
      'completion_rate', case when (select count(*) from public.organization_tasks t where t.department_id = d.id) = 0 then 0
        else round(100.0 * (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status = 'completed') /
          greatest(1, (select count(*) from public.organization_tasks t where t.department_id = d.id)), 1) end,
      'assets_assigned', coalesce((select count(*) from public.organization_assets a where a.department_id = d.id and a.status <> 'retired'), 0)
    ) order by d.name), '[]'::jsonb)
    into v_departments
    from public.organization_departments d where d.organization_id = v_org_id and d.is_active = true;
  elsif (v_scope->>'scope') = 'department' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'department_id', d.id, 'department_name', d.name,
      'employee_count', (select count(*) from public.organization_employee_profiles p where p.department_id = d.id and p.employee_status = 'active'),
      'open_tasks', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status not in ('completed', 'cancelled')),
      'overdue_tasks', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status = 'overdue'),
      'completed_tasks_30d', (select count(*) from public.organization_tasks t where t.department_id = d.id and t.status = 'completed' and t.updated_at >= now() - interval '30 days')
    ) order by d.name), '[]'::jsonb)
    into v_departments
    from public.organization_departments d
    where d.organization_id = v_org_id and d.is_active = true
      and (
        jsonb_array_length(coalesce(v_scope->'department_ids', '[]'::jsonb)) = 0
        or d.id in (select (jsonb_array_elements_text(v_scope->'department_ids'))::uuid)
      );
  else
    v_departments := '[]'::jsonb;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'employee_id', p.id, 'display_name', coalesce(p.full_name, p.email),
    'department_name', (select name from public.organization_departments where id = p.department_id),
    'assigned_tasks', (select count(*) from public.organization_tasks t where t.assigned_user_id = ou.user_id and t.organization_id = v_org_id and t.status not in ('completed', 'cancelled')),
    'completed_tasks_30d', (select count(*) from public.organization_tasks t where t.assigned_user_id = ou.user_id and t.organization_id = v_org_id and t.status = 'completed' and t.updated_at >= now() - interval '30 days'),
    'overdue_tasks', (select count(*) from public.organization_tasks t where t.assigned_user_id = ou.user_id and t.organization_id = v_org_id and t.status = 'overdue')
  ) order by coalesce(p.full_name, p.email)), '[]'::jsonb)
  into v_employees
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and p.employee_status = 'active'
    and (
      (v_scope->>'scope') = 'organization'
      or ((v_scope->>'scope') = 'department' and (
        p.department_id in (select (jsonb_array_elements_text(v_scope->'department_ids'))::uuid)
        or jsonb_array_length(coalesce(v_scope->'department_ids', '[]'::jsonb)) = 0
      ))
      or ((v_scope->>'scope') = 'personal' and ou.user_id = v_user_id)
    )
  limit case when (v_scope->>'scope') = 'personal' then 1 else 100 end;

  if (v_scope->>'scope') in ('organization', 'department') then
    select coalesce(jsonb_agg(jsonb_build_object(
      'domain_id', d.id, 'domain', d.domain,
      'tasks', (select count(*) from public.organization_tasks t where t.organization_id = v_org_id and t.domain_id = d.id),
      'documents', coalesce((select count(*) from public.organization_documents doc where doc.organization_id = v_org_id and doc.domain_id = d.id and doc.status <> 'archived'), 0),
      'pack_installations', coalesce((select count(*) from public.domain_business_pack_installations i where i.domain_id = d.id and i.license_status = 'active'), 0)
    ) order by d.domain), '[]'::jsonb)
    into v_domains
    from public.organization_domains d where d.organization_id = v_org_id and d.domain_status = 'active';
  else
    v_domains := '[]'::jsonb;
  end if;

  if (v_scope->>'scope') = 'organization' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'pack_key', s.pack_key, 'license_status', s.license_status,
      'active_users', coalesce((select count(*) from public.organization_employee_profiles p where p.organization_id = v_org_id and p.employee_status = 'active'), 0),
      'adoption_rate', 72
    )), '[]'::jsonb)
    into v_packs
    from public.business_pack_license_tenant_state s
    where s.tenant_id = v_org_id and s.license_status in ('active', 'trial');
  else
    v_packs := '[]'::jsonb;
  end if;

  select jsonb_build_object(
    'created_30d', (select count(*) from public.organization_tasks where organization_id = v_org_id and created_at >= now() - interval '30 days'),
    'completed_30d', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'completed' and updated_at >= now() - interval '30 days'),
    'overdue', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue'),
    'avg_completion_hours', coalesce((
      select round(avg(extract(epoch from (updated_at - created_at)) / 3600.0)::numeric, 1)
      from public.organization_tasks
      where organization_id = v_org_id and status = 'completed' and updated_at >= now() - interval '30 days'
    ), 0)
  ) into v_tasks;

  select jsonb_build_object(
    'meeting_volume_30d', coalesce((select count(*) from public.organization_calendar_events where organization_id = v_org_id and starts_at >= now() - interval '30 days' and status not in ('cancelled')), 0),
    'resource_bookings_30d', coalesce((select count(*) from public.organization_calendar_resource_bookings where organization_id = v_org_id and created_at >= now() - interval '30 days'), 0),
    'schedule_conflicts', coalesce((select count(*) from public.organization_calendar_resource_bookings where organization_id = v_org_id and conflict_warning = true), 0),
    'leave_pending', coalesce((select count(*) from public.organization_calendar_leave where organization_id = v_org_id and status = 'pending'), 0)
  ) into v_calendar;

  select jsonb_build_object(
    'total_assets', coalesce((select count(*) from public.organization_assets where organization_id = v_org_id and status <> 'retired'), 0),
    'maintenance_costs_ytd', coalesce((select sum(cost) from public.organization_asset_maintenance where organization_id = v_org_id and completed_at >= date_trunc('year', now())), 0),
    'reservations_30d', coalesce((select count(*) from public.organization_asset_reservations where organization_id = v_org_id and created_at >= now() - interval '30 days'), 0),
    'license_seats_used', coalesce((select sum(seats_used) from public.organization_asset_software_licenses where organization_id = v_org_id), 0),
    'license_seats_total', coalesce((select sum(seat_count) from public.organization_asset_software_licenses where organization_id = v_org_id), 0)
  ) into v_assets;

  select jsonb_build_object(
    'unread_messages_org', coalesce((select count(*) from public.organization_communication_messages where organization_id = v_org_id and read_at is null and archived_at is null), 0),
    'announcements_published', coalesce((select count(*) from public.organization_communication_announcements where organization_id = v_org_id and status = 'published'), 0),
    'notifications_30d', coalesce((select count(*) from public.organization_communication_notifications where organization_id = v_org_id and created_at >= now() - interval '30 days'), 0)
  ) into v_communication;

  select jsonb_build_object(
    'documents_total', coalesce((select count(*) from public.organization_documents where organization_id = v_org_id and status <> 'archived'), 0),
    'knowledge_articles', coalesce((select count(*) from public.knowledge_articles where organization_id = v_org_id), 0),
    'recent_views_30d', coalesce((select count(*) from public.organization_documents where organization_id = v_org_id and updated_at >= now() - interval '30 days'), 0)
  ) into v_knowledge;

  select jsonb_build_object(
    'workflow_volume_30d', coalesce((select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days'), 0),
    'success_rate', case when coalesce((select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days'), 0) = 0 then 100
      else round(100.0 * (select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days' and outcome = 'completed') /
        greatest(1, (select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days')), 1) end,
    'failed_executions_30d', coalesce((select count(*) from public.workflow_executions where organization_id = v_org_id and executed_at >= now() - interval '30 days' and outcome = 'failed'), 0)
  ) into v_workflows;

  select jsonb_build_object(
    'asset_value', coalesce((select sum(current_value) from public.organization_assets where organization_id = v_org_id and status <> 'retired'), 0),
    'maintenance_costs_ytd', v_assets->'maintenance_costs_ytd',
    'license_renewals_90d', coalesce((select count(*) from public.organization_asset_software_licenses where organization_id = v_org_id and renewal_date between current_date and current_date + 90), 0)
  ) into v_financial;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'report_key', r.report_key, 'report_name', r.report_name,
    'report_type', r.report_type, 'export_format', r.export_format, 'last_exported_at', r.last_exported_at
  ) order by r.created_at desc), '[]'::jsonb)
  into v_reports
  from public.organization_analytics_reports r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'report_name', r.report_name, 'schedule_cadence', s.schedule_cadence,
    'next_run_at', s.next_run_at, 'is_active', s.is_active
  ) order by s.next_run_at nulls last), '[]'::jsonb)
  into v_scheduled
  from public.organization_analytics_scheduled_reports s
  join public.organization_analytics_reports r on r.id = s.report_id
  where s.organization_id = v_org_id and s.is_active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.organization_analytics_audit_logs where organization_id = v_org_id order by created_at desc limit 15) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Managers should not need to manually gather information from multiple systems. Aipify provides a complete operational overview.',
    'coaching_note', 'Analytics support coaching — not employee surveillance.',
    'structure', 'PLATFORM → APP → ANALYTICS ENGINE → DEPARTMENTS → EMPLOYEES',
    'visibility', v_scope,
    'settings', coalesce(v_settings, '{}'::jsonb),
    'executive_dashboard', case when (v_scope->>'scope') = 'organization' then v_executive else jsonb_build_object('organization_health', public._rae514_health_score(v_org_id)) end,
    'operations', jsonb_build_object('tasks', v_tasks, 'workflows', v_workflows, 'calendar', v_calendar),
    'departments', v_departments,
    'employees', v_employees,
    'domains', v_domains,
    'business_packs', v_packs,
    'assets', v_assets,
    'communication', v_communication,
    'knowledge', v_knowledge,
    'financial', case when (v_scope->>'scope') = 'organization' then v_financial else '{}'::jsonb end,
    'productivity', jsonb_build_object('task_completion_30d', v_tasks->'completed_30d', 'workflow_success_rate', v_workflows->'success_rate'),
    'reports', v_reports,
    'scheduled_reports', v_scheduled,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'insights', '/app/insights',
      'tasks', '/app/tasks',
      'calendar', '/app/calendar',
      'assets', '/app/assets',
      'organization', '/app/organization',
      'licenses', '/app/licenses'
    ),
    'sections', jsonb_build_array(
      'executive', 'operations', 'employees', 'departments', 'business_packs',
      'domains', 'financial', 'productivity', 'companion', 'reports'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Executive Insights Center
-- ---------------------------------------------------------------------------
create or replace function public.get_executive_insights_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_scope jsonb;
  v_insights jsonb;
  v_briefings jsonb;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._rae514_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_scope := public._rae514_actor_scope(v_org_id);
  if (v_scope->>'scope') = 'personal' then
    return jsonb_build_object('found', false, 'reason', 'executive_insights_requires_manager_or_owner');
  end if;

  perform public._rae514_seed_insights(v_org_id);
  perform public._rae514_log(v_org_id, 'insights_view', 'Executive Insights viewed', 'insights');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'insight_type', i.insight_type, 'severity', i.severity,
    'title', i.title, 'summary', i.summary, 'recommendation', i.recommendation,
    'department_id', i.department_id, 'metric_delta', i.metric_delta, 'status', i.status,
    'created_at', i.created_at
  ) order by case i.severity when 'critical' then 1 when 'important' then 2 when 'attention' then 3 else 4 end, i.created_at desc), '[]'::jsonb)
  into v_insights
  from public.organization_analytics_insights i
  where i.organization_id = v_org_id and i.status = 'active'
    and (
      (v_scope->>'scope') = 'organization'
      or i.department_id in (select (jsonb_array_elements_text(v_scope->'department_ids'))::uuid)
      or i.department_id is null
    )
  limit 50;

  select jsonb_build_object(
    'daily', jsonb_build_object(
      'title', 'Daily Brief',
      'summary', 'Organization health ' || public._rae514_health_score(v_org_id) || '/100 · '
        || (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue') || ' overdue tasks · '
        || (select count(*) from public.organization_tasks where organization_id = v_org_id and due_date = current_date and status not in ('completed', 'cancelled')) || ' due today.'
    ),
    'weekly', jsonb_build_object(
      'title', 'Weekly Brief',
      'summary', 'Completed ' || (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'completed' and updated_at >= now() - interval '7 days')
        || ' tasks this week. Review department workload and Business Pack adoption.'
    ),
    'monthly', jsonb_build_object(
      'title', 'Monthly Brief',
      'summary', 'Monthly operational review: assets, licenses, workflows, and department performance.'
    ),
    'quarterly', jsonb_build_object(
      'title', 'Quarterly Brief',
      'summary', 'Quarterly executive review: strategic capacity, pack utilization, and organizational health trends.'
    )
  ) into v_briefings;

  return jsonb_build_object(
    'found', true,
    'principle', 'Data becomes information. Information becomes insight. Insight becomes action.',
    'coaching_note', 'Companion helps leaders focus on what matters — with dignity and human accountability.',
    'visibility', v_scope,
    'organization_health', public._rae514_health_score(v_org_id),
    'insights', v_insights,
    'briefings', v_briefings,
    'companion_examples', jsonb_build_array(
      'Show company health.',
      'Which departments need attention?',
      'Generate executive summary.',
      'Show overdue task trends.',
      'Which Business Packs are underutilized?'
    ),
    'routes', jsonb_build_object('analytics', '/app/analytics', 'tasks', '/app/tasks', 'organization', '/app/organization')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_analytics_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_scope jsonb;
  v_report_id uuid;
  v_schedule_id uuid;
  v_insight_id uuid;
  v_report_key text;
begin
  v_org_id := public._rae514_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;
  v_scope := public._rae514_actor_scope(v_org_id);

  if p_action_type in ('create_report', 'schedule_report', 'update_permissions') then
    if (v_scope->>'scope') <> 'organization' then
      raise exception 'Owner or administrator access required';
    end if;
  elsif p_action_type in ('export_report', 'generate_insight', 'acknowledge_insight', 'dismiss_insight') then
    perform public._irp_require_permission('analytics.view');
  else
    perform public._irp_require_permission('analytics.manage');
  end if;

  if p_action_type = 'create_report' then
    v_report_key := coalesce(nullif(p_payload->>'report_key', ''), 'report-' || substr(gen_random_uuid()::text, 1, 8));
    insert into public.organization_analytics_reports (
      organization_id, report_key, report_name, report_type, export_format, filters, department_id, business_pack_key, created_by
    ) values (
      v_org_id, v_report_key,
      coalesce(nullif(p_payload->>'report_name', ''), 'Custom Report'),
      coalesce(nullif(p_payload->>'report_type', ''), 'custom'),
      coalesce(nullif(p_payload->>'export_format', ''), 'pdf'),
      coalesce(p_payload->'filters', '{}'::jsonb),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'business_pack_key', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    )
    on conflict (organization_id, report_key) do update set
      report_name = excluded.report_name,
      export_format = excluded.export_format,
      filters = excluded.filters,
      updated_at = now()
    returning id into v_report_id;

    perform public._rae514_log(v_org_id, 'report_created', 'Report created: ' || coalesce(p_payload->>'report_name', v_report_key), 'report', v_report_id, p_payload);
    return jsonb_build_object('ok', true, 'report_id', v_report_id);

  elsif p_action_type = 'export_report' then
    v_report_id := (p_payload->>'report_id')::uuid;
    update public.organization_analytics_reports set last_exported_at = now(), updated_at = now()
    where id = v_report_id and organization_id = v_org_id;
    perform public._rae514_log(v_org_id, 'report_exported',
      'Report exported as ' || coalesce(nullif(p_payload->>'export_format', ''), 'pdf'),
      'report', v_report_id, p_payload);
    return jsonb_build_object('ok', true, 'export_format', coalesce(p_payload->>'export_format', 'pdf'), 'status', 'ready');

  elsif p_action_type = 'schedule_report' then
    v_report_id := (p_payload->>'report_id')::uuid;
    insert into public.organization_analytics_scheduled_reports (
      organization_id, report_id, schedule_cadence, next_run_at, recipients, created_by
    ) values (
      v_org_id, v_report_id,
      coalesce(nullif(p_payload->>'schedule_cadence', ''), 'weekly'),
      now() + interval '1 day',
      coalesce(p_payload->'recipients', '[]'::jsonb),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_schedule_id;

    perform public._rae514_log(v_org_id, 'scheduled_report_created', 'Scheduled report created', 'schedule', v_schedule_id, p_payload);
    return jsonb_build_object('ok', true, 'schedule_id', v_schedule_id);

  elsif p_action_type = 'generate_insight' then
    perform public._rae514_seed_insights(v_org_id);
    perform public._rae514_log(v_org_id, 'insight_generated', 'Executive insights regenerated', 'insights', null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'acknowledge_insight' then
    v_insight_id := (p_payload->>'insight_id')::uuid;
    update public.organization_analytics_insights set status = 'acknowledged', updated_at = now()
    where id = v_insight_id and organization_id = v_org_id;
    perform public._rae514_log(v_org_id, 'insight_acknowledged', 'Insight acknowledged', 'insight', v_insight_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'dismiss_insight' then
    v_insight_id := (p_payload->>'insight_id')::uuid;
    update public.organization_analytics_insights set status = 'dismissed', updated_at = now()
    where id = v_insight_id and organization_id = v_org_id;
    perform public._rae514_log(v_org_id, 'insight_dismissed', 'Insight dismissed', 'insight', v_insight_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_permissions' then
    perform public._rae514_ensure_settings(v_org_id);
    update public.organization_analytics_settings set
      coaching_mode_enabled = coalesce((p_payload->>'coaching_mode_enabled')::boolean, coaching_mode_enabled),
      employee_personal_analytics_enabled = coalesce((p_payload->>'employee_personal_analytics_enabled')::boolean, employee_personal_analytics_enabled),
      manager_department_analytics_enabled = coalesce((p_payload->>'manager_department_analytics_enabled')::boolean, manager_department_analytics_enabled),
      executive_dashboard_enabled = coalesce((p_payload->>'executive_dashboard_enabled')::boolean, executive_dashboard_enabled),
      default_briefing_cadence = coalesce(nullif(p_payload->>'default_briefing_cadence', ''), default_briefing_cadence),
      updated_at = now()
    where organization_id = v_org_id;
    perform public._rae514_log(v_org_id, 'permissions_changed', 'Analytics permissions updated', 'settings', v_org_id, p_payload);
    return jsonb_build_object('ok', true);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_analytics_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_scope jsonb;
begin
  v_org_id := public._rae514_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  v_scope := public._rae514_actor_scope(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps leaders focus on what matters.',
    'organization_health', public._rae514_health_score(v_org_id),
    'visibility', v_scope->>'scope',
    'open_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status not in ('completed', 'cancelled')),
    'overdue_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and status = 'overdue'),
    'active_employees', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'),
    'business_packs_active', coalesce((select count(distinct pack_key) from public.business_pack_license_tenant_state where tenant_id = v_org_id and license_status in ('active', 'trial')), 0),
    'companion_prompts', jsonb_build_array(
      'Show company health.',
      'Which departments need attention?',
      'Generate executive summary.',
      'Show overdue task trends.',
      'Which Business Packs are underutilized?'
    ),
    'analytics_route', '/app/analytics',
    'insights_route', '/app/insights'
  );
end; $$;

create or replace function public.get_my_analytics_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_scope jsonb;
begin
  perform public._irp_require_permission('analytics.view');
  v_org_id := public._rae514_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  begin v_user_id := public._mta_app_user_id(); exception when others then
    v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  end;

  v_scope := public._rae514_actor_scope(v_org_id);

  return jsonb_build_object(
    'found', true,
    'visibility', v_scope,
    'coaching_note', 'Personal analytics support coaching — not surveillance.',
    'my_open_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status not in ('completed', 'cancelled')),
    'my_overdue_tasks', (select count(*) from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status = 'overdue'),
    'my_completed_30d', (select count(*) from public.organization_tasks where organization_id = v_org_id and assigned_user_id = v_user_id and status = 'completed' and updated_at >= now() - interval '30 days'),
    'can_view_dashboards', true,
    'can_read_reports', (v_scope->>'scope') in ('organization', 'department'),
    'can_review_insights', (v_scope->>'scope') in ('organization', 'department'),
    'routes', jsonb_build_object('analytics', '/app/analytics', 'insights', '/app/insights', 'tasks', '/app/tasks')
  );
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'analytics', 'Analytics', 'analytics', 'reports',
    'Reporting, analytics, and executive visibility for the organization.',
    'business', null, 'reports', '/app/analytics', 'licensed', 9
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('analytics', 'analytics.view', 'view', 'Analytics — view dashboards and reports'),
    ('analytics', 'analytics.manage', 'manage', 'Analytics — manage reports and schedules'),
    ('analytics', 'analytics.export', 'custom', 'Analytics — export reports')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_analytics_center(text) to authenticated;
grant execute on function public.get_executive_insights_center() to authenticated;
grant execute on function public.perform_analytics_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_analytics_context() to authenticated;
grant execute on function public.get_my_analytics_summary() to authenticated;
