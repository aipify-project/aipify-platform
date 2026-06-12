-- Implementation Blueprint Phase 75 — Executive Operations Center Engine
-- Extends Operations Center Foundation Engine Phase A.32 (Phase 18 + Phase 70 layered). No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._eocbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 75 — Executive Operations Center Engine at /app/operations-center-foundation-engine. Extends Operations Center Foundation Engine Phase A.32 (Phase 18 via _ocf_* and Phase 70 via _cfibp_* — layered, do NOT remove Phase 70 fields). Distinct from App Ecosystem & Developer Platform repo Phase 75 at /app/apps and /developers. Distinct from Executive Insights A.35 at /app/executive-insights-engine (cross-link for executive summaries and daily briefings). Distinct from Command Center Phase 26 at /app/command-center (presence/notifications). Distinct from Operations Dashboard A.9 at /app/operations-dashboard-engine. Distinct from AOC Phase 79 at /app/operations (autonomous operations). Distinct from Cross-Functional Intelligence Blueprint Phase 70 on same engine — Phase 75 adds executive leadership lens. Distinct from Briefing System at /app/briefing. Distinct from Organizational Health Blueprint Phase 61 at /app/organizational-health-engine (cross-link for health overview). Distinct from Meeting Intelligence A.61 at /app/meeting-collaboration-intelligence-engine (cross-link for meeting continuity). Engine helpers use _ocf_* (Phase 18) and _cfibp_* (Phase 70) — blueprint Phase 75 MUST use _eocbp_* only.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._eocbp_mission()
returns text language sql immutable as $$
  select 'Help leaders gain situational awareness, maintain focus on strategic priorities, and guide organizations through complexity with confidence.';
$$;

create or replace function public._eocbp_philosophy()
returns text language sql immutable as $$
  select 'Leadership requires perspective; perspective emerges through clarity. Purpose is NOT to overwhelm — help leaders focus where attention creates greatest value.';
$$;

create or replace function public._eocbp_abos_principle()
returns text language sql immutable as $$
  select 'Leadership objective is not managing every detail — create conditions for people and organizations to flourish; perspective enables stewardship. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._eocbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'strategic_visibility', 'label', 'Strategic visibility', 'description', 'Unified view of strategic initiatives and milestone progress — metadata summaries only'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness', 'description', 'Cross-module operational risks, urgent events, and pending approvals at leadership altitude'),
    jsonb_build_object('key', 'executive_prioritization', 'label', 'Executive prioritization', 'description', 'Top priorities, leadership commitments, and decisions awaiting review — intentional focus'),
    jsonb_build_object('key', 'organizational_health_insights', 'label', 'Organizational health insights', 'description', 'Collaboration observations, recognition trends, workload signals — cross-link Org Health Phase 61'),
    jsonb_build_object('key', 'decision_preparation', 'label', 'Decision preparation', 'description', 'Meeting continuity, open action items, and historical decision context — humans decide'),
    jsonb_build_object('key', 'cross_functional_understanding', 'label', 'Cross-functional understanding', 'description', 'Executive lens on Phase 70 connection visibility — dependencies without overwhelm')
  );
$$;

create or replace function public._eocbp_executive_dashboard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive dashboard — unified leadership view for clarity, not overwhelm.',
    'clarity_objective', 'Leaders see what truly matters — strategic initiatives, health signals, risks, and follow-ups in one calm overview.',
    'dimensions', jsonb_build_array(
      jsonb_build_object('key', 'strategic_initiatives', 'label', 'Strategic initiatives', 'description', 'Initiative progress and goal advancement — cross-link Goals OKR A.65'),
      jsonb_build_object('key', 'organizational_health', 'label', 'Organizational health', 'description', 'Collaboration and workload indicators — cross-link Org Health Phase 61'),
      jsonb_build_object('key', 'operational_risks', 'label', 'Operational risks', 'description', 'Urgent operations_events and escalations — metadata counts only'),
      jsonb_build_object('key', 'meeting_follow_ups', 'label', 'Meeting follow-ups', 'description', 'Open action items and meeting summaries — cross-link Meeting A.61'),
      jsonb_build_object('key', 'executive_priorities', 'label', 'Executive priorities', 'description', 'Top leadership focus areas and upcoming commitments'),
      jsonb_build_object('key', 'recognition_opportunities', 'label', 'Recognition opportunities', 'description', 'Positive momentum and moments worth acknowledging — 🌹'),
      jsonb_build_object('key', 'emerging_trends', 'label', 'Emerging trends', 'description', 'Strategic signals — cross-link Predictive Insights A.66 and Executive Insights A.35'),
      jsonb_build_object('key', 'critical_alerts', 'label', 'Critical alerts', 'description', 'High-priority operations_events requiring leadership awareness — not auto-action')
    ),
    'metadata_note', 'Unified view aggregates module overviews and operations_events — no email, chat, order content, or PII.'
  );
