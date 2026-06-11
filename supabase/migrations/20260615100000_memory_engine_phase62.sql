-- Phase 62 — Memory Engine & Organizational Context System

-- ---------------------------------------------------------------------------
-- 1. memory_settings (tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.memory_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  auto_learn boolean not null default true,
  include_user_preferences boolean not null default true,
  include_team_patterns boolean not null default true,
  include_tenant_rules boolean not null default true,
  explainability_required boolean not null default true,
  governance_review_required boolean not null default false,
  retention_days int not null default 365,
  excluded_categories text[] not null default '{password,secret,payment,health}',
  max_profiles_per_user int not null default 50,
  max_patterns int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memory_settings enable row level security;
revoke all on public.memory_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. memory_profiles (user / team / tenant scope)
-- ---------------------------------------------------------------------------
create table if not exists public.memory_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  scope_level text not null default 'user' check (
    scope_level in ('user', 'team', 'tenant')
  ),
  profile_key text not null,
  profile_value jsonb not null default '{}'::jsonb,
  explanation text,
  source_module text not null default 'memory',
  confidence numeric(4,3) not null default 0.5 check (confidence >= 0 and confidence <= 1),
  last_observed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id, scope_level, profile_key)
);

create index if not exists memory_profiles_tenant_idx
  on public.memory_profiles (tenant_id, scope_level, last_observed_at desc);

alter table public.memory_profiles enable row level security;
revoke all on public.memory_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. memory_observations (raw observed signals — sanitized)
-- ---------------------------------------------------------------------------
create table if not exists public.memory_observations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  source_module text not null,
  source_type text not null,
  observation_key text not null,
  summary text not null,
  scope_level text not null default 'user' check (
    scope_level in ('user', 'team', 'tenant')
  ),
  metadata jsonb not null default '{}'::jsonb,
  observed_at timestamptz not null default now(),
  processed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (tenant_id, observation_key)
);

create index if not exists memory_observations_tenant_idx
  on public.memory_observations (tenant_id, observed_at desc);

alter table public.memory_observations enable row level security;
revoke all on public.memory_observations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. memory_patterns
-- ---------------------------------------------------------------------------
create table if not exists public.memory_patterns (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scope_level text not null default 'tenant' check (
    scope_level in ('user', 'team', 'tenant')
  ),
  pattern_type text not null,
  pattern_key text not null,
  title text not null,
  description text not null default '',
  frequency_count int not null default 1,
  confidence numeric(4,3) not null default 0.5,
  explanation text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (tenant_id, pattern_key)
);

create index if not exists memory_patterns_tenant_idx
  on public.memory_patterns (tenant_id, last_seen_at desc);

