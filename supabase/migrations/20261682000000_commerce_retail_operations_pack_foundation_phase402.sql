-- Phase 402 — Commerce & Retail Operations Pack Foundation
-- Feature owner: CUSTOMER APP. Route: /app/commerce. Helpers: _gcrop402_*
-- Federates Commerce Intelligence, Product Automation, Dropshipping, Performance, Multi-Store (101–110).
-- Canonical home for Shopify, WooCommerce, DTC brands, dropshipping, and retail operations.

-- ---------------------------------------------------------------------------
-- 1. Extension tables (commerce engine federation — do not duplicate core commerce tables)
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_pack_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  portfolio_type text not null default 'single_store' check (
    portfolio_type in (
      'single_store', 'multi_store', 'multi_brand', 'multi_country',
      'multi_currency', 'enterprise_commerce'
    )
  ),
  health_score integer not null default 72 check (health_score between 0 and 100),
  industry_pack_install_id uuid references public.tenant_industry_pack_installs (id) on delete set null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.commerce_retail_portfolios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  slug text not null,
  portfolio_type text not null default 'multi_store' check (
    portfolio_type in (
      'single_store', 'multi_store', 'multi_brand', 'multi_country',
      'multi_currency', 'enterprise_commerce'
    )
  ),
  region_code text not null default '',
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, slug)
);

create index if not exists commerce_retail_portfolios_tenant_idx
  on public.commerce_retail_portfolios (tenant_id, status);

create table if not exists public.commerce_store_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  store_member_id uuid,
  portfolio_id uuid references public.commerce_retail_portfolios (id) on delete set null,
  store_key text not null,
  store_name text not null,
  platform text not null default 'custom' check (
    platform in ('shopify', 'woocommerce', 'wordpress', 'custom', 'future')
  ),
  domain text not null default '',
  country text not null default '',
  language text not null default 'en',
  currency text not null default 'NOK',
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  performance_label text not null default 'stable' check (
    performance_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, store_key)
);

create index if not exists commerce_store_profiles_tenant_idx
  on public.commerce_store_profiles (tenant_id, platform);

create table if not exists public.commerce_platform_connections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  platform_key text not null check (
    platform_key in ('shopify', 'woocommerce', 'wordpress', 'custom', 'future')
  ),
  status text not null default 'prepared' check (
    status in ('prepared', 'connected', 'paused', 'disabled')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, platform_key)
);

create table if not exists public.commerce_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'strong_margins', 'inventory_risk', 'supplier_review', 'winning_product_opportunity',
      'store_growth_accelerating', 'margin_opportunity', 'conversion_improving',
      'demand_increasing', 'profit_exceeds_forecast', 'marketing_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  store_member_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists commerce_advisor_signals_tenant_idx
  on public.commerce_advisor_signals (tenant_id, created_at desc);

create table if not exists public.commerce_retail_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'store_connected', 'product_imported', 'order_received', 'inventory_updated',
      'supplier_added', 'campaign_created', 'revenue_recorded', 'commerce_rule_updated',
      'pack_activated', 'platform_prepared'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists commerce_retail_audit_logs_tenant_idx
  on public.commerce_retail_audit_logs (tenant_id, created_at desc);

alter table public.commerce_pack_settings enable row level security;
alter table public.commerce_retail_portfolios enable row level security;
alter table public.commerce_store_profiles enable row level security;
alter table public.commerce_platform_connections enable row level security;
alter table public.commerce_advisor_signals enable row level security;
alter table public.commerce_retail_audit_logs enable row level security;

revoke all on public.commerce_pack_settings from authenticated, anon;
revoke all on public.commerce_retail_portfolios from authenticated, anon;
revoke all on public.commerce_store_profiles from authenticated, anon;
revoke all on public.commerce_platform_connections from authenticated, anon;
revoke all on public.commerce_advisor_signals from authenticated, anon;
revoke all on public.commerce_retail_audit_logs from authenticated, anon;

-- Optional FK to Multi-Store portfolio_members when that engine is migrated
do $$
begin
  if to_regclass('public.portfolio_members') is not null then
    if not exists (
      select 1 from pg_constraint where conname = 'commerce_store_profiles_store_member_id_fkey'
    ) then
      alter table public.commerce_store_profiles
        add constraint commerce_store_profiles_store_member_id_fkey
        foreign key (store_member_id) references public.portfolio_members (id) on delete set null;
    end if;
    if not exists (
      select 1 from pg_constraint where conname = 'commerce_advisor_signals_store_member_id_fkey'
    ) then
      alter table public.commerce_advisor_signals
        add constraint commerce_advisor_signals_store_member_id_fkey
        foreign key (store_member_id) references public.portfolio_members (id) on delete set null;
    end if;
  end if;
