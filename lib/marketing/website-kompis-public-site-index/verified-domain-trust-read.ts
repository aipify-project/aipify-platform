import "server-only";

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import type { CustomerDomainTrustRow } from "./verified-domain-trust";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Read-only lookup of customer_domains already bound to the installation that
 * platform trust resolved. Authenticated clients cannot select this table.
 * The service role is used only after that server-side resolution, filtered to
 * the same customer and installation, and this function never writes.
 * A null installation_id does not match the filter.
 */
export async function readInstallBoundCustomerDomainRows(input: {
  customerId: string;
  installId: string;
}): Promise<CustomerDomainTrustRow[]> {
  const customerId = input.customerId.trim();
  const installId = input.installId.trim();
  if (!UUID.test(customerId) || !UUID.test(installId)) return [];

  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("customer_domains")
    .select("customer_id, domain, verification_status, status, installation_id")
    .eq("customer_id", customerId)
    .eq("installation_id", installId)
    .eq("verification_status", "verified")
    .eq("status", "active")
    .limit(32);

  if (error || !Array.isArray(data)) return [];

  return data.map((row) => {
    const record = row as {
      customer_id?: string | null;
      domain?: string | null;
      verification_status?: string | null;
      status?: string | null;
      installation_id?: string | null;
    };
    return {
      customerId: record.customer_id ?? null,
      hostname: record.domain ?? null,
      verificationStatus: record.verification_status ?? null,
      status: record.status ?? null,
      installId: record.installation_id ?? null,
    };
  });
}