alter table public.memory_patterns enable row level security;
revoke all on public.memory_patterns from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. memory_recommendations
-- ---------------------------------------------------------------------------
create table if not exists public.memory_recommendations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  recommendation_type text not null default 'workflow',
  title text not null,
  summary text not null default '',
  rationale text not null default '',
  action_url text,
  source_pattern_id uuid references public.memory_patterns (id) on delete set null,
  priority_score int not null default 0,
  status text not null default 'suggested' check (
    status in ('suggested', 'accepted', 'dismissed', 'expired')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memory_recommendations_tenant_idx
  on public.memory_recommendations (tenant_id, created_at desc);

alter table public.memory_recommendations enable row level security;
revoke all on public.memory_recommendations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. memory_feedback
-- ---------------------------------------------------------------------------
create table if not exists public.memory_feedback (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  target_type text not null check (target_type in ('profile', 'pattern', 'recommendation')),
  target_id uuid not null,
  feedback_type text not null check (
    feedback_type in ('helpful', 'not_helpful', 'incorrect', 'delete_request')
  ),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.memory_feedback enable row level security;
revoke all on public.memory_feedback from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Integrations: briefing + desktop include_memory
-- ---------------------------------------------------------------------------
alter table public.aipify_briefing_settings
  add column if not exists include_memory boolean not null default true;

alter table public.desktop_preferences
  add column if not exists include_memory boolean not null default true;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mem_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._mem_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._mem_ensure_settings(p_tenant_id uuid)
returns public.memory_settings language plpgsql security definer set search_path = public as $$
declare v_row public.memory_settings;
begin
  insert into public.memory_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.memory_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._mem_is_sensitive(p_key text, p_value text default null)
returns boolean language plpgsql immutable as $$
declare v_combined text;
begin
  v_combined := lower(coalesce(p_key, '') || ' ' || coalesce(p_value, ''));
  return v_combined ~ '(password|api[_-]?key|secret|token|payment|card|cvv|ssn|health|diagnos)';
end; $$;

create or replace function public._mem_sanitize_metadata(p_metadata jsonb)
returns jsonb language plpgsql immutable as $$
declare v_key text; v_result jsonb := '{}'::jsonb;
begin
  if p_metadata is null then return '{}'::jsonb; end if;
  for v_key in select jsonb_object_keys(p_metadata)
  loop
    if not public._mem_is_sensitive(v_key, p_metadata->>v_key) then
      v_result := v_result || jsonb_build_object(v_key, p_metadata->v_key);
    end if;
  end loop;
  return v_result;
end; $$;

create or replace function public._mem_upsert_observation(
  p_tenant_id uuid,
  p_user_id uuid,
  p_source_module text,
  p_source_type text,
  p_observation_key text,
  p_summary text,
  p_scope_level text,
  p_metadata jsonb,
  p_observed_at timestamptz
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public._mem_is_sensitive(p_observation_key, p_summary) then return; end if;
  insert into public.memory_observations (
    tenant_id, user_id, source_module, source_type, observation_key, summary,
    scope_level, metadata, observed_at
  ) values (
    p_tenant_id, p_user_id, p_source_module, p_source_type, p_observation_key, p_summary,
    coalesce(p_scope_level, 'user'), public._mem_sanitize_metadata(p_metadata),
    coalesce(p_observed_at, now())
  )
  on conflict (tenant_id, observation_key) do update set
    summary = excluded.summary, metadata = excluded.metadata,
    observed_at = excluded.observed_at, processed = false;
end; $$;

create or replace function public._mem_upsert_profile(
  p_tenant_id uuid,
  p_user_id uuid,
  p_scope_level text,
  p_profile_key text,
  p_profile_value jsonb,
  p_explanation text,
  p_source_module text,
  p_confidence numeric
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public._mem_is_sensitive(p_profile_key, p_profile_value::text) then return; end if;
  insert into public.memory_profiles (
    tenant_id, user_id, scope_level, profile_key, profile_value, explanation,
    source_module, confidence, last_observed_at
  ) values (
    p_tenant_id, p_user_id, coalesce(p_scope_level, 'user'), p_profile_key,
    public._mem_sanitize_metadata(p_profile_value), p_explanation,
    coalesce(p_source_module, 'memory'), coalesce(p_confidence, 0.5), now()
  )
  on conflict (tenant_id, user_id, scope_level, profile_key) do update set
    profile_value = excluded.profile_value, explanation = excluded.explanation,
    confidence = greatest(memory_profiles.confidence, excluded.confidence),
    last_observed_at = now(), updated_at = now();
end; $$;

create or replace function public._mem_upsert_pattern(
  p_tenant_id uuid,
  p_scope_level text,
  p_pattern_type text,
  p_pattern_key text,
  p_title text,
  p_description text,
  p_explanation text,
  p_metadata jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.memory_patterns (
    tenant_id, scope_level, pattern_type, pattern_key, title, description,
    explanation, metadata, frequency_count, last_seen_at
  ) values (
    p_tenant_id, coalesce(p_scope_level, 'tenant'), p_pattern_type, p_pattern_key,
    p_title, coalesce(p_description, ''), p_explanation,
    public._mem_sanitize_metadata(p_metadata), 1, now()
  )
  on conflict (tenant_id, pattern_key) do update set
    frequency_count = memory_patterns.frequency_count + 1,
    description = excluded.description, explanation = excluded.explanation,
    confidence = least(1.0, memory_patterns.confidence + 0.05),
    last_seen_at = now()
  returning id into v_id;
  return v_id;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Collect observations from modules
-- ---------------------------------------------------------------------------
create or replace function public.upsert_memory_observations_batch(p_observations jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_item jsonb; v_count int := 0;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  for v_item in select * from jsonb_array_elements(coalesce(p_observations, '[]'::jsonb))
  loop
    perform public._mem_upsert_observation(
      v_tenant_id, v_user_id,
      v_item->>'source_module', v_item->>'source_type', v_item->>'observation_key',
      v_item->>'summary', coalesce(v_item->>'scope_level', 'user'),
      coalesce(v_item->'metadata', '{}'::jsonb),
      coalesce((v_item->>'observed_at')::timestamptz, now())
    );
    v_count := v_count + 1;
  end loop;
  return jsonb_build_object('upserted', v_count);
end; $$;

create or replace function public.collect_memory_observations(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.memory_settings;
  v_since timestamptz;
  v_count int := 0;
  r record;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  v_settings := public._mem_ensure_settings(v_tenant_id);
  if v_settings.enabled = false or v_settings.auto_learn = false then
    return jsonb_build_object('collected', 0, 'enabled', false);
  end if;
  v_since := coalesce(p_since, now() - interval '30 days');

  if v_settings.include_user_preferences then
    for r in
      select mode_key, timezone, include_briefing, include_governance
      from public.desktop_preferences
      where tenant_id = v_tenant_id and user_id = v_user_id
    loop
      perform public._mem_upsert_profile(
        v_tenant_id, v_user_id, 'user', 'notification.mode',
        jsonb_build_object('mode_key', r.mode_key), 'Preferred desktop notification mode',
        'desktop', 0.8
      );
      perform public._mem_upsert_observation(
        v_tenant_id, v_user_id, 'desktop', 'preference', 'memory.desktop.mode.' || v_user_id::text,
        'Desktop mode: ' || r.mode_key, 'user', '{}'::jsonb, now()
      );
      v_count := v_count + 1;
    end loop;

    for r in
      select brief_frequency, max_items, language
      from public.aipify_briefing_preferences
      where tenant_id = v_tenant_id and user_id = v_user_id
    loop
      perform public._mem_upsert_profile(
        v_tenant_id, v_user_id, 'user', 'briefing.frequency',
        jsonb_build_object('frequency', r.brief_frequency, 'max_items', r.max_items),
        'Briefing delivery preferences', 'briefing', 0.75
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_team_patterns then
    for r in
      select risk_level, count(*) as cnt
      from public.aipify_approval_requests
      where tenant_id = v_tenant_id and status = 'approved' and created_at >= v_since
      group by risk_level
    loop
      perform public._mem_upsert_pattern(
        v_tenant_id, 'team', 'approval_habit',
        'memory.pattern.approval.' || coalesce(r.risk_level, 'medium'),
        'Approval pattern: ' || coalesce(r.risk_level, 'medium'),
        format('Team approved %s %s-risk requests recently', r.cnt, r.risk_level),
        'Observed from governance approval history', jsonb_build_object('count', r.cnt)
      );
      v_count := v_count + 1;
    end loop;
  end if;

  if v_settings.include_tenant_rules then
    for r in
      select category, count(*) as cnt
      from public.aipify_quality_incidents
      where tenant_id = v_tenant_id and created_at >= v_since
      group by category
      having count(*) >= 2
    loop
      perform public._mem_upsert_pattern(
        v_tenant_id, 'tenant', 'quality_incident',
        'memory.pattern.quality.' || r.category,
        'Recurring quality issue: ' || r.category,
        format('%s incidents in category %s', r.cnt, r.category),
        'Observed from Quality Guardian incidents', jsonb_build_object('count', r.cnt)
      );
      v_count := v_count + 1;
    end loop;

    for r in
      select count(*) as cnt
      from public.aipify_knowledge_gaps
      where tenant_id = v_tenant_id and status in ('open', 'pending') and created_at >= v_since
    loop
      if r.cnt > 0 then
        perform public._mem_upsert_pattern(
          v_tenant_id, 'tenant', 'knowledge_gap',
          'memory.pattern.knowledge.gaps',
          'Knowledge gaps need attention',
          format('%s open knowledge gaps', r.cnt),
          'Observed from Knowledge Center usage', jsonb_build_object('count', r.cnt)
        );
        v_count := v_count + 1;
      end if;
    end loop;
  end if;

  for r in
    select intent, count(*) as cnt
    from public.desktop_chat_history
    where tenant_id = v_tenant_id and user_id = v_user_id
      and role = 'assistant' and intent is not null and created_at >= v_since
    group by intent
  loop
    perform public._mem_upsert_observation(
      v_tenant_id, v_user_id, 'desktop', 'chat_intent',
      'memory.chat.intent.' || r.intent || '.' || v_user_id::text,
      'Frequent chat intent: ' || r.intent, 'user',
      jsonb_build_object('count', r.cnt), now()
    );
    v_count := v_count + 1;
  end loop;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'memory_observations_collected', 'memory', 'success', v_user_id,
    jsonb_build_object('count', v_count, 'since', v_since));

  return jsonb_build_object('collected', v_count, 'since', v_since);
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Generate recommendations from patterns
-- ---------------------------------------------------------------------------
create or replace function public.generate_memory_recommendations()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.memory_settings;
  v_generated int := 0;
  r record;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  v_settings := public._mem_ensure_settings(v_tenant_id);
  if v_settings.enabled = false then return jsonb_build_object('generated', 0); end if;

  perform public.collect_memory_observations(now() - interval '14 days');

  for r in
    select * from public.memory_patterns
    where tenant_id = v_tenant_id and status = 'active'
      and frequency_count >= 2
    order by confidence desc, last_seen_at desc
    limit 10
  loop
    if not exists (
      select 1 from public.memory_recommendations
      where tenant_id = v_tenant_id and title = r.title and status = 'suggested'
        and created_at >= now() - interval '7 days'
    ) then
      insert into public.memory_recommendations (
        tenant_id, user_id, recommendation_type, title, summary, rationale,
        action_url, source_pattern_id, priority_score
      ) values (
        v_tenant_id, v_user_id,
        case r.pattern_type
          when 'approval_habit' then 'governance'
          when 'quality_incident' then 'quality'
          when 'knowledge_gap' then 'knowledge'
          else 'workflow'
        end,
        r.title, r.description,
        coalesce(r.explanation, 'Based on observed patterns in your organization'),
        case r.pattern_type
          when 'approval_habit' then '/app/approvals'
          when 'quality_incident' then '/app/quality'
          when 'knowledge_gap' then '/app/knowledge-center/gaps'
          else '/app/memory/recommendations'
        end,
        r.id, r.frequency_count * 10
      );
      v_generated := v_generated + 1;
    end if;
  end loop;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'memory_recommendations_generated', 'memory', 'success', v_user_id,
    jsonb_build_object('count', v_generated));

  return jsonb_build_object('generated', v_generated);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Read / write APIs
-- ---------------------------------------------------------------------------
create or replace function public.get_memory_engine_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.memory_settings;
  v_profiles int;
  v_patterns int;
  v_recs jsonb;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  v_settings := public._mem_ensure_settings(v_tenant_id);

  select count(*) into v_profiles from public.memory_profiles
  where tenant_id = v_tenant_id and (user_id = v_user_id or scope_level = 'tenant');

  select count(*) into v_patterns from public.memory_patterns
  where tenant_id = v_tenant_id and status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'title', r.title, 'summary', r.summary, 'rationale', r.rationale,
    'action_url', r.action_url, 'priority_score', r.priority_score
  ) order by r.priority_score desc), '[]'::jsonb) into v_recs
  from (
    select * from public.memory_recommendations
    where tenant_id = v_tenant_id and status = 'suggested'
      and (user_id is null or user_id = v_user_id)
    order by priority_score desc limit 5
  ) r;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'auto_learn', v_settings.auto_learn,
    'profile_count', v_profiles,
    'pattern_count', v_patterns,
    'recommendations', v_recs,
    'privacy_note', 'Memory is tenant-isolated. Passwords, secrets, and payment data are never stored.',
    'philosophy', 'Observe → Learn → Remember → Recommend → Improve'
  );
end; $$;

create or replace function public.get_memory_profiles(p_scope text default null, p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', p.id, 'scope_level', p.scope_level, 'profile_key', p.profile_key,
    'profile_value', p.profile_value, 'explanation', p.explanation,
    'source_module', p.source_module, 'confidence', p.confidence, 'last_observed_at', p.last_observed_at
  ) order by p.last_observed_at desc) from (
    select * from public.memory_profiles
    where tenant_id = v_tenant_id
      and (p_scope is null or scope_level = p_scope)
      and (scope_level = 'tenant' or user_id = v_user_id)
    order by last_observed_at desc limit greatest(1, least(p_limit, 100))
  ) p), '[]'::jsonb);
