-- Phase 523 — Inventory, Stock & Warehouse Operations Engine
-- What they have. Where it is. Who used it. When it moved.
-- Integrates: Procurement (522), Finance (519), Projects (520), Tasks (506), Domains (505A)

-- ---------------------------------------------------------------------------
-- 1. Settings & categories
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inventory_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_currency text not null default 'NOK',
  enable_low_stock_alerts boolean not null default true,
  enable_procurement_recommendations boolean not null default true,
  companion_inventory_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_inventory_settings enable row level security;
revoke all on public.organization_inventory_settings from authenticated, anon;

create table if not exists public.organization_inventory_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_key text not null,
  name text not null,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, category_key)
);

alter table public.organization_inventory_categories enable row level security;
revoke all on public.organization_inventory_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Warehouses & locations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inventory_warehouses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  warehouse_number text,
  name text not null,
  location text not null default '',
  manager_user_id uuid references public.users (id) on delete set null,
  capacity numeric(14, 2),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  warehouse_type text not null default 'main' check (
    warehouse_type in ('main', 'store', 'service_vehicle', 'property', 'regional', 'custom')
  ),
  status text not null default 'active' check (
    status in ('active', 'inactive', 'maintenance')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, warehouse_number)
);

create index if not exists organization_inventory_warehouses_org_idx
  on public.organization_inventory_warehouses (organization_id, status);

alter table public.organization_inventory_warehouses enable row level security;
revoke all on public.organization_inventory_warehouses from authenticated, anon;

create table if not exists public.organization_inventory_locations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  warehouse_id uuid not null references public.organization_inventory_warehouses (id) on delete cascade,
  location_key text not null,
  name text not null,
  location_type text not null default 'zone' check (
    location_type in ('zone', 'shelf', 'bin', 'room', 'section', 'custom')
  ),
  parent_location_id uuid references public.organization_inventory_locations (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, warehouse_id, location_key)
);

create index if not exists organization_inventory_locations_wh_idx
  on public.organization_inventory_locations (warehouse_id);

alter table public.organization_inventory_locations enable row level security;
revoke all on public.organization_inventory_locations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Products & stock items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inventory_products (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  sku text not null,
  name text not null,
  description text not null default '',
  category_key text not null default 'products',
  supplier_name text not null default '',
  unit_cost numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  min_level numeric(14, 2) not null default 0,
  max_level numeric(14, 2),
  status text not null default 'active' check (
    status in ('active', 'inactive', 'discontinued')
  ),
  business_pack_key text,
  domain_id uuid references public.organization_domains (id) on delete set null,
  asset_eligible boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sku)
);

create index if not exists organization_inventory_products_org_idx
  on public.organization_inventory_products (organization_id, status, category_key);

alter table public.organization_inventory_products enable row level security;
revoke all on public.organization_inventory_products from authenticated, anon;

create table if not exists public.organization_inventory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  warehouse_id uuid not null references public.organization_inventory_warehouses (id) on delete cascade,
  location_id uuid references public.organization_inventory_locations (id) on delete set null,
  quantity numeric(14, 2) not null default 0 check (quantity >= 0),
  available_quantity numeric(14, 2) not null default 0 check (available_quantity >= 0),
  reserved_quantity numeric(14, 2) not null default 0 check (reserved_quantity >= 0),
  incoming_quantity numeric(14, 2) not null default 0 check (incoming_quantity >= 0),
  stock_status text not null default 'in_stock' check (
    stock_status in ('in_stock', 'low_stock', 'reserved', 'out_of_stock', 'incoming')
  ),
  last_movement_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, product_id, warehouse_id, location_id)
);

create index if not exists organization_inventory_items_org_idx
  on public.organization_inventory_items (organization_id, stock_status, updated_at desc);

alter table public.organization_inventory_items enable row level security;
revoke all on public.organization_inventory_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Movements, receiving, transfers, reservations, adjustments
-- ---------------------------------------------------------------------------
create table if not exists public.organization_inventory_movements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  item_id uuid references public.organization_inventory_items (id) on delete set null,
  movement_type text not null check (
    movement_type in (
      'receipt', 'transfer', 'adjustment', 'reservation', 'fulfillment',
      'return', 'consumption', 'count'
    )
  ),
  quantity numeric(14, 2) not null,
  source_warehouse_id uuid references public.organization_inventory_warehouses (id) on delete set null,
  source_location_id uuid references public.organization_inventory_locations (id) on delete set null,
  dest_warehouse_id uuid references public.organization_inventory_warehouses (id) on delete set null,
  dest_location_id uuid references public.organization_inventory_locations (id) on delete set null,
  employee_user_id uuid references public.users (id) on delete set null,
  reason text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_inventory_movements_org_idx
  on public.organization_inventory_movements (organization_id, created_at desc);

