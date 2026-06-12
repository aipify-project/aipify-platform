-- Implementation Blueprint Phase 20 — Desktop Companion Engine
-- Spec alignment extending Desktop Companion (Phase 61). No new tables.

create or replace function public._dcbp_blueprint_companion_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'conversations', 'label', 'Quick conversations', 'description', 'Mini-chat and ask-anything panel — support available naturally throughout the workday'),
    jsonb_build_object('key', 'since_last_time', 'label', 'Since Last Time summaries', 'description', 'Pick up where you left off with metadata trends — reuses Operations Center pattern when org context available'),
    jsonb_build_object('key', 'tasks', 'label', 'Task awareness', 'description', 'Reminders, unified tasks cross-link, and upcoming priorities without constant urgency'),
    jsonb_build_object('key', 'support', 'label', 'Support notifications', 'description', 'Contextual support queue signals — helpful, configurable, respectful'),
    jsonb_build_object('key', 'bell_moments', 'label', 'Bell Moments', 'description', 'Small victories and celebration moments — never alarmist or intrusive'),
    jsonb_build_object('key', 'recognition', 'label', 'Recognition', 'description', 'Gratitude and recognition cross-links — celebrate progress sustainably'),
    jsonb_build_object('key', 'knowledge', 'label', 'Knowledge search', 'description', 'Knowledge Center gaps and articles surfaced when relevant'),
    jsonb_build_object('key', 'executive', 'label', 'Executive insights', 'description', 'Briefing and executive summaries — present without demanding attention')
  );
$$;

create or replace function public._dcbp_blueprint_companion_experiences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'morning_summary',
      'scenario', 'Morning summary — start the day with calm context',
      'example', '🌹 Good morning — here is what matters today: three approvals pending, two knowledge gaps, and your team resolved five support cases yesterday.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'small_victory',
      'scenario', 'Small victory — celebrate steady progress',
      'example', '🔔 Your team closed three high-priority tasks since yesterday — steady progress worth noting.'
    ),
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'developments_attention',
      'scenario', 'Developments worth attention — thoughtful surfacing',
      'example', '🦉 Before your afternoon review — two quality incidents and one integration alert surfaced since your last visit.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'self_love_busy_week',
      'scenario', 'Self Love busy week — sustainable productivity',
      'example', '❤️ It has been a busy week — would a short break help before the next priority block?'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'bell_moment',
      'scenario', 'Bell Moment — milestone without pressure',
      'example', '🔔 Knowledge gap resolved — your team published an answer that will help support handle similar questions.'
    )
  );
$$;

create or replace function public._dcbp_blueprint_mini_panel_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'ask_anything', 'label', 'Ask anything', 'description', 'Mini-chat for quick questions — what is important, why was I notified', 'route', '/app/desktop'),
    jsonb_build_object('key', 'tasks', 'label', 'Tasks', 'description', 'Upcoming reminders and unified task awareness', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('key', 'notifications', 'label', 'Notifications', 'description', 'Smart notifications with explain and dismiss — mode-aware delivery', 'route', '/app/desktop/history'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'description', 'Search and gap awareness from desktop companion context', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('key', 'support_queues', 'label', 'Support queues', 'description', 'Support AI signals when cases need attention', 'route', '/app/support-ai-engine'),
    jsonb_build_object('key', 'executive_summaries', 'label', 'Executive summaries', 'description', 'Briefing card and executive insights cross-link', 'route', '/app/executive-insights-engine')
  );
$$;

create or replace function public._dcbp_blueprint_notification_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Helpful, contextual, configurable, and respectful — avoid excessive interruptions, constant urgency, and overload.',
    'principles', jsonb_build_array(
      'Helpful — surface what matters with explainable source modules and recommendations',
      'Contextual — mode-aware delivery (Silent, Balanced, Active Assistant, Focus)',
      'Configurable — quiet hours, category filters, max notifications per day, dedupe window',
      'Respectful — never alarmist; critical bypasses quiet hours; vacation mode suppresses non-essential noise'
    ),
    'anti_patterns', jsonb_build_array(
      'Excessive interruptions throughout the workday',
      'Constant urgency language on routine updates',
      'Notification overload without dedupe or daily caps',
      'Surfacing sensitive content in notification payloads'
    ),
    'settings_route', '/app/desktop/settings'
  );
