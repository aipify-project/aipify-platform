-- Phase 571 — Organizational Digital Headquarters, Executive Operations Room & Live Command Environment
-- Feature owner: CUSTOMER APP
-- Routes: /app/headquarters, /app/headquarters/operations, /app/headquarters/executive, /app/headquarters/war-room
-- Helpers: _cmhq571_*

create table if not exists public.organization_companion_headquarters_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  headquarters_enabled boolean not null default true,
  live_metrics_enabled boolean not null default true,
  war_room_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_headquarters_settings enable row level security;
revoke all on public.organization_companion_headquarters_settings from authenticated, anon;

create table if not exists public.organization_companion_headquarters_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  department_title text not null,
  department_type text not null check (
    department_type in (
      'finance', 'support', 'operations', 'projects', 'sales',
      'marketing', 'warehouse', 'partner_success', 'custom'
    )
  ),
  department_status text not null default 'active' check (
    department_status in ('active', 'overloaded', 'watch', 'critical', 'offline')
  ),
  health_score numeric(5,2) not null default 0 check (health_score between 0 and 100),
  active_items integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, department_key)
);

alter table public.organization_companion_headquarters_departments enable row level security;
revoke all on public.organization_companion_headquarters_departments from authenticated, anon;

create table if not exists public.organization_companion_headquarters_live_activity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  activity_key text not null,
  activity_title text not null,
  activity_type text not null check (
    activity_type in (
      'event', 'approval', 'incident', 'customer', 'partner',
      'automation', 'companion', 'revenue', 'custom'
    )
  ),
  activity_status text not null default 'live' check (
    activity_status in ('live', 'attention', 'critical', 'resolved')
  ),
  source_area text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, activity_key)
);

alter table public.organization_companion_headquarters_live_activity enable row level security;
revoke all on public.organization_companion_headquarters_live_activity from authenticated, anon;

create table if not exists public.organization_companion_headquarters_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_area text not null check (
    metric_area in (
      'revenue', 'approvals', 'projects', 'customers', 'partners',
      'inventory', 'tasks', 'workflows', 'incidents', 'overall'
    )
  ),
  metric_value numeric(12,2) not null default 0,
  metric_trend text not null default 'stable' check (
    metric_trend in ('up', 'down', 'stable', 'volatile')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_headquarters_metrics enable row level security;
revoke all on public.organization_companion_headquarters_metrics from authenticated, anon;

create table if not exists public.organization_companion_headquarters_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  owner_name text not null default '',
  action_status text not null default 'open' check (
    action_status in ('open', 'in_progress', 'blocked', 'completed', 'overdue')
  ),
  deadline_label text not null default '',
  dependencies jsonb not null default '[]'::jsonb,
  approval_required boolean not null default false,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_companion_headquarters_actions enable row level security;
revoke all on public.organization_companion_headquarters_actions from authenticated, anon;

create table if not exists public.organization_companion_headquarters_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_key text not null,
  alert_title text not null,
  alert_type text not null check (
    alert_type in (
      'critical_issue', 'executive_review', 'department_health',
      'pulse_change', 'war_room', 'companion', 'custom'
    )
  ),
  alert_status text not null default 'active' check (
    alert_status in ('active', 'acknowledged', 'resolved', 'archived')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, alert_key)
);

alter table public.organization_companion_headquarters_alerts enable row level security;
revoke all on public.organization_companion_headquarters_alerts from authenticated, anon;

create table if not exists public.organization_companion_headquarters_pulse (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pulse_key text not null,
  pulse_area text not null check (
    pulse_area in (
      'employee', 'customer', 'partner', 'operational',
      'companion', 'business_pack', 'overall'
    )
  ),
  pulse_status text not null default 'strong' check (
    pulse_status in ('strong', 'slowing', 'immediate_review')
  ),
  pulse_score numeric(5,2) not null default 0 check (pulse_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pulse_key)
);

alter table public.organization_companion_headquarters_pulse enable row level security;
revoke all on public.organization_companion_headquarters_pulse from authenticated, anon;

