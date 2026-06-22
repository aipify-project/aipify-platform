import { mapConnectionStatusToSemantic } from "@/lib/install/integration-setup";
import type { AppPortalIntegrationConnection } from "./types";

export type IntegrationHubActionTier = "connected" | "failed" | "pending";

export function resolveIntegrationHubActionTier(
  connection: AppPortalIntegrationConnection
): IntegrationHubActionTier {
  const semantic = mapConnectionStatusToSemantic(connection.status, {
    permissionLevel: connection.permission_level,
    hasCredential: Boolean(connection.masked_credential_hint || connection.id),
    lastTestSuccessAt: connection.last_test_success_at,
    lastTestFailedAt: connection.last_test_failed_at,
    lastTestError: connection.last_test_error,
  });

  if (semantic === "failed") return "failed";
  if (semantic === "connected" || semantic === "read_only") return "connected";
  return "pending";
}
