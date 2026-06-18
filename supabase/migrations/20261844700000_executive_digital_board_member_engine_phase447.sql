-- Phase 447 — Executive Digital Board Member Engine (Customer App)
-- Route: /app/executive/board

create table if not exists public.executive_digital_board_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  board_enabled boolean not null default true,
  human_control_required boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_digital_board_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'board_overview', 'strategic_risks', 'strategic_opportunities', 'executive_recommendations',
    'board_reviews', 'long_term_planning', 'scenario_analysis'
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

create index if not exists executive_digital_board_sections_org_idx
  on public.executive_digital_board_section_items (organization_id, section_key);

create table if not exists public.executive_digital_board_dashboard_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'revenue_trends', 'growth_trends', 'customer_health', 'operational_health',
    'financial_health', 'risk_exposure', 'strategic_opportunities'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.executive_digital_board_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_type text not null check (opportunity_type in (
    'new_market', 'new_business_pack', 'expansion', 'partner', 'acquisition', 'product'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  suggested_action text not null default '',
  evidence_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create index if not exists executive_digital_board_opportunities_org_idx
  on public.executive_digital_board_opportunities (organization_id, opportunity_type);

create table if not exists public.executive_digital_board_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_type text not null check (risk_type in (
    'revenue_concentration', 'customer_concentration', 'vendor_dependence',
    'knowledge_risk', 'operational_risk', 'market_risk'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  severity_label text not null default '',
  evidence_label text not null default '',
  status_key text not null default 'requires_attention',
  updated_at timestamptz not null default now()
);

create index if not exists executive_digital_board_risks_org_idx
  on public.executive_digital_board_risks (organization_id, risk_type);

create table if not exists public.executive_digital_board_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommended_action text not null,
  reasoning text not null default '' check (char_length(reasoning) <= 500),
  potential_outcome text not null default '',
  risk_level text not null default 'moderate' check (risk_level in ('low', 'moderate', 'high', 'critical')),
  estimated_impact text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_digital_board_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_topic text not null check (scenario_topic in (
    'launch_business_pack', 'international_expansion', 'pricing_change', 'new_hiring_strategy'
  )),
  scenario_name text not null,
  best_case_label text not null default '',
  expected_case_label text not null default '',
  worst_case_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_digital_board_meeting_prep (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prep_type text not null check (prep_type in (
    'executive_summary', 'risk_summary', 'opportunity_summary', 'recommended_priorities', 'decision_packages'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'waiting',
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_digital_board_timeline (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  timeline_type text not null check (timeline_type in (
    'past_decision', 'current_initiative', 'future_opportunity', 'expected_milestone'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  milestone_label text not null default '',
  status_key text not null default 'information',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.executive_digital_board_long_term_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan_horizon text not null check (plan_horizon in ('one_year', 'three_year', 'five_year')),
  plan_title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  progress_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, plan_horizon)
);

create table if not exists public.executive_digital_board_companion (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  question_type text not null check (question_type in (
    'focus_next_quarter', 'largest_operational_risk', 'missing_opportunity', 'strategic_guidance'
  )),
  question text not null,
  answer text not null default '' check (char_length(answer) <= 500),
  evidence_label text not null default '',
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed', 'approved')),
  created_at timestamptz not null default now()
);

create index if not exists executive_digital_board_companion_org_idx
  on public.executive_digital_board_companion (organization_id, status);

create table if not exists public.executive_digital_board_audit (
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

create index if not exists executive_digital_board_audit_org_idx
  on public.executive_digital_board_audit (organization_id, created_at desc);

alter table public.executive_digital_board_settings enable row level security;
alter table public.executive_digital_board_section_items enable row level security;
alter table public.executive_digital_board_dashboard_metrics enable row level security;
alter table public.executive_digital_board_opportunities enable row level security;
alter table public.executive_digital_board_risks enable row level security;
alter table public.executive_digital_board_recommendations enable row level security;
alter table public.executive_digital_board_scenarios enable row level security;
alter table public.executive_digital_board_meeting_prep enable row level security;
alter table public.executive_digital_board_timeline enable row level security;
alter table public.executive_digital_board_long_term_plans enable row level security;
alter table public.executive_digital_board_companion enable row level security;
alter table public.executive_digital_board_audit enable row level security;
revoke all on public.executive_digital_board_settings from authenticated, anon;
revoke all on public.executive_digital_board_section_items from authenticated, anon;
revoke all on public.executive_digital_board_dashboard_metrics from authenticated, anon;
revoke all on public.executive_digital_board_opportunities from authenticated, anon;
revoke all on public.executive_digital_board_risks from authenticated, anon;
revoke all on public.executive_digital_board_recommendations from authenticated, anon;
revoke all on public.executive_digital_board_scenarios from authenticated, anon;
revoke all on public.executive_digital_board_meeting_prep from authenticated, anon;
revoke all on public.executive_digital_board_timeline from authenticated, anon;
revoke all on public.executive_digital_board_long_term_plans from authenticated, anon;
revoke all on public.executive_digital_board_companion from authenticated, anon;
revoke all on public.executive_digital_board_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'executive_digital_board_center', v.description
from (values
  ('executive_digital_board.view', 'View Executive Digital Board Center', 'View board intelligence, risks, opportunities, and strategic recommendations'),
  ('executive_digital_board.manage', 'Manage Executive Digital Board Center', 'Manage board recommendations, meeting prep, and strategic planning items')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'executive_digital_board.view'), ('owner', 'executive_digital_board.manage'),
  ('administrator', 'executive_digital_board.view'), ('administrator', 'executive_digital_board.manage'),
  ('manager', 'executive_digital_board.view'),
  ('employee', 'executive_digital_board.view'),
  ('support_agent', 'executive_digital_board.view'),
  ('moderator', 'executive_digital_board.view'),
  ('viewer', 'executive_digital_board.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._edbm447_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('executive_digital_board.manage', v_org_id),
    'can_manage', public._irp_has_permission('executive_digital_board.manage', v_org_id),
    'can_view', public._irp_has_permission('executive_digital_board.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._edbm447_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.executive_digital_board_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._edbm447_section_json(s public.executive_digital_board_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._edbm447_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.executive_digital_board_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.executive_digital_board_opportunities where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.executive_digital_board_section_items
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'board_overview', 'Board overview', 'Executive-level guidance, analysis, and strategic awareness — always available under human control.', 'Active', '24/7', 'verified'),
    (p_org_id, 'strategic_risks', 'Strategic risks', 'Revenue concentration, vendor dependence, knowledge gaps, and market exposure.', 'Risks', '6', 'requires_attention'),
    (p_org_id, 'strategic_opportunities', 'Strategic opportunities', 'New markets, Business Packs, expansion, partners, acquisitions, and products.', 'Opportunities', '8', 'information'),
    (p_org_id, 'executive_recommendations', 'Executive recommendations', 'Evidence-based recommendations with reasoning, impact, and risk level.', 'Open', '5', 'information'),
    (p_org_id, 'board_reviews', 'Board reviews', 'Periodic strategic reviews with explainable, auditable outcomes.', 'Reviews', 'Quarterly', 'verified'),
    (p_org_id, 'long_term_planning', 'Long-term planning', '1-year, 3-year, and 5-year vision roadmaps with progress tracking.', 'Plans', '3', 'verified'),
    (p_org_id, 'scenario_analysis', 'Scenario analysis', 'Best case, expected case, and worst case for major strategic decisions.', 'Scenarios', '4', 'information');

  insert into public.executive_digital_board_dashboard_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'revenue_trends', '+12% YoY', 'Steady growth across core segments', 'verified'),
    (p_org_id, 'growth_trends', '+18% ARR', 'Expansion outpacing prior quarter', 'completed'),
    (p_org_id, 'customer_health', '84/100', 'Retention stable — 2 accounts flagged', 'requires_attention'),
    (p_org_id, 'operational_health', '91/100', 'Support and delivery within targets', 'verified'),
    (p_org_id, 'financial_health', 'Strong', 'Cash runway 18 months', 'verified'),
    (p_org_id, 'risk_exposure', 'Moderate', '2 concentration risks active', 'requires_attention'),
    (p_org_id, 'strategic_opportunities', '8 active', 'Hospitality segment demand rising', 'information');

  insert into public.executive_digital_board_opportunities
    (organization_id, opportunity_type, title, summary, suggested_action, evidence_label, status_key)
  values
    (p_org_id, 'new_business_pack', 'Hospitality Business Pack', 'Demand increasing within Hospitality segment.', 'Launch Hospitality Business Pack', 'Segment inquiry volume +34% QoQ', 'information'),
    (p_org_id, 'new_market', 'Nordic expansion', 'Strong partner pipeline in Sweden and Denmark.', 'Evaluate Nordic market entry', '12 qualified partner leads', 'information'),
    (p_org_id, 'expansion', 'Enterprise tier growth', 'Mid-market accounts requesting enterprise features.', 'Expand enterprise packaging', '8 upgrade requests this month', 'verified'),
    (p_org_id, 'partner', 'Growth Partner recruitment', 'Coverage gaps in hospitality and retail verticals.', 'Expand Growth Partner recruitment', '28% market coverage gap', 'information'),
    (p_org_id, 'product', 'Executive briefing module', 'Customers requesting board-ready reporting.', 'Prioritize executive briefing export', '23 feature requests', 'waiting'),
    (p_org_id, 'acquisition', 'Support automation tool', 'Potential tuck-in acquisition for support AI.', 'Conduct preliminary diligence', '3 targets identified', 'restricted');

  insert into public.executive_digital_board_risks
    (organization_id, risk_type, title, summary, severity_label, evidence_label, status_key)
  values
    (p_org_id, 'revenue_concentration', 'Segment concentration', '41% of revenue originates from one customer segment.', 'High', 'Finance rollup — Q4 segment mix', 'requires_attention'),
    (p_org_id, 'customer_concentration', 'Top customer dependency', 'Top 3 customers represent 52% of ARR.', 'Moderate', 'Subscription analytics', 'requires_attention'),
    (p_org_id, 'vendor_dependence', 'Primary cloud vendor', 'Critical infrastructure on single cloud provider.', 'Moderate', 'Infrastructure audit', 'information'),
    (p_org_id, 'knowledge_risk', 'Key person dependency', '2 critical workflows depend on single team member.', 'Moderate', 'Operations review', 'requires_attention'),
    (p_org_id, 'operational_risk', 'Support capacity', 'Support volume approaching capacity during peak season.', 'Moderate', 'Support metrics — 30-day trend', 'waiting'),
    (p_org_id, 'market_risk', 'Competitive pressure', 'New entrants in hospitality AI segment.', 'Low', 'Market intelligence scan', 'information');

  insert into public.executive_digital_board_recommendations
    (organization_id, recommended_action, reasoning, potential_outcome, risk_level, estimated_impact, status_key)
  values
    (p_org_id, 'Expand Growth Partner recruitment', 'Coverage gaps limit market reach in hospitality and retail.', 'Increase market coverage by 28%', 'moderate', 'NOK 2.4M incremental ARR potential', 'information'),
    (p_org_id, 'Launch Hospitality Business Pack', 'Segment demand rising — inquiries up 34% QoQ.', 'Capture underserved hospitality market', 'moderate', 'NOK 1.8M ARR in 12 months', 'information'),
    (p_org_id, 'Diversify top customer segment', '41% revenue concentration creates strategic vulnerability.', 'Reduce segment concentration below 30%', 'high', 'Improved resilience and valuation', 'requires_attention'),
    (p_org_id, 'Accelerate knowledge documentation', 'Key person dependency in 2 critical workflows.', 'Reduce operational single-point-of-failure risk', 'low', 'Continuity score +15 points', 'verified'),
    (p_org_id, 'Prepare board decision package for Nordic expansion', 'Partner pipeline strong — timing favorable for Q3 entry.', 'Establish Nordic presence with partner-led GTM', 'moderate', '3 new markets in 18 months', 'waiting');

  insert into public.executive_digital_board_scenarios
    (organization_id, scenario_topic, scenario_name, best_case_label, expected_case_label, worst_case_label, status_key)
  values
    (p_org_id, 'launch_business_pack', 'Launch Hospitality Business Pack', 'NOK 3.2M ARR in 12 months', 'NOK 1.8M ARR in 12 months', 'NOK 600K ARR — slow adoption', 'information'),
    (p_org_id, 'international_expansion', 'International Expansion (Nordic)', '5 markets in 24 months', '3 markets in 18 months', '1 market — delayed entry', 'information'),
    (p_org_id, 'pricing_change', 'Enterprise Pricing Adjustment', '+22% ARPU, minimal churn', '+12% ARPU, 3% churn', 'Flat ARPU, 8% churn', 'requires_attention'),
    (p_org_id, 'new_hiring_strategy', 'Strategic Hiring (Support + Sales)', 'Capacity +40%, revenue +25%', 'Capacity +25%, revenue +15%', 'Delayed hires — capacity gap persists', 'information');

  insert into public.executive_digital_board_meeting_prep
    (organization_id, prep_type, title, summary, status_key)
  values
    (p_org_id, 'executive_summary', 'Executive Summary', 'Revenue +12% YoY, 8 strategic opportunities, 6 active risks — governance compliant.', 'verified'),
    (p_org_id, 'risk_summary', 'Risk Summary', '2 concentration risks require board attention — segment and customer dependency.', 'requires_attention'),
    (p_org_id, 'opportunity_summary', 'Opportunity Summary', 'Hospitality Business Pack and Nordic expansion top priorities.', 'information'),
    (p_org_id, 'recommended_priorities', 'Recommended Priorities', '1) Diversify revenue 2) Launch Hospitality Pack 3) Expand Growth Partners', 'information'),
    (p_org_id, 'decision_packages', 'Decision Packages', '3 packages ready: Hospitality Pack launch, Nordic expansion, pricing review.', 'waiting');

  insert into public.executive_digital_board_timeline
    (organization_id, timeline_type, title, summary, milestone_label, status_key, sort_order)
  values
    (p_org_id, 'past_decision', 'Enterprise tier launch', 'Approved Q2 — now 18% of new ARR.', 'Q2 2025', 'completed', 1),
    (p_org_id, 'past_decision', 'Growth Partner program expansion', 'Approved Q3 — 12 new partners onboarded.', 'Q3 2025', 'completed', 2),
    (p_org_id, 'current_initiative', 'Hospitality Business Pack development', 'In progress — beta with 3 pilot customers.', 'Q1 2026 target', 'waiting', 3),
    (p_org_id, 'current_initiative', 'Nordic market assessment', 'Partner pipeline evaluation underway.', 'Q2 2026 decision', 'information', 4),
    (p_org_id, 'future_opportunity', 'Acquisition evaluation', 'Support automation tuck-in — preliminary diligence.', 'H2 2026', 'restricted', 5),
    (p_org_id, 'expected_milestone', 'Segment diversification below 30%', 'Target reduction from 41% concentration.', 'Q4 2026', 'requires_attention', 6);

  insert into public.executive_digital_board_long_term_plans
    (organization_id, plan_horizon, plan_title, summary, progress_label, status_key)
  values
    (p_org_id, 'one_year', '1-Year Plan', 'Launch Hospitality Pack, expand Growth Partners, reduce segment concentration.', '42% complete', 'verified'),
    (p_org_id, 'three_year', '3-Year Plan', 'Nordic expansion, 3 new Business Packs, enterprise tier dominance.', '18% complete', 'information'),
    (p_org_id, 'five_year', '5-Year Vision Roadmap', 'Global ABOS platform — trusted digital board member for 10,000+ organizations.', 'On track', 'verified');

  insert into public.executive_digital_board_companion
    (organization_id, question_type, question, answer, evidence_label)
  values
    (p_org_id, 'focus_next_quarter', 'What should we focus on next quarter?', 'Prioritize Hospitality Business Pack launch and segment diversification — both address revenue concentration while capturing rising demand.', '8 opportunities ranked · 6 risks assessed · board prep ready'),
    (p_org_id, 'largest_operational_risk', 'What is our largest operational risk?', '41% revenue concentration in one customer segment — combined with top-3 customer dependency at 52% ARR.', 'Finance rollup · subscription analytics · risk engine'),
    (p_org_id, 'missing_opportunity', 'What opportunity are we missing?', 'Hospitality segment demand is rising (+34% inquiries) but no dedicated Business Pack exists yet.', 'Opportunity engine · segment inquiry trends · competitor scan'),
    (p_org_id, 'strategic_guidance', 'Policy-based Growth Partner expansion may increase market coverage by 28%.', 'Similar strategic moves approved in prior quarters — partner-led GTM reduces capital intensity.', 'Historical board decisions · partner pipeline data');

end; $$;

create or replace function public.get_executive_digital_board_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_settings jsonb;
  v_overview_s jsonb; v_risks_s jsonb; v_opps_s jsonb; v_recs_s jsonb;
  v_reviews_s jsonb; v_planning_s jsonb; v_scenario_s jsonb;
  v_dashboard jsonb; v_opportunities jsonb; v_risks jsonb; v_recommendations jsonb;
  v_scenarios jsonb; v_meeting_prep jsonb; v_timeline jsonb; v_long_term jsonb; v_companion jsonb;
begin
  perform public._irp_require_permission('executive_digital_board.view');
  v_ctx := public._edbm447_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._edbm447_seed(v_org_id);

  select jsonb_build_object(
    'board_enabled', s.board_enabled,
    'human_control_required', s.human_control_required
  ) into v_settings
  from public.executive_digital_board_settings s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_overview_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'board_overview';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_risks_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'strategic_risks';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_opps_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'strategic_opportunities';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_recs_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'executive_recommendations';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_reviews_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'board_reviews';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_planning_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'long_term_planning';
  select coalesce(jsonb_agg(public._edbm447_section_json(s)), '[]'::jsonb) into v_scenario_s
  from public.executive_digital_board_section_items s where s.organization_id = v_org_id and s.section_key = 'scenario_analysis';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'dashboard'
  ) order by case m.metric_key
    when 'revenue_trends' then 1 when 'growth_trends' then 2 when 'customer_health' then 3
    when 'operational_health' then 4 when 'financial_health' then 5 when 'risk_exposure' then 6 else 7 end), '[]'::jsonb)
  into v_dashboard from public.executive_digital_board_dashboard_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', o.id, 'opportunity_type', o.opportunity_type, 'title', o.title, 'summary', o.summary,
    'suggested_action', o.suggested_action, 'evidence_label', o.evidence_label,
    'status_key', o.status_key, 'item_type', 'opportunity'
  ) order by o.title), '[]'::jsonb)
  into v_opportunities from public.executive_digital_board_opportunities o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_type', r.risk_type, 'title', r.title, 'summary', r.summary,
    'severity_label', r.severity_label, 'evidence_label', r.evidence_label,
    'status_key', r.status_key, 'item_type', 'risk'
  ) order by case r.severity_label when 'High' then 1 when 'Moderate' then 2 else 3 end), '[]'::jsonb)
  into v_risks from public.executive_digital_board_risks r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommended_action', r.recommended_action, 'reasoning', r.reasoning,
    'potential_outcome', r.potential_outcome, 'risk_level', r.risk_level,
    'estimated_impact', r.estimated_impact, 'status_key', r.status_key, 'item_type', 'recommendation'
  ) order by r.updated_at desc), '[]'::jsonb)
  into v_recommendations from public.executive_digital_board_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'scenario_topic', s.scenario_topic, 'scenario_name', s.scenario_name,
    'best_case_label', s.best_case_label, 'expected_case_label', s.expected_case_label,
    'worst_case_label', s.worst_case_label, 'status_key', s.status_key, 'item_type', 'scenario'
  ) order by s.scenario_name), '[]'::jsonb)
  into v_scenarios from public.executive_digital_board_scenarios s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'prep_type', p.prep_type, 'title', p.title, 'summary', p.summary,
    'status_key', p.status_key, 'item_type', 'meeting_prep'
  ) order by case p.prep_type
    when 'executive_summary' then 1 when 'risk_summary' then 2 when 'opportunity_summary' then 3
    when 'recommended_priorities' then 4 else 5 end), '[]'::jsonb)
  into v_meeting_prep from public.executive_digital_board_meeting_prep p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'timeline_type', t.timeline_type, 'title', t.title, 'summary', t.summary,
    'milestone_label', t.milestone_label, 'status_key', t.status_key, 'item_type', 'timeline'
  ) order by t.sort_order), '[]'::jsonb)
  into v_timeline from public.executive_digital_board_timeline t where t.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'plan_horizon', l.plan_horizon, 'plan_title', l.plan_title, 'summary', l.summary,
    'progress_label', l.progress_label, 'status_key', l.status_key, 'item_type', 'long_term_plan'
  ) order by case l.plan_horizon when 'one_year' then 1 when 'three_year' then 2 else 3 end), '[]'::jsonb)
  into v_long_term from public.executive_digital_board_long_term_plans l where l.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'question_type', c.question_type, 'question', c.question,
    'answer', c.answer, 'evidence_label', c.evidence_label,
    'status', c.status, 'item_type', 'companion'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_companion from public.executive_digital_board_companion c
  where c.organization_id = v_org_id and c.status = 'open';

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most companies cannot afford a world-class boardroom available 24/7. Aipify provides executive-level guidance, analysis, and strategic awareness at all times — explainable, auditable, evidence-based, and human-controlled.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Board recommendations are explainable, auditable, evidence-based, and human-controlled. No autonomous strategic decisions.',
    'board_settings', coalesce(v_settings, '{}'::jsonb),
    'executive_board_dashboard', v_dashboard,
    'strategic_opportunity_engine', v_opportunities,
    'strategic_risk_engine', v_risks,
    'board_recommendations', v_recommendations,
    'scenario_planning', v_scenarios,
    'board_meeting_preparation', v_meeting_prep,
    'strategic_timeline', v_timeline,
    'long_term_planning_engine', v_long_term,
    'companion_executive_advisor', v_companion,
    'sections', jsonb_build_object(
      'board_overview', v_overview_s,
      'strategic_risks', v_risks_s,
      'strategic_opportunities', v_opps_s,
      'executive_recommendations', v_recs_s,
      'board_reviews', v_reviews_s,
      'long_term_planning', v_planning_s,
      'scenario_analysis', v_scenario_s
    ),
    'statistics', jsonb_build_object(
      'dashboard_count', jsonb_array_length(v_dashboard),
      'opportunity_count', jsonb_array_length(v_opportunities),
      'risk_count', jsonb_array_length(v_risks),
      'recommendation_count', jsonb_array_length(v_recommendations),
      'scenario_count', jsonb_array_length(v_scenarios),
      'meeting_prep_count', jsonb_array_length(v_meeting_prep),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Strategic metadata and aggregate signals only — no raw customer communications, financial records, or unapproved PII in board intelligence.'
  );
end; $$;

create or replace function public.manage_executive_digital_board_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._edbm447_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'approve', 'reject', 'escalate', 'prepare') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' and p_item_id is not null then
    update public.executive_digital_board_companion set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        when 'approve' then 'approved'
        else status
      end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'recommendation' and p_item_id is not null then
    update public.executive_digital_board_recommendations set
      status_key = case p_action
        when 'approve' then 'verified'
        when 'reject' then 'not_allowed'
        when 'escalate' then 'requires_attention'
        when 'acknowledge' then 'information'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'meeting_prep' and p_item_id is not null then
    update public.executive_digital_board_meeting_prep set
      status_key = case p_action
        when 'prepare' then 'verified'
        when 'approve' then 'completed'
        when 'acknowledge' then 'information'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'risk' and p_item_id is not null then
    update public.executive_digital_board_risks set
      status_key = case p_action
        when 'acknowledge' then 'information'
        when 'escalate' then 'requires_attention'
        when 'approve' then 'verified'
        else status_key
      end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._edbm447_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Executive digital board item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_executive_digital_board_center() to authenticated;
grant execute on function public.manage_executive_digital_board_item(text, uuid, text, jsonb) to authenticated;
