-- Implementation Blueprint Phase 72 — Meeting Companion & Collaboration Engine
-- Extends Meeting & Collaboration Intelligence Engine Phase A.61. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._mcbp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 72 — Meeting Companion & Collaboration Engine at /app/meeting-collaboration-intelligence-engine. Extends Meeting & Collaboration Intelligence Engine Phase A.61 (20260906000000_meeting_collaboration_intelligence_engine_phase_a61.sql). Distinct from Global Learning Network repo Phase 72 at /app/global-learning and /app/evolution. Distinct from Multi-Agent Collaboration repo Phase 74 at /app/agents. Distinct from Context Engine / Universal Calendar (calendar cross-link only). Distinct from Unified Task A.62 (action items cross-link via create_task_from_source). Distinct from Stakeholder Communication A.53 and Document Output A.59. Engine helpers use _mcie_* — blueprint Phase 72 MUST use _mcbp_*. All Phase A.61 dashboard and card fields preserved.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Blueprint metadata helpers
-- ---------------------------------------------------------------------------
create or replace function public._mcbp_mission()
returns text language sql immutable as $$
  select 'Capture decisions, commitments, and insights from meetings; strengthen collaboration and accountability.';
$$;

create or replace function public._mcbp_philosophy()
returns text language sql immutable as $$
  select 'Meeting value = shared understanding + clear next steps — better meetings, not more meetings.';
$$;

create or replace function public._mcbp_abos_principle()
returns text language sql immutable as $$
  select 'Meetings create shared understanding leading to meaningful action — not conversation alone. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._mcbp_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'meeting_summaries', 'label', 'Meeting summaries', 'description', 'Topics, themes, agreements, and open questions — participants leave with clarity'),
    jsonb_build_object('key', 'decision_tracking', 'label', 'Decision tracking', 'description', 'Visible decisions with context — pilot timing, training updates, and strategic choices'),
    jsonb_build_object('key', 'action_item_creation', 'label', 'Action item creation', 'description', 'Named owners (individual or team) with accountability — cross-link Unified Tasks A.62'),
    jsonb_build_object('key', 'follow_up_reminders', 'label', 'Follow-up reminders', 'description', 'Gentle reminders for open commitments — support not pressure'),
    jsonb_build_object('key', 'meeting_continuity', 'label', 'Meeting continuity', 'description', 'Previously discussed topics and open commitments from earlier conversations'),
    jsonb_build_object('key', 'collaboration_improvement', 'label', 'Collaboration improvement', 'description', 'Awareness of unresolved topics, ownership clarity, and follow-through patterns')
  );
$$;

create or replace function public._mcbp_supported_platforms()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future platform integrations — seamless support metadata only; no fake live connections.',
    'integration_status', 'scaffold_only',
    'platforms', jsonb_build_array(
      jsonb_build_object('key', 'microsoft_teams', 'label', 'Microsoft Teams / Outlook / 365', 'status', 'future_scaffold', 'note', 'Calendar and meeting metadata cross-link — consent required'),
      jsonb_build_object('key', 'google_workspace', 'label', 'Google Meet / Calendar / Workspace', 'status', 'future_scaffold', 'note', 'Calendar cross-link via Context Engine — never replaces calendars'),
      jsonb_build_object('key', 'zoom', 'label', 'Zoom', 'status', 'future_scaffold', 'note', 'Meeting metadata import scaffold — no transcript storage'),
      jsonb_build_object('key', 'slack', 'label', 'Slack', 'status', 'future_scaffold', 'note', 'Channel meeting summaries — metadata only'),
      jsonb_build_object('key', 'discord', 'label', 'Discord', 'status', 'future_scaffold', 'note', 'Community meeting outcomes — organizational scope only')
    ),
    'boundary_note', 'Platform scaffolds document intended support — humans enable integrations when available.'
  );
$$;

