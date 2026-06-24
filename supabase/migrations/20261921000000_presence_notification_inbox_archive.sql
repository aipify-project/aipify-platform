-- Presence notification inbox archive lifecycle + independent preference toggles.

alter table public.presence_notifications
  add column if not exists archived_at timestamptz;

create index if not exists presence_notifications_inbox_active_idx
  on public.presence_notifications (tenant_id, created_at desc)
  where archived_at is null;

create index if not exists presence_notifications_inbox_archived_idx
  on public.presence_notifications (tenant_id, archived_at desc)
  where archived_at is not null;

alter table public.presence_notification_preferences
  add column if not exists sound_enabled boolean not null default true,
  add column if not exists companion_replies_enabled boolean not null default true,
  add column if not exists approvals_critical_enabled boolean not null default true;

update public.presence_notification_preferences p
set
  sound_enabled = p.min_level_in_app <> 'critical',
  companion_replies_enabled = p.min_level_in_app in ('informational', 'action_required'),
  approvals_critical_enabled = p.min_level_in_app in ('informational', 'important')
where true;

create or replace function public._presence_notification_is_test(p_metadata jsonb)
returns boolean
language sql
immutable
as $$
  select coalesce((p_metadata ->> 'is_test')::boolean, false)
      or coalesce((p_metadata ->> 'test_notification')::boolean, false)
      or coalesce(p_metadata ->> 'source_provenance', '') = 'certification';
$$;

create or replace function public._presence_notification_dedupe_key(p_event_type text, p_metadata jsonb)
returns text
language sql
immutable
as $$
  select case
    when p_event_type = 'companion_reply_ready' then coalesce(
      nullif(trim(p_metadata ->> 'conversation_id'), ''),
      nullif(trim(p_metadata ->> 'job_id'), ''),
      nullif(trim(p_metadata ->> 'dedupe_key'), ''),
      null
    )
    else null
  end;
$$;

create or replace function public.list_presence_notifications(
  p_limit integer default 20,
  p_unread_only boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('notifications', '[]'::jsonb, 'unread_count', 0);
  end if;

  return jsonb_build_object(
    'notifications', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', d.id,
            'event_type', d.event_type,
            'level', d.level,
            'title', d.title,
            'body', d.body,
            'status', d.status,
            'channels', d.channels,
            'actions', d.actions,
            'action_href', d.action_href,
            'metadata', d.metadata,
            'created_at', d.created_at,
            'read_at', d.read_at,
            'archived_at', d.archived_at
          )
          order by d.created_at desc
        )
        from (
          select distinct on (
            coalesce(public._presence_notification_dedupe_key(n.event_type, n.metadata), n.id::text)
          ) n.*
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.archived_at is null
            and not public._presence_notification_is_test(n.metadata)
            and (
              not p_unread_only
              or n.status in ('pending', 'delivered')
            )
          order by
            coalesce(public._presence_notification_dedupe_key(n.event_type, n.metadata), n.id::text),
            n.created_at desc
        ) d
        limit greatest(p_limit, 1)
      ),
      '[]'::jsonb
    ),
    'unread_count', (
      select count(*)::integer
      from public.presence_notifications n
      where n.tenant_id = v_tenant_id
        and n.archived_at is null
        and not public._presence_notification_is_test(n.metadata)
        and n.status in ('pending', 'delivered')
    )
  );
end;
$$;

create or replace function public.list_presence_notification_inbox(
  p_filter text default 'all',
  p_limit integer default 25,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_limit integer := greatest(least(coalesce(p_limit, 25), 50), 1);
  v_offset integer := greatest(coalesce(p_offset, 0), 0);
  v_filter text := lower(coalesce(nullif(trim(p_filter), ''), 'all'));
  v_rows jsonb := '[]'::jsonb;
  v_has_more boolean := false;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object(
      'notifications', '[]'::jsonb,
      'filter', v_filter,
      'limit', v_limit,
      'offset', v_offset,
      'has_more', false,
      'counts', jsonb_build_object('unread', 0, 'all', 0, 'archived', 0)
    );
  end if;

  with filtered as (
    select distinct on (
      coalesce(public._presence_notification_dedupe_key(n.event_type, n.metadata), n.id::text)
    )
      n.*
    from public.presence_notifications n
    where n.tenant_id = v_tenant_id
      and not public._presence_notification_is_test(n.metadata)
      and (
        (v_filter = 'archived' and n.archived_at is not null)
        or (
          v_filter <> 'archived'
          and n.archived_at is null
          and (
            v_filter = 'all'
            or (v_filter = 'unread' and n.status in ('pending', 'delivered'))
          )
        )
      )
    order by
      coalesce(public._presence_notification_dedupe_key(n.event_type, n.metadata), n.id::text),
      n.created_at desc
  ),
  ordered as (
    select *
    from filtered
    order by case when v_filter = 'archived' then archived_at else created_at end desc nulls last
  ),
  page as (
    select *
    from ordered
    offset v_offset
    limit v_limit + 1
  )
  select
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'event_type', p.event_type,
            'level', p.level,
            'title', p.title,
            'body', p.body,
            'status', p.status,
            'channels', p.channels,
            'actions', p.actions,
            'action_href', p.action_href,
            'metadata', p.metadata,
            'created_at', p.created_at,
            'read_at', p.read_at,
            'archived_at', p.archived_at
          )
          order by case when v_filter = 'archived' then p.archived_at else p.created_at end desc nulls last
        )
        from (select * from page limit v_limit) p
      ),
      '[]'::jsonb
    ),
    (select count(*) > v_limit from page)
  into v_rows, v_has_more;

  return jsonb_build_object(
    'notifications', v_rows,
    'filter', v_filter,
    'limit', v_limit,
    'offset', v_offset,
    'has_more', v_has_more,
    'counts', jsonb_build_object(
      'unread', (
        select count(*)::integer
        from public.presence_notifications n
        where n.tenant_id = v_tenant_id
          and n.archived_at is null
          and not public._presence_notification_is_test(n.metadata)
          and n.status in ('pending', 'delivered')
      ),
      'all', (
        select count(*)::integer
        from (
          select distinct coalesce(public._presence_notification_dedupe_key(n.event_type, n.metadata), n.id::text)
          from public.presence_notifications n
          where n.tenant_id = v_tenant_id
            and n.archived_at is null
            and not public._presence_notification_is_test(n.metadata)
        ) active_rows
      ),
      'archived', (
        select count(*)::integer
        from public.presence_notifications n
        where n.tenant_id = v_tenant_id
          and n.archived_at is not null
          and not public._presence_notification_is_test(n.metadata)
      )
    )
  );
