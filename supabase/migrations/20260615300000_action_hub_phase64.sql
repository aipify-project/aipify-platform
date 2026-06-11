-- Phase 64 — Action Center & Decision Hub

-- ---------------------------------------------------------------------------
-- 1. action_settings (tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.action_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  auto_collect boolean not null default true,
  auto_assign boolean not null default false,
  require_approval_high_risk boolean not null default true,
  include_support boolean not null default true,
  include_quality boolean not null default true,
  include_governance boolean not null default true,
  include_memory boolean not null default true,
  include_knowledge boolean not null default true,
  include_briefing boolean not null default true,
  include_desktop boolean not null default true,
  default_owner_role text not null default 'admin',
  retention_days int not null default 365,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.action_settings enable row level security;
revoke all on public.action_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. action_templates
-- ---------------------------------------------------------------------------
create table if not exists public.action_templates (
  id uuid primary key default gen_random_uuid(),
  template_key text not null unique,
  action_type text not null,
  title_template text not null,
  description_template text not null default '',
  source_module text not null,
  default_priority text not null default 'medium' check (
    default_priority in ('critical', 'high', 'medium', 'low', 'informational')
  ),
  default_severity text not null default 'medium',
  requires_approval boolean not null default false,
  action_url_template text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.action_templates enable row level security;
revoke all on public.action_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. action_items
-- ---------------------------------------------------------------------------
create table if not exists public.action_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_key text not null,
  title text not null,
  description text not null default '',
  source_module text not null,
  source_type text,
  source_id uuid,
  action_type text not null default 'general',
  severity text not null default 'medium',
  priority text not null default 'medium' check (
    priority in ('critical', 'high', 'medium', 'low', 'informational')
  ),
  priority_score int not null default 50,
  recommended_owner text,
  recommended_due_date timestamptz,
  assigned_user_id uuid references public.users (id) on delete set null,
  status text not null default 'open' check (
    status in (
      'open', 'assigned', 'in_progress', 'waiting_approval',
      'blocked', 'completed', 'dismissed'
    )
  ),
  action_url text,
  requires_approval boolean not null default false,
  rationale text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_by_user_id uuid references public.users (id) on delete set null,
  completed_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, action_key)
);

create index if not exists action_items_tenant_status_idx
  on public.action_items (tenant_id, status, priority_score desc, created_at desc);

create index if not exists action_items_tenant_assigned_idx
  on public.action_items (tenant_id, assigned_user_id, status);

alter table public.action_items enable row level security;
revoke all on public.action_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. action_assignments
-- ---------------------------------------------------------------------------
create table if not exists public.action_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_item_id uuid not null references public.action_items (id) on delete cascade,
  assigned_by_user_id uuid references public.users (id) on delete set null,
  assigned_to_user_id uuid references public.users (id) on delete set null,
  assigned_to_label text,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists action_assignments_tenant_idx
  on public.action_assignments (tenant_id, created_at desc);

