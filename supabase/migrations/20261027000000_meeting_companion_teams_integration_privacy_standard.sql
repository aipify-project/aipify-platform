-- Meeting Companion Teams Integration & Privacy Standard
-- Extends Meeting & Collaboration Intelligence Engine Phase A.61 + Blueprint Phase 72. No new tables.

-- ---------------------------------------------------------------------------
-- 1. Distinction note
-- ---------------------------------------------------------------------------
create or replace function public._mctips_distinction_note()
returns text language sql immutable as $$
  select 'Meeting Companion Teams Integration & Privacy Standard — extends Meeting & Collaboration Intelligence Engine Phase A.61 and ABOS Blueprint Phase 72 at /app/meeting-collaboration-intelligence-engine. NOT a separate product or route. Context Engine (/app/assistant/calendars) handles calendar OAuth — MCIE consumes calendar meeting awareness cross-link only. No raw audio/video storage — Trust Architecture alignment. Unified Tasks A.62 for draft task creation cross-link. Knowledge Center A.5 and Organizational Memory A.34 for approved save destinations. Platform scaffolds only — document intended Teams behavior; do not implement Microsoft Graph API in this migration. Helpers use _mctips_* — engine _mcie_* and blueprint _mcbp_* unchanged.';
$$;

-- ---------------------------------------------------------------------------
-- 2. Core content helpers
-- ---------------------------------------------------------------------------
create or replace function public._mctips_core_idea()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Calendar connection detects upcoming meetings — consent before join.',
    'trigger', 'Context Engine calendar awareness surfaces upcoming Teams meetings.',
    'prompt_example', 'Your Teams meeting starts soon. Would you like me to join and help?',
    'calendar_route', '/app/assistant/calendars',
    'boundary_note', 'Calendar OAuth lives in Context Engine — MCIE consumes meeting awareness metadata only.'
  );
$$;

create or replace function public._mctips_pre_meeting_consent_prompt()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'prompt', 'Your Teams meeting starts soon. Would you like me to join and help?',
    'timing', 'Before meeting start — never auto-join',
    'consent_required', true,
    'org_rules_note', 'Organization may define consent rules — user or org consent always required.'
  );
$$;

create or replace function public._mctips_join_options()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'join_notes', 'label', 'Join + take notes', 'description', 'Aipify Companion joins visibly and captures approved notes metadata'),
    jsonb_build_object('key', 'join_action_items', 'label', 'Join + action items', 'description', 'Identify and draft action items — user approves before task creation'),
    jsonb_build_object('key', 'join_summary', 'label', 'Join + summary', 'description', 'Prepare meeting summary for post-meeting review'),
    jsonb_build_object('key', 'do_not_join', 'label', 'Do not join', 'description', 'Skip this meeting — no capture'),
    jsonb_build_object('key', 'never_this_type', 'label', 'Never join this type', 'description', 'Remember preference for this meeting type — consent respected')
  );
$$;

create or replace function public._mctips_join_experience()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'companion_name', 'Aipify Companion',
    'visibility', 'visible_to_all_participants',
    'principle', 'When approved, Aipify appears as Aipify Companion — visible to all participants. Never secretly listen.',
    'never_hidden', true,
    'never_auto_join', true
  );
$$;

create or replace function public._mctips_permitted_capabilities()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'notes', 'label', 'Take notes', 'description', 'Approved notes metadata — no raw audio'),
    jsonb_build_object('key', 'summarize_topics', 'label', 'Summarize topics', 'description', 'Headline themes and agenda sections in summary_metadata'),
    jsonb_build_object('key', 'decisions', 'label', 'Identify decisions', 'description', 'Log decisions to meeting_decisions — human review'),
    jsonb_build_object('key', 'action_items', 'label', 'Identify action items', 'description', 'Draft action items and follow-ups — user assigns owners'),
    jsonb_build_object('key', 'post_meeting_summary', 'label', 'Post-meeting summary', 'description', 'Prepare summary for review before save or send'),
    jsonb_build_object('key', 'draft_tasks', 'label', 'Draft tasks', 'description', 'Cross-link Unified Tasks A.62 via create_task_from_source — user control'),
    jsonb_build_object('key', 'suggest_reminders', 'label', 'Suggest reminders', 'description', 'Gentle follow-up reminders — support not pressure')
  );
