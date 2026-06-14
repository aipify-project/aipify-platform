-- Phase 101 — Commerce Intelligence Engine
-- Principle: A product is good when it fits the customer, store, supplier, margin and trust.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence'
  )
);

-- ---------------------------------------------------------------------------
-- 1. commerce_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  engine_enabled boolean not null default true,
  auto_import_disabled boolean not null default true,
  margin_threshold_percent numeric(5, 2) not null default 25.0,
  min_opportunity_score numeric(5, 2) not null default 70.0,
  discovery_mode text not null default 'balanced' check (
    discovery_mode in ('balanced', 'trend_focused', 'margin_focused', 'low_competition')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commerce_intelligence_settings enable row level security;
revoke all on public.commerce_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. commerce_products + opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_key text not null,
  name text not null,
  category text not null,
  description text,
  supplier_cost numeric(12, 2),
  recommended_price_min numeric(12, 2),
  recommended_price_max numeric(12, 2),
  currency text not null default 'NOK',
  unique (tenant_id, product_key)
);

alter table public.commerce_products enable row level security;
revoke all on public.commerce_products from authenticated, anon;

create table if not exists public.product_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  opportunity_score numeric(5, 2) not null check (opportunity_score between 0 and 100),
  recommendation_type text not null check (
    recommendation_type in (
      'test_product', 'add_watchlist', 'import_later', 'avoid_for_now',
      'find_alternative_supplier', 'improve_margin', 'bundle_product',
      'seasonal_campaign', 'request_sample'
    )
  ),
  recommendation_summary text not null,
  trend_confidence text not null default 'medium' check (
    trend_confidence in ('low', 'medium', 'high')
  ),
  competition_level text not null default 'medium' check (
    competition_level in ('low', 'medium', 'high', 'saturated')
  ),
  margin_classification text not null default 'good_margin' check (
    margin_classification in (
      'excellent_margin', 'good_margin', 'acceptable_margin', 'weak_margin', 'high_risk'
    )
  ),
  store_fit_score numeric(5, 2),
  status text not null default 'active' check (status in ('active', 'watchlist', 'dismissed', 'tested')),
  created_at timestamptz not null default now()
);

alter table public.product_opportunities enable row level security;
revoke all on public.product_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. trends, discovery, margins
-- ---------------------------------------------------------------------------
create table if not exists public.trend_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete set null,
  signal_type text not null check (
    signal_type in (
      'search_interest', 'social_trend', 'marketplace_popularity', 'seasonal_demand',
      'competitor_activity', 'review_velocity', 'supplier_catalog'
    )
  ),
  signal_strength text not null default 'medium' check (signal_strength in ('low', 'medium', 'high')),
  summary text not null,
  detected_at timestamptz not null default now()
);

alter table public.trend_signals enable row level security;
revoke all on public.trend_signals from authenticated, anon;

create table if not exists public.trend_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  title text not null,
  summary text not null,
  trend_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.trend_reports enable row level security;
revoke all on public.trend_reports from authenticated, anon;

create table if not exists public.product_discovery_runs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  discovery_mode text not null,
  status text not null default 'completed' check (status in ('running', 'completed', 'failed')),
  products_found int not null default 0,
  summary text,
  completed_at timestamptz not null default now()
);

alter table public.product_discovery_runs enable row level security;
revoke all on public.product_discovery_runs from authenticated, anon;

create table if not exists public.margin_analyses (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  supplier_cost numeric(12, 2) not null,
  estimated_landed_cost numeric(12, 2) not null,
  recommended_price_min numeric(12, 2) not null,
  recommended_price_max numeric(12, 2) not null,
  estimated_gross_margin_percent numeric(5, 2) not null,
  estimated_net_margin_percent numeric(5, 2) not null,
  margin_classification text not null,
  risk_note text,
  currency text not null default 'NOK',
  created_at timestamptz not null default now()
);

alter table public.margin_analyses enable row level security;
revoke all on public.margin_analyses from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. suppliers, scores, risks, store fit
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_key text not null,
  name text not null,
  delivery_time_days int,
  defect_rate_percent numeric(5, 2),
  price_stability text not null default 'stable' check (
    price_stability in ('stable', 'variable', 'increasing')
  ),
  stock_consistency text not null default 'consistent' check (
    stock_consistency in ('consistent', 'variable', 'unreliable')
  ),
  unique (tenant_id, supplier_key)
);

