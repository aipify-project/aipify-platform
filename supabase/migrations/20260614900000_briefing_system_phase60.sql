-- Phase 60 — Since Last Login & Executive Briefing System

-- ---------------------------------------------------------------------------
-- 1. aipify_user_activity_state
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_user_activity_state (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  last_login_at timestamptz,
  last_seen_at timestamptz,
  last_brief_viewed_at timestamptz,
  last_daily_brief_sent_at timestamptz,
  preferred_brief_time text,
  preferred_language text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.aipify_user_activity_state enable row level security;
revoke all on public.aipify_user_activity_state from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. aipify_briefing_events
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_briefing_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  source_module text not null,
  source_type text not null,
  source_id uuid,
  event_key text not null,
  title text not null,
  summary text,
  severity text not null default 'info' check (
    severity in ('info', 'low', 'medium', 'high', 'critical')
  ),
  priority_score int not null default 0,
  requires_action boolean not null default false,
  action_url text,
  assigned_user_id uuid references public.users (id) on delete set null,
  assigned_role text,
  visibility text not null default 'admin' check (
    visibility in ('owner', 'admin', 'manager', 'support', 'staff', 'developer', 'all_authorized')
  ),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, event_key)
);

create index if not exists aipify_briefing_events_tenant_occurred_idx
  on public.aipify_briefing_events (tenant_id, occurred_at desc);

alter table public.aipify_briefing_events enable row level security;
revoke all on public.aipify_briefing_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. aipify_briefing_summaries
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_briefing_summaries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  brief_type text not null check (
    brief_type in ('since_last_login', 'daily_command_brief', 'executive_brief', 'operational_brief', 'weekly_summary')
  ),
  period_start timestamptz not null,
  period_end timestamptz not null,
  title text not null,
  greeting text,
  summary text not null,
  key_items jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  status text not null default 'generated' check (
    status in ('generated', 'viewed', 'dismissed', 'archived')
  ),
  language text not null default 'en',
  generated_by text not null default 'aipify',
  generated_at timestamptz not null default now(),
  viewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists aipify_briefing_summaries_tenant_idx
  on public.aipify_briefing_summaries (tenant_id, brief_type, generated_at desc);

alter table public.aipify_briefing_summaries enable row level security;
revoke all on public.aipify_briefing_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. aipify_briefing_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_briefing_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  role_key text,
  brief_frequency text not null default 'on_login' check (
    brief_frequency in ('on_login', 'daily', 'weekly', 'manual', 'disabled')
  ),
  delivery_channels text[] not null default '{dashboard}',
  include_modules text[] not null default '{}',
  exclude_modules text[] not null default '{}',
  max_items int not null default 7,
  language text,
  quiet_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists aipify_briefing_preferences_user_idx
  on public.aipify_briefing_preferences (tenant_id, user_id) where user_id is not null;

