-- Phase 566 — Autonomous Organization, Strategic Planning & Future Readiness Engine
-- Feature owner: CUSTOMER APP
-- Routes: /app/future-readiness, /app/future-readiness/planning, /app/future-readiness/roadmaps
-- Helpers: _cmfr566_*

create table if not exists public.organization_future_readiness_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  future_readiness_enabled boolean not null default true,
  strategic_planning_enabled boolean not null default true,
  scenario_planning_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_future_readiness_settings enable row level security;
revoke all on public.organization_future_readiness_settings from authenticated, anon;

create table if not exists public.organization_future_readiness_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_key text not null,
  plan_title text not null,
  vision text not null default '' check (char_length(vision) <= 500),
  strategic_horizon text not null default '1_3_years' check (
    strategic_horizon in ('0_12_months', '1_3_years', '3_5_years', '5_10_years')
  ),
  horizon_label text not null default 'Growth Horizon',
  plan_status text not null default 'active' check (
    plan_status in ('draft', 'active', 'review_required', 'archived')
  ),
  objectives jsonb not null default '[]'::jsonb,
  strategic_themes jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, plan_key)
);

alter table public.organization_future_readiness_plans enable row level security;
revoke all on public.organization_future_readiness_plans from authenticated, anon;

create table if not exists public.organization_future_readiness_initiatives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  initiative_key text not null,
  initiative_name text not null,
  owner_name text not null default '',
  initiative_status text not null default 'active' check (
    initiative_status in ('planned', 'active', 'delayed', 'completed', 'on_hold')
  ),
  priority text not null default 'medium' check (
    priority in ('critical', 'high', 'medium', 'low')
  ),
  budget_estimate numeric(14,2) not null default 0,
  expected_outcome text not null default '' check (char_length(expected_outcome) <= 500),
  dependencies jsonb not null default '[]'::jsonb,
  strategic_horizon text not null default '0_12_months',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, initiative_key)
);

alter table public.organization_future_readiness_initiatives enable row level security;
revoke all on public.organization_future_readiness_initiatives from authenticated, anon;

create table if not exists public.organization_future_readiness_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  scenario_type text not null check (
    scenario_type in (
      'economic_downturn', 'rapid_growth', 'new_competitor', 'new_regulation',
      'market_expansion', 'technology_shift', 'custom'
    )
  ),
  scenario_status text not null default 'active' check (
    scenario_status in ('draft', 'active', 'monitoring', 'archived')
  ),
  digital_twin_linked boolean not null default true,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, scenario_key)
);

alter table public.organization_future_readiness_scenarios enable row level security;
revoke all on public.organization_future_readiness_scenarios from authenticated, anon;

create table if not exists public.organization_future_readiness_roadmaps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  roadmap_key text not null,
  roadmap_title text not null,
  roadmap_status text not null default 'active' check (
    roadmap_status in ('draft', 'active', 'review_required', 'archived')
  ),
  milestones jsonb not null default '[]'::jsonb,
  dependencies jsonb not null default '[]'::jsonb,
  resource_allocation jsonb not null default '{}'::jsonb,
  forecast_summary text not null default '' check (char_length(forecast_summary) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, roadmap_key)
);

alter table public.organization_future_readiness_roadmaps enable row level security;
revoke all on public.organization_future_readiness_roadmaps from authenticated, anon;

create table if not exists public.organization_future_readiness_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'growth', 'expansion', 'market', 'efficiency', 'innovation', 'custom'
    )
  ),
  opportunity_status text not null default 'identified' check (
    opportunity_status in ('identified', 'evaluating', 'approved', 'in_progress', 'realized')
  ),
  priority_score numeric(5,2) not null default 50,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_future_readiness_opportunities enable row level security;
revoke all on public.organization_future_readiness_opportunities from authenticated, anon;

create table if not exists public.organization_future_readiness_threats (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  threat_key text not null,
  threat_title text not null,
  threat_category text not null check (
    threat_category in (
      'market', 'operational', 'technology', 'regulatory', 'competitive', 'talent', 'custom'
    )
  ),
  threat_level text not null default 'moderate' check (
    threat_level in ('low', 'moderate', 'elevated', 'high', 'critical')
  ),
  threat_status text not null default 'active' check (
    threat_status in ('identified', 'monitoring', 'escalated', 'mitigated', 'resolved')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, threat_key)
);

