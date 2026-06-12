export type CollaborationMeeting = {
  id?: string;
  meeting_title?: string;
  meeting_type?: string;
  organizer_user_id?: string;
  scheduled_at?: string;
  status?: string;
  agenda?: Record<string, unknown> | unknown[];
  summary_metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MeetingActionItem = {
  id?: string;
  meeting_id?: string;
  assigned_user_id?: string;
  action_description?: string;
  due_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MeetingDecision = {
  id?: string;
  meeting_id?: string;
  decision_text?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type SupportedPlatform = {
  key?: string;
  label?: string;
  status?: string;
  note?: string;
};

export type CompanionInsight = {
  emoji?: string;
  key?: string;
  insight?: string;
  description?: string;
};

export type ContinuityPattern = {
  emoji?: string;
  key?: string;
  pattern?: string;
  example?: string;
};

export type DecisionExample = {
  emoji?: string;
  key?: string;
  decision?: string;
  description?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  practices?: string[];
  journey_phrase?: string;
  self_love_route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
};

export type PrivacyPrinciples = {
  principle?: string;
  rules?: string[];
  consent_note?: string;
};

export type EngagementSummary = {
  scheduled_meetings?: number;
  completed_meetings_30d?: number;
  open_action_items?: number;
  overdue_action_items?: number;
  decisions_logged_30d?: number;
  supported_platforms_count?: number;
  companion_insights_count?: number;
  privacy_note?: string;
};

export type TeamsJoinOption = {
  key?: string;
  label?: string;
  description?: string;
};

export type TeamsSavePreference = {
  key?: string;
  label?: string;
  description?: string;
};

export type TeamsPostMeetingOption = {
  key?: string;
  label?: string;
};

export type TeamsKnowledgeCenterFaq = {
  question?: string;
  answer?: string;
};

export type TeamsConsentSummary = {
  total_meetings?: number;
  meetings_with_summary_metadata?: number;
  scheduled_meetings?: number;
  completed_meetings_30d?: number;
  privacy_note?: string;
};

export type TeamsIntegrationPrivacyStandard = {
  doc?: string;
  distinction_note?: string;
  core_idea?: Record<string, unknown>;
  pre_meeting_consent_prompt?: Record<string, unknown>;
  join_options?: TeamsJoinOption[];
  join_experience?: Record<string, unknown>;
  permitted_capabilities?: TeamsJoinOption[];
  prohibited_actions?: string[];
  privacy_standard?: Record<string, unknown>;
  save_preferences?: TeamsSavePreference[];
  post_meeting_flow?: {
    prompt?: string;
    options?: TeamsPostMeetingOption[];
    review_note?: string;
  };
  knowledge_center_faq?: TeamsKnowledgeCenterFaq[];
  abos_principle?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  teams_integration_scaffold?: Record<string, unknown>;
  consent_summary?: TeamsConsentSummary;
  privacy_note?: string;
};

export type MeetingCollaborationIntelligenceEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  scheduled_meetings?: number;
  open_actions?: number;
  completed_meetings_30d?: number;
  overdue_actions?: number;
  implementation_blueprint_phase72?: ImplementationBlueprint;
  blueprint_mission?: string;
  blueprint_abos_principle?: string;
  engagement_summary?: EngagementSummary;
  blueprint_note?: string;
  meeting_companion_note?: string;
  teams_privacy_note?: string;
  teams_privacy_brief?: string;
  [key: string]: unknown;
};

export type MeetingCollaborationIntelligenceEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  meetings?: CollaborationMeeting[];
  action_items?: MeetingActionItem[];
  decisions?: MeetingDecision[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  workflow_examples?: Record<string, unknown>;
  implementation_blueprint_phase72?: ImplementationBlueprint;
  meeting_companion_collaboration_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  blueprint_objectives?: BlueprintObjective[];
  supported_platforms?: {
    principle?: string;
    integration_status?: string;
    platforms?: SupportedPlatform[];
    boundary_note?: string;
  };
  meeting_summaries_blueprint?: Record<string, unknown>;
  decision_tracking?: {
    principle?: string;
    examples?: DecisionExample[];
    register_note?: string;
  };
  action_items_blueprint?: Record<string, unknown>;
  meeting_continuity?: {
    principle?: string;
    continuity_patterns?: ContinuityPattern[];
    memory_route?: string;
    boundary_note?: string;
  };
  companion_insights?: {
    principle?: string;
    insights?: CompanionInsight[];
    support_note?: string;
  };
  collaboration_health?: Record<string, unknown>;
  blueprint_self_love_connection?: SelfLoveConnection;
  blueprint_trust_connection?: TrustConnection;
  privacy_principles?: PrivacyPrinciples;
  blueprint_dogfooding?: Record<string, unknown>;
  blueprint_integration_links?: IntegrationLink[];
  engagement_summary?: EngagementSummary;
  blueprint_success_criteria?: AbosSuccessCriterion[];
  blueprint_vision_phrases?: string[];
  blueprint_privacy_note?: string;
  teams_integration_privacy_standard?: TeamsIntegrationPrivacyStandard;
  [key: string]: unknown;
};

export type MeetingCollaborationExport = {
  has_organization?: boolean;
  exported_at?: string;
  meetings?: CollaborationMeeting[];
  action_items?: MeetingActionItem[];
  decisions?: MeetingDecision[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
