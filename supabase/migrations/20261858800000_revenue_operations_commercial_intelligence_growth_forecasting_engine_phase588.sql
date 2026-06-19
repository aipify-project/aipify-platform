-- Phase 588 — Revenue Operations, Commercial Intelligence & Growth Forecasting Engine
-- Feature owner: CUSTOMER APP + PLATFORM ADMIN
-- Routes: /app/revenue/* · /platform/revenue/*
-- Helpers: _roci588_*

create table if not exists public.organization_roci588_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  registry_enabled boolean not null default true,
  recurring_revenue_enabled boolean not null default true,
  attribution_enabled boolean not null default true,
  forecasting_enabled boolean not null default true,
  funnel_enabled boolean not null default true,
  customer_value_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_roci588_settings enable row level security;
revoke all on public.organization_roci588_settings from authenticated, anon;

create table if not exists public.organization_roci588_revenue_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  source_key text not null,
  source_title text not null,
  source_type text not null check (
    source_type in (
      'subscription', 'business_pack', 'domain', 'user_license',
      'professional_services', 'partner', 'enterprise', 'marketplace'
    )
  ),
  revenue_amount numeric(14,2) not null default 0,
  currency_code text not null default 'NOK',
  period_label text not null default 'monthly',
  trend_label text not null default 'stable',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, source_key)
);

alter table public.organization_roci588_revenue_registry enable row level security;
revoke all on public.organization_roci588_revenue_registry from authenticated, anon;

create table if not exists public.organization_roci588_recurring_revenue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  snapshot_key text not null default 'current',
  mrr numeric(14,2) not null default 0,
  arr numeric(14,2) not null default 0,
  expansion_revenue numeric(14,2) not null default 0,
  contraction_revenue numeric(14,2) not null default 0,
  churn_revenue numeric(14,2) not null default 0,
  net_revenue_retention_pct numeric(6,2) not null default 100,
  summary text not null default '' check (char_length(summary) <= 500),
  recorded_at timestamptz not null default now(),
  unique (organization_id, snapshot_key)
);

alter table public.organization_roci588_recurring_revenue enable row level security;
revoke all on public.organization_roci588_recurring_revenue from authenticated, anon;

create table if not exists public.organization_roci588_attribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  attribution_key text not null,
  attribution_title text not null,
  attribution_type text not null check (
    attribution_type in (
      'customer_source', 'growth_partner', 'campaign', 'referral', 'organic', 'direct'
    )
  ),
  revenue_amount numeric(14,2) not null default 0,
  share_pct integer not null default 0 check (share_pct between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, attribution_key)
);

alter table public.organization_roci588_attribution enable row level security;
revoke all on public.organization_roci588_attribution from authenticated, anon;

create table if not exists public.organization_roci588_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null default 'current',
  health_status text not null default 'stable' check (
    health_status in ('strong_growth', 'stable', 'watch_closely', 'revenue_risk')
  ),
  growth_rate_pct numeric(6,2) not null default 0,
  retention_pct numeric(6,2) not null default 0,
  expansion_pct numeric(6,2) not null default 0,
  churn_pct numeric(6,2) not null default 0,
  renewal_pct numeric(6,2) not null default 0,
  health_score integer not null default 75 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_roci588_health enable row level security;
revoke all on public.organization_roci588_health from authenticated, anon;

create table if not exists public.organization_roci588_churn_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_key text not null,
  signal_title text not null,
  signal_type text not null check (
    signal_type in (
      'declining_usage', 'low_adoption', 'renewal_risk', 'customer_friction', 'payment_problem'
    )
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  signal_status text not null default 'open' check (signal_status in ('open', 'acknowledged', 'resolved')),
  companion_recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, signal_key)
);

alter table public.organization_roci588_churn_signals enable row level security;
revoke all on public.organization_roci588_churn_signals from authenticated, anon;

create table if not exists public.organization_roci588_expansion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  expansion_key text not null,
  expansion_title text not null,
  expansion_type text not null check (
    expansion_type in (
      'additional_users', 'additional_domains', 'business_pack',
      'enterprise_upgrade', 'professional_services'
    )
  ),
  forecast_revenue numeric(14,2) not null default 0,
  expansion_status text not null default 'open' check (
    expansion_status in ('open', 'in_progress', 'won', 'dismissed')
  ),
  recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, expansion_key)
);

alter table public.organization_roci588_expansion enable row level security;
revoke all on public.organization_roci588_expansion from authenticated, anon;

create table if not exists public.organization_roci588_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_key text not null,
  horizon text not null check (horizon in ('30d', '90d', '6mo', '12mo')),
  expected_revenue numeric(14,2) not null default 0,
  risk_adjusted_revenue numeric(14,2) not null default 0,
  best_case_revenue numeric(14,2) not null default 0,
  conservative_revenue numeric(14,2) not null default 0,
  confidence text not null default 'moderate',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, forecast_key)
);

alter table public.organization_roci588_forecasts enable row level security;
revoke all on public.organization_roci588_forecasts from authenticated, anon;

create table if not exists public.organization_roci588_funnel_stages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  stage_key text not null,
  stage_title text not null,
  stage_count integer not null default 0,
  conversion_pct integer not null default 0 check (conversion_pct between 0 and 100),
  sort_order integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, stage_key)
);

alter table public.organization_roci588_funnel_stages enable row level security;
revoke all on public.organization_roci588_funnel_stages from authenticated, anon;

create table if not exists public.organization_roci588_customer_value (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(14,2) not null default 0,
  value_unit text not null default 'NOK',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, metric_key)
);

alter table public.organization_roci588_customer_value enable row level security;
revoke all on public.organization_roci588_customer_value from authenticated, anon;

create table if not exists public.organization_roci588_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  pack_revenue numeric(14,2) not null default 0,
  adoption_pct integer not null default 0 check (adoption_pct between 0 and 100),
  expansion_opportunity text not null default '',
  retention_signal text not null default 'stable',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_roci588_business_packs enable row level security;
revoke all on public.organization_roci588_business_packs from authenticated, anon;

create table if not exists public.organization_roci588_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  subscription_key text not null,
  customer_label text not null,
  plan_label text not null default '',
  mrr numeric(14,2) not null default 0,
  arr numeric(14,2) not null default 0,
  subscription_status text not null default 'active',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, subscription_key)
);

alter table public.organization_roci588_subscriptions enable row level security;
revoke all on public.organization_roci588_subscriptions from authenticated, anon;

create table if not exists public.organization_roci588_customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_key text not null,
  customer_label text not null,
  revenue_total numeric(14,2) not null default 0,
  health_label text not null default 'stable',
  expansion_potential text not null default 'moderate',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, customer_key)
);

alter table public.organization_roci588_customers enable row level security;
revoke all on public.organization_roci588_customers from authenticated, anon;

create table if not exists public.organization_roci588_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'commercial_intelligence',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_roci588_audit_logs enable row level security;
revoke all on public.organization_roci588_audit_logs from authenticated, anon;

create or replace function public._roci588_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._roci588_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'commercial_intelligence'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_roci588_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'commercial_intelligence'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._roci588_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_roci588_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._roci588_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._roci588_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_roci588_recurring_revenue where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_roci588_revenue_registry (
    organization_id, source_key, source_title, source_type, revenue_amount, period_label, trend_label, summary
  ) values
    (p_org_id, 'subscription', 'Subscription Revenue', 'subscription', 84200, 'monthly', 'up', 'Core ABOS subscription revenue.'),
    (p_org_id, 'business_pack', 'Business Pack Revenue', 'business_pack', 31800, 'monthly', 'up', 'Support and Knowledge packs.'),
    (p_org_id, 'domain', 'Domain Revenue', 'domain', 4200, 'monthly', 'stable', 'Additional domain licenses.'),
    (p_org_id, 'user_license', 'User License Revenue', 'user_license', 12600, 'monthly', 'up', 'Seat-based licensing.'),
    (p_org_id, 'partner', 'Partner Revenue', 'partner', 9800, 'monthly', 'stable', 'Growth Partner attributed revenue.'),
    (p_org_id, 'enterprise', 'Enterprise Revenue', 'enterprise', 45000, 'monthly', 'up', 'Enterprise plan components.'),
    (p_org_id, 'marketplace', 'Marketplace Revenue', 'marketplace', 2400, 'monthly', 'stable', 'Skills marketplace share.');

  insert into public.organization_roci588_recurring_revenue (
    organization_id, snapshot_key, mrr, arr, expansion_revenue, contraction_revenue, churn_revenue,
    net_revenue_retention_pct, summary
  ) values (
    p_org_id, 'current', 190000, 2280000, 24000, 8200, 12000, 108.5,
    'Healthy recurring base with positive net revenue retention.'
  );

  insert into public.organization_roci588_attribution (
    organization_id, attribution_key, attribution_title, attribution_type, revenue_amount, share_pct, summary
  ) values
    (p_org_id, 'organic', 'Organic Source', 'organic', 72000, 38, 'Inbound and organic discovery.'),
    (p_org_id, 'growth_partner', 'Growth Partner Source', 'growth_partner', 48000, 25, 'Partner-led acquisition.'),
    (p_org_id, 'direct', 'Direct Source', 'direct', 38000, 20, 'Direct sales engagement.'),
    (p_org_id, 'referral', 'Referral Source', 'referral', 18000, 9, 'Customer referrals.'),
    (p_org_id, 'campaign', 'Campaign Source', 'campaign', 14000, 8, 'Marketing campaigns.');

  insert into public.organization_roci588_health (
    organization_id, health_key, health_status, growth_rate_pct, retention_pct, expansion_pct,
    churn_pct, renewal_pct, health_score, summary
  ) values (
    p_org_id, 'current', 'strong_growth', 14.2, 92.5, 18.3, 4.1, 88.0, 82,
    'Strong growth with stable retention — watch churn in mid-market segment.'
  );

  insert into public.organization_roci588_churn_signals (
    organization_id, signal_key, signal_title, signal_type, severity, companion_recommendation, summary
  ) values
    (p_org_id, 'renewal_risk_acme', 'Renewal Risk — Acme Ops', 'renewal_risk', 'high',
     'Generate retention plan and schedule executive review.', 'Health declining ahead of renewal.'),
    (p_org_id, 'low_adoption_team', 'Low Adoption — Operations Team', 'low_adoption', 'medium',
     'Assign Companion adoption playbook.', 'Support pack usage below target.');

  insert into public.organization_roci588_expansion (
    organization_id, expansion_key, expansion_title, expansion_type, forecast_revenue, recommendation, summary
  ) values
    (p_org_id, 'knowledge_pack', 'Knowledge Pack Expansion', 'business_pack', 12000,
     'Support customers → recommend Knowledge Pack to reduce ticket volume.', 'Cross-pack expansion.'),
    (p_org_id, 'user_upgrade', 'Additional User Licenses', 'additional_users', 8400,
     '95% license utilization — recommend upgrade before adding employee 26.', 'Capacity expansion.');

  insert into public.organization_roci588_forecasts (
    organization_id, forecast_key, horizon, expected_revenue, risk_adjusted_revenue,
    best_case_revenue, conservative_revenue, confidence, summary
  ) values
    (p_org_id, 'fc_30d', '30d', 195000, 188000, 210000, 180000, 'high', '30-day revenue outlook.'),
    (p_org_id, 'fc_90d', '90d', 585000, 560000, 630000, 520000, 'moderate', '90-day revenue outlook.'),
    (p_org_id, 'fc_6mo', '6mo', 1170000, 1100000, 1280000, 1020000, 'moderate', '6-month revenue forecast.'),
    (p_org_id, 'fc_12mo', '12mo', 2450000, 2280000, 2720000, 2100000, 'moderate', '12-month revenue forecast.');

  insert into public.organization_roci588_funnel_stages (
    organization_id, stage_key, stage_title, stage_count, conversion_pct, sort_order, summary
  ) values
    (p_org_id, 'visitors', 'Visitors', 12400, 100, 1, 'Top of commercial funnel.'),
    (p_org_id, 'leads', 'Leads', 1860, 15, 2, 'Marketing qualified interest.'),
    (p_org_id, 'qualified', 'Qualified Leads', 620, 33, 3, 'Sales-qualified opportunities.'),
    (p_org_id, 'demos', 'Demos', 248, 40, 4, 'Product demonstrations completed.'),
    (p_org_id, 'customers', 'Customers', 86, 35, 5, 'Closed-won customers.'),
    (p_org_id, 'expansion', 'Expansion', 34, 40, 6, 'Expansion revenue events.'),
    (p_org_id, 'advocates', 'Advocates', 18, 53, 7, 'Reference-ready advocates.');

  insert into public.organization_roci588_customer_value (
    organization_id, metric_key, metric_title, metric_value, value_unit, summary
  ) values
    (p_org_id, 'ltv', 'Customer Lifetime Value', 485000, 'NOK', 'Average LTV across active customers.'),
    (p_org_id, 'rev_per_customer', 'Revenue Per Customer', 22100, 'NOK', 'Monthly revenue per customer.'),
    (p_org_id, 'rev_per_user', 'Revenue Per User', 890, 'NOK', 'Monthly revenue per licensed user.'),
    (p_org_id, 'rev_per_domain', 'Revenue Per Domain', 1400, 'NOK', 'Monthly revenue per domain.'),
    (p_org_id, 'rev_per_pack', 'Revenue Per Business Pack', 5300, 'NOK', 'Average pack-attributed revenue.');

  insert into public.organization_roci588_business_packs (
    organization_id, pack_key, pack_title, pack_revenue, adoption_pct, expansion_opportunity, retention_signal, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 18200, 71, 'Add Knowledge Pack', 'stable', 'Support Pack → Support Revenue.'),
    (p_org_id, 'knowledge', 'Knowledge Pack', 13600, 92, 'Department paths', 'strong', 'Knowledge Pack → Knowledge Revenue.'),
    (p_org_id, 'hosts', 'Hosts Pack', 8400, 58, 'Property operations expansion', 'watch', 'Hosts Pack → Property Revenue.');

  insert into public.organization_roci588_subscriptions (
    organization_id, subscription_key, customer_label, plan_label, mrr, arr, subscription_status, summary
  ) values
    (p_org_id, 'sub_acme', 'Acme Operations', 'Business', 4200, 50400, 'active', 'Primary subscription — renewal in 87 days.'),
    (p_org_id, 'sub_nordic', 'Nordic Retail Group', 'Enterprise', 12800, 153600, 'active', 'Enterprise plan with packs.'),
    (p_org_id, 'sub_unonight', 'Unonight Pilot', 'Business', 6800, 81600, 'active', 'Pilot customer — expansion candidate.');

  insert into public.organization_roci588_customers (
    organization_id, customer_key, customer_label, revenue_total, health_label, expansion_potential, summary
  ) values
    (p_org_id, 'cust_acme', 'Acme Operations', 50400, 'watch_closely', 'moderate', 'Renewal risk — retention plan recommended.'),
    (p_org_id, 'cust_nordic', 'Nordic Retail Group', 153600, 'strong_growth', 'high', 'Enterprise expansion candidate.'),
    (p_org_id, 'cust_unonight', 'Unonight Pilot', 81600, 'stable', 'high', 'Strong adoption — reference potential.');

  perform public._roci588_log(p_org_id, 'revenue_recorded', 'Commercial intelligence baseline seeded.');
end; $$;

create or replace function public.get_organization_commercial_intelligence_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_recurring public.organization_roci588_recurring_revenue;
  v_health public.organization_roci588_health;
begin
  v_org_id := public._roci588_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._roci588_seed(v_org_id);
  select * into v_recurring from public.organization_roci588_recurring_revenue
  where organization_id = v_org_id and snapshot_key = 'current' limit 1;
  select * into v_health from public.organization_roci588_health
  where organization_id = v_org_id and health_key = 'current' limit 1;

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Revenue is the result — understanding drivers creates growth.',
      'privacy_note', 'Commercial intelligence metadata only — no raw customer records.',
      'mrr', coalesce(v_recurring.mrr, 0),
      'arr', coalesce(v_recurring.arr, 0),
      'nrr_pct', coalesce(v_recurring.net_revenue_retention_pct, 100),
      'health_status', coalesce(v_health.health_status, 'stable'),
      'health_score', coalesce(v_health.health_score, 75),
      'stats', jsonb_build_object(
        'open_churn_signals', (select count(*) from public.organization_roci588_churn_signals where organization_id = v_org_id and signal_status = 'open'),
        'open_expansion', (select count(*) from public.organization_roci588_expansion where organization_id = v_org_id and expansion_status = 'open'),
        'registry_sources', (select count(*) from public.organization_roci588_revenue_registry where organization_id = v_org_id),
        'growth_rate_pct', coalesce(v_health.growth_rate_pct, 0)
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'signal_title', c.signal_title, 'recommendation', c.companion_recommendation
        )) from public.organization_roci588_churn_signals c
        where c.organization_id = v_org_id and c.signal_status = 'open' limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Revenue is the result — understanding drivers creates growth.',
    'privacy_note', 'Commercial intelligence metadata only.',
    'mrr', coalesce(v_recurring.mrr, 0),
    'arr', coalesce(v_recurring.arr, 0),
    'nrr_pct', coalesce(v_recurring.net_revenue_retention_pct, 100),
    'health_status', coalesce(v_health.health_status, 'stable'),
    'health_score', coalesce(v_health.health_score, 75),
    'revenue_registry', coalesce((select jsonb_agg(jsonb_build_object(
      'source_key', r.source_key, 'source_title', r.source_title, 'source_type', r.source_type,
      'revenue_amount', r.revenue_amount, 'period_label', r.period_label, 'trend_label', r.trend_label, 'summary', r.summary
    ) order by r.revenue_amount desc) from public.organization_roci588_revenue_registry r where r.organization_id = v_org_id), '[]'::jsonb),
    'recurring_revenue', coalesce((select jsonb_build_object(
      'mrr', rr.mrr, 'arr', rr.arr, 'expansion_revenue', rr.expansion_revenue,
      'contraction_revenue', rr.contraction_revenue, 'churn_revenue', rr.churn_revenue,
      'net_revenue_retention_pct', rr.net_revenue_retention_pct, 'summary', rr.summary
    ) from public.organization_roci588_recurring_revenue rr where rr.organization_id = v_org_id and rr.snapshot_key = 'current'), '{}'::jsonb),
    'attribution', coalesce((select jsonb_agg(jsonb_build_object(
      'attribution_key', a.attribution_key, 'attribution_title', a.attribution_title,
      'attribution_type', a.attribution_type, 'revenue_amount', a.revenue_amount,
      'share_pct', a.share_pct, 'summary', a.summary
    ) order by a.revenue_amount desc) from public.organization_roci588_attribution a where a.organization_id = v_org_id), '[]'::jsonb),
    'health', coalesce((select jsonb_build_object(
      'health_status', h.health_status, 'growth_rate_pct', h.growth_rate_pct,
      'retention_pct', h.retention_pct, 'expansion_pct', h.expansion_pct,
      'churn_pct', h.churn_pct, 'renewal_pct', h.renewal_pct,
      'health_score', h.health_score, 'summary', h.summary
    ) from public.organization_roci588_health h where h.organization_id = v_org_id and h.health_key = 'current'), '{}'::jsonb),
    'churn_signals', coalesce((select jsonb_agg(jsonb_build_object(
      'signal_key', c.signal_key, 'signal_title', c.signal_title, 'signal_type', c.signal_type,
      'severity', c.severity, 'signal_status', c.signal_status,
      'companion_recommendation', c.companion_recommendation, 'summary', c.summary
    ) order by c.severity desc) from public.organization_roci588_churn_signals c where c.organization_id = v_org_id), '[]'::jsonb),
    'expansion', coalesce((select jsonb_agg(jsonb_build_object(
      'expansion_key', e.expansion_key, 'expansion_title', e.expansion_title,
      'expansion_type', e.expansion_type, 'forecast_revenue', e.forecast_revenue,
      'expansion_status', e.expansion_status, 'recommendation', e.recommendation, 'summary', e.summary
    ) order by e.forecast_revenue desc) from public.organization_roci588_expansion e where e.organization_id = v_org_id), '[]'::jsonb),
    'forecasts', coalesce((select jsonb_agg(jsonb_build_object(
      'forecast_key', f.forecast_key, 'horizon', f.horizon,
      'expected_revenue', f.expected_revenue, 'risk_adjusted_revenue', f.risk_adjusted_revenue,
      'best_case_revenue', f.best_case_revenue, 'conservative_revenue', f.conservative_revenue,
      'confidence', f.confidence, 'summary', f.summary
    ) order by f.horizon) from public.organization_roci588_forecasts f where f.organization_id = v_org_id), '[]'::jsonb),
    'funnel', coalesce((select jsonb_agg(jsonb_build_object(
      'stage_key', s.stage_key, 'stage_title', s.stage_title, 'stage_count', s.stage_count,
      'conversion_pct', s.conversion_pct, 'sort_order', s.sort_order, 'summary', s.summary
    ) order by s.sort_order) from public.organization_roci588_funnel_stages s where s.organization_id = v_org_id), '[]'::jsonb),
    'customer_value', coalesce((select jsonb_agg(jsonb_build_object(
      'metric_key', v.metric_key, 'metric_title', v.metric_title,
      'metric_value', v.metric_value, 'value_unit', v.value_unit, 'summary', v.summary
    ) order by v.metric_value desc) from public.organization_roci588_customer_value v where v.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', b.pack_key, 'pack_title', b.pack_title, 'pack_revenue', b.pack_revenue,
      'adoption_pct', b.adoption_pct, 'expansion_opportunity', b.expansion_opportunity,
      'retention_signal', b.retention_signal, 'summary', b.summary
    ) order by b.pack_revenue desc) from public.organization_roci588_business_packs b where b.organization_id = v_org_id), '[]'::jsonb),
    'subscriptions', coalesce((select jsonb_agg(jsonb_build_object(
      'subscription_key', s.subscription_key, 'customer_label', s.customer_label,
      'plan_label', s.plan_label, 'mrr', s.mrr, 'arr', s.arr,
      'subscription_status', s.subscription_status, 'summary', s.summary
    ) order by s.mrr desc) from public.organization_roci588_subscriptions s where s.organization_id = v_org_id), '[]'::jsonb),
    'customers', coalesce((select jsonb_agg(jsonb_build_object(
      'customer_key', c.customer_key, 'customer_label', c.customer_label,
      'revenue_total', c.revenue_total, 'health_label', c.health_label,
      'expansion_potential', c.expansion_potential, 'summary', c.summary
    ) order by c.revenue_total desc) from public.organization_roci588_customers c where c.organization_id = v_org_id), '[]'::jsonb),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_roci588_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'reports', jsonb_build_object(
      'mrr', coalesce(v_recurring.mrr, 0),
      'arr', coalesce(v_recurring.arr, 0),
      'nrr_pct', coalesce(v_recurring.net_revenue_retention_pct, 100),
      'growth_rate_pct', coalesce(v_health.growth_rate_pct, 0),
      'forecast_90d', coalesce((select expected_revenue from public.organization_roci588_forecasts where organization_id = v_org_id and horizon = '90d' limit 1), 0)
    )
  );
end;
$$;

create or replace function public.get_platform_commercial_intelligence_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_billing jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  v_billing := public.get_platform_unified_billing_admin_center(
    case v_section
      when 'customers' then 'profiles'
      when 'subscriptions' then 'subscriptions'
      when 'revenue' then 'overview'
      when 'business_packs' then 'licenses'
      when 'forecasts' then 'reports'
      when 'growth' then 'reports'
      when 'retention' then 'reports'
      when 'reports' then 'reports'
      else 'overview'
    end
  );

  return v_billing || jsonb_build_object(
    'found', true,
    'section', v_section,
    'principle', 'Understanding revenue drivers protects and expands commercial growth.',
    'privacy_note', 'Platform aggregates only — no customer operational content.',
    'engine', 'commercial_intelligence_phase588'
  );
end;
$$;

create or replace function public.get_aipify_revenue_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_commercial_intelligence_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Revenue Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'growth',
        'observation', format('MRR %s · Growth rate %s%%.',
          v_center->>'mrr', v_stats->>'growth_rate_pct'),
        'recommendation', 'Review expansion opportunities and attribution mix.',
        'href', '/app/revenue/growth'
      ),
      jsonb_build_object(
        'key', 'churn',
        'observation', format('%s churn signal(s) open · NRR %s%%.',
          v_stats->>'open_churn_signals', v_center->>'nrr_pct'),
        'recommendation', 'Address renewal risk and adoption gaps before churn accelerates.',
        'href', '/app/revenue/retention'
      ),
      jsonb_build_object(
        'key', 'expansion',
        'observation', format('%s expansion opportunity(ies) identified.', v_stats->>'open_expansion'),
        'recommendation', 'Prioritize Business Pack and license upgrades with highest forecast impact.',
        'href', '/app/revenue/growth'
      ),
      jsonb_build_object(
        'key', 'forecast',
        'observation', format('ARR %s — review 90-day forecast scenarios.', v_center->>'arr'),
        'recommendation', 'Compare expected, risk-adjusted, and conservative cases.',
        'href', '/app/revenue/forecasts'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_commercial_intelligence_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_commercial_intelligence_center('overview');
end;
$$;

grant execute on function public.get_organization_commercial_intelligence_center(text) to authenticated;
grant execute on function public.get_platform_commercial_intelligence_center(text) to authenticated;
grant execute on function public.get_aipify_revenue_advisor_bundle() to authenticated;
grant execute on function public.get_organization_commercial_intelligence_mobile_summary() to authenticated;
