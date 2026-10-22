import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  installationOccupiesLicenseSlot,
  OCCUPYING_INSTALLATION_STATUSES,
} from "@/lib/website-kompis-connection/installation-slot";

/**
 * Returns the installation ids that occupy a license slot.
 * A missing row, a revoked row, or a lookup failure does not count as installed.
 */
export async function occupyingInstallIdSet(
  ids: Array<string | null | undefined>,
): Promise<Set<string>> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  if (unique.length === 0) return new Set();

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("installations")
      .select("id, status, revoked_at")
      .in("id", unique)
      .is("revoked_at", null)
      .in("status", [...OCCUPYING_INSTALLATION_STATUSES]);
    if (error || !Array.isArray(data)) return new Set();

    const occupying = new Set<string>();
    for (const row of data) {
      const record = row as { id?: string; status?: string | null; revoked_at?: string | null };
      if (record.id && installationOccupiesLicenseSlot(record)) occupying.add(record.id);
    }
    return occupying;
  } catch {
    return new Set();
  }
}

export async function filterOccupyingInstallId(
  installId: string | null | undefined,
): Promise<string | null> {
  if (!installId) return null;
  const occupying = await occupyingInstallIdSet([installId]);
  return occupying.has(installId) ? installId : null;
}
