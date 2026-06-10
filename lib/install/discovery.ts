import type {
  BusinessType,
  DetectedSystem,
  DiscoveryFinding,
  EnvironmentDiscoveryResult,
  SkillRecommendation,
  WorkflowArea,
} from "./types";

const BUSINESS_SKILL_MAP: Record<BusinessType, string[]> = {
  saas: [
    "support-assistant",
    "onboarding-assistant",
    "health-monitoring",
    "executive-briefings",
  ],
  ecommerce: [
    "commerce-assistant",
    "billing-monitoring",
    "support-assistant",
    "recommendations-engine",
  ],
  membership_platform: [
    "support-assistant",
    "moderation-assistant",
    "executive-briefings",
    "billing-monitoring",
  ],
  consulting: [
    "executive-briefings",
    "knowledge-assistant",
    "support-assistant",
    "priority-recommendations",
  ],
  hospitality: [
    "support-assistant",
    "faq-assistant",
    "presence-engine",
    "recommendations-engine",
  ],
  education: [
    "onboarding-assistant",
    "faq-assistant",
    "support-assistant",
    "knowledge-assistant",
  ],
  community_platform: [
    "moderation-assistant",
    "support-assistant",
    "presence-engine",
    "executive-briefings",
  ],
  service_business: [
    "support-assistant",
    "billing-monitoring",
    "action-engine",
    "health-monitoring",
  ],
  marketplace: [
    "commerce-assistant",
    "moderation-assistant",
    "billing-monitoring",
    "support-assistant",
  ],
  unknown: [
    "workflow-discovery",
    "integration-detection",
    "health-scanning",
    "installation-guide-assistant",
  ],
};

const SYSTEM_SKILL_MAP: Partial<Record<DetectedSystem, string[]>> = {
  shopify: ["commerce-assistant", "billing-monitoring", "installation-monitoring"],
  woocommerce: ["commerce-assistant", "billing-monitoring"],
  wordpress: ["integration-detection", "system-mapping"],
  supabase: ["health-monitoring", "self-healing-engine"],
  stripe: ["billing-monitoring", "invoice-explanation-assistant"],
  klarna: ["billing-monitoring"],
  resend: ["notifications"],
  hubspot: ["recommendations-engine", "onboarding-assistant"],
};

const WORKFLOW_SKILL_MAP: Partial<Record<WorkflowArea, string>> = {
  customer_support: "customer-support-assistant",
  billing: "billing-monitoring",
  onboarding: "onboarding-assistant",
  marketing: "marketing-assistant",
  membership_management: "moderation-assistant",
  product_management: "commerce-assistant",
  moderation: "moderation-assistant",
  reporting: "executive-briefings",
};

function uniqueSkills(ids: string[]): string[] {
  return [...new Set(ids)];
}

export function recommendSkills(input: {
  businessType: BusinessType;
  systems?: DetectedSystem[];
  workflows?: WorkflowArea[];
}): SkillRecommendation[] {
  const fromBusiness = BUSINESS_SKILL_MAP[input.businessType] ?? [];
  const fromSystems = (input.systems ?? []).flatMap(
    (system) => SYSTEM_SKILL_MAP[system] ?? []
  );
  const fromWorkflows = (input.workflows ?? [])
    .map((workflow) => WORKFLOW_SKILL_MAP[workflow])
    .filter((id): id is string => Boolean(id));

  const ordered = uniqueSkills([...fromBusiness, ...fromSystems, ...fromWorkflows]);

  return ordered.map((skillId, index) => ({
    skillId,
    reason:
      index < fromBusiness.length
        ? `Recommended for ${input.businessType.replace(/_/g, " ")} businesses`
        : "Matched from environment discovery",
    priority: index < 3 ? "high" : index < 6 ? "medium" : "low",
  }));
}

export function inferBusinessType(signals: {
  systems: DetectedSystem[];
  workflows: WorkflowArea[];
}): BusinessType {
  if (signals.systems.includes("shopify") || signals.systems.includes("woocommerce")) {
    return "ecommerce";
  }
  if (
    signals.workflows.includes("membership_management") ||
    signals.workflows.includes("moderation")
  ) {
    return "membership_platform";
  }
  if (signals.workflows.includes("product_management")) {
    return "saas";
  }
  return "unknown";
}

export function buildDiscoveryResult(input: {
  installationId?: string;
  systems: DetectedSystem[];
  workflows: WorkflowArea[];
  automationOpportunities?: string[];
  supportNeeds?: string[];
}): EnvironmentDiscoveryResult {
  const businessType = inferBusinessType({
    systems: input.systems,
    workflows: input.workflows,
  });

  const findings: DiscoveryFinding = {
    businessType,
    confidence: businessType === "unknown" ? 0.45 : 0.78,
    workflows: input.workflows,
    systems: input.systems,
    automationOpportunities: input.automationOpportunities ?? [],
    supportNeeds: input.supportNeeds ?? [],
  };

  return {
    installationId: input.installationId,
    findings,
    recommendations: recommendSkills({
      businessType,
      systems: input.systems,
      workflows: input.workflows,
    }),
    generatedAt: new Date().toISOString(),
  };
}
