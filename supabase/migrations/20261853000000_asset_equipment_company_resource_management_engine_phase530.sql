-- Phase 530 — Asset, Equipment & Company Resource Management Engine
-- Extends Phase 512. Ownership and accountability layer.

-- ---------------------------------------------------------------------------
-- 1. Extend core assets
-- ---------------------------------------------------------------------------
alter table public.organization_assets add column if not exists description text not null default '';
alter table public.organization_assets add column if not exists serial_number text;
alter table public.organization_assets add column if not exists manufacturer text;
alter table public.organization_assets add column if not exists qr_code text;
alter table public.organization_assets add column if not exists barcode text;
alter table public.organization_assets add column if not exists warranty_start date;
alter table public.organization_assets add column if not exists expected_return_at timestamptz;
alter table public.organization_assets add column if not exists project_id uuid;
alter table public.organization_assets add column if not exists inventory_item_id uuid;

create unique index if not exists organization_assets_org_qr_idx
  on public.organization_assets (organization_id, qr_code) where qr_code is not null;

alter table public.organization_assets drop constraint if exists organization_assets_category_check;
alter table public.organization_assets add constraint organization_assets_category_check check (
  category in (
    'computer', 'laptop', 'monitor', 'phone', 'tablet', 'printer', 'vehicle', 'machinery', 'tool',
    'warehouse_equipment', 'property', 'office_equipment', 'furniture', 'software_license',
    'meeting_room', 'custom'
  )
);

alter table public.organization_assets drop constraint if exists organization_assets_status_check;
alter table public.organization_assets add constraint organization_assets_status_check check (
  status in (
    'active', 'available', 'assigned', 'awaiting_assignment', 'reserved', 'maintenance_required',
    'restricted', 'retired'
  )
);

