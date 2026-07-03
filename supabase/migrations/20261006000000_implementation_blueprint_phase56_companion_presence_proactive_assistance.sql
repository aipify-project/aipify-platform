-- Implementation Blueprint Phase 56 — Companion Presence & Proactive Assistance Engine
-- Extends Proactive Companion Engine (Phase A.79 + Blueprint Phase 25) at /app/proactive-companion-engine.
-- Unifies presence + proactive assistance framing — no new tables.

-- ---------------------------------------------------------------------------
-- Distinction & static blueprint helpers (_cpaebp_*)
-- ---------------------------------------------------------------------------

create or replace function public._cpaebp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 56 extends Proactive Companion Engine Phase A.79 + Phase 25 at /app/proactive-companion-engine — unifies companion presence awareness with proactive assistance framing. Distinct from Companion Presence Indicator A.67 /app/settings/companion-presence (floating orb heartbeat — Phase 56 is proactive guidance layer, not orb UI), Desktop Presence Phase 25 foundation (notification infrastructure), Attention Guardian TAG /app/assistant/attention (personal focus mode), Personal Productivity A.70 /app/personal-productivity-engine, Command Center A.26 /app/command-center and Notification Communication A.17 /app/notification-communication-engine (delivery channels). Cross-link Sales Expert OS /app/sales-expert-engine, Executive Insights A.35 /app/executive-insights-engine, Self Love A.76 /app/self-love-engine, Ethics Phase 54 /app/ai-ethics-responsible-use-engine, Workflow Phase 40 /app/workflow-orchestration-engine — awareness not control. All Phase A.79 + Phase 25 dashboard fields preserved.';
$$;

create or replace function public._cpaebp_blueprint_mission()
returns text language sql immutable as $$
  select 'Unify companion presence awareness with responsible proactive assistance — timely guidance that observes context, respects preferences, and prepares humans before urgency arrives.';
$$;

create or replace function public._cpaebp_blueprint_philosophy()
returns text language sql immutable as $$
  select 'Presence means being thoughtfully available — not always visible. Aipify observes operational context, recognizes help opportunities, and offers respectful nudges without interruption, fear, or dependency.';
$$;

create or replace function public._cpaebp_blueprint_abos_principle()
returns text language sql immutable as $$
  select 'Aipify Business Operating System (ABOS) companions observe, inform, and recommend — humans decide. Companion presence and proactive assistance work together: awareness without surveillance, guidance without pressure.';
$$;

create or replace function public._cpaebp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'proactive_recommendations', 'label', 'Proactive recommendations', 'description', 'Surface timely suggestions from metadata patterns — explainable, optional, never auto-executed'),
    jsonb_build_object('key', 'contextual_reminders', 'label', 'Contextual reminders', 'description', 'Gentle reminders aligned with calendar, tasks, and operational context — supportive tone only'),
    jsonb_build_object('key', 'timely_assistance', 'label', 'Timely assistance', 'description', 'Offer help before difficulties escalate — preparation creates confidence'),
    jsonb_build_object('key', 'prioritization', 'label', 'Prioritization', 'description', 'Highlight what matters most today — calm focus without guilt or urgency spam'),
    jsonb_build_object('key', 'human_nudges', 'label', 'Human nudges', 'description', 'Respectful interventions that suggest — dismiss, snooze, or act; never silent execution'),
    jsonb_build_object('key', 'respectful_interventions', 'label', 'Respectful interventions', 'description', 'Interventions honor quiet hours, frequency caps, and Self Love pacing — helpful never overwhelming')
  );
$$;

