-- Phase 589 — Strategic Intelligence, Executive Planning & Board Operations Engine
-- Feature owner: CUSTOMER APP
-- Route: /app/strategy/*
-- Helpers: _sibo589_*

create table if not exists public.organization_sibo589_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  objectives_engine_enabled boolean not null default true,
  alignment_engine_enabled boolean not null default true,
  briefing_engine_enabled boolean not null default true,
  board_operations_enabled boolean not null default true,
  kpi_engine_enabled boolean not null default true,
  planning_cycles_enabled boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_sibo589_settings enable row level security;
revoke all on public.organization_sibo589_settings from authenticated, anon;

create table if not exists public.organization_sibo589_objectives (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  objective_key text not null,
  objective_title text not null,
  owner_label text not null default '',
  priority text not null default 'important' check (priority in ('critical', 'important', 'routine', 'optional')),
  timeline_label text not null default '',
  objective_status text not null default 'in_progress' check (
    objective_status in ('planned', 'in_progress', 'on_track', 'at_risk', 'completed')
  ),
  success_criteria text not null default '' check (char_length(success_criteria) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, objective_key)
);

alter table public.organization_sibo589_objectives enable row level security;
revoke all on public.organization_sibo589_objectives from authenticated, anon;

create table if not exists public.organization_sibo589_alignment (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alignment_key text not null,
  objective_key text not null,
  initiative_title text not null,
  project_title text not null default '',
  action_title text not null default '',
  outcome_title text not null default '',
  alignment_status text not null default 'linked' check (
    alignment_status in ('linked', 'in_progress', 'completed', 'blocked')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, alignment_key)
);

alter table public.organization_sibo589_alignment enable row level security;
revoke all on public.organization_sibo589_alignment from authenticated, anon;

create table if not exists public.organization_sibo589_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'growth', 'market', 'partnership', 'expansion', 'efficiency', 'innovation'
    )
  ),
  opportunity_status text not null default 'open' check (
    opportunity_status in ('open', 'reviewing', 'approved', 'pursuing', 'closed')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_sibo589_opportunities enable row level security;
revoke all on public.organization_sibo589_opportunities from authenticated, anon;

create table if not exists public.organization_sibo589_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_key text not null,
  risk_title text not null,
  risk_type text not null check (
    risk_type in ('revenue', 'operational', 'compliance', 'vendor', 'customer', 'market')
  ),
  risk_status text not null default 'monitor' check (
    risk_status in ('managed', 'monitor', 'strategic_risk')
  ),
  severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
  companion_recommendation text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, risk_key)
);

alter table public.organization_sibo589_risks enable row level security;
revoke all on public.organization_sibo589_risks from authenticated, anon;

create table if not exists public.organization_sibo589_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null,
  briefing_type text not null check (
    briefing_type in ('daily', 'weekly', 'monthly', 'quarterly_board', 'annual_planning')
  ),
  briefing_status text not null default 'available' check (
    briefing_status in ('available', 'generated', 'reviewed', 'archived')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, briefing_key)
);

alter table public.organization_sibo589_briefings enable row level security;
revoke all on public.organization_sibo589_briefings from authenticated, anon;

create table if not exists public.organization_sibo589_board_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  board_key text not null,
  board_title text not null,
  board_type text not null check (
    board_type in ('meeting', 'decision', 'action', 'document', 'approval', 'follow_up')
  ),
  board_status text not null default 'scheduled' check (
    board_status in ('scheduled', 'in_progress', 'completed', 'pending', 'overdue')
  ),
  due_date date,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, board_key)
);

alter table public.organization_sibo589_board_items enable row level security;
revoke all on public.organization_sibo589_board_items from authenticated, anon;

create table if not exists public.organization_sibo589_kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  kpi_key text not null,
  kpi_title text not null,
  kpi_category text not null check (
    kpi_category in (
      'revenue_growth', 'customer_growth', 'retention', 'operational_health',
      'execution_health', 'capability_maturity', 'risk_level'
    )
  ),
  kpi_value numeric(14,2) not null default 0,
  kpi_unit text not null default 'score',
  trend_label text not null default 'stable',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, kpi_key)
);

alter table public.organization_sibo589_kpis enable row level security;
revoke all on public.organization_sibo589_kpis from authenticated, anon;

create table if not exists public.organization_sibo589_forecasts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  forecast_key text not null,
  forecast_title text not null,
  horizon text not null check (horizon in ('30d', '90d', 'quarterly', 'annual')),
  forecast_direction text not null default 'stable',
  confidence text not null default 'moderate',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, forecast_key)
);

alter table public.organization_sibo589_forecasts enable row level security;
revoke all on public.organization_sibo589_forecasts from authenticated, anon;

create table if not exists public.organization_sibo589_planning_cycles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  cycle_key text not null,
  cycle_title text not null,
  cycle_type text not null check (
    cycle_type in ('monthly', 'quarterly', 'annual', 'strategic_review', 'board_review')
  ),
  cycle_status text not null default 'upcoming' check (
    cycle_status in ('upcoming', 'in_progress', 'completed', 'overdue')
  ),
  target_date date,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, cycle_key)
);

alter table public.organization_sibo589_planning_cycles enable row level security;
revoke all on public.organization_sibo589_planning_cycles from authenticated, anon;

create table if not exists public.organization_sibo589_business_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  objectives_count integer not null default 0,
  risks_count integer not null default 0,
  opportunities_count integer not null default 0,
  kpi_summary text not null default '',
  forecast_summary text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_sibo589_business_packs enable row level security;
revoke all on public.organization_sibo589_business_packs from authenticated, anon;

create table if not exists public.organization_sibo589_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'strategy_center',
  summary text not null default '' check (char_length(summary) <= 500),
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.organization_sibo589_audit_logs enable row level security;
revoke all on public.organization_sibo589_audit_logs from authenticated, anon;

create or replace function public._sibo589_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._sibo589_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'strategy_center'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_sibo589_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'strategy_center'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._sibo589_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_sibo589_settings (organization_id) values (p_org_id)
  on conflict (organization_id) do nothing;
end; $$;

create or replace function public._sibo589_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._sibo589_ensure_settings(p_org_id);
  if exists (select 1 from public.organization_sibo589_objectives where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_sibo589_objectives (
    organization_id, objective_key, objective_title, owner_label, priority, timeline_label,
    objective_status, success_criteria, summary
  ) values
    (p_org_id, 'revenue_growth', 'Revenue Growth', 'CEO', 'critical', 'FY 2026', 'in_progress', '12% YoY revenue growth', 'Expand recurring revenue and pack adoption.'),
    (p_org_id, 'market_expansion', 'Market Expansion', 'COO', 'important', 'H2 2026', 'planned', 'Enter 2 new markets', 'Nordic expansion with partner-led GTM.'),
    (p_org_id, 'operational_efficiency', 'Operational Efficiency', 'COO', 'important', 'Q3 2026', 'on_track', 'Reduce operational cost ratio by 8%', 'Automation and workflow optimization.'),
    (p_org_id, 'customer_retention', 'Customer Retention', 'Head of CS', 'critical', 'Ongoing', 'on_track', 'NRR ≥ 105%', 'Retention plans for at-risk accounts.'),
    (p_org_id, 'partner_growth', 'Partner Growth', 'VP Partnerships', 'important', 'FY 2026', 'in_progress', '25% partner-sourced revenue', 'Growth Partner program expansion.'),
    (p_org_id, 'product_development', 'Product Development', 'CPO', 'important', 'FY 2026', 'in_progress', 'Ship 3 major pack releases', 'Business Pack roadmap execution.');

  insert into public.organization_sibo589_alignment (
    organization_id, alignment_key, objective_key, initiative_title, project_title, action_title, outcome_title, summary
  ) values
    (p_org_id, 'align_revenue_1', 'revenue_growth', 'Enterprise upsell program', 'Knowledge Pack rollout', 'Approve expansion playbook', 'Increased ARR per account', 'Daily work linked to revenue objective.'),
    (p_org_id, 'align_retention_1', 'customer_retention', 'Renewal readiness', '90-day renewal reviews', 'Generate success plans', 'Improved renewal rate', 'CS actions aligned to retention goal.');

  insert into public.organization_sibo589_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type, summary
  ) values
    (p_org_id, 'market_nordic', 'Nordic Market Entry', 'market', 'Partner-led expansion into Sweden and Denmark.'),
    (p_org_id, 'partnership_host', 'Hosts Pack Partnership', 'partnership', 'Co-sell with hospitality integrators.'),
    (p_org_id, 'efficiency_automation', 'Workflow Automation', 'efficiency', 'Reduce manual approval cycles by 30%.');

  insert into public.organization_sibo589_risks (
    organization_id, risk_key, risk_title, risk_type, risk_status, severity, companion_recommendation, summary
  ) values
    (p_org_id, 'renewal_concentration', 'Renewal Concentration Risk', 'revenue', 'monitor', 'high',
     'Diversify renewal pipeline and assign executive sponsors.', 'Top 3 accounts represent 40% of ARR.'),
    (p_org_id, 'vendor_dependency', 'Critical Vendor Dependency', 'vendor', 'managed', 'medium',
     'Document failover plan for payment provider.', 'Single-provider concentration for billing.'),
    (p_org_id, 'compliance_audit', 'Compliance Audit Readiness', 'compliance', 'strategic_risk', 'high',
     'Schedule governance review before Q3 audit.', 'Policy updates pending for new markets.');

  insert into public.organization_sibo589_briefings (
    organization_id, briefing_key, briefing_title, briefing_type, briefing_status, summary
  ) values
    (p_org_id, 'daily_exec', 'Daily Executive Briefing', 'daily', 'generated', 'Key metrics, risks, and priorities for today.'),
    (p_org_id, 'weekly_leadership', 'Weekly Leadership Briefing', 'weekly', 'available', 'Leadership focus areas for the week.'),
    (p_org_id, 'monthly_strategic', 'Monthly Strategic Briefing', 'monthly', 'available', 'Strategic KPIs and initiative progress.'),
    (p_org_id, 'quarterly_board', 'Quarterly Board Briefing', 'quarterly_board', 'available', 'Board-ready summary of performance and risks.'),
    (p_org_id, 'annual_planning', 'Annual Planning Briefing', 'annual_planning', 'available', 'Annual objectives and planning cycle status.');

  insert into public.organization_sibo589_board_items (
    organization_id, board_key, board_title, board_type, board_status, due_date, summary
  ) values
    (p_org_id, 'board_meeting_q2', 'Q2 Board Meeting', 'meeting', 'scheduled', current_date + 45, 'Quarterly board review scheduled.'),
    (p_org_id, 'decision_market', 'Market Entry Decision', 'decision', 'pending', current_date + 30, 'Approve Nordic expansion plan.'),
    (p_org_id, 'action_audit', 'Compliance Audit Follow-Up', 'follow_up', 'in_progress', current_date + 14, 'Complete policy updates.'),
    (p_org_id, 'approval_budget', 'FY Budget Approval', 'approval', 'completed', null, 'Annual budget approved by board.');

  insert into public.organization_sibo589_kpis (
    organization_id, kpi_key, kpi_title, kpi_category, kpi_value, kpi_unit, trend_label, summary
  ) values
    (p_org_id, 'revenue_growth', 'Revenue Growth', 'revenue_growth', 14.2, 'percent', 'up', 'Strong YoY growth.'),
    (p_org_id, 'customer_growth', 'Customer Growth', 'customer_growth', 18, 'percent', 'up', 'Net new customers this quarter.'),
    (p_org_id, 'retention', 'Retention (NRR)', 'retention', 108.5, 'percent', 'stable', 'Net revenue retention healthy.'),
    (p_org_id, 'operational_health', 'Operational Health', 'operational_health', 82, 'score', 'stable', 'Operations running smoothly.'),
    (p_org_id, 'execution_health', 'Execution Health', 'execution_health', 76, 'score', 'up', 'Initiative delivery improving.'),
    (p_org_id, 'capability_maturity', 'Capability Maturity', 'capability_maturity', 71, 'score', 'up', 'Pack adoption driving maturity.'),
    (p_org_id, 'risk_level', 'Aggregate Risk Level', 'risk_level', 2, 'index', 'stable', '2 strategic risks under monitor.');

  insert into public.organization_sibo589_forecasts (
    organization_id, forecast_key, forecast_title, horizon, forecast_direction, confidence, summary
  ) values
    (p_org_id, 'fc_quarter', 'Quarterly Strategic Forecast', 'quarterly', 'growing', 'moderate', 'Revenue and retention outlook for next quarter.'),
    (p_org_id, 'fc_annual', 'Annual Strategic Forecast', 'annual', 'growing', 'moderate', 'Full-year strategic trajectory.');

  insert into public.organization_sibo589_planning_cycles (
    organization_id, cycle_key, cycle_title, cycle_type, cycle_status, target_date, summary
  ) values
    (p_org_id, 'monthly_june', 'June Planning Cycle', 'monthly', 'in_progress', current_date + 7, 'Monthly leadership review.'),
    (p_org_id, 'quarterly_q2', 'Q2 Strategic Review', 'quarterly', 'upcoming', current_date + 30, 'Quarterly planning and OKR check-in.'),
    (p_org_id, 'annual_2026', 'FY 2026 Annual Planning', 'annual', 'in_progress', current_date + 90, 'Annual objectives and budget alignment.'),
    (p_org_id, 'board_review_q2', 'Q2 Board Review', 'board_review', 'upcoming', current_date + 45, 'Board governance review cycle.');

  insert into public.organization_sibo589_business_packs (
    organization_id, pack_key, pack_title, objectives_count, risks_count, opportunities_count, kpi_summary, forecast_summary, summary
  ) values
    (p_org_id, 'support', 'Support Pack', 2, 1, 1, 'Customer Experience KPIs', 'Stable support revenue forecast', 'Support Pack → CX KPIs.'),
    (p_org_id, 'finance', 'Finance Pack', 1, 1, 0, 'Financial KPIs', 'Conservative finance forecast', 'Finance Pack → Financial KPIs.'),
    (p_org_id, 'warehouse', 'Warehouse Pack', 1, 0, 1, 'Operational KPIs', 'Growth forecast on operations', 'Warehouse Pack → Operational KPIs.');

  perform public._sibo589_log(p_org_id, 'objective_created', 'Strategy center baseline seeded.');
end; $$;

create or replace function public.get_organization_strategy_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_section text := lower(coalesce(nullif(trim(p_section), ''), 'overview'));
  v_kpi_score numeric;
begin
  v_org_id := public._sibo589_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._sibo589_seed(v_org_id);

  select coalesce(avg(kpi_value), 75) into v_kpi_score
  from public.organization_sibo589_kpis
  where organization_id = v_org_id and kpi_unit = 'score';

  if v_section = 'overview' then
    return jsonb_build_object(
      'found', true, 'section', v_section,
      'principle', 'Operations keep organizations running. Strategy determines where they are going.',
      'privacy_note', 'Strategic intelligence metadata only — leadership decides outcomes.',
      'strategic_health_score', round(v_kpi_score),
      'stats', jsonb_build_object(
        'active_objectives', (select count(*) from public.organization_sibo589_objectives where organization_id = v_org_id and objective_status in ('planned', 'in_progress', 'on_track')),
        'open_risks', (select count(*) from public.organization_sibo589_risks where organization_id = v_org_id and risk_status in ('monitor', 'strategic_risk')),
        'open_opportunities', (select count(*) from public.organization_sibo589_opportunities where organization_id = v_org_id and opportunity_status in ('open', 'reviewing', 'approved')),
        'board_items_pending', (select count(*) from public.organization_sibo589_board_items where organization_id = v_org_id and board_status in ('scheduled', 'pending', 'in_progress', 'overdue')),
        'planning_cycles_active', (select count(*) from public.organization_sibo589_planning_cycles where organization_id = v_org_id and cycle_status in ('upcoming', 'in_progress'))
      ),
      'companion_recommendations', coalesce((
        select jsonb_agg(jsonb_build_object(
          'risk_title', r.risk_title, 'recommendation', r.companion_recommendation
        )) from public.organization_sibo589_risks r
        where r.organization_id = v_org_id and r.risk_status in ('monitor', 'strategic_risk') limit 5
      ), '[]'::jsonb)
    );
  end if;

  return jsonb_build_object(
    'found', true, 'section', v_section,
    'principle', 'Operations keep organizations running. Strategy determines where they are going.',
    'privacy_note', 'Strategic intelligence metadata only.',
    'strategic_health_score', round(v_kpi_score),
    'objectives', coalesce((select jsonb_agg(jsonb_build_object(
      'objective_key', o.objective_key, 'objective_title', o.objective_title, 'owner_label', o.owner_label,
      'priority', o.priority, 'timeline_label', o.timeline_label, 'objective_status', o.objective_status,
      'success_criteria', o.success_criteria, 'summary', o.summary
    ) order by o.priority, o.objective_title) from public.organization_sibo589_objectives o where o.organization_id = v_org_id), '[]'::jsonb),
    'initiatives', coalesce((select jsonb_agg(jsonb_build_object(
      'alignment_key', a.alignment_key, 'objective_key', a.objective_key, 'initiative_title', a.initiative_title,
      'project_title', a.project_title, 'action_title', a.action_title, 'outcome_title', a.outcome_title,
      'alignment_status', a.alignment_status, 'summary', a.summary
    ) order by a.initiative_title) from public.organization_sibo589_alignment a where a.organization_id = v_org_id), '[]'::jsonb),
    'opportunities', coalesce((select jsonb_agg(jsonb_build_object(
      'opportunity_key', o.opportunity_key, 'opportunity_title', o.opportunity_title,
      'opportunity_type', o.opportunity_type, 'opportunity_status', o.opportunity_status, 'summary', o.summary
    ) order by o.opportunity_title) from public.organization_sibo589_opportunities o where o.organization_id = v_org_id), '[]'::jsonb),
    'risks', coalesce((select jsonb_agg(jsonb_build_object(
      'risk_key', r.risk_key, 'risk_title', r.risk_title, 'risk_type', r.risk_type,
      'risk_status', r.risk_status, 'severity', r.severity,
      'companion_recommendation', r.companion_recommendation, 'summary', r.summary
    ) order by r.severity desc) from public.organization_sibo589_risks r where r.organization_id = v_org_id), '[]'::jsonb),
    'board', coalesce((select jsonb_agg(jsonb_build_object(
      'board_key', b.board_key, 'board_title', b.board_title, 'board_type', b.board_type,
      'board_status', b.board_status, 'due_date', b.due_date, 'summary', b.summary
    ) order by b.due_date nulls last) from public.organization_sibo589_board_items b where b.organization_id = v_org_id), '[]'::jsonb),
    'briefings', coalesce((select jsonb_agg(jsonb_build_object(
      'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title,
      'briefing_type', b.briefing_type, 'briefing_status', b.briefing_status, 'summary', b.summary
    ) order by b.briefing_type) from public.organization_sibo589_briefings b where b.organization_id = v_org_id), '[]'::jsonb),
    'forecasts', coalesce((select jsonb_agg(jsonb_build_object(
      'forecast_key', f.forecast_key, 'forecast_title', f.forecast_title, 'horizon', f.horizon,
      'forecast_direction', f.forecast_direction, 'confidence', f.confidence, 'summary', f.summary
    ) order by f.horizon) from public.organization_sibo589_forecasts f where f.organization_id = v_org_id), '[]'::jsonb),
    'kpis', coalesce((select jsonb_agg(jsonb_build_object(
      'kpi_key', k.kpi_key, 'kpi_title', k.kpi_title, 'kpi_category', k.kpi_category,
      'kpi_value', k.kpi_value, 'kpi_unit', k.kpi_unit, 'trend_label', k.trend_label, 'summary', k.summary
    ) order by k.kpi_title) from public.organization_sibo589_kpis k where k.organization_id = v_org_id), '[]'::jsonb),
    'planning_cycles', coalesce((select jsonb_agg(jsonb_build_object(
      'cycle_key', c.cycle_key, 'cycle_title', c.cycle_title, 'cycle_type', c.cycle_type,
      'cycle_status', c.cycle_status, 'target_date', c.target_date, 'summary', c.summary
    ) order by c.target_date nulls last) from public.organization_sibo589_planning_cycles c where c.organization_id = v_org_id), '[]'::jsonb),
    'business_packs', coalesce((select jsonb_agg(jsonb_build_object(
      'pack_key', p.pack_key, 'pack_title', p.pack_title, 'objectives_count', p.objectives_count,
      'risks_count', p.risks_count, 'opportunities_count', p.opportunities_count,
      'kpi_summary', p.kpi_summary, 'forecast_summary', p.forecast_summary, 'summary', p.summary
    ) order by p.pack_title) from public.organization_sibo589_business_packs p where p.organization_id = v_org_id), '[]'::jsonb),
    'decision_support', jsonb_build_object(
      'decision_intelligence', '/app/assistant/decisions',
      'simulation_lab', '/app/simulation-lab',
      'revenue_center', '/app/revenue',
      'risk_engine', '/app/strategy/risks'
    ),
    'audit_recent', coalesce((select jsonb_agg(jsonb_build_object(
      'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
    ) order by l.created_at desc) from (
      select * from public.organization_sibo589_audit_logs where organization_id = v_org_id order by created_at desc limit 20
    ) l), '[]'::jsonb),
    'reports', jsonb_build_object(
      'objectives_count', (select count(*) from public.organization_sibo589_objectives where organization_id = v_org_id),
      'risks_count', (select count(*) from public.organization_sibo589_risks where organization_id = v_org_id),
      'opportunities_count', (select count(*) from public.organization_sibo589_opportunities where organization_id = v_org_id),
      'board_items', (select count(*) from public.organization_sibo589_board_items where organization_id = v_org_id)
    )
  );
end;
$$;

create or replace function public.get_aipify_strategic_advisor_bundle()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_center jsonb;
  v_stats jsonb;
begin
  v_center := public.get_organization_strategy_center('overview');
  if not coalesce((v_center->>'found')::boolean, false) then return v_center; end if;

  v_stats := v_center->'stats';

  return jsonb_build_object(
    'found', true,
    'briefing_title', 'Strategic Briefing',
    'insights', jsonb_build_array(
      jsonb_build_object(
        'key', 'focus',
        'observation', format('%s active objective(s) — strategic health score %s.',
          v_stats->>'active_objectives', v_center->>'strategic_health_score'),
        'recommendation', 'Review objective priorities and alignment with daily initiatives.',
        'href', '/app/strategy/objectives'
      ),
      jsonb_build_object(
        'key', 'risks',
        'observation', format('%s strategic risk(s) require attention.', v_stats->>'open_risks'),
        'recommendation', 'Assign owners and mitigation plans for monitor and strategic-risk items.',
        'href', '/app/strategy/risks'
      ),
      jsonb_build_object(
        'key', 'opportunities',
        'observation', format('%s opportunity(ies) in the registry.', v_stats->>'open_opportunities'),
        'recommendation', 'Prioritize market and partnership opportunities with executive sponsorship.',
        'href', '/app/strategy/opportunities'
      ),
      jsonb_build_object(
        'key', 'board',
        'observation', format('%s board item(s) pending.', v_stats->>'board_items_pending'),
        'recommendation', 'Prepare board briefing and complete follow-ups before next meeting.',
        'href', '/app/strategy/board'
      )
    ),
    'center', v_center
  );
end;
$$;

create or replace function public.get_organization_strategy_center_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return public.get_organization_strategy_center('overview');
end;
$$;

grant execute on function public.get_organization_strategy_center(text) to authenticated;
grant execute on function public.get_aipify_strategic_advisor_bundle() to authenticated;
grant execute on function public.get_organization_strategy_center_mobile_summary() to authenticated;
