-- Phase 106 — Supplier Intelligence & Relationship Engine
-- Principle: Cultivate stronger, resilient supplier relationships through visibility and stewardship.
-- Note: health scores stored in supplier_intelligence_health_scores (distinct from dropshipping Phase 103 supplier_health_scores).

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
    'multi_store_orchestration', 'supplier_intelligence'
  )
);

-- ---------------------------------------------------------------------------
-- 1. supplier_intelligence_settings
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  engine_enabled boolean not null default true,
  auto_replacement_disabled boolean not null default true,
  diversification_alert_threshold numeric(5, 2) not null default 70.0 check (
    diversification_alert_threshold between 0 and 100
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.supplier_intelligence_settings enable row level security;
revoke all on public.supplier_intelligence_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. supplier_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_key text not null,
  supplier_name text not null,
  status text not null default 'active' check (
    status in ('active', 'monitoring', 'review', 'paused', 'archived')
  ),
  region text not null default 'global',
  dependency_level text not null default 'moderate' check (
    dependency_level in ('low', 'moderate', 'high', 'critical')
  ),
  relationship_longevity_months int not null default 12 check (relationship_longevity_months >= 0),
  unique (tenant_id, supplier_key)
);

alter table public.supplier_profiles enable row level security;
revoke all on public.supplier_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. supplier_intelligence_health_scores (Phase 106 — not dropshipping supplier_health_scores)
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_intelligence_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete cascade,
  health_score numeric(5, 2) not null check (health_score between 0 and 100),
  status_level text not null check (
    status_level in ('trusted', 'stable', 'monitor_closely', 'high_risk', 'escalation_recommended')
  ),
  delivery_reliability numeric(5, 2) not null default 80.0,
  quality_indicator numeric(5, 2) not null default 80.0,
  refund_frequency numeric(5, 2) not null default 10.0,
  responsiveness numeric(5, 2) not null default 80.0,
  margin_performance numeric(5, 2) not null default 75.0,
  scored_at timestamptz not null default now()
);

alter table public.supplier_intelligence_health_scores enable row level security;
revoke all on public.supplier_intelligence_health_scores from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. relationship, risk, opportunity, diversification
-- ---------------------------------------------------------------------------
create table if not exists public.supplier_relationship_records (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete cascade,
  contact_history_summary text,
  meeting_summary text,
  improvement_initiative text,
  partnership_opportunity text,
  recorded_at timestamptz not null default now()
);

alter table public.supplier_relationship_records enable row level security;
revoke all on public.supplier_relationship_records from authenticated, anon;

create table if not exists public.supplier_risk_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete set null,
  risk_type text not null check (
    risk_type in (
      'delivery_instability', 'quality_decline', 'communication_gap',
      'dependency_concentration', 'margin_erosion', 'contract_renewal'
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

alter table public.supplier_risk_events enable row level security;
revoke all on public.supplier_risk_events from authenticated, anon;

create table if not exists public.supplier_opportunity_insights (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete set null,
  opportunity_type text not null check (
    opportunity_type in (
      'partnership_expansion', 'exclusive_line', 'cost_improvement',
      'quality_upgrade', 'regional_expansion', 'co_marketing'
    )
  ),
  title text not null,
  summary text not null,
  priority text not null default 'moderate' check (
    priority in ('informational', 'moderate', 'important', 'critical')
  ),
  created_at timestamptz not null default now()
);

alter table public.supplier_opportunity_insights enable row level security;
revoke all on public.supplier_opportunity_insights from authenticated, anon;

create table if not exists public.supplier_diversification_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete set null,
  alert_type text not null check (
    alert_type in ('single_supplier_dependency', 'category_concentration', 'regional_exposure', 'margin_concentration')
  ),
  title text not null,
  summary text not null,
  affected_products_count int not null default 0,
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.supplier_diversification_alerts enable row level security;
revoke all on public.supplier_diversification_alerts from authenticated, anon;

create table if not exists public.supplier_intelligence_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  supplier_id uuid references public.supplier_profiles (id) on delete set null,
  section text not null check (
    section in (
      'supplier_dashboard', 'health_scores', 'risk_events', 'opportunity_insights',
      'diversification', 'relationship', 'recommendations'
    )
  ),
  title text not null,
  summary text not null,
  recommendation_type text not null,
  priority text not null default 'moderate',
  rationale text not null,
  created_at timestamptz not null default now()
);

alter table public.supplier_intelligence_recommendations enable row level security;
revoke all on public.supplier_intelligence_recommendations from authenticated, anon;

create table if not exists public.supplier_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  summary text not null,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.supplier_intelligence_briefings enable row level security;
revoke all on public.supplier_intelligence_briefings from authenticated, anon;

create table if not exists public.supplier_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_type text not null,
  summary text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.supplier_intelligence_audit_logs enable row level security;
revoke all on public.supplier_intelligence_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers (_sir_)
-- ---------------------------------------------------------------------------
create or replace function public._sir_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._sir_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null,
  p_context jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.supplier_intelligence_audit_logs (tenant_id, action_type, summary, context)
  values (p_tenant_id, p_action_type, p_summary, p_context)
  returning id into v_id;
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'supplier_intelligence_' || p_action_type,
    'supplier_intelligence', 'logged', null, p_context
  );
  return v_id;