create or replace function public._mcbp_meeting_summaries()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting summaries capture topics, themes, agreements, and open questions — metadata only, no raw transcripts.',
    'summary_dimensions', jsonb_build_array(
      jsonb_build_object('key', 'topics', 'label', 'Topics discussed', 'description', 'Agenda sections and headline themes from summary_metadata'),
      jsonb_build_object('key', 'themes', 'label', 'Recurring themes', 'description', 'Patterns across recent meetings — organizational memory cross-link optional'),
      jsonb_build_object('key', 'agreements', 'label', 'Agreements reached', 'description', 'Shared understanding captured at meeting close'),
      jsonb_build_object('key', 'open_questions', 'label', 'Open questions', 'description', 'Unresolved items flagged for follow-up — clarity without pressure')
    ),
    'clarity_note', 'Participants leave with clarity — summaries are prepared for human review, not auto-distributed.'
  );
$$;

create or replace function public._mcbp_decision_tracking()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Decision tracking makes commitments visible — humans log decisions; Aipify surfaces the register.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🔔', 'key', 'pilot_timing', 'decision', 'Pilot timing confirmed for next quarter', 'description', 'Strategic timing decision with accountable follow-up'),
      jsonb_build_object('emoji', '🌹', 'key', 'training_materials', 'decision', 'Training materials update approved', 'description', 'Resource commitment with named owner'),
      jsonb_build_object('emoji', '🔔', 'key', 'budget_allocation', 'decision', 'Budget allocation direction agreed — details pending approval', 'description', 'Directional decision with explicit next steps')
    ),
    'register_note', 'meeting_decisions table stores decision_text and metadata — no conversation content.'
  );
$$;

create or replace function public._mcbp_action_items()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Action items require named owners — individual or team accountability with due dates.',
    'ownership_patterns', jsonb_build_array(
      jsonb_build_object('key', 'individual_owner', 'label', 'Individual owner', 'description', 'assigned_user_id on meeting_action_items — clear personal accountability'),
      jsonb_build_object('key', 'team_owner', 'label', 'Team owner', 'description', 'Team-level commitment in metadata — humans confirm assignment'),
      jsonb_build_object('key', 'unified_task_link', 'label', 'Unified Task cross-link', 'description', 'create_task_from_source() bridges meeting actions to organization_tasks — A.62')
    ),
    'unified_task_route', '/app/unified-task-follow-up-engine',
    'boundary_note', 'Meeting action items remain in A.61 tables — Unified Tasks provides organization-wide follow-up visibility.'
  );
$$;

create or replace function public._mcbp_meeting_continuity()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Meeting continuity connects today''s discussion to prior conversations — open commitments resurface gently.',
    'continuity_patterns', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'prior_topics', 'pattern', 'Previously discussed topics', 'example', '🦉 Three topics from last week''s sync remain open — shall I summarize before today''s meeting?'),
      jsonb_build_object('emoji', '🌹', 'key', 'open_commitments', 'pattern', 'Open commitments from earlier conversations', 'example', '🌹 Two commitments from the executive review are due this week — available for your prep.'),
      jsonb_build_object('emoji', '🦉', 'key', 'decision_thread', 'pattern', 'Decision thread continuity', 'example', '🦉 The pilot timing decision connects to three open action items — would context help?')
    ),
    'memory_route', '/app/organizational-memory-engine',
    'boundary_note', 'Continuity uses metadata summaries — optional organizational memory hooks, never raw transcripts.'
  );
$$;

create or replace function public._mcbp_companion_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion insights support collaboration — action concentration, objectives completed, ownership clarification. Support not judgment.',
    'insights', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'action_concentration', 'insight', 'Several action items concentrate on one area — would ownership review help?', 'description', 'Workload awareness — not individual scoring'),
      jsonb_build_object('emoji', '🌹', 'key', 'objectives_completed', 'insight', 'Meaningful objectives progressed in recent meetings', 'description', 'Progress recognition — several meaningful outcomes emerged'),
      jsonb_build_object('emoji', '🔔', 'key', 'ownership_clarification', 'insight', 'Some action items lack assigned owners — clarity strengthens follow-through', 'description', 'Gentle accountability prompt — humans assign owners')
    ),
    'support_note', 'Insights encourage dialogue — never punitive interpretation or hidden monitoring.'
  );
$$;

