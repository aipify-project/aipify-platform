-- Phase 453 — Market Intelligence & Opportunity Engine (Customer App)
-- Route: /app/intelligence/market

create table if not exists public.market_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  intelligence_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.market_intelligence_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'market_overview', 'customer_trends', 'opportunity_detection', 'market_gaps',
    'expansion_opportunities', 'emerging_demand', 'market_forecasts'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  metric_label text not null default '',
  metric_value text not null default '',
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  updated_at timestamptz not null default now()
);

create index if not exists market_intelligence_sections_org_idx
  on public.market_intelligence_section_items (organization_id, section_key);

create table if not exists public.market_intelligence_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  monitoring_type text not null check (monitoring_type in (
    'customer_demand', 'search_trends', 'industry_demand', 'regional_demand', 'service_demand', 'product_demand'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, monitoring_type)
);

create table if not exists public.market_intelligence_customer_behavior (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  behavior_type text not null check (behavior_type in (
    'buying_behavior', 'retention_behavior', 'upgrade_behavior', 'support_behavior', 'engagement_patterns'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, behavior_type)
);

create table if not exists public.market_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'underserved_segments', 'new_services', 'new_products', 'expansion_opportunities', 'business_pack_opportunities'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.market_intelligence_gaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  gap_type text not null check (gap_type in (
    'unmet_needs', 'competitor_gaps', 'service_gaps', 'product_gaps', 'onboarding_gaps'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now()
);

create table if not exists public.market_intelligence_geographic (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  geo_type text not null check (geo_type in ('countries', 'regions', 'languages', 'industries')),
  geo_key text not null,
  geo_name text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, geo_key)
);

create table if not exists public.market_intelligence_revenue_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_title text not null,
  opportunity_score_label text not null default '',
  potential_revenue_label text not null default '',
  adoption_potential_label text not null default '',
  market_size_label text not null default '',
  competition_level_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.market_intelligence_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'top_opportunities', 'fastest_growing_segments', 'emerging_demand', 'competitive_pressure', 'market_direction'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.market_intelligence_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'where_expand', 'missing_opportunity', 'fastest_segment'
  )),
  question text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  evidence_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists market_intelligence_companion_org_idx
  on public.market_intelligence_companion (organization_id, status);

create table if not exists public.market_intelligence_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_horizon text not null check (forecast_horizon in ('thirty_day', 'ninety_day', 'twelve_month')),
  horizon_label text not null,
  forecast_summary text not null default '' check (char_length(forecast_summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, forecast_horizon)
);

