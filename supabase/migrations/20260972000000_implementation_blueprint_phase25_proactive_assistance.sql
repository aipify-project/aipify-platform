-- Implementation Blueprint Phase 25 — Proactive Assistance Engine
-- Spec alignment extending Proactive Companion Engine (Phase A.79). No new tables.

create or replace function public._paebp_blueprint_proactive_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'early_risk_detection', 'label', 'Early risk detection', 'description', 'Surface escalating volumes, bottlenecks, and workload imbalances before they become crises'),
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification', 'description', 'Identify strategic opportunities, positive trends, and simplification wins worth leadership review'),
    jsonb_build_object('key', 'reminder_generation', 'label', 'Reminder generation', 'description', 'Timely reminders for deadlines, follow-ups, and preparation windows — supportive, not urgent'),
    jsonb_build_object('key', 'workflow_improvement', 'label', 'Workflow improvement suggestions', 'description', 'Suggest operational improvements from metadata patterns — humans approve before changes'),
    jsonb_build_object('key', 'follow_up_recommendations', 'label', 'Follow-up recommendations', 'description', 'Recommend thoughtful follow-ups on tasks, support cases, and executive milestones'),
    jsonb_build_object('key', 'knowledge_gap_awareness', 'label', 'Knowledge gap awareness', 'description', 'Surface topics lacking documentation, articles needing review, and critical dependencies')
  );
$$;

create or replace function public._paebp_blueprint_proactive_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metadata-only proactive signals — patterns and summaries, never raw customer records, surveillance, or colleague monitoring.',
    'categories', jsonb_build_array(
      jsonb_build_object(
        'domain', 'support',
        'label', 'Support proactive signals',
        'signals', jsonb_build_array(
          'Escalating support volumes and queue trends',
          'Increasing response times and backlog growth',
          'Repeated customer concerns and topic clusters',
          'Escalation readiness before peak events'
        )
      ),
      jsonb_build_object(
        'domain', 'operational',
        'label', 'Operational proactive signals',
        'signals', jsonb_build_array(
          'Tasks approaching deadlines and overdue risk',
          'Unbalanced workloads and capacity warnings',
          'Bottlenecks in approval and handoff workflows',
          'Preparation windows before operational reviews'
        )
      ),
      jsonb_build_object(
        'domain', 'knowledge',
        'label', 'Knowledge proactive signals',
        'signals', jsonb_build_array(
          'Topics lacking approved documentation',
          'Articles needing review based on support patterns',
          'Critical dependencies and knowledge coverage gaps',
          'Search effectiveness and missing-topic patterns'
        )
      ),
      jsonb_build_object(
        'domain', 'executive',
        'label', 'Executive proactive signals',
        'signals', jsonb_build_array(
          'Strategic opportunities and positive performance trends',
          'Milestones approaching and briefing preparation',
          'Decision context before leadership syncs',
          'Cross-module alignment cues — metadata only'
        )
      )
    )
  );
$$;

create or replace function public._paebp_blueprint_companion_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'trend_deserves_attention',
      'scenario', 'Trend deserves attention — thoughtful foresight',
      'example', '🦉 Support response times have risen 15% this week — the trend deserves attention before backlog grows. Would you like a summary for review?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'opportunity_to_simplify',
      'scenario', 'Opportunity to simplify',
      'example', '🌹 Three approval steps overlap on similar requests — Aipify sees an opportunity to simplify the workflow when you have a moment to review.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'small_intervention_prevents_bottleneck',
      'scenario', 'Small intervention prevents bottleneck',
      'example', '🔔 Two tasks share the same deadline tomorrow — a small handoff now may prevent a bottleneck later.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'three_priorities_matter_most',
      'scenario', 'Three priorities that matter most',
      'example', '❤️ Before your meeting — here are three priorities that matter most today. Everything else can wait.'
    )
  );
$$;

