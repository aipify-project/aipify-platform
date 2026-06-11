-- Phase 103 — Dropshipping Operations Center
-- Principle: Successful dropshipping is about reliable systems and protecting customer trust.

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
    'product_automation', 'dropshipping_operations'
  )
);

-- ---------------------------------------------------------------------------
-- 1. dropshipping_operations_settings
-- ---------------------------------------------------------------------------
create table if not exists public.dropshipping_operations_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  operations_enabled boolean not null default true,
  auto_actions_disabled boolean not null default true,
  alert_threshold text not null default 'moderate' check (
    alert_threshold in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.dropshipping_operations_settings enable row level security;
revoke all on public.dropshipping_operations_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. supplier monitoring + health scores
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_monitoring_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_key text not null,
  supplier_name text not null,
  delivery_consistency text not null default 'stable' check (
    delivery_consistency in ('excellent', 'stable', 'variable', 'poor')
  ),
  quality_indicator text not null default 'good' check (
    quality_indicator in ('excellent', 'good', 'fair', 'poor')
  ),
  responsiveness text not null default 'good',
  inventory_stability text not null default 'stable',
  complaint_pattern text,
  pricing_volatility text not null default 'stable' check (
    pricing_volatility in ('stable', 'variable', 'increasing')
  ),
  unique (tenant_id, supplier_key)
);

alter table public.supplier_monitoring_records enable row level security;
revoke all on public.supplier_monitoring_records from authenticated, anon;

create table if not exists public.supplier_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_monitoring_records (id) on delete cascade,
  health_score numeric(5, 2) not null check (health_score between 0 and 100),
  status_level text not null check (
    status_level in ('trusted', 'stable', 'monitor_closely', 'high_risk', 'escalation_recommended')
  ),
  strengths text not null,
  risks text,
  recommendation text not null,
  scored_at timestamptz not null default now()
);

alter table public.supplier_health_scores enable row level security;
revoke all on public.supplier_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. watchlists, delivery risks, health scores
-- ---------------------------------------------------------------------------
create table if not exists public.dropshipping_product_watchlists (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  product_key text not null,
  product_name text not null,
  category text not null,
  watch_reason text not null,
  margin_tracking boolean not null default true,
  trend_monitoring boolean not null default true,
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  added_at timestamptz not null default now(),
  unique (tenant_id, product_key)
);

alter table public.dropshipping_product_watchlists enable row level security;
revoke all on public.dropshipping_product_watchlists from authenticated, anon;

create table if not exists public.watchlist_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  watchlist_id uuid references public.dropshipping_product_watchlists (id) on delete cascade,
  event_type text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.watchlist_events enable row level security;
revoke all on public.watchlist_events from authenticated, anon;

create table if not exists public.delivery_risk_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_monitoring_records (id) on delete set null,
  risk_type text not null check (
    risk_type in ('extended_delivery', 'regional_disruption', 'supplier_instability', 'shipping_complaints')
  ),
  title text not null,
  summary text not null,
  severity text not null default 'moderate' check (
    severity in ('informational', 'moderate', 'important', 'critical')
  ),
  resolved boolean not null default false,
  detected_at timestamptz not null default now()
);

alter table public.delivery_risk_events enable row level security;
revoke all on public.delivery_risk_events from authenticated, anon;

create table if not exists public.operational_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  overall_score numeric(5, 2) not null,
  health_classification text not null check (
    health_classification in (
      'excellent', 'stable', 'needs_attention', 'high_risk', 'immediate_review'
    )
  ),
  supplier_stability_score numeric(5, 2),
  delivery_consistency_score numeric(5, 2),
  customer_experience_score numeric(5, 2),
  refund_trend_score numeric(5, 2),
  scored_at timestamptz not null default now()
);

alter table public.operational_health_scores enable row level security;
revoke all on public.operational_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. alerts, escalations, recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.dropshipping_opportunity_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  alert_type text not null check (
    alert_type in ('seasonal', 'supplier_improvement', 'category_gap', 'bundle_opportunity')
  ),
  title text not null,
  summary text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.dropshipping_opportunity_alerts enable row level security;
revoke all on public.dropshipping_opportunity_alerts from authenticated, anon;

create table if not exists public.supplier_escalations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_monitoring_records (id) on delete set null,
  issue_summary text not null,
  escalation_status text not null default 'open' check (
    escalation_status in ('open', 'in_review', 'resolved', 'deferred')
  ),
  alternative_supplier text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.supplier_escalations enable row level security;
revoke all on public.supplier_escalations from authenticated, anon;