alter table public.organization_future_readiness_threats enable row level security;
revoke all on public.organization_future_readiness_threats from authenticated, anon;

create table if not exists public.organization_future_readiness_transformations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  transformation_key text not null,
  transformation_title text not null,
  transformation_type text not null check (
    transformation_type in (
      'acquisition', 'merger', 'reorganization', 'international_expansion',
      'digital_transformation', 'custom'
    )
  ),
  transformation_status text not null default 'planned' check (
    transformation_status in ('planned', 'active', 'review_required', 'completed', 'on_hold')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, transformation_key)
);

alter table public.organization_future_readiness_transformations enable row level security;
revoke all on public.organization_future_readiness_transformations from authenticated, anon;

create table if not exists public.organization_future_readiness_innovations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  innovation_key text not null,
  innovation_title text not null,
  innovation_source text not null default 'companion' check (
    innovation_source in ('employee', 'companion', 'partner', 'customer', 'custom')
  ),
  innovation_stage text not null default 'idea' check (
    innovation_stage in ('idea', 'suggestion', 'experiment', 'research', 'validation', 'outcome')
  ),
  innovation_status text not null default 'active' check (
    innovation_status in ('active', 'review_required', 'approved', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, innovation_key)
);

alter table public.organization_future_readiness_innovations enable row level security;
revoke all on public.organization_future_readiness_innovations from authenticated, anon;

create table if not exists public.organization_future_readiness_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  score_key text not null,
  dimension text not null check (
    dimension in (
      'strategic_planning', 'risk_awareness', 'innovation_activity',
      'growth_preparation', 'operational_readiness', 'transformation_readiness'
    )
  ),
  score_value numeric(5,2) not null default 0 check (score_value between 0 and 100),
  readiness_label text not null default 'prepared' check (
    readiness_label in ('future_ready', 'prepared', 'gaps_identified', 'strategic_risk')
  ),
  unique (organization_id, score_key)
);

alter table public.organization_future_readiness_scores enable row level security;
revoke all on public.organization_future_readiness_scores from authenticated, anon;

