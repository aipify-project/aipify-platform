/**
 * Enterprise pricing philosophy — guidance metadata for sales and UI.
 * NOT billing enforcement. Live subscription amounts remain in plans/subscriptions.
 * Spec: AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md
 */

export const PRICING_PHILOSOPHY_PRINCIPLE =
  "Aipify is priced as a Business Operating System — value follows operational scope, outcomes, and trust governance, not token consumption or chat volume.";

export const VALUE_BASED_AVOID = [
  "Per-token or per-message chatbot pricing",
  "Generic AI API meter billing as the primary product",
  "Comparing Aipify to consumer chatbot subscriptions",
  "Usage-only pricing without operational context",
  "Hidden overage traps on intelligence volume",
] as const;

export const VALUE_BASED_PRICE_ON = [
  "Operational scope — installs, domains, users, and licensed modules",
  "Business outcomes — support resolution, knowledge retention, workflow automation",
  "Governance depth — approvals, audit, enterprise security, and SLA",
  "Implementation and change management for Enterprise",
  "Partner-led consulting and onboarding via Sales Experts",
] as const;

export type CustomerSegmentKey = "micro" | "small" | "growth" | "enterprise";

export const CUSTOMER_SEGMENTS: ReadonlyArray<{
  key: CustomerSegmentKey;
  label: string;
  description: string;
  typicalPlanKey: string;
}> = [
  {
    key: "micro",
    label: "Micro & solo operators",
    description:
      "Solo entrepreneurs and micro businesses installing Aipify into one system with light support needs.",
    typicalPlanKey: "starter",
  },
  {
    key: "small",
    label: "Small business",
    description:
      "Growing SMBs automating customer support and preserving institutional knowledge with Aipify Support.",
    typicalPlanKey: "growth",
  },
  {
    key: "growth",
    label: "Growth organizations",
    description:
      "Teams with internal processes, employee knowledge, and cross-functional workflows across multiple installs.",
    typicalPlanKey: "business",
  },
  {
    key: "enterprise",
    label: "Enterprise",
    description:
      "Large organizations requiring governance, executive visibility, dedicated success, and custom deployment.",
    typicalPlanKey: "enterprise",
  },
];

export type PlanPricingGuidanceKey = "starter" | "growth" | "business" | "enterprise";

export const PLAN_PRICING_GUIDANCE: ReadonlyArray<{
  planKey: PlanPricingGuidanceKey;
  packageKey: string;
  planKeyAliases: string[];
  displayName: string;
  usdRangeMonthly: string;
  targetSegment: CustomerSegmentKey;
  features: readonly string[];
}> = [
  {
    planKey: "starter",
    packageKey: "starter",
    planKeyAliases: ["starter"],
    displayName: "Aipify Starter",
    usdRangeMonthly: "$79–$149",
    targetSegment: "micro",
    features: [
      "Aipify Core",
      "Install Engine",
      "Aipify Companion (essential)",
      "Aipify Support (FAQ knowledge)",
      "Human approval mode",
      "Basic analytics",
    ],
  },
  {
    planKey: "growth",
    packageKey: "professional",
    planKeyAliases: ["growth", "professional"],
    displayName: "Aipify Growth",
    usdRangeMonthly: "$199–$399",
    targetSegment: "small",
    features: [
      "Business DNA",
      "Aipify Support (autonomous operations)",
      "Workflow Orchestration",
      "Confidence Engine",
      "Proactive Companion",
      "Support dashboards",
    ],
  },
  {
    planKey: "business",
    packageKey: "business",
    planKeyAliases: ["business"],
    displayName: "Aipify Business",
    usdRangeMonthly: "$499–$999",
    targetSegment: "growth",
    features: [
      "Employee Knowledge Engine",
      "Role-based knowledge access",
      "Onboarding Companion",
      "Knowledge Health",
      "Internal search",
      "Meeting Companion (teams)",
      "Action Center (controlled execution)",
    ],
  },
  {
    planKey: "enterprise",
    packageKey: "enterprise",
    planKeyAliases: ["enterprise"],
    displayName: "Aipify Enterprise",
    usdRangeMonthly: "Custom — typically $1,500+",
    targetSegment: "enterprise",
    features: [
      "All Aipify suites",
      "Executive Insights",
      "Advanced security & audit",
      "SLA agreements",
      "Multi-region options",
      "Dedicated Aipify success",
      "Custom workflows & integrations",
    ],
  },
];

export const ENTERPRISE_IMPLEMENTATION_GUIDANCE = {
  nokRange: "NOK 100,000–500,000+",
  description:
    "Enterprise engagements combine subscription with scoped implementation — discovery, integration, governance design, and rollout.",
  services: [
    "Discovery and operational mapping",
    "Install and domain architecture",
    "Business DNA and knowledge migration",
    "Governance, approvals, and trust policy design",
    "Change management and executive briefing",
    "Training and Sales Expert handoff",
    "Post-launch optimization review",
  ],
} as const;

