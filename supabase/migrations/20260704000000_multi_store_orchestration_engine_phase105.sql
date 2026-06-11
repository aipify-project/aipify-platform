-- Phase 105 — Multi-Store Orchestration Engine
-- Principle: Growth creates complexity. Coordination should not eliminate flexibility.

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
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration'
  )
);

-- ---------------------------------------------------------------------------
-- 1. multi_store_orchestration_settings
-- ---------------------------------------------------------------------------
create table if not exists public.multi_store_orchestration_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  orchestration_enabled boolean not null default true,
  auto_sync_disabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.multi_store_orchestration_settings enable row level security;
revoke all on public.multi_store_orchestration_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. store portfolios + members
-- ---------------------------------------------------------------------------
create table if not exists public.store_portfolios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  portfolio_key text not null,
  portfolio_name text not null,
  description text,
  unique (tenant_id, portfolio_key)
);

alter table public.store_portfolios enable row level security;
revoke all on public.store_portfolios from authenticated, anon;

create table if not exists public.portfolio_members (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  portfolio_id uuid references public.store_portfolios (id) on delete cascade,
  store_key text not null,
  store_name text not null,
  platform_type text not null check (
    platform_type in ('shopify', 'woocommerce', 'mixed', 'other')
  ),
  brand_group text,
  region text not null default 'Nordic',
  ownership_label text,
  status_level text not null default 'active' check (
    status_level in ('active', 'growing', 'stable', 'needs_attention', 'strategic_review')
  ),
  revenue_amount numeric(14, 2) not null default 0,
  profit_margin_percent numeric(5, 2),
  performance_score numeric(5, 2),
  created_at timestamptz not null default now(),
  unique (tenant_id, store_key)
);

alter table public.portfolio_members enable row level security;
revoke all on public.portfolio_members from authenticated, anon;

create table if not exists public.portfolio_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  portfolio_id uuid references public.store_portfolios (id) on delete set null,
  overall_score numeric(5, 2) not null check (overall_score between 0 and 100),
  portfolio_classification text not null check (
    portfolio_classification in (
      'exceptional', 'strong', 'stable', 'needs_attention', 'strategic_intervention'
    )
  ),
  performance_consistency_score numeric(5, 2),
  profit_score numeric(5, 2),
  governance_score numeric(5, 2),
  operational_stability_score numeric(5, 2),
  scored_at timestamptz not null default now()
);

alter table public.portfolio_health_scores enable row level security;
revoke all on public.portfolio_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. cross-store insights + product sync
-- ---------------------------------------------------------------------------
create table if not exists public.cross_store_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_type text not null check (
    insight_type in ('shared_strength', 'common_concern', 'comparison', 'portfolio_trend', 'growth_observation')
  ),
  title text not null,
  summary text not null,
  affected_stores jsonb not null default '[]'::jsonb,
  trend_direction text not null default 'stable' check (
    trend_direction in ('improving', 'stable', 'declining')
  ),
  created_at timestamptz not null default now()
);

alter table public.cross_store_insights enable row level security;
revoke all on public.cross_store_insights from authenticated, anon;

create table if not exists public.product_sync_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_key text not null,
  product_name text not null,
  source_store_key text not null,
  target_store_keys jsonb not null default '[]'::jsonb,
  recommendation_summary text not null,
  rationale text not null,
  requires_approval boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.product_sync_recommendations enable row level security;
revoke all on public.product_sync_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. opportunities, governance, regional
-- ---------------------------------------------------------------------------
create table if not exists public.opportunity_distributions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_type text not null check (
    opportunity_type in (
      'seasonal_initiative', 'emerging_category', 'successful_bundle',
      'operational_practice', 'shared_supplier'
    )
  ),
  title text not null,
  summary text not null,
  applicable_stores jsonb not null default '[]'::jsonb,
  rationale text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now()
);

alter table public.opportunity_distributions enable row level security;
revoke all on public.opportunity_distributions from authenticated, anon;

