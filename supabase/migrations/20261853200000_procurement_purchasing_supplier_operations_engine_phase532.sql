-- Phase 532 — Procurement, Purchasing & Supplier Operations Engine
-- Extends Phase 522. Supplier scorecards, quotations, receiving, spend analysis, risk.

-- ---------------------------------------------------------------------------
-- 1. Extend vendors (suppliers)
-- ---------------------------------------------------------------------------
alter table public.organization_procurement_vendors add column if not exists organization_number text;
alter table public.organization_procurement_vendors add column if not exists address text not null default '';
alter table public.organization_procurement_vendors add column if not exists website text;
alter table public.organization_procurement_vendors add column if not exists category_key text not null default 'services';
alter table public.organization_procurement_vendors add column if not exists health_score integer;
alter table public.organization_procurement_vendors add column if not exists health_status text not null default 'monitor' check (
  health_status in ('preferred', 'monitor', 'high_risk')
);
alter table public.organization_procurement_vendors add column if not exists quality_rating_score numeric(5, 2) not null default 0;
alter table public.organization_procurement_vendors add column if not exists cost_efficiency_score numeric(5, 2) not null default 0;
alter table public.organization_procurement_vendors add column if not exists issue_history_count integer not null default 0;

alter table public.organization_procurement_vendors drop constraint if exists organization_procurement_vendors_status_check;
alter table public.organization_procurement_vendors add constraint organization_procurement_vendors_status_check check (
  status in (
    'approved', 'active', 'under_review', 'evaluation', 'review_required',
    'restricted', 'blocked', 'inactive'
  )
);

alter table public.organization_procurement_purchase_requests add column if not exists justification text not null default '';

alter table public.organization_procurement_deliveries add column if not exists quantity_received numeric(14, 2);
alter table public.organization_procurement_deliveries add column if not exists condition_status text not null default 'good' check (
  condition_status in ('good', 'damaged', 'partial', 'rejected')
);
alter table public.organization_procurement_deliveries add column if not exists receiver_user_id uuid references public.users (id) on delete set null;
alter table public.organization_procurement_deliveries add column if not exists exception_notes text not null default '';

-- ---------------------------------------------------------------------------
-- 2. Quotations (RFQ)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_procurement_quotations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  rfq_number text,
  request_id uuid references public.organization_procurement_purchase_requests (id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (
    status in ('open', 'quotes_received', 'compared', 'approved', 'closed', 'cancelled')
  ),
  required_quotes integer not null default 3,
  selected_vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, rfq_number)
);

create index if not exists organization_procurement_quotations_org_idx
  on public.organization_procurement_quotations (organization_id, status);

alter table public.organization_procurement_quotations enable row level security;
revoke all on public.organization_procurement_quotations from authenticated, anon;

