-- Phase 324 — Companion Proactive Insights Engine
-- Insight-driven, explainable observations — Aipify surfaces, humans decide.

create table if not exists public.companion_proactive_insight_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_insights_enabled boolean not null default false,
  admin_org_insights_enabled    boolean not null default true,
  preferences                   jsonb not null default '{}'::jsonb,
  updated_at                    timestamptz not null default now(),
  updated_by                    uuid references public.users (id) on delete set null
);

create table if not exists public.companion_proactive_insight_records (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  user_id          uuid references public.users (id) on delete set null,
  insight_key      text not null default '',
  title            text not null default '',
  observation      text not null check (char_length(observation) <= 500),
  why_it_matters   text not null default '',
  why_generated    text not null default '',
  data_sources     text not null default '',
  suggested_review text not null default '',
  category         text not null check (category in (
    'productivity','operations','support','customers','workforce','training',
    'growth','security','compliance','leadership','communication','strategic_planning'
  )),
  source_key       text not null default 'companion_activity',
  insight_scope    text not null default 'personal' check (insight_scope in (
    'personal','team','organization'
  )),
  department       text not null default '',
  priority         text not null default 'medium' check (priority in (
    'critical','high','medium','low','informational'
  )),
  confidence       text not null default 'medium' check (confidence in (
    'very_high','high','medium','low','experimental'
  )),
  impact_level     text not null default 'moderate' check (impact_level in (
    'major','moderate','minor','informational'
  )),
  impact_score     integer not null default 0 check (impact_score between 0 and 100),
  pattern_type     text not null default '',
  status           text not null default 'new' check (status in (
    'new','reviewed','dismissed','escalated','archived'
  )),
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  reviewed_at      timestamptz,
  reviewed_by      uuid references public.users (id) on delete set null,
  unique (organization_id, insight_key)
);

create index if not exists companion_proactive_insight_records_org_idx
  on public.companion_proactive_insight_records (
    organization_id, status, priority, confidence, impact_level, category, created_at desc
  );

create table if not exists public.companion_proactive_insight_feedback (
  id          uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_id  uuid not null references public.companion_proactive_insight_records (id) on delete cascade,
  user_id     uuid references public.users (id) on delete set null,
  feedback_type text not null check (feedback_type in (
    'helpful','not_helpful','interesting','already_known','not_relevant'
  )),
  created_at  timestamptz not null default now()
);

create table if not exists public.companion_proactive_insight_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_id      uuid references public.companion_proactive_insight_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_proactive_insight_timeline_org_idx
  on public.companion_proactive_insight_timeline (organization_id, created_at desc);

create table if not exists public.companion_proactive_insight_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  insight_id      uuid references public.companion_proactive_insight_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_proactive_insight_settings  enable row level security;
alter table public.companion_proactive_insight_records   enable row level security;
alter table public.companion_proactive_insight_feedback  enable row level security;
alter table public.companion_proactive_insight_timeline  enable row level security;
alter table public.companion_proactive_insight_audit_logs enable row level security;
revoke all on public.companion_proactive_insight_settings  from authenticated, anon;
revoke all on public.companion_proactive_insight_records   from authenticated, anon;
revoke all on public.companion_proactive_insight_feedback  from authenticated, anon;
revoke all on public.companion_proactive_insight_timeline  from authenticated, anon;
revoke all on public.companion_proactive_insight_audit_logs from authenticated, anon;

create or replace function public._cpi324_access_insights()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_mgr boolean := false; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.manager_team_insights_enabled, false), coalesce(s.admin_org_insights_enabled, true)
  into v_mgr, v_adm from public.companion_proactive_insight_settings s where s.organization_id = v_org_id;
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

create or replace function public._cpi324_can_read_scope(p_scope text, p_owner_id uuid, p_ctx jsonb)
returns boolean language sql immutable as $$
  select case p_scope
    when 'personal' then p_owner_id is null or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'team' then coalesce(p_ctx->>'can_team','false') = 'true' or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'organization' then coalesce(p_ctx->>'can_organization','false') = 'true'
    else p_owner_id = (p_ctx->>'user_id')::uuid
  end;
$$;

