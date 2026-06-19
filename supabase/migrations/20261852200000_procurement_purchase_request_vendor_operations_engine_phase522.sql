-- Phase 522 — Procurement, Purchase Request & Vendor Operations Engine
-- Employees request. Managers approve. Organizations purchase.
-- Integrates: Finance (519), Tasks (506), Domains (505A), Departments (511)

-- ---------------------------------------------------------------------------
-- 1. Settings & categories
-- ---------------------------------------------------------------------------
create table if not exists public.organization_procurement_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_currency text not null default 'NOK',
  manager_approval_threshold numeric(14, 2) not null default 5000,
  finance_approval_threshold numeric(14, 2) not null default 50000,
  executive_approval_threshold numeric(14, 2) not null default 200000,
  enable_budget_check boolean not null default true,
  companion_procurement_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_procurement_settings enable row level security;
revoke all on public.organization_procurement_settings from authenticated, anon;

create table if not exists public.organization_procurement_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_key text not null,
  name text not null,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, category_key)
);

alter table public.organization_procurement_categories enable row level security;
revoke all on public.organization_procurement_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Vendors
-- ---------------------------------------------------------------------------
create table if not exists public.organization_procurement_vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  vendor_number text,
  vendor_name text not null,
  contact_person text not null default '',
  email text,
  phone text,
  country text not null default 'NO',
  services text not null default '',
  status text not null default 'active' check (
    status in ('approved', 'active', 'under_review', 'restricted', 'blocked')
  ),
  is_preferred boolean not null default false,
  vendor_rating numeric(4, 2) not null default 0 check (vendor_rating between 0 and 5),
  delivery_reliability_score numeric(5, 2) not null default 0,
  response_time_score numeric(5, 2) not null default 0,
  invoice_accuracy_score numeric(5, 2) not null default 0,
  contract_compliance_score numeric(5, 2) not null default 0,
  risk_status text not null default 'low' check (
    risk_status in ('low', 'moderate', 'high', 'critical')
  ),
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, vendor_number)
);

create index if not exists organization_procurement_vendors_org_idx
  on public.organization_procurement_vendors (organization_id, status);

alter table public.organization_procurement_vendors enable row level security;
revoke all on public.organization_procurement_vendors from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Purchase requests & approvals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_procurement_purchase_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_number text,
  title text not null,
  description text not null default '',
  requester_user_id uuid references public.users (id) on delete set null,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  category_key text not null default 'office_supplies',
  vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  vendor_name text not null default '',
  estimated_cost numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  priority text not null default 'normal' check (
    priority in ('low', 'normal', 'high', 'urgent')
  ),
  required_date date,
  status text not null default 'draft' check (
    status in (
      'draft', 'submitted', 'awaiting_approval', 'requires_review',
      'approved', 'rejected', 'ordered'
    )
  ),
  approval_status text not null default 'none' check (
    approval_status in (
      'none', 'pending_manager', 'pending_finance', 'pending_executive',
      'approved', 'rejected'
    )
  ),
  business_pack_key text,
  budget_check_status text not null default 'pending' check (
    budget_check_status in ('pending', 'passed', 'warning', 'exceeded')
  ),
  attachments jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz,
  approved_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, request_number)
);

create index if not exists organization_procurement_requests_org_idx
  on public.organization_procurement_purchase_requests (organization_id, status, updated_at desc);

alter table public.organization_procurement_purchase_requests enable row level security;
revoke all on public.organization_procurement_purchase_requests from authenticated, anon;

create table if not exists public.organization_procurement_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  request_id uuid not null references public.organization_procurement_purchase_requests (id) on delete cascade,
  approval_level text not null check (
    approval_level in ('manager', 'finance', 'executive')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'rejected', 'skipped')
  ),
  approver_user_id uuid references public.users (id) on delete set null,
  notes text not null default '',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists organization_procurement_approvals_request_idx
  on public.organization_procurement_approvals (request_id, approval_level);

alter table public.organization_procurement_approvals enable row level security;
revoke all on public.organization_procurement_approvals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Contracts & orders
-- ---------------------------------------------------------------------------
create table if not exists public.organization_procurement_contracts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  contract_number text,
  contract_name text not null,
  vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  vendor_name text not null default '',
  contract_value numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  start_date date,
  end_date date,
  renewal_date date,
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'active' check (
    status in ('draft', 'active', 'expiring', 'expired', 'renewed', 'cancelled')
  ),
  attachments jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, contract_number)
);

