/**
 * Operational configuration readiness — composes existing Core/APP reads.
 * Feature owner: CUSTOMER APP. No Stripe, provision activation, or appearance writes.
 */

import { AGENT_CONTRACT_RULES } from "@/lib/commercial-billing-sales/agent-contracts";
import { WEBSITE_KOMPIS_SITE_PROVISION_LIVE } from "@/lib/website-kompis-connection/provision-gate";
import { readWebsiteKompisAppearanceFailClosed } from "@/lib/website-kompis-appearance";
import type { WebsiteKompisLicenseQuotaRead } from "@/lib/website-kompis-plans/license-quota-read";

export type OperationalConfigSurfaceStatus =
  | "ready"
  | "attention"
  | "blocked"
  | "unavailable"
  | "not_licensed";

export type OperationalConfigurationSnapshot = {
  catalogBrowseRequiresLicense: false;
  operationsRequireActiveEntitlement: true;
  commissionVisibleInApp: false;
  purchaseCtaEnabled: false;
  provisionLive: boolean;
  appearanceWriter: "unavailable" | "ready";
  webQuota: OperationalConfigSurfaceStatus;
  presenceProducerMount: "blocked_needs_agent4_contract";
};

export function resolveWebQuotaSurfaceStatus(
  quota: WebsiteKompisLicenseQuotaRead,
): OperationalConfigSurfaceStatus {
  switch (quota.kind) {
    case "known_plan":
      return quota.acceptsNewAnswers ? "ready" : "attention";
    case "no_module":
      return "not_licensed";
    case "unknown_plan":
      return "attention";
    case "unauthenticated":
      return "blocked";
    case "unavailable":
    default:
      return "unavailable";
  }
}

export function buildOperationalConfigurationSnapshot(input: {
  quota: WebsiteKompisLicenseQuotaRead;
}): OperationalConfigurationSnapshot {
  const appearance = readWebsiteKompisAppearanceFailClosed();
  return {
    catalogBrowseRequiresLicense: AGENT_CONTRACT_RULES.agent2.catalogBrowseRequiresLicense,
    operationsRequireActiveEntitlement:
      AGENT_CONTRACT_RULES.agent2.operationsRequireActiveEntitlement,
    commissionVisibleInApp: AGENT_CONTRACT_RULES.agent2.commissionVisibleInApp,
    purchaseCtaEnabled: AGENT_CONTRACT_RULES.agent2.purchaseCtaFromThisModule,
    provisionLive: WEBSITE_KOMPIS_SITE_PROVISION_LIVE,
    appearanceWriter: appearance.kind === "available" ? "ready" : "unavailable",
    webQuota: resolveWebQuotaSurfaceStatus(input.quota),
    presenceProducerMount: "blocked_needs_agent4_contract",
  };
}