alter table public.supplier_profiles enable row level security;
revoke all on public.supplier_profiles from authenticated, anon;

create table if not exists public.supplier_insight_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete cascade,
  insight_score numeric(5, 2) not null check (insight_score between 0 and 100),
  risk_level text not null check (
    risk_level in ('trusted', 'approved_for_testing', 'monitor_closely', 'high_risk', 'avoid')
  ),
  strengths text not null,
  risks text,
  recommendation text not null,
  scored_at timestamptz not null default now()
);

alter table public.supplier_insight_scores enable row level security;
revoke all on public.supplier_insight_scores from authenticated, anon;

create table if not exists public.supplier_risk_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete cascade,
  event_type text not null,
  summary text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);

alter table public.supplier_risk_events enable row level security;
revoke all on public.supplier_risk_events from authenticated, anon;

create table if not exists public.product_opportunity_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  overall_score numeric(5, 2) not null,
  trend_score numeric(5, 2),
  margin_score numeric(5, 2),
  supplier_score numeric(5, 2),
  store_fit_score numeric(5, 2),
  competition_score numeric(5, 2),
  scored_at timestamptz not null default now()
);

alter table public.product_opportunity_scores enable row level security;
revoke all on public.product_opportunity_scores from authenticated, anon;

create table if not exists public.product_risk_flags (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  risk_code text not null,
  title text not null,
  explanation text not null,
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high')),
  resolved boolean not null default false
);

alter table public.product_risk_flags enable row level security;
revoke all on public.product_risk_flags from authenticated, anon;

create table if not exists public.store_fit_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  fit_score numeric(5, 2) not null,
  fit_summary text not null,
  audience_match text,
  category_alignment text,
  created_at timestamptz not null default now()
);

alter table public.store_fit_reports enable row level security;
revoke all on public.store_fit_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. recommendations, watchlists, seasonal, competitor
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete set null,
  section text not null check (
    section in (
      'best_opportunities', 'trending_now', 'high_margin', 'supplier_watchlist',
      'products_to_avoid', 'seasonal', 'store_fit'
    )
  ),
  title text not null,
  summary text not null,
  action_type text not null,
  priority int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.commerce_recommendations enable row level security;
revoke all on public.commerce_recommendations from authenticated, anon;

create table if not exists public.commerce_watchlists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (tenant_id, product_id)
);

alter table public.commerce_watchlists enable row level security;
revoke all on public.commerce_watchlists from authenticated, anon;

create table if not exists public.competitor_product_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  competitor_name text not null,
  product_name text not null,
  category text not null,
  signal_summary text not null,
  detected_at timestamptz not null default now()
);

alter table public.competitor_product_signals enable row level security;
revoke all on public.competitor_product_signals from authenticated, anon;

create table if not exists public.seasonal_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_id uuid references public.commerce_products (id) on delete set null,
  season_label text not null,
  title text not null,
  summary text not null,
  starts_at timestamptz,
  ends_at timestamptz
);

alter table public.seasonal_opportunities enable row level security;
revoke all on public.seasonal_opportunities from authenticated, anon;

create table if not exists public.commerce_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commerce_intelligence_briefings enable row level security;
revoke all on public.commerce_intelligence_briefings from authenticated, anon;