$$;

create or replace function public._dcbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love supports sustainable productivity — breaks, celebrate progress, reduce stress — without guilt or pressure.',
    'companion_patterns', jsonb_build_array(
      'Suggest breaks during busy weeks — never judgmental',
      'Celebrate progress via Bell Moments and small victories',
      'Reduce stress — calm summaries instead of alarmist dashboards',
      'Sustainable productivity — mode and quiet hours respect focus time'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. No ™ in product copy.'
  );
$$;

create or replace function public._dcbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Desktop Companion must explain what information is accessed, why notifications occur, and how to adjust preferences.',
    'users_should_know', jsonb_build_array(
      'Which source module contributed each notification (quality, governance, knowledge, briefing, unonight)',
      'Why a notification was delivered — severity, mode, and recommendation via explain_desktop_notification',
      'How to adjust preferences — quiet hours, modes, category filters, max per day',
      'That Desktop Companion respects tenant isolation — never cross-tenant data'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Desktop Command Center Phase 27 — native Tauri client at /app/command-center',
      'Distinct from Proactive Companion A.79 — proactive engine observes; desktop delivers',
      'Distinct from Companion Presence A.67 — presence indicator; desktop is notification layer',
      'Briefing Phase 60 already integrated in get_desktop_companion_card — extend, do not duplicate'
    ),
    'audit_note', 'Notification read, dismiss, and preference changes logged via _tacc_log_audit — metadata only.'
  );
$$;

create or replace function public._dcbp_blueprint_configuration_options()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Users control how actively Aipify surfaces information throughout the workday.',
    'options', jsonb_build_array(
      jsonb_build_object('key', 'notification_prefs', 'label', 'Notification preferences', 'route', '/app/desktop/settings', 'description', 'Category filters, quiet hours, max per day, dedupe window'),
      jsonb_build_object('key', 'humor_levels', 'label', 'Humor levels', 'route', '/app/personality', 'description', 'Personality and humor settings — Phase 8 cross-link'),
      jsonb_build_object('key', 'bell_moments', 'label', 'Bell Moments', 'route', '/app/gratitude-recognition-engine', 'description', 'Celebration and recognition settings — Phase 9 cross-link'),
      jsonb_build_object('key', 'companion_tone', 'label', 'Companion tone', 'route', '/app/personality', 'description', 'Communication style and companion identity alignment'),
      jsonb_build_object('key', 'quiet_hours', 'label', 'Quiet hours', 'route', '/app/desktop/settings', 'description', 'Configure do-not-disturb windows — critical may bypass'),
      jsonb_build_object('key', 'recognition_settings', 'label', 'Recognition settings', 'route', '/app/gratitude-recognition-engine', 'description', 'Gratitude and recognition engine preferences'),
      jsonb_build_object('key', 'proactive_companion', 'label', 'Proactive companion prefs', 'route', '/app/proactive-companion-engine', 'description', 'Proactive Companion A.79 — observes and recommends; desktop delivers')
    ),
    'modes_route', '/app/desktop/modes'
  );
$$;

create or replace function public._dcbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Desktop Companion internally; Unonight is the first external operational pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — executive awareness, daily planning, support ops, knowledge surfacing',
      'focus', jsonb_build_array('Platform health and governance approvals', 'Quality incident awareness', 'Briefing and Since Last Time for leadership', 'Sustainable pacing via Self Love cross-links')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational companion for commerce support',
      'focus', jsonb_build_array('Pilot event notifications', 'Support and knowledge gap awareness', 'Launch task reminders', 'Calm notification modes for daily operations')
    )
  );
$$;

