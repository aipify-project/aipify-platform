-- Phase Airbnb 23 — Aipify Hosts Supplies Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostsup_* (engine), _ahostbp385_* (blueprint)

create table if not exists public.aipify_hosts_supplies_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'inventory_overview' check (
    default_section in (
      'inventory_overview', 'property_supplies', 'low_stock_alerts',
      'purchase_history', 'suppliers'
    )
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_supplies_center_settings enable row level security;
revoke all on public.aipify_hosts_supplies_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_inventory_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  item_key text not null,
  item_name text not null,
  category text not null check (
    category in (
      'bathroom_supplies', 'kitchen_supplies', 'cleaning_supplies', 'bedroom_supplies',
      'guest_welcome_items', 'safety_supplies', 'maintenance_supplies'
    )
  ),
  current_quantity numeric(12,2) not null default 0 check (current_quantity >= 0),
  minimum_quantity numeric(12,2) not null default 0 check (minimum_quantity >= 0),
  unit_type text not null default 'units',
  inventory_status text not null default 'in_stock' check (
    inventory_status in ('in_stock', 'low_stock', 'out_of_stock', 'discontinued')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);
create index if not exists aipify_hosts_inventory_items_tenant_idx
  on public.aipify_hosts_inventory_items (tenant_id, inventory_status, category);
alter table public.aipify_hosts_inventory_items enable row level security;
revoke all on public.aipify_hosts_inventory_items from authenticated, anon;

create table if not exists public.aipify_hosts_inventory_suppliers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_key text not null,
  supplier_name text not null,
  contact_information text,
  category text not null,
  preferred_supplier boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, supplier_key)
);
alter table public.aipify_hosts_inventory_suppliers enable row level security;
revoke all on public.aipify_hosts_inventory_suppliers from authenticated, anon;

