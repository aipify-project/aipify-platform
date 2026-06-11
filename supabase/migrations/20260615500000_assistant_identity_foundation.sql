-- Foundation — Assistant Identity & Welcome Experience

-- ---------------------------------------------------------------------------
-- 1. assistant_identity_settings (tenant)
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_identity_settings (
  tenant_id uuid primary key references public.customers (id) on delete cascade,
  enabled boolean not null default true,
  require_welcome_flow boolean not null default true,
  allow_user_level_preferences boolean not null default true,
  allow_tenant_phrase_overrides boolean not null default true,
  default_tone text not null default 'professional_warm',
  default_language text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assistant_identity_settings enable row level security;
revoke all on public.assistant_identity_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. assistant_identity_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_identity_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete cascade,
  assistant_owner_name text,
  preferred_address_name text,
  address_name_mode text not null default 'first_name' check (
    address_name_mode in ('first_name', 'full_name', 'company_role', 'custom')
  ),
  preferred_communication_style text not null default 'professional_warm' check (
    preferred_communication_style in (
      'professional', 'professional_warm', 'short_effective', 'personal', 'technical_precise'
    )
  ),
  primary_focus_areas text[] not null default '{}',
  uncertainty_handling_preference text not null default 'ask_first' check (
    uncertainty_handling_preference in ('ask_first', 'suggest_and_approve', 'draft_only', 'report_only')
  ),
  welcome_completed boolean not null default false,
  welcome_completed_at timestamptz,
  welcome_step int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create unique index if not exists assistant_identity_profiles_tenant_only_idx
  on public.assistant_identity_profiles (tenant_id) where user_id is null;

create index if not exists assistant_identity_profiles_tenant_idx
  on public.assistant_identity_profiles (tenant_id, user_id);

alter table public.assistant_identity_profiles enable row level security;
revoke all on public.assistant_identity_profiles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. assistant_communication_preferences
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_communication_preferences (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  preferred_language text,
  preferred_tone text not null default 'professional_warm',
  use_name_in_greetings boolean not null default true,
  allow_personalized_phrases boolean not null default true,
  allow_encouragement boolean not null default true,
  reminder_style text not null default 'friendly',
  notification_style text not null default 'balanced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

alter table public.assistant_communication_preferences enable row level security;
revoke all on public.assistant_communication_preferences from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. assistant_phrase_templates
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_phrase_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete cascade,
  phrase_key text not null,
  category text not null,
  language text not null default 'en',
  tone text not null default 'professional_warm',
  body text not null,
  variables jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, phrase_key, language)
);

