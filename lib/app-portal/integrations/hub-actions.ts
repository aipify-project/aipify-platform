import {
  connectionToCanonicalInput,
  resolveCanonicalHubActionTier,
  resolveIntegrationCanonicalStatus,
  type IntegrationHubActionTier,
} from "./canonical-status";
import type { AppPortalIntegrationConnection } from "./types";

export type { IntegrationHubActionTier };

export function resolveIntegrationHubActionTier(
  connection: AppPortalIntegrationConnection
): IntegrationHubActionTier {
  const canonical = resolveIntegrationCanonicalStatus(connectionToCanonicalInput(connection));
  return resolveCanonicalHubActionTier(canonical);
}
