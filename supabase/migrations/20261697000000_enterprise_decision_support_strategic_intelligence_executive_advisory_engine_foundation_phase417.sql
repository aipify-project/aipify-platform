-- Phase 417 — Enterprise Decision Support, Strategic Intelligence & Executive Advisory Engine Foundation
-- Feature owner: CUSTOMER APP. Route: /app/intelligence/strategy. Helpers: _gesiae417_*
-- Strategic intelligence layer — objectives, risks, opportunities, forecasts, scenarios, executive briefings.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_strategic_intelligence_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  advisory_mode text not null default 'executive' check (
    advisory_mode in ('executive', 'board', 'enterprise')
  ),
  strategic_health_score integer not null default 78 check (strategic_health_score between 0 and 100),
  forecast_confidence integer not null default 72 check (forecast_confidence between 0 and 100),
  governance_level text not null default 'standard' check (
    governance_level in ('standard', 'enhanced', 'board')
  ),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_strategic_intelligence_objectives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  objective_key text not null,
  objective_title text not null,
  owner_name text not null default '',
  timeline_label text not null default 'quarter',
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  dependencies jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  expected_outcomes jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (
    status in ('draft', 'active', 'at_risk', 'completed', 'archived')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, objective_key)
);

create index if not exists enterprise_strategic_intelligence_objectives_tenant_idx
  on public.enterprise_strategic_intelligence_objectives (tenant_id, status, updated_at desc);

create table if not exists public.enterprise_strategic_intelligence_initiatives (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  initiative_key text not null,
  initiative_title text not null,
  owner_name text not null default '',
  objective_key text,
  status text not null default 'active' check (
    status in ('planned', 'active', 'blocked', 'completed', 'archived')
  ),
  impact_score integer not null default 70 check (impact_score between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, initiative_key)
);

create index if not exists enterprise_strategic_intelligence_initiatives_tenant_idx
  on public.enterprise_strategic_intelligence_initiatives (tenant_id, status);

create table if not exists public.enterprise_strategic_intelligence_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null,
  briefing_type text not null check (
    briefing_type in ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom')
  ),
  executive_summary text not null default '',
  strategic_insights jsonb not null default '[]'::jsonb,
  priority_items jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  unique (tenant_id, briefing_key)
);

create index if not exists enterprise_strategic_intelligence_briefings_tenant_idx
  on public.enterprise_strategic_intelligence_briefings (tenant_id, generated_at desc);

create table if not exists public.enterprise_strategic_intelligence_risks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_category text not null check (
    risk_category in (
      'operational', 'financial', 'compliance', 'workforce',
      'customer', 'technology', 'strategic'
    )
  ),
  severity text not null default 'moderate' check (severity in ('low', 'moderate', 'high', 'critical')),
  likelihood text not null default 'moderate' check (likelihood in ('low', 'moderate', 'high')),
  status text not null default 'open' check (status in ('open', 'monitoring', 'mitigated', 'closed')),
  impact_summary text not null default '',
  mitigation_notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, risk_key)
);

create index if not exists enterprise_strategic_intelligence_risks_tenant_idx
  on public.enterprise_strategic_intelligence_risks (tenant_id, severity, updated_at desc);

create table if not exists public.enterprise_strategic_intelligence_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_category text not null check (
    opportunity_category in (
      'revenue', 'growth', 'expansion', 'market',
      'operational', 'partnership'
    )
  ),
  potential_impact text not null default 'moderate' check (potential_impact in ('low', 'moderate', 'high')),
  status text not null default 'identified' check (
    status in ('identified', 'evaluating', 'pursuing', 'realized', 'dismissed')
  ),
  impact_summary text not null default '',
  recommendation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, opportunity_key)
);

create index if not exists enterprise_strategic_intelligence_opportunities_tenant_idx
  on public.enterprise_strategic_intelligence_opportunities (tenant_id, status, updated_at desc);

