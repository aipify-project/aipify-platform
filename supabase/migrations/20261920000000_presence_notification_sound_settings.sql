-- P0 — Expose notification sound + quiet hour controls on existing presence preferences.

alter table public.presence_notification_preferences
  add column if not exists quiet_hours_enabled boolean not null default false;

create or replace function public._presence_read_notification_preferences(p_tenant_id uuid)
returns public.presence_notification_preferences
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.presence_notification_preferences;
  v_default_tz text;
begin
  select * into v_row
  from public.presence_notification_preferences
  where tenant_id = p_tenant_id;

  if found then
    return v_row;
  end if;

  v_default_tz := coalesce(public.resolve_customer_timezone(p_tenant_id), 'UTC');
  v_row.id := null;
  v_row.tenant_id := p_tenant_id;
  v_row.quiet_hours_mode := 'standard';
  v_row.working_hours_start := '09:00';
  v_row.working_hours_end := '17:00';
  v_row.timezone := v_default_tz;
  v_row.vacation_until := null;
  v_row.channel_in_app := true;
  v_row.channel_desktop := true;
  v_row.channel_email_digest := false;
  v_row.channel_mobile_push := false;
  v_row.min_level_in_app := 'informational';
  v_row.min_level_desktop := 'important';
  v_row.min_level_email := 'important';
  v_row.quiet_hours_enabled := false;
  v_row.updated_at := now();
  return v_row;
end;
$$;

create or replace function public.get_presence_notification_preferences()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_prefs public.presence_notification_preferences;
  v_personality public.personality_settings;
  v_prefs_json jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  if not public.has_organization_permission('settings.view')
     and not public.has_organization_permission('settings.manage') then
    raise exception 'Permission denied: settings.view';
  end if;

  v_prefs := public.ensure_presence_notification_preferences(v_tenant_id);
  v_prefs_json := to_jsonb(v_prefs);

  select * into v_personality
  from public.personality_settings
  where tenant_id = v_tenant_id;

  v_prefs_json := v_prefs_json || jsonb_build_object(
    'playful_moments_enabled', coalesce(v_personality.playful_moments_enabled, true)
  );

  return jsonb_build_object(
    'has_customer', true,
    'preferences', v_prefs_json
  );
end;
$$;

drop function if exists public.update_presence_notification_preferences(
  text, time, time, text, date, boolean, boolean, boolean, boolean, text, text, text
);

create or replace function public.update_presence_notification_preferences(
  p_quiet_hours_mode text default null,
  p_working_hours_start time default null,
  p_working_hours_end time default null,
  p_timezone text default null,
  p_vacation_until date default null,
  p_channel_in_app boolean default null,
  p_channel_desktop boolean default null,
  p_channel_email_digest boolean default null,
  p_channel_mobile_push boolean default null,
  p_min_level_in_app text default null,
  p_min_level_desktop text default null,
  p_min_level_email text default null,
  p_quiet_hours_enabled boolean default null,
  p_playful_moments_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_prefs public.presence_notification_preferences;
  v_personality public.personality_settings;
  v_prefs_json jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_prefs := public.ensure_presence_notification_preferences(v_tenant_id);

  update public.presence_notification_preferences
  set
    quiet_hours_mode = coalesce(p_quiet_hours_mode, quiet_hours_mode),
    working_hours_start = coalesce(p_working_hours_start, working_hours_start),
    working_hours_end = coalesce(p_working_hours_end, working_hours_end),
    timezone = coalesce(p_timezone, timezone),
    vacation_until = coalesce(p_vacation_until, vacation_until),
    channel_in_app = coalesce(p_channel_in_app, channel_in_app),
    channel_desktop = coalesce(p_channel_desktop, channel_desktop),
    channel_email_digest = coalesce(p_channel_email_digest, channel_email_digest),
    channel_mobile_push = coalesce(p_channel_mobile_push, channel_mobile_push),
    min_level_in_app = coalesce(p_min_level_in_app, min_level_in_app),
    min_level_desktop = coalesce(p_min_level_desktop, min_level_desktop),
    min_level_email = coalesce(p_min_level_email, min_level_email),
    quiet_hours_enabled = coalesce(p_quiet_hours_enabled, quiet_hours_enabled),
    updated_at = now()
  where tenant_id = v_tenant_id
  returning * into v_prefs;

  if p_playful_moments_enabled is not null then
    v_personality := public._per_ensure_settings(v_tenant_id);
    update public.personality_settings
    set
      playful_moments_enabled = p_playful_moments_enabled,
      bell_moments_enabled = p_playful_moments_enabled,
      updated_at = now()
    where tenant_id = v_tenant_id
    returning * into v_personality;
  else
    select * into v_personality
    from public.personality_settings
    where tenant_id = v_tenant_id;
  end if;

  v_prefs_json := to_jsonb(v_prefs) || jsonb_build_object(
    'playful_moments_enabled', coalesce(v_personality.playful_moments_enabled, true)
  );

  return jsonb_build_object('preferences', v_prefs_json);
end;
$$;

grant execute on function public.update_presence_notification_preferences(
  text, time, time, text, date, boolean, boolean, boolean, boolean, text, text, text, boolean, boolean
) to authenticated;
