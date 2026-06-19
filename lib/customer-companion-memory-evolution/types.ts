export type CompanionMemoryEvolutionTab =
  | "overview"
  | "personal_memory"
  | "organization_memory"
  | "preferences"
  | "context"
  | "learning"
  | "memory_governance"
  | "reports"
  | "executive";

export type MemoryItem = {
  memory_key: string;
  memory_title: string;
  memory_category?: string;
  memory_status?: string;
  summary?: string;
  source_label?: string;
};

export type CompanionMemoryEvolutionCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  personal_memory?: MemoryItem[];
  organization_memory?: MemoryItem[];
  preferences?: Record<string, unknown>;
  context?: Record<string, unknown>;
  learning?: Record<string, unknown>;
  memory_governance?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  memory_health?: Record<string, unknown>;
  companion_context_advisor?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionMemoryEvolutionLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<CompanionMemoryEvolutionTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  memoryStatuses: Record<string, string>;
};
