export type RetentionPolicy = {
  id?: string;
  policy_name?: string;
  record_category?: string;
  retention_period_value?: number;
  retention_period_unit?: string;
  archive_required?: boolean;
  disposal_method?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type ArchivedRecord = {
  id?: string;
  policy_id?: string;
  source_entity_type?: string;
  source_entity_id?: string;
  archived_at?: string;
  version?: number;
  metadata?: Record<string, unknown>;
  restored_at?: string | null;
  expires_at?: string | null;
  policy_name?: string;
  record_category?: string;
  disposal_method?: string;
  [key: string]: unknown;
};

export type RecordDisposalRequest = {
  id?: string;
  archived_record_id?: string;
  status?: string;
  approved_by?: string | null;
  disposed_at?: string | null;
  disposal_log?: Record<string, unknown>;
  requested_by?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type RecordsRetentionManagementEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  active_policies?: number;
  archived_records?: number;
  pending_disposals?: number;
  expiring_soon?: number;
  [key: string]: unknown;
};

export type RecordsRetentionManagementEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  policies?: RetentionPolicy[];
  archived_records?: ArchivedRecord[];
  disposal_requests?: RecordDisposalRequest[];
  compliance?: Record<string, unknown>;
  upcoming_expirations?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
