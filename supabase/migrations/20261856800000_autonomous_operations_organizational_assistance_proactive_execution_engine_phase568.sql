-- Phase 568 — Autonomous Operations, Organizational Assistance & Proactive Execution Engine
-- Feature owner: CUSTOMER APP
-- Routes: /app/proactive, /app/proactive/watchlists
-- Helpers: _cmop568_*

create table if not exists public.organization_companion_proactive_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  proactive_enabled boolean not null default true,
  observation_engine_enabled boolean not null default true,
  prepared_action_approval_required boolean not null default true,
  audit_logging_required boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_proactive_settings enable row level security;
revoke all on public.organization_companion_proactive_settings from authenticated, anon;

create table if not exists public.organization_companion_proactive_observations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  observation_key text not null,
  observation_title text not null,
  observation_category text not null check (
    observation_category in (
      'operational', 'financial', 'customer', 'partner', 'inventory',
      'governance', 'compliance', 'strategic', 'custom'
    )
  ),
  observation_status text not null default 'informational' check (
    observation_status in ('informational', 'attention_required', 'immediate_review')
  ),
  source_area text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, observation_key)
);

alter table public.organization_companion_proactive_observations enable row level security;
revoke all on public.organization_companion_proactive_observations from authenticated, anon;

create table if not exists public.organization_companion_proactive_opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  opportunity_key text not null,
  opportunity_title text not null,
  opportunity_type text not null check (
    opportunity_type in (
      'workflow_automation', 'cost_reduction', 'revenue_expansion',
      'customer_success', 'partner_growth', 'inventory_optimization', 'custom'
    )
  ),
  opportunity_status text not null default 'identified' check (
    opportunity_status in ('identified', 'reviewing', 'approved', 'in_progress', 'completed', 'dismissed')
  ),
  impact_estimate text not null default '' check (char_length(impact_estimate) <= 500),
  business_pack_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, opportunity_key)
);

alter table public.organization_companion_proactive_opportunities enable row level security;
revoke all on public.organization_companion_proactive_opportunities from authenticated, anon;

create table if not exists public.organization_companion_proactive_prepared_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  action_key text not null,
  action_title text not null,
  action_type text not null check (
    action_type in (
      'approval_draft', 'meeting_agenda', 'executive_report', 'customer_summary',
      'project_plan', 'supplier_review', 'renewal_plan', 'decision_pack', 'custom'
    )
  ),
  action_status text not null default 'prepared' check (
    action_status in ('preparing', 'prepared', 'pending_approval', 'approved', 'rejected', 'delivered')
  ),
  related_observation_key text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, action_key)
);

alter table public.organization_companion_proactive_prepared_actions enable row level security;
revoke all on public.organization_companion_proactive_prepared_actions from authenticated, anon;

create table if not exists public.organization_companion_proactive_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation_key text not null,
  recommendation_title text not null,
  recommendation_type text not null default 'proactive' check (
    recommendation_type in ('proactive', 'opportunity', 'risk', 'health', 'strategic', 'custom')
  ),
  recommendation_status text not null default 'pending' check (
    recommendation_status in ('pending', 'approved', 'rejected', 'delivered', 'expired')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, recommendation_key)
);

alter table public.organization_companion_proactive_recommendations enable row level security;
revoke all on public.organization_companion_proactive_recommendations from authenticated, anon;

create table if not exists public.organization_companion_proactive_watchlists (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  watchlist_key text not null,
  watchlist_title text not null,
  watchlist_type text not null check (
    watchlist_type in (
      'customer', 'project', 'supplier', 'partner', 'domain',
      'business_pack', 'revenue_stream', 'custom'
    )
  ),
  watchlist_status text not null default 'active' check (
    watchlist_status in ('active', 'monitoring', 'alert', 'archived')
  ),
  items_count integer not null default 0,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, watchlist_key)
);

alter table public.organization_companion_proactive_watchlists enable row level security;
revoke all on public.organization_companion_proactive_watchlists from authenticated, anon;

