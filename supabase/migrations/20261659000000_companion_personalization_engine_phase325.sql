-- Phase 325 — Companion Personalization Engine
-- User-controlled adaptation — style not security; org governance preserved.

create table if not exists public.companion_personalization_settings (
  organization_id           uuid primary key references public.organizations (id) on delete cascade,
  org_defaults_enabled      boolean not null default true,
  admin_manage_defaults     boolean not null default true,
  preferences               jsonb not null default '{}'::jsonb,
  updated_at                timestamptz not null default now(),
  updated_by                uuid references public.users (id) on delete set null
);

create table if not exists public.companion_personalization_profiles (
  id                    uuid primary key default gen_random_uuid(),
  organization_id       uuid not null references public.organizations (id) on delete cascade,
  user_id               uuid not null references public.users (id) on delete cascade,
  communication_styles  text[] not null default '{balanced}',
  briefing_style        text not null default 'standard' check (briefing_style in (
    'ultra_short','summary','standard','detailed','executive_report'
  )),
  notification_style    text not null default 'balanced' check (notification_style in (
    'minimal','balanced','active','high_awareness'
  )),
  companion_personality text not null default 'balanced' check (companion_personality in (
    'professional','supportive','executive','analytical','coach','balanced'
  )),
  adaptation_level      text not null default 'moderate' check (adaptation_level in (
    'low','moderate','high'
  )),
  preferred_language    text not null default 'en',
  secondary_language    text not null default '',
  report_language       text not null default 'en',
  notification_language text not null default 'en',
  notify_email          boolean not null default true,
  notify_desktop        boolean not null default true,
  notify_mobile         boolean not null default true,
  notify_in_app         boolean not null default true,
  workflow_preferences  jsonb not null default '{}'::jsonb,
  learning_preference   text not null default 'guided' check (learning_preference in (
    'guided','self_service','interactive','documentation_first','video_first'
  )),
  personalization_score integer not null default 0 check (personalization_score between 0 and 100),
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists companion_personalization_profiles_org_idx
  on public.companion_personalization_profiles (organization_id, user_id);

create table if not exists public.companion_personalization_preferences (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations (id) on delete cascade,
  user_id          uuid not null references public.users (id) on delete cascade,
  pref_key         text not null default '',
  category         text not null check (category in (
    'communication_style','briefing_preferences','notification_preferences',
    'reporting_preferences','companion_personality','workflow_preferences',
    'language_preferences','meeting_preferences','learning_preferences','productivity_preferences'
  )),
  title            text not null default '',
  value            text not null default '',
  source_key       text not null default 'user_configured',
  confidence       text not null default 'high' check (confidence in (
    'high','medium','low','unverified'
  )),
  status           text not null default 'approved' check (status in (
    'suggested','approved','rejected','active'
  )),
  is_org_default   boolean not null default false,
  updated_at       timestamptz not null default now(),
  unique (organization_id, user_id, pref_key)
);

create index if not exists companion_personalization_prefs_org_idx
  on public.companion_personalization_preferences (organization_id, user_id, category, status);

create table if not exists public.companion_personalization_insights (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid not null references public.users (id) on delete cascade,
  insight_key     text not null default '',
  title           text not null default '',
  summary         text not null check (char_length(summary) <= 500),
  insight_type    text not null default 'suggested_improvement',
  created_at      timestamptz not null default now(),
  unique (organization_id, user_id, insight_key)
);

create table if not exists public.companion_personalization_timeline (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  performed_by    uuid references public.users (id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists companion_personalization_timeline_org_idx
  on public.companion_personalization_timeline (organization_id, created_at desc);

create table if not exists public.companion_personalization_audit_logs (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id         uuid references public.users (id) on delete set null,
  event_type      text not null,
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);

alter table public.companion_personalization_settings    enable row level security;
alter table public.companion_personalization_profiles    enable row level security;
alter table public.companion_personalization_preferences enable row level security;
alter table public.companion_personalization_insights    enable row level security;
alter table public.companion_personalization_timeline    enable row level security;
alter table public.companion_personalization_audit_logs  enable row level security;
revoke all on public.companion_personalization_settings    from authenticated, anon;
revoke all on public.companion_personalization_profiles    from authenticated, anon;
revoke all on public.companion_personalization_preferences from authenticated, anon;
revoke all on public.companion_personalization_insights    from authenticated, anon;
revoke all on public.companion_personalization_timeline    from authenticated, anon;
revoke all on public.companion_personalization_audit_logs  from authenticated, anon;

create or replace function public._cpe325_access_personalization()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_role text := 'member'; v_adm boolean := true;
begin
  v_org_id  := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  select coalesce(m.role, 'member') into v_role
  from public.organization_users m
  where m.organization_id = v_org_id and m.user_id = v_user_id and m.status = 'active' limit 1;
  select coalesce(s.admin_manage_defaults, true) into v_adm
  from public.companion_personalization_settings s where s.organization_id = v_org_id;

  if v_role in ('owner', 'executive') then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_org_defaults', true, 'can_manage_org', true);
  elsif v_role in ('administrator', 'admin') and v_adm then
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_org_defaults', false, 'can_manage_org', true);
  else
    return jsonb_build_object('organization_id', v_org_id, 'user_id', v_user_id, 'role', v_role,
      'can_self', true, 'can_org_defaults', false, 'can_manage_org', false);
  end if;
end; $$;

create or replace function public._cpe325_log(
  p_org_id uuid, p_user_id uuid, p_event text, p_desc text, p_meta jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_personalization_audit_logs
    (organization_id, user_id, event_type, description, metadata)
  values (p_org_id, p_user_id, p_event, left(p_desc, 500), coalesce(p_meta, '{}'::jsonb));
end; $$;

create or replace function public._cpe325_timeline(
  p_org_id uuid, p_user_id uuid, p_event text, p_desc text
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_personalization_timeline
    (organization_id, user_id, event_type, description, performed_by)
  values (p_org_id, p_user_id, p_event, left(p_desc, 500), p_user_id);
end; $$;

create or replace function public._cpe325_score(p_org_id uuid, p_user_id uuid)
returns integer language sql stable as $$
  select coalesce(least(100, greatest(0,
    (select count(*) * 8 from public.companion_personalization_preferences p
     where p.organization_id = p_org_id and p.user_id = p_user_id and p.status = 'approved')
    + coalesce((select personalization_score from public.companion_personalization_profiles pr
                where pr.organization_id = p_org_id and pr.user_id = p_user_id), 0) / 2
  ))::integer, 0);
$$;

create or replace function public._cpe325_sync_personalization(p_org_id uuid, p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.companion_personalization_settings (organization_id)
  values (p_org_id) on conflict (organization_id) do nothing;

  insert into public.companion_personalization_profiles (
    organization_id, user_id, communication_styles, briefing_style, notification_style,
    companion_personality, adaptation_level, preferred_language, learning_preference, personalization_score
  ) values (
    p_org_id, p_user_id, array['concise','professional'], 'summary', 'balanced',
    'professional', 'moderate', 'en', 'guided', 65
  ) on conflict (organization_id, user_id) do nothing;

  insert into public.companion_personalization_preferences
    (organization_id, user_id, pref_key, category, title, value, source_key, confidence, status)
  values
    (p_org_id, p_user_id, 'comm_concise', 'communication_style', 'Concise communication', 'concise', 'user_observed', 'high', 'approved'),
    (p_org_id, p_user_id, 'brief_summary', 'briefing_preferences', 'Summary briefings', 'summary', 'user_configured', 'high', 'approved'),
    (p_org_id, p_user_id, 'notify_balanced', 'notification_preferences', 'Balanced notifications', 'balanced', 'user_configured', 'high', 'approved'),
    (p_org_id, p_user_id, 'personality_prof', 'companion_personality', 'Professional tone', 'professional', 'user_configured', 'high', 'approved'),
    (p_org_id, p_user_id, 'lang_en', 'language_preferences', 'Preferred language', 'en', 'user_configured', 'high', 'approved'),
    (p_org_id, p_user_id, 'learn_guided', 'learning_preferences', 'Guided learning', 'guided', 'user_configured', 'medium', 'approved'),
    (p_org_id, p_user_id, 'workflow_monday', 'workflow_preferences', 'Monday report review', 'weekly_monday', 'companion_observed', 'medium', 'suggested'),
    (p_org_id, p_user_id, 'prod_task_rec', 'productivity_preferences', 'Task-oriented recommendations', 'task_oriented', 'companion_observed', 'high', 'approved')
  on conflict (organization_id, user_id, pref_key) do nothing;

  insert into public.companion_personalization_insights
    (organization_id, user_id, insight_key, title, summary, insight_type)
  values
    (p_org_id, p_user_id, 'ins_concise_brief', 'Concise briefing preference',
     'You prefer concise executive briefings. Future summaries will use this format.', 'preferred_format'),
    (p_org_id, p_user_id, 'ins_monday_reports', 'Monday report pattern',
     'You often review reports on Mondays. Would you like Aipify to prepare them automatically?', 'workflow_pattern'),
    (p_org_id, p_user_id, 'ins_task_recs', 'Task-oriented recommendations',
     'You prefer task-oriented recommendations over detailed analysis.', 'preferred_actions')
  on conflict (organization_id, user_id, insight_key) do nothing;

  if not exists (
    select 1 from public.companion_personalization_timeline t
    where t.organization_id = p_org_id and t.user_id = p_user_id and t.event_type = 'workspace_initialized') then
    insert into public.companion_personalization_timeline
      (organization_id, user_id, event_type, description, performed_by)
    values (p_org_id, p_user_id, 'workspace_initialized', 'Personalization profile initialized', p_user_id);
  end if;
end; $$;

create or replace function public.get_companion_personalization_dashboard(
  p_category text default null, p_source text default null, p_confidence text default null,
  p_status text default null, p_date_from date default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_profile jsonb; v_prefs jsonb; v_timeline jsonb;
  v_active int;
begin
  v_ctx := public._cpe325_access_personalization();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpe325_sync_personalization(v_org_id, v_user_id);

  select jsonb_build_object(
    'communication_styles', p.communication_styles, 'briefing_style', p.briefing_style,
    'notification_style', p.notification_style, 'companion_personality', p.companion_personality,
    'adaptation_level', p.adaptation_level, 'preferred_language', p.preferred_language,
    'secondary_language', p.secondary_language, 'report_language', p.report_language,
    'notification_language', p.notification_language,
    'notify_email', p.notify_email, 'notify_desktop', p.notify_desktop,
    'notify_mobile', p.notify_mobile, 'notify_in_app', p.notify_in_app,
    'learning_preference', p.learning_preference, 'workflow_preferences', p.workflow_preferences,
    'personalization_score', public._cpe325_score(v_org_id, v_user_id)
  ) into v_profile
  from public.companion_personalization_profiles p
  where p.organization_id = v_org_id and p.user_id = v_user_id;

  select count(*) into v_active
  from public.companion_personalization_preferences pr
  where pr.organization_id = v_org_id and pr.user_id = v_user_id and pr.status in ('approved','active');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pr.id, 'pref_key', pr.pref_key, 'category', pr.category, 'title', pr.title,
    'value', pr.value, 'source_key', pr.source_key, 'confidence', pr.confidence,
    'status', pr.status, 'updated_at', pr.updated_at
  ) order by pr.updated_at desc),'[]'::jsonb) into v_prefs
  from public.companion_personalization_preferences pr
  where pr.organization_id = v_org_id and pr.user_id = v_user_id
    and (p_category is null or pr.category = p_category)
    and (p_source is null or pr.source_key = p_source)
    and (p_confidence is null or pr.confidence = p_confidence)
    and (p_status is null or pr.status = p_status)
    and (p_date_from is null or pr.updated_at::date >= p_date_from)
    and (p_search is null or trim(p_search) = ''
         or pr.title ilike '%'||trim(p_search)||'%' or pr.value ilike '%'||trim(p_search)||'%');

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id, 'event_type', t.event_type, 'description', t.description, 'created_at', t.created_at
  ) order by t.created_at desc),'[]'::jsonb) into v_timeline
  from (
    select * from public.companion_personalization_timeline t
    where t.organization_id = v_org_id and t.user_id = v_user_id
    order by t.created_at desc limit 12
  ) t;

  return jsonb_build_object(
    'found', true,
    'can_self', coalesce(v_ctx->>'can_self','false') = 'true',
    'can_org_defaults', coalesce(v_ctx->>'can_org_defaults','false') = 'true',
    'can_manage_org', coalesce(v_ctx->>'can_manage_org','false') = 'true',
    'has_preferences', v_active > 0,
    'personalization_score', public._cpe325_score(v_org_id, v_user_id),
    'active_preferences_count', v_active,
    'profile', coalesce(v_profile, '{}'::jsonb),
    'preferences', v_prefs,
    'timeline', v_timeline,
    'usage_examples', jsonb_build_array(
      'Aipify noticed you prefer concise executive briefings. Future summaries will use this format.',
      'You often review reports on Mondays. Would you like Aipify to prepare them automatically?',
      'You prefer task-oriented recommendations over detailed analysis.'
    ),
    'privacy_note', 'Personalization changes presentation and interaction style, not permissions or security controls.',
    'principle', 'Adapt to the user. Preserve trust. Maintain transparency. Aipify identity remains consistent.'
  );
end; $$;

create or replace function public.list_companion_personalization_preferences(
  p_category text default null, p_status text default null, p_search text default null
) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_prefs jsonb;
begin
  v_ctx := public._cpe325_access_personalization();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpe325_sync_personalization(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', pr.id, 'pref_key', pr.pref_key, 'category', pr.category, 'title', pr.title,
    'value', pr.value, 'source_key', pr.source_key, 'confidence', pr.confidence,
    'status', pr.status, 'updated_at', pr.updated_at
  ) order by case pr.status when 'suggested' then 1 else 2 end, pr.updated_at desc),'[]'::jsonb)
  into v_prefs
  from public.companion_personalization_preferences pr
  where pr.organization_id = v_org_id and pr.user_id = v_user_id
    and (p_category is null or pr.category = p_category)
    and (p_status is null or pr.status = p_status)
    and (p_search is null or trim(p_search) = ''
         or pr.title ilike '%'||trim(p_search)||'%');

  return jsonb_build_object('found', true, 'preferences', v_prefs);
