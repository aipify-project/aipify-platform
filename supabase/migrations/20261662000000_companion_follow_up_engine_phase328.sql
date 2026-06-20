-- Phase 328 — Companion Follow-Up Engine
-- Transparent follow-through on commitments — users decide, Aipify assists.

create table if not exists public.companion_follow_up_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_followups_enabled boolean not null default false,
  admin_org_followups_enabled    boolean not null default true,
  reminders_enabled              boolean not null default true,
  preferences                    jsonb not null default '{}'::jsonb,
  updated_at                     timestamptz not null default now(),
  updated_by                     uuid references public.users (id) on delete set null
);

create table if not exists public.companion_follow_up_records (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references public.organizations (id) on delete cascade,
  user_id             uuid not null references public.users (id) on delete cascade,
  follow_up_key       text not null default '',
  title               text not null default '',
  description         text not null check (char_length(description) <= 500),
  explanation         text not null default '',
  category            text not null default 'personal_tasks' check (category in (
    'personal_tasks','team_commitments','customer_follow_ups','partner_follow_ups',
    'executive_reviews','training_activities','meeting_actions','opportunity_reviews',
    'support_escalations','approval_requests'
  )),
  source_type         text not null default 'tasks' check (source_type in (
    'tasks','meetings','calendar_events','email_activity','notes','companion_recommendations',
    'opportunities','projects','support_cases','business_packs'
  )),
  priority            text not null default 'medium' check (priority in (
    'critical','high','medium','low'
  )),
  status              text not null default 'open' check (status in (
    'open','pending','waiting','overdue','completed','archived'
  )),
  assigned_to         text not null default '',
  owner_label         text not null default '',
  due_date            date,
  recommended_action  text not null default 'review_today',
  waiting_direction   text check (waiting_direction in ('waiting_on_others','waiting_for_me')),
  waiting_subtype     text not null default '',
  department          text not null default '',
  detection_type      text not null default '',
  metadata            jsonb not null default '{}'::jsonb,
  completed_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (organization_id, user_id, follow_up_key)
);

create index if not exists companion_follow_up_records_org_idx
  on public.companion_follow_up_records (organization_id, user_id, status, due_date);

