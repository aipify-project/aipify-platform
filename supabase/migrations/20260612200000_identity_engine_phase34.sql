-- Phase 34 — Identity Engine (AIE)
-- Shapes how Aipify interacts with each user. Familiarity without manipulation.

-- ---------------------------------------------------------------------------
-- 1. identity_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.identity_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  communication_style text not null default 'supportive' check (
    communication_style in (
      'minimal', 'professional', 'friendly', 'conversational',
      'supportive', 'motivational', 'formal', 'warm', 'humorous'
    )
  ),
  proactivity_level text not null default 'balanced' check (
    proactivity_level in (
      'passive', 'reactive', 'balanced', 'proactive', 'highly_proactive'
    )
  ),
  tone text not null default 'supportive' check (
    tone in ('direct', 'encouraging', 'calm', 'energetic', 'neutral', 'supportive')
  ),
  name_usage text not null default 'occasional' check (
    name_usage in ('always', 'occasional', 'avoid', 'professional_title')
  ),
  notification_style text not null default 'balanced' check (
    notification_style in ('minimal', 'balanced', 'frequent')
  ),
  identity_mode text not null default 'supportive' check (
    identity_mode in ('minimal', 'professional', 'supportive', 'companion', 'custom')
  ),
  social_interaction_style text not null default 'trusted_organizer' check (
    social_interaction_style in (
      'professional_assistant', 'trusted_organizer', 'friendly_companion',
      'executive_advisor', 'life_coordinator'
    )
  ),
  response_length text not null default 'balanced' check (
    response_length in ('short', 'balanced', 'detailed')
  ),
  notification_preferences jsonb not null default '{
    "push": true,
    "email": false,
    "calendar": false,
    "in_app": true,
    "daily_summaries": false
  }'::jsonb,
  boundaries jsonb not null default '{
    "no_repeated_contact": true,
    "no_excessive_notifications": true,
    "no_emotional_pressure": true,
    "no_dependency_encouragement": true,
    "no_guilt": true
  }'::jsonb,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.identity_profiles enable row level security;
