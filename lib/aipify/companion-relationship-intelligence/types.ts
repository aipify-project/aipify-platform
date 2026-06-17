export type RelationshipType =
  | "customers"
  | "prospects"
  | "partners"
  | "vendors"
  | "employees"
  | "executives"
  | "advisors"
  | "investors"
  | "growth_partners"
  | "strategic_contacts";
export type HealthLevel = "excellent" | "healthy" | "stable" | "needs_attention" | "at_risk";
export type EngagementLevel = "high" | "moderate" | "low" | "inactive";

export type RelationshipProfile = {
  id: string;
  contact_name: string;
  organization_name: string;
  contact_role?: string;
  relationship_type: RelationshipType | string;
  health_level: HealthLevel | string;
  health_score: number;
  engagement_level: EngagementLevel | string;
  last_interaction_at?: string | null;
  recommended_action?: string;
  owner_label?: string;
  department?: string;
  insight?: string;
  signals?: Record<string, unknown>;
};

export type RelationshipInteraction = {
  id: string;
  interaction_type: string;
  title: string;
  description: string;
  interaction_date: string;
};

export type RelationshipOpportunity = {
  id: string;
  profile_id?: string | null;
  opportunity_type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
};

export type RelationshipReminder = {
  id: string;
  profile_id?: string | null;
  reminder_type: string;
  title: string;
  due_date: string;
  status: string;
};

export type RecognitionOpportunity = {
  id: string;
  profile_id?: string | null;
  recognition_type: string;
  title: string;
  description: string;
  status: string;
};

export type RelationshipTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  created_at: string;
};

export type RelationshipIntelligenceDashboard = {
  found: boolean;
  has_relationships?: boolean;
  role?: string;
  can_team?: boolean;
  can_organization?: boolean;
  can_executive?: boolean;
  relationship_health_score?: number;
  strategic_count?: number;
  attention_count?: number;
  profiles?: RelationshipProfile[];
  timeline?: RelationshipTimelineEvent[];
  usage_example?: string;
  privacy_note?: string;
  principle?: string;
};

export type CompanionRelationshipIntelligenceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  privacyNote: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  accessDenied: string;
  filters: {
    search: string;
    relationshipType: string;
    healthLevel: string;
    engagementLevel: string;
    owner: string;
    department: string;
    all: string;
  };
  sections: {
    strategicRelationships: string;
    needsAttention: string;
    recentInteractions: string;
    upcomingActivities: string;
    engagementTrends: string;
    opportunities: string;
    reminders: string;
    recognitionCenter: string;
    timeline: string;
    usageExamples: string;
    allRelationships: string;
  };
  dashboard: {
    healthScore: string;
    strategicRelationships: string;
    needsAttention: string;
    recentInteractions: string;
    upcomingActivities: string;
    engagementTrends: string;
  };
  card: {
    organization: string;
    role: string;
    lastInteraction: string;
    health: string;
    engagement: string;
    recommendedAction: string;
    insight: string;
    owner: string;
  };
  actions: { addRelationships: string; addNote: string; viewProfile: string };
  relationshipTypes: Record<string, string>;
  healthLevels: Record<string, string>;
  engagementLevels: Record<string, string>;
  opportunityTypes: Record<string, string>;
  reminderTypes: Record<string, string>;
  recognitionTypes: Record<string, string>;
  recommendedActions: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    autoManage: string;
    autoManageAnswer: string;
    whyImportant: string;
    whyImportantAnswer: string;
  };
};
