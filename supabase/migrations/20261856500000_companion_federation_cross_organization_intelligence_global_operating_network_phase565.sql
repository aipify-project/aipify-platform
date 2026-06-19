-- Phase 565 — Companion Federation, Cross-Organization Intelligence & Global Operating Network
-- Feature owner: CUSTOMER APP
-- Routes: /app/federation, /app/federation/workspaces
-- Helpers: _cmf565_*

create table if not exists public.organization_companion_federation_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  federation_enabled boolean not null default true,
  aggregated_intelligence_only boolean not null default true,
  trust_verification_required boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_federation_settings enable row level security;
revoke all on public.organization_companion_federation_settings from authenticated, anon;

create table if not exists public.organization_companion_federation_registry (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  federation_key text not null,
  federation_name text not null,
  federation_type text not null check (
    federation_type in (
      'industry', 'partner', 'supply_chain', 'enterprise', 'regional',
      'government', 'private', 'custom'
    )
  ),
  federation_status text not null default 'active' check (
    federation_status in ('pending', 'verified', 'active', 'review_required', 'suspended')
  ),
  trust_status text not null default 'verified' check (
    trust_status in ('pending', 'verified', 'active', 'review_required', 'suspended')
  ),
  region text not null default 'Nordics',
  industry text not null default 'general',
  participating_orgs_count integer not null default 0,
  description text not null default '' check (char_length(description) <= 500),
  unique (organization_id, federation_key)
);

alter table public.organization_companion_federation_registry enable row level security;
revoke all on public.organization_companion_federation_registry from authenticated, anon;

create table if not exists public.organization_companion_federation_networks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  network_key text not null,
  network_name text not null,
  federation_key text not null default '',
  network_type text not null default 'industry' check (
    network_type in ('industry', 'partner', 'supply_chain', 'regional', 'research', 'custom')
  ),
  network_status text not null default 'active' check (
    network_status in ('pending', 'verified', 'active', 'review_required', 'suspended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, network_key)
);

alter table public.organization_companion_federation_networks enable row level security;
revoke all on public.organization_companion_federation_networks from authenticated, anon;

create table if not exists public.organization_companion_federation_trust_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trust_key text not null,
  partner_org_name text not null,
  verification_type text not null default 'organization' check (
    verification_type in ('organization', 'partner', 'compliance', 'security', 'federation_agreement')
  ),
  trust_status text not null default 'verified' check (
    trust_status in ('pending', 'verified', 'active', 'review_required', 'suspended')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, trust_key)
);

alter table public.organization_companion_federation_trust_relationships enable row level security;
revoke all on public.organization_companion_federation_trust_relationships from authenticated, anon;

create table if not exists public.organization_companion_federation_shared_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  intelligence_key text not null,
  intelligence_title text not null,
  intelligence_type text not null check (
    intelligence_type in (
      'industry_trends', 'operational_benchmarks', 'revenue_trends',
      'market_signals', 'capacity_indicators', 'risk_signals'
    )
  ),
  intelligence_status text not null default 'active' check (
    intelligence_status in ('pending', 'approved', 'active', 'review_required')
  ),
  is_aggregated boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, intelligence_key)
);

alter table public.organization_companion_federation_shared_intelligence enable row level security;
revoke all on public.organization_companion_federation_shared_intelligence from authenticated, anon;

create table if not exists public.organization_companion_federation_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_key text not null,
  workspace_title text not null,
  workspace_type text not null default 'industry_working_group' check (
    workspace_type in (
      'industry_working_group', 'joint_project', 'research_initiative',
      'regional_council', 'partner_program', 'custom'
    )
  ),
  workspace_status text not null default 'active' check (
    workspace_status in ('pending', 'active', 'review_required', 'archived')
  ),
  federation_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, workspace_key)
);

alter table public.organization_companion_federation_workspaces enable row level security;
revoke all on public.organization_companion_federation_workspaces from authenticated, anon;

