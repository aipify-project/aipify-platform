export type AuthorizationResourceOwnership =
  | "user_owned_account"
  | "organization_owned_resource"
  | "local_device_permission"
  | "provider_unavailable";

export type AuthorizationConsentType =
  | "personal_oauth"
  | "organization_access_approval"
  | "local_device_permission";

export type ProviderConnectionReadiness =
  | "connected"
  | "adapter_missing"
  | "oauth_required"
  | "permission_required";

export type ProviderAuthorizationDescriptor = {
  provider_key: string;
  resource_ownership: AuthorizationResourceOwnership;
  consent_type: AuthorizationConsentType;
  capability_keys: readonly string[];
  /** Normalized tokens used for query matching — populated from manifests, not customer brands in Core. */
  search_terms: readonly string[];
  connection_readiness: ProviderConnectionReadiness;
  provider_label_key?: string;
};

export type AuthorizationTargetResolution = {
  ownership: AuthorizationResourceOwnership;
  consent_type: AuthorizationConsentType;
  provider_key: string | null;
  capability_key: string | null;
  connection_readiness: ProviderConnectionReadiness;
  confidence: "high" | "moderate" | "low";
  resolution_source: "provider_manifest" | "query_classifier";
};

export const ORGANIZATION_ACCESS_RPC_ERROR_CODES = {
  approverShouldGrantDirectly: "approver_should_grant_directly",
} as const;
