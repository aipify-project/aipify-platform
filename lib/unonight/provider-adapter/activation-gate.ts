import type {
  ProviderAdapterActivationGate,
  ProviderAdapterGateCheck,
} from "@/lib/integration-intelligence/community/provider-adapter-types";
import {
  UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY,
  UNONIGHT_PROVIDER_ADAPTER_BUSINESS_PACK,
} from "./constants";

export type UnonightActivationGateInput = {
  subscriptionStatus: string | null;
  connectedProviders: readonly string[];
  activeBusinessPacks: readonly string[];
  effectivePermissions: readonly string[];
  communityNetworkEnabled: boolean;
  moderationEngineEnabled: boolean;
  permissionDenied: boolean;
  appEntitlementBlocked: boolean;
  smokeTestPassed: boolean;
};

function isSubscriptionBlocked(status: string | null): boolean {
  if (!status) return false;
  return ["paused", "cancelled", "suspended", "inactive"].includes(status.toLowerCase());
}

function buildCheck(
  gate: ProviderAdapterGateCheck["gate"],
  passed: boolean,
  reasonKey: string | null,
): ProviderAdapterGateCheck {
  return { gate, passed, reason_key: passed ? null : reasonKey };
}

export function evaluateUnonightProviderAdapterActivationGate(
  input: UnonightActivationGateInput,
): ProviderAdapterActivationGate {
  const checks: ProviderAdapterGateCheck[] = [];

  const subscriptionOk = !isSubscriptionBlocked(input.subscriptionStatus);
  checks.push(
    buildCheck(
      "subscription",
      subscriptionOk,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.subscriptionBlocked",
    ),
  );

  const entitlementOk = !input.appEntitlementBlocked;
  checks.push(
    buildCheck(
      "entitlement",
      entitlementOk,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.entitlementBlocked",
    ),
  );

  const providerConnected = input.connectedProviders.includes(UNONIGHT_COMMUNITY_ADAPTER_INTEGRATION_KEY);
  checks.push(
    buildCheck(
      "provider_configuration",
      providerConnected,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.providerNotConnected",
    ),
  );

  const schemaRpcOk =
    !input.permissionDenied && (input.communityNetworkEnabled || input.moderationEngineEnabled);
  checks.push(
    buildCheck(
      "schema_rpc",
      schemaRpcOk,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.schemaUnavailable",
    ),
  );

  const hasReadPermission = input.effectivePermissions.some(
    (permission) =>
      permission === "customer_community.view" ||
      permission === "moderation.view" ||
      permission.startsWith("moderation."),
  );
  checks.push(
    buildCheck(
      "permissions",
      hasReadPermission,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.permissionDenied",
    ),
  );

  checks.push(
    buildCheck(
      "read_only_connection",
      providerConnected,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.readOnlyConnectionMissing",
    ),
  );

  checks.push(
    buildCheck(
      "smoke_test",
      input.smokeTestPassed,
      "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.smokeTestPending",
    ),
  );

  const businessPackOk =
    input.activeBusinessPacks.includes(UNONIGHT_PROVIDER_ADAPTER_BUSINESS_PACK) ||
    input.communityNetworkEnabled ||
    input.moderationEngineEnabled;

  const allRequiredPassed =
    subscriptionOk &&
    entitlementOk &&
    providerConnected &&
    schemaRpcOk &&
    hasReadPermission &&
    businessPackOk;

  if (!allRequiredPassed) {
    const failed = checks.find((check) => !check.passed);
    return {
      status: "disabled",
      reason_key: failed?.reason_key ?? checks[0]?.reason_key ?? null,
      checks,
    };
  }

  if (!input.smokeTestPassed) {
    return {
      status: "activating",
      reason_key: "customerApp.companionPlatformKnowledge.unonightProviderAdapter.gate.activating",
      checks,
    };
  }

  return {
    status: "active",
    reason_key: null,
    checks,
  };
}
