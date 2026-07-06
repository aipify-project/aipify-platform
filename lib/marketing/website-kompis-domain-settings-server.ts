import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type ServiceRoleClient = Pick<SupabaseClient, "from">;

export type WebsiteKompisCustomerDomainBinding = {
  customerDomainId: string;
  domain: string;
  verificationStatus: string;
  domainStatus: string;
  installId: string | null;
};

async function resolveInstallIdForDomain(
  admin: ServiceRoleClient,
  tenantId: string,
  domain: string,
  installationId: string | null,
): Promise<string | null> {
  if (installationId) {
    return installationId;
  }

  const { data: installs, error } = await admin
    .from("installations")
    .select("id, site_url, customer_id, company_id")
    .is("revoked_at", null)
    .in("status", ["ready", "installing", "active", "warning"]);

  if (error || !Array.isArray(installs)) {
    return null;
  }

  const normalizedDomain = domain.trim().toLowerCase();
  for (const row of installs) {
    const record = row as {
      id?: string;
      site_url?: string | null;
      customer_id?: string | null;
      company_id?: string | null;
    };
    if (!record.id || !record.site_url) continue;
    if (record.customer_id && record.customer_id !== tenantId) continue;
    const siteDomain = record.site_url
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      ?.trim()
      .toLowerCase();
    if (siteDomain === normalizedDomain) {
      return record.id;
    }
  }

  return null;
}

export async function resolveWebsiteKompisCustomerDomainBinding(input: {
  tenantId: string;
  domainName: string;
}): Promise<WebsiteKompisCustomerDomainBinding | null> {
  let admin: ServiceRoleClient;
  try {
    admin = createServiceRoleClient();
  } catch {
    return null;
  }

  const normalizedDomain = input.domainName.trim().toLowerCase();
  const { data, error } = await admin
    .from("customer_domains")
    .select("id, domain, verification_status, status, installation_id")
    .eq("customer_id", input.tenantId)
    .eq("domain", normalizedDomain)
    .neq("status", "removed")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as {
    id?: string;
    domain?: string;
    verification_status?: string;
    status?: string;
    installation_id?: string | null;
  };

  if (!record.id || !record.domain) {
    return null;
  }

  const installId = await resolveInstallIdForDomain(
    admin,
    input.tenantId,
    record.domain,
    record.installation_id ?? null,
  );

  return {
    customerDomainId: record.id,
    domain: record.domain,
    verificationStatus: record.verification_status ?? "pending",
    domainStatus: record.status ?? "pending",
    installId,
  };
}

export async function loadWebsiteKompisInstallIdForTenantDomain(input: {
  tenantId: string;
  domainName: string;
}): Promise<string | null> {
  const binding = await resolveWebsiteKompisCustomerDomainBinding(input);
  return binding?.installId ?? null;
}