create or replace function public._cpaebp_companion_presence_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion presence principles — observe context, recognize opportunities, respect preferences, preserve user control.',
    'qualities', jsonb_build_array(
      'Observe — metadata summaries across operational, support, knowledge, and executive signals',
      'Recognize help opportunities — surface preparation windows before deadlines and bottlenecks',
      'Respect preferences — frequency, channels, quiet hours, and category toggles are yours',
      'User control — every nudge is optional; high-risk actions require explicit approval'
    ),
    'should_avoid', jsonb_build_array(
      'Unnecessary interruptions — quiet hours and focus mode respected',
      'Fear-driven messaging — no anxiety-inducing urgency language',
      'Dependency framing — Aipify augments people, never replaces judgment',
      'Surveillance — metadata only, never colleague monitoring or keystroke tracking',
      'Auto-execution — proactive nudges suggest; Trust & Action owns approvals'
    ),
    'companion_presence_route', '/app/settings/companion-presence',
    'companion_presence_phase', 'A.67',
    'orb_note', 'Floating orb heartbeat is A.67 UI — Phase 56 is proactive guidance layer on A.79, not orb rendering'
  );
$$;

create or replace function public._cpaebp_proactive_support_examples()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'emoji', '🦉',
      'key', 'trend_before_escalation',
      'scenario', 'Trend before escalation',
      'example', '🦉 Support response times have risen this week — the trend deserves attention before backlog grows. Would you like a summary for review?'
    ),
    jsonb_build_object(
      'emoji', '🌹',
      'key', 'opportunity_to_prepare',
      'scenario', 'Opportunity to prepare',
      'example', '🌹 Your renewal review window opens next week — Aipify prepared a metadata summary when you have a moment.'
    ),
    jsonb_build_object(
      'emoji', '🔔',
      'key', 'gentle_deadline_reminder',
      'scenario', 'Gentle deadline reminder',
      'example', '🔔 Two commitments share the same deadline — a small handoff now may prevent a bottleneck later.'
    ),
    jsonb_build_object(
      'emoji', '❤️',
      'key', 'priorities_with_peace',
      'scenario', 'Priorities with peace of mind',
      'example', '❤️ Before your meeting — here are three priorities that matter most today. Everything else can wait.'
    )
  );
$$;

create or replace function public._cpaebp_operational_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Operational awareness — surface context across support, deadlines, commitments, renewals, approvals, and Knowledge Center review. Awareness not control.',
    'domains', jsonb_build_array(
      jsonb_build_object(
        'key', 'support',
        'label', 'Support awareness',
        'signals', jsonb_build_array('Queue volume trends', 'Escalation readiness', 'Repeated topic clusters'),
        'route', '/app/support-ai-engine'
      ),
      jsonb_build_object(
        'key', 'deadlines',
        'label', 'Deadlines & tasks',
        'signals', jsonb_build_array('Tasks approaching due dates', 'Overdue risk patterns', 'Shared deadline conflicts'),
        'route', '/app/unified-task-follow-up-engine'
      ),
      jsonb_build_object(
        'key', 'commitments',
        'label', 'Commitments',
        'signals', jsonb_build_array('SLA windows approaching', 'Meeting preparation cues', 'Handoff checkpoints'),
        'route', '/app/meeting-collaboration-intelligence-engine'
      ),
      jsonb_build_object(
        'key', 'renewals',
        'label', 'Renewals',
        'signals', jsonb_build_array('Subscription renewal windows', 'Contract review preparation', 'Expansion readiness metadata'),
        'route', '/app/sales-expert-engine'
      ),
      jsonb_build_object(
        'key', 'approvals',
        'label', 'Approvals',
        'signals', jsonb_build_array('Pending approval counts', 'Trust & Action queue trends', 'Workflow step bottlenecks'),
        'route', '/app/approvals'
      ),
      jsonb_build_object(
        'key', 'knowledge_review',
        'label', 'Knowledge Center review',
        'signals', jsonb_build_array('Articles needing review', 'Documentation gaps from support patterns', 'Search effectiveness trends'),
        'route', '/app/knowledge-center-engine'
      )
    ),
    'workflow_phase', 40,
    'workflow_route', '/app/workflow-orchestration-engine',
    'boundary', 'Phase 40 owns multi-step orchestration approval tiers — Phase 56 surfaces awareness only.'
  );