create or replace function public._cpi324_log(
  p_org_id uuid, p_user_id uuid, p_insight_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_proactive_insight_audit_logs
    (organization_id, insight_id, user_id, event_type, description, metadata)
  values (p_org_id, p_insight_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cpi324_timeline(
  p_org_id uuid, p_insight_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_proactive_insight_timeline
    (organization_id, insight_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_insight_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cpi324_impact_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(impact_score))::integer, 0)
  from public.companion_proactive_insight_records
  where organization_id = p_org_id and status in ('new','reviewed','escalated');
$$;

create or replace function public._cpi324_health_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(least(100, greatest(0,
    (select count(*) filter (where status in ('new','reviewed') and confidence in ('very_high','high'))
     from public.companion_proactive_insight_records where organization_id = p_org_id) * 6 +
    public._cpi324_impact_score(p_org_id) / 2
  ))::integer, 0);
$$;

create or replace function public._cpi324_sync_insights(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_proactive_insight_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.companion_proactive_insight_records (
    organization_id, user_id, insight_key, title, observation, why_it_matters, why_generated,
    data_sources, suggested_review, category, source_key, insight_scope, department,
    priority, confidence, impact_level, impact_score, pattern_type, status
  ) values
    (p_org_id, p_user_id, 'ins_onboarding_'||p_org_id,
     'Onboarding support increase',
     'Support requests regarding onboarding have increased during the last two weeks.',
     'Rising onboarding-related volume may indicate friction in the customer journey.',
     'Pattern detected: onboarding-related support volume increased approximately 14% over fourteen days.',
     'Context Engine, Support Activity, Notifications',
     'Review onboarding workflow and recent support themes with your team.',
     'support', 'support_activity', 'organization', 'Support', 'high', 'high', 'major', 82,
     'repeated_issues', 'new'),
    (p_org_id, p_user_id, 'ins_training_postpone_'||p_org_id,
     'Training postponement pattern',
     'Several employees have postponed the same training activity.',
     'Repeated postponements may signal scheduling friction or unclear training priority.',
     'Pattern detected: multiple team members postponed the same training within thirty days.',
     'Memory Engine, Calendar, Workforce signals',
     'Consider rescheduling training or clarifying expectations with affected teams.',
     'workforce', 'organizational_activity', 'team', 'People', 'medium', 'medium', 'moderate', 68,
     'repeated_delays', 'new'),
    (p_org_id, p_user_id, 'ins_response_times_'||p_org_id,
     'Customer response times improving',
     'Customer response times are improving compared to previous periods.',
     'Improved response metrics may reflect effective operational adjustments.',
     'Trend detected: average response time decreased versus the prior measurement period.',
     'Intelligence Layer, Support Activity, Connected Systems',
     'Review what changed and whether improvements can be sustained.',
     'customers', 'intelligence_layer', 'organization', 'Customer Success', 'medium', 'high', 'moderate', 74,
     'performance_trends', 'new'),
    (p_org_id, p_user_id, 'ins_workflow_bottleneck_'||p_org_id,
     'Workflow duration anomaly',
     'A recurring workflow requires significantly more time than expected.',
     'Extended workflow duration may indicate a bottleneck worth reviewing.',
     'Pattern detected: workflow completion time exceeds historical baseline.',
     'Recommendation Engine, Tasks, Organizational Activity',
     'Schedule a process review when appropriate.',
     'operations', 'tasks', 'organization', 'Operations', 'high', 'medium', 'major', 78,
     'workflow_bottlenecks', 'new'),
    (p_org_id, p_user_id, 'ins_growth_partner_'||p_org_id,
     'Growth Partner performance signal',
     'A Growth Partner has demonstrated unusually strong performance this month.',
     'Strong partner performance may represent a growth opportunity worth reviewing.',
     'Trend detected: partner performance metrics exceed typical monthly baseline.',
     'Business Packs, Organizational Activity, Intelligence Layer',
     'Review partner activity and consider whether learnings can be replicated.',
     'growth', 'business_packs', 'organization', 'Growth', 'medium', 'high', 'moderate', 70,
     'performance_trends', 'new'),
    (p_org_id, p_user_id, 'ins_tasks_completed_'||p_user_id,
     'Team productivity increase',
     'Your team completed significantly more tasks this month than average.',
     'Higher completion volume may reflect healthy momentum or shifting priorities.',
     'Pattern detected: task completion count exceeds rolling monthly average.',
     'Tasks, Notifications, Companion Activity',
     'Review whether increased throughput aligns with current priorities.',
     'productivity', 'tasks', 'personal', 'Operations', 'low', 'medium', 'minor', 55,
     'behavioral_patterns', 'new'),
    (p_org_id, p_user_id, 'ins_recurring_issues_'||p_user_id,
     'Recurring issue cluster',
     'Three recurring issues may benefit from a process review.',
     'Clustered recurring issues often indicate an underlying process gap.',
     'Pattern detected: three related operational issues repeated within authorized scope.',
     'Context Engine, Memory Engine, Recommendation Engine',
     'Would you like a summary prepared for review?',
     'operations', 'context_engine', 'personal', 'Operations', 'high', 'very_high', 'major', 85,
     'repeated_issues', 'new')
  on conflict (organization_id, insight_key) do nothing;

  if not exists (
    select 1 from public.companion_proactive_insight_timeline t
    where t.organization_id = p_org_id and t.event_type = 'workspace_initialized') then
    insert into public.companion_proactive_insight_timeline
      (organization_id, user_id, event_type, description, performed_by)
    values (p_org_id, p_user_id, 'workspace_initialized',
            'Proactive insights workspace initialized', p_user_id);
  end if;
end; $$;

create or replace function public.get_companion_proactive_insights_dashboard(
  p_category text default null, p_priority text default null, p_confidence text default null,
  p_impact text default null, p_department text default null, p_status text default null,
  p_date_from date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_insights jsonb; v_timeline jsonb;
  v_active int; v_high int; v_new int; v_reviewed int;
begin
  v_ctx := public._cpi324_access_insights();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpi324_sync_insights(v_org_id, v_user_id);

  select count(*) filter (where status not in ('archived','dismissed')),
         count(*) filter (where status in ('new','reviewed') and priority in ('critical','high')),
         count(*) filter (where status = 'new'),
         count(*) filter (where status = 'reviewed')
  into v_active, v_high, v_new, v_reviewed
  from public.companion_proactive_insight_records i
  where i.organization_id = v_org_id
    and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'title', i.title, 'observation', i.observation,
    'why_it_matters', i.why_it_matters, 'why_generated', i.why_generated,
    'data_sources', i.data_sources, 'suggested_review', i.suggested_review,
    'category', i.category, 'source_key', i.source_key, 'insight_scope', i.insight_scope,
    'department', i.department, 'priority', i.priority, 'confidence', i.confidence,
    'impact_level', i.impact_level, 'impact_score', i.impact_score,
    'pattern_type', i.pattern_type, 'status', i.status, 'created_at', i.created_at
  ) order by case i.priority when 'critical' then 1 when 'high' then 2 when 'medium' then 3 when 'low' then 4 else 5 end, i.created_at desc),'[]'::jsonb)
  into v_insights
  from public.companion_proactive_insight_records i
  where i.organization_id = v_org_id
    and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx)
    and i.status != 'archived'
    and (p_category is null or i.category = p_category)
    and (p_priority is null or i.priority = p_priority)
    and (p_confidence is null or i.confidence = p_confidence)
    and (p_impact is null or i.impact_level = p_impact)
    and (p_department is null or i.department ilike '%'||trim(p_department)||'%')
    and (p_status is null or i.status = p_status)
    and (p_date_from is null or i.created_at::date >= p_date_from)
    and (p_search is null or trim(p_search) = ''
         or i.title ilike '%'||trim(p_search)||'%'
         or i.observation ilike '%'||trim(p_search)||'%'
         or i.why_it_matters ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description,
    'insight_id', t.insight_id, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_proactive_insight_timeline t
    where t.organization_id = v_org_id
      and (coalesce(v_ctx->>'can_organization','false') = 'true' or t.user_id = v_user_id)
    order by t.created_at desc limit 12
  ) t;

  return jsonb_build_object(
    'found', true,
    'can_personal', coalesce(v_ctx->>'can_personal','false') = 'true',
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'has_insights', v_active > 0,
    'insight_health_score', public._cpi324_health_score(v_org_id),
    'active_insights_count', v_active,
    'high_priority_count', v_high,
    'new_insights_count', v_new,
    'reviewed_count', v_reviewed,
    'impact_score', public._cpi324_impact_score(v_org_id),
    'insights', v_insights,
    'timeline', v_timeline,
    'usage_examples', jsonb_build_array(
      'Good morning. Customer onboarding requests have increased by 14%. Would you like a summary?',
      'Aipify found three recurring issues that may benefit from a process review.',
      'Your team completed significantly more tasks this month than average.'
    ),
    'privacy_note', 'Insights are informational and advisory. Users remain responsible for decisions and actions.',
    'principle', 'Surface meaningful observations. Explain reasoning. High signal, low noise.'
  );