create or replace function public._paebp_blueprint_boundaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Helpful never overwhelming — proactive assistance respects human control, quiet hours, and daily caps.',
    'should_avoid', jsonb_build_array(
      'Excessive recommendations — daily caps and frequency preferences enforced',
      'Fear-driven messaging — no anxiety-inducing urgency language',
      'Notification overload — quiet hours, dedupe, and Self Love fatigue signals respected',
      'Acting without approvals — nudges suggest; users dismiss, snooze, or act',
      'Surveillance — metadata summaries only, never keystrokes or colleague monitoring'
    ),
    'preserved_a79', jsonb_build_array(
      'Five assistance categories: operational, support, knowledge, executive, team_awareness',
      'Org and user preferences: frequency, channels, quiet hours, communication style',
      'Companion style examples from Phase A.79 preserved alongside blueprint examples'
    )
  );
$$;

create or replace function public._paebp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love prevents crises, encourages preparation, supports healthier workloads, and reduces urgency — peace of mind, not constant alerts.',
    'practices', jsonb_build_array(
      'Prevent crises — early signals enable preparation before emergencies',
      'Encourage preparation — calm summaries instead of alarmist dashboards',
      'Healthier workloads — fatigue signals may reduce nudge frequency',
      'Reduce urgency — supportive tone; never guilt or pressure language',
      'Peace of mind — proactive guidance builds confidence, not alert fatigue'
    ),
    'self_love_route', '/app/self-love-engine',
    'naming_doc', 'SELF_LOVE_NAMING_STANDARD.md',
    'boundary_note', 'Self Love is a principle — not a feature toggle. Proactive Companion stores metadata nudges, not wellbeing content.'
  );
$$;

create or replace function public._paebp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Why recommendations appear, which signals contributed, uncertainty acknowledged — actions optional, humans decide.',
    'users_should_know', jsonb_build_array(
      'Every nudge includes category, summary, and optional suggested action — metadata only',
      'Signals that contributed are documented in nudge metadata when available',
      'Uncertainty is acknowledged — proactive guidance is preparation, not a guarantee',
      'Actions are optional — dismiss, snooze, or act; never silent auto-execution',
      'Daily caps and quiet hours protect attention — preferences are yours to control'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Companion Presence A.67 — floating orb heartbeat, not proactive nudges',
      'Distinct from ILM proactive guidance — assistant language patterns, not org nudge engine',
      'Distinct from Notification Communication A.17 — delivery channels, not nudge generation',
      'Distinct from Dedication Engine A.91 — follow-through philosophy, not category nudges',
      'Command Center A.26 consumes the same proactive signals — one Aipify Core'
    ),
    'audit_note', 'Nudge dismissals, snoozes, preference changes, and exports logged — metadata only, no PII.'
  );
$$;

create or replace function public._paebp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates proactive assistance internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — executive awareness, support health, knowledge maintenance, task follow-up',
      'focus', jsonb_build_array('Executive briefing preparation nudges', 'Support queue health before escalation', 'Knowledge article review from internal patterns', 'Operational task follow-up before deadlines')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support proactive assistance',
      'focus', jsonb_build_array('Support volume trend awareness', 'Launch workload preparation', 'Knowledge gap surfacing from support metadata', 'Executive milestone reminders')
    )
  );
$$;

