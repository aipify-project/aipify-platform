-- Phase 326 — Companion Daily Briefing Center
-- Primary daily Companion experience — signal over noise, role-aware, personalized.

create table if not exists public.companion_daily_briefing_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_briefing_enabled boolean not null default false,
  admin_org_briefing_enabled    boolean not null default true,
  preferences                   jsonb not null default '{}'::jsonb,
  updated_at                    timestamptz not null default now(),
  updated_by                    uuid references public.users (id) on delete set null
);

create table if not exists public.companion_daily_briefing_records (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  user_id          uuid not null references public.users (id) on delete cascade,
  briefing_key     text not null default '',
  briefing_date    date not null default current_date,
  briefing_mode    text not null default 'standard' check (briefing_mode in (
    'ultra_short','summary','standard','detailed','executive'
  )),
  readiness_score  integer not null default 0 check (readiness_score between 0 and 100),
  todays_focus     text not null default 'operations',
  executive_summary text not null default '',
  greeting         text not null default '',
  since_last_login jsonb not null default '{}'::jsonb,
  status           text not null default 'active' check (status in (
    'active','viewed','completed','archived'
  )),
  generated_at     timestamptz not null default now(),
  viewed_at        timestamptz,
  metadata         jsonb not null default '{}'::jsonb,
  unique (organization_id, user_id, briefing_date)
);

create index if not exists companion_daily_briefing_records_org_idx
  on public.companion_daily_briefing_records (organization_id, user_id, briefing_date desc);

create table if not exists public.companion_daily_briefing_items (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  briefing_id      uuid not null references public.companion_daily_briefing_records (id) on delete cascade,
  user_id          uuid references public.users (id) on delete set null,
  item_key         text not null default '',
  section          text not null check (section in (
    'since_last_login','priorities','calendar','insights_recommendations','focus_card'
  )),
  title            text not null default '',
  description      text not null check (char_length(description) <= 500),
  priority         text not null default 'medium' check (priority in (
    'critical','high','medium','low','informational'
  )),
  status_indicator text not null default 'upcoming' check (status_indicator in (
    'critical','attention_required','upcoming','on_track','completed'
  )),
  recommended_action text not null default '',
  owner_label      text not null default '',
  due_date         date,
  category         text not null default '',
  department       text not null default '',
  source_key       text not null default 'companion',
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  unique (briefing_id, item_key)
);

create index if not exists companion_daily_briefing_items_briefing_idx
  on public.companion_daily_briefing_items (briefing_id, section, priority);

create table if not exists public.companion_daily_briefing_focus (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  focus_key       text not null,
  focus_label     text not null default '',
  focus_score     integer not null default 0 check (focus_score between 0 and 100),
  briefing_date   date not null default current_date,
  unique (organization_id, user_id, briefing_date, focus_key)
);

create table if not exists public.companion_daily_briefing_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  briefing_id     uuid references public.companion_daily_briefing_records (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_daily_briefing_timeline_org_idx
  on public.companion_daily_briefing_timeline (organization_id, created_at desc);

create table if not exists public.companion_daily_briefing_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  briefing_id     uuid references public.companion_daily_briefing_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_daily_briefing_settings enable row level security;
alter table public.companion_daily_briefing_records  enable row level security;
alter table public.companion_daily_briefing_items   enable row level security;
alter table public.companion_daily_briefing_focus    enable row level security;
alter table public.companion_daily_briefing_timeline enable row level security;
alter table public.companion_daily_briefing_audit_logs enable row level security;
revoke all on public.companion_daily_briefing_settings from authenticated, anon;
revoke all on public.companion_daily_briefing_records  from authenticated, anon;
revoke all on public.companion_daily_briefing_items   from authenticated, anon;
revoke all on public.companion_daily_briefing_focus    from authenticated, anon;
revoke all on public.companion_daily_briefing_timeline from authenticated, anon;
revoke all on public.companion_daily_briefing_audit_logs from authenticated, anon;

create or replace function public._cdb326_access_briefing()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_briefing_enabled, false), coalesce(s.admin_org_briefing_enabled, true)
  into v_mgr, v_adm from public.companion_daily_briefing_settings s where s.organization_id = v_org_id;
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

