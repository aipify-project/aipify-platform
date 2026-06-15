-- Phase 285 — Growth Partner Performance & Commission Center

-- ---------------------------------------------------------------------------
-- 1. Global settings (Super Admin)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_global_settings (
  id uuid primary key default gen_random_uuid(),
  leaderboard_enabled boolean not null default false,
  monthly_payout_day integer not null default 15 check (monthly_payout_day between 1 and 28),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_performance_global_settings enable row level security;
revoke all on public.growth_partner_performance_global_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Partner settings
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  partner_status text not null default 'active' check (
    partner_status in ('active', 'suspended', 'on_review')
  ),
  certification_level text not null default 'foundational' check (
    certification_level in ('foundational', 'professional', 'enterprise', 'master')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_performance_settings enable row level security;
revoke all on public.growth_partner_performance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Customer portfolio
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_portfolio (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  company_name text not null,
  plan_key text not null default 'professional',
  onboarding_status text not null default 'in_progress' check (
    onboarding_status in ('not_started', 'in_progress', 'completed', 'at_risk')
  ),
  subscription_status text not null default 'active' check (
    subscription_status in ('trial', 'active', 'paused', 'cancelled', 'churned')
  ),
  last_activity_at timestamptz,
  renewal_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_performance_portfolio_tenant_idx
  on public.growth_partner_performance_portfolio (tenant_id, subscription_status);

alter table public.growth_partner_performance_portfolio enable row level security;
revoke all on public.growth_partner_performance_portfolio from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Performance metrics (period snapshots)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  period_key text not null default to_char(now(), 'YYYY-MM'),
  leads_generated integer not null default 0,
  demonstrations_completed integer not null default 0,
  customers_converted integer not null default 0,
  trial_to_paid_conversions integer not null default 0,
  retention_rate numeric(5, 2) not null default 0 check (retention_rate between 0 and 100),
  expansion_revenue numeric(12, 2) not null default 0,
  monthly_revenue_generated numeric(12, 2) not null default 0,
  conversion_rate numeric(5, 2) not null default 0 check (conversion_rate between 0 and 100),
  unique (tenant_id, period_key)
);

create index if not exists growth_partner_performance_metrics_tenant_idx
  on public.growth_partner_performance_metrics (tenant_id, period_key desc);

alter table public.growth_partner_performance_metrics enable row level security;
revoke all on public.growth_partner_performance_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Commissions
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_commissions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  portfolio_id uuid references public.growth_partner_performance_portfolio (id) on delete set null,
  customer_name text not null,
  plan_key text not null default 'professional',
  commission_type text not null default 'recurring' check (
    commission_type in ('initial', 'recurring', 'expansion', 'bonus', 'adjustment')
  ),
  amount numeric(12, 2) not null default 0,
  status text not null default 'pending_validation' check (
    status in (
      'pending_validation', 'approved', 'scheduled', 'paid', 'on_hold', 'rejected'
    )
  ),
  expected_payout_date date,
  payment_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_performance_commissions_tenant_idx
  on public.growth_partner_performance_commissions (tenant_id, status, expected_payout_date);

alter table public.growth_partner_performance_commissions enable row level security;
revoke all on public.growth_partner_performance_commissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Payouts
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_payouts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  payout_period text not null,
  total_amount numeric(12, 2) not null default 0,
  commission_count integer not null default 0,
  status text not null default 'completed' check (
    status in ('scheduled', 'processing', 'completed', 'failed')
  ),
  payment_notes text not null default '',
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_performance_payouts_tenant_idx
  on public.growth_partner_performance_payouts (tenant_id, paid_at desc);

alter table public.growth_partner_performance_payouts enable row level security;
revoke all on public.growth_partner_performance_payouts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Goals (Super Admin defined)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_goals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  goal_period text not null check (goal_period in ('monthly', 'quarterly', 'annual')),
  period_key text not null,
  metric_key text not null check (
    metric_key in (
      'leads_generated', 'customers_converted', 'monthly_revenue_generated',
      'retention_rate', 'expansion_revenue'
    )
  ),
  target_value numeric(12, 2) not null,
  current_value numeric(12, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, goal_period, period_key, metric_key)
);

create index if not exists growth_partner_performance_goals_tenant_idx
  on public.growth_partner_performance_goals (tenant_id, goal_period, period_key);

alter table public.growth_partner_performance_goals enable row level security;
revoke all on public.growth_partner_performance_goals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Certifications
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_certifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  certification_level text not null default 'foundational',
  status text not null default 'active' check (
    status in ('active', 'renewal_required', 'expired', 'suspended')
  ),
  issued_at date not null default current_date,
  expires_at date,
  renewal_requirement text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists growth_partner_performance_certifications_tenant_idx
  on public.growth_partner_performance_certifications (tenant_id, status, expires_at);

alter table public.growth_partner_performance_certifications enable row level security;
revoke all on public.growth_partner_performance_certifications from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Alerts
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'certification_expiring', 'renewal_upcoming', 'commission_approved',
      'customer_risk', 'payout_scheduled', 'goal_milestone'
    )
  ),
  title text not null,
  summary text not null,
  severity text not null default 'informational' check (
    severity in ('informational', 'important', 'action_required')
  ),
  acknowledged_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_performance_alerts_tenant_idx
  on public.growth_partner_performance_alerts (tenant_id, acknowledged_at, created_at desc);