create table if not exists public.organization_companion_federation_benchmarks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  benchmark_key text not null,
  benchmark_title text not null,
  benchmark_category text not null check (
    benchmark_category in (
      'revenue', 'support', 'operational', 'customer_success',
      'partner', 'adoption', 'custom'
    )
  ),
  org_value numeric(8,2) not null default 0,
  industry_average numeric(8,2) not null default 0,
  variance_pct numeric(6,2) not null default 0,
  is_anonymized boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, benchmark_key)
);

alter table public.organization_companion_federation_benchmarks enable row level security;
revoke all on public.organization_companion_federation_benchmarks from authenticated, anon;

create table if not exists public.organization_companion_federation_industry_observatory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  trend_key text not null,
  trend_title text not null,
  industry text not null default 'general',
  trend_type text not null default 'emerging' check (
    trend_type in ('emerging', 'technology', 'regulatory', 'operational', 'market')
  ),
  trend_status text not null default 'active' check (
    trend_status in ('emerging', 'active', 'monitoring', 'review_required')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, trend_key)
);

alter table public.organization_companion_federation_industry_observatory enable row level security;
revoke all on public.organization_companion_federation_industry_observatory from authenticated, anon;

create table if not exists public.organization_companion_federation_risk_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_category text not null check (
    risk_category in (
      'supply_chain', 'fraud', 'cybersecurity', 'regulatory', 'operational', 'custom'
    )
  ),
  risk_level text not null default 'moderate' check (
    risk_level in ('low', 'moderate', 'elevated', 'high', 'critical')
  ),
  risk_status text not null default 'active' check (
    risk_status in ('pending', 'active', 'monitoring', 'resolved')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, risk_key)
);

alter table public.organization_companion_federation_risk_signals enable row level security;
revoke all on public.organization_companion_federation_risk_signals from authenticated, anon;

create table if not exists public.organization_companion_federation_knowledge (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  knowledge_key text not null,
  knowledge_title text not null,
  knowledge_type text not null check (
    knowledge_type in ('playbook', 'procedure', 'best_practice', 'template', 'benchmark', 'research')
  ),
  industry text not null default 'general',
  governance_status text not null default 'approved' check (
    governance_status in ('pending', 'approved', 'review_required', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, knowledge_key)
);

alter table public.organization_companion_federation_knowledge enable row level security;
revoke all on public.organization_companion_federation_knowledge from authenticated, anon;

create table if not exists public.organization_companion_federation_research (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  research_key text not null,
  research_title text not null,
  research_status text not null default 'active' check (
    research_status in ('pending', 'active', 'aggregating', 'completed', 'review_required')
  ),
  participating_orgs_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, research_key)
);

alter table public.organization_companion_federation_research enable row level security;
revoke all on public.organization_companion_federation_research from authenticated, anon;