end $$;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'commerce_retail_operations_pack', v.description
from (values
  ('commerce.view', 'View Commerce Pack', 'View commerce operations, stores, products, orders, and profitability'),
  ('commerce.manage', 'Manage Commerce Pack', 'Manage stores, products, suppliers, marketing, and commerce settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

update public.industry_pack_registry
set
  short_description = 'Commerce operating system for stores, products, orders, suppliers, profitability, and growth — home of Commerce Intelligence and Multi-Store.',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'canonical_route', '/app/commerce',
    'legacy_commerce_intelligence_route', '/app/commerce-intelligence',
    'legacy_multi_store_route', '/app/multi-store',
    'phase', 402
  ),
  updated_at = now()
where pack_key = 'commerce_pack';

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gcrop402_*
-- ---------------------------------------------------------------------------
create or replace function public._gcrop402_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Commerce Pack requires an active subscription';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gcrop402_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.commerce_retail_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;

  begin
    perform public._cie_log_audit(p_tenant_id, p_event_type, p_summary, p_context);
  exception when others then
    null;
  end;

  return v_id;
end;
$$;

create or replace function public._gcrop402_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.commerce_pack_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.commerce_pack_settings;
  v_registry_id uuid;
  v_install_id uuid;
begin
  select id into v_registry_id from public.industry_pack_registry where pack_key = 'commerce_pack' limit 1;

  if v_registry_id is not null then
    insert into public.tenant_industry_pack_installs (
      organization_id, registry_id, install_status, install_mode, health_score
    )
    select p_org_id, v_registry_id, 'active', 'guided', 76
    where not exists (
      select 1 from public.tenant_industry_pack_installs
      where organization_id = p_org_id and registry_id = v_registry_id and install_status != 'removed'
    );
  end if;

  select id into v_install_id
  from public.tenant_industry_pack_installs
  where organization_id = p_org_id and registry_id = v_registry_id and install_status = 'active'
  limit 1;

  insert into public.commerce_pack_settings (organization_id, tenant_id, industry_pack_install_id)
  values (p_org_id, p_tenant_id, v_install_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.commerce_pack_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gcrop402_seed_platforms(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.commerce_platform_connections (tenant_id, platform_key, status)
  select p_tenant_id, v.platform_key, 'prepared'
  from (values ('shopify'), ('woocommerce'), ('wordpress'), ('custom')) as v(platform_key)
  where not exists (
    select 1 from public.commerce_platform_connections c
    where c.tenant_id = p_tenant_id and c.platform_key = v.platform_key
  );
end;
$$;

create or replace function public._gcrop402_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.commerce_advisor_signals where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.commerce_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (
      p_tenant_id, 'strong_margins',
      'Several products show strong margin potential across active catalogs.',
      'Higher margins improve profitability without requiring additional traffic.',
      'Review margin analyses in Commerce Intelligence and prioritize high-margin products.',
      'low', 'moderate'
    ),
    (
      p_tenant_id, 'store_growth_accelerating',
      'Store growth indicators are trending positively.',
      'Accelerating growth may require inventory and fulfillment coordination.',
      'Open Multi-Store orchestration to align stores and product sync recommendations.',
      'moderate', 'high'
    ),
    (
      p_tenant_id, 'supplier_review',
      'A supplier relationship may require review for reliability and lead times.',
      'Supplier delays impact fulfillment and customer satisfaction.',
      'Review supplier profiles in Commerce Intelligence and update risk assessments.',
      'moderate', 'high'
    );
end;
$$;

create or replace function public._gcrop402_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_stores integer := 0;
  v_products integer := 0;
  v_orders integer := 0;
  v_revenue numeric := 0;
  v_profit numeric := 0;
  v_customers integer := 0;
  v_conversion numeric := 0;
  v_health numeric := 72;
  v_suppliers integer := 0;
  v_opportunities integer := 0;
begin
  select count(*)::int into v_stores from public.commerce_store_profiles where tenant_id = p_tenant_id and status = 'active';

  if to_regclass('public.portfolio_members') is not null then
    select greatest(v_stores, count(*)::int), coalesce(sum(revenue_amount), 0)
    into v_stores, v_revenue
    from public.portfolio_members where tenant_id = p_tenant_id and status_level = 'active';
  end if;

  if to_regclass('public.commerce_products') is not null then
    select count(*)::int into v_products from public.commerce_products where tenant_id = p_tenant_id;
  end if;

  if to_regclass('public.imported_products') is not null then
    select v_products + count(*)::int into v_products from public.imported_products where tenant_id = p_tenant_id;
  end if;

  if to_regclass('public.customer_value_observations') is not null then
    select count(*)::int into v_customers from public.customer_value_observations where tenant_id = p_tenant_id;
    v_orders := v_customers;
  end if;

  if to_regclass('public.revenue_trend_reports') is not null then
    select coalesce(revenue_amount, 0), coalesce(profit_amount, 0)
    into v_revenue, v_profit
    from public.revenue_trend_reports
    where tenant_id = p_tenant_id
    order by period_end desc
    limit 1;
  end if;

  if to_regclass('public.commerce_health_scores') is not null then
    select coalesce(health_score, 72), coalesce(gross_profit_margin_percent, 0)
    into v_health, v_conversion
    from public.commerce_health_scores
    where tenant_id = p_tenant_id
    order by scored_at desc
    limit 1;
  end if;

  if to_regclass('public.supplier_profiles') is not null then
    select count(*)::int into v_suppliers from public.supplier_profiles where tenant_id = p_tenant_id;
  end if;

  if to_regclass('public.product_opportunities') is not null then
    select count(*)::int into v_opportunities
    from public.product_opportunities where tenant_id = p_tenant_id and status = 'active';
  end if;

  return jsonb_build_object(
    'stores', v_stores,
    'products', v_products,
    'orders', v_orders,
    'revenue', v_revenue,
    'profit', v_profit,
    'customers', v_customers,
    'conversion_rate', v_conversion,
    'commerce_health_score', round(v_health)::int,
    'suppliers', v_suppliers,
    'product_opportunities', v_opportunities
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_retail_operations_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.commerce_pack_settings;
  v_stores jsonb := '[]'::jsonb;
  v_products jsonb := '[]'::jsonb;
  v_suppliers jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_platforms jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_portfolios jsonb := '[]'::jsonb;
  v_legacy_modules jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('commerce.view');
  v_ctx := public._gcrop402_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gcrop402_ensure_settings(v_org_id, v_tenant_id);
  perform public._gcrop402_seed_platforms(v_tenant_id);
  perform public._gcrop402_seed_advisor(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'store_key', s.store_key, 'store_name', s.store_name,
    'platform', s.platform, 'domain', s.domain, 'country', s.country,
    'language', s.language, 'currency', s.currency, 'status', s.status,
    'performance_label', s.performance_label, 'portfolio_id', s.portfolio_id
  ) order by s.store_name), '[]'::jsonb)
  into v_stores
  from public.commerce_store_profiles s
  where s.tenant_id = v_tenant_id and s.status = 'active';

  if to_regclass('public.commerce_products') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', p.id, 'product_key', p.product_key, 'name', p.name,
      'category', p.category, 'supplier_cost', p.supplier_cost,
      'recommended_price_min', p.recommended_price_min,
      'recommended_price_max', p.recommended_price_max, 'currency', p.currency
    ) order by p.name), '[]'::jsonb)
    into v_products
    from public.commerce_products p
    where p.tenant_id = v_tenant_id
    limit 50;
  end if;

  if to_regclass('public.supplier_profiles') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', sp.id, 'supplier_key', sp.supplier_key, 'supplier_name', sp.supplier_name,
      'reliability_score', sp.reliability_score, 'lead_time_days', sp.lead_time_days
    ) order by sp.supplier_name), '[]'::jsonb)
    into v_suppliers
    from public.supplier_profiles sp
    where sp.tenant_id = v_tenant_id
    limit 30;
  end if;

  if to_regclass('public.product_opportunities') is not null then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', o.id, 'opportunity_score', o.opportunity_score,
      'recommendation_type', o.recommendation_type,
      'recommendation_summary', o.recommendation_summary,
      'margin_classification', o.margin_classification, 'status', o.status
    ) order by o.opportunity_score desc), '[]'::jsonb)
    into v_opportunities
    from public.product_opportunities o
    where o.tenant_id = v_tenant_id and o.status = 'active'
    limit 20;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'platform_key', c.platform_key, 'status', c.status
  ) order by c.platform_key), '[]'::jsonb)
  into v_platforms
  from public.commerce_platform_connections c
  where c.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from public.commerce_advisor_signals s
  where s.tenant_id = v_tenant_id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.commerce_retail_audit_logs l
  where l.tenant_id = v_tenant_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pf.id, 'name', pf.name, 'slug', pf.slug, 'portfolio_type', pf.portfolio_type, 'status', pf.status
  ) order by pf.name), '[]'::jsonb)
  into v_portfolios
  from public.commerce_retail_portfolios pf
  where pf.tenant_id = v_tenant_id and pf.status = 'active';

  v_legacy_modules := jsonb_build_array(
    jsonb_build_object('key', 'commerce_intelligence', 'route', '/app/commerce-intelligence'),
    jsonb_build_object('key', 'product_automation', 'route', '/app/product-automation'),
    jsonb_build_object('key', 'dropshipping', 'route', '/app/dropshipping-operations'),
    jsonb_build_object('key', 'commerce_performance', 'route', '/app/commerce-performance'),
    jsonb_build_object('key', 'multi_store', 'route', '/app/multi-store'),
    jsonb_build_object('key', 'commerce_companion', 'route', '/app/commerce-companion'),
    jsonb_build_object('key', 'global_expansion', 'route', '/app/global-commerce-expansion')
  );

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Selling products is not enough — organizations must understand profitability, operations, customers, and growth.',
    'mission', 'Commerce & Retail Operating System — stores, products, suppliers, profitability, and scalable growth.',
    'abos_principle', 'Aipify informs and prepares; operators decide. Growth-focused commerce on unified ABOS foundation.',
    'industry_packs_route', '/app/industry-packs',
    'commerce_intelligence_route', '/app/commerce-intelligence',
    'distinction_note', 'Canonical Industry Pack home — federates Commerce Intelligence, Multi-Store, and related engines without duplicating them.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', public._gcrop402_overview_block(v_tenant_id),
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/commerce'),
      jsonb_build_object('key', 'stores', 'route', '/app/commerce/stores'),
      jsonb_build_object('key', 'products', 'route', '/app/commerce/products'),
      jsonb_build_object('key', 'orders', 'route', '/app/commerce/orders'),
      jsonb_build_object('key', 'customers', 'route', '/app/commerce/customers'),
      jsonb_build_object('key', 'suppliers', 'route', '/app/commerce/suppliers'),
      jsonb_build_object('key', 'marketing', 'route', '/app/commerce/marketing'),
      jsonb_build_object('key', 'intelligence', 'route', '/app/commerce/intelligence')
    ),
    'stores', v_stores,
    'products', v_products,
    'suppliers', v_suppliers,
    'product_opportunities', v_opportunities,
    'platforms', v_platforms,
    'portfolios', v_portfolios,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'legacy_module_cross_links', v_legacy_modules,
    'operations', jsonb_build_object(
      'dropshipping_route', '/app/dropshipping-operations',
      'product_automation_route', '/app/product-automation',
      'commerce_intelligence_route', '/app/commerce-intelligence',
      'commerce_performance_route', '/app/commerce-performance',
      'multi_store_route', '/app/multi-store',
      'commerce_companion_route', '/app/commerce-companion',
      'global_expansion_route', '/app/global-commerce-expansion'
    ),
    'executive_dashboard', jsonb_build_object(
      'revenue', public._gcrop402_overview_block(v_tenant_id)->>'revenue',
      'profit', public._gcrop402_overview_block(v_tenant_id)->>'profit',
      'customers', public._gcrop402_overview_block(v_tenant_id)->>'customers',
      'stores', public._gcrop402_overview_block(v_tenant_id)->>'stores',
      'margins', public._gcrop402_overview_block(v_tenant_id)->>'conversion_rate',
      'commerce_health_score', public._gcrop402_overview_block(v_tenant_id)->>'commerce_health_score',
      'executive_route', '/app/commerce-performance'
    ),
    'privacy_note', 'Commerce and customer data isolated per organization — metadata-first intelligence only.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

