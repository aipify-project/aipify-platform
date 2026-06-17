-- Phase 327 — Companion Work Prioritization Engine
-- Transparent, explainable work prioritization — users decide, Aipify recommends.

create table if not exists public.companion_work_prioritization_settings (
  organization_id                 uuid primary key references public.organizations (id) on delete cascade,
  manager_team_priorities_enabled boolean not null default false,
  admin_org_priorities_enabled    boolean not null default true,
  default_focus_limit             integer not null default 5 check (default_focus_limit in (3, 5, 10)),
  preferences                     jsonb not null default '{}'::jsonb,
  updated_at                      timestamptz not null default now(),
  updated_by                      uuid references public.users (id) on delete set null
);

create table if not exists public.companion_work_priority_records (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations (id) on delete cascade,
  user_id             uuid not null references public.users (id) on delete cascade,
  priority_key        text not null default '',
  title               text not null default '',
  description         text not null check (char_length(description) <= 500),
  priority_level      text not null default 'medium' check (priority_level in (
    'critical','high','medium','low','optional'
  )),
  priority_score      integer not null default 0 check (priority_score between 0 and 100),
  reason              text not null default '',
  recommended_action  text not null default 'review_today',
  source_type         text not null default 'tasks' check (source_type in (
    'tasks','calendar','approvals','projects','recommendations','proactive_insights',
    'notifications','business_packs','organizational_goals','executive_priorities'
  )),
  owner_label         text not null default '',
  due_date            date,
  status              text not null default 'pending' check (status in (
    'pending','in_progress','blocked','completed','archived','postponed'
  )),
  department          text not null default '',
  project             text not null default '',
  factors             jsonb not null default '{}'::jsonb,
  rank_order          integer not null default 0,
  priority_date       date not null default current_date,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (organization_id, user_id, priority_key, priority_date)
);

create index if not exists companion_work_priority_records_org_idx
  on public.companion_work_priority_records (organization_id, user_id, priority_date desc, rank_order);

create table if not exists public.companion_work_priority_dependencies (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  priority_id     uuid not null references public.companion_work_priority_records (id) on delete cascade,
  dependency_type text not null check (dependency_type in (
    'blocked','blocking','dependent_team','pending_approval'
  )),
  related_key     text not null default '',
  title           text not null default '',
  description     text not null default '',
  created_at      timestamptz not null default now()
);

create index if not exists companion_work_priority_deps_org_idx
  on public.companion_work_priority_dependencies (organization_id, user_id, priority_id);

create table if not exists public.companion_work_priority_workload (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations (id) on delete cascade,
  user_id             uuid not null references public.users (id) on delete cascade,
  workload_date       date not null default current_date,
  current_workload    integer not null default 0 check (current_workload between 0 and 100),
  upcoming_workload   integer not null default 0 check (upcoming_workload between 0 and 100),
  overload_risk       text not null default 'balanced' check (overload_risk in (
    'balanced','elevated','high','critical'
  )),
  capacity_indicator  text not null default 'available' check (capacity_indicator in (
    'available','limited','constrained','overloaded'
  )),
  delegation_suggestion text not null default '',
  metadata            jsonb not null default '{}'::jsonb,
  unique (organization_id, user_id, workload_date)
);

create table if not exists public.companion_work_priority_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  priority_id     uuid references public.companion_work_priority_records (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_work_priority_timeline_org_idx
  on public.companion_work_priority_timeline (organization_id, created_at desc);

create table if not exists public.companion_work_priority_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  priority_id     uuid references public.companion_work_priority_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_work_prioritization_settings enable row level security;
alter table public.companion_work_priority_records       enable row level security;
alter table public.companion_work_priority_dependencies  enable row level security;
alter table public.companion_work_priority_workload      enable row level security;
alter table public.companion_work_priority_timeline      enable row level security;
alter table public.companion_work_priority_audit_logs    enable row level security;
revoke all on public.companion_work_prioritization_settings from authenticated, anon;
revoke all on public.companion_work_priority_records       from authenticated, anon;
revoke all on public.companion_work_priority_dependencies  from authenticated, anon;
revoke all on public.companion_work_priority_workload      from authenticated, anon;
revoke all on public.companion_work_priority_timeline      from authenticated, anon;
revoke all on public.companion_work_priority_audit_logs    from authenticated, anon;

create or replace function public._cwp327_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_priorities_enabled, false), coalesce(s.admin_org_priorities_enabled, true)
  into v_mgr, v_adm from public.companion_work_prioritization_settings s where s.organization_id = v_org_id;
  if v_role in ('owner', 'executive') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_executive', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_executive', false);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', false, 'can_executive', false);
  else
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', false, 'can_organization', false, 'can_executive', false);
  end if;