$$;

create or replace function public._eocbp_daily_executive_briefings()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Daily executive briefings — begin the day with perspective, not pressure.',
    'briefing_elements', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'positive_momentum', 'element', 'Positive momentum', 'description', 'Recognition moments, resolved cases, and accomplishments worth noting'),
      jsonb_build_object('emoji', '🦉', 'key', 'cross_functional_dependencies', 'element', 'Cross-functional dependencies', 'description', 'Handoffs and dependencies across modules — awareness from Phase 70 lens'),
      jsonb_build_object('emoji', '🔔', 'key', 'unresolved_commitments', 'element', 'Unresolved commitments', 'description', 'Open approvals, overdue tasks, and pending decisions awaiting review'),
      jsonb_build_object('emoji', '❤️', 'key', 'recognition_opportunities', 'element', 'Recognition opportunities', 'description', 'Teams and individuals whose contributions merit leadership acknowledgment')
    ),
    'cross_link_note', 'Detailed briefings live at Executive Insights A.35 and Briefing System — this center prepares leadership context only.'
  );
$$;

create or replace function public._eocbp_executive_priority_center()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Executive priority center — intentional focus on what leadership attention creates greatest value.',
    'focus_areas', jsonb_build_array(
      jsonb_build_object('key', 'top_priorities', 'label', 'Top priorities', 'description', 'Highest-impact leadership focus areas — metadata ranking, humans set priorities'),
      jsonb_build_object('key', 'leadership_commitments', 'label', 'Upcoming leadership commitments', 'description', 'Calendar-adjacent commitments and scheduled reviews — cross-link Context Engine'),
      jsonb_build_object('key', 'decisions_awaiting_review', 'label', 'Decisions awaiting review', 'description', 'Pending approvals and decision support recommendations — humans decide'),
      jsonb_build_object('key', 'high_impact_conversations', 'label', 'High-impact conversations', 'description', 'Meeting continuity and stakeholder dialogue preparation — cross-link Meeting A.61')
    ),
    'focus_note', 'Priority center informs — never dictates where leaders must spend time.'
  );
$$;

create or replace function public._eocbp_organizational_health_overview()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Organizational health overview — leadership perspective on how the organization is doing.',
    'indicators', jsonb_build_array(
      jsonb_build_object('emoji', '📈', 'key', 'collaboration_observations', 'indicator', 'Collaboration observations', 'description', 'Cross-functional patterns from Phase 70 — dialogue not surveillance'),
      jsonb_build_object('emoji', '🌹', 'key', 'recognition_trends', 'indicator', 'Recognition trends', 'description', 'Bell and recognition moment counts — celebrate progress'),
      jsonb_build_object('emoji', '🦉', 'key', 'workload_concerns', 'indicator', 'Workload concerns', 'description', 'Overdue tasks and bottleneck signals — systemic not individual scoring'),
      jsonb_build_object('emoji', '🔔', 'key', 'change_adoption', 'indicator', 'Change adoption indicators', 'description', 'Improvement initiatives and knowledge gap trends — metadata only')
    ),
    'cross_link_route', '/app/organizational-health-engine',
    'cross_link_note', 'Full organizational health dashboard at Org Health Phase 61 — executive summary here only.'
  );
$$;