revoke all on public.identity_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. interaction_observations — patterns require user approval
-- ---------------------------------------------------------------------------
create table if not exists public.interaction_observations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  observation_type text not null check (
    observation_type in (
      'communication', 'proactivity', 'timing', 'format', 'topic', 'general'
    )
  ),
  description text not null,
  suggested_change jsonb not null default '{}'::jsonb,
  confidence_score integer not null default 50 check (
    confidence_score between 0 and 100
  ),
  status text not null default 'pending' check (
    status in ('pending', 'approved', 'dismissed', 'deferred')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interaction_observations_user_idx
  on public.interaction_observations (tenant_id, user_id, status);

alter table public.interaction_observations enable row level security;
revoke all on public.interaction_observations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Ensure profile helper
-- ---------------------------------------------------------------------------
create or replace function public.ensure_identity_profile(
  p_tenant_id uuid,
  p_user_id uuid
)
returns public.identity_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.identity_profiles;
begin
  insert into public.identity_profiles (tenant_id, user_id)
  values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;

  select * into v_row
  from public.identity_profiles
  where tenant_id = p_tenant_id and user_id = p_user_id;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Update identity profile
-- ---------------------------------------------------------------------------
create or replace function public.update_identity_profile(
  p_communication_style text default null,
  p_proactivity_level text default null,
  p_tone text default null,
  p_name_usage text default null,
  p_notification_style text default null,
  p_identity_mode text default null,
  p_social_interaction_style text default null,
  p_response_length text default null,
  p_notification_preferences jsonb default null,
  p_boundaries jsonb default null,
  p_onboarding_completed boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  if v_user_id is null then raise exception 'User not found'; end if;

  perform public.ensure_identity_profile(v_tenant_id, v_user_id);

  update public.identity_profiles
  set
    communication_style = coalesce(p_communication_style, communication_style),
    proactivity_level = coalesce(p_proactivity_level, proactivity_level),
    tone = coalesce(p_tone, tone),
    name_usage = coalesce(p_name_usage, name_usage),
    notification_style = coalesce(p_notification_style, notification_style),
    identity_mode = coalesce(p_identity_mode, identity_mode),
    social_interaction_style = coalesce(p_social_interaction_style, social_interaction_style),
    response_length = coalesce(p_response_length, response_length),
    notification_preferences = coalesce(p_notification_preferences, notification_preferences),
    boundaries = coalesce(p_boundaries, boundaries),
    onboarding_completed = coalesce(p_onboarding_completed, onboarding_completed),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object('updated', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Respond to observation (approval model)
-- ---------------------------------------------------------------------------
create or replace function public.respond_to_identity_observation(
  p_observation_id uuid,
  p_response text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_obs public.interaction_observations;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'Customer not found'; end if;

  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;

  select * into v_obs
  from public.interaction_observations
  where id = p_observation_id and tenant_id = v_tenant_id and user_id = v_user_id;

  if v_obs.id is null then raise exception 'Observation not found'; end if;

  if p_response = 'yes' then
    update public.interaction_observations
    set status = 'approved', updated_at = now()
    where id = p_observation_id;

    if v_obs.suggested_change ? 'communication_style' then
      perform public.update_identity_profile(
        p_communication_style := v_obs.suggested_change ->> 'communication_style'
      );
    end if;
    if v_obs.suggested_change ? 'proactivity_level' then
      perform public.update_identity_profile(
        p_proactivity_level := v_obs.suggested_change ->> 'proactivity_level'
      );
    end if;
    if v_obs.suggested_change ? 'response_length' then
      perform public.update_identity_profile(
        p_response_length := v_obs.suggested_change ->> 'response_length'
      );
    end if;
    if v_obs.suggested_change ? 'tone' then
      perform public.update_identity_profile(
        p_tone := v_obs.suggested_change ->> 'tone'
      );
    end if;
  elsif p_response = 'later' then
    update public.interaction_observations
    set status = 'deferred', updated_at = now()
    where id = p_observation_id;
  else
    update public.interaction_observations
    set status = 'dismissed', updated_at = now()
    where id = p_observation_id;
  end if;

  return jsonb_build_object('status', p_response);
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Seed observation if missing (observation engine scaffold)
-- ---------------------------------------------------------------------------
create or replace function public._seed_identity_observations(
  p_tenant_id uuid,
  p_user_id uuid,
  p_profile public.identity_profiles
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_profile.response_length = 'balanced'
    and p_profile.created_at < now() - interval '7 days'
    and not exists (
      select 1 from public.interaction_observations
      where tenant_id = p_tenant_id and user_id = p_user_id
        and description like '%shorter updates%'
    )
  then
    insert into public.interaction_observations (
      tenant_id, user_id, observation_type, description,
      suggested_change, confidence_score
    )
    values (
      p_tenant_id, p_user_id, 'communication',
      'I''ve noticed you may prefer shorter updates. Would you like me to adjust my communication style?',
      '{"response_length": "short", "communication_style": "minimal"}'::jsonb,
      65
    );
  end if;

  if p_profile.proactivity_level = 'balanced'
    and not exists (
      select 1 from public.interaction_observations
      where tenant_id = p_tenant_id and user_id = p_user_id
        and observation_type = 'timing'
    )
  then
    insert into public.interaction_observations (
      tenant_id, user_id, observation_type, description,
      suggested_change, confidence_score
    )
    values (
      p_tenant_id, p_user_id, 'timing',
      'You may prefer morning planning. Would you like daily summaries?',
      '{"notification_preferences": {"daily_summaries": true}}'::jsonb,
      55
    );
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. get_customer_identity_center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_identity_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.identity_profiles;
  v_user_name text;
  v_explain text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.id, u.full_name into v_user_id, v_user_name
  from public.users u where u.auth_user_id = auth.uid() limit 1;

  if v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_profile := public.ensure_identity_profile(v_tenant_id, v_user_id);
  perform public._seed_identity_observations(v_tenant_id, v_user_id, v_profile);

  v_explain := format(
    'You chose %s communication, %s proactivity, and %s tone. I adapt to your preferences — you stay in control.',
    v_profile.communication_style, v_profile.proactivity_level, v_profile.tone
  );

  return jsonb_build_object(
    'has_customer', true,
    'user_name', split_part(coalesce(v_user_name, ''), ' ', 1),
    'profile', jsonb_build_object(
      'id', v_profile.id,
      'communication_style', v_profile.communication_style,
      'proactivity_level', v_profile.proactivity_level,
      'tone', v_profile.tone,
      'name_usage', v_profile.name_usage,
      'notification_style', v_profile.notification_style,
      'identity_mode', v_profile.identity_mode,
      'social_interaction_style', v_profile.social_interaction_style,
      'response_length', v_profile.response_length,
      'notification_preferences', v_profile.notification_preferences,
      'boundaries', v_profile.boundaries,
      'onboarding_completed', v_profile.onboarding_completed,
      'created_at', v_profile.created_at,
      'updated_at', v_profile.updated_at
    ),
    'explainability', v_explain,
    'boundary_principles', jsonb_build_array(
      'No repeated contact without purpose',
      'No excessive notifications',
      'No emotional pressure or guilt',
      'No encouragement of dependency',
      'Transparency always — you can change anything'
    ),
    'privacy_note', 'Identity shapes how I communicate — never who you are. You control every setting.',
    'pending_observations', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', o.id, 'observation_type', o.observation_type,
        'description', o.description, 'confidence_score', o.confidence_score,
        'suggested_change', o.suggested_change, 'created_at', o.created_at
      ) order by o.confidence_score desc)
      from public.interaction_observations o
      where o.tenant_id = v_tenant_id and o.user_id = v_user_id
        and o.status = 'pending'),
      '[]'::jsonb
    ),
    'interaction_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', o.id, 'observation_type', o.observation_type,
        'description', o.description, 'status', o.status, 'created_at', o.created_at
      ) order by o.updated_at desc)
      from public.interaction_observations o
      where o.tenant_id = v_tenant_id and o.user_id = v_user_id
        and o.status != 'pending'
      limit 20),
      '[]'::jsonb
    ),
    'onboarding_questions', jsonb_build_array(
      'How would you like me to communicate with you?',
      'Would you prefer reminders?',
      'How proactive should I be?',
      'Would you like daily summaries?',
      'Should I use your name?',
      'How formal should I be?'
    ),
    'integrations', jsonb_build_object(
      'learning_engine', 'Recommendations only — identity stays user-controlled',
      'pame', 'Memory separate from identity adaptation',
      'life_os', 'Life coordination respects proactivity settings',
      'rsi', 'Relationship assistance respects boundaries'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Platform overview — aggregates only
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_identity_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  return jsonb_build_object(
    'privacy_note', 'Administrators cannot access identity profiles. Aggregates only.',
    'profiles_count', (select count(*) from public.identity_profiles),
    'onboarding_completed', (
      select count(*) from public.identity_profiles where onboarding_completed = true
    ),
    'pending_observations', (
      select count(*) from public.interaction_observations where status = 'pending'
    ),
    'by_mode', coalesce(
      (select jsonb_object_agg(identity_mode, cnt)
      from (
        select identity_mode, count(*)::integer as cnt
        from public.identity_profiles group by identity_mode
      ) sub),
      '{}'::jsonb
    ),
    'by_proactivity', coalesce(
      (select jsonb_object_agg(proactivity_level, cnt)
      from (
        select proactivity_level, count(*)::integer as cnt
        from public.identity_profiles group by proactivity_level
      ) sub),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public.ensure_identity_profile(uuid, uuid) to authenticated;
grant execute on function public.update_identity_profile(
  text, text, text, text, text, text, text, text, jsonb, jsonb, boolean
) to authenticated;
grant execute on function public.respond_to_identity_observation(uuid, text) to authenticated;
grant execute on function public.get_customer_identity_center() to authenticated;
grant execute on function public.get_platform_identity_overview() to authenticated;
