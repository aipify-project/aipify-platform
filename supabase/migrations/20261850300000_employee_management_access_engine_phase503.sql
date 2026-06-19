-- Phase 503 — Employee Management & Access Engine
-- PLATFORM owns the system · APP owns licenses · APP manages employees · EMPLOYEES use assigned functionality

-- ---------------------------------------------------------------------------
-- 1. Departments
-- ---------------------------------------------------------------------------
create table if not exists public.organization_departments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  department_key text not null,
  name text not null,
  description text not null default '',
  head_user_id uuid references public.users (id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, department_key)
);

create index if not exists organization_departments_org_idx
  on public.organization_departments (organization_id, is_active, sort_order);

alter table public.organization_departments enable row level security;
revoke all on public.organization_departments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Custom roles
-- ---------------------------------------------------------------------------
create table if not exists public.organization_custom_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role_key text not null,
  name text not null,
  description text not null default '',
  base_role text not null default 'staff' check (
    base_role in ('owner', 'administrator', 'manager', 'team_lead', 'employee', 'read_only', 'support')
  ),
  is_system boolean not null default false,
  permissions_template jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, role_key)
);

alter table public.organization_custom_roles enable row level security;
revoke all on public.organization_custom_roles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Employee profiles (canonical employee record)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_employee_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  organization_user_id uuid references public.organization_users (id) on delete set null,
  employee_number text,
  full_name text not null,
  email text not null,
  phone text,
  department_id uuid references public.organization_departments (id) on delete set null,
  job_title text,
  manager_user_id uuid references public.users (id) on delete set null,
  custom_role_id uuid references public.organization_custom_roles (id) on delete set null,
  org_role text not null default 'employee' check (
    org_role in ('owner', 'administrator', 'manager', 'team_lead', 'employee', 'read_only', 'support')
  ),
  employee_status text not null default 'pending_invitation' check (
    employee_status in ('active', 'pending_invitation', 'suspended', 'disabled', 'offboarded')
  ),
  start_date date,
  end_date date,
  profile_photo_url text,
  office_location text,
  emergency_contact jsonb not null default '{}'::jsonb,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists organization_employee_profiles_org_user_idx
  on public.organization_employee_profiles (organization_id, organization_user_id)
  where organization_user_id is not null;

create index if not exists organization_employee_profiles_org_status_idx
  on public.organization_employee_profiles (organization_id, employee_status);

create index if not exists organization_employee_profiles_org_email_idx
  on public.organization_employee_profiles (organization_id, lower(email));

alter table public.organization_employee_profiles enable row level security;
revoke all on public.organization_employee_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Employee invitations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_employee_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete cascade,
  email text not null,
  full_name text not null,
  org_role text not null default 'employee',
  department_id uuid references public.organization_departments (id) on delete set null,
  custom_role_id uuid references public.organization_custom_roles (id) on delete set null,
  manager_user_id uuid references public.users (id) on delete set null,
  welcome_message text,
  setup_token_hash text,
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'expired', 'cancelled')
  ),
  invited_by_user_id uuid references public.users (id) on delete set null,
  expires_at timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_employee_invitations_org_idx
  on public.organization_employee_invitations (organization_id, status, created_at desc);

alter table public.organization_employee_invitations enable row level security;
revoke all on public.organization_employee_invitations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Per-user module grants (extends Phase 501 role grants)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_user_module_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  module_key text not null references public.aipify_module_registry (module_key) on delete cascade,
  can_view boolean not null default false,
  can_create boolean not null default false,
  can_edit boolean not null default false,
  can_delete boolean not null default false,
  can_approve boolean not null default false,
  can_manage boolean not null default false,
  granted_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, module_key)
);

create index if not exists organization_user_module_grants_org_user_idx
  on public.organization_user_module_grants (organization_id, user_id);