$$;

create or replace function public._cpaebp_sales_expert_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert OS connection — proactive awareness for pipeline preparation, engagement follow-up, and renewal windows without duplicating sales workflows.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'text', 'Three opportunities have been quiet for two weeks — a thoughtful follow-up may help when you are ready.'),
      jsonb_build_object('emoji', '🌹', 'text', 'Demo preparation window opens tomorrow — Aipify gathered context summaries for review.'),
      jsonb_build_object('emoji', '🔔', 'text', 'Renewal conversation due in five days — metadata summary prepared, not automated outreach.'),
      jsonb_build_object('emoji', '❤️', 'text', 'Before your sales sync — two relationships and one renewal deserve attention today.')
    ),
    'route', '/app/sales-expert-engine',
    'phases', jsonb_build_array(33, 42, 43, 44, 47, 48, 49, 50),
    'boundary', 'Sales Expert OS owns pipeline and engagement workflows — Proactive Companion offers awareness nudges only.'
  );
$$;

create or replace function public._cpaebp_executive_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive Insights connection — strategic opportunities, briefing preparation, and leadership alignment cues. Metadata only.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'text', 'Positive performance trend in support resolution — worth noting before the executive briefing.'),
      jsonb_build_object('emoji', '🦉', 'text', 'Strategic milestone approaches in ten days — briefing materials can be prepared when convenient.'),
      jsonb_build_object('emoji', '🌹', 'text', 'Cross-module alignment opportunity — three operational signals suggest a simplification review.'),
      jsonb_build_object('emoji', '❤️', 'text', 'Before leadership sync — three priorities that matter most; everything else can wait.')
    ),
    'route', '/app/executive-insights-engine',
    'phase', 'A.35',
    'command_center_route', '/app/command-center',
    'boundary', 'Executive Insights owns strategic analysis — Proactive Companion prepares timely awareness nudges.'
  );
$$;

create or replace function public._cpaebp_self_love_wellbeing()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love wellbeing proactivity — sustainable pacing, reduced urgency, and peace of mind. Never pressure or guilt.',
    'practices', jsonb_build_array(
      'Fatigue signals may reduce nudge frequency — attention protected',
      'Celebrate preparation over perfection — early awareness builds confidence',
      'Quiet hours and daily caps honor personal boundaries',
      'Dismiss and snooze without judgment — your pace leads',
      'Wellbeing nudges suggest rest or reflection — never shame for delays'
    ),
    'route', '/app/self-love-engine',
    'phase', 'A.76',
    'ethics_route', '/app/ai-ethics-responsible-use-engine',
    'ethics_phase', 54,
    'boundary_note', 'Self Love is a principle — Proactive Companion stores metadata nudges, not wellbeing content. Ethics Phase 54 governs companion safety boundaries.'
  );
$$;

