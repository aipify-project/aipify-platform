import type { PERMISSION_CATEGORIES, PERMISSION_RISK_LEVELS } from "./constants";

export type PermissionCategory = (typeof PERMISSION_CATEGORIES)[number];
export type PermissionRiskLevel = (typeof PERMISSION_RISK_LEVELS)[number];

export type PermissionGrant = {
  grant_key: string;
  resource_name: string;
  permission_label: string;
  category: PermissionCategory | string;
  permission_level: number;
  purpose: string;
  risk_level: PermissionRiskLevel | string;
  granted_by_label: string;
  granted_at: string | null;
  expires_at: string | null;
  expiration_type: string;
  what_aipify_can_do: string | null;
  what_aipify_cannot_do: string | null;
  revoke_instructions: string | null;
  status: string;
  high_impact: boolean;
  last_used_at: string | null;
  created_at: string | null;
};

export type PermissionRequest = {
  request_key: string;
  resource_name: string;
  permission_label: string;
  category: PermissionCategory | string;
  permission_level: number;
  why_needed: string;
  what_aipify_can_do: string;
  what_aipify_cannot_do: string;
  revoke_instructions: string;
  risk_level: PermissionRiskLevel | string;
  status: string;
  expiration_type: string;
  expires_at: string | null;
  created_at: string | null;
};

export type PermissionHistoryEntry = {
  history_key: string;
  resource_name: string;
  event_type: string;
  actor_label: string;
  reason: string | null;
  created_at: string | null;
};

export type PermissionRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type PermissionAccessGovernanceCenter = {
  dashboard: {
    active_count: number;
    recent_granted_count: number;
    high_impact_count: number;
    revoked_count: number;
    pending_requests_count: number;
    companion_active_count: number;
    governance_compliance_rate: number;
    avg_review_days: number;
  } | null;
  active_permissions: PermissionGrant[];
  recent_granted: PermissionGrant[];
  high_impact: PermissionGrant[];
  revoked: PermissionGrant[];
  pending_requests: PermissionRequest[];
  companion_overview: PermissionGrant[];
  recent_history: PermissionHistoryEntry[];
  recommendations: PermissionRecommendation[];
  executive_reporting: Record<string, unknown> | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