create table if not exists public.aipify_hosts_inventory_purchases (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  inventory_item_id uuid references public.aipify_hosts_inventory_items (id) on delete set null,
  supplier_id uuid references public.aipify_hosts_inventory_suppliers (id) on delete set null,
  supplier_name text not null,
  purchase_date date not null default current_date,
  quantity numeric(12,2) not null default 0,
  cost numeric(12,2),
  purchase_status text not null default 'completed' check (purchase_status in ('pending', 'completed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_inventory_purchases_tenant_idx
  on public.aipify_hosts_inventory_purchases (tenant_id, purchase_date desc);
alter table public.aipify_hosts_inventory_purchases enable row level security;
revoke all on public.aipify_hosts_inventory_purchases from authenticated, anon;

create table if not exists public.aipify_hosts_inventory_tasks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  inventory_item_id uuid references public.aipify_hosts_inventory_items (id) on delete set null,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  task_type text not null check (
    task_type in ('restock_supplies', 'verify_inventory', 'update_quantities', 'assign_responsibility', 'purchase_task')
  ),
  task_summary text not null,
  assigned_to text,
  due_date date,
  task_status text not null default 'open' check (task_status in ('open', 'in_progress', 'completed', 'cancelled')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists aipify_hosts_inventory_tasks_tenant_idx
  on public.aipify_hosts_inventory_tasks (tenant_id, task_status);
alter table public.aipify_hosts_inventory_tasks enable row level security;
revoke all on public.aipify_hosts_inventory_tasks from authenticated, anon;

create table if not exists public.aipify_hosts_supplies_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_supplies_center_events_tenant_idx
  on public.aipify_hosts_supplies_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_supplies_center_events enable row level security;
revoke all on public.aipify_hosts_supplies_center_events from authenticated, anon;

create or replace function public._ahostsup_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_supplies_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_supplies_center_settings;
begin
  insert into public.aipify_hosts_supplies_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_supplies_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostsup_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_supplies_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'supplies_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostsup_push_notification(
  p_tenant_id uuid, p_key text, p_priority text, p_title text, p_message text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_hosts_notifications (
    tenant_id, notification_key, category, priority, notification_status, title, message, requires_attention
  ) values (
    p_tenant_id, p_key, 'incidents', p_priority, 'unread', p_title, p_message, p_priority in ('high', 'critical')
  ) on conflict (tenant_id, notification_key) do update set
    priority = excluded.priority, title = excluded.title, message = excluded.message,
    requires_attention = excluded.requires_attention, notification_status = 'unread', updated_at = now();
exception when undefined_table then null;
end; $$;

create or replace function public._ahostsup_compute_status(p_current numeric, p_minimum numeric)
returns text language sql immutable as $$
  select case
    when p_current <= 0 then 'out_of_stock'
    when p_current <= p_minimum then 'low_stock'
    else 'in_stock'
  end; $$;

create or replace function public._ahostbp385_positioning() returns text language sql immutable as $$
  select 'Ensure properties remain fully stocked and guest-ready — inventory, alerts, purchases, and suppliers in one Supplies Center.'; $$;

create or replace function public._ahostbp385_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'inventory_overview', 'label', 'Inventory Overview'),
    jsonb_build_object('key', 'property_supplies', 'label', 'Property Supplies'),
    jsonb_build_object('key', 'low_stock_alerts', 'label', 'Low Stock Alerts'),
    jsonb_build_object('key', 'purchase_history', 'label', 'Purchase History'),
    jsonb_build_object('key', 'suppliers', 'label', 'Suppliers')
  ); $$;

create or replace function public._ahostbp385_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'bathroom_supplies', 'kitchen_supplies', 'cleaning_supplies', 'bedroom_supplies',
    'guest_welcome_items', 'safety_supplies', 'maintenance_supplies'
  ); $$;

create or replace function public._ahostsup_item_row(p_i public.aipify_hosts_inventory_items, p_property text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_i.id,
    'item_key', p_i.item_key,
    'item_name', p_i.item_name,
    'category', p_i.category,
    'property', coalesce(p_property, '—'),
    'property_id', p_i.property_id,
    'current_quantity', p_i.current_quantity,
    'minimum_quantity', p_i.minimum_quantity,
    'unit_type', p_i.unit_type,
    'status', p_i.inventory_status,
    'updated_at', to_char(p_i.updated_at, 'YYYY-MM-DD HH24:MI')
  ); $$;

create or replace function public._ahostsup_refresh_item_status(p_item_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item public.aipify_hosts_inventory_items; v_status text; v_tenant uuid;
begin
  select * into v_item from public.aipify_hosts_inventory_items where id = p_item_id;
  if v_item.id is null or v_item.inventory_status = 'discontinued' then return; end if;
  v_status := public._ahostsup_compute_status(v_item.current_quantity, v_item.minimum_quantity);
  update public.aipify_hosts_inventory_items set inventory_status = v_status, updated_at = now() where id = p_item_id;
  v_tenant := v_item.tenant_id;
  if v_status = 'low_stock' then
    perform public._ahostsup_push_notification(v_tenant, 'sup_low_' || p_item_id::text, 'important',
      'Low stock detected', v_item.item_name || ' is below minimum quantity');
  elsif v_status = 'out_of_stock' then
    perform public._ahostsup_push_notification(v_tenant, 'sup_out_' || p_item_id::text, 'critical',
      'Critical supply shortage', v_item.item_name || ' is out of stock');
  end if;
end; $$;

create or replace function public._ahostsup_seed_inventory(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop uuid;
begin
  if exists (select 1 from public.aipify_hosts_inventory_items where tenant_id = p_tenant_id limit 1) then return; end if;
  select id into v_prop from public.aipify_hosts_properties where tenant_id = p_tenant_id and status <> 'archived' limit 1;
  insert into public.aipify_hosts_inventory_items (
    tenant_id, property_id, item_key, item_name, category, current_quantity, minimum_quantity, unit_type, inventory_status
  ) values
    (p_tenant_id, v_prop, 'inv_001', 'Toilet paper rolls', 'bathroom_supplies', 24, 12, 'rolls', 'in_stock'),
    (p_tenant_id, v_prop, 'inv_002', 'Hand soap refills', 'bathroom_supplies', 4, 6, 'bottles', 'low_stock'),
    (p_tenant_id, v_prop, 'inv_003', 'Coffee pods', 'kitchen_supplies', 30, 20, 'pods', 'in_stock'),
    (p_tenant_id, v_prop, 'inv_004', 'All-purpose cleaner', 'cleaning_supplies', 2, 4, 'bottles', 'low_stock'),
    (p_tenant_id, v_prop, 'inv_005', 'Fresh bed linens set', 'bedroom_supplies', 0, 2, 'sets', 'out_of_stock'),
    (p_tenant_id, v_prop, 'inv_006', 'Welcome snack basket', 'guest_welcome_items', 5, 3, 'baskets', 'in_stock'),
    (p_tenant_id, v_prop, 'inv_007', 'Smoke detector batteries', 'safety_supplies', 8, 4, 'packs', 'in_stock');
  insert into public.aipify_hosts_inventory_suppliers (
    tenant_id, supplier_key, supplier_name, contact_information, category, preferred_supplier
  ) values
    (p_tenant_id, 'sup_001', 'Nordic Hospitality Supply', 'orders@nordichosp.no · +47 400 11 001', 'cleaning_supplies', true),
    (p_tenant_id, 'sup_002', 'Guest Essentials Co.', 'hello@guestessentials.com', 'guest_welcome_items', true),
    (p_tenant_id, 'sup_003', 'Maintenance Direct', '+47 400 22 002', 'maintenance_supplies', false);
  insert into public.aipify_hosts_inventory_purchases (
    tenant_id, property_id, supplier_name, purchase_date, quantity, cost, purchase_status
  ) values
    (p_tenant_id, v_prop, 'Nordic Hospitality Supply', current_date - 14, 48, 890, 'completed'),
    (p_tenant_id, v_prop, 'Guest Essentials Co.', current_date - 7, 10, 450, 'completed'),
    (p_tenant_id, v_prop, 'Maintenance Direct', current_date - 3, 12, 320, 'pending');
end; $$;

create or replace function public._ahostsup_dashboard_stats(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'total_items', (select count(*)::int from public.aipify_hosts_inventory_items where tenant_id = p_tenant_id),
    'low_stock_count', (select count(*)::int from public.aipify_hosts_inventory_items
      where tenant_id = p_tenant_id and inventory_status in ('low_stock', 'out_of_stock')),
    'out_of_stock_count', (select count(*)::int from public.aipify_hosts_inventory_items
      where tenant_id = p_tenant_id and inventory_status = 'out_of_stock'),
    'pending_orders', (select count(*)::int from public.aipify_hosts_inventory_purchases
      where tenant_id = p_tenant_id and purchase_status = 'pending'),
    'supplier_count', (select count(*)::int from public.aipify_hosts_inventory_suppliers where tenant_id = p_tenant_id)
  ); $$;

create or replace function public._ahostsup_property_inventory(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'property_id', p.id,
    'property_name', p.display_name,
    'inventory_health', case
      when coalesce(low_c.cnt, 0) = 0 then 'healthy'
      when coalesce(out_c.cnt, 0) > 0 then 'critical'
      else 'attention'
    end,
    'low_stock_count', coalesce(low_c.cnt, 0),
    'outstanding_orders', coalesce(ord_c.cnt, 0),
    'total_items', coalesce(all_c.cnt, 0)
  ) order by p.display_name), '[]'::jsonb)
  from public.aipify_hosts_properties p
  left join lateral (
    select count(*)::int as cnt from public.aipify_hosts_inventory_items i
    where i.tenant_id = p_tenant_id and i.property_id = p.id
  ) all_c on true
  left join lateral (
    select count(*)::int as cnt from public.aipify_hosts_inventory_items i
    where i.tenant_id = p_tenant_id and i.property_id = p.id and i.inventory_status in ('low_stock', 'out_of_stock')
  ) low_c on true
  left join lateral (
    select count(*)::int as cnt from public.aipify_hosts_inventory_items i
    where i.tenant_id = p_tenant_id and i.property_id = p.id and i.inventory_status = 'out_of_stock'
  ) out_c on true
  left join lateral (
    select count(*)::int as cnt from public.aipify_hosts_inventory_purchases pu
    where pu.tenant_id = p_tenant_id and pu.property_id = p.id and pu.purchase_status = 'pending'
  ) ord_c on true
  where p.tenant_id = p_tenant_id and p.status <> 'archived'; $$;

create or replace function public.get_aipify_hosts_supplies_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_sc public.aipify_hosts_supplies_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_sc := public._ahostsup_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_sc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp385_positioning(),
    'route', '/app/aipify-hosts/supplies',
    'stats', public._ahostsup_dashboard_stats(v_tenant_id)
  );
