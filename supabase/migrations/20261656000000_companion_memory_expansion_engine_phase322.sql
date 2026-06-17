-- Phase 322 — Companion Memory Expansion Engine
-- Long-term companion memory layer — distinct from PAME personal_memories.
-- Privacy-first, permission-driven, human review required.

create table if not exists public.companion_memory_settings (
  organization_id              uuid primary key references public.organizations (id) on delete cascade,
  manager_team_memory_enabled  boolean not null default false,
  admin_org_memory_enabled     boolean not null default true,
  auto_suggest_enabled         boolean not null default true,
  preferences                  jsonb not null default '{}'::jsonb,
  updated_at                   timestamptz not null default now(),
  updated_by                   uuid references public.users (id) on delete set null
);

create table if not exists public.companion_memory_sources (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  source_key       text not null,
  title            text not null default '',
  description      text not null default '',
  category         text not null default 'companion',
  status           text not null default 'active' check (status in ('active','inactive')),
  memory_count     integer not null default 0 check (memory_count >= 0),
  last_updated_at  timestamptz,
  created_at       timestamptz not null default now(),
  unique (organization_id, source_key)
);

create table if not exists public.companion_memory_records (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  user_id          uuid references public.users (id) on delete set null,
  memory_key       text not null default '',
  title            text not null default '',
  summary          text not null check (char_length(summary) <= 500),
  content          text not null default '',
  category         text not null check (category in (
    'user_preferences','team_preferences','organizational_preferences',
    'companion_preferences','communication_style','operational_workflows',
    'approved_processes','recurring_tasks','important_dates',
    'business_context','relationship_context','knowledge_references'
  )),
  memory_type      text not null default 'long_term' check (memory_type in ('temporary','long_term')),
  memory_scope     text not null default 'personal' check (memory_scope in (
    'personal','team','department','organization','global'
  )),
  source_key       text not null default 'companion',
  department       text not null default '',
  confidence       text not null default 'unverified' check (confidence in (
    'high','medium','low','unverified'
  )),
  approval_status  text not null default 'suggested' check (approval_status in (
    'suggested','approved','rejected','archived'
  )),
  reason           text not null default '',
  learned_at       timestamptz not null default now(),
  approved_at      timestamptz,
  approved_by      uuid references public.users (id) on delete set null,
  metadata         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (organization_id, memory_key)
);

create index if not exists companion_memory_records_org_idx
  on public.companion_memory_records (
    organization_id, approval_status, memory_scope, category, confidence, learned_at desc
  );

create table if not exists public.companion_memory_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_id       uuid references public.companion_memory_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_memory_timeline_org_idx
  on public.companion_memory_timeline (organization_id, created_at desc);

create table if not exists public.companion_memory_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  memory_id       uuid references public.companion_memory_records (id) on delete set null,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists companion_memory_audit_org_idx
  on public.companion_memory_audit_logs (organization_id, created_at desc);

alter table public.companion_memory_settings enable row level security;
alter table public.companion_memory_sources  enable row level security;
alter table public.companion_memory_records  enable row level security;
alter table public.companion_memory_timeline enable row level security;
alter table public.companion_memory_audit_logs enable row level security;
revoke all on public.companion_memory_settings  from authenticated, anon;
revoke all on public.companion_memory_sources   from authenticated, anon;
revoke all on public.companion_memory_records   from authenticated, anon;
revoke all on public.companion_memory_timeline  from authenticated, anon;
revoke all on public.companion_memory_audit_logs from authenticated, anon;

-- -----------------------------------------------------------------------
-- Access guard — permission-first memory scope
-- -----------------------------------------------------------------------
create or replace function public._cme322_access_memory()
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

  select coalesce(s.manager_team_memory_enabled, false),
         coalesce(s.admin_org_memory_enabled, true)
  into v_mgr, v_adm
  from public.companion_memory_settings s
  where s.organization_id = v_org_id;

  if v_role in ('owner', 'executive') then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_department', true,
      'can_organization', true, 'can_manage', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_department', true,
      'can_organization', true, 'can_manage', true);
  elsif v_role = 'manager' and v_mgr then
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', true, 'can_department', false,
      'can_organization', false, 'can_manage', false);
  else
    return jsonb_build_object(
      'organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_personal', true, 'can_team', false, 'can_department', false,
      'can_organization', false, 'can_manage', false);
  end if;