create or replace function public.commerce_retail_operations_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_store_id uuid;
  v_store_member_id uuid;
  v_profile public.commerce_store_profiles;
  v_product_id uuid;
  v_product_name text;
  v_portfolio public.commerce_retail_portfolios;
  v_store_key text;
begin
  perform public._irp_require_permission('commerce.manage');
  perform public._gcrop402_require_access();
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  perform public._gcrop402_ensure_settings(v_org_id, v_tenant_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_store' then
    v_store_key := lower(regexp_replace(
      coalesce(p_payload->>'store_key', 'store-' || substr(gen_random_uuid()::text, 1, 8)),
      '[^a-z0-9-]+', '-', 'g'
    ));

    if to_regclass('public.portfolio_members') is not null then
      insert into public.portfolio_members (
        tenant_id, store_key, store_name, platform_type, region, status_level, revenue_amount
      ) values (
        v_tenant_id,
        v_store_key,
        coalesce(p_payload->>'store_name', 'New store'),
        coalesce(p_payload->>'platform', 'custom'),
        coalesce(p_payload->>'country', 'Nordic'),
        'active',
        coalesce((p_payload->>'revenue_amount')::numeric, 0)
      ) returning id into v_store_member_id;
    end if;

    insert into public.commerce_store_profiles (
      tenant_id, store_member_id, store_key, store_name, platform,
      domain, country, language, currency
    ) values (
      v_tenant_id, v_store_member_id, v_store_key,
      coalesce(p_payload->>'store_name', 'New store'),
      coalesce(p_payload->>'platform', 'custom'),
      coalesce(p_payload->>'domain', ''),
      coalesce(p_payload->>'country', ''),
      coalesce(p_payload->>'language', 'en'),
      coalesce(p_payload->>'currency', 'NOK')
    ) returning id, store_name into v_store_id, v_profile.store_name;

    perform public._gcrop402_log_audit(
      v_tenant_id, 'store_connected', 'Store connected: ' || v_profile.store_name,
      jsonb_build_object('store_id', v_store_id, 'platform', coalesce(p_payload->>'platform', 'custom'))
    );

    return jsonb_build_object('ok', true, 'store_id', v_store_id);
  end if;

  if v_action = 'create_product' then
    if to_regclass('public.commerce_products') is null then
      raise exception 'Commerce Intelligence product engine not yet available on this environment';
    end if;
    insert into public.commerce_products (
      tenant_id, product_key, name, category, supplier_cost,
      recommended_price_min, recommended_price_max, currency
    ) values (
      v_tenant_id,
      lower(regexp_replace(coalesce(p_payload->>'product_key', 'product-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'name', 'New product'),
      coalesce(p_payload->>'category', 'general'),
      coalesce((p_payload->>'supplier_cost')::numeric, 0),
      coalesce((p_payload->>'recommended_price_min')::numeric, 0),
      coalesce((p_payload->>'recommended_price_max')::numeric, 0),
      coalesce(p_payload->>'currency', 'NOK')
    ) returning id, name into v_product_id, v_product_name;

    perform public._gcrop402_log_audit(
      v_tenant_id, 'product_imported', 'Product added: ' || v_product_name,
      jsonb_build_object('product_id', v_product_id)
    );

    return jsonb_build_object('ok', true, 'product_id', v_product_id);
  end if;

  if v_action = 'create_portfolio' then
    insert into public.commerce_retail_portfolios (
      organization_id, tenant_id, name, slug, portfolio_type, region_code
    ) values (
      v_org_id, v_tenant_id,
      coalesce(p_payload->>'name', 'Portfolio'),
      lower(regexp_replace(coalesce(p_payload->>'slug', 'portfolio-' || substr(gen_random_uuid()::text, 1, 6)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'portfolio_type', 'multi_store'),
      coalesce(p_payload->>'region_code', '')
    ) returning * into v_portfolio;

    perform public._gcrop402_log_audit(
      v_tenant_id, 'commerce_rule_updated', 'Portfolio created: ' || v_portfolio.name,
      jsonb_build_object('portfolio_id', v_portfolio.id)
    );

    return jsonb_build_object('ok', true, 'portfolio', row_to_json(v_portfolio)::jsonb);
  end if;

  raise exception 'Unsupported commerce action: %', v_action;
end;
$$;

grant execute on function public.get_commerce_retail_operations_center() to authenticated;
grant execute on function public.commerce_retail_operations_action(jsonb) to authenticated;
