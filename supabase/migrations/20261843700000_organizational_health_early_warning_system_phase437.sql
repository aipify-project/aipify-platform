-- Phase 437 — Organizational Health & Early Warning System (Customer App)
-- Route: /app/intelligence/health

create table if not exists public.organizational_health_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  early_warning_enabled boolean not null default true,
  predictive_risk_enabled boolean not null default true,
  companion_interventions_enabled boolean not null default true,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.organizational_health_category_scores (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_key text not null check (category_key in (
    'operations', 'customers', 'revenue', 'support', 'employees',
    'projects', 'security', 'compliance'
  )),
  score_value numeric(5,2) not null default 0 check (score_value >= 0 and score_value <= 100),
  health_level text not null default 'stable' check (health_level in (
    'healthy', 'stable', 'requires_attention', 'critical'
  )),
  contributing_factors text not null default '' check (char_length(contributing_factors) <= 500),
  updated_at timestamptz not null default now(),
  unique (organization_id, category_key)
);

create index if not exists organizational_health_category_scores_org_idx
  on public.organizational_health_category_scores (organization_id, health_level);

create table if not exists public.organizational_health_section_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'health_overview', 'risk_signals', 'performance_trends', 'team_health',
    'customer_health', 'operational_health', 'financial_health'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information' check (status_key in (
    'completed', 'requires_attention', 'waiting', 'information', 'restricted', 'verified', 'not_allowed'
  )),
  detail_label text not null default '',
  trend_window text not null default '' check (trend_window in ('', '7d', '30d', '90d', '12m')),
  trend_direction text not null default '' check (trend_direction in ('', 'improvement', 'stability', 'decline')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_section_items_org_idx
  on public.organizational_health_section_items (organization_id, section_key, updated_at desc);

create table if not exists public.organizational_health_signals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (signal_type in (
    'revenue_trend', 'customer_churn', 'support_backlog', 'employee_workload',
    'project_delay', 'integration_failure', 'security_anomaly'
  )),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'requires_attention',
  trend_pct_label text not null default '',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_signals_org_idx
  on public.organizational_health_signals (organization_id, resolved, created_at desc);

create table if not exists public.organizational_health_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  project_status text not null default 'active',
  timeline_health text not null default 'stable' check (timeline_health in (
    'healthy', 'stable', 'requires_attention', 'critical', 'waiting'
  )),
  dependency_health text not null default 'stable',
  resource_health text not null default 'stable',
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_projects_org_idx
  on public.organizational_health_projects (organization_id, updated_at desc);

create table if not exists public.organizational_health_warnings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  warning_tier text not null check (warning_tier in ('critical', 'emerging', 'opportunity')),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high', 'critical')),
  priority_rank integer not null default 100,
  status_key text not null default 'requires_attention',
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_warnings_org_idx
  on public.organizational_health_warnings (organization_id, warning_tier, priority_rank);

create table if not exists public.organizational_health_interventions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  intervention_type text not null default 'review' check (intervention_type in (
    'schedule_review', 'contact_customer', 'reallocate_resources',
    'resolve_backlog', 'review_contract', 'add_staffing'
  )),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_interventions_org_idx
  on public.organizational_health_interventions (organization_id, status, created_at desc);

create table if not exists public.organizational_health_predictive_risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  risk_label text not null,
  probability text not null default 'medium' check (probability in ('low', 'medium', 'high')),
  impact text not null default 'medium' check (impact in ('low', 'medium', 'high')),
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high')),
  summary text not null default '' check (char_length(summary) <= 500),
  contributing_factors text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizational_health_predictive_risks_org_idx
  on public.organizational_health_predictive_risks (organization_id, created_at desc);

create table if not exists public.organizational_health_center_audit (
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

create index if not exists organizational_health_center_audit_org_idx
  on public.organizational_health_center_audit (organization_id, created_at desc);

alter table public.organizational_health_center_settings enable row level security;
alter table public.organizational_health_category_scores enable row level security;
alter table public.organizational_health_section_items enable row level security;
alter table public.organizational_health_signals enable row level security;
alter table public.organizational_health_projects enable row level security;
alter table public.organizational_health_warnings enable row level security;
alter table public.organizational_health_interventions enable row level security;
alter table public.organizational_health_predictive_risks enable row level security;
alter table public.organizational_health_center_audit enable row level security;
revoke all on public.organizational_health_center_settings from authenticated, anon;
revoke all on public.organizational_health_category_scores from authenticated, anon;
revoke all on public.organizational_health_section_items from authenticated, anon;
revoke all on public.organizational_health_signals from authenticated, anon;
revoke all on public.organizational_health_projects from authenticated, anon;
revoke all on public.organizational_health_warnings from authenticated, anon;
revoke all on public.organizational_health_interventions from authenticated, anon;
revoke all on public.organizational_health_predictive_risks from authenticated, anon;
revoke all on public.organizational_health_center_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organizational_health_center', v.description
from (values
  ('organizational_health.view', 'View Organizational Health Center', 'View health scores, early warnings, and organizational health intelligence'),
  ('organizational_health.manage', 'Manage Organizational Health Center', 'Acknowledge warnings, interventions, and health signals')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'organizational_health.view'), ('owner', 'organizational_health.manage'),
  ('administrator', 'organizational_health.view'), ('administrator', 'organizational_health.manage'),
  ('manager', 'organizational_health.view'), ('manager', 'organizational_health.manage'),
  ('employee', 'organizational_health.view'),
  ('support_agent', 'organizational_health.view'),
  ('moderator', 'organizational_health.view'),
  ('viewer', 'organizational_health.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._oh437_health_status(p_level text)
returns text language sql immutable as $$
  select case p_level
    when 'healthy' then 'verified'
    when 'stable' then 'information'
    when 'requires_attention' then 'requires_attention'
    when 'critical' then 'not_allowed'
    when 'waiting' then 'waiting'
    else 'information'
  end;
$$;

create or replace function public._oh437_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('organizational_health.manage', v_org_id),
    'can_manage', public._irp_has_permission('organizational_health.manage', v_org_id),
    'can_view', public._irp_has_permission('organizational_health.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._oh437_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_health_center_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._oh437_section_json(s public.organizational_health_section_items)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary, 'status_key', s.status_key,
    'detail_label', s.detail_label, 'trend_window', s.trend_window,
    'trend_direction', s.trend_direction, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._oh437_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organizational_health_center_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.organizational_health_category_scores where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.organizational_health_category_scores
    (organization_id, category_key, score_value, health_level, contributing_factors)
  values
    (p_org_id, 'operations', 78.00, 'stable', 'Workflow throughput steady; two approval bottlenecks detected.'),
    (p_org_id, 'customers', 72.00, 'requires_attention', 'Engagement declining among top accounts.'),
    (p_org_id, 'revenue', 81.00, 'healthy', 'Revenue trend positive over 90 days.'),
    (p_org_id, 'support', 65.00, 'requires_attention', 'Support backlog increased 42% during the last 30 days.'),
    (p_org_id, 'employees', 74.00, 'stable', 'Workload concentrated among two team members.'),
    (p_org_id, 'projects', 68.00, 'requires_attention', 'One project blocked by unresolved dependency.'),
    (p_org_id, 'security', 88.00, 'healthy', 'No critical anomalies; routine review on schedule.'),
    (p_org_id, 'compliance', 85.00, 'healthy', 'Audit trail complete; policy reviews current.');

  insert into public.organizational_health_section_items
    (organization_id, section_key, title, summary, status_key, detail_label, trend_window, trend_direction)
  values
    (p_org_id, 'health_overview', 'Organization health summary',
     'Overall health is stable with support and customer engagement requiring attention.',
     'information', 'Composite score 76.4', '30d', 'stability'),
    (p_org_id, 'risk_signals', 'Support backlog growth',
     'Support backlog increased 42% during the last 30 days.',
     'requires_attention', 'Backlog +42%', '30d', 'decline'),
    (p_org_id, 'risk_signals', 'Customer engagement decline',
     'Customer engagement declining among top accounts.',
     'requires_attention', 'Top accounts −18% engagement', '30d', 'decline'),
    (p_org_id, 'performance_trends', 'Revenue trend',
     'Revenue up 8% over 90 days with stable conversion.',
     'verified', 'Revenue +8%', '90d', 'improvement'),
    (p_org_id, 'team_health', 'Workload concentration',
     'Team workload concentrated among 2 employees.',
     'requires_attention', '2 employees at 140% capacity', '30d', 'decline'),
    (p_org_id, 'customer_health', 'High-value customer engagement',
     'High-value customer showing declining engagement.',
     'requires_attention', 'Renewal risk elevated', '30d', 'decline'),
    (p_org_id, 'operational_health', 'Integration health',
     'One integration reporting intermittent failures.',
     'waiting', '2 failure events this week', '7d', 'decline'),
    (p_org_id, 'financial_health', 'Cash flow stability',
     'Cash flow stable with moderate expansion investment exposure.',
     'information', 'Runway within target range', '90d', 'stability');

  insert into public.organizational_health_signals
    (organization_id, signal_type, title, summary, status_key, trend_pct_label)
  values
    (p_org_id, 'support_backlog', 'Support backlog increased 42%',
     'Open support cases grew faster than resolution rate over the last 30 days.',
     'requires_attention', '+42%'),
    (p_org_id, 'customer_churn', 'Customer engagement declining among top accounts',
     'Usage and login frequency down for three high-value accounts.',
     'requires_attention', '−18% engagement'),
    (p_org_id, 'employee_workload', 'Team workload concentrated among 2 employees',
     'Overdue tasks and approval delays cluster on two team members.',
     'requires_attention', '140% load on 2 staff'),
    (p_org_id, 'project_delay', 'Project timeline slip detected',
     'Platform migration project slipped one sprint due to dependency.',
     'waiting', '+1 sprint'),
    (p_org_id, 'integration_failure', 'Integration failure events',
     'Payment webhook integration reported two failures this week.',
     'requires_attention', '2 events'),
    (p_org_id, 'revenue_trend', 'Revenue trend positive',
     'Trailing revenue trend remains positive over 90 days.',
     'verified', '+8%'),
    (p_org_id, 'security_anomaly', 'Security review on schedule',
     'No critical security anomalies detected in the last 30 days.',
     'verified', '0 critical');

  insert into public.organizational_health_projects
    (organization_id, title, project_status, timeline_health, dependency_health, resource_health, summary, status_key)
  values
    (p_org_id, 'Platform migration', 'active', 'requires_attention', 'critical', 'stable',
     'Project blocked by unresolved dependency on vendor API upgrade.', 'waiting'),
    (p_org_id, 'Customer onboarding refresh', 'active', 'healthy', 'stable', 'stable',
     'Onboarding project on track with balanced resource allocation.', 'verified');

  insert into public.organizational_health_warnings
    (organization_id, warning_tier, title, summary, impact_level, priority_rank, status_key)
  values
    (p_org_id, 'critical', 'Support capacity risk',
     'Support backlog growth may breach SLA targets within two weeks.', 'high', 10, 'not_allowed'),
    (p_org_id, 'emerging', 'Customer concentration engagement drop',
     'Top accounts showing early churn signals before renewal windows.', 'medium', 20, 'requires_attention'),
    (p_org_id, 'emerging', 'Project dependency blocker',
     'Platform migration blocked — timeline risk increasing.', 'medium', 30, 'waiting'),
    (p_org_id, 'opportunity', 'Revenue expansion window',
     'Partner channel revenue up 34% — capacity available to scale.', 'high', 40, 'verified');

  insert into public.organizational_health_interventions
    (organization_id, recommendation, reason, intervention_type)
  values
    (p_org_id, 'Resolve support backlog', 'Backlog increased 42% — SLA risk within two weeks.', 'resolve_backlog'),
    (p_org_id, 'Contact high-value customer', 'Declining engagement among top accounts before renewal.', 'contact_customer'),
    (p_org_id, 'Reallocate resources to blocked project', 'Platform migration blocked by unresolved dependency.', 'reallocate_resources'),
    (p_org_id, 'Schedule executive review meeting', 'Multiple emerging risks require coordinated review.', 'schedule_review'),
    (p_org_id, 'Review vendor contract', 'Hosting vendor enters renewal window this quarter.', 'review_contract'),
    (p_org_id, 'Add additional staffing to support', 'Two employees carry disproportionate workload.', 'add_staffing');

  insert into public.organizational_health_predictive_risks
    (organization_id, risk_label, probability, impact, urgency, summary, contributing_factors, status_key)
  values
    (p_org_id, 'Revenue risk', 'medium', 'high', 'medium',
     'Customer engagement decline may affect renewal revenue if unaddressed.',
     'Top account engagement −18%; support backlog +42%.', 'requires_attention'),
    (p_org_id, 'Operational bottleneck risk', 'high', 'medium', 'high',
     'Approval bottlenecks may delay critical project milestones.',
     'Two employees at 140% capacity; overdue approvals up 22%.', 'requires_attention'),
    (p_org_id, 'Security exposure risk', 'low', 'high', 'low',
     'Partner access expansion requires consistent governance review.',
     'New partner onboarding planned for Q3.', 'information');
end; $$;

create or replace function public.get_organizational_health_intelligence_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid;
  v_overview jsonb; v_risk jsonb; v_trends jsonb; v_team jsonb; v_customer jsonb;
  v_operational jsonb; v_financial jsonb; v_scores jsonb; v_signals jsonb;
  v_projects jsonb; v_warnings jsonb; v_interventions jsonb; v_predictive jsonb;
  v_overall_score numeric; v_overall_level text;
begin
  perform public._irp_require_permission('organizational_health.view');
  v_ctx := public._oh437_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._oh437_seed(v_org_id);

  select coalesce(round(avg(score_value)::numeric, 1), 0),
    case
      when coalesce(avg(score_value), 0) >= 85 then 'healthy'
      when coalesce(avg(score_value), 0) >= 70 then 'stable'
      when coalesce(avg(score_value), 0) >= 55 then 'requires_attention'
      else 'critical'
    end
  into v_overall_score, v_overall_level
  from public.organizational_health_category_scores where organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'category_key', c.category_key, 'score_value', c.score_value,
    'health_level', c.health_level, 'status_key', public._oh437_health_status(c.health_level),
    'contributing_factors', c.contributing_factors, 'item_type', 'score'
  ) order by c.category_key), '[]'::jsonb)
  into v_scores from public.organizational_health_category_scores c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_overview from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'health_overview';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_risk from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'risk_signals';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.trend_window, s.updated_at desc), '[]'::jsonb)
  into v_trends from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'performance_trends';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_team from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'team_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_customer from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'customer_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_operational from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'operational_health';

  select coalesce(jsonb_agg(public._oh437_section_json(s) order by s.updated_at desc), '[]'::jsonb)
  into v_financial from public.organizational_health_section_items s
  where s.organization_id = v_org_id and s.section_key = 'financial_health';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sig.id, 'signal_type', sig.signal_type, 'title', sig.title, 'summary', sig.summary,
    'status_key', sig.status_key, 'trend_pct_label', sig.trend_pct_label, 'item_type', 'signal'
  ) order by sig.created_at desc), '[]'::jsonb)
  into v_signals from public.organizational_health_signals sig
  where sig.organization_id = v_org_id and not sig.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'title', p.title, 'project_status', p.project_status,
    'timeline_health', p.timeline_health, 'dependency_health', p.dependency_health,
    'resource_health', p.resource_health, 'summary', p.summary, 'status_key', p.status_key,
    'item_type', 'project'
  ) order by p.updated_at desc), '[]'::jsonb)
  into v_projects from public.organizational_health_projects p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'warning_tier', w.warning_tier, 'title', w.title, 'summary', w.summary,
    'impact_level', w.impact_level, 'priority_rank', w.priority_rank,
    'status_key', w.status_key, 'item_type', 'warning'
  ) order by w.priority_rank), '[]'::jsonb)
  into v_warnings from public.organizational_health_warnings w
  where w.organization_id = v_org_id and not w.resolved;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'recommendation', i.recommendation, 'reason', i.reason,
    'intervention_type', i.intervention_type, 'status', i.status, 'item_type', 'intervention'
  ) order by i.created_at desc), '[]'::jsonb)
  into v_interventions from public.organizational_health_interventions i
  where i.organization_id = v_org_id and i.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'risk_label', r.risk_label, 'probability', r.probability, 'impact', r.impact,
    'urgency', r.urgency, 'summary', r.summary, 'contributing_factors', r.contributing_factors,
    'status_key', r.status_key, 'item_type', 'predictive'
  ) order by r.created_at desc), '[]'::jsonb)
  into v_predictive from public.organizational_health_predictive_risks r where r.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'Most problems do not appear overnight — signals exist long before a crisis. Aipify detects weak signals early so you can act before issues become expensive.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'All health calculations are transparent, auditable, and explainable — contributing factors are always visible.',
    'organization_health_score', jsonb_build_object(
      'score_value', v_overall_score,
      'health_level', v_overall_level,
      'status_key', public._oh437_health_status(v_overall_level)
    ),
    'health_scores', v_scores,
    'early_warning_signals', v_signals,
    'sections', jsonb_build_object(
      'health_overview', v_overview,
      'risk_signals', v_risk,
      'performance_trends', v_trends,
      'team_health', v_team,
      'customer_health', v_customer,
      'operational_health', v_operational,
      'financial_health', v_financial
    ),
    'project_health', v_projects,
    'executive_warnings', v_warnings,
    'companion_interventions', v_interventions,
    'predictive_risks', v_predictive,
    'statistics', jsonb_build_object(
      'score_count', jsonb_array_length(v_scores),
      'signal_count', jsonb_array_length(v_signals),
      'warning_count', jsonb_array_length(v_warnings),
      'intervention_count', jsonb_array_length(v_interventions),
      'project_count', jsonb_array_length(v_projects),
      'predictive_count', jsonb_array_length(v_predictive)
    ),
    'privacy_note', 'Aggregated metadata and trend patterns only — no raw customer communications or employee PII.'
  );
end; $$;

create or replace function public.manage_organizational_health_intelligence_item(
  p_item_type text,
  p_item_id uuid,
  p_action text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._oh437_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'resolve', 'complete') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'intervention' then
    update public.organizational_health_interventions set
      status = case p_action
        when 'acknowledge' then 'acknowledged'
        when 'dismiss' then 'dismissed'
        else status end,
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'signal' then
    update public.organizational_health_signals set
      resolved = p_action in ('resolve', 'dismiss', 'complete'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'warning' then
    update public.organizational_health_warnings set
      resolved = p_action in ('resolve', 'dismiss', 'complete'),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  end if;

  perform public._oh437_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Organizational health item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_organizational_health_intelligence_center() to authenticated;
grant execute on function public.manage_organizational_health_intelligence_item(text, uuid, text) to authenticated;
