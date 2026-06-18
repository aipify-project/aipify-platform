-- Phase 441 — Business Operating System Command Center (Customer App)
-- Route: /app/command-center — primary operational command center

create table if not exists public.business_os_command_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  widget_preferences jsonb not null default '{}'::jsonb,
  readiness_mode text not null default 'standard' check (readiness_mode in (
    'standard', 'board_meeting', 'investor_meeting', 'management_review'
  )),
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_os_command_center_sections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  section_key text not null check (section_key in (
    'executive_overview', 'operational_overview', 'financial_overview',
    'customer_overview', 'workforce_overview', 'intelligence_overview', 'companion_recommendations'
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

create index if not exists business_os_command_center_sections_org_idx
  on public.business_os_command_center_sections (organization_id, section_key);

create table if not exists public.business_os_command_center_mission_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  metric_key text not null check (metric_key in (
    'revenue', 'growth', 'customers', 'operations', 'projects', 'risks', 'alerts'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, metric_key)
);

create table if not exists public.business_os_command_center_radar_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  radar_tier text not null check (radar_tier in ('healthy', 'emerging_risk', 'critical', 'information')),
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  impact_level text not null default 'medium' check (impact_level in ('low', 'medium', 'high', 'critical')),
  status_key text not null default 'information',
  priority_rank integer not null default 100,
  created_at timestamptz not null default now()
);

create index if not exists business_os_command_center_radar_org_idx
  on public.business_os_command_center_radar_items (organization_id, priority_rank);

create table if not exists public.business_os_command_center_pulse_metrics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  period_key text not null check (period_key in ('today', 'this_week', 'this_month')),
  metric_category text not null check (metric_category in (
    'revenue', 'customers', 'support', 'projects', 'approvals', 'integrations'
  )),
  metric_value text not null default '',
  trend_label text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, period_key, metric_category)
);

create table if not exists public.business_os_command_center_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  event_source text not null check (event_source in (
    'operations', 'finance', 'support', 'security', 'companion', 'business_packs'
  )),
  event_type text not null,
  title text not null,
  summary text not null default '' check (char_length(summary) <= 500),
  status_key text not null default 'information',
  created_at timestamptz not null default now()
);

create index if not exists business_os_command_center_events_org_idx
  on public.business_os_command_center_events (organization_id, created_at desc);

create table if not exists public.business_os_command_center_morning_briefings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  greeting_name text not null default '',
  since_login_summary text not null default '',
  highlights jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  status_key text not null default 'verified',
  generated_at timestamptz not null default now()
);

create index if not exists business_os_command_center_briefings_org_idx
  on public.business_os_command_center_morning_briefings (organization_id, generated_at desc);

create table if not exists public.business_os_command_center_widgets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  widget_key text not null check (widget_key in (
    'revenue', 'customers', 'tasks', 'support', 'projects', 'business_packs', 'companion'
  )),
  is_pinned boolean not null default true,
  is_hidden boolean not null default false,
  sort_order integer not null default 100,
  size text not null default 'medium' check (size in ('small', 'medium', 'large')),
  updated_at timestamptz not null default now(),
  unique (organization_id, widget_key)
);

create table if not exists public.business_os_command_center_cross_intelligence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  correlation_title text not null,
  observation text not null default '' check (char_length(observation) <= 500),
  suggested_action text not null default '',
  status_key text not null default 'requires_attention',
  created_at timestamptz not null default now()
);

create index if not exists business_os_command_center_cross_intel_org_idx
  on public.business_os_command_center_cross_intelligence (organization_id, created_at desc);

create table if not exists public.business_os_command_center_companion_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  capability_type text not null check (capability_type in (
    'ask_question', 'explain_metric', 'summarize_activity', 'recommend_action'
  )),
  recommendation text not null,
  reason text not null default '' check (char_length(reason) <= 500),
  status text not null default 'open' check (status in ('open', 'acknowledged', 'dismissed')),
  created_at timestamptz not null default now()
);