create table if not exists public.organization_future_readiness_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'readiness' check (
    metric_category in ('readiness', 'planning', 'initiatives', 'innovation', 'growth')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_future_readiness_analytics enable row level security;
revoke all on public.organization_future_readiness_analytics from authenticated, anon;

create table if not exists public.organization_future_readiness_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'readiness' check (
    audit_category in (
      'initiative', 'roadmap', 'scenario', 'opportunity', 'threat',
      'readiness', 'planning', 'transformation', 'innovation'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_future_readiness_audit_logs_org_idx
  on public.organization_future_readiness_audit_logs (organization_id, created_at desc);

alter table public.organization_future_readiness_audit_logs enable row level security;
revoke all on public.organization_future_readiness_audit_logs from authenticated, anon;

create or replace function public._cmfr566_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmfr566_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'readiness'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_future_readiness_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'readiness'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmfr566_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_future_readiness_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmfr566_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_future_readiness_plans where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_future_readiness_plans (
    organization_id, plan_key, plan_title, vision, strategic_horizon, horizon_label,
    plan_status, objectives, strategic_themes, summary
  ) values
    (p_org_id, 'plan_growth_2026', '2026 Growth Strategy', 'Expand sustainably while strengthening operational excellence.',
     '1_3_years', 'Growth Horizon', 'active',
     '["Expand internationally","Increase revenue","Improve customer satisfaction"]'::jsonb,
     '["Market expansion","Product innovation","Operational efficiency"]'::jsonb,
     'Strategic plan connecting vision with execution initiatives.'),
    (p_org_id, 'plan_transform_2028', 'Digital Transformation Roadmap', 'Transform operations for long-term competitiveness.',
     '3_5_years', 'Transformation Horizon', 'active',
     '["Digital transformation","Reduce costs","Launch new product"]'::jsonb,
     '["Technology","Process","People"]'::jsonb,
     'Multi-year transformation aligned with future scenarios.');

  insert into public.organization_future_readiness_initiatives (
    organization_id, initiative_key, initiative_name, owner_name, initiative_status,
    priority, budget_estimate, expected_outcome, dependencies, strategic_horizon, summary
  ) values
    (p_org_id, 'init_market_expansion', 'New Market Expansion', 'Executive Team', 'active', 'high', 250000,
     'Enter Nordic markets with localized operations', '["init_digital_transform"]'::jsonb, '1_3_years',
     'International expansion initiative — Companion tracks progress.'),
    (p_org_id, 'init_digital_transform', 'Digital Transformation', 'COO', 'active', 'critical', 180000,
     'Modernize core operations and customer experience', '[]'::jsonb, '3_5_years',
     'Major transformation project with structured change management.'),
    (p_org_id, 'init_partner_growth', 'Partner Growth Program', 'VP Partnerships', 'delayed', 'medium', 75000,
     'Expand partner network and revenue streams', '[]'::jsonb, '0_12_months',
     'Partner program — behind schedule, review recommended.'),
    (p_org_id, 'init_warehouse', 'Warehouse Expansion', 'Operations Director', 'planned', 'high', 320000,
     'Increase capacity for growth forecast', '["init_market_expansion"]'::jsonb, '1_3_years',
     'Capacity planning linked to market expansion.');

  insert into public.organization_future_readiness_scenarios (
    organization_id, scenario_key, scenario_title, scenario_type, scenario_status, digital_twin_linked, summary
  ) values
    (p_org_id, 'scen_rapid_growth', 'Rapid Growth Scenario', 'rapid_growth', 'active', true,
     'Prepare for accelerated demand — linked to Digital Twin Phase 543.'),
    (p_org_id, 'scen_downturn', 'Economic Downturn Scenario', 'economic_downturn', 'monitoring', true,
     'Cost and resilience planning for economic contraction.'),
    (p_org_id, 'scen_regulation', 'New Regulation Scenario', 'new_regulation', 'active', true,
     'Compliance and operational adjustments for regulatory change.'),
    (p_org_id, 'scen_competitor', 'New Competitor Scenario', 'new_competitor', 'monitoring', true,
     'Competitive response planning before market shift.');

  insert into public.organization_future_readiness_roadmaps (
    organization_id, roadmap_key, roadmap_title, roadmap_status, milestones, dependencies,
    resource_allocation, forecast_summary, summary
  ) values
    (p_org_id, 'roadmap_2026', '2026 Strategic Roadmap', 'active',
     '["Q1: Market research","Q2: Pilot launch","Q3: Scale operations","Q4: Review & optimize"]'::jsonb,
     '["init_market_expansion","init_digital_transform"]'::jsonb,
     '{"engineering":40,"operations":35,"sales":25}'::jsonb,
     'Revenue forecast +18% with phased expansion milestones.',
     'Visualize current initiatives, future milestones, and resource allocation.'),
    (p_org_id, 'roadmap_transform', 'Transformation Roadmap', 'review_required',
     '["Phase 1: Assessment","Phase 2: Core systems","Phase 3: Rollout","Phase 4: Optimization"]'::jsonb,
     '["init_digital_transform"]'::jsonb,
     '{"technology":50,"change_management":30,"training":20}'::jsonb,
     'Multi-year transformation with dependency tracking.',
     'Transformation roadmap — milestone review due.');

  insert into public.organization_future_readiness_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, opportunity_status, priority_score, summary
  ) values
    (p_org_id, 'opp_geo_market', 'New Geographic Market', 'expansion', 'evaluating', 85,
     'Nordic expansion opportunity — high growth potential.'),
    (p_org_id, 'opp_industry_pack', 'New Industry Pack', 'innovation', 'identified', 72,
     'Launch industry-specific Business Pack for hospitality.'),
    (p_org_id, 'opp_partner_program', 'New Partner Program', 'growth', 'approved', 78,
     'Partner revenue stream — approved for Q2 launch.'),
    (p_org_id, 'opp_efficiency', 'Operational Efficiency Gains', 'efficiency', 'in_progress', 65,
     'Process automation opportunity — efficiency gains in progress.');

  insert into public.organization_future_readiness_threats (
    organization_id, threat_key, threat_title, threat_category, threat_level, threat_status, summary
  ) values
    (p_org_id, 'threat_supplier', 'Supplier Risk', 'operational', 'elevated', 'monitoring',
     'Key supplier dependency — diversification recommended.'),
    (p_org_id, 'threat_talent', 'Key Employee Dependency', 'talent', 'moderate', 'identified',
     'Critical role concentration — succession planning needed.'),
    (p_org_id, 'threat_market', 'Market Decline Signal', 'market', 'moderate', 'monitoring',
     'Market softness in core segment — scenario planning active.'),
    (p_org_id, 'threat_cyber', 'Cybersecurity Threat', 'technology', 'high', 'escalated',
     'Elevated cyber risk — threat observatory alert.');

  insert into public.organization_future_readiness_transformations (
    organization_id, transformation_key, transformation_title, transformation_type, transformation_status, summary
  ) values
    (p_org_id, 'trans_digital', 'Digital Transformation Program', 'digital_transformation', 'active',
     'Structured change management for digital transformation.'),
    (p_org_id, 'trans_intl', 'International Expansion', 'international_expansion', 'planned',
     'Planned international expansion with governance checkpoints.');

  insert into public.organization_future_readiness_innovations (
    organization_id, innovation_key, innovation_title, innovation_source, innovation_stage, innovation_status, summary
  ) values
    (p_org_id, 'innov_companion_ai', 'Companion Workflow Automation', 'companion', 'experiment', 'active',
     'Companion suggestion — automate recurring strategic review workflows.'),
    (p_org_id, 'innov_employee_idea', 'Customer Success Playbook v2', 'employee', 'validation', 'review_required',
     'Employee idea — validate before rollout.'),
    (p_org_id, 'innov_partner', 'Partner Co-Innovation Lab', 'partner', 'research', 'approved',
     'Partner suggestion — joint innovation research initiative.');

  insert into public.organization_future_readiness_scores (
    organization_id, score_key, dimension, score_value, readiness_label
  ) values
    (p_org_id, 'score_strategic', 'strategic_planning', 82, 'prepared'),
    (p_org_id, 'score_risk', 'risk_awareness', 76, 'prepared'),
    (p_org_id, 'score_innovation', 'innovation_activity', 68, 'gaps_identified'),
    (p_org_id, 'score_growth', 'growth_preparation', 79, 'prepared'),
    (p_org_id, 'score_operational', 'operational_readiness', 84, 'future_ready'),
    (p_org_id, 'score_transform', 'transformation_readiness', 71, 'gaps_identified');

  insert into public.organization_future_readiness_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_readiness_score', 'Overall Future Readiness Score', 77, 'readiness'),
    (p_org_id, 'metric_active_initiatives', 'Active Initiatives', 2, 'initiatives'),
    (p_org_id, 'metric_opportunities', 'Tracked Opportunities', 4, 'growth'),
    (p_org_id, 'metric_innovations', 'Innovation Pipeline', 3, 'innovation');
end; $$;

create or replace function public.get_organization_future_readiness_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_plans jsonb; v_initiatives jsonb;
  v_scenarios jsonb; v_roadmaps jsonb; v_opportunities jsonb; v_threats jsonb;
  v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb;
  v_scores jsonb; v_avg_score numeric;
begin
  v_org_id := public._cmfr566_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmfr566_ensure_settings(v_org_id);
  perform public._cmfr566_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select round(avg(score_value)::numeric, 0) into v_avg_score
  from public.organization_future_readiness_scores where organization_id = v_org_id;

  select jsonb_build_object(
    'future_readiness_score', coalesce(v_avg_score, 75),
    'active_initiatives', (select count(*) from public.organization_future_readiness_initiatives where organization_id = v_org_id and initiative_status = 'active'),
    'delayed_initiatives', (select count(*) from public.organization_future_readiness_initiatives where organization_id = v_org_id and initiative_status = 'delayed'),
    'active_scenarios', (select count(*) from public.organization_future_readiness_scenarios where organization_id = v_org_id and scenario_status in ('active', 'monitoring')),
    'tracked_opportunities', (select count(*) from public.organization_future_readiness_opportunities where organization_id = v_org_id),
    'escalated_threats', (select count(*) from public.organization_future_readiness_threats where organization_id = v_org_id and threat_status = 'escalated'),
    'active_roadmaps', (select count(*) from public.organization_future_readiness_roadmaps where organization_id = v_org_id and roadmap_status = 'active')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'plan_key', p.plan_key, 'plan_title', p.plan_title, 'vision', p.vision,
    'strategic_horizon', p.strategic_horizon, 'horizon_label', p.horizon_label,
    'plan_status', p.plan_status, 'objectives', p.objectives,
    'strategic_themes', p.strategic_themes, 'summary', p.summary
  ) order by p.plan_title), '[]'::jsonb)
  into v_plans from public.organization_future_readiness_plans p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'initiative_key', i.initiative_key, 'initiative_name', i.initiative_name, 'owner_name', i.owner_name,
    'initiative_status', i.initiative_status, 'priority', i.priority, 'budget_estimate', i.budget_estimate,
    'expected_outcome', i.expected_outcome, 'dependencies', i.dependencies,
    'strategic_horizon', i.strategic_horizon, 'summary', i.summary
  ) order by i.priority desc, i.initiative_name), '[]'::jsonb)
  into v_initiatives from public.organization_future_readiness_initiatives i where i.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'scenario_key', s.scenario_key, 'scenario_title', s.scenario_title,
    'scenario_type', s.scenario_type, 'scenario_status', s.scenario_status,
    'digital_twin_linked', s.digital_twin_linked, 'summary', s.summary
  ) order by s.scenario_title), '[]'::jsonb)
  into v_scenarios from public.organization_future_readiness_scenarios s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'roadmap_key', r.roadmap_key, 'roadmap_title', r.roadmap_title, 'roadmap_status', r.roadmap_status,
    'milestones', r.milestones, 'dependencies', r.dependencies,
    'resource_allocation', r.resource_allocation, 'forecast_summary', r.forecast_summary, 'summary', r.summary
  ) order by r.roadmap_title), '[]'::jsonb)
  into v_roadmaps from public.organization_future_readiness_roadmaps r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
    'opportunity_type', o.opportunity_type, 'opportunity_status', o.opportunity_status,
    'priority_score', o.priority_score, 'summary', o.summary
  ) order by o.priority_score desc), '[]'::jsonb)
  into v_opportunities from public.organization_future_readiness_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'threat_key', t.threat_key, 'threat_title', t.threat_title, 'threat_category', t.threat_category,
    'threat_level', t.threat_level, 'threat_status', t.threat_status, 'summary', t.summary
  ) order by t.threat_level desc), '[]'::jsonb)
  into v_threats from public.organization_future_readiness_threats t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'score_key', s.score_key, 'dimension', s.dimension, 'score_value', s.score_value,
    'readiness_label', s.readiness_label
  ) order by s.score_value desc), '[]'::jsonb)
  into v_scores from public.organization_future_readiness_scores s where s.organization_id = v_org_id;

  select jsonb_build_object(
    'readiness_scores', v_scores,
    'overall_score', coalesce(v_avg_score, 75),
    'strategic_horizons', jsonb_build_array(
      jsonb_build_object('key', '0_12_months', 'label', 'Operational Horizon', 'range', '0–12 Months'),
      jsonb_build_object('key', '1_3_years', 'label', 'Growth Horizon', 'range', '1–3 Years'),
      jsonb_build_object('key', '3_5_years', 'label', 'Transformation Horizon', 'range', '3–5 Years'),
      jsonb_build_object('key', '5_10_years', 'label', 'Future Horizon', 'range', '5–10 Years')
    ),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review Partner Growth Program delay', 'reason', 'Initiative behind schedule — strategic review recommended'),
      jsonb_build_object('title', 'Address cybersecurity threat escalation', 'reason', 'Elevated threat in observatory — mitigation planning needed'),
      jsonb_build_object('title', 'Evaluate Nordic expansion opportunity', 'reason', 'High-priority growth opportunity ready for evaluation')
    ),
    'innovation_pipeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'innovation_key', inn.innovation_key, 'innovation_title', inn.innovation_title,
        'innovation_source', inn.innovation_source, 'innovation_stage', inn.innovation_stage,
        'innovation_status', inn.innovation_status, 'summary', inn.summary
      ) order by inn.innovation_title)
      from public.organization_future_readiness_innovations inn where inn.organization_id = v_org_id
    ), '[]'::jsonb),
    'transformations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'transformation_key', tr.transformation_key, 'transformation_title', tr.transformation_title,
        'transformation_type', tr.transformation_type, 'transformation_status', tr.transformation_status,
        'summary', tr.summary
      ) order by tr.transformation_title)
      from public.organization_future_readiness_transformations tr where tr.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_reports;

  select jsonb_build_object(
    'future_readiness_score', coalesce(v_avg_score, 75),
    'strategic_initiatives', (select count(*) from public.organization_future_readiness_initiatives where organization_id = v_org_id and initiative_status = 'active'),
    'growth_opportunities', (select count(*) from public.organization_future_readiness_opportunities where organization_id = v_org_id and opportunity_status in ('identified', 'evaluating', 'approved')),
    'threat_landscape', (select count(*) from public.organization_future_readiness_threats where organization_id = v_org_id and threat_status in ('identified', 'monitoring', 'escalated')),
    'transformation_status', (select count(*) from public.organization_future_readiness_transformations where organization_id = v_org_id and transformation_status = 'active'),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'strategic_horizon_framework', jsonb_build_array('0–12 Months', '1–3 Years', '3–5 Years', '5–10 Years'),
    'strategic_advisor_prompts', jsonb_build_array(
      'What should we focus on next year?', 'What risks threaten our growth?',
      'What opportunities exist?', 'What initiatives are behind schedule?', 'Generate strategic briefing.'
    ),
    'digital_twin_integration', jsonb_build_object('phase', '543', 'route', '/app/business-digital-twin'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Financial forecasts',
      'support_pack', 'Customer trends',
      'partner_pack', 'Growth opportunities',
      'warehouse_pack', 'Capacity planning',
      'route', '/app/settings/modules'
    ),
    'federation_integration', jsonb_build_object('phase', '565', 'route', '/app/federation'),
    'executive_planning_workspace', jsonb_build_object(
      'objectives', (select count(*) from public.organization_future_readiness_plans where organization_id = v_org_id),
      'initiatives', (select count(*) from public.organization_future_readiness_initiatives where organization_id = v_org_id),
      'forecasts', (select count(*) from public.organization_future_readiness_roadmaps where organization_id = v_org_id)
    )
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_future_readiness_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Most companies focus on today — successful companies prepare for tomorrow.',
    'philosophy', 'Companion helps organizations think ahead — connect strategy with execution, prepare before change occurs.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'planning', v_plans,
    'strategic_planning', v_plans,
    'initiatives', v_initiatives,
    'scenarios', v_scenarios,
    'roadmaps', v_roadmaps,
    'opportunities', v_opportunities,
    'threats', v_threats,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'readiness_scores', v_scores,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'future_readiness', '/app/future-readiness',
      'planning', '/app/future-readiness/planning',
      'roadmaps', '/app/future-readiness/roadmaps',
      'federation', '/app/federation',
      'digital_twin', '/app/business-digital-twin'
    ),
    'notifications', jsonb_build_object(
      'initiative_delayed', true, 'new_opportunity_detected', true, 'threat_escalated', true,
      'roadmap_milestone_due', true, 'readiness_review_required', true
    ),
    'mobile_access', jsonb_build_object(
      'review_strategy', true, 'review_roadmaps', true, 'review_opportunities', true,
      'review_risks', true, 'review_initiatives', true
    )
  );