create table if not exists public.market_intelligence_audit (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  item_type text not null,
  item_id uuid,
  action text not null,
  description text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists market_intelligence_audit_org_idx
  on public.market_intelligence_audit (organization_id, created_at desc);

alter table public.market_intelligence_settings enable row level security;
alter table public.market_intelligence_section_items enable row level security;
alter table public.market_intelligence_monitoring enable row level security;
alter table public.market_intelligence_customer_behavior enable row level security;
alter table public.market_intelligence_opportunities enable row level security;
alter table public.market_intelligence_gaps enable row level security;
alter table public.market_intelligence_geographic enable row level security;
alter table public.market_intelligence_revenue_opportunities enable row level security;
alter table public.market_intelligence_executive_metrics enable row level security;
alter table public.market_intelligence_companion enable row level security;
alter table public.market_intelligence_forecasts enable row level security;
alter table public.market_intelligence_audit enable row level security;
revoke all on public.market_intelligence_settings from authenticated, anon;
revoke all on public.market_intelligence_section_items from authenticated, anon;
revoke all on public.market_intelligence_monitoring from authenticated, anon;
revoke all on public.market_intelligence_customer_behavior from authenticated, anon;
revoke all on public.market_intelligence_opportunities from authenticated, anon;
revoke all on public.market_intelligence_gaps from authenticated, anon;
revoke all on public.market_intelligence_geographic from authenticated, anon;
revoke all on public.market_intelligence_revenue_opportunities from authenticated, anon;
revoke all on public.market_intelligence_executive_metrics from authenticated, anon;
revoke all on public.market_intelligence_companion from authenticated, anon;
revoke all on public.market_intelligence_forecasts from authenticated, anon;
revoke all on public.market_intelligence_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'market_intelligence_center', v.description
from (values
  ('market_intelligence.view', 'View Market Intelligence Center', 'View market monitoring, opportunity discovery, and customer behavior intelligence'),
  ('market_intelligence.manage', 'Manage Market Intelligence Center', 'Manage market intelligence items and settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'market_intelligence.view'), ('owner', 'market_intelligence.manage'),
  ('administrator', 'market_intelligence.view'), ('administrator', 'market_intelligence.manage'),
  ('manager', 'market_intelligence.view'),
  ('employee', 'market_intelligence.view'),
  ('support_agent', 'market_intelligence.view'),
  ('moderator', 'market_intelligence.view'),
  ('viewer', 'market_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._mie453_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('market_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('market_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('market_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._mie453_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.market_intelligence_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._mie453_section_json(s public.market_intelligence_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._mie453_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.market_intelligence_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.market_intelligence_monitoring where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.market_intelligence_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'market_overview', 'Market overview', 'Market signals synthesized across demand, behavior, gaps, and expansion — opportunity-first intelligence.', 'Active signals', '12', 'verified'),
    (p_org_id, 'customer_trends', 'Customer trends', 'Buying, retention, upgrade, support, and engagement patterns tracked continuously.', 'Trends', '5', 'requires_attention'),
    (p_org_id, 'opportunity_detection', 'Opportunity detection', 'Underserved segments, new services, products, and Business Pack opportunities identified.', 'Opportunities', '4', 'verified'),
    (p_org_id, 'market_gaps', 'Market gaps', 'Problems competitors are not solving — unmet needs and service gaps detected.', 'Gaps', '3', 'requires_attention'),
    (p_org_id, 'expansion_opportunities', 'Expansion opportunities', 'Geographic and segment expansion windows with demand evidence.', 'Markets', '3', 'verified'),
    (p_org_id, 'emerging_demand', 'Emerging demand', 'New demand signals before they become mainstream — early mover advantage.', 'Signals', '5', 'information'),
    (p_org_id, 'market_forecasts', 'Market forecasts', '30-day, 90-day, and 12-month forecasts based on market signals.', 'Forecasts', '3', 'information');

  insert into public.market_intelligence_monitoring
    (organization_id, monitoring_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'customer_demand', 'Customer demand rising', 'Increased demand detected in short-term rental and hospitality operational services.', 'Demand signal metadata', '2026-Q2', 'High', 'Hospitality segment', 'information'),
    (p_org_id, 'search_trends', 'Enterprise AI search trends', 'Growth in enterprise AI adoption search volume — governance and onboarding keywords rising.', 'Search trend metadata', '2026-Q2', 'High', 'Enterprise GTM', 'verified'),
    (p_org_id, 'industry_demand', 'Industry demand signals', 'Hospitality and commerce verticals showing strongest industry-wide demand growth.', 'Industry demand metadata', '2026-Q2', 'High', 'Vertical strategy', 'verified'),
    (p_org_id, 'regional_demand', 'Nordic regional demand', 'Demand increasing in Nordic markets — Norway and Sweden leading hospitality digitization.', 'Regional demand metadata', '2026-Q2', 'High', 'Nordic expansion', 'verified'),
    (p_org_id, 'service_demand', 'Managed onboarding demand', 'Mid-market requesting managed onboarding services — new service line opportunity.', 'Service demand metadata', '2026-Q2', 'Moderate', 'Services revenue', 'information'),
    (p_org_id, 'product_demand', 'Self-service product demand', 'Self-service onboarding and governance dashboards becoming table stakes.', 'Product demand metadata', '2026-Q2', 'High', 'Product roadmap', 'requires_attention');

  insert into public.market_intelligence_customer_behavior
    (organization_id, behavior_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'buying_behavior', 'Delayed purchasing decisions', 'Customers delaying purchasing decisions — extended evaluation cycles in mid-market segment.', 'Customer behavior metadata', '2026-Q2', 'High', 'Sales cycle', 'requires_attention'),
    (p_org_id, 'retention_behavior', 'Retention stable', 'Enterprise retention stable — downgrade requests up 8% in price-sensitive segment.', 'Retention metadata', '2026-Q2', 'Moderate', 'Renewals', 'information'),
    (p_org_id, 'upgrade_behavior', 'Upgrade to annual plans', 'Customers shifting toward annual contracts with stronger ROI justification requirements.', 'Upgrade metadata', '2026-Q2', 'High', 'Pricing strategy', 'information'),
    (p_org_id, 'support_behavior', 'Support engagement rising', 'Support engagement increasing as customers scrutinize value during evaluation.', 'Support behavior metadata', '2026-Q2', 'Moderate', 'Support capacity', 'waiting'),
    (p_org_id, 'engagement_patterns', 'Product engagement patterns', 'Governance dashboard and onboarding wizard engagement highest among converting accounts.', 'Engagement metadata', '2026-Q2', 'High', 'Product focus', 'verified');

  insert into public.market_intelligence_opportunities
    (organization_id, opportunity_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'underserved_segments', 'Mid-market governance gap', 'Mid-market segment underserved for governance-grade ABOS capabilities at accessible price points.', 'Segment analysis metadata', '2026-Q2', 'High', 'Product positioning', 'verified'),
    (p_org_id, 'new_services', 'Managed onboarding services', 'Managed onboarding service opportunity — mid-market customers requesting hands-on implementation support.', 'Service opportunity metadata', '2026-Q2', 'Moderate', 'Services revenue', 'information'),
    (p_org_id, 'new_products', 'Automated onboarding product', 'Market gap for automated onboarding solutions — competitors lack integrated governance onboarding.', 'Product gap metadata', '2026-Q2', 'High', 'Product development', 'verified'),
    (p_org_id, 'expansion_opportunities', 'Nordic hospitality expansion', 'Nordic hospitality market expansion window — demand +12% with favorable competitive positioning.', 'Expansion metadata', '2026-Q2', 'High', 'GTM expansion', 'verified'),
    (p_org_id, 'business_pack_opportunities', 'Hospitality Business Pack', 'Suggested opportunity: Launch specialized Hospitality Business Pack — pilot validation complete.', 'Business pack metadata', '2026-Q2', 'High', 'Vertical revenue', 'verified');

  insert into public.market_intelligence_gaps
    (organization_id, gap_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'onboarding_gaps', 'Automated onboarding gap', 'Industry lacks automated onboarding solutions with integrated governance — significant unmet need.', 'Gap detection metadata', '2026-Q2', 'High', 'Product opportunity', 'requires_attention'),
    (p_org_id, 'competitor_gaps', 'Governance dashboard gap', 'Competitors lack enterprise governance dashboards in mid-market pricing tier.', 'Competitive gap metadata', '2026-Q2', 'High', 'Competitive advantage', 'verified'),
    (p_org_id, 'service_gaps', 'Managed implementation gap', 'Few providers offer managed ABOS implementation for mid-market hospitality operators.', 'Service gap metadata', '2026-Q2', 'Moderate', 'Services opportunity', 'information'),
    (p_org_id, 'unmet_needs', 'Experience automation unmet need', 'Hospitality operators seeking experience automation beyond basic operational tools.', 'Unmet need metadata', '2026-Q2', 'High', 'Product strategy', 'requires_attention');

  insert into public.market_intelligence_geographic
    (organization_id, geo_type, geo_key, geo_name, summary, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'countries', 'norway', 'Norway', 'Strong demand in Norwegian hospitality and enterprise governance segments.', 'Geographic metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'countries', 'sweden', 'Sweden', 'Swedish market showing hospitality digitization demand — partnership opportunities.', 'Geographic metadata', '2026-Q2', 'Moderate', 'information'),
    (p_org_id, 'regions', 'nordic', 'Nordic', 'Demand increasing in Nordic markets — favorable expansion window for hospitality vertical.', 'Regional metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'regions', 'north_america', 'North America', 'North American enterprise software demand supports controlled expansion pilot.', 'Regional metadata', '2026-Q2', 'Moderate', 'waiting'),
    (p_org_id, 'languages', 'nordic_locales', 'Nordic locales', 'Norwegian, Swedish, and Danish localization complete — market-ready for Nordic expansion.', 'Language metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'industries', 'hospitality', 'Hospitality', 'Hospitality fastest-growing vertical — +34% inquiry volume QoQ.', 'Industry geographic metadata', '2026-Q2', 'High', 'verified');

  insert into public.market_intelligence_revenue_opportunities
    (organization_id, opportunity_title, opportunity_score_label, potential_revenue_label, adoption_potential_label, market_size_label, competition_level_label, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'Hospitality Business Pack launch', '87/100', 'High', 'Strong', 'Nordic hospitality TAM growing', 'Moderate — vertical positioning advantage', 'Revenue opportunity model', '2026-Q2', 'High', 'Vertical ARR growth', 'verified'),
    (p_org_id, 'Mid-market governance tier', '72/100', 'Moderate', 'Moderate', 'Mid-market ABOS segment underserved', 'Low — few governance competitors', 'Revenue opportunity model', '2026-Q2', 'Moderate', 'New tier revenue', 'information'),
    (p_org_id, 'Managed onboarding services', '65/100', 'Moderate', 'Growing', 'Mid-market implementation services', 'Low', 'Revenue opportunity model', '2026-Q2', 'Moderate', 'Services revenue', 'waiting');

  insert into public.market_intelligence_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'top_opportunities', '3 active', 'Hospitality Pack · governance tier · managed onboarding', 'verified'),
    (p_org_id, 'fastest_growing_segments', 'Hospitality', '+34% inquiry volume QoQ — enterprise governance second', 'verified'),
    (p_org_id, 'emerging_demand', '5 signals', 'Short-term rental · enterprise AI · Nordic expansion · managed onboarding · experience automation', 'information'),
    (p_org_id, 'competitive_pressure', 'Moderate', '3 new hospitality AI entrants — vertical positioning maintained', 'requires_attention'),
    (p_org_id, 'market_direction', 'Vertical + experience', 'Specialization and experience automation defining market direction', 'verified');

  insert into public.market_intelligence_companion
    (organization_id, advisor_type, question, insight, evidence_label, source_label, date_label, confidence_label, impact_label)
  values
    (p_org_id, 'where_expand', 'Where should we expand next?', 'Nordic hospitality markets show strongest evidence — Norway and Sweden lead with +12% booking growth, localization ready, and vertical positioning advantage over horizontal competitors.', 'Geographic expansion · regional demand · revenue opportunity scores', 'Market Intelligence Engine', '2026-Q2', 'High', 'GTM expansion'),
    (p_org_id, 'missing_opportunity', 'What opportunity are we missing?', 'Specialized Hospitality Business Pack — market gap for automated onboarding with governance, +34% segment inquiry growth, opportunity score 87/100.', 'Opportunity discovery · market gaps · revenue engine', 'Opportunity Discovery Engine', '2026-Q2', 'High', 'Vertical revenue'),
    (p_org_id, 'fastest_segment', 'What customer segment is growing fastest?', 'Hospitality operators seeking experience automation — fastest inquiry growth at +34% QoQ, followed by mid-market enterprise governance at +22%.', 'Customer behavior · market monitoring · executive dashboard', 'Customer Behavior Intelligence', '2026-Q2', 'High', 'Segment focus');

  insert into public.market_intelligence_forecasts
    (organization_id, forecast_horizon, horizon_label, forecast_summary, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'thirty_day', '30 Day Forecast', 'Hospitality inquiry volume expected to remain strong — prioritize pilot conversions and onboarding capacity.', 'Forecast model metadata', '2026-Q2', 'Moderate', 'information'),
    (p_org_id, 'ninety_day', '90 Day Forecast', 'Nordic expansion window favorable — Hospitality Pack launch timing aligned with seasonal demand peak.', 'Forecast model metadata', '2026-Q2', 'Moderate', 'verified'),
    (p_org_id, 'twelve_month', '12 Month Forecast', 'Vertical specialization trend accelerating — experience automation and governance becoming market requirements.', 'Forecast model metadata', '2026-Q2', 'Moderate', 'information');

end; $$;

create or replace function public.get_market_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_overview_s jsonb; v_customer_s jsonb; v_opportunity_s jsonb; v_gaps_s jsonb;
  v_expansion_s jsonb; v_demand_s jsonb; v_forecast_s jsonb;
  v_monitoring jsonb; v_behavior jsonb; v_opportunities jsonb; v_gaps jsonb;
  v_geographic jsonb; v_revenue jsonb; v_exec jsonb; v_companion jsonb; v_forecasts jsonb;
begin
  perform public._irp_require_permission('market_intelligence.view');
  v_ctx := public._mie453_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._mie453_seed(v_org_id);

  select jsonb_build_object(
    'intelligence_enabled', s.intelligence_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.market_intelligence_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'market_overview';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_customer_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'customer_trends';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_opportunity_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'opportunity_detection';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_gaps_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'market_gaps';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_expansion_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'expansion_opportunities';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_demand_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'emerging_demand';
  select coalesce(jsonb_agg(public._mie453_section_json(s)), '[]'::jsonb) into v_forecast_s
  from public.market_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'market_forecasts';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'monitoring_type', m.monitoring_type, 'title', m.title, 'summary', m.summary,
    'source_label', m.source_label, 'date_label', m.date_label,
    'confidence_label', m.confidence_label, 'impact_label', m.impact_label,
    'status_key', m.status_key, 'item_type', 'monitoring'
  ) order by m.title), '[]'::jsonb)
  into v_monitoring from public.market_intelligence_monitoring m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'behavior_type', b.behavior_type, 'title', b.title, 'summary', b.summary,
    'source_label', b.source_label, 'date_label', b.date_label,
    'confidence_label', b.confidence_label, 'impact_label', b.impact_label,
    'status_key', b.status_key, 'item_type', 'customer_behavior'
  ) order by b.title), '[]'::jsonb)
  into v_behavior from public.market_intelligence_customer_behavior b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary,
    'source_label', o.source_label, 'date_label', o.date_label,
    'confidence_label', o.confidence_label, 'impact_label', o.impact_label,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.title), '[]'::jsonb)
  into v_opportunities from public.market_intelligence_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'gap_type', g.gap_type, 'title', g.title, 'summary', g.summary,
    'source_label', g.source_label, 'date_label', g.date_label,
    'confidence_label', g.confidence_label, 'impact_label', g.impact_label,
    'status_key', g.status_key, 'item_type', 'market_gap'
  ) order by g.title), '[]'::jsonb)
  into v_gaps from public.market_intelligence_gaps g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', g.id, 'geo_type', g.geo_type, 'geo_key', g.geo_key, 'geo_name', g.geo_name,
    'summary', g.summary, 'source_label', g.source_label, 'date_label', g.date_label,
    'confidence_label', g.confidence_label, 'status_key', g.status_key, 'item_type', 'geographic'
  ) order by g.geo_name), '[]'::jsonb)
  into v_geographic from public.market_intelligence_geographic g where g.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'opportunity_title', r.opportunity_title,
    'opportunity_score_label', r.opportunity_score_label, 'potential_revenue_label', r.potential_revenue_label,
    'adoption_potential_label', r.adoption_potential_label, 'market_size_label', r.market_size_label,
    'competition_level_label', r.competition_level_label,
    'source_label', r.source_label, 'date_label', r.date_label,
    'confidence_label', r.confidence_label, 'impact_label', r.impact_label,
    'status_key', r.status_key, 'item_type', 'revenue_opportunity'
  ) order by r.opportunity_title), '[]'::jsonb)
  into v_revenue from public.market_intelligence_revenue_opportunities r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'top_opportunities' then 1 when 'fastest_growing_segments' then 2 when 'emerging_demand' then 3
    when 'competitive_pressure' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.market_intelligence_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'question', c.question,
    'insight', c.insight, 'evidence_label', c.evidence_label,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'impact_label', c.impact_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.market_intelligence_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'forecast_horizon', f.forecast_horizon, 'horizon_label', f.horizon_label,
    'forecast_summary', f.forecast_summary, 'source_label', f.source_label,
    'date_label', f.date_label, 'confidence_label', f.confidence_label,
    'status_key', f.status_key, 'item_type', 'forecast'
  ) order by case f.forecast_horizon when 'thirty_day' then 1 when 'ninety_day' then 2 else 3 end), '[]'::jsonb)
  into v_forecasts from public.market_intelligence_forecasts f where f.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'The market changes every day. Organizations that recognize opportunities early gain a significant competitive advantage — Aipify helps you see opportunities before competitors do.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All market intelligence includes source, date, confidence score, estimated impact, and audit history. Human-controlled — no autonomous strategic authority.',
    'intelligence_settings', coalesce(v_settings, '{}'::jsonb),
    'market_monitoring_engine', v_monitoring,
    'customer_behavior_intelligence', v_behavior,
    'opportunity_discovery_engine', v_opportunities,
    'market_gap_detection', v_gaps,
    'geographic_expansion_intelligence', v_geographic,
    'revenue_opportunity_engine', v_revenue,
    'executive_market_dashboard', v_exec,
    'companion_market_advisor', v_companion,
    'forecasting_engine', v_forecasts,
    'sections', jsonb_build_object(
      'market_overview', v_overview_s,
      'customer_trends', v_customer_s,
      'opportunity_detection', v_opportunity_s,
      'market_gaps', v_gaps_s,
      'expansion_opportunities', v_expansion_s,
      'emerging_demand', v_demand_s,
      'market_forecasts', v_forecast_s
    ),
    'statistics', jsonb_build_object(
      'monitoring_count', jsonb_array_length(v_monitoring),
      'behavior_count', jsonb_array_length(v_behavior),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'gap_count', jsonb_array_length(v_gaps),
      'revenue_count', jsonb_array_length(v_revenue),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Market intelligence metadata and aggregate signals only — no raw customer records or unapproved PII.'
  );
end; $$;

create or replace function public.manage_market_intelligence_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._mie453_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.market_intelligence_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'opportunity' and p_item_id is not null then
    update public.market_intelligence_opportunities set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'market_gap' and p_item_id is not null then
    update public.market_intelligence_gaps set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._mie453_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Market intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_market_intelligence_center() to authenticated;
grant execute on function public.manage_market_intelligence_item(text, uuid, text, jsonb) to authenticated;