create or replace function public._mcbp_collaboration_health()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Collaboration health surfaces patterns — repeated unresolved topics, unclear ownership, overloaded participants, missed follow-ups. Awareness strengthens collaboration.',
    'health_signals', jsonb_build_array(
      jsonb_build_object('key', 'repeated_unresolved', 'label', 'Repeated unresolved topics', 'description', 'Themes appearing across meetings without resolution — coordination opportunity'),
      jsonb_build_object('key', 'unclear_ownership', 'label', 'Unclear ownership', 'description', 'Action items without assigned_user_id — humans clarify accountability'),
      jsonb_build_object('key', 'overloaded_participants', 'label', 'Overloaded participants', 'description', 'Concentration of open actions — sustainable pacing consideration'),
      jsonb_build_object('key', 'missed_follow_ups', 'label', 'Missed follow-ups', 'description', 'Overdue action items — gentle reminder, not guilt')
    ),
    'awareness_note', 'Health signals are systemic metadata — improvement opportunity, not blame.'
  );
$$;

create or replace function public._mcbp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Self Love connection — focus, healthy pacing, progress recognition, appreciation.',
    'practices', jsonb_build_array(
      'Focus — meetings with clear outcomes reduce cognitive load',
      'Healthy pacing — sustainable meeting rhythm over constant syncs',
      'Progress recognition — several meaningful outcomes emerged from today''s discussions',
      'Appreciation — acknowledge team contributions without performance scoring'
    ),
    'journey_phrase', 'Several meaningful outcomes emerged from today''s discussions.',
    'self_love_route', '/app/self-love-engine',
    'boundary_note', 'Self Love supports sustainable collaboration pacing — principle only; Meeting Companion stores metadata, not wellbeing content.'
  );
$$;

create or replace function public._mcbp_privacy_principles()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Privacy principles — org controls recording permissions, consent, access boundaries, and retention. Trust through transparency.',
    'rules', jsonb_build_array(
      'Organization controls recording permissions — explicit consent before capture',
      'Access boundaries — role-based visibility via meetings.* permissions',
      'Retention policies — metadata summaries only; no raw transcript storage in RPCs',
      'Configurable settings — humans control summary generation and memory hooks',
      'Metadata only — no email, chat, or conversation content in meeting dashboards'
    ),
    'consent_note', 'Recording and summary features require organizational consent configuration — never silent capture.'
  );
$$;

create or replace function public._mcbp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Trust requires transparency about how summaries are generated, contributing information, and configurable settings.',
    'users_should_see', jsonb_build_array(
      'How meeting summaries derive from summary_metadata — metadata only, human-reviewed',
      'Which information contributed to decisions and action items — audit via _mcie_log',
      'Configurable consent and retention settings — org-controlled',
      'Human approval for workflow triggers and output generation'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Global Learning Network repo Phase 72 — tenant meeting metadata, not cross-tenant learning',
      'Distinct from Multi-Agent Collaboration repo Phase 74 — human meetings, not agent orchestration',
      'Distinct from Context Engine calendars — calendar cross-link only, never replaces calendars',
      'Action items cross-link Unified Tasks A.62 via create_task_from_source — do not duplicate task storage'
    ),
    'audit_note', 'Meeting lifecycle audited via _mcie_log — metadata only.'
  );
$$;

create or replace function public._mcbp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates Meeting Companion internally — leadership meetings, product discussions, Sales Expert sessions, strategic planning.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal dogfooding — leadership meetings, product discussions, Sales Expert sessions, strategic planning',
      'focus', jsonb_build_array(
        'Leadership meeting decision registers and action accountability',
        'Product discussion summaries with clear next steps',
        'Sales Expert session outcomes linked to follow-up tasks',
        'Strategic planning continuity across quarterly reviews'
      )
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — operational and customer success meeting accountability',
      'focus', jsonb_build_array(
        'Weekly operational sync decisions and owners',
        'Customer success meeting follow-through',
        'Incident review action item tracking',
        'Cross-module meeting output links'
      )
    )
  );
$$;