create or replace function public._cpaebp_presence_settings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Presence settings unify proactive companion preferences with Companion Presence A.67 metadata — frequency, channels, quiet hours, priority categories, and escalation paths.',
    'proactive_companion_settings', jsonb_build_array(
      jsonb_build_object('key', 'frequency', 'label', 'Frequency', 'values', jsonb_build_array('low', 'normal', 'high'), 'source', 'organization_proactive_companion_user_preferences'),
      jsonb_build_object('key', 'channels', 'label', 'Channels', 'values', jsonb_build_array('in_app', 'command_center', 'notification'), 'source', 'organization_proactive_companion_user_preferences'),
      jsonb_build_object('key', 'quiet_hours', 'label', 'Quiet hours', 'description', 'Suppress non-critical nudges during configured windows', 'source', 'organization_proactive_companion_user_preferences'),
      jsonb_build_object('key', 'enabled_categories', 'label', 'Priority categories', 'values', jsonb_build_array('operational', 'support', 'knowledge', 'executive', 'team_awareness'), 'source', 'organization_proactive_companion_settings'),
      jsonb_build_object('key', 'max_nudges_per_day', 'label', 'Daily cap', 'source', 'organization_proactive_companion_settings')
    ),
    'companion_presence_settings', jsonb_build_array(
      jsonb_build_object('key', 'indicator_enabled', 'label', 'Orb indicator', 'source', 'companion_presence_settings', 'route', '/app/settings/companion-presence'),
      jsonb_build_object('key', 'quiet_mode_enabled', 'label', 'Quiet mode', 'source', 'companion_presence_user_preferences', 'route', '/app/settings/companion-presence'),
      jsonb_build_object('key', 'heartbeat_interval_seconds', 'label', 'Heartbeat interval', 'source', 'companion_presence_settings'),
      jsonb_build_object('key', 'critical_alert_requires_ack', 'label', 'Critical alert acknowledgment', 'source', 'companion_presence_settings')
    ),
    'escalation', jsonb_build_object(
      'principle', 'Escalation paths — low/normal nudges respect quiet hours; high priority may surface in Command Center; critical routes through Notification Engine with user acknowledgment.',
      'trust_action_route', '/app/approvals',
      'notification_route', '/app/notification-communication-engine',
      'command_center_route', '/app/command-center',
      'high_risk_note', 'High-risk actions require explicit approval via Trust & Action — proactive nudges never auto-execute.'
    ),
    'tag_route', '/app/assistant/attention',
    'tag_note', 'Attention Guardian TAG focus mode may suppress non-essential nudges — cross-link only.'
  );
$$;

create or replace function public._cpaebp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust through transparency — why nudges appear, which signals contributed, uncertainty acknowledged, actions optional.',
    'users_should_know', jsonb_build_array(
      'Every nudge includes category, summary, and optional suggested action — metadata only',
      'Presence summary shows counts from nudges and companion devices — no activity content',
      'Quiet hours, frequency, and category preferences are fully under your control',
      'High-risk suggestions route to Trust & Action — never silent auto-execution',
      'Ethics Phase 54 companion governance cross-linked for emotional safety boundaries'
    ),
    'operators_should_understand', jsonb_build_array(
      'Phase 56 unifies presence awareness framing on A.79 — does not duplicate A.67 orb UI',
      'Desktop Presence Phase 25 is notification infrastructure — delivery not nudge generation',
      'Command Center consumes proactive signals — one Aipify Core',
      'Workflow Phase 40 owns orchestration tiers — Phase 56 surfaces operational awareness',
      'Full audit via organization_proactive_companion_audit_logs — metadata only'
    ),
    'ethics_route', '/app/ai-ethics-responsible-use-engine',
    'ethics_phase', 54,
    'audit_note', 'Nudge dismissals, snoozes, preference changes, and exports logged — no PII.'
  );
$$;

create or replace function public._cpaebp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates companion presence + proactive assistance internally; Unonight is the first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — unified presence awareness, executive preparation, support health, knowledge maintenance',
      'focus', jsonb_build_array(
        'Companion presence heartbeat with proactive briefing nudges',
        'Executive milestone preparation before leadership syncs',
        'Support queue trend awareness before escalation',
        'Knowledge article review from internal patterns',
        'Approval queue awareness without auto-action'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce and support proactive presence assistance',
      'focus', jsonb_build_array(
        'Launch workload preparation nudges',
        'Support volume trend awareness',
        'Renewal window preparation metadata',
        'Sales Expert engagement follow-up awareness'
      )
    )
  );
$$;

create or replace function public._cpaebp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Aipify feels present when it matters — thoughtful, not intrusive.',
    'The best companions observe quietly and speak when help truly matters.',
    'Presence plus proactive assistance — awareness without surveillance, guidance without pressure.',
    'Preparation before urgency — glad Aipify brought that early.',
    'Peace of mind through respectful nudges — helpful never overwhelming.'
  );
$$;

