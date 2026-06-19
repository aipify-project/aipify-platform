import type { VerifiedProviderCenter } from "./types";

export function parseVerifiedProviderCenter(raw: Record<string, unknown>): VerifiedProviderCenter {
  if (!raw || raw.found === false) {
    return { found: false, error: raw?.error ? String(raw.error) : undefined };
  }

  return {
    found: true,
    principle: raw.principle ? String(raw.principle) : undefined,
    section: raw.section ? String(raw.section) : undefined,
    overview: raw.overview as VerifiedProviderCenter["overview"],
    providers: Array.isArray(raw.providers) ? (raw.providers as Record<string, unknown>[]) : [],
    services: Array.isArray(raw.services) ? (raw.services as Record<string, unknown>[]) : [],
    verifications: Array.isArray(raw.verifications) ? (raw.verifications as Record<string, unknown>[]) : [],
    contracts: Array.isArray(raw.contracts) ? (raw.contracts as Record<string, unknown>[]) : [],
    performance: Array.isArray(raw.performance) ? (raw.performance as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(raw.audit_recent)
      ? (raw.audit_recent as VerifiedProviderCenter["audit_recent"])
      : [],
    provider_categories: Array.isArray(raw.provider_categories)
      ? (raw.provider_categories as string[])
      : [],
    verification_statuses: raw.verification_statuses as Record<string, string>,
    routes: raw.routes as Record<string, string>,
    mobile_access: raw.mobile_access as Record<string, unknown>,
  };
}