create table if not exists public.organization_procurement_quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  quotation_id uuid not null references public.organization_procurement_quotations (id) on delete cascade,
  vendor_id uuid references public.organization_procurement_vendors (id) on delete set null,
  vendor_name text not null default '',
  quoted_amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  delivery_days integer,
  quality_notes text not null default '',
  status text not null default 'received' check (
    status in ('received', 'shortlisted', 'selected', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_procurement_quotes_quotation_idx
  on public.organization_procurement_quotes (quotation_id, status);

alter table public.organization_procurement_quotes enable row level security;
revoke all on public.organization_procurement_quotes from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._proc532_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._proc532_compute_supplier_health(p_row public.organization_procurement_vendors)
returns jsonb language plpgsql stable as $$
declare
  v_score int := 70;
  v_status text := 'monitor';
begin
  v_score := v_score + least(20, greatest(0, (p_row.delivery_reliability_score * 4)::int));
  v_score := v_score + least(10, greatest(0, (p_row.response_time_score * 2)::int));
  v_score := v_score - least(30, p_row.issue_history_count * 5);
  if p_row.risk_status in ('high', 'critical') then v_score := v_score - 25; end if;
  if p_row.is_preferred then v_score := v_score + 10; end if;
  v_score := greatest(0, least(100, v_score));
  v_status := case
    when v_score >= 80 and p_row.risk_status = 'low' then 'preferred'
    when v_score >= 50 then 'monitor'
    else 'high_risk'
  end;
  return jsonb_build_object('health_score', v_score, 'health_status', v_status);
end; $$;

create or replace function public._proc532_vendor_json(p_row public.organization_procurement_vendors)
returns jsonb language plpgsql stable as $$
begin
  return public._proc522_vendor_json(p_row) || jsonb_build_object(
    'organization_number', p_row.organization_number,
    'address', p_row.address,
    'website', p_row.website,
    'category_key', p_row.category_key,
    'health_score', p_row.health_score,
    'health_status', p_row.health_status,
    'quality_rating_score', p_row.quality_rating_score,
    'cost_efficiency_score', p_row.cost_efficiency_score,
    'issue_history_count', p_row.issue_history_count,
    'supplier_name', p_row.vendor_name
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Procurement Operations Center (Phase 532 upgrade)
-- ---------------------------------------------------------------------------
create or replace function public.get_procurement_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc532_org();
  perform public._proc522_ensure_settings(v_org_id);
  perform public._proc522_log(v_org_id, 'center_view', 'Procurement Center viewed', null, null, null, null,
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations should always know what they buy, who they buy from, why they buy it, who approved it, and what it costs.',
    'philosophy', 'Good purchasing reduces waste. Good suppliers create stability. Good procurement creates control.',
    'overview', jsonb_build_object(
      'pending_approvals', (select count(*) from public.organization_procurement_purchase_requests where organization_id = v_org_id and approval_status like 'pending%'),
      'open_requests', (select count(*) from public.organization_procurement_purchase_requests where organization_id = v_org_id and status not in ('rejected', 'ordered')),
      'active_vendors', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and status in ('approved', 'active')),
      'active_suppliers', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and status in ('approved', 'active')),
      'contract_exposure', coalesce((select sum(contract_value) from public.organization_procurement_contracts where organization_id = v_org_id and status in ('active', 'expiring')), 0),
      'orders_in_transit', (select count(*) from public.organization_procurement_purchase_orders where organization_id = v_org_id and status in ('ordered', 'shipped', 'processing', 'sent')),
      'expiring_contracts_30d', (select count(*) from public.organization_procurement_contracts where organization_id = v_org_id and renewal_date between current_date and current_date + 30 and status in ('active', 'expiring')),
      'high_risk_vendors', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and (risk_status in ('high', 'critical') or health_status = 'high_risk')),
      'high_risk_suppliers', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and health_status = 'high_risk'),
      'preferred_suppliers', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and health_status = 'preferred'),
      'purchasing_volume_quarter', coalesce((select sum(total_cost) from public.organization_procurement_purchase_orders where organization_id = v_org_id and created_at >= date_trunc('quarter', now()) and status <> 'cancelled'), 0),
      'overdue_requests', (select count(*) from public.organization_procurement_purchase_requests where organization_id = v_org_id and required_date < current_date and status not in ('approved', 'rejected', 'ordered')),
      'open_rfqs', (select count(*) from public.organization_procurement_quotations where organization_id = v_org_id and status in ('open', 'quotes_received', 'compared')),
      'pending_receiving', (select count(*) from public.organization_procurement_deliveries where organization_id = v_org_id and delivery_status in ('pending', 'partial'))
    ),
    'purchase_requests', coalesce((
      select jsonb_agg(public._proc522_request_json(r) order by r.updated_at desc)
      from (select * from public.organization_procurement_purchase_requests where organization_id = v_org_id order by updated_at desc limit 50) r
    ), '[]'::jsonb),
    'purchases', coalesce((
      select jsonb_agg(public._proc522_request_json(r) order by r.updated_at desc)
      from (select * from public.organization_procurement_purchase_requests where organization_id = v_org_id and status not in ('draft') order by updated_at desc limit 40) r
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(public._proc522_request_json(r) order by r.updated_at desc)
      from (select * from public.organization_procurement_purchase_requests where organization_id = v_org_id and approval_status like 'pending%' order by updated_at desc limit 30) r
    ), '[]'::jsonb),
    'vendors', coalesce((
      select jsonb_agg(public._proc532_vendor_json(v) order by v.vendor_name)
      from (select * from public.organization_procurement_vendors where organization_id = v_org_id order by vendor_name limit 50) v
    ), '[]'::jsonb),
    'suppliers', coalesce((
      select jsonb_agg(public._proc532_vendor_json(v) order by v.vendor_name)
      from (select * from public.organization_procurement_vendors where organization_id = v_org_id order by vendor_name limit 50) v
    ), '[]'::jsonb),
    'contracts', coalesce((
      select jsonb_agg(public._proc522_contract_json(c) order by c.renewal_date nulls last)
      from (select * from public.organization_procurement_contracts where organization_id = v_org_id order by renewal_date nulls last limit 40) c
    ), '[]'::jsonb),
    'orders', coalesce((
      select jsonb_agg(public._proc522_order_json(o) order by o.updated_at desc)
      from (select * from public.organization_procurement_purchase_orders where organization_id = v_org_id order by updated_at desc limit 40) o
    ), '[]'::jsonb),
    'deliveries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'order_id', d.order_id,
        'order_number', (select order_number from public.organization_procurement_purchase_orders where id = d.order_id),
        'expected_delivery', d.expected_delivery, 'actual_delivery', d.actual_delivery,
        'delivery_status', d.delivery_status, 'inspection_results', d.inspection_results,
        'quantity_received', d.quantity_received, 'condition_status', d.condition_status,
        'exception_notes', d.exception_notes
      ) order by d.updated_at desc)
      from public.organization_procurement_deliveries d where d.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'incoming_goods', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'order_id', d.order_id,
        'order_number', (select order_number from public.organization_procurement_purchase_orders where id = d.order_id),
        'expected_delivery', d.expected_delivery, 'actual_delivery', d.actual_delivery,
        'delivery_status', d.delivery_status, 'quantity_received', d.quantity_received,
        'condition_status', d.condition_status, 'exception_notes', d.exception_notes
      ) order by d.updated_at desc)
      from public.organization_procurement_deliveries d where d.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'quotations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', q.id, 'rfq_number', q.rfq_number, 'title', q.title, 'status', q.status,
        'required_quotes', q.required_quotes,
        'quotes_received', (select count(*) from public.organization_procurement_quotes where quotation_id = q.id),
        'created_at', q.created_at
      ) order by q.updated_at desc)
      from public.organization_procurement_quotations q where q.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'category_key', c.category_key, 'name', c.name))
      from public.organization_procurement_categories c where c.organization_id = v_org_id and c.is_active
    ), '[]'::jsonb),
    'spend_analysis', jsonb_build_object(
      'spend_by_supplier', coalesce((
        select jsonb_agg(jsonb_build_object('supplier_name', vendor_name, 'total_spend', total_spend))
        from (
          select vendor_name, sum(total_cost) as total_spend from public.organization_procurement_purchase_orders
          where organization_id = v_org_id and status <> 'cancelled' group by vendor_name order by total_spend desc limit 10
        ) x
      ), '[]'::jsonb),
      'spend_by_department', coalesce((
        select jsonb_agg(jsonb_build_object('department_name', department_name, 'total_spend', total_spend))
        from (
          select coalesce(d.name, 'Unassigned') as department_name, sum(o.total_cost) as total_spend
          from public.organization_procurement_purchase_orders o
          left join public.organization_departments d on d.id = o.department_id
          where o.organization_id = v_org_id and o.status <> 'cancelled'
          group by d.name order by total_spend desc limit 10
        ) x
      ), '[]'::jsonb),
      'quarterly_trend', coalesce((
        select sum(total_cost) from public.organization_procurement_purchase_orders
        where organization_id = v_org_id and created_at >= date_trunc('quarter', now()) and status <> 'cancelled'
      ), 0),
      'budget_variance_note', 'Integrates with Finance Engine and Budget Engine for live budget validation.'
    ),
    'risk_management', jsonb_build_object(
      'single_supplier_dependency', coalesce((
        select jsonb_agg(jsonb_build_object('supplier_name', vendor_name, 'share_pct', share_pct))
        from (
          select vendor_name,
            round((sum(total_cost) / greatest((select sum(total_cost) from public.organization_procurement_purchase_orders where organization_id = v_org_id and status <> 'cancelled'), 1)) * 100, 1) as share_pct
          from public.organization_procurement_purchase_orders
          where organization_id = v_org_id and status <> 'cancelled'
          group by vendor_name having sum(total_cost) > 0 order by share_pct desc limit 5
        ) x
      ), '[]'::jsonb),
      'contract_expiry_risks', (select count(*) from public.organization_procurement_contracts where organization_id = v_org_id and end_date between current_date and current_date + 60 and status in ('active', 'expiring')),
      'late_deliveries', (select count(*) from public.organization_procurement_deliveries where organization_id = v_org_id and expected_delivery < current_date and delivery_status in ('pending', 'partial'))
    ),
    'reports', jsonb_build_object(
      'purchasing_volume', coalesce((select sum(total_cost) from public.organization_procurement_purchase_orders where organization_id = v_org_id and created_at >= date_trunc('year', now()) and status <> 'cancelled'), 0),
      'contract_exposure', coalesce((select sum(contract_value) from public.organization_procurement_contracts where organization_id = v_org_id and status in ('active', 'expiring')), 0),
      'avg_approval_days', coalesce((select round(avg(extract(epoch from (approved_at - submitted_at)) / 86400)::numeric, 1) from public.organization_procurement_purchase_requests where organization_id = v_org_id and approved_at is not null and submitted_at is not null), 0),
      'supplier_concentration', coalesce((
        select jsonb_agg(jsonb_build_object('vendor_name', vendor_name, 'total_spend', total_spend))
        from (select vendor_name, sum(total_cost) as total_spend from public.organization_procurement_purchase_orders where organization_id = v_org_id and status <> 'cancelled' group by vendor_name order by total_spend desc limit 5) x
      ), '[]'::jsonb),
      'savings_opportunities', 'Compare RFQ quotes and monitor supplier scorecards for cost efficiency.'
    ),
    'companion_insights', jsonb_build_object(
      'top_suppliers', coalesce((
        select jsonb_agg(jsonb_build_object('name', vendor_name, 'health_status', health_status))
        from (select vendor_name, health_status from public.organization_procurement_vendors where organization_id = v_org_id order by health_score desc nulls last limit 5) x
      ), '[]'::jsonb),
      'expiring_contracts', coalesce((
        select jsonb_agg(jsonb_build_object('name', contract_name, 'renewal_date', renewal_date))
        from (select contract_name, renewal_date from public.organization_procurement_contracts where organization_id = v_org_id and renewal_date between current_date and current_date + 30 limit 5) x
      ), '[]'::jsonb),
      'high_risk_suppliers', coalesce((
        select jsonb_agg(jsonb_build_object('name', vendor_name, 'health_status', health_status))
        from (select vendor_name, health_status from public.organization_procurement_vendors where organization_id = v_org_id and health_status = 'high_risk' limit 5) x
      ), '[]'::jsonb)
    ),
    'subscription_awareness', jsonb_build_object('note', 'Integrates with Finance Engine, Budget Engine, Inventory Engine, and Approval Engine.'),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_procurement_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'overview', 'suppliers', 'purchases', 'purchase_requests', 'approvals', 'orders',
      'quotations', 'contracts', 'incoming_goods', 'spend_analysis', 'reports'
    ),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'suppliers', '/app/procurement/suppliers',
      'requests', '/app/procurement/requests',
      'orders', '/app/procurement/orders',
      'receiving', '/app/procurement/receiving',
      'vendors', '/app/procurement/vendors',
      'finance', '/app/finance',
      'inventory', '/app/inventory'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Extended actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_procurement_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_health jsonb;
  v_manage532 text[] := array[
    'create_rfq', 'record_supplier_quote', 'select_quote', 'receive_goods',
    'refresh_supplier_scorecard', 'create_purchase_request', 'submit_purchase_request',
    'approve_purchase_request', 'reject_purchase_request', 'create_vendor', 'update_vendor_status',
    'create_contract', 'create_purchase_order', 'mark_order_delivered', 'record_delivery'
  ];
