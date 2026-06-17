-- Phase 321 — Companion Context Engine
-- Next-generation companion context awareness — distinct from Phase 35 calendar context
-- and Context Intelligence Engine (A.77). Privacy-first, permission-driven.

create table if not exists public.companion_context_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_context_enabled boolean not null default false,
  admin_org_context_enabled    boolean not null default true,
  preferences                  jsonb not null default '{}'::jsonb,
  updated_at                   timestamptz not null default now(),
  updated_by                   uuid references public.users (id) on delete set null
);

create table if not exists public.companion_context_sources (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  source_key       text not null,
  title            text not null default '',
  description      text not null default '',
  category         text not null check (category in (
    'user','organization','work','system'
  )),
  status           text not null default 'disconnected' check (status in (
    'connected','disconnected','pending','restricted'
  )),
  signal_count     integer not null default 0 check (signal_count >= 0),
  coverage_pct     integer not null default 0 check (coverage_pct between 0 and 100),
  department       text not null default '',
  priority         text not null default 'moderate' check (priority in (
    'low','moderate','high','critical'
  )),
  last_updated_at  timestamptz,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  unique (organization_id, source_key)
);

create index if not exists companion_context_sources_org_idx
  on public.companion_context_sources (organization_id, status, category, priority);

create table if not exists public.companion_context_records (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  record_key      text not null default '',
  context_type    text not null check (context_type in (
    'user','organization','work','signal'
  )),
  title           text not null default '',
  summary         text not null check (char_length(summary) <= 500),
  source_key      text not null default '',
  priority        text not null default 'moderate' check (priority in (
    'low','moderate','high','critical'
  )),
  department      text not null default '',
  confidence      text not null default 'moderate' check (confidence in (
    'low','moderate','high'
  )),
  metadata        jsonb not null default '{}'::jsonb,
  observed_at     timestamptz not null default now(),
  unique (organization_id, record_key)
);

create index if not exists companion_context_records_org_idx
  on public.companion_context_records (organization_id, context_type, priority, observed_at desc);

create table if not exists public.companion_context_recommendations (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  rec_key         text not null default '',
  title           text not null default '',
  summary         text not null check (char_length(summary) <= 500),
  recommendation  text not null default '',
  effort          text not null default '',
  value_hint      text not null default '',
  priority        text not null default 'moderate' check (priority in (
    'low','moderate','high','critical'
  )),
  department      text not null default '',
  status          text not null default 'active' check (status in (
    'active','dismissed','completed'
  )),
  created_at      timestamptz not null default now(),
  unique (organization_id, rec_key)
);

create index if not exists companion_context_recommendations_org_idx
  on public.companion_context_recommendations (organization_id, status, priority);

create table if not exists public.companion_context_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  source_key      text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_context_timeline_org_idx
  on public.companion_context_timeline (organization_id, created_at desc);

create table if not exists public.companion_context_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists companion_context_audit_org_idx
  on public.companion_context_audit_logs (organization_id, created_at desc);

alter table public.companion_context_settings         enable row level security;
alter table public.companion_context_sources          enable row level security;
alter table public.companion_context_records          enable row level security;
alter table public.companion_context_recommendations  enable row level security;
alter table public.companion_context_timeline         enable row level security;
alter table public.companion_context_audit_logs       enable row level security;
revoke all on public.companion_context_settings        from authenticated, anon;
revoke all on public.companion_context_sources         from authenticated, anon;
revoke all on public.companion_context_records         from authenticated, anon;
revoke all on public.companion_context_recommendations from authenticated, anon;
revoke all on public.companion_context_timeline        from authenticated, anon;
revoke all on public.companion_context_audit_logs      from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard — permission-first; never bypass grants
-- -----------------------------------------------------------------------
create or replace function public._cce321_access_context()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_role text := 'member';
  v_mgr boolean := false;
  v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active'
  limit 1;

  select coalesce(s.manager_team_context_enabled, false),
         coalesce(s.admin_org_context_enabled, true)
  into v_mgr, v_adm
  from public.companion_context_settings s
  where s.organization_id = v_org_id;

  if v_role in ('owner', 'executive') then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_team', true, 'can_org', true, 'can_manage', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_team', true, 'can_org', true, 'can_manage', true);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_team', true, 'can_org', false, 'can_manage', false);
  else
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_team', false, 'can_org', false, 'can_manage', false);
  end if;
end; $$;

