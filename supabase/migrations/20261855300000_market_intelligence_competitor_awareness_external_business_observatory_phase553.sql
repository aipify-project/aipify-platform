-- Phase 553 — Market Intelligence, Competitor Awareness & External Business Observatory
-- External intelligence layer. Public information only — no surveillance.
-- Feature owner: CUSTOMER APP. Routes: /app/market-intelligence, /app/market-intelligence/markets

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_market_observatory_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  observatory_enabled boolean not null default true,
  competitor_tracking_enabled boolean not null default true,
  trend_detection_enabled boolean not null default true,
  briefing_enabled boolean not null default true,
  public_sources_only boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_market_observatory_settings enable row level security;
revoke all on public.organization_market_observatory_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Markets, competitors, industries
-- ---------------------------------------------------------------------------
create table if not exists public.organization_market_observatory_markets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  market_key text not null,
  market_name text not null,
  region_label text not null default '',
  industry_label text not null default '',
  growth_rate_pct numeric(6,2) not null default 0,
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  competition_level text not null default 'moderate' check (competition_level in ('low', 'moderate', 'high', 'intense')),
  market_status text not null default 'stable' check (
    market_status in ('growing', 'stable', 'competitive', 'high_risk')
  ),
  health_score integer not null default 75 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, market_key)
);

alter table public.organization_market_observatory_markets enable row level security;
revoke all on public.organization_market_observatory_markets from authenticated, anon;

create table if not exists public.organization_market_observatory_competitors (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  competitor_key text not null,
  competitor_name text not null,
  industry_label text not null default '',
  products_summary text not null default '',
  services_summary text not null default '',
  pricing_summary text not null default '',
  positioning_summary text not null default '',
  market_presence text not null default 'regional',
  strengths text not null default '',
  weaknesses text not null default '',
  differentiators text not null default '',
  source_type text not null default 'public' check (source_type in ('public', 'customer_feedback', 'industry_report')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, competitor_key)
);

alter table public.organization_market_observatory_competitors enable row level security;
revoke all on public.organization_market_observatory_competitors from authenticated, anon;

create table if not exists public.organization_market_observatory_industries (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  industry_key text not null,
  industry_name text not null,
  growth_outlook text not null default 'stable' check (growth_outlook in ('growing', 'stable', 'declining', 'emerging')),
  trend_summary text not null default '',
  regulatory_summary text not null default '',
  technology_summary text not null default '',
  consumer_behavior_summary text not null default '',
  emerging_risks text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, industry_key)
);

alter table public.organization_market_observatory_industries enable row level security;
revoke all on public.organization_market_observatory_industries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Trends, opportunities, threats, signals
-- ---------------------------------------------------------------------------
create table if not exists public.organization_market_observatory_trends (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trend_key text not null,
  title text not null,
  trend_type text not null check (
    trend_type in ('emerging', 'declining', 'technology', 'customer', 'operational', 'industry')
  ),
  direction text not null default 'rising' check (direction in ('rising', 'stable', 'declining')),
  summary text not null default '' check (char_length(summary) <= 500),
  industry_label text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, trend_key)
);

alter table public.organization_market_observatory_trends enable row level security;
revoke all on public.organization_market_observatory_trends from authenticated, anon;