alter table public.organization_inventory_movements enable row level security;
revoke all on public.organization_inventory_movements from authenticated, anon;

create table if not exists public.organization_inventory_receiving (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  warehouse_id uuid not null references public.organization_inventory_warehouses (id) on delete cascade,
  reference_number text,
  purchase_order_id uuid references public.organization_procurement_purchase_orders (id) on delete set null,
  supplier_name text not null default '',
  product_id uuid references public.organization_inventory_products (id) on delete set null,
  status text not null default 'pending' check (
    status in ('pending', 'inspecting', 'accepted', 'rejected', 'completed')
  ),
  expected_date date,
  received_date date,
  expected_quantity numeric(14, 2) not null default 0,
  accepted_quantity numeric(14, 2) not null default 0,
  rejected_quantity numeric(14, 2) not null default 0,
  damaged_quantity numeric(14, 2) not null default 0,
  inspection_notes text not null default '',
  received_by_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_inventory_receiving_org_idx
  on public.organization_inventory_receiving (organization_id, status, updated_at desc);

alter table public.organization_inventory_receiving enable row level security;
revoke all on public.organization_inventory_receiving from authenticated, anon;

create table if not exists public.organization_inventory_transfers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  transfer_number text,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  quantity numeric(14, 2) not null check (quantity > 0),
  source_warehouse_id uuid not null references public.organization_inventory_warehouses (id) on delete cascade,
  source_location_id uuid references public.organization_inventory_locations (id) on delete set null,
  dest_warehouse_id uuid not null references public.organization_inventory_warehouses (id) on delete cascade,
  dest_location_id uuid references public.organization_inventory_locations (id) on delete set null,
  transfer_type text not null default 'warehouse' check (
    transfer_type in ('warehouse', 'location', 'department', 'vehicle', 'property')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_transit', 'completed', 'cancelled')
  ),
  requested_by_user_id uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, transfer_number)
);

create index if not exists organization_inventory_transfers_org_idx
  on public.organization_inventory_transfers (organization_id, status, updated_at desc);

alter table public.organization_inventory_transfers enable row level security;
revoke all on public.organization_inventory_transfers from authenticated, anon;

create table if not exists public.organization_inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  item_id uuid references public.organization_inventory_items (id) on delete set null,
  quantity numeric(14, 2) not null check (quantity > 0),
  reservation_type text not null check (
    reservation_type in ('employee', 'department', 'project', 'task')
  ),
  reserved_for_id uuid,
  reserved_for_label text not null default '',
  status text not null default 'active' check (
    status in ('active', 'fulfilled', 'cancelled', 'expired')
  ),
  reserved_by_user_id uuid references public.users (id) on delete set null,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_inventory_reservations_org_idx
  on public.organization_inventory_reservations (organization_id, status);

alter table public.organization_inventory_reservations enable row level security;
revoke all on public.organization_inventory_reservations from authenticated, anon;

create table if not exists public.organization_inventory_adjustments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  item_id uuid references public.organization_inventory_items (id) on delete set null,
  adjustment_type text not null check (
    adjustment_type in ('count_correction', 'damage', 'loss', 'theft', 'return', 'expired')
  ),
  quantity_change numeric(14, 2) not null,
  reason text not null default '',
  adjusted_by_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_inventory_adjustments_org_idx
  on public.organization_inventory_adjustments (organization_id, created_at desc);

alter table public.organization_inventory_adjustments enable row level security;
revoke all on public.organization_inventory_adjustments from authenticated, anon;

