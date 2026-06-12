import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CollaborationMeeting,
  CompanionInsight,
  ContinuityPattern,
  DecisionExample,
  EngagementSummary,
  ImplementationBlueprint,
  IntegrationLink,
  MeetingActionItem,
  MeetingCollaborationExport,
  MeetingCollaborationIntelligenceEngineCard,
  MeetingCollaborationIntelligenceEngineDashboard,
  MeetingDecision,
  PrivacyPrinciples,
  SelfLoveConnection,
  SupportedPlatform,
  TeamsIntegrationPrivacyStandard,
  TeamsJoinOption,
  TeamsKnowledgeCenterFaq,
  TeamsPostMeetingOption,
  TeamsSavePreference,
  TrustConnection,
} from "./types";

function parseRecordList<T>(data: unknown): T[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as T[];
}

function parseImplementationBlueprint(data: unknown): ImplementationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    phase: typeof d.phase === "string" ? d.phase : undefined,
    doc: typeof d.doc === "string" ? d.doc : undefined,
    engine_phase: typeof d.engine_phase === "string" ? d.engine_phase : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
    mapping_note: typeof d.mapping_note === "string" ? d.mapping_note : undefined,
  };
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  return parseRecordList<AbosSuccessCriterion>(data);
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  return parseRecordList<IntegrationLink>(data);
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  return parseRecordList<BlueprintObjective>(data);
}

function parseEngagementSummary(data: unknown): EngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    scheduled_meetings: typeof d.scheduled_meetings === "number" ? d.scheduled_meetings : undefined,
    completed_meetings_30d: typeof d.completed_meetings_30d === "number" ? d.completed_meetings_30d : undefined,
    open_action_items: typeof d.open_action_items === "number" ? d.open_action_items : undefined,
    overdue_action_items: typeof d.overdue_action_items === "number" ? d.overdue_action_items : undefined,
    decisions_logged_30d: typeof d.decisions_logged_30d === "number" ? d.decisions_logged_30d : undefined,
    supported_platforms_count:
      typeof d.supported_platforms_count === "number" ? d.supported_platforms_count : undefined,
    companion_insights_count:
      typeof d.companion_insights_count === "number" ? d.companion_insights_count : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    practices: Array.isArray(d.practices) ? (d.practices as string[]) : undefined,
    journey_phrase: typeof d.journey_phrase === "string" ? d.journey_phrase : undefined,
    self_love_route: typeof d.self_love_route === "string" ? d.self_love_route : undefined,
    boundary_note: typeof d.boundary_note === "string" ? d.boundary_note : undefined,
  };
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    users_should_see: Array.isArray(d.users_should_see) ? (d.users_should_see as string[]) : undefined,
    operators_should_understand: Array.isArray(d.operators_should_understand)
      ? (d.operators_should_understand as string[])
      : undefined,
    audit_note: typeof d.audit_note === "string" ? d.audit_note : undefined,
  };
}

function parsePrivacyPrinciples(data: unknown): PrivacyPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  return {
    principle: typeof d.principle === "string" ? d.principle : undefined,
    rules: Array.isArray(d.rules) ? (d.rules as string[]) : undefined,
    consent_note: typeof d.consent_note === "string" ? d.consent_note : undefined,
  };
}