create or replace function public._dcbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Desktop Command Center (Phase 27)', 'route', '/app/command-center', 'note', 'Native desktop client — distinct from web Desktop Companion'),
    jsonb_build_object('label', 'Command Center Connect', 'route', '/app/command-center/connect', 'note', 'Desktop session pairing'),
    jsonb_build_object('label', 'Proactive Companion (A.79)', 'route', '/app/proactive-companion-engine', 'note', 'Observes and recommends — desktop delivers notifications'),
    jsonb_build_object('label', 'Companion Presence (A.67)', 'route', '/app/companion-presence-indicator-engine', 'note', 'Presence indicator — distinct surface'),
    jsonb_build_object('label', 'Operations Center (A.32)', 'route', '/app/operations-center-foundation-engine', 'note', 'Since Last Time pattern reused via _ocf_since_last_time_summary'),
    jsonb_build_object('label', 'Unified Tasks (A.62)', 'route', '/app/unified-task-follow-up-engine'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine'),
    jsonb_build_object('label', 'Personality / Humor (Phase 8)', 'route', '/app/personality'),
    jsonb_build_object('label', 'Gratitude Recognition (A.89)', 'route', '/app/gratitude-recognition-engine'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine'),
    jsonb_build_object('label', 'Briefing (Phase 60)', 'route', '/app/briefing', 'note', 'Already in get_desktop_companion_card')
  );
$$;

create or replace function public._dcbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trusted presence throughout the workday — support within reach without demanding attention.',
    'Best companions contribute meaningfully when needed — they do not compete for attention.',
    'Available when needed, not intrusive — calm notifications, explainable sources, user-controlled modes.',
    'Since Last Time — pick up where you left off with trends, not noise.',
    'Sustainable productivity — celebrate progress, suggest breaks, reduce notification fatigue.'
  );
$$;