end; $$;

create or replace function public.get_aipify_hosts_supplies_center_dashboard(
  p_section text default 'inventory_overview',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_sc public.aipify_hosts_supplies_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_all jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_sc := public._ahostsup_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_sc.default_section, 'inventory_overview');
  perform public._ahostsup_seed_inventory(v_tenant_id);
  perform public._ahostsup_log_event(v_tenant_id, 'dashboard_view', 'Supplies Center viewed',
    jsonb_build_object('section', v_section));

  select coalesce(jsonb_agg(public._ahostsup_item_row(i, coalesce(p.display_name, '—')) order by i.item_name), '[]'::jsonb)
  into v_all
  from public.aipify_hosts_inventory_items i
  left join public.aipify_hosts_properties p on p.id = i.property_id
  where i.tenant_id = v_tenant_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_sc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'positioning', public._ahostbp385_positioning(),
    'governance', jsonb_build_object(
      'audit_quantity_changes', true,
      'audit_supplier_updates', true,
      'audit_inventory_adjustments', true,
      'role_permissions', true
    ),
    'sections', public._ahostbp385_sections(),
    'inventory_categories', public._ahostbp385_categories(),
    'inventory_statuses', jsonb_build_array('in_stock', 'low_stock', 'out_of_stock', 'discontinued'),
    'stats', public._ahostsup_dashboard_stats(v_tenant_id),
    'property_inventory', public._ahostsup_property_inventory(v_tenant_id),
    'inventory_overview', v_all,
    'property_supplies', v_all,
    'low_stock_alerts', (
      select coalesce(jsonb_agg(public._ahostsup_item_row(i, coalesce(p.display_name, '—')) order by i.current_quantity), '[]'::jsonb)
      from public.aipify_hosts_inventory_items i
      left join public.aipify_hosts_properties p on p.id = i.property_id
      where i.tenant_id = v_tenant_id and i.inventory_status in ('low_stock', 'out_of_stock')
    ),
    'purchase_history', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', pu.id, 'supplier', pu.supplier_name, 'property', coalesce(pr.display_name, '—'),
        'property_id', pu.property_id, 'purchase_date', pu.purchase_date::text,
        'quantity', pu.quantity, 'cost', pu.cost, 'status', pu.purchase_status,
        'item_id', pu.inventory_item_id
      ) order by pu.purchase_date desc), '[]'::jsonb)
      from public.aipify_hosts_inventory_purchases pu
      left join public.aipify_hosts_properties pr on pr.id = pu.property_id
      where pu.tenant_id = v_tenant_id
    ),
    'suppliers', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', s.id, 'supplier_key', s.supplier_key, 'supplier_name', s.supplier_name,
        'contact_information', s.contact_information, 'category', s.category,
        'preferred_supplier', s.preferred_supplier
      ) order by s.preferred_supplier desc, s.supplier_name), '[]'::jsonb)
      from public.aipify_hosts_inventory_suppliers s where s.tenant_id = v_tenant_id
    ),
    'inventory_tasks', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', t.id, 'task_type', t.task_type, 'task_summary', t.task_summary,
        'assigned_to', t.assigned_to, 'due_date', t.due_date::text,
        'task_status', t.task_status, 'inventory_item_id', t.inventory_item_id
      ) order by t.created_at desc), '[]'::jsonb)
      from public.aipify_hosts_inventory_tasks t where t.tenant_id = v_tenant_id
    ),
    'properties', (
      select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
      from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status <> 'archived'
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 23 — Supplies Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_23_SUPPLIES_CENTER.text',
      'route', '/app/aipify-hosts/supplies'
    )
  );