create or replace function public._cce321_log(
  p_org_id uuid, p_user_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_context_audit_logs
    (organization_id, user_id, event_type, description, metadata)
  values (p_org_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

-- Source catalog
create or replace function public._cce321_source_catalog()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key','user_profile','title','User Profile','category','user','dept','People'),
    jsonb_build_object('key','role_permissions','title','Role & Permissions','category','user','dept','Governance'),
    jsonb_build_object('key','organization','title','Organization','category','organization','dept','Executive'),
    jsonb_build_object('key','business_packs','title','Installed Business Packs','category','organization','dept','Operations'),
    jsonb_build_object('key','connected_applications','title','Connected Applications','category','system','dept','Technology'),
    jsonb_build_object('key','notifications','title','Notifications','category','work','dept','Operations'),
    jsonb_build_object('key','tasks','title','Tasks','category','work','dept','Operations'),
    jsonb_build_object('key','calendar_events','title','Calendar Events','category','work','dept','Executive'),
    jsonb_build_object('key','recent_activity','title','Recent Activity','category','work','dept','Operations'),
    jsonb_build_object('key','knowledge_center','title','Knowledge Center','category','organization','dept','People'),
    jsonb_build_object('key','companion_history','title','Companion History','category','user','dept','People'),
    jsonb_build_object('key','support_activity','title','Support Activity','category','work','dept','Support'),
    jsonb_build_object('key','operational_activity','title','Operational Activity','category','organization','dept','Operations')
  );
$$;

-- Sync sources + seed context records from approved metadata only
create or replace function public._cce321_sync_context(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_item jsonb; v_connected int := 0; v_pending int := 0;
begin
  insert into public.companion_context_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  for v_item in select * from jsonb_array_elements(public._cce321_source_catalog()) loop
    insert into public.companion_context_sources (
      organization_id, source_key, title, description, category, status,
      signal_count, coverage_pct, department, priority, last_updated_at
    ) values (
      p_org_id,
      v_item->>'key',
      v_item->>'title',
      'Authorized context source — metadata only, permission-scoped.',
      v_item->>'category',
      case v_item->>'key'
        when 'user_profile' then 'connected'
        when 'role_permissions' then 'connected'
        when 'organization' then 'connected'
        when 'notifications' then 'connected'
        when 'tasks' then 'connected'
        when 'recent_activity' then 'connected'
        else 'pending'
      end,
      case v_item->>'key'
        when 'user_profile' then 4 when 'role_permissions' then 3 when 'organization' then 5
        when 'notifications' then 6 when 'tasks' then 4 when 'recent_activity' then 3
        else 0
      end,
      case v_item->>'key'
        when 'user_profile' then 85 when 'role_permissions' then 80 when 'organization' then 75
        when 'notifications' then 70 when 'tasks' then 65 when 'recent_activity' then 60
        else 20
      end,
      v_item->>'dept',
      'moderate',
      now()
    ) on conflict (organization_id, source_key) do update set
      title = excluded.title,
      last_updated_at = coalesce(companion_context_sources.last_updated_at, now());
  end loop;

  select count(*) filter (where status = 'connected'),
         count(*) filter (where status = 'pending')
  into v_connected, v_pending
  from public.companion_context_sources where organization_id = p_org_id;

  -- User context records
  insert into public.companion_context_records
    (organization_id, user_id, record_key, context_type, title, summary, source_key, priority, confidence)
  values
    (p_org_id, p_user_id, 'user_role_'||p_user_id, 'user', 'User role',
     'Active organizational role and permission scope for contextual assistance.', 'role_permissions', 'moderate', 'high'),
    (p_org_id, p_user_id, 'user_tasks_'||p_user_id, 'user', 'Assigned tasks',
     'Open tasks assigned to you may benefit from prioritized attention.', 'tasks', 'high', 'high'),
    (p_org_id, p_user_id, 'user_events_'||p_user_id, 'user', 'Upcoming events',
     'Calendar events in your authorized scope support scheduling-aware assistance.', 'calendar_events', 'moderate', 'moderate')
  on conflict (organization_id, record_key) do nothing;

  -- Organization context
  insert into public.companion_context_records
    (organization_id, record_key, context_type, title, summary, source_key, priority, confidence)
  values
    (p_org_id, 'org_modules_'||p_org_id, 'organization', 'Installed modules',
     'Licensed modules define which companion capabilities are available.', 'organization', 'moderate', 'high'),
    (p_org_id, 'org_packs_'||p_org_id, 'organization', 'Business Packs',
     'Active Business Packs extend operational context for relevant assistance.', 'business_packs', 'moderate', 'moderate'),
    (p_org_id, 'org_priorities_'||p_org_id, 'organization', 'Operational priorities',
     'Organizational priorities help Aipify focus on what matters most.', 'operational_activity', 'high', 'moderate')
  on conflict (organization_id, record_key) do nothing;

  -- Work context — optional cross-module signals
  if to_regclass('public.action_requests') is not null then
    insert into public.companion_context_records
      (organization_id, record_key, context_type, title, summary, source_key, priority, confidence)
    select p_org_id, 'work_approvals_'||p_org_id, 'work', 'Pending approvals',
      'Items awaiting approval may require executive attention today.', 'tasks', 'high', 'high'
    where exists (
      select 1 from public.action_requests ar
      where ar.company_id in (
        select c.company_id from public.customers c where c.id = p_org_id limit 1
      ) and ar.status = 'pending' limit 1
    )
    on conflict (organization_id, record_key) do nothing;
  end if;

  insert into public.companion_context_records
    (organization_id, record_key, context_type, title, summary, source_key, priority, confidence)
  values
    (p_org_id, 'work_issues_'||p_org_id, 'work', 'Unresolved issues',
     'Open operational issues may benefit from coordinated follow-up.', 'support_activity', 'high', 'moderate'),
    (p_org_id, 'work_escalations_'||p_org_id, 'work', 'Escalations',
     'Escalated items should be reviewed with appropriate urgency.', 'support_activity', 'critical', 'high')
  on conflict (organization_id, record_key) do nothing;

  -- Recommendations (Companion Golden Rule shape)
  insert into public.companion_context_recommendations
    (organization_id, user_id, rec_key, title, summary, recommendation, effort, value_hint, priority)
  values
    (p_org_id, p_user_id, 'rec_attention_'||p_org_id,
     'Items requiring attention',
     'Several work signals suggest focused review today.',
     'Review pending tasks and approvals when you have a moment.',
     '15–20 minutes', 'Clearer priorities and reduced follow-up friction', 'high'),
    (p_org_id, p_user_id, 'rec_connect_'||p_org_id,
     'Expand context coverage',
     'Some context sources are not yet connected.',
     'Connect additional authorized systems to improve relevance.',
     '10 minutes', 'More accurate, proactive companion assistance', 'moderate')
  on conflict (organization_id, rec_key) do nothing;

  if not exists (
    select 1 from public.companion_context_timeline t
    where t.organization_id = p_org_id and t.event_type = 'workspace_initialized') then
    insert into public.companion_context_timeline
      (organization_id, user_id, event_type, description, source_key, performed_by)
    values (p_org_id, p_user_id, 'workspace_initialized',
            'Companion context workspace initialized', 'organization', p_user_id);
  end if;
end; $$;

create or replace function public._cce321_health_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(round(avg(coverage_pct))::integer, 0)
  from public.companion_context_sources
  where organization_id = p_org_id and status = 'connected';
$$;

create or replace function public._cce321_readiness_score(p_org_id uuid)
returns integer language sql stable as $$
  select least(100, greatest(0,
    coalesce(public._cce321_health_score(p_org_id), 0) +
    (select count(*) from public.companion_context_sources
     where organization_id = p_org_id and status = 'connected') * 2
  ))::integer;
$$;

create or replace function public._cce321_confidence_level(p_org_id uuid)
returns text language sql stable as $$
  select case
    when public._cce321_health_score(p_org_id) >= 70 then 'high'
    when public._cce321_health_score(p_org_id) >= 40 then 'moderate'
    else 'low'
  end;
$$;

-- -----------------------------------------------------------------------
-- Dashboard — GET /api/aipify/context
-- -----------------------------------------------------------------------
create or replace function public.get_companion_context_dashboard(
  p_source   text default null,
  p_department text default null,
  p_priority text default null,
  p_user_filter text default null,
  p_date_from date default null,
  p_search   text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid;
  v_sources jsonb := '[]'::jsonb; v_row record;
  v_connected int := 0; v_signals int := 0;
  v_user_ctx jsonb; v_org_ctx jsonb; v_work_ctx jsonb;
  v_can_org boolean; v_can_team boolean;
begin
  v_ctx     := public._cce321_access_context();
  v_org_id  := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_org := coalesce(v_ctx->>'can_org','false') = 'true';
  v_can_team := coalesce(v_ctx->>'can_team','false') = 'true';

  perform public._cce321_sync_context(v_org_id, v_user_id);

  for v_row in
    select s.* from public.companion_context_sources s
    where s.organization_id = v_org_id
      and (p_source is null or s.source_key = p_source)
      and (p_department is null or s.department ilike '%'||trim(p_department)||'%')
      and (p_priority is null or s.priority = p_priority)
      and (p_search is null or trim(p_search) = ''
           or s.title ilike '%'||trim(p_search)||'%'
           or s.source_key ilike '%'||trim(p_search)||'%')
    order by s.status, s.last_updated_at desc nulls last
  loop
    v_sources := v_sources || jsonb_build_object(
      'id', v_row.id, 'source_key', v_row.source_key, 'title', v_row.title,
      'category', v_row.category, 'status', v_row.status,
      'signal_count', v_row.signal_count, 'coverage_pct', v_row.coverage_pct,
      'department', v_row.department, 'priority', v_row.priority,
      'last_updated_at', v_row.last_updated_at
    );
    if v_row.status = 'connected' then v_connected := v_connected + 1; end if;
    v_signals := v_signals + v_row.signal_count;
  end loop;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'source_key', r.source_key,
    'priority', r.priority, 'confidence', r.confidence
  )),'[]'::jsonb) into v_user_ctx
  from public.companion_context_records r
  where r.organization_id = v_org_id and r.context_type = 'user'
    and (r.user_id is null or r.user_id = v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'source_key', r.source_key,
    'priority', r.priority, 'confidence', r.confidence
  )),'[]'::jsonb) into v_org_ctx
  from public.companion_context_records r
  where r.organization_id = v_org_id and r.context_type = 'organization'
    and v_can_org;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'source_key', r.source_key,
    'priority', r.priority, 'confidence', r.confidence
  )),'[]'::jsonb) into v_work_ctx
  from public.companion_context_records r
  where r.organization_id = v_org_id and r.context_type = 'work'
    and (v_can_org or v_can_team or r.user_id = v_user_id);

  return jsonb_build_object(
    'found', true,
    'can_self', coalesce(v_ctx->>'can_self','false') = 'true',
    'can_team', v_can_team,
    'can_org', v_can_org,
    'has_context_data', v_connected > 0,
    'context_health_score', public._cce321_health_score(v_org_id),
    'companion_readiness_score', public._cce321_readiness_score(v_org_id),
    'available_signals', v_signals,
    'context_coverage_pct', public._cce321_health_score(v_org_id),
    'active_sources_count', v_connected,
    'context_confidence', public._cce321_confidence_level(v_org_id),
    'active_sources', v_sources,
    'recently_updated_sources', (
      select coalesce(jsonb_agg(sub.obj), '[]'::jsonb)
      from (
        select jsonb_build_object('source_key', s.source_key, 'title', s.title) as obj
        from public.companion_context_sources s
        where s.organization_id = v_org_id and s.status = 'connected'
        order by s.last_updated_at desc nulls last
        limit 5
      ) sub
    ),
    'user_context', coalesce(v_user_ctx, '[]'::jsonb),
    'organization_context', case when v_can_org then coalesce(v_org_ctx, '[]'::jsonb) else '[]'::jsonb end,
    'work_context', coalesce(v_work_ctx, '[]'::jsonb),
    'companion_view', jsonb_build_object(
      'current_focus', 'Prioritize items requiring attention today.',
      'recent_activity', 'Recent organizational and work signals are available within authorized scope.',
      'pending_actions', coalesce((
        select jsonb_agg(jsonb_build_object('title', r.title, 'summary', r.summary))
        from public.companion_context_records r
        where r.organization_id = v_org_id and r.context_type = 'work' and r.priority in ('high','critical')
        limit 5
      ), '[]'::jsonb),
      'upcoming_events', 'Calendar-aware assistance available when calendar source is connected.',
      'recommended_attention', coalesce((
        select jsonb_agg(jsonb_build_object('title', rec.title, 'recommendation', rec.recommendation))
        from public.companion_context_recommendations rec
        where rec.organization_id = v_org_id and rec.status = 'active'
        limit 3
      ), '[]'::jsonb),
      'context_confidence', public._cce321_confidence_level(v_org_id)
    ),
    'usage_example', 'Good morning. You have items requiring attention. A customer onboarding task may be overdue. Your calendar shows a strategic planning meeting tomorrow.',
    'privacy_note', 'Aipify only uses metadata from approved, authorized context sources — never information outside granted permissions.',
    'principle', 'Context before recommendations. Permission-first access. Privacy by design.'
  );