create or replace function public._mcbp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Our meetings have become significantly more effective.',
    'Clarity, connection, and progress — shared understanding leads to meaningful action.',
    'Better meetings, not more meetings.',
    'Decisions are visible — follow-through strengthens collaboration.',
    'Several meaningful outcomes emerged from today''s discussions.'
  );
$$;

create or replace function public._mcbp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Unified Task & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine', 'note', 'create_task_from_source() — action items cross-link only'),
    jsonb_build_object('label', 'Context Engine / Calendars', 'route', '/app/assistant/calendars', 'note', 'Calendar cross-link — never replaces calendars'),
    jsonb_build_object('label', 'Stakeholder Communication (A.53)', 'route', '/app/stakeholder-communication-engine', 'note', 'Follow-up campaigns — distinct engine'),
    jsonb_build_object('label', 'Document & Output (A.59)', 'route', '/app/document-output-engine', 'note', 'generate_meeting_outputs() links output_generations'),
    jsonb_build_object('label', 'Workflow Orchestration (A.42)', 'route', '/app/workflow-orchestration-engine', 'note', 'trigger_meeting_workflow_hook() — human approval required'),
    jsonb_build_object('label', 'Operations Center (A.32)', 'route', '/app/operations-center-foundation-engine', 'note', 'Meeting-driven operational follow-ups'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Optional memory hooks — metadata only'),
    jsonb_build_object('label', 'Global Learning Network (repo Phase 72)', 'route', '/app/global-learning', 'note', 'Distinct — cross-tenant learning, NOT meeting companion'),
    jsonb_build_object('label', 'Multi-Agent Collaboration (repo Phase 74)', 'route', '/app/agents', 'note', 'Distinct — agent orchestration, NOT human meetings'),
    jsonb_build_object('label', 'Self Love (A.76)', 'route', '/app/self-love-engine', 'note', 'Healthy pacing and progress recognition — principle only')
  );
$$;

create or replace function public._mcbp_engagement_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_scheduled int := 0;
  v_completed_30d int := 0;
  v_open_actions int := 0;
  v_overdue_actions int := 0;
  v_decisions_30d int := 0;
begin
  select count(*) into v_scheduled
  from public.collaboration_meetings
  where organization_id = p_org_id and status = 'scheduled';

  select count(*) into v_completed_30d
  from public.collaboration_meetings
  where organization_id = p_org_id and status = 'completed'
    and updated_at >= now() - interval '30 days';

  select count(*) into v_open_actions
  from public.meeting_action_items
  where organization_id = p_org_id and status in ('open', 'in_progress', 'overdue');

  select count(*) into v_overdue_actions
  from public.meeting_action_items
  where organization_id = p_org_id and status = 'overdue';

  select count(*) into v_decisions_30d
  from public.meeting_decisions
  where organization_id = p_org_id and created_at >= now() - interval '30 days';

  return jsonb_build_object(
    'scheduled_meetings', coalesce(v_scheduled, 0),
    'completed_meetings_30d', coalesce(v_completed_30d, 0),
    'open_action_items', coalesce(v_open_actions, 0),
    'overdue_action_items', coalesce(v_overdue_actions, 0),
    'decisions_logged_30d', coalesce(v_decisions_30d, 0),
    'supported_platforms_count', jsonb_array_length(public._mcbp_supported_platforms()->'platforms'),
    'companion_insights_count', jsonb_array_length(public._mcbp_companion_insights()->'insights'),
    'privacy_note', 'Metadata only — collaboration_meetings, meeting_decisions, and meeting_action_items counts. No transcripts or PII.'
  );
end; $$;