end; $$;

create or replace function public.get_memory_patterns(p_limit int default 50)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', p.id, 'scope_level', p.scope_level, 'pattern_type', p.pattern_type,
    'title', p.title, 'description', p.description, 'frequency_count', p.frequency_count,
    'confidence', p.confidence, 'explanation', p.explanation, 'last_seen_at', p.last_seen_at
  ) order by p.last_seen_at desc) from (
    select * from public.memory_patterns
    where tenant_id = v_tenant_id and status = 'active'
    order by last_seen_at desc limit greatest(1, least(p_limit, 100))
  ) p), '[]'::jsonb);
end; $$;

create or replace function public.get_memory_recommendations(p_limit int default 20)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  return coalesce((select jsonb_agg(jsonb_build_object(
    'id', r.id, 'recommendation_type', r.recommendation_type, 'title', r.title,
    'summary', r.summary, 'rationale', r.rationale, 'action_url', r.action_url,
    'priority_score', r.priority_score, 'status', r.status, 'created_at', r.created_at
  ) order by r.priority_score desc) from (
    select * from public.memory_recommendations
    where tenant_id = v_tenant_id and status in ('suggested', 'accepted')
      and (user_id is null or user_id = v_user_id)
    order by priority_score desc limit greatest(1, least(p_limit, 100))
  ) r), '[]'::jsonb);