export const SALES_EXPERT_PRICING_EXAMPLES: ReadonlyArray<{
  service: string;
  nokRange: string;
  note: string;
}> = [
  {
    service: "Discovery meeting & fit assessment",
    nokRange: "NOK 2,500–5,000",
    note: "Independent Sales Expert business — billed separately from Aipify subscription.",
  },
  {
    service: "Implementation project (SMB)",
    nokRange: "NOK 50,000–150,000",
    note: "Scoped install, Business DNA setup, and team onboarding.",
  },
  {
    service: "Enterprise rollout program",
    nokRange: "NOK 150,000–500,000+",
    note: "Multi-site deployment, governance, and executive alignment.",
  },
  {
    service: "Training workshop (half day)",
    nokRange: "NOK 15,000–30,000",
    note: "Role-based training for owners, support, and operations teams.",
  },
  {
    service: "Ongoing advisory retainer",
    nokRange: "NOK 5,000–15,000 / month",
    note: "Quarterly reviews, upgrade recommendations, and optimization.",
  },
];

export const AIPIFY_REVENUE_MODEL = {
  subscriptionRevenue:
    "Recurring SaaS subscription aligned to plan scope — Starter, Growth, Business, and Enterprise.",
  implementationRevenue:
    "Enterprise implementation and partner-led services — separate from core subscription.",
  partnerRevenue:
    "Sales Expert and partner ecosystem commissions on qualified customer relationships.",
  expansionRevenue:
    "Natural upgrades as operational volume, modules, and governance needs grow.",
  principle:
    "Aipify subscription: Customer ↔ Aipify. Consulting and implementation: Customer ↔ Sales Expert.",
} as const;

export const POSITIONING_COMPARISONS: ReadonlyArray<{
  avoid: string;
  prefer: string;
}> = [
  {
    avoid: "AI chatbot with per-message pricing",
    prefer: "Aipify Business Operating System (ABOS) with modular operational suites",
  },
  {
    avoid: "Helpdesk AI add-on",
    prefer: "Aipify Support — installed operational companion inside your systems",
  },
  {
    avoid: "Token meter like a generic LLM API",
    prefer: "Licensed modules and outcomes — support resolution, knowledge, workflows",
  },
  {
    avoid: "Consumer AI subscription",
    prefer: "Professional operations platform with human approval and audit",
  },
];

export const PRICING_SIGNAL_EXPECTATIONS = [
  "Customers expect transparent plan scope — modules, limits, and upgrade paths.",
  "Enterprise buyers expect implementation scoping separate from subscription.",
  "Sales Experts quote implementation in NOK; Aipify quotes subscription in plan currency.",
  "No surprise token overages — intelligence volume is part of operational scope, not a hidden meter.",
  "Upgrade signals follow usage patterns (support volume, employee knowledge, governance needs).",
] as const;

export const ABOS_PRICING_PRINCIPLE =
  "Price Aipify as the Aipify Business Operating System (ABOS) — an install-first operations layer, not a chat interface. Companions (Support, Meeting, Onboarding) are product capabilities, not separate AI tools.";

export const PRICING_VISION_PHRASES = [
  "Organizations pay for operational partnership — not for counting messages.",
  "Value grows as Aipify learns the business and expands across installs.",
  "Enterprise trust requires governance pricing — not cheapest token rates.",
  "Sales Experts extend Aipify with human implementation; subscription stays with Aipify.",
  "Aipify works in the background so businesses can move forward.",
] as const;

export function getPricingPhilosophyMetadata() {
  return {
    principle: PRICING_PHILOSOPHY_PRINCIPLE,
    valueBasedAvoid: VALUE_BASED_AVOID,
    valueBasedPriceOn: VALUE_BASED_PRICE_ON,
    customerSegments: CUSTOMER_SEGMENTS,
    planPricingGuidance: PLAN_PRICING_GUIDANCE,
    enterpriseImplementation: ENTERPRISE_IMPLEMENTATION_GUIDANCE,
    salesExpertExamples: SALES_EXPERT_PRICING_EXAMPLES,
    revenueModel: AIPIFY_REVENUE_MODEL,
    positioningComparisons: POSITIONING_COMPARISONS,
    pricingSignalExpectations: PRICING_SIGNAL_EXPECTATIONS,
    abosPrinciple: ABOS_PRICING_PRINCIPLE,
    visionPhrases: PRICING_VISION_PHRASES,
    doc: "AIPIFY_ENTERPRISE_PRICING_PHILOSOPHY_COMMERCIAL_MODEL.md",
    crossRefs: ["COMMERCIAL_PACKAGES.md", "LICENSE_CENTER.md"],
  };
}