alter table public.growth_partner_performance_alerts enable row level security;
revoke all on public.growth_partner_performance_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 10. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_performance_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'commission_approved', 'commission_adjusted', 'commission_paid',
      'goal_modified', 'certification_renewed', 'partner_suspended',
      'partner_reactivated', 'payout_override', 'export_generated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_performance_audit_created_idx
  on public.growth_partner_performance_audit_logs (created_at desc);

alter table public.growth_partner_performance_audit_logs enable row level security;
revoke all on public.growth_partner_performance_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 11. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._gppc285_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then
    raise exception 'Not authorized';
  end if;
end; $$;

create or replace function public._gppc285_resolve_tenant()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin
  return public._presence_tenant_for_auth();
end; $$;

create or replace function public._gppc285_current_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_user_id;
end; $$;

create or replace function public._gppc285_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_performance_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gppc285_ensure_global_settings()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.growth_partner_performance_global_settings limit 1) then
    insert into public.growth_partner_performance_global_settings (leaderboard_enabled) values (false);
  end if;
end; $$;

create or replace function public._gppc285_seed_partner(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_portfolio_a uuid;
  v_portfolio_b uuid;
  v_period text := to_char(now(), 'YYYY-MM');
begin
  if p_tenant_id is null then return; end if;

  insert into public.growth_partner_performance_settings (tenant_id, partner_status, certification_level)
  values (p_tenant_id, 'active', 'professional')
  on conflict (tenant_id) do nothing;

  if exists (select 1 from public.growth_partner_performance_portfolio where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.growth_partner_performance_portfolio (
    tenant_id, company_name, plan_key, onboarding_status, subscription_status,
    last_activity_at, renewal_date
  ) values (
    p_tenant_id, 'Nordic Retail Group', 'business', 'completed', 'active',
    now() - interval '2 days', (current_date + interval '90 days')::date
  ) returning id into v_portfolio_a;

  insert into public.growth_partner_performance_portfolio (
    tenant_id, company_name, plan_key, onboarding_status, subscription_status,
    last_activity_at, renewal_date
  ) values (
    p_tenant_id, 'Bergen Logistics AS', 'professional', 'in_progress', 'trial',
    now() - interval '5 days', (current_date + interval '30 days')::date
  ) returning id into v_portfolio_b;

  insert into public.growth_partner_performance_metrics (
    tenant_id, period_key, leads_generated, demonstrations_completed,
    customers_converted, trial_to_paid_conversions, retention_rate,
    expansion_revenue, monthly_revenue_generated, conversion_rate
  ) values (
    p_tenant_id, v_period, 24, 12, 6, 4, 92.5, 18500, 42800, 25.0
  ) on conflict (tenant_id, period_key) do nothing;

  insert into public.growth_partner_performance_commissions (
    tenant_id, portfolio_id, customer_name, plan_key, commission_type,
    amount, status, expected_payout_date
  ) values
    (p_tenant_id, v_portfolio_a, 'Nordic Retail Group', 'business', 'recurring', 1250.00, 'approved', (current_date + interval '14 days')::date),
    (p_tenant_id, v_portfolio_b, 'Bergen Logistics AS', 'professional', 'initial', 890.00, 'pending_validation', (current_date + interval '21 days')::date),
    (p_tenant_id, v_portfolio_a, 'Nordic Retail Group', 'business', 'expansion', 420.00, 'paid', (current_date - interval '15 days')::date);

  insert into public.growth_partner_performance_payouts (
    tenant_id, payout_period, total_amount, commission_count, status, payment_notes, paid_at
  ) values (
    p_tenant_id, to_char(now() - interval '1 month', 'YYYY-MM'), 2340.00, 3, 'completed',
    'Monthly payout — verified by finance.', now() - interval '20 days'
  );

  insert into public.growth_partner_performance_goals (
    tenant_id, goal_period, period_key, metric_key, target_value, current_value
  ) values
    (p_tenant_id, 'monthly', v_period, 'customers_converted', 8, 6),
    (p_tenant_id, 'monthly', v_period, 'monthly_revenue_generated', 50000, 42800),
    (p_tenant_id, 'quarterly', to_char(now(), 'YYYY') || '-Q' || ceil(extract(month from now()) / 3)::int, 'retention_rate', 90, 92.5)
  on conflict (tenant_id, goal_period, period_key, metric_key) do nothing;

  select u.id into v_user_id from public.users u
  where u.company_id = p_tenant_id limit 1;

  if v_user_id is not null then
    insert into public.growth_partner_performance_certifications (
      tenant_id, user_id, certification_level, status, issued_at, expires_at, renewal_requirement
    ) values (
      p_tenant_id, v_user_id, 'professional', 'active',
      (current_date - interval '180 days')::date,
      (current_date + interval '185 days')::date,
      'Complete annual Growth Partner refresher course.'
    ) on conflict (tenant_id, user_id) do nothing;
  end if;

  insert into public.growth_partner_performance_alerts (
    tenant_id, alert_type, title, summary, severity
  ) values
    (p_tenant_id, 'commission_approved', 'Commission approved',
     'Recurring commission for Nordic Retail Group has been approved.', 'informational'),
    (p_tenant_id, 'renewal_upcoming', 'Customer renewal upcoming',
     'Bergen Logistics AS trial converts in 30 days — prepare onboarding review.', 'important');
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Overview RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_partner_performance_center(
  p_surface text default 'partner',
  p_partner_tenant_id uuid default null
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_overview jsonb;
  v_portfolio jsonb;
  v_metrics jsonb;
  v_commission_summary jsonb;
  v_commissions jsonb;
  v_payouts jsonb;
  v_goals jsonb;
  v_certification jsonb;
  v_alerts jsonb;
  v_audit jsonb;
  v_leaderboard jsonb;
  v_partners jsonb;
  v_global jsonb;
  v_principle text := 'Growth Partners are trusted representatives — not affiliates.';
begin
  perform public._gppc285_ensure_global_settings();
  v_user_id := public._gppc285_current_user_id();

  select jsonb_build_object(
    'leaderboard_enabled', gs.leaderboard_enabled,
    'monthly_payout_day', gs.monthly_payout_day
  ) into v_global
  from public.growth_partner_performance_global_settings gs limit 1;

  if p_surface = 'super' then
    perform public._gppc285_require_super_admin();
    v_tenant_id := p_partner_tenant_id;

    if v_tenant_id is not null then
      perform public._gppc285_seed_partner(v_tenant_id);
    end if;

    select coalesce(jsonb_agg(jsonb_build_object(
      'tenant_id', s.tenant_id,
      'partner_status', s.partner_status,
      'certification_level', s.certification_level,
      'active_customers', (
        select count(*)::int from public.growth_partner_performance_portfolio p
        where p.tenant_id = s.tenant_id and p.subscription_status in ('trial', 'active')
      ),
      'pending_commissions', (
        select coalesce(sum(c.amount), 0) from public.growth_partner_performance_commissions c
        where c.tenant_id = s.tenant_id and c.status in ('pending_validation', 'approved', 'scheduled')
      ),
      'monthly_revenue', (
        select coalesce(m.monthly_revenue_generated, 0) from public.growth_partner_performance_metrics m
        where m.tenant_id = s.tenant_id order by m.period_key desc limit 1
      )
    ) order by s.updated_at desc), '[]'::jsonb)
    into v_partners
    from public.growth_partner_performance_settings s;

    if v_tenant_id is null and jsonb_array_length(coalesce(v_partners, '[]'::jsonb)) > 0 then
      v_tenant_id := (v_partners->0->>'tenant_id')::uuid;
      perform public._gppc285_seed_partner(v_tenant_id);
    end if;
  elsif p_surface = 'partner' then
    v_tenant_id := public._gppc285_resolve_tenant();
    if v_tenant_id is null or v_user_id is null then
      return jsonb_build_object('has_access', false);
    end if;
    perform public._gppc285_seed_partner(v_tenant_id);
  else
    raise exception 'Unknown surface';
  end if;

  if v_tenant_id is null then
    return jsonb_build_object(
      'has_access', true,
      'surface', p_surface,
      'global', v_global,
      'partners', coalesce(v_partners, '[]'::jsonb),
      'principle', v_principle
    );
  end if;

  v_overview := jsonb_build_object(
    'active_customers', (
      select count(*)::int from public.growth_partner_performance_portfolio p
      where p.tenant_id = v_tenant_id and p.subscription_status in ('trial', 'active')
    ),
    'monthly_revenue_generated', coalesce((
      select m.monthly_revenue_generated from public.growth_partner_performance_metrics m
      where m.tenant_id = v_tenant_id order by m.period_key desc limit 1
    ), 0),
    'pending_commissions', coalesce((
      select sum(c.amount) from public.growth_partner_performance_commissions c
      where c.tenant_id = v_tenant_id and c.status in ('pending_validation', 'approved', 'scheduled')
    ), 0),
    'paid_commissions', coalesce((
      select sum(c.amount) from public.growth_partner_performance_commissions c
      where c.tenant_id = v_tenant_id and c.status = 'paid'
    ), 0),
    'conversion_rate', coalesce((
      select m.conversion_rate from public.growth_partner_performance_metrics m
      where m.tenant_id = v_tenant_id order by m.period_key desc limit 1
    ), 0),
    'certification_status', coalesce((
      select c.status from public.growth_partner_performance_certifications c
      where c.tenant_id = v_tenant_id and c.user_id = v_user_id limit 1
    ), (select s.certification_level from public.growth_partner_performance_settings s where s.tenant_id = v_tenant_id limit 1), 'active')
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'company_name', p.company_name, 'plan_key', p.plan_key,
    'onboarding_status', p.onboarding_status, 'subscription_status', p.subscription_status,
    'last_activity_at', p.last_activity_at, 'renewal_date', p.renewal_date
  ) order by p.company_name), '[]'::jsonb)
  into v_portfolio
  from public.growth_partner_performance_portfolio p
  where p.tenant_id = v_tenant_id;

  select jsonb_build_object(
    'leads_generated', coalesce(m.leads_generated, 0),
    'demonstrations_completed', coalesce(m.demonstrations_completed, 0),
    'customers_converted', coalesce(m.customers_converted, 0),
    'trial_to_paid_conversions', coalesce(m.trial_to_paid_conversions, 0),
    'retention_rate', coalesce(m.retention_rate, 0),
    'expansion_revenue', coalesce(m.expansion_revenue, 0)
  ) into v_metrics
  from public.growth_partner_performance_metrics m
  where m.tenant_id = v_tenant_id
  order by m.period_key desc
  limit 1;

  v_commission_summary := jsonb_build_object(
    'pending', coalesce((select sum(amount) from public.growth_partner_performance_commissions where tenant_id = v_tenant_id and status in ('pending_validation', 'approved', 'scheduled')), 0),
    'approved', coalesce((select sum(amount) from public.growth_partner_performance_commissions where tenant_id = v_tenant_id and status = 'approved'), 0),
    'paid', coalesce((select sum(amount) from public.growth_partner_performance_commissions where tenant_id = v_tenant_id and status = 'paid'), 0),
    'disputed', coalesce((select sum(amount) from public.growth_partner_performance_commissions where tenant_id = v_tenant_id and status in ('on_hold', 'rejected')), 0)
  );

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'customer_name', c.customer_name, 'plan_key', c.plan_key,
    'commission_type', c.commission_type, 'amount', c.amount, 'status', c.status,
    'expected_payout_date', c.expected_payout_date, 'payment_notes', c.payment_notes
  ) order by c.expected_payout_date nulls last), '[]'::jsonb)
  into v_commissions
  from public.growth_partner_performance_commissions c
  where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', py.id, 'payout_period', py.payout_period, 'total_amount', py.total_amount,
    'commission_count', py.commission_count, 'status', py.status,
    'payment_notes', py.payment_notes, 'paid_at', py.paid_at
  ) order by py.paid_at desc nulls last), '[]'::jsonb)
  into v_payouts
  from public.growth_partner_performance_payouts py
  where py.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'goal_period', g.goal_period, 'period_key', g.period_key,
    'metric_key', g.metric_key, 'target_value', g.target_value,
    'current_value', g.current_value,
    'progress_pct', round(100.0 * g.current_value / nullif(g.target_value, 0), 1)
  ) order by g.goal_period, g.metric_key), '[]'::jsonb)
  into v_goals
  from public.growth_partner_performance_goals g
  where g.tenant_id = v_tenant_id;

  select jsonb_build_object(
    'certification_level', c.certification_level,
    'status', c.status,
    'issued_at', c.issued_at,
    'expires_at', c.expires_at,
    'renewal_requirement', c.renewal_requirement
  ) into v_certification
  from public.growth_partner_performance_certifications c
  where c.tenant_id = v_tenant_id and (v_user_id is null or c.user_id = v_user_id)
  limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'alert_type', a.alert_type, 'title', a.title,
    'summary', a.summary, 'severity', a.severity, 'created_at', a.created_at,
    'acknowledged', a.acknowledged_at is not null
  ) order by a.created_at desc), '[]'::jsonb)
  into v_alerts
  from public.growth_partner_performance_alerts a
  where a.tenant_id = v_tenant_id and a.acknowledged_at is null
  limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', al.id, 'event_type', al.event_type, 'summary', al.summary, 'created_at', al.created_at
  ) order by al.created_at desc), '[]'::jsonb)
  into v_audit
  from public.growth_partner_performance_audit_logs al
  where al.tenant_id = v_tenant_id or (p_surface = 'super' and al.tenant_id is null)
  limit 15;

  if coalesce((v_global->>'leaderboard_enabled')::boolean, false) then
    select coalesce(jsonb_agg(entry order by (entry->>'conversion_rate')::numeric desc), '[]'::jsonb)
    into v_leaderboard
    from (
      select jsonb_build_object(
        'tenant_id', s.tenant_id,
        'certification_level', s.certification_level,
        'conversion_rate', coalesce(m.conversion_rate, 0),
        'retention_rate', coalesce(m.retention_rate, 0),
        'customers_converted', coalesce(m.customers_converted, 0)
      ) as entry
      from public.growth_partner_performance_settings s
      left join lateral (
        select * from public.growth_partner_performance_metrics mm
        where mm.tenant_id = s.tenant_id order by mm.period_key desc limit 1
      ) m on true
      where s.partner_status = 'active'
      limit 10
    ) ranked;
  else
    v_leaderboard := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'tenant_id', v_tenant_id,
    'global', v_global,
    'overview', v_overview,
    'portfolio', coalesce(v_portfolio, '[]'::jsonb),
    'metrics', coalesce(v_metrics, '{}'::jsonb),
    'commission_summary', v_commission_summary,
    'commissions', coalesce(v_commissions, '[]'::jsonb),
    'payouts', coalesce(v_payouts, '[]'::jsonb),
    'goals', coalesce(v_goals, '[]'::jsonb),
    'certification', coalesce(v_certification, '{}'::jsonb),
    'alerts', coalesce(v_alerts, '[]'::jsonb),
    'audit', coalesce(v_audit, '[]'::jsonb),
    'leaderboard', coalesce(v_leaderboard, '[]'::jsonb),
    'partners', coalesce(v_partners, '[]'::jsonb),
    'partner_status', (select s.partner_status from public.growth_partner_performance_settings s where s.tenant_id = v_tenant_id),
    'principle', v_principle
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 13. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_growth_partner_performance_action(
  p_surface text default 'partner',
  p_action text default '',
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_commission_id uuid;
  v_amount numeric(12, 2);
  v_export jsonb;
  v_format text;
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);
  p_surface := coalesce(p_surface, 'partner');

  if p_surface = 'super' then
    perform public._gppc285_require_super_admin();
    v_tenant_id := nullif(p_payload->>'tenant_id', '')::uuid;
    if v_tenant_id is null then
      v_tenant_id := public._gppc285_resolve_tenant();
    end if;
  else
    v_tenant_id := public._gppc285_resolve_tenant();
  end if;

  if v_tenant_id is null then
    raise exception 'Tenant required';
  end if;

  if p_action = 'export' then
    v_format := coalesce(p_payload->>'format', 'csv');
    v_export := jsonb_build_object(
      'format', v_format,
      'generated_at', now(),
      'tenant_id', v_tenant_id,
      'sections', jsonb_build_array('overview', 'portfolio', 'commissions', 'payouts', 'metrics')
    );
    perform public._gppc285_log_audit(
      v_tenant_id, 'export_generated',
      format('Performance export generated (%s)', v_format),
      jsonb_build_object('format', v_format)
    );
    return jsonb_build_object('ok', true, 'export', v_export);
  end if;

  if p_action = 'acknowledge_alert' then
    update public.growth_partner_performance_alerts
    set acknowledged_at = now()
    where id = nullif(p_payload->>'alert_id', '')::uuid
      and tenant_id = v_tenant_id;
    return jsonb_build_object('ok', true);
  end if;

  if p_surface <> 'super' then
    raise exception 'Action requires Super Admin authorization';
  end if;

  if p_action = 'approve_commission' then
    v_commission_id := nullif(p_payload->>'commission_id', '')::uuid;
    update public.growth_partner_performance_commissions
    set status = 'approved', updated_at = now()
    where id = v_commission_id and tenant_id = v_tenant_id;
    perform public._gppc285_log_audit(v_tenant_id, 'commission_approved', 'Commission approved by Super Admin.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'adjust_commission' then
    v_commission_id := nullif(p_payload->>'commission_id', '')::uuid;
    v_amount := coalesce((p_payload->>'amount')::numeric, 0);
    update public.growth_partner_performance_commissions
    set amount = v_amount,
        commission_type = coalesce(p_payload->>'commission_type', 'adjustment'),
        payment_notes = coalesce(p_payload->>'payment_notes', payment_notes),
        updated_at = now()
    where id = v_commission_id and tenant_id = v_tenant_id;
    perform public._gppc285_log_audit(v_tenant_id, 'commission_adjusted', 'Commission adjusted by Super Admin.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'pay_commission' then
    v_commission_id := nullif(p_payload->>'commission_id', '')::uuid;
    update public.growth_partner_performance_commissions
    set status = 'paid', updated_at = now()
    where id = v_commission_id and tenant_id = v_tenant_id;
    perform public._gppc285_log_audit(v_tenant_id, 'commission_paid', 'Commission marked paid.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'suspend_partner' then
    update public.growth_partner_performance_settings
    set partner_status = 'suspended', updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gppc285_log_audit(v_tenant_id, 'partner_suspended', 'Partner status suspended.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'reactivate_partner' then
    update public.growth_partner_performance_settings
    set partner_status = 'active', updated_at = now()
    where tenant_id = v_tenant_id;
    perform public._gppc285_log_audit(v_tenant_id, 'partner_reactivated', 'Partner reactivated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'set_goal' then
    insert into public.growth_partner_performance_goals (
      tenant_id, goal_period, period_key, metric_key, target_value, current_value
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'goal_period', 'monthly'),
      coalesce(p_payload->>'period_key', to_char(now(), 'YYYY-MM')),
      coalesce(p_payload->>'metric_key', 'customers_converted'),
      coalesce((p_payload->>'target_value')::numeric, 0),
      coalesce((p_payload->>'current_value')::numeric, 0)
    )
    on conflict (tenant_id, goal_period, period_key, metric_key)
    do update set
      target_value = excluded.target_value,
      current_value = excluded.current_value,
      updated_at = now();
    perform public._gppc285_log_audit(v_tenant_id, 'goal_modified', 'Performance goal updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'toggle_leaderboard' then
    update public.growth_partner_performance_global_settings
    set leaderboard_enabled = coalesce((p_payload->>'enabled')::boolean, not leaderboard_enabled),
        updated_at = now();
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action;
end; $$;

revoke all on function public.get_growth_partner_performance_center(text, uuid) from public;
revoke all on function public.record_growth_partner_performance_action(text, text, jsonb) from public;
grant execute on function public.get_growth_partner_performance_center(text, uuid) to authenticated;
grant execute on function public.record_growth_partner_performance_action(text, text, jsonb) to authenticated;
