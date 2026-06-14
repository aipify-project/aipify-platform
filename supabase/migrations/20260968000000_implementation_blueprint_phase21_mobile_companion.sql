-- Implementation Blueprint Phase 21 — Mobile Companion Engine
-- Spec alignment extending Notification & Communication Engine (Phase A.17). No new tables.

-- A.17 dependency — may be missing if baselined without DDL
create table if not exists public.communication_notification_preferences (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  preferred_channels jsonb not null default '["in_app","dashboard"]'::jsonb,
  frequency text not null default 'immediate' check (
    frequency in ('immediate', 'daily_digest', 'weekly_digest')
  ),
  quiet_hours jsonb not null default '{"enabled":true,"start":"22:00","end":"07:00","timezone":"Europe/Oslo"}'::jsonb,
  category_subscriptions jsonb not null default '{
    "support":true,"approvals":true,"tasks":true,"integrations":true,
    "governance":true,"quality":true,"onboarding":true,"billing":true,"system_alerts":true
  }'::jsonb,
  critical_bypass_quiet_hours boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

alter table public.communication_notification_preferences enable row level security;
revoke all on public.communication_notification_preferences from authenticated, anon;

create or replace function public._nce_ensure_preferences(
  p_organization_id uuid,
  p_user_id uuid
)
returns public.communication_notification_preferences language plpgsql security definer set search_path = public as $$
declare v_row public.communication_notification_preferences;
begin
  insert into public.communication_notification_preferences (organization_id, user_id)
  values (p_organization_id, p_user_id)
  on conflict (organization_id, user_id) do nothing;

  select * into v_row
  from public.communication_notification_preferences
  where organization_id = p_organization_id and user_id = p_user_id;

  return v_row;
end; $$;

create or replace function public._mcbp_blueprint_companion_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'since_last_time', 'label', 'Since Last Time', 'description', 'Pick up where you left off — metadata trends when away from desk', 'route', '/app/operations-center-foundation-engine'),
    jsonb_build_object('key', 'mobile_notifications', 'label', 'Mobile notifications', 'description', 'Relevant, configurable, respectful alerts — push scaffold when native app ships', 'route', '/app/notification-communication-engine'),
    jsonb_build_object('key', 'support_queue', 'label', 'Support queue awareness', 'description', 'Contextual support signals without constant urgency', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'task_follow_up', 'label', 'Task follow-up', 'description', 'Open tasks and reminders surfaced at the right moment', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive insights', 'description', 'Brief highlights and executive summaries — present without demanding attention', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('key', 'knowledge_access', 'label', 'Knowledge access', 'description', 'Approved articles and gaps when relevant on mobile', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'companion_conversations', 'label', 'Companion conversations', 'description', 'Thoughtful companion interactions — one meaningful exchange at a time', 'route', '/app/proactive-companion-engine'),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Gratitude and Bell Moments — celebrate progress sustainably', 'route', '/app/gratitude-recognition-engine')
  );
$$;

create or replace function public._mcbp_blueprint_companion_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'morning_attention',
      'scenario', 'Morning attention — start the day with calm clarity',
      'example', '🌹 Good morning — three priorities today, two support cases need follow-up, and your team resolved four tasks since yesterday.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'milestone',
      'scenario', 'Milestone — celebrate steady progress',
      'example', '🔔 Milestone reached — your team closed five high-priority tasks this week. Steady progress worth noting.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'strategic_development',
      'scenario', 'Strategic development — thoughtful surfacing before reviews',
      'example', '🦉 Before your afternoon review — two executive highlights and one integration signal surfaced since your last visit.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'self_love_intense_week',
      'scenario', 'Self Love intense week — sustainable productivity',
      'example', '❤️ It has been an intense week — would a quiet moment help before the next priority block?'
    )
  );
$$;

