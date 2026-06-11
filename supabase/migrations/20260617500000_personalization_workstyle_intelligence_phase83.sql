-- Phase 83 — Personalization & Workstyle Intelligence Engine
-- Core principle: Aipify adapts to people. People never adapt to Aipify.

-- ---------------------------------------------------------------------------
-- 1. workstyle_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.workstyle_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  communication_style text not null default 'warm_professional' check (
    communication_style in ('professional', 'warm_professional', 'playful', 'executive', 'technical')
  ),
  notification_style text not null default 'balanced' check (
    notification_style in ('minimal', 'balanced', 'proactive', 'critical_only')
  ),
  learning_style text not null default 'articles' check (
    learning_style in ('articles', 'videos', 'mini_guides', 'walkthroughs', 'step_by_step')
  ),
  explanation_style text not null default 'operational' check (
    explanation_style in ('simple', 'operational', 'technical')
  ),
  collaboration_style text not null default 'guided' check (
    collaboration_style in ('independent', 'collaborative', 'approval_oriented', 'guided')
  ),
  desktop_style text not null default 'morning_briefings' check (
    desktop_style in ('morning_briefings', 'afternoon_summaries', 'minimal', 'full_assistant')
  ),
  personalization_enabled boolean not null default true,
  humor_enabled boolean not null default true,
  recommendation_frequency text not null default 'balanced' check (
    recommendation_frequency in ('minimal', 'balanced', 'proactive')
  ),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create index if not exists workstyle_profiles_tenant_user_idx
  on public.workstyle_profiles (tenant_id, user_id);

alter table public.workstyle_profiles enable row level security;
revoke all on public.workstyle_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. user_preferences (workstyle granular preferences)
-- ---------------------------------------------------------------------------
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  preference_type text not null,
  preference_value text not null,
  source text not null default 'explicit' check (
    source in ('explicit', 'onboarding', 'suggestion', 'feedback', 'org_default')
  ),
  confidence_level text not null default 'high' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id, preference_type)
);

create index if not exists user_preferences_tenant_user_idx
  on public.user_preferences (tenant_id, user_id, preference_type);

alter table public.user_preferences enable row level security;
revoke all on public.user_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. preference_suggestions
-- ---------------------------------------------------------------------------
create table if not exists public.preference_suggestions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  suggestion text not null,
  preference_type text not null,
  suggested_value text not null,
  confidence_level text not null default 'medium' check (
    confidence_level in ('high', 'medium', 'low')
  ),
  status text not null default 'pending' check (
    status in ('pending', 'accepted', 'dismissed', 'expired')
  ),
  created_at timestamptz not null default now()
);

create index if not exists preference_suggestions_tenant_user_idx
  on public.preference_suggestions (tenant_id, user_id, status, created_at desc);

