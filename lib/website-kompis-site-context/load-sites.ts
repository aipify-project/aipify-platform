import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { parseDomainLicenseCenter } from "@/lib/domain-license";
import { readOrganizationDomainCenter, type OrganizationDomainReadClient } from "@/lib/domain-license/read-center";
import { resolveWebsiteKompisCustomerDomainBinding } from "@/lib/marketing/website-kompis-domain-settings-server";
import { sanitizePublicCompanionInstallId } from "@/lib/marketing/public-companion-tenant-faq";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  parseAppOrganizationContext,
  type AppOrganizationContext,
} from "@/lib/tenant/resolve-app-organization-context";
import { resolveWebsiteKompisSiteContextState } from "./filter";
import type { WebsiteKompisOwnedSite, WebsiteKompisSiteContext } from "./types";

async function loadOrgContext(supabase: SupabaseClient): Promise<AppOrganizationContext> {
  const { data } = await supabase.rpc("get_app_organization_context");
  return parseAppOrganizationContext(data);
}

function upsertOwnedSite(
  byInstall: Map<string, WebsiteKompisOwnedSite>,
  candidate: WebsiteKompisOwnedSite,
) {
  const existing = byInstall.get(candidate.installId);
  if (!existing) {
    byInstall.set(candidate.installId, candidate);
    return;
  }
  // Prefer verified+active display domain; keep existing if already primary candidate.
  if (!existing.isPrimaryCandidate && candidate.isPrimaryCandidate) {
    byInstall.set(candidate.installId, candidate);
  }
}

/**
 * Server-owned site list for Kompis Web FAQ scoping.
 * Sources: customer_domains (runtime trust) + organization domain center hostnames.
 * Never invents domains or install ids.
 */
export async function loadWebsiteKompisOwnedSites(
  supabase: SupabaseClient,
  options?: { admin?: OrganizationDomainReadClient },
): Promise<{ context: AppOrganizationContext; sites: WebsiteKompisOwnedSite[] }> {
  const context = await loadOrgContext(supabase);
  if (!context.authenticated || !context.customer_id) {
    return { context, sites: [] };
  }

  const tenantId = context.customer_id;
  const byInstall = new Map<string, WebsiteKompisOwnedSite>();

  try {
    const admin = createServiceRoleClient();
    const { data: customerDomains } = await admin
      .from("customer_domains")
      .select("domain, verification_status, status, installation_id")
      .eq("customer_id", tenantId)
      .neq("status", "removed");

    if (Array.isArray(customerDomains)) {
      for (const row of customerDomains) {
        const record = row as {
          domain?: string;
          verification_status?: string;
          status?: string;
          installation_id?: string | null;
        };
        const installId = sanitizePublicCompanionInstallId(record.installation_id ?? null);
        const domain = typeof record.domain === "string" ? record.domain.trim().toLowerCase() : "";
        if (!installId || !domain) continue;
        const verified =
          record.verification_status === "verified" && record.status === "active";
        upsertOwnedSite(byInstall, {
          installId,
          domain,
          verificationStatus: record.verification_status ?? "pending",
          domainStatus: record.status ?? "pending",
          isPrimaryCandidate: verified,
        });
      }
    }
  } catch {
    // Fall through to organization domain center path only.
  }

  try {
    const center = parseDomainLicenseCenter(await readOrganizationDomainCenter(supabase, options));
    const candidates = [
      ...(center?.active_domains ?? []),
      ...(center?.pending_domains ?? []),
    ];

    for (const row of candidates) {
      const domainName = row.domain?.trim() ?? "";
      if (!domainName) continue;

      const binding = await resolveWebsiteKompisCustomerDomainBinding({
        tenantId,
        domainName,
      });
      if (!binding?.installId) continue;

      const installId = sanitizePublicCompanionInstallId(binding.installId);
      if (!installId) continue;

      const verified =
        binding.verificationStatus === "verified" && binding.domainStatus === "active";
      upsertOwnedSite(byInstall, {
        installId,
        domain: binding.domain,
        verificationStatus: binding.verificationStatus,
        domainStatus: binding.domainStatus,
        isPrimaryCandidate: verified || row.is_primary === true,
      });
    }
  } catch {
    // Keep customer_domains results if org center fails.
  }

  const sites = [...byInstall.values()].sort((a, b) => a.domain.localeCompare(b.domain));
  return { context, sites };
}

export async function resolveWebsiteKompisSiteContextForRequest(
  supabase: SupabaseClient,
  requestedInstallIdRaw: string | null | undefined,
): Promise<WebsiteKompisSiteContext> {
  const requestedInstallId = sanitizePublicCompanionInstallId(requestedInstallIdRaw ?? null);
  const { context, sites } = await loadWebsiteKompisOwnedSites(supabase);

  if (!context.authenticated || context.state === "unauthenticated") {
    return {
      state: "unauthenticated",
      sites: [],
      selectedInstallId: null,
      selectedDomain: null,
      selectionRejected: false,
      visitorIsolation: "partial_null_legacy_shared",
    };
  }

  const resolved = resolveWebsiteKompisSiteContextState(sites, requestedInstallId);
  return {
    ...resolved,
    sites,
    visitorIsolation: "partial_null_legacy_shared",
  };
}