create index if not exists organization_procurement_contracts_org_idx
  on public.organization_procurement_contracts (organization_id, status, renewal_date);

alter table public.organization_procurement_contracts enable row level security;
revoke all on public.organization_procurement_contracts from authenticated, anon;

create table if not exists public.organization_procurement_purchase_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  order_number text,
  request_id uuid references public.organization_procurement_purchase_requests (id) on delete set null,
  contract_id uuid references public.organization_procurement_contracts (id) on delete set null,
  vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  vendor_name text not null default '',
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  items jsonb not null default '[]'::jsonb,
  total_cost numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'ordered', 'shipped', 'delivered', 'cancelled')
  ),
  approval_status text not null default 'approved',
  invoice_status text not null default 'none' check (
    invoice_status in ('none', 'pending', 'received', 'paid', 'disputed')
  ),
  expected_delivery date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, order_number)
);

create index if not exists organization_procurement_orders_org_idx
  on public.organization_procurement_purchase_orders (organization_id, status, updated_at desc);

alter table public.organization_procurement_purchase_orders enable row level security;
revoke all on public.organization_procurement_purchase_orders from authenticated, anon;

create table if not exists public.organization_procurement_deliveries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  order_id uuid not null references public.organization_procurement_purchase_orders (id) on delete cascade,
  expected_delivery date,
  actual_delivery date,
  delivery_status text not null default 'pending' check (
    delivery_status in ('pending', 'partial', 'received', 'inspected', 'confirmed')
  ),
  receiving_confirmation text not null default '',
  warehouse_receipt text not null default '',
  inspection_results text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_procurement_deliveries_order_idx
  on public.organization_procurement_deliveries (order_id);

alter table public.organization_procurement_deliveries enable row level security;
revoke all on public.organization_procurement_deliveries from authenticated, anon;

