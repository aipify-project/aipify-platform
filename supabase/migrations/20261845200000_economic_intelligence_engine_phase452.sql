-- Phase 452 — Economic Intelligence Engine (Customer App)
-- Route: /app/intelligence/economy

create table if not exists public.economic_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  intelligence_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.economic_intelligence_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'economic_overview', 'inflation', 'interest_rates', 'employment', 'consumer_trends',
    'business_climate', 'economic_risks', 'economic_opportunities'
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

create index if not exists economic_intelligence_sections_org_idx
  on public.economic_intelligence_section_items (organization_id, section_key);

create table if not exists public.economic_intelligence_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  monitoring_type text not null check (monitoring_type in (
    'inflation', 'interest_rates', 'employment', 'consumer_confidence',
    'business_confidence', 'economic_growth', 'economic_slowdowns'
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

create table if not exists public.economic_intelligence_regional (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scope_type text not null check (scope_type in ('global', 'country', 'region', 'industry')),
  region_key text not null check (region_key in (
    'global', 'norway', 'europe', 'north_america', 'asia_pacific'
  )),
  region_name text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, region_key)
);

create table if not exists public.economic_intelligence_business_impact (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  impact_area text not null check (impact_area in (
    'revenue', 'customers', 'pricing', 'hiring', 'investments', 'support_demand', 'vendor_costs'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, impact_area)
);

create table if not exists public.economic_intelligence_consumer_spending (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  spending_type text not null check (spending_type in (
    'consumer_demand', 'spending_trends', 'purchase_behavior', 'subscription_behavior'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, spending_type)
);

create table if not exists public.economic_intelligence_workforce (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workforce_type text not null check (workforce_type in (
    'labor_availability', 'salary_trends', 'hiring_competition', 'skill_demand'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, workforce_type)
);

create table if not exists public.economic_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'emerging_growth_areas', 'underserved_markets', 'expansion_opportunities', 'industry_opportunities'
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

create table if not exists public.economic_intelligence_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'economic_health', 'risk_level', 'market_confidence', 'business_impact', 'recommended_actions'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.economic_intelligence_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'inflation_impact', 'slow_hiring', 'cost_exposure'
  )),
  question text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  reasoning_label text not null default '',
  evidence_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  impact_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists economic_intelligence_companion_org_idx
  on public.economic_intelligence_companion (organization_id, status);

create table if not exists public.economic_intelligence_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_type text not null check (scenario_type in (
    'inflation_increase', 'rate_increase', 'economic_slowdown', 'rapid_growth'
  )),
  title text not null,
  potential_impact text not null default '' check (char_length(potential_impact) <= 500),
  preparation_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, scenario_type)
);

