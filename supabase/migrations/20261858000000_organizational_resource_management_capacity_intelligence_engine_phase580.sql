-- Phase 580 — Organizational Resource Management, Capacity Intelligence & Workload Balancing Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/resource-center
-- Helpers: _cmrc580_*

create table if not exists public.organization_companion_resource_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  resource_center_enabled boolean not null default true,
  capacity_engine_enabled boolean not null default true,
  workload_intelligence_enabled boolean not null default true,
  overload_detection_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_resource_settings enable row level security;
revoke all on public.organization_companion_resource_settings from authenticated, anon;

create table if not exists public.organization_companion_resource_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  resource_key text not null,
  resource_name text not null,
  resource_type text not null check (
    resource_type in (
      'employee', 'team', 'department', 'partner', 'contractor',
      'vendor', 'specialist', 'asset'
    )
  ),
  department text not null default '',
  owner_name text not null default '',
  skills jsonb not null default '[]'::jsonb,
  availability_status text not null default 'available' check (
    availability_status in ('available', 'partial', 'unavailable', 'idle')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, resource_key)
);

alter table public.organization_companion_resource_registry enable row level security;
revoke all on public.organization_companion_resource_registry from authenticated, anon;

create table if not exists public.organization_companion_resource_capacity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capacity_key text not null,
  resource_key text not null,
  resource_name text not null default '',
  available_capacity_pct integer not null default 0 check (available_capacity_pct between 0 and 100),
  allocated_capacity_pct integer not null default 0 check (allocated_capacity_pct between 0 and 150),
  remaining_capacity_pct integer not null default 0 check (remaining_capacity_pct between -50 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'at_risk', 'overloaded', 'underutilized')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, capacity_key)
);

alter table public.organization_companion_resource_capacity enable row level security;
revoke all on public.organization_companion_resource_capacity from authenticated, anon;

create table if not exists public.organization_companion_resource_workloads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workload_key text not null,
  resource_key text not null default '',
  workload_title text not null,
  workload_type text not null check (
    workload_type in ('task', 'project', 'approval', 'support', 'meeting', 'business_pack', 'custom')
  ),
  workload_pct integer not null default 0 check (workload_pct between 0 and 150),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workload_key)
);

alter table public.organization_companion_resource_workloads enable row level security;
revoke all on public.organization_companion_resource_workloads from authenticated, anon;

create table if not exists public.organization_companion_resource_overloads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  overload_key text not null,
  resource_key text not null default '',
  overload_title text not null,
  overload_type text not null check (
    overload_type in ('employee', 'team', 'department', 'project')
  ),
  overload_pct integer not null default 100,
  overload_status text not null default 'open' check (
    overload_status in ('open', 'mitigating', 'resolved')
  ),
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, overload_key)
);

alter table public.organization_companion_resource_overloads enable row level security;
revoke all on public.organization_companion_resource_overloads from authenticated, anon;

create table if not exists public.organization_companion_resource_underutilization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  underutil_key text not null,
  resource_key text not null default '',
  underutil_title text not null,
  utilization_pct integer not null default 0 check (utilization_pct between 0 and 100),
  opportunity text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, underutil_key)
);

alter table public.organization_companion_resource_underutilization enable row level security;
revoke all on public.organization_companion_resource_underutilization from authenticated, anon;

create table if not exists public.organization_companion_resource_allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  allocation_key text not null,
  resource_key text not null,
  assignment_title text not null,
  owner_name text not null default '',
  skills_required jsonb not null default '[]'::jsonb,
  priority text not null default 'moderate',
  allocation_status text not null default 'active' check (
    allocation_status in ('active', 'pending', 'completed', 'released')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, allocation_key)
);

alter table public.organization_companion_resource_allocations enable row level security;
revoke all on public.organization_companion_resource_allocations from authenticated, anon;

create table if not exists public.organization_companion_resource_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_key text not null,
  forecast_horizon text not null check (
    forecast_horizon in ('30_days', '90_days', '6_months', '12_months')
  ),
  forecast_title text not null,
  expected_demand_pct integer not null default 0,
  forecast_capacity_pct integer not null default 0,
  shortage_pct integer not null default 0,
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, forecast_key)
);

alter table public.organization_companion_resource_forecasts enable row level security;
revoke all on public.organization_companion_resource_forecasts from authenticated, anon;

