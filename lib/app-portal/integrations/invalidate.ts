import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/** Refresh APP integration surfaces after a state-changing action. */
export function refreshAppPortalIntegrationSurfaces(router?: AppRouterInstance): void {
  router?.refresh();
}

export function filterActiveHubConnections<T extends { removed_at?: string | null }>(
  connections: T[]
): T[] {
  return connections.filter((connection) => !connection.removed_at);
}
