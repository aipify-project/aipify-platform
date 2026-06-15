export type HostsAutomationModuleKey =
  | "arrival_automation"
  | "smart_lock_orchestration"
  | "local_service_coordination"
  | "guest_experience_enhancement"
  | "emergency_response"
  | "recurring_task_automation"
  | "hospitality_playbook"
  | "supply_management"
  | "hospitality_assistant_companion"
  | "approvals_governance";

export type HostsAutomationModule = {
  key: HostsAutomationModuleKey;
  label: string;
  description: string;
};

export type HostsApprovalLevel = {
  level: number;
  label: string;
  description: string;
};

export type HostsPlaybook = {
  key: string;
  label: string;
  steps: string[];
};

export type HostsArrivalReadinessItem = {
  key: string;
  label: string;
  status: "verified" | "pending" | "blocked";
};

export type HostsAutomationRecommendation = {
  key: string;
  label: string;
  approval_level: number;
};

export type HostsOperationalSnapshot = {
  arrivals_today: number;
  departures_today: number;
  pending_tasks: number;
  occupancy_forecast_pct: number;
  pending_approvals: number;
  active_workflows: number;
  low_supply_alerts: number;
};

export type HostsDailyBriefing = {
  greeting: string;
  priorities: string[];
  recommendations: string[];
};

export type AipifyHostsAutomationDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  property_count: number;
  human_oversight_required: boolean;
  positioning: string;
  modules: HostsAutomationModule[];
  approval_levels: HostsApprovalLevel[];
  playbooks: HostsPlaybook[];
  provider_categories: string[];
  supply_categories: string[];
  governance: {
    principle: string;
    approval_required: boolean;
    audit_required: boolean;
    human_oversight_required: boolean;
  };
  success_metrics: { key: string; label: string }[];
  knowledge_categories: string[];
  operational_snapshot: HostsOperationalSnapshot;
  arrival_readiness: HostsArrivalReadinessItem[];
  daily_briefing: HostsDailyBriefing;
  recommendations: HostsAutomationRecommendation[];
};

export type AipifyHostsAutomationCard = {
  has_customer: boolean;
  enabled?: boolean;
  package_key?: string;
  property_count?: number;
  human_oversight_required?: boolean;
  positioning?: string;
  route?: string;
};