create index if not exists business_os_command_center_companion_org_idx
  on public.business_os_command_center_companion_items (organization_id, status);

create table if not exists public.business_os_command_center_readiness (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  mode_key text not null check (mode_key in (
    'board_meeting', 'investor_meeting', 'management_review'
  )),
  title text not null,
  key_metrics text not null default '',
  risks text not null default '',
  achievements text not null default '',
  priorities text not null default '',
  status_key text not null default 'information',
  updated_at timestamptz not null default now(),
  unique (organization_id, mode_key)
);

create table if not exists public.business_os_command_center_audit (
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

create index if not exists business_os_command_center_audit_org_idx
  on public.business_os_command_center_audit (organization_id, created_at desc);

alter table public.business_os_command_center_settings enable row level security;
alter table public.business_os_command_center_sections enable row level security;
alter table public.business_os_command_center_mission_metrics enable row level security;
alter table public.business_os_command_center_radar_items enable row level security;
alter table public.business_os_command_center_pulse_metrics enable row level security;
alter table public.business_os_command_center_events enable row level security;
alter table public.business_os_command_center_morning_briefings enable row level security;
alter table public.business_os_command_center_widgets enable row level security;
alter table public.business_os_command_center_cross_intelligence enable row level security;
alter table public.business_os_command_center_companion_items enable row level security;
alter table public.business_os_command_center_readiness enable row level security;
alter table public.business_os_command_center_audit enable row level security;
revoke all on public.business_os_command_center_settings from authenticated, anon;
revoke all on public.business_os_command_center_sections from authenticated, anon;
revoke all on public.business_os_command_center_mission_metrics from authenticated, anon;
revoke all on public.business_os_command_center_radar_items from authenticated, anon;
revoke all on public.business_os_command_center_pulse_metrics from authenticated, anon;
revoke all on public.business_os_command_center_events from authenticated, anon;
revoke all on public.business_os_command_center_morning_briefings from authenticated, anon;
revoke all on public.business_os_command_center_widgets from authenticated, anon;
revoke all on public.business_os_command_center_cross_intelligence from authenticated, anon;
revoke all on public.business_os_command_center_companion_items from authenticated, anon;
revoke all on public.business_os_command_center_readiness from authenticated, anon;
revoke all on public.business_os_command_center_audit from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_os_command_center', v.description
from (values
  ('business_os_command_center.view', 'View ABOS Command Center', 'View executive mission control, radar, pulse, events, and briefings'),
  ('business_os_command_center.manage', 'Manage ABOS Command Center', 'Configure widgets, acknowledge companion items, and manage readiness mode')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_os_command_center.view'), ('owner', 'business_os_command_center.manage'),
  ('administrator', 'business_os_command_center.view'), ('administrator', 'business_os_command_center.manage'),
  ('manager', 'business_os_command_center.view'), ('manager', 'business_os_command_center.manage'),
  ('employee', 'business_os_command_center.view'),
  ('support_agent', 'business_os_command_center.view'),
  ('moderator', 'business_os_command_center.view'),
  ('viewer', 'business_os_command_center.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._boscc441_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  return jsonb_build_object(
    'found', true,
    'organization_id', v_org_id,
    'user_id', v_user_id,
    'can_executive', public._irp_has_permission('business_os_command_center.manage', v_org_id),
    'can_manage', public._irp_has_permission('business_os_command_center.manage', v_org_id),
    'can_view', public._irp_has_permission('business_os_command_center.view', v_org_id)
  );
exception when others then
  return jsonb_build_object('found', false, 'error', 'Access denied');
end; $$;

create or replace function public._boscc441_log(
  p_org_id uuid, p_user_id uuid, p_item_type text, p_item_id uuid, p_action text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_command_center_audit
    (organization_id, user_id, item_type, item_id, action, description)
  values (p_org_id, p_user_id, p_item_type, p_item_id, p_action, left(p_desc, 500));
end; $$;

create or replace function public._boscc441_section_json(s public.business_os_command_center_sections)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', s.id, 'title', s.title, 'summary', s.summary,
    'metric_label', s.metric_label, 'metric_value', s.metric_value,
    'status_key', s.status_key, 'section_key', s.section_key, 'item_type', 'section'
  );
$$;

create or replace function public._boscc441_seed(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_os_command_center_settings (organization_id)
  values (p_org_id) on conflict do nothing;

  if exists (select 1 from public.business_os_command_center_mission_metrics where organization_id = p_org_id limit 1) then
    return;
  end if;

  insert into public.business_os_command_center_sections
    (organization_id, section_key, title, summary, metric_label, metric_value, status_key)
  values
    (p_org_id, 'executive_overview', 'Executive Overview', 'Single-screen visibility across revenue, growth, customers, and risks.', 'Org health', '82', 'verified'),
    (p_org_id, 'operational_overview', 'Operational Overview', 'Active operations, projects, and workflow status at a glance.', 'Active operations', '24', 'information'),
    (p_org_id, 'financial_overview', 'Financial Overview', 'Revenue trends, billing health, and financial alerts.', 'Revenue trend', '+6.4%', 'completed'),
    (p_org_id, 'customer_overview', 'Customer Overview', 'Customer health, onboarding, and satisfaction signals.', 'Customer health', '78', 'verified'),
    (p_org_id, 'workforce_overview', 'Workforce Overview', 'Team capacity, workload, and staffing visibility.', 'Utilization', '74%', 'information'),
    (p_org_id, 'intelligence_overview', 'Intelligence Overview', 'Cross-domain intelligence from maturity, health, and improvement engines.', 'Active signals', '12', 'requires_attention'),
    (p_org_id, 'companion_recommendations', 'Companion Recommendations', 'Aipify-prepared actions requiring your review.', 'Open recommendations', '5', 'waiting');

  insert into public.business_os_command_center_mission_metrics
    (organization_id, metric_key, metric_value, trend_label, status_key)
  values
    (p_org_id, 'revenue', '€284K MRR', '+6.4% vs last month', 'completed'),
    (p_org_id, 'growth', '14 new customers', 'Since last login', 'completed'),
    (p_org_id, 'customers', '1,248 active', 'Health score 78', 'verified'),
    (p_org_id, 'operations', '24 active workflows', '3 require attention', 'requires_attention'),
    (p_org_id, 'projects', '18 active', '2 delayed', 'waiting'),
    (p_org_id, 'risks', '4 open', '1 contract expires within 30 days', 'requires_attention'),
    (p_org_id, 'alerts', '7 pending', '2 integrations require attention', 'requires_attention');

  insert into public.business_os_command_center_radar_items
    (organization_id, radar_tier, title, summary, impact_level, status_key, priority_rank)
  values
    (p_org_id, 'healthy', 'Support operations stable', 'Resolution times within SLA; team capacity healthy.', 'low', 'verified', 10),
    (p_org_id, 'healthy', 'Revenue growth on track', 'MRR increased 6.4% since last period.', 'medium', 'completed', 20),
    (p_org_id, 'emerging_risk', '2 integrations require attention', 'OAuth tokens expiring within 7 days.', 'high', 'requires_attention', 30),
    (p_org_id, 'emerging_risk', 'Customer satisfaction trend declining', 'NPS down 4 points in support-heavy accounts.', 'high', 'requires_attention', 40),
    (p_org_id, 'critical', 'Contract renewal within 30 days', 'Enterprise account requires executive review.', 'critical', 'requires_attention', 50),
    (p_org_id, 'information', '7 approvals pending', 'Vendor and procurement requests awaiting review.', 'medium', 'waiting', 60);

  insert into public.business_os_command_center_pulse_metrics
    (organization_id, period_key, metric_category, metric_value, trend_label, status_key)
  values
    (p_org_id, 'today', 'revenue', '€9.2K', 'On pace', 'information'),
    (p_org_id, 'today', 'customers', '3 new', 'Today', 'completed'),
    (p_org_id, 'today', 'support', '42 tickets', 'Within SLA', 'verified'),
    (p_org_id, 'today', 'projects', '2 milestones', 'On track', 'information'),
    (p_org_id, 'today', 'approvals', '7 pending', 'Requires review', 'waiting'),
    (p_org_id, 'today', 'integrations', '2 attention', 'Token expiry', 'requires_attention'),
    (p_org_id, 'this_week', 'revenue', '+6.4%', 'Week over week', 'completed'),
    (p_org_id, 'this_week', 'customers', '14 new', 'Since last login', 'completed'),
    (p_org_id, 'this_week', 'support', '186 resolved', '12% faster', 'verified'),
    (p_org_id, 'this_week', 'projects', '5 completed', '2 delayed', 'waiting'),
    (p_org_id, 'this_week', 'approvals', '23 processed', '7 pending', 'information'),
    (p_org_id, 'this_week', 'integrations', '1 reconnected', '2 pending', 'requires_attention'),
    (p_org_id, 'this_month', 'revenue', '€284K MRR', '+6.4%', 'completed'),
    (p_org_id, 'this_month', 'customers', '1,248 active', 'Net +42', 'verified'),
    (p_org_id, 'this_month', 'support', '94% SLA', 'Trend improving', 'verified'),
    (p_org_id, 'this_month', 'projects', '18 active', 'Delivery stable', 'information'),
    (p_org_id, 'this_month', 'approvals', '156 processed', 'Avg 1.2 days', 'information'),
    (p_org_id, 'this_month', 'integrations', '12 healthy', '2 require attention', 'requires_attention');

  insert into public.business_os_command_center_events
    (organization_id, event_source, event_type, title, summary, status_key)
  values
    (p_org_id, 'finance', 'invoice_paid', 'Invoice Paid', 'Enterprise renewal invoice processed.', 'completed'),
    (p_org_id, 'operations', 'approval_completed', 'Approval Completed', 'Vendor request approved by finance.', 'completed'),
    (p_org_id, 'support', 'support_escalation', 'Support Escalation', 'Priority ticket escalated to tier 2.', 'requires_attention'),
    (p_org_id, 'security', 'security_alert', 'Security Alert', 'Unusual login pattern detected — review recommended.', 'requires_attention'),
    (p_org_id, 'companion', 'companion_recommendation', 'Companion Recommendation', 'Aipify recommends reviewing high-value customer account.', 'waiting'),
    (p_org_id, 'business_packs', 'new_customer', 'New Customer', '14 new customers onboarded since last login.', 'completed'),
    (p_org_id, 'operations', 'project_milestone', 'Project Milestone', 'Q2 rollout phase completed.', 'verified'),
    (p_org_id, 'finance', 'contract_expiry', 'Contract Expiry Warning', '1 contract expires within 30 days.', 'requires_attention');

  insert into public.business_os_command_center_morning_briefings
    (organization_id, greeting_name, since_login_summary, highlights, recommended_actions)
  values (
    p_org_id, 'Leader',
    'Since your last login, Aipify has monitored operations, finance, support, and companion signals.',
    '[
      {"text": "14 new customers", "status_key": "completed"},
      {"text": "Revenue increased 6.4%", "status_key": "completed"},
      {"text": "2 integrations require attention", "status_key": "requires_attention"},
      {"text": "1 contract expires within 30 days", "status_key": "requires_attention"},
      {"text": "7 approvals pending", "status_key": "waiting"}
    ]'::jsonb,
    '[
      {"rank": 1, "action": "Review Contract Renewal", "reason": "Enterprise account renewal within 30 days"},
      {"rank": 2, "action": "Approve Vendor Request", "reason": "Procurement approval pending 3 days"},
      {"rank": 3, "action": "Contact High-Value Customer", "reason": "Satisfaction trend declining on support-heavy account"}
    ]'::jsonb
  );

  insert into public.business_os_command_center_widgets
    (organization_id, widget_key, is_pinned, is_hidden, sort_order, size)
  values
    (p_org_id, 'revenue', true, false, 10, 'large'),
    (p_org_id, 'customers', true, false, 20, 'medium'),
    (p_org_id, 'tasks', true, false, 30, 'medium'),
    (p_org_id, 'support', true, false, 40, 'medium'),
    (p_org_id, 'projects', true, false, 50, 'medium'),
    (p_org_id, 'business_packs', false, false, 60, 'small'),
    (p_org_id, 'companion', true, false, 70, 'large');

  insert into public.business_os_command_center_cross_intelligence
    (organization_id, correlation_title, observation, suggested_action, status_key)
  values
    (p_org_id, 'Renewal risk correlation', 'Customer Satisfaction ↓ · Support Volume ↑ · Renewal Risk ↑', 'Review customer account.', 'requires_attention'),
    (p_org_id, 'Integration health pattern', 'Support escalations correlate with integration token expiry windows.', 'Reconnect expiring integrations.', 'requires_attention'),
    (p_org_id, 'Revenue momentum', 'New customer onboarding pace aligns with revenue growth trend.', 'Maintain onboarding cadence.', 'verified');

  insert into public.business_os_command_center_companion_items
    (organization_id, capability_type, recommendation, reason)
  values
    (p_org_id, 'explain_metric', 'Revenue increased 6.4% driven by 14 new customers and expansion revenue.', 'Cross-correlated from finance and customer signals.'),
    (p_org_id, 'summarize_activity', 'Since last login: 14 customers, 7 approvals pending, 2 integration alerts.', 'Unified event stream summary.'),
    (p_org_id, 'recommend_action', 'Review contract renewal for enterprise account expiring within 30 days.', 'Renewal risk elevated with declining satisfaction trend.'),
    (p_org_id, 'ask_question', 'Ask Aipify about any metric, alert, or recommendation visible in Command Center.', 'Companion remains available for operational questions.');

  insert into public.business_os_command_center_readiness
    (organization_id, mode_key, title, key_metrics, risks, achievements, priorities, status_key)
  values
    (p_org_id, 'board_meeting', 'Board Meeting Readiness',
     'MRR €284K (+6.4%) · 1,248 customers · Org health 82',
     '1 contract renewal · 2 integration alerts · Support volume trend',
     '14 new customers · Support SLA 94% · Revenue growth on track',
     'Contract renewal review · Integration health · Customer success outreach', 'information'),
    (p_org_id, 'investor_meeting', 'Investor Meeting Readiness',
     'Growth +6.4% · Net +42 customers · Command health 82',
     'Emerging support volume trend · Pending approvals backlog',
     'Operational maturity improving · Support pack optimized',
     'Growth narrative · Unit economics · Retention metrics', 'information'),
    (p_org_id, 'management_review', 'Management Review Readiness',
     '18 active projects · 7 pending approvals · 4 open risks',
     '2 delayed projects · Knowledge maturity below benchmark',
     'Approval chain simplification succeeded · Support macros deployed',
     'Project delivery · Workforce capacity · Process automation', 'waiting');
end; $$;

create or replace function public.get_business_os_command_center()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_name text;
  v_exec jsonb; v_ops jsonb; v_fin jsonb; v_cust jsonb; v_work jsonb; v_intel jsonb; v_comp jsonb;
  v_mission jsonb; v_radar jsonb; v_pulse jsonb; v_events jsonb; v_briefing jsonb;
  v_widgets jsonb; v_cross jsonb; v_companion jsonb; v_readiness jsonb;
  v_readiness_mode text;
begin
  perform public._irp_require_permission('business_os_command_center.view');
  v_ctx := public._boscc441_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('found', false, 'error', coalesce(v_ctx->>'error', 'Access denied'));
  end if;

  v_org_id := (v_ctx->>'organization_id')::uuid;
  perform public._boscc441_seed(v_org_id);

  select coalesce(u.full_name, 'Leader') into v_user_name
  from public.users u where u.id = (v_ctx->>'user_id')::uuid limit 1;

  select readiness_mode into v_readiness_mode
  from public.business_os_command_center_settings where organization_id = v_org_id;

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_exec from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'executive_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_ops from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'operational_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_fin from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'financial_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_cust from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'customer_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_work from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'workforce_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_intel from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'intelligence_overview';

  select coalesce(jsonb_agg(public._boscc441_section_json(s)), '[]'::jsonb)
  into v_comp from public.business_os_command_center_sections s
  where s.organization_id = v_org_id and s.section_key = 'companion_recommendations';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'metric_key', m.metric_key, 'metric_value', m.metric_value,
    'trend_label', m.trend_label, 'status_key', m.status_key, 'item_type', 'mission'
  ) order by case m.metric_key
    when 'revenue' then 1 when 'growth' then 2 when 'customers' then 3 when 'operations' then 4
    when 'projects' then 5 when 'risks' then 6 else 7 end), '[]'::jsonb)
  into v_mission from public.business_os_command_center_mission_metrics m where m.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'radar_tier', r.radar_tier, 'title', r.title, 'summary', r.summary,
    'impact_level', r.impact_level, 'status_key', r.status_key, 'item_type', 'radar'
  ) order by r.priority_rank), '[]'::jsonb)
  into v_radar from public.business_os_command_center_radar_items r where r.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', p.id, 'period_key', p.period_key, 'metric_category', p.metric_category,
    'metric_value', p.metric_value, 'trend_label', p.trend_label,
    'status_key', p.status_key, 'item_type', 'pulse'
  ) order by case p.period_key when 'today' then 1 when 'this_week' then 2 else 3 end,
    case p.metric_category when 'revenue' then 1 when 'customers' then 2 when 'support' then 3
      when 'projects' then 4 when 'approvals' then 5 else 6 end), '[]'::jsonb)
  into v_pulse from public.business_os_command_center_pulse_metrics p where p.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'event_source', e.event_source, 'event_type', e.event_type,
    'title', e.title, 'summary', e.summary, 'status_key', e.status_key,
    'created_at', e.created_at, 'item_type', 'event'
  ) order by e.created_at desc), '[]'::jsonb)
  into v_events from public.business_os_command_center_events e where e.organization_id = v_org_id;

  select coalesce(jsonb_build_object(
    'id', b.id, 'greeting', 'Good Morning, ' || coalesce(v_user_name, b.greeting_name) || '.',
    'since_login_summary', b.since_login_summary,
    'highlights', b.highlights, 'recommended_actions', b.recommended_actions,
    'status_key', b.status_key, 'item_type', 'briefing'
  ), '{}'::jsonb)
  into v_briefing
  from public.business_os_command_center_morning_briefings b
  where b.organization_id = v_org_id
  order by b.generated_at desc limit 1;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id, 'widget_key', w.widget_key, 'is_pinned', w.is_pinned,
    'is_hidden', w.is_hidden, 'sort_order', w.sort_order, 'size', w.size, 'item_type', 'widget'
  ) order by w.sort_order), '[]'::jsonb)
  into v_widgets from public.business_os_command_center_widgets w where w.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', c.id, 'correlation_title', c.correlation_title, 'observation', c.observation,
    'suggested_action', c.suggested_action, 'status_key', c.status_key, 'item_type', 'cross_intel'
  ) order by c.created_at desc), '[]'::jsonb)
  into v_cross from public.business_os_command_center_cross_intelligence c where c.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', ci.id, 'capability_type', ci.capability_type, 'recommendation', ci.recommendation,
    'reason', ci.reason, 'status', ci.status, 'item_type', 'companion'
  ) order by ci.created_at desc), '[]'::jsonb)
  into v_companion from public.business_os_command_center_companion_items ci
  where ci.organization_id = v_org_id and ci.status = 'open';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', rd.id, 'mode_key', rd.mode_key, 'title', rd.title,
    'key_metrics', rd.key_metrics, 'risks', rd.risks,
    'achievements', rd.achievements, 'priorities', rd.priorities,
    'status_key', rd.status_key, 'item_type', 'readiness'
  ) order by rd.mode_key), '[]'::jsonb)
  into v_readiness from public.business_os_command_center_readiness rd where rd.organization_id = v_org_id;

  return jsonb_build_object(
    'found', true,
    'philosophy', 'A leader should never need to open ten different systems to understand the business. Aipify is the single operational command center — the central nervous system of the organization.',
    'can_executive', coalesce(v_ctx->>'can_executive', 'false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage', 'false') = 'true',
    'governance_note', 'Visibility controlled by role, permissions, department, and organization scope.',
    'readiness_mode', coalesce(v_readiness_mode, 'standard'),
    'executive_mission_control', v_mission,
    'organization_radar', v_radar,
    'live_business_pulse', v_pulse,
    'unified_event_stream', v_events,
    'morning_briefing', v_briefing,
    'widgets', v_widgets,
    'cross_system_intelligence', v_cross,
    'companion_advisor', v_companion,
    'executive_readiness', v_readiness,
    'sections', jsonb_build_object(
      'executive_overview', v_exec,
      'operational_overview', v_ops,
      'financial_overview', v_fin,
      'customer_overview', v_cust,
      'workforce_overview', v_work,
      'intelligence_overview', v_intel,
      'companion_recommendations', v_comp
    ),
    'statistics', jsonb_build_object(
      'mission_count', jsonb_array_length(v_mission),
      'radar_count', jsonb_array_length(v_radar),
      'event_count', jsonb_array_length(v_events),
      'widget_count', jsonb_array_length(v_widgets),
      'companion_count', jsonb_array_length(v_companion)
    ),
    'privacy_note', 'Operational metadata and aggregate signals only — no raw customer communications stored in Command Center.',
    'links', jsonb_build_object(
      'presence_feed', '/app/command-center#presence',
      'desktop_connect', '/app/command-center/connect',
      'legacy_mission_control', '/api/aipify/enterprise-command-center-mission-control-engine/dashboard'
    )
  );