alter table public.aipify_briefing_preferences enable row level security;
revoke all on public.aipify_briefing_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. aipify_briefing_actions
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_briefing_actions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  briefing_summary_id uuid not null references public.aipify_briefing_summaries (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  action_type text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.aipify_briefing_actions enable row level security;
revoke all on public.aipify_briefing_actions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. aipify_briefing_settings
-- ---------------------------------------------------------------------------
create table if not exists public.aipify_briefing_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  since_last_login_enabled boolean not null default true,
  daily_brief_enabled boolean not null default true,
  executive_brief_enabled boolean not null default true,
  operational_brief_enabled boolean not null default true,
  default_daily_time text not null default '08:00',
  default_timezone text not null default 'Europe/Oslo',
  max_default_items int not null default 7,
  include_quality boolean not null default true,
  include_support boolean not null default true,
  include_knowledge boolean not null default true,
  include_governance boolean not null default true,
  include_automation boolean not null default true,
  include_insights boolean not null default true,
  include_integrations boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.aipify_briefing_settings enable row level security;
revoke all on public.aipify_briefing_settings from authenticated, anon;

-- Fix revoke on summaries (typo guard)
revoke all on public.aipify_briefing_summaries from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._bs_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._bs_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bs_ensure_settings(p_tenant_id uuid)
returns public.aipify_briefing_settings language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_briefing_settings;
begin
  insert into public.aipify_briefing_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.aipify_briefing_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._bs_ensure_activity(p_tenant_id uuid, p_user_id uuid)
returns public.aipify_user_activity_state language plpgsql security definer set search_path = public as $$
declare v_row public.aipify_user_activity_state;
begin
  insert into public.aipify_user_activity_state (tenant_id, user_id, last_seen_at)
  values (p_tenant_id, p_user_id, now())
  on conflict (tenant_id, user_id) do update set last_seen_at = now(), updated_at = now();
  select * into v_row from public.aipify_user_activity_state
  where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._bs_priority_score(p_severity text, p_requires_action boolean default false)
returns int language sql immutable as $$
  select (
    case p_severity
      when 'critical' then 100
      when 'high' then 75
      when 'medium' then 50
      when 'low' then 25
      else 10
    end
  ) + case when p_requires_action then 20 else 0 end;
$$;

create or replace function public._bs_upsert_event(
  p_tenant_id uuid,
  p_source_module text,
  p_source_type text,
  p_source_id uuid,
  p_event_key text,
  p_title text,
  p_summary text,
  p_severity text,
  p_requires_action boolean,
  p_action_url text,
  p_occurred_at timestamptz,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.aipify_briefing_events (
    tenant_id, source_module, source_type, source_id, event_key, title, summary,
    severity, priority_score, requires_action, action_url, occurred_at, metadata
  ) values (
    p_tenant_id, p_source_module, p_source_type, p_source_id, p_event_key, p_title, p_summary,
    coalesce(p_severity, 'info'), public._bs_priority_score(p_severity, p_requires_action),
    coalesce(p_requires_action, false), p_action_url, coalesce(p_occurred_at, now()), coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (tenant_id, event_key) do update set
    title = excluded.title, summary = excluded.summary, severity = excluded.severity,
    priority_score = excluded.priority_score, requires_action = excluded.requires_action,
    action_url = excluded.action_url, occurred_at = excluded.occurred_at, metadata = excluded.metadata;
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Collect events from modules
-- ---------------------------------------------------------------------------
create or replace function public.upsert_briefing_events_batch(p_events jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_item jsonb; v_count int := 0;
begin
  v_tenant_id := public._bs_require_tenant();
  for v_item in select * from jsonb_array_elements(coalesce(p_events, '[]'::jsonb))
  loop
    perform public._bs_upsert_event(
      v_tenant_id,
      v_item->>'source_module', v_item->>'source_type',
      nullif(v_item->>'source_id', '')::uuid,
      v_item->>'event_key', v_item->>'title', v_item->>'summary',
      coalesce(v_item->>'severity', 'info'),
      coalesce((v_item->>'requires_action')::boolean, false),
      v_item->>'action_url',
      coalesce((v_item->>'occurred_at')::timestamptz, now()),
      coalesce(v_item->'metadata', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('upserted', v_count);
end; $$;

create or replace function public.collect_briefing_events(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_since timestamptz;
  v_settings public.aipify_briefing_settings;
  v_count int := 0;
  r record;
begin
  v_tenant_id := public._bs_require_tenant();
  v_settings := public._bs_ensure_settings(v_tenant_id);
  v_since := coalesce(p_since, now() - interval '7 days');

  if v_settings.include_quality then
    for r in
      select id, incident_key, title, severity, category, observed_behavior, created_at
      from public.aipify_quality_incidents
      where tenant_id = v_tenant_id and status in ('open', 'investigating')
        and created_at >= v_since
    loop
      perform public._bs_upsert_event(
        v_tenant_id, 'quality', 'quality_incident', r.id,
        'briefing.quality.' || r.incident_key, r.title, r.observed_behavior, r.severity,
        r.severity in ('high', 'critical'), '/app/quality/incidents', r.created_at,
        jsonb_build_object('category', r.category)
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_knowledge then
    for r in
      select id, question, status, created_at
      from public.aipify_knowledge_gaps
      where tenant_id = v_tenant_id and status in ('open', 'pending')
        and created_at >= v_since
    loop
      perform public._bs_upsert_event(
        v_tenant_id, 'knowledge', 'knowledge_gap', r.id,
        'briefing.knowledge.gap.' || r.id::text, 'Knowledge gap opened',
        left(r.question, 200), 'medium', true, '/app/knowledge-center/gaps', r.created_at, '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_governance then
    for r in
      select id, title, risk_level, status, created_at
      from public.aipify_approval_requests
      where tenant_id = v_tenant_id and status = 'pending'
        and created_at >= v_since
    loop
      perform public._bs_upsert_event(
        v_tenant_id, 'governance', 'approval_request', r.id,
        'briefing.governance.approval.' || r.id::text, 'Approval pending: ' || r.title,
        'Requires admin review', coalesce(r.risk_level, 'medium'), true, '/app/approvals', r.created_at, '{}'::jsonb
      );
      v_count := v_count + 1;
    end loop;
  end if;

  for r in
    select id, event_type, summary, created_at
    from public.aipify_tenant_pilot_events
    where tenant_id = v_tenant_id and created_at >= v_since
    limit 50
  loop
    perform public._bs_upsert_event(
      v_tenant_id, 'unonight', 'pilot_event', r.id,
      'briefing.unonight.' || r.id::text, coalesce(r.event_type, 'Pilot update'),
      coalesce(r.summary, ''), 'medium', false, '/platform/customers', r.created_at, '{}'::jsonb
    );
    v_count := v_count + 1;
  end loop;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'briefing_events_collected', 'briefing', 'success', null,
    jsonb_build_object('count', v_count, 'since', v_since));

  return jsonb_build_object('collected', v_count, 'since', v_since);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Generate brief
-- ---------------------------------------------------------------------------
create or replace function public._bs_generate_brief(
  p_tenant_id uuid,
  p_user_id uuid,
  p_brief_type text,
  p_since timestamptz,
  p_language text default 'en'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_settings public.aipify_briefing_settings;
  v_user_name text;
  v_greeting text;
  v_items jsonb;
  v_actions jsonb;
  v_summary text;
  v_rec text;
  v_id uuid;
  v_crit int; v_high int; v_action int; v_stable int;
  v_max int;
begin
  v_settings := public._bs_ensure_settings(p_tenant_id);
  v_max := least(greatest(v_settings.max_default_items, 3), 12);

  select full_name into v_user_name from public.users where id = p_user_id;
  v_greeting := case
    when extract(hour from now() at time zone v_settings.default_timezone) < 12 then 'Good morning'
    when extract(hour from now() at time zone v_settings.default_timezone) < 18 then 'Good afternoon'
    else 'Good evening'
  end || coalesce(', ' || v_user_name, '');

  perform public.collect_briefing_events(p_since);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'title', e.title, 'summary', e.summary, 'severity', e.severity,
    'requires_action', e.requires_action, 'action_url', e.action_url,
    'source_module', e.source_module, 'icon', case e.severity
      when 'critical' then 'alert' when 'high' then 'warning' when 'medium' then 'warning'
      when 'low' then 'info' else 'check' end
  ) order by e.priority_score desc, e.occurred_at desc), '[]'::jsonb)
  into v_items
  from (
    select * from public.aipify_briefing_events
    where tenant_id = p_tenant_id and occurred_at >= p_since
    order by priority_score desc, occurred_at desc limit v_max
  ) e;

  select
    count(*) filter (where severity = 'critical'),
    count(*) filter (where severity = 'high'),
    count(*) filter (where requires_action),
    count(*) filter (where severity in ('info', 'low'))
  into v_crit, v_high, v_action, v_stable
  from public.aipify_briefing_events
  where tenant_id = p_tenant_id and occurred_at >= p_since;

  if v_crit > 0 then
    v_rec := 'Review critical incidents first.';
  elsif v_action > 0 then
    v_rec := 'Review pending approvals and items requiring action.';
  elsif v_high > 0 then
    v_rec := 'Address high-priority quality and integration items.';
  else
    v_rec := 'No urgent actions — review the full activity timeline when convenient.';
  end if;

  v_summary := format(
    '%s item(s) need attention. %s critical. %s high priority.',
    v_action, v_crit, v_high
  );
  if v_crit = 0 and v_action = 0 then
    v_summary := 'Everything looks stable. No critical issues detected.';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'label', e.title, 'url', e.action_url, 'severity', e.severity
  ) order by e.priority_score desc), '[]'::jsonb)
  into v_actions
  from (
    select * from public.aipify_briefing_events
    where tenant_id = p_tenant_id and occurred_at >= p_since and requires_action
    order by priority_score desc limit 3
  ) e;

  insert into public.aipify_briefing_summaries (
    tenant_id, user_id, brief_type, period_start, period_end, title, greeting, summary,
    key_items, recommended_actions, metrics, language
  ) values (
    p_tenant_id, p_user_id, p_brief_type, p_since, now(),
    case p_brief_type
      when 'since_last_login' then 'Since Last Login'
      when 'daily_command_brief' then 'Daily Command Brief'
      else 'Aipify Briefing'
    end,
    v_greeting, v_summary, v_items,
    jsonb_build_array(jsonb_build_object('label', v_rec, 'url', '/app/briefing')),
    jsonb_build_object('critical', v_crit, 'high', v_high, 'requires_action', v_action, 'stable', v_stable),
    p_language
  ) returning id into v_id;

  return jsonb_build_object(
    'summary_id', v_id, 'greeting', v_greeting, 'summary', v_summary,
    'key_items', v_items, 'recommended_actions', v_actions,
    'recommended_next_step', v_rec,
    'metrics', jsonb_build_object('critical', v_crit, 'high', v_high, 'requires_action', v_action),
    'period_start', p_since, 'period_end', now()
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public._bs_preview_brief(
  p_tenant_id uuid,
  p_since timestamptz,
  p_max int default 7
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_items jsonb; v_crit int; v_high int; v_action int; v_rec text; v_summary text;
begin
  perform public.collect_briefing_events(p_since);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'title', e.title, 'summary', e.summary, 'severity', e.severity,
    'requires_action', e.requires_action, 'action_url', e.action_url,
    'source_module', e.source_module, 'icon', case e.severity
      when 'critical' then 'alert' when 'high' then 'warning' when 'medium' then 'warning'
      when 'low' then 'info' else 'check' end
  ) order by e.priority_score desc), '[]'::jsonb)
  into v_items
  from (
    select * from public.aipify_briefing_events
    where tenant_id = p_tenant_id and occurred_at >= p_since
    order by priority_score desc limit p_max
  ) e;

  select
    count(*) filter (where severity = 'critical'),
    count(*) filter (where severity = 'high'),
    count(*) filter (where requires_action)
  into v_crit, v_high, v_action
  from public.aipify_briefing_events
  where tenant_id = p_tenant_id and occurred_at >= p_since;

  if v_crit > 0 then v_rec := 'Review critical incidents first.';
  elsif v_action > 0 then v_rec := 'Review pending approvals and items requiring action.';
  elsif v_high > 0 then v_rec := 'Address high-priority quality and integration items.';
  else v_rec := 'No urgent actions — everything looks stable.';
  end if;

  v_summary := case when v_crit = 0 and v_action = 0
    then 'Everything looks stable. No critical issues detected.'
    else format('%s item(s) need attention. %s critical.', v_action, v_crit)
  end;

  return jsonb_build_object(
    'summary', v_summary, 'key_items', v_items, 'recommended_next_step', v_rec,
    'metrics', jsonb_build_object('critical', v_crit, 'high', v_high, 'requires_action', v_action)
  );
end; $$;

create or replace function public.get_briefing_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid; v_user_id uuid; v_activity public.aipify_user_activity_state;
  v_settings public.aipify_briefing_settings; v_since timestamptz; v_brief jsonb;
  v_user_name text; v_greeting text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_user_id := public._bs_auth_user_id();
  v_settings := public._bs_ensure_settings(v_tenant_id);
  if not v_settings.enabled then
    return jsonb_build_object('has_customer', true, 'enabled', false);
  end if;
  if v_user_id is not null then
    v_activity := public._bs_ensure_activity(v_tenant_id, v_user_id);
    select full_name into v_user_name from public.users where id = v_user_id;
  end if;
  select coalesce(last_brief_viewed_at, last_login_at, now() - interval '24 hours')
  into v_since from public.aipify_user_activity_state
  where tenant_id = v_tenant_id and user_id = v_user_id;
  v_since := coalesce(v_since, now() - interval '24 hours');
  v_brief := public._bs_preview_brief(v_tenant_id, v_since, v_settings.max_default_items);
  v_greeting := case
    when extract(hour from now() at time zone v_settings.default_timezone) < 12 then 'Good morning'
    when extract(hour from now() at time zone v_settings.default_timezone) < 18 then 'Good afternoon'
    else 'Good evening'
  end || coalesce(', ' || v_user_name, '');
  return jsonb_build_object(
    'has_customer', true, 'enabled', true, 'greeting', v_greeting,
    'summary', v_brief ->> 'summary', 'key_items', v_brief -> 'key_items',
    'recommended_next_step', v_brief ->> 'recommended_next_step', 'metrics', v_brief -> 'metrics',
    'period_start', v_since,
    'privacy_note', 'Briefings summarize verified module activity only — calm, prioritized, permission-safe.'
  );
end; $$;

create or replace function public.get_briefing_since_last_login()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_since timestamptz;
begin
  v_tenant_id := public._bs_require_tenant();
  v_user_id := public._bs_auth_user_id();
  if v_user_id is not null then perform public._bs_ensure_activity(v_tenant_id, v_user_id); end if;
  select coalesce(last_brief_viewed_at, last_login_at, now() - interval '7 days')
  into v_since from public.aipify_user_activity_state
  where tenant_id = v_tenant_id and user_id = v_user_id;
  v_since := coalesce(v_since, now() - interval '7 days');
  return public._bs_generate_brief(v_tenant_id, v_user_id, 'since_last_login', v_since, 'en')
    || jsonb_build_object('has_customer', true, 'period_start', v_since);
end; $$;

create or replace function public.generate_briefing_since_last_login()
returns jsonb language plpgsql security definer set search_path = public as $$
begin return public.get_briefing_since_last_login(); end; $$;

create or replace function public.mark_briefing_viewed(p_summary_id uuid default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._bs_require_tenant();
  v_user_id := public._bs_auth_user_id();
  if v_user_id is not null then
    update public.aipify_user_activity_state set
      last_brief_viewed_at = now(), updated_at = now()
    where tenant_id = v_tenant_id and user_id = v_user_id;
  end if;
  if p_summary_id is not null then
    update public.aipify_briefing_summaries set status = 'viewed', viewed_at = now()
    where id = p_summary_id and tenant_id = v_tenant_id;
  end if;
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.generate_briefing_daily()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_settings public.aipify_briefing_settings;
begin
  v_tenant_id := public._bs_require_tenant();
  v_user_id := public._bs_auth_user_id();
  v_settings := public._bs_ensure_settings(v_tenant_id);
  return public._bs_generate_brief(v_tenant_id, v_user_id, 'daily_command_brief',
    (now() at time zone v_settings.default_timezone)::date::timestamptz, 'en')
    || jsonb_build_object('has_customer', true);
end; $$;

create or replace function public.get_briefing_summaries(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._bs_require_tenant();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', s.id, 'brief_type', s.brief_type, 'title', s.title, 'summary', s.summary,
    'greeting', s.greeting, 'status', s.status, 'generated_at', s.generated_at
  ) order by s.generated_at desc) from (
    select * from public.aipify_briefing_summaries
    where tenant_id = v_tenant_id order by generated_at desc limit greatest(1, least(p_limit, 100))
  ) s), '[]'::jsonb);