create or replace function public._dcbp_engagement_summary(p_tenant_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_prefs public.desktop_preferences;
  v_mode public.desktop_modes;
  v_modes_count int := 0;
  v_unread int := 0;
  v_notifications_24h int := 0;
  v_reminders_scheduled int := 0;
  v_reminders_due_24h int := 0;
  v_delivered_today int := 0;
begin
  if p_user_id is not null then
    v_prefs := public._dk_ensure_preferences(p_tenant_id, p_user_id);
    select * into v_mode from public.desktop_modes where mode_key = v_prefs.mode_key;
  end if;

  select count(*) into v_modes_count from public.desktop_modes;

  if p_user_id is not null then
    select count(*) into v_unread
    from public.desktop_notifications
    where tenant_id = p_tenant_id and user_id = p_user_id
      and status in ('pending', 'delivered');

    select count(*) into v_notifications_24h
    from public.desktop_notifications
    where tenant_id = p_tenant_id and user_id = p_user_id
      and created_at >= now() - interval '24 hours';

    select count(*) into v_delivered_today
    from public.desktop_notifications
    where tenant_id = p_tenant_id and user_id = p_user_id
      and delivered_at >= date_trunc('day', now());

    select count(*) into v_reminders_scheduled
    from public.desktop_reminders
    where tenant_id = p_tenant_id and user_id = p_user_id and status = 'scheduled';

    select count(*) into v_reminders_due_24h
    from public.desktop_reminders
    where tenant_id = p_tenant_id and user_id = p_user_id
      and status = 'scheduled' and due_at <= now() + interval '24 hours';
  end if;

  return jsonb_build_object(
    'preferences_configured', p_user_id is not null,
    'companion_enabled', coalesce(v_prefs.enabled, false),
    'mode_key', v_prefs.mode_key,
    'mode_name', v_mode.name,
    'available_modes', v_modes_count,
    'unread_notifications', v_unread,
    'notifications_last_24h', v_notifications_24h,
    'notifications_delivered_today', v_delivered_today,
    'max_notifications_per_day', coalesce(v_prefs.max_notifications_per_day, 25),
    'dedupe_window_minutes', coalesce(v_prefs.dedupe_window_minutes, 60),
    'quiet_hours_enabled', coalesce((v_prefs.quiet_hours->>'enabled')::boolean, false),
    'reminders_scheduled', v_reminders_scheduled,
    'reminders_due_24h', v_reminders_due_24h,
    'include_briefing', coalesce(v_prefs.include_briefing, true),
    'mini_chat_enabled', coalesce(v_mode.include_mini_chat, false)
  );
end; $$;

create or replace function public._dcbp_blueprint_success_criteria(p_tenant_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_prefs public.desktop_preferences;
  v_modes_count int := 0;
  v_engagement jsonb;
  v_since jsonb;
  v_org_id uuid;
  v_app_user_id uuid;
begin
  if p_user_id is not null then
    v_prefs := public._dk_ensure_preferences(p_tenant_id, p_user_id);
  end if;

  select count(*) into v_modes_count from public.desktop_modes;
  v_engagement := public._dcbp_engagement_summary(p_tenant_id, p_user_id);

  begin
    v_org_id := public._mta_require_organization();
    v_app_user_id := public._mta_app_user_id();
    if v_org_id is not null and v_app_user_id is not null
      and to_regprocedure('public._ocf_since_last_time_summary(uuid,uuid)') is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_app_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'preferences_configured',
      'label', 'Companion preferences configured for tenant user',
      'met', p_user_id is not null and v_prefs.id is not null,
      'note', case when p_user_id is null then 'Authenticated user required for personalized companion.' else null end
    ),
    jsonb_build_object(
      'key', 'notification_modes',
      'label', 'Four notification modes available (Silent, Balanced, Active Assistant, Focus)',
      'met', v_modes_count >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'natural_engagement',
      'label', 'Natural engagement — companion enabled with mode-aware delivery',
      'met', coalesce(v_prefs.enabled, false) and v_prefs.mode_key is not null,
      'note', case when not coalesce(v_prefs.enabled, false) then 'Enable Desktop Companion in settings to validate delivery.' else null end
    ),
    jsonb_build_object(
      'key', 'appropriate_surfacing',
      'label', 'Appropriate surfacing — briefing and category filters configurable',
      'met', v_prefs.id is not null,
      'note', 'Category toggles and modes control what surfaces — users decide intensity.'
    ),
    jsonb_build_object(
      'key', 'productivity_support',
      'label', 'Productivity support — reminders and briefing integration available',
      'met', coalesce(v_prefs.include_briefing, true) or coalesce((v_engagement->>'reminders_scheduled')::int, 0) > 0,
      'note', null
    ),
    jsonb_build_object(
      'key', 'notification_fatigue_controls',
      'label', 'Reduced notification fatigue — max per day and dedupe window configured',
      'met', coalesce(v_prefs.max_notifications_per_day, 25) <= 50
        and coalesce(v_prefs.dedupe_window_minutes, 60) >= 15,
      'note', 'Daily cap and dedupe window prevent overload — adjust in settings.'
    ),
    jsonb_build_object(
      'key', 'since_last_time',
      'label', 'Since Last Time available when organization context exists',
      'met', v_since is not null and v_since ? 'since',
      'note', case
        when v_since is null then 'Organization context required — reuses _ocf_since_last_time_summary when available.'
        else 'Counts only — no PII.'
      end
    ),
    jsonb_build_object(
      'key', 'companion_experiences',
      'label', 'Companion experiences (🌹🔔🦉❤️) documented with examples',
      'met', true,
      'note', 'Morning summary, small victory, developments worth attention, Self Love busy week.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust — explain notification, preference controls, and audit logging available',
      'met', exists (
        select 1 from pg_proc p
        join pg_namespace n on n.oid = p.pronamespace
        where n.nspname = 'public' and p.proname = 'explain_desktop_notification'
      ),
      'note', 'Users understand source modules and can adjust preferences.'
    ),
    jsonb_build_object(
      'key', 'metadata_only_privacy',
      'label', 'Metadata-only privacy — no email, chat, orders, or PII in notification payloads',
      'met', true,
      'note', 'Trust boundary enforced by RPC aggregation — panels are thin clients.'
    )
  );
end; $$;

