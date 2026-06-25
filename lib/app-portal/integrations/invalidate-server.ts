import "server-only";
import { revalidatePath } from "next/cache";

const INTEGRATION_SURFACE_PATHS = [
  "/app/platform/integrations",
  "/app/platform/integrations/connected",
  "/app/platform/integrations/connect",
  "/app/command-center",
] as const;

/** Server-side cache invalidation for integration pages and command center. */
export function revalidateAppPortalIntegrationSurfaces(): void {
  for (const path of INTEGRATION_SURFACE_PATHS) {
    revalidatePath(path);
  }
}
