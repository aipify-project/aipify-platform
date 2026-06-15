-- Phase Airbnb 06 — Aipify Hosts Property Acquisition & Expansion Intelligence Engine
-- Feature owner: CUSTOMER APP. Helpers: _ahostexp_* (engine), _ahostbp369_* (blueprint)

create table if not exists public.aipify_hosts_expansion_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  enabled boolean not null default true,
  enterprise_oversight boolean not null default false,
  metadata jsonb not null default '{"metadata_only":true,"recommendations_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.aipify_hosts_expansion_settings enable row level security;
revoke all on public.aipify_hosts_expansion_settings from authenticated, anon;

create table if not exists public.aipify_hosts_expansion_evaluations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  evaluation_key text not null,
  evaluation_type text not null check (evaluation_type in (
    'property_opportunity', 'market_entry', 'portfolio_optimization', 'scenario_simulation'
  )),
  opportunity_score numeric(5,2) default 0,
  status text not null default 'draft' check (status in ('draft', 'review', 'approved', 'archived')),
  summary text,
  metadata jsonb not null default '{"metadata_only":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, evaluation_key)
);
create index if not exists aipify_hosts_expansion_evaluations_tenant_idx
  on public.aipify_hosts_expansion_evaluations (tenant_id, status);
alter table public.aipify_hosts_expansion_evaluations enable row level security;
revoke all on public.aipify_hosts_expansion_evaluations from authenticated, anon;

create or replace function public._ahostexp_ensure_settings(p_tenant_id uuid)
returns public.aipify_hosts_expansion_settings language plpgsql security definer set search_path = public as $$
declare v_settings public.aipify_hosts_expansion_settings;
begin
  insert into public.aipify_hosts_expansion_settings (tenant_id, enabled)
  values (p_tenant_id, true) on conflict (tenant_id) do nothing;
  select * into v_settings from public.aipify_hosts_expansion_settings where tenant_id = p_tenant_id;
  return v_settings;
end; $$;

create or replace function public._ahostexp_log_audit(
  p_tenant_id uuid, p_action_type text, p_summary text default null, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
begin
  return public._ahost_log_audit(p_tenant_id, 'expansion_intelligence_' || p_action_type, p_summary, p_context);
end; $$;

create or replace function public._ahostbp369_positioning() returns text language sql immutable as $$
  select 'Know which property to buy before you buy it.'; $$;

create or replace function public._ahostbp369_modules() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'property_opportunity_scanner', 'label', 'Property Opportunity Scanner', 'description', 'Market attractiveness, demand analysis, tourism trends, occupancy benchmarking.'),
    jsonb_build_object('key', 'property_evaluation_engine', 'label', 'Property Evaluation Engine', 'description', 'Occupancy potential, revenue opportunities, competition, seasonality, risk indicators.'),
    jsonb_build_object('key', 'market_intelligence_center', 'label', 'Market Intelligence Center', 'description', 'Destination popularity, emerging markets, event-driven demand signals.'),
    jsonb_build_object('key', 'portfolio_performance_engine', 'label', 'Portfolio Performance Engine', 'description', 'Revenue, satisfaction, occupancy, incidents, maintenance, Property Health Scores.'),
    jsonb_build_object('key', 'expansion_readiness_score', 'label', 'Expansion Readiness Score', 'description', 'Operational maturity, team capacity, financial stability, governance readiness.'),
    jsonb_build_object('key', 'scenario_simulation_lab', 'label', 'Scenario Simulation Lab', 'description', 'What-if planning — portfolio growth, occupancy shifts, staffing cost changes.'),
    jsonb_build_object('key', 'competitive_positioning_engine', 'label', 'Competitive Positioning Engine', 'description', 'Benchmark performance, differentiators, improvement opportunities.'),
    jsonb_build_object('key', 'executive_growth_dashboard', 'label', 'Executive Growth Dashboard', 'description', 'Portfolio growth trends, opportunity rankings, long-term forecasts.'),
    jsonb_build_object('key', 'investment_decision_playbooks', 'label', 'Investment Decision Playbooks', 'description', 'New property review, market entry, portfolio optimization playbooks.'),
    jsonb_build_object('key', 'hospitality_strategic_knowledge', 'label', 'Hospitality Strategic Knowledge Center', 'description', 'Growth strategies, investment principles, sustainable expansion guidance.')
  ); $$;

create or replace function public._ahostbp369_playbooks() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'new_property_review', 'label', 'New Property Review', 'steps', jsonb_build_array('Market assessment', 'Operational review', 'Financial review', 'Governance considerations')),
    jsonb_build_object('key', 'new_market_entry', 'label', 'New Market Entry', 'steps', jsonb_build_array('Regulatory review', 'Demand evaluation', 'Risk assessment', 'Team readiness')),
    jsonb_build_object('key', 'portfolio_optimization', 'label', 'Portfolio Optimization', 'steps', jsonb_build_array('Performance comparison', 'Improvement prioritization', 'Strategic recommendations'))
  ); $$;

create or replace function public._ahostbp369_simulation_examples() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'What happens if we add five properties?',
    'What happens if occupancy declines by 15%?',
    'What happens if staffing costs increase?'
  ); $$;

create or replace function public._ahostbp369_governance() returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Recommendations only. Final investment decisions remain human-controlled. Transparent scoring methodologies. Enterprise oversight for multi-property organizations.',
    'approval_required', true,
    'audit_required', true,
    'recommendations_only', true
  ); $$;