end; $$;

-- -----------------------------------------------------------------------
-- Sources list — GET /api/aipify/context/sources
-- -----------------------------------------------------------------------
create or replace function public.list_companion_context_sources(
  p_source text default null, p_department text default null,
  p_priority text default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_sources jsonb := '[]'::jsonb; v_row record;
begin
  v_ctx := public._cce321_access_context();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cce321_sync_context(v_org_id, v_user_id);

  for v_row in
    select s.* from public.companion_context_sources s
    where s.organization_id = v_org_id
      and (p_source is null or s.source_key = p_source)
      and (p_department is null or s.department ilike '%'||trim(p_department)||'%')
      and (p_priority is null or s.priority = p_priority)
      and (p_search is null or trim(p_search) = ''
           or s.title ilike '%'||trim(p_search)||'%')
    order by s.status, s.title
  loop
    v_sources := v_sources || jsonb_build_object(
      'id', v_row.id, 'source_key', v_row.source_key, 'title', v_row.title,
      'description', v_row.description, 'category', v_row.category,
      'status', v_row.status, 'signal_count', v_row.signal_count,
      'coverage_pct', v_row.coverage_pct, 'department', v_row.department,
      'priority', v_row.priority, 'last_updated_at', v_row.last_updated_at
    );
  end loop;

  return jsonb_build_object('found', true, 'sources', v_sources);
end; $$;

-- -----------------------------------------------------------------------
-- Timeline — GET /api/aipify/context/timeline
-- -----------------------------------------------------------------------
create or replace function public.get_companion_context_timeline(
  p_date_from date default null, p_source text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_events jsonb;
  v_can_org boolean;
begin
  v_ctx := public._cce321_access_context();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_org := coalesce(v_ctx->>'can_org','false') = 'true';
  perform public._cce321_sync_context(v_org_id, v_user_id);

  select coalesce(jsonb_agg(r order by r->>'created_at' desc), '[]'::jsonb)
  into v_events
  from (
    select jsonb_build_object(
      'id', t.id, 'event_type', t.event_type, 'description', t.description,
      'source_key', t.source_key, 'created_at', t.created_at
    ) as r
    from public.companion_context_timeline t
    where t.organization_id = v_org_id
      and (p_date_from is null or t.created_at::date >= p_date_from)
      and (p_source is null or t.source_key = p_source)
      and (v_can_org or t.user_id = v_user_id)
    union all
    select jsonb_build_object(
      'id', r.id, 'event_type', 'context_observation', 'description', r.title,
      'source_key', r.source_key, 'created_at', r.observed_at
    )
    from public.companion_context_records r
    where r.organization_id = v_org_id
      and (p_date_from is null or r.observed_at::date >= p_date_from)
      and (p_source is null or r.source_key = p_source)
      and (v_can_org or r.user_id = v_user_id or r.user_id is null)
  ) sub;

  return jsonb_build_object('found', true, 'timeline', v_events);
end; $$;

-- -----------------------------------------------------------------------
-- Recommendations — GET /api/aipify/context/recommendations
-- -----------------------------------------------------------------------
create or replace function public.get_companion_context_recommendations(
  p_department text default null, p_priority text default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_recs jsonb;
  v_can_org boolean;
begin
  v_ctx := public._cce321_access_context();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  v_can_org := coalesce(v_ctx->>'can_org','false') = 'true';
  perform public._cce321_sync_context(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'rec_key', r.rec_key, 'title', r.title, 'summary', r.summary,
    'recommendation', r.recommendation, 'effort', r.effort, 'value_hint', r.value_hint,
    'priority', r.priority, 'department', r.department
  ) order by case r.priority when 'critical' then 1 when 'high' then 2 when 'moderate' then 3 else 4 end),'[]'::jsonb)
  into v_recs
  from public.companion_context_recommendations r
  where r.organization_id = v_org_id and r.status = 'active'
    and (v_can_org or r.user_id = v_user_id)
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_priority is null or r.priority = p_priority)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%'
         or r.recommendation ilike '%'||trim(p_search)||'%');

  return jsonb_build_object('found', true, 'recommendations', v_recs);
end; $$;

grant execute on function public.get_companion_context_dashboard(text,text,text,text,date,text) to authenticated;
grant execute on function public.list_companion_context_sources(text,text,text,text) to authenticated;
grant execute on function public.get_companion_context_timeline(date,text) to authenticated;
grant execute on function public.get_companion_context_recommendations(text,text,text) to authenticated;
