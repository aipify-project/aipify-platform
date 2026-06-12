export const IMPLEMENTATION_BLUEPRINT_PHASE102_MISSION =
  "Streamline product operations via automation, localization, and optimization with strategic oversight.";

export const IMPLEMENTATION_BLUEPRINT_PHASE102_PHILOSOPHY =
  "Automation supports creativity and consistency — humans own strategic decisions.";

export const IMPLEMENTATION_BLUEPRINT_PHASE102_ABOS_PRINCIPLE =
  "Humans in control — Aipify Product Companion prepares import, translation, rewriting, SEO, and category suggestions; humans choose draft, review, or approved publish paths.";

export const IMPLEMENTATION_BLUEPRINT_PHASE102_VISION =
  "We accomplished in minutes what previously required hours.";

export const IMPLEMENTATION_BLUEPRINT_PHASE102_OBJECTIVE_KEYS = [
  "product_import_automation",
  "localization_translation",
  "brand_voice_rewriting",
  "seo_optimization",
  "category_quality_readiness",
  "approval_workflow_integration",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_PRIMARY_LOCALES = ["no", "en", "sv", "da", "de", "fr"] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_PIPELINE_STEPS = [
  "import",
  "translate",
  "rewrite",
  "seo",
  "categories",
  "approval",
  "publish",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_COMPANION_GUIDANCE = [
  "🦉 Imported products are ready for review — shall I prepare a translation summary for your target locales?",
  "🌹 Brand voice rewriting could strengthen these descriptions — would a preview before approval feel helpful?",
  "🔔 SEO and category suggestions are ready — human review is required before publish. Open approvals?",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_APPROVAL_MODES = [
  "draft",
  "human_review",
  "auto_publish",
  "approval_workflows",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_SELF_LOVE_QUOTES = [
  "We accomplished in minutes what previously required hours — without sacrificing quality or strategic judgment.",
  "Batch automation supports your rhythm — pause between bulk runs when the catalog feels overwhelming.",
  "Efficiency is not urgency — prepared products can wait for your review at a human pace.",
] as const;

export const IMPLEMENTATION_BLUEPRINT_PHASE102_VISION_PHRASES = [
  "We accomplished in minutes what previously required hours.",
  "Automation supports creativity and consistency — humans own strategic decisions.",
  "Draft, review, approve — humans in control at every step.",
  "Aipify Product Companion informs and prepares — humans decide when to publish.",
] as const;

export function getImplementationBlueprintPhase102Vocabulary() {
  return {
    mission: IMPLEMENTATION_BLUEPRINT_PHASE102_MISSION,
    philosophy: IMPLEMENTATION_BLUEPRINT_PHASE102_PHILOSOPHY,
    abosPrinciple: IMPLEMENTATION_BLUEPRINT_PHASE102_ABOS_PRINCIPLE,
    vision: IMPLEMENTATION_BLUEPRINT_PHASE102_VISION,
    objectiveKeys: IMPLEMENTATION_BLUEPRINT_PHASE102_OBJECTIVE_KEYS,
    primaryLocales: IMPLEMENTATION_BLUEPRINT_PHASE102_PRIMARY_LOCALES,
    pipelineSteps: IMPLEMENTATION_BLUEPRINT_PHASE102_PIPELINE_STEPS,
    companionGuidance: IMPLEMENTATION_BLUEPRINT_PHASE102_COMPANION_GUIDANCE,
    approvalModes: IMPLEMENTATION_BLUEPRINT_PHASE102_APPROVAL_MODES,
    selfLoveQuotes: IMPLEMENTATION_BLUEPRINT_PHASE102_SELF_LOVE_QUOTES,
    visionPhrases: IMPLEMENTATION_BLUEPRINT_PHASE102_VISION_PHRASES,
    engineRoute: "/app/product-automation",
    enginePhase: "Repo Phase 102",
    blueprintPhase: "Phase 102 — Product Automation Engine",
    companionName: "Product Companion",
    notLabel: "AI product bot",
    commerceIntelligenceDistinction:
      "Commerce Intelligence Blueprint Phase 101 at /app/commerce-intelligence — discovery vs post-approval automation",
    dropshippingDistinction: "Dropshipping Operations Phase 103 at /app/dropshipping-operations — supplier operational cross-link",
    workflowDistinction: "Workflow Orchestration Phase 86 at /app/workflow-orchestration-engine — approval orchestration",
    approvalsRoute: "/app/approvals",
    autoPublishNote: "auto_publish_disabled default true — never silent publish",
    dogfoodingSite: "Sportsklær.no — Shopify, Nordic locales, sport performance rewriting, SEO",
  };
}