alter table public.action_assignments enable row level security;
revoke all on public.action_assignments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. action_decisions
-- ---------------------------------------------------------------------------
create table if not exists public.action_decisions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_item_id uuid not null references public.action_items (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  decision_type text not null check (
    decision_type in ('approve', 'reject', 'delegate', 'complete', 'dismiss', 'block', 'start')
  ),
  note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists action_decisions_tenant_idx
  on public.action_decisions (tenant_id, created_at desc);

alter table public.action_decisions enable row level security;
revoke all on public.action_decisions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. action_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.action_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  action_item_id uuid not null references public.action_items (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  feedback_type text not null check (
    feedback_type in ('helpful', 'not_helpful', 'incorrect', 'irrelevant')
  ),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.action_feedback enable row level security;
revoke all on public.action_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers (_ach_)
-- ---------------------------------------------------------------------------
create or replace function public._ach_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ach_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ach_priority_score(p_priority text, p_requires_approval boolean default false)
returns int language sql immutable as $$
  select (
    case lower(coalesce(p_priority, 'medium'))
      when 'critical' then 100
      when 'high' then 75
      when 'medium' then 50
      when 'low' then 25
      else 10
    end
  ) + case when coalesce(p_requires_approval, false) then 15 else 0 end;
$$;

create or replace function public._ach_ensure_settings(p_tenant_id uuid)
returns public.action_settings language plpgsql security definer set search_path = public as $$
declare v_row public.action_settings;
begin
  insert into public.action_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.action_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ach_upsert_item(
  p_tenant_id uuid,
  p_action_key text,
  p_title text,
  p_description text,
  p_source_module text,
  p_source_type text,
  p_source_id uuid,
  p_action_type text,
  p_severity text,
  p_priority text,
  p_recommended_owner text,
  p_recommended_due_date timestamptz,
  p_action_url text,
  p_requires_approval boolean,
  p_rationale text,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.action_items (
    tenant_id, action_key, title, description, source_module, source_type, source_id,
    action_type, severity, priority, priority_score, recommended_owner, recommended_due_date,
    action_url, requires_approval, rationale, metadata, status
  ) values (
    p_tenant_id, p_action_key, p_title, coalesce(p_description, ''),
    p_source_module, p_source_type, p_source_id, coalesce(p_action_type, 'general'),
    coalesce(p_severity, 'medium'), coalesce(p_priority, 'medium'),
    public._ach_priority_score(p_priority, p_requires_approval),
    p_recommended_owner, p_recommended_due_date, p_action_url,
    coalesce(p_requires_approval, false), coalesce(p_rationale, ''),
    coalesce(p_metadata, '{}'::jsonb),
    case when coalesce(p_requires_approval, false) then 'waiting_approval' else 'open' end
  )
  on conflict (tenant_id, action_key) do update set
    title = excluded.title,
    description = excluded.description,
    severity = excluded.severity,
    priority = excluded.priority,
    priority_score = excluded.priority_score,
    recommended_owner = excluded.recommended_owner,
    recommended_due_date = excluded.recommended_due_date,
    action_url = excluded.action_url,
    requires_approval = excluded.requires_approval,
    rationale = excluded.rationale,
    metadata = excluded.metadata,
    updated_at = now()
  where public.action_items.status not in ('completed', 'dismissed')
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._ach_log_decision(
  p_tenant_id uuid,
  p_action_id uuid,
  p_user_id uuid,
  p_decision_type text,
  p_note text default '',
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.action_decisions (tenant_id, action_item_id, user_id, decision_type, note, metadata)
  values (p_tenant_id, p_action_id, p_user_id, p_decision_type, coalesce(p_note, ''), coalesce(p_metadata, '{}'::jsonb));
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'action_hub.' || p_decision_type,
    'action_hub', 'success', null,
    jsonb_build_object('action_item_id', p_action_id, 'note', p_note)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Seed templates
-- ---------------------------------------------------------------------------
insert into public.action_templates (template_key, action_type, title_template, description_template, source_module, default_priority, requires_approval, action_url_template)
values
  ('support.review_draft', 'support', 'Review support draft', 'A support response draft needs review before sending.', 'support', 'high', true, '/app/support'),
  ('quality.resolve_alert', 'quality', 'Resolve Quality Guardian alert', 'A quality incident requires attention.', 'quality', 'high', false, '/app/quality'),
  ('governance.approve', 'approval', 'Approve pending request', 'A governance approval is waiting for review.', 'governance', 'high', true, '/app/approvals'),
  ('knowledge.follow_gap', 'knowledge', 'Follow up knowledge gap', 'A knowledge gap was detected and needs follow-up.', 'knowledge', 'medium', false, '/app/knowledge-center'),
  ('memory.accept_recommendation', 'memory', 'Review memory recommendation', 'Memory Engine suggested an improvement.', 'memory', 'medium', false, '/app/memory/recommendations'),
  ('unonight.verify', 'moderation', 'Review pending verifications', 'Unonight marketplace verifications need review.', 'unonight', 'high', true, '/app/approvals'),
  ('unonight.listing', 'moderation', 'Approve marketplace listing', 'A marketplace listing awaits approval.', 'unonight', 'high', true, '/app/approvals')
on conflict (template_key) do nothing;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'action-hub', 'Action Center', 'Decision hub — prioritized actions and assignments.', 'authenticated', 64
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'action-hub' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 9. Collect recommendations from modules
-- ---------------------------------------------------------------------------
create or replace function public.collect_action_recommendations(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_since timestamptz;
  v_settings public.action_settings;
  v_count int := 0;
  r record;
begin
  v_tenant_id := public._ach_require_tenant();
  v_settings := public._ach_ensure_settings(v_tenant_id);
  if not v_settings.enabled then
    return jsonb_build_object('collected', 0, 'enabled', false);
  end if;
  v_since := coalesce(p_since, now() - interval '14 days');

  if v_settings.include_quality then
    for r in
      select id, incident_key, title, observed_behavior, severity, created_at
      from public.aipify_quality_incidents
      where tenant_id = v_tenant_id and status in ('open', 'investigating')
        and created_at >= v_since
    loop
      perform public._ach_upsert_item(
        v_tenant_id, 'action.quality.' || r.incident_key,
        'Resolve: ' || r.title, r.observed_behavior, 'quality', 'quality_incident', r.id,
        'quality', r.severity,
        case when r.severity in ('critical', 'high') then 'high' else 'medium' end,
        'quality_owner', null, '/app/quality/incidents', false,
        'Quality Guardian detected an incident requiring follow-up.', '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_governance then
    for r in
      select id, title, risk_level, created_at
      from public.aipify_approval_requests
      where tenant_id = v_tenant_id and status = 'pending' and created_at >= v_since
    loop
      perform public._ach_upsert_item(
        v_tenant_id, 'action.governance.' || r.id::text,
        'Approve: ' || r.title, 'Governance approval pending review.', 'governance', 'approval_request', r.id,
        'approval', coalesce(r.risk_level, 'medium'),
        case when r.risk_level in ('high', 'critical') then 'critical' else 'high' end,
        'admin', null, '/app/approvals', true,
        'High-risk actions require explicit approval per governance policy.', '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_knowledge then
    for r in
      select id, question, created_at
      from public.aipify_knowledge_gaps
      where tenant_id = v_tenant_id and status in ('open', 'pending') and created_at >= v_since
    loop
      perform public._ach_upsert_item(
        v_tenant_id, 'action.knowledge.gap.' || r.id::text,
        'Follow up knowledge gap', left(r.question, 300), 'knowledge', 'knowledge_gap', r.id,
        'knowledge', 'medium', 'medium', 'knowledge_owner', null,
        '/app/knowledge-center', false,
        'Knowledge Center identified a gap that may affect support quality.', '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_memory then
    for r in
      select id, title, summary, rationale, action_url, priority_score, created_at
      from public.memory_recommendations
      where tenant_id = v_tenant_id and status = 'suggested' and created_at >= v_since
    loop
      perform public._ach_upsert_item(
        v_tenant_id, 'action.memory.rec.' || r.id::text,
        r.title, coalesce(r.summary, ''), 'memory', 'memory_recommendation', r.id,
        'memory', 'medium',
        case when r.priority_score >= 75 then 'high' when r.priority_score >= 50 then 'medium' else 'low' end,
        null, null, coalesce(r.action_url, '/app/memory/recommendations'), false,
        coalesce(r.rationale, 'Memory Engine detected a recurring pattern.'), '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  return jsonb_build_object('collected', v_count, 'enabled', true);
end; $$;

create or replace function public.upsert_action_items_batch(p_items jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_item jsonb; v_count int := 0;
begin
  v_tenant_id := public._ach_require_tenant();
  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    perform public._ach_upsert_item(
      v_tenant_id,
      v_item->>'action_key', v_item->>'title', v_item->>'description',
      v_item->>'source_module', v_item->>'source_type',
      nullif(v_item->>'source_id', '')::uuid,
      coalesce(v_item->>'action_type', 'general'),
      coalesce(v_item->>'severity', 'medium'),
      coalesce(v_item->>'priority', 'medium'),
      v_item->>'recommended_owner',
      nullif(v_item->>'recommended_due_date', '')::timestamptz,
      v_item->>'action_url',
      coalesce((v_item->>'requires_approval')::boolean, false),
      coalesce(v_item->>'rationale', ''),
      coalesce(v_item->'metadata', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('upserted', v_count);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Card & dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_action_hub_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_user_id := public._ach_auth_user_id();
  perform public._ach_ensure_settings(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'my_open_count', (
      select count(*) from public.action_items
      where tenant_id = v_tenant_id and status in ('open', 'assigned', 'in_progress')
        and (assigned_user_id is null or assigned_user_id = v_user_id)
    ),
    'critical_count', (
      select count(*) from public.action_items
      where tenant_id = v_tenant_id and priority = 'critical'
        and status not in ('completed', 'dismissed')
    ),
    'waiting_approval_count', (
      select count(*) from public.action_items
      where tenant_id = v_tenant_id and status = 'waiting_approval'
    ),
    'blocked_count', (
      select count(*) from public.action_items
      where tenant_id = v_tenant_id and status = 'blocked'
    ),
    'philosophy', 'Observe → Understand → Prioritize → Recommend → Act → Learn',
    'privacy_note', 'Actions are tenant-isolated. Users only see items relevant to their permissions.'
  );
end; $$;

create or replace function public._ach_item_json(a public.action_items)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', a.id, 'action_key', a.action_key, 'title', a.title, 'description', a.description,
    'source_module', a.source_module, 'action_type', a.action_type, 'severity', a.severity,
    'priority', a.priority, 'priority_score', a.priority_score,
    'recommended_owner', a.recommended_owner, 'recommended_due_date', a.recommended_due_date,
    'assigned_user_id', a.assigned_user_id, 'status', a.status, 'action_url', a.action_url,
    'requires_approval', a.requires_approval, 'rationale', a.rationale,
    'created_at', a.created_at, 'updated_at', a.updated_at
  );
$$;

create or replace function public.get_action_hub_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._ach_require_tenant();
  v_user_id := public._ach_auth_user_id();

  return jsonb_build_object(
    'has_customer', true,
    'my_actions', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.priority_score desc, a.created_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id
        and a.status in ('open', 'assigned', 'in_progress')
        and (a.assigned_user_id is null or a.assigned_user_id = v_user_id)
      limit 10
    ), '[]'::jsonb),
    'team_actions', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.priority_score desc, a.created_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id
        and a.status in ('assigned', 'in_progress')
        and a.assigned_user_id is not null
      limit 10
    ), '[]'::jsonb),
    'recommended_actions', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.priority_score desc, a.created_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id and a.status = 'open' and a.assigned_user_id is null
      limit 10
    ), '[]'::jsonb),
    'critical_actions', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.created_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id and a.priority = 'critical'
        and a.status not in ('completed', 'dismissed')
      limit 10
    ), '[]'::jsonb),
    'recently_completed', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.completed_at desc nulls last)
      from public.action_items a
      where a.tenant_id = v_tenant_id and a.status = 'completed'
      limit 10
    ), '[]'::jsonb),
    'blocked_items', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.updated_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id and a.status = 'blocked'
      limit 10
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_action_items(
  p_status text default null,
  p_priority text default null,
  p_source_module text default null,
  p_assigned_to_me boolean default false,
  p_limit int default 50
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._ach_require_tenant();
  v_user_id := public._ach_auth_user_id();

  return jsonb_build_object(
    'items', coalesce((
      select jsonb_agg(public._ach_item_json(a) order by a.priority_score desc, a.created_at desc)
      from public.action_items a
      where a.tenant_id = v_tenant_id
        and (p_status is null or a.status = p_status)
        and (p_priority is null or a.priority = p_priority)
        and (p_source_module is null or a.source_module = p_source_module)
        and (not p_assigned_to_me or a.assigned_user_id = v_user_id)
      limit p_limit
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.get_action_item_detail(p_action_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_item public.action_items;
begin
  v_tenant_id := public._ach_require_tenant();
  select * into v_item from public.action_items
  where id = p_action_id and tenant_id = v_tenant_id;
  if not found then return jsonb_build_object('found', false); end if;

  return jsonb_build_object(
    'found', true,
    'item', public._ach_item_json(v_item),
    'assignments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', aa.id, 'assigned_to_user_id', aa.assigned_to_user_id,
        'assigned_to_label', aa.assigned_to_label, 'note', aa.note, 'created_at', aa.created_at
      ) order by aa.created_at desc)
      from public.action_assignments aa where aa.action_item_id = v_item.id limit 20
    ), '[]'::jsonb),
    'decisions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', ad.id, 'decision_type', ad.decision_type, 'note', ad.note, 'created_at', ad.created_at
      ) order by ad.created_at desc)
      from public.action_decisions ad where ad.action_item_id = v_item.id limit 20
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Mutations
-- ---------------------------------------------------------------------------
create or replace function public.assign_action_item(
  p_action_id uuid,
  p_assignee_user_id uuid default null,
  p_assignee_label text default null,
  p_note text default ''
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._ach_require_tenant();
  v_user_id := public._ach_auth_user_id();

  update public.action_items
  set assigned_user_id = p_assignee_user_id, status = 'assigned', updated_at = now()
  where id = p_action_id and tenant_id = v_tenant_id;

  insert into public.action_assignments (
    tenant_id, action_item_id, assigned_by_user_id, assigned_to_user_id, assigned_to_label, note
  ) values (
    v_tenant_id, p_action_id, v_user_id, p_assignee_user_id, p_assignee_label, coalesce(p_note, '')
  );

  perform public._ach_log_decision(v_tenant_id, p_action_id, v_user_id, 'delegate', p_note);
  return jsonb_build_object('assigned', true);
end; $$;

create or replace function public.update_action_item_status(
  p_action_id uuid,
  p_status text,
  p_note text default ''
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_item public.action_items;
  v_decision text;
begin
  v_tenant_id := public._ach_require_tenant();
  v_user_id := public._ach_auth_user_id();
  select * into v_item from public.action_items where id = p_action_id and tenant_id = v_tenant_id;
  if not found then raise exception 'Action not found'; end if;

  if v_item.requires_approval and p_status = 'in_progress' and v_item.status = 'waiting_approval' then
    raise exception 'Approval required before starting this action';
  end if;

  update public.action_items set
    status = p_status,
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    dismissed_at = case when p_status = 'dismissed' then now() else dismissed_at end,
    updated_at = now()
  where id = p_action_id and tenant_id = v_tenant_id;

  v_decision := case p_status
    when 'completed' then 'complete'
    when 'dismissed' then 'dismiss'
    when 'blocked' then 'block'
    when 'in_progress' then 'start'
    when 'waiting_approval' then 'approve'
    else 'start'
  end;
  perform public._ach_log_decision(v_tenant_id, p_action_id, v_user_id, v_decision, p_note);
  return jsonb_build_object('updated', true, 'status', p_status);
end; $$;

create or replace function public.dismiss_action_item(p_action_id uuid, p_note text default '')
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  return public.update_action_item_status(p_action_id, 'dismissed', p_note);
end; $$;

create or replace function public.record_action_feedback(
  p_action_id uuid,
  p_feedback_type text,
  p_comment text default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._ach_require_tenant();
  v_user_id := public._ach_auth_user_id();
  if v_user_id is null then raise exception 'User not found'; end if;

  insert into public.action_feedback (tenant_id, action_item_id, user_id, feedback_type, comment)
  values (v_tenant_id, p_action_id, v_user_id, p_feedback_type, p_comment);

  return jsonb_build_object('recorded', true);
end; $$;

create or replace function public.get_action_hub_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_s public.action_settings;
begin
  v_tenant_id := public._ach_require_tenant();
  v_s := public._ach_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_s.enabled, 'auto_collect', v_s.auto_collect, 'auto_assign', v_s.auto_assign,
    'require_approval_high_risk', v_s.require_approval_high_risk,
    'include_support', v_s.include_support, 'include_quality', v_s.include_quality,
    'include_governance', v_s.include_governance, 'include_memory', v_s.include_memory,
    'include_knowledge', v_s.include_knowledge,
    'include_briefing', v_s.include_briefing, 'include_desktop', v_s.include_desktop,
    'default_owner_role', v_s.default_owner_role, 'retention_days', v_s.retention_days
  );
end; $$;

create or replace function public.update_action_hub_settings(p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ach_require_tenant();
  insert into public.action_settings (tenant_id) values (v_tenant_id) on conflict (tenant_id) do nothing;
  update public.action_settings set
    enabled = coalesce((p_settings->>'enabled')::boolean, enabled),
    auto_collect = coalesce((p_settings->>'auto_collect')::boolean, auto_collect),
    auto_assign = coalesce((p_settings->>'auto_assign')::boolean, auto_assign),
    require_approval_high_risk = coalesce((p_settings->>'require_approval_high_risk')::boolean, require_approval_high_risk),
    include_support = coalesce((p_settings->>'include_support')::boolean, include_support),
    include_quality = coalesce((p_settings->>'include_quality')::boolean, include_quality),
    include_governance = coalesce((p_settings->>'include_governance')::boolean, include_governance),
    include_memory = coalesce((p_settings->>'include_memory')::boolean, include_memory),
    include_knowledge = coalesce((p_settings->>'include_knowledge')::boolean, include_knowledge),
    include_briefing = coalesce((p_settings->>'include_briefing')::boolean, include_briefing),
    include_desktop = coalesce((p_settings->>'include_desktop')::boolean, include_desktop),
    default_owner_role = coalesce(p_settings->>'default_owner_role', default_owner_role),
    retention_days = coalesce((p_settings->>'retention_days')::int, retention_days),
    updated_at = now()
  where tenant_id = v_tenant_id;
  return public.get_action_hub_settings();
end; $$;

-- ---------------------------------------------------------------------------
-- 12. Unonight pilot seed
-- ---------------------------------------------------------------------------
create or replace function public.seed_unonight_pilot_actions()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_count int := 0;
begin
  select c.id into v_tenant_id
  from public.customers c
  join public.companies co on co.id = c.company_id
  where lower(co.slug) = 'unonight' or lower(c.name) like '%unonight%'
  limit 1;

  if v_tenant_id is null then
    return jsonb_build_object('seeded', 0, 'reason', 'unonight_tenant_not_found');
  end if;

  perform public._ach_ensure_settings(v_tenant_id);

  perform public._ach_upsert_item(
    v_tenant_id, 'action.unonight.verify.pending',
    'Review pending verifications', 'Unonight marketplace has verifications awaiting admin review.',
    'unonight', 'pilot_action', null, 'moderation', 'high', 'high', 'admin', null,
    '/app/approvals', true, 'Unonight pilot: marketplace verifications require governance approval.', '{}'::jsonb
  ); v_count := v_count + 1;

  perform public._ach_upsert_item(
    v_tenant_id, 'action.unonight.listing.approve',
    'Approve marketplace listing', 'A new Unonight listing is ready for moderation review.',
    'unonight', 'pilot_action', null, 'moderation', 'high', 'high', 'admin', null,
    '/app/approvals', true, 'Unonight pilot: listing approval workflow.', '{}'::jsonb
  ); v_count := v_count + 1;

  perform public._ach_upsert_item(
    v_tenant_id, 'action.unonight.support.draft',
    'Review support drafts', 'Support AI generated drafts that need human review before sending.',
    'support', 'pilot_action', null, 'support', 'medium', 'high', 'support_lead', null,
    '/app/support', true, 'Unonight pilot: support draft review.', '{}'::jsonb
  ); v_count := v_count + 1;

  perform public._ach_upsert_item(
    v_tenant_id, 'action.unonight.quality.alert',
    'Resolve Quality Guardian alerts', 'Frontend or image quality alerts need resolution.',
    'quality', 'pilot_action', null, 'quality', 'high', 'high', 'quality_owner', null,
    '/app/quality', false, 'Unonight pilot: quality incident follow-up.', '{}'::jsonb
  ); v_count := v_count + 1;

  perform public._ach_upsert_item(
    v_tenant_id, 'action.unonight.knowledge.gap',
    'Follow up Knowledge Gaps', 'Knowledge gaps detected for Unonight support topics.',
    'knowledge', 'pilot_action', null, 'knowledge', 'medium', 'medium', 'knowledge_owner', null,
    '/app/knowledge-center', false, 'Unonight pilot: knowledge gap follow-up.', '{}'::jsonb
  ); v_count := v_count + 1;

  return jsonb_build_object('seeded', v_count, 'tenant_id', v_tenant_id);
end; $$;

-- Grants
grant execute on function public.get_action_hub_card() to authenticated;
grant execute on function public.get_action_hub_dashboard() to authenticated;
grant execute on function public.get_action_items(text, text, text, boolean, int) to authenticated;
grant execute on function public.get_action_item_detail(uuid) to authenticated;
grant execute on function public.collect_action_recommendations(timestamptz) to authenticated;
grant execute on function public.upsert_action_items_batch(jsonb) to authenticated;
grant execute on function public.assign_action_item(uuid, uuid, text, text) to authenticated;
grant execute on function public.update_action_item_status(uuid, text, text) to authenticated;
grant execute on function public.dismiss_action_item(uuid, text) to authenticated;
grant execute on function public.record_action_feedback(uuid, text, text) to authenticated;
grant execute on function public.get_action_hub_settings() to authenticated;
grant execute on function public.update_action_hub_settings(jsonb) to authenticated;
grant execute on function public.seed_unonight_pilot_actions() to authenticated;