create or replace function public._eocbp_meeting_decision_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting & decision continuity — leadership remembers context across conversations and decisions.',
    'continuity_elements', jsonb_build_array(
      jsonb_build_object('key', 'recent_executive_decisions', 'label', 'Recent executive decisions', 'description', 'Completed approvals and resolved operations_events — audit-supported metadata'),
      jsonb_build_object('key', 'open_action_items', 'label', 'Open action items', 'description', 'Pending tasks and follow-ups from leadership meetings'),
      jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries', 'description', 'Executive meeting context — cross-link Meeting Collaboration Intelligence A.61'),
      jsonb_build_object('key', 'historical_decision_context', 'label', 'Historical decision context', 'description', 'Decision lineage for preparedness — no raw conversation storage')
    ),
    'cross_link_route', '/app/meeting-collaboration-intelligence-engine'
  );
$$;

create or replace function public._eocbp_strategic_momentum_tracking()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Strategic momentum tracking — initiative progress and goal advancement at leadership altitude.',
    'tracking_elements', jsonb_build_array(
      jsonb_build_object('key', 'initiative_progress', 'label', 'Initiative progress', 'description', 'Active improvement and strategic initiatives — aggregate status counts'),
      jsonb_build_object('key', 'goal_advancement', 'label', 'Goal advancement', 'description', 'OKR and goal milestone signals — cross-link Goals OKR A.65'),
      jsonb_build_object('key', 'execution_summaries', 'label', 'Execution summaries', 'description', 'Since Last Time trends and module overview deltas'),
      jsonb_build_object('key', 'strategic_milestones', 'label', 'Strategic milestone achievements', 'description', 'Completed milestones and recognition-worthy progress — 🌹')
    ),
    'cross_link_routes', jsonb_build_array('/app/goals-okr-engine', '/app/strategic-alignment-engine')
  );
$$;

create or replace function public._eocbp_companion_guidance()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion guidance — calm leadership prompts when renewed attention, recognition, or decision deadlines approach.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'renewed_attention', 'prompt', 'Several leadership priorities may benefit from renewed attention — shall I summarize what changed?', 'consideration', 'Perspective without pressure — humans choose focus.'),
      jsonb_build_object('emoji', '🌹', 'key', 'positive_developments', 'prompt', 'Positive developments across teams may merit recognition — would a brief summary help?', 'consideration', 'Celebrate progress — sustainable leadership.'),
      jsonb_build_object('emoji', '🔔', 'key', 'decision_deadlines', 'prompt', 'Approaching decision deadlines are visible — would preparation context help?', 'consideration', 'Decision preparation only — humans decide outcomes.')
    ),
    'optional_note', 'Companion insights remain optional — leaders control enablement.'
  );
$$;

create or replace function public._eocbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — reflection, perspective, recognition of progress, sustainable leadership.',
    'practices', jsonb_build_array(
      'Reflection — leadership benefits from pausing to see the whole picture',
      'Perspective — clarity emerges when noise is reduced',
      'Recognition of progress — consistency matters more than perfection',
      'Sustainable leadership — reduce isolation, not add pressure'
    ),
    'journey_phrase', 'Extraordinary leadership is built through consistency rather than perfection.',
    'isolation_note', 'Leadership can be isolating — Aipify reduces isolation through informed perspective, never through pressure or guilt.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable leadership — principle only; Executive Operations Center stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._eocbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how observations are generated, assumptions influencing insights, and optional recommendations.',
    'users_should_see', jsonb_build_array(
      'How executive observations derive from module overviews and operations_events — metadata only',
      'Assumptions influencing insights — Since Last Time windows and aggregate counts explained',
      'Recommendations remain optional — leaders control what they act on',
      'Human control — Aipify informs and prepares; humans decide every outcome'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Executive Insights A.35 — this center is unified leadership operations view on A.32',
      'Distinct from Command Center Phase 26 — presence/notifications, not executive situational awareness',
      'Distinct from App Ecosystem repo Phase 75 — developer platform, not executive operations',
      'Layered with Phase 70 cross-functional intelligence — executive lens, not replacement'
    ),
    'audit_note', 'Operations event lifecycle audited via _ocf_log — metadata only.'
  );
$$;

create or replace function public._eocbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group leadership validates executive operations center internally — ecosystem stewardship, strategic planning, organizational health, leadership coordination.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — Aipify Group leadership coordination',
      'focus', jsonb_build_array(
        'Ecosystem stewardship across platform and customer modules',
        'Strategic planning visibility for leadership team',
        'Organizational health signals for internal teams',
        'Leadership coordination across product, support, and go-to-market'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — commerce leadership operations overview',
      'focus', jsonb_build_array(
        'Executive visibility into support and operations handoffs',
        'Strategic initiative tracking for pilot milestones',
        'Recognition and momentum for pilot team contributions',
        'Decision preparedness for leadership reviews'
      )
    )
  );
