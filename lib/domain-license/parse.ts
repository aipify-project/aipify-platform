import type { DomainLicenseCenter, DomainOption } from "./types";

export function parseDomainLicenseCenter(data: unknown): DomainLicenseCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };
  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    structure: typeof row.structure === "string" ? row.structure : undefined,
    primary_domain_id: typeof row.primary_domain_id === "string" ? row.primary_domain_id : undefined,
    license_summary: row.license_summary as DomainLicenseCenter["license_summary"],
    active_domains: Array.isArray(row.active_domains) ? (row.active_domains as DomainLicenseCenter["active_domains"]) : [],
    pending_domains: Array.isArray(row.pending_domains) ? (row.pending_domains as DomainLicenseCenter["pending_domains"]) : [],
    installed_packs: Array.isArray(row.installed_packs) ? (row.installed_packs as DomainLicenseCenter["installed_packs"]) : [],
    supported_platforms: Array.isArray(row.supported_platforms) ? (row.supported_platforms as string[]) : [],
    store_route: typeof row.store_route === "string" ? row.store_route : undefined,
    domain_license_product_route: typeof row.domain_license_product_route === "string" ? row.domain_license_product_route : undefined,
  };
}

export function parseDomainOptions(data: unknown): DomainOption[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  const list = row.available_domains ?? row.domains;
  if (!Array.isArray(list)) return [];
  return list as DomainOption[];
}
