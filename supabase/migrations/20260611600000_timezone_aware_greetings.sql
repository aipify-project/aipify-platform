-- Timezone-aware greetings for Customer App, Presence, and briefings

-- ---------------------------------------------------------------------------
-- 1. Profile timezone fields
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists timezone text;

alter table public.customers
  add column if not exists timezone text;

-- ---------------------------------------------------------------------------
-- 2. Country → default timezone (US/CA require explicit saved timezone)
-- ---------------------------------------------------------------------------
create or replace function public._country_default_timezone(p_country text)
returns text
language sql
immutable
as $$
  select case upper(coalesce(trim(p_country), ''))
    when 'NO' then 'Europe/Oslo'
    when 'SE' then 'Europe/Stockholm'
    when 'DK' then 'Europe/Copenhagen'
    when 'GB' then 'Europe/London'
    when 'UK' then 'Europe/London'
    else null
  end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Resolve timezone for authenticated user (customer context)
-- ---------------------------------------------------------------------------
create or replace function public.resolve_customer_timezone(p_tenant_id uuid default null)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_tz text;
  v_customer_tz text;
  v_country text;
begin
  if p_tenant_id is not null then
    v_tenant_id := p_tenant_id;
  else
    v_tenant_id := public._presence_tenant_for_auth();
  end if;

  if auth.uid() is not null then
    select u.timezone into v_user_tz
    from public.users u
    where u.auth_user_id = auth.uid()
    limit 1;
  end if;

  if v_user_tz is not null and length(trim(v_user_tz)) > 0 then
    return trim(v_user_tz);
  end if;

  if v_tenant_id is not null then
    select c.timezone, c.country
    into v_customer_tz, v_country
    from public.customers c
    where c.id = v_tenant_id
    limit 1;
  end if;

  if v_customer_tz is not null and length(trim(v_customer_tz)) > 0 then
    return trim(v_customer_tz);
  end if;

  if public._country_default_timezone(v_country) is not null then
    return public._country_default_timezone(v_country);
  end if;

  select p.timezone into v_customer_tz
  from public.presence_notification_preferences p
  where p.tenant_id = v_tenant_id
  limit 1;

  if v_customer_tz is not null and v_customer_tz <> 'UTC' then
    return v_customer_tz;
  end if;

  return 'UTC';
end;
$$;

grant execute on function public.resolve_customer_timezone(uuid) to authenticated;

create or replace function public.resolve_auth_user_timezone()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_tz text;
  v_company_id uuid;
  v_customer_tz text;
  v_country text;
begin
  if auth.uid() is null then
    return 'UTC';
  end if;

  select u.timezone, u.company_id into v_user_tz, v_company_id
  from public.users u
  where u.auth_user_id = auth.uid()
  limit 1;

  if v_user_tz is not null and length(trim(v_user_tz)) > 0 then
    return trim(v_user_tz);
  end if;

  select c.timezone, c.country
  into v_customer_tz, v_country
  from public.customers c
  where c.company_id = v_company_id
  limit 1;

  if v_customer_tz is not null and length(trim(v_customer_tz)) > 0 then
    return trim(v_customer_tz);
  end if;

  if public._country_default_timezone(v_country) is not null then
    return public._country_default_timezone(v_country);
  end if;

  return 'UTC';
end;
$$;

grant execute on function public.resolve_auth_user_timezone() to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Time-based greeting (server-side, English — clients localize via period)
-- ---------------------------------------------------------------------------
create or replace function public.get_time_greeting(p_timezone text default 'UTC')
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tz text := coalesce(nullif(trim(p_timezone), ''), 'UTC');
  v_local timestamp;
  v_hour integer;
  v_period text;
  v_greeting text;
  v_headline text;
