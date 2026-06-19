-- Phase 570 — Organizational Command AI, Executive Copilot & Decision Execution Center
-- Feature owner: CUSTOMER APP
-- Routes: /app/executive-copilot, /app/executive-copilot/decisions, /app/executive-copilot/board-reports
-- Helpers: _cmec570_*

create table if not exists public.organization_companion_executive_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  executive_copilot_enabled boolean not null default true,
  natural_language_commands_enabled boolean not null default true,
  briefing_auto_generation boolean not null default true,
  approval_required_for_execution boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_executive_settings enable row level security;
revoke all on public.organization_companion_executive_settings from authenticated, anon;

create table if not exists public.organization_companion_executive_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null,
  briefing_type text not null check (
    briefing_type in ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom')
  ),
  briefing_status text not null default 'ready' check (
    briefing_status in ('preparing', 'ready', 'delivered', 'archived')
  ),
  content_areas jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, briefing_key)
);

alter table public.organization_companion_executive_briefings enable row level security;
revoke all on public.organization_companion_executive_briefings from authenticated, anon;

create table if not exists public.organization_companion_executive_decisions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  decision_key text not null,
  decision_title text not null,
  decision_type text not null default 'strategic' check (
    decision_type in ('expansion', 'hiring', 'domain', 'business_pack', 'acquisition', 'investment', 'custom')
  ),
  decision_status text not null default 'analysis' check (
    decision_status in ('requested', 'analysis', 'options_ready', 'pending_approval', 'approved', 'rejected', 'completed')
  ),
  confidence_level text not null default 'moderate' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  package_components jsonb not null default '[]'::jsonb,
  recommendation text not null default '' check (char_length(recommendation) <= 500),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, decision_key)
);

alter table public.organization_companion_executive_decisions enable row level security;
revoke all on public.organization_companion_executive_decisions from authenticated, anon;

create table if not exists public.organization_companion_executive_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  approval_key text not null,
  approval_title text not null,
  approval_status text not null default 'pending' check (
    approval_status in ('pending', 'approved', 'denied', 'expired')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  financial_impact text not null default '' check (char_length(financial_impact) <= 500),
  risk_impact text not null default '' check (char_length(risk_impact) <= 500),
  decision_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, approval_key)
);

alter table public.organization_companion_executive_approvals enable row level security;
revoke all on public.organization_companion_executive_approvals from authenticated, anon;

create table if not exists public.organization_companion_executive_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  recommendation_type text not null default 'strategic' check (
    recommendation_type in ('strategic', 'revenue', 'risk', 'opportunity', 'operational', 'custom')
  ),
  recommendation_status text not null default 'active' check (
    recommendation_status in ('active', 'reviewing', 'accepted', 'dismissed')
  ),
  confidence_level text not null default 'moderate' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recommendation_key)
);

alter table public.organization_companion_executive_recommendations enable row level security;
revoke all on public.organization_companion_executive_recommendations from authenticated, anon;

create table if not exists public.organization_companion_executive_execution (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  execution_key text not null,
  execution_title text not null,
  execution_status text not null default 'queued' check (
    execution_status in ('queued', 'in_progress', 'completed', 'failed', 'cancelled')
  ),
  approval_key text not null default '',
  decision_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, execution_key)
);

alter table public.organization_companion_executive_execution enable row level security;
revoke all on public.organization_companion_executive_execution from authenticated, anon;

create table if not exists public.organization_companion_executive_board_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  report_key text not null,
  report_title text not null,
  report_type text not null check (
    report_type in ('board', 'investor', 'management', 'operational', 'strategic', 'custom')
  ),
  report_status text not null default 'ready' check (
    report_status in ('generating', 'ready', 'exported', 'archived')
  ),
  export_formats jsonb not null default '["pdf","word","presentation"]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, report_key)
);

alter table public.organization_companion_executive_board_reports enable row level security;
revoke all on public.organization_companion_executive_board_reports from authenticated, anon;

create table if not exists public.organization_companion_executive_scenarios (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scenario_key text not null,
  scenario_title text not null,
  scenario_type text not null check (
    scenario_type in ('market_entry', 'acquisition', 'hiring', 'business_pack_launch', 'investment', 'custom')
  ),
  scenario_status text not null default 'ready' check (
    scenario_status in ('preparing', 'ready', 'reviewed', 'archived')
  ),
  confidence_level text not null default 'moderate' check (
    confidence_level in ('high', 'moderate', 'limited')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, scenario_key)
);

