-- Phase 511 — Organization Management & Company Structure Engine
-- APP owns the organization · Departments organize work · Teams organize people
-- Extends: Employee Management (503), Departments, Domains (505A), Business Packs (502)

-- ---------------------------------------------------------------------------
-- 1. Extend departments & employees
-- ---------------------------------------------------------------------------
alter table public.organization_departments
  add column if not exists cost_center text,
  add column if not exists division text,
  add column if not exists region text,
  add column if not exists business_unit text,
  add column if not exists visibility text not null default 'organization',
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$ begin
  alter table public.organization_departments
    add constraint organization_departments_visibility_check
    check (visibility in ('organization', 'department', 'managers_only'));
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- 2. Teams & locations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid not null references public.organization_departments (id) on delete cascade,
  team_key text not null,
  name text not null,
  description text not null default '',
  manager_user_id uuid references public.users (id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, department_id, team_key)
);

create index if not exists organization_teams_dept_idx
  on public.organization_teams (organization_id, department_id, is_active);

alter table public.organization_teams enable row level security;
revoke all on public.organization_teams from authenticated, anon;

create table if not exists public.organization_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  location_key text not null,
  name text not null,
  location_type text not null default 'office' check (
    location_type in ('office', 'remote', 'international', 'hybrid')
  ),
  city text,
  country text,
  timezone text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, location_key)
);

create index if not exists organization_locations_org_idx
  on public.organization_locations (organization_id, is_active);

alter table public.organization_locations enable row level security;
revoke all on public.organization_locations from authenticated, anon;

alter table public.organization_employee_profiles
  add column if not exists team_id uuid references public.organization_teams (id) on delete set null,
  add column if not exists location_id uuid references public.organization_locations (id) on delete set null;

create index if not exists organization_employee_profiles_team_idx
  on public.organization_employee_profiles (organization_id, team_id);

-- ---------------------------------------------------------------------------
-- 3. Assignments & structure
-- ---------------------------------------------------------------------------
create table if not exists public.organization_department_domains (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid not null references public.organization_departments (id) on delete cascade,
  domain_id uuid not null references public.organization_domains (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, department_id, domain_id)
);

alter table public.organization_department_domains enable row level security;
revoke all on public.organization_department_domains from authenticated, anon;

create table if not exists public.organization_department_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid not null references public.organization_departments (id) on delete cascade,
  module_key text not null,
  created_at timestamptz not null default now(),
  unique (organization_id, department_id, module_key)
);

alter table public.organization_department_modules enable row level security;
revoke all on public.organization_department_modules from authenticated, anon;

create table if not exists public.organization_department_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid not null references public.organization_departments (id) on delete cascade,
  pack_key text not null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (organization_id, department_id, pack_key, domain_id)
);

alter table public.organization_department_business_packs enable row level security;
revoke all on public.organization_department_business_packs from authenticated, anon;

create table if not exists public.organization_department_managers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_id uuid not null references public.organization_departments (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  manager_role text not null default 'manager' check (
    manager_role in ('manager', 'approver', 'deputy')
  ),
  created_at timestamptz not null default now(),
  unique (organization_id, department_id, user_id, manager_role)
);

alter table public.organization_department_managers enable row level security;
revoke all on public.organization_department_managers from authenticated, anon;

create table if not exists public.organization_team_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  team_id uuid not null references public.organization_teams (id) on delete cascade,
  employee_profile_id uuid not null references public.organization_employee_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, team_id, employee_profile_id)
);

alter table public.organization_team_members enable row level security;
revoke all on public.organization_team_members from authenticated, anon;

create table if not exists public.organization_custom_field_definitions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  field_key text not null,
  label text not null,
  field_type text not null default 'text' check (
    field_type in ('text', 'number', 'date', 'reference', 'json')
  ),
  applies_to text not null default 'employee' check (
    applies_to in ('employee', 'department', 'team', 'organization')
  ),
  is_required boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (organization_id, field_key, applies_to)
);

alter table public.organization_custom_field_definitions enable row level security;
revoke all on public.organization_custom_field_definitions from authenticated, anon;

create table if not exists public.organization_policies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  policy_key text not null,
  title text not null,
  body text not null default '',
  scope text not null default 'organization' check (
    scope in ('organization', 'department', 'team')
  ),
  department_id uuid references public.organization_departments (id) on delete cascade,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, policy_key)
);

