-- Phase 323 — Companion Recommendation Engine
-- Recommendation-only, explainable, permission-driven — humans decide.

create table if not exists public.companion_recommendation_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_recs_enabled    boolean not null default false,
  admin_org_recs_enabled       boolean not null default true,
  preferences                  jsonb not null default '{}'::jsonb,
  updated_at                   timestamptz not null default now(),
  updated_by                   uuid references public.users (id) on delete set null
);

create table if not exists public.companion_recommendation_records (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  user_id          uuid references public.users (id) on delete set null,
  rec_key          text not null default '',
  title            text not null default '',
  description      text not null check (char_length(description) <= 500),
  reason           text not null default '',
  suggested_action text not null default '',
  category         text not null check (category in (
    'productivity','operations','support','customer_success','team_management',
    'training','security','compliance','business_growth','communication',
    'workflow_optimization','strategic_planning'
  )),
  source_key       text not null default 'companion_activity',
  rec_scope        text not null default 'personal' check (rec_scope in (
    'personal','team','organization'
  )),
  department       text not null default '',
  priority         text not null default 'medium' check (priority in (
    'critical','high','medium','low','informational'
  )),
  confidence       text not null default 'medium' check (confidence in (
    'very_high','high','medium','low','experimental'
  )),
  status           text not null default 'active' check (status in (
    'active','accepted','dismissed','saved','completed','archived'
  )),
  accuracy_score   integer not null default 0 check (accuracy_score between 0 and 100),
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (organization_id, rec_key)
);

create index if not exists companion_recommendation_records_org_idx
  on public.companion_recommendation_records (
    organization_id, status, priority, confidence, category, created_at desc
  );

create table if not exists public.companion_recommendation_feedback (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations (id) on delete cascade,
  recommendation_id  uuid not null references public.companion_recommendation_records (id) on delete cascade,
  user_id            uuid references public.users (id) on delete set null,
  feedback_type      text not null check (feedback_type in (
    'helpful','not_helpful','already_completed','not_relevant'
  )),
  created_at         timestamptz not null default now()
);

create index if not exists companion_recommendation_feedback_rec_idx
  on public.companion_recommendation_feedback (recommendation_id, created_at desc);

create table if not exists public.companion_recommendation_timeline (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations (id) on delete cascade,
  recommendation_id  uuid references public.companion_recommendation_records (id) on delete set null,
  user_id            uuid references public.users (id) on delete set null,
  event_type         text not null,
  description        text not null default '',
  performed_by       uuid references public.users (id) on delete set null,
  created_at         timestamptz not null default now()
);

create index if not exists companion_recommendation_timeline_org_idx
  on public.companion_recommendation_timeline (organization_id, created_at desc);

create table if not exists public.companion_recommendation_audit_logs (
  id                 uuid primary key default gen_random_uuid(),
  organization_id    uuid not null references public.organizations (id) on delete cascade,
  recommendation_id  uuid references public.companion_recommendation_records (id) on delete set null,
  user_id            uuid references public.users (id) on delete set null,
  event_type         text not null,
  description        text not null default '',
  metadata           jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now()
);

create index if not exists companion_recommendation_audit_org_idx
  on public.companion_recommendation_audit_logs (organization_id, created_at desc);

alter table public.companion_recommendation_settings  enable row level security;
alter table public.companion_recommendation_records   enable row level security;
alter table public.companion_recommendation_feedback  enable row level security;
alter table public.companion_recommendation_timeline  enable row level security;
alter table public.companion_recommendation_audit_logs enable row level security;
revoke all on public.companion_recommendation_settings  from authenticated, anon;
revoke all on public.companion_recommendation_records   from authenticated, anon;
revoke all on public.companion_recommendation_feedback  from authenticated, anon;
revoke all on public.companion_recommendation_timeline  from authenticated, anon;
revoke all on public.companion_recommendation_audit_logs from authenticated, anon;

create or replace function public._cre323_access_recommendations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_recs_enabled, false), coalesce(s.admin_org_recs_enabled, true)
  into v_mgr, v_adm from public.companion_recommendation_settings s where s.organization_id = v_org_id;
  if v_role in ('owner', 'executive') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_manage', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', true, 'can_manage', true);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_organization', false, 'can_manage', false);
  else
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', false, 'can_organization', false, 'can_manage', false);
  end if;
end; $$;