end; $$;

create or replace function public.get_companion_personalization_insights()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid; v_insights jsonb;
begin
  v_ctx := public._cpe325_access_personalization();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpe325_sync_personalization(v_org_id, v_user_id);

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'title', i.title, 'summary', i.summary, 'insight_type', i.insight_type, 'created_at', i.created_at
  )),'[]'::jsonb) into v_insights
  from public.companion_personalization_insights i
  where i.organization_id = v_org_id and i.user_id = v_user_id;

  return jsonb_build_object('found', true, 'insights', v_insights);
end; $$;

create or replace function public.update_companion_personalization(
  p_briefing_style text default null,
  p_notification_style text default null,
  p_companion_personality text default null,
  p_adaptation_level text default null,
  p_preferred_language text default null,
  p_secondary_language text default null,
  p_report_language text default null,
  p_notification_language text default null,
  p_learning_preference text default null,
  p_notify_email boolean default null,
  p_notify_desktop boolean default null,
  p_notify_mobile boolean default null,
  p_notify_in_app boolean default null,
  p_communication_styles text[] default null,
  p_pref_id uuid default null,
  p_pref_status text default null,
  p_pref_value text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._cpe325_access_personalization();
  if coalesce(v_ctx->>'can_self','false') != 'true' then
    return jsonb_build_object('ok', false, 'error', 'Personalization access denied');
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;
  perform public._cpe325_sync_personalization(v_org_id, v_user_id);

  update public.companion_personalization_profiles set
    briefing_style = coalesce(p_briefing_style, briefing_style),
    notification_style = coalesce(p_notification_style, notification_style),
    companion_personality = coalesce(p_companion_personality, companion_personality),
    adaptation_level = coalesce(p_adaptation_level, adaptation_level),
    preferred_language = coalesce(p_preferred_language, preferred_language),
    secondary_language = coalesce(nullif(p_secondary_language, ''), secondary_language),
    report_language = coalesce(p_report_language, report_language),
    notification_language = coalesce(p_notification_language, notification_language),
    learning_preference = coalesce(p_learning_preference, learning_preference),
    notify_email = coalesce(p_notify_email, notify_email),
    notify_desktop = coalesce(p_notify_desktop, notify_desktop),
    notify_mobile = coalesce(p_notify_mobile, notify_mobile),
    notify_in_app = coalesce(p_notify_in_app, notify_in_app),
    communication_styles = coalesce(p_communication_styles, communication_styles),
    personalization_score = public._cpe325_score(v_org_id, v_user_id),
    updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id;

  if p_pref_id is not null then
    update public.companion_personalization_preferences set
      status = coalesce(p_pref_status, status),
      value = coalesce(nullif(p_pref_value, ''), value),
      updated_at = now()
    where id = p_pref_id and organization_id = v_org_id and user_id = v_user_id;
  end if;

  perform public._cpe325_timeline(v_org_id, v_user_id, 'preference_changed', 'Personalization updated');
  perform public._cpe325_log(v_org_id, v_user_id, 'personalization_updated', 'Personalization updated');

  return jsonb_build_object('ok', true);
end; $$;

create or replace function public.reset_companion_personalization()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_ctx jsonb; v_org_id uuid; v_user_id uuid;
begin
  v_ctx := public._cpe325_access_personalization();
  if coalesce(v_ctx->>'can_self','false') != 'true' then
    return jsonb_build_object('ok', false, 'error', 'Reset access denied');
  end if;
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_user_id := (v_ctx->>'user_id')::uuid;

  update public.companion_personalization_profiles set
    communication_styles = '{balanced}', briefing_style = 'standard',
    notification_style = 'balanced', companion_personality = 'balanced',
    adaptation_level = 'moderate', preferred_language = 'en', secondary_language = '',
    report_language = 'en', notification_language = 'en', learning_preference = 'guided',
    notify_email = true, notify_desktop = true, notify_mobile = true, notify_in_app = true,
    workflow_preferences = '{}'::jsonb, personalization_score = 40, updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id;

  update public.companion_personalization_preferences set status = 'rejected', updated_at = now()
  where organization_id = v_org_id and user_id = v_user_id and source_key = 'companion_observed';

  perform public._cpe325_timeline(v_org_id, v_user_id, 'preference_reset', 'Personalization reset to defaults');
  perform public._cpe325_log(v_org_id, v_user_id, 'personalization_reset', 'Personalization reset');

  return jsonb_build_object('ok', true);
end; $$;

grant execute on function public.get_companion_personalization_dashboard(text,text,text,text,date,text) to authenticated;
grant execute on function public.list_companion_personalization_preferences(text,text,text) to authenticated;
grant execute on function public.get_companion_personalization_insights() to authenticated;
grant execute on function public.update_companion_personalization(text,text,text,text,text,text,text,text,text,boolean,boolean,boolean,boolean,text[],uuid,text,text) to authenticated;
grant execute on function public.reset_companion_personalization() to authenticated;
