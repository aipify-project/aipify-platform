export type KnowledgeCategory =
  | "company_info"
  | "policies"
  | "operational_procedures"
  | "product_knowledge"
  | "support_procedures"
  | "training_content";

export type ConfidenceLevel = "high" | "medium" | "low";

export type HealthLevel = "critical" | "limited" | "operational" | "strong";

export type EkeSettings = {
  employee_assistant_enabled: boolean;
  gap_detection_enabled: boolean;
  onboarding_enabled: boolean;
  improvement_loop_enabled: boolean;
  require_admin_approval: boolean;
  video_support_enabled: boolean;
  privacy_settings: Record<string, unknown>;
};

export type KnowledgeHealth = {
  health_score: number;
  level: HealthLevel;
  health_label: string;
  factors: Record<string, unknown>;
};

export type EmployeeKnowledgeCenter = {
  has_customer: boolean;
  user_role?: string;
  settings?: EkeSettings;
  health?: KnowledgeHealth;
  business_dna_health?: Record<string, unknown>;
  knowledge_items?: Array<Record<string, unknown>>;
  pending_approval?: Array<Record<string, unknown>>;
  most_viewed?: Array<Record<string, unknown>>;
  knowledge_gaps?: Array<Record<string, unknown>>;
  permissions?: Array<Record<string, unknown>>;
  sources?: Array<Record<string, unknown>>;
  onboarding?: Record<string, unknown>;
  recent_updates?: Array<Record<string, unknown>>;
  audit_log?: Array<Record<string, unknown>>;
  categories?: Array<{ id: string; label: string }>;
  ethical_principles?: string[];
  privacy_note?: string;
  integrations?: Record<string, string>;
};

export type EmployeeAnswer = {
  has_customer: boolean;
  enabled?: boolean;
  question?: string;
  answer?: string;
  title?: string;
  category?: string;
  confidence_score?: number;
  confidence_level?: ConfidenceLevel;
  steps?: Array<Record<string, unknown>>;
  source_reference?: string | null;
  related?: Array<Record<string, unknown>>;
  escalate_recommended?: boolean;
  ethical_note?: string;
  supporting_documentation?: string[];
};

export type EmployeeKnowledgeGuidance = {
  detected: boolean;
  category: KnowledgeCategory;
  prompt: string;
  dashboard_path: string;
};