end; $$;

create or replace function public.get_briefing_events(p_since timestamptz default null, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._bs_require_tenant();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', e.id, 'source_module', e.source_module, 'source_type', e.source_type,
    'title', e.title, 'summary', e.summary, 'severity', e.severity,
    'requires_action', e.requires_action, 'action_url', e.action_url, 'occurred_at', e.occurred_at
  ) order by e.priority_score desc) from (
    select * from public.aipify_briefing_events
    where tenant_id = v_tenant_id
      and occurred_at >= coalesce(p_since, now() - interval '7 days')
    order by priority_score desc limit greatest(1, least(p_limit, 200))
  ) e), '[]'::jsonb);
end; $$;

create or replace function public.get_briefing_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.aipify_briefing_settings;
begin
  v_tenant_id := public._bs_require_tenant();
  v_row := public._bs_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_row.enabled, 'since_last_login_enabled', v_row.since_last_login_enabled,
    'daily_brief_enabled', v_row.daily_brief_enabled,
    'executive_brief_enabled', v_row.executive_brief_enabled,
    'operational_brief_enabled', v_row.operational_brief_enabled,
    'default_daily_time', v_row.default_daily_time, 'default_timezone', v_row.default_timezone,
    'max_default_items', v_row.max_default_items,
    'include_quality', v_row.include_quality, 'include_support', v_row.include_support,
    'include_knowledge', v_row.include_knowledge, 'include_governance', v_row.include_governance,
    'include_automation', v_row.include_automation, 'include_insights', v_row.include_insights,
    'include_integrations', v_row.include_integrations
  );