$$;

create or replace function public._mctips_prohibited_actions()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Join without approval — consent always required',
    'Secretly record — Aipify Companion is always visible',
    'Store raw audio/video by default — metadata only',
    'Save content without explicit approval',
    'Send summaries without review when org policy requires review',
    'Access private meetings without permission'
  );
$$;

create or replace function public._mctips_privacy_standard()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'No audio/video by default. Only keep notes, summaries, decisions, and actions when explicitly approved.',
    'default', 'privacy_safe',
    'default_behavior', 'Do not save until user chooses',
    'rules', jsonb_build_array(
      'No raw audio or video storage by default',
      'Metadata summaries only in collaboration_meetings.summary_metadata',
      'Explicit approval before persistence',
      'Org retention policies apply — Trust Architecture alignment',
      'Role-based access via meetings.* permissions'
    ),
    'trust_note', 'Customer owns data — Aipify owns the intelligence layer with transparency.'
  );
$$;

create or replace function public._mctips_save_preferences()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'do_not_save', 'label', 'Do not save', 'description', 'Default privacy-safe — discard after session'),
    jsonb_build_object('key', 'private_notes', 'label', 'Private notes only', 'description', 'Save to user-private notes — not shared'),
    jsonb_build_object('key', 'meeting_summary', 'label', 'Meeting summary', 'description', 'Save approved summary metadata to meeting record'),
    jsonb_build_object('key', 'decisions_actions', 'label', 'Decisions + actions', 'description', 'Persist decisions and action items with human confirmation'),
    jsonb_build_object('key', 'knowledge_center', 'label', 'Knowledge Center', 'description', 'Approved save to Knowledge Center A.5 — org policy applies'),
    jsonb_build_object('key', 'organizational_memory', 'label', 'Organizational Memory', 'description', 'Approved save to Organizational Memory A.34 — metadata hooks only')
  );
$$;

create or replace function public._mctips_post_meeting_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'prompt', 'Would you like me to save or send this meeting summary?',
    'options', jsonb_build_array(
      jsonb_build_object('key', 'save_privately', 'label', 'Save privately'),
      jsonb_build_object('key', 'send_participants', 'label', 'Send to participants'),
      jsonb_build_object('key', 'save_knowledge_center', 'label', 'Save to Knowledge Center'),
      jsonb_build_object('key', 'create_tasks', 'label', 'Create tasks'),
      jsonb_build_object('key', 'delete_everything', 'label', 'Delete everything'),
      jsonb_build_object('key', 'edit_first', 'label', 'Edit first')
    ),
    'review_note', 'Send and external share require review when org policy mandates — never auto-distribute.'
  );
$$;

create or replace function public._mctips_knowledge_center_faq()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object(
      'question', 'Does Aipify join meetings automatically?',
      'answer', 'No. Aipify asks before joining. User or organization consent rules apply — never auto-join without approval.'
    ),
    jsonb_build_object(
      'question', 'Does Aipify record meetings?',
      'answer', 'No raw audio or video by default. Aipify captures approved notes and summary metadata only when you consent.'
    ),
    jsonb_build_object(
      'question', 'Can participants see Aipify?',
      'answer', 'Yes. When approved, Aipify appears as Aipify Companion — visible to all participants. Aipify never joins hidden.'
    ),
    jsonb_build_object(
      'question', 'Can I delete meeting notes?',
      'answer', 'Yes. You can delete or adjust meeting notes per your permissions and organization retention policies.'
    ),
    jsonb_build_object(
      'question', 'Can Aipify create tasks from meetings?',
      'answer', 'Yes, when approved. Aipify drafts tasks — you review and confirm before creation via Unified Tasks A.62.'
    ),
    jsonb_build_object(
      'question', 'Can Aipify save meeting knowledge?',
      'answer', 'Yes, with approval. Save to Knowledge Center or Organizational Memory when you choose — default is do not save.'
    )
  );
$$;

create or replace function public._mctips_abos_principle()
returns text language sql immutable as $$
  select 'Preserve what matters without violating trust — privacy first, consent always, value when approved. Aipify informs and prepares; humans decide.';
$$;