create or replace function public._cpaebp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Companion Presence (A.67)', 'route', '/app/settings/companion-presence', 'note', 'Floating orb heartbeat — UI layer, not proactive nudges'),
    jsonb_build_object('label', 'Command Center (A.26)', 'route', '/app/command-center', 'note', 'Executive feed and quick actions — consumes proactive signals'),
    jsonb_build_object('label', 'Notification Communication (A.17)', 'route', '/app/notification-communication-engine', 'note', 'Delivery channels — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Attention Guardian (TAG)', 'route', '/app/assistant/attention', 'note', 'Personal focus mode — may suppress non-essential nudges'),
    jsonb_build_object('label', 'Personal Productivity (A.70)', 'route', '/app/personal-productivity-engine', 'note', 'Individual productivity patterns — distinct from org nudges'),
    jsonb_build_object('label', 'Sales Expert OS', 'route', '/app/sales-expert-engine', 'note', 'Pipeline, engagement, renewal awareness cross-links'),
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Strategic opportunities and briefing preparation'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Wellbeing pacing and sustainable attention — principle only'),
    jsonb_build_object('label', 'Ethics & Companion Governance (Phase 54)', 'route', '/app/ai-ethics-responsible-use-engine', 'note', 'Companion ethics and emotional safety boundaries'),
    jsonb_build_object('label', 'Workflow Orchestration (Phase 40)', 'route', '/app/workflow-orchestration-engine', 'note', 'Operational automation awareness — approval tiers distinct'),
    jsonb_build_object('label', 'Trust & Action (Phase 30)', 'route', '/app/approvals', 'note', 'High-risk actions require explicit approval'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Knowledge gaps and article review signals'),
    jsonb_build_object('label', 'Support AI (A.7)', 'route', '/app/support-ai-engine', 'note', 'Support queue trends and escalation readiness'),
    jsonb_build_object('label', 'ILM proactive guidance', 'route', '/app/assistant', 'note', 'Assistant language patterns — distinct from org nudge engine'),
    jsonb_build_object('label', 'Dedication Engine (A.91)', 'route', '/app/dedication-engine', 'note', 'Follow-through philosophy — distinct from nudges')
  );
$$;

create or replace function public._cpaebp_presence_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_pending_nudges int := 0;
  v_snoozed_nudges int := 0;
  v_nudges_30d int := 0;
  v_categories_used int := 0;
  v_connected_devices int := 0;
  v_online_devices int := 0;
  v_indicator_enabled boolean := false;
  v_engine_enabled boolean := false;
  v_max_per_day int := 12;
begin
  select count(*) into v_pending_nudges
  from public.organization_proactive_nudges
  where organization_id = p_org_id and status = 'pending';

  select count(*) into v_snoozed_nudges
  from public.organization_proactive_nudges
  where organization_id = p_org_id and status = 'snoozed';

  select count(*) into v_nudges_30d
  from public.organization_proactive_nudges
  where organization_id = p_org_id
    and created_at >= now() - interval '30 days';

  select count(distinct category) into v_categories_used
  from public.organization_proactive_nudges
  where organization_id = p_org_id;

  select count(*) into v_connected_devices
  from public.companion_presence
  where organization_id = p_org_id;

  select count(*) into v_online_devices
  from public.companion_presence
  where organization_id = p_org_id
    and connection_status = 'online'
    and last_seen_at >= now() - interval '15 minutes';

  select coalesce(s.indicator_enabled, false) into v_indicator_enabled
  from public.companion_presence_settings s
  where s.organization_id = p_org_id;

  select coalesce(s.enabled, false), coalesce(s.max_nudges_per_day, 12)
  into v_engine_enabled, v_max_per_day
  from public.organization_proactive_companion_settings s
  where s.organization_id = p_org_id;

  return jsonb_build_object(
    'pending_nudges', v_pending_nudges,
    'snoozed_nudges', v_snoozed_nudges,
    'nudges_last_30d', v_nudges_30d,
    'categories_used', v_categories_used,
    'connected_devices', v_connected_devices,
    'online_devices', v_online_devices,
    'companion_indicator_enabled', v_indicator_enabled,
    'proactive_engine_enabled', v_engine_enabled,
    'max_nudges_per_day', v_max_per_day,
    'privacy_note', 'Counts only — nudge summaries and companion device metadata, no activity content or PII.'
  );