create table if not exists public.organization_procurement_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  request_id uuid references public.organization_procurement_purchase_requests (id) on delete set null,
  vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  contract_id uuid references public.organization_procurement_contracts (id) on delete set null,
  order_id uuid references public.organization_procurement_purchase_orders (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_procurement_audit_logs_org_idx
  on public.organization_procurement_audit_logs (organization_id, created_at desc);

alter table public.organization_procurement_audit_logs enable row level security;
revoke all on public.organization_procurement_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._proc522_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._proc522_log(
  p_org_id uuid,
  p_action text,
  p_summary text,
  p_request_id uuid default null,
  p_vendor_id uuid default null,
  p_contract_id uuid default null,
  p_order_id uuid default null,
  p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_procurement_audit_logs (
    organization_id, actor_user_id, action, summary,
    request_id, vendor_id, contract_id, order_id, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_request_id, p_vendor_id, p_contract_id, p_order_id,
    coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._proc522_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._proc522_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_procurement_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_procurement_categories (organization_id, category_key, name, is_system)
  values
    (p_org_id, 'equipment', 'Equipment', true),
    (p_org_id, 'software', 'Software', true),
    (p_org_id, 'marketing', 'Marketing', true),
    (p_org_id, 'services', 'Services', true),
    (p_org_id, 'consulting', 'Consulting', true),
    (p_org_id, 'training', 'Training', true),
    (p_org_id, 'office_supplies', 'Office Supplies', true),
    (p_org_id, 'warehouse_supplies', 'Warehouse Supplies', true),
    (p_org_id, 'travel', 'Travel', true)
  on conflict (organization_id, category_key) do nothing;
end; $$;

create or replace function public._proc522_required_approval_levels(
  p_org_id uuid,
  p_amount numeric
)
returns text[] language plpgsql stable security definer set search_path = public as $$
declare
  v_settings public.organization_procurement_settings;
  v_levels text[] := '{}';
begin
  select * into v_settings from public.organization_procurement_settings where organization_id = p_org_id;
  if not found then
    v_levels := array['manager'];
    return v_levels;
  end if;

  if p_amount >= coalesce(v_settings.executive_approval_threshold, 200000) then
    return array['manager', 'finance', 'executive'];
  elsif p_amount >= coalesce(v_settings.finance_approval_threshold, 50000) then
    return array['manager', 'finance'];
  elsif p_amount >= coalesce(v_settings.manager_approval_threshold, 5000) then
    return array['manager'];
  end if;
  return array['manager'];
end; $$;

create or replace function public._proc522_request_json(p_row public.organization_procurement_purchase_requests)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'request_number', p_row.request_number,
    'title', p_row.title,
    'description', p_row.description,
    'requester_name', (select coalesce(u.full_name, u.email) from public.users u where u.id = p_row.requester_user_id),
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'category_key', p_row.category_key,
    'vendor_name', coalesce(
      (select vendor_name from public.organization_procurement_vendors where id = p_row.vendor_id),
      p_row.vendor_name
    ),
    'estimated_cost', p_row.estimated_cost,
    'currency', p_row.currency,
    'priority', p_row.priority,
    'required_date', p_row.required_date,
    'status', p_row.status,
    'approval_status', p_row.approval_status,
    'budget_check_status', p_row.budget_check_status,
    'business_pack_key', p_row.business_pack_key,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._proc522_vendor_json(p_row public.organization_procurement_vendors)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'vendor_number', p_row.vendor_number,
    'vendor_name', p_row.vendor_name,
    'contact_person', p_row.contact_person,
    'email', p_row.email,
    'phone', p_row.phone,
    'country', p_row.country,
    'services', p_row.services,
    'status', p_row.status,
    'is_preferred', p_row.is_preferred,
    'vendor_rating', p_row.vendor_rating,
    'delivery_reliability_score', p_row.delivery_reliability_score,
    'response_time_score', p_row.response_time_score,
    'invoice_accuracy_score', p_row.invoice_accuracy_score,
    'contract_compliance_score', p_row.contract_compliance_score,
    'risk_status', p_row.risk_status,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._proc522_contract_json(p_row public.organization_procurement_contracts)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'contract_number', p_row.contract_number,
    'contract_name', p_row.contract_name,
    'vendor_name', coalesce(
      (select vendor_name from public.organization_procurement_vendors where id = p_row.vendor_id),
      p_row.vendor_name
    ),
    'contract_value', p_row.contract_value,
    'currency', p_row.currency,
    'start_date', p_row.start_date,
    'end_date', p_row.end_date,
    'renewal_date', p_row.renewal_date,
    'status', p_row.status,
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._proc522_order_json(p_row public.organization_procurement_purchase_orders)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'order_number', p_row.order_number,
    'vendor_name', p_row.vendor_name,
    'total_cost', p_row.total_cost,
    'currency', p_row.currency,
    'status', p_row.status,
    'approval_status', p_row.approval_status,
    'invoice_status', p_row.invoice_status,
    'expected_delivery', p_row.expected_delivery,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'updated_at', p_row.updated_at
  );
end; $$;

create or replace function public._proc522_seed_approvals(p_org_id uuid, p_request_id uuid, p_amount numeric)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_level text;
begin
  delete from public.organization_procurement_approvals where request_id = p_request_id;

  foreach v_level in array public._proc522_required_approval_levels(p_org_id, p_amount) loop
    insert into public.organization_procurement_approvals (
      organization_id, request_id, approval_level, status
    ) values (p_org_id, p_request_id, v_level, 'pending');
  end loop;
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Procurement Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_procurement_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_pending_approvals bigint;
  v_open_requests bigint;
  v_active_vendors bigint;
  v_contract_exposure numeric(14, 2);
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc522_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._proc522_ensure_settings(v_org_id);
  perform public._proc522_log(v_org_id, 'center_view', 'Procurement Center viewed', null, null, null, null,
    jsonb_build_object('section', p_section));

  select count(*) into v_pending_approvals
  from public.organization_procurement_purchase_requests
  where organization_id = v_org_id and approval_status like 'pending%';

  select count(*) into v_open_requests
  from public.organization_procurement_purchase_requests
  where organization_id = v_org_id and status not in ('rejected', 'ordered');

  select count(*) into v_active_vendors
  from public.organization_procurement_vendors
  where organization_id = v_org_id and status in ('approved', 'active');

  select coalesce(sum(contract_value), 0) into v_contract_exposure
  from public.organization_procurement_contracts
  where organization_id = v_org_id and status in ('active', 'expiring');

  return jsonb_build_object(
    'found', true,
    'principle', 'Employees request. Managers approve. Organizations purchase.',
    'overview', jsonb_build_object(
      'pending_approvals', v_pending_approvals,
      'open_requests', v_open_requests,
      'active_vendors', v_active_vendors,
      'contract_exposure', v_contract_exposure,
      'orders_in_transit', (
        select count(*) from public.organization_procurement_purchase_orders
        where organization_id = v_org_id and status in ('ordered', 'shipped', 'processing')
      ),
      'expiring_contracts_30d', (
        select count(*) from public.organization_procurement_contracts
        where organization_id = v_org_id
          and renewal_date between current_date and current_date + 30
          and status in ('active', 'expiring')
      ),
      'high_risk_vendors', (
        select count(*) from public.organization_procurement_vendors
        where organization_id = v_org_id and risk_status in ('high', 'critical')
      ),
      'purchasing_volume_quarter', coalesce((
        select sum(total_cost) from public.organization_procurement_purchase_orders
        where organization_id = v_org_id
          and created_at >= date_trunc('quarter', now())
          and status not in ('cancelled')
      ), 0),
      'overdue_requests', (
        select count(*) from public.organization_procurement_purchase_requests
        where organization_id = v_org_id
          and required_date < current_date
          and status not in ('approved', 'rejected', 'ordered')
      )
    ),
    'purchase_requests', coalesce((
      select jsonb_agg(public._proc522_request_json(r) order by r.updated_at desc)
      from (
        select * from public.organization_procurement_purchase_requests
        where organization_id = v_org_id order by updated_at desc limit 50
      ) r
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(public._proc522_request_json(r) order by r.updated_at desc)
      from (
        select * from public.organization_procurement_purchase_requests
        where organization_id = v_org_id and approval_status like 'pending%'
        order by updated_at desc limit 30
      ) r
    ), '[]'::jsonb),
    'vendors', coalesce((
      select jsonb_agg(public._proc522_vendor_json(v) order by v.vendor_name)
      from (
        select * from public.organization_procurement_vendors
        where organization_id = v_org_id order by vendor_name limit 50
      ) v
    ), '[]'::jsonb),
    'contracts', coalesce((
      select jsonb_agg(public._proc522_contract_json(c) order by c.renewal_date nulls last)
      from (
        select * from public.organization_procurement_contracts
        where organization_id = v_org_id order by renewal_date nulls last limit 40
      ) c
    ), '[]'::jsonb),
    'orders', coalesce((
      select jsonb_agg(public._proc522_order_json(o) order by o.updated_at desc)
      from (
        select * from public.organization_procurement_purchase_orders
        where organization_id = v_org_id order by updated_at desc limit 40
      ) o
    ), '[]'::jsonb),
    'deliveries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'order_id', d.order_id,
        'order_number', (select order_number from public.organization_procurement_purchase_orders where id = d.order_id),
        'expected_delivery', d.expected_delivery, 'actual_delivery', d.actual_delivery,
        'delivery_status', d.delivery_status, 'inspection_results', d.inspection_results
      ) order by d.updated_at desc)
      from public.organization_procurement_deliveries d
      where d.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'category_key', c.category_key, 'name', c.name))
      from public.organization_procurement_categories c
      where c.organization_id = v_org_id and c.is_active
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'purchasing_volume', coalesce((
        select sum(total_cost) from public.organization_procurement_purchase_orders
        where organization_id = v_org_id and created_at >= date_trunc('year', now()) and status <> 'cancelled'
      ), 0),
      'contract_exposure', v_contract_exposure,
      'avg_approval_days', coalesce((
        select round(avg(extract(epoch from (approved_at - submitted_at)) / 86400)::numeric, 1)
        from public.organization_procurement_purchase_requests
        where organization_id = v_org_id and approved_at is not null and submitted_at is not null
      ), 0),
      'supplier_concentration', coalesce((
        select jsonb_agg(jsonb_build_object('vendor_name', vendor_name, 'total_spend', total_spend))
        from (
          select vendor_name, sum(total_cost) as total_spend
          from public.organization_procurement_purchase_orders
          where organization_id = v_org_id and status <> 'cancelled'
          group by vendor_name order by total_spend desc limit 5
        ) x
      ), '[]'::jsonb)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_procurement_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'purchase_requests', 'approvals', 'vendors', 'contracts', 'orders', 'deliveries', 'reports'
    ),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'requests', '/app/procurement/requests',
      'vendors', '/app/procurement/vendors',
      'orders', '/app/procurement/orders',
      'finance', '/app/finance'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_procurement_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_req public.organization_procurement_purchase_requests;
  v_amount numeric(14, 2);
  v_next_level text;