create table if not exists public.organization_companion_resource_skill_matches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  match_key text not null,
  project_need text not null,
  skill_required text not null default '',
  matched_resource text not null default '',
  match_score integer not null default 0 check (match_score between 0 and 100),
  expertise_route text not null default '/app/expertise',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, match_key)
);

alter table public.organization_companion_resource_skill_matches enable row level security;
revoke all on public.organization_companion_resource_skill_matches from authenticated, anon;

create table if not exists public.organization_companion_resource_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  project_key text not null,
  project_title text not null,
  assigned_resources jsonb not null default '[]'::jsonb,
  capacity_consumption_pct integer not null default 0,
  forecasted_demand_pct integer not null default 0,
  delivery_risk text not null default 'low' check (
    delivery_risk in ('low', 'moderate', 'high', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, project_key)
);

alter table public.organization_companion_resource_projects enable row level security;
revoke all on public.organization_companion_resource_projects from authenticated, anon;

create table if not exists public.organization_companion_resource_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  capacity_data jsonb not null default '[]'::jsonb,
  resource_data jsonb not null default '[]'::jsonb,
  forecast_data jsonb not null default '[]'::jsonb,
  workload_data jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_resource_business_packs enable row level security;
revoke all on public.organization_companion_resource_business_packs from authenticated, anon;

create table if not exists public.organization_companion_resource_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'resource',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_companion_resource_audit_logs enable row level security;
revoke all on public.organization_companion_resource_audit_logs from authenticated, anon;