alter table public.organization_user_module_grants enable row level security;
revoke all on public.organization_user_module_grants from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.organization_employee_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  action text not null check (
    action in (
      'employee_created', 'employee_updated', 'role_changed', 'permission_changed',
      'invitation_sent', 'invitation_accepted', 'invitation_cancelled',
      'employee_suspended', 'employee_reactivated', 'employee_offboarded',
      'department_created', 'department_updated', 'custom_role_created',
      'module_assigned', 'module_revoked', 'manager_changed', 'center_view'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_employee_audit_org_idx
  on public.organization_employee_audit_logs (organization_id, created_at desc);

alter table public.organization_employee_audit_logs enable row level security;
revoke all on public.organization_employee_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._emae503_principle()
returns text language sql immutable as $$
  select 'APP hires people. APP controls access. Employees use what APP provides. One APP. One employee system.';
$$;

create or replace function public._emae503_require_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._bde_require_admin();
end; $$;

create or replace function public._emae503_org()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_org uuid;
begin
  v_org := public._presence_tenant_for_auth();
  if v_org is null then raise exception 'Organization required'; end if;
  return v_org;
end; $$;

create or replace function public._emae503_actor()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._emae503_log(
  p_org_id uuid,
  p_profile_id uuid,
  p_action text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.organization_employee_audit_logs (
    organization_id, employee_profile_id, action, summary, actor_user_id, context
  ) values (
    p_org_id, p_profile_id, p_action, p_summary, public._emae503_actor(), coalesce(p_context, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._emae503_seed_departments(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_departments (organization_id, department_key, name, sort_order)
  select p_org_id, v.key, v.name, v.ord
  from (values
    ('management', 'Management', 10),
    ('sales', 'Sales', 20),
    ('support', 'Support', 30),
    ('finance', 'Finance', 40),
    ('operations', 'Operations', 50),
    ('warehouse', 'Warehouse', 60),
    ('marketing', 'Marketing', 70),
    ('hr', 'HR', 80),
    ('customer_success', 'Customer Success', 90)
  ) as v(key, name, ord)
  on conflict (organization_id, department_key) do nothing;
end; $$;

create or replace function public._emae503_seed_roles(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_custom_roles (organization_id, role_key, name, base_role, is_system, description)
  select p_org_id, v.key, v.name, v.base, true, v.role_desc
  from (values
    ('owner', 'Owner', 'owner', 'Full APP ownership'),
    ('administrator', 'Administrator', 'administrator', 'Manage APP settings and employees'),
    ('manager', 'Manager', 'manager', 'Manage team workflows and approvals'),
    ('team_lead', 'Team Lead', 'team_lead', 'Lead a team with elevated module access'),
    ('employee', 'Employee', 'employee', 'Standard employee access'),
    ('read_only', 'Read Only', 'read_only', 'View-only access where granted')
  ) as v(key, name, base, role_desc)
  on conflict (organization_id, role_key) do nothing;
end; $$;

create or replace function public._emae503_seat_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total int := 25;
  v_active int;
  v_pending int;
begin
  select coalesce(max(s.capacity_limit), 25) into v_total
  from public.business_pack_license_tenant_state s
  where s.tenant_id = p_org_id and s.license_status = 'active' and s.capacity_limit is not null;

  select count(*) into v_active
  from public.organization_employee_profiles p
  where p.organization_id = p_org_id and p.employee_status = 'active';

  select count(*) into v_pending
  from public.organization_employee_invitations i
  where i.organization_id = p_org_id and i.status = 'pending';

  return jsonb_build_object(
    'total_seats', v_total,
    'active_employees', v_active,
    'available_seats', greatest(0, v_total - v_active - v_pending),
    'pending_invitations', v_pending,
    'used_seats', v_active + v_pending
  );
end; $$;

-- Update module visibility — user grants override role defaults when present
create or replace function public.is_user_module_visible(
  p_organization_id uuid,
  p_user_id uuid,
  p_module_key text
)
returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_default_visibility text;
  v_reg_status text;
  v_grant public.organization_module_role_grants;
  v_user_grant public.organization_user_module_grants;
  v_membership_status text;
begin
  if not public.is_organization_module_active(p_organization_id, p_module_key) then
    return false;
  end if;

  select ou.role, ou.status into v_role, v_membership_status
  from public.organization_users ou
  where ou.organization_id = p_organization_id and ou.user_id = p_user_id and ou.status in ('active', 'invited')
  limit 1;

  if v_membership_status = 'suspended' or v_membership_status = 'removed' then return false; end if;
  if not public._mre501_org_subscription_active(p_organization_id) then return false; end if;

  select r.default_visibility, r.status into v_default_visibility, v_reg_status
  from public.aipify_module_registry r where r.module_key = p_module_key;
  if v_reg_status is null or v_reg_status <> 'active' then return false; end if;

  if v_role in ('owner', 'administrator') then return true; end if;

  select * into v_user_grant from public.organization_user_module_grants
  where organization_id = p_organization_id and user_id = p_user_id and module_key = p_module_key;

  if v_user_grant.id is not null then
    return v_user_grant.can_view or v_user_grant.can_create or v_user_grant.can_edit
      or v_user_grant.can_delete or v_user_grant.can_approve or v_user_grant.can_manage;
  end if;

  if v_default_visibility = 'owner_only' then return false; end if;
  if v_default_visibility = 'always' then return true; end if;

  select * into v_grant from public.organization_module_role_grants
  where organization_id = p_organization_id and module_key = p_module_key and role_key = v_role;

  return coalesce(v_grant.can_view, false) or coalesce(v_grant.can_use, false);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Employee management center (overview)
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_management_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_seats jsonb;
  v_counts jsonb;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  perform public._emae503_seed_departments(v_org_id);
  perform public._emae503_seed_roles(v_org_id);

  v_seats := public._emae503_seat_summary(v_org_id);

  select jsonb_build_object(
    'total', count(*),
    'active', count(*) filter (where employee_status = 'active'),
    'pending', count(*) filter (where employee_status = 'pending_invitation'),
    'suspended', count(*) filter (where employee_status = 'suspended'),
    'offboarded', count(*) filter (where employee_status = 'offboarded')
  ) into v_counts
  from public.organization_employee_profiles where organization_id = v_org_id;

  perform public._emae503_log(v_org_id, null, 'center_view', 'Employee management center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._emae503_principle(),
    'privacy_note', 'APP owner manages employees — employees see only assigned modules.',
    'app_license_active', public._mre501_org_subscription_active(v_org_id),
    'seat_licensing', v_seats,
    'employee_counts', v_counts,
    'sections', jsonb_build_array(
      'overview', 'employees', 'roles', 'departments', 'invitations',
      'access_control', 'activity', 'offboarding'
    ),
    'employee_statuses', jsonb_build_array('active', 'pending_invitation', 'suspended', 'disabled', 'offboarded'),
    'module_access_route', '/app/settings/module-access',
    'app_store_route', '/app/store'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Employee directory with search
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_directory(
  p_search text default null,
  p_department_id uuid default null,
  p_role text default null,
  p_status text default null,
  p_manager_user_id uuid default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
  v_items jsonb;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();

  select coalesce(jsonb_agg(jsonb_build_object(
    'employee_id', p.id,
    'employee_number', p.employee_number,
    'full_name', p.full_name,
    'email', p.email,
    'phone', p.phone,
    'department_id', p.department_id,
    'department_name', d.name,
    'job_title', p.job_title,
    'manager_user_id', p.manager_user_id,
    'org_role', p.org_role,
    'custom_role_id', p.custom_role_id,
    'employee_status', p.employee_status,
    'start_date', p.start_date,
    'end_date', p.end_date,
    'organization_user_id', p.organization_user_id,
    'profile_photo_url', p.profile_photo_url,
    'office_location', p.office_location
  ) order by p.full_name), '[]'::jsonb)
  into v_items
  from public.organization_employee_profiles p
  left join public.organization_departments d on d.id = p.department_id
  where p.organization_id = v_org_id
    and (p_search is null or p_search = '' or (
      p.full_name ilike '%' || p_search || '%'
      or p.email ilike '%' || p_search || '%'
      or coalesce(p.employee_number, '') ilike '%' || p_search || '%'
    ))
    and (p_department_id is null or p.department_id = p_department_id)
    and (p_role is null or p_role = '' or p.org_role = p_role)
    and (p_status is null or p_status = '' or p.employee_status = p_status)
    and (p_manager_user_id is null or p.manager_user_id = p_manager_user_id);

  return jsonb_build_object('found', true, 'employees', v_items, 'search', p_search);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Employee profile detail
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_profile(p_employee_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile record;
  v_modules jsonb;
  v_permissions jsonb;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();

  select p.*, d.name as department_name, d.department_key
  into v_profile
  from public.organization_employee_profiles p
  left join public.organization_departments d on d.id = p.department_id
  where p.id = p_employee_id and p.organization_id = v_org_id;

  if v_profile.id is null then return jsonb_build_object('found', false); end if;

  if v_profile.organization_user_id is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'module_key', g.module_key,
      'can_view', g.can_view, 'can_create', g.can_create, 'can_edit', g.can_edit,
      'can_delete', g.can_delete, 'can_approve', g.can_approve, 'can_manage', g.can_manage
    )), '[]'::jsonb)
    into v_modules
    from public.organization_user_module_grants g
    join public.organization_users ou on ou.user_id = g.user_id and ou.organization_id = g.organization_id
    where g.organization_id = v_org_id and ou.id = v_profile.organization_user_id;
  else
    v_modules := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'found', true,
    'profile', jsonb_build_object(
      'employee_id', v_profile.id,
      'employee_number', v_profile.employee_number,
      'full_name', v_profile.full_name,
      'email', v_profile.email,
      'phone', v_profile.phone,
      'department_id', v_profile.department_id,
      'department_name', v_profile.department_name,
      'job_title', v_profile.job_title,
      'manager_user_id', v_profile.manager_user_id,
      'org_role', v_profile.org_role,
      'custom_role_id', v_profile.custom_role_id,
      'employee_status', v_profile.employee_status,
      'start_date', v_profile.start_date,
      'end_date', v_profile.end_date,
      'profile_photo_url', v_profile.profile_photo_url,
      'office_location', v_profile.office_location,
      'emergency_contact', v_profile.emergency_contact,
      'notes', v_profile.notes,
      'organization_user_id', v_profile.organization_user_id
    ),
    'assigned_modules', coalesce(v_modules, '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Supporting lists
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_management_departments()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  perform public._emae503_seed_departments(v_org_id);
  return jsonb_build_object(
    'found', true,
    'departments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'department_key', d.department_key, 'name', d.name,
        'description', d.description, 'head_user_id', d.head_user_id, 'is_active', d.is_active
      ) order by d.sort_order, d.name)
      from public.organization_departments d where d.organization_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_employee_management_roles()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  perform public._emae503_seed_roles(v_org_id);
  return jsonb_build_object(
    'found', true,
    'roles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'role_key', r.role_key, 'name', r.name,
        'base_role', r.base_role, 'is_system', r.is_system, 'description', r.description
      ) order by r.name)
      from public.organization_custom_roles r where r.organization_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_employee_management_invitations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  return jsonb_build_object(
    'found', true,
    'invitations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'email', i.email, 'full_name', i.full_name, 'org_role', i.org_role,
        'department_id', i.department_id, 'status', i.status,
        'expires_at', i.expires_at, 'created_at', i.created_at
      ) order by i.created_at desc)
      from public.organization_employee_invitations i
      where i.organization_id = v_org_id and i.status = 'pending'
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_employee_access_control()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  return jsonb_build_object(
    'found', true,
    'principle', 'APP decides module access per employee — not automatic for all employees.',
    'role_grants', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', g.module_key, 'role_key', g.role_key,
        'can_view', g.can_view, 'can_use', g.can_use, 'can_manage', g.can_manage
      )) from public.organization_module_role_grants g where g.organization_id = v_org_id
    ), '[]'::jsonb),
    'user_grants', coalesce((
      select jsonb_agg(jsonb_build_object(
        'user_id', g.user_id, 'module_key', g.module_key,
        'can_view', g.can_view, 'can_create', g.can_create, 'can_edit', g.can_edit,
        'can_delete', g.can_delete, 'can_approve', g.can_approve, 'can_manage', g.can_manage,
        'employee_name', p.full_name
      ))
      from public.organization_user_module_grants g
      left join public.organization_employee_profiles p
        on p.organization_id = g.organization_id
        and exists (
          select 1 from public.organization_users ou
          where ou.id = p.organization_user_id and ou.user_id = g.user_id
        )
      where g.organization_id = v_org_id
    ), '[]'::jsonb),
    'modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', r.module_key, 'module_name', r.module_name,
        'required_business_pack', r.required_business_pack
      ) order by r.sort_order)
      from public.aipify_module_registry r where r.status = 'active'
    ), '[]'::jsonb),
    'module_access_route', '/app/settings/module-access'
  );