-- ---------------------------------------------------------------------------
-- 2. Vehicle details, warranties, audits
-- ---------------------------------------------------------------------------
create table if not exists public.organization_asset_vehicle_details (
  asset_id uuid primary key references public.organization_assets (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  registration_number text,
  mileage integer,
  insurance_provider text,
  insurance_expiry date,
  last_service_date date,
  next_service_date date,
  service_provider text,
  documents jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_asset_vehicle_details enable row level security;
revoke all on public.organization_asset_vehicle_details from authenticated, anon;

create table if not exists public.organization_asset_warranties (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  asset_id uuid not null references public.organization_assets (id) on delete cascade,
  vendor text not null default '',
  coverage text not null default '',
  warranty_start date,
  warranty_end date,
  claim_history jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_asset_warranties_org_asset_idx
  on public.organization_asset_warranties (organization_id, asset_id);

alter table public.organization_asset_warranties enable row level security;
revoke all on public.organization_asset_warranties from authenticated, anon;

create table if not exists public.organization_asset_audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  audit_number text,
  audit_type text not null default 'physical' check (
    audit_type in ('physical', 'department', 'inventory_verification', 'qr_scan')
  ),
  status text not null default 'in_progress' check (
    status in ('planned', 'in_progress', 'completed', 'cancelled')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  started_by uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, audit_number)
);

create index if not exists organization_asset_audits_org_idx
  on public.organization_asset_audits (organization_id, status);

alter table public.organization_asset_audits enable row level security;
revoke all on public.organization_asset_audits from authenticated, anon;

create table if not exists public.organization_asset_audit_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  audit_id uuid not null references public.organization_asset_audits (id) on delete cascade,
  asset_id uuid references public.organization_assets (id) on delete set null,
  scan_code text,
  verification_status text not null default 'pending' check (
    verification_status in ('pending', 'verified', 'missing', 'location_mismatch', 'unexpected')
  ),
  notes text not null default '',
  scanned_at timestamptz not null default now()
);

create index if not exists organization_asset_audit_items_audit_idx
  on public.organization_asset_audit_items (audit_id, verification_status);

alter table public.organization_asset_audit_items enable row level security;
revoke all on public.organization_asset_audit_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._ast530_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._ast530_user()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_app_user_id();
$$;

create or replace function public._ast530_next_audit_number(p_org_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  select count(*) + 1 into v_n from public.organization_asset_audits where organization_id = p_org_id;
  return 'AUD-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._ast530_asset_json(p_row public.organization_assets)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'asset_number', p_row.asset_number,
    'name', p_row.name,
    'description', p_row.description,
    'category', p_row.category,
    'asset_type', p_row.asset_type,
    'status', p_row.status,
    'serial_number', p_row.serial_number,
    'manufacturer', p_row.manufacturer,
    'qr_code', p_row.qr_code,
    'barcode', p_row.barcode,
    'department_id', p_row.department_id,
    'owner_user_id', p_row.owner_user_id,
    'assigned_employee_id', p_row.assigned_employee_id,
    'assigned_team_id', p_row.assigned_team_id,
    'location_id', p_row.location_id,
    'domain_id', p_row.domain_id,
    'business_pack_key', p_row.business_pack_key,
    'project_id', p_row.project_id,
    'inventory_item_id', p_row.inventory_item_id,
    'purchase_date', p_row.purchase_date,
    'warranty_start', p_row.warranty_start,
    'warranty_date', p_row.warranty_date,
    'expected_return_at', p_row.expected_return_at,
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

create or replace function public._ast530_generate_qr(p_org_id uuid, p_asset_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_code text;
begin
  v_code := 'ASTQR-' || substr(replace(p_asset_id::text, '-', ''), 1, 12);
  update public.organization_assets set qr_code = v_code, updated_at = now()
  where id = p_asset_id and organization_id = p_org_id;
  return v_code;
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Asset Resource Management Center (extends Phase 512 center)
-- ---------------------------------------------------------------------------
create or replace function public.get_asset_management_center(
  p_category text default null,
  p_asset_type text default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('assets.view');
  v_org_id := public._ast530_org();

  perform public._ast512_log(v_org_id, null, 'center_view', 'Asset Center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations should always know what they own, who is using it, where it is located, when it requires maintenance, and when it should be replaced.',
    'philosophy', 'Assets cost money. Visibility creates control. Control creates accountability.',
    'structure', 'PLATFORM → APP → ASSET ENGINE → RESOURCES → EMPLOYEES',
    'overview', jsonb_build_object(
      'total_assets', (select count(*) from public.organization_assets where organization_id = v_org_id and status <> 'retired'),
      'active', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'active'),
      'assigned', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'assigned'),
      'available', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'available'),
      'maintenance_required', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'maintenance_required'),
      'vehicles', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'vehicle' and status <> 'retired'),
      'software_licenses', (select count(*) from public.organization_asset_software_licenses where organization_id = v_org_id),
      'properties', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'property' and status <> 'retired'),
      'it_equipment', (select count(*) from public.organization_assets where organization_id = v_org_id and asset_type = 'it_equipment' and status <> 'retired'),
      'reserved', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'reserved'),
      'warranty_expiring_30d', (
        select count(*) from public.organization_assets
        where organization_id = v_org_id and warranty_date between current_date and current_date + 30
      ),
      'license_expiring_30d', (
        select count(*) from public.organization_asset_software_licenses
        where organization_id = v_org_id and renewal_date between current_date and current_date + 30
      ),
      'audits_in_progress', (
        select count(*) from public.organization_asset_audits where organization_id = v_org_id and status = 'in_progress'
      ),
      'total_value', coalesce((
        select sum(current_value) from public.organization_assets where organization_id = v_org_id and status <> 'retired'
      ), 0)
    ),
    'assets', coalesce((
      select jsonb_agg(
        public._ast530_asset_json(a) || jsonb_build_object(
          'department_name', (select name from public.organization_departments where id = a.department_id),
          'assigned_employee_name', (select full_name from public.organization_employee_profiles where id = a.assigned_employee_id),
          'domain', (select domain from public.organization_domains where id = a.domain_id),
          'location_name', (select name from public.organization_locations where id = a.location_id),
          'deep_link', '/app/assets?asset=' || a.id::text
        ) order by a.asset_number
      )
      from public.organization_assets a
      where a.organization_id = v_org_id
        and (p_category is null or p_category = '' or a.category = p_category)
        and (p_asset_type is null or p_asset_type = '' or a.asset_type = p_asset_type)
    ), '[]'::jsonb),
    'assignments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', aa.id, 'asset_id', aa.asset_id,
        'asset_name', (select name from public.organization_assets where id = aa.asset_id),
        'asset_number', (select asset_number from public.organization_assets where id = aa.asset_id),
        'assignment_type', aa.assignment_type,
        'assigned_label', aa.assigned_label,
        'assigned_at', aa.assigned_at,
        'returned_at', aa.returned_at,
        'expected_return_at', (select expected_return_at from public.organization_assets where id = aa.asset_id)
      ) order by aa.assigned_at desc)
      from public.organization_asset_assignments aa
      where aa.organization_id = v_org_id and aa.returned_at is null
      limit 50
    ), '[]'::jsonb),
    'maintenance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'asset_id', m.asset_id,
        'asset_name', (select name from public.organization_assets where id = m.asset_id),
        'maintenance_type', m.maintenance_type, 'status', m.status, 'title', m.title,
        'scheduled_at', m.scheduled_at, 'completed_at', m.completed_at, 'cost', m.cost
      ) order by m.scheduled_at nulls last)
      from public.organization_asset_maintenance m
      where m.organization_id = v_org_id and m.status in ('scheduled', 'in_progress', 'overdue')
    ), '[]'::jsonb),
    'vehicles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'asset_id', a.id, 'asset_number', a.asset_number, 'name', a.name, 'status', a.status,
        'registration_number', v.registration_number, 'mileage', v.mileage,
        'next_service_date', v.next_service_date, 'insurance_expiry', v.insurance_expiry,
        'assigned_employee_name', (select full_name from public.organization_employee_profiles where id = a.assigned_employee_id)
      ) order by a.asset_number)
      from public.organization_assets a
      left join public.organization_asset_vehicle_details v on v.asset_id = a.id
      where a.organization_id = v_org_id and a.asset_type = 'vehicle' and a.status <> 'retired'
    ), '[]'::jsonb),
    'software_licenses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'asset_id', sl.asset_id, 'license_name', sl.license_name, 'vendor', sl.vendor,
        'seat_count', sl.seat_count, 'seats_used', sl.seats_used,
        'seats_available', sl.seat_count - sl.seats_used,
        'renewal_date', sl.renewal_date, 'license_status', sl.license_status, 'annual_cost', sl.annual_cost
      ) order by sl.renewal_date nulls last)
      from public.organization_asset_software_licenses sl
      where sl.organization_id = v_org_id
    ), '[]'::jsonb),
    'warranties', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'asset_id', w.asset_id,
        'asset_name', (select name from public.organization_assets where id = w.asset_id),
        'vendor', w.vendor, 'coverage', w.coverage,
        'warranty_start', w.warranty_start, 'warranty_end', w.warranty_end
      ) order by w.warranty_end nulls last)
      from public.organization_asset_warranties w
      where w.organization_id = v_org_id
      limit 30
    ), '[]'::jsonb),
    'audits', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', au.id, 'audit_number', au.audit_number, 'audit_type', au.audit_type,
        'status', au.status, 'summary', au.summary, 'created_at', au.created_at,
        'items_verified', (
          select count(*) from public.organization_asset_audit_items i
          where i.audit_id = au.id and i.verification_status = 'verified'
        )
      ) order by au.created_at desc)
      from public.organization_asset_audits au
      where au.organization_id = v_org_id
      limit 20
    ), '[]'::jsonb),
    'reservations', coalesce((
      select jsonb_agg(row_to_json(r))
      from (
        select r.id, r.asset_id, (select name from public.organization_assets where id = r.asset_id) as asset_name,
          r.starts_at, r.ends_at, r.status, r.purpose
        from public.organization_asset_reservations r
        where r.organization_id = v_org_id and r.ends_at >= now() and r.status in ('pending', 'confirmed')
        order by r.starts_at limit 20
      ) r
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'total_value', coalesce((select sum(current_value) from public.organization_assets where organization_id = v_org_id and status <> 'retired'), 0),
      'purchase_value', coalesce((select sum(purchase_cost) from public.organization_assets where organization_id = v_org_id), 0),
      'maintenance_costs_ytd', coalesce((
        select sum(cost) from public.organization_asset_maintenance
        where organization_id = v_org_id and status = 'completed' and completed_at >= date_trunc('year', now())
      ), 0),
      'asset_utilization_pct', least(100, greatest(0, coalesce((
        select (count(*) filter (where status in ('assigned', 'active', 'reserved'))::numeric / greatest(count(*), 1)) * 100
        from public.organization_assets where organization_id = v_org_id and status <> 'retired'
      ), 0)::int)),
      'audit_compliance_pct', least(100, greatest(0, coalesce((
        select (count(*) filter (where status = 'completed')::numeric / greatest(count(*), 1)) * 100
        from public.organization_asset_audits where organization_id = v_org_id
      ), 100)::int))
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'action', a.action, 'summary', a.summary, 'asset_id', a.asset_id, 'created_at', a.created_at
      ) order by a.created_at desc)
      from (select * from public.organization_asset_audit_logs where organization_id = v_org_id order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'categories', jsonb_build_array(
      'computer', 'laptop', 'monitor', 'phone', 'printer', 'vehicle', 'machinery', 'tool',
      'warehouse_equipment', 'furniture', 'office_equipment', 'software_license', 'custom'
    ),
    'statuses', jsonb_build_array(
      'active', 'available', 'assigned', 'awaiting_assignment', 'maintenance_required', 'reserved', 'retired'
    ),
    'routes', jsonb_build_object(
      'assets', '/app/assets',
      'vehicles', '/app/assets/vehicles',
      'calendar', '/app/calendar',
      'tasks', '/app/tasks',
      'people', '/app/people',
      'inventory', '/app/inventory',
      'notifications', '/app/notifications'
    ),
    'sections', jsonb_build_array(
      'overview', 'assets', 'assignments', 'maintenance', 'vehicles', 'equipment',
      'licenses', 'audits', 'reports'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Legacy Phase 512 actions helper
-- ---------------------------------------------------------------------------
drop function if exists public.get_companion_asset_context();
create or replace function public._ast512_perform_legacy_action(
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
  v_org_id := public._ast512_org();
  v_asset_id := nullif(p_payload->>'asset_id', '')::uuid;

  if p_action_type = 'update_asset' then
    update public.organization_assets set
      name = coalesce(nullif(p_payload->>'name', ''), name),
      description = coalesce(nullif(p_payload->>'description', ''), description),
      category = coalesce(nullif(p_payload->>'category', ''), category),
      asset_type = coalesce(nullif(p_payload->>'asset_type', ''), asset_type),
      status = coalesce(nullif(p_payload->>'status', ''), status),
      department_id = coalesce(nullif(p_payload->>'department_id', '')::uuid, department_id),
      warranty_date = coalesce(nullif(p_payload->>'warranty_date', '')::date, warranty_date),
      current_value = coalesce(nullif(p_payload->>'current_value', '')::numeric, current_value),
      notes = coalesce(nullif(p_payload->>'notes', ''), notes),
      updated_at = now()
    where id = v_asset_id and organization_id = v_org_id returning * into v_row;
    perform public._ast512_log(v_org_id, v_row.id, 'asset_updated', 'Asset updated: ' || v_row.name, p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast530_asset_json(v_row));

  elsif p_action_type = 'schedule_maintenance' then
    insert into public.organization_asset_maintenance (
      organization_id, asset_id, maintenance_type, title, description, scheduled_at, cost, performed_by
    ) values (
      v_org_id, v_asset_id,
      coalesce(nullif(p_payload->>'maintenance_type', ''), 'scheduled'),
      p_payload->>'title', coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'scheduled_at', '')::timestamptz, now() + interval '7 days'),
      nullif(p_payload->>'cost', '')::numeric, public._ast530_user()
    ) returning id into v_maint_id;
    update public.organization_assets set status = 'maintenance_required', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'maintenance_scheduled', 'Maintenance scheduled', p_payload);
    return jsonb_build_object('ok', true, 'maintenance_id', v_maint_id);

  elsif p_action_type = 'complete_maintenance' then
    update public.organization_asset_maintenance set status = 'completed', completed_at = now(), updated_at = now()
    where id = (p_payload->>'maintenance_id')::uuid and organization_id = v_org_id;
    update public.organization_assets set status = 'available', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'maintenance_completed', 'Maintenance completed', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_software_license' then
    insert into public.organization_assets (
      organization_id, asset_number, name, category, asset_type, status, department_id, domain_id
    ) values (
      v_org_id, public._ast512_next_asset_number(v_org_id), p_payload->>'license_name',
      'software_license', 'software_license', 'active',
      nullif(p_payload->>'department_id', '')::uuid, nullif(p_payload->>'domain_id', '')::uuid
    ) returning * into v_row;
    insert into public.organization_asset_software_licenses (
      organization_id, asset_id, vendor, license_name, seat_count, seats_used, renewal_date, annual_cost
    ) values (
      v_org_id, v_row.id, coalesce(p_payload->>'vendor', ''), p_payload->>'license_name',
      coalesce((p_payload->>'seat_count')::int, 1), 0,
      nullif(p_payload->>'renewal_date', '')::date, nullif(p_payload->>'annual_cost', '')::numeric
    );
    perform public._ast512_log(v_org_id, v_row.id, 'license_created', 'Software license created', p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast530_asset_json(v_row));

  elsif p_action_type = 'report_issue' then
    update public.organization_assets set status = 'maintenance_required', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'issue_reported', coalesce(p_payload->>'description', 'Asset issue reported'), p_payload);
    return public._ast512_perform_legacy_action('schedule_maintenance', jsonb_build_object(
      'asset_id', v_asset_id, 'title', coalesce(p_payload->>'title', 'Asset issue — inspection required'),
      'description', coalesce(p_payload->>'description', ''), 'maintenance_type', 'inspection'
    ));

  elsif p_action_type = 'retire_asset' then
    update public.organization_assets set status = 'retired', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'asset_retired', 'Asset retired', p_payload);
    return jsonb_build_object('ok', true);

  else
    raise exception 'Unknown action: %', p_action_type;
  end if;
