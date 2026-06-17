export type MemoryCategory =
  | "user_preferences"
  | "team_preferences"
  | "organizational_preferences"
  | "companion_preferences"
  | "communication_style"
  | "operational_workflows"
  | "approved_processes"
  | "recurring_tasks"
  | "important_dates"
  | "business_context"
  | "relationship_context"
  | "knowledge_references";

export type MemoryType = "temporary" | "long_term";
export type MemoryScope = "personal" | "team" | "department" | "organization" | "global";
export type MemoryConfidence = "high" | "medium" | "low" | "unverified";
export type MemoryApprovalStatus = "suggested" | "approved" | "rejected" | "archived";

export type MemoryRecord = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: MemoryCategory | string;
  memory_type: MemoryType | string;
  memory_scope: MemoryScope | string;
  source_key: string;
  department?: string;
  confidence: MemoryConfidence | string;
  approval_status: MemoryApprovalStatus | string;
  reason?: string;
  learned_at?: string;
  approved_at?: string | null;
  updated_at?: string;
};

export type MemorySource = {
  id: string;
  source_key: string;
  title: string;
  memory_count: number;
  last_updated_at?: string | null;
};

export type MemoryTimelineEvent = {
  id: string;
  event_type: string;
  description: string;
  memory_id?: string | null;
  created_at: string;
};

export type MemoryReviewItem = {
  id: string;
  title: string;
  summary: string;
  source_key: string;
  reason: string;
  confidence: MemoryConfidence | string;
  approval_status: MemoryApprovalStatus | string;
  category: string;
  memory_scope: string;
  learned_at: string;
};

export type CompanionMemoryDashboard = {
  found: boolean;
  can_personal?: boolean;
  can_team?: boolean;
  can_organization?: boolean;
  can_manage?: boolean;
  has_memories?: boolean;
  memory_health_score?: number;
  active_memories_count?: number;
  approved_memories_count?: number;
  memories?: MemoryRecord[];
  memory_sources?: MemorySource[];
  recently_learned?: MemoryRecord[];
  timeline?: MemoryTimelineEvent[];
  usage_examples?: string[];
  privacy_note?: string;
  principle?: string;
};

export const MEMORY_CATEGORY_KEYS = [
  "user_preferences", "team_preferences", "organizational_preferences",
  "companion_preferences", "communication_style", "operational_workflows",
  "approved_processes", "recurring_tasks", "important_dates",
  "business_context", "relationship_context", "knowledge_references",
] as const;

export const MEMORY_SOURCE_KEYS = [
  "user_interaction", "workflow_observation", "organization_profile", "companion_learning",
] as const;

export type CompanionMemoryEngineLabels = {
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
    memoryType: string;
    source: string;
    department: string;
    status: string;
    confidence: string;
    dateFrom: string;
    all: string;
  };
  dashboard: {
    memoryHealthScore: string;
    activeMemories: string;
    approvedMemories: string;
    recentlyLearned: string;
    memorySources: string;
    memoryConfidence: string;
    userApproved: string;
    reviewCenter: string;
    timeline: string;
    usageExamples: string;
    temporaryMemory: string;
    longTermMemory: string;
    organizationalMemory: string;
    userMemory: string;
  };
  review: {
    suggestedMemory: string;
    source: string;
    reason: string;
    confidence: string;
    approvalStatus: string;
    dateLearned: string;
    approve: string;
    reject: string;
    edit: string;
    archive: string;
    delete: string;
  };
  memoryTypes: Record<string, string>;
  memoryScopes: Record<string, string>;
  categories: Record<string, string>;
  sources: Record<string, string>;
  statuses: Record<string, string>;
  confidenceLevels: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    control: string;
    controlAnswer: string;
    delete: string;
    deleteAnswer: string;
  };
};
