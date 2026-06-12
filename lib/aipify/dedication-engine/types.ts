export type DedicationPrinciple = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type SignalTypeInfo = {
  key?: string;
  label?: string;
  description?: string;
  [key: string]: unknown;
};

export type BoundaryPhrases = {
  avoid?: string[] | unknown[];
  prefer?: string[] | unknown[];
  [key: string]: unknown;
};

export type DedicationSignal = {
  id?: string;
  signal_type?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type DedicationCommitment = {
  id?: string;
  commitment_type?: string;
  summary?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
};

export type DedicationSettings = {
  organization_id?: string;
  enabled?: boolean;
  persistence_messaging_enabled?: boolean;
  balance_with_self_love?: boolean;
  max_retry_explorations?: number;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  [key: string]: unknown;
};

export type DedicationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  signal_count?: number;
  commitment_count?: number;
  active_commitments?: number;
  enabled?: boolean;
  [key: string]: unknown;
};

export type DedicationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  distinction_note?: string;
  dedication_principles?: DedicationPrinciple[];
  example_phrases?: string[];
  signal_types?: SignalTypeInfo[];
  hard_work_balance_note?: string;
  self_love_note?: string;
  proactive_companion_note?: string;
  trust_note?: string;
  boundary_phrases?: BoundaryPhrases;
  settings?: DedicationSettings;
  recent_signals?: DedicationSignal[];
  active_commitments?: DedicationCommitment[];
  summary?: Record<string, unknown>;
  integration_links?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};

export type DedicationEngineExport = {
  has_organization?: boolean;
  exported_at?: string;
  manifest_type?: string;
  format?: string;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  vision?: string;
  dedication_principles?: DedicationPrinciple[];
  example_phrases?: string[];
  signal_types?: SignalTypeInfo[];
  hard_work_balance_note?: string;
  self_love_note?: string;
  proactive_companion_note?: string;
  trust_note?: string;
  boundary_phrases?: BoundaryPhrases;
  settings?: DedicationSettings;
  recent_signals?: DedicationSignal[];
  active_commitments?: DedicationCommitment[];
  summary?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  [key: string]: unknown;
};