create table if not exists public.enterprise_strategic_intelligence_forecasts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  forecast_category text not null check (
    forecast_category in (
      'revenue', 'growth', 'costs', 'capacity',
      'workforce', 'market_demand', 'industry_trends'
    )
  ),
  forecast_horizon text not null default 'quarter' check (
    forecast_horizon in ('month', 'quarter', 'year', 'custom')
  ),
  projected_value numeric(14, 2) not null default 0,
  confidence_percent integer not null default 70 check (confidence_percent between 0 and 100),
  trend_direction text not null default 'stable' check (
    trend_direction in ('declining', 'stable', 'growing', 'accelerating')
  ),
  assumptions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, forecast_key)
);

create index if not exists enterprise_strategic_intelligence_forecasts_tenant_idx
  on public.enterprise_strategic_intelligence_forecasts (tenant_id, updated_at desc);

create table if not exists public.enterprise_strategic_intelligence_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  scenario_type text not null check (
    scenario_type in (
      'best_case', 'expected_case', 'worst_case', 'custom',
      'growth', 'risk', 'investment'
    )
  ),
  outcome_summary text not null default '',
  probability_percent integer not null default 50 check (probability_percent between 0 and 100),
  impact_forecast jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, scenario_key)
);

create index if not exists enterprise_strategic_intelligence_scenarios_tenant_idx
  on public.enterprise_strategic_intelligence_scenarios (tenant_id, scenario_type);

create table if not exists public.enterprise_strategic_intelligence_priorities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  priority_key text not null,
  priority_title text not null,
  owner_name text not null default '',
  business_impact text not null default 'moderate' check (business_impact in ('low', 'moderate', 'high', 'critical')),
  status text not null default 'active' check (
    status in ('draft', 'active', 'blocked', 'completed', 'archived')
  ),
  dependencies jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  deadline_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, priority_key)
);

create index if not exists enterprise_strategic_intelligence_priorities_tenant_idx
  on public.enterprise_strategic_intelligence_priorities (tenant_id, status, updated_at desc);

create table if not exists public.enterprise_strategic_intelligence_competitive_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_key text not null,
  signal_type text not null check (
    signal_type in (
      'market_trend', 'industry_trend', 'competitor_observation',
      'technology_trend', 'emerging_risk', 'emerging_opportunity'
    )
  ),
  observation text not null,
  relevance text not null default 'moderate' check (relevance in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, signal_key)
);

create index if not exists enterprise_strategic_intelligence_competitive_signals_tenant_idx
  on public.enterprise_strategic_intelligence_competitive_signals (tenant_id, signal_type);

create table if not exists public.enterprise_strategic_intelligence_decision_reports (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  decision_context text not null default '',
  risk_analysis jsonb not null default '{}'::jsonb,
  opportunity_analysis jsonb not null default '{}'::jsonb,
  scenario_analysis jsonb not null default '{}'::jsonb,
  impact_forecast jsonb not null default '{}'::jsonb,
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  unique (tenant_id, report_key)
);

create index if not exists enterprise_strategic_intelligence_decision_reports_tenant_idx
  on public.enterprise_strategic_intelligence_decision_reports (tenant_id, generated_at desc);

create table if not exists public.enterprise_strategic_intelligence_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'strategic_opportunity', 'risk_review_required', 'forecast_changed',
      'historical_decision_context', 'scenario_review_recommended',
      'initiative_review', 'objective_at_risk', 'briefing_ready'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_strategic_intelligence_advisor_signals_tenant_idx
  on public.enterprise_strategic_intelligence_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_strategic_intelligence_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'objective_created', 'objective_updated', 'risk_recorded', 'opportunity_identified',
      'forecast_generated', 'scenario_created', 'executive_briefing_generated',
      'decision_support_report_generated', 'priority_updated', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_strategic_intelligence_audit_logs_tenant_idx
  on public.enterprise_strategic_intelligence_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_strategic_intelligence_settings enable row level security;