alter table public.assistant_phrase_templates enable row level security;
revoke all on public.assistant_phrase_templates from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. assistant_identity_events
-- ---------------------------------------------------------------------------
create table if not exists public.assistant_identity_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid references public.users (id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists assistant_identity_events_tenant_idx
  on public.assistant_identity_events (tenant_id, created_at desc);

alter table public.assistant_identity_events enable row level security;
revoke all on public.assistant_identity_events from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Helpers (_aid_)
-- ---------------------------------------------------------------------------
create or replace function public._aid_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._aid_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.users where auth_user_id = auth.uid() limit 1;
$$;

create or replace function public._aid_ensure_settings(p_tenant_id uuid)
returns public.assistant_identity_settings language plpgsql security definer set search_path = public as $$
declare v_row public.assistant_identity_settings;
begin
  insert into public.assistant_identity_settings (tenant_id) values (p_tenant_id)
  on conflict (tenant_id) do nothing;
  select * into v_row from public.assistant_identity_settings where tenant_id = p_tenant_id;
  return v_row;
end; $$;

create or replace function public._aid_ensure_profile(p_tenant_id uuid, p_user_id uuid)
returns public.assistant_identity_profiles language plpgsql security definer set search_path = public as $$
declare v_row public.assistant_identity_profiles;
begin
  insert into public.assistant_identity_profiles (tenant_id, user_id) values (p_tenant_id, p_user_id)
  on conflict (tenant_id, user_id) do nothing;
  select * into v_row from public.assistant_identity_profiles
  where tenant_id = p_tenant_id and user_id is not distinct from p_user_id;
  return v_row;
end; $$;

create or replace function public._aid_log_event(
  p_tenant_id uuid, p_user_id uuid, p_event_type text, p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.assistant_identity_events (tenant_id, user_id, event_type, metadata)
  values (p_tenant_id, p_user_id, p_event_type, coalesce(p_metadata, '{}'::jsonb));
  perform public._tacc_log_audit(
    p_tenant_id, 'user', 'assistant_identity.' || p_event_type, 'assistant_identity', 'success', null, p_metadata
  );
end; $$;

create or replace function public._aid_profile_json(p public.assistant_identity_profiles)
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'id', p.id, 'assistant_owner_name', p.assistant_owner_name,
    'preferred_address_name', p.preferred_address_name, 'address_name_mode', p.address_name_mode,
    'preferred_communication_style', p.preferred_communication_style,
    'primary_focus_areas', p.primary_focus_areas,
    'uncertainty_handling_preference', p.uncertainty_handling_preference,
    'welcome_completed', p.welcome_completed, 'welcome_completed_at', p.welcome_completed_at,
    'welcome_step', p.welcome_step
  );
$$;

-- KC category
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'assistant-identity', 'Assistant Identity', 'Welcome experience, tone, and personalization.', 'authenticated', 10
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'assistant-identity' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 7. Seed global phrase templates
-- ---------------------------------------------------------------------------
insert into public.assistant_phrase_templates (tenant_id, phrase_key, category, language, tone, body, variables)
values
  (null, 'welcome.main', 'welcome', 'no', 'professional_warm',
   E'Hei, {{name}}.\nJeg gleder meg utrolig mye til å være din assistent.\nTusen takk for at du valgte meg.\nMitt mål er å hjelpe deg med å holde oversikt, varsle om viktige ting og gi deg gode anbefalinger underveis.\nDu har alltid kontroll over beslutningene. Når jeg er usikker, spør jeg. Når jeg oppdager noe viktig, sier jeg fra.\nSkal vi komme i gang?', '["name"]'::jsonb),
  (null, 'welcome.main', 'welcome', 'en', 'professional_warm',
   E'Hi, {{name}}.\nI am really looking forward to being your assistant.\nThank you for choosing me.\nMy goal is to help you stay organized, notice important things, and give you useful recommendations along the way.\nYou are always in control. When I am unsure, I will ask. When I notice something important, I will let you know.\nShall we get started?', '["name"]'::jsonb),
  (null, 'welcome.main', 'welcome', 'sv', 'professional_warm',
   E'Hej, {{name}}.\nJag ser verkligen fram emot att vara din assistent.\nTack för att du valde mig.\nMitt mål är att hjälpa dig att hålla överblick, uppmärksamma viktiga saker och ge dig bra rekommendationer längs vägen.\nDu har alltid kontrollen. När jag är osäker frågar jag. När jag upptäcker något viktigt säger jag till.\nSka vi komma igång?', '["name"]'::jsonb),
  (null, 'welcome.main', 'welcome', 'da', 'professional_warm',
   E'Hej, {{name}}.\nJeg glæder mig virkelig til at være din assistent.\nTak fordi du valgte mig.\nMit mål er at hjælpe dig med at holde overblik, opdage vigtige ting og give dig gode anbefalinger undervejs.\nDu har altid kontrollen. Når jeg er usikker, spørger jeg. Når jeg opdager noget vigtigt, siger jeg til.\nSkal vi komme i gang?', '["name"]'::jsonb),
  (null, 'welcome.ask_owner', 'welcome', 'no', 'professional_warm',
   'Hei! Før vi begynner, hvem har ansatt meg?', '[]'::jsonb),
  (null, 'welcome.ask_owner', 'welcome', 'en', 'professional_warm',
   'Hi! Before we begin, who hired me?', '[]'::jsonb),
  (null, 'daily_greeting.morning', 'daily_greeting', 'no', 'professional_warm',
   'God morgen, {{name}}. Jeg har gjort klar en oversikt over det viktigste siden sist.', '["name"]'::jsonb),
  (null, 'daily_greeting.morning', 'daily_greeting', 'en', 'professional_warm',
   'Good morning, {{name}}. I have prepared an overview of what matters since you were last here.', '["name"]'::jsonb),
  (null, 'since_last_login.greeting', 'since_last_login', 'no', 'professional_warm',
   'Velkommen tilbake, {{name}}. Jeg har samlet det som trenger oppmerksomhet.', '["name"]'::jsonb),
  (null, 'since_last_login.greeting', 'since_last_login', 'en', 'professional_warm',
   'Welcome back, {{name}}. I have gathered what needs your attention.', '["name"]'::jsonb),
  (null, 'desktop.notification', 'desktop_notification', 'no', 'professional_warm',
   'Hei, {{name}}. Jeg fant noe som kan være lurt å se på.', '["name"]'::jsonb),
  (null, 'desktop.notification', 'desktop_notification', 'en', 'professional_warm',
   'Hi, {{name}}. I found something you may want to look at.', '["name"]'::jsonb),
  (null, 'desktop.reminder', 'reminder', 'no', 'professional_warm',
   '{{name}}, du ba meg minne deg på dette nå.', '["name"]'::jsonb),
  (null, 'desktop.reminder', 'reminder', 'en', 'professional_warm',
   '{{name}}, you asked me to remind you about this now.', '["name"]'::jsonb),
  (null, 'uncertainty.ask', 'uncertainty', 'no', 'professional_warm',
   'Jeg er ikke helt sikker på hva som er riktig her. Kan du hjelpe meg å forstå hvordan du ønsker at jeg skal håndtere lignende situasjoner fremover?', '[]'::jsonb),
  (null, 'approval.required', 'approval_request', 'no', 'professional_warm',
   'Dette krever godkjenning før jeg kan gå videre.', '[]'::jsonb),
  (null, 'safe_boundary.control', 'safe_boundary', 'no', 'professional_warm',
   'Du har alltid kontroll. Jeg anbefaler — du bestemmer.', '[]'::jsonb),
  (null, 'welcome.unonight', 'welcome', 'no', 'professional_warm',
   E'Hei, {{name}}. Jeg gleder meg utrolig mye til å være din assistent for Unonight.\nTusen takk for at du valgte meg.\nJeg skal hjelpe deg med support, verifiseringer, kvalitetssjekk, rapporter og varsler — men du har alltid kontroll.', '["name"]'::jsonb)
on conflict (tenant_id, phrase_key, language) do nothing;

-- ---------------------------------------------------------------------------
-- 8. Render phrase
-- ---------------------------------------------------------------------------
create or replace function public.render_assistant_phrase(
  p_phrase_key text,
  p_language text default 'en',
  p_variables jsonb default '{}'::jsonb
)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_body text;
  v_key text;
  v_val text;
begin
  v_tenant_id := public._presence_tenant_for_auth();

  select body into v_body from public.assistant_phrase_templates
  where phrase_key = p_phrase_key and language = p_language and status = 'active'
    and (tenant_id is null or tenant_id = v_tenant_id)
  order by tenant_id nulls last
  limit 1;

  if v_body is null then
    select body into v_body from public.assistant_phrase_templates
    where phrase_key = p_phrase_key and language = 'en' and status = 'active' and tenant_id is null
    limit 1;
  end if;

  if v_body is null then return ''; end if;

  for v_key, v_val in select * from jsonb_each_text(coalesce(p_variables, '{}'::jsonb))
  loop
    v_body := replace(v_body, '{{' || v_key || '}}', coalesce(v_val, ''));
  end loop;

  return v_body;
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Profile & welcome RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_assistant_identity_profile()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_settings public.assistant_identity_settings;
  v_profile public.assistant_identity_profiles;
  v_prefs public.assistant_communication_preferences;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_user_id := public._aid_auth_user_id();
  v_settings := public._aid_ensure_settings(v_tenant_id);
  v_profile := public._aid_ensure_profile(v_tenant_id, v_user_id);

  select * into v_prefs from public.assistant_communication_preferences
  where tenant_id = v_tenant_id and user_id = v_user_id;

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_settings.enabled,
    'require_welcome_flow', v_settings.require_welcome_flow,
    'profile', public._aid_profile_json(v_profile),
    'preferences', case when v_prefs.id is not null then jsonb_build_object(
      'preferred_language', v_prefs.preferred_language,
      'preferred_tone', v_prefs.preferred_tone,
      'use_name_in_greetings', v_prefs.use_name_in_greetings,
      'allow_personalized_phrases', v_prefs.allow_personalized_phrases,
      'allow_encouragement', v_prefs.allow_encouragement,
      'reminder_style', v_prefs.reminder_style,
      'notification_style', v_prefs.notification_style
    ) else null end,
    'display_name', coalesce(v_profile.preferred_address_name, v_profile.assistant_owner_name),
    'privacy_note', 'Personalization is tenant-isolated. You remain in control of all decisions.'
  );