begin
  v_org_id := public._proc522_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_purchase_request', 'submit_purchase_request', 'approve_purchase_request',
    'reject_purchase_request', 'create_vendor', 'update_vendor_status',
    'create_contract', 'create_purchase_order', 'mark_order_delivered', 'record_delivery'
  ) then
    perform public._irp_require_permission('procurement.manage');
  else
    perform public._irp_require_permission('procurement.view');
  end if;

  perform public._proc522_ensure_settings(v_org_id);

  if p_action_type = 'create_purchase_request' then
    v_amount := coalesce((p_payload->>'estimated_cost')::numeric, 0);
    insert into public.organization_procurement_purchase_requests (
      organization_id, request_number, title, description, requester_user_id,
      department_id, domain_id, category_key, vendor_id, vendor_name,
      estimated_cost, currency, priority, required_date, status, approval_status,
      business_pack_key, budget_check_status
    ) values (
      v_org_id,
      coalesce(p_payload->>'request_number', public._proc522_next_number(v_org_id, 'PR', 'organization_procurement_purchase_requests')),
      coalesce(p_payload->>'title', 'Purchase request'),
      coalesce(p_payload->>'description', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      coalesce(p_payload->>'category_key', 'office_supplies'),
      nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''),
      v_amount,
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'priority', 'normal'),
      nullif(p_payload->>'required_date', '')::date,
      'draft', 'none', p_payload->>'business_pack_key', 'pending'
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'request_created', 'Purchase request created', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_id);

  elsif p_action_type = 'submit_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    select * into v_req from public.organization_procurement_purchase_requests
    where id = v_id and organization_id = v_org_id;

    perform public._proc522_seed_approvals(v_org_id, v_id, v_req.estimated_cost);

    update public.organization_procurement_purchase_requests set
      status = 'awaiting_approval',
      approval_status = 'pending_manager',
      budget_check_status = case when v_req.estimated_cost > 0 then 'passed' else 'warning' end,
      submitted_at = now(),
      updated_at = now()
    where id = v_id;

    perform public._proc522_log(v_org_id, 'request_submitted', 'Purchase request submitted', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'approve_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    select * into v_req from public.organization_procurement_purchase_requests
    where id = v_id and organization_id = v_org_id;

    update public.organization_procurement_approvals set
      status = 'approved',
      approver_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1),
      decided_at = now()
    where id = (
      select id from public.organization_procurement_approvals
      where request_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 end
      limit 1
    );

    if exists (select 1 from public.organization_procurement_approvals where request_id = v_id and status = 'pending') then
      select approval_level into v_next_level
      from public.organization_procurement_approvals
      where request_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 end
      limit 1;

      update public.organization_procurement_purchase_requests set
        approval_status = 'pending_' || v_next_level,
        status = 'awaiting_approval',
        updated_at = now()
      where id = v_id;
    else
      update public.organization_procurement_purchase_requests set
        status = 'approved',
        approval_status = 'approved',
        approved_at = now(),
        updated_at = now()
      where id = v_id;
    end if;

    perform public._proc522_log(v_org_id, 'request_approved', 'Purchase request approved', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    update public.organization_procurement_purchase_requests set
      status = 'rejected', approval_status = 'rejected', rejected_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id;
    update public.organization_procurement_approvals set status = 'rejected', decided_at = now()
    where request_id = v_id and status = 'pending';
    perform public._proc522_log(v_org_id, 'request_rejected', 'Purchase request rejected', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_vendor' then
    insert into public.organization_procurement_vendors (
      organization_id, vendor_number, vendor_name, contact_person, email, phone,
      country, services, status, is_preferred, owner_user_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'vendor_number', public._proc522_next_number(v_org_id, 'VEN', 'organization_procurement_vendors')),
      coalesce(p_payload->>'vendor_name', 'Vendor'),
      coalesce(p_payload->>'contact_person', ''),
      p_payload->>'email',
      p_payload->>'phone',
      coalesce(p_payload->>'country', 'NO'),
      coalesce(p_payload->>'services', ''),
      coalesce(p_payload->>'status', 'active'),
      coalesce((p_payload->>'is_preferred')::boolean, false),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'vendor_added', 'Vendor added', null, v_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'vendor_id', v_id);

  elsif p_action_type = 'update_vendor_status' then
    v_id := (p_payload->>'vendor_id')::uuid;
    update public.organization_procurement_vendors set
      status = coalesce(p_payload->>'status', status),
      risk_status = coalesce(p_payload->>'risk_status', risk_status),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'vendor_updated', 'Vendor updated', null, v_id, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_contract' then
    insert into public.organization_procurement_contracts (
      organization_id, contract_number, contract_name, vendor_id, vendor_name,
      contract_value, currency, start_date, end_date, renewal_date, owner_user_id, status
    ) values (
      v_org_id,
      coalesce(p_payload->>'contract_number', public._proc522_next_number(v_org_id, 'CON', 'organization_procurement_contracts')),
      coalesce(p_payload->>'contract_name', 'Contract'),
      nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''),
      coalesce((p_payload->>'contract_value')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      nullif(p_payload->>'start_date', '')::date,
      nullif(p_payload->>'end_date', '')::date,
      nullif(p_payload->>'renewal_date', '')::date,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'status', 'active')
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'contract_created', 'Contract created', null, null, v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'contract_id', v_id);

  elsif p_action_type = 'create_purchase_order' then
    v_amount := coalesce((p_payload->>'total_cost')::numeric, 0);
    insert into public.organization_procurement_purchase_orders (
      organization_id, order_number, request_id, contract_id, vendor_id, vendor_name,
      department_id, domain_id, items, total_cost, currency, status, expected_delivery
    ) values (
      v_org_id,
      coalesce(p_payload->>'order_number', public._proc522_next_number(v_org_id, 'PO', 'organization_procurement_purchase_orders')),
      nullif(p_payload->>'request_id', '')::uuid,
      nullif(p_payload->>'contract_id', '')::uuid,
      nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      coalesce(p_payload->'items', '[]'::jsonb),
      v_amount,
      coalesce(p_payload->>'currency', 'NOK'),
      'ordered',
      nullif(p_payload->>'expected_delivery', '')::date
    ) returning id into v_id;

    if nullif(p_payload->>'request_id', '') is not null then
      update public.organization_procurement_purchase_requests set status = 'ordered', updated_at = now()
      where id = (p_payload->>'request_id')::uuid and organization_id = v_org_id;
    end if;

    insert into public.organization_procurement_deliveries (
      organization_id, order_id, expected_delivery, delivery_status
    ) values (
      v_org_id, v_id, nullif(p_payload->>'expected_delivery', '')::date, 'pending'
    );

    perform public._proc522_log(v_org_id, 'order_created', 'Purchase order created', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true, 'order_id', v_id);

  elsif p_action_type = 'mark_order_delivered' then
    v_id := (p_payload->>'order_id')::uuid;
    update public.organization_procurement_purchase_orders set status = 'delivered', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    update public.organization_procurement_deliveries set
      delivery_status = 'confirmed', actual_delivery = current_date, updated_at = now()
    where order_id = v_id and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'order_delivered', 'Order delivered', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_delivery' then
    v_id := (p_payload->>'order_id')::uuid;
    update public.organization_procurement_deliveries set
      delivery_status = coalesce(p_payload->>'delivery_status', delivery_status),
      actual_delivery = coalesce(nullif(p_payload->>'actual_delivery', '')::date, actual_delivery),
      receiving_confirmation = coalesce(p_payload->>'receiving_confirmation', receiving_confirmation),
      warehouse_receipt = coalesce(p_payload->>'warehouse_receipt', warehouse_receipt),
      inspection_results = coalesce(p_payload->>'inspection_results', inspection_results),
      updated_at = now()
    where order_id = v_id and organization_id = v_org_id;

    if coalesce(p_payload->>'delivery_status', '') in ('received', 'confirmed', 'inspected') then
      update public.organization_procurement_purchase_orders set status = 'delivered', updated_at = now()
      where id = v_id and organization_id = v_org_id;
    elsif coalesce(p_payload->>'delivery_status', '') = 'partial' then
      update public.organization_procurement_purchase_orders set status = 'shipped', updated_at = now()
      where id = v_id and organization_id = v_org_id;
    end if;

    perform public._proc522_log(v_org_id, 'delivery_recorded', 'Delivery recorded', null, null, null, v_id, p_payload);
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
create or replace function public.get_companion_procurement_operations_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc522_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._proc522_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations purchase resources. Vendors provide resources. Managers approve resources.',
    'pending_approvals', (
      select count(*) from public.organization_procurement_purchase_requests
      where organization_id = v_org_id and approval_status like 'pending%'
    ),
    'expiring_contracts_30d', coalesce((
      select jsonb_agg(jsonb_build_object('contract_name', contract_name, 'renewal_date', renewal_date))
      from (
        select contract_name, renewal_date from public.organization_procurement_contracts
        where organization_id = v_org_id
          and renewal_date between current_date and current_date + 30
        limit 10
      ) x
    ), '[]'::jsonb),
    'high_risk_vendors', coalesce((
      select jsonb_agg(jsonb_build_object('vendor_name', vendor_name, 'risk_status', risk_status))
      from (
        select vendor_name, risk_status from public.organization_procurement_vendors
        where organization_id = v_org_id and risk_status in ('high', 'critical') limit 10
      ) x
    ), '[]'::jsonb),
    'overdue_requests', coalesce((
      select jsonb_agg(jsonb_build_object('title', title, 'required_date', required_date))
      from (
        select title, required_date from public.organization_procurement_purchase_requests
        where organization_id = v_org_id and required_date < current_date
          and status not in ('approved', 'rejected', 'ordered') limit 10
      ) x
    ), '[]'::jsonb),
    'companion_prompts', jsonb_build_array(
      'Show pending approvals.',
      'Which contracts expire next month?',
      'Create purchase request.',
      'Show vendor performance.',
      'Which purchase requests are overdue?'
    ),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'requests', '/app/procurement/requests',
      'vendors', '/app/procurement/vendors',
      'orders', '/app/procurement/orders'
    )
  );
