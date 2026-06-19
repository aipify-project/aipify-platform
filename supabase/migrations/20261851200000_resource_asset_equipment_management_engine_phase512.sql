-- Phase 512 — Resource, Asset & Equipment Management Engine
-- Employees come and go. Assets remain.
-- Integrates: Organization (511), Calendar (507), Tasks (506), Domains (505A), Business Packs

-- ---------------------------------------------------------------------------
-- 1. Core assets
-- ---------------------------------------------------------------------------
create table if not exists public.organization_assets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_number text not null,
  name text not null,
  category text not null default 'equipment' check (
    category in (
      'computer', 'laptop', 'monitor', 'phone', 'tablet', 'vehicle', 'machinery', 'tool',
      'warehouse_equipment', 'property', 'office_equipment', 'software_license', 'meeting_room', 'custom'
    )
  ),
  asset_type text not null default 'equipment' check (
    asset_type in ('equipment', 'vehicle', 'property', 'it_equipment', 'software_license', 'facility', 'custom')
  ),
  status text not null default 'active' check (
    status in ('active', 'reserved', 'maintenance_required', 'restricted', 'retired')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  assigned_employee_id uuid references public.organization_employee_profiles (id) on delete set null,
  assigned_team_id uuid references public.organization_teams (id) on delete set null,
  location_id uuid references public.organization_locations (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  calendar_resource_id uuid references public.organization_calendar_resources (id) on delete set null,
  purchase_date date,
  warranty_date date,
  purchase_cost numeric(14, 2),
  current_value numeric(14, 2),
  is_reservable boolean not null default false,
  notes text not null default '',
  attachments jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, asset_number)
);

create index if not exists organization_assets_org_status_idx
  on public.organization_assets (organization_id, status, category);

create index if not exists organization_assets_org_dept_idx
  on public.organization_assets (organization_id, department_id);

create index if not exists organization_assets_org_type_idx
  on public.organization_assets (organization_id, asset_type, status);

alter table public.organization_assets enable row level security;
revoke all on public.organization_assets from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Assignments, maintenance, reservations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_asset_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid not null references public.organization_assets (id) on delete cascade,
  assignment_type text not null check (
    assignment_type in ('employee', 'department', 'team', 'location', 'business_pack')
  ),
  assigned_to_id uuid,
  assigned_label text,
  assigned_by uuid references public.users (id) on delete set null,
  assigned_at timestamptz not null default now(),
  returned_at timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists organization_asset_assignments_asset_idx
  on public.organization_asset_assignments (organization_id, asset_id, assigned_at desc);

alter table public.organization_asset_assignments enable row level security;
revoke all on public.organization_asset_assignments from authenticated, anon;

create table if not exists public.organization_asset_maintenance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid not null references public.organization_assets (id) on delete cascade,
  maintenance_type text not null default 'scheduled' check (
    maintenance_type in ('inspection', 'repair', 'service', 'warranty_check', 'replacement', 'scheduled')
  ),
  status text not null default 'scheduled' check (
    status in ('scheduled', 'in_progress', 'completed', 'cancelled', 'overdue')
  ),
  title text not null,
  description text not null default '',
  scheduled_at timestamptz,
  completed_at timestamptz,
  cost numeric(14, 2),
  task_id uuid,
  performed_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_asset_maintenance_asset_idx
  on public.organization_asset_maintenance (organization_id, asset_id, status);

alter table public.organization_asset_maintenance enable row level security;
revoke all on public.organization_asset_maintenance from authenticated, anon;