alter table public.enterprise_strategic_intelligence_objectives enable row level security;
alter table public.enterprise_strategic_intelligence_initiatives enable row level security;
alter table public.enterprise_strategic_intelligence_briefings enable row level security;
alter table public.enterprise_strategic_intelligence_risks enable row level security;
alter table public.enterprise_strategic_intelligence_opportunities enable row level security;
alter table public.enterprise_strategic_intelligence_forecasts enable row level security;
alter table public.enterprise_strategic_intelligence_scenarios enable row level security;
alter table public.enterprise_strategic_intelligence_priorities enable row level security;
alter table public.enterprise_strategic_intelligence_competitive_signals enable row level security;
alter table public.enterprise_strategic_intelligence_decision_reports enable row level security;
alter table public.enterprise_strategic_intelligence_advisor_signals enable row level security;
alter table public.enterprise_strategic_intelligence_audit_logs enable row level security;

revoke all on public.enterprise_strategic_intelligence_settings from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_objectives from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_initiatives from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_briefings from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_risks from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_opportunities from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_forecasts from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_scenarios from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_priorities from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_competitive_signals from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_decision_reports from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_advisor_signals from authenticated, anon;
revoke all on public.enterprise_strategic_intelligence_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_strategic_intelligence_advisory_engine', v.description
from (values
  ('enterprise_strategic_intelligence_advisory.view', 'View Strategic Intelligence', 'View strategic objectives, risks, opportunities, forecasts, and executive briefings'),
  ('enterprise_strategic_intelligence_advisory.manage', 'Manage Strategic Intelligence', 'Generate briefings, forecasts, scenarios, and decision support reports')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gesiae417_*
-- ---------------------------------------------------------------------------
create or replace function public._gesiae417_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_tenant_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_tenant_id := v_org_id;
  v_plan := public._aef_tenant_plan(v_tenant_id);
  if v_plan not in ('business', 'enterprise', 'growth', 'professional') then
    raise exception 'Strategic Intelligence requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gesiae417_log_audit(
  p_tenant_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.enterprise_strategic_intelligence_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gesiae417_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_strategic_intelligence_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.enterprise_strategic_intelligence_settings;
begin
  insert into public.enterprise_strategic_intelligence_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;

  if v_row.id is null then
    select * into v_row from public.enterprise_strategic_intelligence_settings where organization_id = p_org_id;
  end if;

  return v_row;
end;
$$;

create or replace function public._gesiae417_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.enterprise_strategic_intelligence_objectives where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_objectives (
      tenant_id, objective_key, objective_title, owner_name, timeline_label,
      progress_percent, expected_outcomes, status
    ) values
      (p_tenant_id, 'OBJ-GROWTH', 'Accelerate revenue growth', 'Executive team', 'FY2026', 42,
       jsonb_build_array('15% revenue increase', 'Expanded market presence'), 'active'),
      (p_tenant_id, 'OBJ-EFFICIENCY', 'Improve operational efficiency', 'COO', 'H2 2026', 58,
       jsonb_build_array('Reduced cycle time', 'Lower operational costs'), 'active'),
      (p_tenant_id, 'OBJ-TALENT', 'Strengthen workforce capability', 'CHRO', '2026', 35,
       jsonb_build_array('Skills development', 'Retention improvement'), 'active');
  end if;

  if not exists (select 1 from public.enterprise_strategic_intelligence_initiatives where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_initiatives (
      tenant_id, initiative_key, initiative_title, owner_name, objective_key, impact_score
    ) values
      (p_tenant_id, 'INIT-MARKET', 'Market expansion program', 'VP Sales', 'OBJ-GROWTH', 82),
      (p_tenant_id, 'INIT-AUTOMATION', 'Process automation rollout', 'COO', 'OBJ-EFFICIENCY', 76),
      (p_tenant_id, 'INIT-LEARNING', 'Enterprise learning initiative', 'CHRO', 'OBJ-TALENT', 68);
  end if;

  if not exists (select 1 from public.enterprise_strategic_intelligence_risks where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_risks (
      tenant_id, risk_key, risk_title, risk_category, severity, likelihood, impact_summary
    ) values
      (p_tenant_id, 'RISK-SUPPLY', 'Supply chain disruption', 'operational', 'moderate', 'moderate',
       'Potential delays in delivery timelines'),
      (p_tenant_id, 'RISK-COMPLIANCE', 'Regulatory compliance gap', 'compliance', 'high', 'low',
       'Emerging requirements may require policy updates'),
      (p_tenant_id, 'RISK-TALENT', 'Critical role vacancy', 'workforce', 'moderate', 'moderate',
       'Key positions may remain unfilled during growth phase');
  end if;

  if not exists (select 1 from public.enterprise_strategic_intelligence_opportunities where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_opportunities (
      tenant_id, opportunity_key, opportunity_title, opportunity_category, potential_impact, recommendation
    ) values
      (p_tenant_id, 'OPP-REV-01', 'Upsell existing enterprise accounts', 'revenue', 'high',
       'Review account health and prepare expansion proposals'),
      (p_tenant_id, 'OPP-MKT-01', 'Adjacent market entry', 'market', 'moderate',
       'Conduct market assessment and pilot feasibility study'),
      (p_tenant_id, 'OPP-PART-01', 'Strategic technology partnership', 'partnership', 'high',
       'Evaluate partners aligned with product roadmap');
  end if;

  if not exists (select 1 from public.enterprise_strategic_intelligence_priorities where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_priorities (
      tenant_id, priority_key, priority_title, owner_name, business_impact, deadline_at
    ) values
      (p_tenant_id, 'PRI-QBR', 'Quarterly business review preparation', 'CEO', 'critical', now() + interval '14 days'),
      (p_tenant_id, 'PRI-BOARD', 'Board materials finalization', 'CFO', 'high', now() + interval '21 days'),
      (p_tenant_id, 'PRI-RISK', 'Enterprise risk assessment', 'CRO', 'high', now() + interval '30 days');
  end if;

  if not exists (select 1 from public.enterprise_strategic_intelligence_competitive_signals where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_strategic_intelligence_competitive_signals (
      tenant_id, signal_key, signal_type, observation, relevance
    ) values
      (p_tenant_id, 'SIG-MKT-01', 'market_trend', 'Enterprise AI adoption accelerating in target segments', 'high'),
      (p_tenant_id, 'SIG-TECH-01', 'technology_trend', 'Agent orchestration becoming standard in operations platforms', 'moderate'),
      (p_tenant_id, 'SIG-RISK-01', 'emerging_risk', 'Increased regulatory scrutiny on automated decision systems', 'moderate');
  end if;
end;
$$;

create or replace function public._gesiae417_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.enterprise_strategic_intelligence_settings;
  v_objectives integer := 0;
  v_initiatives integer := 0;
  v_risks integer := 0;
  v_opportunities integer := 0;
  v_priorities integer := 0;
  v_high_risks integer := 0;
begin
  select * into v_settings from public.enterprise_strategic_intelligence_settings where tenant_id = p_tenant_id;

  select count(*)::integer into v_objectives
  from public.enterprise_strategic_intelligence_objectives where tenant_id = p_tenant_id and status = 'active';

  select count(*)::integer into v_initiatives
  from public.enterprise_strategic_intelligence_initiatives where tenant_id = p_tenant_id and status = 'active';

  select count(*)::integer into v_risks
  from public.enterprise_strategic_intelligence_risks where tenant_id = p_tenant_id and status in ('open', 'monitoring');

  select count(*)::integer into v_high_risks
  from public.enterprise_strategic_intelligence_risks
  where tenant_id = p_tenant_id and status in ('open', 'monitoring') and severity in ('high', 'critical');

  select count(*)::integer into v_opportunities
  from public.enterprise_strategic_intelligence_opportunities
  where tenant_id = p_tenant_id and status in ('identified', 'evaluating', 'pursuing');

  select count(*)::integer into v_priorities
  from public.enterprise_strategic_intelligence_priorities where tenant_id = p_tenant_id and status = 'active';

  return jsonb_build_object(
    'strategic_objectives', v_objectives,
    'key_initiatives', v_initiatives,
    'business_risks', v_risks,
    'high_priority_risks', v_high_risks,
    'growth_opportunities', v_opportunities,
    'executive_priorities', v_priorities,
    'forecast_confidence', coalesce(v_settings.forecast_confidence, 72),
    'strategic_health_score', coalesce(v_settings.strategic_health_score, 78),
    'growth_outlook', case
      when v_opportunities > v_high_risks then 'positive'
      when v_high_risks > 2 then 'cautious'
      else 'stable'
    end
  );
end;
$$;

create or replace function public._gesiae417_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.enterprise_strategic_intelligence_advisor_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then
    return;
  end if;

  insert into public.enterprise_strategic_intelligence_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (p_tenant_id, 'strategic_opportunity', 'A strategic growth opportunity was identified.',
     'Revenue expansion potential in existing enterprise accounts.',
     'Review opportunity intelligence and schedule executive evaluation.', 'moderate', 'moderate'),
    (p_tenant_id, 'risk_review_required', 'A risk requires executive review.',
     'Compliance and operational risks may affect strategic timeline.',
     'Open risk intelligence and assign mitigation owners.', 'low', 'high'),
    (p_tenant_id, 'scenario_review_recommended', 'A scenario review is recommended.',
     'Best, expected, and worst-case outcomes should be compared before major decisions.',
     'Generate scenario analysis for the current strategic initiative.', 'moderate', 'moderate');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_strategic_intelligence_advisory_center()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.enterprise_strategic_intelligence_settings;
  v_objectives jsonb := '[]'::jsonb;
  v_initiatives jsonb := '[]'::jsonb;
  v_briefings jsonb := '[]'::jsonb;
  v_risks jsonb := '[]'::jsonb;
  v_opportunities jsonb := '[]'::jsonb;
  v_forecasts jsonb := '[]'::jsonb;
  v_scenarios jsonb := '[]'::jsonb;
  v_priorities jsonb := '[]'::jsonb;
  v_competitive jsonb := '[]'::jsonb;
  v_reports jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_strategic_intelligence_advisory.view');
  v_ctx := public._gesiae417_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gesiae417_ensure_settings(v_org_id, v_tenant_id);
  perform public._gesiae417_seed_defaults(v_tenant_id);
  perform public._gesiae417_seed_advisor(v_tenant_id);
  v_overview := public._gesiae417_overview_block(v_tenant_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'objective_key', o.objective_key, 'objective_title', o.objective_title,
    'owner_name', o.owner_name, 'timeline_label', o.timeline_label,
    'progress_percent', o.progress_percent, 'status', o.status,
    'expected_outcomes', o.expected_outcomes
  ) order by o.updated_at desc), '[]'::jsonb) into v_objectives
  from public.enterprise_strategic_intelligence_objectives o where o.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'initiative_key', i.initiative_key, 'initiative_title', i.initiative_title,
    'owner_name', i.owner_name, 'impact_score', i.impact_score, 'status', i.status
  ) order by i.impact_score desc), '[]'::jsonb) into v_initiatives
  from public.enterprise_strategic_intelligence_initiatives i where i.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title,
    'briefing_type', b.briefing_type, 'executive_summary', b.executive_summary, 'generated_at', b.generated_at
  ) order by b.generated_at desc), '[]'::jsonb) into v_briefings
  from public.enterprise_strategic_intelligence_briefings b where b.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_key', r.risk_key, 'risk_title', r.risk_title,
    'risk_category', r.risk_category, 'severity', r.severity, 'likelihood', r.likelihood,
    'status', r.status, 'impact_summary', r.impact_summary
  ) order by r.severity desc, r.updated_at desc), '[]'::jsonb) into v_risks
  from public.enterprise_strategic_intelligence_risks r where r.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
    'opportunity_category', o.opportunity_category, 'potential_impact', o.potential_impact,
    'status', o.status, 'recommendation', o.recommendation
  ) order by o.updated_at desc), '[]'::jsonb) into v_opportunities
  from public.enterprise_strategic_intelligence_opportunities o where o.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'forecast_key', f.forecast_key, 'forecast_title', f.forecast_title,
    'forecast_category', f.forecast_category, 'forecast_horizon', f.forecast_horizon,
    'projected_value', f.projected_value, 'confidence_percent', f.confidence_percent,
    'trend_direction', f.trend_direction
  ) order by f.updated_at desc), '[]'::jsonb) into v_forecasts
  from public.enterprise_strategic_intelligence_forecasts f where f.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'scenario_key', s.scenario_key, 'scenario_title', s.scenario_title,
    'scenario_type', s.scenario_type, 'outcome_summary', s.outcome_summary,
    'probability_percent', s.probability_percent
  ) order by s.updated_at desc), '[]'::jsonb) into v_scenarios
  from public.enterprise_strategic_intelligence_scenarios s where s.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'priority_key', p.priority_key, 'priority_title', p.priority_title,
    'owner_name', p.owner_name, 'business_impact', p.business_impact,
    'status', p.status, 'deadline_at', p.deadline_at
  ) order by p.updated_at desc), '[]'::jsonb) into v_priorities
  from public.enterprise_strategic_intelligence_priorities p where p.tenant_id = v_tenant_id limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'signal_key', c.signal_key, 'signal_type', c.signal_type,
    'observation', c.observation, 'relevance', c.relevance
  ) order by c.updated_at desc), '[]'::jsonb) into v_competitive
  from public.enterprise_strategic_intelligence_competitive_signals c where c.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'report_key', d.report_key, 'report_title', d.report_title,
    'recommendation', d.recommendation, 'confidence', d.confidence, 'generated_at', d.generated_at
  ) order by d.generated_at desc), '[]'::jsonb) into v_reports
  from public.enterprise_strategic_intelligence_decision_reports d where d.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_signals
  from public.enterprise_strategic_intelligence_advisor_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb) into v_audit
  from public.enterprise_strategic_intelligence_audit_logs l where l.tenant_id = v_tenant_id limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Good decisions require good information. Great decisions require context.',
    'mission', 'Strategic Intelligence & Executive Advisory — help executives understand trends, risks, opportunities, and strategic priorities.',
    'abos_principle', 'Aipify helps organizations think — executives decide. Strategic intelligence prepares; humans approve.',
    'decision_support_route', '/app/assistant/decisions',
    'executive_route', '/app/executive',
    'distinction_note', 'Strategic intelligence and executive advisory — distinct from operational decision support and daily executive dashboards.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/intelligence/strategy'),
      jsonb_build_object('key', 'briefings', 'route', '/app/intelligence/strategy#briefings'),
      jsonb_build_object('key', 'strategic_intelligence', 'route', '/app/intelligence/strategy#intelligence'),
      jsonb_build_object('key', 'risk', 'route', '/app/intelligence/strategy#risks'),
      jsonb_build_object('key', 'opportunity', 'route', '/app/intelligence/strategy#opportunities'),
      jsonb_build_object('key', 'forecasting', 'route', '/app/intelligence/strategy#forecasts'),
      jsonb_build_object('key', 'scenarios', 'route', '/app/intelligence/strategy#scenarios'),
      jsonb_build_object('key', 'governance', 'route', '/app/intelligence/strategy#governance')
    ),
    'objectives', v_objectives,
    'initiatives', v_initiatives,
    'briefings', v_briefings,
    'risks', v_risks,
    'opportunities', v_opportunities,
    'forecasts', v_forecasts,
    'scenarios', v_scenarios,
    'priorities', v_priorities,
    'competitive_signals', v_competitive,
    'decision_reports', v_reports,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'briefings_route', '/app/intelligence/strategy#briefings',
      'risk_route', '/app/intelligence/strategy#risks',
      'opportunity_route', '/app/intelligence/strategy#opportunities',
      'forecast_route', '/app/intelligence/strategy#forecasts',
      'scenario_route', '/app/intelligence/strategy#scenarios',
      'decision_support_route', '/app/assistant/decisions',
      'executive_route', '/app/executive',
      'scenario_planning_route', '/app/intelligence/scenario-planning',
      'executive_foresight_route', '/app/intelligence/executive-foresight'
    ),
    'executive_dashboard', jsonb_build_object(
      'strategic_health', v_overview->>'strategic_health_score',
      'risks', v_overview->>'business_risks',
      'opportunities', v_overview->>'growth_opportunities',
      'forecast_confidence', v_overview->>'forecast_confidence',
      'objectives', v_overview->>'strategic_objectives',
      'growth_outlook', v_overview->>'growth_outlook',
      'executive_route', '/app/intelligence/strategy'
    ),
    'privacy_note', 'Strategic intelligence isolated per organization — independent executive reporting and forecasting with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_strategic_intelligence_advisory_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_action text;
  v_overview jsonb;
  v_briefing_id uuid;
  v_forecast_id uuid;
  v_scenario_id uuid;
  v_report_id uuid;
  v_risk_id uuid;
  v_opp_id uuid;
  v_obj_id uuid;