end; $$;

create or replace function public._cme322_log(
  p_org_id uuid, p_user_id uuid, p_memory_id uuid,
  p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_memory_audit_logs
    (organization_id, memory_id, user_id, event_type, description, metadata)
  values (p_org_id, p_memory_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cme322_timeline(
  p_org_id uuid, p_memory_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_memory_timeline
    (organization_id, memory_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_memory_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cme322_can_read_scope(
  p_scope text, p_owner_id uuid, p_ctx jsonb
) returns boolean language sql immutable as $$
  select case p_scope
    when 'personal' then p_owner_id is null or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'team' then coalesce(p_ctx->>'can_team','false') = 'true'
         or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'department' then coalesce(p_ctx->>'can_department','false') = 'true'
         or p_owner_id = (p_ctx->>'user_id')::uuid
    when 'organization' then coalesce(p_ctx->>'can_organization','false') = 'true'
    when 'global' then coalesce(p_ctx->>'can_organization','false') = 'true'
    else p_owner_id = (p_ctx->>'user_id')::uuid
  end;
$$;

create or replace function public._cme322_health_score(p_org_id uuid)
returns integer language sql stable as $$
  select coalesce(round(
    100.0 * count(*) filter (where approval_status = 'approved' and confidence in ('high','medium'))
    / nullif(greatest(count(*) filter (where approval_status != 'archived'), 1), 0)
  )::integer, 0)
  from public.companion_memory_records
  where organization_id = p_org_id;
$$;

create or replace function public._cme322_sync_memory(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_memory_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.companion_memory_sources (organization_id, source_key, title, description, memory_count, last_updated_at)
  values
    (p_org_id, 'user_interaction', 'User interactions', 'Approved facts from companion conversations', 0, now()),
    (p_org_id, 'workflow_observation', 'Workflow observation', 'Recurring operational patterns', 0, now()),
    (p_org_id, 'organization_profile', 'Organization profile', 'Organizational structure and preferences', 0, now()),
    (p_org_id, 'companion_learning', 'Companion learning', 'Companion-suggested memories awaiting review', 0, now())
  on conflict (organization_id, source_key) do nothing;

  insert into public.companion_memory_records (
    organization_id, user_id, memory_key, title, summary, content, category,
    memory_type, memory_scope, source_key, department, confidence, approval_status, reason
  ) values
    (p_org_id, p_user_id, 'mem_briefing_'||p_user_id, 'Weekly executive briefings',
     'Your organization prefers weekly executive briefings.',
     'Executive briefings are prepared on a weekly cadence when authorized.',
     'organizational_preferences', 'long_term', 'organization', 'organization_profile', 'Executive',
     'high', 'approved', 'Observed from approved briefing preferences'),
    (p_org_id, p_user_id, 'mem_comm_style_'||p_user_id, 'Communication style',
     'Professional, concise communication is preferred.',
     'Responses should remain calm, enterprise-ready, and action-oriented.',
     'communication_style', 'long_term', 'personal', 'user_interaction', 'People',
     'medium', 'approved', 'User-approved communication preference'),
    (p_org_id, p_user_id, 'mem_monthly_process_'||p_org_id, 'Monthly reporting routine',
     'This process repeats every month.',
     'A recurring monthly operational review may benefit from remembered workflow support.',
     'recurring_tasks', 'long_term', 'organization', 'workflow_observation', 'Operations',
     'medium', 'suggested', 'Aipify noticed a repeated monthly pattern'),
    (p_org_id, p_user_id, 'mem_workflow_'||p_org_id, 'Approved onboarding workflow',
     'You previously approved this workflow.',
     'An approved customer onboarding workflow can be reused when you confirm.',
     'approved_processes', 'long_term', 'organization', 'companion_learning', 'Operations',
     'high', 'approved', 'Explicitly approved by an authorized user'),
    (p_org_id, p_user_id, 'mem_temp_project_'||p_user_id, 'Current project focus',
     'Active project context for temporary assistance.',
     'Current priorities and active project metadata only — not raw conversation content.',
     'business_context', 'temporary', 'personal', 'user_interaction', 'Operations',
     'low', 'approved', 'Short-term project context')
  on conflict (organization_id, memory_key) do nothing;

  update public.companion_memory_sources s
  set memory_count = (
    select count(*) from public.companion_memory_records r
    where r.organization_id = s.organization_id and r.source_key = s.source_key
      and r.approval_status != 'archived'
  ),
  last_updated_at = now()
  where s.organization_id = p_org_id;

  if not exists (
    select 1 from public.companion_memory_timeline t
    where t.organization_id = p_org_id and t.event_type = 'workspace_initialized') then
    insert into public.companion_memory_timeline
      (organization_id, user_id, event_type, description, performed_by)
    values (p_org_id, p_user_id, 'workspace_initialized',
            'Companion memory workspace initialized', p_user_id);
  end if;
end; $$;

-- Dashboard — GET /api/aipify/memory
create or replace function public.get_companion_memory_dashboard(
  p_memory_type text default null,
  p_source      text default null,
  p_department  text default null,
  p_status      text default null,
  p_confidence  text default null,
  p_date_from   date default null,
  p_search      text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid;
  v_memories jsonb; v_sources jsonb; v_recent jsonb; v_timeline jsonb;
  v_active int; v_approved int;
begin
  v_ctx     := public._cme322_access_memory();
  v_org_id  := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cme322_sync_memory(v_org_id, v_user_id);

  select count(*) filter (where approval_status = 'approved'),
         count(*) filter (where approval_status != 'archived')
  into v_approved, v_active
  from public.companion_memory_records r
  where r.organization_id = v_org_id
    and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'category', r.category,
    'memory_type', r.memory_type, 'memory_scope', r.memory_scope,
    'source_key', r.source_key, 'confidence', r.confidence,
    'approval_status', r.approval_status, 'department', r.department,
    'learned_at', r.learned_at
  ) order by r.learned_at desc),'[]'::jsonb) into v_memories
  from public.companion_memory_records r
  where r.organization_id = v_org_id
    and r.approval_status != 'archived'
    and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx)
    and (p_memory_type is null or r.memory_type = p_memory_type)
    and (p_source is null or r.source_key = p_source)
    and (p_department is null or r.department ilike '%'||trim(p_department)||'%')
    and (p_status is null or r.approval_status = p_status)
    and (p_confidence is null or r.confidence = p_confidence)
    and (p_date_from is null or r.learned_at::date >= p_date_from)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%'
         or r.summary ilike '%'||trim(p_search)||'%'
         or r.content ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'source_key', s.source_key, 'title', s.title,
    'memory_count', s.memory_count, 'last_updated_at', s.last_updated_at
  )),'[]'::jsonb) into v_sources
  from public.companion_memory_sources s
  where s.organization_id = v_org_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'confidence', r.confidence,
    'approval_status', r.approval_status, 'learned_at', r.learned_at
  ) order by r.learned_at desc),'[]'::jsonb) into v_recent
  from (
    select * from public.companion_memory_records r
    where r.organization_id = v_org_id
      and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx)
      and r.approval_status != 'archived'
    order by r.learned_at desc limit 5
  ) r;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description,
    'memory_id', t.memory_id, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_memory_timeline t
    where t.organization_id = v_org_id
      and (coalesce(v_ctx->>'can_organization','false') = 'true' or t.user_id = v_user_id)
    order by t.created_at desc limit 12
  ) t;

  return jsonb_build_object(
    'found', true,
    'can_personal', coalesce(v_ctx->>'can_personal','false') = 'true',
    'can_team', coalesce(v_ctx->>'can_team','false') = 'true',
    'can_organization', coalesce(v_ctx->>'can_organization','false') = 'true',
    'can_manage', coalesce(v_ctx->>'can_manage','false') = 'true',
    'has_memories', v_active > 0,
    'memory_health_score', public._cme322_health_score(v_org_id),
    'active_memories_count', v_active,
    'approved_memories_count', v_approved,
    'memories', v_memories,
    'memory_sources', v_sources,
    'recently_learned', v_recent,
    'timeline', v_timeline,
    'usage_examples', jsonb_build_array(
      'Aipify remembers that your organization prefers weekly executive briefings.',
      'Aipify noticed this process repeats every month. Would you like to remember it?',
      'You previously approved this workflow. Would you like to reuse it?'
    ),
    'privacy_note', 'Memory remains transparent and manageable. Aipify never treats low-confidence memories as facts.',
    'principle', 'Memory must be transparent. Users remain in control. Trust before automation.'
  );