end; $$;

create or replace function public._sir_ensure_settings(p_tenant_id uuid)
returns public.supplier_intelligence_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.supplier_intelligence_settings;
begin
  insert into public.supplier_intelligence_settings (tenant_id) values (p_tenant_id) on conflict (tenant_id) do nothing;
  select * into v_settings from public.supplier_intelligence_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._sir_seed_suppliers(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.supplier_profiles (
    tenant_id, supplier_key, supplier_name, status, region, dependency_level, relationship_longevity_months
  )
  select p_tenant_id, v.key, v.name, v.status, v.region, v.dependency, v.months
  from (values
    ('nordic_activewear_partners', 'Nordic Activewear Partners', 'active', 'Nordic', 'moderate', 24),
    ('global_textile_supply', 'Global Textile Supply', 'monitoring', 'Asia-Pacific', 'high', 18),
    ('premium_sport_fabrics', 'Premium Sport Fabrics', 'active', 'EU', 'low', 36),
    ('international_dropship_alliance', 'International Dropship Alliance', 'review', 'Global', 'critical', 8)
  ) as v(key, name, status, region, dependency, months)
  where not exists (
    select 1 from public.supplier_profiles s where s.tenant_id = p_tenant_id and s.supplier_key = v.key
  );

  insert into public.supplier_intelligence_health_scores (
    tenant_id, supplier_id, health_score, status_level,
    delivery_reliability, quality_indicator, refund_frequency, responsiveness, margin_performance
  )
  select p_tenant_id, s.id, v.score, v.level, v.delivery, v.quality, v.refund, v.resp, v.margin
  from public.supplier_profiles s
  join (values
    ('nordic_activewear_partners', 91.0, 'trusted', 94.0, 92.0, 4.0, 90.0, 88.0),
    ('global_textile_supply', 68.0, 'monitor_closely', 72.0, 75.0, 14.0, 70.0, 71.0),
    ('premium_sport_fabrics', 87.0, 'stable', 88.0, 90.0, 6.0, 85.0, 82.0),
    ('international_dropship_alliance', 52.0, 'escalation_recommended', 55.0, 58.0, 22.0, 60.0, 54.0)
  ) as v(key, score, level, delivery, quality, refund, resp, margin) on s.supplier_key = v.key and s.tenant_id = p_tenant_id
  where not exists (
    select 1 from public.supplier_intelligence_health_scores h where h.supplier_id = s.id
  );
end; $$;

create or replace function public._sir_seed_insights(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_global_id uuid;
  v_nordic_id uuid;
  v_intl_id uuid;
begin
  select id into v_global_id from public.supplier_profiles
  where tenant_id = p_tenant_id and supplier_key = 'global_textile_supply';
  select id into v_nordic_id from public.supplier_profiles
  where tenant_id = p_tenant_id and supplier_key = 'nordic_activewear_partners';
  select id into v_intl_id from public.supplier_profiles
  where tenant_id = p_tenant_id and supplier_key = 'international_dropship_alliance';

  insert into public.supplier_relationship_records (
    tenant_id, supplier_id, contact_history_summary, meeting_summary, improvement_initiative, partnership_opportunity
  )
  select p_tenant_id, v_nordic_id, v.contact, v.meeting, v.improve, v.partner
  from (values
    (
      'Quarterly check-ins maintained — responsive account manager.',
      'Q1 partnership review discussed seasonal capacity and exclusive colorways.',
      'Joint quality audit scheduled for activewear line.',
      'Co-branded Nordic collection opportunity for Sportsklær.no.'
    )
  ) as v(contact, meeting, improve, partner)
  where v_nordic_id is not null
    and not exists (select 1 from public.supplier_relationship_records r where r.tenant_id = p_tenant_id limit 1);

  insert into public.supplier_risk_events (tenant_id, supplier_id, risk_type, title, summary, severity)
  select p_tenant_id, v.supplier_id, v.type, v.title, v.summary, v.severity
  from (values
    (v_intl_id, 'dependency_concentration', 'High Dependency Alert', 'International Dropship Alliance supplies 42% of active SKUs — diversification review recommended.', 'important'),
    (v_global_id, 'delivery_instability', 'Delivery Variance Increasing', 'Global Textile Supply delivery reliability declined over last 60 days.', 'moderate'),
    (v_global_id, 'margin_erosion', 'Margin Pressure Signal', 'Supplier fee adjustments may reduce landed margin on core categories.', 'moderate')
  ) as v(supplier_id, type, title, summary, severity)
  where not exists (select 1 from public.supplier_risk_events r where r.tenant_id = p_tenant_id limit 1);

  insert into public.supplier_opportunity_insights (tenant_id, supplier_id, opportunity_type, title, summary, priority)
  select p_tenant_id, v.supplier_id, v.type, v.title, v.summary, v.priority
  from (values
    (v_nordic_id, 'partnership_expansion', 'Expand Nordic Partnership', 'Strong scores support deeper collaboration on seasonal activewear lines.', 'important'),
    (v_nordic_id, 'exclusive_line', 'Exclusive Colorway Line', 'Partnership opportunity for store-exclusive Nordic palette collection.', 'moderate'),
    (null::uuid, 'regional_expansion', 'EU Supplier Diversification', 'Premium Sport Fabrics could reduce Asia-Pacific concentration.', 'moderate')
  ) as v(supplier_id, type, title, summary, priority)
  where not exists (select 1 from public.supplier_opportunity_insights o where o.tenant_id = p_tenant_id limit 1);

  insert into public.supplier_diversification_alerts (
    tenant_id, supplier_id, alert_type, title, summary, affected_products_count
  )
  select p_tenant_id, v_intl_id, v.type, v.title, v.summary, v.count
  from (values
    ('single_supplier_dependency', 'Single Supplier Concentration', 'One supplier accounts for disproportionate SKU dependency — stewardship review suggested.', 38),
    ('category_concentration', 'Activewear Category Exposure', 'Activewear category heavily tied to two suppliers — diversification planning recommended.', 24)
  ) as v(type, title, summary, count)
  where not exists (select 1 from public.supplier_diversification_alerts d where d.tenant_id = p_tenant_id limit 1);

  insert into public.supplier_intelligence_recommendations (
    tenant_id, supplier_id, section, title, summary, recommendation_type, priority, rationale
  )
  select p_tenant_id, v.supplier_id, v.section, v.title, v.summary, v.type, v.priority, v.rationale
  from (values
    (null::uuid, 'supplier_dashboard', 'Portfolio Health Stable', 'Overall supplier portfolio performing within stewardship thresholds.', 'monitor', 'moderate', 'Average health score supports continued partnership stewardship.'),
    (v_nordic_id, 'relationship', 'Deepen Nordic Partnership', 'Schedule renewal discussion with Nordic Activewear Partners.', 'partnership_review', 'important', 'Trusted scores and long relationship longevity support expansion — not replacement.'),
    (v_global_id, 'health_scores', 'Review Global Textile Performance', 'Delivery and margin signals suggest a performance discussion.', 'performance_discussion', 'moderate', 'Stewardship conversation before considering alternatives — partnership not extraction.'),
    (v_intl_id, 'diversification', 'Reduce Dependency Gradually', 'Plan diversification without abrupt supplier replacement.', 'diversify_supply', 'important', 'auto_replacement_disabled — human oversight required for any supplier change.'),
    (v_intl_id, 'risk_events', 'Address Concentration Risk', 'Document mitigation plan for high-dependency supplier.', 'mitigate_risk', 'important', 'Diversification alert threshold crossed — humans decide timing.'),
    (null::uuid, 'opportunity_insights', 'Explore Exclusive Line', 'Evaluate co-branded exclusive line with trusted Nordic partner.', 'evaluate_opportunity', 'moderate', 'Partnership opportunity aligns with Sportsklær.no brand positioning.'),
    (null::uuid, 'recommendations', 'Prepare Renewal Briefing', 'Generate stewardship briefing before contract renewal season.', 'generate_briefing', 'informational', 'Meeting Companion cross-link for renewal prep.')
  ) as v(supplier_id, section, title, summary, type, priority, rationale)
  where not exists (select 1 from public.supplier_intelligence_recommendations r where r.tenant_id = p_tenant_id limit 1);
end; $$;

create or replace function public._sir_refresh_metrics(p_tenant_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_portfolio_score numeric;
  v_active_suppliers int;
  v_open_risks int;
  v_opportunities int;
  v_diversification int;
  v_health_class text;
begin
  select coalesce(avg(health_score), 75.0) into v_portfolio_score
  from public.supplier_intelligence_health_scores where tenant_id = p_tenant_id;

  select count(*) into v_active_suppliers from public.supplier_profiles
  where tenant_id = p_tenant_id and status in ('active', 'monitoring');

  select count(*) into v_open_risks from public.supplier_risk_events
  where tenant_id = p_tenant_id and resolved = false;

  select count(*) into v_opportunities from public.supplier_opportunity_insights
  where tenant_id = p_tenant_id;

  select count(*) into v_diversification from public.supplier_diversification_alerts
  where tenant_id = p_tenant_id and acknowledged = false;

  v_portfolio_score := least(100, round(v_portfolio_score - v_open_risks * 3, 1));

  v_health_class := case
    when v_portfolio_score >= 90 then 'excellent'
    when v_portfolio_score >= 75 then 'stable'
    when v_portfolio_score >= 60 then 'needs_attention'
    when v_portfolio_score >= 45 then 'high_risk'
    else 'immediate_review'
  end;

  return jsonb_build_object(
    'portfolio_score', v_portfolio_score,
    'health_classification', v_health_class,
    'active_suppliers', v_active_suppliers,
    'open_risks', v_open_risks,
    'opportunity_insights', v_opportunities,
    'diversification_alerts', v_diversification,
    'relationship_records', (select count(*) from public.supplier_relationship_records where tenant_id = p_tenant_id),
    'recommendations_pending', (select count(*) from public.supplier_intelligence_recommendations where tenant_id = p_tenant_id)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Action RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_supplier_relationship_note(
  p_supplier_id uuid, p_note_type text, p_summary text
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_id uuid;
begin
  v_tenant_id := public._sir_require_tenant();

  insert into public.supplier_relationship_records (
    tenant_id, supplier_id,
    contact_history_summary, meeting_summary, improvement_initiative, partnership_opportunity
  )
  values (
    v_tenant_id, p_supplier_id,
    case when p_note_type = 'contact' then p_summary else null end,
    case when p_note_type = 'meeting' then p_summary else null end,
    case when p_note_type = 'improvement' then p_summary else null end,
    case when p_note_type = 'partnership' then p_summary else null end
  )
  returning id into v_id;

  perform public._sir_log_audit(v_tenant_id, 'relationship_note_created', p_summary,
    jsonb_build_object('supplier_id', p_supplier_id, 'note_type', p_note_type, 'record_id', v_id));

  return jsonb_build_object('status', 'recorded', 'record_id', v_id, 'requires_approval', false);
end; $$;

create or replace function public.record_supplier_recommendation_action(
  p_recommendation_id uuid, p_action text, p_summary text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._sir_require_tenant();

  perform public._sir_log_audit(v_tenant_id, 'recommendation_action', coalesce(p_summary, p_action),
    jsonb_build_object('recommendation_id', p_recommendation_id, 'action', p_action));

  return jsonb_build_object(
    'status', 'logged',
    'recommendation_id', p_recommendation_id,
    'action', p_action,
    'human_oversight_required', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.generate_supplier_intelligence_briefing()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb; v_id uuid; v_summary text;
begin
  v_tenant_id := public._sir_require_tenant();
  v_metrics := public._sir_refresh_metrics(v_tenant_id);
  v_summary := 'Supplier stewardship briefing: portfolio score ' || (v_metrics->>'portfolio_score') || '/100, '
    || (v_metrics->>'active_suppliers') || ' active suppliers, '
    || (v_metrics->>'open_risks') || ' open risks, '
    || (v_metrics->>'diversification_alerts') || ' diversification alerts.';

  insert into public.supplier_intelligence_briefings (tenant_id, summary, metrics)
  values (v_tenant_id, v_summary, v_metrics) returning id into v_id;

  perform public._sir_log_audit(v_tenant_id, 'briefing_generated', v_summary, v_metrics);
  return jsonb_build_object('briefing_id', v_id, 'summary', v_summary);
end; $$;

create or replace function public.get_supplier_intelligence_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_metrics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  perform public._sir_ensure_settings(v_tenant_id);
  v_metrics := public._sir_refresh_metrics(v_tenant_id);
  return jsonb_build_object(
    'has_customer', true,
    'portfolio_score', v_metrics->'portfolio_score',
    'health_classification', v_metrics->'health_classification',
    'philosophy', 'Suppliers are partners, not transactional resources — trust and mutual value.',
    'human_oversight_required', true
  );
end; $$;

create or replace function public.get_supplier_intelligence_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.supplier_intelligence_settings;
  v_metrics jsonb;
begin
  v_tenant_id := public._sir_require_tenant();
  v_settings := public._sir_ensure_settings(v_tenant_id);
  perform public._sir_seed_suppliers(v_tenant_id);
  perform public._sir_seed_insights(v_tenant_id);
  v_metrics := public._sir_refresh_metrics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'auto_replacement_disabled', v_settings.auto_replacement_disabled,
    'philosophy', 'Suppliers are partners, not transactional resources — trust and mutual value.',
    'safety_note', 'Aipify recommends stewardship actions — organizations remain responsible for supplier decisions. No automatic supplier replacement.',
    'engine_enabled', v_settings.engine_enabled,
    'diversification_alert_threshold', v_settings.diversification_alert_threshold,
    'portfolio_score', v_metrics->'portfolio_score',
    'health_classification', v_metrics->'health_classification',
    'active_suppliers', v_metrics->'active_suppliers',
    'open_risks', v_metrics->'open_risks',
    'opportunity_insights_count', v_metrics->'opportunity_insights',
    'diversification_alerts_count', v_metrics->'diversification_alerts',
    'relationship_records_count', v_metrics->'relationship_records',
    'recommendations_pending', v_metrics->'recommendations_pending',
    'supplier_profiles', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'supplier_key', p.supplier_key, 'supplier_name', p.supplier_name,
        'status', p.status, 'region', p.region, 'dependency_level', p.dependency_level,
        'relationship_longevity_months', p.relationship_longevity_months
      ) order by p.supplier_name)
      from public.supplier_profiles p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'health_scores', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'supplier_id', h.supplier_id, 'supplier_name', p.supplier_name,
        'health_score', h.health_score, 'status_level', h.status_level,
        'delivery_reliability', h.delivery_reliability, 'quality_indicator', h.quality_indicator,
        'refund_frequency', h.refund_frequency, 'responsiveness', h.responsiveness,
        'margin_performance', h.margin_performance
      ) order by h.health_score desc)
      from public.supplier_intelligence_health_scores h
      join public.supplier_profiles p on p.id = h.supplier_id
      where h.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'relationship_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'supplier_id', r.supplier_id, 'supplier_name', p.supplier_name,
        'contact_history_summary', r.contact_history_summary, 'meeting_summary', r.meeting_summary,
        'improvement_initiative', r.improvement_initiative, 'partnership_opportunity', r.partnership_opportunity,
        'recorded_at', r.recorded_at
      ) order by r.recorded_at desc)
      from public.supplier_relationship_records r
      left join public.supplier_profiles p on p.id = r.supplier_id
      where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'risk_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'supplier_id', e.supplier_id, 'supplier_name', p.supplier_name,
        'risk_type', e.risk_type, 'title', e.title, 'summary', e.summary,
        'severity', e.severity, 'resolved', e.resolved
      ) order by e.detected_at desc)
      from public.supplier_risk_events e
      left join public.supplier_profiles p on p.id = e.supplier_id
      where e.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'opportunity_insights', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', o.id, 'supplier_id', o.supplier_id, 'supplier_name', p.supplier_name,
        'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary, 'priority', o.priority
      ) order by o.created_at desc)
      from public.supplier_opportunity_insights o
      left join public.supplier_profiles p on p.id = o.supplier_id
      where o.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'diversification_alerts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'supplier_id', d.supplier_id, 'supplier_name', p.supplier_name,
        'alert_type', d.alert_type, 'title', d.title, 'summary', d.summary,
        'affected_products_count', d.affected_products_count, 'acknowledged', d.acknowledged
      ) order by d.created_at desc)
      from public.supplier_diversification_alerts d
      left join public.supplier_profiles p on p.id = d.supplier_id
      where d.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'recommendations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'supplier_id', r.supplier_id, 'section', r.section, 'title', r.title,
        'summary', r.summary, 'recommendation_type', r.recommendation_type,
        'priority', r.priority, 'rationale', r.rationale
      ) order by r.created_at desc)
      from public.supplier_intelligence_recommendations r where r.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.supplier_intelligence_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'dropshipping_operations', 'Operational supplier monitoring for dropshipping — cross-link, not duplicate',
      'commerce_intelligence', 'Supplier insights during product discovery',
      'commerce_performance', 'Margin contributions cross-link',
      'multi_store', 'Supplier dependencies across portfolio',
      'marketplace_governance', 'Marketplace supplier profiles/scores — distinct layer',
      'meeting_companion', 'Supplier meeting summaries cross-link',
      'integration_engine', 'Shopify supplier ecosystems',
      'knowledge_center', 'Supplier intelligence guides and FAQ',
      'approvals', 'Supplier decisions requiring human approval'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'supplier-intelligence', 'Supplier Intelligence & Relationship',
  'Partnership stewardship — supplier health, diversification, relationship records, and stewardship recommendations.',
  'authenticated', 48
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'supplier-intelligence' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_supplier_intelligence_card() to authenticated;
grant execute on function public.get_supplier_intelligence_dashboard() to authenticated;
grant execute on function public.generate_supplier_intelligence_briefing() to authenticated;
grant execute on function public.create_supplier_relationship_note(uuid, text, text) to authenticated;
grant execute on function public.record_supplier_recommendation_action(uuid, text, text) to authenticated;