end; $$;

create or replace function public.perform_organization_future_readiness_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_initiative_key text := coalesce(p_payload->>'initiative_key', '');
  v_roadmap_key text := coalesce(p_payload->>'roadmap_key', '');
  v_opportunity_key text := coalesce(p_payload->>'opportunity_key', '');
  v_threat_key text := coalesce(p_payload->>'threat_key', '');
  v_scenario_key text := coalesce(p_payload->>'scenario_key', '');
begin
  v_org_id := public._cmfr566_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'create_initiative' then
    insert into public.organization_future_readiness_initiatives (
      organization_id, initiative_key, initiative_name, owner_name, initiative_status,
      priority, expected_outcome, strategic_horizon, summary
    ) values (
      v_org_id, 'init_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'initiative_name', 'New Strategic Initiative'),
      coalesce(p_payload->>'owner_name', 'Unassigned'), 'planned',
      coalesce(p_payload->>'priority', 'medium'),
      coalesce(p_payload->>'expected_outcome', ''),
      coalesce(p_payload->>'strategic_horizon', '0_12_months'),
      coalesce(p_payload->>'summary', 'Strategic initiative created — Companion will track progress.')
    );
    perform public._cmfr566_log(v_org_id, 'initiative_created', 'Strategic initiative created', p_payload, 'initiative');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'update_roadmap' and v_roadmap_key <> '' then
    update public.organization_future_readiness_roadmaps
    set roadmap_status = 'active'
    where organization_id = v_org_id and roadmap_key = v_roadmap_key;
    perform public._cmfr566_log(v_org_id, 'roadmap_updated', 'Roadmap updated', p_payload, 'roadmap');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_opportunity' then
    insert into public.organization_future_readiness_opportunities (
      organization_id, opportunity_key, opportunity_title, opportunity_type, opportunity_status, priority_score, summary
    ) values (
      v_org_id, 'opp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'opportunity_title', 'New Opportunity'),
      coalesce(p_payload->>'opportunity_type', 'growth'), 'identified',
      coalesce((p_payload->>'priority_score')::numeric, 50),
      coalesce(p_payload->>'summary', 'Growth opportunity identified.')
    );
    perform public._cmfr566_log(v_org_id, 'opportunity_added', 'Opportunity added to portfolio', p_payload, 'opportunity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_threat' then
    insert into public.organization_future_readiness_threats (
      organization_id, threat_key, threat_title, threat_category, threat_level, threat_status, summary
    ) values (
      v_org_id, 'threat_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'threat_title', 'New Threat'),
      coalesce(p_payload->>'threat_category', 'operational'),
      coalesce(p_payload->>'threat_level', 'moderate'), 'identified',
      coalesce(p_payload->>'summary', 'Threat identified in observatory.')
    );
    perform public._cmfr566_log(v_org_id, 'threat_identified', 'Threat identified', p_payload, 'threat');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_scenario' and v_scenario_key <> '' then
    update public.organization_future_readiness_scenarios
    set scenario_status = 'active' where organization_id = v_org_id and scenario_key = v_scenario_key;
    perform public._cmfr566_log(v_org_id, 'scenario_generated', 'Future scenario activated', p_payload, 'scenario');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'complete_strategic_review' then
    update public.organization_future_readiness_scores
    set score_value = least(score_value + 2, 100)
    where organization_id = v_org_id;
    perform public._cmfr566_log(v_org_id, 'strategic_review_completed', 'Strategic review completed', p_payload, 'planning');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_readiness' then
    perform public._cmfr566_log(v_org_id, 'readiness_refreshed', 'Future readiness center refreshed', p_payload, 'readiness');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_future_readiness_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmfr566_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_future_readiness_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/future-readiness');
end; $$;

create or replace function public.get_assistant_companion_future_readiness_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_avg_score numeric;
begin
  v_org_id := public._cmfr566_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  select round(avg(score_value)::numeric, 0) into v_avg_score
  from public.organization_future_readiness_scores where organization_id = v_org_id;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion becomes a strategic planning partner — help leaders see further, plan better, execute with confidence.',
    'advisor_prompts', jsonb_build_array(
      'What should we focus on next year?', 'What risks threaten our growth?',
      'What opportunities exist?', 'What initiatives are behind schedule?', 'Generate strategic briefing.'
    ),
    'future_readiness_score', coalesce(v_avg_score, 75),
    'delayed_initiatives', (select count(*) from public.organization_future_readiness_initiatives where organization_id = v_org_id and initiative_status = 'delayed'),
    'escalated_threats', (select count(*) from public.organization_future_readiness_threats where organization_id = v_org_id and threat_status = 'escalated'),
    'route', '/app/future-readiness'
  );
end; $$;

grant execute on function public.get_organization_future_readiness_center(text) to authenticated;
grant execute on function public.perform_organization_future_readiness_action(jsonb) to authenticated;
grant execute on function public.get_organization_future_readiness_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_future_readiness_advisor_context() to authenticated;