create or replace function public._cdb326_log(
  p_org_id uuid, p_user_id uuid, p_briefing_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_daily_briefing_audit_logs
    (organization_id, briefing_id, user_id, event_type, description, metadata)
  values (p_org_id, p_briefing_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cdb326_timeline(
  p_org_id uuid, p_briefing_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_daily_briefing_timeline
    (organization_id, briefing_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_briefing_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cdb326_briefing_mode(p_org_id uuid, p_user_id uuid)
returns text language sql stable as $$
  select coalesce(
    (select case p.briefing_style
      when 'ultra_short' then 'ultra_short' when 'summary' then 'summary'
      when 'detailed' then 'detailed' when 'executive_report' then 'executive'
      else 'standard' end
     from public.companion_personalization_profiles p
     where p.organization_id = p_org_id and p.user_id = p_user_id),
    'standard'
  );
$$;

create or replace function public.generate_companion_daily_briefing(p_force boolean default false)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text;
  v_briefing_id uuid; v_mode text; v_exists boolean;
begin
  v_ctx := public._cdb326_access_briefing();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');
  v_mode := public._cdb326_briefing_mode(v_org_id, v_user_id);

  insert into public.companion_daily_briefing_settings (organization_id)
  values (v_org_id) on conflict (organization_id) do nothing;

  select exists(
    select 1 from public.companion_daily_briefing_records b
    where b.organization_id = v_org_id and b.user_id = v_user_id and b.briefing_date = current_date
  ) into v_exists;

  if v_exists and not coalesce(p_force, false) then
    select id into v_briefing_id from public.companion_daily_briefing_records
    where organization_id = v_org_id and user_id = v_user_id and briefing_date = current_date;
    return jsonb_build_object('ok', true, 'briefing_id', v_briefing_id, 'generated', false);
  end if;

  insert into public.companion_daily_briefing_records (
    organization_id, user_id, briefing_key, briefing_date, briefing_mode,
    readiness_score, todays_focus, executive_summary, greeting, since_last_login, status
  ) values (
    v_org_id, v_user_id, 'briefing_'||v_user_id||'_'||current_date::text, current_date, v_mode,
    78, 'operations',
    'Three items require attention today. One approval is overdue and a strategic review is scheduled tomorrow.',
    'Good morning. Here is your daily briefing.',
    jsonb_build_object(
      'completed_tasks', 4, 'new_notifications', 6, 'new_support_requests', 3,
      'new_approvals', 2, 'important_activity', 'Support activity increased by 12% this week.'
    ),
    'active'
  )
  on conflict (organization_id, user_id, briefing_date) do update set
    briefing_mode = excluded.briefing_mode,
    readiness_score = excluded.readiness_score,
    executive_summary = excluded.executive_summary,
    greeting = excluded.greeting,
    since_last_login = excluded.since_last_login,
    generated_at = now()
  returning id into v_briefing_id;

  insert into public.companion_daily_briefing_items (
    briefing_id, organization_id, user_id, item_key, section, title, description,
    priority, status_indicator, recommended_action, owner_label, due_date, category, department, source_key
  ) values
    (v_briefing_id, v_org_id, v_user_id, 'sll_approvals', 'since_last_login', 'New approvals',
     'Two items await your review since last login.', 'high', 'attention_required', 'Review approvals', 'You', current_date, 'operations', 'Operations', 'notifications'),
    (v_briefing_id, v_org_id, v_user_id, 'sll_support', 'since_last_login', 'Support requests',
     'Three new support requests were received.', 'medium', 'upcoming', 'Review support queue', 'Support', current_date, 'support', 'Support', 'support_activity'),
    (v_briefing_id, v_org_id, v_user_id, 'pri_overdue', 'priorities', 'Overdue approval',
     'One approval is overdue and requires attention.', 'critical', 'critical', 'Open Approval Center', 'You', current_date - 1, 'operations', 'Operations', 'tasks'),
    (v_briefing_id, v_org_id, v_user_id, 'pri_tasks', 'priorities', 'Tasks due today',
     'Three tasks are due today.', 'high', 'attention_required', 'Review task list', 'You', current_date, 'productivity', 'Operations', 'tasks'),
    (v_briefing_id, v_org_id, v_user_id, 'pri_followup', 'priorities', 'Follow-ups required',
     'Two follow-ups should be completed today.', 'high', 'attention_required', 'Review follow-ups', 'You', current_date, 'operations', 'Operations', 'tasks'),
    (v_briefing_id, v_org_id, v_user_id, 'cal_review', 'calendar', 'Executive review',
     'Strategic planning review scheduled tomorrow.', 'high', 'upcoming', 'Prepare briefing notes', 'You', current_date + 1, 'strategic_planning', 'Executive', 'calendar'),
    (v_briefing_id, v_org_id, v_user_id, 'cal_meeting', 'calendar', 'Team standup',
     'Team standup at 10:00.', 'medium', 'upcoming', 'Join meeting', 'Team', current_date, 'team_management', 'People', 'calendar'),
    (v_briefing_id, v_org_id, v_user_id, 'ins_support', 'insights_recommendations', 'Support trend insight',
     'Support activity increased by 12% this week. Consider reviewing staffing capacity.', 'medium', 'attention_required', 'Review insight', 'Operations', current_date, 'support', 'Support', 'proactive_insights'),
    (v_briefing_id, v_org_id, v_user_id, 'rec_onboarding', 'insights_recommendations', 'Onboarding recommendation',
     'Customer onboarding tasks may benefit from a consolidated review.', 'high', 'upcoming', 'View recommendation', 'Customer Success', current_date, 'customer_success', 'Customer Success', 'recommendations'),
    (v_briefing_id, v_org_id, v_user_id, 'focus_ops', 'focus_card', 'Operations focus',
     'Operations and approvals are the primary focus today.', 'high', 'attention_required', 'Start with overdue approval', 'You', current_date, 'operations', 'Operations', 'companion')
  on conflict (briefing_id, item_key) do nothing;

  insert into public.companion_daily_briefing_focus
    (organization_id, user_id, focus_key, focus_label, focus_score, briefing_date)
  values
    (v_org_id, v_user_id, 'operations', 'Operations', 85, current_date),
    (v_org_id, v_user_id, 'customer_success', 'Customer Success', 70, current_date),
    (v_org_id, v_user_id, 'support', 'Support', 65, current_date)
  on conflict (organization_id, user_id, briefing_date, focus_key) do nothing;

  perform public._cdb326_timeline(v_org_id, v_briefing_id, v_user_id, 'briefing_generated', 'Daily briefing generated');
  perform public._cdb326_log(v_org_id, v_user_id, v_briefing_id, 'briefing_generated', 'Daily briefing generated',
    jsonb_build_object('role', v_role, 'mode', v_mode));

  return jsonb_build_object('ok', true, 'briefing_id', v_briefing_id, 'generated', true);
end; $$;

create or replace function public.get_companion_daily_briefing_dashboard(
  p_priority text default null, p_department text default null, p_category text default null,
  p_status text default null, p_date_from date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text; v_briefing record; v_items jsonb;
  v_focus jsonb; v_timeline jsonb; v_insights int; v_recs int;
begin
  v_ctx := public._cdb326_access_briefing();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');
  perform public.generate_companion_daily_briefing(false);

  select * into v_briefing from public.companion_daily_briefing_records b
  where b.organization_id = v_org_id and b.user_id = v_user_id and b.briefing_date = current_date;

  if not found then
    return jsonb_build_object('found', false, 'has_briefing', false);
  end if;

  update public.companion_daily_briefing_records set status = 'viewed', viewed_at = coalesce(viewed_at, now())
  where id = v_briefing.id and status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'section', i.section, 'title', i.title, 'description', i.description,
    'priority', i.priority, 'status_indicator', i.status_indicator,
    'recommended_action', i.recommended_action, 'owner_label', i.owner_label,
    'due_date', i.due_date, 'category', i.category, 'department', i.department, 'source_key', i.source_key
  ) order by case i.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end),'[]'::jsonb)
  into v_items
  from public.companion_daily_briefing_items i
  where i.briefing_id = v_briefing.id
    and (p_priority is null or i.priority = p_priority)
    and (p_department is null or i.department ilike '%'||trim(p_department)||'%')
    and (p_category is null or i.category = p_category)
    and (p_status is null or i.status_indicator = p_status)
    and (p_search is null or trim(p_search) = ''
         or i.title ilike '%'||trim(p_search)||'%' or i.description ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'focus_key', f.focus_key, 'focus_label', f.focus_label, 'focus_score', f.focus_score
  ) order by f.focus_score desc),'[]'::jsonb) into v_focus
  from public.companion_daily_briefing_focus f
  where f.organization_id = v_org_id and f.user_id = v_user_id and f.briefing_date = current_date;

  select count(*) filter (where section = 'insights_recommendations' and source_key = 'proactive_insights'),
         count(*) filter (where section = 'insights_recommendations' and source_key = 'recommendations')
  into v_insights, v_recs
  from public.companion_daily_briefing_items where briefing_id = v_briefing.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_daily_briefing_timeline t
    where t.organization_id = v_org_id and t.user_id = v_user_id
    order by t.created_at desc limit 10
  ) t;

  return jsonb_build_object(
    'found', true,
    'has_briefing', true,
    'role', v_role,
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive','false') = 'true',
    'readiness_score', v_briefing.readiness_score,
    'briefing_mode', v_briefing.briefing_mode,
    'todays_focus', v_briefing.todays_focus,
    'greeting', v_briefing.greeting,
    'executive_summary', v_briefing.executive_summary,
    'since_last_login', v_briefing.since_last_login,
    'briefing_date', v_briefing.briefing_date,
    'generated_at', v_briefing.generated_at,
    'items', v_items,
    'focus_areas', v_focus,
    'new_insights_count', v_insights,
    'new_recommendations_count', v_recs,
    'timeline', v_timeline,
    'usage_example', 'Good morning. You have: 1 overdue approval, 3 tasks due today, 1 executive review tomorrow, and 2 new proactive insights.',
    'privacy_note', 'Briefings use approved context only. Personalization controls detail level via the Personalization Engine.',
    'principle', 'Start the day with clarity. Surface what matters most. Signal over noise.'
  );