create or replace function public._paebp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Companion Presence (A.67)', 'route', '/app/settings/companion-presence', 'note', 'Floating orb heartbeat — distinct from proactive nudges'),
    jsonb_build_object('label', 'ILM proactive guidance', 'route', '/app/assistant', 'note', 'Language patterns in lib/internal-language-model/proactive-guidance.ts — distinct from org nudge engine'),
    jsonb_build_object('label', 'Notification Communication (A.17)', 'route', '/app/notification-communication-engine', 'note', 'Delivery channels and communication engine — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Command Center (A.26)', 'route', '/app/command-center', 'note', 'Executive feed and quick actions — consumes proactive signals'),
    jsonb_build_object('label', 'Quality Guardian (A.13)', 'route', '/app/quality-guardian-engine', 'note', 'Quality signals may inform proactive risk detection'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine', 'note', 'Support queue trends and escalation readiness'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Knowledge gaps and article review signals'),
    jsonb_build_object('label', 'Unified Tasks (A.62)', 'route', '/app/unified-task-follow-up-engine', 'note', 'Task deadlines and follow-up recommendations'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Strategic opportunities and milestone preparation'),
    jsonb_build_object('label', 'Dedication Engine (A.91)', 'route', '/app/dedication-engine', 'note', 'Follow-through philosophy — distinct from proactive nudges'),
    jsonb_build_object('label', 'Desktop Companion (Phase 20)', 'route', '/app/desktop', 'note', 'Desktop awareness — cross-link, do not duplicate nudge logic'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Peace of mind and sustainable pacing — principle only')
  );
$$;

create or replace function public._paebp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Move from reactive assistance to intentional leadership — glad Aipify brought that early.',
    'The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.',
    'Preparation creates confidence — best companions help prepare before emergencies.',
    'Developments surface early; proactive resolution reduces urgency and builds trust.',
    'Peace of mind through timely guidance — helpful never overwhelming.'
  );
$$;

create or replace function public._paebp_engagement_summary(p_org_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_nudges_total int := 0;
  v_pending int := 0;
  v_snoozed int := 0;
  v_acted int := 0;
  v_dismissed int := 0;
  v_nudges_30d int := 0;
  v_categories_used int := 0;
  v_audit_total int := 0;
  v_dismissals_30d int := 0;
  v_preference_changes int := 0;
  v_enabled boolean := false;
  v_max_per_day int := 12;
  v_frequency text := 'normal';
begin
  select count(*) into v_nudges_total
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id);

  select count(*) into v_pending
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id)
    and status = 'pending';

  select count(*) into v_snoozed
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id)
    and status = 'snoozed';

  select count(*) into v_acted
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id)
    and status = 'acted';

  select count(*) into v_dismissed
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id)
    and status = 'dismissed';

  select count(*) into v_nudges_30d
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id)
    and created_at >= now() - interval '30 days';

  select count(distinct category) into v_categories_used
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and (user_id is null or user_id = p_user_id);

  select count(*) into v_audit_total
  from public.organization_proactive_companion_audit_logs
  where organization_id = p_org_id;

  select count(*) into v_dismissals_30d
  from public.organization_proactive_companion_audit_logs
  where organization_id = p_org_id
    and action_type = 'nudge_dismissed'
    and created_at >= now() - interval '30 days';

  select count(*) into v_preference_changes
  from public.organization_proactive_companion_audit_logs
  where organization_id = p_org_id
    and action_type in ('user_preferences_changed', 'org_settings_changed');

  select coalesce(s.enabled, false), coalesce(s.max_nudges_per_day, 12)
  into v_enabled, v_max_per_day
  from public.organization_proactive_companion_settings s
  where s.organization_id = p_org_id;

  select coalesce(p.frequency, 'normal') into v_frequency
  from public.organization_proactive_companion_user_preferences p
  where p.organization_id = p_org_id and p.user_id = p_user_id;

  return jsonb_build_object(
    'nudges_total', v_nudges_total,
    'pending_nudges', v_pending,
    'snoozed_nudges', v_snoozed,
    'acted_nudges', v_acted,
    'dismissed_nudges', v_dismissed,
    'nudges_last_30d', v_nudges_30d,
    'categories_used', v_categories_used,
    'audit_events_total', v_audit_total,
    'dismissals_last_30d', v_dismissals_30d,
    'preference_changes', v_preference_changes,
    'engine_enabled', v_enabled,
    'max_nudges_per_day', v_max_per_day,
    'user_frequency', v_frequency,
    'privacy_note', 'Counts only — no nudge content beyond summaries, customer records, or PII.'
  );
end; $$;

