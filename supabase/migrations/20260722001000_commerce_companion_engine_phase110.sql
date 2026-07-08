-- Phase 110 — Commerce Companion Engine
-- Principle: Unified daily commerce Companion — holistic visibility and briefings without duplicating domain RPCs.
-- pressure_free_mode default true — stewardship not urgency; no auto-actions.

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
    'multi_store_orchestration', 'supplier_intelligence', 'global_commerce_expansion',
    'commerce_companion'
  )
);

-- ---------------------------------------------------------------------------
-- 1. commerce_companion_settings
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_companion_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  companion_enabled boolean not null default true,
  morning_briefing_enabled boolean not null default true,
  pressure_free_mode boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.commerce_companion_settings enable row level security;
revoke all on public.commerce_companion_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. daily briefings + visibility snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_companion_daily_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  briefing_date date not null default current_date,
  summary text not null,
  revenue_note text,
  profit_note text,
  highlights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commerce_companion_daily_briefings enable row level security;
revoke all on public.commerce_companion_daily_briefings from authenticated, anon;

create table if not exists public.commerce_companion_visibility_snapshots (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  revenue_performance text not null,
  profit_performance text not null,
  top_products_summary text not null,
  supplier_health_summary text not null,
  operational_alerts_count int not null default 0,
  journey_indicators_summary text not null,
  growth_opportunities_count int not null default 0,
  expansion_readiness_summary text not null,
  captured_at timestamptz not null default now()
);

alter table public.commerce_companion_visibility_snapshots enable row level security;
revoke all on public.commerce_companion_visibility_snapshots from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. guidance, alerts, signals, coaching, integration health
-- ---------------------------------------------------------------------------
create table if not exists public.commerce_companion_guidance_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  guidance_type text not null check (
    guidance_type in (
      'morning_briefing', 'opportunity', 'operational', 'profitability',
      'personality', 'strategic', 'integration'
    )
  ),
  emoji text,
  title text not null,
  summary text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now()
);

alter table public.commerce_companion_guidance_items enable row level security;
revoke all on public.commerce_companion_guidance_items from authenticated, anon;

create table if not exists public.commerce_companion_operational_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'delivery_delay', 'refund_spike', 'supplier_concern', 'inventory_shortage',
      'regional_demand', 'order_health', 'escalation'
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

alter table public.commerce_companion_operational_alerts enable row level security;
revoke all on public.commerce_companion_operational_alerts from authenticated, anon;

create table if not exists public.commerce_companion_opportunity_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'product_opportunity', 'seasonal', 'margin_improvement', 'store_fit',
      'portfolio_expansion', 'partner_opportunity'
    )
  ),
  title text not null,
  summary text not null,
  intention_note text not null default 'Prepared for human review — Aipify informs and prepares.',
  created_at timestamptz not null default now()
);

alter table public.commerce_companion_opportunity_signals enable row level security;
revoke all on public.commerce_companion_opportunity_signals from authenticated, anon;

create table if not exists public.commerce_companion_profitability_coaching (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  coaching_type text not null check (
    coaching_type in (
      'margin_review', 'cost_awareness', 'product_contribution', 'sustainable_growth',
      'pricing_stewardship', 'return_impact'
    )
  ),
  title text not null,
  summary text not null,
  margin_note text,
  created_at timestamptz not null default now()
);

alter table public.commerce_companion_profitability_coaching enable row level security;
revoke all on public.commerce_companion_profitability_coaching from authenticated, anon;

create table if not exists public.commerce_companion_integration_health (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  module_key text not null,
  route text not null,
  status text not null default 'linked' check (
    status in ('healthy', 'attention', 'linked', 'unavailable')
  ),
  last_summary text not null,
  updated_at timestamptz not null default now(),
  unique (tenant_id, module_key)
);

alter table public.commerce_companion_integration_health enable row level security;
revoke all on public.commerce_companion_integration_health from authenticated, anon;

create table if not exists public.commerce_companion_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.commerce_companion_audit_logs enable row level security;
revoke all on public.commerce_companion_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Helpers (_ccom_)
-- ---------------------------------------------------------------------------
create or replace function public._ccom_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ccom_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.commerce_companion_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'commerce_companion_' || p_action_type,
    'commerce_companion', 'logged', null, p_context
  );
  return v_id;
end; $$;

