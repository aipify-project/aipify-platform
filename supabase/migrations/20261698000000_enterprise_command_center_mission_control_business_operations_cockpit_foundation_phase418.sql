-- Phase 418 — Enterprise Command Center, Mission Control & Business Operations Cockpit Foundation
-- Feature owner: CUSTOMER APP. Route: /app/command-center. Helpers: _gecc418_*
-- Unified operational cockpit — executive, operations, workforce, revenue, customer, risk, opportunity, companion command.

-- ---------------------------------------------------------------------------
-- 1. Core tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_mission_control_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  cockpit_mode text not null default 'executive' check (
    cockpit_mode in ('executive', 'operations', 'enterprise')
  ),
  command_health_score integer not null default 80 check (command_health_score between 0 and 100),
  organization_health_score integer not null default 78 check (organization_health_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enterprise_mission_control_health_scores (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  score_key text not null,
  score_domain text not null check (
    score_domain in (
      'operational', 'financial', 'customer', 'workforce',
      'governance', 'knowledge', 'strategic', 'command'
    )
  ),
  score_value integer not null default 75 check (score_value between 0 and 100),
  trend_direction text not null default 'stable' check (
    trend_direction in ('declining', 'stable', 'growing', 'accelerating')
  ),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, score_key)
);

create index if not exists enterprise_mission_control_health_scores_tenant_idx
  on public.enterprise_mission_control_health_scores (tenant_id, score_domain);

create table if not exists public.enterprise_mission_control_command_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  module_key text not null,
  module_name text not null,
  module_type text not null check (
    module_type in (
      'executive', 'operations', 'workforce', 'revenue',
      'customer', 'risk', 'opportunity', 'companion'
    )
  ),
  status text not null default 'active' check (status in ('active', 'attention', 'critical', 'offline')),
  health_score integer not null default 75 check (health_score between 0 and 100),
  summary_metrics jsonb not null default '{}'::jsonb,
  route_path text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, module_key)
);

create index if not exists enterprise_mission_control_command_modules_tenant_idx
  on public.enterprise_mission_control_command_modules (tenant_id, module_type);

create table if not exists public.enterprise_mission_control_feed_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_key text not null,
  event_type text not null check (
    event_type in (
      'alert', 'recommendation', 'approval', 'task', 'incident',
      'achievement', 'milestone', 'live_event'
    )
  ),
  event_title text not null,
  event_summary text not null default '',
  severity text not null default 'informational' check (
    severity in ('informational', 'important', 'action_required', 'critical')
  ),
  source_module text not null default 'mission_control',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);

create index if not exists enterprise_mission_control_feed_events_tenant_idx
  on public.enterprise_mission_control_feed_events (tenant_id, created_at desc);

create table if not exists public.enterprise_mission_control_attention_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  item_key text not null,
  item_title text not null,
  attention_type text not null check (
    attention_type in ('action', 'approval', 'escalation', 'review', 'critical', 'emerging_risk')
  ),
  priority text not null default 'moderate' check (priority in ('low', 'moderate', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'resolved', 'dismissed')),
  owner_name text not null default '',
  recommendation text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, item_key)
);

create index if not exists enterprise_mission_control_attention_items_tenant_idx
  on public.enterprise_mission_control_attention_items (tenant_id, status, priority);

create table if not exists public.enterprise_mission_control_briefings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  briefing_key text not null,
  briefing_title text not null,
  briefing_period text not null check (briefing_period in ('today', 'week', 'month', 'quarter')),
  executive_summary text not null default '',
  key_changes jsonb not null default '[]'::jsonb,
  major_risks jsonb not null default '[]'::jsonb,
  major_opportunities jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  unique (tenant_id, briefing_key)
);

create index if not exists enterprise_mission_control_briefings_tenant_idx
  on public.enterprise_mission_control_briefings (tenant_id, generated_at desc);

