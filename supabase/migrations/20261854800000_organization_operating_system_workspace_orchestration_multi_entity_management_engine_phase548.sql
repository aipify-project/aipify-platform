-- Phase 548 — Organization Operating System, Workspace Orchestration & Multi-Entity Management Engine
-- Most companies are not one thing — Aipify understands organizational structure.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_operating_system_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  multi_brand_enabled boolean not null default true,
  multi_domain_governance_enabled boolean not null default true,
  workspace_engine_enabled boolean not null default true,
  health_engine_enabled boolean not null default true,
  cross_entity_reporting_enabled boolean not null default true,
  companion_advisor_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_operating_system_settings enable row level security;
revoke all on public.organization_operating_system_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Business entities & brands
-- ---------------------------------------------------------------------------
create table if not exists public.organization_business_entities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  parent_entity_id uuid references public.organization_business_entities (id) on delete set null,
  entity_key text not null,
  name text not null,
  entity_type text not null default 'company' check (
    entity_type in (
      'company', 'division', 'brand', 'department', 'location', 'subsidiary',
      'branch_office', 'operating_unit', 'custom'
    )
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  manager_user_id uuid references public.users (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  location_id uuid references public.organization_locations (id) on delete set null,
  employee_count integer not null default 0 check (employee_count >= 0),
  business_packs jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived', 'pending_setup')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, entity_key)
);

create index if not exists organization_business_entities_org_idx
  on public.organization_business_entities (organization_id, entity_type, status);

alter table public.organization_business_entities enable row level security;
revoke all on public.organization_business_entities from authenticated, anon;

create table if not exists public.organization_brands (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  brand_key text not null,
  name text not null,
  entity_id uuid references public.organization_business_entities (id) on delete set null,
  primary_domain_id uuid references public.organization_domains (id) on delete set null,
  employee_count integer not null default 0,
  business_packs jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, brand_key)
);

alter table public.organization_brands enable row level security;
revoke all on public.organization_brands from authenticated, anon;

create table if not exists public.organization_business_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  unit_key text not null,
  name text not null,
  entity_id uuid references public.organization_business_entities (id) on delete set null,
  parent_unit_id uuid references public.organization_business_units (id) on delete set null,
  manager_user_id uuid references public.users (id) on delete set null,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, unit_key)
);

alter table public.organization_business_units enable row level security;
revoke all on public.organization_business_units from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Workspaces
-- ---------------------------------------------------------------------------
create table if not exists public.organization_operating_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_key text not null,
  name text not null,
  workspace_type text not null default 'general' check (
    workspace_type in (
      'head_office', 'retail', 'support', 'commerce', 'warehouse',
      'property_management', 'executive', 'general', 'custom'
    )
  ),
  brand_id uuid references public.organization_brands (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  location_id uuid references public.organization_locations (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  business_packs jsonb not null default '[]'::jsonb,
  user_count integer not null default 0,
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, workspace_key)
);

create index if not exists organization_operating_workspaces_org_idx
  on public.organization_operating_workspaces (organization_id, workspace_type, status);

alter table public.organization_operating_workspaces enable row level security;
revoke all on public.organization_operating_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Health snapshots & audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_operating_health_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scope_type text not null check (
    scope_type in ('organization', 'entity', 'brand', 'domain', 'department', 'workspace', 'location')
  ),
  scope_id uuid,
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'needs_attention', 'critical')
  ),
  health_score integer not null default 70 check (health_score between 0 and 100),
  summary text not null default '',
  recorded_at timestamptz not null default now()
);

create index if not exists organization_operating_health_org_idx
  on public.organization_operating_health_snapshots (organization_id, scope_type, recorded_at desc);

alter table public.organization_operating_health_snapshots enable row level security;
revoke all on public.organization_operating_health_snapshots from authenticated, anon;

create table if not exists public.organization_operating_system_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'entity_created', 'department_created', 'workspace_created', 'location_added',
      'brand_added', 'domain_assigned', 'organization_updated', 'health_updated'
    )
  ),
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_operating_system_audit_org_idx
  on public.organization_operating_system_audit_logs (organization_id, created_at desc);

