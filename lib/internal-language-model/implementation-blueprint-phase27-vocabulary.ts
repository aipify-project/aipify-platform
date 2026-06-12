export const IMPLEMENTATION_BLUEPRINT_PHASE27_MISSION =
  "Support financial operations through trusted integrations — assist workflows, never replace accountants.";

export const IMPLEMENTATION_BLUEPRINT_PHASE27_PHILOSOPHY =
  "Collaborate with specialized systems — automation without sacrificing compliance.";

export const IMPLEMENTATION_BLUEPRINT_PHASE27_ABOS_PRINCIPLE =
  "Financial systems work quietly; leaders get clarity when it matters.";

export const IMPLEMENTATION_BLUEPRINT_PHASE27_FINANCIAL_PRINCIPLE_KEYS = [
  "monitor_events",
  "operational_awareness",
  "surface_signals",
  "coordinate_accounting",
  "respect_governance",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE27_PRIMARY_SYSTEMS = ["fiken", "stripe"] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE27_VISION_PHRASES = [
  "Operational companion ensuring financial moments do not go unnoticed — not replacing accountants.",
  "Financial systems work quietly; leaders get clarity when it matters.",
  "Fiken and Stripe remain source of truth — Aipify coordinates awareness and preparation.",
  "Reduce admin burden, improve visibility, minimize surprises — confidence through transparency.",
  "Collaborate with specialized systems — automation without sacrificing compliance.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE27_EXECUTIVE_EXAMPLES = [
  "🦉 Subscription revenue rose — worth a calm review before your executive sync.",
  "🌹 Three invoices await follow-up — Aipify prepared a summary for your review.",
  "🔔 Quarterly revenue milestone approaching — preparation window opens this week.",
  "❤️ Stripe and Fiken integrations are healthy — financial workflows look steady.",
] as const;

export function getImplementationBlueprintPhase27Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE27_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE27_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE27_ABOS_PRINCIPLE,
    financialPrincipleKeys: IMPLEMENTATION_BLUEPRINT_PHASE27_FINANCIAL_PRINCIPLE_KEYS,
    primarySystems: IMPLEMENTATION_BLUEPRINT_PHASE27_PRIMARY_SYSTEMS,
    coordinationModel: "stripe_to_fiken",
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE27_VISION_PHRASES,
    executiveExamples: IMPLEMENTATION_BLUEPRINT_PHASE27_EXECUTIVE_EXAMPLES,
    engineRoute: "/app/integration-engine",
    enginePhase: "Phase A.8",
    blueprintPhase: "Phase 27 — Financial Operations & Accounting Integration Engine",
    fikenDistinction: "Fiken — primary accounting 🇳🇴, source of truth for bookkeeping",
    stripeDistinction: "Stripe — primary payments 💳, payment events and subscription signals",
    billingDistinction:
      "Commercial Packages /app/settings/billing — tenant billing UI, not integration coordination",
    subscriptionDistinction:
      "Subscription Plan Management A.11 — plan modules and trials, not Fiken/Stripe connectors",
    licenseDistinction: "License Center /app/license — subscription status and payment recovery",
    selfLoveBoundary:
      "Self Love reduces admin burden and minimizes surprises — principle only; Integration Engine stores connection metadata.",
  };
}
