-- Phase 519 — Finance, Billing & Business Operations Engine
-- Aipify organizes financial operations. Accounting systems remain the source of truth.
-- Integrates: Employees (516), Domains (505A), Governance (515), Business Packs

-- ---------------------------------------------------------------------------
-- 1. Settings & categories
-- ---------------------------------------------------------------------------
create table if not exists public.organization_finance_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_currency text not null default 'NOK',
  fiscal_year_start_month integer not null default 1 check (fiscal_year_start_month between 1 and 12),
  expense_approval_required boolean not null default true,
  invoice_approval_required boolean not null default false,
  companion_finance_context_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_finance_settings enable row level security;
revoke all on public.organization_finance_settings from authenticated, anon;

create table if not exists public.organization_finance_categories (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_key text not null,
  name text not null,
  category_type text not null check (category_type in ('revenue', 'expense')),
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, category_key)
);

alter table public.organization_finance_categories enable row level security;
revoke all on public.organization_finance_categories from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Revenue, expenses, invoices
-- ---------------------------------------------------------------------------
create table if not exists public.organization_finance_revenue_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  revenue_number text,
  title text not null,
  category_id uuid references public.organization_finance_categories (id) on delete set null,
  category_key text not null default 'services',
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  revenue_type text not null default 'one_time' check (revenue_type in ('recurring', 'one_time')),
  source_type text not null default 'service' check (
    source_type in ('invoice', 'sale', 'project', 'subscription', 'service', 'custom')
  ),
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  department_id uuid references public.organization_departments (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_finance_revenue_org_idx
  on public.organization_finance_revenue_events (organization_id, occurred_at desc);

alter table public.organization_finance_revenue_events enable row level security;
revoke all on public.organization_finance_revenue_events from authenticated, anon;

create table if not exists public.organization_finance_expenses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  expense_number text,
  vendor_name text not null default '',
  category_id uuid references public.organization_finance_categories (id) on delete set null,
  category_key text not null default 'operations',
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  expense_date date not null default current_date,
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  owner_user_id uuid references public.users (id) on delete set null,
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'approved', 'rejected', 'paid', 'cancelled')
  ),
  approval_status text not null default 'none' check (
    approval_status in ('none', 'pending_manager', 'pending_finance', 'approved', 'rejected')
  ),
  attachments jsonb not null default '[]'::jsonb,
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_finance_expenses_org_idx
  on public.organization_finance_expenses (organization_id, expense_date desc, status);

alter table public.organization_finance_expenses enable row level security;
revoke all on public.organization_finance_expenses from authenticated, anon;

create table if not exists public.organization_finance_invoices (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  invoice_number text,
  title text not null,
  direction text not null default 'outgoing' check (direction in ('incoming', 'outgoing')),
  customer_name text not null default '',
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  status text not null default 'draft' check (
    status in ('draft', 'sent', 'overdue', 'paid', 'cancelled')
  ),
  due_date date,
  paid_at timestamptz,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  department_id uuid references public.organization_departments (id) on delete set null,
  approval_status text not null default 'none' check (
    approval_status in ('none', 'pending', 'approved', 'rejected')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, invoice_number)
);

create index if not exists organization_finance_invoices_org_idx
  on public.organization_finance_invoices (organization_id, status, due_date);

alter table public.organization_finance_invoices enable row level security;
revoke all on public.organization_finance_invoices from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Budgets, forecasts, subscriptions, vendors, approvals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_finance_budgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  budget_key text not null,
  name text not null,
  scope_type text not null default 'department' check (
    scope_type in ('department', 'project', 'domain', 'business_pack', 'organization')
  ),
  department_id uuid references public.organization_departments (id) on delete set null,
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  amount_limit numeric(14, 2) not null default 0,
  amount_used numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  period_start date not null default date_trunc('year', current_date)::date,
  period_end date not null default (date_trunc('year', current_date) + interval '1 year' - interval '1 day')::date,
  warning_threshold_percent integer not null default 80,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, budget_key)
);

alter table public.organization_finance_budgets enable row level security;
revoke all on public.organization_finance_budgets from authenticated, anon;

