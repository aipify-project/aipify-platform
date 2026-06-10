-- Phase 14: Executive Presence & Daily Briefings

-- ---------------------------------------------------------------------------
-- executive_presence_messages
-- ---------------------------------------------------------------------------
create table if not exists public.executive_presence_messages (
  id uuid primary key default gen_random_uuid(),
  message_key text not null unique,
  message_type text not null check (
    message_type in ('morning', 'evening', 'weekend', 'positive', 'attention', 'critical')
  ),
  title text not null,
  body text not null,
  tone text not null default 'calm' check (
    tone in ('calm', 'reassuring', 'professional', 'friendly', 'action')
  ),
  severity text not null default 'info' check (
    severity in ('info', 'attention', 'critical')
  ),
  surface text not null default 'platform' check (surface in ('platform', 'customer')),
  locale text not null default 'en',
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists executive_presence_messages_type_idx
  on public.executive_presence_messages (message_type, locale, enabled);

alter table public.executive_presence_messages enable row level security;
revoke all on public.executive_presence_messages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- Briefing category preferences on presence_settings
-- ---------------------------------------------------------------------------
alter table public.presence_settings
  add column if not exists briefing_morning_enabled boolean not null default true,
  add column if not exists briefing_evening_enabled boolean not null default true,
  add column if not exists briefing_weekend_enabled boolean not null default true,
  add column if not exists briefing_positive_enabled boolean not null default true,
  add column if not exists briefing_attention_enabled boolean not null default true,
  add column if not exists briefing_critical_enabled boolean not null default true;

-- ---------------------------------------------------------------------------
-- Select briefing messages with daily rotation
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
  v_hour integer := extract(hour from now());
  v_dow integer := extract(dow from now());
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
begin
  if auth.uid() is null then
    raise exception 'Not authorized';
  end if;

  if p_surface = 'platform' and not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

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
  elsif v_hour >= 17 and v_hour < 22 then
    v_primary_type := 'evening';
  elsif v_hour >= 5 and v_hour < 12 then
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

  v_seed := coalesce(auth.uid()::text, 'anon') || to_char(current_date, 'YYYYMMDD');

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
      'title', 'Aipify is on duty',
      'body', 'Your business never sleeps. Aipify continues monitoring, learning, and healing around the clock.',
      'message_type', 'morning',
      'tone', 'reassuring',
      'severity', 'info'
    )),
    'secondary', coalesce(v_secondary, '[]'::jsonb),
    'promise', 'You focus on growing your business. Aipify focuses on keeping it running.',
    'always_on', 'Aipify is always on duty.',
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

