export const IMPLEMENTATION_BLUEPRINT_PHASE113_MISSION =
  "Trusted Companion Marketplace and Digital Employee provisioning — digital coworkers that augment teams, never replace human accountability.";

export const IMPLEMENTATION_BLUEPRINT_PHASE113_PHILOSOPHY =
  "People First. Technology Second. Companionship before replacement. Companions are trusted digital coworkers — NOT chatbots.";

export const IMPLEMENTATION_BLUEPRINT_PHASE113_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) — Companion Marketplace deploys governed digital employees with explicit permissions, escalation paths, and audit. Aipify informs and prepares; humans approve activation.";

export const IMPLEMENTATION_BLUEPRINT_PHASE113_VISION =
  "Every team has trusted digital coworkers — and humans remain in charge.";

export const IMPLEMENTATION_BLUEPRINT_PHASE113_OBJECTIVE_KEYS = [
  "trusted_companions",
  "digital_employees",
  "governed_deployment",
  "enterprise_center",
  "health_monitoring",
  "collaboration_rules",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE113_DEPLOYMENT_STEPS = [
  "Browse Companion Marketplace categories",
  "Review profile — capabilities, risk, maturity",
  "Review permissions and required integrations",
  "Review governance layer assignment (1–5)",
  "Assign scope — team, department, owner",
  "Configure integrations — read-only first",
  "Define escalation paths",
  "Activate — human approval required",
  "Monitor health metrics and directory",
  "Optimize — review recommendations and governance alerts",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_ADAPTATION = [
  "🦉 Review permissions before pilot — context before activation feels wise?",
  "🌹 Gradual adoption — start with one Knowledge Companion, not catalog anxiety.",
  "🔔 Governance layer 2 fits this role — ready to assign scope and define escalation?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE113_LIMITATION_FORBIDDEN = [
  "Autonomous decision-making without human approval",
  "Impersonation in customer or employee communications",
  "Replacement framing — Companions augment, not substitute",
  "High-risk Companion auto-deployment bypassing governance",
  "Raw chat or PII in health, audit, or directory metadata",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE113_GOVERNANCE_LAYERS = [
  "L1 Observation — read-only",
  "L2 Recommendation — human approval",
  "L3 Assisted Action — human confirmation",
  "L4 Operational Automation — pre-approved low-risk",
  "L5 Enterprise Restricted — enhanced controls, executive visibility",
] as const;

export function getImplementationBlueprintPhase113Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE113_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE113_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE113_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE113_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE113_OBJECTIVE_KEYS,
    deploymentSteps: IMPLEMENTATION_BLUEPRINT_PHASE113_DEPLOYMENT_STEPS,
    companionAdaptation: IMPLEMENTATION_BLUEPRINT_PHASE113_COMPANION_ADAPTATION,
    limitationForbidden: IMPLEMENTATION_BLUEPRINT_PHASE113_LIMITATION_FORBIDDEN,
    governanceLayers: IMPLEMENTATION_BLUEPRINT_PHASE113_GOVERNANCE_LAYERS,
    engineRoute: "/app/companion-marketplace",
    enginePhase: "Repo Phase 113 Companion Marketplace & Digital Employee Engine",
    blueprintPhase: "Phase 113 — Companion Marketplace & Digital Employee Engine",
    skillsMarketplaceDistinction: "Skills Marketplace Blueprint 112 at /app/marketplace — skills and extensions, not digital employees",
    skillStoreDistinction: "Skill Store Phase 63 at /app/skills — individual skill installation engine",
    commerceCompanionDistinction: "Commerce Companion Phase 110 at /app/commerce-companion — commerce-specific unified hub",
    marketplaceGovernanceDistinction:
      "Marketplace Governance Phase 90 at /app/marketplace-governance — QA cross-link",
    trustActionDistinction: "Trust & Action Phase 30 at /app/approvals — permission approval for activation",
    twoFactorDistinction: "Two-Factor Authentication at /app/settings/two-factor — mandatory for privileged Companion roles",
  };
}