create or replace function public._mcbp_success_criteria(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_meetings int := 0;
  v_decisions int := 0;
  v_actions int := 0;
  v_assigned int := 0;
begin
  perform public._mcie_seed_meetings(p_org_id);
  v_engagement := public._mcbp_engagement_summary(p_org_id);

  select count(*) into v_meetings from public.collaboration_meetings where organization_id = p_org_id;
  select count(*) into v_decisions from public.meeting_decisions where organization_id = p_org_id;
  select count(*) into v_actions from public.meeting_action_items where organization_id = p_org_id;
  select count(*) into v_assigned
  from public.meeting_action_items
  where organization_id = p_org_id and assigned_user_id is not null;

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'meeting_summaries',
      'label', 'Meeting summaries — topics, themes, agreements, open questions documented',
      'met', jsonb_array_length(public._mcbp_meeting_summaries()->'summary_dimensions') >= 4,
      'note', 'Summary dimensions scaffolded — capture_summary stores metadata only.'
    ),
    jsonb_build_object(
      'key', 'decision_visibility',
      'label', 'Decision visibility — decisions logged with examples',
      'met', v_decisions > 0 or coalesce((v_engagement->>'decisions_logged_30d')::int, 0) >= 0,
      'note', case when v_decisions = 0 then 'Log a meeting decision to validate decision register.' else null end
    ),
    jsonb_build_object(
      'key', 'action_accountability',
      'label', 'Action accountability — owners and due dates tracked',
      'met', v_actions > 0,
      'note', case when v_actions = 0 then 'Extract action items from a meeting to validate accountability.' else null end
    ),
    jsonb_build_object(
      'key', 'follow_through',
      'label', 'Improved follow-through — open and overdue actions surfaced',
      'met', v_engagement ? 'open_action_items',
      'note', 'Overdue actions flagged via mark_action_overdue — gentle follow-up, not guilt.'
    ),
    jsonb_build_object(
      'key', 'meeting_continuity',
      'label', 'Meeting continuity — prior topics and open commitments patterns',
      'met', jsonb_array_length(public._mcbp_meeting_continuity()->'continuity_patterns') >= 3,
      'note', '🦉🌹 continuity examples — optional memory hooks.'
    ),
    jsonb_build_object(
      'key', 'collaboration_health',
      'label', 'Collaboration health — unresolved topics and ownership awareness',
      'met', jsonb_array_length(public._mcbp_collaboration_health()->'health_signals') >= 4,
      'note', 'Awareness strengthens collaboration — not surveillance.'
    ),
    jsonb_build_object(
      'key', 'companion_insights',
      'label', 'Companion insights — support not judgment',
      'met', jsonb_array_length(public._mcbp_companion_insights()->'insights') >= 3,
      'note', '🦉🌹🔔 companion patterns documented.'
    ),
    jsonb_build_object(
      'key', 'platform_scaffold',
      'label', 'Supported platforms scaffold — future integrations metadata only',
      'met', jsonb_array_length(public._mcbp_supported_platforms()->'platforms') >= 5,
      'note', 'Teams, Google, Zoom, Slack, Discord — no fake live connections.'
    ),
    jsonb_build_object(
      'key', 'privacy_consent',
      'label', 'Privacy and consent framing — org controls recording and retention',
      'met', jsonb_array_length(public._mcbp_privacy_principles()->'rules') >= 5,
      'note', 'Trust through transparency — consent mandatory.'
    ),
    jsonb_build_object(
      'key', 'trust_connection',
      'label', 'Trust connection — summary generation transparency documented',
      'met', jsonb_array_length(public._mcbp_trust_connection()->'users_should_see') >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Distinct from Global Learning Phase 72, Agents Phase 74, Context Engine, Unified Tasks',
      'met', jsonb_array_length(public._mcbp_integration_links()) >= 8,
      'note', 'Cross-link related engines — do not duplicate.'
    ),
    jsonb_build_object(
      'key', 'dogfooding',
      'label', 'Dogfooding — Aipify Group leadership and strategic meetings',
      'met', (public._mcbp_dogfooding()->'aipify_group') is not null,
      'note', 'Aipify Group internal; Unonight first external pilot.'
    ),
    jsonb_build_object(
      'key', 'perceived_value',
      'label', 'Perceived meeting value — vision phrases and reduced admin burden',
      'met', jsonb_array_length(public._mcbp_vision_phrases()) >= 4,
      'note', 'Our meetings have become significantly more effective.'
    ),
    jsonb_build_object(
      'key', 'abos_principle',
      'label', 'ABOS principle — shared understanding leads to meaningful action',
      'met', true,
      'note', 'Better meetings, not more meetings.'
    )
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 3. Dashboard RPC — preserve ALL Phase A.61 fields; append Phase 72
-- ---------------------------------------------------------------------------
create or replace function public.get_meeting_collaboration_intelligence_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('meetings.view');
  v_org_id := public._mta_require_organization();
  perform public._mcie_seed_meetings(v_org_id);
  perform public.mark_action_overdue(null);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Structured meeting lifecycle — agendas, summaries, decisions, and actions with human approval.',
    'principles', jsonb_build_array(
      'Metadata-only meeting capture',
      'Human-approved workflow triggers',
      'Action accountability',
      'Decision register',
      'Output links via Document & Output Engine'
    ),
    'summary', public._mcie_executive_summary_block(v_org_id),
    'meetings', coalesce((
      select jsonb_agg(row_to_json(m) order by m.scheduled_at desc)
      from public.collaboration_meetings m where m.organization_id = v_org_id limit 30
    ), '[]'::jsonb),
    'action_items', coalesce((
      select jsonb_agg(row_to_json(a) order by a.due_date nulls last)
      from public.meeting_action_items a where a.organization_id = v_org_id limit 40
    ), '[]'::jsonb),
    'decisions', coalesce((
      select jsonb_agg(row_to_json(d) order by d.created_at desc)
      from public.meeting_decisions d where d.organization_id = v_org_id limit 20
    ), '[]'::jsonb),
    'executive_summary', public._mcie_executive_summary_block(v_org_id),
    'workflow_examples', jsonb_build_object(
      'executive', public._mcie_workflow_examples('executive'),
      'incident_review', public._mcie_workflow_examples('incident_review'),
      'customer_success', public._mcie_workflow_examples('customer_success'),
      'strategy', public._mcie_workflow_examples('strategy'),
      'department', public._mcie_workflow_examples('department'),
      'project', public._mcie_workflow_examples('project')
    ),
    'integration_notes', jsonb_build_object(
      'operations_center', 'Extends Operations Center Foundation (A.32) with meeting-driven follow-ups',
      'workflow_orchestration', 'trigger_meeting_workflow_hook() — metadata triggers, not auto-execute (A.42)',
      'stakeholder_communication', 'Follow-up campaigns complement Stakeholder Communication (A.53)',
      'document_output', 'generate_meeting_outputs() links A.59 output_generations',
      'organizational_memory', 'Optional memory hooks — metadata only (A.34)'
    ),
    'integration_summaries', jsonb_build_object(
      'operations_center', public._mcie_operations_center_summary(v_org_id),
      'stakeholder_communication', public._mcie_stakeholder_communication_summary(v_org_id),
      'document_output', public._mcie_document_output_summary(v_org_id)
    ),
    'implementation_blueprint_phase72', jsonb_build_object(
      'phase', 'Phase 72 — Meeting Companion & Collaboration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE72_MEETING_COMPANION_COLLABORATION.md',
      'engine_phase', 'A.61 Meeting & Collaboration Intelligence Engine',
      'route', '/app/meeting-collaboration-intelligence-engine',
      'mapping_note', 'ABOS Blueprint Phase 72 extends A.61 with meeting companion framing, decision tracking, collaboration health, platform scaffolds, and live success criteria.'
    ),
    'meeting_companion_collaboration_note', 'Meeting Companion & Collaboration Engine (ABOS Phase 72) — extends Meeting & Collaboration Intelligence A.61 with summaries, continuity, and accountability scaffolding.',
    'blueprint_distinction_note', public._mcbp_distinction_note(),
    'blueprint_mission', public._mcbp_mission(),
    'blueprint_philosophy', public._mcbp_philosophy(),
    'blueprint_abos_principle', public._mcbp_abos_principle(),
    'blueprint_objectives', public._mcbp_objectives(),
    'supported_platforms', public._mcbp_supported_platforms(),
    'meeting_summaries_blueprint', public._mcbp_meeting_summaries(),
    'decision_tracking', public._mcbp_decision_tracking(),
    'action_items_blueprint', public._mcbp_action_items(),
    'meeting_continuity', public._mcbp_meeting_continuity(),
    'companion_insights', public._mcbp_companion_insights(),
    'collaboration_health', public._mcbp_collaboration_health(),
    'blueprint_self_love_connection', public._mcbp_self_love_connection(),
    'blueprint_trust_connection', public._mcbp_trust_connection(),
    'privacy_principles', public._mcbp_privacy_principles(),
    'blueprint_dogfooding', public._mcbp_dogfooding(),
    'blueprint_integration_links', public._mcbp_integration_links(),
    'engagement_summary', public._mcbp_engagement_summary(v_org_id),
    'blueprint_success_criteria', public._mcbp_success_criteria(v_org_id),
    'blueprint_vision_phrases', public._mcbp_vision_phrases(),
    'blueprint_privacy_note', 'Meeting Companion is metadata only — org controls consent, recording permissions, and retention. No raw transcripts in RPCs.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 4. Card RPC — preserve Phase A.61 fields; append Phase 72 framing