create table if not exists public.organization_companion_proactive_decision_packs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  pack_key text not null,
  pack_title text not null,
  pack_status text not null default 'preparing' check (
    pack_status in ('preparing', 'ready', 'pending_approval', 'approved', 'archived')
  ),
  opportunity_key text not null default '',
  components jsonb not null default '[]'::jsonb,
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, pack_key)
);

alter table public.organization_companion_proactive_decision_packs enable row level security;
revoke all on public.organization_companion_proactive_decision_packs from authenticated, anon;

create table if not exists public.organization_companion_proactive_health (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  health_key text not null,
  health_area text not null check (
    health_area in (
      'workload', 'response_times', 'approvals', 'project_progress',
      'customer_activity', 'partner_activity', 'integration_health', 'overall'
    )
  ),
  health_status text not null default 'healthy' check (
    health_status in ('healthy', 'watch_closely', 'immediate_action')
  ),
  health_score numeric(5,2) not null default 0 check (health_score between 0 and 100),
  summary text not null default '' check (char_length(summary) <= 500),
  unique (organization_id, health_key)
);

alter table public.organization_companion_proactive_health enable row level security;
revoke all on public.organization_companion_proactive_health from authenticated, anon;

create table if not exists public.organization_companion_proactive_analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null,
  metric_title text not null,
  metric_value numeric(12,2) not null default 0,
  metric_category text not null default 'proactive' check (
    metric_category in ('proactive', 'observations', 'opportunities', 'recommendations', 'health')
  ),
  unique (organization_id, metric_key)
);

alter table public.organization_companion_proactive_analytics enable row level security;
revoke all on public.organization_companion_proactive_analytics from authenticated, anon;

create table if not exists public.organization_companion_proactive_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  audit_category text not null default 'proactive' check (
    audit_category in (
      'observation', 'opportunity', 'prepared_action', 'recommendation',
      'watchlist', 'decision_pack', 'health', 'proactive'
    )
  ),
  summary text not null default '',
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_proactive_audit_logs_org_idx
  on public.organization_companion_proactive_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_proactive_audit_logs enable row level security;
revoke all on public.organization_companion_proactive_audit_logs from authenticated, anon;

create or replace function public._cmop568_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._presence_tenant_for_auth();
$$;