create or replace function public._ahostbp369_success_metrics() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'decisions', 'label', 'Better expansion decisions'),
    jsonb_build_object('key', 'risk', 'label', 'Reduced investment risk'),
    jsonb_build_object('key', 'quality', 'label', 'Increased portfolio quality'),
    jsonb_build_object('key', 'confidence', 'label', 'Improved strategic confidence'),
    jsonb_build_object('key', 'growth', 'label', 'More sustainable business growth')
  ); $$;

create or replace function public._ahostbp369_knowledge_categories() returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Growth strategies', 'Hospitality investment principles', 'Market evaluation frameworks',
    'Portfolio management guidance', 'Sustainable expansion practices'
  ); $$;

create or replace function public._ahostexp_growth_snapshot(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then jsonb_build_object(
    'expansion_readiness_score', 0,
    'opportunity_score', 0,
    'portfolio_quality_index', 0,
    'markets_on_watchlist', 0,
    'underperforming_properties', 0
  ) else jsonb_build_object(
    'expansion_readiness_score', least(92, 58 + p_property_count * 4),
    'opportunity_score', least(88, 62 + p_property_count * 3),
    'portfolio_quality_index', least(90, 70 + p_property_count * 2),
    'markets_on_watchlist', greatest(1, p_property_count),
    'underperforming_properties', case when p_property_count >= 3 then 1 else 0 end
  ) end; $$;

create or replace function public._ahostexp_opportunities(p_property_count int)
returns jsonb language sql immutable as $$
  select case when p_property_count = 0 then '[]'::jsonb else jsonb_build_array(
    jsonb_build_object('key', 'bergen_coastal', 'label', 'Bergen coastal district — high seasonal demand', 'score', 84, 'type', 'market'),
    jsonb_build_object('key', 'property_7', 'label', 'Property candidate — strong occupancy potential', 'score', 78, 'type', 'property'),
    jsonb_build_object('key', 'portfolio_improve', 'label', 'Property 4 — optimization priority (maintenance burden)', 'score', 72, 'type', 'optimization')
  ) end; $$;

create or replace function public.get_aipify_hosts_expansion_intelligence_card(p_org_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_exp public.aipify_hosts_expansion_settings;
  v_props int;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_tenant_for_auth());
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_exp := public._ahostexp_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_exp.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', greatest(v_hosts.property_count, v_props),
    'human_oversight_required', true,
    'positioning', public._ahostbp369_positioning(),
    'route', '/app/aipify-hosts/expansion-intelligence'
  );
end; $$;

create or replace function public.get_aipify_hosts_expansion_intelligence_dashboard(p_org_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_hosts public.aipify_hosts_settings;
  v_exp public.aipify_hosts_expansion_settings;
  v_props int;
  v_prop_count int;
  v_snapshot jsonb;
begin
  v_tenant_id := coalesce(p_org_id, public._ahost_require_tenant());
  v_hosts := public._ahost_ensure_settings(v_tenant_id);
  v_exp := public._ahostexp_ensure_settings(v_tenant_id);
  select count(*) into v_props from public.aipify_hosts_properties where tenant_id = v_tenant_id and status = 'active';
  v_prop_count := greatest(v_hosts.property_count, v_props);
  v_snapshot := public._ahostexp_growth_snapshot(v_prop_count);
  perform public._ahostexp_log_audit(v_tenant_id, 'dashboard_view', 'Expansion intelligence dashboard viewed', jsonb_build_object('package', v_hosts.package_key));
  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_exp.enabled and v_hosts.enabled,
    'package_key', v_hosts.package_key,
    'property_count', v_prop_count,
    'human_oversight_required', true,
    'positioning', public._ahostbp369_positioning(),
    'vision', 'How do we grow wisely? Aipify Hosts empowers growth through intelligence — not intuition alone.',
    'modules', public._ahostbp369_modules(),
    'playbooks', public._ahostbp369_playbooks(),
    'simulation_examples', public._ahostbp369_simulation_examples(),
    'governance', public._ahostbp369_governance(),
    'success_metrics', public._ahostbp369_success_metrics(),
    'knowledge_categories', public._ahostbp369_knowledge_categories(),
    'growth_snapshot', v_snapshot,
    'opportunities', public._ahostexp_opportunities(v_prop_count),
    'executive_questions', jsonb_build_array(
      'Which property should I acquire next?',
      'Which existing property should I improve?',
      'Which markets should I enter?',
      'Should we expand into this region?'
    ),
    'executive_metrics', jsonb_build_array(
      jsonb_build_object('key', 'expansion_readiness', 'label', 'Expansion Readiness Score', 'value', v_snapshot->>'expansion_readiness_score'),
      jsonb_build_object('key', 'opportunity_score', 'label', 'Top opportunity score', 'value', v_snapshot->>'opportunity_score'),
      jsonb_build_object('key', 'portfolio_quality', 'label', 'Portfolio quality index', 'value', v_snapshot->>'portfolio_quality_index'),
      jsonb_build_object('key', 'watchlist', 'label', 'Markets on watchlist', 'value', v_snapshot->>'markets_on_watchlist')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase Airbnb 06 — Property Acquisition & Expansion Intelligence',
      'doc', 'aipify-hosts/PHASE_AIRBNB_06_EXPANSION_INTELLIGENCE.text',
      'route', '/app/aipify-hosts/expansion-intelligence'
    )
  );
end; $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'aipify-hosts-expansion-intelligence', 'Aipify Hosts Expansion Intelligence', 'Property acquisition, market evaluation, portfolio growth, and strategic expansion.', 'authenticated', 222
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'aipify-hosts-expansion-intelligence' and tenant_id is null);

grant execute on function public.get_aipify_hosts_expansion_intelligence_card(uuid) to authenticated;
grant execute on function public.get_aipify_hosts_expansion_intelligence_dashboard(uuid) to authenticated;
