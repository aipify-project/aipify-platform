export type CompanionPersonalityProfile = {
  id?: string;
  profile_key?: string;
  profile_title?: string;
  personality_type?: string;
  core_value?: string;
  description?: string;
  [key: string]: unknown;
};

export type CompanionCommunicationProfile = {
  id?: string;
  profile_key?: string;
  profile_title?: string;
  audience_type?: string;
  tone?: string;
  detail_level?: string;
  summary?: string;
  [key: string]: unknown;
};

export type CompanionRelationshipMemory = {
  id?: string;
  memory_key?: string;
  memory_title?: string;
  memory_type?: string;
  summary?: string;
  approval_status?: string;
  [key: string]: unknown;
};

export type CompanionRelationshipMilestone = {
  id?: string;
  milestone_key?: string;
  milestone_title?: string;
  milestone_type?: string;
  achieved?: boolean;
  summary?: string;
  achieved_at?: string;
  [key: string]: unknown;
};

export type CompanionTrustSignal = {
  id?: string;
  signal_key?: string;
  signal_type?: string;
  signal_title?: string;
  score?: number;
  observation?: string;
  status?: string;
  [key: string]: unknown;
};

export type CompanionInteractionRecord = {
  id?: string;
  interaction_key?: string;
  interaction_type?: string;
  summary?: string;
  satisfaction_score?: number;
  occurred_at?: string;
  [key: string]: unknown;
};

export type CompanionRelationshipIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CompanionRelationshipAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CompanionRelationshipCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  identity_foundation?: Record<string, unknown>;
  core_values?: string[];
  identity_relationship_route?: string;
  personalization_route?: string;
  trust_adoption_route?: string;
  assistant_identity_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  user_preferences?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  personality_profiles?: CompanionPersonalityProfile[];
  communication_profiles?: CompanionCommunicationProfile[];
  relationship_memories?: CompanionRelationshipMemory[];
  milestones?: CompanionRelationshipMilestone[];
  trust_signals?: CompanionTrustSignal[];
  interaction_history?: CompanionInteractionRecord[];
  intelligence_signals?: CompanionRelationshipIntelligenceSignal[];
  advisor_signals?: CompanionRelationshipAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