create table if not exists public.organization_asset_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid not null references public.organization_assets (id) on delete cascade,
  reserved_by uuid references public.users (id) on delete set null,
  employee_profile_id uuid references public.organization_employee_profiles (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (
    status in ('pending', 'confirmed', 'cancelled', 'completed')
  ),
  calendar_event_id uuid references public.organization_calendar_events (id) on delete set null,
  purpose text not null default '',
  conflict_detected boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists organization_asset_reservations_asset_range_idx
  on public.organization_asset_reservations (organization_id, asset_id, starts_at, ends_at);

alter table public.organization_asset_reservations enable row level security;
revoke all on public.organization_asset_reservations from authenticated, anon;

create table if not exists public.organization_asset_software_licenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid not null unique references public.organization_assets (id) on delete cascade,
  vendor text not null default '',
  license_name text not null,
  seat_count integer not null default 1,
  seats_used integer not null default 0,
  renewal_date date,
  annual_cost numeric(14, 2),
  license_status text not null default 'active' check (
    license_status in ('active', 'expiring', 'expired', 'cancelled')
  ),
  assigned_user_ids jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_asset_software_licenses enable row level security;
revoke all on public.organization_asset_software_licenses from authenticated, anon;

create table if not exists public.organization_asset_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid references public.organization_assets (id) on delete set null,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_asset_audit_org_idx
  on public.organization_asset_audit_logs (organization_id, created_at desc);

alter table public.organization_asset_audit_logs enable row level security;
revoke all on public.organization_asset_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ast512_log(
  p_org_id uuid, p_asset_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_asset_audit_logs (
    organization_id, asset_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id, p_asset_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._ast512_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._ast512_next_asset_number(p_org_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_seq int;
begin
  select count(*) + 1 into v_seq from public.organization_assets where organization_id = p_org_id;
  return 'AST-' || lpad(v_seq::text, 5, '0');
end; $$;

create or replace function public._ast512_asset_json(p_row public.organization_assets)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'asset_number', p_row.asset_number,
    'name', p_row.name,
    'category', p_row.category,
    'asset_type', p_row.asset_type,
    'status', p_row.status,
    'department_id', p_row.department_id,
    'owner_user_id', p_row.owner_user_id,
    'assigned_employee_id', p_row.assigned_employee_id,
    'assigned_team_id', p_row.assigned_team_id,
    'location_id', p_row.location_id,
    'domain_id', p_row.domain_id,
    'business_pack_key', p_row.business_pack_key,
    'calendar_resource_id', p_row.calendar_resource_id,
    'purchase_date', p_row.purchase_date,
    'warranty_date', p_row.warranty_date,
    'purchase_cost', p_row.purchase_cost,
    'current_value', p_row.current_value,
    'is_reservable', p_row.is_reservable,
    'notes', p_row.notes,
    'attachments', p_row.attachments,
    'metadata', p_row.metadata,
    'created_at', p_row.created_at,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._ast512_detect_reservation_conflict(
  p_org_id uuid, p_asset_id uuid, p_starts_at timestamptz, p_ends_at timestamptz, p_exclude_id uuid default null
)
returns boolean language plpgsql stable security definer set search_path = public as $$
begin
  return exists (
    select 1 from public.organization_asset_reservations r
    where r.organization_id = p_org_id
      and r.asset_id = p_asset_id
      and r.status in ('pending', 'confirmed')
      and (p_exclude_id is null or r.id <> p_exclude_id)
      and r.starts_at < p_ends_at and r.ends_at > p_starts_at
  );
end; $$;

create or replace function public._ast512_sync_calendar_resource(p_org_id uuid, p_asset_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_asset public.organization_assets;
  v_resource_id uuid;
  v_type text;
begin
  select * into v_asset from public.organization_assets where id = p_asset_id and organization_id = p_org_id;
  if v_asset.id is null or not v_asset.is_reservable then return v_asset.calendar_resource_id; end if;

  v_type := case v_asset.asset_type
    when 'vehicle' then 'vehicle'
    when 'property' then 'property'
    when 'facility' then 'meeting_room'
    else 'equipment'
  end;

  if v_asset.calendar_resource_id is not null then
    update public.organization_calendar_resources set
      name = v_asset.name, resource_type = v_type, is_active = v_asset.status <> 'retired', updated_at = now()
    where id = v_asset.calendar_resource_id;
    return v_asset.calendar_resource_id;
  end if;

  insert into public.organization_calendar_resources (
    organization_id, resource_key, name, resource_type, location, metadata
  ) values (
    p_org_id,
    'asset_' || lower(replace(v_asset.asset_number, '-', '_')),
    v_asset.name, v_type,
    coalesce(v_asset.metadata->>'location_label', ''),
    jsonb_build_object('asset_id', v_asset.id, 'asset_number', v_asset.asset_number)
  )
  on conflict (organization_id, resource_key) do update set name = excluded.name, updated_at = now()
  returning id into v_resource_id;

  update public.organization_assets set calendar_resource_id = v_resource_id, updated_at = now()
  where id = p_asset_id;

  return v_resource_id;
end; $$;

create or replace function public._ast512_create_maintenance_task(
  p_org_id uuid, p_asset_id uuid, p_title text, p_due date, p_dept uuid
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_task_id uuid; v_result jsonb;
begin
  if not exists (select 1 from pg_proc where proname = 'perform_task_management_action') then return null; end if;
  begin
    v_result := public.perform_task_management_action('create_task', jsonb_build_object(
      'title', p_title,
      'description', 'Maintenance task for asset',
      'due_date', p_due,
      'department_id', p_dept,
      'related_module_key', 'assets',
      'priority', 'important',
      'metadata', jsonb_build_object('asset_id', p_asset_id, 'source', 'asset_maintenance')
    ));
    v_task_id := nullif(v_result->'task'->>'id', '')::uuid;
  exception when others then v_task_id := null;
  end;
  return v_task_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Asset Management Center
-- ---------------------------------------------------------------------------
create or replace function public.get_asset_management_center(
  p_category text default null,
  p_asset_type text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_assets jsonb;
  v_overview jsonb;
  v_maintenance jsonb;
  v_reservations jsonb;
  v_licenses jsonb;
  v_reports jsonb;
  v_audit jsonb;
begin
  perform public._bde_require_admin();
  v_org_id := public._ast512_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._ast512_log(v_org_id, null, 'center_view', 'Asset Management Center viewed', '{}'::jsonb);

  select jsonb_build_object(
    'total_assets', (select count(*) from public.organization_assets where organization_id = v_org_id and status <> 'retired'),
    'active', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'active'),
    'maintenance_required', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'maintenance_required'),
    'vehicles', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'vehicle' and status <> 'retired'),
    'software_licenses', (select count(*) from public.organization_asset_software_licenses sl join public.organization_assets a on a.id = sl.asset_id where sl.organization_id = v_org_id),
    'properties', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'property' and status <> 'retired'),
    'it_equipment', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'it_equipment' and status <> 'retired'),
    'reserved', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'reserved'),
    'warranty_expiring_30d', (
      select count(*) from public.organization_assets
      where organization_id = v_org_id and warranty_date between current_date and current_date + 30
    )
  ) into v_overview;

  select coalesce(jsonb_agg(
    public._ast512_asset_json(a) || jsonb_build_object(
      'department_name', (select name from public.organization_departments where id = a.department_id),
      'assigned_employee_name', (select full_name from public.organization_employee_profiles where id = a.assigned_employee_id),
      'domain', (select domain from public.organization_domains where id = a.domain_id),
      'location_name', (select name from public.organization_locations where id = a.location_id)
    ) order by a.asset_number
  ), '[]'::jsonb)
  into v_assets
  from public.organization_assets a
  where a.organization_id = v_org_id
    and (p_category is null or p_category = '' or a.category = p_category)
    and (p_asset_type is null or p_asset_type = '' or a.asset_type = p_asset_type);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'asset_id', m.asset_id, 'asset_name', (select name from public.organization_assets where id = m.asset_id),
    'maintenance_type', m.maintenance_type, 'status', m.status, 'title', m.title,
    'scheduled_at', m.scheduled_at, 'cost', m.cost
  ) order by m.scheduled_at nulls last), '[]'::jsonb)
  into v_maintenance
  from public.organization_asset_maintenance m
  where m.organization_id = v_org_id and m.status in ('scheduled', 'in_progress', 'overdue');

  select coalesce(jsonb_agg(row_to_json(r)), '[]'::jsonb)
  into v_reservations
  from (
    select r.id, r.asset_id, (select name from public.organization_assets where id = r.asset_id) as asset_name,
      r.starts_at, r.ends_at, r.status, r.purpose
    from public.organization_asset_reservations r
    where r.organization_id = v_org_id and r.ends_at >= now() and r.status in ('pending', 'confirmed')
    order by r.starts_at
    limit 20
  ) r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'asset_id', sl.asset_id, 'license_name', sl.license_name, 'vendor', sl.vendor,
    'seat_count', sl.seat_count, 'seats_used', sl.seats_used, 'seats_available', sl.seat_count - sl.seats_used,
    'renewal_date', sl.renewal_date, 'license_status', sl.license_status, 'annual_cost', sl.annual_cost
  ) order by sl.renewal_date nulls last), '[]'::jsonb)
  into v_licenses
  from public.organization_asset_software_licenses sl
  where sl.organization_id = v_org_id;

  v_reports := jsonb_build_object(
    'total_value', (select coalesce(sum(current_value), 0) from public.organization_assets where organization_id = v_org_id and status <> 'retired'),
    'purchase_value', (select coalesce(sum(purchase_cost), 0) from public.organization_assets where organization_id = v_org_id),
    'maintenance_costs_ytd', (
      select coalesce(sum(cost), 0) from public.organization_asset_maintenance
      where organization_id = v_org_id and status = 'completed' and completed_at >= date_trunc('year', now())
    ),
    'department_distribution', coalesce((
      select jsonb_agg(jsonb_build_object(
        'department', d.name, 'asset_count', cnt
      ) order by cnt desc)
      from (
        select department_id, count(*) cnt from public.organization_assets
        where organization_id = v_org_id and status <> 'retired' and department_id is not null
        group by department_id
      ) x
      join public.organization_departments d on d.id = x.department_id
    ), '[]'::jsonb),
    'warranty_expirations', coalesce((
      select jsonb_agg(row_to_json(w))
      from (
        select asset_number, name, warranty_date
        from public.organization_assets
        where organization_id = v_org_id and warranty_date between current_date and current_date + 90
        order by warranty_date
        limit 10
      ) w
    ), '[]'::jsonb),
    'license_consumption', coalesce((
      select jsonb_agg(jsonb_build_object('license_name', license_name, 'seats_used', seats_used, 'seat_count', seat_count))
      from public.organization_asset_software_licenses where organization_id = v_org_id
    ), '[]'::jsonb)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'action', a.action, 'summary', a.summary, 'asset_id', a.asset_id, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (select * from public.organization_asset_audit_logs where organization_id = v_org_id order by created_at desc limit 15) a;

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees come and go. Assets remain. Aipify always knows what exists, who is responsible, where it is, and how it is used.',
    'structure', 'PLATFORM → APP → ASSETS → DEPARTMENTS → EMPLOYEES',
    'overview', v_overview,
    'assets', v_assets,
    'maintenance', v_maintenance,
    'reservations', v_reservations,
    'software_licenses', v_licenses,
    'reports', v_reports,
    'audit_recent', v_audit,
    'categories', jsonb_build_array(
      'computer', 'laptop', 'monitor', 'phone', 'tablet', 'vehicle', 'machinery', 'tool',
      'warehouse_equipment', 'property', 'office_equipment', 'software_license', 'meeting_room', 'custom'
    ),
    'statuses', jsonb_build_array('active', 'reserved', 'maintenance_required', 'restricted', 'retired'),
    'routes', jsonb_build_object(
      'vehicles', '/app/assets/vehicles',
      'calendar', '/app/calendar',
      'tasks', '/app/tasks',
      'organization', '/app/organization'
    ),
    'sections', jsonb_build_array(
      'overview', 'assets', 'equipment', 'vehicles', 'properties', 'it_equipment',
      'software_licenses', 'assignments', 'maintenance', 'reports'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_asset_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_asset_id uuid;
  v_row public.organization_assets;
  v_maint_id uuid;
  v_task_id uuid;
  v_res_id uuid;
  v_conflict boolean;
  v_event_id uuid;
  v_resource_id uuid;
  v_dept_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._ast512_org();
  v_asset_id := nullif(p_payload->>'asset_id', '')::uuid;

  if p_action_type = 'create_asset' then
    insert into public.organization_assets (
      organization_id, asset_number, name, category, asset_type, status,
      department_id, owner_user_id, location_id, domain_id, business_pack_key,
      purchase_date, warranty_date, purchase_cost, current_value, is_reservable, notes, metadata
    ) values (
      v_org_id,
      coalesce(nullif(p_payload->>'asset_number', ''), public._ast512_next_asset_number(v_org_id)),
      p_payload->>'name',
      coalesce(nullif(p_payload->>'category', ''), 'equipment'),
      coalesce(nullif(p_payload->>'asset_type', ''), 'equipment'),
      coalesce(nullif(p_payload->>'status', ''), 'active'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'owner_user_id', '')::uuid,
      nullif(p_payload->>'location_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      nullif(p_payload->>'business_pack_key', ''),
      nullif(p_payload->>'purchase_date', '')::date,
      nullif(p_payload->>'warranty_date', '')::date,
      nullif(p_payload->>'purchase_cost', '')::numeric,
      nullif(p_payload->>'current_value', '')::numeric,
      coalesce((p_payload->>'is_reservable')::boolean, false),
      coalesce(p_payload->>'notes', ''),
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning * into v_row;

    if coalesce((p_payload->>'is_reservable')::boolean, false) then
      perform public._ast512_sync_calendar_resource(v_org_id, v_row.id);
    end if;

    perform public._ast512_log(v_org_id, v_row.id, 'asset_created', 'Asset created: ' || v_row.name, p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast512_asset_json(v_row));

  elsif p_action_type = 'update_asset' then
    update public.organization_assets set
      name = coalesce(nullif(p_payload->>'name', ''), name),
      category = coalesce(nullif(p_payload->>'category', ''), category),
      asset_type = coalesce(nullif(p_payload->>'asset_type', ''), asset_type),
      status = coalesce(nullif(p_payload->>'status', ''), status),
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      owner_user_id = coalesce(nullif(p_payload->>'owner_user_id', '')::uuid, owner_user_id),
      location_id = coalesce(nullif(p_payload->>'location_id', '')::uuid, location_id),
      domain_id = coalesce(nullif(p_payload->>'domain_id', '')::uuid, domain_id),
      warranty_date = coalesce(nullif(p_payload->>'warranty_date', '')::date, warranty_date),
      current_value = coalesce(nullif(p_payload->>'current_value', '')::numeric, current_value),
      notes = coalesce(nullif(p_payload->>'notes', ''), notes),
      metadata = metadata || coalesce(p_payload->'metadata', '{}'::jsonb),
      attachments = case when p_payload ? 'attachments' then p_payload->'attachments' else attachments end,
      updated_at = now()
    where id = v_asset_id and organization_id = v_org_id
    returning * into v_row;

    if v_row.is_reservable then perform public._ast512_sync_calendar_resource(v_org_id, v_row.id); end if;
    perform public._ast512_log(v_org_id, v_row.id, 'asset_updated', 'Asset updated: ' || v_row.name, p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast512_asset_json(v_row));

  elsif p_action_type = 'assign_asset' then
    select * into v_row from public.organization_assets where id = v_asset_id and organization_id = v_org_id;

    if p_payload->>'assignment_type' = 'employee' then
      update public.organization_assets set
        assigned_employee_id = (p_payload->>'assigned_to_id')::uuid,
        assigned_team_id = null, status = 'active', updated_at = now()
      where id = v_asset_id;
    elsif p_payload->>'assignment_type' = 'team' then
      update public.organization_assets set
        assigned_team_id = (p_payload->>'assigned_to_id')::uuid, updated_at = now()
      where id = v_asset_id;
    elsif p_payload->>'assignment_type' = 'department' then
      update public.organization_assets set
        department_id = (p_payload->>'assigned_to_id')::uuid, updated_at = now()
      where id = v_asset_id;
    elsif p_payload->>'assignment_type' = 'location' then
      update public.organization_assets set
        location_id = (p_payload->>'assigned_to_id')::uuid, updated_at = now()
      where id = v_asset_id;
    end if;

    insert into public.organization_asset_assignments (
      organization_id, asset_id, assignment_type, assigned_to_id, assigned_label, assigned_by, notes
    ) values (
      v_org_id, v_asset_id, p_payload->>'assignment_type',
      nullif(p_payload->>'assigned_to_id', '')::uuid,
      p_payload->>'assigned_label',
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'notes', '')
    );

    perform public._ast512_log(v_org_id, v_asset_id, 'asset_assigned', 'Asset assigned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'return_asset' then
    update public.organization_asset_assignments set returned_at = now()
    where asset_id = v_asset_id and organization_id = v_org_id and returned_at is null;

    update public.organization_assets set
      assigned_employee_id = null, assigned_team_id = null, status = 'active', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;

    perform public._ast512_log(v_org_id, v_asset_id, 'asset_returned', 'Asset returned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'schedule_maintenance' then
    insert into public.organization_asset_maintenance (
      organization_id, asset_id, maintenance_type, title, description, scheduled_at, cost, performed_by
    ) values (
      v_org_id, v_asset_id,
      coalesce(nullif(p_payload->>'maintenance_type', ''), 'scheduled'),
      p_payload->>'title',
      coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'scheduled_at', '')::timestamptz, now() + interval '7 days'),
      nullif(p_payload->>'cost', '')::numeric,
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_maint_id;

    update public.organization_assets set status = 'maintenance_required', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;

    select department_id into v_dept_id from public.organization_assets where id = v_asset_id;
    v_task_id := public._ast512_create_maintenance_task(
      v_org_id, v_asset_id, p_payload->>'title',
      coalesce((nullif(p_payload->>'scheduled_at', '')::timestamptz)::date, (current_date + 7)),
      v_dept_id
    );

    update public.organization_asset_maintenance set task_id = v_task_id where id = v_maint_id;

    perform public._ast512_log(v_org_id, v_asset_id, 'maintenance_scheduled', 'Maintenance scheduled', p_payload);
    return jsonb_build_object('ok', true, 'maintenance_id', v_maint_id, 'task_id', v_task_id);

  elsif p_action_type = 'complete_maintenance' then
    update public.organization_asset_maintenance set
      status = 'completed', completed_at = now(), cost = coalesce(nullif(p_payload->>'cost', '')::numeric, cost), updated_at = now()
    where id = (p_payload->>'maintenance_id')::uuid and organization_id = v_org_id;

    update public.organization_assets set status = 'active', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id and status = 'maintenance_required';

    perform public._ast512_log(v_org_id, v_asset_id, 'maintenance_completed', 'Maintenance completed', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_reservation' then
    v_conflict := public._ast512_detect_reservation_conflict(
      v_org_id, v_asset_id,
      (p_payload->>'starts_at')::timestamptz,
      (p_payload->>'ends_at')::timestamptz
    );
    if v_conflict then
      raise exception 'Resource is already booked for this time — double booking not allowed';
    end if;

    insert into public.organization_asset_reservations (
      organization_id, asset_id, reserved_by, employee_profile_id,
      starts_at, ends_at, status, purpose, conflict_detected
    ) values (
      v_org_id, v_asset_id,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      nullif(p_payload->>'employee_profile_id', '')::uuid,
      (p_payload->>'starts_at')::timestamptz,
      (p_payload->>'ends_at')::timestamptz,
      'confirmed',
      coalesce(p_payload->>'purpose', ''),
      false
    ) returning id into v_res_id;

    select * into v_row from public.organization_assets where id = v_asset_id;
    if v_row.is_reservable then
      v_resource_id := public._ast512_sync_calendar_resource(v_org_id, v_asset_id);
      if v_resource_id is not null and exists (select 1 from pg_proc where proname = 'create_business_pack_calendar_event') then
        begin
          -- Create calendar event for reservable asset
          insert into public.organization_calendar_events (
            organization_id, event_number, title, description, event_type, status,
            owner_user_id, created_by, starts_at, ends_at, domain_id, department_id, related_module_key, metadata
          ) values (
            v_org_id,
            'EVT-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
            'Reserved: ' || v_row.name,
            coalesce(p_payload->>'purpose', ''),
            'booking', 'scheduled',
            (select id from public.users where auth_user_id = auth.uid() limit 1),
            (select id from public.users where auth_user_id = auth.uid() limit 1),
            (p_payload->>'starts_at')::timestamptz,
            (p_payload->>'ends_at')::timestamptz,
            v_row.domain_id, v_row.department_id, 'assets',
            jsonb_build_object('asset_id', v_asset_id, 'reservation_id', v_res_id)
          ) returning id into v_event_id;

          insert into public.organization_calendar_resource_bookings (
            organization_id, event_id, resource_id, booking_status
          ) values (v_org_id, v_event_id, v_resource_id, 'confirmed');

          update public.organization_asset_reservations set calendar_event_id = v_event_id where id = v_res_id;
        exception when others then null;
        end;
      end if;
    end if;

    update public.organization_assets set status = 'reserved', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;

    perform public._ast512_log(v_org_id, v_asset_id, 'reservation_created', 'Asset reservation created', p_payload);
    return jsonb_build_object('ok', true, 'reservation_id', v_res_id, 'calendar_event_id', v_event_id);

  elsif p_action_type = 'create_software_license' then
    insert into public.organization_assets (
      organization_id, asset_number, name, category, asset_type, status, department_id, domain_id, metadata
    ) values (
      v_org_id, public._ast512_next_asset_number(v_org_id),
      p_payload->>'license_name',
      'software_license', 'software_license', 'active',
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning * into v_row;

    insert into public.organization_asset_software_licenses (
      organization_id, asset_id, vendor, license_name, seat_count, seats_used,
      renewal_date, annual_cost, license_status
    ) values (
      v_org_id, v_row.id,
      coalesce(p_payload->>'vendor', ''),
      p_payload->>'license_name',
      coalesce((p_payload->>'seat_count')::int, 1),
      coalesce((p_payload->>'seats_used')::int, 0),
      nullif(p_payload->>'renewal_date', '')::date,
      nullif(p_payload->>'annual_cost', '')::numeric,
      'active'
    );

    perform public._ast512_log(v_org_id, v_row.id, 'license_created', 'Software license created', p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast512_asset_json(v_row));

  elsif p_action_type = 'report_issue' then
    update public.organization_assets set status = 'maintenance_required', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;

    perform public._ast512_log(v_org_id, v_asset_id, 'issue_reported', coalesce(p_payload->>'description', 'Asset issue reported'), p_payload);

    return public.perform_asset_management_action('schedule_maintenance', jsonb_build_object(
      'asset_id', v_asset_id,
      'title', coalesce(p_payload->>'title', 'Asset issue — inspection required'),
      'description', coalesce(p_payload->>'description', ''),
      'maintenance_type', 'inspection'
    ));

  elsif p_action_type = 'retire_asset' then
    update public.organization_assets set status = 'retired', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'asset_retired', 'Asset retired', p_payload);
    return jsonb_build_object('ok', true);

  end if;

  raise exception 'Unknown action: %', p_action_type;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Business Pack & Companion
-- ---------------------------------------------------------------------------
create or replace function public.create_business_pack_asset(
  p_pack_key text,
  p_name text,
  p_category text default 'equipment',
  p_asset_type text default 'equipment',
  p_department_id uuid default null,
  p_domain_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.perform_asset_management_action('create_asset', jsonb_build_object(
    'name', p_name,
    'category', p_category,
    'asset_type', p_asset_type,
    'business_pack_key', p_pack_key,
    'department_id', p_department_id,
    'domain_id', p_domain_id,
    'metadata', coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('pack_key', p_pack_key)
  ));
end; $$;

create or replace function public.get_companion_asset_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._ast512_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion understands organizational assets — who has what, maintenance due, license seats, and availability.',
    'summary', jsonb_build_object(
      'total_assets', (select count(*) from public.organization_assets where organization_id = v_org_id and status <> 'retired'),
      'maintenance_due', (select count(*) from public.organization_asset_maintenance where organization_id = v_org_id and status in ('scheduled', 'overdue')),
      'licenses_available', (select coalesce(sum(seat_count - seats_used), 0) from public.organization_asset_software_licenses where organization_id = v_org_id)
    ),
    'vehicles_service_due', coalesce((
      select jsonb_agg(jsonb_build_object('name', a.name, 'asset_number', a.asset_number, 'due', m.scheduled_at))
      from public.organization_asset_maintenance m
      join public.organization_assets a on a.id = m.asset_id
      where m.organization_id = v_org_id and a.asset_type = 'vehicle' and m.status = 'scheduled'
      limit 10
    ), '[]'::jsonb),
    'example_questions', jsonb_build_array(
      'Who has Laptop 54?',
      'When is Vehicle 3 due for service?',
      'Show all assets assigned to Per.',
      'How many licenses remain available?',
      'Which meeting rooms are available tomorrow?'
    ),
    'assets_route', '/app/assets',
    'vehicles_route', '/app/assets/vehicles'
  );
end; $$;

-- Employee mobile view — assigned assets
create or replace function public.get_my_assigned_assets()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
  v_items jsonb;
begin
  v_org_id := public._ast512_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  join public.users u on u.id = ou.user_id
  where p.organization_id = v_org_id and u.auth_user_id = auth.uid() and p.employee_status = 'active'
  limit 1;

  select coalesce(jsonb_agg(public._ast512_asset_json(a) order by a.name), '[]'::jsonb)
  into v_items
  from public.organization_assets a
  where a.organization_id = v_org_id and a.assigned_employee_id = v_profile_id and a.status <> 'retired';

  return jsonb_build_object('found', true, 'assets', coalesce(v_items, '[]'::jsonb), 'can_report_issues', true, 'can_reserve', true);
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'assets', 'Assets', 'assets', 'operations',
    'Resource, asset, and equipment management for the organization.',
    'starter', null, 'operations', '/app/assets', 'licensed', 8
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('assets', 'assets.view', 'view', 'Assets — view'),
    ('assets', 'assets.manage', 'manage', 'Assets — manage'),
    ('assets', 'assets.assign', 'custom', 'Assets — assign and reserve')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_asset_management_center(text, text) to authenticated;
grant execute on function public.perform_asset_management_action(text, jsonb) to authenticated;
grant execute on function public.create_business_pack_asset(text, text, text, text, uuid, uuid, jsonb) to authenticated;
grant execute on function public.get_companion_asset_context() to authenticated;
grant execute on function public.get_my_assigned_assets() to authenticated;