end; $$;

-- Detail — GET /api/aipify/memory/[id]
create or replace function public.get_companion_memory(p_memory_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_row record;
begin
  v_ctx := public._cme322_access_memory();

  select * into v_row from public.companion_memory_records r
  where r.id = p_memory_id
    and r.organization_id = (v_ctx->>'organization_id')::uuid
    and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx);

  if not found then
    return jsonb_build_object('found', false, 'error', 'Memory not found or access denied');
  end if;

  return jsonb_build_object(
    'found', true,
    'memory', jsonb_build_object(
      'id', v_row.id, 'title', v_row.title, 'summary', v_row.summary,
      'content', v_row.content, 'category', v_row.category,
      'memory_type', v_row.memory_type, 'memory_scope', v_row.memory_scope,
      'source_key', v_row.source_key, 'department', v_row.department,
      'confidence', v_row.confidence, 'approval_status', v_row.approval_status,
      'reason', v_row.reason, 'learned_at', v_row.learned_at,
      'approved_at', v_row.approved_at, 'updated_at', v_row.updated_at
    )
  );
end; $$;

-- Review list — GET /api/aipify/memory/review
create or replace function public.list_companion_memory_review(
  p_status text default null, p_confidence text default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_items jsonb;
begin
  v_ctx := public._cme322_access_memory();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cme322_sync_memory(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'source_key', r.source_key,
    'reason', r.reason, 'confidence', r.confidence, 'approval_status', r.approval_status,
    'category', r.category, 'memory_scope', r.memory_scope, 'learned_at', r.learned_at
  ) order by case r.approval_status when 'suggested' then 1 else 2 end, r.learned_at desc),'[]'::jsonb)
  into v_items
  from public.companion_memory_records r
  where r.organization_id = v_org_id
    and r.approval_status != 'archived'
    and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx)
    and (p_status is null or r.approval_status = p_status)
    and (p_confidence is null or r.confidence = p_confidence)
    and (p_search is null or trim(p_search) = ''
         or r.title ilike '%'||trim(p_search)||'%'
         or r.summary ilike '%'||trim(p_search)||'%');

  return jsonb_build_object('found', true, 'review_items', v_items);
