import type { ActivationGateInput, ActivationGateResult, AccessReasonCode } from "./types";

/**
 * Atomic activation gate — all mandatory checks must pass before a paid/standard
 * module is visible and usable. Payment alone is never sufficient.
 */
export function evaluateActivationGate(input: ActivationGateInput): ActivationGateResult {
  const failedChecks: Array<keyof ActivationGateInput> = [];
  if (!input.paymentOrContractValid) failedChecks.push("paymentOrContractValid");
  if (!input.subscriptionValid) failedChecks.push("subscriptionValid");
  if (!input.licenseValid) failedChecks.push("licenseValid");
  if (!input.moduleAssignmentValid) failedChecks.push("moduleAssignmentValid");
  if (!input.tenantProductValid) failedChecks.push("tenantProductValid");
  if (!input.runtimeCapabilityReady) failedChecks.push("runtimeCapabilityReady");

  if (failedChecks.length === 0) {
    return { open: true, reasonCode: "ok", failedChecks: [] };
  }

  let reasonCode: AccessReasonCode = "activation_gate_incomplete";
  if (failedChecks.includes("moduleAssignmentValid")) reasonCode = "module_inactive";
  else if (failedChecks.includes("licenseValid")) reasonCode = "license_paused";
  else if (failedChecks.includes("subscriptionValid")) reasonCode = "subscription_invalid";
  else if (failedChecks.includes("tenantProductValid")) reasonCode = "product_not_entitled";
  else if (failedChecks.includes("runtimeCapabilityReady")) reasonCode = "module_pending";

  return { open: false, reasonCode, failedChecks };
}

export function isLicenseServiceUsable(
  status: "active" | "grace_period" | "paused" | "unknown"
): boolean {
  return status === "active" || status === "grace_period";
}

export function isSubscriptionUsable(
  status: "active" | "trialing" | "past_due" | "cancelled" | "expired" | "unknown"
): boolean {
  return status === "active" || status === "trialing";
}
