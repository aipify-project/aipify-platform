-- Phase 539 — Companion Command Center & Organizational Operating Hub
-- The operational brain of the organization — not a chatbot, not a dashboard.

-- ---------------------------------------------------------------------------
-- 1. Settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_view_mode text not null default 'auto' check (
    default_view_mode in ('auto', 'executive', 'manager', 'employee')
  ),
  since_last_login_enabled boolean not null default true,
  organization_health_enabled boolean not null default true,
  companion_recommendations_enabled boolean not null default true,
  critical_alerts_enabled boolean not null default true,
  companion_memory_enabled boolean not null default true,
  executive_mode_enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_companion_command_center_settings enable row level security;
revoke all on public.organization_companion_command_center_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_recommendations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  recommendation_type text not null check (
    recommendation_type in (
      'immediate_action', 'upcoming_risk', 'opportunity', 'process_improvement',
      'efficiency', 'revenue', 'decision_support', 'companion'
    )
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  title text not null,
  summary text not null default '',
  impact_note text,
  effort_hint text,
  value_hint text,
  record_href text not null default '/app/command-center',
  business_pack_key text,
  status text not null default 'active' check (status in ('active', 'dismissed', 'completed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_companion_command_center_recs_org_idx
  on public.organization_companion_command_center_recommendations (organization_id, status, priority);

alter table public.organization_companion_command_center_recommendations enable row level security;
revoke all on public.organization_companion_command_center_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Critical alerts
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_alerts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  alert_type text not null check (
    alert_type in (
      'security', 'compliance', 'operational', 'vendor', 'financial', 'system'
    )
  ),
  severity text not null default 'attention' check (
    severity in ('information', 'attention', 'critical')
  ),
  title text not null,
  summary text not null default '',
  impact_note text,
  recommendation text,
  record_href text not null default '/app/command-center',
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_command_center_alerts_org_idx
  on public.organization_companion_command_center_alerts (organization_id, severity, created_at desc);

alter table public.organization_companion_command_center_alerts enable row level security;
revoke all on public.organization_companion_command_center_alerts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Action items
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  action_type text not null check (
    action_type in ('task', 'approval', 'review', 'meeting', 'workflow', 'escalation')
  ),
  priority text not null default 'moderate' check (
    priority in ('low', 'moderate', 'high', 'critical')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'in_progress', 'completed', 'escalated', 'overdue')
  ),
  title text not null,
  summary text not null default '',
  due_at timestamptz,
  record_href text not null default '/app/command-center/actions',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_companion_command_center_actions_org_idx
  on public.organization_companion_command_center_actions (organization_id, status, due_at);

alter table public.organization_companion_command_center_actions enable row level security;
revoke all on public.organization_companion_command_center_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Companion memory layer
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_memory (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  memory_key text not null,
  memory_type text not null check (
    memory_type in (
      'preference', 'favorite_view', 'common_search', 'frequent_module',
      'preferred_report', 'reviewed_data'
    )
  ),
  memory_value jsonb not null default '{}'::jsonb,
  use_count integer not null default 1 check (use_count >= 0),
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, memory_key)
);

alter table public.organization_companion_command_center_memory enable row level security;
revoke all on public.organization_companion_command_center_memory from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Business pack intelligence snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_pack_intel (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  business_pack_key text not null,
  intel_type text not null check (intel_type in ('highlight', 'warning', 'insight', 'recommendation')),
  title text not null,
  summary text not null default '',
  record_href text not null default '/app/command-center',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_command_center_pack_intel_org_idx
  on public.organization_companion_command_center_pack_intel (organization_id, business_pack_key);

alter table public.organization_companion_command_center_pack_intel enable row level security;
revoke all on public.organization_companion_command_center_pack_intel from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.organization_companion_command_center_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  summary text not null,
  section text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists organization_companion_command_center_audit_org_idx
  on public.organization_companion_command_center_audit_logs (organization_id, created_at desc);

alter table public.organization_companion_command_center_audit_logs enable row level security;
revoke all on public.organization_companion_command_center_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cc539_org()
returns uuid language sql stable security definer set search_path = public as $$
  select public._mta_require_organization();
$$;

create or replace function public._cc539_ensure_settings(p_org_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_command_center_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;
end; $$;

create or replace function public._cc539_log(
  p_org_id uuid, p_action text, p_summary text,
  p_section text default null, p_payload jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_companion_command_center_audit_logs (
    organization_id, actor_user_id, action, summary, section, payload
  ) values (
    p_org_id,
    (select id from public.users where auth_user_id = auth.uid() limit 1),
    p_action, p_summary, p_section, coalesce(p_payload, '{}'::jsonb)
  );
end; $$;

create or replace function public._cc539_user_role(p_org_id uuid, p_user_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  select role into v_role from public.organization_users
  where organization_id = p_org_id and user_id = p_user_id and status = 'active'
  limit 1;
  return coalesce(v_role, 'staff');
end; $$;

create or replace function public._cc539_view_mode(p_org_id uuid, p_user_id uuid, p_override text default null)
returns text language plpgsql stable security definer set search_path = public as $$
declare v_role text;
begin
  if p_override in ('executive', 'manager', 'employee') then return p_override; end if;
  v_role := public._cc539_user_role(p_org_id, p_user_id);
  if v_role in ('owner', 'administrator') then return 'executive';
  elsif v_role = 'manager' then return 'manager';
  else return 'employee';
  end if;
end; $$;

create or replace function public._cc539_health_status(p_score int)
returns text language sql immutable as $$
  select case
    when p_score >= 90 then 'excellent'
    when p_score >= 75 then 'healthy'
    when p_score >= 50 then 'needs_attention'
    else 'critical'
  end;
$$;

create or replace function public._cc539_organization_health(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_operational int := 82;
  v_financial int := 78;
  v_customer int := 85;
  v_compliance int := 88;
  v_security int := 92;
  v_growth int := 76;
  v_workload int := 74;
  v_overall int;
  v_critical_alerts int;
begin
  select count(*) into v_critical_alerts
  from public.organization_companion_command_center_alerts
  where organization_id = p_org_id and severity = 'critical' and resolved_at is null;

  if v_critical_alerts > 0 then
    v_operational := greatest(v_operational - 15, 40);
    v_security := greatest(v_security - 10, 45);
  end if;

  if to_regclass('public.organization_activity_operations_events') is not null then
    if (select count(*) from public.organization_activity_operations_events
        where organization_id = p_org_id and priority = 'critical'
          and occurred_at >= now() - interval '7 days') > 0 then
      v_operational := greatest(v_operational - 8, 50);
    end if;
  end if;

  v_overall := round((v_operational + v_financial + v_customer + v_compliance + v_security + v_growth + v_workload) / 7.0);

  return jsonb_build_object(
    'overall_score', v_overall,
    'overall_status', public._cc539_health_status(v_overall),
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'operational', 'label', 'Operational Health', 'score', v_operational, 'status', public._cc539_health_status(v_operational)),
      jsonb_build_object('key', 'financial', 'label', 'Financial Health', 'score', v_financial, 'status', public._cc539_health_status(v_financial)),
      jsonb_build_object('key', 'customer', 'label', 'Customer Health', 'score', v_customer, 'status', public._cc539_health_status(v_customer)),
      jsonb_build_object('key', 'compliance', 'label', 'Compliance Health', 'score', v_compliance, 'status', public._cc539_health_status(v_compliance)),
      jsonb_build_object('key', 'security', 'label', 'Security Health', 'score', v_security, 'status', public._cc539_health_status(v_security)),
      jsonb_build_object('key', 'growth', 'label', 'Growth Health', 'score', v_growth, 'status', public._cc539_health_status(v_growth)),
      jsonb_build_object('key', 'workload', 'label', 'Workload Health', 'score', v_workload, 'status', public._cc539_health_status(v_workload))
    ),
    'status_levels', jsonb_build_array(
      jsonb_build_object('key', 'excellent', 'label', 'Excellent', 'icon', '🟢'),
      jsonb_build_object('key', 'healthy', 'label', 'Healthy', 'icon', '🟢'),
      jsonb_build_object('key', 'needs_attention', 'label', 'Needs Attention', 'icon', '⚠️'),
      jsonb_build_object('key', 'critical', 'label', 'Critical', 'icon', '🚨')
    )
  );
end; $$;

create or replace function public._cc539_seed_hub(p_org_id uuid)
returns int language plpgsql security definer set search_path = public as $$
declare v_count int;
begin
  select count(*) into v_count from public.organization_companion_command_center_recommendations where organization_id = p_org_id;
  if v_count > 0 then return v_count; end if;

  insert into public.organization_companion_command_center_recommendations (
    organization_id, recommendation_type, priority, title, summary, impact_note, effort_hint, value_hint, record_href
  ) values
    (p_org_id, 'immediate_action', 'high', 'Review pending approvals', 'Approvals waiting may block operational progress.', 'Delayed approvals increase risk and friction.', 'Low effort', 'High operational clarity', '/app/approvals'),
    (p_org_id, 'opportunity', 'moderate', 'Customer expansion opportunity detected', 'Recent customer activity suggests upsell potential.', 'Revenue growth opportunity.', 'Moderate effort', 'Revenue impact', '/app/customers'),
    (p_org_id, 'upcoming_risk', 'high', 'Contract renewal should begin now', 'A contract may require review within 30 days.', 'Renewal delays can affect revenue continuity.', 'Moderate effort', 'Risk reduction', '/app/customers'),
    (p_org_id, 'efficiency', 'moderate', 'Process improvement suggested', 'Workflow automation may reduce repetitive tasks.', 'Time savings across the team.', 'Low effort', 'Efficiency gain', '/app/automation'),
    (p_org_id, 'revenue', 'moderate', 'Outstanding invoices need attention', 'Follow up on overdue invoices to protect cash flow.', 'Cash flow impact.', 'Low effort', 'Financial stability', '/app/finance');

  insert into public.organization_companion_command_center_alerts (
    organization_id, alert_type, severity, title, summary, recommendation, record_href
  ) values
    (p_org_id, 'operational', 'information', 'No critical security events detected', 'Security monitoring shows no critical incidents.', null, '/app/security'),
    (p_org_id, 'compliance', 'attention', 'Compliance review recommended', 'Periodic compliance check is due this quarter.', 'Schedule compliance review with responsible owner.', '/app/governance');

  insert into public.organization_companion_command_center_actions (
    organization_id, action_type, priority, status, title, summary, due_at, record_href
  ) values
    (p_org_id, 'approval', 'high', 'pending', 'Approve procurement request', 'Procurement request awaiting your approval.', now() + interval '2 days', '/app/approvals'),
    (p_org_id, 'task', 'moderate', 'pending', 'Prepare quarterly review', 'Quarterly business review materials due soon.', now() + interval '7 days', '/app/projects'),
    (p_org_id, 'meeting', 'moderate', 'pending', 'Leadership sync', 'Upcoming leadership meeting — review briefing.', now() + interval '1 day', '/app/calendar'),
    (p_org_id, 'review', 'high', 'pending', 'Review partner agreement', 'Partner agreement requires executive review.', now() + interval '3 days', '/app/customers');

  insert into public.organization_companion_command_center_pack_intel (
    organization_id, business_pack_key, intel_type, title, summary, record_href
  ) values
    (p_org_id, 'hosts', 'highlight', 'Upcoming check-ins', 'Guest arrivals scheduled this week.', '/app/aipify-hosts'),
    (p_org_id, 'warehouse', 'warning', 'Low inventory signal', 'Inventory forecast indicates potential shortage in 14 days.', '/app/inventory'),
    (p_org_id, 'finance', 'insight', 'Outstanding invoices', 'Several invoices are awaiting payment follow-up.', '/app/finance'),
    (p_org_id, 'support', 'warning', 'Escalated cases', 'Support cases require manager attention.', '/app/cases'),
    (p_org_id, 'partner', 'recommendation', 'Commission opportunity', 'Growth Partner commission update available for review.', '/app/sales');

  select count(*) into v_count from public.organization_companion_command_center_recommendations where organization_id = p_org_id;
  return v_count;
end; $$;

create or replace function public._cc539_rec_json(r public.organization_companion_command_center_recommendations)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'priority', r.priority,
    'title', r.title, 'summary', r.summary, 'impact_note', r.impact_note,
    'effort_hint', r.effort_hint, 'value_hint', r.value_hint, 'record_href', r.record_href,
    'business_pack_key', r.business_pack_key, 'status', r.status
  );
$$;

create or replace function public._cc539_alert_json(r public.organization_companion_command_center_alerts)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'alert_type', r.alert_type, 'severity', r.severity,
    'title', r.title, 'summary', r.summary, 'impact_note', r.impact_note,
    'recommendation', r.recommendation, 'record_href', r.record_href, 'created_at', r.created_at
  );
$$;

create or replace function public._cc539_action_json(r public.organization_companion_command_center_actions)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'action_type', r.action_type, 'priority', r.priority, 'status', r.status,
    'title', r.title, 'summary', r.summary, 'due_at', r.due_at, 'record_href', r.record_href
  );
$$;

-- ---------------------------------------------------------------------------
-- 9. Command Center
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_command_center(p_view_mode text default null, p_section text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_companion_command_center_settings;
  v_view_mode text;
  v_since jsonb;
  v_health jsonb;
  v_user_name text;
begin
  perform public._irp_require_permission('companion_command_center.view');
  v_org_id := public._cc539_org();
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);
  perform public._cc539_ensure_settings(v_org_id);
  perform public._cc539_seed_hub(v_org_id);
  select * into v_settings from public.organization_companion_command_center_settings where organization_id = v_org_id;
  v_view_mode := public._cc539_view_mode(v_org_id, v_user_id, p_view_mode);
  v_health := public._cc539_organization_health(v_org_id);

  select coalesce(nullif(trim(full_name), ''), 'there')
  into v_user_name from public.users where id = v_user_id;

  if to_regprocedure('public._aact538_build_since_last_login(uuid,uuid,boolean)') is not null then
    begin
      v_since := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    exception when others then v_since := '{}'::jsonb;
    end;
  else v_since := '{}'::jsonb;
  end if;

  perform public._cc539_log(v_org_id, 'command_center_accessed', 'Companion Command Center accessed', p_section,
    jsonb_build_object('view_mode', v_view_mode, 'section', p_section));

  return jsonb_build_object(
    'found', true,
    'principle', 'Users should not open Aipify and wonder where to begin. Aipify should already know.',
    'philosophy', 'One Command Center. One Companion. One Operational Workspace.',
    'view_mode', v_view_mode,
    'user_name', v_user_name,
    'executive_briefing', jsonb_build_object(
      'greeting', 'Good morning ' || v_user_name || '.',
      'since_last_login', v_since,
      'headline', coalesce(v_since->>'headline', 'Your organizational briefing is ready.'),
      'summary_lines', coalesce(v_since->'summary_lines', '[]'::jsonb),
      'recommended_focus', coalesce((
        select jsonb_agg(jsonb_build_object('title', title, 'href', record_href))
        from (
          select title, record_href from public.organization_companion_command_center_recommendations
          where organization_id = v_org_id and status = 'active'
          order by case priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end
          limit 4
        ) x
      ), '[]'::jsonb),
      'companion_summary', coalesce(v_since->>'companion_summary', 'Aipify has prepared your executive summary.')
    ),
    'organization_health', v_health,
    'since_last_login', v_since,
    'recommended_actions', coalesce((
      select jsonb_agg(public._cc539_rec_json(r) order by
        case r.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end)
      from (
        select * from public.organization_companion_command_center_recommendations
        where organization_id = v_org_id and status = 'active'
        order by case priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end
        limit 20
      ) r
    ), '[]'::jsonb),
    'pending_approvals', coalesce((
      select jsonb_agg(public._cc539_action_json(a) order by a.due_at nulls last)
      from (
        select * from public.organization_companion_command_center_actions
        where organization_id = v_org_id and action_type = 'approval' and status in ('pending', 'overdue')
        order by due_at nulls last limit 20
      ) a
    ), '[]'::jsonb),
    'upcoming_deadlines', coalesce((
      select jsonb_agg(public._cc539_action_json(a) order by a.due_at)
      from (
        select * from public.organization_companion_command_center_actions
        where organization_id = v_org_id and due_at is not null and status in ('pending', 'in_progress', 'overdue')
        order by due_at limit 15
      ) a
    ), '[]'::jsonb),
    'critical_alerts', coalesce((
      select jsonb_agg(public._cc539_alert_json(a) order by
        case a.severity when 'critical' then 1 when 'attention' then 2 else 3 end, a.created_at desc)
      from (
        select * from public.organization_companion_command_center_alerts
        where organization_id = v_org_id and resolved_at is null
        order by case severity when 'critical' then 1 when 'attention' then 2 else 3 end, created_at desc
        limit 20
      ) a
    ), '[]'::jsonb),
    'companion_recommendations', coalesce((
      select jsonb_agg(public._cc539_rec_json(r) order by r.created_at desc)
      from (
        select * from public.organization_companion_command_center_recommendations
        where organization_id = v_org_id and status = 'active'
        order by created_at desc limit 15
      ) r
    ), '[]'::jsonb),
    'business_pack_intelligence', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'business_pack_key', p.business_pack_key, 'intel_type', p.intel_type,
        'title', p.title, 'summary', p.summary, 'record_href', p.record_href
      ) order by p.created_at desc)
      from public.organization_companion_command_center_pack_intel p
      where p.organization_id = v_org_id
    ), '[]'::jsonb),
    'personal_workspace', jsonb_build_object(
      'my_tasks', coalesce((
        select jsonb_agg(public._cc539_action_json(a))
        from (
          select * from public.organization_companion_command_center_actions
          where organization_id = v_org_id and action_type = 'task' and (user_id = v_user_id or user_id is null)
          and status in ('pending', 'in_progress', 'overdue') limit 10
        ) a
      ), '[]'::jsonb),
      'my_meetings', coalesce((
        select jsonb_agg(public._cc539_action_json(a))
        from (
          select * from public.organization_companion_command_center_actions
          where organization_id = v_org_id and action_type = 'meeting' limit 10
        ) a
      ), '[]'::jsonb),
      'my_approvals', coalesce((
        select jsonb_agg(public._cc539_action_json(a))
        from (
          select * from public.organization_companion_command_center_actions
          where organization_id = v_org_id and action_type = 'approval' and status = 'pending' limit 10
        ) a
      ), '[]'::jsonb),
      'my_priorities', coalesce((
        select jsonb_agg(public._cc539_action_json(a) order by a.due_at nulls last)
        from (
          select * from public.organization_companion_command_center_actions
          where organization_id = v_org_id and status in ('pending', 'overdue')
          order by due_at nulls last limit 8
        ) a
      ), '[]'::jsonb)
    ),
    'action_center', coalesce((
      select jsonb_agg(public._cc539_action_json(a) order by
        case a.status when 'overdue' then 1 when 'pending' then 2 else 3 end, a.due_at nulls last)
      from (
        select * from public.organization_companion_command_center_actions
        where organization_id = v_org_id and status in ('pending', 'in_progress', 'overdue', 'escalated')
        order by case status when 'overdue' then 1 when 'pending' then 2 else 3 end, due_at nulls last
        limit 40
      ) a
    ), '[]'::jsonb),
    'decision_support', jsonb_build_object(
      'opportunities', coalesce((
        select jsonb_agg(public._cc539_rec_json(r))
        from (
          select * from public.organization_companion_command_center_recommendations
          where organization_id = v_org_id and recommendation_type = 'opportunity' and status = 'active' limit 5
        ) r
      ), '[]'::jsonb),
      'risks', coalesce((
        select jsonb_agg(public._cc539_rec_json(r))
        from (
          select * from public.organization_companion_command_center_recommendations
          where organization_id = v_org_id and recommendation_type = 'upcoming_risk' and status = 'active' limit 5
        ) r
      ), '[]'::jsonb),
      'recommendations', coalesce((
        select jsonb_agg(public._cc539_rec_json(r))
        from (
          select * from public.organization_companion_command_center_recommendations
          where organization_id = v_org_id and recommendation_type = 'decision_support' and status = 'active' limit 5
        ) r
      ), '[]'::jsonb),
      'example_prompts', jsonb_build_array(
        'Should we hire?', 'Should we renew?', 'Should we expand inventory?', 'Should we add another domain?'
      ),
      'principle', 'Aipify supports decisions. Humans decide.'
    ),
    'meeting_intelligence', jsonb_build_object(
      'upcoming_meetings', coalesce((
        select jsonb_agg(public._cc539_action_json(a) order by a.due_at)
        from (
          select * from public.organization_companion_command_center_actions
          where organization_id = v_org_id and action_type = 'meeting' and due_at >= now() - interval '1 hour'
          order by due_at limit 10
        ) a
      ), '[]'::jsonb),
      'calendar_integrations', jsonb_build_array('microsoft_365', 'google_workspace', 'apple_calendar'),
      'follow_ups', '[]'::jsonb
    ),
    'notifications_hub', jsonb_build_object(
      'channels', jsonb_build_array('system', 'operational', 'companion', 'business_pack', 'approval', 'partner'),
      'route', '/app/notifications'
    ),
    'companion_memory', coalesce((
      select jsonb_agg(jsonb_build_object(
        'memory_key', m.memory_key, 'memory_type', m.memory_type,
        'memory_value', m.memory_value, 'use_count', m.use_count
      ) order by m.use_count desc)
      from (
        select * from public.organization_companion_command_center_memory
        where organization_id = v_org_id and user_id = v_user_id
        order by use_count desc limit 15
      ) m
    ), '[]'::jsonb),
    'companion_conversation', jsonb_build_object(
      'prompts', jsonb_build_array(
        'What changed since yesterday?',
        'What should I focus on?',
        'Show financial risks.',
        'Show top priorities.',
        'Generate executive summary.',
        'Show opportunities.'
      ),
      'uses_live_data', true,
      'context_route', '/api/assistant/companion-command-center-context'
    ),
    'search_integration', jsonb_build_object(
      'enabled', true,
      'route', '/app/search',
      'keyboard_shortcut', 'Cmd+K / Ctrl+K',
      'examples', jsonb_build_array('Find customer.', 'Find contract.', 'Find employee.', 'Find invoice.')
    ),
    'view_modes', jsonb_build_object(
      'executive', jsonb_build_object(
        'label', 'Executive View',
        'sections', jsonb_build_array('organization_health', 'executive_briefing', 'critical_alerts', 'decision_support', 'approvals')
      ),
      'manager', jsonb_build_object(
        'label', 'Manager View',
        'sections', jsonb_build_array('team_activity', 'approvals', 'workload', 'operational_alerts', 'projects')
      ),
      'employee', jsonb_build_object(
        'label', 'Employee View',
        'sections', jsonb_build_array('personal_workspace', 'tasks', 'meetings', 'approvals', 'notifications')
      ),
      'current', v_view_mode
    ),
    'team_activity', case when v_view_mode in ('executive', 'manager') then coalesce((
      select jsonb_build_object(
        'pending_approvals', (select count(*) from public.organization_companion_command_center_actions where organization_id = v_org_id and action_type = 'approval' and status = 'pending'),
        'overdue_items', (select count(*) from public.organization_companion_command_center_actions where organization_id = v_org_id and status = 'overdue'),
        'active_tasks', (select count(*) from public.organization_companion_command_center_actions where organization_id = v_org_id and action_type = 'task' and status in ('pending', 'in_progress'))
      )
    ), '{}'::jsonb) else null end,
    'mobile_access', jsonb_build_object('mobile_ready', true, 'desktop_companion', true, 'browser', true, 'tablet', true),
    'audit_recent', coalesce((
      select jsonb_agg(jsonb_build_object('action', a.action, 'summary', a.summary, 'section', a.section, 'created_at', a.created_at) order by a.created_at desc)
      from public.organization_companion_command_center_audit_logs a where a.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'sections', jsonb_build_array(
      'organization_health', 'since_last_login', 'recommended_actions', 'approvals',
      'critical_alerts', 'companion_recommendations', 'business_pack_intelligence', 'personal_priorities'
    ),
    'routes', jsonb_build_object(
      'command_center', '/app/command-center',
      'actions', '/app/command-center/actions',
      'approvals', '/app/approvals',
      'activity', '/app/activity',
      'search', '/app/search',
      'intelligence', '/app/intelligence/briefing',
      'notifications', '/app/notifications',
      'desktop_connect', '/app/command-center/connect'
    )
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Actions
-- ---------------------------------------------------------------------------
create or replace function public.perform_companion_command_center_action(
  p_action_type text, p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_id uuid;
  v_summary jsonb;
begin
  v_org_id := public._cc539_org();
  perform public._cc539_ensure_settings(v_org_id);
  v_user_id := (select id from public.users where auth_user_id = auth.uid() limit 1);

  if p_action_type in ('record_memory', 'dismiss_recommendation', 'acknowledge_alert', 'complete_action') then
    perform public._irp_require_permission('companion_command_center.manage');
  else
    perform public._irp_require_permission('companion_command_center.view');
  end if;

  if p_action_type = 'generate_executive_summary' then
    if to_regprocedure('public._aact538_build_since_last_login(uuid,uuid,boolean)') is not null then
      v_summary := public._aact538_build_since_last_login(v_org_id, v_user_id, false);
    else v_summary := '{}'::jsonb;
    end if;
    perform public._cc539_log(v_org_id, 'executive_summary_generated', 'Executive summary generated', 'executive_briefing', p_payload);
    return jsonb_build_object('ok', true, 'summary', v_summary);

  elsif p_action_type = 'briefing_viewed' then
    perform public._cc539_log(v_org_id, 'briefing_viewed', 'Executive briefing viewed', 'executive_briefing', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'recommendation_opened' then
    perform public._cc539_log(v_org_id, 'recommendation_opened', 'Recommendation opened', 'recommendations', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'alert_viewed' then
    perform public._cc539_log(v_org_id, 'alert_viewed', 'Alert viewed', 'critical_alerts', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'companion_conversation_started' then
    perform public._cc539_log(v_org_id, 'companion_conversation_started', 'Companion conversation started', 'companion', p_payload);
    return jsonb_build_object('ok', true);

  elsif p_action_type = 'dismiss_recommendation' then
    update public.organization_companion_command_center_recommendations
    set status = 'dismissed', updated_at = now()
    where id = (p_payload->>'recommendation_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'acknowledge_alert' then
    update public.organization_companion_command_center_alerts
    set acknowledged_at = now()
    where id = (p_payload->>'alert_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._cc539_log(v_org_id, 'alert_viewed', 'Alert acknowledged', 'critical_alerts', p_payload);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'complete_action' then
    update public.organization_companion_command_center_actions
    set status = 'completed', updated_at = now()
    where id = (p_payload->>'action_id')::uuid and organization_id = v_org_id
    returning id into v_id;
    perform public._cc539_log(v_org_id, 'approval_completed', 'Action item completed', 'action_center', p_payload);
    return jsonb_build_object('ok', v_id is not null);

  elsif p_action_type = 'record_memory' then
    insert into public.organization_companion_command_center_memory (
      organization_id, user_id, memory_key, memory_type, memory_value, use_count
    ) values (
      v_org_id, v_user_id,
      coalesce(p_payload->>'memory_key', 'preference'),
      coalesce(p_payload->>'memory_type', 'preference'),
      coalesce(p_payload->'memory_value', '{}'::jsonb),
      1
    )
    on conflict (organization_id, user_id, memory_key) do update set
      memory_value = excluded.memory_value,
      use_count = public.organization_companion_command_center_memory.use_count + 1,
      last_used_at = now()
    returning id into v_id;
    return jsonb_build_object('ok', true, 'memory_id', v_id);

  else
    return jsonb_build_object('ok', false, 'error', 'unknown_action');
  end if;
exception when others then
  return jsonb_build_object('ok', false, 'error', SQLERRM);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Companion & mobile
-- ---------------------------------------------------------------------------
create or replace function public.get_companion_command_center_context(p_query text default null, p_view_mode text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('companion_command_center.view');
  v_center := public.get_companion_command_center(p_view_mode, 'companion');
  return jsonb_build_object(
    'found', true,
    'principle', 'Aipify explains, prioritizes, and guides — using live organizational data.',
    'query', p_query,
    'view_mode', v_center->'view_mode',
    'executive_briefing', v_center->'executive_briefing',
    'organization_health', v_center->'organization_health',
    'since_last_login', v_center->'since_last_login',
    'recommended_actions', v_center->'recommended_actions',
    'critical_alerts', v_center->'critical_alerts',
    'decision_support', v_center->'decision_support',
    'companion_prompts', v_center->'companion_conversation'->'prompts',
    'routes', v_center->'routes'
  );
exception when others then
  return jsonb_build_object('found', false, 'error', SQLERRM);
end; $$;

create or replace function public.get_my_companion_command_center_summary()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_center jsonb;
begin
  perform public._irp_require_permission('companion_command_center.view');
  v_center := public.get_companion_command_center(null, 'mobile');
  return jsonb_build_object(
    'found', true,
    'can_manage', public._irp_has_permission('companion_command_center.manage', public._cc539_org()),
    'view_mode', v_center->'view_mode',
    'organization_health', v_center->'organization_health',
    'since_last_login', v_center->'since_last_login',
    'pending_approvals', v_center->'pending_approvals',
    'critical_alerts', v_center->'critical_alerts',
    'personal_workspace', v_center->'personal_workspace',
    'routes', v_center->'routes',
    'mobile_ready', true
  );
exception when others then
  return jsonb_build_object('found', true, 'routes', jsonb_build_object('command_center', '/app/command-center'));
end; $$;

do $$ begin
  perform public._mre501_seed_module(
    'companion_command_center', 'Companion Command Center', 'companion-command-center', 'operations',
    'Central Companion workspace — organization health, since last login, recommendations, approvals, and action center.',
    'starter', null, 'main', '/app/command-center', 'always', 1
  );
exception when others then null;
end $$;

insert into public.aipify_module_permissions (module_key, permission_key, permission_kind, description)
values
  ('companion_command_center', 'companion_command_center.view', 'view', 'Companion Command Center — view organizational operating hub'),
  ('companion_command_center', 'companion_command_center.manage', 'manage', 'Companion Command Center — manage memory, alerts, and actions')
on conflict do nothing;

grant execute on function public._cc539_health_status(int) to authenticated;
grant execute on function public._cc539_organization_health(uuid) to authenticated;
grant execute on function public.get_companion_command_center(text, text) to authenticated;
grant execute on function public.perform_companion_command_center_action(text, jsonb) to authenticated;
grant execute on function public.get_companion_command_center_context(text, text) to authenticated;
grant execute on function public.get_my_companion_command_center_summary() to authenticated;