function parseTeamsIntegrationPrivacyStandard(data: unknown): TeamsIntegrationPrivacyStandard | undefined {
  if (typeof data !== "object" || !data) return undefined;
  const d = data as Record<string, unknown>;
  const postMeeting =
    typeof d.post_meeting_flow === "object" && d.post_meeting_flow
      ? (d.post_meeting_flow as Record<string, unknown>)
      : undefined;
  const consentSummary =
    typeof d.consent_summary === "object" && d.consent_summary
      ? (d.consent_summary as Record<string, unknown>)
      : undefined;

  return {
    doc: typeof d.doc === "string" ? d.doc : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    core_idea:
      typeof d.core_idea === "object" && d.core_idea ? (d.core_idea as Record<string, unknown>) : undefined,
    pre_meeting_consent_prompt:
      typeof d.pre_meeting_consent_prompt === "object" && d.pre_meeting_consent_prompt
        ? (d.pre_meeting_consent_prompt as Record<string, unknown>)
        : undefined,
    join_options: parseRecordList<TeamsJoinOption>(d.join_options),
    join_experience:
      typeof d.join_experience === "object" && d.join_experience
        ? (d.join_experience as Record<string, unknown>)
        : undefined,
    permitted_capabilities: parseRecordList<TeamsJoinOption>(d.permitted_capabilities),
    prohibited_actions: Array.isArray(d.prohibited_actions) ? (d.prohibited_actions as string[]) : undefined,
    privacy_standard:
      typeof d.privacy_standard === "object" && d.privacy_standard
        ? (d.privacy_standard as Record<string, unknown>)
        : undefined,
    save_preferences: parseRecordList<TeamsSavePreference>(d.save_preferences),
    post_meeting_flow: postMeeting
      ? {
          prompt: typeof postMeeting.prompt === "string" ? postMeeting.prompt : undefined,
          options: parseRecordList<TeamsPostMeetingOption>(postMeeting.options),
          review_note: typeof postMeeting.review_note === "string" ? postMeeting.review_note : undefined,
        }
      : undefined,
    knowledge_center_faq: parseRecordList<TeamsKnowledgeCenterFaq>(d.knowledge_center_faq),
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision_phrases: Array.isArray(d.vision_phrases) ? (d.vision_phrases as string[]) : undefined,
    integration_links: parseIntegrationLinks(d.integration_links),
    teams_integration_scaffold:
      typeof d.teams_integration_scaffold === "object" && d.teams_integration_scaffold
        ? (d.teams_integration_scaffold as Record<string, unknown>)
        : undefined,
    consent_summary: consentSummary
      ? {
          total_meetings:
            typeof consentSummary.total_meetings === "number" ? consentSummary.total_meetings : undefined,
          meetings_with_summary_metadata:
            typeof consentSummary.meetings_with_summary_metadata === "number"
              ? consentSummary.meetings_with_summary_metadata
              : undefined,
          scheduled_meetings:
            typeof consentSummary.scheduled_meetings === "number" ? consentSummary.scheduled_meetings : undefined,
          completed_meetings_30d:
            typeof consentSummary.completed_meetings_30d === "number"
              ? consentSummary.completed_meetings_30d
              : undefined,
          privacy_note:
            typeof consentSummary.privacy_note === "string" ? consentSummary.privacy_note : undefined,
        }
      : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}

export function parseMeetingCollaborationIntelligenceEngineCard(
  data: unknown
): MeetingCollaborationIntelligenceEngineCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    scheduled_meetings: typeof d.scheduled_meetings === "number" ? d.scheduled_meetings : undefined,
    open_actions: typeof d.open_actions === "number" ? d.open_actions : undefined,
    completed_meetings_30d:
      typeof d.completed_meetings_30d === "number" ? d.completed_meetings_30d : undefined,
    overdue_actions: typeof d.overdue_actions === "number" ? d.overdue_actions : undefined,
    implementation_blueprint_phase72: parseImplementationBlueprint(d.implementation_blueprint_phase72),
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
    meeting_companion_note:
      typeof d.meeting_companion_note === "string" ? d.meeting_companion_note : undefined,
    teams_privacy_note: typeof d.teams_privacy_note === "string" ? d.teams_privacy_note : undefined,
    teams_privacy_brief: typeof d.teams_privacy_brief === "string" ? d.teams_privacy_brief : undefined,
    ...d,
  } as MeetingCollaborationIntelligenceEngineCard;
}