end; $$;

create or replace function public.update_briefing_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._bs_require_tenant();
  perform public._bs_ensure_settings(v_tenant_id);
  update public.aipify_briefing_settings set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    since_last_login_enabled = coalesce((p_patch->>'since_last_login_enabled')::boolean, since_last_login_enabled),
    daily_brief_enabled = coalesce((p_patch->>'daily_brief_enabled')::boolean, daily_brief_enabled),
    default_daily_time = coalesce(p_patch->>'default_daily_time', default_daily_time),
    default_timezone = coalesce(p_patch->>'default_timezone', default_timezone),
    max_default_items = coalesce((p_patch->>'max_default_items')::int, max_default_items),
    include_quality = coalesce((p_patch->>'include_quality')::boolean, include_quality),
    include_knowledge = coalesce((p_patch->>'include_knowledge')::boolean, include_knowledge),
    include_governance = coalesce((p_patch->>'include_governance')::boolean, include_governance),
    include_support = coalesce((p_patch->>'include_support')::boolean, include_support),
    include_automation = coalesce((p_patch->>'include_automation')::boolean, include_automation),
    include_insights = coalesce((p_patch->>'include_insights')::boolean, include_insights),
    include_integrations = coalesce((p_patch->>'include_integrations')::boolean, include_integrations),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'briefing_settings_updated', 'briefing', 'success', null, p_patch);
  return public.get_briefing_settings();