end; $$;

create or replace function public.get_companion_daily_briefing_history(p_limit integer default 14)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_history jsonb;
begin
  v_ctx := public._cdb326_access_briefing();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', b.id, 'briefing_date', b.briefing_date, 'readiness_score', b.readiness_score,
    'briefing_mode', b.briefing_mode, 'status', b.status, 'executive_summary', b.executive_summary,
    'generated_at', b.generated_at, 'viewed_at', b.viewed_at
  ) order by b.briefing_date desc),'[]'::jsonb) into v_history
  from (
    select * from public.companion_daily_briefing_records b
    where b.organization_id = v_org_id and b.user_id = v_user_id
    order by b.briefing_date desc
    limit greatest(1, least(coalesce(p_limit, 14), 90))
  ) b;

  return jsonb_build_object('found', true, 'history', v_history);
end; $$;

create or replace function public.get_companion_daily_briefing_focus()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_briefing record; v_focus jsonb;
begin
  v_ctx := public._cdb326_access_briefing();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public.generate_companion_daily_briefing(false);

  select * into v_briefing from public.companion_daily_briefing_records
  where organization_id = v_org_id and user_id = v_user_id and briefing_date = current_date;

  select coalesce(jsonb_agg(jsonb_build_object(
    'focus_key', f.focus_key, 'focus_label', f.focus_label, 'focus_score', f.focus_score
  ) order by f.focus_score desc),'[]'::jsonb) into v_focus
  from public.companion_daily_briefing_focus f
  where f.organization_id = v_org_id and f.user_id = v_user_id and f.briefing_date = current_date;

  return jsonb_build_object(
    'found', true,
    'todays_focus', coalesce(v_briefing.todays_focus, 'operations'),
    'focus_areas', v_focus
  );
end; $$;

grant execute on function public.generate_companion_daily_briefing(boolean) to authenticated;
grant execute on function public.get_companion_daily_briefing_dashboard(text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_daily_briefing_history(integer) to authenticated;
grant execute on function public.get_companion_daily_briefing_focus() to authenticated;
