export type IncidentRecord = {
  id?: string;
  incident_title?: string;
  incident_type?: string;
  severity?: string;
  status?: string;
  owner_user_id?: string;
  detected_at?: string;
  resolved_at?: string;
  root_cause_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type IncidentTimelineEvent = {
  id?: string;
  incident_id?: string;
  event_type?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type IncidentCommunication = {
  id?: string;
  incident_id?: string;
  communication_type?: string;
  content_metadata?: Record<string, unknown>;
  released_at?: string;
  [key: string]: unknown;
};

export type IncidentLessonLearned = {
  id?: string;
  incident_id?: string;
  summary?: string;
  recommendations?: unknown[];
  org_memory_hook_metadata?: Record<string, unknown>;
  created_at?: string;
  [key: string]: unknown;
};

export type IncidentResponseCoordinationEngineCard = {
  has_organization: boolean;
  philosophy?: string;
  open_incidents?: number;
  critical_open?: number;
  [key: string]: unknown;
};

export type IncidentResponseCoordinationEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  principles?: string[];
  summary?: Record<string, unknown>;
  incidents?: IncidentRecord[];
  timeline_events?: IncidentTimelineEvent[];
  communications?: IncidentCommunication[];
  lessons_learned?: IncidentLessonLearned[];
  executive_summary?: Record<string, unknown>;
  integration_notes?: Record<string, string>;
  integration_summaries?: Record<string, unknown>;
  [key: string]: unknown;
};
