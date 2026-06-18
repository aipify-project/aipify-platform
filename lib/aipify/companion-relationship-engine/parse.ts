import type {
  CompanionCommunicationProfile,
  CompanionInteractionRecord,
  CompanionPersonalityProfile,
  CompanionRelationshipAdvisorSignal,
  CompanionRelationshipCenter,
  CompanionRelationshipIntelligenceSignal,
  CompanionRelationshipMemory,
  CompanionRelationshipMilestone,
  CompanionTrustSignal,
} from "./types";

function parsePersonality(raw: unknown): CompanionPersonalityProfile {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    profile_key: typeof d.profile_key === "string" ? d.profile_key : undefined,
    profile_title: typeof d.profile_title === "string" ? d.profile_title : undefined,
    personality_type: typeof d.personality_type === "string" ? d.personality_type : undefined,
    core_value: typeof d.core_value === "string" ? d.core_value : undefined,
    description: typeof d.description === "string" ? d.description : undefined,
  };
}

function parseCommunication(raw: unknown): CompanionCommunicationProfile {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    profile_key: typeof d.profile_key === "string" ? d.profile_key : undefined,
    profile_title: typeof d.profile_title === "string" ? d.profile_title : undefined,
    audience_type: typeof d.audience_type === "string" ? d.audience_type : undefined,
    tone: typeof d.tone === "string" ? d.tone : undefined,
    detail_level: typeof d.detail_level === "string" ? d.detail_level : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseMemory(raw: unknown): CompanionRelationshipMemory {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    memory_key: typeof d.memory_key === "string" ? d.memory_key : undefined,
    memory_title: typeof d.memory_title === "string" ? d.memory_title : undefined,
    memory_type: typeof d.memory_type === "string" ? d.memory_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    approval_status: typeof d.approval_status === "string" ? d.approval_status : undefined,
  };
}

function parseMilestone(raw: unknown): CompanionRelationshipMilestone {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    milestone_key: typeof d.milestone_key === "string" ? d.milestone_key : undefined,
    milestone_title: typeof d.milestone_title === "string" ? d.milestone_title : undefined,
    milestone_type: typeof d.milestone_type === "string" ? d.milestone_type : undefined,
    achieved: Boolean(d.achieved),
    summary: typeof d.summary === "string" ? d.summary : undefined,
    achieved_at: typeof d.achieved_at === "string" ? d.achieved_at : undefined,
  };
}

function parseTrust(raw: unknown): CompanionTrustSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    signal_title: typeof d.signal_title === "string" ? d.signal_title : undefined,
    score: Number(d.score ?? 0),
    observation: typeof d.observation === "string" ? d.observation : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
  };
}

function parseInteraction(raw: unknown): CompanionInteractionRecord {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    interaction_key: typeof d.interaction_key === "string" ? d.interaction_key : undefined,
    interaction_type: typeof d.interaction_type === "string" ? d.interaction_type : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
    satisfaction_score: Number(d.satisfaction_score ?? 0),
    occurred_at: typeof d.occurred_at === "string" ? d.occurred_at : undefined,
  };
}

function parseIntelligence(raw: unknown): CompanionRelationshipIntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): CompanionRelationshipAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseCompanionRelationshipCenter(raw: unknown): CompanionRelationshipCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    identity_foundation: (d.identity_foundation as Record<string, unknown>) ?? {},
    core_values: Array.isArray(d.core_values) ? (d.core_values as string[]) : [],
    identity_relationship_route: typeof d.identity_relationship_route === "string" ? d.identity_relationship_route : undefined,
    personalization_route: typeof d.personalization_route === "string" ? d.personalization_route : undefined,
    trust_adoption_route: typeof d.trust_adoption_route === "string" ? d.trust_adoption_route : undefined,
    assistant_identity_route: typeof d.assistant_identity_route === "string" ? d.assistant_identity_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: (d.overview as Record<string, unknown>) ?? {},
    settings: (d.settings as Record<string, unknown>) ?? {},
    user_preferences: (d.user_preferences as Record<string, unknown>) ?? {},
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    personality_profiles: Array.isArray(d.personality_profiles) ? d.personality_profiles.map(parsePersonality) : [],
    communication_profiles: Array.isArray(d.communication_profiles) ? d.communication_profiles.map(parseCommunication) : [],
    relationship_memories: Array.isArray(d.relationship_memories) ? d.relationship_memories.map(parseMemory) : [],
    milestones: Array.isArray(d.milestones) ? d.milestones.map(parseMilestone) : [],
    trust_signals: Array.isArray(d.trust_signals) ? d.trust_signals.map(parseTrust) : [],
    interaction_history: Array.isArray(d.interaction_history) ? d.interaction_history.map(parseInteraction) : [],
    intelligence_signals: Array.isArray(d.intelligence_signals) ? d.intelligence_signals.map(parseIntelligence) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    executive_dashboard: (d.executive_dashboard as Record<string, unknown>) ?? {},
    governance: (d.governance as Record<string, unknown>) ?? {},
  };
}
