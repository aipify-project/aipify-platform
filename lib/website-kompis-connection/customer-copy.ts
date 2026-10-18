import type { ConnectionStatusSummary } from "@/lib/website-kompis-connection/status-model";

const KNOWN_LICENSE_STATUSES = ["active", "paused", "suspended", "cancelled", "expired"] as const;

export type WebsiteKompisLicenseStatusKey = (typeof KNOWN_LICENSE_STATUSES)[number] | "unknown";

/** Active license chain does not mean the public visitor view is available. */
export function connectionShowsActiveLicenseWithoutPublicView(
  summary: Pick<ConnectionStatusSummary, "aggregate" | "checkpoints">,
): boolean {
  const runtime = summary.checkpoints.find((item) => item.id === "public_runtime");
  return summary.aggregate === "active" && runtime?.state === "unavailable";
}

/** Maps a stored license status to a label key. Unknown values stay off the screen. */
export function websiteKompisLicenseStatusKey(
  status: string | null | undefined,
): WebsiteKompisLicenseStatusKey {
  const key = status?.trim().toLowerCase();
  if (key && (KNOWN_LICENSE_STATUSES as readonly string[]).includes(key)) {
    return key as WebsiteKompisLicenseStatusKey;
  }
  return "unknown";
}