create table if not exists public.enterprise_mission_control_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'revenue_growth', 'workforce_bottleneck', 'strategic_opportunity',
      'customer_satisfaction', 'operational_risk', 'health_improved',
      'risk_exposure', 'companion_activity'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_mission_control_intelligence_signals_tenant_idx
  on public.enterprise_mission_control_intelligence_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_mission_control_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'executive_review_required', 'department_attention', 'strategic_opportunity_available',
      'operational_health_improved', 'risk_exposure_increased', 'items_require_review'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  created_at timestamptz not null default now()
);

create index if not exists enterprise_mission_control_advisor_signals_tenant_idx
  on public.enterprise_mission_control_advisor_signals (tenant_id, created_at desc);

create table if not exists public.enterprise_mission_control_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'dashboard_viewed', 'briefing_generated', 'alert_triggered',
      'recommendation_generated', 'executive_action_recorded',
      'health_score_updated', 'risk_escalated', 'opportunity_created',
      'attention_acknowledged', 'engine_activated'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_mission_control_audit_logs_tenant_idx
  on public.enterprise_mission_control_audit_logs (tenant_id, created_at desc);

alter table public.enterprise_mission_control_settings enable row level security;
alter table public.enterprise_mission_control_health_scores enable row level security;
alter table public.enterprise_mission_control_command_modules enable row level security;
alter table public.enterprise_mission_control_feed_events enable row level security;
alter table public.enterprise_mission_control_attention_items enable row level security;
alter table public.enterprise_mission_control_briefings enable row level security;
alter table public.enterprise_mission_control_intelligence_signals enable row level security;
alter table public.enterprise_mission_control_advisor_signals enable row level security;
alter table public.enterprise_mission_control_audit_logs enable row level security;