begin
  v_org_id := public._proc532_org();

  if p_action_type = any(v_manage532) then
    perform public._irp_require_permission('procurement.manage');
  else
    perform public._irp_require_permission('procurement.view');
  end if;

  perform public._proc522_ensure_settings(v_org_id);

  if p_action_type = 'create_rfq' then
    insert into public.organization_procurement_quotations (
      organization_id, rfq_number, request_id, title, description, required_quotes, owner_user_id
    ) values (
      v_org_id,
      public._proc522_next_number(v_org_id, 'RFQ', 'organization_procurement_quotations'),
      nullif(p_payload->>'request_id', '')::uuid,
      coalesce(p_payload->>'title', 'Request for quotation'),
      coalesce(p_payload->>'description', ''),
      coalesce((p_payload->>'required_quotes')::int, 3),
      (select id from public.users where auth_user_id = auth.uid() limit 1)
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'rfq_created', 'RFQ created', null, null, null, null, p_payload);
    return jsonb_build_object('ok', true, 'quotation_id', v_id);

  elsif p_action_type = 'record_supplier_quote' then
    insert into public.organization_procurement_quotes (
      organization_id, quotation_id, vendor_id, vendor_name, quoted_amount, currency, delivery_days, quality_notes
    ) values (
      v_org_id,
      (p_payload->>'quotation_id')::uuid,
      nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''),
      coalesce((p_payload->>'quoted_amount')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      nullif(p_payload->>'delivery_days', '')::int,
      coalesce(p_payload->>'quality_notes', '')
    ) returning id into v_id;
    update public.organization_procurement_quotations set status = 'quotes_received', updated_at = now()
    where id = (p_payload->>'quotation_id')::uuid and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'quote_recorded', 'Supplier quote recorded', null, null, null, null, p_payload);
    return jsonb_build_object('ok', true, 'quote_id', v_id);

  elsif p_action_type = 'select_quote' then
    update public.organization_procurement_quotes set status = 'selected', updated_at = now()
    where id = (p_payload->>'quote_id')::uuid and organization_id = v_org_id;
    update public.organization_procurement_quotations set
      status = 'approved',
      selected_vendor_id = nullif(p_payload->>'vendor_id', '')::uuid,
      updated_at = now()
    where id = (p_payload->>'quotation_id')::uuid and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'quote_selected', 'Supplier quote selected', null, nullif(p_payload->>'vendor_id', '')::uuid, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'receive_goods' then
    v_id := (p_payload->>'order_id')::uuid;
    update public.organization_procurement_deliveries set
      delivery_status = coalesce(p_payload->>'delivery_status', 'received'),
      actual_delivery = coalesce(nullif(p_payload->>'actual_delivery', '')::date, current_date),
      quantity_received = coalesce(nullif(p_payload->>'quantity_received', '')::numeric, quantity_received),
      condition_status = coalesce(p_payload->>'condition_status', condition_status),
      receiver_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1),
      exception_notes = coalesce(p_payload->>'exception_notes', exception_notes),
      inspection_results = coalesce(p_payload->>'inspection_results', inspection_results),
      updated_at = now()
    where order_id = v_id and organization_id = v_org_id;
    if coalesce(p_payload->>'delivery_status', 'received') in ('received', 'confirmed', 'inspected') then
      update public.organization_procurement_purchase_orders set status = 'delivered', updated_at = now() where id = v_id;
    elsif coalesce(p_payload->>'delivery_status', '') = 'partial' then
      update public.organization_procurement_purchase_orders set status = 'shipped', updated_at = now() where id = v_id;
    end if;
    perform public._proc522_log(v_org_id, 'goods_received', 'Goods received', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'refresh_supplier_scorecard' then
    v_id := (p_payload->>'vendor_id')::uuid;
    select public._proc532_compute_supplier_health(v.*) into v_health
    from public.organization_procurement_vendors v where v.id = v_id and v.organization_id = v_org_id;
    update public.organization_procurement_vendors set
      health_score = (v_health->>'health_score')::int,
      health_status = v_health->>'health_status',
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'scorecard_updated', 'Supplier scorecard updated', null, v_id, null, null, v_health);
    return jsonb_build_object('ok', true, 'health', v_health);

  elsif p_action_type in (
    'create_purchase_request', 'submit_purchase_request', 'approve_purchase_request',
    'reject_purchase_request', 'create_vendor', 'update_vendor_status',
    'create_contract', 'create_purchase_order', 'mark_order_delivered', 'record_delivery'
  ) then
    return public._proc522_perform_legacy_action(p_action_type, p_payload);
  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- Legacy Phase 522 actions
