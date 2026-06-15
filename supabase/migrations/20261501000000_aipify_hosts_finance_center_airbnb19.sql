-- Phase Airbnb 19 — Aipify Hosts Finance Center Foundation
-- Feature owner: CUSTOMER APP. Helpers: _ahostfin_* (engine), _ahostbp381_* (blueprint)

create table if not exists public.aipify_hosts_finance_center_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  default_section text not null default 'overview' check (
    default_section in ('overview', 'revenue', 'payouts', 'expenses', 'forecasts', 'reports')
  ),
  metadata jsonb not null default '{"metadata_only":true,"role_governed":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_finance_center_settings enable row level security;
revoke all on public.aipify_hosts_finance_center_settings from authenticated, anon;

create table if not exists public.aipify_hosts_revenue_entries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  revenue_key text not null,
  reservation_ref text not null,
  check_in_date date,
  check_out_date date,
  amount numeric(12,2) not null default 0,
  revenue_status text not null default 'pending' check (
    revenue_status in ('pending', 'confirmed', 'paid', 'cancelled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, revenue_key)
);
create index if not exists aipify_hosts_revenue_entries_tenant_idx
  on public.aipify_hosts_revenue_entries (tenant_id, revenue_status);
alter table public.aipify_hosts_revenue_entries enable row level security;
revoke all on public.aipify_hosts_revenue_entries from authenticated, anon;

create table if not exists public.aipify_hosts_payouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  payout_key text not null,
  expected_date date not null,
  amount numeric(12,2) not null default 0,
  source text not null default 'platform',
  payout_status text not null default 'scheduled' check (
    payout_status in ('scheduled', 'processing', 'completed', 'delayed')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, payout_key)
);
create index if not exists aipify_hosts_payouts_tenant_idx
  on public.aipify_hosts_payouts (tenant_id, payout_status);
alter table public.aipify_hosts_payouts enable row level security;
revoke all on public.aipify_hosts_payouts from authenticated, anon;

create table if not exists public.aipify_hosts_expenses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  property_id uuid references public.aipify_hosts_properties (id) on delete set null,
  expense_key text not null,
  category text not null check (
    category in ('cleaning', 'maintenance', 'supplies', 'utilities', 'insurance', 'other')
  ),
  amount numeric(12,2) not null default 0,
  expense_date date not null default current_date,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, expense_key)
);
create index if not exists aipify_hosts_expenses_tenant_idx
  on public.aipify_hosts_expenses (tenant_id, category);
alter table public.aipify_hosts_expenses enable row level security;
revoke all on public.aipify_hosts_expenses from authenticated, anon;

create table if not exists public.aipify_hosts_finance_center_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists aipify_hosts_finance_center_events_tenant_idx
  on public.aipify_hosts_finance_center_events (tenant_id, created_at desc);
alter table public.aipify_hosts_finance_center_events enable row level security;
revoke all on public.aipify_hosts_finance_center_events from authenticated, anon;

create or replace function public._ahostfin_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_finance_center_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_hosts_finance_center_settings;
begin
  insert into public.aipify_hosts_finance_center_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_hosts_finance_center_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ahostfin_log_event(
  p_tenant_id uuid, p_event_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.aipify_hosts_finance_center_events (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, p_context) returning id into v_id;
  perform public._ahost_log_audit(p_tenant_id, 'finance_' || p_event_type, p_summary, p_context);
  return v_id;
end; $$;

create or replace function public._ahostbp381_positioning() returns text language sql immutable as $$
  select 'Financial visibility across hospitality operations — revenue, payouts, expenses, and forecasts in one place.'; $$;

create or replace function public._ahostbp381_sections() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'overview', 'label', 'Overview'),
    jsonb_build_object('key', 'revenue', 'label', 'Revenue'),
    jsonb_build_object('key', 'payouts', 'label', 'Payouts'),
    jsonb_build_object('key', 'expenses', 'label', 'Expenses'),
    jsonb_build_object('key', 'forecasts', 'label', 'Forecasts'),
    jsonb_build_object('key', 'reports', 'label', 'Reports')
  ); $$;

