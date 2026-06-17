-- Phase 343 — Companion Memory & Context Engine
-- Feature owner: CUSTOMER APP (Desktop Companion). Route: /desktop/memory. Helpers: _cmce343_*
-- Distinct from Phase 322 org-level companion_memory_records — this is user-transparent desktop context.

create table if not exists public.companion_user_memory_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  memory_enabled boolean not null default false,
  always_ask_before_remembering boolean not null default true,
  never_remember boolean not null default false,
  profile_memory_enabled boolean not null default true,
  workflow_memory_enabled boolean not null default true,
  project_memory_enabled boolean not null default true,
  companion_memory_enabled boolean not null default true,
  context_engine_enabled boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id)
);
alter table public.companion_user_memory_settings enable row level security;
revoke all on public.companion_user_memory_settings from authenticated, anon;

create table if not exists public.companion_user_memory_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  memory_key text not null default '',
  memory_category text not null check (
    memory_category in ('profile_memory', 'workflow_memory', 'project_memory', 'companion_memory')
  ),
  title text not null default '',
  summary text not null default '' check (char_length(summary) <= 500),
  what_stored text not null default '',
  why_helps text not null default '',
  how_learned text not null default '',
  source_label text not null default 'companion',
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  memory_status text not null default 'active' check (
    memory_status in ('active', 'disabled', 'archived', 'pending_approval')
  ),
  last_used_at timestamptz,
  learned_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, memory_key)
);
create index if not exists companion_user_memory_items_user_idx
  on public.companion_user_memory_items (organization_id, auth_user_id, memory_category, memory_status, last_used_at desc nulls last);
alter table public.companion_user_memory_items enable row level security;
revoke all on public.companion_user_memory_items from authenticated, anon;

create table if not exists public.companion_user_context_snapshots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  current_project text not null default '',
  current_objective text not null default '',
  recent_work_summary text not null default '',
  likely_next_task text not null default '',
  active_tasks jsonb not null default '[]'::jsonb,
  recent_activity jsonb not null default '[]'::jsonb,
  calendar_hints jsonb not null default '[]'::jsonb,
  companion_interactions jsonb not null default '[]'::jsonb,
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  snapshot_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index if not exists companion_user_context_snapshots_user_idx
  on public.companion_user_context_snapshots (organization_id, auth_user_id, snapshot_at desc);
alter table public.companion_user_context_snapshots enable row level security;
revoke all on public.companion_user_context_snapshots from authenticated, anon;

create table if not exists public.companion_project_relationships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  parent_project_key text not null default '',
  child_project_key text not null,
  child_label text not null default '',
  relationship_type text not null default 'contains' check (
    relationship_type in ('contains', 'related', 'depends_on')
  ),
  sort_order integer not null default 100,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, auth_user_id, parent_project_key, child_project_key)
);
create index if not exists companion_project_relationships_user_idx
  on public.companion_project_relationships (organization_id, auth_user_id, parent_project_key);
alter table public.companion_project_relationships enable row level security;
revoke all on public.companion_project_relationships from authenticated, anon;

create table if not exists public.companion_user_memory_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  auth_user_id uuid not null,
  memory_item_id uuid references public.companion_user_memory_items (id) on delete set null,
  event_type text not null check (
    event_type in (
      'memory_created', 'memory_edited', 'memory_deleted', 'memory_exported',
      'memory_disabled', 'memory_enabled', 'settings_updated', 'context_built'
    )
  ),
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists companion_user_memory_audit_user_idx
  on public.companion_user_memory_audit_logs (organization_id, auth_user_id, created_at desc);
alter table public.companion_user_memory_audit_logs enable row level security;
revoke all on public.companion_user_memory_audit_logs from authenticated, anon;

create or replace function public._cmce343bp_positioning() returns text language sql immutable as $$
  select 'Transparent user-approved context — Aipify remembers what helps, explains what it stores, and never hides memory from you.'; $$;

create or replace function public._cmce343_require_user()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'User context required'; end if;
  return jsonb_build_object('organization_id', v_org_id, 'auth_user_id', v_user_id);
end; $$;

