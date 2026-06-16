-- Aipify Warehouse Operations Pack
-- Feature owner: CUSTOMER APP. Core principle: Ask. Retrieve. Pack. Ship.
-- Helpers: _awhop_* (engine)

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_operations_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  voice_interaction_enabled boolean not null default true,
  printer_integration_enabled boolean not null default true,
  auto_fulfillment_enabled boolean not null default true,
  default_section text not null default 'dashboard' check (
    default_section in ('dashboard', 'inventory', 'fulfillment', 'shipping', 'productivity')
  ),
  integration_channels jsonb not null default '["shopify","woocommerce","erp","carriers","scanners","printers"]'::jsonb,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_warehouse_operations_settings enable row level security;
revoke all on public.aipify_warehouse_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Inventory
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_inventory_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  sku text not null,
  product_name text not null,
  aisle text,
  shelf text,
  bin text,
  quantity_on_hand int not null default 0 check (quantity_on_hand >= 0),
  quantity_reserved int not null default 0 check (quantity_reserved >= 0),
  reorder_threshold int not null default 0,
  unit_price numeric(12, 2),
  currency text not null default 'USD',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, sku)
);
create index if not exists aipify_warehouse_inventory_tenant_idx
  on public.aipify_warehouse_inventory_items (tenant_id, sku, product_name);
alter table public.aipify_warehouse_inventory_items enable row level security;
revoke all on public.aipify_warehouse_inventory_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Fulfillment orders & picking
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_fulfillment_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  order_key text not null,
  external_source text not null default 'manual' check (
    external_source in ('shopify', 'woocommerce', 'erp', 'manual')
  ),
  customer_label text,
  priority int not null default 100,
  fulfillment_status text not null default 'awaiting_pick' check (
    fulfillment_status in (
      'awaiting_pick', 'picking', 'packing', 'label_ready',
      'shipped', 'delayed', 'cancelled', 'on_hold'
    )
  ),
  packaging_instructions text,
  shipping_requirements text,
  due_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, order_key)
);
create index if not exists aipify_warehouse_fulfillment_orders_tenant_idx
  on public.aipify_warehouse_fulfillment_orders (tenant_id, fulfillment_status, priority, due_at);
alter table public.aipify_warehouse_fulfillment_orders enable row level security;
revoke all on public.aipify_warehouse_fulfillment_orders from authenticated, anon;

create table if not exists public.aipify_warehouse_picking_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  order_id uuid not null references public.aipify_warehouse_fulfillment_orders (id) on delete cascade,
  inventory_item_id uuid references public.aipify_warehouse_inventory_items (id) on delete set null,
  sku text not null,
  product_name text not null,
  pick_location text not null,
  quantity_to_pick int not null default 1 check (quantity_to_pick > 0),
  sequence_no int not null default 1,
  task_status text not null default 'pending' check (
    task_status in ('pending', 'in_progress', 'picked', 'skipped', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_warehouse_picking_tasks_tenant_idx
  on public.aipify_warehouse_picking_tasks (tenant_id, order_id, sequence_no);
alter table public.aipify_warehouse_picking_tasks enable row level security;
revoke all on public.aipify_warehouse_picking_tasks from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Shipments & pickups
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_shipments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  order_id uuid not null references public.aipify_warehouse_fulfillment_orders (id) on delete cascade,
  carrier text not null default 'standard',
  tracking_reference text,
  shipment_status text not null default 'draft' check (
    shipment_status in ('draft', 'label_generated', 'pickup_scheduled', 'in_transit', 'delivered', 'cancelled')
  ),
  label_printed boolean not null default false,
  customer_notified boolean not null default false,
  pickup_window_start timestamptz,
  pickup_window_end timestamptz,
  documentation jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_warehouse_shipments_tenant_idx
  on public.aipify_warehouse_shipments (tenant_id, shipment_status, pickup_window_start);
alter table public.aipify_warehouse_shipments enable row level security;
revoke all on public.aipify_warehouse_shipments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Print jobs & pending approvals
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_print_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  document_type text not null check (
    document_type in ('picking_list', 'shipping_label', 'packing_slip', 'customs_document')
  ),
  reference_id uuid,
  reference_key text,
  print_status text not null default 'queued' check (
    print_status in ('queued', 'sent_to_printer', 'completed', 'failed')
  ),
  printer_target text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists aipify_warehouse_print_jobs_tenant_idx
  on public.aipify_warehouse_print_jobs (tenant_id, print_status, created_at desc);
alter table public.aipify_warehouse_print_jobs enable row level security;
revoke all on public.aipify_warehouse_print_jobs from authenticated, anon;

create table if not exists public.aipify_warehouse_pending_approvals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  approval_type text not null check (
    approval_type in ('inventory_adjustment', 'order_cancellation', 'refund_shipment')
  ),
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'rejected')
  ),
  requested_by uuid references public.users (id) on delete set null,
  reviewed_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);
