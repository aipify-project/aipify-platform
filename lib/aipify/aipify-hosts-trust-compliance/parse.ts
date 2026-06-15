import { normalizeHostsPlanKey } from "@/lib/aipify/aipify-hosts";
import type { AipifyHostsTrustComplianceCard, AipifyHostsTrustComplianceDashboard } from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsTrustComplianceDashboard(
  data: unknown,
): AipifyHostsTrustComplianceDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;

  const snapshot = (typeof d.trust_snapshot === "object" && d.trust_snapshot
    ? d.trust_snapshot
    : {}) as Record<string, unknown>;

  return {
    has_customer: true,
    enabled: Boolean(d.enabled),
    package_key: normalizeHostsPlanKey(typeof d.package_key === "string" ? d.package_key : undefined),
    property_count: Number(d.property_count ?? 0),
    human_oversight_required: Boolean(d.human_oversight_required ?? true),
    positioning: typeof d.positioning === "string" ? d.positioning : "",
    vision: typeof d.vision === "string" ? d.vision : "",
    modules: asArray(d.modules),
    compliance_areas: asArray(d.compliance_areas),
    house_rule_categories: asArray<string>(d.house_rule_categories),
    safety_areas: asArray<string>(d.safety_areas),
    ethics_principles: asArray<string>(d.ethics_principles),
    governance: (typeof d.governance === "object" && d.governance
      ? d.governance
      : {
          principle: "",
          approval_required: true,
          audit_required: true,
          recommendations_only: true,
        }) as AipifyHostsTrustComplianceDashboard["governance"],
    success_metrics: asArray(d.success_metrics),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    trust_snapshot: {
      trust_score: Number(snapshot.trust_score ?? 0),
      compliance_ready_pct: Number(snapshot.compliance_ready_pct ?? 0),
      safety_completion_pct: Number(snapshot.safety_completion_pct ?? 0),
      attention_required: Number(snapshot.attention_required ?? 0),
      action_overdue: Number(snapshot.action_overdue ?? 0),
      community_concerns: Number(snapshot.community_concerns ?? 0),
    },
    regulatory_alerts: asArray(d.regulatory_alerts),
    executive_metrics: asArray(d.executive_metrics),
  };
}

export function parseAipifyHostsTrustComplianceCard(data: unknown): AipifyHostsTrustComplianceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    enabled: d.enabled !== undefined ? Boolean(d.enabled) : undefined,
    package_key: typeof d.package_key === "string" ? d.package_key : undefined,
    property_count: d.property_count !== undefined ? Number(d.property_count) : undefined,
    human_oversight_required: d.human_oversight_required !== undefined ? Boolean(d.human_oversight_required) : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    route: typeof d.route === "string" ? d.route : undefined,
  };
}
