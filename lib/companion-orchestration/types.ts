import type {
  COMPANION_REGISTRY_STATUSES,
  ORCHESTRATION_NOTIFICATION_LEVELS,
  ORCHESTRATION_SENSITIVITY_LEVELS,
} from "./constants";

export type OrchestrationSensitivity = (typeof ORCHESTRATION_SENSITIVITY_LEVELS)[number];
export type OrchestrationNotificationLevel = (typeof ORCHESTRATION_NOTIFICATION_LEVELS)[number];
export type CompanionRegistryStatus = (typeof COMPANION_REGISTRY_STATUSES)[number];

export type OrchestrationSettings = {
  orchestration_enabled: boolean;
  sensitivity: OrchestrationSensitivity | string;
  notification_level: OrchestrationNotificationLevel | string;
  enterprise_policy_mode: string;
};

export type CompanionRegistryEntry = {
  companion_key: string;
  display_label: string;
  status: CompanionRegistryStatus | string;
  priority_level: number;
  usage_count: number;
  effectiveness_score: number;
  recommendation_acceptance_rate: number;
  last_activated_at: string | null;
};

export type OrchestrationEvent = {
  event_key: string;
  request_summary: string | null;
  activated_companion_keys: string[];
  coordinated_response: string;
  conflict_detected: boolean;
  conflict_resolution: string | null;
  priority_applied: number | null;
  created_at: string | null;
};

export type OrchestrationConflict = {
  conflict_key: string;
  companion_a: string;
  companion_b: string;
  conflict_summary: string;
  resolution_status: string;
  resolution_message: string | null;
  created_at: string | null;
};

export type OrchestrationHealthMetrics = {
  active_companions: number;
  total_companions: number;
  orchestration_events_30d: number;
  conflicts_resolved: number;
  avg_effectiveness: number;
  avg_acceptance_rate: number;
  multi_companion_events: number;
};

export type CompanionOrchestrationCenter = {
  settings: OrchestrationSettings | null;
  registry: CompanionRegistryEntry[];
  recent_events: OrchestrationEvent[];
  recent_conflicts: OrchestrationConflict[];
  health_metrics: OrchestrationHealthMetrics | null;
  priority_levels: Array<{ level: number; label: string; description: string }>;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};

export type OrchestrationResult = {
  event_key: string;
  request_summary: string;
  activated_companion_keys: string[];
  coordinated_response: string;
  conflict_detected: boolean;
  conflict_resolution: string | null;
  priority_applied: number | null;
  user_facing_brand: string;
};