create table if not exists public.operations_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  section text not null check (
    section in (
      'operational_health', 'supplier_insights', 'delivery_risk',
      'opportunity_alerts', 'watchlists', 'recommendations', 'escalations'
    )
  ),
  title text not null,
  summary text not null,
  recommendation_type text not null,
  priority text not null default 'moderate',
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.operations_recommendations enable row level security;
revoke all on public.operations_recommendations from authenticated, anon;

create table if not exists public.dropshipping_risk_notifications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  notification_type text not null,
  title text not null,
  message text not null,
  priority text not null default 'moderate',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.dropshipping_risk_notifications enable row level security;
revoke all on public.dropshipping_risk_notifications from authenticated, anon;

create table if not exists public.order_health_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  insight_type text not null check (
    insight_type in ('complaint_frequency', 'refund_activity', 'fulfillment_delay', 'demand_change', 'customer_concern')
  ),
  title text not null,
  summary text not null,
  trend_direction text not null default 'stable' check (
    trend_direction in ('improving', 'stable', 'worsening')
  ),
  detected_at timestamptz not null default now()
);

alter table public.order_health_insights enable row level security;
revoke all on public.order_health_insights from authenticated, anon;

create table if not exists public.dropshipping_operations_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.dropshipping_operations_briefings enable row level security;
revoke all on public.dropshipping_operations_briefings from authenticated, anon;