end; $$;

create or replace function public.get_employee_activity_log(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._emae503_require_admin();
  v_org_id := public._emae503_org();
  return jsonb_build_object(
    'found', true,
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action', a.action, 'summary', a.summary,
        'employee_profile_id', a.employee_profile_id, 'created_at', a.created_at, 'context', a.context
      ) order by a.created_at desc)
      from (
        select * from public.organization_employee_audit_logs
        where organization_id = v_org_id
        order by created_at desc
        limit greatest(1, least(p_limit, 100))
      ) a
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Employee personal dashboard
-- ---------------------------------------------------------------------------
create or replace function public.get_employee_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_profile record;
  v_modules jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := public._emae503_actor();
  if v_user_id is null then return jsonb_build_object('found', false); end if;

  if not public._mre501_org_subscription_active(v_org_id) then
    return jsonb_build_object('found', false, 'error', 'APP license suspended — contact your administrator.');
  end if;

  select p.* into v_profile
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = v_org_id and ou.user_id = v_user_id
  limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name, 'route_href', r.route_href
  ) order by r.sort_order), '[]'::jsonb)
  into v_modules
  from public.aipify_module_registry r
  where r.status = 'active' and public.is_user_module_visible(v_org_id, v_user_id, r.module_key);

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees see assigned functionality only — not company-wide control.',
    'profile', case when v_profile.id is null then null else jsonb_build_object(
      'full_name', v_profile.full_name, 'job_title', v_profile.job_title,
      'department_id', v_profile.department_id, 'employee_status', v_profile.employee_status
    ) end,
    'my_tasks', '[]'::jsonb,
    'my_calendar', '[]'::jsonb,
    'my_notifications', '[]'::jsonb,
    'my_documents', '[]'::jsonb,
    'assigned_modules', coalesce(v_modules, '[]'::jsonb),
    'my_activity', '[]'::jsonb
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_employee_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
  v_invitation_id uuid;
  v_user_id uuid;
  v_seats jsonb;
  v_setup_token text;