create or replace function public._cre323_can_read_scope(p_scope text, p_owner_id uuid, p_ctx jsonb)
returns boolean language sql immutable as $$
  select case p_scope
    when 'personal' then p_owner_id is null or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'team' then coalesce(p_ctx->>'can_team','false') = 'true' or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'organization' then coalesce(p_ctx->>'can_organization','false') = 'true'
    else p_owner_id = (p_ctx->>'user_id')::uuid
  end;
$$;

create or replace function public._cre323_log(
  p_org_id uuid, p_user_id uuid, p_rec_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_recommendation_audit_logs
    (organization_id, recommendation_id, user_id, event_type, description, metadata)
  values (p_org_id, p_rec_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cre323_timeline(
  p_org_id uuid, p_rec_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_recommendation_timeline
    (organization_id, recommendation_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_rec_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cre323_accuracy_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(accuracy_score))::integer, 0)
  from public.companion_recommendation_records
  where organization_id = p_org_id and status in ('accepted','completed');
$$;

create or replace function public._cre323_health_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(least(100, greatest(0,
    (select count(*) filter (where status = 'active' and confidence in ('very_high','high'))
     from public.companion_recommendation_records where organization_id = p_org_id) * 8 +
    public._cre323_accuracy_score(p_org_id) / 2
  ))::integer, 0);
$$;

create or replace function public._cre323_sync_recommendations(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_recommendation_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.companion_recommendation_records (
    organization_id, user_id, rec_key, title, description, reason, suggested_action,
    category, source_key, rec_scope, department, priority, confidence, status, accuracy_score
  ) values
    (p_org_id, p_user_id, 'rec_followups_'||p_user_id,
     'Review overdue follow-ups',
     'You have several overdue follow-ups that may benefit from a consolidated review.',
     'Multiple follow-up items remain open beyond their expected completion window.',
     'Would you like Aipify to prepare a review task for your approval?',
     'productivity', 'tasks', 'personal', 'Operations', 'high', 'high', 'active', 72),
    (p_org_id, p_user_id, 'rec_readiness_'||p_org_id,
     'Readiness review before expansion',
     'Your organization may benefit from a readiness review before expansion.',
     'Organizational growth signals suggest validating capacity and operational readiness.',
     'Schedule a readiness review with leadership when convenient.',
     'strategic_planning', 'organizational_activity', 'organization', 'Executive', 'high', 'medium', 'active', 68),
    (p_org_id, p_user_id, 'rec_support_demand_'||p_org_id,
     'Support demand increase',
     'Support demand has increased this month.',
     'Support request volume has increased by approximately 18% compared to the prior period.',
     'Review support capacity and escalation patterns with your team.',
     'support', 'notifications', 'organization', 'Support', 'medium', 'high', 'active', 75),
    (p_org_id, p_user_id, 'rec_training_'||p_org_id,
     'Training demand pattern',
     'Several employees have requested training in the same area.',
     'Multiple training requests reference similar topics within the last thirty days.',
     'Consider a team training session or knowledge base update.',
     'training', 'companion_activity', 'team', 'People', 'medium', 'medium', 'active', 65),
    (p_org_id, p_user_id, 'rec_support_topic_'||p_user_id,
     'Recurring support topic',
     'Multiple support requests relate to the same issue.',
     'You have received multiple support requests about the same issue during the last seven days.',
     'Would you like a summary prepared for review?',
     'support', 'context_engine', 'personal', 'Support', 'high', 'very_high', 'active', 80),
    (p_org_id, p_user_id, 'rec_deadlines_'||p_user_id,
     'Approaching task deadlines',
     'Three tasks are approaching their deadline.',
     'Open tasks in your authorized scope are due within the next few days.',
     'Review priorities and confirm which items need attention first.',
     'operations', 'calendar', 'personal', 'Operations', 'critical', 'high', 'active', 78),
    (p_org_id, p_user_id, 'rec_workflow_review_'||p_org_id,
     'Workflow review overdue',
     'A key workflow has not been reviewed recently.',
     'Your team has not reviewed this workflow for six months.',
     'Schedule a workflow review when appropriate.',
     'workflow_optimization', 'memory_engine', 'organization', 'Operations', 'low', 'low', 'active', 55)
  on conflict (organization_id, rec_key) do nothing;

  if not exists (
    select 1 from public.companion_recommendation_timeline t
    where t.organization_id = p_org_id and t.event_type = 'workspace_initialized') then
    insert into public.companion_recommendation_timeline
      (organization_id, user_id, event_type, description, performed_by)
    values (p_org_id, p_user_id, 'workspace_initialized',
            'Companion recommendation workspace initialized', p_user_id);
  end if;
end; $$;

create or replace function public.get_companion_recommendations_dashboard(
  p_category text default null, p_priority text default null, p_confidence text default null,
  p_department text default null, p_status text default null, p_date_from date default null,
  p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_recs jsonb; v_timeline jsonb;
  v_active int; v_high int; v_accepted int; v_dismissed int;
begin
  v_ctx := public._cre323_access_recommendations();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cre323_sync_recommendations(v_org_id, v_user_id);

  select count(*) filter (where status = 'active'),
         count(*) filter (where status = 'active' and priority in ('critical','high')),
         count(*) filter (where status = 'accepted'),
         count(*) filter (where status = 'dismissed')
  into v_active, v_high, v_accepted, v_dismissed
  from public.companion_recommendation_records r
  where r.organization_id = v_org_id
    and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'description', r.description, 'reason', r.reason,
    'suggested_action', r.suggested_action, 'category', r.category, 'source_key', r.source_key,
    'rec_scope', r.rec_scope, 'department', r.department, 'priority', r.priority,
    'confidence', r.confidence, 'status', r.status, 'accuracy_score', r.accuracy_score,
    'created_at', r.created_at
  ) order by case r.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5 end, r.created_at desc),'[]'::jsonb)
  into v_recs
  from public.companion_recommendation_records r
  where r.organization_id = v_org_id
    and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx)
    and (p_category is null or r.category = p_category)
    and (p_priority is null or r.priority = p_priority)
    and (p_confidence is null or r.confidence = p_confidence)
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_status is null or r.status = p_status)
    and (p_date_from is null or r.created_at::date >= p_date_from)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%'
         or r.description ilike '%'||trim(p_search)||'%'
         or r.reason ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description,
    'recommendation_id', t.recommendation_id, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_recommendation_timeline t
    where t.organization_id = v_org_id
      and (coalesce(v_ctx->>'can_organization','false') = 'true' or t.user_id = v_user_id)
    order by t.created_at desc limit 12
  ) t;

  return jsonb_build_object(
    'found', true,
    'can_personal', coalesce(v_ctx->>'can_personal','false') = 'true',
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'has_recommendations', v_active > 0 or v_accepted > 0,
    'recommendation_health_score', public._cre323_health_score(v_org_id),
    'active_recommendations_count', v_active,
    'high_priority_count', v_high,
    'accepted_count', v_accepted,
    'dismissed_count', v_dismissed,
    'accuracy_score', public._cre323_accuracy_score(v_org_id),
    'recommendations', v_recs,
    'timeline', v_timeline,
    'usage_examples', jsonb_build_array(
      'You have several overdue follow-ups. Would you like Aipify to prepare a review task?',
      'Your organization may benefit from a readiness review before expansion.',
      'Support demand has increased this month.',
      'Several employees have requested training in the same area.'
    ),
    'privacy_note', 'Recommendations are suggestions only. Final decisions always remain with users and leadership.',
    'principle', 'Explain every recommendation. Humans remain in control. Transparency before automation.'
  );
