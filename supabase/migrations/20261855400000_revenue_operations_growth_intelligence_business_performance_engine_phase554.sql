-- Phase 554 — Revenue Operations, Growth Intelligence & Business Performance Engine
-- Unified revenue lifecycle layer connecting sales, marketing, CS, subscriptions, renewals, partners, and packs.
-- Feature owner: CUSTOMER APP. Routes: /app/revenue, /app/revenue/pipeline

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  revenue_ops_enabled boolean not null default true,
  pipeline_tracking_enabled boolean not null default true,
  forecast_enabled boolean not null default true,
  renewal_workflow_enabled boolean not null default true,
  expansion_engine_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_revenue_operations_settings enable row level security;
revoke all on public.organization_revenue_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Pipeline
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_pipeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pipeline_key text not null,
  title text not null,
  stage text not null default 'lead' check (
    stage in ('lead', 'qualified', 'proposal', 'negotiation', 'decision', 'won', 'lost', 'custom')
  ),
  record_type text not null default 'opportunity' check (
    record_type in ('lead', 'opportunity', 'quote', 'proposal', 'negotiation', 'win', 'loss')
  ),
  revenue_potential numeric(14,2) not null default 0,
  currency_code text not null default 'NOK',
  source_label text not null default '',
  owner_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'open' check (status in ('open', 'active', 'closed_won', 'closed_lost')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, pipeline_key)
);

alter table public.organization_revenue_operations_pipeline enable row level security;
revoke all on public.organization_revenue_operations_pipeline from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Subscription lifecycle intelligence
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_key text not null,
  customer_label text not null,
  lifecycle_stage text not null default 'customer' check (
    lifecycle_stage in ('lead', 'opportunity', 'customer', 'subscription', 'renewal', 'expansion', 'advocate')
  ),
  plan_label text not null default '',
  business_packs jsonb not null default '[]'::jsonb,
  domains jsonb not null default '[]'::jsonb,
  license_count integer not null default 0,
  monthly_revenue numeric(14,2) not null default 0,
  annual_revenue numeric(14,2) not null default 0,
  expansion_history text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_key)
);

alter table public.organization_revenue_operations_subscriptions enable row level security;
revoke all on public.organization_revenue_operations_subscriptions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Expansion, renewals, forecasts, health
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_expansion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  expansion_key text not null,
  customer_label text not null,
  title text not null,
  expansion_type text not null check (
    expansion_type in (
      'domain', 'business_pack', 'license', 'user', 'integration', 'service', 'custom'
    )
  ),
  current_usage text not null default '',
  recommendation text not null default '',
  forecast_revenue_impact numeric(14,2) not null default 0,
  status text not null default 'identified' check (
    status in ('identified', 'reviewing', 'pursuing', 'won', 'dismissed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, expansion_key)
);

alter table public.organization_revenue_operations_expansion enable row level security;
revoke all on public.organization_revenue_operations_expansion from authenticated, anon;

create table if not exists public.organization_revenue_operations_renewals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  renewal_key text not null,
  customer_label text not null,
  renewal_date date not null,
  renewal_probability_pct integer not null default 75 check (renewal_probability_pct between 0 and 100),
  renewal_health text not null default 'healthy' check (
    renewal_health in ('strong', 'healthy', 'watch', 'at_risk')
  ),
  risk_indicators text not null default '',
  expansion_opportunity text not null default '',
  workflow_stage text not null default '90_day_review' check (
    workflow_stage in ('90_day_review', 'review', 'health_check', 'companion_summary', 'renewal_plan', 'renewal')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, renewal_key)
);

alter table public.organization_revenue_operations_renewals enable row level security;
revoke all on public.organization_revenue_operations_renewals from authenticated, anon;

create table if not exists public.organization_revenue_operations_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_key text not null,
  horizon text not null check (horizon in ('30_day', '90_day', 'quarterly', 'annual')),
  expected_revenue numeric(14,2) not null default 0,
  expected_churn numeric(14,2) not null default 0,
  expected_expansion numeric(14,2) not null default 0,
  expected_growth_pct numeric(6,2) not null default 0,
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  summary text not null default '' check (char_length(summary) <= 500),
  generated_at timestamptz not null default now(),
  unique (organization_id, forecast_key)
);