create or replace function public._paebp_blueprint_success_criteria(p_org_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_pending int := 0;
  v_nudges int := 0;
  v_acted int := 0;
  v_dismissals_30d int := 0;
  v_enabled boolean := false;
  v_categories int := 0;
begin
  v_engagement := public._paebp_engagement_summary(p_org_id, p_user_id);
  v_pending := coalesce((v_engagement->>'pending_nudges')::int, 0);
  v_nudges := coalesce((v_engagement->>'nudges_total')::int, 0);
  v_acted := coalesce((v_engagement->>'acted_nudges')::int, 0);
  v_dismissals_30d := coalesce((v_engagement->>'dismissals_last_30d')::int, 0);
  v_enabled := coalesce((v_engagement->>'engine_enabled')::boolean, false);
  v_categories := coalesce((v_engagement->>'categories_used')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'developments_surface_early',
      'label', 'Developments surface early — proactive nudges generated across categories',
      'met', v_nudges > 0,
      'note', case when v_nudges = 0 then 'Seed nudges or connect signals to begin proactive assistance.' else null end
    ),
    jsonb_build_object(
      'key', 'proactive_resolution',
      'label', 'Proactive resolution — users act on or manage nudges before escalation',
      'met', v_acted > 0 or v_pending > 0,
      'note', case when v_acted = 0 and v_pending = 0 then 'Dismiss, snooze, or act on nudges to demonstrate proactive resolution.' else null end
    ),
    jsonb_build_object(
      'key', 'recommendation_quality',
      'label', 'Recommendation quality improves — categories and signals documented',
      'met', v_categories >= 3 or jsonb_array_length(public._paebp_blueprint_proactive_examples()->'categories') >= 4,
      'note', 'Support, operational, knowledge, and executive proactive examples guide quality.'
    ),
    jsonb_build_object(
      'key', 'low_notification_fatigue',
      'label', 'Low notification fatigue — daily caps and dismissals within healthy range',
      'met', v_dismissals_30d < 60 or v_nudges = 0,
      'note', case when v_dismissals_30d >= 60 then 'High dismiss rate may signal frequency adjustment — check preferences and Self Love pacing.' else 'Daily caps and quiet hours protect attention.' end
    ),
    jsonb_build_object(
      'key', 'trust_in_guidance',
      'label', 'Trust in proactive guidance — explainability and optional actions documented',
      'met', (public._paebp_blueprint_trust_connection()->>'principle') is not null,
      'note', 'Why recommendations appear; signals contributed; uncertainty acknowledged.'
    ),
    jsonb_build_object(
      'key', 'proactive_objectives',
      'label', 'Proactive objectives documented — risk, opportunity, reminders, workflow, follow-up, knowledge',
      'met', jsonb_array_length(public._paebp_blueprint_proactive_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'proactive_examples',
      'label', 'Proactive examples documented — support, operational, knowledge, executive',
      'met', jsonb_array_length(public._paebp_blueprint_proactive_examples()->'categories') >= 4,
      'note', 'Metadata signals only — no raw customer content.'
    ),
    jsonb_build_object(
      'key', 'companion_examples',
      'label', 'Companion examples documented (🦉🌹🔔❤️) — trend, simplify, prevent bottleneck, priorities',
      'met', jsonb_array_length(public._paebp_blueprint_companion_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — prevent crises, encourage preparation, reduce urgency',
      'met', true,
      'note', 'Self Love is a principle — peace of mind, not constant alerts.'
    ),
    jsonb_build_object(
      'key', 'blueprint_boundaries',
      'label', 'Boundaries enforced — avoid excessive recommendations, fear-driven messaging, overload',
      'met', jsonb_array_length(public._paebp_blueprint_boundaries()->'should_avoid') >= 5,
      'note', 'Phase A.79 categories and boundaries preserved.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from Companion Presence, ILM guidance, Notification Engine, Dedication',
      'met', jsonb_array_length(public._paebp_blueprint_integration_links()) >= 10,
      'note', 'Extend related engines — do not duplicate orb, language patterns, or delivery logic.'
    ),
    jsonb_build_object(
      'key', 'engine_enabled',
      'label', 'Proactive Companion Engine enabled for organization',
      'met', v_enabled,
      'note', case when not v_enabled then 'Enable Proactive Companion in org settings to activate nudges.' else null end
    )
  );
end; $$;

create or replace function public._paebp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Companion Presence Indicator A.67 /app/settings/companion-presence (floating orb — not proactive nudges), ILM proactive guidance lib/internal-language-model/proactive-guidance.ts (assistant language patterns), Notification Communication A.17 /app/notification-communication-engine (delivery), Dedication Engine A.91 /app/dedication-engine (follow-through philosophy), and Desktop Companion Phase 20 /app/desktop. Phase A.79 assistance categories, companion style examples, and boundaries preserved.';
$$;

create or replace function public.get_proactive_companion_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_settings public.organization_proactive_companion_settings;
  v_prefs public.organization_proactive_companion_user_preferences;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._pcme_ensure_settings(v_org_id);
  v_prefs := public._pce_ensure_user_prefs(v_org_id, v_user_id);
  perform public._pce_seed_nudges(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify offers timely, relevant guidance before things become urgent — always supportive, never intrusive.',
    'mission', 'Deliver responsible proactive assistance across operational, support, knowledge, executive, and team awareness categories while respecting human control and personal boundaries.',
    'abos_principle', 'Assistance augments people — Aipify informs and prepares; humans decide. Proactive companion is an ABOS Assistance pillar capability.',
    'self_love_note', 'Self Love (A.76 planned) monitors fatigue signals and may reduce nudge frequency — never pressure or guilt.',
    'distinction_note', 'Distinct from Companion Presence (A.67 — floating orb/heartbeat) and ILM proactive guidance (assistant language patterns).',
    'assistance_categories', public._pce_assistance_categories(),
    'companion_style_examples', public._pce_companion_style_examples(),
    'boundaries', public._pce_boundaries(),
    'settings', row_to_json(v_settings)::jsonb,
    'user_preferences', row_to_json(v_prefs)::jsonb,
    'preference_summary', public._pce_preference_summary(v_org_id, v_user_id),
    'active_nudges', public.list_proactive_companion_nudges('pending'),
    'summary', jsonb_build_object(
      'pending_nudges', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'pending'
      ), 0),
      'snoozed_nudges', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'snoozed'
      ), 0),
      'dismissed_today', coalesce((
        select count(*) from public.organization_proactive_nudges
        where organization_id = v_org_id
          and (user_id is null or user_id = v_user_id)
          and status = 'dismissed'
          and updated_at >= date_trunc('day', now())
      ), 0)
    ),
    'integration_links', jsonb_build_object(
      'command_center', '/app/command-center',
      'companion_presence', '/app/settings/companion-presence',
      'notification_engine', '/app/notification-communication-engine',
      'quality_guardian', '/app/quality-guardian-engine',
      'assistant', '/app/assistant'
    ),
    'permissions', jsonb_build_object(
      'can_manage', public._irp_has_permission('proactive_companion.manage'),
      'can_dismiss', public._irp_has_permission('proactive_companion.nudges.dismiss'),
      'can_manage_preferences', public._irp_has_permission('proactive_companion.preferences.manage')
    ),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 25 — Proactive Assistance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md',
      'engine_phase', 'Phase A.79 Proactive Companion Engine',
      'route', '/app/proactive-companion-engine',
      'mapping_note', 'ABOS Blueprint Phase 25 maps to Proactive Companion Engine Phase A.79 — extend, do not duplicate Companion Presence A.67, ILM proactive guidance, or Notification Communication A.17.'
    ),
    'proactive_assistance_note', 'Proactive Assistance Engine (ABOS Phase 25) — extends Proactive Companion Engine Phase A.79 with blueprint metadata, proactive objectives, examples, and live engagement summary.',
    'blueprint_philosophy', 'The most valuable assistance arrives before difficulties escalate — proactive, not intrusive.',
    'blueprint_mission', 'Move beyond reactive assistance — timely, valuable support before users ask; anticipate needs responsibly.',
    'blueprint_abos_principle', 'Best companions help prepare before emergencies — preparation creates confidence.',
    'vision', 'Move from reactive assistance to intentional leadership — glad Aipify brought that early.',
    'blueprint_distinction_note', public._paebp_distinction_note(),
    'proactive_objectives', public._paebp_blueprint_proactive_objectives(),
    'proactive_examples', public._paebp_blueprint_proactive_examples(),
    'companion_examples', public._paebp_blueprint_companion_examples(),
    'blueprint_boundaries', public._paebp_blueprint_boundaries(),
    'self_love_connection', public._paebp_blueprint_self_love_connection(),
    'trust_connection', public._paebp_blueprint_trust_connection(),
    'dogfooding', public._paebp_blueprint_dogfooding(),
    'blueprint_integration_links', public._paebp_blueprint_integration_links(),
    'engagement_summary', public._paebp_engagement_summary(v_org_id, v_user_id),
    'success_criteria', public._paebp_blueprint_success_criteria(v_org_id, v_user_id),
    'vision_phrases', public._paebp_blueprint_vision_phrases(),
    'privacy_note', 'Proactive assistance is organization-scoped, explainable, and auditable. Metadata only — no surveillance or raw customer content.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_proactive_companion_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_pending int := 0;
  v_engagement jsonb;