end; $$;

create or replace function public.get_companion_recommendation(p_rec_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_row record;
begin
  v_ctx := public._cre323_access_recommendations();
  select * into v_row from public.companion_recommendation_records r
  where r.id = p_rec_id and r.organization_id = (v_ctx->>'organization_id')::uuid
    and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx);
  if not found then
    return jsonb_build_object('found', false, 'error', 'Recommendation not found or access denied');
  end if;
  return jsonb_build_object('found', true, 'recommendation', jsonb_build_object(
    'id', v_row.id, 'title', v_row.title, 'description', v_row.description,
    'reason', v_row.reason, 'suggested_action', v_row.suggested_action,
    'category', v_row.category, 'source_key', v_row.source_key, 'rec_scope', v_row.rec_scope,
    'department', v_row.department, 'priority', v_row.priority, 'confidence', v_row.confidence,
    'status', v_row.status, 'accuracy_score', v_row.accuracy_score,
    'created_at', v_row.created_at, 'updated_at', v_row.updated_at
  ));
end; $$;

create or replace function public.list_companion_priority_recommendations(
  p_limit integer default 10
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_recs jsonb;
begin
  v_ctx := public._cre323_access_recommendations();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cre323_sync_recommendations(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'description', r.description, 'reason', r.reason,
    'priority', r.priority, 'confidence', r.confidence, 'status', r.status, 'created_at', r.created_at
  ) order by case r.priority when 'critical' then 1 when 'high' then 2 else 3 end),'[]'::jsonb)
  into v_recs
  from (
    select * from public.companion_recommendation_records r
    where r.organization_id = v_org_id and r.status = 'active'
      and r.priority in ('critical','high')
      and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx)
    order by case r.priority when 'critical' then 1 when 'high' then 2 end, r.created_at desc
    limit greatest(1, least(coalesce(p_limit, 10), 50))
  ) r;

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end; $$;