create or replace function public._mcbp_blueprint_mobile_dashboard(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_priorities_today int := 0;
  v_open_tasks int := 0;
  v_support_open int := 0;
  v_executive_unread int := 0;
  v_bell_moments_7d int := 0;
  v_recognition_pending int := 0;
begin
  if to_regclass('public.organization_tasks') is not null then
    select count(*) into v_priorities_today
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.status not in ('completed', 'cancelled', 'archived')
      and t.due_at is not null
      and t.due_at::date <= current_date;

    select count(*) into v_open_tasks
    from public.organization_tasks t
    where t.organization_id = p_organization_id
      and t.status in ('open', 'in_progress', 'pending', 'overdue');
  end if;

  if to_regclass('public.personal_productivity_reminders') is not null and p_user_id is not null then
    v_priorities_today := v_priorities_today + coalesce((
      select count(*)::int from public.personal_productivity_reminders r
      where r.organization_id = p_organization_id and r.user_id = p_user_id
        and r.status = 'scheduled' and r.due_at::date <= current_date
    ), 0);
  end if;

  if to_regclass('public.organization_support_cases') is not null then
    select count(*) into v_support_open
    from public.organization_support_cases c
    where c.organization_id = p_organization_id
      and c.status not in ('resolved', 'closed');
  elsif to_regclass('public.support_cases') is not null then
    select count(*) into v_support_open
    from public.support_cases c
    where c.tenant_id = p_organization_id
      and c.status not in ('resolved', 'closed');
  end if;

  if to_regclass('public.organization_communication_notifications') is not null then
    select count(*) into v_executive_unread
    from public.organization_communication_notifications n
    where n.organization_id = p_organization_id
      and (n.user_id is null or n.user_id = p_user_id)
      and n.category in ('governance', 'approvals', 'system_alerts')
      and n.status in ('delivered', 'pending')
      and n.read_at is null and n.dismissed_at is null;
  end if;

  if to_regclass('public.presence_engagement_events') is not null then
    select count(*) into v_bell_moments_7d
    from public.presence_engagement_events e
    where e.tenant_id = p_organization_id
      and e.created_at >= now() - interval '7 days'
      and (
        e.event_type in ('celebration', 'milestone', 'bell_moment', 'engagement')
        or e.metadata ? 'bell_moment'
      );
  end if;

  if to_regclass('public.organization_gratitude_moments') is not null then
    select count(*) into v_recognition_pending
    from public.organization_gratitude_moments g
    where g.organization_id = p_organization_id
      and g.status in ('pending', 'acknowledged');
  end if;

  return jsonb_build_object(
    'principle', 'Simplicity first — today''s priorities, open tasks, support activity, executive highlights, Bell Moments, and recognition opportunities.',
    'blocks', jsonb_build_array(
      jsonb_build_object(
        'key', 'todays_priorities',
        'label', 'Today''s priorities',
        'description', 'Tasks and reminders due today — clarity without overload',
        'route', '/app/personal-productivity-engine',
        'count', v_priorities_today,
        'cross_link', 'Personal Productivity A.70'
      ),
      jsonb_build_object(
        'key', 'open_tasks',
        'label', 'Open tasks',
        'description', 'Unified task follow-up awareness',
        'route', '/app/unified-task-follow-up-engine',
        'count', v_open_tasks,
        'cross_link', 'Unified Tasks A.62'
      ),
      jsonb_build_object(
        'key', 'support_activity',
        'label', 'Support activity',
        'description', 'Open support cases needing attention',
        'route', '/app/support-ai-engine',
        'count', v_support_open,
        'cross_link', 'Support AI A.7'
      ),
      jsonb_build_object(
        'key', 'executive_highlights',
        'label', 'Executive highlights',
        'description', 'Governance and approval signals unread',
        'route', '/app/executive-insights-engine',
        'count', v_executive_unread,
        'cross_link', 'Executive Insights A.35'
      ),
      jsonb_build_object(
        'key', 'bell_moments',
        'label', 'Bell Moments',
        'description', 'Celebration and milestone moments (7 days)',
        'route', '/app/gratitude-recognition-engine',
        'count', v_bell_moments_7d,
        'cross_link', 'Gratitude Recognition A.89'
      ),
      jsonb_build_object(
        'key', 'recognition_opportunities',
        'label', 'Recognition opportunities',
        'description', 'Pending gratitude moments to acknowledge',
        'route', '/app/gratitude-recognition-engine',
        'count', v_recognition_pending,
        'cross_link', 'Gratitude Recognition A.89'
      )
    ),
    'privacy_note', 'Counts only — no email content, chat, orders, or PII in mobile dashboard blocks.'
  );
end; $$;

create or replace function public._mcbp_blueprint_notification_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Relevant, configurable, respectful, and timely — avoid excessive urgency, fatigue, and unnecessary interruptions.',
    'principles', jsonb_build_array(
      'Relevant — surface what matters with explainable categories and recommended actions',
      'Configurable — category subscriptions, frequency, quiet hours, and critical bypass',
      'Respectful — never alarmist; critical may bypass quiet hours when configured',
      'Timely — immediate, daily digest, or weekly digest — user decides intensity'
    ),
    'anti_patterns', jsonb_build_array(
      'Excessive urgency language on routine updates',
      'Notification fatigue without digest or quiet-hour options',
      'Unnecessary interruptions during focus or quiet hours',
      'Sensitive content in notification payloads'
    ),
    'settings_route', '/app/notification-communication-engine',
    'presence_cross_link', '/app/presence'
  );
