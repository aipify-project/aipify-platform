export type MaturityAssessment = {
  id?: string;
  domain?: string;
  maturity_level?: number;
  assessment_summary?: string;
  assessed_by?: string;
  assessed_at?: string;
  criteria_scores?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MaturityRoadmap = {
  id?: string;
  domain?: string;
  recommendations?: unknown[];
  learning_requirements?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type MaturityReport = {
  id?: string;
  report_type?: string;
  exported_at?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type CapabilityMaturityEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  assessed_domains?: number;
  average_maturity_level?: number;
  active_roadmaps?: number;
  [key: string]: unknown;
};

export type CapabilityMaturityEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  assessments?: MaturityAssessment[];
  roadmaps?: MaturityRoadmap[];
  reports?: MaturityReport[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  maturity_labels?: Record<string, string>;
  [key: string]: unknown;
};

export type MaturityReportExport = {
  has_organization?: boolean;
  exported_at?: string;
  report_type?: string;
  assessments?: MaturityAssessment[];
  roadmaps?: MaturityRoadmap[];
  summary?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};