end; $$;

create or replace function public.create_aipify_hosts_inventory_item(
  p_item_name text,
  p_category text,
  p_property_id uuid default null,
  p_current_quantity numeric default 0,
  p_minimum_quantity numeric default 0,
  p_unit_type text default 'units',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text; v_status text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(trim(p_item_name), '') = '' then raise exception 'Item name required'; end if;
  v_key := 'inv_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  v_status := public._ahostsup_compute_status(coalesce(p_current_quantity, 0), coalesce(p_minimum_quantity, 0));
  insert into public.aipify_hosts_inventory_items (
    tenant_id, property_id, item_key, item_name, category, current_quantity, minimum_quantity, unit_type, inventory_status
  ) values (
    v_tenant_id, p_property_id, v_key, trim(p_item_name), p_category,
    coalesce(p_current_quantity, 0), coalesce(p_minimum_quantity, 0), coalesce(p_unit_type, 'units'), v_status
  ) returning id into v_id;
  perform public._ahostsup_refresh_item_status(v_id);
  perform public._ahostsup_log_event(v_tenant_id, 'item_created', 'Inventory item created',
    jsonb_build_object('item_id', v_id));
  return jsonb_build_object('success', true, 'item_id', v_id);
end; $$;

create or replace function public.update_aipify_hosts_inventory_quantity(
  p_item_id uuid, p_quantity numeric, p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  update public.aipify_hosts_inventory_items set current_quantity = greatest(p_quantity, 0), updated_at = now()
  where id = p_item_id and tenant_id = v_tenant_id;
  perform public._ahostsup_refresh_item_status(p_item_id);
  perform public._ahostsup_log_event(v_tenant_id, 'quantity_updated', 'Inventory quantity updated',
    jsonb_build_object('item_id', p_item_id, 'quantity', p_quantity));
  return jsonb_build_object('success', true, 'item_id', p_item_id);
end; $$;

create or replace function public.record_aipify_hosts_inventory_purchase(
  p_supplier_name text,
  p_quantity numeric,
  p_property_id uuid default null,
  p_item_id uuid default null,
  p_cost numeric default null,
  p_purchase_date date default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.aipify_hosts_inventory_purchases (
    tenant_id, property_id, inventory_item_id, supplier_name, purchase_date, quantity, cost
  ) values (
    v_tenant_id, p_property_id, p_item_id, trim(p_supplier_name), coalesce(p_purchase_date, current_date),
    coalesce(p_quantity, 0), p_cost
  ) returning id into v_id;
  if p_item_id is not null then
    update public.aipify_hosts_inventory_items set
      current_quantity = current_quantity + coalesce(p_quantity, 0), updated_at = now()
    where id = p_item_id and tenant_id = v_tenant_id;
    perform public._ahostsup_refresh_item_status(p_item_id);
  end if;
  perform public._ahostsup_push_notification(v_tenant_id, 'sup_purch_' || v_id::text, 'informational',
    'Purchase completed', 'Inventory purchase recorded for ' || trim(p_supplier_name));
  perform public._ahostsup_log_event(v_tenant_id, 'purchase_recorded', 'Purchase recorded',
    jsonb_build_object('purchase_id', v_id));
  return jsonb_build_object('success', true, 'purchase_id', v_id);
end; $$;

create or replace function public.create_aipify_hosts_inventory_supplier(
  p_supplier_name text,
  p_category text,
  p_contact_information text default null,
  p_preferred_supplier boolean default false,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_key := 'sup_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
  insert into public.aipify_hosts_inventory_suppliers (
    tenant_id, supplier_key, supplier_name, contact_information, category, preferred_supplier
  ) values (
    v_tenant_id, v_key, trim(p_supplier_name), p_contact_information, p_category, coalesce(p_preferred_supplier, false)
  ) returning id into v_id;
  perform public._ahostsup_log_event(v_tenant_id, 'supplier_created', 'Supplier created',
    jsonb_build_object('supplier_id', v_id));
  return jsonb_build_object('success', true, 'supplier_id', v_id);
end; $$;

create or replace function public.perform_aipify_hosts_inventory_action(
  p_item_id uuid,
  p_action_type text,
  p_assigned_to text default null,
  p_due_date date default null,
  p_quantity numeric default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_item public.aipify_hosts_inventory_items; v_id uuid; v_task_key text; v_summary text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  select * into v_item from public.aipify_hosts_inventory_items where id = p_item_id and tenant_id = v_tenant_id;
  if v_item.id is null then raise exception 'Item not found'; end if;

  if p_action_type = 'reorder_item' then
    v_summary := 'Reorder: ' || v_item.item_name;
    insert into public.aipify_hosts_inventory_purchases (
      tenant_id, property_id, inventory_item_id, supplier_name, quantity, purchase_status
    ) values (v_tenant_id, v_item.property_id, p_item_id, 'Pending supplier', v_item.minimum_quantity * 2, 'pending');
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'purchase_task', v_summary, p_assigned_to, coalesce(p_due_date, current_date + 3))
    returning id into v_id;
  elsif p_action_type = 'assign_purchase_task' then
    v_summary := 'Purchase task: ' || v_item.item_name;
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'purchase_task', v_summary, p_assigned_to, coalesce(p_due_date, current_date + 5))
    returning id into v_id;
    v_task_key := 'task_sup_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 10);
    insert into public.aipify_hosts_tasks (
      tenant_id, property_id, task_key, title, description, category, priority, due_date, assignee_name
    ) values (
      v_tenant_id, v_item.property_id, v_task_key, v_summary, v_summary, 'cleaning', 'high',
      coalesce(p_due_date, current_date + 5), p_assigned_to
    );
  elsif p_action_type = 'escalate_critical' then
    perform public._ahostsup_push_notification(v_tenant_id, 'sup_esc_' || p_item_id::text, 'critical',
      'Critical supply shortage', v_item.item_name || ' requires immediate escalation');
    v_summary := 'Escalated critical supply: ' || v_item.item_name;
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date, task_status
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'restock_supplies', v_summary, p_assigned_to, current_date, 'open')
    returning id into v_id;
  elsif p_action_type = 'restock_supplies' then
    v_summary := 'Restock supplies: ' || v_item.item_name;
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'restock_supplies', v_summary, p_assigned_to, coalesce(p_due_date, current_date + 2))
    returning id into v_id;
  elsif p_action_type = 'verify_inventory' then
    v_summary := 'Verify inventory: ' || v_item.item_name;
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'verify_inventory', v_summary, p_assigned_to, coalesce(p_due_date, current_date + 7))
    returning id into v_id;
    perform public._ahostsup_push_notification(v_tenant_id, 'sup_review_' || p_item_id::text, 'important',
      'Inventory review due', 'Inventory verification scheduled for ' || v_item.item_name);
  elsif p_action_type = 'update_quantities' then
    if p_quantity is null then raise exception 'Quantity required'; end if;
    update public.aipify_hosts_inventory_items set current_quantity = greatest(p_quantity, 0), updated_at = now()
    where id = p_item_id;
    perform public._ahostsup_refresh_item_status(p_item_id);
    v_summary := 'Quantity updated to ' || p_quantity;
  elsif p_action_type = 'assign_responsibility' then
    v_summary := 'Assigned responsibility for ' || v_item.item_name || ' to ' || coalesce(p_assigned_to, 'team');
    insert into public.aipify_hosts_inventory_tasks (
      tenant_id, inventory_item_id, property_id, task_type, task_summary, assigned_to, due_date
    ) values (v_tenant_id, p_item_id, v_item.property_id, 'assign_responsibility', v_summary, p_assigned_to, p_due_date)
    returning id into v_id;
  else
    raise exception 'Invalid action type';
  end if;

  perform public._ahostsup_log_event(v_tenant_id, 'inventory_action', v_summary,
    jsonb_build_object('item_id', p_item_id, 'action_type', p_action_type));
  return jsonb_build_object('success', true, 'item_id', p_item_id, 'action_type', p_action_type);