create or replace function public._ahostbp381_filters() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'all_properties', 'label', 'All Properties'),
    jsonb_build_object('key', 'date_range', 'label', 'Date Range'),
    jsonb_build_object('key', 'revenue_status', 'label', 'Revenue Status'),
    jsonb_build_object('key', 'expense_category', 'label', 'Expense Category')
  ); $$;

create or replace function public._ahostbp381_reports() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'revenue_report', 'label', 'Revenue Report'),
    jsonb_build_object('key', 'expense_report', 'label', 'Expense Report'),
    jsonb_build_object('key', 'net_performance_report', 'label', 'Net Performance Report'),
    jsonb_build_object('key', 'property_financial_report', 'label', 'Property Financial Report')
  ); $$;

create or replace function public._ahostbp381_export_formats() returns jsonb language sql immutable as $$
  select jsonb_build_array('pdf', 'excel', 'csv'); $$;

create or replace function public._ahostfin_revenue_row(p_r public.aipify_hosts_revenue_entries, p_property_name text)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', p_r.id, 'revenue_key', p_r.revenue_key, 'property', coalesce(p_property_name, '—'),
    'property_id', p_r.property_id, 'reservation_ref', p_r.reservation_ref,
    'check_in_date', p_r.check_in_date, 'check_out_date', p_r.check_out_date,
    'amount', p_r.amount, 'revenue_status', p_r.revenue_status
  ); $$;