alter table public.organization_operating_system_audit_logs enable row level security;
revoke all on public.organization_operating_system_audit_logs from authenticated, anon;

-- Extend location types
alter table public.organization_locations drop constraint if exists organization_locations_location_type_check;
alter table public.organization_locations add constraint organization_locations_location_type_check
  check (location_type in (
    'office', 'remote', 'international', 'hybrid', 'warehouse', 'property', 'store', 'region'
  ));

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._org548_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._org548_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_operating_system_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
  perform public._org511_ensure_settings(p_org_id);
end; $$;

create or replace function public._org548_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_operating_system_audit_logs (
    organization_id, actor_user_id, event_type, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._org548_health_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score < 40 then 'critical'
    when p_score < 70 then 'needs_attention'
    else 'healthy'
  end;
$$;

create or replace function public._org548_seed_structure(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._org511_seed_departments(p_org_id);
  perform public._org511_seed_locations(p_org_id);

  insert into public.organization_business_entities (organization_id, entity_key, name, entity_type)
  values (p_org_id, 'parent_company', 'Parent Company', 'company')
  on conflict (organization_id, entity_key) do nothing;

  insert into public.organization_brands (organization_id, brand_key, name)
  values
    (p_org_id, 'brand_a', 'Brand A'),
    (p_org_id, 'brand_b', 'Brand B')
  on conflict (organization_id, brand_key) do nothing;

  insert into public.organization_business_units (organization_id, unit_key, name)
  values
    (p_org_id, 'sales', 'Sales'),
    (p_org_id, 'operations', 'Operations'),
    (p_org_id, 'support', 'Support'),
    (p_org_id, 'finance', 'Finance')
  on conflict (organization_id, unit_key) do nothing;

  insert into public.organization_operating_workspaces (organization_id, workspace_key, name, workspace_type)
  values
    (p_org_id, 'head_office', 'Head Office', 'head_office'),
    (p_org_id, 'support', 'Support', 'support'),
    (p_org_id, 'commerce', 'Commerce', 'commerce'),
    (p_org_id, 'warehouse', 'Warehouse', 'warehouse'),
    (p_org_id, 'executive', 'Executive Office', 'executive')
  on conflict (organization_id, workspace_key) do nothing;

  insert into public.organization_operating_health_snapshots (
    organization_id, scope_type, health_status, health_score, summary
  ) values (
    p_org_id, 'organization', 'healthy', 72,
    'Organization health baseline recorded.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_operating_system_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_mgmt jsonb;
  v_overview jsonb;
  v_structure jsonb;
  v_entities jsonb;
  v_brands jsonb;
  v_units jsonb;
  v_workspaces jsonb;
  v_domains jsonb;
  v_departments jsonb;
  v_locations jsonb;
  v_health jsonb;
  v_executive jsonb;
  v_department_view jsonb;
  v_manager_view jsonb;
  v_reports jsonb;
  v_companion jsonb;
  v_journey jsonb;
  v_audit jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._org548_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._org548_ensure_settings(v_org_id);
  perform public._org548_seed_structure(v_org_id);
  perform public._org548_log(v_org_id, 'organization_updated', 'Organization Operating System center viewed', 'overview');

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;
  v_mgmt := public.get_organization_management_center();

  select jsonb_build_object(
    'entities', (select count(*) from public.organization_business_entities where organization_id = v_org_id and status = 'active'),
    'brands', (select count(*) from public.organization_brands where organization_id = v_org_id and status = 'active'),
    'business_units', (select count(*) from public.organization_business_units where organization_id = v_org_id and status = 'active'),
    'workspaces', (select count(*) from public.organization_operating_workspaces where organization_id = v_org_id and status = 'active'),
    'domains', (select count(*) from public.organization_domains where organization_id = v_org_id),
    'departments', v_mgmt->'overview'->'departments',
    'locations', v_mgmt->'overview'->'locations',
    'teams', v_mgmt->'overview'->'teams',
    'employees', v_mgmt->'overview'->'active_employees',
    'organization_health_score', coalesce((
      select health_score from public.organization_operating_health_snapshots
      where organization_id = v_org_id and scope_type = 'organization'
      order by recorded_at desc limit 1
    ), 72),
    'organization_health_status', coalesce((
      select health_status from public.organization_operating_health_snapshots
      where organization_id = v_org_id and scope_type = 'organization'
      order by recorded_at desc limit 1
    ), 'healthy')
  ) into v_overview;

  select jsonb_build_object(
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'business_units', coalesce((
      select jsonb_agg(jsonb_build_object('id', u.id, 'name', u.name, 'unit_key', u.unit_key) order by u.name)
      from public.organization_business_units u where u.organization_id = v_org_id and u.status = 'active'
    ), '[]'::jsonb),
    'departments', v_mgmt->'departments',
    'teams', v_mgmt->'teams',
    'employees', v_mgmt->'overview'->'active_employees'
  ) into v_structure;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'entity_key', e.entity_key, 'name', e.name, 'entity_type', e.entity_type,
    'status', e.status, 'employee_count', e.employee_count, 'business_packs', e.business_packs
  ) order by e.name), '[]'::jsonb)
  into v_entities
  from public.organization_business_entities e
  where e.organization_id = v_org_id and e.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'brand_key', b.brand_key, 'name', b.name,
    'employee_count', b.employee_count, 'business_packs', b.business_packs,
    'domain_id', b.primary_domain_id
  ) order by b.name), '[]'::jsonb)
  into v_brands
  from public.organization_brands b
  where b.organization_id = v_org_id and b.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', u.id, 'unit_key', u.unit_key, 'name', u.name
  ) order by u.name), '[]'::jsonb)
  into v_units
  from public.organization_business_units u
  where u.organization_id = v_org_id and u.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'workspace_key', w.workspace_key, 'name', w.name,
    'workspace_type', w.workspace_type, 'user_count', w.user_count,
    'business_packs', w.business_packs, 'domain_id', w.domain_id,
    'department_id', w.department_id, 'location_id', w.location_id, 'brand_id', w.brand_id
  ) order by w.name), '[]'::jsonb)
  into v_workspaces
  from public.organization_operating_workspaces w
  where w.organization_id = v_org_id and w.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'domain', d.domain, 'verification_status', d.verification_status,
    'assigned_departments', (
      select count(*) from public.organization_department_domains dd
      where dd.domain_id = d.id
    ),
    'assigned_packs', (
      select count(*) from public.organization_department_business_packs bp
      where bp.domain_id = d.id
    )
  ) order by d.domain), '[]'::jsonb)
  into v_domains
  from public.organization_domains d
  where d.organization_id = v_org_id;

  v_departments := v_mgmt->'departments';
  v_locations := v_mgmt->'locations';

  select coalesce(jsonb_agg(jsonb_build_object(
    'scope_type', h.scope_type, 'scope_id', h.scope_id,
    'health_status', h.health_status, 'health_score', h.health_score, 'summary', h.summary
  ) order by h.recorded_at desc), '[]'::jsonb)
  into v_health
  from public.organization_operating_health_snapshots h
  where h.organization_id = v_org_id
  limit 50;

  select jsonb_build_object(
    'organization_health', v_overview->'organization_health_status',
    'brands_count', v_overview->'brands',
    'domains_count', v_overview->'domains',
    'business_units_count', v_overview->'business_units',
    'departments_count', v_overview->'departments',
    'workspaces_count', v_overview->'workspaces',
    'growth_trend', 'stable'
  ) into v_executive;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'name', d.name, 'employees', (
      select count(*) from public.organization_employee_profiles p
      where p.department_id = d.id and p.employee_status = 'active'
    ),
    'teams', (select count(*) from public.organization_teams t where t.department_id = d.id and t.is_active),
    'open_tasks', 0
  ) order by d.name), '[]'::jsonb)
  into v_department_view
  from public.organization_departments d
  where d.organization_id = v_org_id and d.is_active = true;

  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', m.user_id, 'department_name', dep.name, 'manager_role', m.manager_role
  )), '[]'::jsonb)
  into v_manager_view
  from public.organization_department_managers m
  join public.organization_departments dep on dep.id = m.department_id
  where m.organization_id = v_org_id;

  select jsonb_build_object(
    'revenue_by_brand', jsonb_build_array('Brand A — operational', 'Brand B — growing'),
    'performance_by_department', v_mgmt->'reports'->'department_sizes',
    'assets_by_location', v_locations,
    'domain_distribution', v_domains,
    'business_pack_distribution', (
      select coalesce(jsonb_agg(jsonb_build_object('pack_key', bp.pack_key, 'department_id', bp.department_id)), '[]'::jsonb)
      from public.organization_department_business_packs bp where bp.organization_id = v_org_id
    )
  ) into v_reports;

  select jsonb_build_object(
    'advisor_prompts', jsonb_build_array(
      'Show all departments.',
      'Which domains perform best?',
      'Which locations need attention?',
      'Show organization structure.',
      'Generate executive organization summary.'
    ),
    'hierarchy_aware', true,
    'entity_count', jsonb_array_length(v_entities),
    'brand_count', jsonb_array_length(v_brands),
    'domain_count', jsonb_array_length(v_domains)
  ) into v_companion;

  select coalesce(jsonb_agg(jsonb_build_object(
    'event_type', a.event_type, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from public.organization_operating_system_audit_logs a
  where a.organization_id = v_org_id
  limit 30;

  return jsonb_build_object(
    'found', true,
    'principle', 'Most companies are not one thing — Aipify understands organizational structure.',
    'philosophy', 'Organizations are living structures. Aipify understands how businesses are organized, operate, and grow.',
    'section', coalesce(nullif(p_section, ''), 'overview'),
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', v_overview,
    'structure_engine', v_structure,
    'structure_map', v_structure,
    'business_entities', v_entities,
    'brands', v_brands,
    'business_units', v_units,
    'workspaces', v_workspaces,
    'domains', v_domains,
    'multi_domain_governance', jsonb_build_object('domains', v_domains, 'governance_enabled', true),
    'departments', v_departments,
    'locations', v_locations,
    'organization_health', v_health,
    'health_engine', jsonb_build_object('snapshots', v_health, 'overall', v_overview->'organization_health_status'),
    'executive_view', v_executive,
    'executive_dashboard', v_executive,
    'department_view', v_department_view,
    'manager_view', v_manager_view,
    'cross_entity_reporting', v_reports,
    'reports', v_reports,
    'companion_advisor', v_companion,
    'business_pack_awareness', jsonb_build_object(
      'scopes', jsonb_build_array('organization', 'brand', 'domain', 'department', 'location', 'workspace')
    ),
    'permissions_integration', jsonb_build_object(
      'scopes', jsonb_build_array('department_manager', 'regional_manager', 'executive')
    ),
    'search_integration', jsonb_build_object('connected', true, 'route', '/app/search'),
    'management_center', v_mgmt,
    'audit_recent', v_audit,
    'mobile_access', jsonb_build_object(
      'supported', true,
      'capabilities', jsonb_build_array(
        'review_structure', 'review_departments', 'review_domains',
        'review_brands', 'review_reports'
      )
    ),
    'routes', jsonb_build_object(
      'organization', '/app/organization',
      'workspaces', '/app/workspaces',
      'domains', '/app/settings/domains',
      'employees', '/app/employees',
      'legacy_management', '/app/organization'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions, search, companion, mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_operating_system_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._org548_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'create_entity' then
    insert into public.organization_business_entities (organization_id, entity_key, name, entity_type)
    values (
      v_org_id,
      coalesce(p_payload->>'entity_key', lower(replace(p_payload->>'name', ' ', '_'))),
      coalesce(p_payload->>'name', 'New Entity'),
      coalesce(p_payload->>'entity_type', 'custom')
    );
    perform public._org548_log(v_org_id, 'entity_created', 'Business entity created.', 'entities', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_brand' then
    insert into public.organization_brands (organization_id, brand_key, name)
    values (
      v_org_id,
      coalesce(p_payload->>'brand_key', lower(replace(p_payload->>'name', ' ', '_'))),
      coalesce(p_payload->>'name', 'New Brand')
    );
    perform public._org548_log(v_org_id, 'brand_added', 'Brand added.', 'brands', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_workspace' then
    insert into public.organization_operating_workspaces (organization_id, workspace_key, name, workspace_type)
    values (
      v_org_id,
      coalesce(p_payload->>'workspace_key', lower(replace(p_payload->>'name', ' ', '_'))),
      coalesce(p_payload->>'name', 'New Workspace'),
      coalesce(p_payload->>'workspace_type', 'general')
    );
    perform public._org548_log(v_org_id, 'workspace_created', 'Workspace created.', 'workspaces', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'create_business_unit' then
    insert into public.organization_business_units (organization_id, unit_key, name)
    values (
      v_org_id,
      coalesce(p_payload->>'unit_key', lower(replace(p_payload->>'name', ' ', '_'))),
      coalesce(p_payload->>'name', 'New Business Unit')
    );
    perform public._org548_log(v_org_id, 'organization_updated', 'Business unit created.', 'structure', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'refresh_health' then
    insert into public.organization_operating_health_snapshots (
      organization_id, scope_type, health_status, health_score, summary
    ) values (
      v_org_id, 'organization',
      public._org548_health_status(coalesce((p_payload->>'health_score')::int, 72)),
      coalesce((p_payload->>'health_score')::int, 72),
      'Organization health refreshed.'
    );
    perform public._org548_log(v_org_id, 'health_updated', 'Organization health score updated.', 'health', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'delegate_management' then
    return public.perform_organization_management_action(p_action_type, p_payload);
  end if;

  return public.perform_organization_management_action(p_action_type, p_payload);
end; $$;

create or replace function public.search_organization_operating_system(p_query text, p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_results jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._org548_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'results', '[]'::jsonb); end if;

  select coalesce(jsonb_agg(row), '[]'::jsonb) into v_results
  from (
    select jsonb_build_object('result_type', 'department', 'id', d.id, 'title', d.name, 'subtitle', 'Department') as row
    from public.organization_departments d
    where d.organization_id = v_org_id and d.is_active and d.name ilike '%' || p_query || '%'
    union all
    select jsonb_build_object('result_type', 'brand', 'id', b.id, 'title', b.name, 'subtitle', 'Brand')
    from public.organization_brands b
    where b.organization_id = v_org_id and b.status = 'active' and b.name ilike '%' || p_query || '%'
    union all
    select jsonb_build_object('result_type', 'workspace', 'id', w.id, 'title', w.name, 'subtitle', 'Workspace')
    from public.organization_operating_workspaces w
    where w.organization_id = v_org_id and w.status = 'active' and w.name ilike '%' || p_query || '%'
    union all
    select jsonb_build_object('result_type', 'entity', 'id', e.id, 'title', e.name, 'subtitle', e.entity_type)
    from public.organization_business_entities e
    where e.organization_id = v_org_id and e.status = 'active' and e.name ilike '%' || p_query || '%'
    limit greatest(1, least(p_limit, 50))
  ) sub;

  return jsonb_build_object('found', true, 'query', p_query, 'results', v_results);
end; $$;

create or replace function public.get_companion_organization_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_operating_system_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'advisor', v_center->'companion_advisor',
    'structure_summary', v_center->'structure_engine',
    'health', v_center->'overview'->'organization_health_status',
    'routes', v_center->'routes'
  );
end; $$;

create or replace function public.get_my_organization_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_operating_system_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'organization_name', v_center->'organization'->>'name',
    'health_status', v_center->'overview'->>'organization_health_status',
    'departments', v_center->'overview'->'departments',
    'workspaces', v_center->'overview'->'workspaces',
    'brands', v_center->'overview'->'brands',
    'domains', v_center->'overview'->'domains',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_operating_system_center(text) to authenticated;
grant execute on function public.perform_organization_operating_system_action(text, jsonb) to authenticated;
grant execute on function public.search_organization_operating_system(text, int) to authenticated;
grant execute on function public.get_companion_organization_advisor_context(text) to authenticated;
grant execute on function public.get_my_organization_summary() to authenticated;