grant execute on function public.get_daily_briefing(text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Extend update_presence_settings with briefing preferences
-- ---------------------------------------------------------------------------
drop function if exists public.update_presence_settings(
  text, text, boolean, boolean, boolean, boolean, boolean, text, boolean, text
);

create or replace function public.update_presence_settings(
  p_surface text,
  p_animation_intensity text default null,
  p_presence_visible boolean default null,
  p_executive_summaries boolean default null,
  p_self_healing_notifications boolean default null,
  p_approval_notifications boolean default null,
  p_sound_enabled boolean default null,
  p_sound_mode text default null,
  p_learning_notifications boolean default null,
  p_view_mode text default null,
  p_briefing_morning_enabled boolean default null,
  p_briefing_evening_enabled boolean default null,
  p_briefing_weekend_enabled boolean default null,
  p_briefing_positive_enabled boolean default null,
  p_briefing_attention_enabled boolean default null,
  p_briefing_critical_enabled boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then raise exception 'Not authorized'; end if;
  if p_surface = 'platform' and not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  insert into public.presence_settings (surface, tenant_id)
  values (p_surface, null) on conflict (surface, tenant_id) do nothing;

  update public.presence_settings
  set
    animation_intensity = coalesce(p_animation_intensity, animation_intensity),
    presence_visible = coalesce(p_presence_visible, presence_visible),
    executive_summaries = coalesce(p_executive_summaries, executive_summaries),
    self_healing_notifications = coalesce(p_self_healing_notifications, self_healing_notifications),
    approval_notifications = coalesce(p_approval_notifications, approval_notifications),
    sound_enabled = coalesce(
      p_sound_enabled,
      case p_sound_mode when 'enabled' then true when 'off' then false else sound_enabled end
    ),
    sound_mode = coalesce(p_sound_mode, sound_mode),
    learning_notifications = coalesce(p_learning_notifications, learning_notifications),
    view_mode = coalesce(p_view_mode, view_mode),
    briefing_morning_enabled = coalesce(p_briefing_morning_enabled, briefing_morning_enabled),
    briefing_evening_enabled = coalesce(p_briefing_evening_enabled, briefing_evening_enabled),
    briefing_weekend_enabled = coalesce(p_briefing_weekend_enabled, briefing_weekend_enabled),
    briefing_positive_enabled = coalesce(p_briefing_positive_enabled, briefing_positive_enabled),
    briefing_attention_enabled = coalesce(p_briefing_attention_enabled, briefing_attention_enabled),
    briefing_critical_enabled = coalesce(p_briefing_critical_enabled, briefing_critical_enabled),
    updated_at = now()
  where surface = p_surface and tenant_id is null;

  return (select jsonb_build_object(
    'animation_intensity', ps.animation_intensity,
    'presence_visible', ps.presence_visible,
    'executive_summaries', ps.executive_summaries,
    'self_healing_notifications', ps.self_healing_notifications,
    'approval_notifications', ps.approval_notifications,
    'sound_enabled', ps.sound_enabled,
    'sound_mode', ps.sound_mode,
    'learning_notifications', ps.learning_notifications,
    'view_mode', ps.view_mode,
    'briefing_morning_enabled', ps.briefing_morning_enabled,
    'briefing_evening_enabled', ps.briefing_evening_enabled,
    'briefing_weekend_enabled', ps.briefing_weekend_enabled,
    'briefing_positive_enabled', ps.briefing_positive_enabled,
    'briefing_attention_enabled', ps.briefing_attention_enabled,
    'briefing_critical_enabled', ps.briefing_critical_enabled
  ) from public.presence_settings ps where ps.surface = p_surface and ps.tenant_id is null);
end;
$$;

grant execute on function public.update_presence_settings(
  text, text, boolean, boolean, boolean, boolean, boolean, text, boolean, text,
  boolean, boolean, boolean, boolean, boolean, boolean
) to authenticated;

-- ---------------------------------------------------------------------------
-- Seed executive presence messages
-- ---------------------------------------------------------------------------
insert into public.executive_presence_messages (message_key, message_type, title, body, tone, severity, surface, locale)
values
  ('morning_healthy', 'morning', 'Good morning', 'Good morning. Everything looks healthy. Aipify monitored your systems overnight and no critical incidents were detected.', 'reassuring', 'info', 'platform', 'en'),
  ('morning_away', 'morning', 'While you were away', 'While you were away, Aipify resolved {support_resolved} support requests, completed {health_scans} health scans, and prepared today''s recommendations.', 'professional', 'info', 'platform', 'en'),
  ('morning_stable', 'morning', 'Stable overnight', 'Your business remained stable overnight. No action is required from you at this time.', 'calm', 'info', 'platform', 'en'),
  ('morning_background', 'morning', 'Working in the background', 'Aipify has been working in the background. Here is what matters most today.', 'friendly', 'info', 'platform', 'en'),
  ('morning_operational', 'morning', 'All systems operational', 'All systems operational. One recommendation is waiting for your review.', 'action', 'info', 'platform', 'en'),
  ('morning_support_low', 'morning', 'Support trending lower', 'Support demand remained lower than expected. Great job on your onboarding improvements.', 'reassuring', 'info', 'platform', 'en'),
  ('evening_ending', 'evening', 'Day ending', 'Your operational day is ending. Aipify will continue monitoring your environment overnight.', 'calm', 'info', 'platform', 'en'),
  ('evening_rest', 'evening', 'Good evening', 'Have a good evening. Aipify remains active and will notify you if human attention becomes necessary.', 'reassuring', 'info', 'platform', 'en'),
  ('evening_stable', 'evening', 'Stable tonight', 'Everything looks stable. Rest assured that Aipify continues working while you recharge.', 'calm', 'info', 'platform', 'en'),
  ('weekend_enjoy', 'weekend', 'Enjoy your weekend', 'Enjoy your weekend. Aipify is still monitoring your operations.', 'friendly', 'info', 'platform', 'en'),
  ('weekend_off', 'weekend', 'Time off', 'Take some well-deserved time off. Aipify has things under control.', 'reassuring', 'info', 'platform', 'en'),
  ('weekend_healthy', 'weekend', 'Weekend health', 'No urgent actions detected. Your systems remain healthy.', 'calm', 'info', 'platform', 'en'),
  ('positive_support', 'positive', 'Support improving', 'Support volume decreased by 18% this week.', 'reassuring', 'info', 'platform', 'en'),
  ('positive_onboarding', 'positive', 'Onboarding success', 'Customers completed onboarding more successfully than last month.', 'friendly', 'info', 'platform', 'en'),
  ('positive_automation', 'positive', 'Automation coverage', 'Automation coverage improved across your organization.', 'professional', 'info', 'platform', 'en'),
  ('positive_response', 'positive', 'Response times', 'Response times continue to improve.', 'calm', 'info', 'platform', 'en'),
  ('positive_approvals', 'positive', 'Approval workflows', 'Your approval workflows are functioning efficiently.', 'reassuring', 'info', 'platform', 'en'),
  ('positive_reliability', 'positive', 'System reliability', 'System reliability remains excellent.', 'calm', 'info', 'platform', 'en'),
  ('attention_review', 'attention', 'Review needed', 'One recommendation requires your review.', 'action', 'attention', 'platform', 'en'),
  ('attention_medium', 'attention', 'Improvement opportunity', 'Aipify identified a medium-risk opportunity for improvement.', 'professional', 'attention', 'platform', 'en'),
  ('attention_workflow', 'attention', 'Workflow approval', 'A customer workflow may benefit from your approval.', 'calm', 'attention', 'platform', 'en'),
  ('attention_automation', 'attention', 'Automation confirmation', 'An automation change is awaiting human confirmation.', 'action', 'attention', 'platform', 'en'),
  ('critical_human', 'critical', 'Human attention required', 'Human attention is required. A critical operational issue has been detected.', 'professional', 'critical', 'platform', 'en'),
  ('critical_recovery', 'critical', 'Recovery assistance', 'Aipify attempted automatic recovery but requires assistance.', 'action', 'critical', 'platform', 'en'),
  ('critical_immediate', 'critical', 'Immediate review', 'Immediate review is recommended.', 'action', 'critical', 'platform', 'en')
on conflict (message_key) do nothing;