create table if not exists public.dropshipping_operations_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  trigger_source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.dropshipping_operations_audit_log enable row level security;
revoke all on public.dropshipping_operations_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers (_doc_)
-- ---------------------------------------------------------------------------
create or replace function public._doc_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._doc_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text default null,
  p_trigger_source text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.dropshipping_operations_audit_log (tenant_id, event_type, summary, trigger_source, metadata)
  values (p_tenant_id, p_event_type, p_summary, p_trigger_source, p_metadata)
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'dropshipping_operations_' || p_event_type, 'dropshipping_operations', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._doc_ensure_settings(p_tenant_id uuid)
returns public.dropshipping_operations_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.dropshipping_operations_settings;
begin
  insert into public.dropshipping_operations_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.dropshipping_operations_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._doc_seed_suppliers(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.supplier_monitoring_records (tenant_id, supplier_key, supplier_name, delivery_consistency, quality_indicator, responsiveness, inventory_stability, complaint_pattern, pricing_volatility)
  select p_tenant_id, v.key, v.name, v.delivery, v.quality, v.resp, v.stock, v.complaints, v.price
  from (values
    ('nordic_fitness_supply', 'Nordic Fitness Supply', 'excellent', 'excellent', 'excellent', 'stable', 'Low complaint rate', 'stable'),
    ('global_dropship_co', 'Global Dropship Co', 'poor', 'fair', 'slow', 'variable', 'Increasing delivery complaints', 'increasing'),
    ('premium_active_goods', 'Premium Active Goods', 'stable', 'excellent', 'good', 'stable', 'Minimal complaints', 'stable'),
    ('budget_import_ltd', 'Budget Import Ltd', 'variable', 'fair', 'fair', 'variable', 'Moderate quality concerns', 'variable')
  ) as v(key, name, delivery, quality, resp, stock, complaints, price)
  where not exists (select 1 from public.supplier_monitoring_records s where s.tenant_id = p_tenant_id and s.supplier_key = v.key);

  insert into public.supplier_health_scores (tenant_id, supplier_id, health_score, status_level, strengths, risks, recommendation)
  select p_tenant_id, s.id, v.score, v.level, v.strengths, v.risks, v.rec
  from public.supplier_monitoring_records s
  join (values
    ('nordic_fitness_supply', 92.0, 'trusted', 'Fast delivery, stable stock, excellent ratings.', 'Minor price increases.', 'Trusted partner for active lifestyle products.'),
    ('global_dropship_co', 48.0, 'escalation_recommended', 'Wide catalog, low cost.', 'Delivery times increased significantly. High complaint rate.', 'Escalation recommended — evaluate alternative suppliers.'),
    ('premium_active_goods', 88.0, 'stable', 'Reliable quality and communication.', 'Higher unit cost.', 'Monitor closely with limited test volume.'),
    ('budget_import_ltd', 62.0, 'monitor_closely', 'Competitive pricing.', 'Variable delivery and quality signals.', 'Monitor closely before scaling orders.')
  ) as v(key, score, level, strengths, risks, rec) on s.supplier_key = v.key and s.tenant_id = p_tenant_id
  where not exists (select 1 from public.supplier_health_scores h where h.supplier_id = s.id);
end; $$;

create or replace function public._doc_seed_watchlists(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.dropshipping_product_watchlists (tenant_id, product_key, product_name, category, watch_reason)
  select p_tenant_id, v.key, v.name, v.cat, v.reason
  from (values
    ('portable_blender', 'Portable Blender Bottle', 'Active Lifestyle', 'High trend with good margin — monitoring supplier quality.'),
    ('resistance_bands', 'Resistance Band Set Pro', 'Fitness', 'Bundle opportunity with existing bestsellers.'),
    ('eco_bottle', 'Insulated Eco Water Bottle', 'Sustainable Living', 'Seasonal demand approaching — track margin and stock.')
  ) as v(key, name, cat, reason)
  where not exists (select 1 from public.dropshipping_product_watchlists w where w.tenant_id = p_tenant_id and w.product_key = v.key);
end; $$;

create or replace function public._doc_seed_risks_alerts(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_supplier_id uuid;
begin
  select id into v_supplier_id from public.supplier_monitoring_records
  where tenant_id = p_tenant_id and supplier_key = 'global_dropship_co';

  insert into public.delivery_risk_events (tenant_id, supplier_id, risk_type, title, summary, severity)
  select p_tenant_id, v_supplier_id, v.type, v.title, v.summary, v.severity
  from (values
    ('extended_delivery', 'Extended Delivery Estimates', 'Supplier delivery times have increased significantly. Consider evaluating alternative suppliers.', 'important'),
    ('shipping_complaints', 'Rising Shipping Complaints', 'Customer shipping complaints up 18% this month for Global Dropship Co.', 'moderate')
  ) as v(type, title, summary, severity)
  where not exists (select 1 from public.delivery_risk_events d where d.tenant_id = p_tenant_id limit 1);

  insert into public.dropshipping_opportunity_alerts (tenant_id, alert_type, title, summary, priority)
  select p_tenant_id, v.type, v.title, v.summary, v.priority
  from (values
    ('seasonal', 'Summer Hydration Opportunity', 'Insulated bottles showing rising seasonal demand with strong store fit.', 'important'),
    ('bundle_opportunity', 'Training Accessory Bundle', 'Resistance bands pair well with existing fitness products.', 'moderate'),
    ('supplier_improvement', 'Premium Active Goods Performance', 'Supplier delivery consistency improved over last 30 days.', 'informational')
  ) as v(type, title, summary, priority)
  where not exists (select 1 from public.dropshipping_opportunity_alerts o where o.tenant_id = p_tenant_id limit 1);

  insert into public.order_health_insights (tenant_id, insight_type, title, summary, trend_direction)
  select p_tenant_id, v.type, v.title, v.summary, v.trend
  from (values
    ('refund_activity', 'Refund Activity Stable', 'Refund rate within normal range for active lifestyle category.', 'stable'),
    ('fulfillment_delay', 'Fulfillment Delays Increasing', 'Delayed fulfillment patterns detected for one supplier.', 'worsening'),
    ('complaint_frequency', 'Complaint Frequency Rising', 'Shipping-related complaints increasing for budget supplier.', 'worsening')
  ) as v(type, title, summary, trend)
  where not exists (select 1 from public.order_health_insights o where o.tenant_id = p_tenant_id limit 1);

  insert into public.dropshipping_risk_notifications (tenant_id, notification_type, title, message, priority)
  select p_tenant_id, 'delivery_risk', 'Delivery Risk Alert', 'Supplier delivery times have increased significantly. Consider evaluating alternative suppliers.', 'important'
  where not exists (select 1 from public.dropshipping_risk_notifications n where n.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._doc_seed_recommendations(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.operations_recommendations (tenant_id, section, title, summary, recommendation_type, priority, rationale)
  select p_tenant_id, v.section, v.title, v.summary, v.type, v.priority, v.rationale
  from (values
    ('operational_health', 'Operational Health Stable', 'Overall operations performing within acceptable range.', 'monitor', 'moderate', 'Supplier stability and delivery scores support continued operations.'),
    ('supplier_insights', 'Monitor Global Dropship Co', 'Escalation recommended for underperforming supplier.', 'test_alternative_supplier', 'important', 'Delivery consistency and complaint patterns indicate elevated risk.'),
    ('delivery_risk', 'Review Delivery Messaging', 'Update customer expectations for extended delivery windows.', 'review_customer_messaging', 'moderate', 'Proactive communication reduces complaint frequency.'),
    ('opportunity_alerts', 'Seasonal Inventory Opportunity', 'Prepare seasonal campaign for insulated bottles.', 'evaluate_seasonal_inventory', 'important', 'Rising demand signal with strong margin potential.'),
    ('watchlists', 'Track Portable Blender', 'Continue monitoring trend and supplier quality.', 'monitor_supplier', 'moderate', 'High opportunity score but requires supplier verification.'),
    ('recommendations', 'Consider Discontinuing Budget Import', 'Quality signals suggest reviewing product lineup.', 'consider_discontinuing', 'moderate', 'Weak quality indicators outweigh low unit cost.'),
    ('escalations', 'Open Supplier Review', 'Document issues and evaluate alternatives for Global Dropship Co.', 'escalate_supplier', 'critical', 'Escalation recommended based on delivery and complaint trends.')
  ) as v(section, title, summary, type, priority, rationale)
  where not exists (select 1 from public.operations_recommendations r where r.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._doc_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_operational_score numeric;
  v_active_products int;
  v_alerts int;
  v_risks int;
  v_health_class text;
begin
  select coalesce(avg(health_score), 75.0) into v_operational_score
  from public.supplier_health_scores where tenant_id = p_tenant_id;

  select count(*) into v_active_products from public.dropshipping_product_watchlists where tenant_id = p_tenant_id and status = 'active';
  select count(*) into v_alerts from public.dropshipping_opportunity_alerts where tenant_id = p_tenant_id and acknowledged = false;
  select count(*) into v_risks from public.delivery_risk_events where tenant_id = p_tenant_id and resolved = false;

  v_operational_score := least(100, round(v_operational_score - v_risks * 5 + 5, 1));

  v_health_class := case
    when v_operational_score >= 90 then 'excellent'
    when v_operational_score >= 75 then 'stable'
    when v_operational_score >= 60 then 'needs_attention'
    when v_operational_score >= 45 then 'high_risk'
    else 'immediate_review'
  end;

  insert into public.operational_health_scores (
    tenant_id, overall_score, health_classification,
    supplier_stability_score, delivery_consistency_score, customer_experience_score, refund_trend_score
  )
  select p_tenant_id, v_operational_score, v_health_class, v_operational_score, v_operational_score - 5, 82.0, 78.0
  where not exists (
    select 1 from public.operational_health_scores o
    where o.tenant_id = p_tenant_id and o.scored_at > now() - interval '1 hour'
  );

  return jsonb_build_object(
    'operational_score', v_operational_score,
    'health_classification', v_health_class,
    'active_products', v_active_products,
    'open_alerts', v_alerts,
    'delivery_risks', v_risks,
    'suppliers_monitored', (select count(*) from public.supplier_monitoring_records where tenant_id = p_tenant_id),
    'open_escalations', (select count(*) from public.supplier_escalations where tenant_id = p_tenant_id and escalation_status = 'open')
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.add_dropshipping_watchlist(
  p_product_key text, p_product_name text default null, p_category text default 'General', p_watch_reason text default 'Monitoring'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._doc_require_tenant();
  insert into public.dropshipping_product_watchlists (tenant_id, product_key, product_name, category, watch_reason)
  values (v_tenant_id, p_product_key, coalesce(p_product_name, p_product_key), p_category, p_watch_reason)
  on conflict (tenant_id, product_key) do update set status = 'active', watch_reason = excluded.watch_reason
  returning id into v_id;

  insert into public.watchlist_events (tenant_id, watchlist_id, event_type, summary)
  values (v_tenant_id, v_id, 'added', 'Product added to operations watchlist.');

  perform public._doc_log_audit(v_tenant_id, 'watchlist_added', 'Product added to watchlist', 'watchlist',
    jsonb_build_object('product_key', p_product_key));

  return jsonb_build_object('status', 'watchlist', 'watchlist_id', v_id);
end; $$;

create or replace function public.create_supplier_escalation(
  p_supplier_id uuid, p_issue_summary text, p_alternative_supplier text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._doc_require_tenant();

  insert into public.supplier_escalations (tenant_id, supplier_id, issue_summary, alternative_supplier)
  values (v_tenant_id, p_supplier_id, p_issue_summary, p_alternative_supplier)
  returning id into v_id;

  perform public._doc_log_audit(v_tenant_id, 'escalation_created', p_issue_summary, 'supplier_escalation',
    jsonb_build_object('supplier_id', p_supplier_id, 'escalation_id', v_id));

  return jsonb_build_object('status', 'open', 'escalation_id', v_id, 'requires_approval', true);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_dropshipping_operations_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._doc_require_tenant();
  v_metrics := public._doc_refresh_metrics(v_tenant_id);
  v_summary := 'Operations briefing: score ' || (v_metrics->>'operational_score') || '/100, '
    || (v_metrics->>'delivery_risks') || ' delivery risks, '
    || (v_metrics->>'open_alerts') || ' opportunity alerts.';

  insert into public.dropshipping_operations_briefings (tenant_id, summary, content)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._doc_log_audit(v_tenant_id, 'briefing_generated', v_summary, 'executive_reporting', v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_dropshipping_operations_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._doc_ensure_settings(v_tenant_id);
  v_metrics := public._doc_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'operational_score', v_metrics->'operational_score',
    'health_classification', v_metrics->'health_classification',
    'philosophy', 'Run your dropshipping business with confidence.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_dropshipping_operations_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.dropshipping_operations_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._doc_require_tenant();
  v_settings := public._doc_ensure_settings(v_tenant_id);
  perform public._doc_seed_suppliers(v_tenant_id);
  perform public._doc_seed_watchlists(v_tenant_id);
  perform public._doc_seed_risks_alerts(v_tenant_id);
  perform public._doc_seed_recommendations(v_tenant_id);
  v_metrics := public._doc_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_actions_disabled', v_settings.auto_actions_disabled,
    'philosophy', 'Run your dropshipping business with confidence.',
    'safety_note', 'Aipify recommends actions — organizations remain responsible for operational decisions. No automatic product removal or supplier changes.',
    'operations_enabled', v_settings.operations_enabled,
    'operational_score', v_metrics->'operational_score',
    'health_classification', v_metrics->'health_classification',
    'active_products', v_metrics->'active_products',
    'open_alerts', v_metrics->'open_alerts',
    'delivery_risks', v_metrics->'delivery_risks',
    'suppliers_monitored', v_metrics->'suppliers_monitored',
    'open_escalations', v_metrics->'open_escalations',
    'supplier_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'supplier_id', h.supplier_id, 'supplier_name', s.supplier_name,
        'health_score', h.health_score, 'status_level', h.status_level,
        'strengths', h.strengths, 'risks', h.risks, 'recommendation', h.recommendation,
        'delivery_consistency', s.delivery_consistency, 'quality_indicator', s.quality_indicator
      ) order by h.health_score desc)
      from public.supplier_health_scores h
      join public.supplier_monitoring_records s on s.id = h.supplier_id
      where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'product_watchlists', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', w.id, 'product_key', w.product_key, 'product_name', w.product_name,
        'category', w.category, 'watch_reason', w.watch_reason, 'status', w.status
      ) order by w.added_at desc)
      from public.dropshipping_product_watchlists w where w.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'order_health_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'insight_type', o.insight_type, 'title', o.title,
        'summary', o.summary, 'trend_direction', o.trend_direction
      ) order by o.detected_at desc)
      from public.order_health_insights o where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'delivery_risk_indicators', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'risk_type', d.risk_type, 'title', d.title,
        'summary', d.summary, 'severity', d.severity, 'resolved', d.resolved
      ) order by d.detected_at desc)
      from public.delivery_risk_events d where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'alert_type', a.alert_type, 'title', a.title,
        'summary', a.summary, 'priority', a.priority, 'acknowledged', a.acknowledged
      ) order by a.created_at desc)
      from public.dropshipping_opportunity_alerts a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'operations_recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'section', r.section, 'title', r.title, 'summary', r.summary,
        'recommendation_type', r.recommendation_type, 'priority', r.priority, 'rationale', r.rationale
      ) order by r.created_at desc)
      from public.operations_recommendations r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'escalation_activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'supplier_id', e.supplier_id, 'issue_summary', e.issue_summary,
        'escalation_status', e.escalation_status, 'alternative_supplier', e.alternative_supplier,
        'created_at', e.created_at
      ) order by e.created_at desc)
      from public.supplier_escalations e where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'risk_notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', n.id, 'title', n.title, 'message', n.message, 'priority', n.priority
      ) order by n.created_at desc)
      from public.dropshipping_risk_notifications n where n.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.dropshipping_operations_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commerce_intelligence', 'Product opportunities and supplier scores',
      'platform_install', 'Connected store catalog',
      'knowledge_center', 'Dropshipping operations guides and FAQ',
      'notifications', 'Operational alerts and risk notifications'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'dropshipping-operations', 'Dropshipping Operations', 'Monitor suppliers, delivery risks, watchlists and operational recommendations.', 'authenticated', 46
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'dropshipping-operations' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_dropshipping_operations_card() to authenticated;
grant execute on function public.get_dropshipping_operations_dashboard() to authenticated;
grant execute on function public.generate_dropshipping_operations_briefing() to authenticated;
grant execute on function public.add_dropshipping_watchlist(text, text, text, text) to authenticated;
grant execute on function public.create_supplier_escalation(uuid, text, text) to authenticated;