create or replace function public._cmce343_log_audit(
  p_org_id uuid, p_user_id uuid, p_memory_id uuid, p_event text, p_summary text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_user_memory_audit_logs (
    organization_id, auth_user_id, memory_item_id, event_type, summary, metadata
  ) values (
    p_org_id, p_user_id, p_memory_id, p_event, left(p_summary, 500), coalesce(p_meta, '{}'::jsonb)
  );
end; $$;

create or replace function public._cmce343_ensure_settings(p_org_id uuid, p_user_id uuid)
returns public.companion_user_memory_settings language plpgsql security definer set search_path = public as $$
declare v_row public.companion_user_memory_settings;
begin
  insert into public.companion_user_memory_settings (organization_id, auth_user_id)
  values (p_org_id, p_user_id)
  on conflict (organization_id, auth_user_id) do nothing;
  select * into v_row from public.companion_user_memory_settings
  where organization_id = p_org_id and auth_user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._cmce343_seed_demo(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.companion_user_memory_items
    where organization_id = p_org_id and auth_user_id = p_user_id limit 1
  ) then return; end if;

  insert into public.companion_user_memory_items (
    organization_id, auth_user_id, memory_key, memory_category, title, summary,
    what_stored, why_helps, how_learned, source_label, confidence_level, memory_status, last_used_at
  ) values
    (p_org_id, p_user_id, 'pref_language_en', 'profile_memory', 'Preferred language',
     'English is your preferred Companion language.',
     'Language preference: English', 'Responses match your preferred language.',
     'You selected English in workspace settings.', 'profile', 'high', 'active', now() - interval '2 days'),
    (p_org_id, p_user_id, 'workflow_canva_shopify', 'workflow_memory', 'Canva to Shopify banner workflow',
     'You frequently create Shopify banners in Canva and export PNG.',
     'Tool chain: Canva → PNG export → Shopify upload', 'Speeds up repeated banner creation.',
     'Observed from three similar workflows you approved.', 'workflow', 'high', 'active', now() - interval '1 day'),
    (p_org_id, p_user_id, 'project_aipify_active', 'project_memory', 'Aipify — active project focus',
     'You often work on Aipify before other client projects.',
     'Project priority: Aipify companion and branding work', 'Helps Aipify surface the right files first.',
     'Repeated project selection over two weeks.', 'project', 'medium', 'active', now() - interval '5 hours'),
    (p_org_id, p_user_id, 'companion_pdf_export', 'companion_memory', 'Investor deck PDF preference',
     'You normally export investor presentations as PDF.',
     'Export format preference: PDF for investor decks', 'Aipify can suggest PDF when you ask to share decks.',
     'You accepted this suggestion twice.', 'companion', 'high', 'active', now() - interval '3 days')
  on conflict do nothing;

  insert into public.companion_project_relationships (
    organization_id, auth_user_id, parent_project_key, child_project_key, child_label, sort_order
  ) values
    (p_org_id, p_user_id, 'aipify', 'investor_deck', 'Investor Deck', 10),
    (p_org_id, p_user_id, 'aipify', 'branding', 'Branding', 20),
    (p_org_id, p_user_id, 'aipify', 'website', 'Website', 30),
    (p_org_id, p_user_id, 'aipify', 'companion', 'Companion', 40),
    (p_org_id, p_user_id, 'unonight', 'marketplace', 'Marketplace', 10),
    (p_org_id, p_user_id, 'unonight', 'shop', 'Shop', 20),
    (p_org_id, p_user_id, 'unonight', 'mobile_ux', 'Mobile UX', 30),
    (p_org_id, p_user_id, 'unonight', 'admin', 'Admin', 40)
  on conflict do nothing;
end; $$;

create or replace function public._cmce343_memory_health(p_org_id uuid, p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'useful_count', count(*) filter (where memory_status = 'active' and last_used_at > now() - interval '90 days'),
    'unused_count', count(*) filter (where memory_status = 'active' and (last_used_at is null or last_used_at <= now() - interval '90 days')),
    'old_count', count(*) filter (where memory_status = 'active' and learned_at < now() - interval '365 days'),
    'total_active', count(*) filter (where memory_status = 'active')
  )
  from public.companion_user_memory_items
  where organization_id = p_org_id and auth_user_id = p_user_id;
$$;

create or replace function public.get_companion_user_memory(p_search text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_user_memory_settings;
  v_health jsonb;
begin
  v_settings := public._cmce343_ensure_settings(v_org_id, v_user_id);
  if v_settings.memory_enabled then
    perform public._cmce343_seed_demo(v_org_id, v_user_id);
  end if;
  v_health := public._cmce343_memory_health(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_access', true,
    'positioning', public._cmce343bp_positioning(),
    'memory_enabled', v_settings.memory_enabled,
    'always_ask_before_remembering', v_settings.always_ask_before_remembering,
    'never_remember', v_settings.never_remember,
    'settings', jsonb_build_object(
      'profile_memory_enabled', v_settings.profile_memory_enabled,
      'workflow_memory_enabled', v_settings.workflow_memory_enabled,
      'project_memory_enabled', v_settings.project_memory_enabled,
      'companion_memory_enabled', v_settings.companion_memory_enabled,
      'context_engine_enabled', v_settings.context_engine_enabled
    ),
    'memory_health', v_health,
    'recommended_cleanup', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id, 'title', m.title, 'reason', 'This memory has not been useful recently.'
      ))
      from public.companion_user_memory_items m
      where m.organization_id = v_org_id and m.auth_user_id = v_user_id
        and m.memory_status = 'active'
        and (m.last_used_at is null or m.last_used_at < now() - interval '12 months')
      limit 5
    ), '[]'::jsonb),
    'memories', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', m.id,
        'memory_key', m.memory_key,
        'memory_category', m.memory_category,
        'title', m.title,
        'summary', m.summary,
        'what_stored', m.what_stored,
        'why_helps', m.why_helps,
        'how_learned', m.how_learned,
        'source_label', m.source_label,
        'confidence_level', m.confidence_level,
        'memory_status', m.memory_status,
        'last_used_at', coalesce(m.last_used_at::text, ''),
        'learned_at', m.learned_at::text
      ) order by m.last_used_at desc nulls last, m.learned_at desc)
      from public.companion_user_memory_items m
      where m.organization_id = v_org_id and m.auth_user_id = v_user_id
        and m.memory_status in ('active', 'disabled', 'pending_approval')
        and (p_search is null or p_search = '' or m.title ilike '%' || p_search || '%'
          or m.summary ilike '%' || p_search || '%' or m.what_stored ilike '%' || p_search || '%')
    ), '[]'::jsonb),
    'audit_logs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at::text
      ) order by a.created_at desc)
      from (
        select * from public.companion_user_memory_audit_logs
        where organization_id = v_org_id and auth_user_id = v_user_id
        order by created_at desc limit 20
      ) a
    ), '[]'::jsonb),
    'cross_link_phase322', '/app/companion/memory'
  );