create or replace function public.accept_companion_recommendation(p_rec_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_found boolean;
begin
  v_ctx := public._cre323_access_recommendations();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  update public.companion_recommendation_records r set status = 'accepted', updated_at = now()
  where r.id = p_rec_id and r.organization_id = v_org_id
    and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx)
  returning true into v_found;

  if not coalesce(v_found, false) then
    return jsonb_build_object('ok', false, 'error', 'Recommendation not found or access denied');
  end if;

  perform public._cre323_timeline(v_org_id, p_rec_id, v_user_id, 'recommendation_accepted', 'Recommendation accepted');
  perform public._cre323_log(v_org_id, v_user_id, p_rec_id, 'recommendation_accepted', 'Recommendation accepted');

  return jsonb_build_object('ok', true, 'recommendation_id', p_rec_id, 'status', 'accepted');
end; $$;

create or replace function public.dismiss_companion_recommendation(p_rec_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_found boolean;
begin
  v_ctx := public._cre323_access_recommendations();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  update public.companion_recommendation_records r set status = 'dismissed', updated_at = now()
  where r.id = p_rec_id and r.organization_id = v_org_id
    and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx)
  returning true into v_found;

  if not coalesce(v_found, false) then
    return jsonb_build_object('ok', false, 'error', 'Recommendation not found or access denied');
  end if;

  perform public._cre323_timeline(v_org_id, p_rec_id, v_user_id, 'recommendation_dismissed', 'Recommendation dismissed');
  perform public._cre323_log(v_org_id, v_user_id, p_rec_id, 'recommendation_dismissed', 'Recommendation dismissed');

  return jsonb_build_object('ok', true, 'recommendation_id', p_rec_id, 'status', 'dismissed');
end; $$;

create or replace function public.feedback_companion_recommendation(
  p_rec_id uuid, p_feedback_type text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_found boolean; v_score int;
begin
  v_ctx := public._cre323_access_recommendations();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select exists(
    select 1 from public.companion_recommendation_records r
    where r.id = p_rec_id and r.organization_id = v_org_id
      and public._cre323_can_read_scope(r.rec_scope, r.user_id, v_ctx)
  ) into v_found;

  if not v_found then
    return jsonb_build_object('ok', false, 'error', 'Recommendation not found or access denied');
  end if;

  insert into public.companion_recommendation_feedback
    (organization_id, recommendation_id, user_id, feedback_type)
  values (v_org_id, p_rec_id, v_user_id, p_feedback_type);

  v_score := case p_feedback_type
    when 'helpful' then 85 when 'already_completed' then 70
    when 'not_relevant' then 40 when 'not_helpful' then 25 else 50 end;

  update public.companion_recommendation_records
  set accuracy_score = v_score, updated_at = now()
  where id = p_rec_id;

  perform public._cre323_timeline(v_org_id, p_rec_id, v_user_id, 'feedback_received', 'User feedback recorded');
  perform public._cre323_log(v_org_id, v_user_id, p_rec_id, 'feedback_received', 'User feedback recorded',
    jsonb_build_object('feedback_type', p_feedback_type));

  return jsonb_build_object('ok', true, 'recommendation_id', p_rec_id, 'feedback_type', p_feedback_type);
end; $$;

grant execute on function public.get_companion_recommendations_dashboard(text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_recommendation(uuid) to authenticated;
grant execute on function public.list_companion_priority_recommendations(integer) to authenticated;
grant execute on function public.accept_companion_recommendation(uuid) to authenticated;
grant execute on function public.dismiss_companion_recommendation(uuid) to authenticated;
grant execute on function public.feedback_companion_recommendation(uuid,text) to authenticated;
