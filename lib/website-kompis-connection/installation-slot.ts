/**
 * Statuses that occupy one installation slot.
 * Must match get_customer_license_limits in
 * 20261939300000_website_kompis_license_slot_accounting_v1.sql.
 * pending was renamed to pending_verification. ready is a provisioned install.
 * A revoked row does not occupy a slot.
 */
export const OCCUPYING_INSTALLATION_STATUSES = [
  "pending_verification",
  "ready",
  "installing",
  "active",
  "warning",
] as const;

export type OccupyingInstallationStatus = (typeof OCCUPYING_INSTALLATION_STATUSES)[number];

export function installationOccupiesLicenseSlot(row: {
  status?: string | null;
  revoked_at?: string | null;
}): boolean {
  if (row.revoked_at) return false;
  return (OCCUPYING_INSTALLATION_STATUSES as readonly string[]).includes(row.status ?? "");
}