create or replace function public._cmrc580_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmrc580_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'resource'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_resource_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'resource'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmrc580_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_resource_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmrc580_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_resource_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_resource_registry (
    organization_id, resource_key, resource_name, resource_type, department, owner_name, skills, availability_status, summary
  ) values
    (p_org_id, 'res_support_team', 'Support Team', 'team', 'Support', 'Support Lead',
     '["Support","Escalation","Knowledge"]'::jsonb, 'partial', 'Support team — visible in resource registry.'),
    (p_org_id, 'res_finance_team', 'Finance Team', 'team', 'Finance', 'CFO',
     '["Finance","Approvals","Reporting"]'::jsonb, 'available', 'Finance team capacity tracked.'),
    (p_org_id, 'res_ops_team', 'Operations Team', 'team', 'Operations', 'COO',
     '["Operations","Logistics"]'::jsonb, 'available', 'Operations team — underutilization opportunity.'),
    (p_org_id, 'res_specialist', 'Support Specialist', 'specialist', 'Support', 'Support Lead',
     '["Support Expertise","Training"]'::jsonb, 'available', 'Specialist connected to Know-Who Engine.'),
    (p_org_id, 'res_contractor', 'Implementation Contractor', 'contractor', 'Projects', 'PMO Lead',
     '["Integration","Deployment"]'::jsonb, 'partial', 'Contractor resource with partial availability.'),
    (p_org_id, 'res_asset', 'Training Room Asset', 'asset', 'HR', 'HR Lead',
     '[]'::jsonb, 'idle', 'Unused asset — optimization opportunity.');

  insert into public.organization_companion_resource_capacity (
    organization_id, capacity_key, resource_key, resource_name,
    available_capacity_pct, allocated_capacity_pct, remaining_capacity_pct, health_status, summary
  ) values
    (p_org_id, 'cap_support', 'res_support_team', 'Support Team', 0, 120, -20, 'overloaded',
     'Support Team 120% allocated → Alert generated → Recommendation created.'),
    (p_org_id, 'cap_finance', 'res_finance_team', 'Finance Team', 25, 75, 25, 'healthy',
     'Employee 80% allocated → 20% available.'),
    (p_org_id, 'cap_ops', 'res_ops_team', 'Operations Team', 60, 40, 60, 'underutilized',
     'Operations Team 40% utilization → Optimization opportunity.'),
    (p_org_id, 'cap_specialist', 'res_specialist', 'Support Specialist', 35, 65, 35, 'healthy',
     'Specialist with remaining capacity for project assignment.');

  insert into public.organization_companion_resource_workloads (
    organization_id, workload_key, resource_key, workload_title, workload_type, workload_pct, priority, summary
  ) values
    (p_org_id, 'wl_tickets', 'res_support_team', 'Support ticket queue', 'support', 45, 'high',
     'Workload intelligence — support load pattern identified.'),
    (p_org_id, 'wl_approvals', 'res_finance_team', 'Pending invoice approvals', 'approval', 30, 'high',
     'Approval workload consuming finance capacity.'),
    (p_org_id, 'wl_project', 'res_contractor', 'Platform integration project', 'project', 50, 'moderate',
     'Project workload on contractor resource.'),
    (p_org_id, 'wl_meetings', 'res_support_team', 'Weekly standups', 'meeting', 15, 'low',
     'Meeting load contributing to team capacity.');

  insert into public.organization_companion_resource_overloads (
    organization_id, overload_key, resource_key, overload_title, overload_type, overload_pct, overload_status, recommendation, summary
  ) values
    (p_org_id, 'ov_support', 'res_support_team', 'Support Team Overload', 'team', 120, 'open',
     'Redistribute tickets and assign backup specialist from Know-Who Engine.',
     'Support Team 120% capacity → Alert → Recommendation.');

  insert into public.organization_companion_resource_underutilization (
    organization_id, underutil_key, resource_key, underutil_title, utilization_pct, opportunity, summary
  ) values
    (p_org_id, 'un_ops', 'res_ops_team', 'Operations Team Underutilized', 40,
     'Assign operational improvement project from Execution Center backlog.',
     'Available expertise and unused capacity identified.'),
    (p_org_id, 'un_asset', 'res_asset', 'Training Room Idle', 0,
     'Schedule cross-team training sessions to improve asset utilization.',
     'Unused asset — idle resource detected.');

  insert into public.organization_companion_resource_allocations (
    organization_id, allocation_key, resource_key, assignment_title, owner_name, skills_required, priority, allocation_status, summary
  ) values
    (p_org_id, 'alloc_escalation', 'res_specialist', 'Escalation procedure documentation', 'Support Lead',
     '["Support Expertise"]'::jsonb, 'high', 'active',
     'Match work to available resources — skill-based assignment.'),
    (p_org_id, 'alloc_integration', 'res_contractor', 'Platform integration phase 2', 'PMO Lead',
     '["Integration"]'::jsonb, 'moderate', 'pending',
     'Resource allocation engine — ownership and availability tracked.');

  insert into public.organization_companion_resource_forecasts (
    organization_id, forecast_key, forecast_horizon, forecast_title, expected_demand_pct, forecast_capacity_pct, shortage_pct, recommendation, summary
  ) values
    (p_org_id, 'fc_30d', '30_days', '30-day support demand forecast', 110, 100, 10,
     'Consider temporary contractor for support peak.',
     'Expected demand → capacity shortage → hiring recommendation.'),
    (p_org_id, 'fc_90d', '90_days', '90-day project pipeline forecast', 95, 85, 10,
     'Cross-train finance team member for project support.',
     '90-day forecast — moderate shortage projected.'),
    (p_org_id, 'fc_6m', '6_months', '6-month growth capacity forecast', 130, 100, 30,
     'Plan hiring for support and project delivery roles.',
     '6-month forecast — significant capacity gap.'),
    (p_org_id, 'fc_12m', '12_months', '12-month organizational capacity forecast', 150, 110, 40,
     'Executive review recommended for headcount planning.',
     '12-month forecast — strategic capacity planning needed.');

  insert into public.organization_companion_resource_skill_matches (
    organization_id, match_key, project_need, skill_required, matched_resource, match_score, summary
  ) values
    (p_org_id, 'sk_support', 'Project needs Support Expertise', 'Support Expertise', 'Support Specialist', 88,
     'Phase 572 Know-Who integration — available specialists identified.'),
    (p_org_id, 'sk_finance', 'Project needs Finance approval expertise', 'Finance', 'Finance Team', 72,
     'Skill-based resource matching — Companion recommends resources.');

  insert into public.organization_companion_resource_projects (
    organization_id, project_key, project_title, assigned_resources, capacity_consumption_pct, forecasted_demand_pct, delivery_risk, summary
  ) values
    (p_org_id, 'proj_integration', 'Platform Integration', '["Implementation Contractor","Support Specialist"]'::jsonb,
     65, 80, 'moderate', 'Project capacity management — realistic planning.'),
    (p_org_id, 'proj_onboard', 'Customer Onboarding Scale-up', '["Support Team","Operations Team"]'::jsonb,
     90, 110, 'high', 'Delivery risk elevated due to support overload.');

  insert into public.organization_companion_resource_business_packs (
    organization_id, pack_key, pack_title, capacity_data, resource_data, forecast_data, workload_data, summary
  ) values
    (p_org_id, 'finance', 'Finance Pack',
     '["75% allocated"]'::jsonb, '["Finance Team"]'::jsonb, '["90-day forecast"]'::jsonb, '["Invoice approvals"]'::jsonb,
     'Finance Pack → Finance Capacity.'),
    (p_org_id, 'support', 'Support Pack',
     '["120% overloaded"]'::jsonb, '["Support Team","Support Specialist"]'::jsonb, '["30-day demand spike"]'::jsonb, '["Ticket queue"]'::jsonb,
     'Support Pack → Support Capacity.'),
    (p_org_id, 'warehouse', 'Warehouse Pack',
     '["40% underutilized"]'::jsonb, '["Operations Team"]'::jsonb, '["6-month forecast"]'::jsonb, '["Operational tasks"]'::jsonb,
     'Warehouse Pack → Operational Capacity.');