export function parseMeetingCollaborationIntelligenceEngineDashboard(
  data: unknown
): MeetingCollaborationIntelligenceEngineDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  const decisionTracking =
    typeof d.decision_tracking === "object" && d.decision_tracking
      ? (d.decision_tracking as Record<string, unknown>)
      : undefined;
  const meetingContinuity =
    typeof d.meeting_continuity === "object" && d.meeting_continuity
      ? (d.meeting_continuity as Record<string, unknown>)
      : undefined;
  const companionInsights =
    typeof d.companion_insights === "object" && d.companion_insights
      ? (d.companion_insights as Record<string, unknown>)
      : undefined;
  const supportedPlatforms =
    typeof d.supported_platforms === "object" && d.supported_platforms
      ? (d.supported_platforms as Record<string, unknown>)
      : undefined;

  return {
    has_organization: Boolean(d.has_organization),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    principles: Array.isArray(d.principles) ? (d.principles as string[]) : undefined,
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    meetings: parseRecordList<CollaborationMeeting>(d.meetings),
    action_items: parseRecordList<MeetingActionItem>(d.action_items),
    decisions: parseRecordList<MeetingDecision>(d.decisions),
    executive_summary:
      typeof d.executive_summary === "object" && d.executive_summary
        ? (d.executive_summary as Record<string, unknown>)
        : undefined,
    integration_notes:
      typeof d.integration_notes === "object" && d.integration_notes
        ? (d.integration_notes as Record<string, string>)
        : undefined,
    integration_summaries:
      typeof d.integration_summaries === "object" && d.integration_summaries
        ? (d.integration_summaries as Record<string, unknown>)
        : undefined,
    workflow_examples:
      typeof d.workflow_examples === "object" && d.workflow_examples
        ? (d.workflow_examples as Record<string, unknown>)
        : undefined,
    implementation_blueprint_phase72: parseImplementationBlueprint(d.implementation_blueprint_phase72),
    meeting_companion_collaboration_note:
      typeof d.meeting_companion_collaboration_note === "string"
        ? d.meeting_companion_collaboration_note
        : undefined,
    blueprint_distinction_note:
      typeof d.blueprint_distinction_note === "string" ? d.blueprint_distinction_note : undefined,
    blueprint_mission: typeof d.blueprint_mission === "string" ? d.blueprint_mission : undefined,
    blueprint_philosophy: typeof d.blueprint_philosophy === "string" ? d.blueprint_philosophy : undefined,
    blueprint_abos_principle:
      typeof d.blueprint_abos_principle === "string" ? d.blueprint_abos_principle : undefined,
    blueprint_objectives: parseObjectives(d.blueprint_objectives),
    supported_platforms: supportedPlatforms
      ? {
          principle: typeof supportedPlatforms.principle === "string" ? supportedPlatforms.principle : undefined,
          integration_status:
            typeof supportedPlatforms.integration_status === "string"
              ? supportedPlatforms.integration_status
              : undefined,
          platforms: parseRecordList<SupportedPlatform>(supportedPlatforms.platforms),
          boundary_note:
            typeof supportedPlatforms.boundary_note === "string" ? supportedPlatforms.boundary_note : undefined,
        }
      : undefined,
    meeting_summaries_blueprint:
      typeof d.meeting_summaries_blueprint === "object" && d.meeting_summaries_blueprint
        ? (d.meeting_summaries_blueprint as Record<string, unknown>)
        : undefined,
    decision_tracking: decisionTracking
      ? {
          principle: typeof decisionTracking.principle === "string" ? decisionTracking.principle : undefined,
          examples: parseRecordList<DecisionExample>(decisionTracking.examples),
          register_note:
            typeof decisionTracking.register_note === "string" ? decisionTracking.register_note : undefined,
        }
      : undefined,
    action_items_blueprint:
      typeof d.action_items_blueprint === "object" && d.action_items_blueprint
        ? (d.action_items_blueprint as Record<string, unknown>)
        : undefined,
    meeting_continuity: meetingContinuity
      ? {
          principle: typeof meetingContinuity.principle === "string" ? meetingContinuity.principle : undefined,
          continuity_patterns: parseRecordList<ContinuityPattern>(meetingContinuity.continuity_patterns),
          memory_route:
            typeof meetingContinuity.memory_route === "string" ? meetingContinuity.memory_route : undefined,
          boundary_note:
            typeof meetingContinuity.boundary_note === "string" ? meetingContinuity.boundary_note : undefined,
        }
      : undefined,
    companion_insights: companionInsights
      ? {
          principle: typeof companionInsights.principle === "string" ? companionInsights.principle : undefined,
          insights: parseRecordList<CompanionInsight>(companionInsights.insights),
          support_note:
            typeof companionInsights.support_note === "string" ? companionInsights.support_note : undefined,
        }
      : undefined,
    collaboration_health:
      typeof d.collaboration_health === "object" && d.collaboration_health
        ? (d.collaboration_health as Record<string, unknown>)
        : undefined,
    blueprint_self_love_connection: parseSelfLoveConnection(d.blueprint_self_love_connection),
    blueprint_trust_connection: parseTrustConnection(d.blueprint_trust_connection),
    privacy_principles: parsePrivacyPrinciples(d.privacy_principles),
    blueprint_dogfooding:
      typeof d.blueprint_dogfooding === "object" && d.blueprint_dogfooding
        ? (d.blueprint_dogfooding as Record<string, unknown>)
        : undefined,
    blueprint_integration_links: parseIntegrationLinks(d.blueprint_integration_links),
    engagement_summary: parseEngagementSummary(d.engagement_summary),
    blueprint_success_criteria: parseSuccessCriteria(d.blueprint_success_criteria),
    blueprint_vision_phrases: Array.isArray(d.blueprint_vision_phrases)
      ? (d.blueprint_vision_phrases as string[])
      : undefined,
    blueprint_privacy_note:
      typeof d.blueprint_privacy_note === "string" ? d.blueprint_privacy_note : undefined,
    teams_integration_privacy_standard: parseTeamsIntegrationPrivacyStandard(
      d.teams_integration_privacy_standard
    ),
    ...d,
  } as MeetingCollaborationIntelligenceEngineDashboard;
}

export function parseMeetingCollaborationExport(data: unknown): MeetingCollaborationExport {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_organization: Boolean(d.has_organization),
    exported_at: typeof d.exported_at === "string" ? d.exported_at : undefined,
    meetings: parseRecordList<CollaborationMeeting>(d.meetings),
    action_items: parseRecordList<MeetingActionItem>(d.action_items),
    decisions: parseRecordList<MeetingDecision>(d.decisions),
    summary: typeof d.summary === "object" && d.summary ? (d.summary as Record<string, unknown>) : undefined,
    ...d,
  } as MeetingCollaborationExport;
}