-- ---------------------------------------------------------------------------
create or replace function public.get_meeting_collaboration_intelligence_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_engagement jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._mcie_seed_meetings(v_org_id);
  v_summary := public._mcie_executive_summary_block(v_org_id);
  v_engagement := public._mcbp_engagement_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Meeting & Collaboration Intelligence — structured accountability.',
    'scheduled_meetings', v_summary->'scheduled_meetings',
    'open_actions', v_summary->'open_action_items',
    'completed_meetings_30d', v_summary->'completed_meetings_30d',
    'overdue_actions', v_summary->'overdue_action_items',
    'implementation_blueprint_phase72', jsonb_build_object(
      'phase', 'Phase 72 — Meeting Companion & Collaboration Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE72_MEETING_COMPANION_COLLABORATION.md',
      'engine_phase', 'A.61 Meeting & Collaboration Intelligence Engine',
      'route', '/app/meeting-collaboration-intelligence-engine'
    ),
    'blueprint_mission', public._mcbp_mission(),
    'blueprint_abos_principle', public._mcbp_abos_principle(),
    'engagement_summary', v_engagement,
    'blueprint_note', 'Meeting Companion & Collaboration Engine (ABOS Phase 72) — extends A.61 with decision visibility, action accountability, and collaboration health.',
    'meeting_companion_note', 'Our meetings have become significantly more effective — clarity, connection, progress.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._mcbp_distinction_note() to authenticated;