$$;

create or replace function public._eocbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Our leaders are better equipped because they have a clearer understanding of what truly matters.',
    'Central leadership environment — leaders informed, organizations supported.',
    'Perspective enables stewardship — not managing every detail.',
    'Leadership clarity improves when noise decreases and focus strengthens.',
    'Extraordinary leadership is built through consistency rather than perfection.'
  );
$$;

create or replace function public._eocbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Executive Insights (A.35)', 'route', '/app/executive-insights-engine', 'note', 'Executive summaries and daily briefings — cross-link, do not duplicate'),
    jsonb_build_object('label', 'Organizational Health (Phase 61)', 'route', '/app/organizational-health-engine', 'note', 'Health overview — executive summary cross-link only'),
    jsonb_build_object('label', 'Meeting Intelligence (A.61)', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Meeting continuity and summaries — cross-link only'),
    jsonb_build_object('label', 'Goals & OKR (A.65)', 'route', '/app/goals-okr-engine', 'note', 'Strategic goals and milestone tracking'),
    jsonb_build_object('label', 'Predictive Insights (A.66)', 'route', '/app/predictive-insights-engine', 'note', 'Emerging trends and forward-looking signals'),
    jsonb_build_object('label', 'Briefing System', 'route', '/app/briefing', 'note', 'Daily briefings — distinct from executive operations center'),
    jsonb_build_object('label', 'Operations Dashboard (A.9)', 'route', '/app/operations-dashboard-engine', 'note', 'Role-aware widgets — distinct from executive leadership hub'),
    jsonb_build_object('label', 'Command Center (Phase 26)', 'route', '/app/command-center', 'note', 'Presence and notifications — not executive situational awareness'),
    jsonb_build_object('label', 'AOC Watchers (Phase 79)', 'route', '/app/operations', 'note', 'Autonomous watchers — distinct surface'),
    jsonb_build_object('label', 'App Ecosystem (repo Phase 75)', 'route', '/app/apps', 'note', 'Developer platform — NOT this ABOS blueprint (phase number collision)'),
    jsonb_build_object('label', 'Developer Portal', 'route', '/developers', 'note', 'App ecosystem developer platform — distinct'),
    jsonb_build_object('label', 'Cross-Functional Intelligence (Phase 70)', 'route', '/app/operations-center-foundation-engine', 'note', 'Same engine — Phase 70 connection visibility layered with Phase 75 executive lens'),
    jsonb_build_object('label', 'Strategic Alignment (A.55)', 'route', '/app/strategic-alignment-engine', 'note', 'Alignment objectives — cross-link for strategic momentum'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Sustainable leadership — principle only')
  );
$$;

create or replace function public._eocbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_modules jsonb;
  v_open_events int := 0;
  v_urgent_events int := 0;
  v_pending_approvals int := 0;
  v_module_keys int := 0;
  v_tasks_overdue int := 0;
  v_recognition int := 0;
  v_executive_signals int := 0;
begin
  perform public._ocf_aggregate_events(p_org_id);
  v_modules := public._ocf_module_overviews(p_org_id);

  select count(*) into v_open_events
  from public.operations_events
  where organization_id = p_org_id and status in ('new', 'acknowledged', 'in_progress');

  select count(*) into v_urgent_events
  from public.operations_events
  where organization_id = p_org_id
    and priority in ('high', 'critical')
    and status not in ('completed', 'dismissed');

  select count(*) into v_pending_approvals
  from public.operations_events
  where organization_id = p_org_id
    and category = 'approvals'
    and status not in ('completed', 'dismissed');

  select count(*) into v_module_keys from jsonb_object_keys(v_modules) k;

  v_tasks_overdue := coalesce((v_modules->'task_overview'->>'overdue')::int, 0);
  v_recognition := coalesce((v_modules->'recognition_overview'->>'recent_moments')::int, 0)
    + coalesce((v_modules->'recognition_overview'->>'moments')::int, 0);
  v_executive_signals := coalesce((v_modules->'executive_overview'->>'open_items')::int, 0)
    + coalesce((v_modules->'executive_overview'->>'pending_reviews')::int, 0);

  return jsonb_build_object(
    'module_overview_blocks', coalesce(v_module_keys, 0),
    'open_operations_events', coalesce(v_open_events, 0),
    'urgent_operations_events', coalesce(v_urgent_events, 0),
    'pending_leadership_approvals', coalesce(v_pending_approvals, 0),
    'tasks_overdue', v_tasks_overdue,
    'recognition_signals', coalesce(v_recognition, 0),
    'executive_overview_signals', coalesce(v_executive_signals, 0),
    'executive_dashboard_dimensions', jsonb_array_length(public._eocbp_executive_dashboard()->'dimensions'),
    'daily_briefing_elements', jsonb_array_length(public._eocbp_daily_executive_briefings()->'briefing_elements'),
    'companion_guidance_examples', jsonb_array_length(public._eocbp_companion_guidance()->'examples'),
    'privacy_note', 'Metadata only — module overview counts, operations_events aggregates, and documented leadership patterns. No PII or individual scoring.'
  );
end; $$;

create or replace function public._eocbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_module_blocks int := 0;
begin
  v_engagement := public._eocbp_engagement_summary(p_org_id);
  v_module_blocks := coalesce((v_engagement->>'module_overview_blocks')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'leadership_clarity',
      'label', 'Leadership clarity improves — executive dashboard dimensions documented',
      'met', jsonb_array_length(public._eocbp_executive_dashboard()->'dimensions') >= 8,
      'note', 'Unified view for clarity, not overwhelm.'
    ),
    jsonb_build_object(
      'key', 'strategic_focus',
      'label', 'Strategic focus strengthens — priority center and momentum tracking documented',
      'met', jsonb_array_length(public._eocbp_executive_priority_center()->'focus_areas') >= 4,
      'note', 'Intentional focus — humans set priorities.'
    ),
    jsonb_build_object(
      'key', 'organizational_visibility',
      'label', 'Organizational visibility increases — module overviews and health indicators surfaced',
      'met', v_module_blocks >= 5,
      'note', case when v_module_blocks < 5 then 'Five module overview blocks required for executive visibility.' else null end
    ),
    jsonb_build_object(
      'key', 'decision_preparedness',
      'label', 'Decision preparedness improves — meeting continuity and pending approvals visible',
      'met', v_engagement ? 'pending_leadership_approvals',
      'note', format('%s pending leadership approvals visible.', coalesce((v_engagement->>'pending_leadership_approvals')::int, 0))
    ),
    jsonb_build_object(
      'key', 'executive_effectiveness',
      'label', 'Executive effectiveness increases — daily briefings and companion guidance documented',
      'met', jsonb_array_length(public._eocbp_daily_executive_briefings()->'briefing_elements') >= 4,
      'note', '🌹🦉🔔❤️ briefing elements — perspective not pressure.'
    ),
    jsonb_build_object(
      'key', 'daily_briefings',
      'label', 'Daily executive briefings — positive momentum and commitments framed',
      'met', jsonb_array_length(public._eocbp_daily_executive_briefings()->'briefing_elements') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'organizational_health',
      'label', 'Organizational health overview — collaboration and recognition indicators',
      'met', jsonb_array_length(public._eocbp_organizational_health_overview()->'indicators') >= 4,
      'note', 'Cross-link Org Health Phase 61 for full dashboard.'
    ),
    jsonb_build_object(
      'key', 'meeting_continuity',
      'label', 'Meeting & decision continuity — context elements documented',
      'met', jsonb_array_length(public._eocbp_meeting_decision_continuity()->'continuity_elements') >= 4,
      'note', 'Cross-link Meeting A.61 — no raw conversation storage.'
    ),
    jsonb_build_object(
      'key', 'strategic_momentum',
      'label', 'Strategic momentum tracking — initiative and goal advancement framing',
      'met', jsonb_array_length(public._eocbp_strategic_momentum_tracking()->'tracking_elements') >= 4,
      'note', 'Cross-link Goals OKR A.65.'
    ),
    jsonb_build_object(
      'key', 'companion_guidance',
      'label', 'Companion guidance — optional leadership prompts documented',
      'met', jsonb_array_length(public._eocbp_companion_guidance()->'examples') >= 3,
      'note', '🦉🌹🔔 — humans decide; Aipify prepares context.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — transparent observation generation documented',
      'met', jsonb_array_length(public._eocbp_trust_connection()->'users_should_see') >= 4,
      'note', 'Recommendations remain optional.'
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — sustainable leadership framing',
      'met', (public._eocbp_self_love_connection()->>'journey_phrase') is not null,
      'note', 'Reduce isolation, not pressure.'
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from App Ecosystem repo Phase 75, Command Center, Executive Insights, Phase 70 cross-functional',
      'met', jsonb_array_length(public._eocbp_integration_links()) >= 12,
      'note', 'Cross-link related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group leadership coordination validated internally',
      'met', (public._eocbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — perspective enables stewardship',
      'met', true,
      'note', 'Create conditions for people and organizations to flourish.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase 18 AND Phase 70 fields; append Phase 75
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_center_foundation_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
begin
  perform public._irp_require_permission('operations.view');
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := jsonb_build_object(
      'since', now() - interval '7 days',
      'since_source', 'seven_day_fallback',
      'assumption_note', 'Authenticated user required for personalized Since Last Time — using 7-day fallback.'
    );
  end;

  return jsonb_build_object(
    'has_organization', true,
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 18 maps to Operations Center Foundation Engine A.32 — extend, do not duplicate. Distinct from Operations Dashboard A.9, Command Center Phase 26, and AOC Phase 79.'
    ),
    'mission', 'Centralized operational experience — visibility, coordination, and control across modules.',
    'philosophy', 'Operational clarity creates confidence — reduce noise, increase focus, enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module operational awareness.',
    'vision', 'Teams see what changed, what needs attention, and what improved — with transparent sources and calm coordination.',
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'distinction_note', public._ocf_distinction_note(),
    'operational_objectives', public._ocf_operational_objectives(),
    'module_overviews', public._ocf_module_overviews(v_org_id),
    'since_last_time', coalesce(v_since, jsonb_build_object('since', now() - interval '7 days', 'since_source', 'seven_day_fallback')),
    'companion_communication_examples', public._ocf_companion_communication_examples(),
    'self_love_connection', public._ocf_self_love_connection(),
    'self_love_note', 'Self Love (A.76) supports operational pacing and accomplishment visibility — principle only; Operations Center stores metadata, not wellbeing content.',
    'trust_connection', public._ocf_trust_connection(),
    'data_sources', public._ocf_data_sources(),
    'dogfooding', public._ocf_blueprint_dogfooding(),
    'success_criteria', public._ocf_blueprint_success_criteria(v_org_id),
    'vision_phrases', public._ocf_vision_phrases(),
    'integration_links', public._ocf_integration_links(),
    'safety_note', 'Metadata and summary counts only — no customer email, chat, order content, or PII.',
    'principles', jsonb_build_array(
      'Cross-module aggregation',
      'Action-oriented design',
      'Role-based visibility',
      'Escalation for critical events',
      'Audit-supported accountability',
      'Since Last Time — counts and trends only, no PII'
    ),
    'summary', jsonb_build_object(
      'urgent', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
      'pending_approvals', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and category = 'approvals' and status not in ('completed', 'dismissed')), 0),
      'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0)
    ),
    'urgent_actions', coalesce((
      select jsonb_agg(row_to_json(e) order by case e.priority when 'critical' then 0 when 'high' then 1 else 2 end, e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.priority in ('high', 'critical') and e.status not in ('completed', 'dismissed') limit 10
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(row_to_json(e) order by e.created_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status not in ('completed', 'dismissed') limit 25
    ), '[]'::jsonb),
    'recent_completed', coalesce((
      select jsonb_agg(row_to_json(e) order by e.updated_at desc)
      from public.operations_events e where e.organization_id = v_org_id and e.status = 'completed' limit 10
    ), '[]'::jsonb),
    'implementation_blueprint_phase70', jsonb_build_object(
      'phase', 'Phase 70 — Cross-Functional Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE70_CROSS_FUNCTIONAL_INTELLIGENCE.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 70 extends A.32 (layered with Phase 18) with cross-functional connection visibility, information flow, bottleneck recognition, collaboration opportunities, and live success criteria.'
    ),
    'cross_functional_intelligence_note', 'Cross-Functional Intelligence Engine (ABOS Phase 70) — extends Operations Center Foundation A.32 with systems-thinking visibility across functions.',
    'blueprint_distinction_note', public._cfibp_distinction_note(),
    'blueprint_mission', public._cfibp_mission(),
    'blueprint_philosophy', public._cfibp_philosophy(),
    'blueprint_abos_principle', public._cfibp_abos_principle(),
    'blueprint_objectives', public._cfibp_objectives(),
    'organizational_connections', public._cfibp_organizational_connections(),
    'cross_functional_observations', public._cfibp_cross_functional_observations(),
    'information_flow_visibility', public._cfibp_information_flow_visibility(),
    'bottleneck_identification', public._cfibp_bottleneck_identification(),
    'collaboration_opportunities', public._cfibp_collaboration_opportunities(),
    'blueprint_leadership_insights', public._cfibp_leadership_insights(),
    'blueprint_self_love_connection', public._cfibp_self_love_connection(),
    'blueprint_trust_connection', public._cfibp_trust_connection(),
    'privacy_principles', public._cfibp_privacy_principles(),
    'blueprint_dogfooding', public._cfibp_dogfooding(),
    'blueprint_integration_links', public._cfibp_integration_links(),
    'engagement_summary', public._cfibp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._cfibp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._cfibp_vision_phrases(),
    'blueprint_privacy_note', 'Cross-functional intelligence is metadata only — awareness not surveillance. No individual scoring or punitive interpretation.',
    'implementation_blueprint_phase75', jsonb_build_object(
      'phase', 'Phase 75 — Executive Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE75_EXECUTIVE_OPERATIONS_CENTER.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine',
      'mapping_note', 'ABOS Blueprint Phase 75 extends A.32 (layered with Phases 18 and 70) with executive leadership situational awareness, daily briefings, priority center, organizational health overview, meeting continuity, strategic momentum, and live success criteria.'
    ),
    'executive_operations_center_note', 'Executive Operations Center Engine (ABOS Phase 75) — unified executive leadership overview on Operations Center Foundation A.32.',
    'eocbp_distinction_note', public._eocbp_distinction_note(),
    'eocbp_mission', public._eocbp_mission(),
    'eocbp_philosophy', public._eocbp_philosophy(),
    'eocbp_abos_principle', public._eocbp_abos_principle(),
    'eocbp_objectives', public._eocbp_objectives(),
    'eocbp_executive_dashboard', public._eocbp_executive_dashboard(),
    'eocbp_daily_executive_briefings', public._eocbp_daily_executive_briefings(),
    'eocbp_executive_priority_center', public._eocbp_executive_priority_center(),
    'eocbp_organizational_health_overview', public._eocbp_organizational_health_overview(),
    'eocbp_meeting_decision_continuity', public._eocbp_meeting_decision_continuity(),
    'eocbp_strategic_momentum_tracking', public._eocbp_strategic_momentum_tracking(),
    'eocbp_companion_guidance', public._eocbp_companion_guidance(),
    'eocbp_self_love_connection', public._eocbp_self_love_connection(),
    'eocbp_trust_connection', public._eocbp_trust_connection(),
    'eocbp_dogfooding', public._eocbp_dogfooding(),
    'eocbp_integration_links', public._eocbp_integration_links(),
    'eocbp_engagement_summary', public._eocbp_engagement_summary(v_org_id),
    'eocbp_success_criteria', public._eocbp_success_criteria(v_org_id),
    'eocbp_vision_phrases', public._eocbp_vision_phrases(),
    'eocbp_privacy_note', 'Executive operations center is metadata only — clarity not overwhelm. Recommendations optional; humans decide.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase 18 + Phase 70 fields; append Phase 75 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_operations_center_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_since jsonb;
  v_engagement jsonb;
  v_eocbp_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._ocf_aggregate_events(v_org_id);
  v_engagement := public._cfibp_engagement_summary(v_org_id);
  v_eocbp_engagement := public._eocbp_engagement_summary(v_org_id);

  begin
    v_user_id := public._mta_app_user_id();
    if v_user_id is not null then
      v_since := public._ocf_since_last_time_summary(v_org_id, v_user_id);
    end if;
  exception when others then
    v_since := null;
  end;

  return jsonb_build_object(
    'has_organization', true,
    'open_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and status in ('new', 'acknowledged', 'in_progress')), 0),
    'urgent_events', coalesce((select count(*) from public.operations_events where organization_id = v_org_id and priority in ('high', 'critical') and status not in ('completed', 'dismissed')), 0),
    'philosophy', 'Operational clarity creates confidence — centralized visibility, coordination, and control.',
    'mission', 'Centralized operational experience — monitor activities, surface developments, coordinate teams, and enable informed action.',
    'abos_principle', 'Reduce noise, increase focus — one operations center for cross-module awareness.',
    'implementation_blueprint', jsonb_build_object(
      'phase', 'Phase 18 — Operations Center Engine Foundation',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE18_OPERATIONS_CENTER_FOUNDATION.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'operations_center_foundation_engine_note', 'Operations Center Engine Foundation (ABOS Phase 18) — extends Operations Center Foundation Engine (Phase A.32).',
    'module_overviews', public._ocf_module_overviews(v_org_id),
    'since_last_time', v_since,
    'implementation_blueprint_phase70', jsonb_build_object(
      'phase', 'Phase 70 — Cross-Functional Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE70_CROSS_FUNCTIONAL_INTELLIGENCE.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'blueprint_mission', public._cfibp_mission(),
    'blueprint_abos_principle', public._cfibp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Cross-Functional Intelligence Engine (ABOS Phase 70) — extends A.32 with connection visibility, information flow, and live success criteria.',
    'cross_functional_note', 'We are operating more cohesively — understanding how teams and processes interact.',
    'implementation_blueprint_phase75', jsonb_build_object(
      'phase', 'Phase 75 — Executive Operations Center Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE75_EXECUTIVE_OPERATIONS_CENTER.md',
      'engine_phase', 'A.32 Operations Center Foundation Engine',
      'route', '/app/operations-center-foundation-engine'
    ),
    'eocbp_mission', public._eocbp_mission(),
    'eocbp_abos_principle', public._eocbp_abos_principle(),
    'eocbp_engagement_summary', v_eocbp_engagement,
    'eocbp_note', 'Executive Operations Center Engine (ABOS Phase 75) — unified executive leadership overview with clarity, not overwhelm.',
    'executive_leadership_note', 'Our leaders are better equipped because they have a clearer understanding of what truly matters.'
  );
exception when others then return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._eocbp_distinction_note() to authenticated;
grant execute on function public._eocbp_mission() to authenticated;
grant execute on function public._eocbp_philosophy() to authenticated;
grant execute on function public._eocbp_abos_principle() to authenticated;
grant execute on function public._eocbp_objectives() to authenticated;
grant execute on function public._eocbp_executive_dashboard() to authenticated;
grant execute on function public._eocbp_daily_executive_briefings() to authenticated;
grant execute on function public._eocbp_executive_priority_center() to authenticated;
grant execute on function public._eocbp_organizational_health_overview() to authenticated;
grant execute on function public._eocbp_meeting_decision_continuity() to authenticated;
grant execute on function public._eocbp_strategic_momentum_tracking() to authenticated;
grant execute on function public._eocbp_companion_guidance() to authenticated;
grant execute on function public._eocbp_self_love_connection() to authenticated;
grant execute on function public._eocbp_trust_connection() to authenticated;
grant execute on function public._eocbp_dogfooding() to authenticated;
grant execute on function public._eocbp_vision_phrases() to authenticated;
grant execute on function public._eocbp_integration_links() to authenticated;
grant execute on function public._eocbp_engagement_summary(uuid) to authenticated;
grant execute on function public._eocbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'operations-center-blueprint-phase75', 'Executive Operations Center Engine (ABOS Phase 75)',
  'Executive Operations Center Engine — extends Operations Center Foundation A.32 (layered with Phases 18 and 70) with executive leadership situational awareness, daily briefings, priority center, organizational health overview, meeting continuity, strategic momentum, and live success criteria.',
  'authenticated', 111
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'operations-center-blueprint-phase75' and tenant_id is null
);