end; $$;

create or replace function public._cwp327_log(
  p_org_id uuid, p_user_id uuid, p_priority_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_work_priority_audit_logs
    (organization_id, priority_id, user_id, event_type, description, metadata)
  values (p_org_id, p_priority_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cwp327_timeline(
  p_org_id uuid, p_priority_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_work_priority_timeline
    (organization_id, priority_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_priority_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cwp327_focus_limit(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(
    (select s.default_focus_limit from public.companion_work_prioritization_settings s where s.organization_id = p_org_id),
    5
  );
$$;

create or replace function public.recalculate_companion_work_prioritization(p_force boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text; v_exists boolean; v_pid uuid;
begin
  v_ctx := public._cwp327_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');

  insert into public.companion_work_prioritization_settings (organization_id)
  values (v_org_id) on conflict (organization_id) do nothing;

  select exists(
    select 1 from public.companion_work_priority_records r
    where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
  ) into v_exists;

  if v_exists and not coalesce(p_force, false) then
    return jsonb_build_object('ok', true, 'recalculated', false);
  end if;

  delete from public.companion_work_priority_dependencies d
  using public.companion_work_priority_records r
  where d.priority_id = r.id and r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date;

  delete from public.companion_work_priority_records
  where organization_id = v_org_id and user_id = v_user_id and priority_date = current_date;

  insert into public.companion_work_priority_records (
    organization_id, user_id, priority_key, title, description, priority_level, priority_score,
    reason, recommended_action, source_type, owner_label, due_date, status, department, project,
    factors, rank_order
  ) values
    (v_org_id, v_user_id, 'pri_approval_block', 'Approval blocking departments',
     'Cross-department approval awaiting your decision.', 'critical', 95,
     'This approval is blocking three downstream tasks.',
     'complete_immediately', 'approvals', 'You', current_date, 'pending', 'Operations', 'Q2 Planning',
     jsonb_build_object('due_date', 90, 'business_impact', 95, 'organizational_risk', 88, 'team_dependencies', 92),
     1),
    (v_org_id, v_user_id, 'pri_strategic_task', 'Strategic initiative task',
     'Finalize deliverables for high-priority strategic initiative.', 'high', 82,
     'This task supports a high-priority strategic initiative.',
     'review_today', 'projects', 'You', current_date + 2, 'in_progress', 'Strategy', 'Growth Initiative',
     jsonb_build_object('strategic_importance', 90, 'business_impact', 80, 'executive_priority', 75),
     2),
    (v_org_id, v_user_id, 'pri_customer_issue', 'Unresolved customer issue',
     'Customer escalation requires follow-up.', 'high', 78,
     'This customer issue has remained unresolved for seven days.',
     'review_today', 'tasks', 'Customer Success', current_date - 1, 'pending', 'Customer Success', 'Enterprise Account',
     jsonb_build_object('customer_impact', 85, 'due_date', 70, 'business_impact', 72),
     3),
    (v_org_id, v_user_id, 'pri_exec_review', 'Executive review preparation',
     'Prepare materials for executive review meeting.', 'medium', 65,
     'Moderate urgency but high strategic value for leadership alignment.',
     'schedule_this_week', 'calendar', 'You', current_date + 3, 'pending', 'Executive', 'Leadership Review',
     jsonb_build_object('strategic_importance', 80, 'due_date', 55, 'executive_priority', 70),
     4),
    (v_org_id, v_user_id, 'pri_insight_staffing', 'Support staffing insight',
     'Proactive insight suggests reviewing support capacity.', 'medium', 58,
     'Support activity trend may affect team capacity this week.',
     'monitor', 'proactive_insights', 'Operations', current_date + 5, 'pending', 'Support', 'Operations',
     jsonb_build_object('organizational_risk', 60, 'user_workload', 55),
     5),
    (v_org_id, v_user_id, 'pri_rec_onboarding', 'Onboarding recommendation',
     'Consolidated onboarding review recommended.', 'medium', 52,
     'Recommendation aligns with customer success objectives.',
     'schedule_this_week', 'recommendations', 'Customer Success', current_date + 4, 'pending', 'Customer Success', 'Onboarding',
     jsonb_build_object('customer_impact', 65, 'business_impact', 50),
     6),
    (v_org_id, v_user_id, 'pri_delegate_report', 'Weekly report delegation',
     'Routine report could be delegated to free capacity.', 'low', 40,
     'Low urgency item suitable for delegation.',
     'delegate', 'tasks', 'Team Lead', current_date + 7, 'pending', 'Operations', 'Reporting',
     jsonb_build_object('user_workload', 70, 'business_impact', 30),
     7);

  select id into v_pid from public.companion_work_priority_records
  where organization_id = v_org_id and user_id = v_user_id and priority_key = 'pri_approval_block' and priority_date = current_date;

  insert into public.companion_work_priority_dependencies
    (organization_id, user_id, priority_id, dependency_type, related_key, title, description)
  values
    (v_org_id, v_user_id, v_pid, 'blocking', 'dep_ops', 'Operations pipeline', 'Three downstream tasks blocked'),
    (v_org_id, v_user_id, v_pid, 'pending_approval', 'appr_q2', 'Q2 budget approval', 'Awaiting owner approval'),
    (v_org_id, v_user_id, v_pid, 'dependent_team', 'team_finance', 'Finance team', 'Finance waiting on sign-off');

  insert into public.companion_work_priority_workload (
    organization_id, user_id, workload_date, current_workload, upcoming_workload,
    overload_risk, capacity_indicator, delegation_suggestion
  ) values (
    v_org_id, v_user_id, current_date, 78, 85, 'elevated', 'limited',
    'Consider delegating the weekly report and rescheduling non-critical reviews.'
  )
  on conflict (organization_id, user_id, workload_date) do update set
    current_workload = excluded.current_workload,
    upcoming_workload = excluded.upcoming_workload,
    overload_risk = excluded.overload_risk,
    capacity_indicator = excluded.capacity_indicator,
    delegation_suggestion = excluded.delegation_suggestion;

  perform public._cwp327_timeline(v_org_id, null, v_user_id, 'priorities_generated', 'Work priorities recalculated');
  perform public._cwp327_log(v_org_id, v_user_id, null, 'priorities_recalculated', 'Work priorities recalculated',
    jsonb_build_object('role', v_role, 'force', coalesce(p_force, false)));

  return jsonb_build_object('ok', true, 'recalculated', true);
end; $$;

create or replace function public.get_companion_work_prioritization_dashboard(
  p_priority text default null, p_department text default null, p_status text default null,
  p_project text default null, p_owner text default null, p_date_from date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text; v_items jsonb; v_timeline jsonb;
  v_score int; v_critical int; v_focus_limit int; v_workload record;
begin
  v_ctx := public._cwp327_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');
  perform public.recalculate_companion_work_prioritization(false);
  v_focus_limit := public._cwp327_focus_limit(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'description', r.description,
    'priority_level', r.priority_level, 'priority_score', r.priority_score,
    'reason', r.reason, 'recommended_action', r.recommended_action,
    'source_type', r.source_type, 'owner_label', r.owner_label,
    'due_date', r.due_date, 'status', r.status, 'department', r.department,
    'project', r.project, 'factors', r.factors, 'rank_order', r.rank_order
  ) order by r.rank_order, r.priority_score desc),'[]'::jsonb)
  into v_items
  from public.companion_work_priority_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
    and (p_priority is null or r.priority_level = p_priority)
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_status is null or r.status = p_status)
    and (p_project is null or r.project ilike '%'||trim(p_project)||'%')
    and (p_owner is null or r.owner_label ilike '%'||trim(p_owner)||'%')
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%' or r.description ilike '%'||trim(p_search)||'%'
         or r.reason ilike '%'||trim(p_search)||'%');

  select coalesce(avg(r.priority_score)::int, 0),
         count(*) filter (where r.priority_level = 'critical')
  into v_score, v_critical
  from public.companion_work_priority_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date;

  select * into v_workload from public.companion_work_priority_workload w
  where w.organization_id = v_org_id and w.user_id = v_user_id and w.workload_date = current_date;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_work_priority_timeline t
    where t.organization_id = v_org_id and (t.user_id = v_user_id or t.user_id is null)
    order by t.created_at desc limit 10
  ) t;

  return jsonb_build_object(
    'found', true,
    'has_priorities', jsonb_array_length(v_items) > 0,
    'role', v_role,
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive','false') = 'true',
    'work_priority_score', v_score,
    'critical_count', v_critical,
    'focus_limit', v_focus_limit,
    'todays_focus', coalesce(
      (select r.title from public.companion_work_priority_records r
       where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
       order by r.rank_order limit 1), 'operations'),
    'items', v_items,
    'workload', case when v_workload.id is null then null else jsonb_build_object(
      'current_workload', v_workload.current_workload,
      'upcoming_workload', v_workload.upcoming_workload,
      'overload_risk', v_workload.overload_risk,
      'capacity_indicator', v_workload.capacity_indicator,
      'delegation_suggestion', v_workload.delegation_suggestion
    ) end,
    'timeline', v_timeline,
    'usage_example', 'Your highest priority today is an approval delaying multiple departments.',
    'privacy_note', 'Aipify recommends priorities with transparent reasoning. Users remain responsible for decisions.',
    'principle', 'Focus on what matters. Reduce decision fatigue. Support human judgment.'
  );
end; $$;

create or replace function public.get_companion_work_prioritization_focus()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_limit int; v_focus jsonb; v_mode jsonb;
begin
  v_ctx := public._cwp327_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public.recalculate_companion_work_prioritization(false);
  v_limit := public._cwp327_focus_limit(v_org_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'priority_level', r.priority_level,
    'reason', r.reason, 'recommended_action', r.recommended_action,
    'rank_order', r.rank_order, 'estimated_effort', case r.priority_level
      when 'critical' then 'high' when 'high' then 'medium' else 'low' end
  ) order by r.rank_order),'[]'::jsonb) into v_focus
  from (
    select * from public.companion_work_priority_records r
    where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
    order by r.rank_order limit v_limit
  ) r;

  select jsonb_build_object(
    'top_priority', (select r.title from public.companion_work_priority_records r
      where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
      order by r.rank_order limit 1),
    'next_priority', (select r.title from public.companion_work_priority_records r
      where r.organization_id = v_org_id and r.user_id = v_user_id and r.priority_date = current_date
      order by r.rank_order offset 1 limit 1),
    'suggested_sequence', v_focus,
    'focus_limit', v_limit
  ) into v_mode;

  return jsonb_build_object('found', true, 'focus_items', v_focus, 'focus_mode', v_mode);