create table if not exists public.organization_finance_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_type text not null check (
    forecast_type in ('revenue', 'expense', 'subscription', 'growth', 'budget', 'cash_flow')
  ),
  title text not null,
  period_label text not null default '',
  projected_amount numeric(14, 2) not null default 0,
  actual_amount numeric(14, 2),
  currency text not null default 'NOK',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  generated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.organization_finance_forecasts enable row level security;
revoke all on public.organization_finance_forecasts from authenticated, anon;

create table if not exists public.organization_finance_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  vendor_name text not null,
  service_name text not null,
  subscription_type text not null default 'third_party' check (
    subscription_type in ('aipify', 'third_party', 'software', 'license', 'vendor_contract')
  ),
  amount numeric(14, 2) not null default 0,
  currency text not null default 'NOK',
  billing_cycle text not null default 'monthly' check (
    billing_cycle in ('monthly', 'quarterly', 'annual', 'custom')
  ),
  renewal_date date,
  status text not null default 'active' check (status in ('active', 'pending_renewal', 'cancelled', 'expired')),
  domain_id uuid references public.organization_domains (id) on delete set null,
  business_pack_key text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_finance_subscriptions enable row level security;
revoke all on public.organization_finance_subscriptions from authenticated, anon;

create table if not exists public.organization_finance_vendors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  vendor_name text not null,
  contact_email text not null default '',
  contact_phone text not null default '',
  contract_status text not null default 'active' check (
    contract_status in ('active', 'pending_renewal', 'expired', 'inactive')
  ),
  payment_status text not null default 'current' check (
    payment_status in ('current', 'overdue', 'pending', 'paid')
  ),
  renewal_date date,
  performance_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organization_finance_vendors enable row level security;
revoke all on public.organization_finance_vendors from authenticated, anon;

create table if not exists public.organization_finance_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_type text not null check (
    approval_type in ('expense', 'invoice', 'purchase', 'budget', 'department')
  ),
  reference_id uuid not null,
  reference_label text not null default '',
  amount numeric(14, 2),
  status text not null default 'pending' check (
    status in ('pending', 'pending_manager', 'pending_finance', 'approved', 'rejected')
  ),
  requested_by_user_id uuid references public.users (id) on delete set null,
  approver_user_id uuid references public.users (id) on delete set null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists organization_finance_approvals_org_idx
  on public.organization_finance_approvals (organization_id, status, created_at desc);

alter table public.organization_finance_approvals enable row level security;
revoke all on public.organization_finance_approvals from authenticated, anon;

