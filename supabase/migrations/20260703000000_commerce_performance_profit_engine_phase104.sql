-- Phase 104 — Commerce Performance & Profit Engine
-- Principle: Revenue measures activity. Profitability reflects sustainability.

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
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance'
  )
);

-- ---------------------------------------------------------------------------
-- 1. commerce_performance_settings
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_performance_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  engine_enabled boolean not null default true,
  auto_actions_disabled boolean not null default true,
  margin_alert_threshold numeric(5, 2) not null default 20.0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commerce_performance_settings enable row level security;
revoke all on public.commerce_performance_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. performance scores + health scores
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_performance_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5, 2) not null check (overall_score between 0 and 100),
  performance_classification text not null check (
    performance_classification in (
      'exceptional', 'strong', 'stable', 'needs_attention', 'strategic_review'
    )
  ),
  revenue_consistency_score numeric(5, 2),
  profitability_score numeric(5, 2),
  product_health_score numeric(5, 2),
  customer_value_score numeric(5, 2),
  operational_stability_score numeric(5, 2),
  scored_at timestamptz not null default now()
);

alter table public.commerce_performance_scores enable row level security;
revoke all on public.commerce_performance_scores from authenticated, anon;

create table if not exists public.commerce_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  health_score numeric(5, 2) not null,
  gross_profit_margin_percent numeric(5, 2),
  net_profit_margin_percent numeric(5, 2),
  revenue_trend text not null default 'stable' check (
    revenue_trend in ('accelerating', 'positive_momentum', 'stable', 'seasonal', 'declining')
  ),
  profit_trend text not null default 'stable' check (
    profit_trend in ('improving', 'stable', 'under_pressure', 'declining')
  ),
  scored_at timestamptz not null default now()
);

alter table public.commerce_health_scores enable row level security;
revoke all on public.commerce_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. profit intelligence + product profitability
-- ---------------------------------------------------------------------------
create table if not exists public.profit_intelligence_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_type text not null check (
    report_type in ('gross_profitability', 'net_profitability', 'cost_observation', 'return_impact', 'operational_impact')
  ),
  title text not null,
  summary text not null,
  observation text not null,
  impact_level text not null default 'moderate' check (
    impact_level in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now()
);

alter table public.profit_intelligence_reports enable row level security;
revoke all on public.profit_intelligence_reports from authenticated, anon;

create table if not exists public.product_profitability_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_key text not null,
  product_name text not null,
  category text not null,
  revenue_contribution numeric(12, 2) not null default 0,
  gross_margin_percent numeric(5, 2) not null,
  net_margin_percent numeric(5, 2),
  profit_contribution_percent numeric(5, 2) not null,
  profit_classification text not null check (
    profit_classification in (
      'high_contribution', 'strong_performer', 'stable_contributor', 'needs_review', 'profit_risk'
    )
  ),
  seasonal_pattern text,
  unique (tenant_id, product_key)
);

alter table public.product_profitability_profiles enable row level security;
revoke all on public.product_profitability_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. customer value + revenue trends
-- ---------------------------------------------------------------------------
create table if not exists public.customer_value_observations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  observation_type text not null check (
    observation_type in ('repeat_purchase', 'engagement', 'loyalty', 'behavior', 'ltv_opportunity')
  ),
  title text not null,
  summary text not null,
  trend_direction text not null default 'stable' check (
    trend_direction in ('improving', 'stable', 'declining')
  ),
  created_at timestamptz not null default now()
);

alter table public.customer_value_observations enable row level security;
revoke all on public.customer_value_observations from authenticated, anon;

create table if not exists public.revenue_trend_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  period_label text not null,
  revenue_amount numeric(14, 2) not null,
  profit_amount numeric(14, 2) not null,
  margin_percent numeric(5, 2) not null,
  trend_signal text not null check (
    trend_signal in ('positive_momentum', 'seasonal', 'growth_acceleration', 'stable', 'declining')
  ),
  summary text not null,
  period_start timestamptz not null,
  period_end timestamptz not null
);