create or replace function public._mctips_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Trusted meeting companion — helps when invited.',
    'Explains clearly what Aipify will and will not do.',
    'Respects privacy — default do not save.',
    'Visible as Aipify Companion — never secret recording.',
    'Value when approved — notes, summaries, and actions on your terms.'
  );
$$;

create or replace function public._mctips_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('label', 'Context Engine / Calendars', 'route', '/app/assistant/calendars', 'note', 'Calendar OAuth and upcoming meeting awareness — MCIE cross-link only'),
    jsonb_build_object('label', 'Unified Task & Follow-Up (A.62)', 'route', '/app/unified-task-follow-up-engine', 'note', 'Draft task creation — create_task_from_source after approval'),
    jsonb_build_object('label', 'Knowledge Center (A.5)', 'route', '/app/knowledge-center-engine', 'note', 'Approved meeting knowledge save destination'),
    jsonb_build_object('label', 'Organizational Memory (A.34)', 'route', '/app/organizational-memory-engine', 'note', 'Approved organizational memory hooks — metadata only'),
    jsonb_build_object('label', 'Meeting Companion Blueprint Phase 72', 'route', '/app/meeting-collaboration-intelligence-engine', 'note', 'Extends A.61 — summaries, decisions, action accountability'),
    jsonb_build_object('label', 'Trust Architecture', 'route', '/app/settings/security', 'note', 'Privacy-by-design — no raw audio/video by default')
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. Teams integration scaffold — privacy standard defined (no live OAuth)
-- ---------------------------------------------------------------------------
create or replace function public._mctips_teams_integration_scaffold()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'platform', 'microsoft_teams',
    'label', 'Microsoft Teams / Outlook / 365',
    'status', 'privacy_standard_defined',
    'integration_status', 'scaffold_only',
    'live_connection', false,
    'principle', 'Privacy-first Teams integration scaffold — consent flows documented; no fake live OAuth.',
    'consent_flows', jsonb_build_array(
      'Pre-meeting consent prompt before join',
      'Join options: notes, action items, summary, do not join, never this type',
      'Post-meeting save/send review flow',
      'Org consent rules overlay user choices'
    ),
    'companion_identity', 'Aipify Companion — visible to all participants',
    'calendar_cross_link', '/app/assistant/calendars',
    'boundary_note', 'Microsoft Graph API not implemented — metadata and policy scaffolding only.'
  );
$$;

