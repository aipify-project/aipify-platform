-- Phase 451 — Industry Intelligence Engine (Customer App)
-- Route: /app/intelligence/industry

create table if not exists public.industry_intelligence_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  intelligence_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.industry_intelligence_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'industry_overview', 'market_trends', 'regulatory_changes', 'competitive_intelligence',
    'emerging_opportunities', 'industry_risks', 'industry_benchmarks'
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

create index if not exists industry_intelligence_sections_org_idx
  on public.industry_intelligence_section_items (organization_id, section_key);

create table if not exists public.industry_intelligence_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  industry_key text not null check (industry_key in (
    'hospitality', 'commerce', 'healthcare', 'construction', 'legal',
    'property_management', 'finance', 'technology', 'manufacturing', 'future_industries'
  )),
  industry_name text not null,
  signal_label text not null default '',
  benchmark_label text not null default '',
  trend_label text not null default '',
  risk_label text not null default '',
  opportunity_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, industry_key)
);

create table if not exists public.industry_intelligence_market_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  monitoring_type text not null check (monitoring_type in (
    'market_growth', 'market_decline', 'consumer_behavior', 'technology_adoption', 'industry_changes'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  relevance_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, monitoring_type)
);

create table if not exists public.industry_intelligence_competitive (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  competitive_type text not null check (competitive_type in (
    'competitors', 'products', 'pricing_trends', 'market_positioning', 'feature_trends'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  relevance_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, competitive_type)
);

create table if not exists public.industry_intelligence_regulatory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  regulatory_type text not null check (regulatory_type in (
    'compliance_changes', 'industry_regulations', 'regional_requirements', 'data_rules'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  relevance_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now(),
  unique (organization_id, regulatory_type)
);

create table if not exists public.industry_intelligence_benchmarks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  benchmark_type text not null check (benchmark_type in (
    'industry_average', 'industry_leaders', 'regional_peers', 'company_size_peers'
  )),
  title text not null,
  comparison_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, benchmark_type)
);

create table if not exists public.industry_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'emerging_markets', 'industry_shifts', 'new_services', 'partnership_opportunities', 'technology_opportunities'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  relevance_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now()
);

create table if not exists public.industry_intelligence_executive_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'industry_health', 'market_direction', 'competitive_pressure', 'regulatory_changes', 'strategic_opportunities'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.industry_intelligence_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  advisor_type text not null check (advisor_type in (
    'industry_changing', 'competitors_doing', 'opportunities_investigate'
  )),
  question text not null,
  insight text not null default '' check (char_length(insight) <= 500),
  evidence_label text not null default '',
  source_label text not null default '',
  date_label text not null default '',
  confidence_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists industry_intelligence_companion_org_idx
  on public.industry_intelligence_companion (organization_id, status);

create table if not exists public.industry_intelligence_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null check (pack_key in (
    'hosts', 'commerce', 'support', 'finance', 'sales', 'future_packs'
  )),
  pack_name text not null,
  enrichment_label text not null default '',
  status_key text not null default 'verified',
  updated_at timestamptz not null default now(),
  unique (organization_id, pack_key)
);