alter table public.revenue_trend_reports enable row level security;
revoke all on public.revenue_trend_reports from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. opportunities, loss prevention, executive reports
-- ---------------------------------------------------------------------------
create table if not exists public.performance_opportunity_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_type text not null check (
    opportunity_type in (
      'portfolio_adjustment', 'category_expansion', 'pricing_review', 'cross_sell',
      'bundle_opportunity', 'retention_initiative'
    )
  ),
  title text not null,
  summary text not null,
  rationale text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now()
);

alter table public.performance_opportunity_recommendations enable row level security;
revoke all on public.performance_opportunity_recommendations from authenticated, anon;

create table if not exists public.loss_prevention_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'margin_deterioration', 'high_refunds', 'product_concern',
      'supplier_inefficiency', 'customer_dissatisfaction'
    )
  ),
  title text not null,
  summary text not null,
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'important', 'critical')
  ),
  resolved boolean not null default false,
  detected_at timestamptz not null default now()
);

alter table public.loss_prevention_events enable row level security;
revoke all on public.loss_prevention_events from authenticated, anon;

create table if not exists public.executive_commerce_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.executive_commerce_reports enable row level security;
revoke all on public.executive_commerce_reports from authenticated, anon;

create table if not exists public.strategic_performance_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  section text not null check (
    section in (
      'performance_overview', 'profit_intelligence', 'product_contribution',
      'customer_value', 'opportunity_center', 'risk_indicators', 'strategic_recommendations'
    )
  ),
  title text not null,
  summary text not null,
  recommendation_type text not null,
  priority text not null default 'moderate',
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.strategic_performance_recommendations enable row level security;
revoke all on public.strategic_performance_recommendations from authenticated, anon;

create table if not exists public.performance_recommendation_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_id uuid references public.strategic_performance_recommendations (id) on delete set null,
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.performance_recommendation_audits enable row level security;
revoke all on public.performance_recommendation_audits from authenticated, anon;

