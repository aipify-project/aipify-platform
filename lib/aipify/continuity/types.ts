export const INCIDENT_LEVELS = [1, 2, 3, 4] as const;

export const READINESS_BANDS = [
  "highly_prepared",
  "prepared",
  "improvement_recommended",
  "resilience_concerns",
  "critical_gap",
] as const;

export type ContinuityPlan = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
};

export type CriticalProcess = {
  id: string;
  process_name: string;
  process_key: string;
  criticality_level: string;
  backup?: {
    primary?: string;
    secondary?: string | null;
    tertiary?: string | null;
  } | null;
};

export type IncidentEvent = {
  id: string;
  incident_level: number;
  level_label?: string;
  category: string;
  summary: string;
  status: string;
  created_at?: string;
};

export type RecoveryAction = {
  id: string;
  action_title: string;
  assigned_role_key?: string | null;
  status: string;
};

export type ContinuityCard = {
  has_customer: boolean;
  overall_score?: number;
  readiness_band?: string;
  incident_mode_active?: boolean;
  open_incidents?: number;
  philosophy?: string;
  human_leadership_required?: boolean;
};

export type ContinuityDashboard = {
  has_customer: boolean;
  human_leadership_required?: boolean;
  overall_score?: number;
  readiness_band?: string;
  readiness_components?: Record<string, number>;
  incident_mode?: { active: boolean; incident_id?: string | null; activated_at?: string | null };
  plans: ContinuityPlan[];
  critical_processes: CriticalProcess[];
  incidents: IncidentEvent[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  incident_levels?: Array<{ level: number; label: string }>;
  integrations?: Record<string, string>;
};

export type IncidentDetail = {
  incident: IncidentEvent & { description?: string | null; incident_mode_active?: boolean };
  recovery_actions: RecoveryAction[];
  human_leadership_required?: boolean;
};

export type IncidentModeResult = {
  incident_id?: string;
  incident_mode_active?: boolean;
  incident_level?: number;
  level_label?: string;
  human_leadership_required?: boolean;
  note?: string;
};