create table if not exists public.commerce_intelligence_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commerce_intelligence_audit_log enable row level security;
revoke all on public.commerce_intelligence_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_cie_)
-- ---------------------------------------------------------------------------
create or replace function public._cie_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cie_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.commerce_intelligence_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'commerce_intelligence_' || p_event_type, 'commerce_intelligence', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._cie_ensure_settings(p_tenant_id uuid)
returns public.commerce_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.commerce_intelligence_settings;
begin
  insert into public.commerce_intelligence_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.commerce_intelligence_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cie_seed_products(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.commerce_products (tenant_id, product_key, name, category, description, supplier_cost, recommended_price_min, recommended_price_max)
  select p_tenant_id, v.key, v.name, v.cat, v.item_description, v.cost, v.pmin, v.pmax
  from (values
    ('portable_blender', 'Portable Blender Bottle', 'Active Lifestyle', 'High trend confidence for fitness audience.', 120.0, 349.0, 399.0),
    ('training_accessory', 'Resistance Band Set Pro', 'Fitness', 'Strong bundle potential with existing training products.', 85.0, 249.0, 299.0),
    ('eco_water_bottle', 'Insulated Eco Water Bottle', 'Sustainable Living', 'Growing seasonal demand and good margin potential.', 95.0, 279.0, 329.0),
    ('wireless_earbuds', 'Budget Wireless Earbuds', 'Electronics', 'Trending but saturated market — proceed with caution.', 180.0, 399.0, 449.0),
    ('pet_grooming', 'Pet Grooming Kit', 'Pet Care', 'Rising search interest with medium competition.', 110.0, 299.0, 349.0),
    ('kitchen_gadget', 'Multi-Function Kitchen Chopper', 'Home & Kitchen', 'Good margin but weak store fit for lifestyle store.', 75.0, 199.0, 229.0)
  ) as v(key, name, cat, item_description, cost, pmin, pmax)
  where not exists (select 1 from public.commerce_products p where p.tenant_id = p_tenant_id and p.product_key = v.key);
end; $$;

create or replace function public._cie_seed_suppliers(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.supplier_profiles (tenant_id, supplier_key, name, delivery_time_days, defect_rate_percent, price_stability, stock_consistency)
  select p_tenant_id, v.key, v.name, v.days, v.defect, v.price, v.stock
  from (values
    ('nordic_fitness_supply', 'Nordic Fitness Supply', 5, 1.2, 'stable', 'consistent'),
    ('global_dropship_co', 'Global Dropship Co', 14, 4.5, 'variable', 'variable'),
    ('premium_active_goods', 'Premium Active Goods', 7, 0.8, 'stable', 'consistent')
  ) as v(key, name, days, defect, price, stock)
  where not exists (select 1 from public.supplier_profiles s where s.tenant_id = p_tenant_id and s.supplier_key = v.key);

  insert into public.supplier_insight_scores (tenant_id, supplier_id, insight_score, risk_level, strengths, risks, recommendation)
  select p_tenant_id, s.id, v.score, v.level, v.strengths, v.risks, v.rec
  from public.supplier_profiles s
  join (values
    ('nordic_fitness_supply', 84.0, 'approved_for_testing', 'Fast delivery, stable stock, good ratings.', 'Shipping cost increased last month.', 'Approved for testing with limited order volume.'),
    ('global_dropship_co', 52.0, 'high_risk', 'Wide catalog, low unit cost.', 'Long delivery, high defect rate, variable stock.', 'Avoid unless alternative supplier found.'),
    ('premium_active_goods', 91.0, 'trusted', 'Excellent quality, reliable communication.', 'Higher unit cost.', 'Trusted supplier for premium product testing.')
  ) as v(key, score, level, strengths, risks, rec) on s.supplier_key = v.key and s.tenant_id = p_tenant_id
  where not exists (select 1 from public.supplier_insight_scores sc where sc.supplier_id = s.id);
end; $$;

create or replace function public._cie_seed_opportunities(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.product_opportunities (tenant_id, product_id, opportunity_score, recommendation_type, recommendation_summary, trend_confidence, competition_level, margin_classification, store_fit_score, status)
  select p_tenant_id, p.id, v.score, v.rec_type, v.summary, v.trend, v.comp, v.margin, v.fit, v.status
  from public.commerce_products p
  join (values
    ('portable_blender', 91.0, 'test_product', 'Strong candidate for import and testing.', 'high', 'medium', 'good_margin', 88.0, 'active'),
    ('training_accessory', 87.0, 'bundle_product', 'Bundle with existing training accessories.', 'medium', 'low', 'excellent_margin', 92.0, 'active'),
    ('eco_water_bottle', 85.0, 'seasonal_campaign', 'Prepare seasonal campaign for summer demand.', 'high', 'medium', 'good_margin', 80.0, 'active'),
    ('wireless_earbuds', 42.0, 'avoid_for_now', 'Trending but saturated market with weak margin.', 'high', 'saturated', 'weak_margin', 35.0, 'active'),
    ('pet_grooming', 78.0, 'add_watchlist', 'Good opportunity — monitor supplier quality first.', 'medium', 'medium', 'acceptable_margin', 55.0, 'active'),
    ('kitchen_gadget', 38.0, 'avoid_for_now', 'Good margin but weak store fit for lifestyle catalog.', 'low', 'medium', 'good_margin', 28.0, 'active')
  ) as v(key, score, rec_type, summary, trend, comp, margin, fit, status) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.product_opportunities o where o.product_id = p.id);
end; $$;

create or replace function public._cie_seed_margins(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.margin_analyses (tenant_id, product_id, supplier_cost, estimated_landed_cost, recommended_price_min, recommended_price_max, estimated_gross_margin_percent, estimated_net_margin_percent, margin_classification, risk_note)
  select p_tenant_id, p.id, p.supplier_cost, p.supplier_cost * 1.375, p.recommended_price_min, p.recommended_price_max,
    round((p.recommended_price_min - p.supplier_cost * 1.375) / p.recommended_price_min * 100, 1),
    round((p.recommended_price_min - p.supplier_cost * 1.5) / p.recommended_price_min * 100, 1),
    case
      when (p.recommended_price_min - p.supplier_cost * 1.5) / p.recommended_price_min >= 0.45 then 'excellent_margin'
      when (p.recommended_price_min - p.supplier_cost * 1.5) / p.recommended_price_min >= 0.35 then 'good_margin'
      when (p.recommended_price_min - p.supplier_cost * 1.5) / p.recommended_price_min >= 0.25 then 'acceptable_margin'
      when (p.recommended_price_min - p.supplier_cost * 1.5) / p.recommended_price_min >= 0.15 then 'weak_margin'
      else 'high_risk'
    end,
    'Medium due to shipping cost variability.'
  from public.commerce_products p
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.margin_analyses m where m.product_id = p.id);
end; $$;

create or replace function public._cie_seed_trends_risks_fit(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.trend_signals (tenant_id, product_id, signal_type, signal_strength, summary)
  select p_tenant_id, p.id, v.type, v.strength, v.summary
  from public.commerce_products p
  join (values
    ('portable_blender', 'search_interest', 'high', 'Search interest up 34% in active lifestyle segment.'),
    ('portable_blender', 'social_trend', 'high', 'Social media trend velocity increasing.'),
    ('eco_water_bottle', 'seasonal_demand', 'high', 'Summer seasonal demand signal detected.'),
    ('wireless_earbuds', 'marketplace_popularity', 'high', 'High marketplace popularity but saturated.')
  ) as v(key, type, strength, summary) on p.product_key = v.key and p.tenant_id = p_tenant_id
  where not exists (select 1 from public.trend_signals t where t.product_id = p.id and t.signal_type = v.type limit 1);

  insert into public.product_risk_flags (tenant_id, product_id, risk_code, title, explanation, severity)
  select p_tenant_id, p.id, v.code, v.title, v.explanation, v.severity
  from public.commerce_products p
  join (values
    ('wireless_earbuds', 'saturated_market', 'Saturated market', 'High competition and ad cost dependency.', 'high'),
    ('wireless_earbuds', 'weak_margin', 'Weak net margin', 'Estimated net margin below threshold after ad costs.', 'medium'),
    ('global_dropship', 'unreliable_supplier', 'Supplier reliability weak', 'Long shipping times and high defect rate.', 'high')
  ) as v(key, code, title, explanation, severity) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.product_risk_flags r where r.product_id = p.id and r.risk_code = v.code);

  insert into public.store_fit_reports (tenant_id, product_id, fit_score, fit_summary, audience_match, category_alignment)
  select p_tenant_id, p.id, v.score, v.summary, v.audience, v.category
  from public.commerce_products p
  join (values
    ('portable_blender', 88.0, 'Matches active lifestyle category and can bundle with training accessories.', 'Active lifestyle audience', 'Strong category alignment'),
    ('training_accessory', 92.0, 'Excellent fit — complements existing bestsellers.', 'Fitness enthusiasts', 'Core category'),
    ('kitchen_gadget', 28.0, 'Weak store fit — does not match lifestyle brand identity.', 'Home cooks', 'Category mismatch')
  ) as v(key, score, summary, audience, category) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.store_fit_reports s where s.product_id = p.id);

  insert into public.seasonal_opportunities (tenant_id, product_id, season_label, title, summary, starts_at, ends_at)
  select p_tenant_id, p.id, 'Summer 2026', 'Summer Hydration Push', 'Prepare seasonal campaign for insulated bottles.', now() + interval '30 days', now() + interval '120 days'
  from public.commerce_products p where p.tenant_id = p_tenant_id and p.product_key = 'eco_water_bottle'
    and not exists (select 1 from public.seasonal_opportunities so where so.tenant_id = p_tenant_id limit 1);

  insert into public.competitor_product_signals (tenant_id, competitor_name, product_name, category, signal_summary)
  select p_tenant_id, v.comp, v.product, v.cat, v.summary
  from (values
    ('ActiveLife Store', 'Smart Shaker Pro', 'Active Lifestyle', 'Competitor selling similar product with strong reviews.'),
    ('FitGear Nordic', 'Resistance Band Bundle', 'Fitness', 'Competitor bundle strategy gaining traction.')
  ) as v(comp, product, cat, summary)
  where not exists (select 1 from public.competitor_product_signals c where c.tenant_id = p_tenant_id limit 1);

  insert into public.commerce_recommendations (tenant_id, product_id, section, title, summary, action_type, priority)
  select p_tenant_id, p.id, v.section, v.title, v.summary, v.action, v.pri
  from public.commerce_products p
  join (values
    ('portable_blender', 'best_opportunities', 'Portable Blender Bottle', 'Strong candidate — high trend, good margin, strong store fit.', 'test_product', 1),
    ('training_accessory', 'high_margin', 'Resistance Band Set Pro', 'Excellent margin with bundle potential.', 'bundle_product', 2),
    ('eco_water_bottle', 'seasonal', 'Insulated Eco Water Bottle', 'Seasonal opportunity approaching.', 'seasonal_campaign', 3),
    ('portable_blender', 'trending_now', 'Portable Blender — Trending', 'High trend confidence in active lifestyle segment.', 'test_product', 1),
    ('wireless_earbuds', 'products_to_avoid', 'Budget Wireless Earbuds', 'Trending but avoid — saturated market, weak margin.', 'avoid_for_now', 1),
    ('portable_blender', 'store_fit', 'Store Fit: Portable Blender', 'Matches active lifestyle category perfectly.', 'test_product', 1)
  ) as v(key, section, title, summary, action, pri) on p.product_key = v.key
  where p.tenant_id = p_tenant_id
    and not exists (select 1 from public.commerce_recommendations cr where cr.product_id = p.id and cr.section = v.section);
end; $$;

create or replace function public._cie_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_opportunities int;
  v_avg_score numeric;
  v_trending int;
  v_avoid int;
  v_intelligence_score numeric;
begin
  select count(*), coalesce(avg(opportunity_score), 0) into v_opportunities, v_avg_score
  from public.product_opportunities where tenant_id = p_tenant_id and status = 'active';

  select count(*) into v_trending from public.trend_signals where tenant_id = p_tenant_id and signal_strength = 'high';
  select count(*) into v_avoid from public.product_opportunities where tenant_id = p_tenant_id and recommendation_type = 'avoid_for_now';

  v_intelligence_score := least(100, round(v_avg_score * 0.6 + v_trending * 3 + 10, 1));

  return jsonb_build_object(
    'intelligence_score', v_intelligence_score,
    'opportunities_count', v_opportunities,
    'avg_opportunity_score', round(v_avg_score, 1),
    'trending_signals', v_trending,
    'products_to_avoid', v_avoid,
    'watchlist_count', (select count(*) from public.commerce_watchlists where tenant_id = p_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.run_product_discovery(p_mode text default 'balanced')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid; v_count int;
begin
  v_tenant_id := public._cie_require_tenant();
  perform public._cie_seed_products(v_tenant_id);
  perform public._cie_seed_opportunities(v_tenant_id);

  select count(*) into v_count from public.product_opportunities where tenant_id = v_tenant_id;

  insert into public.product_discovery_runs (tenant_id, discovery_mode, status, products_found, summary)
  values (v_tenant_id, coalesce(p_mode, 'balanced'), 'completed', v_count,
    'Discovery run found ' || v_count || ' product opportunities.')
  returning id into v_id;

  perform public._cie_log_audit(v_tenant_id, 'discovery_run', 'Product discovery completed', 'discovery_engine',
    jsonb_build_object('mode', p_mode, 'products_found', v_count));

  return jsonb_build_object('run_id', v_id, 'products_found', v_count, 'status', 'completed');
end; $$;

create or replace function public.analyze_product_margin(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_analysis public.margin_analyses;
begin
  v_tenant_id := public._cie_require_tenant();
  perform public._cie_seed_margins(v_tenant_id);

  select * into v_analysis from public.margin_analyses
  where product_id = p_product_id and tenant_id = v_tenant_id order by created_at desc limit 1;

  perform public._cie_log_audit(v_tenant_id, 'margin_analyzed', 'Margin analysis completed', 'margin_engine',
    jsonb_build_object('product_id', p_product_id));

  return jsonb_build_object(
    'product_id', p_product_id,
    'estimated_net_margin_percent', v_analysis.estimated_net_margin_percent,
    'margin_classification', v_analysis.margin_classification,
    'recommended_price_min', v_analysis.recommended_price_min,
    'recommended_price_max', v_analysis.recommended_price_max,
    'risk_note', v_analysis.risk_note
  );
end; $$;

create or replace function public.add_commerce_watchlist(p_product_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cie_require_tenant();
  insert into public.commerce_watchlists (tenant_id, product_id) values (v_tenant_id, p_product_id)
  on conflict (tenant_id, product_id) do nothing;

  update public.product_opportunities set status = 'watchlist'
  where tenant_id = v_tenant_id and product_id = p_product_id;

  perform public._cie_log_audit(v_tenant_id, 'watchlist_added', 'Product added to watchlist', 'watchlist',
    jsonb_build_object('product_id', p_product_id));

  return jsonb_build_object('status', 'watchlist');
end; $$;

create or replace function public.record_commerce_recommendation_action(p_product_id uuid, p_action text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cie_require_tenant();

  perform public._cie_log_audit(v_tenant_id, 'recommendation_action', 'Recommendation action recorded', 'human_approval',
    jsonb_build_object('product_id', p_product_id, 'action', p_action, 'auto_import', false));

  return jsonb_build_object('status', 'recorded', 'action', p_action, 'requires_approval', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_commerce_intelligence_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._cie_require_tenant();
  v_metrics := public._cie_refresh_metrics(v_tenant_id);
  v_summary := 'Commerce briefing: score ' || (v_metrics->>'intelligence_score') || '/100, '
    || (v_metrics->>'opportunities_count') || ' opportunities, '
    || (v_metrics->>'trending_signals') || ' trending signals.';

  insert into public.commerce_intelligence_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._cie_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_commerce_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cie_ensure_settings(v_tenant_id);
  v_metrics := public._cie_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'intelligence_score', v_metrics->'intelligence_score',
    'opportunities_count', v_metrics->'opportunities_count',
    'philosophy', 'Find better products. Understand the market. Grow smarter.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_commerce_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._cie_require_tenant();
  v_settings := public._cie_ensure_settings(v_tenant_id);
  perform public._cie_seed_products(v_tenant_id);
  perform public._cie_seed_suppliers(v_tenant_id);
  perform public._cie_seed_opportunities(v_tenant_id);
  perform public._cie_seed_margins(v_tenant_id);
  perform public._cie_seed_trends_risks_fit(v_tenant_id);
  v_metrics := public._cie_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_import_disabled', v_settings.auto_import_disabled,
    'philosophy', 'Find better products. Understand the market. Grow smarter.',
    'safety_note', 'Phase 101 provides intelligence and recommendations only. Product import requires human approval.',
    'engine_enabled', v_settings.engine_enabled,
    'margin_threshold_percent', v_settings.margin_threshold_percent,
    'discovery_mode', v_settings.discovery_mode,
    'intelligence_score', v_metrics->'intelligence_score',
    'opportunities_count', v_metrics->'opportunities_count',
    'avg_opportunity_score', v_metrics->'avg_opportunity_score',
    'trending_signals', v_metrics->'trending_signals',
    'products_to_avoid_count', v_metrics->'products_to_avoid',
    'watchlist_count', v_metrics->'watchlist_count',
    'best_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'product_id', o.product_id, 'product_name', p.name, 'category', p.category,
        'opportunity_score', o.opportunity_score, 'recommendation_type', o.recommendation_type,
        'recommendation_summary', o.recommendation_summary, 'trend_confidence', o.trend_confidence,
        'competition_level', o.competition_level, 'margin_classification', o.margin_classification,
        'store_fit_score', o.store_fit_score, 'on_watchlist', exists(
          select 1 from public.commerce_watchlists w where w.product_id = o.product_id and w.tenant_id = v_tenant_id
        )
      ) order by o.opportunity_score desc)
      from public.product_opportunities o
      join public.commerce_products p on p.id = o.product_id
      where o.tenant_id = v_tenant_id and o.recommendation_type in ('test_product', 'bundle_product', 'seasonal_campaign')
    ), '[]'::jsonb),
    'trending_now', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', t.id, 'product_name', p.name, 'signal_type', t.signal_type,
        'signal_strength', t.signal_strength, 'summary', t.summary
      ) order by t.detected_at desc)
      from public.trend_signals t
      left join public.commerce_products p on p.id = t.product_id
      where t.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'high_margin_candidates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'product_id', m.product_id, 'product_name', p.name,
        'estimated_net_margin_percent', m.estimated_net_margin_percent,
        'margin_classification', m.margin_classification,
        'recommended_price_min', m.recommended_price_min,
        'recommended_price_max', m.recommended_price_max,
        'risk_note', m.risk_note
      ) order by m.estimated_net_margin_percent desc)
      from public.margin_analyses m
      join public.commerce_products p on p.id = m.product_id
      where m.tenant_id = v_tenant_id and m.margin_classification in ('excellent_margin', 'good_margin')
    ), '[]'::jsonb),
    'supplier_watchlist', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sc.id, 'supplier_name', s.name, 'insight_score', sc.insight_score,
        'risk_level', sc.risk_level, 'strengths', sc.strengths, 'risks', sc.risks,
        'recommendation', sc.recommendation
      ) order by sc.insight_score desc)
      from public.supplier_insight_scores sc
      join public.supplier_profiles s on s.id = sc.supplier_id
      where sc.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'products_to_avoid', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'product_id', o.product_id, 'product_name', p.name,
        'opportunity_score', o.opportunity_score, 'recommendation_summary', o.recommendation_summary,
        'risk_flags', coalesce((
          select jsonb_agg(jsonb_build_object('title', r.title, 'explanation', r.explanation, 'severity', r.severity))
          from public.product_risk_flags r where r.product_id = o.product_id and r.resolved = false
        ), '[]'::jsonb)
      ))
      from public.product_opportunities o
      join public.commerce_products p on p.id = o.product_id
      where o.tenant_id = v_tenant_id and o.recommendation_type = 'avoid_for_now'
    ), '[]'::jsonb),
    'seasonal_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', so.id, 'season_label', so.season_label, 'title', so.title,
        'summary', so.summary, 'product_name', p.name
      ))
      from public.seasonal_opportunities so
      left join public.commerce_products p on p.id = so.product_id
      where so.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'store_fit_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', sf.id, 'product_id', sf.product_id, 'product_name', p.name,
        'fit_score', sf.fit_score, 'fit_summary', sf.fit_summary,
        'audience_match', sf.audience_match, 'category_alignment', sf.category_alignment
      ) order by sf.fit_score desc)
      from public.store_fit_reports sf
      join public.commerce_products p on p.id = sf.product_id
      where sf.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'commerce_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', cr.id, 'section', cr.section, 'title', cr.title,
        'summary', cr.summary, 'action_type', cr.action_type
      ) order by cr.priority)
      from public.commerce_recommendations cr where cr.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'discovery_runs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', dr.id, 'discovery_mode', dr.discovery_mode, 'products_found', dr.products_found,
        'summary', dr.summary, 'completed_at', dr.completed_at
      ) order by dr.completed_at desc)
      from public.product_discovery_runs dr where dr.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.commerce_intelligence_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'platform_install', 'Store catalog from connected platforms',
      'marketplace_governance', 'Product quality standards',
      'strategic_intelligence', 'Market and competitor signals',
      'knowledge_center', 'Commerce intelligence guides and FAQ'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-intelligence', 'Commerce Intelligence', 'Product discovery, trends, margin analysis and supplier insights.', 'authenticated', 45
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'commerce-intelligence' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_commerce_intelligence_card() to authenticated;
grant execute on function public.get_commerce_intelligence_dashboard() to authenticated;
grant execute on function public.generate_commerce_intelligence_briefing() to authenticated;
grant execute on function public.run_product_discovery(text) to authenticated;
grant execute on function public.analyze_product_margin(uuid) to authenticated;
grant execute on function public.add_commerce_watchlist(uuid) to authenticated;
grant execute on function public.record_commerce_recommendation_action(uuid, text) to authenticated;