alter table public.organization_revenue_operations_forecasts enable row level security;
revoke all on public.organization_revenue_operations_forecasts from authenticated, anon;

create table if not exists public.organization_revenue_operations_health (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  health_score integer not null default 78 check (health_score between 0 and 100),
  health_status text not null default 'healthy' check (
    health_status in ('strong_growth', 'healthy', 'watch_closely', 'revenue_risk')
  ),
  customer_health_score integer not null default 80,
  renewal_health_score integer not null default 75,
  expansion_activity_score integer not null default 70,
  subscription_stability_score integer not null default 82,
  payment_health_score integer not null default 88,
  partner_performance_score integer not null default 72,
  summary text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.organization_revenue_operations_health enable row level security;
revoke all on public.organization_revenue_operations_health from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Partner, attribution, pack & domain revenue
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_partner_revenue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_key text not null,
  partner_label text not null,
  partner_revenue numeric(14,2) not null default 0,
  renewal_revenue numeric(14,2) not null default 0,
  referral_count integer not null default 0,
  conversion_rate_pct numeric(5,2) not null default 0,
  expansion_revenue numeric(14,2) not null default 0,
  quality_score integer not null default 75 check (quality_score between 0 and 100),
  partner_tier text not null default 'growth' check (
    partner_tier in ('top_revenue', 'fastest_growing', 'highest_retention', 'growth')
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, partner_key)
);

alter table public.organization_revenue_operations_partner_revenue enable row level security;
revoke all on public.organization_revenue_operations_partner_revenue from authenticated, anon;

create table if not exists public.organization_revenue_operations_marketing_attribution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  attribution_key text not null,
  campaign_label text not null,
  lead_source text not null default '',
  conversion_count integer not null default 0,
  revenue numeric(14,2) not null default 0,
  renewal_revenue numeric(14,2) not null default 0,
  expansion_revenue numeric(14,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, attribution_key)
);

alter table public.organization_revenue_operations_marketing_attribution enable row level security;
revoke all on public.organization_revenue_operations_marketing_attribution from authenticated, anon;

create table if not exists public.organization_revenue_operations_business_pack_revenue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_label text not null,
  pack_revenue numeric(14,2) not null default 0,
  renewal_revenue numeric(14,2) not null default 0,
  trial_conversion_pct numeric(5,2) not null default 0,
  expansion_revenue numeric(14,2) not null default 0,
  adoption_rate_pct numeric(5,2) not null default 0,
  forecast_revenue numeric(14,2) not null default 0,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

alter table public.organization_revenue_operations_business_pack_revenue enable row level security;
revoke all on public.organization_revenue_operations_business_pack_revenue from authenticated, anon;

create table if not exists public.organization_revenue_operations_domain_revenue (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  domain_label text not null,
  revenue numeric(14,2) not null default 0,
  business_packs_count integer not null default 0,
  user_licenses integer not null default 0,
  renewal_performance text not null default 'stable',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, domain_key)
);

alter table public.organization_revenue_operations_domain_revenue enable row level security;
revoke all on public.organization_revenue_operations_domain_revenue from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Revenue risks & audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_revenue_operations_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  title text not null,
  risk_type text not null check (
    risk_type in (
      'churn', 'renewal', 'partner', 'concentration', 'expansion', 'payment', 'economic'
    )
  ),
  severity text not null default 'attention' check (severity in ('information', 'attention', 'critical')),
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'monitoring' check (status in ('monitoring', 'mitigating', 'resolved')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, risk_key)
);

alter table public.organization_revenue_operations_risks enable row level security;
revoke all on public.organization_revenue_operations_risks from authenticated, anon;

create table if not exists public.organization_revenue_operations_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'opportunity_created', 'forecast_generated', 'renewal_planned', 'renewal_completed',
      'expansion_identified', 'revenue_risk_detected', 'partner_revenue_updated',
      'briefing_viewed', 'recommendation_generated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_revenue_operations_audit_logs_org_idx
  on public.organization_revenue_operations_audit_logs (organization_id, created_at desc);