create table if not exists public.industry_intelligence_audit (
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

create index if not exists industry_intelligence_audit_org_idx
  on public.industry_intelligence_audit (organization_id, created_at desc);

alter table public.industry_intelligence_settings enable row level security;
alter table public.industry_intelligence_section_items enable row level security;
alter table public.industry_intelligence_profiles enable row level security;
alter table public.industry_intelligence_market_monitoring enable row level security;
alter table public.industry_intelligence_competitive enable row level security;
alter table public.industry_intelligence_regulatory enable row level security;
alter table public.industry_intelligence_benchmarks enable row level security;
alter table public.industry_intelligence_opportunities enable row level security;
alter table public.industry_intelligence_executive_metrics enable row level security;
alter table public.industry_intelligence_companion enable row level security;
alter table public.industry_intelligence_business_packs enable row level security;
alter table public.industry_intelligence_audit enable row level security;
revoke all on public.industry_intelligence_settings from authenticated, anon;
revoke all on public.industry_intelligence_section_items from authenticated, anon;
revoke all on public.industry_intelligence_profiles from authenticated, anon;
revoke all on public.industry_intelligence_market_monitoring from authenticated, anon;
revoke all on public.industry_intelligence_competitive from authenticated, anon;
revoke all on public.industry_intelligence_regulatory from authenticated, anon;
revoke all on public.industry_intelligence_benchmarks from authenticated, anon;
revoke all on public.industry_intelligence_opportunities from authenticated, anon;
revoke all on public.industry_intelligence_executive_metrics from authenticated, anon;
revoke all on public.industry_intelligence_companion from authenticated, anon;
revoke all on public.industry_intelligence_business_packs from authenticated, anon;
revoke all on public.industry_intelligence_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'industry_intelligence_center', v.description
from (values
  ('industry_intelligence.view', 'View Industry Intelligence Center', 'View industry profiles, market monitoring, competitive and regulatory intelligence'),
  ('industry_intelligence.manage', 'Manage Industry Intelligence Center', 'Manage industry intelligence items and settings')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'industry_intelligence.view'), ('owner', 'industry_intelligence.manage'),
  ('administrator', 'industry_intelligence.view'), ('administrator', 'industry_intelligence.manage'),
  ('manager', 'industry_intelligence.view'),
  ('employee', 'industry_intelligence.view'),
  ('support_agent', 'industry_intelligence.view'),
  ('moderator', 'industry_intelligence.view'),
  ('viewer', 'industry_intelligence.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._iie451_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('industry_intelligence.manage', v_org_id),
    'can_manage', public._irp_has_permission('industry_intelligence.manage', v_org_id),
    'can_view', public._irp_has_permission('industry_intelligence.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._iie451_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.industry_intelligence_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._iie451_section_json(s public.industry_intelligence_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._iie451_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.industry_intelligence_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.industry_intelligence_profiles where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.industry_intelligence_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'industry_overview', 'Industry overview', 'Hospitality sector profile active — market signals, benchmarks, and competitive context synthesized.', 'Primary sector', 'Hospitality', 'verified'),
    (p_org_id, 'market_trends', 'Market trends', 'Industry-wide growth, consumer behavior, and technology adoption tracked continuously.', 'Active trends', '5', 'information'),
    (p_org_id, 'regulatory_changes', 'Regulatory changes', 'Compliance changes, regional requirements, and data rules monitored with evidence.', 'Alerts', '2', 'requires_attention'),
    (p_org_id, 'competitive_intelligence', 'Competitive intelligence', 'Competitors, pricing, positioning, and feature trends analyzed.', 'Signals', '4', 'requires_attention'),
    (p_org_id, 'emerging_opportunities', 'Emerging opportunities', 'Markets, shifts, partnerships, and technology opportunities identified.', 'Opportunities', '3', 'verified'),
    (p_org_id, 'industry_risks', 'Industry risks', 'Sector risks, market decline signals, and competitive pressure tracked.', 'Risks', '2', 'requires_attention'),
    (p_org_id, 'industry_benchmarks', 'Industry benchmarks', 'Comparison against industry average, leaders, regional peers, and size peers.', 'Benchmarks', '4', 'information');

  insert into public.industry_intelligence_profiles
    (organization_id, industry_key, industry_name, signal_label, benchmark_label, trend_label, risk_label, opportunity_label, status_key)
  values
    (p_org_id, 'hospitality', 'Hospitality', 'Bookings +12% industry-wide', 'Guest satisfaction 4.2/5 avg', 'Self-service check-in adoption rising', 'Labor shortage in peak season', 'Experience automation demand', 'verified'),
    (p_org_id, 'commerce', 'Commerce', 'E-commerce returns increasing', 'Cart abandonment 68% avg', 'Mobile-first purchasing dominant', 'Returns cost pressure', 'Unified commerce platforms', 'requires_attention'),
    (p_org_id, 'healthcare', 'Healthcare', 'Digital patient intake growing', 'Wait time benchmarks tightening', 'Telehealth normalization', 'Compliance complexity rising', 'Operational AI assistance', 'information'),
    (p_org_id, 'construction', 'Construction', 'Project delays industry-wide', 'Safety incident rates declining', 'Modular construction adoption', 'Supply chain volatility', 'Digital project tracking', 'information'),
    (p_org_id, 'legal', 'Legal', 'Client self-service portals expanding', 'Billable hour efficiency benchmarks', 'AI-assisted document review', 'Regulatory disclosure burden', 'Practice automation', 'information'),
    (p_org_id, 'property_management', 'Property Management', 'Tenant portal adoption +18%', 'Maintenance response 24h avg', 'Smart building integration', 'Regulatory energy reporting', 'Predictive maintenance', 'verified'),
    (p_org_id, 'finance', 'Finance', 'Digital onboarding expectations rising', 'KYC processing time benchmarks', 'Open banking adoption', 'Fraud detection requirements', 'Embedded finance', 'requires_attention'),
    (p_org_id, 'technology', 'Technology', 'Enterprise AI governance demand', 'Time-to-value benchmarks', 'Platform consolidation trend', 'Talent competition', 'Vertical SaaS expansion', 'verified'),
    (p_org_id, 'manufacturing', 'Manufacturing', 'Supply chain digitization', 'OEE benchmarks improving', 'Predictive maintenance adoption', 'Raw material volatility', 'Industry 4.0 integration', 'information'),
    (p_org_id, 'future_industries', 'Future Industries', 'Emerging sector signals tracked', 'Early adopter benchmarks', 'Cross-industry convergence', 'Regulatory uncertainty', 'First-mover positioning', 'waiting');

  insert into public.industry_intelligence_market_monitoring
    (organization_id, monitoring_type, title, summary, source_label, date_label, confidence_label, relevance_label, status_key)
  values
    (p_org_id, 'market_growth', 'Hospitality bookings growing', 'Hospitality bookings growing 12% industry-wide in Nordic markets.', 'Industry aggregate metadata', '2026-Q2', 'High', 'Primary sector', 'information'),
    (p_org_id, 'market_decline', 'Legacy POS adoption declining', 'Traditional POS adoption declining as cloud-native platforms dominate.', 'Market research metadata', '2026-Q1', 'Moderate', 'Adjacent commerce', 'information'),
    (p_org_id, 'consumer_behavior', 'E-commerce returns increasing', 'E-commerce returns increasing industry-wide — operational cost pressure rising.', 'Commerce sector aggregates', '2026-Q2', 'High', 'Commerce pack', 'requires_attention'),
    (p_org_id, 'technology_adoption', 'Self-service onboarding trend', 'Competitors increasingly offering self-service onboarding across hospitality and commerce.', 'Competitive scan metadata', '2026-Q2', 'High', 'Product strategy', 'requires_attention'),
    (p_org_id, 'industry_changes', 'Enterprise governance requirements', 'Enterprise prospects requesting governance and audit capabilities in evaluations.', 'Sales pipeline metadata', '2026-Q2', 'Moderate', 'Enterprise tier', 'information');

  insert into public.industry_intelligence_competitive
    (organization_id, competitive_type, title, summary, source_label, date_label, confidence_label, relevance_label, status_key)
  values
    (p_org_id, 'competitors', 'Competitive landscape', '3 new entrants in hospitality AI segment — pricing pressure in mid-market.', 'Competitive intelligence metadata', '2026-Q2', 'High', 'GTM strategy', 'requires_attention'),
    (p_org_id, 'products', 'Product feature trends', 'Self-service onboarding and embedded analytics becoming table stakes.', 'Product comparison metadata', '2026-Q2', 'High', 'Product roadmap', 'requires_attention'),
    (p_org_id, 'pricing_trends', 'Pricing trends', 'Mid-market pricing consolidating — freemium models declining in enterprise segment.', 'Pricing scan metadata', '2026-Q1', 'Moderate', 'Pricing strategy', 'information'),
    (p_org_id, 'market_positioning', 'Market positioning', 'Vertical specialization outperforming horizontal platforms in hospitality.', 'Positioning analysis', '2026-Q2', 'High', 'Positioning', 'verified'),
    (p_org_id, 'feature_trends', 'Feature trends', 'Competitors increasingly offering self-service onboarding and governance dashboards.', 'Feature comparison metadata', '2026-Q2', 'High', 'Product strategy', 'requires_attention');

  insert into public.industry_intelligence_regulatory
    (organization_id, regulatory_type, title, summary, source_label, date_label, confidence_label, relevance_label, status_key)
  values
    (p_org_id, 'compliance_changes', 'Customer onboarding compliance', 'New compliance requirement affects customer onboarding in finance and hospitality sectors.', 'Regulatory monitor', '2026-Q2', 'High', 'Onboarding flow', 'requires_attention'),
    (p_org_id, 'industry_regulations', 'Hospitality data retention', 'Updated hospitality data retention rules in EU markets — review guest data policies.', 'Regulatory monitor', '2026-Q1', 'Moderate', 'Hosts pack', 'requires_attention'),
    (p_org_id, 'regional_requirements', 'Nordic data residency', 'Nordic data residency expectations increasing for enterprise customers.', 'Regional compliance metadata', '2026-Q2', 'High', 'Enterprise sales', 'information'),
    (p_org_id, 'data_rules', 'AI governance disclosure', 'Enterprise AI governance disclosure requirements emerging in procurement evaluations.', 'RFP pattern analysis', '2026-Q2', 'Moderate', 'Trust & governance', 'waiting');

  insert into public.industry_intelligence_benchmarks
    (organization_id, benchmark_type, title, comparison_label, source_label, date_label, confidence_label, status_key)
  values
    (p_org_id, 'industry_average', 'Support response time', 'Support response time below industry benchmark — 4.2h vs 3.1h industry average.', 'Industry benchmark metadata', '2026-Q2', 'High', 'requires_attention'),
    (p_org_id, 'industry_leaders', 'Guest satisfaction score', 'Guest satisfaction 4.4/5 — above industry leaders threshold of 4.2/5.', 'Hospitality benchmark', '2026-Q2', 'High', 'verified'),
    (p_org_id, 'regional_peers', 'Nordic market penetration', 'Nordic penetration 18% — aligned with regional peer median of 17%.', 'Regional peer metadata', '2026-Q1', 'Moderate', 'verified'),
    (p_org_id, 'company_size_peers', 'Revenue per employee', 'Revenue per employee above size-peer median — operational efficiency strong.', 'Size peer benchmark', '2026-Q2', 'Moderate', 'verified');

  insert into public.industry_intelligence_opportunities
    (organization_id, opportunity_type, title, summary, source_label, date_label, confidence_label, relevance_label, status_key)
  values
    (p_org_id, 'emerging_markets', 'Nordic hospitality expansion', 'Nordic hospitality market growth creates partnership and expansion opportunity.', 'Market monitor', '2026-Q2', 'High', 'GTM expansion', 'verified'),
    (p_org_id, 'industry_shifts', 'Experience automation shift', 'Hospitality shifting from operational tools to experience automation platforms.', 'Industry trend analysis', '2026-Q2', 'High', 'Product strategy', 'verified'),
    (p_org_id, 'new_services', 'Managed onboarding services', 'Mid-market requesting managed onboarding — new service line opportunity.', 'Customer inquiry metadata', '2026-Q2', 'Moderate', 'Services revenue', 'information'),
    (p_org_id, 'partnership_opportunities', 'PMS integration partners', 'Property management system partners seeking embedded AI integrations.', 'Partner pipeline metadata', '2026-Q1', 'High', 'Hosts pack', 'verified'),
    (p_org_id, 'technology_opportunities', 'Predictive maintenance integration', 'Smart building platforms seeking predictive maintenance AI integrations.', 'Technology scan', '2026-Q2', 'Moderate', 'Future packs', 'waiting');

  insert into public.industry_intelligence_executive_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'industry_health', 'Strong', 'Hospitality sector growth +12% — primary sector healthy', 'verified'),
    (p_org_id, 'market_direction', 'Growth', 'Experience automation and self-service adoption accelerating', 'information'),
    (p_org_id, 'competitive_pressure', 'Moderate', '3 new entrants — vertical positioning advantage maintained', 'requires_attention'),
    (p_org_id, 'regulatory_changes', '2 active', 'Onboarding compliance and data retention rules require review', 'requires_attention'),
    (p_org_id, 'strategic_opportunities', '3 active', 'Nordic expansion · PMS partnerships · experience automation', 'verified');

  insert into public.industry_intelligence_companion
    (organization_id, advisor_type, question, insight, evidence_label, source_label, date_label, confidence_label)
  values
    (p_org_id, 'industry_changing', 'What is changing in our industry?', 'Hospitality is shifting toward experience automation — self-service onboarding and embedded analytics are becoming table stakes while labor shortages drive operational AI demand.', 'Market monitoring · competitive intelligence · industry profiles', 'Industry Intelligence Engine', '2026-Q2', 'High'),
    (p_org_id, 'competitors_doing', 'What are competitors doing?', 'Competitors increasingly offer self-service onboarding and governance dashboards — 3 new hospitality AI entrants creating mid-market pricing pressure.', 'Competitive scan · feature trends · pricing metadata', 'Competitive Intelligence', '2026-Q2', 'High'),
    (p_org_id, 'opportunities_investigate', 'What opportunities should we investigate?', 'Nordic hospitality expansion (+12% bookings), PMS partnership integrations, and managed onboarding services for mid-market customers show strongest evidence.', 'Opportunity detection · market monitoring · partner pipeline', 'Opportunity Detection', '2026-Q2', 'High');

  insert into public.industry_intelligence_business_packs
    (organization_id, pack_key, pack_name, enrichment_label, status_key)
  values
    (p_org_id, 'hosts', 'Aipify Hosts', 'Hospitality benchmarks, booking trends, and guest satisfaction signals enriched automatically.', 'verified'),
    (p_org_id, 'commerce', 'Commerce', 'E-commerce returns, cart abandonment, and consumer behavior trends enriched.', 'verified'),
    (p_org_id, 'support', 'Support', 'Industry support response benchmarks and ticket trend context enriched.', 'verified'),
    (p_org_id, 'finance', 'Finance', 'Regulatory onboarding requirements and KYC benchmarks enriched.', 'requires_attention'),
    (p_org_id, 'sales', 'Sales', 'Competitive positioning and market opportunity signals enriched.', 'verified'),
    (p_org_id, 'future_packs', 'Future Business Packs', 'Predictive maintenance and smart building integration signals prepared.', 'waiting');

end; $$;

create or replace function public.get_industry_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_overview_s jsonb; v_market_s jsonb; v_regulatory_s jsonb; v_competitive_s jsonb;
  v_opportunities_s jsonb; v_risks_s jsonb; v_benchmarks_s jsonb;
  v_profiles jsonb; v_market jsonb; v_competitive jsonb; v_regulatory jsonb;
  v_benchmarks jsonb; v_opportunities jsonb; v_exec jsonb; v_companion jsonb; v_packs jsonb;
begin
  perform public._irp_require_permission('industry_intelligence.view');
  v_ctx := public._iie451_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._iie451_seed(v_org_id);

  select jsonb_build_object(
    'intelligence_enabled', s.intelligence_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.industry_intelligence_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'industry_overview';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_market_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'market_trends';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_regulatory_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'regulatory_changes';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_competitive_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'competitive_intelligence';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_opportunities_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'emerging_opportunities';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_risks_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'industry_risks';
  select coalesce(jsonb_agg(public._iie451_section_json(s)), '[]'::jsonb) into v_benchmarks_s
  from public.industry_intelligence_section_items s where s.organization_id = v_org_id and s.section_key = 'industry_benchmarks';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'industry_key', p.industry_key, 'industry_name', p.industry_name,
    'signal_label', p.signal_label, 'benchmark_label', p.benchmark_label,
    'trend_label', p.trend_label, 'risk_label', p.risk_label,
    'opportunity_label', p.opportunity_label, 'status_key', p.status_key, 'item_type', 'profile'
  ) order by p.industry_name), '[]'::jsonb)
  into v_profiles from public.industry_intelligence_profiles p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'monitoring_type', m.monitoring_type, 'title', m.title, 'summary', m.summary,
    'source_label', m.source_label, 'date_label', m.date_label,
    'confidence_label', m.confidence_label, 'relevance_label', m.relevance_label,
    'status_key', m.status_key, 'item_type', 'market_monitoring'
  ) order by m.title), '[]'::jsonb)
  into v_market from public.industry_intelligence_market_monitoring m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'competitive_type', c.competitive_type, 'title', c.title, 'summary', c.summary,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'relevance_label', c.relevance_label,
    'status_key', c.status_key, 'item_type', 'competitive'
  ) order by c.title), '[]'::jsonb)
  into v_competitive from public.industry_intelligence_competitive c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'regulatory_type', r.regulatory_type, 'title', r.title, 'summary', r.summary,
    'source_label', r.source_label, 'date_label', r.date_label,
    'confidence_label', r.confidence_label, 'relevance_label', r.relevance_label,
    'status_key', r.status_key, 'item_type', 'regulatory'
  ) order by r.title), '[]'::jsonb)
  into v_regulatory from public.industry_intelligence_regulatory r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'benchmark_type', b.benchmark_type, 'title', b.title,
    'comparison_label', b.comparison_label, 'source_label', b.source_label,
    'date_label', b.date_label, 'confidence_label', b.confidence_label,
    'status_key', b.status_key, 'item_type', 'benchmark'
  ) order by b.title), '[]'::jsonb)
  into v_benchmarks from public.industry_intelligence_benchmarks b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary,
    'source_label', o.source_label, 'date_label', o.date_label,
    'confidence_label', o.confidence_label, 'relevance_label', o.relevance_label,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.title), '[]'::jsonb)
  into v_opportunities from public.industry_intelligence_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'executive'
  ) order by case m.metric_key
    when 'industry_health' then 1 when 'market_direction' then 2 when 'competitive_pressure' then 3
    when 'regulatory_changes' then 4 else 5 end), '[]'::jsonb)
  into v_exec from public.industry_intelligence_executive_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'advisor_type', c.advisor_type, 'question', c.question,
    'insight', c.insight, 'evidence_label', c.evidence_label,
    'source_label', c.source_label, 'date_label', c.date_label,
    'confidence_label', c.confidence_label, 'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.industry_intelligence_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'pack_key', p.pack_key, 'pack_name', p.pack_name,
    'enrichment_label', p.enrichment_label, 'status_key', p.status_key, 'item_type', 'business_pack'
  ) order by p.pack_name), '[]'::jsonb)
  into v_packs from public.industry_intelligence_business_packs p where p.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Organizations do not operate in isolation. Every business operates inside an industry ecosystem — Aipify understands that ecosystem with explainable, auditable, evidence-based intelligence.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All industry intelligence includes source, date, confidence, relevance, and audit history. Human-controlled — no autonomous strategic authority.',
    'intelligence_settings', coalesce(v_settings, '{}'::jsonb),
    'industry_profiles', v_profiles,
    'market_monitoring_engine', v_market,
    'competitive_intelligence', v_competitive,
    'regulatory_intelligence', v_regulatory,
    'industry_benchmark_engine', v_benchmarks,
    'opportunity_detection', v_opportunities,
    'executive_industry_dashboard', v_exec,
    'companion_industry_advisor', v_companion,
    'business_pack_awareness', v_packs,
    'sections', jsonb_build_object(
      'industry_overview', v_overview_s,
      'market_trends', v_market_s,
      'regulatory_changes', v_regulatory_s,
      'competitive_intelligence', v_competitive_s,
      'emerging_opportunities', v_opportunities_s,
      'industry_risks', v_risks_s,
      'industry_benchmarks', v_benchmarks_s
    ),
    'statistics', jsonb_build_object(
      'profile_count', jsonb_array_length(v_profiles),
      'market_count', jsonb_array_length(v_market),
      'competitive_count', jsonb_array_length(v_competitive),
      'regulatory_count', jsonb_array_length(v_regulatory),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Industry intelligence metadata and aggregate signals only — no raw customer records or unapproved PII.'
  );
end; $$;

create or replace function public.manage_industry_intelligence_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._iie451_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'escalate', 'resolve') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.industry_intelligence_companion set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'opportunity' and p_item_id is not null then
    update public.industry_intelligence_opportunities set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'resolve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'regulatory' and p_item_id is not null then
    update public.industry_intelligence_regulatory set
      status_key = case p_action when 'resolve' then 'verified' when 'escalate' then 'requires_attention' else status_key end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._iie451_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Industry intelligence item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_industry_intelligence_center() to authenticated;
grant execute on function public.manage_industry_intelligence_item(text, uuid, text, jsonb) to authenticated;