alter table public.preference_suggestions enable row level security;
revoke all on public.preference_suggestions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. workstyle_org_policies (admin defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.workstyle_org_policies (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade unique,
  default_communication_style text not null default 'warm_professional',
  allowed_personality_modes jsonb not null default '["professional","warm_professional","playful"]'::jsonb,
  personalization_enabled boolean not null default true,
  allow_user_override boolean not null default true,
  privacy_restrictions jsonb not null default '{"no_employee_scoring":true,"no_cross_tenant_sharing":true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workstyle_org_policies enable row level security;
revoke all on public.workstyle_org_policies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. workstyle_audit_log
-- ---------------------------------------------------------------------------
create table if not exists public.workstyle_audit_log (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  event_type text not null,
  summary text,
  metadata jsonb not null default '{}'::jsonb,
  actor_user_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.workstyle_audit_log enable row level security;
revoke all on public.workstyle_audit_log from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_ws_)
-- ---------------------------------------------------------------------------
create or replace function public._ws_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._ws_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._ws_log_audit(
  p_tenant_id uuid, p_event_type text,
  p_summary text default null, p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.workstyle_audit_log (tenant_id, event_type, summary, metadata, actor_user_id)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_metadata, '{}'::jsonb), public._ws_auth_user_id())
  returning id into v_id;
  perform public._tacc_log_audit(p_tenant_id, 'user', 'workstyle_' || p_event_type, 'workstyle', 'logged', null, p_metadata);
  return v_id;
end; $$;

create or replace function public._ws_ensure_org_policies(p_tenant_id uuid)
returns public.workstyle_org_policies language plpgsql security definer set search_path = public as $$
declare v_row public.workstyle_org_policies;
begin
  insert into public.workstyle_org_policies (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.workstyle_org_policies where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._ws_ensure_profile(p_tenant_id uuid, p_user_id uuid)
returns public.workstyle_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.workstyle_profiles; v_policy public.workstyle_org_policies;
begin
  v_policy := public._ws_ensure_org_policies(p_tenant_id);
  insert into public.workstyle_profiles (tenant_id, user_id, communication_style)
  values (p_tenant_id, p_user_id, v_policy.default_communication_style)
  on conflict (tenant_id, user_id) do nothing;
  select * into v_row from public.workstyle_profiles where tenant_id = p_tenant_id and user_id = p_user_id;
  return v_row;
end; $$;

create or replace function public._ws_sync_personality(p_tenant_id uuid, p_style text)
returns void language plpgsql security definer set search_path = public as $$
declare v_mode text;
begin
  v_mode := case p_style
    when 'executive' then 'professional'
    when 'technical' then 'professional'
    else p_style
  end;
  if v_mode in ('professional', 'warm_professional', 'playful') then
    insert into public.personality_settings (tenant_id, personality_mode)
    values (p_tenant_id, v_mode)
    on conflict (tenant_id) do update set personality_mode = v_mode, updated_at = now();
  end if;
end; $$;

create or replace function public._ws_store_memory_preference(
  p_tenant_id uuid, p_user_id uuid, p_key text, p_value text, p_confidence text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  begin
    perform public._mem_upsert_profile(
      p_tenant_id, p_user_id, 'user', 'workstyle.' || p_key,
      jsonb_build_object('value', p_value),
      'User-approved workstyle preference — not surveillance data.',
      'workstyle', case p_confidence when 'high' then 0.95 when 'medium' then 0.75 else 0.5 end
    );
  exception when others then null;
  end;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Seed suggestions (consent required)
-- ---------------------------------------------------------------------------
create or replace function public._ws_seed_suggestions(p_tenant_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.preference_suggestions
    where tenant_id = p_tenant_id and user_id = p_user_id and status = 'pending'
  ) then return; end if;

  insert into public.preference_suggestions (
    tenant_id, user_id, suggestion, preference_type, suggested_value, confidence_level
  ) values
    (p_tenant_id, p_user_id,
     'You appear to prefer shorter executive summaries. Would you like to make this your default style?',
     'explanation_style', 'simple', 'medium'),
    (p_tenant_id, p_user_id,
     'You often dismiss low-priority reminders. Would you like to reduce notification frequency?',
     'notification_style', 'minimal', 'low');
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Update profile & preferences
-- ---------------------------------------------------------------------------
create or replace function public.update_workstyle_profile(p_patch jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_row public.workstyle_profiles;
  v_policy public.workstyle_org_policies;
begin
  v_tenant_id := public._ws_require_tenant();
  v_user_id := public._ws_auth_user_id();
  if v_user_id is null then raise exception 'No user context'; end if;
  v_policy := public._ws_ensure_org_policies(v_tenant_id);
  if not v_policy.personalization_enabled then
    return jsonb_build_object('error', 'personalization_disabled_by_org');
  end if;

  v_row := public._ws_ensure_profile(v_tenant_id, v_user_id);

  update public.workstyle_profiles set
    communication_style = coalesce(p_patch->>'communication_style', communication_style),
    notification_style = coalesce(p_patch->>'notification_style', notification_style),
    learning_style = coalesce(p_patch->>'learning_style', learning_style),
    explanation_style = coalesce(p_patch->>'explanation_style', explanation_style),
    collaboration_style = coalesce(p_patch->>'collaboration_style', collaboration_style),
    desktop_style = coalesce(p_patch->>'desktop_style', desktop_style),
    personalization_enabled = coalesce((p_patch->>'personalization_enabled')::boolean, personalization_enabled),
    humor_enabled = coalesce((p_patch->>'humor_enabled')::boolean, humor_enabled),
    recommendation_frequency = coalesce(p_patch->>'recommendation_frequency', recommendation_frequency),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id
  returning * into v_row;

  perform public._ws_sync_personality(v_tenant_id, v_row.communication_style);

  insert into public.user_preferences (tenant_id, user_id, preference_type, preference_value, source, confidence_level)
  values (v_tenant_id, v_user_id, 'communication_style', v_row.communication_style, 'explicit', 'high')
  on conflict (tenant_id, user_id, preference_type) do update set
    preference_value = excluded.preference_value, source = 'explicit', confidence_level = 'high';

  perform public._ws_store_memory_preference(v_tenant_id, v_user_id, 'communication_style', v_row.communication_style, 'high');
  perform public._ws_log_audit(v_tenant_id, 'profile_updated', 'Workstyle profile updated', jsonb_build_object('user_id', v_user_id));

  return jsonb_build_object(
    'profile', jsonb_build_object(
      'communication_style', v_row.communication_style,
      'notification_style', v_row.notification_style,
      'learning_style', v_row.learning_style,
      'explanation_style', v_row.explanation_style,
      'collaboration_style', v_row.collaboration_style,
      'desktop_style', v_row.desktop_style,
      'personalization_enabled', v_row.personalization_enabled,
      'humor_enabled', v_row.humor_enabled,
      'recommendation_frequency', v_row.recommendation_frequency
    ),
    'user_control_mandatory', true
  );
end; $$;

create or replace function public.disable_workstyle_personalization()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._ws_require_tenant();
  v_user_id := public._ws_auth_user_id();

  update public.workstyle_profiles set personalization_enabled = false, updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  perform public._ws_log_audit(v_tenant_id, 'personalization_disabled', 'User disabled personalization', '{}'::jsonb);

  return jsonb_build_object('personalization_enabled', false, 'user_control_mandatory', true);
end; $$;

create or replace function public.accept_preference_suggestion(p_suggestion_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_sugg public.preference_suggestions;
  v_patch jsonb;
begin
  v_tenant_id := public._ws_require_tenant();
  v_user_id := public._ws_auth_user_id();

  select * into v_sugg from public.preference_suggestions
  where id = p_suggestion_id and tenant_id = v_tenant_id and user_id = v_user_id and status = 'pending';
  if v_sugg.id is null then return jsonb_build_object('error', 'not_found'); end if;

  update public.preference_suggestions set status = 'accepted' where id = v_sugg.id;

  v_patch := jsonb_build_object(v_sugg.preference_type, v_sugg.suggested_value);

  insert into public.user_preferences (tenant_id, user_id, preference_type, preference_value, source, confidence_level)
  values (v_tenant_id, v_user_id, v_sugg.preference_type, v_sugg.suggested_value, 'suggestion', v_sugg.confidence_level)
  on conflict (tenant_id, user_id, preference_type) do update set
    preference_value = excluded.preference_value, source = 'suggestion', confidence_level = excluded.confidence_level;

  perform public.update_workstyle_profile(v_patch);
  perform public._ws_store_memory_preference(v_tenant_id, v_user_id, v_sugg.preference_type, v_sugg.suggested_value, v_sugg.confidence_level);
  perform public._ws_log_audit(v_tenant_id, 'suggestion_accepted', v_sugg.suggestion, jsonb_build_object('suggestion_id', v_sugg.id));

  begin
    perform public.generate_decision_explanation(
      'workstyle-sugg-' || v_sugg.id::text, 'workstyle', 'workstyle',
      'Preference suggestion accepted — ' || left(v_sugg.suggestion, 80),
      'User explicitly approved this personalization suggestion. No hidden profiling occurred.',
      jsonb_build_array(v_sugg.preference_type, v_sugg.suggested_value),
      jsonb_build_array('user_consent_required', 'no_surveillance'),
      v_sugg.confidence_level,
      jsonb_build_array('dismiss_suggestion', 'modify_preference'),
      jsonb_build_array('Preference applied to your profile', 'You may change it anytime in settings'),
      jsonb_build_object('simple', 'You approved a personalization suggestion. You remain in full control.')
    );
  exception when others then null;
  end;

  return jsonb_build_object('status', 'accepted', 'user_control_mandatory', true);
end; $$;

create or replace function public.dismiss_preference_suggestion(p_suggestion_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._ws_require_tenant();
  update public.preference_suggestions set status = 'dismissed'
  where id = p_suggestion_id and tenant_id = v_tenant_id and status = 'pending';
  perform public._ws_log_audit(v_tenant_id, 'suggestion_dismissed', 'Preference suggestion dismissed',
    jsonb_build_object('suggestion_id', p_suggestion_id));
  return jsonb_build_object('status', 'dismissed');
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Desktop greeting with workstyle
-- ---------------------------------------------------------------------------
create or replace function public.generate_workstyle_desktop_greeting()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.workstyle_profiles;
  v_name text;
  v_greeting jsonb;
  v_message text;
begin
  v_tenant_id := public._ws_require_tenant();
  v_user_id := public._ws_auth_user_id();
  v_profile := public._ws_ensure_profile(v_tenant_id, v_user_id);

  select coalesce(preferred_address_name, assistant_owner_name, 'there') into v_name
  from public.assistant_identity_profiles
  where tenant_id = v_tenant_id and user_id = v_user_id limit 1;

  if v_profile.explanation_style = 'simple' or v_profile.communication_style = 'executive' then
    v_message := 'Good morning, ' || v_name || '. You usually prefer short morning summaries. Would you like today''s 3-minute overview?';
  elsif v_profile.personalization_enabled then
    v_message := 'Good morning, ' || v_name || ' 😊 Your preference profile suggests executive summaries. I''ve prepared a concise briefing.';
  else
    v_message := 'Good morning, ' || v_name || '.';
  end if;

  if not coalesce(v_profile.personalization_enabled, true) or v_profile.communication_style = 'professional' then
    v_message := regexp_replace(v_message, '[😀-🙏🌀-🗿🚀-🛿☕-⛿✀-➿]', '', 'g');
  end if;

  return jsonb_build_object(
    'message', v_message,
    'communication_style', v_profile.communication_style,
    'desktop_style', v_profile.desktop_style,
    'personalization_enabled', v_profile.personalization_enabled,
    'user_control_mandatory', true
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_workstyle_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid; v_profile public.workstyle_profiles;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  v_user_id := public._ws_auth_user_id();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_profile := public._ws_ensure_profile(v_tenant_id, v_user_id);

  return jsonb_build_object(
    'has_customer', true,
    'communication_style', v_profile.communication_style,
    'personalization_enabled', v_profile.personalization_enabled,
    'philosophy', 'Aipify adapts to people. People never adapt to Aipify.',
    'user_control_mandatory', true
  );
end; $$;

create or replace function public.get_personalization_settings()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.workstyle_profiles;
  v_policy public.workstyle_org_policies;
  v_preferences jsonb;
  v_suggestions jsonb;
begin
  v_tenant_id := public._ws_require_tenant();
  v_user_id := public._ws_auth_user_id();
  v_policy := public._ws_ensure_org_policies(v_tenant_id);
  v_profile := public._ws_ensure_profile(v_tenant_id, v_user_id);
  perform public._ws_seed_suggestions(v_tenant_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'preference_type', p.preference_type, 'preference_value', p.preference_value,
    'source', p.source, 'confidence_level', p.confidence_level
  )), '[]'::jsonb) into v_preferences
  from public.user_preferences p where p.tenant_id = v_tenant_id and p.user_id = v_user_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'suggestion', s.suggestion, 'preference_type', s.preference_type,
    'suggested_value', s.suggested_value, 'confidence_level', s.confidence_level, 'status', s.status
  )), '[]'::jsonb) into v_suggestions
  from public.preference_suggestions s
  where s.tenant_id = v_tenant_id and s.user_id = v_user_id and s.status = 'pending';

  perform public._ws_log_audit(v_tenant_id, 'settings_viewed', 'Personalization settings accessed', '{}'::jsonb);

  return jsonb_build_object(
    'has_customer', true,
    'user_control_mandatory', true,
    'no_surveillance', true,
    'profile', jsonb_build_object(
      'communication_style', v_profile.communication_style,
      'notification_style', v_profile.notification_style,
      'learning_style', v_profile.learning_style,
      'explanation_style', v_profile.explanation_style,
      'collaboration_style', v_profile.collaboration_style,
      'desktop_style', v_profile.desktop_style,
      'personalization_enabled', v_profile.personalization_enabled,
      'humor_enabled', v_profile.humor_enabled,
      'recommendation_frequency', v_profile.recommendation_frequency
    ),
    'org_policy', jsonb_build_object(
      'default_communication_style', v_policy.default_communication_style,
      'allowed_personality_modes', v_policy.allowed_personality_modes,
      'personalization_enabled', v_policy.personalization_enabled,
      'allow_user_override', v_policy.allow_user_override,
      'privacy_restrictions', v_policy.privacy_restrictions
    ),
    'preferences', v_preferences,
    'suggestions', v_suggestions,
    'dimensions', jsonb_build_object(
      'communication', jsonb_build_array('professional', 'warm_professional', 'playful', 'executive', 'technical'),
      'notification', jsonb_build_array('minimal', 'balanced', 'proactive', 'critical_only'),
      'learning', jsonb_build_array('articles', 'videos', 'mini_guides', 'walkthroughs', 'step_by_step'),
      'explanation', jsonb_build_array('simple', 'operational', 'technical'),
      'collaboration', jsonb_build_array('independent', 'collaborative', 'approval_oriented', 'guided'),
      'desktop', jsonb_build_array('morning_briefings', 'afternoon_summaries', 'minimal', 'full_assistant')
    ),
    'integrations', jsonb_build_object(
      'personality', 'Communication tone and humor settings',
      'human_success', 'Adoption and learning personalization',
      'memory_engine', 'Approved preferences only — no unauthorized profiling',
      'trust_engine', 'Transparent explanations for suggestions',
      'knowledge_center', 'Learning format recommendations',
      'desktop_companion', 'Morning summaries and notification respect'
    )
  );
end; $$;

-- Extend Trust decision types
alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle'
  )
);

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'personalization', 'Personalization & Workstyle', 'Workstyle intelligence, privacy, and personalization guides.', 'authenticated', 28
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'personalization' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.update_workstyle_profile(jsonb) to authenticated;
grant execute on function public.disable_workstyle_personalization() to authenticated;
grant execute on function public.accept_preference_suggestion(uuid) to authenticated;
grant execute on function public.dismiss_preference_suggestion(uuid) to authenticated;
grant execute on function public.generate_workstyle_desktop_greeting() to authenticated;
grant execute on function public.get_workstyle_card() to authenticated;
grant execute on function public.get_personalization_settings() to authenticated;