end; $$;

create or replace function public.seed_aipify_hosts_supplies_center_knowledge_airbnb23()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-supplies', 'Hosts Supplies Center',
    'Property inventory standards, supply planning, and hospitality inventory management.', 310
  );
  perform public._ahostkc_seed_article('aipify-hosts-supplies', 'recommended-property-inventory-standards', 'Recommended property inventory standards',
    'Maintain minimum quantities for bathroom, kitchen, bedroom, and welcome items before every guest arrival.');
  perform public._ahostkc_seed_article('aipify-hosts-supplies', 'supply-planning-best-practices', 'Supply planning best practices',
    'Review low stock alerts weekly, assign purchase tasks with due dates, and track supplier performance.');
  perform public._ahostkc_seed_article('aipify-hosts-supplies', 'managing-seasonal-inventory', 'Managing seasonal inventory',
    'Adjust minimum quantities before peak seasons and schedule verification tasks in advance.');
  perform public._ahostkc_seed_article('aipify-hosts-supplies', 'hospitality-inventory-management', 'Hospitality inventory management',
    'Audit quantity changes, escalate critical shortages immediately, and confirm purchases update stock levels.');
end; $$;

select public.seed_aipify_hosts_supplies_center_knowledge_airbnb23();

grant execute on function public.get_aipify_hosts_supplies_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_supplies_center_dashboard(text, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_inventory_item(text, text, uuid, numeric, numeric, text, uuid) to authenticated;
grant execute on function public.update_aipify_hosts_inventory_quantity(uuid, numeric, uuid) to authenticated;
grant execute on function public.record_aipify_hosts_inventory_purchase(text, numeric, uuid, uuid, numeric, date, uuid) to authenticated;
grant execute on function public.create_aipify_hosts_inventory_supplier(text, text, text, boolean, uuid) to authenticated;
grant execute on function public.perform_aipify_hosts_inventory_action(uuid, text, text, date, numeric, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_supplies_center_knowledge_airbnb23() to authenticated;