begin
  perform public._irp_require_permission('enterprise_strategic_intelligence_advisory.manage');
  v_ctx := public._gesiae417_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gesiae417_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_overview := public._gesiae417_overview_block(v_tenant_id);

  if v_action = 'generate_briefing' then
    insert into public.enterprise_strategic_intelligence_briefings (
      tenant_id, briefing_key, briefing_title, briefing_type, executive_summary,
      strategic_insights, priority_items
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'briefing_key', 'BRF-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'briefing_title', 'Executive briefing'),
      coalesce(p_payload->>'briefing_type', 'weekly'),
      format(
        'Strategic health %s. %s active objectives, %s risks, %s opportunities. Forecast confidence %s%%.',
        v_overview->>'strategic_health_score',
        v_overview->>'strategic_objectives',
        v_overview->>'business_risks',
        v_overview->>'growth_opportunities',
        v_overview->>'forecast_confidence'
      ),
      jsonb_build_array(
        'Growth opportunities identified.',
        'Operational risk monitoring active.',
        'Executive priorities require attention.'
      ),
      jsonb_build_array('Review strategic objectives', 'Evaluate high-priority risks', 'Assess growth opportunities')
    ) returning id into v_briefing_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'executive_briefing_generated', 'Executive briefing generated',
      jsonb_build_object('briefing_id', v_briefing_id, 'briefing_type', coalesce(p_payload->>'briefing_type', 'weekly'))
    );

    return jsonb_build_object('ok', true, 'briefing_id', v_briefing_id);
  end if;

  if v_action = 'generate_forecast' then
    insert into public.enterprise_strategic_intelligence_forecasts (
      tenant_id, forecast_key, forecast_title, forecast_category, forecast_horizon,
      projected_value, confidence_percent, trend_direction, assumptions
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'forecast_key', 'FCST-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'forecast_title', 'Strategic forecast'),
      coalesce(p_payload->>'forecast_category', 'revenue'),
      coalesce(p_payload->>'forecast_horizon', 'quarter'),
      coalesce((p_payload->>'projected_value')::numeric, 1250000),
      least(95, coalesce((v_overview->>'forecast_confidence')::integer, 72) + 2),
      coalesce(p_payload->>'trend_direction', 'growing'),
      jsonb_build_array('Current strategic trajectory', 'Market conditions', 'Operational capacity')
    ) returning id into v_forecast_id;

    update public.enterprise_strategic_intelligence_settings
    set forecast_confidence = least(95, forecast_confidence + 1), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'forecast_generated', 'Strategic forecast generated',
      jsonb_build_object('forecast_id', v_forecast_id)
    );

    return jsonb_build_object('ok', true, 'forecast_id', v_forecast_id);
  end if;

  if v_action = 'create_scenario' then
    insert into public.enterprise_strategic_intelligence_scenarios (
      tenant_id, scenario_key, scenario_title, scenario_type, outcome_summary,
      probability_percent, impact_forecast, recommendations
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'scenario_key', 'SCN-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'scenario_title', 'Strategic scenario'),
      coalesce(p_payload->>'scenario_type', 'expected_case'),
      coalesce(p_payload->>'outcome_summary', 'Projected outcomes based on current strategic trajectory.'),
      coalesce((p_payload->>'probability_percent')::integer, 50),
      jsonb_build_object('revenue', 'moderate growth', 'risk', 'managed', 'capacity', 'stable'),
      jsonb_build_array('Review assumptions', 'Compare with best and worst case', 'Assign scenario owner')
    ) returning id into v_scenario_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'scenario_created', 'Strategic scenario created',
      jsonb_build_object('scenario_id', v_scenario_id, 'scenario_type', coalesce(p_payload->>'scenario_type', 'expected_case'))
    );

    return jsonb_build_object('ok', true, 'scenario_id', v_scenario_id);
  end if;

  if v_action = 'record_risk' then
    insert into public.enterprise_strategic_intelligence_risks (
      tenant_id, risk_key, risk_title, risk_category, severity, likelihood, impact_summary
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'risk_key', 'RISK-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'risk_title', 'Strategic risk'),
      coalesce(p_payload->>'risk_category', 'strategic'),
      coalesce(p_payload->>'severity', 'moderate'),
      coalesce(p_payload->>'likelihood', 'moderate'),
      coalesce(p_payload->>'impact_summary', 'Requires executive review and mitigation planning.')
    ) returning id into v_risk_id;

    update public.enterprise_strategic_intelligence_settings
    set strategic_health_score = greatest(50, strategic_health_score - 1), updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'risk_recorded', 'Strategic risk recorded',
      jsonb_build_object('risk_id', v_risk_id)
    );

    return jsonb_build_object('ok', true, 'risk_id', v_risk_id);
  end if;

  if v_action = 'record_opportunity' then
    insert into public.enterprise_strategic_intelligence_opportunities (
      tenant_id, opportunity_key, opportunity_title, opportunity_category,
      potential_impact, recommendation
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'opportunity_key', 'OPP-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'opportunity_title', 'Strategic opportunity'),
      coalesce(p_payload->>'opportunity_category', 'growth'),
      coalesce(p_payload->>'potential_impact', 'moderate'),
      coalesce(p_payload->>'recommendation', 'Evaluate feasibility and assign executive sponsor.')
    ) returning id into v_opp_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'opportunity_identified', 'Strategic opportunity identified',
      jsonb_build_object('opportunity_id', v_opp_id)
    );

    return jsonb_build_object('ok', true, 'opportunity_id', v_opp_id);
  end if;

  if v_action = 'create_objective' then
    insert into public.enterprise_strategic_intelligence_objectives (
      tenant_id, objective_key, objective_title, owner_name, timeline_label, expected_outcomes
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'objective_key', 'OBJ-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'objective_title', 'Strategic objective'),
      coalesce(p_payload->>'owner_name', ''),
      coalesce(p_payload->>'timeline_label', 'quarter'),
      coalesce(p_payload->'expected_outcomes', '[]'::jsonb)
    ) returning id into v_obj_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'objective_created', 'Strategic objective created',
      jsonb_build_object('objective_id', v_obj_id)
    );

    return jsonb_build_object('ok', true, 'objective_id', v_obj_id);
  end if;

  if v_action = 'generate_decision_report' then
    insert into public.enterprise_strategic_intelligence_decision_reports (
      tenant_id, report_key, report_title, decision_context,
      risk_analysis, opportunity_analysis, scenario_analysis, impact_forecast, recommendation, confidence
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'report_key', 'DSR-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'report_title', 'Decision support report'),
      coalesce(p_payload->>'decision_context', 'Executive decision evaluation'),
      jsonb_build_object('open_risks', v_overview->>'business_risks', 'high_priority', v_overview->>'high_priority_risks'),
      jsonb_build_object('active_opportunities', v_overview->>'growth_opportunities'),
      jsonb_build_object('recommended', 'Compare best, expected, and worst case scenarios'),
      jsonb_build_object('growth_outlook', v_overview->>'growth_outlook', 'health_score', v_overview->>'strategic_health_score'),
      'Aipify recommends reviewing risk intelligence, opportunity analysis, and scenario outcomes before deciding. Humans retain final authority.',
      coalesce(p_payload->>'confidence', 'moderate')
    ) returning id into v_report_id;

    perform public._gesiae417_log_audit(
      v_tenant_id, 'decision_support_report_generated', 'Decision support report generated',
      jsonb_build_object('report_id', v_report_id)
    );

    return jsonb_build_object('ok', true, 'report_id', v_report_id);
  end if;

  raise exception 'Unknown action: %', v_action;
end;
$$;

grant execute on function public.get_enterprise_strategic_intelligence_advisory_center() to authenticated;
grant execute on function public.enterprise_strategic_intelligence_advisory_action(jsonb) to authenticated;