create or replace function public._ahostfin_seed_finance(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_prop record; v_i int := 0; v_month_start date := date_trunc('month', current_date)::date;
begin
  if exists (select 1 from public.aipify_hosts_revenue_entries where tenant_id = p_tenant_id limit 1) then return; end if;
  for v_prop in
    select id, display_name from public.aipify_hosts_properties
    where tenant_id = p_tenant_id and status = 'active' order by display_name limit 4
  loop
    v_i := v_i + 1;
    insert into public.aipify_hosts_revenue_entries (
      tenant_id, property_id, revenue_key, reservation_ref, check_in_date, check_out_date, amount, revenue_status
    ) values
    (p_tenant_id, v_prop.id, 'rev_' || v_i || '_a', 'RES-' || (1000 + v_i), current_date - 5, current_date + 2,
     8500 + (v_i * 500), case when v_i = 1 then 'paid' when v_i = 2 then 'confirmed' else 'pending' end),
    (p_tenant_id, v_prop.id, 'rev_' || v_i || '_b', 'RES-' || (2000 + v_i), current_date + 7, current_date + 14,
     12000 + (v_i * 300), 'confirmed');
    insert into public.aipify_hosts_expenses (
      tenant_id, property_id, expense_key, category, amount, expense_date, notes
    ) values
    (p_tenant_id, v_prop.id, 'exp_clean_' || v_i, 'cleaning', 1200 + (v_i * 100), v_month_start + (v_i * 3), 'Turnover cleaning'),
    (p_tenant_id, v_prop.id, 'exp_maint_' || v_i, 'maintenance', 800, v_month_start + 10, 'Minor repairs');
  end loop;
  insert into public.aipify_hosts_payouts (tenant_id, payout_key, expected_date, amount, source, payout_status)
  values
    (p_tenant_id, 'pay_1', current_date + 7, 24500, 'Airbnb', 'scheduled'),
    (p_tenant_id, 'pay_2', current_date - 3, 18200, 'Booking.com', 'delayed'),
    (p_tenant_id, 'pay_3', current_date - 14, 31000, 'Direct booking', 'completed');
  if v_i = 0 then
    insert into public.aipify_hosts_revenue_entries (tenant_id, revenue_key, reservation_ref, amount, revenue_status)
    values (p_tenant_id, 'rev_default', 'RES-0001', 15000, 'confirmed');
  end if;
end; $$;

create or replace function public._ahostfin_overview(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_month_revenue numeric; v_ytd_revenue numeric; v_upcoming_payouts numeric;
  v_outstanding_expenses numeric; v_net numeric;
begin
  select coalesce(sum(amount), 0) into v_month_revenue from public.aipify_hosts_revenue_entries
  where tenant_id = p_tenant_id and revenue_status in ('confirmed', 'paid')
    and check_in_date >= date_trunc('month', current_date)::date;
  select coalesce(sum(amount), 0) into v_ytd_revenue from public.aipify_hosts_revenue_entries
  where tenant_id = p_tenant_id and revenue_status in ('confirmed', 'paid')
    and check_in_date >= date_trunc('year', current_date)::date;
  select coalesce(sum(amount), 0) into v_upcoming_payouts from public.aipify_hosts_payouts
  where tenant_id = p_tenant_id and payout_status in ('scheduled', 'processing');
  select coalesce(sum(amount), 0) into v_outstanding_expenses from public.aipify_hosts_expenses
  where tenant_id = p_tenant_id and expense_date >= date_trunc('month', current_date)::date;
  v_net := v_month_revenue - v_outstanding_expenses;
  return jsonb_build_object(
    'revenue_this_month', v_month_revenue,
    'revenue_ytd', v_ytd_revenue,
    'upcoming_payouts', v_upcoming_payouts,
    'outstanding_expenses', v_outstanding_expenses,
    'net_performance', v_net
  );
end; $$;

create or replace function public._ahostfin_forecast(p_tenant_id uuid)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'expected_revenue', coalesce((
      select sum(amount) from public.aipify_hosts_revenue_entries
      where tenant_id = p_tenant_id and revenue_status in ('pending', 'confirmed')
        and check_in_date between current_date and current_date + interval '90 days'
    ), 0),
    'expected_expenses', coalesce((
      select sum(amount) * 1.15 from public.aipify_hosts_expenses
      where tenant_id = p_tenant_id and expense_date >= date_trunc('month', current_date)::date
    ), 0),
    'estimated_net_position', coalesce((
      select sum(amount) from public.aipify_hosts_revenue_entries
      where tenant_id = p_tenant_id and revenue_status in ('pending', 'confirmed')
        and check_in_date between current_date and current_date + interval '90 days'
    ), 0) - coalesce((
      select sum(amount) * 1.15 from public.aipify_hosts_expenses
      where tenant_id = p_tenant_id and expense_date >= date_trunc('month', current_date)::date
    ), 0)
  )
  from public.aipify_hosts_finance_center_settings s where s.tenant_id = p_tenant_id limit 1; $$;

create or replace function public._ahostfin_notifications(p_tenant_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_delayed int; v_discrepancy int; v_large int;
begin
  select count(*)::int into v_delayed from public.aipify_hosts_payouts
  where tenant_id = p_tenant_id and payout_status = 'delayed';
  select count(*)::int into v_discrepancy from public.aipify_hosts_finance_center_events
  where tenant_id = p_tenant_id and event_type = 'revenue_discrepancy'
    and created_at > now() - interval '30 days';
  select count(*)::int into v_large from public.aipify_hosts_expenses
  where tenant_id = p_tenant_id and amount >= 10000
    and created_at > now() - interval '7 days';
  if v_delayed = 0 and v_discrepancy = 0 and v_large = 0 then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(x) from (
      select jsonb_build_object('key', 'payout_delayed', 'active', v_delayed > 0, 'count', v_delayed,
        'message', v_delayed || ' payout(s) delayed') as x where v_delayed > 0
      union all
      select jsonb_build_object('key', 'revenue_discrepancy', 'active', v_discrepancy > 0, 'count', v_discrepancy,
        'message', 'Revenue discrepancy detected — review required') where v_discrepancy > 0
      union all
      select jsonb_build_object('key', 'large_expense', 'active', v_large > 0, 'count', v_large,
        'message', v_large || ' large expense(s) recorded this week') where v_large > 0
    ) n
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_aipify_hosts_finance_center_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_fc public.aipify_hosts_finance_center_settings; v_hosts public.aipify_hosts_settings;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_fc := public._ahostfin_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_fc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'positioning', public._ahostbp381_positioning(),
    'route', '/app/aipify-hosts/finance'
  );
end; $$;

create or replace function public.get_aipify_hosts_finance_center_dashboard(
  p_section text default 'overview',
  p_filter text default 'all_properties',
  p_property_id uuid default null,
  p_revenue_status text default null,
  p_expense_category text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_fc public.aipify_hosts_finance_center_settings; v_hosts public.aipify_hosts_settings;
  v_section text; v_revenue jsonb; v_payouts jsonb; v_expenses jsonb; v_properties jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_fc := public._ahostfin_ensure_settings(v_tenant_id);
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_section := coalesce(nullif(trim(p_section), ''), v_fc.default_section, 'overview');
  perform public._ahostfin_seed_finance(v_tenant_id);
  perform public._ahostfin_log_event(v_tenant_id, 'dashboard_view', 'Finance Center viewed',
    jsonb_build_object('section', v_section, 'filter', p_filter));

  select coalesce(jsonb_agg(
    public._ahostfin_revenue_row(r, coalesce(p.display_name, '—')) order by r.check_in_date desc nulls last
  ), '[]'::jsonb) into v_revenue
  from public.aipify_hosts_revenue_entries r
  left join public.aipify_hosts_properties p on p.id = r.property_id
  where r.tenant_id = v_tenant_id
    and (p_property_id is null or r.property_id = p_property_id)
    and (p_revenue_status is null or r.revenue_status = p_revenue_status);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', py.id, 'payout_key', py.payout_key, 'expected_date', py.expected_date,
    'amount', py.amount, 'source', py.source, 'payout_status', py.payout_status
  ) order by py.expected_date), '[]'::jsonb) into v_payouts
  from public.aipify_hosts_payouts py where py.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'expense_key', e.expense_key, 'category', e.category,
    'property', coalesce(p.display_name, '—'), 'property_id', e.property_id,
    'amount', e.amount, 'expense_date', e.expense_date, 'notes', e.notes
  ) order by e.expense_date desc), '[]'::jsonb) into v_expenses
  from public.aipify_hosts_expenses e
  left join public.aipify_hosts_properties p on p.id = e.property_id
  where e.tenant_id = v_tenant_id
    and (p_property_id is null or e.property_id = p_property_id)
    and (p_expense_category is null or e.category = p_expense_category);

  select coalesce(jsonb_agg(jsonb_build_object('id', p.id, 'display_name', p.display_name) order by p.display_name), '[]'::jsonb)
  into v_properties
  from public.aipify_hosts_properties p where p.tenant_id = v_tenant_id and p.status <> 'archived';

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_fc.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'active_section', v_section,
    'active_filter', coalesce(p_filter, 'all_properties'),
    'positioning', public._ahostbp381_positioning(),
    'governance', jsonb_build_object(
      'role_permissions', true,
      'audit_financial_adjustments', true,
      'audit_report_exports', true
    ),
    'sections', public._ahostbp381_sections(),
    'filters', public._ahostbp381_filters(),
    'reports', public._ahostbp381_reports(),
    'export_formats', public._ahostbp381_export_formats(),
    'revenue_statuses', jsonb_build_array('pending', 'confirmed', 'paid', 'cancelled'),
    'payout_statuses', jsonb_build_array('scheduled', 'processing', 'completed', 'delayed'),
    'expense_categories', jsonb_build_array('cleaning', 'maintenance', 'supplies', 'utilities', 'insurance', 'other'),
    'notifications', public._ahostfin_notifications(v_tenant_id),
    'overview', public._ahostfin_overview(v_tenant_id),
    'forecast', public._ahostfin_forecast(v_tenant_id),
    'revenue_entries', v_revenue,
    'payouts', v_payouts,
    'expenses', v_expenses,
    'properties', v_properties,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 19 — Finance Center Foundation',
      'doc', 'aipify-hosts/PHASE_AIRBNB_19_FINANCE_CENTER.text',
      'route', '/app/aipify-hosts/finance'
    )
  );