create or replace function public._ccom_ensure_settings(p_tenant_id uuid)
returns public.commerce_companion_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.commerce_companion_settings;
begin
  insert into public.commerce_companion_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.commerce_companion_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ccom_seed_integration_health(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.commerce_companion_integration_health (tenant_id, module_key, route, status, last_summary)
  select p_tenant_id, v.key, v.route, v.status, v.summary
  from (values
    ('commerce_intelligence_phase101', '/app/commerce-intelligence', 'linked', 'Opportunity discovery — domain RPC authoritative'),
    ('product_automation_phase102', '/app/product-automation', 'linked', 'Catalog automation — domain RPC authoritative'),
    ('dropshipping_operations_phase103', '/app/dropshipping-operations', 'linked', 'Operational awareness — domain RPC authoritative'),
    ('commerce_performance_phase104', '/app/commerce-performance', 'linked', 'Profitability coaching source — domain RPC authoritative'),
    ('multi_store_phase105', '/app/multi-store', 'linked', 'Portfolio visibility — domain RPC authoritative'),
    ('supplier_intelligence_phase106', '/app/supplier-intelligence', 'linked', 'Supplier health — domain RPC authoritative'),
    ('growth_partner_phase107', '/app/partners', 'linked', 'Partner support recommendations — domain RPC authoritative'),
    ('customer_journey_phase108', '/app/customer-lifecycle', 'linked', 'Customer success indicators — domain RPC authoritative'),
    ('global_commerce_expansion_phase109', '/app/global-commerce-expansion', 'linked', 'Expansion readiness — domain RPC authoritative')
  ) as v(key, route, status, summary)
  on conflict (tenant_id, module_key) do update set
    route = excluded.route,
    status = excluded.status,
    last_summary = excluded.last_summary,
    updated_at = now();
end; $$;

create or replace function public._ccom_seed_visibility(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.commerce_companion_visibility_snapshots where tenant_id = p_tenant_id) then
    return;
  end if;

  insert into public.commerce_companion_visibility_snapshots (
    tenant_id, revenue_performance, profit_performance, top_products_summary,
    supplier_health_summary, operational_alerts_count, journey_indicators_summary,
    growth_opportunities_count, expansion_readiness_summary
  ) values (
    p_tenant_id,
    'Nordic portfolio revenue metadata stable — seasonal activewear performing within stewardship thresholds.',
    'Net margin metadata healthy on core SKUs — review ad-dependent products before scale.',
    'Portable blender and training accessories lead contribution metadata — cross-link Commerce Performance Phase 104.',
    'Supplier portfolio mostly stable — one concentration alert under stewardship review.',
    3,
    'Onboarding completion and retention signals positive — Customer Journey Phase 108 cross-link.',
    4,
    'Norway and Sweden markets active — EU expansion in monitoring — Global Commerce Expansion Phase 109 cross-link.'
  );
end; $$;

create or replace function public._ccom_seed_guidance(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.commerce_companion_guidance_items where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.commerce_companion_guidance_items (tenant_id, guidance_type, emoji, title, summary, priority)
  select p_tenant_id, v.type, v.emoji, v.title, v.summary, v.priority
  from (values
    ('morning_briefing', '🌹', 'Morning commerce clarity', 'Your commerce portfolio looks steady — shall Aipify highlight what deserves attention today?', 'moderate'),
    ('morning_briefing', '🦉', 'Insight before action', 'Two operational signals and one margin note are ready — review when it suits your rhythm.', 'informational'),
    ('morning_briefing', '❤️', 'Human-centered pacing', 'No urgent pressure — stewardship over reactive commerce decisions today.', 'informational'),
    ('morning_briefing', '🔔', 'Prepared highlights', 'Growth opportunity and supplier stewardship items are summarized — humans decide next steps.', 'moderate'),
    ('personality', '🌹', 'Encouraging partnership', 'Commerce Companion celebrates thoughtful progress — not metric anxiety.', 'informational'),
    ('personality', '🦉', 'Insightful guidance', 'Holistic visibility connects modules without replacing their authority.', 'informational'),
    ('personality', '❤️', 'Human-centered', 'Teams and customers remain at the center — Aipify simplifies complexity.', 'informational'),
    ('personality', '🔔', 'Proactive stewardship', 'Gentle prompts when operational or profit signals need human review.', 'moderate')
  ) as v(type, emoji, title, summary, priority);

  insert into public.commerce_companion_operational_alerts (tenant_id, alert_type, title, summary, severity)
  select p_tenant_id, v.type, v.title, v.summary, v.severity
  from (values
    ('delivery_delay', 'Delivery variance on activewear line', 'Dropshipping Operations cross-link — delivery metadata above normal variance.', 'moderate'),
    ('refund_spike', 'Refund rate watch on accessories', 'Return metadata elevated on one SKU — Commerce Performance cross-link for margin impact.', 'moderate'),
    ('supplier_concern', 'Supplier concentration stewardship', 'Supplier Intelligence cross-link — diversification review suggested, not urgent replacement.', 'important'),
    ('inventory_shortage', 'Seasonal bottle stock signal', 'Regional demand metadata suggests inventory review before summer campaign.', 'informational')
  ) as v(type, title, summary, severity);

  insert into public.commerce_companion_opportunity_signals (tenant_id, signal_type, title, summary, intention_note)
  select p_tenant_id, v.type, v.title, v.summary, v.note
  from (values
    ('product_opportunity', 'Active lifestyle test product', 'Commerce Intelligence cross-link — strong store fit metadata on portable blender category.', 'Human approval required before import.'),
    ('seasonal', 'Summer hydration campaign window', 'Seasonal opportunity metadata approaching — prepare with Product Automation Phase 102.', 'Campaign timing is a human decision.'),
    ('margin_improvement', 'Bundle margin opportunity', 'Training accessory bundle shows sustainable margin metadata — review before promotion.', 'Profitability coaching — not auto-pricing.'),
    ('portfolio_expansion', 'Denmark market preparation', 'Multi-Store and Global Expansion cross-links — readiness improving at human pace.', 'No automatic market launch.')
  ) as v(type, title, summary, note);

  insert into public.commerce_companion_profitability_coaching (tenant_id, coaching_type, title, summary, margin_note)
  select p_tenant_id, v.type, v.title, v.summary, v.note
  from (values
    ('margin_review', 'Core SKU margin stewardship', 'Commerce Performance cross-link — net margin metadata healthy on bestsellers.', 'Review ad-dependent SKUs before scaling spend.'),
    ('cost_awareness', 'Shipping and platform cost visibility', 'Operational cost metadata summarized — Fiken remains accounting source of truth.', 'Aipify informs — finance retains oversight.'),
    ('sustainable_growth', 'Growth quality check', 'Revenue growth metadata paired with margin context — sustainability not extraction.', 'Pause before growth-at-any-cost promotions.'),
    ('return_impact', 'Return rate coaching', 'One accessory SKU return metadata elevated — customer experience cross-link suggested.', 'Human review before reactive discounting.')
  ) as v(type, title, summary, note);
end; $$;

create or replace function public._ccom_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_visibility public.commerce_companion_visibility_snapshots;
  v_alerts int;
  v_opportunities int;
  v_coaching int;
  v_guidance int;
  v_integrations int;
  v_companion_score numeric;
begin
  select * into v_visibility from public.commerce_companion_visibility_snapshots
  where tenant_id = p_tenant_id order by captured_at desc limit 1;

  select count(*) into v_alerts from public.commerce_companion_operational_alerts
  where tenant_id = p_tenant_id and resolved = false;

  select count(*) into v_opportunities from public.commerce_companion_opportunity_signals
  where tenant_id = p_tenant_id;

  select count(*) into v_coaching from public.commerce_companion_profitability_coaching
  where tenant_id = p_tenant_id;

  select count(*) into v_guidance from public.commerce_companion_guidance_items
  where tenant_id = p_tenant_id;

  select count(*) into v_integrations from public.commerce_companion_integration_health
  where tenant_id = p_tenant_id;

  v_companion_score := least(100, round(72 + v_integrations * 2 - v_alerts * 1.5 + v_opportunities * 0.5, 1));

  return jsonb_build_object(
    'companion_score', v_companion_score,
    'operational_alerts_count', v_alerts,
    'growth_opportunities_count', v_opportunities,
    'profitability_coaching_count', v_coaching,
    'guidance_items_count', v_guidance,
    'integration_modules_count', v_integrations,
    'revenue_performance', coalesce(v_visibility.revenue_performance, 'Portfolio revenue metadata pending first snapshot.'),
    'profit_performance', coalesce(v_visibility.profit_performance, 'Profit metadata pending first snapshot.'),
    'top_products_summary', coalesce(v_visibility.top_products_summary, 'Top products summary pending.'),
    'supplier_health_summary', coalesce(v_visibility.supplier_health_summary, 'Supplier health summary pending.'),
    'journey_indicators_summary', coalesce(v_visibility.journey_indicators_summary, 'Customer journey indicators pending.'),
    'expansion_readiness_summary', coalesce(v_visibility.expansion_readiness_summary, 'Expansion readiness pending.')
  );
end; $$;

create or replace function public._ccom_generate_morning_briefing_summary(p_tenant_id uuid)
returns text language plpgsql security definer set search_path = public as $$
declare v_metrics jsonb;
begin
  v_metrics := public._ccom_refresh_metrics(p_tenant_id);
  return '🌹 Good morning — your commerce Companion prepared a calm daily overview. '
    || '🦉 Revenue and profit metadata: ' || (v_metrics->>'revenue_performance')
    || ' ❤️ ' || (v_metrics->>'profit_performance')
    || ' 🔔 ' || (v_metrics->>'operational_alerts_count') || ' operational signals, '
    || (v_metrics->>'growth_opportunities_count') || ' growth opportunities — humans decide; Aipify informs and prepares.';
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_commerce_companion_morning_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_companion_settings;
  v_metrics jsonb;
  v_summary text;
  v_id uuid;
  v_highlights jsonb;
begin
  v_tenant_id := public._ccom_require_tenant();
  v_settings := public._ccom_ensure_settings(v_tenant_id);
  perform public._ccom_seed_visibility(v_tenant_id);
  perform public._ccom_seed_guidance(v_tenant_id);
  v_metrics := public._ccom_refresh_metrics(v_tenant_id);
  v_summary := public._ccom_generate_morning_briefing_summary(v_tenant_id);

  v_highlights := jsonb_build_array(
    jsonb_build_object('emoji', '🌹', 'label', 'Revenue note', 'text', v_metrics->>'revenue_performance'),
    jsonb_build_object('emoji', '🦉', 'label', 'Profit note', 'text', v_metrics->>'profit_performance'),
    jsonb_build_object('emoji', '❤️', 'label', 'Supplier health', 'text', v_metrics->>'supplier_health_summary'),
    jsonb_build_object('emoji', '🔔', 'label', 'Operational alerts', 'text', (v_metrics->>'operational_alerts_count') || ' signals for human review')
  );

  insert into public.commerce_companion_daily_briefings (
    tenant_id, briefing_date, summary, revenue_note, profit_note, highlights
  ) values (
    v_tenant_id, current_date, v_summary,
    v_metrics->>'revenue_performance',
    v_metrics->>'profit_performance',
    v_highlights
  ) returning id into v_id;

  perform public._ccom_log_audit(v_tenant_id, 'briefing_generated', v_summary, v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary, 'pressure_free_mode', v_settings.pressure_free_mode);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_commerce_companion_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_settings public.commerce_companion_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_settings := public._ccom_ensure_settings(v_tenant_id);
  perform public._ccom_seed_integration_health(v_tenant_id);
  perform public._ccom_seed_visibility(v_tenant_id);
  perform public._ccom_seed_guidance(v_tenant_id);
  v_metrics := public._ccom_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'companion_score', v_metrics->'companion_score',
    'operational_alerts_count', v_metrics->'operational_alerts_count',
    'growth_opportunities_count', v_metrics->'growth_opportunities_count',
    'philosophy', 'Unified Companion for commerce — clarity, confidence, sustainable success daily.',
    'human_oversight_required', true,
    'pressure_free_mode', v_settings.pressure_free_mode
  );
end; $$;

create or replace function public.get_commerce_companion_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commerce_companion_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._ccom_require_tenant();
  v_settings := public._ccom_ensure_settings(v_tenant_id);
  perform public._ccom_seed_integration_health(v_tenant_id);
  perform public._ccom_seed_visibility(v_tenant_id);
  perform public._ccom_seed_guidance(v_tenant_id);
  v_metrics := public._ccom_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'pressure_free_mode', v_settings.pressure_free_mode,
    'companion_enabled', v_settings.companion_enabled,
    'morning_briefing_enabled', v_settings.morning_briefing_enabled,
    'philosophy', 'Unified Companion for commerce — clarity, confidence, sustainable success daily.',
    'safety_note', 'Commerce Companion aggregates holistic visibility — domain modules Phases 101–109 remain authoritative. No auto-actions; stewardship not urgency.',
    'companion_score', v_metrics->'companion_score',
    'operational_alerts_count', v_metrics->'operational_alerts_count',
    'growth_opportunities_count', v_metrics->'growth_opportunities_count',
    'profitability_coaching_count', v_metrics->'profitability_coaching_count',
    'guidance_items_count', v_metrics->'guidance_items_count',
    'integration_modules_count', v_metrics->'integration_modules_count',
    'revenue_performance', v_metrics->'revenue_performance',
    'profit_performance', v_metrics->'profit_performance',
    'top_products_summary', v_metrics->'top_products_summary',
    'supplier_health_summary', v_metrics->'supplier_health_summary',
    'journey_indicators_summary', v_metrics->'journey_indicators_summary',
    'expansion_readiness_summary', v_metrics->'expansion_readiness_summary',
    'morning_briefing_guidance', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'emoji', g.emoji, 'title', g.title, 'summary', g.summary, 'priority', g.priority
      ) order by g.created_at)
      from public.commerce_companion_guidance_items g
      where g.tenant_id = v_tenant_id and g.guidance_type = 'morning_briefing'
    ), '[]'::jsonb),
    'companion_personality', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', g.id, 'emoji', g.emoji, 'title', g.title, 'summary', g.summary
      ) order by g.created_at)
      from public.commerce_companion_guidance_items g
      where g.tenant_id = v_tenant_id and g.guidance_type = 'personality'
    ), '[]'::jsonb),
    'operational_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title, 'summary', a.summary,
        'severity', a.severity, 'resolved', a.resolved
      ) order by a.detected_at desc)
      from public.commerce_companion_operational_alerts a
      where a.tenant_id = v_tenant_id and a.resolved = false
    ), '[]'::jsonb),
    'opportunity_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'signal_type', s.signal_type, 'title', s.title,
        'summary', s.summary, 'intention_note', s.intention_note
      ) order by s.created_at desc)
      from public.commerce_companion_opportunity_signals s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'profitability_coaching', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'coaching_type', c.coaching_type, 'title', c.title,
        'summary', c.summary, 'margin_note', c.margin_note
      ) order by c.created_at desc)
      from public.commerce_companion_profitability_coaching c where c.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'integration_health', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'module_key', i.module_key, 'route', i.route,
        'status', i.status, 'last_summary', i.last_summary
      ) order by i.module_key)
      from public.commerce_companion_integration_health i where i.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'daily_briefings', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'briefing_date', b.briefing_date, 'summary', b.summary,
        'revenue_note', b.revenue_note, 'profit_note', b.profit_note,
        'highlights', b.highlights, 'created_at', b.created_at
      ) order by b.created_at desc)
      from public.commerce_companion_daily_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'commerce_intelligence_phase101', 'label', 'Commerce Intelligence (Phase 101)', 'route', '/app/commerce-intelligence', 'note', 'Opportunity discovery'),
      jsonb_build_object('key', 'product_automation_phase102', 'label', 'Product Automation (Phase 102)', 'route', '/app/product-automation', 'note', 'Catalog automation'),
      jsonb_build_object('key', 'dropshipping_operations_phase103', 'label', 'Dropshipping Operations (Phase 103)', 'route', '/app/dropshipping-operations', 'note', 'Operational awareness'),
      jsonb_build_object('key', 'commerce_performance_phase104', 'label', 'Commerce Performance (Phase 104)', 'route', '/app/commerce-performance', 'note', 'Profitability coaching source'),
      jsonb_build_object('key', 'multi_store_phase105', 'label', 'Multi-Store (Phase 105)', 'route', '/app/multi-store', 'note', 'Portfolio visibility'),
      jsonb_build_object('key', 'supplier_intelligence_phase106', 'label', 'Supplier Intelligence (Phase 106)', 'route', '/app/supplier-intelligence', 'note', 'Supplier health'),
      jsonb_build_object('key', 'growth_partner_phase107', 'label', 'Growth Partner (Phase 107)', 'route', '/app/partners', 'note', 'Partner support recommendations'),
      jsonb_build_object('key', 'customer_journey_phase108', 'label', 'Customer Journey (Phase 108)', 'route', '/app/customer-lifecycle', 'note', 'Customer success indicators'),
      jsonb_build_object('key', 'global_commerce_expansion_phase109', 'label', 'Global Commerce Expansion (Phase 109)', 'route', '/app/global-commerce-expansion', 'note', 'Expansion readiness'),
      jsonb_build_object('key', 'command_center', 'label', 'Command Center', 'route', '/app/command-center', 'note', 'Executive ops — distinct from commerce Companion'),
      jsonb_build_object('key', 'meeting_companion_phase72', 'label', 'Meeting Companion (Phase 72)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Commerce meeting summaries'),
      jsonb_build_object('key', 'knowledge_center_a5', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Commerce training and playbooks')
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'commerce-companion', 'Commerce Companion',
  'Unified daily commerce Companion — holistic visibility, morning briefings, and cross-module integration links.',
  'authenticated', 50
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'commerce-companion' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 8. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_commerce_companion_card() to authenticated;
grant execute on function public.get_commerce_companion_dashboard() to authenticated;
grant execute on function public.generate_commerce_companion_morning_briefing() to authenticated;
