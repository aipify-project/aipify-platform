import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  CompanionRelationshipRecommendation,
  ExecutiveRelationshipDashboard,
  OrganizationalRelationshipIntelligence,
  RelationshipEntity,
  RelationshipRisk,
  RelationshipSectionKey,
  RelationshipTimelineEvent,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseEntity(raw: unknown): RelationshipEntity {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    entityType: asString(d.entity_type),
    sectionKey: asString(d.section_key, "customer_relationships") as RelationshipSectionKey,
    owner: asString(d.owner ?? d.owner_label),
    department: asString(d.department),
    statusKey: asStatus(d.status_key),
    riskLevel: asString(d.risk_level, "low"),
    lastContactAt: asString(d.last_contact_at) || null,
    openTasks: asNumber(d.open_tasks),
    openSupportCases: asNumber(d.open_support_cases),
    revenueLabel: asString(d.revenue_label) || undefined,
    contractExpiresAt: asString(d.contract_expires_at) || null,
    blockedBy: asString(d.blocked_by) || undefined,
    dependencies: Array.isArray(d.dependencies) ? d.dependencies : [],
    suggestedAction: asString(d.suggested_action) || undefined,
    itemType: "entity",
  };
}

function parseEntities(raw: unknown): RelationshipEntity[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseEntity);
}

function parseRisk(raw: unknown): RelationshipRisk {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    riskType: asString(d.risk_type),
    statusKey: asStatus(d.status_key),
    owner: asString(d.owner ?? d.owner_label),
    suggestedAction: asString(d.suggested_action) || undefined,
    itemType: "risk",
  };
}

function parseTimeline(raw: unknown): RelationshipTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = asRecord(item);
    return {
      id: asString(d.id),
      eventType: asString(d.event_type),
      title: asString(d.title),
      summary: asString(d.summary),
      occurredAt: asString(d.occurred_at) || undefined,
      itemType: "timeline",
    };
  });
}

function parseRecommendation(raw: unknown): CompanionRelationshipRecommendation {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    recommendationType: asString(d.recommendation_type),
    statusKey: asStatus(d.status_key),
    suggestedAction: asString(d.suggested_action) || undefined,
    status: asString(d.status),
    itemType: "recommendation",
  };
}

function parseExecutive(raw: unknown): ExecutiveRelationshipDashboard {
  const d = asRecord(raw);
  return {
    mostImportantCustomers: Array.isArray(d.most_important_customers) ? (d.most_important_customers as Array<Record<string, unknown>>) : [],
    mostImportantVendors: Array.isArray(d.most_important_vendors) ? (d.most_important_vendors as Array<Record<string, unknown>>) : [],
    mostImportantProjects: Array.isArray(d.most_important_projects) ? (d.most_important_projects as Array<Record<string, unknown>>) : [],
    relationshipRisks: asNumber(d.relationship_risks),
    relationshipOpportunities: asNumber(d.relationship_opportunities),
  };
}

export function parseOrganizationalRelationshipIntelligence(raw: unknown): OrganizationalRelationshipIntelligence {
  const d = asRecord(raw);
  if (!d.found) {
    return {
      found: false,
      sections: {
        customerRelationships: [],
        employeeRelationships: [],
        vendorRelationships: [],
        partnerRelationships: [],
        projectRelationships: [],
        dependencyMap: [],
      },
      organizationalRisks: [],
      relationshipTimeline: [],
      companionRecommendations: [],
      executiveDashboard: {
        mostImportantCustomers: [],
        mostImportantVendors: [],
        mostImportantProjects: [],
        relationshipRisks: 0,
        relationshipOpportunities: 0,
      },
      statistics: {
        customerCount: 0,
        employeeCount: 0,
        vendorCount: 0,
        partnerCount: 0,
        projectCount: 0,
        dependencyCount: 0,
        riskCount: 0,
        recommendationCount: 0,
      },
      error: asString(d.error) || undefined,
    };
  }

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    sections: {
      customerRelationships: parseEntities(sections.customer_relationships),
      employeeRelationships: parseEntities(sections.employee_relationships),
      vendorRelationships: parseEntities(sections.vendor_relationships),
      partnerRelationships: parseEntities(sections.partner_relationships),
      projectRelationships: parseEntities(sections.project_relationships),
      dependencyMap: parseEntities(sections.dependency_map),
    },
    organizationalRisks: Array.isArray(d.organizational_risks) ? d.organizational_risks.map(parseRisk) : [],
    relationshipTimeline: parseTimeline(d.relationship_timeline),
    companionRecommendations: Array.isArray(d.companion_recommendations)
      ? d.companion_recommendations.map(parseRecommendation)
      : [],
    executiveDashboard: parseExecutive(d.executive_dashboard),
    statistics: {
      customerCount: asNumber(stats.customer_count),
      employeeCount: asNumber(stats.employee_count),
      vendorCount: asNumber(stats.vendor_count),
      partnerCount: asNumber(stats.partner_count),
      projectCount: asNumber(stats.project_count),
      dependencyCount: asNumber(stats.dependency_count),
      riskCount: asNumber(stats.risk_count),
      recommendationCount: asNumber(stats.recommendation_count),
    },
  };
}

export function parseOrganizationalRelationshipAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