create index if not exists aipify_warehouse_pending_approvals_tenant_idx
  on public.aipify_warehouse_pending_approvals (tenant_id, approval_status, created_at desc);
alter table public.aipify_warehouse_pending_approvals enable row level security;
revoke all on public.aipify_warehouse_pending_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_warehouse_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action text not null,
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_warehouse_audit_logs_tenant_idx
  on public.aipify_warehouse_audit_logs (tenant_id, created_at desc);
alter table public.aipify_warehouse_audit_logs enable row level security;
revoke all on public.aipify_warehouse_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'aipify_warehouse', v.description
from (values
  ('aipify_warehouse.view', 'View Warehouse Operations', 'View warehouse dashboard, inventory, and fulfillment status'),
  ('aipify_warehouse.manage', 'Manage Warehouse Operations', 'Configure warehouse settings and workflows'),
  ('aipify_warehouse.fulfillment.execute', 'Execute Fulfillment', 'Pick, pack, and progress orders through fulfillment'),
  ('aipify_warehouse.inventory.adjust', 'Request Inventory Adjustments', 'Request inventory quantity changes — approval required'),
  ('aipify_warehouse.shipping.manage', 'Manage Shipping', 'Generate labels, schedule pickups, and book carriers'),
  ('aipify_warehouse.audit.view', 'View Warehouse Audit', 'Review warehouse audit trail')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'aipify_warehouse.view'),
  ('owner', 'aipify_warehouse.manage'),
  ('owner', 'aipify_warehouse.fulfillment.execute'),
  ('owner', 'aipify_warehouse.inventory.adjust'),
  ('owner', 'aipify_warehouse.shipping.manage'),
  ('owner', 'aipify_warehouse.audit.view'),
  ('administrator', 'aipify_warehouse.view'),
  ('administrator', 'aipify_warehouse.manage'),
  ('administrator', 'aipify_warehouse.fulfillment.execute'),
  ('administrator', 'aipify_warehouse.inventory.adjust'),
  ('administrator', 'aipify_warehouse.shipping.manage'),
  ('administrator', 'aipify_warehouse.audit.view'),
  ('manager', 'aipify_warehouse.view'),
  ('manager', 'aipify_warehouse.fulfillment.execute'),
  ('manager', 'aipify_warehouse.shipping.manage'),
  ('manager', 'aipify_warehouse.audit.view'),
  ('viewer', 'aipify_warehouse.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._awhop_tenant_for_auth()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._awhop_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('aipify_warehouse.view');
end; $$;

create or replace function public._awhop_require_manage()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('aipify_warehouse.manage');
end; $$;

create or replace function public._awhop_require_fulfillment()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._irp_require_permission('aipify_warehouse.fulfillment.execute');
end; $$;

create or replace function public._awhop_log(
  p_tenant_id uuid, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_warehouse_audit_logs (tenant_id, action, summary, actor_user_id, context)
  values (p_tenant_id, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._awhop_ensure_settings(p_tenant_id uuid)
returns public.aipify_warehouse_operations_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_warehouse_operations_settings;
begin
  insert into public.aipify_warehouse_operations_settings (tenant_id)
  values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_warehouse_operations_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._awhop_inventory_row(p_i public.aipify_warehouse_inventory_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_i.id,
    'sku', p_i.sku,
    'product_name', p_i.product_name,
    'aisle', coalesce(p_i.aisle, ''),
    'shelf', coalesce(p_i.shelf, ''),
    'bin', coalesce(p_i.bin, ''),
    'location_label', trim(both ' ' from concat(
      case when coalesce(p_i.shelf, '') <> '' then 'Shelf ' || p_i.shelf else '' end,
      case when coalesce(p_i.aisle, '') <> '' then
        case when coalesce(p_i.shelf, '') <> '' then ', Aisle ' || p_i.aisle else 'Aisle ' || p_i.aisle end
      else '' end,
      case when coalesce(p_i.bin, '') <> '' then
        case when coalesce(p_i.shelf, '') <> '' or coalesce(p_i.aisle, '') <> '' then ', Bin ' || p_i.bin else 'Bin ' || p_i.bin end
      else '' end
    )),
    'quantity_on_hand', p_i.quantity_on_hand,
    'quantity_reserved', p_i.quantity_reserved,
    'quantity_available', greatest(0, p_i.quantity_on_hand - p_i.quantity_reserved),
    'reorder_threshold', p_i.reorder_threshold,
    'below_reorder', p_i.quantity_on_hand <= p_i.reorder_threshold,
    'unit_price', p_i.unit_price,
    'currency', p_i.currency
  );
$$;

create or replace function public._awhop_normalize_search_query(p_query text)
returns text language sql immutable as $$
  select lower(trim(regexp_replace(
    coalesce(p_query, ''),
    '(^where is (product|item|sku)?\s*|^find (product|item|sku)?\s*|^locate (product|item|sku)?\s*)',
    '',
    'gi'
  )));
$$;

create or replace function public._awhop_seed_demo(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_order_id uuid;
begin
  perform public._awhop_ensure_settings(p_tenant_id);

  insert into public.aipify_warehouse_inventory_items (
    tenant_id, sku, product_name, aisle, shelf, bin,
    quantity_on_hand, quantity_reserved, reorder_threshold, unit_price, currency
  )
  select p_tenant_id, v.sku, v.name, v.aisle, v.shelf, v.bin, v.qty, v.res, v.reorder, v.price, 'USD'
  from (values
    ('ABC-001', 'Product ABC', '3', 'B-14', '02', 24, 2, 10, 29.99),
    ('SKU-4421', 'Wireless Headphones Pro', '1', 'A-07', '01', 58, 5, 15, 89.00),
    ('SKU-7780', 'Organic Cotton T-Shirt (M)', '2', 'C-03', '04', 8, 0, 20, 24.50),
    ('SKU-9901', 'Stainless Water Bottle', '4', 'D-11', '01', 3, 1, 12, 19.99)
  ) as v(sku, name, aisle, shelf, bin, qty, res, reorder, price)
  on conflict (tenant_id, sku) do nothing;

  insert into public.aipify_warehouse_fulfillment_orders (
    tenant_id, order_key, external_source, customer_label, priority,
    fulfillment_status, packaging_instructions, shipping_requirements, due_at
  )
  select p_tenant_id, v.order_key, v.source, v.customer, v.priority, v.status, v.pack, v.ship, v.due
  from (values
    ('ORD-10482', 'shopify', 'Nordic Retail Co.', 10, 'awaiting_pick',
     'Use recyclable mailer. Include thank-you card.', 'Standard domestic shipping', now() + interval '4 hours'),
    ('ORD-10479', 'woocommerce', 'Bergen Supplies AS', 20, 'picking',
     'Fragile — double-box with padding.', 'Express carrier required', now() + interval '2 hours'),
    ('ORD-10471', 'erp', 'Warehouse Test Account', 50, 'delayed',
     'Pallet wrap for bulk items.', 'Freight LTL — schedule pickup', now() - interval '6 hours')
  ) as v(order_key, source, customer, priority, status, pack, ship, due)
  on conflict (tenant_id, order_key) do nothing;

  select id into v_order_id
  from public.aipify_warehouse_fulfillment_orders
  where tenant_id = p_tenant_id and order_key = 'ORD-10482'
  limit 1;

  if v_order_id is not null and not exists (
    select 1 from public.aipify_warehouse_picking_tasks where tenant_id = p_tenant_id and order_id = v_order_id
  ) then
    insert into public.aipify_warehouse_picking_tasks (
      tenant_id, order_id, inventory_item_id, sku, product_name, pick_location, quantity_to_pick, sequence_no
    )
    select p_tenant_id, v_order_id, i.id, i.sku, i.product_name,
      trim(both ' ' from concat('Shelf ', coalesce(i.shelf, ''), ', Aisle ', coalesce(i.aisle, ''))),
      2, 1
    from public.aipify_warehouse_inventory_items i
    where i.tenant_id = p_tenant_id and i.sku = 'ABC-001';
  end if;

  insert into public.aipify_warehouse_shipments (tenant_id, order_id, carrier, shipment_status, label_printed)
  select p_tenant_id, o.id, 'DHL Express', 'pickup_scheduled', true
  from public.aipify_warehouse_fulfillment_orders o
  where o.tenant_id = p_tenant_id and o.order_key = 'ORD-10479'
    and not exists (
      select 1 from public.aipify_warehouse_shipments s where s.tenant_id = p_tenant_id and s.order_id = o.id
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Inventory search
-- ---------------------------------------------------------------------------
create or replace function public.search_aipify_warehouse_inventory(p_query text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_q text;
begin
  perform public._awhop_require_view();
  v_tenant_id := public._awhop_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant required'; end if;
  perform public._awhop_seed_demo(v_tenant_id);

  v_q := public._awhop_normalize_search_query(p_query);

  return jsonb_build_object(
    'query', coalesce(p_query, ''),
    'results', coalesce((
      select jsonb_agg(public._awhop_inventory_row(i) order by i.product_name)
      from public.aipify_warehouse_inventory_items i
      where i.tenant_id = v_tenant_id
        and (
          v_q = '' or i.sku ilike '%' || v_q || '%' or i.product_name ilike '%' || v_q || '%'
          or coalesce(i.aisle, '') ilike '%' || v_q || '%' or coalesce(i.shelf, '') ilike '%' || v_q || '%'
        )
      limit 20
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_aipify_warehouse_operations_action(
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_order_id uuid;
  v_shipment_id uuid;
  v_print_id uuid;
  v_approval_id uuid;
  v_item public.aipify_warehouse_inventory_items;
begin
  v_tenant_id := public._awhop_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Tenant required'; end if;
  perform public._awhop_seed_demo(v_tenant_id);

  if p_action = 'generate_picking_list' then
    perform public._awhop_require_fulfillment();
    v_order_id := (p_payload->>'order_id')::uuid;
    update public.aipify_warehouse_fulfillment_orders
      set fulfillment_status = 'picking', updated_at = now()
    where id = v_order_id and tenant_id = v_tenant_id;
    insert into public.aipify_warehouse_print_jobs (tenant_id, document_type, reference_id, reference_key, print_status)
    values (v_tenant_id, 'picking_list', v_order_id, p_payload->>'order_key', 'queued')
    returning id into v_print_id;
    perform public._awhop_log(v_tenant_id, 'picking_list_generated', 'Picking list generated for order',
      jsonb_build_object('order_id', v_order_id, 'print_job_id', v_print_id));
    return jsonb_build_object('ok', true, 'print_job_id', v_print_id);

  elsif p_action = 'print_document' then
    perform public._awhop_require_fulfillment();
    insert into public.aipify_warehouse_print_jobs (
      tenant_id, document_type, reference_id, reference_key, print_status, printer_target
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'document_type', 'shipping_label'),
      (p_payload->>'reference_id')::uuid,
      p_payload->>'reference_key',
      'sent_to_printer',
      coalesce(p_payload->>'printer_target', 'warehouse_default')
    ) returning id into v_print_id;
    perform public._awhop_log(v_tenant_id, 'document_printed', 'Document sent to printer',
      jsonb_build_object('print_job_id', v_print_id, 'document_type', p_payload->>'document_type'));
    return jsonb_build_object('ok', true, 'print_job_id', v_print_id);

  elsif p_action = 'schedule_pickup' then
    perform public._irp_require_permission('aipify_warehouse.shipping.manage');
    v_shipment_id := (p_payload->>'shipment_id')::uuid;
    update public.aipify_warehouse_shipments set
      shipment_status = 'pickup_scheduled',
      pickup_window_start = coalesce((p_payload->>'window_start')::timestamptz, now() + interval '1 day'),
      pickup_window_end = coalesce((p_payload->>'window_end')::timestamptz, now() + interval '1 day 4 hours'),
      updated_at = now()
    where id = v_shipment_id and tenant_id = v_tenant_id;
    perform public._awhop_log(v_tenant_id, 'pickup_scheduled', 'Carrier pickup scheduled',
      jsonb_build_object('shipment_id', v_shipment_id));
    return jsonb_build_object('ok', true, 'shipment_id', v_shipment_id);

  elsif p_action = 'mark_pick_complete' then
    perform public._awhop_require_fulfillment();
    update public.aipify_warehouse_picking_tasks set task_status = 'picked', updated_at = now()
    where id = (p_payload->>'task_id')::uuid and tenant_id = v_tenant_id;
    perform public._awhop_log(v_tenant_id, 'pick_completed', 'Pick task marked complete', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action = 'request_approval' then
    perform public._irp_require_permission('aipify_warehouse.inventory.adjust');
    insert into public.aipify_warehouse_pending_approvals (
      tenant_id, approval_type, summary, payload, requested_by
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'approval_type', 'inventory_adjustment'),
      coalesce(p_payload->>'summary', 'Warehouse action requires approval'),
      coalesce(p_payload, '{}'::jsonb),
      public._mta_app_user_id()
    ) returning id into v_approval_id;
    perform public._awhop_log(v_tenant_id, 'approval_requested', 'Sensitive warehouse action submitted for approval',
      jsonb_build_object('approval_id', v_approval_id, 'approval_type', p_payload->>'approval_type'));
    return jsonb_build_object('ok', true, 'approval_id', v_approval_id, 'status', 'pending');

  elsif p_action = 'review_approval' then
    perform public._awhop_require_manage();
    v_approval_id := (p_payload->>'approval_id')::uuid;
    update public.aipify_warehouse_pending_approvals set
      approval_status = case when p_payload->>'decision' = 'approve' then 'approved' else 'rejected' end,
      reviewed_by = public._mta_app_user_id(),
      reviewed_at = now()
    where id = v_approval_id and tenant_id = v_tenant_id and approval_status = 'pending';
    if p_payload->>'decision' = 'approve' and (p_payload->>'approval_type' = 'inventory_adjustment'
      or exists (
        select 1 from public.aipify_warehouse_pending_approvals
        where id = v_approval_id and approval_type = 'inventory_adjustment'
      )) then
      select * into v_item from public.aipify_warehouse_inventory_items
      where id = (p_payload->>'inventory_item_id')::uuid and tenant_id = v_tenant_id;
      if v_item.id is not null then
        update public.aipify_warehouse_inventory_items set
          quantity_on_hand = coalesce((p_payload->>'new_quantity')::int, quantity_on_hand),
          updated_at = now()
        where id = v_item.id;
        perform public._awhop_log(v_tenant_id, 'inventory_adjusted', 'Inventory adjusted after approval', p_payload);
      end if;
    end if;
    return jsonb_build_object('ok', true, 'approval_id', v_approval_id);

  else
    raise exception 'Unknown warehouse action: %', p_action;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Dashboard & card RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_aipify_warehouse_operations_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.aipify_warehouse_operations_settings;
begin
  perform public._awhop_require_view();
  v_tenant_id := public._awhop_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_tenant', false); end if;
  perform public._awhop_seed_demo(v_tenant_id);
  v_settings := public._awhop_ensure_settings(v_tenant_id);
  perform public._awhop_log(v_tenant_id, 'dashboard_view', 'Warehouse operations dashboard viewed', '{}'::jsonb);

  return jsonb_build_object(
    'has_tenant', true,
    'principle', 'Ask. Retrieve. Pack. Ship.',
    'vision', 'A warehouse employee should spend their time moving products—not fighting software.',
    'settings', jsonb_build_object(
      'enabled', v_settings.enabled,
      'voice_interaction_enabled', v_settings.voice_interaction_enabled,
      'printer_integration_enabled', v_settings.printer_integration_enabled,
      'auto_fulfillment_enabled', v_settings.auto_fulfillment_enabled,
      'integration_channels', v_settings.integration_channels
    ),
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'inventory_intelligence', 'label', 'Inventory Intelligence'),
      jsonb_build_object('key', 'order_fulfillment', 'label', 'Order Fulfillment'),
      jsonb_build_object('key', 'packaging_workflow', 'label', 'Packaging Workflow'),
      jsonb_build_object('key', 'shipping_automation', 'label', 'Shipping Automation'),
      jsonb_build_object('key', 'printer_integration', 'label', 'Printer Integration'),
      jsonb_build_object('key', 'voice_interaction', 'label', 'Voice Interaction')
    ),
    'voice_examples', jsonb_build_array(
      'Aipify™, where is this item?',
      'Aipify™, print the shipping label.',
      'Aipify™, schedule pickup.'
    ),
    'workflow_steps', jsonb_build_array('Go', 'Pick', 'Pack', 'Attach label'),
    'metrics', jsonb_build_object(
      'orders_awaiting_fulfillment', (
        select count(*) from public.aipify_warehouse_fulfillment_orders
        where tenant_id = v_tenant_id and fulfillment_status in ('awaiting_pick', 'picking', 'packing')
      ),
      'delayed_shipments', (
        select count(*) from public.aipify_warehouse_fulfillment_orders
        where tenant_id = v_tenant_id and fulfillment_status = 'delayed'
      ),
      'inventory_shortages', (
        select count(*) from public.aipify_warehouse_inventory_items
        where tenant_id = v_tenant_id and quantity_on_hand <= reorder_threshold
      ),
      'pickups_scheduled', (
        select count(*) from public.aipify_warehouse_shipments
        where tenant_id = v_tenant_id and shipment_status = 'pickup_scheduled'
      ),
      'picks_completed_today', (
        select count(*) from public.aipify_warehouse_picking_tasks
        where tenant_id = v_tenant_id and task_status = 'picked'
          and updated_at >= date_trunc('day', now())
      )
    ),
    'orders_awaiting', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'order_key', o.order_key, 'customer_label', coalesce(o.customer_label, ''),
        'external_source', o.external_source, 'fulfillment_status', o.fulfillment_status,
        'priority', o.priority, 'due_at', o.due_at,
        'packaging_instructions', coalesce(o.packaging_instructions, ''),
        'shipping_requirements', coalesce(o.shipping_requirements, '')
      ) order by o.priority, o.due_at nulls last)
      from public.aipify_warehouse_fulfillment_orders o
      where o.tenant_id = v_tenant_id and o.fulfillment_status not in ('shipped', 'cancelled')
      limit 15
    ), '[]'::jsonb),
    'picking_tasks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'order_id', t.order_id, 'sku', t.sku, 'product_name', t.product_name,
        'pick_location', t.pick_location, 'quantity_to_pick', t.quantity_to_pick,
        'sequence_no', t.sequence_no, 'task_status', t.task_status
      ) order by t.sequence_no)
      from public.aipify_warehouse_picking_tasks t
      where t.tenant_id = v_tenant_id and t.task_status in ('pending', 'in_progress')
      limit 20
    ), '[]'::jsonb),
    'inventory_shortages', coalesce((
      select jsonb_agg(public._awhop_inventory_row(i))
      from public.aipify_warehouse_inventory_items i
      where i.tenant_id = v_tenant_id and i.quantity_on_hand <= i.reorder_threshold
      limit 10
    ), '[]'::jsonb),
    'pickup_schedules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'carrier', s.carrier, 'shipment_status', s.shipment_status,
        'pickup_window_start', s.pickup_window_start, 'pickup_window_end', s.pickup_window_end,
        'order_key', o.order_key
      ) order by s.pickup_window_start nulls last)
      from public.aipify_warehouse_shipments s
      join public.aipify_warehouse_fulfillment_orders o on o.id = s.order_id
      where s.tenant_id = v_tenant_id and s.shipment_status in ('pickup_scheduled', 'label_generated')
      limit 10
    ), '[]'::jsonb),
    'recent_print_jobs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'document_type', p.document_type, 'print_status', p.print_status,
        'reference_key', coalesce(p.reference_key, ''), 'created_at', p.created_at
      ) order by p.created_at desc)
      from public.aipify_warehouse_print_jobs p
      where p.tenant_id = v_tenant_id
      limit 8
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'approval_type', a.approval_type, 'summary', a.summary,
        'approval_status', a.approval_status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.aipify_warehouse_pending_approvals a
      where a.tenant_id = v_tenant_id and a.approval_status = 'pending'
      limit 10
    ), '[]'::jsonb),
    'approval_rules', jsonb_build_array(
      jsonb_build_object('key', 'inventory_adjustment', 'label', 'Inventory adjustments'),
      jsonb_build_object('key', 'order_cancellation', 'label', 'Order cancellations'),
      jsonb_build_object('key', 'refund_shipment', 'label', 'Refund-related shipments')
    ),
    'integrations', jsonb_build_array(
      jsonb_build_object('key', 'shopify', 'label', 'Shopify', 'status', 'ready'),
      jsonb_build_object('key', 'woocommerce', 'label', 'WooCommerce', 'status', 'ready'),
      jsonb_build_object('key', 'erp', 'label', 'ERP systems', 'status', 'connect'),
      jsonb_build_object('key', 'carriers', 'label', 'Shipping providers', 'status', 'ready'),
      jsonb_build_object('key', 'scanners', 'label', 'Barcode scanners', 'status', 'ready'),
      jsonb_build_object('key', 'printers', 'label', 'Warehouse printers', 'status', 'ready')
    ),
    'success_criteria', jsonb_build_array(
      'Fewer clicks per fulfillment',
      'Reduced picking errors',
      'Less training time for new warehouse staff',
      'Intuitive Ask → Retrieve → Pack → Ship flow'
    ),
    'workspace_route', '/app/aipify-warehouse-operations',
    'marketplace_route', '/app/marketplace/packs/aipify_warehouse'
  );
