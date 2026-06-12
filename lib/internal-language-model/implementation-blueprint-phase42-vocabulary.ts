export const IMPLEMENTATION_BLUEPRINT_PHASE42_MISSION =
  "Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future.";

export const IMPLEMENTATION_BLUEPRINT_PHASE42_PHILOSOPHY =
  "People invest in outcomes, not features. Demos should inspire confidence through honest, tailored storytelling.";

export const IMPLEMENTATION_BLUEPRINT_PHASE42_ABOS_PRINCIPLE =
  "Aipify Business Operating System (ABOS) demos show how operational AI augments people — humans decide, Aipify informs and prepares.";

export const IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_ENVIRONMENT_KEYS = [
  "small_business",
  "support_focused",
  "executive",
  "commerce",
  "community_platform",
  "enterprise",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_FLOW_STEP_KEYS = [
  "intro",
  "discovery",
  "tailored_demo",
  "qa",
  "summary",
  "next_steps",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_DISCOVERY_CATEGORY_KEYS = [
  "operational_challenges",
  "knowledge_management",
  "repetitive_tasks",
  "success_six_months",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_INDUSTRY_KEYS = [
  "commerce",
  "professional_services",
  "community_platforms",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_CUSTOM_EXPERIENCE_KEYS = [
  "support_first",
  "knowledge_first",
  "executive",
  "commerce",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_LINK_ACCESS_MODES = [
  "read_only",
  "guided",
  "preview",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE42_COMPANION_EXAMPLES = [
  "🌹 Welcome — Aipify works alongside your team in the systems you already use.",
  "🦉 This workflow could be simpler — here is where Aipify prepares and you decide.",
  "🔔 When your team reaches a milestone, Aipify celebrates progress gently — never pressure.",
] as const;

export function getImplementationBlueprintPhase42Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE42_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE42_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE42_ABOS_PRINCIPLE,
    demoEnvironmentKeys: IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_ENVIRONMENT_KEYS,
    demoFlowStepKeys: IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_FLOW_STEP_KEYS,
    discoveryCategoryKeys: IMPLEMENTATION_BLUEPRINT_PHASE42_DISCOVERY_CATEGORY_KEYS,
    industryKeys: IMPLEMENTATION_BLUEPRINT_PHASE42_INDUSTRY_KEYS,
    customExperienceKeys: IMPLEMENTATION_BLUEPRINT_PHASE42_CUSTOM_EXPERIENCE_KEYS,
    demoLinkAccessModes: IMPLEMENTATION_BLUEPRINT_PHASE42_DEMO_LINK_ACCESS_MODES,
    companionExamples: IMPLEMENTATION_BLUEPRINT_PHASE42_COMPANION_EXAMPLES,
    engineRoute: "/app/sales-expert-engine",
    enginePhase: "A.95",
    blueprintPhase: "Phase 42 — Sales Demo & Experience Engine",
    coachEnablementPhase: 45,
    certificationPhase: 46,
    simulationLabRoute: "/app/simulations",
    simulationLabNote: "Strategic what-if — NOT sales demos",
    commercialPackagesPhase42Migration: "20260613000000_commercial_packages_phase42.sql",
    selfLoveRoute: "/app/self-love-engine",
    selfLovePhase: "A.76",
    globalExpansionPhase: 35,
    defaultDemoLinkExpiryHours: 24,
    distinctionNote:
      "Distinct from Commercial Packages Phase 42 — Blueprint Phase 42 Sales Demo extends Sales Expert OS Demo tab. Demo environments and links are metadata scaffolds — no fake live provisioning.",
    honestDemoNotice: "What prospects see is simulated metadata — integrations require customer approval and install.",
  };
}