create table if not exists public.organization_companion_headquarters_meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  meeting_key text not null,
  meeting_title text not null,
  meeting_status text not null default 'scheduled' check (
    meeting_status in ('scheduled', 'preparing', 'ready', 'completed', 'cancelled')
  ),
  readiness_score numeric(5,2) not null default 0,
  required_actions jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, meeting_key)
);

alter table public.organization_companion_headquarters_meetings enable row level security;
revoke all on public.organization_companion_headquarters_meetings from authenticated, anon;

create table if not exists public.organization_companion_headquarters_coordination (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  coordination_key text not null,
  coordination_title text not null,
  coordination_type text not null check (
    coordination_type in ('shared_project', 'dependency', 'approval', 'resource', 'risk', 'custom')
  ),
  coordination_status text not null default 'active' check (
    coordination_status in ('active', 'blocked', 'resolved', 'archived')
  ),
  departments jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, coordination_key)
);

alter table public.organization_companion_headquarters_coordination enable row level security;
revoke all on public.organization_companion_headquarters_coordination from authenticated, anon;

create table if not exists public.organization_companion_headquarters_war_room (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  war_room_key text not null,
  war_room_title text not null,
  event_type text not null check (
    event_type in (
      'critical_incident', 'major_project', 'acquisition', 'expansion',
      'cybersecurity', 'revenue_crisis', 'custom'
    )
  ),
  war_room_status text not null default 'standby' check (
    war_room_status in ('standby', 'active', 'monitoring', 'resolved', 'archived')
  ),
  team_members jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, war_room_key)
);

alter table public.organization_companion_headquarters_war_room enable row level security;
revoke all on public.organization_companion_headquarters_war_room from authenticated, anon;