alter table public.organization_revenue_operations_audit_logs enable row level security;
revoke all on public.organization_revenue_operations_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._revs554_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._revs554_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_revenue_operations_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._revs554_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_revenue_operations_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
  insert into public.organization_revenue_operations_health (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._revs554_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_revenue_operations_pipeline where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_revenue_operations_pipeline (
    organization_id, pipeline_key, title, stage, record_type, revenue_potential, source_label, summary, status
  ) values
    (p_org_id, 'lead_nordic_smb', 'Nordic SMB Lead', 'lead', 'lead', 48000, 'LinkedIn', 'Inbound interest from hospitality operator.', 'open'),
    (p_org_id, 'opp_retail_expansion', 'Retail Expansion Opportunity', 'proposal', 'opportunity', 120000, 'Growth Partner', 'Multi-domain retail rollout.', 'active'),
    (p_org_id, 'prop_enterprise_pack', 'Enterprise Pack Proposal', 'negotiation', 'proposal', 240000, 'Direct', 'Business + Enterprise modules.', 'active'),
    (p_org_id, 'win_hosts_pilot', 'Hosts Pack Pilot Won', 'won', 'win', 96000, 'Partner referral', 'Pilot converted to annual subscription.', 'closed_won');

  insert into public.organization_revenue_operations_subscriptions (
    organization_id, customer_key, customer_label, lifecycle_stage, plan_label,
    business_packs, domains, license_count, monthly_revenue, annual_revenue, expansion_history
  ) values
    (p_org_id, 'cust_unonight', 'Unonight Pilot', 'subscription', 'Business',
     '["Hosts Pack"]'::jsonb, '["unonight.no"]'::jsonb, 12, 18500, 222000,
     'Added Inventory Pack after initial install.'),
    (p_org_id, 'cust_nordic_retail', 'Nordic Retail Co', 'expansion', 'Professional',
     '["Inventory Pack","Commerce Pack"]'::jsonb, '["butikk.no","support.no"]'::jsonb, 28, 42000, 504000,
     'Evaluating Supplier Pack and Procurement Pack.');

  insert into public.organization_revenue_operations_expansion (
    organization_id, expansion_key, customer_label, title, expansion_type,
    current_usage, recommendation, forecast_revenue_impact, summary
  ) values
    (p_org_id, 'exp_inventory_supplier', 'Nordic Retail Co', 'Supplier Pack cross-sell', 'business_pack',
     'Inventory Pack active', 'Recommend Supplier Pack then Procurement Pack', 84000,
     'Customer uses Inventory Pack — natural expansion path to supply chain modules.'),
    (p_org_id, 'exp_domain_add', 'Unonight Pilot', 'Additional domain license', 'domain',
     'Single domain', 'Add booking domain for seasonal campaigns', 18000,
     'Secondary domain would support marketing microsites.');

  insert into public.organization_revenue_operations_renewals (
    organization_id, renewal_key, customer_label, renewal_date, renewal_probability_pct,
    renewal_health, risk_indicators, expansion_opportunity, workflow_stage, summary
  ) values
    (p_org_id, 'ren_unonight_q3', 'Unonight Pilot', (current_date + interval '90 days')::date, 88,
     'healthy', 'None significant', 'Hosts Pack add-on seats', 'companion_summary',
     'Strong adoption — renewal likely with expansion.'),
    (p_org_id, 'ren_retail_q4', 'Nordic Retail Co', (current_date + interval '120 days')::date, 62,
     'watch', 'Payment delay last quarter', 'Supplier Pack bundle', 'review',
     'Monitor payment health and schedule executive check-in.');

  insert into public.organization_revenue_operations_forecasts (
    organization_id, forecast_key, horizon, expected_revenue, expected_churn,
    expected_expansion, expected_growth_pct, confidence, summary
  ) values
    (p_org_id, 'fc_30d', '30_day', 680000, 12000, 45000, 3.2, 'high', 'Stable month with modest expansion.'),
    (p_org_id, 'fc_90d', '90_day', 2100000, 85000, 180000, 5.8, 'moderate', 'Renewals and pack upsell drive growth.'),
    (p_org_id, 'fc_q', 'quarterly', 6200000, 240000, 520000, 6.4, 'moderate', 'Quarter forecast includes partner channel.'),
    (p_org_id, 'fc_y', 'annual', 24800000, 980000, 2100000, 7.1, 'moderate', 'Annual outlook assumes stable churn.');

  update public.organization_revenue_operations_health set
    health_score = 81,
    health_status = 'healthy',
    customer_health_score = 84,
    renewal_health_score = 76,
    expansion_activity_score = 79,
    subscription_stability_score = 85,
    payment_health_score = 90,
    partner_performance_score = 74,
    summary = 'Revenue lifecycle healthy with expansion opportunities and one renewal to watch.'
  where organization_id = p_org_id;

  insert into public.organization_revenue_operations_partner_revenue (
    organization_id, partner_key, partner_label, partner_revenue, renewal_revenue,
    referral_count, conversion_rate_pct, expansion_revenue, quality_score, partner_tier, summary
  ) values
    (p_org_id, 'gp_nordic', 'Nordic Growth Partner', 420000, 180000, 24, 18.5, 96000, 82, 'top_revenue',
     'Top revenue partner with strong hospitality referrals.'),
    (p_org_id, 'gp_retail', 'Retail Channel Partner', 185000, 72000, 15, 22.0, 48000, 78, 'fastest_growing',
     'Fastest growing partner in retail segment.');

  insert into public.organization_revenue_operations_marketing_attribution (
    organization_id, attribution_key, campaign_label, lead_source, conversion_count,
    revenue, renewal_revenue, expansion_revenue, summary
  ) values
    (p_org_id, 'attr_linkedin', 'LinkedIn ABOS Campaign', 'LinkedIn', 42, 380000, 120000, 65000,
     'LinkedIn → Lead → Customer → Renewal → Expansion full attribution chain.'),
    (p_org_id, 'attr_partner_webinar', 'Partner Webinar Series', 'Growth Partner', 18, 240000, 85000, 42000,
     'Partner-led demand generation with strong conversion.');

  insert into public.organization_revenue_operations_business_pack_revenue (
    organization_id, pack_key, pack_label, pack_revenue, renewal_revenue,
    trial_conversion_pct, expansion_revenue, adoption_rate_pct, forecast_revenue, summary
  ) values
    (p_org_id, 'hosts_pack', 'Hospitality Pack', 680000, 240000, 42.0, 120000, 68.0, 820000,
     'Hosts Pack — demand increasing, strong renewal performance.'),
    (p_org_id, 'warehouse_pack', 'Warehouse Pack', 420000, 180000, 38.0, 96000, 55.0, 510000,
     'Warehouse Pack — strong adoption in logistics segment.'),
    (p_org_id, 'finance_pack', 'Finance Pack', 185000, 72000, 28.0, 84000, 32.0, 290000,
     'Finance Pack — expansion opportunity in mid-market.');

  insert into public.organization_revenue_operations_domain_revenue (
    organization_id, domain_key, domain_label, revenue, business_packs_count, user_licenses, renewal_performance, summary
  ) values
    (p_org_id, 'firma_no', 'firma.no', 185000, 2, 18, 'strong', 'Core business domain with stable renewal.'),
    (p_org_id, 'butikk_no', 'butikk.no', 240000, 3, 24, 'stable', 'Retail trends driving commerce pack revenue.'),
    (p_org_id, 'support_no', 'support.no', 96000, 1, 8, 'growing', 'Support industry domain with expansion potential.');

  insert into public.organization_revenue_operations_risks (
    organization_id, risk_key, title, risk_type, severity, summary
  ) values
    (p_org_id, 'risk_concentration', 'Customer revenue concentration', 'concentration', 'attention',
     'Single customer contributes 30% of recurring revenue — diversification recommended.'),
    (p_org_id, 'risk_renewal_retail', 'Retail renewal at risk', 'renewal', 'attention',
     'Nordic Retail Co renewal probability below target — schedule review.'),
    (p_org_id, 'risk_churn_signal', 'Churn signal in SMB segment', 'churn', 'information',
     'Early indicator in SMB cohort — monitor support health scores.');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_revenue_operations_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_monthly numeric;
  v_annual numeric;
  v_recurring numeric;
  v_renewal_rev numeric;
  v_expansion_rev numeric;
  v_partner_rev numeric;
  v_forecast_rev numeric;
begin
  v_org_id := public._revs554_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._revs554_ensure_settings(v_org_id);
  perform public._revs554_seed(v_org_id);

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  select coalesce(sum(monthly_revenue), 0), coalesce(sum(annual_revenue), 0)
  into v_monthly, v_annual
  from public.organization_revenue_operations_subscriptions where organization_id = v_org_id;

  v_recurring := v_monthly * 12;
  select coalesce(sum(renewal_revenue), 0) into v_renewal_rev
  from public.organization_revenue_operations_renewals r
  join public.organization_revenue_operations_subscriptions s on s.organization_id = r.organization_id
  where r.organization_id = v_org_id;
  v_renewal_rev := coalesce(v_renewal_rev, v_annual * 0.35);

  select coalesce(sum(forecast_revenue_impact), 0) into v_expansion_rev
  from public.organization_revenue_operations_expansion where organization_id = v_org_id and status in ('identified', 'pursuing');

  select coalesce(sum(partner_revenue), 0) into v_partner_rev
  from public.organization_revenue_operations_partner_revenue where organization_id = v_org_id;

  select coalesce(expected_revenue, 0) into v_forecast_rev
  from public.organization_revenue_operations_forecasts
  where organization_id = v_org_id and horizon = 'quarterly'
  limit 1;

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Revenue is not a number — it is the result of healthy customers, successful partners, valuable products, and strong execution.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', jsonb_build_object(
      'monthly_revenue', v_monthly,
      'annual_revenue', v_annual,
      'recurring_revenue', v_recurring,
      'renewal_revenue', v_renewal_rev,
      'expansion_revenue', v_expansion_rev,
      'partner_revenue', v_partner_rev,
      'forecast_revenue', v_forecast_rev,
      'revenue_health_score', coalesce((select health_score from public.organization_revenue_operations_health where organization_id = v_org_id), 75),
      'pipeline_open', (select count(*) from public.organization_revenue_operations_pipeline where organization_id = v_org_id and status in ('open', 'active')),
      'renewals_due_90d', (select count(*) from public.organization_revenue_operations_renewals where organization_id = v_org_id and renewal_date <= current_date + 90),
      'expansion_opportunities', (select count(*) from public.organization_revenue_operations_expansion where organization_id = v_org_id and status in ('identified', 'reviewing', 'pursuing')),
      'active_risks', (select count(*) from public.organization_revenue_operations_risks where organization_id = v_org_id and status = 'monitoring')
    ),
    'pipeline_engine', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.revenue_potential desc)
      from public.organization_revenue_operations_pipeline p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'revenue_lifecycle', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.annual_revenue desc)
      from public.organization_revenue_operations_subscriptions s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'subscription_intelligence', coalesce((
      select jsonb_agg(to_jsonb(s) order by s.customer_label)
      from public.organization_revenue_operations_subscriptions s where s.organization_id = v_org_id
    ), '[]'::jsonb),
    'expansion_engine', coalesce((
      select jsonb_agg(to_jsonb(e) order by e.forecast_revenue_impact desc)
      from public.organization_revenue_operations_expansion e where e.organization_id = v_org_id
    ), '[]'::jsonb),
    'renewal_operations', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.renewal_date)
      from public.organization_revenue_operations_renewals r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'forecast_engine', coalesce((
      select jsonb_agg(to_jsonb(f) order by f.generated_at desc)
      from public.organization_revenue_operations_forecasts f where f.organization_id = v_org_id
    ), '[]'::jsonb),
    'revenue_health', coalesce((
      select to_jsonb(h) from public.organization_revenue_operations_health h where h.organization_id = v_org_id
    ), '{}'::jsonb),
    'growth_partner_intelligence', coalesce((
      select jsonb_agg(to_jsonb(p) order by p.partner_revenue desc)
      from public.organization_revenue_operations_partner_revenue p where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'marketing_attribution', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.revenue desc)
      from public.organization_revenue_operations_marketing_attribution a where a.organization_id = v_org_id
    ), '[]'::jsonb),
    'business_pack_revenue', coalesce((
      select jsonb_agg(to_jsonb(b) order by b.pack_revenue desc)
      from public.organization_revenue_operations_business_pack_revenue b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'domain_revenue', coalesce((
      select jsonb_agg(to_jsonb(d) order by d.revenue desc)
      from public.organization_revenue_operations_domain_revenue d where d.organization_id = v_org_id
    ), '[]'::jsonb),
    'revenue_risk_engine', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.created_at desc)
      from public.organization_revenue_operations_risks r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_revenue_advisor', jsonb_build_object(
      'advisor_prompts', jsonb_build_array(
        'Which customers are most likely to expand?',
        'Which renewals are at risk?',
        'Which Business Packs generate the most revenue?',
        'Which Growth Partners perform best?',
        'Forecast next quarter revenue.'
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'revenue_health', coalesce((select health_status from public.organization_revenue_operations_health where organization_id = v_org_id), 'healthy'),
      'revenue_health_score', coalesce((select health_score from public.organization_revenue_operations_health where organization_id = v_org_id), 75),
      'forecast_revenue', v_forecast_rev,
      'renewals_due', (select count(*) from public.organization_revenue_operations_renewals where organization_id = v_org_id),
      'expansion_opportunities', (select count(*) from public.organization_revenue_operations_expansion where organization_id = v_org_id and status in ('identified', 'pursuing')),
      'partner_revenue', v_partner_rev,
      'business_pack_count', (select count(*) from public.organization_revenue_operations_business_pack_revenue where organization_id = v_org_id),
      'revenue_risks', (select count(*) from public.organization_revenue_operations_risks where organization_id = v_org_id and severity in ('attention', 'critical')),
      'companion_recommendations', (select count(*) from public.organization_revenue_operations_expansion where organization_id = v_org_id)
    ),
    'reports', jsonb_build_object(
      'revenue_trends', v_annual,
      'renewal_trends', v_renewal_rev,
      'partner_revenue', v_partner_rev,
      'business_pack_revenue', (select coalesce(sum(pack_revenue), 0) from public.organization_revenue_operations_business_pack_revenue where organization_id = v_org_id),
      'forecast_accuracy', 'moderate',
      'expansion_success', (select count(*) from public.organization_revenue_operations_expansion where organization_id = v_org_id and status = 'won'),
      'growth_metrics', jsonb_build_object('annual_revenue', v_annual, 'expansion_pipeline', v_expansion_rev)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_revenue_operations_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'revenue', true, 'forecasts', true, 'renewals', true, 'opportunities', true, 'expansion', true
    ),
    'routes', jsonb_build_object(
      'revenue_center', '/app/revenue',
      'pipeline', '/app/revenue/pipeline',
      'revenue_growth_legacy', '/app/revenue-growth',
      'commercial_packages', '/app/settings/billing'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_revenue_operations_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._revs554_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'create_opportunity' then
    insert into public.organization_revenue_operations_pipeline (
      organization_id, pipeline_key, title, stage, record_type, revenue_potential, source_label, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'pipeline_key', 'opp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'New opportunity'),
      coalesce(p_payload->>'stage', 'qualified'),
      coalesce(p_payload->>'record_type', 'opportunity'),
      coalesce((p_payload->>'revenue_potential')::numeric, 0),
      coalesce(p_payload->>'source_label', ''),
      coalesce(p_payload->>'summary', '')
    );
    perform public._revs554_log(v_org_id, 'opportunity_created', 'Pipeline opportunity created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'generate_forecast' then
    insert into public.organization_revenue_operations_forecasts (
      organization_id, forecast_key, horizon, expected_revenue, expected_churn,
      expected_expansion, expected_growth_pct, confidence, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'forecast_key', 'fc_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'horizon', 'quarterly'),
      coalesce((p_payload->>'expected_revenue')::numeric, 0),
      coalesce((p_payload->>'expected_churn')::numeric, 0),
      coalesce((p_payload->>'expected_expansion')::numeric, 0),
      coalesce((p_payload->>'expected_growth_pct')::numeric, 0),
      coalesce(p_payload->>'confidence', 'moderate'),
      coalesce(p_payload->>'summary', 'Revenue forecast generated.')
    );
    perform public._revs554_log(v_org_id, 'forecast_generated', 'Revenue forecast generated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'plan_renewal' then
    insert into public.organization_revenue_operations_renewals (
      organization_id, renewal_key, customer_label, renewal_date, renewal_probability_pct,
      renewal_health, summary, workflow_stage
    ) values (
      v_org_id,
      coalesce(p_payload->>'renewal_key', 'ren_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'customer_label', 'Customer'),
      coalesce((p_payload->>'renewal_date')::date, (current_date + 90)),
      coalesce((p_payload->>'renewal_probability_pct')::int, 75),
      coalesce(p_payload->>'renewal_health', 'healthy'),
      coalesce(p_payload->>'summary', 'Renewal plan created.'),
      coalesce(p_payload->>'workflow_stage', 'renewal_plan')
    );
    perform public._revs554_log(v_org_id, 'renewal_planned', 'Renewal plan created.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'complete_renewal' then
    update public.organization_revenue_operations_renewals
    set workflow_stage = 'renewal', renewal_health = 'strong', updated_at = now()
    where organization_id = v_org_id and renewal_key = coalesce(p_payload->>'renewal_key', renewal_key);
    perform public._revs554_log(v_org_id, 'renewal_completed', 'Renewal completed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'identify_expansion' then
    insert into public.organization_revenue_operations_expansion (
      organization_id, expansion_key, customer_label, title, expansion_type,
      recommendation, forecast_revenue_impact, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'expansion_key', 'exp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'customer_label', 'Customer'),
      coalesce(p_payload->>'title', 'Expansion opportunity'),
      coalesce(p_payload->>'expansion_type', 'business_pack'),
      coalesce(p_payload->>'recommendation', ''),
      coalesce((p_payload->>'forecast_revenue_impact')::numeric, 0),
      coalesce(p_payload->>'summary', '')
    );
    perform public._revs554_log(v_org_id, 'expansion_identified', 'Expansion opportunity identified.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'detect_revenue_risk' then
    insert into public.organization_revenue_operations_risks (
      organization_id, risk_key, title, risk_type, severity, summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'risk_key', 'risk_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'Revenue risk'),
      coalesce(p_payload->>'risk_type', 'churn'),
      coalesce(p_payload->>'severity', 'attention'),
      coalesce(p_payload->>'summary', '')
    );
    perform public._revs554_log(v_org_id, 'revenue_risk_detected', 'Revenue risk detected.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'update_partner_revenue' then
    update public.organization_revenue_operations_partner_revenue
    set partner_revenue = coalesce((p_payload->>'partner_revenue')::numeric, partner_revenue), updated_at = now()
    where organization_id = v_org_id and partner_key = coalesce(p_payload->>'partner_key', partner_key);
    perform public._revs554_log(v_org_id, 'partner_revenue_updated', 'Partner revenue updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_revenue_operations_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_revenue_operations_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'revenue_health_score', v_center->'overview'->'revenue_health_score',
    'annual_revenue', v_center->'overview'->'annual_revenue',
    'forecast_revenue', v_center->'overview'->'forecast_revenue',
    'renewals_due_90d', v_center->'overview'->'renewals_due_90d',
    'expansion_opportunities', v_center->'overview'->'expansion_opportunities',
    'active_risks', v_center->'overview'->'active_risks',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_revenue_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_revenue_operations_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'advisor', v_center->'companion_revenue_advisor',
    'expansion', v_center->'expansion_engine',
    'renewals', v_center->'renewal_operations',
    'risks', v_center->'revenue_risk_engine',
    'forecasts', v_center->'forecast_engine',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_revenue_operations_center(text) to authenticated;
grant execute on function public.perform_organization_revenue_operations_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_revenue_operations_mobile_summary() to authenticated;
grant execute on function public.get_companion_revenue_advisor_context(text) to authenticated;