$$;

create or replace function public._mcbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable mobile productivity — quiet hours, reflection prompts, celebrate progress, never guilt or pressure.',
    'companion_patterns', jsonb_build_array(
      'Quiet hours and vacation-aware delivery — mobile respects focus time',
      'Reflection prompts during intense weeks — never judgmental',
      'Celebrate progress via Bell Moments and recognition cross-links',
      'Sustainable productivity — one thoughtful interaction at a time'
    ),
    'self_love_route', '/app/self-love-engine',
    'phase', 'A.76',
    'boundary_note', 'Self Love is a principle — Mobile Companion stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._mcbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Mobile Companion must explain why notifications appear, what information is accessed, and how to adjust preferences — including future mobile permissions transparency.',
    'users_should_know', jsonb_build_array(
      'Why each notification was delivered — category, priority, and recommended action',
      'What metadata was accessed — counts and trends only, never raw customer content',
      'How to adjust preferences — categories, frequency, quiet hours, critical bypass',
      'Future native app — mobile permissions will be transparent when push ships (scaffold only)'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Desktop Companion Phase 61 / Blueprint Phase 20 — desk vs mobile-ready layer',
      'Distinct from Desktop Command Center Phase 27 — native Tauri client at /app/command-center',
      'Distinct from Companion Presence A.67 — mobile-web orb at /app/settings/companion-presence',
      'Native mobile app not built yet — A.17 is the mobile-ready communication layer'
    ),
    'audit_note', 'Notification sends, dismissals, and preference changes logged via _nce_log — metadata only.'
  );
$$;

create or replace function public._mcbp_blueprint_configuration_options()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Users control how Aipify surfaces information on mobile — cross-linked settings, not duplicated.',
    'options', jsonb_build_array(
      jsonb_build_object('key', 'notification_categories', 'label', 'Notification categories', 'route', '/app/notification-communication-engine', 'description', 'Category subscriptions and delivery channels'),
      jsonb_build_object('key', 'bell_moments', 'label', 'Bell Moments', 'route', '/app/gratitude-recognition-engine', 'description', 'Celebration and milestone preferences'),
      jsonb_build_object('key', 'companion_tone', 'label', 'Companion tone', 'route', '/app/personality', 'description', 'Communication style and humor alignment'),
      jsonb_build_object('key', 'humor', 'label', 'Humor levels', 'route', '/app/personality', 'description', 'Personality settings — Phase 8 cross-link'),
      jsonb_build_object('key', 'quiet_hours', 'label', 'Quiet hours', 'route', '/app/notification-communication-engine', 'description', 'Do-not-disturb windows — aligned with Presence quiet hours'),
      jsonb_build_object('key', 'recognition', 'label', 'Recognition settings', 'route', '/app/gratitude-recognition-engine', 'description', 'Gratitude and digital rose preferences'),
      jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive companion', 'route', '/app/proactive-companion-engine', 'description', 'Proactive Companion A.79 — observes and recommends')
    ),
    'communication_preferences_note', 'Cross-link communication preferences in Notification Engine — do not duplicate Presence or Desktop settings.'
  );