end; $$;

create or replace function public.record_briefing_action(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._bs_require_tenant();
  v_user_id := public._bs_auth_user_id();
  if v_user_id is null then raise exception 'User required'; end if;
  insert into public.aipify_briefing_actions (
    tenant_id, briefing_summary_id, user_id, action_type, target_type, target_id, metadata
  ) values (
    v_tenant_id, (p_patch->>'briefing_summary_id')::uuid, v_user_id,
    p_patch->>'action_type', p_patch->>'target_type',
    nullif(p_patch->>'target_id', '')::uuid, coalesce(p_patch->'metadata', '{}'::jsonb)
  ) returning id into v_id;
  return jsonb_build_object('action_id', v_id);
end; $$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'briefing-daily-summary', 'Briefing & Daily Summary', 'Since Last Login and Daily Command Brief', 'authenticated', 99
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'briefing-daily-summary' and tenant_id is null);

-- Grants
grant execute on function public.get_briefing_card() to authenticated;
grant execute on function public.get_briefing_since_last_login() to authenticated;
grant execute on function public.generate_briefing_since_last_login() to authenticated;
grant execute on function public.mark_briefing_viewed(uuid) to authenticated;
grant execute on function public.generate_briefing_daily() to authenticated;
grant execute on function public.get_briefing_summaries(int) to authenticated;
grant execute on function public.get_briefing_events(timestamptz, int) to authenticated;
grant execute on function public.collect_briefing_events(timestamptz) to authenticated;
grant execute on function public.upsert_briefing_events_batch(jsonb) to authenticated;
grant execute on function public.get_briefing_settings() to authenticated;
grant execute on function public.update_briefing_settings(jsonb) to authenticated;
grant execute on function public.record_briefing_action(jsonb) to authenticated;