end; $$;

create or replace function public.get_companion_proactive_insight(p_insight_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_row record;
begin
  v_ctx := public._cpi324_access_insights();
  select * into v_row from public.companion_proactive_insight_records i
  where i.id = p_insight_id and i.organization_id = (v_ctx->>'organization_id')::uuid
    and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx);
  if not found then
    return jsonb_build_object('found', false, 'error', 'Insight not found or access denied');
  end if;
  return jsonb_build_object('found', true, 'insight', jsonb_build_object(
    'id', v_row.id, 'title', v_row.title, 'observation', v_row.observation,
    'why_it_matters', v_row.why_it_matters, 'why_generated', v_row.why_generated,
    'data_sources', v_row.data_sources, 'suggested_review', v_row.suggested_review,
    'category', v_row.category, 'source_key', v_row.source_key, 'insight_scope', v_row.insight_scope,
    'department', v_row.department, 'priority', v_row.priority, 'confidence', v_row.confidence,
    'impact_level', v_row.impact_level, 'impact_score', v_row.impact_score,
    'pattern_type', v_row.pattern_type, 'status', v_row.status,
    'created_at', v_row.created_at, 'updated_at', v_row.updated_at
  ));
end; $$;

create or replace function public.list_companion_high_priority_insights(p_limit integer default 10)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cpi324_access_insights();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpi324_sync_insights(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'title', i.title, 'observation', i.observation,
    'priority', i.priority, 'confidence', i.confidence, 'impact_level', i.impact_level,
    'status', i.status, 'created_at', i.created_at
  ) order by case i.priority when 'critical' then 1 when 'high' then 2 else 3 end),'[]'::jsonb)
  into v_items
  from (
    select * from public.companion_proactive_insight_records i
    where i.organization_id = v_org_id and i.status in ('new','reviewed')
      and i.priority in ('critical','high')
      and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx)
    order by case i.priority when 'critical' then 1 when 'high' then 2 end, i.created_at desc
    limit greatest(1, least(coalesce(p_limit, 10), 50))
  ) i;

  return jsonb_build_object('found', true, 'insights', v_items);