create table if not exists public.organization_market_observatory_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'market_gap', 'expansion', 'new_service', 'new_product', 'industry_niche',
      'geographic', 'business_pack', 'partner', 'customer_segment'
    )
  ),
  region_label text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  impact_label text not null default 'moderate',
  status text not null default 'open' check (status in ('open', 'reviewing', 'pursuing', 'closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, opportunity_key)
);

alter table public.organization_market_observatory_opportunities enable row level security;
revoke all on public.organization_market_observatory_opportunities from authenticated, anon;

create table if not exists public.organization_market_observatory_threats (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  threat_key text not null,
  title text not null,
  threat_type text not null check (
    threat_type in (
      'market_risk', 'competitor_growth', 'regulatory', 'technology',
      'supplier', 'economic', 'disruption'
    )
  ),
  severity text not null default 'attention' check (severity in ('information', 'attention', 'critical')),
  summary text not null default '' check (char_length(summary) <= 500),
  status text not null default 'monitoring' check (status in ('monitoring', 'mitigating', 'resolved')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, threat_key)
);

alter table public.organization_market_observatory_threats enable row level security;
revoke all on public.organization_market_observatory_threats from authenticated, anon;

create table if not exists public.organization_market_observatory_external_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (
    signal_type in ('industry_change', 'market_risk', 'competitor_activity', 'technology', 'regulatory')
  ),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  alert_level text not null default 'information' check (alert_level in ('information', 'executive', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_market_observatory_external_signals enable row level security;
revoke all on public.organization_market_observatory_external_signals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Briefings, positioning, pack/partner/domain intel, audit
-- ---------------------------------------------------------------------------
create table if not exists public.organization_market_observatory_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_key text not null,
  cadence text not null check (cadence in ('daily', 'weekly', 'monthly', 'quarterly')),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 1000),
  recommended_actions jsonb not null default '[]'::jsonb,
  generated_at timestamptz not null default now(),
  unique (organization_id, briefing_key)
);

alter table public.organization_market_observatory_briefings enable row level security;
revoke all on public.organization_market_observatory_briefings from authenticated, anon;

create table if not exists public.organization_market_observatory_competitive_position (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  strengths text not null default '',
  weaknesses text not null default '',
  differentiators text not null default '',
  unique_capabilities text not null default '',
  market_advantages text not null default '',
  why_customers_choose text not null default '',
  why_customers_leave text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.organization_market_observatory_competitive_position enable row level security;
revoke all on public.organization_market_observatory_competitive_position from authenticated, anon;

create table if not exists public.organization_market_observatory_business_pack_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_pack_key text not null,
  pack_label text not null,
  industry_demand text not null default 'stable',
  adoption_signal text not null default '',
  usage_signal text not null default '',
  growth_opportunity text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, business_pack_key)
);

alter table public.organization_market_observatory_business_pack_intel enable row level security;
revoke all on public.organization_market_observatory_business_pack_intel from authenticated, anon;

create table if not exists public.organization_market_observatory_growth_partner_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  partner_key text not null,
  partner_label text not null,
  regional_performance text not null default '',
  industry_performance text not null default '',
  lead_quality text not null default '',
  expansion_opportunity text not null default '',
  market_coverage text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, partner_key)
);

alter table public.organization_market_observatory_growth_partner_intel enable row level security;
revoke all on public.organization_market_observatory_growth_partner_intel from authenticated, anon;

create table if not exists public.organization_market_observatory_domain_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  domain_key text not null,
  domain_label text not null,
  industry_relevance text not null default '',
  market_position text not null default '',
  traffic_trend text not null default 'stable',
  business_pack_adoption text not null default '',
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (organization_id, domain_key)
);

alter table public.organization_market_observatory_domain_intel enable row level security;
revoke all on public.organization_market_observatory_domain_intel from authenticated, anon;

