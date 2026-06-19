export type EcosystemCenter = {
  found: boolean;
  error?: string;
  section?: string;
  principle?: string;
  privacy_note?: string;
  executive_dashboard?: Record<string, number | string>;
  stats?: Record<string, number | string>;
  companion_recommendations?: Record<string, unknown>[];
  providers?: Record<string, unknown>[];
  verifications?: Record<string, unknown>[];
  pack_publications?: Record<string, unknown>[];
  pack_licensing?: Record<string, unknown>[];
  certifications?: Record<string, unknown>[];
  marketplace_governance?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  provider_revenue?: Record<string, unknown>[];
  revenue_sharing?: Record<string, unknown>[];
  scorecards?: Record<string, unknown>[];
  support_requirements?: Record<string, unknown>[];
  reports?: Record<string, string>;
  audit_recent?: Record<string, unknown>[];
  rows?: Record<string, unknown>[];
};

export function parseEcosystemCenter(raw: unknown): EcosystemCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  const arr = (key: string) =>
    Array.isArray(row[key]) ? (row[key] as Record<string, unknown>[]) : [];
  const obj = (key: string) =>
    typeof row[key] === "object" && row[key] ? (row[key] as Record<string, number | string>) : {};

  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    executive_dashboard: obj("executive_dashboard"),
    stats: obj("stats"),
    companion_recommendations: arr("companion_recommendations"),
    providers: arr("providers"),
    verifications: arr("verifications"),
    pack_publications: arr("pack_publications"),
    pack_licensing: arr("pack_licensing"),
    certifications: arr("certifications"),
    marketplace_governance: arr("marketplace_governance"),
    reviews: arr("reviews"),
    provider_revenue: arr("provider_revenue"),
    revenue_sharing: arr("revenue_sharing"),
    scorecards: arr("scorecards"),
    support_requirements: arr("support_requirements"),
    reports: typeof row.reports === "object" && row.reports ? (row.reports as Record<string, string>) : {},
    audit_recent: arr("audit_recent"),
    rows: arr("rows"),
  };
}
