export const ORGANIZATION_ACCESS_REQUEST_STATUSES = [
  "pending",
  "approved",
  "denied",
  "cancelled",
  "expired",
  "revoked",
] as const;

export type OrganizationAccessRequestStatus = (typeof ORGANIZATION_ACCESS_REQUEST_STATUSES)[number];

export const ORGANIZATION_ACCESS_MODES = ["one_time", "ongoing"] as const;

export type OrganizationAccessMode = (typeof ORGANIZATION_ACCESS_MODES)[number];

export const ORGANIZATION_ACCESS_AUDIT_EVENTS = [
  "request_created",
  "request_approved",
  "request_denied",
  "request_cancelled",
  "request_expired",
  "grant_revoked",
  "duplicate_request_returned",
] as const;

export type OrganizationAccessAuditEvent = (typeof ORGANIZATION_ACCESS_AUDIT_EVENTS)[number];

export type OrganizationProviderScopeDefinition = {
  scope_key: string;
  permission_key: string;
  label_key: string;
  risk_level: 0 | 1 | 2 | 3;
  default_access_mode: OrganizationAccessMode;
  default_duration_hours: number | null;
};

/** Organization access consent models — extended by provider-scope-registry entries. */
export type OrganizationAccessConsentType =
  | "organization_access_approval"
  | "business_pack_entitlement";

export type OrganizationProviderAccessManifest = {
  provider_key: string;
  provider_label_key: string;
  data_type_label_key: string;
  why_needed_label_key: string;
  required_scopes: readonly OrganizationProviderScopeDefinition[];
  resource_ownership?: "organization_owned_resource";
  consent_type?: "organization_access_approval";
  search_terms?: readonly string[];
};

export type OrganizationAccessRequestRecord = {
  id: string;
  organization_id: string;
  requester_user_id: string;
  requester_display_name: string | null;
  provider_key: string;
  capability_key: string | null;
  scope_keys: string[];
  access_mode: OrganizationAccessMode;
  duration_hours: number | null;
  risk_level: number;
  status: OrganizationAccessRequestStatus;
  reason_summary: string;
  context_payload: Record<string, unknown>;
  idempotency_key: string | null;
  approved_by_user_id: string | null;
  denied_by_user_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type OrganizationAccessGrantRecord = {
  id: string;
  organization_id: string;
  user_id: string;
  provider_key: string;
  scope_keys: string[];
  access_mode: OrganizationAccessMode;
  active: boolean;
  granted_from_request_id: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type OrganizationAccessOfferContext = {
  provider_key: string;
  capability_key?: string | null;
  scope_keys: string[];
  access_mode?: OrganizationAccessMode;
  duration_hours?: number | null;
  reason_summary?: string | null;
  context_payload?: Record<string, unknown>;
};