end; $$;

create or replace function public.create_companion_user_memory(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_user_memory_settings;
  v_id uuid;
  v_key text;
begin
  v_settings := public._cmce343_ensure_settings(v_org_id, v_user_id);
  if v_settings.never_remember then raise exception 'Memory is disabled for this user'; end if;
  if not v_settings.memory_enabled then
    update public.companion_user_memory_settings set memory_enabled = true, updated_at = now()
    where organization_id = v_org_id and auth_user_id = v_user_id;
  end if;

  v_key := coalesce(nullif(trim(p_payload->>'memory_key'), ''), 'mem_' || left(replace(gen_random_uuid()::text, '-', ''), 12));

  insert into public.companion_user_memory_items (
    organization_id, auth_user_id, memory_key, memory_category, title, summary,
    what_stored, why_helps, how_learned, source_label, confidence_level, memory_status, last_used_at
  ) values (
    v_org_id, v_user_id, v_key,
    coalesce(p_payload->>'memory_category', 'companion_memory'),
    coalesce(p_payload->>'title', 'Memory item'),
    left(coalesce(p_payload->>'summary', ''), 500),
    coalesce(p_payload->>'what_stored', ''),
    coalesce(p_payload->>'why_helps', ''),
    coalesce(p_payload->>'how_learned', 'User approved this memory.'),
    coalesce(p_payload->>'source_label', 'companion'),
    coalesce(p_payload->>'confidence_level', 'medium'),
    case when v_settings.always_ask_before_remembering then 'pending_approval' else 'active' end,
    now()
  )
  on conflict (organization_id, auth_user_id, memory_key) do update set
    title = excluded.title,
    summary = excluded.summary,
    what_stored = excluded.what_stored,
    why_helps = excluded.why_helps,
    how_learned = excluded.how_learned,
    updated_at = now()
  returning id into v_id;

  perform public._cmce343_log_audit(v_org_id, v_user_id, v_id, 'memory_created', 'Companion memory item created', p_payload);
  return public.get_companion_user_memory(null);
end; $$;

create or replace function public.update_companion_user_memory_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cmce343_ensure_settings(v_org_id, v_user_id);
  update public.companion_user_memory_settings set
    memory_enabled = coalesce((p_patch->>'memory_enabled')::boolean, memory_enabled),
    always_ask_before_remembering = coalesce((p_patch->>'always_ask_before_remembering')::boolean, always_ask_before_remembering),
    never_remember = coalesce((p_patch->>'never_remember')::boolean, never_remember),
    profile_memory_enabled = coalesce((p_patch->>'profile_memory_enabled')::boolean, profile_memory_enabled),
    workflow_memory_enabled = coalesce((p_patch->>'workflow_memory_enabled')::boolean, workflow_memory_enabled),
    project_memory_enabled = coalesce((p_patch->>'project_memory_enabled')::boolean, project_memory_enabled),
    companion_memory_enabled = coalesce((p_patch->>'companion_memory_enabled')::boolean, companion_memory_enabled),
    context_engine_enabled = coalesce((p_patch->>'context_engine_enabled')::boolean, context_engine_enabled),
    updated_at = now()
  where organization_id = v_org_id and auth_user_id = v_user_id;
  perform public._cmce343_log_audit(v_org_id, v_user_id, null, 'settings_updated', 'Memory settings updated', p_patch);
  return public.get_companion_user_memory(null);
end; $$;

grant execute on function public.update_companion_user_memory_settings(jsonb) to authenticated;

create or replace function public.update_companion_user_memory(p_memory_id uuid, p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  update public.companion_user_memory_items set
    title = coalesce(p_patch->>'title', title),
    summary = coalesce(left(p_patch->>'summary', 500), summary),
    what_stored = coalesce(p_patch->>'what_stored', what_stored),
    why_helps = coalesce(p_patch->>'why_helps', why_helps),
    memory_status = coalesce(p_patch->>'memory_status', memory_status),
    last_used_at = case when p_patch ? 'touch' then now() else last_used_at end,
    updated_at = now()
  where id = p_memory_id and organization_id = v_org_id and auth_user_id = v_user_id;

  if p_patch ? 'memory_enabled' then
    update public.companion_user_memory_settings set
      memory_enabled = (p_patch->>'memory_enabled')::boolean,
      always_ask_before_remembering = coalesce((p_patch->>'always_ask_before_remembering')::boolean, always_ask_before_remembering),
      never_remember = coalesce((p_patch->>'never_remember')::boolean, never_remember),
      profile_memory_enabled = coalesce((p_patch->>'profile_memory_enabled')::boolean, profile_memory_enabled),
      workflow_memory_enabled = coalesce((p_patch->>'workflow_memory_enabled')::boolean, workflow_memory_enabled),
      project_memory_enabled = coalesce((p_patch->>'project_memory_enabled')::boolean, project_memory_enabled),
      companion_memory_enabled = coalesce((p_patch->>'companion_memory_enabled')::boolean, companion_memory_enabled),
      context_engine_enabled = coalesce((p_patch->>'context_engine_enabled')::boolean, context_engine_enabled),
      updated_at = now()
    where organization_id = v_org_id and auth_user_id = v_user_id;
    perform public._cmce343_log_audit(v_org_id, v_user_id, p_memory_id, 'settings_updated', 'Memory settings updated', p_patch);
  else
    perform public._cmce343_log_audit(v_org_id, v_user_id, p_memory_id, 'memory_edited', 'Companion memory item updated', p_patch);
  end if;

  return public.get_companion_user_memory(null);
end; $$;

create or replace function public.delete_companion_user_memory(p_memory_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cmce343_log_audit(v_org_id, v_user_id, p_memory_id, 'memory_deleted', 'Companion memory item deleted', '{}'::jsonb);
  delete from public.companion_user_memory_items
  where id = p_memory_id and organization_id = v_org_id and auth_user_id = v_user_id;
  return public.get_companion_user_memory(null);
end; $$;

create or replace function public.export_companion_user_memory()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_export jsonb;
begin
  select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) into v_export
  from public.companion_user_memory_items m
  where m.organization_id = v_org_id and m.auth_user_id = v_user_id;

  perform public._cmce343_log_audit(v_org_id, v_user_id, null, 'memory_exported', 'Companion memory exported', jsonb_build_object('count', jsonb_array_length(v_export)));
  return jsonb_build_object('exported_at', now()::text, 'memories', v_export);
end; $$;

create or replace function public.get_companion_user_context()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
  v_settings public.companion_user_memory_settings;
  v_project text;
  v_insights jsonb;
begin
  v_settings := public._cmce343_ensure_settings(v_org_id, v_user_id);
  if not v_settings.memory_enabled or not v_settings.context_engine_enabled then
    return jsonb_build_object(
      'has_access', true,
      'context_enabled', false,
      'message', 'Enable Memory to build workspace context.',
      'empty_state', true
    );
  end if;

  perform public._cmce343_seed_demo(v_org_id, v_user_id);

  select coalesce(
    (select title from public.companion_user_memory_items
     where organization_id = v_org_id and auth_user_id = v_user_id
       and memory_category = 'project_memory' and memory_status = 'active'
     order by last_used_at desc nulls last limit 1),
    'Aipify'
  ) into v_project;

  v_insights := coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', 'insight_' || row_number() over (),
      'message', insight,
      'confidence_level', conf
    ))
    from (values
      ('Three active files appear related to ' || v_project || '.', 'medium'),
      ('You recently worked on investor presentation materials.', 'high'),
      ('This project may benefit from updated brand documentation.', 'low')
    ) as t(insight, conf)
  ), '[]'::jsonb);

  insert into public.companion_user_context_snapshots (
    organization_id, auth_user_id, current_project, current_objective,
    recent_work_summary, likely_next_task, confidence_level
  ) values (
    v_org_id, v_user_id, v_project,
    'Continue companion memory and desktop experience work',
    'Recent focus on branding, investor materials, and workflow preferences.',
    'Review presentation exports and brand assets',
    'medium'
  );

  perform public._cmce343_log_audit(v_org_id, v_user_id, null, 'context_built', 'Companion context snapshot built', '{}'::jsonb);

  return jsonb_build_object(
    'has_access', true,
    'context_enabled', true,
    'current_project', v_project,
    'current_objective', 'Continue companion memory and desktop experience work',
    'recent_work_summary', 'Recent focus on branding, investor materials, and workflow preferences.',
    'likely_next_task', 'Review presentation exports and brand assets',
    'confidence_level', 'medium',
    'active_projects_count', (select count(distinct parent_project_key) from public.companion_project_relationships where organization_id = v_org_id and auth_user_id = v_user_id),
    'pending_tasks_count', 2,
    'attention_projects_count', 1,
    'recommended_focus', 'Aipify Desktop Companion',
    'briefing', jsonb_build_object(
      'greeting', 'Good morning.',
      'active_projects', 3,
      'pending_tasks', 2,
      'attention_projects', 1,
      'recommended_focus', 'Aipify Desktop Companion'
    ),
    'insights', v_insights,
    'workspace_health', jsonb_build_object(
      'label', 'Good',
      'score_pct', 78,
      'factors', jsonb_build_array('Organization', 'Project activity', 'Task completion', 'Workspace structure')
    ),
    'priorities', jsonb_build_array(
      jsonb_build_object('level', 'highest', 'title', 'Aipify Desktop Companion', 'reason', 'Active project with recent work'),
      jsonb_build_object('level', 'important', 'title', 'Investor Deck refresh', 'reason', 'Related files recently edited'),
      jsonb_build_object('level', 'later', 'title', 'Unonight marketplace review', 'reason', 'Scheduled for next week')
    ),
    'timeline', jsonb_build_array(
      jsonb_build_object('period', 'Yesterday', 'summary', 'Edited branding assets and reviewed Canva exports'),
      jsonb_build_object('period', 'Last week', 'summary', 'Worked on companion memory specifications'),
      jsonb_build_object('period', 'Last month', 'summary', 'Organized Aipify and Unonight project folders')
    )
  );
