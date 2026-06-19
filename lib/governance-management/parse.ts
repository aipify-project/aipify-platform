import type { GovernanceCenter, GovernancePolicy } from "./types";

function num(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function parsePolicy(row: Record<string, unknown>): GovernancePolicy {
  return {
    id: String(row.id ?? ""),
    policy_number: String(row.policy_number ?? ""),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? ""),
    status: String(row.status ?? "draft"),
    requires_acknowledgement: row.requires_acknowledgement === true,
    review_date: typeof row.review_date === "string" ? row.review_date : null,
    effective_date: typeof row.effective_date === "string" ? row.effective_date : null,
  };
}

export function parseGovernanceCenter(data: unknown): GovernanceCenter | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (row.found === false) return { found: false };

  const overview = row.overview as Record<string, unknown> | undefined;

  return {
    found: true,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    companion_note: typeof row.companion_note === "string" ? row.companion_note : undefined,
    visibility: row.visibility as GovernanceCenter["visibility"],
    overview: overview
      ? {
          governance_health: num(overview.governance_health),
          open_risks: num(overview.open_risks),
          pending_approvals: num(overview.pending_approvals),
          pending_access_reviews: num(overview.pending_access_reviews),
          active_policies: num(overview.active_policies),
          expiring_policies: num(overview.expiring_policies),
          pending_acknowledgements: num(overview.pending_acknowledgements),
          compliance_attention: num(overview.compliance_attention),
          control_violations_30d: num(overview.control_violations_30d),
        }
      : undefined,
    policies: Array.isArray(row.policies)
      ? (row.policies as Record<string, unknown>[]).map(parsePolicy)
      : [],
    approvals: Array.isArray(row.approvals) ? (row.approvals as Record<string, unknown>[]) : [],
    access_reviews: Array.isArray(row.access_reviews) ? (row.access_reviews as Record<string, unknown>[]) : [],
    compliance: row.compliance as GovernanceCenter["compliance"],
    risks: Array.isArray(row.risks) ? (row.risks as Record<string, unknown>[]) : [],
    controls: Array.isArray(row.controls) ? (row.controls as Record<string, unknown>[]) : [],
    audit_recent: Array.isArray(row.audit_recent)
      ? (row.audit_recent as Record<string, unknown>[]).map((a) => ({
          event_type: String(a.event_type ?? ""),
          event_category: String(a.event_category ?? ""),
          summary: String(a.summary ?? ""),
          created_at: String(a.created_at ?? ""),
        }))
      : [],
    reports: row.reports as Record<string, unknown> | undefined,
    routes: row.routes as Record<string, string> | undefined,
  };
}