create table if not exists public.organization_companion_headquarters_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'headquarters' check (
    metric_category in ('headquarters', 'operations', 'executive', 'pulse', 'coordination')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_headquarters_analytics enable row level security;
revoke all on public.organization_companion_headquarters_analytics from authenticated, anon;

create table if not exists public.organization_companion_headquarters_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'headquarters' check (
    audit_category in (
      'operations', 'executive', 'war_room', 'department', 'pulse',
      'coordination', 'meeting', 'headquarters'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_headquarters_audit_logs_org_idx
  on public.organization_companion_headquarters_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_headquarters_audit_logs enable row level security;
revoke all on public.organization_companion_headquarters_audit_logs from authenticated, anon;

create or replace function public._cmhq571_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmhq571_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'headquarters'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_headquarters_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'headquarters'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmhq571_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_headquarters_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmhq571_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_headquarters_departments where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_headquarters_departments (
    organization_id, department_key, department_title, department_type, department_status, health_score, active_items, summary
  ) values
    (p_org_id, 'dept_finance', 'Finance', 'finance', 'active', 85, 12, 'Finance Pack — financial events and budget reviews active.'),
    (p_org_id, 'dept_support', 'Support', 'support', 'watch', 68, 28, 'Support Pack — customer activity elevated, review recommended.'),
    (p_org_id, 'dept_operations', 'Operations', 'operations', 'active', 82, 15, 'Operations room — projects and tasks on track.'),
    (p_org_id, 'dept_sales', 'Sales', 'sales', 'active', 79, 18, 'Revenue events and pipeline activity monitored.'),
    (p_org_id, 'dept_marketing', 'Marketing', 'marketing', 'active', 76, 9, 'Campaign activity and brand operations visible.'),
    (p_org_id, 'dept_warehouse', 'Warehouse', 'warehouse', 'active', 88, 22, 'Warehouse Pack — inventory activity healthy.'),
    (p_org_id, 'dept_partner', 'Partner Success', 'partner_success', 'active', 81, 14, 'Partner Pack — partner activity and growth tracked.');

  insert into public.organization_companion_headquarters_live_activity (
    organization_id, activity_key, activity_title, activity_type, activity_status, source_area, summary
  ) values
    (p_org_id, 'act_approval_queue', 'Approval Queue Growing', 'approval', 'attention', 'approvals',
     '12 pending approvals — operations may be blocked.'),
    (p_org_id, 'act_revenue_event', 'Revenue Event — New Contract', 'revenue', 'live', 'sales',
     'New enterprise contract signed — revenue event recorded.'),
    (p_org_id, 'act_customer_spike', 'Customer Activity Spike', 'customer', 'live', 'support',
     'Support Pack — customer activity increased 35% this morning.'),
    (p_org_id, 'act_partner_growth', 'Partner Performance Improving', 'partner', 'live', 'partners',
     'Partner Pack — growth metrics trending positive.'),
    (p_org_id, 'act_companion_brief', 'Companion Briefing Prepared', 'companion', 'live', 'companion',
     'Companion prepared operations summary for leadership.'),
    (p_org_id, 'act_incident_review', 'Critical Issue Under Review', 'incident', 'critical', 'operations',
     'Operational risk flagged — executive review may be required.');

  insert into public.organization_companion_headquarters_metrics (
    organization_id, metric_key, metric_title, metric_area, metric_value, metric_trend
  ) values
    (p_org_id, 'met_revenue', 'Revenue (MTD)', 'revenue', 485000, 'up'),
    (p_org_id, 'met_approvals', 'Pending Approvals', 'approvals', 12, 'up'),
    (p_org_id, 'met_projects', 'Active Projects', 'projects', 24, 'stable'),
    (p_org_id, 'met_customers', 'Active Customers', 'customers', 1240, 'up'),
    (p_org_id, 'met_partners', 'Active Partners', 'partners', 86, 'up'),
    (p_org_id, 'met_inventory', 'Inventory Items', 'inventory', 3420, 'stable'),
    (p_org_id, 'met_tasks', 'Open Tasks', 'tasks', 156, 'down'),
    (p_org_id, 'met_incidents', 'Open Incidents', 'incidents', 2, 'stable');

  insert into public.organization_companion_headquarters_actions (
    organization_id, action_key, action_title, owner_name, action_status, deadline_label, dependencies, approval_required, summary
  ) values
    (p_org_id, 'act_domain_launch', 'Domain Launch Approval', 'CTO', 'blocked', 'Today', '["Legal review","DNS setup"]'::jsonb, true,
     'Blocked pending executive approval — domain launch.'),
    (p_org_id, 'act_q1_report', 'Q1 Board Report', 'CFO', 'in_progress', 'Friday', '["Finance data","Executive review"]'::jsonb, false,
     'Board report in progress — deadline Friday.'),
    (p_org_id, 'act_hiring_plan', 'Staff Expansion Plan', 'HR Director', 'open', 'Next week', '["Budget approval"]'::jsonb, true,
     'Hiring plan awaiting budget approval.'),
    (p_org_id, 'act_inventory_reorder', 'Inventory Reorder', 'Warehouse Manager', 'in_progress', 'Tomorrow', '[]'::jsonb, false,
     'Warehouse Pack — reorder in progress.');

  insert into public.organization_companion_headquarters_alerts (
    organization_id, alert_key, alert_title, alert_type, alert_status, priority, summary
  ) values
    (p_org_id, 'alert_critical', 'Critical Issue Detected', 'critical_issue', 'active', 'critical',
     'Operational risk requires immediate attention.'),
    (p_org_id, 'alert_exec_review', 'Executive Review Required', 'executive_review', 'active', 'high',
     'Strategic decision pending executive review.'),
    (p_org_id, 'alert_dept_support', 'Support Department Health Changed', 'department_health', 'active', 'moderate',
     'Support department health dropped — review recommended.'),
    (p_org_id, 'alert_pulse', 'Operational Pulse Slowing', 'pulse_change', 'acknowledged', 'moderate',
     'Organizational pulse slowing — monitor closely.');

  insert into public.organization_companion_headquarters_pulse (
    organization_id, pulse_key, pulse_area, pulse_status, pulse_score, summary
  ) values
    (p_org_id, 'pulse_employee', 'Employee Activity', 'employee', 'strong', 82,
     'Employee activity strong across departments.'),
    (p_org_id, 'pulse_customer', 'Customer Activity', 'customer', 'slowing', 68,
     'Support Pack — customer activity elevated.'),
    (p_org_id, 'pulse_partner', 'Partner Activity', 'partner', 'strong', 85,
     'Partner activity trending positive.'),
    (p_org_id, 'pulse_operational', 'Operational Activity', 'operational', 'strong', 80,
     'Operations running smoothly with minor bottlenecks.'),
    (p_org_id, 'pulse_companion', 'Companion Activity', 'companion', 'strong', 91,
     'Companion actively coordinating headquarters activity.'),
    (p_org_id, 'pulse_overall', 'Organization Pulse', 'overall', 'strong', 79,
     'Overall organizational pulse strong — one area requires watch.');

  insert into public.organization_companion_headquarters_meetings (
    organization_id, meeting_key, meeting_title, meeting_status, readiness_score, required_actions, summary
  ) values
    (p_org_id, 'mtg_board', 'Board Meeting', 'preparing', 72,
     '["Q1 report","Revenue forecast","Risk summary"]'::jsonb,
     'Board meeting preparation in progress — Companion assisting.'),
    (p_org_id, 'mtg_leadership', 'Leadership Standup', 'ready', 95,
     '["Operations summary","Priority items"]'::jsonb,
     'Leadership standup ready — all materials prepared.'),
    (p_org_id, 'mtg_dept_review', 'Department Review', 'scheduled', 40,
     '["Department health reports"]'::jsonb,
     'Department review scheduled — preparation starting.');

  insert into public.organization_companion_headquarters_coordination (
    organization_id, coordination_key, coordination_title, coordination_type, coordination_status, departments, summary
  ) values
    (p_org_id, 'coord_launch', 'Product Launch Coordination', 'shared_project', 'active',
     '["sales","marketing","operations","support"]'::jsonb,
     'Cross-department product launch — shared project active.'),
    (p_org_id, 'coord_approval', 'Budget Approval Dependency', 'approval', 'blocked',
     '["finance","operations"]'::jsonb,
     'Budget approval blocking operations progress.'),
    (p_org_id, 'coord_resource', 'Engineering Resource Allocation', 'resource', 'active',
     '["operations","projects"]'::jsonb,
     'Resource allocation across operations and projects.');

  insert into public.organization_companion_headquarters_war_room (
    organization_id, war_room_key, war_room_title, event_type, war_room_status, team_members, summary
  ) values
    (p_org_id, 'wr_incident', 'Critical Incident Response', 'critical_incident', 'standby',
     '["CTO","Operations Director","Support Lead"]'::jsonb,
     'War room on standby — critical incident response ready.'),
    (p_org_id, 'wr_expansion', 'Market Expansion Command', 'expansion', 'monitoring',
     '["CEO","VP Sales","VP Operations"]'::jsonb,
     'Expansion war room monitoring — Sweden market entry.'),
    (p_org_id, 'wr_revenue', 'Revenue Crisis Response', 'revenue_crisis', 'standby',
     '["CFO","CEO","Finance Director"]'::jsonb,
     'Revenue crisis war room on standby.');

  insert into public.organization_companion_headquarters_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_org_health', 'Organization Health', 79, 'headquarters'),
    (p_org_id, 'metric_revenue_health', 'Revenue Health', 82, 'headquarters'),
    (p_org_id, 'metric_operational_health', 'Operational Health', 80, 'operations'),
    (p_org_id, 'metric_customer_health', 'Customer Health', 68, 'headquarters'),
    (p_org_id, 'metric_risk_health', 'Risk Health', 72, 'headquarters'),
    (p_org_id, 'metric_companion_health', 'Companion Health', 91, 'headquarters');
end; $$;

-- Center RPC and actions continue below

create or replace function public.get_organization_companion_headquarters_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_departments jsonb; v_live_activity jsonb;
  v_metrics jsonb; v_actions jsonb; v_alerts jsonb; v_pulse jsonb; v_meetings jsonb;
  v_coordination jsonb; v_war_room jsonb; v_operations jsonb; v_executive jsonb;
  v_reports jsonb; v_executive_dash jsonb; v_integrations jsonb; v_audit jsonb;
  v_companion jsonb;
begin
  v_org_id := public._cmhq571_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmhq571_ensure_settings(v_org_id);
  perform public._cmhq571_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'organization_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_org_health'), 79),
    'revenue_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_revenue_health'), 82),
    'operational_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_operational_health'), 80),
    'customer_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_customer_health'), 68),
    'partner_health', coalesce((select health_score from public.organization_companion_headquarters_departments where organization_id = v_org_id and department_type = 'partner_success'), 81),
    'risk_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_risk_health'), 72),
    'companion_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_companion_health'), 91),
    'live_status', 'operational',
    'active_alerts', (select count(*) from public.organization_companion_headquarters_alerts where organization_id = v_org_id and alert_status = 'active'),
    'pending_approvals', coalesce((select metric_value from public.organization_companion_headquarters_metrics where organization_id = v_org_id and metric_key = 'met_approvals'), 0),
    'organization_pulse', coalesce((select pulse_score from public.organization_companion_headquarters_pulse where organization_id = v_org_id and pulse_area = 'overall'), 79)
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'department_key', d.department_key, 'department_title', d.department_title, 'department_type', d.department_type,
    'department_status', d.department_status, 'health_score', d.health_score,
    'active_items', d.active_items, 'summary', d.summary
  ) order by d.department_title), '[]'::jsonb)
  into v_departments from public.organization_companion_headquarters_departments d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'activity_key', a.activity_key, 'activity_title', a.activity_title, 'activity_type', a.activity_type,
    'activity_status', a.activity_status, 'source_area', a.source_area, 'summary', a.summary
  ) order by case a.activity_status when 'critical' then 1 when 'attention' then 2 else 3 end), '[]'::jsonb)
  into v_live_activity from public.organization_companion_headquarters_live_activity a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'metric_key', m.metric_key, 'metric_title', m.metric_title, 'metric_area', m.metric_area,
    'metric_value', m.metric_value, 'metric_trend', m.metric_trend
  ) order by m.metric_title), '[]'::jsonb)
  into v_metrics from public.organization_companion_headquarters_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action_key', ac.action_key, 'action_title', ac.action_title, 'owner_name', ac.owner_name,
    'action_status', ac.action_status, 'deadline_label', ac.deadline_label,
    'dependencies', ac.dependencies, 'approval_required', ac.approval_required, 'summary', ac.summary
  ) order by ac.action_title), '[]'::jsonb)
  into v_actions from public.organization_companion_headquarters_actions ac where ac.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'alert_key', al.alert_key, 'alert_title', al.alert_title, 'alert_type', al.alert_type,
    'alert_status', al.alert_status, 'priority', al.priority, 'summary', al.summary
  ) order by case al.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_alerts from public.organization_companion_headquarters_alerts al where al.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pulse_key', p.pulse_key, 'pulse_area', p.pulse_area, 'pulse_status', p.pulse_status,
    'pulse_score', p.pulse_score, 'summary', p.summary
  ) order by p.pulse_score asc), '[]'::jsonb)
  into v_pulse from public.organization_companion_headquarters_pulse p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'meeting_key', mt.meeting_key, 'meeting_title', mt.meeting_title, 'meeting_status', mt.meeting_status,
    'readiness_score', mt.readiness_score, 'required_actions', mt.required_actions, 'summary', mt.summary
  ) order by mt.meeting_title), '[]'::jsonb)
  into v_meetings from public.organization_companion_headquarters_meetings mt where mt.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'coordination_key', c.coordination_key, 'coordination_title', c.coordination_title,
    'coordination_type', c.coordination_type, 'coordination_status', c.coordination_status,
    'departments', c.departments, 'summary', c.summary
  ) order by c.coordination_title), '[]'::jsonb)
  into v_coordination from public.organization_companion_headquarters_coordination c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'war_room_key', w.war_room_key, 'war_room_title', w.war_room_title, 'event_type', w.event_type,
    'war_room_status', w.war_room_status, 'team_members', w.team_members, 'summary', w.summary
  ) order by w.war_room_title), '[]'::jsonb)
  into v_war_room from public.organization_companion_headquarters_war_room w where w.organization_id = v_org_id;

  select jsonb_build_object(
    'active_projects', coalesce((select metric_value from public.organization_companion_headquarters_metrics where organization_id = v_org_id and metric_key = 'met_projects'), 0),
    'pending_tasks', coalesce((select metric_value from public.organization_companion_headquarters_metrics where organization_id = v_org_id and metric_key = 'met_tasks'), 0),
    'pending_approvals', coalesce((select metric_value from public.organization_companion_headquarters_metrics where organization_id = v_org_id and metric_key = 'met_approvals'), 0),
    'critical_issues', (select count(*) from public.organization_companion_headquarters_live_activity where organization_id = v_org_id and activity_status = 'critical'),
    'operational_risks', (select count(*) from public.organization_companion_headquarters_alerts where organization_id = v_org_id and alert_status = 'active'),
    'live_activity_feed', v_live_activity,
    'action_coordination_board', v_actions,
    'live_metrics', v_metrics
  ) into v_operations;

  select jsonb_build_object(
    'strategic_health', 74,
    'revenue_forecast', 'On track with variance watch',
    'market_changes', jsonb_build_array('Nordic expansion opportunity', 'Partner channel growth'),
    'major_risks', (select count(*) from public.organization_companion_headquarters_alerts where organization_id = v_org_id and priority in ('high', 'critical')),
    'executive_decisions', 4,
    'future_readiness', 74,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review support department health', 'reason', 'Customer activity elevated'),
      jsonb_build_object('title', 'Approve domain launch', 'reason', 'Blocking operations progress'),
      jsonb_build_object('title', 'Prepare board meeting materials', 'reason', 'Board meeting Friday')
    )
  ) into v_executive;

  select jsonb_build_object(
    'operations_director_prompts', jsonb_build_array(
      'What requires attention?', 'What changed this morning?', 'What department is overloaded?',
      'What approvals are blocking progress?', 'Generate operations summary.'
    ),
    'headquarters_assistant_prompts', jsonb_build_array(
      'Summarize operations', 'Show executive priorities', 'Review department health',
      'Prepare leadership update', 'Generate headquarters briefing'
    )
  ) into v_companion;

  select jsonb_build_object(
    'operational_reports', jsonb_build_object('departments', (select count(*) from public.organization_companion_headquarters_departments where organization_id = v_org_id)),
    'activity_reports', jsonb_build_object('live_events', (select count(*) from public.organization_companion_headquarters_live_activity where organization_id = v_org_id)),
    'health_reports', v_pulse,
    'coordination_reports', v_coordination,
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Activate support department review', 'reason', 'Health score dropped'),
      jsonb_build_object('title', 'Unblock domain launch approval', 'reason', 'Cross-department dependency'),
      jsonb_build_object('title', 'Monitor organizational pulse', 'reason', 'Customer activity slowing pulse')
    )
  ) into v_reports;

  select jsonb_build_object(
    'organization_pulse', coalesce((select pulse_score from public.organization_companion_headquarters_pulse where organization_id = v_org_id and pulse_area = 'overall'), 79),
    'executive_priorities', 3,
    'operational_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_operational_health'), 80),
    'strategic_health', 74,
    'revenue_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_revenue_health'), 82),
    'companion_recommendations', 3
  ) into v_executive_dash;

  select jsonb_build_object(
    'activity_feed_integration', jsonb_build_object('phase', '538', 'route', '/app/activity'),
    'executive_copilot_integration', jsonb_build_object('phase', '570', 'route', '/app/executive-copilot'),
    'resilience_integration', jsonb_build_object('phase', '567', 'route', '/app/resilience'),
    'proactive_integration', jsonb_build_object('phase', '568', 'route', '/app/proactive'),
    'autopilot_integration', jsonb_build_object('phase', '569', 'route', '/app/autopilot'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Financial events',
      'support_pack', 'Customer activity',
      'warehouse_pack', 'Inventory activity',
      'partner_pack', 'Partner activity',
      'route', '/app/settings/modules'
    )
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_headquarters_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations need headquarters — one place to understand what is happening, what requires attention, who is responsible, and what comes next.',
    'philosophy', 'Not a dashboard. Not a report page. A living operational headquarters where Companion coordinates everything.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'departments', v_departments,
    'live_activity', v_live_activity,
    'live_activity_feed', v_live_activity,
    'metrics', v_metrics,
    'live_metrics', v_metrics,
    'actions', v_actions,
    'action_coordination_board', v_actions,
    'alerts', v_alerts,
    'pulse', v_pulse,
    'organizational_pulse', v_pulse,
    'meetings', v_meetings,
    'meeting_command_center', v_meetings,
    'coordination', v_coordination,
    'cross_department_coordination', v_coordination,
    'war_room', v_war_room,
    'operations_room', v_operations,
    'executive_room', v_executive,
    'companion', v_companion,
    'reports', v_reports,
    'executive_dashboard', v_executive_dash,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'headquarters', '/app/headquarters',
      'operations', '/app/headquarters/operations',
      'executive', '/app/headquarters/executive',
      'war_room', '/app/headquarters/war-room',
      'activity_feed', '/app/activity',
      'executive_copilot', '/app/executive-copilot'
    ),
    'notifications', jsonb_build_object(
      'critical_issue_detected', true, 'executive_review_required', true,
      'department_health_changed', true, 'operational_pulse_changed', true,
      'war_room_activated', true, 'companion_alert_generated', true
    ),
    'mobile_access', jsonb_build_object(
      'access_headquarters', true, 'review_operations', true,
      'review_executive_room', true, 'coordinate_actions', true, 'review_alerts', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_headquarters_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_war_room_key text := coalesce(p_payload->>'war_room_key', '');
  v_action_key text := coalesce(p_payload->>'action_key', '');
  v_alert_key text := coalesce(p_payload->>'alert_key', '');
begin
  v_org_id := public._cmhq571_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_headquarters' then
    perform public._cmhq571_log(v_org_id, 'headquarters_refreshed', 'Headquarters center refreshed', p_payload, 'headquarters');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'activate_war_room' and v_war_room_key <> '' then
    update public.organization_companion_headquarters_war_room
    set war_room_status = 'active' where organization_id = v_org_id and war_room_key = v_war_room_key;
    perform public._cmhq571_log(v_org_id, 'war_room_activated', 'War room activated', p_payload, 'war_room');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'assign_action' and v_action_key <> '' then
    update public.organization_companion_headquarters_actions
    set action_status = 'in_progress', owner_name = coalesce(p_payload->>'owner_name', owner_name)
    where organization_id = v_org_id and action_key = v_action_key;
    perform public._cmhq571_log(v_org_id, 'action_assigned', 'Action assigned', p_payload, 'operations');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'acknowledge_alert' and v_alert_key <> '' then
    update public.organization_companion_headquarters_alerts
    set alert_status = 'acknowledged' where organization_id = v_org_id and alert_key = v_alert_key;
    perform public._cmhq571_log(v_org_id, 'alert_acknowledged', 'Alert acknowledged', p_payload, 'headquarters');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_briefing' then
    perform public._cmhq571_log(v_org_id, 'headquarters_briefing_generated', 'Headquarters briefing generated', p_payload, 'headquarters');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_pulse' then
    perform public._cmhq571_log(v_org_id, 'pulse_updated', 'Organizational pulse updated', p_payload, 'pulse');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_headquarters_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmhq571_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_headquarters_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/headquarters');
end; $$;

create or replace function public.get_assistant_companion_headquarters_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmhq571_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion is the operational presence — summarize operations, show priorities, coordinate headquarters activity.',
    'advisor_prompts', jsonb_build_array(
      'What requires attention?', 'What changed this morning?', 'What department is overloaded?',
      'Summarize operations', 'Generate headquarters briefing'
    ),
    'organization_health', coalesce((select metric_value from public.organization_companion_headquarters_analytics where organization_id = v_org_id and metric_key = 'metric_org_health'), 79),
    'active_alerts', (select count(*) from public.organization_companion_headquarters_alerts where organization_id = v_org_id and alert_status = 'active'),
    'organization_pulse', coalesce((select pulse_score from public.organization_companion_headquarters_pulse where organization_id = v_org_id and pulse_area = 'overall'), 79),
    'route', '/app/headquarters'
  );
end; $$;

grant execute on function public.get_organization_companion_headquarters_center(text) to authenticated;
grant execute on function public.perform_organization_companion_headquarters_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_headquarters_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_headquarters_advisor_context() to authenticated;
