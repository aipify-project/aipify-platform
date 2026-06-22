import type { CommunityCapabilityKey } from "./types";
import type { ProviderMetricBinding } from "./metric-contract";

export type { ProviderMetricBinding, ProviderMetricSemanticMatch } from "./metric-contract";
export {
  canPresentMetricBindingAsDirectAnswer,
  resolveMetricBindingForRequest,
  selectPresentableMetricBinding,
} from "./metric-contract";

export type ProviderCapabilityReadinessStatus =
  | "production_ready"
  | "production_ready_candidate"
  | "connected_but_partial"
  | "adapter_missing"
  | "disabled";

export type ProviderAdapterActivationStatus = "active" | "activating" | "disabled";

export type ProviderAdapterGateCheck = {
  gate:
    | "subscription"
    | "entitlement"
    | "provider_configuration"
    | "schema_rpc"
    | "permissions"
    | "read_only_connection"
    | "smoke_test";
  passed: boolean;
  reason_key: string | null;
};

export type ProviderAdapterActivationGate = {
  status: ProviderAdapterActivationStatus;
  reason_key: string | null;
  checks: ProviderAdapterGateCheck[];
};

export type CommunityProviderAdapterRecord = {
  provider: string;
  organization_id: string | null;
  capability_id: string;
  capability_key: CommunityCapabilityKey | string;
  record_type: string;
  count: number | null;
  summary: string | null;
  source_reference: string;
  fetched_at: string;
  freshness: "fresh" | "stale" | "unknown";
  completeness: "complete" | "partial" | "empty";
  permission_scope: string | null;
  warnings: string[];
  metric_bindings?: ProviderMetricBinding[];
};

export type CommunityProviderCapabilityReadiness = {
  capability_id: string;
  capability_key: CommunityCapabilityKey | string;
  status: ProviderCapabilityReadinessStatus;
  reason_key: string | null;
};

export type CommunityExternalProviderAdapterOverlay = {
  provider_key: string;
  integration_provider_key: string;
  organization_id: string | null;
  activation: ProviderAdapterActivationGate;
  records: CommunityProviderAdapterRecord[];
  capability_readiness: CommunityProviderCapabilityReadiness[];
  command_brief_signals: Array<{ signal_key: string; count: number | null }>;
  audit_reference: string;
};
