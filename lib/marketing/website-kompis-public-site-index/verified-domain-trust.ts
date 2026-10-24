import { normalizePublicHostname, type VerifiedRobotsHostRecord } from "./robots-alias-redirect";

/**
 * A row already stored in customer_domains. A challenge refusal such as
 * hostname_already_verified is not a row and is not accepted here.
 */
export type CustomerDomainTrustRow = {
  customerId: string | null;
  hostname: string | null;
  verificationStatus: string | null;
  status: string | null;
  installId: string | null;
};

/**
 * Hosts that are already verified and active on one exact installation.
 * Same customer without installation_id is not a binding. Pending, failed,
 * disabled, removed, and unverified rows are excluded.
 */
export function selectInstallBoundCustomerDomains(input: {
  customerId: string;
  installId: string;
  rows: readonly CustomerDomainTrustRow[];
}): VerifiedRobotsHostRecord[] {
  const customerId = input.customerId.trim().toLowerCase();
  const installId = input.installId.trim().toLowerCase();
  if (!customerId || !installId) return [];

  const records: VerifiedRobotsHostRecord[] = [];
  for (const row of input.rows) {
    if ((row.customerId ?? "").trim().toLowerCase() !== customerId) continue;
    const boundInstall = (row.installId ?? "").trim().toLowerCase();
    if (!boundInstall || boundInstall !== installId) continue;
    if ((row.verificationStatus ?? "").trim().toLowerCase() !== "verified") continue;
    if ((row.status ?? "").trim().toLowerCase() !== "active") continue;
    const hostname = normalizePublicHostname(row.hostname ?? "");
    if (!hostname) continue;
    records.push({
      hostname,
      verificationStatus: "verified",
      status: "active",
      installId,
    });
  }
  return records;
}