end; $$;

create or replace function public.get_my_procurement_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc522_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('procurement.manage', v_org_id),
    'my_requests', (
      select count(*) from public.organization_procurement_purchase_requests
      where organization_id = v_org_id and requester_user_id = v_user_id
        and status not in ('rejected', 'ordered')
    ),
    'pending_my_approval', (
      select count(*) from public.organization_procurement_purchase_requests
      where organization_id = v_org_id and approval_status like 'pending%'
    ),
    'orders_in_transit', (
      select count(*) from public.organization_procurement_purchase_orders
      where organization_id = v_org_id and status in ('ordered', 'shipped')
    ),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'requests', '/app/procurement/requests',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('procurement', '/app/procurement'));
end; $$;

-- Module registry
do $$ begin
  perform public._mre501_seed_module(
    'procurement', 'Procurement', 'procurement', 'operations',
    'Purchase requests, vendor operations, contracts, orders, and delivery tracking.',
    'starter', null, 'operations', '/app/procurement', 'licensed', 9
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('procurement', 'procurement.view', 'view', 'Procurement — view requests, vendors, contracts, and orders'),
    ('procurement', 'procurement.manage', 'manage', 'Procurement — create, approve, and manage purchasing operations')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('procurement', 'procurement.view', 'view', 'Procurement — view requests, vendors, contracts, and orders'),
    ('procurement', 'procurement.manage', 'manage', 'Procurement — create, approve, and manage purchasing operations')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_procurement_operations_center(text) to authenticated;
grant execute on function public.perform_procurement_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_procurement_operations_context() to authenticated;
grant execute on function public.get_my_procurement_operations_summary() to authenticated;