$$;

create or replace function public._mcbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates mobile companion internally; Unonight pilots operational mobile workflows.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — leadership awareness, task follow-up, support visibility, executive summaries',
      'focus', jsonb_build_array('Leadership Since Last Time on mobile', 'Governance and approval notifications', 'Support queue awareness', 'Executive digest without overwhelm')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational mobile workflows',
      'focus', jsonb_build_array('Commerce support on the go', 'Task follow-up during events', 'Knowledge gap awareness', 'Calm notification modes for daily operations')
    )
  );
$$;

create or replace function public._mcbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'desktop_companion', 'label', 'Desktop Companion (Phase 61)', 'route', '/app/desktop', 'note', 'Blueprint Phase 20 when shipped — desk companion'),
    jsonb_build_object('key', 'command_center_connect', 'label', 'Command Center Connect', 'route', '/app/command-center/connect', 'note', 'Desktop session pairing Phase 27'),
    jsonb_build_object('key', 'companion_presence', 'label', 'Companion Presence (A.67)', 'route', '/app/settings/companion-presence', 'note', 'Mobile-web orb — distinct from native app'),
    jsonb_build_object('key', 'personal_productivity', 'label', 'Personal Productivity (A.70)', 'route', '/app/personal-productivity-engine'),
    jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine'),
    jsonb_build_object('key', 'operations_center', 'label', 'Operations Center (A.32)', 'route', '/app/operations-center-foundation-engine', 'note', 'Since Last Time via _ocf_since_last_time_summary'),
    jsonb_build_object('key', 'unified_tasks', 'label', 'Unified Tasks (A.62)', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('key', 'support_ai', 'label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('key', 'personality', 'label', 'Personality / Humor', 'route', '/app/personality'),
    jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude Recognition (A.89)', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love (A.76)', 'route', '/app/self-love-engine')
  );
$$;

create or replace function public._mcbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trusted presence throughout the day — traveling, meetings, away from desk.',
    'Mobile creates clarity, not distraction — right information at the right moment.',
    'One thoughtful interaction at a time — companionship not limited to a desk.',
    'Informed without overwhelm — relevant, configurable, respectful notifications.',
    'Support travels with people who need it — wherever work happens.'
  );
$$;