create table if not exists public.governance_coordination_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  coordination_type text not null check (
    coordination_type in ('policy', 'approval_workflow', 'operational_standard', 'reporting', 'compliance')
  ),
  title text not null,
  summary text not null,
  consistency_level text not null default 'aligned' check (
    consistency_level in ('aligned', 'partial', 'inconsistent', 'needs_review')
  ),
  affected_stores jsonb not null default '[]'::jsonb,
  recommendation text not null,
  created_at timestamptz not null default now()
);

alter table public.governance_coordination_records enable row level security;
revoke all on public.governance_coordination_records from authenticated, anon;

create table if not exists public.regional_expansion_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  region_key text not null,
  region_name text not null,
  readiness_score numeric(5, 2) not null check (readiness_score between 0 and 100),
  readiness_status text not null check (
    readiness_status in ('ready', 'preparing', 'monitoring', 'not_ready')
  ),
  localization_notes text,
  market_observation text not null,
  unique (tenant_id, region_key)
);

alter table public.regional_expansion_profiles enable row level security;
revoke all on public.regional_expansion_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. executive reports + recommendations + audit
-- ---------------------------------------------------------------------------
create table if not exists public.executive_portfolio_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.executive_portfolio_reports enable row level security;
revoke all on public.executive_portfolio_reports from authenticated, anon;

create table if not exists public.portfolio_strategic_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  section text not null check (
    section in (
      'portfolio_overview', 'store_performance', 'opportunity_center',
      'governance_insights', 'regional_observations', 'risk_indicators', 'strategic_recommendations'
    )
  ),
  title text not null,
  summary text not null,
  recommendation_type text not null,
  priority text not null default 'moderate',
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.portfolio_strategic_recommendations enable row level security;
revoke all on public.portfolio_strategic_recommendations from authenticated, anon;