alter table public.organization_policies enable row level security;
revoke all on public.organization_policies from authenticated, anon;

create table if not exists public.organization_structure_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  structure_mode text not null default 'flexible' check (
    structure_mode in ('simple', 'flexible', 'enterprise')
  ),
  chart_root_label text not null default 'Organization',
  enable_cross_department_collaboration boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.organization_structure_settings enable row level security;
revoke all on public.organization_structure_settings from authenticated, anon;

create table if not exists public.organization_structure_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists org_structure_audit_org_idx
  on public.organization_structure_audit_logs (organization_id, created_at desc);

alter table public.organization_structure_audit_logs enable row level security;
revoke all on public.organization_structure_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._org511_log(
  p_org_id uuid, p_action text, p_summary text,
  p_entity_type text default null, p_entity_id uuid default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_structure_audit_logs (
    organization_id, actor_user_id, action, entity_type, entity_id, summary, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_entity_type, p_entity_id, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._org511_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._org511_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_structure_settings (organization_id)
  values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._org511_seed_locations(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_locations (organization_id, location_key, name, location_type, city, country)
  select p_org_id, v.key, v.name, v.ltype, v.city, v.country
  from (values
    ('bergen', 'Bergen', 'office', 'Bergen', 'Norway'),
    ('oslo', 'Oslo', 'office', 'Oslo', 'Norway'),
    ('stockholm', 'Stockholm', 'international', 'Stockholm', 'Sweden'),
    ('copenhagen', 'Copenhagen', 'international', 'Copenhagen', 'Denmark'),
    ('remote', 'Remote', 'remote', null, null)
  ) as v(key, name, ltype, city, country)
  on conflict (organization_id, location_key) do nothing;
end; $$;

create or replace function public._org511_seed_departments(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._emae503_seed_departments(p_org_id);
  insert into public.organization_departments (organization_id, department_key, name, sort_order)
  select p_org_id, v.key, v.name, v.ord
  from (values
    ('it', 'IT', 95),
    ('commerce', 'Commerce', 55)
  ) as v(key, name, ord)
  on conflict (organization_id, department_key) do nothing;
end; $$;

create or replace function public._org511_department_metrics(p_org_id uuid, p_dept_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_employees int;
  v_teams int;
  v_tasks int := 0;
  v_events int := 0;
begin
  select count(*) into v_employees
  from public.organization_employee_profiles
  where organization_id = p_org_id and department_id = p_dept_id and employee_status = 'active';

  select count(*) into v_teams
  from public.organization_teams
  where organization_id = p_org_id and department_id = p_dept_id and is_active = true;

  begin
    select count(*) into v_tasks
    from public.organization_tasks
    where organization_id = p_org_id and department_id = p_dept_id
      and status not in ('completed', 'cancelled');
  exception when undefined_table then v_tasks := 0;
  end;

  begin
    select count(*) into v_events
    from public.organization_calendar_events
    where organization_id = p_org_id and department_id = p_dept_id
      and start_at >= now() - interval '7 days';
  exception when undefined_table then v_events := 0;
  end;

  return jsonb_build_object(
    'active_employees', v_employees,
    'teams', v_teams,
    'open_tasks', v_tasks,
    'recent_calendar_events', v_events
  );
end; $$;

create or replace function public._org511_department_profile(p_org_id uuid, p_dept_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_dept record;
begin
  select * into v_dept from public.organization_departments
  where id = p_dept_id and organization_id = p_org_id;

  if v_dept.id is null then return null; end if;

  return jsonb_build_object(
    'id', v_dept.id,
    'department_key', v_dept.department_key,
    'name', v_dept.name,
    'description', v_dept.description,
    'head_user_id', v_dept.head_user_id,
    'cost_center', v_dept.cost_center,
    'division', v_dept.division,
    'region', v_dept.region,
    'business_unit', v_dept.business_unit,
    'visibility', v_dept.visibility,
    'is_active', v_dept.is_active,
    'metrics', public._org511_department_metrics(p_org_id, p_dept_id),
    'employees', coalesce((
      select jsonb_agg(jsonb_build_object(
        'employee_id', p.id, 'full_name', p.full_name, 'email', p.email,
        'job_title', p.job_title, 'org_role', p.org_role, 'team_id', p.team_id
      ) order by p.full_name)
      from public.organization_employee_profiles p
      where p.organization_id = p_org_id and p.department_id = p_dept_id
        and p.employee_status in ('active', 'pending_invitation')
    ), '[]'::jsonb),
    'teams', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'team_key', t.team_key, 'name', t.name,
        'manager_user_id', t.manager_user_id, 'member_count', (
          select count(*) from public.organization_team_members m where m.team_id = t.id
        )
      ) order by t.sort_order, t.name)
      from public.organization_teams t
      where t.organization_id = p_org_id and t.department_id = p_dept_id and t.is_active = true
    ), '[]'::jsonb),
    'assigned_domains', coalesce((
      select jsonb_agg(jsonb_build_object('domain_id', dd.domain_id, 'domain', od.domain))
      from public.organization_department_domains dd
      join public.organization_domains od on od.id = dd.domain_id
      where dd.department_id = p_dept_id
    ), '[]'::jsonb),
    'assigned_modules', coalesce((
      select jsonb_agg(jsonb_build_object('module_key', dm.module_key))
      from public.organization_department_modules dm where dm.department_id = p_dept_id
    ), '[]'::jsonb),
    'assigned_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', bp.pack_key, 'domain_id', bp.domain_id,
        'domain', (select domain from public.organization_domains where id = bp.domain_id)
      ))
      from public.organization_department_business_packs bp where bp.department_id = p_dept_id
    ), '[]'::jsonb),
    'managers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'user_id', m.user_id, 'manager_role', m.manager_role,
        'full_name', (select full_name from public.organization_employee_profiles ep
          join public.organization_users ou on ou.id = ep.organization_user_id
          where ou.user_id = m.user_id and ep.organization_id = p_org_id limit 1)
      ))
      from public.organization_department_managers m where m.department_id = p_dept_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public._org511_build_chart(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_name text;
  v_root_label text;
  v_depts jsonb;
begin
  select o.name into v_org_name from public.organizations o where o.id = p_org_id;
  select chart_root_label into v_root_label
  from public.organization_structure_settings where organization_id = p_org_id;
  v_root_label := coalesce(v_root_label, v_org_name, 'Organization');

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'type', 'department',
      'id', d.id,
      'name', d.name,
      'manager_user_id', d.head_user_id,
      'teams', coalesce((
        select jsonb_agg(jsonb_build_object(
          'type', 'team', 'id', t.id, 'name', t.name,
          'manager_user_id', t.manager_user_id,
          'employees', coalesce((
            select jsonb_agg(jsonb_build_object(
              'type', 'employee', 'id', p.id, 'name', p.full_name, 'title', p.job_title
            ) order by p.full_name)
            from public.organization_team_members m
            join public.organization_employee_profiles p on p.id = m.employee_profile_id
            where m.team_id = t.id and p.employee_status = 'active'
          ), '[]'::jsonb)
        ) order by t.sort_order, t.name)
        from public.organization_teams t
        where t.department_id = d.id and t.is_active = true
      ), '[]'::jsonb),
      'employees', coalesce((
        select jsonb_agg(jsonb_build_object(
          'type', 'employee', 'id', p.id, 'name', p.full_name, 'title', p.job_title
        ) order by p.full_name)
        from public.organization_employee_profiles p
        where p.department_id = d.id and p.team_id is null and p.employee_status = 'active'
      ), '[]'::jsonb)
    ) order by d.sort_order, d.name
  ), '[]'::jsonb)
  into v_depts
  from public.organization_departments d
  where d.organization_id = p_org_id and d.is_active = true;

  return jsonb_build_object(
    'type', 'organization',
    'name', v_root_label,
    'departments', v_depts
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Organization Management Center
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_settings jsonb;
  v_overview jsonb;
  v_departments jsonb;
  v_teams jsonb;
  v_locations jsonb;
  v_managers jsonb;
  v_policies jsonb;
  v_custom_fields jsonb;
  v_reports jsonb;
  v_audit jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._org511_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._org511_ensure_settings(v_org_id);
  perform public._org511_seed_departments(v_org_id);
  perform public._org511_seed_locations(v_org_id);
  perform public._org511_log(v_org_id, 'center_view', 'Organization Center viewed', 'organization');

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  select to_jsonb(s) into v_settings
  from public.organization_structure_settings s where s.organization_id = v_org_id;

  select jsonb_build_object(
    'departments', (select count(*) from public.organization_departments where organization_id = v_org_id and is_active),
    'teams', (select count(*) from public.organization_teams where organization_id = v_org_id and is_active),
    'locations', (select count(*) from public.organization_locations where organization_id = v_org_id and is_active),
    'active_employees', (select count(*) from public.organization_employee_profiles where organization_id = v_org_id and employee_status = 'active'),
    'managers', (select count(distinct user_id) from public.organization_department_managers where organization_id = v_org_id)
  ) into v_overview;

  select coalesce(jsonb_agg(public._org511_department_profile(v_org_id, d.id) order by d.sort_order, d.name), '[]'::jsonb)
  into v_departments
  from public.organization_departments d
  where d.organization_id = v_org_id and d.is_active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'name', t.name, 'team_key', t.team_key,
    'department_id', t.department_id,
    'department_name', (select name from public.organization_departments where id = t.department_id),
    'manager_user_id', t.manager_user_id,
    'member_count', (select count(*) from public.organization_team_members m where m.team_id = t.id)
  ) order by t.name), '[]'::jsonb)
  into v_teams
  from public.organization_teams t
  where t.organization_id = v_org_id and t.is_active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'location_key', l.location_key, 'name', l.name,
    'location_type', l.location_type, 'city', l.city, 'country', l.country,
    'employee_count', (
      select count(*) from public.organization_employee_profiles p
      where p.location_id = l.id and p.employee_status = 'active'
    )
  ) order by l.name), '[]'::jsonb)
  into v_locations
  from public.organization_locations l
  where l.organization_id = v_org_id and l.is_active = true;

  select coalesce(jsonb_agg(distinct jsonb_build_object(
    'user_id', m.user_id,
    'manager_role', m.manager_role,
    'department_id', m.department_id,
    'department_name', d.name
  )), '[]'::jsonb)
  into v_managers
  from public.organization_department_managers m
  join public.organization_departments d on d.id = m.department_id
  where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'policy_key', p.policy_key, 'title', p.title,
    'scope', p.scope, 'status', p.status
  ) order by p.title), '[]'::jsonb)
  into v_policies
  from public.organization_policies p
  where p.organization_id = v_org_id and p.status = 'published';

  select coalesce(jsonb_agg(jsonb_build_object(
    'field_key', f.field_key, 'label', f.label, 'field_type', f.field_type, 'applies_to', f.applies_to
  ) order by f.sort_order), '[]'::jsonb)
  into v_custom_fields
  from public.organization_custom_field_definitions f
  where f.organization_id = v_org_id;

  v_reports := jsonb_build_object(
    'department_sizes', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'department', d.name, 'employees', (
          select count(*) from public.organization_employee_profiles p
          where p.department_id = d.id and p.employee_status = 'active'
        )
      ) order by d.name), '[]'::jsonb)
      from public.organization_departments d where d.organization_id = v_org_id and d.is_active
    ),
    'employee_distribution', jsonb_build_object(
      'by_department', v_overview->'departments',
      'by_location', (select count(distinct location_id) from public.organization_employee_profiles where organization_id = v_org_id and location_id is not null)
    ),
    'management_structure', jsonb_build_object('manager_count', v_overview->'managers'),
    'pack_usage', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', bp.pack_key, 'department', d.name))
      from public.organization_department_business_packs bp
      join public.organization_departments d on d.id = bp.department_id
      where bp.organization_id = v_org_id
    ), '[]'::jsonb)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'entity_type', a.entity_type, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.organization_structure_audit_logs
    where organization_id = v_org_id order by created_at desc limit 15
  ) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify adapts to how organizations operate — not rigid structures forced on customers.',
    'structure', 'PLATFORM → APP → ORGANIZATION → DEPARTMENTS → TEAMS → EMPLOYEES',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'settings', v_settings,
    'overview', v_overview,
    'departments', v_departments,
    'teams', v_teams,
    'locations', v_locations,
    'managers', v_managers,
    'organization_chart', public._org511_build_chart(v_org_id),
    'policies', v_policies,
    'custom_fields', v_custom_fields,
    'reports', v_reports,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'employees', '/app/employees',
      'domains', '/app/domains',
      'tasks', '/app/tasks',
      'calendar', '/app/calendar',
      'activity', '/app/activity'
    ),
    'sections', jsonb_build_array(
      'overview', 'departments', 'teams', 'locations', 'managers',
      'organization_chart', 'policies', 'reports'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Department dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_department_dashboard(p_department_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_profile jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._org511_org();
  v_profile := public._org511_department_profile(v_org_id, p_department_id);
  if v_profile is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'department', v_profile,
    'dashboard', jsonb_build_object(
      'task_overview', v_profile->'metrics'->'open_tasks',
      'employee_overview', v_profile->'metrics'->'active_employees',
      'team_overview', v_profile->'metrics'->'teams',
      'calendar_overview', v_profile->'metrics'->'recent_calendar_events',
      'activity_route', '/app/activity',
      'tasks_route', '/app/tasks',
      'calendar_route', '/app/calendar'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_dept_id uuid;
  v_team_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._org511_org();
  perform public._org511_ensure_settings(v_org_id);

  if p_action_type = 'create_department' then
    insert into public.organization_departments (
      organization_id, department_key, name, description, head_user_id,
      cost_center, division, region, business_unit, visibility
    ) values (
      v_org_id,
      lower(regexp_replace(coalesce(p_payload->>'department_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(p_payload->>'description', ''),
      nullif(p_payload->>'head_user_id', '')::uuid,
      nullif(p_payload->>'cost_center', ''),
      nullif(p_payload->>'division', ''),
      nullif(p_payload->>'region', ''),
      nullif(p_payload->>'business_unit', ''),
      coalesce(nullif(p_payload->>'visibility', ''), 'organization')
    )
    on conflict (organization_id, department_key) do update set
      name = excluded.name, description = excluded.description, updated_at = now()
    returning id into v_dept_id;
    perform public._org511_log(v_org_id, 'department_created', 'Department created: ' || (p_payload->>'name'), 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true, 'department_id', v_dept_id);

  elsif p_action_type = 'update_department' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    update public.organization_departments set
      name = coalesce(nullif(p_payload->>'name', ''), name),
      description = coalesce(nullif(p_payload->>'description', ''), description),
      head_user_id = coalesce(nullif(p_payload->>'head_user_id', '')::uuid, head_user_id),
      cost_center = coalesce(nullif(p_payload->>'cost_center', ''), cost_center),
      division = coalesce(nullif(p_payload->>'division', ''), division),
      region = coalesce(nullif(p_payload->>'region', ''), region),
      business_unit = coalesce(nullif(p_payload->>'business_unit', ''), business_unit),
      visibility = coalesce(nullif(p_payload->>'visibility', ''), visibility),
      updated_at = now()
    where id = v_dept_id and organization_id = v_org_id;
    perform public._org511_log(v_org_id, 'department_edited', 'Department updated', 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_team' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    insert into public.organization_teams (
      organization_id, department_id, team_key, name, description, manager_user_id
    ) values (
      v_org_id, v_dept_id,
      lower(regexp_replace(coalesce(p_payload->>'team_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(p_payload->>'description', ''),
      nullif(p_payload->>'manager_user_id', '')::uuid
    )
    on conflict (organization_id, department_id, team_key) do update set name = excluded.name, updated_at = now()
    returning id into v_team_id;
    perform public._org511_log(v_org_id, 'team_created', 'Team created: ' || (p_payload->>'name'), 'team', v_team_id, p_payload);
    return jsonb_build_object('ok', true, 'team_id', v_team_id);

  elsif p_action_type = 'create_location' then
    insert into public.organization_locations (
      organization_id, location_key, name, location_type, city, country, timezone
    ) values (
      v_org_id,
      lower(regexp_replace(coalesce(p_payload->>'location_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(nullif(p_payload->>'location_type', ''), 'office'),
      nullif(p_payload->>'city', ''),
      nullif(p_payload->>'country', ''),
      nullif(p_payload->>'timezone', '')
    )
    on conflict (organization_id, location_key) do update set name = excluded.name, updated_at = now()
    returning id into v_id;
    perform public._org511_log(v_org_id, 'location_added', 'Location added: ' || (p_payload->>'name'), 'location', v_id, p_payload);
    return jsonb_build_object('ok', true, 'location_id', v_id);

  elsif p_action_type = 'assign_department_manager' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    insert into public.organization_department_managers (organization_id, department_id, user_id, manager_role)
    values (v_org_id, v_dept_id, (p_payload->>'user_id')::uuid, coalesce(nullif(p_payload->>'manager_role', ''), 'manager'))
    on conflict (organization_id, department_id, user_id, manager_role) do nothing;
    update public.organization_departments set head_user_id = coalesce(head_user_id, (p_payload->>'user_id')::uuid)
    where id = v_dept_id and organization_id = v_org_id and head_user_id is null;
    perform public._org511_log(v_org_id, 'manager_assigned', 'Manager assigned to department', 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_department_domain' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    insert into public.organization_department_domains (organization_id, department_id, domain_id)
    values (v_org_id, v_dept_id, (p_payload->>'domain_id')::uuid)
    on conflict (organization_id, department_id, domain_id) do nothing;
    perform public._org511_log(v_org_id, 'domain_assigned', 'Domain assigned to department', 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_department_module' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    insert into public.organization_department_modules (organization_id, department_id, module_key)
    values (v_org_id, v_dept_id, p_payload->>'module_key')
    on conflict (organization_id, department_id, module_key) do nothing;
    perform public._org511_log(v_org_id, 'module_assigned', 'Module assigned to department', 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_department_pack' then
    v_dept_id := (p_payload->>'department_id')::uuid;
    insert into public.organization_department_business_packs (organization_id, department_id, pack_key, domain_id)
    values (v_org_id, v_dept_id, p_payload->>'pack_key', nullif(p_payload->>'domain_id', '')::uuid)
    on conflict (organization_id, department_id, pack_key, domain_id) do nothing;
    perform public._org511_log(v_org_id, 'pack_assigned', 'Business Pack connected to department', 'department', v_dept_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_team_member' then
    v_team_id := (p_payload->>'team_id')::uuid;
    insert into public.organization_team_members (organization_id, team_id, employee_profile_id)
    values (v_org_id, v_team_id, (p_payload->>'employee_id')::uuid)
    on conflict (organization_id, team_id, employee_profile_id) do nothing;
    update public.organization_employee_profiles set team_id = v_team_id, updated_at = now()
    where id = (p_payload->>'employee_id')::uuid and organization_id = v_org_id;
    perform public._org511_log(v_org_id, 'team_member_assigned', 'Employee assigned to team', 'team', v_team_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_employee_structure' then
    update public.organization_employee_profiles set
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      team_id = coalesce(nullif(p_payload->>'team_id', '')::uuid, team_id),
      location_id = coalesce(nullif(p_payload->>'location_id', '')::uuid, location_id),
      manager_user_id = coalesce(nullif(p_payload->>'manager_user_id', '')::uuid, manager_user_id),
      employee_number = coalesce(nullif(p_payload->>'employee_number', ''), employee_number),
      metadata = metadata || coalesce(p_payload->'custom_metadata', '{}'::jsonb),
      updated_at = now()
    where id = (p_payload->>'employee_id')::uuid and organization_id = v_org_id;
    perform public._org511_log(v_org_id, 'assignment_changed', 'Employee structure assignment updated', 'employee', (p_payload->>'employee_id')::uuid, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_custom_field' then
    insert into public.organization_custom_field_definitions (
      organization_id, field_key, label, field_type, applies_to, is_required, sort_order
    ) values (
      v_org_id,
      lower(regexp_replace(p_payload->>'field_key', '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'label',
      coalesce(nullif(p_payload->>'field_type', ''), 'text'),
      coalesce(nullif(p_payload->>'applies_to', ''), 'employee'),
      coalesce((p_payload->>'is_required')::boolean, false),
      coalesce((p_payload->>'sort_order')::int, 0)
    )
    on conflict (organization_id, field_key, applies_to) do update set label = excluded.label
    returning id into v_id;
    perform public._org511_log(v_org_id, 'custom_field_created', 'Custom field created', 'custom_field', v_id, p_payload);
    return jsonb_build_object('ok', true, 'field_id', v_id);

  elsif p_action_type = 'create_policy' then
    insert into public.organization_policies (
      organization_id, policy_key, title, body, scope, department_id, published_by, status
    ) values (
      v_org_id,
      lower(regexp_replace(coalesce(p_payload->>'policy_key', p_payload->>'title'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'title',
      coalesce(p_payload->>'body', ''),
      coalesce(nullif(p_payload->>'scope', ''), 'organization'),
      nullif(p_payload->>'department_id', '')::uuid,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(nullif(p_payload->>'status', ''), 'published')
    )
    on conflict (organization_id, policy_key) do update set title = excluded.title, body = excluded.body, updated_at = now()
    returning id into v_id;
    perform public._org511_log(v_org_id, 'policy_created', 'Organization policy published', 'policy', v_id, p_payload);
    return jsonb_build_object('ok', true, 'policy_id', v_id);

  elsif p_action_type = 'update_structure_settings' then
    update public.organization_structure_settings set
      structure_mode = coalesce(nullif(p_payload->>'structure_mode', ''), structure_mode),
      chart_root_label = coalesce(nullif(p_payload->>'chart_root_label', ''), chart_root_label),
      enable_cross_department_collaboration = coalesce((p_payload->>'enable_cross_department_collaboration')::boolean, enable_cross_department_collaboration),
      metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
      updated_at = now()
    where organization_id = v_org_id;
    perform public._org511_log(v_org_id, 'organization_updated', 'Organization structure settings updated', 'organization', v_org_id, p_payload);
    return jsonb_build_object('ok', true);

  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Search & Companion
-- ---------------------------------------------------------------------------
create or replace function public.search_organization_structure(p_query text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_q text := trim(coalesce(p_query, ''));
begin
  perform public._bde_require_admin();
  v_org_id := public._org511_org();
  if v_q = '' then return jsonb_build_object('found', true, 'results', '[]'::jsonb); end if;

  return jsonb_build_object(
    'found', true,
    'query', v_q,
    'results', coalesce((
      select jsonb_agg(r) from (
        select jsonb_build_object('type', 'department', 'id', d.id, 'name', d.name, 'label', d.name) as r
        from public.organization_departments d
        where d.organization_id = v_org_id and d.name ilike '%' || v_q || '%'
        union all
        select jsonb_build_object('type', 'team', 'id', t.id, 'name', t.name, 'department', (select name from public.organization_departments where id = t.department_id))
        from public.organization_teams t
        where t.organization_id = v_org_id and t.name ilike '%' || v_q || '%'
        union all
        select jsonb_build_object('type', 'employee', 'id', p.id, 'name', p.full_name, 'department', (select name from public.organization_departments where id = p.department_id))
        from public.organization_employee_profiles p
        where p.organization_id = v_org_id and (p.full_name ilike '%' || v_q || '%' or p.email ilike '%' || v_q || '%')
        limit 25
      ) sub
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_companion_organization_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_depts jsonb;
begin
  v_org_id := public._org511_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._org511_seed_departments(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'name', d.name, 'department_key', d.department_key,
    'employee_count', (select count(*) from public.organization_employee_profiles p where p.department_id = d.id and p.employee_status = 'active'),
    'teams', (select count(*) from public.organization_teams t where t.department_id = d.id and t.is_active),
    'manager_user_id', d.head_user_id,
    'packs', coalesce((
      select jsonb_agg(bp.pack_key) from public.organization_department_business_packs bp where bp.department_id = d.id
    ), '[]'::jsonb)
  ) order by d.name), '[]'::jsonb)
  into v_depts
  from public.organization_departments d
  where d.organization_id = v_org_id and d.is_active;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands departments, teams, managers, and organization hierarchy.',
    'organization', (select jsonb_build_object('id', o.id, 'name', o.name) from public.organizations o where o.id = v_org_id),
    'departments', v_depts,
    'teams', coalesce((
      select jsonb_agg(jsonb_build_object('name', t.name, 'department', (select name from public.organization_departments where id = t.department_id)))
      from public.organization_teams t where t.organization_id = v_org_id and t.is_active
    ), '[]'::jsonb),
    'locations', coalesce((
      select jsonb_agg(jsonb_build_object('name', l.name, 'type', l.location_type))
      from public.organization_locations l where l.organization_id = v_org_id and l.is_active
    ), '[]'::jsonb),
    'example_questions', jsonb_build_array(
      'Who manages Warehouse?',
      'Show Finance Department.',
      'How many employees are in Support?',
      'Which departments use Commerce Pack?'
    ),
    'organization_route', '/app/organization',
    'employees_route', '/app/employees'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Module registry
-- ---------------------------------------------------------------------------
do $$ begin
  perform public._mre501_seed_module(
    'organization', 'Organization', 'organization', 'settings',
    'Departments, teams, locations, managers, and company structure.',
    'starter', null, 'settings', '/app/organization', 'owner_only', 6
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('organization', 'organization.view', 'view', 'Organization — view structure'),
    ('organization', 'organization.manage', 'manage', 'Organization — manage structure')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_organization_management_center() to authenticated;
grant execute on function public.get_organization_department_dashboard(uuid) to authenticated;
grant execute on function public.perform_organization_management_action(text, jsonb) to authenticated;
grant execute on function public.search_organization_structure(text) to authenticated;
grant execute on function public.get_companion_organization_context() to authenticated;
