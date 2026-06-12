export const IMPLEMENTATION_BLUEPRINT_PHASE34_MISSION =
  "Empower developers to integrate, customize, and build upon Aipify through secure APIs, documentation, and extensibility.";

export const IMPLEMENTATION_BLUEPRINT_PHASE34_PHILOSOPHY =
  "Developers should integrate confidently — governance visible, secrets never stored in plain text, extensibility grows adoption.";

export const IMPLEMENTATION_BLUEPRINT_PHASE34_ABOS_PRINCIPLE =
  "Extensibility increases when developers can build securely upon a platform they trust.";

export const IMPLEMENTATION_BLUEPRINT_PHASE34_SECURITY_PRINCIPLES = [
  "Scoped permissions — least privilege for every API key",
  "Audit logging for all API platform actions",
  "Rate limits by tier — protect tenant and platform stability",
  "Token expiration — keys expire unless renewed",
  "Secure secret handling — prefix/hash and secret_ref only",
  "Human approval required for elevated scopes",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE34_VISION_PHRASES = [
  "Extensibility increases when developers can build securely.",
  "Integrations accelerate adoption when governance is transparent.",
  "Partner capabilities expand when APIs are scoped and auditable.",
  "Developers build confidently when secrets never live in plain text.",
] as const;

export function getImplementationBlueprintPhase34Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE34_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE34_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE34_ABOS_PRINCIPLE,
    securityPrinciples: IMPLEMENTATION_BLUEPRINT_PHASE34_SECURITY_PRINCIPLES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE34_VISION_PHRASES,
    engineRoute: "/app/api-platform-engine",
    enginePhase: "A.21",
    blueprintPhase: "Phase 34 — API & Developer Platform",
    developerPortalRoute: "/developers",
    developerSettingsRoute: "/app/settings/developer",
    appEcosystemRoute: "/app/apps",
    integrationEngineRoute: "/app/integration-engine",
    platformAdminDistinction: "Platform Admin /api/platform/* — Aipify Group AS only, not customer tenant API platform",
  };
}