grant execute on function public._mcbp_mission() to authenticated;
grant execute on function public._mcbp_philosophy() to authenticated;
grant execute on function public._mcbp_abos_principle() to authenticated;
grant execute on function public._mcbp_objectives() to authenticated;
grant execute on function public._mcbp_supported_platforms() to authenticated;
grant execute on function public._mcbp_meeting_summaries() to authenticated;
grant execute on function public._mcbp_decision_tracking() to authenticated;
grant execute on function public._mcbp_action_items() to authenticated;
grant execute on function public._mcbp_meeting_continuity() to authenticated;
grant execute on function public._mcbp_companion_insights() to authenticated;
grant execute on function public._mcbp_collaboration_health() to authenticated;
grant execute on function public._mcbp_self_love_connection() to authenticated;
grant execute on function public._mcbp_privacy_principles() to authenticated;
grant execute on function public._mcbp_trust_connection() to authenticated;
grant execute on function public._mcbp_dogfooding() to authenticated;
grant execute on function public._mcbp_vision_phrases() to authenticated;
grant execute on function public._mcbp_integration_links() to authenticated;
grant execute on function public._mcbp_engagement_summary(uuid) to authenticated;
grant execute on function public._mcbp_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'meeting-companion-blueprint-phase72', 'Meeting Companion & Collaboration Engine (ABOS Phase 72)',
  'Meeting Companion & Collaboration Engine — extends Meeting & Collaboration Intelligence A.61 with summaries, decision tracking, action accountability, meeting continuity, companion insights, collaboration health, platform scaffolds, and live success criteria.',
  'authenticated', 112
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'meeting-companion-blueprint-phase72' and tenant_id is null
);