create table if not exists public.organization_companion_federation_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'federation' check (
    metric_category in ('federation', 'intelligence', 'benchmark', 'risk', 'growth')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_federation_analytics enable row level security;
revoke all on public.organization_companion_federation_analytics from authenticated, anon;

create table if not exists public.organization_companion_federation_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'federation' check (
    audit_category in (
      'federation', 'benchmark', 'trend', 'risk', 'workspace',
      'research', 'trust', 'intelligence', 'governance'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_federation_audit_logs_org_idx
  on public.organization_companion_federation_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_federation_audit_logs enable row level security;
revoke all on public.organization_companion_federation_audit_logs from authenticated, anon;

create or replace function public._cmf565_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmf565_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'federation'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_federation_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'federation'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmf565_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_federation_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmf565_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_federation_registry where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_federation_registry (
    organization_id, federation_key, federation_name, federation_type, federation_status,
    trust_status, region, industry, participating_orgs_count, description
  ) values
    (p_org_id, 'fed_hospitality', 'Nordic Hospitality Federation', 'industry', 'active', 'verified', 'Nordics', 'hospitality', 24,
     'Industry federation for hospitality operators — aggregated benchmarks and trends only.'),
    (p_org_id, 'fed_logistics', 'Logistics Partner Federation', 'supply_chain', 'active', 'verified', 'Europe', 'logistics', 18,
     'Supply chain federation — governed market signals and capacity indicators.'),
    (p_org_id, 'fed_retail', 'Retail Intelligence Council', 'regional', 'review_required', 'review_required', 'Nordics', 'retail', 12,
     'Regional retail federation — trust review required before full participation.');

  insert into public.organization_companion_federation_networks (
    organization_id, network_key, network_name, federation_key, network_type, network_status, summary
  ) values
    (p_org_id, 'net_hospitality', 'Hospitality Intelligence Network', 'fed_hospitality', 'industry', 'active',
     'Cooperative intelligence without exposing private organizational data.'),
    (p_org_id, 'net_logistics', 'Logistics Coordination Network', 'fed_logistics', 'supply_chain', 'active',
     'Supply chain signals and operational benchmarks — all governed.'),
    (p_org_id, 'net_retail', 'Retail Observatory Network', 'fed_retail', 'regional', 'review_required',
     'Regional retail trends — pending trust verification.');

  insert into public.organization_companion_federation_trust_relationships (
    organization_id, trust_key, partner_org_name, verification_type, trust_status, summary
  ) values
    (p_org_id, 'trust_org_nordic', 'Nordic Hospitality Group', 'organization', 'verified', 'Organization verification complete.'),
    (p_org_id, 'trust_partner_baltic', 'Baltic Growth Partners', 'partner', 'verified', 'Partner verification complete.'),
    (p_org_id, 'trust_compliance_eu', 'EU Compliance Board', 'compliance', 'active', 'Compliance verification active.'),
    (p_org_id, 'trust_security_aipify', 'Aipify Trust Center', 'security', 'verified', 'Security verification via Phase 551 Trust Center.');

  insert into public.organization_companion_federation_shared_intelligence (
    organization_id, intelligence_key, intelligence_title, intelligence_type, intelligence_status, is_aggregated, summary
  ) values
    (p_org_id, 'intel_hosp_trends', 'Hospitality Occupancy Trends', 'industry_trends', 'active', true,
     'Aggregated occupancy trends — no private organizational data exposed.'),
    (p_org_id, 'intel_support_bench', 'Support Response Benchmarks', 'operational_benchmarks', 'active', true,
     'Anonymized support response time benchmarks across federation.'),
    (p_org_id, 'intel_market_signals', 'Nordic Market Signals', 'market_signals', 'approved', true,
     'Governed market signals from participating organizations.'),
    (p_org_id, 'intel_capacity', 'Logistics Capacity Indicators', 'capacity_indicators', 'active', true,
     'Aggregated capacity indicators for supply chain planning.');

  insert into public.organization_companion_federation_workspaces (
    organization_id, workspace_key, workspace_title, workspace_type, workspace_status, federation_key, summary
  ) values
    (p_org_id, 'fws_hospitality_wg', 'Hospitality Working Group', 'industry_working_group', 'active', 'fed_hospitality',
     'Industry working group — secure collaboration on best practices.'),
    (p_org_id, 'fws_research_q4', 'Q4 Industry Research Initiative', 'research_initiative', 'active', 'fed_hospitality',
     'Research initiative with aggregated insights and Companion analysis.'),
    (p_org_id, 'fws_regional_council', 'Nordic Regional Council', 'regional_council', 'pending', 'fed_retail',
     'Regional council — federation invitation pending approval.');

  insert into public.organization_companion_federation_benchmarks (
    organization_id, benchmark_key, benchmark_title, benchmark_category,
    org_value, industry_average, variance_pct, is_anonymized, summary
  ) values
    (p_org_id, 'bench_support_response', 'Support Response Time', 'support', 4.2, 4.8, -12.5, true,
     'Your support response time is 12% faster than industry average.'),
    (p_org_id, 'bench_renewal', 'Customer Renewal Rate', 'customer_success', 92, 84, 8, true,
     'Your renewal rate is 8% above industry average.'),
    (p_org_id, 'bench_adoption', 'Feature Adoption Rate', 'adoption', 68, 62, 6, true,
     'Adoption rate exceeds industry average by 6%.');

  insert into public.organization_companion_federation_industry_observatory (
    organization_id, trend_key, trend_title, industry, trend_type, trend_status, summary
  ) values
    (p_org_id, 'trend_ai_ops', 'AI-Assisted Operations Adoption', 'general', 'technology', 'emerging',
     'Growing adoption of AI-assisted operations across industries.'),
    (p_org_id, 'trend_reg_eu', 'EU Data Governance Updates', 'general', 'regulatory', 'monitoring',
     'Regulatory changes affecting cross-organization data sharing.'),
    (p_org_id, 'trend_hosp_demand', 'Hospitality Demand Recovery', 'hospitality', 'market', 'active',
     'Market demand signals showing regional recovery patterns.');

  insert into public.organization_companion_federation_risk_signals (
    organization_id, risk_key, risk_title, risk_category, risk_level, risk_status, summary
  ) values
    (p_org_id, 'risk_supply_chain', 'Supply Chain Disruption Signal', 'supply_chain', 'elevated', 'active',
     'Early warning — supply chain disruption indicators in logistics federation.'),
    (p_org_id, 'risk_cyber', 'Cybersecurity Threat Indicator', 'cybersecurity', 'moderate', 'monitoring',
     'Federated cybersecurity risk signal — no private data exposed.'),
    (p_org_id, 'risk_regulatory', 'Regulatory Compliance Alert', 'regulatory', 'moderate', 'active',
     'Regulatory risk signal shared across verified federation members.');

  insert into public.organization_companion_federation_knowledge (
    organization_id, knowledge_key, knowledge_title, knowledge_type, industry, governance_status, summary
  ) values
    (p_org_id, 'know_hosp_playbook', 'Hospitality Best Practices Playbook', 'playbook', 'hospitality', 'approved',
     'Governance-controlled hospitality best practices.'),
    (p_org_id, 'know_warehouse_safety', 'Warehouse Safety Standards', 'procedure', 'logistics', 'approved',
     'Industry safety procedures — federation knowledge share.'),
    (p_org_id, 'know_cs_benchmark', 'Customer Success Benchmarks', 'benchmark', 'general', 'approved',
     'Anonymized customer success benchmarks for federation members.');

  insert into public.organization_companion_federation_research (
    organization_id, research_key, research_title, research_status, participating_orgs_count, summary
  ) values
    (p_org_id, 'res_hospitality_2026', '2026 Hospitality Industry Study', 'active', 8,
     'Industry study — aggregated insights with Companion analysis and recommendations.'),
    (p_org_id, 'res_retail_trends', 'Retail Trend Analysis', 'aggregating', 5,
     'Participating organizations contributing anonymized trend data.');

  insert into public.organization_companion_federation_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_federations', 'Active Federations', 2, 'federation'),
    (p_org_id, 'metric_intelligence', 'Shared Intelligence Items', 4, 'intelligence'),
    (p_org_id, 'metric_benchmarks', 'Benchmark Comparisons', 3, 'benchmark'),
    (p_org_id, 'metric_risk_signals', 'Active Risk Signals', 3, 'risk');
end; $$;

create or replace function public.get_organization_companion_federation_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_federations jsonb; v_networks jsonb;
  v_trust jsonb; v_intelligence jsonb; v_workspaces jsonb; v_governance jsonb;
  v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb;
begin
  v_org_id := public._cmf565_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmf565_ensure_settings(v_org_id);
  perform public._cmf565_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'active_federations', (select count(*) from public.organization_companion_federation_registry where organization_id = v_org_id and federation_status = 'active'),
    'federation_networks', (select count(*) from public.organization_companion_federation_networks where organization_id = v_org_id and network_status = 'active'),
    'trust_relationships', (select count(*) from public.organization_companion_federation_trust_relationships where organization_id = v_org_id and trust_status in ('verified', 'active')),
    'shared_intelligence', (select count(*) from public.organization_companion_federation_shared_intelligence where organization_id = v_org_id and intelligence_status = 'active'),
    'federated_workspaces', (select count(*) from public.organization_companion_federation_workspaces where organization_id = v_org_id and workspace_status = 'active'),
    'trust_reviews_required', (select count(*) from public.organization_companion_federation_registry where organization_id = v_org_id and trust_status = 'review_required')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'federation_key', f.federation_key, 'federation_name', f.federation_name,
    'federation_type', f.federation_type, 'federation_status', f.federation_status,
    'trust_status', f.trust_status, 'region', f.region, 'industry', f.industry,
    'participating_orgs_count', f.participating_orgs_count, 'description', f.description
  ) order by f.federation_name), '[]'::jsonb)
  into v_federations from public.organization_companion_federation_registry f where f.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'network_key', n.network_key, 'network_name', n.network_name, 'federation_key', n.federation_key,
    'network_type', n.network_type, 'network_status', n.network_status, 'summary', n.summary
  ) order by n.network_name), '[]'::jsonb)
  into v_networks from public.organization_companion_federation_networks n where n.organization_id = v_org_id;

  select jsonb_build_object(
    'relationships', coalesce((
      select jsonb_agg(jsonb_build_object(
        'trust_key', t.trust_key, 'partner_org_name', t.partner_org_name,
        'verification_type', t.verification_type, 'trust_status', t.trust_status, 'summary', t.summary
      ) order by t.verification_type)
      from public.organization_companion_federation_trust_relationships t where t.organization_id = v_org_id
    ), '[]'::jsonb),
    'trust_center_integration', jsonb_build_object('phase', '551', 'route', '/app/settings/security'),
    'requirements', jsonb_build_array(
      'Organization Verification', 'Partner Verification', 'Compliance Verification',
      'Security Verification', 'Federation Agreement'
    )
  ) into v_trust;

  select coalesce(jsonb_agg(jsonb_build_object(
    'intelligence_key', i.intelligence_key, 'intelligence_title', i.intelligence_title,
    'intelligence_type', i.intelligence_type, 'intelligence_status', i.intelligence_status,
    'is_aggregated', i.is_aggregated, 'summary', i.summary
  ) order by i.intelligence_title), '[]'::jsonb)
  into v_intelligence from public.organization_companion_federation_shared_intelligence i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'workspace_key', w.workspace_key, 'workspace_title', w.workspace_title,
    'workspace_type', w.workspace_type, 'workspace_status', w.workspace_status,
    'federation_key', w.federation_key, 'summary', w.summary
  ) order by w.workspace_title), '[]'::jsonb)
  into v_workspaces from public.organization_companion_federation_workspaces w where w.organization_id = v_org_id;

  select jsonb_build_object(
    'rules', jsonb_build_array(
      'Customer ownership remains unchanged',
      'Organizations remain independent',
      'Data sharing requires approval',
      'Private data never exposed',
      'Audit logging mandatory',
      'Trust verification mandatory'
    ),
    'aggregated_only', true,
    'pending_reviews', coalesce((
      select jsonb_agg(jsonb_build_object(
        'federation_name', f.federation_name, 'trust_status', f.trust_status, 'federation_status', f.federation_status
      ))
      from public.organization_companion_federation_registry f
      where f.organization_id = v_org_id and f.trust_status = 'review_required'
    ), '[]'::jsonb)
  ) into v_governance;

  select jsonb_build_object(
    'benchmarks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'benchmark_key', b.benchmark_key, 'benchmark_title', b.benchmark_title,
        'benchmark_category', b.benchmark_category, 'org_value', b.org_value,
        'industry_average', b.industry_average, 'variance_pct', b.variance_pct,
        'is_anonymized', b.is_anonymized, 'summary', b.summary
      ) order by b.benchmark_category)
      from public.organization_companion_federation_benchmarks b where b.organization_id = v_org_id
    ), '[]'::jsonb),
    'industry_observatory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'trend_key', o.trend_key, 'trend_title', o.trend_title, 'industry', o.industry,
        'trend_type', o.trend_type, 'trend_status', o.trend_status, 'summary', o.summary
      ) order by o.trend_title)
      from public.organization_companion_federation_industry_observatory o where o.organization_id = v_org_id
    ), '[]'::jsonb),
    'risk_signals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'risk_key', r.risk_key, 'risk_title', r.risk_title, 'risk_category', r.risk_category,
        'risk_level', r.risk_level, 'risk_status', r.risk_status, 'summary', r.summary
      ) order by r.risk_level desc)
      from public.organization_companion_federation_risk_signals r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review Retail Intelligence Council trust status', 'reason', 'Trust review required before full federation participation'),
      jsonb_build_object('title', 'Explore hospitality occupancy trends', 'reason', 'New aggregated intelligence available'),
      jsonb_build_object('title', 'Monitor supply chain disruption signal', 'reason', 'Elevated risk signal from logistics federation')
    )
  ) into v_reports;

  select jsonb_build_object(
    'federation_activity', (select count(*) from public.organization_companion_federation_registry where organization_id = v_org_id and federation_status = 'active'),
    'industry_trends', (select count(*) from public.organization_companion_federation_industry_observatory where organization_id = v_org_id),
    'benchmark_results', (select count(*) from public.organization_companion_federation_benchmarks where organization_id = v_org_id),
    'risk_signals', (select count(*) from public.organization_companion_federation_risk_signals where organization_id = v_org_id and risk_status = 'active'),
    'shared_intelligence', (select count(*) from public.organization_companion_federation_shared_intelligence where organization_id = v_org_id and intelligence_status = 'active'),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'federation_types', jsonb_build_array(
      'industry', 'partner', 'supply_chain', 'enterprise', 'regional', 'government', 'private', 'custom'
    ),
    'federation_advisor_prompts', jsonb_build_array(
      'What trends are emerging?', 'How do we compare to industry averages?',
      'What risks are growing across the market?', 'What opportunities are appearing?'
    ),
    'knowledge_federation', coalesce((
      select jsonb_agg(jsonb_build_object(
        'knowledge_key', k.knowledge_key, 'knowledge_title', k.knowledge_title,
        'knowledge_type', k.knowledge_type, 'industry', k.industry,
        'governance_status', k.governance_status, 'summary', k.summary
      ) order by k.knowledge_title)
      from public.organization_companion_federation_knowledge k where k.organization_id = v_org_id
    ), '[]'::jsonb),
    'research_network', coalesce((
      select jsonb_agg(jsonb_build_object(
        'research_key', r.research_key, 'research_title', r.research_title,
        'research_status', r.research_status, 'participating_orgs_count', r.participating_orgs_count,
        'summary', r.summary
      ) order by r.research_title)
      from public.organization_companion_federation_research r where r.organization_id = v_org_id
    ), '[]'::jsonb),
    'growth_partner_federation', jsonb_build_object(
      'enabled', true,
      'note', 'Regional networks, partner collaboration, and industry programs — partner governance enforced.',
      'route', '/app/growth-partner-operations'
    ),
    'business_pack_federation', jsonb_build_object(
      'finance_pack', 'Financial benchmarks',
      'support_pack', 'Support metrics',
      'warehouse_pack', 'Inventory benchmarks',
      'route', '/app/settings/modules'
    ),
    'enterprise_network_integration', jsonb_build_object('phase', '564', 'route', '/app/network'),
    'marketplace_integration', jsonb_build_object('route', '/app/companion/marketplace')
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_federation_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Organizations may collaborate, share, and coordinate — but always remain independent.',
    'philosophy', 'Collective intelligence without sacrificing independence, privacy, or ownership. Aggregated and governed intelligence only.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'federations', v_federations,
    'networks', v_networks,
    'organizations', v_federations,
    'trust_relationships', v_trust,
    'shared_intelligence', v_intelligence,
    'workspaces', v_workspaces,
    'governance', v_governance,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'federation', '/app/federation',
      'workspaces', '/app/federation/workspaces',
      'network', '/app/network',
      'trust_center', '/app/settings/security'
    ),
    'notifications', jsonb_build_object(
      'new_industry_trend', true, 'risk_signal_received', true, 'benchmark_updated', true,
      'federation_invitation', true, 'research_initiative_started', true, 'trust_status_changed', true
    ),
    'mobile_access', jsonb_build_object(
      'review_federation_data', true, 'review_benchmarks', true, 'review_industry_trends', true,
      'review_shared_intelligence', true, 'review_risks', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_federation_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_federation_key text := coalesce(p_payload->>'federation_key', '');
  v_trust_key text := coalesce(p_payload->>'trust_key', '');
  v_workspace_key text := coalesce(p_payload->>'workspace_key', '');
  v_intelligence_key text := coalesce(p_payload->>'intelligence_key', '');
  v_risk_key text := coalesce(p_payload->>'risk_key', '');
  v_fed record;
begin
  v_org_id := public._cmf565_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'join_federation' and v_federation_key <> '' then
    select * into v_fed from public.organization_companion_federation_registry
    where organization_id = v_org_id and federation_key = v_federation_key limit 1;
    if v_fed is null then raise exception 'Federation not found'; end if;
    update public.organization_companion_federation_registry
    set federation_status = 'active', trust_status = 'verified', participating_orgs_count = participating_orgs_count + 1
    where organization_id = v_org_id and federation_key = v_federation_key;
    perform public._cmf565_log(v_org_id, 'federation_joined', 'Organization joined federation', p_payload, 'federation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_trust' and v_trust_key <> '' then
    update public.organization_companion_federation_trust_relationships
    set trust_status = 'verified' where organization_id = v_org_id and trust_key = v_trust_key;
    perform public._cmf565_log(v_org_id, 'trust_status_updated', 'Trust relationship approved', p_payload, 'trust');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_workspace' then
    insert into public.organization_companion_federation_workspaces (
      organization_id, workspace_key, workspace_title, workspace_type, workspace_status,
      federation_key, summary
    ) values (
      v_org_id, 'fws_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'workspace_title', 'New Federated Workspace'),
      coalesce(p_payload->>'workspace_type', 'joint_project'), 'pending',
      coalesce(p_payload->>'federation_key', ''),
      coalesce(p_payload->>'summary', 'Federated workspace created — governance review may be required.')
    );
    perform public._cmf565_log(v_org_id, 'workspace_created', 'Federated workspace created', p_payload, 'workspace');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'share_intelligence' and v_intelligence_key <> '' then
    update public.organization_companion_federation_shared_intelligence
    set intelligence_status = 'active' where organization_id = v_org_id and intelligence_key = v_intelligence_key;
    perform public._cmf565_log(v_org_id, 'trend_shared', 'Shared intelligence published', p_payload, 'intelligence');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'publish_risk_signal' and v_risk_key <> '' then
    update public.organization_companion_federation_risk_signals
    set risk_status = 'active' where organization_id = v_org_id and risk_key = v_risk_key;
    perform public._cmf565_log(v_org_id, 'risk_signal_published', 'Risk signal published to federation', p_payload, 'risk');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'start_research' then
    insert into public.organization_companion_federation_research (
      organization_id, research_key, research_title, research_status, participating_orgs_count, summary
    ) values (
      v_org_id, 'res_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'research_title', 'New Research Initiative'),
      'pending', 1,
      coalesce(p_payload->>'summary', 'Research initiative started — aggregated insights only.')
    );
    perform public._cmf565_log(v_org_id, 'research_initiative_started', 'Research initiative started', p_payload, 'research');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_federation' then
    perform public._cmf565_log(v_org_id, 'federation_refreshed', 'Federation center refreshed', p_payload, 'federation');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_federation_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmf565_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_federation_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/federation');
end; $$;

create or replace function public.get_assistant_companion_federation_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmf565_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion becomes an industry intelligence advisor — aggregated and governed intelligence only.',
    'advisor_prompts', jsonb_build_array(
      'What trends are emerging?', 'How do we compare to industry averages?',
      'What risks are growing across the market?', 'What opportunities are appearing?'
    ),
    'active_federations', (select count(*) from public.organization_companion_federation_registry where organization_id = v_org_id and federation_status = 'active'),
    'shared_intelligence', (select count(*) from public.organization_companion_federation_shared_intelligence where organization_id = v_org_id and intelligence_status = 'active'),
    'risk_signals', (select count(*) from public.organization_companion_federation_risk_signals where organization_id = v_org_id and risk_status = 'active'),
    'route', '/app/federation'
  );
end; $$;

grant execute on function public.get_organization_companion_federation_center(text) to authenticated;
grant execute on function public.perform_organization_companion_federation_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_federation_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_federation_advisor_context() to authenticated;
