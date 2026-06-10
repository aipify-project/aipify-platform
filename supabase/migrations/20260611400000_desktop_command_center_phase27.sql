-- Phase 27 — Desktop Command Center (Tauri client foundation, macOS Phase 1)

-- ---------------------------------------------------------------------------
-- 1. Desktop client sessions (secure tokens — never store installation secrets)
-- ---------------------------------------------------------------------------
create table if not exists public.presence_desktop_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.presence_desktop_clients (id) on delete cascade,
  tenant_id uuid not null references public.customers (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists presence_desktop_sessions_client_idx
  on public.presence_desktop_sessions (client_id);
create index if not exists presence_desktop_sessions_tenant_idx
  on public.presence_desktop_sessions (tenant_id);

alter table public.presence_desktop_sessions enable row level security;
revoke all on public.presence_desktop_sessions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Token helpers
-- ---------------------------------------------------------------------------
create or replace function public.generate_desktop_session_token()
returns text
language sql
volatile
as $$
  select 'aipify_desktop_' || encode(gen_random_bytes(32), 'hex');
$$;

revoke execute on function public.generate_desktop_session_token() from public, anon, authenticated;

create or replace function public._validate_desktop_session_row(p_token text)
returns public.presence_desktop_sessions
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_row public.presence_desktop_sessions;
begin
  if p_token is null or length(p_token) < 30 then
    return null;
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_row
  from public.presence_desktop_sessions s
  where s.token_hash = v_hash
    and s.revoked_at is null
    and s.expires_at > now()
  limit 1;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Create session (web-authenticated user pairs desktop client)
-- ---------------------------------------------------------------------------
create or replace function public.create_desktop_client_session(
  p_platform text default 'macos',
  p_device_name text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_company_id uuid;
  v_plan text;
  v_client_id uuid;
  v_session_id uuid;
  v_token text;
  v_token_hash text;
  v_limits jsonb;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_platform not in ('macos', 'windows', 'linux') then
    raise exception 'Invalid platform';
  end if;

  select u.id, u.company_id into v_user_id, v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  select c.id into v_tenant_id
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_tenant_id is null then
    raise exception 'Customer not found';
  end if;

  v_limits := public.get_customer_license_limits(v_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  if v_plan not in ('business', 'enterprise') then
    raise exception 'Desktop Command Center requires Business plan or higher';
  end if;

  insert into public.presence_desktop_clients (tenant_id, platform, device_name, status, last_seen_at)
  values (v_tenant_id, p_platform, nullif(trim(p_device_name), ''), 'active', now())
  returning id into v_client_id;

  v_token := public.generate_desktop_session_token();
  v_token_hash := public.hash_installation_token(v_token);

  insert into public.presence_desktop_sessions (
    client_id, tenant_id, user_id, token_hash, expires_at
  )
  values (
    v_client_id, v_tenant_id, v_user_id, v_token_hash, now() + interval '30 days'
  )
  returning id into v_session_id;

  return jsonb_build_object(
    'session_token', v_token,
    'client_id', v_client_id,
    'session_id', v_session_id,
    'platform', p_platform,
    'expires_at', now() + interval '30 days'
  );
end;
$$;

grant execute on function public.create_desktop_client_session(text, text) to authenticated;

create or replace function public.validate_desktop_session(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.presence_desktop_sessions;
begin
  v_row := public._validate_desktop_session_row(p_token);

  if v_row.id is null then
    return jsonb_build_object('valid', false);
  end if;

  update public.presence_desktop_sessions
  set last_seen_at = now()
  where id = v_row.id;

  update public.presence_desktop_clients
  set last_seen_at = now(), status = 'active'
  where id = v_row.client_id;

  return jsonb_build_object(
    'valid', true,
    'tenant_id', v_row.tenant_id,
    'user_id', v_row.user_id,
    'client_id', v_row.client_id,
    'session_id', v_row.id,
    'expires_at', v_row.expires_at
  );
end;
$$;

grant execute on function public.validate_desktop_session(text) to anon, authenticated;

create or replace function public.revoke_desktop_session(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.presence_desktop_sessions;
begin
  v_row := public._validate_desktop_session_row(p_token);

  if v_row.id is null then
    return jsonb_build_object('revoked', false);
  end if;

  update public.presence_desktop_sessions
  set revoked_at = now()
  where id = v_row.id;

  update public.presence_desktop_clients
  set status = 'revoked'
  where id = v_row.client_id;

  return jsonb_build_object('revoked', true, 'client_id', v_row.client_id);
end;
$$;

grant execute on function public.revoke_desktop_session(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Tenant-scoped command center bundle (desktop + shared core)
-- ---------------------------------------------------------------------------
create or replace function public.get_command_center_bundle_for_tenant(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan text;
  v_limits jsonb;
  v_health integer;
  v_pending integer;
  v_skills integer;
  v_unread integer;
  v_support_resolved integer;
  v_menubar text;
begin
  if p_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_limits := public.get_customer_license_limits(p_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');

  v_health := coalesce((
    select ihs.score from public.installation_health_scans ihs
    join public.installations i on i.id = ihs.installation_id
    where i.customer_id = p_tenant_id
    order by ihs.created_at desc limit 1
  ), 90);

  v_menubar := case
    when v_health < 70 then 'critical'
    when v_health < 85 then 'attention'
    else 'healthy'
  end;

  select count(*) into v_pending
  from public.intelligence_patterns ip
  where ip.approval_status in ('pending', 'pending_review');

  select count(*) into v_skills
  from public.tenant_skills ts
  where ts.tenant_id = p_tenant_id and ts.status = 'active';

  select count(*)::integer into v_unread
  from public.presence_notifications n
  where n.tenant_id = p_tenant_id and n.status in ('pending', 'delivered');

  select count(*) into v_support_resolved
  from public.presence_notifications n
  where n.tenant_id = p_tenant_id
    and n.event_type = 'support_cases_resolved'
    and n.created_at >= date_trunc('day', now());

  return jsonb_build_object(
    'has_customer', true,
    'principle', 'Aipify should quietly work in the background. When something important happens, Aipify should already know.',
    'core_principle', 'There is only ONE Aipify. Web, Desktop and Mobile are interfaces to the same intelligence layer.',
    'plan', v_plan,
    'capabilities', jsonb_build_object(
      'web', true,
      'desktop_client', v_plan in ('business', 'enterprise'),
      'enhanced_presence', v_plan in ('growth', 'business', 'enterprise'),
      'executive_feed', v_plan in ('growth', 'business', 'enterprise'),
      'desktop_presence', v_plan in ('business', 'enterprise'),
      'command_center', v_plan in ('business', 'enterprise'),
      'advanced_notifications', v_plan in ('business', 'enterprise'),
      'actionable_approvals', v_plan in ('business', 'enterprise'),
      'mobile_presence', v_plan = 'enterprise',
      'dedicated_policies', v_plan = 'enterprise'
    ),
    'presence_status', v_menubar,
    'health_overview', jsonb_build_object('score', v_health, 'label', v_menubar),
    'pending_approvals', v_pending,
    'active_skills', v_skills,
    'executive_summary', 'Platform health at ' || v_health::text || '%.',
    'morning_briefing', jsonb_build_object(
      'greeting', 'Good morning',
      'headline', 'Aipify worked while you were away.',
      'bullets', jsonb_build_array(
        format('✓ %s support conversations resolved today.', v_support_resolved),
        '✓ No critical incidents detected.',
        format('✓ %s recommendations prepared.', v_pending),
        '✓ Activity monitoring active.'
      ),
      'generated_at', now()
    ),
    'recent_activity', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', pe.id, 'title', pe.title, 'category', 'presence', 'created_at', pe.created_at
      ) order by pe.created_at desc)
      from public.presence_events pe
      where pe.tenant_id = p_tenant_id or pe.surface = 'customer'
      limit 12),
      '[]'::jsonb
    ),
    'activity_timeline', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', n.id,
        'category', case n.event_type
          when 'support_cases_resolved' then 'support'
          when 'automation_completed' then 'automation'
          when 'recommendation_generated' then 'approval'
          when 'health_warning_detected' then 'health'
          when 'update_scheduled' then 'update'
          else 'presence'
        end,
        'title', n.title,
        'created_at', n.created_at
      ) order by n.created_at desc)
      from public.presence_notifications n
      where n.tenant_id = p_tenant_id
      limit 20),
      '[]'::jsonb
    ),
    'recommendations', coalesce(
      (select jsonb_agg(jsonb_build_object('id', gp.id, 'message', gp.pattern_title)
        order by gp.confidence_score desc)
      from public.global_patterns gp where gp.active = true limit 5),
      '[]'::jsonb
    ),
    'presence_timeline', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', f.id, 'time_label', f.time_label, 'message', f.message, 'level', f.level, 'created_at', f.created_at
      ) order by f.created_at desc)
      from public.presence_executive_feed f
      where f.tenant_id = p_tenant_id limit 20),
      '[]'::jsonb
    ),
    'executive_feed', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', f.id, 'time_label', f.time_label, 'message', f.message, 'level', f.level, 'created_at', f.created_at
      ) order by f.created_at desc)
      from public.presence_executive_feed f
      where f.tenant_id = p_tenant_id limit 20),
      '[]'::jsonb
    ),
    'notifications', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', n.id, 'event_type', n.event_type, 'level', n.level, 'title', n.title,
        'body', n.body, 'status', n.status, 'channels', n.channels, 'actions', n.actions,
        'created_at', n.created_at
      ) order by n.created_at desc)
      from public.presence_notifications n
      where n.tenant_id = p_tenant_id limit 15),
      '[]'::jsonb
    ),
    'unread_count', v_unread,
    'desktop_clients_prepared', jsonb_build_array('macos', 'windows', 'linux'),
    'quick_actions', jsonb_build_array(
      jsonb_build_object('id', 'approve_recommendation', 'label', 'Approve'),
      jsonb_build_object('id', 'review_support_escalation', 'label', 'Review escalation'),
      jsonb_build_object('id', 'open_executive_summary', 'label', 'Open executive summary'),
      jsonb_build_object('id', 'view_installation_health', 'label', 'View installation health'),
      jsonb_build_object('id', 'open_web_dashboard', 'label', 'Open dashboard'),
      jsonb_build_object('id', 'pause_notifications', 'label', 'Pause notifications'),
      jsonb_build_object('id', 'mark_as_reviewed', 'label', 'Mark reviewed')
    )
  );
