export type KnowledgeNetworkTab =
  | "overview"
  | "knowledge_assets"
  | "lessons_learned"
  | "playbooks"
  | "best_practices"
  | "experience"
  | "companion"
  | "executive"
  | "reports";

export type KnowledgeAsset = {
  id: string;
  asset_key?: string;
  title: string;
  asset_type?: string;
  department_label?: string;
  summary?: string;
  review_status?: string;
  usage_count?: number;
};

export type KnowledgeLesson = {
  id: string;
  lesson_key?: string;
  title: string;
  category?: string;
  outcome?: string;
  recommendation?: string;
  review_status?: string;
};

export type KnowledgeNetworkCenter = {
  found: boolean;
  principle?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  knowledge_assets?: KnowledgeAsset[];
  lessons_learned_engine?: KnowledgeLesson[];
  experience_library?: Record<string, unknown>[];
  playbook_engine?: Record<string, unknown>[];
  best_practice_engine?: Record<string, unknown>[];
  decision_knowledge_base?: Record<string, unknown>[];
  knowledge_graph_integration?: Record<string, unknown>;
  organizational_wisdom_score?: Record<string, unknown>;
  knowledge_retention_engine?: Record<string, unknown>[];
  meeting_intelligence?: Record<string, unknown>[];
  companion_learning_engine?: Record<string, unknown>[];
  department_knowledge_centers?: Record<string, unknown>[];
  business_pack_integration?: Record<string, unknown>[];
  knowledge_recommendations?: Record<string, unknown>[];
  companion_advisor?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type KnowledgeNetworkLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  accessDenied: string;
  tabs: Record<KnowledgeNetworkTab, string>;
  overview: {
    knowledgeAssets: string;
    lessonsLearned: string;
    playbooks: string;
    bestPractices: string;
    experienceEntries: string;
    wisdomScore: string;
    wisdomStatus: string;
    retentionPending: string;
    reviewsDue: string;
  };
  actions: {
    refreshWisdomScore: string;
    addLesson: string;
    publishPlaybook: string;
    contributeExperience: string;
    startRetentionCapture: string;
    markReviewed: string;
    openLessons: string;
    openExperience: string;
    openKnowledgeGraph: string;
  };
  wisdomStatuses: Record<string, string>;
  lessonsPage: { title: string; subtitle: string };
  experiencePage: { title: string; subtitle: string };
};
