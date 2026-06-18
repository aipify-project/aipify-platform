-- Phase 454 — Global Expansion & Localization Intelligence Engine (Customer App)
-- Route: /app/intelligence/global-expansion

create table if not exists public.global_expansion_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  intelligence_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.global_expansion_intelligence_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'expansion_overview', 'country_intelligence', 'localization_intelligence', 'regulatory_intelligence',
    'market_entry_analysis', 'expansion_opportunities', 'expansion_roadmaps'
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

create index if not exists global_expansion_intelligence_sections_org_idx
  on public.global_expansion_intelligence_section_items (organization_id, section_key);

create table if not exists public.global_expansion_intelligence_countries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  country_key text not null,
  country_name text not null,
  profile_type text not null default 'country' check (profile_type in ('country', 'region', 'economic_area')),
  market_size_label text not null default '',
  language_label text not null default '',
  business_environment_label text not null default '',
  growth_potential_label text not null default '',
  competition_level_label text not null default '',
  risk_level_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, country_key)
);

create table if not exists public.global_expansion_intelligence_localization (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  localization_type text not null check (localization_type in (
    'language_requirements', 'customer_expectations', 'cultural_factors',
    'communication_preferences', 'payment_preferences'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, localization_type)
);

create table if not exists public.global_expansion_intelligence_market_entry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  market_key text not null,
  market_name text not null,
  demand_label text not null default '',
  competition_label text not null default '',
  regulations_label text not null default '',
  operational_complexity_label text not null default '',
  investment_label text not null default '',
  revenue_potential_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, market_key)
);

create table if not exists public.global_expansion_intelligence_readiness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  readiness_dimension text not null check (readiness_dimension in (
    'market_fit', 'operational_readiness', 'localization_readiness', 'support_readiness', 'compliance_readiness'
  )),
  dimension_name text not null,
  score_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, readiness_dimension)
);

create table if not exists public.global_expansion_intelligence_regulatory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  regulatory_type text not null check (regulatory_type in (
    'business_registration', 'privacy_requirements', 'consumer_protection', 'tax_requirements', 'industry_regulations'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, regulatory_type)
);

create table if not exists public.global_expansion_intelligence_operations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  operations_type text not null check (operations_type in (
    'support_coverage', 'staffing_needs', 'partner_requirements', 'infrastructure_needs', 'vendor_requirements'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, operations_type)
);

create table if not exists public.global_expansion_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.global_expansion_intelligence_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'top_expansion_markets', 'expansion_readiness', 'market_risks', 'expected_investment', 'expected_return'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.global_expansion_intelligence_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'which_country', 'market_risks', 'readiness_check'
  )),
  question text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  reasoning_label text not null default '',
  evidence_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  risk_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists global_expansion_intelligence_companion_org_idx
  on public.global_expansion_intelligence_companion (organization_id, status);

create table if not exists public.global_expansion_intelligence_simulations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  market_key text not null,
  market_name text not null,
  best_case_label text not null default '',
  expected_case_label text not null default '',
  worst_case_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, market_key)
);

