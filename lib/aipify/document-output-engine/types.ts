export type OutputTemplate = {
  id?: string;
  template_name?: string;
  template_type?: string;
  output_format?: string;
  version?: number;
  status?: string;
  template_config?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type OutputGeneration = {
  id?: string;
  template_id?: string;
  report_type?: string;
  output_format?: string;
  version?: number;
  generated_by?: string;
  generated_at?: string;
  approval_status?: string;
  delivery_status?: string;
  file_metadata?: Record<string, unknown>;
  source_context?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OutputSchedule = {
  id?: string;
  template_id?: string;
  cadence?: string;
  delivery_method?: string;
  next_run_at?: string;
  status?: string;
  [key: string]: unknown;
};

export type OutputDelivery = {
  id?: string;
  generation_id?: string;
  delivery_method?: string;
  status?: string;
  delivered_at?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type DocumentOutputEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  templates_active?: number;
  generations_count?: number;
  schedules_active?: number;
  pending_delivery?: number;
  [key: string]: unknown;
};

export type DocumentOutputEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  templates?: OutputTemplate[];
  generations?: OutputGeneration[];
  schedules?: OutputSchedule[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};

export type OutputManifestExport = {
  has_organization?: boolean;
  exported_at?: string;
  report_type_filter?: string;
  summary?: Record<string, unknown>;
  generations?: OutputGeneration[];
  deliveries?: OutputDelivery[];
  metadata_only?: boolean;
  [key: string]: unknown;
};

export type GenerateDocumentOutputResult = {
  generation?: OutputGeneration;
  file_metadata?: Record<string, unknown>;
  workflow_hook?: Record<string, unknown>;
  [key: string]: unknown;
};