end;
$$;

grant execute on function public.get_command_center_bundle_for_tenant(uuid) to authenticated;

create or replace function public.get_command_center_bundle()
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
    return jsonb_build_object('has_customer', false);
  end if;
  return public.get_command_center_bundle_for_tenant(v_tenant_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Desktop API entrypoints (token-authenticated)
-- ---------------------------------------------------------------------------
create or replace function public.desktop_get_command_center(p_token text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.presence_desktop_sessions;
begin
  v_row := public._validate_desktop_session_row(p_token);
  if v_row.id is null then
    raise exception 'Invalid or expired desktop session';
  end if;

  update public.presence_desktop_sessions set last_seen_at = now() where id = v_row.id;

  return public.get_command_center_bundle_for_tenant(v_row.tenant_id);
end;
$$;

grant execute on function public.desktop_get_command_center(text) to anon, authenticated;

create or replace function public.desktop_perform_quick_action(
  p_token text,
  p_action_id text,
  p_notification_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.presence_desktop_sessions;
begin
  v_row := public._validate_desktop_session_row(p_token);
  if v_row.id is null then
    raise exception 'Invalid or expired desktop session';
  end if;

  perform public.record_presence_engagement(
    'desktop_quick_action', p_action_id, p_notification_id, 'desktop', '{}'::jsonb
  );

  if p_action_id = 'pause_notifications' then
    update public.presence_notification_preferences
    set quiet_hours_mode = 'do_not_disturb', updated_at = now()
    where tenant_id = v_row.tenant_id;
  end if;

  return jsonb_build_object('action', p_action_id, 'tenant_id', v_row.tenant_id);
end;
$$;

grant execute on function public.desktop_perform_quick_action(text, text, uuid) to anon, authenticated;