create table if not exists public.commerce_performance_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commerce_performance_audit_log enable row level security;
revoke all on public.commerce_performance_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_cpp_)
-- ---------------------------------------------------------------------------
create or replace function public._cpp_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._cpp_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.commerce_performance_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'commerce_performance_' || p_event_type, 'commerce_performance', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._cpp_ensure_settings(p_tenant_id uuid)
returns public.commerce_performance_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.commerce_performance_settings;
begin
  insert into public.commerce_performance_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.commerce_performance_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._cpp_seed_products(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.product_profitability_profiles (
    tenant_id, product_key, product_name, category, revenue_contribution,
    gross_margin_percent, net_margin_percent, profit_contribution_percent, profit_classification, seasonal_pattern
  )
  select p_tenant_id, v.key, v.name, v.cat, v.revenue, v.gross, v.net, v.contrib, v.class, v.season
  from (values
    ('portable_blender_pro', 'Portable Blender Pro', 'Active Lifestyle', 84200.00, 42.0, 28.0, 18.5, 'high_contribution', 'Summer peak'),
    ('resistance_band_set', 'Resistance Band Set Pro', 'Fitness', 62400.00, 48.0, 35.0, 14.2, 'strong_performer', 'Stable year-round'),
    ('eco_water_bottle', 'Insulated Eco Water Bottle', 'Sustainable Living', 51800.00, 38.0, 22.0, 11.8, 'stable_contributor', 'Summer seasonal'),
    ('yoga_mat_premium', 'Premium Yoga Mat', 'Fitness', 38600.00, 52.0, 38.0, 8.7, 'strong_performer', 'Stable'),
    ('wireless_earbuds_budget', 'Budget Wireless Earbuds', 'Electronics', 29400.00, 12.0, 4.0, 2.1, 'profit_risk', 'Declining'),
    ('kitchen_gadget_misc', 'Kitchen Gadget Bundle', 'Home', 18200.00, 18.0, 6.0, 1.3, 'needs_review', 'Weak store fit')
  ) as v(key, name, cat, revenue, gross, net, contrib, class, season)
  where not exists (select 1 from public.product_profitability_profiles p where p.tenant_id = p_tenant_id and p.product_key = v.key);
end; $$;

create or replace function public._cpp_seed_insights(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.profit_intelligence_reports (tenant_id, report_type, title, summary, observation, impact_level)
  select p_tenant_id, v.type, v.title, v.summary, v.obs, v.impact
  from (values
    ('gross_profitability', 'Gross Profitability Stable', 'Gross margins holding within target range for core categories.', 'Active lifestyle and fitness categories contribute 62% of gross profit.', 'moderate'),
    ('net_profitability', 'Net Margin Under Pressure', 'Ad spend and shipping costs reducing net margins on trending products.', 'Portable blender net margin down 4% vs last quarter after ad scaling.', 'important'),
    ('return_impact', 'Return Rate Impact', 'Electronics category showing elevated return-related profit erosion.', 'Budget earbuds return rate at 12% — significantly above category average.', 'important'),
    ('operational_impact', 'Operational Efficiency', 'Fulfillment costs stable for primary suppliers.', 'Premium Active Goods maintaining consistent landed cost.', 'informational')
  ) as v(type, title, summary, obs, impact)
  where not exists (select 1 from public.profit_intelligence_reports r where r.tenant_id = p_tenant_id limit 1);

  insert into public.customer_value_observations (tenant_id, observation_type, title, summary, trend_direction)
  select p_tenant_id, v.type, v.title, v.summary, v.trend
  from (values
    ('repeat_purchase', 'Repeat Purchase Rate Improving', 'Fitness category showing 22% repeat purchase rate — up from 18% last quarter.', 'improving'),
    ('loyalty', 'Loyalty Signals Strong', 'Customers purchasing 3+ items show 2.4x higher lifetime value.', 'improving'),
    ('engagement', 'Engagement Stable', 'Email engagement rates stable across active customer segments.', 'stable'),
    ('ltv_opportunity', 'Retention Opportunity', 'First-time buyers in sustainable living category have low repeat rate — retention initiative recommended.', 'declining')
  ) as v(type, title, summary, trend)
  where not exists (select 1 from public.customer_value_observations c where c.tenant_id = p_tenant_id limit 1);

  insert into public.revenue_trend_reports (tenant_id, period_label, revenue_amount, profit_amount, margin_percent, trend_signal, summary, period_start, period_end)
  select p_tenant_id, v.label, v.rev, v.profit, v.margin, v.signal, v.summary, v.period_start, v.period_end
  from (values
    ('Q1 2026', 284600.00, 68200.00, 24.0, 'positive_momentum', 'Revenue up 12% with improving fitness category contribution.', now() - interval '90 days', now() - interval '1 day'),
    ('Q4 2025', 254100.00, 54800.00, 21.6, 'stable', 'Stable quarter with seasonal hydration push.', now() - interval '180 days', now() - interval '91 days'),
    ('Q3 2025', 231800.00, 49200.00, 21.2, 'growth_acceleration', 'Growth acceleration driven by active lifestyle expansion.', now() - interval '270 days', now() - interval '181 days')
  ) as v(label, rev, profit, margin, signal, summary, period_start, period_end)
  where not exists (select 1 from public.revenue_trend_reports r where r.tenant_id = p_tenant_id limit 1);

  insert into public.performance_opportunity_recommendations (tenant_id, opportunity_type, title, summary, rationale, priority)
  select p_tenant_id, v.type, v.title, v.summary, v.rationale, v.priority
  from (values
    ('bundle_opportunity', 'Fitness Accessory Bundle', 'Bundle resistance bands with portable blender for higher AOV.', 'Combined margin 44% with strong store fit and cross-sell potential.', 'important'),
    ('category_expansion', 'Expand Sustainable Living', 'Eco bottle category showing seasonal profit potential.', 'Summer demand signal with 38% gross margin.', 'moderate'),
    ('pricing_review', 'Review Budget Earbuds Pricing', 'Current pricing insufficient to cover ad and return costs.', 'Net margin at 4% — below sustainability threshold.', 'important'),
    ('retention_initiative', 'First-Buyer Retention Campaign', 'Target sustainable living first-time buyers with follow-up offers.', 'Low repeat rate represents untapped LTV opportunity.', 'moderate'),
    ('cross_sell', 'Cross-sell Yoga Mat to Fitness Buyers', 'Yoga mat purchasers overlap with resistance band audience.', '52% gross margin with proven repeat purchase pattern.', 'informational')
  ) as v(type, title, summary, rationale, priority)
  where not exists (select 1 from public.performance_opportunity_recommendations o where o.tenant_id = p_tenant_id limit 1);

  insert into public.loss_prevention_events (tenant_id, event_type, title, summary, severity)
  select p_tenant_id, v.type, v.title, v.summary, v.severity
  from (values
    ('margin_deterioration', 'Margin Deterioration — Earbuds', 'Budget wireless earbuds net margin declined to 4% after ad scaling.', 'important'),
    ('high_refunds', 'Elevated Refund Activity', 'Electronics category refund rate 12% — investigate product quality messaging.', 'important'),
    ('product_concern', 'Kitchen Gadget Underperforming', 'Kitchen gadget bundle weak store fit with 6% net margin.', 'moderate'),
    ('customer_dissatisfaction', 'Shipping Complaint Trend', 'Minor increase in shipping-related complaints for budget supplier.', 'moderate')
  ) as v(type, title, summary, severity)
  where not exists (select 1 from public.loss_prevention_events l where l.tenant_id = p_tenant_id limit 1);

  insert into public.strategic_performance_recommendations (tenant_id, section, title, summary, recommendation_type, priority, rationale)
  select p_tenant_id, v.section, v.title, v.summary, v.type, v.priority, v.rationale
  from (values
    ('performance_overview', 'Performance Stable with Growth Momentum', 'Commerce performance score reflects healthy core with selective risks.', 'monitor', 'moderate', 'Revenue consistency and product health support continued operations.'),
    ('profit_intelligence', 'Monitor Net Margin Trends', 'Ad scaling on trending products compressing net margins.', 'review_profitability', 'important', 'Gross profit strong but net margin requires attention on ad-heavy SKUs.'),
    ('product_contribution', 'Review Budget Earbuds', 'Profit risk classification — consider discontinuation or repricing.', 'review_product', 'important', '4% net margin unsustainable with current return and ad costs.'),
    ('customer_value', 'Strengthen Retention Initiatives', 'First-buyer repeat rate opportunity in sustainable living.', 'retention_initiative', 'moderate', 'LTV improvement often more valuable than new customer acquisition.'),
    ('opportunity_center', 'Launch Fitness Bundle', 'High-margin bundle opportunity with proven cross-sell audience.', 'explore_bundle', 'important', 'Combined products show strong margin and store fit.'),
    ('risk_indicators', 'Address Refund Trend', 'Electronics refund rate requires investigation.', 'investigate_refunds', 'important', 'Preventing losses as valuable as increasing sales.'),
    ('strategic_recommendations', 'Focus on Quality of Growth', 'Prioritize profitable categories over volume-only expansion.', 'strategic_review', 'moderate', 'Revenue without profitability is not sustainable.')
  ) as v(section, title, summary, type, priority, rationale)
  where not exists (select 1 from public.strategic_performance_recommendations s where s.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._cpp_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_score numeric;
  v_classification text;
  v_revenue numeric;
  v_profit numeric;
  v_margin numeric;
  v_risks int;
  v_opportunities int;
begin
  select coalesce(sum(revenue_contribution), 0),
    coalesce(avg(net_margin_percent), 0),
    coalesce(avg(gross_margin_percent), 0)
  into v_revenue, v_margin, v_score
  from public.product_profitability_profiles where tenant_id = p_tenant_id;

  select coalesce(sum(revenue_contribution * net_margin_percent / 100), 0) into v_profit
  from public.product_profitability_profiles where tenant_id = p_tenant_id;

  select count(*) into v_risks from public.loss_prevention_events where tenant_id = p_tenant_id and resolved = false;
  select count(*) into v_opportunities from public.performance_opportunity_recommendations where tenant_id = p_tenant_id;

  v_score := least(100, round(
    coalesce((select avg(net_margin_percent) from public.product_profitability_profiles where tenant_id = p_tenant_id), 20) * 1.5
    + coalesce((select count(*) from public.product_profitability_profiles where tenant_id = p_tenant_id and profit_classification in ('high_contribution', 'strong_performer')), 0) * 5
    - v_risks * 4 + 15, 1));

  v_classification := case
    when v_score >= 90 then 'exceptional'
    when v_score >= 78 then 'strong'
    when v_score >= 65 then 'stable'
    when v_score >= 50 then 'needs_attention'
    else 'strategic_review'
  end;

  insert into public.commerce_performance_scores (
    tenant_id, overall_score, performance_classification,
    revenue_consistency_score, profitability_score, product_health_score, customer_value_score, operational_stability_score
  )
  select p_tenant_id, v_score, v_classification, 82.0, v_margin * 2, 78.0, 74.0, 80.0
  where not exists (
    select 1 from public.commerce_performance_scores s
    where s.tenant_id = p_tenant_id and s.scored_at > now() - interval '1 hour'
  );

  insert into public.commerce_health_scores (tenant_id, health_score, gross_profit_margin_percent, net_profit_margin_percent, revenue_trend, profit_trend)
  select p_tenant_id, v_score, v_score * 0.55, v_margin, 'positive_momentum', case when v_margin >= 25 then 'improving' else 'under_pressure' end
  where not exists (
    select 1 from public.commerce_health_scores h
    where h.tenant_id = p_tenant_id and h.scored_at > now() - interval '1 hour'
  );

  return jsonb_build_object(
    'performance_score', v_score,
    'performance_classification', v_classification,
    'total_revenue', v_revenue,
    'estimated_profit', round(v_profit, 0),
    'avg_net_margin_percent', round(v_margin, 1),
    'open_risks', v_risks,
    'opportunity_count', v_opportunities,
    'products_tracked', (select count(*) from public.product_profitability_profiles where tenant_id = p_tenant_id),
    'profit_risk_products', (select count(*) from public.product_profitability_profiles where tenant_id = p_tenant_id and profit_classification = 'profit_risk')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_performance_recommendation_action(
  p_recommendation_id uuid, p_action text, p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._cpp_require_tenant();

  insert into public.performance_recommendation_audits (tenant_id, recommendation_id, action, notes)
  values (v_tenant_id, p_recommendation_id, p_action, p_notes);

  perform public._cpp_log_audit(v_tenant_id, 'recommendation_action', 'Performance recommendation action recorded', 'human_approval',
    jsonb_build_object('recommendation_id', p_recommendation_id, 'action', p_action, 'auto_actions', false));

  return jsonb_build_object('status', 'recorded', 'action', p_action, 'requires_approval', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_commerce_performance_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._cpp_require_tenant();
  v_metrics := public._cpp_refresh_metrics(v_tenant_id);
  v_summary := 'Executive commerce report: score ' || (v_metrics->>'performance_score') || '/100, '
    || (v_metrics->>'avg_net_margin_percent') || '% net margin, '
    || (v_metrics->>'open_risks') || ' risk indicators.';

  insert into public.executive_commerce_reports (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._cpp_log_audit(v_tenant_id, 'executive_report_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('report_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_commerce_performance_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._cpp_ensure_settings(v_tenant_id);
  v_metrics := public._cpp_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'performance_score', v_metrics->'performance_score',
    'performance_classification', v_metrics->'performance_classification',
    'philosophy', 'Revenue is important. Profit is essential.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_commerce_performance_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_performance_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._cpp_require_tenant();
  v_settings := public._cpp_ensure_settings(v_tenant_id);
  perform public._cpp_seed_products(v_tenant_id);
  perform public._cpp_seed_insights(v_tenant_id);
  v_metrics := public._cpp_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_actions_disabled', v_settings.auto_actions_disabled,
    'philosophy', 'Revenue is important. Profit is essential.',
    'safety_note', 'Aipify provides decision-support insights — organizations remain responsible for commercial actions. Does not replace professional financial expertise.',
    'engine_enabled', v_settings.engine_enabled,
    'margin_alert_threshold', v_settings.margin_alert_threshold,
    'performance_score', v_metrics->'performance_score',
    'performance_classification', v_metrics->'performance_classification',
    'total_revenue', v_metrics->'total_revenue',
    'estimated_profit', v_metrics->'estimated_profit',
    'avg_net_margin_percent', v_metrics->'avg_net_margin_percent',
    'open_risks', v_metrics->'open_risks',
    'opportunity_count', v_metrics->'opportunity_count',
    'products_tracked', v_metrics->'products_tracked',
    'profit_risk_products', v_metrics->'profit_risk_products',
    'profit_intelligence', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'report_type', r.report_type, 'title', r.title,
        'summary', r.summary, 'observation', r.observation, 'impact_level', r.impact_level
      ) order by r.created_at desc)
      from public.profit_intelligence_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_profitability', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_key', p.product_key, 'product_name', p.product_name,
        'category', p.category, 'revenue_contribution', p.revenue_contribution,
        'gross_margin_percent', p.gross_margin_percent, 'net_margin_percent', p.net_margin_percent,
        'profit_contribution_percent', p.profit_contribution_percent,
        'profit_classification', p.profit_classification, 'seasonal_pattern', p.seasonal_pattern
      ) order by p.profit_contribution_percent desc)
      from public.product_profitability_profiles p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'customer_value_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'observation_type', c.observation_type, 'title', c.title,
        'summary', c.summary, 'trend_direction', c.trend_direction
      ) order by c.created_at desc)
      from public.customer_value_observations c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'revenue_trends', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'period_label', r.period_label, 'revenue_amount', r.revenue_amount,
        'profit_amount', r.profit_amount, 'margin_percent', r.margin_percent,
        'trend_signal', r.trend_signal, 'summary', r.summary
      ) order by r.period_start desc)
      from public.revenue_trend_reports r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'performance_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title,
        'summary', o.summary, 'rationale', o.rationale, 'priority', o.priority
      ) order by o.created_at desc)
      from public.performance_opportunity_recommendations o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'loss_prevention', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'event_type', l.event_type, 'title', l.title,
        'summary', l.summary, 'severity', l.severity, 'resolved', l.resolved
      ) order by l.detected_at desc)
      from public.loss_prevention_events l where l.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'section', s.section, 'title', s.title, 'summary', s.summary,
        'recommendation_type', s.recommendation_type, 'priority', s.priority, 'rationale', s.rationale
      ) order by s.created_at desc)
      from public.strategic_performance_recommendations s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'executive_reports', coalesce((
      select jsonb_agg(jsonb_build_object('id', e.id, 'summary', e.summary, 'created_at', e.created_at)
        order by e.created_at desc)
      from public.executive_commerce_reports e where e.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commerce_intelligence', 'Product opportunities and margin signals',
      'product_automation', 'Catalog quality and readiness',
      'dropshipping_operations', 'Operational stability and supplier context',
      'knowledge_center', 'Commerce performance guides and FAQ'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-performance', 'Commerce Performance & Profit', 'Performance dashboards, profit intelligence, product profitability and strategic commerce reporting.', 'authenticated', 48
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'commerce-performance' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_commerce_performance_card() to authenticated;
grant execute on function public.get_commerce_performance_dashboard() to authenticated;
grant execute on function public.generate_commerce_performance_briefing() to authenticated;
grant execute on function public.record_performance_recommendation_action(uuid, text, text) to authenticated;