create or replace function public._proc522_perform_legacy_action(
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

  if p_action_type = 'create_purchase_request' then
    v_amount := coalesce((p_payload->>'estimated_cost')::numeric, 0);
    insert into public.organization_procurement_purchase_requests (
      organization_id, request_number, title, description, justification, requester_user_id,
      category_key, vendor_name, estimated_cost, currency, priority, status, approval_status, budget_check_status
    ) values (
      v_org_id, public._proc522_next_number(v_org_id, 'PR', 'organization_procurement_purchase_requests'),
      coalesce(p_payload->>'title', 'Purchase request'), coalesce(p_payload->>'description', ''),
      coalesce(p_payload->>'justification', ''),
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'category_key', 'office_supplies'),
      coalesce(p_payload->>'vendor_name', ''), v_amount, coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'priority', 'normal'), 'draft', 'none', 'pending'
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'request_created', 'Purchase request created', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true, 'request_id', v_id);

  elsif p_action_type = 'submit_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    select * into v_req from public.organization_procurement_purchase_requests where id = v_id and organization_id = v_org_id;
    perform public._proc522_seed_approvals(v_org_id, v_id, v_req.estimated_cost);
    update public.organization_procurement_purchase_requests set status = 'awaiting_approval', approval_status = 'pending_manager',
      budget_check_status = case when v_req.estimated_cost > 0 then 'passed' else 'warning' end,
      submitted_at = now(), updated_at = now() where id = v_id;
    perform public._proc522_log(v_org_id, 'request_submitted', 'Purchase request submitted', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'approve_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    update public.organization_procurement_approvals set status = 'approved',
      approver_user_id = (select id from public.users where auth_user_id = auth.uid() limit 1), decided_at = now()
    where id = (select id from public.organization_procurement_approvals where request_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 end limit 1);
    if exists (select 1 from public.organization_procurement_approvals where request_id = v_id and status = 'pending') then
      select approval_level into v_next_level from public.organization_procurement_approvals
      where request_id = v_id and status = 'pending'
      order by case approval_level when 'manager' then 1 when 'finance' then 2 when 'executive' then 3 end limit 1;
      update public.organization_procurement_purchase_requests set approval_status = 'pending_' || v_next_level, status = 'awaiting_approval', updated_at = now() where id = v_id;
    else
      update public.organization_procurement_purchase_requests set status = 'approved', approval_status = 'approved', approved_at = now(), updated_at = now() where id = v_id;
    end if;
    perform public._proc522_log(v_org_id, 'request_approved', 'Purchase request approved', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'reject_purchase_request' then
    v_id := (p_payload->>'request_id')::uuid;
    update public.organization_procurement_purchase_requests set status = 'rejected', approval_status = 'rejected', rejected_at = now(), updated_at = now() where id = v_id;
    update public.organization_procurement_approvals set status = 'rejected', decided_at = now() where request_id = v_id and status = 'pending';
    perform public._proc522_log(v_org_id, 'request_rejected', 'Purchase request rejected', v_id, null, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_vendor' then
    insert into public.organization_procurement_vendors (
      organization_id, vendor_number, vendor_name, contact_person, email, phone, country, services, category_key, status
    ) values (
      v_org_id, public._proc522_next_number(v_org_id, 'SUP', 'organization_procurement_vendors'),
      coalesce(p_payload->>'vendor_name', 'Supplier'), coalesce(p_payload->>'contact_person', ''),
      p_payload->>'email', p_payload->>'phone', coalesce(p_payload->>'country', 'NO'),
      coalesce(p_payload->>'services', ''), coalesce(p_payload->>'category_key', 'services'),
      coalesce(p_payload->>'status', 'evaluation')
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'supplier_created', 'Supplier created', null, v_id, null, null, p_payload);
    return jsonb_build_object('ok', true, 'vendor_id', v_id);

  elsif p_action_type = 'update_vendor_status' then
    v_id := (p_payload->>'vendor_id')::uuid;
    update public.organization_procurement_vendors set
      status = coalesce(p_payload->>'status', status),
      risk_status = coalesce(p_payload->>'risk_status', risk_status),
      is_preferred = coalesce((p_payload->>'is_preferred')::boolean, is_preferred),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._proc522_log(v_org_id, 'supplier_updated', 'Supplier updated', null, v_id, null, null, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'create_contract' then
    insert into public.organization_procurement_contracts (
      organization_id, contract_number, contract_name, vendor_id, vendor_name, contract_value, currency, status
    ) values (
      v_org_id, public._proc522_next_number(v_org_id, 'CON', 'organization_procurement_contracts'),
      coalesce(p_payload->>'contract_name', 'Contract'), nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''), coalesce((p_payload->>'contract_value')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'), coalesce(p_payload->>'status', 'active')
    ) returning id into v_id;
    perform public._proc522_log(v_org_id, 'contract_added', 'Contract added', null, null, v_id, null, p_payload);
    return jsonb_build_object('ok', true, 'contract_id', v_id);

  elsif p_action_type = 'create_purchase_order' then
    v_amount := coalesce((p_payload->>'total_cost')::numeric, 0);
    insert into public.organization_procurement_purchase_orders (
      organization_id, order_number, request_id, vendor_id, vendor_name, total_cost, currency, status, expected_delivery
    ) values (
      v_org_id, public._proc522_next_number(v_org_id, 'PO', 'organization_procurement_purchase_orders'),
      nullif(p_payload->>'request_id', '')::uuid, nullif(p_payload->>'vendor_id', '')::uuid,
      coalesce(p_payload->>'vendor_name', ''), v_amount, coalesce(p_payload->>'currency', 'NOK'), 'ordered',
      nullif(p_payload->>'expected_delivery', '')::date
    ) returning id into v_id;
    if nullif(p_payload->>'request_id', '') is not null then
      update public.organization_procurement_purchase_requests set status = 'ordered', updated_at = now()
      where id = (p_payload->>'request_id')::uuid;
    end if;
    insert into public.organization_procurement_deliveries (organization_id, order_id, expected_delivery, delivery_status)
    values (v_org_id, v_id, nullif(p_payload->>'expected_delivery', '')::date, 'pending');
    perform public._proc522_log(v_org_id, 'po_sent', 'Purchase order sent', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true, 'order_id', v_id);

  elsif p_action_type = 'mark_order_delivered' then
    v_id := (p_payload->>'order_id')::uuid;
    update public.organization_procurement_purchase_orders set status = 'delivered', updated_at = now() where id = v_id;
    update public.organization_procurement_deliveries set delivery_status = 'confirmed', actual_delivery = current_date, updated_at = now() where order_id = v_id;
    perform public._proc522_log(v_org_id, 'order_delivered', 'Order delivered', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'record_delivery' then
    v_id := (p_payload->>'order_id')::uuid;
    update public.organization_procurement_deliveries set
      delivery_status = coalesce(p_payload->>'delivery_status', 'received'),
      actual_delivery = coalesce(nullif(p_payload->>'actual_delivery', '')::date, current_date),
      receiving_confirmation = coalesce(p_payload->>'receiving_confirmation', receiving_confirmation),
      inspection_results = coalesce(p_payload->>'inspection_results', inspection_results),
      updated_at = now()
    where order_id = v_id and organization_id = v_org_id;
    if coalesce(p_payload->>'delivery_status', 'received') in ('received', 'confirmed', 'inspected') then
      update public.organization_procurement_purchase_orders set status = 'delivered', updated_at = now() where id = v_id;
    end if;
    perform public._proc522_log(v_org_id, 'goods_received', 'Goods received', null, null, null, v_id, p_payload);
    return jsonb_build_object('ok', true);
  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
end; $$;

-- Companion & mobile (Phase 532)
drop function if exists public.get_companion_procurement_operations_context();

create or replace function public.get_companion_procurement_operations_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc532_org();
  perform public._proc522_ensure_settings(v_org_id);

  return jsonb_build_object(
    'found', true,
    'principle', 'Companion helps organizations buy smarter.',
    'query', p_query,
    'summary', jsonb_build_object(
      'pending_approvals', (select count(*) from public.organization_procurement_purchase_requests where organization_id = v_org_id and approval_status like 'pending%'),
      'high_risk_suppliers', (select count(*) from public.organization_procurement_vendors where organization_id = v_org_id and health_status = 'high_risk'),
      'expiring_contracts_30d', (select count(*) from public.organization_procurement_contracts where organization_id = v_org_id and renewal_date between current_date and current_date + 30),
      'open_rfqs', (select count(*) from public.organization_procurement_quotations where organization_id = v_org_id and status in ('open', 'quotes_received'))
    ),
    'companion_prompts', jsonb_build_array(
      'Show top suppliers.',
      'Which contracts expire next month?',
      'Which suppliers are high risk?',
      'Show open purchase requests.',
      'Generate procurement summary.'
    ),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'suppliers', '/app/procurement/suppliers',
      'receiving', '/app/procurement/receiving'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_procurement_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('procurement.view');
  v_org_id := public._proc532_org();

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('procurement.manage', v_org_id),
    'my_pending_approvals', (select count(*) from public.organization_procurement_purchase_requests where organization_id = v_org_id and approval_status like 'pending%'),
    'open_orders', (select count(*) from public.organization_procurement_purchase_orders where organization_id = v_org_id and status not in ('delivered', 'cancelled')),
    'pending_receiving', (select count(*) from public.organization_procurement_deliveries where organization_id = v_org_id and delivery_status in ('pending', 'partial')),
    'routes', jsonb_build_object(
      'procurement', '/app/procurement',
      'suppliers', '/app/procurement/suppliers',
      'requests', '/app/procurement/requests',
      'orders', '/app/procurement/orders',
      'receiving', '/app/procurement/receiving',
      'mobile_ready', true
    )
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('procurement', '/app/procurement'));
end; $$;

insert into public.organization_procurement_categories (organization_id, category_key, name, is_system)
select o.id, v.category_key, v.name, true
from public.organizations o
cross join (values
  ('technology', 'Technology'), ('logistics', 'Logistics'), ('manufacturing', 'Manufacturing'),
  ('inventory', 'Inventory'), ('facilities', 'Facilities'), ('utilities', 'Utilities')
) as v(category_key, name)
on conflict (organization_id, category_key) do nothing;

do $$ begin
  perform public._mre501_seed_module(
    'procurement', 'Procurement & Supplier Operations', 'procurement', 'operations',
    'Procurement center — suppliers, purchase requests, orders, quotations, receiving, and spend analysis.',
    'starter', null, 'operations', '/app/procurement', 'licensed', 9
  );
exception when others then null;
end $$;

grant execute on function public._proc532_compute_supplier_health(public.organization_procurement_vendors) to authenticated;
grant execute on function public._proc522_perform_legacy_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_procurement_operations_context(text) to authenticated;