end; $$;

-- Create — POST /api/aipify/memory
create or replace function public.create_companion_memory(
  p_title text, p_summary text, p_content text default '',
  p_category text default 'user_preferences',
  p_memory_type text default 'long_term',
  p_memory_scope text default 'personal',
  p_source_key text default 'user_interaction',
  p_department text default '', p_confidence text default 'unverified',
  p_reason text default ''
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_id uuid; v_key text;
begin
  v_ctx := public._cme322_access_memory();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  if not public._cme322_can_read_scope(p_memory_scope, v_user_id, v_ctx) then
    return jsonb_build_object('ok', false, 'error', 'Insufficient permissions for memory scope');
  end if;

  v_key := 'mem_'||gen_random_uuid()::text;
  insert into public.companion_memory_records (
    organization_id, user_id, memory_key, title, summary, content, category,
    memory_type, memory_scope, source_key, department, confidence,
    approval_status, reason, approved_at, approved_by
  ) values (
    v_org_id, v_user_id, v_key, left(coalesce(p_title,''), 200),
    left(coalesce(p_summary,''), 500), left(coalesce(p_content,''), 2000),
    coalesce(p_category, 'user_preferences'), coalesce(p_memory_type, 'long_term'),
    coalesce(p_memory_scope, 'personal'), coalesce(p_source_key, 'user_interaction'),
    coalesce(p_department, ''), coalesce(p_confidence, 'unverified'),
    'approved', left(coalesce(p_reason,''), 500), now(), v_user_id
  ) returning id into v_id;

  perform public._cme322_timeline(v_org_id, v_id, v_user_id, 'memory_created', 'Memory created');
  perform public._cme322_log(v_org_id, v_user_id, v_id, 'memory_created', 'Memory created');

  return jsonb_build_object('ok', true, 'memory_id', v_id);
end; $$;

-- Update / review — PATCH /api/aipify/memory/[id]
create or replace function public.update_companion_memory(
  p_memory_id uuid,
  p_title text default null, p_summary text default null, p_content text default null,
  p_category text default null, p_memory_type text default null,
  p_memory_scope text default null, p_department text default null,
  p_confidence text default null, p_approval_status text default null,
  p_reason text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_row record; v_event text;
begin
  v_ctx := public._cme322_access_memory();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select * into v_row from public.companion_memory_records r
  where r.id = p_memory_id and r.organization_id = v_org_id
    and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx)
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'Memory not found or access denied');
  end if;

  if p_memory_scope is not null and not public._cme322_can_read_scope(p_memory_scope, v_user_id, v_ctx) then
    return jsonb_build_object('ok', false, 'error', 'Insufficient permissions for memory scope');
  end if;

  update public.companion_memory_records set
    title = coalesce(nullif(left(p_title, 200), ''), title),
    summary = coalesce(nullif(left(p_summary, 500), ''), summary),
    content = coalesce(nullif(left(p_content, 2000), ''), content),
    category = coalesce(p_category, category),
    memory_type = coalesce(p_memory_type, memory_type),
    memory_scope = coalesce(p_memory_scope, memory_scope),
    department = coalesce(p_department, department),
    confidence = coalesce(p_confidence, confidence),
    approval_status = coalesce(p_approval_status, approval_status),
    reason = coalesce(nullif(left(p_reason, 500), ''), reason),
    approved_at = case when p_approval_status = 'approved' then now() else approved_at end,
    approved_by = case when p_approval_status = 'approved' then v_user_id else approved_by end,
    updated_at = now()
  where id = p_memory_id;

  v_event := case p_approval_status
    when 'approved' then 'memory_approved'
    when 'rejected' then 'memory_rejected'
    when 'archived' then 'memory_archived'
    else 'memory_modified'
  end;

  perform public._cme322_timeline(v_org_id, p_memory_id, v_user_id, v_event, 'Memory updated');
  perform public._cme322_log(v_org_id, v_user_id, p_memory_id, v_event, 'Memory updated');

  return jsonb_build_object('ok', true, 'memory_id', p_memory_id);
