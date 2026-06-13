import type { DISCOVERY_PHASES, READINESS_STATES } from "./constants";

export type DiscoveryPhase = (typeof DISCOVERY_PHASES)[number];
export type ReadinessState = (typeof READINESS_STATES)[number];

export type BusinessDiscoveryProfile = {
  company_name: string | null;
  industry: string | null;
  company_size: string | null;
  primary_language: string | null;
  confidence_score: number;
};

export type BusinessDiscoverySystem = {
  system_key: string;
  system_name: string;
  system_type: string;
  purpose: string | null;
  access_level: string;
  integration_status: string;
  confidence_score: number;
};

export type BusinessDiscoveryKnowledge = {
  source_key: string;
  source_label: string;
  source_type: string;
  item_count: number;
  coverage_score: number;
  status: string;
};

export type BusinessDiscoveryWorkflow = {
  workflow_key: string;
  workflow_name: string;
  workflow_type: string;
  trigger_event: string | null;
  automation_opportunity: boolean;
  confidence_score: number;
};

export type BusinessDiscoveryAction = {
  action_key: string;
  action_label: string;
  action_type: string;
  approval_level: number;
  available: boolean;
  confidence_score: number;
};

export type BusinessDiscoveryReadiness = {
  companion_key: string;
  readiness_state: string;
  confidence_score: number;
};

export type BusinessDiscoveryRecommendation = {
  key: string;
  message: string;
};

export type BusinessDiscoveryCenter = {
  current_phase: DiscoveryPhase;
  overall_readiness: ReadinessState | string;
  introduction_message: string;
  profile: BusinessDiscoveryProfile | null;
  systems: BusinessDiscoverySystem[];
  knowledge: BusinessDiscoveryKnowledge[];
  workflows: BusinessDiscoveryWorkflow[];
  actions: BusinessDiscoveryAction[];
  people: Array<{ team_key: string; team_name: string; roles: unknown }>;
  readiness: BusinessDiscoveryReadiness[];
  recommendations: BusinessDiscoveryRecommendation[];
  recent_audit: Array<{ id: string; event_type: string; summary: string | null; created_at: string }>;
  blueprint: Record<string, unknown> | null;
  can_manage: boolean;
  can_run: boolean;
  privacy_note: string | null;
};
