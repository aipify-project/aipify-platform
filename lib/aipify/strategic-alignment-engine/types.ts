export type StrategicObjective = {
  id?: string;
  objective_name?: string;
  description?: string;
  owner_user_id?: string;
  priority?: string;
  status?: string;
  target_date?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type StrategicObjectiveLink = {
  id?: string;
  objective_id?: string;
  link_type?: string;
  linked_entity_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StrategicReview = {
  id?: string;
  objective_id?: string;
  review_date?: string;
  findings?: string;
  participants_metadata?: Record<string, unknown>;
  org_memory_hook_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StrategicAlignmentSnapshot = {
  id?: string;
  misaligned_initiatives?: unknown[];
  progress_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type StrategicAlignmentEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_objectives?: number;
  misaligned_count?: number;
  [key: string]: unknown;
};

export type StrategicAlignmentEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  objectives?: StrategicObjective[];
  links?: StrategicObjectiveLink[];
  reviews?: StrategicReview[];
  snapshots?: StrategicAlignmentSnapshot[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type StrategicAlignmentReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  objective?: StrategicObjective;
  objectives?: StrategicObjective[];
  links?: StrategicObjectiveLink[];
  reviews?: StrategicReview[];
  snapshots?: StrategicAlignmentSnapshot[];
  summary?: Record<string, unknown>;
  [key: string]: unknown;
};