begin
  begin
    v_local := timezone(v_tz, now());
  exception when others then
    v_tz := 'UTC';
    v_local := timezone('UTC', now());
  end;

  v_hour := extract(hour from v_local);

  v_period := case
    when v_hour between 5 and 10 then 'morning'
    when v_hour between 11 and 16 then 'afternoon'
    when v_hour between 17 and 22 then 'evening'
    else 'late'
  end;

  v_greeting := case v_period
    when 'morning' then 'Good morning'
    when 'afternoon' then 'Good afternoon'
    when 'evening' then 'Good evening'
    else 'Working late? Aipify is still monitoring your business.'
  end;

  v_headline := case v_period
    when 'morning' then 'Aipify worked while you were away.'
    when 'afternoon' then 'Aipify has been monitoring your business.'
    when 'evening' then 'Aipify remains active this evening.'
    else 'Everything looks stable. No critical action required.'
  end;

  return jsonb_build_object(
    'timezone', v_tz,
    'period', v_period,
    'hour', v_hour,
    'greeting', v_greeting,
    'headline', v_headline
  );
end;
$$;

grant execute on function public.get_time_greeting(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Update user timezone (settings)
-- ---------------------------------------------------------------------------
create or replace function public.update_user_timezone(p_timezone text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  if p_timezone is null or length(trim(p_timezone)) = 0 then
    raise exception 'Timezone required';
  end if;

  update public.users
  set timezone = trim(p_timezone)
  where auth_user_id = auth.uid()
  returning id into v_user_id;

  if v_user_id is null then
    raise exception 'User not found';
  end if;

  return jsonb_build_object('ok', true, 'timezone', trim(p_timezone));
end;
$$;

grant execute on function public.update_user_timezone(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Default presence prefs timezone from resolved profile
-- ---------------------------------------------------------------------------
create or replace function public.ensure_presence_notification_preferences(p_tenant_id uuid)
returns public.presence_notification_preferences
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.presence_notification_preferences;
  v_default_tz text;
begin
  v_default_tz := public.resolve_customer_timezone(p_tenant_id);

  insert into public.presence_notification_preferences (tenant_id, timezone)
  values (p_tenant_id, v_default_tz)
  on conflict (tenant_id) do nothing;

  select * into v_row
  from public.presence_notification_preferences
  where tenant_id = p_tenant_id;

  if v_row.timezone = 'UTC' and v_default_tz <> 'UTC' then
    update public.presence_notification_preferences
    set timezone = v_default_tz, updated_at = now()
    where tenant_id = p_tenant_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Customer App home bundle — timezone-aware welcome
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_app_home_bundle()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_user_name text;
  v_company_name text;
  v_bundle jsonb;
  v_health jsonb;
  v_onboarding jsonb;
  v_tz text;
  v_greeting jsonb;
  v_welcome text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  select u.full_name, coalesce(c.company_name, c.full_name, 'Your company')
  into v_user_name, v_company_name
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where u.auth_user_id = auth.uid() and c.id = v_tenant_id
  limit 1;

  v_bundle := public.get_command_center_bundle_for_tenant(v_tenant_id);
  v_health := public._compute_customer_health_score(v_tenant_id);
  v_onboarding := public.get_customer_onboarding_progress();
  v_tz := public.resolve_customer_timezone(v_tenant_id);
  v_greeting := public.get_time_greeting(v_tz);
  v_welcome := (v_greeting ->> 'greeting') || coalesce(', ' || v_user_name, '') || '.';

  return jsonb_build_object(
    'has_customer', true,
    'timezone', v_tz,
    'greeting_period', v_greeting ->> 'period',
    'welcome_message', v_welcome,
    'company_name', v_company_name,
    'user_name', v_user_name,
    'health_score', v_health,
    'executive_overview', case
      when (v_health ->> 'label') = 'action_recommended'
        then 'Aipify detected issues that need your attention.'
      when (v_health ->> 'label') = 'needs_attention'
        then 'Aipify has been monitoring your business. Some areas need review.'
      when (v_greeting ->> 'period') = 'late'
        then 'Everything looks stable. No critical action required.'
      else 'Aipify has been monitoring your business. No critical issues detected.'
    end,
    'recent_activity', coalesce(v_bundle -> 'recent_activity', '[]'::jsonb),
    'recommendations_preview', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', r.id,
        'title', coalesce(r.title, left(r.recommendation, 80)),
        'message', r.recommendation
      ) order by r.created_at desc)
      from public.ai_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'active'
      limit 3),
      '[]'::jsonb
    ),
    'pending_approvals_count', coalesce((v_bundle ->> 'pending_approvals')::integer, 0),
    'recommendations_count', coalesce((
      select count(*)::integer
      from public.ai_recommendations r
      where r.tenant_id = v_tenant_id and r.status = 'active'
    ), 0),
    'active_skills', coalesce((v_bundle ->> 'active_skills')::integer, 0),
    'quick_actions', jsonb_build_array(
      jsonb_build_object('id', 'open_executive_summary', 'label', 'View executive summary', 'href', '/app/executive'),
      jsonb_build_object('id', 'approve_recommendation', 'label', 'Review recommendation', 'href', '/app/recommendations'),
      jsonb_build_object('id', 'view_installation_health', 'label', 'Run installation check', 'href', '/app/installations'),
      jsonb_build_object('id', 'open_web_dashboard', 'label', 'Open presence feed', 'href', '/app/presence')
    ),
    'onboarding_complete', coalesce((v_onboarding -> 'onboarding' ->> 'score')::integer, 0) >= 100
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Command center morning briefing — timezone-aware
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
  v_tz text;
  v_greeting jsonb;