create table if not exists public.organization_inventory_reorder_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  product_id uuid not null references public.organization_inventory_products (id) on delete cascade,
  recommended_quantity numeric(14, 2) not null default 0,
  reason text not null default '',
  status text not null default 'pending' check (
    status in ('pending', 'acknowledged', 'purchase_request_created', 'dismissed')
  ),
  procurement_request_id uuid references public.organization_procurement_purchase_requests (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_inventory_reorder_org_idx
  on public.organization_inventory_reorder_recommendations (organization_id, status);

alter table public.organization_inventory_reorder_recommendations enable row level security;
revoke all on public.organization_inventory_reorder_recommendations from authenticated, anon;

create table if not exists public.organization_inventory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  product_id uuid references public.organization_inventory_products (id) on delete set null,
  warehouse_id uuid references public.organization_inventory_warehouses (id) on delete set null,
  item_id uuid references public.organization_inventory_items (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_inventory_audit_logs_org_idx
  on public.organization_inventory_audit_logs (organization_id, created_at desc);

alter table public.organization_inventory_audit_logs enable row level security;
revoke all on public.organization_inventory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._inv523_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._inv523_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_product_id uuid default null,
  p_warehouse_id uuid default null,
  p_item_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_inventory_audit_logs (
    organization_id, actor_user_id, action, summary, product_id, warehouse_id, item_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_product_id, p_warehouse_id, p_item_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._inv523_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._inv523_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_wh_id uuid;
begin
  insert into public.organization_inventory_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_inventory_categories (organization_id, category_key, name, is_system)
  values
    (p_org_id, 'products', 'Products', true),
    (p_org_id, 'parts', 'Parts', true),
    (p_org_id, 'materials', 'Materials', true),
    (p_org_id, 'tools', 'Tools', true),
    (p_org_id, 'equipment', 'Equipment', true),
    (p_org_id, 'consumables', 'Consumables', true),
    (p_org_id, 'property_supplies', 'Property Supplies', true),
    (p_org_id, 'office_supplies', 'Office Supplies', true)
  on conflict (organization_id, category_key) do nothing;

  if not exists (
    select 1 from public.organization_inventory_warehouses where organization_id = p_org_id limit 1
  ) then
    insert into public.organization_inventory_warehouses (
      organization_id, warehouse_number, name, location, warehouse_type, status
    ) values (
      p_org_id, 'WH-00001', 'Main Warehouse', 'Primary', 'main', 'active'
    ) returning id into v_wh_id;

    insert into public.organization_inventory_locations (
      organization_id, warehouse_id, location_key, name, location_type
    ) values
      (p_org_id, v_wh_id, 'zone-a', 'Zone A', 'zone'),
      (p_org_id, v_wh_id, 'receiving', 'Receiving', 'section');
  end if;
end; $$;

create or replace function public._inv523_compute_stock_status(
  p_available numeric,
  p_reserved numeric,
  p_incoming numeric,
  p_min_level numeric
)
returns text language plpgsql immutable as $$
begin
  if p_incoming > 0 and p_available <= 0 then return 'incoming'; end if;
  if p_available <= 0 then return 'out_of_stock'; end if;
  if p_reserved > 0 and p_available <= p_reserved then return 'reserved'; end if;
  if p_min_level > 0 and p_available <= p_min_level then return 'low_stock'; end if;
  return 'in_stock';
end; $$;

create or replace function public._inv523_refresh_item_status(p_item_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_item public.organization_inventory_items;
  v_min numeric(14, 2);
begin
  select i.* into v_item from public.organization_inventory_items i where i.id = p_item_id;
  if not found then return; end if;

  select min_level into v_min from public.organization_inventory_products where id = v_item.product_id;

  update public.organization_inventory_items set
    stock_status = public._inv523_compute_stock_status(
      available_quantity, reserved_quantity, incoming_quantity, coalesce(v_min, 0)
    ),
    updated_at = now(),
    last_movement_at = now()
  where id = p_item_id;
end; $$;

create or replace function public._inv523_product_json(p_row public.organization_inventory_products)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'sku', p_row.sku,
    'name', p_row.name,
    'description', p_row.description,
    'category_key', p_row.category_key,
    'supplier_name', p_row.supplier_name,
    'unit_cost', p_row.unit_cost,
    'currency', p_row.currency,
    'min_level', p_row.min_level,
    'max_level', p_row.max_level,
    'status', p_row.status,
    'asset_eligible', p_row.asset_eligible,
    'business_pack_key', p_row.business_pack_key,
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'total_quantity', coalesce((
      select sum(quantity) from public.organization_inventory_items where product_id = p_row.id
    ), 0),
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._inv523_item_json(p_row public.organization_inventory_items)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'product_id', p_row.product_id,
    'sku', (select sku from public.organization_inventory_products where id = p_row.product_id),
    'product_name', (select name from public.organization_inventory_products where id = p_row.product_id),
    'warehouse_name', (select name from public.organization_inventory_warehouses where id = p_row.warehouse_id),
    'location_name', (select name from public.organization_inventory_locations where id = p_row.location_id),
    'quantity', p_row.quantity,
    'available_quantity', p_row.available_quantity,
    'reserved_quantity', p_row.reserved_quantity,
    'incoming_quantity', p_row.incoming_quantity,
    'stock_status', p_row.stock_status,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._inv523_warehouse_json(p_row public.organization_inventory_warehouses)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'warehouse_number', p_row.warehouse_number,
    'name', p_row.name,
    'location', p_row.location,
    'warehouse_type', p_row.warehouse_type,
    'manager_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.manager_user_id),
    'capacity', p_row.capacity,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'status', p_row.status,
    'inventory_count', coalesce((
      select count(*) from public.organization_inventory_items where warehouse_id = p_row.id
    ), 0),
    'updated_at', p_row.updated_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Inventory Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_inventory_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_inventory_value numeric(14, 2);
begin
  perform public._irp_require_permission('inventory.view');
  v_org_id := public._inv523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._inv523_ensure_settings(v_org_id);
  perform public._inv523_log(v_org_id, 'center_view', 'Inventory Center viewed', null, null, null,
    jsonb_build_object('section', p_section));

  select coalesce(sum(i.quantity * p.unit_cost), 0) into v_inventory_value
  from public.organization_inventory_items i
  join public.organization_inventory_products p on p.id = i.product_id
  where i.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'principle', 'What they have. Where it is. Who used it. When it moved.',
    'overview', jsonb_build_object(
      'total_products', (select count(*) from public.organization_inventory_products where organization_id = v_org_id and status = 'active'),
      'total_warehouses', (select count(*) from public.organization_inventory_warehouses where organization_id = v_org_id and status = 'active'),
      'inventory_value', v_inventory_value,
      'low_stock_count', (select count(*) from public.organization_inventory_items where organization_id = v_org_id and stock_status = 'low_stock'),
      'out_of_stock_count', (select count(*) from public.organization_inventory_items where organization_id = v_org_id and stock_status = 'out_of_stock'),
      'pending_receiving', (select count(*) from public.organization_inventory_receiving where organization_id = v_org_id and status in ('pending', 'inspecting')),
      'active_transfers', (select count(*) from public.organization_inventory_transfers where organization_id = v_org_id and status in ('pending', 'in_transit')),
      'active_reservations', (select count(*) from public.organization_inventory_reservations where organization_id = v_org_id and status = 'active'),
      'pending_reorders', (select count(*) from public.organization_inventory_reorder_recommendations where organization_id = v_org_id and status = 'pending'),
      'movements_7d', (select count(*) from public.organization_inventory_movements where organization_id = v_org_id and created_at >= now() - interval '7 days')
    ),
    'products', coalesce((
      select jsonb_agg(public._inv523_product_json(p) order by p.name)
      from (select * from public.organization_inventory_products where organization_id = v_org_id order by name limit 50) p
    ), '[]'::jsonb),
    'inventory_items', coalesce((
      select jsonb_agg(public._inv523_item_json(i) order by i.updated_at desc)
      from (select * from public.organization_inventory_items where organization_id = v_org_id order by updated_at desc limit 50) i
    ), '[]'::jsonb),
    'low_stock_items', coalesce((
      select jsonb_agg(public._inv523_item_json(i) order by i.available_quantity)
      from (
        select * from public.organization_inventory_items
        where organization_id = v_org_id and stock_status in ('low_stock', 'out_of_stock')
        order by available_quantity limit 30
      ) i
    ), '[]'::jsonb),
    'warehouses', coalesce((
      select jsonb_agg(public._inv523_warehouse_json(w) order by w.name)
      from (select * from public.organization_inventory_warehouses where organization_id = v_org_id order by name limit 30) w
    ), '[]'::jsonb),
    'movements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'movement_type', m.movement_type, 'quantity', m.quantity,
        'product_name', (select name from public.organization_inventory_products where id = m.product_id),
        'reason', m.reason, 'created_at', m.created_at
      ) order by m.created_at desc)
      from public.organization_inventory_movements m
      where m.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'receiving', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'reference_number', r.reference_number,
        'supplier_name', r.supplier_name, 'status', r.status,
        'expected_quantity', r.expected_quantity, 'accepted_quantity', r.accepted_quantity,
        'warehouse_name', (select name from public.organization_inventory_warehouses where id = r.warehouse_id),
        'expected_date', r.expected_date, 'updated_at', r.updated_at
      ) order by r.updated_at desc)
      from public.organization_inventory_receiving r
      where r.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'transfers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'transfer_number', t.transfer_number,
        'product_name', (select name from public.organization_inventory_products where id = t.product_id),
        'quantity', t.quantity, 'transfer_type', t.transfer_type, 'status', t.status,
        'source_warehouse', (select name from public.organization_inventory_warehouses where id = t.source_warehouse_id),
        'dest_warehouse', (select name from public.organization_inventory_warehouses where id = t.dest_warehouse_id),
        'updated_at', t.updated_at
      ) order by t.updated_at desc)
      from public.organization_inventory_transfers t
      where t.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'reservations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'product_name', (select name from public.organization_inventory_products where id = r.product_id),
        'quantity', r.quantity, 'reservation_type', r.reservation_type,
        'reserved_for_label', r.reserved_for_label, 'status', r.status, 'expires_at', r.expires_at
      ) order by r.updated_at desc)
      from public.organization_inventory_reservations r
      where r.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'adjustments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'adjustment_type', a.adjustment_type,
        'product_name', (select name from public.organization_inventory_products where id = a.product_id),
        'quantity_change', a.quantity_change, 'reason', a.reason, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_inventory_adjustments a
      where a.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'reorder_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', rr.id,
        'product_name', (select name from public.organization_inventory_products where id = rr.product_id),
        'recommended_quantity', rr.recommended_quantity, 'reason', rr.reason, 'status', rr.status
      ) order by rr.updated_at desc)
      from public.organization_inventory_reorder_recommendations rr
      where rr.organization_id = v_org_id and rr.status = 'pending' limit 20
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'category_key', c.category_key, 'name', c.name))
      from public.organization_inventory_categories c
      where c.organization_id = v_org_id and c.is_active
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'inventory_value', v_inventory_value,
      'low_stock_count', (select count(*) from public.organization_inventory_items where organization_id = v_org_id and stock_status = 'low_stock'),
      'movement_count_month', (select count(*) from public.organization_inventory_movements where organization_id = v_org_id and created_at >= date_trunc('month', now())),
      'warehouse_utilization', coalesce((
        select jsonb_agg(jsonb_build_object('warehouse_name', name, 'item_count', item_count))
        from (
          select w.name, count(i.id) as item_count
          from public.organization_inventory_warehouses w
          left join public.organization_inventory_items i on i.warehouse_id = w.id
          where w.organization_id = v_org_id
          group by w.id, w.name order by item_count desc limit 10
        ) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_inventory_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'products', 'inventory', 'warehouses', 'movements', 'receiving', 'transfers', 'adjustments', 'reports'
    ),
    'routes', jsonb_build_object(
      'inventory', '/app/inventory',
      'warehouses', '/app/inventory/warehouses',
      'procurement', '/app/procurement'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_inventory_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_item_id uuid;
  v_product_id uuid;
  v_wh_id uuid;
  v_qty numeric(14, 2);
  v_item public.organization_inventory_items;
  v_product public.organization_inventory_products;
begin
  v_org_id := public._inv523_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_product', 'create_warehouse', 'create_location', 'upsert_stock',
    'record_movement', 'create_transfer', 'complete_transfer',
    'create_reservation', 'release_reservation', 'create_adjustment',
    'create_receiving', 'complete_receiving', 'create_reorder_recommendation',
    'acknowledge_reorder'
  ) then
    perform public._irp_require_permission('inventory.manage');
  else
    perform public._irp_require_permission('inventory.view');
  end if;

  perform public._inv523_ensure_settings(v_org_id);

  if p_action_type = 'create_product' then
    insert into public.organization_inventory_products (
      organization_id, sku, name, description, category_key, supplier_name,
      unit_cost, currency, min_level, max_level, business_pack_key, asset_eligible
    ) values (
      v_org_id,
      coalesce(p_payload->>'sku', public._inv523_next_number(v_org_id, 'SKU', 'organization_inventory_products')),
      coalesce(p_payload->>'name', 'Product'),
      coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'category_key', 'products'),
      coalesce(p_payload->>'supplier_name', ''),
      coalesce((p_payload->>'unit_cost')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce((p_payload->>'min_level')::numeric, 0),
      nullif(p_payload->>'max_level', '')::numeric,
      p_payload->>'business_pack_key',
      coalesce((p_payload->>'asset_eligible')::boolean, false)
    ) returning id into v_id;
    perform public._inv523_log(v_org_id, 'item_created', 'Product created', v_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'product_id', v_id);

  elsif p_action_type = 'create_warehouse' then
    insert into public.organization_inventory_warehouses (
      organization_id, warehouse_number, name, location, warehouse_type, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'warehouse_number', public._inv523_next_number(v_org_id, 'WH', 'organization_inventory_warehouses')),
      coalesce(p_payload->>'name', 'Warehouse'),
      coalesce(p_payload->>'location', ''),
      coalesce(p_payload->>'warehouse_type', 'custom'),
      coalesce(p_payload->>'status', 'active')
    ) returning id into v_id;
    perform public._inv523_log(v_org_id, 'warehouse_created', 'Warehouse created', null, v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'warehouse_id', v_id);

  elsif p_action_type = 'create_location' then
    insert into public.organization_inventory_locations (
      organization_id, warehouse_id, location_key, name, location_type
    ) values (
      v_org_id,
      (p_payload->>'warehouse_id')::uuid,
      coalesce(p_payload->>'location_key', 'loc-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'name', 'Location'),
      coalesce(p_payload->>'location_type', 'zone')
    ) returning id into v_id;
    return jsonb_build_object('ok', true, 'location_id', v_id);

  elsif p_action_type = 'upsert_stock' then
    v_product_id := (p_payload->>'product_id')::uuid;
    v_wh_id := (p_payload->>'warehouse_id')::uuid;
    v_qty := coalesce((p_payload->>'quantity')::numeric, 0);

    insert into public.organization_inventory_items (
      organization_id, product_id, warehouse_id, location_id,
      quantity, available_quantity, reserved_quantity, incoming_quantity
    ) values (
      v_org_id, v_product_id, v_wh_id, nullif(p_payload->>'location_id', '')::uuid,
      v_qty, v_qty, 0, coalesce((p_payload->>'incoming_quantity')::numeric, 0)
    )
    on conflict (organization_id, product_id, warehouse_id, location_id)
    do update set
      quantity = excluded.quantity,
      available_quantity = excluded.quantity - organization_inventory_items.reserved_quantity,
      incoming_quantity = coalesce(excluded.incoming_quantity, organization_inventory_items.incoming_quantity),
      updated_at = now()
    returning id into v_item_id;

    perform public._inv523_refresh_item_status(v_item_id);
    perform public._inv523_log(v_org_id, 'inventory_updated', 'Inventory updated', v_product_id, v_wh_id, v_item_id, p_payload);
    return jsonb_build_object('ok', true, 'item_id', v_item_id);

  elsif p_action_type = 'record_movement' then
    v_product_id := (p_payload->>'product_id')::uuid;
    v_qty := coalesce((p_payload->>'quantity')::numeric, 0);

    insert into public.organization_inventory_movements (
      organization_id, product_id, item_id, movement_type, quantity,
      source_warehouse_id, source_location_id, dest_warehouse_id, dest_location_id,
      employee_user_id, reason
    ) values (
      v_org_id, v_product_id, nullif(p_payload->>'item_id', '')::uuid,
      coalesce(p_payload->>'movement_type', 'consumption'), v_qty,
      nullif(p_payload->>'source_warehouse_id', '')::uuid,
      nullif(p_payload->>'source_location_id', '')::uuid,
      nullif(p_payload->>'dest_warehouse_id', '')::uuid,
      nullif(p_payload->>'dest_location_id', '')::uuid,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'reason', '')
    ) returning id into v_id;

    perform public._inv523_log(v_org_id, 'movement_recorded', 'Movement recorded', v_product_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'movement_id', v_id);

  elsif p_action_type = 'create_transfer' then
    insert into public.organization_inventory_transfers (
      organization_id, transfer_number, product_id, quantity,
      source_warehouse_id, source_location_id, dest_warehouse_id, dest_location_id,
      transfer_type, status, requested_by_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'transfer_number', public._inv523_next_number(v_org_id, 'TR', 'organization_inventory_transfers')),
      (p_payload->>'product_id')::uuid,
      (p_payload->>'quantity')::numeric,
      (p_payload->>'source_warehouse_id')::uuid,
      nullif(p_payload->>'source_location_id', '')::uuid,
      (p_payload->>'dest_warehouse_id')::uuid,
      nullif(p_payload->>'dest_location_id', '')::uuid,
      coalesce(p_payload->>'transfer_type', 'warehouse'),
      'pending',
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;
    perform public._inv523_log(v_org_id, 'transfer_created', 'Transfer created', null, null, null, p_payload);
    return jsonb_build_object('ok', true, 'transfer_id', v_id);

  elsif p_action_type = 'complete_transfer' then
    v_id := (p_payload->>'transfer_id')::uuid;
    update public.organization_inventory_transfers set
      status = 'completed', completed_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._inv523_log(v_org_id, 'transfer_completed', 'Transfer completed', null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_reservation' then
    v_product_id := (p_payload->>'product_id')::uuid;
    v_qty := (p_payload->>'quantity')::numeric;

    insert into public.organization_inventory_reservations (
      organization_id, product_id, item_id, quantity, reservation_type,
      reserved_for_id, reserved_for_label, reserved_by_user_id, expires_at
    ) values (
      v_org_id, v_product_id, nullif(p_payload->>'item_id', '')::uuid, v_qty,
      coalesce(p_payload->>'reservation_type', 'project'),
      nullif(p_payload->>'reserved_for_id', '')::uuid,
      coalesce(p_payload->>'reserved_for_label', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      nullif(p_payload->>'expires_at', '')::timestamptz
    ) returning id into v_id;

    update public.organization_inventory_items set
      reserved_quantity = reserved_quantity + v_qty,
      available_quantity = greatest(quantity - (reserved_quantity + v_qty), 0),
      updated_at = now()
    where product_id = v_product_id and organization_id = v_org_id
      and (nullif(p_payload->>'item_id', '') is null or id = (p_payload->>'item_id')::uuid);

    perform public._inv523_log(v_org_id, 'reservation_created', 'Reservation created', v_product_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'reservation_id', v_id);

  elsif p_action_type = 'release_reservation' then
    v_id := (p_payload->>'reservation_id')::uuid;
    update public.organization_inventory_reservations set status = 'cancelled', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._inv523_log(v_org_id, 'reservation_released', 'Reservation released', null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_adjustment' then
    v_product_id := (p_payload->>'product_id')::uuid;
    v_qty := coalesce((p_payload->>'quantity_change')::numeric, 0);

    insert into public.organization_inventory_adjustments (
      organization_id, product_id, item_id, adjustment_type, quantity_change, reason, adjusted_by_user_id
    ) values (
      v_org_id, v_product_id, nullif(p_payload->>'item_id', '')::uuid,
      coalesce(p_payload->>'adjustment_type', 'count_correction'), v_qty,
      coalesce(p_payload->>'reason', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;

    update public.organization_inventory_items set
      quantity = greatest(quantity + v_qty, 0),
      available_quantity = greatest(available_quantity + v_qty, 0),
      updated_at = now()
    where product_id = v_product_id and organization_id = v_org_id
      and (nullif(p_payload->>'item_id', '') is null or id = (p_payload->>'item_id')::uuid);

    perform public._inv523_log(v_org_id, 'adjustment_performed', 'Adjustment performed', v_product_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'adjustment_id', v_id);

  elsif p_action_type = 'create_receiving' then
    insert into public.organization_inventory_receiving (
      organization_id, warehouse_id, reference_number, supplier_name, product_id,
      expected_quantity, expected_date, status
    ) values (
      v_org_id,
      (p_payload->>'warehouse_id')::uuid,
      coalesce(p_payload->>'reference_number', public._inv523_next_number(v_org_id, 'RCV', 'organization_inventory_receiving')),
      coalesce(p_payload->>'supplier_name', ''),
      nullif(p_payload->>'product_id', '')::uuid,
      coalesce((p_payload->>'expected_quantity')::numeric, 0),
      nullif(p_payload->>'expected_date', '')::date,
      'pending'
    ) returning id into v_id;
    perform public._inv523_log(v_org_id, 'receiving_created', 'Receiving created', null, (p_payload->>'warehouse_id')::uuid, null, p_payload);
    return jsonb_build_object('ok', true, 'receiving_id', v_id);

  elsif p_action_type = 'complete_receiving' then
    v_id := (p_payload->>'receiving_id')::uuid;
    v_qty := coalesce((p_payload->>'accepted_quantity')::numeric, 0);

    update public.organization_inventory_receiving set
      status = 'completed',
      accepted_quantity = v_qty,
      rejected_quantity = coalesce((p_payload->>'rejected_quantity')::numeric, 0),
      damaged_quantity = coalesce((p_payload->>'damaged_quantity')::numeric, 0),
      inspection_notes = coalesce(p_payload->>'inspection_notes', inspection_notes),
      received_date = current_date,
      received_by_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;

    select product_id, warehouse_id into v_product_id, v_wh_id
    from public.organization_inventory_receiving where id = v_id;

    if v_product_id is not null and v_wh_id is not null and v_qty > 0 then
      insert into public.organization_inventory_items (
        organization_id, product_id, warehouse_id, quantity, available_quantity
      ) values (v_org_id, v_product_id, v_wh_id, v_qty, v_qty)
      on conflict (organization_id, product_id, warehouse_id, location_id)
      do update set
        quantity = organization_inventory_items.quantity + excluded.quantity,
        available_quantity = organization_inventory_items.available_quantity + excluded.quantity,
        updated_at = now()
      returning id into v_item_id;
      perform public._inv523_refresh_item_status(v_item_id);
    end if;

    perform public._inv523_log(v_org_id, 'receiving_completed', 'Receiving completed', v_product_id, v_wh_id, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_reorder_recommendation' then
    v_product_id := (p_payload->>'product_id')::uuid;
    select * into v_product from public.organization_inventory_products where id = v_product_id and organization_id = v_org_id;

    insert into public.organization_inventory_reorder_recommendations (
      organization_id, product_id, recommended_quantity, reason
    ) values (
      v_org_id, v_product_id,
      coalesce((p_payload->>'recommended_quantity')::numeric, greatest(v_product.max_level - coalesce((
        select sum(available_quantity) from public.organization_inventory_items where product_id = v_product_id
      ), 0), v_product.min_level)),
      coalesce(p_payload->>'reason', 'Low stock — reorder recommended')
    ) returning id into v_id;

    perform public._inv523_log(v_org_id, 'reorder_recommended', 'Reorder recommendation created', v_product_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'recommendation_id', v_id);

  elsif p_action_type = 'acknowledge_reorder' then
    v_id := (p_payload->>'recommendation_id')::uuid;
    update public.organization_inventory_reorder_recommendations set
      status = coalesce(p_payload->>'status', 'acknowledged'), updated_at = now()
    where id = v_id and organization_id = v_org_id;
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
create or replace function public.get_companion_inventory_operations_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('inventory.view');
  v_org_id := public._inv523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._inv523_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Inventory creates visibility. Warehouses create control. Processes create efficiency.',
    'low_stock_count', (
      select count(*) from public.organization_inventory_items
      where organization_id = v_org_id and stock_status in ('low_stock', 'out_of_stock')
    ),
    'low_stock_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_name', (select name from public.organization_inventory_products where id = i.product_id),
        'available_quantity', i.available_quantity, 'stock_status', i.stock_status
      ))
      from (
        select * from public.organization_inventory_items
        where organization_id = v_org_id and stock_status in ('low_stock', 'out_of_stock')
        order by available_quantity limit 10
      ) i
    ), '[]'::jsonb),
    'pending_reorders', coalesce((
      select jsonb_agg(jsonb_build_object(
        'product_name', (select name from public.organization_inventory_products where id = rr.product_id),
        'recommended_quantity', rr.recommended_quantity
      ))
      from (
        select * from public.organization_inventory_reorder_recommendations
        where organization_id = v_org_id and status = 'pending' limit 10
      ) rr
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show low stock items.',
      'Which warehouse has inventory?',
      'Create stock transfer.',
      'Show inventory movements.',
      'Which items require reordering?'
    ),
    'routes', jsonb_build_object(
      'inventory', '/app/inventory',
      'warehouses', '/app/inventory/warehouses',
      'procurement', '/app/procurement'
    )
  );
end; $$;

create or replace function public.get_my_inventory_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('inventory.view');
  v_org_id := public._inv523_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('inventory.manage', v_org_id),
    'low_stock_count', (
      select count(*) from public.organization_inventory_items
      where organization_id = v_org_id and stock_status in ('low_stock', 'out_of_stock')
    ),
    'pending_receiving', (
      select count(*) from public.organization_inventory_receiving
      where organization_id = v_org_id and status in ('pending', 'inspecting')
    ),
    'active_transfers', (
      select count(*) from public.organization_inventory_transfers
      where organization_id = v_org_id and status in ('pending', 'in_transit')
    ),
    'routes', jsonb_build_object(
      'inventory', '/app/inventory',
      'warehouses', '/app/inventory/warehouses',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('inventory', '/app/inventory'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'inventory', 'Inventory', 'inventory', 'operations',
    'Stock levels, warehouse operations, movements, receiving, transfers, and inventory visibility.',
    'starter', null, 'operations', '/app/inventory', 'licensed', 10
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('inventory', 'inventory.view', 'view', 'Inventory — view products, stock, warehouses, and movements'),
    ('inventory', 'inventory.manage', 'manage', 'Inventory — manage stock, transfers, receiving, and adjustments')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('inventory', 'inventory.view', 'view', 'Inventory — view products, stock, warehouses, and movements'),
    ('inventory', 'inventory.manage', 'manage', 'Inventory — manage stock, transfers, receiving, and adjustments')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_inventory_operations_center(text) to authenticated;
grant execute on function public.perform_inventory_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_inventory_operations_context() to authenticated;
grant execute on function public.get_my_inventory_operations_summary() to authenticated;