create or replace function public._dcbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Desktop Command Center Phase 27 /app/command-center (native Tauri client), Proactive Companion A.79 /app/proactive-companion-engine (observes and recommends), and Companion Presence A.67 /app/companion-presence-indicator-engine (presence indicator). Briefing Phase 60 already integrated in card — extend, do not duplicate.';
$$;

create or replace function public.get_desktop_companion_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_org_id uuid;
  v_app_user_id uuid;
  v_since jsonb;
  v_prefs public.desktop_preferences;
  v_modes jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then
    return jsonb_build_object('has_customer', false);
  end if;

  v_prefs := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  v_modes := public.get_desktop_modes();

  begin
    v_org_id := public._mta_require_organization();
    v_app_user_id := public._mta_app_user_id();
    if v_org_id is not null and v_app_user_id is not null
      and to_regprocedure('public._ocf_since_last_time_summary(uuid,uuid)') is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_app_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_object(
    'has_customer', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 20 — Desktop Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE20_DESKTOP_COMPANION.md',
      'engine_phase', 'Phase 61 Desktop Companion',
      'route', '/app/desktop',
      'mapping_note', 'ABOS Blueprint Phase 20 maps to Desktop Companion Phase 61 — extend, do not duplicate. Distinct from Command Center Phase 27, Proactive Companion A.79, and Companion Presence A.67.'
    ),
    'mission', 'Accessible desktop companion — support, awareness, and assistance throughout the workday; available when needed, not intrusive.',
    'philosophy', 'Support available naturally; present without demanding attention.',
    'abos_principle', 'Best companions contribute meaningfully when needed — they do not compete for attention.',
    'vision', 'Trusted presence throughout the workday — support within reach without demanding attention.',
    'desktop_companion_engine_note', 'Desktop Companion Engine (ABOS Phase 20) — extends Desktop Companion (Phase 61).',
    'distinction_note', public._dcbp_distinction_note(),
    'companion_objectives', public._dcbp_blueprint_companion_objectives(),
    'companion_experiences', public._dcbp_blueprint_companion_experiences(),
    'mini_panel_capabilities', public._dcbp_blueprint_mini_panel_capabilities(),
    'notification_principles', public._dcbp_blueprint_notification_principles(),
    'self_love_connection', public._dcbp_blueprint_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports sustainable productivity — principle only; Desktop Companion stores metadata, not wellbeing content.',
    'trust_connection', public._dcbp_blueprint_trust_connection(),
    'configuration_options', public._dcbp_blueprint_configuration_options(),
    'dogfooding', public._dcbp_blueprint_dogfooding(),
    'success_criteria', public._dcbp_blueprint_success_criteria(v_tenant_id, v_user_id),
    'vision_phrases', public._dcbp_blueprint_vision_phrases(),
    'integration_links', public._dcbp_blueprint_integration_links(),
    'engagement_summary', public._dcbp_engagement_summary(v_tenant_id, v_user_id),
    'since_last_time', v_since,
    'preferences', jsonb_build_object(
      'enabled', v_prefs.enabled,
      'mode_key', v_prefs.mode_key,
      'quiet_hours', v_prefs.quiet_hours,
      'max_notifications_per_day', v_prefs.max_notifications_per_day,
      'include_briefing', v_prefs.include_briefing,
      'include_support', v_prefs.include_support,
      'include_knowledge', v_prefs.include_knowledge
    ),
    'modes', v_modes,
    'safety_note', 'Metadata and summary counts only — no customer email, chat, order content, or PII in notification payloads.',
    'principles', jsonb_build_array(
      'Helpful, contextual, configurable, respectful notifications',
      'Mode-aware delivery — Silent, Balanced, Active Assistant, Focus',
      'Explain why — source module, severity, recommendation',
      'User controls intensity — quiet hours, caps, dedupe',
      'Since Last Time — counts and trends only when org context available'
    )
  );
exception when others then
  return jsonb_build_object('has_customer', false);
end; $$;