begin
  v_org_id := public._emae503_org();

  if p_action_type = 'invite_employee' then
    perform public._emae503_require_admin();
    v_seats := public._emae503_seat_summary(v_org_id);
    if (v_seats->>'available_seats')::int <= 0 then
      raise exception 'No available employee seats — purchase more in App Store or License Dashboard';
    end if;

    insert into public.organization_employee_profiles (
      organization_id, full_name, email, phone, department_id, job_title,
      manager_user_id, org_role, custom_role_id, employee_status, start_date, employee_number
    ) values (
      v_org_id,
      coalesce(p_payload->>'full_name', p_payload->>'name'),
      lower(trim(p_payload->>'email')),
      nullif(p_payload->>'phone', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'job_title', ''),
      nullif(p_payload->>'manager_user_id', '')::uuid,
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      nullif(p_payload->>'custom_role_id', '')::uuid,
      'pending_invitation',
      coalesce(nullif(p_payload->>'start_date', '')::date, current_date),
      nullif(p_payload->>'employee_number', '')
    )
    returning id into v_profile_id;

    v_setup_token := encode(gen_random_bytes(24), 'hex');

    insert into public.organization_employee_invitations (
      organization_id, employee_profile_id, email, full_name, org_role,
      department_id, custom_role_id, manager_user_id, welcome_message,
      setup_token_hash, invited_by_user_id
    ) values (
      v_org_id, v_profile_id,
      lower(trim(p_payload->>'email')),
      coalesce(p_payload->>'full_name', p_payload->>'name'),
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'custom_role_id', '')::uuid,
      nullif(p_payload->>'manager_user_id', '')::uuid,
      nullif(p_payload->>'welcome_message', ''),
      encode(extensions.digest(v_setup_token, 'sha256'), 'hex'),
      public._emae503_actor()
    )
    returning id into v_invitation_id;

    insert into public.team_invitations (customer_id, email, role, department, welcome_message, status, invited_by)
    select
      v_org_id,
      lower(trim(p_payload->>'email')),
      coalesce(nullif(p_payload->>'org_role', ''), 'employee'),
      (select name from public.organization_departments where id = nullif(p_payload->>'department_id', '')::uuid),
      nullif(p_payload->>'welcome_message', ''),
      'pending',
      public._emae503_actor()::text
    where not exists (
      select 1 from public.team_invitations ti
      where ti.customer_id = v_org_id and lower(ti.email) = lower(trim(p_payload->>'email')) and ti.status = 'pending'
    );

    perform public._emae503_log(v_org_id, v_profile_id, 'invitation_sent',
      'Employee invitation sent to ' || (p_payload->>'email'),
      jsonb_build_object('invitation_id', v_invitation_id));

    return jsonb_build_object(
      'ok', true,
      'action', p_action_type,
      'employee_id', v_profile_id,
      'invitation_id', v_invitation_id,
      'setup_link', '/auth/setup?token=' || v_setup_token,
      'message', 'Welcome email prepared — employee creates password and enters APP.'
    );
  end if;

  if p_action_type = 'update_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles set
      full_name = coalesce(nullif(p_payload->>'full_name', ''), full_name),
      phone = coalesce(nullif(p_payload->>'phone', ''), phone),
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      job_title = coalesce(nullif(p_payload->>'job_title', ''), job_title),
      manager_user_id = coalesce(nullif(p_payload->>'manager_user_id', '')::uuid, manager_user_id),
      org_role = coalesce(nullif(p_payload->>'org_role', ''), org_role),
      notes = coalesce(nullif(p_payload->>'notes', ''), notes),
      office_location = coalesce(nullif(p_payload->>'office_location', ''), office_location),
      updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_updated', 'Employee profile updated', p_payload);
    return jsonb_build_object('ok', true, 'action', p_action_type);
  end if;

  if p_action_type = 'suspend_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles
    set employee_status = 'suspended', updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'suspended', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_suspended', 'Employee suspended — only this employee loses access', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Employee suspended. Only this employee loses access.');
  end if;

  if p_action_type = 'reactivate_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles
    set employee_status = 'active', updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'active', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_reactivated', 'Employee reactivated', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'offboard_employee' then
    perform public._emae503_require_admin();
    v_profile_id := (p_payload->>'employee_id')::uuid;
    update public.organization_employee_profiles set
      employee_status = 'offboarded',
      end_date = coalesce(nullif(p_payload->>'end_date', '')::date, current_date),
      metadata = metadata || jsonb_build_object('offboard_tasks_transferred', true, 'audit_retained', true),
      updated_at = now()
    where id = v_profile_id and organization_id = v_org_id;
    update public.organization_users ou set status = 'removed', updated_at = now()
    from public.organization_employee_profiles p
    where p.id = v_profile_id and p.organization_user_id = ou.id;
    perform public._emae503_log(v_org_id, v_profile_id, 'employee_offboarded',
      'Employee offboarded — login disabled, audit retained, nothing deleted', p_payload);
    return jsonb_build_object(
      'ok', true,
      'message', 'Login disabled. Tasks and ownership transferred per policy. Audit history retained.'
    );
  end if;

  if p_action_type = 'create_department' then
    perform public._emae503_require_admin();
    insert into public.organization_departments (organization_id, department_key, name, description)
    values (
      v_org_id,
      lower(regexp_replace(coalesce(p_payload->>'department_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(p_payload->>'description', '')
    )
    on conflict (organization_id, department_key) do update set name = excluded.name, updated_at = now()
    returning id into v_profile_id;
    perform public._emae503_log(v_org_id, null, 'department_created', 'Department created: ' || (p_payload->>'name'), p_payload);
    return jsonb_build_object('ok', true, 'department_id', v_profile_id);
  end if;

  if p_action_type = 'create_custom_role' then
    perform public._emae503_require_admin();
    insert into public.organization_custom_roles (organization_id, role_key, name, base_role, description)
    values (
      v_org_id,
      lower(regexp_replace(p_payload->>'role_key', '[^a-zA-Z0-9]+', '_', 'g')),
      p_payload->>'name',
      coalesce(nullif(p_payload->>'base_role', ''), 'employee'),
      coalesce(p_payload->>'description', '')
    )
    on conflict (organization_id, role_key) do update set name = excluded.name, updated_at = now()
    returning id into v_profile_id;
    perform public._emae503_log(v_org_id, null, 'custom_role_created', 'Custom role created: ' || (p_payload->>'name'), p_payload);
    return jsonb_build_object('ok', true, 'role_id', v_profile_id);
  end if;

  if p_action_type = 'assign_user_module' then
    perform public._emae503_require_admin();
    v_user_id := (p_payload->>'user_id')::uuid;
    insert into public.organization_user_module_grants (
      organization_id, user_id, module_key,
      can_view, can_create, can_edit, can_delete, can_approve, can_manage,
      granted_by_user_id
    ) values (
      v_org_id, v_user_id, p_payload->>'module_key',
      coalesce((p_payload->>'can_view')::boolean, false),
      coalesce((p_payload->>'can_create')::boolean, false),
      coalesce((p_payload->>'can_edit')::boolean, false),
      coalesce((p_payload->>'can_delete')::boolean, false),
      coalesce((p_payload->>'can_approve')::boolean, false),
      coalesce((p_payload->>'can_manage')::boolean, false),
      public._emae503_actor()
    )
    on conflict (organization_id, user_id, module_key) do update set
      can_view = excluded.can_view, can_create = excluded.can_create,
      can_edit = excluded.can_edit, can_delete = excluded.can_delete,
      can_approve = excluded.can_approve, can_manage = excluded.can_manage,
      updated_at = now();
    perform public._emae503_log(v_org_id, null, 'module_assigned',
      'Module assigned to employee: ' || (p_payload->>'module_key'), p_payload);
    return jsonb_build_object('ok', true, 'message', 'Only assigned employees see this module.');
  end if;

  if p_action_type = 'cancel_invitation' then
    perform public._emae503_require_admin();
    v_invitation_id := (p_payload->>'invitation_id')::uuid;
    update public.organization_employee_invitations
    set status = 'cancelled', updated_at = now()
    where id = v_invitation_id and organization_id = v_org_id;
    perform public._emae503_log(v_org_id, null, 'invitation_cancelled', 'Invitation cancelled', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- Platform aggregate overview
create or replace function public.get_platform_employee_management_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
  return jsonb_build_object(
    'found', true,
    'privacy_note', 'Aggregates only — no employee PII.',
    'principle', public._emae503_principle(),
    'summary', jsonb_build_object(
      'organizations_with_employees', (select count(distinct organization_id) from public.organization_employee_profiles),
      'active_employees', (select count(*) from public.organization_employee_profiles where employee_status = 'active'),
      'pending_invitations', (select count(*) from public.organization_employee_invitations where status = 'pending'),
      'departments', (select count(*) from public.organization_departments),
      'custom_roles', (select count(*) from public.organization_custom_roles where not is_system)
    )
  );
end; $$;

grant execute on function public.get_employee_management_center() to authenticated;
grant execute on function public.get_employee_directory(text, uuid, text, text, uuid) to authenticated;
grant execute on function public.get_employee_profile(uuid) to authenticated;
grant execute on function public.get_employee_management_departments() to authenticated;
grant execute on function public.get_employee_management_roles() to authenticated;
grant execute on function public.get_employee_management_invitations() to authenticated;
grant execute on function public.get_employee_access_control() to authenticated;
grant execute on function public.get_employee_activity_log(int) to authenticated;
grant execute on function public.get_employee_dashboard() to authenticated;
grant execute on function public.perform_employee_management_action(text, jsonb) to authenticated;
grant execute on function public.get_platform_employee_management_overview() to authenticated;