-- Upgrade microsoft_teams in supported platforms scaffold
create or replace function public._mcbp_supported_platforms()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Future platform integrations — seamless support metadata only; no fake live connections.',
    'integration_status', 'scaffold_only',
    'platforms', jsonb_build_array(
      jsonb_build_object('key', 'microsoft_teams', 'label', 'Microsoft Teams / Outlook / 365', 'status', 'privacy_standard_defined', 'note', 'Teams Integration & Privacy Standard — consent flows documented; calendar cross-link via Context Engine'),
      jsonb_build_object('key', 'google_workspace', 'label', 'Google Meet / Calendar / Workspace', 'status', 'future_scaffold', 'note', 'Calendar cross-link via Context Engine — never replaces calendars'),
      jsonb_build_object('key', 'zoom', 'label', 'Zoom', 'status', 'future_scaffold', 'note', 'Meeting metadata import scaffold — no transcript storage'),
      jsonb_build_object('key', 'slack', 'label', 'Slack', 'status', 'future_scaffold', 'note', 'Channel meeting summaries — metadata only'),
      jsonb_build_object('key', 'discord', 'label', 'Discord', 'status', 'future_scaffold', 'note', 'Community meeting outcomes — organizational scope only')
    ),
    'boundary_note', 'Platform scaffolds document intended support — humans enable integrations when available. Teams privacy standard defined — no live connection yet.'
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. Consent summary — metadata counts only, no PII
-- ---------------------------------------------------------------------------
create or replace function public._mctips_consent_summary(p_org_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_total int := 0;
  v_with_summary int := 0;
  v_scheduled int := 0;
  v_completed_30d int := 0;
begin
  select count(*) into v_total
  from public.collaboration_meetings where organization_id = p_org_id;

  select count(*) into v_with_summary
  from public.collaboration_meetings
  where organization_id = p_org_id
    and summary_metadata is not null
    and summary_metadata != '{}'::jsonb;

  select count(*) into v_scheduled
  from public.collaboration_meetings
  where organization_id = p_org_id and status = 'scheduled';

  select count(*) into v_completed_30d
  from public.collaboration_meetings
  where organization_id = p_org_id and status = 'completed'
    and updated_at >= now() - interval '30 days';

  return jsonb_build_object(
    'total_meetings', coalesce(v_total, 0),
    'meetings_with_summary_metadata', coalesce(v_with_summary, 0),
    'scheduled_meetings', coalesce(v_scheduled, 0),
    'completed_meetings_30d', coalesce(v_completed_30d, 0),
    'privacy_note', 'Metadata counts from collaboration_meetings only — no PII, transcripts, or audio.'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 5. Dashboard RPC — preserve ALL A.61 + Phase 72 fields; append teams block
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
    'blueprint_privacy_note', 'Meeting Companion is metadata only — org controls consent, recording permissions, and retention. No raw transcripts in RPCs.',
    'teams_integration_privacy_standard', jsonb_build_object(
      'doc', 'MEETING_COMPANION_TEAMS_INTEGRATION_PRIVACY_STANDARD.md',
      'distinction_note', public._mctips_distinction_note(),
      'core_idea', public._mctips_core_idea(),
      'pre_meeting_consent_prompt', public._mctips_pre_meeting_consent_prompt(),
      'join_options', public._mctips_join_options(),
      'join_experience', public._mctips_join_experience(),
      'permitted_capabilities', public._mctips_permitted_capabilities(),
      'prohibited_actions', public._mctips_prohibited_actions(),
      'privacy_standard', public._mctips_privacy_standard(),
      'save_preferences', public._mctips_save_preferences(),
      'post_meeting_flow', public._mctips_post_meeting_flow(),
      'knowledge_center_faq', public._mctips_knowledge_center_faq(),
      'abos_principle', public._mctips_abos_principle(),
      'vision_phrases', public._mctips_vision_phrases(),
      'integration_links', public._mctips_integration_links(),
      'teams_integration_scaffold', public._mctips_teams_integration_scaffold(),
      'consent_summary', public._mctips_consent_summary(v_org_id),
      'privacy_note', 'Teams Integration & Privacy Standard — consent-based join, no raw audio/video, Aipify Companion visible to all. Scaffold only — no live Microsoft Graph connection.'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 6. Card RPC — preserve fields; append brief teams/privacy note
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
    'meeting_companion_note', 'Our meetings have become significantly more effective — clarity, connection, progress.',
    'teams_privacy_note', 'Teams Integration & Privacy Standard — consent before join, Aipify Companion visible to all, no raw audio/video by default.',
    'teams_privacy_brief', public._mctips_abos_principle()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Grants + knowledge category
-- ---------------------------------------------------------------------------
grant execute on function public._mctips_distinction_note() to authenticated;
grant execute on function public._mctips_core_idea() to authenticated;
grant execute on function public._mctips_pre_meeting_consent_prompt() to authenticated;
grant execute on function public._mctips_join_options() to authenticated;
grant execute on function public._mctips_join_experience() to authenticated;
grant execute on function public._mctips_permitted_capabilities() to authenticated;
grant execute on function public._mctips_prohibited_actions() to authenticated;
grant execute on function public._mctips_privacy_standard() to authenticated;
grant execute on function public._mctips_save_preferences() to authenticated;
grant execute on function public._mctips_post_meeting_flow() to authenticated;
grant execute on function public._mctips_knowledge_center_faq() to authenticated;
grant execute on function public._mctips_abos_principle() to authenticated;
grant execute on function public._mctips_vision_phrases() to authenticated;
grant execute on function public._mctips_integration_links() to authenticated;
grant execute on function public._mctips_teams_integration_scaffold() to authenticated;
grant execute on function public._mctips_consent_summary(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'meeting-companion-teams-privacy-standard', 'Meeting Companion Teams Integration & Privacy Standard',
  'Teams integration and privacy standard for Meeting & Collaboration Intelligence A.61 — consent-based join as Aipify Companion, no raw audio/video, save preferences, post-meeting flow, and KC FAQ. Scaffold only — no live OAuth.',
  'authenticated', 113
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'meeting-companion-teams-privacy-standard' and tenant_id is null
);