end; $$;

create or replace function public.get_companion_project_relationships()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_ctx jsonb := public._cmce343_require_user();
  v_org_id uuid := (v_ctx->>'organization_id')::uuid;
  v_user_id uuid := (v_ctx->>'auth_user_id')::uuid;
begin
  perform public._cmce343_ensure_settings(v_org_id, v_user_id);
  perform public._cmce343_seed_demo(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_access', true,
    'workspace_map', coalesce((
      select jsonb_agg(jsonb_build_object(
        'project_key', r.parent_project_key,
        'project_label', initcap(replace(r.parent_project_key, '_', ' ')),
        'children', (
          select jsonb_agg(jsonb_build_object(
            'project_key', c.child_project_key,
            'label', c.child_label,
            'relationship_type', c.relationship_type
          ) order by c.sort_order)
          from public.companion_project_relationships c
          where c.organization_id = v_org_id and c.auth_user_id = v_user_id
            and c.parent_project_key = r.parent_project_key
        )
      ) order by r.parent_project_key)
      from (
        select distinct parent_project_key
        from public.companion_project_relationships
        where organization_id = v_org_id and auth_user_id = v_user_id
      ) r
    ), '[]'::jsonb)
  );
end; $$;

grant execute on function public.get_companion_user_memory(text) to authenticated;
grant execute on function public.create_companion_user_memory(jsonb) to authenticated;
grant execute on function public.update_companion_user_memory(uuid, jsonb) to authenticated;
grant execute on function public.delete_companion_user_memory(uuid) to authenticated;
grant execute on function public.export_companion_user_memory() to authenticated;
grant execute on function public.get_companion_user_context() to authenticated;
grant execute on function public.get_companion_project_relationships() to authenticated;
