-- Phase 504 — Role & Permission Matrix Engine
-- PLATFORM → APP → EMPLOYEES → ROLES → PERMISSIONS
-- Roles control visibility and actions inside APP — no separate portals.

-- ---------------------------------------------------------------------------
-- 1. Extend permission kinds (export · assign · configure)
-- ---------------------------------------------------------------------------
alter table public.aipify_module_permissions drop constraint if exists aipify_module_permissions_permission_kind_check;
alter table public.aipify_module_permissions add constraint aipify_module_permissions_permission_kind_check check (
  permission_kind in ('view', 'create', 'edit', 'delete', 'approve', 'manage', 'export', 'report', 'assign', 'configure', 'custom')
);

-- ---------------------------------------------------------------------------
-- 2. Role permission grants (granular matrix)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_role_permission_grants (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  role_key text not null,
  permission_key text not null references public.aipify_module_permissions (permission_key) on delete cascade,
  granted boolean not null default true,
  granted_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, role_key, permission_key)
);

create index if not exists organization_role_permission_grants_org_role_idx
  on public.organization_role_permission_grants (organization_id, role_key);

alter table public.organization_role_permission_grants enable row level security;
revoke all on public.organization_role_permission_grants from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. User permission overrides (primary role + additional permissions)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_user_permission_overrides (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  permission_key text not null references public.aipify_module_permissions (permission_key) on delete cascade,
  granted boolean not null default true,
  granted_by_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id, permission_key)
);

create index if not exists organization_user_permission_overrides_org_user_idx
  on public.organization_user_permission_overrides (organization_id, user_id);

alter table public.organization_user_permission_overrides enable row level security;
revoke all on public.organization_user_permission_overrides from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Extend custom roles — department scope + status
-- ---------------------------------------------------------------------------
alter table public.organization_custom_roles
  add column if not exists department_scope_type text not null default 'organization'
    check (department_scope_type in ('organization', 'department', 'team', 'business_unit'));

alter table public.organization_custom_roles
  add column if not exists department_id uuid references public.organization_departments (id) on delete set null;

alter table public.organization_custom_roles
  add column if not exists status text not null default 'active'
    check (status in ('active', 'disabled', 'archived'));

alter table public.organization_custom_roles
  add column if not exists template_key text;

-- ---------------------------------------------------------------------------
-- 5. Global role templates
-- ---------------------------------------------------------------------------
create table if not exists public.role_permission_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  name text not null,
  description text not null default '',
  industry text not null default 'general',
  permissions jsonb not null default '[]'::jsonb,
  role_definitions jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.role_permission_templates enable row level security;