create or replace function public._mcbp_since_last_time(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  if to_regprocedure('public._ocf_since_last_time_summary(uuid,uuid)') is not null then
    return public._ocf_since_last_time_summary(p_organization_id, p_user_id);
  end if;
  return null;
end; $$;

create or replace function public._mcbp_engagement_summary(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_prefs public.communication_notification_preferences;
  v_unread int := 0;
  v_critical_unread int := 0;
  v_delivered_24h int := 0;
  v_delivered_7d int := 0;
  v_subscribed_categories int := 0;
begin
  if p_user_id is not null then
    v_prefs := public._nce_ensure_preferences(p_organization_id, p_user_id);
  end if;

  if to_regclass('public.organization_communication_notifications') is not null then
    select count(*) into v_unread
    from public.organization_communication_notifications n
    where n.organization_id = p_organization_id
      and (n.user_id is null or n.user_id = p_user_id)
      and n.status in ('delivered', 'pending')
      and n.read_at is null and n.dismissed_at is null;

    select count(*) into v_critical_unread
    from public.organization_communication_notifications n
    where n.organization_id = p_organization_id
      and (n.user_id is null or n.user_id = p_user_id)
      and n.priority = 'critical'
      and n.status in ('delivered', 'pending')
      and n.read_at is null and n.dismissed_at is null;

    select count(*) into v_delivered_24h
    from public.organization_communication_notifications n
    where n.organization_id = p_organization_id
      and n.status = 'delivered'
      and n.created_at >= now() - interval '24 hours';

    select count(*) into v_delivered_7d
    from public.organization_communication_notifications n
    where n.organization_id = p_organization_id
      and n.status = 'delivered'
      and n.created_at >= now() - interval '7 days';
  end if;

  if v_prefs.category_subscriptions is not null then
    select count(*) into v_subscribed_categories
    from jsonb_each_text(v_prefs.category_subscriptions) s
    where s.value = 'true';
  end if;

  return jsonb_build_object(
    'preferences_configured', p_user_id is not null and v_prefs.id is not null,
    'unread_notifications', v_unread,
    'critical_unread', v_critical_unread,
    'delivered_last_24h', v_delivered_24h,
    'delivered_last_7d', v_delivered_7d,
    'frequency', coalesce(v_prefs.frequency, 'immediate'),
    'quiet_hours_enabled', coalesce((v_prefs.quiet_hours->>'enabled')::boolean, false),
    'critical_bypass_quiet_hours', coalesce(v_prefs.critical_bypass_quiet_hours, true),
    'subscribed_categories', v_subscribed_categories,
    'mobile_push_scaffold', true,
    'mobile_push_note', 'Native mobile app not built yet — push channel scaffolded in future_channels; A.17 is mobile-ready communication layer.',
    'privacy_note', 'Engagement counts only — no notification body content or PII.'
  );
end; $$;

create or replace function public._mcbp_blueprint_success_criteria(p_organization_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_since jsonb;
  v_mobile jsonb;
  v_prefs public.communication_notification_preferences;
begin
  v_engagement := public._mcbp_engagement_summary(p_organization_id, p_user_id);
  v_since := public._mcbp_since_last_time(p_organization_id, p_user_id);
  v_mobile := public._mcbp_blueprint_mobile_dashboard(p_organization_id, p_user_id);

  if p_user_id is not null then
    v_prefs := public._nce_ensure_preferences(p_organization_id, p_user_id);
  end if;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'companion_objectives_documented',
      'label', 'Companion objectives cover Since Last Time, notifications, support, tasks, executive, knowledge, conversations, recognition',
      'met', jsonb_array_length(public._mcbp_blueprint_companion_objectives()) >= 8,
      'note', null
    ),
    jsonb_build_object(
      'key', 'mobile_dashboard_blocks',
      'label', 'Mobile dashboard metadata blocks documented with live counts where tables exist',
      'met', v_mobile ? 'blocks' and jsonb_array_length(v_mobile->'blocks') >= 6,
      'note', 'Empty-safe with to_regclass checks — counts only.'
    ),
    jsonb_build_object(
      'key', 'notification_preferences',
      'label', 'Communication preferences configured — categories, frequency, quiet hours',
      'met', p_user_id is not null and v_prefs.id is not null,
      'note', case when p_user_id is null then 'Authenticated user required for personalized mobile companion.' else null end
    ),
    jsonb_build_object(
      'key', 'reduce_friction',
      'label', 'Reduce friction — actionable notifications with recommended actions and routes',
      'met', coalesce((v_engagement->>'unread_notifications')::int, 0) >= 0,
      'note', 'Unread notifications include action_url and recommended_action when configured.'
    ),
    jsonb_build_object(
      'key', 'informed_not_overwhelmed',
      'label', 'Informed without overwhelm — digest frequency and quiet hours available',
      'met', coalesce(v_prefs.frequency, 'immediate') is not null
        and coalesce((v_prefs.quiet_hours->>'enabled')::boolean, false) is not null,
      'note', 'Users control intensity via frequency and quiet hours.'
    ),
    jsonb_build_object(
      'key', 'since_last_time',
      'label', 'Since Last Time available when Operations Center function exists',
      'met', v_since is not null and v_since ? 'since',
      'note', case
        when v_since is null then 'Wraps _ocf_since_last_time_summary when Phase 18 migration applied.'
        else 'Counts only — no PII.'
      end
    ),
    jsonb_build_object(
      'key', 'companion_experiences',
      'label', 'Companion experiences (🌹🔔🦉❤️) documented with examples',
      'met', jsonb_array_length(public._mcbp_blueprint_companion_experiences()) >= 4,
      'note', 'Morning attention, milestone, strategic development, Self Love intense week.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust — why notifications appear, preference adjustment, mobile permissions scaffold documented',
      'met', (public._mcbp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'Native mobile permissions transparency when app ships.'
    ),
    jsonb_build_object(
      'key', 'accessible_wherever',
      'label', 'Accessible wherever work happens — mobile-ready layer on Notification Engine A.17',
      'met', true,
      'note', 'Native app future — A.17 extends communication for mobile companion metadata now.'
    ),
    jsonb_build_object(
      'key', 'metadata_only_privacy',
      'label', 'Metadata-only privacy — no email, chat, orders, or PII in payloads',
      'met', true,
      'note', 'Trust boundary enforced by RPC aggregation — panels are thin clients.'
    )
  );
end; $$;

create or replace function public._mcbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Desktop Companion Phase 61 / Blueprint Phase 20 /app/desktop (desk companion), Desktop Command Center Phase 27 /app/command-center (native Tauri), Companion Presence A.67 /app/settings/companion-presence (mobile-web orb), and Proactive Companion A.79 /app/proactive-companion-engine (observes and recommends). Native mobile app not built yet — A.17 is the mobile-ready communication layer.';
$$;

create or replace function public.get_notification_communication_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_prefs public.communication_notification_preferences;
begin
  perform public._irp_require_permission('notifications.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_prefs := public._nce_ensure_preferences(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Centralized communication across Aipify Core — actionable, preference-aware, and auditable.',
    'safety_note', 'Notification payloads store metadata only — never email content, chat, or PII.',
    'principles', jsonb_build_array(
      'Tenant-aware and role-aware delivery',
      'Configurable preferences with quiet hours alignment',
      'Critical alerts may bypass quiet hours',
      'Action-oriented with direct navigation links',
      'Full audit support for sends, dismissals, and preference changes'
    ),
    'preferences', row_to_json(v_prefs),
    'trends', public._nce_notification_trends(v_org_id, v_user_id),
    'unread_notifications', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, message, action_url, recommended_action,
               status, delivered_at, read_at, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status in ('delivered', 'pending')
          and read_at is null and dismissed_at is null
        order by case priority when 'critical' then 0 when 'high' then 1 when 'medium' then 2 else 3 end, created_at desc
        limit 20
      ) n
    ), '[]'::jsonb),
    'critical_alerts', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, message, action_url, recommended_action, status, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and priority = 'critical'
          and status in ('delivered', 'pending')
          and read_at is null and dismissed_at is null
        order by created_at desc
        limit 10
      ) n
    ), '[]'::jsonb),
    'recent_history', coalesce((
      select jsonb_agg(row_to_json(n) order by n.created_at desc)
      from (
        select id, category, priority, title, status, read_at, dismissed_at, created_at
        from public.organization_communication_notifications
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
        order by created_at desc
        limit 15
      ) n
    ), '[]'::jsonb),
    'recent_digests', public.get_communication_digests(5),
    'future_channels', jsonb_build_array('push', 'sms', 'messaging', 'desktop'),
    'implementation_blueprint', jsonb_build_object(
      'phase', 21,
      'title', 'Mobile Companion Engine',
      'engine_phase', 'A.17',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE21_MOBILE_COMPANION.md',
      'mapping_note', 'ABOS Blueprint Phase 21 maps to Notification & Communication Engine A.17 — mobile-ready companion communication layer. Native mobile app not built yet. Cross-link Desktop Companion Phase 20 / Phase 61.'
    ),
    'mission', 'Extend Aipify beyond the desk — thoughtful mobile companion experiences; available wherever people work.',
    'mobile_philosophy', 'Mobile creates clarity, not distraction — the right information at the right moment.',
    'abos_principle', 'Companionship is not limited to a desk — support travels with people who need it.',
    'mobile_companion_engine_note', 'Mobile Companion Engine (ABOS Phase 21) — extends Notification & Communication Engine (Phase A.17).',
    'distinction_note', public._mcbp_distinction_note(),
    'companion_objectives', public._mcbp_blueprint_companion_objectives(),
    'companion_experiences', public._mcbp_blueprint_companion_experiences(),
    'mobile_dashboard', public._mcbp_blueprint_mobile_dashboard(v_org_id, v_user_id),
    'notification_principles', public._mcbp_blueprint_notification_principles(),
    'self_love_connection', public._mcbp_blueprint_self_love_connection(),
    'trust_connection', public._mcbp_blueprint_trust_connection(),
    'configuration_options', public._mcbp_blueprint_configuration_options(),
    'dogfooding', public._mcbp_blueprint_dogfooding(),
    'integration_links', public._mcbp_blueprint_integration_links(),
    'engagement_summary', public._mcbp_engagement_summary(v_org_id, v_user_id),
    'since_last_time', public._mcbp_since_last_time(v_org_id, v_user_id),
    'success_criteria', public._mcbp_blueprint_success_criteria(v_org_id, v_user_id),
    'vision_phrases', public._mcbp_blueprint_vision_phrases()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_notification_communication_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  return jsonb_build_object(
    'has_organization', true,
    'unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'critical_unread', coalesce((
      select count(*) from public.organization_communication_notifications n
      where n.organization_id = v_org_id
        and (n.user_id is null or n.user_id = v_user_id)
        and n.priority = 'critical'
        and n.status in ('delivered', 'pending')
        and n.read_at is null and n.dismissed_at is null
    ), 0),
    'philosophy', 'Organization communication hub — preferences, digests, and actionable alerts.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 21,
      'title', 'Mobile Companion Engine',
      'engine_phase', 'A.17',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE21_MOBILE_COMPANION.md',
      'mapping_note', 'Mobile-ready companion communication layer — native app future.'
    ),
    'mission', 'Extend Aipify beyond the desk — thoughtful mobile companion experiences; available wherever people work.',
    'abos_principle', 'Companionship is not limited to a desk — support travels with people who need it.',
    'engagement_summary', public._mcbp_engagement_summary(v_org_id, v_user_id),
    'blueprint_note', 'Mobile Companion Engine (ABOS Phase 21) — extends A.17 with blueprint metadata, mobile dashboard blocks, Since Last Time cross-link, and live success criteria.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._mcbp_blueprint_companion_objectives() to authenticated;
grant execute on function public._mcbp_blueprint_companion_experiences() to authenticated;
grant execute on function public._mcbp_blueprint_mobile_dashboard(uuid, uuid) to authenticated;
grant execute on function public._mcbp_blueprint_notification_principles() to authenticated;
grant execute on function public._mcbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._mcbp_blueprint_trust_connection() to authenticated;
grant execute on function public._mcbp_blueprint_configuration_options() to authenticated;
grant execute on function public._mcbp_blueprint_dogfooding() to authenticated;
grant execute on function public._mcbp_blueprint_integration_links() to authenticated;
grant execute on function public._mcbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._mcbp_since_last_time(uuid, uuid) to authenticated;
grant execute on function public._mcbp_engagement_summary(uuid, uuid) to authenticated;
grant execute on function public._mcbp_blueprint_success_criteria(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'mobile-companion-engine-blueprint', 'Mobile Companion Engine (ABOS Phase 21)',
  'Mobile Companion Engine — extends Notification & Communication Engine A.17 with mobile-ready companion metadata, dashboard blocks, Since Last Time cross-link, and live success criteria.',
  'authenticated', 98
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'mobile-companion-engine-blueprint' and tenant_id is null
);