create table if not exists public.companion_follow_up_reminders (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follow_up_id    uuid not null references public.companion_follow_up_records (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  reminder_type   text not null default 'today' check (reminder_type in (
    'today','tomorrow','this_week','custom_date','recurring'
  )),
  reminder_date   date,
  status          text not null default 'scheduled' check (status in (
    'scheduled','sent','dismissed','cancelled'
  )),
  created_at      timestamptz not null default now()
);

create index if not exists companion_follow_up_reminders_follow_idx
  on public.companion_follow_up_reminders (follow_up_id, reminder_date);

create table if not exists public.companion_follow_up_dependencies (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follow_up_id    uuid not null references public.companion_follow_up_records (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  dependency_type text not null,
  title           text not null default '',
  description     text not null default '',
  created_at      timestamptz not null default now()
);

create table if not exists public.companion_follow_up_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follow_up_id    uuid references public.companion_follow_up_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_follow_up_timeline_org_idx
  on public.companion_follow_up_timeline (organization_id, created_at desc);

create table if not exists public.companion_follow_up_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  follow_up_id    uuid references public.companion_follow_up_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_follow_up_settings     enable row level security;
alter table public.companion_follow_up_records      enable row level security;
alter table public.companion_follow_up_reminders    enable row level security;
alter table public.companion_follow_up_dependencies enable row level security;
alter table public.companion_follow_up_timeline     enable row level security;
alter table public.companion_follow_up_audit_logs   enable row level security;
revoke all on public.companion_follow_up_settings     from authenticated, anon;
revoke all on public.companion_follow_up_records      from authenticated, anon;
revoke all on public.companion_follow_up_reminders    from authenticated, anon;
revoke all on public.companion_follow_up_dependencies from authenticated, anon;
revoke all on public.companion_follow_up_timeline     from authenticated, anon;
revoke all on public.companion_follow_up_audit_logs   from authenticated, anon;

create or replace function public._cfu328_access()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_followups_enabled, false), coalesce(s.admin_org_followups_enabled, true)
  into v_mgr, v_adm from public.companion_follow_up_settings s where s.organization_id = v_org_id;
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

create or replace function public._cfu328_log(
  p_org_id uuid, p_user_id uuid, p_follow_up_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_follow_up_audit_logs
    (organization_id, follow_up_id, user_id, event_type, description, metadata)
  values (p_org_id, p_follow_up_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cfu328_timeline(
  p_org_id uuid, p_follow_up_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_follow_up_timeline
    (organization_id, follow_up_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_follow_up_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cfu328_seed_follow_ups(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_fid uuid;
begin
  if exists(select 1 from public.companion_follow_up_records where organization_id = p_org_id and user_id = p_user_id limit 1) then
    update public.companion_follow_up_records set status = 'overdue'
    where organization_id = p_org_id and user_id = p_user_id
      and due_date < current_date and status in ('open','pending','waiting');
    return;
  end if;

  insert into public.companion_follow_up_records (
    organization_id, user_id, follow_up_key, title, description, explanation, category, source_type,
    priority, status, assigned_to, owner_label, due_date, recommended_action,
    waiting_direction, waiting_subtype, department, detection_type
  ) values
    (p_org_id, p_user_id, 'fu_customer_no_response', 'Customer follow-up required',
     'Enterprise customer awaiting response on proposal review.',
     'You mentioned following up with this customer but no activity has been recorded.',
     'customer_follow_ups', 'email_activity', 'high', 'overdue', 'You', 'You', current_date - 5,
     'complete_immediately', 'waiting_for_me', 'customer_response', 'Customer Success', 'customer_follow_up'),
    (p_org_id, p_user_id, 'fu_approval_unresolved', 'Approval still awaiting action',
     'Budget approval request remains unresolved.',
     'This approval request is still awaiting action.',
     'approval_requests', 'tasks', 'critical', 'overdue', 'Finance Lead', 'You', current_date - 7,
     'review_today', 'waiting_on_others', 'pending_approval', 'Finance', 'pending_approval'),
    (p_org_id, p_user_id, 'fu_meeting_actions', 'Meeting action items open',
     'Three action items from last week planning meeting remain open.',
     'Three meeting action items remain open.',
     'meeting_actions', 'meetings', 'high', 'open', 'You', 'You', current_date + 2,
     'review_today', null, '', 'Operations', 'meeting_action_item'),
    (p_org_id, p_user_id, 'fu_proposal_review', 'Proposal review commitment',
     'Review partner proposal from strategy session.',
     'You committed to reviewing this proposal during last week''s meeting.',
     'partner_follow_ups', 'notes', 'medium', 'pending', 'You', 'You', current_date + 3,
     'schedule_this_week', 'waiting_for_me', 'assigned_request', 'Partnerships', 'uncompleted_commitment'),
    (p_org_id, p_user_id, 'fu_support_escalation', 'Support escalation follow-up',
     'Escalated support case needs status update.',
     'This customer has not received a response in five days.',
     'support_escalations', 'support_cases', 'high', 'waiting', 'Support Team', 'You', current_date + 1,
     'review_today', 'waiting_on_others', 'team_dependency', 'Support', 'unanswered_request'),
    (p_org_id, p_user_id, 'fu_exec_review', 'Executive review preparation',
     'Prepare materials for leadership review.',
     'Leadership requested follow-up materials before next review.',
     'executive_reviews', 'calendar_events', 'medium', 'open', 'You', 'You', current_date + 5,
     'schedule_this_week', 'waiting_for_me', 'leadership_request', 'Executive', 'missed_review'),
    (p_org_id, p_user_id, 'fu_opportunity', 'Opportunity review pending',
     'Sales opportunity requires next-step confirmation.',
     'Opportunity pipeline item needs follow-up to maintain momentum.',
     'opportunity_reviews', 'opportunities', 'medium', 'open', 'Sales', 'You', current_date + 4,
     'monitor', 'waiting_on_others', 'external_dependency', 'Sales', 'customer_follow_up'),
    (p_org_id, p_user_id, 'fu_team_commitment', 'Team commitment check-in',
     'Weekly team deliverable status check.',
     'Team committed to delivering status update by end of week.',
     'team_commitments', 'projects', 'low', 'completed', 'Team Lead', 'You', current_date - 2,
     'archive', null, '', 'People', 'uncompleted_commitment');

  update public.companion_follow_up_records set completed_at = now()
  where organization_id = p_org_id and user_id = p_user_id and status = 'completed';

  select id into v_fid from public.companion_follow_up_records
  where organization_id = p_org_id and user_id = p_user_id and follow_up_key = 'fu_approval_unresolved';

  insert into public.companion_follow_up_dependencies
    (organization_id, follow_up_id, user_id, dependency_type, title, description)
  values
    (p_org_id, v_fid, p_user_id, 'pending_approval', 'Finance sign-off', 'Budget approval blocking procurement');

  insert into public.companion_follow_up_reminders
    (organization_id, follow_up_id, user_id, reminder_type, reminder_date, status)
  select p_org_id, f.id, p_user_id, 'today', current_date, 'scheduled'
  from public.companion_follow_up_records f
  where f.organization_id = p_org_id and f.user_id = p_user_id and f.status in ('open','overdue','pending');

  perform public._cfu328_timeline(p_org_id, null, p_user_id, 'follow_up_created', 'Follow-up records initialized');
end; $$;

create or replace function public._cfu328_item_json(r public.companion_follow_up_records)
returns jsonb language sql stable as $$
  select jsonb_build_object(
    'id', r.id, 'title', r.title, 'description', r.description, 'explanation', r.explanation,
    'category', r.category, 'source_type', r.source_type, 'priority', r.priority, 'status', r.status,
    'assigned_to', r.assigned_to, 'owner_label', r.owner_label, 'due_date', r.due_date,
    'recommended_action', r.recommended_action, 'waiting_direction', r.waiting_direction,
    'waiting_subtype', r.waiting_subtype, 'department', r.department, 'detection_type', r.detection_type,
    'created_at', r.created_at, 'updated_at', r.updated_at, 'completed_at', r.completed_at
  );
$$;

create or replace function public.get_companion_follow_up_dashboard(
  p_status text default null, p_priority text default null, p_owner text default null,
  p_department text default null, p_category text default null, p_due_from date default null,
  p_due_to date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_role text;
  v_items jsonb; v_timeline jsonb; v_open int; v_overdue int; v_upcoming int; v_completed int; v_total int;
  v_health int; v_success numeric;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_role := coalesce(v_ctx->>'role', 'member');

  select count(*) filter (where status in ('open','pending','waiting')),
         count(*) filter (where status = 'overdue'),
         count(*) filter (where status in ('open','pending') and due_date >= current_date and due_date <= current_date + 7),
         count(*) filter (where status = 'completed'),
         count(*)
  into v_open, v_overdue, v_upcoming, v_completed, v_total
  from public.companion_follow_up_records
  where organization_id = v_org_id and user_id = v_user_id and status != 'archived';

  v_success := case when v_total = 0 then 0 else round((v_completed::numeric / v_total) * 100, 1) end;
  v_health := greatest(0, least(100, 100 - (v_overdue * 12) - (v_open / 2)::int));

  select coalesce(jsonb_agg(public._cfu328_item_json(r) order by
    case r.status when 'overdue' then 1 when 'open' then 2 when 'waiting' then 3 when 'pending' then 4 else 5 end,
    case r.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 else 4 end),'[]'::jsonb)
  into v_items
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.status != 'archived'
    and (p_status is null or r.status = p_status)
    and (p_priority is null or r.priority = p_priority)
    and (p_owner is null or r.assigned_to ilike '%'||trim(p_owner)||'%' or r.owner_label ilike '%'||trim(p_owner)||'%')
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_category is null or r.category = p_category)
    and (p_due_from is null or r.due_date >= p_due_from)
    and (p_due_to is null or r.due_date <= p_due_to)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%' or r.description ilike '%'||trim(p_search)||'%'
         or r.explanation ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (select * from public.companion_follow_up_timeline t
    where t.organization_id = v_org_id and (t.user_id = v_user_id or t.user_id is null)
    order by t.created_at desc limit 12) t;

  return jsonb_build_object(
    'found', true,
    'has_follow_ups', v_total > 0,
    'role', v_role,
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_executive', coalesce(v_ctx->>'can_executive','false') = 'true',
    'follow_up_health_score', v_health,
    'open_count', v_open,
    'overdue_count', v_overdue,
    'upcoming_count', v_upcoming,
    'completed_count', v_completed,
    'success_rate', v_success,
    'items', v_items,
    'timeline', v_timeline,
    'usage_example', 'You mentioned following up with this customer but no activity has been recorded.',
    'privacy_note', 'Aipify assists with follow-up recommendations. Users remain responsible for decisions and communication.',
    'principle', 'Help users keep commitments. Improve accountability. Support trust and reliability.'
  );
end; $$;

create or replace function public.list_companion_follow_ups_open()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cfu328_seed_follow_ups(v_org_id, v_user_id);
  select coalesce(jsonb_agg(public._cfu328_item_json(r) order by r.due_date nulls last),'[]'::jsonb) into v_items
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id
    and r.status in ('open','pending','waiting');
  return jsonb_build_object('found', true, 'items', v_items);
end; $$;

create or replace function public.list_companion_follow_ups_overdue()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cfu328_seed_follow_ups(v_org_id, v_user_id);
  select coalesce(jsonb_agg(public._cfu328_item_json(r) order by r.due_date),'[]'::jsonb) into v_items
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id and r.status = 'overdue';
  return jsonb_build_object('found', true, 'items', v_items);
end; $$;

create or replace function public.list_companion_follow_ups_waiting(p_direction text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_waiting jsonb; v_for_me jsonb;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cfu328_seed_follow_ups(v_org_id, v_user_id);

  select coalesce(jsonb_agg(public._cfu328_item_json(r)),'[]'::jsonb) into v_waiting
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id
    and r.waiting_direction = 'waiting_on_others' and r.status not in ('completed','archived');

  select coalesce(jsonb_agg(public._cfu328_item_json(r)),'[]'::jsonb) into v_for_me
  from public.companion_follow_up_records r
  where r.organization_id = v_org_id and r.user_id = v_user_id
    and r.waiting_direction = 'waiting_for_me' and r.status not in ('completed','archived');

  if p_direction = 'waiting_on_others' then
    return jsonb_build_object('found', true, 'direction', p_direction, 'items', v_waiting);
  elsif p_direction = 'waiting_for_me' then
    return jsonb_build_object('found', true, 'direction', p_direction, 'items', v_for_me);
  end if;

  return jsonb_build_object(
    'found', true,
    'waiting_on_others', v_waiting,
    'waiting_for_me', v_for_me
  );
end; $$;

create or replace function public.create_companion_follow_up(
  p_title text, p_description text default '', p_explanation text default '',
  p_category text default 'personal_tasks', p_source_type text default 'tasks',
  p_priority text default 'medium', p_assigned_to text default '', p_due_date date default null,
  p_recommended_action text default 'review_today', p_department text default ''
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_id uuid; v_key text;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_key := 'fu_custom_'||gen_random_uuid()::text;

  insert into public.companion_follow_up_records (
    organization_id, user_id, follow_up_key, title, description, explanation, category, source_type,
    priority, status, assigned_to, owner_label, due_date, recommended_action, department
  ) values (
    v_org_id, v_user_id, v_key, left(coalesce(p_title,''), 200), left(coalesce(p_description,''), 500),
    left(coalesce(p_explanation,''), 500), coalesce(p_category,'personal_tasks'),
    coalesce(p_source_type,'tasks'), coalesce(p_priority,'medium'), 'open',
    coalesce(p_assigned_to,'You'), 'You', p_due_date, coalesce(p_recommended_action,'review_today'),
    coalesce(p_department,'')
  ) returning id into v_id;

  perform public._cfu328_timeline(v_org_id, v_id, v_user_id, 'follow_up_created', 'Follow-up created');
  perform public._cfu328_log(v_org_id, v_user_id, v_id, 'follow_up_created', 'Follow-up created');

  return jsonb_build_object('ok', true, 'follow_up_id', v_id);
end; $$;

create or replace function public.update_companion_follow_up(
  p_follow_up_id uuid, p_status text default null, p_priority text default null,
  p_assigned_to text default null, p_due_date date default null,
  p_recommended_action text default null, p_action text default null,
  p_reminder_type text default null, p_reminder_date date default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_rec record;
begin
  v_ctx := public._cfu328_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select * into v_rec from public.companion_follow_up_records f
  where f.id = p_follow_up_id and f.organization_id = v_org_id and f.user_id = v_user_id;
  if not found then return jsonb_build_object('ok', false, 'error', 'Follow-up not found'); end if;

  update public.companion_follow_up_records set
    status = case
      when coalesce(p_action,'') = 'complete' then 'completed'
      when coalesce(p_action,'') = 'archive' then 'archived'
      when coalesce(p_action,'') = 'postpone' then 'pending'
      else coalesce(p_status, status) end,
    priority = coalesce(p_priority, priority),
    assigned_to = coalesce(p_assigned_to, assigned_to),
    due_date = coalesce(p_due_date, due_date),
    recommended_action = coalesce(p_recommended_action, recommended_action),
    completed_at = case when coalesce(p_action,'') = 'complete' or p_status = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_follow_up_id;

  if p_reminder_type is not null then
    insert into public.companion_follow_up_reminders
      (organization_id, follow_up_id, user_id, reminder_type, reminder_date, status)
    values (
      v_org_id, p_follow_up_id, v_user_id, p_reminder_type,
      coalesce(p_reminder_date, current_date), 'scheduled'
    );
    perform public._cfu328_timeline(v_org_id, p_follow_up_id, v_user_id, 'reminder_generated', 'Reminder scheduled');
  end if;

  perform public._cfu328_timeline(v_org_id, p_follow_up_id, v_user_id,
    case coalesce(p_action, p_status, 'updated')
      when 'complete' then 'follow_up_completed'
      when 'completed' then 'follow_up_completed'
      when 'archive' then 'follow_up_archived'
      when 'assign' then 'follow_up_reassigned'
      when 'postpone' then 'follow_up_postponed'
      else 'follow_up_updated' end,
    'Follow-up updated');
  perform public._cfu328_log(v_org_id, v_user_id, p_follow_up_id, 'follow_up_updated', 'Follow-up updated');

  return jsonb_build_object('ok', true, 'follow_up_id', p_follow_up_id);
end; $$;

grant execute on function public.get_companion_follow_up_dashboard(text,text,text,text,text,date,date,text) to authenticated;
grant execute on function public.list_companion_follow_ups_open() to authenticated;
grant execute on function public.list_companion_follow_ups_overdue() to authenticated;
grant execute on function public.list_companion_follow_ups_waiting(text) to authenticated;
grant execute on function public.create_companion_follow_up(text,text,text,text,text,text,text,date,text,text) to authenticated;
grant execute on function public.update_companion_follow_up(uuid,text,text,text,date,text,text,text,date) to authenticated;