create table if not exists public.global_expansion_intelligence_audit (
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

create index if not exists global_expansion_intelligence_audit_org_idx
  on public.global_expansion_intelligence_audit (organization_id, created_at desc);

alter table public.global_expansion_intelligence_settings enable row level security;
alter table public.global_expansion_intelligence_section_items enable row level security;
alter table public.global_expansion_intelligence_countries enable row level security;
alter table public.global_expansion_intelligence_localization enable row level security;
alter table public.global_expansion_intelligence_market_entry enable row level security;
alter table public.global_expansion_intelligence_readiness enable row level security;
alter table public.global_expansion_intelligence_regulatory enable row level security;
alter table public.global_expansion_intelligence_operations enable row level security;
alter table public.global_expansion_intelligence_opportunities enable row level security;
alter table public.global_expansion_intelligence_executive_metrics enable row level security;
alter table public.global_expansion_intelligence_companion enable row level security;
alter table public.global_expansion_intelligence_simulations enable row level security;
alter table public.global_expansion_intelligence_audit enable row level security;
revoke all on public.global_expansion_intelligence_settings from authenticated, anon;
revoke all on public.global_expansion_intelligence_section_items from authenticated, anon;
revoke all on public.global_expansion_intelligence_countries from authenticated, anon;
revoke all on public.global_expansion_intelligence_localization from authenticated, anon;
revoke all on public.global_expansion_intelligence_market_entry from authenticated, anon;
revoke all on public.global_expansion_intelligence_readiness from authenticated, anon;
revoke all on public.global_expansion_intelligence_regulatory from authenticated, anon;
revoke all on public.global_expansion_intelligence_operations from authenticated, anon;
revoke all on public.global_expansion_intelligence_opportunities from authenticated, anon;
revoke all on public.global_expansion_intelligence_executive_metrics from authenticated, anon;
revoke all on public.global_expansion_intelligence_companion from authenticated, anon;
revoke all on public.global_expansion_intelligence_simulations from authenticated, anon;
revoke all on public.global_expansion_intelligence_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_expansion_intelligence_center', v.description
from (values
  ('global_expansion_intelligence.view', 'View Global Expansion Intelligence Center', 'View country profiles, localization, market entry, and expansion readiness'),
  ('global_expansion_intelligence.manage', 'Manage Global Expansion Intelligence Center', 'Manage expansion intelligence items and settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'global_expansion_intelligence.view'), ('owner', 'global_expansion_intelligence.manage'),
  ('administrator', 'global_expansion_intelligence.view'), ('administrator', 'global_expansion_intelligence.manage'),
  ('manager', 'global_expansion_intelligence.view'),
  ('employee', 'global_expansion_intelligence.view'),
  ('support_agent', 'global_expansion_intelligence.view'),
  ('moderator', 'global_expansion_intelligence.view'),
  ('viewer', 'global_expansion_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._geie454_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('global_expansion_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('global_expansion_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('global_expansion_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._geie454_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.global_expansion_intelligence_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._geie454_section_json(s public.global_expansion_intelligence_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._geie454_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.global_expansion_intelligence_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.global_expansion_intelligence_countries where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.global_expansion_intelligence_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'expansion_overview', 'Expansion overview', 'International expansion intelligence synthesized — Nordic-first with EU and North America pipeline.', 'Primary focus', 'Nordic / EU', 'verified'),
    (p_org_id, 'country_intelligence', 'Country intelligence', 'Country, region, and economic area profiles with market size, language, and risk assessment.', 'Profiles', '6', 'verified'),
    (p_org_id, 'localization_intelligence', 'Localization intelligence', 'Language, culture, communication, and payment preferences for target markets.', 'Alerts', '3', 'requires_attention'),
    (p_org_id, 'regulatory_intelligence', 'Regulatory intelligence', 'Business registration, privacy, consumer protection, tax, and industry regulations monitored.', 'Requirements', '4', 'requires_attention'),
    (p_org_id, 'market_entry_analysis', 'Market entry analysis', 'Demand, competition, regulations, operational complexity, and revenue potential evaluated.', 'Markets', '4', 'information'),
    (p_org_id, 'expansion_opportunities', 'Expansion opportunities', 'Prioritized expansion windows with evidence-based scoring.', 'Opportunities', '3', 'verified'),
    (p_org_id, 'expansion_roadmaps', 'Expansion roadmaps', 'Phased entry plans for top target markets with readiness milestones.', 'Roadmaps', '2', 'waiting');

  insert into public.global_expansion_intelligence_countries
    (organization_id, country_key, country_name, profile_type, market_size_label, language_label, business_environment_label, growth_potential_label, competition_level_label, risk_level_label, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'norway', 'Norway', 'country', 'Home market', 'Norwegian (nb)', 'Excellent — stable, digital-first', 'Moderate', 'Low', 'Low', 'Country profile metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'sweden', 'Sweden', 'country', 'Large Nordic market', 'Swedish (sv)', 'Strong — enterprise adoption high', 'High', 'Moderate', 'Low', 'Country profile metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'denmark', 'Denmark', 'country', 'Mid-size Nordic market', 'Danish (da)', 'Strong — digital governance focus', 'Moderate', 'Moderate', 'Low', 'Country profile metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'germany', 'Germany', 'country', 'Large EU market', 'German (de)', 'Complex — strong regulation', 'High', 'High', 'Moderate', 'Country profile metadata', '2026-Q2', 'Moderate', 'requires_attention'),
    (p_org_id, 'nordic', 'Nordic Region', 'region', 'Combined Nordic TAM', 'nb · sv · da · en', 'Favorable — localization ready', 'High', 'Moderate', 'Low', 'Regional profile metadata', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'eea', 'European Economic Area', 'economic_area', 'EU+EEA expansion zone', 'Multi-language', 'Regulatory complexity varies', 'High', 'High', 'Moderate', 'Economic area metadata', '2026-Q2', 'Moderate', 'information');

  insert into public.global_expansion_intelligence_localization
    (organization_id, localization_type, title, summary, source_label, date_label, confidence_label, risk_label, status_key)
  values
    (p_org_id, 'language_requirements', 'Language requirements', 'Norwegian, Swedish, Danish, and English locales complete — German localization required for DACH entry.', 'Localization metadata', '2026-Q2', 'High', 'DACH entry blocked without de', 'requires_attention'),
    (p_org_id, 'customer_expectations', 'Customer expectations', 'Nordic customers expect local language support and GDPR-grade privacy transparency.', 'Customer research metadata', '2026-Q2', 'High', 'Support readiness', 'verified'),
    (p_org_id, 'cultural_factors', 'Cultural factors', 'Nordic markets value trust, transparency, and calm professional communication — align with Aipify brand.', 'Cultural analysis metadata', '2026-Q2', 'Moderate', 'Brand alignment strong', 'verified'),
    (p_org_id, 'communication_preferences', 'Communication preferences', 'Email and in-app preferred over phone — async support acceptable in Nordic markets.', 'Communication metadata', '2026-Q2', 'Moderate', 'Support model fit', 'information'),
    (p_org_id, 'payment_preferences', 'Payment preferences', 'Local payment methods expected in target markets — invoice and card required; Vipps relevant for Norway.', 'Payment metadata', '2026-Q2', 'High', 'Billing integration', 'requires_attention');

  insert into public.global_expansion_intelligence_market_entry
    (organization_id, market_key, market_name, demand_label, competition_label, regulations_label, operational_complexity_label, investment_label, revenue_potential_label, source_label, date_label, confidence_label, risk_label, status_key)
  values
    (p_org_id, 'sweden', 'Sweden', 'High — hospitality digitization demand', 'Moderate — few vertical competitors', 'GDPR compliant — standard EU', 'Low — localization ready', 'Low — partner-led GTM', 'High — Nordic hospitality TAM', 'Market entry model', '2026-Q2', 'High', 'Low', 'verified'),
    (p_org_id, 'denmark', 'Denmark', 'Moderate — enterprise governance focus', 'Moderate', 'GDPR compliant', 'Low', 'Low', 'Moderate', 'Market entry model', '2026-Q2', 'Moderate', 'Low', 'information'),
    (p_org_id, 'germany', 'Germany', 'High — enterprise ABOS demand', 'High — established competitors', 'Complex — additional compliance', 'High — German localization required', 'Moderate — legal and support', 'High — large TAM', 'Market entry model', '2026-Q2', 'Moderate', 'Moderate', 'requires_attention'),
    (p_org_id, 'north_america', 'North America', 'High — enterprise software', 'High', 'SOC2 and state privacy laws', 'High — timezone and support', 'High', 'High — pilot only', 'Market entry model', '2026-Q2', 'Moderate', 'High', 'waiting');

  insert into public.global_expansion_intelligence_readiness
    (organization_id, readiness_dimension, dimension_name, score_label, status_key)
  values
    (p_org_id, 'market_fit', 'Market fit', '88/100', 'verified'),
    (p_org_id, 'operational_readiness', 'Operational readiness', '72/100', 'requires_attention'),
    (p_org_id, 'localization_readiness', 'Localization readiness', '85/100', 'verified'),
    (p_org_id, 'support_readiness', 'Support readiness', '68/100', 'requires_attention'),
    (p_org_id, 'compliance_readiness', 'Compliance readiness', '78/100', 'information');

  insert into public.global_expansion_intelligence_regulatory
    (organization_id, regulatory_type, title, summary, source_label, date_label, confidence_label, risk_label, status_key)
  values
    (p_org_id, 'business_registration', 'Business registration', 'EU entity or local representative may be required for DACH market entry — review before launch.', 'Regulatory monitor', '2026-Q2', 'Moderate', 'DACH launch blocker', 'requires_attention'),
    (p_org_id, 'privacy_requirements', 'Privacy requirements', 'GDPR compliance verified — additional German data residency expectations for enterprise customers.', 'Regulatory monitor', '2026-Q2', 'High', 'Enterprise sales', 'requires_attention'),
    (p_org_id, 'consumer_protection', 'Consumer protection', 'Nordic consumer protection standards met — review refund and SLA policies for EU expansion.', 'Regulatory monitor', '2026-Q2', 'Moderate', 'Policy review', 'information'),
    (p_org_id, 'tax_requirements', 'Tax requirements', 'VAT registration required for EU B2B sales above threshold — finance review recommended.', 'Regulatory monitor', '2026-Q2', 'High', 'Billing setup', 'requires_attention'),
    (p_org_id, 'industry_regulations', 'Industry regulations', 'Hospitality data retention rules vary by EU market — additional compliance required before launch in Germany.', 'Regulatory monitor', '2026-Q2', 'Moderate', 'Hosts pack DACH', 'requires_attention');

  insert into public.global_expansion_intelligence_operations
    (organization_id, operations_type, title, summary, source_label, date_label, confidence_label, risk_label, status_key)
  values
    (p_org_id, 'support_coverage', 'Support coverage', 'Nordic timezone coverage adequate — German and US timezone support gaps for DACH and NA expansion.', 'Operations metadata', '2026-Q2', 'High', 'Support scaling', 'requires_attention'),
    (p_org_id, 'staffing_needs', 'Staffing needs', 'Partner-led GTM reduces direct hiring for Nordic — DACH requires German-speaking support capacity.', 'Staffing model', '2026-Q2', 'Moderate', 'Hiring plan', 'waiting'),
    (p_org_id, 'partner_requirements', 'Partner requirements', 'Growth Partner network strong in Nordic — DACH partner pipeline in early stage.', 'Partner metadata', '2026-Q2', 'Moderate', 'Partner development', 'information'),
    (p_org_id, 'infrastructure_needs', 'Infrastructure needs', 'EU data residency available — verify German enterprise customer requirements.', 'Infrastructure metadata', '2026-Q2', 'High', 'Infrastructure review', 'information'),
    (p_org_id, 'vendor_requirements', 'Vendor requirements', 'Local payment processors and invoicing vendors needed for DACH billing.', 'Vendor metadata', '2026-Q2', 'Moderate', 'Billing vendors', 'requires_attention');

  insert into public.global_expansion_intelligence_opportunities
    (organization_id, opportunity_title, summary, source_label, date_label, confidence_label, risk_label, status_key)
  values
    (p_org_id, 'Sweden hospitality expansion', 'Sweden shows highest Nordic expansion readiness — localization complete, demand strong, partner network active.', 'Expansion opportunity model', '2026-Q2', 'High', 'Low', 'verified'),
    (p_org_id, 'Denmark enterprise governance', 'Denmark enterprise governance segment underserved — moderate investment, strong fit with ABOS positioning.', 'Expansion opportunity model', '2026-Q2', 'Moderate', 'Low', 'information'),
    (p_org_id, 'DACH phased entry', 'Germany phased entry after Swedish validation — high TAM but regulatory and localization investment required.', 'Expansion opportunity model', '2026-Q2', 'Moderate', 'Moderate', 'waiting');

  insert into public.global_expansion_intelligence_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'top_expansion_markets', 'Sweden · Denmark · Germany', 'Nordic first, DACH second, NA pilot', 'verified'),
    (p_org_id, 'expansion_readiness', '78/100', 'Localization strong · support and ops need attention', 'requires_attention'),
    (p_org_id, 'market_risks', '3 active', 'DACH compliance · payment methods · support coverage', 'requires_attention'),
    (p_org_id, 'expected_investment', 'Moderate', 'DACH highest — Nordic partner-led model lower capital intensity', 'information'),
    (p_org_id, 'expected_return', 'High', 'Nordic hospitality vertical — opportunity score 87/100', 'verified');

  insert into public.global_expansion_intelligence_companion
    (organization_id, advisor_type, question, insight, reasoning_label, evidence_label, source_label, date_label, confidence_label, risk_label)
  values
    (p_org_id, 'which_country', 'Which country should we expand into next?', 'Sweden is the strongest next market — localization ready (sv), high hospitality demand, partner network active, expansion readiness 88/100 for market fit, and lowest operational complexity among EU targets.', 'Market entry scores · country profiles · readiness dimensions · revenue opportunity alignment', 'Country intelligence · market entry · readiness · market intelligence', 'Global Expansion Intelligence Engine', '2026-Q2', 'High', 'Low'),
    (p_org_id, 'market_risks', 'What risks exist in Germany?', 'Germany carries moderate risk: German localization not yet complete, additional GDPR/data residency expectations, VAT registration required, established competition, and German-speaking support capacity needed before launch.', 'Regulatory intelligence · localization gaps · operations · competitive landscape', 'Regulatory · localization · market entry analysis', 'Country Intelligence Engine', '2026-Q2', 'High', 'Moderate'),
    (p_org_id, 'readiness_check', 'Are we ready for Sweden?', 'Largely ready — Swedish localization complete, Nordic support coverage adequate, GDPR compliant, partner pipeline active. Gaps: confirm local payment methods and finalize hospitality pack Swedish marketing assets.', 'Readiness score 85/100 localization · 88/100 market fit · support 68/100', 'Readiness engine · localization · operations intelligence', 'Expansion Readiness Score', '2026-Q2', 'High', 'Low');

  insert into public.global_expansion_intelligence_simulations
    (organization_id, market_key, market_name, best_case_label, expected_case_label, worst_case_label, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'sweden', 'Sweden', 'Best case: 15 enterprise customers in 12 months via partner-led GTM, Hospitality Pack ARR exceeds target by 20%.', 'Expected: 8–10 customers, steady ARR growth, support capacity sufficient with current team.', 'Worst case: Slower enterprise sales cycle extends timeline 6 months — partner dependency risk.', 'Expansion simulation model', '2026-Q2', 'Moderate', 'verified'),
    (p_org_id, 'germany', 'Germany', 'Best case: DACH enterprise pilot wins 3 anchor customers, German localization accelerates EU credibility.', 'Expected: 18-month phased entry, moderate investment, regulatory compliance on schedule.', 'Worst case: Compliance delays and localization gaps push launch 12+ months, competitive pressure increases.', 'Expansion simulation model', '2026-Q2', 'Moderate', 'requires_attention');

end; $$;

create or replace function public.get_global_expansion_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb; v_expansion_score text;
  v_overview_s jsonb; v_country_s jsonb; v_local_s jsonb; v_regulatory_s jsonb;
  v_entry_s jsonb; v_opp_s jsonb; v_roadmap_s jsonb;
  v_countries jsonb; v_localization jsonb; v_market_entry jsonb; v_readiness jsonb;
  v_regulatory jsonb; v_operations jsonb; v_opportunities jsonb; v_exec jsonb;
  v_companion jsonb; v_simulations jsonb;
begin
  perform public._irp_require_permission('global_expansion_intelligence.view');
  v_ctx := public._geie454_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._geie454_seed(v_org_id);

  select jsonb_build_object(
    'intelligence_enabled', s.intelligence_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.global_expansion_intelligence_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'expansion_overview';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_country_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'country_intelligence';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_local_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'localization_intelligence';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_regulatory_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'regulatory_intelligence';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_entry_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'market_entry_analysis';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_opp_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'expansion_opportunities';
  select coalesce(jsonb_agg(public._geie454_section_json(s)), '[]'::jsonb) into v_roadmap_s
  from public.global_expansion_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'expansion_roadmaps';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'country_key', c.country_key, 'country_name', c.country_name, 'profile_type', c.profile_type,
    'market_size_label', c.market_size_label, 'language_label', c.language_label,
    'business_environment_label', c.business_environment_label, 'growth_potential_label', c.growth_potential_label,
    'competition_level_label', c.competition_level_label, 'risk_level_label', c.risk_level_label,
    'source_label', c.source_label, 'date_label', c.date_label, 'confidence_label', c.confidence_label,
    'status_key', c.status_key, 'item_type', 'country'
  ) order by c.country_name), '[]'::jsonb)
  into v_countries from public.global_expansion_intelligence_countries c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'localization_type', l.localization_type, 'title', l.title, 'summary', l.summary,
    'source_label', l.source_label, 'date_label', l.date_label,
    'confidence_label', l.confidence_label, 'risk_label', l.risk_label,
    'status_key', l.status_key, 'item_type', 'localization'
  ) order by l.title), '[]'::jsonb)
  into v_localization from public.global_expansion_intelligence_localization l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'market_key', m.market_key, 'market_name', m.market_name,
    'demand_label', m.demand_label, 'competition_label', m.competition_label,
    'regulations_label', m.regulations_label, 'operational_complexity_label', m.operational_complexity_label,
    'investment_label', m.investment_label, 'revenue_potential_label', m.revenue_potential_label,
    'source_label', m.source_label, 'date_label', m.date_label,
    'confidence_label', m.confidence_label, 'risk_label', m.risk_label,
    'status_key', m.status_key, 'item_type', 'market_entry'
  ) order by m.market_name), '[]'::jsonb)
  into v_market_entry from public.global_expansion_intelligence_market_entry m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'readiness_dimension', r.readiness_dimension, 'dimension_name', r.dimension_name,
    'score_label', r.score_label, 'status_key', r.status_key, 'item_type', 'readiness'
  ) order by case r.readiness_dimension
    when 'market_fit' then 1 when 'operational_readiness' then 2 when 'localization_readiness' then 3
    when 'support_readiness' then 4 else 5 end), '[]'::jsonb)
  into v_readiness from public.global_expansion_intelligence_readiness r where r.organization_id = v_org_id;

  select coalesce((
    select round(avg(
      nullif(regexp_replace(r.score_label, '[^0-9]', '', 'g'), '')::numeric
    ))::text || '/100'
    from public.global_expansion_intelligence_readiness r
    where r.organization_id = v_org_id
      and r.score_label ~ '[0-9]'
  ), '—') into v_expansion_score;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'regulatory_type', r.regulatory_type, 'title', r.title, 'summary', r.summary,
    'source_label', r.source_label, 'date_label', r.date_label,
    'confidence_label', r.confidence_label, 'risk_label', r.risk_label,
    'status_key', r.status_key, 'item_type', 'regulatory'
  ) order by r.title), '[]'::jsonb)
  into v_regulatory from public.global_expansion_intelligence_regulatory r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'operations_type', o.operations_type, 'title', o.title, 'summary', o.summary,
    'source_label', o.source_label, 'date_label', o.date_label,
    'confidence_label', o.confidence_label, 'risk_label', o.risk_label,
    'status_key', o.status_key, 'item_type', 'operations'
  ) order by o.title), '[]'::jsonb)
  into v_operations from public.global_expansion_intelligence_operations o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_title', o.opportunity_title, 'summary', o.summary,
    'source_label', o.source_label, 'date_label', o.date_label,
    'confidence_label', o.confidence_label, 'risk_label', o.risk_label,
    'status_key', o.status_key, 'item_type', 'expansion_opportunity'
  ) order by o.opportunity_title), '[]'::jsonb)
  into v_opportunities from public.global_expansion_intelligence_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'top_expansion_markets' then 1 when 'expansion_readiness' then 2 when 'market_risks' then 3
    when 'expected_investment' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.global_expansion_intelligence_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'question', c.question,
    'insight', c.insight, 'reasoning_label', c.reasoning_label, 'evidence_label', c.evidence_label,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'risk_label', c.risk_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.global_expansion_intelligence_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'market_key', s.market_key, 'market_name', s.market_name,
    'best_case_label', s.best_case_label, 'expected_case_label', s.expected_case_label,
    'worst_case_label', s.worst_case_label, 'source_label', s.source_label,
    'date_label', s.date_label, 'confidence_label', s.confidence_label,
    'status_key', s.status_key, 'item_type', 'simulation'
  ) order by s.market_name), '[]'::jsonb)
  into v_simulations from public.global_expansion_intelligence_simulations s where s.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Expanding internationally is not simply translating a website. Successful expansion requires understanding markets, regulations, culture, competition, operations, and customer behavior.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All expansion intelligence includes source, date, confidence level, risk assessment, and audit history. Human-controlled — no autonomous strategic authority.',
    'intelligence_settings', coalesce(v_settings, '{}'::jsonb),
    'expansion_readiness_score', coalesce(v_expansion_score, '—'),
    'country_intelligence_engine', v_countries,
    'localization_intelligence', v_localization,
    'market_entry_analysis', v_market_entry,
    'expansion_readiness_engine', v_readiness,
    'regulatory_intelligence', v_regulatory,
    'international_operations_intelligence', v_operations,
    'expansion_opportunities', v_opportunities,
    'executive_expansion_dashboard', v_exec,
    'companion_expansion_advisor', v_companion,
    'expansion_simulation_engine', v_simulations,
    'sections', jsonb_build_object(
      'expansion_overview', v_overview_s,
      'country_intelligence', v_country_s,
      'localization_intelligence', v_local_s,
      'regulatory_intelligence', v_regulatory_s,
      'market_entry_analysis', v_entry_s,
      'expansion_opportunities', v_opp_s,
      'expansion_roadmaps', v_roadmap_s
    ),
    'statistics', jsonb_build_object(
      'country_count', jsonb_array_length(v_countries),
      'localization_count', jsonb_array_length(v_localization),
      'market_entry_count', jsonb_array_length(v_market_entry),
      'regulatory_count', jsonb_array_length(v_regulatory),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Expansion intelligence metadata and aggregate signals only — no raw customer records or unapproved PII.'
  );
end; $$;

create or replace function public.manage_global_expansion_intelligence_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._geie454_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.global_expansion_intelligence_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'expansion_opportunity' and p_item_id is not null then
    update public.global_expansion_intelligence_opportunities set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'regulatory' and p_item_id is not null then
    update public.global_expansion_intelligence_regulatory set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._geie454_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Global expansion intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_global_expansion_intelligence_center() to authenticated;
grant execute on function public.manage_global_expansion_intelligence_item(text, uuid, text, jsonb) to authenticated;