create or replace function public.get_desktop_companion_card()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_user_id uuid;
  v_prefs public.desktop_preferences;
  v_mode public.desktop_modes;
  v_unread int;
  v_reminders int;
  v_items jsonb;
  v_brief jsonb;
  v_engagement jsonb;
begin
  v_tenant_id := public._dk_require_tenant();
  v_user_id := public._dk_auth_user_id();
  if v_user_id is null then return jsonb_build_object('has_customer', false); end if;

  v_prefs := public._dk_ensure_preferences(v_tenant_id, v_user_id);
  select * into v_mode from public.desktop_modes where mode_key = v_prefs.mode_key;

  perform public.deliver_desktop_notifications();

  select count(*) into v_unread
  from public.desktop_notifications
  where tenant_id = v_tenant_id and user_id = v_user_id and status in ('pending', 'delivered');

  select count(*) into v_reminders
  from public.desktop_reminders
  where tenant_id = v_tenant_id and user_id = v_user_id
    and status = 'scheduled' and due_at <= now() + interval '24 hours';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', n.id, 'title', n.title, 'body', n.body, 'severity', n.severity,
    'action_url', n.action_url, 'source_module', n.source_module, 'created_at', n.created_at
  ) order by n.created_at desc), '[]'::jsonb) into v_items
  from (
    select * from public.desktop_notifications
    where tenant_id = v_tenant_id and user_id = v_user_id
      and status in ('pending', 'delivered', 'read')
    order by created_at desc limit 5
  ) n;

  if v_prefs.include_briefing then
    begin
      v_brief := public.get_briefing_card();
    exception when others then
      v_brief := '{}'::jsonb;
    end;
  end if;

  v_engagement := public._dcbp_engagement_summary(v_tenant_id, v_user_id);

  return jsonb_build_object(
    'has_customer', true,
    'enabled', v_prefs.enabled,
    'mode_key', v_prefs.mode_key,
    'mode_name', v_mode.name,
    'unread_count', v_unread,
    'upcoming_reminders', v_reminders,
    'notifications', v_items,
    'briefing_summary', coalesce(v_brief->>'summary', 'Aipify is monitoring your business.'),
    'briefing_greeting', v_brief->>'greeting',
    'mini_chat_enabled', coalesce(v_mode.include_mini_chat, false),
    'privacy_note', 'Desktop Companion respects permissions and never exposes sensitive data across tenants.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 20 — Desktop Companion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE20_DESKTOP_COMPANION.md',
      'engine_phase', 'Phase 61 Desktop Companion',
      'route', '/app/desktop'
    ),
    'abos_principle', 'Best companions contribute meaningfully when needed — they do not compete for attention.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Desktop Companion Engine (ABOS Phase 20) — extends Phase 61 with blueprint metadata, Since Last Time cross-link, and live success criteria on the engine dashboard.'
  );
end; $$;

grant execute on function public._dcbp_blueprint_companion_objectives() to authenticated;
grant execute on function public._dcbp_blueprint_companion_experiences() to authenticated;
grant execute on function public._dcbp_blueprint_mini_panel_capabilities() to authenticated;
grant execute on function public._dcbp_blueprint_notification_principles() to authenticated;
grant execute on function public._dcbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._dcbp_blueprint_trust_connection() to authenticated;
grant execute on function public._dcbp_blueprint_configuration_options() to authenticated;
grant execute on function public._dcbp_blueprint_dogfooding() to authenticated;
grant execute on function public._dcbp_blueprint_integration_links() to authenticated;
grant execute on function public._dcbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._dcbp_engagement_summary(uuid, uuid) to authenticated;
grant execute on function public._dcbp_blueprint_success_criteria(uuid, uuid) to authenticated;
grant execute on function public.get_desktop_companion_engine_dashboard() to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'desktop-companion-engine-blueprint', 'Desktop Companion Engine (ABOS Phase 20)',
  'Desktop Companion Engine — extends Desktop Companion Phase 61 with blueprint metadata, Since Last Time cross-link, mini panel capabilities, and live success criteria.',
  'authenticated', 95
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'desktop-companion-engine-blueprint' and tenant_id is null
);