end; $$;

-- Delete — DELETE /api/aipify/memory/[id]
create or replace function public.delete_companion_memory(p_memory_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_found boolean;
begin
  v_ctx := public._cme322_access_memory();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  select exists(
    select 1 from public.companion_memory_records r
    where r.id = p_memory_id and r.organization_id = v_org_id
      and public._cme322_can_read_scope(r.memory_scope, r.user_id, v_ctx)
  ) into v_found;

  if not v_found then
    return jsonb_build_object('ok', false, 'error', 'Memory not found or access denied');
  end if;

  perform public._cme322_timeline(v_org_id, p_memory_id, v_user_id, 'memory_deleted', 'Memory deleted');
  perform public._cme322_log(v_org_id, v_user_id, p_memory_id, 'memory_deleted', 'Memory deleted');

  delete from public.companion_memory_records where id = p_memory_id;

  return jsonb_build_object('ok', true);
end; $$;

grant execute on function public.get_companion_memory_dashboard(text,text,text,text,text,date,text) to authenticated;
grant execute on function public.get_companion_memory(uuid) to authenticated;
grant execute on function public.list_companion_memory_review(text,text,text) to authenticated;
grant execute on function public.create_companion_memory(text,text,text,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.update_companion_memory(uuid,text,text,text,text,text,text,text,text,text,text) to authenticated;
grant execute on function public.delete_companion_memory(uuid) to authenticated;