end; $$;

create or replace function public.get_aipify_warehouse_operations_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._awhop_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_tenant', false); end if;
  perform public._awhop_seed_demo(v_tenant_id);
  return jsonb_build_object(
    'has_tenant', true,
    'principle', 'Ask. Retrieve. Pack. Ship.',
    'orders_awaiting', (
      select count(*) from public.aipify_warehouse_fulfillment_orders
      where tenant_id = v_tenant_id and fulfillment_status in ('awaiting_pick', 'picking', 'packing')
    ),
    'inventory_shortages', (
      select count(*) from public.aipify_warehouse_inventory_items
      where tenant_id = v_tenant_id and quantity_on_hand <= reorder_threshold
    ),
    'pending_approvals', (
      select count(*) from public.aipify_warehouse_pending_approvals
      where tenant_id = v_tenant_id and approval_status = 'pending'
    )
  );
exception when others then
  return jsonb_build_object('has_tenant', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Business Pack seeds
-- ---------------------------------------------------------------------------
insert into public.business_pack_identity (
  pack_key, pack_name, pack_category, version, status,
  short_description, long_description, intended_audience,
  key_benefits, business_value_statement, primary_use_cases, expected_outcomes, business_value,
  features, workspace_route, landing_route, knowledge_center_category,
  install_allowed, licensing_summary, catalog_pack_key, published_at
)
values (
  'aipify_warehouse', 'Aipify Warehouse Operations', 'operations', '1.0.0', 'active',
  'Warehouse operations that move products—not paperwork. Ask, retrieve, pack, and ship with fewer clicks.',
  'Aipify Warehouse Operations is a Business Pack for fulfillment teams. Natural-language inventory lookup, automated picking lists, packaging workflows, shipping automation, printer integration, and a live operations dashboard — with human approval for sensitive actions.',
  'Warehouse managers, fulfillment staff, and operations leads in retail, e-commerce, and distribution.',
  '["Natural-language inventory search","Automated picking and fulfillment","Shipping and label automation","Printer-ready documents","Voice-friendly warehouse workflow"]'::jsonb,
  'Spend time moving products—not fighting software. Aipify prepares; your team decides.',
  '["Find stock locations instantly","Fulfill orders with guided pick-pack-ship","Schedule carrier pickups","Track shortages and delays"]'::jsonb,
  '["Fewer fulfillment errors","Reduced training time","Faster order throughput","Clear audit trail for inventory and shipments"]'::jsonb,
  '{"why":"Warehouse staff lose hours to fragmented systems and manual lookups.","who_benefits":"Pickers, packers, warehouse managers, and operations leads.","problems_solved":"Slow location lookup, manual picking lists, label friction, opaque fulfillment status.","measurable_outcomes":"Pick accuracy, orders fulfilled per shift, time-to-ship reduction."}'::jsonb,
  '["Inventory intelligence","Order fulfillment","Packaging workflow","Shipping automation","Printer integration","Warehouse dashboard","Voice interaction"]'::jsonb,
  '/app/aipify-warehouse-operations', '/app/marketplace/packs/aipify_warehouse', 'aipify-warehouse-operations',
  true, 'Warehouse capacity licensing — scales with fulfillment locations and team seats.', 'warehouse_operations', now()
)
on conflict (pack_key) do update set
  pack_name = excluded.pack_name,
  short_description = excluded.short_description,
  long_description = excluded.long_description,
  features = excluded.features,
  workspace_route = excluded.workspace_route,
  updated_at = now();

insert into public.business_pack_license_definitions (
  pack_key, pack_name, license_metric, metric_label, metric_label_plural,
  tiers, trial_config, downgrade_rules, renewal_rules, failed_payment_rules,
  enterprise_rules, upgrade_path, feature_comparison
)
select
  'aipify_warehouse', 'Aipify Warehouse Operations', 'locations', 'Location', 'Locations',
  '[{"key":"entry","label":"Warehouse Starter","tier_type":"entry","capacity_min":1,"capacity_max":1,"monthly_price":129,"annual_price":1240},{"key":"growth","label":"Warehouse Growth","tier_type":"growth","capacity_min":1,"capacity_max":3,"monthly_price":199,"annual_price":1910},{"key":"professional","label":"Warehouse Professional","tier_type":"professional","capacity_min":3,"capacity_max":10,"monthly_price":349,"annual_price":3350},{"key":"enterprise","label":"Warehouse Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]'::jsonb,
  '{"available":true,"duration_days":14,"type":"limited_capacity","limitations":{"locations":1}}'::jsonb,
  public._bple_default_downgrade_rules(),
  public._bple_default_renewal_rules(),
  '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}'::jsonb,
  public._bple_default_enterprise_rules(),
  '["entry","growth","professional","enterprise"]'::jsonb,
  '[{"feature":"Inventory intelligence","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Fulfillment locations","entry":"1","growth":"1–3","professional":"3–10","enterprise":"Custom"},{"feature":"Shipping automation","entry":false,"growth":true,"professional":true,"enterprise":true}]'::jsonb
where not exists (select 1 from public.business_pack_license_definitions where pack_key = 'aipify_warehouse');

insert into public.business_pack_language_definitions (
  pack_key, pack_name, locale_namespace, locale_resource_path, mandatory_languages,
  optional_languages, default_language, localization_scope, translation_completion_percent
)
select
  'aipify_warehouse', 'Aipify Warehouse Operations', 'packs/aipify-warehouse',
  'locales/{locale}/packs/aipify-warehouse.json', '["en","no","sv","da"]'::jsonb,
  '["de","fr","es","nl"]'::jsonb, 'en',
  '["dashboard","inventory","fulfillment","shipping","voice","approvals"]'::jsonb, 100
where not exists (select 1 from public.business_pack_language_definitions where pack_key = 'aipify_warehouse');

insert into public.business_pack_marketplace_listings (
  pack_key, marketplace_visibility, marketplace_category, starting_price_monthly,
  pricing_label, trial_available, popular_rank, recently_added_at, published_at
)
values (
  'aipify_warehouse', 'published', 'operations', 129.00,
  'From $129/mo', true, 35, now(), now()
)
on conflict (pack_key) do update set
  marketplace_visibility = excluded.marketplace_visibility,
  starting_price_monthly = excluded.starting_price_monthly,
  pricing_label = excluded.pricing_label,
  updated_at = now();

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-warehouse-operations', 'Warehouse Operations Pack', 'Ask. Retrieve. Pack. Ship. — warehouse fulfillment with inventory intelligence and human approval for sensitive actions.', 'authenticated', 58
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-warehouse-operations' and tenant_id is null);

grant execute on function public.search_aipify_warehouse_inventory(text) to authenticated;
grant execute on function public.perform_aipify_warehouse_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_aipify_warehouse_operations_dashboard() to authenticated;
grant execute on function public.get_aipify_warehouse_operations_card() to authenticated;

do $$
declare v_tenant_id uuid;
begin
  for v_tenant_id in select id from public.customers loop
    perform public._awhop_seed_demo(v_tenant_id);
  end loop;
end $$;