end; $$;

create or replace function public.review_companion_proactive_insight(
  p_insight_id uuid, p_action text default 'review'
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_status text; v_event text; v_found boolean;
begin
  v_ctx := public._cpi324_access_insights();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  v_status := case p_action
    when 'dismiss' then 'dismissed' when 'archive' then 'archived'
    when 'escalate' then 'escalated' else 'reviewed'
  end;
  v_event := case p_action
    when 'dismiss' then 'insight_dismissed' when 'archive' then 'insight_archived'
    when 'escalate' then 'insight_escalated' else 'insight_reviewed'
  end;

  update public.companion_proactive_insight_records i set
    status = v_status,
    reviewed_at = case when v_status = 'reviewed' then now() else reviewed_at end,
    reviewed_by = case when v_status = 'reviewed' then v_user_id else reviewed_by end,
    updated_at = now()
  where i.id = p_insight_id and i.organization_id = v_org_id
    and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx)
  returning true into v_found;

  if not coalesce(v_found, false) then
    return jsonb_build_object('ok', false, 'error', 'Insight not found or access denied');
  end if;

  perform public._cpi324_timeline(v_org_id, p_insight_id, v_user_id, v_event, 'Insight status updated');
  perform public._cpi324_log(v_org_id, v_user_id, p_insight_id, v_event, 'Insight status updated',
    jsonb_build_object('action', p_action, 'status', v_status));

  return jsonb_build_object('ok', true, 'insight_id', p_insight_id, 'status', v_status);
end; $$;

create or replace function public.feedback_companion_proactive_insight(
  p_insight_id uuid, p_feedback_type text
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_found boolean; v_score int;
begin
  v_ctx := public._cpi324_access_insights();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select exists(
    select 1 from public.companion_proactive_insight_records i
    where i.id = p_insight_id and i.organization_id = v_org_id
      and public._cpi324_can_read_scope(i.insight_scope, i.user_id, v_ctx)
  ) into v_found;

  if not v_found then
    return jsonb_build_object('ok', false, 'error', 'Insight not found or access denied');
  end if;

  insert into public.companion_proactive_insight_feedback
    (organization_id, insight_id, user_id, feedback_type)
  values (v_org_id, p_insight_id, v_user_id, p_feedback_type);

  v_score := case p_feedback_type
    when 'helpful' then 90 when 'interesting' then 75 when 'already_known' then 50
    when 'not_relevant' then 35 when 'not_helpful' then 20 else 50 end;

  update public.companion_proactive_insight_records
  set impact_score = v_score, updated_at = now()
  where id = p_insight_id;

  perform public._cpi324_timeline(v_org_id, p_insight_id, v_user_id, 'feedback_received', 'User feedback recorded');
  perform public._cpi324_log(v_org_id, v_user_id, p_insight_id, 'feedback_received', 'User feedback recorded',
    jsonb_build_object('feedback_type', p_feedback_type));

  return jsonb_build_object('ok', true, 'insight_id', p_insight_id, 'feedback_type', p_feedback_type);
end; $$;

grant execute on function public.get_companion_proactive_insights_dashboard(text,text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_proactive_insight(uuid) to authenticated;
grant execute on function public.list_companion_high_priority_insights(integer) to authenticated;
grant execute on function public.review_companion_proactive_insight(uuid,text) to authenticated;
grant execute on function public.feedback_companion_proactive_insight(uuid,text) to authenticated;