end; $$;

create or replace function public.explain_memory_item(p_target_type text, p_target_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_explanation text; v_title text;
begin
  v_tenant_id := public._mem_require_tenant();
  if p_target_type = 'profile' then
    select explanation, profile_key into v_explanation, v_title
    from public.memory_profiles where id = p_target_id and tenant_id = v_tenant_id;
  elsif p_target_type = 'pattern' then
    select explanation, title into v_explanation, v_title
    from public.memory_patterns where id = p_target_id and tenant_id = v_tenant_id;
  elsif p_target_type = 'recommendation' then
    select rationale, title into v_explanation, v_title
    from public.memory_recommendations where id = p_target_id and tenant_id = v_tenant_id;
  end if;
  if v_title is null then raise exception 'Memory item not found'; end if;
  return jsonb_build_object(
    'target_type', p_target_type, 'target_id', p_target_id,
    'title', v_title, 'explanation', coalesce(v_explanation, 'Aipify observed this pattern from verified module activity.')
  );
end; $$;

create or replace function public.delete_memory_profile(p_profile_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  delete from public.memory_profiles
  where id = p_profile_id and tenant_id = v_tenant_id
    and (user_id = v_user_id or scope_level = 'tenant');
  perform public._tacc_log_audit(v_tenant_id, 'user', 'memory_profile_deleted', 'memory', 'success', v_user_id,
    jsonb_build_object('profile_id', p_profile_id));
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.update_memory_recommendation_status(p_id uuid, p_status text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  update public.memory_recommendations set status = p_status, updated_at = now()
  where id = p_id and tenant_id = v_tenant_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'memory_recommendation_' || p_status, 'memory', 'success', v_user_id,
    jsonb_build_object('recommendation_id', p_id));
  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.record_memory_feedback(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  if v_user_id is null then raise exception 'User required'; end if;
  insert into public.memory_feedback (
    tenant_id, user_id, target_type, target_id, feedback_type, comment
  ) values (
    v_tenant_id, v_user_id,
    p_patch->>'target_type', (p_patch->>'target_id')::uuid,
    p_patch->>'feedback_type', p_patch->>'comment'
  ) returning id into v_id;
  if p_patch->>'feedback_type' = 'delete_request' and p_patch->>'target_type' = 'profile' then
    perform public.delete_memory_profile((p_patch->>'target_id')::uuid);
  end if;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'memory_feedback_recorded', 'memory', 'success', v_user_id, p_patch);
  return jsonb_build_object('feedback_id', v_id);
end; $$;

create or replace function public.get_memory_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_row public.memory_settings;
begin
  v_tenant_id := public._mem_require_tenant();
  v_row := public._mem_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_row.enabled, 'auto_learn', v_row.auto_learn,
    'include_user_preferences', v_row.include_user_preferences,
    'include_team_patterns', v_row.include_team_patterns,
    'include_tenant_rules', v_row.include_tenant_rules,
    'explainability_required', v_row.explainability_required,
    'governance_review_required', v_row.governance_review_required,
    'retention_days', v_row.retention_days,
    'excluded_categories', v_row.excluded_categories,
    'max_profiles_per_user', v_row.max_profiles_per_user,
    'max_patterns', v_row.max_patterns
  );
end; $$;

create or replace function public.update_memory_settings(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._mem_require_tenant();
  v_user_id := public._mem_auth_user_id();
  perform public._mem_ensure_settings(v_tenant_id);
  update public.memory_settings set
    enabled = coalesce((p_patch->>'enabled')::boolean, enabled),
    auto_learn = coalesce((p_patch->>'auto_learn')::boolean, auto_learn),
    include_user_preferences = coalesce((p_patch->>'include_user_preferences')::boolean, include_user_preferences),
    include_team_patterns = coalesce((p_patch->>'include_team_patterns')::boolean, include_team_patterns),
    include_tenant_rules = coalesce((p_patch->>'include_tenant_rules')::boolean, include_tenant_rules),
    explainability_required = coalesce((p_patch->>'explainability_required')::boolean, explainability_required),
    governance_review_required = coalesce((p_patch->>'governance_review_required')::boolean, governance_review_required),
    retention_days = coalesce((p_patch->>'retention_days')::int, retention_days),
    max_profiles_per_user = coalesce((p_patch->>'max_profiles_per_user')::int, max_profiles_per_user),
    max_patterns = coalesce((p_patch->>'max_patterns')::int, max_patterns),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'memory_settings_updated', 'memory', 'success', v_user_id, p_patch);
  return public.get_memory_settings();
end; $$;

-- Briefing integration: collect memory events
create or replace function public.collect_briefing_memory_events(p_tenant_id uuid, p_since timestamptz)
returns int language plpgsql security definer set search_path = public as $$
declare r record; v_count int := 0;
begin
  for r in
    select id, title, summary, priority_score, action_url, created_at
    from public.memory_recommendations
    where tenant_id = p_tenant_id and status = 'suggested' and created_at >= p_since
    limit 5
  loop
    perform public._bs_upsert_event(
      p_tenant_id, 'memory', 'memory_recommendation', r.id,
      'briefing.memory.rec.' || r.id::text, r.title, r.summary, 'medium',
      true, coalesce(r.action_url, '/app/memory/recommendations'), r.created_at,
      jsonb_build_object('source', 'memory_engine')
    );
    v_count := v_count + 1;
  end loop;
  return v_count;
end; $$;

-- Extend briefing collector with memory recommendations
create or replace function public.collect_briefing_events(p_since timestamptz default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_since timestamptz;
  v_settings public.aipify_briefing_settings;
  v_count int := 0;
  v_mem int := 0;
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

  if coalesce(v_settings.include_memory, true) then
    v_mem := public.collect_briefing_memory_events(v_tenant_id, v_since);
    v_count := v_count + v_mem;
  end if;

  perform public._tacc_log_audit(v_tenant_id, 'aipify', 'briefing_events_collected', 'briefing', 'success', null,
    jsonb_build_object('count', v_count, 'since', v_since, 'memory', v_mem));

  return jsonb_build_object('collected', v_count, 'since', v_since);
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
    'include_integrations', v_row.include_integrations,
    'include_memory', coalesce(v_row.include_memory, true)
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
    include_memory = coalesce((p_patch->>'include_memory')::boolean, include_memory),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._tacc_log_audit(v_tenant_id, 'user', 'briefing_settings_updated', 'briefing', 'success', null, p_patch);
  return public.get_briefing_settings();
end; $$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'memory-engine', 'Memory Engine', 'How Aipify remembers patterns and preferences', 'authenticated', 101
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'memory-engine' and tenant_id is null);

-- Grants
grant execute on function public.get_memory_engine_card() to authenticated;
grant execute on function public.get_memory_profiles(text, int) to authenticated;
grant execute on function public.get_memory_patterns(int) to authenticated;
grant execute on function public.get_memory_recommendations(int) to authenticated;
grant execute on function public.explain_memory_item(text, uuid) to authenticated;
grant execute on function public.delete_memory_profile(uuid) to authenticated;
grant execute on function public.update_memory_recommendation_status(uuid, text) to authenticated;
grant execute on function public.record_memory_feedback(jsonb) to authenticated;
grant execute on function public.get_memory_settings() to authenticated;
grant execute on function public.update_memory_settings(jsonb) to authenticated;
grant execute on function public.collect_memory_observations(timestamptz) to authenticated;
grant execute on function public.upsert_memory_observations_batch(jsonb) to authenticated;
grant execute on function public.generate_memory_recommendations() to authenticated;