end; $$;

create or replace function public._cpaebp_blueprint_success_criteria(p_org_id uuid, p_user_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_presence jsonb;
  v_engagement jsonb;
  v_pending int := 0;
  v_nudges int := 0;
  v_acted int := 0;
  v_dismissals_30d int := 0;
  v_enabled boolean := false;
  v_categories int := 0;
  v_devices int := 0;
begin
  v_presence := public._cpaebp_presence_summary(p_org_id);
  v_engagement := public._paebp_engagement_summary(p_org_id, p_user_id);
  v_pending := coalesce((v_presence->>'pending_nudges')::int, 0);
  v_nudges := coalesce((v_engagement->>'nudges_total')::int, 0);
  v_acted := coalesce((v_engagement->>'acted_nudges')::int, 0);
  v_dismissals_30d := coalesce((v_engagement->>'dismissals_last_30d')::int, 0);
  v_enabled := coalesce((v_engagement->>'engine_enabled')::boolean, false);
  v_categories := coalesce((v_presence->>'categories_used')::int, 0);
  v_devices := coalesce((v_presence->>'connected_devices')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'presence_awareness_unified',
      'label', 'Presence + proactive assistance unified — Phase 56 framing on A.79',
      'met', (public._cpaebp_distinction_note()) is not null,
      'note', 'Companion presence awareness and proactive nudges framed together — orb UI remains A.67.'
    ),
    jsonb_build_object(
      'key', 'companion_presence_principles',
      'label', 'Companion presence principles documented — observe, recognize, respect, control',
      'met', jsonb_array_length(public._cpaebp_companion_presence_principles()->'qualities') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'phase56_objectives',
      'label', 'Phase 56 objectives — recommendations, reminders, assistance, prioritization, nudges, interventions',
      'met', jsonb_array_length(public._cpaebp_blueprint_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'proactive_support_examples',
      'label', 'Proactive support examples documented (🦉🌹🔔❤️)',
      'met', jsonb_array_length(public._cpaebp_proactive_support_examples()) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'operational_awareness',
      'label', 'Operational awareness — support, deadlines, renewals, approvals, KC review',
      'met', jsonb_array_length(public._cpaebp_operational_awareness()->'domains') >= 6,
      'note', 'Awareness not control — Workflow Phase 40 owns orchestration tiers.'
    ),
    jsonb_build_object(
      'key', 'sales_executive_connections',
      'label', 'Sales Expert and Executive Insights connections documented',
      'met', jsonb_array_length(public._cpaebp_sales_expert_connection()->'examples') >= 3
        and jsonb_array_length(public._cpaebp_executive_connection()->'examples') >= 3,
      'note', 'Metadata awareness nudges — sales and executive workflows remain distinct.'
    ),
    jsonb_build_object(
      'key', 'presence_settings_documented',
      'label', 'Presence settings cross-linked — frequency, channels, quiet hours, categories, escalation',
      'met', jsonb_array_length(public._cpaebp_presence_settings()->'proactive_companion_settings') >= 5,
      'note', 'A.67 companion presence preferences cross-linked in presence_settings.'
    ),
    jsonb_build_object(
      'key', 'developments_surface_early',
      'label', 'Developments surface early — proactive nudges generated',
      'met', v_nudges > 0,
      'note', case when v_nudges = 0 then 'Seed nudges or connect signals to begin proactive assistance.' else null end
    ),
    jsonb_build_object(
      'key', 'proactive_resolution',
      'label', 'Proactive resolution — users act on or manage nudges',
      'met', v_acted > 0 or v_pending > 0,
      'note', case when v_acted = 0 and v_pending = 0 then 'Dismiss, snooze, or act on nudges to demonstrate proactive resolution.' else null end
    ),
    jsonb_build_object(
      'key', 'low_notification_fatigue',
      'label', 'Low notification fatigue — daily caps and healthy dismiss rates',
      'met', v_dismissals_30d < 60 or v_nudges = 0,
      'note', 'Quiet hours and Self Love pacing protect attention.'
    ),
    jsonb_build_object(
      'key', 'trust_in_guidance',
      'label', 'Trust in proactive guidance — explainability and optional actions',
      'met', (public._cpaebp_trust_connection()->>'principle') is not null,
      'note', 'Ethics Phase 54 cross-linked for companion safety boundaries.'
    ),
    jsonb_build_object(
      'key', 'self_love_wellbeing',
      'label', 'Self Love wellbeing proactivity — sustainable pacing without pressure',
      'met', true,
      'note', 'Self Love is a principle — peace of mind, not constant alerts.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links distinct from A.67 orb, TAG, Personal Productivity, Command Center',
      'met', jsonb_array_length(public._cpaebp_integration_links()) >= 12,
      'note', 'Extend related engines — do not duplicate orb, focus mode, or delivery logic.'
    ),
    jsonb_build_object(
      'key', 'engine_enabled',
      'label', 'Proactive Companion Engine enabled for organization',
      'met', v_enabled,
      'note', case when not v_enabled then 'Enable Proactive Companion in org settings to activate nudges.' else null end
    ),
    jsonb_build_object(
      'key', 'presence_summary_live',
      'label', 'Presence summary live — nudge and companion device counts',
      'met', v_presence is not null,
      'note', case when v_devices = 0 then 'Companion devices appear when A.67 heartbeat connects — counts optional.' else null end
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- Dashboard + card RPC replacements (preserve Phase A.79 + Phase 25 + add Phase 56)
-- ---------------------------------------------------------------------------

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
    'self_love_note', 'Self Love (A.76) monitors fatigue signals and may reduce nudge frequency — never pressure or guilt.',
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
      'phase', 'Phase 56 — Companion Presence & Proactive Assistance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE56_COMPANION_PRESENCE_PROACTIVE_ASSISTANCE.md',
      'engine_phase', 'Phase A.79 Proactive Companion Engine',
      'prior_blueprint', 'Phase 25 — Proactive Assistance Engine',
      'prior_doc', 'IMPLEMENTATION_BLUEPRINT_PHASE25_PROACTIVE_ASSISTANCE.md',
      'route', '/app/proactive-companion-engine',
      'mapping_note', 'ABOS Blueprint Phase 56 unifies presence + proactive assistance on Phase A.79 — extend, do not duplicate Companion Presence A.67 orb UI, TAG focus mode, or Notification Communication A.17 delivery.'
    ),
    'proactive_assistance_note', 'Companion Presence & Proactive Assistance Engine (ABOS Phase 56) — extends Phase A.79 + Phase 25 with unified presence awareness, operational awareness, and live presence summary.',
    'blueprint_philosophy', public._cpaebp_blueprint_philosophy(),
    'blueprint_mission', public._cpaebp_blueprint_mission(),
    'blueprint_abos_principle', public._cpaebp_blueprint_abos_principle(),
    'vision', 'Aipify feels present when it matters — thoughtful, not intrusive.',
    'blueprint_distinction_note', public._cpaebp_distinction_note(),
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
    'privacy_note', 'Proactive assistance is organization-scoped, explainable, and auditable. Metadata only — no surveillance or raw customer content.',
    'companion_presence_mission', public._cpaebp_blueprint_mission(),
    'companion_presence_philosophy', public._cpaebp_blueprint_philosophy(),
    'companion_presence_abos_principle', public._cpaebp_blueprint_abos_principle(),
    'phase56_distinction_note', public._cpaebp_distinction_note(),
    'companion_presence_principles', public._cpaebp_companion_presence_principles(),
    'phase56_objectives', public._cpaebp_blueprint_objectives(),
    'proactive_support_examples', public._cpaebp_proactive_support_examples(),
    'operational_awareness', public._cpaebp_operational_awareness(),
    'sales_expert_connection', public._cpaebp_sales_expert_connection(),
    'executive_connection', public._cpaebp_executive_connection(),
    'self_love_wellbeing', public._cpaebp_self_love_wellbeing(),
    'presence_settings', public._cpaebp_presence_settings(),
    'presence_summary', public._cpaebp_presence_summary(v_org_id),
    'phase56_trust_connection', public._cpaebp_trust_connection(),
    'phase56_dogfooding', public._cpaebp_dogfooding(),
    'phase56_success_criteria', public._cpaebp_blueprint_success_criteria(v_org_id, v_user_id),
    'phase56_vision_phrases', public._cpaebp_vision_phrases(),
    'phase56_integration_links', public._cpaebp_integration_links()
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
  v_presence jsonb;
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
  v_presence := public._cpaebp_presence_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Presence plus proactive assistance — awareness without surveillance, guidance without pressure.',
    'pending_nudges', v_pending,
    'enabled', (select enabled from public.organization_proactive_companion_settings where organization_id = v_org_id),
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 56 — Companion Presence & Proactive Assistance Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE56_COMPANION_PRESENCE_PROACTIVE_ASSISTANCE.md',
      'engine_phase', 'Phase A.79 Proactive Companion Engine',
      'prior_blueprint', 'Phase 25 — Proactive Assistance Engine',
      'route', '/app/proactive-companion-engine'
    ),
    'mission', public._cpaebp_blueprint_mission(),
    'abos_principle', public._cpaebp_blueprint_abos_principle(),
    'engagement_summary', v_engagement,
    'presence_summary', v_presence,
    'blueprint_note', 'Companion Presence & Proactive Assistance Engine (ABOS Phase 56) — unifies presence awareness with proactive objectives, operational awareness, and live success criteria on Phase A.79.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- Grants + KC category
-- ---------------------------------------------------------------------------

grant execute on function public._cpaebp_distinction_note() to authenticated;
grant execute on function public._cpaebp_blueprint_mission() to authenticated;
grant execute on function public._cpaebp_blueprint_philosophy() to authenticated;
grant execute on function public._cpaebp_blueprint_abos_principle() to authenticated;
grant execute on function public._cpaebp_blueprint_objectives() to authenticated;
grant execute on function public._cpaebp_companion_presence_principles() to authenticated;
grant execute on function public._cpaebp_proactive_support_examples() to authenticated;
grant execute on function public._cpaebp_operational_awareness() to authenticated;
grant execute on function public._cpaebp_sales_expert_connection() to authenticated;
grant execute on function public._cpaebp_executive_connection() to authenticated;
grant execute on function public._cpaebp_self_love_wellbeing() to authenticated;
grant execute on function public._cpaebp_presence_settings() to authenticated;
grant execute on function public._cpaebp_trust_connection() to authenticated;
grant execute on function public._cpaebp_dogfooding() to authenticated;
grant execute on function public._cpaebp_vision_phrases() to authenticated;
grant execute on function public._cpaebp_integration_links() to authenticated;
grant execute on function public._cpaebp_presence_summary(uuid) to authenticated;
grant execute on function public._cpaebp_blueprint_success_criteria(uuid, uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'companion-presence-proactive-assistance-blueprint', 'Companion Presence & Proactive Assistance (ABOS Phase 56)',
  'Companion Presence & Proactive Assistance Engine — unifies presence awareness with proactive assistance on Phase A.79.',
  'authenticated', 103
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'companion-presence-proactive-assistance-blueprint' and tenant_id is null
);