revoke all on public.role_permission_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Audit log
-- ---------------------------------------------------------------------------
create table if not exists public.role_permission_matrix_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete set null,
  role_key text,
  action text not null check (
    action in (
      'role_created', 'role_edited', 'role_deleted', 'permission_granted', 'permission_removed',
      'role_assigned', 'role_removed', 'template_applied', 'matrix_view', 'super_admin_view'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  actor_layer text not null default 'app' check (actor_layer in ('app', 'super_admin', 'platform')),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists role_permission_matrix_audit_org_idx
  on public.role_permission_matrix_audit_logs (organization_id, created_at desc);

alter table public.role_permission_matrix_audit_logs enable row level security;
revoke all on public.role_permission_matrix_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._rpm504_principle()
returns text language sql immutable as $$
  select 'APP controls people. Roles control access. Permissions control actions.';
$$;

create or replace function public._rpm504_permission_kinds()
returns text[] language sql immutable as $$
  select array['view','create','edit','delete','approve','manage','export','report','assign','configure'];
$$;

create or replace function public._rpm504_register_module_permissions(p_module_key text)
returns void language plpgsql security definer set search_path = public as $$
declare v_kind text;
begin
  foreach v_kind in array public._rpm504_permission_kinds()
  loop
    insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
    values (
      p_module_key,
      p_module_key || '.' || v_kind,
      v_kind,
      initcap(replace(p_module_key, '_', ' ')) || ' — ' || v_kind
    )
    on conflict (permission_key) do update set permission_kind = excluded.permission_kind, description = excluded.description;
  end loop;
end; $$;

-- Replace Phase 501 upsert to include full permission matrix
create or replace function public._mre501_upsert_permissions(p_module_key text)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._rpm504_register_module_permissions(p_module_key);
end; $$;

create or replace function public._rpm504_log(
  p_org_id uuid, p_role_key text, p_action text, p_summary text,
  p_layer text default 'app', p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.role_permission_matrix_audit_logs (
    organization_id, role_key, action, summary, actor_user_id, actor_layer, context
  ) values (
    p_org_id, p_role_key, p_action, p_summary,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_layer, coalesce(p_context, '{}'::jsonb)
  )
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._rpm504_user_org_role(p_org_id uuid, p_user_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  select coalesce(p.org_role, ou.role) into v_role
  from public.organization_users ou
  left join public.organization_employee_profiles p
    on p.organization_user_id = ou.id and p.organization_id = ou.organization_id
  where ou.organization_id = p_org_id and ou.user_id = p_user_id and ou.status = 'active'
  limit 1;
  return v_role;
end; $$;

create or replace function public._rpm504_department_scope_allows(
  p_org_id uuid, p_user_id uuid, p_role_key text
) returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_scope text;
  v_dept_id uuid;
  v_user_dept uuid;
begin
  select r.department_scope_type, r.department_id into v_scope, v_dept_id
  from public.organization_custom_roles r
  where r.organization_id = p_org_id and r.role_key = p_role_key
  limit 1;

  if v_scope is null or v_scope = 'organization' then return true; end if;
  if v_scope <> 'department' or v_dept_id is null then return true; end if;

  select p.department_id into v_user_dept
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  where p.organization_id = p_org_id and ou.user_id = p_user_id
  limit 1;

  return v_user_dept is not distinct from v_dept_id;
end; $$;

-- Core permission check
create or replace function public.user_has_permission(
  p_organization_id uuid,
  p_user_id uuid,
  p_permission_key text
) returns boolean language plpgsql stable security definer set search_path = public as $$
declare
  v_role text;
  v_override boolean;
  v_granted boolean;
  v_membership_status text;
begin
  if p_organization_id is null or p_user_id is null or p_permission_key is null then return false; end if;
  if not public._mre501_org_subscription_active(p_organization_id) then return false; end if;

  select ou.status into v_membership_status
  from public.organization_users ou
  where ou.organization_id = p_organization_id and ou.user_id = p_user_id
  limit 1;

  if v_membership_status in ('suspended', 'removed') then return false; end if;

  v_role := public._rpm504_user_org_role(p_organization_id, p_user_id);
  if v_role is null then return false; end if;

  -- Owner: full access — cannot be restricted by lower roles
  if v_role = 'owner' then return true; end if;

  -- Administrator: operational full access; billing ownership excluded unless explicit
  if v_role = 'administrator' then
    if p_permission_key like 'billing.%' or p_permission_key like 'subscription.%' then
      return exists (
        select 1 from public.organization_role_permission_grants g
        where g.organization_id = p_organization_id and g.role_key = 'administrator'
          and g.permission_key = p_permission_key and g.granted = true
      );
    end if;
    return true;
  end if;

  if not public._rpm504_department_scope_allows(p_organization_id, p_user_id, v_role) then
    return false;
  end if;

  -- User-level override (additional permissions e.g. employee + finance.approve)
  select o.granted into v_override
  from public.organization_user_permission_overrides o
  where o.organization_id = p_organization_id and o.user_id = p_user_id and o.permission_key = p_permission_key;

  if v_override is not null then return v_override; end if;

  -- Role permission matrix
  select g.granted into v_granted
  from public.organization_role_permission_grants g
  where g.organization_id = p_organization_id and g.role_key = v_role and g.permission_key = p_permission_key;

  if v_granted is not null then return v_granted; end if;

  -- Legacy module role grants (Phase 501)
  if p_permission_key like '%.view' then
    return exists (
      select 1 from public.organization_module_role_grants lg
      where lg.organization_id = p_organization_id and lg.role_key = v_role
        and lg.module_key = split_part(p_permission_key, '.', 1)
        and (lg.can_view or lg.can_use)
    );
  end if;

  if p_permission_key like '%.manage' then
    return exists (
      select 1 from public.organization_module_role_grants lg
      where lg.organization_id = p_organization_id and lg.role_key = v_role
        and lg.module_key = split_part(p_permission_key, '.', 1) and lg.can_manage
    );
  end if;

  -- Default role baselines
  if v_role = 'read_only' and p_permission_key like '%.view' then return true; end if;
  if v_role in ('manager', 'team_lead') and p_permission_key like '%.view' then return false; end if;

  return false;
end; $$;

-- Module visibility: Installed + Role Allowed + Permission Granted
create or replace function public.is_user_module_visible(
  p_organization_id uuid,
  p_user_id uuid,
  p_module_key text
) returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_organization_module_active(p_organization_id, p_module_key) then
    return false;
  end if;
  return public.user_has_permission(p_organization_id, p_user_id, p_module_key || '.view');
end; $$;

-- Dynamic menu — only modules with view permission
create or replace function public.get_customer_app_navigation_modules()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  perform public._mre501_sync_core_modules(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'module_key', r.module_key, 'module_name', r.module_name,
    'module_slug', r.module_slug, 'navigation_location', r.navigation_location,
    'route_href', r.route_href, 'module_category', r.module_category,
    'permission_key', r.module_key || '.view'
  ) order by r.sort_order), '[]'::jsonb)
  into v_items
  from public.aipify_module_registry r
  where r.status = 'active'
    and public.is_user_module_visible(v_org_id, v_user_id, r.module_key);

  return jsonb_build_object(
    'found', true,
    'modules', v_items,
    'single_app', true,
    'visibility_rule', 'Installed + Role Allowed + Permission Granted'
  );
end; $$;

-- Seed default role permissions for an organization
create or replace function public._rpm504_seed_default_role_permissions(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_mod record; v_kind text;
begin
  if exists (select 1 from public.organization_role_permission_grants where organization_id = p_org_id limit 1) then
    return;
  end if;

  for v_mod in select module_key from public.aipify_module_registry where status = 'active'
  loop
    foreach v_kind in array public._rpm504_permission_kinds()
    loop
      -- Owner: all permissions
      insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
      values (p_org_id, 'owner', v_mod.module_key || '.' || v_kind, true)
      on conflict do nothing;

      -- Administrator: all except we rely on user_has_permission bypass
      insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
      values (p_org_id, 'administrator', v_mod.module_key || '.' || v_kind, true)
      on conflict do nothing;

      -- Manager: view, create, edit, approve, report, export
      if v_kind in ('view', 'create', 'edit', 'approve', 'report', 'export') then
        insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
        values (p_org_id, 'manager', v_mod.module_key || '.' || v_kind, true)
        on conflict do nothing;
        insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
        values (p_org_id, 'team_lead', v_mod.module_key || '.' || v_kind, true)
        on conflict do nothing;
      end if;

      -- Employee: view only on assigned modules (default false — APP assigns)
      -- Read only: view only
      if v_kind = 'view' then
        insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
        values (p_org_id, 'read_only', v_mod.module_key || '.' || v_kind, true)
        on conflict do nothing;
      end if;
    end loop;
  end loop;
end; $$;

-- Seed global templates
insert into public.role_permission_templates (template_key, name, description, industry, permissions, role_definitions, sort_order)
values
  ('small_business', 'Small Business', 'Owner + Employee baseline for small teams.', 'general',
    '["dashboard.view","companion.view","tasks.view","tasks.create","calendar.view"]'::jsonb,
    '[{"role_key":"owner","name":"Owner"},{"role_key":"employee","name":"Employee"}]'::jsonb, 10),
  ('professional_services', 'Professional Services', 'Manager oversight with client task workflows.', 'services',
    '["dashboard.view","tasks.view","tasks.create","tasks.edit","calendar.view","documents.view"]'::jsonb,
    '[{"role_key":"manager","name":"Manager"},{"role_key":"employee","name":"Consultant"}]'::jsonb, 20),
  ('commerce', 'Commerce', 'Commerce pack aligned roles.', 'commerce',
    '["commerce.view","commerce.create","commerce.edit","warehouse.view","support.view"]'::jsonb,
    '[{"role_key":"manager","name":"Commerce Manager"},{"role_key":"employee","name":"Sales Representative"}]'::jsonb, 30),
  ('warehouse', 'Warehouse', 'Warehouse department scope template.', 'warehouse',
    '["warehouse.view","warehouse.create","warehouse.edit","warehouse.manage","warehouse.report"]'::jsonb,
    '[{"role_key":"manager","name":"Warehouse Manager","department_scope_type":"department"}]'::jsonb, 40),
  ('support', 'Support', 'Support agent template.', 'support',
    '["support.view","support.create","support.edit","support.manage"]'::jsonb,
    '[{"role_key":"employee","name":"Support Agent"}]'::jsonb, 50),
  ('property_management', 'Property Management', 'Hosts and property operations.', 'hosts',
    '["hosts.view","hosts.create","hosts.manage","finance.view"]'::jsonb,
    '[{"role_key":"manager","name":"Property Manager"}]'::jsonb, 60),
  ('hospitality', 'Hospitality', 'Hospitality operations template.', 'hospitality',
    '["hosts.view","support.view","tasks.view"]'::jsonb,
    '[{"role_key":"manager","name":"Operations Manager"}]'::jsonb, 70),
  ('enterprise', 'Enterprise', 'Full matrix with manager and read-only tiers.', 'enterprise',
    '["dashboard.view","reports.export","settings.manage","users.manage","roles.manage"]'::jsonb,
    '[{"role_key":"administrator","name":"Administrator"},{"role_key":"manager","name":"Manager"},{"role_key":"read_only","name":"Read Only"}]'::jsonb, 80)
on conflict (template_key) do nothing;

-- Re-register permissions for all active modules
do $$ declare v_mod record; begin
  for v_mod in select module_key from public.aipify_module_permissions group by module_key
  loop
    perform public._rpm504_register_module_permissions(v_mod.module_key);
  end loop;
  for v_mod in select module_key from public.aipify_module_registry where status = 'active'
  loop
    perform public._rpm504_register_module_permissions(v_mod.module_key);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 8. APP — Role & Permission Matrix center
-- ---------------------------------------------------------------------------
create or replace function public.get_role_permission_matrix_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_roles jsonb;
  v_permissions jsonb;
  v_templates jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._emae503_seed_roles(v_org_id);
  perform public._rpm504_seed_default_role_permissions(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'role_key', r.role_key, 'name', r.name, 'description', r.description,
    'base_role', r.base_role, 'is_system', r.is_system, 'status', r.status,
    'department_scope_type', r.department_scope_type, 'department_id', r.department_id,
    'template_key', r.template_key,
    'assigned_count', (
      select count(*) from public.organization_employee_profiles p
      where p.organization_id = v_org_id and (p.org_role = r.role_key or p.custom_role_id = r.id)
    ),
    'permission_count', (
      select count(*) from public.organization_role_permission_grants g
      where g.organization_id = v_org_id and g.role_key = r.role_key and g.granted = true
    )
  ) order by r.name), '[]'::jsonb)
  into v_roles from public.organization_custom_roles r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', p.permission_key, 'module_key', p.module_key,
    'permission_kind', p.permission_kind, 'description', p.description
  ) order by p.module_key, p.permission_kind), '[]'::jsonb)
  into v_permissions from public.aipify_module_permissions p
  join public.aipify_module_registry r on r.module_key = p.module_key
  where r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'template_key', t.template_key, 'name', t.name, 'description', t.description, 'industry', t.industry
  ) order by t.sort_order), '[]'::jsonb)
  into v_templates from public.role_permission_templates t;

  perform public._rpm504_log(v_org_id, null, 'matrix_view', 'Role permission matrix viewed', 'app', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._rpm504_principle(),
    'visibility_rule', 'Module Installed → Role Allowed → Permission Granted → Visible',
    'default_roles', jsonb_build_array('owner', 'administrator', 'manager', 'team_lead', 'employee', 'read_only'),
    'permission_categories', public._rpm504_permission_kinds(),
    'roles', v_roles,
    'permissions', v_permissions,
    'templates', v_templates,
    'employees_route', '/app/employees',
    'module_access_route', '/app/settings/module-access'
  );