alter table public.organization_companion_executive_scenarios enable row level security;
revoke all on public.organization_companion_executive_scenarios from authenticated, anon;

create table if not exists public.organization_companion_executive_monitoring (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  monitor_key text not null,
  monitor_title text not null,
  monitor_area text not null check (
    monitor_area in (
      'revenue', 'profitability', 'growth', 'customer_health',
      'partner_health', 'operational_health', 'strategic_health', 'overall'
    )
  ),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'watch', 'at_risk', 'critical')
  ),
  health_score numeric(5,2) not null default 0 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, monitor_key)
);

alter table public.organization_companion_executive_monitoring enable row level security;
revoke all on public.organization_companion_executive_monitoring from authenticated, anon;

create table if not exists public.organization_companion_executive_command_prompts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  prompt_key text not null,
  prompt_text text not null,
  prompt_category text not null default 'general' check (
    prompt_category in ('briefing', 'decision', 'risk', 'report', 'strategy', 'general')
  ),
  unique (organization_id, prompt_key)
);

alter table public.organization_companion_executive_command_prompts enable row level security;
revoke all on public.organization_companion_executive_command_prompts from authenticated, anon;

create table if not exists public.organization_companion_executive_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'executive' check (
    metric_category in ('executive', 'decisions', 'briefings', 'approvals', 'strategy')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_executive_analytics enable row level security;
revoke all on public.organization_companion_executive_analytics from authenticated, anon;

create table if not exists public.organization_companion_executive_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'executive' check (
    audit_category in (
      'briefing', 'decision', 'approval', 'execution', 'report',
      'scenario', 'recommendation', 'executive'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_executive_audit_logs_org_idx
  on public.organization_companion_executive_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_executive_audit_logs enable row level security;
revoke all on public.organization_companion_executive_audit_logs from authenticated, anon;

create or replace function public._cmec570_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmec570_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'executive'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_executive_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'executive'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmec570_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_executive_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmec570_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_executive_briefings where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_executive_briefings (
    organization_id, briefing_key, briefing_title, briefing_type, briefing_status, content_areas, summary
  ) values
    (p_org_id, 'brf_daily', 'Daily Executive Briefing', 'daily', 'ready',
     '["revenue","risks","customers","opportunities"]'::jsonb,
     'Daily briefing — revenue, risks, customers, and priority items.'),
    (p_org_id, 'brf_weekly', 'Weekly Executive Briefing', 'weekly', 'ready',
     '["revenue","partners","projects","strategic_changes"]'::jsonb,
     'Weekly briefing — organizational health and strategic changes.'),
    (p_org_id, 'brf_monthly', 'Monthly Executive Briefing', 'monthly', 'preparing',
     '["revenue","risks","customers","partners","opportunities"]'::jsonb,
     'Monthly briefing in preparation — full organizational review.'),
    (p_org_id, 'brf_quarterly', 'Quarterly Executive Briefing', 'quarterly', 'ready',
     '["revenue","strategic_changes","future_readiness"]'::jsonb,
     'Quarterly briefing — strategic progress and future readiness.');

  insert into public.organization_companion_executive_decisions (
    organization_id, decision_key, decision_title, decision_type, decision_status,
    confidence_level, package_components, recommendation, summary
  ) values
    (p_org_id, 'dec_sweden', 'Expand to Sweden', 'expansion', 'options_ready', 'moderate',
     '["situation","background","data","forecast","risks","opportunities","alternatives","recommendation"]'::jsonb,
     'Proceed with phased market entry — moderate confidence with defined milestones.',
     'Decision package ready — expand to Sweden with complete analysis.'),
    (p_org_id, 'dec_hiring', 'Hire Additional Staff', 'hiring', 'analysis', 'high',
     '["situation","background","forecast","risks","alternatives"]'::jsonb,
     'Approve 12 additional staff for support and operations — high confidence.'),
    (p_org_id, 'dec_domain', 'Open New Domain', 'domain', 'pending_approval', 'moderate',
     '["situation","data","risks","recommendation"]'::jsonb,
     'Launch new domain for partner channel — approval required.'),
    (p_org_id, 'dec_bpack', 'Install New Business Pack', 'business_pack', 'requested', 'high',
     '["situation","background","forecast","recommendation"]'::jsonb,
     'Install Warehouse Pack — high confidence based on operational needs.');

  insert into public.organization_companion_executive_approvals (
    organization_id, approval_key, approval_title, approval_status, priority,
    financial_impact, risk_impact, decision_key, summary
  ) values
    (p_org_id, 'appr_domain', 'New Domain Launch Approval', 'pending', 'high',
     'Estimated €15,000 setup cost', 'Low operational risk with defined rollback',
     'dec_domain', 'Executive approval required — domain launch with financial impact.'),
    (p_org_id, 'appr_hiring', 'Staff Expansion Approval', 'pending', 'moderate',
     'Annual cost increase €480,000', 'Moderate risk — capacity planning validated',
     'dec_hiring', 'Hiring approval — 12 staff across support and operations.'),
    (p_org_id, 'appr_acquisition', 'Acquisition Review Approval', 'pending', 'critical',
     'Due diligence budget €25,000', 'High risk — strategic acquisition opportunity',
     '', 'Acquisition opportunity — executive review required.');

  insert into public.organization_companion_executive_recommendations (
    organization_id, recommendation_key, recommendation_title, recommendation_type,
    recommendation_status, confidence_level, summary
  ) values
    (p_org_id, 'rec_revenue_risk', 'Revenue Risk — Review Forecast', 'revenue', 'active', 'high',
     'Revenue forecast changed — review recommended before quarterly close.'),
    (p_org_id, 'rec_market_opp', 'Market Opportunity — Nordic Expansion', 'opportunity', 'reviewing', 'moderate',
     'Market intelligence suggests Nordic expansion opportunity.'),
    (p_org_id, 'rec_customer', 'Customer Health — Strategic Accounts', 'operational', 'active', 'high',
     'Support Pack — review top customer health metrics.'),
    (p_org_id, 'rec_strategic', 'Strategic Initiative Delay', 'strategic', 'active', 'moderate',
     'Future Readiness — one strategic initiative requires executive attention.');

  insert into public.organization_companion_executive_execution (
    organization_id, execution_key, execution_title, execution_status, approval_key, decision_key, summary
  ) values
    (p_org_id, 'exe_briefing', 'Weekly Briefing Distribution', 'completed', '', 'brf_weekly',
     'Weekly executive briefing distributed to leadership team.'),
    (p_org_id, 'exe_domain', 'Domain Launch Preparation', 'queued', 'appr_domain', 'dec_domain',
     'Awaiting approval — domain launch execution queued.'),
    (p_org_id, 'exe_report', 'Board Report Generation', 'in_progress', '', '',
     'Board report generation in progress — PDF export pending.');

  insert into public.organization_companion_executive_board_reports (
    organization_id, report_key, report_title, report_type, report_status, export_formats, summary
  ) values
    (p_org_id, 'rpt_board_q1', 'Q1 Board Report', 'board', 'ready',
     '["pdf","word","presentation"]'::jsonb,
     'Q1 board report ready — export to PDF, Word, or presentation.'),
    (p_org_id, 'rpt_investor', 'Investor Update Report', 'investor', 'ready',
     '["pdf","presentation"]'::jsonb,
     'Investor update report — revenue, growth, and strategic progress.'),
    (p_org_id, 'rpt_management', 'Management Operations Report', 'management', 'generating',
     '["pdf","word"]'::jsonb,
     'Management report generating — operational metrics included.'),
    (p_org_id, 'rpt_strategic', 'Strategic Progress Report', 'strategic', 'ready',
     '["pdf","word","presentation"]'::jsonb,
     'Strategic progress report — initiatives, risks, and opportunities.');

  insert into public.organization_companion_executive_scenarios (
    organization_id, scenario_key, scenario_title, scenario_type, scenario_status, confidence_level, summary
  ) values
    (p_org_id, 'scen_market', 'Should we enter a new market?', 'market_entry', 'ready', 'moderate',
     'Executive scenario — market entry simulation with forecast and risk analysis.'),
    (p_org_id, 'scen_acquire', 'Should we acquire a company?', 'acquisition', 'ready', 'limited',
     'Acquisition scenario — limited confidence pending due diligence.'),
    (p_org_id, 'scen_hire50', 'Should we hire 50 employees?', 'hiring', 'reviewed', 'moderate',
     'Hiring scenario — capacity and financial impact modeled.'),
    (p_org_id, 'scen_bpack', 'Should we launch a new Business Pack?', 'business_pack_launch', 'ready', 'high',
     'Business Pack launch scenario — high confidence based on customer demand.');

  insert into public.organization_companion_executive_monitoring (
    organization_id, monitor_key, monitor_title, monitor_area, health_status, health_score, summary
  ) values
    (p_org_id, 'mon_revenue', 'Revenue Health', 'revenue', 'watch', 72,
     'Revenue trending — watch forecast variance.'),
    (p_org_id, 'mon_profit', 'Profitability', 'profitability', 'healthy', 85,
     'Profitability healthy — margins within target range.'),
    (p_org_id, 'mon_growth', 'Growth', 'growth', 'healthy', 78,
     'Growth metrics positive — partner channel expanding.'),
    (p_org_id, 'mon_customer', 'Customer Health', 'customer_health', 'watch', 68,
     'Support Pack — customer health requires executive attention.'),
    (p_org_id, 'mon_partner', 'Partner Health', 'partner_health', 'healthy', 82,
     'Partner Pack — partner performance improving.'),
    (p_org_id, 'mon_operational', 'Operational Health', 'operational_health', 'healthy', 80,
     'Warehouse Pack — operations running smoothly.'),
    (p_org_id, 'mon_strategic', 'Strategic Health', 'strategic_health', 'watch', 74,
     'Future Readiness — strategic initiative progress on track with one delay.'),
    (p_org_id, 'mon_overall', 'Organization Health', 'overall', 'healthy', 77,
     'Overall organizational health — executive visibility active.');

  insert into public.organization_companion_executive_command_prompts (
    organization_id, prompt_key, prompt_text, prompt_category
  ) values
    (p_org_id, 'cmd_overdue', 'Show overdue approvals', 'general'),
    (p_org_id, 'cmd_monthly', 'Prepare monthly report', 'report'),
    (p_org_id, 'cmd_inventory', 'Review inventory risk', 'risk'),
    (p_org_id, 'cmd_customer', 'Summarize customer activity', 'briefing'),
    (p_org_id, 'cmd_board', 'Generate board briefing', 'briefing'),
    (p_org_id, 'cmd_initiatives', 'Compare strategic initiatives', 'strategy'),
    (p_org_id, 'cmd_yesterday', 'What changed since yesterday?', 'general'),
    (p_org_id, 'cmd_focus', 'What should I focus on today?', 'general'),
    (p_org_id, 'cmd_risks', 'Where are our biggest risks?', 'risk'),
    (p_org_id, 'cmd_opportunities', 'What opportunities exist?', 'strategy');

  insert into public.organization_companion_executive_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_org_health', 'Organization Health Score', 77, 'executive'),
    (p_org_id, 'metric_pending_decisions', 'Pending Decisions', 4, 'decisions'),
    (p_org_id, 'metric_pending_approvals', 'Pending Approvals', 3, 'approvals'),
    (p_org_id, 'metric_briefings_ready', 'Briefings Ready', 3, 'briefings'),
    (p_org_id, 'metric_active_recommendations', 'Active Recommendations', 4, 'executive');
end; $$;

-- Main center RPC (continued in same file due to size)

create or replace function public.get_organization_companion_executive_copilot_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_briefings jsonb; v_decisions jsonb;
  v_approvals jsonb; v_recommendations jsonb; v_execution jsonb; v_reports jsonb;
  v_scenarios jsonb; v_monitoring jsonb; v_strategy jsonb; v_executive jsonb;
  v_integrations jsonb; v_audit jsonb; v_commands jsonb;
begin
  v_org_id := public._cmec570_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmec570_ensure_settings(v_org_id);
  perform public._cmec570_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'organization_health', coalesce((select metric_value from public.organization_companion_executive_analytics where organization_id = v_org_id and metric_key = 'metric_org_health'), 75),
    'strategic_health', coalesce((select health_score from public.organization_companion_executive_monitoring where organization_id = v_org_id and monitor_area = 'strategic_health'), 75),
    'revenue_health', coalesce((select health_score from public.organization_companion_executive_monitoring where organization_id = v_org_id and monitor_area = 'revenue'), 75),
    'pending_decisions', (select count(*) from public.organization_companion_executive_decisions where organization_id = v_org_id and decision_status in ('requested', 'analysis', 'options_ready', 'pending_approval')),
    'pending_approvals', (select count(*) from public.organization_companion_executive_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'briefings_ready', (select count(*) from public.organization_companion_executive_briefings where organization_id = v_org_id and briefing_status = 'ready'),
    'reports_ready', (select count(*) from public.organization_companion_executive_board_reports where organization_id = v_org_id and report_status = 'ready'),
    'active_recommendations', (select count(*) from public.organization_companion_executive_recommendations where organization_id = v_org_id and recommendation_status = 'active'),
    'execution_in_progress', (select count(*) from public.organization_companion_executive_execution where organization_id = v_org_id and execution_status = 'in_progress'),
    'scenarios_ready', (select count(*) from public.organization_companion_executive_scenarios where organization_id = v_org_id and scenario_status = 'ready')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title, 'briefing_type', b.briefing_type,
    'briefing_status', b.briefing_status, 'content_areas', b.content_areas, 'summary', b.summary
  ) order by b.briefing_type), '[]'::jsonb)
  into v_briefings from public.organization_companion_executive_briefings b where b.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'decision_key', d.decision_key, 'decision_title', d.decision_title, 'decision_type', d.decision_type,
    'decision_status', d.decision_status, 'confidence_level', d.confidence_level,
    'package_components', d.package_components, 'recommendation', d.recommendation, 'summary', d.summary
  ) order by d.decision_title), '[]'::jsonb)
  into v_decisions from public.organization_companion_executive_decisions d where d.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'approval_key', a.approval_key, 'approval_title', a.approval_title, 'approval_status', a.approval_status,
    'priority', a.priority, 'financial_impact', a.financial_impact, 'risk_impact', a.risk_impact,
    'decision_key', a.decision_key, 'summary', a.summary
  ) order by case a.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_approvals from public.organization_companion_executive_approvals a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
    'recommendation_type', r.recommendation_type, 'recommendation_status', r.recommendation_status,
    'confidence_level', r.confidence_level, 'summary', r.summary
  ) order by r.recommendation_title), '[]'::jsonb)
  into v_recommendations from public.organization_companion_executive_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'execution_key', e.execution_key, 'execution_title', e.execution_title, 'execution_status', e.execution_status,
    'approval_key', e.approval_key, 'decision_key', e.decision_key, 'summary', e.summary
  ) order by e.execution_title), '[]'::jsonb)
  into v_execution from public.organization_companion_executive_execution e where e.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'report_key', r.report_key, 'report_title', r.report_title, 'report_type', r.report_type,
    'report_status', r.report_status, 'export_formats', r.export_formats, 'summary', r.summary
  ) order by r.report_title), '[]'::jsonb)
  into v_reports from public.organization_companion_executive_board_reports r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'scenario_key', s.scenario_key, 'scenario_title', s.scenario_title, 'scenario_type', s.scenario_type,
    'scenario_status', s.scenario_status, 'confidence_level', s.confidence_level, 'summary', s.summary
  ) order by s.scenario_title), '[]'::jsonb)
  into v_scenarios from public.organization_companion_executive_scenarios s where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'monitor_key', m.monitor_key, 'monitor_title', m.monitor_title, 'monitor_area', m.monitor_area,
    'health_status', m.health_status, 'health_score', m.health_score, 'summary', m.summary
  ) order by m.health_score asc), '[]'::jsonb)
  into v_monitoring from public.organization_companion_executive_monitoring m where m.organization_id = v_org_id;

  select jsonb_build_object(
    'scenarios', v_scenarios,
    'monitoring', v_monitoring,
    'future_readiness_link', '/app/future-readiness',
    'strategic_initiatives', coalesce((
      select jsonb_agg(jsonb_build_object('title', r.recommendation_title, 'type', r.recommendation_type))
      from public.organization_companion_executive_recommendations r
      where r.organization_id = v_org_id and r.recommendation_type = 'strategic'
    ), '[]'::jsonb)
  ) into v_strategy;

  select coalesce(jsonb_agg(jsonb_build_object(
    'prompt_key', p.prompt_key, 'prompt_text', p.prompt_text, 'prompt_category', p.prompt_category
  ) order by p.prompt_category), '[]'::jsonb)
  into v_commands from public.organization_companion_executive_command_prompts p where p.organization_id = v_org_id;

  select jsonb_build_object(
    'organization_health', coalesce((select metric_value from public.organization_companion_executive_analytics where organization_id = v_org_id and metric_key = 'metric_org_health'), 77),
    'strategic_health', coalesce((select health_score from public.organization_companion_executive_monitoring where organization_id = v_org_id and monitor_area = 'strategic_health'), 74),
    'revenue_health', coalesce((select health_score from public.organization_companion_executive_monitoring where organization_id = v_org_id and monitor_area = 'revenue'), 72),
    'risk_overview', (select count(*) from public.organization_companion_executive_monitoring where organization_id = v_org_id and health_status in ('watch', 'at_risk', 'critical')),
    'future_readiness', 74,
    'decision_queue', (select count(*) from public.organization_companion_executive_decisions where organization_id = v_org_id and decision_status in ('requested', 'analysis', 'options_ready', 'pending_approval')),
    'companion_recommendations', 4
  ) into v_executive;

  select jsonb_build_object(
    'natural_language_commands', v_commands,
    'executive_advisor_prompts', jsonb_build_array(
      'Prepare quarterly review', 'Summarize market developments', 'Identify revenue risks',
      'Review acquisition opportunity', 'Generate executive summary'
    ),
    'strategic_intelligence', jsonb_build_object('route', '/app/executive-intelligence'),
    'market_intelligence', jsonb_build_object('route', '/app/market-intelligence'),
    'future_readiness', jsonb_build_object('phase', '566', 'route', '/app/future-readiness'),
    'simulation_engine', jsonb_build_object('route', '/app/business-digital-twin'),
    'autopilot_integration', jsonb_build_object('phase', '569', 'route', '/app/autopilot'),
    'proactive_integration', jsonb_build_object('phase', '568', 'route', '/app/proactive'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Financial briefing',
      'support_pack', 'Customer health briefing',
      'warehouse_pack', 'Operational briefing',
      'partner_pack', 'Growth briefing',
      'route', '/app/settings/modules'
    )
  ) into v_integrations;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_executive_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Leaders should not need to navigate 100 screens — ask, and Companion understands, prepares, coordinates, and executes approved actions.',
    'philosophy', 'Executives spend less time searching and more time deciding — Companion transforms information into clarity and complexity into action.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'briefings', v_briefings,
    'executive_briefings', v_briefings,
    'decisions', v_decisions,
    'approvals', v_approvals,
    'recommendations', v_recommendations,
    'execution', v_execution,
    'board_reports', v_reports,
    'reports', jsonb_build_object(
      'board_reports', v_reports,
      'executive_activity', (select count(*) from public.organization_companion_executive_execution where organization_id = v_org_id),
      'decision_outcomes', (select count(*) from public.organization_companion_executive_decisions where organization_id = v_org_id and decision_status = 'completed'),
      'companion_recommendations', jsonb_build_array(
        jsonb_build_object('title', 'Review revenue forecast variance', 'reason', 'Revenue health watch status'),
        jsonb_build_object('title', 'Approve domain launch', 'reason', 'Pending executive approval'),
        jsonb_build_object('title', 'Review Nordic expansion scenario', 'reason', 'Market opportunity detected')
      )
    ),
    'strategy', v_strategy,
    'scenarios', v_scenarios,
    'monitoring', v_monitoring,
    'executive_monitoring', v_monitoring,
    'natural_language_commands', v_commands,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'executive_copilot', '/app/executive-copilot',
      'decisions', '/app/executive-copilot/decisions',
      'board_reports', '/app/executive-copilot/board-reports',
      'approvals', '/app/approvals',
      'future_readiness', '/app/future-readiness'
    ),
    'notifications', jsonb_build_object(
      'executive_approval_required', true, 'strategic_risk_identified', true,
      'revenue_change_detected', true, 'market_opportunity_detected', true,
      'decision_package_ready', true, 'board_report_available', true
    ),
    'mobile_access', jsonb_build_object(
      'review_briefings', true, 'review_decisions', true, 'approve_actions', true,
      'review_risks', true, 'generate_reports', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_executive_copilot_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_briefing_key text := coalesce(p_payload->>'briefing_key', '');
  v_decision_key text := coalesce(p_payload->>'decision_key', '');
  v_approval_key text := coalesce(p_payload->>'approval_key', '');
  v_report_key text := coalesce(p_payload->>'report_key', '');
  v_scenario_key text := coalesce(p_payload->>'scenario_key', '');
begin
  v_org_id := public._cmec570_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'generate_briefing' then
    insert into public.organization_companion_executive_briefings (
      organization_id, briefing_key, briefing_title, briefing_type, briefing_status, content_areas, summary
    ) values (
      v_org_id, 'brf_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'briefing_title', 'Executive Briefing'),
      coalesce(p_payload->>'briefing_type', 'custom'),
      'ready',
      '["revenue","risks","customers","opportunities"]'::jsonb,
      coalesce(p_payload->>'summary', 'Executive briefing generated by Companion.')
    );
    perform public._cmec570_log(v_org_id, 'briefing_generated', 'Briefing generated', p_payload, 'briefing');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'create_decision_package' then
    insert into public.organization_companion_executive_decisions (
      organization_id, decision_key, decision_title, decision_type, decision_status,
      confidence_level, package_components, recommendation, summary
    ) values (
      v_org_id, 'dec_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'decision_title', 'New Decision'),
      coalesce(p_payload->>'decision_type', 'custom'),
      'options_ready',
      coalesce(p_payload->>'confidence_level', 'moderate'),
      '["situation","background","data","forecast","risks","opportunities","alternatives","recommendation"]'::jsonb,
      coalesce(p_payload->>'recommendation', ''),
      coalesce(p_payload->>'summary', 'Decision package created — complete analysis prepared.')
    );
    perform public._cmec570_log(v_org_id, 'decision_package_created', 'Decision package created', p_payload, 'decision');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_executive_item' and v_approval_key <> '' then
    update public.organization_companion_executive_approvals
    set approval_status = 'approved' where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmec570_log(v_org_id, 'approval_granted', 'Executive approval granted', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'deny_executive_item' and v_approval_key <> '' then
    update public.organization_companion_executive_approvals
    set approval_status = 'denied' where organization_id = v_org_id and approval_key = v_approval_key;
    perform public._cmec570_log(v_org_id, 'approval_denied', 'Executive approval denied', p_payload, 'approval');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_board_report' then
    insert into public.organization_companion_executive_board_reports (
      organization_id, report_key, report_title, report_type, report_status, export_formats, summary
    ) values (
      v_org_id, 'rpt_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'report_title', 'Board Report'),
      coalesce(p_payload->>'report_type', 'board'),
      'ready',
      '["pdf","word","presentation"]'::jsonb,
      coalesce(p_payload->>'summary', 'Board report generated — export available.')
    );
    perform public._cmec570_log(v_org_id, 'executive_report_generated', 'Executive report generated', p_payload, 'report');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'run_scenario' and v_scenario_key <> '' then
    update public.organization_companion_executive_scenarios
    set scenario_status = 'reviewed' where organization_id = v_org_id and scenario_key = v_scenario_key;
    perform public._cmec570_log(v_org_id, 'scenario_executed', 'Executive scenario executed', p_payload, 'scenario');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_executive' then
    perform public._cmec570_log(v_org_id, 'executive_refreshed', 'Executive copilot center refreshed', p_payload, 'executive');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_executive_copilot_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmec570_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_executive_copilot_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/executive-copilot');
end; $$;

create or replace function public.get_assistant_companion_executive_copilot_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmec570_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion is the executive operating interface — ask, prepare, coordinate, execute approved actions.',
    'advisor_prompts', jsonb_build_array(
      'Prepare quarterly review', 'Summarize market developments', 'Identify revenue risks',
      'Review acquisition opportunity', 'Generate executive summary'
    ),
    'organization_health', coalesce((select metric_value from public.organization_companion_executive_analytics where organization_id = v_org_id and metric_key = 'metric_org_health'), 77),
    'pending_approvals', (select count(*) from public.organization_companion_executive_approvals where organization_id = v_org_id and approval_status = 'pending'),
    'pending_decisions', (select count(*) from public.organization_companion_executive_decisions where organization_id = v_org_id and decision_status in ('requested', 'analysis', 'options_ready', 'pending_approval')),
    'route', '/app/executive-copilot'
  );
end; $$;

grant execute on function public.get_organization_companion_executive_copilot_center(text) to authenticated;
grant execute on function public.perform_organization_companion_executive_copilot_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_executive_copilot_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_executive_copilot_advisor_context() to authenticated;
