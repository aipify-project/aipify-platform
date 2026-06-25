import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { revalidatePath } from "next/cache";

const INTEGRATION_SURFACE_PATHS = [
  "/app/platform/integrations",
  "/app/platform/integrations/connected",
  "/app/platform/integrations/connect",
  "/app/command-center",
] as const;

/** Refresh APP integration surfaces after a state-changing action. */
export function refreshAppPortalIntegrationSurfaces(router?: AppRouterInstance): void {
  router?.refresh();
}

/** Server-side cache invalidation for integration pages and command center. */
export function revalidateAppPortalIntegrationSurfaces(): void {
  for (const path of INTEGRATION_SURFACE_PATHS) {
    revalidatePath(path);
  }
}

export function filterActiveHubConnections<T extends { removed_at?: string | null }>(
  connections: T[]
): T[] {
  return connections.filter((connection) => !connection.removed_at);
}