create table if not exists public.organization_market_observatory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null check (
    event_type in (
      'market_report_generated', 'competitor_added', 'trend_identified',
      'opportunity_detected', 'threat_identified', 'briefing_viewed',
      'recommendation_generated', 'market_health_updated'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_market_observatory_audit_logs_org_idx
  on public.organization_market_observatory_audit_logs (organization_id, created_at desc);

alter table public.organization_market_observatory_audit_logs enable row level security;
revoke all on public.organization_market_observatory_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mobs553_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._mobs553_log(
  p_org_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_market_observatory_audit_logs (
    organization_id, actor_user_id, event_type, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._mobs553_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_market_observatory_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._mobs553_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_market_observatory_markets where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_market_observatory_markets (
    organization_id, market_key, market_name, region_label, industry_label,
    growth_rate_pct, risk_level, competition_level, market_status, health_score, summary
  ) values
    (p_org_id, 'nordic', 'Nordic Market', 'Nordic', 'Multi-industry', 4.2, 'low', 'moderate', 'growing', 82, 'Steady growth across Norway and Nordic region.'),
    (p_org_id, 'european', 'European Market', 'Europe', 'Multi-industry', 2.8, 'moderate', 'high', 'competitive', 71, 'Competitive expansion environment.'),
    (p_org_id, 'hospitality', 'Hospitality Market', 'Nordic', 'Hospitality', 5.1, 'moderate', 'moderate', 'growing', 78, 'Seasonal demand with digital adoption increasing.'),
    (p_org_id, 'retail', 'Retail Market', 'Nordic', 'Retail', 1.5, 'moderate', 'high', 'competitive', 68, 'Margin pressure and omnichannel shift.');

  insert into public.organization_market_observatory_competitors (
    organization_id, competitor_key, competitor_name, industry_label, products_summary,
    pricing_summary, positioning_summary, strengths, weaknesses, differentiators
  ) values
    (p_org_id, 'comp_alpha', 'Competitor Alpha', 'Operations Software', 'Workflow and automation suite',
     'Mid-market subscription', 'Enterprise operations platform',
     'Brand recognition, partner network', 'Limited Nordic localization', 'Aipify install-first model and Companion depth');

  insert into public.organization_market_observatory_industries (
    organization_id, industry_key, industry_name, growth_outlook, trend_summary, regulatory_summary, emerging_risks
  ) values
    (p_org_id, 'hospitality', 'Hospitality', 'growing', 'Digital guest experience adoption rising.', 'Local licensing requirements vary by municipality.', 'Labor cost volatility.'),
    (p_org_id, 'retail', 'Retail', 'stable', 'Inventory optimization and unified commerce.', 'Consumer data protection tightening.', 'Supply chain disruption.'),
    (p_org_id, 'technology', 'Technology', 'growing', 'AI adoption increasing across SMB segment.', 'EU AI Act compliance awareness.', 'Rapid vendor consolidation.');

  insert into public.organization_market_observatory_trends (
    organization_id, trend_key, title, trend_type, direction, summary, confidence
  ) values
    (p_org_id, 'ai_adoption', 'AI Adoption Increasing', 'technology', 'rising', 'SMB adoption of operational AI accelerating.', 'high'),
    (p_org_id, 'inventory_costs', 'Inventory Cost Increases', 'operational', 'rising', 'Warehouse and logistics costs trending upward.', 'moderate');

  insert into public.organization_market_observatory_opportunities (
    organization_id, opportunity_key, title, opportunity_type, region_label, summary, impact_label
  ) values
    (p_org_id, 'opp_nordic_expansion', 'Nordic SMB Expansion', 'geographic', 'Nordic', 'Growing demand for install-first operations platforms.', 'high'),
    (p_org_id, 'opp_hosts_pack', 'Hosts Pack Opportunity', 'business_pack', 'Hospitality', 'Property management segment showing increased demand.', 'moderate');

  insert into public.organization_market_observatory_threats (
    organization_id, threat_key, title, threat_type, severity, summary
  ) values
    (p_org_id, 'threat_competitor_expansion', 'Major Competitor Expansion', 'competitor_growth', 'attention', 'Public filings indicate competitor entering Nordic mid-market.'),
    (p_org_id, 'threat_regulatory', 'New Data Regulations', 'regulatory', 'attention', 'Upcoming compliance requirements for customer data handling.');

  insert into public.organization_market_observatory_external_signals (
    organization_id, signal_type, title, summary, alert_level
  ) values
    (p_org_id, 'competitor_activity', 'Competitor product launch announced', 'Public announcement of new automation module.', 'executive'),
    (p_org_id, 'technology', 'AI tooling adoption surge', 'Industry reports show accelerated AI operations adoption.', 'information');

  insert into public.organization_market_observatory_briefings (
    organization_id, briefing_key, cadence, title, summary, recommended_actions
  ) values
    (p_org_id, 'weekly_exec', 'weekly', 'Executive Market Briefing',
     'Nordic market growing; hospitality demand up; competitor expansion requires positioning review.',
     '["Review competitive positioning","Evaluate Hosts Pack expansion","Monitor regulatory timeline"]'::jsonb);

  insert into public.organization_market_observatory_competitive_position (
    organization_id, strengths, weaknesses, differentiators, unique_capabilities,
    market_advantages, why_customers_choose, why_customers_leave
  ) values (
    p_org_id,
    'Install-first model, Companion depth, Business Pack flexibility',
    'Newer brand in some verticals',
    'Single Aipify identity, governed operations layer',
    'AOS orchestration, Trust Center, Knowledge Network integration',
    'Norwegian origin with global architecture',
    'Customers choose Aipify for operational clarity without replacing existing systems.',
    'Customers may leave when onboarding depth is not maintained.'
  );

  insert into public.organization_market_observatory_business_pack_intel (
    organization_id, business_pack_key, pack_label, industry_demand, adoption_signal, growth_opportunity
  ) values
    (p_org_id, 'hosts_pack', 'Hospitality Pack', 'increasing', 'Strong pilot adoption', 'Expand to multi-property operators'),
    (p_org_id, 'warehouse_pack', 'Warehouse Pack', 'stable', 'Strong adoption in logistics segment', 'Cross-sell with inventory engines');

  insert into public.organization_market_observatory_growth_partner_intel (
    organization_id, partner_key, partner_label, regional_performance, lead_quality, expansion_opportunity
  ) values
    (p_org_id, 'partner_nordic', 'Nordic Growth Partner', 'Above target in Q1', 'High intent leads', 'Expand into hospitality vertical');

  insert into public.organization_market_observatory_domain_intel (
    organization_id, domain_key, domain_label, industry_relevance, traffic_trend, summary
  ) values
    (p_org_id, 'butikk_no', 'butikk.no', 'Retail', 'stable', 'Retail industry trends and commerce pack relevance.');
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Main center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_market_observatory_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org_name text;
  v_simulation jsonb;
begin
  v_org_id := public._mobs553_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;

  perform public._mobs553_ensure_settings(v_org_id);
  perform public._mobs553_seed(v_org_id);

  select o.name into v_org_name from public.organizations o where o.id = v_org_id;

  v_simulation := jsonb_build_object(
    'integration', 'digital_twin_phase_543',
    'flow', jsonb_build_array('market_change', 'simulation', 'forecast', 'decision_support'),
    'route', '/app/simulation'
  );

  return jsonb_build_object(
    'found', true,
    'section', coalesce(p_section, 'overview'),
    'principle', 'Most organizations know what happens inside the company. Few understand what happens outside. Aipify monitors both — using publicly available information only.',
    'ethics_note', 'Public sources only. No surveillance. No unethical intelligence gathering.',
    'organization', jsonb_build_object('id', v_org_id, 'name', v_org_name),
    'overview', jsonb_build_object(
      'markets_tracked', (select count(*) from public.organization_market_observatory_markets where organization_id = v_org_id),
      'competitors_tracked', (select count(*) from public.organization_market_observatory_competitors where organization_id = v_org_id),
      'industries_tracked', (select count(*) from public.organization_market_observatory_industries where organization_id = v_org_id),
      'active_trends', (select count(*) from public.organization_market_observatory_trends where organization_id = v_org_id),
      'open_opportunities', (select count(*) from public.organization_market_observatory_opportunities where organization_id = v_org_id and status in ('open', 'reviewing', 'pursuing')),
      'active_threats', (select count(*) from public.organization_market_observatory_threats where organization_id = v_org_id and status = 'monitoring'),
      'external_signals', (select count(*) from public.organization_market_observatory_external_signals where organization_id = v_org_id),
      'avg_market_health', coalesce((select round(avg(health_score))::int from public.organization_market_observatory_markets where organization_id = v_org_id), 75)
    ),
    'market_observatory', coalesce((select jsonb_agg(to_jsonb(m) order by m.health_score desc) from public.organization_market_observatory_markets m where m.organization_id = v_org_id), '[]'::jsonb),
    'competitor_intelligence', coalesce((select jsonb_agg(to_jsonb(c) order by c.competitor_name) from public.organization_market_observatory_competitors c where c.organization_id = v_org_id), '[]'::jsonb),
    'industry_intelligence', coalesce((select jsonb_agg(to_jsonb(i) order by i.industry_name) from public.organization_market_observatory_industries i where i.organization_id = v_org_id), '[]'::jsonb),
    'trend_detection', coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.organization_market_observatory_trends t where t.organization_id = v_org_id), '[]'::jsonb),
    'opportunity_engine', coalesce((select jsonb_agg(to_jsonb(o) order by o.created_at desc) from public.organization_market_observatory_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'threat_detection', coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.organization_market_observatory_threats t where t.organization_id = v_org_id), '[]'::jsonb),
    'external_signals_dashboard', coalesce((select jsonb_agg(to_jsonb(s) order by s.created_at desc) from public.organization_market_observatory_external_signals s where s.organization_id = v_org_id), '[]'::jsonb),
    'executive_briefings', coalesce((select jsonb_agg(to_jsonb(b) order by b.generated_at desc) from public.organization_market_observatory_briefings b where b.organization_id = v_org_id), '[]'::jsonb),
    'competitive_positioning', coalesce((select to_jsonb(p) from public.organization_market_observatory_competitive_position p where p.organization_id = v_org_id), '{}'::jsonb),
    'business_pack_intelligence', coalesce((select jsonb_agg(to_jsonb(b) order by b.pack_label) from public.organization_market_observatory_business_pack_intel b where b.organization_id = v_org_id), '[]'::jsonb),
    'growth_partner_intelligence', coalesce((select jsonb_agg(to_jsonb(g) order by g.partner_label) from public.organization_market_observatory_growth_partner_intel g where g.organization_id = v_org_id), '[]'::jsonb),
    'domain_intelligence', coalesce((select jsonb_agg(to_jsonb(d) order by d.domain_label) from public.organization_market_observatory_domain_intel d where d.organization_id = v_org_id), '[]'::jsonb),
    'digital_twin_integration', v_simulation,
    'companion_market_advisor', jsonb_build_object(
      'advisor_prompts', jsonb_build_array(
        'What trends affect our organization right now?',
        'Who are our major competitors and how do we differentiate?',
        'What market opportunities should we prioritize?',
        'What external risks should leadership monitor?',
        'Generate an executive market briefing.'
      )
    ),
    'executive_dashboard', jsonb_build_object(
      'market_health', coalesce((select round(avg(health_score))::int from public.organization_market_observatory_markets where organization_id = v_org_id), 75),
      'competitive_position', 'review_positioning',
      'growth_opportunities', (select count(*) from public.organization_market_observatory_opportunities where organization_id = v_org_id and status in ('open', 'pursuing')),
      'active_threats', (select count(*) from public.organization_market_observatory_threats where organization_id = v_org_id and severity in ('attention', 'critical')),
      'industry_trends', (select count(*) from public.organization_market_observatory_trends where organization_id = v_org_id),
      'companion_recommendations', (select count(*) from public.organization_market_observatory_opportunities where organization_id = v_org_id)
    ),
    'reports', jsonb_build_object(
      'market_analysis', (select count(*) from public.organization_market_observatory_markets where organization_id = v_org_id),
      'industry_analysis', (select count(*) from public.organization_market_observatory_industries where organization_id = v_org_id),
      'competitive_analysis', (select count(*) from public.organization_market_observatory_competitors where organization_id = v_org_id),
      'opportunity_analysis', (select count(*) from public.organization_market_observatory_opportunities where organization_id = v_org_id),
      'threat_analysis', (select count(*) from public.organization_market_observatory_threats where organization_id = v_org_id)
    ),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_market_observatory_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'mobile_access', jsonb_build_object(
      'briefings', true, 'opportunities', true, 'threats', true, 'competitors', true, 'trends', true
    ),
    'routes', jsonb_build_object(
      'market_intelligence', '/app/market-intelligence',
      'markets', '/app/market-intelligence/markets',
      'simulation', '/app/simulation',
      'legacy_market_center', '/app/intelligence/market',
      'strategic_intelligence', '/app/intelligence'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Actions & mobile
-- ---------------------------------------------------------------------------
create or replace function public.perform_organization_market_observatory_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
begin
  perform public._bde_require_admin();
  v_org_id := public._mobs553_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;

  if p_action_type = 'add_competitor' then
    insert into public.organization_market_observatory_competitors (
      organization_id, competitor_key, competitor_name, industry_label, products_summary, positioning_summary
    ) values (
      v_org_id,
      coalesce(p_payload->>'competitor_key', 'comp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'competitor_name', 'New competitor'),
      coalesce(p_payload->>'industry_label', ''),
      coalesce(p_payload->>'products_summary', ''),
      coalesce(p_payload->>'positioning_summary', '')
    );
    perform public._mobs553_log(v_org_id, 'competitor_added', 'Competitor added to Market Observatory.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'identify_trend' then
    insert into public.organization_market_observatory_trends (
      organization_id, trend_key, title, trend_type, summary, direction
    ) values (
      v_org_id,
      coalesce(p_payload->>'trend_key', 'trend_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'New trend'),
      coalesce(p_payload->>'trend_type', 'industry'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'direction', 'rising')
    );
    perform public._mobs553_log(v_org_id, 'trend_identified', 'Market trend identified.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'detect_opportunity' then
    insert into public.organization_market_observatory_opportunities (
      organization_id, opportunity_key, title, opportunity_type, summary, region_label
    ) values (
      v_org_id,
      coalesce(p_payload->>'opportunity_key', 'opp_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'New opportunity'),
      coalesce(p_payload->>'opportunity_type', 'market_gap'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'region_label', '')
    );
    perform public._mobs553_log(v_org_id, 'opportunity_detected', 'Market opportunity detected.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'flag_threat' then
    insert into public.organization_market_observatory_threats (
      organization_id, threat_key, title, threat_type, summary, severity
    ) values (
      v_org_id,
      coalesce(p_payload->>'threat_key', 'threat_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'title', 'New threat'),
      coalesce(p_payload->>'threat_type', 'market_risk'),
      coalesce(p_payload->>'summary', ''),
      coalesce(p_payload->>'severity', 'attention')
    );
    perform public._mobs553_log(v_org_id, 'threat_identified', 'Market threat flagged for monitoring.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'generate_briefing' then
    insert into public.organization_market_observatory_briefings (
      organization_id, briefing_key, cadence, title, summary, recommended_actions
    ) values (
      v_org_id,
      coalesce(p_payload->>'briefing_key', 'brief_' || substr(gen_random_uuid()::text, 1, 8)),
      coalesce(p_payload->>'cadence', 'weekly'),
      coalesce(p_payload->>'title', 'Market briefing'),
      coalesce(p_payload->>'summary', 'Executive market briefing generated.'),
      coalesce(p_payload->'recommended_actions', '[]'::jsonb)
    );
    perform public._mobs553_log(v_org_id, 'market_report_generated', 'Executive market briefing generated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action_type = 'refresh_market_health' then
    update public.organization_market_observatory_markets
    set health_score = coalesce((p_payload->>'health_score')::int, health_score), updated_at = now()
    where organization_id = v_org_id and market_key = coalesce(p_payload->>'market_key', market_key);
    perform public._mobs553_log(v_org_id, 'market_health_updated', 'Market health scores refreshed.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  return jsonb_build_object('ok', false, 'error', 'Unknown action');
end; $$;

create or replace function public.get_organization_market_observatory_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_market_observatory_center('mobile');
  return jsonb_build_object(
    'found', v_center->'found',
    'market_health', v_center->'overview'->'avg_market_health',
    'open_opportunities', v_center->'overview'->'open_opportunities',
    'active_threats', v_center->'overview'->'active_threats',
    'competitors_tracked', v_center->'overview'->'competitors_tracked',
    'active_trends', v_center->'overview'->'active_trends',
    'routes', v_center->'routes',
    'mobile_access', v_center->'mobile_access'
  );
end; $$;

create or replace function public.get_companion_market_advisor_context(p_query text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
begin
  v_center := public.get_organization_market_observatory_center('companion');
  return jsonb_build_object(
    'found', true,
    'query', p_query,
    'principle', v_center->'principle',
    'ethics_note', v_center->'ethics_note',
    'advisor', v_center->'companion_market_advisor',
    'opportunities', v_center->'opportunity_engine',
    'threats', v_center->'threat_detection',
    'routes', v_center->'routes'
  );
end; $$;

grant execute on function public.get_organization_market_observatory_center(text) to authenticated;
grant execute on function public.perform_organization_market_observatory_action(text, jsonb) to authenticated;
grant execute on function public.get_organization_market_observatory_mobile_summary() to authenticated;
grant execute on function public.get_companion_market_advisor_context(text) to authenticated;