end; $$;

-- Rebind perform to use legacy helper instead of recursion
create or replace function public.perform_asset_management_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_asset_id uuid;
  v_row public.organization_assets;
  v_audit_id uuid;
  v_item_id uuid;
  v_qr text;
  v_legacy text[] := array[
    'update_asset', 'schedule_maintenance', 'complete_maintenance', 'create_software_license',
    'report_issue', 'retire_asset'
  ];
begin
  v_org_id := public._ast530_org();
  v_asset_id := nullif(p_payload->>'asset_id', '')::uuid;

  if p_action_type = any(v_legacy) then
    perform public._irp_require_permission('assets.manage');
    return public._ast512_perform_legacy_action(p_action_type, p_payload);
  end if;

  if p_action_type in (
    'create_asset', 'assign_asset', 'return_asset', 'start_audit', 'scan_audit_item',
    'complete_audit', 'lookup_qr', 'generate_qr', 'create_warranty', 'update_vehicle_details',
    'assign_license_seat', 'remove_license_seat'
  ) then
    perform public._irp_require_permission('assets.manage');
  else
    perform public._irp_require_permission('assets.view');
  end if;

  if p_action_type = 'create_asset' then
    insert into public.organization_assets (
      organization_id, asset_number, name, description, category, asset_type, status,
      serial_number, manufacturer, department_id, domain_id, business_pack_key,
      purchase_date, warranty_start, warranty_date, purchase_cost, current_value, notes, metadata
    ) values (
      v_org_id, coalesce(nullif(p_payload->>'asset_number', ''), public._ast512_next_asset_number(v_org_id)),
      p_payload->>'name', coalesce(p_payload->>'description', ''),
      coalesce(nullif(p_payload->>'category', ''), 'equipment'),
      coalesce(nullif(p_payload->>'asset_type', ''), 'equipment'),
      coalesce(nullif(p_payload->>'status', ''), 'available'),
      p_payload->>'serial_number', p_payload->>'manufacturer',
      nullif(p_payload->>'department_id', '')::uuid, nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      nullif(p_payload->>'purchase_date', '')::date,
      nullif(p_payload->>'warranty_start', '')::date,
      nullif(p_payload->>'warranty_date', '')::date,
      nullif(p_payload->>'purchase_cost', '')::numeric,
      nullif(p_payload->>'current_value', '')::numeric,
      coalesce(p_payload->>'notes', ''), coalesce(p_payload->'metadata', '{}'::jsonb)
    ) returning * into v_row;
    perform public._ast530_generate_qr(v_org_id, v_row.id);
    if v_row.asset_type = 'vehicle' then
      insert into public.organization_asset_vehicle_details (asset_id, organization_id, registration_number)
      values (v_row.id, v_org_id, p_payload->>'registration_number') on conflict do nothing;
    end if;
    select * into v_row from public.organization_assets where id = v_row.id;
    perform public._ast512_log(v_org_id, v_row.id, 'asset_created', 'Asset created: ' || v_row.name, p_payload);
    return jsonb_build_object('ok', true, 'asset', public._ast530_asset_json(v_row));

  elsif p_action_type = 'assign_asset' then
    if p_payload->>'assignment_type' = 'employee' or p_payload->>'assignment_type' is null then
      update public.organization_assets set
        assigned_employee_id = nullif(p_payload->>'assigned_to_id', '')::uuid,
        status = 'assigned',
        expected_return_at = nullif(p_payload->>'expected_return_at', '')::timestamptz,
        updated_at = now()
      where id = v_asset_id and organization_id = v_org_id;
    end if;
    insert into public.organization_asset_assignments (
      organization_id, asset_id, assignment_type, assigned_to_id, assigned_label, assigned_by, notes
    ) values (
      v_org_id, v_asset_id, coalesce(p_payload->>'assignment_type', 'employee'),
      nullif(p_payload->>'assigned_to_id', '')::uuid, p_payload->>'assigned_label',
      public._ast530_user(), coalesce(p_payload->>'notes', '')
    );
    perform public._ast512_log(v_org_id, v_asset_id, 'asset_assigned', 'Asset assigned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'return_asset' then
    update public.organization_asset_assignments set returned_at = now()
    where asset_id = v_asset_id and organization_id = v_org_id and returned_at is null;
    update public.organization_assets set assigned_employee_id = null, status = 'available', updated_at = now()
    where id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'asset_returned', 'Asset returned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'generate_qr' then
    v_qr := public._ast530_generate_qr(v_org_id, v_asset_id);
    return jsonb_build_object('ok', true, 'qr_code', v_qr);

  elsif p_action_type = 'lookup_qr' then
    select * into v_row from public.organization_assets
    where organization_id = v_org_id and (
      qr_code = p_payload->>'code' or barcode = p_payload->>'code' or asset_number = p_payload->>'code'
    ) limit 1;
    if not found then return jsonb_build_object('ok', false, 'error', 'not_found'); end if;
    return jsonb_build_object('ok', true, 'asset', public._ast530_asset_json(v_row));

  elsif p_action_type = 'start_audit' then
    insert into public.organization_asset_audits (
      organization_id, audit_number, audit_type, status, department_id, started_by, summary
    ) values (
      v_org_id, public._ast530_next_audit_number(v_org_id),
      coalesce(p_payload->>'audit_type', 'physical'), 'in_progress',
      nullif(p_payload->>'department_id', '')::uuid, public._ast530_user(),
      coalesce(p_payload->>'summary', 'Asset audit started')
    ) returning id into v_audit_id;
    perform public._ast512_log(v_org_id, null, 'audit_started', 'Asset audit started', jsonb_build_object('audit_id', v_audit_id));
    return jsonb_build_object('ok', true, 'audit_id', v_audit_id);

  elsif p_action_type = 'scan_audit_item' then
    v_audit_id := (p_payload->>'audit_id')::uuid;
    select id into v_asset_id from public.organization_assets
    where organization_id = v_org_id and (
      qr_code = p_payload->>'scan_code' or barcode = p_payload->>'scan_code' or asset_number = p_payload->>'scan_code'
    ) limit 1;
    insert into public.organization_asset_audit_items (
      organization_id, audit_id, asset_id, scan_code, verification_status, notes
    ) values (
      v_org_id, v_audit_id, v_asset_id, p_payload->>'scan_code',
      case when v_asset_id is not null then 'verified' else 'unexpected' end,
      coalesce(p_payload->>'notes', '')
    ) returning id into v_item_id;
    return jsonb_build_object('ok', true, 'item_id', v_item_id, 'asset_id', v_asset_id);

  elsif p_action_type = 'complete_audit' then
    v_audit_id := (p_payload->>'audit_id')::uuid;
    update public.organization_asset_audits set status = 'completed', completed_at = now(), updated_at = now()
    where id = v_audit_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, null, 'audit_completed', 'Asset audit completed', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_warranty' then
    insert into public.organization_asset_warranties (organization_id, asset_id, vendor, coverage, warranty_start, warranty_end)
    values (
      v_org_id, v_asset_id, coalesce(p_payload->>'vendor', ''), coalesce(p_payload->>'coverage', ''),
      nullif(p_payload->>'warranty_start', '')::date, nullif(p_payload->>'warranty_end', '')::date
    );
    perform public._ast512_log(v_org_id, v_asset_id, 'warranty_created', 'Warranty record created', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'update_vehicle_details' then
    insert into public.organization_asset_vehicle_details (
      asset_id, organization_id, registration_number, mileage, insurance_provider,
      insurance_expiry, next_service_date
    ) values (
      v_asset_id, v_org_id, p_payload->>'registration_number',
      nullif(p_payload->>'mileage', '')::int, p_payload->>'insurance_provider',
      nullif(p_payload->>'insurance_expiry', '')::date,
      nullif(p_payload->>'next_service_date', '')::date
    ) on conflict (asset_id) do update set
      registration_number = excluded.registration_number,
      mileage = coalesce(excluded.mileage, organization_asset_vehicle_details.mileage),
      next_service_date = coalesce(excluded.next_service_date, organization_asset_vehicle_details.next_service_date),
      updated_at = now();
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'assign_license_seat' then
    update public.organization_asset_software_licenses set seats_used = least(seat_count, seats_used + 1), updated_at = now()
    where asset_id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'license_assigned', 'License seat assigned', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'remove_license_seat' then
    update public.organization_asset_software_licenses set seats_used = greatest(0, seats_used - 1), updated_at = now()
    where asset_id = v_asset_id and organization_id = v_org_id;
    perform public._ast512_log(v_org_id, v_asset_id, 'license_removed', 'License seat removed', p_payload);
    return jsonb_build_object('ok', true);

  else
    raise exception 'Unknown action: %', p_action_type;
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_asset_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('assets.view');
  v_org_id := public._ast530_org();

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations manage what they own.',
    'query', p_query,
    'summary', jsonb_build_object(
      'total_assets', (select count(*) from public.organization_assets where organization_id = v_org_id and status <> 'retired'),
      'assigned', (select count(*) from public.organization_assets where organization_id = v_org_id and status = 'assigned'),
      'maintenance_due', (select count(*) from public.organization_asset_maintenance where organization_id = v_org_id and status in ('scheduled', 'overdue')),
      'licenses_expiring_30d', (select count(*) from public.organization_asset_software_licenses where organization_id = v_org_id and renewal_date between current_date and current_date + 30),
      'warranty_expiring_30d', (select count(*) from public.organization_assets where organization_id = v_org_id and warranty_date between current_date and current_date + 30)
    ),
    'vehicles_service_due', coalesce((
      select jsonb_agg(jsonb_build_object('name', a.name, 'asset_number', a.asset_number, 'next_service', v.next_service_date))
      from public.organization_asset_vehicle_details v
      join public.organization_assets a on a.id = v.asset_id
      where v.organization_id = v_org_id and v.next_service_date <= current_date + 30
      limit 10
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Who has Laptop 047?',
      'Show overdue maintenance.',
      'Which licenses expire this month?',
      'Show vehicle service schedule.',
      'Generate asset audit report.'
    ),
    'routes', jsonb_build_object(
      'assets', '/app/assets',
      'vehicles', '/app/assets/vehicles'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_assigned_assets()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_profile_id uuid;
begin
  perform public._irp_require_permission('assets.view');
  v_org_id := public._ast530_org();

  select p.id into v_profile_id
  from public.organization_employee_profiles p
  join public.organization_users ou on ou.id = p.organization_user_id
  join public.users u on u.id = ou.user_id
  where p.organization_id = v_org_id and u.auth_user_id = auth.uid() and p.employee_status = 'active'
  limit 1;

  return jsonb_build_object(
    'found', true,
    'can_report_issues', true,
    'can_scan_qr', true,
    'can_confirm_assignments', true,
    'assets', coalesce((
      select jsonb_agg(public._ast530_asset_json(a) order by a.name)
      from public.organization_assets a
      where a.organization_id = v_org_id and a.assigned_employee_id = v_profile_id and a.status <> 'retired'
    ), '[]'::jsonb),
    'routes', jsonb_build_object('assets', '/app/assets', 'mobile_ready', true)
  );
exception when others then
  return jsonb_build_object('found', true, 'assets', '[]'::jsonb);
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'assets', 'Asset & Resource Management', 'assets', 'operations',
    'Asset center — equipment, vehicles, licenses, maintenance, audits, and accountability.',
    'starter', null, 'operations', '/app/assets', 'licensed', 8
  );
exception when others then null;
end $$;

grant execute on function public.get_companion_asset_context(text) to authenticated;
grant execute on function public._ast512_perform_legacy_action(text, jsonb) to authenticated;