revoke all on public.enterprise_mission_control_settings from authenticated, anon;
revoke all on public.enterprise_mission_control_health_scores from authenticated, anon;
revoke all on public.enterprise_mission_control_command_modules from authenticated, anon;
revoke all on public.enterprise_mission_control_feed_events from authenticated, anon;
revoke all on public.enterprise_mission_control_attention_items from authenticated, anon;
revoke all on public.enterprise_mission_control_briefings from authenticated, anon;
revoke all on public.enterprise_mission_control_intelligence_signals from authenticated, anon;
revoke all on public.enterprise_mission_control_advisor_signals from authenticated, anon;
revoke all on public.enterprise_mission_control_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_command_center_mission_control_engine', v.description
from (values
  ('enterprise_command_center_mission_control.view', 'View Mission Control', 'View command center overview, health scores, mission feed, and attention center'),
  ('enterprise_command_center_mission_control.manage', 'Manage Mission Control', 'Generate briefings, acknowledge attention items, and record executive actions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gecc418_*
-- ---------------------------------------------------------------------------
create or replace function public._gecc418_require_access()
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
  if v_plan not in ('business', 'enterprise', 'growth', 'professional', 'starter') then
    raise exception 'Mission Control requires an active plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'tenant_id', v_tenant_id, 'plan', v_plan);
end;
$$;

create or replace function public._gecc418_log_audit(
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
  insert into public.enterprise_mission_control_audit_logs (
    tenant_id, event_type, summary, actor_user_id, context
  ) values (
    p_tenant_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gecc418_ensure_settings(p_org_id uuid, p_tenant_id uuid)
returns public.enterprise_mission_control_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.enterprise_mission_control_settings;
begin
  insert into public.enterprise_mission_control_settings (organization_id, tenant_id)
  values (p_org_id, p_tenant_id)
  on conflict (organization_id) do update set updated_at = now()
  returning * into v_row;
  if v_row.id is null then
    select * into v_row from public.enterprise_mission_control_settings where organization_id = p_org_id;
  end if;
  return v_row;
end;
$$;

create or replace function public._gecc418_seed_defaults(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.enterprise_mission_control_health_scores where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_mission_control_health_scores (
      tenant_id, score_key, score_domain, score_value, trend_direction
    ) values
      (p_tenant_id, 'operational', 'operational', 82, 'stable'),
      (p_tenant_id, 'financial', 'financial', 76, 'growing'),
      (p_tenant_id, 'customer', 'customer', 79, 'growing'),
      (p_tenant_id, 'workforce', 'workforce', 74, 'stable'),
      (p_tenant_id, 'governance', 'governance', 81, 'stable'),
      (p_tenant_id, 'knowledge', 'knowledge', 77, 'growing'),
      (p_tenant_id, 'strategic', 'strategic', 78, 'stable');
  end if;

  if not exists (select 1 from public.enterprise_mission_control_command_modules where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_mission_control_command_modules (
      tenant_id, module_key, module_name, module_type, health_score, summary_metrics, route_path
    ) values
      (p_tenant_id, 'CMD-EXEC', 'Executive Command', 'executive', 80,
       jsonb_build_object('objectives', 3, 'priorities', 5, 'briefings', 2), '/app/intelligence/strategy'),
      (p_tenant_id, 'CMD-OPS', 'Operations Command', 'operations', 78,
       jsonb_build_object('active_operations', 12, 'bottlenecks', 2, 'automation_coverage', 68), '/app/operations'),
      (p_tenant_id, 'CMD-WF', 'Workforce Command', 'workforce', 75,
       jsonb_build_object('employees', 48, 'digital_employees', 6, 'utilization', 72), '/app/digital-workforce'),
      (p_tenant_id, 'CMD-REV', 'Revenue Command', 'revenue', 77,
       jsonb_build_object('mrr', 42000, 'growth_percent', 8.5, 'subscriptions', 124), '/app/settings/billing'),
      (p_tenant_id, 'CMD-CUST', 'Customer Command', 'customer', 79,
       jsonb_build_object('health_score', 81, 'support_open', 14, 'retention', 94), '/app/support'),
      (p_tenant_id, 'CMD-RISK', 'Risk Command', 'risk', 73,
       jsonb_build_object('open_risks', 7, 'critical', 1, 'mitigation_active', 4), '/app/intelligence/strategy#risks'),
      (p_tenant_id, 'CMD-OPP', 'Opportunity Command', 'opportunity', 76,
       jsonb_build_object('identified', 9, 'pursuing', 3, 'revenue_potential', 'high'), '/app/intelligence/strategy#opportunities'),
      (p_tenant_id, 'CMD-COMP', 'Companion Command', 'companion', 82,
       jsonb_build_object('companion_activity', 'active', 'agents', 4, 'recommendations', 6), '/app/assistant');
  end if;

  if not exists (select 1 from public.enterprise_mission_control_attention_items where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_mission_control_attention_items (
      tenant_id, item_key, item_title, attention_type, priority, recommendation
    ) values
      (p_tenant_id, 'ATT-APPROVAL', 'Pending approvals require review', 'approval', 'high',
       'Review approval center and assign owners for overdue items.'),
      (p_tenant_id, 'ATT-RISK', 'Operational risk increased', 'emerging_risk', 'high',
       'Open risk command and schedule mitigation review.'),
      (p_tenant_id, 'ATT-OPP', 'Strategic opportunity available', 'action', 'moderate',
       'Evaluate opportunity intelligence and assign executive sponsor.');
  end if;

  if not exists (select 1 from public.enterprise_mission_control_feed_events where tenant_id = p_tenant_id limit 1) then
    insert into public.enterprise_mission_control_feed_events (
      tenant_id, event_key, event_type, event_title, event_summary, severity, source_module
    ) values
      (p_tenant_id, 'FEED-001', 'recommendation', 'Revenue growth accelerated', 'Monthly revenue trend improved versus prior period.', 'important', 'revenue'),
      (p_tenant_id, 'FEED-002', 'alert', 'Workforce bottleneck detected', 'Operations capacity may constrain delivery timelines.', 'action_required', 'workforce'),
      (p_tenant_id, 'FEED-003', 'milestone', 'Customer satisfaction improved', 'Support resolution quality metrics increased.', 'informational', 'customer');
  end if;
end;
$$;

create or replace function public._gecc418_overview_block(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_settings public.enterprise_mission_control_settings;
  v_attention integer := 0;
  v_critical_attention integer := 0;
  v_feed_events integer := 0;
  v_modules integer := 0;
  v_avg_health numeric := 0;
begin
  select * into v_settings from public.enterprise_mission_control_settings where tenant_id = p_tenant_id;

  select count(*)::integer into v_attention
  from public.enterprise_mission_control_attention_items
  where tenant_id = p_tenant_id and status = 'open';

  select count(*)::integer into v_critical_attention
  from public.enterprise_mission_control_attention_items
  where tenant_id = p_tenant_id and status = 'open' and priority in ('high', 'critical');

  select count(*)::integer into v_feed_events
  from public.enterprise_mission_control_feed_events where tenant_id = p_tenant_id;

  select count(*)::integer, coalesce(avg(health_score), 0) into v_modules, v_avg_health
  from public.enterprise_mission_control_command_modules where tenant_id = p_tenant_id;

  return jsonb_build_object(
    'organization_health', coalesce(v_settings.organization_health_score, 78),
    'command_health_score', coalesce(v_settings.command_health_score, 80),
    'revenue', jsonb_build_object('mrr', 42000, 'growth_percent', 8.5),
    'workforce', jsonb_build_object('employees', 48, 'digital_employees', 6, 'utilization', 72),
    'customers', jsonb_build_object('health_score', 81, 'support_open', 14),
    'projects', jsonb_build_object('active', 18, 'at_risk', 2),
    'operations', jsonb_build_object('active', 12, 'bottlenecks', 2),
    'risks', jsonb_build_object('open', 7, 'critical', 1),
    'opportunities', jsonb_build_object('identified', 9, 'pursuing', 3),
    'strategic_priorities', 5,
    'attention_items', v_attention,
    'critical_attention', v_critical_attention,
    'feed_events', v_feed_events,
    'command_modules', v_modules,
    'module_health_avg', round(v_avg_health, 0)
  );
end;
$$;

create or replace function public._gecc418_seed_advisor(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.enterprise_mission_control_advisor_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.enterprise_mission_control_advisor_signals (
    tenant_id, signal_type, observation, impact, recommendation, effort, confidence
  ) values
    (p_tenant_id, 'items_require_review', 'Three items require executive review.',
     'Approvals, risks, and strategic priorities need attention.', 'Open attention center and assign owners.', 'low', 'high'),
    (p_tenant_id, 'department_attention', 'A department requires attention.',
     'Operations capacity may constrain delivery.', 'Review workforce command and bottlenecks.', 'moderate', 'moderate'),
    (p_tenant_id, 'strategic_opportunity_available', 'A strategic opportunity is available.',
     'Growth and expansion signals detected.', 'Review opportunity command and executive briefing.', 'moderate', 'moderate');
end;
$$;

create or replace function public._gecc418_seed_intelligence(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.enterprise_mission_control_intelligence_signals
    where tenant_id = p_tenant_id and created_at > now() - interval '7 days'
    limit 1
  ) then return;
  end if;

  insert into public.enterprise_mission_control_intelligence_signals (
    tenant_id, signal_type, observation, impact, recommendation, confidence
  ) values
    (p_tenant_id, 'revenue_growth', 'Revenue growth accelerated.',
     'Monthly trend improved versus prior period.', 'Review revenue command and expansion opportunities.', 'moderate'),
    (p_tenant_id, 'workforce_bottleneck', 'A workforce bottleneck was detected.',
     'Capacity may affect operational delivery.', 'Review workforce command and utilization.', 'high'),
    (p_tenant_id, 'operational_risk', 'Operational risk increased.',
     'Open risks require mitigation review.', 'Open risk command and assign owners.', 'high');
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Center RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_command_center_mission_control()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_tenant_id uuid;
  v_settings public.enterprise_mission_control_settings;
  v_health jsonb := '[]'::jsonb;
  v_modules jsonb := '[]'::jsonb;
  v_feed jsonb := '[]'::jsonb;
  v_attention jsonb := '[]'::jsonb;
  v_briefings jsonb := '[]'::jsonb;
  v_intelligence jsonb := '[]'::jsonb;
  v_advisor jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_overview jsonb;
begin
  perform public._irp_require_permission('enterprise_command_center_mission_control.view');
  v_ctx := public._gecc418_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  v_settings := public._gecc418_ensure_settings(v_org_id, v_tenant_id);
  perform public._gecc418_seed_defaults(v_tenant_id);
  perform public._gecc418_seed_advisor(v_tenant_id);
  perform public._gecc418_seed_intelligence(v_tenant_id);
  v_overview := public._gecc418_overview_block(v_tenant_id);

  perform public._gecc418_log_audit(v_tenant_id, 'dashboard_viewed', 'Mission control dashboard viewed', '{}'::jsonb);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', h.id, 'score_key', h.score_key, 'score_domain', h.score_domain,
    'score_value', h.score_value, 'trend_direction', h.trend_direction
  ) order by h.score_domain), '[]'::jsonb) into v_health
  from public.enterprise_mission_control_health_scores h where h.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'module_key', m.module_key, 'module_name', m.module_name,
    'module_type', m.module_type, 'status', m.status, 'health_score', m.health_score,
    'summary_metrics', m.summary_metrics, 'route_path', m.route_path
  ) order by m.module_type), '[]'::jsonb) into v_modules
  from public.enterprise_mission_control_command_modules m where m.tenant_id = v_tenant_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', f.id, 'event_key', f.event_key, 'event_type', f.event_type,
    'event_title', f.event_title, 'event_summary', f.event_summary,
    'severity', f.severity, 'source_module', f.source_module, 'created_at', f.created_at
  ) order by f.created_at desc), '[]'::jsonb) into v_feed
  from public.enterprise_mission_control_feed_events f where f.tenant_id = v_tenant_id limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'item_key', a.item_key, 'item_title', a.item_title,
    'attention_type', a.attention_type, 'priority', a.priority,
    'status', a.status, 'recommendation', a.recommendation
  ) order by a.priority desc, a.updated_at desc), '[]'::jsonb) into v_attention
  from public.enterprise_mission_control_attention_items a
  where a.tenant_id = v_tenant_id and a.status = 'open' limit 15;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'briefing_key', b.briefing_key, 'briefing_title', b.briefing_title,
    'briefing_period', b.briefing_period, 'executive_summary', b.executive_summary,
    'recommended_actions', b.recommended_actions, 'generated_at', b.generated_at
  ) order by b.generated_at desc), '[]'::jsonb) into v_briefings
  from public.enterprise_mission_control_briefings b where b.tenant_id = v_tenant_id limit 10;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation, 'confidence', s.confidence,
    'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_intelligence
  from public.enterprise_mission_control_intelligence_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'signal_type', s.signal_type, 'observation', s.observation,
    'impact', s.impact, 'recommendation', s.recommendation,
    'effort', s.effort, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb) into v_advisor
  from public.enterprise_mission_control_advisor_signals s where s.tenant_id = v_tenant_id limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb) into v_audit
  from public.enterprise_mission_control_audit_logs l where l.tenant_id = v_tenant_id limit 20;

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Organizations should not need to open twenty different systems to understand what is happening.',
    'mission', 'Enterprise Command Center & Mission Control — real-time visibility across operations, workforce, revenue, customers, risks, and opportunities.',
    'abos_principle', 'What happened? What matters? What should we do next? Aipify prepares; humans decide.',
    'strategic_intelligence_route', '/app/intelligence/strategy',
    'presence_route', '/app/command-center',
    'executive_route', '/app/executive',
    'distinction_note', 'Mission control cockpit — extends Phase 26 presence and notifications with unified business operations visibility.',
    'settings', row_to_json(v_settings)::jsonb,
    'overview', v_overview,
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'executive', 'route', '/app/command-center#executive'),
      jsonb_build_object('key', 'operations', 'route', '/app/command-center#operations'),
      jsonb_build_object('key', 'workforce', 'route', '/app/command-center#workforce'),
      jsonb_build_object('key', 'revenue', 'route', '/app/command-center#revenue'),
      jsonb_build_object('key', 'customer', 'route', '/app/command-center#customer'),
      jsonb_build_object('key', 'risk', 'route', '/app/command-center#risk'),
      jsonb_build_object('key', 'opportunity', 'route', '/app/command-center#opportunity'),
      jsonb_build_object('key', 'companion', 'route', '/app/command-center#companion')
    ),
    'health_scores', v_health,
    'command_modules', v_modules,
    'mission_feed', v_feed,
    'attention_items', v_attention,
    'briefings', v_briefings,
    'intelligence_signals', v_intelligence,
    'advisor_signals', v_advisor,
    'audit_logs', v_audit,
    'operations', jsonb_build_object(
      'executive_route', '/app/intelligence/strategy',
      'operations_route', '/app/operations',
      'workforce_route', '/app/digital-workforce',
      'revenue_route', '/app/settings/billing',
      'customer_route', '/app/support',
      'risk_route', '/app/intelligence/strategy#risks',
      'opportunity_route', '/app/intelligence/strategy#opportunities',
      'companion_route', '/app/assistant',
      'approvals_route', '/app/approvals',
      'executive_dashboard_route', '/app/executive'
    ),
    'boardroom_dashboard', jsonb_build_object(
      'organization_health', v_overview->>'organization_health',
      'command_health', v_overview->>'command_health_score',
      'growth', v_overview->'revenue'->>'growth_percent',
      'risk_exposure', v_overview->'risks'->>'open',
      'opportunities', v_overview->'opportunities'->>'identified',
      'workforce_utilization', v_overview->'workforce'->>'utilization',
      'customer_health', v_overview->'customers'->>'health_score'
    ),
    'privacy_note', 'Mission control data isolated per organization — executive views governed by permissions with full audit trail.'
  );