end; $$;

create or replace function public.get_organization_companion_resource_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_registry jsonb; v_capacity jsonb;
  v_workloads jsonb; v_overloads jsonb; v_underutil jsonb; v_allocations jsonb;
  v_forecasts jsonb; v_matches jsonb; v_projects jsonb; v_packs jsonb;
  v_executive jsonb; v_companion jsonb; v_reports jsonb; v_audit jsonb; v_teams jsonb;
begin
  v_org_id := public._cmrc580_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmrc580_ensure_settings(v_org_id);
  perform public._cmrc580_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'total_resources', (select count(*) from public.organization_companion_resource_registry where organization_id = v_org_id),
    'overloaded_resources', (select count(*) from public.organization_companion_resource_capacity where organization_id = v_org_id and health_status = 'overloaded'),
    'underutilized_resources', (select count(*) from public.organization_companion_resource_capacity where organization_id = v_org_id and health_status = 'underutilized'),
    'open_overloads', (select count(*) from public.organization_companion_resource_overloads where organization_id = v_org_id and overload_status = 'open'),
    'avg_utilization', coalesce((
      select round(avg(allocated_capacity_pct)) from public.organization_companion_resource_capacity where organization_id = v_org_id
    ), 0),
    'available_capacity_pct', coalesce((
      select round(avg(remaining_capacity_pct)) from public.organization_companion_resource_capacity where organization_id = v_org_id
    ), 0),
    'forecast_shortages', (select count(*) from public.organization_companion_resource_forecasts where organization_id = v_org_id and shortage_pct > 0),
    'active_allocations', (select count(*) from public.organization_companion_resource_allocations where organization_id = v_org_id and allocation_status = 'active'),
    'high_risk_projects', (select count(*) from public.organization_companion_resource_projects where organization_id = v_org_id and delivery_risk in ('high', 'critical'))
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'resource_key', r.resource_key, 'resource_name', r.resource_name, 'resource_type', r.resource_type,
    'department', r.department, 'owner_name', r.owner_name, 'skills', r.skills,
    'availability_status', r.availability_status, 'summary', r.summary
  ) order by r.resource_name), '[]'::jsonb)
  into v_registry from public.organization_companion_resource_registry r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'capacity_key', c.capacity_key, 'resource_key', c.resource_key, 'resource_name', c.resource_name,
    'available_capacity_pct', c.available_capacity_pct, 'allocated_capacity_pct', c.allocated_capacity_pct,
    'remaining_capacity_pct', c.remaining_capacity_pct, 'health_status', c.health_status, 'summary', c.summary
  ) order by c.allocated_capacity_pct desc), '[]'::jsonb)
  into v_capacity from public.organization_companion_resource_capacity c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'workload_key', w.workload_key, 'resource_key', w.resource_key, 'workload_title', w.workload_title,
    'workload_type', w.workload_type, 'workload_pct', w.workload_pct, 'priority', w.priority, 'summary', w.summary
  ) order by w.workload_pct desc), '[]'::jsonb)
  into v_workloads from public.organization_companion_resource_workloads w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'overload_key', o.overload_key, 'resource_key', o.resource_key, 'overload_title', o.overload_title,
    'overload_type', o.overload_type, 'overload_pct', o.overload_pct, 'overload_status', o.overload_status,
    'recommendation', o.recommendation, 'summary', o.summary
  ) order by o.overload_pct desc), '[]'::jsonb)
  into v_overloads from public.organization_companion_resource_overloads o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'underutil_key', u.underutil_key, 'resource_key', u.resource_key, 'underutil_title', u.underutil_title,
    'utilization_pct', u.utilization_pct, 'opportunity', u.opportunity, 'summary', u.summary
  ) order by u.utilization_pct), '[]'::jsonb)
  into v_underutil from public.organization_companion_resource_underutilization u where u.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'allocation_key', a.allocation_key, 'resource_key', a.resource_key, 'assignment_title', a.assignment_title,
    'owner_name', a.owner_name, 'skills_required', a.skills_required, 'priority', a.priority,
    'allocation_status', a.allocation_status, 'summary', a.summary
  ) order by a.assignment_title), '[]'::jsonb)
  into v_allocations from public.organization_companion_resource_allocations a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'forecast_key', f.forecast_key, 'forecast_horizon', f.forecast_horizon, 'forecast_title', f.forecast_title,
    'expected_demand_pct', f.expected_demand_pct, 'forecast_capacity_pct', f.forecast_capacity_pct,
    'shortage_pct', f.shortage_pct, 'recommendation', f.recommendation, 'summary', f.summary
  ) order by case f.forecast_horizon when '30_days' then 1 when '90_days' then 2 when '6_months' then 3 else 4 end), '[]'::jsonb)
  into v_forecasts from public.organization_companion_resource_forecasts f where f.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'match_key', m.match_key, 'project_need', m.project_need, 'skill_required', m.skill_required,
    'matched_resource', m.matched_resource, 'match_score', m.match_score,
    'expertise_route', m.expertise_route, 'summary', m.summary
  ) order by m.match_score desc), '[]'::jsonb)
  into v_matches from public.organization_companion_resource_skill_matches m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'project_key', p.project_key, 'project_title', p.project_title, 'assigned_resources', p.assigned_resources,
    'capacity_consumption_pct', p.capacity_consumption_pct, 'forecasted_demand_pct', p.forecasted_demand_pct,
    'delivery_risk', p.delivery_risk, 'summary', p.summary
  ) order by p.capacity_consumption_pct desc), '[]'::jsonb)
  into v_projects from public.organization_companion_resource_projects p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'pack_key', bp.pack_key, 'pack_title', bp.pack_title,
    'capacity_data', bp.capacity_data, 'resource_data', bp.resource_data,
    'forecast_data', bp.forecast_data, 'workload_data', bp.workload_data, 'summary', bp.summary
  ) order by bp.pack_title), '[]'::jsonb)
  into v_packs from public.organization_companion_resource_business_packs bp where bp.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'resource_key', r.resource_key, 'resource_name', r.resource_name, 'department', r.department,
    'availability_status', r.availability_status
  ) order by r.resource_name), '[]'::jsonb)
  into v_teams
  from public.organization_companion_resource_registry r
  where r.organization_id = v_org_id and r.resource_type in ('team', 'department');

  select jsonb_build_object(
    'capacity_health', v_overview,
    'resource_risks', v_overloads,
    'team_utilization', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('team', resource_name, 'allocated_pct', allocated_capacity_pct, 'health', health_status) as x
      from public.organization_companion_resource_capacity where organization_id = v_org_id
    ) t),
    'forecast_shortages', (select coalesce(jsonb_agg(x), '[]'::jsonb) from (
      select jsonb_build_object('horizon', forecast_horizon, 'shortage_pct', shortage_pct, 'recommendation', recommendation) as x
      from public.organization_companion_resource_forecasts where organization_id = v_org_id and shortage_pct > 0
    ) t),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Redistribute support workload', 'reason', 'Support Team at 120% capacity'),
      jsonb_build_object('title', 'Assign ops team to improvement project', 'reason', 'Operations at 40% utilization'),
      jsonb_build_object('title', 'Plan Q3 hiring for support roles', 'reason', '6-month forecast shows 30% shortage')
    )
  ) into v_executive;

  select jsonb_build_object(
    'resource_advisor_prompts', jsonb_build_array(
      'Who has capacity?', 'Which teams are overloaded?', 'Who should own this project?',
      'Where are resource risks?', 'Generate capacity report.'
    )
  ) into v_companion;

  select jsonb_build_object(
    'executive_dashboard', v_executive,
    'overload_detection', v_overloads,
    'underutilization_detection', v_underutil,
    'project_capacity', v_projects,
    'skill_matching', v_matches
  ) into v_reports;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_resource_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Most operational problems are not caused by lack of work. They are caused by lack of visibility into capacity.',
    'philosophy', 'One Resource Center. One Capacity Intelligence Engine. One Workload Management Framework.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'registry', v_registry,
    'capacity', v_capacity,
    'teams', v_teams,
    'workloads', v_workloads,
    'allocations', v_allocations,
    'forecasts', v_forecasts,
    'availability', (select coalesce(jsonb_agg(jsonb_build_object(
      'resource_key', r.resource_key, 'resource_name', r.resource_name,
      'availability_status', r.availability_status, 'remaining_capacity_pct', c.remaining_capacity_pct
    ) order by c.remaining_capacity_pct desc), '[]'::jsonb)
    from public.organization_companion_resource_registry r
    join public.organization_companion_resource_capacity c on c.resource_key = r.resource_key and c.organization_id = r.organization_id
    where r.organization_id = v_org_id),
    'overloads', v_overloads,
    'underutilization', v_underutil,
    'skill_matches', v_matches,
    'projects', v_projects,
    'business_packs', v_packs,
    'executive_dashboard', v_executive,
    'recommendations', (v_executive->'companion_recommendations'),
    'companion', v_companion,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'resource_center', '/app/resource-center',
      'expertise_center', '/app/expertise',
      'execution_center', '/app/execution-center',
      'workflow_center', '/app/workflow-center'
    ),
    'mobile_access', jsonb_build_object(
      'review_capacity', true, 'review_workloads', true,
      'review_allocations', true, 'review_forecasts', true, 'generate_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_resource_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_allocation_key text := coalesce(p_payload->>'allocation_key', '');
begin
  v_org_id := public._cmrc580_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'refresh_resources' then
    perform public._cmrc580_log(v_org_id, 'resources_refreshed', 'Resource center refreshed', p_payload, 'resource');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_resource' then
    perform public._cmrc580_log(v_org_id, 'resource_added', 'Resource added', p_payload, 'resource');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_allocation' and v_allocation_key <> '' then
    perform public._cmrc580_log(v_org_id, 'allocation_updated', 'Allocation updated', p_payload, 'allocation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'change_assignment' then
    perform public._cmrc580_log(v_org_id, 'assignment_changed', 'Assignment changed', p_payload, 'allocation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_capacity_forecast' then
    perform public._cmrc580_log(v_org_id, 'capacity_forecast_generated', 'Capacity forecast generated', p_payload, 'forecast');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'detect_overload' then
    perform public._cmrc580_log(v_org_id, 'overload_detected', 'Overload detected', p_payload, 'capacity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_recommendation' then
    perform public._cmrc580_log(v_org_id, 'recommendation_generated', 'Recommendation generated', p_payload, 'resource');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_resource_report' then
    perform public._cmrc580_log(v_org_id, 'resource_report_generated', 'Resource report generated', p_payload, 'resource');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_resource_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmrc580_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_resource_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/resource-center');
end; $$;

create or replace function public.get_assistant_companion_resource_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmrc580_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations understand capacity before problems occur.',
    'advisor_prompts', jsonb_build_array(
      'Who has capacity?', 'Which teams are overloaded?', 'Where are resource risks?',
      'Generate capacity report.'
    ),
    'overloaded_resources', (select count(*) from public.organization_companion_resource_capacity where organization_id = v_org_id and health_status = 'overloaded'),
    'open_overloads', (select count(*) from public.organization_companion_resource_overloads where organization_id = v_org_id and overload_status = 'open'),
    'expertise_route', '/app/expertise',
    'route', '/app/resource-center'
  );
end; $$;

grant execute on function public.get_organization_companion_resource_center(text) to authenticated;
grant execute on function public.perform_organization_companion_resource_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_resource_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_resource_advisor_context() to authenticated;