end; $$;

create or replace function public.record_aipify_hosts_expense(
  p_category text,
  p_amount numeric,
  p_property_id uuid default null,
  p_expense_date date default current_date,
  p_notes text default null,
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_key text;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  if p_category not in ('cleaning', 'maintenance', 'supplies', 'utilities', 'insurance', 'other') then
    raise exception 'Invalid category';
  end if;
  v_key := 'exp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
  insert into public.aipify_hosts_expenses (tenant_id, property_id, expense_key, category, amount, expense_date, notes)
  values (v_tenant_id, p_property_id, v_key, p_category, p_amount, coalesce(p_expense_date, current_date), nullif(trim(p_notes), ''))
  returning id into v_id;
  perform public._ahostfin_log_event(v_tenant_id, 'expense_recorded', 'Expense recorded',
    jsonb_build_object('expense_id', v_id, 'amount', p_amount, 'category', p_category));
  if p_amount >= 10000 then
    perform public._ahostfin_log_event(v_tenant_id, 'large_expense', 'Large expense recorded',
      jsonb_build_object('expense_id', v_id, 'amount', p_amount));
  end if;
  return jsonb_build_object('success', true, 'expense_id', v_id);
end; $$;

create or replace function public.export_aipify_hosts_finance_report(
  p_report_key text,
  p_format text default 'pdf',
  p_org_id uuid default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if p_report_key not in ('revenue_report', 'expense_report', 'net_performance_report', 'property_financial_report') then
    raise exception 'Invalid report';
  end if;
  if p_format not in ('pdf', 'excel', 'csv') then raise exception 'Invalid format'; end if;
  perform public._ahostfin_log_event(v_tenant_id, 'report_exported', 'Finance report exported',
    jsonb_build_object('report_key', p_report_key, 'format', p_format));
  return jsonb_build_object('success', true, 'report_key', p_report_key, 'format', p_format,
    'export_ready', true, 'message', 'Report export prepared');
end; $$;

create or replace function public.seed_aipify_hosts_finance_center_knowledge_airbnb19()
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._ahostkc_ensure_category(
    'aipify-hosts-finance', 'Hosts Finance Center',
    'Hospitality finances, expenses, revenue planning, and reporting.', 270
  );
  perform public._ahostkc_seed_article('aipify-hosts-finance', 'understanding-hospitality-finances', 'Understanding hospitality finances',
    'Track revenue, payouts, and expenses in one workspace — understand net performance without separate spreadsheets.');
  perform public._ahostkc_seed_article('aipify-hosts-finance', 'managing-operational-expenses', 'Managing operational expenses',
    'Categorize cleaning, maintenance, supplies, utilities, insurance, and other costs by property with auditable records.');
  perform public._ahostkc_seed_article('aipify-hosts-finance', 'revenue-planning', 'Revenue planning',
    'Use forecasts for expected revenue, expenses, and estimated net position over the next 90 days.');
  perform public._ahostkc_seed_article('aipify-hosts-finance', 'financial-reporting-best-practices', 'Financial reporting best practices',
    'Export revenue, expense, net performance, and property financial reports in PDF, Excel, or CSV.');
end; $$;

select public.seed_aipify_hosts_finance_center_knowledge_airbnb19();

grant execute on function public.get_aipify_hosts_finance_center_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_finance_center_dashboard(text, text, uuid, text, text, uuid) to authenticated;
grant execute on function public.record_aipify_hosts_expense(text, numeric, uuid, date, text, uuid) to authenticated;
grant execute on function public.export_aipify_hosts_finance_report(text, text, uuid) to authenticated;
grant execute on function public.seed_aipify_hosts_finance_center_knowledge_airbnb19() to authenticated;