create table if not exists public.economic_intelligence_audit (
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

create index if not exists economic_intelligence_audit_org_idx
  on public.economic_intelligence_audit (organization_id, created_at desc);

alter table public.economic_intelligence_settings enable row level security;
alter table public.economic_intelligence_section_items enable row level security;
alter table public.economic_intelligence_monitoring enable row level security;
alter table public.economic_intelligence_regional enable row level security;
alter table public.economic_intelligence_business_impact enable row level security;
alter table public.economic_intelligence_consumer_spending enable row level security;
alter table public.economic_intelligence_workforce enable row level security;
alter table public.economic_intelligence_opportunities enable row level security;
alter table public.economic_intelligence_executive_metrics enable row level security;
alter table public.economic_intelligence_companion enable row level security;
alter table public.economic_intelligence_scenarios enable row level security;
alter table public.economic_intelligence_audit enable row level security;
revoke all on public.economic_intelligence_settings from authenticated, anon;
revoke all on public.economic_intelligence_section_items from authenticated, anon;
revoke all on public.economic_intelligence_monitoring from authenticated, anon;
revoke all on public.economic_intelligence_regional from authenticated, anon;
revoke all on public.economic_intelligence_business_impact from authenticated, anon;
revoke all on public.economic_intelligence_consumer_spending from authenticated, anon;
revoke all on public.economic_intelligence_workforce from authenticated, anon;
revoke all on public.economic_intelligence_opportunities from authenticated, anon;
revoke all on public.economic_intelligence_executive_metrics from authenticated, anon;
revoke all on public.economic_intelligence_companion from authenticated, anon;
revoke all on public.economic_intelligence_scenarios from authenticated, anon;
revoke all on public.economic_intelligence_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'economic_intelligence_center', v.description
from (values
  ('economic_intelligence.view', 'View Economic Intelligence Center', 'View economic monitoring, business impact, and macroeconomic intelligence'),
  ('economic_intelligence.manage', 'Manage Economic Intelligence Center', 'Manage economic intelligence items and settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'economic_intelligence.view'), ('owner', 'economic_intelligence.manage'),
  ('administrator', 'economic_intelligence.view'), ('administrator', 'economic_intelligence.manage'),
  ('manager', 'economic_intelligence.view'),
  ('employee', 'economic_intelligence.view'),
  ('support_agent', 'economic_intelligence.view'),
  ('moderator', 'economic_intelligence.view'),
  ('viewer', 'economic_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._eie452_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('economic_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('economic_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('economic_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._eie452_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.economic_intelligence_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._eie452_section_json(s public.economic_intelligence_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._eie452_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.economic_intelligence_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.economic_intelligence_monitoring where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.economic_intelligence_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'economic_overview', 'Economic overview', 'Macroeconomic conditions synthesized for Norway, Europe, and primary markets — inflation, rates, employment, and business climate.', 'Primary region', 'Norway / Europe', 'verified'),
    (p_org_id, 'inflation', 'Inflation', 'Consumer and producer inflation tracked with business impact assessment.', 'CPI trend', 'Moderate', 'requires_attention'),
    (p_org_id, 'interest_rates', 'Interest rates', 'Central bank rates and financing cost implications monitored.', 'Policy rate', 'Stable', 'information'),
    (p_org_id, 'employment', 'Employment', 'Labor market conditions, hiring competition, and salary trends analyzed.', 'Unemployment', 'Low', 'verified'),
    (p_org_id, 'consumer_trends', 'Consumer trends', 'Consumer confidence, spending patterns, and price sensitivity tracked.', 'Confidence', 'Moderate', 'requires_attention'),
    (p_org_id, 'business_climate', 'Business climate', 'Business confidence and economic growth signals for planning.', 'Climate', 'Cautiously positive', 'information'),
    (p_org_id, 'economic_risks', 'Economic risks', 'Rising costs, rate exposure, and slowdown signals identified.', 'Active risks', '3', 'requires_attention'),
    (p_org_id, 'economic_opportunities', 'Economic opportunities', 'Growth areas, expansion windows, and underserved markets identified.', 'Opportunities', '2', 'verified');

  insert into public.economic_intelligence_monitoring
    (organization_id, monitoring_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'inflation', 'Inflation monitoring', 'Headline inflation moderating but supplier cost inflation remains elevated in hospitality and commerce sectors.', 'Economic aggregate metadata', '2026-Q2', 'High', 'Vendor costs · pricing pressure', 'requires_attention'),
    (p_org_id, 'interest_rates', 'Interest rate monitoring', 'Policy rates stable — refinancing window favorable for next 6 months.', 'Central bank metadata', '2026-Q2', 'High', 'Financing costs', 'information'),
    (p_org_id, 'employment', 'Employment monitoring', 'Norwegian labor market tight — software engineering and hospitality roles competitive.', 'Labor market metadata', '2026-Q2', 'High', 'Hiring · salaries', 'requires_attention'),
    (p_org_id, 'consumer_confidence', 'Consumer confidence', 'Consumer confidence moderate — discretionary spending cautious in mid-market segment.', 'Consumer sentiment metadata', '2026-Q2', 'Moderate', 'Revenue · pricing', 'requires_attention'),
    (p_org_id, 'business_confidence', 'Business confidence', 'Business confidence cautiously positive — investment plans maintained with contingency buffers.', 'Business sentiment metadata', '2026-Q2', 'Moderate', 'Investments', 'information'),
    (p_org_id, 'economic_growth', 'Economic growth', 'Nordic GDP growth steady — hospitality and technology sectors outperforming average.', 'Growth metadata', '2026-Q2', 'High', 'Expansion planning', 'verified'),
    (p_org_id, 'economic_slowdowns', 'Economic slowdown signals', 'No acute slowdown signals — monitor consumer spending sensitivity.', 'Slowdown indicator metadata', '2026-Q2', 'Moderate', 'Demand planning', 'information');

  insert into public.economic_intelligence_regional
    (organization_id, scope_type, region_key, region_name, summary, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'global', 'global', 'Global', 'Global growth steady — technology and services sectors resilient; supply chain normalization continuing.', 'Global economic metadata', '2026-Q2', 'Moderate', 'information'),
    (p_org_id, 'country', 'norway', 'Norway', 'Norwegian economy stable — low unemployment, moderate inflation, strong sovereign fundamentals.', 'Norway economic metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'region', 'europe', 'Europe', 'European growth mixed — regulatory and energy cost factors vary by market.', 'Europe economic metadata', '2026-Q2', 'Moderate', 'information'),
    (p_org_id, 'region', 'north_america', 'North America', 'North American tech spending resilient — enterprise software demand strong.', 'North America metadata', '2026-Q2', 'Moderate', 'verified'),
    (p_org_id, 'region', 'asia_pacific', 'Asia-Pacific', 'Asia-Pacific expansion markets showing growth in hospitality and commerce digitization.', 'Asia-Pacific metadata', '2026-Q2', 'Moderate', 'waiting');

  insert into public.economic_intelligence_business_impact
    (organization_id, impact_area, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'revenue', 'Revenue impact', 'Moderate consumer caution may slow mid-market conversion — enterprise segment remains strong.', 'Business impact model', '2026-Q2', 'Moderate', 'Mid-market revenue', 'requires_attention'),
    (p_org_id, 'customers', 'Customer impact', 'Customers becoming more price-sensitive — value messaging and ROI proof increasingly important.', 'Customer behavior metadata', '2026-Q2', 'High', 'Pricing · retention', 'requires_attention'),
    (p_org_id, 'pricing', 'Pricing impact', 'Inflation increasing supplier costs — review pricing elasticity and vendor contracts.', 'Cost inflation metadata', '2026-Q2', 'High', 'Margin pressure', 'requires_attention'),
    (p_org_id, 'hiring', 'Hiring impact', 'Software engineering salaries increasing — hiring timeline may extend 15–20%.', 'Labor market metadata', '2026-Q2', 'High', 'Recruitment costs', 'requires_attention'),
    (p_org_id, 'investments', 'Investment impact', 'Stable rates support planned infrastructure investment — maintain contingency reserves.', 'Financing metadata', '2026-Q2', 'Moderate', 'CapEx planning', 'information'),
    (p_org_id, 'support_demand', 'Support demand impact', 'Economic stress may increase support volume as customers scrutinize value.', 'Support trend metadata', '2026-Q2', 'Moderate', 'Support capacity', 'waiting'),
    (p_org_id, 'vendor_costs', 'Vendor cost impact', 'Inflation increasing supplier costs across cloud, SaaS, and professional services.', 'Vendor cost metadata', '2026-Q2', 'High', 'Operating costs', 'requires_attention');

  insert into public.economic_intelligence_consumer_spending
    (organization_id, spending_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'consumer_demand', 'Consumer demand', 'Discretionary demand stable in enterprise — mid-market showing price sensitivity.', 'Spending metadata', '2026-Q2', 'Moderate', 'Sales pipeline', 'requires_attention'),
    (p_org_id, 'spending_trends', 'Spending trends', 'Customers shifting toward annual contracts with stronger ROI justification requirements.', 'Contract metadata', '2026-Q2', 'High', 'Sales cycle', 'information'),
    (p_org_id, 'purchase_behavior', 'Purchase behavior', 'Customers becoming more price-sensitive — extended evaluation cycles in mid-market.', 'Purchase behavior metadata', '2026-Q2', 'High', 'Conversion rates', 'requires_attention'),
    (p_org_id, 'subscription_behavior', 'Subscription behavior', 'Subscription renewals stable — downgrade requests up 8% in price-sensitive segment.', 'Renewal metadata', '2026-Q2', 'Moderate', 'Retention', 'requires_attention');

  insert into public.economic_intelligence_workforce
    (organization_id, workforce_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'labor_availability', 'Labor availability', 'Norwegian tech labor market tight — senior engineering roles competitive.', 'Labor metadata', '2026-Q2', 'High', 'Hiring timeline', 'requires_attention'),
    (p_org_id, 'salary_trends', 'Salary trends', 'Software engineering salaries increasing 8–12% year-over-year in Nordic markets.', 'Salary benchmark metadata', '2026-Q2', 'High', 'Compensation planning', 'requires_attention'),
    (p_org_id, 'hiring_competition', 'Hiring competition', 'Competition for product and engineering talent intensifying — employer brand critical.', 'Hiring market metadata', '2026-Q2', 'Moderate', 'Recruitment strategy', 'information'),
    (p_org_id, 'skill_demand', 'Skill demand', 'AI governance, enterprise security, and hospitality operations skills in high demand.', 'Skills demand metadata', '2026-Q2', 'High', 'Workforce planning', 'verified');

  insert into public.economic_intelligence_opportunities
    (organization_id, opportunity_type, title, summary, source_label, date_label, confidence_label, impact_label, status_key)
  values
    (p_org_id, 'emerging_growth_areas', 'Nordic hospitality digitization', 'Hospitality digitization accelerating in Nordic markets — expansion window favorable.', 'Market opportunity metadata', '2026-Q2', 'High', 'GTM expansion', 'verified'),
    (p_org_id, 'underserved_markets', 'Mid-market enterprise governance', 'Mid-market segment underserved for governance-grade ABOS capabilities.', 'Segment analysis metadata', '2026-Q2', 'Moderate', 'Product positioning', 'verified'),
    (p_org_id, 'expansion_opportunities', 'North America enterprise', 'North American enterprise software demand supports controlled expansion pilot.', 'Expansion metadata', '2026-Q2', 'Moderate', 'International growth', 'waiting'),
    (p_org_id, 'industry_opportunities', 'Experience automation demand', 'Economic pressure driving demand for operational automation over headcount growth.', 'Industry trend metadata', '2026-Q2', 'High', 'Product strategy', 'verified');

  insert into public.economic_intelligence_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'economic_health', 'Stable', 'Norway and Nordic markets healthy — monitor inflation and labor costs', 'verified'),
    (p_org_id, 'risk_level', 'Moderate', 'Inflation · vendor costs · price sensitivity · hiring competition', 'requires_attention'),
    (p_org_id, 'market_confidence', 'Cautiously positive', 'Business confidence maintained with contingency planning', 'information'),
    (p_org_id, 'business_impact', '3 areas', 'Pricing · hiring · vendor costs require leadership attention', 'requires_attention'),
    (p_org_id, 'recommended_actions', '4 items', 'Review vendor contracts · adjust hiring pace · strengthen ROI messaging · maintain reserves', 'waiting');

  insert into public.economic_intelligence_companion
    (organization_id, advisor_type, question, insight, reasoning_label, evidence_label, source_label, date_label, confidence_label, impact_label)
  values
    (p_org_id, 'inflation_impact', 'How might inflation affect us?', 'Inflation may increase vendor costs and compress margins — prioritize contract reviews and pricing elasticity analysis before Q3 renewals.', 'Supplier cost inflation elevated · mid-market price sensitivity rising · support for ROI justification increasing', 'Business impact engine · consumer spending · vendor cost monitoring', 'Economic Intelligence Engine', '2026-Q2', 'High', 'Margins · pricing'),
    (p_org_id, 'slow_hiring', 'Should we slow hiring?', 'Consider moderating non-critical hiring by 15–20% while maintaining engineering capacity for Hospitality Pack launch — labor market tightness increases cost and timeline risk.', 'Salary trends +8–12% · hiring competition intensifying · strategic roles still critical for launch', 'Workforce intelligence · business impact · scenario modeling', 'Workforce Intelligence', '2026-Q2', 'Moderate', 'Hiring · costs'),
    (p_org_id, 'cost_exposure', 'How exposed are we to rising costs?', 'Moderate exposure — vendor costs and engineering salaries are primary drivers; stable rates limit financing risk; review top 10 vendor contracts within 60 days.', 'Vendor inflation · salary pressure · stable policy rates · contingency reserves adequate', 'Monitoring engine · business impact · executive dashboard', 'Business Impact Engine', '2026-Q2', 'High', 'Operating costs');

  insert into public.economic_intelligence_scenarios
    (organization_id, scenario_type, title, potential_impact, preparation_label, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'inflation_increase', 'Inflation increase scenario', 'Further inflation could increase vendor costs 5–10% and reduce mid-market conversion — margin pressure on growth targets.', 'Review vendor contracts · adjust pricing tiers · strengthen value messaging · extend runway buffer', 'Scenario model metadata', '2026-Q2', 'Moderate', 'requires_attention'),
    (p_org_id, 'rate_increase', 'Rate increase scenario', 'Rising interest rates may increase financing costs for expansion and extend enterprise sales cycles.', 'Lock favorable terms where possible · prioritize cash-positive growth · defer discretionary CapEx', 'Scenario model metadata', '2026-Q2', 'Moderate', 'information'),
    (p_org_id, 'economic_slowdown', 'Economic slowdown scenario', 'Slowdown could increase support volume, extend sales cycles, and pressure renewals in price-sensitive segment.', 'Strengthen retention programs · prepare support capacity · focus on enterprise segment · reduce non-essential spend', 'Scenario model metadata', '2026-Q2', 'Moderate', 'requires_attention'),
    (p_org_id, 'rapid_growth', 'Rapid growth scenario', 'Strong growth could strain support capacity and hiring — opportunity to capture market share if operations scale.', 'Accelerate support hiring plan · prepare infrastructure scaling · prioritize Hospitality Pack launch', 'Scenario model metadata', '2026-Q2', 'Moderate', 'verified');

end; $$;

create or replace function public.get_economic_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_overview_s jsonb; v_inflation_s jsonb; v_rates_s jsonb; v_employment_s jsonb;
  v_consumer_s jsonb; v_climate_s jsonb; v_risks_s jsonb; v_opportunities_s jsonb;
  v_monitoring jsonb; v_regional jsonb; v_impact jsonb; v_spending jsonb;
  v_workforce jsonb; v_opportunities jsonb; v_exec jsonb; v_companion jsonb; v_scenarios jsonb;
begin
  perform public._irp_require_permission('economic_intelligence.view');
  v_ctx := public._eie452_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._eie452_seed(v_org_id);

  select jsonb_build_object(
    'intelligence_enabled', s.intelligence_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.economic_intelligence_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'economic_overview';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_inflation_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'inflation';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_rates_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'interest_rates';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_employment_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'employment';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_consumer_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'consumer_trends';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_climate_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'business_climate';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_risks_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'economic_risks';
  select coalesce(jsonb_agg(public._eie452_section_json(s)), '[]'::jsonb) into v_opportunities_s
  from public.economic_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'economic_opportunities';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'monitoring_type', m.monitoring_type, 'title', m.title, 'summary', m.summary,
    'source_label', m.source_label, 'date_label', m.date_label,
    'confidence_label', m.confidence_label, 'impact_label', m.impact_label,
    'status_key', m.status_key, 'item_type', 'monitoring'
  ) order by m.title), '[]'::jsonb)
  into v_monitoring from public.economic_intelligence_monitoring m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'scope_type', r.scope_type, 'region_key', r.region_key, 'region_name', r.region_name,
    'summary', r.summary, 'source_label', r.source_label, 'date_label', r.date_label,
    'confidence_label', r.confidence_label, 'status_key', r.status_key, 'item_type', 'regional'
  ) order by case r.region_key when 'global' then 1 when 'norway' then 2 when 'europe' then 3 when 'north_america' then 4 else 5 end), '[]'::jsonb)
  into v_regional from public.economic_intelligence_regional r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'impact_area', b.impact_area, 'title', b.title, 'summary', b.summary,
    'source_label', b.source_label, 'date_label', b.date_label,
    'confidence_label', b.confidence_label, 'impact_label', b.impact_label,
    'status_key', b.status_key, 'item_type', 'business_impact'
  ) order by b.title), '[]'::jsonb)
  into v_impact from public.economic_intelligence_business_impact b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'spending_type', c.spending_type, 'title', c.title, 'summary', c.summary,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'impact_label', c.impact_label,
    'status_key', c.status_key, 'item_type', 'consumer_spending'
  ) order by c.title), '[]'::jsonb)
  into v_spending from public.economic_intelligence_consumer_spending c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'workforce_type', w.workforce_type, 'title', w.title, 'summary', w.summary,
    'source_label', w.source_label, 'date_label', w.date_label,
    'confidence_label', w.confidence_label, 'impact_label', w.impact_label,
    'status_key', w.status_key, 'item_type', 'workforce'
  ) order by w.title), '[]'::jsonb)
  into v_workforce from public.economic_intelligence_workforce w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary,
    'source_label', o.source_label, 'date_label', o.date_label,
    'confidence_label', o.confidence_label, 'impact_label', o.impact_label,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.title), '[]'::jsonb)
  into v_opportunities from public.economic_intelligence_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'economic_health' then 1 when 'risk_level' then 2 when 'market_confidence' then 3
    when 'business_impact' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.economic_intelligence_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'question', c.question,
    'insight', c.insight, 'reasoning_label', c.reasoning_label, 'evidence_label', c.evidence_label,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'impact_label', c.impact_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.economic_intelligence_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'scenario_type', s.scenario_type, 'title', s.title,
    'potential_impact', s.potential_impact, 'preparation_label', s.preparation_label,
    'source_label', s.source_label, 'date_label', s.date_label,
    'confidence_label', s.confidence_label, 'status_key', s.status_key, 'item_type', 'scenario'
  ) order by case s.scenario_type
    when 'inflation_increase' then 1 when 'rate_increase' then 2 when 'economic_slowdown' then 3 else 4 end), '[]'::jsonb)
  into v_scenarios from public.economic_intelligence_scenarios s where s.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Even the best-run business is influenced by the economy around it. Aipify helps organizations understand how external economic conditions may affect operations, customers, growth, hiring, investment, and risk.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All economic intelligence includes source, date, confidence level, impact assessment, and audit trail. Human-controlled — no autonomous strategic authority.',
    'intelligence_settings', coalesce(v_settings, '{}'::jsonb),
    'economic_monitoring_engine', v_monitoring,
    'regional_economic_intelligence', v_regional,
    'business_impact_engine', v_impact,
    'consumer_spending_intelligence', v_spending,
    'hiring_workforce_intelligence', v_workforce,
    'economic_opportunity_engine', v_opportunities,
    'executive_economic_dashboard', v_exec,
    'companion_economic_advisor', v_companion,
    'scenario_modeling', v_scenarios,
    'sections', jsonb_build_object(
      'economic_overview', v_overview_s,
      'inflation', v_inflation_s,
      'interest_rates', v_rates_s,
      'employment', v_employment_s,
      'consumer_trends', v_consumer_s,
      'business_climate', v_climate_s,
      'economic_risks', v_risks_s,
      'economic_opportunities', v_opportunities_s
    ),
    'statistics', jsonb_build_object(
      'monitoring_count', jsonb_array_length(v_monitoring),
      'regional_count', jsonb_array_length(v_regional),
      'impact_count', jsonb_array_length(v_impact),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'companion_count', jsonb_array_length(v_companion),
      'scenario_count', jsonb_array_length(v_scenarios)
    ),
    'privacy_note', 'Economic intelligence metadata and aggregate signals only — no raw financial records or unapproved PII.'
  );
end; $$;

create or replace function public.manage_economic_intelligence_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._eie452_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.economic_intelligence_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'opportunity' and p_item_id is not null then
    update public.economic_intelligence_opportunities set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'business_impact' and p_item_id is not null then
    update public.economic_intelligence_business_impact set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._eie452_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Economic intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_economic_intelligence_center() to authenticated;
grant execute on function public.manage_economic_intelligence_item(text, uuid, text, jsonb) to authenticated;
