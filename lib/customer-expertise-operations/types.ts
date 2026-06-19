export type ExpertiseTab =
  | "overview"
  | "expert_directory"
  | "knowledge_owners"
  | "departments"
  | "skills"
  | "projects"
  | "mentors"
  | "reports";

export type ExpertiseCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  expert_directory?: Record<string, unknown>[];
  knowledge_owners?: Record<string, unknown>[];
  critical_knowledge_map?: Record<string, unknown>[];
  mentorship?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  recommendations?: Record<string, unknown>[];
  succession_risks?: Record<string, unknown>[];
  departments?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  skills?: string[];
  executive_dashboard?: Record<string, unknown>;
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type ExpertiseLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ExpertiseTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  riskLevel: Record<string, string>;
  ownershipStatus: Record<string, string>;
  availability: Record<string, string>;
};