create or replace function public._cmop568_log(
  p_org_id uuid, p_event_type text, p_summary text,
  p_context jsonb default '{}'::jsonb, p_category text default 'proactive'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_proactive_audit_logs (
    organization_id, actor_user_id, event_type, audit_category, summary, context
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_event_type, coalesce(p_category, 'proactive'), p_summary, coalesce(p_context, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmop568_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_proactive_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cmop568_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.organization_companion_proactive_observations where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organization_companion_proactive_observations (
    organization_id, observation_key, observation_title, observation_category,
    observation_status, source_area, summary
  ) values
    (p_org_id, 'obs_approval_queue', 'Approval Queue Growing', 'operational', 'attention_required', 'approvals',
     'Approval queue increased 40% this week — review pending items.'),
    (p_org_id, 'obs_revenue_decline', 'Revenue Declining', 'financial', 'immediate_review', 'revenue',
     'Revenue forecast changed significantly — executive review recommended.'),
    (p_org_id, 'obs_inventory_low', 'Inventory Running Low', 'inventory', 'attention_required', 'warehouse',
     'Key inventory items below reorder threshold — reorder within 10 days.'),
    (p_org_id, 'obs_customer_activity', 'Customer Activity Increasing', 'customer', 'informational', 'support',
     'Customer engagement up 25% — positive signal for retention.'),
    (p_org_id, 'obs_partner_performance', 'Partner Performance Improving', 'partner', 'informational', 'partners',
     'Growth Partner activity suggests expansion opportunity.');

  insert into public.organization_companion_proactive_opportunities (
    organization_id, opportunity_key, opportunity_title, opportunity_type,
    opportunity_status, impact_estimate, business_pack_key, summary
  ) values
    (p_org_id, 'opp_workflow_auto', 'Workflow Automation Opportunity', 'workflow_automation', 'identified',
     'Estimated 15 hours/week saved', 'pack_operations',
     'Repetitive approval workflow identified for automation.'),
    (p_org_id, 'opp_cost_reduction', 'Cost Reduction Opportunity', 'cost_reduction', 'reviewing',
     'Potential 8% operational savings', 'pack_finance',
     'Finance Pack identified budget optimization opportunity.'),
    (p_org_id, 'opp_revenue_expansion', 'Revenue Expansion Opportunity', 'revenue_expansion', 'identified',
     'New market segment identified', 'pack_sales',
     'Revenue Companion detected expansion opportunity in partner channel.'),
    (p_org_id, 'opp_customer_success', 'Customer Success Opportunity', 'customer_success', 'in_progress',
     'Retention improvement potential', 'pack_support',
     'Support Pack — proactive outreach recommended for at-risk accounts.'),
    (p_org_id, 'opp_inventory_opt', 'Inventory Optimization Opportunity', 'inventory_optimization', 'identified',
     'Reduce carrying costs 12%', 'pack_warehouse',
     'Warehouse Pack — inventory reorder optimization available.');

  insert into public.organization_companion_proactive_prepared_actions (
    organization_id, action_key, action_title, action_type, action_status,
    related_observation_key, summary
  ) values
    (p_org_id, 'act_approval_draft', 'Approval Queue Review Draft', 'approval_draft', 'prepared', 'obs_approval_queue',
     'Companion prepared approval queue summary — humans approve before action.'),
    (p_org_id, 'act_exec_report', 'Executive Revenue Report', 'executive_report', 'pending_approval', 'obs_revenue_decline',
     'Executive report on revenue forecast change — approval required.'),
    (p_org_id, 'act_renewal_plan', 'Contract Renewal Plan', 'renewal_plan', 'prepared', '',
     'A contract expires in 30 days — renewal plan prepared.'),
    (p_org_id, 'act_supplier_review', 'Supplier Performance Review', 'supplier_review', 'prepared', '',
     'Supplier review prepared — quarterly assessment ready.'),
    (p_org_id, 'act_decision_pack', 'Market Expansion Decision Pack', 'decision_pack', 'pending_approval', 'opp_revenue_expansion',
     'Decision pack ready — market analysis, forecast, risk, recommended actions.');

  insert into public.organization_companion_proactive_recommendations (
    organization_id, recommendation_key, recommendation_title, recommendation_type,
    recommendation_status, priority, summary
  ) values
    (p_org_id, 'rec_contract_expiry', 'Contract Expires in 30 Days', 'proactive', 'pending', 'high',
     'A contract expires in 30 days — review renewal terms.'),
    (p_org_id, 'rec_inventory_reorder', 'Inventory Reorder Within 10 Days', 'proactive', 'pending', 'moderate',
     'Inventory should be reordered within 10 days to avoid stockout.'),
    (p_org_id, 'rec_support_workload', 'Support Workload Increasing', 'risk', 'pending', 'high',
     'Support workload is increasing — consider capacity planning.'),
    (p_org_id, 'rec_revenue_forecast', 'Revenue Forecast Changed', 'strategic', 'pending', 'critical',
     'Revenue forecast changed significantly — strategic review recommended.'),
    (p_org_id, 'rec_partner_expansion', 'Partner Expansion Opportunity', 'opportunity', 'approved', 'moderate',
     'Growth Partner activity suggests expansion opportunity — approved for review.');

  insert into public.organization_companion_proactive_watchlists (
    organization_id, watchlist_key, watchlist_title, watchlist_type, watchlist_status, items_count, summary
  ) values
    (p_org_id, 'wl_strategic_customers', 'Strategic Customers', 'customer', 'active', 12,
     'High-value customer accounts under continuous observation.'),
    (p_org_id, 'wl_high_risk_suppliers', 'High-Risk Suppliers', 'supplier', 'alert', 4,
     'Suppliers with elevated risk — dependency monitoring active.'),
    (p_org_id, 'wl_key_projects', 'Key Projects', 'project', 'monitoring', 8,
     'Critical projects tracked for progress and blockers.'),
    (p_org_id, 'wl_critical_domains', 'Critical Domains', 'domain', 'active', 3,
     'Primary domains and integrations under watch.'),
    (p_org_id, 'wl_revenue_streams', 'Revenue Streams', 'revenue_stream', 'monitoring', 6,
     'Revenue streams monitored for trends and anomalies.');

  insert into public.organization_companion_proactive_decision_packs (
    organization_id, pack_key, pack_title, pack_status, opportunity_key, components, summary
  ) values
    (p_org_id, 'dp_market_expansion', 'New Market Opportunity Decision Pack', 'ready', 'opp_revenue_expansion',
     '["market_analysis","revenue_forecast","risk_analysis","recommended_actions"]'::jsonb,
     'Market analysis, revenue forecast, risk analysis, and recommended actions — decision pack ready.'),
    (p_org_id, 'dp_cost_optimization', 'Cost Optimization Decision Pack', 'preparing', 'opp_cost_reduction',
     '["cost_analysis","savings_forecast","implementation_plan"]'::jsonb,
     'Cost optimization decision pack in preparation.');

  insert into public.organization_companion_proactive_health (
    organization_id, health_key, health_area, health_status, health_score, summary
  ) values
    (p_org_id, 'health_workload', 'workload', 'watch_closely', 68,
     'Workload elevated — response times may be affected.'),
    (p_org_id, 'health_approvals', 'approvals', 'immediate_action', 52,
     'Approval queue growing — immediate action required.'),
    (p_org_id, 'health_customer', 'customer_activity', 'healthy', 88,
     'Customer activity healthy — engagement trending positive.'),
    (p_org_id, 'health_partner', 'partner_activity', 'healthy', 82,
     'Partner activity healthy — growth signals detected.'),
    (p_org_id, 'health_integrations', 'integration_health', 'healthy', 91,
     'Integration health strong — all connectors operational.'),
    (p_org_id, 'health_overall', 'overall', 'watch_closely', 74,
     'Overall operational health — watch approval and workload areas.');

  insert into public.organization_companion_proactive_analytics (
    organization_id, metric_key, metric_title, metric_value, metric_category
  ) values
    (p_org_id, 'metric_observations', 'Active Observations', 5, 'observations'),
    (p_org_id, 'metric_opportunities', 'Identified Opportunities', 5, 'opportunities'),
    (p_org_id, 'metric_prepared_actions', 'Prepared Actions Ready', 3, 'proactive'),
    (p_org_id, 'metric_pending_recommendations', 'Pending Recommendations', 4, 'recommendations'),
    (p_org_id, 'metric_health_score', 'Operational Health Score', 74, 'health');
end; $$;

create or replace function public.get_organization_companion_proactive_center(p_section text default 'overview')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_org jsonb; v_overview jsonb; v_observations jsonb; v_opportunities jsonb;
  v_prepared jsonb; v_recommendations jsonb; v_watchlists jsonb; v_insights jsonb;
  v_reports jsonb; v_executive jsonb; v_integrations jsonb; v_audit jsonb; v_health jsonb;
  v_feed jsonb; v_approvals jsonb;
begin
  v_org_id := public._cmop568_org();
  if v_org_id is null then return jsonb_build_object('found', false, 'error', 'Organization not found'); end if;

  perform public._cmop568_ensure_settings(v_org_id);
  perform public._cmop568_seed(v_org_id);

  select jsonb_build_object('id', o.id, 'name', o.name) into v_org from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'observation_count', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id),
    'attention_required', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id and observation_status = 'attention_required'),
    'immediate_review', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id and observation_status = 'immediate_review'),
    'opportunities_identified', (select count(*) from public.organization_companion_proactive_opportunities where organization_id = v_org_id and opportunity_status in ('identified', 'reviewing')),
    'prepared_actions_ready', (select count(*) from public.organization_companion_proactive_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'pending_recommendations', (select count(*) from public.organization_companion_proactive_recommendations where organization_id = v_org_id and recommendation_status = 'pending'),
    'watchlists_active', (select count(*) from public.organization_companion_proactive_watchlists where organization_id = v_org_id and watchlist_status in ('active', 'monitoring', 'alert')),
    'health_score', coalesce((select metric_value from public.organization_companion_proactive_analytics where organization_id = v_org_id and metric_key = 'metric_health_score'), 75),
    'decision_packs_ready', (select count(*) from public.organization_companion_proactive_decision_packs where organization_id = v_org_id and pack_status = 'ready')
  ) into v_overview;

  select coalesce(jsonb_agg(jsonb_build_object(
    'observation_key', o.observation_key, 'observation_title', o.observation_title,
    'observation_category', o.observation_category, 'observation_status', o.observation_status,
    'source_area', o.source_area, 'summary', o.summary
  ) order by case o.observation_status when 'immediate_review' then 1 when 'attention_required' then 2 else 3 end), '[]'::jsonb)
  into v_observations from public.organization_companion_proactive_observations o where o.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'opportunity_key', op.opportunity_key, 'opportunity_title', op.opportunity_title,
    'opportunity_type', op.opportunity_type, 'opportunity_status', op.opportunity_status,
    'impact_estimate', op.impact_estimate, 'business_pack_key', op.business_pack_key, 'summary', op.summary
  ) order by op.opportunity_title), '[]'::jsonb)
  into v_opportunities from public.organization_companion_proactive_opportunities op where op.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'action_key', a.action_key, 'action_title', a.action_title, 'action_type', a.action_type,
    'action_status', a.action_status, 'related_observation_key', a.related_observation_key, 'summary', a.summary
  ) order by a.action_title), '[]'::jsonb)
  into v_prepared from public.organization_companion_proactive_prepared_actions a where a.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
    'recommendation_type', r.recommendation_type, 'recommendation_status', r.recommendation_status,
    'priority', r.priority, 'summary', r.summary
  ) order by case r.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end), '[]'::jsonb)
  into v_recommendations from public.organization_companion_proactive_recommendations r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'watchlist_key', w.watchlist_key, 'watchlist_title', w.watchlist_title,
    'watchlist_type', w.watchlist_type, 'watchlist_status', w.watchlist_status,
    'items_count', w.items_count, 'summary', w.summary
  ) order by w.watchlist_title), '[]'::jsonb)
  into v_watchlists from public.organization_companion_proactive_watchlists w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'health_key', h.health_key, 'health_area', h.health_area, 'health_status', h.health_status,
    'health_score', h.health_score, 'summary', h.summary
  ) order by h.health_score asc), '[]'::jsonb)
  into v_health from public.organization_companion_proactive_health h where h.organization_id = v_org_id;

  select jsonb_build_object(
    'observation_feed', coalesce((
      select jsonb_agg(jsonb_build_object(
        'type', 'observation', 'title', o.observation_title, 'status', o.observation_status, 'summary', o.summary
      ) order by o.observation_title)
      from public.organization_companion_proactive_observations o where o.organization_id = v_org_id limit 5
    ), '[]'::jsonb),
    'new_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', op.opportunity_title, 'type', op.opportunity_type, 'summary', op.summary))
      from public.organization_companion_proactive_opportunities op
      where op.organization_id = v_org_id and op.opportunity_status = 'identified'
    ), '[]'::jsonb),
    'prepared_actions', coalesce((
      select jsonb_agg(jsonb_build_object('title', a.action_title, 'type', a.action_type, 'status', a.action_status))
      from public.organization_companion_proactive_prepared_actions a
      where a.organization_id = v_org_id and a.action_status in ('prepared', 'pending_approval')
    ), '[]'::jsonb),
    'priority_items', coalesce((
      select jsonb_agg(jsonb_build_object('title', r.recommendation_title, 'priority', r.priority))
      from public.organization_companion_proactive_recommendations r
      where r.organization_id = v_org_id and r.recommendation_status = 'pending'
    ), '[]'::jsonb),
    'decision_packs', coalesce((
      select jsonb_agg(jsonb_build_object('pack_key', dp.pack_key, 'pack_title', dp.pack_title, 'pack_status', dp.pack_status, 'summary', dp.summary))
      from public.organization_companion_proactive_decision_packs dp where dp.organization_id = v_org_id
    ), '[]'::jsonb)
  ) into v_insights;

  select coalesce((
    select jsonb_agg(jsonb_build_object(
      'recommendation_key', r.recommendation_key, 'recommendation_title', r.recommendation_title,
      'recommendation_status', r.recommendation_status, 'priority', r.priority, 'summary', r.summary
    ))
    from public.organization_companion_proactive_recommendations r
    where r.organization_id = v_org_id and r.recommendation_status = 'pending'
  ), '[]'::jsonb) into v_approvals;

  select jsonb_build_object(
    'opportunity_trends', jsonb_build_object('identified', (select count(*) from public.organization_companion_proactive_opportunities where organization_id = v_org_id)),
    'recommendation_performance', jsonb_build_object('approved', (select count(*) from public.organization_companion_proactive_recommendations where organization_id = v_org_id and recommendation_status = 'approved')),
    'prepared_action_usage', jsonb_build_object('ready', (select count(*) from public.organization_companion_proactive_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval'))),
    'operational_health', v_health,
    'revenue_signals', coalesce((
      select jsonb_agg(jsonb_build_object('title', o.observation_title, 'summary', o.summary))
      from public.organization_companion_proactive_observations o
      where o.organization_id = v_org_id and o.observation_category = 'financial'
    ), '[]'::jsonb),
    'partner_signals', coalesce((
      select jsonb_agg(jsonb_build_object('title', o.observation_title, 'summary', o.summary))
      from public.organization_companion_proactive_observations o
      where o.organization_id = v_org_id and o.observation_category = 'partner'
    ), '[]'::jsonb),
    'companion_recommendations', jsonb_build_array(
      jsonb_build_object('title', 'Review approval queue growth', 'reason', 'Operational observation — attention required'),
      jsonb_build_object('title', 'Act on revenue forecast change', 'reason', 'Strategic review recommended'),
      jsonb_build_object('title', 'Approve prepared executive report', 'reason', 'Prepared action ready for approval')
    )
  ) into v_reports;

  select jsonb_build_object(
    'top_opportunities', (select count(*) from public.organization_companion_proactive_opportunities where organization_id = v_org_id and opportunity_status in ('identified', 'reviewing')),
    'top_risks', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id and observation_status in ('attention_required', 'immediate_review')),
    'prepared_actions', (select count(*) from public.organization_companion_proactive_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'observation_activity', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id),
    'health_score', coalesce((select metric_value from public.organization_companion_proactive_analytics where organization_id = v_org_id and metric_key = 'metric_health_score'), 75),
    'companion_recommendations', 3
  ) into v_executive;

  select jsonb_build_object(
    'observation_feed_prompts', jsonb_build_array(
      'New opportunities', 'New risks', 'Prepared actions', 'Business changes',
      'Recommended reviews', 'Priority items'
    ),
    'companion_teams_integration', jsonb_build_object('phase', '555', 'route', '/app/companion/teams'),
    'execution_engine_integration', jsonb_build_object('route', '/app/action-center'),
    'governance_integration', jsonb_build_object('route', '/app/approvals'),
    'trust_center_integration', jsonb_build_object('route', '/app/license'),
    'business_pack_integration', jsonb_build_object(
      'finance_pack', 'Budget forecasts',
      'warehouse_pack', 'Inventory alerts',
      'support_pack', 'Escalation risks',
      'partner_pack', 'Growth opportunities',
      'route', '/app/settings/modules'
    ),
    'resilience_integration', jsonb_build_object('phase', '567', 'route', '/app/resilience'),
    'since_last_login_feed', true,
    'command_center_feed', true,
    'executive_briefing_feed', true
  ) into v_integrations;

  select jsonb_build_object(
    'new_opportunities', coalesce((
      select jsonb_agg(jsonb_build_object('title', op.opportunity_title, 'summary', op.summary))
      from public.organization_companion_proactive_opportunities op
      where op.organization_id = v_org_id and op.opportunity_status = 'identified' limit 3
    ), '[]'::jsonb),
    'new_risks', coalesce((
      select jsonb_agg(jsonb_build_object('title', o.observation_title, 'status', o.observation_status))
      from public.organization_companion_proactive_observations o
      where o.organization_id = v_org_id and o.observation_status != 'informational' limit 3
    ), '[]'::jsonb),
    'prepared_actions', coalesce((
      select jsonb_agg(jsonb_build_object('title', a.action_title, 'status', a.action_status))
      from public.organization_companion_proactive_prepared_actions a
      where a.organization_id = v_org_id and a.action_status in ('prepared', 'pending_approval') limit 3
    ), '[]'::jsonb),
    'recommended_reviews', coalesce((
      select jsonb_agg(jsonb_build_object('title', r.recommendation_title, 'priority', r.priority))
      from public.organization_companion_proactive_recommendations r
      where r.organization_id = v_org_id and r.recommendation_status = 'pending' limit 3
    ), '[]'::jsonb)
  ) into v_feed;

  select coalesce((
    select jsonb_agg(jsonb_build_object('event_type', al.event_type, 'audit_category', al.audit_category,
      'summary', al.summary, 'created_at', al.created_at) order by al.created_at desc)
    from (select * from public.organization_companion_proactive_audit_logs where organization_id = v_org_id order by created_at desc limit 10) al
  ), '[]'::jsonb) into v_audit;

  return jsonb_build_object(
    'found', true,
    'principle', 'Most systems wait for instructions — Companion observes, understands, and prepares. Humans remain in control.',
    'philosophy', 'The most valuable assistant notices what matters before anyone asks — observe, prepare, recommend.',
    'section', coalesce(p_section, 'overview'),
    'organization', v_org,
    'overview', v_overview,
    'observations', v_observations,
    'opportunities', v_opportunities,
    'prepared_actions', v_prepared,
    'recommendations', v_recommendations,
    'watchlists', v_watchlists,
    'insights', v_insights,
    'observation_feed', v_feed,
    'approvals', v_approvals,
    'operational_health', v_health,
    'reports', v_reports,
    'executive_dashboard', v_executive,
    'integrations', v_integrations,
    'audit_recent', v_audit,
    'routes', jsonb_build_object(
      'proactive', '/app/proactive',
      'watchlists', '/app/proactive/watchlists',
      'approvals', '/app/approvals',
      'action_center', '/app/action-center',
      'companion_teams', '/app/companion/teams'
    ),
    'notifications', jsonb_build_object(
      'opportunity_detected', true, 'prepared_action_ready', true,
      'critical_observation', true, 'health_score_changed', true,
      'strategic_review_recommended', true
    ),
    'mobile_access', jsonb_build_object(
      'review_observations', true, 'review_opportunities', true,
      'review_prepared_actions', true, 'approve_recommendations', true,
      'track_organizational_health', true
    )
  );
end; $$;

create or replace function public.perform_organization_companion_proactive_action(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_action text := coalesce(p_payload->>'action_type', p_payload->>'action', '');
  v_observation_key text := coalesce(p_payload->>'observation_key', '');
  v_opportunity_key text := coalesce(p_payload->>'opportunity_key', '');
  v_action_key text := coalesce(p_payload->>'action_key', '');
  v_recommendation_key text := coalesce(p_payload->>'recommendation_key', '');
  v_watchlist_key text := coalesce(p_payload->>'watchlist_key', '');
begin
  v_org_id := public._cmop568_org();
  if v_org_id is null then raise exception 'Organization not found'; end if;
  perform public._bde_require_admin();

  if v_action = 'create_observation' then
    insert into public.organization_companion_proactive_observations (
      organization_id, observation_key, observation_title, observation_category,
      observation_status, source_area, summary
    ) values (
      v_org_id, 'obs_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'observation_title', 'New Observation'),
      coalesce(p_payload->>'observation_category', 'operational'),
      coalesce(p_payload->>'observation_status', 'informational'),
      coalesce(p_payload->>'source_area', ''),
      coalesce(p_payload->>'summary', 'Observation created by Companion.')
    );
    perform public._cmop568_log(v_org_id, 'observation_created', 'Observation created', p_payload, 'observation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'identify_opportunity' then
    insert into public.organization_companion_proactive_opportunities (
      organization_id, opportunity_key, opportunity_title, opportunity_type,
      opportunity_status, impact_estimate, business_pack_key, summary
    ) values (
      v_org_id, 'opp_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'opportunity_title', 'New Opportunity'),
      coalesce(p_payload->>'opportunity_type', 'custom'),
      'identified',
      coalesce(p_payload->>'impact_estimate', ''),
      coalesce(p_payload->>'business_pack_key', ''),
      coalesce(p_payload->>'summary', 'Opportunity identified by Companion.')
    );
    perform public._cmop568_log(v_org_id, 'opportunity_identified', 'Opportunity identified', p_payload, 'opportunity');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'generate_prepared_action' then
    insert into public.organization_companion_proactive_prepared_actions (
      organization_id, action_key, action_title, action_type, action_status,
      related_observation_key, summary
    ) values (
      v_org_id, 'act_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'action_title', 'Prepared Action'),
      coalesce(p_payload->>'action_type', 'custom'),
      'prepared',
      coalesce(p_payload->>'related_observation_key', ''),
      coalesce(p_payload->>'summary', 'Companion prepared action — humans approve.')
    );
    perform public._cmop568_log(v_org_id, 'prepared_action_generated', 'Prepared action generated', p_payload, 'prepared_action');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'approve_recommendation' and v_recommendation_key <> '' then
    update public.organization_companion_proactive_recommendations
    set recommendation_status = 'approved'
    where organization_id = v_org_id and recommendation_key = v_recommendation_key;
    perform public._cmop568_log(v_org_id, 'recommendation_approved', 'Recommendation approved', p_payload, 'recommendation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'reject_recommendation' and v_recommendation_key <> '' then
    update public.organization_companion_proactive_recommendations
    set recommendation_status = 'rejected'
    where organization_id = v_org_id and recommendation_key = v_recommendation_key;
    perform public._cmop568_log(v_org_id, 'recommendation_rejected', 'Recommendation rejected', p_payload, 'recommendation');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'add_watchlist' then
    insert into public.organization_companion_proactive_watchlists (
      organization_id, watchlist_key, watchlist_title, watchlist_type, watchlist_status, items_count, summary
    ) values (
      v_org_id, 'wl_' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
      coalesce(p_payload->>'watchlist_title', 'New Watchlist'),
      coalesce(p_payload->>'watchlist_type', 'custom'),
      'active', 0,
      coalesce(p_payload->>'summary', 'Organizational watchlist created.')
    );
    perform public._cmop568_log(v_org_id, 'watchlist_created', 'Watchlist created', p_payload, 'watchlist');
    return jsonb_build_object('ok', true, 'action', v_action);
  elsif v_action = 'refresh_proactive' then
    perform public._cmop568_log(v_org_id, 'proactive_refreshed', 'Proactive operations center refreshed', p_payload, 'proactive');
    return jsonb_build_object('ok', true, 'action', v_action);
  end if;
  raise exception 'Unknown action: %', v_action;
end; $$;

create or replace function public.get_organization_companion_proactive_mobile_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmop568_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return (public.get_organization_companion_proactive_center('overview')->'overview')
    || jsonb_build_object('found', true, 'route', '/app/proactive');
end; $$;

create or replace function public.get_assistant_companion_proactive_advisor_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._cmop568_org();
  if v_org_id is null then return jsonb_build_object('found', false); end if;
  return jsonb_build_object(
    'found', true,
    'principle', 'Companion observes organizational activity, identifies opportunities, and prepares actions — humans approve.',
    'advisor_prompts', jsonb_build_array(
      'What opportunities were detected?', 'What needs attention?',
      'What prepared actions are ready?', 'What should I review first?',
      'Generate proactive briefing.'
    ),
    'observation_count', (select count(*) from public.organization_companion_proactive_observations where organization_id = v_org_id),
    'pending_recommendations', (select count(*) from public.organization_companion_proactive_recommendations where organization_id = v_org_id and recommendation_status = 'pending'),
    'prepared_actions_ready', (select count(*) from public.organization_companion_proactive_prepared_actions where organization_id = v_org_id and action_status in ('prepared', 'pending_approval')),
    'route', '/app/proactive'
  );
end; $$;

grant execute on function public.get_organization_companion_proactive_center(text) to authenticated;
grant execute on function public.perform_organization_companion_proactive_action(jsonb) to authenticated;
grant execute on function public.get_organization_companion_proactive_mobile_summary() to authenticated;
grant execute on function public.get_assistant_companion_proactive_advisor_context() to authenticated;