end; $$;

create or replace function public.start_assistant_welcome()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();
  perform public._aid_ensure_settings(v_tenant_id);
  perform public._aid_ensure_profile(v_tenant_id, v_user_id);
  perform public._aid_log_event(v_tenant_id, v_user_id, 'welcome_started', '{}'::jsonb);
  return jsonb_build_object(
    'started', true,
    'ask_owner_phrase', public.render_assistant_phrase('welcome.ask_owner', 'no', '{}'::jsonb)
  );
end; $$;

create or replace function public.update_assistant_identity_profile(p_profile jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.assistant_identity_profiles;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();
  v_profile := public._aid_ensure_profile(v_tenant_id, v_user_id);

  update public.assistant_identity_profiles set
    assistant_owner_name = coalesce(p_profile->>'assistant_owner_name', assistant_owner_name),
    preferred_address_name = coalesce(p_profile->>'preferred_address_name', preferred_address_name),
    address_name_mode = coalesce(p_profile->>'address_name_mode', address_name_mode),
    preferred_communication_style = coalesce(p_profile->>'preferred_communication_style', preferred_communication_style),
    primary_focus_areas = case when p_profile ? 'primary_focus_areas'
      then array(select jsonb_array_elements_text(p_profile->'primary_focus_areas')) else primary_focus_areas end,
    uncertainty_handling_preference = coalesce(p_profile->>'uncertainty_handling_preference', uncertainty_handling_preference),
    welcome_step = coalesce((p_profile->>'welcome_step')::int, welcome_step),
    updated_at = now()
  where id = v_profile.id
  returning * into v_profile;

  if p_profile ? 'assistant_owner_name' then
    perform public._aid_log_event(v_tenant_id, v_user_id, 'owner_name_set',
      jsonb_build_object('name', p_profile->>'assistant_owner_name'));
  end if;

  return public._aid_profile_json(v_profile);
end; $$;

create or replace function public.complete_assistant_welcome(p_profile jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.assistant_identity_profiles;
  v_name text;
  v_language text;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();

  if p_profile <> '{}'::jsonb then
    perform public.update_assistant_identity_profile(p_profile);
  end if;

  update public.assistant_identity_profiles set
    welcome_completed = true, welcome_completed_at = now(), welcome_step = 6, updated_at = now()
  where tenant_id = v_tenant_id and user_id is not distinct from v_user_id
  returning * into v_profile;

  v_name := coalesce(v_profile.preferred_address_name, v_profile.assistant_owner_name, '');
  v_language := coalesce(
    (select preferred_language from public.assistant_communication_preferences where tenant_id = v_tenant_id and user_id = v_user_id),
    (select default_language from public.assistant_identity_settings where tenant_id = v_tenant_id),
    'en'
  );

  insert into public.assistant_communication_preferences (tenant_id, user_id, preferred_language, preferred_tone)
  values (v_tenant_id, v_user_id, v_language, v_profile.preferred_communication_style)
  on conflict (tenant_id, user_id) do update set
    preferred_language = excluded.preferred_language,
    preferred_tone = excluded.preferred_tone,
    updated_at = now();

  perform public._mem_upsert_profile(
    v_tenant_id, v_user_id, 'user', 'assistant.owner_name',
    jsonb_build_object('value', v_profile.assistant_owner_name),
    'Assistant Identity welcome flow', 'assistant_identity', 0.9
  );
  perform public._mem_upsert_profile(
    v_tenant_id, v_user_id, 'user', 'assistant.communication_style',
    jsonb_build_object('value', v_profile.preferred_communication_style),
    'Assistant Identity welcome flow', 'assistant_identity', 0.9
  );
  perform public._mem_upsert_profile(
    v_tenant_id, v_user_id, 'user', 'assistant.focus_areas',
    jsonb_build_object('value', v_profile.primary_focus_areas),
    'Assistant Identity welcome flow', 'assistant_identity', 0.85
  );

  perform public._aid_log_event(v_tenant_id, v_user_id, 'welcome_completed',
    jsonb_build_object('name', v_name));

  return jsonb_build_object(
    'completed', true,
    'welcome_message', public.render_assistant_phrase('welcome.main', v_language, jsonb_build_object('name', v_name)),
    'profile', public._aid_profile_json(v_profile)
  );
end; $$;

create or replace function public.get_assistant_identity_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.assistant_identity_profiles;
  v_settings public.assistant_identity_settings;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_user_id := public._aid_auth_user_id();
  v_settings := public._aid_ensure_settings(v_tenant_id);
  v_profile := public._aid_ensure_profile(v_tenant_id, v_user_id);

  return jsonb_build_object(
    'has_customer', true,
    'welcome_completed', v_profile.welcome_completed,
    'require_welcome_flow', v_settings.require_welcome_flow and not v_profile.welcome_completed,
    'display_name', coalesce(v_profile.preferred_address_name, v_profile.assistant_owner_name),
    'philosophy', 'Aipify is your professional assistant — warm, respectful, and always under your control.'
  );
end; $$;

create or replace function public.get_assistant_greeting(p_context text default 'daily_greeting', p_language text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_profile public.assistant_identity_profiles;
  v_prefs public.assistant_communication_preferences;
  v_name text;
  v_lang text;
  v_phrase_key text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;
  v_user_id := public._aid_auth_user_id();
  v_profile := public._aid_ensure_profile(v_tenant_id, v_user_id);
  select * into v_prefs from public.assistant_communication_preferences where tenant_id = v_tenant_id and user_id = v_user_id;

  if coalesce(v_prefs.use_name_in_greetings, true) = false then
    v_name := '';
  else
    v_name := coalesce(v_profile.preferred_address_name, v_profile.assistant_owner_name, '');
  end if;

  v_lang := coalesce(p_language, v_prefs.preferred_language,
    (select default_language from public.assistant_identity_settings where tenant_id = v_tenant_id), 'en');

  v_phrase_key := case p_context
    when 'since_last_login' then 'since_last_login.greeting'
    when 'desktop_notification' then 'desktop.notification'
    when 'desktop_reminder' then 'desktop.reminder'
    when 'morning' then 'daily_greeting.morning'
    else 'daily_greeting.morning'
  end;

  return jsonb_build_object(
    'has_customer', true,
    'greeting', public.render_assistant_phrase(v_phrase_key, v_lang, jsonb_build_object('name', v_name)),
    'display_name', v_name,
    'use_personalization', coalesce(v_prefs.allow_personalized_phrases, true)
  );
end; $$;

create or replace function public.update_assistant_communication_preferences(p_prefs jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();
  if v_user_id is null then raise exception 'User not found'; end if;

  insert into public.assistant_communication_preferences (tenant_id, user_id) values (v_tenant_id, v_user_id)
  on conflict (tenant_id, user_id) do nothing;

  update public.assistant_communication_preferences set
    preferred_language = coalesce(p_prefs->>'preferred_language', preferred_language),
    preferred_tone = coalesce(p_prefs->>'preferred_tone', preferred_tone),
    use_name_in_greetings = coalesce((p_prefs->>'use_name_in_greetings')::boolean, use_name_in_greetings),
    allow_personalized_phrases = coalesce((p_prefs->>'allow_personalized_phrases')::boolean, allow_personalized_phrases),
    allow_encouragement = coalesce((p_prefs->>'allow_encouragement')::boolean, allow_encouragement),
    reminder_style = coalesce(p_prefs->>'reminder_style', reminder_style),
    notification_style = coalesce(p_prefs->>'notification_style', notification_style),
    updated_at = now()
  where tenant_id = v_tenant_id and user_id = v_user_id;

  perform public._aid_log_event(v_tenant_id, v_user_id, 'preferences_set', p_prefs);
  return public.get_assistant_identity_profile();
end; $$;

create or replace function public.get_assistant_identity_settings()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_s public.assistant_identity_settings;
begin
  v_tenant_id := public._aid_require_tenant();
  v_s := public._aid_ensure_settings(v_tenant_id);
  return jsonb_build_object(
    'enabled', v_s.enabled, 'require_welcome_flow', v_s.require_welcome_flow,
    'allow_user_level_preferences', v_s.allow_user_level_preferences,
    'allow_tenant_phrase_overrides', v_s.allow_tenant_phrase_overrides,
    'default_tone', v_s.default_tone, 'default_language', v_s.default_language
  );
end; $$;

create or replace function public.update_assistant_identity_settings(p_settings jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();
  insert into public.assistant_identity_settings (tenant_id) values (v_tenant_id) on conflict (tenant_id) do nothing;
  update public.assistant_identity_settings set
    enabled = coalesce((p_settings->>'enabled')::boolean, enabled),
    require_welcome_flow = coalesce((p_settings->>'require_welcome_flow')::boolean, require_welcome_flow),
    allow_user_level_preferences = coalesce((p_settings->>'allow_user_level_preferences')::boolean, allow_user_level_preferences),
    allow_tenant_phrase_overrides = coalesce((p_settings->>'allow_tenant_phrase_overrides')::boolean, allow_tenant_phrase_overrides),
    default_tone = coalesce(p_settings->>'default_tone', default_tone),
    default_language = coalesce(p_settings->>'default_language', default_language),
    updated_at = now()
  where tenant_id = v_tenant_id;
  perform public._aid_log_event(v_tenant_id, v_user_id, 'settings_updated', p_settings);
  return public.get_assistant_identity_settings();
end; $$;

create or replace function public.reset_assistant_welcome()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid; v_user_id uuid;
begin
  v_tenant_id := public._aid_require_tenant();
  v_user_id := public._aid_auth_user_id();
  update public.assistant_identity_profiles set
    welcome_completed = false, welcome_completed_at = null, welcome_step = 0, updated_at = now()
  where tenant_id = v_tenant_id and user_id is not distinct from v_user_id;
  perform public._aid_log_event(v_tenant_id, v_user_id, 'identity_reset', '{}'::jsonb);
  return jsonb_build_object('reset', true);
end; $$;

create or replace function public.seed_unonight_assistant_identity()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  select c.id into v_tenant_id from public.customers c
  join public.companies co on co.id = c.company_id
  where lower(co.slug) = 'unonight' or lower(c.name) like '%unonight%' limit 1;
  if v_tenant_id is null then return jsonb_build_object('seeded', false); end if;

  insert into public.assistant_identity_profiles (
    tenant_id, user_id, assistant_owner_name, preferred_address_name,
    preferred_communication_style, primary_focus_areas, welcome_completed, welcome_completed_at, welcome_step
  ) values (
    v_tenant_id, null, 'Svein', 'Svein', 'professional_warm',
    array['support', 'quality', 'administration'], true, now(), 6
  ) on conflict (tenant_id, user_id) do update set
    assistant_owner_name = 'Svein', preferred_address_name = 'Svein', welcome_completed = true, updated_at = now();

  return jsonb_build_object('seeded', true, 'tenant_id', v_tenant_id,
    'welcome_message', public.render_assistant_phrase('welcome.unonight', 'no', '{"name":"Svein"}'::jsonb));
end; $$;

-- Grants
grant execute on function public.get_assistant_identity_profile() to authenticated;
grant execute on function public.start_assistant_welcome() to authenticated;
grant execute on function public.update_assistant_identity_profile(jsonb) to authenticated;
grant execute on function public.complete_assistant_welcome(jsonb) to authenticated;
grant execute on function public.get_assistant_identity_card() to authenticated;
grant execute on function public.get_assistant_greeting(text, text) to authenticated;
grant execute on function public.render_assistant_phrase(text, text, jsonb) to authenticated;
grant execute on function public.update_assistant_communication_preferences(jsonb) to authenticated;
grant execute on function public.get_assistant_identity_settings() to authenticated;
grant execute on function public.update_assistant_identity_settings(jsonb) to authenticated;
grant execute on function public.reset_assistant_welcome() to authenticated;
grant execute on function public.seed_unonight_assistant_identity() to authenticated;