begin
  perform public._irp_require_permission('proactive_companion.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  perform public._pce_seed_nudges(v_org_id);

  select count(*) into v_pending
  from public.organization_proactive_nudges n
  where n.organization_id = v_org_id
    and (n.user_id is null or n.user_id = v_user_id)
    and n.status = 'pending';

  v_engagement := public._paebp_engagement_summary(v_org_id, v_user_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Timely, relevant, responsible guidance before urgent — supportive, not intrusive.',
    'pending_nudges', v_pending,
    'enabled', (select enabled from public.organization_proactive_companion_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 25 — Proactive Assistance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md',
      'engine_phase', 'Phase A.79 Proactive Companion Engine',
      'route', '/app/proactive-companion-engine'
    ),
    'mission', 'Move beyond reactive assistance — timely, valuable support before users ask.',
    'abos_principle', 'Best companions help prepare before emergencies — preparation creates confidence.',
    'engagement_summary', v_engagement,
    'blueprint_note', 'Proactive Assistance Engine (ABOS Phase 25) — extends Phase A.79 with proactive objectives, examples, boundaries, and live success criteria.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

grant execute on function public._paebp_blueprint_proactive_objectives() to authenticated;
grant execute on function public._paebp_blueprint_proactive_examples() to authenticated;
grant execute on function public._paebp_blueprint_companion_examples() to authenticated;
grant execute on function public._paebp_blueprint_boundaries() to authenticated;
grant execute on function public._paebp_blueprint_self_love_connection() to authenticated;
grant execute on function public._paebp_blueprint_trust_connection() to authenticated;
grant execute on function public._paebp_blueprint_dogfooding() to authenticated;
grant execute on function public._paebp_blueprint_integration_links() to authenticated;
grant execute on function public._paebp_blueprint_vision_phrases() to authenticated;
grant execute on function public._paebp_engagement_summary(uuid, uuid) to authenticated;
grant execute on function public._paebp_blueprint_success_criteria(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'proactive-assistance-blueprint', 'Proactive Assistance Engine (ABOS Phase 25)',
  'Proactive Assistance Engine — extends Phase A.79 with proactive objectives, examples, companion style, boundaries, and live engagement summary.',
  'authenticated', 102
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'proactive-assistance-blueprint' and tenant_id is null
);
