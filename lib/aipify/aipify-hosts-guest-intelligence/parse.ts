import { normalizeHostsPlanKey } from "@/lib/aipify/aipify-hosts";
import type {
  AipifyHostsGuestIntelligenceCard,
  AipifyHostsGuestIntelligenceDashboard,
} from "./types";

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parseAipifyHostsGuestIntelligenceDashboard(
  data: unknown,
): AipifyHostsGuestIntelligenceDashboard | null {
  const d = (data ?? {}) as Record<string, unknown>;
  if (!d.has_customer) return null;

  const loyalty = (typeof d.loyalty_snapshot === "object" && d.loyalty_snapshot
    ? d.loyalty_snapshot
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
    segments: asArray(d.segments),
    journey_stages: asArray(d.journey_stages),
    feedback_categories: asArray<string>(d.feedback_categories),
    governance: (typeof d.governance === "object" && d.governance
      ? d.governance
      : {
          principle: "",
          approval_required: true,
          audit_required: true,
          data_minimization: true,
          no_raw_chat: true,
        }) as AipifyHostsGuestIntelligenceDashboard["governance"],
    success_metrics: asArray(d.success_metrics),
    knowledge_categories: asArray<string>(d.knowledge_categories),
    loyalty_snapshot: {
      overall_satisfaction: Number(loyalty.overall_satisfaction ?? 0),
      repeat_guest_pct: Number(loyalty.repeat_guest_pct ?? 0),
      returning_guests: Number(loyalty.returning_guests ?? 0),
      at_risk_guests: Number(loyalty.at_risk_guests ?? 0),
      loyalty_opportunities: Number(loyalty.loyalty_opportunities ?? 0),
    },
    guest_insights: asArray(d.guest_insights),
    executive_metrics: asArray(d.executive_metrics),
  };
}

export function parseAipifyHostsGuestIntelligenceCard(data: unknown): AipifyHostsGuestIntelligenceCard {
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