begin
  if p_tenant_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_limits := public.get_customer_license_limits(p_tenant_id);
  v_plan := coalesce(v_limits ->> 'plan', 'starter');
  v_tz := public.resolve_customer_timezone(p_tenant_id);
  v_greeting := public.get_time_greeting(v_tz);

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
      'greeting', v_greeting ->> 'greeting',
      'headline', v_greeting ->> 'headline',
      'period', v_greeting ->> 'period',
      'timezone', v_tz,
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

-- ---------------------------------------------------------------------------
-- 9. Platform daily briefing — use user timezone, not server UTC
-- ---------------------------------------------------------------------------
create or replace function public.get_daily_briefing(
  p_surface text default 'platform',
  p_locale text default 'en'
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tz text;
  v_local timestamp;
  v_hour integer := 0;
  v_dow integer := 0;
  v_primary_type text;
  v_pending integer := 0;
  v_critical integer := 0;
  v_healing_today integer := 0;
  v_support_resolved integer := 0;
  v_health_scans integer := 0;
  v_health integer := 90;
  v_primary jsonb;
  v_secondary jsonb;
  v_prefs record;
  v_seed text;
  v_time_greeting jsonb;
begin
  if auth.uid() is null then
    raise exception 'Not authorized';
  end if;

  if p_surface = 'platform' and not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  v_tz := public.resolve_auth_user_timezone();
  v_local := timezone(v_tz, now());
  v_hour := extract(hour from v_local);
  v_dow := extract(dow from v_local);
  v_time_greeting := public.get_time_greeting(v_tz);

  select * into v_prefs
  from public.presence_settings
  where surface = p_surface and tenant_id is null;

  if v_prefs is null then
    insert into public.presence_settings (surface, tenant_id)
    values (p_surface, null)
    on conflict (surface, tenant_id) do nothing;
    select * into v_prefs from public.presence_settings
    where surface = p_surface and tenant_id is null;
  end if;

  select count(*) into v_critical
  from public.presence_events
  where surface = p_surface and event_type = 'critical'
    and created_at >= now() - interval '2 hours';

  select count(*) into v_pending
  from public.platform_actions where status = 'pending_approval';

  v_pending := v_pending + coalesce((
    select count(*) from public.intelligence_patterns
    where approval_status in ('pending', 'pending_review')
  ), 0);

  select count(*) into v_healing_today
  from public.presence_events
  where surface = p_surface and event_type = 'healing' and succeeded = true
    and created_at >= date_trunc('day', now());

  select coalesce(sum(support_requests_handled), 0) into v_support_resolved
  from public.usage_statistics;

  select count(*) into v_health_scans
  from public.presence_events
  where surface = p_surface and title ilike '%health scan%'
    and created_at >= date_trunc('day', now());

  v_health := coalesce((
    select automation_coverage from public.brain_metrics order by recorded_at desc limit 1
  ), 90);

  if v_critical > 0 then
    v_primary_type := 'critical';
  elsif v_pending > 0 then
    v_primary_type := 'attention';
  elsif v_dow in (0, 6) then
    v_primary_type := 'weekend';
  elsif v_hour >= 23 or v_hour < 5 then
    v_primary_type := 'evening';
  elsif v_hour between 17 and 22 then
    v_primary_type := 'evening';
  elsif v_hour between 5 and 10 then
    v_primary_type := 'morning';
  elsif v_health >= 85 and v_pending = 0 then
    v_primary_type := 'positive';
  else
    v_primary_type := 'morning';
  end if;

  if v_primary_type = 'critical' and not coalesce(v_prefs.briefing_critical_enabled, true) then
    v_primary_type := 'attention';
  elsif v_primary_type = 'attention' and not coalesce(v_prefs.briefing_attention_enabled, true) then
    v_primary_type := 'morning';
  elsif v_primary_type = 'weekend' and not coalesce(v_prefs.briefing_weekend_enabled, true) then
    v_primary_type := 'morning';
  elsif v_primary_type = 'evening' and not coalesce(v_prefs.briefing_evening_enabled, true) then
    v_primary_type := 'positive';
  elsif v_primary_type = 'morning' and not coalesce(v_prefs.briefing_morning_enabled, true) then
    v_primary_type := 'positive';
  elsif v_primary_type = 'positive' and not coalesce(v_prefs.briefing_positive_enabled, true) then
    v_primary_type := 'morning';
  end if;

  v_seed := coalesce(auth.uid()::text, 'anon') || to_char(v_local, 'YYYYMMDD');

  select jsonb_build_object(
    'id', m.id,
    'message_key', m.message_key,
    'message_type', m.message_type,
    'title', m.title,
    'body', replace(replace(replace(replace(m.body,
      '{support_resolved}', coalesce(v_support_resolved, 12)::text),
      '{health_scans}', greatest(v_health_scans, 3)::text),
      '{pending}', v_pending::text),
      '{health}', v_health::text),
    'tone', m.tone,
    'severity', m.severity
  ) into v_primary
  from public.executive_presence_messages m
  where m.enabled = true
    and m.surface = p_surface
    and m.locale = p_locale
    and m.message_type = v_primary_type
  order by md5(m.id::text || v_seed || m.message_type)
  limit 1;

  select coalesce(jsonb_agg(msg order by msg->>'message_key'), '[]'::jsonb) into v_secondary
  from (
    select jsonb_build_object(
      'id', m.id,
      'message_key', m.message_key,
      'message_type', m.message_type,
      'title', m.title,
      'body', m.body,
      'tone', m.tone,
      'severity', m.severity
    ) as msg
    from public.executive_presence_messages m
    where m.enabled = true
      and m.surface = p_surface
      and m.locale = p_locale
      and m.message_type = 'positive'
      and coalesce(v_prefs.briefing_positive_enabled, true)
      and v_primary_type <> 'critical'
    order by md5(m.id::text || v_seed || 'secondary')
    limit 2
  ) items;

  return jsonb_build_object(
    'primary', coalesce(v_primary, jsonb_build_object(
      'title', v_time_greeting ->> 'greeting',
      'body', v_time_greeting ->> 'headline',
      'message_type', v_primary_type,
      'tone', 'reassuring',
      'severity', 'info'
    )),
    'secondary', coalesce(v_secondary, '[]'::jsonb),
    'promise', 'You focus on growing your business. Aipify focuses on keeping it running.',
    'always_on', 'Aipify is always on duty.',
    'timezone', v_tz,
    'context', jsonb_build_object(
      'pending_approvals', v_pending,
      'critical_events', v_critical,
      'healing_today', v_healing_today,
      'health_score', v_health
    ),
    'preferences', jsonb_build_object(
      'morning', coalesce(v_prefs.briefing_morning_enabled, true),
      'evening', coalesce(v_prefs.briefing_evening_enabled, true),
      'weekend', coalesce(v_prefs.briefing_weekend_enabled, true),
      'positive', coalesce(v_prefs.briefing_positive_enabled, true),
      'attention', coalesce(v_prefs.briefing_attention_enabled, true),
      'critical', coalesce(v_prefs.briefing_critical_enabled, true)
    )
  );
end;
$$;

-- Sync existing Nordic customers to sensible defaults
update public.customers c
set timezone = public._country_default_timezone(c.country)
where (c.timezone is null or c.timezone = 'UTC')
  and public._country_default_timezone(c.country) is not null;