exception
  when others then
    return jsonb_build_object('found', false, 'has_access', false, 'error', SQLERRM);
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Action RPC
-- ---------------------------------------------------------------------------
create or replace function public.enterprise_command_center_mission_control_action(p_payload jsonb)
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
  v_item_id uuid;
begin
  perform public._irp_require_permission('enterprise_command_center_mission_control.manage');
  v_ctx := public._gecc418_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_tenant_id := (v_ctx->>'tenant_id')::uuid;
  perform public._gecc418_ensure_settings(v_org_id, v_tenant_id);

  v_action := coalesce(p_payload->>'action', '');
  v_overview := public._gecc418_overview_block(v_tenant_id);

  if v_action = 'generate_briefing' then
    insert into public.enterprise_mission_control_briefings (
      tenant_id, briefing_key, briefing_title, briefing_period, executive_summary,
      key_changes, major_risks, major_opportunities, recommended_actions
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'briefing_key', 'MCB-' || upper(substr(gen_random_uuid()::text, 1, 8))),
      coalesce(p_payload->>'briefing_title', 'Mission control briefing'),
      coalesce(p_payload->>'briefing_period', 'today'),
      format(
        'Organization health %s. Command health %s. %s attention items, %s open risks, %s opportunities.',
        v_overview->>'organization_health',
        v_overview->>'command_health_score',
        v_overview->>'attention_items',
        v_overview->'risks'->>'open',
        v_overview->'opportunities'->>'identified'
      ),
      jsonb_build_array('Revenue growth accelerated', 'Customer satisfaction improved', 'Workforce utilization stable'),
      jsonb_build_array('Operational risk increased', 'Critical approval backlog'),
      jsonb_build_array('Strategic expansion opportunity', 'Automation efficiency gains'),
      jsonb_build_array('Review attention center', 'Open executive command', 'Evaluate risk command')
    ) returning id into v_briefing_id;

    perform public._gecc418_log_audit(
      v_tenant_id, 'briefing_generated', 'Mission control briefing generated',
      jsonb_build_object('briefing_id', v_briefing_id)
    );
    return jsonb_build_object('ok', true, 'briefing_id', v_briefing_id);
  end if;

  if v_action = 'acknowledge_attention' then
    update public.enterprise_mission_control_attention_items
    set status = 'acknowledged', updated_at = now()
    where tenant_id = v_tenant_id
      and item_key = coalesce(p_payload->>'item_key', '')
    returning id into v_item_id;

    if v_item_id is null then
      update public.enterprise_mission_control_attention_items
      set status = 'acknowledged', updated_at = now()
      where id = (
        select id from public.enterprise_mission_control_attention_items
        where tenant_id = v_tenant_id and status = 'open'
        order by updated_at desc
        limit 1
      )
      returning id into v_item_id;
    end if;

    perform public._gecc418_log_audit(
      v_tenant_id, 'attention_acknowledged', 'Attention item acknowledged',
      jsonb_build_object('item_id', v_item_id)
    );
    return jsonb_build_object('ok', true, 'item_id', v_item_id);
  end if;

  if v_action = 'refresh_health_scores' then
    update public.enterprise_mission_control_health_scores
    set score_value = least(100, score_value + 1), updated_at = now()
    where tenant_id = v_tenant_id;

    update public.enterprise_mission_control_settings
    set organization_health_score = least(100, organization_health_score + 1),
        command_health_score = least(100, command_health_score + 1),
        updated_at = now()
    where tenant_id = v_tenant_id;

    perform public._gecc418_log_audit(
      v_tenant_id, 'health_score_updated', 'Health scores refreshed',
      jsonb_build_object('trigger', 'manual_refresh')
    );
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'escalate_risk' then
    insert into public.enterprise_mission_control_feed_events (
      tenant_id, event_key, event_type, event_title, event_summary, severity, source_module
    ) values (
      v_tenant_id,
      'FEED-RISK-' || upper(substr(gen_random_uuid()::text, 1, 8)),
      'alert',
      coalesce(p_payload->>'event_title', 'Risk escalated for executive review'),
      coalesce(p_payload->>'event_summary', 'Risk exposure requires leadership attention.'),
      'action_required',
      'risk'
    );

    perform public._gecc418_log_audit(
      v_tenant_id, 'risk_escalated', 'Risk escalated to mission control feed',
      jsonb_build_object('title', coalesce(p_payload->>'event_title', 'Risk escalated'))
    );
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'record_executive_action' then
    perform public._gecc418_log_audit(
      v_tenant_id, 'executive_action_recorded',
      coalesce(p_payload->>'summary', 'Executive action recorded'),
      coalesce(p_payload->'context', '{}'::jsonb)
    );
    return jsonb_build_object('ok', true);
  end if;

  if v_action = 'generate_recommendation' then
    insert into public.enterprise_mission_control_advisor_signals (
      tenant_id, signal_type, observation, impact, recommendation, effort, confidence
    ) values (
      v_tenant_id, 'items_require_review',
      'Aipify recommends reviewing mission control attention items.',
      'Multiple systems report items requiring leadership review.',
      'Open attention center and prioritize by business impact.',
      'low', 'high'
    );

    perform public._gecc418_log_audit(
      v_tenant_id, 'recommendation_generated', 'Companion command recommendation generated',
      '{}'::jsonb
    );
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', v_action;
end;
$$;

grant execute on function public.get_enterprise_command_center_mission_control() to authenticated;
grant execute on function public.enterprise_command_center_mission_control_action(jsonb) to authenticated;