create table if not exists public.organization_finance_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_key text not null check (
    integration_key in ('fiken', 'stripe', 'vipps', 'klarna', 'dnb_invoice', 'custom')
  ),
  name text not null,
  status text not null default 'prepared' check (
    status in ('prepared', 'pending', 'connected', 'disabled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, integration_key)
);

alter table public.organization_finance_integrations enable row level security;
revoke all on public.organization_finance_integrations from authenticated, anon;

create table if not exists public.organization_finance_scheduled_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_type text not null check (
    report_type in ('revenue', 'expense', 'profit', 'department', 'domain', 'business_pack', 'executive')
  ),
  schedule text not null default 'monthly' check (
    schedule in ('weekly', 'monthly', 'quarterly', 'annual', 'custom')
  ),
  title text not null,
  is_active boolean not null default true,
  next_run_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.organization_finance_scheduled_reports enable row level security;
revoke all on public.organization_finance_scheduled_reports from authenticated, anon;

create table if not exists public.organization_finance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_finance_audit_logs_org_idx
  on public.organization_finance_audit_logs (organization_id, created_at desc);

alter table public.organization_finance_audit_logs enable row level security;
revoke all on public.organization_finance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._fin519_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._fin519_log(
  p_org_id uuid, p_action text, p_summary text, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_finance_audit_logs (
    organization_id, actor_user_id, action, summary, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._fin519_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_finance_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;

  insert into public.organization_finance_categories (organization_id, category_key, name, category_type, is_system)
  values
    (p_org_id, 'services', 'Services', 'revenue', true),
    (p_org_id, 'subscriptions', 'Subscriptions', 'revenue', true),
    (p_org_id, 'projects', 'Projects', 'revenue', true),
    (p_org_id, 'software', 'Software', 'expense', true),
    (p_org_id, 'marketing', 'Marketing', 'expense', true),
    (p_org_id, 'payroll', 'Payroll', 'expense', true),
    (p_org_id, 'operations', 'Operations', 'expense', true),
    (p_org_id, 'travel', 'Travel', 'expense', true)
  on conflict (organization_id, category_key) do nothing;

  insert into public.organization_finance_integrations (organization_id, integration_key, name, status)
  values
    (p_org_id, 'fiken', 'Fiken', 'prepared'),
    (p_org_id, 'stripe', 'Stripe', 'prepared'),
    (p_org_id, 'vipps', 'Vipps', 'prepared'),
    (p_org_id, 'klarna', 'Klarna', 'prepared'),
    (p_org_id, 'dnb_invoice', 'DNB Invoice', 'prepared')
  on conflict (organization_id, integration_key) do nothing;
end; $$;

create or replace function public._fin519_next_number(p_org_id uuid, p_prefix text, p_table text)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_n bigint;
begin
  execute format('select count(*) + 1 from public.%I where organization_id = $1', p_table)
  into v_n using p_org_id;
  return p_prefix || '-' || lpad(v_n::text, 5, '0');
end; $$;

create or replace function public._fin519_expense_json(p_row public.organization_finance_expenses)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'expense_number', p_row.expense_number,
    'vendor_name', p_row.vendor_name,
    'category_key', p_row.category_key,
    'amount', p_row.amount,
    'currency', p_row.currency,
    'expense_date', p_row.expense_date,
    'department_name', (select name from public.organization_departments where id = p_row.department_id),
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'owner_name', (select full_name from public.users where id = p_row.owner_user_id),
    'status', p_row.status,
    'approval_status', p_row.approval_status
  );
end; $$;

create or replace function public._fin519_invoice_json(p_row public.organization_finance_invoices)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'invoice_number', p_row.invoice_number,
    'title', p_row.title,
    'direction', p_row.direction,
    'customer_name', p_row.customer_name,
    'amount', p_row.amount,
    'currency', p_row.currency,
    'status', p_row.status,
    'due_date', p_row.due_date,
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'business_pack_key', p_row.business_pack_key,
    'approval_status', p_row.approval_status
  );
end; $$;

create or replace function public._fin519_revenue_json(p_row public.organization_finance_revenue_events)
returns jsonb language plpgsql stable as $$
begin
  return jsonb_build_object(
    'id', p_row.id,
    'revenue_number', p_row.revenue_number,
    'title', p_row.title,
    'category_key', p_row.category_key,
    'amount', p_row.amount,
    'currency', p_row.currency,
    'revenue_type', p_row.revenue_type,
    'source_type', p_row.source_type,
    'domain_name', (select domain from public.organization_domains where id = p_row.domain_id),
    'occurred_at', p_row.occurred_at
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Finance Operations Center
-- ---------------------------------------------------------------------------
create or replace function public.get_finance_operations_center(p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_month_start timestamptz := date_trunc('month', now());
  v_year_start timestamptz := date_trunc('year', now());
begin
  perform public._irp_require_permission('finance.view');
  v_org_id := public._fin519_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._fin519_ensure_settings(v_org_id);
  perform public._fin519_log(v_org_id, 'center_view', 'Finance Center viewed',
    jsonb_build_object('section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify is not an accounting system. Aipify helps organizations organize financial operations.',
    'overview', jsonb_build_object(
      'revenue_this_month', coalesce((
        select sum(amount) from public.organization_finance_revenue_events
        where organization_id = v_org_id and occurred_at >= v_month_start
      ), 0),
      'revenue_ytd', coalesce((
        select sum(amount) from public.organization_finance_revenue_events
        where organization_id = v_org_id and occurred_at >= v_year_start
      ), 0),
      'expenses_this_month', coalesce((
        select sum(amount) from public.organization_finance_expenses
        where organization_id = v_org_id and expense_date >= v_month_start::date
          and status not in ('cancelled', 'rejected')
      ), 0),
      'expenses_ytd', coalesce((
        select sum(amount) from public.organization_finance_expenses
        where organization_id = v_org_id and expense_date >= v_year_start::date
          and status not in ('cancelled', 'rejected')
      ), 0),
      'outstanding_invoices', (
        select count(*) from public.organization_finance_invoices
        where organization_id = v_org_id and status in ('sent', 'overdue')
      ),
      'upcoming_payments', coalesce((
        select sum(amount) from public.organization_finance_invoices
        where organization_id = v_org_id and status = 'sent'
          and due_date between current_date and current_date + 30
      ), 0),
      'cash_flow_snapshot', coalesce((
        select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start
      ), 0) - coalesce((
        select sum(amount) from public.organization_finance_expenses
        where organization_id = v_org_id and expense_date >= v_month_start::date and status not in ('cancelled', 'rejected')
      ), 0),
      'subscription_costs_monthly', coalesce((
        select sum(case billing_cycle when 'annual' then amount / 12 when 'quarterly' then amount / 3 else amount end)
        from public.organization_finance_subscriptions
        where organization_id = v_org_id and status = 'active'
      ), 0),
      'financial_health', case
        when coalesce((select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start), 0)
          >= coalesce((select sum(amount) from public.organization_finance_expenses where organization_id = v_org_id and expense_date >= v_month_start::date and status not in ('cancelled', 'rejected')), 0)
        then 'healthy' else 'attention'
      end,
      'pending_approvals', (select count(*) from public.organization_finance_approvals where organization_id = v_org_id and status like 'pending%'),
      'overdue_invoices', (select count(*) from public.organization_finance_invoices where organization_id = v_org_id and status = 'overdue'),
      'budgets_at_risk', (
        select count(*) from public.organization_finance_budgets
        where organization_id = v_org_id and is_active
          and amount_limit > 0
          and (amount_used / amount_limit * 100) >= warning_threshold_percent
      )
    ),
    'revenue', coalesce((
      select jsonb_agg(public._fin519_revenue_json(r) order by r.occurred_at desc)
      from (select * from public.organization_finance_revenue_events where organization_id = v_org_id order by occurred_at desc limit 50) r
    ), '[]'::jsonb),
    'expenses', coalesce((
      select jsonb_agg(public._fin519_expense_json(e) order by e.expense_date desc)
      from (select * from public.organization_finance_expenses where organization_id = v_org_id order by expense_date desc limit 50) e
    ), '[]'::jsonb),
    'invoices', coalesce((
      select jsonb_agg(public._fin519_invoice_json(i) order by i.updated_at desc)
      from (select * from public.organization_finance_invoices where organization_id = v_org_id order by updated_at desc limit 50) i
    ), '[]'::jsonb),
    'subscriptions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'vendor_name', s.vendor_name, 'service_name', s.service_name,
        'amount', s.amount, 'billing_cycle', s.billing_cycle, 'renewal_date', s.renewal_date, 'status', s.status
      ) order by s.renewal_date nulls last)
      from public.organization_finance_subscriptions s where s.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'approvals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'approval_type', a.approval_type, 'reference_label', a.reference_label,
        'amount', a.amount, 'status', a.status, 'created_at', a.created_at
      ) order by a.created_at desc)
      from public.organization_finance_approvals a
      where a.organization_id = v_org_id and a.status like 'pending%' limit 30
    ), '[]'::jsonb),
    'budgets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'name', b.name, 'scope_type', b.scope_type,
        'amount_limit', b.amount_limit, 'amount_used', b.amount_used,
        'utilization_percent', case when b.amount_limit > 0 then round(b.amount_used / b.amount_limit * 100, 1) else 0 end,
        'warning_threshold_percent', b.warning_threshold_percent
      ))
      from public.organization_finance_budgets b where b.organization_id = v_org_id and b.is_active
    ), '[]'::jsonb),
    'forecasting', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', f.id, 'forecast_type', f.forecast_type, 'title', f.title,
        'period_label', f.period_label, 'projected_amount', f.projected_amount,
        'actual_amount', f.actual_amount, 'confidence', f.confidence
      ) order by f.generated_at desc)
      from public.organization_finance_forecasts f where f.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'vendors', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id, 'vendor_name', v.vendor_name, 'contact_email', v.contact_email,
        'contract_status', v.contract_status, 'payment_status', v.payment_status, 'renewal_date', v.renewal_date
      ) order by v.vendor_name)
      from public.organization_finance_vendors v where v.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'reports', jsonb_build_object(
      'revenue_growth_percent', coalesce((
        select round((
          (coalesce((select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start), 0)
           - coalesce((select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start - interval '1 month' and occurred_at < v_month_start), 0))
          / greatest(coalesce((select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start - interval '1 month' and occurred_at < v_month_start), 0), 1) * 100
        )::numeric, 1)
      ), 0),
      'expense_trend', coalesce((
        select sum(amount) from public.organization_finance_expenses
        where organization_id = v_org_id and expense_date >= v_month_start::date and status not in ('cancelled', 'rejected')
      ), 0),
      'profit_estimate', coalesce((
        select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= v_month_start
      ), 0) - coalesce((
        select sum(amount) from public.organization_finance_expenses
        where organization_id = v_org_id and expense_date >= v_month_start::date and status not in ('cancelled', 'rejected')
      ), 0),
      'scheduled_reports', coalesce((
        select jsonb_agg(jsonb_build_object('id', r.id, 'report_type', r.report_type, 'schedule', r.schedule, 'title', r.title))
        from public.organization_finance_scheduled_reports r where r.organization_id = v_org_id and r.is_active
      ), '[]'::jsonb)
    ),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'integration_key', i.integration_key, 'name', i.name, 'status', i.status
      ) order by i.name)
      from public.organization_finance_integrations i where i.organization_id = v_org_id
    ), '[]'::jsonb),
    'categories', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'category_key', c.category_key, 'name', c.name, 'category_type', c.category_type))
      from public.organization_finance_categories c where c.organization_id = v_org_id and c.is_active
    ), '[]'::jsonb),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_finance_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'invoice_statuses', jsonb_build_array('draft', 'sent', 'overdue', 'paid', 'cancelled'),
    'expense_statuses', jsonb_build_array('draft', 'submitted', 'approved', 'rejected', 'paid', 'cancelled'),
    'sections', jsonb_build_array(
      'overview', 'revenue', 'expenses', 'invoices', 'subscriptions', 'approvals', 'forecasting', 'reports', 'integrations'
    ),
    'routes', jsonb_build_object('finance', '/app/finance', 'billing', '/app/settings/billing')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_finance_operations_action(
  p_action_type text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_id uuid;
  v_expense public.organization_finance_expenses;
  v_invoice public.organization_finance_invoices;
begin
  v_org_id := public._fin519_org();
  if v_org_id is null then return jsonb_build_object('ok', false, 'error', 'organization_not_found'); end if;

  if p_action_type in (
    'create_expense', 'submit_expense', 'approve_expense', 'reject_expense',
    'create_invoice', 'send_invoice', 'mark_invoice_paid', 'cancel_invoice',
    'create_revenue', 'create_budget', 'update_budget', 'create_forecast',
    'add_vendor', 'create_subscription', 'approve_request', 'schedule_report'
  ) then
    perform public._irp_require_permission('finance.manage');
  else
    perform public._irp_require_permission('finance.view');
  end if;

  perform public._fin519_ensure_settings(v_org_id);

  if p_action_type = 'create_expense' then
    insert into public.organization_finance_expenses (
      organization_id, expense_number, vendor_name, category_key, amount, currency,
      expense_date, department_id, domain_id, owner_user_id, notes, status, approval_status
    ) values (
      v_org_id,
      coalesce(p_payload->>'expense_number', public._fin519_next_number(v_org_id, 'EXP', 'organization_finance_expenses')),
      coalesce(p_payload->>'vendor_name', ''),
      coalesce(p_payload->>'category_key', 'operations'),
      coalesce((p_payload->>'amount')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(nullif(p_payload->>'expense_date', '')::date, current_date),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      (select id from public.users where auth_user_id = auth.uid() limit 1),
      coalesce(p_payload->>'notes', ''),
      'draft', 'none'
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'expense_created', 'Expense created', p_payload);
    return jsonb_build_object('ok', true, 'expense_id', v_id);

  elsif p_action_type = 'submit_expense' then
    v_id := (p_payload->>'expense_id')::uuid;
    update public.organization_finance_expenses set
      status = 'submitted', approval_status = 'pending_manager', updated_at = now()
    where id = v_id and organization_id = v_org_id
    returning * into v_expense;

    insert into public.organization_finance_approvals (
      organization_id, approval_type, reference_id, reference_label, amount, status, requested_by_user_id
    ) values (
      v_org_id, 'expense', v_id, coalesce(v_expense.vendor_name, 'Expense'), v_expense.amount,
      'pending_manager', (select id from public.users where auth_user_id = auth.uid() limit 1)
    );
    perform public._fin519_log(v_org_id, 'expense_submitted', 'Expense submitted for approval', p_payload);
    return jsonb_build_object('ok', true, 'expense_id', v_id);

  elsif p_action_type = 'approve_expense' then
    v_id := (p_payload->>'expense_id')::uuid;
    update public.organization_finance_expenses set
      status = 'approved', approval_status = 'approved', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    update public.organization_finance_approvals set status = 'approved', resolved_at = now()
    where organization_id = v_org_id and reference_id = v_id and approval_type = 'expense';
    perform public._fin519_log(v_org_id, 'expense_approved', 'Expense approved', p_payload);
    return jsonb_build_object('ok', true, 'expense_id', v_id);

  elsif p_action_type = 'reject_expense' then
    v_id := (p_payload->>'expense_id')::uuid;
    update public.organization_finance_expenses set
      status = 'rejected', approval_status = 'rejected', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    update public.organization_finance_approvals set status = 'rejected', resolved_at = now()
    where organization_id = v_org_id and reference_id = v_id and approval_type = 'expense';
    perform public._fin519_log(v_org_id, 'expense_rejected', 'Expense rejected', p_payload);
    return jsonb_build_object('ok', true, 'expense_id', v_id);

  elsif p_action_type = 'create_invoice' then
    insert into public.organization_finance_invoices (
      organization_id, invoice_number, title, direction, customer_name, amount, currency,
      status, due_date, domain_id, business_pack_key, department_id
    ) values (
      v_org_id,
      coalesce(p_payload->>'invoice_number', public._fin519_next_number(v_org_id, 'INV', 'organization_finance_invoices')),
      coalesce(p_payload->>'title', 'Invoice'),
      coalesce(p_payload->>'direction', 'outgoing'),
      coalesce(p_payload->>'customer_name', ''),
      coalesce((p_payload->>'amount')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      'draft',
      nullif(p_payload->>'due_date', '')::date,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      nullif(p_payload->>'department_id', '')::uuid
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'invoice_created', 'Invoice created', p_payload);
    return jsonb_build_object('ok', true, 'invoice_id', v_id);

  elsif p_action_type = 'send_invoice' then
    v_id := (p_payload->>'invoice_id')::uuid;
    update public.organization_finance_invoices set status = 'sent', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._fin519_log(v_org_id, 'invoice_sent', 'Invoice sent', p_payload);
    return jsonb_build_object('ok', true, 'invoice_id', v_id);

  elsif p_action_type = 'mark_invoice_paid' then
    v_id := (p_payload->>'invoice_id')::uuid;
    update public.organization_finance_invoices set status = 'paid', paid_at = now(), updated_at = now()
    where id = v_id and organization_id = v_org_id returning * into v_invoice;

    insert into public.organization_finance_revenue_events (
      organization_id, revenue_number, title, category_key, amount, currency, source_type, occurred_at
    ) values (
      v_org_id,
      public._fin519_next_number(v_org_id, 'REV', 'organization_finance_revenue_events'),
      coalesce(v_invoice.title, 'Paid invoice'),
      'services', v_invoice.amount, v_invoice.currency, 'invoice', now()
    );
    perform public._fin519_log(v_org_id, 'invoice_paid', 'Invoice marked paid', p_payload);
    return jsonb_build_object('ok', true, 'invoice_id', v_id);

  elsif p_action_type = 'cancel_invoice' then
    v_id := (p_payload->>'invoice_id')::uuid;
    update public.organization_finance_invoices set status = 'cancelled', updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._fin519_log(v_org_id, 'invoice_cancelled', 'Invoice cancelled', p_payload);
    return jsonb_build_object('ok', true, 'invoice_id', v_id);

  elsif p_action_type = 'create_revenue' then
    insert into public.organization_finance_revenue_events (
      organization_id, revenue_number, title, category_key, amount, currency,
      revenue_type, source_type, domain_id, business_pack_key, department_id, occurred_at
    ) values (
      v_org_id,
      coalesce(p_payload->>'revenue_number', public._fin519_next_number(v_org_id, 'REV', 'organization_finance_revenue_events')),
      coalesce(p_payload->>'title', 'Revenue'),
      coalesce(p_payload->>'category_key', 'services'),
      coalesce((p_payload->>'amount')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'revenue_type', 'one_time'),
      coalesce(p_payload->>'source_type', 'service'),
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      nullif(p_payload->>'department_id', '')::uuid,
      coalesce(nullif(p_payload->>'occurred_at', '')::timestamptz, now())
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'revenue_recorded', 'Revenue recorded', p_payload);
    return jsonb_build_object('ok', true, 'revenue_id', v_id);

  elsif p_action_type = 'create_budget' then
    insert into public.organization_finance_budgets (
      organization_id, budget_key, name, scope_type, department_id, domain_id,
      business_pack_key, amount_limit, currency, warning_threshold_percent
    ) values (
      v_org_id,
      coalesce(p_payload->>'budget_key', 'budget-' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'name', 'Budget'),
      coalesce(p_payload->>'scope_type', 'department'),
      nullif(p_payload->>'department_id', '')::uuid,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce((p_payload->>'amount_limit')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce((p_payload->>'warning_threshold_percent')::integer, 80)
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'budget_created', 'Budget created', p_payload);
    return jsonb_build_object('ok', true, 'budget_id', v_id);

  elsif p_action_type = 'update_budget' then
    v_id := (p_payload->>'budget_id')::uuid;
    update public.organization_finance_budgets set
      amount_limit = coalesce((p_payload->>'amount_limit')::numeric, amount_limit),
      amount_used = coalesce((p_payload->>'amount_used')::numeric, amount_used),
      updated_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._fin519_log(v_org_id, 'budget_updated', 'Budget updated', p_payload);
    return jsonb_build_object('ok', true, 'budget_id', v_id);

  elsif p_action_type = 'create_forecast' then
    insert into public.organization_finance_forecasts (
      organization_id, forecast_type, title, period_label, projected_amount, actual_amount, confidence
    ) values (
      v_org_id,
      coalesce(p_payload->>'forecast_type', 'revenue'),
      coalesce(p_payload->>'title', 'Forecast'),
      coalesce(p_payload->>'period_label', to_char(now(), 'YYYY-MM')),
      coalesce((p_payload->>'projected_amount')::numeric, 0),
      nullif(p_payload->>'actual_amount', '')::numeric,
      coalesce(p_payload->>'confidence', 'moderate')
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'forecast_generated', 'Forecast generated', p_payload);
    return jsonb_build_object('ok', true, 'forecast_id', v_id);

  elsif p_action_type = 'add_vendor' then
    insert into public.organization_finance_vendors (
      organization_id, vendor_name, contact_email, contact_phone, contract_status, renewal_date, performance_notes
    ) values (
      v_org_id,
      coalesce(p_payload->>'vendor_name', 'Vendor'),
      coalesce(p_payload->>'contact_email', ''),
      coalesce(p_payload->>'contact_phone', ''),
      coalesce(p_payload->>'contract_status', 'active'),
      nullif(p_payload->>'renewal_date', '')::date,
      coalesce(p_payload->>'performance_notes', '')
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'vendor_added', 'Vendor added', p_payload);
    return jsonb_build_object('ok', true, 'vendor_id', v_id);

  elsif p_action_type = 'create_subscription' then
    insert into public.organization_finance_subscriptions (
      organization_id, vendor_name, service_name, subscription_type, amount, currency,
      billing_cycle, renewal_date, domain_id, business_pack_key, notes
    ) values (
      v_org_id,
      coalesce(p_payload->>'vendor_name', ''),
      coalesce(p_payload->>'service_name', 'Subscription'),
      coalesce(p_payload->>'subscription_type', 'third_party'),
      coalesce((p_payload->>'amount')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'billing_cycle', 'monthly'),
      nullif(p_payload->>'renewal_date', '')::date,
      nullif(p_payload->>'domain_id', '')::uuid,
      p_payload->>'business_pack_key',
      coalesce(p_payload->>'notes', '')
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'subscription_created', 'Subscription tracked', p_payload);
    return jsonb_build_object('ok', true, 'subscription_id', v_id);

  elsif p_action_type = 'approve_request' then
    v_id := (p_payload->>'approval_id')::uuid;
    update public.organization_finance_approvals set status = 'approved', resolved_at = now()
    where id = v_id and organization_id = v_org_id;
    perform public._fin519_log(v_org_id, 'approval_granted', 'Approval granted', p_payload);
    return jsonb_build_object('ok', true, 'approval_id', v_id);

  elsif p_action_type = 'schedule_report' then
    insert into public.organization_finance_scheduled_reports (
      organization_id, report_type, schedule, title, next_run_at
    ) values (
      v_org_id,
      coalesce(p_payload->>'report_type', 'executive'),
      coalesce(p_payload->>'schedule', 'monthly'),
      coalesce(p_payload->>'title', 'Scheduled report'),
      now() + interval '7 days'
    ) returning id into v_id;
    perform public._fin519_log(v_org_id, 'report_scheduled', 'Report scheduled', p_payload);
    return jsonb_build_object('ok', true, 'report_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_finance_operations_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_month_start timestamptz := date_trunc('month', now());
begin
  perform public._irp_require_permission('finance.view');
  v_org_id := public._fin519_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify organizes financial operations. Accounting systems remain the source of truth.',
    'expenses_this_month', coalesce((
      select sum(amount) from public.organization_finance_expenses
      where organization_id = v_org_id and expense_date >= v_month_start::date and status not in ('cancelled', 'rejected')
    ), 0),
    'overdue_invoices', (select count(*) from public.organization_finance_invoices where organization_id = v_org_id and status = 'overdue'),
    'pending_approvals', (select count(*) from public.organization_finance_approvals where organization_id = v_org_id and status like 'pending%'),
    'budgets_exceeded', (
      select count(*) from public.organization_finance_budgets
      where organization_id = v_org_id and is_active and amount_limit > 0 and amount_used > amount_limit
    ),
    'subscription_renewals_30d', (
      select count(*) from public.organization_finance_subscriptions
      where organization_id = v_org_id and renewal_date between current_date and current_date + 30
    ),
    'companion_prompts', jsonb_build_array(
      'Show expenses this month.',
      'Which invoices are overdue?',
      'Show revenue forecast.',
      'Which departments exceeded budget?',
      'Generate executive finance summary.'
    ),
    'finance_route', '/app/finance'
  );
end; $$;

create or replace function public.get_my_finance_operations_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._irp_require_permission('finance.view');
  v_org_id := public._fin519_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('finance.manage', v_org_id),
    'pending_approvals', (select count(*) from public.organization_finance_approvals where organization_id = v_org_id and status like 'pending%'),
    'overdue_invoices', (select count(*) from public.organization_finance_invoices where organization_id = v_org_id and status = 'overdue'),
    'financial_health', (
      select case
        when coalesce((select sum(amount) from public.organization_finance_revenue_events where organization_id = v_org_id and occurred_at >= date_trunc('month', now())), 0)
          >= coalesce((select sum(amount) from public.organization_finance_expenses where organization_id = v_org_id and expense_date >= date_trunc('month', now())::date and status not in ('cancelled', 'rejected')), 0)
        then 'healthy' else 'attention'
      end
    ),
    'routes', jsonb_build_object('finance', '/app/finance')
  );
exception when others then
  return jsonb_build_object('found', true, 'can_manage', false, 'routes', jsonb_build_object('finance', '/app/finance'));
end; $$;

-- Module registry & permissions
do $$ begin
  perform public._mre501_seed_module(
    'finance_operations', 'Finance Operations', 'finance_operations', 'finance',
    'Revenue, expenses, invoices, budgets, forecasts, and financial visibility for the organization.',
    'starter', null, 'finance', '/app/finance', 'licensed', 5
  );
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('finance_operations', 'finance.view', 'view', 'Finance — view financial operations and reports'),
    ('finance_operations', 'finance.manage', 'manage', 'Finance — create expenses, invoices, budgets, and approve financial requests')
  on conflict (permission_key) do nothing;
exception when others then
  insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
  values
    ('finance_operations', 'finance.view', 'view', 'Finance — view financial operations and reports'),
    ('finance_operations', 'finance.manage', 'manage', 'Finance — create expenses, invoices, budgets, and approve financial requests')
  on conflict (permission_key) do nothing;
end $$;

grant execute on function public.get_finance_operations_center(text) to authenticated;
grant execute on function public.perform_finance_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_finance_operations_context() to authenticated;
grant execute on function public.get_my_finance_operations_summary() to authenticated;