end; $$;

create or replace function public.get_companion_work_prioritization_workload()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_w record;
begin
  v_ctx := public._cwp327_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public.recalculate_companion_work_prioritization(false);

  select * into v_w from public.companion_work_priority_workload w
  where w.organization_id = v_org_id and w.user_id = v_user_id and w.workload_date = current_date;

  if not found then
    return jsonb_build_object('found', false);
  end if;

  return jsonb_build_object(
    'found', true,
    'current_workload', v_w.current_workload,
    'upcoming_workload', v_w.upcoming_workload,
    'overload_risk', v_w.overload_risk,
    'capacity_indicator', v_w.capacity_indicator,
    'delegation_suggestion', v_w.delegation_suggestion,
    'usage_example', 'You have more work than available capacity this week.'
  );
end; $$;

create or replace function public.get_companion_work_prioritization_dependencies()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_deps jsonb;
begin
  v_ctx := public._cwp327_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public.recalculate_companion_work_prioritization(false);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', d.id, 'dependency_type', d.dependency_type, 'title', d.title,
    'description', d.description, 'priority_id', d.priority_id, 'related_key', d.related_key
  )),'[]'::jsonb) into v_deps
  from public.companion_work_priority_dependencies d
  where d.organization_id = v_org_id and d.user_id = v_user_id;

  return jsonb_build_object('found', true, 'dependencies', v_deps);
end; $$;

grant execute on function public.recalculate_companion_work_prioritization(boolean) to authenticated;
grant execute on function public.get_companion_work_prioritization_dashboard(text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_work_prioritization_focus() to authenticated;
grant execute on function public.get_companion_work_prioritization_workload() to authenticated;
grant execute on function public.get_companion_work_prioritization_dependencies() to authenticated;