end; $$;

create or replace function public.manage_business_os_command_center_item(
  p_item_type text,
  p_item_id uuid default null,
  p_action text default 'acknowledge',
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._boscc441_access();
  if coalesce(v_ctx->>'can_manage', 'false') <> 'true' then
    raise exception 'Not authorized';
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if p_action not in ('acknowledge', 'dismiss', 'pin', 'unpin', 'hide', 'show', 'set_readiness_mode') then
    raise exception 'Invalid action';
  end if;

  if p_item_type = 'companion' then
    update public.business_os_command_center_companion_items set
      status = case p_action when 'acknowledge' then 'acknowledged' when 'dismiss' then 'dismissed' else status end
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'widget' then
    update public.business_os_command_center_widgets set
      is_pinned = case when p_action = 'pin' then true when p_action = 'unpin' then false else is_pinned end,
      is_hidden = case when p_action = 'hide' then true when p_action = 'show' then false else is_hidden end,
      sort_order = coalesce((p_payload->>'sort_order')::integer, sort_order),
      size = coalesce(nullif(p_payload->>'size', ''), size),
      updated_at = now()
    where id = p_item_id and organization_id = v_org_id;
  elsif p_item_type = 'settings' and p_action = 'set_readiness_mode' then
    update public.business_os_command_center_settings set
      readiness_mode = coalesce(nullif(p_payload->>'readiness_mode', ''), readiness_mode),
      updated_at = now()
    where organization_id = v_org_id;
  end if;

  perform public._boscc441_log(v_org_id, v_user_id, p_item_type, p_item_id, p_action, 'Command center item updated');
  return jsonb_build_object('ok', true, 'action', p_action);
end; $$;

grant execute on function public.get_business_os_command_center() to authenticated;
grant execute on function public.manage_business_os_command_center_item(text, uuid, text, jsonb) to authenticated;