end; $$;

create or replace function public.get_role_permission_matrix_role(p_role_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_role jsonb; v_grants jsonb; v_employees jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();

  select jsonb_build_object(
    'id', r.id, 'role_key', r.role_key, 'name', r.name, 'description', r.description,
    'base_role', r.base_role, 'status', r.status,
    'department_scope_type', r.department_scope_type, 'department_id', r.department_id
  ) into v_role
  from public.organization_custom_roles r
  where r.organization_id = v_org_id and r.role_key = p_role_key;

  if v_role is null then return jsonb_build_object('found', false); end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'permission_key', g.permission_key, 'granted', g.granted
  )), '[]'::jsonb)
  into v_grants
  from public.organization_role_permission_grants g
  where g.organization_id = v_org_id and g.role_key = p_role_key;

  select coalesce(jsonb_agg(jsonb_build_object(
    'employee_id', p.id, 'full_name', p.full_name, 'email', p.email
  )), '[]'::jsonb)
  into v_employees
  from public.organization_employee_profiles p
  where p.organization_id = v_org_id and p.org_role = p_role_key;

  return jsonb_build_object('found', true, 'role', v_role, 'permissions', v_grants, 'assigned_employees', v_employees);
end; $$;

create or replace function public.get_role_permission_matrix_audit(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();
  return jsonb_build_object(
    'found', true,
    'audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'action', a.action, 'summary', a.summary, 'role_key', a.role_key, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (
        select * from public.role_permission_matrix_audit_logs
        where organization_id = v_org_id order by created_at desc limit greatest(1, least(p_limit, 100))
      ) a
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_role_permission_matrix_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_role_key text;
  v_role_id uuid;
  v_perm text;
begin
  perform public._bde_require_admin();
  v_org_id := public._presence_tenant_for_auth();

  if p_action_type = 'create_custom_role' then
    v_role_key := lower(regexp_replace(coalesce(p_payload->>'role_key', p_payload->>'name'), '[^a-zA-Z0-9]+', '_', 'g'));
    insert into public.organization_custom_roles (
      organization_id, role_key, name, description, base_role,
      department_scope_type, department_id, template_key
    ) values (
      v_org_id, v_role_key, p_payload->>'name',
      coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'base_role', ''), 'employee'),
      coalesce(nullif(p_payload->>'department_scope_type', ''), 'organization'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'template_key', '')
    )
    returning id into v_role_id;
    perform public._rpm504_log(v_org_id, v_role_key, 'role_created', 'Custom role created: ' || (p_payload->>'name'), 'app', p_payload);
    return jsonb_build_object('ok', true, 'role_id', v_role_id, 'role_key', v_role_key);
  end if;

  if p_action_type = 'update_role' then
    v_role_key := p_payload->>'role_key';
    update public.organization_custom_roles set
      name = coalesce(nullif(p_payload->>'name', ''), name),
      description = coalesce(nullif(p_payload->>'description', ''), description),
      department_scope_type = coalesce(nullif(p_payload->>'department_scope_type', ''), department_scope_type),
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      status = coalesce(nullif(p_payload->>'status', ''), status),
      updated_at = now()
    where organization_id = v_org_id and role_key = v_role_key and is_system = false;
    perform public._rpm504_log(v_org_id, v_role_key, 'role_edited', 'Role updated', 'app', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'delete_role' then
    v_role_key := p_payload->>'role_key';
    if v_role_key in ('owner', 'administrator') then raise exception 'System roles cannot be deleted'; end if;
    update public.organization_custom_roles set status = 'archived', updated_at = now()
    where organization_id = v_org_id and role_key = v_role_key and is_system = false;
    delete from public.organization_role_permission_grants where organization_id = v_org_id and role_key = v_role_key;
    perform public._rpm504_log(v_org_id, v_role_key, 'role_deleted', 'Role archived', 'app', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'set_role_permission' then
    v_role_key := p_payload->>'role_key';
    v_perm := p_payload->>'permission_key';
    insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted, granted_by_user_id)
    values (v_org_id, v_role_key, v_perm, coalesce((p_payload->>'granted')::boolean, true), (select id from public.users where auth_user_id = auth.uid() limit 1))
    on conflict (organization_id, role_key, permission_key) do update set
      granted = excluded.granted, updated_at = now();
    perform public._rpm504_log(v_org_id, v_role_key,
      case when coalesce((p_payload->>'granted')::boolean, true) then 'permission_granted' else 'permission_removed' end,
      'Permission matrix updated: ' || v_perm, 'app', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'assign_employee_role' then
    update public.organization_employee_profiles set
      org_role = coalesce(nullif(p_payload->>'role_key', ''), org_role),
      custom_role_id = nullif(p_payload->>'custom_role_id', '')::uuid,
      updated_at = now()
    where id = (p_payload->>'employee_id')::uuid and organization_id = v_org_id;
    perform public._rpm504_log(v_org_id, p_payload->>'role_key', 'role_assigned', 'Role assigned to employee', 'app', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'set_user_permission_override' then
    insert into public.organization_user_permission_overrides (
      organization_id, user_id, permission_key, granted, granted_by_user_id
    ) values (
      v_org_id,
      (p_payload->>'user_id')::uuid,
      p_payload->>'permission_key',
      coalesce((p_payload->>'granted')::boolean, true),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    )
    on conflict (organization_id, user_id, permission_key) do update set granted = excluded.granted, updated_at = now();
    perform public._rpm504_log(v_org_id, null, 'permission_granted', 'User permission override: ' || (p_payload->>'permission_key'), 'app', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Employee may have primary role plus additional permissions.');
  end if;

  if p_action_type = 'apply_template' then
    v_role_key := p_payload->>'template_key';
    for v_perm in
      select jsonb_array_elements_text(t.permissions)
      from public.role_permission_templates t where t.template_key = v_role_key
    loop
      insert into public.organization_role_permission_grants (organization_id, role_key, permission_key, granted)
      values (v_org_id, coalesce(nullif(p_payload->>'target_role_key', ''), 'employee'), v_perm, true)
      on conflict (organization_id, role_key, permission_key) do update set granted = true, updated_at = now();
    end loop;
    perform public._rpm504_log(v_org_id, v_role_key, 'template_applied', 'Role template applied: ' || v_role_key, 'app', p_payload);
    return jsonb_build_object('ok', true, 'message', 'Template permissions applied.');
  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- Super Admin — read-only governance visibility
create or replace function public.get_super_admin_role_permission_matrix_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._mre501_require_super_admin();

  return jsonb_build_object(
    'found', true,
    'privacy_note', 'Aggregates and permission catalog only — Super Admin cannot change APP permissions without governance.',
    'principle', public._rpm504_principle(),
    'catalog', jsonb_build_object(
      'total_permissions', (select count(*) from public.aipify_module_permissions),
      'total_modules', (select count(*) from public.aipify_module_registry where status = 'active'),
      'permission_kinds', to_jsonb(public._rpm504_permission_kinds())
    ),
    'adoption', jsonb_build_object(
      'organizations_with_grants', (select count(distinct organization_id) from public.organization_role_permission_grants),
      'total_role_grants', (select count(*) from public.organization_role_permission_grants where granted = true),
      'user_overrides', (select count(*) from public.organization_user_permission_overrides),
      'custom_roles', (select count(*) from public.organization_custom_roles where not is_system)
    ),
    'templates', (select count(*) from public.role_permission_templates),
    'recent_audit', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'organization_id', a.organization_id, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.role_permission_matrix_audit_logs order by created_at desc limit 25) a
    ), '[]'::jsonb),
    'governance_note', 'Super Admin may view structures and audit access issues — APP owners control live permissions.'
  );
end; $$;

-- Hook: business pack activation registers permissions (via module registry seed)
create or replace function public.activate_business_pack_modules(
  p_organization_id uuid,
  p_pack_key text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_count int := 0; v_module_key text;
begin
  if not public.is_platform_admin() and not public._mre501_org_subscription_active(p_organization_id) then
    raise exception 'Platform admin or active organization required';
  end if;

  for v_module_key in
    select module_key from public.aipify_module_registry
    where required_business_pack = p_pack_key and status = 'active'
  loop
    perform public._rpm504_register_module_permissions(v_module_key);

    insert into public.organization_module_activations (
      organization_id, module_key, activation_source, business_pack_key, menu_visible, licensed, status, activated_at
    ) values (
      p_organization_id, v_module_key, 'business_pack', p_pack_key, true, true, 'active', now()
    )
    on conflict (organization_id, module_key) do update set
      activation_source = 'business_pack', business_pack_key = p_pack_key,
      menu_visible = true, licensed = true, status = 'active',
      deactivated_at = null, updated_at = now();

    insert into public.tenant_modules (tenant_id, module_key, suite_key, licensed, enabled, status, activated_at)
    values (p_organization_id, v_module_key, p_pack_key, true, true, 'enabled', now())
    on conflict (tenant_id, module_key) do update set
      suite_key = p_pack_key, licensed = true, enabled = true, status = 'enabled', updated_at = now();

    v_count := v_count + 1;
  end loop;

  perform public._mre501_log('platform', 'pack_activated', null, p_organization_id,
    'Business pack modules activated with permission registration: ' || p_pack_key,
    jsonb_build_object('pack_key', p_pack_key, 'module_count', v_count));

  return jsonb_build_object('ok', true, 'pack_key', p_pack_key, 'modules_activated', v_count,
    'permissions_registered', true);
end; $$;

grant execute on function public.user_has_permission(uuid, uuid, text) to authenticated;
grant execute on function public.get_role_permission_matrix_center() to authenticated;
grant execute on function public.get_role_permission_matrix_role(text) to authenticated;
grant execute on function public.get_role_permission_matrix_audit(int) to authenticated;
grant execute on function public.perform_role_permission_matrix_action(text, jsonb) to authenticated;
grant execute on function public.get_super_admin_role_permission_matrix_overview() to authenticated;

-- Update module registry routes for Phase 504
update public.aipify_module_registry set route_href = '/app/employees', updated_at = now() where module_key = 'users';
update public.aipify_module_registry set route_href = '/app/settings/roles-permissions', updated_at = now() where module_key in ('roles', 'permissions');
