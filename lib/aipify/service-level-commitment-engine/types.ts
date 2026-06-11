export type ServiceCommitmentRecord = {
  id?: string;
  commitment_name?: string;
  commitment_type?: string;
  target_value?: number;
  measurement_unit?: string;
  severity_scope?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ServiceCommitmentPerformanceRecord = {
  id?: string;
  commitment_id?: string;
  period?: string;
  compliance_rate?: number;
  missed_count?: number;
  average_value?: number;
  trend_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ServiceCommitmentAlertRecord = {
  id?: string;
  commitment_id?: string;
  alert_type?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type ServiceLevelCommitmentEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_commitments?: number;
  open_alerts?: number;
  [key: string]: unknown;
};

export type ServiceLevelCommitmentEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  commitments?: ServiceCommitmentRecord[];
  performance?: ServiceCommitmentPerformanceRecord[];
  alerts?: ServiceCommitmentAlertRecord[];
  compliance_summary?: Record<string, unknown>;
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type ServiceCommitmentReportExportPayload = {
  id?: string;
  report_type?: string;
  exported_at?: string;
  metadata?: Record<string, unknown>;
  privacy_note?: string;
  [key: string]: unknown;
};