create table if not exists public.portfolio_recommendation_audits (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  recommendation_id uuid references public.portfolio_strategic_recommendations (id) on delete set null,
  action text not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.portfolio_recommendation_audits enable row level security;
revoke all on public.portfolio_recommendation_audits from authenticated, anon;

create table if not exists public.multi_store_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  notification_type text not null,
  title text not null,
  message text not null,
  priority text not null default 'moderate',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.multi_store_notifications enable row level security;
revoke all on public.multi_store_notifications from authenticated, anon;

create table if not exists public.multi_store_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.multi_store_audit_log enable row level security;
revoke all on public.multi_store_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_mso_)
-- ---------------------------------------------------------------------------
create or replace function public._mso_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mso_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.multi_store_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'multi_store_' || p_event_type, 'multi_store_orchestration', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._mso_ensure_settings(p_tenant_id uuid)
returns public.multi_store_orchestration_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.multi_store_orchestration_settings;
begin
  insert into public.multi_store_orchestration_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.multi_store_orchestration_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._mso_seed_portfolio(p_tenant_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_portfolio_id uuid;
begin
  insert into public.store_portfolios (tenant_id, portfolio_key, portfolio_name, description)
  select p_tenant_id, 'primary_portfolio', 'Nordic Active Lifestyle Portfolio', 'Multi-store portfolio across Nordic markets.'
  where not exists (select 1 from public.store_portfolios sp where sp.tenant_id = p_tenant_id)
  returning id into v_portfolio_id;

  if v_portfolio_id is null then
    select id into v_portfolio_id from public.store_portfolios where tenant_id = p_tenant_id order by portfolio_key limit 1;
  end if;

  insert into public.portfolio_members (
    tenant_id, portfolio_id, store_key, store_name, platform_type, brand_group, region,
    ownership_label, status_level, revenue_amount, profit_margin_percent, performance_score
  )
  select p_tenant_id, v_portfolio_id, v.key, v.name, v.platform, v.brand, v.region, v.owner, v.status, v.rev, v.margin, v.score
  from (values
    ('nordic_main_shopify', 'Nordic Main — Shopify', 'shopify', 'Active Lifestyle', 'Norway', 'HQ Team', 'growing', 284600.00, 24.0, 86.0),
    ('fitness_woo_no', 'Fitness Store NO — WooCommerce', 'woocommerce', 'Fitness', 'Norway', 'Regional Team', 'active', 142300.00, 28.0, 82.0),
    ('eco_shopify_se', 'Eco Living SE — Shopify', 'shopify', 'Sustainable Living', 'Sweden', 'Regional Team', 'stable', 198400.00, 22.0, 78.0),
    ('outlet_woo_dk', 'Outlet DK — WooCommerce', 'woocommerce', 'Outlet', 'Denmark', 'Franchise Partner', 'needs_attention', 86400.00, 14.0, 58.0),
    ('premium_shopify_fi', 'Premium FI — Shopify', 'shopify', 'Premium', 'Finland', 'Expansion Team', 'growing', 112800.00, 26.0, 80.0)
  ) as v(key, name, platform, brand, region, owner, status, rev, margin, score)
  where not exists (select 1 from public.portfolio_members m where m.tenant_id = p_tenant_id and m.store_key = v.key);

  return v_portfolio_id;
end; $$;

create or replace function public._mso_seed_insights(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.cross_store_insights (tenant_id, insight_type, title, summary, affected_stores, trend_direction)
  select p_tenant_id, v.type, v.title, v.summary, v.stores, v.trend
  from (values
    ('shared_strength', 'Fitness Category Strength Across Portfolio', 'Fitness products outperform in 3 of 5 stores with consistent margins above 26%.', '["nordic_main_shopify","fitness_woo_no","premium_shopify_fi"]'::jsonb, 'improving'),
    ('common_concern', 'Shipping Complaints in Outlet Channel', 'Outlet DK showing elevated shipping-related customer concerns.', '["outlet_woo_dk"]'::jsonb, 'declining'),
    ('comparison', 'Shopify vs WooCommerce Performance', 'Shopify stores show 8% higher average net margin than WooCommerce outlets.', '["nordic_main_shopify","eco_shopify_se","premium_shopify_fi","fitness_woo_no","outlet_woo_dk"]'::jsonb, 'stable'),
    ('portfolio_trend', 'Portfolio Revenue Momentum', 'Combined portfolio revenue up 11% quarter-over-quarter.', '[]'::jsonb, 'improving'),
    ('growth_observation', 'Finland Expansion Performing Well', 'Premium FI store exceeding initial performance targets.', '["premium_shopify_fi"]'::jsonb, 'improving')
  ) as v(type, title, summary, stores, trend)
  where not exists (select 1 from public.cross_store_insights c where c.tenant_id = p_tenant_id limit 1);

  insert into public.product_sync_recommendations (tenant_id, product_key, product_name, source_store_key, target_store_keys, recommendation_summary, rationale)
  select p_tenant_id, v.key, v.name, v.source, v.targets, v.summary, v.rationale
  from (values
    ('resistance_band_set', 'Resistance Band Set Pro', 'fitness_woo_no', '["eco_shopify_se","premium_shopify_fi"]'::jsonb, 'Replicate top fitness SKU to SE and FI stores.', 'Strong performer in NO with proven margin and cross-store fit.'),
    ('eco_water_bottle', 'Insulated Eco Water Bottle', 'eco_shopify_se', '["nordic_main_shopify","premium_shopify_fi"]'::jsonb, 'Expand seasonal hydration product across Nordic portfolio.', 'Seasonal demand signal with strong sustainability alignment.'),
    ('portable_blender_pro', 'Portable Blender Pro', 'nordic_main_shopify', '["fitness_woo_no"]'::jsonb, 'Consider syncing bestseller to fitness-focused WooCommerce store.', 'High contribution product with portfolio-wide appeal.')
  ) as v(key, name, source, targets, summary, rationale)
  where not exists (select 1 from public.product_sync_recommendations p where p.tenant_id = p_tenant_id limit 1);

  insert into public.opportunity_distributions (tenant_id, opportunity_type, title, summary, applicable_stores, rationale, priority)
  select p_tenant_id, v.type, v.title, v.summary, v.stores, v.rationale, v.priority
  from (values
    ('seasonal_initiative', 'Summer Hydration Campaign', 'Roll out coordinated summer hydration campaign across Nordic stores.', '["nordic_main_shopify","eco_shopify_se","premium_shopify_fi"]'::jsonb, 'Seasonal demand with strong margin in sustainable living category.', 'important'),
    ('successful_bundle', 'Fitness Accessory Bundle', 'Replicate successful NO fitness bundle to FI and SE stores.', '["fitness_woo_no","premium_shopify_fi","eco_shopify_se"]'::jsonb, 'Bundle strategy driving 18% AOV increase in source store.', 'important'),
    ('operational_practice', 'Share Supplier Escalation Workflow', 'Standardize supplier review workflow from main store to outlet.', '["nordic_main_shopify","outlet_woo_dk"]'::jsonb, 'Governance consistency reduces operational risk.', 'moderate'),
    ('shared_supplier', 'Premium Active Goods Partnership', 'Leverage trusted supplier relationship across portfolio.', '["nordic_main_shopify","fitness_woo_no","premium_shopify_fi"]'::jsonb, 'Trusted supplier with consistent quality scores.', 'moderate')
  ) as v(type, title, summary, stores, rationale, priority)
  where not exists (select 1 from public.opportunity_distributions o where o.tenant_id = p_tenant_id limit 1);

  insert into public.governance_coordination_records (tenant_id, coordination_type, title, summary, consistency_level, affected_stores, recommendation)
  select p_tenant_id, v.type, v.title, v.summary, v.level, v.stores, v.rec
  from (values
    ('approval_workflow', 'Product Approval Consistency', 'Main store uses structured approval — outlet store has informal process.', 'partial', '["nordic_main_shopify","outlet_woo_dk"]'::jsonb, 'Align product approval workflow across franchise and HQ stores.'),
    ('operational_standard', 'Return Policy Alignment', 'Return windows vary between stores — customer confusion risk.', 'inconsistent', '["nordic_main_shopify","outlet_woo_dk","eco_shopify_se"]'::jsonb, 'Review return policy consistency while preserving regional flexibility.'),
    ('reporting', 'Weekly Performance Reporting', 'HQ stores report weekly — franchise partner reports monthly.', 'partial', '["nordic_main_shopify","outlet_woo_dk"]'::jsonb, 'Standardize reporting cadence for portfolio visibility.'),
    ('compliance', 'Data Privacy Practices', 'All stores aligned on GDPR-compliant data handling.', 'aligned', '[]'::jsonb, 'Maintain current compliance standards across portfolio.')
  ) as v(type, title, summary, level, stores, rec)
  where not exists (select 1 from public.governance_coordination_records g where g.tenant_id = p_tenant_id limit 1);

  insert into public.regional_expansion_profiles (tenant_id, region_key, region_name, readiness_score, readiness_status, localization_notes, market_observation)
  select p_tenant_id, v.key, v.name, v.score, v.status, v.notes, v.obs
  from (values
    ('norway', 'Norway', 92.0, 'ready', 'Primary market — full localization complete.', 'Strong performance across main and fitness stores.'),
    ('sweden', 'Sweden', 84.0, 'ready', 'Swedish product content and payment methods configured.', 'Eco Living store performing within targets.'),
    ('denmark', 'Denmark', 68.0, 'monitoring', 'Outlet model requires governance alignment before scaling.', 'Franchise partner store needs operational attention.'),
    ('finland', 'Finland', 78.0, 'preparing', 'Premium positioning — expand product catalog.', 'Expansion store exceeding initial targets.'),
    ('germany', 'Germany', 52.0, 'not_ready', 'Localization and supplier logistics not yet prepared.', 'Market assessment recommended before entry.')
  ) as v(key, name, score, status, notes, obs)
  where not exists (select 1 from public.regional_expansion_profiles r where r.tenant_id = p_tenant_id and r.region_key = v.key);

  insert into public.portfolio_strategic_recommendations (tenant_id, section, title, summary, recommendation_type, priority, rationale)
  select p_tenant_id, v.section, v.title, v.summary, v.type, v.priority, v.rationale
  from (values
    ('portfolio_overview', 'Portfolio Health Strong', 'Five-store portfolio performing within acceptable range with selective attention areas.', 'monitor', 'moderate', 'Combined revenue momentum and governance alignment support continued operations.'),
    ('store_performance', 'Review Outlet DK Performance', 'Outlet store below portfolio margin average — investigate operational practices.', 'investigate_store', 'important', '14% margin and elevated shipping complaints require attention.'),
    ('opportunity_center', 'Replicate Fitness Bundle', 'Successful bundle strategy in NO applicable to SE and FI.', 'replicate_initiative', 'important', 'Proven AOV improvement with strong cross-store fit.'),
    ('governance_insights', 'Align Approval Workflows', 'Partial consistency between HQ and franchise stores.', 'review_governance', 'moderate', 'Governance consistency strengthens trust and reduces risk.'),
    ('regional_observations', 'Prepare Germany Expansion', 'Germany readiness score 52 — not ready for launch.', 'defer_expansion', 'moderate', 'Localization and logistics preparation required before market entry.'),
    ('risk_indicators', 'Address Outlet Shipping Concerns', 'Shipping complaints trending up in DK outlet.', 'address_risk', 'important', 'Customer dissatisfaction may impact franchise relationship.'),
    ('strategic_recommendations', 'Share Operational Best Practices', 'Replicate main store supplier workflow to underperforming stores.', 'share_practices', 'moderate', 'Cross-store learning without competition between teams.')
  ) as v(section, title, summary, type, priority, rationale)
  where not exists (select 1 from public.portfolio_strategic_recommendations s where s.tenant_id = p_tenant_id limit 1);

  insert into public.multi_store_notifications (tenant_id, notification_type, title, message, priority)
  select p_tenant_id, 'portfolio_risk', 'Outlet Store Needs Attention', 'Outlet DK performance below portfolio average — review recommended.', 'important'
  where not exists (select 1 from public.multi_store_notifications n where n.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._mso_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_score numeric;
  v_classification text;
  v_stores int;
  v_revenue numeric;
  v_avg_margin numeric;
  v_risks int;
  v_opportunities int;
begin
  select count(*), coalesce(sum(revenue_amount), 0), coalesce(avg(profit_margin_percent), 0)
  into v_stores, v_revenue, v_avg_margin
  from public.portfolio_members where tenant_id = p_tenant_id;

  select count(*) into v_risks from public.portfolio_members
  where tenant_id = p_tenant_id and status_level in ('needs_attention', 'strategic_review');

  select count(*) into v_opportunities from public.opportunity_distributions where tenant_id = p_tenant_id;

  select least(100, round(coalesce(avg(performance_score), 70) - v_risks * 8 + 5, 1)) into v_score
  from public.portfolio_members where tenant_id = p_tenant_id;

  v_classification := case
    when v_score >= 90 then 'exceptional'
    when v_score >= 78 then 'strong'
    when v_score >= 65 then 'stable'
    when v_score >= 50 then 'needs_attention'
    else 'strategic_intervention'
  end;

  insert into public.portfolio_health_scores (
    tenant_id, portfolio_id, overall_score, portfolio_classification,
    performance_consistency_score, profit_score, governance_score, operational_stability_score
  )
  select p_tenant_id, (select id from public.store_portfolios where tenant_id = p_tenant_id limit 1),
    v_score, v_classification, v_score, v_avg_margin * 2, 82.0, v_score - 5
  where not exists (
    select 1 from public.portfolio_health_scores h
    where h.tenant_id = p_tenant_id and h.scored_at > now() - interval '1 hour'
  );

  return jsonb_build_object(
    'portfolio_score', v_score,
    'portfolio_classification', v_classification,
    'stores_connected', v_stores,
    'portfolio_revenue', v_revenue,
    'avg_profit_margin_percent', round(v_avg_margin, 1),
    'stores_needing_attention', v_risks,
    'opportunity_count', v_opportunities,
    'governance_gaps', (select count(*) from public.governance_coordination_records where tenant_id = p_tenant_id and consistency_level in ('partial', 'inconsistent', 'needs_review')),
    'regions_tracked', (select count(*) from public.regional_expansion_profiles where tenant_id = p_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.register_portfolio_store(
  p_store_key text, p_store_name text, p_platform_type text default 'shopify',
  p_brand_group text default null, p_region text default 'Nordic'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_portfolio_id uuid; v_id uuid;
begin
  v_tenant_id := public._mso_require_tenant();
  perform public._mso_ensure_settings(v_tenant_id);
  v_portfolio_id := public._mso_seed_portfolio(v_tenant_id);

  insert into public.portfolio_members (
    tenant_id, portfolio_id, store_key, store_name, platform_type, brand_group, region, status_level
  )
  values (v_tenant_id, v_portfolio_id, p_store_key, p_store_name, coalesce(p_platform_type, 'shopify'), p_brand_group, coalesce(p_region, 'Nordic'), 'active')
  on conflict (tenant_id, store_key) do update set
    store_name = excluded.store_name, platform_type = excluded.platform_type,
    brand_group = excluded.brand_group, region = excluded.region, status_level = 'active'
  returning id into v_id;

  perform public._mso_log_audit(v_tenant_id, 'store_registered', 'Store registered in portfolio: ' || p_store_name, 'portfolio_management',
    jsonb_build_object('store_id', v_id, 'store_key', p_store_key, 'auto_sync', false));

  return jsonb_build_object('status', 'registered', 'store_id', v_id, 'requires_approval', false);
end; $$;

create or replace function public.record_portfolio_recommendation_action(
  p_recommendation_id uuid, p_action text, p_notes text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mso_require_tenant();

  insert into public.portfolio_recommendation_audits (tenant_id, recommendation_id, action, notes)
  values (v_tenant_id, p_recommendation_id, p_action, p_notes);

  perform public._mso_log_audit(v_tenant_id, 'recommendation_action', 'Portfolio recommendation action recorded', 'human_approval',
    jsonb_build_object('recommendation_id', p_recommendation_id, 'action', p_action, 'auto_sync', false));

  return jsonb_build_object('status', 'recorded', 'action', p_action, 'requires_approval', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_executive_portfolio_report()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._mso_require_tenant();
  v_metrics := public._mso_refresh_metrics(v_tenant_id);
  v_summary := 'Executive portfolio report: score ' || (v_metrics->>'portfolio_score') || '/100, '
    || (v_metrics->>'stores_connected') || ' stores, '
    || (v_metrics->>'stores_needing_attention') || ' needing attention.';

  insert into public.executive_portfolio_reports (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._mso_log_audit(v_tenant_id, 'executive_report_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('report_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_multi_store_orchestration_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._mso_ensure_settings(v_tenant_id);
  perform public._mso_seed_portfolio(v_tenant_id);
  v_metrics := public._mso_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'portfolio_score', v_metrics->'portfolio_score',
    'portfolio_classification', v_metrics->'portfolio_classification',
    'stores_connected', v_metrics->'stores_connected',
    'philosophy', 'Manage many stores as if they were one ecosystem.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_multi_store_orchestration_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.multi_store_orchestration_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._mso_require_tenant();
  v_settings := public._mso_ensure_settings(v_tenant_id);
  perform public._mso_seed_portfolio(v_tenant_id);
  perform public._mso_seed_insights(v_tenant_id);
  v_metrics := public._mso_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_sync_disabled', v_settings.auto_sync_disabled,
    'philosophy', 'Manage many stores as if they were one ecosystem.',
    'safety_note', 'Aipify coordinates intelligence across stores — organizations retain authority over portfolio decisions. No automatic product synchronization.',
    'orchestration_enabled', v_settings.orchestration_enabled,
    'portfolio_score', v_metrics->'portfolio_score',
    'portfolio_classification', v_metrics->'portfolio_classification',
    'stores_connected', v_metrics->'stores_connected',
    'portfolio_revenue', v_metrics->'portfolio_revenue',
    'avg_profit_margin_percent', v_metrics->'avg_profit_margin_percent',
    'stores_needing_attention', v_metrics->'stores_needing_attention',
    'opportunity_count', v_metrics->'opportunity_count',
    'governance_gaps', v_metrics->'governance_gaps',
    'regions_tracked', v_metrics->'regions_tracked',
    'store_summaries', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'store_key', m.store_key, 'store_name', m.store_name,
        'platform_type', m.platform_type, 'brand_group', m.brand_group, 'region', m.region,
        'ownership_label', m.ownership_label, 'status_level', m.status_level,
        'revenue_amount', m.revenue_amount, 'profit_margin_percent', m.profit_margin_percent,
        'performance_score', m.performance_score
      ) order by m.performance_score desc)
      from public.portfolio_members m where m.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'cross_store_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'insight_type', c.insight_type, 'title', c.title,
        'summary', c.summary, 'affected_stores', c.affected_stores, 'trend_direction', c.trend_direction
      ) order by c.created_at desc)
      from public.cross_store_insights c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_sync_guidance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'product_key', p.product_key, 'product_name', p.product_name,
        'source_store_key', p.source_store_key, 'target_store_keys', p.target_store_keys,
        'recommendation_summary', p.recommendation_summary, 'rationale', p.rationale,
        'requires_approval', p.requires_approval
      ) order by p.created_at desc)
      from public.product_sync_recommendations p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_distributions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title,
        'summary', o.summary, 'applicable_stores', o.applicable_stores,
        'rationale', o.rationale, 'priority', o.priority
      ) order by o.created_at desc)
      from public.opportunity_distributions o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'governance_coordination', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'coordination_type', g.coordination_type, 'title', g.title,
        'summary', g.summary, 'consistency_level', g.consistency_level,
        'affected_stores', g.affected_stores, 'recommendation', g.recommendation
      ) order by g.created_at desc)
      from public.governance_coordination_records g where g.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'regional_expansion', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'region_key', r.region_key, 'region_name', r.region_name,
        'readiness_score', r.readiness_score, 'readiness_status', r.readiness_status,
        'localization_notes', r.localization_notes, 'market_observation', r.market_observation
      ) order by r.readiness_score desc)
      from public.regional_expansion_profiles r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'strategic_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'section', s.section, 'title', s.title, 'summary', s.summary,
        'recommendation_type', s.recommendation_type, 'priority', s.priority, 'rationale', s.rationale
      ) order by s.created_at desc)
      from public.portfolio_strategic_recommendations s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'portfolio_notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'title', n.title, 'message', n.message, 'priority', n.priority
      ) order by n.created_at desc)
      from public.multi_store_notifications n where n.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'executive_reports', coalesce((
      select jsonb_agg(jsonb_build_object('id', e.id, 'summary', e.summary, 'created_at', e.created_at)
        order by e.created_at desc)
      from public.executive_portfolio_reports e where e.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'platform_install', 'Connected store catalog and install status',
      'commerce_intelligence', 'Cross-store product opportunities',
      'commerce_performance', 'Portfolio profit and performance signals',
      'dropshipping_operations', 'Operational stability across stores',
      'knowledge_center', 'Multi-store management guides and FAQ'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'multi-store-management', 'Multi-Store Management', 'Portfolio dashboards, cross-store insights, governance coordination and regional expansion.', 'authenticated', 49
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'multi-store-management' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 10. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_multi_store_orchestration_card() to authenticated;
grant execute on function public.get_multi_store_orchestration_dashboard() to authenticated;
grant execute on function public.generate_executive_portfolio_report() to authenticated;
grant execute on function public.register_portfolio_store(text, text, text, text, text) to authenticated;
grant execute on function public.record_portfolio_recommendation_action(uuid, text, text) to authenticated;
