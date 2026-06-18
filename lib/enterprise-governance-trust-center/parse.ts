import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  ApprovalIntelItem,
  AuditEventItem,
  CompanionTrustItem,
  ComplianceItem,
  EnterpriseGovernanceTrustCenter,
  ExecutiveTrustMetric,
  ExplainabilityItem,
  GovernanceApiItem,
  GovernanceFrameworkItem,
  PolicyItem,
  TrustSectionItem,
  TrustSectionKey,
  TrustScoreItem,
  TrustSettings,
  TransparencyItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseSection(raw: unknown): TrustSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "trust_overview") as TrustSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): TrustSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): TrustSettings {
  const d = asRecord(raw);
  return {
    trustCenterEnabled: asBool(d.trust_center_enabled, true),
    transparencyModeEnabled: asBool(d.transparency_mode_enabled, true),
  };
}

function parseFramework(raw: unknown): GovernanceFrameworkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), frameworkArea: asString(d.framework_area), areaName: asString(d.area_name),
    governanceLabel: asString(d.governance_label), statusKey: asStatus(d.status_key), itemType: "framework",
  };
}

function parseTrustScore(raw: unknown): TrustScoreItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), scoreCategory: asString(d.score_category), scoreValue: asString(d.score_value),
    scoreLabel: asString(d.score_label), statusKey: asStatus(d.status_key), itemType: "trust_score",
  };
}

function parsePolicy(raw: unknown): PolicyItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), policyType: asString(d.policy_type), policyName: asString(d.policy_name),
    ruleLabel: asString(d.rule_label), statusKey: asStatus(d.status_key), itemType: "policy",
  };
}

function parseAudit(raw: unknown): AuditEventItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), actorName: asString(d.actor_name), eventAction: asString(d.event_action),
    eventWhat: asString(d.event_what), eventWhy: asString(d.event_why), eventResult: asString(d.event_result),
    approvalHistoryLabel: asString(d.approval_history_label), statusKey: asStatus(d.status_key), itemType: "audit_event",
  };
}

function parseExplain(raw: unknown): ExplainabilityItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), explainType: asString(d.explain_type), title: asString(d.title),
    whyLabel: asString(d.why_label), howLabel: asString(d.how_label), dataUsedLabel: asString(d.data_used_label),
    statusKey: asStatus(d.status_key), itemType: "explainability",
  };
}

function parseCompliance(raw: unknown): ComplianceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), frameworkKey: asString(d.framework_key), frameworkName: asString(d.framework_name),
    complianceStatus: asString(d.compliance_status), outstandingIssues: asString(d.outstanding_issues),
    requiredActions: asString(d.required_actions), statusKey: asStatus(d.status_key), itemType: "compliance",
  };
}

function parseApprovalIntel(raw: unknown): ApprovalIntelItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), intelType: asString(d.intel_type), title: asString(d.title),
    summary: asString(d.summary), statusKey: asStatus(d.status_key), itemType: "approval_intel",
  };
}

function parseExecutive(raw: unknown): ExecutiveTrustMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionTrustItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), explanation: asString(d.explanation),
    contextLabel: asString(d.context_label), status: asString(d.status), itemType: "companion",
  };
}

function parseTransparency(raw: unknown): TransparencyItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), sourceType: asString(d.source_type), sourceName: asString(d.source_name),
    sourceLabel: asString(d.source_label), statusKey: asStatus(d.status_key), itemType: "transparency",
  };
}

function parseApi(raw: unknown): GovernanceApiItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), integrationType: asString(d.integration_type), integrationName: asString(d.integration_name),
    statusLabel: asString(d.status_label), statusKey: asStatus(d.status_key), itemType: "api_integration",
  };
}

const emptyCenter: EnterpriseGovernanceTrustCenter = {
  found: false,
  trustSettings: { trustCenterEnabled: true, transparencyModeEnabled: true },
  governanceFramework: [],
  trustScoreEngine: [],
  policyManagement: [],
  universalAuditLayer: [],
  explainabilityEngine: [],
  complianceCenter: [],
  approvalIntelligence: [],
  executiveTrustDashboard: [],
  companionTrustAdvisor: [],
  enterpriseTransparencyMode: [],
  governanceApis: [],
  sections: {
    trust_overview: [], governance_status: [], compliance_center: [], audit_center: [],
    risk_center: [], approval_center: [], policy_center: [],
  },
  statistics: { frameworkCount: 0, scoreCount: 0, policyCount: 0, auditCount: 0, complianceCount: 0, companionCount: 0 },
};

export function parseEnterpriseGovernanceTrustCenter(raw: unknown): EnterpriseGovernanceTrustCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    trustSettings: parseSettings(d.trust_settings),
    governanceFramework: Array.isArray(d.governance_framework) ? d.governance_framework.map(parseFramework) : [],
    trustScoreEngine: Array.isArray(d.trust_score_engine) ? d.trust_score_engine.map(parseTrustScore) : [],
    policyManagement: Array.isArray(d.policy_management) ? d.policy_management.map(parsePolicy) : [],
    universalAuditLayer: Array.isArray(d.universal_audit_layer) ? d.universal_audit_layer.map(parseAudit) : [],
    explainabilityEngine: Array.isArray(d.explainability_engine) ? d.explainability_engine.map(parseExplain) : [],
    complianceCenter: Array.isArray(d.compliance_center) ? d.compliance_center.map(parseCompliance) : [],
    approvalIntelligence: Array.isArray(d.approval_intelligence) ? d.approval_intelligence.map(parseApprovalIntel) : [],
    executiveTrustDashboard: Array.isArray(d.executive_trust_dashboard) ? d.executive_trust_dashboard.map(parseExecutive) : [],
    companionTrustAdvisor: Array.isArray(d.companion_trust_advisor) ? d.companion_trust_advisor.map(parseCompanion) : [],
    enterpriseTransparencyMode: Array.isArray(d.enterprise_transparency_mode) ? d.enterprise_transparency_mode.map(parseTransparency) : [],
    governanceApis: Array.isArray(d.governance_apis) ? d.governance_apis.map(parseApi) : [],
    sections: {
      trust_overview: parseSections(sections.trust_overview),
      governance_status: parseSections(sections.governance_status),
      compliance_center: parseSections(sections.compliance_center),
      audit_center: parseSections(sections.audit_center),
      risk_center: parseSections(sections.risk_center),
      approval_center: parseSections(sections.approval_center),
      policy_center: parseSections(sections.policy_center),
    },
    statistics: {
      frameworkCount: asNumber(stats.framework_count),
      scoreCount: asNumber(stats.score_count),
      policyCount: asNumber(stats.policy_count),
      auditCount: asNumber(stats.audit_count),
      complianceCount: asNumber(stats.compliance_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseEnterpriseGovernanceTrustAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