end;
$$;

create or replace function public.perform_presence_notification_action(
  p_notification_id uuid,
  p_action_type text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_notification public.presence_notifications;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  select * into v_notification
  from public.presence_notifications n
  where n.id = p_notification_id and n.tenant_id = v_tenant_id;

  if v_notification.id is null then
    raise exception 'Notification not found';
  end if;

  if p_action_type = 'archive' then
    update public.presence_notifications
    set archived_at = coalesce(archived_at, now()),
        read_at = coalesce(read_at, now())
    where id = p_notification_id;
  elsif p_action_type = 'dismiss' then
    update public.presence_notifications
    set status = 'dismissed', dismissed_at = now(), archived_at = coalesce(archived_at, now())
    where id = p_notification_id;
  elsif p_action_type = 'mark_as_reviewed' then
    update public.presence_notifications
    set status = 'read', read_at = coalesce(read_at, now())
    where id = p_notification_id;
  elsif p_action_type in (
    'view_details', 'open_dashboard', 'approve', 'approve_recommendation', 'escalate'
  ) then
    update public.presence_notifications
    set status = 'acted', read_at = coalesce(read_at, now())
    where id = p_notification_id;
  else
    raise exception 'Invalid action type';
  end if;

  perform public.record_presence_engagement(
    'notification_action', p_action_type, p_notification_id, 'web', '{}'::jsonb
  );

  return jsonb_build_object(
    'notification_id', p_notification_id,
    'action', p_action_type,
    'href', v_notification.action_href
  );
end;
$$;

create or replace function public.perform_presence_notification_bulk_action(
  p_action_type text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_updated integer := 0;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  if p_action_type = 'mark_all_read' then
    update public.presence_notifications n
    set status = 'read', read_at = coalesce(n.read_at, now())
    where n.tenant_id = v_tenant_id
      and n.archived_at is null
      and not public._presence_notification_is_test(n.metadata)
      and n.status in ('pending', 'delivered');
    get diagnostics v_updated = row_count;
  elsif p_action_type = 'archive_all_read' then
    update public.presence_notifications n
    set archived_at = coalesce(n.archived_at, now())
    where n.tenant_id = v_tenant_id
      and n.archived_at is null
      and not public._presence_notification_is_test(n.metadata)
      and (
        n.read_at is not null
        or n.status not in ('pending', 'delivered')
      );
    get diagnostics v_updated = row_count;
  else
    raise exception 'Invalid bulk action type';
  end if;

  return jsonb_build_object('action', p_action_type, 'updated_count', v_updated);
end;
$$;

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
  v_row.sound_enabled := true;
  v_row.companion_replies_enabled := true;
  v_row.approvals_critical_enabled := true;
  v_row.updated_at := now();
  return v_row;
end;
$$;

drop function if exists public.update_presence_notification_preferences(
  text, time, time, text, date, boolean, boolean, boolean, boolean, text, text, text, boolean, boolean
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
  p_playful_moments_enabled boolean default null,
  p_sound_enabled boolean default null,
  p_companion_replies_enabled boolean default null,
  p_approvals_critical_enabled boolean default null
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
  v_sound boolean;
  v_companion boolean;
  v_approvals boolean;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_prefs := public.ensure_presence_notification_preferences(v_tenant_id);

  v_sound := coalesce(p_sound_enabled, v_prefs.sound_enabled);
  v_companion := coalesce(p_companion_replies_enabled, v_prefs.companion_replies_enabled);
  v_approvals := coalesce(p_approvals_critical_enabled, v_prefs.approvals_critical_enabled);

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
    min_level_in_app = case
      when coalesce(p_channel_in_app, channel_in_app) = false then min_level_in_app
      when not v_sound then 'critical'
      when not v_companion and not v_approvals then 'critical'
      when not v_companion then 'important'
      when not v_approvals then 'action_required'
      else 'informational'
    end,
    min_level_desktop = coalesce(p_min_level_desktop, min_level_desktop),
    min_level_email = coalesce(p_min_level_email, min_level_email),
    quiet_hours_enabled = coalesce(p_quiet_hours_enabled, quiet_hours_enabled),
    sound_enabled = v_sound,
    companion_replies_enabled = v_companion,
    approvals_critical_enabled = v_approvals,
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

grant execute on function public.list_presence_notification_inbox(text, integer, integer) to authenticated;
grant execute on function public.perform_presence_notification_bulk_action(text) to authenticated;
grant execute on function public.update_presence_notification_preferences(
  text, time, time, text, date, boolean, boolean, boolean, boolean, text, text, text, boolean, boolean, boolean, boolean, boolean
) to authenticated;

-- Archive explicit test notifications without deleting user history.
update public.presence_notifications n
set archived_at = coalesce(n.archived_at, now())
where public._presence_notification_is_test(n.metadata)
  and n.archived_at is null;
