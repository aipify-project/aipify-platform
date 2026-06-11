export type InstallationStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";

export type InstallStep =
  | "welcome"
  | "platform_detection"
  | "domain_verification"
  | "system_connection"
  | "environment_discovery"
  | "permission_review"
  | "skill_recommendations"
  | "activation_complete";

export type DiscoveryType = "platform" | "integration" | "role" | "capability" | "workflow";

export type OrganizationInstallation = {
  id: string;
  organization_id?: string;
  installation_status?: InstallationStatus | string;
  current_step?: InstallStep | string;
  completion_percentage?: number;
  system_type?: string | null;
  domain?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type InstallDiscoveryResult = {
  id: string;
  discovery_type?: DiscoveryType | string;
  entity_key?: string;
  entity_label?: string | null;
  confidence_score?: number;
  status?: string;
  created_at?: string;
};

export type InstallRecommendation = {
  id: string;
  recommendation_type?: string;
  recommendation_key?: string;
  recommendation_label?: string | null;
  priority?: number;
  status?: string;
  rationale?: string | null;
  created_at?: string;
};

export type InstallPermissionReview = {
  id: string;
  permission_key?: string;
  permission_label?: string | null;
  risk_level?: string;
  review_status?: string;
  reviewed_at?: string | null;
};

export type InstallSummary = {
  completion_percentage?: number;
  installation_status?: string;
  current_step?: string;
  pending_permissions?: number;
  pending_recommendations?: number;
  discoveries?: number;
};

export type AipifyInstallEngineCard = {
  has_organization: boolean;
  completion_percentage?: number;
  installation_status?: string;
  current_step?: string;
  philosophy?: string;
};

export type AipifyInstallEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  install_engine_note?: string;
  principles?: string[];
  installation?: OrganizationInstallation;
  steps?: string[];
  summary?: InstallSummary;
  discoveries: InstallDiscoveryResult[];
  recommendations: InstallRecommendation[];
  permission_reviews: InstallPermissionReview[];
  install_engine_integration?: Record<string, unknown>;
};
